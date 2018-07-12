<template>
  <div class="publicContent">
    <div class="main-content-box">
      <div class="main-content">
        <div class="divtime">
          <div class="row head-input">
            <div><span>基本信息</span></div>
          </div>
          <div class="row input">
            <div class="col-md-2 input-label"><span>检测方案名称</span></div>
            <div class="col-md-9"><span>{{dataCheckSpecs.name}}</span></div>
            <div class="col-md-1"><span class="validate-msg"></span></div>
          </div>
          <div class="row input">
            <div class="col-md-2 input-label"><span>方案标签</span></div>
            <div class="col-md-9"><span>{{labelStr}}</span></div>
            <div class="col-md-1"><span class="validate-msg"></span></div>
          </div>
          <div class="row input">
            <div class="col-md-2 input-label"><span>方案描述</span></div>
            <div class="col-md-9"><span>{{dataCheckSpecs.description}}</span></div>
            <div class="col-md-1"><span class="validate-msg"></span></div>
          </div>
        </div>
        <!--选择资源-->
        <div class="divtime">
          <div class="row head-input">
            <div><span>资源信息</span></div>
          </div>
          <div class="row input">
            <div class="col-md-2 input-label"><span>检测类型</span></div>
            <div class="col-md-9"><span>单一资源</span></div>
            <div class="col-md-1"><span class="validate-msg"></span></div>
          </div>
          <div class="row input">
            <div class="col-md-2 input-label"><span>资源位置</span></div>
            <div class="col-md-9"><span>平台资源</span></div>
            <div class="col-md-1"><span class="validate-msg"></span></div>
          </div>
          <div class="row input">
            <div class="col-md-2 input-label"><span>资源项</span></div>
            <div class="col-md-9"><span>{{resourceName}}</span></div>
            <div class="col-md-1"><span class="validate-msg"></span></div>
          </div>
        </div>
        <!--选择资源结束-->
        <!--模型配置-->
        <div class="divtime">
          <div class="row head-input">
            <div><span>模型配置</span></div>
          </div>
          <div class="dataTableContainer">
            <div class="row table-head">
              <div class="col-md-1 col-md-offset-1">序号</div>
              <div class="col-md-2">数据元</div>
              <div class="col-md-1">数据类型</div>
              <div class="col-md-2">表达格式</div>
              <div class="col-md-1">数据项</div>
              <div class="col-md-3">检测对应字段</div>
            </div>
            <div class="table-body">  
              <div v-for="(item, index) in dataCheckSpecs.targetList" :key='index' class="row table-row">
                <div class="col-md-1 col-md-offset-1">{{index + 1}}</div>
                <div class="col-md-2">{{item.metadata.name}}</div>
                <div class="col-md-1">{{item.metadata.dataType}}</div>
                <div class="col-md-2">{{item.metadata.expressionFormat}}</div>
                <div class="col-md-1" v-if="item.metadata.metadataCodes.length === 0">-</div>
                <div class="col-md-1" v-else @click="checkMetadataCodes(index)"><span class="checkElement">{{item.metadata.metadataCodes.length + '项'}}</span></div>
                <div class="col-md-3">{{item.targetName + (item.targetDesc?'('+item.targetDesc+')':'')}}</div>
              </div>
            </div>
          </div>
        </div>       
        <!--模型配置结束-->
        <!--阈值设置-->
        <div class="divtime">
          <div class="row head-input">
            <div><span>阈值设置</span></div>
          </div>
          <div class="row input">
            <div class="col-md-4 input-label"><span>阈值1：“完全可用”字段符合个数 >=</span></div>
            <div class="col-md-7"><span>{{dataCheckSpecs.fullyUsableThreshold.value}}</span></div>
            <div class="col-md-1"><span class="validate-msg"></span></div>
          </div>
          <div class="row input">
            <div class="col-md-4 input-label"><span>阈值2：“一般可用”字段符合个数 >=</span></div>
            <div class="col-md-7"><span>{{dataCheckSpecs.barelyUsableThreshold.value}}</span></div>
            <div class="col-md-1"><span class="validate-msg"></span></div>
          </div>
          <div class="row input">
            <div class="col-md-4 input-label"><span>阈值3：“不可用”字段符合个数 &nbsp;&nbsp;&nbsp;<&nbsp;&nbsp;</span></div>
            <div class="col-md-7"><span>{{dataCheckSpecs.barelyUsableThreshold.value}}</span></div>
            <div class="col-md-1"><span class="validate-msg"></span></div>
          </div>
        </div>
        <!--阈值设置结束-->
      </div>
    </div>
    <div class="element-detail">
      <el-dialog title="数据元代码" :visible.sync="codeDialogVisible" :modal="false">
        <div style=" overflow-y:auto; width:640px; max-height:400px;">
          <div v-for="(item, index) in metadataCodes" :key="index" class="row element-row">
            <div class="col-xs-2"><span class="strong">{{index + 1}}</span></div>
            <div class="col-xs-10 row">
              <div class="col-xs-4"><span class="strong">代码：</span>{{item.code}}</div>
              <div class="col-xs-8"><span class="strong">名称：</span>{{item.name}}</div>
              <div class="col-xs-12" :title="item.describe"><span class="strong limit-width">说明：</span>{{item.describe}}</div>
            </div>
          </div>
        </div>
      </el-dialog> 
    </div>
  </div>
