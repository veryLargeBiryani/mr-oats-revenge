//dependencies
const { joinVoiceChannel, createAudioPlayer, NoSubscriberBehavior, AudioPlayerStatus  } = require('@discordjs/voice');
const Queue = require('./queue');

module.exports = class Session {
    constructor(){
    }
    async init(command){
        this.queue = new Queue(); 
        await this.queue.init(command);
        this.connection = joinVoiceChannel({
            channelId: command.channel,
            guildId: command.guild.id,
            adapterCreator: command.guild.voiceAdapterCreator
        })
        await this.queue.contents[0].getStream();
        this.player = createAudioPlayer({behaviors: {noSubscriber: NoSubscriberBehavior.Pause}});
        this.connection.subscribe(this.player); // subcribe the connection to the audio player so it can be heard
        this.player.play(this.queue.contents[0].resource); //play first song in the new instantiated queue

        //manage Audio player - switch songs, handle errors - https://discordjs.guide/voice/audio-player.html#life-cycle
        this.player.on(AudioPlayerStatus.Idle, async () => {
            this.queue.contents.shift();
            if (!this.queue.contents.length) this.connection.disconnect(); //queue is over - need queue listener to reconnect later
            else {
                await this.queue.contents[0].getStream(); 
                this.player.play(this.queue.contents[0].resource);
            }
        });

        this.player.on('error', async (error) => {
            console.log(error);
            this.queue.contents.shift();
            if (!this.queue.contents.length) this.connection.disconnect(); //queue is over - need queue listener to reconnect later
            else {
                await this.queue.contents[0].getStream(); 
                this.player.play(this.queue.contents[0].resource);
            }
        });
    }
    async skip(n=1){
        if (n>1) this.queue.contents.splice(1,n-1); //delete n-1 upcoming songs (don't delete current song)
        this.player.stop(); //destroy currently playing resource, and send player into idle state to trigger queue rotation
    }
    async close(){

    }
}