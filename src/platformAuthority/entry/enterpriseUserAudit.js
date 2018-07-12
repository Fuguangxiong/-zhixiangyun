/**
 * Created by changle
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
import transfer from '../components/MyTransfer.vue';
import LoadingService from '../../publicJs/LoadingBoxService';
import publicNavData from '../publicJs/TransformLeftNavData';
import ToolService from '../publicJs/ToolService';
import '../css/enterpriseUserAudit.css';
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
        namec ="未审批";

    }else if(type == 1){
        activeName = 'second';
        namec ="已审批";
    }
    var vue=new Vue({
        el:'#enterpriseUserAudit',
        components: {
            'left-nav':leftNav,
            'public-header':header,
            'public-bottom':bottomComponent,
            'right-top-nav':rightTopNav,
            'my-component': commonTable,
            'btn-control':commonBtn,
        },
        data:{
        	menuName:'审批企业',
            topNavData:{
                breadLinks:[{name:"权限管理",link:"#"},{name:"企业用户审核",link:"#"}],
                searchTitle:'部门名称',
                searchWord:''
            },
            leftNavData:[],
            publicTopNavData:[],
            btnControlData:{},
            activeTab:activeName,
            tableData:{
                getSelectNum:0,
                departId:0,
                headerData:[{check:true,checkData:false},{name:'公司名称'},{name:'申请人'},{name:'手机号(账号)'},{name:'操作'}],
                bodyData:[],
                renewNum:0,
                pageTotal:0,
                searchWord:'',
                hasPagination:true
            }
        },
         //改变值
        watch: {
            activeName: function (val) {
                if(this.activeName=='first'){
                    this.topNavData.breadLinks[2].name="未审批";
                }else if(this.activeName=='second'){
                    this.topNavData.breadLinks[2].name="已审批";
                }
            }
        },
        mounted(){
//         this.tableLinkHandler();
            var word=ToolService.getQueryString("word");
            if(word!=null){
                this.topNavData.searchWord=word;
                this.tableData.departId="noLink";
                this.tableData.searchWord=word;
            }
            this.getBtnArr();
            this.leftNavData=publicNavData.getLeftNavData("审批企业");
            var that=this;
            publicNavData.getTopNavData(function (data) {
                that.publicTopNavData=data;
            });
        },
        methods:{
            topNavSearchHandler(){
                console.info("search=",data);
                this.tableData.departId="noLink";
                this.tableData.searchWord=data;
            },
            searchTableDataHandler(){
               
            },
            notAudit(){
            	
            },
            audit(){
            	
            },
            getBtnArr(){
                var that=this;
                var menuId=publicNavData.getMenuId("审批企业");
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
                    }
                    that.btnControlData=btnObj;
                });
            },
            tableLinkHandler(data){             
               console.info("表单发起的连接请求",data);              
                var that=this;
                //后台的接口
                HttpService.getLink('enterprise/searchApproval',{status:1,param:'',pageNum:1},function (data) {
                     console.info("jjjjjjj=",data);
                     if(data.data.approvalList!=null){
                     	//分页
                         that.tableData.pageTotal=data.data.page.rowCount;
                         //渲染list
                         var bodyData=that.dataHandler(data.data.approvalList);
                         console.info("bodyData=",bodyData);
                         that.tableData.bodyData=bodyData;
                     }
                     else{
                         that.tableData.bodyData="error"+Math.random();
                     }
                })
            },
            dataHandler(dataList){
                console.info("dataList=",dataList);
                for(var i=0;i<dataList.length;i++){
                    var obj=dataList[i];
                    //使用后台的数据(根据后台传过来对应的值)
                    var lineData=[{check:true,checkData:false},{link:true,text:true,name:obj.enterpriseName},{text:true,name:obj.userName},{text:true,name:obj.phone},{authorityBtn:true,userBtn:true,departBtn:true}];
                    obj.lineData=lineData;
                }
                return dataList;
            },
             nodeClickHandler(data){
                this.tableData.searchWord="noLink";
                this.tableData.departId=data.id;
            },
            tableLinkClickHandler(data){
               
            },
            getTableSelectDataHandler(data) {
            	
            },
            linkChangeHandler(link){
                console.info("link=",link);
                publicNavData.gotoLeftNavLink(link.link);
            },
            tableBtnClickHandler(data){
                console.info("表单按钮点击=",data);
                var hrefStr=''
                if(data.tableBtnType=="authority"){//详情
                    hrefStr='approvalDetails.html?id='+data.id+'&type=1';
                }
                else if(data.tableBtnType=="user"){//通过
                    hrefStr='authorityRelation.html?id='+data.id+'&departId='+this.tableData.departId+'&type=0';
                }
                else if(data.tableBtnType=="depart"){//驳回
                    hrefStr='authorityRelation.html?id='+data.id+'&departId='+this.tableData.departId+'&type=1';
                }
                window.location.href=hrefStr;
            },
            //当表单选择check按钮时触发的事件
            tableSelectChangeHandler(data){
            	console.info("当表单选择check按钮时触发的事件",data);
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
            headerCheckChangeHandler(data){
                console.info("clickselect=",this.tableData.allSelected);
                this.tableData.bodyAllSelected=this.tableData.allSelected+'/'+Math.random();
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