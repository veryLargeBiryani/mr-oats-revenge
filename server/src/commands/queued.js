//dependencies
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('queued') //name properties in commands/options cannot have uppercase letters, spaces, or symbols (but choices can)
		.setDescription("See what's queued!"),
	async execute(session,command){
        return session.queue.report();
	}
};