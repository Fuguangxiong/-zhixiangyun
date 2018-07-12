<template>
    <div class="bottomFooter1">
   <div class="bottomFooter">
<div class="appFooter">
    <div class="appFooterAll">
        <div class="appFooterLogo" @click='goHome'>
            <img src="../../images/hui_logo.png" />
        </div>
        <div class="appFootercontent">
            <h3 class="jeIcon ilco">解决方案</h3>
            <ul>
                <li  @click="goNet('http://is-cloud.cn/platform/page/jsp/statichtml/introduce2.jsp')">智享云平台</li>
                <li  @click="goNet('http://is-cloud.cn/platform/page/jsp/statichtml/zxyNeican2.jsp')">企业内参分析</li>
                <li  @click="goNet('http://is-cloud.cn/platform/page/jsp/statichtml/zhinengtougu2.jsp')">智能投顾</li>
                <li  @click="goNet('http://is-cloud.cn/platform/page/jsp/statichtml/jingping2.jsp')">行业竞品分析</li>
                <li  @click="goNet('http://is-cloud.cn/platform/page/jsp/statichtml/fengkong2.jsp')">企业风控</li>
            </ul>
        </div>
        <div class="appFooterRigth">
            <h3 class="jeIcon lix">联系我们</h3>
            <p class="jeIcon ico1">合作咨询：010-58847053</p>
            <p class="jeIcon ico2">企业地址：北京市朝阳区北苑路甲13号院北辰泰岳大厦</p>
            <p class="jeIcon ico3">友情链接：<span @click='goNet("http://www.ultrapower.com.cn")'>神州泰岳官网</span><span @click='goNet("http://is-cloud.cn")'>智享云平台</span></p>
        </div>
    </div>
</div>

</div>
    <div class="fobottm">Copyright © 2017  北京神州泰岳软件股份有限公司          京ICP备15016125号-2</div>
    </div>
</template>
<script>
  export default{
    name: 'foot',

    data () {
      return {
        tokenId: ''
      }
    },
    mounted () {
      this.tokenId = this.$route.query.token
    },
    methods: {
      goHome () {
        this.$router.push({name: 'appHome', query: {token: this.tokenId}})
      },
      goNet (url) {
        window.open(url)
      }
    }
  }
</script>
<style scoped>
.fobottm{
    background: #24282d;
    line-height: 30px;
    color: #ccc;
    text-align: center;
}
.bottomFooter{
    background: rgb(67,67,67);
    padding: 0 5vw;
    box-sizing: border-box;
}
.appFooter{
    box-sizing: border-box;
    overflow: hidden;
    padding-left: 250px;
    padding-right:435px;
    height: 177px;
    width: 1200px;
    margin: 0 auto;
    position: relative;

}
.appFooterLogo {
    position: absolute;
    left: 0;
    height: 100%;
    padding-top: 60px;
    float: left;
    cursor: pointer;
}
.appFootercontent{
    width: 100%;
    padding-top: 35px;
    box-sizing: border-box;
    height: 100%;
    float: left;
    color: #fff;
}
.appFooterRigth{
    position: absolute;
    right: 0;
    top:25px;
    width:435px;
    color: #fff;
    /* background: url(../../images/footerLine.png) left 0px no-repeat; */
    padding-left: 36px;
    border-left: 1px solid;
    border-color: #23282e;
    height: 128px;

}
.appFooterRigth h3{
    margin-bottom: 25px;
}
.appFooterRigth p{
    font-size: 12px;
    color: #ccc;
    margin-bottom: 18px;
}
.appFootercontent h3{
    margin-bottom: 25px;
}
.jeIcon{
    position: relative;
    font-size: 16px;
    font-weight: normal;
    padding-left: 20px;
    line-height: 16px;
    height: 16px;
}
.jeIcon::before{
    content: '';
    left: 0;
    position: absolute;
    width:16px;
    height: 16px;
}
.appFootercontent .ilco{
    background: url("../../images/icoBott02.png") no-repeat;
}
.appFootercontent ul{
    margin: 0;
    padding: 0;
}
.ico3 span:hover{
        color: #fff;
}
.appFootercontent ul li{
    width: 160px;
    float: left;
    margin-left: 15px;
    color: #cccccc;
    margin-bottom: 15px;
    font-size: 12px;
    cursor: pointer;
}
.appFootercontent ul li:hover{
    color: #fff;
}
.lix{
    background: url("../../images/icoBott03.png") no-repeat;
}
.ico1{
    background: url("../../images/icoBott01.png") no-repeat;
}
.ico2{
    background: url("../../images/icoBott.png") no-repeat;
}
.ico3{
    background: url("../../images/icoBott04.png") no-repeat;
}
.jeIcon.ico3>span{
    cursor: pointer;
}
.jeIcon.ico3>span:nth-child(2){
        padding-left: 10px;
}

</style>
