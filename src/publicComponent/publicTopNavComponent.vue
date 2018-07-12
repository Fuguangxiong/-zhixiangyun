<template>
  <div class="publicTopNavComponent">
    <div class="publicTopNavLeftContainer">
      <div class="publicTopNavModularTitle" v-on:click="gotoModularPage">
        <i class="publicTopNavModularTitleIcon"></i>
        <span class="publicTopNavModularTitleText">{{modularName.name}}</span>
      </div>
      <div class="publicTopNavTitle" v-if="!special">
        <i class="publicTopNavTitleImage"></i>
        <span class="publicTopNavTitleText">产品与服务</span>
        <div class="publicTopNavHideBox">
          <div class="publicTopNavHideBoxContent">
            <div v-for="(item,index) in navData" class="publicTopNavHideBoxItemContainer">
              <div class="publicTopNavHideBoxItemTitle">{{item.title}}</div>
              <div v-for="(val,index2) in item.list" class="publicTopNavHideBoxItem" v-on:click="listItemClick(val)">{{val.name}}</div>
            </div>
          </div>
          <div class="publicTopNavHideBoxToMarketContainer">
            <span class="publicTopNavHideBoxToMarketBtn" v-on:click="gotoAppMarketHandler">前往应用商场</span>
          </div>
        </div>
      </div>
    </div>
    <!--<div class="publicTopNavSearchContainer" v-bind:class="{show:inputShow}" v-on:mouseenter="searchOverHandler" v-on:mouseleave="searchLeaveHandler">
            <i class="publicTopNavSearchImg" v-on:click="searchClickHandler()"></i>
            <div class="publicTopNavSearchDiv">
                <input class="publicTopNavSearchInput" v-model="searchWord"/>
                <i class="publicTopNavSearchDelet" v-on:click="deletWordHandler"></i>
            </div>
        </div>-->
    <div class="publicTopNavUserContainer">
      <!--<div class="publicTopNavHelpContainer">
        <span class="publicTopNavHelpText" v-on:click.stop="openHelpMenuHandler">服务与帮助</span>
        <transition name="menushow">
          <div class="publicTopNavHelpSecondContainer" v-show="helpMenuShow">
            <div v-for="item in helpSecondList" class="publicTopNavHelpSecondItem" v-on:click="helpClickHandler(item.path)">{{item.name}}</div>
          </div>
        </transition>
      </div>-->
      <!--<span class="publicTopNavMsg" v-on:click="msgClickHandler">
        <span class="publicTopNavMsgTitle">消息</span>
        <span class="publicTopNavMsgTip" v-if="showMsg"></span>
      </span>-->
      <span class="publicTopNavDivision"></span>
      <i class="publicTopNavUserImg" v-if="!hasImage"></i>
      <i class="publicTopNavUserImg" v-if="hasImage" v-bind:style="{backgroundImage:'url(' + userimage + ')'}"></i>
        <div class="publicTopNavUserName" v-on:click.stop="usernameClickHandler">
        <span>{{username}}</span>
        <i class="arrow iconfont icon-xiangxiajiantou1" :class="{arrowUp:userInfoShow}"></i>
        <transition name="menushow">
          <div class="publicTopNavUserNameBox" v-if="userInfoShow">
            <div class="publicTopNavUserInfoContainer">
              <div class="publicTopNavUserInfoImg">
                <i class="publicTopNavUserImg" v-if="!hasImage"></i>
                <i class="publicTopNavUserImg" v-if="hasImage" v-bind:style="{backgroundImage:'url(' + userimage + ')'}"></i>
              </div>
              <div class="publicTopNavUserInfoTextContainer">
                <div class="publicTopNavUserInfoTextLine">
                  <span class="publicTopNavUserInfoText">{{username}}</span>
                  <span class="publicTopNavUserInfoText level" :class="stateClass">{{userState}}</span>
                </div>
                <div class="publicTopNavUserInfoTextLine">
                  <span class="publicTopNavUserInfoText">身份所属:</span>
                  <span class="publicTopNavUserInfoText detailMsg">{{identity}}</span>
                </div>
              </div>
            </div>
            <div class="publicTopNavUserMenuContainer">
              <div class="publicTopNavUserMenu">
                <div v-if="verifyPermission('007001')" class="publicTopNavUserMenuItem safe" v-on:click="userMenuClickHandler('safe')">安全管理</div>
                <div v-if="verifyPermission('007002')" class="publicTopNavUserMenuItem data" v-on:click="userMenuClickHandler('data')">基本资料</div>
                <div v-if="verifyPermission('007003')" class="publicTopNavUserMenuItem real" v-on:click="userMenuClickHandler('real')">实名认证</div>
                <div v-if="!hideMenu && verifyPermission('007004')" class="publicTopNavUserMenuItem create" v-on:click="userMenuClickHandler('create')">创建企业</div>
                <div v-if="!hideMenu && verifyPermission('007005')" class="publicTopNavUserMenuItem join"  v-on:click="userMenuClickHandler('join')">加入企业</div>
                <div v-if="!hideMenu && verifyPermission('007006')" class="publicTopNavUserMenuItem identity"  v-on:click="userMenuClickHandler('identity')">身份管理</div>
              </div>
            </div>
            <div class="publicTopNavUserExitContainer" v-on:click="exitHandler">
              <i class="publicTopNavUserExitIcon"></i>
              <span class="publicTopNavUserExitText">退出当前账户</span>
            </div>
          </div>
        </transition>
      </div>
      <!--  <i class="publicTopNavUserHelpIcon" title="帮助"></i>
           <i class="publicTopNavUserSetIcon" title="设置"></i> -->
      <!--<i class="publicTopNavUserExitIcon" title="退出" v-on:click="exitHandler"></i>-->
    </div>
  </div>
