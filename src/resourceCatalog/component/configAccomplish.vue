<template>
  <div class="publicContent">
   <!-- <left-nav :selectIndex="2"></left-nav> -->
   <!-- <div class="publicNav">
    <img src="../../publicImages/home.png" @click="goHome" style="cursor:pointer;">
    <router-link :to="{name:'LoadingData'}">个人注册</router-link>
    <span class="arrows">></span>
    <span class="active">数据库类</span>
  </div> -->
  <div class="breadCrumb">
      <i @click="goHome" class="iconfont icon-dingwei"></i>
      <router-link :to="{name:breadCrumbPage}">{{breadCrumb1}}</router-link>
      <span class="active">{{breadCrumb2}}</span>
  </div>
  <div class="loadDataBox" style="overflow:auto;overflow-x: hidden; position:absolute;top:48px;bottom:0;left:1px;right:0">
    <!-- 步骤 -->
    <div class="lanmpege">
      <div class="lanmp-con">
        <div class="lanbbag ">
          <p style="width:100%"></p>
        </div>
        <div class="lanbag-text">
          <span class="tim1">基本信息</span>
            <span class="tim2">配置信息</span>
            <span class="tim3">数据字段</span>
            <span class="tim4">配置完成</span>
        </div>
      </div>
    </div>
    <!-- 主体内容 -->
    <div class="iformcon">
      <div class="iformcon-con reg4">
        <i class="iconfont icon-shenqingguanli pictureone"></i>
        <div class="tonggo">恭喜您，您的数据注册已成功提交！</div>
      </div>
    </div>
    <!-- 下一步 -->
    <div class="fenye">
      <button class="btnBlue" @click='goPersonRegister'>确定</button>
    </div>
  </div>
</div>
</template>
<script>
  // import apiClient from '@/publicJs/ApiClient.js'
  // import leftNav from '../partComponents/leftNav'
  export default{
    name: 'configAccomplish',
    data () {
      return {
        breadCrumb1: '',
        breadCrumb2: '',
        breadCrumbPage: ''
      }
    },
    created () {
      if (this.$route.query.type === 'person') {
        this.breadCrumb1 = '个人注册'
        this.breadCrumb2 = '数据库类'
        this.breadCrumbPage = 'personRegisterManage'
      } else if (this.$route.query.type === 'register') {
        this.breadCrumb1 = '注册管理'
        this.breadCrumb2 = '注册数据资源'
        this.breadCrumbPage = 'registerManageAdministrator'
      }
    },
    methods: {
      goPersonRegister () {
        this.$router.push({path: '/personRegisterManage'})
        // this.$parent.leftNavData[3].active = true
        // this.$parent.leftNavData[4].active = false
        this.$parent.setActive('资源管理', '我的注册')
      },
      goHome () {
        this.$router.push({name: 'Index'})
        this.$parent.setActive('资源管理', '资源目录')
      }
    }
  }
</script>
<style src="" scoped>

.publicNav{
  box-sizing: border-box;
  padding: 15px; 
      height: 45px;
    background-color: #fff;
    -webkit-box-shadow: 0 0 5px #ccc;
    box-shadow: 0 0 5px #ccc;
    border-radius: 1px
}
.publicNav img{
  width: 16px;
  height: 15px;
  background-size: cover;
}
.pictureone{

  font-size: 81px;
  color:#57A8FA;
  position: relative;
  left: 46%;
}
.lanmpege{
    background: #ffffff;
    height: 90px;
    width:100%;
}
.lanmp-con{
    width:918px;
    margin: 0 auto;
    padding-top: 30px;
}
.lanbbag{
    background: url("../../publicImages/1.png") no-repeat;
    width:861px;
    height: 34px;
    background-size: cover
}
.lanbbag p{
    background: url("../../publicImages/2.png") no-repeat;
    /* width:861px !important; */
    height: 34px;
    background-size: cover
}
.iformcon{
    height: 234px;
}
/* .iformcon-con{
    width:730px;
} */
.lanbag-text{
    width:992px;
    margin-top: 5px;
    position: relative;
}
.lanbag-text span:nth-child(1){
  position:absolute;
  left: -10px;
  top:0;
}
.lanbag-text span:nth-child(2){
  position:absolute;
  left: 55px;
  top:0;
}
.lanbag-text span:nth-child(3){
  position:absolute;
  left: 330px;
  top:0;
}
.lanbag-text span:nth-child(4){
  position:absolute;
  left: 604px;
  top:0;
}

.lanbag-text span{
	font-size: 14px;
}
.lanbag-text span.tim2,.lanbag-text span.tim3,.lanbag-text span.tim4{
    margin-left: 209px;
}
/* 主体 */
.iformcon{
    margin: 107px 0 38px 0;
}
.iformcon-con.reg4 .tonggo {
    font-size: 24px;
    /* background: url(../img/dui.png) no-repeat; */
    line-height: 70px;
    padding-left: 35px;
    
    width: 464px;
}
.tonggo{
    margin: 0 auto;
}
/* 完成 */
.fenye {
    border-top: 1px #d9d9d9 dashed;
    height: 80px;
    width: 98%;
    margin: 0 auto;
    text-align: center;
    padding-top: 30px;
}
.butonstred {
    border-radius: 3px;
    border: 1px #b61717 solid;
    text-align: center;
    font-size: 14px;
    background: #b61717;
    color: #fff;
    line-height: 28px;
    cursor: pointer;
    padding: 0 12px;
}
.lanbag-text span.tim1,.lanbag-text span.tim2,.lanbag-text span.tim3,.lanbag-text span.tim4{
    color:#58A6F9
}
.tim1,.tim2,.tim3,.tim4{
  font-size: 14px !important;
}
</style>
