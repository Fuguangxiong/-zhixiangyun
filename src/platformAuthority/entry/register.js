/**
 * Created by dell on 2017/8/18.
 */
import '../../publicCss/public.css'
import '../css/register.css'
import $ from "jquery";
import Vue from 'vue';
import ElementUI from 'element-ui'
import HttpService from '../../publicJs/ApiClient';
import TipBoxService from '../../publicJs/TipBoxService';
import user from '../../publicJs/userService';
import commonLgin from '../components/CommonLogin.vue';
import commonRegister from '../components/CommonRegister.vue';
import commonForPasscon from '../components/CommonForPasscon.vue';
import commonEnterprise from '../components/CommonEnterprise.vue';
import tool from '../publicJs/ToolService';
//var Vue=require("Vue");
function init() {
    //user.autoAddTokenId();
    console.info("fffff=",encodeURIComponent("http://192.168.38.72:8080/"));
    Vue.use(ElementUI)
    var vue=new Vue({
        el:'#login',
        components: {
            'login-dm':commonLgin,
            'register-dm':commonRegister,
            'forpasscon-dm':commonForPasscon,
            'enterprise':commonEnterprise
        },
        data:{
            activeName: 'logins',
            fpass:false,
			flag:true,
            ecnt:false,
            dataList:[],
            dataobj:{
                datalist:[]
            }
        },
        watch:{

        },
        created () {
            var type = tool.getQueryString('type');
            if(type == 0 ){
                this.activeName = 'logins';

            }else if(type == 1){
                this.activeName = 'second';
            }
            /*var path="http://192.168.38.164:8080/departManage.html?tokenId=dfdfffffffffffffffffffffff&id=fffffffffdddddddddddddddddtttttttt";
            var index=path.indexOf("tokenId=");
            var newPath=path.slice(0,index-1);
            console.info("idnex=",newPath);*/
        },
        methods:{
            //跳到找回U密码
            animationReg() {
                var that = this;
                that.fpass = true;
                that.flag = false;
                that.ecnt=false;

            },
            //跳到登录
            animationPass() {
                var that = this;
                that.fpass = false;
                that.flag = true;
                that.ecnt=false;
            },
            SuccessLsodg(){
                var that = this;
                console.info('成功')
                that.fpass = false;
                that.flag = false;
                that.ecnt=true;

                HttpService.get('enterprise/searchUserAllEnterprise','',function (data) {
                    that.companylist = data.data.list;
                    that.dataobj.datalist= data.data;
                    console.info('qiye',that.dataobj.datalist);
                });
                that.userName = localStorage.username;
            }
		}
    });
}
$(function () {
    init();

})

