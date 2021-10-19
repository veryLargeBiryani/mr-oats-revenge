// dependencies
const Discord = require('discord.js');
const{
    prefix,
    token
} = require('./config.json');
const random = require('random');
const bf = require('./bot_functions.js');
const oatmeal = 'https://www.youtube.com/watch?v=0Dpw0VvH4m0'; //youtube link to the oatmeal song
//******************************

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
    //if (message.author.id == '317465832341110786') return message.channel.send('haha no oats for you LOSER');
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;

    const serverQueue = queue.get(message.guild.id); //create server's music queue before song/cook is requested

    if (message.content.startsWith(`${prefix}cook`)){
        if (message.content.includes('playlist') || message.content.includes('open.spotify.com/album/') || message.content.includes('&list')){
            await bf.playlistLoader(message.content.substring(6),queue,message);
        } else {
            if (random.int(0,199) == 1){ //random chance of oatmeal 1/150
                message.channel.send("surprise oatmeal!!! the song you queued has been sent to the ether. please try again and enjoy the delicious oatmeal :bowl_with_spoon: dumbass");
                message.content = `!cook ${oatmeal}`;
            }
            await bf.execute(message, serverQueue, queue);
        }
        return; 
    } else if (message.content.startsWith(`${prefix}lunch`)){
        bf.lunch(message, serverQueue);
        return;
    } else if (message.content.startsWith(`${prefix}cancel`)){
        bf.cancel(message, serverQueue);
        return;
    } else if (message.content.startsWith(`${prefix}menu`)){
        bf.menu(message, serverQueue);
        return;
    } else if (message.content.startsWith(`${prefix}help`)){
        message.channel.send(
`commands:
${prefix}help - shows you this
${prefix}menu - what's for breakfast?
${prefix}cook - cook up a tune - now compatible with spotify and youtube playlists :)
${prefix}drink - take a break from your meal and hydrate. you can enjoy your leftovers with ${prefix}leftovers
${prefix}lunch - skip your meal
${prefix}cancel - cancels your order`);
        return;
    } else if (message.content.startsWith(`${prefix}oatmeal`)){
        message.content = `${prefix}cook ${oatmeal}`;
        bf.execute(message, serverQueue, queue);
        return;
    } else if (message.content.startsWith(`${prefix}drink`)){
        bf.drink(message,serverQueue);
    }  else if (message.content.startsWith(`${prefix}leftovers`)){
        bf.leftovers(message,serverQueue);
    } else {
        message.channel.send("that is not cookable.");
        return;
    }
});