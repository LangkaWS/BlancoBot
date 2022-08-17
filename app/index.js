require('dotenv').config();

const { Client, GatewayIntentBits } = require('discord.js');
const { loadSlashCommands } = require('./load-commands');
const eventHelper = require('./helper/event');

const clientIntents = [
	GatewayIntentBits.Guilds,
];

const client = new Client({
	intents: clientIntents,
});

loadSlashCommands(client);
eventHelper.handleEvent(client);

client.login(process.env.BOT_TOKEN);