<template>
<div class="appwds_appJingcaibox">
	<div class="appwds_appJingcai">
		<div class="appwds_appJingcaiTop appwds_timeX">
			<h4><span><img src="../../images/app_logo.png"/></span><em>精彩专题</em></h4>
			<p @click="subjectRout"><i class="icMove"></i></p>
		</div>
		<div class="appwds_appJingcaiContent" >
			<div class="appwds_appJingcaiContentLeft">
				<ul class="appwds_appBiaoqian">
					<li @click='leftGoDetail'>
						<img v-lazy="leftImg" />
					</li>
				</ul>
				<div class="appwds_appJingcaiContentLeftBottom">
					<div class="appwds_nullMsg" v-show='rightServerArr[0]==undefined'>暂无服务</div>
					<p @click="appServiceDetail(item.id)" v-for="item in rightServerArr"  @mouseenter='switchBoxServer(item)' :title="item.name">{{item.name|filterFun}}</p>
				</div>
			</div>
			<ul class="appwds_appJingcaiContentRight">
				<li v-for="list in wonderfulSpecialList" @click="appServiceSubject(list)" @mouseenter='switchBoxModule(list)'>
					<img v-lazy="list.pic" />
					<p>{{list.title}}</p>
				</li>					
			</ul>
		</div>
	</div>
</div>
</template>
<script>
	import apiToken from '../../../publicJs/apiToken.js'
  	import apiClient from '../../../publicJs/ApiClient.js'
  	import LoadingBoxService from '../../../publicJs/LoadingBoxService.js'
  	import Util from '../../../publicJs/Util.js'
  	 import appPublicJs from '../../common/public.js'
	export default {
		name : 'appWonderfulSpecial',
		data() {
			return {
				wonderfulSpecialList:[]	,
				tagsList:[],
				leftImg: require('../../images/show.jpg'),
				leftId:'',
				rightServerArr:[]
			}
		},
		//获取数据
		mounted() {
			this.getDataList()
		},
		props:{
			configId:"",
		
		},
		filters: {
        filterFun: function(value) {
          return value.length>6?value=value.substring(0,6):value
        }
       },
		methods: {
			/*左侧进详情*/
			leftGoDetail(){
				console.log(this.leftId)
				if(this.leftId!=''&&this.leftId!=undefined&&this.leftId!=null){
					this.$router.push({name:'appServiceDetail',query:{id:this.leftId}}) 
				}
			},
			switchBoxModule(list){
				if(Util.isArray(list.atomics)){
					this.rightServerArr = list.atomics.length <= 6?list.atomics:list.atomics.slice(0,6);
					if(list.atomics.length > 0 ){
					this.leftImg = apiClient.apiBaseUrl + appPublicJs.serviceImgShow +list.atomics[0].bg_img +'&token'+apiClient.token;
					this.leftId = list.atomics[0].id
					}else{
						this.leftImg = require('../../images/show.jpg');
						this.leftId = ''
					}
				}
				
			},
			switchBoxServer(item){
					this.leftImg = apiClient.apiBaseUrl + appPublicJs.serviceImgShow +item.bg_img +'&token'+apiClient.token;
					this.leftId = item.id;
			},
			getDataList(){
				var that = this;
				var myData  ={
					'templateId':window.configinfo.configId,
					'contentType':'subject',
					"pageSize": "4"
				}
				apiClient.get(apiToken.newApi('appmarket/content/getCotentBySubjectToShow/'), myData, function(data) {
					if(appPublicJs.checkData(data.results.data)){
						that.wonderfulSpecialList = data.results.data;
						var wonderfulSpecialListLength = that.wonderfulSpecialList.length;
						for(var i = 0; i < wonderfulSpecialListLength; i++) {
//							if(that.wonderfulSpecialList[i].pic.indexOf('http')<0){
								that.wonderfulSpecialList[i].pic = apiClient.apiBaseUrl + '/appmarket/upload/picimg?token='+apiClient.token+'&img=' + that.wonderfulSpecialList[i].pic;
//							};
						}
						that.switchBoxModule(that.wonderfulSpecialList[0]);
					}
					
				})
			},
			subjectRout() {//精彩专题详情页路由调用
				let that = this
				that.$router.push({name:'appWonderfulSpecialColumn',})
			},
			appServiceDetail(id){//服务详情
				let that = this
				that.$router.push({name:'appServiceDetail',query:{id:id}}) 
			},
			appServiceSubject(item){
				if(appPublicJs.checkData(item.tags)){
					item.tags = item.tags.length > 1?item.tags.join(','):item.tags[0]
				}
				this.$router.push({name:'appFinancialEducationSeries',query:{id:item.id,tag:item.tags}}) 
			}
		}
	}
