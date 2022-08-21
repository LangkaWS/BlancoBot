const databaseHelper = require('../helper/database');
const languageHelper = require('../helper/language');
const messageHelper = require('../helper/message');

const { Birthday, Main } = require('../language/fr.json');

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
 * Check if the guild has configured the birthday feature.
 * @param {CommandInteraction} interaction
 * @returns `true` if birthday feature is setup on the guild, `false` otherwise
 */
const checkSetup = async (interaction) => {

	try {

		const guild = interaction.guild;

		// Check if birthday feature has been configured
		const currentSetup = await databaseHelper.getBirthdayConfiguration(guild.id);
		return Boolean(currentSetup);

	} catch (error) {

		console.log(error);

	}

};

/**
 * Configure birthday feature on the guild.
 * @param {CommandInteraction} interaction
 */
const configure = async (interaction) => {

	try {

		const guildId = interaction.guildId;

		// Get current configuration
		const currentConf = await databaseHelper.getBirthdayConfiguration(guildId);
		const isCurrentConf = Boolean(currentConf);

		// Ask user if he wants to create or edit current configuration
		const messageAskEditConf = isCurrentConf
			?	languageHelper.interpolate(Birthday.AskEditConfiguration, {
				channel: currentConf.channelId,
				message: currentConf.message,
			})
			: Birthday.NoSetup;

		const embedOptionsAskEditConf = {
			type: 'BIRTHDAY',
			message: messageAskEditConf,
		};

		const buttonsOptionsAskEditConfOptions = messageHelper.createYesNoButtonsOptions();

		const replyAskEditConf = await messageHelper.createReply(interaction, embedOptionsAskEditConf, buttonsOptionsAskEditConfOptions, true);

		// If no, cancel
		if (replyAskEditConf.customId !== 'yes') {

			const embedOptionsCancel = {
				type: 'BIRTHDAY',
				message: Main.CancelConfig,
			};

			messageHelper.createReply(interaction, embedOptionsCancel, null);
			return;

		}

		// Ask message
		const modalOptionsAskEditMessage = {
			id: 'modal',
			title: Birthday.AskMessageTitle,
			textInputsOptions: [],
		};

		modalOptionsAskEditMessage.textInputsOptions.push({
			id: 'message',
			label: Birthday.AskMessageLabel,
			placeholder: Birthday.AskMessagePlaceholder,
		});

		// Disable buttons from previous interaction
		buttonsOptionsAskEditConfOptions.forEach(button => button.disabled = true);

		const replyAskMessage = await messageHelper.createModalReply(interaction, embedOptionsAskEditConf, buttonsOptionsAskEditConfOptions, replyAskEditConf, modalOptionsAskEditMessage);

		const replyAskMessageValue = replyAskMessage.fields.getTextInputValue('message');

		if (!replyAskMessageValue) {
			const embedOptionsCancel = {
				type: 'BIRTHDAY',
				message: Main.CancelConfig,
			};

			messageHelper.createReply(interaction, embedOptionsCancel, null);
			return;
		}

		if (isCurrentConf) {

			await databaseHelper.updateBirthdayConfiguration(guildId, interaction.channelId, replyAskMessageValue);

		} else {

			await databaseHelper.insertBirthdayConfiguration(guildId, interaction.channelId, replyAskMessageValue);

		}

		const embedSuccessOptions = {
			type: 'BIRTHDAY',
			message: Birthday.ConfigConfirm,
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
 * Remove the member's birthday.
 * @param {CommandInteraction} interaction
 */
const removeBirthday = async (interaction) => {

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

		// Get member birthday
		const memberId = interaction.member.id;
		const memberBirthday = await databaseHelper.getMemberBirthday(guild.id, memberId);

		if (!memberBirthday) {

			const embedNoBirthdayFoundOptions = {
				type: 'BIRTHDAY',
				message: Birthday.NoBirthdayFound,
			};

			messageHelper.createReply(interaction, embedNoBirthdayFoundOptions, null);
			return;

		}

		await databaseHelper.deleteBirthday(guild.id, memberId);

		const embedSuccessOptions = {
			type: 'BIRTHDAY',
			message: Birthday.RemoveConfirm,
		};

		messageHelper.createReply(interaction, embedSuccessOptions, null);

	} catch (error) {

		console.log(error);

	}

};

/**
 * Remove the birthday feature configuration from the guild.
 * @param {CommandInteraction} interaction
 */
const removeConfiguration = async (interaction) => {

	try {

		const guildId = interaction.guildId;

		// Get current configuration
		const currentConf = await databaseHelper.getBirthdayConfiguration(guildId);
		const isCurrentConf = Boolean(currentConf);

		if (!isCurrentConf) {

			const embedNoSetupOptions = {
				type: 'BIRTHDAY',
				message: Birthday.NoSetupToRemove,
			};

			messageHelper.createReply(interaction, embedNoSetupOptions, null);
			return;

		}

		const embedOptionsAskRemoveConf = {
			type: 'BIRTHDAY',
			message: Birthday.AskRemoveConfiguration,
		};

		const buttonsOptionsAskRemoveConfOptions = messageHelper.createYesNoButtonsOptions();

		const replyAskRemoveConf = await messageHelper.createReply(interaction, embedOptionsAskRemoveConf, buttonsOptionsAskRemoveConfOptions, true);

		// If no, cancel
		if (replyAskRemoveConf.customId !== 'yes') {

			const embedOptionsCancel = {
				type: 'BIRTHDAY',
				message: Main.CancelConfig,
			};

			messageHelper.createReply(interaction, embedOptionsCancel, null);
			return;

		}

		await databaseHelper.deleteBirthdayConfiguration(guildId);

		const embedRemoveConfigConfirmOptions = {
			type: 'BIRTHDAY',
			message: Birthday.RemoveConfigurationConfirm,
		};

		messageHelper.createReply(interaction, embedRemoveConfigConfirmOptions, null);

	} catch (error) {
		console.log(error);
	}

};

module.exports = {
	configure,
	manageBirthday,
	removeBirthday,
	removeConfiguration,
};