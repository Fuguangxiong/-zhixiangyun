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
		el: '#joinEnterpriseModification',
		data: {
			menuName: '加入企业',
			//面包屑信息
			topNavData: {
				breadLinks: [{
					name: "加入企业",
					link: "#"
				}, {
					name: "个人信息修改",
					link: "#"
				}],
			},
			leftNavData: [],
			publicTopNavData: [],
			//基础信息表单
			basicInfoForm: {
				id: '',
				enterpriseId:'',
				userName: '', //用户名           	
				userCard: '', //身份证号
				idCardScanFront: '', //身份正面证扫描件
				idCardScanFront2:'',
				idCardScanBack: '', //身份反面证扫描件
				idCardScanBack2:'',
				remark:''//备注    	
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
				remark: [{
					required: true,
					trigger: 'blur',
					message: '请输入备注'
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
			this.leftNavData = publicNavData.getLeftNavData("加入企业");
            var that=this;
            publicNavData.getTopNavData(function (data) {
                that.publicTopNavData=data;
            });
			var id=ToolService.getQueryString("id");		
           var enterpriseId=ToolService.getQueryString("enterpriseId");
           if(id!=null || enterpriseId!=null){
                this.basicInfoForm.id=id;
                this.basicInfoForm.enterpriseId=enterpriseId;
           };
           this.tableLinkHandler(id);
		},
		methods: {
			topNavSearchHandler: function(data) {
				console.info("search=", data);
				window.location.href = "joinEnterprise.html?word=" + data;
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
			getUpdateInfo: function() {
				
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
								if(this.basicInfoForm.remark==''){					
										TipBoxService.open("请输入备注",2);
										return false;
								}else{
									if(this.basicInfoForm.remark!==''){
									if(this.basicInfoForm.remark.length>100){
										TipBoxService.open("备注不可以超过100个字",2);
										return false;
									}
								}
								}				
				var param = {
					data: {
						id:this.basicInfoForm.id,
						enterpriseId:this.basicInfoForm.enterpriseId,//企业id
						userName: this.basicInfoForm.userName, //用户名		           	
						userCard: this.basicInfoForm.userCard, //身份证号		          
						idCardScanFront: this.basicInfoForm.idCardScanFront2, //身份证正面扫描件
						idCardScanBack: this.basicInfoForm.idCardScanBack2, //身份证反面扫描件
						remark: this.basicInfoForm.remark, //备注								        	
					}
				}
				HttpService.post('enterprise/updateUserInfo','param=' + JSON.stringify(param), function(data) {
					console.info("aaaaaaa=", data);
					if(data.status == '200') {
						TipBoxService.open("保存成功", 0);
						setTimeout(function() {
							window.location.href = "joinEnterprise.html";
						}, 2 * 1000)
					}
				}).catch((error) => {
					if(error.response.data.status == '503') {
						TipBoxService.open(error.response.data.exception, 2);
					}
				})
			},
			//获取数据
				tableLinkHandler(id) {
					console.info("信息请求=", id);
					var param = {param:id};
					var that = this;
					//后台的接口
					HttpService.get('enterprise/searchUserInfo',param, function(data) {
						console.info("aaaaaa=", data);
						if(data.status == '200') {
							that.basicInfoForm.userName = data.data.list[0].USERNAME;
							that.basicInfoForm.userCard = data.data.list[0].ID_CARD;
							that.basicInfoForm.idCardScanFront = HttpService.apiBaseUrl+data.data.list[0].ID_CARD_SCAN_FRONT;
							that.basicInfoForm.idCardScanFront2 = data.data.list[0].ID_CARD_SCAN_FRONT;
							that.basicInfoForm.idCardScanBack = HttpService.apiBaseUrl+data.data.list[0].ID_CARD_SCAN_BACK;
							that.basicInfoForm.idCardScanBack2 = data.data.list[0].ID_CARD_SCAN_BACK;
								that.basicInfoForm.city = data.data.list[0].CITY, //所在城市
								that.basicInfoForm.remark= data.data.list[0].REMARK;
						}
					})
				},
			linkChangeHandler(link) {
				publicNavData.gotoLeftNavLink(link.link);
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
		}
	});
}
init();