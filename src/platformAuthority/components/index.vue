<template>
  <div class="publicContainer">
    <left-nav :nav-data="leftNavData" v-on:linkchange="linkChangeHandler"></left-nav>
    <div class="publicRightContainer">
      <div class="publicWidthHeightContainer">
        <div class="publicRightTopContainer">
          <public-header :nav-data="publicTopNavData" :userchange="publicTopUserChange" :modular-name="modularName" :has-msg="hasMsg" :msg-num="msgNum"></public-header>
        </div>
        <div class="publicRightBottomContainer">
          <router-view class="publicRightBottomContentContainer"></router-view>
        </div>
        <public-bottom></public-bottom>
      </div>
    </div>
  </div>
</template>

<script>
import leftNav from '../../publicComponent/publicLeftNavComponent.vue'
import header from '../../publicComponent/publicTopNavComponent.vue'
import bottomComponent from '../../publicComponent/publicBottomComponent.vue'
import Vue from 'vue'
import UserCookieService from '../../publicJs/UserCookieService'
import ApiClient from '../../publicJs/ApiClient'
import userService from '../../publicJs/userService.js'

export default {
  name: 'app',
  data () {
    return {
      hub: new Vue,
      leftNavData: [],
      defaultLeftNavData: [{ name: '部门管理', link: '/departManage', imageClass: 'departmentManage', active: true },
        { name: '授权管理', link: '/authorityManage', imageClass: 'authority', active: false },
        { name: '账户管理', link: '/accountManage', imageClass: 'accoutManage', active: false },
        { name: '账户审核', link: '/auditUser', imageClass: 'accoutApproval', active: false },
        { name: '超级管理员', link: '/superAdministrator', imageClass: 'superAdmin', active: false },
        { name: '创建企业', link: '/createEnterprise', imageClass: 'createEnterprise', active: false },
        { name: '加入企业', link: '/joinEnterprise', imageClass: 'joinEnterprise', active: false },
        { name: '审批企业', link: '/auditEnterprise', imageClass: 'approvalEnterprise', active: false }],
      publicTopNavData: [],
      prividata: [],
      publicTopUserChange: 0,
      modularName: {name: '权限管理', link: '#'},
      hasMsg: true,
      msgNum: 0
    }
  },
  mounted () {
    var that = this
    var tokenId = that.$route.query.tokenId
    if (tokenId != undefined) {
      UserCookieService.userInfoToCookie(tokenId, function (userName, images) {
        that.publicTopUserChange++
      })
    }
    this.loadMainMenuResource()
  },
  components: {
    'left-nav': leftNav,
    'public-header': header,
    'public-bottom': bottomComponent
  },
  methods: {
    linkChangeHandler (link) {
      this.$router.push(link.link)   
    },
    resetActiveNav () {
      for (var i = 0; i < this.leftNavData.length; i++) {
        if (this.leftNavData[i].link === this.$route.path) {
          this.leftNavData[i].active = true
        } else {
          this.leftNavData[i].active = false
        }
      }
    },
    // 加载主页面导航菜单资源
    loadMainMenuResource () {
      let that = this
      ApiClient.get('priviapi/auth/getAppDownMenuAndButton', {appId: 'platform'}, function (data) {
        // console.log(data)
        if (data.data != null && data.data !== undefined && data.data.length !== 0) {
          that.justifyPermission(data.data)
          that.resetActiveNav()
          that.prividata = data.data
          // console.log('prividata', that.prividata)
          that.hub.$emit('getPriviData', that.prividata)
        } else {
              // 默认如果任何都没有则进行全局都进行显示
              // that.leftNavData = that.defaultLeftNavData;
              // that.leftNavData = [];
        }
      })
    },
    justifyPermission (itemList) {
      let that = this
      for (var value in that.defaultLeftNavData) {
        let that = this
        itemList.forEach(function (value2, index2) {
          if (that.defaultLeftNavData[value].name === value2.menuName) {
            that.leftNavData.push(that.defaultLeftNavData[value])
            // console.info('已经放入数组：', that.defaultLeftNavData[value].name)
          }
        })
      }
    }
  }
}
</script>
<style lang="css" scoped>
.publicRightBottomContentContainer {
  padding: 0;
}
</style>
