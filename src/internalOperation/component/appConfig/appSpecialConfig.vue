<template>
	<div class="appSpecialConfig appImgConfigBox" :model="addList">
		<div class="appSpecialConfigTop">
			<div class="appSpecialConfigLeft">
					<span >精彩专题(最多可新建30条)</span><em class="maxsize"></em>
			</div>
			<div class="appSpecialConfigTopRight" data-toggle="modal" data-target="#exampleModal"  @click="clearData('addList')">
				新增
			</div>
			<!--新增专题弹框-->
			<div class="modal fade" id="exampleModal" role="dialog" aria-labelledby="exampleModalLabel">
				<div class="modal-dialog" role="document">
					<div class="modal-style modal-content">
						<div class="modal-header">
							<button type="button"  class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
							<h4 class=" modal-title" id="exampleModalLabel">新增专题</h4>
						</div>
						<div class="modal-body">

						  <!-- <el-form :model="addList" :rules="rules" ref="addList" label-width="100px"  class="demo-ruleForm " > -->
							
								 <div class="form-group">
									<label for="message-text" class="control-label" ><em class="remnants">*</em>标题</label>
									<input v-bind:class="{'form-control' :true}" @blur="titleInput" v-model.trim="addList.title"  id="message-text"  placeholder="标题最多10个字">
								    <span class="form-group__title" >{{checktitle}}</span>                                
								</div>
							
                                 <div class="form-group">
                                   <label for="message-text" class="control-label" ><em class="remnants">*</em>导语</label>
									<textarea v-bind:class="{'form-control' :true}" @input="descInput"  @blur="checkdescInput" v-model.trim="addList.desc"  id="message-text" maxlength="30" placeholder="导语最多30个字"></textarea>
								    <span class="form-group__desc">{{daoyuflag}}</span> 
         							 <span class="checknum"><span class="remnants">{{remnant}}</span>/30</span> 
								</div>
								<div class="form-group">
									<label for="message-text" class="control-label"><em class="remnants">*</em>标签</label>
									<div  v-bind:class="{'form-control' :true}"   id="message-text" >
										<div id="chagelable" v-model="addList.tags" @click="add()" v-for="(tag,index) in addList.tags" :key="tag">{{tag}} <span  class="icon iconfont icon-cuohao hovershow"  @click="deltetag(index)"></span></div>
									</div>
								<span class="form-group__message"  v-show="lableflag" >标签不能为空</span> 
								</div>
								<div class="form-group" @click="showTags">添加标签</div>
								<div class="form-group">
									<label for="message-text" class="control-label"><em class="remnants">*</em>专题图片</label>
									<div class="form-control" id="message-text">
										<div>
											<form name="mainForm">
												<input @change="handleFileChange('add')" id="id1" type="file"  style="cursor: pointer;"/>
												<img :src="addList.pic" alt="" v-show="showimg">
												<label for="id1"></label>
												<div :class="{hidBox:hideFlag1}" style="float:left">
													<i class="el-icon-plus avatar-uploader-icon"></i>
												</div>
											</form>
                                           
											<p style="float:left">建议尺寸350*700，大小不超过100KB</p>
										</div>

									</div>
                                     <span class="form-group__img" v-show="imgsflag">图片不能为空</span>
									 <span class="form-group__img" v-if="imgseorr">上传头像图片只能是 JPG 或 PNG格式</span>
									   <span class="form-group__img" v-if="maximgs">上传图片大小不能超过 100KB!</span>
								</div>

						   <!-- </el-form> -->
						</div>
						<div class="modal-footer">
							<span type="button" class="btn btn-primary" @click="saveData(addList)" :loading="addLoading">确定</span>
							<span type="button" class="btn btn-default" data-dismiss="modal" @click="resetForm('addList')">取消</span>
						</div>
					</div>
				</div>
			</div>
			<!--新增专题弹框-->
			<!--编辑专题弹框-->
			<div class="modal fade" id="exampleModal3" role="dialog" aria-labelledby="exampleModalLabel">
				<div class="modal-dialog" role="document">
					<div class="modal-style modal-content">
						<div class="modal-header">
							<button type="button" class="close" data-dismiss="modal" aria-label="Close" @click="chehuixiugai" ><span aria-hidden="true">&times;</span></button>
							<h4 class="modal-title" id="exampleModalLabel">修改专题</h4>
						</div>
						<div class="modal-body">
							 <!-- <el-form :model="updateObj" :rules="updaterules" ref="updateObj" label-width="100px" class="demo-ruleForm " > -->
								<div class="form-group">								   
                                     <!-- <el-form-item label="标题" prop="title" >
             						 <el-input v-model.trim="updateObj.title" style="height:26px" placeholder="标题最多10个字" ></el-input>
         							 </el-form-item>						 -->
									<label for="message-text" class="control-label" ><em class="remnants">*</em>标题</label>
									<input v-bind:class="{'form-control' :true}" @blur="updatetitleInput" v-model.trim="updateObj.title"  id="message-text"  placeholder="标题最多10个字">
								    <span class="form-group__title" >{{updatechecktitle}}</span> 
								</div>
							
                                 <div class="form-group">
                                     <!-- <label for="message-text" class="control-label"><em class="remnants">*</em>导语</label>
									<textarea @input="updateInput" v-model.trim="updateObj.desc" class="form-control" id="message-text"  maxlength="30" placeholder="导语最多30个字"></textarea>
								    <span class="form-group__desc"  v-show="daoyuflag" >导语不能为空</span> 
                                    
         							 <span class="checknum"><span class="remnants">{{uremnant}}</span>/30</span>  -->
									<label for="message-text" class="control-label" ><em class="remnants">*</em>导语</label>
									<textarea v-bind:class="{'form-control' :true}" @input="descInput"  @blur="updatecheckdescInput" v-model.trim="updateObj.desc"  id="message-text" maxlength="30" placeholder="导语最多30个字"></textarea>
								    <span class="form-group__desc">{{updatedaoyuflag}}</span> 
         							<span class="checknum"><span class="remnants">{{uremnant}}</span>/30</span> 
								</div>
								<div class="form-group">
									<label for="message-text" class="control-label"><em class="remnants">*</em>标签</label>
									<div class="form-control" id="message-text">
										<div v-model.trim="updateObj.tags" @click="add()" v-for="(tag,index) in updateObj.tags" >{{tag}} <span class="icon iconfont icon-cuohao hovershow" @click="delUpfatetag(index)"></span></div>
									</div>
								<span class="form-group__message"  v-show="lableflag" >标签不能为空</span> 
								</div>
								<div class="form-group" @click="showTags1">添加标签</div>
								<div class="form-group">
									<label for="message-text" class="control-label"><em class="remnants">*</em>专题图片</label>
									<div class="form-control" id="message-text">
										<div>
											<form name="mainForm">
												<input @change="handleFileChange('update')" id="id2" type="file" />
												<img :src="updateObj.pic" alt=""  >
												<label for="id2"></label>
												<div :class="{hidBox:!hideFlag1}">
													<!-- <i class="el-icon-plus avatar-uploader-icon"></i> -->
												</div>
											</form>
                                           
											<p>建议尺寸350*700，大小不超过100KB</p>
										</div>

									</div>
                                   <span class="form-group__img" v-show="imgsflag">图片不能为空</span>
									 <span class="form-group__img" v-if="imgseorr">上传头像图片只能是 JPG 或 PNG格式</span>
									   <span class="form-group__img" v-if="maximgs">上传图片大小不能超过 100KB!</span>
								</div>

							<!-- </el-form> -->
						</div>
						<div class="modal-footer">
							<span type="button"  class="btn btn-primary" @click="reviseData(updateObj.id)">确定</span>
							<span type="button" class="btn btn-default" data-dismiss="modal"  @click="chehuixiugai">取消</span>
						</div>
					</div>
				</div>
			</div>
			<!--编辑专题弹框-->
		</div>
	
		<div v-if="notNull" class="appSpecialConfigBottom" >
			<!--拖拽-->
		     
			<ul>
				 <draggable class="conoxList" v-model.trim="subjectList" :move="getdata" @update="datadragEnd">
					<li v-for="(list,index) in subjectList" >
						<div class="appSpecialConfigBottomLeft"><img v-lazy="list.pic" /></div>
						<div class="appSpecialConfigBottomCenter">
							<div>
								<h4>{{list.title}}</h4>
								<!-- <p>状态：<span>{{list.status}}</span></p> -->
							</div>
							<div>
								{{list.desc}}
							</div>
						</div>
						<div class="appSpecialConfigBottomRight appHotConfigDlie" >
							<span title="编辑" class="exit" data-toggle="modal" data-target="#exampleModal3"  @click="updateSpecial(list,index)"><i></i></span>
							<span title="删除" class="del"  @click="delet(list)"> <i></i></span>
						</div>
					</li>
				</draggable>
		    </ul>
		    
	    </div>
	
		 <div v-else class="noInformation" > 
				<img src="../../images/zanwu.png"  >
		  </div> 
	<!-- 选择标签 -->
	<LabelView :dialogTagVisible.sync="dialogTagVisible" :isCreateModel="isEdit" :model="metaData" modelLabelKey="serviceTag" :changeLabelCaller="saveLabel" />
	</div>
