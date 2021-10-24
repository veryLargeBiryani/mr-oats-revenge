// dependencies
const ytdl = require('ytdl-core');

// functions
async function cook(guild, song, queue){
    const serverQueue = queue.get(guild.id);
    if (!song) {
        console.log('end of server queue, oats is disconnecting');
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

// export
module.exports = {cook};