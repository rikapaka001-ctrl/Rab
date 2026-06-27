const config = require('../config')
const { cmd } = require('../command')

async function checkAdmins(conn, groupId, senderJid) {
    const metadata = await conn.groupMetadata(groupId);
    const botJid = conn.user.id.split(':')[0] + '@s.whatsapp.net';
    const admins = metadata.participants.filter(p => p.admin).map(p => p.id);
    return {
        isBotAdmin: admins.includes(botJid),
        isSenderAdmin: admins.includes(senderJid),
        admins: admins
    };
}

// ============= PROMOTE =============
cmd({
    pattern: "promote",
    alias: ["p"],
    desc: "Promote a member to admin.",
    category: "group",
    react: "🔼"
},
async (conn, mek, m, { from, isGroup, reply }) => {
    try {
        if (!isGroup) return reply('❌ *Meka group ekaka witharai*')

        const { isBotAdmin, isSenderAdmin } = await checkAdmins(conn, from, m.sender);
        if (!isBotAdmin) return reply('❌ *Bot eka admin karapan pahala*')
        if (!isSenderAdmin) return reply('❌ *Admins lata witharai*')

        const user = m.mentionedJid[0] || m.quoted?.sender
        if (!user) return reply('❌ *@tag karapan nathnam reply karapan*')

        await conn.groupParticipantsUpdate(from,, 'promote') // FIX: thiyenawa
        await reply(`🔼 @${user.split('@')[0]} *Admin karala* ✅`, { mentions: })
    } catch (e) {
        console.log(e)
        reply(`❌ Error: ${e.message || e}`)
    }
})

// ============= DEMOTE =============
cmd({
    pattern: "demote",
    alias: ["d"],
    desc: "Demote an admin to member.",
    category: "group",
    react: "🔽"
},
async (conn, mek, m, { from, isGroup, reply }) => {
    try {
        if (!isGroup) return reply('❌ *Meka group ekaka witharai*')

        const { isBotAdmin, isSenderAdmin } = await checkAdmins(conn, from, m.sender);
        if (!isBotAdmin) return reply('❌ *Bot eka admin karapan*')
        if (!isSenderAdmin) return reply('❌ *Admins lata witharai*')

        const user = m.mentionedJid[0] || m.quoted?.sender
        if (!user) return reply('❌ *@tag karapan nathnam reply karapan*')

        await conn.groupParticipantsUpdate(from,, 'demote') // FIX: thiyenawa
        await reply(`🔽 @${user.split('@')[0]} *Member karala* ✅`, { mentions: })
    } catch (e) {
        console.log(e)
        reply(`❌ Error: ${e.message || e}`)
    }
})

// ============= KICK =============
cmd({
    pattern: "kick",
    alias: ["remove", "ban"],
    desc: "Remove a member from the group.",
    category: "group",
    react: "👢"
},
async (conn, mek, m, { from, isGroup, reply }) => {
    try {
        if (!isGroup) return reply('❌ *Meka group ekaka witharai*')

        const { isBotAdmin, isSenderAdmin } = await checkAdmins(conn, from, m.sender);
        if (!isBotAdmin) return reply('❌ *Bot eka admin karapan*')
        if (!isSenderAdmin) return reply('❌ *Admins lata witharai*')

        const user = m.mentionedJid[0] || m.quoted?.sender
        if (!user) return reply('❌ *@tag karapan nathnam reply karapan*')
        if (user === m.sender) return reply('❌ *Nikan hari yako*')

        await conn.groupParticipantsUpdate(from,, 'remove') // FIX: thiyenawa
        await reply(`👢 @${user.split('@')[0]} *Aragatta* ✅`, { mentions: })
    } catch (e) {
        console.log(e)
        reply(`❌ Error: ${e.message || e}`)
    }
})

// ============= TAGALL / HIDETAG =============
cmd({
    pattern: "tagall",
    alias: ["hidetag", "everyone"],
    desc: "Tag all members",
    category: "group",
    react: "📢"
},
async (conn, mek, m, { from, q, isGroup, reply }) => {
    if (!isGroup) return reply('❌ *Group ekaka witharai*')

    const { isBotAdmin, isSenderAdmin } = await checkAdmins(conn, from, m.sender);
    if (!isSenderAdmin) return reply('❌ *Admins lata witharai*')
    if (!isBotAdmin) return reply('❌ *Bot eka admin karapan*')

    const metadata = await conn.groupMetadata(from);
    let members = metadata.participants.map(u => u.id)
    if (members.length === 0) return reply('❌ *Members data nathi*')

    let msg = q || '📢 Attention Everyone!'
    let text = `╭───〔 *TAG ALL* 〕───⬣\n│\n│ 💬 ${msg}\n│\n`
    members.forEach(mem => text += `│ 👉 @${mem.split('@')[0]}\n`)
    text += `╰────────────────⬣\n> ＰᴏᴡᴇʀᴇᴅＢʏ ＳʜᴀᴍɪᴋᴀＤᴇɴᴜᴡᴀɴ 🐉`

    await conn.sendMessage(from, { text, mentions: members }, { quoted: mek })
})

// ============= TAG ADMINS =============
cmd({
    pattern: "tagadmin",
    alias: ["admins"],
    desc: "Tag all admins",
    category: "group",
    react: "👑"
},
async (conn, mek, m, { from, q, isGroup, reply }) => {
    if (!isGroup) return reply('❌ *Group ekaka witharai*')

    const { isSenderAdmin } = await checkAdmins(conn, from, m.sender);
    if (!isSenderAdmin) return reply('❌ *Admins lata witharai*')

    const metadata = await conn.groupMetadata(from);
    let admins = metadata.participants.filter(p => p.admin).map(u => u.id)
    if (admins.length === 0) return reply('❌ *Admins na*')

    let msg = q || '👑 Calling Admins!'
    let text = `╭───〔 *TAG ADMINS* 〕───⬣\n│\n│ 💬 ${msg}\n│\n`
    admins.forEach(adm => text += `│ 👑 @${adm.split('@')[0]}\n`)
    text += `╰────────────────⬣`

    await conn.sendMessage(from, { text, mentions: admins }, { quoted: mek })
})
