<template>
  <div class="consumptionOverview">
      <div class="part1">
        <span style="color:#757f8b">消费总览</span>
      </div>
      <div class="part2">
        &nbsp;&nbsp;统计时长：
        <div class="dateCount">
          <el-select v-model="timeLength" @change="changeTime" :placeholder="placeholder" class="elselect">
            <el-option
              v-for="item in dateCountOpt"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        &nbsp;&nbsp;自定义统计时长：
        <div class="datePicker">
          <el-date-picker
              v-model="startvalue"
              align="center"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="开始时间"
              :picker-options="datePickerOpt"
              @change="changeStartTime"
              @blur="changePlaceholder">
          </el-date-picker> --
          <el-date-picker
              v-model="endvalue"
              align="center"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="结束时间"
              :picker-options="datePickerOpt"
              @change="changeEndTime"
              @blur="changePlaceholder">
          </el-date-picker>
          &nbsp;&nbsp;
          <el-button type="primary" @click="confirmTime">确认</el-button>
        </div>
        <div id="linechart"></div>
      </div>
      <div class="part3">
          <div class="serviceTime">
            <span>{{currentDate}}</span>
          </div>
          <div class="tablehead">
              <div>服务名称</div>
              <div>所属类型</div>
              <div>所属 </div>
              <div>调用次数</div>
              <div>使用方案</div>
          </div>
          <div class="tablebody">
              <ul>
                  <li class="service" v-for="(data,index) in serviceList2" :key=index>
                      <div class="serviceName" @click="goApiDetail(data.id)">{{data.name}}</div>
                      <div>{{data|belongTypeOr}}</div>
                      <div>{{data.fee_scheme.belong}}</div>
                      <div>{{data.doc_count}}</div>
                      <div>{{data.fee_scheme|freeOr}}</div>
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

