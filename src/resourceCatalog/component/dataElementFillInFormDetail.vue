<template>
  <div class="main-content-box">
    <div class="main-content">
        <div class="row head-input">
          <div><span>{{linkData.name?linkData.name + '数据元':'&nbsp;'}}</span></div>
        </div>
        <div class="row input">
          <div class="col-md-2 input-label"><span>内部标识符</span></div>
          <div class="col-md-3"><span>{{linkData.internalTag}}</span></div>
          <div class="col-md-1"><span class="validate-msg"></span></div>
        </div>
        <div class="row input">
          <div class="col-md-2 input-label"><span>中文名称</span></div>
          <div class="col-md-3"><span>{{linkData.cnName}}</span></div>
          <div class="col-md-1"><span class="validate-msg"></span></div>
          <div class="col-md-2 input-label"><span>英文名称</span></div>
          <div class="col-md-3"><span>{{linkData.enName}}</span></div>
          <div class="col-md-1"><span class="validate-msg"></span></div>
        </div>
        <div class="row input">
          <div class="col-md-2 input-label"><span>中文全拼</span></div>
          <div class="col-md-3"><span>{{linkData.cnSpelling}}</span></div>
          <div class="col-md-1"><span class="validate-msg"></span></div>
          <div class="col-md-2 input-label"><span>标识符</span></div>
          <div class="col-md-3"><span>{{linkData.tag}}</span></div>
          <div class="col-md-1"><span class="validate-msg"></span></div>
        </div>
        <div class="row input">
          <div class="col-md-2 input-label"><span>语境</span></div>
          <div class="col-md-3"><span>{{linkData.languageContext}}</span></div>
          <div class="col-md-1"><span class="validate-msg"></span></div>
          <div class="col-md-2 input-label"><span>版本</span></div>
          <div class="col-md-3"><span>{{linkData.version}}</span></div>
          <div class="col-md-1"><span class="validate-msg"></span></div>
        </div>
        <div class="row input">
          <div class="col-md-2 input-label"><span>同义名称</span></div>
          <div class="col-md-9"><span>{{linkData.synonym}}</span></div>
          <div class="col-md-1"><span class="validate-msg"></span></div>
        </div>
        <div class="row input">
          <div class="col-md-2 input-label"><span>说明</span></div>
          <div class="col-md-9"><textarea class="col9-textarea" readonly="true" v-model="linkData.explanation"></textarea></div>
          <div class="col-md-1"><span class="validate-msg"></span></div>
        </div>
        <div class="row input">
          <div class="col-md-2 input-label"><span>对象类词</span></div>
          <div class="col-md-3"><span>{{linkData.objectWord}}</span></div>
          <div class="col-md-1"><span class="validate-msg"></span></div>
          <div class="col-md-2 input-label"><span>特性词</span></div>
          <div class="col-md-3"><span>{{linkData.characterWord}}</span></div>
          <div class="col-md-1"><span class="validate-msg"></span></div>
        </div>
        <div class="row input">
          <div class="col-md-2 input-label"><span>应用约束</span></div>
          <div class="col-md-9"><span>{{linkData.applyRestraint}}</span></div>
          <div class="col-md-1"><span class="validate-msg"></span></div>
        </div>
        <div class="row input">
          <div class="col-md-2 input-label"><span>分类方案</span></div>
          <div class="col-md-3"><span>{{linkData.solutionName}}</span></div>
          <div class="col-md-1"><span class="validate-msg"></span></div>
          <div class="col-md-2 input-label"><span>分类方案值</span></div>
          <div class="col-md-3"><span>{{linkData.solutionValue}}</span></div>
          <div class="col-md-1"><span class="validate-msg"></span></div>
        </div>
        <div class="row input">
          <div class="col-md-2 input-label"><span>关系</span></div>
          <div class="col-md-9"><span>{{linkData.relation}}</span></div>
          <div class="col-md-1"><span class="validate-msg"></span></div>
        </div>
        <div class="row input">
          <div class="col-md-2 input-label"><span>表示词</span></div>
          <div class="col-md-3"><span>{{linkData.expressionWord}}</span></div>
          <div class="col-md-1"><span class="validate-msg"></span></div>
          <div class="col-md-2 input-label"><span>数据类型</span></div>
          <div class="col-md-3"><span>{{linkData.dataType}}</span></div>
          <div class="col-md-1"><span class="validate-msg"></span></div>
        </div>
        <div class="row input">
          <div class="col-md-2 input-label"><span>表示格式</span></div>
          <div class="col-md-3"><span>{{linkData.expressionFormat}}</span></div>
          <div class="col-md-1"><span class="validate-msg"></span></div>
          <div class="col-md-2 input-label"><span>计量单位</span></div>
          <div class="col-md-3"><span>{{linkData.measureUnit}}</span></div>
          <div class="col-md-1"><span class="validate-msg"></span></div>
        </div>
        <div class="row input">
          <div class="col-md-2 input-label"><span>值域</span></div>
          <div class="col-md-9"><span>{{linkData.valueField}}</span></div>
          <div class="col-md-1"><span class="validate-msg"></span></div>
        </div>
        <div class="row input">
          <div class="col-md-2 input-label"><span>状态</span></div>
          <div class="col-md-3"><span>{{linkData.state}}</span></div>
          <div class="col-md-1"><span class="validate-msg"></span></div>
          <div class="col-md-2 input-label"><span>注册机构</span></div>
          <div class="col-md-3"><span>{{linkData.registedOrg}}</span></div>
          <div class="col-md-1"><span class="validate-msg"></span></div>
        </div>
        <div class="row input">
          <div class="col-md-2 input-label"><span>提交机构</span></div>
          <div class="col-md-3"><span>{{linkData.submitOrg}}</span></div>
          <div class="col-md-1"><span class="validate-msg"></span></div>
          <div class="col-md-2 input-label"><span>批准日期</span></div>
          <div class="col-md-3"><span>{{linkData.approveDate}}</span></div>
          <div class="col-md-1"><span class="validate-msg"></span></div>
        </div>
        <div class="row input">
          <div class="col-md-2 input-label"><span>主要起草人</span></div>
          <div class="col-md-9"><textarea class="col9-textarea" readonly="true" v-model="linkData.mainDraftsman"></textarea></div>
          <div class="col-md-1"><span class="validate-msg"></span></div>
          
        </div>
        <div class="row input">
          <div class="col-md-2 input-label"><span>备注</span></div>
          <div class="col-md-9"><textarea class="col9-textarea" readonly="true" v-model="linkData.comments"></textarea></div>
          <div class="col-md-1"></div>
        </div>
        <div class="row input">
          <div class="col-md-2 input-label"><span>标签</span></div>
          <div class="col-md-3"><span>{{labels}}</span></div>
          <div class="col-md-1"><span class="validate-msg"></span></div>
        </div>
          <div class="row head-input head-input-code-box" v-show = "hasTable">
            <div><span>{{linkData.name?linkData.name + '数据元代码':'&nbsp;'}}</span></div>
          </div>
        <div>
        <div class="row table-head" v-show = "hasTable">
          <div class="col-md-2 col-md-offset-1">序号</div>
          <div class="col-md-2">代码</div>
          <div class="col-md-2">名称</div>
          <div class="col-md-4">说明</div>
        </div>
        <div class="table-body" v-show = "hasTable">  
          <div v-for="(item, index) in linkData.metadataCodes" :key='index' class="row table-row">
            <div class="col-md-2 col-md-offset-1">{{index + 1}}</div>
            <div class="col-md-2">{{item.code}}</div>
            <div class="col-md-2">{{item.name}}</div>
            <div class="col-md-4">{{item.describe}}</div>
          </div>
          </div>
        </div> 
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import ApiClient from '../../publicJs/ApiClient.js'
  // import TipBoxService from '../../publicJs/TipBoxService.js'
  import LoadingBoxService from '../../publicJs/LoadingBoxService.js'
  import UtilService from '../../publicJs/UtilService.js'
  export default{
    name: 'dataElementFillInFormDetail',
    props: ['eleId'],
    data () {
      return {
        submitData: {
          id: ''
        },
        linkData: {},
        dataTypes: {
          'STRING': '字符型(string)',
          'NUMERIC': '数值型(numeric)',
          'DATE': '日期型(date)',
          'DATETIME': '日期时间型(datetime)',
          'BOOLEAN': '布尔型(boolean)',
          'BINARY': '二进制型(binary)'
        },
        labels: '',
        hasTable: false
      }
    },
    mounted () {
      if (this.eleId != null) {
        this.getMetadataDetail(this.eleId)
      } else {
        this.getMetadataDetail(this.$route.params.eleId)
      }
    },
    methods: {
      /* showFormData () {
        var url = 'api/metadata/id/' + this.id +'?token='
        ApiClient.get ( url,{}).then(data => {
          this.linkData = data
            if(that.linkData.createdTime!="" && that.linkData.createdTime!=undefined)
              that.linkData.createdTime=UtilService.formatDuring(that.linkData.createdTime,'yyyy-MM-dd HH:mm:ss');
            if(that.linkData.approveDate!="" && that.linkData.approveDate!=undefined)
              that.linkData.approveDate=UtilService.formatDuring(that.linkData.approveDate,'yyyy-MM-dd HH:mm:ss');
        })
      } */
      getMetadataDetail (eleId) {
        LoadingBoxService.open('数据加载中...')
        var url = 'rcapi/metadata/id/' + eleId
        ApiClient.get(url, {}).then(data => {
          this.linkData = data
          if (this.linkData.approveDate !== '') {
            this.linkData.approveDate = UtilService.formatDuring(data.approveDate, 'yyyy-MM-dd')
          }
          this.labels = this.linkData.labels.join(',')
          if (this.linkData.metadataCodes && this.linkData.metadataCodes.length > 0) {
            this.hasTable = true
          }
          LoadingBoxService.close()
        })
      }
    }
  }
</script>
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
  .input .col-md-3>span, .input .col-md-9>span{
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
    height: 260px;
    overflow-y: auto;
    overflow-x: hidden;
  }
  .table-row .col-md-2{
    text-align: center;
  }
  .save-btn-bottom-box {
    text-align: center;
    padding-bottom: 40px;
  }
</style>
