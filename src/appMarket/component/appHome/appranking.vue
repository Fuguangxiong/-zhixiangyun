<template>
	<div class="apprk_appBottomRmphb" :class="type">
        <p class="apprk_appBottomRmphbTop">
            <span><img src="../../images/ToptenImg.png"/></span>热门排行榜
        </p>
        <ul>
            <li v-for="(item,index) in topChartsList" :key="index" @click="appServiceDetail(item)">
                <span class="topindex">{{index+1}}.</span>
                <div><img v-lazy="topChartsListimg[index]" /></div>
                <p>{{item.server_name}}</p>
                <span>{{item.serverAccessNum}} 次</span>
            </li>
        </ul>
    </div>	
</template>

<script>
	import apiToken from '../../../publicJs/apiToken.js'
    import apiClient from '../../../publicJs/ApiClient.js'  	
    import appPublicJs from '../../common/public.js'
  	export default {
  		name : 'appranking',
  		data() {
  			return {
                total:'',//热门排行榜总人数
  				topChartsList:[],
				topChartsListimg:[],
  			}
		  },
		props:{
			type:"",
			configId:"",
			
		},
  		//获取数据
		mounted() {
			this.getTopCharts();//热门排行榜
		},
		methods: {
            getTopCharts(){
				var that = this;
				var myData = {
					'templateId':window.configinfo.configId,
				}
				apiClient.get(apiToken.newApi('/appmarket/handle/getAtomicAccessList/'), myData, function(data) {
					if(appPublicJs.checkData(data.results.data)){
					that.topChartsList = data.results.data;
					for (var i=0; i<data.results.data.length; i++) {
						that.topChartsListimg.push(apiClient.apiBaseUrl + appPublicJs.serviceImgShow +data.results.data[i].img + "&token="+apiClient.token)
					};
					that.total = data.results.total;
				}
				})
			},
			appServiceDetail(serverId) {
				let that = this,id;
				if(serverId.serverId){
					id = serverId.serverId;
				}else{
					id = serverId.id;
				}
				that.$router.push({name:'appServiceDetail',query:{id:id}});
			},
		}
  	}
</script>

<style  scoped>
/* .apprk_appBottomRmphb{
	width:32%;
	height:512px;
	border-radius: 5px;
	box-shadow: 0px 0px 1px 1px rgba(0,0,0,0.1);
	background-color: #fff;
	float: left;
	margin-right: 24px;
}

.apprk_appBottomRmphbTop{
	width:100%;
	height:45px;
	line-height: 45px;
	font-size: 14px;
	padding:0 0 0 10px;
	font-weight: bold;
	border-bottom:1px solid rgb(238,238,238);
	color:rgb(51,51,51)
}
.apprk_appBottomRmphbTop>span{
	margin-right: 8px;
	color:#ff6668;
}
.apprk_appBottomRmphb>ul{
	width:100%;
}
.apprk_appBottomRmphb>ul>li{
	width:100%;
	height:45px;
	line-height: 45px;
	font-size: 13px;
	position: relative;
	overflow: hidden;
	border-bottom:1px  dashed rgb(238,238,238);
	padding:0 15px 0 11px;
	color:rgb(51,51,51);
	transition:all 1.5s ;
	cursor: pointer;	
}
.apprk_appBottomRmphb>ul>li:hover{
	height:64px;
	background:rgb(243,247,253);
	color:#000
}
.apprk_appBottomRmphb>ul>li>span:first-child{
	width:25px;
	height:45px;
	text-align:center;
	line-height: 46px;
	color:#000;
	float:left;
	font-size: 13px;
	color:rgb(51,51,51);
}
.apprk_appBottomRmphb>ul>li:hover>.icon-sanjiaoxing:first-child{
    width: 25px;
    height: 25px;
    text-align: center;
    line-height: 25px;
    color: rgb(255,102,102);
    float: left;
    position: absolute;
    top: -2px;
    left: 0px;
    display: inline-block;
    font-size: 30px;
}
.apprk_appBottomRmphb>ul>li>.topnum{
	width: 25px;
    height: 25px;
    text-align: center;
    line-height: 30px;
    margin-top: 6px;
    border-radius: 50%;
    float: left;
    font-size: 12px;
}
.apprk_appBottomRmphb>ul>li:hover>.topnum{
	width:25px;
	height:25px;
	text-align:center;
	line-height: 25px;
	color:#fff;
	position: absolute;
	top: -8px;
    left: -5px;
}
.apprk_appBottomRmphb>ul>li .icon-sanjiaoxing:first-child{
	display: none
}
.apprk_appBottomRmphb>ul>li:hover>.topindex{
	width:25px;
	height:25px;
	text-align:center;
	line-height: 25px;
	background:rgb(255,102,102);
	border-radius: 50%;
	color:#fff;
	float:left;
	position: absolute;
	top:16px;
	left:10px;
}

.apprk_appBottomRmphb>ul>li>div{
	display: none;

}
.apprk_appBottomRmphb>ul>li:hover>div{
	width:38px;
	height:36px;
	border-radius: 3px;
	background:#666;
	float:left;
	margin:15px 14px 0 28px;
	display: block;
}
.apprk_appBottomRmphb>ul>li>div>img{
	width:100%;
	height:100%;
	border-radius: 3px;	
	vertical-align: baseline;
}
.apprk_appBottomRmphb>ul>li>p{
	overflow:hidden;	
	text-overflow: ellipsis;
	white-space: nowrap;
	height:42px;
	line-height: 42px;
	font-size: 12px;
	float:left;
	width:50%;
}
.apprk_appBottomRmphb>ul>li:hover>p{
	height:64px;
	line-height: 64px;
	width:40%;
}
.apprk_appBottomRmphb>ul>li>span:last-child{
	font-size: 12px;
	float:right;
	line-height: 42px;
	color:rgb(51,51,51);
	
}
.apprk_appBottomRmphb>ul>li:hover>span:last-child{
	float:right;
	line-height: 64px;
	color:#000
}
.apprk_appBottomRmphb>ul>li>span:first-child{
	width:25px;
	height:25px;
	text-align:center;
	line-height: 30px;
	margin-top:6px;
	border-radius: 50%;
	float:left;
	font-size: 12px;
}
.apprk_appBottomRmphb>ul>li>span:last-child{
	float:right;
	font-size: 12px;
	overflow: hidden;
}
.apprk_appBottomRmphb>ul>li:last-child{
	border-bottom: none;
}
.apprk_appBottomRmphb:last-child>.apprk_appBottomRmphbTop{
	border-bottom:1px solid rgb(238,238,238)
} */

</style>
