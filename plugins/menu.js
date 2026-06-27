const { cmd, commands } = require('../command');
const os = require('os');
const moment = require('moment-timezone');

const botLogo = "https://i.ibb.co/ycY7Nyg6/4f7c2504e62e.jpg";

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

        const menuText = `┏╍⌈ *🐲𝐑ɪᴋᴀ ᴍɪɴɪ ʙᴏᴛ-ᴍᴇɴᴜ🧧* ⌋┅×
│
│ ⊳ *𝗛ɪ ${pushname}, ${greeting}!*
│
│ ◈ 𝐕ᴇʀsɪᴏɴ : 3.0.0
│ ◈ 𝐎ᴡɴᴇʀ : sʜᴀᴍɪᴋᴀ ᴅᴇɴᴜᴡᴀɴ
│ ◈ 𝐑ᴀᴍ : ${ramUsage}
│ ◈ 𝐔ᴘᴛɪᴍᴇ : ${rtime}
│ ◈ 𝐇ᴏsᴛ : ${hostname}
│
╰─────────────⧼

\`⌥ ᴛʜᴇ ʙᴇꜱᴛ ᴡʜᴀᴛꜱᴀᴘᴘ ʙᴏᴛ 🎀ᯓ\`
\`⌥ ᴘᴏᴡᴇʀᴅ ʙʏ ʀɪᴋᴀ ᴛᴇᴀᴄʜ  🎀ᯓ\`

╭─── « \`𝐂ᴏᴍᴀɴᴅ ᴘᴀɴᴇʟ\` » ───⟡
│
│ [ 𝟭 ] 𝐌ᴀɪɴ ᴍᴇɴᴜ 😻
│ [ 𝟮 ] 𝐎ᴡɴᴇʀ ᴍᴇɴᴜ 👑
│ [ 𝟯 ] 𝐆ʀᴏᴜᴘ ᴍᴇɴᴜ 👻
│ [ 𝟰 ] 𝐋ᴏɢᴏ ᴍᴇɴᴜ 🧚‍♂️
│ [ 𝟱 ] 𝐃ᴏᴡɴʟᴏᴀᴅs 🙊
│ [ 𝟲 ] 𝐒ᴇᴀʀᴄʜ ᴍᴇɴᴜ 💗
│ [ 𝟳 ] 𝐀ɪ ғᴇᴀᴛᴜʀᴇs 💋
│ [ 𝟴 ] 𝐎ᴛʜᴇʀ ᴛᴏʟs 💕
│
┗━┫ *🐲𝐑ɪᴋᴀ 𝐗ᴍᴅ ᴍɪɴɪ ʙᴏᴛ-ᴍᴇɴᴜ📃* ⌋┅×

_𝐑ᴇᴘʟʏ ᴡɪᴛʜ ᴀ ɴᴜᴍʙᴇʀ ᴛᴏ ɴᴀᴠɪɢᴀᴛᴇ._`;

        // Alive වගේම url use කරපන්, buffer නෙවෙයි
        const sentMsg = await conn.sendMessage(from, {
    image: { url: botLogo },
    caption: menuText,
    contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: "120363428073031350@newsletter",
            newsletterName: "Ｒɪᴋᴀ ᴛᴇᴀᴄʜ ᴏꜰᴄ 🐉"
        }
    }
}); // <-- quoted: mek අයින් කලා

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
                cmdList += `│ ⊳ *${commands[i].pattern}*\n│ ${commands[i].desc || 'No Description'}\n│\n`;
            }
        }
        if (cmdList === '') cmdList = `│ ⊳ 𝐍ᴏ ᴄᴏᴍᴀɴᴅs ғᴏᴜɴᴅ.\n│\n`;

        let menuContent = `╭─── « 𝐑ɪᴋᴀ-xᴍᴅ ᴍɪɴɪ ᴠ3 » ───⟡
│
│ ⊳ *${title}*
│
${cmdList}╰───────────────⟡

> © 𝐏ᴏᴡᴇʀᴅ ʙʏ ꜱʜᴀᴍɪᴋᴀ ᴅᴇɴᴜᴡᴀɴ ❗`;

        await conn.sendMessage(from, { image: { url: botLogo }, caption: menuContent });
    } catch (e) {
        reply('*❌ 𝐒ᴜʙᴍᴇɴᴜ ᴇʀᴏʀ!!*');
        console.log(e);
    }
};

cmd({ pattern: "logomenu", dontAddCommandList: true, filename: __filename },
async(conn, mek, m, {from, pushname, reply}) => {
    try {
        let logoList = `╭─── « 𝐑ɪᴋᴀ-xᴍᴅ ᴍɪɴɪ ᴠ1 » ───⟡
│
│ ⊳ *𝐋ᴏɢᴏ ᴍᴀᴋᴇʀ ᴍᴇɴᴜ*
│
`;
        logoTypes.forEach((type, index) => {
            let num = (index + 1).toString().padStart(2, '0');
            logoList += `│ [ ${num} ] ${type.toUpperCase()}\n`;
        });
        logoList += `│
╰───────────────⟡

> _𝐑ᴇᴘʟʏ ᴡɪᴛʜ ᴀ ɴᴜᴍʙᴇʀ ᴛᴏ ɢᴇɴᴇʀᴀᴛᴇ._
> _𝐓ᴏ sᴇᴛ ᴄᴜsᴛᴏᴍ ɴᴀᴍᴇ:.ʟᴏɢᴏ <ɴᴀᴍᴇ>_

> © 𝐏ᴏᴡᴇʀᴅ ʙʏ ꜱʜᴀᴍɪᴋᴀ ᴅᴇɴᴜᴡᴀɴ ❗`;

        const sentMsg = await conn.sendMessage(from, { image: { url: botLogo }, caption: logoList });
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
