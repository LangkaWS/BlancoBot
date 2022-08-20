const databaseHelper = require('../helper/database');
const languageHelper = require('../helper/language');
const messageHelper = require('../helper/message');

const { Birthday, Main } = require('../language/fr.json');

/**
 * Add or edit the member birthday.
 * @param {CommandInteraction} interaction
 */
const addBirthday = async (interaction) => {

	try {

		const guild = interaction.guild;

		// Check if birthday feature has been configured
		const currentSetup = await databaseHelper.getBirthdayConf(guild.id);
		const isCurrentSetup = Boolean(currentSetup);

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
		const memberBirthday = await databaseHelper.getMemberBirthday(memberId, guild.id);

		// If birthday exists, ask modification else add birthday
		if (memberBirthday) {

			editBirthday(interaction, memberBirthday);

		} else {

			const day = interaction.options.getInteger(Birthday.DayOptionName);
			const month = interaction.options.getInteger(Birthday.MonthOptionName);

			await databaseHelper.insertBirthday(guild.id, memberId, day, month);

			const embedSuccessOptions = {
				type: 'BIRTHDAY',
				message: Birthday.AddConfirm,
			};

			messageHelper.createReply(interaction, embedSuccessOptions, null);
			return;

		}

	} catch (error) {
		console.log(error);
	}

};

/**
 * Edit the member birthday.
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
			return;

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
	addBirthday,
};