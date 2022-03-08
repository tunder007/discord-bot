const { PREFIX } = require('../../config');
module.exports = async client => {
    let totalUsers = client.guilds.cache.reduce((acc, value) => acc + value.memberCount, 0)
    var activities = [ `${client.guilds.cache.size} servers`, `${totalUsers} users!` ], i = 0;
    setInterval(() => client.user.setActivity(`${PREFIX}help | ${activities[i++ % activities.length]}`, { type: "WATCHING" }),5000)
    
};