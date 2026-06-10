const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../database/meinfo.json');

// DB read/write
function loadDB() {
    if (!fs.existsSync(dbPath)) {
        fs.writeFileSync(dbPath, '{}');
    }
    return JSON.parse(fs.readFileSync(dbPath));
}

function saveDB(data) {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

// Stylish format - Pro Version
function formatInfo(data) {
    return `◈━━━━━━━━◈
   ᯓ✦ 𝗠𝗬 𝗜𝗡𝗙𝗢 𝗖𝗔𝗥𝗗 ✦ᯓ
◈━━━━━━━━◈

┊✿ 𝗡𝗮𝗺𝗲 ┊ ${data.name || '✗ Not Set'}
┊❀ 𝗩𝗶𝗹𝗮𝗴𝗲 ┊ ${data.village || '✗ Not Set'}
┊✗ 𝗔𝗴𝗲 ┊ ${data.age || '✗ Not Set'} yrs
┊ᯓ 𝗚𝗲𝗻𝗱𝗲𝗿 ┊ ${data.gender || '✗ Not Set'}

◈━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━◈
      🎀🙊 ᴘᴏᴡᴇʀᴇᴅ ʙʏ ʀɪᴋᴀ xᴍᴅ 🙊🎀
◈━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━◈`;
}

let handler = async (m, { conn, args, command }) => {
    const userId = m.sender;
    const db = loadDB();

    if (!db[userId]) db[userId] = {};

    if (command === 'setmeinfo') {
        if (!args[0]) {
            return m.reply(`Usage:.setmeinfo Name|Village|Age|Gender\nExample:.setmeinfo Shamika|Galle|18|Male`);
        }

        const [name, village, age, gender] = args.join(' ').split('|').map(x => x.trim());

        if (!name ||!village ||!age ||!gender) {
            return m.reply(`❌ Wrong format!\nUse:.setmeinfo Name|Village|Age|Gender`);
        }

        db[userId] = { name, village, age, gender };
        saveDB(db);

        return m.reply(`✅ *Info Saved Successfully!*\n\n${formatInfo(db[userId])}`);
    }

    if (command === 'meinfo') {
        if (!db[userId].name) {
            return m.reply(`❌ You haven't set info yet!\nUse:.setmeinfo Name|Village|Age|Gender`);
        }

        return m.reply(formatInfo(db[userId]));
    }
}

handler.command = ['meinfo', 'setmeinfo'];
handler.help = ['meinfo', 'setmeinfo Name|Village|Age|Gender'];
handler.tags = ['tools'];

module.exports = handler;
