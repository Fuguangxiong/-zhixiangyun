<template>
  <div id="register">
    <div class="am-header">
      <img src="../../images/isCloud.png" class="am-fg-img" @click="goAppmarket">
      <div class="am-menu">
        <div class="am-menu-right">已有账号，<span @click="onGoLogin">请登录</span><i class="iconfont icon-youjiantou"></i></div>
      </div>
    </div>
    <div class="am-main-box">
      <div class="am-step-box">
        <div class="am-step1" :class="{'step-active': step1 || step2 || step3}">
          <span class="am-outer-circle">
            <span class="am-step-point">1</span>
          </span>  
          <span class="am-step-title">验证手机号</span>
        </div>
        <div class="am-step-line am-step-line1" :class="{'step-active': step2 || step3}"></div>
        <div class="am-step2" :class="{'step-active': step2 || step3}">
          <span class="am-outer-circle">
            <span class="am-step-point">2</span>
          </span>  
          <span class="am-step-title">填写账号信息</span>
        </div>
        <div class="am-step-line am-step-line2" :class="{'step-active': step3}"></div>
        <div class="am-step3" :class="{'step-active': step3}">
          <span class="am-outer-circle">
            <span class="am-step-point">3</span>
          </span>  
          <span class="am-step-title">注册成功</span>
        </div>
      </div>
      <div class="am-content" v-if="step1">
        <div class="am-input-line">
          <div class="am-col-1">
            <span class="am-input-title am-required">手机号：</span>
          </div>
          <div class="am-col-2">
            <span class="am-input">
              <input type="text" v-model="phone" :class="{'am-error': phoneError}" maxlength="11" @blur="onCheckPhone"/>
            </span>
          </div>
          <div class="am-col-3">
            <img class="am-loading-img1" v-show="phoneChecking" src="../../../publicImages/loading_check.gif">
            <span v-show="phoneError"><img src="../../images/exclamatory-red.png"/>{{phoneErrorText}}</span>
            <span v-show="passPhone"><img src="../../images/correct.png"></span>
          </div>
        </div>  
        <div class="am-input-line">
          <div class="am-col-1">
            <span class="am-input-title am-required">验证码：</span>
          </div>
          <div class="am-col-2">
            <span class="am-input">
              <input type="text" v-model="imgMsg" class="am-short-input" :class="{'am-error': imgError}" @blur="onCheckImgMsg" maxlength="4"/>
              <img :src="imgSrc" alt="" title="换一张"  @click="getImgSrc"/>
              <!-- <span class="am-tiny-button" @click="getImgSrc">换一张</span> -->
            </span>
          </div>
          <div class="am-col-3">
            <span v-show="imgError"><img src="../../images/exclamatory-red.png"/>图形验证码错误</span>
          </div>
        </div>  
        <div class="am-input-line">
          <div class="am-col-1">
            <span class="am-input-title am-required">短信验证码：</span>
          </div>
          <div class="am-col-2">
            <span class="am-input">
              <input type="text" v-model="shortMsg" maxlength="6" class="am-short-input" :class="{'am-error': shortMsgError}" @blur="onCheckShortMsg"/>
              <button type="button" class="btnBlue am-bigBtn" :class="{'disabled': shortMsgDisabled}" @click="onSendShortMsg">{{shortMsgText}}{{countDown}}</button>    
            </span>
          </div>
          <div class="am-col-3">
            <span v-show="shortMsgError"><img src="../../images/exclamatory-red.png"/>验证码错误或失效</span>
          </div>
        </div>
        <div class="am-input-line">
          <div class="am-col-1"></div>
          <div class="am-col-2">
            <button class="btnBlue" :class="{'disabled': nextOneDisabled}" @click="onGoStepTwo">下一步</button>
          </div>
          <div class="am-col-3"></div>
        </div>
      </div>
      <div class="am-content" v-if="step2">
        <div class="am-input-line">
          <div class="am-col-1">
            <span class="am-input-title am-required">用户名：</span>
          </div>
          <div class="am-col-2">
            <span class="am-input">
              <input type="text" v-model="account" :class="{'am-error': accountError}" maxlength="20" @blur="onCheckAccount"/>
            </span>
          </div>
          <div class="am-col-3">
            <img class="am-loading-img" v-show="accountChecking" src="../../../publicImages/loading_check.gif">
            <span v-show="!accountError&&!passAccount&&!accountChecking"><img src="../../images/exclamatory-normal.png"/><span class="am-long-tips">支持英文、数字组合，不允许纯数字，6-20位字符</span></span>
            <span v-show="passAccount"><img src="../../images/correct.png"></span>
            <span v-show="accountError"><img src="../../images/exclamatory-red.png"/>{{accountErrorText}}</span>
          </div>
        </div>
        <div class="am-input-line">
          <div class="am-col-1">
            <span class="am-input-title am-required">密码：</span>
          </div>
          <div class="am-col-2">
            <span class="am-input">
              <input type="password" v-model="password" :class="{'am-error': passwordError}" maxlength="20" @blur="onCheckPassword"/>
            </span>
          </div>
          <div class="am-col-3">
            <span v-show="!passwordError&&!passPassword"><img src="../../images/exclamatory-normal.png"/>英文数字组合，6-20字符</span>
            <span v-show="passwordError"><img src="../../images/exclamatory-red.png"/><span class="am-long-tips">{{passwordErrorText}}</span></span>
            <span v-show="passPassword"><img src="../../images/correct.png"/></span>
          </div>
        </div>
        <div class="am-input-line">
          <div class="am-col-1">
            <span class="am-input-title am-required">确认密码：</span>
          </div>
          <div class="am-col-2">
            <span class="am-input">
              <input type="password" v-model="confirmPwd" :class="{'am-error': confirmPwdError}" maxlength="20" @blur="onCheckConfirmPwd"/>
            </span>
          </div>
          <div class="am-col-3">
            <span v-show="confirmPwdError"><img src="../../images/exclamatory-red.png"/>两次密码输入不一致</span>
            <span v-show="passConfirmPwd"><img src="../../images/correct.png"/></span>
          </div>
        </div>
        <div class="am-input-line">
          <div class="am-col-1"></div>
          <div class="am-col-2">
            <button class="btnBlue" :class="{'disabled': nextTwoDisabled}" @click="onGoStepThree">注册</button>
          </div>
          <div class="am-col-3"></div>
        </div>
      </div>
      <div class="am-content am-step3" v-if="step3">
        <div class="am-content-box">
          <span><img src="../../images/correct.png">注册账号{{account}}成功，{{count}}s后返回 <span class="am-button" @click="onGoLogin">登录页面</span> 。</span>
        </div>
      </div>
    </div>
    <footer>Copyright 2015-2020 神州泰岳 版权所有</footer>
  </div>
