/**
 * Created by yancan
 */

import HttpService from '../../publicJs/ApiClient';
import Vue from 'vue';
import ElementUI from 'element-ui';

import header from '../../publicComponent/publicTopNavComponent.vue';
import leftNav from '../../publicComponent/publicLeftNavComponent.vue';
import rightTopNav from '../components/CommonRightTopNavComponent.vue';

import bottomComponent from '../../publicComponent/publicBottomComponent.vue';
import TipBoxService from '../../publicJs/TipBoxService';
import NoticeBoxService from '../../publicJs/NoticeBoxService';
import publicNavData from '../publicJs/TransformLeftNavData';
import ToolService from '../publicJs/ToolService';
import commonTable from '../components/CommonTableComponent.vue';
import commonBtn from '../components/CommonBtnControlComponent.vue'
Vue.use(ElementUI);

Vue.use(ElementUI);
function init() {
    var vue=new Vue({
        el:'#accountAddEdit',
        data:{
        	menuName:'审批企业',
        	//面包屑信息
            topNavData:{
                breadLinks:[{name:"企业用户审核",link:"#"}],
                searchTitle:'姓名/电话号'
            },
            leftNavData:[],
            publicTopNavData:[],
            activeTab:'noAudit',
            tableData:{
                departId:0,
                bodyData:[],
                renewNum:0,
                pageTotal:0,
                searchWord:'',
                getSelectNum:0
            },
            tableData2:{
                departId:0,
                bodyData:[],
                renewNum:0,
                pageTotal:0,
                searchWord:'',
                getSelectNum:0
            },
             btnControlData:{},
        },
        components: {
            'left-nav':leftNav,
            'public-header':header,
            'public-bottom':bottomComponent,
            'right-top-nav':rightTopNav,
            'my-component': commonTable,
			'my-component2':commonTable
        },
        mounted () {
         	this.leftNavData=publicNavData.getLeftNavData("审批企业");
            var that=this;
            publicNavData.getTopNavData(function (data) {
                that.publicTopNavData=data;
            });
         	this.tableData.departId="";
            this.tableData2.departId="";
        },
        methods:{
        	topNavSearchHandler:function(data){
                console.info("search=",data);
                window.location.href="accountManage.html?word="+data;
           },
            //表单请求事件
            tableLinkHandler(data){
                var that=this;
                console.info("ddddddd=",data);
                data.status=0;
                data.param=that.tableData.searchWord;
                HttpService.get('enterprise/searchApproval',data,function (data) {
                    console.info("jjjjjjj=",data);
                    if(data.data.approvalList!=null && data.data.approvalList.length>0){
                        that.tableData.pageTotal=data.data.page.rowCount;
                        var bodyData=that.dataHandler(data.data.approvalList);
                        that.tableData.bodyData=bodyData;
                    }
                    else{
                        that.tableData.bodyData="error"+Math.random();
                    }
                });
            },
            tableLinkHandler2(data){
                var that=this;
                data.status=1;
                data.param=that.tableData2.searchWord;
                HttpService.get('enterprise/searchApproval',data,function (data) {
                    if(data.data.approvalList!=null && data.data.approvalList.length>0){
                        that.tableData2.pageTotal=data.data.page.rowCount;
                        var bodyData=that.dataHandler2(data.data.approvalList);
                        that.tableData2.bodyData=bodyData;
                    }
                    else{
                        that.tableData2.bodyData="error"+Math.random();
                    }
                });
            },
            //把后台数据转化为表单需要的格式
            dataHandler(dataList){
                for(var i=0;i<dataList.length;i++){
                    var obj=dataList[i];
                    var lineData=[
                        {img:true,imageClass:"depart",itemWidth:"5%"},
                        {text:true,itemWidth:"30%",textData:{
                            公司名称:obj.enterpriseName,
                        }},
                        {text:true,itemWidth:"25%",textData:{
                            申请人:obj.userName
                        }},
                        {
                            text:true,itemWidth:"25%",textData:{
                            手机号:obj.phone,
                        }
                        },
                        {
                            fontBtn:true,itemWidth:"15%",btnArr:[{class:"",clickType:"edit",title:"详情"}]
                        },
                    ]

                    obj.lineData=lineData;
                }

                return dataList;
            },
            //把后台数据转化为表单需要的格式
            dataHandler2(dataList){
                for(var i=0;i<dataList.length;i++){
                    var obj=dataList[i];
                    var lineData=[
                        {img:true,imageClass:"depart",itemWidth:"10%"},
                        {text:true,itemWidth:"30%",textData:{
                            公司名称:obj.enterpriseName,
                        }},
                        {text:true,itemWidth:"30%",textData:{
                            申请人:obj.userName
                        }},
                        {
                            text:true,itemWidth:"30%",textData:{
                            手机号:obj.phone,
                        }
                        }
                    ]

                    obj.lineData=lineData;
                }

                return dataList;
            },
            //公共头部搜索按钮事件
            topNavSearchHandler(data){
                this.tableData.departId="noLink";
                this.tableData.searchWord=data;
            },
            //表单发出的模糊搜索请求
            searchTableDataHandler(data){
                console.info("jkjkkk",data);
                var that=this;
                data.status=0;
                data.param=that.tableData.searchWord;
                HttpService.get('enterprise/searchApproval',data,function (data) {
                    if(data.data.approvalList!=null && data.data.approvalList.length>0){
                        that.tableData.pageTotal=data.data.page.rowCount;
                        var bodyData=that.dataHandler(data.data.approvalList);
                        that.tableData.bodyData=bodyData;
                    }
                    else{
                        that.tableData.bodyData="error"+Math.random();
                    }
                });
            },
            //表单发出的模糊搜索请求
            searchTableDataHandler2(data){
                console.info("jkjkkk",data);
                var that=this;
                data.status=1;
                data.param=that.tableData2.searchWord;
                HttpService.get('enterprise/searchApproval',data,function (data) {
                    if(data.data.approvalList!=null && data.data.approvalList.length>0){
                        that.tableData.pageTotal=data.data.page.rowCount;
                        var bodyData=that.dataHandler(data.data.approvalList);
                        that.tableData.bodyData=bodyData;
                    }
                    else{
                        that.tableData.bodyData="error"+Math.random();
                    }
                });
            },
            //点击表单行的时候发出的请求
            tableLinkClickHandler(data){
                console.info("dfdfdfd=",data);
//              window.location.href ='./assignPermissions.html?id='+data.id;
            },
            //左侧菜单点击事件
            linkChangeHandler(link){
                console.info("link=",link);
                publicNavData.gotoLeftNavLink(link.link);
            },
            //表单按钮点击事件
            tableBtnClickHandler(data){
                console.info("ffffffff=",data);
                var that=this;
                if(data.tableBtnType=="edit"){
                    var hrefStr='./auditEnterpriseDetail.html?id='+data.id;
                    window.location.href=hrefStr;
                }
            },
            searchClickHandler(){
                this.tableData.renewNum++;
            }
        }
    });
}
init();