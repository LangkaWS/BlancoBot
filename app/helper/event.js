const fs = require('node:fs');
const path = require('node:path');

/**
 * Get commands from files.
 * @return commands as array
 */
const handleEvent = (client) => {

	// Get command files
	const eventsPath = path.join(__dirname, '../', 'events');
	const eventFiles = fs.readdirSync(eventsPath);

	// Set command in client commands collection
	eventFiles.forEach(file => {

		const filePath = path.join(eventsPath, file);
		const event = require(filePath);

		if (event.once) {
			client.once(event.name, async (...args) => await event.execute(...args));
		} else {
			client.on(event.name, async (...args) => await event.execute(...args));
		}

	});

};

module.exports = {
	handleEvent,
};