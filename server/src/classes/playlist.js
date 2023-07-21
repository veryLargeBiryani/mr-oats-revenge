const fetch = require('isomorphic-unfetch');
const { getTracks } = require('spotify-url-info')(fetch);
const ytpl = require('ytpl');
const ytdl = require('play-dl');
ytdl.getFreeClientID().then((clientID) => {
    ytdl.setToken({
      soundcloud : {
          client_id : clientID
      }
    })
})
const Song = require('./song');

module.exports = async (command)=>{
    let tracks = [];
    let playlist;
    switch(command.source){
        case 'youtube':
            playlist = await ytpl(command.url);
            for (const i in playlist.items){
                if (i > 20) break; //playlist length limit
                let song = new Song();
                await song.init({source: command.source, url: playlist.items[i].shortUrl});
                tracks.push(song);
            }
            break;
        case 'soundcloud':
            playlist = await ytdl.soundcloud(command.url);
            for (const i of playlist.tracks){
                if (i > 20) break; //playlist length limit
                if (!i.fetched) continue; //if soundcloud stops returning links we stop trying to queue them (seems like api is limited to 5 at a time)
                let song = new Song();
                await song.init({source: command.source, url: i.url});
                tracks.push(song);
            }
            break;
        case 'spotify':
            playlist = await getTracks(command.url);
            for (const i in playlist){
                if (i > 20) break; //playlist length limit
                let song = new Song();
                await song.init({source: 'search', query: `${playlist[i].name} ${playlist[i].artist}`}); //swap source to youtube search
                if (song.title && song.url) tracks.push(song); //only add song to the list if it is found
            }
            break;
    }
    return tracks;
}