const { cmd } = require('../command');
const axios = require('axios');

const API_KEY = "a1e6a20d93870c1a985e431d28e52beafed68fed41028698f5c39948422ef12a";

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

        if (!q) {
            return reply("❌ Please provide a TikTok URL.");
        }

        await reply("⏳ *Downloading TikTok Video...*");

        const { data } = await axios.get(
            `https://back.asitha.top/api/tiktok/download?url=${encodeURIComponent(q)}&apiKey=${API_KEY}`
        );

        console.log("TT RESPONSE =>", JSON.stringify(data, null, 2));

        const videoUrl =
            data?.result?.video ||
            data?.result?.play ||
            data?.result?.nowm ||
            data?.result?.download ||
            data?.data?.video ||
            data?.data?.play ||
            data?.data?.nowm ||
            data?.data?.download ||
            data?.video ||
            data?.url;

        const title =
            data?.result?.title ||
            data?.data?.title ||
            "TikTok Video";

        if (!videoUrl) {
            return reply("❌ Video URL not found.\nCheck Render logs.");
        }

        const caption = `╭━━━〔 💗 RIKA TT DL 🧸 〕━━━⬣
┃ 🎵 TikTok Download Success
┃ 📌 Title: ${title}
┃ 👤 User: @${m.sender.split('@')[0]}
╰━━━━━━━━━━━━━━━━⬣

> Powered By Shamika Denuwan`;

        await conn.sendMessage(
            from,
            {
                video: { url: videoUrl },
                caption,
                mentions: [m.sender]
            },
            { quoted: mek }
        );

    } catch (e) {
        console.log("TT ERROR =>", e?.response?.data || e);

        reply(
            `❌ Download Failed\n\n${e.message}`
        );
    }
});
