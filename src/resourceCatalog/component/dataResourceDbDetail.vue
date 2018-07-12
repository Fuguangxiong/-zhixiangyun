<template>
  <div class="test_report_box clearfix">
    <div class="test_report_main">
      <div class="basic_information clearfix">
        <div class="breadCrumb">
          <i class="iconfont icon-dingwei" @click="goHome"></i>
          <router-link to="/personApplyManage">个人申请</router-link>
          <span>查看《{{datatitle}}》数据详情</span>
        </div>
        <div class="resources_detail_main">
          <i class="iconfont icon-fanhui back" @click="goBack"><span>返回</span></i>
          <div class="dataInfo">
            <h4>基本信息</h4>
            <div class="dataInfoContent">
              <div>数据说明 ：<span>{{dataResourceDesc.dataExplain}}</span></div>
              <div class="line2"><span>数据字段 ：</span><p>{{dataResourceDesc.dataItem}}</p></div>
              <div class="line3">
                <div>注册人 ：<span>{{dataResourceDesc.registerPerson}}</span></div>
                <div>创建时间 ：<span>{{dataResourceDesc.dataRegisterTime}}</span></div>
              </div>
            </div>
          </div>
          <div class="search">
            <h4>查询数据</h4>
            <div class="simpleSearch clearfix">
                <input type="text" v-model="keyword" v-on:keyup.enter="handleSearch" class="searchInput">
                <button @click="handleSearch" class="searchButton">搜索</button>
            </div>
            <div class="searchResultBox">
              <p>共找到
                <span class="searchResultNumber"> {{searchResultNum}} </span> 条结果</p>
            </div>
            <div class="download" @click="download">
              <i class="iconfont icon-xiazai"></i> 下载
            </div>
          </div>
          <!-- 下载弹框开始 -->
          <el-dialog
            title="下载"
            :visible.sync="downloadVisible"
            width="30%"
            >
            <div class="input_box">
              <div class="input_section">
                <span>起始页：</span>
                <input v-model="startPage" type="number"/>
              </div>
              <div class="input_section">
                <span>终止页：</span>
                <input v-model="endPage" type="number"/>
              </div>  
            </div>
            <span class="download_tips">注：每次最多下载100页</span>
            <span slot="footer" class="buttonbox">
              <button class="btnGray btnSpace" @click="downloadVisible = false">取 消</button>
              <button class="btnGreen" type="primary" @click="downloadSelected">确 定</button>
            </span>
          </el-dialog>
          <!-- 下载弹框结束 -->
          <el-table v-show="dbData.data" class="datatable" :data="dbData.data" border highlight-current-row style="width: 100%;" v-loading="tableLoad">
            <el-table-column type="index" label="序号" width="60"></el-table-column>
            <el-table-column v-for="(header,index) in dbData.fields" :prop="header.prop" :label="header.prop + (header.name?'('+header.name+')':'')" :key="index" width="170">
            </el-table-column>
          </el-table>
          <div class="zxf_pagediv">
            <div class="block" v-show="showpagination">
              <el-pagination @current-change="handleCurrentChange" layout="total,prev,pager,next,jumper" :current-page.sync="pageNum" :page-size="pagesize" :total="searchResultNum" :page-sizes="pageSizes" @size-change="sizeChange">
              </el-pagination>
            </div>
          </div>
        </div>        
      </div>
    </div>
  </div>
</template>

