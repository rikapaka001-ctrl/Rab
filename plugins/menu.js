const { cmd, commands } = require('../command');
const { proto, generateWAMessageFromContent } = require('@whiskeysockets/baileys'); // Baileys ekenma gatta
const os = require('os');
const moment = require('moment-timezone');

const botLogo = "https://i.ibb.co/ycY7Nyg6/4f7c2504e62e.jpg";
const ownername = "sʜᴀᴍɪᴋᴀ ᴅᴇɴᴜᴡᴀɴ";
const botname = "𝐑ɪᴋᴀ ᴍɪɴɪ";

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
        const rtime = `${Math.floor(process.uptime()/3600)}h ${Math.floor(process.uptime()/60%60)}m`;
        const time = moment.tz('Asia/Colombo').format('HH');
        let greeting = time >= 4 && time < 12? "Good Morning 🙈" : time >= 12 && time < 17? "Good Afternoon 🙉" : time >= 17 && time < 20? "Good Evening 🙊" : "Good Night";

        // OCHO Box Style Text
        const menuText = `╭───( ${botname.toUpperCase()} )
│
||友 Developer ‹ *${ownername}*
||友 Version ‹ *3.0.0*
||友 Mode ‹ *Public*
||友 RAM ‹ *${ramUsage}*
||友 Uptime ‹ *${rtime}*
||友 User ‹ *${pushname}* 🐉
╰──────────────────●

\`⌥ ᴛʜᴇ ʙᴇꜱᴛ ᴡʜᴀᴛꜱᴀᴘ ʙᴏᴛ 🎀ᯓ\`

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

_𝐑ᴇᴘʟʏ ᴡɪᴛʜ ᴀ ɴᴜᴍʙᴇʀ 1-8 ᴛᴏ ɴᴀᴠɪɢᴀᴛᴇ._`;

        // v7 Product Message = OCHO Card
        const productContent = proto.Message.fromObject({
            productMessage: {
                product: {
                    productImage: { url: botLogo },
                    productImageCount: 1,
                    title: "𝐑ɪᴋᴀ ᴍɪɴɪ ᴠ3.0", 
                    description: "Ends on Dec 31\nCode: RIKA-MINI",
                    currencyCode: "LKR",
                    priceAmount1000: "0", 
                    retailerId: "RIKA"
                },
                businessOwnerJid: conn.user.id.split(':')[0] + '@s.whatsapp.net'
            }
        });

        const msg = await generateWAMessageFromContent(from, productContent, { userJid: from });
        await conn.relayMessage(from, msg.message, { messageId: msg.key.id });
        
        // Caption eka yawanna
        await conn.sendMessage(from, {
            text: menuText,
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: "120363428073031350@newsletter",
                    newsletterName: "Ｒɪᴋᴀ ᴛᴇᴀᴄʜ ᴏꜰᴄ 🐉"
                }
            }
        }, { quoted: mek });

        // Number Reply System
        global.numberStore = global.numberStore || {};
        global.numberStore[msg.key.id] = {
            "1": "mainmenu", "2": "ownermenu", "3": "groupmenu", "4": "logomenu",
            "5": "downloadmenu", "6": "searchmenu", "7": "aimenu", "8": "othermenu"
        };

    } catch (e) {
        console.log(e);
        reply(`*❌ 𝐒ʏsᴛᴇᴍ ᴇʀᴏʀ!*\n\n${e}`);
    }
});

const generateSubMenu = async (conn, from, category, title) => {
    let cmdList = commands.filter(c => c.category === category &&!c.dontAddCommandList).map(c => `│ ⊳ *${c.pattern}*\n│ ${c.desc || 'No Description'}\n│\n`).join('');
    await conn.sendMessage(from, { image: { url: botLogo }, caption: `╭─── « ${title} » ───⟡\n│\n${cmdList || '│ ⊳ 𝐍ᴏ ᴄᴏᴍᴀɴᴅs ғᴏᴜɴᴅ.\n│\n'}╰───────────────⟡\n\n> © 𝐏ᴏᴡᴇʀᴅ ʙʏ ${ownername} ❗` });
};

cmd({ pattern: "logomenu", dontAddCommandList: true }, async(conn, m, {from}) => {
    let logoList = `╭─── « 𝐋ᴏɢᴏ ᴍᴀᴋᴇʀ ᴍᴇɴᴜ » ───⟡\n│\n`;
    logoTypes.forEach((type, index) => logoList += `│ [ ${(index+1).toString().padStart(2, '0')} ] ${type.toUpperCase()}\n`);
    logoList += `│\n╰───────────────⟡\n\n> _𝐑ᴇᴘʟʏ ᴡɪᴛʜ ᴀ ɴᴜᴍʙᴇʀ ᴛᴏ ɢᴇɴᴇʀᴀᴛᴇ._\n> _Ex:.logo 01 Crezy Rika_\n\n> © 𝐏ᴏᴡᴇʀᴅ ʙʏ ${ownername} ❗`;
    await conn.sendMessage(from, { image: { url: botLogo }, caption: logoList });
});

cmd({ pattern: "1", alias: ["mainmenu"], dontAddCommandList: true }, async(conn, m, {from}) => generateSubMenu(conn, from, 'main', '𝐌ᴀɪɴ ᴄᴏᴍᴀɴᴅs'));
cmd({ pattern: "2", alias: ["ownermenu"], dontAddCommandList: true }, async(conn, m, {from}) => generateSubMenu(conn, from, 'owner', '𝐎ᴡɴᴇʀ ᴄᴏᴍᴀɴᴅs'));
cmd({ pattern: "3", alias: ["groupmenu"], dontAddCommandList: true }, async(conn, m, {from}) => generateSubMenu(conn, from, 'group', '𝐆ʀᴏᴜᴘ ᴄᴏᴍᴀɴᴅs'));
cmd({ pattern: "4", alias: ["logomenu"], dontAddCommandList: true }, async(conn, m, {from, pushname}) => conn.sendMessage(from, { image: { url: botLogo }, caption: `Logo Menu` }));
cmd({ pattern: "5", alias: ["downloadmenu"], dontAddCommandList: true }, async(conn, m, {from}) => generateSubMenu(conn, from, 'download', '𝐃ᴏᴡɴʟᴏᴀᴅᴇʀs'));
cmd({ pattern: "6", alias: ["searchmenu"], dontAddCommandList: true }, async(conn, m, {from}) => generateSubMenu(conn, from, 'search', '𝐒ᴇᴀʀᴄʜ ᴛᴏʟs'));
cmd({ pattern: "7", alias: ["aimenu"], dontAddCommandList: true }, async(conn, m, {from}) => generateSubMenu(conn, from, 'ai', '𝐀ɪ ғᴇᴀᴛᴜʀᴇs'));
cmd({ pattern: "8", alias: ["othermenu"], dontAddCommandList: true }, async(conn, m, {from}) => generateSubMenu(conn, from, 'other', '𝐎ᴛʜᴇʀ ᴜᴛɪʟɪᴛɪᴇs'));
