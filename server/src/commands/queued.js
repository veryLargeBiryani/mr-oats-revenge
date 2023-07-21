//dependencies
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('queued') //name properties in commands/options cannot have uppercase letters, spaces, or symbols (but choices can)
		.setDescription("See what's queued!"),
	async execute(session,command){
		let queue = session.queue.report();
		if (!queue) return "Nothing is currently queued.";
		else return queue;
	}
};