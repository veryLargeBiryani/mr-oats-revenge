//dependencies
const { SlashCommandBuilder } = require('discord.js');
const Session = require('../classes/session');
const Queue = require('../classes/queue');
const Song = require('../classes/song');

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
		)
		.addSubcommand(subcommand=> //url gets own subcommand for interface simplicity
			subcommand.setName('by-url') 
				.setDescription('Add a song or playlist using a link')
				.addStringOption(option=> //user prompted to queue playlist or song
					option.setRequired(true)
						.setName('type')
						.setDescription('Playlist or Song')
						.addChoices( //can only pick from these 2 choices
							{name:'playlist',value:'playlist'},
							{name:'song',value: 'song'}
						)
				)
				.addStringOption(option=> //user prompted to provide a url
					option.setRequired(true)
						.setName('url')
						.setDescription('The link you want to play from')
				)
		),
	async execute(interaction,sessionDir) {
		//harvest command variables
		const params = {type:null,url:null,query:null};
		switch(interaction.options._subcommand){
			case 'by-url':
				params.type = interaction.options._hoistedOptions[0].value;
				params.url = interaction.options._hoistedOptions[1].value;
				break;
			case 'by-search':
				params.query = interaction.options._hoistedOptions[0].value;
				break;
		}
		//create a new session if needed
		const session = sessionDir.get(interaction.guild.id);
		if (!session){
			sessionDir.set(interaction.guild.id, new Session(interaction.guild, interaction.member.voice.channelId, new Queue([new Song({url:params.url,query:params.query})])));
			await interaction.reply(`This command was run by ${interaction.user.username}, who joined on ${interaction.member.joinedAt}.`);  
			return;
		};
		//if a session exists already we just process the command
		session.queue.add([new Song({url:params.url,query:params.query})]);

		// interaction.user is the object representing the User who ran the command
		// interaction.member is the GuildMember object, which represents the user in the specific guild
		await interaction.reply(`This command was run by ${interaction.user.username}, who joined on ${interaction.member.joinedAt}.`);   
	}
};