//dependencies
const {MessageEmbed} = require('discord.js');

async function disconnect(oldState,queue){
    const serverQueue = queue.get(oldState.guild.id);
    try {
        serverQueue.textChannel.bulkDelete(100); //clean text chat messages when oats disconnects
    }
    catch(e){
        console.log('Message delete failure', e);
    }
    //message back to discord channel
    const _msg = new MessageEmbed();
    _msg.setColor('WHITE');
    _msg.setTitle(`No more oatmeal! Order another meal if you are still hungry!`);
    await serverQueue.textChannel.send(_msg);
    console.log('end of server queue, oats is disconnecting');
    // clear the queue
    return queue.delete(oldState.guild.id);
}

module.exports = {disconnect};