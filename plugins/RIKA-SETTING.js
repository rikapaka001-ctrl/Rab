const config = require('../config');
const { cmd } = require('../command');
const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, '../config.js');

// ===============================
// SAVE CONFIG (FIXED)
// ===============================
function saveConfig() {

    const newConfig =
`module.exports = ${JSON.stringify(config, null, 4)};`;

    fs.writeFileSync(configPath, newConfig);

    // reload config in memory
    delete require.cache[require.resolve('../config')];
    Object.assign(config, require('../config'));
}

// ===============================
// OWNER CHECK
// ===============================
function isOwner(senderNumber, conn) {

    const botNumber = conn.user.id.split(':')[0];

    return (
        senderNumber === config.OWNER_NUMBER ||
        senderNumber === botNumber
    );
}

// ===============================
// AUTO STATUS READ
// ===============================
cmd({
    pattern: 'autostatusread',
    desc: 'Turn Auto Status Read ON/OFF',
    category: 'settings',
    react: '👁️'
},
async(conn, mek, m, { args, reply, senderNumber }) => {

    if (!isOwner(senderNumber, conn)) return reply('❌ OWNER ONLY');

    if (!args[0]) {
        return reply(
`Current Status:
${config.AUTO_READ_STATUS ? 'ON ✅' : 'OFF ❌'}

Example:
.autostatusread on`
        );
    }

    const option = args[0].toLowerCase();

    if (option === 'on') {
        config.AUTO_READ_STATUS = true;
        saveConfig();
        return reply('✅ AUTO STATUS READ ENABLED');
    }

    if (option === 'off') {
        config.AUTO_READ_STATUS = false;
        saveConfig();
        return reply('❌ AUTO STATUS READ DISABLED');
    }

    reply('Use ON or OFF');
});


// ===============================
// AUTO REACT
// ===============================
cmd({
    pattern: 'autoreact',
    desc: 'Turn Auto React ON/OFF',
    category: 'settings',
    react: '❤️'
},
async(conn, mek, m, { args, reply, senderNumber }) => {

    if (!isOwner(senderNumber, conn)) return reply('❌ OWNER ONLY');

    if (!args[0]) {
        return reply(
`Current Status:
${config.AUTO_REACT ? 'ON ✅' : 'OFF ❌'}

Example:
.autoreact on`
        );
    }

    const option = args[0].toLowerCase();

    if (option === 'on') {
        config.AUTO_REACT = true;
        saveConfig();
        return reply('✅ AUTO REACT ENABLED');
    }

    if (option === 'off') {
        config.AUTO_REACT = false;
        saveConfig();
        return reply('❌ AUTO REACT DISABLED');
    }

    reply('Use ON or OFF');
});


// ===============================
// AUTO TYPING
// ===============================
cmd({
    pattern: 'autotyping',
    desc: 'Turn Auto Typing ON/OFF',
    category: 'settings',
    react: '⌨️'
},
async(conn, mek, m, { args, reply, senderNumber }) => {

    if (!isOwner(senderNumber, conn)) return reply('❌ OWNER ONLY');

    if (!args[0]) {
        return reply(
`Current Status:
${config.AUTO_TYPING ? 'ON ✅' : 'OFF ❌'}

Example:
.autotyping on`
        );
    }

    const option = args[0].toLowerCase();

    if (option === 'on') {
        config.AUTO_TYPING = true;
        saveConfig();
        return reply('✅ AUTO TYPING ENABLED');
    }

    if (option === 'off') {
        config.AUTO_TYPING = false;
        saveConfig();
        return reply('❌ AUTO TYPING DISABLED');
    }

    reply('Use ON or OFF');
});


// ===============================
// 🔥 AUTO RECORDING (ADDED FIXED VERSION)
// ===============================
cmd({
    pattern: 'autorecording',
    desc: 'Turn Auto Recording ON/OFF',
    category: 'settings',
    react: '🎙️'
},
async(conn, mek, m, { args, reply, senderNumber }) => {

    if (!isOwner(senderNumber, conn)) return reply('❌ OWNER ONLY');

    if (!args[0]) {
        return reply(
`Current Status:
${config.AUTO_RECORDING ? 'ON ✅' : 'OFF ❌'}

Example:
.autorecording on`
        );
    }

    const option = args[0].toLowerCase();

    if (option === 'on') {
        config.AUTO_RECORDING = true;
        saveConfig();
        return reply('🎙️ AUTO RECORDING ENABLED');
    }

    if (option === 'off') {
        config.AUTO_RECORDING = false;
        saveConfig();
        return reply('🎙️ AUTO RECORDING DISABLED');
    }

    reply('Use ON or OFF');
});


// ===============================
// PREFIX CHANGE
// ===============================
cmd({
    pattern: 'setprefix',
    desc: 'Change Bot Prefix',
    category: 'settings',
    react: '⚙️'
},
async(conn, mek, m, { args, reply, senderNumber }) => {

    if (!isOwner(senderNumber, conn)) return reply('❌ OWNER ONLY');

    if (!args[0]) {
        return reply(
`Current Prefix:
${config.PREFIX}

Example:
.setprefix .`
        );
    }

    config.PREFIX = args[0];
    saveConfig();

    reply(`✅ PREFIX CHANGED TO ${args[0]}`);
});


// ===============================
// MODE CHANGE
// ===============================
cmd({
    pattern: 'mode',
    desc: 'Change Bot Mode',
    category: 'settings',
    react: '🛡️'
},
async(conn, mek, m, { args, reply, senderNumber }) => {

    if (!isOwner(senderNumber, conn)) return reply('❌ OWNER ONLY');

    if (!args[0]) {
        return reply(
`Current Mode:
${config.WORK_TYPE}

Modes:
public | private | inbox | groups`
        );
    }

    const mode = args[0].toLowerCase();

    const allowed = ['public','private','inbox','groups'];

    if (!allowed.includes(mode)) return reply('❌ INVALID MODE');

    config.WORK_TYPE = mode;
    saveConfig();

    reply(`✅ MODE CHANGED TO ${mode}`);
});


// ===============================
// SETTINGS VIEW
// ===============================
cmd({
    pattern: 'settings',
    desc: 'Show Bot Settings',
    category: 'settings',
    react: '⚡'
},
async(conn, mek, m, { reply }) => {

    const text = `
╭━━〔 ${config.BOT_NAME} SETTINGS 〕━━⬣

⚙️ PREFIX : ${config.PREFIX}
🛡️ MODE : ${config.WORK_TYPE}

🎙️ AUTO RECORDING : ${config.AUTO_RECORDING ? 'ON ✅' : 'OFF ❌'}
⌨️ AUTO TYPING : ${config.AUTO_TYPING ? 'ON ✅' : 'OFF ❌'}
👁️ AUTO STATUS READ : ${config.AUTO_READ_STATUS ? 'ON ✅' : 'OFF ❌'}
❤️ AUTO REACT : ${config.AUTO_REACT ? 'ON ✅' : 'OFF ❌'}

╰━━━━━━━━━━━━━━⬣`;

    reply(text);
});
