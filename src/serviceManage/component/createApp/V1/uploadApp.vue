<template>
  <div class="resoubox ">
        <div class="resou-con">
            <div class="w1200 h100">
                <div class="publicNav">
                    <span class="hand" @click="toMain"></span>
                    <span class="active">应用管理</span>
                    <span class="arrows">></span>
                    <span class="active">新建应用</span>
                    <span class="arrows"></span>
                    <div class="returnBtn publicRedBtn" @click="returnPage()">返回</div>
                </div>
                <div class="mode-div lanm-con" :style="{'height':(fullHeight-160)+'px'}">
                    <div class="register">
                        <div class="lanmpege">
                            <div class="lanmp-con">
                                <div class="lanbbag5 ">
                                    <p style="width:36%"></p>
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
                            <div class="iformcon-con2 second_step">
                                <div class="click_upload_file" style="margin: 0px auto;">
                                    <div class="cuf_tp clearfix">
                                    <div class="up_icon" @click="checkNull" > </div>
                                <input class="browseFileInput" type="file" 
                                    id="fileElem" name="upload"  accept=".war" @change="saveFilePath(this)"/>
                                    </div>
                                    <p class="p_support">支持war格式压缩文件（文件最大不超过200M)</p>
                                </div>
                            </div>
                            <div class="showArchivers" style="height:50px;">{{returnPath}}</div>
                        </div>
                        <!--/biaodan-->
                        <div class="buttnet">
                            <span class="butonst" @click="temporySave">暂存</span>
                            <span class="butonstdelet" @click="lastStep">上一步</span>
                            <span class="butonstred" @click="nextStep">下一步</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  import $ from 'jquery'
  import apiToken from '../../../publicJs/apiToken.js'
  import apiClient from '../../../publicJs/ApiClient'
  // import selectComponent from '../../../publicComponent/selectComponent.vue'
  import LoadingBoxService from '../../../publicJs/LoadingBoxService'
  import NoticeBoxService from '../../../publicJs/NoticeBoxService'
  import TipBoxService from '../../../publicJs/TipBoxService'
  export default {
    name: 'uploadApp',
    components:{
      // selectComponent,
    },
    data:function () {
      return {
        fullHeight: document.documentElement.clientHeight, //浏览器可视高度
        app_id:'',
        file:'',
        filePath:'',
        appDomain:{

        },
        returnPath:''
      }
    },
    created(){
      if(this.$route.query.app_id != null && 
         this.$route.query.app_id != undefined && 
         this.$route.query.app_id != ''){
        this.app_id = this.$route.query.app_id; 
        console.info("页面应用ID="+this.app_id);
        this.fetchData();
      }
    },
    methods:{
      checkNull(){
        if(this.returnPath != ""){
            NoticeBoxService.open('确定继续上传吗？再次上传会覆盖原有文件',function(){
            NoticeBoxService.close()
            fileElem.click()
          })
          }else{
            fileElem.click()
          }
      },
      fetchData (){
        let that = this,
        params = {"id":that.app_id};
        console.info(params);
         apiClient.post('itsmApi/application/loadApp',params,function(data){
           that.appDomain = data.results.data[0];
           if(that.appDomain.archiver != null && that.appDomain.archiver != undefined){
            that.returnPath = '上传文件信息'+ data.results.archiver_info ;
           }
       });
      },
      lastStep(){
         let that = this;
         this.$router.push({name:'createApp',query:{app_id:that.app_id}});
      },
      nextStep(){
         let that = this;
         if(this.returnPath == ""){
          TipBoxService.open("请上传war包",2)
         }else{
          setTimeout(this.$router.push({name:'resConfigure',query:{app_id:that.app_id}}),1000);
         }
      },
      toMain(){
        this.$router.push({name:"appsManager"})
      },
      temporySave(){
       // this.commonSubmit();
       if(this.returnPath == ""){
          TipBoxService.open("请上传war包",2)
       }else{
          setTimeout(TipBoxService.open("暂存成功", 0),1500);
       }
       // this.$router.push({name:'resConfigure',query:{app_id:that.app_id}});
      },
      commonSubmit(){
        let that = this;
        LoadingBoxService.open("正在暂存......");
        that.appDomain.id = that.app_id;
        var myData = that.appDomain;
        apiClient.post('itsmApi/application/saveApp',myData,function(data){
          if(data.status == 200){
              LoadingBoxService.close();
          }
          else{
              TipBoxService.open("暂存失败", 1);
                LoadingBoxService.close();
          }
        });
      },
      saveFilePath(data){
         this.file=event.currentTarget.files[0];
         this.filePath=event.currentTarget.files[0].name;
         this.fileUploadHandler();
       },
      
      fileUploadHandler(){
      //encodeURIComponent(JSON.stringify(that.appDomain))
        let that=this;
        console.log(that.app_id)
        LoadingBoxService.open("上传文件请稍候...");
        apiClient.upload('/itsmApi/appAttachment/upload?params='+that.app_id,this.file,'').then(data =>{
          if(data.message == 200){
             LoadingBoxService.close();
              TipBoxService.open("文件上传成功", 0);
              that.returnPath = '上传文件信息：'+data.other;
          }
          else{
            LoadingBoxService.close();
            TipBoxService.open(data.info, 1);
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
<style src="../../css/createApp/uploadApp.css" scoped></style>
