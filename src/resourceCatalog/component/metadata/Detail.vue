<template>
  <div class="root-body">
    <div class="breadCrumb" v-if="isList">
      <i @click="goHome" class="iconfont icon-dingwei"></i>
      <router-link to="/resourceCatalog">资源目录</router-link>
      <a href="javascript:;" @click="goBack">{{treeData.name}}</a>
      <span>《{{metadataDetail.name?metadataDetail.name + '数据元':'&nbsp;'}}》详情</span>
      <div class="topbtnContainer">
      </div>
    </div>
    <div class="main-content-box" :style="heightclass">
      <div class="main-content">
        <div v-show="isList" class="title">{{metadataDetail.name? metadataDetail.name + '数据元':'&nbsp;'}}</div>
        <div class="row head-input" v-show="!isList">
          <div><span>{{metadataDetail.name? metadataDetail.name + '数据元':'&nbsp;'}}</span></div>
        </div>
        <div class="row input">
          <div class="col-md-2 input-label"><span>内部标识符</span></div>
          <div class="col-md-3"><span>{{metadataDetail.internalTag}}</span></div>
          <div class="col-md-1"><span class="validate-msg"></span></div>
        </div>
        <div class="row input">
          <div class="col-md-2 input-label"><span>中文名称</span></div>
          <div class="col-md-3"><span>{{metadataDetail.cnName}}</span></div>
          <div class="col-md-1"><span class="validate-msg"></span></div>
          <div class="col-md-2 input-label"><span>英文名称</span></div>
          <div class="col-md-3"><span>{{metadataDetail.enName}}</span></div>
          <div class="col-md-1"><span class="validate-msg"></span></div>
        </div>
        <div class="row input">
          <div class="col-md-2 input-label"><span>中文全拼</span></div>
          <div class="col-md-3"><span>{{metadataDetail.cnSpelling}}</span></div>
          <div class="col-md-1"><span class="validate-msg"></span></div>
          <div class="col-md-2 input-label"><span>标识符</span></div>
          <div class="col-md-3"><span>{{metadataDetail.tag}}</span></div>
          <div class="col-md-1"><span class="validate-msg"></span></div>
        </div>
        <div class="row input">
          <div class="col-md-2 input-label"><span>语境</span></div>
          <div class="col-md-3"><span>{{metadataDetail.languageContext}}</span></div>
          <div class="col-md-1"><span class="validate-msg"></span></div>
          <div class="col-md-2 input-label"><span>版本</span></div>
          <div class="col-md-3"><span>{{metadataDetail.version}}</span></div>
          <div class="col-md-1"><span class="validate-msg"></span></div>
        </div>
        <div class="row input">
          <div class="col-md-2 input-label"><span>同义名称</span></div>
          <div class="col-md-9"><span>{{metadataDetail.synonym}}</span></div>
          <div class="col-md-1"><span class="validate-msg"></span></div>
        </div>
        <div class="row input">
          <div class="col-md-2 input-label"><span>说明</span></div>
          <div class="col-md-9"><textarea class="col9-textarea" readonly="true" v-model="metadataDetail.explanation"></textarea></div>
          <div class="col-md-1"><span class="validate-msg"></span></div>
        </div>
        <div class="row input">
          <div class="col-md-2 input-label"><span>对象类词</span></div>
          <div class="col-md-3"><span>{{metadataDetail.objectWord}}</span></div>
          <div class="col-md-1"><span class="validate-msg"></span></div>
          <div class="col-md-2 input-label"><span>特性词</span></div>
          <div class="col-md-3"><span>{{metadataDetail.characterWord}}</span></div>
          <div class="col-md-1"><span class="validate-msg"></span></div>
        </div>
        <div class="row input">
          <div class="col-md-2 input-label"><span>应用约束</span></div>
          <div class="col-md-9"><span>{{metadataDetail.applyRestraint}}</span></div>
          <div class="col-md-1"><span class="validate-msg"></span></div>
        </div>
        <div class="row input">
          <div class="col-md-2 input-label"><span>分类方案</span></div>
          <div class="col-md-3"><span>{{metadataDetail.solutionName}}</span></div>
          <div class="col-md-1"><span class="validate-msg"></span></div>
          <div class="col-md-2 input-label"><span>分类方案值</span></div>
          <div class="col-md-3"><span>{{metadataDetail.solutionValue}}</span></div>
          <div class="col-md-1"><span class="validate-msg"></span></div>
        </div>
        <div class="row input">
          <div class="col-md-2 input-label"><span>关系</span></div>
          <div class="col-md-9"><span>{{metadataDetail.relation}}</span></div>
          <div class="col-md-1"><span class="validate-msg"></span></div>
        </div>
        <div class="row input">
          <div class="col-md-2 input-label"><span>表示词</span></div>
          <div class="col-md-3"><span>{{metadataDetail.expressionWord}}</span></div>
          <div class="col-md-1"><span class="validate-msg"></span></div>
          <div class="col-md-2 input-label"><span>数据类型</span></div>
          <div class="col-md-3"><span>{{metadataDetail.dataType}}</span></div>
          <div class="col-md-1"><span class="validate-msg"></span></div>
        </div>
        <div class="row input">
          <div class="col-md-2 input-label"><span>表示格式</span></div>
          <div class="col-md-3"><span>{{metadataDetail.expressionFormat}}</span></div>
          <div class="col-md-1"><span class="validate-msg"></span></div>
          <div class="col-md-2 input-label"><span>计量单位</span></div>
          <div class="col-md-3"><span>{{metadataDetail.measureUnit}}</span></div>
          <div class="col-md-1"><span class="validate-msg"></span></div>
        </div>
        <div class="row input">
          <div class="col-md-2 input-label"><span>值域</span></div>
          <div class="col-md-9"><span>{{metadataDetail.valueField}}</span></div>
          <div class="col-md-1"><span class="validate-msg"></span></div>
        </div>
        <div class="row input">
          <div class="col-md-2 input-label"><span>状态</span></div>
          <div class="col-md-3"><span>{{metadataDetail.state}}</span></div>
          <div class="col-md-1"><span class="validate-msg"></span></div>
          <div class="col-md-2 input-label"><span>注册机构</span></div>
          <div class="col-md-3"><span>{{metadataDetail.registedOrg}}</span></div>
          <div class="col-md-1"><span class="validate-msg"></span></div>
        </div>
        <div class="row input">
          <div class="col-md-2 input-label"><span>提交机构</span></div>
          <div class="col-md-3"><span>{{metadataDetail.submitOrg}}</span></div>
          <div class="col-md-1"><span class="validate-msg"></span></div>
          <div class="col-md-2 input-label"><span>批准日期</span></div>
          <div class="col-md-3"><span>{{metadataDetail.approveDate}}</span></div>
          <div class="col-md-1"><span class="validate-msg"></span></div>
        </div>
        <div class="row input">
          <div class="col-md-2 input-label"><span>主要起草人</span></div>
          <div class="col-md-9"><textarea class="col9-textarea" readonly="true" v-model="metadataDetail.mainDraftsman"></textarea></div>
          <div class="col-md-1"><span class="validate-msg"></span></div>
          
        </div>
        <div class="row input">
          <div class="col-md-2 input-label"><span>备注</span></div>
          <div class="col-md-9"><textarea class="col9-textarea" readonly="true" v-model="metadataDetail.comments"></textarea></div>
          <div class="col-md-1"></div>
        </div>
        <div class="row input">
          <div class="col-md-2 input-label"><span>标签</span></div>
          <div class="col-md-3"><span>{{labels}}</span></div>
          <div class="col-md-1"><span class="validate-msg"></span></div>
        </div>
        <div v-show="isList && hasMetadataCodes" class="title">{{metadataDetail.name? metadataDetail.name + '数据元代码':'&nbsp;'}}</div>
        <div class="row head-input head-input-code-box" v-show="!isList && hasMetadataCodes">
          <div><span>{{metadataDetail.name? metadataDetail.name + '数据元代码':'&nbsp;'}}</span></div>
        </div>
        <div>
        <div class="row table-head" v-show="hasMetadataCodes">
            <div class="col-md-2 col-md-offset-1">序号</div>
            <div class="col-md-2">代码</div>
            <div class="col-md-2">名称</div>
            <div class="col-md-4">说明</div>
          </div>
          <div class="table-body" v-show="hasMetadataCodes">  
            <div v-for="(item, index) in metadataDetail.metadataCodes" class="row table-row">
              <div class="col-md-2 col-md-offset-1">{{index + 1}}</div>
              <div class="col-md-2">{{item.code}}</div>
              <div class="col-md-2">{{item.name}}</div>
              <div class="col-md-4">{{item.describe}}</div>
            </div>
          </div>
        </div> 
        <div class="save-btn-bottom-box" v-show="isList">
          <button  v-if="verifyPermission('009001008')" type="button" class="btnGreen" @click="download">下载说明</button>
          <button class="btnGreen" @click="goBack">返回</button>
        </div>        
      </div>    
    </div>       
  </div>  