<script>
import apiClient from '@/publicJs/ApiClient.js'
import utilService from '@/publicJs/UtilService.js'
import Constants from '@/publicJs/Constants.js'
import _ from 'lodash'
import LoadingBoxService from '@/publicJs/LoadingBoxService.js'
import TipBoxService from '@/publicJs/TipBoxService'
import $ from 'jquery'
// 引入基本模板
// let echarts = require('echarts/lib/echarts')
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
export default {
  mounted () {
    this.datatitle = sessionStorage.getItem('dataResourceDbDetailtitle')
    this.id = this.$route.query.id
    this.getResource()
    this.getTableData()
  },
  data () {
    return {
      datatitle: '数据',
      // 分页组件显示标志
      showpagination: false,
      id: null,
      keyword: '',
      // 当前页数
      pageNum: 1,
      // 每页数量
      pagesize: 10,
      // 可选页数
      pageSizes: [10, 20, 50],
      searchResultNum: 0,
      // 表格加载标志
      tableLoad: false,
      dbData: {
        fields: [],
        tableData: []
      },
      startPage: '',
      endPage: '',
      downloadVisible: false,
      dataResourceDesc: {
        datasourcedesc: '',
        name: '', // 数据名称
        registerPerson: '', // 注册人
        registerUnit: '', // 注册单位
        dataRegisterTime: '', // 数据注册时间
        dataAuth: '', // 数据权限
        dataItem: '', // 数据字段
        dataSource: '', // 数据来源
        validTimeRange: '', // 使用期限
        dataExplain: '' // 数据说明
      }
    }
  },
  methods: {
    sizeChange (pagesize) {
      this.pagesize = pagesize
      this.pageNum = 1
      this.getTableData()
    },
    handleCurrentChange (val) {
      this.pageNum = val
      this.getTableData()
    },
    handleSearch (e) {
      this.getTableData()
    },
    getResource () {
      LoadingBoxService.open('数据加载中...')
      this.resourceId = this.$route.query.id
      apiClient.get('/rcapi/findResourcesById', {resourceId: this.$route.query.id}).then(data => {
        this.dataResourceDesc.name = data.resource.resourcename // 数据名称
        this.dataResourceDesc.registerPerson = data.resource.truename // 注册人
        this.dataResourceDesc.registerUnit = data.resource.bussid // 注册单位
        this.dataResourceDesc.dataRegisterTime = data.resource.registtime // 数据注册时间
        this.dataResourceDesc.dataAuth = data.resource.datapriv // 数据权限
        let dbfields = []
        for (let i = 0; i < data.table.dbfield.length; i++) {
          if (data.table.dbfield[i].status === true) {
            dbfields.push(data.table.dbfield[i])
          }
        }
        this.dataResourceDesc.dataItem = _.join(_.map(dbfields, function (v) {  // 数据字段
          return v.name + (v.desc ? '(' + v.desc + ')' : '')
        }), '、')
        this.dataResourceDesc.dataSource = data.resource.datasource // 数据来源
        if (data.resource.begintime === '1970-01-01') {
          this.dataResourceDesc.validTimeRange = '长期使用' // 使用期限
          this.time = '长期使用'
        } else {
          this.dataResourceDesc.validTimeRange = data.resource.begintime + ' 至 ' + data.resource.endtime
          this.time = data.resource.begintime + ' 至 ' + data.resource.endtime
        }
        this.dataResourceDesc.dataExplain = data.resource.datasourcedesc // 数据说明
        LoadingBoxService.close()
      }, error => {
        console.error(error)
        LoadingBoxService.close()
      })
    },
    getTableData () {
      this.tableLoad = true
      apiClient
        .get('/rcapi/findDataResourcesInfoById', {
          id: this.id,
          keyword: this.keyword,
          pageNum: this.pageNum,
          pageSize: this.pagesize
        })
        .then(data => {
          // console.log(data)
          this.showpagination = true
          this.dbData = data
          this.searchResultNum = data.total
          // console.log(this.searchResultNum)
          this.tableLoad = false
        })
        .catch(e => {
          console.error(e)
          this.showpagination = false
          this.tableLoad = false
        })
    },
    download () {
      // let id = utilService.getQueryString('id')
      this.downloadVisible = true
      // window.location.href =
      //   Constants.apiBaseUrl +
      //   '/api/dataCheckReport/download?id=' +
      //   id +
      //   '&token=' +
      //   Constants.token
    },
    downloadSelected () {
      let startPage = this.startPage
      let endPage = this.endPage
      let id = this.id
      let keyword = this.keyword
      let token = this.getToken()
      if (startPage <= 0) {
        TipBoxService.open('起始页需大于0', 2)
        return
      } else if (endPage > Math.ceil(this.searchResultNum / 10)) {
        TipBoxService.open('终止页不能超过总页数', 2)
        return
      } else if (endPage < startPage){
        TipBoxService.open('终止不能小于起始页', 2)
        return
      } else if (endPage - startPage > 100) {
        TipBoxService.open('每次最多下载100页', 2)
        return
      } else {
        window.open(Constants.apiBaseUrl + '/rcapi/downloadDataResourcesInfo?tokenId=' + token + '&id=' + id + '&keyword=' + keyword + '&pageStart=' + startPage + '&pageEnd=' + endPage)
        this.downloadVisible = false
      }
    },
    goBack () {
      this.$router.push('/personApplyManage?index=0')
    },
    goHome () {
      this.$router.push({name: 'Index'})
      this.$parent.setActive('资源管理', '资源目录')
      // this.$parent.leftNavData[1].active = false
      // this.$parent.leftNavData[2].active = false
      // this.$parent.leftNavData[0].active = true
    },
    getToken () {
      let token = $.cookie('tokenId')
      if (token && token !== 'null') {
        return token
      }
      return this.getParameterByName('token') || ''
    }
  }
}
</script>

