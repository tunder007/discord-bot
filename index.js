/// Dependencies
const Discord = require("discord.js");
const { prefix, token } = require("./config.json");
const ytdl = require("ytdl-core");
const dotenv = require ('dotenv');
const help = require ('./components/help');
const text = require ('./components/text');
const cryptoPrice = require ('./components/cryptoPrice.js');

// Load environment variables
dotenv.config();

// Bot instance
const client = new Discord.Client();
const queue = new Map();

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
  // If the message doesn't contain the prefix
  if (!message.content.startsWith(prefix)) return;

  const serverQueue = queue.get(message.guild.id);

  if ((message.content.startsWith(`${prefix}play`))||(message.content.startsWith(`${prefix}p `))) {
    execute(message, serverQueue);
    return;
  } 
  if ((message.content.startsWith(`${prefix}next`))||(message.content.startsWith(`${prefix}n `))) {
    skip(message, serverQueue);
    return;
  } 
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
  message.reply("You need to enter a valid command!");
});

// SelfDeafen for resource conservation
client.on("voiceStateUpdate", (oldVoiceState, newVoiceState) => {
  if (newVoiceState.id == client.user.id) {
     newVoiceState.setSelfDeaf(true);
  };
});

// Music playlist
async function execute(message, serverQueue) 
{
  const args = message.content.split(" ").slice(0);

  const voiceChannel = message.member.voice.channel;
  if (!voiceChannel)
    return message.channel.send(
      "You need to be in a voice channel to play music!"
    );

  const permissions = voiceChannel.permissionsFor(message.client.user);
  if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
    return message.channel.send(
      "I need the permissions to join and speak in your voice channel!"
    );
  }

  const songInfo = await ytdl.getInfo(args[1]);
  const song = {
        title: songInfo.videoDetails.title,
        url: songInfo.videoDetails.video_url,
   };

  if (!serverQueue) {
    const queueContruct = {
      textChannel: message.channel,
      voiceChannel,
      connection: null,
      songs: [],
      volume: 3,
      playing: true
    };

    queue.set(message.guild.id, queueContruct);

    queueContruct.songs.push(song);

    try {
      var connection = await voiceChannel.join();
      queueContruct.connection = connection;
      play(message.guild, queueContruct.songs[0]);
    } catch (err) {
      console.log(err);
      queue.delete(message.guild.id);
      return message.channel.send(err);
    }
  } else {
    serverQueue.songs.push(song);
    return message.channel.send(`${song.title} has been added to the queue!`);
  }
}

// Song skip in queue
function skip(message, serverQueue) {
  if (!message.member.voice.channel)
    return message.channel.send(
      "You have to be in a voice channel to skip the song!"
    );
  if (!serverQueue)
    return message.channel.send("There is no song that I could skip!");
  const deletedSong = serverQueue.songs.shift();
  play(message.guild, serverQueue.songs[0]);
}

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

// if there is no song playing, exit the lobby
function play(guild, song) {
  const serverQueue = queue.get(guild.id);
  if (!song) {
    serverQueue.voiceChannel.leave();
    queue.delete(guild.id);
    return;
}

const dispatcher = serverQueue.connection
  .play(ytdl(song.url))
  .on("finish", () => {
    serverQueue.songs.shift();
    play(guild, serverQueue.songs[0]);
  })
  .on("error", error => console.error(error));
dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
serverQueue.textChannel.send(`Start playing: **${song.title}**`);
}

client.login(token);