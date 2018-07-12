/**
 * Created by dell on 2017/8/25.
 */
import Vue from 'vue';
import ElementUI from 'element-ui';

Vue.use(ElementUI)
import leftNav from '../../publicComponent/publicLeftNavComponent.vue';
import header from '../../publicComponent/publicTopNavComponent.vue';
import bottomComponent from '../../publicComponent/publicBottomComponent.vue';
import rightTopNav from '../components/CommonRightTopNavComponent.vue';

import HttpService from '../../publicJs/ApiClient';
import TipBoxService from '../../publicJs/TipBoxService';
import NoticeBoxService from '../../publicJs/NoticeBoxService'
import commonTable from '../components/CommonTableComponent.vue';
import transfer from '../components/MyTransfer.vue';
import LoadingService from '../../publicJs/LoadingBoxService';
import publicNavData from '../publicJs/TransformLeftNavData';
import ToolService from '../publicJs/ToolService';
import '../css/authorityRole.css';

function init() {
	var paramId = ToolService.getQueryString('id');
	var type = ToolService.getQueryString('type');
	var tag = '';
	var navSelect = '';
	if(paramId==null){
		tag = '新建角色';
	}else{
		tag = '修改角色';
	}
	if(type ==null){
		navSelect = 'first';
	}else{
		navSelect = 'second';
	}
    var vue=new Vue({
        el:'#tableTest',
        components: {
            'left-nav':leftNav,
            'public-header':header,
            'public-bottom':bottomComponent,
            'right-top-nav':rightTopNav,
            'my-component': commonTable,
            'my-transfer':transfer
        },
        data:{
        	menuName:'权限管理',
            activeName: navSelect,
            topNavData:{
                breadLinks:[{name:"权限管理",link:"#"},{name:"授权管理",link:"authorityManage.html"},{name:tag,link:"#"}],
                searchTitle:'角色名称'
            },
            labelPosition: 'right',
            leftNavData:[],
            publicTopNavData:[],
            lidata:[
				    {index:0,name:'平台管理',value:'Platform'},
				    {index:1,name:'服务管理',value:'ServiceManger'},
				    {index:2,name:'资源目录',value:'ResourceCatalog'},
				    {index:3,name:'应用市场',value:'AppMarket'},
				    {index:4,name:'智能上报',value:'ReportUpload'}				    
			],
			isActive:0,
            //基本信息
            basicInfoForm: {
                id:'',
                pId:'',//父id
                roleName:'',//角色名
                pIdRoleName:'',//上级角色
                remark:'',//备注
                menuArray:[],
            },
            //基础信息表单验证规则
            basicInfoRule:{
            	roleName:[
            		{
            			required: true,
            			trigger: 'blur',
            			message:'请输入角色名称'
            		},
            	],
            	pIdRoleName:[
            		{
            			required: true,
            			trigger: 'blur',
            			message:'请选择上级角色'
            		},
            	],
            	remark:[
            	]
            },
            //角色穿梭框
            roleData:[],
            multipleSelection:[],
            roleTransfer:{
                openNum:0,
                data:[],
                newData:[],
                multiselect:false,
                defaultProps: {
                    children: 'children',
                    label: 'roleName',
                }
            },           
            //权限树
            authTree:{
                data:[],
                defaultProps: {
                    children: 'children',
                    label: 'menuName',
                },
            },
            //权限树当前所选节点
            authTreeSelect:{},
            //权限点表格数据
            authPointData:[],

            tableData:{
                getSelectNum:0,
                departId:0,
                headerData:[{check:true,checkData:false},{name:'模块名称'},{name:'流程展示'}],
                bodyData:[],
                renewNum:0,
                pageTotal:0,
                searchWord:'',
                hasPagination:false
            },
        },
        mounted () {
         	this.getRoleTree();
         	this.getAuthTree();
			this.leftNavData=publicNavData.getLeftNavData("权限管理");
            var that=this;
            publicNavData.getTopNavData(function (data) {
                that.publicTopNavData=data;
            });
            var id=ToolService.getQueryString("id");
        },
        methods:{
        	//获取角色树
            getRoleTree(){
                var that=this;
                HttpService.get('departrole/searchParam','param=',function(data){
                	console.info("qqqqqq=",data)
					if(data.status=='200'){
						that.roleTransfer.data = data.data;
						that.getAuthTree();
					}
				})
            },
            //点击应用事件
            clickAll(index){           	
            	var that=this;
            	that.tableData.bodyData=[];
            	var value=that.lidata[index].value;
            	var param={param:value};
            	that.isActive=index;
                HttpService.get('authmanage/getFullMenuTree',param,function(data){
					if(data.status=='200'){
						that.authTree.data = data.data;
						if(tag=='修改角色'){
			         		that.getRoleInfo();
			         	}
					}
				})
            },
            //获取权限树
            getAuthTree(){
            	var that=this;
                HttpService.get('authmanage/getFullMenuTree','',function(data){
					if(data.status=='200'){
						that.authTree.data = data.data;
						if(tag=='修改角色'){
			         		that.getRoleInfo();
			         	}
					}
				})
            },
            topNavSearchHandler:function(data){
                console.info("search=",data);
                window.location.href="authorityManage.html?word="+data;
            },
            //选择上级角色
            selectParentRole(){
 				var that = this;
            	if(that.basicInfoForm.pId!==''){
            		that.roleTransfer.newData = [{id:that.basicInfoForm.pId,roleName:that.basicInfoForm.pIdRoleName}];
            	}else{
            		that.roleTransfer.newData = [];
            	}
 				
 				that.roleTransfer.openNum++;
            },
            //角色穿梭框保存
            RoleChangeHandler(data){
            	if(data[0].roleId==this.basicInfoForm.roleId ){
            		TipBoxService.open("上级角色不可选择自身角色！",2);
            		this.roleTransfer.newData = [];
 					this.roleTransfer.openNum++;
            	}else{
            		this.basicInfoForm.pId = data[0].roleId;
            		this.basicInfoForm.pIdRoleName = data[0].roleName;
            	}
            },
            //权限树点击事件
            authTreeClick(data){
            	var that = this;
            	that.authTreeSelect = data;
				//查已勾选信息
				var allMenu =  that.basicInfoForm.menuArray;
				var thisMenu = {};
				for(var i=0;i<allMenu.length;i++){
					if(allMenu[i].menuId==that.authTreeSelect.id){
						thisMenu = allMenu[i];
					}
				}
				//若该节点存在勾选信息
				var showData = that.dataHandler(that.authTreeSelect.privArray);
				if(thisMenu.privArray){
					var defaultSelect = [];
					for(var i=0;i<thisMenu.privArray.length;i++){
	            		for(var j=0;j<showData.length;j++){
	            			if(thisMenu.privArray[i].pressId==showData[j].id){
	            				showData[j].lineData[0].checkData = true;
	            			}
	            		}
					}
				}
				//展示信息
			    console.info("点击showData=",showData);
			    that.authPointData = showData;
                that.tableData.bodyData=showData;
            },
            //权限树勾选
            nodeClickHandler(data,select,children){
            	//选中
            	if(select){
            		var isPush = true;
            		var preMenuArray = this.basicInfoForm.menuArray;
            		for(var i=0;i<preMenuArray.length;i++){
            			if(preMenuArray[i].menuId==data.id){
            				isPush = false;
            			}
            		}
            		if(isPush){
            			var privArray = [];
	            		var authPointer = data.privArray;
	            		for(var i=0;i<authPointer.length;i++){
	            			privArray.push({
	            				pressId:authPointer[i].id,
	            			})
	            		}
	            		this.basicInfoForm.menuArray.push({
	            			menuId:data.id,
	            			privArray:privArray,
	            		})
            		}
            	}else{   //取消选中则在数据里删
            		var menuArray  = [];
            		var preMenuArray = this.basicInfoForm.menuArray;
            		for(var i=0;i<preMenuArray.length;i++){
            			if(preMenuArray[i].menuId!=data.id){
            				menuArray.push(preMenuArray[i])
            			}
            		}
            		this.basicInfoForm.menuArray = menuArray;
            	}
            	//若右侧功能点为该节点的信息  则进行操作
            	if(data.id==this.authTreeSelect.id){
            		for(var i=0;i<this.tableData.bodyData.length;i++){
            			var preAllMenu = this.basicInfoForm.menuArray;
            			var preSelect = [];
            			for(var j=0;j<preAllMenu.length;j++){
            				if(preAllMenu[j].menuId==data.id){
            					preSelect = preAllMenu[j].privArray;
            				}
            			}
            			var check = false;
            			for(var j=0;j<preSelect.length;j++){
            				if(this.tableData.bodyData[i].id==preSelect[j].pressId){
            					check = true;
            				}
            			}
            			console.info("勾选showData=",this.tableData.bodyData);
            			this.tableData.bodyData[i].lineData[0].checkData = check;
            		}
            	}
            },
            //查询角色信息
            getRoleInfo(){
            	var that =  this;
            	//根据id查部门信息
				HttpService.get('authmanage/getDetail','param='+paramId,function(data){
					console.info("zzzz=",data)
					that.basicInfoForm = data.data;
					var treeChecked = [];
					for(var i=0;i<that.basicInfoForm.menuArray.length;i++){
						treeChecked.push(that.basicInfoForm.menuArray[i].menuId);
					}
					that.$refs.roleTree.setCheckedKeys(treeChecked);					
				})
            },
            //查父部门名称
            getParentName:function(data,pId){
            	for(var i=0;i<data.length;i++){
            		if(data[i].id == pId){
            			this.basicInfoForm.pIdRoleName = data[i].label;
            			break;
            		}else{
            			if(data[i].children){
            				this.getParentName(data[i].children,pId);
            			}
            		}
            	}
            },
            //功能点勾选事件  全部勾选时 自动勾上右侧树中对应节点
           	tableSelectChangeHandler(data){
            	var nowData = this.basicInfoForm.menuArray;
        		var thisData ;
        		for(var i=0;i<nowData.length;i++){
        			if(nowData[i].menuId==this.authTreeSelect.id){
        				thisData = nowData[i];
        			}
        		}
        		var aryId = [];
        		for(var i =0; i<data.length;i++){
        			aryId.push({
        				pressId:data[i].id
        			})
        		}
        		if(thisData){
        			thisData.privArray = aryId;
        		}else{
        			if(aryId.length>0){
        				this.basicInfoForm.menuArray.push({
	            			menuId:this.authTreeSelect.id,
	            			privArray:aryId,
	            		})
        			}
        		}
        		if(data.length>0){
            		this.$refs.roleTree.setChecked(this.authTreeSelect.id,true,true);
            	}
        		else if(data.length==0){
            		this.$refs.roleTree.setChecked(this.authTreeSelect.id,false,true);
            	}
           	},
            searchTableDataHandler(data){
            	
            },
            //搜索
            topNavSearchHandler:function(data){
                console.info("search=",data);
                window.location.href="authorityManage.html?word="+data;
            },
            //获取勾选项
            getTableSelectDataHandler(data){
            },
            //查找表单数据
            tableLinkHandler(data){
				
            },
            dataHandler(dataList){
            	var that=this;
                for(var i=0;i<dataList.length;i++){
                    var obj=dataList[i];
                    var lineData=[
                    	{check:true,itemWidth:"5%",checkData:false},
//                      {img:true,imageClass:"accout",itemWidth:"5%"},
                        {text:true,itemWidth:"45%",textData:{
            				 权限:obj.title,
                        }},
                        {
                            text:true,itemWidth:"45%",textData:{
                           	备注:obj.flow,
                        }
                        }
                    ]
//                  var lineData=[{check:true,checkData:false},{text:true,name:obj.title},{text:true,name:obj.flow}];
                    //obj.lineData=lineData;
                     that.$set(obj,'lineData',lineData);
                }
                return dataList;
            },
            //保存
            saveBasicInfo(){
            	this.basicInfoForm.roleName = ToolService.trimStr(this.basicInfoForm.roleName );
            	if(this.basicInfoForm.roleName==''){
					TipBoxService.open("请输入角色名称",2);
					return false;
				}else{
					if(this.basicInfoForm.roleName.length>20){
						TipBoxService.open("角色名称不可超过20个字",2);
						return false;
					}
				}
//				if(this.basicInfoForm.pIdRoleName==''){
//					TipBoxService.open("请选择上级角色",2);
//					return false;
//				}
				if(this.basicInfoForm.remark!==''){
					if(this.basicInfoForm.remark.length>100){
						TipBoxService.open("备注不可超过100个字",2);
						return false;
					}
				}
				var param = {
					data:this.basicInfoForm,
				}
				var strUrl = '';
				if(tag=='新建角色'){
            		strUrl = 'authmanage/saveRole';
            	}else{
            		strUrl = 'authmanage/updateRole';
            	}
            	HttpService.post(strUrl,'param='+JSON.stringify(param),function(data){
            		console.info('xsxs',);
                    if(data.status=='503'){
                        TipBoxService.open(data.exception,2);
                        return false;
                    }
					if(data.status=='200'){
						TipBoxService.open("保存成功",0);
						setTimeout(function(){
						   window.location.href="authorityManage.html";
							},2*1000)
					}
				})
            },
            allCheckChangeHandler(data){
                if(data.allData==true){
                    if(data.select==true){
                        this.tableData.allSelected=true;
                    }
                    else{
                        this.tableData.allSelected=false;
                    }
                }
                else {
                    this.tableData.allSelected=false;
                }

            },
            tableLinkClickHandler(data){
                console.info("表单链接点击=",data);
                var hrefStr='./departAddEdit.html?id='+data.ID;
                window.location.href=hrefStr;
            },
            linkChangeHandler(link){
                console.info("link=",link);
                publicNavData.gotoLeftNavLink(link.link);
            },
            cancelBasicInfo(){
            	window.location.href="authorityManage.html";
            }
       },
       computed:{
        	//是否禁用配置管理nav
        	disableRole:function(){
        		return this.basicInfoForm.roleName==''|| this.basicInfoForm.roleName.length>20;
        	}
        }
    });
}
init();