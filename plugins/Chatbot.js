const { cmd } = require('../command');
const axios = require('axios');

global.autoAI = global.autoAI || {};

// Groq API Key - direct here
const GROQ_KEY = "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";

const fancyFont = (text) => {
    const fonts = {
        'a': 'ᴀ', 'b': 'ʙ', 'c': 'ᴄ', 'd': 'ᴅ', 'e': 'ᴇ', 'f': 'ꜰ', 'g': 'ɢ', 'h': 'ʜ', 'i': 'ɪ', 'j': 'ᴊ',
        'k': 'ᴋ', 'l': 'ʟ', 'm': 'ᴍ', 'n': 'ɴ', 'o': 'ᴏ', 'p': 'ᴘ', 'q': 'ǫ', 'r': 'ʀ', 's': 'ꜱ', 't': 'ᴛ',
        'u': 'ᴜ', 'v': 'ᴠ', 'w': 'ᴡ', 'x': 'x', 'y': 'ʏ', 'z': 'ᴢ',
        'A': '𝐀', 'B': '𝐁', 'C': '𝐂', 'D': '𝐃', 'E': '𝐄', 'F': '𝐅', 'G': '𝐆', 'H': '𝐇', 'I': '𝐈', 'J': '𝐉',
        'K': '𝐊', 'L': '𝐋', 'M': '𝐌', 'N': '𝐍', 'O': '𝐎', 'P': '𝐏', 'Q': '𝐐', 'R': '𝐑', 'S': '𝐒', 'T': '𝐓',
        'U': '𝐔', 'V': '𝐕', 'W': '𝐖', 'X': '𝐗', 'Y': '𝐘', 'Z': '𝐙'
    };
    return text.split('').map(char => fonts || char).join('');
};

const isSinhala = (text) => /[\u0D80-\u0DFF]/.test(text);

const getAIReply = async (text) => {
    try {
        const systemPrompt = `You are Rika XMD WhatsApp bot. Reply in the same language the user used. If user writes in Sinhala or Singlish, reply in Sinhala. If asked "who made you" or "kawda oyava haduwe", always say "Mama haduwe Shamika Denuwan"`;

        const res = await axios.post("https://api.groq.com/openai/v1/chat/completions", {
            model: "llama-3.1-8b-instant",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: text }
            ],
            max_tokens: 200,
            temperature: 0.7
        }, {
            headers: {
                "Authorization": `Bearer ${GROQ_KEY}`,
                "Content-Type": "application/json"
            },
            timeout: 15000
        });
        return res.data.choices[0].message.content;
    } catch (e) {
        console.log("GROQ ERROR:", e.response?.data || e.message);
        return `❌ Error: ${e.response?.data?.error?.message || e.message}`;
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
        return reply(`Usage:.ai on/off\n${global.autoAI[from]? "✅ Auto AI is ON" : "❌ Auto AI is OFF"}`);
    }

    if (status === "on") {
        global.autoAI[from] = true;
        reply(`╭───〔 🤖 𝐀𝐮𝐭𝐨 𝐀𝐈 〕───⬣\n│\n│ ✅ 𝐎𝐍 - 𝐆𝐫𝐨𝐪 𝐋𝐥𝐚𝐦𝐚 3.1\n│ 📍 ${isGroup? "𝐆𝐫𝐨𝐮𝐩" : "𝐈𝐧𝐛𝐨𝐱"}\n╰────────────────⬣`);
    } else {
        delete global.autoAI[from];
        reply(`╭───〔 🤖 𝐀𝐮𝐭𝐨 𝐀𝐈 〕───⬣\n│\n│ ❌ 𝐎𝐅\n╰────────────────⬣`);
    }
});

cmd({
    pattern: ".*",
    dontAddCommandList: true,
    filename: __filename
},
async (conn, mek, m, { from, body, isGroup, reply }) => {
    if (!global.autoAI[from]) return;
    if (!body || m.key.fromMe) return;

    try {
        const aiResponse = await getAIReply(body);
        const finalReply = isSinhala(aiResponse)? aiResponse : fancyFont(aiResponse.slice(0, 200)) + (aiResponse.length > 200? "..." : "");
        const styledReply = `╭───〔 🤖 𝐀𝐈 𝐑𝐞𝐩𝐥𝐲 〕───⬣\n│\n│ ${finalReply}\n╰────────────────⬣`;
        await conn.sendMessage(from, { text: styledReply }, { quoted: mek });
    } catch (e) {
        console.log(e);
    }
});