import apiClient from '../../publicJs/ApiClient.js'
import TipBoxService from '../../publicJs/TipBoxService.js'
import UtilService from '../../publicJs/UtilService.js'
export default {
  name: 'consumptionOverview',
  data () {
    return {
      nodata: true,
      placeholder: '近一周',
      currentDate: '', // 当前显示日期
      timeLength: '', // 时间段
      startvalue: '',
      endvalue: '',
      startTime: '',
      endTime: '',
      serviceList: [],
      serviceList2: [],
      xAxisData: [], // 日期
      docCount: [], // 调用总量
      serviceCount: [], // 服务总量
      feeSchemePrice: [], // 总计价格
      dateCountOpt: [{
        value: '6',
        label: '近一周'
      }, {
        value: '29',
        label: '近一月'
      }, {
        value: '179',
        label: '近半年'
      }],
      datePickerOpt: {
        disabledDate (time) {
          return time.getTime() > Date.now()
        }
      }
    }
  },
  mounted () {
    this.mrTime()
    this.getChartService()
  },
  methods: {
    goApiDetail (id) {
      this.$router.push({
        name: 'APIdetail',
        query: {
          id: id
        }
      })
    },
    getChartService () {
      let that = this
      let mydata = {
        startDate: that.startTime,
        endDate: that.endTime
      }
      apiClient.get('/itsmApi/converge/findCallConvergeByCharge', mydata, function (data) {
        that.serviceList = data.results.data
        that.docCount = []
        that.xAxisData = []
        that.serviceCount = []
        that.feeSchemePrice = []
        for (let i = 0; i < that.serviceList.length; i++) {
          that.xAxisData.push(data.results.data[i].key_as_string)
          that.docCount.push(data.results.data[i].doc_count)
          that.serviceCount.push(data.results.data[i].service_count)
          that.feeSchemePrice.push(data.results.data[i].fee_scheme_price)
        }
        if (that.docCount[that.serviceList.length-1] != 0) {
          that.nodata = false
        }
        that.currentDate = that.xAxisData[that.serviceList.length-1]
        that.getDetailService(that.xAxisData[that.serviceList.length-1])
        that.overviewChart(that.xAxisData, that.docCount, that.feeSchemePrice, that.serviceCount)
      })
    },
    getDetailService (date) {
      let that = this
      let mydata = {
        toDate: date
      }
      apiClient.get('/itsmApi/converge/findCallConvergeByUse', mydata, function (data) {
        that.serviceList2 = data.results.data
      })
    },
    overviewChart (xAxisData, docCount, feeSchemePrice, serviceCount) { // 画折线图
      let that = this
      let myChart = echarts.init(document.getElementById('linechart'))
      let option = {
        grid: {
          left: 50,
          top: 30,
          right: 50
        },
        tooltip: {
          show: true,
          trigger: 'axis',
          position: function (p) {   // 其中p为当前鼠标的位置
            return [p[0] - 55, p[1] + 20]
          },
          axisPointer: {
            type: 'line',
            lineStyle: {
              type: 'dotted'
            }
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
      if (this.timeLength !== '自定义') {
        this.endvalue = new Date().getTime() - 24 * 60 * 60 * 1000
        this.startvalue = this.endvalue - this.timeLength * 24 * 60 * 60 * 1000
        this.startTime = UtilService.formatDuring(this.startvalue, 'yyyy-MM-dd')
        this.endTime = UtilService.formatDuring(this.endvalue, 'yyyy-MM-dd')
      } else {
        // this.startTime = this.startvalue = ''
        // this.endTime = this.endvalue = ''
      }
    },
    mrTime () { // 默认近一周时间
      this.startTime = new Date().getTime() - 24 * 60 * 60 * 1000 * 7
      this.endTime = new Date().getTime() - 24 * 60 * 60 * 1000
      this.startTime = UtilService.formatDuring(this.startTime, 'yyyy-MM-dd')
      this.endTime = UtilService.formatDuring(this.endTime, 'yyyy-MM-dd')
        this.startvalue=this.startTime;
      this.endvalue=this.endTime;
    },
    changePlaceholder () {
       this.placeholder = '自定义'
       this.timeLength="自定义"
    },
    confirmTime () { // 确认时间
      this.getChartService()
    },
    changeStartTime (val) {
      this.startTime = val
      console.log(val);
    },
    changeEndTime (val) {
      this.endTime = val
      if (this.startTime > this.endTime) {
        TipBoxService.open('开始时间不能大于结束时间')
        this.endvalue = ''
        return false
      }
    }
  },
  filters: {
    freeOr: function (value) {
      if (value) {
        if (value.is_fee === '0') { // 免费
          if (value.restrict_type == '1') {
            return value.restrict_num + '次/天；免费'
          } else if (value.restrict_type == '2') {
            return value.restrict_num + '次/周；免费'
          } else if (value.restrict_type == '3') {
            return value.restrict_num + '次/月；免费'
          } else if (value.restrict_type == '4') {
            return value.restrict_num + '次/季度；免费'
          } else if (value.restrict_type == '5') {
            return value.restrict_num + '次/半年；免费'
          } else if (value.restrict_type == '6') {
            return value.restrict_num + '次/年；免费'
          }
        } else { // 收费
          if (value.fee_standard == '1') {
            if (value.restrict_type == '1') {
              return value.restrict_num + '次/天；' + value.fee_price + '元/次'
            } else if (value.restrict_type == '2') {
              return value.restrict_num + '次/周；' + value.fee_price + '元/次'
            } else if (value.restrict_type == '3') {
              return value.restrict_num + '次/月；' + value.fee_price + '元/次'
            } else if (value.restrict_type == '4') {
              return value.restrict_num + '次/季度；' + value.fee_price + '元/次'
            } else if (value.restrict_type == '5') {
              return value.restrict_num + '次/半年；' + value.fee_price + '元/次'
            } else if (value.restrict_type == '6') {
              return value.restrict_num + '次/年；' + value.fee_price + '元/次'
            } else {}
          } else if (value.fee_standard == '2') {
            if (value.restrict_type == '1') {
              return value.restrict_num + '次/天；' + value.fee_price + '元/天'
            } else if (value.restrict_type == '2') {
              return value.restrict_num + '次/周；' + value.fee_price + '元/天'
            } else if (value.restrict_type == '3') {
              return value.restrict_num + '次/月；' + value.fee_price + '元/天'
            } else if (value.restrict_type == '4') {
              return value.restrict_num + '次/季度；' + value.fee_price + '元/天'
            } else if (value.restrict_type == '5') {
              return value.restrict_num + '次/半年；' + value.fee_price + '元/天'
            } else if (value.restrict_type == '6') {
              return value.restrict_num + '次/年；' + value.fee_price + '元/天'
            } else {}
          } else if (value.fee_standard == '3') {
            if (value.restrict_type == '1') {
              return value.restrict_num + '次/天；' + value.fee_price + '元/月'
            } else if (value.restrict_type == '2') {
              return value.restrict_num + '次/周；' + value.fee_price + '元/月'
            } else if (value.restrict_type == '3') {
              return value.restrict_num + '次/月；' + value.fee_price + '元/月'
            } else if (value.restrict_type == '4') {
              return value.restrict_num + '次/季度；' + value.fee_price + '元/月'
            } else if (value.restrict_type == '5') {
              return value.restrict_num + '次/半年；' + value.fee_price + '元/月'
            } else if (value.restrict_type == '6') {
              return value.restrict_num + '次/年；' + value.fee_price + '元/月'
            } else {}
          }
        }
      } else {
        return '您的方案（免费）'
      }
    },
    belongTypeOr: function (value) {
      if (value.fee_scheme) {
        if (value.fee_scheme.belong_type == 'ENTERPRISE') {
          return '企业'
        } else if (value.fee_scheme.belong_type == 'PLATFORM') {
          return '平台'
        } else if (value.fee_scheme.belong_type == 'PERSONAL') {
          return '个人'
        }
      } else {
        return '您的服务'
      }
    }
  }
}
</script>
<style scoped>
*{
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.elselect ::-webkit-input-placeholder{
  color: black;
}
.part1{
  margin-top: 23px;
}
.part1 span{
  cursor: hand;
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
.part2>div{
  display: inline-block;
}
#linechart{
  width:100%;
  height:370px;
}
.part3{
  height: 100%;
  margin-bottom: 50px;
}
.serviceTime{
  margin-bottom: 10px;
}
.serviceTime span{
  font-size: 13px;
  font-weight: bold;
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
  /* color: #2ca3ee; */
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
.consumptionOverview .dateCount .el-input__inner{
  width: 90px;
  height: 30px;
  font-size: 12px;
}
.consumptionOverview .dateCount .el-select-dropdown__item{
  font-size: 12px;
}
.consumptionOverview .datePicker .el-input__inner{
  width: 163px;
  height: 30px;
  font-size: 12px;
}
.consumptionOverview .datePicker .el-date-editor.el-input{
  width: 163px;
}
.consumptionOverview .el-button{
  padding: 7px 12px;
  background-color: #68a0fe;
}
.consumptionOverview .el-button, .el-textarea__inner{
  font-size: 12px;
}
.service .serviceName {
  width: 180px;
  color: #2ca3ee;
}
.service .serviceName:hover {
  cursor: pointer;
}
</style>
