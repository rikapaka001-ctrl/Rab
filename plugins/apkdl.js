const axios = require("axios");
const gplay = require("google-play-scraper");
const { cmd } = require("../command"); // path එක වෙනස් වෙන්න පුළුවන්

cmd({
    pattern: "apk",
    desc: "Download APK",
    category: "download",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {

        if (!q) return reply("Example:\n.apk WhatsApp");

        const results = await gplay.search({
            term: q,
            num: 1
        });

        if (!results.length) {
            return reply("❌ App not found");
        }

        const app = results[0];

        const apiUrl = `https://ws75.aptoide.com/api/7/apps/search/query=${encodeURIComponent(app.title)}/limit=1`;

        const { data } = await axios.get(apiUrl);

        if (!data?.datalist?.list?.length) {
            return reply("❌ APK not found");
        }

        const apk = data.datalist.list[0];

        const caption = `
📦 Name: ${apk.name}
🏷 Package: ${apk.package}
👨‍💻 Developer: ${apk.developer?.name || "Unknown"}
📥 Size: ${(apk.size / 1024 / 1024).toFixed(2)} MB
⭐ Rating: ${app.scoreText || "N/A"}
`;

        await conn.sendMessage(
            from,
            {
                document: {
                    url: apk.file.path_alt
                },
                mimetype: "application/vnd.android.package-archive",
                fileName: `${apk.name}.apk`,
                caption
            },
            { quoted: mek }
        );

    } catch (err) {
        console.log(err);
        reply("❌ Error: " + err.message);
    }
});
