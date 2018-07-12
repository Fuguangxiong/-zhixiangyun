<template>
  <div>
    <div class="publicContent">
      <div class="publicNav">
        <span class="hand" @click="toMain"></span>
        <span class="active">应用管理</span>
        <span class="arrows">></span>
        <span class="active">新建应用</span>
        <span class="arrows"></span>
        <div class="returnBtn publicRedBtn" @click="returnPage()">返回</div>

      </div>
      <div class="loadDataBox browseFileBox" >
          <div class="lanmpege">
                <div class="lanmp-con">
                    <div class="lanbbag5 ">
                    <p style="width:80%"></p>
                </div>
                <div class="lanbag-text1">
                                    <span class="tim1">基本信息</span>
                                    <span class="tim2">应用上传</span>
                                    <span class="tim3">资源配置</span>
                                    <span class="tim4">网络资源</span>
                                    <span class="tim5">配置完成</span>
                  </div>
            </div>
             <div class="iformcon">
                <div class="iformcon-con4 fourth_part">
                  <div class="port_apply">
                       <div class="port_apply_jia_jian clearfix" v-for="(item,index) in port">
                              <span class="span_pa_title">端口申请</span>
                              <input type="text" class="inp_pa" :class="{wrong:((item.docker_port == ''|| repeatPort[index] || unValidate[index]) && isSubmit)}" v-model="item.docker_port" @change="resetIsPass(item.docker_port)"/>
                              <i class="add_sub_ico add_icon" v-on:click="addPort"></i>
                              <i class="add_sub_ico sub_icon"  
                              v-on:click="deletePort(index)" v-if="index>0?true:false"></i>
                  </div>
                </div>
            </div>
            </div>
            <div class="buttnet">
                  <span class="butonst" @click="temporySave">暂存</span>
                  <span class="butonstdelet" @click="lastStep">上一步</span>
                  <span class="butonstred" @click="nextStep">下一步</span>
            </div>
        </div>

        </div>
      </div>
  </div>

</template>

