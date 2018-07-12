<template>
  <div class="myAPI" id="myAPI">
      <h2>我的API</h2>
      <div class="serverName">
          <div>服务名称:</div>
          <div class="serverSearch">
              <input type="text" placeholder="请输入服务名称" v-model="keywords" @keyup.enter="getkeywordsList">
              <i class="iconfont icon-sousuo11" @click="getkeywordsList"></i>
          </div>
      </div>
      <div class="auditStatus" v-show="serverType === 1">
          <span>审核状态:</span>
          <span @click="changeType('')" :class="{ currentSpan:change === '2' }">全部</span>
          <span @click="changeType('1')" :class="{ currentSpan:change === '1' }">审核中</span>
          <span @click="changeType('3')" :class="{ currentSpan:change === '3' }">已通过</span>
          <span @click="changeType('4')" :class="{ currentSpan:change === '4' }">未通过</span>
      </div>
      <div class="auditStatus" v-show="serverType === 2">
          <span>审核状态:</span>
          <span @click="changeType('')" :class="{ currentSpan:change === '4' }">全部</span>
          <span @click="changeType('1')" :class="{ currentSpan:change === '1' }">审核中</span>
          <span @click="changeType('2')" :class="{ currentSpan:change === '2' }">已通过</span>
          <span @click="changeType('3')" :class="{ currentSpan:change === '3' }">未通过</span>
      </div>
      <div class="serverType">
          <span>服务类型:</span>
          <span @click="myApply" :class="{ currentSpan:serverType === 1 }">我的申请</span>
          <span @click="myCreate" :class="{ currentSpan:serverType === 2 }">我的创建</span>
      </div>
      <div class="getDate">
          <div>申请日期:</div>
          <div class="timeLength"> 
              <select name="" id="" v-model="timeLength" @click="changeTimelength">
                  <option value="">选择时间段</option>
                  <option value="7">一周</option>
                  <option value="30">一月</option>
                  <option value="180">半年</option>
              </select>
          </div>
          <div class="myApiDate">
            <el-date-picker
                @change="changeStartTime"
                v-model="beginvalue"
                type="date"
                placeholder="开始时间"
                :picker-options="pickerOptions">
            </el-date-picker>
          </div>
          <div class="line"></div>
          <div class="myApiDate">
            <el-date-picker
                @change="changeEndTime"
                v-model="endvalue"
                type="date"
                placeholder="结束时间"
                :picker-options="pickerOptions">
            </el-date-picker>
          </div>
          <div class="timeBtn">
              <input type="button" value="确定" @click="getChangeTime">
          </div>
      </div>
      <div class="contentText" v-show="!isShowApplyUse">
        <div class="title">
          <span>服务名称</span>
          <span>申请时间</span>
          <span>审核状态</span>
          <span class="titleSpan" v-show="isTitleSpan">购买套餐</span>
          <span class="titleSpan" v-show="!isTitleSpan">服务类型</span>
          <span>操作</span>
        </div>
        <div class="item" v-for="(item,index) in applicationList" :key="item.id" v-show="!isData & serverType === 1">
          <span class="sName" @click="goApiDetail(item.service_id)">{{ item.name }}</span>
          <span class="sTime">{{ item.apply_time | dateFormat }}</span>
          <span :class="{ sType:true,
                          blueChecking:item.use_status === '1',
                          greenPass:item.use_status === '3',
                          redNotpass:item.use_status === '4'
                        }">{{ item.use_status_value }}</span>
          <span class="sCombo" :title="pricesTitle[index]" v-show="item.is_fee === '0'">{{ item.restrict_num + '次/' + restrictNumArr[item.restrict_type -1] + ' ; 免费' }}</span>
          <span class="sCombo" :title="pricesTitle[index]" v-show="item.is_fee === '1'">{{ item.restrict_num + '次/' + restrictNumArr[item.restrict_type -1] + ' ; ' + item.fee_price + '元/' +  feeStandard[item.fee_standard - 1] }}</span>
          <span class="iconfont icon-chakanxiangqing sHandle" @click="openApplyUse(item)"></span>
        </div>
        <div class="item" v-for="item in createList" :key="item.id" v-show="!isData & serverType === 2">
          <span class="sName" @click="goApiDetail(item.id)">{{ item.name }}</span>
          <span class="sTime">{{ item.create_time | dateFormat }}</span>
          <span :class="{ sType:true,
                          blueChecking:item.audit_status === '1',
                          greenPass:item.audit_status === '2',
                          redNotpass:item.audit_status === '3'
                        }">{{ item.audit_status_value }}</span>
          <span class="sCombo">{{ item.appname }}</span>
          <span class="sHandle" @click="openCreateUse(item)">
            <i></i>
          </span>
        </div>
        <div class="isDate" v-show="isData">
          <img src="../images/nothing.png" alt="未查找到相关数据">
          <p>未查找到相关数据</p>
        </div>
        <div class="paging" v-show="isPaging">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :page-size="pageSize"
            :current-page.sync="pageNum"
            layout="prev, pager, next, total, jumper"
            :total="total" 
            >
            </el-pagination>
        </div>
      </div>
      <!-- 申请使用 -->
      <div id='applyUseDialogBox' class="slide-in-page" v-show='isShowApplyUse'>
        <apply-use-dialog :is-show='isShowApplyUse' 
                          :service-data='serviceData'
                          @back='closeApplyUse'>
        </apply-use-dialog>     
      </div>
  </div>
