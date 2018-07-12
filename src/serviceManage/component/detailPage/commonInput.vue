<template>
  <div class="boxBody" id="boxBody">
	<div class="boxst">
      <div id="inputData">
        <form method="post">
          <table  cellspacing="0" cellpadding="0" align="center" rules="rows" class="personForm" >
            <tr v-for="(item,index) in formData">
                <th class="key"><span class="required">*</span>{{formData[index].describe}}:</th>
                <th class="value borderLeft">
                    <input name="item" class="" type="text" v-model="formData[index].value" >
                </th>
            </tr>
          </table>
            <div class="formEnd" align="center">
                <button type="button" class="btn btn-danger" @click="sumitBtnHandler">提交</button>
            </div>
        </form>
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
import 'element-ui/lib/theme-default/index.css'

import '@/css/rc/button.css'
import '@/css/rc/table.css'
import Bootstrap from 'bootstrap/dist/js/bootstrap.min.js'
import JqUI from '../../libTest/jquery-ui.min.js'

export default {
  name: 'CommonInput',
  data(){
        return{           
          formData:'',
          serviceId:'',
          serviceInfo:""
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
								
		},
    methods: {
      sumitBtnHandler(){
        var that=this;
        var total=that.formData.length;
        var data=new Object();
        for(var i=0;i<that.formData.length;i++){
            var obj=that.formData[i];
            data[obj.name]=obj.value;            
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
          console.log("调用结果---》",data);
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

    }
}
</script>
<style scoped>
  table{
    margin-top: 10px;
  }
  button{
    margin-top: 10px;
  }
</style>
