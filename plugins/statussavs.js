const { cmd } = require('../command');

cmd({
    pattern: "save",
    alias: ["sv", "dapan", "oni", "dpn"],
    desc: "View කරන status එක download කරන්න",
    category: "download",
    react: "📥",
    filename: __filename
},
async(conn, mek, m, { from, reply, quoted }) => {
    try {
        // View once message එකක් නම්
        if (m.quoted && m.quoted.mtype === 'viewOnceMessageV2') {
            const msg = m.quoted.message;
            const type = Object.keys(msg)[0];
            const media = msg[type];

            if (type === 'imageMessage') {
                await conn.sendMessage(from, {
                    image: await conn.downloadMediaMessage(media),
                    caption: "*𝐒ᴛᴀᴛᴜs 𝐃ᴏᴡɴʟᴏᴀᴅᴇᴅ ✅*"
                }, { quoted: m });
            } else if (type === 'videoMessage') {
                await conn.sendMessage(from, {
                    video: await conn.downloadMediaMessage(media),
                    caption: "*𝐒ᴛᴀᴛᴜs 𝐃ᴏᴡɴʟᴏᴀᴅᴇᴅ ✅*"
                }, { quoted: m });
            } else {
                return reply("*𝐎ɴʟʏ 𝐈ᴍᴀɢᴇ/𝐕ɪᴅᴇᴏ 𝐒ᴛᴀᴛᴜs 𝐒ᴜᴘᴏʀᴛᴇᴅ*");
            }
            return;
        }

        // Normal reply
        if (!quoted) return reply("*𝐑ᴇᴘʟʏ ᴛᴏ ᴀ 𝐒ᴛᴀᴛᴜs 𝐌ᴇssᴀɢᴇ*");

        const type = quoted.mtype;
        if (type === 'imageMessage') {
            const media = await conn.downloadMediaMessage(quoted);
            await conn.sendMessage(from, {
                image: media,
                caption: "*𝐒ᴛᴀᴛᴜs 𝐃ᴏᴡɴʟᴏᴀᴅᴇᴅ ✅*"
            }, { quoted: m });
        } else if (type === 'videoMessage') {
            const media = await conn.downloadMediaMessage(quoted);
            await conn.sendMessage(from, {
                video: media,
                caption: "*𝐒ᴛᴀᴛᴜs 𝐃ᴏᴡɴʟᴏᴀᴅᴇᴅ ✅*"
            }, { quoted: m });
        } else {
            reply("*𝐎ɴʟʏ 𝐈ᴍᴀɢᴇ/𝐕ɪᴅᴇᴏ 𝐒ᴛᴀᴛᴜs 𝐒ᴜᴘᴏʀᴛᴇᴅ*");
        }
    } catch (e) {
        console.error(e);
        reply("*𝐄ʀᴏʀ ᴅᴏᴡɴʟᴏᴀᴅɪɴɢ sᴛᴀᴛᴜs*");
    }
});
