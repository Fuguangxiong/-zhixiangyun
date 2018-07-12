<template>
  <div class="maincontent">
    <breadcrumb :data="breadcrumb"></breadcrumb>
    <div class="content" v-show="stepOne">
      <div class="modify-title">
        <span>修改手机</span>
      </div>
      <div class="modify-section">
        <el-row>
          <div class="modify-input">
            <el-col :span="7"><span class="title">原手机号：</span></el-col>
            <el-col :span="17"><span class="input">
              <input type="text" v-model="oldPhone" @blur="checkOldPhone" :class="{'errorinput':oldPhoneError}" maxlength="11">
              <span class="error-info" v-show="oldPhoneError">！原手机号未验证通过</span>
            </span></el-col>
          </div>
        </el-row>
        <el-row>
          <div class="modify-input short-input">
            <el-col :span="7"><span class="title">图形验证码：</span></el-col>
            <el-col :span="17"><span class="input">
              <input type="text" v-model="oldImgCheck" :class="{'errorinput':imgCheckError}" @blur="checkImg">
              <img :src="imgCheckUrl" title="看不清楚换一张" @click="getImgCheck()" class="check-img">
              <img src="../../../../publicImages/loading_check.gif" class="loading-img" v-show="isImgCheck">
              <span class="error-info" v-show="imgCheckError">！验证码错误</span>
            </span></el-col>
          </div>
        </el-row>
        <el-row>
          <div class="modify-input short-input">
            <el-col :span="7"><span class="title">手机验证码：</span></el-col>
            <el-col :span="17"><span class="input">
              <input type="text" v-model="oldMsgCheck" :class="{'errorinput':oldMsgError}" @blur="checkOldMsg">
              <button class="shortmsg-button" @click="sendMsg(oldPhone)" :class="{'stop-click':oldMsgStop||!imgSuccess||oldPhoneError}">{{oldMsgText}}</button>
              <span class="error-info" v-show="oldMsgError">！验证码错误或超时</span>
            </span></el-col>
          </div>
        </el-row>
        <el-row>
          <div class="modify-input">
            <el-col :span="7"><span class="left-blank"></span></el-col>
            <el-col :span="17"><span class="input">
              <button type="button" class="btnBlue btn-one" @click="toNextStep">下一步</button>
              <button type="button" class="btnGray btn-two" @click="goback">取消</button>
            </span></el-col>
          </div>
        </el-row>
      </div>
    </div>
    <div class="content" v-show="stepTwo">
      <div class="modify-title">
        <span>修改手机</span>
      </div>
      <div class="modify-section">
        <el-row><div class="modify-input">
          <el-col :span="7"><span class="title">新手机号：</span></el-col>
          <el-col :span="17"><span class="input">
            <input type="text" v-model="newPhone" @blur="checkNewPhone" :class="{'errorinput':newPhoneError||newPhoneError2}" maxlength="11">
            <span class="error-info" v-show="newPhoneError">！新手机号与原手机号一致</span>
            <span class="error-info" v-show="newPhoneError2">！请输入正确的手机格式</span>
            <span class="error-info" v-show="newPhoneError3">！当前手机号已注册</span>
          </span></el-col>
        </div></el-row>
        <el-row><div class="modify-input short-input">
          <el-col :span="7"><span class="title">手机验证码：</span></el-col>
          <el-col :span="17"><span class="input">
            <input type="text" v-model="newMsgCheck" :class="{'errorinput':newMsgError||newMsgError2}" @blur="checkNewMsg">
            <button class="shortmsg-button" @click="sendMsg(newPhone)" :class="{'stop-click':newMsgStop||newPhoneError||newPhoneError2||newPhoneError3}">{{newMsgText}}</button>
            <span class="error-info" v-show="newMsgError">！验证码错误</span>
            <span class="error-info" v-show="newMsgError2">！验证码失效或超时</span>
          </span></el-col>
        </div></el-row>
        <el-row><div class="modify-input">
          <el-col :span="7"><span class="left-blank"></span></el-col>
          <el-col :span="17"><span class="input">
            <button type="button" class="btnBlue btn-one" @click="toPrevStep">上一步</button>
            <button type="button" class="btnBlue btn-two" @click="submitPhone">提交</button>
          </span></el-col>
        </div></el-row>
      </div>
    </div>
    <div class="content result-content" v-show="SuccessPage">
      <div class="result">
        <div class="info">
          <span>
            <div>更换成功</div>
            <div class="icon">
              <img src="../../../images/submitsuccess.png" alt="">
            </div>
          </span>
          <span>新手机号 {{successPhone}}</span>
        </div>
        <div class="backinfo">
          <span title="点击返回" @click="goback">{{backCount}}秒后返回安全管理主页</span>
        </div>
      </div> 
    </div>
  </div>
