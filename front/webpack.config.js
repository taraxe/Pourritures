const webpack = require('webpack');
const path = require('path');
const autoprefixer = require('autoprefixer');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const OpenBrowserPlugin = require('open-browser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const fs = require('fs');


const nodeEnv = process.env.NODE_ENV || 'development';
const isProd = nodeEnv === 'production';

module.exports = {
	devtool: isProd ? 'hidden-source-map' : 'cheap-eval-source-map',
	entry : [
    	'whatwg-fetch',
        path.resolve(__dirname, 'app/index.js'),
        path.resolve(__dirname, 'app/scss/main.scss')
    ],
    resolve : {
        //root: path.resolve(__dirname, 'app'),
        modules: [path.resolve(__dirname, 'app'), 'node_modules'],
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, './dist'),
    },
    devServer: {
        contentBase: './app',
        //outputPath: path.join(__dirname, 'dist'),
        //hot: true,
        port: 3000,
    },
	module : {
		loaders : [
			{
				test: /\.css$/,
				loaders: [
					'style',
					'css'
				]
			},
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
                include: path.resolve(__dirname, 'app'),
				loaders: [
					// 'react-hot',
					'babel-loader'
				]
			},
            {
                test: /\.json$/,
                loaders: ['json-loader'],
                include: path.resolve(__dirname, 'app'),
            },
            {
                test: /\.scss$/,
                loader: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader'],
            }
		]
	},
    postcss: [ autoprefixer({ browsers: ['last 2 versions'] }) ],

	plugins : [
        new HtmlWebpackPlugin({
            template: __dirname + '/app/index.html',
            filename: 'index.html',
            inject: 'body',
            config: fs.readFileSync('app/config/static.js'),
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: true,
            debug: false
        }),
        /*new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            },
            output: {
                comments: false
            },
            sourceMap: false
        }),*/
        new webpack.DefinePlugin({
            'process.env': { NODE_ENV: JSON.stringify(nodeEnv) }
        }),
        new CopyWebpackPlugin([
            { from: './app/images', to: './images' },
            //{ from: './app/css', to: './css' },
        ]),
        new OpenBrowserPlugin({ url: 'http://localhost:3000' })
    ]
};
