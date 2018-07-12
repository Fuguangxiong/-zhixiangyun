<template>
  <div class="main-container">
    <div class="loginInputContainer admins">
      <div class="loginInputLine">
        <input v-model="telephone" class="loginInput textColor2" placeholder="用户名/手机号" @keyup.enter="loginEnter()"/>
      </div>
      <div class="loginInputLine">
        <input :type="showPwd" v-model="password" class="loginInput textColor2" placeholder="密码" @keyup.enter="loginClickHandler()" />
        <div class="eye show-icon" @click="changeType" :class="{active:showPassword}" :title="pwdTips"></div>
      </div>
      <div class="loginInputLine imgCheckFiled shortmsg" v-if="showImgCheck">
        <input type="imgCheck" v-model="imgCheck" class="loginInput textColor2 imgCheckFiled shortmsg" placeholder="图形验证码" @keyup.enter="loginClickHandler()" />
        <img class="imgCheck" title="看不清楚换一张" v-bind:src="imgCheckUrl" v-on:click="getImgCheck()" />
      </div>
      <div class="logdenlu">
        <span class="remenberPasswordContainer textColor2 " v-on:click="clickRemember" v-bind:class="{select:rememberPass}">
          <i class="logincheck"></i>记住密码
        </span>
        <a class="wpad textColor2 link" v-on:click="forgoPass" style="cursor: pointer;">忘记密码?</a>
      </div>
    </div>
    <div class="loginBtnContainer">
      <div class="publicBtn" v-on:click="loginClickHandler()">登录</div>
    </div>
  </div>
