const path = require('path');

module.exports = {
	mode: 'production',
	entry: {
		main: path.resolve(__dirname, 'client/index.js')
	},
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'dist'),
	},
}
