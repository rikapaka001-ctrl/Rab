const { cmd } = require('../command');
const yts = require('yt-search');
const axios = require('axios');

cmd({
    pattern: "song",
    alias: ["play", "ytaudio"],
    desc: "Download YouTube song",
    category: "download",
    react: "🎧",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {

        if (!q) return reply("❌ Song name දෙන්න.\n\nExample: .song shape of you");

        await reply("🎧 Searching song...");

        // YouTube search
        const search = await yts(q);
        const video = search.videos[0];

        if (!video) return reply("❌ Song found නැහැ.");

        const url = video.url;

        const caption = `
╭━━━〔 🎧 *RIKA SONG DL* 💗 〕━━━⬣
┃ 🎵 *Title:* ${video.title}
┃ ⏱️ *Duration:* ${video.timestamp}
┃ 👁️ *Views:* ${video.views}
┃ 👤 *Channel:* ${video.author.name}
╰━━━━━━━━━━━━━━━━⬣

> © 𝐏ᴏᴡᴇʀᴅ ʙʏ ꜱʜᴀᴍɪᴋᴀ ᴅᴇɴᴜᴡᴀɴ ❗
`;

        await conn.sendMessage(from, {
            image: { url: video.thumbnail },
            caption
        }, { quoted: mek });

        // audio API (fast working)
        const api = `https://api.giftedtech.web.id/api/download/ytmp3?url=${encodeURIComponent(url)}`;

        const { data } = await axios.get(api);

        if (!data || !data.result || !data.result.download_url) {
            return reply("❌ Download failed.");
        }

        const audioUrl = data.result.download_url;

        await conn.sendMessage(from, {
            audio: { url: audioUrl },
            mimetype: "audio/mpeg"
        }, { quoted: mek });

    } catch (e) {
        console.log(e);
        reply("❌ Error: " + e.message);
    }
});
