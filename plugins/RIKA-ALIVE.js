const os = require('os')
const { cmd } = require('../command')

    case 'alive': {
    const startTime = socketCreationTime.get(number) || Date.now();
    const uptime = Math.floor((Date.now() - startTime) / 1000);
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);

    const captionText = `
╭────◉◉◉────៚
⏰ Bot Uptime: ${hours}h ${minutes}m ${seconds}s
🟢 Active session: ${activeSockets.size}
╰────◉◉◉────៚

🔢 Your Number: ${number}

*▫️SULA-MD Main Website 🌐*
> https://sula-md.pages.dev
`;

    const templateButtons = [
        {
            buttonId: `${config.PREFIX}menu`,
            buttonText: { displayText: 'MENU' },
            type: 1,
        },
        {
            buttonId: `${config.PREFIX}owner`,
            buttonText: { displayText: 'OWNER' },
            type: 1,
        },
        {
            buttonId: 'action',
            buttonText: {
                displayText: '📂 Menu Options'
            },
            type: 4,
            nativeFlowInfo: {
                name: 'single_select',
                paramsJson: JSON.stringify({
                    title: 'Click Here ❏',
                    sections: [
                        {
                            title: `𝐒𝚄𝙻𝙰 𝐌𝙳 𝐅𝚁𝙴𝙴 𝐁𝙾𝚃`,
                            highlight_label: '',
                            rows: [
                                {
                                    title: 'MENU 📌',
                                    description: '𝐏𝙾𝚆𝙴𝚁𝙴𝙳 𝐁𝚈 𝐒𝚄𝙻𝙰 𝐌𝙳',
                                    id: `${config.PREFIX}menu`,
                                },
                                {
                                    title: 'OWNER 📌',
                                    description: '𝐏𝙾𝚆𝙴𝚁𝙴𝙳 𝐁𝚈 𝐒𝚄𝙻𝙰 𝐌𝙳',
                                    id: `${config.PREFIX}owner`,
                                },
                            ],
                        },
                    ],
                }),
            },
        }
    ];

    await socket.sendMessage(m.chat, {
        buttons: templateButtons,
        headerType: 1,
        viewOnce: true,
        image: { url: "https://i.ibb.co/TDgzTB29/SulaMd.png" },
        caption: `𝐒𝚄𝙻𝙰 𝐌𝙳 𝐅𝚁𝙴𝙴 𝐁𝙾𝚃 𝐀𝙻𝙸𝚅𝙴 𝐍𝙾𝚆\n\n${captionText}`,
    }, { quoted: msg });

    break;
}
