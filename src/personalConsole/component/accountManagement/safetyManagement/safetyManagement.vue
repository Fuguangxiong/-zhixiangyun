<template>
<div class="maincontent">
  <breadcrumb :data="breadcrumb"></breadcrumb>
  <div class="content">
    <div class="userinfo">
      <div class="success-icon" v-show="authenticated">
        <i class="iconfont icon-xuanzhong"></i>
      </div>
      <div class="data-left">
        <span class="normal-info">用户名：{{userInfo.name}}</span>
        <span class="normal-info">手机号码：{{userInfo.phone}}</span>
        <span class="normal-info ent-name" :title="userInfo.identity">身份所属：{{userInfo.identity}}</span>
      </div>
      <div class="data-right" v-show="authenticated">
        <span v-show="authenticated"></span>
        <span class="identify-info" v-show="authenticated">真实姓名：{{userInfo.realName}}</span>
        <span class="identify-info" v-show="authenticated">身份证号：{{userInfo.idCard}}</span>
      </div>
      <div class="authenticated" v-show="authenticated">
        <img src="../../../images/renzheng.png">
      </div>
      <div class="unauthorized" v-show="authorizing">
        <span>您的账号正在实名认证中。</span>
      </div>
      <div class="unauthorized" v-show="unauthorized">
        <span>您的账号未实名认证。</span>
        <span class="setting" @click="goIndentify">立即认证</span>
      </div>
      <div class="unauthorized" v-show="authorFail">
        <span>您的账号实名认证未通过。</span>
        <span class="setting" @click="goReIndentify">重新申请</span>
      </div>
    </div>
    <el-row><div class="section">
      <el-col :span="2"><span>安全强度</span></el-col>
      <el-col :span="22"><span class="indent">
        <span class="outerbox">
          <span class="innerbox" :class="!emailSetted?'normal-level':'high-level'"></span>
        </span>
        <span class="level">弱</span>
        <span class="level" :class="{'active-level':!emailSetted}">中</span>
        <span class="level" :class="{'active-level':emailSetted}">强</span>
      </span></el-col>
    </div></el-row>
    <el-row><div class="section">
      <el-col :span="2"><span>登录密码</span></el-col>
      <el-col :span="16" class="indent"><span class="ellipsis">安全性高的密码可以使账号更安全,建议您使用字母数字组合,且长度超过6位的密码。</span></el-col>
      <el-col :span="1"><span>已设置</span></el-col>
      <el-col :span="5"><span><span class="modify-button" @click="goModifyPwd">修改</span></span></el-col>
    </div></el-row>
    <el-row><div class="section">
      <el-col :span="2"><span>绑定手机</span></el-col>
      <el-col :span="16" class="indent"><span>您已绑定了手机 {{userInfo.phone}}</span></el-col>
      <el-col :span="1"><span>已设置</span></el-col>
      <el-col :span="5"><span><span class="modify-button" @click="goModifyPhone">修改</span></span></el-col>
    </div></el-row>
    <el-row><div class="section">
      <el-col :span="2"><span>备用邮箱</span></el-col>
      <el-col :span="16" class="indent"><span>
        <span v-show='emailSetted'>您已绑定了邮箱 {{userInfo.email}}</span>
        <span v-show='!emailSetted'>填写邮箱信息，补全个人基本资料</span>
      </span></el-col>
      <el-col :span="1"><span><span v-show='emailSetted'>已设置</span><span v-show='!emailSetted' class="setting" @click="goModifyEmail">设置</span></span></el-col>
      <el-col :span="5"><span><span class="modify-button" @click="goModifyEmail">修改</span></span></el-col>
    </div></el-row>
  </div>
