const { cmd } = require('../command');
const axios = require("axios");

cmd({
    pattern: "web",
    desc: "Download website",
    category: "download",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {

        if (!q) {
            return reply(
                "*Example:*\n.web https://google.com"
            );
        }

        await m.react("🌐");

        const api = `https://api.davidcyriltech.my.id/tools/downloadweb?url=${encodeURIComponent(q)}`;

        const { data } = await axios.get(api);

        console.log("WEB API:", JSON.stringify(data, null, 2));

        const result = data.result || data.data || data;

        const downloadUrl =
            result.download ||
            result.url ||
            result.zip ||
            result.link ||
            result.downloadUrl;

        if (!downloadUrl) {
            return reply("❌ Download link not found.");
        }

        await conn.sendMessage(
            from,
            {
                document: { url: downloadUrl },
                mimetype: "application/zip",
                fileName: "website.zip",
                caption: `🌐 Website Download\n🔗 ${q}`
            },
            { quoted: mek }
        );

        await m.react("✅");

    } catch (e) {
        console.log(e);
        reply("❌ " + e.message);
    }
});
