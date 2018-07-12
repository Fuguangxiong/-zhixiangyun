<template>
  <div class="dayApply">
      <h2>已申请服务</h2>
      <div class="search clearfix">
          <div class="searchitem ">
            <span>归属：</span>
            <span class="first-item" :class="{'first-item-click':firstitemclick}" @click="myApply()">我的申请</span>
            <span class="second-item" :class="{'second-item-click':seconditemclick}" @click="myCreate()">我的创建</span>
          </div>
          <div class="searchitem selecttime">
             <span>时间：</span>
             <span class="first-item leftwidth" :class="{'second-item-click':todaytime}" @click="chosetoday()">今天</span>
             <span class="second-item leftwidth" :class="{'second-item-click':nexttime}" @click="chosenext()">昨天</span>
             <el-date-picker
             @change="changeSelectTime"
                v-model="beginvalue"
                type="date"
                placeholder="选择时间"
                :picker-options="pickerOptions">
            </el-date-picker>
          </div>
         
      </div>
      <div class="content">
        <div class="barchart clearfix" id="chart1">
        </div>
        <div class="piechart clearfix" id="chart2">
        </div>
        <div class="chart-title"> 
           <span class="bartitle ">当天服务调用次数TOP10</span>
           <span class="bartitle ">当天服务调用次数TOP10</span>
        </div>
      </div>
     
  </div>
</template>
<script>
import echarts from 'echarts'
import apiClient from '../../../publicJs/ApiClient.js'
import userService from '../../../publicJs/userService.js'
import UtilService from '../../../publicJs/UtilService.js'
export default {
  name: 'everyDayApplyReport',
  data () {
    return {
      tokenId: '',
      beginvalue: '',
      firstitemclick: true,
      seconditemclick: false,
      todaytime: true,
      nexttime: false,
      choseData: '',
      choseType: '',
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now()
        }
      }
    }
  },
  created () {
    this.tokenId = this.$route.query.tokenId || userService.getTokenId()
  },
  mounted () {
    this.choseData = this.getNowFormatDate(0)
    this.choseType = '0'
    this.getBarData()
  },
  methods: {
    getBarData () {
      let myData = {
        token: this.tokenId,
        type: this.choseType,
        date: this.choseData
      }
      apiClient.get('report/invoke/getInvokeByEnterprise', myData, function (data) {
        let barxAxis = []
        let baryAxis = []
        let piedata = []
        let pietotal = data.results.total
        console.log('数据啊啊啊啊啊', data)
        for (let i = 0; i < 10; i++) {
          barxAxis.push(data.results.data[i].name)
          baryAxis.push(data.results.data[i].count)
        }
        for (let i = 0; i < 11; i++) {
          piedata.push({value: data.results.data[i].count, name: data.results.data[i].name})
        }
        let barchart = document.getElementById('chart1')
        let piechart = document.getElementById('chart2')
        let option = {
          xAxis: {
            type: 'category',
            data: barxAxis,
            axisTick: {
              show: false
            },

            axisLabel: {
              formatter: function (value) {
                let val = value
                if (val.length > 4) {
                  val = val.substring(0, 4) + '…'
                }
                val = val.split('').join('\n')
                return val
              }
            },
            axisLine: {
              lineStyle: {
                color: '#333333'
              }
            }
            // nameTextStyle: {
            //   color: '#333333'
            // }
          },
          yAxis: {
            type: 'value',
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            }
          },
          series: [{
            data: baryAxis,
            type: 'bar',
            barWidth: '20px',
            tooltip: {
              show: true
            },
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(
                        0, 0, 0, 1,
                  [
                            {offset: 0, color: '#ADEAFF'},
                            {offset: 1, color: '#4481EB'}
                  ]
                    )
              }
            }
          }]
        }
        let myChart = echarts.init(barchart)
        myChart.setOption(option)
   // 饼图
        let option1 = {
          tooltip: {
            trigger: 'item',
            formatter: '{b} : {c} <br/>{d}%'
          },
          legend: {
            show: false,
            orient: 'vertical',
            x: 'left',
            data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎']
          },
          color: ['#CCDDFF', '#5599FF', '#0066FF', '#0000CC', '#7744FF', '#4400CC', '#220088', '#4400B3', '#7700BB', '#7700FF', '#B088FF'],
          series: [
            {
              type: 'pie',
              radius: ['30%', '70%'],
              avoidLabelOverlap: false,
              label: {
                normal: {
                  show: true,
                  position: 'center',
                  formatter: function () {
                    return '总调用量\r\n' + pietotal
                  },
                  textStyle: {
                    fontSize: '15',
                    color: '#999'
                  }
                }

              },
              labelLine: {
                normal: {
                  show: false
                }
              },
              data: piedata
            }
          ]
        }
        let myChart1 = echarts.init(piechart)
        myChart1.setOption(option1)
      })
    },
    changeSelectTime () {
      if (this.beginvalue !== '') {
        this.choseData = UtilService.formatDuring(new Date(this.beginvalue).getTime(), 'yyyy-MM-dd')
        this.getBarData()
      }
    },
    chosetoday () {
      if (this.todaytime === false) {
        this.todaytime = true
        this.nexttime = false
      }
      this.choseData = this.getNowFormatDate(0)
      this.getBarData()
    },
    chosenext () {
      if (this.nexttime === false) {
        this.todaytime = false
        this.nexttime = true
      }
      this.choseData = this.getNowFormatDate(1)
      this.getBarData()
    },
    myApply () {
      if (this.firstitemclick === false) {
        this.firstitemclick = true
        this.seconditemclick = false
      }
      this.choseType = '0'
      this.getBarData()
    },
    myCreate () {
      if (this.seconditemclick === false) {
        this.seconditemclick = true
        this.firstitemclick = false
      }
      this.choseType = '1'
      this.getBarData()
    },
    getNowFormatDate (time) {
      var date = new Date()
      var seperator1 = '-'
      var year = date.getFullYear()
      var month = date.getMonth() + 1
      var strDate = date.getDate() - time
      if (month >= 1 && month <= 9) {
        month = '0' + month
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = '0' + strDate
      }
      var currentdate = year + seperator1 + month + seperator1 + strDate
      return currentdate
    }
  }
}

