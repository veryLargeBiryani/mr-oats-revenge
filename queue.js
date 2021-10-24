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

module.exports = {lunch,cancel};