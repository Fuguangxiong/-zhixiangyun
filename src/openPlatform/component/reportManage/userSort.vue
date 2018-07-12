<template>
  <div class="user-sort">
      <h2>活跃用户排行</h2>
      <div class="content clearfix">
          <div class="content-left">
              <div class="content-title">
                  <h3>活跃用户访问TOP&nbsp;50</h3>
                  <div class="time-length">
                      <span @click="changeDateLeft('')" :class="{ highlight:timeLengthLeft === '7' }">近一周</span>
                      <span @click="changeDateLeft('30')" :class="{ highlight:timeLengthLeft === '30' }">近一月</span>
                      <span @click="changeDateLeft('365')" :class="{ highlight:timeLengthLeft === '365' }">近一年</span>
                  </div>
              </div>
              <div class="content-list">
                  <div class="list-title">
                      <span>所属</span>
                      <span>身份</span>
                      <span>访问数(次)</span>
                  </div>
                  <div class="list" v-for="item in newUserRankingList" :key="item.sortranking" v-show="!isDataLeft">
                      <span v-show="item.sortranking !== 1 & item.sortranking !== 2 & item.sortranking !== 3" class="rank">{{ item.sortranking }}</span>
                      <span v-show="item.sortranking === 1" class="rank">
                        <i class="iconfont icon-12" style="color:#D81E06"></i>
                      </span>
                      <span v-show="item.sortranking === 2" class="rank">
                        <i class="iconfont icon-13" style="color: #F96D22"></i>
                      </span>
                      <span v-show="item.sortranking === 3" class="rank">
                        <i class="iconfont icon-14" style="color: #1296DB"></i>
                      </span>
                      <span class="belong" v-show="item.belong_type === 'PERSONAL'">{{ item.username }}</span>
                      <span class="belong" v-show="item.belong_type !== 'PERSONAL'">{{ item.name }}</span>
                      <span v-show="item.belong_type === 'ENTERPRISE'" class="identity">企业</span>
                      <span v-show="item.belong_type === 'PLATFORM'" class="identity">平台</span>
                      <span v-show="item.belong_type === 'PERSONAL'" class="identity">个人</span>
                      <span class="visit-count">{{ item.doc_count }}</span>
                  </div>
                  <!-- 未找到相关数据 -->
                  <div class="isDate" v-show="isDataLeft">
                      <img src="../../images/nothing.png" alt="未查找到相关数据">
                      <p>未查找到相关数据</p>
                  </div>
              </div>
              <!-- 分页 -->
              <div class="paging" v-show="isPaging">
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :page-size="pageSize"
                    :current-page.sync="pageNum"
                    layout="prev, pager, next, jumper"
                    :total="total" 
                >
                </el-pagination>
              </div>
          </div>
          <div class="contnet-right">
              <div class="content-title">
                  <h3>API调用排行TOP&nbsp;10</h3>
                  <div class="time-length">
                      <span @click="changeDateRight('')" :class="{ highlight:timeLengthRight === '7' }">近一周</span>
                      <span @click="changeDateRight('30')" :class="{ highlight:timeLengthRight === '30' }">近一月</span>
                      <span @click="changeDateRight('365')" :class="{ highlight:timeLengthRight === '365' }">近一年</span>
                  </div>
              </div>
              <!-- 柱状图 -->
              <div class="bar-data" id="barData" v-show="!isDataRight"></div>
              <!-- 未找到相关数据 -->
              <div class="isDate" v-show="isDataRight">
                  <img src="../../images/nothing.png" alt="未查找到相关数据">
                  <p>未查找到相关数据</p>
              </div>
          </div>
      </div>
  </div>