</template>
<script>
import HttpService from '../../publicJs/ApiClient'
import env from '../../../config/envConfig'
import TipBoxService from '../../publicJs/TipBoxService'
import user from '../../publicJs/userService'
import tool from '../publicJs/ToolService'
import path from '../../publicJs/publicPathConfig'
export default {
  data: function () {
    return {
      pwdTips: '显示密码',
      showPassword: false,
      showPwd: 'password',
      telephone: '',  // 登录用户名
      password: '',   // 密码
      errorTimes: 0,  // 登录错误次数
      imgCheck: '',   // 图片验证码
      imgCheckUrl: '',  // 图片验证码路径
      showImgCheck: false,  // 是否显示图片验证码
      rememberPass: false,   // 是否记住密码
      enterpriseData: ''
    }
  },
  mounted () {
    this.getLocalStorage()
    console.info('config=', path.APP_MARKET)
  },
  watch: {
    errorTimes: function () {
      if (this.errorTimes > 2) {
        this.showImgCheck = true
        this.getImgCheck()
      }
    }
  },
  methods: {
    changeType () {
      this.showPassword = !this.showPassword
      if (this.showPassword === true) {
        this.showPwd = 'text'
        this.pwdTips = '隐藏密码'
      } else {
        this.showPwd = 'password'
        this.pwdTips = '显示密码'
      }
    },
    // 查缓存中有无用户数据
    getLocalStorage: function () {
      var that = this
      var loginUsername = user.getInfo('loginUsername')
      var password = user.getInfo('loginPass')
      if (loginUsername) {
        that.telephone = loginUsername
        if (password) {
          that.rememberPass = true
          that.password = that.uncompile(password)
        }
      }
    },
    // 点击进入
    loginClickHandler: function () {
      var that = this
      // localStorage.username = that.telephone
      // 点击进入将用户名存入cookie
      user.storeInfo('loginUsername', that.telephone)
      if (this.rememberPass) {
        // localStorage.password = that.password
        var pass = that.compile(that.password)
        that.setCookie('loginPass', pass)
      }
      if (that.telephone === '' || that.password === '') {
        TipBoxService.open('请输入用户名和密码', 2)
        return false
      } else {
        if (this.showImgCheck) {
          HttpService.post('priviapi/login/validImgCode', 'param=' + this.imgCheck, function (data) {
            if (data.data === true) {
              console.log('imgSuccess')
              that.goLogin()
            } else {
              that.getImgCheck()
              TipBoxService.open('图形验证码错误！', 2)
            }
          })
        } else {
          that.goLogin()
        }
      }
    },
    loginEnter () {
      let that = this
      if (that.password === '') {
        TipBoxService.open('请输入密码！', 2)
      } else {
        that.loginClickHandler()
      }
    },
    goLogin () {
      let that = this
      let param = {}
      var nameReg = /^[0-9]*$/
      if (that.telephone.length === 11 && nameReg.test(that.telephone) === true) {
        param = {
          phone: that.telephone,
          password: that.password
        }
      } else {
        param = {
          name: that.telephone,
          password: that.password
        }
      }
      HttpService.post('priviapi/login/queryEnterprises', param, function (data) {
        if (data.status == '200') {
          console.log(data)
          if (data.exception == null) {
            // 确认来源
            var source = tool.getQueryString('source')
            var href = path.APP_MARKET
            if (data.data.length === 0) {
              let newParam = {}
              if (that.telephone.length === 11 && nameReg.test(that.telephone) === true) {
                newParam = {
                  phone: that.telephone,
                  password: that.password,
                  enterpriseId: '',
                  enterpriseName: ''
                }
              } else {
                newParam = {
                  name: that.telephone,
                  password: that.password,
                  enterpriseId: '',
                  enterpriseName: ''
                }
              }
              HttpService.post('priviapi/login/loginUser', newParam, function (data) {
                if (data.data.loginStatus === '登录成功') {
                  document.cookie = 'tokenId=' + data.data.authtoken + ';path=/'
                  window.location.href = href + '#/?tokenId=' + data.data.authtoken
                } else {
                  TipBoxService.open('登录失败', 2)
                  that.errorTimes++
                  console.log(data)
                }
              }).catch(e => {
                TipBoxService.open('登录失败', 2)
                that.errorTimes++
                console.log(e)
              })
            } else {
              that.enterpriseData = data.data
              source = tool.getQueryString('source')
              // // var userImg = ''
              // // var href="./departManage.html";
              href = path.APP_MARKET
              that.$emit('flpassb', href, that.enterpriseData)
            }
            if (process.env.NODE_ENV === 'development') {
              href = './safetyManagement'
            }
            // if (data.data.userInfo.enterpriseid[0].IMAGE != '' && data.data.userInfo.enterpriseid[0].IMAGE != undefined) {
            //   userImg = HttpService.apiBaseUrl + data.data.userInfo.enterpriseid[0].IMAGE
            // }
            // user.setUser(data.data.authtoken, data.data.userInfo.userName, userImg)
            if (source != null) {
              console.info('source=', source)
              source = decodeURIComponent(source)
              if (source.indexOf('?') == -1) {
                if (data.data.enterpriseids != undefined) {
                  href = source + '?tokenId=' + data.data.authtoken + '&enterpriseid=' + data.data.enterpriseids + '&userId=' + data.data.authtoken
                } else if (data.data.webdata != undefined) {
                  href = source + '?id=' + data.data.webdata
                } else { href = source + '?tokenId=' + data.data.authtoken }
              } else {
                console.info('ok')
                if (data.data.enterpriseids != undefined) {
                  href = source + '&tokenId=' + data.data.authtoken + '&enterpriseid=' + data.data.enterpriseids + '&userId=' + data.data.authtoken
                } else if (data.data.webdata != undefined) {
                  href = source + '&id=' + data.data.webdata
                } else { href = source + '&tokenId=' + data.data.authtoken }
              }
            } else {
              if (data.data.userInfo) {
                sessionStorage.menuName = JSON.stringify(data.data.userInfo.menuName)
              }
            }
            //                             TipBoxService.open('登录成功',0);
            // console.info('href=', href)
            // window.location.href = href
            // 选择企业
          } else {
            TipBoxService.open(data.exception, 2)
            that.errorTimes++
          }
        }
      }).catch(e => {
        TipBoxService.open('用户名或密码错误', 2)
        that.errorTimes++
        console.log(e)
      })
    },
    // 忘记密码
    forgoPass: function () {
      this.$parent.$parent.$parent.$children[1].sendShortImg()
      this.$emit('flpass', 'hehe')
    },

    // 获取图片验证码
    getImgCheck: function () {
      var that = this
      let baseUrl = HttpService.apiBaseUrl
      that.imgCheckUrl = baseUrl + '/priviapi/login/authCode?abc=' + Math.random()
    },
    // 勾选/取消勾选 记住密码
    clickRemember: function () {
      this.rememberPass = !this.rememberPass
      if (this.rememberPass == false) {
        user.storeInfo('loginUsername', '', -7)
        user.storeInfo('loginPass', '', -7)
        // localStorage.removeItem('username')
        // localStorage.removeItem('password')
      }
    },
    // 加密
    compile: function (code) {
      var c = String.fromCharCode(code.charCodeAt(0) + code.length)
      for (var i = 1; i < code.length; i++) {
        c += String.fromCharCode(code.charCodeAt(i) + code.charCodeAt(i - 1))
      }
      return escape(c)
    },
    // 解密
    uncompile: function (code) {
      code = unescape(code)
      var c = String.fromCharCode(code.charCodeAt(0) - code.length)
      for (var i = 1; i < code.length; i++) {
        c += String.fromCharCode(code.charCodeAt(i) - c.charCodeAt(i - 1))
      }
      return c
    },
    // 存入cookie 没有用encodeURI
    setCookie: function (name, value, days) {
      var d = new Date()
      d.setTime(d.getTime() + 24 * 60 * 60 * 1000 * days)
      document.cookie = name + '=' + value + ';path=/;expires=' + d.toGMTString()
    }
  }
}
</script>
<style src="../css/register.css" scoped>

</style>
<style scoped>
.main-container {
  position: relative;
}
.loginInputLine {
  position: relative;
}
/* .loginInputLine .eye {
  display: inline-block;
  width: 16px;
  height: 16px;
  position: absolute;
  right: 5px;
  top: 8px;
  background: url("../images/loginshowpwd.png") no-repeat center center;
  background-size: 100% 100%;
  cursor: pointer;
} */

.show-icon{
    padding: 6px;
    width: 26px;
    height: 20px;
    display: block;
    position: absolute;
    top: 8px;
    right: -1px;
    background: url('../images/loginshowpwd.png') no-repeat ;
    background-origin: content-box;
    background-size: cover;
    cursor: pointer;
  }
  .main-container .active{
    background: url('../images/loginhidepwd.png') no-repeat;
    background-origin: content-box;
    background-size: cover;
    padding: 5px;
    width: 26px;
    height: 20px;
  }
</style>
<style scoped>
.el-tab-pane {
  padding-top: 0 !important;
}
.el-tabs .el-tabs__content {
  padding: 0 0 0 0 !important;
}
</style>
