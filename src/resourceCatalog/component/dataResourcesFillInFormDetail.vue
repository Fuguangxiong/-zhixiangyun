<template>
  <div class="main-content-box">
    <div class="main-content">
      <div class="divtime">
        <div class="row head-input">
          <div><span>注册人信息</span></div>
        </div>
        <div class="row input">
          <div class="col-md-2 input-label"><span>注册人</span></div>
          <div class="col-md-3"><span>{{formData.truename}}</span></div>
          <div class="col-md-1"><span class="validate-msg"></span></div>
          <div class="col-md-2 input-label"><span>注册日期</span></div>
          <div class="col-md-3"><span>{{formData.registtime}}</span></div>
          <div class="col-md-1"><span class="validate-msg"></span></div>
        </div>
        <!-- <div class="row input">
          <div class="col-md-2 input-label"><span>单位</span></div>
          <div class="col-md-3"><span></span></div>
          <div class="col-md-1"><span class="validate-msg"></span></div>
          <div class="col-md-2 input-label"><span>部门</span></div>
          <div class="col-md-3"><span>{{formData.deptname}}</span></div>
          <div class="col-md-1"><span class="validate-msg"></span></div>
        </div> -->
        <div class="row input">
          <div class="col-md-2 input-label"><span>性别</span></div>
          <div class="col-md-3"><span>{{formData.sex}}</span></div>
          <div class="col-md-1"><span class="validate-msg"></span></div>
          <div class="col-md-2 input-label"><span>联系电话</span></div>
          <div class="col-md-3"><span>{{formData.phone}}</span></div>
          <div class="col-md-1"><span class="validate-msg"></span></div>
        </div>
        
      </div>
      <!--数据说明-->
      <div class="divtime">
        <div class="row head-input">
          <div><span>数据说明</span></div>
        </div>
        <div class="row input">
          <div class="col-md-2 input-label"><span>服务资源名称</span></div>
          <div class="col-md-3"><span>{{formData.resourcename}}</span></div>
          <div class="col-md-1"><span class="validate-msg"></span></div>
        </div>
        <div class="row input">
          <div class="col-md-2 input-label"><span>资源标签</span></div>
          <div class="col-md-3"><span>{{formData.resourcetag}}</span></div>
          <div class="col-md-1"><span class="validate-msg"></span></div>
        </div>  
        <div class="row input">
          <div class="col-md-2 input-label"><span>数据来源</span></div>
          <div class="col-md-3"><span>{{formData.datasource}}</span></div>
          <div class="col-md-1"><span class="validate-msg"></span></div>
        </div>
        <div class="row input">
          <div class="col-md-2 input-label"><span>数据使用期限</span></div>
          <div class="col-md-3"><span>{{applytime}}</span></div>
          <div class="col-md-1"><span class="validate-msg"></span></div>
        </div>  
        <div class="row input">
          <div class="col-md-2 input-label"><span>数据源介绍</span></div>
          <div class="col-md-9"><textarea class="col9-textarea" readonly="true" v-model="formData.datasourcedesc"></textarea></div>
          <div class="col-md-1"><span class="validate-msg"></span></div>
        </div>  
        <div class="row input">
          <div class="col-md-2 input-label"><span>数据权限</span></div>
          <div class="col-md-3"><span>{{formData.datapriv}}</span></div>
          <div class="col-md-1"><span class="validate-msg"></span></div>
        </div>
      </div>
      <!--数据说明结束-->
      <!--配置信息-->
      <div class="divtime">
        <div class="row head-input">
          <div><span>配置信息</span></div>
        </div>
        <div class="row input">
          <div class="col-md-2 input-label"><span>数据访问地址</span></div>
          <div class="col-md-3"><span>{{dbData.dburl}}</span></div>
          <div class="col-md-1"><span class="validate-msg"></span></div>
        </div>
        <div class="row input">
          <div class="col-md-2 input-label"><span>端口号</span></div>
          <div class="col-md-3"><span>{{dbData.dbport}}</span></div>
          <div class="col-md-1"><span class="validate-msg"></span></div>
        </div>
        <div class="row input">
          <div class="col-md-2 input-label"><span>库名</span></div>
          <div class="col-md-3"><span>{{dbData.dbname}}</span></div>
          <div class="col-md-1"><span class="validate-msg"></span></div>
        </div>
        <div class="row input">
          <div class="col-md-2 input-label"><span>表名</span></div>
          <div class="col-md-3"><span>{{sheetData.tablename}}</span></div>
          <div class="col-md-1"><span class="validate-msg"></span></div>
        </div>
        <div class="row input">
          <div class="col-md-2 input-label"><span>用户名</span></div>
          <div class="col-md-3"><span>{{dbData.username}}</span></div>
          <div class="col-md-1"><span class="validate-msg"></span></div>
        </div>
      </div>
      <!--配置信息结束-->
      <!--数据字段-->
      <div class="divtime" v-show="showDataTable">
        <div class="row head-input">
          <div><span>数据字段</span></div>
        </div>
        <div class="row table-head">
          <div class="col-md-2 col-md-offset-1">序号</div>
          <div class="col-md-3">自数据库字段</div>
          <div class="col-md-3">字段说明</div>
          <div class="col-md-2">字段标签</div>
        </div>  
        <div class="table-body">  
          <div v-for="(item, index) in tableData.dbfield" :key="index" class="row table-row">
            <div class="col-md-2 col-md-offset-1">{{index + 1}}</div>
            <div class="col-md-3">{{item.name}}</div>
            <div class="col-md-3">{{item.desc}}</div>
            <div class="col-md-2">{{item.tag}}</div>
          </div> 
        </div>
      </div>
      <!--数据字段结束-->
    </div>
  </div>
