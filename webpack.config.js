const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
var DashboardPlugin = require("webpack-dashboard/plugin");

module.exports = {
	entry: './src/index.js',
	mode: 'production',
	module: {
		rules: [{
			test: /\.scss$/,
			use: [
				MiniCssExtractPlugin.loader, // creates style nodes from JS strings
				{ loader: 'css-loader',
					options: { importLoaders: 1 }
				},// translates CSS into CommonJS
				"postcss-loader",
				"sass-loader" // compiles Sass to CSS, using Node Sass by default
			]
		}]
	},
};