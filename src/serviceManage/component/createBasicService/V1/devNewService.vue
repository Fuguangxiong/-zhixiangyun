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
			                                <span class="texet lihei"><i class="mustAdd">*</i>服务资源名称</span>
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
			                                <span class="texet"><i class="mustAdd">*</i>页面配置类型</span>
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
			                                    <input disabled="" type="text" class="inputborder textlinpu-text wi450" v-model='metaData.resourcetag'>
			                                </span>
			                                <span class="inputime padingstye">
			                                    <button @click="showTags" class="inputborder butbox">选择标签</button>
			                                </span>
			                            </div>
			                            <div class="time-x">
			                                <span class="texet"><i class="mustAdd">*</i>服务简介</span>
			                                <span class="inputime ">
			                                     <textarea v-model="service_brief" class="inputborder wi50" ></textarea>
			                                </span>
			                            </div>
			                             <div class="time-x">
			                                <span class="texet">服务描述</span>
			                                <span class="inputime ">
			                                     <textarea v-model="service_remark" class="inputborder wi550" ></textarea>
			                                </span>
			                            </div>
			                            <div class="touxi">
				                            <dl>
				                                <dd class="box">
				                                    <div>
				                                        <form name="mainForm">
														  	<input @change="handleFileChange('logo')"  id="id1"  type="file"  />
														  	<img  :src="successUrl1" alt="">
														  	<label for="id1"></label>
														  	<div :class="{hidBox:hideFlag1}">
														  		<i></i>
				                                       			<p>服务logo上传</p>	
														  	</div>
												  		</form>
				                                    </div>
				                                </dd>
				                                <dt><label for="id1" class="choiceBg">选择logo</label></dt>
				                            </dl>
				                            <dl>
				                                <dd class="box">
				                                    <div>
				                                        <form name="mainForm">
														  	<input @change="handleFileChange('backImg')"  id="id2"  type="file"  />
														  	<img  :src="successUrl2" alt="">
														  	<label for="id2"></label>
														  	<div :class="{hidBox:hideFlag2}">
														  		<i></i>
				                                       			<p>服务背景图上传</p>
														  	</div>
												  		</form>
				                                    </div>
				                                </dd>
				                                <dt><label for="id2" class="choiceBg">选择背景图</label></dt>
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
	<LabelView :dialogTagVisible.sync="dialogTagVisible" :isCreateModel="!isEdit" :model="metaData" modelLabelKey="serviceTag" :changeLabelCaller="saveLabel" />
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
	  	return{
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
			service_status:"2",
			open_time:"",
			apply_time:"",
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
	  		belong_type:'',
	  		approval_workflow:0,//流程审批：
	  		opt:0,
			metaData:{
				serviceTag:[], //标签名称数组
				resourcetag:""  //标签名称字符串
			}, //包含标签名称数组的对象
			isEdit: this.$route.query.atomicId !== undefined,  //用于标签判断是否是新建服务
			isEdit2:false  //用于下一步页面标签判断是否新建服务
	  	}
	},
	mounted(){
		this.getApplications()
	},
	methods:{
		backPage() {
			this.$router.push("/serviceManage");
		},
		toMain(){
			this.$router.push("appsManager")
		},
		getBasicInfo(){
			var that = this;
			if(this.$route.query.atomicId != undefined && this.$route.query.atomicId != ""){
				this.atomicId = this.$route.query.atomicId;
				document.getElementById("selecrApp").disabled='disabled';
				var myData = {id:this.$route.query.atomicId};
				apiClient.post('itsmApi/atomicService/loadServiceInfo',myData,function(data){
					console.log("---serviceInfo---->",data)
					if(data.results.data[0].service_param_detail != undefined){
		    			that.isEdit2 = true;
		    		}
        			that.service_param_detail=data.results.data[0].service_param_detail;
					that.applyId = data.results.data[0].app_id
					that.service_status = data.results.data[0].service_status
					that.opt = data.results.data[0].audit_status
					that.apply_time = data.results.data[0].apply_time
					that.open_time = data.results.data[0].open_time
					for(var i = 0 ; i < data.results.data[0].service_type.length ; i ++){
						that.serviceType.push(data.results.data[0].service_type[i])
					}
					
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
					that.service_name = data.results.data[0].name
					that.service_brief = data.results.data[0].service_brief
					that.service_remark = data.results.data[0].service_remark
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
		    	}else{
		    		$("#id2").val("")
		    		that.successUrl2 = apiClient.apiBaseUrl + '/itsmApi/attachment/show?imgPath=' + data.fileName + "&token="+apiClient.token;
		    		that.bg_img = data.fileName
		    		that.hideFlag2 = true;
		    	}
	    	})
	    },
		getApplications(){
			var that=this;
        	var myData={params:{}};
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
						audit_status:this.opt,
						service_status:this.service_status,
						apply_time:this.apply_time,
						open_time:this.open_time,
						tag_id:this.checkedLabels,
						visit_num:"0"
					};
			
			if(!that.checkNull(myData.name)){
				TipBoxService.open("请填写服务名称",2)
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
				LoadingBoxService.open("正在执行，请稍候...");
				if(this.atomicId == undefined || this.atomicId == null || this.atomicId == ""){
					apiClient.post('itsmApi/atomicServiceDev/insertAtomicInfo',myData,function(data){
						if(data.status == 200){
							that.atomicId = data.results.atomicId
							if(nameInfo == 'toNext'){
								 //setTimeout(function(){
									LoadingBoxService.close();
									that.$router.push({
										name: 'devNewServiceNext',
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
					service_status:this.service_status,
					tag_id:this.checkedLabels,
					apply_time:this.apply_time,
					open_time:this.open_time,
					visit_num:"0"
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
				apiClient.post('itsmApi/atomicServiceDev/updateAtomicInfo',myDatas,function(data){
						if(data.status == 200){
							if(nameInfo == 'toNext'){
								LoadingBoxService.close();
							that.$router.push({
								name: 'devNewServiceNext',
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