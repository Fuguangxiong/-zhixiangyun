<template>
  <div class="use-count">
      <h2>整体调用统计</h2>
      <div class="search clearfix">
          <div class="search-affiliation">
              <select name="" id="" v-model="params.belongType" @change="changeBelongType">
                  <option value="">服务归属</option>
                  <option value="PERSONAL">个人</option>
                  <option value="ENTERPRISE">企业</option>
                  <option value="PLATFORM">平台</option>
              </select>
          </div>
          <div class="search-name">
              <input type="text" placeholder="服务名称" class="server-name" v-model="params.searchName">
              <i class="iconfont icon-sousuo11" @click="searchUseCount" @keyup.enter="searchUseCount"></i>
          </div>
          <div class="export">
              <i class="iconfont icon-daochu"></i>
              <a href="javascript:;">导出</a>
          </div>
      </div>
      <div class="content">
          <table>
              <thead>
                  <tr>
                      <th>服务名称</th>
                      <th>服务所属</th>
                      <th>使用方案</th>
                      <th>申请时间</th>
                      <th>收费标准</th>
                      <th>方案起始时间</th>
                      <th>方案结束时间</th>
                      <th>已调用次数</th>
                      <th>总调用次数</th>
                  </tr>
              </thead>
              <tbody v-show="!isData">
                  <tr v-for="(item,index) in useCountList" :key="index">
                      <td>{{ item.serviceName }}</td>
                      <td v-show="item.belongType === 'PERSONAL'">个人</td>
                      <td v-show="item.belongType === 'ENTERPRISE'">企业</td>
                      <td v-show="item.belongType === 'PLATFORM'">平台</td>
                      <td>{{ item.schemeName }}</td>
                      <td>{{ item.createdTime | dateFormat}}</td>
                      <td v-show="item.is_fee === '0'">免费</td>
                      <td v-show="item.is_fee === '1'">{{ item.feePrice + '元/' + feeStandardArr[item.feeStandard - 1] + ' ; 收费' }}</td>
                      <td>{{ item.expiryStartDate | dateFormat}}</td>
                      <td>{{ item.expiryEndDate | dateFormat}}</td>
                      <td>{{ item.invokeNum }}</td>
                      <td>{{ item.invokeTotalNum }}</td>
                  </tr>
              </tbody>
          </table>
          <!-- 未找到相关数据 -->
          <div class="isDate" v-show="isData">
             <img src="../../images/nothing.png" alt="未查找到相关数据">
             <p>未查找到相关数据</p>
          </div>
      </div>
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
</template>
<script>
import apiClient from '../../../publicJs/ApiClient.js'
import LoadingBoxService from '../../../publicJs/LoadingBoxService.js'
import TipBoxService from '../../../publicJs/TipBoxService'
import userService from '../../../publicJs/userService.js'
import UtilService from '../../../publicJs/UtilService.js'
export default {
  name: 'useCount',
  data () {
    return {
      isPaging: true, // 是否显示分页
      pageSize: 20,
      pageNum: 1,
      total: 100,
      params: {
        token: '', // 登录token
        belongType: '', // 服务归属
        searchName: '' // 服务名称
      },
      useCountList: '', // 查询列表
      isData: false, // 是否显示无数据图片
      feeStandardArr: ['次', '天', '月'], // 收费标准
      restrictTypeArr: ['天', '周', '月', '季', '半年', '年'] // 免费标准
    }
  },
  created () {
    this.params.token = this.$route.query.tokenId || userService.getTokenId()
    this.getUseCountList()
  },
  methods: {
    handleSizeChange () {},
    handleCurrentChange () {},
    getUseCountList () {
      let that = this
      LoadingBoxService.open('加载中...')
      apiClient.post('/report/overall/getInvokeResultList', that.params, function (data) {
        LoadingBoxService.close()
        if (data.status === 200) {
          if (data.results.total === 0) {
            that.isData = true
            that.isPaging = false
            console.log('没数据')
          } else {
            console.log('是数据啊', data)
            that.useCountList = data.results.data
            that.isData = false
            that.isPaging = true
          }
        } else {
          TipBoxService.open(data.exception, 2)
        }
      })
    },
    // 改变服务归属查询
    changeBelongType () {
      this.getUseCountList()
    },
    // 根据服务名称查询
    searchUseCount () {
      if (this.params.searchName.trim().length === 0) {
        TipBoxService.open('服务名称检索不能为空')
      } else {
        this.getUseCountList()
      }
    }
  },
  filters: {
    dateFormat: function (value) {
      return UtilService.formatDuring(value, 'yyyy-MM-dd')
    }
  }
}
</script>
<style src="../../css/reportManage/useCount.css" scoped></style>

