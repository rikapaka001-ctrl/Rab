const { cmd, commands } = require('../command');
const os = require('os');
const moment = require('moment-timezone');

const botLogo = "https://i.ibb.co/ycY7Nyg6/4f7c2504e62e.jpg";
const ownername = "sʜᴀᴍɪᴋᴀ ᴅᴇɴᴜᴡᴀɴ";
const botname = "𝐑ɪᴋᴀ ᴍɪɴɪ ʙᴏᴛ-ᴍᴇɴᴜ";

const logoTypes = ["neon","neon2","fire2","glitch","hacker","futuristic","thunder","devil","fire","ice","snow","lava","metal","gold","silver","glossy","blackpink","transformer","horror","blood","joker","galaxy","space","cloud","sand","stone","magma","gradient","light","paper","watercolor","candy","christmas","luxury","leaf","summer","circuit","block3d","cartoon","chrome","frozen"];

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

        await conn.sendMessage(from, {
            image: { url: botLogo },
            caption: menuText,
            footer: "© 𝐏ᴏᴡᴇʀᴅ ʙʏ ꜱʜᴀᴍɪᴋᴀ ᴅᴇɴᴜᴡᴀɴ ❗",
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: "120363428073031350@newsletter",
                    newsletterName: "Ｒɪᴋᴀ ᴛᴇᴀᴄʜ ᴏꜰᴄ 🐉"
                }
            },
            interactiveButtons: [
                {
                    name: "single_select",
                    buttonParamsJson: JSON.stringify({
                        title: "📜 Click Menu",
                        sections: [
                            {
                                title: "Main Panels",
                                rows: [
                                    { header: "Panel 1", title: "Main Menu", id: "1", description: "Core Commands" },
                                    { header: "Panel 2", title: "Owner Menu", id: "2", description: "Admin Only" },
                                    { header: "Panel 3", title: "Group Menu", id: "3", description: "Group Tools" },
                                    { header: "Panel 4", title: "Logo Menu", id: "4", description: "40+ Styles" },
                                ]
                            },
                            {
                                title: "More Panels",
                                rows: [
                                    { header: "Panel 5", title: "Downloads", id: "5", description: "YT, FB, Tik" },
                                    { header: "Panel 6", title: "Search Menu", id: "6", description: "Google, Git" },
                                    { header: "Panel 7", title: "AI Features", id: "7", description: "GPT, Imagine" },
                                    { header: "Panel 8", title: "Other Tools", id: "8", description: "Stalk, Calc" },
                                ]
                            }
                        ]
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
            ]
        }, { quoted: mek });

    } catch (e) {
        console.log(e);
        reply(`*❌ 𝐒ʏsᴛᴇᴍ ᴇʀᴏʀ!*\n\n${e}`);
    }
});

const generateSubMenu = async (conn, from, category, title, pushname) => {
    try {
        let cmdList = '';
        commands.filter(c => c.category === category &&!c.dontAddCommandList).forEach(c => {
            cmdList += `│ ⊳ *${c.pattern}*\n│ ${c.desc || 'No Description'}\n│\n`;
        });
        if (cmdList === '') cmdList = `│ ⊳ 𝐍ᴏ ᴄᴏᴍᴀɴᴅs ғᴏᴜɴᴅ.\n│\n`;

        let menuContent = `╭─── « 𝐑ɪᴋᴀ-xᴍᴅ ᴍɪɴɪ ᴠ3 » ───⟡
│
│ ⊳ *${title}*
│
${cmdList}╰───────────────⟡

> © 𝐏ᴏᴡᴇʀᴅ ʙʏ ꜱʜᴀᴍɪᴋᴀ ᴅᴇɴᴜᴡᴀɴ ❗`;

        await conn.sendMessage(from, { image: { url: botLogo }, caption: menuContent });
    } catch (e) {
        console.log(e);
    }
};

cmd({ pattern: "logomenu", dontAddCommandList: true, filename: __filename },
async(conn, mek, m, {from, pushname, reply}) => {
    let logoList = `╭─── « 𝐋ᴏɢᴏ ᴍᴀᴋᴇʀ ᴍᴇɴᴜ » ───⟡
│
`;
    logoTypes.forEach((type, index) => {
        let num = (index + 1).toString().padStart(2, '0');
        logoList += `│ [ ${num} ] ${type.toUpperCase()}\n`;
    });
    logoList += `│
╰───────────────⟡

> _𝐑ᴇᴘʟʏ ᴡɪᴛʜ ᴀ ɴᴜᴍʙᴇʀ ᴛᴏ ɢᴇɴᴇʀᴀᴛᴇ._
> _Ex:.logo 01 Crezy Rika_

> © 𝐏ᴏᴡᴇʀᴅ ʙʏ ꜱʜᴀᴍɪᴋᴀ ᴅᴇɴᴜᴡᴀɴ ❗`;

    await conn.sendMessage(from, { image: { url: botLogo }, caption: logoList });
});

cmd({ pattern: "mainmenu", react: "⚡", dontAddCommandList: true, filename: __filename },
async(conn, mek, m, {from, pushname, reply}) => {
    await generateSubMenu(conn, from, 'main', '𝐌ᴀɪɴ ᴄᴏᴍᴀɴᴅs', pushname);
});
cmd({ pattern: "ownermenu", react: "⚡", dontAddCommandList: true, filename: __filename },
async(conn, mek, m, {from, pushname, reply}) => {
    await generateSubMenu(conn, from, 'owner', '𝐎ᴡɴᴇʀ ᴄᴏᴍᴀɴᴅs', pushname);
});
cmd({ pattern: "groupmenu", react: "⚡", dontAddCommandList: true, filename: __filename },
async(conn, mek, m, {from, pushname, reply}) => {
    await generateSubMenu(conn, from, 'group', '𝐆ʀᴏᴜᴘ ᴄᴏᴍᴀɴᴅs', pushname);
});
cmd({ pattern: "downloadmenu", react: "⚡", dontAddCommandList: true, filename: __filename },
async(conn, mek, m, {from, pushname, reply}) => {
    await generateSubMenu(conn, from, 'download', '𝐃ᴏᴡɴʟᴏᴀᴅᴇʀs', pushname);
});
cmd({ pattern: "searchmenu", react: "⚡", dontAddCommandList: true, filename: __filename },
async(conn, mek, m, {from, pushname, reply}) => {
    await generateSubMenu(conn, from, 'search', '𝐒ᴇᴀʀᴄʜ ᴛᴏʟs', pushname);
});
cmd({ pattern: "aimenu", react: "⚡", dontAddCommandList: true, filename: __filename },
async(conn, mek, m, {from, pushname, reply}) => {
    await generateSubMenu(conn, from, 'ai', '𝐀ɪ ғᴇᴀᴛᴜʀᴇs', pushname);
});
cmd({ pattern: "othermenu", react: "⚡", dontAddCommandList: true, filename: __filename },
async(conn, mek, m, {from, pushname, reply}) => {
    await generateSubMenu(conn, from, 'other', '𝐎ᴛʜᴇʀ ᴜᴛɪʟɪᴛɪᴇs', pushname);
});
