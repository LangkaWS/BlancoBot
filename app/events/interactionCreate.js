module.exports = {
	name: 'interactionCreate',
	async execute(interaction) {

		try {

			if (interaction.isChatInputCommand()) {

				const command = interaction.client.commands.get(interaction.commandName);
				if (!command) return;
				await command.execute(interaction);
				return;

			}

			interaction.deferUpdate();

		} catch (error) {
			console.error(error);
		}

	},
};