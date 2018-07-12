<script src="../../../../vue.min.js"></script>
<template>
  <div class="login">
    <div class="main-box">
      <div class="login-box">
        <div class="login-bg"></div>
        <div class="top-logo"></div>
        <div class="login-input">
          <div class="input-line line-one">
            <input type="text" placeholder="请输入账号" v-model="username" @keyup.enter="goLogin">
          </div>
          <div class="input-line line-two">
            <input :type="pwdType" placeholder="请输入密码" v-model="password" @keyup.enter="goLogin">
            <span class="show-icon" @click="showPwd" :class="{active:showPassword}" :title="pwdTips"></span>
          </div>
          <div class="input-button">
            <div class="button-section">
              <span class="checkbox" :class="{active:checked}" @click="remeberAccount"></span>
              <span @click="remeberAccount">记住账号</span>
            </div>
            <!-- <div class="button-section">
              <span class="pwd-icon"></span>
              <span>忘记密码</span>
            </div> -->
          </div>
          <div class="login-button">
            <span @click="goLogin">立即登录</span>
          </div>
        </div>
      </div>
    </div>
    <div class="footer">
      <p>Copyright&nbsp;2015-2020&nbsp;&nbsp;神州泰岳&nbsp;&nbsp;版权所有&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;京公安网备11000002000001号</p>
    </div>
  </div>
