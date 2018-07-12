<template>
<div class="test_report_box clearfix">
  <!-- <div class="test_report_top">
    <span class="trt_name">{{'《' + reportData.statistics.resourceName + '》质量检测报告'}}</span>
    <button class="tst_btn">下载报告</button>
  </div> -->
  <div class="test_report_main">
    <div class="review">综述</div>
    <div class="button_download" @click="download">
      <i class="iconfont icon-daoru"></i>下载报告
    </div>
    <div class="trm_chart clearfix">
      <div class="trm_cleft">
        <div class="name_sfzh clearfix">
         《{{reportData.statistics.resourceName}}》数据资源共检测<span>{{reportData.checkFields.length}}</span>个字段，字段分别是：
          <span>{{this.detectionField}}</span>，数据检测结果为：<span class="span_dtr_main">
            完全可用（{{fullyUsable}}%，{{reportData.statistics.fullyUsableNum}}条)，
            一般可用（{{barelyUsable}}%,{{reportData.statistics.barelyUsableNum}}条)，
            不可用（{{unUsable}}%，{{reportData.statistics.unUsableNum}}条)，综合计算，可靠度为：{{fullyUsable}}% 。</span>
        </div>
      </div>
      <div class="trm_chart_main">
        <div class="trm_chart_m">
          <div id="pie" style="width:400px;height:300px;"></div>
        </div>
      </div>
    </div>
    <div class="basic_information clearfix">
      <div class="bi_top">数据检测结果</div>
      <div class="resources_detail_main">
        <el-table :data="reportData.data" border @filter-change="changeUsable" highlight-current-row style="width: 100%;" v-loading="tableLoad">
          <el-table-column type="index" label="序号" width="60"></el-table-column>
          <el-table-column v-for="(header,index) in reportData.checkFields"
            :prop="header.prop"
            :label="header.prop + (header.name?'('+header.name+')':'')"
            :key="index" width="170">
          </el-table-column>
          <el-table-column
            column-key="usableStatus"
            prop="usableStatus"
            label="是否可用"
            :filters="showUsable"
            :filter-multiple="isMultiple"
            :filter-method="filterTag"
            width="120"></el-table-column>
          <el-table-column prop="reason" label="错误原因" width="240">
            <template slot-scope="scope">
              <div v-html="reasonFormat(scope.row.reason)"></div>
            </template>
          </el-table-column>
          <el-table-column prop="dataCheckTaskName" label="检测任务" width="120"></el-table-column>
          <el-table-column prop="checkTime" label="检测时间" width="150"></el-table-column>
        </el-table>
      <div class="zxf_pagediv">
          <div class="block"  v-show="showpagination">
              <el-pagination
              @current-change="handleCurrentChange"
              layout="prev,pager,next,jumper"
              :current-page.sync="pageNum"
              :page-size="pagesize"
              :total="searchResultNum"
              :page-sizes="pageSizes"
              @size-change="sizeChange">
              </el-pagination>
          </div>
      </div>
      </div> 
      <div class="button_bi_btn">
        <button class="btnBlue" @click="download">下载</button>
        <!-- <button class="shut_down">关闭</button> -->
      </div>
    </div>
  </div>
</div>  
</template>

