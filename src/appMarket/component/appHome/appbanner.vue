<template>
    <div class="appbn_appBanner">
            <el-carousel class="appbn_appLunBuo" indicator-position="outside" trigger="click">
                <el-carousel-item v-for="(item,index) in bannerArray" :key="item.src">
                    <img :src="item.src"  class="appbn_bannerImg" @click="tolinkAddress(linkArry[index])" style="width:1920px;height:100%"/>
                </el-carousel-item>
            </el-carousel>
            <div class="appbn_bannerContent">
                <div>
                    <div class="appbn_appBannerLeft">
                        <div class="appbn_appBannerLeftTop" @click='reload'>
                        <img src="../../images/logo.png" />
                        </div>
                        <ul>
                        <li v-for="(menu,index) in menuList" v-on:mouseover="mouseroverMenu(menu,index)" v-on:mouseout="mouseroutMenu" >
                            <div>
                            <a  v-for="(text,index) in menu.info" class="appbn_appDel">{{text.title}}<span>/</span></a>
                            </div>
                            <p> <img src="../../images/jiantou.png" /></p>
                        </li>
                        </ul>
                        <div class="appbn_appTanchuang" v-show="menuShow" v-on:mouseover="mouseroverNav" v-on:mouseout="mouseroutNav">
                        <div v-for="(subnav,index) in subnavList">
                            
                            <div class="appbn_appTanchuangHeader">
                            <h4>{{subnav.info[0].title}}</h4>
                            </div>
                            <ul class="appbn_appTanchuangHot clearfix">
                            <li v-for="serveObj in subnav.items" @click="toServiceDetail(serveObj.id)" >{{serveObj.name|filterFun}}</li>
                            <div v-show='!subnav.items[0]' class="appbn_msgTitle">内容建设中...</div>
                            </ul>

                        </div>
                        <div v-show='!subnavList' class="appbn_appHomeBannerMenuDefine">
                                内容建设中...
                        </div>
                        </div>
                    </div>
                </div>
            </div>
    </div>
