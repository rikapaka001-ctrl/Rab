const os = require('os')
const { cmd } = require('../command')

cmd({
    pattern: "alive",
    desc: "Check whether bot is online",
    category: "main",
    react: "🤖",
    filename: __filename
},
async(conn, mek, m, { from, pushname, reply }) => {

const runtime = process.uptime()

const hours = Math.floor(runtime / 3600)
const minutes = Math.floor((runtime % 3600) / 60)
const seconds = Math.floor(runtime % 60)

const aliveText = `╭━━━〔 *BOT ALIVE* 〕━━━┈⊷
┃👤 USER : ${pushname}
┃🤖 BOT : FREE BOT BASE
┃⚡ STATUS : ONLINE
┃💻 RAM : ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB
┃🕒 RUNTIME : ${hours}h ${minutes}m ${seconds}s
┃🖥️ PLATFORM : ${os.platform()}
╰━━━━━━━━━━━━━━━━━━━┈⊷

*🌸 BOT WORKING PERFECTLY 🌸*`

await conn.sendMessage(from, {
    image: { url: 'https://i.ibb.co/YFXRBPtJ/2817.jpg' },
    caption: aliveText
}, { quoted: mek })

})
