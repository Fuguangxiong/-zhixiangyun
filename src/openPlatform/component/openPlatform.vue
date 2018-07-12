<template>
  <div class="publicContainer openPlatform">
    <public-header @changeMyapp="changeMyapp" ></public-header>
 
    <left-nav :special="mySpecial" :nav-data="leftNavData" v-on:linkchange="linkChangeHandler" v-on:special="specialLinkChange" :change="leftDataChange"></left-nav>
    <div class="rightContainer">
      <div class="publicWidthHeightContainer" id="publicWidthHeightContainer">
       
        <div class="rightBottomContainer padding20">
          <div class="rightBottomContentContainer" :class="{welcome:welactive}">
            <!--添加Dom的地方-->
            <router-view>

            </router-view>
          </div>
     
       
      </div>

    </div>
      <public-bottom id="publicBottom"></public-bottom>
  </div>
  </div>
</template>
<script>
import '../../resourceCatalog/css/btn.css'
import '../../resourceCatalog/css/default.css'
import '../../resourceCatalog/css/breadCrumb.css'
import '../css/public.css'
import '../../publicCss/public.css'
import '../../platformAuthority/publicCss/public.css'
import '../../platformAuthority/css/default.css'
import leftNav from '../component/publicComponent/openPlatformLeftNav.vue'
import header from '../component/publicComponent/openPlatformTopNav.vue'
import bottomComponent from '../../publicComponent/publicBottomComponent.vue'
import ApiClient from '../../publicJs/ApiClient'
import Vue from 'vue'
import UserCookieService from '../../publicJs/UserCookieService.js'
import publicPathConfig from '../../publicJs/publicPathConfig.js'
import serviceData from '../../publicJs/productsServiceData'
import userService from '../../publicJs/userService.js'
import UtilService from '../../publicJs/UtilService.js'

export default {
  name: 'Test',
  data () {
    return {
      hub: new Vue(),
      mySpecial: true,
      leftNavData: [
        {name: '我的API',
          link: 'myAPI',
          active: false
        },
        {name: '秘钥管理',
          link: 'accreditCode',
          active: false
        },
        {name: '消费总览',
          link: 'consumptionOverview',
          active: false
        },
        {name: '实名认证',
          link: 'realNameCertification',
          active: false
        }
      ],
      leftDataChange: 0,
      hasMsg: true,
      welactive: true,
      publicTopUserChange: 0,
      topNavData: [],
      prividata: null,
      menuData: {},  // 菜单的pId、菜单id，用于子页面根据此数据获取权限按钮
      hideMenu: true
    }
  },
  created () {
    var that = this
    that.tokenId = userService.getTokenId()
    for (let i = 0; i < that.leftNavData.length; i++) {
      that.leftNavData[i].link === that.$route.name ? that.leftNavData[i].active = true : that.leftNavData[i].active = false
    }
    that.$route.name === 'internalOperation' ? that.welactive = true : that.welactive = false

    if (that.tokenId !== undefined && that.tokenId !== null && that.tokenId !== 'null') {
      UserCookieService.userInfoToCookie(that.tokenId, function (userName, images) {
        that.publicTopUserChange++
      })
    } else {
      that.goto(0)
    }
    // this.loadMainMenuResource()
    this.topNavData = serviceData.getData()
  },
  mounted () {
    this.getWidth()
  },
  components: {
    'left-nav': leftNav,
    'public-header': header,
    'public-bottom': bottomComponent
  },
  methods: {
    getWidth () {
      let publicWidthHeightContainer = document.getElementById('publicWidthHeightContainer')
      let w = publicWidthHeightContainer.clientWidth
      let publicBottom = document.getElementById('publicBottom')
      publicBottom.style.width = w + 'px'
    },
    changeMyapp(){
      for (let i = 0; i < this.leftNavData.length; i++) {
        const el =  this.leftNavData[i];
        if(el.link==="myAPI"){
          el.active=true
        }else{
          el.active=false
        }
      }
    },
    goto (type) {
      var path = window.location.href
      path = UtilService.removeUrlItem(path, 'tokenId')
      this.$router.push({path: '/register', query: {type: type, source: encodeURIComponent(path)}})
    },
    linkChangeHandler (item) {
      if (item.link === 'internalOperation') {
        let newleftnav = this.leftNavData
        for (let i = 0; i < newleftnav.length; i++) {
          let obj = newleftnav[i]
          newleftnav[i].active = false
          if (!obj.children) continue
          for (let j = 0; j < obj.children.length; j++) {
            const el = obj.children[j]
            el.active = false
          }
        }

        this.$set(this.leftNavData, newleftnav)
        this.leftDataChange++
      }
      this.$router.push({name: item.link})
      item.link === 'internalOperation' ? this.welactive = true : this.welactive = false
      this.menuData = {pId: item.pId, menuId: item.menuId}
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
    specialLinkChange (data) {
      if (data === 'gotoHome') {
        this.linkChangeHandler({link: 'internalOperation'})
      } else if (data === 'exit') {
        userService.deleInfo('tokenId')
        userService.deleInfo('logintype')
        userService.deleInfo('username')
        sessionStorage.clear()
        window.location.href = publicPathConfig.INTERNAL_OPERATION + '#/'
      }
    },
    // 加载主页面导航菜单资源
    loadMainMenuResource () {
      let that = this
      ApiClient.get('priviapi/auth/getAppDownMenuAndButton', {appId: 'InternalOperation'}, function (data) {
        if (data.data != null && data.data !== undefined && data.data.length !== 0) {
          that.leftNavData = []
          that.justifyPermission(data.data)
          that.prividata = data.data
          that.hub.$emit('getPriviData', that.prividata)
        } else {
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
.rightBottomContentContainer {
  margin-top: 2px;
}
</style>