</script>
<style  scoped>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
/* 清除浮动 */
.clearfix:after{
    content: ""; 
    display: block; 
    height: 0; 
    clear: both; 
    visibility: hidden;  
}
.clearfix {
    zoom: 1; 
}
.dayApply {
    margin-top: 20px;
    width: 100%;
    height: 100%;
}
.dayApply h2 {
    position: relative;
    color: #757F8B;
    font-size: 12px;
    font-weight: 500;
}
 h2:before {
    position: absolute;
    left: -6px;
    top: 2px;
    content: "";
    width: 2px;
    height: 10px;
    background-color: #2ca3ee;
}
.dayApply .search{
    margin-top: 25px
}
.dayApply .search .searchitem{
   font-size: 12px;
   color: #333333;
}
.dayApply .search .selecttime{
    margin-top: 15px
}
.search .first-item{
    background: #FFFFFF;
    border: 1px solid rgba(0,0,0,0.05);
    border-radius: 4px 0 0 4px;
    padding: 5px;
    color: #666666;
}
.search .first-item:hover{
   cursor: pointer;
   border: 1px solid #00A5F1;
   color: #00A5F1;
}
.search .first-item-click{
   border: 1px solid #00A5F1;
   color: #00A5F1;
}
.search .second-item{
    color: #666666;
    background: #FFFFFF;
    border: 1px solid rgba(0,0,0,0.05);
    border-radius: 0 4px 4px 0;
    padding: 5px;
    margin-left: -3px;
}
.search .second-item:hover{
   cursor: pointer;
   border: 1px solid #00A5F1;
   color: #00A5F1;
}
.search .second-item-click{
    border: 1px solid #00A5F1;
     color: #00A5F1;
}
.search  .leftwidth{
    padding-left: 17px;
    padding-right: 17px;
}
.dayApply .content {
    width: 100%;
    height: auto;
    margin-bottom: 5px;
}
.dayApply .el-date-editor.el-input{
    margin-left: 16px;
    width:130px 

}
.dayApply .el-date-editor .el-input__inner {
    border: 1px solid #f2f2f2;
    height: 28px;
}
.barchart{
    width: 50%;
    float: left;
    height: 400px;
}
.piechart{
    width: 50%;
    float: left;
    height: 400px;
}
.content .chart-title{
   width: 100%;
   text-align: center;
}
.content .bartitle{
   width: 50%;
   float: left;
   font-size: 12px;
   color: #333333;
   letter-spacing: 0.14px;  
}
</style>

