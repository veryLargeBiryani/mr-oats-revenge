// dependencies
const { MessageEmbed } = require('discord.js');
//const {meal} = require('./time.js');
const ytdl = require('ytdl-core');

// functions
async function cook(guild, song, queue){
    const serverQueue = queue.get(guild.id);
    if (!song) {
        //let fetched = await serverQueue.textChannel.fetchMessages({limit: 100});
        try {
            serverQueue.textChannel.bulkDelete(100); //clean text chat messages when oats disconnects
        }
        catch(e){
            console.log('Message delete failure', e);
        }
        console.log('end of server queue, oats is disconnecting');
        serverQueue.voiceChannel.leave();
        //message back to discord channel
        const _msg = new MessageEmbed();
        _msg.setColor('WHITE');
        _msg.setTitle(`No more oatmeal! Order another meal if you are still hungry!`);
        serverQueue.textChannel.send(_msg);
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
            serverQueue.songs.shift();
            cook(guild, serverQueue.songs[0], queue); //play next song on socket error
        });
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
    //message back to discord channel
    const _msg = new MessageEmbed();
    _msg.setColor('GREEN');
    _msg.setTitle(`breakfast is served: *${song.title}*`);
    _msg.setURL(song.url);
    serverQueue.textChannel.send(_msg);

    console.log('now playing', song);
    return;
}

// export
module.exports = {cook};