</template>
<script>
import apiToken from '../../../publicJs/apiToken.js'
import apiClient from '../../../publicJs/ApiClient.js'
import UtilService from '../../../publicJs/UtilService.js'
import appPublicJs from '../../common/public.js'
export default {
    name:'appbanner',
    data() {
            return {
                bannerArray:[],
                linkArry:[],
                obj1:{'src': ''},
                obj2:{'src': ''},
                obj3:{'src': ''},
                menuShow: false,
                //导航整体数据
                menuList: [],
                //二级导航
                subnavList: [],
            }  
        },
    filters: {
      filterFun: function(value) {
        return value.length>10?value=value.substring(0,10)+"...":value
      }
    },
    props:{
        configId:""
    },
    components: {
    },
    created(){
    },
    mounted(){
        this.getbannerImg();//轮播图
        this.getMenuList();
    },
    methods:{
        getbannerImg(){
            var that = this;
            var myData = {
                'templateId':window.configinfo.configId,
                'contentType': 'imgs',
                'status':1
            }   
            apiClient.get(apiToken.newApi('/appmarket/content/getCotentByType/'), myData, function(data) {
                if(appPublicJs.checkData(data.results.data)){
                    var list = data.results.data;
                    that.linkArry=list
                    for(var i=0; i<list.length; i++){
                        var imageUrl = apiClient.apiBaseUrl + '/appmarket/upload/picimg?token=' + apiClient.token + '&img=' + list[i].src;
                            if(list[i].imgIndex == 1){
                                that.obj1.src = imageUrl;
                            }
                        if(list[i].imgIndex == 2){
                                that.obj2.src = imageUrl;
                            }
                        if(list[i].imgIndex == 3){
                                that.obj3.src = imageUrl;
                            }
                    }
                    if(that.obj1.src!=''){
                        that.bannerArray.push(that.obj1);
                    }
                    if(that.obj2.src!=''){
                        that.bannerArray.push(that.obj2);
                    }
                    if(that.obj3.src!=''){
                        that.bannerArray.push(that.obj3);
                    }
                }
            });
        },
        tolinkAddress(item){
            if(item.serverId!=''){
                let url=window.location.href+"appServiceDetail?id="+item.serverId+""					
                window.open(url)
            }
            if(item.href!=''){
                window.open(item.href);
            }
        },
        getMenuList() {
            var that = this;
            var myData = {
               'templateId':window.configinfo.configId,
                status: "1"
            };
            apiClient.get(apiToken.newApi('appmarket/item/getItem/'), myData, function(data) {
            that.menuList=data.results.itemTreeList
            })
        },
        toServiceDetail:function(id){
            this.$router.push({path:'/appServiceDetail',query:{id:id}});
        },
        //移入导航
        mouseroverMenu(menu, index) {
            this.subnavList = [];
            this.subnavList = menu.items;
            this.menuShow = true;
            
        },
        //移出导航
        mouseroutMenu() {
            this.menuShow = false;
        },
            //移入二级导航框
        mouseroverNav() {
            this.menuShow = true;
        },
        //移出二级导航框
        mouseroutNav() {
            this.menuShow = false;
        },
        // 刷新页面
        reload(){
            location.reload()
        }
    }
}
</script>
<style scoped>
/* .appbn_appLunBuo .el-carousel__item img {
  position: absolute;
  left: 50%;
  margin-left: -960px;
}
.appbn_bannerContent{
    width: 1200px;
    margin: 0 auto;
}
.appbn_appBanner{
	overflow: hidden;
	width:100vw;
	padding:0 5vw;
	height:540px;
	display:block;
	position: relative;
}
.appbn_appBanner>.appbn_appLunBuo{
	max-width:1920px;
	min-width:1366px;
	height:100%;
	position: absolute;
	left:0;
	top:0;
	right: 0;
	bottom: 0;
	z-index: 1;
	transition: 2s;
    margin: 0 auto;
}
.appbn_appBanner>.appbn_appLunBuo>li{
	float:left;
	width:100%;
	height:100%;
}
.appbn_appBanner>.appbn_appLunBuo>li>img{
	width:100%;
	height:100%;
}
.appbn_appBannerLeft{
	width:280px;
	height:540px;
	background:rgba(64,73,104,0.4);
	float:left;
	position: relative;	
	z-index: 2;
}

.appbn_appBannerLeftTop{
	width:100%;
	height:64px;
	padding:10px 0 0 13px;
	cursor: pointer;
}

.appbn_appBannerLeft>ul{
	width:100%;
	font-size: 13px;
}
.appbn_appBannerLeft>ul>li{
	width:100%;
	height:45px;
	line-height: 45px;
	padding:0 12px 0 14px;	
    color:rgb(202,204,213);
    overflow: hidden;
}
.appbn_appBannerLeft>ul>li:hover{
	background:rgba(255,255,255,0.5);
}
.appbn_appBannerLeft>ul>li>div{
	width:92%;
	float:left;
}
.appbn_appBannerLeft>ul>li>div>a{
	cursor: default;
}
.appbn_appBannerLeft>ul>li>div>a:hover{
	color:#fff;
}
.appbn_appBannerLeft>ul>li>div>span{
	color:#FFFFFF;
	margin:0 10px;
}
.appbn_appBannerLeft>ul>li>div>a>span{
	color:#FFFFFF;
	margin:0 10px;
}
.appbn_appBannerLeft>ul>li>p{
	height:16px;
	float:left;
	color:rgb(202,204,213);         
}
.appbn_appTanchuang{
	overflow: visible;
	width:920px;
	height:540px;
	position: absolute;
	top:0;
	left:280px;
	background:rgba(255,255,255,0.95);
	padding:0 20px 0 25px; 
}
.appbn_appTanchuangTop{
	width:100%;
	height:65px;
	border-bottom:1px solid rgb(181,181,184);
	padding-top:18px;
	font-size:13px
	
}
.appbn_appTanchuangTop>li{
	width:90px;
	height:29px;
	text-align: center;
	line-height: 28px;
	border-radius: 3px;
	border:1px solid rgb(102,102,102);
	font-size: 13px;
	float:left;
	margin-right: 38px;
	cursor: pointer;
	color:rgb(51,51,51)
}
.appbn_appTanchuangTop>li:hover{
	color:rgb(251,98,51);
}
.appbn_appTanchuangTop>li>span{
	margin-left:8px;
	
}
.appbn_appTanchuangHeader{
	width:100%;
	height:45px;
	border-bottom:1px solid rgb(212,213,217);
	font-size: 15px;
}
.appbn_appTanchuangHeader>h4{
	min-width:100px;
	height:45px;
	line-height: 45px;
	float:left;
	cursor: default;
	font-size: 16px;
}
.appbn_appTanchuangHeader>p{
	line-height: 45px;
	float:right;
	font-size: 13px;
	cursor: pointer;
}
.appbn_appTanchuangHeader>p:hover{
	color:rgb(251,98,51);
}
.appbn_appTanchuangHeader>p>span{
	margin-left:3px;
}
.appbn_appTanchuangHot,.appbn_appTanchuangHot1{
	width:100%;
	min-height:55px;
	max-height:110px;
	flex-wrap: wrap;
	justify-content: space-between;
}
.appbn_appTanchuangHot>li,.appbn_appTanchuangHot1>li{
	line-height: 36px;
	font-size: 13px;
	color:rgb(51,51,51);
	cursor: pointer;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    float: left;
    padding: 0 10px;
    min-width: 50px;
}
.appbn_appTanchuangHot>li:hover,.appbn_appTanchuangHot1>li:hover{
	color:rgb(251,98,51)
}

.appbn_appTanchuangPeople{
	width:100%;
	height:78px;
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;	
}
.appbn_appTanchuangPeople>li{
	width:12.5%;
	line-height: 36px;
	font-size: 13px;
	cursor: pointer;
	color:rgb(51,51,51);
}
.appbn_appTanchuangPeople>li:hover{
	color:rgb(251,98,51)
}
.appbn_appDel:last-child span{
  display: none;
}
.appbn_appLunBuo .appbn_bannerImg{
  cursor: pointer;
}
.appbn_appTanchuangHot>.appbn_msgTitle{
  padding:10px;
     color: #666;
}
.appbn_appHomeBannerMenuDefine{
	width: 920px;
    height: 540px;
    line-height: 540px;
    text-align: center;
    font-size: 25px;
    color: #666;
} */
</style>
