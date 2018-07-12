<template>
	<div class="newServiceNext">
		<div class="hauto">
    <!-- 主题内容菜单 -->
    <div class="resoubox ">
        <div class="resou-con">
            <div class="w1200">
            <div class="publicNav">
		      <img @click="toMain()" class="hand" src="">
		      <!-- <router-link :to="{name:'personRegisterManage'}">服务管理</router-link> -->
		      <span class="active">服务管理</span>
		      <span class="arrows">></span>
		      <span class="active">参数配置</span>
		    </div>
            <div class="mode-div lanm-con" v-bind:style="{'height':(fullHeight-160) +'px'}">
                <div class="register">
                    <div class="lanmpege">
                        <div class="lanmp-con">
                            <div class="lanbbag ">
                                <p style="width: 75%"></p>
                            </div>
                            <div class="lanbag-text">
                                <span class="tim1">基本信息</span>
                                <span class="tim2">参数配置</span>
                                <span class="tim3">配置完成</span>
                            </div>
                        </div>
                    </div>
                    <!--biaod-->
                    <div class="iformcon">
                        <div class="iformcon-con reg1">
                            <div class="tablnav">
                                <ul>
                                	<li v-for="(tab,index) in tabList" :class="{'active': idinfo === index}" @click="choose(index,tab)">{{tab}}</li>
                                </ul>
                            </div>
                            <!-- 页面请求 -->
                            <div v-show="isPageRequestShow" class="pageRequest">
                            	<div class="time-x">
						            <span class="texet"><i class="mustAdd">*</i>请求方式</span>
						            <span class="inputime ">
						                 <div @click="selected1('post')" class="css-radio" :class="{active : postSelected1}"><i></i><em>POST</em></div>
						                 <div @click="selected1('get')" class="css-radio" :class="{active : getSelected1}"><i></i><em>GET</em></div>
						            </span>
					        	</div>
					        	<div class="time-x" v-if="this.postSelected1">
						            <span class="texet">字符集</span>
						            <span class="inputime ">						                 
						                <select v-model="Param.service_param_detail[0].charset" class="inptcss2">
                                             <option value=""></option>
                                             <option value="UTF-8">UTF-8</option>
                                             <option value="GBK">GBK</option>
                                             <option value="GB2312">GB2312</option>
                                         </select>
						            </span>
					        	</div>
					        	<!--
						        <div class="time-x">
						            <span class="texet">参数设置</span>
						            <span class="inputime ">
						                 <div>
						                     <div class="tabth">
						                         <span class="ww1">参数名称</span>
						                         <span class="ww2">序号</span>
						                         <span class="ww3">参数类型</span>
						                         <span class="ww4">字段描述</span>
						                         <span class="ww5">标签</span>
						                     </div>						                     
						                     <div class="tabcon">
						                         <div class="shulist-con">
						                             
						                             <div v-for="(tableInfo,index) in tableInfos1" class="shulist">
						                                 <div class="shulist-m">
						                                     <div class="w2 eqad">
						                                         <input v-model="tableInfo.name" type="text" class="inptcss inptcssw">
						                                     </div>
						                                     <div class="w1">
						                                         <select disabled="" v-model="tableInfo.order" name="" id="" class="inptcss1">
						                                             <option selected :value='tableInfo.order'>{{index+1}}</option>
						                                         </select>
						                                     </div>
						                                     <div class="w1">
						                                         <select v-model="tableInfo.param_type" name="" id="" class="inptcss2">
						                                             <option value="1">字符</option>
						                                             <option value="2">长文本</option>
						                                             <option value="3">数值</option>
						                                         </select>
						                                     </div>
						                                     <div class="w3">
						                                         <input v-model="tableInfo.describe" type="text" class="inptcss inptcssw1">
						                                     </div>
						                                     <div class="w2 poes">
						                                         <input disabled="" v-model="tableInfo.tag" :value="resourcetag" type="text" class="inptcss inptcssw2 fl">
						                                         <div class="chepoc">
						                                             <i @click="showTags(index,1)" class="charu"></i>
						                                             
						                                         </div>
						                                     </div>
						                                     <div class="w1">
						                                         <i @click="addTable1(index)" class="icobut">+</i>
						                                         <i @click="closeShowUerDefined1(index)" class="icobut">-</i>
						                                     </div>
						                                 </div>
						                             </div>
						                         </div>						                         
						                     </div>						                    
						                 </div>
						            </span>
						        </div>
						         -->
						        <div class="time-x">
						            <span class="texet"><i class="mustAdd">*</i>请求地址</span>
						            <span class="inputime ">
						                 <select :class="{porthide:isHide}" v-model="Param.service_param_detail[0].request_port" id="" class="inptcss w200">
						                 	<option value="选择端口" selected>选择端口</option>
						                    <option v-for="port in app_port">{{port}}</option>
						                 </select>
						                <input placeholder="请输入请求路径" v-model="Param.service_param_detail[0].url" type="text" class="cssinput w590" :class="{beLong:isHide}">
						            </span>
						        </div>
						        <div v-if="isShow1" class="time-x">
						            <span class="texet">请求体</span>
						            <span class="inputime ">
						                <textarea placeholder='请输入请求体，例:#{"arg1":"#{arg1}"}' v-model="Param.service_param_detail[0].input_body" class="cssinput teac" ></textarea>
						            </span>
						        </div>
                            </div>
                            <!-- 页面数据请求 -->
                            <div v-show="isPageDataRequestShow" class="pageDataRequest">
                            	<div class="time-x">
						            <span class="texet"><i class="mustAdd">*</i>请求方式</span>
						            <span class="inputime ">
						                <div @click="selected2('post')" class="css-radio" :class="{active : postSelected2}"><i></i><em>POST</em></div>
						                <div @click="selected2('get')" class="css-radio" :class="{active : getSelected2}"><i></i><em>GET</em></div>
						            </span>
						        </div>
						        <div class="time-x" id="charset1" v-if="this.postSelected2">
						            <span class="texet">字符集</span>
						            <span class="inputime ">
						                <select v-model="Param.service_param_detail[1].charset" class="inptcss2">
                                             <option value=""></option>
                                             <option value="UTF-8">UTF-8</option>
                                             <option value="GBK">GBK</option>
                                             <option value="GB2312">GB2312</option>
                                         </select>
						            </span>
					        	</div>
						        <div class="time-x">
						            <span class="texet"><i class="mustAdd">*</i>参数设置</span>
						            <span class="inputime ">
						                 <div>
						                     <div class="tabth">
						                         <span class="ww1">参数名称</span>
						                         <span class="ww2">序号</span>
						                         <span class="ww3">参数类型</span>
						                         <span class="ww4">字段描述</span>
												 <span class="ww5">标签</span>
						                         <span class="ww6">是否必输</span>
						                     </div>
						                     <div class="tabcon">
						                         <div class="shulist-con">
						                             <!--数据一条-->
						                             <div v-for="(tableInfo,index) in tableInfos2" class="shulist">
						                                 <div class="shulist-m">
						                                     <div class="w2 eqad">
						                                         <input v-model="tableInfo.name" type="text" class="inptcss inptcssw">
						                                     </div>
						                                     <div class="w1">
						                                         <select v-model="tableInfo.order" name="" id="" class="inptcss1">
						                                             <option selected :value='tableInfo.order'>{{index+1}}</option>
						                                         </select>
						                                     </div>
						                                     <div class="w1">
						                                         <select v-model="tableInfo.param_type" name="" id="" class="inptcss2">
						                                             <option value="1">字符</option>
						                                             <option value="2">长文本</option>
						                                             <option value="3">数值</option>
						                                         </select>
						                                     </div>
						                                     <div class="w3">
						                                         <input v-model="tableInfo.describe" type="text" class="inptcss inptcssw1">
						                                     </div>
						                                     <div class="w2 poes">
						                                         <input disabled v-model="tableInfo.tag" type="text" class="inptcss inptcssw2 fl">
						                                         <div class="chepoc">
						                                             <i @click="showTags(index,2)" class="charu"></i><!-- 
						                                             <span class="charutex">插入</span> -->
						                                         </div>
						                                     </div>
															 <div class="w3">
						                                         <input v-model="tableInfo.isRequired" type="checkbox" @click="clickRequired(index,2)" class="tableSelectBtn">
						                                     </div>
						                                     <div class="w1">
						                                         <i @click="addTable2(index)" class="icobut">+</i>
						                                         <i @click="closeShowUerDefined2(index)" class="icobut">-</i>
						                                     </div>
						                                 </div>
						                             </div>
						                         </div>
						                     </div>
						                 </div>
						            </span>
						        </div>
						        <div class="time-x">
						            <span class="texet"><i class="mustAdd">*</i>请求地址</span>
						            <span class="inputime ">
						                 <select :class="{porthide:isHide}" name="" id="" v-model="Param.service_param_detail[1].request_port" class="inptcss w200">
											<option value="选择端口" selected>选择端口</option>
						                    <option  v-for="port in app_port">{{port}}</option>
						                 </select>
						                <input placeholder="请输入请求路径" v-model="Param.service_param_detail[1].url" type="text" class="cssinput w590" :class="{beLong:isHide}">
						            </span>
						        </div>
						        <div v-if="isShow2" class="time-x">
						            <span class="texet">请求体</span>
						            <span class="inputime ">
						                 <textarea placeholder='请输入请求体，例:#{"arg1":"#{arg1}"}'v-model="Param.service_param_detail[1].input_body" class="cssinput teac" ></textarea>
						            </span>
						        </div>
                            </div>
                            <!-- 纯数据请求 -->
                            <div v-show="isDataRequestShow" class="dataRequest">
                            	<div class="time-x">
						            <span class="texet"><i class="mustAdd">*</i>请求方式</span>
						            <span class="inputime ">
						                <div @click="selected3('post')" class="css-radio" :class="{active : postSelected3}"><i></i><em>POST</em></div>
						                <div @click="selected3('get')" class="css-radio" :class="{active : getSelected3}"><i></i><em>GET</em></div>
						            </span>
						        </div>
						        <div class="time-x">
						            <span class="texet"><i class="mustAdd">*</i>参数设置</span>
						            <span class="inputime ">
						                 <div>
						                     <div class="tabth">
						                         <span class="ww1">参数名称</span>
						                         <span class="ww2">序号</span>
						                         <span class="ww3">参数类型</span>
						                         <span class="ww4">字段描述</span>
						                         <span class="ww5">标签</span>
												 <span class="ww6">是否必输</span>
						                     </div>
						                     <div class="tabcon">
						                         <div class="shulist-con">
						                             <!--数据一条-->
						                             <div v-for="(tableInfo,index) in tableInfos3" class="shulist">
						                                 <div class="shulist-m">
						                                     <div class="w2 eqad">
						                                         <input v-model="tableInfo.name" type="text" class="inptcss inptcssw">
						                                     </div>
						                                     <div class="w1">
						                                         <select disabled="" v-model="tableInfo.order"name="" id="" class="inptcss1">
						                                             <option selected :value='tableInfo.order'>{{index+1}}</option>
						                                         </select>
						                                     </div>
						                                     <div class="w1">
						                                         <select v-model="tableInfo.param_type" name="" id="" class="inptcss2">
						                                             <option value="1">字符</option>
						                                             <option value="2">长文本</option>
						                                             <option value="3">数值</option>
						                                         </select>
						                                     </div>
						                                     <div class="w3">
						                                         <input v-model="tableInfo.describe" type="text" class="inptcss inptcssw1">
						                                     </div>
						                                     <div class="w2 poes">
						                                         <input disabled="" v-model="tableInfo.tag" type="text" class="inptcss inptcssw2 fl">
						                                         <div class="chepoc">
						                                             <i @click="showTags(index,3)" class="charu"></i>
						                                             <!-- <span class="charutex">插入</span> -->
						                                         </div>
						                                     </div>
															 <div class="w3">
						                                         <input v-model="tableInfo.isRequired" @click="clickRequired(index,3)" type="checkbox" class="tableSelectBtn">
						                                     </div>
						                                     <div class="w1">
						                                         <i @click="addTable3(index)" class="icobut">+</i>
						                                         <i @click="closeShowUerDefined3(index)" class="icobut">-</i>
						                                     </div>
						                                 </div>
						                             </div>
						                         </div>
						                     </div>
						                 </div>
						            </span>
						        </div>
						        <div class="time-x">
						            <span class="texet"><i class="mustAdd">*</i>请求地址</span>
						            <span class="inputime ">
						                 <select :class="{porthide:isHide}" name="" id="" v-model="Param.service_param_detail[2].request_port" class="inptcss w200">
						                 	<option value="选择端口" selected>选择端口</option>
						                    <option selected v-for="port in app_port">{{port}}</option>
						                 </select>
						                <input placeholder="请输入请求路径" v-model="Param.service_param_detail[2].url" type="text" class="cssinput w590" :class="{beLong:isHide}">
						            </span>
						        </div>
						        <div v-if="isShow3" class="time-x">
						            <span class="texet">请求体</span>
						            <span class="inputime ">
						                 <textarea placeholder='请输入请求体，例:#{"arg1":"#{arg1}"}' v-model="Param.service_param_detail[2].input_body" class="cssinput teac" ></textarea>
						            </span>
						        </div>
                            </div>
                            <!-- 返回参数 -->
                            <div v-show="isReturnParametersShow" class="returnParameters">
                            	<div class="time-x">
						            <span class="texet"><i class="mustAdd">*</i>参数设置</span>
						            <span class="inputime ">
						                 <div>
						                     <div class="tabth">
						                         <span class="ww1">参数名称</span>
						                         <span class="ww2">序号</span>
						                         <span class="ww3">参数类型</span>
						                         <span class="ww4">字段描述</span>
						                         <span class="ww5">标签</span>
						                     </div>
						                     <div class="tabcon">
						                        <div class="shulist-con">
						                             <!--数据一条-->
						                              <div v-for="(tableInfo,index) in tableInfos4" class="shulist">
						                                 <div class="shulist-m">
						                                     <div class="w2 eqad">
						                                         <input v-model="tableInfo.name" type="text" class="inptcss inptcssw">
						                                     </div>
						                                     <div class="w1">
						                                         <select disabled="" v-model="tableInfo.order"name="" id="" class="inptcss1">
						                                             <option selected :value='tableInfo.order'>{{index+1}}</option>
						                                         </select>
						                                     </div>
						                                     <div class="w1">
						                                         <select v-model="tableInfo.param_type" name="" id="" class="inptcss2">
						                                             <option value="1">字符</option>
						                                             <option value="2">长文本</option>
						                                             <option value="3">数值</option>
						                                         </select>
						                                     </div>
						                                     <div class="w3">
						                                         <input v-model="tableInfo.describe" type="text" class="inptcss inptcssw1">
						                                     </div>
						                                     <div class="w2 poes">
						                                         <input disabled="" v-model="tableInfo.tag" type="text" class="inptcss inptcssw2 fl">
						                                         <div class="chepoc">
						                                             <i @click="showTags(index,4)" class="charu"></i>
						                                             <!-- <span class="charutex">插入</span> -->
						                                         </div>
						                                     </div>
						                                     <div class="w1">
						                                         <i @click="addTable4(index)" class="icobut">+</i>
						                                         <i @click="closeShowUerDefined4(index)" class="icobut">-</i>
						                                     </div>
						                                 </div>
						                             </div>
						                         </div>
						                     </div>
						                 </div>
						            </span>
						        </div>
						        <div class="time-x">
						            <span class="texet">输出格式</span>
						            <span class="inputime ">
						                 <textarea placeholder='请输入输出格式，例:#{"arg1":"#{arg1}"}' v-model="Param.service_param_detail[2].output_body" class="cssinput teac" ></textarea>
						            </span>
						        </div>
                            </div>
                        </div>
                    </div>
                    <!--/biaodan-->
                    <div class="buttnet">
                        <span @click="toPrev" class="butonstred">上一步</span>
                        <span @click="toSaveInfo('toNext')" class="butonstred">下一步</span>
                        <span @click="toSaveInfo('temporaryStorage')" class="butonst">暂&nbsp;存</span>
                        <!-- <span @click="previewHandler" class="butonpre">预&nbsp;览</span> -->
                    </div>
                </div>
            </div>
            </div>
        </div>
    </div>
