<template>
  <div class="publicContainer">
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
@import "http://at.alicdn.com/t/font_484230_j14ym9q1794tpgb9.css";
@import "./css/public.css";

    .apiusemedth .el-tabs__item{
      width: 10%;
    }
    .publicContainer .apiusemedth .el-tabs__nav {
      padding-left: 0px;
    }
    /* 每日申请服务报表-------修改时间选择框的高度 */
    .dayApply .el-date-editor .el-input__inner {
      border: 1px solid #f2f2f2;
      height: 28px;
    }
</style>

