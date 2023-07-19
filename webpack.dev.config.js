const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	mode: 'development',
	entry: {
		main: path.resolve(__dirname, 'client/index.js')
	},
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'client/dist'),
	},
	devtool: 'inline-source-map',
	devServer: {
		static: {
			directory: path.resolve(__dirname, 'client/dist'),
		},
		port: 3000,
		host: 'localhost',
		hot: true,
		open: true,
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: 'client/index.html'
		})
	]
}
