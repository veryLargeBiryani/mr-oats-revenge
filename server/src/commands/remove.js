const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('remove') //name properties in commands/options cannot have uppercase letters, spaces, or symbols (but choices can)
		.setDescription('Remove a song from the queue!')
        .addNumberOption(option=> //user prompted to provide a url
            option.setRequired(false)
            .setName('number')
            .setDescription('Which song do you want to remove? Defaults to last song.')
            .setMinValue(2) //can't remove song that is currently playing
        ),
	async execute(session,command) {
        if (command.skipNum - 1 > session.queue.contents.length) command.skipNum = session.queue.contents.length; //default to last song if number is too big
        let alert = `Removed: ${session.queue.contents[command.skipNum-1].title}`;
		await session.queue.rm(command.skipNum-1); //skip num and remove num share same var name
 		return alert;
	}
};