<script>
  import $ from 'jquery'
  import apiToken from '../../../publicJs/apiToken.js'
  import apiClient from '../../../publicJs/ApiClient.js'
  import NoticeBoxService from '../../../publicJs/NoticeBoxService'
  import TipBoxService from '../../../publicJs/TipBoxService'
  import LoadingBoxService from '../../../publicJs/LoadingBoxService'
  export default {
    name: 'netConfigure',
    components:{
  /*    selectComponent,*/
    },
    data:function () {
      return {
        app_id:'',
        appDomain:
        {

        },
        port:[],
        isPass:true,
        isSubmit:false,   
        repeatPort:[],
        unValidate:[]   
      }
    },
    created(){
     if(this.$route.query.app_id != null && 
        this.$route.query.app_id != undefined && 
        this.$route.query. app_id !=''){
          this.app_id = this.$route.query.app_id;
          console.info("页面应用ID:"+this.app_id);
          this.fetchData(); 
         
     }
     else{
          //初始化：默认一个
         this.port.push({docker_port:'',physical_port:'',app_address:''});
     }
    },
    methods:{
      fetchData (){
        let that = this,param = {id:that.app_id};
        LoadingBoxService.open("正在加载数据，请稍候...");
        apiClient.post('itsmApi/application/loadApp',param,function(data){
          console.info("获取资源配置数据："+data.results.data[0]);
          LoadingBoxService.close();
          that.appDomain = data.results.data[0];
          console.info(JSON.stringify(that.appDomain));
           //如果有值先复制数组
          if(that.appDomain.port != null && that.appDomain.port != undefined && that.appDomain.port.size != 0){
            that.port = that.appDomain.port;
          }
          else{
            that.port.push({docker_port:'',physical_port:'',app_address:''});
          }
        });
      },
      addPort(){
        let that = this;
        that.port.push({docker_port:'',physical_port:'',app_address:''});
      },
      toMain(){
        this.$router.push({name:"appsManager"})
      },
      deletePort(index){
        let that = this;
        that.port.splice(index,1);
      },
      printElement(array){
        array.forEach(function(v,i){
          console.info(v.docker_port);
        });
      },
      lastStep(){
         let that = this;
         that.$router.push({name:'resConfigure',query:{app_id:that.app_id}});
      },
      nextStep(){
        let that = this;
        that.isSubmit = true;
        
        that.validator();
          if(!that.isPass){
          console.info("阻止了下一步跳跃");
          return ;
        }

         that.pushTheRepeatElement();  
        if(!that.isPass){
           TipBoxService.open("端口不可以重复!", 1); 
          return ;
        }
        //提交
        if(that.appDomain.port == null || that.appDomain.port == undefined){
            that.appDomain.port = {};
        }
        that.appDomain.port = that.port;
        that.appDomain.audit_status="1";//更新状态为待审核
        var myData = that.appDomain;
        that.appDomain.id = that.app_id;
         apiClient.post('itsmApi/application/saveApp',myData,function(data){
          if(data.status == 200){
            //TipBoxService.open("数据保存成功!", 0);
            sessionStorage.removeItem("app_id");   
            that.$router.push({name:'appEnd',query:{app_id:that.app_id}});
          } 
          else{
            TipBoxService.open(data.exception, 1); 
          }
        });
        that.printElement(that.port);
        /*that.$router.push({name:'appEnd',query:{app_id:that.app_id}});*/
      },
      temporySave(){

        let that = this;
        that.isSubmit = true;
        that.isPass = false;
             
         that.validator();
          if(!that.isPass){
          console.info("阻止了下一步跳跃");
          return ;
        }

         that.pushTheRepeatElement();  
        if(!that.isPass){
           TipBoxService.open("端口不可以重复!", 1); 
          return ;
        }                        
       LoadingBoxService.open("正在暂存......");
                    
        that.commonSubmit();
      },
      commonSubmit(){
        let that = this;
        that.appDomain.port=that.port;
        that.appDomain.id = that.app_id;
        var myData =that.appDomain;
        console.info(myData);
        apiClient.post('itsmApi/application/saveApp',myData,function(data){
          if(data.status == 200){
          LoadingBoxService.close();
            TipBoxService.open("暂存成功",0);
            sessionStorage.removeItem("app_id"); 
            LoadingBoxService.close();  
          }
          else{
            TipBoxService.open("暂存失败",1);
              LoadingBoxService.close();  

          }
        });
      },
      validator(){
        let that = this;
        that.isPass = true;
        that.unValidate = [];
        Object.values(that.port).forEach(function(v,i){
          if(v.docker_port == null || v.docker_port == "" || v.docker_port == undefined || v.docker_port.length == 0){
            TipBoxService.open("存在端口为空状态不可提交",1);
            that.isPass = false;
            return ;
          }
         
          var reg = /\D/;
          var flag = !v.docker_port.match(reg);
          if(!flag){
              that.unValidate[i] = "flag";
              TipBoxService.open("端口不允许是非数字", 1);
              that.isPass = false;
              return ;
          }
          //构建全局重复元素集合
         // pushTheRepeatElement();
        //  that.port.forEach(function(v,i){
        //    that.isPass = justifyElementInArray(v);
       //   });
       //  
           
        });
      },
      resetIsPass(text){
        //判断是否全部是数字
        let that= this;
        that.isPass = true;
        that.isSubmit = false;
        console.info("校验未通过：",that.isPass);       
      },     
        returnPage(){
          this.$router.push({name:'appsManager',query:{}})     
        },
        justifyElementInArray(element){
          var count = 0;      
          this.repeatPort.forEach(function(v,i){  
             if(element.docker_port ==v.docker_port){           
                  console.info("--"+count++,element.docker_port);
                  return true;     
          }       
        });     
      },     
      pushTheRepeatElement(){
          this.repeatPort = [];       
          for(var i = 0 ; i < this.port.length;i++){
            for(var j = i+1 ; j < this.port.length;j++){
              if(this.port[i].docker_port == this.port[j].docker_port){           
                this.repeatPort[i] = true  
                this.isPass = false; 
              } 
              else{
                this.repeatPort.push(false);
              }               
           }       
           }
           console.info("得出重复数组为",this.repeatPort);
          }     
          }     
          }  
     </script>  
 <!-- Add "scoped" attribute to limit CSS to this component only -->
<style src="../../css/common/public.css" scoped></style>
<style src="../../css/createApp/netConfigure.css" scoped></style> 