</template>

<script>
	import LabelView from '../../../publicComponent/labelView.vue'
	import apiToken from '../../../publicJs/apiToken.js'
	import apiClient from '../../../publicJs/ApiClient.js'
	import TipBoxService from '../../../publicJs/TipBoxService.js'
	import LoadingBoxService from '../../../publicJs/LoadingBoxService.js'
	import NoticeBoxService from '../../../publicJs/NoticeBoxService.js' //简单提示框
	import appPublicJs from '../../common/public.js'
	import draggable from 'vuedraggable'
	import Util from '../../../publicJs/Util.js'
	export default {
		name: 'appSpecialConfig',
		data() {
			return {
				imagelist:[],
				imgseorr:false,//图片格式错误
				maximgs:false,//图片超过大小
				notNull:true,
				listlength:"",
   		        showimg:false,//是否显示图片提交的加号
   		        isActive:false,//
   		        listtotal:'',//专题总数
   		        daoyuflag:"",//导语为空是否显示
   		        lableflag:false,//标签为空提示是否显示
   		        imgsflag:false,//图片为空提示是否显示
   		        canwrite:false,//导语框是否可以继续输入
				remnant: 30, //剩余可输入字数
				uremnant: 30, //修改剩余可输入字数
				imageUrl: '',
				pageNum: 1,
				pageSize: 30,
				hideFlag1: false,
				radio: '1',
				i: -1,
				/*isShow: false,//是否显示图片提交的加号*/
				dialogTagVisible: false, //选择标签 是否隐藏。
				metaData: {
					serviceTag: [], //标签名称数组
					resourcetag: "" //标签名称字符串
				}, //包含标签名称数组的对象
				isEdit: "false", //用于标签判断是否是新建服务,
				subjectList: [], //专题列表,
			
				addList: { //专题新增弹框					
					title: "",
					desc: "",
					tags: [],
					pic: ''
				},
				id: '',
				addIndex: "",
				addLoading: false,
				updateObj: {//修改专题
					title: '',
					desc: '',
					tags: [],
					pic: '',
					id: ''
				},
				fileName: '',
				 checktitle:"",//标题输入错误提示
				 updatechecktitle:"",
				 updatedaoyuflag:"",//导语为空是否显示
				 
			}
		},
		computed:{
			desc() {
		　　　　return this.addList.desc
		　　}
		},
		components: {
			draggable,
			LabelView
		
		},
	/*	watch: {
	       desc(newValue, oldValue) {
	　　　　console.log(newValue.length)
	   debugger;4
	if(newValue.length > 50){
		this.addList.desc = oldValue
		
     	}
	　　}
      },*/
		//获取数据
		mounted() {
			this.getSpecialList();
			var that = this;
			window.addEventListener("click", function(e) {
				if(e.target._prevClass == "el-icon-more") {
					return
				}
				that.i = -1;
			})
            // $('#chagelable').bind('DOMNodeInserted', function(e) {
            //   this.checklable();
            // });
		},
		methods: {
			chehuixiugai(){
				this.getSpecialList();
			},
	  	    regst:function(value){
				var pattern = new RegExp("[`~!%+-.@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]")
				return pattern.test(value)
             },
			getdata (evt) {
		        console.log(evt.draggedContext.element.id)
		      },
		    datadragEnd (evt) {
				LoadingBoxService.open('加载中...');
		        apiClient.put(apiToken.newApi('appmarket/content/dragAndContentDrop/'), appPublicJs.dragData(this.subjectList), function(data) {
				LoadingBoxService.close(); 
				if(data.results.status==false){
                        TipBoxService.open("拖拽失败!",2);
				   }
                })
		      },
			//点击新增专题按钮时清空数据
			clearData(formName){
				this.hideFlag1=false;
				$("#id1").val("");
				this.fileName="";
				this.addList.pic="";
				this.isActive=false,//
				this.addList.title="";
				this.addList.desc="";
				this.addList.tags=[];
				this.remnant = 30;
				this.imgseorr=false,//图片格式错误
				this.maximgs=false,//图片超过大小
				this.daoyuflag="",//导语为空是否显示
				this.checktitle="";
				this.showimg=false;
   		        this.lableflag=false,//标签为空提示是否显示
   		        this.imgsflag=false,//图片为空提示是否显示
				this.canwrite=false//导语框是否可以继续输入
				// this.$refs[formName].resetFields();
			},
		
			// resetForm(formName) {
			// 	this.$refs[formName].resetFields();
			// },
			//新增剩余字数
			descInput() {
				this.addList.desc= Util.trim(this.addList.desc)
				var txtVal = this.addList.desc.length
				if( txtVal <= 30){
					this.remnant = 30 - txtVal;
				}else{
					this.canwrite=true;	
				}
			},
			//验证标题输入
			titleInput(){
               if(this.addList.title==""){
				  this.checktitle="标题不能为空";
				  this.isActive=true
			   }else if(this.regst(this.addList.title)){
				  this.checktitle="标题不能含有特殊字符";
				  this.isActive=true
			   }else if(this.addList.title.length>10){
				  this.checktitle="标题长度1-10个字符";
				  this.isActive=true
			   }else{
				  this.checktitle="";
				  this.isActive=false
			   }
			},
					//验证标题输入
			updatetitleInput(){
               if(this.updateObj.title==""){
				  this.updatechecktitle="标题不能为空";
				  this.isActive=true
			   }else if(this.regst(this.updateObj.title)){
				  this.updatechecktitle="标题不能含有特殊字符";
				  this.isActive=true
			   }else if(this.updateObj.title.length>10){
				  this.updatechecktitle="标题长度1-10个字符";
				  this.isActive=true
			   }else{
				  this.updatechecktitle="";
				  this.isActive=false
			   }
			},
			//验证导语输入
			checkdescInput(){
               if(this.addList.desc==""){
				   this.daoyuflag="导语不能为空";
				   this.isActive=true
			   }else if(this.regst(this.addList.desc)){
				  this.daoyuflag="导语不能含有特殊字符";
				  this.isActive=true
			   }else{
				  this.daoyuflag="";
				  this.isActive=false
			   }
			},
			//验证导语输入
			updatecheckdescInput(){
               if(this.updateObj.desc==""){
				   this.updatedaoyuflag="导语不能为空";
				   this.isActive=true
			   }else if(this.regst(this.updateObj.desc)){
				  this.updatedaoyuflag="导语不能含有特殊字符";
				  this.isActive=true
			   }else{
				  this.updatedaoyuflag="";
				  this.isActive=false
			   }
			},
			//修改说剩余输入字数
			updateInput() {
				this.updateObj.desc= Util.trim(this.updateObj.desc)
				var txtVal = this.updateObj.desc.length;
				if( txtVal <= 30){
					this.uremnant = 30 - txtVal;
				}else{
					this.canwrite=true;	
					
				}
			},
			delUpfatetag(index){
			   this.updateObj.tags.splice(index,1);
			},
			deltetag(index){
			  this.addList.tags.splice(index,1);
			},
			updateSpecial(list,index) {
				debugger;
				this.updateObj.pic="";
				this.imgsflag=false,//图片为空提示是否显示
				this.lableflag=false,//标签为空提示是否显示
				this.isActive=false,//
				this.daoyuflag="",//导语为空是否显示
				this.checktitle="";
				this.updatedaoyuflag="",//导语为空是否显示
				this.updatechecktitle="";
				this.fileName=list.pic;
				this.updateObj = list;
				this.updateInput();//修改时计算导语剩余字数
			},
			getSpecialList() {
				var that = this;
				var myData = {
					'templateId':this.$route.query.temId,
					'contentType': 'subject',
					"pageSize": that.pageSize,
					"pageNum": that.pageNum,
					"status": that.status
				};
				apiClient.get(apiToken.newApi('/appmarket/content/getCotentByType/'), myData, function(data) {
					if(appPublicJs.checkData(data.results.data)) {
						console.log(data.results.data[0].pic)
						
						that.notNull=true;
					
						that.subjectList = data.results.data;
						that.total = data.results.total;
						that.listtotal=data.results.total;
						that.listlength=that.subjectList.length;
						for(var i = 0; i < that.subjectList.length; i++) {
							that.imagelist.push(that.subjectList[i].pic);
							var id = that.subjectList[i].id;
							if(that.subjectList[i].pic.indexOf('http') < 0) {
								that.subjectList[i].pic = apiClient.apiBaseUrl + '/appmarket/upload/picimg?token=' + apiClient.token + '&img=' + that.subjectList[i].pic;
							}
						}
					  /*  if(data.results.total < that.subjectList.length || data.results.total==that.subjectList.length || that.subjectList.length==0){
							that.ifMore = false;
						} else {
							that.ifMore = true;
						}*/
					
					}
					else{
						that.notNull=false;
					}
				})
			},
			upperCase() {
				var x = document.getElementById("fname").value
				document.getElementById("fname").value = x.toUpperCase()
			},
			add() {
				this.tagLayeFlag = !this.tagLayeFlag;
			},
			showTags() { //专题保存里的标签
				//				this.addIndex=index;
				this.metaData.serviceTag = this.addList.tags ? this.addList.tags : [];
				this.metaData.resourcetag = this.addList.title ? this.addList.title : "";
				this.dialogTagVisible = true;
			},
			showTags1() { //专题编辑里的标签修改
				//				this.addIndex=index;
				this.metaData.serviceTag = this.updateObj.tags ? this.updateObj.tags : [];
				this.metaData.resourcetag = this.updateObj.title ? this.updateObj.title : "";
				this.dialogTagVisible = true;
			},
			saveLabel() {
				this.addList.tags[this.addIndex] = this.metaData.serviceTag;
				return true
			},
			//图片上传
			handleFileChange(state) {
			
				var that = this;
				that.file = event.currentTarget.files[0];
				apiClient.upload("/appmarket/upload/uploadFile?method=uploadFile", that.file, '').then(data => {
					var imgFlag = that.beforeAvatarUpload(that.file);
					if(imgFlag) {
						//						上传图片回显
						if(state=="add"){
						that.addList.pic = apiClient.apiBaseUrl + '/appmarket/upload/picimg?token=' + apiClient.token + '&img=' + data.fileName;
						}else{
						//						修改图片回显
						that.updateObj.pic = apiClient.apiBaseUrl + '/appmarket/upload/picimg?token=' + apiClient.token + '&img=' + data.fileName;
						}
						that.fileName = data.fileName;
						that.hideFlag1 = true
						that.showimg=true;
						that.errorimimgseorrgs=false;
						that.imgsflag=false;
						that.maximgs=false;
					}
				})
			},

			//上传之前校验图片
			beforeAvatarUpload(file) {
			
				var fileType = file.type === 'image/jpeg' || file.type === 'image/png';
				var flag = true;
				if(!fileType) {
				//	this.$message.error('上传头像图片只能是 JPG 或 PNG格式!');
				    this.imgseorr=true;//图片格式错误
				    this.maximgs=false;
					flag = false;
				}
				var isLt2M = appPublicJs.checkfile(file,0.1)
				if(!isLt2M) {
					// this.$message.error('上传图片大小不能超过 100KB!');
					this.imgseorr=false;//图片格式错误
				    this.maximgs=true;
				}
				return flag && isLt2M;
			},
			//专题编辑
			appSpecialConfigBianji(index) {
				this.i = index  
			},
			checklable(){
               if(this.addList.tags == ''){
					this.lableflag=true;
				}else{
					this.lableflag=false;
				}
			},
			//专题保存
			saveData() {
				debugger;
				var that = this;
				that.checkdescInput();
				that.titleInput();
				that.checklable();
			    if(that.checktitle !=""){
					return;
				};
				if(that.daoyuflag !=""){
					return;
				};
				if(that.addList.tags == '') {
					return 
				};
				if(that.fileName == ''){
					that.isActive=false;
					that.imgseorr=false;
					that.maximgs=false;
					that.imgsflag=true;
                    return 
				 }else{
					 that.imgsflag=false;
				 };
			
				if(that.listtotal>=30){
					TipBoxService.open("精彩专题最多30个", 2);
					$('#exampleModal').modal('hide');
					return;
				}
				var myData1 = {
					'templateId':this.$route.query.temId,
					"id": that.id,
					"title": that.addList.title,
					"desc": that.addList.desc,
					"pic": that.fileName,
					"tags": that.addList.tags.toString(),
					"status": 1,
					"contentName": "精彩专题",
					"contentType": "subject",
					"sort_order":1
				};
				console.log("添加1111",myData1.pic)
				 LoadingBoxService.open('保存中...');
				apiClient.post(apiToken.newApi('/appmarket/content/saveCotent/'), myData1, function(data) {
					if(data.results.status == true) {
						$('#exampleModal').modal('hide')
						LoadingBoxService.close(); 					
						TipBoxService.open("保存成功!");
						that.pageNum=1;
						that.getSpecialList();
						that.lableflag=false;
				        that.imgsflag=false;
					} else {
						TipBoxService.open("保存失败", 2);
					}
				})
				/*closeModel:function(){
                $('#exampleModal').modal('hide')
               }*/
			},
			//专题修改
			reviseData(id) {
				debugger;
				var that = this;
				that.updatecheckdescInput();
				that.updatetitleInput();
			    if(that.updatechecktitle !=""){
					return;
				};
				if(that.updatedaoyuflag !=""){
					return;
				};
				if(that.updateObj.tags == '') {
					that.lableflag=true;
					return 
				};
				if(that.fileName == ''){
					that.isActive=false;
					that.imgseorr=false;
					that.maximgs=false;
					that.imgsflag=true;
                    return 
				 }else{
					 that.imgsflag=false;
				 };
			
				var myData3 = {
					'templateId':this.$route.query.temId,
					"id": that.updateObj.id,
					"title": that.updateObj.title,
					"desc": that.updateObj.desc,
					"pic": that.fileName,
					"tags": that.updateObj.tags.toString(),
					"contentName": "精彩专题",
					"contentType": "subject",
					"sort_order":that.updateObj.sort_order
				};
				 LoadingBoxService.open('保存中...');
				apiClient.put(apiToken.newApi('/appmarket/content/updateContent/'), myData3, function(data) {
					if(data.results.status == true) {
						 $('#exampleModal3').modal('hide')
						LoadingBoxService.close(); 
						TipBoxService.open("修改成功!");
						that.pageNum=1;
						that.getSpecialList();
						that.lableflag=false;
				        that.imgsflag=false;
					} else {
						TipBoxService.open("修改失败!", 2);
					}
				})
			},
			delet(list) { //删除专题
				var that = this;
				var sortOrder= parseInt(list.sort_order);
				NoticeBoxService.open("是否要删除专题？", function() {
					NoticeBoxService.close();
					var myData2 = {
						'templateId':that.$route.query.temId,
						"id": list.id,
						"contentName": "精彩专题",
						"contentType": "subject",
						"sort_order": sortOrder
					}
					apiClient.delete(apiToken.newApi('/appmarket/content/deleteContent/'), myData2, function(data) {
						TipBoxService.open("删除成功");
						that.pageNum=1;
						that.getSpecialList();
						that.removeLabel();
					
					})
				});
			},

			removeLabel() {
				var that = this;
				return apiClient.get('/pubapi/label/remove', {
					name: that.updateObj.tags.toString()
				}).then(data => {}).catch(e => {
					console.error(e)
				})
			}

		/*	showMore() { //加载更多
				var that = this;
				that.pageNum++;
				var myData = {
					"contentName": "精彩专题",
					'contentType': 'subject',
					"pageSize": that.pageSize,
					"pageNum": that.pageNum,
					"status": that.status
				}
				apiClient.get(apiToken.newApi('/appmarket/content/getCotentByType/'), myData, function(data) {
					if(appPublicJs.checkData(data.results.data)) {
						var list = data.results.data;
						for(var i = 0; i < list.length; i++) {
							if(list[i].pic.indexOf('http') < 0) {
								list[i].pic = apiClient.apiBaseUrl + '/appmarket/upload/picimg?token=' + apiClient.token + '&img=' + list[i].pic;
							}
							that.subjectList.push(list[i]);
						}
						if(data.results.total < that.subjectList.length || data.results.total==that.subjectList.length || that.subjectList.length==0){
							that.ifMore = false;
						} else {
							that.ifMore = true;
						}
					} else {
						that.show = false;
					}
				});
			}*/
		}
	}
</script>

<style src='../../css/appSpecialConfig.css' scoped></style>

