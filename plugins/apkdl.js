const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "apk",
    desc: "Download APK",
    category: "download",
    filename: __filename
},
async (conn, mek, m, {
    from,
    q,
    reply
}) => {
    try {

        if (!q) {
            return reply("*Please provide an app name!*\n\nExample:\n.apk WhatsApp");
        }

        await m.react("⬇️");

        const api = `https://api.davidcyriltech.my.id/download/apk?text=${encodeURIComponent(q)}`;

        const { data } = await axios.get(api);

        if (!data.status) {
            return reply("*APK not found!*");
        }

        const apk = data.result;

        let caption = `
┏╍⌈ *🧚‍♂️ RIKA XMD 🌪️* ⌋┅×

🏷️ *Name:* ${apk.name || q}

📦 *Size:* ${apk.size || "Unknown"}

👤 *Developer:* ${apk.author || "Unknown"}

🔗 *Package:* ${apk.package || "Unknown"}

> Powered By RIKA XMD 🌪️
`;

        await conn.sendMessage(
            from,
            {
                document: {
                    url: apk.dllink
                },
                mimetype: "application/vnd.android.package-archive",
                fileName: `${apk.name || q}.apk`,
                caption
            },
            {
                quoted: mek
            }
        );

        await m.react("✅");

    } catch (e) {
        console.log(e);
        reply(`❌ Error:\n${e.message}`);
    }
});
