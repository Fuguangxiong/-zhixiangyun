/**
 * Created by dell on 2017/10/25.
 */
import userService from './userService'
import HttpService from './ApiClient'
import publicPath from './publicPathConfig'
export default {
  userInfoToCookie (tokenId, callback) {
    var that = this
    userService.storeInfo('tokenId', tokenId)
    HttpService.get('/pubapi/token/getUserByToken', {}, function (data) {
      var userInfoPhone = data.results.userInfo.PHONE
      var userInfoName = data.results.userInfo.USERNAME
      var userInfoId = data.results.userInfo.ID
      var userInfoImg = ''
      var userInfoIdentity = data.results.userInfo.ENTERPRISE_NAME
      if (data.results.userInfo.IMAGE != '' && data.results.userInfo.IMAGE != undefined) {
        // userInfoImg = publicPath.PLATFORM_USER + data.results.userInfo.IMAGE
        userInfoImg = HttpService.apiBaseUrl + '/pcapi/enterprise/pcShowImage/avatar?imgPath=' + data.results.userInfo.IMAGE + '&token=' + tokenId
      }
      if (data.results.userInfo.USERNAME != '' && data.results.userInfo.USERNAME != undefined) {
        userService.storeInfo('username', userInfoName)
      } else {
        userService.storeInfo('username', userInfoPhone)
      }
      if (data.results.userInfo.LOGIN_TYPE !== 'PERSONAL') {
        userService.storeInfo('identity', userInfoIdentity)
      } else {
        userService.storeInfo('identity', '个人')
      }
      userService.storeInfo('loginId', userInfoId)
      userService.storeInfo('phone', userInfoPhone)
      userService.storeInfo('image', userInfoImg)
      userService.storeInfo('state', data.results.userInfo.AUTH_STATUS)
      userService.storeInfo('logintype', data.results.userInfo.LOGIN_TYPE)
      sessionStorage.setItem('enterpriseId', data.results.userInfo.ENTERPRISE_ID)
      callback(userInfoName, userInfoImg, data.results.userInfo)
    })
  },
  getUserInfo (callback) {
    var that = this
    HttpService.get('/pubapi/token/getUserByToken', {}, function (data) {
      callback(data.results.userInfo)
    })
  }
}