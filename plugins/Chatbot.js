const { cmd } = require('../command');
const axios = require('axios');
const config = require('../config');

global.autoAI = global.autoAI || {};

// Fancy font converter
const fancyFont = (text) => {
    const fonts = {
        'a': 'ᴀ', 'b': 'ʙ', 'c': 'ᴄ', 'd': 'ᴅ', 'e': 'ᴇ', 'f': 'ꜰ', 'g': 'ɢ', 'h': 'ʜ', 'i': 'ɪ', 'j': 'ᴊ',
        'k': 'ᴋ', 'l': 'ʟ', 'm': 'ᴍ', 'n': 'ɴ', 'o': 'ᴏ', 'p': 'ᴘ', 'q': 'ǫ', 'r': 'ʀ', 's': 'ꜱ', 't': 'ᴛ',
        'u': 'ᴜ', 'v': 'ᴠ', 'w': 'ᴡ', 'x': 'x', 'y': 'ʏ', 'z': 'ᴢ',
        'A': '𝐀', 'B': '𝐁', 'C': '𝐂', 'D': '𝐃', 'E': '𝐄', 'F': '𝐅', 'G': '𝐆', 'H': '𝐇', 'I': '𝐈', 'J': '𝐉',
        'K': '𝐊', 'L': '𝐋', 'M': '𝐌', 'N': '𝐍', 'O': '𝐎', 'P': '𝐏', 'Q': '𝐐', 'R': '𝐑', 'S': '𝐒', 'T': '𝐓',
        'U': '𝐔', 'V': '𝐕', 'W': '𝐖', 'X': '𝐗', 'Y': '𝐘', 'Z': '𝐙'
    };
    return text.split('').map(char => fonts[char] || char).join('');
};

// Detect if text is Sinhala or Singlish
const isSinhala = (text) => {
    return /[\u0D80-\u0DFF]/.test(text);
};

const isSinglish = (text) => {
    const singlishWords = ['kohomada', 'ayubowan', 'bohoma', 'hari', 'ow', 'nehe', 'mata', 'oya', 'api', 'eka', 'monada', 'mokak', 'kawda', 'mokadda'];
    const lower = text.toLowerCase();
    return singlishWords.some(word => lower.includes(word)) || /^[a-z\s\?\.]+$/.test(text) && text.length > 3;
};

// AI Reply with Groq API
const getAIReply = async (text) => {
    try {
        let systemPrompt = `You are Rika XMD WhatsApp bot. Reply in the same language the user used.
        If user writes in Sinhala, reply in Sinhala.
        If user writes Singlish (Sinhala in English letters), reply in Sinhala.
        If asked "who made you" or "kawda oyava haduwe", always say "Mama haduwe Shamika Denuwan"`;

        const res = await axios.post("https://api.groq.com/openai/v1/chat/completions", {
            model: "llama-3.1-70b-versatile",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: text }
            ],
            max_tokens: 300,
            temperature: 0.7
        }, {
            headers: {
                "Authorization": `Bearer ${config.GROQ_KEY}`,
                "Content-Type": "application/json"
            }
        });
        return res.data.choices[0].message.content;
    } catch (e) {
        console.log(e.response?.data || e.message);
        return "❌ AI Error";
    }
};

cmd({
    pattern: "ai",
    alias: ["autobot", "chatbot"],
    desc: "Turn auto AI reply on/off",
    react: "🤖",
    category: "ai",
    filename: __filename
},
async (conn, mek, m, { from, args, isGroup, reply }) => {
    const status = args[0]?.toLowerCase();
    if (!status ||!["on", "off"].includes(status)) {
        return reply(`Usage: ${config.PREFIX}ai on/off\n${global.autoAI[from]? "✅ Auto AI is ON" : "❌ Auto AI is OFF"}`);
    }

    if (status === "on") {
        global.autoAI[from] = true;
        reply(`╭───〔 🤖 𝐀𝐮𝐭𝐨 𝐀𝐈 〕───⬣
│
│ ✅ 𝐀𝐮𝐭𝐨 𝐑𝐞𝐩𝐥𝐲: 𝐎𝐍 - 𝐆𝐫𝐨𝐪 𝐋𝐥𝐚𝐦𝐚 3.1
│ 📍 ${isGroup? "𝐆𝐫𝐨𝐮𝐩" : "𝐈𝐧𝐛𝐨𝐱"}
│
│ 💬 𝐒𝐢𝐧𝐡𝐚𝐥𝐚 + 𝐒𝐢𝐧𝐠𝐥𝐢𝐬𝐡 𝐬𝐮𝐩𝐨𝐫𝐭 𝐨𝐧
│
╰────────────────⬣`);
    } else {
        delete global.autoAI[from];
        reply(`╭───〔 🤖 𝐀𝐮𝐭𝐨 𝐀𝐈 〕───⬣
│
│ ❌ 𝐀𝐮𝐭𝐨 𝐑𝐞𝐩𝐥𝐲: 𝐎𝐅
│
╰────────────────⬣`);
    }
});

cmd({
    pattern: ".*",
    dontAddCommandList: true,
    filename: __filename
},
async (conn, mek, m, { from, body, isGroup, reply }) => {
    if (!global.autoAI[from]) return;
    if (!body || body.startsWith(config.PREFIX) || m.key.fromMe) return;

    try {
        const aiResponse = await getAIReply(body);

        // Apply fancy font only if response is in English
        const finalReply = isSinhala(aiResponse)? aiResponse : fancyFont(aiResponse.slice(0, 300)) + (aiResponse.length > 300? "..." : "");

        const styledReply = `╭───〔 🤖 𝐀𝐈 𝐑𝐞𝐩𝐥𝐲 〕───⬣
│
│ ${finalReply}
│
╰────────────────⬣`;

        await conn.sendMessage(from, { text: styledReply }, { quoted: mek });
    } catch (e) {
        console.log(e);
    }
});