</template>
<script>
import ApiClient from '../../../publicJs/ApiClient.js'
import TipBoxService from '../../../publicJs/TipBoxService.js'
import path from '../../../publicJs/publicPathConfig.js'
var countDownTimer = ''
var overtimeTimer = ''
var successCountTimer = ''
export default {
  name: 'register',
  data () {
    return {
      active: 0,
      step1: true,
      step2: false,
      step3: false,
      phoneError: false,
      phoneErrorText: '',
      phone: '',
      phoneChecking: false,
      lockedPhone: '',
      imgSrc: '',
      imgMsg: '',
      shortMsg: '',
      imgError: false,
      shortMsgDisabled: true,
      passPhone: false,
      passImgMsg: false,
      passShortMsg: false,
      shortMsgError: false,
      shortMsgText: '发送短信验证码',
      countDown: '',
      trueShortMsg: '',
      nextOneDisabled: true,
      account: '',
      passAccount: false,
      accountError: false,
      accountErrorText: '',
      accountChecking: false,
      password: '',
      passwordError: false,
      passwordErrorText: '',
      passPassword: false,
      confirmPwd: '',
      confirmPwdError: false,
      passConfirmPwd: false,
      nextTwoDisabled: true,
      count: 3
    }
  },
  mounted () {
    this.getImgSrc()
  },
  watch: {
    passPhone (newVal) {
      if (newVal) {
        if (this.passImgMsg) {
          if (this.shortMsgText === '发送短信验证码') {
            this.shortMsgDisabled = false
          }
        } else {
          this.shortMsgDisabled = true
        }
      } else {
        this.shortMsgDisabled = true
        this.nextOneDisabled = true
      }
    },
    passImgMsg (newVal) {
      if (newVal) {
        if (this.passPhone) {
          if (this.shortMsgText === '发送短信验证码') {
            this.shortMsgDisabled = false
          }
          if (this.passShortMsg) {
            this.nextOneDisabled = false
          }
        } else {
          this.shortMsgDisabled = true
        }
      } else {
        this.shortMsgDisabled = true
        this.nextOneDisabled = true
      }
    },
    passShortMsg (newVal) {
      if (newVal) {
        if (this.passPhone && this.passImgMsg) {
          this.nextOneDisabled = false
        } else {
          this.nextOneDisabled = true
        }
      } else {
        this.nextOneDisabled = true
      }
    },
    passAccount (newVal) {
      if (newVal) {
        if (this.passPassword) {
          this.nextTwoDisabled = false
        } else {
          this.nextTwoDisabled = true
        }
      } else {
        this.nextTwoDisabled = true
      }
    },
    passConfirmPwd (newVal) {
      if (newVal) {
        if (this.passAccount) {
          this.nextTwoDisabled = false
        } else {
          this.nextTwoDisabled = true
        }
      } else {
        this.nextTwoDisabled = true
      }
    }
  },
  methods: {
    // step1
    onCheckPhone () {
      var that = this
      let phoneReg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/
      that.passPhone = false
      if (that.phone === '') {
        that.passPhone = false
      } else if (phoneReg.test(that.phone) === false) {
        that.phoneErrorText = '请输入正确的手机号'
        that.phoneError = true
        that.passPhone = false
      } else {
        that.phoneChecking = true
        ApiClient.get('priviapi/accountpriv/checkPhone?phone=' + that.phone).then(data => {
          that.phoneChecking = false
          if (data.data === true) {
            that.phoneError = true
            that.phoneErrorText = '该手机号已被占用'
            that.passPhone = false
          } else {
            that.phoneChecking = false
            that.phoneError = false
            that.passPhone = true
          }
        }).catch(err => {
          that.phoneChecking = false
          console.error(err)
        })
      }
    },
    getImgSrc () {
      let baseUrl = ApiClient.apiBaseUrl
      this.imgSrc = baseUrl + '/priviapi/login/authCode?abc=' + Math.random()
    },
    onCheckImgMsg () {
      let that = this
      that.passImgMsg = false
      if (this.imgMsg === '') return
      ApiClient.get('priviapi/login/validImgCode', 'param=' + that.imgMsg, function (data) {
        if (data.data === true) {
          that.imgError = false
          that.passImgMsg = true
        } else {
          that.imgError = true
          that.passImgMsg = false
          that.getImgSrc()
        }
      })
    },
    onSendShortMsg () {
      let that = this
      if (that.shortMsgDisabled) return
      clearTimeout(overtimeTimer)
      that.passShortMsg = false
      that.shortMsgError = false
      that.shortMsgDisabled = true
      that.shortMsg = ''
      var count = 60
      that.shortMsgText = '重新发送'
      that.countDown = '(' + count + 's)'
      countDownTimer = setInterval(function () {
        if (count > 0) {
          count--
          that.countDown = '(' + count + 's)'
        } else {
          that.countDown = ''
          clearInterval(countDownTimer)
          if (that.passPhone && that.passImgMsg) {
            that.shortMsgDisabled = false
          }
        }
      }, 1000)
      /* ApiClient.get('priviapi/login/verifyCode', 'param=' + that.phone, function (data) {
        that.lockedPhone = that.phone
        that.trueShortMsg = data.data.code
        overtimeTimer = setTimeout(function () {
          that.trueShortMsg = Math.random()
        }, 65000)
      }) */
      that.lockedPhone = that.phone
      that.trueShortMsg = 1111
    },
    onCheckShortMsg () {
      let that = this
      that.passShortMsg = false
      if (that.shortMsg === '') {
        that.passShortMsg = false
      } else {
        if (that.shortMsg == that.trueShortMsg) {
          that.passShortMsg = true
          that.shortMsgError = false
        } else {
          that.passShortMsg = false
          that.shortMsgError = true
        }
      }
    },
    onGoStepTwo () {
      if (this.nextOneDisabled) {
        return false
      } else {
        this.active = 1
        this.step1 = false
        this.step2 = true
        this.step3 = false
      }
    },
    // step2
    onCheckAccount () {
      let that = this
      let accountReg = /[a-zA-Z0-9]{6,20}$/
      let numberReg = /^[0-9]*$/
      that.passAccount = false
      if (that.account === '') {
        that.accountError = false
        return false
      } else if (numberReg.test(that.account)) {
        that.accountError = true
        that.accountErrorText = '用户名不能为纯数字'
      } else if (!accountReg.test(that.account)) {
        that.accountError = true
        that.accountErrorText = '用户名格式错误'
      } else {
        that.accountChecking = true
        ApiClient.get('priviapi/accountpriv/checkName?name=' + that.account).then(data => {
          that.accountChecking = false
          if (data.data === true) {
            that.accountError = true
            that.accountErrorText = '用户名已被占用'
          } else {
            that.accountError = false
            that.passAccount = true
          }
        }).catch(err => {
          that.accountChecking = false
          console.error(err)
        })
      }
    },
    onCheckPassword () {
      let that = this
      let pwdReg = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,20}$/
      that.passConfirmPwd = false
      that.passPassword = false
      if (that.password === '') {
        that.passwordError = false
        return
      } else if (that.password === that.account) {
        that.passwordError = true
        that.passwordErrorText = '密码不可与用户名相同'
      } else if (!pwdReg.test(that.password)) {
        that.passwordError = true
        that.passwordErrorText = '密码格式错误，密码为英文数字组合，6-20字符'
      } else {
        that.passwordError = false
        that.passPassword = true
      }
    },
    onCheckConfirmPwd () {
      let that = this
      that.passConfirmPwd = false
      if (that.confirmPwd === '') {
        that.confirmPwdError = false
        return false
      } else if (that.confirmPwd !== that.password) {
        that.confirmPwdError = true
      } else {
        that.confirmPwdError = false
        that.passConfirmPwd = true
      }
    },
    onGoStepThree () {
      let that = this
      if (that.nextTwoDisabled) {
        return false
      } else {
        let param = {
          name: that.account,
          phone: that.phone,
          passWord: that.password
        }
        ApiClient.post('priviapi/accountpriv/register', param).then(data => {
          console.log(data, 'register')
          if (data.data === '注册成功！') {
            that.active = 3
            that.step1 = false
            that.step2 = false
            that.step3 = true
            successCountTimer = setInterval(function () {
              if (that.count > 0) {
                that.count --
              } else {
                that.count = ''
                clearInterval(successCountTimer)
                that.onGoLogin()
              }
            }, 1000)
          } else {
            TipBoxService.open(data.exception, 2)
          }
        }).catch(err => {
          console.log(err)
          TipBoxService.open(err.response.data.exception, 2)
        })
      }
    },
    // step3
    onGoLogin () {
      window.location.href = path.PLATFORM_LOGIN_URL
    },
    goAppmarket(){
      window.location.href = path.APP_MARKET
    }
  }
}
</script>
<style src='../../../personalConsole/css/btn.css' scoped>
</style>
<style scoped>
  #register{
    height: 100%;
    position: relative;
    min-width: 1000px;
    min-height: 600px;
  }
  .am-header{
    height: 66px;
    width: 100%;
    display: inline-block;
    background: #0a2553;
  }
  .am-header img{
    margin-left: 80px;
    margin-top: 10px;
  }
  .am-menu{
    width: 230px;
    height: 22px;
    display: inline-block;
    position: absolute;
    top: 20px;
    right: 70px;
    line-height: 22px;
  }
  .am-menu-left{
    display: block;
    float: left;
    width: 90px;
    height: 22px;
    border-right: 1px solid #fff;
    color: #FD7601;
    font-size: 16px;
    text-align: center;
  }
  .am-menu-right{
    float: right;
    width: 140px;
    height: 22px;
    color: #fff;
    text-align: center;
  }
  .am-menu-right span{
    color: #FD7601;
    cursor: pointer;
  }
  .am-step-box{
    display: inline-block;
    padding-left: 20px;
    width: 600px;
    height: 30px;
    position: relative;
    left: 50%;
    transform: translateX(-50%);
    margin: 75px 0 20px 0;
  }
  .am-step1{
    position: absolute;
    top: 0;
    left: 20px;
  }
  .am-step2{
    position: absolute;
    top: 0;
    left: 270px;
  }
  .am-step3{
    position: absolute;
    top: 0;
    left: 520px;
  }
  .am-outer-circle{
    height: 30px;
    width: 30px;
    border: 3px solid #eee;
    border-radius: 14px;
    display: inline-block;
    transition: all .8s;
  }
  .am-step-point{
    display: inline-block;
    height: 24px;
    width: 24px;
    line-height: 24px;
    text-align: center;
    border-radius: 12px;
    background: #dcdcdc;
    transition: all .8s;
    color: #fff;
  }
  .step-active .am-step-point{
    background: #3197FF;
  }
  .step-active .am-outer-circle{
    padding: 2px 0 0 2px;
    border: 1px solid #3197FF;
  }
  .am-step-title{
    position: absolute;
    top: 42px;
    left: -24px;
    width: 80px;
    height: 20px;
    text-align: center;
    transition: all .8s;
  }
  .step-active .am-step-title{
    color: #3D82EA;
  }
  .am-step-line{
    display: inline-block;
    height: 3px;
    width: 220px;
    background: #eee;
    transition: all .8s;
  }
  .step-active.am-step-line{
    background: linear-gradient(to right, #3197ff , #01C967);
    background: -moz-linear-gradient(right, #3197ff , #01C967);
  }
  .am-step-line1{
    position: absolute;
    top: 14px;
    left: 50px;
  }
  .am-step-line2{
    position: absolute;
    top: 14px;
    left: 300px;
  }
  .am-content{
    width: 600px;
    height: 300px;
    position: relative;
    left: 50%;
    transform: translateX(-50%);
    margin-top: 40px;
    padding: 10px;
  }
  .am-input-line{
    width: 100%;
    height: 40px;
    display: inline-block;
    position: relative;
    margin-bottom: 10px;
  }
  .am-input-line>div{
    display: inline-block;
    height: 40px;
  }
  .am-input-title{
    float: right;
    padding-right: 5px;
  }
  .am-input{
    height: 40px;
    width: 100%;
    display: inline-block;
    position: relative;
  }
  .am-input input{
    height: 30px;
    border: 1px solid #ddd;
    border-radius: 3px;
    padding: 0 6px;
    -moz-outline-radius: 3px;
    width: 232px;
    outline: none;
    position: absolute;
    top: 0;
    left: 0;
  }
  .am-input .am-short-input{
    width: 120px;
  }
  .am-input .am-error{
    border-color: #fa3753;
    box-shadow: 0 0 2px #fa3753;
  }
  .am-input input:focus{
    border: 1px solid #55a8fd;
    box-shadow: 0 0 2px #55a8fd;
  }
  .am-input>span{
    display: inline-block;
    height: 30px;
    line-height: 30px;
    width: 200px;
    position: absolute;
    bottom: 0;
    left: 0;
  }
  .am-col2-2 .am-input>span{
    width: 280px;
  }
  .am-required::before{
    content: "*";
    color: #fa3753;
    margin-right: 5px;
  }
  .am-col-1{
    width: 28%;
    line-height: 30px;
  }
  .am-col-2{
    width: 40%;
    height: 40px;
    position: absolute;
    top: 0;
    left: 164px;
  }
  .am-long-tips{
    line-height: 40px;
    width: 280px;
    display: inline-block;
    position: absolute;
    top: -6px;
    left: 18px;
    overflow: visible;
  }
  .am-input>img{
    position: absolute;
    top: 0;
    left: 132px;  
  }
  .am-col-2 button{
    position: absolute;
    top: 50px;
    left: 50%;
    transform: translateX(-50%);
  }
  .am-col2-2 button{
    margin-left: 70px;
  }
  .am-col-3{
    width: 30%;
    position: absolute;
    line-height: 30px;
    top: 0;
    right: 0;
  }
  .am-loading-img{
    position: absolute;
    top: 7px;
    left: 0;
  }
  .am-col2-1{
    width: 30%;
    line-height: 30px;
  }
  .am-col2-2{
    width: 68%;
    height: 40px;
    position: absolute;
    top: 0;
    left: 177px;
  }
  .am-bigBtn.btnBlue{
    width: 100px;
    position: absolute;
    top: 0;
    left: 182px;  
    border-radius: 3px;
  }
  /* .am-tiny-button{
    color: #639fea;
    cursor: pointer;
    position: relative;
    top: 8px;
    left: 2px;
  } */
  button.disabled{
    background: #ccc;
    color: #fff;
    border: none;
    cursor: text;
  }
  button.disabled:hover{
    border: none;
    background: #ccc;
    color: #fff;
  }
  .am-step3{
    text-align: center
  }
  .am-content-box{
    display: block;
    margin-top: 40px;
    font-size: 14px;
  }
  .am-button{
    color: #3D82EA;
    cursor: pointer;
  }
  .am-col-3 span img{
    height: 14px;
    width: 14px;
    transform: translate(2px, -2px);
    margin-right: 4px;
  }
  .am-content-box img{
    height: 36px;
    width: 36px;
    transform: translate(2px, -2px);
    margin-right: 14px;
  }
  footer{
    background: #eee;
    text-align: center;
    color: #aaa;
    height: 28px;
    line-height: 28px;
    position: fixed;
    bottom: 0;
    width: 100%;
  }
  .icon-youjiantou{
    font-size: 12px;
  }
  .am-fg-img{
    cursor: pointer;
  }
</style>

