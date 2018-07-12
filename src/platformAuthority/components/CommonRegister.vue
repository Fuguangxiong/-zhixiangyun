<template>
    <div>
        <div class="loginInputContainer admins">
            <div class="loginInputLine">
                <el-popover
                ref="nameRule"
                placement="top-start"
                width="200"
                trigger="focus"
                content="用户名为5-25位字符，不允许为纯数字，一旦设定无法变更">
                </el-popover>
                <input v-model="username" class="loginInput textColor2" :class="{error:nameError}" placeholder="用户名" v-popover:nameRule @blur="checkName()"/>
            </div>
            <div class="loginInputLine">
                <input v-model="telephone" class="loginInput textColor2" :class="{error:phoneError}" placeholder="手机号" @blur="checkPhone()"/>
            </div>
            <div class="loginInputLine shortmsg">
                <input type="imgmsg" v-model="imgmsg" class="loginInput textColor2 shortmsg" :class="{error:imgError}" placeholder="图形验证码"  v-on:blur="checkShortMsgImg()"/>
            <a class="sendShort sendImg"  v-on:click="sendShortImg()" style="overflow: hidden;"><img :src="flImg" alt=""></a>
            </div>
            <div class="loginInputLine shortmsg">
                <input type="shortmsg" v-model="shortmsg" class="loginInput textColor2 shortmsg" :class="{error:msgError}" placeholder="短信验证码" v-on:blur="checkShortMsg()"/>
                <a class="sendShort" v-bind:class="{grayBtn:isShopShort|| phonePass=== false}" v-on:click="sendShort()">{{shortMsgText}}{{ countDown }}</a>
            </div>
            <div class="loginInputLine">
                <input v-model="password" type="password" class="loginInput textColor2" :class="{error:pwdError}" placeholder="登录密码"/>
            </div>
            <div class="loginInputLine">
                <input v-model="repassword" type="password"  v-on:blur="checkPassword()" class="loginInput textColor2" :class="{error:pwdError}" placeholder="确认密码"/>
            </div>
        </div>
        <div class="loginBtnContainer">
            <div class="publicBtn" v-on:click="register()">注册</div>
        </div>
    </div>
