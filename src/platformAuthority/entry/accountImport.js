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
import env from '../../../config/envConfig';
import publicPath from '../../publicJs/publicPathConfig';
import '../css/accountImport.css';
Vue.use(ElementUI);

function init(){
    var vue=new Vue({
        el:'#accountImport',
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
                breadLinks:[{name:"权限管理",link:"#"},{name:"账户管理",link:"#"},{name:"导入账户",link:"#"}],
                searchTitle:'姓名/电话号',
                searchWord:''
            },
            leftNavData:[],
            publicTopNavData:[],
            fileName:'',
            fileList:[]
        },
        mounted(){

            var word=ToolService.getQueryString("word");

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
            topNavSearchHandler(data){
                console.info("search=",data);
                this.tableData.departId="noLink";
                this.tableData.searchWord=data;
            },

            linkChangeHandler(link){
                console.info("link=",link);
                publicNavData.gotoLeftNavLink(link.link);
            },
            //下载模版
            accImport(){
                window.open(env.API_SERVER+'account/download?param=批量上传模板.xlsx');
            },
            //上传
            saveFilePath(){
                var file =uploadFile.files[0];
                var that = this;
                if(file){
                    var filePath=uploadFile.files[0].name;

                    if(!/\.(xlsx)$/.test(filePath)){
                        TipBoxService.open("只能上传xlsx文件",2);
                        return false;
                    }

                    HttpService.upload('account/uploadExcel',file,function(data){
                        console.info("dasdsada",data)
                        LoadingService.close();

                        if(data.status=="success"||file.value != ''){
                            TipBoxService.open("上传成功！",0);
                            that.fileName = data.headExcel;

                        }
                        else
                        {
                            TipBoxService.open("上传失败！",1);
                        }
                    });
                }

            },
            //点导入跳转带名字过去
            saveBasicInfo(){
                var that= this;
                if (that.fileName!=''){
                    window.location.href='accountImportList.html?name='+that.fileName;
                }else{
                    TipBoxService.open("请选择文件上传",2);
                }

            },
            gotoAppMarketHanlder(){
                window.location.href=publicPath.APP_MARKET;
            }

        }
    })
}
init();
