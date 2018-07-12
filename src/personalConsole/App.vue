<template>
  <div class="publicContainer" id="appVue">
    <router-view></router-view>
  </div>
</template>
<script>
  export default {
    name: 'app',
    data () {
      return {
  
      }
    }
  }
</script>
<style>
@import "http://at.alicdn.com/t/font_484230_5xu207aik4jthuxr.css";
@import "./css/common.css";
.publicRightBottomContentContainer{
    background-color: #fff;
    overflow-y: auto;
}
.el-pagination{
  text-align: center;
}
.listbottom pre {
   display: block;
    padding: 9.5px;
    margin: 0 0 10px;
    font-size: 12px;
    line-height: 24px;
    color: #333;
    word-break: break-all;
    word-wrap: break-word;
    background-color: #ffffff;
    border: 0px;
    border-radius: 4px;
    width: 100%;
    height: 242px;
    max-width: 918px;
    white-space: pre-wrap;
}
.block{
  margin-top: 10px;
}
.score .xingxingCon .el-rate  .el-rate__icon{
  font-size: 15px;
  margin-right: 6px;
  color: #bfcbd9;
  transition: .3s;
}
.score .xingxingCon .el-rate .icon-xing1-copy{
  font-size: 18px;
}
.block{
  margin-top: 10px;
}
</style>
