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
import loadingService from '../../publicJs/LoadingBoxService';
import TipBoxService from '../../publicJs/TipBoxService';
import NoticeBoxService from '../../publicJs/NoticeBoxService';
import publicNavData from '../publicJs/TransformLeftNavData';
import ToolService from '../publicJs/ToolService';
import aprovalBox from  '../publicJs/ApprolBox';
import '../css/auditEnterpriseDetail.css';
Vue.use(ElementUI);

function init() {
	var vue = new Vue({
		el: '#enterpriseInformation',
		data: {
			menuName: '创建企业',
			//面包屑信息
			topNavData: {
				breadLinks: [{
					name: "企业用户审核",
					link: "#"
				}, {
					name: "企业用户详情",
					link: "#"
				}],
			},
			leftNavData: [],
			publicTopNavData: [],
			userData:{
                USERNAME:'',
                USER_CARD:'',
                ENTERPRISE_NAME:'',
                BLREGISTNUM:"",
                ID_CARD_SCAN_FRONT:"",
                ID_CARD_SCAN_BACK:"",
                LEGAL_DELEGATE:"",
                LEGAL_DELEGATE_ID:"",
                CITY:"",
                DETAILED_ADDRESS:"",
                BLSCANCOPY:"",
				id:""
			}

		},
		components: {
			'left-nav': leftNav,
			'public-header': header,
			'public-bottom': bottomComponent,
			'right-top-nav': rightTopNav,
		},
		mounted() {
			this.leftNavData = publicNavData.getLeftNavData("审批企业");
            var that=this;
            publicNavData.getTopNavData(function (data) {
                that.publicTopNavData=data;
            });
			this.getData(ToolService.getQueryString("id"));
		},
		methods: {
			topNavSearchHandler: function(data) {
				console.info("search=", data);
				window.location.href = "createEnterprise.html?word=" + data;
			},
			getData(id){
				var that=this;
                HttpService.get('enterprise/searchApprovalDetails',{param:id},function (data) {
					that.userData.USERNAME=data.data[0].USERNAME=="null"?"":data.data[0].USERNAME;
                    that.userData.USER_CARD=data.data[0].USER_CARD=="null"?"":data.data[0].USER_CARD;
                    that.userData.ENTERPRISE_NAME=data.data[0].ENTERPRISE_NAME=="null"?"":data.data[0].ENTERPRISE_NAME;
                    that.userData.BLREGISTNUM=data.data[0].BLREGISTNUM=="null"?"":data.data[0].BLREGISTNUM;
                    that.userData.ID_CARD_SCAN_FRONT=data.data[0].ID_CARD_SCAN_FRONT=="null"?"":HttpService.apiBaseUrl+data.data[0].ID_CARD_SCAN_FRONT;
                    that.userData.ID_CARD_SCAN_BACK=data.data[0].ID_CARD_SCAN_BACK=="null"?"":HttpService.apiBaseUrl+data.data[0].ID_CARD_SCAN_BACK;
                    that.userData.LEGAL_DELEGATE=data.data[0].LEGAL_DELEGATE=="null"?"":data.data[0].LEGAL_DELEGATE;
                    that.userData.LEGAL_DELEGATE_ID=data.data[0].LEGAL_DELEGATE_ID=="null"?"":data.data[0].LEGAL_DELEGATE_ID;
                    that.userData.CITY=data.data[0].CITY=="null"?"":data.data[0].CITY;
                    that.userData.DETAILED_ADDRESS=data.data[0].DETAILED_ADDRESS=="null"?"":data.data[0].DETAILED_ADDRESS;
                    that.userData.BLSCANCOPY=data.data[0].BLSCANCOPY=="null"?"":HttpService.apiBaseUrl+data.data[0].BLSCANCOPY;
                    that.userData.id=data.data[0].ID=="null"?"":data.data[0].ID;
                    that.userData.userId=data.data[0].USERID=="null"?"":data.data[0].USERID;
                })
			},
            //左侧菜单点击事件
            linkChangeHandler(link){
                console.info("link=",link);
                publicNavData.gotoLeftNavLink(link.link);
            },
			//通过按钮的点击事件
			passClickHandler(){
				console.info("通过");
				var that=this;
                NoticeBoxService.open("确定要通过此项申请吗？",function () {
                	NoticeBoxService.close();
                    loadingService.open("正在发送请求，请稍候...");
                	var param={enterpriseId:that.userData.id,userId:that.userData.userId};
					HttpService.post('enterprise/approveEnterprise','param='+encodeURIComponent(JSON.stringify(param)),function (data) {
						loadingService.close();
						if(data.status==200){
							TipBoxService.open("审批通过,请前往权限管理进行授权");
							setTimeout(function () {
                                window.location.href='./auditEnterprise.html';
                            },1000);
						}
						console.info("data=",data);
					}).catch((error) => {
						loadingService.close();
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
                        var param={enterpriseId:that.userData.id,userId:that.userData.userId,auditinfo:data};
                        aprovalBox.close();
                        loadingService.open("正在发送请求，请稍候...");
                        HttpService.post('enterprise/rejectEnterprise','param='+encodeURIComponent(JSON.stringify(param)),function (data) {
                            loadingService.close();
                            if(data.status==200){
                            	TipBoxService.open("驳回通过");
                                setTimeout(function () {
                                    window.location.href='./auditEnterprise.html';
                                },1000);
							}
                            console.info("data=",data);
                        }).catch((error) => {
                            loadingService.close();
                            if(error.response.data.status == '503') {
                                TipBoxService.open(error.response.data.exception, 2);
                            }
                        });;
                    });
                });
			},
            lookBigImg(url){
                window.open(url);
			}
		}
	});
}
init();