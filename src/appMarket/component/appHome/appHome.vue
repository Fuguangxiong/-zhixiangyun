<template>
	<div class="App">
		<top-header :tokenId="tokenId" :userName="userInfo.PHONE" ></top-header>


		<div class="content">
		<components v-for="(item, index) in dataList" :is="item" :key="index" :type="item" :configId="configId"  :page="page[index]" ></components>
		</div>

		<footer-box></footer-box>
	</div>
</template>
<script>
    import '../../css/public.css';
  	import appbanner from './appbanner.vue';
	import appsearch from './appSearch.vue';
  	import apphotrecommended  from './appHotRecommended.vue';
  	import appwonderfulspecial from './appWonderfulSpecial.vue';
  	import appnewapplication  from './appNewApplication.vue';
	import appfriendship from './appFriendship.vue';
	import appranking  from './appranking.vue';
	import appnewarrival  from './appnewarrival.vue';	  
	import topHeader from '../../../publicComponent/topHeader.vue'
	import footerBox from './footer.vue'
  	import apiToken from '../../../publicJs/apiToken.js'
	import apiClient from '../../../publicJs/ApiClient.js' 
	import userService from '../../../publicJs/userService.js' 
	import UserCookieService from '../../../publicJs/UserCookieService.js' 
  	import appPublicJs from '../../common/public.js'
	export default {
		name: 'appHomes',
		data() {
			return {
				tokenId:null,
				template:"",
				userInfo: {
				      PHONE: "",
				      IMAGE: ""
				},
				loginFlag:false,
				dataList:window.configinfo.dataList,
				page:window.configinfo.page,
				configId:window.configinfo.configId,
			}  
		},
		components: {
			appbanner,
			appsearch,
			apphotrecommended,
			appwonderfulspecial,
			appnewapplication,
			appfriendship,
			appranking,
			appnewarrival, 		
			topHeader,
			footerBox,
		},
		created() {
			this.tokenId = this.$route.query.tokenId || userService.getTokenId();
			if(this.tokenId!=undefined){
//				userService.storeInfo("tokenId",this.tokenId);
				this.loginFlag = appPublicJs.checkLogin(this.tokenId);
			}
		},
		watch:{
			dataList(newval,oldval){
				if(appPublicJs.checkData(newval))
				this.$nextTick(function () {
					this.dosometing(0)
				})
			},
		},
		mounted() {
			if(this.loginFlag){
				var that=this;
				UserCookieService.userInfoToCookie(this.tokenId,function(userName,images){
					that.userInfo.PHONE = userName;
					that.userInfo.IMAGE =images; 
				});
			}
			this.getIcon()
			this.dosometing(0)
		},
		methods: {
			dosometing(num){	
				let obj={
					appfriendship:true,
					appranking:true,
					appnewarrival:true
				}
				let index=0
				let str=""
				for (let i = num; i < this.dataList.length; i++) {
					let el = this.dataList[i];
					if(obj[el]){
						$("."+el).wrap('<div class="appBottomBox"><div class="appBottom clearfix"></div></div>')
						str="."+el
						index=i
						num=i+1
						break
					}				
				}
				if(obj[this.dataList[index+1]]){
					$(str).parent().parent().next().appendTo($(str).parent())
					num=index+2;
					if(obj[this.dataList[index+2]]){
						$(str).parent().parent().next().appendTo($(str).parent())
						num=index+3
					}
				}
				if (num>0&&num<this.dataList.length&&index!=0) {
					this.dosometing(num)
				}
			},
			getIcon () {
				var that = this
				var myData = {
					templateId:window.configinfo.configId,
					contentType: 'basic',
					contentName: '图标配置'
				}
				apiClient.get(apiToken.newApi('/appmarket/content/getCotentByType/'), myData, function (data) {
					if (appPublicJs.checkData(data.results.data)) {
						var list = data.results.data
						var link = document.getElementById('link1')
						for (var i = 0; i < list.length; i++) {
							if (list[i].type == '0') {
							link.href = apiClient.apiBaseUrl + '/appmarket/upload/picimg?token=' + apiClient.token + '&img=' + list[i].src
							}
						}
					}
				})
			}
		}
	}
</script>
<style scoped>
.content {
    min-height: 660px;
    padding-top: 30px;
}
.App {
    overflow-y: auto;
    overflow-x: hidden;
    min-height: 100%;
}

.content {
    min-height: 660px;
    padding-top: 30px;
}
</style>
