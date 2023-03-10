const fetch = require('isomorphic-unfetch');
const { getData } = require('spotify-url-info')(fetch);
const ytsr = require('ytsr');
const { createAudioResource  } = require('@discordjs/voice');
const ytdl = require('play-dl');
ytdl.getFreeClientID().then((clientID) => {
    ytdl.setToken({
      soundcloud : {
          client_id : clientID
      }
    })
})

module.exports = class Song {
    constructor(){
    }
    async init(command){
        switch(command.source){
            case 'youtube':
                await this.youtube(command.url);
                break;
            case 'soundcloud':
                await this.soundcloud(command.url);
                break;
            case 'spotify':
                await this.spotify(command.url);
                break;
            case 'search':
                await this.search(command.query);
                break;
        }
    }
    async getStream(){ //stream from youtube or soundcloud track url
        let stream = await ytdl.stream(this.url);
        this.resource = createAudioResource(stream.stream,{inputType: stream.type});
    }
    async spotify(url){
        let track = await getData(url); //grab song metadata
        await this.search(`${track.name} ${track.artists[0].name}`);
    }
    async youtube(url){
        this.url = url;
        let info = await ytdl.video_basic_info(this.url);
        this.title  = info.video_details.title;
    }
    async soundcloud(url){
        this.url = url;
        let info = await ytdl.soundcloud(this.url);
        this.title  = info.name;
    }
    async search(query){
        let filter = await ytsr.getFilters(query);
        let search = await ytsr(filter.get('Type').get('Video').url,{pages : 1});
        this.url = search.items[0].url;
        this.title = search.items[0].title;
    }
}
