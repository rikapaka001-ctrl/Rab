const config = require('../config')
const { cmd } = require('../command')

// ============= PROMOTE =============
cmd({
    pattern: "promote",
    alias: ["p"],
    desc: "Promote a member to admin.",
    category: "group",
    react: "🔼",
    filename: __filename
},
async (conn, mek, m, { from, isGroup, isAdmins, isBotAdmins, reply }) => {
    try {
        if (!isGroup) return reply('❌ *Meka group ekaka witharai*')
        if (!isBotAdmins) return reply('❌ *Bot eka admin karapan pahala*')
        if (!isAdmins) return reply('❌ *Admins lata witharai*')

        const user = m.mentionedJid[0] || m.quoted?.sender
        if (!user) return reply('❌ *@tag karapan nathnam reply karapan*')

        await conn.groupParticipantsUpdate(from, [user], 'promote')
        await reply(`🔼 @${user.split('@')[0]} *Admin karala* ✅`, { mentions: [user] })
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
    react: "🔽",
    filename: __filename
},
async (conn, mek, m, { from, isGroup, isAdmins, isBotAdmins, reply }) => {
    try {
        if (!isGroup) return reply('❌ *Meka group ekaka witharai*')
        if (!isBotAdmins) return reply('❌ *Bot eka admin karapan*')
        if (!isAdmins) return reply('❌ *Admins lata witharai*')

        const user = m.mentionedJid[0] || m.quoted?.sender
        if (!user) return reply('❌ *@tag karapan nathnam reply karapan*')

        await conn.groupParticipantsUpdate(from, [user], 'demote')
        await reply(`🔽 @${user.split('@')[0]} *Member karala* ✅`, { mentions: [user] })
    } catch (e) {
        console.log(e)
        reply(`❌ Error: ${e.message || e}`)
    }
})

// ============= KICK/REMOVE =============
cmd({
    pattern: "kick",
    alias: ["remove", "remo"],
    desc: "Remove a member from the group.",
    category: "group",
    react: "👢",
    filename: __filename
},
async (conn, mek, m, { from, isGroup, isAdmins, isBotAdmins, reply }) => {
    try {
        if (!isGroup) return reply('❌ *Meka group ekaka witharai*')
        if (!isBotAdmins) return reply('❌ *Bot eka admin karapan*')
        if (!isAdmins) return reply('❌ *Admins lata witharai*')

        const user = m.mentionedJid[0] || m.quoted?.sender
        if (!user) return reply('❌ *@tag karapan nathnam reply karapan*')
        if (user === m.sender) return reply('❌ *Nikan hari yako*')

        await conn.groupParticipantsUpdate(from, [user], 'remove')
        await reply(`👢 @${user.split('@')[0]} *Aragatta* ✅`, { mentions: [user] })
    } catch (e) {
        console.log(e)
        reply(`❌ Error: ${e.message || e}`)
    }
})

// ============= ADD =============
cmd({
    pattern: "add",
    desc: "Add a member to the group.",
    category: "group",
    react: "➕",
    filename: __filename
},
async (conn, mek, m, { from, q, isGroup, isAdmins, isBotAdmins, reply }) => {
    try {
        if (!isGroup) return reply('❌ *Meka group ekaka witharai*')
        if (!isBotAdmins) return reply('❌ *Bot eka admin karapan*')
        if (!isAdmins) return reply('❌ *Admins lata witharai*')

        let number = q.replace(/[^0-9]/g,'');
        if (!number) return reply('❌ *Ex:.add 94771234567*')

        let user = number + '@s.whatsapp.net';
        await conn.groupParticipantsUpdate(from, [user], 'add')
        await reply(`➕ @${number} *Add karanna try kala* ✅`, { mentions: [user] })
    } catch (e) {
        console.log(e)
        reply(`❌ Error: ${e.message || e}\n*Note: Private na unoth add karanna beri*`)
    }
})

// ============= TAGALL / HIDETAG =============
cmd({
    pattern: "tagall",
    alias: ["hidetag", "everyone"],
    desc: "Tag all members",
    category: "group",
    react: "📢",
    filename: __filename
},
async (conn, mek, m, { from, q, isGroup, isAdmins, isBotAdmins, participants, reply }) => {
    if (!isGroup) return reply('❌ *Group ekaka witharai*')
    if (!isAdmins) return reply('❌ *Admins lata witharai*')
    if (!isBotAdmins) return reply('❌ *Bot eka admin karapan*')
    if (!participants || participants.length === 0) return reply('❌ *Members data nathi*')

    let msg = q || '📢 Attention Everyone!'
    let members = participants.map(u => u.id)

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
    react: "👑",
    filename: __filename
},
async (conn, mek, m, { from, q, isGroup, isAdmins, isBotAdmins, groupMetadata, reply }) => {
    if (!isGroup) return reply('❌ *Group ekaka witharai*')
    if (!isAdmins) return reply('❌ *Admins lata witharai*')
    if (!isBotAdmins) return reply('❌ *Bot eka admin karapan*')

    if (!groupMetadata) groupMetadata = await conn.groupMetadata(from)
    let admins = groupMetadata.participants.filter(p => p.admin).map(u => u.id)
    if (admins.length === 0) return reply('❌ *Admins na*')

    let msg = q || '👑 Calling Admins!'
    let text = `╭───〔 *TAG ADMINS* 〕───⬣\n│\n│ 💬 ${msg}\n│\n`
    admins.forEach(adm => text += `│ 👑 @${adm.split('@')[0]}\n`)
    text += `╰────────────────⬣`

    await conn.sendMessage(from, { text, mentions: admins }, { quoted: mek })
})

// ============= SETWELCOME =============
cmd({
    pattern: "setwelcome",
    desc: "Set welcome message",
    category: "group",
    react: "👋",
    filename: __filename
},
async (conn, mek, m, { from, q, isGroup, isAdmins, reply }) => {
    if (!isGroup) return reply('❌ *Group ekaka witharai*')
    if (!isAdmins) return reply('❌ *Admins lata witharai*')
    if (!q) return reply('❌ *Message ekak dapan*\nEx:.setwelcome Welcome @user to {group}')

    global.DB = global.DB || {};
    global.DB[from] = global.DB[from] || {};
    global.DB[from].welcome = q;
    reply('✅ *Welcome message set kala*')
})

// ============= SETGOODBYE =============
cmd({
    pattern: "setgoodbye",
    desc: "Set goodbye message",
    category: "group",
    react: "👋",
    filename: __filename
},
async (conn, mek, m, { from, q, isGroup, isAdmins, reply }) => {
    if (!isGroup) return reply('❌ *Group ekaka witharai*')
    if (!isAdmins) return reply('❌ *Admins lata witharai*')
    if (!q) return reply('❌ *Message ekak dapan*\nEx:.setgoodbye Bye @user')

    global.DB = global.DB || {};
    global.DB[from] = global.DB[from] || {};
    global.DB[from].goodbye = q;
    reply('✅ *Goodbye message set kala*')
})

// ============= GETPIC =============
cmd({
    pattern: "getpic",
    alias: ["gppic"],
    desc: "Get group profile picture.",
    category: "group",
    react: "🖼️",
    filename: __filename
},
async (conn, mek, m, { from, isGroup, reply }) => {
    try {
        if (!isGroup) return reply('❌ *Group ekaka witharai*')
        const groupPic = await conn.getProfilePicture(from).catch(() => null)
        if (!groupPic) return reply('❌ *PP na group eke*')
        await conn.sendMessage(from, { image: { url: groupPic }, caption: '🖼️ *Group Profile Picture*' })
    } catch (e) {
        console.log(e)
        reply(`❌ Error: ${e.message || e}`)
    }
})
