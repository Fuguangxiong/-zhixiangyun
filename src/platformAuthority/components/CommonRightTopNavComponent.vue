<template>
  <div class="commonLayoutRightTopContainer">
    <div class="breadCrumb">
      <i @click="" class="iconfont icon-dingwei"></i>
      <router-link :to="item.link" v-for="(item,index) in links" :key="index">{{item.name}}</router-link>
    </div>
    <div class="commonLayoutRightTopSearchContainer" v-if="!noInput">
      <input v-model="searchStr" class="commonLayoutRightTopSearchInput" :placeholder="searchname" v-on:keyup.enter="searchClickHandler()" />
      <div class="commonLayoutRightTopSearchBtn" v-on:click="searchClickHandler"></div>
    </div>
  </div>
</template>
<script>
    export default{
      data: function () {
        return {
          searchStr: ''
        }
      },
      watch: {
        searchword: function (val) {
          this.searchStr = val
        }
      },
      props: {
        links: '',
        searchname: '',
        searchword: '',
        noInput: ''
      },
      methods: {
        searchClickHandler: function () {
          let str = this.searchStr
          this.$emit('search', str)
        }
      }
    }
</script>

<style scoped>
.breadCrumb {
  box-shadow: none;
  float: left;
}
.breadCrumb > a:last-of-type::before {
  content: '';
}
</style>

