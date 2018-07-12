
/**
 * Created by dell on 2017/8/28.
 */

var port = '8080'
var serverUrl = '0.0.0.0'

if (process.env.npm_config_argv) {
  var argv = require('minimist')(JSON.parse(process.env.npm_config_argv).original)
  if (argv) {
    port = argv.appport || port
    serverUrl = argv.appaddress || serverUrl
    console.log('::start server: %s:%d', serverUrl, port)
  }
}

module.exports = {
  NODE_ENV: '"development"',
  SERVER_URI: serverUrl,
  PORT: port,
  PLATFORM_LOGIN_URL: './register.html',
  // API_SERVER:'http://192.168.38.120:8089/platform/priviapi/',
  // API_SERVER:'http://192.168.38.139:8089/platform/priviapi/',
  // API_SERVER:'http://192.168.38.127:8089/platform/priviapi/',
  // API_SERVER:'http://192.168.38.222:8089/platform/priviapi/',
  API_SERVER: 'http://192.168.182.142:9001/platform/priviapi/',
  // API_SERVER:'http://192.168.38.178:8082/iscloud-platforms-mains/'
  // API_SERVER:'http://192.168.38.170:8081/iscloud-platforms-mains/',
  // API_SERVER:'http://192.168.38.153:8089/platform/priviapi/',
  // SERVICE_MANAGE :'http://192.168.182.142:7002/xtgaj/serviceMa',    //服务管理
  PLATFORM_USER: 'http://192.168.182.142:9001/platform/priviapi/', // 权限用户图片路径
  APP_MARKET: 'http://192.168.38.72:8080/', // 应用市场
  PLATFORM_AUTHORITY: 'http://192.168.182.142:9001/platform/departManage.html', // 部门管理，跳转时需要加tokenId
  RESOURCE_CATALOG: '',
  EXTERNAL_CONFIG_URL: './envConfig/devConfig.json'
}
