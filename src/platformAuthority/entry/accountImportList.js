/**
 * yancan
 */
import Vue from 'vue';
import ElementUI from 'element-ui';
import leftNav from '../../publicComponent/publicLeftNavComponent.vue';
import header from '../../publicComponent/publicTopNavComponent.vue';
import bottomComponent from '../../publicComponent/publicBottomComponent.vue';
import rightTopNav from '../components/CommonRightTopNavComponent.vue'

import HttpService from '../../publicJs/ApiClient';
import TipBoxService from '../../publicJs/TipBoxService';
import NoticeBoxService from '../../publicJs/NoticeBoxService'
import commonTable from '../components/CommonTableComponent.vue';
import commonBtn from '../components/CommonBtnControlComponent.vue'
import LoadingService from '../../publicJs/LoadingBoxService';
import ToolService from '../publicJs/ToolService';
import publicNavData from '../publicJs/TransformLeftNavData';
import '../css/accountImport.css';
Vue.use(ElementUI);

function init() {
	var nameId = ToolService.getQueryString('name');
	var vue = new Vue({
		el: '#accountManage',
		components: {
			'left-nav': leftNav,
			'public-header': header,
			'public-bottom': bottomComponent,
			'right-top-nav': rightTopNav,
			'my-component': commonTable,
			'btn-control': commonBtn
		},
		data: {
			showBtn:false,
			menuName: '账户管理',
			listIdSize: '',
			xiuId: '', //修改保存
			dialogFormVisible: false,
			form: {
				userName: '', //姓名
				deptName: '', //部门
				position: '', //职位
				phone: '', //手机号码
				email: '', //邮箱
				phoneStatus: '', //手机状态
				id: '',
				delivery: false,
				type: [],
				resource: '',
				desc: '',
				deptId:''
			},
			rules: {
				userName: [{
					required: true,
					message: '请输入姓名',
					trigger: 'blur'
				}, {
					min: 2,
					max: 5,
					message: '长度在 2 到 5 个字符',
					trigger: 'blur'
				}],
				email: [{
					required: true,
					message: '请输入邮箱地址',
					trigger: 'blur'
				}, {
					type: 'email',
					message: '请输入正确的邮箱地址',
					trigger: 'blur'
				}],
				phone: [{
					required: true,
					message: '请输入手机',
					trigger: 'blur'
				}, {
					min: 11,
					max: 11,
					message: '请输入手机的正确格式',
					trigger: 'blur'
				}],
				position: [{
					required: true,
					message: '请输您的职位',
					trigger: 'blur'
				}, {
					min: 1,
					max: 10,
					message: '请输您的职位',
					trigger: 'blur'
				}],
				deptName: [{
					required: true,
					message: '请输您的部门',
					trigger: 'blur'
				}, {
					min: 1,
					max: 10,
					message: '请输您的部门',
					trigger: 'blur'
				}]
			},
			formLabelWidth: '120px',
			topNavData: {
				breadLinks: [{
					name: "权限管理",
					link: "#"
				}, {
					name: "账户管理",
					link: "#"
				}],
				searchTitle: '姓名/电话号',
				searchWord: ''
			},
			leftNavData: [],
			publicTopNavData: [],
			btnControlData: {},
			tableData: {
				departId: 0,
				allSelected: false,
				bodyAllSelected: false,
				bodyData: [],
				renewNum: 0,
				pageTotal: 0,
				searchWord: '',
				getSelectNum: 0,
				hasPagination: false,
				btnArr: []
			},
			btnSelectType: "no"
		},
		mounted() {

			var word = ToolService.getQueryString("word");
			this.getBtnArr();
			this.tableLinkHandler();
			this.leftNavData = publicNavData.getLeftNavData("账户管理");
            var that=this;
            publicNavData.getTopNavData(function (data) {
                that.publicTopNavData=data;
            });
			if(word != null) {
				this.topNavData.searchWord = word;
				this.tableData.departId = "noLink";
				this.tableData.searchWord = word;
			}
		},
		methods: {
			getBtnArr() {
				var that = this;
				var menuId = publicNavData.getMenuId("账户管理");
				var btnObj = {};
				that.tableData.btnArr.push({class:"edit",clickType:"editClik",title:"修改"});
                that.tableData.btnArr.push({class:"remove",clickType:"removeClik",title:"删除"});
                console.info("sadsa=",that.tableData.btnArr)
			},
			topNavSearchHandler(data) {
				console.info("search=", data);
				this.tableData.departId = "noLink";
				this.tableData.searchWord = data;
			},
			tableLinkHandler() {
				var that = this;
				HttpService.get('account/uploadView', 'id=' + nameId, function(data) {
					console.info("jjjjjjj=", data);
					that.tableData.bodyData = bodyData;
					if(data.data != null) {

						var bodyData = that.dataHandler(data.data);
						that.tableData.bodyData = bodyData;
					} else {
						that.tableData.bodyData = "error" + Math.random();
					}
				});
			},
			dataHandler(dataList) {
				var that = this;
				for(var i = 0; i < dataList.length; i++) {
					var obj = dataList[i];
					var lineData = [{
						img: true,
						imageClass: "accout",
						itemWidth: "5%"
					}, {
						text: true,
						itemWidth: "16%",
						textData: {
							姓名: obj.userName,
							手机号: obj.phone
						}
					}, {
						text: true,
						itemWidth: "18%",
						textData: {
							所属部门: obj.deptName,
							账号: obj.phone
						}
					}, {
						text: true,
						itemWidth: "15%",
						textData: {
							职位: obj.position,
							邮箱: obj.email
						}
					},
					{
						text: true,
						itemWidth: "18%",
						textData: {
							上传状态: obj.status,
							手机状态: obj.phoneStatus
						}
					}, 
					{
						text: true,
						itemWidth: "18%",
						textData: {
							部门状态: obj.departStatus,
						}
					},
					{
						btn: true,
						itemWidth: "10%",
						btnArr: that.tableData.btnArr
					}]
					obj.lineData = lineData;
				}
				return dataList;
			},
			nodeClickHandler(data) {
				//if(data.children==undefined || data.children.length==0){
				console.info("jjjjjj");
				this.tableData.departId = data.id;
				//this.tableData.departId='111';
				//}
			},
			tableBtnClickHandler(data) {
				var that = this;
				console.info("表单按钮点击=", data);
				var hrefStr = ''
				if(data.tableBtnType == "editClik") { //修改
					var sId = that.xiuId = data.id;
					that.dialogFormVisible = true;
					for(var i = 0; i < this.tableData.bodyData.length; i++) {
						if(sId == this.tableData.bodyData[i].id) {
							this.form.userName = this.tableData.bodyData[i].userName;
							this.form.deptName = this.tableData.bodyData[i].deptName;
							this.form.position = this.tableData.bodyData[i].position;
							this.form.phone = this.tableData.bodyData[i].phone;
							this.form.email = this.tableData.bodyData[i].email;
							this.form.phoneStatus = this.tableData.bodyData[i].phoneStatus;
						}
					}
				}
				if(data.tableBtnType == "removeClik") {
					//删除
					NoticeBoxService.open("确定要删除账户吗？",function () {
						NoticeBoxService.close();  						
						var sId = that.listIdSize = data.id;						
						var arr = [];		
						for(var i = 0; i < that.tableData.bodyData.length; i++) {
							if(sId != that.tableData.bodyData[i].id) {							
								arr.push(that.tableData.bodyData[i]);							
							}
						};						
						TipBoxService.open("删除成功！",0);
                      //删除以后在展示
					that.tableData.bodyData = that.dataHandler(arr);
                 })                   					
				}
			},
			phoneCheckHanlder(data) {
				var param = {
					param: this.form.phone
				};
				if(this.form.phone.length == 11) {
					HttpService.get('login/checkPhone', param, function(data) {
						if(data.exception == '') {
							TipBoxService.open("该手机号已被注册", 2);
							return false;
						}
					})
				}
				console.info("dfdfdf=", this.form.phone);
			},			
			deptIdCheckHanlder(data) {
				var deptName = {
					deptName: this.form.deptName
				};
				var that = this;
				HttpService.get('account/checkDepart', deptName, function(data) {
					console.info("jjjjjjj=", data);
					if(data.data.deptId == null) {
						TipBoxService.open("此部门格式错误", 2);
						return false;
					}else{
						that.form.deptId = data.data.deptId;
					}
					console.info("11111=", data.data.deptId);
				})
				console.info("dfdfdf=", this.form.deptName);
			},
			bumImport() {
				var hrefStr = "./accountImport.html";
				window.location.href = hrefStr;
			},
			tableLinkClickHandler(data) {
				console.info("表单链接点击=", data);
//				var hrefStr = 'accountAddEdit.html?id=' + data.id;
//				window.location.href = hrefStr;
			},
			linkChangeHandler(link) {
				console.info("link=", link);
				publicNavData.gotoLeftNavLink(link.link);
			},
			headerCheckChangeHandler(data) {
				console.info("clickselect=", this.tableData.allSelected);
				this.tableData.bodyAllSelected = this.tableData.allSelected + '/' + Math.random();
				//this.$set(this.tableData,'bodyAllSelected',this.tableData.allSelected);
			},
			//取消修改
			escList() {
				var that = this;
				that.dialogFormVisible = false;
			},
			//确定
			Determine(formName) {
				var param = {
					param: this.form.phone
				};
				var that = this;
					HttpService.get('login/checkPhone', param, function(data) {
						if(data.exception == '') {
							TipBoxService.open("该手机号已被注册", 2);
							return false;
						}else{
							that.$refs[formName].validate((valid) => {
						if(valid) {
							var arr = [];
							console.info('ttt',that.tableData.bodyData)
							for(var i = 0; i < that.tableData.bodyData.length; i++) {
	
								if(that.tableData.bodyData[i].id == that.xiuId) {
									that.tableData.bodyData[i].lineData[4].textData['手机状态'] = '未注册';
									that.tableData.bodyData[i].lineData[4].textData['上传状态'] = '';
									that.tableData.bodyData[i].lineData[5].textData['部门状态'] = '';
									that.tableData.bodyData[i].lineData[1].textData['姓名'] = that.form.userName;
									that.tableData.bodyData[i].lineData[1].textData['手机号'] = that.form.phone;
									that.tableData.bodyData[i].lineData[2].textData['所属部门'] = that.form.deptName;
									that.tableData.bodyData[i].lineData[2].textData['账号'] = that.form.phone;
									that.tableData.bodyData[i].lineData[3].textData['邮箱'] = that.form.email;
									that.tableData.bodyData[i].lineData[3].textData['职位'] = that.form.position;
									that.tableData.bodyData[i].userName = that.form.userName;
									that.tableData.bodyData[i].deptName = that.form.deptName;
									that.tableData.bodyData[i].position = that.form.position;	
									that.tableData.bodyData[i].phone = that.form.phone;
									that.tableData.bodyData[i].email = that.form.email;
									that.tableData.bodyData[i].deptId = that.form.deptId;
									that.tableData.bodyData[i].departStatus = '';
									that.tableData.bodyData[i].status = '';
									that.tableData.bodyData[i].phoneStatus = '未注册';
								}
							}
							that.dialogFormVisible = false;
						} else {
							return false;
						}
					});
						}
					});
					var deptName = {
						deptName: this.form.deptName
					};
					var that = this;
					HttpService.get('account/checkDepart', deptName, function(data) {
						console.info("jjjjjjj=", data);
						if(data.data.deptId == null) {
							TipBoxService.open("此部门格式错误", 2);
							return false;
						}else{
							that.form.deptId = data.data.deptId;
							that.$refs[formName].validate((valid) => {
						if(valid) {
							var arr = [];
							console.info('ttt',that.tableData.bodyData)
							for(var i = 0; i < that.tableData.bodyData.length; i++) {
	
								if(that.tableData.bodyData[i].id == that.xiuId) {
									that.tableData.bodyData[i].lineData[4].textData['手机状态'] = '未注册';
									that.tableData.bodyData[i].lineData[4].textData['上传状态'] = '';
									that.tableData.bodyData[i].lineData[5].textData['部门状态'] = '';
									that.tableData.bodyData[i].lineData[1].textData['姓名'] = that.form.userName;
									that.tableData.bodyData[i].lineData[1].textData['手机号'] = that.form.phone;
									that.tableData.bodyData[i].lineData[2].textData['所属部门'] = that.form.deptName;
									that.tableData.bodyData[i].lineData[2].textData['账号'] = that.form.phone;
									that.tableData.bodyData[i].lineData[3].textData['邮箱'] = that.form.email;
									that.tableData.bodyData[i].lineData[3].textData['职位'] = that.form.position;
									that.tableData.bodyData[i].userName = that.form.userName;
									that.tableData.bodyData[i].deptName = that.form.deptName;
									that.tableData.bodyData[i].position = that.form.position;	
									that.tableData.bodyData[i].phone = that.form.phone;
									that.tableData.bodyData[i].email = that.form.email;
									that.tableData.bodyData[i].deptId = that.form.deptId;
									that.tableData.bodyData[i].departStatus = '';
									that.tableData.bodyData[i].status = '';
									that.tableData.bodyData[i].phoneStatus = '未注册';
								}
							}
							that.dialogFormVisible = false;
						} else {
							return false;
						}
					});
						}
						
					})
				},
			//判断是否重复
			DetermineFle() {
					var that = this;
					var param = {
						data: that.tableData.bodyData
					}
					var clArr = [];
					var elArr = [];
					var flag = 1;
					console.info('aal', that.tableData.bodyData);					
					for(var i = 0; i < that.tableData.bodyData.length; i++) {
						if(that.tableData.bodyData[i].lineData[4].textData['手机状态'] == "已注册") {
							clArr.push(that.tableData.bodyData[i].phone);
							flag = 0;
	
						} else {
							elArr.push(that.tableData.bodyData[i].phone);
						}
					}
					if(flag == 0) {
						that.qcArr(clArr);
						if(that.qcArr(clArr).length != 0) {
							TipBoxService.open('用户已注册', 2)
						}
//						that.qcArr(clArr) + 
					} else {
						var asArr = [];
						var s = elArr.join(",") + ",";
						for(var i = 0; i < elArr.length; i++) {
							if(s.replace(elArr[i] + ",", "").indexOf(elArr[i] + ",") > -1) {
								asArr.push(elArr[i]);
							}
						}
						console.info('12132132', asArr);
						if(that.qcArr(asArr).length != 0) {
							TipBoxService.open('文件格式错误', 2)  //that.qcArr(asArr) + 
						} else {
							HttpService.post('account/uploaddb', 'param=' + JSON.stringify(param), function(data) {
								LoadingService.close();
								if(data.status == 200) {
									TipBoxService.open("导入成功！", 0);
									that.tableData.renewNum++;
									setTimeout(function() {
										window.location.href = "./accountManage.html";
									}, 2 * 1000)
								}								
							}).catch((error) => {
								if(error.response.data.status == '503') {
									TipBoxService.open(error.response.data.exception, 2);
								}
							})
						}
					}				
			},
			//取消导入
			cancelBasicInfo(){
            	window.location.href="accountImport.html";
           },
			qcArr(arr) {

				var res = [];
				var json = {};
				for(var i = 0; i < arr.length; i++) {
					if(!json[arr[i]]) {
						res.push(arr[i]);
						json[arr[i]] = 1;
					}
				}
				return res;
			}

		}
	})
}
init();