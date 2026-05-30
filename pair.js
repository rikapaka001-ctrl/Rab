const express = require('express');
const fs = require('fs-extra');
const path = require('path');
const pino = require('pino');
const config = require('./config');
const axios = require('axios');
const mongoose = require('mongoose');

const {
    default: makeWASocket,
    useMultiFileAuthState,
    DisconnectReason,
    getContentType,
    fetchLatestBaileysVersion,
    makeCacheableSignalKeyStore,
    jidNormalizedUser,
    generateWAMessageFromContent,
    generateForwardMessageContent
} = require('@whiskeysockets/baileys');

const {
    getBuffer,
    getGroupAdmins
} = require('./lib/functions');

const { sms } = require('./lib/msg');

const NodeCache = require('node-cache');
const util = require('util');

const app = express();

const PORT = process.env.PORT || 3000;

const SESSION_BASE_PATH = './sessions';

const msgRetryCounterCache = new NodeCache();

require('events').EventEmitter.defaultMaxListeners = 500;

// ===============================
// MONGODB
// ===============================

const MONGODB_URI =
process.env.MONGODB_URI ||
'mongodb+srv://cloud25588_db_user:RQxEbZhj74uGOtb4@cluster0.pptbqdr.mongodb.net/newdtzm01?appName=Cluster0';

mongoose.connect(MONGODB_URI)
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => console.log('❌ MongoDB Error:', err));

// ===============================
// SESSION MODEL
// ===============================

const SessionSchema = new mongoose.Schema({
    sessionId: String,
    data: Object
});

const Session = mongoose.model('Session', SessionSchema);

// ===============================
// LOAD PLUGINS
// ===============================

fs.readdirSync("./plugins/").forEach((plugin) => {

    if (path.extname(plugin).toLowerCase() === ".js") {
        require("./plugins/" + plugin);
    }

});

console.log('✅ Plugins Loaded');

const events = require('./command');

const commandMap = new Map();

for (const cmd of events.commands) {

    if (cmd.pattern) {
        commandMap.set(cmd.pattern, cmd);
    }

    if (cmd.alias) {

        for (const alias of cmd.alias) {

            if (!commandMap.has(alias)) {
                commandMap.set(alias, cmd);
            }

        }
    }
}

app.use(express.static(path.join(__dirname, 'public')));

// ===============================
// SOCKETS
// ===============================

const activeSockets = {};
const keepAliveTimers = {};
const reconnectTimers = {};
const saveDebounceTimers = {};
const fileCache = {};

// ===============================
// CLEANUP
// ===============================

function cleanupSession(sessionId) {

    if (keepAliveTimers[sessionId]) {
        clearInterval(keepAliveTimers[sessionId]);
        delete keepAliveTimers[sessionId];
    }

    if (reconnectTimers[sessionId]) {
        clearTimeout(reconnectTimers[sessionId]);
        delete reconnectTimers[sessionId];
    }

    if (saveDebounceTimers[sessionId]) {
        clearTimeout(saveDebounceTimers[sessionId]);
        delete saveDebounceTimers[sessionId];
    }

    const sock = activeSockets[sessionId];

    if (sock) {

        try {

            sock.ev.removeAllListeners();
            sock.ws?.terminate?.();

        } catch {}

        delete activeSockets[sessionId];
    }
}

// ===============================
// RESTORE SESSION
// ===============================

async function restoreSession(sessionId, sessionPath) {

    try {

        const session = await Session.findOne({ sessionId });

        if (!session) return false;

        await fs.ensureDir(sessionPath);

        for (const file in session.data) {

            await fs.writeFile(
                path.join(sessionPath, file),
                session.data[file]
            );

        }

        console.log('✅ Restored:', sessionId);

        return true;

    } catch (err) {

        console.error('Restore Error:', err);

        return false;
    }
}

// ===============================
// SAVE SESSION
// ===============================

