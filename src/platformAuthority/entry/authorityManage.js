/**
 * Created by dell on 2017/9/1.
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
Vue.use(ElementUI);

function init(){
    var vue=new Vue({
        el:'#authorityManage',
        components: {
            'left-nav':leftNav,
            'public-header':header,
            'public-bottom':bottomComponent,
            'right-top-nav':rightTopNav,
            'my-component': commonTable,
            'btn-control':commonBtn
        },
        data:{
        	menuName:'授权管理',
            topNavData:{
                breadLinks:[{name:"权限管理"},{name:"授权管理",link:"#"}],
                searchTitle:'角色名称',
                searchWord:''
            },
            leftNavData:[],
            publicTopNavData:[],
            btnControlData:{},
            tableData:{
                getSelectNum:0,
                departId:0,
                allSelected:false,
                bodyAllSelected:false,
                bodyData:[],
                renewNum:0,
                pageTotal:0,
                searchWord:'',
                btnArr:[],
                hasPagination:true
            },
            treeData:{
                data: [],
                clickNode:false,
                defaultProps: {
                    children: 'children',
                    label: 'roleName'
                }
            },

        },
        mounted(){
            this.link();
            var word=ToolService.getQueryString("word");
            this.getBtnArr();
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
                HttpService.get('departrole/searchParam',{param:''},function (data) {
                    console.info("树=",data);
                    that.treeData.data=data.data;
                });
            },
            getBtnArr(){
                var that=this;
                var menuId=publicNavData.getMenuId("授权管理");
                var btnObj={};
                HttpService.get('authmanage/getUserAllPriv',{menuId:menuId},function(data){
                    for(var i=0;i<data.data.length;i++){
                        var obj=data.data[i];
                        if(obj.title=="新建"){
                            btnObj.add={fn:that.addBtnHandler}
                        }
                        else if(obj.title=="删除"){
                            btnObj.remove={fn:that.removeBtnHandler};
                        }
                        else if(obj.title=="导入"){
                            btnObj.export={fn:that.bumImport};
                        }
                        else if(obj.title=="导出"){
                            btnObj.export={fn:that.exportHandler};
                        }
                        else if(obj.title=="发送短信"){
                            btnObj.sentMsg={fn:that.sentMsgHandler};
                        }
                        else if(obj.title=="重置密码"){
                            btnObj.resetPassword={fn:that.resetPasswordHandler};
                        }
                        else if(obj.title=="关联用户"){
                            that.tableData.btnArr.push({class:"associatedUsers",clickType:"user",title:"关联用户"});
                        }
                        else if(obj.title=="权限分配"){
                            that.tableData.btnArr.push({class:"authorityAssignment",clickType:"authority",title:"权限分配"});
                        }
                        else if(obj.title=="关联部门"){
                            that.tableData.btnArr.push({class:"relatedDepartment",clickType:"depart",title:"关联部门"});
                        }
                    }
                    that.btnControlData=btnObj;
                });
            },
            getTableSelectDataHandler(data) {
                console.info("selectData=",data);
                var that=this;
                if(data.length==0){
                    TipBoxService.open("请选择删除项！",2);
                }
                else{
                    NoticeBoxService.open("确定要删除该角色吗？",function () {
                        NoticeBoxService.close();
                        LoadingService.open("正在删除，请稍候...");
                        var arr=new Array();
                        for(var i=0;i<data.length;i++){
                            var id=data[i].ROLEID;
                            arr.push(id);
                        }
                        var sendData={param:arr.toString()};
                        HttpService.get('authmanage/batchDeleteRole',sendData,function (data) {
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
                console.info("新建");
                /*var that=this;
                for(var i=0;i<that.tableData.bodyData.length;i++){
                    if(i%2==0){
                        var lineData=that.tableData.bodyData[i].lineData;

                        lineData[0].checkData=true;
                    }
                }*/
                window.location.href='./authorityRole.html';
            },
            removeBtnHandler(){
                console.info("删除");
                var that=this;
                that.tableData.getSelectNum++;
            },
            searchTableDataHandler(data){
                console.info("表单发起模糊查询",data);
                var that=this;
                HttpService.get('authmanage/searchAuthName',data,function (data) {
                    if(data.data.authList!=null && data.data.authList.length){
                        that.tableData.pageTotal=data.data.page.rowCount;
                        var bodyData=that.dataHandler(data.data.authList);
                        that.tableData.bodyData=bodyData;
                    }
                    else{
                        that.tableData.bodyData="error"+Math.random();
                    }
                });
            },
            tableLinkHandler(data){
                console.info("表单发起的连接请求",data);
                var that=this;
                HttpService.get('authmanage/searchAuth',data,function (data) {
                    if(data.data.authList!=null && data.data.authList.length){
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
                var that=this;
                for(var i=0;i<dataList.length;i++){
                    var obj=dataList[i];
                    /*var lineData=[{check:true,checkData:false},{link:true,text:true,name:obj.ROLE_NAME},{text:true,name:obj.parentrole},
                        {text:true,name:obj.ROLE_REMARK},{authorityBtn:true,userBtn:true,departBtn:true}];*/
                    var lineData=[
                        {img:true,imageClass:"accout",itemWidth:"8%"},
                        {text:true,itemWidth:"30%",textData:{
                            角色名称:obj.ROLE_NAME,
                            上级角色:obj.parentrole,
                        }},
                        {
                            text:true,itemWidth:"27%",mLine:true,textData:{
                            备注:obj.ROLE_REMARK,
                        }
                        },
                        {
                            btn:true,itemWidth:"30%",btnArr:that.tableData.btnArr
                        },
                        {check:true,itemWidth:"5%",checkData:false}
                    ]
                    obj.lineData=lineData;
                    //obj.notClick=true;
                }
                return dataList;
            },
            nodeClickHandler(data){
                //if(data.children==undefined || data.children.length==0){
                this.tableData.searchWord="noLink";
                this.tableData.departId=data.roleId;
                //}
            },
            tableLinkClickHandler(data){
                console.info("表单链接点击=",data);
                var hrefStr='./authorityRole.html?id='+data.ROLEID;
                window.location.href=hrefStr;
            },
            getTableBtn(){

            },
            tableBtnClickHandler(data){
                console.info("表单按钮点击=",data);
                var hrefStr=''
                if(data.tableBtnType=="authority"){//权限分配
                    hrefStr='./authorityRole.html?id='+data.ROLEID+'&type=1';
                }
                else if(data.tableBtnType=="user"){//关联用户
                    hrefStr='./authorityRelation.html?id='+data.ROLEID+'&departId='+this.tableData.departId+'&type=0';
                }
                else if(data.tableBtnType=="depart"){//关联部门
                    hrefStr='./authorityRelation.html?id='+data.ROLEID+'&departId='+this.tableData.departId+'&type=1';
                }
                window.location.href=hrefStr;
            },
            //当表单选择check按钮时触发的事件
            tableSelectChangeHandler(data){
                console.info("当表单选择check按钮时触发的事件",data);
            },
            linkChangeHandler(link){
                console.info("link=",link);
                publicNavData.gotoLeftNavLink(link.link);
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
            headerCheckChangeHandler(data){
                console.info("clickselect=",this.tableData.allSelected);
                this.tableData.bodyAllSelected=this.tableData.allSelected+'/'+Math.random();
                //this.$set(this.tableData,'bodyAllSelected',this.tableData.allSelected);
            }
        },

    })
}
init();