<template>
<div class="headerNav">
    <div class="headerNavMain">
        <span class="logoT">
            <a @click="goindex" href="" class="a_logo">
                <img src="../../images/logo.png">
            </a>
        </span>
        <ul class="navMain">
            <li><a href="javascript:;">产品与服务</a></li>
            <li><a href="javascript:;"  @click="gomall">应用市场</a></li>
            <li><a href="javascript:;"  @click="gojiejue">解决方案</a></li>
            <li><a href="javascript:;"  @click="goabout">关于我们</a></li>
            <li><a href="javascript:;"  @click="goserver">服务与支持</a></li>
        </ul>
        <div class="loginregistered">
            <ul class="ullr">
                <li class="borderR"><a href="javascript:;" @click="gologin">登录</a></li>
                <li><a href="javascript:;" @click="gologin">注册</a></li>
            </ul>
        </div>
    </div>
</div>

</template>
<script>
import NoticeBox from '../../../publicJs/NoticeBoxService'
import userService from '../../../publicJs/userService.js'
import apiToken from '../../../publicJs/apiToken.js'
import apiClient from '../../../publicJs/ApiClient.js'
import LoadingBoxService from '../../../publicJs/LoadingBoxService.js'
import UserCookieService from '../../../publicJs/UserCookieService.js'
import UtilService from '../../../publicJs/UtilService.js'
import publicPathConfig from '../../../publicJs/publicPathConfig.js'
import appPublicJs from '../../common/public.js'
import TipBoxService from '../../../publicJs/TipBoxService.js'
import Util from '../../../publicJs/Util.js'
import publicpath from '../../../publicJs/publicPathConfig.js'
export default {
  data () {
    return {
      tokenId:null
    }
  },
   created () {
    this.tokenId = this.$route.query.tokenId || userService.getTokenId()
  },
  methods: {
  },
  methods:{
    gomall(){
        window.location.href=  publicpath.INTRODUCE_SERVER +'#/?tokenId=' +this.tokenId 
       
    },
    goindex(){
        window.location.href= publicpath.API_SERVER +'/index' 
        
    },
    gojiejue(){
      window.location.href= publicpath.INTRODUCE_SERVER +'theSolution.html?hy=gn' 
    },
     goabout(){
         window.location.href=  publicpath.INTRODUCE_SERVER +'aboutUs.html' 
    },
     goserver(){
         window.location.href= publicpath.INTRODUCE_SERVER +'service_support.html' 
        
    },
    gologin(){
         window.location.href= publicpath.APP_MARKET
    },
  }
}
</script>
<style src="../../css/announcementHeader.css" scoped></style>