<template>
  <div class="publicContent">
    <div class="publicNav">
      <img class="hand" @click="toMain()" src="">
      <!--<span class="arrows">></span>-->
      <span class="active">应用审批</span>
      <span class="arrows">></span>
      <span class="active">应用详情</span>
      <div class="topbtnContainer">
      </div>
    </div>
    <div class="loadDataBox">
      <div class="inpfrom">
        <h2 class="tilesc">《{{appData.app_name}}》&nbsp;应用创建申请</h2>
        <div class="divtime">
          <div class="tile"><span class="bpboerd">申请人信息</span><div class="line"></div></div>
          <div class="con-cont wid">
            <div class="textlinpu">
                <span class="text">申请人：</span>
              <input v-model="appData.name" readonly type="text" class="inputborder textlinpu-text w240">
            </div>
            <div class="textlinpu">
              <span class="text">登录名：</span>
              <input v-model="appData.user_name" readonly type="text" class="inputborder textlinpu-text w240">
            </div>
            <div class="textlinpu">
              <span class="text">单位：</span>
              <input v-model="appData.app_enterprise_name" readonly type="text" class="inputborder textlinpu-text w240">
            </div>
            <div class="textlinpu">
              <span class="text">部门：</span>
              <input v-model="appData.department_name" readonly type="text" class="inputborder textlinpu-text w240">
            </div>
            <div class="textlinpu">
              <span class="text">联系电话：</span>
              <input v-model="appData.tel" readonly type="text" class="inputborder textlinpu-text w240">
            </div>
            <div class="textlinpu">
              <span class="text">申请日期：</span>
              <input v-model="appData.app_date" readonly type="text" class="inputborder textlinpu-text w240">
            </div>
          </div>
        </div>
        <!--基本信息-->
        <div class="divtime">
          <div class="tile"><span class="bpboerd">基本信息</span><div class="line"></div></div>
          <div class="con-cont wid">
            <div class="textlinpu w100">
              <span class="text">服务名称：</span>
              <input v-model="appData.app_name" readonly type="text" class="inputborder textlinpu-text w240">
            </div>
            <div class="textlinpu w100" style="">
              <span class="text">应用类型：</span>
              <input v-model="appData.app_type_name" readonly type="text" class="inputborder textlinpu-text w240">
            </div>
            <div class="textlinpu w100">
              <span class="text">归属企业：</span>
              <input v-model="appData.enterprise_name" readonly type="text" class="inputborder textlinpu-text w240">
            </div>
            <div class="textlinpu w100">
              <span class="text">版本号：</span>
              <input v-model="appData.app_version" readonly type="text" class="inputborder textlinpu-text w240">
            </div>
            <div class="textlinpu w100">
              <span class="text">服务期限：</span>
              <input v-model="appData.serverRangeTime" readonly type="text" class="inputborder textlinpu-text w240">
            </div>
            <div class="textlinpu w100">
              <span class="text">服务介绍：</span>
              <textarea v-model="appData.app_remark" readonly class="inputborder textlinpu-text textrea">请详细描述您使用此数据的目的或用途（限300字以内）</textarea>
            </div>
          </div>
        </div>
        <!--应用上传-->
        <div class="divtime">
          <div class="tile"><span class="bpboerd">应用上传</span><div class="line"></div></div>
          <div class="con-cont wid">
           <div class="textlinpu w120">
              <span class="text">WAR包名称：</span>
              <input v-model="appData.archiver.archiver_name" readonly type="text" class="inputborder textlinpu-text w240">
            </div>
            <div class="textlinpu w100">
              <span class="text">WAR包大小：</span>
              <input v-model="appData.archiver.archiver_size" readonly type="text" class="inputborder textlinpu-text w240">
            </div>
            <div class="textlinpu w100">
              <span class="text">WAR包版本：</span>
              <input v-model="appData.archiver.archiver_version" readonly type="text" class="inputborder textlinpu-text w240">
            </div>
            <div class="textlinpu w100">
              <span class="text">应用入口：</span>
              <input v-model="appData.archiver.context_path" readonly type="text" class="inputborder textlinpu-text w240">
            </div>
          </div>
        </div>
        <!--资源配置-->
        <div class="divtime">
          <div class="tile"><span class="bpboerd">资源配置</span><div class="line"></div></div>
          <div class="con-cont wid">
            <div class="textlinpu w100">
              <span class="text">CPU：</span>
              <input v-model="appData.res.cpu" readonly type="text" class="inputborder textlinpu-text w240">
            </div>
            <div class="textlinpu w100">
              <span class="text">内存：</span>
              <input v-model="appData.res.memory" readonly type="text" class="inputborder textlinpu-text w240">
            </div>
            <div class="textlinpu w100">
              <span class="text">磁盘大小：</span>
              <input v-model="appData.res.disk" readonly type="text" class="inputborder textlinpu-text w240">
            </div>
          </div>
        </div>
         <!--网络配置-->
        <div class="divtime">
          <div class="tile"><span class="bpboerd">网络配置</span><div class="line"></div></div>
          <div class="con-cont wid">
            <div class="textlinpu w100" v-for="(item,index) in appData.port">
              <span class="text">端口号 ：</span>
              <input :value="item.docker_port" readonly type="text" class="inputborder textlinpu-text w240">
            </div>
          </div>
        </div>
        <!--/biaodan-->
                        <div class="buttnet">
                            <!-- <button class="determine" @click='confirm'>关闭</button> -->
                        </div> 
      </div>
    </div>
  </div>
