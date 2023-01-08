//dependencies
const { joinVoiceChannel, createAudioPlayer, NoSubscriberBehavior } = require('@discordjs/voice');

module.exports = class Session {
    constructor(guild,channelId,queue){
        this.queue = queue; //instance of a queue class that has manipulation methods
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
        this.player.play(queue.contents[0].resource); //play first song in the new instantiated queue

        // this.player.on( // listen for songs ending to play next song

        // );
    }
    //send messages back to the discord server
    async msgSend(){

    }
    //send messages to console
    async log(){

    }
    //disconnect the bot from voice and/or clear the queue
    async close(){

    }
}