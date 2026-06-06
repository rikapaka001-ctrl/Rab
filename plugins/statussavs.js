const { cmd } = require('../command');

cmd({
    pattern: "status",
    alias: ["sw", "savestatus"],
    desc: "Status download කරන්න",
    category: "download",
    react: "📥",
    filename: __filename
},
async(conn, mek, m, { from, reply, quoted }) => {
    try {
        // Quoted message නැත්තං
        if (!quoted) return reply("*𝐑ᴇᴘʟʏ ᴛᴏ ᴀ 𝐒ᴛᴀᴛᴜs 𝐌ᴇssᴀɢᴇ*");

        const mime = quoted.mimetype || '';
        const type = quoted.mtype || '';

        // Image status
        if (type.includes('image') || mime.includes('image')) {
            const media = await conn.downloadMediaMessage(quoted);
            await conn.sendMessage(from, {
                image: media,
                caption: "*𝐒ᴛᴀᴛᴜs 𝐃ᴏᴡɴʟᴏᴀᴅᴇᴅ ✅*"
            }, { quoted: m });
        }
        // Video status  
        else if (type.includes('video') || mime.includes('video')) {
            const media = await conn.downloadMediaMessage(quoted);
            await conn.sendMessage(from, {
                video: media,
                caption: "*𝐒ᴛᴀᴛᴜs 𝐃ᴏᴡɴʟᴏᴀᴅᴇᴅ ✅*"
            }, { quoted: m });
        }
        // Audio status
        else if (type.includes('audio') || mime.includes('audio')) {
            const media = await conn.downloadMediaMessage(quoted);
            await conn.sendMessage(from, {
                audio: media,
                mimetype: 'audio/mp4'
            }, { quoted: m });
        }
        else {
            return reply("*𝐎ɴʟʏ 𝐈ᴍᴀɢᴇ/𝐕ɪᴅᴇᴏ/𝐀ᴜᴅɪᴏ 𝐒ᴛᴀᴛᴜs 𝐒ᴜᴘᴏʀᴛᴇᴅ*");
        }
    } catch (e) {
        console.error(e);
        reply("*𝐄ʀᴏʀ ᴅᴏᴡɴʟᴏᴀᴅɪɴɢ sᴛᴀᴛᴜs*\n\n*ᴛʀʏ ᴜᴘᴅᴀᴛɪɴɢ ʙᴀɪʟᴇʏs ᴠᴇʀsɪᴏɴ*");
    }
});
