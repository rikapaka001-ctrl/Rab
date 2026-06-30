const { cmd, commands } = require('../command');
const config = require('../config');
const os = require('os');
const moment = require('moment-timezone');

const botLogo = "https://i.ibb.co/ycY7Nyg6/4f7c2504e62e.jpg";

const logoTypes = ["neon","neon2","fire2","glitch","hacker","futuristic","thunder","devil","fire","ice","snow","lava","metal","gold","silver","glossy","blackpink","transformer","horror","blood","joker","galaxy","space","cloud","sand","stone","magma","gradient","light","paper","watercolor","candy","christmas","luxury","leaf","summer","circuit","block3d","cartoon","chrome","frozen"];

cmd({
    pattern: "menu",
    alias: ["panel", "rikalist", "commands"],
    desc: "Show main menu.",
    category: "main",
    react: "📁",
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

        // === META AI STYLE HEADER ===
        const menuText = `
╭─❏─ׄ─ׄ─❍─ׄ─ׄ─❍─ׄ─ׄ─❏─╮
│ 𝘿𝙏𝙕 𝙈𝙄𝙉𝙄 𝘽𝙊𝙏 𝙑3.0 ✦
│ 𝙋𝙤𝙬𝙚𝙧𝙚𝙙 𝘽𝙮 𝙎𝙝𝙖𝙢𝙞𝙠𝙖 🐉
╰─❏─ׄ─ׄ─❍─ׄ─ׄ─❍─ׄ─ׄ─❏─╯

┌─「 𝙎𝙏𝘼𝙏𝙐𝙎 」─
│ 👋 𝙐𝙨𝙚𝙧: ${pushname}
│ 🌤️ ${greeting}
│ 👑 𝘿𝙚𝙫: Ｓʜᴀᴍɪᴋᴀ ᴅᴇɴᴜᴡᴀɴ
│ ⚙️ 𝙈𝙤𝙙𝙚: ${config.WORK_TYPE}
│ 📊 𝙍𝘼𝙈: ${ramUsage}
│ ⏱️ 𝙐𝙥𝙩𝙞𝙢𝙚: ${rtime}
│ 🖥️ 𝙃𝙤𝙨𝙩: ${hostname}
└─────────────────────────

> ⌥ 𝙏𝙝𝙚 𝘽𝙚𝙨𝙩 𝙒𝙝𝙖𝙩𝙨𝘼𝙥 𝘽𝙤𝙩 🎀ᯓ

╭─「 𝘾𝙊𝙈𝘼𝙉𝘿 𝙋𝘼𝙉𝙀𝙇 」─╮
│
│ ❶ 𝙈𝙖𝙞𝙣 𝙈𝙚𝙣𝙪 😻
│ ❷ 𝙊𝙬𝙣𝙚𝙧 𝙈𝙚𝙣𝙪 👑
│ ❸ 𝙂𝙧𝙤𝙪𝙥 𝙈𝙚𝙣𝙪 👻
│ ❹ 𝙇𝙤𝙜𝙤 𝙈𝙚𝙣𝙪 🧚‍♂️
│ ❺ 𝘿𝙤𝙬𝙣𝙡𝙤𝙖𝙙𝙨 🙊
│ ❻ 𝙎𝙚𝙖𝙧𝙘𝙝 𝙈𝙚𝙣𝙪 💗
│ ❼ 𝘼𝙄 𝙁𝙚𝙖𝙩𝙪𝙧𝙚𝙨 💋
│ ❽ 𝙊𝙩𝙝𝙚𝙧 𝙏𝙤𝙡𝙨 💕
│
╰─❏ 𝙍𝙚𝙥𝙡𝙮 1-8 ❏─╯
`;

        // === SCREENSHOT EKE WAGE 100% === BUTTON ARAYA
        const sentMsg = await conn.sendMessage(from, {
            image: { url: botLogo },
            caption: menuText,
            contextInfo: { // MEKEN THAMAI 999 ENNE ✅
                forwardingScore: 999, // 999 items
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: "120363428073031350@newsletter",
                    newsletterName: "DTZ MINI BOT V 3.0" // Oya oni name eka
                }
            }
        }, { quoted: mek });

        const msgId = sentMsg.key.id;
        global.numberStore = global.numberStore || {};
        global.numberStore[msgId] = {
            "1": "mainmenu",
            "2": "ownermenu",
            "3": "groupmenu",
            "4": "logomenu",
            "5": "downloadmenu",
            "6": "searchmenu",
            "7": "aimenu",
            "8": "othermenu"
        };

    } catch (e) {
        console.log(e);
        reply(`*❌ 𝐒ʏsᴛᴇᴍ ᴇʀᴏʀ!*\n\n${e}`);
    }
});

