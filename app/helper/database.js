/**
 * Create and get the connection with database.
 * @returns database connection
 */
const getConnection = async () => {

	try {

		const mysql = require('mysql2/promise');

		return await mysql.createConnection({
			host: process.env.DB_HOST,
			port: process.env.DB_PORT,
			user: process.env.DB_USER,
			password: process.env.DB_PASSWORD,
			database: process.env.DB_NAME,
		});

	} catch (error) {
		throw SQLException(error);
	}

};

/**
 * Create a new SQL exception.
 * @param {string} message the error message
 */
const SQLException = (message) => {
	this.name = 'SQLException';
	this.message = message;
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
		throw SQLException(error);
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

	try {

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

	} catch (error) {
		throw SQLException(error);
	}

};

/**
 * Insert a birthday configuration in databse.
 * @param {number} guildId the guild ID
 * @param {number} channelId the announcement channel ID
 * @param {string} message the announcement message
 */
const insertBirthdayConfiguration = async (guildId, channelId, message) => {

	try {

		const query = `
			INSERT INTO
				conf_birthday
			SET
				guild_id = ?,
				channel_id = ?,
				message = ?,
				enabled = 1
		`;

		await executeQuery(query, guildId, channelId, message);

	} catch (error) {
		throw SQLException(error);
	}

};

/**
 * Update the member's birthday in database.
 * @param {number} guildId the ID of the member's guild
 * @param {number} memberId the ID of the member
 * @param {number} day the birthday day
 * @param {number} month the birthday month
 */
const updateBirthday = async (guildId, memberId, day, month) => {

	try {

		const query = `
			UPDATE
				birthday
			SET
				day = ?,
				month = ?
			WHERE 
				guild_id = ?
				AND member_id = ? 
		`;

		await executeQuery(query, day, month, guildId, memberId);

	} catch (error) {
		throw SQLException(error);
	}

};

/**
 * Update birthday configuration in database.
 * @param {number} guildId the guild ID
 * @param {number} channelId the announcement channel ID
 * @param {string} message the announcement message
 */
const updateBirthdayConfiguration = async (guildId, channelId, message) => {

	try {

		const query = `
			UPDATE
				conf_birthday
			SET
				channel_id = ?,
				message = ?
			WHERE 
				guild_id = ?
		`;

		await executeQuery(query, channelId, message, guildId);

	} catch (error) {
		throw SQLException(error);
	}

};

/**
 * Delete the member's birthday from database.
 * @param {number} guildId the guild ID
 * @param {number} memberId the member ID
 */
const deleteBirthday = async (guildId, memberId) => {

	try {

		const query = `
			DELETE FROM
				birthday
			WHERE 
				guild_id = ?
				AND member_id = ? 
		`;

		await executeQuery(query, guildId, memberId);

	} catch (error) {
		throw SQLException(error);
	}


};

/**
 * Get birthday configuration in database.
 * @param {number} guildId the ID of the guild the configuration belongs to
 * @returns the birthday configuration
 */
const getBirthdayConfiguration = async (guildId) => {

	try {

		const query = `
			SELECT
				guild_id AS guildId,
				channel_id AS channelId,
				message,
				enabled
			FROM
				conf_birthday
			WHERE
				guild_id = ?
		`;

		const [record] = await executeQuery(query, guildId);
		return record;

	} catch (error) {
		throw SQLException(error);
	}

};

/**
 * Get the birthday (month and day) of a member
 * @param {number} memberId the ID of the member
 * @param {number} guildId the ID of the guild
 * @returns the month and day of the member birthday
 */
const getMemberBirthday = async (guildId, memberId) => {

	try {

		const query = `
			SELECT
				month,
				day
			FROM
				birthday
			WHERE
				guild_id = ?
				AND member_id = ?
		`;

		const [record] = await executeQuery(query, guildId, memberId);
		return record;

	} catch (error) {
		throw SQLException(error);
	}


};

module.exports = {
	insertBirthdayConfiguration,
	deleteBirthday,
	insertBirthday,
	getBirthdayConfiguration,
	getMemberBirthday,
	updateBirthday,
	updateBirthdayConfiguration,
};