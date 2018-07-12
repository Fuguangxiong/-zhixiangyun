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
import aprovalBox from  '../publicJs/ApprolBox';
import loading from '../../publicJs/LoadingBoxService';
import '../css/enterpriseInformation.css';

Vue.use(ElementUI);

function init() {
	var vue = new Vue({
		el: '#auditUserDeta',
		data: {
			menuName: '账户审核',
			//面包屑信息
			topNavData: {
				breadLinks: [{
					name: "权限管理",
					link: "#"
				}, {
					name: "账户管理",
					link: "#"
				}, {
					name: "用户审批",
					link: "#"
				}, {
					name: "详细信息",
					link: "#"
				}],
			},
			leftNavData: [],
			publicTopNavData: [],
			//基础信息表单
			basicInfoForm: {
				userId: '',
				userName: '', //用户名   
				phone:'',//手机号码
				userCard: '', //身份证号
				idCardScanFront: '', //身份正面证扫描件
				idCardScanBack: '', //身份反面证扫描件
				remark:'',//备注    	
				ENTERPRISE_ID:'',
				id:''
			},
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
			console.info("fdfdfd",HttpService.apiBaseUrl);
			this.leftNavData = publicNavData.getLeftNavData("账户审核");
            var that=this;
            publicNavData.getTopNavData(function (data) {
                that.publicTopNavData=data;
            });
			var id=ToolService.getQueryString("id");
			this.tableLinkHandler(id);
		},
		methods: {
			topNavSearchHandler:function(data){
                console.info("search=",data);
              window.location.href="auditUser.html?word="+data;
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
			tableLinkHandler(data) {
				var that = this;
				console.info("data=",data);
				//后台的接口
				HttpService.get('enterprise/searchUserInfo',{param:data}, function(data) {
					console.info("assajsff=", data);
					if(data.status == '200') {
						that.basicInfoForm.userName = data.data.list[0].USERNAME;
						that.basicInfoForm.userCard = data.data.list[0].ID_CARD;
						that.basicInfoForm.phone = data.data.list[0].PHONE;
						that.basicInfoForm.idCardScanFront = HttpService.apiBaseUrl+data.data.list[0].ID_CARD_SCAN_FRONT;
						that.basicInfoForm.idCardScanBack = HttpService.apiBaseUrl+data.data.list[0].ID_CARD_SCAN_BACK;						
						that.basicInfoForm.remark = data.data.list[0].REMARK;
						that.basicInfoForm.userId = data.data.list[0].ID;
						that.basicInfoForm.ENTERPRISE_ID = data.data.list[0].ENTERPRISE_ID;
					}
				})
			},
			//通过按钮的点击事件
			passClickHandler(){
				console.info("通过");
				var that=this;
                NoticeBoxService.open("确定要通过此项申请吗？",function () {
                	NoticeBoxService.close();
                	loading.open("正在提交数据，请稍候...");
                	var param=[{enterpriseId:that.basicInfoForm.ENTERPRISE_ID,userId:that.basicInfoForm.userId}];
                	console.info("jfdkfjdkf=",encodeURIComponent(JSON.stringify(param)));
					HttpService.post('enterprise/approve','param='+encodeURIComponent(JSON.stringify(param)),function (data) {
                        loading.close();
                        TipBoxService.open("通过成功!");
                        setTimeout(function () {
                            window.location.href="./auditUser.html";
                        },1000);
					}).catch((error) => {
                        loading.close();
                        if(error.response.data.status == '503') {
                            TipBoxService.open(error.response.data.exception, 2);
                        }
                    });
                });
			},
			//驳回按钮的点击事件
            rejectClickHandler(){
				console.info("驳回");
				var that=this;
                NoticeBoxService.open("确定要驳回此项申请吗？",function () {
                    NoticeBoxService.close();
                    aprovalBox.open("驳回原因",function (data) {
                        aprovalBox.close();
                        loading.open("正在提交数据，请稍候...");
                        var param=[{enterpriseId:that.basicInfoForm.ENTERPRISE_ID,userId:that.basicInfoForm.userId,auditinfo:data}];
                        HttpService.post('enterprise/reject','param='+encodeURIComponent(JSON.stringify(param)),function (data) {
                            loading.close();
                            TipBoxService.open("驳回成功！");
                            setTimeout(function () {
                                window.location.href="./auditUser.html";
                            },1000);

                        }).catch((error) => {
                            loading.close();
                            if(error.response.data.status == '503') {
                                TipBoxService.open(error.response.data.exception, 2);
                            }
                        });
                    });
                });
			},
			linkChangeHandler(link) {
				publicNavData.gotoLeftNavLink(link.link);
			}				
		}
	});
}
init();