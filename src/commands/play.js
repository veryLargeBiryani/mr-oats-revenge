//dependencies
const { SlashCommandBuilder } = require('discord.js');
const Session = require('../classes/session');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('play') //name properties in commands/options cannot have uppercase letters, spaces, or symbols (but choices can)
		.setDescription('Add a song to the queue!')
        .addSubcommand(subcommand=> //search gets own subcommand for interface simplicity
			subcommand.setName('by-search')
				.setDescription('Add a song using a search query')
				.addStringOption(option=> //user prompted to add search terms
					option.setRequired(true)
						.setName('query')
						.setDescription('Put your search terms here')
				)
				.addStringOption(option=> //user can choose where the song goes in the queue
					option.setRequired(false)
						.setName('position')
						.setDescription('Choose when the song will be queued')
				)
		)
		.addSubcommand(subcommand=> //url gets own subcommand for interface simplicity
			subcommand.setName('by-url') 
				.setDescription('Add a song or playlist using a link')
				// .addStringOption(option=> //user prompted to queue playlist or song
				// 	option.setRequired(true)
				// 		.setName('type')
				// 		.setDescription('Playlist or Song')
				// 		.addChoices( //can only pick from these 2 choices
				// 			{name:'playlist',value:'playlist'},
				// 			{name:'song',value: 'song'}
				// 		)
				// )
				.addStringOption(option=> //user prompted to provide a url
					option.setRequired(true)
						.setName('url')
						.setDescription('The link you want to play from')
				)
				.addStringOption(option=> //user can choose where the song goes in the queue
					option.setRequired(false)
						.setName('position')
						.setDescription('Choose when the song will be queued')
				)
		),
	async execute(interaction,sessionDir) {
		//harvest command variables
		const command = {
			mode: interaction.options._subcommand,
			pos: interaction.options._hoistedOptions[1]?.value
		};
		switch (interaction.options._subcommand){
			case 'by-url':
				command.url = interaction.options._hoistedOptions[0].value;
				break;
			case 'by-search':
				command.query = interaction.options._hoistedOptions[0].value;
				break;
		}
		//create a new session if needed
		const session = sessionDir.get(interaction.guild.id);
		if (!session){
			sessionDir.set(interaction.guild.id, new Session(interaction.guild, interaction.member.voice.channelId, command));
			await interaction.reply(`This command was run by ${interaction.user.username}, who joined on ${interaction.member.joinedAt}.`);  
			return;
		} else session.queue.add(command); //if a session exists already we just process the command
		
		// interaction.user is the object representing the User who ran the command
		// interaction.member is the GuildMember object, which represents the user in the specific guild
		await interaction.reply(`This command was run by ${interaction.user.username}, who joined on ${interaction.member.joinedAt}.`);   
	}
};