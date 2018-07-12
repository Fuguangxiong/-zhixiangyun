<template>
  <div class="publicContainer"  id="app" >
            <router-view></router-view>
  </div>
</template>
<script>
  export default {
    name: 'app',
    data (){
    	return {
    		
    	}
    }
  }
</script>
<style>
@import "css/charging/newBillingScheme.css";
@import "http://at.alicdn.com/t/font_484230_x1vuwwkzmzql4n29.css";

.ck .el-picker-panel__link-btn{
    display: none;
}
</style>