</template>
<script>
import ApiClient from '../../publicJs/ApiClient'
import TipBoxService from '../../publicJs/TipBoxService'
import LoadingBoxService from '../../publicJs/LoadingBoxService.js'
export default {
  data () {
    return {
      username: '',
      password: '',
      pwdType: 'password', // 密码input type
      pwdTips: '显示密码', // 图标提示
      checked: false, // 勾选记住账号
      showPassword: false // 明文密码
    }
  },
  mounted () {
    if (localStorage.getItem('username')) {
      this.username = localStorage.getItem('username')
      this.checked = true
    }
  },
  methods: {
    showPwd () { // 明文密码
      this.showPassword = !this.showPassword
      if (this.showPassword === true) {
        this.pwdType = 'text'
        this.pwdTips = '隐藏密码'
      } else {
        this.pwdType = 'password'
        this.pwdTips = '显示密码'
      }
    },
    remeberAccount () { // 记住账号
      this.checked = !this.checked
      if (this.checked === false) {
        localStorage.removeItem('username')
      }
    },
    goLogin () { // 登录
      let that = this
      let param = {}
      var nameReg = /^[0-9]*$/
      if (that.username.length === 11 && nameReg.test(that.username) === true) {
        param = {
          phone: that.username,
          password: that.password
        }
      } else {
        param = {
          name: that.username,
          password: that.password
        }
      }
      let token = ''
      if (that.username === '' || that.password === '') {
        TipBoxService.open('请输入登录信息', 2)
        return false
      } else {
        LoadingBoxService.open('登录中...')
        ApiClient.post('priviapi/login/loginPlatform', param, function (data) {
          LoadingBoxService.close()
          if (data.data.loginStatus === 'FAIL') {
            TipBoxService.open(data.data.errorMsg, 2)
            return false
          } else if (data.data.loginStatus === 'SUCCESS') {
            if (that.checked === true) {
              localStorage.setItem('username', that.username)
            }
            token = data.data.authToken
            document.cookie = 'tokenId=' + token + ';path=/'
            that.$router.push({path: '/internalOperation?tokenId=' + token})
          } else {
            TipBoxService.open('登录失败', 2)
            return false
          }
        }).catch(e => {
          LoadingBoxService.close()
          console.log(e)
          TipBoxService.open('登录失败', 2)
        })
      }
    }
  }
}
</script>
<style scoped>
  .login{
    width: 100%;
    height: 100%;
    min-height: 500px;
    min-width: 980px;
    background: url('../images/loginbg.png') repeat-x bottom;
    position: relative;
    color: #999;
  }
  .main-box{
    width: 100%;
    height: 100%;
    position: relative;
    z-index: 10;
  }
  .main-box .login-box{
    height: 420px;
    width: 386px;
    border-radius: 8px;
    position: absolute;
    margin: auto;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    box-shadow: 0 10px 60px rgba(0,0,0,.2);
  }
  .main-box .login-box .login-bg{
    height: 381px;
    width: 659px;
    position: absolute;
    background: url('../images/loginicon.png');
    top: -139px;
    left: -137px;
  }
  .main-box .login-box .top-logo{
    height: 160px;
    width: 386px;
    background: url('../images/loginlogo.jpg');
    border-radius: 8px 8px 0 0;
  }
  .main-box .login-box .login-input{
    height: 260px;
    width: 386px;
    padding: 30px 45px;
    background: #fff;
    position: relative;
    border-radius: 0 0 8px 8px;
  }
  .main-box .login-box .login-input .input-line{
    height: 46px;
    padding-top: 10px;
    position: relative;
  }
  .main-box .login-box .login-input .input-line input{
    width: 100%;
    border: none;
    border-bottom: 1px solid #f1f1f1;
    font-size: 14px;
    padding: 0 28px 2px 38px;
  }
  .main-box .login-box .login-input .input-line:before{
    height: 24px;
    width: 24px;
    content: '';
    display: block;
    position: absolute;
    top: 6px;
  }
  .main-box .login-box .login-input .line-one:before{
    background: url('../images/loginaccount.png')
  }
  .main-box .login-box .login-input .line-two:before{
    background: url('../images/loginpwd.png')
  }
  .main-box .login-box .login-input .line-two .show-icon{
    padding: 6px;
    width: 26px;
    height: 20px;
    display: block;
    position: absolute;
    top: 10px;
    right: -1px;
    background: url('../images/loginshowpwd.png') no-repeat;
    background-origin: content-box;
    background-size: cover;
    cursor: pointer;
  }
  .main-box .login-box .login-input .line-two .show-icon.active{
    background: url('../images/loginhidepwd.png') no-repeat;
    background-origin: content-box;
    background-size: cover;
    padding: 5px;
    width: 26px;
    height: 20px;
  }
  .main-box .login-box .login-input .login-button{
    position: absolute;
    bottom: 30px;
    left: 108px;
  }
  .main-box .login-box .login-input .login-button span{
    width: 170px;
    height: 36px;
    border-radius: 18px;
    background: #55a8fd;
    color: #fff;
    display: inline-block;
    line-height: 36px;
    text-align: center;
    font-size: 15px;
    cursor: pointer;
  }
  .main-box .login-box .login-input .login-button span:hover{
    background: #639fea;
  }
  .main-box .login-box .login-input .input-button .button-section{
    font-size: 12px;
    height: 20px;
    width: 110px;
    line-height: 20px;
    display: inline-block;
    color: #b6b6b6;
  }
  .main-box .login-box .login-input .input-button .button-section span:first-child{
    height: 12px;
    width: 12px;
    float: left;
    position: relative;
    top: -5px;
    margin-right: 10px;
    cursor: pointer;
  }
  .main-box .login-box .login-input .input-button .button-section span:last-child{
    float: left;
    cursor: pointer;
  }
  .main-box .login-box .login-input .input-button .button-section .checkbox{
    background: url('../images/logincheboxs.png');
  }
  .main-box .login-box .login-input .input-button .button-section .checkbox.active{
    background: url('../images/inputchebox.png');
  }
  .main-box .login-box .login-input .input-button .button-section span.pwd-icon{
    background: url('../images/loginforget.png');
    top: 4px;
    height: 14px;
    width: 14px;
  }
  .login .footer{
    width: 100%;
    height: 270px;
    background: url('../images/loginbottom.png') bottom center;
    min-width: 980px;
    display: inline-block;
    position: absolute;
    bottom: 0;
    padding-top: 243px;
    text-align: center;
    z-index: 0;
    color: #838383;
  }
  .main-box .login-box .login-input .input-line input::-webkit-input-placeholder {
    color: #b6b6b6;
  }
  .main-box .login-box .login-input .input-line input:-moz-placeholder {
    color: #b6b6b6;
  }
  .main-box .login-box .login-input .input-line input::-moz-placeholder {
    color: #b6b6b6;
  }
  .main-box .login-box .login-input .input-line input:-ms-input-placeholder {
    color: #b6b6b6;
  }
</style>
