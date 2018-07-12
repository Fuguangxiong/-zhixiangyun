<template>
  <!--
  <div class="publicContainer">
    <left-nav :nav-data="leftNavData" v-on:linkchange="linkChangeHandler"></left-nav>
    <div class="publicRightContainer">
      <div class="publicWidthHeightContainer">
        <div class="publicRightTopContainer">
          <public-header :userchange="publicTopUserChange" :modular-name="modularName" :has-msg="hasMsg" v-on:linkchange="linkChangeHandler"></public-header>
        </div>
        <div class="publicRightBottomContainer">
          <div class="publicRightBottomContentContainer">
  -->
            <!--添加Dom的地方-->
            <router-view>

            </router-view>
  <!--
          </div>
        </div>
        <public-bottom></public-bottom>
      </div>
    </div>
  </div>
  -->
</template>
<script>
import "../../publicCss/public.css";
import leftNav from "../../publicComponent/publicLeftNavComponent.vue";
import header from "../../publicComponent/publicTopNavComponent.vue";
import apiToken from "../../publicJs/apiToken.js";
import apiClient from "../../publicJs/ApiClient.js";
import bottomComponent from "../../publicComponent/publicBottomComponent.vue";
import UtilService from "../../publicJs/UtilService.js";
import UserCookieService from '../../publicJs/UserCookieService';
import userService from '../../publicJs/userService'
export default {
  name: "homeIndex",
  data() {
    return {
      tokenId: null,
      userData:{},
      userchange: 0,
      testApiIndexResult: "",
      testApiTestResult: "",
      defaultLeftNavData: [
        /**{ name: "应用管理", link: "#", imageClass: "applyManage", active: false },
        { name: "应用审批", link: "#", imageClass: "applyApproval", active: false },
        { name: "服务管理", link: "#", imageClass: "serviceManage", active: false },
        { name: "服务审批", link: "#", imageClass: "applyApproval", active: false }**/
        { name: "服务检索", link: "search", active: true },
        { name: "企业服务", link: "enterprise", active: true },
        { name: "平台服务", link: "platformService", active: false },
        { name: "第三方服务", link: "thirdPartyService", active: false },
        { name: "待我审批", link: "applyUsing", active: false },
        { name: "已注册服务", link: "registered", active: false },
        { name: "已申请服务", link: "applied", active: false },
        { name: "计费方案管理", link: "chargePlanManage", active: false }
      ],
      leftNavData: [{name: '服务管理',
          link: 'welcomePage',
          imageClass: 'serviceManage',
          active: true,
          children: [      
          
          ]
        }],
      topNavData: [
        {
          title: "弹性计算",
          list: [
            { name: "云服务器 ECS", link: "#" },
            { name: "GPU 云服务器", link: "#" },
            { name: "GPU 云服务器", link: "#" },
            { name: "FPGA 云服务器", link: "#" },
            { name: "块储存", link: "#" },
            { name: "专有网络 VPC", link: "#" },
            { name: "负载均衡 SLB", link: "#" },
            { name: "高性能计算 HPC", link: "#" },
            { name: "弹性伸缩", link: "#" },
            { name: "资源编排", link: "#" }
          ]
        },
        {
          title: "存储和CDN",
          list: [
            { name: "对象存储 OSS", link: "#" },
            { name: "块存储", link: "#" },
            { name: "文件存储 NAS", link: "#" },
            { name: "表格存储 TableStore", link: "#" },
            { name: "归档存储 OAS", link: "#" },
            { name: "云存储网关", link: "#" },
            { name: "闪电立方", link: "#" }
          ]
        },
        {
          title: "安全解决方案",
          list: [
            { name: "等保合规安全解决方案", link: "#" },
            { name: "政务云安全解决方案", link: "#" },
            { name: "新零售安全解决方案", link: "#" },
            { name: "混合云态势感知解决方案", link: "#" },
            { name: "互联网金融安全解决方案", link: "#" },
            { name: "游戏安全解决方案", link: "#" },
            { name: "社交/媒体spam解决方案", link: "#" },
            { name: "移动App推广欺诈解决方案", link: "#" },
            { name: "企业预防勒索解决方案", link: "#" }
          ]
        }
      ],
      publicTopUserChange: 0,
       modularName:{name:"服务管理",link:"welcomePage"},
       hasMsg:true,
       msgNum:0
    };
  },
  components: {
    "left-nav": leftNav,
    "public-header": header,
    "public-bottom": bottomComponent
  },
  watch:{
    // $route(){
    //   UtilService.resetDocumentTitle('服务管理平台');
    // }
  },
  created() {
    /*获取用户信息*/
    this.getUserInfo();
    
    //this.navActive();
  },
  mounted() {
    this.loadMainMenuResource();  
    /*apiClient.websocket.debug(true).subscribe('/topic/checkData/status', function (message) {
      console.log(message)
      })*/
  },
  methods: {
    getUserInfo() {
      var that = this;
      var tokenId = that.$route.query.tokenId;
      if (tokenId != undefined) {
        UserCookieService.userInfoToCookie(tokenId, function (userName, images, userInfo) {
          that.publicTopUserChange++
          that.userData = userInfo;
          console.info("userInfo=", userInfo);
        })
      }
      else{
        UserCookieService.getUserInfo(function(userInfo){
          that.userData = userInfo;
          console.info("userInfo=", userInfo);
        });
      }
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
    linkChangeHandler(item) {
      this.$router.push({name: item.link});
    },
    //加载主页面导航菜单资源
    loadMainMenuResource() {
      let that = this;
      apiClient.get(
        "priviapi/auth/getAppDownMenuAndButton",
        { appId: "ServiceManger" },
        function(data) {
          if (
            data.data != null &&
            data.data != undefined &&
            data.data.length != 0
          ) {
            that.justifyPermission(data.data);
          } else {
            //默认如果任何都没有则进行全局都进行显示
            //that.leftNavData = that.defaultLeftNavData;
            //that.leftNavData = [];
          }
        }
      );
    },
    //校验是否拥有菜单权限服务
    justifyPermission(itemList) {
      console.info("权限：", itemList);
      let that = this;
      for(var mainMenu in that.leftNavData){
        if(that.leftNavData[mainMenu].name=='服务管理'){
          console.info("用户信息：", that.userData);
          for (var value in that.defaultLeftNavData) {
            let that = this;            
            if(that.userData.LOGIN_TYPE == 'ENTERPRISE'){
                that.leftNavData[mainMenu].children.push(that.defaultLeftNavData[value]);
                console.info("ENTERPRISE已经放入数组：", that.defaultLeftNavData[value].name);
            }else if(that.userData.LOGIN_TYPE == 'PERSONAL'){
                if(that.defaultLeftNavData[value].name == '待我审批' || 
                    that.defaultLeftNavData[value].name == '已注册服务' ||
                    that.defaultLeftNavData[value].name == '已申请服务' ){
                  that.leftNavData[mainMenu].children.push(that.defaultLeftNavData[value]);
                  console.info("PERSONAL已经放入数组：", that.defaultLeftNavData[value].name);
                }
            }else if(that.userData.LOGIN_TYPE == 'PLATFORM'){
                if(that.defaultLeftNavData[value].name != '企业服务' &&
                  that.defaultLeftNavData[value].name != '服务检索'){
                  that.leftNavData[mainMenu].children.push(that.defaultLeftNavData[value]);
                  console.info("PLATFORM已经放入数组：", that.defaultLeftNavData[value].name);
                }
            }
          }
        }
      }
      console.info("二级菜单：", that.leftNavData);
    }
  }
};
</script>
<style>
.test span {
  color: #ff0;
}
</style>
<style scope>
.publicLeftChildrenItem .active {
  display: block;
}
</style>