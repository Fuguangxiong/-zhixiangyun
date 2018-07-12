<template>
	<div class="p-head">
		<div class="w1200 p-head-con">
			<ul class="loginMenu">
				<!--  <li class="login" @click='login' v-show='hasLogin'>请登录</li>
           <li class="register" v-show='hasLogin'>立即注册</li> -->
				<li class="mainTitle" @click='goPage(0)'>智享云首页</li>
				<li class="subhead" @click='goPage(1)'> <span class="line"></span><span class="shichang"> 应用市场</span></li>
			</ul>
			<ul class="rightMenu">
				<li class="console openplatform"  @click='goOpenPlatform()'> 开发者平台  <span class="line1"></span></li>
        <li class="console"  @click='goPersonal()'> 工作台  <span class="line1"></span></li>
				<li class="login" v-show='!loginFlag'><span class="loginbox" @click='goto(0)'>登录</span><span class="register" @click='goto(1)'>注册</span></li>		
				<li class="userSet" v-show='loginFlag' @click.stop='selectItem($event)'>{{userName |checkUserName}}
					<p  class="select1" :title="userNameTitle(userName)"></p>
					<ul v-show='isOpenUser'>
						<li v-for='item in userArr'>
							<a @click="toggle(item.menuUrl)">{{item.menuName}}</a>
						</li>
						<li>
							<a @click="loginOut">退出</a>
						</li>
					</ul>
				</li>
				<!-- <li :class='{select2:loginFlag}' class="userSet vipServer">
					<p @click.stop='selectItemVip($event)' >会员服务</p>
					<ul v-show='isOpenVip'>
						<li v-for='item in vipArr'>
							<a @click="toggle(item.menuUrl)">{{item.menuName}}</a>
						</li>
					</ul>
				</li> -->
				<!-- <li @click="applyJoin()">内部运营</li> -->
				<!-- <li @click="toggle('aiupload')">工作台</li> -->
				<!-- <li class="serverManagement">
                <p @click.stop='selectServerManage' class="select2">服务管理</p>
                 <ul class="lanmu" v-show='isOpenLanmu'>
                    <li><a href="#" >资源目录</a></li>
                    <li><a href="#" >智能上报</a></li>
                    <li><a href="#" >系统配置</a></li>
                </ul>
            </li> -->
			</ul>
		</div>
	</div>
