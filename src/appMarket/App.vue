<template>
  <div id="app" class="publicContainer">
    <router-view></router-view>
  </div>
</template>

<script>
import '../publicCss/public.css'
import apiToken from '../publicJs/apiToken.js'
import apiClient from '../publicJs/ApiClient.js'
import appPublicJs from './common/public.js'
export default {
  name: 'app',
  data () {
    return {}
  },
  components: {}

}
</script>
<style>
/*@import "http://at.alicdn.com/t/font_421411_x7qlzkld2vdvx6r.css";*/
@import "http://at.alicdn.com/t/font_484230_78u5slglzqwipb9.css";
@import "../resourceCatalog/css/btn.css";
.content .el-carousel__container {
  height: 100%;
}
.el-carousel__indicators--outside {
  position: absolute !important;
  left: 0 !important;
  width: 100%;
  text-align: center;
}
.el-carousel__indicator.is-active button {
  background: #fff;
}
 .el-carousel__item {
  position: relative;
  overflow: hidden;
}

.el-dialog .el-dialog__header {
  height: 40px;
  line-height: 40px;
  padding: 0 20px;
}
.appBannerLeftTop img{
 max-width: 100%;
 max-height: 100%;
}
.searchTermMlogo img{
 max-width: 100%;
 max-height: 100%;
}
.overlayMarket .popupBox {
    width: 440px;
    height: 260px;
    border-radius: 5px;
    margin-left: -220px;
    background-color: initial;
}

.overlayMarket .popupBoxHeader {
    border-radius: 5px 5px 0 0;
}

.overlayMarket .popupBoxBody {
    height: 180px;
    padding-top: 0;
    line-height: 260px;
    color: #898989;
    /* background: url(".././images/deleteIcon.png") no-repeat center 26px; */
    background-color: #fff;
}
.overlayMarket .popupBoxBody.noImages{
    line-height: 120px;
}
.overlayMarket .popupBoxBtnContainer {
    padding-bottom: 0px;
    background-color: initial;
}

.overlayMarket .popupBoxBtnContainer .popupBoxBtn {
    border-radius: 0 0 5px 0;
    margin: 0;
    width: 50%;
    background-color: #e3e3e3;
}

.overlayMarket .popupBoxBtnContainer .redBg {
    background: #55a8fd;
    border-radius: 0 0 0 5px;
}
.scheme-list .el-card{
    border: none;
    box-shadow: none;
    position: relative;
    overflow: visible;
    cursor: pointer;
}
.scheme-list .el-col-4{
    width: auto;
}
.icMove {
    background: url('./images/more.png') no-repeat;
    width: 24px;
    height: 15px;
    display: block;
    cursor: pointer;
}

.icMove:hover {
    background: url('./images/moreH.png') no-repeat;
    width: 24px;
    height: 15px;
    display: block;
}
.appBottomBox{
	padding-top: 15px;
    width: 100%;
    background-color: #fafafa;
}
.appBottom {
    overflow: hidden;
	width: 1220px;
    margin: 0 auto;
	padding: 10px;
	height: 557px;
}
.appBottom div:last-child{
	margin-right: 0px;
}
.apiusemedth .el-tabs__item{
      width: 10%;
      line-height: 18px;
      height: 17px;
      border-right: 1px #eeeeee solid;
    }
  /* 详情页面--选项卡 */
.publicContainer .apiusemedth .el-tabs__nav {
     padding-left: 0px;
      position: static;
}
  .apiusemedth .el-tabs__active-bar {
    background-color: #fb6233;
    top: 26px;
   }
.publicContainer .apiusemedth  .el-tabs__header {
    border-bottom: 1px solid #eeeeee;
    padding-bottom: 10px;
    position: relative;
    /* margin: 0 0 40px; */
}
.apiusemedth .el-tabs__item.is-active {
    color: #fb6233;
}
.publicContainer .apiusemedth  .el-tabs__nav-wrap {
     position: initial!important;;
}
</style>
