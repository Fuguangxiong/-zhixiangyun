<template>
  <!-- <div class="publicContainer">
    <left-nav :nav-data="leftNavData" v-on:linkchange="linkChangeHandler"></left-nav>
    <div class="publicRightContainer">
      <div class="publicWidthHeightContainer">
        <div class="publicRightTopContainer">
          <public-header :userchange="publicTopUserChange" :modular-name="modularName" :has-msg="hasMsg" v-on:linkchange="linkChangeHandler"></public-header>
        </div>
        <div class="publicRightBottomContainer">
          <div class="publicRightBottomContentContainer"> -->
            <!--添加Dom的地方-->
            <router-view>

            </router-view>
          <!-- </div>
        </div>
        <public-bottom></public-bottom>
      </div>
    </div>
  </div> -->
    
</template>
<script>
//import '../../../publicCss/public.css';
import "../../css/public.css";
import leftNav from "../../../publicComponent/publicLeftNavComponent.vue";
import header from "../../../publicComponent/publicTopNavComponent.vue";
import bottomComponent from "../../../publicComponent/publicBottomComponent.vue";

export default {
  name: "appConfig",
  data() {
    return {
      testApiIndexResult: "",
      testApiTestResult: "",
      leftNavData: [
        { name: "图标配置", link: "#", imageClass: "appImgConfig", active: true },
        { name: "导航菜单", link: "#", imageClass: "appNavConfig", active: false },
        {
          name: "轮播图",
          link: "#",
          imageClass: "appBannerImgConfig",
          active: false
        },
        /*   {name:"首页公告",link:"#",imageClass:"appNoticConfig",active:false},*/
        {
          name: "搜索关键词",
          link: "#",
          imageClass: "appKeyWordsConfig",
          active: false
        },
        { name: "热门推荐", link: "#", imageClass: "appHotConfig", active: false },
        {
          name: "精彩专题",
          link: "#",
          imageClass: "appSpecialConfig",
          active: false
        },
        {
          name: "新锐应用",
          link: "#",
          imageClass: "appNewServiceConfig",
          active: false
        },
        {
          name: "友情链接",
          link: "#",
          imageClass: "appFriendshipLinkConfig",
          active: false
        }
      ],
      publicTopUserChange: 0,
      modularName: { name: "个人工作台", link: "personalConsoleIndex" },
      hasMsg: true
    };
  },
  components: {
    "left-nav": leftNav,
    "public-header": header,
    "public-bottom": bottomComponent
  },
  created() {
    for (let i = 0; i < this.leftNavData.length; i++) {
      this.leftNavData[i].imageClass == this.$route.name
        ? (this.leftNavData[i].active = true)
        : (this.leftNavData[i].active = false);
    }
  },
  mounted() {},
  methods: {
    /*testApiIndex () {
        apiClient.get('/api').then(data => {
          this.testApiIndexResult = data
        })      
      },
      testApiTest () {
        apiClient.get('/api/test').then(data => {
          this.testApiTestResult = data
        })
      }*/
    linkChangeHandler(link) {
      this.$router.push({ name: link.imageClass });
      /*   switch (link.name) {
        	case "图标配置":
                this.$router.push({name:'appImgConfig'})
                console.log('图标配置')
                break;
        	case "导航菜单":
                this.$router.push({name:'appNavConfig'})
                console.log('导航菜单')
                break;
            case "轮播图":
                this.$router.push({name:'appBannerImgConfig'})
                console.log('轮播图')
                break;
            case "首页公告":
                this.$router.push({name:'appNoticConfig'})
                console.log('首页公告')
                break;
            case "搜索关键词":
                this.$router.push({name:'appKeyWordsConfig'})
                console.log('搜索关键词')
                break;
            case "热门推荐":
                this.$router.push({name:'appHotConfig'})
                console.log('热门推荐')
                break;   
            case "精彩专题":
                this.$router.push({name:'appSpecialConfig'})
                 console.log('精彩专题')
                break;
            case "新锐应用":
                this.$router.push({name:'appNewServiceConfig'})
                 console.log('新锐应用')
                break;
            case "友情链接":
                this.$router.push({name:'appFriendshipLinkConfig'})
                 console.log('友情链接')
                break;
            default:
                // ...
        }*/
    }
  }
};
</script>

<style scoped>
.publicRightBottomContentContainer {
  padding: 15px;
}
</style>
