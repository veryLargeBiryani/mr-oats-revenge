// dependencies
const {getTracks} = require('spotify-url-info');
const {getSpotifySong, getSong} = require('./getSong.js');
const {cook} = require('./cook.js');
const ytpl = require('ytpl');

async function execute(message, queue){
    //initialize variables
    let args,url,isPlaylist,playlist;
    const serverQueue = queue.get(message.guild.id);
    const voiceChannel = message.member.voice.channel;
    //determine if playlist or track
    if (message.content.includes('https://open.spotify.com/playlist/') || message.content.includes('https://www.youtube.com/playlist') || message.content.includes('open.spotify.com/album/') || message.content.includes('&list=')){
        url = message.content.substring(6);
        isPlaylist = true;
    } else {
        args = message.content.split(" ");
        isPlaylist = false;
    }
    //get titles/urls to push to queue
    if (!isPlaylist){
        // get song object
        playlist = [await getSong(args)];
        if (playlist[0].title == null || playlist[0].url == null){
        return message.channel.send('Please request a dish you would like me to cook!'); //song object came back empty
        }
    } else { //if playlist
        playlist = [];
        if(url.includes('spotify')){
            let playlistSp = await getTracks(url.substring(0,url.indexOf('?'))); //use url w/o parameters
            playlist = await Promise.all(playlistSp.map((track) =>{
                return getSpotifySong(track.external_urls.spotify);
            }));
        } else if (url.includes('youtube')){
            let playlistID = await ytpl.getPlaylistID(url);
            let playlistYt = await ytpl(playlistID);
            for (i=0;i<playlistYt.items.length;i++){
                playlist.push({
                    "title": playlistYt.items[i].title,
                    "url": playlistYt.items[i].shortUrl
                });
            }
        }
    }
    //connect to voip
    if (!voiceChannel)
        return message.channel.send("Please enter the kitchen before cooking your meal.");
    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
        return message.channel.send("You don't belong in the kitchen.");
    }

    //push songs to guild's music session
    if (!serverQueue){
        // creating contract for queue
        const queueContract = {
            textChannel: message.channel,
            voiceChannel: voiceChannel,
            connection: null,
            songs: playlist,
            volume: 5,
            playing: true,
        };
        console.log('queued',playlist);
        // map new serverQueue to queue object by server ID
        queue.set(message.guild.id, queueContract);
        
        try {
            // try to join voice and save connection into object
            //var connection = await voiceChannel.join();
            queueContract.connection = await voiceChannel.join();
            // call play function and start song
            cook(message.guild, queueContract.songs[0], queue);
        } catch (err) {
            // print error if bot fails join
            console.log(err);
            queue.delete(message.guild.id);
            return message.channel.send("the stove is not working at this time");
        }
    } else {
        serverQueue.songs = serverQueue.songs.concat(playlist); //add playlist to end of queue if song is already playing
        console.log('queued',playlist);
        return message.channel.send(`Food has been added to your plate`);
    }
}

module.exports = {execute};