</template>

<script>
import apiToken from '../../publicJs/apiToken.js'
import apiClient from '../../publicJs/ApiClient.js'
import LoadingBoxService from '../../publicJs/LoadingBoxService.js'
import UtilService from '../../publicJs/UtilService.js'
import TipBoxService from '../../publicJs/TipBoxService'
import applyUseDialog from './myapiModule/applyUseDialog.vue'
export default {
  name: 'myAPI',
  data () {
    return {
      num: 0, // 改变时间标识
      isTitleSpan: true, // 切换购买套餐 服务类型
      isShowApplyUse: false, // 立即使用弹出页面
      serviceData: {},
      serviceId: '',
      id: '',
      serverType: 1, // 服务类型
      change: '',
      applicationList: [], // 申请列表
      createList: [], // 创建列表
      pageSize: 15,
      pageNum: 1,
      total: 0,
      clickstatus1: '', // 申请审核状态
      clickstatus2: '', // 创建审核状态
      keywords: '', // 关键字
      isData: false, // 是否有数据
      isPaging: false, // 是否有分页
      timeLength: '', // 时间段
      beginvalue: '',
      endvalue: '',
      startTime: '', // 开始时间
      endTime: '', // 结束时间
      pricesTitle: [], // 购买套餐描述
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now()
        }
      },
      restrictNumArr: ['天', '周', '月', '季', '半年', '年'], // 购买套餐免费时
      feeStandard: ['次', '天', '月'] // 购买套餐收费时
    }
  },
  created () {
    this.getApplicationList()
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
    openCreateUse (item) {
      if (item.apptype === '3') {
        this.$router.push({
          name: 'servicePortfolioDetailsExamine',
          query: { id: item.id }
        })
      } else {
        this.$router.push({
          name: 'examineInfo',
          query: { id: item.id }
        })
      }
    },
    openApplyUse (item) {
      item.apply_id = item.id
      this.serviceData = item
      this.isShowApplyUse = true
      $('#applyUseDialogBox').animate({ right: '0' }, 500)
    },
    // 收起填写申请窗口
    closeApplyUse (flag) {
      let vm = this
      $('#applyUseDialogBox').animate({ right: '-2000px' }, 500, function () {
        vm.isShowApplyUse = false
        if (flag) {
          vm.getApplicationList()
        }
      })
    },
    // 时间段改变
    changeTimelength () {
      this.num++
      if (this.num !== 1) {
        if (this.timeLength !== '') {
          this.endvalue = new Date().getTime()
          this.beginvalue = this.endvalue - this.timeLength * 24 * 60 * 60 * 1000
          this.startTime = this.beginvalue
          this.endTime = this.endvalue
        } else {
          this.startTime = this.beginvalue = ''
          this.endTime = this.endvalue = ''
        }
      }
    },
    // 开始时间改变
    changeStartTime () {
      this.startTime = new Date(this.beginvalue).getTime()
      if (this.endvalue - this.timeLength * 24 * 60 * 60 * 1000 !== this.beginvalue) {
        this.timeLength = ''
        this.num = 0
      }
    },
    // 结束时间改变
    changeEndTime () {
      this.endTime = new Date(this.endvalue).getTime() + 86400000
      if (this.endvalue - this.timeLength * 24 * 60 * 60 * 1000 !== this.beginvalue) {
        this.timeLength = ''
      }
    },
    myCreate () {
      this.serverType = 2
      this.pageNum = 1
      this.isTitleSpan = false
      this.getCreateList()
    },
    myApply () {
      this.serverType = 1
      this.pageNum = 1
      this.isTitleSpan = true
      this.getApplicationList()
    },
    // 渲染列表
    // 我的创建列表
    getCreateList (status) {
      this.clickstatus2 = status
      if (status === '1') {
        this.change = '1'
      } else if (status === '2') {
        this.change = '2'
      } else if (status === '3') {
        this.change = '3'
      } else {
        this.change = '4'
      }
      var that = this
      var params = {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        startTime: this.startTime,
        endTime: this.endTime,
        serviceKey: this.keywords,
        state: status
      }
      LoadingBoxService.open('加载中...')
      apiClient.post(apiToken.newApi('/developerApi/api/getCreateList/'), params, function (data) {
        LoadingBoxService.close()
        if (data.status === 200) {
          if (data.results.total === 0 || data.results.result === 'fail') {
            that.isData = true
            that.isPaging = false
            return false
          } else {
            that.isData = false
            that.createList = data.results.data
            that.total = data.results.total
            if (that.pageSize >= that.total) {
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
    // 我的申请列表
    getApplicationList (status) {
      this.clickstatus1 = status
      if (status === '1') {
        this.change = '1'
      } else if (status === '3') {
        this.change = '3'
      } else if (status === '4') {
        this.change = '4'
      } else {
        this.change = '2'
      }
      var that = this
      var params = {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        startTime: this.startTime,
        endTime: this.endTime,
        serviceKey: this.keywords,
        state: status
      }
      LoadingBoxService.open('加载中...')
      apiClient.post(apiToken.newApi('/developerApi/api/getApplicationList/'), params, function (data) {
        LoadingBoxService.close()
        if (data.status === 200) {
          if (data.results.total === 0 || data.results.result === 'fail') {
            that.isData = true
            that.isPaging = false
            return false
          } else {
            console.log('是数据啊', data)
            that.isData = false
            that.applicationList = data.results.data
            that.total = data.results.total
            that.pricesTitle = []
            that.applicationList.forEach(item => {
              if (item.is_fee === '0') {
                that.pricesTitle.push(item.restrict_num + '次/' + that.restrictNumArr[item.restrict_type - 1] + ' ; 免费')
              } else {
                that.pricesTitle.push(item.restrict_num + '次/' + that.restrictNumArr[item.restrict_type - 1] + ' ; ' + item.fee_price + '元/' + that.feeStandard[item.fee_standard - 1])
              }
            })
            if (that.pageSize >= that.total) {
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
    // 改变审核状态
    changeType (status) {
      if (this.serverType === 1) {
        this.pageNum = 1
        this.getApplicationList(status)
      } else {
        this.pageNum = 1
        this.getCreateList(status)
      }
    },
    handleSizeChange () {
    },
    handleCurrentChange () {
      if (this.serverType === 1) {
        this.getApplicationList(this.clickstatus1)
      } else {
        this.getCreateList(this.clickstatus2)
      }
    },
    // 根据时间查询
    getChangeTime () {
      if (this.serverType === 1) {
        if (this.startTime > this.endvalue & this.endvalue !== '') {
          TipBoxService.open('开始时间不能大于结束时间')
          return false
        } else {
          this.pageNum = 1
          this.getApplicationList(this.clickstatus1)
        }
      } else {
        if (this.startTime > this.endvalue & this.endvalue !== '') {
          TipBoxService.open('开始时间不能大于结束时间')
          return false
        } else {
          this.pageNum = 1
          this.getCreateList(this.clickstatus2)
        }
      }
    },
    // 点击搜索
    getkeywordsList () {
      if (this.keywords.trim().length < 2) {
        TipBoxService.open('服务名称检索最少输入两个字')
        return false
      } else if (this.serverType === 1) {
        this.pageNum = 1
        this.getApplicationList(this.clickstatus1)
        return false
      } else {
        this.pageNum = 1
        this.getCreateList(this.clickstatus2)
      }
    }
  },
  components: {
    applyUseDialog
  },
  filters: {
    dateFormat: function (value) {
      return UtilService.formatDuring(value, 'yyyy-MM-dd')
    }
  }
}
</script>

<style lang="css" scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
body,
div,
dl,
dd,
h1,
h2,
h3,
h4,
h5,
h6,
p,
span,
input,
select {
  font-size: 12px;
  color: #757f8b;
}
input,
select {
  outline: none;
  border: none;
}
.myAPI {
  margin-top: 15px;
  padding-left: 6px;
  overflow: hidden; 
}
.myAPI h2 {
  position: relative;
  font-size: 12px;
  color: #757f8b;
}
.myAPI h2:before {
  position: absolute;
  left: -6px;
  top: 2px;
  content: "";
  width: 2px;
  height: 10px;
  background-color: #2ca3ee;
}
.myAPI h2:before:hover {
  cursor: pointer;
}

/* serverName */

.serverName {
  position: relative;
  width: 100%;
  height: 23px;
  margin-top: 5px;
}
.serverName > div {
  position: absolute;
  bottom: 0;
  left: 0;
  display: inline-block;
}
.serverName .serverSearch {
  display: inline-block;
  position: relative;
  margin-left: 77px;
  height: 23px;
}

/* serverSearch */

.serverSearch input {
  width: 176px;
  height: 23px;
  border-bottom: 1px solid #eeeeee;
}
.serverSearch i {
  position: absolute;
  top: 0px;
  right: 0px;
}
.serverSearch i:hover {
  cursor: pointer;
}
input::-webkit-input-placeholder {
  color: #bfc1c8;
  font-size: 12px;
}

/* auditStatus */

.auditStatus {
  margin-top: 18px;
}
.auditStatus span {
  margin-right: 25px;
}
.auditStatus span + span:hover {
  cursor: pointer;
}
.currentSpan {
  color: #2ca3ee;
}

/* serverType */

.serverType {
  margin-top: 12px;
}
.serverType span:first-child {
  margin-right: 24px;
}
.serverType span:nth-child(2) {
  margin-right: 25px;
}
.serverType span + span:hover {
  cursor: pointer;
}

/* getDate */

.getDate {
  width: 100%;
  margin-top: 10px;
  overflow: hidden;
}
.getDate > div {
  display: inline-block;
}
.getDate > div:first-child {
  margin-right: 24px;
}
.getDate .timeLength select {
  width: 92px;
  height: 30px;
  border: 1px solid #eeeeee;
  border-radius: 5px;
  padding-left: 5px;
  margin-right: 6px;
}
.getDate .timeLength select:hover {
  cursor: pointer;
}
.getDate .line {
  width: 11px;
  height: 1px;
  background-color: #e2ecff;
  margin-left: 8px;
  margin-right: 8px;
  margin-bottom: 5px;
}
.getDate .timeBtn input {
  width: 60px;
  height: 30px;
  background-color: #68a0fe;
  color: #ffffff;
  border-radius: 5px;
  margin-left: 6px;
}

/* contentText */

.contentText {
  margin-top: 10px;
}
.contentText .title {
  width: 100%;
  height: 35px;
  line-height: 35px;
  background-color: #f3f6f8;
}
.contentText .title span {
  display: inline-block;
  color: #333333;
}
.contentText .title span:first-child {
  margin-left: 86px;
}
.contentText .title span:nth-child(2) {
  margin-left: 206px;
}
.contentText .title span:nth-child(3) {
  margin-left: 212px;
}
.contentText .title .titleSpan {
  margin-left: 160px;
}
.contentText .title span:last-child {
  margin-left: 152px;
}
.contentText .item {
  width: 100%;
  height: 50px;
  line-height: 50px;
  margin-top: 3px;
  background-color: #f9fbfc;
}
.contentText .item:hover {
  background-color: #edf2f5;
}
.contentText .item:hover .sHandle {
  color: #2ca3ee;
}
.contentText .item span {
  display: inline-block;
  width: 80px;
  text-align: center;
  white-space:nowrap;
  overflow: hidden;
  text-overflow:ellipsis;
}
.contentText .item .sName {
  width: 180px;
  color: #2ca3ee;
  margin-left: 20px;
}
.contentText .item .sName:hover {
  cursor: pointer;
}
.contentText .item .sTime {
  width: 180px;
  margin-left: 75px;
}
.contentText .item .sType {
  margin-left: 130px;
}
.contentText .item .sCombo {
  width: 180px;
  margin-left: 78px;
}
.contentText .item .sHandle {
  font-size: 18px;
  margin-left: 60px;
  height: 50px;
  line-height: 50px;
  text-align: center;
}
.contentText .item .sHandle i {
  display: inline-block;
  width: 15px;
  height: 14px;
  background: url(../images/icon-operation.png) no-repeat;
}
.contentText .item .sHandle:hover {
  cursor: pointer;
}
.contentText .isDate {
  text-align: center;
}
.contentText .isDate img {
  margin-top: 70px;
  width: 150px;
}
.contentText .isDate p {
  margin-top: 10px;
  font-size: 16px;
  color: #333333;
}
/* 审核中 */
.blueChecking {
  color: #5fb9f2;
}
/* 已通过 */
.greenPass {
  color: #27bc32;
}
/* 未通过 */
.redNotpass {
  color: #cb2727;
}
.paging{
  text-align: center;
  margin-top: 25px;
}
</style>
<style>
#myAPI .myApiDate input {
  height: 30px;
}
/* 子组件样式 */
#myAPI .slide-in-page {
  position: absolute;
  width: 100%;
  top: 0;
  z-index: 10;
  background: #fff; 
}
#myAPI .slide-in-page .apply-use-dialog {
  color: #333;
}
#myAPI .slide-in-page .apply-use-dialog .apply-message-title {
  font-size: 14px;
}

</style>

