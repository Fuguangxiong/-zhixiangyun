/**
 * Created by zhaichangle
 */

import HttpService from '../../publicJs/ApiClient';
import Vue from 'vue';
import ElementUI from 'element-ui';

import '../publicCss/public.css';
import header from '../../publicComponent/publicTopNavComponent.vue';
import leftNav from '../../publicComponent/publicLeftNavComponent.vue';
import rightTopNav from '../components/CommonRightTopNavComponent.vue';

import bottomComponent from '../../publicComponent/publicBottomComponent.vue';
import TipBoxService from '../../publicJs/TipBoxService';
import NoticeBoxService from '../../publicJs/NoticeBoxService';
import transfer from '../components/MyTransfer.vue';
import publicNavData from '../publicJs/TransformLeftNavData';
import ToolService from '../publicJs/ToolService';
import commonTable from '../components/CommonTableComponent.vue';
import '../css/enterpriseInformation.css';
Vue.use(ElementUI);

function init() {
	var vue = new Vue({
		el: '#enterpriseInformation',
		data: {
			menuName: '创建企业',
			//面包屑信息
			topNavData: {
				breadLinks: [{
					name: "创建企业",
					link: "#"
				}, {
					name: "账填写企业信息",
					link: "#"
				}],
			},
			listData:[],
			authTree:[],
			leftNavData: [],
			publicTopNavData: [],
			//基础信息表单
			basicInfoForm: {
				id: '',
				userName: '', //用户名           	
				userCard: '', //身份证号
				idCardScanFront: '', //身份正面证扫描件
				idCardScanFront2:'',
				idCardScanBack: '', //身份反面证扫描件
				idCardScanBack2:'',
				enterpriseName: '', //企业名称
				blregistNum: '', //营业执照注册号
				blscanCopy: '', //营业执照扫描件
				blscanCopy2:'',
				legalDelegate: '', //法人代表
				legalDelegateId: '', //法人代表身份证号
				companyAddress: '', //公司地址
				province:'',//所在省份
				city:'',//所在城市
				detailedAddress: '', //详细地址         	
			},
			//基础信息表单验证规则
			basicInfoRule: {
				userName: [{
					required: true,
					trigger: 'blur',
					message: '请输入用户姓名'
				}, {
					max: 15,
					message: '用户姓名最长为15个字',
					trigger: 'blur'
				}],
				userCard: [{
					required: true,
					trigger: 'blur',
					message: '请输入身份证号'
				}],
				idScan: [{
					required: true,
					trigger: 'blur',
					message: '请上传身份证正面扫描件'
				}],
				idCardScanFront: [{
					required: true,
					trigger: 'blur',
					message: '请上传身份证正面扫描件'
				}],
				idCardScanBack: [{
					required: true,
					trigger: 'blur',
					message: '请上传身份证反面扫描件'
				}],
				enterpriseName: [{
					required: true,
					trigger: 'blur',
					message: '请输入企业名称'
				}],
				blregistNum: [{
					required: true,
					trigger: 'blur',
					message: '请输入营业执照注册号'
				}],
				blscanCopy: [{
					required: true,
					trigger: 'blur',
					message: '请上传营业执照扫描件'
				}],
				legalDelegate: [{
					required: true,
					trigger: 'blur',
					message: '请输入法人代表'
				}],
				legalDelegateId: [{
					required: true,
					trigger: 'blur',
					message: '请输入法人代表身份证号'
				}],
				companyAddress: [{
					required: true,
					trigger: 'blur',
				}],
				detailedAddress: [{
					required: true,
					trigger: 'blur',
					message: '请输入详细地址'
				}]
			}
		},
		components: {
			'left-nav': leftNav,
			'public-header': header,
			'public-bottom': bottomComponent,
			'right-top-nav': rightTopNav,
			'my-component': commonTable,
			'my-transfer': transfer
		},
		mounted() {
			this.leftNavData = publicNavData.getLeftNavData("创建企业");
            var that=this;
            publicNavData.getTopNavData(function (data) {
                that.publicTopNavData=data;
            });
			//获取上个页面传过来的id
			var id=ToolService.getQueryString("id");
			this.tableLinkHandler(id);
		},
		methods: {
			topNavSearchHandler: function(data) {
				console.info("search=", data);
				window.location.href = "createEnterprise.html?word=" + data;
			},
			selectParentDepart: function() {
				var that = this;
				if(this.basicInfoForm.pId !== '') {
					that.departTransfer.newData = [{
						id: this.basicInfoForm.pId,
						label: this.basicInfoForm.parentDepart
					}];
				} else {
					that.departTransfer.newData = [];
				}
				that.departTransfer.openNum++;
			},
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},
			//获取省份、城市数据
			tableLinkHandler(data) {					
				var that = this;
				//后台的接口
				HttpService.get('enterprise/searchCity',{param:''}, function(data) {
					console.info("信息请求=", data);
					that.listData=data.data;						
					console.info("asdasjdasj=",that.listData);
				})
			},
			provinceSelected:function(divisionsName){
				console.info("dfkdjfd");
				var that=this;
            	var param={param:divisionsName};
                HttpService.get('enterprise/searchCity',param,function(data){
					if(data.status=='200'){
						that.authTree = data.data;
					}
					console.info("aaaaaaaaa=",that.authTree);
				})
			},
			//保存基本信息
			saveBasicInfo: function() {
				this.basicInfoForm.userName = ToolService.trimStr(this.basicInfoForm.userName);
				if(this.basicInfoForm.userName == '') {
					TipBoxService.open("请输入姓名", 2);
					return false;
				} else {
					if(this.basicInfoForm.userName.length > 15) {
						TipBoxService.open("姓名不可以超过15个字", 2);
						return false;
					}
					if(!ToolService.regUserName(this.basicInfoForm.userName)) {
						TipBoxService.open("姓名只可输入汉字和英文", 2);
						return false;
					}
				}
								if(this.basicInfoForm.userCard==''){
									TipBoxService.open("请输入身份证号",2);
									return false;
								}else{
									if(this.basicInfoForm.userCard!==''){
									if(!ToolService.regIDCard(this.basicInfoForm.userCard)){
										TipBoxService.open("请输入18位数字或字母（只限最后一位）",2);
										return false;
									}
								}
								}
								if(this.basicInfoForm.idScanFront==''){					
										TipBoxService.open("请上传身份证正面扫描件",2);
										return false;					
								}
								if(this.basicInfoForm.idScanSide==''){					
										TipBoxService.open("请上传身份证反面扫描件",2);
										return false;					
								}
								if(this.basicInfoForm.companyName==''){					
										TipBoxService.open("请输入企业名称",2);
										return false;
								}
								if(this.basicInfoForm.blregistNum==''){					
										TipBoxService.open("请输入营业执照注册号",2);
										return false;
								}
								if(this.basicInfoForm.blscanCopy==''){					
										TipBoxService.open("请上传营业执照扫描件",2);
										return false;
								}
								if(this.basicInfoForm.legalDelegate==''){
									TipBoxService.open("请输入法人代表",2);
									return false;
								}else{
									if(this.basicInfoForm.legalDelegate.length>15){
										TipBoxService.open("法人代表不可以超过15个字",2);
										return false;
									}
									if(!ToolService.regUserName(this.basicInfoForm.legalDelegate)){
										TipBoxService.open("法人代表只可输入汉字和英文",2);
										return false;
									}
								}
								if(this.basicInfoForm.legalDelegateId==''){
									TipBoxService.open("请输入法人代表身份证号",2);
									return false;
								}else{
									if(this.basicInfoForm.legalDelegateId!==''){
									if(!ToolService.regIDCard(this.basicInfoForm.legalDelegateId)){
										TipBoxService.open("请输入18位数字或字母（只限最后一位）",2);
										return false;
									}
								}
								}
								if(this.basicInfoForm.province==''){					
										TipBoxService.open("请选择所在省份",2);
										return false;
								}
								if(this.basicInfoForm.city==''){					
										TipBoxService.open("请选择所在城市",2);
										return false;
								}
								if(this.basicInfoForm.detailedAddress==''){					
										TipBoxService.open("请输入详细地址",2);
										return false;
								}else{
									if(this.basicInfoForm.detailedAddress!==''){
									if(this.basicInfoForm.detailedAddress.length>100){
										TipBoxService.open("详细地址不可以超过100个字",2);
										return false;
									}
								}
								}				
				var param = {
					data: {
						id: this.basicInfoForm.id,
						userName: this.basicInfoForm.userName, //用户名		           	
						userCard: this.basicInfoForm.userCard, //身份证号		          
						idCardScanFront: this.basicInfoForm.idCardScanFront2, //身份证正面扫描件
						idCardScanBack: this.basicInfoForm.idCardScanBack2, //身份证反面扫描件
						enterpriseName: this.basicInfoForm.enterpriseName, //企业名称
						blregistNum: this.basicInfoForm.blregistNum, //营业执照注册号
						blscanCopy: this.basicInfoForm.blscanCopy2, //营业执照扫描件
						legalDelegate: this.basicInfoForm.legalDelegate, //法人代表
						legalDelegateId: this.basicInfoForm.legalDelegateId, //法人代表身份证号						
						companyAddress: this.basicInfoForm.province+this.basicInfoForm.city, //公司地址
						province:this.basicInfoForm.province,//所在省份
						city:this.basicInfoForm.city,//所在城市
						detailedAddress: this.basicInfoForm.detailedAddress, //详细地址		         	
					}
				}
				HttpService.post('enterprise/saveEnterprise', 'param=' + JSON.stringify(param), function(data) {
					console.info("aaaaaaa=", data);
					if(data.status == '200') {
						TipBoxService.open("保存成功", 0);
						setTimeout(function() {
							window.location.href = "createEnterprise.html";
						}, 2 * 1000)
					}
				}).catch((error) => {
					if(error.response.data.status == '503') {
						TipBoxService.open(error.response.data.exception, 2);
					}
				})
			},
			linkChangeHandler(link) {
				publicNavData.gotoLeftNavLink(link.link);
			},
			//点击查看模板（大图）
			lookBigImg(url){
                window.open(url);
			},
			//上传身份证正面
			saveFilePathFront(data) {
				console.info("dfdfdf=", data);
				var file = data.currentTarget.files[0];
				var filePath = event.currentTarget.files[0].name;
				if(!/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(filePath)) {
					TipBoxService.open("只能选择图片文件", 2);
					return false;
				}
				var that = this;
				HttpService.upload('addImg/addImgs?param=', file, function(data) {
					console.info("dkfjdjfj=", data);
					//var obj=JSON.parse(data);
					if(data.status == 'success') {
						that.basicInfoForm.idCardScanFront2 = data.pathUrl;
						that.basicInfoForm.idCardScanFront = HttpService.apiBaseUrl+data.pathUrl;
					}
				});
			},
			//上传身份证反面
			saveFilePathSide(data) {
				console.info("dfdfdf=", data);
				var file = data.currentTarget.files[0];
				var filePath = event.currentTarget.files[0].name;
				if(!/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(filePath)) {
					TipBoxService.open("只能选择图片文件", 2);
					return false;
				}
				var that = this;
				HttpService.upload('addImg/addImgs?param=', file, function(data) {
					console.info("dkfjdjfj=", data);
					//var obj=JSON.parse(data);
					if(data.status == 'success') {
						that.basicInfoForm.idCardScanBack2 = data.pathUrl;
						that.basicInfoForm.idCardScanBack = HttpService.apiBaseUrl+data.pathUrl;
					}
				});
			},
			//上传营业执照
			saveFilePath(data) {
				console.info("dfdfdf=", data);
				var file = data.currentTarget.files[0];
				var filePath = event.currentTarget.files[0].name;
				if(!/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(filePath)) {
					TipBoxService.open("只能选择图片文件", 2);
					return false;
				}
				var that = this;
				HttpService.upload('addImg/addImgs?param=', file, function(data) {
					console.info("dkfjdjfj=", data);
					//var obj=JSON.parse(data);
					if(data.status == 'success') {
						that.basicInfoForm.blscanCopy2 = data.pathUrl;
						that.basicInfoForm.blscanCopy = HttpService.apiBaseUrl+data.pathUrl;
					}
				});
			},
		}
	});
}
init();