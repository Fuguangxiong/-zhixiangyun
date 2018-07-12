<template>
  <div id="forgetPassword">
    <div class="am-fp-top">
      <div class="am-fg-img" @click="goAppmarket"></div>
      <div class="am-fg-control">
        <span>已有账号，<em @click="goLogin">请登录</em><i class="iconfont icon-youjiantou"></i></span>
      </div>
    </div>
    <div class="am-title"></div>
    <div class="am-area-1" v-show="step1">
        <div class="am-area-progress">
          <div class="am-progress-info">
            <p class="am-p-1"></p>
          </div>
          <div class="am-area-name am-span-1">
            <span>填写账号</span><span>验证身份</span><span>设置新密码</span><span>完成</span>
          </div>
        </div>
        <div class="am-area-detail">
        <div class="am-area-box1">
          <el-row>
            <el-col :span="9"><div class="am-el-right"><span>账号：</span></div></el-col>
            <el-col :span="15"><div><input type="text" placeholder="用户名/手机号" class="am-input-1" v-model.trim="name" :class="{'am-error': accountError}" @blur="onCheckAccount">
              <div class="am-col-3">
                <img class="am-loading-img1" v-show="accountChecking" src="../../../publicImages/loading_check.gif">
                <span v-show="accountError"><img src="../../images/exclamatory-red.png"/>{{accountErrorText}}</span>
                <span v-show="passAccount"><img src="../../images/correct.png"></span>
              </div>
            </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="9"><div class="am-el-right"><span>验证码：</span></div></el-col>
            <el-col :span="15"><div><input type="text" class="am-input-2" v-model.trim="imgCode" :class="{'am-error': imgError}" @blur="onCheckCode"><img :src=imgSrc alt="" class="am-img-src" @click="getImgSrc">
              <img class="am-imgError" v-show="imgError" src="../../images/exclamatory-red.png"/><em v-show="imgError">{{imgErrorMsg}}</em>
              <img class="am-imgError" src="../../images/correct.png" v-show="imgCorrect" >
              <span @click="getImgSrc">换一张</span></div></el-col>
          </el-row>
        </div>
        </div>
        <button class="btnBlue btn" @click="OnToStep1">确定</button>
    </div>
    <div class="am-area-2" v-show="step2">
         <div class="am-area-progress">
           <div class="am-progress-info">
             <p class="am-p-2"></p>
           </div>
           <div class="am-area-name am-span-2">
             <span>填写账号</span><span>验证身份</span><span>设置新密码</span><span>完成</span>
           </div>
         </div>
         <div class="am-area-detail">
           <div class="am-area-box1">
           <el-row>
             <el-col :span="9"><div class="am-el-right"><span>身份验证方式：</span></div></el-col>
             <el-col :span="15"><myselect :val="selectName" :data="selectList" @change="onChangeSelect" :width="226"></myselect></el-col>
           </el-row>
           <el-row>
             <el-col :span="9"><div class="am-el-right1"><span>用户名：</span></div></el-col>
             <el-col :span="15"><div class="am-div-info">{{account}}</div></el-col>
           </el-row>
           <el-row>
             <el-col :span="9"><div class="am-el-right1"><span>手机号：</span></div></el-col>
             <el-col :span="15"><div class="am-div-info">{{phone}}</div></el-col>
           </el-row>
           <el-row>
             <el-col :span="9"><div class="am-el-right"><span>短信验证码：</span></div></el-col>
             <el-col :span="15"><div><input type="text" class="am-input-2" v-model="shortMsg" :class="{'am-error': shortMsgError}" @blur="OnConfirmMsg"><button class="am-msg-button btnBlue" @click="onButtonClick" :disabled="disabled" :class="buttonMsg !== '发送短信验证码'?'am-msg-default':''">{{buttonMsg}}</button>
               <div class="am-col-3">
                 <span v-show="shortMsgError"><img src="../../images/exclamatory-red.png"/>{{shortMsgTip}}</span>
               </div>
             </div></el-col>
           </el-row>
         </div>
         </div>
      <button class="btnBlue btn" @click="OnToStep2">确定</button>
    </div>
    <div class="am-area-3" v-show="step3">
         <div class="am-area-progress">
           <div class="am-progress-info">
             <p class="am-p-3"></p>
           </div>
           <div class="am-area-name am-span-3">
             <span>填写账号</span><span>验证身份</span><span>设置新密码</span><span>完成</span>
           </div>
         </div>
         <div class="am-area-detail">
           <div class="am-area-box1">
             <el-row>
               <el-col :span="9"><div class="am-el-right"><span>新密码：</span></div></el-col>
               <el-col :span="15"><div><input type="password" class="am-input-1" v-model.trim="newPassword" maxlength="20" @blur="onCheckPassword" :class="{'am-error': passwordError}">
                 <div class="am-col-3">
                 <span v-show="passwordError1"><img src="../../images/exclamatory-normal.png"/>英文数字组合，6-20字符</span>
                 <span v-show="passwordError"><img src="../../images/exclamatory-red.png"/>{{passwordErrorText}}</span>
                 <span v-show="passwordCorrert"><img src="../../images/correct.png"></span>
               </div>
               </div></el-col>
             </el-row>
             <el-row>
               <el-col :span="9"><div class="am-el-right"><span>确认密码：</span></div></el-col>
               <el-col :span="15"><div><input type="password" class="am-input-1" v-model.trim="comfirmPassword" :class="{'am-error': comfirmPasswordError}" @blur="onContrast">
                 <div class="am-col-3">
                   <span v-show="comfirmPasswordError"><img src="../../images/exclamatory-red.png"/>{{comfirmPasswordErrorText}}</span>
                 </div>
               </div></el-col>
             </el-row>
           </div>
         </div>
      <button class="btnBlue btn" @click="OnToStep3">确定</button>
    </div>
    <div class="am-area-4" v-show="step4">
         <div class="am-area-progress">
           <div class="am-progress-info">
             <p class="am-p-4"></p>
           </div>
           <div class="am-area-name am-span-4">
             <span>填写账号</span><span>验证身份</span><span>设置新密码</span><span>完成</span>
           </div>
         </div>
         <div class="am-area-detail">
           <div class="am-area-box11">
             <img src="../../images/duigou.png" alt="">新密码设置成功，请牢记新密码。  {{time}}s后返回<em @click="goLogin">登录页面</em>
         </div>
         </div>

    </div>
    <public-bottom-component></public-bottom-component>
  </div>
