<template>
  <div id="app" class="publicContainer">
    <left-nav :nav-data="leftNavData" v-on:linkchange="linkChangeHandler"></left-nav>
    <div class="publicRightContainer">
      <div class="publicWidthHeightContainer">
        <div class="publicRightTopContainer">
          <public-header :nav-data="topNavData" v-on:headerSearch="headerSearchHandler" :userchange="publicTopUserChange"></public-header>
        </div>
        <div class="publicRightBottomContainer">
          <div class="publicRightBottomContentContainer">
            <router-view></router-view>
          </div>
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
      hub: new Vue(),
      defaultLeftNavData: [{ name: '资源目录', link: '/resourceCatalog', imageClass: 'resourceCatalog', active: true },
        { name: '个人申请', link: '/personApplyManage', imageClass: 'individualApplication', active: false },
        { name: '申请管理', link: '/applyManageAdministrator', imageClass: 'applyManage', active: false },
        { name: '个人注册', link: '/personRegisterManage', imageClass: 'individualRegistration', active: false },
        { name: '注册管理', link: '/registerManageAdministrator', imageClass: 'registerManage', active: false },
        { name: '数据元管理', link: '/metadata', imageClass: 'dataElement', active: false },
        { name: '质量检测', link: '/dataCheck', imageClass: 'qualityInspect', active: false },
        { name: '目录维护', link: '/catalogConfig', imageClass: 'directoryMaintenance', active: false }],
      leftNavData: [],
      topNavData: [
        {
          title: '弹性计算',
          /* kuangdong 20171026 start */

          /* kuangdong 20171026 end */
          list: [{ name: '云服务器 ECS', link: '#' }, { name: 'GPU 云服务器', link: '#' }, { name: 'GPU 云服务器', link: '#' }, { name: 'FPGA 云服务器', link: '#' }, { name: '块储存', link: '#' }, { name: '专有网络 VPC', link: '#' },
            { name: '负载均衡 SLB', link: '#' }, { name: '高性能计算 HPC', link: '#' }, { name: '弹性伸缩', link: '#' }, { name: '资源编排', link: '#' }]
        },
        {
          title: '存储和CDN',
          list: [{ name: '对象存储 OSS', link: '#' }, { name: '块存储', link: '#' }, { name: '文件存储 NAS', link: '#' }, { name: '表格存储 TableStore', link: '#' }, { name: '归档存储 OAS', link: '#' }, { name: '云存储网关', link: '#' },
            { name: '闪电立方', link: '#' }]
        },
        {
          title: '安全解决方案',
          list: [{ name: '等保合规安全解决方案', link: '#' }, { name: '政务云安全解决方案', link: '#' }, { name: '新零售安全解决方案', link: '#' }, { name: '混合云态势感知解决方案', link: '#' }, { name: '互联网金融安全解决方案', link: '#' },
            { name: '游戏安全解决方案', link: '#' }, { name: '社交/媒体spam解决方案', link: '#' }, { name: '移动App推广欺诈解决方案', link: '#' }, { name: '企业预防勒索解决方案', link: '#' }]
        }
      ],
      publicTopUserChange: 0,
      prividata: []
    }
  },
  components: {
    'left-nav': leftNav,
    'public-header': header,
    'public-bottom': bottomComponent
  },
  mounted () {
      /* kuangdong 20171026 start */
    var that = this
    var tokenId = that.$route.query.tokenId
    if (tokenId != undefined) {
      UserCookieService.userInfoToCookie(tokenId, function (userName, images) {
        that.publicTopUserChange++
      })
    }
    // that.resetActiveNav()
    /* kuangdong 20171026 end */
      // this.resetActiveNav()
    // this.getUserInfo()
    this.loadMainMenuResource()
  },
  methods: {
    changeLeftNavActive (name) {
      for (var i = 0; i < this.leftNavData.length; i++) {
        var el = this.leftNavData[i]
        if (el.name === name) {
          el.active = true
        } else {
          el.active = false
        }
      }
    },
    getUserInfo () {
      var that = this
      var myData = {}
      ApiClient.get('/pubapi/token/getUserByToken', myData, function (data) {
        userService.storeInfo('username', data.results.PHONE)
        userService.storeInfo('image', data.results.IMAGE)
        that.userchange++
      })
    },
    linkChangeHandler (link) {
      this.$router.push(link.link)
    },
    headerSearchHandler (data) {
      // console.info('公共头部搜索框=', data)
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
      ApiClient.get('priviapi/auth/getAppDownMenuAndButton', {appId: 'resourceCatalog'}, function (data) {
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
<style scoped></style>

<style scoped>
.publicRightContainer {
  background-color: #F3F7FD;
}
.publicRightBottomContentContainer {
  /* overflow-y: auto; */
  padding-top: 15px;
  position: relative;
}
</style>
