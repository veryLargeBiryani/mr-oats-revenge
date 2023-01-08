module.exports = class Queue {
    constructor(songs){
        this.contents = songs;
    }
    async skip(n=1){//skips next (n) songs in the queue

    }
    async add(song,position){//position defaults to last

    }
    async rm(position){//position defaults to last

    }
    async report(){//return list of what's in the queue

    }
    async clear(){//empty the queue

    }
}