</template>
<script>
import userService from '../publicJs/userService.js'
import appPublicJs from '../appMarket/common/public.js'
import publicPathConfig from '../publicJs/publicPathConfig.js'
import apiToken from '../publicJs/apiToken.js'
import apiClient from '../publicJs/ApiClient.js'
import UtilService from '../publicJs/UtilService.js'
import Util from '../publicJs/Util.js'
export default {
  name: 'topHeader',
  data () {
    return {
      // tokenId:null,
      // userName:'',
      loginFlag: false, // 是否登陆
      isOpenLanmu: false,
      isOpenUser: false,
      isOpenVip: false,
      userArr: [],
      vipArr: []
    }
  },
  props: {
    tokenId: String,
    userName: String
  },
  mounted () {
    this.isLogin()
  },
  filters: {
    checkUserName: function (value) {
      var length = value.length
      var mtel,
        strlen = 0,
        strnum
      if (
        length == 11 &&
        /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(14[0-9]{1})|)+\d{8})$/.test(
          value
        )
      ) {
        mtel = value.substr(0, 3) + '****' + value.substr(7)
      } else {
        for (var i = 0; i < value.length; i++) {
          if (value.charCodeAt(i) > 255) {
            strlen += 2
          } else {
            strlen++
          }
          if (strlen > 10) {
            strnum = i
            break
          }
        }
        strlen > 10 ? (mtel = value.substr(0, strnum) + '...') : (mtel = value)
      }
      return mtel
    }
  },
  methods: {
    getMenuList () {
      var that = this
      let myData = {}

      apiClient.get('pubapi/user/getPermittedSystem', myData, function (data) {
        console.log(data)
        for (let i = 0; i < data.results.length; i++) {
          const el = data.results[i]
          if (el.name === '智享云 - 企业管理平台') {
            that.userArr.push({menuName: '企业管理', menuUrl: publicPathConfig.COMPANY_OPERATION})
          } else if (el.name === '智享云 - 权限管理') {
            that.userArr.push({menuName: '权限管理', menuUrl: publicPathConfig.PLATFORM_AUTHORITY})
          } else if (el.name === '*') {
            that.userArr = [
              {menuName: '企业管理', menuUrl: publicPathConfig.COMPANY_OPERATION},
              {menuName: '权限管理', menuUrl: publicPathConfig.PLATFORM_AUTHORITY}
            ]
            break
          }
        }
      })
    },
    userNameTitle (value) {
      var length = value.length
      var mtel,
        strlen = 0
      if (
        length == 11 &&
        /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(14[0-9]{1})|)+\d{8})$/.test(
          value
        )
      ) {
        mtel = false
      } else {
        for (var i = 0; i < value.length; i++) {
          if (value.charCodeAt(i) > 255) {
            strlen += 2
          } else {
            strlen++
          }
        }
        strlen > 10 ? (mtel = value) : (mtel = false)
      }
      return mtel
    },
    loginOut () {
      apiClient.get('priviapi/login/signOut').then(data => {
        userService.clearUser()
        console.log('登出成功')
        window.location.href = publicPathConfig.PLATFORM_LOGOUT_URL
      }).catch(e => {
        console.error('退出失败')
      })
    },
    goPersonal () {
      if (this.loginFlag) {
        window.location.href = publicPathConfig.PERSONAL_CONSOLE
      } else {
        window.location.href = publicPathConfig.PLATFORM_LOGIN_URL
      }
    },
    goOpenPlatform () {
      window.location.href = publicPathConfig.OPENPLATFORM
    },
    goto (type) {
      if (type === 0) {
        window.location.href = publicPathConfig.PLATFORM_LOGIN_URL
      } else if (type === 1) {
        this.$router.push('/accountRegister')
      }
      // var path = window.location.href
      // path = UtilService.removeUrlItem(path, 'tokenId')
      // path = publicPathConfig.PLATFORM_LOGIN_URL + '?type=' + type + '&source=' + encodeURIComponent(path)
      // window.location = path
      // this.$router.push({path: '/register', query: {type: type, source: encodeURIComponent(path)}})
    },
    goPage (num) {
      if (num == 0) {
        window.location.href = appPublicJs.cloud
      } else if (num == 1) {
        console.log(publicPathConfig.APP_MARKET + '?tokenId=' + this.tokenId)
        window.location.href =
        publicPathConfig.APP_MARKET + '?tokenId=' + this.tokenId
        /*       this.$router.push({name:'appHome',query:{token:this.tokenId}}) */
      }
    },
    isLogin () {
      this.loginFlag = appPublicJs.checkLogin(this.tokenId)
      if (this.loginFlag) {
        this.getMenuList()
      }
    },
    login () {
      window.location.href = 'http://is-cloud.cn/platform/user?method=enterpriseLogin'
    },
    selectItem (a) {
      let that = this
      if (that.isOpenUser == false) {
        that.isOpenUser = true
        that.isOpenVip = false
      } else {
        that.isOpenUser = false
      }
      $(window).bind('click', function (e) {
        that.isOpenUser = false
        $(window).unbind('click')
      })
    },
    selectItemVip (a) {
      let that = this
      if (this.loginFlag) {
        if (that.isOpenVip == false) {
          that.isOpenUser = false
          that.isOpenVip = true
        } else {
          that.isOpenVip = false
        }
      } else {
        this.goto(0)
      }
      $(window).bind('click', function (e) {
        that.isOpenVip = false
        $(window).unbind('click')
      })
    },
    selectServerManage () {
      let that = this
      if (that.isOpenLanmu == false) {
        that.isOpenLanmu = true
      } else {
        that.isOpenLanmu = false
      }
      $(window).bind('click', function (e) {
        that.isOpenLanmu = false
        $(window).unbind('click')
      })
    },
    toggle (code) {
      this.isOpenLanmu = false
      if (code != '') {
        let url = code
        console.log(url)
        // window.open(url)
        window.location.href = url
      } else {
      }
    }
  }
}
</script>
<style scoped>
/*pop*/
.w1200 {
  padding: 0 5vw;
}

.select1 {
  background: url("../publicImages/selectHeader.png") right center no-repeat;
  width: 10px;
  height: 15px;
  margin-top: -21px;
}

