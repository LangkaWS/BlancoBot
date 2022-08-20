/**
 * Replace placeholders in text with values.
 * @param {string} text text to use
 * @param {*} values values to interpolate
 * @returns the text with placeholders replaced with values
 */
const interpolate = (text, values) => {
	let result = text;
	for (const genericValue in values) {
		const regexp = new RegExp(`\\[${genericValue}\\]`, 'g');
		result = result.replace(regexp, values[genericValue]);
	}
	return result;
};

module.exports = {
	interpolate,
};