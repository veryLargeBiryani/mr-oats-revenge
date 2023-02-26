const ytpl = require('ytpl');
const Song = require('./song');

module.exports = class Queue {
    constructor(){
    }
    async init (command){
        this.contents = [];
        await this.add(command);
    }
    async add(command,position=this.contents.length){ //position defaults to last
        if (command.pos) position = command.pos; //set position if requested by the user
        //queue a playlist
        if (command?.url.search(/(\/playlist)|(\/album\/)|(&list=)/g) > 0){
            let playlist = await ytpl(command.url); //doesn't support mixes, need error catching - ex/ https://www.youtube.com/watch?v=xGBriJaqLqI&list=RDMM&index=19
            let songs = [];
                for (const i in playlist.items){
                    if (i > 20) break; //playlist length limit
                    songs.push(new Song({url: playlist.items[i].shortUrl}));
                }
                this.contents.splice(position,0,...songs);
        } else { //queue a song 
            this.contents.splice(position,0,new Song(command));
        }
    }
    async rm(position){//position defaults to last

    }
    async nowPlaying(){

    }
    report(){//return list of what's in the queue
        let queued = '';
        for (const song of this.contents){
            queued+=`${song.url}\n`;
        }
        return queued;
    }
    async clear(){//empty the queue

    }
}