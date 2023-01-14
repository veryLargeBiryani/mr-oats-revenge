const ytpl = require('ytpl');
const Song = require('./song');

module.exports = class Queue {
    constructor(command){
        this.contents = [];
        this.add(command);
    }
    async skip(n=1){//skips next (n) songs in the queue

    }
    async add(command,position=this.contents.length){ //position defaults to last
        if (command.pos) position = command.pos; //initialize position if requested by the user
        let songs = []; //initialize list of songs to add to queue
        //queue a playlist
        if (command?.url.search(/(\/playlist)|(\/album\/)|(&list=)/g)){
            let playlist = await ytpl(command.url);
            for (const i in playlist.items){
                songs.push(new Song({url:playlist.items[i].shortUrl}));
            }
        } else { //queue a song
            songs.push(new Song(command));
        }
        this.contents.splice(position,0,...songs); //https://stackoverflow.com/questions/1348178/a-better-way-to-splice-an-array-into-an-array-in-javascript
    }
    async rm(position){//position defaults to last

    }
    async report(){//return list of what's in the queue

    }
    async clear(){//empty the queue

    }
}