</template>
<script>
import echarts from 'echarts'
import apiClient from '../../../publicJs/ApiClient.js'
import LoadingBoxService from '../../../publicJs/LoadingBoxService.js'
import TipBoxService from '../../../publicJs/TipBoxService'
import UtilService from '../../../publicJs/UtilService.js'
export default {
  name: 'userSort',
  data () {
    return {
      timeLengthLeft: '', // 左侧时间段
      timeLengthRight: '', // 右侧时间段
      isPaging: true, // 是否显示分页
      isDataLeft: false, // 右侧是否有数据
      isDataRight: false, // 左侧是否有数据
      pageSize: 15, // 每页显示多少条
      pageNum: 1,
      total: 0, // 总共条数
      pageCount: 0, // 总共页数
      userRankingList: [],
      newUserRankingList: [],
      paramsLeft: { // 左侧参数
        startDate: '', // 开始日期
        endDate: ''  // 结束日期
      },
      paramsRight: { // 右侧侧参数
        startDate: '', // 开始日期
        endDate: ''  // 结束日期
      },
      xData: [],
      yData: []
    }
  },
  created () {
    this.getUserRanking()
    console.log('开始时间', this.paramsLeft.startDate)
    console.log('结束时间', this.paramsLeft.endDate)
  },
  mounted () {
    this.getApiRanking()
  },
  methods: {
    // 活跃用户排行榜
    getUserRanking (timeLengthLeft) {
      if (timeLengthLeft === '30') {
        this.timeLengthLeft = '30'
      } else if (timeLengthLeft === '365') {
        this.timeLengthLeft = '365'
      } else {
        this.timeLengthLeft = '7'
      }
      this.getDateLeft()
      let that = this
      LoadingBoxService.open('加载中...')
      console.log('左侧参数', this.paramsLeft)
      apiClient.get('report/rankings/getInvokeServiceRankings', that.paramsLeft, function (data) {
        LoadingBoxService.close()
        if (data.status === 200) {
          if (data.results.total === 0) {
            that.isDataLeft = true
            that.isPaging = false
          } else {
            console.log('是数据啊', data)
            that.isDataLeft = false
            that.userRankingList = data.results.data
            that.total = that.userRankingList.length
            that.pageCount = Math.ceil(that.total / that.pageSize)
            that.newUserRankingList = []
            let maxLength
            if (that.pageNum === that.pageCount) {
              maxLength = that.total
            } else {
              maxLength = that.pageSize * that.pageNum
            }
            for (let i = (that.pageNum - 1) * that.pageSize; i < maxLength; i++) {
              that.newUserRankingList.push(that.userRankingList[i])
            }
            if (that.total <= that.pageSize) {
              that.isPaging = false
            } else {
              that.isPaging = true
            }
          }
        } else {
          TipBoxService.open(data.exception, 2)
        }
      })
    },
    // 活跃用户排行榜获取时间
    getDateLeft () {
      let endTimes = new Date()
      this.paramsLeft.endDate = UtilService.formatDuring(endTimes.getTime(), 'yyyy-MM-dd')
      let startTimes = endTimes.getTime() - Number(this.timeLengthLeft) * 24 * 60 * 60 * 1000
      this.paramsLeft.startDate = UtilService.formatDuring(startTimes, 'yyyy-MM-dd')
    },
    // 活跃用户排行榜选择时间段
    changeDateLeft (timeLengthLeft) {
      this.pageNum = 1
      this.paramsLeft.startDate = ''
      this.paramsLeft.endDate = ''
      if (timeLengthLeft === '30') {
        this.timeLengthLeft = '30'
      } else if (timeLengthLeft === '365') {
        this.timeLengthLeft = '365'
      } else {
        this.timeLengthLeft = '7'
      }
      this.getUserRanking(timeLengthLeft)
    },
    handleSizeChange () {},
    handleCurrentChange () {
      this.getUserRanking(this.timeLengthLeft)
    },
    // API调用排行Top10
    getApiRanking (timeLengthRight) {
      if (timeLengthRight === '30') {
        this.timeLengthRight = '30'
      } else if (timeLengthRight === '365') {
        this.timeLengthRight = '365'
      } else {
        this.timeLengthRight = '7'
      }
      this.getDateRight()
      let that = this
      LoadingBoxService.open('加载中...')
      console.log('右侧参数', this.paramsRight)
      apiClient.get('report/rankings/getAPIInvokeRankings', that.paramsRight, function (data) {
        LoadingBoxService.close()
        that.xData = []
        that.yData = []
        if (data.status === 200) {
          if (data.results.total === 0) {
            that.isDataRight = true
          } else {
            console.log('柱状图数据', data)
            let apiRankingList = data.results.data
            for (let i = 0; i < apiRankingList.length; i++) {
              that.xData.push(apiRankingList[i].doc_count)
              that.yData.push(apiRankingList[i].name)
            }
            that.getBarData(that.xData, that.yData)
          }
        } else {
          TipBoxService.open(data.exception, 2)
        }
      })
    },
    // echarts
    getBarData (xData, yData) {
      let myChart = echarts.init(document.getElementById('barData'))
      let option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: 20,
          right: 15,
          top: 15,
          bottom: 10,
          containLabel: true
        },
        xAxis: {
          type: 'value',
          splitNumber: 2,
          scale: true,
          show: false,
          splitLine: {
            show: false
          }
        },
        yAxis: {
          type: 'category',
          offset: 130,
          splitLine: {
            show: false
          },
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            margin: 30,
            textStyle: {
              align: 'left',
              baseline: 'middle',
              fontSize: 12
            }
          },
          // data: ['自然语言分析', '离校系统', '图书管理系统', '学工系统', '舆情', '随机森林', '人脸识别', 'AI接口', '语言反馈', '智能识别']
          data: yData
        },
        series: [
          {
            type: 'bar',
            barWidth: 24,
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(
                    0, 0, 1, 0,
                  [
                        {offset: 0, color: '#6698EE'},
                        {offset: 1, color: '#77CDEB'}
                  ]
                ),
                label: {
                  show: true,
                  position: 'insideRight',
                  textStyle: {
                    color: '#fff',
                    fontSize: '12'
                  }
                }
              }
            },
            // data: [80, 120, 180, 220, 260, 300, 340, 500, 700, 800]
            data: xData
          }
        ]
      }
      myChart.setOption(option)
    },
    // API调用排行Top10获取时间
    getDateRight () {
      let endTimes = new Date()
      this.paramsRight.endDate = UtilService.formatDuring(endTimes.getTime(), 'yyyy-MM-dd')
      let startTimes = endTimes.getTime() - Number(this.timeLengthRight) * 24 * 60 * 60 * 1000
      this.paramsRight.startDate = UtilService.formatDuring(startTimes, 'yyyy-MM-dd')
    },
    // 活跃用户排行榜选择时间段
    changeDateRight (timeLengthRight) {
      this.paramsRight.startDate = ''
      this.paramsRight.endDate = ''
      if (timeLengthRight === '30') {
        this.timeLengthRight = '30'
      } else if (timeLengthRight === '365') {
        this.timeLengthRight = '365'
      } else {
        this.timeLengthRight = '7'
      }
      this.getApiRanking(timeLengthRight)
    }
  }
}
</script>
<style src="../../css/reportManage/userSort.css" scoped></style>

