<template>
  <div class="collection sm-search-page">
    <div class="conCent">
      <!-- <div class="rise">
        <span class="textTlie">服务管理 · 服务检索</span>
      </div> -->
      <breadcrumb :data="breadcrumb"></breadcrumb>
    </div>

    <div class="sm-search">
      <span class="sm-search-input">
        <input type="text" v-model="keywords" @keyup.enter="onQuery" placeholder="请输入关键字搜索" />
      </span>
      <button @click='onQuery' class="sm-search-btn">搜索</button>
      <el-button @click='toAdvancedSearch' class='sm-search-advance-btn' type="text">高级检索</el-button>
    </div>
  </div>
</template>

<script>
import breadCrumb from '../../../personalConsole/component/publicComponent/breadCrumb'
export default {
  name: "search",
  components: {
    'breadcrumb': breadCrumb,
  },
  data() {
    return {
      breadcrumb: [{name: '服务管理', link: '/epsearch'}, {name: '企业服务', link: ''}],
      keywords: ""
    };
  },
  mounted() {
    this.$parent.setActive('服务管理','服务检索');
  },
  methods: {  
    onQuery() {
      let vm=this;
      vm.$router.push({
        name: "searchResult",
        query: { keywords: vm.keywords }
      });
    },
    toAdvancedSearch() {
      this.$alert("抱歉，该功能尚未开放！", "提示", {
        confirmButtonText: "确定",
        callback: action => {}
      });
    }
  }
};
</script>
<style>
.sm-search-page {
  padding: 10px;
  background: #fff;
  position: relative;
  min-height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
}
.sm-search-page .conCent .rise {
  border-bottom: 1px #f1f1f1 solid;
  padding-bottom: 8px;
  margin-bottom: 10px;
}
.sm-search-page .conCent .rise .textTlie {
  position: relative;
  padding-left: 8px;
  line-height: 12px;
}
.sm-search-page .conCent .rise .textTlie::after {
  content: "";
  position: absolute;
  left: 0;
  top: 2px;
  width: 2px;
  height: 10px;
  border-radius: 2px;
  background-color: #55a8fd;
}
.sm-search-page .sm-search {
  position: absolute;
  top: 40%;
  left: 50%;
  width: 720px;
  height: 40px;
  transform: translateX(-50%);
}
.sm-search-page .sm-search-input {
  display: inline-block;
  width: 510px;
  height: 40px;
  margin-right: 5px;
}
.sm-search-page .sm-search-input>input {
  -webkit-appearance: none;
  background-color: #fff;
  background-image: none;
  border-radius: 4px;
  border: 1px solid #d8dce5;
  box-sizing: border-box;
  display: inline-block;
  font-size: 14px;
  height: 40px;
  line-height: 1;
  outline: none;
  padding: 0 15px;
  transition: border-color .2s cubic-bezier(.645,.045,.355,1);
  width: 100%;
  box-shadow: 0px 1px 6px rgba(0,0,0,0.12);
}
.sm-search-page .sm-search-input>input:focus {
    outline: none;
    border-color: #409eff;
}
.sm-search-page .sm-search-btn {
  display: inline-block;
  width: 94px;
  height: 40px;
  line-height: 36px;
  margin-right: 42px;
  background: #55a8fd;
  text-align: center;
  color: #fff;
  border: 1px solid #66a1ec;
  border-radius: 3px;
  font-size: 14px;
  letter-spacing: 2px;
}
.sm-search-page .sm-search-btn:hover {
  background: #639fea;
  border: 1px solid #5a90d4;
}
.sm-search-advance-btn{
  transform: translateY(10px);
}
.sm-search-advance-btn>span{
  text-decoration: underline;
}

</style>
