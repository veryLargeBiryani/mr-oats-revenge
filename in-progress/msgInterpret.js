//dependencies
const {execute} = require('./execute.js');
const {drink,leftovers, meal} = require('./time.js');
const {menu,lunch,cancel,instantOats,hold} = require('./queue.js');
const {prefix} = require('./config.json');
const { MessageEmbed } = require('discord.js');
const random = require('random');
const oatmeal = 'https://www.youtube.com/watch?v=0Dpw0VvH4m0'; //youtube link to the oatmeal song
const oatmealList = 'https://www.youtube.com/watch?v=QmQ9GkzptLQ&list=PLr1Z3nSZwaybDyAuXbpG9ZT0TUyJKXeAe'; //youtube link to oatmeal playlist

async function msgInterpret (message,queue) {
    const serverQueue = queue.get(message.guild.id); //retrieve server's music session
    //if (message.author.id == '317465832341110786') return serverQueue.textChannel.send('haha no oats for you LOSER');
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;
    if (message.content.startsWith(`${prefix}cook`)){
        if (random.int(0,199) == 1){ //random chance of oatmeal 1/200
            serverQueue.textChannel.send("surprise oatmeal!!! the song you queued has been sent to the ether. please try again and enjoy the delicious oatmeal :bowl_with_spoon: dumbass");
            message.content = `!cook ${oatmeal}`;
        }
        execute(message, queue);
    } else if (message.content == `${prefix}lunch`){
        lunch(message, serverQueue);
    } else if (message.content == `${prefix}cancel`){
        cancel(message, serverQueue);
    } else if (message.content == `${prefix}menu`){
        menu(message, serverQueue);
    } else if (message.content == `${prefix}help`){
        message.channel.send(
            `\`\`\`fix
commands:
${prefix}help - shows you this
${prefix}meal - what's for breakfast?
${prefix}menu - what's for lunch!
${prefix}cook {youtube/spotify url or a search} - cook up a tune or group of tunes
${prefix}instantoats {number} - choose where in the menu your meal will be added (e.g. 'instantoats 2 {your meal}' adds the meal to the next order!)
${prefix}hold {number} - remove a meal from the menu
${prefix}drink - take a break from your meal and hydrate. you can enjoy your leftovers with ${prefix}leftovers
${prefix}lunch - skip your meal
${prefix}cancel - cancels your order
\`\`\``);
        message.delete(); //has to be nested inside this if for some reason.
        return;
    } else if (message.content == `${prefix}oatmeal`){
        message.content = `${prefix}cook ${oatmeal}`;
        execute(message, queue);
    } else if (message.content == `${prefix}drink`){
        drink(message,serverQueue);
    } else if (message.content == `${prefix}leftovers`){
        leftovers(message,serverQueue,queue);
    } else if (message.content.startsWith(`${prefix}instantoats`)){
        instantOats(message,serverQueue);
    } else if (message.content.startsWith(`${prefix}hold`)){
        hold(message,serverQueue);
    } else if (message.content == `${prefix}meal`){
        meal(serverQueue,message);
    }
    //message.delete(); //delete after message is identified as mr oats command
}
module.exports = {msgInterpret};