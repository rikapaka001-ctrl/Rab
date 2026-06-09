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
            const webpPath = tempPath.replace('.mp4', '.webp');
            
            fs.writeFileSync(tempPath, buffer);
            
            // Convert video to sticker using ffmpeg
            exec(`ffmpeg -i ${tempPath} -vcodec libwebp -fs 1M -filter:v fps=15,scale=512:512:flags=lanczos:force_original_aspect_ratio=decrease,format=rgba,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=0x00000 ${webpPath}`, async (err) => {
                if (err) {
                    fs.unlinkSync(tempPath);
                    return reply("*𝐄ʀᴏʀ ᴄᴏɴᴠᴇʀᴛɪɴɢ ᴠɪᴅᴇᴏ*\n\n*ᴍᴀx 6 sᴇᴄᴏɴᴅs ᴏɴʟʏ*");
                }
                
                const stickerBuffer = fs.readFileSync(webpPath);
                await conn.sendMessage(from, { sticker: stickerBuffer }, { quoted: m });
                
                fs.unlinkSync(tempPath);
                fs.unlinkSync(webpPath);
            });
        }

        else {
            reply("*𝐎ɴʟʏ 𝐈ᴍᴀɢᴇ/𝐕ɪᴅᴇᴏ 𝐒ᴜᴘᴏʀᴛᴇᴅ*");
        }
    } catch (e) {
        console.error(e);
        reply("*𝐄ʀᴏʀ ᴄʀᴇᴀᴛɪɴɢ sᴛɪᴄᴋᴇʀ*");
    }
});