</template>
<script>
  import apiToken from '../../../publicJs/apiToken.js'
  import apiClient from '../../../publicJs/ApiClient.js'
  import TipBoxService from "../common/TipBoxService.js";
  import LoadingBoxService from '../../../publicJs/LoadingBoxService.js'
  export default{
    name: 'lookAppDetail',
    data(){
        return{
            appData:{
                name:'',
                user_name:'',
                app_enterprise_name:'',
                department_name:'',
                tel:'',
                app_date:'',
                //全部信息
                app_name:'',
                app_status:'',
                enterprise_name:'',
                user_name:'',
                app_version:'',
                app_type_name:'',
                serverRangeTime:'',
                app_remark:'',
                port:[],
                archiver:{
                    archiver_name:'',
                    archiver_size:'',
                    archiver_version:'',
                    context_path:''
                },
                res:{
                   cpu:'',
                   memory:'',
                   disk:''
                }
           },
           backAppData:{
            archiver:{
                    archiver_name:'',
                    archiver_size:'',
                    archiver_version:'',
                    context_path:''
            },
            res:{
                   cpu:'0',
                   memory:0,
                   disk:0
            },
            port:[],
           }
        }
    },
    created(){
      var app_id = this.$route.query.id;
      this.getAppData(app_id);
    },
    methods:{
        getAppData(app_id){
            var that=this;
            var myData={id:app_id};
            apiClient.post('itsmApi/application/loadApp',myData,function(data){
              data.results.data[0].archiver.archiver_size = data.results.data[0].archiver.archiver_size+"MB";
              that.appData = data.results.data[0];
              if(that.appData.res == null || that.appData.res == undefined){
                that.appData.res = that.backAppData.res;
              }
              if(that.appData.archiver == null  || that.appData.archiver == undefined){
                that.appData.archiver = that.backAppData.archiver;
              }
              if(that.appData.port == null  || that.appData.port == undefined){
                that.appData.port = that.backAppData.port;
              }
              that.appData.res.cpu = that.appData.res.cpu+" 核";
              that.appData.res.disk = that.appData.res.disk+" GB";
              that.appData.res.memory = that.appData.res.memory+" GB";
              console.info(that.appData);
            });
        },
        toMain(){
          this.$router.push("appsManager")
        }
      /*  confirm(){
        window.close();
      }*/
    }
  }
</script>
<style src="../../css/common/public.css" scoped></style>
<style src="../../css/detailPage/lookAppDetail.css" scoped></style>
