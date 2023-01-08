module.exports = class Queue {
    constructor(songs){
        this.contents = songs;
    }
    async skip(n=1){//skips next (n) songs in the queue

    }
    async add(songs,position=this.contents.length){//position defaults to last
        this.contents.splice(position,0,...songs); //https://stackoverflow.com/questions/1348178/a-better-way-to-splice-an-array-into-an-array-in-javascript
    }
    async rm(position){//position defaults to last

    }
    async report(){//return list of what's in the queue

    }
    async clear(){//empty the queue

    }
}