<template>
<div class="headerNav">
    <div class="headerNavMain">
        <div class="logoT">
           <div @click="APIList()" class="a_logo"><img  src="../../images/logos.png">  </div>
           <span class="logontitle" @click="APIList()">
               智享云开发者平台
            </span>
        </div>
        <ul class="navMain">
            <li><a href="javascript:;" @click="APIList()">API列表</a></li>
            <li><a href="javascript:;"  @click="sdkDownload()">SDK下载</a></li>
            <li><a href="javascript:;" @click="APIdocument()">文档</a></li>
        </ul>
        <!-- <div class="loginregistered">
            <ul class="ullr">
                <li class="borderR"><a href="javascript:;" @click="openPlatform()">控制台</a></li>
                <li class="username" v-show="loginFlag" @click.stop='showloginOut($event)'><i class="icon iconfont icon-guanliyuan"></i>{{userInfo}}
                   <ul v-show='isOpenUser' class="loginOut">
						<li>
							<a @click="loginOut()">退出</a>
						</li>
					</ul>
                 </li>
                <li  v-show="!loginFlag"  @click='goto(0)'><i class="icon iconfont icon-guanliyuan"></i> <span class="loginbutton"> 登录 </span></li>
            </ul>
        </div> -->

         <div class="loginregistered">
            <ul class="ullr">
                <li class="borderR"><a href="javascript:;" @click="openPlatform()">控制台</a></li>
                <li class="username" v-show="loginFlag" @click.stop='showloginOut($event)'>
                    <!-- <i class="icon iconfont icon-guanliyuan"></i>{{userInfo}}  -->
                      <div class="publicTopNavUserInfoImg">
                        <i class="publicTopNavUserImg publicTopNavUserImg1" v-if="!hasImage"></i>
                        <i class="publicTopNavUserImg publicTopNavUserImg1" v-if="hasImage" v-bind:style="{backgroundImage:'url(' + userimage + ')'}"></i>
                     </div>
                     <div class="userName">
                            {{userInfo}} 
                     </div>
                    <i class="arrow iconfont icon-xiangxiajiantou1" :class="{arrowUp:userInfoShow}"></i>
                        <ul v-show='isOpenUser' class="loginOut">
                            <li>
                                <div class="publicTopNavUserNameBox">
                                    <div class="publicTopNavUserInfoContainer">
                                    <div class="publicTopNavUserInfoImg">
                                        <i class="publicTopNavUserImg" v-if="!hasImage"></i>
                                        <i class="publicTopNavUserImg" v-if="hasImage" v-bind:style="{backgroundImage:'url(' + userimage + ')'}"></i>
                                    </div>
                                    <div class="publicTopNavUserInfoTextContainer">
                                        <div class="publicTopNavUserInfoTextLine">
                                        <span class="publicTopNavUserInfoText" >{{userInfo}}</span>
                                        <span class="publicTopNavUserInfoText level" :class="stateClass">{{userState}}</span>
                                        </div>
                                        <div class="publicTopNavUserInfoTextLine">
                                        <span class="publicTopNavUserInfoText">身份所属:</span>
                                         <span class="publicTopNavUserInfoText"  v-bind:title="identity" >
                                                {{(identity!="" && identity!=null && identity.length>10)?(identity.substring(0,10)+'...'):identity}}
                                        </span>
                                        <!-- <span class="publicTopNavUserInfoText detailMsg">{{identity}}</span> -->
                                        </div>
                                    </div>
                                    </div>
                                    <!-- <a @click="loginOut()">退出</a> -->
                                    <div class="publicTopNavUserExitContainer" v-on:click="loginOut">
                                        <i class="publicTopNavUserExitIcon"></i>
                                        <span class="publicTopNavUserExitText">退出当前账户</span>
                                    </div>
                                </div>
                            </li>
                        </ul>
                </li>
                <li class="loginLi" v-show="!loginFlag"  @click='goto(0)'><i class="icon iconfont icon-guanliyuan"></i> <span class="loginbutton"> 登录 </span></li>
            </ul>
        </div>

        
    </div>
</div>