<script>
import apiClient from '@/publicJs/ApiClient.js'
// import utilService from '@/publicJs/UtilService.js'
import Constants from '@/publicJs/Constants.js'
import _ from 'lodash'
import LoadingBoxService from '@/publicJs/LoadingBoxService.js'
import Util from '@/publicJs/Util.js'
// 引入基本模板
let echarts = require('echarts/lib/echarts')
// 引入饼状图组件
require('echarts/lib/chart/pie')
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
export default {
  props: ['id'],
  mounted () {
    this.getTableData()
    this.getPieData()
  },
  data () {
    return {
      // 分页组件显示标志
      showpagination: false,
      // 当前页数
      pageNum: 1,
      // 每页数量
      pagesize: 10,
      // 可选页数
      pageSizes: [10, 20, 50],
      searchResultNum: 0,
      // 表格加载标志
      tableLoad: false,
      reportData: {
        headers: [],
        checkFields: [],
        tableData: [],
        statistics: {
          resourceName: '',
          fullyUsableNum: 0,
          barelyUsableNum: 0,
          unUsableNum: 0
        }
      },
      detectionField: '', // 检测字段
      fullyUsable: 0,
      barelyUsable: 0,
      unUsable: 0,
      pieData: [],
      showUsable: [
        { text: '完全可用', value: '完全可用' },
        { text: '一般可用', value: '一般可用' },
        { text: '不可用', value: '不可用' }],
      // 是否多选标志
      isMultiple: false,
      usableStatus: ''
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
    drawPie () {
      var myChart = echarts.init(document.getElementById('pie'))
      var option = {
        tooltip: { // 提示框组件
          trigger: 'item', // 触发类型
          formatter: '{a} <br/>{b} : {d}%' // 提示框浮层内容格式器
        },
        color: ['#29f1ff', '#2fbbf7', '#174b85'], // 手动设置每个图例的颜色
        series: [ // 系列列表
          {
            name: '数据检测结果', // 系列名称
            type: 'pie', // 类型 pie表示饼图
            radius: ['45%', '70%'],
            // data: this.userPortfoliosMoney
            data: this.pieData,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
      myChart.setOption(option)
    },
    getPieData () {
      LoadingBoxService.open('数据加载中...')
      // let id = utilService.getQueryString('id')
      apiClient.get('/rcapi/dataCheckReport/' + this.id).then(data => {
        this.detectionField = _.join(_.map(data.checkFields, function (v) {
          return v.prop + (v.name ? '(' + v.name + ')' : '')
        }), '、')
        let fully = data.statistics.fullyUsableNum
        let barely = data.statistics.barelyUsableNum
        let un = data.statistics.unUsableNum
        this.fullyUsable = (fully / (fully + barely + un) * 100).toFixed(2)
        this.barelyUsable = (barely / (fully + barely + un) * 100).toFixed(2)
        this.unUsable = (un / (fully + barely + un) * 100).toFixed(2)
        this.pieData.splice(0)
        this.pieData.push(
          {'name': '不可用', 'value': data.statistics.unUsableNum},
          {'name': '一般可用', 'value': data.statistics.barelyUsableNum},
          {'name': '完全可用', 'value': data.statistics.fullyUsableNum})
        this.drawPie()
        LoadingBoxService.close()
      }).catch(e => {
        console.error(e)
        LoadingBoxService.close()
      })
    },
    getTableData () {
      this.tableLoad = true
      // let id = utilService.getQueryString('id')
      apiClient.get('/rcapi/dataCheckReport/' + this.id, {
        pageNum: this.pageNum,
        pageSize: this.pagesize,
        usableStatus: this.usableStatus
      }).then(data => {
        this.showpagination = true
        this.reportData = data
        this.searchResultNum = data.totalNum
        this.tableLoad = false
      }).catch(e => {
        console.error(e)
        this.showpagination = false
        this.tableLoad = false
      })
    },
    filterTag (value, row) {
      return false
    },
    changeUsable (filter) {
      if (filter.length === 0) {
        this.usableStatus = ''
      } else {
        this.usableStatus = filter.usableStatus[0]
      }
      this.getTableData()
    },
    reasonFormat (reason) {
      let resMap = _.map(JSON.parse(reason), function (value, key) {
        return key + value
      })
      let resultStr = ''
      for (let i = 0; i < resMap.length; i++) {
        resultStr += resMap[i] + '<br>'
      }
      return resultStr
    },
    download () {
      // let id = utilService.getQueryString('id')
      let id = this.id
      let token = Util.getToken()
      // window.location.href = Constants.apiBaseUrl + '/api/dataCheckReport/download?id=' + id + '&token=' + Constants.token
      window.open(Constants.apiBaseUrl + '/rcapi/dataCheckReport/download?id=' + id + '&token=' + token)
    }
  }
}
</script>

<style src="" scoped></style>
<style scoped>
  .review, .bi_top{
    border-bottom: 1px solid #e5e5e5;
    padding-bottom: 8px;
    padding-left: 5px;
    color: #56A4FE;
    font-size: 14px;
  }
  .review>span, .bi_top>span{
    font-weight: bold;
    margin: 0 8px;
  }
  .bi_top{
    margin-bottom: 8px;
  }
  .resources_detail_main{
    width: 100%;
    height: auto;
    overflow-x: auto;
  }
  .basic_information{
    position: relative;
    width: 70vw;
  }
  .resources_detail_main{
    width: 100%;
  }
  .trm_cleft{
    width: 55%;
    float: left;
  }
  .trm_chart_main{
    width: 45%;
    float: right;
  }
  .name_sfzh{
    padding-top: 40px;
    padding-right: 10px;
    line-height: 20px;
  }
  .span_dtr_main{
    color: #ff8400;
  }
  .button_bi_btn>button{
    position: absolute;
    bottom: -30px;
    left: 35%;
  }
  .test_report_main{
    position: relative;
    margin-top: 20px;
  }
  .button_download{
    border: 1px solid #2fbbf7;
    padding: 5px 10px;
    border-radius: 5px;
    display: inline-block;
    position: absolute;
    right: 15px;
    top: -16px;
    cursor: pointer;
  }
  .button_download i{
    margin-right: 6px;
    color: #2fbbf7;
  }
</style>
<style>
  .basic_information .el-table{
    font-size: 12px;
  }
  .zxf_pagediv .el-pagination{
    text-align: center;
    margin: 10px 0;
  }
  .basic_information .el-table td, .basic_information .el-table th{
    height: 30px;
    overflow-x: auto;
  }
  .basic_information .el-table .cell, .el-table th>div{
    padding-left: 10px;
    padding-right: 10px;
  }
</style>
