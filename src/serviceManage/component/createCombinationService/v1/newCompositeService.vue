<template>
	<div class="newService">
		<!-- /栏目头部 end-->
		<!-- 主题内容菜单 -->
		<div class="resoubox ">
			<div class="resou-con">
				<div class="w1200 h100">
					<div class="publicNav">
                        <span class="hand" @click="toMain()"></span>
                        <span class="active">服务管理</span>
                        <span class="arrows">></span>
                        <span class="active">基本信息填写</span>
                        <div class="returnBtn publicRedBtn" @click="backPage()">返回 </div>
                    </div>
					<div class="mode-div lanm-con" v-bind:style="{'height':(fullHeight-160)+'px'}">
						<div class="register" style="padding: 20px 0">
							<div class="iformcon">
								<div class="iformcon-con reg2">
									<div class="time-x">
										<span class="texet lihei"><i>*</i>服务资源名称</span>
										<span class="inputime ">
			                                    <input v-model="service_name" type="text" class="inputborder textlinpu-text wi540">
			                                </span>
									</div>
									<div class="time-x">
										<span class="texet lihei"><i>*</i>服务标签</span>
										<span class="inputime ">
			                    <div class="inputborder textlinpu-text wi450">
													<span class="tagArea" v-for="(tag,index) in metaData.serviceTag" :key="index">
														{{tag}}
														<i @click="deleteTag(index)" class="icon iconfont icon-delete-black"></i>
													</span>
												</div>
			              </span>
										<span class="inputime padingstye">
			                                    <span @click="showTags" class="inputborder butbox">选择标签</span>
			                                </span>
									</div>
                  <div class="time-x">
											<span class="texet lihei"><i class="mustAdd">*</i>服务期限</span>
											<el-date-picker
												v-model="startTime"
												type="date"
												format="yyyy-MM-dd"
												placeholder="选择日期"
												@change="changeStartDate"
												:picker-options="pickerOptions0">
											</el-date-picker>
											<span>至</span>
											<el-date-picker
												v-model="endTime"
												format="yyyy-MM-dd"                      
												type="date"
												placeholder="选择日期"
												@change="changeEndDate"
											:picker-options="pickerOptions1">
											</el-date-picker>
										</div>
									<div class="time-x">
										<span class="texet"><i>*</i>服务简介</span>
										<span class="inputime textArea">
			                                <textarea maxlength="50" v-model="service_brief" class="inputborder wi50"></textarea>
											<span class="residue">{{50-service_brief.length}}/50</span>
			                            </span>
									</div>
									<div class="time-x">
										<span class="texet"><i>*</i>服务描述</span>
										<span class="inputime textArea">
			                                <textarea maxlength="2000" v-model="service_remark" class="inputborder wi550"></textarea>
											<span class="residue">{{2000-service_remark.length}}/2000</span>
			                            </span>
									</div>
									<div class="touxi">
										<dl>
											<dd class="box">
												<div>
													<form name="mainForm">
														<input @change="uploadImg(1)" id="id1" type="file" />
														<img :src="successUrl1" alt="">
														<label @click="chooseLogo()"></label>
														<div>
															<i v-if="successUrl1 ==''"></i>
															<p v-if="successUrl1 ==''">应用logo上传</p>
														</div>
													</form>
												</div>
											</dd>
											<dt><label for="id1" class="choiceLogo">选择logo</label></dt>
										</dl>
										<dl>
											<dd class="box">
												<div>
													<form name="mainForm">
														<input @change="uploadImg(2)" id="id2" type="file" />
														<img :src="successUrl2" alt="">

													<label @click="chooseBg()"></label>
													<div>
														<i v-if="successUrl2 ==''"></i>
														<p v-if="successUrl2 ==''">应用背景图上传</p>
													</div>
												</form>
											</div>
										</dd>
										<dt><label for="id2" class="choiceBg">选择背景图</label></dt>
									</dl>
								</div>
								</div>
								 <div class="buttnet">
	                                <span class="butonst" @click="saveBasicInfo(false)">暂存</span>
	                                <span class="butonstred" @click="saveBasicInfo(true)">下一步</span>
                                </div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<!-- 选择标签 -->
		<LabelView :maxTag="10" :dialogTagVisible.sync="dialogTagVisible" :isCreateModel="!isEdit" :model="metaData" modelLabelKey="serviceTag" :changeLabelCaller="saveLabel" />
    <el-dialog title="选择Logo" :visible.sync="chooseLogoShow">
			<div class="checkPicture">
				<label class="checkBtn" for="id1">选择图片</label>
				<span>建议图片分辨率200*200，大小不超过1M,仅支持jpg,jepg格式</span>
			</div>
			<div class="clear">
				<ul>
					<li :class="{checkActive:img.isActive}" @click="chooseLogoImg(index)" v-for="(img,index) in imgArr" :key="index">
						<i class="icon iconfont icon-shanchu2 deleteBtn"></i>
				 		<img class="userImg" :src="img.imgPath"></img>
					</li>
				</ul>
			</div>
			<div slot="footer" class="dialog-footer">
				<button @click="confirmLogoUpdate()" class="confirmBtn">确 认</button>
				<button @click="resetLogoUpdate()" class="resetBtn">取 消</button>
			</div>
		</el-dialog>
		<!-- 背景图 -->
		<el-dialog title="选择背景图" :visible.sync="chooseBgShow">
			<div class="checkPicture">
				<label class="checkBtn" for="id2">选择图片</label>
				<span>建议图片分辨率200*200，大小不超过1M,仅支持jpg,jepg格式</span>
			</div>
			<div class="clear">
				<ul>
					<li :class="{checkActive:img.isActive}" @click="chooseBgImg(index)" v-for="(img,index) in imgArr" :key="index">
						<i class="icon iconfont icon-shanchu2 deleteBtn"></i>
				 		<img class="userImg" :src="img.imgPath"></img>
					</li>
				</ul>
			</div>
			<div slot="footer" class="dialog-footer">
				<button @click="confirmBgUpdate()" class="confirmBtn">确 认</button>
				<button @click="resetBgUpdate()" class="resetBtn">取 消</button>
			</div>
		</el-dialog>
	</div>
	</div>
