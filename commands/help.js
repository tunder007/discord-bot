const Discord = require("discord.js");
const { prefix } = require("../config.json");

// list of commands
module.exports =
    async function help(message) {
        message.reply(`Hello, I am Tunder-BOT. \n
            I am a Discord Bot that is here to help you with different activities \n
            ${prefix}help to show all of the commands that are available \n
            ${prefix}play song_youtube_url to play a song of your choice \n
            ${prefix}skip to skip the current song and play the next one \n
            ${prefix}stop to stop the Bot from playing music \n
            ${prefix}price cryptocurrency_name currency_name to show the price of a cryptocurrency in regards to a formal currency \n
            These are all the commands available. Good luck and have fun!`);
        message.delete();
        return;
    }
