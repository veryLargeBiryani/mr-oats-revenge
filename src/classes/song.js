//dependencies
const ytdl = require('ytdl-core'); //should change to ytdl-core-discord down the line for performance
const { createAudioResource } = require('@discordjs/voice');
const ytsr = require('ytsr');

module.exports = class Song {
    constructor(command){ //https://stackoverflow.com/questions/50237260/function-that-takes-an-object-with-optional-default-properties-as-a-parameter
        if(command.url) {
            this.url = command.url;
            this.resource = createAudioResource(ytdl(this.url, {filter: "audioonly"}));
        } else {
            ytsr.getFilters(command.query).then((filters1)=>{
                const filter1 = filters1.get('Type').get('Video');
                if (filter1.url == null){ //error handling if query returned no results
                    console.log(`Query "${command.query}" returned no results!`);
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