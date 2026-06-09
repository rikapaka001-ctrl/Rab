const { cmd } = require('../command');
const { Sticker, StickerTypes } = require('wa-sticker-formatter');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

cmd({
    pattern: "sticker",
    alias: ["s", "stick"],
    desc: "Image/Video sticker",
    category: "convert",
    react: "🎨",
    filename: __filename
},
async(conn, mek, m, { from, reply }) => {
    try {
        if (!m.quoted) return reply("*𝐑ᴇᴘʟʏ ᴛᴏ ᴀɴ 𝐈ᴍᴀɢᴇ ᴏʀ 𝐕ɪᴅᴇᴏ*");

        const msg = m.quoted;
        const mime = msg.mimetype || '';
        
        reply("*𝐂ʀᴇᴀᴛɪɴɢ sᴛɪᴄᴋᴇʀ... ⏳*");

        // Image sticker
        if (mime.includes('image')) {
            const buffer = await conn.downloadMediaMessage(msg);
            const sticker = new Sticker(buffer, {
                pack: 'RIKA XMD',
                author: 'RIKA XMD',
                type: StickerTypes.FULL,
                quality: 50
            });
            const stickerBuffer = await sticker.toBuffer();
            await conn.sendMessage(from, { sticker: stickerBuffer }, { quoted: m });
        }

        // Video sticker
        else if (mime.includes('video')) {
            const buffer = await conn.downloadMediaMessage(msg);
            const tempPath = `./temp/${Date.now()}.mp4`;
            const webpPath = tempPath.replace('.mp4', '.webp');
            
            if (!fs.existsSync('./temp')) fs.mkdirSync('./temp');
            fs.writeFileSync(tempPath, buffer);
            
            exec(`ffmpeg -i ${tempPath} -vcodec libwebp -fs 1M -filter:v fps=15,scale=512:512:flags=lanczos:force_original_aspect_ratio=decrease,format=rgba,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=0x00000 ${webpPath}`, async (err) => {
                if (err) {
                    fs.unlinkSync(tempPath);
                    return reply("*𝐄ʀᴏʀ: Fғᴍᴘᴇɢ ɴᴏᴛ ɪɴsᴛᴀʟᴇᴅ ᴏʀ ᴠɪᴅᴇᴏ ᴛᴏ ʟᴏɴɢ*");
                }
                const stickerBuffer = fs.readFileSync(webpPath);
                await conn.sendMessage(from, { sticker: stickerBuffer }, { quoted: m });
                fs.unlinkSync(tempPath);
                fs.unlinkSync(webpPath);
            });
        }

        else {
            return reply(`*𝐔ɴsᴜᴘᴏʀᴛᴇᴅ: ${mime}*\n*𝐎ɴʟʏ 𝐈ᴍᴀɢᴇ/𝐕ɪᴅᴇᴏ*`);
        }
    } catch (e) {
        console.error(e);
        reply("*𝐄ʀᴏʀ ᴄʀᴇᴀᴛɪɴɢ sᴛɪᴄᴋᴇʀ*");
    }
});
