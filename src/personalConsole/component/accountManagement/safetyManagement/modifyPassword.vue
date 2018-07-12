<template>
  <div class="maincontent">
    <breadcrumb :data="breadcrumb"></breadcrumb>
    <div class="content" v-show="modify">
      <div class="modify-title">
        <span>修改密码</span>
      </div>
      <div class="modify-section">
        <el-row>
          <div class="modify-input">
            <el-col :span="7"><span class="title">原密码：</span></el-col>
            <el-col :span="17"><span class="input">
              <input type="password" v-model="oldPwd" placeholder="请输入原密码" :class="{'errorinput':blankPwd||OldPwdError}" @blur="oldPassword">
              <span class="error-info" v-show="blankPwd">！此处不可为空</span>
              <span class="error-info" v-show="OldPwdError">！原密码错误</span>
            </span></el-col>
          </div>
        </el-row>
        <el-row>
          <div class="modify-input">
            <el-col :span="7"><span class="title">新密码：</span></el-col>
            <el-col :span="17"><span class="input">
              <input type="password" v-model="newPwd" placeholder="请输入新密码" :class="{'errorinput':errorPwd}" @blur="newPassword" @focus="pwdTips">
              <span class="error-info" v-show="errorPwd">{{pwdErrorText}}</span>
              <span class="password-tips" v-show="tipsShow">
                <ul>
                  <li>长度为6-20个字符</li>
                  <li>支持数字和大小写字母</li>
                  <li>不允许有空格或特殊字符</li>
                </ul>
              </span>
            </span></el-col>
          </div>
        </el-row>
        <el-row>  
          <div class="modify-input last-input">
            <el-col :span="7"><span class="title">确认新密码：</span></el-col>
            <el-col :span="17"><span class="input">
              <input type="password" v-model="confirmPwd" placeholder="请再次输入新密码" :class="{'errorinput':confirmError||blankConfirmPwd}" @blur="confirmPassword">
              <span class="error-info" v-show="confirmError">！密码输入不一致</span>
              <span class="error-info" v-show="blankConfirmPwd">！此处不可为空</span>
            </span></el-col>
          </div>
        </el-row>  
          <div class="modify-input">
            <el-col :span="7"><span class="left-blank"></span></el-col>
            <el-col :span="17"><span class="input">
              <button type="button" class="btnBlue btn-one" @click="modifyPwd">确定</button>
              <button type="button" class="btnGray btn-two" @click="goback">取消</button>
            </span></el-col>
          </div>
        <div class="modify-tips">
          <p>温馨提示：</p>
          <p>为了保护您账号的安全，请不要将密码设定与其他网站（如：论坛、邮箱、聊天工具等）相同的密码</p>
        </div>
      </div>
    </div>
    <div class="content result-content" v-show="modified">
      <div class="result">
        <div class="info">
          <span>
            <div class="success-info">修改成功，请牢记新密码！</div>
            <div class="icon">
              <img src="../../../images/submitsuccess.png" alt="">
            </div>
          </span>
        </div>
        <div class="backinfo">
          <span title="点击返回" @click="goLogin">{{backCount}}秒后返回登录页</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import userService from '../../../../publicJs/userService.js'
