module.exports = {
	name: 'ready',
	once: true,
	execute() {
		console.log((new Date()).toLocaleString());
		console.log('Blanco is ready to work!');
	},
};