</template>

<script>
import privibutton from '@/publicComponent/privibutton'
import ApiClient from '@/publicJs/ApiClient.js'
import Util from '@/publicJs/Util'
import UtilService from '@/publicJs/UtilService.js'
import Constants from '@/publicJs/Constants.js'
import LoadingBoxService from '../../../publicJs/LoadingBoxService.js'
export default {
  name: 'detail',
  components: {
    privibutton
  },
  props: ['id'],
  data () {
    return {
      dataHead: '',
      metadataDetail: {},
      isList: this.$route.params.page === 'list',
      dataTypes: {
        'STRING': '字符型(string)',
        'NUMERIC': '数值型(numeric)',
        'DATE': '日期型(date)',
        'DATETIME': '日期时间型(datetime)',
        'BOOLEAN': '布尔型(boolean)',
        'BINARY': '二进制型(binary)'
      },
      cookie: '',
      labels: '',
      treeData: {}
    }
  },
  created () {
  },
  mounted () {
    if (this.id != null) {
      this.getMetadataDetail(this.id)
    } else {
      this.getMetadataDetail(this.$route.params.id)
    }
    var treeData = sessionStorage.getItem('treeData')
    this.treeData = JSON.parse(treeData)
  },
  computed: {
    hasMetadataCodes () {
      return this.metadataDetail.metadataCodes && this.metadataDetail.metadataCodes.length > 0
    },
    heightclass () {
      if (this.isList) {
        return {position: 'absolute', top: '70px', bottom: 0, left: '15px', right: '15px', 'overflow': 'auto'}
      } else {
        return ''
      }
    }
  },
  methods: {
    getMetadataDetail (id) {
      LoadingBoxService.open('数据加载中...')
      ApiClient.get(Util.sf('/rcapi/metadata/id/{}', id)).then(data => {
        this.metadataDetail = data
        if (this.metadataDetail.approveDate !== '') {
          this.metadataDetail.approveDate = UtilService.formatDuring(data.approveDate, 'yyyy-MM-dd')
        }
        this.labels = this.metadataDetail.labels.join(',')
        LoadingBoxService.close()
      })
    },
    download () {
      window.location.href = Constants.apiBaseUrl + '/rcapi/metadata/download?id=' + this.metadataDetail.id + '&token=' + Util.getToken()
    },
    goBack () {
      this.$router.push({path: '/resourceCatalog', query: {detail: true}})
    },
    goHome () {
      this.$router.push({name: 'rcIndex'})
    }
  }
}
</script>
<style src="../../css/breadCrumb.css" scoped></style>
<style src="../../css/btn.css" scoped></style>
<style scoped>
  .breadCrumb {
    margin-bottom: 15px;
  }
  .input .input-label span{
    float: right;
    color: #222;
  }
  .main-content-box{
    box-shadow: none;
    background-color: #fff;
    padding: 0 15px;
    font-size: 12px;
  }
  .main-content-box .input{
    margin-bottom: 26px;
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
    color: #222;
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
  .btnGreen {
    margin-right: 120px;
  }
</style>
<style>
  .el-dialog--large{
    width: 75%;
  }
</style>