</template>
<script>
import HttpService from '../../publicJs/ApiClient'
import TipBoxService from '../../publicJs/TipBoxService'
import user from '../../publicJs/userService'
import ToolService from '../publicJs/ToolService'
var countDownTimer = '';
var overtimeTimer = ''
export default {

  data: function () {
    return {
      //                imgCheckUrl:'',
      username: '',
      telephone: '',
      imgmsg: '',
      shortmsg: '', // 短信验证码
      password: '',  // 输入密码
      repassword: '',  // 再次输入密码
      trueShortMsg: '',
      isShopShort: true,
      shortMsgText: '发送短信验证码',
      countDown: '',
      flImg: '',
      lockedPhone: '', // 记录发送短信手机号
      msgCheckStop: false, // 验证码超时或手机改动阻止校验
      pwdPass: false,
      nameError: false,
      phoneError: false,
      phonePass: false, // 手机通过校验标记
      imgError: false,
      msgError: false,
      pwdError: false,
      goReg: false,
      regSign: ''
    }
  },
  mounted () {
    this.sendShortImg()
    this.getSign()
  },
  methods: {
    // 获取唯一标识
    getSign () {
      let that = this
      HttpService.get('pubapi/requestSign/getRequestSignByUrl', 'url=priviapi/accountpriv/register', function (data) {
        that.regSign = data.results
      }).catch(e => {
        TipBoxService.open('网络错误!', 2, null, 800)
      })
    },
    // 发送短信验证码
    sendShort: function () {
      var that = this
      if (!that.isShopShort && !that.phoneError) {
        if (that.telephone === '') {
          TipBoxService.open('请输入手机号码！', 2, null, 800)
          return false
        } else {
          if (!ToolService.regPhone(that.telephone)) {
            TipBoxService.open('请输入正确的手机号！', 2, null, 800)
            return false
          }
        }
        clearTimeout(overtimeTimer)
        that.msgCheckStop = false
        that.isShopShort = true
        var count = 60
        that.shortMsgText = '重新发送'
        that.countDown = '(' + count + 's)'
        countDownTimer = setInterval(function () {
          if (count > 0) {
            count--
            that.countDown = '(' + count + 's)'
          } else {
            that.isShopShort = false
            that.countDown = ''
            clearInterval(countDownTimer)
          }
        }, 1000)
        HttpService.get('priviapi/login/verifyCode', 'param=' + that.telephone, function (data) {
          that.lockedPhone = that.telephone
          that.trueShortMsg = data.data.code
          overtimeTimer = setTimeout(function () {
            that.msgCheckStop = true
          }, 65000)
        })
      }
    },
    // 注册
    register: function () {
      let that = this
      if (that.goReg === false) {
        that.goReg = true
        that.goRegister()
      }
    },
    goRegister: function () {
      let that = this
      that.isShopShort = true
      if (that.username === '') {
        that.nameError = true
        that.sendShortImg()
        TipBoxService.open('用户名校验未通过！', 2, null, 800)
        that.goReg = false
        return false
      } else if (that.nameError) {
        that.sendShortImg()
        TipBoxService.open('用户名校验未通过！', 2, null, 800)
        that.goReg = false
        return false
      } else if (that.phoneError) {
        that.sendShortImg()
        TipBoxService.open('手机号校验未通过！', 2, null, 800)
        that.goReg = false
        return false
      } else if (that.imgError) {
        that.sendShortImg()
        TipBoxService.open('图形验证码校验未通过！', 2, null, 800)
        that.goReg = false
        return false
      } else if (that.shortMsgText !== '验证通过') {
        that.sendShortImg()
        that.msgError = true
        TipBoxService.open('手机号码还未通过验证！', 2, null, 800)
        that.goReg = false
        return false
      } else if (that.pwdError) {
        that.sendShortImg()
        TipBoxService.open('密码校验未通过！', 2, null, 800)
        that.goReg = false
        return false
      } else if (that.telephone !== that.lockedPhone) {
        that.sendShortImg()
        TipBoxService.open('短信验证码超时或失效！', 2, null, 800)
        that.goReg = false
        return false
      }
      var param = {
        name: that.username,
        phone: that.telephone,
        passWord: that.password
      }
      HttpService.post('priviapi/accountpriv/register?requestSign='+that.regSign, param, function (data) {
        console.log('result', data)
        if (data.status == '200') {
          if (data.data === '注册成功！') {
            TipBoxService.open('注册成功！', 0)
            setTimeout(function () {
              location.reload()
            }, 1500)
          } else {
            TipBoxService.open(data.exception, 2)
            that.goReg = false
            that.getSign()
          }
        }
      }).catch(err => {
        console.log(err)
        that.getSign()
        that.goReg = false
      })
    },
    checkName () {
      let that = this
      let nameReg = /^[0-9]*$/
      that.nameError = false
      that.goReg = false
      if (that.username === ''){
        that.nameError = true
      } else if (that.username.split(' ').length > 1 || that.username.length < 5 || that.username.length > 25 || nameReg.test(that.username) === true) {
        that.nameError = true
        TipBoxService.open('用户名校验未通过！', 2, null, 800)
      } else {
        HttpService.get('priviapi/accountpriv/checkName', {'name': this.username}, function (data) {
          if (data.status == '200') {
            if (data.data == true) {
              that.nameError = true
              TipBoxService.open('该用户名已被注册！', 2, null, 800)
            }
          }  
        })
      }
    },
    checkPhone () {
      var that = this
      let phoneReg = /^[1][3,4,5,7,8][0-9]{9}$/
      that.phoneError = false
      that.phonePass = false
      that.goReg = false
      if (that.telephone === '') {
        that.phoneError = true
      } else if (that.lockedPhone !== '' && that.telephone !== that.lockedPhone) {
        that.shortMsgText = '发送短信验证码'
        that.isShopShort = false
        return false
      } else if (phoneReg.test(that.telephone) === false) {
        that.phoneError = true
        TipBoxService.open('请输入正确的手机号', 2, null, 800)
      } else {
        HttpService.get('priviapi/accountpriv/checkPhone', {'phone': this.telephone}, function (data) {
          if (data.status == '200') {
            if (data.data == true) {
              that.phoneError = true
              TipBoxService.open('当前手机号已注册', 2, null, 800)
            } else {
              that.phonePass = true
            }
          }  
        })
      }
    },
    sendShortImg: function () {
      var that = this
      let baseUrl = HttpService.apiBaseUrl
      that.flImg = baseUrl + '/priviapi/login/authCode?abc=' + Math.random()
    },
    checkShortMsgImg: function () {
      this.imgError = false
      this.goReg = false
      var that = this
      if (this.imgmsg === '') {
        that.isShopShort = true
        that.imgError = true
        return false
      } else {
        HttpService.get('priviapi/login/validImgCode', 'param=' + that.imgmsg, function (data) {
          if (data.data === true) {
            if (that.shortMsgText === '验证通过') {
              that.isShopShort = true
            } else {
              that.isShopShort = false
            }
          } else {
            that.isShopShort = true
            that.imgError = true
            that.sendShortImg()
            TipBoxService.open('图形验证码错误！', 2, null, 800)
          }
        })
      }
    },
    checkShortMsg () {
      var that = this
      that.msgError = false
      that.goReg = false
      if (that.shortmsg !== '') {
        if (that.telephone !== that.lockedPhone || that.msgCheckStop) {
          TipBoxService.open('短信验证码超时或失效！', 2, null, 800)
        } else {
          if (that.shortmsg == that.trueShortMsg) {
            clearInterval(countDownTimer)
            that.shortMsgText = '验证通过'
            that.isShopShort = true
            that.countDown = ''
          } else {
            that.msgError = true
            TipBoxService.open('短信验证码错误！', 2, null, 800)
          }
        } 
      } else {
        that.msgError = true
      }
    },
    checkPassword () {
      var that = this
      that.pwdError = false
      that.goReg = false
      var pwdReg = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,20}$/
      if (that.password !== '') {
        if (that.password !== that.repassword) {
          that.pwdError = true
          TipBoxService.open('两次输入的密码不一致！', 2, null, 800)
          return false
        }
      } 
      if (pwdReg.test(that.password) === false) {
        TipBoxService.open('密码为6-20位，需包含字母与数字！', 2, null, 800)
        that.pwdError = true
        that.pwdPass = false
      } else {
        that.pwdPass = true
      }
    }
  }
}
</script>
<style src="../css/register.css" scoped>

