const config = require('../config');
const { cmd } = require('../command');
const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, '../config.js');

function saveConfig() {
    const newConfig = `module.exports = ${JSON.stringify(config, null, 4)}`;
    fs.writeFileSync(configPath, newConfig);
}

// AUTO STATUS READ
cmd({
    pattern: 'autostatusread',
    desc: 'Turn Auto Status Read ON/OFF',
    category: 'settings'
}, async(conn, mek, m, { args, reply }) => {

    if (!args[0]) return reply('Use: /autostatusread on or off');

    if (args[0] === 'on') {
        config.AUTO_READ_STATUS = true;
        saveConfig();
        return reply('✅ AUTO STATUS READ ENABLED');
    }

    if (args[0] === 'off') {
        config.AUTO_READ_STATUS = false;
        saveConfig();
        return reply('❌ AUTO STATUS READ DISABLED');
    }

});

// AUTO REACT STATUS
cmd({
    pattern: 'autoreactstatus',
    desc: 'Auto React Status ON/OFF',
    category: 'settings'
}, async(conn, mek, m, { args, reply }) => {

    if (!args[0]) return reply('Use: /autoreactstatus on or off');

    if (args[0] === 'on') {
        config.AUTO_REACT_STATUS = true;
        saveConfig();
        return reply('✅ AUTO REACT STATUS ENABLED');
    }

    if (args[0] === 'off') {
        config.AUTO_REACT_STATUS = false;
        saveConfig();
        return reply('❌ AUTO REACT STATUS DISABLED');
    }

});

// AUTO REACT
cmd({
    pattern: 'autoreact',
    desc: 'Auto React ON/OFF',
    category: 'settings'
}, async(conn, mek, m, { args, reply }) => {

    if (!args[0]) return reply('Use: /autoreact on or off');

    if (args[0] === 'on') {
        config.AUTO_REACT = true;
        saveConfig();
        return reply('✅ AUTO REACT ENABLED');
    }

    if (args[0] === 'off') {
        config.AUTO_REACT = false;
        saveConfig();
        return reply('❌ AUTO REACT DISABLED');
    }

});

// AUTO TYPING
cmd({
    pattern: 'autotyping',
    desc: 'Auto Typing ON/OFF',
    category: 'settings'
}, async(conn, mek, m, { args, reply }) => {

    if (!args[0]) return reply('Use: /autotyping on or off');

    if (args[0] === 'on') {
        config.AUTO_TYPING = true;
        saveConfig();
        return reply('✅ AUTO TYPING ENABLED');
    }

    if (args[0] === 'off') {
        config.AUTO_TYPING = false;
        saveConfig();
        return reply('❌ AUTO TYPING DISABLED');
    }

});

// PREFIX CHANGE
cmd({
    pattern: 'setprefix',
    desc: 'Change Bot Prefix',
    category: 'settings'
}, async(conn, mek, m, { args, reply }) => {

    if (!args[0]) return reply('Example: /setprefix .');

    config.PREFIX = args[0];
    saveConfig();

    return reply(`✅ PREFIX CHANGED TO: ${args[0]}`);
});

// MODE CHANGE
cmd({
    pattern: 'mode',
    desc: 'Change Bot Mode',
    category: 'settings'
}, async(conn, mek, m, { args, reply }) => {

    if (!args[0]) {
        return reply('Example: /mode public or private');
    }

    const mode = args[0].toLowerCase();

    if (mode !== 'public' && mode !== 'private') {
        return reply('Only public/private allowed');
    }

    config.MODE = mode;
    saveConfig();

    return reply(`✅ BOT MODE CHANGED TO: ${mode}`);
});