</template>
<script>
  import ApiClient from '../../publicJs/ApiClient.js'
  // import TipBoxService from '../../publicJs/TipBoxService.js'
  import LoadingBoxService from '../../publicJs/LoadingBoxService.js'
  export default{
    name: 'dataResourcesFillInFormDetail',
    props: ['resId'],
    data () {
      return {
        uiData: {
          demandType: [{ name: '临时办案', input: false, active: true }, {name: '日常查询', input: false, active: false}, {name: '开发应用', input: false, active: false}, {name: '其他', input: true, active: false} ],
          useLife: [{name: '某一段时间', active: true, dataPick: true}, {name: '长期使用', active: false, dataPick: false}],
          time: '',
          btnControlSwitch: true
        },
        formData: {},
        dbData: {},
        tableData: {
          dbfield: []
        },
        sheetData: '',
        applytime: '',
        submitData: {
          resourcetype: '',
          resourcetags: '',
          dbsource: '',
          demandtype: 0,
          demandnote: '',
          time: '',
          demanddesc: '',
          perioduse: 0,
          remarks: '',
          id: ''
        },
        linkData: {
          resource: {},
          dbinfo: {},
          table: {}
        },
        dbfields: [],
        showDataTable: false
      }
    },
    mounted () {
      if (this.resId != null) {
        this.backShow(this.resId)
      } else {
        this.backShow(this.$route.params.resId)
      }
    },
    methods: {
      backShow (resId) { // 编辑的时候从后台得到数据
        // var that=this;
        LoadingBoxService.open('数据加载中...')
        ApiClient.get('rcapi/findResourcesById', {resourceId: resId}).then(data => {
          this.formData = data.resource
          this.dbData = data.dbinfo
          this.sheetData = data.table
          if (data.resource.begintime === '1970-01-01') {
            this.applytime = '长期使用'
          } else {
            this.applytime = data.resource.begintime + '至' + data.resource.endtime
          }
          for (let i = 0; i < data.table.dbfield.length; i++) {
            if (data.table.dbfield[i].status === true) {
              this.tableData.dbfield.push(data.table.dbfield[i])
            }
          }
          if (this.tableData.dbfield && this.tableData.dbfield.length > 0) {
            this.showDataTable = true
          }
          LoadingBoxService.close()
        })
      },
      goHome () {
        this.$router.push({name: 'RcIndex'})
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
    padding: 0 15px;
    font-size: 12px;
  }
  .main-content-box .input{
    margin-bottom: 26px;
  }
  .main-content{
    box-shadow: none !important;
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
    padding: 0 18px;
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
  .table-row .col-md-2, .table-row .col-md-3{
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