</template>

<script>
import apiClient from '@/publicJs/ApiClient.js'
// import utilService from '@/publicJs/UtilService.js'
// import _ from 'lodash'
import LoadingBoxService from '@/publicJs/LoadingBoxService.js'
export default {
  name: 'schemeDetail',
  props: ['id'],
  mounted () {
    this.getScheme()
  },
  data () {
    return {
      dataCheckSpecs: {
        fullyUsableThreshold: [],
        barelyUsableThreshold: []
      },
      labelStr: '',
      resourceName: '',
      codeDialogVisible: false, // 数据元项弹窗
      metadataCodes: []
    }
  },
  methods: {
    getScheme () {
      LoadingBoxService.open('数据加载中...')
      // let id = utilService.getQueryString('id')
      apiClient.get('/rcapi/dataCheckSpecs/' + this.id).then(data => {
        this.dataCheckSpecs = data
        this.labelStr = data.labels.join('、')
        this.getResourceName(data.resourceId)
        LoadingBoxService.close()
      }, error => {
        console.error(error)
        LoadingBoxService.close()
      })
    },
    getResourceName (id) {
      apiClient.get('/rcapi/findResourcesById', {resourceId: id}).then(data => {
        this.resourceName = data.resource.resourcename
      }, error => {
        console.error(error)
      })
    },
    checkMetadataCodes (index) { // 查看数据元项
      this.codeDialogVisible = true
      // this.metadataCodes = data
      this.metadataCodes = this.dataCheckSpecs.targetList[index].metadata.metadataCodes
    },
    goHome () {
      this.$router.push({name: 'RcIndex'})
    }
  }
}
</script>
<style src="" scoped></style>
<style scoped>
  .input .input-label span{
    float: right;
    color: #222;
  }
  .main-content-box{
    box-shadow: none;
    background-color: #fff;
    padding: 15px;
    font-size: 12px;
  }
  .main-content-box .input{
    margin-bottom: 26px;
  }
  .main-content{
    box-shadow: none;
  }
  .input .col-md-9>span, .input .col-md-7>span{
    color: #888;
    width: 100%;
  }
  .input textarea{
    border: 0;
    padding: 0;
    width: 100%;
    resize : none;
    color: #888;
    background-color: #F0F9FE;
  }
  .table thead{
    table-layout:fixed;
  }
  .title {
    height: 50px;
    line-height: 50px;
    font-size: 16px;
    color: #55a8fd;
    text-align: center;
    
  }
  .head-input{
    overflow: hidden;
    margin-bottom: 55px;
  }
  .head-input>div{
    height: 40px;
    border: 1px solid #55a8fd;
    display: inline-block;
    line-height: 40px;
    position: relative;
  }
  .head-input>div:after{
    content: '';
    position: absolute;
    height: 1px;
    display: inline-block;
    width: 1920px;
    top: 19px;
    left: 100%;
    background: #aad3fe;
  }
  .head-input>div>span{
    font-size: 14px;
    color: #55a8fd;
    padding: 0 26px 0 18px;
    position: relative;
  }
  .head-input>div>span:before{
    display: inline-block;
    height: 28px;
    width: 2px;
    content: '';
    background: #fff;
    position: absolute;
    top: -6px;
    right: -2px;
    border:1px solid #fff;
  }
  .head-input>div>span:after{
    display: inline-block;
    height: 28px;
    width: 2px;
    content: '';
    background: #fff;
    position: absolute;
    top: -6px;
    left: -2px;
    border:1px solid #fff;
  }
  .table-head{
    margin-bottom: 20px;
    color: #333;
    text-align: center;
  }
  .table-row{
    margin-bottom: 26px;
    color: #888;
  }
  .table-body{
    width: 100%;
  }
  .table-row .col-md-1,.table-row .col-md-2,.table-row .col-md-3{
    text-align: center;
  }
  .save-btn-bottom-box {
    text-align: center;
    padding-bottom: 40px;
  }
  .checkElement{
    cursor: pointer;
    color: #55a8fd;
  }
  .element-row .col-xs-2, .element-row .col-xs-4, .element-row .col-xs-8 , .element-row .col-xs-12{
    padding: 0;
  }
  .element-row .col-xs-2{
    text-align: center;
    line-height: 48px;
  }
  .element-row .col-xs-4,.element-row .col-xs-8,.element-row .col-xs-12{
    line-height: 24px;
  }
  .element-row{
    height: 48px;
    font-size: 12px;
    border: 1px solid #ccc;
    background: #fff;
  }
  .element-row.row{
    margin: 0 0 10px 0;
  }
</style>
<style>
  .element-detail .el-dialog__body{
    background-color: #f8f8f8;
  }
  .element-detail .el-dialog__header{
    background-color: #56A8FE;
    height: 50px;
  }
  .element-detail .el-dialog__title{
    color: #fff;
    font-size: 16px;
    font-weight: normal;
  }
  .element-detail .el-dialog__headerbtn .el-dialog__close{
    color: #fff;
  }
  .element-detail .el-dialog__body{
    color: #888;
  }
  .element-detail .el-dialog__body .strong{
    color: #222;
  }
  .element-detail .limit-width{
    white-space: nowrap;
    text-overflow:ellipsis;
    overflow:hidden;
  }
</style>

