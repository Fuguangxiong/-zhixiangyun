<template>
    <div class="showPass">
        <div class="loginTitleLine">
        <span class="loginTitle textColor1" style="cursor: pointer;">忘记密码</span>
        <a tabindex="-1" href="javascript:;" class="toRegisterLink textColor2 link fr" v-on:click="loginTr()">用户登录</a>
        </div>
        <div class="loginInputContainer forPasshei">
            <div class="loginInputLine">
                <input tabindex="1000" v-model="telephone" class="loginInput textColor2" placeholder="手机号" v-on:blur="formPhone"/>
            </div>
            <div class="loginInputLine shortmsg">
                <input tabindex="1000" type="imgmsg" v-model="imgmsg" class="loginInput textColor2 shortmsg" placeholder="图形验证码"  v-on:blur="checkShortMsgImg()"/>
            <a class="sendShort sendImg"  v-on:click="sendShortImg()" style="overflow: hidden;"><img :src="flImg" alt=""></a>
            </div>
            <div class="loginInputLine shortmsg">
                <input tabindex="1000" type="shortmsg" v-model="shortmsg" class="loginInput textColor2 shortmsg" placeholder="短信验证码" v-on:blur="checkShortMsg()" :disabled="passMsg"/>
                <a class="sendShort" v-bind:class="{grayBtn:isShopShort||phonePass===false}" v-on:click="sendShort()">{{shortMsgText}}{{ countDown }}</a>
            </div>
            <div class="loginInputLine">
                <input tabindex="1000" v-model="password" type="password" class="loginInput textColor2" placeholder="新密码"/>
            </div>
            <div class="loginInputLine">
                <input tabindex="1000" v-model="repassword" type="password"  v-on:blur="checkPassword()" class="loginInput textColor2" placeholder="确认密码"/>
            </div>
        </div>
        <div class="loginBtnContainer">
            <div class="publicBtn" v-on:click="sregisterpass()">确定</div>
        </div>
    </div>
