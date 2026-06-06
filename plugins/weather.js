const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "weather",
    desc: "City එකක weather බලන්න",
    category: "info",
    react: "🌤️",
    filename: __filename
},
async(conn, mek, m, { from, reply, q }) => {
    if (!q) return reply("*𝐔sᴀɢᴇ :.ᴡᴇᴀᴛʜᴇʀ <ᴄɪᴛʏ_ɴᴀᴍᴇ>*");
    try {
        const res = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${q}&appid=demo&units=metric`);
        const data = res.data;
        const text = `╭─── « 𝐖ᴇᴀᴛʜᴇʀ 𝐔ᴘᴅᴀᴛᴇ » ───⟡
│
│ ⊳ 𝐂ɪᴛʏ : ${data.name}
│ ⊳ 𝐓ᴇᴍᴘ : ${data.main.temp}°C
│ ⊳ 𝐅ᴇʟs : ${data.main.feels_like}°C
│ ⊳ 𝐇ᴜᴍɪᴅɪᴛʏ : ${data.main.humidity}%
│ ⊳ 𝐖ɪɴᴅ : ${data.wind.speed} m/s
│ ⊳ 𝐒ᴛᴀᴛᴜs : ${data.weather[0].description}
│
╰───────────────⟡
© 𝐏ᴏᴡᴇʀᴅ ʙʏ ꜱʜᴀᴍɪᴋᴀ ᴅᴇɴᴜᴡᴀɴ ❗`;
        reply(text);
    } catch {
        reply("*𝐂ɪᴛʏ 𝐍ᴏᴛ 𝐅ᴏᴜɴᴅ*");
    }
});
