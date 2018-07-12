<template>
	<div class="appImgConfigBox">
		<div class="appImgConfigTop">
			<span>图标配置</span>
		</div>
		<div class="appImgConfigContent">
			<div class="appImgConfigContentTp">
				<div class="appImgConfigContentTpTt">
					<span class="icon iconfont icon-diqiu-copy"></span>&nbsp;浏览器LOGO
				</div>
				<div class="appImgConfigLogo">
					<div class="appImgConfigLogoFromOut">
						<form name="mainForm">
							<input  id="id1" type="file" @change="handleLogo('0')"/>
							<img class="browserImg" v-lazy="dataArry[0].imageUrl" alt="" :class="{hidBox:!dataArry[0].hideFlag}">
							<label for="id1"></label>
							<div :class="{hidBox:dataArry[0].hideFlag}" class="addbox">
								<i class="el-icon-plus avatar-uploader-icon"></i>
							</div>
						</form>
						<!--<span class="icon iconfont icon-guanbi"></span>-->
					</div>
					<p>建议上传图片为20*20 大小不超过20k</p>
				</div>
				<div class="appImgConfigLogoImg">
					<img src="../../images/wenicon.png" />
				</div>
			</div>
			<div class="appImgConfigContentTp">
				<div class="appImgConfigContentTpTt">
					<span class="icon iconfont icon-wangzhangk"></span>&nbsp;导航栏LOGO
				</div>
				<div class="appImgConfigLogo">
					<div class="appImgConfigLogoFromOut appImgConfigLogoFromOut1">
						<form name="mainForm">
							<input  id="id2" type="file" @change="handleLogo('1')"/>
							<img class="websiteImg" v-lazy="dataArry[1].imageUrl" alt="":class="{hidBox:!dataArry[1].hideFlag}" >
							<label for="id2"></label>
							<div :class="{hidBox:dataArry[1].hideFlag}" class="addbox">
								<i class="el-icon-plus avatar-uploader-icon"></i>
							</div>
						</form>
						<!--<span class="icon iconfont icon-guanbi"></span>-->
					</div>
					<p>建议上传图片为150*50 大小不超过20k</p>
				</div>
				<div class="appImgConfigLogoImg appImgConfigLogoImg1">
					<img src="../../images/bannerlog.png"/>
				</div>
			</div>
			<div class="appImgConfigContentTp">
				<div class="appImgConfigContentTpTt">
					<span class="icon iconfont icon-wangzhangk"></span>&nbsp;搜索LOGO
				</div>
				<div class="appImgConfigLogo">
					<div class="appImgConfigLogoFromOut appImgConfigLogoFromOut1">
						<form name="mainForm">
							<input  id="id2" type="file" @change="handleLogo('2')"/>
							<img class="websiteImg" v-lazy="dataArry[2].imageUrl" alt="":class="{hidBox:!dataArry[2].hideFlag}" >
							<label for="id2"></label>
							<div :class="{hidBox:dataArry[2].hideFlag}" class="addbox">
								<i class="el-icon-plus avatar-uploader-icon"></i>
							</div>
						</form>
						<!--<span class="icon iconfont icon-guanbi"></span>-->
					</div>
					<p>建议上传图片为150*50 大小不超过20k</p>
				</div>
				<div class="appImgConfigLogoImg appImgConfigLogoImg1">
					<img src="../../images/seachlog.png"/>
				</div>
			</div>
			
		</div>
		<div class="appImgConfigBottom">
				<button @click="saveIcon">保存</button>
				<button @click="resetIcon">重置</button>
		</div>
	</div>
</template>

