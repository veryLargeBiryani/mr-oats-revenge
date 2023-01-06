//returns a session to be stored in the bot's directory
module.exports = (guild,sessionDir,command)=>{
    //if a session exists already we just process the command
    if (sessionDir.get(guild.id)) return process(command);
    //create a new session
    sessionDir.set(guild.id, new Session(guild));
};