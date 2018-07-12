<template>
  <div class="appnewa_appXinrui">
    <div class="appnewa_appXinruiTop appnewa_timeX">
      <h4><span><img src="../../images/app_logo.png"/></span><em>新锐应用</em></h4>
      <p @click="toMore"><i class="icMove"></i></p>
      <!--<img src="../../images/more.png" />-->
    </div>
    <ul class="appnewa_appXinruiContent clearfix">
      <li v-for=" (item,index) in newApp" >
        <div class="appnewa_appXinruiContentTop">
          <div class="appnewa_appXinruiContentLeft"><img v-lazy="imgSrc[index]" style="width:100%; height:100%"/></div>
          
        </div>
        <div class="appnewa_appXinruiContentRight">
            <h5>{{item.name}}</h5>       
        </div>
        <div class="appnewa_appXinruiContentBottom">
          {{item.service_brief|filterFun}}
        </div>
          <p @click="toUse(item.id)" class="appnewa_nowuser">立即使用</p>
      </li>
    </ul>
  </div>
</template>

<script>
  import apiToken from '../../../publicJs/apiToken.js'
  import apiClient from '../../../publicJs/ApiClient.js'
  import TipBoxService from '../../../publicJs/TipBoxService.js'
  import LoadingBoxService from '../../../publicJs/LoadingBoxService.js'
  import appPublicJs from '../../common/public.js'
  export default {
    name: '',
    data () {
      return {
        newApp: '',
        imgSrc: [],
        hotKeyWord: '2'
      }
    },
    props: {
      configId: '',
      page: ''
  
    },
    filters: {
      filterFun: function (value) {
        if (value != undefined) {
          return value.length > 60 ? value = value.substring(0, 60) + '...' : value
        }
      }
    },
    components: {
    },
    created () {

    },
    mounted () {
      this.getNewApp()
    },
    methods: {
      getNewApp () {
        var that = this
        var myData = {
          'templateId': window.configinfo.configId,
          'pageSize': '8',
          'pageNum': '1',
          'sum': '200',
//        "query": "qq",
          'form': '2',
          'status': '0'
        }
        apiClient.get(apiToken.newApi('appmarket/atomic/getAtomicRecommendList/'), myData, function (data) {
          if (appPublicJs.checkData(data.results.data)) {
            var data = data.results.data
            that.newApp = data
            for (var i = 0; i < data.length; i++) {
              that.imgSrc.push(apiClient.apiBaseUrl + appPublicJs.serviceImgShow + data[i].bg_img + '&token=' + apiClient.token)
            }
          }
        })
      },
      toMore: function () {
        this.$router.push({
          path: '/appHotMore',
          query: {
            hotKeyWord: this.hotKeyWord
  
          }
        })
      },
      toUse: function (id) {
      	  this.$router.push({path: '/appServiceDetail', query: {id: id, templateId: window.configinfo.configId}})
      }
    }
  }
</script>
<style  scoped>
/* .appnewa_appXinrui{
  width: 1216px;
  margin: 0 auto;
  padding: 0;
  margin-bottom: 20px;
	overflow: hidden;
	background: #fff;
}
.appnewa_appXinruiTop{
	width:100%;
	max-width: 1200px;
	margin:0 auto ;
	margin-top: 5px;
	height:54px;
	line-height: 54px;
}
.appnewa_appXinruiTop>h4{
	margin-top: 20px;
	float:left;
	font-size: 18px;
	color:rgb(51,51,51)
}
.appnewa_appXinruiTop>h4>span{
	margin-right: 6px;
	float: left;
}
.appnewa_appXinruiTop>h4>em{
	float: left;
	font-style: normal;
	margin-top: 1px;
}
.appnewa_appXinruiTop>p{
	float:right;
	padding-top: 24px;
	cursor: pointer;
}
.appnewa_appXinruiContent{
	width:100%;
}
.appnewa_appXinruiContent>li{
	position: relative;
	width:24%;
	height:296px;
	border-radius: 4px;
	transition: all .5s;
	border:1px solid rgba(0,0,0,0.1);
	padding: 12px;
	float: left;
	margin-right: .5%;
	margin-left: .5%;
	margin-bottom: 12px;
}
.appnewa_appXinruiContent>li:last-child{
	margin-right: 0;
}
.appnewa_appXinruiContent>li:hover{
	box-shadow: 0 0 10px rgba(0,0,0,0.4);
}
.appnewa_appXinruiContentTop{
	height:148px;
	width:100%;
	background:#fafafa;
}
.appnewa_appXinruiContentLeft{
	width:100%;
	height:148px;
	background:#666;
	border-radius: 3px;
	margin-bottom:20px;
}
.appnewa_appXinruiContentLeft>img{
	border-radius: 3px;
}
.appnewa_appXinruiContentRight{
	width:100%;
	height:37px;
}
.appnewa_appXinruiContentRight>h5{
	height:37px;
	line-height: 37px;
    font-weight: 600;
	font-size: 15px;
	display: block;
	overflow:hidden;	
	text-overflow: ellipsis;
	white-space: nowrap;
	width:80%;
	color:rgb(51,51,51)
}
.appnewa_appXinruiContentRight>p:nth-child(2){
	height:36px;
	line-height: 36px;
	font-size:12px;
	color:rgb(51,51,51) 
}
.appnewa_appXinruiContentRight>p:nth-child(2)>span{
	margin-right: 4px;
	cursor: pointer;
}
.appnewa_appXinruiContentRight>p:nth-child(3){
	width:66px;
	height:25px;
	text-align: center;
	line-height: 25px;
	background:rgb(251,98,51);
	color:#fff;
	font-size: 12px;
	float:right;
	border-radius: 4px;
	cursor: pointer;
}
.appnewa_nowuser{
	width: 66px;
    height: 26px;
	position: absolute;
	bottom: 10px;
	right: 10px;
    text-align: center;
    line-height: 26px;
    font-size: 12px;
    float: right;
    border-radius: 3px;
    cursor: pointer;
    color: #fb6233;
    border: 1px solid;
    transition: all .3s;
}
.appnewa_nowuser:hover{
	border: 1px #fb6233 solid;
	background: #fb6233;
    color: #fff;
}
.appnewa_appXinruiContentBottom{
	 word-break: break-all;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    overflow: hidden;
    font-size: 12px;
    width: 100%;
    line-height: 18px;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #666;
    height: 60px;
}
.appnewa_appTiao{
	overflow: hidden;
	width:100vw;
	height:15px;
	background:rgb(250,250,250);
	margin-bottom:15px;
} */
</style>
