/**
 * yancan
 */
import Vue from 'vue';
import ElementUI from 'element-ui';
import leftNav from '../../publicComponent/publicLeftNavComponent.vue';
import header from '../../publicComponent/publicTopNavComponent.vue';
import bottomComponent from '../../publicComponent/publicBottomComponent.vue';
import rightTopNav from '../components/CommonRightTopNavComponent.vue'
import transfer from '../components/MyTransfer.vue';

import HttpService from '../../publicJs/ApiClient';
import TipBoxService from '../../publicJs/TipBoxService';
import NoticeBoxService from '../../publicJs/NoticeBoxService'
import commonTable from '../components/CommonTableComponent.vue';
import commonBtn from '../components/CommonBtnControlComponent.vue'
import LoadingService from '../../publicJs/LoadingBoxService';
import ToolService from '../publicJs/ToolService';
import publicNavData from '../publicJs/TransformLeftNavData';
import '../css/authorityRelation.css';
Vue.use(ElementUI);

function init(){
    //用户id
    var paramId = getQueryString('id');
    var departId = getQueryString('departId');
    var type = getQueryString('type');
    var activeName ='';
    var namec = '';
    if(type == 0 ){
        activeName = 'first';
        namec ="关联用户";

    }else if(type == 1){
        activeName = 'second';
        namec ="关联部门";
    }
	var vue=new Vue({
		el:'#authorityRelation',
		components: {
            'left-nav':leftNav,
            'public-header':header,
            'public-bottom':bottomComponent,
            'right-top-nav':rightTopNav,
            'my-component': commonTable,
            'btn-control':commonBtn,
            'my-transfer':transfer
        },
        data:{
        	menuName:'授权管理',
         	topNavData:{
                breadLinks:[{name:"权限管理",link:"#"},{name:"授权管理",link:"#"},{name:namec,link:"#"}],
                searchTitle:'姓名/电话号',
                searchWord:''
            },
            leftNavData:[],
            publicTopNavData:[],
            btnControlData:{},
            //默认选中的tab
            activeTab:activeName,
            tableData:{
                departId:0,
                allSelected:false,
                bodyAllSelected:false,
                bodyData:[],
                renewNum:0,
                pageTotal:0,
                searchWord:'',
                getSelectNum:0
            },
            tableDataBum:{
                departId:0,
                allSelected:false,
                bodyAllSelected:false,
                bodyData:[],
                renewNum:0,
                pageTotal:0,
                searchWord:'',
                getSelectNum:0
            },
            roleTransfer:{
                openNum:0,
                data:[],
                newData:[],
                multiselect:true,
                defaultProps: {
                    children: 'children',
                    label: 'name',
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
            btnSelectType:"no"
        },
        //改变值
        watch: {
            activeName: function (val) {
                if(this.activeName=='first'){
                    this.topNavData.breadLinks[2].name="关联用户";
                }else if(this.activeName=='second'){
                    this.topNavData.breadLinks[2].name="关联部门";
                }
            }
        },
        mounted(){
            this.link();
            this.linkBum();
            var word=ToolService.getQueryString("word");
            this.getBtnArr();
             this.tableData.departId=paramId;
            this.tableDataBum.departId=departId;
            this.leftNavData=publicNavData.getLeftNavData("授权管理");
            var that=this;
            publicNavData.getTopNavData(function (data) {
                that.publicTopNavData=data;
            });
            if(word!=null){
                this.topNavData.searchWord=word;
                this.tableData.departId="noLink";
                this.tableData.searchWord=word;
            }
        },
        methods:{
            link(){
                //console.info("jkjkjkj");
                var that=this;

                var that=this;
                HttpService.get('authmanage/getDeptTree',{param:paramId},function (data) {
                    console.info("树=",data);
                    that.roleTransfer.data=data.data;
                });
            },
            linkBum(){
                //console.info("jkjkjkj");
                var that=this;

                HttpService.get('deptpriv/getDeptTree',{param:departId},function (data) {
                    console.info("树=",data);
                    that.departTransfer.data=data.data;
                });
            },

            getBtnArr(){
                var that=this;
                var menuId=publicNavData.getMenuId("授权管理");
                var btnObj={};
                HttpService.get('authmanage/getUserAllPriv',{menuId:menuId},function(data){
                    console.info('asa=',data);
                    for(var i=0;i<data.data.length;i++){
                        var obj=data.data[i];
                        if(obj.title=="添加"){
                            btnObj.addd={fn:that.addBtnHandler}
                        }
                        else if(obj.title=="删除"){
                            btnObj.remove={fn:that.removeBtnHandler};
                        }                      
                    }
                    that.btnControlData=btnObj;
                });
            },
            getTableSelectDataHandlerBum(data) {
                console.info("删除部门",data);
                var that=this;
                if(data.length==0){
                    TipBoxService.open("请选择删除项！",2);
                }
                else{
                    NoticeBoxService.open("确定要删除账户吗？",function () {
                        NoticeBoxService.close();
                        LoadingService.open("正在删除，请稍候...");
                        var arr=new Array();
                        for(var i=0;i<data.length;i++){
                            var id=data[i].deptId;
                            arr.push(id);
                        }
                        var sendData={
                            param:arr.toString(),
                            roleId:departId.toString()
                        };

                        HttpService.get('authmanage/delDepart',sendData,function (data) {
                            console.info("删除=",data);
                            LoadingService.close();
                            if(data.status==200){
                                TipBoxService.open("删除成功！",0);
                                that.tableDataBum.renewNum++;
                                that.link();
                            }
                            else
                            {
                                TipBoxService.open("删除失败！",1);
                            }
                        });
                    });
                }
            },
            getTableSelectDataHandler(data) {
                console.info("删除角色=",data);
                var that=this;
                if(data.length==0){
                    TipBoxService.open("请选择删除项！",2);
                }
                else{
                    NoticeBoxService.open("确定要删除账户吗？",function () {
                        NoticeBoxService.close();
                        LoadingService.open("正在删除，请稍候...");
                        var arr=new Array();
                        for(var i=0;i<data.length;i++){
                            var id=data[i].USERID;
                            arr.push(id);
                        }
                        var sendData={
                            param:arr.toString(),
                            roleId:paramId.toString()
                        };

                        HttpService.get('userrole/deleteRoleUser',sendData,function (data) {
                            console.info("删除=",data);
                            LoadingService.close();
                            if(data.status==200){
                                TipBoxService.open("删除成功！",0);
                                that.tableData.renewNum++;
                                that.link();
                            }
                            else
                            {
                                TipBoxService.open("删除失败！",1);
                            }
                        });
                    });
                }
            },
        	topNavSearchHandler(data){
        		console.info("search=",data);
                this.tableData.departId="noLink";
                this.tableData.searchWord=data;
        	},
            addBtnHandler(){
                var that= this;

                if(that.activeTab == "first" ){
                    that.roleTransfer.newData = [];
                    that.roleTransfer.openNum++;

                }else if(that.activeTab == "second"){
                    that.departTransfer.newData = [];
                    that.departTransfer.openNum++;
                }

            },
            removeBtnHandler(){

                var that=this;
                if(that.activeTab == "first" ){
                    console.info("删除");
                    that.tableData.getSelectNum++;

                }else if(that.activeTab == "second"){
                    console.info("删除");
                    that.tableDataBum.getSelectNum++;
                }
            },
            resetPasswordHandler(){
                console.info("重置密码");
                var that=this;
                that.btnSelectType="reset";
                that.tableData.getSelectNum++;
            },
            sentMsgHandler(){
              console.info("发送密码")
            },
            exportHandler(){
               console.info("导出");
            },
            //角色穿梭框返回数据
            RoleChangeHandler(data){
                console.info("roleData=",data);
                this.roleData=this.dataHandler(data);
                var that = this;
                var dataArr=new Array();
                for(var i=0;i<data.length;i++){
                    var id=data[i].id;
                    dataArr.push(id);
                }

                LoadingService.open("正在保存，请稍候...");
                HttpService.get('authmanage/saveUser',{param:dataArr.toString(),roleId:paramId},function (data) {
                    LoadingService.close();
                    if(data.status==200){
                        TipBoxService.open("保存成功！",0);
                        that.tableData.renewNum++;
                        setTimeout(function(){
								window.location.href="authorityManage.html";
						},2*1000)
                    }
                    }).catch((error) => {
					if(error.response.data.status == '503') {
						LoadingService.close();
						TipBoxService.open(error.response.data.exception, 2);
					}
                })
            },
            //部门穿梭框返回数据
            departChangeHandler(data){
                console.info("roleData=",data);
                this.roleData=this.dataHandlerBum(data);
                var that = this;
                var dataArr=new Array();
                for(var i=0;i<data.length;i++){
                    var id=data[i].id;
                    dataArr.push(id);
                }

                LoadingService.open("正在保存，请稍候...");
                HttpService.get('authmanage/saveDepart',{param:dataArr.toString(),roleId:departId},function (data) {
                    LoadingService.close();
                    if(data.status==200){
                        TipBoxService.open("保存成功！",0);
                        that.tableDataBum.renewNum++;
                        setTimeout(function(){
								window.location.href="authorityManage.html";
						},2*1000)
                    }
                    }).catch((error) => {
					if(error.response.data.status == '503') {
						TipBoxService.open(error.response.data.exception, 2);
					}
                })
            },
            //查询部门
            tableLinkHandlerBum(data){

                console.info("表单发起的连接请求",data);
                var that=this;
                HttpService.get('authmanage/searchRelDepart',data,function (data) {
                    console.info("jjjjjjjbum=",data);
                    that.tableDataBum.bodyData=bodyData;
                    if(data.data.departList!=null){
                        that.tableDataBum.pageTotal=data.data.page.rowCount;
                        var bodyData=that.dataHandlerBum(data.data.departList);
                        that.tableDataBum.bodyData=bodyData;
                    }
                    else{
                        that.tableDataBum.bodyData="error"+Math.random();
                    }
                });
            },
            dataHandlerBum(dataList){
                for(var i=0;i<dataList.length;i++){
                    var obj=dataList[i];

                    //console.info("dkfjdkjfkdfjd=",obj.dept);
                    //var lineData=[{check:true,checkData:false},{link:true,text:true,name:obj.userName},{text:true,name:obj.phone},{text:true,name:obj.phone},{text:true,name:obj.position},{text:true,name:obj.mail},{text:true,name:obj.createTime}];
                    var departstr='';
                    var roleNamestr='';
                    if(obj.departmentName){
                        departstr=obj.departmentName.toString();
                    }

                    if(obj.roleName){
                        roleNamestr=obj.roleName.toString();
                    }
                    /*for(var j=0;j<obj.dept.length;j++){
                     departstr+=obj.dept[j];
                     }*/

                    var lineData=[
                        {img:true,imageClass:"accout",itemWidth:"5%"},
                        {text:true,itemWidth:"45%",textData:{
                            '部门名称':departstr,

                        }},
                        {
                            text:true,itemWidth:"45%",textData:{
                            '已关联的角色':obj.roleName
                        }
                        },
                        {check:true,itemWidth:"5%",checkData:false}
                    ]
                    obj.lineData=lineData;
                }
                return dataList;
            },
            //查询用户
            tableLinkHandler(data){
                console.info("表单发起的连接请求",data);
                var that=this;
                HttpService.get('authmanage/searchUser',data,function (data) {
                    console.info("jjjjjjj=",data);
                    that.tableData.bodyData=bodyData;
                    if(data.data.authList!=null){
                        that.tableData.pageTotal=data.data.page.rowCount;
                        var bodyData=that.dataHandler(data.data.authList);
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

                    //console.info("dkfjdkjfkdfjd=",obj.dept);
                    //var lineData=[{check:true,checkData:false},{link:true,text:true,name:obj.userName},{text:true,name:obj.phone},{text:true,name:obj.phone},{text:true,name:obj.position},{text:true,name:obj.mail},{text:true,name:obj.createTime}];
                    var departstr='';
                    var roleNamestr='';
                    if(obj.dept){
                        departstr=obj.dept.toString();
                    }

                    if(obj.roleName){
                        roleNamestr=obj.roleName.toString();
                    }
                    /*for(var j=0;j<obj.dept.length;j++){
                        departstr+=obj.dept[j];
                    }*/

                    var lineData=[
                        {img:true,imageClass:"accout",itemWidth:"5%"},
                        {text:true,itemWidth:"30%",textData:{
                            '姓名':obj.USERNAME,
                            '手机':obj.PHONE,
                        }},
                        {
                            text:true,itemWidth:"30%",textData:{
                            '所属部门':departstr,

                        }
                        },
                        {
                            text:true,itemWidth:"30%",textData:{
                            '已关联的角色':roleNamestr
                        }
                        },
                        {check:true,itemWidth:"5%",checkData:false}
                    ]
                    obj.lineData=lineData;
                }
                return dataList;
            },
            nodeClickHandler(data){
                //if(data.children==undefined || data.children.length==0){
                console.info("jjjjjj");
                this.tableData.departId=data.id;
                //this.tableData.departId='111';
                //}
            },
            bumImport(){
                var hrefStr="./accountImport.html";
                window.location.href=hrefStr;
            },
            tableLinkClickHandler(data){
                console.info("表单链接点击=",data);

            },
            linkChangeHandler(link){
               console.info("link=",link);
                publicNavData.gotoLeftNavLink(link.link);
            },
            allCheckChangeHandler(data){
                console.info('选择个人',data);
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
            allCheckChangeHandlerBum(data){
                console.info('选择bum',data);
                if(data.allData==true){
                    if(data.select==true){
                        this.tableDataBum.allSelected=true;
                    }
                    else{
                        this.tableDataBum.allSelected=false;
                    }
                }
                else {
                    this.tableDataBum.allSelected=false;
                }

            },
            headerCheckChangeHandler(data){
                console.info("clickselect=",this.tableData.allSelected);
                this.tableData.bodyAllSelected=this.tableData.allSelected+'/'+Math.random();
                //this.$set(this.tableData,'bodyAllSelected',this.tableData.allSelected);
            },
            headerCheckChangeHandlerDepart(data){
                console.info("clickselect=",this.tableData.allSelected);
                this.tableDataBum.bodyAllSelected=this.tableDataBum.allSelected+'/'+Math.random();
                //this.$set(this.tableData,'bodyAllSelected',this.tableData.allSelected);
            }
        }
	})
}
init();
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}