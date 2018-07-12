<template>
  <div class="DownloadCenterJava">
      <public-header ></public-header>
      <div class="javaimg">
          <a :href="apiBaseUrl + '/developerApi/apidoc/downloadsdk?language=java&version=0.0.1'"><img src="../../images/java.png" alt=""></a><br><br>
          JAVA SDK 0.0.1
      </div>
      <div class="main">
          <div class="function">
              <div class="functiontitle">
                  <span>功能说明</span>
              </div>
              <div class="functiontext">
                 <ul>
                    <li>只支持原子服务调用</li>
                    <li>三种类型原子服务调用均支持：页面类型、页面数据类型、纯数据类型</li>
                    <li>提供简单和通用模式调用纯数据类型服务</li>
                    <li>页面类型、页面数据类型服务调用应该由前端发起请求方可呈现返回的页面</li>
                    
                </ul> 
              </div>
          </div>
          <div class="version">
              <div class="versiontitle">
                  <span>版本更新</span>
              </div>
               <div class="functiontext">
                 <ul>
                    <li>0.0.1
                        <span class="record"><a :href="apiBaseUrl + '/developerApi/apidoc/downloadsdk?language=java&version=0.0.1'">· iscloud-java-sdk-master</a></span>
                    </li>
                    
                </ul> 
              </div>
          </div>
      </div>
      <public-footer></public-footer> 
  </div>
</template>
<script>

import header from '../../component/publicComponent/openPlatformTopNav.vue'
import footer from '../../component/publicComponent/footer.vue'
import apiClient from '../../../publicJs/ApiClient.js'
export default {
  name: 'DownloadCenterJava',
  data () {
    return {
      apiBaseUrl: ''
    }
  },
  created () {
    this.apiBaseUrl = apiClient.apiBaseUrl
  },
  components: {
    'public-header': header,
    'public-footer': footer
  },
  methods: {
    sdkDownload (version) {
      var myData = {
        language: 'java',
        version: version
      }
      window.open(apiClient.apiBaseUrl + '/developerApi/apidoc/downloadsdk?language=' + myData.language + '&version=' + myData.version)
    }
  }
}
</script>
<style scoped>
.javaimg{
    height: 166px;
    text-align: center;
    margin-top: 66px;
    font-weight: bolder;
    font-size: 14px;
    color: #1c2a53;
}
.javaimg img{
    margin-top: 26px;
}
.main{
    width: 1200px;
    margin: 0 auto;
}
.function .functiontitle, .versiontitle{
    width: 100%;
    height: 35px;
    background: #f3f6f8;
    border-left: 2px solid #2ca3ee;
    line-height: 35px;
}
.main span{
    margin-left: 10px;
}
.function p{
    height: 480px;
}
.version p{
    height: 150px;
}
.functiontext{
    margin: 15px 13px;
}
.functiontext ul li {
   line-height: 35px;
}
.record{
    display: block;
    border-top: 1px #e8eff2 solid;
    color: #2ca3ee;
}
.record a{
     color: #2ca3ee;
}
.record:hover{
    cursor: pointer;
}
.javaimg img:hover{
    cursor: pointer;
}
</style>
