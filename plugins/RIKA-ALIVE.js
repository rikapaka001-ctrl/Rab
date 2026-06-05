const { cmd } = require('../command');
const config = require('../config')

cmd({
    pattern: "alive",
    desc: "Check bot status",
    react: "🤖",
    category: "main",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {

    try {

        const aliveText = `
╭───〔 *🤖 Ｒɪᴋᴀ Ｘᴍᴅ* 〕───⬣
│
│ \`Ｈᴇʏ ..👋 Ｉ'ᴍ Ａʟɪᴠᴇ Ｎᴏᴡ\`
│◈ ⚙️ Ｐʀᴇꜰɪx: *[${config.PREFIX}]*
│◈ 🦅 Ｓᴛᴀᴛᴜꜱ: *Online ✅*
│◈ 🧸 Ｍᴏᴅᴇ : *Public 🌐*
│◈ 🐉 Ｏᴡɴᴇʀ : *Shamika 😎*
│
│ \`● ᴛʜᴇ ʙᴇꜱᴛ ᴡʜᴀᴛꜱᴀᴘᴘ ʙᴏᴛ ❗\`
│ \`● ᴛʜᴇ ᴍᴜʟᴛɪᴘʟᴇ ᴡʜᴀᴛꜱᴀᴘᴘ ʙᴏᴛ ❗\`
│ \`● ʀɪᴋᴀ ᴛᴇᴀᴄʜ ᴡᴘ ᴍᴅ ʙᴏᴛ ❗\`
│ 
│ Type \`.menu\` for commands
│
╰────────────────⬣
`;

        await conn.sendMessage(from, {
            image: { url: "https://files.catbox.moe/7z5x3q.jpg" },
            caption: aliveText,
            footer: "> ＰᴏᴡᴇʀᴇᴅＢʏ ＳʜᴀᴍɪᴋᴀＤᴅᴇɴᴜᴡᴀɴ 🐉",
            buttons: [
                {
                    buttonId: ".menu",
                    buttonText: { displayText: "📜 Menu" },
                    type: 1
                },
                {
                    buttonId: ".ping",
                    buttonText: { displayText: "🏓 Ping" },
                    type: 1
                }
            ],
            headerType: 4,
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: "120363428073031350@newsletter",
                    newsletterName: "Ｒɪᴋᴀ Ｘᴍᴅ 🐉"
                }
            }
        }, { quoted: mek });

    } catch (e) {
        console.log(e);
        reply("❌ Error in alive command");
    }

});