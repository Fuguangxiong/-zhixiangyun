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
import publicPath from '../../publicJs/publicPathConfig';

Vue.use(ElementUI);

function init(){
	var vue=new Vue({
		el:'#accountManage',
		components: {
            'left-nav':leftNav,
            'public-header':header,
            'public-bottom':bottomComponent,
            'right-top-nav':rightTopNav,
            'my-component': commonTable,
            'btn-control':commonBtn
        },
        data:{
        	menuName:'账户管理',
         	topNavData:{
                breadLinks:[{name:"权限管理",link:"#"},{name:"账户管理",link:"#"}],
                searchTitle:'姓名/电话号',
                searchWord:''
            },
            leftNavData:[],
            publicTopNavData:[],
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
            btnSelectType:"no"
        },
        mounted(){
            this.link();
            var word=ToolService.getQueryString("word");
            this.getBtnArr();
            this.leftNavData=publicNavData.getLeftNavData("账户管理");
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
                HttpService.get('deptpriv/getDeptTree',{param:''},function (data) {
                    console.info("树=",data);
                    that.treeData.data=data.data;
                });
            },
            getBtnArr(){
                var that=this;
                var menuId=publicNavData.getMenuId("账户管理");
                var btnObj={};
                HttpService.get('authmanage/getUserAllPriv',{menuId:menuId},function(data){
                    console.info('asa',data);
                    for(var i=0;i<data.data.length;i++){
                        var obj=data.data[i];
                        if(obj.title=="新建"){
                            btnObj.add={fn:that.addBtnHandler}
                        }
                        else if(obj.title=="删除"){
                            btnObj.remove={fn:that.removeBtnHandler};
                        }
                        else if(obj.title=="导入"){
                            btnObj.import={fn:that.bumImport};
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
                    }
                    that.btnControlData=btnObj;
                });
            },
            getTableSelectDataHandler(data) {
                console.info("selectData=",data);
                var that=this;
                if(that.btnSelectType=="remove"){
                    if(data.length==0){
                        TipBoxService.open("请选择删除项！",2);
                    }
                    else{
                        NoticeBoxService.open("确定要删除账户吗？",function () {
                            NoticeBoxService.close();
                            LoadingService.open("正在删除，请稍候...");
                            var arr=new Array();
                            for(var i=0;i<data.length;i++){
                                var id=data[i].id;
                                arr.push(id);
                            }
                            var sendData={param:arr.toString()};
                            //HttpService.getLink('deptpriv/batchDeleteDept',sendData,function (data) {
                            HttpService.get('accountpriv/batchDeleteUser',sendData,function (data) {
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
                }
                else if(that.btnSelectType=="reset"){
                   if(data.length==0){
                        TipBoxService.open("请勾选要重置的账户！",2);
                    }
                    else{
                        NoticeBoxService.open("确定要将所勾选账户重置密码吗？",function () {
                            NoticeBoxService.close();
                            LoadingService.open("正在重置，请稍候...");
                            var arr=new Array();
                            for(var i=0;i<data.length;i++){
                                var id=data[i].id;
                                arr.push(id);
                            }
                            HttpService.get('account/resetPwd','param='+arr.toString(),function (data) {
                                LoadingService.close();
                                if(data.status=='200'){
                                	if(data.data.result=='success'){
                                		TipBoxService.open("重置成功，默认密码为123456！",2);
                                	}
                                }
                                else
                                {
                                   
                                }
                            });
                        });
                    }
                }

            },
        	topNavSearchHandler(data){
        		console.info("search=",data);
                this.tableData.departId="noLink";
                this.tableData.searchWord=data;
        	},
            addBtnHandler(){
                console.info("新建");
                window.location.href='./accountAddEdit.html';
            },
            removeBtnHandler(){
                console.info("删除");
                var that=this;
                that.btnSelectType="remove";
                that.tableData.getSelectNum++;
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
            searchTableDataHandler(data){
                console.info("表单发起的连接请求",data);
                var that=this;
                HttpService.get('accountpriv/searchUser',data,function (data) {
                    that.tableData.bodyData=bodyData;
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
            tableLinkHandler(data){
                console.info("表单发起的连接请求",data);
                var that=this;
                HttpService.get('userrole/searchDepartIdUser',data,function (data) {
                    console.info("jjjjjjj=",data);
                    that.tableData.bodyData=bodyData;
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
                    //var lineData=[{check:true,checkData:false},{link:true,text:true,name:obj.userName},{text:true,name:obj.phone},{text:true,name:obj.phone},{text:true,name:obj.position},{text:true,name:obj.mail},{text:true,name:obj.createTime}];

                    var lineData=[
                        {img:true,imageClass:"accout",itemWidth:"5%"},
                        {text:true,itemWidth:"30%",textData:{
                            姓名:obj.userName,
                            职位:obj.position,
                        }},
                        {
                            text:true,itemWidth:"30%",textData:{
                            手机号:obj.phone,
                            账号:obj.phone
                        }
                        },
                        {
                            text:true,itemWidth:"30%",textData:{
                            创建时间:obj.createTime,
                            邮箱:obj.mail
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
                var hrefStr='accountAddEdit.html?id='+data.id;
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
	})
}
init();
