const { SlashCommandBuilder } = require('discord.js');

const { Birthday, Main } = require('../../language/fr.json');

const data = new SlashCommandBuilder()
	.setName(Birthday.CommandName)
	.setDescription(Birthday.CommandDescription)
	.setDMPermission(false)
	.setDefaultMemberPermissions(null)
	.addSubcommand(subcommand =>
		subcommand
	.addSubcommand(subcommandAddConf =>
		subcommandAddConf
			.setName(Main.ConfigureCommandName)
			.setDescription(Birthday.ConfigureCommandDescription))
			.setName(Birthday.SubcommandAddName)
			.setDescription(Birthday.SubcommandAddDescription)
			.addIntegerOption(option =>
				option
					.setName(Birthday.DayOptionName)
					.setDescription(Birthday.DayOptionDescription)
					.setRequired(true)
					.setMinValue(1)
					.setMaxValue(31))
			.addIntegerOption(option =>
				option
					.setName(Birthday.MonthOptionName)
					.setDescription(Birthday.MonthOptionDescription)
					.setRequired(true)
					.setMinValue(1)
					.setMaxValue(12)))
	.addSubcommand(subcommand =>
		subcommand
			.setName(Birthday.SubcommandRemoveName)
			.setDescription(Birthday.SubcommandRemoveDescription));

/**
 * Execute the slash command.
 * @param {CommandInteraction} interaction
 */
const execute = async (interaction) => {
	const birthdayLibrary = require('../../library/birthday');
	const subcommand = interaction.options.getSubcommand();
	switch (subcommand) {
		case Main.ConfigureCommandName:
			await birthdayLibrary.configure(interaction);
			break;
		case Birthday.SubcommandAddName:
			await birthdayLibrary.manageBirthday(interaction);
			break;
		case Birthday.SubcommandRemoveName:
			await birthdayLibrary.removeBirthday(interaction);
			break;
	}
};

module.exports = {
	data,
	execute,
};