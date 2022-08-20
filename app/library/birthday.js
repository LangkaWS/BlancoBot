const databaseHelper = require('../helper/database');
const languageHelper = require('../helper/language');
const messageHelper = require('../helper/message');

const { Birthday, Main } = require('../language/fr.json');

/**
 * Check if the guild has configured the birthday feature.
 * @param {CommandInteraction} interaction
 * @returns `true` if birthday feature is setup on the guild, `false` otherwise
 */
const checkSetup = async (interaction) => {

	try {

		const guild = interaction.guild;

		// Check if birthday feature has been configured
		const currentSetup = await databaseHelper.getBirthdayConf(guild.id);
		return Boolean(currentSetup);

	} catch (error) {

		console.log(error);

	}

};

/**
 * Add or edit the member's birthday.
 * @param {CommandInteraction} interaction
 */
const manageBirthday = async (interaction) => {

	try {

		const guild = interaction.guild;

		// Check if birthday feature has been configured
		const isCurrentSetup = await checkSetup(interaction);

		if (!isCurrentSetup) {
			const embedNoSetupOptions = {
				type: 'BIRTHDAY',
				message: Main.NoSetup,
			};

			messageHelper.createReply(interaction, embedNoSetupOptions, null);
			return;
		}

		// Get member birthday if already exists
		const memberId = interaction.member.id;
		const memberBirthday = await databaseHelper.getMemberBirthday(guild.id, memberId);

		// If birthday exists, ask modification else add birthday
		if (memberBirthday) {

			editBirthday(interaction, memberBirthday);

		} else {

			addBirthday(interaction);

		}

	} catch (error) {
		console.log(error);
	}

};

/**
 * Add the member's birthday.
 * @param {CommandInteraction} interaction
 */
const addBirthday = async (interaction) => {

	try {

		const day = interaction.options.getInteger(Birthday.DayOptionName);
		const month = interaction.options.getInteger(Birthday.MonthOptionName);

		await databaseHelper.insertBirthday(interaction.guild.id, interaction.member.id, day, month);

		const embedSuccessOptions = {
			type: 'BIRTHDAY',
			message: Birthday.AddConfirm,
		};

		messageHelper.createReply(interaction, embedSuccessOptions, null);

	} catch (error) {

		console.log(error);

	}

};

/**
 * Edit the member's birthday.
 * @param {CommandInteraction} interaction
 * @param {{ day: number, month: number }} memberBirthday the day and month of member's birthday
 */
const editBirthday = async (interaction, memberBirthday) => {

	try {

		const birthdayDate = new Date(2022, memberBirthday.month - 1, memberBirthday.day);

		const registeredMonth = birthdayDate.toLocaleString('fr-FR', { month: 'long' });
		const date = `${memberBirthday.day} ${registeredMonth}`;

		const embedBirthdayAlreadyExistOptions = {
			type: 'BIRTHDAY',
			message: languageHelper.interpolate(Birthday.AlreadyRegistered, { 'date': date }),
		};

		const buttonsEditBirthdayOptions = messageHelper.createYesNoButtonsOptions();

		const askEditBirthdayReply = await messageHelper.createReply(interaction, embedBirthdayAlreadyExistOptions, buttonsEditBirthdayOptions, true);

		if (askEditBirthdayReply.customId === 'yes') {

			const day = interaction.options.getInteger(Birthday.DayOptionName);
			const month = interaction.options.getInteger(Birthday.MonthOptionName);

			await databaseHelper.updateBirthday(askEditBirthdayReply.guild.id, askEditBirthdayReply.member.id, day, month);

			const embedSuccessOptions = {
				type: 'BIRTHDAY',
				message: Birthday.EditConfirm,
			};

			messageHelper.createReply(interaction, embedSuccessOptions, null);

		} else {

			const embedCancelOptions = {
				type: 'BIRTHDAY',
				message: Main.CancelConfig,
			};

			messageHelper.createReply(interaction, embedCancelOptions, null);

		}

	} catch (error) {

		console.log(error);

	}


};

module.exports = {
	manageBirthday,
};