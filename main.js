// dependencies
const { Client, GatewayIntentBits } = require('discord.js');
const {token} = require('./config.json');
const execute = require('./src/execute');

//connect to discord and define bot permissions
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates
    ]
});
const sessionDir = new Map(); // (guild.id) => Session

// log the bot into the correct discord dev bot using the token in config.json
client.login(token);
// once the bot has loaded, initialize callback
client.once('ready', () => {
    console.log('--Mr. Oats is Online--');
    console.log('----------------------');
    //test code - log all servers mr oats is connected to
    client.guilds.fetch().then( (guilds) =>{
        console.log(guilds);
    });
});

client.on('messageCreate', async (message) =>{
    // log the received message
    console.log(`${message.author.username} in ${message.channel.name} on ${message.guild.name} (${message.guildId}) said : ${message.content}`);
    //test code - log the channels on the server the bot is currently on
    message.guild.channels.fetch().then((channels)=>{
        console.log(Array.from(channels.keys()));
    });
    //execute bot core function - create session if needed and apply command to the session
    execute(message.guild,sessionDir,message);
});

// kill session if bot is disconnected
client.on('voiceStateUpdate', (oldState, newState) => {//this is discordjs 12 code, needs to be updated with new calls

});