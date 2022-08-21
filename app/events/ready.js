const birthdayLibrary = require('../library/birthday');

module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		console.log((new Date()).toLocaleString());
		console.log('Blanco is ready to work!');

		birthdayLibrary.checkBirthdays(client);
	},
};