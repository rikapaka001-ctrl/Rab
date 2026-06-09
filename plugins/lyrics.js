const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "lyrics",
    alias: ["lyric"],
    desc: "Song lyrics ගන්න",
    category: "search",
    react: "🎵",
    filename: __filename
},
async(conn, mek, m, { from, reply, q }) => {
    if (!q) return reply("*𝐔sᴀɢᴇ :.ʟʏʀɪᴄs <sᴏɴɢ_ɴᴀᴍᴇ>*");

    try {
        reply("*𝐒ᴇᴀʀᴄʜɪɴɢ ʟʏʀɪᴄs... ⏳*");
        const res = await axios.get(`https://api.lyrics.ovh/v1/${q}`);
        let lyrics = res.data.lyrics;
        if (lyrics.length > 1000) lyrics = lyrics.slice(0, 1000) + "\n\n*...ᴛʀᴜɴᴄᴀᴛᴇᴅ*";
        reply(`╭─── « 𝐋ʏʀɪᴄs » ───⟡\n│\n${lyrics}\n╰───────────────⟡`);
    } catch {
        reply("*𝐋ʏʀɪᴄs 𝐍ᴏᴛ 𝐅ᴏᴜɴᴅ*");
    }
});
