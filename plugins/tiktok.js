const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "tt",
    alias: ["tiktok", "ttdl", "tiktokdl"],
    desc: "Download TikTok videos",
    category: "download",
    react: "🎵",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {

        if (!q) return reply("❌ TikTok link eka denna.");

        reply("⏳ Download karamin...");

        const api = `https://www.tikwm.com/api/?url=${encodeURIComponent(q)}`;

        const { data } = await axios.get(api);

        if (!data || !data.data || !data.data.play) {
            return reply("❌ Video eka ganna bari una.");
        }

        const videoUrl = data.data.play;
        const title = data.data.title || "TikTok Video";

        await conn.sendMessage(
            from,
            {
                video: { url: videoUrl },
                caption: `🎵 *TikTok Downloader*\n\n📌 ${title}`
            },
            { quoted: mek }
        );

    } catch (e) {
        console.log(e);
        reply("❌ Error: " + e.message);
    }
});
