<template>
	<div class="boxService">
		<div class="rightfix">
			<ul>
				<li :class="rightFixData[0].status">基本信息</li>
				<li :class="rightFixData[1].status">服务归属</li>
				<li :class="rightFixData[2].status">图片设置</li>
				<li :class="rightFixData[3].status">页面请求设置</li>
				<li :class="rightFixData[4].status">数据页面请求设置</li>
				<li :class="rightFixData[5].status">纯数据请求设置</li>
				<li :class="rightFixData[6].status">可见性设置</li>
				<li :class="rightFixData[7].status">屏蔽性设置</li>
				<li :class="rightFixData[8].status">计费方案</li>
			</ul>
		</div>
		<div class="tattop">服务管理·企业服务·新建服务·创建原子服务·基本信息</div>
		<!-- 基础信息start -->
		<div class="comcm " :class="{active:rightFixData[0].isOpen}">
			<div class="thade " @click="upSadt(0)">
				<span class="thade-cloe"><i class="icon iconfont icon-jichuxinxiguanli-copy"></i>
				<em>基础信息</em></span>
				<span class="upcnl">
					<em class="bianji" v-show="rightFixData[0].isEditShow" @click.stop="formedit(0)"><i class="icon iconfont icon-bianji2"></i></em>
					<em class="upjit"><i class="icon iconfont icon-arrow-down-copy"></i></em>
				</span>
			</div>
			<base-information @submint='submint1' :is-editdm='editmsg' @cancel="resetEdit" :is-chide='id'></base-information>
		</div> 
		<!-- 基础信息end -->		
		<!-- 服务归属start -->
		<div class="comcm" :class="{active:rightFixData[1].isOpen}">
			<div class="thade" @click="upSadt(1)"><span class="thade-cloe"><i class="icon iconfont icon-guishu"></i><em>服务归属</em></span>
			<span class="upcnl">
					<em class="bianji" v-show="rightFixData[1].isEditShow" @click.stop="formedit(1)"><i class="icon iconfont icon-bianji2"></i></em>
					<em class="upjit"><i class="icon iconfont icon-arrow-down-copy"></i></em>
			</span>
			</div>
			<homeConfig @submint='submint2' :is-editdmb='editmsgb' :is-chide='id' @cancel="resetEditb"></homeConfig>
			
		</div>
		<!-- 服务归属end -->
		<!-- 模块图片start -->
		<div class="comcm" :class="{active:rightFixData[2].isOpen}">
			<div class="thade" @click="upSadt(2)">
				<span class="thade-cloe">
					<i class="icon iconfont icon-guishu"></i>
					<em>图片配置</em>
				</span>
				<span class="upcnl">
					<em class="bianji" v-show="rightFixData[2].isEditShow" @click.stop="formedit(2)">
						<i class="icon iconfont icon-bianji2"></i>
					</em>
					<em class="upjit">
						<i class="icon iconfont icon-arrow-down-copy"></i>
					</em>
				</span>
			</div>
			<img-config @submint='submint3' :msg-img='editmsgc' :is-chide='id'></img-config>
		</div>
		<!-- 模块图片end -->
		
		<!-- 页面请求设置start -->
		<div class="comcm" :class="{active:rightFixData[3].isOpen}" >
			<div class="thade" :class="rightFixData[3].status" @click="upSadt(3)"><span class="thade-cloe"><i class="icon iconfont icon-guishu"></i><em>页面请求设置</em></span>
				<span class="upcnl">
					<em class="bianji" v-show="rightFixData[3].isEditShow" @click.stop="formedit(3)"><i class="icon iconfont icon-bianji2"></i></em>
					<em class="upjit"><i class="icon iconfont icon-arrow-down-copy"></i></em>
				</span>
			</div>
			<htmlRequestb @submint='submint4' :is-editdmset='editmsgset' :is-chide='id' :del-a='delA'></htmlRequestb>
		</div>
		<!-- 页面请求设置end -->
		<!-- 数据页面请求设置start -->
		<div class="comcm" :class="{active:rightFixData[4].isOpen}" >
			<div class="thade" :class="rightFixData[4].status" @click="upSadt(4)"><span class="thade-cloe"><i class="icon iconfont icon-guishu"></i><em>数据页面请求设置</em></span>
			<span class="upcnl">
					<em class="bianji" v-show="rightFixData[4].isEditShow" @click.stop="formedit(4)"><i class="icon iconfont icon-bianji2"></i></em>
					<em class="upjit"><i class="icon iconfont icon-arrow-down-copy"></i></em>
			</span>
			</div>
			<htmlRequest @submint='submint5' :is-editdmd='editmsgd' :is-chide='id' :del-b="delB"></htmlRequest>
		</div>
		<!-- 数据页面请求设置end -->
		<!-- 纯数据请求设置start -->
		<div class="comcm" :class="{active:rightFixData[5].isOpen}" >
			<div class="thade" :class="rightFixData[5].status" @click="upSadt(5)"><span class="thade-cloe"><i class="icon iconfont icon-guishu"></i><em>纯数据请求设置</em></span>
			<span class="upcnl">
					<em class="bianji" v-show="rightFixData[5].isEditShow" @click.stop="formedit(5)"><i class="icon iconfont icon-bianji2"></i></em>
					<em class="upjit"><i class="icon iconfont icon-arrow-down-copy"></i></em>
			</span>
			</div>
			<htmlRequestc @submint='submint6' :is-editdmdata='editmsge' :is-chide='id' :del-c="delC"></htmlRequestc>
		</div>
		<!-- 纯数据请求设置end -->
		<!-- 可见性配置start -->
		<div class="comcm" :class="{active:rightFixData[6].isOpen}">
			<div class="thade" @click="upSadt(6)"><span class="thade-cloe"><i class="icon iconfont icon-guishu"></i><em>可见性配置</em></span>
			<span class="upcnl">
					<em class="bianji" v-show="rightFixData[6].isEditShow" @click.stop="formedit(6)"><i class="icon iconfont icon-bianji2"></i></em>
					<em class="upjit"><i class="icon iconfont icon-arrow-down-copy"></i></em>
			</span>
			</div>
			<visibility-configuration @submint='submint7' :is-editdmg='editmsgg' :is-chide='id'></visibility-configuration>
		</div>
		<!--可见性配置end -->
		<!-- 屏蔽性配置start -->
		<!-- <div class="comcm" :class="{active:rightFixData[7].isOpen}">
			<div class="thade" @click="upSadt(7)"><span class="thade-cloe"><i class="icon iconfont icon-guishu"></i><em>屏蔽性配置</em></span>
			<span class="upcnl">
					<em class="bianji" v-show="rightFixData[7].isEditShow" @click.stop="formedit(7)"><i class="icon iconfont icon-bianji2"></i></em>
					<em class="upjit"><i class="icon iconfont icon-arrow-down-copy"></i></em>
			</span>
			</div>
			<shielded-configuration @submint='submint8'  :is-editdmh='editmsgh' @passNsp='gainSc' :is-chide='id'>
			</shielded-configuration>
		</div> -->
		<!-- 屏蔽性配置end -->
		<!-- 计费方案start -->
		<div class="comcm" :class="{active:rightFixData[8].isOpen}">
			<div class="thade" @click="upSadt(8)">
				<span class="thade-cloe">
					<i class="icon iconfont icon-guishu"></i>
					<em>计费方案</em>
				</span>
				<span class="upcnl">
					<em class="bianji" v-show="rightFixData[8].isEditShow" @click.stop="formedit(8)">
						<i class="icon iconfont icon-bianji2"></i>
					</em>
					<em class="upjit">
						<i class="icon iconfont icon-arrow-down-copy"></i>
					</em>
				</span>
			</div>
			<set-scheme-rule @submit='submitCharge' :msg='msgPlan.data' :serviceId='id' :isEdit='!msgPlan.isEditShow'></set-scheme-rule>
		</div>
		<!-- 计费方案end -->
		<!-- 底部 -->
		<div class="apply-actions">
			<div>
				<b>服务需求单：</b>
				<span>分为应用服务、远程服务，用户可将原有应用系统上传到平台或提供远程访问地址，平台提供从中拆分成单一服务的能力。且拆分出的服务具有标准的数据对接接口，可单独调用或扩展应用于其他系统的最小服务单元，这种最小服务单元统称为原子服务。</span>
			</div>
			<button class="apply-btn back" @click="goBack()">返回</button>
			<!-- <button v-show='status=="edit"' class="apply-btn save" @click="onSave">保存草稿</button>
			<button v-show='status=="edit"' class="apply-btn submit" @click="onSubmit">提交</button> -->
			<button class="apply-btn submit" @click="submitService()">提交</button>
		</div>
	</div>