</template>
<script>
import user from '../publicJs/userService'
import tip from '../publicJs/NoticeBoxService'
import pathConfig from '../publicJs/publicPathConfig'
import ApiClient from '../publicJs/ApiClient'
import $ from 'jquery'
export default {
  data: function () {
    return {
      searchWord: '',
      username: '',
      userimage: '',
      hasImage: '',
      inputShow: '',
      helpMenuShow: false,
      userInfoShow: false,
      userState: '',
      identity: '',
      stateClass: '',
      showMsg: false,
      helpSecondList: [
        { name: '入门指南', path: 'intro' },
        { name: '产品文档', path: 'product' },
        { name: '常见问题', path: 'problem' }
      ]
    }
  },
  props: {
    navData: {},
    userchange: {},
    modularName: {},
    hasmsg: {},
    special: {},
    hideMenu: {}
  },
  watch: {
    userchange (val, oldVal) {
      console.info('userchange')
      this.initUser()
    },
    hasmsg (val, oldVal) {
      this.showMsg = true
    }
  },
  mounted () {
    this.initUser()
    /* var that = this
    HttpService.get('/pubapi/token/getUserByToken', {}, function (data) {
      that.username = data.results.userInfo.USERNAME
      that.userimage =
        HttpService.apiBaseUrl +
        '/pcapi/enterprise/pcShowImage/avatar?imgPath=' +
        data.results.userInfo.IMAGE +
        '&token=' +
        HttpService.token
      if (that.userimage != '' && that.userimage != undefined) {
        that.hasImage = true
      } else {
        that.hasImage = false
      }
      that.identity = data.results.userInfo.ENTERPRISE_NAME || '个人'
      var status = data.results.userInfo.AUTH_STATUS
      if (status == 'AUTHORIZED') {
        that.userState = '已认证'
        that.stateClass = 'has'
      } else if (status == 'AUTHORIZEDING') {
        that.userState = '认证中'
        that.stateClass = 'ing'
      } else if (status == 'UNAUTHORIZED') {
        that.userState = '未认证'
        that.stateClass = ''
      }
    }) */
  },
  methods: {
    listItemClick (item) {
      window.location.href = item.link
    },
    initUser () {
      var status = decodeURI(user.getInfo('state'))
      this.username = user.getUsername()
      this.userimage = user.getUserImage()
      this.identity = decodeURI(user.getInfo('identity')) || '个人'
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
    searchClickHandler () {
      this.$emit('headerSearch', this.searchWord)
    },
    deletWordHandler () {
      this.searchWord = ''
    },
    gotoAppMarketHandler () {
      window.location.href = pathConfig.APP_MARKET
    },
    exitHandler () {
      if (!this.special) {
        tip.open(
          '您确定要退出登录吗？',
          function () {
            var herf = pathConfig.PLATFORM_LOGOUT_URL
            if (user.getInfo('logintype') === 'PLATFORM') {
              herf = pathConfig.INTERNAL_OPERATION
            }
            user.deleInfo('logintype')
            user.deleInfo('username')
            sessionStorage.clear()
            ApiClient.get('priviapi/login/signOut').then(data => {
              user.deleInfo('tokenId')
              console.log('登出成功')
              window.location.href = herf
            }).catch(e => {
              console.error('退出失败')
            })
            // window.location.href = herf
            tip.close()
          },
          null,
          2
        )
      } else {
        this.$emit('special', 'exit')
      }
    },
    searchOverHandler () {
      this.inputShow = true
    },
    searchLeaveHandler () {
      if (this.searchWord == '') {
        this.inputShow = false
      }
    },
    helpClickHandler (val) {
      console.info('服务于帮助=', val)
      var link = ''
      if (val == 'intro') {
        link = pathConfig.INTRODUCE_GUIDE
      } else if (val == 'product') {
        link = pathConfig.PRODUCT_DOCUMENT
      } else if (val == 'problem') {
        link = pathConfig.COMMON_PROBLEM
      }
      window.location.href = link
    },
    openHelpMenuHandler () {
      var that = this
      var closeMenu
      this.userInfoShow = false
      this.helpMenuShow = !this.helpMenuShow
      if (this.helpMenuShow) {
        $(window)
          .unbind('click')
          .bind(
            'click',
            (closeMenu = function (e) {
              that.helpMenuShow = false
              $(window).unbind('click', closeMenu)
            })
          )
      }
    },
    usernameClickHandler () {
      console.log(1);
      var that = this
      var closeMenu
      this.helpMenuShow = false
      that.userInfoShow = !that.userInfoShow
      if (this.userInfoShow) {
        $(window)
          .unbind('click')
          .bind(
            'click',
            (closeMenu = function (e) {
              that.userInfoShow = false
              $(window).unbind('click', closeMenu)
            })
          )
      }
    },
    userMenuClickHandler (value) {
      console.info('用户信息弹框=', value)
      var link = ''
      if (value == 'safe') {
        link = pathConfig.SECURITY_MANAGE
      } else if (value == 'data') {
        link = pathConfig.BASIC_INFO
      } else if (value == 'real') {
        link = pathConfig.REAL_NAME_AUTHENTICATION
      } else if (value == 'create') {
        link = pathConfig.CREATE_ENTERPRISE
      } else if (value == 'join') {
        link = pathConfig.JOIN_ENTERPRISE
      } else if (value == 'identity') {
        link = pathConfig.IDENTITY_MANAGE
      }
      window.location.href = link
      // this.$emit('gotoPage', link)
      window.location.reload(true)
    },
    gotoModularPage () {
      // window.location.href = this.modularName.link
      this.$emit('linkchange', this.modularName)
    },
    msgClickHandler () {
      console.info('消息=')
      this.showMsg = false
      window.location.href = pathConfig.MESSAGE_URL
    }
  }
}
</script>
<style scoped>
.arrow {
  position: absolute;
  top: 2px;
  right: 0;
  font-size: 12px;
  transition: transform 0.3s;
}
.arrow.arrowUp {
  transform: rotate(180deg);
}
.publicTopNavUserName > span:hover + .arrow {
  color: #55a8fd;
}
.publicTopNavUserInfoTextLine {
  padding: 2px 0;
}
</style>
