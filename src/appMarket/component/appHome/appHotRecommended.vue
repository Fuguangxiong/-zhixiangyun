<template>
<div class="apphot_appHotbox"> 
  <div class="apphot_appHot">
      <div class="apphot_appHotTop clearfix timeX" >
        <h4><span><img src="../../images/hotImg.png"/></span><em>热门推荐</em></h4>
        <p @click="toMore"><i class="icMove"></i></p>
      </div>
      <ul class="clearfix">
        <li v-for="(iterm,index) in hotData" @click="toServiceDetail(iterm.id)">
          <div></div>
          <img v-lazy="imgSrc[index]" alt="" />
          <p :title="iterm.name">{{iterm.name|filterFun}}</p>
          <div class="apphot_describe" :title="iterm.service_brief">{{iterm.service_brief}}</div>
        </li>
      </ul>
  </div>
</div>  
</template>
<script>
  import apiToken from '../../../publicJs/apiToken.js'
  import apiClient from '../../../publicJs/ApiClient.js'
  import TipBoxService from '../../../publicJs/TipBoxService.js'
  import LoadingBoxService from '../../../publicJs/LoadingBoxService.js'
  import Util from '../../../publicJs/Util.js'
  import appPublicJs from '../../common/public.js'
  export default {
    name: '',
    data () {
      return {
        hotData: '',
        imgSrc: [],
        hotKeyWord: '1'
      }
    },
    props: {
      configId: '',
      page: ''
  
    },
    components: {
    },
    created () {
    },
    filters: {
      filterFun: function (value) {
        return value.length > 8 ? value = value.substring(0, 8) : value
      }
    },
    mounted () {
      this.getHotList()
    },
    methods: {
      getHotList () {
        var that = this
        var myData = {
          'templateId': window.configinfo.configId,
          'pageSize': this.page,
          'pageNum': '1',
          'sum': '100',
//      "query": "qq",
          'form': '1',
          'status': '0'
        }
        apiClient.get(apiToken.newApi('appmarket/atomic/getAtomicRecommendList/'), myData, function (data) {
          var data = data.results.data
          if (Util.isArray(data) && data.length > 0) {
            that.hotData = data
            for (var i = 0; i < data.length; i++) {
              that.imgSrc.push(apiClient.apiBaseUrl + appPublicJs.serviceImgShow + data[i].bg_img + '&token=' + apiClient.token)
            }
          }
        })
      },
      toMore: function () {
        this.$router.push({path: '/appHotMore', query: {hotKeyWord: this.hotKeyWord}})
      },
      toServiceDetail: function (id) {
        this.$router.push({path: '/appServiceDetail', query: {id: id, templateId: window.configinfo.configId}})
      }
    }
  }
</script>
<style scoped>
/* .apphot_appHot>ul>li:nth-child(4){
  margin-right: 0px;
}
.apphot_appHot>ul>li:nth-child(5){
  margin-top: 16px;
}
.apphot_appHot>ul>li:nth-child(6){
  margin-top: 16px;
}
.apphot_appHot>ul>li:nth-child(7){
  margin-top: 16px;
}
.apphot_appHot>ul>li:nth-child(8){
  margin-top: 16px;
}
.apphot_appHot>ul>li:nth-child(8){
  margin-right: 0px;
}
.apphot_appHotbox {
    width: 100%;
    background-color: #fafafa;
}
.apphot_appHot{
  width: 1200px;
  margin: 0 auto;
  padding: 0;
	background:rgb(250,250,250);
}
.apphot_appHotTop{
	width:100%;
	height:54px;
	cursor: pointer;
    line-height: 54px;
}

.apphot_appHotTop>p{
	float:right;
	padding-top: 24px;
	
}
.apphot_appHotTop>h4{
	float:left;
	font-size: 18px;
	color:rgb(51,51,51);
	margin-top: 20px;
}
.apphot_appHotTop>h4>span{
	margin-right:6px;
	float: left;
}
.apphot_appHotTop>h4>em{
	float: left;
	font-style: normal;
	margin-top: 2px;
}
.apphot_appHot>ul{
	width:100%;
}
.apphot_appHot>ul>li{
  width: 24%;
  height: 202px;
  border-radius: 4px;
  position: relative;
  overflow: hidden;
  z-index: 10;
  cursor: pointer;
  transition: all .5s;
  float: left;
  margin-right: 16px
}
.apphot_appHot>ul>li:last-child{
	margin-right: 0;
}
.apphot_appHot>ul>li>div:first-child{
	width:100%;
	height:100%;
	position: absolute;
	left:0;
	top:0;
	background:rgba(0,0,0,0.4);
	z-index: 2;
}
.apphot_appHot>ul>li:hover{
	box-shadow: 0 0 10px rgba(0,0,0,.6);
}
.apphot_appHot>ul>li>img{
	width:100%;
	height:100%;
	transition: 0.5s;
	z-index: 1;
}
.apphot_appHot>ul>li:hover>img{
	transform: scale(1.2);
	transition: 1s;
}
.apphot_appHot>ul>li>p{
	width:100%;
	position: absolute;
	top:60px;
	left:0;
	text-align: center;
	overflow:hidden;	
	text-overflow: ellipsis;
	white-space: nowrap;
	font-size: 16px;
	color:#fff;
	z-index: 3;
}
.apphot_appHot>ul>li>div:last-child{
	position: absolute;
	left:16px;
	top:124px;
	width:90%;
	line-height: 24px;
	font-size: 12px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  word-break: break-all;
	color:#fff;
	z-index: 3;
} */
</style>