</div>
</template>
<script>
import breadCrumb from '../../publicComponent/breadCrumb'
import ApiClient from '../../../../publicJs/ApiClient'
import loadingBoxService from '../../../../publicJs/LoadingBoxService'
import tipBoxService from '../../../../publicJs/TipBoxService'
export default {
  name: 'safetyManagement',
  components: {
    'breadcrumb': breadCrumb
  },
  data () {
    return {
      breadcrumb: [{name: '账号管理', link: '/safetyManagement'}, {name: '安全管理', link: ''}],
      userInfo: {
        name: '',
        phone: '',
        password: '',
        realName: '',
        idCard: '',
        email: '',
        authStatus: '', // 认证状态
        identity: '' // 身份所属
      },
      authenticated: false, // 已认证
      authorizing: false, // 认证中
      unauthorized: true, // 未认证
      authorFail: false,
      emailSetted: false
    }
  },
  mounted () {
    let that = this
    this.$parent.setActive('账号管理', '安全管理')
    loadingBoxService.open('请稍候...')
    ApiClient.get('pubapi/token/getUserByToken').then(data => {
      console.log('data', data)
      loadingBoxService.close()
      this.userInfo.name = data.userInfo.USERNAME
      sessionStorage.setItem('username', data.userInfo.USERNAME)
      this.userInfo.phone = data.userInfo.PHONE.substring(0, 3) + '****' + data.userInfo.PHONE.substring(7, 11)
      sessionStorage.setItem('phone', data.userInfo.PHONE)
      if (data.userInfo.TRUE_NAME !== '' && data.userInfo.TRUE_NAME !== undefined) {
        this.userInfo.realName = '*' + data.userInfo.TRUE_NAME.substring(1)
      }
      if (data.userInfo.ID_CARD !== '' && data.userInfo.ID_CARD !== undefined) {
        this.userInfo.idCard = data.userInfo.ID_CARD.substring(0, 4) + '**********' + data.userInfo.ID_CARD.substring(14, 18)
      }
      if (data.userInfo.LOGIN_TYPE === 'PERSONAL') {
        this.userInfo.identity = '个人'
        sessionStorage.setItem('enterpriseId', '')
        sessionStorage.setItem('enterpriseName', '')
      } else {
        this.userInfo.identity = data.userInfo.ENTERPRISE_NAME
        sessionStorage.setItem('enterpriseId', data.userInfo.ENTERPRISE_ID)
        sessionStorage.setItem('enterpriseName', data.userInfo.ENTERPRISE_NAME)
      }
      sessionStorage.setItem('logintype', data.userInfo.LOGIN_TYPE)
      if (data.userInfo.AUTH_STATUS === 'AUTHORIZED') {
        this.authenticated = true
        this.authorizing = false
        this.unauthorized = false
        this.authorFail = false
      } else if (data.userInfo.AUTH_STATUS === ('UNAUTHORIZED')) {
        this.authenticated = false
        this.authorizing = false
        this.unauthorized = true
        this.authorFail = false
      } else if (data.userInfo.AUTH_STATUS === 'AUTHORIZE_FAILED') {
        this.authenticated = false
        this.authorizing = false
        this.unauthorized = false
        this.authorFail = true
      } else if (data.userInfo.AUTH_STATUS === 'AUTHORIZING') {
        this.authenticated = false
        this.authorizing = true
        this.unauthorized = false
        this.authorFail = false
      }
      if (data.userInfo.EMAIL === '') {
        this.emailSetted = false
        this.userInfo.email = ''
      } else {
        this.emailSetted = true
        this.userInfo.email = data.userInfo.EMAIL
        sessionStorage.setItem('email', that.userInfo.email)
      }
    }).catch(e => {
      tipBoxService.open('加载失败', 2, 2)
    })
  },
  methods: {
    goModifyPwd () {
      this.$router.push('/modifyPassword')
    },
    goModifyPhone () {
      this.$router.push('/modifyPhoneNumber')
    },
    goModifyEmail () {
      this.$router.push('/modifyEmail')
    },
    goIndentify () {
      this.$router.push('./realNameCertification')
    },
    goReIndentify () {
      this.$router.push('./ReApplyrealNameCertification')
    }
  }
}
</script>
<style lang="css" scoped>
</style>
<style scoped>
.userinfo {
  display: flex;
  padding: 20px 0 10px 30px;
  border-bottom: 1px solid #f1f1f1;
  height: 120px;
}
.success-icon {
  flex: 2;
  display: flex;
  align-items: center;
  margin-right: 10px;
}
.success-icon i {
  font-size: 50px;
  color: #1bc001;
}
.data-left {
  flex: 4;
}
.data-left > span {
  height: 27px;
  display: block;
}
.data-right {
  flex: 5;
  z-index: 3;
  margin-left: 30px;
}
.data-right > span {
  height: 27px;
  display: block;
}
.authenticated {
  flex: 10;
  position: relative;
}
.authenticated img {
  position: absolute;
  top: 25px;
  left: -120px;
  z-index: 1;
}
.unauthorized {
  flex: 10;
  padding-top: 54px;
}
.section {
  height: 50px;
  border-bottom: 1px dashed #f1f1f1;
  line-height: 50px;
  padding-left: 30px;
}
.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.outerbox {
  height: 10px;
  border-radius: 5px;
  background-color: #f4f4f4;
  width: 25%;
  display: inline-block;
  position: relative;
  margin-right: 30px;
}
.innerbox {
  height: 10px;
  border-radius: 5px;
  display: inline-block;
  position: absolute;
  top: 0;
  left: 0;
}
.level {
  padding: 0 6px;
}
.active-level {
  color: #ff6600;
}
.normal-level {
  background-color: #ff6600;
  width: 70%;
}
.high-level {
  background-color: #1bc001;
  width: 100%;
}
.modify-button {
  color: #8ebfff;
  cursor: pointer;
  padding: 8px 4px;
}
.modify-button:hover {
  text-decoration: underline;
}
.setting {
  color: #fa3753;
  cursor: pointer;
  padding: 8px 0px;
}
.setting:hover {
  text-decoration: underline;
}
.ent-name {
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 310px;
}
.indent {
  padding-left: 6px;
}
</style>
