//dependencies
const ytdl = require('ytdl-core');
const { createAudioResource } = require('@discordjs/voice');
const ytsr = require('ytsr');

module.exports = class Song {
    constructor(session,{url, query} = {}){ //https://stackoverflow.com/questions/50237260/function-that-takes-an-object-with-optional-default-properties-as-a-parameter
        if(url) {
            this.url = url;
            this.resource = createAudioResource(ytdl(url, {filter: "audioonly"}));
        } else {
            const filters1 = await ytsr.getFilters(query);
            const filter1 = filters1.get('Type').get('Video');
            if (filter1.url == null){ //error handling if query returned no results
                // session.log(`Query "${query}" returned no results!`);
            } else {
                const searchResults = await ytsr(filter1.url, {pages : 1});
                this.title = searchResults.items[0].title;
                this.url = searchResults.items[0].url;
                this.resource = createAudioResource(ytdl(this.url, {filter: "audioonly"}));
            }
        }
    }
}