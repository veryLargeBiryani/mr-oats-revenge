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
	async execute(interaction,sessionDir) {
        let skipNum = interaction.options._hoistedOptions[0]?.value;
        if (!skipNum) sessionDir.get(interaction.guild.id).skip();
        else sessionDir.get(interaction.guild.id).skip(skipNum);
        return `${interaction.member} skipped! - sucks For whoever queued that up.`;
	}
};