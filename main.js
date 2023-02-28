// dependencies
const { Client, GatewayIntentBits, Events } = require('discord.js');
const { token } = require('./config.json');
const commandLib = require('./src/command-loader');
const reply = require('./src/responses/reply');

//define bot permissions
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates
    ]
});

//Initialize
client.commands = commandLib(); //import commands via command loader
const sessionDir = new Map(); // initialize map of sessions (guild.id) => {Session}
client.login(token);
client.once('ready', () => {
    console.log('--Mr. Oats is Online--');
});

//Listen for commands from discord
client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;
	const command = interaction.client.commands.get(interaction.commandName);
	if (!command) { //command isn't loaded
		reply(interaction,404);
		console.log(`[ERROR] No command matching ${interaction.commandName} was found.`);
		return;
	}
	command.execute(interaction,sessionDir).then((res)=>{
		reply(interaction,res);
	},(err)=>{
		reply(interaction,err.stack);
	})
});

// kill session if bot is disconnected
client.on('voiceStateUpdate', (oldState, newState) => {//this is discordjs 12 code, needs to be updated with new calls

});