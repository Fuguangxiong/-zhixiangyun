<template>
  <div class="user-list">
      <h2>用户列表</h2>
      <div class="search clearfix">
          <div class="user-name">
              <input type="text" placeholder="用户名" v-model="params.userName" @keyup.enter="searchUserName">
              <i class="iconfont icon-sousuo11" @click="searchUserName"></i>
          </div>
          <div class="export">
              <i class="iconfont icon-daochu"></i>
              <a href="javascript:;">导出</a>
          </div>
          <div class="personal">
              <span>个人数量：</span>
              <span>{{ personNum }}</span>
          </div>
          <div class="company">
              <span>公司数量：</span>
              <span>{{ companyNum }}</span>
          </div>
      </div>
      <div class="content">
          <table>
              <thead>
                  <tr>
                      <th>用户名</th>
                      <th>用户归属类型</th>
                      <th>用户归属</th>
                  </tr>
              </thead>
              <tbody v-show="!isData">
                  <tr v-for="(item,index) in userList" :key="index">
                      <td>{{ item.userName }}</td>
                      <td>{{ item.belongTypeName }}</td>
                      <td>{{ item.enterpriseName }}</td>
                  </tr>
              </tbody>
          </table>
          <!-- 未找到相关数据 -->
          <div class="isDate" v-show="isData">
             <img src="../../images/nothing.png" alt="未查找到相关数据">
             <p>未查找到相关数据</p>
          </div>
      </div>
      <!-- <div class="paging" v-show="isPaging">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :page-size="pageSize"
            :current-page.sync="pageNum"
            layout="prev, pager, next, jumper"
            :total="total" 
            >
          </el-pagination>
      </div> -->
  </div>
</template>
<script>
import apiToken from '../../../publicJs/apiToken.js'
import apiClient from '../../../publicJs/ApiClient.js'
import LoadingBoxService from '../../../publicJs/LoadingBoxService.js'
import TipBoxService from '../../../publicJs/TipBoxService'
export default {
  name: 'userList',
  data () {
    return {
    //   isPaging: true,
    //   pageSize: 20,
    //   pageNum: 1,
    //   total: 100
      params: {
        userName: ''
      },
      companyNum: 0, // 公司数量
      personNum: 0, // 个人数量
      userList: [], // 用户列表
      isData: false // 是否有数据
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    // 用户列表
    getUserList () {
      let that = this
      LoadingBoxService.open('加载中...')
      apiClient.get(apiToken.newApi('/report/userlist/getUserToUseList/'), that.params, function (data) {
        LoadingBoxService.close()
        if (data.status === 200) {
          if (data.results.total === 0) {
            that.isData = true
            that.companyNum = 0
            that.personNum = 0
          } else {
            console.log('是数据啊', data)
            that.isData = false
            that.userList = data.results.data
            that.companyNum = data.results.companyNum
            that.personNum = data.results.personNum
          }
        } else {
          TipBoxService.open(data.exception, 2)
        }
      })
    },
    // 搜索用户名
    searchUserName () {
      this.getUserList()
    }
// handleSizeChange () {},
// handleCurrentChange () {}
  }
}
</script>
<style src="../../css/reportManage/userList.css" scoped></style>
