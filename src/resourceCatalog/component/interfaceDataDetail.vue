<template>
  <div class="publicContent">
    <div class="breadCrumb">
      <i @click="goHome" class="iconfont icon-dingwei"></i>
      <router-link :to="{name:breadCrumbPage}">{{breadCrumb}}</router-link>
      <span class="active">查看《{{interfacetitle}}》接口详情</span>
    </div>
    <div class="loadDataBox">
      <div class="inpfrom">
        <i class="iconfont icon-fanhui back" @click="goBack"><span>返回</span></i>
        <div class="interfaceInfo">
          <h4>基本信息</h4>
          <div class="interfaceInfoContent">
            <div><span class="info"> 接口说明 ：</span><textarea class="specification" type="text" v-model="specification"></textarea></div>
            <div class="line3">
              <div>输入参数 ：<span>{{submitData.paramNameStr}}</span></div>
              <div>输出参数 ：<span>{{submitData.resultNameStr}}</span></div>
            </div>
            <div class="line3">
              <div>注册人 ：<span>{{registName}}</span></div>
              <div>创建时间 ：<span>{{applyTime}}</span></div>
            </div>
          </div>
        </div>
        <div class="divtime">
          <h4 class="row head-input head-input-code-box">请求参数</h4>
          <div class="con-cont wid">
            <div class="row input" v-for="(item,index) in service_param_detail.service_param" :key="index" >
              <div class="col-md-1 input-label"><span>{{item.name}}</span></div>
              <div class="col-md-4"><textarea class="paramText" type="text" v-model="submitData.paramValues[index]" ></textarea></div>
              <!-- <div class="col-md-1"><span class="validate-msg"></span></div> -->
            </div>
            <div class="save-btn-bottom-box">
              <button type="button" class="btnGreen" @click="clearParams">重置</button>
              <button type="button" class="btnGreen" @click="submit">确定</button>
            </div>
          </div>
        </div>
        <!--查询结果-->
        <div class="divtime">
          <h4 class="row head-input head-input-code-box">查询结果</h4>
            <div class="con-cont wid">
              <!-- <div class="col-md-2 input-label"></div> -->
              <pre class="resultText" v-html="syntaxHighlight(resultJson)"></pre>
            </div>
        </div>
        <!--查询结果结束-->
      </div>
      <!-- <div class="save-btn-bottom-box">
        <button type="button" class="btnWhite" @click="returnHandler">返回</button>
        <button type="button" class="btnGreen" >提交</button>
        <button type="button" class="btnGreen" >暂存</button>
      </div> -->
    </div>
  </div>
</template>
<script>
   import apiClient from '@/publicJs/ApiClient.js'
   import Util from '@/publicJs/Util'
   import TipBoxService from '@/publicJs/TipBoxService'
   import LoadingBoxService from '@/publicJs/LoadingBoxService'