</template>
<script>
import LabelView from '../../../publicComponent/labelView.vue'
import apiToken from '../../../publicJs/apiToken.js'
import apiClient from '../../../publicJs/ApiClient.js'
import TipBoxService from "../common/TipBoxService.js";
import LoadingBoxService from '../../../publicJs/LoadingBoxService.js'
import baseInformation from './essentialInformation.vue'
import homeConfig from './homeConfig.vue'
import imgConfig from './imgConfig.vue'
import htmlRequest from './htmlRequest.vue';
import htmlRequestb from './htmlRequestb.vue';
import htmlRequestc from './htmlRequestc.vue';
import setSchemeRule from "../createCombinationService/setSchemeRule.vue";
import commonFunc from "../common/commonFunc.js";
export default {
	name: '',
	
	data(){
		return {
			gainData:'',//屏蔽组件抛出获取
			source_type:'',//跳转来源
			delA:false,
			delB:false,
			delC:false,
			serv:[],//回显示 页面请求设置，纯数据设置，页面请求设置，抛出来存储
			id:this.$route.query.atomicId||'', //服务id
			serviceId:"",//变更
			publicWidth:0,
			//基础信息
			editmsg:{
				isEditShow:false, //是否显示编辑按钮
				id:'',
				data:{ //回显数据
						service_name: '',
						startTime: '',
						endTime: '',
						service_brief: '',
						service_remark: '',
					},

			},
			isPlanChange: false,
			//归属服务
			editmsgb:{
				isEditShow:false,
				data:{ //回显数据
						service_tag:[],
						apptype:'',
						app_id:'',
						service_type:[]
					},
			},
			//上传图片
			editmsgc:{
				isEditShow: false, //是否显示编辑按钮
					id: '', //服务id
					data: {
						img: '',
						bg_img: ''
					}, //回显数据
			},
			//数据请求
			editmsgd:{
				isEditShow:false,
				data: {}
			},
			//页面请求
			editmsgset:{
				isEditShow:false,
				data:[]
			},
			//纯数据请求
			editmsge:{
				isEditShow:false,
				data: {}
			},
			//屏蔽性
			editmsgh:{
				isEditShow:false,
			},
			//可见性
			editmsgg:{
				isEditShow:false,
			},
			//计费方案
				msgPlan: {
					isEditShow: true,
					data: null,
					allData: {},
				},
			stdatypeArr:'',//组件归属输出我选择了 哪几个 页面请求方式
			
			rightFixData:[//右边悬浮标示控制
				{
					name:'a',//对应第几个
					status:'stant',//对应状态
					isOpen:true,//内容是否是展开
					isEditShow:false//编辑按钮状态
				},
				{
					name:'b',
					status:'',
					isOpen:false,
					isEditShow:false//编辑按钮状态
				},
				{
					name:'c',
					status:'',
					isOpen:false,
					isEditShow:false//编辑按钮状态
				},
				{
					name:'d',
					status:'modes',
					isOpen:false,
					isEditShow:false//编辑按钮状态
					
				},
				{
					name:'e',
					status:'modes',
					isOpen:false,
					isEditShow:false//编辑按钮状态
				},
				{
					name:'f',
					status:'modes',
					isOpen:false,
					isEditShow:false//编辑按钮状态
				},
				{
					name:'g',
					status:'tree',
					isOpen:false,
					isEditShow:false//编辑按钮状态
				},
				{
					name:'h',
					status:'',
					isOpen:false,
					isEditShow:false//编辑按钮状态
				},
				{
					name:'i',
					status:'',
					isOpen:false,
					isEditShow:false//编辑按钮状态
				},
			],
		}
	},
	 watch: {
			//页面请求设置，纯数据设置，页面请求设置，抛出来存储
			serv:{
				handler(newValue, oldValue) {
					this.editmsgset.data = newValue;
					this.editmsgd.data = newValue;
					this.editmsge.data = newValue;
					console.info(' 页面请求设置，纯数据设置，页面请求设置，抛出来存储',newValue)
				},
				deep: true
			}
		},
	mounted(){
		var that = this;
		that.source_type = that.$route.query.source_type;
		that.id = that.$route.query.id;
		//判断是否是修改或者变更
		if (this.checkNull(this.id)) {
			this.getData();
		}
		//控制总保存，浮动框
		$(".apply-actions").css({ width: that.getControllerWidth() + "px" });
        if (window.iscEvent) {
            window.iscEvent.on("menuchange", function () {
                let targetW = that.getControllerWidth();
                $(".apply-actions").animate({ width: targetW + "px" }, 500);
            });
        }
	},
	methods:{
			goBack(){
				var that = this;
				if (that.source_type == 1) {
					that.$router.push("/enterprise");
				} else if (that.source_type == 5) {
					that.$router.push("/registered");
				} else if (that.source_type == 2) {
					that.$router.push("/platformService");
				}
			},
			submitService() {
				let that = this;
				var myData = {
					id: this.id,
					operate_page: "6"
				};
				apiClient.post('itsmApi/createService/updateAtomicInfo', myData, function (data) {
					debugger;
					if (that.source_type == 1) {
						that.$router.push("/enterprise");
					} else if (that.source_type == 5) {
						that.$router.push("/registered");
					} else if (that.source_type == 2) {
						that.$router.push("/platformService");
					}else{
						that.$router.push("/search");
					}
				});
			},
			getControllerWidth() {
				let targetW = 0;
				if ($('body').hasClass('bigSreen') && !$('body').hasClass('bigSreen2')) {
					targetW = $(window).width() - 58;
				} else {
					targetW = $(window).width() - 208;
				}
				return targetW;
			},
		//数据回显并且分发到各个组件
		getData(){
			let that = this;
			apiClient.post('itsmApi/atomicService/loadServiceInfo', { id:that.id }, function (data) {
					var datas = data.results;		
					var data = data.results.data[0];
					//基础信息
					if(data.name != undefined && data.name != ''){
						console.info('进入基础信息回显')
						that.editmsg.isEditShow = true;
						that.rightFixData[0].status = 'tree';
						that.rightFixData[0].isOpen = true;
						that.rightFixData[0].isEditShow = true;
						$('.formaCon').eq(0).slideDown();
						that.editmsg.data.name = data.name;
						that.editmsg.data.startTime = that.formatDuring(parseInt(data.service_start_time),'yyyy-MM-dd')
						that.editmsg.data.endTime = that.formatDuring(parseInt(data.service_end_time),'yyyy-MM-dd');
						that.editmsg.data.brief = data.service_brief;
						that.editmsg.data.service_remark = data.service_remark;
						//如果进入回显，把右边开启 编辑状态
						
						that.rightFixData.forEach(function(v,i){
							if(v.status != 'tree'){
								if(v.status != 'modes'){
									v.status = 'initial'
									}
							}
						})
					}
					if(data.service_tag!=undefined && data.service_tag!=''){
						console.info('进入归属服务回显',data)
						that.editmsgb.isEditShow = true;
						that.rightFixData[1].status = 'tree';
						that.rightFixData[1].isOpen = true;
						that.rightFixData[1].isEditShow = true;
						$('.formaCon').eq(1).slideDown();
						that.editmsgb.data.service_tag=data.service_tag;
						that.editmsgb.data.apptype=data.apptype;
						that.editmsgb.data.app_id=data.app_id;
						that.editmsgb.data.service_type=data.service_type;
						
						for(var i =0 ; i<data.service_type.length; i++){
							
							if(data.service_type[i] =='1'){
							
								that.rightFixData[3].status = 'initial'
							}else if(data.service_type[i] =='2'){
								that.rightFixData[4].status = 'initial'
							}else if(data.service_type[i]=='3'){
								that.rightFixData[5].status = 'initial'
							}
                    	}
						that.rightFixData.forEach(function(v,i){
							if(v.status != 'tree'){
								if(v.status != 'modes'){
									v.status = 'initial'
									}
							}
						})
					}
					//图片数据
					if (data.img != undefined && data.img != '') {
						that.editmsgc.isEditShow = true;
						that.rightFixData[2].status = 'tree';
						that.rightFixData[2].isOpen = true;
						that.rightFixData[2].isEditShow = true;
						$('.formaCon').eq(2).slideDown();//展开
						that.editmsgc.data.img = data.img;//logo
						that.editmsgc.data.bg_img = data.bg_img;//背景图片
						that.editmsgc.id = data.id;//
					}
					//数据页面请求
					var serv = data.service_param_detail;
					 	serv[0] = JSON.parse(serv[0]);
						serv[1] = JSON.parse(serv[1]);
						serv[2] = JSON.parse(serv[2]);
						
					if (serv[0].url != '') {
						var type =data.service_type;
				
							that.editmsgset.isEditShow = true;
							that.editmsgset.data=serv;
							that.rightFixData[3].status = 'tree';
							that.rightFixData[3].isOpen = true;
							that.rightFixData[3].isEditShow = true;
							$('.formaCon').eq(3).slideDown();//展开
							
						}
						//数据页面请求
					if (serv[1].url != '') {
							that.editmsgd.isEditShow = true;
							that.editmsgd.data= serv;
							that.rightFixData[4].status = 'tree';
							that.rightFixData[4].isOpen = true;
							that.rightFixData[4].isEditShow = true;
							$('.formaCon').eq(4).slideDown();//展开
							
						}
						//纯数据请求
						if (serv[2].url != '') {
							
							that.editmsge.isEditShow = true;
							that.editmsge.data= serv;
							that.rightFixData[5].status = 'tree';
							that.rightFixData[5].isOpen = true;
							that.rightFixData[5].isEditShow = true;
							$('.formaCon').eq(5).slideDown();//展开
							
						}
						//计费方案
						if (data.bill_rules) {
							that.msgPlan.isEditShow = true;
							that.rightFixData[8].status = 'tree';
							that.rightFixData[8].isOpen = true;
							that.rightFixData[8].isEditShow = true;
							$('.formaCon').eq(8).slideDown();//展开
							console.log("计费方案",data.bill_rules);
							that.msgPlan.data = data.bill_rules;
						}

					
				});
		},
		//计费方案通知改变
			editChange(status) {
				
				console.info('计费方案通知改变',status)
				this.isPlanChange = status; //通知子组件改变
		},
		//计费--保存
		Prtion(data) {
			
			this.rightFixData[8].isEditShow = data.isEditShow;//显示第一个编辑按钮
			this.msgPlan.isEditShow = data.isEditShow;//给子组件传递信息
			this.rightFixData[8].status = 'tree';
		},
		//处理计费方案的数据(因两个接口返回的数据不一致，后期优化后可注释)
			planData(data) {
				if (data == undefined || data.length == 0) {
					return;
				}
				data.map(function (val) {
					val.key = val.groupName;
					val.value = val.feeInfo;
				})
				return data;
			},
		//提交审核
		examine(){
			var service_status = 1
			if(service_status!=1) return false;
			var myData={
				id:this.id,
				audit_status:service_status
			};
			apiClient.post('itsmApi/atomicService/updateAtomicInfo', myData, function (data) {
					console.info('审核通过',data)
			})
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
		//点击展开
		upSadt(index){
			let isEdit = true;
			var that = this;
			console.info('---进入点击',index);
			//判断状态
			this.rightFixData.forEach(function(v,i){
				if(v.status == 'stant'){
					isEdit = false;
				}
			})
			//编辑状态不能<=0 的时候， 或者状态是成功的时候
			if(isEdit || this.rightFixData[index].status == 'tree'){
			if(this.rightFixData[index].status != 'modes'){
				if(this.rightFixData[index].status != 'tree'){
					this.rightFixData[index].status = this.rightFixData[index].status != 'stant' ?'stant' :'initial';
					$('.formaCon').eq(index).slideDown();
					that.rightFixData[index].isOpen = true;
					if(index==8){
						that.msgPlan.isEditShow=false;
					}
				}else{
					if(that.rightFixData[index].isOpen){
							$('.formaCon').eq(index).slideUp();
							that.rightFixData[index].isOpen = false;
						}else{
							$('.formaCon').eq(index).slideDown();
							that.rightFixData[index].isOpen = true;
						}
					}
				}
			}
		},
		//编辑按钮
		 formedit(index){
			 var that = this;
			 switch (this.rightFixData[index].name) {
						case 'a':
							this.rightFixData[0].isEditShow = false;//控制编辑消失
							this.editmsg.isEditShow = false;//告诉子组件
							this.rightFixData[0].isOpen = true;//控制编辑消失
							$('.formaCon').eq(0).slideDown();
							break;
						case 'b':
						for(var i = 0; i<this.stdatypeArr.length; i++){
								if(this.stdatypeArr[i] == '1' && this.rightFixData[3].status == 'stant'){
									this.rightFixData[3].isOpen = false;//显示第一个编辑按钮
									this.rightFixData[3].isEditShow = false;//显示第一个编辑按钮
									this.editmsgset.isEditShow = false;//给子组件传递信息
									this.rightFixData[3].status = 'modes';	
									$('.formaCon').eq(3).slideUp();
								}else if(this.stdatypeArr[i] == '2' && this.rightFixData[4].status == 'stant'){
									this.rightFixData[4].isOpen = false;//显示第一个编辑按钮
									this.rightFixData[4].isEditShow = false;//显示第一个编辑按钮
									this.editmsgd.isEditShow = false;//给子组件传递信息
									this.rightFixData[4].status = 'modes';	
									$('.formaCon').eq(3).slideUp();
								}else if(this.stdatypeArr[i] == '3' && this.rightFixData[5].status == 'stant'){
									this.rightFixData[4].isOpen = false;//显示第一个编辑按钮
									this.rightFixData[4].isEditShow = false;//显示第一个编辑按钮
									this.editmsge.isEditShow = false;//给子组件传递信息
									this.rightFixData[4].status = 'modes';	
									$('.formaCon').eq(4).slideUp();
								}
							}
							this.rightFixData[1].isEditShow = false;//控制编辑消失
							this.editmsgb.isEditShow = false;//告诉子组件
							this.rightFixData[1].isOpen = true;//控制编辑消失
							$('.formaCon').eq(1).slideDown();
							break;
						case 'c':
							this.rightFixData[2].isEditShow = false;//控制编辑消失
							this.editmsgc.isEditShow = false;//告诉子组件
							this.rightFixData[2].isOpen = true;
							$('.formaCon').eq(2).slideDown();
							break;
						case 'd':
							this.rightFixData[3].isEditShow = false;//控制编辑消失
							this.editmsgset.isEditShow = false;//告诉子组件
							this.rightFixData[3].isOpen = true;
							$('.formaCon').eq(3).slideDown();
							
							break;
						case 'e':
							this.rightFixData[4].isEditShow = false;//控制编辑消失
							this.editmsgd.isEditShow = false;//告诉子组件
							this.rightFixData[4].isOpen = true;
							$('.formaCon').eq(4).slideDown();
							break;
						case 'f':
							this.rightFixData[5].isEditShow = false;//控制编辑消失
							this.editmsge.isEditShow = false;//告诉子组件
							this.rightFixData[5].isOpen = true;
							$('.formaCon').eq(5).slideDown();
							break;
						case 'g':
							this.rightFixData[6].isEditShow = false;//控制编辑消失
							this.editmsgg.isEditShow = false;//告诉子组件
							this.rightFixData[6].isOpen = true;
							$('.formaCon').eq(6).slideDown();
							break;
						case 'h':
							
							this.rightFixData[7].isEditShow = false;//控制编辑消失
							this.editmsgh.isEditShow = false;//告诉子组件
							this.rightFixData[7].isOpen = true;
							$('.formaCon').eq(7).slideDown();
							break;
						case 'i':
							this.rightFixData[8].isEditShow = false;//控制编辑消失
							this.msgPlan.isEditShow = false;//告诉子组件
							$('.formaCon').eq(8).slideDown();
							this.rightFixData[8].isOpen = true;
							this.isPlanChange = true; //通知子组件改变
							break;	
					}
			this.rightFixData[index].isOpen = true	
			this.rightFixData[index].status = 'stant'
				
		 },
		//基础服务
		submint1(obj){
			console.info('服务管理组件跑出------>',obj)
				this.rightFixData[0].isEditShow = obj.isEditShow;//显示第一个编辑按钮
				this.editmsg.isEditShow = obj.isEditShow;//给子组件传递信息
				this.id = obj.id;
				this.rightFixData[0].status = 'tree';
					this.rightFixData.forEach(function(v,i){
						if(v.status != 'tree'){
							if(v.status != 'modes'){
								v.status = 'initial'
								}
						}
					})
			this.$router.push({ name: 'newServicePage', query: { id: this.id } })
		},
		resetEdit(item){
			this.rightFixData[0].isEditShow = item;
			this.rightFixData[0].status = "tree"
		},
		resetEditb(item){
			this.rightFixData[1].isEditShow = item;
			this.rightFixData[1].status = "tree"
		},
		//服务管理
		submint2(obj,isDela,isDelb,isDelc){
				console.log("a",isDela,"b",isDelb,"c",isDelc)
				this.delA = isDela;
				this.delB = isDelb;
				this.delC = isDelc;
				this.rightFixData[1].isEditShow = obj.isEditShow;//显示第一个编辑按钮
				this.editmsgb.isEditShow = obj.isEditShow;//给子组件传递信息
				this.stdatypeArr = obj.stdatype;
				this.rightFixData[1].status = 'tree';	
				this.rightFixData[3].status = 'modes';
				this.rightFixData[4].status = 'modes';
				this.rightFixData[5].status = 'modes';
				// this.getData();
				
				console.info('接受服务归属抛出',obj)
				for(var i =0 ; i<obj.stdatype.length; i++){
						if(obj.stdatype[i] =='1'){
							this.rightFixData[3].status = 'initial'
						}else if(obj.stdatype[i] =='2'){
							this.rightFixData[4].status = 'initial'
						}else if(obj.stdatype[i]=='3'){
							this.rightFixData[5].status = 'initial'
						}
                    }
		},
		//图片配置--保存
		submint3(obj){
			console.log('图片这是抛出父组件的==',obj)
				this.rightFixData[2].isEditShow = obj.isEditShow;//显示第一个编辑按钮
				this.editmsgc.isEditShow = obj.isEditShow;//给子组件传递信息
				this.rightFixData[2].status = 'tree';	
		},
		//页面请求
		submint4(obj){
				// console.info('0000----000',obj.spdetail)
				
				this.serv = obj.spdetail;
				this.rightFixData[3].isEditShow = obj.isEditShow;//显示第一个编辑按钮
				this.editmsgset.isEditShow = obj.isEditShow;//给子组件传递信息
				this.rightFixData[3].status = 'tree';	
		},
		//页面数据请求
		submint5(obj){
				this.serv = obj.spdetail;
				this.rightFixData[4].isEditShow = obj.isEditShow;//显示第一个编辑按钮
				this.editmsgd.isEditShow = obj.isEditShow;//给子组件传递信息
				this.rightFixData[4].status = 'tree';	
		},
		//纯数据请求
		submint6(obj){

				this.serv = obj.spdetail;
				this.rightFixData[5].isEditShow = obj.isEditShow;//显示第一个编辑按钮
				this.editmsge.isEditShow = obj.isEditShow;//给子组件传递信息
				this.rightFixData[5].status = 'tree';	
		},
		//可见性
		submint7(data){
			
				this.rightFixData[6].isEditShow = data.isEditShow;//显示第一个编辑按钮
				this.editmsgg.isEditShow = data.isEditShow;//给子组件传递信息
				this.rightFixData[6].status = 'tree';	//右边悬浮标示
			
		},
		//屏蔽性
		submint8(data){
				
				this.rightFixData[7].isEditShow = data.isEditShow;//显示第一个编辑按钮
				this.editmsgh.isEditShow = data.isEditShow;//给子组件传递信息
				this.rightFixData[7].status = 'tree';	//右边悬浮标示
				
		},
		//校验是否为空
		checkNull(obj) {
			if (obj == "" || obj == undefined || obj.length == 0) {
				return false;
			} else {
				return true;
			}
		},
		//屏蔽性抛出
		gainSc(data){
			this.gainData = data;
		},
		submitCharge(flag, index, item) {
			this.rightFixData[8].isEditShow = false;//控制编辑消失
			this.msgPlan.isEditShow = false;//告诉子组件
			$('.formaCon').eq(8).slideDown();
			this.rightFixData[8].isOpen = true;
			this.isPlanChange = true; //通知子组件改变
			
			if (flag && item) {
				this.msgPlan.data =  item;
			}
		}
	},
  	components: {
	  LabelView,
	  baseInformation,
	  imgConfig,
	  homeConfig,
	  htmlRequestb,
	  htmlRequest,
	  htmlRequestc,
	  setSchemeRule
	}
}
</script>
<style src="../../css/common/public.css" scoped></style>
<style src="../../css/createBasicService/newServiceCom.css" scoped></style>
<style>
.is-error .txet-ts{
	color: red;
}
.boxService .el-input__icon+.el-input__inner{
	width: auto;
}
.formboxru .form-tr::after{
	content: '';
}
/* .boxService .el-form-item__error{
	display: none;
} */
.boxService .forpz-con .el-form-item__label{
	font-weight: normal;
}
.boxService .forpz-con .el-form-item{
	margin-bottom: 14px;
}
.boxService .el-radio-button{
	margin-right:20px;
}
.boxService .el-checkbox-button{
	margin-right: 16px;
}
.boxService .el-radio-button__inner,.boxService .el-checkbox-button__inner{
		border: 1px #cccccc solid;
		height: 30px;
		width: 80px;
		padding: 0;
		font-size: 12px;
		line-height: 29px;
		font-weight: normal;
}
.boxService .el-radio-button:last-child .el-radio-button__inner,.boxService .el-checkbox-button:first-child .el-checkbox-button__inner,.boxService .el-checkbox-button:last-child .el-checkbox-button__inner{
	border-radius: 0;
}
.boxService .el-radio-button:first-child .el-radio-button__inner{
	border-radius: 0;
	
}
.boxService .el-radio-button:first-child .el-radio-button__inner:hover{
	background-color: #ff9900;
	border: 1px #ff9900 solid;
	box-shadow:0 0 0 0;
	color: #fff;
	
}
.boxService .el-radio-button__orig-radio:checked+.el-radio-button__inner{
	border-radius: 0;
}
.boxService .el-radio-button__orig-radio:checked+.el-radio-button__inner,.boxService .el-radio-button__inner:hover,.boxService .el-checkbox-button.is-checked .el-checkbox-button__inner,.boxService .el-checkbox-button__inner:hover{
	background-color: #ff9900;
	border: 1px #ff9900 solid;
	box-shadow:0 0 0 0;
	color: #fff;
}
.boxService .el-checkbox-button.is-checked .el-checkbox-button__inner::before{
	content: '';
	width: 18px;
	height: 18px;
	position: absolute;
	right: -1px;
	top:-1px;
	background: red;
	background: url('../../images/activeicon.png') no-repeat;
}
.boxService .radio-css .el-radio__label{
	position: absolute;
	width: 80px;
	height: 30px;
	text-align: center;
	line-height: 30px;
	padding: 0;
	left: 0;
	top:0;
}
.boxService .radio-css .is-checked .el-radio__label{
	color: #fff;
}
.boxService .el-form-item.is-required .el-form-item__label:before{
	content: '';
}
.boxService .el-form-item__label,.boxService .el-input,.boxService .el-textarea__inner{
	font-size: 12px;
}
.boxService textarea{
	height: auto;
}
.boxService .el-button{
	width: 80px;
	height: 30px;
	cursor: pointer;
	line-height: 30px;
	text-align: center;
	padding: 0;
}
.boxService .el-button--primary{
	background-color:#55a8fd;
	border-color:#55a8fd;
}
.boxService .el-button--default{
	background-color: #e3e3e3;
	border: 1px #e3e3e3 solid;
	color: #fff;
}
.boxService .el-button--default:hover{
	background-color:#55a8fd;
	border-color:#55a8fd;
	color: #fff;
}
.newService .el-dialog__body {
		min-height: 430px;
		padding-top: 20px;
	}
.boxService	.el-date-editor.el-input{
		width: 163px!important;
	
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
