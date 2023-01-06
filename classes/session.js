class Session {
    constructor(guild,channelId,queue=[]){
        this.queue = queue; //this will be an instance of a queue class that has manipulation methods
        this.connection = joinVoiceChannel({
            channelId: channelId,
            guildId: guild.id,
            adapterCreator: guild.voiceAdapterCreator
        })
    }
    //send messages back to the discord server
    msgSend(){

    }
    //disconnect the bot from voice and/or clear the queue
    close(){

    }
}