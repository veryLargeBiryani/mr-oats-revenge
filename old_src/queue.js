//dependencies
const {getSong} = require('./getSong.js');
const { MessageEmbed } = require('discord.js');

function menu(message, serverQueue, msgColor = 'WHITE', msgTitle = 'total meals are being prepared' ){
    //this function is also called when a playlist is queued to tell the users what songs they queued up
    if (!serverQueue){
        //message back to discord channel
        const _msg = new MessageEmbed();
        _msg.setColor('RED');
        _msg.setTitle('nothing is plated.');
        return message.channel.send(_msg); //message.channel bc there is no serverqueue atm
    }
    else {
        let myPlate = '';
        for (i = 0; i < serverQueue.songs.length; i++){
            if (i>19){
                break;
            }
            myPlate = `${myPlate}
${i + 1}. ${serverQueue.songs[i].title}`;
        }
        //message back to discord channel
        const _msg = new MessageEmbed();
        _msg.setColor(msgColor);
        _msg.setTitle(`${serverQueue.songs.length} ${msgTitle}`);
        _msg.setFooter(myPlate);
        return serverQueue.textChannel.send(_msg);
    }
}

function lunch(message, serverQueue){
    console.log('user requested to skip');
    if (!message.member.voice.channel){
        //message back to discord channel
        const _msg = new MessageEmbed();
        _msg.setColor('RED');
        _msg.setTitle('only chefs can change the ingredients.');
        return serverQueue.textChannel.send(_msg);
    } 
    if (!serverQueue){
        //message back to discord channel
        const _msg = new MessageEmbed();
        _msg.setColor('RED');
        _msg.setTitle('no other meals to prepare.');
        return serverQueue.textChannel.send(_msg);
    }
    serverQueue.connection.dispatcher.end(); //ends current song which will trigger next song to load
}

function cancel(message, serverQueue){
    console.log('user requested to clear the queue');
    if (!message.member.voice.channel){
        //message back to discord channel
        const _msg = new MessageEmbed();
        _msg.setColor('RED');
        _msg.setTitle('only chefs can change the ingredients.');
        return serverQueue.textChannel.send(_msg);
    }
    if (!serverQueue){
        //message back to discord channel
        const _msg = new MessageEmbed();
        _msg.setColor('RED');
        _msg.setTitle('no dishes to throw out.');
        return serverQueue.textChannel.send(_msg);
    }   
    serverQueue.songs = [];
    serverQueue.connection.dispatcher.end();
}

async function instantOats(message,serverQueue){
    let slot;
    let args = message.content.split(' ');
    if (!serverQueue) {
        //message back to discord channel
        const _msg = new MessageEmbed();
        _msg.setColor('RED'); //red for error
        _msg.setTitle('there is no bowl to add your instant oats to');
        return serverQueue.textChannel.send(_msg);
    }
    if (isNaN(parseInt(args[1])) || args[1] < 2){ //make sure number parameter was given
        //message back to discord channel
        const _msg = new MessageEmbed();
        _msg.setColor('RED'); //red for error
        _msg.setTitle('Please tell me when to cook your meal!');
        return serverQueue.textChannel.send(_msg);
    } else {
        slot = parseInt(args[1])-1;
    }
    args = args.slice(1); //remove slot number from the search
    let quickPlay = await getSong(args);
    if (quickPlay.title == null || quickPlay.url == null){//song object came back empty
        //message back to discord channel
        const _msg = new MessageEmbed();
        _msg.setColor('RED'); //red for error
        _msg.setTitle('Please request a dish you would like me to cook!');
        return serverQueue.textChannel.send(_msg);
    }
    serverQueue.songs.splice(slot, 0, quickPlay);
    console.log(`instant oats in slot ${slot+1}`,quickPlay);
    //message back to discord channel
    const _msg = new MessageEmbed();
    _msg.setColor('GREEN');
    _msg.setTitle(`*${quickPlay.title}* has been added to the menu!`);
    _msg.setURL(quickPlay.url);
    return serverQueue.textChannel.send(_msg);
}

function hold(message,serverQueue){
    if (!serverQueue) {
        //message back to discord channel
        const _msg = new MessageEmbed();
        _msg.setColor('RED');
        _msg.setTitle('there is nothing on the menu!');
        return serverQueue.textChannel.send(_msg);
    } else {
        let args = message.content.split(' ');
        const songToDel = parseInt(args[1],10)-1;
        if (songToDel === 0) { //don't allow first song (now playing) to be removed
            //message back to discord channel
            const _msg = new MessageEmbed();
            _msg.setColor('RED'); //red for error
            _msg.setTitle(`finish what's on your plate!!!`);
            return serverQueue.textChannel.send(_msg); 
        }
        console.log('removed', serverQueue.songs[songToDel]);
        //message back to discord channel
        const _msg = new MessageEmbed();
        _msg.setColor('PINK');
        _msg.setTitle(`"${serverQueue.songs[songToDel].title}" was removed from the menu`);
        _msg.setURL(serverQueue.songs[songToDel].url);
        serverQueue.textChannel.send(_msg);
        serverQueue.songs.splice(songToDel,1);
    }

}

module.exports = {menu,lunch,cancel,instantOats,hold};