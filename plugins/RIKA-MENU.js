const os = require("os");

module.exports = {
    pattern: "menu",
    alias: ["panel", "help"],
    desc: "Show Menu",
    category: "main",
    react: "📜",

    async run(conn, mek, m, { from, pushname }) {

        const menuText = `
╭━━〔 *RIKA XMD V3* 〕━━⬣
┃ ✦ Hello ${pushname || "User"}
┃ ✦ Owner : Shamika
┃ ✦ Mode : Public
┃ ✦ Platform : ${os.platform()}
╰━━━━━━━━━━⬣

╭━━〔 *MAIN MENU* 〕━━⬣
┃ ⚡ .alive
┃ ⚡ .ping
┃ ⚡ .owner
┃ ⚡ .menu
╰━━━━━━━━━━⬣

╭━━〔 *DOWNLOAD MENU* 〕━━⬣
┃ 📥 .song
┃ 📥 .video
┃ 📥 .fb
┃ 📥 .tiktok
╰━━━━━━━━━━⬣

╭━━〔 *GROUP MENU* 〕━━⬣
┃ 👥 .tagall
┃ 👥 .kick
┃ 👥 .add
┃ 👥 .hidetag
╰━━━━━━━━━━⬣

> MADE BY SHAMIKA DENUWAN
`;

        await conn.sendMessage(
            from,
            {
                image: {
                    url: "https://files.catbox.moe/7z5x3q.jpg",
                },
                caption: menuText,
            },
            {
                quoted: m
            }
        );
    },
};
