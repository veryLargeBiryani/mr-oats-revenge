// dependencies
const Discord = require('discord.js');
const {token} = require('./config.json');
const {msgInterpret} = require('./msgInterpret.js');
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