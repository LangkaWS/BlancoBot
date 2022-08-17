const { Collection } = require('discord.js');
const commandHelper = require('./helper/command');

/**
 * Load slash commands in client commands collection.
 * @param {Client} client the bot's client
 */
const loadSlashCommands = (client) => {

	client.commands = new Collection();
	const commands = commandHelper.getCommands();
	commands.forEach(command => client.commands.set(command.data.name, command));

};

module.exports = {
	loadSlashCommands,
};