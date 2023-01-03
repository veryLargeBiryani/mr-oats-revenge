// dependencies
const { Client, GatewayIntentBits } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');
const {token} = require('./config.json');
// const {msgInterpret} = require('./msgInterpret.js');
// const sessionEnd = require('./sessionEnd.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
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
        console.log(Array.from(channels.keys())[0]);
        joinVoiceChannel({
            channelId: Array.from(channels.keys())[0],
            guildId: message.guildId,
            adapterCreator: message.guild.voiceAdapterCreator
        })
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