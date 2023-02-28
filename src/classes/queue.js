const Song = require('./song');
const getPlaylist = require('./playlist');

module.exports = class Queue {
    constructor(){
    }
    async init (command){
        this.contents = [];
        await this.add(command);
    }
    async add(command,position=this.contents.length){ //position defaults to last
        if (command.pos) position = command.pos; //set position if requested by the user

        if (!command.isPlaylist){ //singles
            let song = new Song();
            await song.init(command);
            this.contents.splice(position,0,song);
        } else {
            let songs = getPlaylist(command);
            this.contents.splice(position,0,...songs);
        }
    }

    async rm(position){//position defaults to last

    }

    async nowPlaying(){

    }

    report(){//return list of what's in the queue
        let queued = '';
        for (const song of this.contents){
            queued+=`${song.title}\n`;
        }
        return queued;
    }

    async clear(){//empty the queue

    }
}