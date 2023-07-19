//dependencies
const fs = require('fs');
const path = require('path');
const { Collection } = require('discord.js');

module.exports = function(){
    //initialize path and command map
    commands = new Collection();
    const commandsPath = path.join(__dirname, '..', 'commands');
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js')); //get only js files
    //loop through the commands folder and add each file to the commands list
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        // Set a new item in the Collection with the key as the command name and the value as the exported command - json via require()
        if ('data' in command && 'execute' in command) {
            commands.set(command.data.name, command);
        } else {
            console.log(`[WARNING] The command at ${filePath} cannot be called becayse it is missing a "data" or "execute" property.`);
        }
    }
    return commands;
}