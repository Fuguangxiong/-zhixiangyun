<template>
	<div class="appBannerImgConfigAll">
		<div class="appImgConfigBox">
		<div class="appBannerImgTitle">
			<span class="">轮播图</span>
		</div>
		<div class="appBannerImgCenter">
			<ul>
				<li class="appBannerImgListItem">
					<div class="box">
						<div class="imgWid">
							<form name="mainForm">
								<input @change="handleFileChange(1)" id="id1" type="file" />
								<img v-lazy="obj1.imageUrl"  :class="{hidBox:!hideFlag1}" />
								<label for="id1"></label>
								<div :class="{hidBox:hideFlag1}">
									<i class="icon iconfont icon-tianjiatupian"></i>
								</div>
							</form>
						</div>
					</div>
					<div class="appBannerImgText">建议上传图片尺寸为1920*540，大小不超过200k（图片支持格式png、jpg）</div>
					<div class="appBannerImgUrlText">
						<el-radio-group v-model="radio1" @change="handleUrlTypeChange(radio1,1)">
							<el-radio class="radio" label="outside">外部URL</el-radio>
							<el-input class="appBannerImgInputLabel" v-model.trim="input1_outside" placeholder="请输入内容" :disabled="outflag1"></el-input><br />
							<el-radio class="radio" label="inside">内部URL</el-radio>
							<el-input class="appBannerImgInputLabel" autocomplete="off"    @click.self="isShowSearched1=false" v-model.trim="input1_inside"  placeholder="请输入内容" :disabled="inflag1"></el-input><br />
							<div class="aui-dd-parent resize-to-input" v-show="isShowSearched1">
								<div class="aui-dropdown aui-dropdown-left">
									<ol class="last">
										<li  v-for="item in serverList" track-by="$index" :key="item.name">
											<a href="javaScript:void(0)" @click="selectItemInList1(item.id,item.name)" class="label-suggestion">
												<span :title="item.name"><em>{{item.name}}</em></span></a>
										</li>
									</ol>
								</div>
						    </div>
							<el-radio class="radio" label="noUrl">无URL</el-radio>
						</el-radio-group>
						
					</div>
				</li>
				<li class="appBannerImgListItem">
					<div class="box">
						<div class="imgWid">
							<form name="mainForm">
								<input @change="handleFileChange(2)" id="id2" type="file" />
								<img v-lazy="obj2.imageUrl"  :class="{hidBox:!hideFlag2}">
								<label for="id2"></label>
								<div :class="{hidBox:hideFlag2}">
									<i class="icon iconfont icon-tianjiatupian"></i>
								</div>
							</form>
						</div>
					</div>
					<div class="appBannerImgText">建议上传图片尺寸为1920*540，大小不超过200k（图片支持格式png、jpg）</div>
					<div class="appBannerImgUrlText">
						<el-radio-group v-model="radio2" @change="handleUrlTypeChange(radio2,2)">
							<el-radio class="radio" label="outside">外部URL</el-radio>
							<el-input class="appBannerImgInputLabel" v-model.trim="input2_outside" placeholder="请输入内容" :disabled="outflag2"></el-input><br />
							<el-radio class="radio" label="inside">内部URL</el-radio>
							<el-input class="appBannerImgInputLabel" autocomplete="off"  @click.self="isShowSearched2=false" v-model.trim="input2_inside"  placeholder="请输入内容" :disabled="inflag2"></el-input><br />
							<div class="aui-dd-parent resize-to-input" v-show="isShowSearched2">
								<div class="aui-dropdown aui-dropdown-left">
									<ol class="last">
										<li  v-for="item in serverList" track-by="$index" :key="item.name">
											<a href="javaScript:void(0)" @click="selectItemInList2(item.id,item.name)" class="label-suggestion">
												<span :title="item.name"><em>{{item.name}}</em></span></a>
										</li>
									</ol>
								</div>
						    </div>
							<el-radio class="radio" label="noUrl">无URL</el-radio>
						</el-radio-group>
					</div>
				</li>
				<li class="appBannerImgListItem">
					<div class="box">
						<div class="imgWid">
							<form name="mainForm">
								<input @change="handleFileChange(3)" id="id3" type="file" />
								<img v-lazy="obj3.imageUrl" alt="" :class="{hidBox:!hideFlag3}">
								<label for="id3"></label>
								<div :class="{hidBox:hideFlag3}">
									<i class="icon iconfont icon-tianjiatupian"></i>
								</div>
							</form>
						</div>
					</div>
					<div class="appBannerImgText">建议上传图片尺寸为1920*540，大小不超过200k（图片支持格式png、jpg）</div>
					<div class="appBannerImgUrlText">
						<el-radio-group v-model="radio3" @change="handleUrlTypeChange(radio3,3)">
							<el-radio class="radio" label="outside">外部URL</el-radio>
							<el-input class="appBannerImgInputLabel" v-model.trim="input3_outside" placeholder="请输入内容" :disabled="outflag3"></el-input><br />
							<el-radio class="radio" label="inside">内部URL</el-radio>
							<el-input class="appBannerImgInputLabel" autocomplete="off" @click.self="isShowSearched3=false" v-model.trim="input3_inside"  placeholder="请输入内容" :disabled="inflag3"></el-input><br />
							<div class="aui-dd-parent resize-to-input" v-show="isShowSearched3">
								<div class="aui-dropdown aui-dropdown-left">
									<ol class="last">
										<li  v-for="item in serverList" track-by="$index" :key="item.name">
											<a href="javaScript:void(0)" @click="selectItemInList3(item.id,item.name)" class="label-suggestion">
												<span :title="item.name"><em>{{item.name}}</em></span></a>
										</li>
									</ol>
								</div>
						    </div>
							<el-radio class="radio" label="noUrl">无URL</el-radio>
						</el-radio-group>
					</div>
				</li>
				<li style="clear: both;"></li>
			</ul>
		</div>
		<div class="appBannerBtn">
			<span class="savaBtn" @click="saveBanner">保存</span>
		</div>
	</div>
