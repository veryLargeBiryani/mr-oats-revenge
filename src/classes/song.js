//dependencies
const fetch = require('isomorphic-unfetch');
const { getData, getPreview, getTracks, getDetails } = require('spotify-url-info')(fetch);
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
        if(command.url) {
            this.url = command.url;
            let video = await ytdl.video_basic_info(command.url);
            this.title  = video.video_details.title;
        } else {
            let filter = await ytsr.getFilters(command.query);
            let search = await ytsr(filter.get('Type').get('Video').url,{pages : 1});
            this.url = search.items[0].url;
            this.title = search.items[0].title;        
        }
    }
    async getStream(){
        let stream = await ytdl.stream(this.url);
        this.resource = createAudioResource(stream.stream,{inputType: stream.type});
    }
}