.select2 {
  background: url("../publicImages/selectHeader.png") right center no-repeat;
}
/*头部*/
.rightMenu .console {
  width: 65px;
  position: relative;
}
.rightMenu .console:hover {
  /* background: url("../publicImages/consolered.png") 6px center no-repeat; */
  color: #0598ff;
}
.userSet p {
  text-align: center;
  max-width: 98px;
  min-width: 70px;
  padding-left: 18px;
  padding-right: 84px;
}
.rightMenu .userSet {
  width: auto;
  max-width: 98px;
  padding-left: 5px;
  /* background: url("../publicImages/persongray.png") left center no-repeat; */
}
.rightMenu .userSet:hover {
  color: #0598ff;
  /* background: url("../publicImages/personred.png") left center no-repeat; */
}
.p-head {
  background: #eeeeee;
  height: 30px;
  width: 100%;
  position: fixed;
  top: 0;
  z-index: 888;
}

.p-head-con {
  position: relative;
}

.loginMenu {
  float: left;
}

.loginMenu > li {
  float: left;
  line-height: 30px;
  height: 30px;
  font-size: 12px;
  color: #646464;
  cursor: pointer;
  padding-left: 25px;
}
.loginMenu > li:hover {
  color: #0598ff;
}
.lanmu li {
  float: none;
}

.lanmu li a {
  color: #646464;
}

/* .login {
  padding-left: 15px;
} */

.rightMenu {
  float: right;
}

.rightMenu > li {
  float: left;
  width: 98px;
  text-align: center;
  height: 30px;
  line-height: 30px;
  font-size: 12px;
  color: #646464;
  cursor: pointer;
  /* margin-left: 12px; */
}
.rightMenu > li .loginbox:hover {
  color: #0598ff;
}

.userSet > ul {
  background: #eeeeee;
  border-bottom-right-radius: 4px;
  border-bottom-left-radius: 4px;
  width: 100%;
}

.userSet > ul > li {
  height: 30px;
  max-width: 98px;
  line-height: 30px;
  text-align: center;
  border-top: 1px solid #e2e2e2;
}

.userSet > ul > li > a {
  color: #646464;
  text-decoration: none;
  width: 100%;
  height: 100%;
  display: inline-block;
}

.userSet > ul > li > a:hover {
  color: #0598ff;
}

.rightMenu .serverManagement {
  width: 98px;
  box-sizing: content-box;
}

.rightMenu .serverManagement p {
  text-align: center;
}

.serverManagement > ul {
  background: #fff;
  box-shadow: 0 0 5px rgba(28, 0, 18, 0.5);
}

.serverManagement > ul > li {
  height: 30px;
  width: 98px;
  line-height: 30px;
  text-align: center;
}

.serverManagement > ul > li > a {
  color: #333;
}

.serverManagement > ul > li > a:hover {
  color: #e60012;
}

.p-head-con .lanmu li {
  margin: 0;
  padding: 0;
}

.mainTitle {
  padding-left: 20px;
  background: url("../publicImages/zxy.png") 0 6px no-repeat;
}
.mainTitle:hover {
  background: url("../publicImages/bulelogo.png") 0 6px no-repeat;
}
.loginMenu .subhead {
  position: relative;
  padding-left: 15px;
  /* background: url("../publicImages/yysc.png") 0 6px no-repeat; */
}
.subhead:hover {
  /* padding-left: 20px; */
  /* background: url("../publicImages/yyHover.png") 0 6px no-repeat; */
}
.loginbox {
  padding-right: 9px;
}
.line {
  background: url("../publicImages/line.png") 0 center no-repeat;
  display: inline-block;
  height: 12px;
  width: 3px;
  margin-right: 15px;
  margin-top: 9px;
  position: absolute;
  padding-right: 20px;
}
.line1 {
  background: url("../publicImages/line.png") 0 center no-repeat;
  display: inline-block;
  height: 12px;
  width: 3px;
  margin-left: 15px;
  margin-top: 8px;
  margin-top: 9px;
  position: absolute;
}
.register {
  padding-left: 9px;
  background: url("../publicImages/line.png") 0 center no-repeat;
  color: #6bc2fa;
}
.register:hover {
  text-decoration: underline;
}
.select1:hover,
.userSet:hover p {
  color: #0598ff;
  background: url("../publicImages/bulexiala.png") right center no-repeat;
}
.shichang {
  margin-left: 15px;
}
.openplatform {
  margin-right: 10px;
}
</style>
