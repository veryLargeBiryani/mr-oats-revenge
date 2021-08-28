// dependencies
const Discord = require('discord.js');
const{
    prefix,
    token,
} = require('./config.json');
const random = require('random');
const bf = require('./bot_functions.js');
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
        bf.execute(message, serverQueue, queue);
        return;
        //}
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
!help - shows you this
!cook - cook up a tune
!menu - what's for breakfast?
!lunch - skip your meal
!cancel - cancels your order`
        );
        return;
    } else if (message.content.startsWith(`${prefix}oatmeal`)){
        message.content = "!cook https://www.youtube.com/watch?v=0Dpw0VvH4m0";
        bf.execute(message, serverQueue, queue);
        return;
    } else{
        message.channel.send("that is not cookable.");
        return;
    }
});