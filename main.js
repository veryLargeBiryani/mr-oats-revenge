// dependencies
const fs = require('fs');
const path = require('path');
const { Client, GatewayIntentBits, Collection, Events } = require('discord.js');
const { token } = require('./config.json');
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

//manage commands
client.commands = new Collection();
//loop through the commands folder and add each js file to the commands list
const commandsPath = path.join(__dirname, 'src', 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

//Initialize Oats
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
    //execute bot core function - create session if needed and apply command to the session
    execute(message.guild,sessionDir,message);
});

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

// kill session if bot is disconnected
client.on('voiceStateUpdate', (oldState, newState) => {//this is discordjs 12 code, needs to be updated with new calls

});