<style src="" scoped></style>
<style scoped>
.resources_detail_main {
  margin-top: 15px;
  background-color: #fff;
  padding: 15px;
  position: absolute;
  top: 60px;
  left: 15px;
  right: 15px;
  bottom: 0;
  overflow: auto;
}
.resources_detail_main h4 {
  font-size: 16px;
  font-weight: normal;
  color: #56a8fe;
  border-bottom: 1px solid #56a8fe;
  line-height: 40px;
  text-indent: 10px;
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
.dataInfoContent {
  padding-left: 10px;
  padding-right: 25%;
  min-width: 1000px;
  padding-bottom: 30px;
}
.dataInfoContent > div {
  height: 50px;
  line-height: 50px;
}
.dataInfoContent > div span {
  color: #888;
}
.dataInfoContent .line2 {
}
.dataInfoContent .line2 > span {
  color: #000;
  float: left;
  margin-top: -18px;
}
.dataInfoContent .line2 > p{
  padding: 5px;
  background-color: #F9FBFE;
  line-height: 20px;
  float: left;
  width: 80%;
}
.dataInfoContent .line3 {
  display: flex;
}
.dataInfoContent .line3 > div {
  flex: 1;
}
.search {
  height: 200px;
  border-bottom: 1px solid #ccc;
  position: relative;
}
.search .simpleSearch {
  float: left;
  border: 1px solid #56a8fe;
  border-radius: 6px;
  overflow: hidden;
  width: 610px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.searchButton {
  width: 77px;
  background: #56a4fe;
  float: right;
  margin-left: 0;
  height: 38px;
  color: #fff;
  border-radius: 0;
  padding: 0;
  border: none;
  outline: none;
}
.searchButton:active {
  border: 0;
}
.simpleSearch input {
  height: 38px;
  line-height: 38px;
  padding-left: 10px;
  float: left;
}
.searchInput {
  width: 530px;
  height: 30px;
  font-family: "Arial Normal", "Arial";
  font-weight: 400;
  font-size: 14px;
  text-decoration: none;
  text-align: left;
  border-color: transparent;
  outline-style: none;
  padding: 1px 0px 1px 0px;
  box-sizing: border-box;
  border-radius: 3px;
  border: 1px #ffffff solid;
  line-height: 22px;
  float: left;
}
.searchResultBox {
  position: absolute;
  bottom: 5px;
  left: 5px;
}
.searchResultNumber {
  color: red;
}
.download {
  position: absolute;
  bottom: 5px;
  right: 5px;
  color: #56a4fe;
  cursor: pointer;
}
.datatable {
  margin-top: 15px;
}
.input_box{
  display: flex;
}
.input_section{
  flex: 1;
}
.input_section span{
  margin-right: 10px;
}
.input_section input{
  width: 150px;
  height: 31px;
  border: 1px solid #d4e2ed;
  border-radius: 4px;
  padding: 0px 10px;
}
.download_tips{
  color: #aaa;
  font-size: 12px;
  margin: 10px 0 10px 70px;
  display: inline-block;
}
.input_section input::-webkit-outer-spin-button,
.input_section input::-webkit-inner-spin-button {
    -webkit-appearance: none !important;
    margin: 0;
}
</style>
<style>
.test_report_main .resources_detail_main .el-dialog__footer{
  text-align: center;
}
.basic_information .el-table {
  font-size: 12px;
}

.zxf_pagediv .el-pagination {
  text-align: center;
  margin: 10px 0;
}

.basic_information .el-table td,
.basic_information .el-table th {
  height: 30px;
  overflow-x: auto;
}

.basic_information .el-table .cell,
.el-table th > div {
  padding-left: 10px;
  padding-right: 10px;
}
.test_report_main .el-dialog--small{
  width: 40%;
}
</style>

