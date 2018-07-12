/**
 * Created by dell on 2017/9/12.
 */
const webpack = require('webpack')
var CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var htmlWebpackPlugin = require('html-webpack-plugin')
var CleanWebpackPlugin = require('clean-webpack-plugin')
var CopyWebpackPlugin = require('copy-webpack-plugin')
var config = require('../config/envConfig')
var configFile = config.ENTRY_FILE
var mp = config.MULTIPLE_PAGES
var path = require('path')
var glob = require('glob')
console.info('api=', config.API_SERVER)
let getConfig = function () {
  return JSON.stringify({
    API_SERVER: JSON.stringify(config.API_SERVER),
    PLATFORM_LOGIN_URL: JSON.stringify(config.PLATFORM_LOGIN_URL),
    EXTERNAL_CONFIG_URL: config.EXTERNAL_CONFIG_URL,
    APPNAME: config.APPNAME
  })
}
const fileName = {
  appMarket: 'mall',
  personalConsole: 'pc',
  platformAuthority: 'bc',
  resourceCatalog: 'rc',
  serviceManage: 'sc',
  internalOperation: 'pm',
  enterpriseOperation: 'em'
}

var devolpPlugins = function () {
  var plugins = [new webpack.DefinePlugin({'process.env.NODE_ENV': JSON.stringify('development')}),
    new webpack.optimize.CommonsChunkPlugin({name: 'vendor'}),
    new webpack.HotModuleReplacementPlugin(),
    new ExtractTextPlugin('[name].css'), new webpack.ProvidePlugin({ jQuery: 'jquery', $: 'jquery' }),
    new CopyWebpackPlugin([{from: './envConfig/devConfig.json', to: './envConfig/devConfig.json'}])]
  if (mp == true) {
    var entryPath = configFile.replace('./src/', '')
    entryPath = entryPath.slice(0, entryPath.indexOf('/'))
    var jsDir = path.resolve('./src/' + entryPath, 'entry')
    var entryFiles = glob.sync(jsDir + '/*.{js,jsx}')
    for (var i = 0; i < entryFiles.length; i++) {
      var filePath = entryFiles[i]
      var filename = filePath.substring(filePath.lastIndexOf('\/') + 1, filePath.lastIndexOf('.'))
      var fullFilename = filename + '.html'
      var publicCss = 'public'
      var tempFile = './src/' + entryPath + '/' + fullFilename
      var chunkArr = ['vendor', publicCss, filename]
      plugins.push(new htmlWebpackPlugin({filename: fullFilename, template: tempFile, chunks: chunkArr, chunksSortMode: 'manual'}))
    }
  } else {
    plugins.push(new htmlWebpackPlugin({template: config.HTML_TEMPLE}))
  }
  plugins.push(new webpack.DefinePlugin({'process.envConfig': getConfig()}))
  return plugins
}
var productPlugins = function () {
  var plugins = [new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify('production')
  }),
    new CleanWebpackPlugin(['dist/' + fileName[config.APPNAME]]),
    new CommonsChunkPlugin({
      name: 'vendor',
      minChunks: Infinity
    }),
    new ExtractTextPlugin('[name].[chunkhash].css'),
    new webpack.ProvidePlugin({ jQuery: 'jquery', $: 'jquery' }),
    new webpack.LoaderOptionsPlugin({minimize: true, debug: false}),
    new webpack.optimize.UglifyJsPlugin({compress: {warnings: false, drop_debugger: true, drop_console: true}}),

    new CopyWebpackPlugin([{from: config.EXTERNAL_CONFIG_URL, to: config.EXTERNAL_CONFIG_URL}])]
  if (mp == true) {
    var entryPath = configFile.replace('./src/', '')
    entryPath = entryPath.slice(0, entryPath.indexOf('/'))
    var jsDir = path.resolve('./src/' + entryPath, 'entry')
    var entryFiles = glob.sync(jsDir + '/*.{js,jsx}')
    for (var i = 0; i < entryFiles.length; i++) {
      var filePath = entryFiles[i]
      var filename = filePath.substring(filePath.lastIndexOf('\/') + 1, filePath.lastIndexOf('.'))
      var fullFilename = filename + '.html'
      var publicCss = 'public'
      var tempFile = './src/' + entryPath + '/' + fullFilename
      var chunkArr = ['vendor', publicCss, filename]
      plugins.push(new htmlWebpackPlugin({filename: fullFilename, template: tempFile, chunks: chunkArr, chunksSortMode: 'manual'}))
    }
  } else {
    plugins.push(new htmlWebpackPlugin({template: config.HTML_TEMPLE}))
  }
  plugins.push(new webpack.DefinePlugin({'process.envConfig': getConfig()}))
  return plugins
}
module.exports = {
  devolpPlugins: devolpPlugins(),
  productPlugins: productPlugins()
}

