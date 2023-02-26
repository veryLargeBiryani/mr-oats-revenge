//dependencies
const ytsr = require('ytsr');
const ytdl = require('play-dl');
const { createAudioResource  } = require('@discordjs/voice');

module.exports = class Song {
    constructor(command){
        if(command.url) {
            this.url = command.url;
        } else {
            ytsr.getFilters(command.query).then((filters1)=>{
                const filter1 = filters1.get('Type').get('Video');
                if (filter1.url == null){ //error handling if query returned no results
                    console.log(`Query "${command.query}" returned no results!`);
                } else {
                    ytsr(filter1.url, {pages : 1}).then((searchResults)=>{
                        this.title = searchResults.items[0].title;
                        this.url = searchResults.items[0].url;
                    })
                }
            })
        }
        
    }
    async getStream(){
        let stream = await ytdl.stream(this.url);
        this.resource = createAudioResource(stream.stream,{inputType: stream.type});
    }
}