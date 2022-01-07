// dependencies
const { MessageEmbed } = require('discord.js');
const ytdl = require('ytdl-core');
const { disconnect } = require('./sessionEnd');

// functions
async function cook(guild, song, queue){
    let info; //define song info variable outside of try/catch
    const serverQueue = queue.get(guild.id);
    if (!song) {
        try {
            serverQueue.voiceChannel.leave(); //this triggers client.on('voiceStatusUpdate') in main.js
        }
        catch(e){
            return;
        }
        return;
    }
    try {
        info = await ytdl.getInfo(song.url);
    }
    catch(e){
        //message back to discord channel
        const _msg = new MessageEmbed();
        _msg.setColor('RED');
        _msg.setTitle('The requested dish is too spicy! Please cook something else!');//song object came back empty or was age restricted 
        serverQueue.textChannel.send(_msg); //use message.channel instead of serverQueue.textChannel since queue might not have been set yet (this could be first song being executed
        serverQueue.songs.shift(); //move to next song
        cook(guild, serverQueue.songs[0], queue);
        return;
    }
    let songFormat = ytdl.filterFormats(info.formats, 'audioonly');
    let dispatcher = serverQueue.connection
        .play(ytdl(song.url, {format: songFormat[0]})) //add cookies here to get age restricted videos https://github.com/fent/node-ytdl-core/blob/master/example/cookies.js
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