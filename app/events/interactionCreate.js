const { Birthday, Main } = require('../language/fr.json');

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

			const originalCommandName = interaction.message.interaction.commandName;

			if (interaction.isButton() && originalCommandName === `${Birthday.CommandName} ${Main.ConfigurationCommandName} ${Main.AddCommandName}`) {
				return;
			}

			interaction.deferUpdate();

		} catch (error) {
			console.error(error);
		}

	},
};