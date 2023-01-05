// dependencies
const {prefix} = require('./config.json');
const {cook} = require('./cook.js');
const { MessageEmbed } = require('discord.js');
let pauseTime;

async function drink(message,serverQueue){
    console.log('user requested to pause');
        serverQueue.connection.dispatcher.pause();
        //message back to discord channel
        const _msg = new MessageEmbed();
        _msg.setColor('WHITE'); //white msg for info messages
        _msg.setTitle(`Type ${prefix}leftovers to finish your meal!`);
        return serverQueue.textChannel.send(_msg);
}

async function leftovers(message,serverQueue,queue){
    console.log('user requested to resume');
    if (serverQueue.songs.length > 0){ //check if song queue was cancelled since pause
        serverQueue.connection.dispatcher.resume();
        serverQueue.songs.shift();
        cook(message.guild, serverQueue.songs[0], queue); //play next song
    }
    //message back to discord channel
    const _msg = new MessageEmbed();
    _msg.setColor('WHITE'); //white msg for info messages
    _msg.setTitle(`Enjoy your leftovers`);
    return serverQueue.textChannel.send(_msg);
}

async function meal(serverQueue,message){
    //get timestamp
    if (!serverQueue){
        //message back to discord channel
        const _msg = new MessageEmbed();
        _msg.setColor('RED'); //white msg for info messages
        _msg.setTitle(`There is no meal to dissect!`);
        return message.channel.send(_msg);
    }
    let timeStampSec = serverQueue.connection.dispatcher.streamTime/1000;
    let timeStampMin = Math.floor(timeStampSec/60);
    timeStampSec = Math.floor(timeStampSec % 60);
    if (timeStampSec < 10){
        timeStampSec = `0${timeStampSec}`;
    }
    let timeStamp = `${timeStampMin}:${timeStampSec}`;
    //message back to discord channel
    const _msg = new MessageEmbed();
    _msg.setColor('WHITE');
    _msg.setTitle(`*${serverQueue.songs[0].title}* is ${timeStamp} eaten.`);
    _msg.setURL(serverQueue.songs[0].url);
    return serverQueue.textChannel.send(_msg);
}

module.exports = {drink,leftovers,meal};