</template>
<script>
import breadCrumb from '../../publicComponent/breadCrumb'
import HttpService from '../../../../publicJs/ApiClient'
var countBack = ''
var oldCountTimer = ''
var newCountTimer = ''
var overtimeTimer = ''
export default {
  name: 'modifyPhoneNumber',
  components: {
    'breadcrumb': breadCrumb
  },
  data () {
    return {
      breadcrumb: [{name: '账号管理', link: '/safetyManagement'}, {name: '安全管理', link: '/safetyManagement'}, {name: '修改手机', link: ''}],
      oldPhone: '',
      newPhone: '',
      username: '',
      oldPhoneConfirm: '',
      oldImgCheck: '', // 旧手机图片验证
      oldMsgCheck: '', // 旧手机短信验证
      newMsgCheck: '', // 新手机短信验证
      oldTrueMsg: '',
      newTrueMsg: '',
      successPhone: '',
      backCount: 3,
      stepOne: true, // 证旧手机页面
      stepTwo: false, // 验证新手机页面
      SuccessPage: false, // 成功页
      imgCheckUrl: '', // 图片验证码url
      oldMsgText: '获取验证码', // 旧手机验证码按钮文本
      oldMsgStop: false, // 旧手机验证码按钮禁用
      newMsgText: '获取验证码', // 新手机验证码按钮文本
      newMsgStop: true, // 新手机验证码按钮禁用
      oldPhoneError: false,
      newPhoneError: false,
      newPhoneError2: false,
      newPhoneError3: false,
      lockedPhone: '', // 验证通过手机记录
      stopCheckMsg: false, // 短信超时失效标记
      oldMsgError: false,
      newMsgError: false, // 新手机错误字段
      newMsgError2: false,
      passOldCheck: false, // 旧手机通过短信验证
      passNewCheck: false, // 新手机通过短信验证
      imgSuccess: false, // 通过图片验证
      imgCheckError: false, // 控制错误提示显示
      isImgCheck: false // 控制loadingImg显示
    }
  },
  mounted () {
    this.oldPhoneConfirm = sessionStorage.getItem('phone')
    this.username = sessionStorage.getItem('username')
    this.getImgCheck()
  },
  methods: {
    checkOldPhone () {
      this.oldPhoneError = false
      if (this.oldPhone !== this.oldPhoneConfirm) {
        this.oldPhoneError = true
      }
    },
    checkNewPhone () {
      let phoneReg = /^[1][3,4,5,7,8][0-9]{9}$/
      let that = this
      that.newMsgStop = true
      that.newPhoneError = false
      that.newPhoneError2 = false
      that.newPhoneError3 = false
      if (that.newPhone === that.oldPhoneConfirm) {
        that.newPhoneError = true
      } else if (phoneReg.test(that.newPhone) === false) {
        that.newPhoneError2 = true
      } else {
        HttpService.get('priviapi/accountpriv/checkPhone', {'phone': that.newPhone}, function (data) {
          if (data.status == '200') {
            if (data.data == true) {
              that.newPhoneError3 = true
            } else {
              that.newMsgStop = false
            }
          }
        })
      }
    },
    toNextStep () {
      this.checkOldPhone()
      this.checkOldMsg()
      if (this.passOldCheck) {
        this.stepOne = false
        this.stepTwo = true
      }
    },
    toPrevStep () {
      this.stepTwo = false
      this.stepOne = true
    },
    sendMsg (phone) {
      let that = this
      if (this.oldPhoneError) {
        return false
      } else if (!that.oldMsgStop && that.stepOne && that.imgSuccess) {
        that.stopCheckMsg = false
        clearTimeout(overtimeTimer)
        that.oldMsgStop = true
        let count = 60
        that.oldMsgText = '重新发送(' + count + 's)'
        oldCountTimer = setInterval(function () {
          if (count > 0) {
            count--
            that.oldMsgText = '重新发送(' + count + 's)'
          } else {
            that.oldMsgStop = false
            clearInterval(oldCountTimer)
            that.oldMsgText = '获取验证码'
          }
        }, 1000)
        /* HttpService.get('priviapi/login/verifyCode', 'param=' + that.oldPhone, function (data) {
          that.oldTrueMsg = data.data.code
          overtimeTimer = setTimeout(function () {
            that.oldTrueMsg = Math.random()
          }, 65000)
        }) */
        that.oldTrueMsg = 1111
      } else if (!that.newMsgStop && that.stepTwo) {
        clearTimeout(overtimeTimer)
        that.stopCheckMsg = false
        that.newMsgStop = true
        let count = 60
        that.newMsgText = '重新发送(' + count + 's)'
        that.stopCheckMsg = false
        newCountTimer = setInterval(function () {
          if (count > 0) {
            count--
            that.newMsgText = '重新发送(' + count + 's)'
          } else {
            that.newMsgStop = false
            clearInterval(newCountTimer)
            that.newMsgText = '获取验证码'
          }
        }, 1000)
        /* HttpService.get('priviapi/login/verifyCode', 'param=' + that.newPhone, function (data) {
          that.lockedPhone = that.newPhone
          that.newTrueMsg = data.data.code
          overtimeTimer = setTimeout(function () {
            that.stopCheckMsg = true
          }, 65000)
        }) */
        that.lockedPhone = that.newPhone
        that.newTrueMsg = 1111
      }
    },
    checkOldMsg () {
      this.oldMsgError = false
      if (this.oldTrueMsg !== '') {
        if (this.oldMsgCheck == this.oldTrueMsg) {
          this.passOldCheck = true
        } else {
          this.getImgCheck()
          this.oldMsgError = true
          this.passOldCheck = false
        }
      }
    },
    checkNewMsg () {
      this.newMsgError = false
      this.newMsgError2 = false
      if (this.newPhone !== this.lockedPhone || this.stopCheckMsg) {
        this.newMsgError2 = true
        this.passNewCheck = false
      } else if (this.newTrueMsg !== '') {
        if (this.newMsgCheck == this.newTrueMsg) {
          this.passNewCheck = true
        } else {
          this.newMsgError = true
          this.passNewCheck = false
        }
      }
    },
    checkImg () {
      if (this.oldImgCheck !== '') {
        let that = this
        that.isImgCheck = true
        HttpService.post('priviapi/login/validImgCode', 'param=' + this.oldImgCheck).then(data => {
          if (data.data === true) {
            that.isImgCheck = false
            that.imgSuccess = true
            that.imgCheckError = false
          } else {
            that.isImgCheck = false
            that.imgSuccess = false
            that.imgCheckError = true
            that.getImgCheck()
          }
        }).catch(e => {
          console.error(e)
        })
      }
    },
    getImgCheck () {
      var that = this
      that.imgCheckUrl = ''
      let baseUrl = HttpService.apiBaseUrl
      that.imgCheckUrl = baseUrl + '/priviapi/login/authCode?abc=' + Math.random()
    },
    submitPhone () {
      var that = this
      that.checkOldPhone()
      if (this.newPhoneError || that.newPhoneError2 || that.newPhoneError3 || !that.passNewCheck) {
        return false
      } else {
        HttpService.post('priviapi/account/updatePhone', {'name': that.username, 'phone': that.newPhone}).then(data => {
          if (data.data === true) {
            that.successPhone = that.newPhone.substring(0, 3) + '****' + that.newPhone.substring(7, 11)
            that.stepTwo = false
            that.SuccessPage = true
            countBack = setInterval(function () {
              if (that.backCount > 0) {
                that.backCount--
              } else {
                that.goback()
              }
            }, 1000)
        } else {
            console.log(data)
        }
        }).catch(e => {
          console.error(e)
        })
      }
      
    },
    goback () {
      clearInterval(countBack)
      this.$router.push('/safetyManagement')
    }
  }
}
</script>
<style lang="css" scoped>
  .content{
    padding: 0 100px;
    position: relative;
  }
  .error-info{
    margin-left: 10px;
    color: #fa3753;
    font-size: 12px;
    position: relative;
    top: -5px;
  }
  .modify-input .input .errorinput{
    border-color: #fa3753;
  }
  .modify-title{
    border-bottom: 1px solid #f1f1f1;
    padding: 5px;
    margin: 40px 0px 70px 0px;
  }
  .modify-title span{
    font-size: 16px;
    border-bottom: 2px solid #ff4500;
    padding: 5px 0px;
  }
  .title::before {
  content: "*";
  color: #fa3753;
  margin-right: 5px;
  }
  .modify-input{
    width: 100%;
    display: inline-block;
    margin-bottom: 25px;
  }
  .modify-input .title{
    float: right;
    padding-right: 5px;
    font-size: 14px;
  }
  .modify-input .input{
    position: relative;
  }
  .modify-input .input input{
    height: 30px;
    border: 1px solid #bfcbd9;
    border-radius: 6px;
    padding: 0 6px;
    -moz-outline-radius: 6px;
    position: relative;
    top: -6px;
    width: 320px;
    outline: none;
  }
  .modify-input .input input:focus{
    border: 1px solid #55a8fd;
    box-shadow: 0 0 2px #55a8fd;
  }
  .short-input .input input{
    width: 210px;
  }
  .short-input .check-img{
    position: relative;
    top: -8px;
    margin-left: 6px;
    width: 100px;
    height: 30px;
  }
  .short-input .loading-img{
    position: relative;
    top: -8px;
    left: 6px;
  }
  .shortmsg-button {
    height: 30px;
    margin-left: 6px;
    color: #fff;
    background-color: #55A7FD;
    outline: none;
    border-radius: 4px;
    border: none;
    position: relative;
    top: -7px;
    width: 100px;
  }
  .shortmsg-button.stop-click{
    background-color: #c1c1c1;
    cursor: text;
  }
  .icon{
    position: relative;
  }
  .info .icon img{
    width: 55px;
    height: 55px;
    position: absolute;
    top: -30px;
    left: -75px;
  }
  .backinfo{
    text-align: center;
    margin-top: 50px;
  }
  .backinfo span{
    cursor: pointer;
    color: #888;
    font-size: 12px;
    margin-left: -50px;
  }
  .backinfo span:hover{
    text-decoration: underline;
  }
  .result{
    margin: 70px 0 50px 0;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
  }
  .result .info span:first-child{
    font-size: 16px;
    height: 46px;
    line-height: 46px;
  }
  .result .info span:last-child{
    font-size: 12px;
    color: #8ebfff;
  }
  .redstar{
    color: #fa3753;
  }
  .btn-one{
    margin-left: 39px;
  }
  .btn-two{
    margin-left: 78px;
  }
  .left-blank{
    display: inline-block;
    width: 100%;
  }
  .result-content{
    height: 154px;
  }
</style>