</template>
<script>
import user from '../../../publicJs/userService'
import UserCookieService from '../../../publicJs/UserCookieService.js'
import userService from '../../../publicJs/userService.js'
import appPublicJs from '../../common/public.js'
import UtilService from '../../../publicJs/UtilService.js'
import publicPathConfig from '../../../publicJs/publicPathConfig.js'
import ApiClient from '../../../publicJs/ApiClient'
import TipBoxService from '../../../publicJs/TipBoxService'
export default {
  data () {
    return {
      userInfoShow: false,
      userInfo: '',
      tokenId: '',
      loginFlag: false,
      isOpenUser: false,
      authstatus: true,
      hasImage: '',
      userState: '',
      identity: '',
      stateClass: '',
       userimage: '',
    }
  },
  props: ['params'],
  created () {
    this.tokenId = this.$route.query.tokenId || userService.getTokenId()
    if (this.tokenId !== 'null' && this.tokenId !== null && this.tokenId !== undefined && this.tokenId !== '1c14f665aa8643c28f899aa9b0efee56') {
      this.loginFlag = appPublicJs.checkLogin(this.tokenId)
      var that = this
      UserCookieService.userInfoToCookie(that.tokenId, function (userName, images) {
        that.userInfo = userName
        that.userimage = images
      })
      that.getInfo()
    }
  },
  mounted () {
    this.initUser()
  },
  methods: {

    initUser () {
      var status = decodeURI(user.getInfo('state'))
      this.userInfo = user.getUsername()
      this.userimage = user.getUserImage()
      console.log('userInfo=========================', this.userInfo)
      console.log('userimage========================', this.userimage)
      this.identity = decodeURI(user.getInfo('identity')) || '个人'
      console.log('dasssssssssssssssssssssssssssss=========',decodeURI(user.getInfo('identity')))
      if (this.userimage != '' && this.userimage != undefined) {
        this.hasImage = true
      } else {
        this.hasImage = false
      }
      if (status == 'AUTHORIZED') {
        this.userState = '已认证'
        this.stateClass = 'has'
      } else if (status == 'AUTHORIZEDING') {
        this.userState = '认证中'
        this.stateClass = 'ing'
      } else if (status == 'UNAUTHORIZED') {
        this.userState = '未认证'
        this.stateClass = ''
      }
    },

    getInfo: function () { // 获取是否实名认证
      var that = this
      ApiClient.get('itsmApi/auth/findAuthenticationInfo').then(data => {
        // data.auth_status = 'UNAUTHORIZED'
        if (data.auth_kfz_status === 'UNAUTHORIZED') {
          that.authstatus = false
        }
      })
    },
    APIdocument: function () {
      this.$router.push({
        path: '/APIhelp',
        query: {}
      })
    },
    APIList: function () {
      if (this.$route.path === '/') {
        this.params.serviceName = ''
        this.params.keyWord = ''
        this.$emit('getList')
        console.log(this.params)
      } else {
        this.$router.push({
          path: '/',
          query: {}
        })
      }
    },
    openPlatform: function () {
      if (this.tokenId !== 'null' && this.tokenId !== null && this.tokenId !== undefined && this.tokenId !== '1c14f665aa8643c28f899aa9b0efee56') {
        if (this.authstatus === true) {
          this.$router.push({
            path: '/myAPI',
            query: {}
          })
        //   this.$parent.changeMyapp();
           this.$emit('changeMyapp');
        } else {
          this.$router.push({
            path: '/realNameCertification'
          })
        }
      } else {
        this.goto(0)
      }
    },
    sdkDownload: function () {
      this.$router.push({
        path: '/SDKdownload',
        query: {}
      })
    },
    goto: function (type) {
      var path = window.location.href
      path = UtilService.removeUrlItem(path, 'tokenId')
      // path = publicPathConfig.PLATFORM_LOGIN_URL + '?type=' + type + '&source=' + encodeURIComponent(path)
      // window.location = path
      this.$router.push({path: '/register', query: {type: type, source: encodeURIComponent(path)}})
    },

    showloginOut: function (a) {
      let that = this
      if (that.isOpenUser === false) {
        that.isOpenUser = true
      } else {
        that.isOpenUser = false
      }
      that.userInfoShow = !that.userInfoShow
      if (this.userInfoShow) {
        $(window).bind('click', function (e) {
            that.isOpenUser = false
            $(window).unbind('click')
        })
      }
    },

    loginOut: function () {
      userService.clearUser()
      window.location.href = publicPathConfig.OPENPLATFORM
    }

  }
}
</script>

