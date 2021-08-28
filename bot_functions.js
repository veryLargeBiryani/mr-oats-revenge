// dependencies
const ytdl = require('ytdl-core');
const ytsr = require('ytsr');
const ytpl = require('ytpl');

// functions
async function execute(message, serverQueue, queue){
    const args = message.content.split(" ");
    let searchTitle = "";
    for (i = 1; i < args.length; i++){
        searchTitle = `${searchTitle} ${args[i]}`;
    }
    console.log(`user searched for "${searchTitle}"`);

    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel)
        return message.channel.send(
            "please enter the kitchen before cooking your meal."
        );
    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
        return message.channel.send(
            "i do not have the necessary utensils to cook you a meal right now."
        );
    }

    // prepare logic before adding song; decide if search should be performed
    let song;
    let pickedFormat;
    if (args.length < 2){
        return message.channel.send("nothing was ordered.");
    } else if (args[1].includes("http") > 0){
        const songInfo = await ytdl.getInfo(args[1]);
        song = {
            title: songInfo.videoDetails.title,
            url: songInfo.videoDetails.video_url
        };
        pickedFormat = await ytdl.filterFormats(songInfo.formats, 'audioonly');
        console.log('format found: ', pickedFormat);
    } else {
        const filters1 = await ytsr.getFilters(searchTitle);
        const filter1 = filters1.get('Type').get('Video');
        if (filter1.url == null){
            return message.channel.send("couldn't find anything to plate.");
        } else {
            const searchResults = await ytsr(filter1.url, {pages : 1});
            song = {
                title: searchResults.items[0].title,
                url: searchResults.items[0].url
            }
        };
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
            cook(message.guild, queueContract.songs[0], queue, pickedFormat);
        } catch (err) {
            // print error if bot fails join
            console.log(err);
            queue.delete(message.guild.id);
            return message.channel.send("no cooks in the kitchen.");
        }
    } else {
        serverQueue.songs.push(song);
        console.log(serverQueue.songs);
        return message.channel.send(`${song.title} has been added to your plate`);
    }
}

function cook(guild, song, queue, pickedFormat){
    const serverQueue = queue.get(guild.id);
    if (!song) {
        serverQueue.voiceChannel.leave();
        queue.delete(guild.id);
        return;
    }

    const dispatcher = serverQueue.connection
        .play(ytdl(song.url), {
            format: pickedFormat})
        .on("finish", () => {
            serverQueue.songs.shift();
            cook(guild, serverQueue.songs[0], queue, pickedFormat);
        })
        .on("error", error => console.error(error));
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
    serverQueue.textChannel.send(`breakfast is served: ${song.title}`);
    console.log(serverQueue.songs)
    return;
}

function lunch(message, serverQueue){
    if (!message.member.voice.channel)
        return message.channel.send(
            "only chefs can change the ingredients."
        );
    if (!serverQueue)
            return message.channel.send("no other meals to prepare.");
    serverQueue.connection.dispatcher.end();
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

function menu(message, serverQueue){
    if (!serverQueue){
        return message.channel.send(
            "nothing is plated."
        );
    }
    else {
        let myPlate = `here's yer grub: `;
        for (i = 0; i < serverQueue.songs.length; i++){
            myPlate = `${myPlate}
    ${i + 1}. ${serverQueue.songs[i].title}`;
        }
        return message.channel.send(myPlate);
    }
}

// export
module.exports = {
    execute,
    cook,
    lunch,
    cancel,
    menu
}