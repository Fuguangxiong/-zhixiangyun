<template>
  <div class="boxBody" id="boxBody">
		<div class="boxst">
      <div class="voiceBox" id="inputData">
        <div class="pleaseSpeak" v-show="isRadioShow">请讲话……</div>
        <div class="pleaseSpeak" v-show="isEndShow">录音完毕</div>
        <div class="beginRadio" @click="beginRadio" v-show="isBeginShow">
        	
        </div>
        <div class="endRadio" @click="endRadio" v-show="isRadioShow">
        	
        </div>
        <!--
        <img @click="endRadio" src="../../img/dialogue.png" height="117" width="300" alt="" v-show="isBeginShow">
        <img @click="endRadio" src="../../img/dialogue.gif" height="117" width="300" alt="" v-show="isRadioShow">
        -->
      </div>
		</div>	

    <div class="overlay" v-show="visible">
      <div class="popupBox">
        <div class="popupBoxHeader">{{buttonNum}} </div>
        <div class="popupBoxBtnContainer">
          <div class="popupBoxBtn redBg" v-on:click="endBtnHandler">结束</div>
        </div>
      </div>
    </div>
	</div>	
</template>

<script>
// import leftNav from '@/components/partComponents/leftNav'
// import leftMenu from '@/components/serviceManager/leftMenu/LeftMenu'
import TipBoxService from "../common/TipBoxService.js";
import LoadingBoxService from '../../publicService/LoadingBoxService'
import HttpService from '../../publicService/HttpService'
// import 'bootstrap/dist/css/bootstrap.min.css'
import 'element-ui/lib/theme-default/index.css'
import Bootstrap from 'bootstrap/dist/js/bootstrap.min.js'
import JqUI from '../../libTest/jquery-ui.min.js'

