//dependencies
const Session = require('../classes/session');
const Queue = require('../classes/queue');
const Song = require('../classes/song');

//returns a session to be stored in the bot's directory
module.exports = async (guild,sessionDir,message)=>{
    //if a session exists already we just process the command
    if (sessionDir.get(guild.id)) return process(message);
    
    //create a new session
    //test code - picks golf channel on lad shed to join
    let voice_channel = Array.from(message.guild.channels.cache.keys())[14];
    sessionDir.set(guild.id, new Session(guild, voice_channel, new Queue([new Song({url: message.content})])));
};