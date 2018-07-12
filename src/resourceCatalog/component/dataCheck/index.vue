<template>
  <div class="w1200menu datacheckBox">
     <TabList :type="type" @changeTab="changeDataType" />
     <router-view style="overflow:auto;position:absolute;top:0px;bottom:0;left:60px;right:15px" class="rightBox"  @changeTab="changeDataType"></router-view>
  </div>
</template>

<script>
import TabList from './TabList'
export default {
  name: 'DataCheck',
  data () {
    return {
      type: 'result'
    }
  },
  methods: {
    changeDataType (type) {
      this.type = type
    }
  },
  components: {
    TabList
  },
  mounted () {
    let href = window.location.href
    let endIndex = href.indexOf('?')
    let startIndex = href.lastIndexOf('/')
    let urlType
    if (endIndex === -1) {
      urlType = href.substr(startIndex + 1)
    } else {
      urlType = href.substr(startIndex + 1, endIndex - startIndex - 1)
    }
    // console.log(urlType)
    this.type = urlType
  },
  updated () {
    let href = window.location.href
    let endIndex = href.indexOf('?')
    let startIndex = href.lastIndexOf('/')
    let urlType
    if (endIndex === -1) {
      urlType = href.substr(startIndex + 1)
    } else {
      urlType = href.substr(startIndex + 1, endIndex - startIndex - 1)
    }
    // console.log(urlType)
    this.type = urlType
  }
}

</script>

<style scoped>
.datacheckBox {
  position: absolute;
  top: 15px;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 15px;
}
.rightBox {
  padding: 15px;
  padding-top: 0;
  background-color: #fff;
}
</style>

