const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, SelectMenuBuilder } = require('discord.js');

const { Admin, Birthday, Main } = require('../language/fr.json');

/**
 * Create a button component.
 * @param {{ id?: string, label?: string, style?: 'Primary'|'Secondary'|'Success'|'Danger'|'Link' }} options the options of the button component
 * @returns a button component
 */
const createButtonComponent = (options) => {

	return new ButtonBuilder()
		.setCustomId(options.id || null)
		.setLabel(options.label || null)
		.setStyle(options.style || null);

};

/**
 * Create an embed.
 * @param {{title: string, message: string, type: 'ADMIN'}} options the options of the embed
 * @returns an embed
 */
const createEmbed = (options) => {

	let color;
	let title;

	switch (options.type) {
		case 'BIRTHDAY':
			color = '#FF1279';
			title = Birthday.EmbedConfigurationTitle;
			break;
	}

	return new EmbedBuilder()
		.setColor(color)
		.setTitle(options.title || title)
		.setDescription(options.message);

};

/**
 * Create interaction reply options.
 * @param {{title: string, message: string, type: 'ADMIN'}} embedOptions the embed options
 * @param {{ type: 'BUTTON', id?: string, label?: string, style?: 'Primary'|'Secondary'|'Success'|'Danger'|'Link'}} componentsOptions the component options
 * @returns interaction reply options
 */
const createInteractionReplyOptions = (embedOptions, componentsOptions) => {

	const embeds = [];

	if (embedOptions) {
		embeds.push(createEmbed(embedOptions));
	}

	const rows = [];

	// Create components if needed
	if (componentsOptions) {
		const buttonComponents = [];

		componentsOptions.forEach(component => {
			switch (component.type) {
				case 'BUTTON':
					buttonComponents.push(createButtonComponent(component));
					break;
			}
		});

		if (buttonComponents.length) {
			rows.push(new ActionRowBuilder().addComponents(buttonComponents));
		}

	}

	return {
		ephemeral: true,
		embeds: embeds,
		components: rows,
		fetchReply: true,
	};

};

/**
 * Reply to an interaction and collect the user's reply interaction.
 * @param {CommandInteraction} interaction
 * @param {{ title: string, message: string, type: 'ADMIN'}} embedOptions the embed options
 * @param {{ type: 'BUTTON'|'SELECT_MENU', id?: string, label?: string, style?: 'Primary'|'Secondary'|'Success'|'Danger'|'Link', min?: number, max?: number, choicesList?: Array}} componentsOptions the component options
 * @param {boolean} needReply does the interaction needs a reply from user
 * @returns {Promise<MessageComponentInteraction>} the user's interaction reply
 */
const createReply = async (interaction, embedOptions, componentsOptions, needReply = false) => {

	try {

		const timeToReply = 30000;

		const replyOptions = createInteractionReplyOptions(embedOptions, componentsOptions);

		const reply = interaction.replied
			? await interaction.editReply(replyOptions)
			: await interaction.reply(replyOptions);

		if (needReply) {

			const userFilter = i => i.user.id === interaction.user.id;
			return reply.awaitMessageComponent({ userFilter, time: timeToReply });

		}

	} catch (error) {
		console.error(error);
	}

};

/**
 * Create yes/no buttons for message interaction.
 * @returns a button options
 */
const createYesNoButtonsOptions = () => {
	return [
		{
			type: 'BUTTON',
			id: 'yes',
			label: 'Oui',
			style: 'Success',
		},
		{
			type: 'BUTTON',
			id: 'no',
			label: 'Non',
			style: 'Danger',
		},
	];
};

module.exports = {
	createReply,
	createYesNoButtonsOptions,
};