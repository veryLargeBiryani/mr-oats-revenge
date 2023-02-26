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
        if (command.url && command?.url?.search(/(\/playlist)|(\/album\/)|(&list=)/g) > 0){ //queue playlist
            let playlist = await ytpl(command.url);
            let songs = [];
                for (const i in playlist.items){
                    if (i > 20) break; //playlist length limit
                    let song = new Song();
                    await song.init({url: playlist.items[i].shortUrl});
                    songs.push(song);
                }
                this.contents.splice(position,0,...songs);
        } else { //queue single song
            let song = new Song();
            await song.init(command);
            this.contents.splice(position,0,song);
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