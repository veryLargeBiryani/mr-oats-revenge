const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	mode: 'production',
	entry: {
		main: path.resolve(__dirname, 'client/index.js')
	},
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'client/dist'),
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: 'client/index.html'
		})
	]
}
