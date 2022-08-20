const { SlashCommandBuilder } = require('discord.js');

const { Birthday, Main } = require('../../language/fr.json');

const data = new SlashCommandBuilder()
	.setName(Main.ConfigureCommandName)
	.setDescription(Main.ConfigureCommandDescription)
	.setDMPermission(false)
	.setDefaultMemberPermissions(null)
	.addSubcommand(subcommand =>
		subcommand
			.setName(Birthday.CommandName)
			.setDescription(Birthday.ConfigureCommandDescription));

/**
 * Execute the slash command.
 * @param {CommandInteraction} interaction
 */
const execute = async (interaction) => {
	const birthdayLibrary = require('../../library/birthday');
	const subcommand = interaction.options.getSubcommand();
	switch (subcommand) {
		case Birthday.CommandName:
			await birthdayLibrary.configure(interaction);
			break;
	}
};

module.exports = {
	data,
	execute,
};