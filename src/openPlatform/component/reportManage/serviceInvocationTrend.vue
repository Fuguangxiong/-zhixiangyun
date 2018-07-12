<template>
  <div class="serviceInvocationTrend">
    <div class="part1">
      <span style="color:#757f8b" @click="getChartService()">服务调用趋势</span>
    </div>
    <div class="part2">
      &nbsp;&nbsp;
      <div class="dateCount">
        <el-select v-model="timeLength" @change="changeTime" :placeholder="dateCountOpt[0].label">
          <el-option
            v-for="item in dateCountOpt"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class="dateCount">
        <el-select v-model="timeLength" @change="changeTime" :placeholder="dateCountOpt2[0].label">
          <el-option
            v-for="item in dateCountOpt2"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class="linechart">
        <div id="linechart"></div>
      </div>
      
    </div>
    <div class="part3">
      <div class="tablehead">
          <div>时间</div>
          <div>服务总数</div>
          <div>调用次数</div>
          <div>同比调用增长</div>
          <div>环比调用增长</div>
      </div>
      <div class="tablebody">
        <ul>
          <li class="service" v-for="(data,index) in serviceList" :key=index>
              <div>{{data.key_as_string}}</div>
              <div>{{data.service_count}}</div>
              <div>{{data.doc_count}}</div>
              <div>{{data.day_growth}}</div>
              <div>{{data.ring_ratio}}</div>
          </li>
          <li class="nodata" v-show="nodata">无服务</li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
// 引入基本模板
let echarts = require('echarts/lib/echarts')
// 引入折线图组件
require('echarts/lib/chart/line')
// 引入提示框和title组件
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')

