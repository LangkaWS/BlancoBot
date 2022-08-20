/**
 * Create and get the connection with database.
 * @returns database connection
 */
const getConnection = async () => {

	const mysql = require('mysql2/promise');

	return await mysql.createConnection({
		host: process.env.DB_HOST,
		port: process.env.DB_PORT,
		user: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_NAME,
	});

};

/**
 * Execute a query with the given options.
 * @param {string} query
 * @param  {...any} args options
 * @returns selected rows
 */
const executeQuery = async (query, ...args) => {
	let con = null;

	try {

		con = await getConnection();
		const [records] = await con.execute(query, [...args]);
		return records;

	} catch (error) {
		console.error(error);
	} finally {
		con.end;
	}
};

/**
 * Insert the member's birthday in database.
 * @param {number} guildId the ID of the member's guild
 * @param {number} memberId the ID of the member
 * @param {number} day the birthday day
 * @param {number} month the birthday month
 */
const insertBirthday = async (guildId, memberId, day, month) => {

	const query = `
		INSERT INTO
			birthday
		SET
			guild_id = ?,
			member_id = ?,
			day = ?,
			month = ?
	`;

	await executeQuery(query, guildId, memberId, day, month);

};

/**
 * Update the member's birthday in database.
 * @param {number} guildId the ID of the member's guild
 * @param {number} memberId the ID of the member
 * @param {number} day the birthday day
 * @param {number} month the birthday month
 */
const updateBirthday = async (guildId, memberId, day, month) => {

	const query = `
		UPDATE
			birthday
		SET
			day = ?,
			month = ?
		WHERE member_id = ? and guild_id = ?
	`;

	await executeQuery(query, day, month, memberId, guildId);

};

/**
 * Get birthday configuration in database.
 * @param {number} guildId the ID of the guild the configuration belongs to
 * @returns the birthday configuration
 */
const getBirthdayConf = async (guildId) => {

	const query = `
		SELECT
			guild_id AS guildId,
			channel_id AS channelId,
			message,
			enabled
		FROM
			conf_birthdays
		WHERE
			guild_id = ?
	`;

	return await executeQuery(query, guildId);

};

/**
 * Get the birthday (month and day) of a member
 * @param {GuildMember} memberId the ID of the member
 * @returns the month and day of the member birthday
 */
const getMemberBirthday = async (memberId, guildId) => {

	const query = `
		SELECT
			month,
			day
		FROM
			birthday
		WHERE
			member_id = ?
			AND guild_id = ?
	`;

	const [record] = await executeQuery(query, memberId, guildId);
	return record;

};

module.exports = {
	insertBirthday,
	getBirthdayConf,
	getMemberBirthday,
	updateBirthday,
};