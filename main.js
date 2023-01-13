// dependencies
const { Client, GatewayIntentBits, Events } = require('discord.js');
const { token } = require('./config.json');
const commandLib = require('./src/command-loader');

//connect to discord and define bot permissions
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates
    ]
});

//Initialize Oats
client.commands = commandLib(); //import commands via command loader
const sessionDir = new Map(); // map of sessions (guild.id) => {Session}
let servers; //map of guilds (guild.id) => {Guild}
client.login(token);
client.once('ready', () => {
    console.log('--Mr. Oats is Online--');
    console.log('----------------------');
    client.guilds.fetch().then( (guilds) =>{
        servers = guilds; //put mr oat's servers in memory
    });
});

//listen for server interactions
client.on('messageCreate', async (message) =>{
    //test code - log the received message
    console.log(`${message.author.username} in ${message.channel.name} on ${message.guild.name} (${message.guildId}) said : ${message.content}`);
});

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;
	//get command from loader using command from interaction
	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) { //command isn't loaded
		console.log(`[ERROR] No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction,sessionDir); //execute the command if it is loaded
	} catch (error) {
		console.log(error);
		await interaction.reply({ content: 'Could not execute command!', ephemeral: true });
	}
});

// kill session if bot is disconnected
client.on('voiceStateUpdate', (oldState, newState) => {//this is discordjs 12 code, needs to be updated with new calls

});