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
import commonTable from '../components/CommonTableComponent.vue';
import publicNavData from '../publicJs/TransformLeftNavData';
import ToolService from '../publicJs/ToolService';
import setUser from '../publicJs/SetUserInfo';
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
        },
        data:{
            radioData:0,
            topNavData:{
                breadLinks:[{name:"加入企业",link:"#"},{name:"搜索结果",link:"#"}],
                noInput:true
            },
            publicTopUserChange:0,
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
                pagination:false,
                getSelectNum:0
            },
            searchWord:''
        },
        created(){

        },
        mounted(){
            var token=ToolService.getQueryString("tokenId");
            var that=this;
            if(token!=null && token!=undefined){
                setUser.setUser(token,function () {
                    that.publicTopUserChange++;
                    that.initApp();
                });
            }
            else{
                that.initApp();
            }
        },
        methods:{
            //初始化
            initApp(){
                var word=ToolService.getQueryString("word");
                console.info("word=",word);
                if(word!=null){
                    console.info("word=",word);
                    this.searchWord=word;
                    this.searchClickHandler();
                }
                this.leftNavData=publicNavData.getLeftNavData("加入企业");
                var that=this;
                publicNavData.getTopNavData(function (data) {
                    that.publicTopNavData=data;
                });
            },
            //表单请求事件
            tableLinkHandler(data){
                var that=this;
                console.info("ddddddd=",data);
                data.param=that.searchWord;
                HttpService.get('enterprise/searchAllEnterprise',data,function (data) {
                    console.info("jjjjjjj=",data);
                    if(data.data!=null && data.data.length>0){
                        var bodyData=that.dataHandler(data.data);
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
                    var lineData=[
                        {img:true,imageClass:"depart",itemWidth:"5%"},
                        {text:true,itemWidth:"40%",textData:{
                            公司名称:obj.ENTERPRISE_NAME,
                            所在城市:obj.DETAILED_ADDRESS
                        }},
                        {
                            text:true,itemWidth:"40%",textData:{
                            详细地址:obj.COMPANY_ADDRESS,
                        }
                        },
                        {
                            fontBtn:true,itemWidth:"15%",btnArr:[{class:"",clickType:"edit",title:"申请加入"}]
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
                console.info("jkjkkk",data);
                var that=this;
                HttpService.get('enterprise/searchAllEnterprise',data,function (data) {
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
                   var hrefStr='./joinEnterpriseInformation.html?id='+data.ID+'&name='+data.ENTERPRISE_NAME;
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

function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}