var token = Util.getToken()
   export default{
     name: 'ApplyFillinForm',
     data () {
       return {
         interfacetitle: '接口数据',
         breadCrumb: '',
         breadCrumbPage: '',
         formData: {
           title: '',
           name: '',
           username: '',
           compony: '',
           dep: '',
           sex: '',
           tel: '',
           applyDate: ''
         },
         submitData: {
           id: '',
           // 输入参数名数组
           paramNames: [],
           // 输入参数名字符串
           paramNameStr: '',
           // 输入参数值
           paramValues: [],
           // 访问url
           apiUrl: '',
           // 请求类型
           reqType: '',
           // 输出结果参数名称
           resultNames: [],
           // 输出结果参数字符串
           resultNameStr: ''
         },
         // 注册人名称
         registName: '',
         // 申请时间
         applyTime: '',
         // 说明
         specification: '',
         service_param_detail: {},
         resultJson: {}
       }
     },
     created () {
       if (this.$route.query.type === 'person') {
         this.breadCrumb = '个人申请'
         this.breadCrumbPage = 'personApplyManage'
       } else if (this.$route.query.type === 'administrator') {
         this.breadCrumb = '申请管理'
         this.breadCrumbPage = 'applyManageAdministrator'
       }
       this.interfacetitle = sessionStorage.getItem('InterfaceDataDetailtitle')
       this.submitData.id = this.$route.query.id
       this.getFormData()
     },
     methods: {
       submit () {
         if (this.submitData.paramNames.length === 0) {
           TipBoxService.open('接口结构解析错误无法访问', 2)
           return
         }
         LoadingBoxService.open('接口访问中...')
         apiClient.post('/api/requestInterface', this.submitData).then(data => {
           LoadingBoxService.close()
           this.resultJson = JSON.parse(data)
           // console.log(this.resultJson)
         }).catch(e => {
           LoadingBoxService.close()
           console.error(e)
         })
       },
       returnHandler () {
         this.$router.go(-1)
       },
       goBack () {
         this.$router.push('/personApplyManage?index=1')
       },
       goHome () {
         this.$router.push({name: 'Index'})
         this.$parent.setActive('资源管理', '资源目录')
        //  this.$parent.leftNavData[1].active = false
        //  this.$parent.leftNavData[2].active = false
        //  this.$parent.leftNavData[0].active = true
       },
       clearParams () {
         this.submitData.paramValues.splice(0)
       },
       getFormData () {
         var myData = {id: this.submitData.id}
         var that = this
        //  var myData = {id: 'a49c9d76387444b29964b10f77ed4dd9'}
         LoadingBoxService.open('数据加载中...')
         apiClient.post('itsmApi/atomicService/loadServiceInfo', myData, function (data) {
           if (data.results.data[0]) {
             that.service_param_detail = JSON.parse(data.results.data[0].service_param_detail[2])
             for (let i = 0; i < that.service_param_detail.service_param.length; i++) {
               that.submitData.paramNames[i] = that.service_param_detail.service_param[i].name
             }
             for (let i = 0; i < that.service_param_detail.service_out_param.length; i++) {
               that.submitData.resultNames[i] = that.service_param_detail.service_out_param[i].name
             }
             that.submitData.paramNameStr = that.submitData.paramNames.join(',')
             that.submitData.resultNameStr = that.submitData.resultNames.join(',')
             that.submitData.apiUrl = that.service_param_detail.url
             that.submitData.reqType = that.service_param_detail.request_type
             that.registName = data.results.userList.truename
             that.applyTime = data.results.apply_time
             that.specification = data.results.data[0].service_remark
             LoadingBoxService.close()
           } else {
             LoadingBoxService.close()
             TipBoxService.open('接口结构解析错误', 2)
           }
         })
       },
       // 将json数据在HTML上显示
       syntaxHighlight (json) {
         if (typeof json !== 'string') {
           json = JSON.stringify(json, undefined, 2)
         }
         json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
         return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
           var cls = 'number'
           if (/^"/.test(match)) {
             if (/:$/.test(match)) {
               cls = 'key'
             } else {
               cls = 'string'
             }
           } else if (/true|false/.test(match)) {
             cls = 'boolean'
           } else if (/null/.test(match)) {
             cls = 'null'
           }
           return '<span class="' + cls + '">' + match + '</span>'
         })
       }
     }
   }
</script>
<style src="" scoped>

