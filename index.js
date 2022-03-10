// Dependencies
const Discord = require("discord.js");
const { Util, MessageEmbed, Client, MessageAttachment, Collection } = require("discord.js");
const { PREFIX, token, googleApiKey } = require("./config.json");
const ytdl = require("ytdl-core");
const dotenv = require ('dotenv');
const fs = require("fs");
const db = require('quick.db');
const jimp = require('jimp');

// Imports
const help = require ('./commands/help');
const text = require ('./commands/text');
const cryptoPrice = require ('./commands/cryptoPrice.js');

// Load environment variables
dotenv.config();

// Bot instance
const client = new Discord.Client({ disableMentions: 'everyone' });
const queue = new Collection();
client.phone = new Collection();
client.commands = new Collection();
client.aliases = new Collection();

// Improved importing commands
["aliases", "commands"].forEach(x => client[x] = new Collection());
["console", "command", "event"].forEach(x => require(`./handler/${x}`)(client));
client.categories = fs.readdirSync("./commands/");
["command"].forEach(handler => {
    require(`./handler/${handler}`)(client);
});

// Log to console when the bot is ready
client.once("ready", () => {
  console.log("Ready!");
});
client.once("reconnecting", () => {
  console.log("Reconnecting!");
});
client.once("disconnect", () => {
  console.log("Disconnect!");
});

// Bot Commands
client.on("message", async message => {
  // If the bot sent the message
  if (message.author.bot) return;
  // If the message is in a dm
  if (message.channel.type === "dm") return;

  //Get prefix for server
  try {
    let fetched = await db.fetch(`prefix_${message.guild.id}`);
    if (fetched == null) {
        prefix = PREFIX
    } else {
        prefix = fetched
    }
  } catch (err) {
    console.log(err)
  };
  // If the message doesn't contain the prefix
  if (!message.content.startsWith(prefix)) return;

  try {
    if (message.mentions.has(client.user) && !message.mentions.has(message.guild.id)) {
        return message.channel.send(`**My Prefix In This Server is - \`${prefix}\`**`)
    }
  } catch {
    return;
  };

  const serverQueue = queue.get(message.guild.id);

  if ((message.content.startsWith(`${prefix}stop`))||(message.content.startsWith(`${prefix}s `))) {
    stop(message, serverQueue);
    return;
  } 
  if (message.content.startsWith(`${prefix}text`)) {
    text(message);
    return;
  } 
  if (message.content.startsWith(`${prefix}price`)) {
    cryptoPrice(message);
    return;
  }
  if (message.content.startsWith(`${prefix}help`)) {
    help(message);
    return;
  }
});

// SelfDeafen for resource conservation
client.on("voiceStateUpdate", (oldVoiceState, newVoiceState) => {
  if (newVoiceState.id == client.user.id) {
     newVoiceState.setSelfDeaf(true);
  };
});

// Song stop playing
function stop(message, serverQueue) {
  if (!message.member.voice.channel)
    return message.channel.send(
      "You have to be in a voice channel to stop the music!"
    );
    
  if (!serverQueue)
    return message.channel.send("There is no song that I could stop!");
    
  serverQueue.songs = [];
  serverQueue.connection.dispatcher.end();
}

client.login(token);