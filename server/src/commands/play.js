const { SlashCommandBuilder } = require('discord.js');

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
	async execute(session,command) {
		await session.queue.add(command);
		//play the song if nothing is currently playing/bot is disconnected
		if (session.player.state.status == 'idle'){
			session.connection.rejoin({
				channelId: command.channel,
				guildId: command.guild.id
			});
			session.connection.subscribe(session.player);
			await session.queue.contents[0].getStream(); 
			session.player.play(session.queue.contents[0].resource); 
		}
 		return `Queued: [${session.queue.contents[session.queue.contents.length-1].title}](${session.queue.contents[session.queue.contents.length-1].url})`;
	}
};