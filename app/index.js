require('dotenv').config();

const { Client, GatewayIntentBits } = require('discord.js');

const clientIntents = [
	GatewayIntentBits.Guilds,
];

const client = new Client({
	intents: clientIntents,
});

client.once('ready', () => {
	console.log((new Date()).toLocaleString());
	console.log('Blanco is ready to work!');
});

client.login(process.env.BOT_TOKEN);