export default {
  name: 'CommonInputVoice',
  data(){
        return{
          isRadioShow:false, 
          isBeginShow:true, 
          isEndShow:false,    
          formData:'',
          serviceId:'',
          serviceInfo:"",
          buttonNum: 60,
          intervalId: "",
          visible: false,
          voiceWord:"2017-9-8,17:22:44,车牌号渝F25311,在高速G65包茂高速武隆至黔江段,汽车抛锚",  //测试数据
          }
    },
    created(){
      var data = this.$route.query.paramData;
      if(data != ""){
        this.formData=JSON.parse(data);
      }
      this.serviceId=this.$route.query.serviceId;
      var serviceInfo = this.$route.query.serviceInfo;
      if(serviceInfo != ""){
          this.serviceInfo = JSON.parse(serviceInfo);
      }
    },
    mounted() {
				// 清空倒计时
        clearInterval(this.intervalId);			
		},
    methods: {
      beginRadio(){
        this.isBeginShow = false;
        this.isRadioShow = true;
        this.isEndShow = false;
      },
      endRadio(){
        this.isRadioShow = false;
        this.isBeginShow = true;
        this.isEndShow = true;
        this.sumitBtnHandler();
      },
      sumitBtnHandler(){
        var that=this;
        var total=that.formData.length;
        var data=new Object();
        for(var i=0;i<that.formData.length;i++){
            var obj=that.formData[i];
            data[obj.name]=that.voiceWord;            
        }
        console.log("j----",JSON.stringify(data));
        LoadingBoxService.open("正在上传表单请稍候...");
        var url = "";
        if(that.serviceInfo.isatomic == "false"){
          data.service_id = that.serviceId;
          LoadingBoxService.close();
          that.$router.push({name:'sevPageView',query:{params:JSON.stringify(data)}});
        }else{
          url = "itsmApi/atomicService/commitAtomic/";
           HttpService.link(url,{serviceId:that.serviceId,param:JSON.stringify(data)},function(data){
          LoadingBoxService.close();
          if(data.status == '200'){
           if(data.results.flag == '3'){
              that.$router.push({name:'CommonOutput',query:{type:"json",outputData:JSON.stringify(data.results.data.data),serviceInfo:JSON.stringify(that.serviceInfo)}});
            }else{
              that.$router.push({name:'CommonOutput',query:{type:"page",outputData:JSON.stringify(data.results.data.data),serviceInfo:JSON.stringify(that.serviceInfo)}});
            }
          }
          else if(data.status = '503'){
            TipBoxService.open("调用失败："+data.exception,1);
          }
        });
        }
       
      },
        startBtnHandler(){
        var that=this;
        that.visible = true;
         const ti = setInterval(() => { 
              if (that.buttonNum === 0) {
                  that.buttonNum = 60;
                  clearInterval(ti);
                  that.visible = false;
              } else {
                  that.buttonNum = that.buttonNum - 1;
              }
          }, 1000);
         that.intervalId = ti;
        //  HttpService.link('services/voice/listenerStart/',{},function(data){
        //    var dataJson = data != "" ? JSON.parse(data) : null;
        //   if(dataJson.status == '200'){         
            
        //   }
        //   else{
        //     TipBoxService.open("获取信息失败："+dataJson.exception,1);
        //   }
        // });




         $.ajax({
          url: 'http://192.168.38.193:8087/iscloud-atomic-server/services/voice/listenerStart/1',
          type:'get',
          data:{},
          headers: {'X-Auth-Token': "1"},
          success:function (data) {
            console.log("llllll====",data);
            if(data.status!=200){
              LoadingBoxService.close();
              //TipBoxService.open('访问异常，请重试！',2);
              try{                
                
              }catch(e){
                console.info("linkErro=",e);
              }
              console.info("访问异常错误信息=",data.msg);
            }
            else{
              try{
                callback(data);
              }catch(e){
                console.info("linkErro=",e);
              }
            }
          },
          error:function (XMLHttpRequest, textStatus, errorThrown) {
            LoadingBoxService.close();
            if(XMLHttpRequest.status==401){
              window.location.href=Constants.platformLoginUrl;
            }
            else{
              TipBoxService.open('访问异常，请重试！',2);
              try{
                callback("error");
              }catch(e){
                console.info("linkErro=",e);
              }
              console.info("errorText=",textStatus);
            }

          }
        });
      },
      endBtnHandler(){
         var that=this;         
        that.visible = false;
        clearInterval(that.intervalId);
        that.buttonNum = 60;
        //  HttpService.link('services/voice/listenerStop/',{},function(data){
        //     var dataJson = data != "" ? JSON.parse(data) : null;
        //   if(dataJson.status == '200'){           
        //     alert(dataJson.result.voiceWord);
        //     that.voiceWord = dataJson.result.voiceWord;
        //   }
        //   else{
        //     TipBoxService.open("获取信息失败："+dataJson.exception,1);
        //   }
        // });
         $.ajax({
          url: 'http://192.168.38.193:8087/iscloud-atomic-server/services/voice/listenerStop/1',
          type:'get',
          data:{},
          headers: {'X-Auth-Token': "1"},
          success:function (data) {
            console.log("2222222====",data);
           var dataJson = data != "" ? JSON.parse(data) : null;
          if(dataJson.status == '200'){
            LoadingBoxService.close();           
            alert(dataJson.result.voiceWord);
//            that.voiceWord = dataJson.result.voiceWord;
          }
            else{
              try{
                callback(data);
              }catch(e){
                console.info("linkErro=",e);
              }
            }
          },
          error:function (XMLHttpRequest, textStatus, errorThrown) {
            LoadingBoxService.close();
            if(XMLHttpRequest.status==401){
              window.location.href=Constants.platformLoginUrl;
            }
            else{
              TipBoxService.open('访问异常，请重试！',2);
              try{
                callback("error");
              }catch(e){
                console.info("linkErro=",e);
              }
              console.info("errorText=",textStatus);
            }

          }
        });

      }

    }
}
</script>
<style scoped>
  .voiceBox{
    margin-top: 10%;
    margin-left: 38%;
  }
  .voiceBox img{
    cursor: pointer;
  }
  .beginRadio{
  	background-image:url(../../img/dialogue.png);
  	height:117px;
  	width:230px;
  	cursor: pointer;
  }
  .endRadio{
  	background-image:url(../../img/dialogue.gif);
  	height:117px;
  	width:300px;
  	cursor: pointer;
  }
  
  .pleaseSpeak{
    font-size: 20px;
    font-weight: 500;
    float: left;
    margin-top: -80px;
    margin-left: 13%;
  }
</style>