import apiClient from '../../../publicJs/ApiClient.js'
// import TipBoxService from '../../../publicJs/TipBoxService.js'
import UtilService from '../../../publicJs/UtilService.js'
export default {
  name: 'serviceInvocationTrend',
  data () {
    return {
      nodata: true,
      timeLength: '', // 时间段
      startvalue: '',
      endvalue: '',
      startTime: '2018-04-20',
      endTime: '2018-04-26',
      toDate: '2018-04-27',
      serviceList: [],
      xAxisData: [], // 日期
      docCount: [], // 调用总量
      serviceCount: [], // 服务总量
      feeSchemePrice: [], // 总计价格
      dateCountOpt: [{
        value: '0',
        label: '今天'
      }, {
        value: '1',
        label: '昨天'
      }, {
        value: '6',
        label: '近一周'
      }, {
        value: '29',
        label: '近一月'
      }, {
        value: '179',
        label: '近半年'
      }],
      dateCountOpt2: [{
        value: '1',
        label: '按天'
      }, {
        value: '2',
        label: '按时'
      }]
    }
  },
  mounted () {
    this.getChartService()
  },
  methods: {
    getChartService () {
      let that = this
      let mydata = {
        startDate: that.startTime,
        endDate: that.endTime,
        toDate: that.toDate,
        type: 1
      }
      apiClient.get('/report/trend/getInvokeTrendService', mydata, function (data) {
        if (data.results.result == 'success') {
          that.nodata = false
          that.serviceList = data.results.data
          that.docCount = data.results.total
        }
        // that.xAxisData = []
        // that.serviceCount = []
        // that.feeSchemePrice = []
        // for (let i = 0; i < that.serviceList.length; i++) {
        //   that.xAxisData.push(data.results.data[i].key_as_string)
        //   that.serviceCount.push(data.results.data[i].service_count)
        //   that.feeSchemePrice.push(data.results.data[i].fee_scheme_price)
        // }

        // that.currentDate = that.xAxisData[0]
        // that.trendChart(that.xAxisData, that.docCount, that.feeSchemePrice, that.serviceCount)
      })
    },
    trendChart (xAxisData, docCount, serviceCount) { // 画折线图
      let that = this
      let myChart = echarts.init(document.getElementById('linechart'))
      let option = {
        grid: {
          x: 1,
          y: 20,
          x2: 1,
          y2: 40
        },
        tooltip: {
          show: true,
          trigger: 'axis',
          position: function (p) {   // 其中p为当前鼠标的位置
            return [p[0] - 30, p[1] + 20]
          },
          axisPointer: {
            type: 'none' // 去指示线
          },
          backgroundColor: '#fff',
          borderColor: '#e5e5e5',
          borderWidth: 1,
          borderRadius: 4,
          textStyle: {
            color: '#666666'
          },
          formatter: function (params) {
            for (var i = 0; i < params.length; i++) {
              var res = '<p>' + params[i].name +
              '</p><p>服务总量：<span style="color:#3f9dfd">' + serviceCount[params[i].dataIndex] +
              '</p><p>调用次数：<span style="color:#3f9dfd">' + params[i].data +
              '</span></p><p>共计<span style="color:#3f9dfd">' + feeSchemePrice[params[i].dataIndex] + '</span>元</p>'
            }
            return res
          }
        },
        xAxis: {
          type: 'category',
          data: xAxisData,
          axisTick: {
            show: false  // 去刻度
          }
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            inside: true, // 刻度标签是否朝内
            show: true, // 坐标轴文字是否显示
            verticalAlign: 'top', // 文字垂直对齐方式
            margin: 0,
            color: '#757f8b'
          },
          axisLine: {
            lineStyle: {
              color: '#fff', // 坐标轴的轴线颜色
              width: 0 // 这里是坐标轴的宽度,为0就是不显示
            }
          }
        },
        series: [{
          data: docCount,
          type: 'line',
          smooth: true,
          markPoint: {
            itemStyle: {
              normal: {
                color: '#ff3755'
              }
            },
            symbol: 'pin',
            symbolOffset: [0, -10],
            symbolSize: 20,
            label: {
              normal: {
                show: false
              }
            }
          },
          areaStyle: {}
        }]
      }
      myChart.setOption(option)
      myChart.on('click', function (params) {
        that.currentDate = params.name
        that.getDetailService(that.currentDate)
        if (params.data == 0) {
          that.nodata = true
        } else {
          that.nodata = false
        }
      })
    },
    changeTime () { // 时间段改变
      if (this.timeLength !== '') {
        this.endvalue = new Date().getTime()
        this.startvalue = this.endvalue - this.timeLength * 24 * 60 * 60 * 1000
        this.startTime = UtilService.formatDuring(this.startvalue, 'yyyy-MM-dd')
        this.endTime = UtilService.formatDuring(this.endvalue, 'yyyy-MM-dd')
      } else {
        this.startTime = this.startvalue = ''
        this.endTime = this.endvalue = ''
      }
    }
  }
}
</script>
<style scoped>
.part1{
  margin-top: 23px;
}
.part1 span{
  cursor: pointer;
}
.part1:before {
  content: "";
  height: 10px;
  width: 2px;
  position: relative;
  display: inline-block;
  top: 1px;
  margin-right: 6px;
  background-color: #2ca3ee;
}
.part2{
  height: 415px;
  color: #757f8b;
}
.dateCount{
  display: inline-block;
  margin-top: 5px;
}
#linechart{
  width:100%;
  height:370px;
  margin-top: 5px;
  background: rgb(170, 170, 166);
}
.part3{
  height: 100%;
  margin-bottom: 50px;
}
.tablehead{
  height: 34px;
  background: #f3f6f8;
  font-weight: bold;
}
.tablehead>div{
  width: 19.5%;
  line-height: 34px;
  text-align: center;
  display: inline-block;
}
.service{
  height: 52px;
  background: #f9fbfc;
  margin-top: 3px;
  line-height: 52px;
  text-align: left;
}
.service:hover{
  background: #edf2f5;
  color: #2ca3ee;
}
.service>div{
  display: inline-block;
  width: 19.5%;
  text-align: center;
}
.nodata{
  text-align: center;
  font-size: 14px;
  font-weight: bold;
  margin-top: 20px;
}
</style>
<style>
.serviceInvocationTrend .el-input__inner{
  width: 90px;
  height: 28px;
  font-size: 12px;
}
.serviceInvocationTrend .el-select-dropdown__item{
  font-size: 12px;
}
</style>