const generateSubMenu = async (conn, mek, from, category, title, pushname, reply) => {
    try {
        let cmdList = '';
        for (let i = 0; i < commands.length; i++) {
            if (commands[i].category === category &&!commands[i].dontAddCommandList) {
                cmdList += `│ ⊳ *${prefix}${commands[i].pattern}*\n│ ${commands[i].desc || 'No Description'}\n│\n`;
            }
        }
        if (cmdList === '') cmdList = `│ ⊳ 𝐍ᴏ ᴄᴏᴍᴀɴᴅs ғᴏᴜɴᴅ.\n│\n`;

        let menuContent = `╭─「 ${title} 」─╮
│
${cmdList}╰───────────────╯

> © 𝐏ᴏᴡᴇʀᴅ ʙʏ ꜱʜᴀᴍɪᴋᴀ ᴅᴇɴᴜᴡᴀɴ ❗`;

        await conn.sendMessage(from, { image: { url: botLogo }, caption: menuContent }, { quoted: mek }); // Footer/buttons arala
    } catch (e) {
        reply('*❌ 𝐒ᴜʙᴍᴇɴᴜ ᴇʀᴏʀ!!*');
        console.log(e);
    }
};

cmd({ pattern: "logomenu", dontAddCommandList: true, filename: __filename },
async(conn, mek, m, {from, pushname, reply}) => {
    try {
        let logoList = `╭─「 𝐋ᴏɢᴏ ᴍᴀᴋᴇʀ 」─╮
│
│ ⊳ *${logoTypes.length} 𝙎𝙩𝙮𝙡𝙚𝙨 𝘼𝙫𝙖𝙞𝙡𝙖𝙗𝙡𝙚*
│
`;
        logoTypes.forEach((type, index) => {
            let num = (index + 1).toString().padStart(2, '0');
            logoList += `│ [ ${num} ] ${type.toUpperCase()}\n`;
        });
        logoList += `│
╰───────────────╯

> _𝙍𝙚𝙥𝙡𝙮 𝙬𝙞𝙩𝙝 𝙖 𝙉𝙪𝙢𝙗𝙚𝙧_
> _𝙀𝙭:.𝙡𝙤𝙜𝙤 01 𝙎𝙝𝙖𝙢𝙞𝙠𝙖_

> © 𝐏ᴏᴡᴇʀᴅ ʙʏ ꜱʜᴀᴍɪᴋᴀ ᴅᴇɴᴜᴡᴀɴ ❗`;

        const sentMsg = await conn.sendMessage(from, { image: { url: botLogo }, caption: logoList }, { quoted: mek }); // Footer/buttons arala
        const msgId = sentMsg.key.id;
        global.numberStore = global.numberStore || {};
        global.numberStore[msgId] = {};
        logoTypes.forEach((type, index) => {
            global.numberStore[msgId][(index + 1).toString()] = `genlogo ${type}&${pushname}`;
        });
    } catch (e) {
        reply('*❌ 𝐋ᴏɢᴏ ᴍᴇɴᴜ ᴇʀᴏʀ!*');
        console.log(e);
    }
});

cmd({ pattern: "mainmenu", react: "⚡", dontAddCommandList: true, filename: __filename },
async(conn, mek, m, {from, pushname, reply}) => {
    await generateSubMenu(conn, mek, from, 'main', '𝐌ᴀɪɴ ᴄᴏᴍᴀɴᴅs', pushname, reply);
});
cmd({ pattern: "ownermenu", react: "⚡", dontAddCommandList: true, filename: __filename },
async(conn, mek, m, {from, pushname, reply}) => {
    await generateSubMenu(conn, mek, from, 'owner', '𝐎ᴡɴᴇʀ ᴄᴏᴍᴀɴᴅs', pushname, reply);
});
cmd({ pattern: "groupmenu", react: "⚡", dontAddCommandList: true, filename: __filename },
async(conn, mek, m, {from, pushname, reply}) => {
    await generateSubMenu(conn, mek, from, 'group', '𝐆ʀᴏᴜᴘ ᴄᴏᴍᴀɴᴅs', pushname, reply);
});
cmd({ pattern: "downloadmenu", react: "⚡", dontAddCommandList: true, filename: __filename },
async(conn, mek, m, {from, pushname, reply}) => {
    await generateSubMenu(conn, mek, from, 'download', '𝐃ᴏᴡɴʟᴏᴀᴅᴇʀs', pushname, reply);
});
cmd({ pattern: "searchmenu", react: "⚡", dontAddCommandList: true, filename: __filename },
async(conn, mek, m, {from, pushname, reply}) => {
    await generateSubMenu(conn, mek, from, 'search', '𝐒ᴇᴀʀᴄʜ ᴛᴏʟs', pushname, reply);
});
cmd({ pattern: "aimenu", react: "⚡", dontAddCommandList: true, filename: __filename },
async(conn, mek, m, {from, pushname, reply}) => {
    await generateSubMenu(conn, mek, from, 'ai', '𝐀ɪ ғᴇᴀᴛᴜʀᴇs', pushname, reply);
});
cmd({ pattern: "othermenu", react: "⚡", dontAddCommandList: true, filename: __filename },
async(conn, mek, m, {from, pushname, reply}) => {
    await generateSubMenu(conn, mek, from, 'other', '𝐎ᴛʜᴇʀ ᴜᴛɪʟɪᴛɪᴇs', pushname, reply);
});
