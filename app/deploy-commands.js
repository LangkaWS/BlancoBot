(
	/**
	 * Deploy commands on Discord API.
	 */
	async () => {

		try {

			const { Routes } = require('discord.js');
			const { REST } = require('@discordjs/rest');
			const commandHelper = require('./helper/command');

			// Get environment variables
			require('dotenv').config();
			const token = process.env.BOT_TOKEN;
			const app = process.env.APPLICATION_ID;

			// Get commands data
			const commands = commandHelper.getCommands();
			const commandsData = commands.map(command => command.data.toJSON());

			const rest = new REST({ version: '10' }).setToken(token);

			// Register commands
			await rest.put(Routes.applicationCommands(app), { body: commandsData });
			console.log('Successfully registered application commands.');

		} catch (error) {
			console.error(error);
		}
	}
)();