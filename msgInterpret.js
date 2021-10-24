//dependencies
const {execute} = require('./execute.js');
const {drink,leftovers} = require('./time.js');
const {menu,lunch,cancel} = require('./queue.js');
const {prefix} = require('./config.json');
const random = require('random');
const oatmeal = 'https://www.youtube.com/watch?v=0Dpw0VvH4m0'; //youtube link to the oatmeal song
const oatmealList = 'https://www.youtube.com/watch?v=QmQ9GkzptLQ&list=PLr1Z3nSZwaybDyAuXbpG9ZT0TUyJKXeAe'; //youtube link to oatmeal playlist

async function msgInterpret (message,queue) {
    const serverQueue = queue.get(message.guild.id); //retrieve server's music session

    //if (message.author.id == '317465832341110786') return message.channel.send('haha no oats for you LOSER');
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;
    if (message.content.startsWith(`${prefix}cook`)){
        if (random.int(0,199) == 1){ //random chance of oatmeal 1/200
            message.channel.send("surprise oatmeal!!! the song you queued has been sent to the ether. please try again and enjoy the delicious oatmeal :bowl_with_spoon: dumbass");
            message.content = `!cook ${oatmeal}`;
        }
        execute(message, queue);
    } else if (message.content.startsWith(`${prefix}lunch`)){
        lunch(message, serverQueue);
        return;
    } else if (message.content.startsWith(`${prefix}cancel`)){
        cancel(message, serverQueue);
        return;
    } else if (message.content.startsWith(`${prefix}menu`)){
        menu(message, serverQueue);
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
        execute(message, queue);
        return;
    } else if (message.content.startsWith(`${prefix}drink`)){
        drink(message,serverQueue);
    } else if (message.content.startsWith(`${prefix}leftovers`)){
        leftovers(message,serverQueue,queue);
    } else {
        return message.channel.send("that is not cookable.");
    }
}

module.exports = {msgInterpret};