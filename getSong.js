//dependencies
const fetch = require('isomorphic-unfetch');
const ytdl = require('ytdl-core');
const ytsr = require('ytsr');
const {getData} = require('spotify-url-info')(fetch);
const { MessageEmbed } = require('discord.js');
class Song {
    constructor(title, url){
        this.title = title;
        this.url = url;
      }
}

async function getSong(args){
    let searchTitle = "";
    for (i = 1; i < args.length; i++){
        searchTitle = `${searchTitle} ${args[i]}`;
    }

    if (args.length < 2){ //if no search or url was provided
        return new Song(null,null);
    } else if (args[1].includes("http")){ //if command had a direct link
        if (args[1].includes("open.spotify.com/track/")){
            return await getSpotifySong(args[1]);
        } else {
            try {
                const songInfo = await ytdl.getInfo(args[1]);
                return new Song(songInfo.videoDetails.title,songInfo.videoDetails.video_url);
            }
            catch (e){
                return new Song(null,null); //if we can't get the song we return nothing
            }
        }
    } else { //if command had a search
        const filters1 = await ytsr.getFilters(searchTitle);
        const filter1 = filters1.get('Type').get('Video');
        if (filter1.url == null){
            return new Song(null,null);
        } else {
            const searchResults = await ytsr(filter1.url, {pages : 1});
            return new Song(searchResults.items[0].title,searchResults.items[0].url);
        }
    }
}

async function getSpotifySong(url){
    let spotTrack = await getData(url); //grab metadata w/ url
    let spotTrackInfo = `${spotTrack.name} ${spotTrack.artists[0].name}`;
    const filtersSpot = await ytsr.getFilters(spotTrackInfo); //search for youtube url
    const filterSpot = filtersSpot.get('Type').get('Video');
    if (filterSpot.url == null){
        return new Song(null,null);
    } else {
        const spotSearchResults = await ytsr(filterSpot.url, {pages : 1});
        //console.log(`Spotify track was found on youtube: ${spotSearchResults.items[0].title}`);
        return new Song(spotSearchResults.items[0].title, spotSearchResults.items[0].url);
    }
}

module.exports = {getSong, getSpotifySong};
