const { cmd } = require('../command');

let store = {};

cmd({
    on: "body"
}, async (conn, mek, m, { from }) => {
    try {
        if (mek.key.fromMe) return;

        store[mek.key.id] = {
            sender: mek.key.participant || mek.key.remoteJid,
            text: m.body || '',
            chat: from
        };
    } catch (e) {}
});

cmd({
    on: "rikado"
}, async (conn, mek) => {
    try {
        const deleted = mek.message?.protocolMessage;

        if (!deleted) return;

        const msg = store[deleted.key.id];

        if (!msg) return;

        await conn.sendMessage(msg.chat, {
            text: `🚨 *ANTI DELETE*\n\n👤 User: @${msg.sender.split('@')[0]}\n\n💬 Message:\n${msg.text}`,
            mentions: [msg.sender]
        });

    } catch (e) {
        console.log(e);
    }
});
