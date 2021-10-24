function menu(message, serverQueue){
    if (!serverQueue){
        return message.channel.send(
            "nothing is plated."
        );
    }
    else {
        let myPlate = `here's yer grub: `;
        for (i = 0; i < serverQueue.songs.length; i++){
            if (i>9){
                break;
            }
            myPlate = `${myPlate}
    ${i + 1}. ${serverQueue.songs[i].title}`;
        }
        return message.channel.send(`${myPlate}
(${serverQueue.songs.length} total meals are being prepared)`);
    }
}

function lunch(message, serverQueue){
    console.log('user requested to skip');
    if (!message.member.voice.channel)
        return message.channel.send(
            "only chefs can change the ingredients."
        );
    if (!serverQueue)
            return message.channel.send("no other meals to prepare.");
    serverQueue.connection.dispatcher.end(); //ends current song which will trigger next song to load
}

function cancel(message, serverQueue){
    console.log('user requested to clear the queue');
    if (!message.member.voice.channel)
        return message.channel.send(
            "only chefs can change the ingredients."
        );
    if (!serverQueue)
            return message.channel.send("no dishes to throw out.");
    serverQueue.songs = [];
    serverQueue.connection.dispatcher.end();
}

async function instantOats(message,serverQueue){
    //code for a playnext function goes here
}

module.exports = {menu,lunch,cancel};