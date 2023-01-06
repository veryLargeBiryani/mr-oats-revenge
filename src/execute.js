class Session {
    constructor(guildId,channelId,queue=[]){
        this.queue = queue; //this will be an instance of a queue class that has manipulation methods
        this.connection = joinVoiceChannel({
            channelId: channelId,
            guildId: guildId,
            adapterCreator: client.guilds.fetch().get(guildId).voiceAdapterCreator //this will live in the main code
        })
    }
    //send messages back to the discord server
    msgSend(){

    }
    //disconnect the bot from voice and/or clear the queue
    close(){

    }
}
//returns a session to be stored in the bot's directory
module.exports = (client,sessionDir,guildId,command)=>{
    //if a session exists already we just process the command
    if (sessionDir.get(guildId)) return process(command);
    //create a new session
    sessionDir.set(guildId, new Session());
};