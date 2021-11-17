// dependencies
const Discord = require('discord.js');
const {token} = require('./config.json');
const {msgInterpret} = require('./msgInterpret.js');
const sessionEnd = require('./sessionEnd.js');
//******************************

// main
const client = new Discord.Client();
const queue = new Map(); // (guild.id) => {session@guild.id} //store music sessions (queue/connection) by server id.

client.login(token);
client.once('ready', () => {
    console.log('Ready!');
});
client.once('reconnecting', () =>{
    console.log('Reconnecting!');
});
client.once('disconnect', () =>{
    console.log('Disconnect!');
});
client.on('message', async message =>{
    msgInterpret(message,queue);
});
client.on('voiceStateUpdate', (oldState, newState) => { //https://www.tutorialguruji.com/javascript/clear-queue-when-discord-js-bot-gets-disconnected/
    // ignore if someone is connecting
    if (oldState.channelID === null || typeof oldState.channelID == 'undefined') return;
    // ignore if the disconnect is a regular user
    if (newState.id !== client.user.id) return;
    sessionEnd.disconnect(oldState,queue);
});