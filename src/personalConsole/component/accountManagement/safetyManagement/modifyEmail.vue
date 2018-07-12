<template>
  <div class="maincontent">
    <breadcrumb :data="breadcrumb"></breadcrumb>
    <div class="content" v-show="modify">
      <div class="modify-title">
        <span>备用邮箱</span>
      </div>
      <div class="modify-section">
        <el-row><div class="modify-input">
          <el-col :span="7"><span class="title">邮箱：</span></el-col>
          <el-col :span="17"><span class="input">
            <input type="text" v-model="email" placeholder="请输入邮箱号码" @blur="checkEmail" :class="{'errorinput':errorMsg}" maxlength="50">
            <span class="error-info" v-show="errorMsg">！请输入格式正确的Email</span>
            <span class="error-info" v-show="errorSame">！新邮箱与原邮箱重复</span>
            <span class="tips">点击提交后，此邮箱号码将保存在个人基本资料中。</span>
          </span></el-col>
        </div></el-row>
        <el-row><div class="modify-input">
          <el-col :span="7"><span class="left-blank"></span></el-col>
          <el-col :span="17"><span class="input">
            <button type="button" class="btnBlue btn-one" @click="modifyEmail">提交</button>
            <button type="button" class="btnGray btn-two" @click="goback">取消</button>
          </span></el-col>
        </div></el-row>
      </div>
    </div>
    <div class="content result-content" v-show="modified">
      <div class="result">
        <div class="info">
          <span>
            <div>备用邮箱设置已完成！</div>
            <div class="icon">
              <img src="../../../images/submitsuccess.png" alt="">
            </div>
          </span>
          <span>新邮箱地址 {{this.emailSetted}}</span>
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
import ApiClient from '../../../../publicJs/ApiClient'
var countBack = ''
export default {
  name: 'modifyEmail',
  components: {
    'breadcrumb': breadCrumb
  },
  data () {
    return {
      breadcrumb: [{name: '账号管理', link: '/safetyManagement'}, {name: '安全管理', link: '/safetyManagement'}, {name: '修改邮箱', link: ''}],
      email: '',
      username: '',
      errorMsg: false,
      errorSame: false,
      checked: false,
      backCount: 3,
      modify: true, // 修改中
      modified: false, // 已修改
      emailCurrent: '',
      emailSetted: ''
    }
  },
  mounted () {
    this.emailCurrent = sessionStorage.getItem('email')
    this.username = sessionStorage.getItem('username')
  },
  methods: {
    checkEmail () {
      if (this.email === this.emailCurrent) {
        this.errorSame = true
        this.checked = false
        return false
      }
      let emailReg = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,5}$/
      if (emailReg.test(this.email) === false) {
        this.errorMsg = true
        this.checked = false
      } else {
        this.errorMsg = false
        this.checked = true
      }
    },
    modifyEmail () {
      var that = this
      that.checkEmail()
      if (that.checked === false) {
        return false
      }
      ApiClient.post('priviapi/account/updateEmail', {'name': that.username, 'email': that.email}).then(data => {
        if (data.data === true) {
          that.emailSetted = that.email
          that.modify = false
          that.modified = true
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
  .modify-input{
    width: 100%;
    display: inline-block;
    margin-bottom: 76px;
  }
  .modify-input .title{
    float: right;
    padding-right: 5px;
    font-size: 14px;
  }
  .modify-input .input{
    
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
  .modify-input .input .tips{
    display: block;
    color: #888;
  }
  .title::before {
    content: "*";
    color: #fa3753;
    margin-right: 5px;
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
    margin-top: 50px;
    text-align: center;
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
    height: 156px;
  }
</style>
