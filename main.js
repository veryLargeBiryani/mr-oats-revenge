// dependencies
const { Client, GatewayIntentBits } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, NoSubscriberBehavior } = require('@discordjs/voice');
const {token} = require('./config.json');
const ytdl = require('ytdl-core');
const fs = require('fs');

// below are old, currently unused dependencies
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

// log the bot into the correct discord dev bot using the token in config.json
client.login(token);
// once the bot has loaded, initialize callback
client.once('ready', () => {
    console.log('Ready!');
    // get list of all guilds and voice channels that the bot is on / is allowed on
    client.guilds.fetch().then( (guilds) =>{
        console.log(guilds);
        //.value.client.channels.fetch() --get channels per guild
        // for (const channel of Array.from(channels.values())){
            //     if (channel.speakable != true) continue;
            //     voice_channels.set(channel.name);
            // }
    });
});

// on message creation, join specified channel and start playing song
// this is currently test-level code
client.on('messageCreate', async (message) =>{
    // log the received message
    console.log(`${message.author.username} in ${message.channel.name} on ${message.guild.name} (${message.guildId}) said : ${message.content}`);
    // fetching the channels on the server the bot is currently on
    message.guild.channels.fetch().then((channels)=>{
        // console.log(channels);
        // log the id of the server / channel
        console.log(Array.from(channels.keys()));
        // connect to voice - https://discordjs.guide/voice/audio-player.html#playing-audio
        const voice = {
            connection: joinVoiceChannel({
                channelId: Array.from(channels.keys())[14],
                guildId: message.guildId,
                adapterCreator: message.guild.voiceAdapterCreator
            })
        }
        // create music station
        // the code below can be migrated into a dedicated file and called as a function that accepts input
        voice.player = createAudioPlayer({
            behaviors: {
                noSubscriber: NoSubscriberBehavior.Pause,
            },
        });
        voice.connection.subscribe(voice.player); // subcribe the voice player to the audio player object so it can be heard
        // import song
        let song = createAudioResource(ytdl('https://www.youtube.com/watch?v=TwHsg2XO--c', {filter: "audioonly"}));
        // play the song on the player
        voice.player.play(song);
    });
    // msgInterpret(message,queue);
});

// disconnects bot when no more songs are in the song queue
client.on('voiceStateUpdate', (oldState, newState) => { //https://www.tutorialguruji.com/javascript/clear-queue-when-discord-js-bot-gets-disconnected/
    // ignore if someone is connecting
    if (oldState.channelID === null || typeof oldState.channelID == 'undefined') return;
    // ignore if the disconnect is a regular user
    if (newState.id !== client.user.id) return;
    sessionEnd.disconnect(oldState,queue);
});