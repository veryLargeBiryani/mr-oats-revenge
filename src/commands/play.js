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
		//simplify interaction properties (get only the ones we're going to use)
		const command = {
			guild: interaction.guild,
			channel: interaction.member.voice.channelId,
			mode: interaction.options._subcommand,
			pos: interaction.options._hoistedOptions[1]?.value,
			source: 'youtube',	//youtube by default
			isPlaylist: false
		};
		switch (interaction.options._subcommand){
			case 'by-url':
				command.url = interaction.options._hoistedOptions[0].value;
				if (command.url.includes('open.spotify')) command.source = 'spotify';
				if (command.url.includes('soundcloud')) command.source = 'soundcloud';
				if (command.url.search(/(\/playlist)|(\/album\/)|(&list=)|(\/sets\/)/g) > 0) command.isPlaylist = true;
				break;
			case 'by-search':
				command.query = interaction.options._hoistedOptions[0].value;
				command.source = 'search';
				break;
		}

		//create a new session if needed
		let session = sessionDir.get(command.guild.id);
		if (!session){
			session = new Session();
			await session.init(command);
			sessionDir.set(command.guild.id, session);
		} else { //if a session exists already we just process the command
			await session.queue.add(command);
			if (session.player.state.status == 'idle'){ //play the song if nothing is playing
				session.connection.rejoin({
					channelId: command.channel,
					guildId: command.guild.id
				});
				session.connection.subscribe(session.player);
				await session.queue.contents[0].getStream(); 
				session.player.play(session.queue.contents[0].resource); 
			}
		} 
		let res = 'Song Queued';
		return res; //res for reply.js
	}
};