<style>
    .icon-guanliyuan{
        color: #fff;
        font-size: 17px;
        margin-right: 5px;
    }
    a{
        text-decoration:none; 
    }
    a:hover{
        text-decoration:none; 
    }
    .headerNav{
        width: 100%;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        height: 66px;
        background:#1c2a53;
        /*opacity: 0.8;*/
        z-index: 999;
    }
    .headerNavMain{
        width: 94%;
        height: 60px;
        margin: 0 auto;
    }
    .logoT{
        display: inline-block;
        width: 230px;
        height: 60px;
        float: left;
    }
    .a_logo{
        float: left;
        margin-top: 15px;
    }
    .logontitle{
        font-size: 20px;
        color: #fff;
        line-height: 66px;
        text-align: center;
        display: inline-block;
        margin-left: 20px;
    }
    .logontitle:hover{
        cursor: pointer;
    }
    .navMain{
        width: auto;
        float: left;
        line-height: 66px;
        margin-left: 150px;
    }
    .navMain li{
        float: left;
        margin-right: 100px;
        font-size: 14px;
        color: #ffffff;
        /*font-weight: 600;*/
        cursor: pointer;
        border-bottom:1px solid transparent;
    }
    .navMain li a{
        color: #ffffff;
    }
    /* .navMain li:hover{
        border-color: #1b8bf9;
        color: #1b8bf9;
    } */
    .navMain li a:hover{
        color: #1b8bf9;
    }
    .navMain li.aclick{
        border-color: #1b8bf9;
        color: #1b8bf9;
    }
    .navMain li.aclick a{
        color: #1b8bf9;
    }

    .loginregistered{
        width: auto;
        float: right;
        height: 66px;
    }
    .ullr{
        height: 66px;
        width: auto;
        /* margin-top: 22px; */

    }
    .ullr li{
        float: left;
        padding: 0 15px;
        font-size: 14px;
        /* margin-top: 15%; */
    }
    .ullr li, .ullr li a {
        color: #ffffff;
    }
    .borderR{
        border-right: 1px solid #ffffff;
        margin-top: 22px
    }
    .borderR :hover{
        color: #1b8bf9;
    }
    /* .loginbutton:hover{
        cursor: pointer;
    } */

    .loginLi{
        margin-top: 15%;
    }
     .loginLi:hover{
        cursor: pointer;
        color: #1b8bf9;
    }


    .loginOut li{
        /* background: #1c2a53;
        border-bottom-right-radius: 4px;
        border-bottom-left-radius: 4px; */
        line-height: 30px;
        text-align: center;
        /* border-top: 1px solid #355dd1; */
        color: #ffffff;
        margin-top: 10px;
        width: 100%;
    }   
     /* .loginOut li:hover{
         cursor: pointer;
     } */
     /* .ullr li:hover{
         cursor: pointer;
     } */
     .loginOut li>a {
        text-decoration: none;
        width: 100%;
        height: 100%;
        display: inline-block;
     }
     .username{
        width: auto;
        margin-top: 14px;
     }
    .userName{
        min-width:100px;
        min-width: 100px;
        height: 44px;
        float: left;
        line-height: 44px;

    }

    .userName:hover{
        cursor: pointer;
    }

/* ========================== */


.arrow {
    position: absolute;
    top: 42%;
    right: 4%;
    font-size: 12px;
    transition: transform 0.3s;
}
.arrow:hover{
 cursor: pointer;
}
.arrow.arrowUp {
  transform: rotate(180deg);
}
.publicTopNavUserName > span:hover+.arrow {
  color: #55a8fd;
}
.publicTopNavUserInfoTextLine {
  padding: 2px 0;
}

.publicTopNavUserNameBox {
    position: absolute;
    width: 340px;
    height: 122px;
    box-shadow: 0 0 5px #ccc;
    right: 0;
    z-index: 2000;
    background-color: #fff;
    color:#000;
}
.publicTopNavUserInfoContainer {
    overflow: hidden;
    padding: 10px;
    border-bottom: 1px solid #ccc;
}



.publicTopNavUserInfoTextContainer {
    float: left;
    width: 260px;
    margin-left: 10px;
}

.detailMsg.publicTopNavUserInfoText {
    width: 200px;
    padding-left: 2px;
    text-align: left;
}

.publicTopNavUserInfoImg1{
    width: 35px;
    height: 35px;
    float: left;
}
.publicTopNavUserInfoImg .publicTopNavUserImg1 {
    width: 35px;
    height: 35px;
    margin-top: 3px
}
</style>
