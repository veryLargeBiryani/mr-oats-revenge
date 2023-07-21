//simplify interaction properties (get only the ones we're going to use)
module.exports = (interaction)=>{
    const command = {
        guild: interaction.guild,
        channel: interaction.member.voice.channelId,
        author: interaction.member,
        textChannel: interaction.channelId
    };
    if (interaction.commandName == 'skip' || interaction.commandName == 'remove') command.skipNum = interaction.options._hoistedOptions[0]?.value;    
    if (interaction.commandName == 'play') {
        command.mode = interaction.options._subcommand;
        command.pos = interaction.options._hoistedOptions[1]?.value;
        command.source = 'youtube';	//youtube by default
        command.isPlaylist = false; //single song by default
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
            default:
                break;
        }
    }  
    return command;
}