const express = require('express');
const path = require('path');
const app = express() , PORT = 3000;
const { Client, GatewayIntentBits, Events } = require('discord.js');
const { token } = require('./config.json');
const commandLib = require('./src/utils/command-loader');
const reply = require('./src/responses/reply');
const parser = require('./src/utils/command-parser');
const Session = require('./src/classes/session');
const announce = require('./src/responses/announce');

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
client.once('ready', () => {console.log('--Mr. Oats is Online--')});
app.use( express.json() );
app.listen(PORT, ()=>{console.log('--Oats API Initialized--')});

//Listen for commands from discord
client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;
	await interaction.deferReply(); //give mr oats time to think - otherwise interaction expires after 3s
	const command = interaction.client.commands.get(interaction.commandName);
	if (!command) return reply(interaction,`[ERROR] No command matching ${interaction.commandName} was found.`);

	let commandArgs = parser(interaction);
	let session = sessionDir.get(interaction.guild.id);
	if (!session){ //create a new session if needed
		session = new Session();
		await session.init(commandArgs);
		sessionDir.set(interaction.guild.id, session);
	}
	command.execute(session,commandArgs).then((message)=>{
		reply(interaction,message);
	},(err)=>{
		reply(interaction,err.stack); 
	})
});

//listen for API requests
app.get('/:session/:command', async (req,res)=>{
	let session = sessionDir.get(req.params.session);
	let commandArgs = req.query;
	const command = client.commands.get(req.params.command);
	command.execute(session,commandArgs).then((message)=>{
		res.send(message);
		announce(session,message); //discord endpoint
	},(err)=>{
		res.send(session,message);
		announce(err.stack);
	})
});

//mr oats homepage
app.get('/', async (req,res) => res.sendFile(path.join(__dirname,'public','index.html')));