</template>
<script>
  import publicBottomComponent from '../../../publicComponent/publicBottomComponent.vue'
  import select from '../../../publicComponent/selectDown.vue'
  import TipBoxService from '../../../publicJs/TipBoxService'
  import ApiClient from '../../../publicJs/ApiClient.js'
  import path from '../../../publicJs/publicPathConfig.js'
export default {
    name: 'forgetPassword',
    data () {
      return {
        imgError: false,
        accountChecking: false,
        name: '',
        selectName: '',
        selectList: [{name: '已注册手机号'}, {name: '邮箱验证'}],
        imgSrc: '../../images/err.jpg',
        step1: true,
        step2: false,
        step3: false,
        step4: false,
        time: 3,
        buttonMsg: '发送短信验证码',
        count: 60,
        disabled: false,
        newPassword: '',
        comfirmPassword: '',
        passwordError: false,
        passwordErrorText: '',
        account: '',
        imgCode: '',
        userId: '',
        phone: '',
        passAccount: false,
        accountError: false,
        accountErrorText: '',
        comfirmPasswordError: false,
        comfirmPasswordErrorText: '',
        passwordCorrert: false,
        passwordError1: true,
        shortMsgError: false,
        shortMsg: '',
        imgCorrect: false,
        shortMsgTip: '',
        imgErrorMsg: ''
      }
    },
    components: {
      'publicBottomComponent': publicBottomComponent,
      'myselect': select
    },
    methods: {
      OnToStep1 () {
        this.selectName = '已注册手机号'
        if (this.name === '') {
          this.accountError = true
          this.accountErrorText = '账号不能为空'
          this.passAccount = false
          return
        }
        if (this.imgCode === '') {
          this.imgError = true
          this.imgCorrect = false
          this.passImgMsg = false
          this.imgErrorMsg = '验证码不能为空'
          return
        }
        this.onCheckCode()
        this.onCheckAccount()
        if (this.accountError === false && this.imgError === false) {
          this.step1 = false
          this.step2 = true
          this.step3 = false
          this.step4 = false
        }
      },
      OnToStep2 () {
        this.OnConfirmMsg()
        if (this.shortMsgError === true) {
          return
        }
        ApiClient.get('priviapi/login/password/validMsgCode', {
            // 手机验证码
          param: this.shortMsg,
          userId: this.userId
        }
        ).then(data => {
          if (data.data === true) {
            this.step1 = false
            this.step2 = false
            this.step3 = true
            this.step4 = false
          } else {
//            TipBoxService.open('短信验证码错误！', 2)
            this.shortMsgError = true
            this.shortMsgTip = '验证码错误或失效'
          }
        }).catch(e => {
          console.log(e)
        })
      },
      OnToStep3 () {
        let that = this
        let pwdReg = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,20}$/
        if (that.newPassword === '') {
          that.passwordError = true
          that.passwordError1 = false
          that.passwordErrorText = '新密码不可为空'
        } else if (that.newPassword === that.account) {
          that.passwordError = true
          that.passwordError1 = false
          that.passwordErrorText = '密码不可与用户名相同'
        } else if (!pwdReg.test(that.newPassword)) {
          that.passwordError = true
          that.passwordError1 = false
          that.passwordErrorText = '密码格式错误'
        } else {
          that.passwordCorrert = true
          that.passwordError = false
          that.passwordError1 = false
        }
        if (this.comfirmPassword === '') {
          this.comfirmPasswordError = true
          this.comfirmPasswordErrorText = '确认密码不能为空'
        } else {
          if (this.comfirmPassword !== this.newPassword) {
            this.comfirmPasswordError = true
            this.comfirmPasswordErrorText = '两次密码输入不一致'
          } else {
            this.comfirmPasswordError = false
            this.comfirmPasswordErrorText = ''
          }
        }
        if (this.passwordError === true || this.comfirmPasswordError === true) {
          return
        }
        ApiClient.post('priviapi/login/password/resetPassword' + '?userId=' +
        this.userId + '&password=' + this.newPassword
        ).then(data => {
          console.log(data.data, 'account')
          if (data.data === true) {
            TipBoxService.open('修改密码成功！', 0)
            this.step1 = false
            this.step2 = false
            this.step3 = false
            this.step4 = true
            var timer = setInterval(function () {
              that.time--
              if (that.time === 0) {
                that.goLogin()
                clearInterval(timer)
              }
            }, 1000)
          }
        }).catch(e => {
        })
      },
      onChangeSelect () {

      },
      goLogin () {
        window.location.href = path.PLATFORM_LOGIN_URL
      },
      goAppmarket () {
        window.location.href = path.APP_MARKET
      },
      onButtonClick () {
        ApiClient.get('priviapi/login/verifyCode', 'param=' + this.phone, function (data) {
          console.log(data, '验证码')
        })
        this.disabled = true
        this.buttonMsg = this.count + 's后重发'
        var that = this
        const Timer = setInterval(function () {
          that.count--
          that.buttonMsg = that.count + 's后重发'
		  if (that.count === 0) {
      clearInterval(Timer)
      that.count = 60
      that.disabled = false
      that.buttonMsg = '发送短信验证码'
		    }
        }, 1000)
        this.shortMsgError = false
      },
      onCheckPassword () {
        let that = this
        let pwdReg = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,20}$/
        if (that.newPassword === '') {
          that.passwordError = true
          that.passwordError1 = false
          that.passwordErrorText = '新密码不可为空'
        } else if (that.newPassword === that.account) {
          that.passwordError = true
          that.passwordError1 = false
          that.passwordErrorText = '密码不可与用户名相同'
        } else if (!pwdReg.test(that.newPassword)) {
          that.passwordError = true
          that.passwordError1 = false
          that.passwordErrorText = '密码格式错误'
        } else {
          that.passwordCorrert = true
          that.passwordError = false
          that.passwordError1 = false
        }
      },
      getImgSrc () {
        let baseUrl = ApiClient.apiBaseUrl
        this.imgSrc = baseUrl + '/priviapi/login/authCode?abc=' + Math.random()
      },
      onCheckAccount () {
        var that = this
        if (this.name === '') {
//          that.accountError = true
//          that.accountErrorText = '所填账号不能为空'
//          that.passAccount = false
//          that.accountChecking = false
          return
        }
        that.accountChecking = true
        ApiClient.get('priviapi/login/password/getUserByAccount', {
          account: this.name
        }).then(data => {
          that.accountChecking = false
          if (data.data === null) {
            that.accountError = true
            that.accountErrorText = '该账号不存在'
            that.passAccount = false
          } else {
            this.userId = data.data.id
            this.account = data.data.userName
            this.phone = data.data.phone
            that.accountChecking = false
            that.accountError = false
            that.passAccount = true
          }
        }).catch(err => {
          that.accountChecking = false
          console.error(err)
        })
      },
      onCheckCode () {
        let that = this
        that.passImgMsg = false
        if (this.imgCode === '') return
        ApiClient.get('priviapi/login/validImgCode', 'param=' + this.imgCode, function (data) {
          if (data.data === true) {
            that.imgError = false
            that.imgCorrect = true
            that.passImgMsg = true
          } else {
            that.imgError = true
            that.imgCorrect = false
            that.passImgMsg = false
            that.imgErrorMsg = '验证码错误'
            that.getImgSrc()
          }
        })
      },
      onContrast () {
        if (this.comfirmPassword === '') {
          this.comfirmPasswordError = true
          this.comfirmPasswordErrorText = '确认密码不能为空'
        } else {
          if (this.comfirmPassword !== this.newPassword) {
            this.comfirmPasswordError = true
            this.comfirmPasswordErrorText = '两次输入的密码不一致'
          } else {
            this.comfirmPasswordError = false
            this.comfirmPasswordErrorText = ''
          }
        }
      },
      OnConfirmMsg () {
        if (this.shortMsg === '') {
          this.shortMsgTip = '验证码不可为空'
          this.shortMsgError = true
        } else if (this.shortMsg !== '1111') {
          this.shortMsgError = true
          this.shortMsgTip = '验证码错误或失效'
        } else {
          this.shortMsgError = false
        }
      }
    },
    mounted () {
      this.getImgSrc()
    }
}
</script>
<style src="../../css/forgetPassword.css" scoped>

</style>
<style>

</style>
