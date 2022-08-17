const fs = require('node:fs');
const path = require('node:path');

/**
 * Get commands from files.
 * @return commands as array
 */
const getCommands = () => {

	const commands = [];

	// Get command files
	const commandsPath = path.join(__dirname, '../', 'commands', 'slash');
	const commandFiles = fs.readdirSync(commandsPath);

	// Set command in client commands collection
	commandFiles.forEach(file => {

		const filePath = path.join(commandsPath, file);
		const command = require(filePath);

		commands.push(command);
	});

	return commands;

};

module.exports = {
	getCommands,
};