</script>
<style scoped>
.appwds_appJingcaibox{
    background-color: #fafafa;
}
.appwds_appJingcai{
	width: 1200px;
    margin: 0 auto;
    padding: 0;
	overflow: hidden;
	height:435px;
	background:rgb(250,250,250);
}
.appwds_appJingcaiTop{
	width:100%;
	height:54px;
	line-height: 54px;
	margin-top: 5px;
}
.appwds_appJingcaiTop>h4{
	float:left;
	font-size: 18px;
	color:rgb(51,51,51);
	margin-top: 20px;
}
.appwds_appJingcaiTop>h4>span{
	margin-right: 6px;
	float: left;
}
.appwds_appJingcaiTop>h4>em{
	float: left;
	font-style: normal;
	margin-top: 1px;
}
.appwds_appJingcaiTop>p{
	float:right;
	padding-top: 24px;
	cursor: pointer;
}
.appwds_appJingcaiContent{
	width:100%;
	height:355px;	
}
.appwds_appJingcaiContentLeft{
	width:58%;
	height:350px;
	float:left;
	background:#666;
	position: relative;	
	overflow: hidden;
	border-radius: 5px;	
}
.appwds_appJingcaiContentLeft>ul{
	width:100%;
	height:100%;
	position: absolute;
	top:0;
	left:0;
	cursor: pointer;
}
.appwds_appJingcaiContentLeft>ul>li{
	width:100%;
	height:100%;
}
.appwds_appJingcaiContentLeft>ul>li>img{
	width:100%;
	height:100%;
}
.appwds_appJingcaiContentLeftBottom{
	width:100%;
	height:50px;
	line-height: 50px;
	color:#fff;
	font-size: 14px;
	background:rgba(0,0,0,0.5);
	position: absolute;
	left:0;
	bottom:0;
	cursor: pointer;

}
.appwds_appJingcaiContentLeftBottom>p{
	width:16.66%;
	text-align: center;
	float:left;
	border-right: 1px solid rgba(0, 0, 0, 0.2);
}
.appwds_appJingcaiContentLeftBottom>p:last-child{
	border-right: none;
}
.appwds_appJingcaiContentLeftBottom>p:hover{
	background:rgba(50,146,146,0.5);
}
.appwds_appJingcaiContentRight{
	width:40%;
	height:350px;
	float:right;
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;	
}
.appwds_appJingcaiContentRight>li{
	height:170px;
	width:48%;
	position: relative;
	background:#666;
	border-radius: 4px;
	transition:all .5s;
	font-size: 14px;
	cursor: pointer;
	margin-bottom:10px
}
.appwds_appJingcaiContentRight>li:hover{
	box-shadow: 0 0 10px rgba(0,0,0,0.6);
}
.appwds_appJingcaiContentRight>li>img{
	width:100%;
	height:100%;
	border-radius: 4px;
}
.appwds_appJingcaiContentRight>li:hover>p{


	background:rgba(0,0,0,1);
}
.appwds_appJingcaiContentRight>li>p{
	width:100%;
	height:34px;
	text-align: center;
	line-height: 34px;
	transition:all .5s;
	position: absolute;
	bottom:0;
	left:0;
	background:rgba(0,0,0,0.6);
	color:#fff;	
	border-radius:0 0 3px 3px;
}
.appwds_appJingcaiContentLeft>.appwds_appBiaoqian>li{
	overflow: hidden;
}
.appwds_appJingcaiContentLeft>.appwds_appBiaoqian>li:hover>img{
	transform: scale(1.1);
	transition: 1s;
}
.appwds_appJingcaiContentLeft>.appwds_appBiaoqian>li>img{
	transition: 1s;
}
.appwds_appJingcaiContentRight>li{
	overflow: hidden;
}
.appwds_appJingcaiContentRight>li:hover>img{
	transform: scale(1.1);
	transition: 1s;
}
.appwds_appJingcaiContentRight>li>img{
		transition: 1s;
}
.appwds_nullMsg{
	text-align: center;
}
</style>
