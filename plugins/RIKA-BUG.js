const { cmd } = require('../command');

cmd({
    pattern: "rika-crash",
    desc: "Safe spam to yourself only. Owner only.",
    category: "owner",
    react: "💬",
    filename: __filename
},
async (conn, m, { from, args, isCreator }) => {
    if(!isCreator) return m.reply('❌ Owner only command pako');

    let text = args.join(' ') || 'RIKA-TEST';
    let count = parseInt(args[0]) || 10;
    if(count > 20) count = 20; // Limit 20 ta. 125 na.

    for (let i = 0; i < count; i++) {
      await conn.sendMessage(from, { text: `${i+1}. ${text}` });
      await new Promise(r => setTimeout(r, 1500)); // 1.5s delay = ban na
    }
    m.reply(`✅ Done ${count}x`)
});
