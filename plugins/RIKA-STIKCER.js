const { cmd } = require('../command')
const { Sticker, StickerTypes } = require('wa-sticker-formatter')
const fs = require('fs')
const { exec } = require('child_process')

cmd({
    pattern: "sticker",
    alias: ["s", "stik"],
    desc: "Convert image/video to sticker",
    category: "convert",
    filename: __filename
},
async (conn, m, msg, { reply }) => {
    try {

        let media = m.quoted ? await m.quoted.download() : await m.download()

        if (!media) return reply("❌ Image / Video එකකට reply කරන්න.")

        const sticker = new Sticker(media, {
            pack: "RIKA XMD 🎀",
            author: "SHAMIKA DENUWAN",
            type: StickerTypes.FULL,
            quality: 70
        })

        const buffer = await sticker.build()

        await conn.sendMessage(
            m.chat,
            { sticker: buffer },
            { quoted: m }
        )

    } catch (e) {
        console.log(e)
        reply("❌ Sticker Error")
    }
})

cmd({
    pattern: "toimg",
    alias: ["img"],
    desc: "Convert sticker to image",
    category: "convert",
    filename: __filename
},
async (conn, m, msg, { reply }) => {
    try {

        if (!m.quoted || m.quoted.type !== "stickerMessage")
            return reply("❌ Sticker එකකට reply කරන්න.")

        const input = "./" + Date.now() + ".webp"
        const output = "./" + Date.now() + ".png"

        const buffer = await m.quoted.download()
        fs.writeFileSync(input, buffer)

        exec(`ffmpeg -i "${input}" "${output}"`, async (err) => {

            try {
                if (fs.existsSync(input)) fs.unlinkSync(input)

                if (err)
                    return reply("❌ Convert Failed")

                const img = fs.readFileSync(output)

                await conn.sendMessage(
                    m.chat,
                    {
                        image: img,
                        caption: "✅ Converted Successfully"
                    },
                    { quoted: m }
                )

                if (fs.existsSync(output)) fs.unlinkSync(output)

            } catch (e) {
                console.log(e)
            }

        })

    } catch (e) {
        console.log(e)
        reply("❌ ToImage Error")
    }
})
