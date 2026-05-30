const config = require('../config')
const os = require('os')

const menuImage = 'https://files.catbox.moe/7z5x3q.jpg'
const newsletter = '120363428073031350@newsletter'

function runtime(seconds) {
    seconds = Number(seconds)
    const d = Math.floor(seconds / (3600 * 24))
    const h = Math.floor(seconds % (3600 * 24) / 3600)
    const m = Math.floor(seconds % 3600 / 60)
    const s = Math.floor(seconds % 60)

    const dDisplay = d > 0 ? d + 'd ' : ''
    const hDisplay = h > 0 ? h + 'h ' : ''
    const mDisplay = m > 0 ? m + 'm ' : ''
    const sDisplay = s > 0 ? s + 's' : ''

    return dDisplay + hDisplay + mDisplay + sDisplay
}

module.exports = {
    name: 'menu',
    alias: ['allmenu','panel','help'],
    desc: 'Show bot menu',
    category: 'main',
    react: '✨',

    async execute(conn, mek, m, { from, pushname, reply }) {

        const menuText = `╭━━━〔 *RIKA XMD MENU* 〕━━━⊷
┃
┃ 👋 Hello : ${pushname}
┃ 🤖 Bot : RIKA XMD
┃ 👑 Owner : Shamika Denuwan
┃ ⏰ Runtime : ${runtime(process.uptime())}
┃ 💻 Platform : ${os.platform()}
┃
┣━━━〔 *MAIN COMMANDS* 〕━━━⊷
┃ ⚡ .alive
┃ ⚡ .ping
┃ ⚡ .menu
┃ ⚡ .owner
┃
┣━━━〔 *DOWNLOAD MENU* 〕━━━⊷
┃ 📥 .song
┃ 📥 .video
┃ 📥 .tiktok
┃ 📥 .fb
┃
┣━━━〔 *GROUP MENU* 〕━━━⊷
┃ 👥 .tagall
┃ 👥 .hidetag
┃ 👥 .kick
┃ 👥 .add
┃
┣━━━〔 *FUN MENU* 〕━━━⊷
┃ 😂 .joke
┃ 😂 .quote
┃ 😂 .fact
┃
╰━━━━━━━━━━━━━━━⊷
> MADE BY SHAMIKA DENUWAN`

        await conn.sendMessage(from, {
            image: { url: menuImage },
            caption: menuText,
            footer: 'RIKA XMD V3',
            buttons: [
                {
                    buttonId: '.ping',
                    buttonText: {
                        displayText: '⚡ PING'
                    },
                    type: 1
                },
                {
                    buttonId: '.alive',
                    buttonText: {
                        displayText: '🟢 ALIVE'
                    },
                    type: 1
                },
                {
                    buttonId: '.owner',
                    buttonText: {
                        displayText: '👑 OWNER'
                    },
                    type: 1
                }
            ],
            headerType: 4,
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: newsletter,
                    newsletterName: 'Ｒɪᴋᴀ Ｘᴍᴅ 🐉'
                },
                externalAdReply: {
                    title: 'RIKA XMD V3',
                    body: 'SIMPLE BUTTON MENU',
                    mediaType: 1,
                    renderLargerThumbnail: true,
                    thumbnailUrl: menuImage,
                    sourceUrl: 'https://github.com/Cyberrikado/RIKA-MD-V1'
                }
            }
        }, { quoted: mek })
    }
}