</div>
</template>
<script>
	import apiToken from '../../../publicJs/apiToken.js'
	import apiClient from '../../../publicJs/ApiClient.js'
	import TipBoxService from '../../../publicJs/TipBoxService.js'
	import LoadingBoxService from '../../../publicJs/LoadingBoxService.js'
	import appPublicJs from '../../common/public.js'
	export default {
		data() {
			return {
				radio1: 'noUrl',
				input1_outside: '',
				input1_inside: '',
				hideFlag1: false,
				outflag1: true,
				inflag1: true,
				
				radio2: 'noUrl',
				input2_outside: '',
				input2_inside: '',
				hideFlag2: false,
				outflag2: true,
				inflag2: true,
				
				radio3: 'noUrl',
				input3_outside: '',
				input3_inside: '',
				hideFlag3: false,
				outflag3: true,
				inflag3: true,
				
				restaurants: [],
				timeout: null,
				atomicArray: [],
				serverId1: '',
				serverName1: '',
				serverId2: '',
				serverName2: '',
				serverId3: '',
				serverName3: '',
				obj1: {'id': '',
					'src': '',
					'imgIndex': 1,
					'imageUrl': '',
					'href': '',
					'serverId': '',
					'serverName': '',
					'status': "1",
					'type': '',
					'contentType': "imgs",
					'contentName': "轮播图"
				},
				obj2: {'id': '',
					'src': '',
					'imgIndex': 2,
					'imageUrl': '',
					'href': '',
					'serverId': '',
					'serverName': '',
					'status': "1",
					'type': '',
					'contentType': "imgs",
					'contentName': "轮播图"
				},
				obj3:{'id': '',
					'src': '',
					'imgIndex':3,
					'imageUrl': '',
					'href': '',
					'serverId': '',
					'serverName': '',
					'status': "1",
					'type': '',
					'contentType': "imgs",
					'contentName': "轮播图"
				},
				isShowSearched1: false,
				isShowSearched2: false,
				isShowSearched3: false,
				serverList: [],
				status1:0,
				status2:0,
				status3:0,
				saveStatus:0
			}
		},
		mounted() {
			this.getLunboImg();
		},
		
		watch: {
			input1_inside(value) {
				if(this.status1>0){
					this.fuzzySearch(value,1);
				}
				this.status1++
			},
			input2_inside(value) {
				if(this.status2>0){
					this.fuzzySearch(value,2);
				}
				this.status2++
			},
			input3_inside(value) {
				if(this.status3>0){
					this.fuzzySearch(value,3);
				}
				this.status3++
			}
		},


		methods: {
			fuzzySearch(value,num) {
				if (value === '') {
					if(num==1){
						this.isShowSearched1 = false;
					}else if(num==2){
						this.isShowSearched2 = false;
					}else if(num==3){
						this.isShowSearched3 = false;
					}
					return
                }else if (!this.selectItem) {
                    this.remoteMethod(value,num)
                } else {
                    this.selectItem = false
               }
			},
			remoteMethod(value,num) {
				if (value !== '') {
					apiClient.get(apiToken.newApi('/appmarket/atomic/getAtomicFuzzySearch/'), {
						title: value
					}).then(data => {
						if (appPublicJs.checkData(data.data)) {
							this.serverList = data.data;
							if(num==1){
								this.isShowSearched1 = true
								this.isShowSearched2 = false
								this.isShowSearched3 = false
							}else if(num==2){
								this.isShowSearched2 = true
								this.isShowSearched1 = false
								this.isShowSearched3 = false
							}else if(num==3){
								this.isShowSearched3 = true
								this.isShowSearched1 = false
								this.isShowSearched2 = false
							}
						}else{
							this.serverList=[];
							this.isShowSearched3 = false
							this.isShowSearched1 = false
							this.isShowSearched2 = false
						}
					}).catch(e => {
						console.error(e)
					})
				}
		    },
			
			selectItemInList1(id,name) {
				var that = this;
				this.selectItem = this.input1_inside !== name;
				this.isShowSearched1 = false;
				this.input1_inside = name;
				that.serverId1 = id;
				that.serverName1 = name;
			},
			selectItemInList2(id,name) {
				var that = this;
				this.selectItem = this.input2_inside !== name;
				this.isShowSearched2 = false;
				this.input2_inside = name;
				that.serverId2 = id;
				that.serverName2 = name;
			},
			selectItemInList3(id,name) {
				var that = this;
				this.selectItem = this.input3_inside !== name;
				this.isShowSearched3 = false;
				this.input3_inside = name;
				that.serverId3 = id;
				that.serverName3 = name;
			},
			
			//上传之前校验图片
			beforeAvatarUpload(file) {
				var fileType = file.type === 'image/jpeg' || file.type === 'image/png';
				var flag = true;
				if(!fileType) {
					this.$message.error('上传头像图片只能是 JPG 或 PNG格式!');
					flag = false;
				}
				var isLt2M = appPublicJs.checkfile(file, 0.1953125)
				if(!isLt2M) {
					this.$message.error('上传图片大小不能超过 200kB!');
				}
				return flag && isLt2M;
			},

			//上传图片
			handleFileChange(imgIndex) {
				var that = this;
				var objArr = [that.obj1,that.obj2,that.obj3];
				var file = event.currentTarget.files[0];
				apiClient.upload("/appmarket/upload/uploadFile?method=uploadFile", file, '').then(data => {
					if(data.fileName != null) {
						var imgFlag = this.beforeAvatarUpload(file);
						if(imgFlag) {
							var imageUrl = apiClient.apiBaseUrl + '/appmarket/upload/picimg?token=' + apiClient.token + '&img=' + data.fileName;
							objArr[imgIndex-1].src = data.fileName;
							objArr[imgIndex-1].imageUrl = imageUrl;
							that['hideFlag'+imgIndex] = true;
						}
					}
			    })
			},
			//轮播图回显
			getLunboImg() {
				var that = this;
				var objArr = [that.obj1,that.obj2,that.obj3];
				var myData = {
					'templateId':this.$route.query.temId,
					'contentType': 'imgs',
					"contentName": "轮播图",
					'status': 1
				}  
				apiClient.get(apiToken.newApi('/appmarket/content/getCotentByNotice/'), myData, function(data) {
					if(appPublicJs.checkData(data.results.data)) {
						var list = data.results.data;
						for(var i = 0; i < list.length; i++) {
								var imageUrl = apiClient.apiBaseUrl + '/appmarket/upload/picimg?token=' + apiClient.token + '&img=' + list[i].src;
									objArr[list[i].imgIndex-1].imgIndex=list[i].imgIndex;
									objArr[list[i].imgIndex-1].id=list[i].id;
									objArr[list[i].imgIndex-1].src=list[i].src;
									objArr[list[i].imgIndex-1].imageUrl=imageUrl;
									objArr[list[i].imgIndex-1].href=list[i].href;
									objArr[list[i].imgIndex-1].serverId=list[i].serverId;
									objArr[list[i].imgIndex-1].serverName=list[i].serverName;
									objArr[list[i].imgIndex-1].status=list[i].status;
									objArr[list[i].imgIndex-1].type=list[i].type;
								if(list[i].href != "") {
										that['input'+list[i].imgIndex+'_outside'] = list[i].href;
										that['input'+list[i].imgIndex+'_inside'] = "";
										that['radio'+list[i].imgIndex] = "outside";
										that['inflag'+list[i].imgIndex] = true;
										that['outflag'+list[i].imgIndex] = false;
								}else if(list[i].serverName != "" && list[i].serverName != undefined) {
									that['input'+list[i].imgIndex+'_outside'] = ""; 
									that['input'+list[i].imgIndex+'_inside'] = list[i].serverName; 
									that['serverId'+list[i].imgIndex] = list[i].serverId;
									that['radio'+list[i].imgIndex] = "inside";
									that['inflag'+list[i].imgIndex] = false;
									that['outflag'+list[i].imgIndex] = true;
									that['serverName'+list[i].imgIndex] = list[i].serverName;
								}else if(list[i].href == "" && (list[i].serverName == "" || list[i].serverName == undefined)) {
									that['radio'+list[i].imgIndex] = "noUrl";
									that['inflag'+list[i].imgIndex] = true;
									that['outflag'+list[i].imgIndex] = true;
								}
									that['hideFlag'+list[i].imgIndex] = true;
						}
					}
				});
			},

			//选中按钮
			handleUrlTypeChange(type, num) {
				if(num == 1) {
					if(type == "outside"){
						this.inflag1 = true;
						this.outflag1 = false;
				        this.input1_inside= '';
					}if(type == "inside") {
						this.outflag1 = true;
						this.inflag1 = false;
						this.input1_outside= '';
					}if(type == "noUrl"){
						this.inflag1 = true;
						this.outflag1 = true;
						this.input1_inside= '';
						this.input1_outside= '';
					}
				}else if(num == 2) {
					if(type == "outside"){
						this.inflag2 = true;
						this.outflag2 = false;
						this.input2_inside= '';
					}if(type == "inside") {
						this.outflag2 = true;
						this.inflag2 = false;
						this.input2_outside= '';
					}if(type == "noUrl"){
						this.inflag2 = true;
						this.outflag2 = true;
						this.input2_inside= '';
						this.input2_outside= '';
					}
				}else if(num == 3) {
					if(type == "outside"){
						this.inflag3 = true;
						this.outflag3 = false;
						this.input3_inside= '';
					}if(type == "inside") {
						this.outflag3 = true;
						this.inflag3 = false;
						this.input3_outside= '';
					}if(type == "noUrl"){
						this.inflag3 = true;
						this.outflag3 = true;
						this.input3_inside= '';
						this.input3_outside= '';
					}
				}
			},
			
			//点击保存
			saveBanner() {
				var that = this;
				// if(that.saveStatus==0){
						var reg = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/;
						var idArr = [that.obj1.id,that.obj2.id,that.obj3.id];
						var fileNameArr = [that.obj1.src,that.obj2.src,that.obj3.src];
						var objArr =[that.obj1,that.obj2,that.obj3];
						var imgArray=[];
						if(objArr[0].src  == '' && objArr[1].src == '' && objArr[2].src == '') {
							TipBoxService.open("请至少上传一张图片!", 2);
							return;
						}else if(objArr[0].src != '' || objArr[1].src != '' || objArr[2].src != ''){
								var flag = false;
								for (var i = 0; i < objArr.length; i++) {
									if(that['radio'+(i+1)] == "outside" && that['input'+(i+1)+'_outside'] == "") {
										if((i+1)==1){
											TipBoxService.open("请填写第一组外部URL!", 2);
											return flag;
										}else if((i+1)==2){
											TipBoxService.open("请填写第二组外部URL!", 2);
											return flag;
										}else if((i+1)==3){
											TipBoxService.open("请填写第三组外部URL!", 2);
											return flag ;
										}
									}else if(that['radio'+(i+1)] == "outside" && 
											that['input'+(i+1)+'_outside'] != "" &&!reg.test(that['input'+(i+1)+'_outside'])) {
										if((i+1)==1){
											TipBoxService.open("第一组外部URL输入内容不合法!", 2);
											return flag;
										}else if((i+1)==2){
											TipBoxService.open("第二组外部URL输入内容不合法!", 2);
											return flag;
										}else if((i+1)==3){
											TipBoxService.open("第三组外部URL输入内容不合法!", 2);
											return flag;
										}
									}else if(that['radio'+(i+1)] == "inside" && that['input'+(i+1)+'_inside'] != "" 
											&& that['serverName'+(i+1)] != that['input'+(i+1)+'_inside']) {
											if((i+1)==1){
												TipBoxService.open("请正确选择第一组内部URL!", 2);
												return flag;
												
											}else if ((i+1)==2){
												TipBoxService.open("请正确选择第二组内部URL!", 2);
												return flag;
											}else if ((i+1)==3){
												TipBoxService.open("请正确选择第三组内部URL!", 2);
												return flag;
											}
									}else if(that['radio'+(i+1)] == "inside" && that['serverId'+(i+1)] == "") {
											if((i+1)==1){
												TipBoxService.open("第一组内部URL不能为空!", 2);
												return flag;
											}else if ((i+1)==2){
												TipBoxService.open("第二组内部URL不能为空!", 2);
												return flag;
											}else if ((i+1)==3){
												TipBoxService.open("第三组内部URL不能为空!", 2);
												return flag;
											}
									}else if(that['radio'+(i+1)] == "inside" && that['serverId'+(i+1)] != "" &&  that['input'+(i+1)+'_inside']== "") {
											if((i+1)==1){
												TipBoxService.open("第一组内部URL不能为空!", 2);
												return flag;
											}else if ((i+1)==2){
												TipBoxService.open("第二组内部URL不能为空!", 2);
												return flag;
											}else if ((i+1)==3){
												TipBoxService.open("第三组内部URL不能为空!", 2);
												return flag;
											}
									}else if(that['radio'+(i+1)] == "outside" && that['input'+(i+1)+'_outside'] != "" && reg.test(that['input'+(i+1)+'_outside'])) {
											if(objArr[i].src==""){
												var num = this.getNum(i);
												TipBoxService.open('请上传第'+num+'组图片!', 2);
												return flag;
											}else{
												objArr[i].id = idArr[i];
												objArr[i].src = fileNameArr[i];
												objArr[i].href = that['input'+(i+1)+'_outside'];
												objArr[i].serverId = '',
												objArr[i].type = "0";
												flag = true;
											}
									}else if(that['radio'+(i+1)] == "inside" && that['serverId'+(i+1)] != "") {
											if(objArr[i].src==""){
												var num = this.getNum(i);
												TipBoxService.open('请上传第'+num+'组图片!', 2);
												return flag;
											}else{
												if(that['serverId'+(i+1)] != "" && that['input'+(i+1)+'_inside']!="" && that['serverName'+(i+1)] == that['input'+(i+1)+'_inside']){
													objArr[i].id = idArr[i];
													objArr[i].src = fileNameArr[i];
													objArr[i].href = '';
													objArr[i].serverId = that['serverId'+(i+1)];
													objArr[i].type = "1";
													flag = true;
												}else{
													flag = false;
												}
											}
									}else if(that['radio'+(i+1)] == "noUrl") {
												objArr[i].id = idArr[i];
												objArr[i].src = fileNameArr[i];
												objArr[i].href = '';
												objArr[i].serverId = '';
												objArr[i].serverName = '';
												objArr[i].type = "2";
												flag = true;
									}
									if(objArr[i].src != ''){
										imgArray.push(objArr[i]);
									}
								}
								if(flag == true){
									this.saveOrUpdateObj(imgArray);
								}
						}
				//     that.saveStatus++;
				// }
				// else{
				// 	that.saveStatus=0;
				// 	return ;
				// }
				
			},

			getNum(i){
				var num ='';
				if(i==0){
					num = '一';
				}else if(i==1){
					num = '二';
				}else if(i==2){
					num = '三';
				}
				return  num;
			},
			
			saveOrUpdateObj(myData){
				var that = this;
				LoadingBoxService.open('加载中...')
                var myDatas  ={
					'templateId':this.$route.query.temId,
					"content": JSON.stringify(myData)
				}
				apiClient.post(apiToken.newApi('appmarket/content/saveContentBatch/'),myDatas , function(data) {
					LoadingBoxService.close();
					if(data.results.status == true) {
						that.getLunboImg();
						TipBoxService.open("保存成功！", 0);
					} else {
						TipBoxService.open("保存失败！", 1);
					}
				});
			}
	}	
}
</script>
<style src="../../css/appBannerImgConfig.css" scoped></style>