</template>
<script>
import HttpService from '../../publicJs/ApiClient'
import envConfig from '../../../config/envConfig'
import TipBoxService from '../../publicJs/TipBoxService'
import user from '../../publicJs/userService'
import ToolService from '../publicJs/ToolService'
var countDownTimer = ''
var overtimeTimer = ''
export default {
  data: function () {
    return {
      telephone: '',
      imgmsg: '',//图片验证码
      shortmsg: '',//短信验证码
      password: '',  //输入密码
      repassword: '',  //再次输入密码
      trueShortMsg: '',
      isShopShort: true,
      shortMsgText: '发送短信验证码',
      phonePass: false,
      countDown: '',
      flImg: '',
      pwdPass: false,
      imgcheckPass: false,
      lockPhone: '',
      passMsg: false
    }
  },
  methods: {
    //忘记密码动画
    loginTr: function () {
      this.$emit('flpass')

    },
    //手机号码验证
    formPhone: function () {
      var that = this
      if (that.telephone === '') {
        that.phonePass = false
        return false
      } else if (that.lockPhone !== '' && that.telephone !== that.lockPhone){
        that.shortMsgText = '发送短信验证码'
        that.isShopShort = false
        return false
      } else {
        if (!ToolService.regPhone(that.telephone)) {
          TipBoxService.open('请输入正确的手机号码', 2)
          that.phonePass = false
          return false
        } else {
          that.phonePass = false
          HttpService.get('priviapi/login/checkPhone', 'param=' + that.telephone, function (data) {
            console.info('data', data)
            if (data.exception == "") {
              that.phonePass = true
            } else {
              that.phonePass = false
              TipBoxService.open("您输入电话号码不存在", 2);
            }
          })
        }
      }

    },

    //获取验证码图片
    sendShortImg: function () {
      var that = this
      let baseUrl = HttpService.apiBaseUrl
      that.flImg = baseUrl + '/priviapi/login/authCode?abc=' + Math.random()
    },
    // 验证
    checkShortMsgImg: function () {
      var that = this
      if (this.imgmsg === '') {
        that.imgcheckPass = false
        that.isShopShort = true
      } else {
        HttpService.get('priviapi/login/validImgCode', 'param=' + that.imgmsg, function (data) {
          if (data.data === true) {
            that.isShopShort = false
            that.imgcheckPass = true
          } else {     
            that.imgcheckPass = false
            that.isShopShort = true
            TipBoxService.open("图形验证码错误！", 2);
            that.sendShortImg()
          }
        })
      }    
    },
    //发送短信验证码
    sendShort: function () {
      var that = this
      if (!that.isShopShort && that.phonePass) {
        clearTimeout(overtimeTimer)
        that.isShopShort = true
        var count = 60
        that.passMsg = false
        that.shortMsgText = '重新发送'
        that.countDown = "(" + count + "s)"
        countDownTimer = setInterval(function () {
          if (count > 0) {
            count--
            that.countDown = "(" + count + "s)"
          } else {
            that.isShopShort = false
            that.countDown = ''
            clearInterval(countDownTimer)
          }
        }, 1000)
        HttpService.get('priviapi/login/verifyCode', 'param=' + that.telephone, function (data) {
          that.trueShortMsg = data.data.code
          that.lockPhone = that.telephone
          overtimeTimer = setTimeout(function () {
            that.trueShortMsg = Math.random()
          }, 95000)
        }) 
      }
    },
    //注册
    sregisterpass: function () {
      if (this.telephone == '') {
        TipBoxService.open("手机号码不可为空！", 2)
        return false
      } else if (this.lockPhone === '') {
        TipBoxService.open("手机号码还未通过验证！", 2)
        return false
      } else if (this.lockPhone !== '' && this.telephone === this.lockPhone){
        if (this.shortMsgText !== '验证通过') {
          TipBoxService.open("手机号码还未通过验证！", 2)
          return false
        }
        if (this.imgcheckPass == false) {
          TipBoxService.open("图片验证码输入错误！", 2)
          return false
        }
      } else if (this.lockPhone !== '' && this.telephone !== this.lockPhone){
        TipBoxService.open('短信验证码超时或失效！', 2)
        this.shortMsgText = '发送短信验证码'
        return false
      }
      if (this.imgmsg == '') {
        TipBoxService.open("验证码不能为空！", 2)
        return false
      }
      if (this.password == '') {
        TipBoxService.open("请输入密码", 2)
        return false
      } else {
        if (this.password !== this.repassword) {
          TipBoxService.open("两次输入的密码不一致！", 2)
          return false
        }
      }
      if (this.pwdPass === false){
        TipBoxService.open("密码为6-20位，需包含字母与数字！", 2)
        return false
      }
      var param = {
        phone: this.telephone,
        password: this.password
      }
      //              'param='+JSON.stringify(param)
      HttpService.post('priviapi/login/saveAcountPwd','param='+JSON.stringify(param), function (data) {
        if (data.status == '200') {
          if (data.exception == '') {
            TipBoxService.open('密码修改成功', 0)

            setTimeout(function () {
              location.reload()
            }, 1500)
          } else {
            TipBoxService.open(data.exception, 2)
          }
        }
      })
    },
    checkShortMsg () {
      if (this.shortmsg !== '') {
        if (this.shortmsg == this.trueShortMsg) {
          clearInterval(countDownTimer)
          this.shortMsgText = '验证通过'
          this.countDown = ''
          this.passMsg = true
        }
      }
    },
    checkPassword() {
      var pwdReg = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,20}$/
      if (this.password !== '') {
        if (this.password !== this.repassword) {
          TipBoxService.open("两次输入的密码不一致！", 2)
        }
      }
      if (pwdReg.test(this.password) === false) {
        TipBoxService.open("密码为6-20位，需包含字母与数字！", 2)
        this.pwdPass = false
      } else {
        this.pwdPass = true
      }
    }
  }
}
</script>
<style src="../css/register.css" scoped></style>
<style>
.forPasscon .showPass {
  display: none;
}
.loginLeftContainer.clsszt1 .forPasscon .showPass, .loginLeftContainer.transitionFlag .forPasscon .showPass{
  display: block;
}
</style>

