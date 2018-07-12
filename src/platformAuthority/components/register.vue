<template>
  <div class="container" id="login">
    <div class="loginBox ">
      <div class="loginLeftContainer" :class="{clsszt1:fpass,clsszt2:flag,clsszt3:ecnt,transitionFlag:transitionFlag}">
        <el-tabs v-model="activeName" class="logincon" @tab-click="getImg">
          <el-tab-pane label="用户登录" name="logins">
            <login-dm @flpass="animationReg" @flpassb="SuccessLsodg"></login-dm>
          </el-tab-pane>
          <el-tab-pane label="用户注册" name="second">
            <register-dm></register-dm>
          </el-tab-pane>
        </el-tabs>
        <div class="forPasscon">
          <forpasscon-dm @flpass="animationPass"></forpasscon-dm>
        </div>
        <div class="enterprise">
          <enterprise @flpass="SuccessLsodg" @flpassb="animationPass" :href="targetHref" :child-com="dataobj.datalist"></enterprise>
        </div>
      </div>
      <div class="loginRightContainer">
        <div class="cssCon">
          <i class="logoX"></i>
          <i class="logoY"></i>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import '../../publicCss/public.css'
import '../publicCss/public.css'
import '../css/register.css'
import HttpService from '../../publicJs/ApiClient'
import TipBoxService from '../../publicJs/TipBoxService'
import user from '../../publicJs/userService'
// 登陆组件
import commonLgin from '../components/CommonLogin.vue'
// 注册组件
import commonRegister from '../components/CommonRegister.vue'
import commonForPasscon from '../components/CommonForPasscon.vue'
import commonEnterprise from '../components/CommonEnterprise.vue'
import tool from '../publicJs/ToolService'
export default {
  name: 'register',
  data () {
    return {
      activeName: 'logins',
      fpass: false,
      flag: true,
      ecnt: false,
      dataList: [],
      dataobj: {
        datalist: []
      },
      targetHref: '',
      param: '',
      title: '',
      transitionFlag: false
    }
  },
  components: {
    'login-dm': commonLgin,
    'register-dm': commonRegister,
    'forpasscon-dm': commonForPasscon,
    'enterprise': commonEnterprise
  },
  created () {
    // var type = tool.getQueryString('type')
    var type = this.$route.query.type
    console.log('tyoe', type)
    if (type == 0) {
      this.activeName = 'logins'
    } else if (type == 1) {
      this.activeName = 'second'
    }
    this.title = document.title
    console.log(this.title)
    document.title = '用户登录'
    /* var path="http://192.168.38.164:8080/departManage.html?tokenId=dfdfffffffffffffffffffffff&id=fffffffffdddddddddddddddddtttttttt";
    var index=path.indexOf("tokenId=");
    var newPath=path.slice(0,index-1);
    console.info("idnex=",newPath); */
  },
  destroyed () {
    document.title = this.title
  },
  methods: {
    // 跳到找回U密码
    animationReg () {
      var that = this
      that.fpass = true
      that.flag = false
      that.ecnt = false
    },
    // 跳到登录
    animationPass () {
      var that = this
      that.fpass = false
      that.flag = true
      that.ecnt = false
      this.transitionFlag = true
      setTimeout(() => {
        this.transitionFlag = false
      }, 1000)
    },
    SuccessLsodg (href, enterpriseData) {
      var that = this
      console.info('成功')
      that.fpass = false
      that.flag = false
      that.ecnt = true
      this.targetHref = href
      that.dataobj.datalist = enterpriseData
      console.info('qiye', that.enterpriseData)

      that.userName = localStorage.username
    },
    getImg (tab) {
      if (tab.index === '1') {
        this.$children[0].$children[2].$children[0].sendShortImg()
      }
    }
  }

}
</script>
<style src="../css/register.css" scoped>

</style>
<style>
#login .el-tabs__nav {
  width: 100%;
  padding-left: 0;
}
#login .el-tabs__item {
  width: 50%;
  text-align: center;
}
#login .el-tabs__header {
  border-bottom: 1px solid #d1dbe5;
}
</style>
