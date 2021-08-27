// dependencies
const Discord = require('discord.js');
const{
    prefix,
    token,
} = require('./config.json');
const ytdl = require('ytdl-core');
const random = require('random');
//******************************

// variables to modify
let oldContent;

// main body of code
const client = new Discord.Client();

const queue = new Map();

client.login(token);

client.once('ready', () => {
    console.log('Ready!');
});
client.once('reconnecting', () =>{
    console.log('Reconnecting!');
});
client.once('disconnect', () =>{
    console.log('Disconnect!');
});

client.on('message', async message =>{
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;

    const serverQueue = queue.get(message.guild.id);

    if (message.content.startsWith(`${prefix}cook`)){
        /*if (random.int(0,0) == 0){
            oldContent = `${message.content}`;
            message.content = "!cook https://www.youtube.com/watch?v=0Dpw0VvH4m0";
            await execute(message, serverQueue);
            setTimeout(() => {
                message.content = oldContent;
                execute(message, serverQueue);
            }, 20000);
            return;
        } else {*/
        execute(message, serverQueue);
        return;
        //}
    } else if (message.content.startsWith(`${prefix}lunch`)){
        lunch(message, serverQueue);
        return;
    } else if (message.content.startsWith(`${prefix}cancel`)){
        cancel(message, serverQueue);
        return;
    } else if (message.content.startsWith(`${prefix}plate`)){
        plate(message, serverQueue);
    } else if (message.content.startsWith(`${prefix}help`)){
        message.channel.send(
`commands:
!help - shows you the ingredients
!cook - cook up a tune
!plate - what's for breakfast?
!lunch - skip your meal
!cancel - cancels your order`
        );
    } else if (message.content.startsWith(`${prefix}oatmeal`)){
        message.content = "!cook https://www.youtube.com/watch?v=0Dpw0VvH4m0";
        execute(message, serverQueue);
        return;
    } else{
        message.channel.send("that is not cookable.");
    }
});

// functions
async function execute(message, serverQueue){
    const args = message.content.split(" ");

    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel)
        return message.channel.send(
            "please enter the kitchen before cooking your meal."
        );
    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
        return message.channel.send(
            "i do not have the necessary utensils to cook you a meal right now."
        );
    }

    // constants
    const songInfo = await ytdl.getInfo(args[1]);
    const song = {
        title: songInfo.videoDetails.title,
        url: songInfo.videoDetails.video_url,
    };

    if (!serverQueue){
        // creating contract for queue
        const queueContract = {
            textChannel: message.channel,
            voiceChannel: voiceChannel,
            connection: null,
            songs: [],
            volume: 5,
            playing: true,
        };
    
        // setting queue using contract
        queue.set(message.guild.id, queueContract);
        // push song to songs array
        queueContract.songs.push(song);
        
        try {
            // try to join voice and save connection into object
            var connection = await voiceChannel.join();
            queueContract.connection = connection;
            // call play function and start song
            cook(message.guild, queueContract.songs[0]);
        } catch (err) {
            // print error if bot fails join
            console.log(err);
            queue.delete(message.guild.id);
            return message.channel.send("no cooks in the kitchen.");
        }
    } else {
        serverQueue.songs.push(song);
        console.log(serverQueue.songs);
        return message.channel.send(`${song.title} has been added to your plate`);
    }
}

function cook(guild, song){
    const serverQueue = queue.get(guild.id);
    if (!song) {
        serverQueue.voiceChannel.leave();
        queue.delete(guild.id);
        return;
    }

    const dispatcher = serverQueue.connection
        .play(ytdl(song.url))
        .on("finish", () => {
            serverQueue.songs.shift();
            cook(guild, serverQueue.songs[0]);
        })
        .on("error", error => console.error(error));
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
    serverQueue.textChannel.send(`breakfast is served: ${song.title}`);
    console.log(serverQueue.songs)
}

function lunch(message, serverQueue){
    if (!message.member.voice.channel)
        return message.channel.send(
            "only chefs can change the ingredients."
        );
    if (!serverQueue)
            return message.channel.send("no other meals to prepare.");
    serverQueue.connection.dispatcher.end();
}

function cancel(message, serverQueue){
    if (!message.member.voice.channel)
        return message.channel.send(
            "only chefs can change the ingredients."
        );
    if (!serverQueue)
            return message.channel.send("no dishes to throw out.");
    serverQueue.songs = [];
    serverQueue.connection.dispatcher.end();
}

function plate(message, serverQueue){
    if (!serverQueue){
        return message.channel.send(
            "nothing is plated."
        );
    }
    else {
        let myPlate = `here's yer grub: `;
        for (i = 0; i < serverQueue.songs.length; i++){
            myPlate = `${myPlate}
    ${i + 1}. ${serverQueue.songs[i].title}`;
        }
        return message.channel.send(myPlate);
    }
}