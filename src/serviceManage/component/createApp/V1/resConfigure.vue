<template>
  <div>
    <div class="publicContent">
      <div class="publicNav">
       <span class="hand" @click="toMain"></span>
        <span class="active">应用管理</span>
        <span class="arrows">></span>
        <span class="active">新建应用</span>
        <div class="returnBtn publicRedBtn" @click="returnPage()">返回</div>
      </div>
      <div class="browseFileBox" >
       <div class="lanmpege">
                <div class="lanmp-con">
                    <div class="lanbbag5 ">
                        <p style="width:58%"></p>
                    </div>
                    <div class="lanbag-text1">
                        <span class="tim1">基本信息</span>
                        <span class="tim2">应用上传</span>
                        <span class="tim3">资源配置</span>
                        <span class="tim4">网络资源</span>
                        <span class="tim5">配置完成</span>
                  </div>
            </div>
        </div>
       <div class="iformcon">
           <div class="iformcon-con3 third_step">

              <div class="cpu_box">
                  <span class="cpu_title">CPU：</span>
                   <div class="cpu_main">
                        <ul class="clearfix">
                                  <li @click="selectCpu(1)" :class="[classNameNoActive, currentSelectCpu==1?classNameActive:classNameNoActive]">1核</li>
                                  <li @click="selectCpu(2)" :class="[classNameNoActive, currentSelectCpu==2?classNameActive:classNameNoActive]">2核</li>
                                  <li @click="selectCpu(4)" :class="[classNameNoActive, currentSelectCpu==4?classNameActive:classNameNoActive]">4核</li>
                                        </ul>
                                    </div>
                                </div>
                                <div class="memory_box">
                                    <span class="memory_title">内存：</span>
                                    <div class="memory_main">
                                        <ul class="clearfix">
                                            <li @click="selectMemory(1)" :class="[classNameNoActive, currentSelectMem==1?classNameActive:'']">1G</li>
                                            <li @click="selectMemory(2)" :class="[classNameNoActive, currentSelectMem==2?classNameActive:'']">2G</li>
                                            <li @click="selectMemory(4)" :class="[classNameNoActive, currentSelectMem==4?classNameActive:'']">4G</li>
                                        </ul>
                                    </div>
                                </div>
                                <div class="disk_size clearfix">
                                    <span class="disk_size_title">磁盘大小：</span>
                                    <div class="bar_box">
                                        <div class="block">
                                             <el-slider
                                                v-model="res.disk" 
                                                :max="300" show-input >
                                             </el-slider>
                                        </div>
                                        <div class="bar_xb clearfix">
                                            <span class="ogl"></span>
                                            <span class="g300r"></span>
                                        </div>
                                       </div>
                                       <div class="input_bar_box clearfix">
                                          <span class="span_bar_dw">GB</span>
                                       </div>
                                   </div>              
                        </div>
                  </div>
           <!--/biaodan-->
            <div class="buttnet">
                  <span class="butonst" v-on:click="temporySave()">暂存</span>
                  <span class="butonstdelet" v-on:click="lastStep()">上一步</span>
                  <span class="butonstred" v-on:click="nextStep()">下一步</span>
            </div>
          </div>
        </div>
  </div>
</template>

<script>
/*  import HttpService from '../../../publicService/HttpService'*/
/*  import selectComponent from '../../../publicComponent/selectComponent.vue'*/
  import apiToken from '../../../publicJs/apiToken.js'
  import apiClient from '../../../publicJs/ApiClient.js'
  import LoadingBoxService from '../../../publicJs/LoadingBoxService'
  import TipBoxService from '../../../publicJs/TipBoxService'
  export default {
    name: 'resConfigure',
    components:{
 /*     selectComponent,*/
    },
    data:function () {
      return {
        classNameNoActive:'no_borr',
        classNameActive:'active',
        currentSelectCpu:1,
        currentSelectMem:1,
        app_id:'',
        res:{
          cpu:'1',
          memory:'1',
          disk:1
        },
        appDomain:{
          
        }
      }
    },
    created(){
      if(this.$route.query.app_id != null || this.$route.query.app_id != undefined){
          this.app_id = this.$route.query.app_id;
          console.info("页面应用ID:"+this.app_id);
          this.fetchData(this.app_id);   
      }

    },
    methods:{
      //调整disk
      formatTooltip(val){
          val
      },
      //选择CPU
      selectCpu(item){
        let that = this;
        that.currentSelectCpu=item;
        that.res.cpu = item;
      },
      //选择内存
      selectMemory(item){
        let that = this;
        that.currentSelectMem=item;
        that.res.memory = item;
        console.info(that.res.memory);

      },
      fetchData (app_id){
        let that = this,params={id:app_id};
        apiClient.post('itsmApi/application/loadApp',params,function(data){
           console.info("获取资源配置数据："+data.results);
           that.appDomain = data.results.data[0];
           console.info("资源配置",that.appDomain);
           if(that.appDomain.res == null || that.appDomain.res == undefined){
              that.appDomain.res= that.res;
           }
           else{
                that.currentSelectCpu = that.appDomain.res.cpu;
                that.currentSelectMem = that.appDomain.res.memory;  
                that.res.cpu = that.currentSelectCpu;
                that.res.memory = that.currentSelectMem;
                that.res.disk = that.appDomain.res.disk;        
           }          
           
        });
      },
      lastStep(){
         let that = this;
         this.$router.push({name:'uploadApp',query:{app_id:that.app_id}});
      },
      toMain(){
          this.$router.push({name:"appsManager"})
      },
      nextStep(){
        let that = this;
        that.appDomain.res = that.res;
        that.appDomain.id = that.app_id;
         var myData = that.appDomain;
         apiClient.post('itsmApi/application/saveApp',myData,function(data){
          if(data.status == 200){
            that.$router.push({name:'netConfigure',query:{app_id:that.app_id}});
          }
          else{
            TipBoxService.open("数据异常", 1);
          }
        });
      },
      temporySave(){
         LoadingBoxService.open("正在暂存......");
        let that = this;
        that.appDomain.res = that.res;
        that.appDomain.id = that.app_id;
         var myData = that.appDomain;
         apiClient.post('itsmApi/application/saveApp',myData,function(data){
          if(data.status == 200){
          LoadingBoxService.close();
            TipBoxService.open("暂存成功", 0);

          }
          else{
            TipBoxService.open("暂存失败", 1);
          }
        });     
       },
      returnPage(){
         this.$router.push({name:'appsManager',query:{}})
      }
    }
    }
  </script>
  <!-- Add "scoped" attribute to limit CSS to this component only -->
<style src="../../css/common/public.css" scoped></style>
<style src="../../css/createApp/resConfigure.css" scoped></style>
<style scoped>
.browseFileBox{
    box-shadow: 0 0 3px 2px #dedede;
    border-radius: 2px;
    background: #fff;
    margin-top: 12px;
    width: 100%;
    overflow-y: auto;
}
</style>

