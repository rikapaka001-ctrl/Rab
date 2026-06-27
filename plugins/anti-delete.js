const { cmd, events } = require('../command');
const fs = require('fs');
const path = require('path');
const { downloadContentFromMessage } = require('@whiskeysockets/baileys');

const tempFolder = path.join(__dirname, '../temp');
if (!fs.existsSync(tempFolder)) {
  fs.mkdirSync(tempFolder, { recursive: true });
}

const messageStore = new Map();
const mediaStore = new Map();
const CLEANUP_TIME = 10 * 60 * 1000; // 10min

function unwrapMessage(message) {
  if (!message) return null;
  if (message.ephemeralMessage) return unwrapMessage(message.ephemeralMessage.message);
  if (message.viewOnceMessageV2) return unwrapMessage(message.viewOnceMessageV2.message);
  if (message.viewOnceMessage) return unwrapMessage(message.viewOnceMessage.message);
  return message;
}

function getExtension(type, msg) {
  switch (type) {
    case 'imageMessage': return '.jpg';
    case 'videoMessage': return '.mp4';
    case 'audioMessage': return '.ogg';
    case 'stickerMessage': return '.webp';
    case 'documentMessage':
      return msg.documentMessage?.fileName? path.extname(msg.documentMessage.fileName) : '.bin';
    default: return '.bin';
  }
}

// ============= ANTI-DELETE SYSTEM =============
events.on('messages.upsert', async (conn, { messages }) => {
    const msg = messages[0];
    if (!msg?.message || msg.key.fromMe) return;

    const keyId = msg.key.id;
    const cleanMessage = unwrapMessage(msg.message);
    if (!cleanMessage) return;

    messageStore.set(keyId, {
      key: msg.key,
      message: cleanMessage,
      remoteJid: msg.key.remoteJid
    });

    const type = Object.keys(cleanMessage)[0];
    const mediaTypes = ['imageMessage','videoMessage','audioMessage','stickerMessage','documentMessage'];
    if (!mediaTypes.includes(type)) return;

    try {
      const stream = await downloadContentFromMessage(cleanMessage[type], type.replace('Message', ''));
      let buffer = Buffer.from([]);
      for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);
      if (!buffer.length) return;

      const ext = getExtension(type, cleanMessage);
      const filePath = path.join(tempFolder, `${keyId}${ext}`);
      await fs.promises.writeFile(filePath, buffer);
      mediaStore.set(keyId, filePath);

      setTimeout(() => {
        messageStore.delete(keyId);
        if (mediaStore.has(keyId)) {
          try { fs.unlinkSync(mediaStore.get(keyId)); } catch {}
          mediaStore.delete(keyId);
        }
      }, CLEANUP_TIME);

    } catch (err) {
      console.log('❌ AntiDelete media error:', err.message);
    }
});

events.on('messages.update', async (conn, updates) => {
    for (const { key, update } of updates) {
      if (!key?.id || update?.message!== null) continue; // delete wenakota witharai

      const keyId = key.id;
      const stored = messageStore.get(keyId);
      if (!stored) continue;

      const from = key.remoteJid;
      const sender = key.participant || from;

      let caption = `🗑️ *Deleted Message Recovered*\n\n👤 *Sender:* @${sender.split('@')[0]}\n🕒 *Time:* ${new Date().toLocaleString('en-LK', {timeZone: 'Asia/Colombo'})}`;

      try {
        const mediaPath = mediaStore.get(keyId);
        if (mediaPath && fs.existsSync(mediaPath)) {
          const opts = { caption, mentions: [sender] };

          if (mediaPath.endsWith('.jpg')) {
            await conn.sendMessage(from, { image: { url: mediaPath },...opts });
          } else if (mediaPath.endsWith('.mp4')) {
            await conn.sendMessage(from, { video: { url: mediaPath },...opts });
          } else if (mediaPath.endsWith('.webp')) {
            await conn.sendMessage(from, { sticker: { url: mediaPath } });
            await conn.sendMessage(from, { text: caption, mentions: [sender] });
          } else if (mediaPath.endsWith('.ogg')) {
            await conn.sendMessage(from, { audio: { url: mediaPath }, mimetype: 'audio/ogg; codecs=opus' });
            await conn.sendMessage(from, { text: caption, mentions: [sender] });
          } else {
            await conn.sendMessage(from, { document: { url: mediaPath },...opts });
          }
          continue;
        }

        const msgObj = stored.message;
        let text = msgObj.conversation || msgObj.extendedTextMessage?.text || msgObj.imageMessage?.caption || msgObj.videoMessage?.caption || '';
        await conn.sendMessage(from, {
          text: text? `${caption}\n\n📝 *Message:* ${text}` : caption,
          mentions: [sender]
        });

      } catch (err) {
        console.log('❌ AntiDelete resend error:', err.message);
      }
    }
});

// ============= ON/OFF COMMAND =============
cmd({
    pattern: 'antidelete',
    alias: ['antidel', 'recover'],
    desc: 'Turn Anti-Delete on/off',
    category: 'settings',
    react: '🗑️',
    use: '.antidelete on/off'
},
async(conn, mek, m, { from, args, reply }) => {
    if (!global.ANTIDELETE) global.ANTIDELETE = true; // default on

    if (args[0] === 'off') {
        global.ANTIDELETE = false;
        return reply('🗑️ *Anti-Delete OFF කරා*');
    } else if (args[0] === 'on') {
        global.ANTIDELETE = true;
        return reply('🗑️ *Anti-Delete ON කරා*');
    }
    reply(`🗑️ *Anti-Delete Status:* ${global.ANTIDELETE? 'ON ✅' : 'OFF ❌'}\n\nUse:.antidelete on/off`);
});
