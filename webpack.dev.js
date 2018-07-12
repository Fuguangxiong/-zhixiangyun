var path = require("path");
var glob = require('glob');
var CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var htmlWebpackPlugin = require('html-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');
var entryConfig =require('./buid/entryFileConfig');
var pluginsConfig=require('./buid/pluginsConfig');
var config=require('./config/devConfig')
module.exports = {
    entry:entryConfig.entryFile,
    output: {
        path: path.join(__dirname, "./dist"),
        filename: "[name].bundle.js",
        chunkFilename: "[id].chunk.js",
    },
    devServer: {
        port: config.PORT,
        host: config.SERVER_URI,
        contentBase: './dist',
        historyApiFallback: true,
        /*hot: true,
        inline: true*/
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    extractCSS: true
                }
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader"
                })
            },
            {
                test:/\.(png|svg|jpg|gif)$/,
                use:[
                    'file-loader'
                ]
            },
            {
                test: /\.(eot|ttf|woff|woff2)(\?\S*)?$/,
                loader: 'file-loader'
            },
        ]
    },
    resolve: {
        alias: { 'vue': 'vue/dist/vue.js', '@': path.resolve(__dirname, './src')},
        extensions: ['.js', '.vue', '.json']
    },
    plugins:pluginsConfig.devolpPlugins
}