<LabelView :dialogTagVisible.sync="dialogTagVisible" :maxTag="5" :isCreateModel="!isEdit" :model="checkedLabels" modelLabelKey="tagArray" :changeLabelCaller="saveLabel" /></div>
	</div>
</template>
<script>
import LabelView from '../../../publicComponent/labelView.vue'
import apiToken from '../../../publicJs/apiToken.js'
import apiClient from '../../../publicJs/ApiClient.js'
import JSONLint from '../../lib/jsonlint.js'
import NoticeBoxService from '../../../publicJs/NoticeBoxService.js'
import TipBoxService from "../common/TipBoxService.js";
import LoadingBoxService from '../../../publicJs/LoadingBoxService.js'
	export default{
		watch: {
			'checkedLabels.tagArray' (value) {
				 if(this.num == 1){
					//this.tableInfos1[this.index].tag = value.join(',');
					//this.tagId1[this.index] = value;
				}else if(this.num == 2){
					this.tableInfos2[this.index].tag = value.join(',');
					this.tagId2[this.index] = value;
				}else if(this.num == 3){
					this.tableInfos3[this.index].tag = value.join(',');
					this.tagId3[this.index] = value;
				}else if(this.num == 4){
					this.tableInfos4[this.index].tag = value.join(',');
					this.tagId4[this.index] = value;
				}
			}
		},
		data(){
			return{
				source_type:'',
				fullHeight: document.documentElement.clientHeight,
				dialogTagVisible: false,//选择标签 是否隐藏。
				checkedLabels: [],
				resourcetag:"",
				isDataRequestShow:false,
				isPageRequestShow:false,
				isPageDataRequestShow:false,
				isReturnParametersShow:false,
				tabList:[],
				idinfo:0,
				postSelected1:true,
                getSelected1:false,
				isShow1:true,
                tableInfos1:[{order:1,tag:"",tag_id:[],isRequired:false}],
                postSelected2:true,
                getSelected2:false,
                isShow2:true,
                isHide:false,
                tableInfos2:[{order:1,tag:"",tag_id:[],isRequired:false}],
                postSelected3:true,
                getSelected3:false,
                isShow3:true,
                tableInfos3:[{order:1,tag:"",tag_id:[],isRequired:false}],
                tableInfos4:[{order:1,tag:"",tag_id:[]}],
                tagId1:[],
                tagId2:[],
                tagId3:[],
                tagId4:[],
                app_port:[],
                index:"",
				num:"",
                Param:{
                	id:"",
                	audit_status:0,
                	visit_num:"0",//访问数，新建时默认为0
				    belong_type:'',
					approval_workflow:0,//流程审批：
					approval_batchNo:0,//批次号
					service_end_time:'',
					service_start_time:'',
					service_param_detail:[{
						url: "",
						request_type: "post",
						chartset:"",
				    	input_body: "",
				   	 	request_port: "选择端口",
						output_body: "",
						service_param: [],
						service_out_param:[],
					},
					{
						url: "",
						request_type: "post",
						chartset:"",
				    	input_body: "",
				   	 	request_port: "选择端口",
						output_body: "",
						service_param:[],
						service_out_param:[],
					},
					{
						url: "",
						request_type: "post",
				    	input_body: "",
				   	 	request_port: "选择端口",
						output_body: "",
						service_param:[],
						service_out_param:[],
					}]
				},
				checkedLabels: {
					tagArray:[]
				},
				isEdit: this.$route.query.isEdit2,
				
			}
		},
		mounted(){
			this.init();
			this.getConfigInfo();
			if(this.$route.query.apptype == 1){
				this.isHide = true;
			}else{
				this.getPort();
			}
		},
		methods:{
			init(){
				var configList = JSON.parse(this.$route.query.name)
				for(var i = 0 ; i < configList.length ; i++){
					if(configList[i] != null || configList[i] != undefined){
						this.tabList.push(configList[i])
					}
				}
				this.checkShow(this.tabList[0])
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
			clickRequired(index,num){
				if(num == 1){

				}else if(num == 2){
					if(this.tableInfos2[index].isRequired){
						this.tableInfos2[index].isRequired = !this.tableInfos2[index].isRequired
					}else{
						this.tableInfos2[index].isRequired = !this.tableInfos2[index].isRequired
					}
				}else if(num == 3){
					if(this.tableInfos3[index].isRequired){
						this.tableInfos3[index].isRequired = !this.tableInfos3[index].isRequired
					}else{
						this.tableInfos3[index].isRequired = !this.tableInfos3[index].isRequired
					}
				}else{
					if(this.tableInfos4[index].isRequired){
						this.tableInfos4[index].isRequired = !this.tableInfos4[index].isRequired
					}else{
						this.tableInfos4[index].isRequired = !this.tableInfos4[index].isRequired
					}
				}
			},
			showTags(index,num){
				this.num = num;
				this.index = index;
			    this.dialogTagVisible = true;
			    if(num == 1){
			    	if(this.tagId1[index] != undefined){
				    	this.checkedLabels.tagArray = this.tagId1[index]
				    }else{
						this.checkedLabels.tagArray = [];
					}
			    }else if(num == 2){
					if(this.tagId2[index] != undefined){
				    	this.checkedLabels.tagArray = this.tagId2[index]
				    }else{
						this.checkedLabels.tagArray = [];
					}
			    }else if(num == 3){
			    	if(this.tagId3[index] != undefined){
				    	this.checkedLabels.tagArray = this.tagId3[index]
				    }else{
						this.checkedLabels.tagArray = [];
					}
			    }else{
			    	if(this.tagId4[index] != undefined){
				    	this.checkedLabels.tagArray = this.tagId4[index]
				    }else{
						this.checkedLabels.tagArray = [];
					}
			    }
			},

			saveLabel () {
				 if(this.num == 1){
					//this.tableInfos1[this.index].tag = this.checkedLabels.tagArray.join(',');
					//this.tagId1[this.index] = this.checkedLabels.tagArray;
				}else if(this.num == 2){
					this.tableInfos2[this.index].tag = this.checkedLabels.tagArray.join(',');
					this.tagId2[this.index] = this.checkedLabels.tagArray;
				}else if(this.num == 3){
					this.tableInfos3[this.index].tag = this.checkedLabels.tagArray.join(',');
					this.tagId3[this.index] = this.checkedLabels.tagArray;
				}else{
					this.tableInfos4[this.index].tag = this.checkedLabels.tagArray.join(',');
					this.tagId4[this.index] = this.checkedLabels.tagArray;
				}
				return true;
			},
			getConfigInfo(){
				var that = this;
				if(this.$route.query.atomicId != undefined){
					this.Param.id = this.$route.query.atomicId;
					LoadingBoxService.open("正在执行，请稍候...");
					var myData = {id:this.$route.query.atomicId};
					apiClient.post('itsmApi/atomicService/loadServiceInfo',myData,function(data){
		    			if(data.status == 200){
		    				LoadingBoxService.close();
		    				var obj = data.results.data[0];
		    				that.Param.app_id = obj.app_id;
							that.Param.name = obj.name;
							that.Param.apptype = obj.apptype;
							that.Param.service_brief = obj.service_brief;
							that.Param.service_remark = obj.service_remark;
							that.Param.service_type = obj.service_type;
							that.Param.service_tag = obj.service_tag;
							that.Param.img = obj.img;
							that.Param.bg_img = obj.bg_img;
							that.Param.isatomic = obj.isatomic;
							that.Param.service_status = obj.service_status;
							that.Param.audit_status = obj.audit_status;
							that.Param.approval_workflow = obj.approval_workflow;
							that.Param.approval_batchNo = obj.approval_batchNo;
							that.Param.service_end_time = obj.service_end_time;
							that.Param.service_start_time = obj.service_start_time;
							that.Param.source_type = obj.source_type;
							that.source_type = obj.source_type;
		    				if(obj.service_param_detail != undefined){		    				
			    				for(var i = 0 ; i < obj.service_param_detail.length ; i ++){
			    					that.Param.service_param_detail[i] = JSON.parse(obj.service_param_detail[i])
			    					if(i == 0){
			    						/*that.tableInfos1 = JSON.parse(obj.service_param_detail[0]).service_param
			    						for(var a = 0 ; a < that.tableInfos1.length ; a ++){
			    							that.tagId1.push(that.tableInfos1[a].tag_id)
										}*/
			    						if(JSON.parse(obj.service_param_detail[0]).request_type == 'post'){
					    					that.postSelected1 = true;
					    					that.getSelected1 = false;
					    					that.isShow1 = true;
					    					that.charset1 = obj.service_param_detail[0].charset;
					    					
					    				}else{
					    					that.getSelected1 = true;
					    					that.postSelected1 = false;
					    					that.isShow1 = false;
					    					
					    				}
			    					}else if(i == 1){
										that.tableInfos2 = JSON.parse(obj.service_param_detail[1]).service_param
										for(var a = 0 ; a < that.tableInfos2.length ; a ++){
											that.tagId2.push(that.tableInfos2[a].tag_id)
										}
			    						if(JSON.parse(obj.service_param_detail[1]).request_type == 'post'){
					    					that.postSelected2 = true;
					    					that.getSelected2 = false;
					    					that.isShow2 = true;
					    					that.charset2 = obj.service_param_detail[1].charset;
					    					
					    				}else{
					    					that.getSelected2 = true;
					    					that.postSelected2 = false;
					    					that.isShow2 = false;
					    					
					    				}
			    					}else if(i == 2){
			    						that.tableInfos3 = JSON.parse(obj.service_param_detail[2]).service_param
			    						if(JSON.parse(obj.service_param_detail[2]).service_out_param.length > 0){
			    							that.tableInfos4 = JSON.parse(obj.service_param_detail[2]).service_out_param
			    						}
			    						for(var a = 0 ; a < that.tableInfos3.length ; a ++){
											that.tagId3.push(that.tableInfos3[a].tag_id)
										}
										for(var a = 0 ; a < that.tableInfos4.length ; a ++){
											that.tagId4.push(that.tableInfos4[a].tag_id)
										}
			    						if(JSON.parse(obj.service_param_detail[2]).request_type == 'post'){
					    					that.postSelected3 = true;
					    					that.getSelected3 = false;
					    					that.isShow3 = true;
					    				}else{
					    					that.getSelected3 = true;
					    					that.postSelected3 = false;
					    					that.isShow3 = false;
					    				}
			    					}
			    				}
		    				}
			    		}else{
			    			TipBoxService.open(data.exception,1)
			    		}
		    		})
				}
			},
			getPort(){
				var that = this;
				var myData = {id:this.$route.query.applyId};
				apiClient.post('itsmApi/application/selectAppPort',myData,function(data){
					if(data.status == 200){
						that.app_port =	data.results.data
					}else{
						TipBoxService.open(data.exception,1)
					}
					
				})
			},
			checkShow(obj){
				if(obj == "页面请求"){
					this.isPageRequestShow = true
					this.isDataRequestShow = false;
					this.isPageDataRequestShow = false;
					this.isReturnParametersShow = false;
				}else if(obj == "页面数据请求"){
					this.isPageDataRequestShow = true;
					this.isReturnParametersShow = false;
					this.isPageRequestShow = false
					this.isDataRequestShow = false;
				}else if(obj == "纯数据请求"){
					this.isDataRequestShow = true;
					this.isReturnParametersShow = false;
					this.isPageRequestShow = false;
					this.isPageDataRequestShow = false;
				}else{
					this.isReturnParametersShow = true;
					this.isPageRequestShow = false;
					this.isDataRequestShow = false;
					this.isPageDataRequestShow = false;
				}
			},
			choose(index,tab){
				this.idinfo = index
				this.checkShow(tab)
			},
			/*页面请求*/
			selected1(name){
                if(name == "post"){
                    this.postSelected1 = true;
                    this.getSelected1 = false;
                    this.isShow1 = true;                   
                    this.Param.service_param_detail[0].request_type = name
                }else if(name == "get"){
                    this.getSelected1 = true;
                    this.postSelected1 = false;
                    this.isShow1 = false;
                    this.Param.service_param_detail[0].request_type = name
                }
            },
            addTable1(index){
                //this.tableInfos1.push({order:this.tableInfos1.length+1,tag:"",tag_id:[]});
            },
            /*closeShowUerDefined1(index){
            	if(this.tableInfos1.length > 1){
            		this.tableInfos1.splice(index,1);
            		for(var i = 0 ; i < this.tableInfos1.length ; i ++){
            			this.tableInfos1[i].order = i+1
            		}
            	}else{
            		TipBoxService.open("当只有一行时不可删除");	
            	}
            },*/
            /*页面数据请求*/
			selected2(name){
                if(name == "post"){
                    this.postSelected2 = true;
                    this.getSelected2 = false;
                    this.isShow2 = true;
                    this.Param.service_param_detail[1].request_type = name
                }else if(name == "get"){
                    this.getSelected2 = true;
                    this.postSelected2 = false;
                    this.isShow2 = false;
                    this.Param.service_param_detail[1].request_type = name
                }
            },
            addTable2(index){
                this.tableInfos2.push({order:this.tableInfos2.length+1,tag:"",tag_id:[],isRequired:false});
            },
            closeShowUerDefined2(index){
            	if(this.tableInfos2.length > 1){
            		this.tableInfos2.splice(index,1);
            		for(var i = 0 ; i < this.tableInfos2.length ; i ++){
            			this.tableInfos2[i].order = i+1
            		}
            	}else{
            		TipBoxService.open("只有一行的时候无法删除",2)
            	}
            },
            /*纯数据请求*/
            selected3(name){
                if(name == "post"){
                    this.postSelected3 = true;
                    this.getSelected3 = false;
                    this.isShow3 = true;
                    this.Param.service_param_detail[2].request_type = name
                }else if(name == "get"){
                    this.getSelected3 = true;
                    this.postSelected3 = false;
                    this.isShow3 = false;
                    this.Param.service_param_detail[2].request_type = name
                }
            },
            addTable3(index){
                this.tableInfos3.push({order:this.tableInfos3.length+1,tag:"",tag_id:[],isRequired:false});
            },
            closeShowUerDefined3(index){
            	if(this.tableInfos3.length > 1){
					this.tableInfos3.splice(index,1);
					for(var i = 0 ; i < this.tableInfos3.length ; i ++){
            			this.tableInfos3[i].order = i+1
            		}
            	}else{
            		TipBoxService.open("只有一行的时候无法删除",2)
            	}
            },
            /*返回参数*/
            addTable4(index){
                this.tableInfos4.push({order:this.tableInfos4.length+1,tag:"",tag_id:[],isRequired:false});
            },
            closeShowUerDefined4(index){
            	if(this.tableInfos4.length > 1){
            		this.tableInfos4.splice(index,1);
            		for(var i = 0 ; i < this.tableInfos4.length ; i ++){
            			this.tableInfos4[i].order = i+1
            		}
            	}else{
					TipBoxService.open("只有一个行的时候无法删除",2)            		
            	}
            },
            saveAllInfo(nameInfo){
				if(this.Param.audit_status == 1){
					TipBoxService.open("该服务已提交，暂不能修改！",1)
					return false;
				}
				if(this.Param.audit_status == 2){
					TipBoxService.open("该服务审批已通过，暂不能修改！",1)
					return false;
				}
            	if(nameInfo == 'toNext'){
            		this.Param.audit_status = 1
            	}
            	var that = this;
				var myData = this.Param;
				apiClient.post('itsmApi/atomicService/updateAtomicInfo',myData,function(data){
            			if(data.status == 200){
            				if(nameInfo == 'toNext'){
            					LoadingBoxService.close();
            					that.$router.push({name: 'newServiceFinish',query: { id: myData.id }})
	            			}else{
	            				LoadingBoxService.close();
	 							TipBoxService.open('暂存成功');           				
	            			}
            			}else{
            				LoadingBoxService.close();
            				TipBoxService.open(data.exception,1); 
            			}
            	})
            },

            checkInfo(arr,infoArr,tabName){
            	var flag = true;
				var newArr = new Array();
				var constantArr = new Array();
    			var nameArr = new Array();
    			if(arr.request_type == "" || arr.request_type == undefined){
    				TipBoxService.open('请选择'+tabName+'请求类型',2);
    				flag = false;
    				return false;
    			}
    			if(tabName != "页面请求"){
    				for(var i = 0 ; i < infoArr.length ; i ++){
	    				if(infoArr[i].name == undefined){
	    					TipBoxService.open("请输入"+tabName+"参数名称",2);
	    					flag = false;
	    					return false;
	    				}
	    				if(infoArr[i].param_type == undefined){
	    					TipBoxService.open("请选择"+tabName+"参数类型",2);
	    					flag = false;
	    					return false;
	    				}
	    				if(infoArr[i].describe == undefined){
	    					TipBoxService.open("请输入"+tabName+"参数描述",2);
	    					flag = false;
	    					return false;
	    				}
	    				if(infoArr[i].tag == ""){
	    					TipBoxService.open("请插入"+tabName+"标签",2);
	    					flag = false;
	    					return false;
	    				}
	    			}
    			}/*else{
    				for(var i = 0 ; i < infoArr.length ; i ++){
    					console.log(infoArr[i].param_type)
	    				if(infoArr[i].name != undefined && infoArr[i].name != "" || infoArr[i].param_type != undefined && infoArr[i].param_type != "" || infoArr[i].describe != undefined && infoArr[i].describe != "" || infoArr[i].tag != ""){
	    					if(infoArr[i].name == undefined || infoArr[i].name == ""){
	    						TipBoxService.open("请选择"+tabName+"参数名称",2)
	    						flag = false;
	    						return false;
	    					}
		    				if(infoArr[i].param_type == undefined || infoArr[i].param_type == ""){
		    					TipBoxService.open("请选择"+tabName+"参数类型",2);
		    					flag = false;
		    					return false;
		    				}
		    				if(infoArr[i].describe == undefined || infoArr[i].describe == ""){
		    					TipBoxService.open("请输入"+tabName+"参数描述",2);
		    					flag = false;
		    					return false;
		    				}
		    				if(infoArr[i].tag == ""){
		    					TipBoxService.open("请插入"+tabName+"标签",2);
		    					flag = false;
		    					return false;
		    				}
	    				}
	    			}
    			}*/
    			if(arr.request_type == "post"){
    				if(arr.input_body != "" && arr.input_body != undefined){
        				try{
			            	JSONLint.jsonlint.parse(arr.input_body);            
				        }catch(e){
				        	TipBoxService.open(""+tabName+"请求体格式有误，请输入正确格式",2)
				            flag = false;
				            return false;
				        }
        			}
    			}
    			if(arr.url == "" || arr.url == undefined){
    				TipBoxService.open('请输入'+tabName+'的请求路径',2);
    				flag = false;
    				return false;
    			}else{
    				if(this.$route.query.apptype != 2){
    					if(!this.urlValidate(arr.url)){
							TipBoxService.open("地址输入有误",2)
							flag = false;
							return false;
						}
					}else{
						if(arr.request_port == "" || arr.request_port == "选择端口"){
            				TipBoxService.open('请选择'+tabName+'的端口号',2);
            				flag = false;
            				return false;
            			}
					}
    			}
    			for(var i = 0 ; i < infoArr.length ; i ++){
    				if(infoArr[i].name != undefined){
    					nameArr.push(infoArr[i].name)	
    				}
    			}
    			if(flag){
					var infoArg = "";
					var newArg = "";
					var outPutArg = "";
					var lastArg = "";
					var s = nameArr.join(",")+",";  
					for(var i=0;i<nameArr.length;i++) {  
						if(s.replace(nameArr[i]+",","").indexOf(nameArr[i]+",")>-1) {
							infoArg = nameArr[i]  
						}
					}
					if(infoArg != ""){
						TipBoxService.open("配置项中存在重复参数！",2)
						flag = false;
						return false;
					}else{
						if(arr.request_type == "post"){
							if(arr.input_body != ""){
								var inputArr = "";
								//根据中括号判断请求体中的参数是否为数组
								if(arr.input_body.indexOf("[") != -1 || arr.input_body.indexOf("]") != -1){
									TipBoxService.open("输入参数不支持数组格式",2)
									flag = false;
									return false;
								}else{
									inputArr = arr.input_body.split(",");
									for(var k = 0 ; k < inputArr.length ; k ++){
										var paramsArr = inputArr[k].split(":");
										var kvArray = inputArr[k].split(":");
										if(kvArray.length > 2){
											var paramKey = kvArray[kvArray.length-2]
											var paramValue = kvArray[kvArray.length-1]
										}else{
											var paramKey = kvArray[0];
											var paramValue = kvArray[1];
										}
										if(paramValue.indexOf("#{") != -1){
											newArr.push(paramValue.substring(3,paramValue.indexOf("}")));
										}
									}												
								}							
							}
							//将请求体中的参数存在数组中
							var outPutArr = new Array();
							if(arr.url.split("#{").length != 1){
								var f1 = arr.url.split("#{")
								for(var i = 0 ; i < f1.length ; i ++){
									if(i < f1.length-1){
										var a1 = f1[i+1];
										var a = a1.indexOf("{")
										var e = a1.indexOf("}")
										outPutArr.push(a1.substring(a+1,e))
									}
								}
							}
							//判断请求体找那个是否存在重复参数
							var s = newArr.join(",")+",";
							for(var i=0;i<newArr.length;i++) {  
								if(s.replace(newArr[i]+",","").indexOf(newArr[i]+",")>-1) {
									newArg = newArr[i]  
								}
							}
							if(newArg != ""){
								TipBoxService.open("请求体中存在重复参数",2);
								flag = false;
								return false;
							}
							//判断路径中是否存在重复参数
							var s = outPutArr.join(",")+",";
							for(var i=0;i<outPutArr.length;i++) {  
								if(s.replace(outPutArr[i]+",","").indexOf(outPutArr[i]+",")>-1) {
									outPutArg = outPutArr[i]  
								}
							}
							if(outPutArg != ""){
								TipBoxService.open("路径中存在重复参数",2);
								flag = false;
								return false;
							}
							//将请求路径中和请求体中的参数合并在同一个数组中
							for(var i = 0 ; i < newArr.length ; i++){
								outPutArr.push(newArr[i])
							}
							//判断请求路径和请求体中是否存在相同的参数
							var s = outPutArr.join(",")+",";
							for(var i=0;i<outPutArr.length;i++) {  
								if(s.replace(outPutArr[i]+",","").indexOf(outPutArr[i]+",")>-1) {
									lastArg = outPutArr[i]  
								}
							}
							if(lastArg != ""){
								TipBoxService.open("请求体和路径中存在重复参数",2);
								flag = false;
								return false;
							}
							var res = [];
							//var json = {};
							for(var i = 0; i < outPutArr.length; i++){
							  	//if(!json[outPutArr[i]]){
									res.push(outPutArr[i]);
								// 	json[outPutArr[i]] = 1;
							  	// }
							}
							var _a = (JSON.stringify(nameArr.sort()))
							var _b = (JSON.stringify(res.sort()))
							if(_a != _b){
								TipBoxService.open("配置参数和请求参数不一致！",2)
								return false;
							}
							if(nameArr.length != res.length){
								TipBoxService.open("配置参数和请求参数不一致！",2)
								flag = false;
								return false;
    						}
						}
					}	
				}
				return flag;
            },
            
            toSaveInfo(nameInfo){
            	//this.Param.service_param_detail[0].service_param = this.tableInfos1
            	this.Param.service_param_detail[1].service_param = this.tableInfos2
            	this.Param.service_param_detail[2].service_param = this.tableInfos3
            	this.Param.service_param_detail[2].service_out_param = this.tableInfos4
            	
            	for(var i = 0 ; i < this.Param.service_param_detail.length ; i ++){
            		if(this.Param.service_param_detail[i].request_port == undefined){
            			this.Param.service_param_detail[i].request_port = ""
            		}
            	}
            	var arr = this.Param.service_param_detail;
            	var flag = true;
            	var checkFlag = true;
            	var checkFlag2 = true;
            	for(var t = 0 ; t < this.tabList.length ; t++){
            		if(this.tabList[t] == "页面请求"){
            			var infoArr = this.Param.service_param_detail[0].service_param
            			if(!this.checkInfo(arr[0],infoArr,this.tabList[t])){
            				flag = false;
            				return false;
            			}
            		}else if(this.tabList[t] == "页面数据请求"){
            			var infoArr = this.Param.service_param_detail[1].service_param
            			if(!this.checkInfo(arr[1],infoArr,this.tabList[t],flag)){
            				flag = false;
            				return false;
            			}
            		}else if(this.tabList[t] == "纯数据请求"){
            			var infoArr = this.Param.service_param_detail[2].service_param
            			if(!this.checkInfo(arr[2],infoArr,this.tabList[t],flag)){
            				flag = false;
            				return false;
            			}
            		}else if(this.tabList[t] == "返回参数"){
            			var infoArr = this.Param.service_param_detail[2].service_out_param
            			var newArr = new Array();
            			var nameArr = new Array();
            			for(var i = 0 ; i < infoArr.length ; i ++){
            				nameArr.push(infoArr[i].name)
            			}
            			for(var i = 0 ; i < infoArr.length ; i ++){
            				if(infoArr[i].name == undefined){
            					TipBoxService.open("请输入返回参数参数名称",2);
            					checkFlag2 = false;
            					flag = false;
            					return false;
            				}
            				if(infoArr[i].order == undefined){
            					TipBoxService.open("请选择返回参数序号",2);
            					checkFlag2 = false;
            					return false;
            				}
            				if(infoArr[i].param_type == undefined){
            					TipBoxService.open("请选择返回参数参数类型",2);
            					checkFlag2 = false;
            					return false;
            				}
            				if(infoArr[i].describe == undefined){
            					TipBoxService.open("请输入返回参数参数描述",2);
            					checkFlag2 = false;
            					return false;
            				}
            				if(infoArr[i].tag == ""){
            					TipBoxService.open("请输入返回参数标签",2);
            					checkFlag2 = false;
            					return false;
            				}
            			}
            			if(arr[2].output_body == "" || arr[2].output_body == undefined){
            				TipBoxService.open('请输入输出格式',2);
            				flag = false;
            				return false;
            			}else{
            				try{
				            	JSONLint.jsonlint.parse(arr[2].output_body);            
					        }catch(e){
					            TipBoxService.open("格式有误，请输入正确格式",2)
					            flag = false;
					            return false;
					        }
        				}
        				if(flag){
        					var infoArg = "";
        					var newArg = "";
        					var outPutArg = "";
							var s = nameArr.join(",")+",";
							var inputArr = [];  
							for(var i=0;i<nameArr.length;i++) {  
								if(s.replace(nameArr[i]+",","").indexOf(nameArr[i]+",")>-1) {
									infoArg = nameArr[i]  
								}
							}
        					if(infoArg != ""){
        						TipBoxService.open("配置项中存在重复参数！",2)
        						flag = false;
        						return false;
        					}else{
    							if(arr[2].output_body != ""){
									if(arr[2].output_body.indexOf("[") != -1 || arr[2].output_body.indexOf("]") != -1){
										inputArr = arr[2].output_body.substring(arr[2].output_body.indexOf("[")+1,arr[2].output_body.indexOf("]")).split(",");
										for(var i = 0 ; i < inputArr.length ; i ++){
											if(inputArr[i].indexOf("#{") != -1){
												newArr.push(inputArr[i].substring(inputArr[i].indexOf("#{")+2,inputArr[i].indexOf("}")))
											}
										}
									}else{
										inputArr = arr[2].output_body.split(",");
										for(var k = 0 ; k < inputArr.length ; k ++){
											var paramsArr = inputArr[k].split(":");
											var kvArray = inputArr[k].split(":");
											var paramKey = kvArray[0];
											var paramValue = kvArray[1];
											if(paramValue.indexOf("#{") != -1){
												newArr.push(paramValue.substring(3,paramValue.indexOf("}")));
											}
										}
										
									}
								}
								var s1 = newArr.join(",")+",";
								for(var i=0;i<newArr.length;i++) {  
									if(s1.replace(newArr[i]+",","").indexOf(newArr[i]+",")>-1) {
										newArg = newArr[i]  
									}
								}
								if(newArg != ""){
									TipBoxService.open("输出格式中存在重复参数",2)
									flag = false;
									return false;
								}
								var _a = (JSON.stringify(nameArr.sort()))
								var _b = (JSON.stringify(newArr.sort()))
								if(_a != _b){
									TipBoxService.open("配置参数和请求参数不一致！",2)
									return false;
								}
								if(nameArr.length != newArr.length){
									TipBoxService.open("配置参数和请求参数不一致！",2)
									flag = false;
									return false;
        						}
    						}
    					}
            		}
            	}
            	var that = this;
            	if(flag){
            		LoadingBoxService.open("正在执行，请稍候...");
            		that.saveAllInfo(nameInfo);            		
            	}
            },
            toPrev(){
            	var that = this
            	NoticeBoxService.open("返回上一步之前建议暂存，否则数据会丢失。",function(){
            		NoticeBoxService.close();
            		that.$router.push({
						name: 'newService',
						query: {
							atomicId: that.$route.query.atomicId,
							source_type:that.source_type
		    			}
		    		})
            	})
            },
            urlValidate(value) {
			    const urlReg = /^(http(s)?:\/\/)?(www\.)?[\w-]+\.\w{2,4}(\/)?$/; // 允许英文，中文和英文不能同时出现，1-20位
			    var re_weburl = new RegExp(
			      "^" +
			        // protocol identifier
			        "(?:(?:https?|ftp)://)" +
			        // user:pass authentication
			        "(?:\\S+(?::\\S*)?@)?" +
			        "(?:" +
			          // IP address dotted notation octets
			          // excludes loopback network 0.0.0.0
			          // excludes reserved space >= 224.0.0.0
			          // excludes network & broacast addresses
			          // (first & last IP address of each class)
			          "(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])" +
			          "(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}" +
			          "(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))" +
			        "|" +
			          // host name
			          "(?:(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)" +
			          // domain name
			          "(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*" +
			          // TLD identifier
			          "(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))" +
			        ")" +
			        // port number
			        "(?::\\d{2,5})?" +
			        // resource path
			        "(?:/\\S*)?"
			     	, "i"
			    );
			    if (!value) {
			        return false;
			    } else {
			        if (!re_weburl.test(value)) {
			            return false;
			        } else {
			            return true;
			        }
			    }
			},
			previewHandler(){
        		window.open("#/invoke?previewTag=1&id="+this.$route.query.atomicId,"_blank");
      		}
		},
		components:{
			LabelView
		}
	}
</script>
<style src="../../css/common/public.css" scoped></style>
<style src="../../css/createBasicService/newServiceNext.css" scoped></style>
