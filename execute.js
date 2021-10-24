// dependencies
const {getSong} = require('./getSong.js');
const {cook} = require('./bot_functions.js');

async function execute(message, serverQueue, queue){
    const args = message.content.split(" ");
    const voiceChannel = message.member.voice.channel;

    if (!voiceChannel)
        return message.channel.send("Please enter the kitchen before cooking your meal.");
    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
        return message.channel.send("You don't belong in the kitchen.");
    }

    // get song object
    let song = await getSong(args);
    if (song.title == null || song.url == null){
        return message.channel.send('Please request a dish you would like me to cook!'); //song object came back empty
    }

    if (!serverQueue){
        // creating contract for queue
        const queueContract = {
            textChannel: message.channel,
            voiceChannel: voiceChannel,
            connection: null,
            songs: [],
            volume: 5,
            playing: true,
        };
    
        // setting queue using contract
        queue.set(message.guild.id, queueContract);
        // push song to songs array
        queueContract.songs.push(song);
        
        try {
            // try to join voice and save connection into object
            var connection = await voiceChannel.join();
            queueContract.connection = connection;
            // call play function and start song
            cook(message.guild, queueContract.songs[0], queue);
        } catch (err) {
            // print error if bot fails join
            console.log(err);
            queue.delete(message.guild.id);
            return message.channel.send("no cooks in the kitchen.");
        }
    } else {
        serverQueue.songs.push(song);
        console.log('queued',song);
        return message.channel.send(`${song.title} has been added to your plate`);
    }
}

module.exports = {execute};