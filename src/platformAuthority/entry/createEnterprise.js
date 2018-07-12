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
import LoadingService from '../../publicJs/LoadingBoxService';
import publicNavData from '../publicJs/TransformLeftNavData';
import approlDetail from '../components/CommonApprolDetailComponent.vue';
import '../css/createEnterprise.css';

function init() {
    var vue=new Vue({
        el:'#tableAimd',
        components: {
            'left-nav':leftNav,
            'public-header':header,
            'public-bottom':bottomComponent,
            'right-top-nav':rightTopNav,
            'my-component': commonTable,
            'approl-detail':approlDetail
        },
        data:{
        	test:"创建企业",
            showBtn:false,
            radioData:0,
            topNavData:{
                breadLinks:[{name:"创建企业",link:"#"}],
                searchTitle:'企业名称',
                searchWord:''
            },
            leftNavData:[],
            publicTopNavData:[],
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
            approlDetailData:{
        	    boxOpen:0,
                data:[]
            }
        },
        created(){

        },
        mounted(){
            this.leftNavData=publicNavData.getLeftNavData("创建企业");
            var that=this;
            publicNavData.getTopNavData(function (data) {
                that.publicTopNavData=data;
            });
            this.tableData.departId='';
        },
        methods:{
            //单选按钮点击事件
            radioChangeHandler(){
               this.tableData.renewNum++;
            },
            //表单请求事件
            tableLinkHandler(data){
                var that=this;
                data.status=that.radioData;
                HttpService.get('enterprise/searchFoundEnterprise',data,function (data) {
                    if(data.data.createList!=null && data.data.createList.length>0){
                        that.tableData.pageTotal=data.data.page.rowCount;
                        var bodyData=that.dataHandler(data.data.createList);
                        that.tableData.bodyData=bodyData;
                    }
                    else{
                        that.tableData.bodyData="error"+Math.random();
                    }
                });
            },
            //把后台数据转化为表单需要的格式
            dataHandler(dataList){
                for(var i=0;i<dataList.length;i++){
                    var obj=dataList[i];
                    var color="#26d186";
                    var btnArr=[];
                    if(obj.status=="待审核"){
                        color="#55a8fd";
                    }
                    else if(obj.status=="未通过"){
                        color="#fa405c";
                        btnArr.push({class:"edit",clickType:"edit",title:"编辑"});
                    }
                    else if(obj.status=="已通过"){
                       btnArr.push({class:"remove",clickType:"remove",title:"删除"});
                    }
                    var lineData=[
                        {img:true,imageClass:"depart",itemWidth:"5%"},
                        {text:true,itemWidth:"30%",textData:{
                            公司名称:obj.enterpriseName,
                        }},
                        {
                            text:true,itemWidth:"30%",textData:{
                            申请日期:obj.createTime,
                        }
                        },
                        {
                            status:true,itemWidth:"30%",textStatus:obj.status,color:color
                        },
                        {
                            btn:true,itemWidth:"5%",btnArr:btnArr
                        },
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
                var that=this;
                that.radioData=0;
                data.status=that.radioData;
                HttpService.get('enterprise/searchFoundEnterprise',data,function (data) {
                    if(data.data.createList!=null && data.data.createList.length>0){
                        that.tableData.pageTotal=data.data.page.rowCount;
                        var bodyData=that.dataHandler(data.data.createList);
                        that.tableData.bodyData=bodyData;
                    }
                    else{
                        that.tableData.bodyData="error"+Math.random();
                    }
                });
            },
            //点击表单行的时候发出的请求
            tableLinkClickHandler(data){
            	var that = this;
                console.info("clickData=",data);
                that.approlDetailData.boxOpen++;
                var param = {enterpriseId:data.enterpriseId,id:data.userId,iscreate:true};
				HttpService.post('enterprise/searchUserEnterpriseStatus','param='+JSON.stringify(param),function(data){
				console.info("clickData=",data);
					if(data.status=='200'){
						that.approlDetailData.data = data.data;
					}
				});
//              this.approlDetailData.data=[{date:'2017年12月27日',time:'13:10:04',content:'提交审核'},{date:'2017年12月27日',time:'13:20:04',content:'驳回申请，原因企业资质照片不清晰'},{date:'2017年12月27日',time:'13:30:04',content:'提交审核'},{date:'2017年12月27日',time:'13:40:04',content:'通过审核，获得智享云-北京小黑马公司超级管理员权限。'}];
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
               if(data.tableBtnType=="remove"){
                   NoticeBoxService.open("确定要删除此条记录吗？",function () {
                       NoticeBoxService.close();
                       LoadingService.open("正在删除，请稍候...");
                       HttpService.get('enterprise/deleteEnterprise',{param:data.id},function (data) {
                           console.info("删除=",data);
                           LoadingService.close();
                           if(data.status==200){
                               TipBoxService.open("删除成功！",0);
                               that.tableData.renewNum++;
                           }
                           else
                           {
                               TipBoxService.open("删除失败！",1);
                           }
                       });
                   });
               }
               else if(data.tableBtnType=="edit"){
                   var hrefStr='./enterpriseModification.html?id='+data.enterpriseId;
                   window.location.href=hrefStr;
               }
            },
            createEnterHandler(data){
                console.info("创建企业");
                var hrefStr='./enterpriseInformation.html';
                window.location.href=hrefStr;
            }

        }
    });
}
init();

function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}