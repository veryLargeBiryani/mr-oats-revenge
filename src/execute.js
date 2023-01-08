//dependencies
const Session = require('../classes/session');
const Queue = require('../classes/queue');
const Song = require('../classes/song');

//returns a session to be stored in the bot's directory
module.exports = async (guild,sessionDir,message)=>{
    let session = sessionDir.get(guild.id);
    
    //create a new session if needed
    if (!session){
        let voice_channel = Array.from(message.guild.channels.cache.keys())[14]; //test code - picks golf channel on lad shed to join
        sessionDir.set(guild.id, new Session(guild, voice_channel, new Queue([new Song({url: message.content})])));
        return;
    };
    //if a session exists already we just process the command
    session.queue.add([new Song({url: message.content})]);
};