async function saveSession(sessionId, sessionPath) {

    try {

        const files = await fs.readdir(sessionPath);

        let data = {};

        let hasChanges = false;

        for (const file of files) {

            try {

                const content = await fs.readFile(
                    path.join(sessionPath, file),
                    'utf-8'
                );

                const cacheKey = `${sessionId}:${file}`;

                if (fileCache[cacheKey] !== content) {

                    fileCache[cacheKey] = content;

                    hasChanges = true;
                }

                data[file] = content;

            } catch {}

        }

        if (!hasChanges) return;

        await Session.findOneAndUpdate(
            { sessionId },
            { data },
            { upsert: true }
        );

        console.log('💾 Session Saved:', sessionId);

    } catch (err) {

        console.error('Save Error:', err);

    }
}

function debouncedSaveSession(sessionId, sessionPath) {

    if (saveDebounceTimers[sessionId]) {
        clearTimeout(saveDebounceTimers[sessionId]);
    }

    saveDebounceTimers[sessionId] = setTimeout(async () => {

        delete saveDebounceTimers[sessionId];

        await saveSession(sessionId, sessionPath);

    }, 5000);
}

// ===============================
// MAIN PAIR FUNCTION
// ===============================

async function Pair(number, res = null) {

    const xnumber = number.replace(/[^0-9]/g, '');

    const sessionId =
    `${config.SESSION_ID_PREFIX || 'rika_'}${xnumber}`;

    const sessionPath =
    path.join(SESSION_BASE_PATH, sessionId);

    // FORCE CLEAN OLD SOCKET

    if (activeSockets[sessionId]) {

        try {

            activeSockets[sessionId].ev.removeAllListeners();
            activeSockets[sessionId].ws?.close?.();

        } catch {}

        delete activeSockets[sessionId];

    }

    try {

        await restoreSession(sessionId, sessionPath);

        await fs.ensureDir(sessionPath);

        const { state, saveCreds } =
        await useMultiFileAuthState(sessionPath);

        const { version } =
        await fetchLatestBaileysVersion();

        const logger =
        pino({ level: 'silent' });

        const sock = makeWASocket({

            version,

            logger,

            auth: {
                creds: state.creds,
                keys: makeCacheableSignalKeyStore(
                    state.keys,
                    logger
                )
            },

            printQRInTerminal: false,

            syncFullHistory: false,

            connectTimeoutMs: 60000,

            defaultQueryTimeoutMs: 30000,

            keepAliveIntervalMs: 30000,

            generateHighQualityLinkPreview: true,

            msgRetryCounterCache

        });

        activeSockets[sessionId] = sock;

        // ===============================
        // FILE URL
        // ===============================

        sock.sendFileUrl = async (
            jid,
            url,
            caption,
            quoted,
            options = {}
        ) => {

            const r = await axios.head(url);

            const mime = r.headers['content-type'];

            if (mime.split("/")[0] === "image") {

                return sock.sendMessage(jid, {
                    image: await getBuffer(url),
                    caption,
                    ...options
                }, { quoted });

            }

            if (mime.split("/")[0] === "video") {

                return sock.sendMessage(jid, {
                    video: await getBuffer(url),
                    caption,
                    mimetype: 'video/mp4',
                    ...options
                }, { quoted });

            }

            if (mime.split("/")[0] === "audio") {

                return sock.sendMessage(jid, {
                    audio: await getBuffer(url),
                    mimetype: 'audio/mpeg',
                    ...options
                }, { quoted });

            }

        };

        // ===============================
        // FORWARD
        // ===============================

        sock.forwardMessage = async (
            jid,
            message,
            forceForward = false,
            options = {}
        ) => {

            let mtype =
            Object.keys(message.message)[0];

            let content =
            await generateForwardMessageContent(
                message,
                forceForward
            );

            let ctype =
            Object.keys(content)[0];

            let context =
            mtype !== "conversation"
            ? message.message[mtype].contextInfo
            : {};

            content[ctype].contextInfo = {
                ...context,
                ...content[ctype].contextInfo
            };

            const waMessage =
            await generateWAMessageFromContent(
                jid,
                content,
                options
            );

            await sock.relayMessage(
                jid,
                waMessage.message,
                {
                    messageId: waMessage.key.id
                }
            );

            return waMessage;
        };

        // ===============================
        // PAIR CODE
        // ===============================

        let pairingCode = null;

        if (!sock.authState.creds.registered) {

            await new Promise(r => setTimeout(r, 3000));

            pairingCode =
            await sock.requestPairingCode(xnumber);

            console.log('Pair Code:', pairingCode);

            if (res && !res.headersSent) {

                res.json({
                    code: pairingCode
                });

            }

        } else {

            if (res && !res.headersSent) {

                res.json({
                    error: 'Already paired'
                });

            }
        }

        // ===============================
        // SAVE CREDS
        // ===============================

        sock.ev.on('creds.update', async () => {

            await saveCreds();

            debouncedSaveSession(
                sessionId,
                sessionPath
            );

        });

        // ===============================
        // CONNECTION UPDATE
        // ===============================

        sock.ev.on('connection.update', async (update) => {

            const {
                connection,
                lastDisconnect
            } = update;

            if (connection === 'close') {

                const statusCode =
                lastDisconnect?.error?.output?.statusCode;

                const isLoggedOut =
                statusCode === DisconnectReason.loggedOut;

                cleanupSession(sessionId);

                if (activeSockets[sessionId]) {
                    delete activeSockets[sessionId];
                }

                if (!isLoggedOut) {

                    reconnectTimers[sessionId] =
                    setTimeout(() => {

                        Pair(number);

                    }, 5000);

                } else {

                    await Session.findOneAndDelete({
                        sessionId
                    });

                    await fs.remove(sessionPath);
                }

            } else if (connection === 'open') {

                console.log('✅ Connected:', sessionId);

                keepAliveTimers[sessionId] =
                setInterval(async () => {

                    if (!activeSockets[sessionId]) {

                        clearInterval(
                            keepAliveTimers[sessionId]
                        );

                        return;
                    }

                    sock.sendPresenceUpdate(
                        'available',
                        sock.user.id
                    ).catch(() => {});

                }, 30000);

                try {

                    const jid =
                    xnumber + '@s.whatsapp.net';

                    await sock.sendMessage(jid, {
                        text:
`✅ Bot Connected Successfully

Bot: ${config.BOT_NAME}
Mode: ${config.MODE}
Prefix: ${config.PREFIX}`
                    });

                } catch {}

            }

        });

        // ===============================
        // MESSAGE SYSTEM
        // ===============================

        sock.ev.on('messages.upsert', async (mek) => {

            try {

                mek = mek.messages[0];

                if (!mek.message) return;

                mek.message =
                getContentType(mek.message)
                === 'ephemeralMessage'
                ? mek.message.ephemeralMessage.message
                : mek.message;

                // ===============================
                // STATUS SYSTEM
                // ===============================

                if (
                    mek.key &&
                    mek.key.remoteJid === 'status@broadcast'
                ) {

                    if (config.AUTO_READ_STATUS) {

                        await sock.readMessages([
                            mek.key
                        ]);

                    }

                    if (config.AUTO_REACT) {

                        await sock.sendMessage(
                            mek.key.remoteJid,
                            {
                                react: {
                                    text:
                                    config.REACT_EMOJIS[
                                        Math.floor(
                                            Math.random() *
                                            config.REACT_EMOJIS.length
                                        )
                                    ],
                                    key: mek.key
                                }
                            }
                        );

                    }

                    return;
                }

                const m = sms(sock, mek);

                const type =
                getContentType(mek.message);

                const from =
                mek.key.remoteJid;

                const body =
                type === 'conversation'
                ? mek.message.conversation
                :
                type === 'extendedTextMessage'
                ? mek.message.extendedTextMessage.text
                :
                type === 'imageMessage'
                ? mek.message.imageMessage.caption || ''
                :
                type === 'videoMessage'
                ? mek.message.videoMessage.caption || ''
                :
                '';

                const prefix =
                config.PREFIX;

                const isCmd =
                body.startsWith(prefix);

                const command =
                isCmd
                ? body.slice(prefix.length)
                    .trim()
                    .split(' ')
                    .shift()
                    .toLowerCase()
                : '';

                const args =
                body.trim().split(/ +/).slice(1);

                const q =
                args.join(' ');

                const isGroup =
                from.endsWith('@g.us');

                const sender =
                mek.key.fromMe
                ? (
                    sock.user.id.split(':')[0] +
                    '@s.whatsapp.net'
                )
                :
                (
                    mek.key.participant ||
                    mek.key.remoteJid
                );

                const senderNumber =
                sender.split('@')[0];

                const botNumber =
                sock.user.id.split(':')[0];

                const botNumber2 =
                await jidNormalizedUser(sock.user.id);

                const pushname =
                mek.pushName || 'User';

                const isMe =
                botNumber.includes(senderNumber);

                const isOwner =
                isMe ||
                senderNumber === config.OWNER_NUMBER;

                const isReact =
                m.message?.reactionMessage
                ? true
                : false;

                const quoted =
                type === 'extendedTextMessage' &&
                mek.message.extendedTextMessage
                .contextInfo != null
                ? mek.message.extendedTextMessage
                    .contextInfo.quotedMessage || []
                : [];

                // ===============================
                // GROUP DATA
                // ===============================

                let groupMetadata = null;

                if (isGroup) {

                    try {

                        groupMetadata =
                        await sock.groupMetadata(from);

                    } catch {

                        groupMetadata = null;

                    }

                }

                const groupName =
                isGroup && groupMetadata
                ? groupMetadata.subject
                : '';

                const participants =
                isGroup && groupMetadata
                ? groupMetadata.participants
                : [];

                const groupAdmins =
                isGroup
                ? getGroupAdmins(participants)
                : [];

                const isBotAdmins =
                isGroup
                ? groupAdmins.includes(botNumber2)
                : false;

                const isAdmins =
                isGroup
                ? groupAdmins.includes(sender)
                : false;

                const reply = async (text) => {

                    return await sock.sendMessage(
                        from,
                        { text },
                        { quoted: mek }
                    );

                };

                // ===============================
                // MODE SYSTEM
                // ===============================

                if (
                    config.MODE === 'private' &&
                    !isOwner
                ) {
                    return;
                }

                if (
                    config.MODE === 'inbox' &&
                    isGroup
                ) {
                    return;
                }

                if (
                    config.MODE === 'groups' &&
                    !isGroup
                ) {
                    return;
                }

                // ===============================
                // READ COMMANDS
                // ===============================

                if (isCmd) {
                    await sock.readMessages([mek.key]);
                }

                // ===============================
                // AUTO REACT
                // ===============================

                if (
                    config.AUTO_REACT &&
                    !isMe &&
                    !isReact &&
                    Math.random() < 0.3
                ) {

                    const emojis =
                    config.REACT_EMOJIS;

                    sock.sendMessage(from, {
                        react: {
                            text:
                            emojis[
                                Math.floor(
                                    Math.random() *
                                    emojis.length
                                )
                            ],
                            key: mek.key
                        }
                    }).catch(() => {});

                }

                // ===============================
                // AUTO TYPING
                // ===============================

                if (
                    config.AUTO_TYPING &&
                    !isMe &&
                    !isCmd
                ) {

                    sock.sendPresenceUpdate(
                        'composing',
                        from
                    ).catch(() => {});

                    setTimeout(() => {

                        sock.sendPresenceUpdate(
                            'paused',
                            from
                        ).catch(() => {});

                    }, 2000);
                }

                // ===============================
                // COMMANDS
                // ===============================

                const cmdName =
                isCmd
                ? body.slice(prefix.length)
                    .trim()
                    .split(' ')[0]
                    .toLowerCase()
                : false;

                if (isCmd) {

                    const cmd =
                    commandMap.get(cmdName);

                    if (cmd) {

                        if (cmd.react) {

                            sock.sendMessage(from, {
                                react: {
                                    text: cmd.react,
                                    key: mek.key
                                }
                            });

                        }

                        try {

                            await cmd.function(
                                sock,
                                mek,
                                m,
                                {
                                    from,
                                    prefix,
                                    quoted,
                                    body,
                                    isCmd,
                                    command,
                                    args,
                                    q,
                                    isGroup,
                                    sender,
                                    senderNumber,
                                    botNumber2,
                                    botNumber,
                                    pushname,
                                    isMe,
                                    isOwner,
                                    groupMetadata,
                                    groupName,
                                    participants,
                                    groupAdmins,
                                    isBotAdmins,
                                    isAdmins,
                                    reply
                                }
                            );

                        } catch (e) {

                            console.error(
                                '[PLUGIN ERROR]',
                                cmd.pattern,
                                e
                            );

                        }

                    }

                }

                // ===============================
                // BODY COMMANDS
                // ===============================

                for (const cmd of events.commands) {

                    try {

                        if (
                            body &&
                            cmd.on === 'body'
                        ) {

                            await cmd.function(
                                sock,
                                mek,
                                m,
                                {
                                    from,
                                    prefix,
                                    quoted,
                                    body,
                                    isCmd,
                                    command,
                                    args,
                                    q,
                                    isGroup,
                                    sender,
                                    senderNumber,
                                    botNumber2,
                                    botNumber,
                                    pushname,
                                    isMe,
                                    isOwner,
                                    groupMetadata,
                                    groupName,
                                    participants,
                                    groupAdmins,
                                    isBotAdmins,
                                    isAdmins,
                                    reply
                                }
                            );

                        }

                    } catch (e) {

                        console.error(
                            '[CMD ERROR]',
                            cmd.pattern,
                            e
                        );

                    }

                }

                // ===============================
                // DEFAULT COMMANDS
                // ===============================

                switch (command) {

                    case 'jid':

                        reply(from);

                        break;

                    case 'ev':

                        if (isOwner) {

                            try {

                                let result =
                                await eval(q);

                                reply(
                                    util.format(result)
                                );

                            } catch (err) {

                                reply(
                                    util.format(err)
                                );

                            }

                        }

                        break;

                    default:
                        break;

                }

            } catch (e) {

                console.error(
                    '[MESSAGE ERROR]',
                    String(e)
                );

            }

        });

    } catch (err) {

        console.error('Pair Error:', err);

        cleanupSession(sessionId);

        if (res && !res.headersSent) {

            res.json({
                error:
                'Pair failed: ' +
                err.message
            });

        }

    }
}

