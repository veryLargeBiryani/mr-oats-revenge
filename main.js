// dependencies
const { Client, GatewayIntentBits } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, NoSubscriberBehavior } = require('@discordjs/voice');
const {token} = require('./config.json');
const ytdl = require('ytdl-core');
const fs = require('fs');
// const {msgInterpret} = require('./msgInterpret.js');
// const sessionEnd = require('./sessionEnd.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates
    ]
});
const queue = new Map(); // (guild.id) => {session@guild.id} //store music sessions (queue/connection) by server id.

client.login(token);
client.once('ready', () => {
    console.log('Ready!');
    //get list of all guilds and voice channels
    client.guilds.fetch().then( (guilds) =>{
        console.log(guilds);
        //.value.client.channels.fetch() --get channels per guild
        // for (const channel of Array.from(channels.values())){
            //     if (channel.speakable != true) continue;
            //     voice_channels.set(channel.name);
            // }
    });
});

client.on('messageCreate', async (message) =>{
    console.log(`${message.author.username} in ${message.channel.name} on ${message.guild.name} (${message.guildId}) said : ${message.content}`);
    message.guild.channels.fetch().then((channels)=>{
        // console.log(channels);
        console.log(Array.from(channels.keys()));
        //connect to voice - https://discordjs.guide/voice/audio-player.html#playing-audio
        const voice = {
            connection: joinVoiceChannel({
                channelId: Array.from(channels.keys())[14],
                guildId: message.guildId,
                adapterCreator: message.guild.voiceAdapterCreator
            })
        }
        //create music station
        voice.player = createAudioPlayer({
            behaviors: {
                noSubscriber: NoSubscriberBehavior.Pause,
            },
        });
        voice.connection.subscribe(voice.player);
        //import song
        let song = createAudioResource(ytdl('https://www.youtube.com/watch?v=TwHsg2XO--c', {filter: "audioonly"}));
        //play the song on the player
        voice.player.play(song);
    });
    //msgInterpret(message,queue);
});
client.on('voiceStateUpdate', (oldState, newState) => { //https://www.tutorialguruji.com/javascript/clear-queue-when-discord-js-bot-gets-disconnected/
    // ignore if someone is connecting
    if (oldState.channelID === null || typeof oldState.channelID == 'undefined') return;
    // ignore if the disconnect is a regular user
    if (newState.id !== client.user.id) return;
    sessionEnd.disconnect(oldState,queue);
});