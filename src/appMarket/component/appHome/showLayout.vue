<template>
  <div class="formaCon domeheig">
  
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
import apiClient from '../../../publicJs/ApiClient.js'
export default {
  props: {
    msg: {},
    serviceId: {},
    isRefresh: ''
  },
  watch: {
    msg: function (nv, ov) {
      this.id = this.serviceId
      this.isNew = false
      this.areas = JSON.parse(this.msg.combination_page_config.areas)
      this.title = this.msg.combination_page_config.title
    }
  },
  data () {
    return {
      apiBaseUrl: apiClient.apiBaseUrl,
      isNew: true,
      id: '',
      title: '', // 组合服务名称
      areas: [] // 页面数据
    }
  },
  methods: {
    // 打开编辑页面
    onEdit () {
      this.$emit('edit', 'page')
    },
    // 转换服务展示内容文字
    setTypeText (str) {
      let text = str === '2' ? '一个网页' : '数据'
      return text
    }
  }
}
</script>

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
.formaCon {
  width: 730px;
  margin: 0 auto;
  overflow: hidden;
  font-size: 12px;
}
.upcnl {
  position: absolute;
  right: 4px;
  top: 3px;
}
.formaCon.showBlck {
  display: block
}

.rightBody-con{
	position:relative;
	 
}
.layout-left-list .draggable>img {
  width: 14px;
  height: 14px;
  vertical-align: middle;
  margin-right: 5px;
}
/* layout-right */

.layout-right {
  position: absolute;
  left: 220px;
  right: 10px;
  top: 10px;
  bottom: 10px;
}
.layout-right-title {
  width: 100%;
  height: 30px;
  height: 30px;
  margin-bottom: 10px;
  font-size: 20px;
  color: #74a6fa;
  letter-spacing: 1px;
  /* font-weight: bold; */
  text-align: center;
}
.layout-right-con {
  position: absolute;
  left: 0;
  right: 0;
  top: 40px;
  bottom: 90px;
  padding: 10px;
  box-shadow: 1px 1px 5px #ccc;
  overflow-y: auto;
}
.layout-right-add {
  position: relative;
  width: 102px;
  height: 60px;
  line-height: 60px;
  text-align: center;
  font-size: 28px;
  border: 1px #f1f1f1 solid;
  color: #f1f1f1;
  cursor: pointer;
}
.layout-right-add:hover {
  color: #74a6fa;
  border: 1px solid #74a6fa;
}
.layout-right-area {
  position: relative;
  border: 1px solid #f1f1f1;
  margin-bottom: 10px;
  min-height: 130px;
}
.layout-right-area:after {
  content: "";
  display: block;
  width: 100%;
  height: 10px;
  clear: both;
}
.layout-right-area>i, .layout-right-service>i {
  position: absolute;
  top: 5px;
  right: 10px;
  transform: scale(0.8, 0.8);
  cursor: pointer;
}
.layout-right-service>i {
  top: 1px;
  right: 8px;
}
.layout-right-area>i:hover, .layout-right-service>i:hover {
  color: #74a6fa;
}
.layout-right-area .layout-right-area-title {
  width: 100%;
  padding: 7px 10px;
  border: none;
  border-bottom: 1px solid #f1f1f1;
  font-size: 12px;
}
.layout-right-service {
  position: relative;
  float: left;
  width: 48%;
  height: 100px;
  margin: 10px 1% 0 1%;
  border: 1px solid #74a6fa;
}
.layout-right-service>h5 {
  width: 100%;
  height: 20px;
  padding: 6px 10px 0 10px;
  font-size: 12px;
  color: #74a6fa;
}
.layout-right-service>div {
  position: absolute;
  top: 50%;
  width: 100%;
  padding: 0 5px;
  transform: translate(0, -50%);
  text-align: center;
  vertical-align: middle;
}
.layout-right-service>div>img {
  display: inline-block;
  width: 24px;
  height: 24px;
  margin-right: 5px;
}
.layout-right-service>div>span {
  vertical-align: middle;
}

</style>
