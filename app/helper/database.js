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
 * @param  {Array<string|number|boolean>} values values to insert/update/delete
 * @returns selected rows
 */
const executeQuery = async (query, values) => {
	let con = null;

	try {

		con = await getConnection();
		const [records] = await con.execute(query, values);
		return records;

	} catch (error) {
		throw SQLException(error);
	} finally {
		con.end;
	}

};

/**
 * Insert data into database.
 * @param {string} tableName the name of the table in which to insert
 * @param {Array<{ fieldName: string, value: string|number }>} fields the fields to insert
 */
const insert = async (tableName, fields) => {

	try {

		const preparedFields = prepareFields(fields);

		const query = `
			INSERT INTO
				${tableName}
			SET
				${preparedFields.names}
		`;

		await executeQuery(query, preparedFields.values);

	} catch (error) {
		throw SQLException(error);
	}

};

/**
 * Delete data from database.
 * @param {string} tableName the name of the table in which to delete
 * @param {Array<{ fieldName: string, value: string|number }>} filters the filter to use to filter data to delete
 */
const remove = async (tableName, filters) => {

	try {

		const preparedFilters = prepareFilters(filters);

		const query = `
			DELETE FROM
				${tableName}
			WHERE
				${preparedFilters.names}
		`;

		await executeQuery(query, preparedFilters.values);

	} catch (error) {
		throw SQLException(error);
	}

};

/**
 * Update data in the database.
 * @param {string} tableName the name of the table in which to update
 * @param {Array<{ fieldName: string, value: string|number|boolean }>} fields the fields to update and their value
 * @param {Array<{ fieldName: string, value: string|number }>} filters the filter to use to filter data to update
 */
const update = async (tableName, fields, filters) => {

	try {

		const preparedFields = prepareFields(fields);
		const preparedFilters = prepareFilters(filters);

		const query = `
			UPDATE
				${tableName}
			SET
				${preparedFields.names}
			WHERE
				${preparedFilters.names}
		`;

		await executeQuery(query, [...preparedFields.values, ...preparedFilters.values]);

	} catch (error) {
		throw SQLException(error);
	}

};

/**
 * Select records from database.
 * @param {string} tableName the name of the table to select from
 * @param {Array<{ fieldName: string, value: string|number }>} filters the filter to use to filter data to update
 * @param {string} fields (optional) the fields to select
 * @returns the records
 */
const select = async (tableName, filters, fields = []) => {

	try {

		const fieldsNames = fields?.length ? fields : '*';
		const preparedFilters = prepareFilters(filters);

		const query = `
			SELECT
				${fieldsNames}
			FROM
				${tableName}
			WHERE
				${preparedFilters.names}
		`;

		const records = await executeQuery(query, preparedFilters.values);
		return records.length > 1 ? records : records[0];

	} catch (error) {
		throw SQLException(error);
	}

};

const customSelect = async (query, values) => {

	try {

		const records = await executeQuery(query, values);
		return records.length > 1 ? records : records[0];

	} catch (error) {
		throw SQLException(error);
	}

};

/**
 * Format the fields to be usable in query.
 * @param {Array<{ fieldName: string, value: string|number }>} fields
 * @returns {{ names: Array<string>, values: Array<string|number|null> }} an object with fields names and fields values
 */
const prepareFields = (fields) => {

	const result = {
		names: '',
		values: null,
	};

	const fieldsNames = fields.map(field => `${field.fieldName} = ?`);
	const fieldsNamesStr = fieldsNames.join(', ');
	result.names = fieldsNamesStr;

	if (fields[0].value !== undefined) {
		const fieldsValues = fields.map(field => field.value);
		result.values = fieldsValues;
	}

	return result;

};

/**
 * Format the filters to be usable in query.
 * @param {Array<{ fieldName: string, value: string|number }>} filters
 * @returns {{ names: Array<string>, values: Array<string|number> }} an object with filters names and filters values
 */
const prepareFilters = (filters) => {

	const filtersNames = filters.map(filter => `${filter.fieldName} = ?`);
	const filtersNamesStr = filtersNames.join(' AND ');
	const filtersValues = filters.map(filter => filter.value);

	return { names: filtersNamesStr, values: filtersValues };

};

module.exports = {
	insert,
	select,
	customSelect,
	update,
	remove,
};