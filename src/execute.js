//dependencies
const Session = require('../classes/session');
const Queue = require('../classes/queue');

//returns a session to be stored in the bot's directory
module.exports = (guild,sessionDir,message)=>{
    //if a session exists already we just process the command
    if (sessionDir.get(guild.id)) return process(message);
    
    //create a new session
    sessionDir.set(guild.id, new Session(guild, Array.from(message.guild.channels.fetch().keys())[14], new Queue(message.content)));
};