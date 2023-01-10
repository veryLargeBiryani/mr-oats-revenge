const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Add a song to the queue!')
        .addStringOption(option =>
			option.setRequired(true)
				.setName('format')
				.setDescription('Is this a link or a search?')
				.addChoices(
					{name:'link', value:'url'},
					{name:'search', value:'search'}
				)
		)
		.addStringOption(option=>
			option.setRequired(true)
				.setName('music')
				.setDescription('Either a Link or a Search')
		),
	async execute(interaction) {
		// interaction.user is the object representing the User who ran the command
		// interaction.member is the GuildMember object, which represents the user in the specific guild
		await interaction.reply(`This command was run by ${interaction.user.username}, who joined on ${interaction.member.joinedAt}.`);
	},
};