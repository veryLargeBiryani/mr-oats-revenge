// dependencies
const ytdl = require('ytdl-core');
const {getTracks} = require('spotify-url-info');
const ytpl = require('ytpl');
const {getSpotifySong} = require('./getSong.js');

// functions
async function cook(guild, song, queue){
    const serverQueue = queue.get(guild.id);
    if (!song) {
        serverQueue.voiceChannel.leave();
        queue.delete(guild.id);
        return;
    }
    
    let info = await ytdl.getInfo(song.url);
    let songFormat = ytdl.filterFormats(info.formats, 'audioonly');
    let dispatcher = serverQueue.connection
        .play(ytdl(song.url, {format: songFormat[0]})) //add cookies here to get age restricted videos (error 410 in Miniget)
        .on("finish", () => {
            serverQueue.songs.shift();
            cook(guild, serverQueue.songs[0], queue);
        })
        .on("error", e => {
            console.error(e);
            cook(guild, serverQueue.songs[0], queue); //restart song on socket error
        });
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
    serverQueue.textChannel.send(`breakfast is served: ${song.title}`);
    console.log('now playing', song);
    return;
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

async function playlistLoader(url,queue,message){
    //build playlist
    let playlist = [];
    if(url.includes('spotify')){
        let playlistSp = await getTracks(url.substring(0,url.indexOf('?'))); //use url w/o parameters
        playlist = await Promise.all(playlistSp.map((track) =>{
            return getSpotifySong(track.external_urls.spotify);
        }));
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
        console.log('playlist queued', playlist);
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
        } catch (err) {
            // print error if bot fails join
            console.log(err);
            queue.delete(message.guild.id);
            return message.channel.send("no cooks in the kitchen.");
        }
    } else {
        serverQueue.songs = serverQueue.songs.concat(playlist); //add playlist to end of queue if song is already playing
        console.log('playlist queued', playlist);
        return message.channel.send(`A playlist has been added to your plate`);
    }
}

// export
module.exports = {
    cook,
    menu,
    playlistLoader
}