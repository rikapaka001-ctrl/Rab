const { cmd } = require('../command');
const { Sticker, StickerTypes } = require('wa-sticker-formatter');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

cmd({
    pattern: "sticker",
    alias: ["s", "stick"],
    desc: "Image/Video එක sticker කරන්න",
    category: "convert",
    react: "🎨",
    filename: __filename
},
async(conn, mek, m, { from, reply, quoted }) => {
    try {
        if (!quoted) return reply("*𝐑ᴇᴘʟʏ ᴛᴏ ᴀɴ 𝐈ᴍᴀɢᴇ ᴏʀ 𝐕ɪᴅᴇᴏ*");

        const mime = quoted.mimetype || '';
        reply("*𝐂ʀᴇᴀᴛɪɴɢ sᴛɪᴄᴋᴇʀ... ⏳*");

        // Image sticker
        if (mime.includes('image')) {
            const buffer = await conn.downloadMediaMessage(quoted);
            const sticker = new Sticker(buffer, {
                pack: 'RIKA XMD',
                author: 'RIKA XMD',
                type: StickerTypes.FULL,
                quality: 50
            });
            const stickerBuffer = await sticker.toBuffer();
            await conn.sendMessage(from, { sticker: stickerBuffer }, { quoted: m });
        }

        // Video sticker - max 6 seconds
        else if (mime.includes('video')) {
            const buffer = await conn.downloadMediaMessage(quoted);
            const tempPath = path.join(__dirname, `../temp/${Date.now()}.mp4`);
            const webpPath = tempPath.replace