</template>
<script>
    import apiToken from '../../../publicJs/apiToken.js'
    import apiClient from '../../../publicJs/ApiClient.js'
    import LabelView from '../../../publicComponent/labelView.vue'
		import TipBoxService from "../common/TipBoxService.js";
    export default {
		name: 'RcIndex',
		watch: {
		'metaData.serviceTag' (value) {
			this.service_tag = value;
			this.metaData.resourcetag = value.join(',');
		},
		'service_tag' (value){
			this.metaData.serviceTag = value;
		}
		},
		data() {
      let that =this;
			return {
				source_type:this.$route.query.source_type,
				indexNext:0, //记录点击下一步的次数
				fullHeight: document.documentElement.clientHeight, //浏览器可视高度
				dialogTagVisible: false, //选择标签 是否隐藏。
				checkedLabels: [],
				isTeleService: false,
				isApplService: false,
				isPageRequest: false,
				isPageDataRequest: false,
				isDataRequest: false,
				isFullDisclosure: false,
				isTermDisclosure: false,
				configure: [],
				isShow: true,
				applyList: [],
				obj: "",
				applyId: "",
				service_name: "",
				apptype: "",
				serviceType: [],
				service_type: [],
				service_tag: [],
				service_brief: "",
				service_remark: "",
        open_type: "1",
        belong_type:'',
	  		approval_workflow:0,//流程审批：
	  		approval_batchNo:0,//批次号
				id: "",
				service_param_detail: '',
				successUrl1: "",//logo图片全路径
				successUrl2: "",//背景图片全路径
				img:"",//logo图片名称
				bg_img:"",//背景图片名称
				file: null,
				metaData:{
					serviceTag:[], //标签名称数组
					resourcetag:""  //标签名称字符串
				}, //包含标签名称数组的对象
        isEdit: this.$route.query.atomicId !== undefined,  //用于标签判断是否是新建服务
        startTime:'',
        endTime:'',
        chooseLogoShow:false,
			  chooseBgShow:false,
        pickerOptions0: {
          disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
          }
        },
        pickerOptions1: {
          disabledDate(time) {
          return (
            time.getTime() < Date.now() ||
            time.getTime() < new Date(that.startTime).getTime()
          );
          }
        },
        imgArr:[]
			}
		},
		mounted() {
			//		this.getApplications();
			this.id = this.$route.query.id;
			if(this.checkNull(this.id)){
				this.getBaseInfo(this.id) ;
			}
			for(var i = 1 ; i <= 15 ; i ++){
        var obj = {
          imgName:'default_logo_' + i + '.jpg',
          isActive:false,
          imgPath:apiClient.apiBaseUrl + '/itsmApi/attachment/show?imgPath=default_logo_' + i + ".jpg&token="+apiClient.token
        };
        this.imgArr.push(obj);
      }
		},
		methods: {
      chooseLogo(){
        this.chooseLogoShow = true;
      },
      chooseBg(){
        this.chooseBgShow = true;
      },
      deleteTag(e){
        this.metaData.serviceTag.splice(e,1)
      },
      confirmLogoUpdate(){
        this.chooseLogoShow = false;
        // this.successUrl1 = apiClient.apiBaseUrl + '/itsmApi/attachment/show?imgPath=' + this.img + "&token="+apiClient.token;
        this.successUrl1 = apiClient.apiBaseUrl + 'itsmApi/attachment/show?imgPath=' + this.img;
      },
      confirmBgUpdate(){
        this.chooseBgShow = false;
        // this.successUrl2 = apiClient.apiBaseUrl + '/itsmApi/attachment/show?imgPath=' + this.bg_img + "&token="+apiClient.token;
        this.successUrl2 = apiClient.apiBaseUrl + 'itsmApi/attachment/show?imgPath=' + this.bg_img;
      },
      resetLogoUpdate(){
        for(var i = 0 ; i < 15 ; i++){
          this.imgArr[i].isActive = false;
        }
        this.chooseLogoShow = false;
        this.img = '';
      },
      resetBgUpdate(){
        for(var i = 0 ; i < 15 ; i++){
          this.imgArr[i].isActive = false;
        }
        this.chooseBgShow = false;
        this.bg_img = '';
      },
      chooseLogoImg(e){
        for(var i = 0 ; i < 15 ; i++){
          this.imgArr[i].isActive = false;
        }
        this.imgArr[e].isActive = true;
        this.img = this.imgArr[e].imgName;
      },
      chooseBgImg(e){
        for(var i = 0 ; i < 15 ; i++){
          this.imgArr[i].isActive = false;
        }
        this.imgArr[e].isActive = true;
        this.bg_img = this.imgArr[e].imgName;
      },
      formatDuring(time, format){
              var t = new Date(time);
              var tf = function(i){return (i < 10 ? '0' : '') + i};
              return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function(a){
                  switch(a){
                      case 'yyyy':
                          return tf(t.getFullYear());
                          break;
                      case 'MM':
                          return tf(t.getMonth() + 1);
                          break;
                      case 'mm':
                          return tf(t.getMinutes());
                          break;
                      case 'dd':
                          return tf(t.getDate());
                          break;
                      case 'HH':
                          return tf(t.getHours());
                          break;
                      case 'ss':
                          return tf(t.getSeconds());
                          break;
                  }
              })
          },
      changeStartDate(val) {
        this.startTime = val;
      },
      changeEndDate(val) {
        this.endTime = val;
      },
			toMain(){
				if (this.source_type == "1") {
					this.$router.push("/enterprise");
				} else if (this.source_type == "5") {
					this.$router.push("/registered");
				} else if (this.source_type == "2") {
					this.$router.push("/platformService");
				}
			},
			/**
			 * 返回
			 */
			backPage() {
				if (this.source_type == "1") {
					this.$router.push("/enterprise");
				} else if (this.source_type == "5") {
					this.$router.push("/registered");
				} else if (this.source_type == "2") {
					this.$router.push("/platformService");
				}
			},
			/**
			 * 显示标签选择框
			 */
			showTags() {
				this.dialogTagVisible = true;
			},
			/**
			 * 标签框点击确定
			 */
			changeLabels(changed, selectLabels) {
				if(changed) {
					let labelIds = []
					let labelStr = ''
					this.service_tag = [];
					for(let i = 0; i < selectLabels.length; i++) {
						labelIds.push(selectLabels[i].id)
						labelStr = labelStr + selectLabels[i].name + ','
						this.service_tag.push(selectLabels[i].name)
					}
					if(labelStr.length > 0) {
						labelStr = labelStr.substr(0, labelStr.length - 1)
					}
					this.resourcetag = labelStr
					this.checkedLabels = labelIds
				}
				this.dialogTagVisible = false
//				console.log(this.service_tag)
			},
			/**
			 * 公用--校验是否为空
			 */
			checkNull(obj) {
				if(obj == "" || obj == undefined || obj.length == 0) {
					return false;
				} else {
					return true;
				}
			},
			/**
			 * 保存基本组合服务基本信息
			 */
			saveBasicInfo(nextStep) {
				var that = this;
				var flag = true;
				if(!that.checkNull(this.service_name)) {
					TipBoxService.open("请填写服务名称", 2)
					flag = false;
					return false;
				}
				if(this.service_name.length > 20) {
						TipBoxService.open("服务名称最多为20个字符", 2)
						flag = false;
						return false;
				}
				if(nextStep){ 
					if(!that.checkNull(this.service_tag)) {
						TipBoxService.open("请选择标签", 2)
						flag = false;
						return false;
					}
					if(!that.checkNull(this.service_brief)) {
						TipBoxService.open("请输入服务简介", 2)
						flag = false;
						return false;
					}
					if(this.service_brief.length > 50) {
						TipBoxService.open("服务简介最多为50个字符", 2)
						flag = false;
						return false;
					}
					if(!that.checkNull(this.service_remark)) {
						TipBoxService.open("请输入服务描述", 2)
						flag = false;
						return false;
          }
          if(!that.checkNull(this.startTime) || !that.checkNull(this.endTime)){
            TipBoxService.open("请选择服务期限",2);
            flag = false;
            return false;
          }
					// if(!that.checkNull(this.open_type)) {
					// 	TipBoxService.open("请选择开放模式", 2)
					// 	flag = false;
					// 	return false;
					// }
					
				}
				
				if(flag && that.indexNext == 0) {
					var tag = this.service_tag
					var param = {
						name: this.service_name,
						service_tag: tag.toString(),
						service_brief: this.service_brief,
						service_remark: this.service_remark,
						open_type: this.open_type,
						operate_page:"1",
            tag_id:this.checkedLabels,
            service_start_time:this.startTime,
						service_end_time:this.endTime,
						source_type:this.source_type
					};
					if(that.checkNull(this.successUrl1)) {
						param.img = this.img;
					}
					if(that.checkNull(this.successUrl2)) {
						param.bg_img = this.bg_img;
					}
					if(that.checkNull(this.id)){
						param.id = this.id;
					}else{
						param.visit_num="0";
					}
		 apiClient.post('itsmApi/combination/operateCombinationService',param,function(data){				
						console.log("param",param);
						if(data.status == 200){
							that.id = data.results.id
							if(nextStep){
								that.$router.push({
									name: 'compositeService',
									query: {
														id: that.id,
														source_type:that.$route.query.source_type
					    			}
						    	})
						    	that.indexNext++
							}else{
								TipBoxService.open('暂存成功')
							}
						}else{
							var msg = "操作失败";
							if(data.exception != undefined && data.exception != null){
								msg = data.exception;
							}
							TipBoxService.open(msg,2);
						}
						
					})
				}
			},
			/**
			 *存储基本信息
			 */
			getBaseInfo(id) {
//				var id = this.$route.query.id;
				var that = this;
				var id = that.$route.query.id;
		 		apiClient.post('itsmApi/combination/findCombinationService',{id:id},function(data){	
					console.log("回显数据",data)
					var data = data.results.data;
						that.service_name = data.name;
						that.service_tag = data.service_tag;
//						that.service_tag = [];
						that.service_brief= data.service_brief;
						that.service_remark= data.service_remark;
						// that.open_type = data.open_type;
//						that.showImg(data.img,"successUrl1")
						that.img = data.img;
						that.bg_img = data.bg_img;
						if(data.tag_id != undefined && data.tag_id.length != 0 ){
		    				that.checkedLabels = data.tag_id;
              }
            that.startTime = that.formatDuring(data.service_start_time,'yyyy-MM-dd');
					  that.endTime = that.formatDuring(data.service_end_time,'yyyy-MM-dd');
						that.successUrl1 = apiClient.apiBaseUrl + '/itsmApi/attachment/show?imgPath=' + data.img + "&token="+apiClient.token;
						that.successUrl2 = apiClient.apiBaseUrl + '/itsmApi/attachment/show?imgPath=' + data.bg_img + "&token="+apiClient.token;
				});
			},
			/**
			 * 上传图片
			 */
			uploadImg(flage) {
				var that = this;
				var url = "";
				this.file = event.currentTarget.files[0];
				apiClient.upload('/itsmApi/attachment/upload',this.file,'').then(data =>{
					if(flage == 1) {
						that.img = data.fileName;
            that.successUrl1 = apiClient.apiBaseUrl + '/itsmApi/attachment/show?imgPath=' + data.fileName + "&token="+apiClient.token;
            that.chooseLogoShow = false;
					} else {
						that.bg_img = data.fileName;
            that.successUrl2 = apiClient.apiBaseUrl + '/itsmApi/attachment/show?imgPath=' + data.fileName + "&token="+apiClient.token;
            that.chooseBgShow = false;
					}
				});
			},
			saveLabel () {
				this.service_tag = this.metaData.serviceTag;
				this.metaData.resourcetag = this.service_tag.join(',');
				return true;
      },
      formatDuring(time, format){
            var t = new Date(time);
            var tf = function(i){return (i < 10 ? '0' : '') + i};
            return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function(a){
                switch(a){
                    case 'yyyy':
                        return tf(t.getFullYear());
                        break;
                    case 'MM':
                        return tf(t.getMonth() + 1);
                        break;
                    case 'mm':
                        return tf(t.getMinutes());
                        break;
                    case 'dd':
                        return tf(t.getDate());
                        break;
                    case 'HH':
                        return tf(t.getHours());
                        break;
                    case 'ss':
                        return tf(t.getSeconds());
                        break;
                }
            })
        },
			/**
			 * 图片回显
			 */
//			showImg(imgPath,name){
//				var that = this;
//				console.info(imgPath,HttpService.tokenId);
//				HttpService.link("/attachment/uploadImg?method=showImg/", {imgPath:imgPath,token:HttpService.tokenId}, function(data) {
//					debugger
//					console.info("aaa",data)
//					that[name] = "aaa"
//				});
//			}
		},
		components: {
			LabelView
		}
	}
</script>
<style src="../../css/common/public.css" scoped></style>
<style src="../../css/createCombinationServeice/newCompositeService.css" scoped></style>