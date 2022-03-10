module.exports = {
    config: {
        name: 'skip',
        description: 'Skip command.',
        category: "music",
        aliases: ["s"],
        usage: " ",
        accessableby: "everyone"
    },
    run: async (client, message, args, ops) => {
        // Mi e lene sa scriu asta de 10 ori
        const { channel } = message.member.voice;
        if (!channel) 
            return message.channel.send('I\'m sorry but you need to be in a voice channel to skip music!');
        if (message.guild.me.voice.channel !== message.member.voice.channel) {
            return message.channel.send("You Have To Be In The Same Channel With The Bot!");
          }
        const serverQueue = ops.queue.get(message.guild.id);
        if (!serverQueue) 
            return message.channel.send('Nothing playing in this server');
        try {
            const deletedSong = serverQueue.songs.shift();
            play(message.guild, serverQueue.songs[0]);
            return message.channel.send('Skipped')
        } catch {
          serverQueue.connection.dispatcher.end();
          await channel.leave();
          return message.channel.send("Something Went Wrong!")
        }
    }
};