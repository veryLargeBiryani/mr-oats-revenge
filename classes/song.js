//dependencies
const ytdl = require('ytdl-core');
const { createAudioResource } = require('@discordjs/voice');
const ytsr = require('ytsr');

module.exports = class Song {
    constructor({url, query} = {},session){ //https://stackoverflow.com/questions/50237260/function-that-takes-an-object-with-optional-default-properties-as-a-parameter
        if(url) {
            this.url = url;
            this.resource = createAudioResource(ytdl(url, {filter: "audioonly"}));
        } else {
            ytsr.getFilters(query).then((filters1)=>{
                const filter1 = filters1.get('Type').get('Video');
                if (filter1.url == null){ //error handling if query returned no results
                    //session.log(`Query "${query}" returned no results!`);
                    console.log(`Query "${query}" returned no results!`);
                } else {
                    ytsr(filter1.url, {pages : 1}).then((searchResults)=>{
                        this.title = searchResults.items[0].title;
                        this.url = searchResults.items[0].url;
                        this.resource = createAudioResource(ytdl(this.url, {filter: "audioonly"}));
                    })
                }
            })
        }
    }
}