.inpfrom h4 {
  font-size: 16px;
  font-weight: normal;
  color: #56a8fe;
  border-bottom: 1px solid #56a8fe;
  line-height: 40px;
  padding-left: 10px;
}
i.back {
  position: absolute;
  top: 0;
  right: 15px;
  color: #56a8fe;
  font-size: 24px;
  cursor: pointer;
}
i.back span {
  font-size: 13px;
  position: relative;
  top: -5px;
}
.interfaceInfoContent > div:first-of-type {
  height: 120px;
}
.interfaceInfoContent > div span.info {
  position: relative;
  top: -70px;
  color: #000; 
}
.specification {
  width: 600px;
  height: 100px;
  border-radius: 5px;
  border: 1px solid #ccc;
  outline: none;
  padding-left: 5px;
  position: relative;
  top: 15px;
  line-height: 30px;
  color: #888;
}
.interfaceInfo {
  padding-top: 15px;
}
.interfaceInfoContent {
  padding-left: 10px;
  padding-right: 25%;
  min-width: 1000px;
}
.interfaceInfoContent > div {
  height: 50px;
  line-height: 50px;
}
.interfaceInfoContent > div span {
  color: #888;
}
.interfaceInfoContent .line2 {
}
.interfaceInfoContent .line2 > span {
  color: #000;
  float: left;
  margin-top: -18px;
}
.interfaceInfoContent .line2 > p{
  padding: 5px;
  background-color: #F9FBFE;
  line-height: 20px;
  float: left;
  width: 80%;
}
.interfaceInfoContent .line3 {
  display: flex;
}
.interfaceInfoContent .line3 > div {
  flex: 1;
}

  .row{
    margin: 0;
  }
  .col-md-1, .col-md-2 , .col-md-3, .col-md-9{
    padding: 0;
  }
  .save-btn-bottom-box{
    background: #fff;
    height: 62px;
    /* box-shadow: 0px 0px 5px #ccc inset; */
    text-align: center;
    padding-top: 15px;
    margin-top: 10px;
  }
  .save-btn-bottom-box button:nth-child(2){
    margin: 0 140px;
  }
  .head-input-code-box{
    color: #56a8fe;
    font-size: 14px;
    line-height: 40px;
    border-bottom: 1px solid #bbd0e5;
    height: 60px;
    padding-top: 20px;
    margin-bottom: 50px !important;
  }
  .input .input-label span{
    float: right;
    color: #222;
  }
  .paramText {
    width: 200px;
    height: 30px;
    border-radius: 5px;
    border: 1px solid #ccc;
    outline: none;
    padding-left: 5px;
    position: relative;
    top: -4px;
  }
  .loadDataBox{
    background-color: #f3f7fd;
    font-size: 12px;
    box-shadow: none;
  }
  .loadDataBox .input{
    margin-bottom: 26px;
  }
  .input .col-md-3>span, .input .col-md-9>span{
    color: #888;
    width: 100%;
  }
  .input textarea{
    height: 50px;
    width: 100%;
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 5px 5px;
    color: #888;
  }
  .resultText {
    border: 1px solid #ccc;
    padding: 5px; 
    margin: 5px;
    border-radius: 5px;
    height: 400px;
    overflow-y: auto;
  }

  .table thead{
    table-layout:fixed;
  }
  .title {
    height: 80px;
    line-height: 80px;
    border-bottom: 1px solid #ccc;
    font-size: 16px;
    color: #55a8fd;
    text-align: center;
    margin-bottom: 55px;
  }
  .head-input{
    overflow: hidden;
    margin-bottom: 55px;
  }
  .commonnav{
    line-height: 45px;
  }
  .inpfrom{
    padding: 0 15px 20px 15px;
    -webkit-box-shadow: 0px 0px 5px #dedede inset;
    box-shadow: 0px 0px 5px #dedede inset;
    border-radius: 1px;
    background-color: #fff;
    border-radius: 2px;
  }
  .col-md-2 i, .rili i{
    width: 12px;
    height: 12px;
    margin-right: 4px;
    display: inline-block;
    vertical-align: middle;
    background: url('../../publicImages/radio.png') no-repeat;
  }
  .col-md-2.active i, .rili .active i{
    background-position: 0 -13px;
  }
  .col-md-2 span, .css-radio span{
    color: #888;
  }
  .fleradio .css-radio{
    float: left;
  } 
  .typeSelect{
    padding-left: 0px;
  }
  .rili{
    padding-bottom: 20px;
    height: 30px;
  }
  .el-date-editor.el-input{
    width: 266px;
    position: relative;
    top: -25px;
    left: 100px;
  }
  .el-input__inner{
    height: 30px;
  }
  .css-rinpu {
    display: none;
    position: absolute;
    top: -8px;
    margin-left: 4px;
  }
  .col-md-2.active .css-rinpu {
    display: inline-block;
  }
  .inputborder {
    height: 31px;
    width: 100%;
    border: 1px solid #eee;
    border-radius: 4px;
    padding: 0px 5px;
  }
</style>
<style>
  .css-radio-box .rili input{
    width: 262px;
    height: 31px;
    border: 1px solid #d4e2ed !important;
    border-radius: 4px;
    padding: 0px 10px;
  }
  .resultText .string { color: green; }
  .resultText .number { color: darkorange; }
  .resultText .boolean { color: blue; }
  .resultText .null { color: magenta; }
  .resultText .key { color: red; }
</style>
