<template>
  <div class="formaCon domeheig">
    <div class="contentBox" v-show='isNew'>
      <div class="leftBox" @click='onEdit'>
        <div class="ltext">页面布局</div>
      </div>
      <div class="rightBox">
        <span class="mgsText">*</span>
        <p>即服务页面样式设计，是对展现页面的栏目、原子服务及其相关内容进行格式化设置。包括栏目布局、栏目展示标题、原子服务的展示标题、区</p>
      </div>
    </div>
    <div class="rightBody-con" v-show='!isNew'>
      <div v-for="(area,index) in areas" 
          :key='index' 
          :id='area.id+"_show_layout"'
          :data-index='index'
          class="layout-right-area">
        <div class='layout-right-area-title'>{{area.title ||"无标题"}}</div>

        <!-- start: 服务 -->
        <div v-for="(service,indexChild) in area.sevs" 
            :key="index+'_'+indexChild" 
            :id='service.sev_id+"_show_layout"'
            :data-indexChild='indexChild'
            class="layout-right-service"
            :style="'width:'+service.width">
          <h5>{{service.sev_name}}</h5>
          <div>
            <img v-if='service.sev_img=="logo-sm-default.jpg" || !service.sev_img' src="../../images/logo-sm-default.jpg" />                    
            <img v-if='service.sev_img!="logo-sm-default.jpg" && service.sev_img' :src="apiBaseUrl +'/itsmApi/attachment/show?imgPath='+service.sev_img" />                    
            <span>此区域展示内容为{{setTypeText(service.stype)}}</span>
          </div>
        </div>
        <!-- end: 服务 -->
      </div>
    </div>
  </div>
</template>
<script>
import apiClient from "../../../publicJs/ApiClient.js";
export default {
  props: {
    msg: {},
    serviceId: {},
    isRefresh: 0
  },
  watch: {
    isRefresh: function(nv, ov) {
      
      if (nv !== ov) {
        this.id = this.serviceId;
        if (this.msg.combination_page_config) {
					this.isNew = false;
          this.areas = [...this.msg.combination_page_config.areas];
          this.title = this.msg.combination_page_config.title;
        }else{
					this.isNew = true;
          this.areas = [];
          this.title = '';
        }
      }
    }
  },
  data() {
    return {
      apiBaseUrl: apiClient.apiBaseUrl,
      isNew: true,
      id: "",
      title: "", //组合服务名称
      areas: [] // 页面数据
    };
  },
  methods: {
    //打开编辑页面
    onEdit() {
      this.$emit("edit",'page');
    },
    //转换服务展示内容文字
    setTypeText(str) {
      let text = str === "2" ? "一个网页" : "数据";
      return text;
    },
  }
};
</script>
<style src="../../css/createCombinationServeice/newComStyle.css" scoped></style>
<style src="../../css/detailPage/pageShow.css" scoped></style>
<style src="../../css/createCombinationServeice/setLayout.css" scoped></style>
<style scoped>
/* 新建提示信息 */
.contentBox {
  padding: 20px 0;
  float: left;
}
.leftBox {
  cursor: pointer;
  z-index: 2;
  width: 102px;
  height: 72px;
  border: 1px #cccccc solid;
  border-radius: 3px;
  position: relative;
  float: left;
  background: url(../../images/addimglog.png) center 10px no-repeat;
}
.ltext {
  position: absolute;
  width: 100%;
  height: 22px;
  background-color: #f9f9f9;
  bottom: 0;
  text-align: center;
  line-height: 22px;
  left: 0;
  color: #666;
}
.rightBox {
  position: relative;
}
.rightBox p {
  padding-left: 120px;
  color: #333;
  font-size: 12px;
  line-height: 22px;
}
.mgsText {
  position: absolute;
  top: 2px;
  left: 104px;
  color: red;
}
.rightBody-con{
  padding:20px 0;
}
</style>