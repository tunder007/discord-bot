const Discord = require("discord.js");

// Text Command
module.exports =
    async function text(message)
    {
        // Get the channel mention
        if (message.mentions.channels.size == 0) {
            message.reply("please mention a channel first.");
        } else {
            let targetChannel = message.mentions.channels.first();
            // Print the message
            const args = message.content.split(" ").slice(2);
            let saytext = args.join(" ");
            targetChannel.send(saytext);
            message.delete();
            return; 
        }
    }