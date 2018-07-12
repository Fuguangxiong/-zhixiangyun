<template>
<div class="appfs_appBottomRmphb" :class="type">		
	<p class="appfs_appBottomRmphbTop">
		<span class="icon iconfont icon-youqinglianjie"></span>友情链接
	</p>
	<div class="appfs_appBottomList" >
		<p @click="appServiceDetail(list.url)" v-for="list in appFriendshipList" :key="list.id" :title="list.title">
				&#8901;&nbsp;&nbsp;{{list.title.length>7?(list.title.substring(0,7)):list.title}}</p>															
	</div>		
</div>		
</template>

<script>
	import apiToken from '../../../publicJs/apiToken.js'
  	import apiClient from '../../../publicJs/ApiClient.js'
  	
  	export default {
  		name : 'appFriendship',
  		pageSize:12,
  		pageNum:1,
  		data() {
  			return {
  				appFriendshipList:[]
  			}
  		},
		props:{
			type:"",
			configId:"",
		
		},
  		//获取数据
		mounted() {
			var that = this;
			console.log(this.myData);
			var myData  ={
				'templateId':window.configinfo.configId,
				'contentType':'link ',
				"pageNum": '1',
				"pageSize":'12'
			}
			apiClient.get(apiToken.newApi('/appmarket/content/getCotentByType/'), myData, function(data) {	
			console.info('友情连接',data)
				that.appFriendshipList = data.results.data;
				
			})

		},
		methods: {
			appServiceDetail(url){//详情页路由调用
				window.open(url, '_blank');
			}
		}
  	}
</script>

<style scoped>
/* .appfs_appBottomRmphb{
	width:32%;
	height:512px;
	border-radius: 5px;
	box-shadow: 0px 0px 1px 1px rgba(0,0,0,0.1);
	background-color: #fff;
	float: left;
	margin-right: 24px;
}

.appfs_appBottomRmphbTop{
	width:100%;
	height:45px;
	line-height: 45px;
	font-size: 14px;
	padding:0 0 0 10px;
	font-weight: bold;
	border-bottom:1px solid rgb(238,238,238);
	color:rgb(51,51,51)
}
.appfs_appBottomRmphbTop>span{
	margin-right: 8px;
	color:#ff6668;
}
.appfs_appBottomRmphb:last-child>.appfs_appBottomRmphbTop{
	border-bottom:1px solid rgb(238,238,238)
}

appfs_.appBottomRmphb>.appfs_appBottomList{
	width:100%;
	padding:13px 13px 0 13px;	
	
}
.appfs_appBottomRmphb>.appfs_appBottomList>p{
	width:145px;
	height:42px;
	float: left;
	background:#fff;
	border-radius: 3px;
	padding-left: 20px;
	text-align: left;
	line-height: 42px;
	font-size: 13px;
	margin-bottom:15px;
	margin:10px 17px;
	color:rgb(51,51,51);
	cursor: pointer;
	overflow:hidden;
    border: 1px dashed #dedede;

}
.appfs_appBottomRmphb>.appfs_appBottomList>p:hover{
	border:1px solid rgb(178,208,245);
	color:rgb(107,179,253)
} */
</style>
