<template>
  <div class="SDKdownload">
      <public-header ></public-header>
      <div class="head">
          <p>
              <img src="../../images/SDKtext.png" alt=""><br>
              智享云开发者平台为您提供了多种不同版本的SDK工具包，您可以按照您的的需求选择下载。
          </p>
      </div>
      <div class="main">
          <div class="content">
              <div class="part1"  @click="toDetail()">
                  <img src="../../images/java2.png">
              </div>
              <div class="part2">
                  <img src="../../images/php.png">
                  <div class="tip">
                      <span>PHP SDK(开发中，敬请期待)</span>
                  </div>
              </div>
              <div class="part3">
                  <img src="../../images/python.png">
                  <div class="tip">
                      <span>Python SDK(开发中，敬请期待)</span>
                  </div>
              </div>
          </div>
      </div>
      <public-footer></public-footer> 
  </div>
</template>
<script>

import header from '../publicComponent/openPlatformTopNav.vue'
import footer from '../publicComponent/footer.vue'
export default {
  name: 'SDKdownload',
  data () {
    return {

    }
  },
  components: {
    'public-header': header,
    'public-footer': footer
  },
  methods: {
    // 详情
    toDetail () {
      this.$router.push({
        path: '/sdkJavaDetail'
      })
    }
  }
}
</script>
<style scoped>
.SDKdownload .head{
    width: 100%;
    height: 191px;
    background-image: url('../../images/sdkbg.png');
    text-align: center;
    margin-top: 66px;
}
.SDKdownload .head>p{
    line-height: 70px;
    color: #fff
}
.SDKdownload .head>p>img{
    margin-top: 70px;
}
.SDKdownload .main{
    height: 281px;
    width: 100%; 
}
.SDKdownload .content{
    width: 1200px;
    height: 100%;
    margin: 0 auto;
}
.SDKdownload .content>div{
    display: inline-block;
    width: 31%;
    height: 200px;
    margin-top: 40px;
    border-radius:4px;
    text-align: center;
    line-height: 196px;
    position: relative;
    cursor: pointer;
}
.SDKdownload .part1{
    margin-right: 3%;
    background:linear-gradient(to bottom,#7ff2e1,#61c3b5);
    border:2px solid #58dbc8;
}
.SDKdownload .part2{
    background:linear-gradient(to bottom,#f8c791,#ffa94d);
    border:2px solid #fe9c33;
}
.SDKdownload .part3{
    margin-left: 3%;
    background:linear-gradient(to bottom,#93d8fe,#4bb5f0);
    border:2px solid #48b6f3;
}
.SDKdownload .part2 span{
    color: #ff9420
}
.SDKdownload .part3 span{
    color: #4fb7f1
}
.SDKdownload .tip{
    height: 49px;
    width: 99.5%;
    text-align: center;  
    background: #fff;
    border-radius:2px;
    position: absolute;
    top: 147px;
    left: 1px;
    line-height: 49px;
}
</style>
