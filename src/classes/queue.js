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
            let playlist = await ytpl(command.url);
            let songs = [];
                for (const i in playlist.items){
                    songs.push(new Song({url: playlist.items[i].shortUrl}));
                }
                this.contents.splice(position,0,...songs);
        } else { //queue a song 
            this.contents.splice(position,0,new Song(command));
        }
    }
    async skip(n=1){//skips next (n) songs in the queue

    }
    async rm(position){//position defaults to last

    }
    async report(){//return list of what's in the queue

    }
    async clear(){//empty the queue

    }
}