require('dotenv').config();

const { Client, GatewayIntentBits } = require('discord.js');
const { loadSlashCommands } = require('./load-commands');

const clientIntents = [
	GatewayIntentBits.Guilds,
];

const client = new Client({
	intents: clientIntents,
});

loadSlashCommands(client);

client.once('ready', () => {
	console.log((new Date()).toLocaleString());
	console.log('Blanco is ready to work!');
});

client.on('interactionCreate', async (interaction) => {

	if (!interaction.isChatInputCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {

		await command.execute(interaction);

	} catch (error) {
		console.error(error);
	}

});

client.login(process.env.BOT_TOKEN);