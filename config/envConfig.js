/**
 * Created by dell on 2017/8/28.
 */
var configEnv = process.env.NODE_ENV === 'production' ? require('./prodConfig') : require('./devConfig')

// var appName = 'appMarket'         // mall
var appName = 'personalConsole'      //pc
// var appName = 'internalOperation' // pm
// var appName = 'enterpriseOperation' //em
// var appName = 'openPlatform'         // op

var apiServer = configEnv.API_SERVER
var platformLoginUrl = configEnv.PLATFORM_LOGIN_URL
// publicPathConfig 需要的参数
var serviceManage = configEnv.SERVICE_MANAGE
var appMarket = configEnv.APP_MARKET
var platformAuthority = configEnv.PLATFORM_AUTHORITY
var resourceCatalog = configEnv.RESOURCE_CATALOG
var platformUser = configEnv.PLATFORM_USER
var platform = configEnv.PLATFORM
var multiplePages = false
var configFile = configEnv.EXTERNAL_CONFIG_URL
var openplatform = configEnv.OPENPLATFORM
var opApiPath = configEnv.OPEN_PLATFORM_API_PAHT

getArgv()

console.info('multiplepages type: %s', multiplePages)
console.info('::config module name: %s', appName)
console.info('::config api server  : %s', apiServer)
console.info('::config platformLoginUrl : %s', platformLoginUrl)
console.info('::config appMarket  : %s ', appMarket)
console.info('::config resourceCatalog  : %s', resourceCatalog)

module.exports = {
  NODE_ENV: configEnv.NODE_ENV,
  API_SERVER: apiServer,
  PLATFORM_LOGIN_URL: platformLoginUrl,
  ENTRY_FILE: './src/' + appName + '/entry/main.js',
  HTML_TEMPLE: 'src/' + appName + '/index.html',
  MULTIPLE_PAGES: multiplePages,
  APPNAME: appName,
  PLATFORM_USER: platformUser,
  PLATFORM: platform,

  SERVICE_MANAGE: serviceManage,       // 服务管理
  APP_MARKET: appMarket, // 应用市场
  PLATFORM_AUTHORITY: platformAuthority, // 部门管理，跳转时需要加tokenId
  RESOURCE_CATALOG: resourceCatalog, // 资源目录
  EXTERNAL_CONFIG_URL: configFile,
  OPEN_PLATFORM_API_PAHT: opApiPath,
  OPENPLATFORM: openplatform

}

function getArgv () {
  if (!process.env.npm_config_argv) {
    return
  }
  let npmArgs = require('minimist')(JSON.parse(process.env.npm_config_argv).original)
  apiServer = npmArgs['apiserver'] || apiServer
  appMarket = npmArgs['appmarket'] || appMarket
  configFile = npmArgs['configFile'] ? './envConfig/' + npmArgs['configFile'] : configFile
  resourceCatalog = npmArgs['resourcecatalog'] || resourceCatalog
  appName = npmArgs['app'] || appName
  platformLoginUrl = npmArgs['platformLoginUrl'] || platformLoginUrl
  multiplePages = npmArgs['multiplepages'] != null ? npmArgs['multiplepages'] === 'true' : multiplePages
}
