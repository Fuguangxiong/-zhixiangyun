<template>
	<div class="newServiceNext">
		<div class="hauto">
			<!-- <div class="hade">
								<div class="w1200 tophade">
							            <div class="fl loade"><a href="#">请登录</a><a href="#">立即注册</a></div>
							            <div class="fr topup">
							                <h3><em>账户信息</em><i></i></h3>
							                <div class="topup-con">
							                    <p><a href="#">11111</a></p>
							                    <p><a href="#">11111</a></p>
							                    <p><a href="#">11111</a></p>
							                    <p><a href="#">11111</a></p>
							                </div>
							            </div>
							            <div class="fr xinx"><a href="#">高级搜索</a><a href="#">服务管理</a></div>
							        </div>
							</div> -->
			<!-- <div class="fiexe pleft">
				<h2>常用</h2>
				<div>
					<span class="span">
						智能客服
					</span>
					<i>
						<em class="fix-1"></em>
					</i>
				</div>
				<div>
					<span class="span">
						智能客服
					</span>
					<i>
						<em class="fix-2"></em>
					</i>
				</div>
				<div>
					<span class="span">
						智能客服
					</span>
					<i>
						<em class="fix-3"></em>
					</i>
				</div>
				<h3>
					<a href="#" class="fixtop">顶部</a>
				</h3>
			</div> -->
			<!-- 主题内容菜单 -->
			<div class="resoubox ">
				<div class="resou-con">
					<div class="w1200">
						<div class="publicNav breadCrumb">
							<img @click="toMain()" class="hand" src="">
							<i @click="goHome" class="iconfont icon-dingwei"></i>
							<!-- <router-link :to="{name:'personRegisterManage'}">服务管理</router-link> -->
							<router-link :to="{name:breadCrumbPage}">{{breadCrumb1}}</router-link>
							
							<span class="active">{{breadCrumb2}}</span>
						</div>
						<div class="mode-div lanm-con" style="overflow:auto;overflow-x: hidden; position:absolute;top:64px;bottom:0;left:15px;right:0">
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
												<span class="texet">
													<i class="mustAdd">*</i>请求方式</span>
												<span class="inputime ">
													<div @click="selected1('post')" class="css-radio" :class="{active : postSelected1}">
														<i></i>
														<em>POST</em>
													</div>
													<div @click="selected1('get')" class="css-radio" :class="{active : getSelected1}">
														<i></i>
														<em>GET</em>
													</div>
												</span>
											</div>
											<div class="time-x">
												<span class="texet">
													<i class="mustAdd">*</i>参数设置</span>
												<span class="inputime ">
													<div>
														<div class="tabth">
															<span class="w2">参数名称</span>
															<span class="w1">序号</span>
															<span class="w1">参数类型</span>
															<span class="w3">字段描述</span>
															<span class="w2">标签</span>
														</div>
														<div class="tabcon">
															<div class="shulist-con">
																<!--数据一条-->
																<div v-for="(tableInfo,index) in tableInfos1" class="shulist">
																	<div class="shulist-m">
																		<div class="w2 eqad">
																			<input v-model="tableInfo.name" type="text" class="inptcss inptcssw">
																		</div>
																		<div class="w1">
																			<select disabled="" v-model="tableInfo.order" name="" id="" class="inptcss">
																				<option selected :value='tableInfo.order'>{{index+1}}</option>
																			</select>
																		</div>
																		<div class="w1">
																			<select v-model="tableInfo.param_type" name="" id="" class="inptcss">
																				<option>字符</option>
																				<option>数值</option>
																			</select>
																		</div>
																		<div class="w3">
																			<input v-model="tableInfo.describe" type="text" class="inptcss inptcssw1">
																		</div>
																		<div class="w2 poes">
																			<input disabled="" v-model="tableInfo.tag" type="text" class="inptcss inptcssw fl">
																			<div class="chepoc">
																				<i @click="showTags(index,1)" class="charu"></i>
																				<!-- <span class="charutex">插入</span> -->
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
											<div class="time-x">
												<span class="texet">
													<i class="mustAdd">*</i>请求地址</span>
												<span class="inputime ">
													<select :class="{porthide:isHide}" v-model="Param.service_param_detail[0].request_port" id="" class="inptcss w200">
														<option value="选择端口" selected>选择端口</option>
														<option v-for="port in app_port">{{port}}</option>
													</select>
													<input placeholder="请输入请求路径" v-model="Param.service_param_detail[0].url" type="text" class="cssinput w590">
												</span>
											</div>
											<div v-if="isShow1" class="time-x">
												<span class="texet">请求体</span>
												<span class="inputime ">
													<textarea placeholder='请输入请求体，例:#{"arg1":"#{arg1}"}' v-model="Param.service_param_detail[0].input_body" class="cssinput teac"></textarea>
												</span>
											</div>
										</div>
										<!-- 页面数据请求 -->
										<div v-show="isPageDataRequestShow" class="pageDataRequest">
											<div class="time-x">
												<span class="texet">
													<i class="mustAdd">*</i>请求方式</span>
												<span class="inputime ">
													<div @click="selected2('post')" class="css-radio" :class="{active : postSelected2}">
														<i></i>
														<em>POST</em>
													</div>
													<div @click="selected2('get')" class="css-radio" :class="{active : getSelected2}">
														<i></i>
														<em>GET</em>
													</div>
												</span>
											</div>
											<div class="time-x">
												<span class="texet">
													<i class="mustAdd">*</i>服务资源名称</span>
												<span class="inputime ">
													<div>
														<div class="tabth">
															<span class="w2">参数名称</span>
															<span class="w1">序号</span>
															<span class="w1">参数类型</span>
															<span class="w3">字段描述</span>
															<span class="w2">标签</span>
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
																			<select v-model="tableInfo.order" name="" id="" class="inptcss">
																				<option selected :value='tableInfo.order'>{{index+1}}</option>
																			</select>
																		</div>
																		<div class="w1">
																			<select v-model="tableInfo.param_type" name="" id="" class="inptcss">
																				<option>字符</option>
																				<option>数值</option>
																			</select>
																		</div>
																		<div class="w3">
																			<input v-model="tableInfo.describe" type="text" class="inptcss inptcssw1">
																		</div>
																		<div class="w2 poes">
																			<input disabled v-model="tableInfo.tag" type="text" class="inptcss inptcssw fl">
																			<div class="chepoc">
																				<i @click="showTags(index,2)" class="charu"></i>
																				<!-- 
												                                             <span class="charutex">插入</span> -->
																			</div>
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
												<span class="texet">
													<i class="mustAdd">*</i>请求地址</span>
												<span class="inputime ">
													<select :class="{porthide:isHide}" name="" id="" v-model="Param.service_param_detail[1].request_port" class="inptcss w200">
														<option value="选择端口" selected>选择端口</option>
														<option v-for="port in app_port">{{port}}</option>
													</select>
													<input placeholder="请输入请求路径" v-model="Param.service_param_detail[1].url" type="text" class="cssinput w590">
												</span>
											</div>
											<div v-if="isShow2" class="time-x">
												<span class="texet">请求体</span>
												<span class="inputime ">
													<textarea placeholder='请输入请求体，例:#{"arg1":"#{arg1}"}' v-model="Param.service_param_detail[1].input_body" class="cssinput teac"></textarea>
												</span>
											</div>
										</div>
										<!-- 纯数据请求 -->
										<div v-show="isDataRequestShow" class="dataRequest">
											<div class="time-x">
												<span class="texet">
													<i class="mustAdd">*</i>请求方式</span>
												<span class="inputime ">
													<div @click="selected3('post')" class="css-radio" :class="{active : postSelected3}">
														<i></i>
														<em>POST</em>
													</div>
													<div @click="selected3('get')" class="css-radio" :class="{active : getSelected3}">
														<i></i>
														<em>GET</em>
													</div>
												</span>
											</div>
											<div class="time-x">
												<span class="texet">
													<i class="mustAdd">*</i>服务资源名称</span>
												<span class="inputime ">
													<div>
														<div class="tabth">
															<span class="w2">参数名称</span>
															<span class="w1">序号</span>
															<span class="w1">参数类型</span>
															<span class="w3">字段描述</span>
															<span class="w2">标签</span>
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
																			<select disabled="" v-model="tableInfo.order" name="" id="" class="inptcss">
																				<option selected :value='tableInfo.order'>{{index+1}}</option>
																			</select>
																		</div>
																		<div class="w1">
																			<select v-model="tableInfo.param_type" name="" id="" class="inptcss">
																				<option>字符</option>
																				<option>数值</option>
																			</select>
																		</div>
																		<div class="w3">
																			<input v-model="tableInfo.describe" type="text" class="inptcss inptcssw1">
																		</div>
																		<div class="w2 poes">
																			<input disabled="" v-model="tableInfo.tag" type="text" class="inptcss inptcssw fl">
																			<div class="chepoc">
																				<i @click="showTags(index,3)" class="charu"></i>
																				<!-- <span class="charutex">插入</span> -->
																			</div>
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
												<span class="texet">
													<i class="mustAdd">*</i>请求地址</span>
												<span class="inputime ">
													<select :class="{porthide:isHide}" name="" id="" v-model="Param.service_param_detail[2].request_port" class="inptcss w200">
														<option value="选择端口" selected>选择端口</option>
														<option selected v-for="port in app_port">{{port}}</option>
													</select>
													<input placeholder="请输入请求路径" v-model="Param.service_param_detail[2].url" type="text" class="cssinput w590">
												</span>
											</div>
											<div v-if="isShow3" class="time-x">
												<span class="texet">请求体</span>
												<span class="inputime ">
													<textarea placeholder='请输入请求体，例:#{"arg1":"#{arg1}"}' v-model="Param.service_param_detail[2].input_body" class="cssinput teac"></textarea>
												</span>
											</div>
										</div>
										<!-- 返回参数 -->
										<div v-show="isReturnParametersShow" class="returnParameters">
											<div class="time-x">
												<span class="texet">
													<i class="mustAdd">*</i>服务资源名称</span>
												<span class="inputime ">
													<div>
														<div class="tabth">
															<span class="w2">参数名称</span>
															<span class="w1">序号</span>
															<span class="w1">参数类型</span>
															<span class="w3">字段描述</span>
															<span class="w2">标签</span>
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
																			<select disabled="" v-model="tableInfo.order" name="" id="" class="inptcss">
																				<option :value="tableInfo.order" selected>{{index+1}}</option>
																			</select>
																		</div>
																		<div class="w1">
																			<select v-model="tableInfo.param_type" name="" id="" class="inptcss">
																				<option>字符</option>
																				<option>数值</option>
																			</select>
																		</div>
																		<div class="w3">
																			<input v-model="tableInfo.describe" type="text" class="inptcss inptcssw1">
																		</div>
																		<div class="w2 poes">
																			<input disabled="" v-model="tableInfo.tag" type="text" class="inptcss inptcssw fl">
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
													<textarea placeholder='请输入输出格式，例:#{"arg1":"#{arg1}"}' v-model="Param.service_param_detail[2].output_body" class="cssinput teac"></textarea>
												</span>
											</div>
										</div>
									</div>
								</div>
								<!--/biaodan-->
								<div class="buttnet">
									<button @click="toSaveInfo('temporaryStorage')" class="btnGreen">暂存</button>
									<button @click="toPrev" class="btnBlue">上一步</button>
									<button @click="toSaveInfo('toNext')" class="btnBlue">下一步</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<LabelView :dialogTagVisible.sync="dialogTagVisible" :isCreateModel="!isEdit" :model="checkedLabels" modelLabelKey="tagArray" :changeLabelCaller="saveLabel" />
		</div>
	</div>
