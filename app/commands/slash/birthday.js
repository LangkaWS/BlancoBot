const { SlashCommandBuilder } = require('discord.js');

const { Birthday, Main } = require('../../language/fr.json');

const data = new SlashCommandBuilder()
	.setName(Birthday.CommandName)
	.setDescription(Birthday.CommandDescription)
	.setDMPermission(false)
	.setDefaultMemberPermissions(null)
	.addSubcommandGroup(groupConfigure =>
		groupConfigure
			.setName(Main.ConfigurationCommandName)
			.setDescription(Main.ConfigurationCommandName)
			.addSubcommand(subcommandAddConf =>
				subcommandAddConf
					.setName(Main.AddCommandName)
					.setDescription(Birthday.ConfigureCommandDescription))
			.addSubcommand(subcommandRemoveConf =>
				subcommandRemoveConf
					.setName(Main.RemoveCommandName)
					.setDescription(Birthday.RemoveConfigurationCommandDescription)))
	.addSubcommand(subcommandAddBirthday =>
		subcommandAddBirthday
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
	.addSubcommand(subcommandRemoveBirthday =>
		subcommandRemoveBirthday
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
		case Main.AddCommandName:
			await birthdayLibrary.configure(interaction);
			break;
		case Main.RemoveCommandName:
			await birthdayLibrary.removeConfiguration(interaction);
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