<template>
  <div class="invocationRatio">
      <h2>每日服务调用</h2>
      <div class="bar clearfix">
        <div class="search-time">
          <span>查询时间：</span>
          <span @click="timeLengthList(7)" :class="{highlight:length === 7}">近一周</span>
          <span @click="timeLengthList(30)" :class="{highlight:length === 30}">近一个月</span>
          <span @click="timeLengthList(180)" :class="{highlight:length === 180}">近半年内</span>
        </div>
        <div class="export">
          <i class="iconfont icon-daochu"></i>
          <a href="javascript:;">导出</a>
        </div>
      </div>
      <div class="content">
        <div class="pie-data" id="pieData"></div>
        <div class="table-data">
          <div class="search clearfix">
            <div class="hot">
              <span>服务：</span>
              <span @click="orderList('new')" :class="{blue:order === 'new'}">最新</span>
              <span @click="orderList('hot')" :class="{blue:order === 'hot'}">最热</span>
            </div>
            <div class="nameSearch">
              <input type="text" placeholder="输入服务名称进行搜索" @keyup.enter="serviceNameList" v-model="serviceName">
              <i class="iconfont icon-sousuo11" @click="serviceNameList"></i>
            </div>
          </div>
          <div class="table">
            <table>
              <thead>
                <tr>
                  <th>服务名称</th>
                  <th>调用总量</th>
                  <th>API调用数量</th>
                  <th>API调用占比</th>
                  <th>页面调用数量</th>
                  <th>页面调用占比</th>
                </tr>
              </thead>
              <tbody v-show="!isData">
                <tr v-for="(item,index) in accountedList" :key="index">
                  <td>{{ item.name }}</td>
                  <td>{{ item.sunNum }}</td>
                  <td>{{ item.api }}</td>
                  <td>{{ item.apiNum }}</td>
                  <td>{{ item.page }}</td>
                  <td>{{ item.pageNum }}</td>
                </tr>
              </tbody>
            </table>
            <!-- 未找到相关数据 -->
            <div class="isDate" v-show="isData">
              <img src="../../images/nothing.png" alt="未查找到相关数据">
              <p>未查找到相关数据</p>
            </div>
          </div>
          <div class="paging" v-show="isPaging & total>8">
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
      </div>
  </div>
</template>
<script>
import echarts from 'echarts'
import apiToken from '../../../publicJs/apiToken.js'
import apiClient from '../../../publicJs/ApiClient.js'
import userService from '../../../publicJs/userService.js'
import LoadingBoxService from '../../../publicJs/LoadingBoxService.js'
import TipBoxService from '../../../publicJs/TipBoxService.js'
export default {
  name: 'invocationRatio',
  data () {
    return {
      isData: false, // 是否显示无数据
      isPaging: true, // 是否显示分页
      pageSize: 8,
      pageNum: 1,
      total: 0,
      token: '',
      startTime: '',
      endTime: '',
      order: 'new',
      serviceName: '',
      accountedList: [],
      length: 7,
      api: 0, // api调用总数
      page: 0, // 页面调用总数
      totalNum: 0, // 调用服务总数
      pieData: []
    }
  },
  created () {
    this.token = this.$route.query.tokenId || userService.getTokenId()
    this.init()
    this.getAccountedList()
  },
  mounted () {
    this.getPieData()
  },
  methods: {
    handleSizeChange () {},
    handleCurrentChange () {},
    // 初始化时间
    init () {
      let endDate = new Date()
      this.endTime = endDate.getTime()
      this.startTime = this.endTime - this.length * 24 * 60 * 60 * 1000
    },
    // 根据最新 最热查询
    orderList (order) {
      this.order = order
      this.getAccountedList()
    },
    // 根据服务名称查询
    serviceNameList () {
      this.getAccountedList()
    },
    // 根据时间段查询
    timeLengthList (length) {
      this.length = length
      this.startTime = this.endTime - length * 24 * 60 * 60 * 1000
      this.getAccountedList()
      this.getPieData()
    },
    getAccountedList () {
      let that = this
      let params = {
        token: that.token,
        startTime: that.startTime,
        endTime: that.endTime,
        order: that.order,
        serviceName: that.serviceName
      }
      LoadingBoxService.open('加载中...')
      apiClient.get(apiToken.newApi('/report/accounted/getAccountedList/'), params, function (data) {
        LoadingBoxService.close()
        if (data.status === 200) {
          if (data.results.total === 0) {
            that.isData = true
            that.isPaging = false
          } else {
            console.log('列表数据啊', data)
            that.accountedList = data.results.data
            that.isData = false
            that.isPaging = true
            that.total = data.results.total
          }
        } else {
          TipBoxService.open(data.exception, 2)
        }
      })
    },
    getPieData () {
      let that = this
      let params = {
        token: that.token,
        startTime: that.startTime,
        endTime: that.endTime
      }
      LoadingBoxService.open('加载中...')
      apiClient.get(apiToken.newApi('/report/accounted/getCallTheTotalProportion/'), params, function (data) {
        LoadingBoxService.close()
        if (data.status === 200) {
          console.log('饼图数据', data)
          that.api = data.results.api
          that.page = data.results.page
          that.totalNum = data.results.total
          that.pieData = [
            {value: that.api, name: 'API调用'},
            {value: that.page, name: '页面调用'}
          ]
          if (that.api === 0) {
            that.pieData.splice(0, 1)
          } else if (that.page === 0) {
            that.pieData.splice(1, 1)
          }
          console.log(that.pieData)
          that.getPie(that.api, that.page, that.totalNum, that.pieData)
        } else {
          TipBoxService.open(data.exception, 2)
        }
      })
    },
    getPie (api, page, totalNum, pieData) {
      let myCharts = echarts.init(document.getElementById('pieData'))
      let option = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        title: {
          text: '总调用次数\n' + totalNum,
          left: 'center',
          top: '37%',
          textStyle: {
            color: '#666',
            fontSize: 14,
            fontWeight: 500,
            align: 'center'
          }
        },
        legend: {
          icon: 'circle',
          orient: 'horizontal',
          width: 500,
          left: 'center',
          bottom: 50,
          itemGap: 100,
          itemWidth: 16,
          itemHeight: 16,
          data: ['API调用', '页面调用']
        },
        color: ['#78B2F3', '#F07D90'],
        series: [
          {
            name: '调用次数',
            type: 'pie',
            center: ['50%', '40%'],
            radius: ['45%', '65%'],
            data: pieData,
            labelLine: {
              normal: {
                length: 0,
                length2: 150
              }
            },
            label: {
              normal: {
                formatter: '{b}\n{c} {d}%\n\n',
                borderWidth: 20,
                borderRadius: 4,
                padding: [0, -70],
                rich: {
                  a: {
                    color: '#333',
                    fontSize: 12,
                    lineHeight: 20
                  },
                  b: {
                    fontSize: 12,
                    lineHeight: 20,
                    color: '#333'
                  }
                }
              }
            }
          }
        ]
      }
      myCharts.setOption(option)
    }

  }
}
</script>
<style src="../../css/reportManage/invocationRatio.css" scoped></style>