// ===============================
// RESTORE ALL SESSIONS
// ===============================

async function restoreAllSessions() {

    try {

        const sessions =
        await Session.find();

        console.log(
            `Restoring ${sessions.length} session(s)`
        );

        await Promise.all(

            sessions.map(async (s, index) => {

                const number =
                s.sessionId.replace(
                    config.SESSION_ID_PREFIX ||
                    'rika_',
                    ''
                );

                await new Promise(
                    r => setTimeout(r, index * 500)
                );

                await Pair(number);

            })

        );

    } catch (err) {

        console.error(
            'Restore Error:',
            err
        );

    }
}

// ===============================
// ROUTES
// ===============================

app.get('/pair', async (req, res) => {

    const number = req.query.number;

    if (!number) {

        return res.json({
            error: 'Number required'
        });

    }

    res.setTimeout(30000, () => {

        if (!res.headersSent) {

            res.json({
                error: 'Request timeout'
            });

        }

    });

    await Pair(number, res);

});

app.get('/', (req, res) => {

    res.send('RIKA XMD RUNNING');

});

// ===============================
// START SERVER
// ===============================

app.listen(PORT, async () => {

    console.log(
        `Server running on ${PORT}`
    );

    await fs.ensureDir(
        SESSION_BASE_PATH
    );

    await restoreAllSessions();

});

// ===============================
// ERROR HANDLER
// ===============================

process.on('uncaughtException', (err) => {

    const e = String(err);

    if (e.includes('Socket connection timeout')) return;
    if (e.includes('rate-overlimit')) return;
    if (e.includes('Connection Closed')) return;
    if (e.includes('Value not found')) return;

    console.log('Caught Exception:', err);

});
