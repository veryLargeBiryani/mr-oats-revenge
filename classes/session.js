//dependencies
const { joinVoiceChannel, createAudioPlayer, NoSubscriberBehavior } = require('@discordjs/voice');

module.exports = class Session {
    constructor(guild,channelId,queue=[]){
        this.queue = queue; //this will be an instance of a queue class that has manipulation methods
        this.connection = joinVoiceChannel({
            channelId: channelId,
            guildId: guild.id,
            adapterCreator: guild.voiceAdapterCreator
        })
        this.player = createAudioPlayer({
            behaviors: {
                noSubscriber: NoSubscriberBehavior.Pause,
            },
        });
        this.connection.subscribe(this.player); // subcribe the connection to the audio player so it can be heard
    }
    //send messages back to the discord server
    msgSend(){

    }
    //send messages to console
    log(){

    }
    //disconnect the bot from voice and/or clear the queue
    close(){

    }
}