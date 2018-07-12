var path = require('path')
var glob = require('glob')
var CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin')
var CleanWebpackPlugin = require('clean-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var htmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
var entryConfig = require('./buid/entryFileConfig')
var pluginsConfig = require('./buid/pluginsConfig')
var appName = require('./config/envConfig').APPNAME
const fileName = {
  appMarket: 'mall',
  personalConsole: 'pc',
  internalOperation: 'pm',
  enterpriseOperation: 'em',
  openPlatform: 'op'
}
module.exports = {
  entry: entryConfig.entryFile,
  output: {
    path: path.join(__dirname, './dist/' + fileName[appName]),
    filename: 'assets/[name].[chunkhash].js',
    chunkFilename: '[id].chunk.js',
    publicPath: './'
  },
  node: {
    fs: 'empty'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {loaders: {
          css: ExtractTextPlugin.extract({
            use: 'css-loader',
            fallback: 'vue-style-loader'
          })
        }}
      },
      {
        test: /\.js$/,
        loader: 'babel-loader'
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader'
        })
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
              name: 'assets/[name].[hash].[ext]'
            }
          }
        ]
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)(\?\S*)?$/,
        loader: 'file-loader?name=assets/[name].[hash].[ext]'
      }
    ]
  },
  resolve: {
    alias: { 'vue': 'vue/dist/vue.js', '@': path.resolve(__dirname, './src') },
    extensions: ['.js', '.vue', '.json']
  },
  plugins: pluginsConfig.productPlugins
}
