const { cmd } = require('../command');

global.antiDelete = global.antiDelete || {};

cmd({
    pattern: "antidelete",
    desc: "Enable or Disable Anti Delete",
    category: "owner",
    filename: __filename
},
async (conn, mek, m, {
    from,
    q,
    isOwner,
    reply
}) => {

    if (!isOwner) return reply("❌ Owner Only");

    if (!q) {
        return reply(
`🛡️ Anti Delete Settings

.antidelete on
.antidelete off

Current : ${global.antiDelete[from] ? "ON" : "OFF"}`
        );
    }

    if (q.toLowerCase() === "on") {
        global.antiDelete[from] = true;
        return reply("✅ Anti Delete Enabled");
    }

    if (q.toLowerCase() === "off") {
        global.antiDelete[from] = false;
        return reply("❌ Anti Delete Disabled");
    }

});