import breadCrumb from '../../publicComponent/breadCrumb'
import ApiClient from '../../../../publicJs/ApiClient'
import path from '../../../../publicJs/publicPathConfig'
var countBack = ''
export default {
  name: 'modifyPassword',
  components: {
    'breadcrumb': breadCrumb
  },
  data () {
    return {
      breadcrumb: [{name: '账号管理', link: '/safetyManagement'}, {name: '安全管理', link: '/safetyManagement'}, {name: '修改密码', link: ''}],
      oldPwd: '',
      newPwd: '',
      username: '',
      confirmPwd: '',
      backCount: 3,
      modify: true, // 认证中
      modified: false, // 已认证
      confirmError: false, // 重复校验
      OldPwdError: false, // 原密码错误
      errorPwd: false, // 密码不合规
      blankPwd: false, // 原密码为空
      blankConfirmPwd: false, // 确认密码空
      tipsShow: false, // 密码提示
      pwdErrorText: '' // 新密码错误提示文本
    }
  },
  mounted () {
    this.username = sessionStorage.getItem('username')
  },
  methods: {
    modifyPwd () { // 提交
      var that = this
      that.oldPassword()
      that.newPassword()
      that.confirmPassword()
      if (that.confirmError || that.errorPwd || that.blankPwd || that.blankConfirmPwd) {
        return false
      }
      ApiClient.post('priviapi/account/updatePwd', {'name': that.username, 'password': that.oldPwd, 'newPassword': that.newPwd}).then(data => {
        console.log(data)
        if (data.data === true) {
          that.modify = false
          that.modified = true
          countBack = setInterval(function () {
            if (that.backCount > 0) {
              that.backCount--
            } else {
              that.goLogin()
            }
          }, 1000)
        }
      }).catch(e => {
        console.log(e)
        this.OldPwdError = true
      })
    },
    pwdTips () { // 密码输入提示
      this.errorPwd = false
      this.tipsShow = true
    },
    oldPassword () { // 校验旧密码空
      this.blankPwd = false
      this.OldPwdError = false
      if (this.oldPwd === '') {
        this.blankPwd = true
      }
    },
    newPassword () { // 校验新密码格式
      this.tipsShow = false
      this.errorPwd = false
      let pwdReg = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,20}$/
      if (this.newPwd === '') {
        this.errorPwd = true
        this.pwdErrorText = '！此处不可为空'
      } else if (this.newPwd === this.username) {
        this.errorPwd = true
        this.pwdErrorText = '！密码不可与用户名相同'
      } else if (this.newPwd.length > 20 || this.newPwd.length < 6) {
        this.errorPwd = true
        this.pwdErrorText = '！密码长度为6-20位'
      } else if (pwdReg.test(this.newPwd) === false) {
        this.errorPwd = true
        this.pwdErrorText = '！密码需同时包含字母与数字'
      } else if (this.newPwd === this.oldPwd) {
        this.errorPwd = true
        this.pwdErrorText = '！新密码不可与原密码一致'
      }
    },
    confirmPassword () { // 验证两次输入一致
      var that = this
      that.confirmError = false
      that.blankConfirmPwd = false
      if (that.confirmPwd === '') {
        that.blankConfirmPwd = true
      } else if (that.confirmPwd !== that.newPwd) {
        that.confirmError = true
      }
    },
    goback () {
      this.$router.push('/safetyManagement')
    },
    goLogin () {
      clearInterval(countBack)
      // var curPath = window.location.href
      ApiClient.get('priviapi/login/signOut').then(data => {
        userService.clearUser()
        console.log('登出成功')
        window.location.href = path.PLATFORM_LOGOUT_URL
      }).catch(e => {
        console.error('退出失败')
      })
      // console.log(path.PLATFORM_LOGIN_URL)   
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
  .modify-input{
    width: 100%;
    display: inline-block;
    margin-bottom: 25px;
  }
  .modify-input.last-input{
    margin-bottom: 60px;
  }
  .modify-input .title{
    float: right;
    padding-right: 5px;
    font-size: 14px;
  }
  .title::before {
    content: "*";
    color: #fa3753;
    margin-right: 5px;
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
  .modify-input .input input::-webkit-input-placeholder {
  color: #ACACAC;
  }
  .modify-input .input input:-moz-placeholder {
    color: #ACACAC;
  }
  .modify-input .input input::-moz-placeholder {
    color: #ACACAC;
  }
  .modify-input .input input:-ms-input-placeholder {
    color: #ACACAC;
  }
  .password-tips {
    background-color: #f8f8f8;
    display: inline-block;
    width: 170px;
    padding: 5px 0 5px 24px;
    position: absolute;
    border-radius: 6px;
    top: -22px;
    left: 328px;
  }
  .password-tips ul{
    list-style-type: circle;
    color: #888;
    width: 150px;
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
  .success-info{
    position: relative;
    top: 18px;
  }
  .modify-tips {
    margin-left: 20%;
    margin-top: 50px;
    line-height: 20px;
  }
  .modify-tips p:first-of-type{
    color: #666;
  }
  .modify-tips p:last-of-type{
    color: #888;
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
    height: 110px;
  }
</style>
