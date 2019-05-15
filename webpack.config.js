const path = require('path');

module.exports = {
	mode: 'production',
	entry: [
		path.resolve(__dirname, 'src/public/index.ts')
	],
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'dist/public/js')
	},
	module: {
		rules: [{
			test: /\.ts|\.tsx$/,
			use: ['ts-loader']
		}, {
			test: /\.js$/,
			use: ["source-map-loader"],
			enforce: "pre"
		}, {
			test: /\.scss/,
			use: [
				'style-loader',
				'css-loader',
				'sass-loader'
			],
		},
		{
			test: /\.(jpg|png|svg|gif)$/,
			loaders: 'url-loader'
		},
		]
	},
	resolve: {
		extensions: ['.ts', '.js', '.scss','.svg'],
	},
	devtool: 'source-map',
};
