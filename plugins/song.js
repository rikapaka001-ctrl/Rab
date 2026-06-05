const { cmd } = require('../command');
const yts = require('yt-search');
const axios = require('axios');

cmd({
    pattern: "song",
    alias: ["play", "music"],
    desc: "YouTube song downloader (buttons + mp3 + doc)",
    category: "download",
    react: "🎧",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {

        if (!q) {
            return reply("❌ Song name එක දෙන්න.\n\nExample: .song alan walker faded");
        }

        await reply("🔎 Searching song...");

        const search = await yts(q);
        const video = search.videos[0];

        if (!video) return reply("❌ Song හම්බුනේ නැහැ.");

        // ✅ SINGLE STABLE API ONLY
        const api = `https://api.dhamzxploit.my.id/api/ytmp3?url=${encodeURIComponent(video.url)}`;
        const { data } = await axios.get(api);

        const audioUrl =
            data?.result?.download_url ||
            data?.result?.url ||
            data?.download_url;

        if (!audioUrl) return reply("❌ Audio download failed.");

        const caption = `
╭━━━〔 🎧 *RIKA SONG PLAYER* 💗 〕━━━⬣
┃ 🎵 *Title:* ${video.title}
┃ ⏱️ *Duration:* ${video.timestamp}
┃ 👁️ *Views:* ${video.views}
┃ 👤 *Channel:* ${video.author.name}
╰━━━━━━━━━━━━━━━━⬣

> 💞 Select option below
`;

        const buttons = [
            {
                buttonId: `.audio ${video.url}`,
                buttonText: { displayText: "🎧 AUDIO MP3" },
                type: 1
            },
            {
                buttonId: `.doc ${video.url}`,
                buttonText: { displayText: "📁 DOCUMENT" },
                type: 1
            }
        ];

        await conn.sendMessage(from, {
            image: { url: video.thumbnail },
            caption,
            buttons,
            headerType: 4
        }, { quoted: mek });

    } catch (e) {
        console.log("Song Error:", e);
        reply("❌ Error: " + e.message);
    }
});


/* =======================
   🎧 AUDIO
======================= */
cmd({
    pattern: "audio",
    dontAddCommandList: true
},
async (conn, mek, m, { from, q }) => {
    try {

        const api = `https://api.dhamzxploit.my.id/api/ytmp3?url=${encodeURIComponent(q)}`;
        const { data } = await axios.get(api);

        const audioUrl =
            data?.result?.download_url ||
            data?.result?.url ||
            data?.download_url;

        if (!audioUrl) return;

        await conn.sendMessage(from, {
            audio: { url: audioUrl },
            mimetype: "audio/mpeg"
        }, { quoted: mek });

    } catch (e) {
        console.log(e);
    }
});


/* =======================
   📁 DOCUMENT
======================= */
cmd({
    pattern: "doc",
    dontAddCommandList: true
},
async (conn, mek, m, { from, q }) => {
    try {

        const api = `https://api.dhamzxploit.my.id/api/ytmp3?url=${encodeURIComponent(q)}`;
        const { data } = await axios.get(api);

        const audioUrl =
            data?.result?.download_url ||
            data?.result?.url ||
            data?.download_url;

        if (!audioUrl) return;

        await conn.sendMessage(from, {
            document: { url: audioUrl },
            mimetype: "audio/mpeg",
            fileName: "RIKA-SONG.mp3"
        }, { quoted: mek });

    } catch (e) {
        console.log(e);
    }
});
