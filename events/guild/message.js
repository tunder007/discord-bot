const db = require('quick.db');
const { PREFIX } = require('../../config');
const queue2 = new Map();
const queue3 = new Map();
const queue = new Map();
const games = new Map()

module.exports = async (client, message) => {
    try {
        if (message.author.bot || message.channel.type === "dm") 
            return;

        let prefix;
        let fetched = await db.fetch(`prefix_${message.guild.id}`);

        if (fetched === null) {
            prefix = PREFIX
        } else {
            prefix = fetched
        }

        let args = message.content.slice(prefix.length).trim().split(/ +/g);
        let cmd = args.shift().toLowerCase();

        if (!message.content.startsWith(prefix)) 
            return;

        let ops = {
            queue2,
            queue,
            queue3,
            games
        }

        var commandfile = client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd))
        if (commandfile) 
            commandfile.run(client, message, args, ops)
    } catch (err) {
        console.log(err);
    }
}