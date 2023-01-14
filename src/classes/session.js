//dependencies
const { joinVoiceChannel, createAudioPlayer, NoSubscriberBehavior, AudioPlayerStatus  } = require('@discordjs/voice');
const Queue = require('./queue');

module.exports = class Session {
    constructor(guild,channelId,command){
        this.queue = new Queue(command); 
        this.connection = joinVoiceChannel({
            channelId: channelId,
            guildId: guild.id,
            adapterCreator: guild.voiceAdapterCreator
        })
        this.player = createAudioPlayer({behaviors: {noSubscriber: NoSubscriberBehavior.Pause}});
        this.connection.subscribe(this.player); // subcribe the connection to the audio player so it can be heard
        this.player.play(this.queue.contents[0].resource); //play first song in the new instantiated queue

        //manage Audio player - switch songs, handle errors - https://discordjs.guide/voice/audio-player.html#life-cycle
        this.player.on(AudioPlayerStatus.Idle, () => {
            this.queue.contents.shift();
            if (!this.queue.contents.length) this.connection.disconnect(); //queue is over - need queue listener to reconnect later
            else this.player.play(this.queue.contents[0].resource);
        });

        this.player.on('error', (error) => {
            console.log(error);
            this.queue.contents.shift();
            if (!this.queue.contents.length) this.connection.disconnect(); //queue is over - need queue listener to reconnect later
            else this.player.play(this.queue.contents[0].resource);
        });
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