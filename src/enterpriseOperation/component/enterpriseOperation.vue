<template>
  <div class="publicContainer">
    <left-nav :nav-data="leftNavData" v-on:linkchange="linkChangeHandler" :change="leftDataChange"></left-nav>
    <div class="publicRightContainer">
      <div class="publicWidthHeightContainer">
        <div class="publicRightTopContainer">
          <public-header :hide-menu='hideMenu' :nav-data="topNavData" :userchange="publicTopUserChange" :modular-name="modularName" :has-msg="hasMsg" v-on:linkchange="linkChangeHandler" :special="mySpecial"></public-header>
        </div>
        <div class="publicRightBottomContainer">
          <div class="publicRightBottomContentContainer">
            <!--添加Dom的地方-->
            <router-view>

            </router-view>
          </div>
        </div>
        <public-bottom></public-bottom>
      </div>
    </div>
  </div>
</template>
<script>
import '../../resourceCatalog/css/btn.css'
import '../../resourceCatalog/css/default.css'
import '../../resourceCatalog/css/breadCrumb.css'
import '../../publicCss/public.css'
import '../../platformAuthority/publicCss/public.css'
import '../../platformAuthority/css/default.css'
// import '../../platformAuthority/css/register.css'
import leftNav from '../../publicComponent/publicLeftNavComponent.vue'
import header from '../../publicComponent/publicTopNavComponent.vue'
import bottomComponent from '../../publicComponent/publicBottomComponent.vue'
import UserCookieService from '../../publicJs/UserCookieService'
import ApiClient from '../../publicJs/ApiClient'
import userService from '../../publicJs/userService.js'
import path from '../../publicJs/publicPathConfig'
import serviceData from '../../publicJs/productsServiceData'
import Vue from 'vue'
import {getPermissionCode} from '../../publicJs/verifyPermission'
export default {
  name: 'enterpriseManagement',
  data () {
    return {
      hub: new Vue(),
      mySpecial: false,
      leftNavData: [
        {name: '账号管理',
          link: '',
          imageClass: 'accountmanage',
          active: false,
          code: '007',
          children: [
           {name: '安全管理', link: 'safetyManagement', active: false, code: '007001'},
           {name: '基本资料', link: 'basicInformation', active: false, code: '007002'},
           {name: '实名认证', link: 'realNameCertification', active: false, code: '007003'}
          ]
        },

        {name: '服务管理',
          link: '',
          imageClass: 'servicemanage',
          active: false,
          code: '008',
          children: [
            {name: '服务检索', link: 'search', active: false, code: '008005'},
            {name: '企业服务', link: 'enterprise', active: false, code: '008006'},
            {name: '平台服务', link: 'platformService', active: false, code: '008007'},
            {name: '第三方服务', link: 'thirdPartyService', active: false, code: '008008'},
            {name: '待我审批', link: 'applyUsing', active: false, code: '008001'},
            {name: '我的注册', link: 'registered', active: false, code: '008002'},
            {name: '我的申请', link: 'applied', active: false, code: '008003'},
            {name: '计费方案管理', link: 'chargePlanManage', active: false, code: '008004'}
          ]
        },
        {name: '资源管理',
          link: '',
          imageClass: 'resourcemanage',
          active: false,
          code: '009',
          children: [
            {name: '资源目录', link: 'resourceCatalogList', active: false, code: '009001'},
            {name: '我的申请', link: 'personApplyManage', active: false, code: '009002'},
            {name: '申请管理', link: 'applyManageAdministrator', active: false, code: '009008'},
            {name: '我的注册', link: 'personRegisterManage', active: false, code: '009003'},
            {name: '注册管理', link: 'registerManageAdministrator', active: false, code: '009009'},
            {name: '数据元管理', link: 'metadata', active: false, code: '009004'},
            {name: '质量检测', link: 'dataCheck', active: false, code: '009005'},
            {name: '目录维护', link: 'catalogConfig', active: false, code: '009006'}
          ]
        },
        {name: '员工审核', link: 'enterpriseAuthenticationList', imageClass: 'staffReview', active: false, code: '013'},
        {name: '企业信息', link: 'enterpriseManagement', imageClass: 'enterpriseManage', active: false, code: '014'},
        {name: '应用管理',
          link: '',
          imageClass: 'appmanager',
          active: false,
          code: '012',
          children: [
            {name: '企业应用', link: 'enterpriseApp', active: false, code: '012001'},
            {name: '我的应用', link: 'myApp', active: false, code: '012002'}
          ]
        }
      ],
      imageClassMap: {
        '账号管理': 'accountmanage',
        '资源管理': 'resourcemanage',
        '权限管理': 'powermanage',
        '服务管理': 'servicemanage',
        '企业信息': 'enterpriseManage',
        '员工审核': 'staffReview',
        '应用管理': 'appmanager'
      },
      publicTopUserChange: 0,
      modularName: {name: '企业运营平台', link: ''},
      hasMsg: true,
      leftDataChange: 0,
      topNavData: [],
      prividata: null,
      menuData: {},  // 菜单的pId、菜单id，用于子页面根据此数据获取权限按钮
      hideMenu: true
    }
  },
  created () {
    getPermissionCode()
    // 当token是不存在或者是游客token时跳回登录页面
    if (!userService.getInfo('tokenId') || userService.getInfo('tokenId') === '1c14f665aa8643c28f899aa9b0efee56') {
      window.location.href = path.PLATFORM_LOGIN_URL
    }
    var that = this
    var tokenId = that.$route.query.tokenId
    if (tokenId != undefined) {
      UserCookieService.userInfoToCookie(tokenId, function (userName, images) {
        that.publicTopUserChange++
      })
    }
    // for (let i = 0; i < this.leftNavData.length; i++) {
    //   this.leftNavData[i].link==this.$route.name?this.leftNavData[i].active=true:this.leftNavData[i].active=false;
    // }
    this.getPermissionForLeftData()
    this.navActive()
    if (this.$route.path === '/' && this.leftNavData.length > 0) {
      if (this.leftNavData[0].link) {
        this.$router.replace({name: this.leftNavData[0].link})
      } else {
        this.$router.replace({name: this.leftNavData[0].children[0].link})
      }
    }
    // this.loadMainMenuResource()
    this.topNavData = serviceData.getData()
  },
  components: {
    'left-nav': leftNav,
    'public-header': header,
    'public-bottom': bottomComponent
  },
  methods: {
    linkChangeHandler (item) {
      this.$router.push({name: item.link})
      this.menuData = {pId: item.pId, menuId: item.menuId}
    },
    navActive () {
      for (let i = 0; i < this.leftNavData.length; i++) {
        let obj = this.leftNavData[i]
        this.leftNavData[i].active = false
        if (obj.link === this.$route.name) {
          this.leftNavData[i].active = true
        }
        if (!obj.children) continue
        for (let j = 0; j < obj.children.length; j++) {
          const el = obj.children[j]
          el.active = false
          if (el.link === this.$route.name) {
            this.leftNavData[i].active = true
            el.active = true
          }
        }
      }
    },
    setActive (name1, name2) {
      for (let i = 0; i < this.leftNavData.length; i++) {
        let obj = this.leftNavData[i]
        this.leftNavData[i].active = false
        if (obj.name === name1) {
          this.leftNavData[i].active = true
        }
        if (!obj.children) continue
        for (let j = 0; j < obj.children.length; j++) {
          const el = obj.children[j]
          el.active = false
          if (el.name === name2) {
            el.active = true
          }
        }
      }
    },
    getPermissionForLeftData () {
      for (let i = 0; i < this.leftNavData.length; i++) {
        const el = this.leftNavData[i]
        if (!this.verifyPermission(el.code)) {
          this.leftNavData.splice(i, 1)
          i--
        } else {
          if (el.children && el.children.length > 0) {
            for (let j = 0; j < el.children.length; j++) {
              const cel = el.children[j]
              if (!this.verifyPermission(cel.code)) {
                el.children.splice(j, 1)
                j--
              }
            }
          }
        }
      }
      this.leftDataChange++
    },
    // 加载主页面导航菜单资源
    loadMainMenuResource () {
      let that = this
      ApiClient.get('priviapi/auth/getAppDownMenuAndButton', {appId: 'EnterpriseManage'}, function (data) {
        if (data.data != null && data.data !== undefined && data.data.length !== 0) {
          that.leftNavData = []
          that.justifyPermission(data.data)
          console.log('leftNavData', that.leftNavData)
          that.prividata = data.data
          console.log('prividata', that.prividata)
          that.hub.$emit('getPriviData', that.prividata)
        } else {
              // 默认如果任何都没有则进行全局都进行显示
              // that.leftNavData = that.defaultLeftNavData;
              // that.leftNavData = [];
        }
      })
    },
    justifyPermission (itemList) {
      for (let i = 0; i < itemList.length; i++) {
        const obj = itemList[i]
        let item = {}
        item.menuId = obj.menuId
        item.name = obj.menuName
        item.link = obj.menuUrl
        if (item.sublist && item.sublist.length !== 0) {
          item.link = ''
        }
        item.imageClass = this.imageClassMap[item.name]
        if (item.link === this.$route.name) {
          item.active = true
          this.$children[0].navIndex = i
        } else {
          item.active = false
        }
        if (!obj.sublist) {
          this.leftNavData.push(item)
          continue
        }
        let children = []
        for (let j = 0; j < obj.sublist.length; j++) {
          const el = obj.sublist[j]
          let childrenItem = {}
          childrenItem.name = el.menuName
          childrenItem.link = el.menuUrl
          childrenItem.menuId = el.menuId
          childrenItem.pId = el.pId
          if (childrenItem.link === this.$route.name) {
            item.active = true
            this.$children[0].navIndex = i
            childrenItem.active = true
          } else {
            childrenItem.active = false
          }
          children.push(childrenItem)
        }
        item.children = children
        this.leftNavData.push(item)
      }
    }
  }
}
</script>
<style scoped>
.publicRightBottomContentContainer {
  margin-top: 2px;
  overflow-y: auto;
}
</style>