<script>
	  import apiToken from '../../../publicJs/apiToken.js'
	  import apiClient from '../../../publicJs/ApiClient.js'
	  import TipBoxService from '../../../publicJs/TipBoxService.js'
	  import LoadingBoxService from '../../../publicJs/LoadingBoxService.js'
	  import appPublicJs from '../../common/public.js'
	  	import NoticeBoxService from '../../../publicJs/NoticeBoxService.js'
	  export default {
	  	name: 'appImgConfig',
	  	data() {
	  		return {  			
				dataArry:[
				 {
	  				'id': '',
	  				'fileName': '',
					'imageUrl': '',
					"hideFlag":false
	  			},
	  			 {
	  				'id': '',
	  				'fileName': '',
					'imageUrl': '',
					"hideFlag":false
				},
				 {
	  				'id': '',
	  				'fileName': '',
					'imageUrl': '',
					"hideFlag":false
				  },
				],   
	  		}
	  	},
	  	mounted() {
	  		this.showIcon();
	  	},
	  	methods: {
	  	//上传之前校验图片
	      beforeAvatarUpload(file) {
	      	var fileType = file.type === 'image/jpeg' || file.type === 'image/png';
	      	var flag =true;
	        if (!fileType) {
	          this.$message.error('上传头像图片只能是 JPG 或 PNG格式!');
	          flag =false;
	        }
	        var isLt2M = appPublicJs.checkfile(file, 0.02);
	        if (!isLt2M) {
	          this.$message.error('上传图片大小不能超过 20K!');
	        }
	        return flag && isLt2M;
	      },
	  		//上传图片
	  		handleLogo(imgIndex) {
	  			var that = this;
				that.file = event.currentTarget.files[0];
				var imgFlag = this.beforeAvatarUpload(that.file);
				if (imgFlag) {
					apiClient.upload("/appmarket/upload/uploadFile?method=uploadFile", that.file, '').then(data => {			
						that.dataArry[imgIndex].imageUrl = apiClient.apiBaseUrl + '/appmarket/upload/picimg?token=' + apiClient.token + '&img=' + data.fileName;
						that.dataArry[imgIndex].fileName = data.fileName;
						that.dataArry[imgIndex].hideFlag = true;	
					})
				}
	  		},
			  //点击保存
			saveIcon(){
				for (let i = 0; i < this.dataArry.length; i++) {
					var list=this.dataArry[i];
					if(list.fileName!=""&&list.fileName){
						if(list.id){
							var myData = {
							'templateId':this.$route.query.temId,
							"id": list.id,
							"src": list.fileName,
							"type": i,
							"sort_order":i+1,
							"contentType": "basic",
							"contentName": "图标配置",
							}
							this.updateContent(myData);
						}else{
							var myData = {
							'templateId':this.$route.query.temId,
							"src": list.fileName,
							"sort_order":i+1,
							"type": i,
							"contentType": "basic",
							"contentName": "图标配置",
							"baseSrc":list.fileName
							}
							this.saveContent(myData);
						}	
					}else{
					}												
				}			
			},
	  		//调用公共保存方法
	  		saveContent(myData) {
	  			apiClient.post(apiToken.newApi('appmarket/content/saveCotent/'), myData, function(data) {
	  				if (data.results.status == true) {
	  					TipBoxService.open("保存成功！", 0);
	  				} else {
	  					TipBoxService.open("保存失败！", 1);
	  				}
	  			});
	  		},
	  		//调用公共修改方法
	  		updateContent(myData,msg) {
	  			apiClient.put(apiToken.newApi('appmarket/content/updateContent/'), myData, function(data) {
	  				if (data.results.status == true) {
						  if(msg!=undefined){
							  TipBoxService.open(msg, 0);
						  }else{
							  TipBoxService.open("保存成功！", 0);	
						  }
	  				} else {
	  					TipBoxService.open("保存失败！", 1);
	  				}
	  			});
	  		}, 

	  		//图标回显
	  		showIcon() {
	  			var that = this;
	  			var myData = {
					'templateId':this.$route.query.temId,
	  				'contentType': 'basic',
	  				"contentName": "图标配置"
	  			}
	  			apiClient.get(apiToken.newApi('/appmarket/content/getCotentByType/'), myData, function(data) {
	  				if (appPublicJs.checkData(data.results.data)) {
						var list = data.results.data;
					 	for (let i = 0; i < list.length; i++) {
							var element = list[i];
							that.dataArry[i].id = element.id;
							that.dataArry[i].imageUrl = apiClient.apiBaseUrl + '/appmarket/upload/picimg?token=' + apiClient.token + '&img=' + element.src;
							that.dataArry[i].fileName = element.fileName;
							that.dataArry[i].hideFlag = true;
							that.dataArry[i].baseSrc=element.baseSrc;
						 }  
	  				}
	  			});
			},
			resetIcon(){		
				var that=this;
				NoticeBoxService.open('确定重置吗?',function(val){
				NoticeBoxService.close();	
				for (let i = 0; i < that.dataArry.length; i++) {			
					if(that.dataArry[i].baseSrc!=""){
						that.dataArry[i].imageUrl=apiClient.apiBaseUrl + '/appmarket/upload/picimg?token=' + apiClient.token + '&img=' + that.dataArry[i].baseSrc;
						var myData = {
							'templateId':this.$route.query.temId,
							"id": that.dataArry[i].id,
							"src": that.dataArry[i].baseSrc,
							"contentType": "basic",
							"contentName": "图标配置",
							}
				
						that.updateContent(myData,"重置成功");
						
					}				
				}
				},function(val){
			});
			},

	  	}
	  }
</script>

<style src='../../css/appImgConfig.css' scoped></style>