</template>
<script>
import LabelView from '../../../publicComponent/labelView.vue'
import apiToken from '../../../publicJs/apiToken.js'
import apiClient from '../../../publicJs/ApiClient.js'
import JSONLint from '../../lib/jsonlint.js'
import NoticeBoxService from '../../../publicJs/NoticeBoxService.js'
import TipBoxService from '../../../publicJs/TipBoxService.js'
import LoadingBoxService from '../../../publicJs/LoadingBoxService.js'
import rightMenu from '../../../publicComponent/publicRightMenu.vue'

/*import {urlValidate} from '../../common/util.js'*/
export default {
	watch: {
		'checkedLabels.tagArray' (value) {
			if (this.num == 1) {
				this.tableInfos1[this.index].tag = value.join(',');
				this.tagId1[this.index] = value;
			} else if (this.num == 2) {
				this.tableInfos2[this.index].tag = value.join(',');
				this.tagId2[this.index] = value;
			} else if (this.num == 3) {
				this.tableInfos3[this.index].tag = value.join(',');
				this.tagId3[this.index] = value;
			} else {
				this.tableInfos4[this.index].tag = value.join(',');
				this.tagId4[this.index] = value;
			}
		}
	},
	data () {
		return {
            APIclass: '',
            breadCrumb1: '',
            breadCrumb2: '',
            breadCrumbPage: '',
			dialogTagVisible: false,//选择标签 是否隐藏。
			isEdit: this.$route.query.atomicId !== undefined,  //用于标签判断是否是新建服务
			checkedLabels: {
				tagArray: []
			},
			resourcetag: "",
			isDataRequestShow: false,
			isPageRequestShow: false,
			isPageDataRequestShow: false,
			isReturnParametersShow: false,
			tabList: [],
			idinfo: 0,
			postSelected1: true,
			getSelected1: false,
			isShow1: true,
			tableInfos1: [{ order: 1, tag: "", tag_id: [] }],
			postSelected2: true,
			getSelected2: false,
			isShow2: true,
			isHide: false,
			tableInfos2: [{ order: 1, tag: "", tag_id: [] }],
			postSelected3: true,
			getSelected3: false,
			isShow3: true,
			tableInfos3: [{ order: 1, tag: "", tag_id: [] }],
			tableInfos4: [{ order: 1, tag: "", tag_id: [] }],
			tagId1: [],
			tagId2: [],
			tagId3: [],
			tagId4: [],
			app_port: [],
			index: "",
			num: "",
			Param: {
				id: "",
				audit_status: 0,
				app_id: "",
				name: "",
				apptype: "",
				address: "",
				service_tag: [],
				open_type: "",
				service_remark: "",
				service_status: "",
				open_time: "",
				isatomic: "",
				img: "",
				bg_img: "",
				service_type: [],
				service_param_detail: [{
					url: "",
					request_type: "post",
					input_body: "",
					request_port: "选择端口",
					output_body: "",
					service_param: [],
					service_out_param: [],
				},
				{
					url: "",
					request_type: "post",
					input_body: "",
					request_port: "选择端口",
					output_body: "",
					service_param: [],
					service_out_param: [],
				},
				{
					url: "",
					request_type: "post",
					input_body: "",
					request_port: "选择端口",
					output_body: "",
					service_param: [],
					service_out_param: [],
				}]
			}
		}
	},
    created () {
        this.APIclass = this.$route.query.type?this.$route.query.type:"APIjiekou"
        // console.log(this.$route)
        if (this.$route.query.type === 'APIjiekou') {
            this.breadCrumb1 = '个人注册'
            this.breadCrumb2 = '参数配置'
            this.breadCrumbPage = 'personRegisterManage'
        } else if (this.$route.query.type === 'API') {
            this.breadCrumb1 = '注册管理'
            this.breadCrumb2 = '参数配置'
            this.breadCrumbPage = 'registerManageAdministrator'
        }
    },
	mounted () {
		this.init();
		this.getConfigInfo();
		if (this.$route.query.apptype == 1) {
			this.isHide = true;
		} else {
			this.getPort();
		}
	},
	methods: {
		goHome () {
          this.$router.push({name: 'Index'})
      },
		init () {
			var configList = JSON.parse(this.$route.query.name)
			for (var i = 0; i < configList.length; i++) {
				if (configList[i] != null || configList[i] != undefined) {
					this.tabList.push(configList[i])
				}
			}
			this.checkShow(this.tabList[0])
		},
		toMain () {
			this.$router.push("personRegisterManage")
		},
		showTags (index, num) {
			this.num = num;
			this.index = index;
			this.dialogTagVisible = true;
			if (num == 1) {
				if (this.tagId1[index] != undefined) {
					this.checkedLabels.tagArray = this.tagId1[index]
				} else {
					this.checkedLabels.tagArray = [];
				}
			} else if (num == 2) {
				if (this.tagId2[index] != undefined) {
					this.checkedLabels.tagArray = this.tagId2[index]
				} else {
					this.checkedLabels.tagArray = [];
				}
			} else if (num == 3) {
				if (this.tagId3[index] != undefined) {
					this.checkedLabels.tagArray = this.tagId3[index]
				} else {
					this.checkedLabels.tagArray = [];
				}
			} else {
				if (this.tagId4[index] != undefined) {
					this.checkedLabels.tagArray = this.tagId4[index]
				} else {
					this.checkedLabels.tagArray = [];
				}
			}
		},
		changeLabels (changed, selectLabels) {
			if (changed) {
				let labelIds = []
				let labelStr = ''
				for (let i = 0; i < selectLabels.length; i++) {
					labelIds.push(selectLabels[i].id)
					labelStr = labelStr + selectLabels[i].name + ','
					// this.service_tag.push(selectLabels[i].name)
				}
				if (labelStr.length > 0) {
					labelStr = labelStr.substr(0, labelStr.length - 1)
				}
				if (this.num == 1) {
					this.tableInfos1[this.index].tag = labelStr
					this.tagId1[this.index] = labelIds
					this.tableInfos1[this.index].tag_id = this.tagId1[this.index]
				} else if (this.num == 2) {
					this.tableInfos2[this.index].tag = labelStr
					this.tagId2[this.index] = labelIds
					this.tableInfos2[this.index].tag_id = this.tagId2[this.index]
				} else if (this.num == 3) {
					this.tableInfos3[this.index].tag = labelStr
					this.tagId3[this.index] = labelIds
					this.tableInfos3[this.index].tag_id = this.tagId3[this.index]
				} else {
					this.tableInfos4[this.index].tag = labelStr
					this.tagId4[this.index] = labelIds
					this.tableInfos4[this.index].tag_id = this.tagId4[this.index]
				}
				this.resourcetag = labelStr
				this.checkedLabels = labelIds
			}
			this.dialogTagVisible = false
		},
		getConfigInfo () {
			var that = this;
			if (this.$route.query.atomicId != undefined) {
				LoadingBoxService.open("正在执行，请稍候...");
				var myData = { id: this.$route.query.atomicId };
				apiClient.post('itsmApi/atomicService/loadServiceInfo', myData, function (data) {
					if (data.status == 200) {
						LoadingBoxService.close();
						if (data.results.data[0].service_param_detail != undefined) {
							var obj = data.results.data[0];
							for (var i = 0; i < obj.service_param_detail.length; i++) {
								that.Param.service_param_detail[i] = JSON.parse(obj.service_param_detail[i])
								if (i == 0) {
									that.tableInfos1 = JSON.parse(obj.service_param_detail[0]).service_param
									for (var a = 0; a < that.tableInfos1.length; a++) {
										if (that.tableInfos1[a].tag != "" && that.tableInfos1[a].tag != undefined) {
											that.tagId1.push(that.tableInfos1[a].tag.split(","));
										}

									}
									if (JSON.parse(obj.service_param_detail[0]).request_type == 'post') {
										that.postSelected1 = true;
										that.getSelected1 = false;
										that.isShow1 = true;
									} else {
										that.getSelected1 = true;
										that.postSelected1 = false;
										that.isShow1 = false;
									}
								} else if (i == 1) {
									that.tableInfos2 = JSON.parse(obj.service_param_detail[1]).service_param
									for (var a = 0; a < that.tableInfos2.length; a++) {
										if (that.tableInfos2[a].tag != "" && that.tableInfos2[a].tag != undefined) {
											that.tagId2.push(that.tableInfos2[a].tag.split(","));
										}
									}
									if (JSON.parse(obj.service_param_detail[1]).request_type == 'post') {
										that.postSelected2 = true;
										that.getSelected2 = false;
										that.isShow2 = true;
									} else {
										that.getSelected2 = true;
										that.postSelected2 = false;
										that.isShow2 = false;
									}
								} else if (i == 2) {
									that.tableInfos3 = JSON.parse(obj.service_param_detail[2]).service_param
									that.tableInfos4 = JSON.parse(obj.service_param_detail[2]).service_out_param
									for (var a = 0; a < that.tableInfos3.length; a++) {
										if (that.tableInfos3[a].tag != "" && that.tableInfos3[a].tag != undefined) {
											that.tagId3.push(that.tableInfos3[a].tag.split(","));
										}
									}
									for (var a = 0; a < that.tableInfos4.length; a++) {
										if (that.tableInfos4[a].tag != "" && that.tableInfos4[a].tag != undefined) {
											that.tagId4.push(that.tableInfos4[a].tag.split(","));
										}
									}
									if (JSON.parse(obj.service_param_detail[2]).request_type == 'post') {
										that.postSelected3 = true;
										that.getSelected3 = false;
										that.isShow3 = true;
									} else {
										that.getSelected3 = true;
										that.postSelected3 = false;
										that.isShow3 = false;
									}
								}
							}
						}
					} else {
					  LoadingBoxService.close();
					  TipBoxService.open(data.exception, 1)
					}
				})
			}
		},
		getPort () {
			var that = this;
			var myData = { app_id: this.$route.query.applyId };
			apiClient.post('itsmApi/application/selectAppPort', myData, function (data) {
				if (data.status == 200) {
					that.app_port = data.results.data
				} else {
					TipBoxService.open(data.exception, 1)
				}

			})
		},
		checkShow (obj) {
			if (obj == "页面请求") {
				this.isPageRequestShow = true
				this.isDataRequestShow = false;
				this.isPageDataRequestShow = false;
				this.isReturnParametersShow = false;
			} else if (obj == "页面数据请求") {
				this.isPageDataRequestShow = true;
				this.isReturnParametersShow = false;
				this.isPageRequestShow = false
				this.isDataRequestShow = false;
			} else if (obj == "纯数据请求") {
				this.isDataRequestShow = true;
				this.isReturnParametersShow = false;
				this.isPageRequestShow = false;
				this.isPageDataRequestShow = false;
			} else {
				this.isReturnParametersShow = true;
				this.isPageRequestShow = false;
				this.isDataRequestShow = false;
				this.isPageDataRequestShow = false;
			}
		},
		choose (index, tab) {
			this.idinfo = index
			this.checkShow(tab)
		},
		/*页面请求*/
		selected1 (name) {
			if (name == "post") {
				this.postSelected1 = true;
				this.getSelected1 = false;
				this.isShow1 = true;
				this.Param.service_param_detail[0].request_type = name
			} else if (name == "get") {
				this.getSelected1 = true;
				this.postSelected1 = false;
				this.isShow1 = false;
				this.Param.service_param_detail[0].request_type = name
			}
		},
		addTable1 (index) {
			this.tableInfos1.push({ order: this.tableInfos1.length + 1, tag: "", tag_id: [] });
		},
		closeShowUerDefined1 (index) {
			if (this.tableInfos1.length > 1) {
				this.tableInfos1.splice(index, 1);
				for (var i = 0; i < this.tableInfos1.length; i++) {
					this.tableInfos1[i].order = i + 1
				}
			} else {
				TipBoxService.open("当只有一行时不可删除");
			}
		},
		/*页面数据请求*/
		selected2 (name) {
			if (name == "post") {
				this.postSelected2 = true;
				this.getSelected2 = false;
				this.isShow2 = true;
				this.Param.service_param_detail[1].request_type = name
			} else if (name == "get") {
				this.getSelected2 = true;
				this.postSelected2 = false;
				this.isShow2 = false;
				this.Param.service_param_detail[1].request_type = name
			}
		},
		addTable2 (index) {
			this.tableInfos2.push({ order: this.tableInfos2.length + 1, tag: "", tag_id: [] });
		},
		closeShowUerDefined2 (index) {
			if (this.tableInfos2.length > 1) {
				this.tableInfos2.splice(index, 1);
				for (var i = 0; i < this.tableInfos2.length; i++) {
					this.tableInfos2[i].order = i + 1
				}
			} else {
				TipBoxService.open("只有一行的时候无法删除", 2)
			}
		},
		/*纯数据请求*/
		selected3 (name) {
			if (name == "post") {
				this.postSelected3 = true;
				this.getSelected3 = false;
				this.isShow3 = true;
				this.Param.service_param_detail[2].request_type = name
			} else if (name == "get") {
				this.getSelected3 = true;
				this.postSelected3 = false;
				this.isShow3 = false;
				this.Param.service_param_detail[2].request_type = name
			}
		},
		addTable3 (index) {
			this.tableInfos3.push({ order: this.tableInfos3.length + 1, tag: "", tag_id: [] });
		},
		closeShowUerDefined3 (index) {
			if (this.tableInfos3.length > 1) {
				this.tableInfos3.splice(index, 1);
				for (var i = 0; i < this.tableInfos3.length; i++) {
					this.tableInfos3[i].order = i + 1
				}
			} else {
				TipBoxService.open("只有一行的时候无法删除", 2)
			}
		},
		/*返回参数*/
		addTable4 (index) {
			this.tableInfos4.push({ order: this.tableInfos4.length + 1, tag: "", tag_id: [] });
		},
		closeShowUerDefined4 (index) {
			if (this.tableInfos4.length > 1) {
				this.tableInfos4.splice(index, 1);
				for (var i = 0; i < this.tableInfos4.length; i++) {
					this.tableInfos4[i].order = i + 1
				}
			} else {
				TipBoxService.open("只有一个行的时候无法删除", 2)
			}
		},
		saveAllInfo (nameInfo) {
			if (nameInfo == 'toNext') {
				this.Param.audit_status = 1
			}
			var that = this;
			var myData = this.Param;
			apiClient.post('itsmApi/atomicService/updateAtomicInfo', { param: JSON.stringify(myData) }, function (data) {
				if (data.status == 200) {
					if (nameInfo == 'toNext') {
						LoadingBoxService.close();
						that.$router.push({ name: 'newServiceFinishForPersonRegister',
							query:{type:that.APIclass}
						})
					} else {
						LoadingBoxService.close();
						TipBoxService.open('暂存成功');
						that.$router.push({ path: 'personRegisterManage?index=1'+'&type='+that.APIclass })
					}
				} else {
					LoadingBoxService.close();
					TipBoxService.open(data.exception, 1);
				}
			})
		},
		checkInfo (arr, infoArr, tabName) {
			var flag = true;
			var newArr = new Array();
			var nameArr = new Array();
			if (arr.request_type == "" || arr.request_type == undefined) {
				TipBoxService.open('请选择' + tabName + '请求类型', 2);
				flag = false;
				return false;
			}
			if (tabName != "页面请求") {
				for (var i = 0; i < infoArr.length; i++) {
					if (infoArr[i].name == undefined) {
						TipBoxService.open("请输入" + tabName + "参数名称", 2);
						flag = false;
						return false;
					}
					if (infoArr[i].param_type == undefined) {
						TipBoxService.open("请选择" + tabName + "参数类型", 2);
						flag = false;
						return false;
					}
					if (infoArr[i].describe == undefined) {
						TipBoxService.open("请输入" + tabName + "参数描述", 2);
						flag = false;
						return false;
					}
					if (infoArr[i].tag == "") {
						TipBoxService.open("请插入" + tabName + "标签", 2);
						flag = false;
						return false;
					}
				}
			} else {
				for (var i = 0; i < infoArr.length; i++) {
					if (infoArr[i].name != undefined && infoArr[i].name != "" || infoArr[i].param_type != undefined && infoArr[i].param_type != "" || infoArr[i].describe != undefined && infoArr[i].describe != "" || infoArr[i].tag != "") {
						if (infoArr[i].name == undefined || infoArr[i].name == "") {
							TipBoxService.open("请选择" + tabName + "参数名称", 2)
							flag = false;
							return false;
						}
						if (infoArr[i].param_type == undefined || infoArr[i].param_type == "") {
							TipBoxService.open("请选择" + tabName + "参数类型", 2);
							flag = false;
							return false;
						}
						if (infoArr[i].describe == undefined || infoArr[i].describe == "") {
							TipBoxService.open("请输入" + tabName + "参数描述", 2);
							flag = false;
							return false;
						}
						if (infoArr[i].tag == "") {
							TipBoxService.open("请插入" + tabName + "标签", 2);
							flag = false;
							return false;
						}
					}
				}
			}
			if (arr.request_type == "post") {
				if (arr.input_body != "" && arr.input_body != undefined) {
					try {
						JSONLint.jsonlint.parse(arr.input_body);
					} catch (e) {
						TipBoxService.open("" + tabName + "请求体格式有误，请输入正确格式", 2)
						flag = false;
						return false;
					}
				}
			}
			if (arr.url == "" || arr.url == undefined) {
				TipBoxService.open('请输入' + tabName + '的请求路径', 2);
				flag = false;
				return false;
			} else {
				if (this.$route.query.apptype != 2) {
					if (!this.urlValidate(arr.url)) {
						TipBoxService.open("地址输入有误", 2)
						flag = false;
						return false;
					}
				} else {
					if (arr.request_port == "" || arr.request_port == "选择端口") {
						TipBoxService.open('请选择' + tabName + '的端口号', 2);
						flag = false;
						return false;
					}
				}
			}
			for (var i = 0; i < infoArr.length; i++) {
				if (infoArr[i].name != undefined) {
					nameArr.push(infoArr[i].name)
				}
			}
			if (flag) {
				var infoArg = "";
				var newArg = "";
				var outPutArg = "";
				var s = nameArr.join(",") + ",";
				for (var i = 0; i < nameArr.length; i++) {
					if (s.replace(nameArr[i] + ",", "").indexOf(nameArr[i] + ",") > -1) {
						infoArg = nameArr[i]
					}
				}
				if (infoArg != "") {
					TipBoxService.open("配置项中存在重复参数！", 2)
					flag = false;
					return false;
				} else {
					if (arr.request_type == "post") {
						if (arr.input_body != "") {
							var inputArr = arr.input_body.split(",");
							for (var k = 0; k < inputArr.length; k++) {
								if (inputArr[k].split("#").length > 1) {
									for (var y = 0; y < inputArr[k].split(":").length; y++) {
										if (inputArr[k].split(":").length == 2) {
											if (y % 2 != 0) {
												if (k + 1 == inputArr.length || k + 1 == inputArr.length) {
													newArr.push(inputArr[k].split(":")[y].substring(3, inputArr[k].split(":")[y].indexOf("}")))
												} else {
													newArr.push(inputArr[k].split(":")[y].substring(3, inputArr[k].split(":")[y].indexOf("}")))
												}
											}
										} else {
											if (y == (inputArr[k].split(":").length - 1)) {
												newArr.push(inputArr[k].split(":")[y].substring(3, inputArr[k].split(":")[y].indexOf("}")))
											}
										}
									}
								}
							}
							var s1 = newArr.join(",") + ",";
							for (var i = 0; i < newArr.length; i++) {
								if (s1.replace(newArr[i] + ",", "").indexOf(newArr[i] + ",") > -1) {
									newArg = newArr[i]
								}
							}
						}
						var outPutArr = new Array();
						if (arr.url.split("#{").length != 1) {
							var f1 = arr.url.split("#{")
							for (var i = 0; i < f1.length; i++) {
								if (i < f1.length - 1) {
									var a1 = f1[i + 1];
									var a = a1.indexOf("{")
									var e = a1.indexOf("}")
									outPutArr.push(a1.substring(a + 1, e))
								}
							}
						}

						var s2 = outPutArr.join(",") + ",";
						for (var i = 0; i < outPutArr.length; i++) {
							if (s2.replace(outPutArr[i] + ",", "").indexOf(outPutArr[i] + ",") > -1) {
								outPutArg = outPutArr[i]
							}
						}
						if (newArg == "" && outPutArg == "") {
							for (var i = 0; i < outPutArr.length; i++) {
								for (var j = 0; j < newArr.length; j++) {
									if (outPutArr[i] == newArr[j]) {
										TipBoxService.open("请求体和路径中不可存在重复参数", 2)
										flag = false;
										return false;
									}
								}
							}
							for (var i = 0; i < newArr.length; i++) {
								outPutArr.push(newArr[i])
							}
						}
						if (outPutArg != "") {
							TipBoxService.open("路径中存在重复参数", 2)
							flag = false;
							return false;
						}
						if (newArg != "") {
							TipBoxService.open("请求体中存在重复参数", 2)
							flag = false;
							return false;
						}
						var _a = (JSON.stringify(nameArr.sort()))
						var _b = (JSON.stringify(outPutArr.sort()))
						if (_a != _b) {
							TipBoxService.open("配置参数和请求参数不一致！", 2)
							return false;
						}
						if (nameArr.length != outPutArr.length) {
							TipBoxService.open("配置参数和请求参数不一致！", 2)
							flag = false;
							return false;
						}
					} else {
						var outPutArr = new Array();
						if (arr.url.split("#{").length != 1) {
							var f1 = arr.url.split("#{")
							for (var i = 0; i < f1.length; i++) {
								if (i < f1.length - 1) {
									var a1 = f1[i + 1];
									var a = a1.indexOf("{")
									var e = a1.indexOf("}")
									outPutArr.push(a1.substring(a + 1, e))
								}
							}
						}
						var s2 = outPutArr.join(",") + ",";
						for (var i = 0; i < outPutArr.length; i++) {
							if (s2.replace(outPutArr[i] + ",", "").indexOf(outPutArr[i] + ",") > -1) {
								outPutArg = outPutArr[i]
							}
						}
						if (outPutArg != "") {
							TipBoxService.open("路径中存在重复参数", 2)
							flag = false;
							return false;
						}
						var _a = (JSON.stringify(nameArr.sort()))
						var _b = (JSON.stringify(outPutArr.sort()))
						if (_a != _b) {
							TipBoxService.open("配置参数和请求参数不一致！", 2)
							return false;
						}
						if (nameArr.length != outPutArr.length) {
							TipBoxService.open("配置参数和请求参数不一致！", 2)
							flag = false;
							return false;
						}
					}
				}
			}
			return flag;
		},
		toSaveInfo (nameInfo) {
			this.Param.service_param_detail[0].service_param = this.tableInfos1
			this.Param.service_param_detail[1].service_param = this.tableInfos2
			this.Param.service_param_detail[2].service_param = this.tableInfos3
			this.Param.service_param_detail[2].service_out_param = this.tableInfos4
			this.Param.id = this.$route.query.atomicId;
			for (var i = 0; i < this.Param.service_param_detail.length; i++) {
				if (this.Param.service_param_detail[i].request_port == undefined) {
					this.Param.service_param_detail[i].request_port = ""
				}
			}
			var arr = this.Param.service_param_detail;
			var flag = true;
			var checkFlag = true;
			var checkFlag2 = true;
			for (var t = 0; t < this.tabList.length; t++) {
				if (this.tabList[t] == "页面请求") {
					var infoArr = this.Param.service_param_detail[0].service_param
					if (!this.checkInfo(arr[0], infoArr, this.tabList[t])) {
						flag = false;
						return false;
					}
				} else if (this.tabList[t] == "页面数据请求") {
					var infoArr = this.Param.service_param_detail[1].service_param
					if (!this.checkInfo(arr[1], infoArr, this.tabList[t], flag)) {
						flag = false;
						return false;
					}
				} else if (this.tabList[t] == "纯数据请求") {
					var infoArr = this.Param.service_param_detail[2].service_param
					if (!this.checkInfo(arr[2], infoArr, this.tabList[t], flag)) {
						flag = false;
						return false;
					}
				} else if (this.tabList[t] == "返回参数") {
					var infoArr = this.Param.service_param_detail[2].service_out_param
					var newArr = new Array();
					var nameArr = new Array();
					for (var i = 0; i < infoArr.length; i++) {
						nameArr.push(infoArr[i].name)
					}
					for (var i = 0; i < infoArr.length; i++) {
						if (infoArr[i].name == undefined) {
							TipBoxService.open("请输入返回参数参数名称", 2);
							checkFlag2 = false;
							flag = false;
							return false;
						}
						if (infoArr[i].order == undefined) {
							TipBoxService.open("请选择返回参数序号", 2);
							checkFlag2 = false;
							return false;
						}
						if (infoArr[i].param_type == undefined) {
							TipBoxService.open("请选择返回参数参数类型", 2);
							checkFlag2 = false;
							return false;
						}
						if (infoArr[i].describe == undefined) {
							TipBoxService.open("请输入返回参数参数描述", 2);
							checkFlag2 = false;
							return false;
						}
						if (infoArr[i].tag == "") {
							TipBoxService.open("请输入返回参数标签", 2);
							checkFlag2 = false;
							return false;
						}
					}
					if (arr[2].output_body == "" || arr[2].output_body == undefined) {
						TipBoxService.open('请输入输出格式', 2);
						flag = false;
						return false;
					} else {
						try {
							JSONLint.jsonlint.parse(arr[2].output_body);
						} catch (e) {
							TipBoxService.open("格式有误，请输入正确格式", 2)
							flag = false;
							return false;
						}
					}
					if (flag) {
						var infoArg = "";
						var newArg = "";
						var outPutArg = "";
						var s = nameArr.join(",") + ",";
						for (var i = 0; i < nameArr.length; i++) {
							if (s.replace(nameArr[i] + ",", "").indexOf(nameArr[i] + ",") > -1) {
								infoArg = nameArr[i]
							}
						}
						if (infoArg != "") {
							TipBoxService.open("配置项中存在重复参数！", 2)
							flag = false;
							return false;
						} else {
							if (arr[2].output_body != "") {
								var inputArr = arr[2].output_body.split(",");
								for (var k = 0; k < inputArr.length; k++) {
									for (var y = 0; y < inputArr[k].split(":").length; y++) {
										if (inputArr[k].split(":").length == 2) {
											if (y % 2 != 0) {
												if (k + 1 == inputArr.length || k + 1 == inputArr.length) {
													newArr.push(inputArr[k].split(":")[y].substring(3, inputArr[k].split(":")[y].indexOf("}")))
												} else {
													newArr.push(inputArr[k].split(":")[y].substring(3, inputArr[k].split(":")[y].indexOf("}")))
												}
											}
										} else {
											if (y == (inputArr[k].split(":").length - 1)) {
												newArr.push(inputArr[k].split(":")[y].substring(3, inputArr[k].split(":")[y].indexOf("}")))
											}
										}
									}
								}
								var s1 = newArr.join(",") + ",";
								for (var i = 0; i < newArr.length; i++) {
									if (s1.replace(newArr[i] + ",", "").indexOf(newArr[i] + ",") > -1) {
										newArg = newArr[i]
									}
								}
							}
							if (newArg != "") {
								TipBoxService.open("输出格式中存在重复参数", 2)
								flag = false;
								return false;
							}
							var _a = (JSON.stringify(nameArr.sort()))
							var _b = (JSON.stringify(newArr.sort()))
							if (_a != _b) {
								TipBoxService.open("配置参数和请求参数不一致！", 2)
								return false;
							}
							if (nameArr.length != newArr.length) {
								TipBoxService.open("配置参数和请求参数不一致！", 2)
								flag = false;
								return false;
							}
						}
					}
				}
			}
			var that = this;
			if (flag) {
				LoadingBoxService.open("正在执行，请稍候...");
				var myData = { id: this.$route.query.atomicId };
				apiClient.post('itsmApi/atomicService/loadServiceInfo', myData, function (data) {
					if (data.status == 200) {
						that.Param.app_id = data.results.data[0].app_id;
						that.Param.name = data.results.data[0].name;
						that.Param.apptype = data.results.data[0].apptype;
						that.Param.open_type = data.results.data[0].open_type;
						that.Param.service_remark = data.results.data[0].service_remark;
						that.Param.service_type = data.results.data[0].service_type;
						that.Param.service_tag = data.results.data[0].service_tag;
						that.Param.img = data.results.data[0].img;
						that.Param.bg_img = data.results.data[0].bg_img;
						that.saveAllInfo(nameInfo);
					} else {
						TipBoxService.open(data.exception, 1)
					}
				})
			}
		},
		toPrev () {
			var that = this
			NoticeBoxService.open("返回上一步之前建议暂存，否则数据会丢失。", function () {
				NoticeBoxService.close();
				that.$router.push({
					name: 'newServiceForPersonRegister',
					query: {
						atomicId: that.$route.query.atomicId,
						type:that.APIclass
					}
				})
			})
		},
		urlValidate (value) {
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
		saveLabel () {
			if (this.num == 1) {
				this.tableInfos1[this.index].tag = this.checkedLabels.tagArray.join(',');
				this.tagId1[this.index] = this.checkedLabels.tagArray;
			} else if (this.num == 2) {
				this.tableInfos2[this.index].tag = this.checkedLabels.tagArray.join(',');
				this.tagId2[this.index] = this.checkedLabels.tagArray;
			} else if (this.num == 3) {
				this.tableInfos3[this.index].tag = this.checkedLabels.tagArray.join(',');
				this.tagId3[this.index] = this.checkedLabels.tagArray;
			} else {
				this.tableInfos4[this.index].tag = this.checkedLabels.tagArray.join(',');
				this.tagId4[this.index] = this.checkedLabels.tagArray;
			}
			return true;
		},
	},
	components: {
		rightMenu,
		LabelView
	}
}
</script>
<style src="" scoped>
.box {
    position: relative;
}
.box form{
    position: relative;
}
.box input {
    position: absolute;
    left: -9999px;
}    
/* 使label充满整个box*/
.box label {
    position: absolute;
    top: 0;left: 0;right: 0;bottom: 0;
    z-index: 10; /* 这个z-index之后说到*/
    cursor:pointer ;
}
.box img{
    position: absolute;
    left: -1px;
    top: -31px;
    width: 112px;
    height: 112px;
    border: 1px solid #ccc;
}
.porthide{
    display: none;
}
.hidBox{
    display: none;
}
.register{
    padding: 90px 0;
    position: relative;
    box-sizing: border-box;
}
.lanmpege{
    background: #fff;
    height: 90px;
    position: absolute;
    top:0;
    width:100%;
}
.lanmp-con{
    width:960px;
    margin: 0 auto;
    padding-top: 30px;
}
.lanbbag{
	background: url("../../images/stepp3.png") no-repeat;
    width:915px;
    height: 36px;
	background-size:cover;
}
.lanbbag p{
    background: url("../../images/step3.png") no-repeat; 
    height: 39px;
	background-size:cover;
}
.iformcon-con.reg1{
    width:1100px;
    margin: 0 auto;
}
.iformcon-con.reg2{
   width: 650px;
    margin: 0 auto;
}
.iformcon-con.reg2 .texet.lihei{
    line-height: 29px;
}
.lanbag-text{
    width:992px;
    margin-top: 5px;
}
.time-x{
    position: relative;
    padding-left: 150px;
    box-sizing: border-box;
    margin-bottom: 20px;
    margin-top: 20px;
}
.time-x span{
    display: inline-block;
    vertical-align: middle;
}
.time-x .texet{
    position: absolute;
    left: 0;
    width:145px;
    color: #333;
    font-size: 12px;
    text-align: right;
}
.inputime {
	margin-left: 7px;
}
.inputime .css-radio{
    float: left;
    cursor: pointer;
    margin-right:45px;
}
.css-radio i {
    background: url("../../../publicImages/radio.png") no-repeat;
    width: 12px;
    height: 12px;
    display: inline-block;
    vertical-align: -14%;
    margin-right: 0px;
}
.css-radio em {
	font-style: normal;
}
.css-radio.active i{
    background-position: 0 -13px;
}
.shulist{
    overflow: hidden;
}
.wi540{
    width:350px;
    padding: 3px 5px;
}
.wi450{
    width: 265px;
    padding: 3px 5px;
}
.wi560{
    width:262px;
}
.wi550{
    width:350px;
    height: 100px;
    padding:5px 5px;
}
.w1{
    width:10%;
    padding: 0 10px;
    box-sizing: border-box;
    float: left;
}
/* .tablnav{
    border-bottom: 1px #e0e0e0 solid;
} */
.tablnav ul{
    width: 800px;
    margin: 0 auto;
    margin-top: 27px;
    padding-bottom: 27px;

}
.tablnav li{
    border: 1px #999999 solid;
	color: #999999;
    padding:0 25px;
    display: inline-block;
    line-height: 32px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
	margin-right: 31px;
}
.tablnav li.active{
	color:#53A8FF;
	border: 1px #53A8FF solid;
}
.tablnav li.active::before{
    content: '';
    position: absolute;
    /* background: url("../img/tuerr.png") no-repeat; */
    width:13px;
    height: 13px;
    position: absolute;
    top:0;
    right: 0;
}
.shulist .inptcssw{
    width:100px;
}
.inptcss{
    border: 1px #cacaca  solid;
    border-radius: 3px;
    padding: 6px 0px 6px 0px;
}
.shulist .inptcssw1{
    width:140px;
}
.shulist .icobut{
    display: inline-block;
    border: 1px #959595 solid;
    border-radius: 50%;
    width:24px;
    height: 24px;
    font-size: 20px;
    text-align: center;
    line-height: 22px;
	cursor: pointer;
	font-style:normal;
	margin-left: 6%;
}
.shulist .icobut:hover{
    background: #b61717;
    border: 1px #b61717 solid;
    color: #fff;
}
.w2{
    width:20%;
    padding: 0 10px;
    box-sizing: border-box;
    float: left;
}
.butonst{
    border-radius: 3px;
    border: 1px #cacaca solid;
    text-align: center;
    font-size: 14px;
    line-height: 28px;
    cursor: pointer;
    padding: 0 12px;
}
.butonstdelet{
    border-radius: 3px;
    border: 1px #cacaca solid;
    text-align: center;
    font-size: 14px;
    line-height: 28px;
    cursor: pointer;
    padding: 0 12px;
}
.butonstdelet:hover{
    background: #b61717;
    border: 1px #b61717 solid;
    color: #fff;
}
.w3{
    width:24%;
    padding: 0 10px;
    box-sizing: border-box;
    float: left;
}
.shulist .inptcss{
    background: transparent;
    border: 1px #a9a9a9 solid;
    border-radius: 6px;
    height: 24px;
    padding: 0 5px;
	outline: 0;
}
.shulist-con{
    background: #F8F8F8;
    border: 1px #EEEEEE solid;
    border-radius: 6px;
    padding: 0 0;
}
.tabcon{
    width:800px;
}
.textreas{
    height: 180px;
}
.lanbag-text span{
    font-size: 14px;
    display: inline-block;
}
.lanbag-text span.tim2{
    margin-left: 370px;
}
.lanbag-text span.tim3{
    margin-left: 370px;
}
.lanbag-text span.tim4{
    margin-left: 130px;
}
.lanbag-text span.tim5{
    margin-left: 140px;
}
.shulist-c{
    border-top: 1px #33a6ff solid;

}
.shulist-m{
    overflow: hidden;
    border-top: 1px #cdcdcd solid;
    padding: 10px 0 7px 0;
}
.shulist-m:first-child{
    border-top:none;
}
.shulist-c .shulist-m .eqad .inptcss{
    margin-left: 10px;
}
.shulist-c .shulist-m{
    border-top:none;
}
.shulist-c .shulist-c .shulist-m  .eqad .inptcss{
    margin-left: 20px;
}
.shulist-c .shulist-c .shulist-m{
    border-top:none;
}
.cssinput{
    background: transparent;
    border: 1px #dadada solid;
    border-radius: 3px;
    height: 24px;
    padding:0;
}
.tabth{
    padding-bottom:10px;
    font-size: 12px;
	overflow: hidden;
	font-weight: bold;
}
.butbox{
    border-radius: 3px;
    border: 1px #cacaca solid;
    text-align: center;
    font-size: 14px;
    line-height: 28px;
    cursor: pointer;
    padding: 0 12px;
}
.w200{
    width:90px;
    padding: 5px;
}
.w590{
    width:800px;
    padding: 14px 5px;
}
.fl{
    float: left;
}
.chepoc{
    float: left;
    margin:  2px 0 0 17px;
    position: relative;
}
.chepoc i.charu{
    background: url("../../images/fxin.png") no-repeat;
    width:20px;
    height: 20px;
    cursor: pointer;
    display: inline-block;
}
.mustAdd{
    color: #b61717;
	font-style:normal;
	vertical-align: middle;
	padding-right: 7px;
    font-size: 15px;
}
.charutex{
    position: absolute;
    border: 1px #d9d9d9 solid;
    border-radius: 3px;
    display: none!important;
    width:30px;
    padding: 3px 0;
    cursor: pointer;
    text-align: center;
    background: #fff;
}
.chepoc:hover .charutex{
    display: inline-block!important;
}

.teac{
    width:800px;
    height: 100px;
    font-size: 16px;
    padding: 5px 5px;
}
.buttnet{
    text-align: center;
    padding-top: 38px;
    margin-top: 50px;
}
.buttnet button{
    margin: 0 10px;
}
.touxi{
    position: absolute;
    left: 55%;
    width:300px;
    margin-left: 240px;
}
.touxi dl{
    float: left;
    margin-right: 20px;
}
.touxi dl dd{
    width:112px;
    height: 112px;
    border: 1px #ccc solid;
    border-radius: 3px;
    cursor: pointer;
}
.touxi dl dd div{
    text-align: center;
    margin-top: 30px;
}
.touxi dl dd i{
    width:30px;
    height: 30px;
    border-radius: 50%;
    border: 2px #ccc solid;
    display: inline-block;
    text-align: center;
    line-height: 23px;
    font-size: 22px;
    color: #333;
}
.touxi dl dd p{
    color: #333;
    font-size: 14px;
}
.touxi dl dt label{
    width:100%;
    margin-top: 10px;
    font-weight: 400;
}
.iformcon-con.reg4 .tonggo{
    font-size: 24px;
    /* background: url(../img/dui.png) no-repeat; */
    line-height: 70px;
    padding-left: 80px;
    color: #2c9801;
    margin: 140px auto;
    width: 464px;

}
.lanm-con{
	width:98%;
    margin-top:10px;
	background-color:white;
}
.tabcon-mian .tabl-top{
    height: 52px;
}
.tabcon-mian .tabl-top-nav{

    padding: 11px 18px 0 18px;
    height: 41px;
    border: 1px #d8d8d8 solid;
}
.tabcon-mian .tabl-top-nav li{
    height: 40px;
    width:88px;
    display: inline-block;
    margin-right:-4px;
    cursor: pointer;
    text-align: center;
    border-width:1px 0 0 1px;
    border-color: #d8d8d8;
    border-style:solid;
    border-radius: 3px 3px 0 0;
    line-height: 40px;
    background: #fff;
}
.tabcon-mian .tabl-top-nav li:last-child{
    border-right: 1px #d8d8d8 solid;
}
.tabcon-mian .tabl-top-nav li.active{
    border-top: 1px #b61717 solid;
    color:#b61717;
    height: 41px;
}
.tabl-body{}
.tabl-body-bod{
    position: relative;
    height: 50px;
    padding-top: 10px;
    margin-top: 10px;
}
.tabl-body-bod label{
    cursor: pointer;
    margin: 0 20px;
}
.tabl-body-bod .inptexcss{
    position: absolute;
    right: 20px;
    top:0;
    background-color: #fff;
}
.tabl-body-bod label span{
    vertical-align: middle;
    font-size: 14px;
    display: inline-block;
}

.tab-box span{
    display: inline-block;
    margin-right: -4px;
    font-size: 14px;

}
.tab-box{
    margin: 0 14px;
}
.tab-box-head{
  border-bottom: 1px #0066ca solid;
}
.tab-box-head span{
    padding: 10px 0;
}
.tab-box .w10{
    width:13%;
}
.tab-box .w12{
    width:16%;
}
.biaotiimg img{
    border: 1px #d3d3d3 solid;
    border-radius: 3px;
    background: #fff;
    vertical-align: middle;
    margin-right: 4px;
    margin-left: 1px;
}
.biaotiimg em{

}
.tab-box-body .tblist{
    border-bottom: 1px #dedede solid;
}
.tab-box-body .tblist li:hover{
    background: #faf4f4;
}
.tab-box-body .tblist li{
    height: 60px;
    padding-top: 14px;
}
.up-lc{
    position: relative;
}
.up-lc-con{
    position: absolute;
    z-index:99;
    border: 1px #1056bf solid;
    border-radius: 3px;
    background: #fff;
    width: 68px;

    text-align: center;
}
.up-lc-con p{
    color: #999999;
    line-height: 34px;
    cursor: pointer;

}
.up-lc-con p.active{
    background: #1056bf;
    color: #fff;
}
.alicen{
    text-align: center;
}
.caoz{
    float: left;

}
.caoz i{
    display: inline-block;
    cursor: pointer;
    position: relative;
}

.caoz i.ico4{
    /* background:url("../img/ico-fw4.png") center no-repeat; */
    width:24px;
    height: 24px;
}
.caoz i::before{
    background: #fff;
    box-shadow: 2px 2px 2px #ccc;
    border-radius: 3px;
    display: none;
    text-align: center;
    position: absolute;
    top:0;
}
.caoz i.ico::before{
    content: '查看原因';
    width: 80px;
    right: -80px;
    line-height: 24px;
    height:24px;
}
.caoz i.ico1::before{
    content: '编辑';
    width: 40px;
    right: -40px;
    line-height: 24px;
    height:24px;
}
.caoz i.ico2::before{
    content: '删除';
    width: 40px;
    right: -40px;
    line-height: 24px;
    height:24px;
}
.caoz i.ico3::before{
    content: '撤销';
    width: 40px;
    right: -40px;
    line-height: 24px;
    height:24px;
}
.caoz i.ico4::before{
    content: '查看审批流程';
    width: 120px;
    right: -120px;
    line-height: 24px;
    height:24px;
}
.caoz i:hover::before{
    display: block;
    z-index: 99;
}
.caoz i.ico{
    /* background:url("../img/ico-fw.png") center no-repeat; */
    width:24px;
    height: 24px;
}
.caoz i.ico1{
    /* background:url("../img/ico-fw1.png") center no-repeat; */
    width:24px;
    height: 24px;
}
.caoz i.ico2{
    /* background:url("../img/ico-fw2.png") center no-repeat; */
    width:24px;
    height: 24px;
}
.caoz i.ico3{
    /* background:url("../img/ico-fw3.png") center no-repeat; */
    width:24px;
    height: 24px;
}
.kaiguanbut{
    width: 70px;
    height: 26px;
    background: #1bb617;
    display: inline-block;
    border-radius: 13px;
    position: relative;
    cursor: pointer;
}
.kaiguanbut i{
    position: absolute;
    width: 35px;
    height: 24px;
    border: 1px #1bb617 solid;
    border-radius: 12px;
    background: #fff;
}
.kaiguanbut.active{
    background: #b2b2b2;
}
.kaiguanbut.active i{
    right: 0;
    border: 1px #b2b2b2 solid;
}
.kaiguanbut b{
    font-weight: normal;
    width:50%;
    float: left;
    line-height: 26px;
    text-align: center;
    color: #fff;
}
</style>
<style src="" scoped>
.lanbag-text span.tim1{
    color:#58A6F9
}
.lanbag-text span.tim2{
    color:#58A6F9
}
.inputime textarea::-webkit-input-placeholder {   
    color:#757575;  
    font-size:12px;
}  
  .inputime textarea::-moz-placeholder {
    color:#757575;  
    font-size:12px; 
    opacity: 1;
}  
  .inputime textarea:-moz-placeholder {
    color:#757575;  
    font-size:12px;
    opacity: 1;
}  
  .inputime textarea:-ms-input-placeholder {
    color:#757575;  
    font-size:12px;
} 
</style>
