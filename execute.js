// dependencies
const {getTracks} = require('spotify-url-info');
const {getSpotifySong, getSong} = require('./getSong.js');
const {cook} = require('./cook.js');
const ytpl = require('ytpl');
const {MessageEmbed} = require('discord.js');
const { menu } = require('./queue.js');

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
            //message back to discord channel
            const _msg = new MessageEmbed();
            _msg.setColor('RED');
            _msg.setTitle('Please request a dish you would like me to cook!');//song object came back empty
            return message.channel.send(_msg); //use message.channel instead of serverQueue.textChannel since queue might not have been set yet (this could be first song being executed)
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
    if (!voiceChannel){
        //message back to discord channel
        const _msg = new MessageEmbed();
        _msg.setColor('RED');
        _msg.setTitle('Please enter the kitchen before cooking your meal.');
        return message.channel.send(_msg);
    } 
    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
        //message back to discord channel
        const _msg = new MessageEmbed();
        _msg.setColor('RED');
        _msg.setTitle(`You don't belong in the kitchen.`);
        return message.channel.send(_msg);
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
        if (playlist.length > 1){ //if we are queueing a playlist we show the queue to go along with the queue'd song message above
            menu(message,{songs: playlist, textChannel: message.channel}, 'GREEN', 'new meals have been requested'); //impersonate serverqueue object but with new loaded playlist songs!
        } //use message.channel here since queueContract may not have finished setting yet.
        try {
            // try to join voice and save connection into object
            queueContract.connection = await voiceChannel.join();
            // call play function and start song
            cook(message.guild, queueContract.songs[0], queue);
        } catch (err) {
            // print error if bot fails join
            console.log(err);
            queue.delete(message.guild.id);
            //message back to discord channel
            const _msg = new MessageEmbed();
            _msg.setColor('RED');
            _msg.setTitle(`the stove is not working at this time`);
            return message.channel.send(_msg);
        }
    } else {
        serverQueue.songs = serverQueue.songs.concat(playlist); //add playlist to end of queue if song is already playing
        console.log('queued',playlist);
        if (playlist.length > 1){ //if we are queueing a playlist we show the queue to go along with the queue'd song message above
            menu(message,{songs: playlist, textChannel: serverQueue.textChannel}, 'GREEN', 'new meals have been requested'); //impersonate serverqueue object but with new loaded playlist songs!
        } else {
            //message back to discord channel
            const _msg = new MessageEmbed();
            _msg.setColor('GREEN');
            _msg.setTitle(`*${playlist[0].title}* has been added to your plate`);
            _msg.setURL(playlist[0].url);
            await message.channel.send(_msg);
        }
        return;
    }
}

module.exports = {execute};