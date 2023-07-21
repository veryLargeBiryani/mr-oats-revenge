//this script runs independently from the rest of the bot to register the bot's commands with discord so they appear in the UI
//https://discordjs.guide/creating-your-bot/command-deployment.html#command-registration

//dependencies
const fs = require('fs');
const path = require('path');
const { REST, Routes } = require('discord.js');
const { token, test_guild_id, client_id } = require('../config.json');

//get command files from the commands directory
const commandFiles = fs.readdirSync(path.join(__dirname , 'src', 'commands')).filter(file => file.endsWith('.js'));

//get command data as json for PUT request
const commands = [];
for (const file of commandFiles) {
	const command = require(path.join(__dirname, 'src', 'commands', file));
	commands.push(command.data.toJSON());
}

//register commands via PUT request
const rest = new REST({ version: '10' }).setToken(token); //use discordjs RESTful package
(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);
		const data = await rest.put(
			Routes.applicationGuildCommands(client_id, test_guild_id), //change to .applicationCommands(client_id) for global (for all guilds) command registration
			{ body: commands },
		);
		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		console.error(error);
	}
})();