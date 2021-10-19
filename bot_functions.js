// dependencies
const ytdl = require('ytdl-core');
const ytsr = require('ytsr');
const { getData, getPreview, getTracks } = require('spotify-url-info');
const ytpl = require('ytpl');
let dispatcher;
const {prefix} = require('./config.json');
let isPaused = {};

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
    if (args.length < 2){
        return message.channel.send("nothing was ordered.");
    } else if (args[1].includes("http") > 0){ //if command had a direct link
        if (args[1].includes("open.spotify.com/track/")){
            song = await spotifyTrack(args[1]);
            console.log(`Spotify track was found on youtube: ${song.title}`);
        } else {
            const songInfo = await ytdl.getInfo(args[1]);
            song = {
                title: songInfo.videoDetails.title,
                url: songInfo.videoDetails.video_url
            }
        }
    } else { //if command had a search
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
        }
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
            isPaused[message.guild.id] = false;
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

async function cook(guild, song, queue){
    const serverQueue = queue.get(guild.id);
    if (!song) {
        serverQueue.voiceChannel.leave();
        queue.delete(guild.id);
        return;
    }
    
    let info = await ytdl.getInfo(song.url);
    let songFormat = ytdl.filterFormats(info.formats, 'audioonly');
    //console.log(songFormat); <-- print formats in console so you can see if it's actually working (it does now!)
    dispatcher = serverQueue.connection
        .play(ytdl(song.url, {format: songFormat[0]}))
        .on("finish", () => {
            serverQueue.songs.shift();
            cook(guild, serverQueue.songs[0], queue);
        })
        .on("error", error => console.error(error));
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
    serverQueue.textChannel.send(`breakfast is served: ${song.title}`);
    console.log(serverQueue.songs)
    return;
}

function lunch(message, serverQueue){
    console.log('user requested to skip');
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

async function spotifyTrack(url){
    let spotTrack = await getData(url); //grab metadata w/ url
    let spotTrackInfo = `${spotTrack.name} ${spotTrack.artists[0].name}`;  //string to search on youtube
    const filtersSpot = await ytsr.getFilters(spotTrackInfo); // following lines copied from oatmeal main to search for youtube url
    const filterSpot = filtersSpot.get('Type').get('Video');
    if (filterSpot.url == null){
        return message.channel.send("couldn't find anything to plate."); //will probably need some error handling here
    } else {
        const spotSearchResults = await ytsr(filterSpot.url, {pages : 1});
        return {
            "title": spotSearchResults.items[0].title,
            "url": spotSearchResults.items[0].url
        };
    }
}

async function playlistLoader(url,queue,message){
    //build playlist
    let playlist = [];
    if(url.includes('spotify')){
        let playlistSp = await getTracks(url);
        for (i=0;i<playlistSp.length;i++){
            let temp = await spotifyTrack(playlistSp[i].external_urls.spotify);
            playlist.push(temp);
        }
    } else if (url.includes('youtube')){
        let playlistID = await ytpl.getPlaylistID(url);
        let playlistYt = await ytpl(playlistID);
        for (i=0;i<playlistYt.items.length;i++){
            let ytplSong = {
                "title": playlistYt.items[i].title,
                "url": playlistYt.items[i].shortUrl
            }
            playlist.push(ytplSong);
        }
    }
    //load playlist
    const voiceChannel = message.member.voice.channel;
    const serverQueue = queue.get(message.guild.id);
    if (!serverQueue){
        // creating contract for queue
        const queueContract = {
            textChannel: message.channel,
            voiceChannel: voiceChannel,
            connection: null,
            songs: playlist, //import playlist as starting songs in queue
            volume: 5,
            playing: true,
        };
    
        // setting queue using contract
        queue.set(message.guild.id, queueContract);
        
        try {
            // try to join voice and save connection into object
            var connection = await voiceChannel.join();
            queueContract.connection = connection;
            // call play function and start song
            cook(message.guild, queueContract.songs[0], queue);
            isPaused[message.guild.id] = false;
        } catch (err) {
            // print error if bot fails join
            console.log(err);
            queue.delete(message.guild.id);
            return message.channel.send("no cooks in the kitchen.");
        }
    } else {
        serverQueue.songs = serverQueue.songs.concat(playlist); //add playlist to end of queue if song is already playing
        console.log(serverQueue.songs);
        return message.channel.send(`${url} has been added to your plate`);
    }
}

async function drink(message,serverQueue){
    console.log('user requested to pause');
        dispatcher.pause();
        return message.channel.send(`Type ${prefix}leftovers to finish your meal!`);
}

async function leftovers(message,serverQueue){
    console.log('user requested to resume');
        dispatcher.resume();
        return message.channel.send(`Enjoy your leftovers`);
}

async function instantOats(message,serverQueue){
    //code for a playnext function goes here
}
// export
module.exports = {
    execute,
    cook,
    lunch,
    cancel,
    menu,
    playlistLoader,
    drink,
    leftovers
}