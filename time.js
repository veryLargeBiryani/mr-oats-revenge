// dependencies
const {prefix} = require('./config.json');
const {cook} = require('./cook.js');

async function drink(message,serverQueue){
    console.log('user requested to pause');
        serverQueue.connection.dispatcher.pause();
        return message.channel.send(`Type ${prefix}leftovers to finish your meal!`);
}

async function leftovers(message,serverQueue,queue){
    console.log('user requested to resume');
    if (serverQueue.songs.length > 0){ //check if song queue was cancelled since pause
        serverQueue.connection.dispatcher.resume();
        cook(message.guild, serverQueue.songs[0], queue); //restart last song that was playing
    }
    return message.channel.send(`Enjoy your leftovers`);
}

module.exports = {drink,leftovers};