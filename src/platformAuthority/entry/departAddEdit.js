/**
 * Created by yancan
 */
import '../css/departAddEdit.css'
import HttpService from '../../publicJs/ApiClient';
import Vue from 'vue';
import ElementUI from 'element-ui';

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
import commonBtn from '../components/CommonBtnControlComponent.vue'
Vue.use(ElementUI);

function init() {
	var paramId = ToolService.getQueryString('id');
	var tag = '';
	if(paramId==null){
		tag = '新建部门';
	}else{
		tag = '修改部门';
	}
    var vue=new Vue({
        el:'#departAddEdit',
        data:{
        	menuName:'部门管理',
        	//面包屑信息
            topNavData:{
                breadLinks:[{name:"权限管理",link:"#"},{name:"部门管理",link:"departManage.html"},{name:tag,link:"#"}],
                searchTitle:'部门名称'
            },
            leftNavData:[],
            publicTopNavData:[],
            //默认选中的tab
            activeTab:'basicInfo',
            //基础信息表单
            basicInfoForm:{
				id:'',
            	departmentName:'',  //部门名
            	parentDepart:'', //上级部门
            	pId:'',//父id
            	deptPhone:'',//部门电话
            	deptMail:'',//部门邮箱
            	remark:'',
           },
            //基础信息表单验证规则
            basicInfoRule:{
            	departmentName:[
            		{
            			required: true,
            			trigger: 'blur',
            			message:'请输入部门名称'
            		},
            		{ 
            			max: 15, 
            			message: '部门名称最长为15个字', 
            			trigger: 'blur'
            		}
            	],
            	parentDepart:[ 
            		{
            			required: true,
            			trigger: 'blur',
            			message:'请输入上级部门'
            		}
            	],
            	deptPhone:[
            	],
            	deptMail:[
            	],
            	remark:[
            	],

            },
            //角色信息
            roleData:[],
            multipleSelection:[],
            roleTransfer:{
                openNum:0,
                data:[],
                newData:[],
                multiselect:true,
                defaultProps: {
                    children: 'children',
                    label: 'roleName',
                }
            },
            departTransfer:{
            	openNum:0,
                data:[],
                newData:[],
                multiselect:false,
                defaultProps: {
                    children: 'children',
                    label: 'label'
                }
            },
            tableData:{
                departId:0,
                allSelected:false,
                bodyAllSelected:false,
                bodyData:[],
                renewNum:0,
                pageTotal:0,
                searchWord:'',
                hasPagination:false,
                getSelectNum:0
            },
            btnControlData:{},
        },
        components: {
            'public-header':header,
            'left-nav':leftNav,
            'right-top-nav':rightTopNav,
            'public-bottom':bottomComponent,
            'my-transfer':transfer,
            'my-component': commonTable,
            'btn-control':commonBtn,
        },
        mounted () {
         	this.getRoleTree();
         	this.getDepartTree();
            this.getBtnArr();
         	this.leftNavData=publicNavData.getLeftNavData("部门管理");
            var that=this;
            publicNavData.getTopNavData(function (data) {
                that.publicTopNavData=data;
            });
        },
        methods:{
        	//头部搜索
        	topNavSearchHandler:function(data){
                console.info("search=",data);
                window.location.href="departManage.html?word="+data;
           },
            selectParentDepart:function(){
            	var that = this;
            	if(this.basicInfoForm.pId!==''){
            		that.departTransfer.newData =[{id:this.basicInfoForm.pId,label:this.basicInfoForm.parentDepart}];
            	}else{
            		that.departTransfer.newData =[];
            	}
 				that.departTransfer.openNum++;
            },
            //若为修改时，查修改信息
            getUpdateInfo:function(){
            	var that =  this;
            	//根据id查部门信息
				HttpService.get('deptpriv/getDetail','param='+paramId,function(data){
					if(data.status=='200'){
						console.info("zzzzzzzzzzz");
						that.basicInfoForm.id = data.data.id;
						that.basicInfoForm.departmentName = data.data.deptName;
						//that.basicInfoForm.parentDepart = data.data.pid;
						that.basicInfoForm.pId = data.data.pid;
						that.basicInfoForm.deptPhone = data.data.deptPhone;
						that.basicInfoForm.deptMail = data.data.deptEmail;
						that.basicInfoForm.remark = data.data.remark;
						that.roleData = that.dataHandler(data.data.deptRole);
						var allDepart = that.departTransfer.data;
						that.getParentName(allDepart,that.basicInfoForm.pId);
					}
				})
            },
            //查父部门名称
            getParentName:function(data,pId){
            	for(var i=0;i<data.length;i++){
            		if(data[i].id == pId){
            			this.basicInfoForm.parentDepart = data[i].label;
            			break;
            		}else{
            			if(data[i].children){
            				this.getParentName(data[i].children,pId);
            			}
            		}
            	}
            },
            //获取角色树
            getRoleTree:function(){
            	var that = this;
            	HttpService.get('departrole/searchParam',{param:''},function(data){
						if(data.status=='200'){
							that.roleTransfer.data = data.data;
						}
					})
            },
            //获取部门树
            getDepartTree:function(){
            	var that = this;
            	HttpService.get('deptpriv/getDeptTreeNoOther',{param:''},function(data){
						if(data.status=='200'){
							that.departTransfer.data = data.data;
						}
						if(tag=='修改部门'){
			         		that.getUpdateInfo();
			         	}
					})
            },
            //保存基本信息
            saveBasicInfo:function(){
            	var aryRole = [];
				for(var i=0;i<this.roleData.length;i++){
					aryRole.push(this.roleData[i].roleId);
				}
				this.basicInfoForm.departmentName = ToolService.trimStr(this.basicInfoForm.departmentName );
				if(this.basicInfoForm.departmentName==''){
					TipBoxService.open("请输入部门名称",2);
					return false;
				}else{
					if(this.basicInfoForm.departmentName.length>15){
						TipBoxService.open("部门名称不可以超过15个字",2);
						return false;
					}
				}
				if(this.basicInfoForm.pId==''){
					TipBoxService.open("请选择上级部门",2);
					return false;
				}
				if(this.basicInfoForm.deptPhone!==''){
					if(!ToolService.regPhone(this.basicInfoForm.deptPhone)){
						TipBoxService.open("请输入正确的电话号码",2);
						return false;
					}
				}
				if(this.basicInfoForm.deptMail!==''){
					if(!ToolService.regMail(this.basicInfoForm.deptMail)){
						TipBoxService.open("请输入正确的邮箱",2);
						return false;
					}
				}
				if(this.basicInfoForm.remark!==''){
					if(this.basicInfoForm.remark.length>100){
						TipBoxService.open("备注不可超过100个字",2);
						return false;
					}
				}
            	var param = {
            		data:{
            			id:this.basicInfoForm.id,
            			deptName :this.basicInfoForm.departmentName,
            			deptPhone : this.basicInfoForm.deptPhone,
            			remark:this.basicInfoForm.remark,
            			pId:this.basicInfoForm.pId,
            			deptMail:this.basicInfoForm.deptMail,
            			deptRole:aryRole,
            		}
            	}
            	var strUrl = '';
            	if(tag=='新建部门'){
            		strUrl = 'deptpriv/saveDept';
            	}else{
            		strUrl = 'deptpriv/updateDept';
            	}
				HttpService.post(strUrl,'param='+JSON.stringify(param),function(data){
						if(data.status=='200'){
							TipBoxService.open("保存成功",0);
							setTimeout(function(){
								window.location.href="./departManage.html";
							},2*1000)
						}
					}).catch((error) => {
                        if(error.response.data.status=='503'){
                            TipBoxService.open(error.response.data.exception,2);
                        }
                    })

            },
            //取消基本信息
            cancelBasicInfo:function(){
            	window.location.href="./departManage.html";
            },
            //添加角色
            addRole:function(){
            	var that = this;
 				that.roleTransfer.newData = that.roleData;
 				that.roleTransfer.openNum++;
            },
            //删除角色
            deleteRole:function(){
            	var that= this;
				 that.tableData.getSelectNum++;
            },
            //角色列表多选
            handleSelectionChange(val) {
		        this.multipleSelection = val;
		    },
		    //角色穿梭框返回数据
		    RoleChangeHandler(data){
            	console.info("roleData=",data);
                this.roleData=this.dataHandler(data);
		    	//this.roleData = data;
                //this.tableData.bodyData=this.dataHandler(data);
		    },
		    linkChangeHandler(link){
                publicNavData.gotoLeftNavLink(link.link);
            },
		     //部门穿梭框返回数据
		    departChangeHandler(data){
		    	this.basicInfoForm.parentDepart = data[0].label;
		    	this.basicInfoForm.pId = data[0].id;
		    },


            getBtnArr(){
                var that=this;
                var menuId=publicNavData.getMenuId("部门管理");
                var btnObj={};
                HttpService.get('authmanage/getUserAllPriv',{menuId:menuId},function(data){
                    for(var i=0;i<data.data.length;i++){
                        var obj=data.data[i];
                        if(obj.title=="新建部门角色"){
                            btnObj.add={fn:that.addRole}
                        }
                        else if(obj.title=="删除部门角色"){
                            btnObj.remove={fn:that.deleteRole};
                        }

                    }
                    that.btnControlData=btnObj;
                });
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
            //删除角色
            getTableSelectDataHandler(data) {
                var that = this;
                if(data.length==0){
                    TipBoxService.open("请选择删除项！",2);
                }
                else{
                    NoticeBoxService.open("确定要删除所选角色吗？",function (){
                        var delRole = data;
                        var nowRoleData = [];
                        var roleData = that.roleData;
                        for(var i=0;i<roleData.length;i++){
                            var isPush = true;
                            for(var j=0;j<delRole.length;j++){
                                if(delRole[j].roleId==roleData[i].roleId){
                                    isPush = false;
                                }
                            }
                            if(isPush){
                                nowRoleData.push(roleData[i]);
                            }
                        }
                        that.roleData = nowRoleData;
                        NoticeBoxService.close();
                    });
                }
            },
            tableLinkHandler(data){
                var that=this;
                HttpService.get('userrole/searchDepart',data,function (data) {
                    console.info("jjjjjjj=",data);

                    if(data.data.userList!=null){

                        that.tableData.pageTotal=data.data.page.rowCount;
                        var bodyData=that.dataHandler(data.data.userList);

                        that.tableData.bodyData=bodyData;
                    }
                    else{
                        that.tableData.bodyData="error"+Math.random();
                    }
                });
            },
            dataHandler(dataList){
                for(var i=0;i<dataList.length;i++){
                    var obj=dataList[i];
                    var lineData=[
                        {img:true,imageClass:"accout",itemWidth:"5%"},
                        {text:true,itemWidth:"45%",textData:{
                            角色名称:obj.roleName,
                        }},
                        {
                            text:true,itemWidth:"45%",textData:{
                            备注:obj.remark,
                        }
                        },
                        {check:true,itemWidth:"5%",checkData:false}
                    ]
                    //var lineData=[{check:true,checkData:false},{link:false,text:true,name:obj.USERNAME},{text:true,name:obj.deptName.toString()},{text:true,name:obj.POSITION},{text:true,name:obj.PHONE},{text:true,name:obj.REMARK}];
                    //obj.lineData=lineData;
                    this.$set(obj,'lineData',lineData);
                }

                return dataList;
            },
            //全选
            headerCheckChangeHandler(data){
                console.info("clickselect=",this.tableData.allSelected);
                this.tableData.bodyAllSelected=this.tableData.allSelected+'/'+Math.random();
                //this.$set(this.tableData,'bodyAllSelected',this.tableData.allSelected);
            }
       },
        computed:{
        	//是否禁用部门角色nav
        	disableRole:function(){
        	    console.info("kdfjdjf=",this.basicInfoForm.departmentName==''||this.basicInfoForm.parentDepart==''||this.basicInfoForm.departmentName.length>15);
        		return this.basicInfoForm.departmentName==''|| this.basicInfoForm.departmentName.length>15;
        	}
        }
    });
}
init();

