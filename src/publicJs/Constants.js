$.ajaxSettings.async = false
let apiBaseUrl = ''
let socketServer = ''
let platformLoginUrl = ''
let internalLoginUrl = ''
let appMarket = ''
let msgSocketServer = ''
$.getJSON(process.envConfig.EXTERNAL_CONFIG_URL, function (data) {
  apiBaseUrl = data.API_SERVER
  socketServer = apiBaseUrl + '/socket'
  platformLoginUrl = data.PLATFORM_LOGIN_URL
  internalLoginUrl = data.INTERNAL_OPERATION
  appMarket = data.APP_MARKET
  msgSocketServer = data.MESSAGE_SOCKET
  $.ajaxSettings.async = true
})

export default {
  apiBaseUrl: apiBaseUrl,
  socketServer: socketServer,
  platformLoginUrl: platformLoginUrl,
  internalLoginUrl: internalLoginUrl,
  appMarket: appMarket,
  msgSocketServer: msgSocketServer
}

