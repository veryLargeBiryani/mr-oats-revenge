//dependencies
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('skip') //name properties in commands/options cannot have uppercase letters, spaces, or symbols (but choices can)
		.setDescription('Skip the current song (and a few others if you want)')
                .addNumberOption(option=> //user prompted to provide a url
                        option.setRequired(false)
                        .setName('number')
                        .setDescription('How many songs do you want to skip? Default is 1')
                        .setMinValue(2)
                ),
	async execute(session,command) {
                if (!command.skipNum) session.skip();
                else session.skip(command.skipNum);
                return `${command.author} skipped! - sucks for whoever queued that up.`;
	}
};