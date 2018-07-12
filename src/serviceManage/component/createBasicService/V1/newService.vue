<template>
	<div class="newService">
				    <!-- /栏目头部 end-->
				    <!-- 主题内容菜单 -->
			    <div class="resoubox ">
			        <div class="resou-con">
			            <div class="w1200 h100">
			            <div class="publicNav">
					      <img @click="toMain()" class="hand" src="">
					      <!-- <router-link :to="{name:'personRegisterManage'}">服务管理</router-link> -->
					      <span class="active">服务管理</span>
					      <span class="arrows">></span>
					      <span class="active">基本信息填写</span>
					      <div class="returnBtn publicRedBtn" @click="backPage()">返回 </div>
					    </div>
			            <div class="mode-div lanm-con" v-bind:style="{'height':(fullHeight-160) +'px'}">
			                <div class="register">
			                    <div class="lanmpege">
			                        <div class="lanmp-con">
			                            <div class="lanbbag">
			                                <p style="width: 28%"></p>
			                            </div>
			                            <div class="lanbag-text">
			                                <span class="tim1">基本信息</span>
			                                <span class="tim2">参数配置</span>
			                                <span class="tim3">配置完成</span>
			                            </div>
			                        </div>
			                    </div>
			                    <div class="iformcon">
			                        <div class="iformcon-con reg2">
			                            <div class="time-x">
			                                <span class="texet lihei"><i class="mustAdd">*</i><em>服务资源名称:</em></span>
			                                <span class="inputime ">
			                                    <input placeholder="服务名称最多20字符" maxlength="20" v-model="service_name" type="text" class="inputborder textlinpu-text wi540">
			                                </span>
			                            </div>
			                            <div class="time-x">
			                                <span class="texet"><i class="mustAdd">*</i>归属应用</span>
			                                <span class="inputime ">
			                                     <div @click="isSelect('teleService')" class="css-radio" :class="{ active: isTeleService }"><i></i><em>远程服务</em></div>
			                                     <div @click="isSelect('applService')" class="css-radio" :class="{ active: isApplService }"><i></i><em>应用服务</em></div>
			                                </span>
			                            </div>
			                            <div v-if="isShow" class="time-x">
			                                <span class="texet"><i class="mustAdd">*</i>应用名称</span>
			                                <span class="inputime ">
			                                    <select @change="selectChange"  v-model='obj' name="" id="selecrApp" class="inptcss inputborder wi540">
			                                          <option v-for="apply in applyList" :value="apply">{{apply.app_name}}</option>
			                                    </select>
			                                </span>
			                            </div>
			                            <div class="time-x">
			                                <span class="texet"><i class="mustAdd">*</i><em>页面配置类型</em></span>
			                                <span class="inputime ">
			                                    <div class="css-radio" @click="selectType('pageRequest')">
				                                    <span class="tableSelectBtn" v-bind:class="{select: isPageRequest}"></span>
				                                    <em>页面请求</em>
			                                    </div>
			                                    <div class="css-radio" @click="selectType('pageDataRequest')">

				                                    <span class="tableSelectBtn" v-bind:class="{select: isPageDataRequest}"></span>
				                                    <em>页面数据请求</em>
			                                    </div>
			                                    <div class="css-radio" @click="selectType('dataRequest')">
				                                    <span class="tableSelectBtn" v-bind:class="{select: isDataRequest}"></span>
				                                    <em>纯数据请求</em>
			                                    </div>
			                                </span>
			                            </div>
			                            <div class="time-x">
			                                <span class="texet lihei"><i class="mustAdd">*</i>服务标签</span>
			                                <span class="inputime ">
			                                    <div class="inputborder textlinpu-text wi450">
													<span class="tagArea" v-for="(tag,index) in metaData.serviceTag" :key="index">
														{{tag}}
														<i @click="deleteTag(index)" class="icon iconfont icon-delete-black"></i>
													</span>
												</div>
			                                </span>
			                                <span class="inputime padingstye">
			                                    <button @click="showTags" class="inputborder butbox">选择标签</button>
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
			                                <span class="texet"><i class="mustAdd">*</i>服务简介</span>
			                                <span class="inputime textArea">
			                                     <textarea maxlength="50" v-model="service_brief" class="inputborder wi50" ></textarea>
												 <span class="residue">{{50-service_brief.length}}/50</span>
			                                </span>
			                            </div>
			                             <div class="time-x">
			                                <span class="texet">服务描述</span>
			                                <span class="inputime textArea">
			                                     <textarea maxlength="2000" v-model="service_remark" class="inputborder wi550" ></textarea>
												 <span class="residue">{{2000-service_remark.length}}/2000</span>
			                                </span>
			                            </div>
			                            <div class="touxi">
				                            <dl>
				                                <dd class="box">
				                                    <div>
				                                        <form name="mainForm">
														  	<input @change="handleFileChange('logo')"  id="id1"  type="file"  />
														  	<img  :src="successUrl1" alt="">
														  	<label @click="chooseLogo()"></label>
														  	<div :class="{hidBox:hideFlag1}">
														  		<i></i>
				                                       			<p>服务logo上传</p>
														  	</div>
												  		</form>
				                                    </div>
				                                </dd>
				                                <dt><label @click="chooseLogo()" class="choiceBg">选择logo</label></dt>
				                            </dl>
				                            <dl>
				                                <dd class="box">
				                                    <div>
				                                        <form name="mainForm">
														  	<input @change="handleFileChange('backImg')"  id="id2"  type="file"  />
														  	<img  :src="successUrl2" alt="">
														  	<label @click="chooseBg()"></label>
														  	<div :class="{hidBox:hideFlag2}">
														  		<i></i>
				                                       			<p>服务背景图上传</p>
														  	</div>
												  		</form>
				                                    </div>
				                                </dd>
				                                <dt><label @click="chooseBg()" class="choiceBg">选择背景图</label></dt>
				                            </dl>
				                        </div>
			                        </div>
			                    </div>
			                    <!--/biaodan-->
			                    <div class="buttnet">
			                        <span @click="toSaveInfo('temporaryStorage')" class="butonst">暂存</span>
			                        <span @click="toSaveInfo('toNext')" class="butonstred">下一步</span>
			                    </div>
			                </div>
			            </div>
			            </div>
			        </div>
			    </div>
		    <div class="foot"></div>
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
import LabelView from '../../../publicComponent/labelView.vue'
import apiToken from '../../../publicJs/apiToken.js'
import apiClient from '../../../publicJs/ApiClient.js'
import TipBoxService from '../common/TipBoxService.js'
import LoadingBoxService from '../../../publicJs/LoadingBoxService.js'
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
	data(){
		let that = this;
	  	return{
				source_type:this.$route.query.source_type,
	  		fullHeight: document.documentElement.clientHeight,
	  		indexNext:0, //记录点击下一步的次数
	  		dialogTagVisible: false,//选择标签 是否隐藏。
	  		checkedLabels: [],
	  		isTeleService: false,
	  		isApplService: true,
	  		isPageRequest: false,
	  		isPageDataRequest: false,
	  		isDataRequest: false,
	  		configure:[],
	  		isShow:true,
	  		applyList:[],
	  		obj:"",
	  		applyId:"",
	  		service_name:"",
	  		apptype:"2",
	  		serviceType:[],
	  		service_type:[],
	  		service_tag:[], 
	  		service_brief:"",
	  		service_remark:"",
	  		atomicId:"",
	  		service_param_detail:'',
	  		successUrl1:"",
	  		successUrl2:"",
	  		file:"",
	  		bg_img:"",
	  		img:"",
	  		hideFlag1 : false,
	  		hideFlag2 : false,
	  		opt:0,
	  		belong_type:'',
	  		approval_workflow:0,//流程审批：
	  		approval_batchNo:0,//批次号
			metaData:{
				serviceTag:[], //标签名称数组
				resourcetag:""  //标签名称字符串
			}, //包含标签名称数组的对象
			isEdit: this.$route.query.atomicId !== undefined,  //用于标签判断是否是新建服务
			isEdit2:false,  //用于下一步页面标签判断是否新建服务
			chooseLogoShow:false,
			chooseBgShow:false,
			imgArr:[],
			startTime:'',
			endTime:'',
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
	  	}
	},
	mounted(){
		this.getApplications()
		for(var i = 1 ; i <= 15 ; i ++){
			var obj = {
				imgName:'default_logo_' + i + '.jpg',
				isActive:false,
				imgPath:apiClient.apiBaseUrl + '/itsmApi/attachment/show?imgPath=default_logo_' + i + ".jpg&token="+apiClient.token
			};
			this.imgArr.push(obj);
		}
		console.log(this.imgArr)
	},
	methods:{
		changeStartDate(val) {
			this.startTime = val;
		},
		changeEndDate(val) {
			this.endTime = val;
		},
		backPage() {
			if (this.source_type == "1") {
        this.$router.push("/enterprise");
      } else if (this.source_type == "5") {
        this.$router.push("/registered");
      } else if (this.source_type == "2") {
        this.$router.push("/platformService");
      }
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
			this.hideFlag1 = true;
			this.chooseLogoShow = false;
			this.successUrl1 = apiClient.apiBaseUrl + '/itsmApi/attachment/show?imgPath=' + this.img + "&token="+apiClient.token;
		},
		confirmBgUpdate(){
			this.hideFlag2 = true;
			this.chooseBgShow = false;
			this.successUrl2 = apiClient.apiBaseUrl + '/itsmApi/attachment/show?imgPath=' + this.bg_img + "&token="+apiClient.token;
		},
		resetLogoUpdate(){
			if(this.successUrl1 == ""){
				this.hideFlag1 = false;
			}
			for(var i = 0 ; i < 15 ; i++){
				this.imgArr[i].isActive = false;
			}
			this.chooseLogoShow = false;
			this.img = '';
		},
		resetBgUpdate(){
			if(this.successUrl2 == ""){
				this.hideFlag2 = false;
			}
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
		getBasicInfo(){
			var that = this;
			if(this.$route.query.atomicId != undefined && this.$route.query.atomicId != ""){
				this.atomicId = this.$route.query.atomicId;
				document.getElementById("selecrApp").disabled='disabled';
				var myData = {id:this.$route.query.atomicId};
				apiClient.post('itsmApi/atomicService/loadServiceInfo',myData,function(data){
					console.log("sadasdasdasd",data)
					if(data.results.data[0].service_param_detail != undefined){
		    			that.isEdit2 = true;
		    		}
        			that.service_param_detail=data.results.data[0].service_param_detail;
					that.applyId = data.results.data[0].app_id
					for(var i = 0 ; i < data.results.data[0].service_type.length ; i ++){
						that.serviceType.push(data.results.data[0].service_type[i])
					}
					//that.serviceType = data.results.data[0].service_type
					that.service_tag = data.results.data[0].service_tag
					that.successUrl1 = apiClient.apiBaseUrl + '/itsmApi/attachment/show?imgPath=' + data.results.data[0].img + "&token="+apiClient.token;
	    			that.img = data.results.data[0].img
	    			that.hideFlag1 = true;
	    			that.successUrl2 = apiClient.apiBaseUrl + '/itsmApi/attachment/show?imgPath=' + data.results.data[0].bg_img + "&token="+apiClient.token;
		    		that.bg_img = data.results.data[0].bg_img
		    		that.hideFlag2 = true;
		    		if(data.results.data[0].tag_id != undefined && data.results.data[0].tag_id.length != 0 ){
		    			that.checkedLabels = data.results.data[0].tag_id;
					}
					that.metaData.resourcetag = that.service_tag.join(',');
					for(var i=0;i<that.applyList.length;i++){
						var newObj=that.applyList[i];
						if(newObj.id==that.applyId)
						{
							that.obj=newObj;
							break;
						}
					}
					that.startTime = that.formatDuring(data.results.data[0].service_start_time,'yyyy-MM-dd');
					that.endTime = that.formatDuring(data.results.data[0].service_end_time,'yyyy-MM-dd');
					that.service_name = data.results.data[0].name
					that.service_brief = data.results.data[0].service_brief
					that.service_remark = data.results.data[0].service_remark
					that.approval_workflow = data.results.data[0].approval_workflow
					that.approval_batchNo = data.results.data[0].approval_batchNo
					that.belong_type = data.results.data[0].belong_type
					that.opt = data.results.data[0].audit_status				
					if(data.results.data[0].apptype == 1){
						that.isTeleService = true;
						that.isApplService = false;
						that.apptype = 1
						that.isShow = false;
					}else{
						that.isApplService = true;
						that.isTeleService = false;
						that.apptype = 2;
						that.isShow = true;
					}
					for(var i = 0 ; i < data.results.data[0].service_type.length ; i ++){
						if(data.results.data[0].service_type[i] == 1){
							that.isPageRequest = true;
							that.serviceType[0] = 1;
							that.configure[0] = '页面请求';
						}else if(data.results.data[0].service_type[i] == 2){
							that.isPageDataRequest = true;
							that.serviceType[1] = 2;
							that.configure[1] = '页面数据请求';
						}else if(data.results.data[0].service_type[i] == 3){
							that.isDataRequest = true;
							that.serviceType[2] = 3;
							that.configure[2] = '纯数据请求'
							that.configure[3] = '返回参数'
						}
					}

        		})
			}
		},
		changeLabels (changed, selectLabels) {
			this.service_tag = [];
		  	if (changed) {
			    let labelIds = []
			    let labelStr = ''
			    for (let i = 0; i < selectLabels.length; i++) {
			      labelIds.push(selectLabels[i].id)
			      labelStr = labelStr + selectLabels[i].name + ','
			      this.service_tag.push(selectLabels[i].name)
			    }
			    if (labelStr.length > 0) {
			      labelStr = labelStr.substr(0, labelStr.length - 1)
			    }
			    this.resourcetag = labelStr
			    this.checkedLabels = labelIds
		      }
		      this.dialogTagVisible = false
	    },
	    handleFileChange(name){
	    	var that = this;
	    	this.file = event.currentTarget.files[0];
	    	apiClient.upload('itsmApi/attachment/upload',this.file,'',).then(data =>{
	    		if(name == 'logo'){
	    			$("#id1").val("")
	    			that.successUrl1 = apiClient.apiBaseUrl + '/itsmApi/attachment/show?imgPath=' + data.fileName + "&token="+apiClient.token;
	    			that.img = data.fileName
					that.hideFlag1 = true;
					that.chooseLogoShow = false;
		    	}else{
		    		$("#id2").val("")
		    		that.successUrl2 = apiClient.apiBaseUrl + '/itsmApi/attachment/show?imgPath=' + data.fileName + "&token="+apiClient.token;
		    		that.bg_img = data.fileName
					that.hideFlag2 = true;
					that.chooseBgShow = false;
		    	}
	    	})
	    },
		getApplications(){
			var that=this;
        	var myData={};
        	apiClient.post('itsmApi/application/selectApps',myData,function(data){
        		that.applyList = data.results.data
        		that.getBasicInfo()
        	})
		},
		selectChange(){
			if(this.obj != undefined){
				this.applyId = this.obj.id
			}
		},
	  	showTags(){
		    this.dialogTagVisible = true;
		},
		isSelect(name){
			var that = this;
			if(that.atomicId == undefined || that.atomicId == ""){
				if(name == 'teleService'){
					if(this.isTeleService == false){
						this.isTeleService = true;
						this.isApplService = false;
						this.apptype = 1;
					}else{
						this.isTeleService = false;
					}
					this.isShow = false;
				}else{
					if(this.isApplService == false){
						this.isApplService = true;
						this.isTeleService = false;
						this.apptype = 2;
					}else{
						this.isApplService = false;
					}
					this.isShow = true;
				}
			}
		},
		selectType(name){
			this.service_type = [];
			if(name == 'pageRequest'){
				if(this.isPageRequest == false){
					this.isPageRequest = true;
					this.configure[0] = '页面请求';
					this.serviceType[0] = 1;
				}else{
					this.isPageRequest = false;
					this.configure[0] = undefined;
					this.serviceType[0] = undefined;
				}
			}
			//
			if(name == 'pageDataRequest'){
				if(this.isPageDataRequest == false){
					this.isPageDataRequest = true;
					this.configure[1] = '页面数据请求';
					this.serviceType[1] = 2;
				}else{
					this.isPageDataRequest = false;
					this.configure[1] = undefined;
					this.serviceType[1] = undefined;
				}
			}
			if(name == 'dataRequest'){
				if(this.isDataRequest == false){
					this.isDataRequest = true;
					this.configure[2] = '纯数据请求';
					this.configure[3] = '返回参数'
					this.serviceType[2] = 3;
				}else{
					this.isDataRequest = false;
					this.configure[2] = undefined;
					this.configure[3] = undefined;
					this.serviceType[2] = undefined;
				}
			}
		},
		checkNull(obj){
			if(obj == "" || obj == undefined || obj.length == 0){
				return false;
			}else{
				return true;
			}
		},
		saveBasicInfo(nameInfo){
			var type_temp = new Array();
				for(var i = 0 ; i < 3 ; i ++){
					if(this.serviceType[i] != undefined && this.serviceType[i] != null && parseInt(this.serviceType[i])==(i+1)){
						type_temp.push(this.serviceType[i]);
					}
				}
				this.service_type = type_temp;
			var that = this;
			var flag = true;
			var myData = {
						name:this.service_name,
						apptype:this.apptype,
						app_id:this.applyId,
						service_type:this.service_type,
						service_tag:this.service_tag,
						service_brief:this.service_brief,
						service_remark:this.service_remark,
						bg_img:this.bg_img,
						img:this.img,
						audit_status:0,
						tag_id:this.checkedLabels,
						visit_num:"0",
						service_start_time:this.startTime,
						service_end_time:this.endTime,
						source_type:this.source_type
					};
			
			if(!that.checkNull(myData.name)){
				TipBoxService.open("请填写服务名称",2)
				flag = false;
				return false;
			}
			if(!that.checkNull(myData.service_start_time) || !that.checkNull(myData.service_end_time)){
				TipBoxService.open("请选择服务期限",2);
				flag = false;
				return false;
			}
			if(myData.name.length > 20){
				TipBoxService.open("服务名称长度最多为20位",1)
				flag = false;
				return false;
			}
			if(!that.checkNull(myData.apptype)){
				TipBoxService.open("请选择归属应用",2)
				flag = false;
				return false;
			}
			if(!that.checkNull(myData.app_id) && this.apptype == 2){
				TipBoxService.open("请选择服务",2)
				flag = false;
				return false
			}
			if(!that.checkNull(myData.service_type)){
				TipBoxService.open("请选择页面配置类型",2)
				flag = false;
				return false;
			}
			if(!that.checkNull(myData.service_tag)){
				TipBoxService.open("请选择标签",2)
				flag = false;
				return false;
			}
			if(!that.checkNull(myData.service_brief)){
				TipBoxService.open("请填写服务简介",2)
				flag = false;
				return false;
			}
			if(myData.service_brief.length > 50){
				TipBoxService.open("服务简介最多50字符",1)
				flag = false;
				return false;
			}				
			
			if(flag && that.indexNext == 0){
				console.log(myData)				
				if(this.atomicId == undefined || this.atomicId == null || this.atomicId == ""){
					LoadingBoxService.open("正在执行，请稍候...");
					apiClient.post('itsmApi/atomicService/insertAtomicInfo',myData,function(data){
						if(data.status == 200){
							that.atomicId = data.results.atomicId
							if(nameInfo == 'toNext'){
								 //setTimeout(function(){
									LoadingBoxService.close();
									that.$router.push({
										name: 'newServiceNext',
										query: {
											name: JSON.stringify(that.configure),
											atomicId: that.atomicId,
											applyId : that.applyId,
											apptype : that.apptype,
											isEdit2 : that.isEdit2
										}
									})
									that.indexNext ++
								//},4000)
								
							}else{
								LoadingBoxService.close();
								TipBoxService.open('暂存成功')
							}

						}else{
							LoadingBoxService.close();
							TipBoxService.open(data.exception,1)
						}
			})
			}else{
				if(this.opt == 1){
					TipBoxService.open("该服务已提交，暂不能修改！",1)
					return false;
				}
				if(this.opt == 2){
					TipBoxService.open("该服务审批已通过，暂不能修改！",1)
					return false;
				}
				
				var arr = this.service_type;
				var one = arr.indexOf(1);
				var two = arr.indexOf(2);
				var three  = arr.indexOf(3);
				var itme = '{"service_param":[{}],"request_type":"","output_body":"","service_out_param":[],"input_body":"","request_port":"","url":""}';
				
				var myDatas = {
					id:this.atomicId,
					name:this.service_name,
					apptype:this.apptype,
					app_id:this.applyId,
					service_type:this.service_type,
					service_tag:this.service_tag,
					service_brief:this.service_brief,
					service_remark:this.service_remark,
					bg_img:this.bg_img,img:this.img,
					audit_status:this.opt,
					tag_id:this.checkedLabels,
					service_start_time:this.startTime,
					service_end_time:this.endTime,
					belong_type:this.belong_type,
					approval_batchNo:this.approval_batchNo,
					approval_workflow:this.approval_workflow,
					source_type:this.$route.query.source_type					
				};
				if(that.service_param_detail != undefined && that.service_param_detail != ""){
					if(one == "-1"){
						that.service_param_detail.splice(0,1,itme);
					}
					if(two == "-1"){
						that.service_param_detail.splice(1,1,itme);
					}
					if(three == "-1"){
						that.service_param_detail.splice(2,1,itme);
					}	
					myDatas.service_param_detail=this.service_param_detail;
				}

				LoadingBoxService.open("正在执行，请稍候...");
				apiClient.post('itsmApi/atomicService/updateAtomicInfo',myDatas,function(data){
						if(data.status == 200){
							if(nameInfo == 'toNext'){
								LoadingBoxService.close();
							that.$router.push({
								name: 'newServiceNext',
								query: {
				                	name: JSON.stringify(that.configure),
				                	atomicId: that.atomicId,
				                	applyId : that.applyId,
				                	apptype : that.apptype,
				                	isEdit2 : that.isEdit2
				    			}
					    	})
							}else{
								LoadingBoxService.close();
								TipBoxService.open('暂存成功')
							}
						}else{
							LoadingBoxService.close();
							TipBoxService.open(data.exception,1)
						}
		    	})
			}

			}
		},
		toSaveInfo(name){
    		this.saveBasicInfo(name)
		},
		saveLabel () {
			this.service_tag = this.metaData.serviceTag;
			this.metaData.resourcetag = this.service_tag.join(',');
			return true;
		},

	},
  	components: {
	    LabelView,
	}
}
</script>
<style src="../../css/common/public.css" scoped></style>
<style src="../../css/createBasicService/newService.css" scoped></style>
<style>
	.newService .el-date-editor.el-input{
		width: 180px !important;
	}
	.newService .el-dialog__body {
		min-height: 430px;
		padding-top: 20px;
	}
	.newService .el-dialog__header{
		background-color: #fff;
		padding: 0;
		padding-bottom: 15px;
		border-bottom: 1px solid #eeeeee;
	}
	.newService .el-dialog__header .el-dialog__title{
		color: #1f2d3d !important;
	}
	.newService .el-dialog__headerbtn .el-dialog__close{
		color: #bfcbd9 !important;
	}
	.newService .el-dialog.el-dialog--small{
		padding: 20px 20px 0 20px;
	}
</style>
