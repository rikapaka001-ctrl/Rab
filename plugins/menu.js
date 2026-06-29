const { cmd, commands, proto } = require('../command'); // proto add kale
const os = require('os');
const moment = require('moment-timezone');

const botLogo = "https://i.ibb.co/ycY7Nyg6/4f7c2504e62e.jpg";
const ownername = "sʜᴀᴍɪᴋᴀ ᴅᴇɴᴜᴡᴀɴ";
const botname = "𝐑ɪᴋᴀ ᴍɪɴɪ ʙᴏᴛ-ᴍᴇɴᴜ";

cmd({
    pattern: "menu",
    alias: ["panel", "list", "commands"],
    desc: "Show main menu.",
    category: "main",
    react: "⚡",
    filename: __filename
},
async (conn, mek, m, { from, pushname, prefix, reply }) => {
    try {
        let hostname = os.hostname();
        if (hostname.length === 12) hostname = 'Replit';
        else if (hostname.length === 36) hostname = 'Heroku';
        else if (hostname.length === 8) hostname = 'Koyeb';
        else hostname = 'VPS / Local';

        const ramUsed = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
        const ramTotal = Math.round(os.totalmem() / 1024 / 1024);
        const ramUsage = `${ramUsed}MB / ${ramTotal}MB`;

        const uptimeSeconds = process.uptime();
        const uptimeHours = Math.floor(uptimeSeconds / 3600);
        const uptimeMinutes = Math.floor((uptimeSeconds % 3600) / 60);
        const rtime = `${uptimeHours}h ${uptimeMinutes}m`;

        const time = moment.tz('Asia/Colombo').format('HH');
        let greeting = "Good Night";
        if (time >= 4 && time < 12) greeting = "Good Morning 🙈";
        else if (time >= 12 && time < 17) greeting = "Good Afternoon 🙉";
        else if (time >= 17 && time < 20) greeting = "Good Evening 🙊";

        const menuText = `╭─❒「 ${botname} 」
│
├─❒ 友 Hi ‹ *${pushname}* ${greeting}
├─❒ 友 Version ‹ *3.0.0*
├─❒ 友 Owner ‹ *${ownername}*
├─❒ 友 RAM ‹ *${ramUsage}*
├─❒ 友 Uptime ‹ *${rtime}*
├─❒ 友 Host ‹ *${hostname}*
╰────────────────❒

\`⌥ ᴛʜᴇ ʙᴇꜱᴛ ᴡʜᴀᴛꜱᴀᴘ ʙᴏᴛ 🎀ᯓ\`

> _𝐑ᴇᴘʟʏ ᴡɪᴛʜ ᴀ ɴᴜᴍʙᴇʀ 1-8 ᴛᴏ ɴᴀᴠɪɢᴀᴛᴇ._`;

        // 1. Image eka upload karapan
        const { imageMessage } = await conn.uploadMediaMessage('image', { url: botLogo }, { upload: conn.waUploadToServer });

        // 2. v7 Interactive Message Hadamu
        const msg = proto.Message.fromObject({
            viewOnceMessage: {
                message: {
                    interactiveMessage: {
                        header: proto.Message.InteractiveMessage.Header.fromObject({
                            hasMediaAttachment: true,
                            imageMessage: imageMessage
                        }),
                        body: proto.Message.InteractiveMessage.Body.fromObject({
                            text: menuText
                        }),
                        footer: proto.Message.InteractiveMessage.Footer.fromObject({
                            text: "© 𝐏ᴏᴡᴇʀᴅ ʙʏ ꜱʜᴀᴍɪᴋᴀ ᴅᴇɴᴜᴡᴀɴ ❗"
                        }),
                        nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
                            buttons: [
                                {
                                    name: "single_select",
                                    buttonParamsJson: JSON.stringify({
                                        title: "📜 Click Menu",
                                        sections: [{
                                            title: "Main Panels",
                                            rows: [
                                                { id: "1", title: "Main Menu", description: "Core Commands" },
                                                { id: "2", title: "Owner Menu", description: "Admin Only" },
                                                { id: "3", title: "Group Menu", description: "Group Tools" },
                                                { id: "4", title: "Logo Menu", description: "40+ Styles" },
                                            ]
                                        },{
                                            title: "More Panels",
                                            rows: [
                                                { id: "5", title: "Downloads", description: "YT, FB, Tik" },
                                                { id: "6", title: "Search Menu", description: "Google, Git" },
                                                { id: "7", title: "AI Features", description: "GPT, Imagine" },
                                                { id: "8", title: "Other Tools", description: "Stalk, Calc" },
                                            ]
                                        }]
                                    })
                                },
                                {
                                    name: "cta_url",
                                    buttonParamsJson: JSON.stringify({
                                        display_text: "📦 GITHUB REPO",
                                        url: "https://github.com/ShamikaDenuwan/V",
                                        merchant_url: "https://github.com/ShamikaDenuwan/V"
                                    })
                                }
                            ],
                            messageParamsJson: ""
                        })
                    }
                }
            }
        });

        await conn.relayMessage(from, msg.message, { messageId: mek.key.id });

    } catch (e) {
        console.log(e);
        reply(`*❌ 𝐒ʏsᴛᴇᴍ ᴇʀᴏʀ!*\n\n${e}`);
    }
});

// Oya thiyena submenu commands okkoma mehema thiyaganna
cmd({ pattern: "mainmenu", react: "⚡", dontAddCommandList: true, filename: __filename },
async(conn, mek, m, {from, pushname, reply}) => {
    let cmdList = commands.filter(c => c.category === 'main' &&!c.dontAddCommandList).map(c => `│ ⊳ *${c.pattern}*\n│ ${c.desc || 'No Description'}\n│\n`).join('');
    await conn.sendMessage(from, { image: { url: botLogo }, caption: `╭─── « 𝐌ᴀɪɴ ᴄᴏᴍᴀɴᴅs » ───⟡\n│\n${cmdList || '│ ⊳ 𝐍ᴏ ᴄᴏᴍᴀɴᴅs ғᴏᴜɴᴅ.\n│\n'}╰───────────────⟡` });
});
cmd({ pattern: "ownermenu", react: "⚡", dontAddCommandList: true, filename: __filename },
async(conn, mek, m, {from, pushname, reply}) => {
    let cmdList = commands.filter(c => c.category === 'owner' &&!c.dontAddCommandList).map(c => `│ ⊳ *${c.pattern}*\n│ ${c.desc || 'No Description'}\n│\n`).join('');
    await conn.sendMessage(from, { image: { url: botLogo }, caption: `╭─── « 𝐎ᴡɴᴇʀ ᴄᴏᴍᴀɴᴅs » ───⟡\n│\n${cmdList || '│ ⊳ 𝐍ᴏ ᴄᴏᴍᴀɴᴅs ғᴏᴜɴᴅ.\n│\n'}╰───────────────⟡` });
});
// groupmenu, downloadmenu, searchmenu, aimenu, othermenu okkoma ehemai
