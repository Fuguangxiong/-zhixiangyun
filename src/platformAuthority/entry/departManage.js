/**
 * Created by dell on 2017/8/25.
 */
import Vue from 'vue';
import ElementUI from 'element-ui';

Vue.use(ElementUI)
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
import publicPath from '../../publicJs/publicPathConfig';
import setUser from '../publicJs/SetUserInfo';
import '../css/departManage.css'

function init() {
    var vue=new Vue({
        el:'#app',
        components: {
            'left-nav':leftNav,
            'public-header':header,
            'public-bottom':bottomComponent,
            'right-top-nav':rightTopNav,
            'my-component': commonTable,
            'btn-control':commonBtn
        },
        data:{
        	menuName:'部门管理',
            topNavData:{
                breadLinks:[{name:"权限管理",link:"#"},{name:"部门管理",link:"#"}],
                searchTitle:'部门名称',
                searchWord:''
            },
            leftNavData:[],
            publicTopNavData:[],
            publicTopUserChange:0,
            btnControlData:{},
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
            treeData:{
                data: [],
                clickNode:false,
                defaultProps: {
                    children: 'children',
                    label: 'label'
                }
            },
        },
        created(){
            var token=ToolService.getQueryString("tokenId");
            var that=this;
            if(token!=null && token!=undefined){
                /*userService.storeInfo("tokenId",token);
                HttpService.get('token/getUserByToken',{param:''},function(data){
                    console.info("tokenIdData=",data);
                    userService.storeInfo("username",data.data.userInfo.userName);
                    userService.storeInfo("image",data.data.userInfo.enterpriseid[0].IMAGE);
                    that.publicTopUserChange++;
                    sessionStorage.menuName = JSON.stringify(data.data.userInfo.menuName);
                    that.initApp();
                });*/
                setUser.setUser(token,function () {
                    that.publicTopUserChange++;
                    that.initApp();
                });
            }
            else{
                that.initApp();
            }
        },
        mounted(){
            //initApp();
        },
        methods:{
            initApp(){
                this.link();
                this.getBtnArr();
                var word=ToolService.getQueryString("word");
                this.leftNavData=publicNavData.getLeftNavData("部门管理");
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
            link(){
                var that=this;
                HttpService.get('deptpriv/getDeptTree',{param:''},function(data){
                    console.info("树=",data);
                    that.treeData.data=data.data;
                });
            },
            getBtnArr(){
                var that=this;
                var menuId=publicNavData.getMenuId("部门管理");
                var btnObj={};
                HttpService.get('authmanage/getUserAllPriv',{menuId:menuId},function(data){
                    for(var i=0;i<data.data.length;i++){
                        var obj=data.data[i];
                        if(obj.title=="新建"){
                            btnObj.add={fn:that.addBtnHandler}
                        }
                        else if(obj.title="删除"){
                            btnObj.remove={fn:that.removeBtnHandler};
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
                   NoticeBoxService.open("确定要删除部门吗？",function () {
                       NoticeBoxService.close();
                       LoadingService.open("正在删除，请稍候...");
                       var arr=new Array();
                       for(var i=0;i<data.length;i++){
                           var id=data[i].ID;
                           arr.push(id);
                       }
                       var sendData={param:arr.toString()};
                       HttpService.get('deptpriv/batchDeleteDept',sendData,function(data){
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
            topNavSearchHandler:function(data){
                console.info("search=",data);
                this.tableData.departId="noLink";
                this.tableData.searchWord=data;
                //var obj={param:data,pageNum:1}
                /*HttpService.getLink('accountpriv/searchUser',obj,function (data) {

                });*/
            },
            addBtnHandler(){
                console.info("新建");
                window.location.href='./departAddEdit.html';
            },
            removeBtnHandler(){
                console.info("删除");
                var that=this;
                that.tableData.getSelectNum++;
            },
            searchTableDataHandler(data){
                console.info("表单模糊查询的连接请求",data);
                var that=this;
                HttpService.get('departrole/searchDepartName',data,function(data){
                    console.info("kkkkkkk=",data);
                    if(data.data.departList!=null){

                        that.tableData.pageTotal=data.data.page.rowCount;
                        var bodyData=that.dataHandler(data.data.departList);
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
                HttpService.get('departrole/searchDepart',data,function(data){
                     console.info("jjjjjjj=",data);
                     if(data.data.departList!=null){
                         that.tableData.pageTotal=data.data.page.rowCount;
                         var bodyData=that.dataHandler(data.data.departList);
                         console.info("bodyData=",bodyData);
                         that.tableData.bodyData=bodyData;
                     }
                     else{
                         that.tableData.bodyData="error"+Math.random();
                     }
                 });
            },
            dataHandler(dataList){
                console.info("dataList=",dataList);
                for(var i=0;i<dataList.length;i++){
                    var obj=dataList[i];
                    //var lineData=[{check:true,checkData:false},{link:true,text:true,name:obj.DEPARTMENT_NAME},{text:true,name:obj.P_NAME},{text:true,name:obj.DEPARTMENT_PHONE},{text:true,name:obj.REMARK}];
                    var lineData=[
                        {img:true,imageClass:"depart",itemWidth:"8%"},
                        {text:true,itemWidth:"30%",textData:{
                            部门名称:obj.DEPARTMENT_NAME,
                            上级部门:obj.P_NAME,
                        }},
                        {
                            text:true,itemWidth:"27%",textData:{
                                部门电话:obj.DEPARTMENT_PHONE
                            }
                        },
                        {
                            text:true,itemWidth:"30%",textData:{
                                备注:obj.REMARK
                            }
                        },
                        {check:true,itemWidth:"5%",checkData:false}
                    ]
                    obj.lineData=lineData;
                }
                console.info("aaaaaaaaa")
                return dataList;
            },

            nodeClickHandler(data){
                console.info("nodeData=",data);
                this.tableData.searchWord="noLink";
                this.tableData.departId=data.id;
                //this.tableData.bodyData=[];
                //if(data.children==undefined || data.children.length==0){
                    //this.tableData.departId=data.id;
                //}
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
            },
            gotoAppMarketHanlder(){
                window.location.href=publicPath.APP_MARKET;
            }
        }
    });
}
init();