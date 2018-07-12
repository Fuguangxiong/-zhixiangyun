<template class="public">
  <div>
    <breadcrumb :data="breadcrumb"></breadcrumb>
    <!-- 企业名称搜索 -->
    <div class="searchBox11">
      企业名称: <input type="text" class="inputClass" placeholder="请输入企业名称" v-model="keyword" @keyup.enter="getTableData"><span @click="getTableData"><i class="iconfont icon-sousuo"></i></span>
    </div>

    <!--多选状态-->
    <div class="publicStatus">
      <div class="publicStatusLeft">
        <div class="wordBlock tStyel tStyelfuw">
          <span class="textName">审核状态：</span>
          <div class="listCon" :class="{checkboxShow: choice}" v-show="isShow">
            <ul :class="{heiauto: moredm}" id="wdtcst">
              <li class="wti" :class="{active:isAclass1}" @click="seLinst1()"><a>全部</a></li>
              <li v-for="(item,index) in datalist" @click="toggle(index)" :class="{active: item.checkbox}">
                <i class="cheboxInput"></i><em><a>{{ item.name }}</a></em></li>
            </ul>
          </div>
          <div class="selected" v-show="!isShow">
            <div class="selectedAll">
                          <span v-for="seleAll in cheboxArr">
                              {{ seleAll }}<i>,</i>
                          </span>
              <em class="dataAll" @click="showAll()">x</em>
            </div>
          </div>
          <div class="rightBut" v-show="isShow">
            <button v-show="isShowDuoxuan" class="inpuChbox cheboxAllSyle" @click='cheboxAll()' :class="{active: choice}">
              {{cheboxtext}}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!--时间筛选-->
    <div class="searchTime">
      <div class="publicStatusLeft">
        <div class="wordBlock tStyel tStyelfuw" style="border-bottom: 1px solid #f1f1f1;padding-bottom: 6px;">
          <span class="textName">申请时间：</span>
          <div class="listCon">
            <ul class="">
              <li class="wti" :class="{active:isAclass2}" @click="seLinst2()"><a>全部</a></li>
              <li v-for="(item,index) in timedatalist" @click="toggleIndex(index)" :class="{active: item.checkbox}">
                <em><a>{{ item.name }}</a></em></li>
            </ul>
            <transition name="el-zoom-in-center">
            <div class="datePickerclass" v-show="dateShow">
              <span style="margin-right: 5px" :class="{fontActive:fontBool}">:</span>
                <span class="inputime">
                <el-date-picker
                        :readonly="checkinfo"
                        :disabled="check_info"
                        class='inputimeBox'
                        align="left"
                        v-model="value11"
                        type="date"
                        placeholder="请选择时间"
                        format="yyyy-MM-dd"
                        :picker-options="pickerOptions0"
                        >
                </el-date-picker>
                  </span>
              <span style="color: #BFCBD9; margin-right:3px;">——</span>
              <span class="inputime">
                <el-date-picker
                        :readonly="checkinfo"
                        :disabled="check_info"
                        class='inputimeBox'
                        align="left"
                        v-model="value12"
                        type="date"
                        placeholder="请选择时间"
                        format="yyyy-MM-dd"
                        :picker-options="pickerOptions1"
                       >
                </el-date-picker>
               </span>
               <button @click="comfirmTime">确认</button>
            </div>
            </transition>
          </div>
        </div>
      </div>
    </div>

    <!--智能-->
    <div class="queryListWord" style="margin-top: 16px;">
      <div class="sortCon">
        <span :class="{active:activec=='zn'}" @click="sortFun('zn')">智能</span>
        <span class="sortWord" :class="{active:activec=='mc','wordUp':!flagObj.mc}" @click="sortFun('mc')"><em>名称</em><i class="icon iconfont icon-jiantou-up" style="margin-top:2px;"></i><i class="icon iconfont icon-jiantou-lower" style="margin-top:2px;"></i></span>
        <span class="sortWord" :class="{active:activec=='zt','wordUp':!flagObj.zt}" @click="sortFun('zt')"><em>状态</em><i class="icon iconfont icon-jiantou-up" style="margin-top:2px;"></i><i class="icon iconfont icon-jiantou-lower" style="margin-top:2px;"></i></span>
        <span class="sortWord" :class="{active:activec=='sj','wordUp':!flagObj.sj}" @click="sortFun('sj')"><em>申请时间</em><i class="icon iconfont icon-jiantou-up" style="margin-left: 22px; margin-top:2px;"></i><i class="icon iconfont icon-jiantou-lower" style="margin-left: 22px; margin-top:2px;"></i></span>
      </div>
      <div v-show="pegeShow">
        <div class="checkboxCon" v-show="checkFlag">
          <div class="checkboxBut" @click=""><i class="icon iconfont icon-caozuo"></i></div>
        </div>
        <div class="topPage" v-show="checkFlag">
          <em><i class="cloer">{{pageNum}}</i>/{{maxNum}}</em>
          <div class="pageTop" v-show="noDataPage">
                <span @click="goNext(-1)" class="arrow" style="font-family: simSun;">&lt;</span>
                <span @click="goNext(1)" class="arrow" style="font-family: simSun;">&gt;</span>
              </div>
        </div>
        <!-- <div class="more" v-show="!checkFlag">
          <div class="sure" @click="surelFun">删除</div>
          <div class="cancel" @click="cancelFun">取消</div>
        </div> -->
      </div>
    </div>

    <div v-show="showTips" class="showTips">
      <img src="../../images/nothing.png" alt="">
      <p>未查找到相关数据</p>
    </div>
    <!--列表-->
    <div class="tableList" v-show="!showTips">
      <div v-for="(value,index) in table" :key="index" class="tableListLine">
        <div>
          <div class="tableListLeft" style="float: left;">
            <div style="float: left; margin-top: 5px;">
              <div class="company" :title="value.enterpriseName">{{value.name}}</div>
              <div class="address">
                申请人 : {{value.username}}
              </div>

              <!-- 图片未通过 已通过 待审核 -->
              <div class="img">
                <img v-show="value.status==='NO_PASS'?true:false" src="../../images/no_pass.png">
                <img v-show="value.status==='WAITING'?true:false" src="../../images/waiting.png">
                <img v-show="value.status==='PASS'?true:false">
              </div>
            </div>
            <div class="time">
              <span>联系电话：{{value.userPhone}}</span>
            </div>
            <div class="time1">
              <span v-show="value.status=='WAITING'?false:true" class="coorperateTime">审批时间：{{value.applyTime3}}</span>
            </div>
            <!-- <div class="reason" style="float: left;">操作时间:{{value.applicationTime}}</div> -->
          </div>
          <div class="action">
            <div class="sliderBtn" @click="goDetail(value.id)" style="float: right;" :class="index==num? 'checkone' : ''">
              查看详情
            </div>
            <div class="checkRight check control-i" @click="" style="float: right;" :class="index==num? 'checkone' : ''">
              <p class="applicationtime"><i class="iconfont icon-shijianzhongbiao"></i>申请时间</p>
              <p class="applicationtime1">
                {{value.applyTime}}<br/>
                {{value.applyTime1}}
              </p>
            </div>
          </div>
        </div>
      </div>
      <!-- :class="{isMaxNum:pageNum==maxNum&&maxNumItems<4?true:false}" -->
      <div>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" v-show="total>10" :current-page.sync="pageNum" :page-size="pageSize" layout="prev, pager, next,total,jumper" :total="total" prev-text="上一页" next-text="下一页">
          </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
  import breadCrumb from '../publicComponent/breadCrumb.vue'
  import LoadingBoxService from '../../../publicJs/LoadingBoxService.js'
  import apiClient from '../../../publicJs/ApiClient.js'
  import TipBoxService from '../../../publicJs/TipBoxService'
  import UtilService from '../../../publicJs/UtilService.js'
  import $ from 'jquery'
  export default {
    name: 'personalAuthenticationList',
    components: {
      'breadcrumb': breadCrumb
    },
    data () {
      return {
        dateShow: false,
        fontBool: false,
        showTips: false, // 是否显示无数据的提示
        selectBox: [],
        atveSize: 0, // 知道我选中了几个标签
        check_info: true,
        checkinfo: true,
        nopass: false,
        pass: false,
        waiting: false,
        currentPage: 1,
        num: -1,
        noData: true,
        breadcrumb: [{name: '企业审核', link: ''}],
        content: '', // 搜索框内容
        datalist: [{name: '待审批', checkbox: false}, {name: '已通过', checkbox: false}, {name: '未通过', checkbox: false}],
        isShow: true,
        choicest: false, // 判断是单选还是多选状态
        choice: false, // 判断是单选还是多选
        moredm: false, // 更多
        isAclass1: true, // 控制关键词标签高亮
        isAclass2: true, // 控制时间筛选标签高亮
        cheboxArr: [], // 服务多选
        isShowDuoxuan: true,
        cheboxtext: '+多选',
        timedatalist: [{name: '近一月', checkbox: false}, {name: '近三月', checkbox: false}, {
          name: '近半年',
          checkbox: false
        }, {name: '近一年', checkbox: false}, {name: '自定义', checkbox: false}],
        // 时间选择组件
        value11: '',
        value12: '',
        activec: 'zn',
        flagObj: {
          mc: false,
          zt: false,
          sj: false
        },
        pegeShow: true, // 根据分页显示隐藏
        checkFlag: true,
        pageNum: 1,
        pageSize: 10,
        keyword: '',
        approvalStatus: '',
        startTime: '',
        endTime: '',
        sortType: '',
        nameSort: '',
        statusSort: '',
        total: 1,
        noDataPage: true, // 少于一页分页不显示
        table: [],
        pickerOptions0: {
          disabledDate: (time) => {
            if (this.value12 != '') {
              return time.getTime() > Date.now() || time.getTime() > this.value12
            } else {
              return time.getTime() > Date.now()
            }
          }
        },
        pickerOptions1: {
          disabledDate: (time) => {
            return time.getTime() < this.value11 || time.getTime() > Date.now()
          }
        }
      }
    },
    computed: {
      maxNum () {
        if (this.total / this.pageSize === 0) {
          return 1
        } else {
          return Math.ceil(this.total / this.pageSize)
        }
      },
      maxNumItems () {
        return this.total - 10 * (this.maxNum - 1)
      }
    },
    mounted () {
      this.getTableData()
    },
    methods: {
      comfirmTime () {
        if (this.value11 == '' || this.value12 == '') {
          TipBoxService.open('请选择需要查询的时间段', 2, 2)// 验证正面照
          return false
        }
        var that = this
        that.checkinfo = false
        that.check_info = false
        let monthstart = that.value11.getMonth() + 1
        let monthend = that.value12.getMonth() + 1
        that.startTime = that.value11.getFullYear() + '-' + monthstart + '-' + that.value11.getDate()
        that.endTime = that.value12.getFullYear() + '-' + monthend + '-' + (that.value12.getDate() + 1)
        console.log(that.startTime)
        console.log(that.endTime)
        that.getTableData()
      },
      // 获取table企业审批的列表
      getTableData () {
        var that = this
        var param = {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          keyword: this.keyword, // 搜索的字
          startTime: this.startTime,
          endTime: this.endTime,
          status: this.approvalStatus,
          sortType: this.sortType, // 根据时间排序
          nameSort: this.nameSort, // 根据名称排序
          statusSort: this.statusSort, // 根据状态排序
          isApprove: 'YES'
        }
        LoadingBoxService.open('加载中...')
        apiClient.get('pcapi/enterprise/list', param).then(data => { // 调取企业的接口
          LoadingBoxService.close()
          console.log('真是', data)
          that.table = data.data// 更新table
          that.total = data.total// 更新total
          if (that.table.length === 0) {
            that.showTips = true
          } else {
            that.showTips = false
          }
          for (let i = 0; i < this.table.length; i++) {
            const el = this.table[i]
            if (el.applicationTime !== null || el.applicationTime !== '' || el.approvalTime !== null || el.approvalTime !== '') {
              this.table[i].applyTime = UtilService.formatDuring(el.applicationTime, 'yyyy-MM-dd')
              this.table[i].applyTime1 = UtilService.formatDuring(el.applicationTime, 'HH:mm:ss')
              this.table[i].applyTime3 = UtilService.formatDuring(el.approvalTime, 'yyyy-MM-dd HH:mm:ss')
            } else {
              this.table[i].applyTime = ''
            }
          }
        })
      },
      toggleIndex (e) {
        var that = this
        that.checkinfo = true
        that.check_info = true
        that.dateShow = false
        that.fontBool = false
        that.value11 = ''
        that.value12 = ''
        var sArr = []
        that.isAclass2 = false
        for (var i = 0; i < that.timedatalist.length; i++) {
          that.timedatalist[i].checkbox = false
        }
        that.timedatalist[e].checkbox = true
        that.pageNum = 1
        let nowDate = new Date()
        let timestamp = new Date().getTime()
        let year = nowDate.getFullYear()
        let month = nowDate.getMonth() + 1
        let date = nowDate.getDate() + 1
        var currentTime = year + '-' + month + '-' + date
        // console.log(currentTime)
        // console.log(e)
        if (e === 0) {
          // 一个月时间戳
          let oneMonth = timestamp - 86400000 * 31
          let oneMonthNear = new Date(oneMonth)
          let year = oneMonthNear.getFullYear()
          let month = oneMonthNear.getMonth() + 1
          let date = oneMonthNear.getDate()
          let passTimeOneMonth = year + '-' + month + '-' + date
          that.endTime = currentTime
          that.startTime = passTimeOneMonth
          console.log(that.startTime)
          console.log(that.endTime)
          $('div.el-picker-panel').css('visibility', 'hidden')
        }
        if (e === 1) {
          let oneMonth = timestamp - 86400000 * 30 * 3
          let oneMonthNear = new Date(oneMonth)
          let year = oneMonthNear.getFullYear()
          let month = oneMonthNear.getMonth() + 1
          let date = oneMonthNear.getDate()
          let passTimeOneMonth = year + '-' + month + '-' + date
          that.endTime = currentTime
          that.startTime = passTimeOneMonth
          console.log(that.startTime)
          console.log(that.endTime)
          $('div.el-picker-panel').css('visibility', 'hidden')
        }
        if (e === 2) {
          let oneMonth = timestamp - 31536000000 * 0.5
          let oneMonthNear = new Date(oneMonth)
          let year = oneMonthNear.getFullYear()
          let month = oneMonthNear.getMonth() + 1
          let date = oneMonthNear.getDate()
          let passTimeOneMonth = year + '-' + month + '-' + date
          that.endTime = currentTime
          that.startTime = passTimeOneMonth
          console.log(that.startTime)
          console.log(that.endTime)
          $('div.el-picker-panel').css('visibility', 'hidden')
        }
        if (e === 3) {
          let oneMonth = timestamp - 31536000000
          let oneMonthNear = new Date(oneMonth)
          let year = oneMonthNear.getFullYear()
          let month = oneMonthNear.getMonth() + 1
          let date = oneMonthNear.getDate()
          let passTimeOneMonth = year + '-' + month + '-' + date
          that.endTime = currentTime
          that.startTime = passTimeOneMonth
          console.log(that.startTime)
          console.log(that.endTime)
          $('div.el-picker-panel').css('visibility', 'hidden')
        }
        if (e === 4) {
          console.log('自定义')
          that.dateShow = true
          that.fontBool = true
          that.checkinfo = false
          that.check_info = false
          $('div.el-picker-panel').css('visibility', 'visible')
          return
        }
//        that.approvalStatus = val
        that.getTableData()
      },
      // 最下侧的智能、名称、状态、时间排序
      sortFun (flag) {
        var that = this
        if (!that.noData) return false
        for (let key in this.flagObj) {
          if (key === flag) {
            console.log('倒序')
            this.flagObj[key] = !this.flagObj[key]
//            this.flagObj[key]?this.myData.sort="desc":this.myData.sort="asc"
          } else {
            this.flagObj[key] = false
          }
        }
        this.activec = flag
        console.log(flag, 'flag')
        if (flag === 'zn') {
          that.sortType = ''
          that.nameSort = ''
          that.statusSort = ''
          that.pageNum = 1
          that.getTableData()
        }
        if (flag === 'mc') {
          console.log(this.flagObj.mc, '升序降序')

          if (that.flagObj.mc === true) {
            that.nameSort = 'DESC'
          }
          if (that.flagObj.mc === false) {
            that.nameSort = 'ASC'
          }
          that.statusSort = ''
          that.sortType = ''
          that.pageNum = 1
          that.getTableData()
        }
        if (flag === 'zt') {
          console.log(this.flagObj.zt, '升序降序')
          that.sortType = ''
          that.nameSort = ''
          that.pageNum = 1
          if (that.flagObj.zt === true) {
            that.statusSort = 'DESC'
          }
          if (that.flagObj.zt === false) {
            that.statusSort = 'ASC'
          }
          that.getTableData()
        }
        if (flag === 'sj') {
          console.log(this.flagObj.sj, '升序降序')
          that.statusSort = ''
          that.nameSort = ''
          that.pageNum = 1
          if (that.flagObj.sj === true) {
            that.sortType = 'DESC'
            console.log(that.sortType)
          }
          if (that.flagObj.sj === false) {
            that.sortType = 'ASC'
            console.log(that.sortType)
          }
          that.getTableData()
        }
      },
      // 取消批量删除
      cancelFun () {
        this.checkFlag = true
      },
      // 删除批量
      surelFun () {
        let id = ''
        this.checkBox.forEach(element => {
          element.flag ? id += element.id + ',' : ''
        })
        console.info('ididid', id.substring(0, id.length - 1))
        if (id == '') {
          TipBoxService.open('请选中您要取消的收藏', 0)
        // this.cancelFun();
          return false
        } else {
          this.setEsc(id.substring(0, id.length - 1))
        }
      },
      checkMore () {
        this.checkFlag = false
        for (let i = 0; i < this.checkBox.length; i++) {
          this.$set(this.checkBox[i], 'flag', true)
        }
      },
      // 审核状态全部服务查询
      seLinst1 () {
        var that = this
//        var myData = '';
        that.active = false
        that.isAclass1 = true
//        that.myData.serviceTag ='';
      // 点击全部取消其他关键词高亮
        for (var i = 0; i < that.datalist.length; i++) {
          that.datalist[i].checkbox = false
        }
//        that.myData.pageNum=1;
//        that.getList();
        that.approvalStatus = ''
        that.pageNum = 1
        that.getTableData()
      },
      // 申请时间全部服务查询
      seLinst2 () {
        var that = this
        that.checkinfo = true
        that.check_info = true
        that.value11 = ''
        that.value12 = ''
//        var myData = '';
        that.active = false
        that.isAclass2 = true
        that.dateShow = false
        that.fontBool = false
//        that.myData.serviceTag ='';
      // 点击全部取消其他关键词高亮
        for (var i = 0; i < that.timedatalist.length; i++) {
          that.timedatalist[i].checkbox = false
        }
        that.startTime = ''
        that.endTime = ''
        // that.approvalStatus = ''
        that.getTableData()
        $('div.el-picker-panel').css('visibility', 'hidden')
      },
      // 多选状态
      toggle (e) {
        var that = this
        var sArr = []
        that.isAclass1 = false
      // 如果是多选就不查询，单选就查询
        if (that.choice) {
          console.log('多选')
          that.datalist[e].checkbox = !that.datalist[e].checkbox
          for (var i = 0; i < that.datalist.length; i++) {
            if (that.datalist[i].checkbox) {
              sArr.push(that.datalist[i].name)
              that.atveSize = sArr.length
            } else {
            }
          }
        } else {
          console.log('单选选')
          for (var i = 0; i < that.datalist.length; i++) {
            that.datalist[i].checkbox = false
          }
          that.datalist[e].checkbox = true
          that.pageNum = 1
          let val = (e === 0 ? 'WAITING' : e === 2 ? 'NO_PASS' : e === 1 ? 'PASS' : '')
          that.approvalStatus = val
          that.getTableData()
        }
        console.info('dsds', that.datalist)
      },
      // 取消重新选中
      showAll () {
        var that = this
        that.atveSize = ''
        that.isShow = true
        that.isAclass1 = true
        that.sortType = ''
        that.nameSort = ''
        that.statusSort = ''
        that.approvalStatus = ''
        that.getTableData()
        for (var i = 0; i < that.datalist.length; i++) {
          that.datalist[i].checkbox = false
        }
      },

      // 多选的
      cheboxAll () {
        var that = this
        var sty = ''
        for (var i = 0; i < that.datalist.length; i++) {
          if (that.datalist[i].checkbox) {
            that.cheboxArr.push(that.datalist[i].name)
          }
        }
        that.choice = true
        console.info('bq', that.cheboxArr) // 多选了那些东西
        for (var i = 0; i < that.cheboxArr.length; i++) {
          that.cheboxArr[i] ? sty += that.cheboxArr[i] + ',' : ''
        }
        // 多选查询
        if (that.cheboxtext == '确定') {
          that.selectBox = []
          for (var i = 0; i < that.cheboxArr.length; i++) {
            var obj = that.cheboxArr[i]
            console.log(obj, 'obj')
            if (that.cheboxArr[i] === '待审批') {
              that.selectBox.push('WAITING')
            }
            if (that.cheboxArr[i] === '未通过') {
              that.selectBox.push('NO_PASS')
            }
            if (that.cheboxArr[i] === '已通过') {
              that.selectBox.push('PASS')
            }
          }
          console.log(that.selectBox, '多选状态')
          that.approvalStatus = that.selectBox.join()
          that.getTableData()
          console.log(that.approvalStatus, '状态')
          console.info('点击确定了', that.atveSize)
          // 如果多选状态下没有选中就当取消
          if (that.atveSize <= 0 || that.atveSize == undefined) {
            that.cheboxtext = '+多选'
            that.isShow = true
            that.choice = false
            return false
          }
          // 如果多选状态下没有选中1一个就走单选
          if (that.atveSize == 1) {
            console.info('只能选中一个')
            that.cheboxtext = '+多选'
            that.choice = false
            return false
          } else {
            console.info('1个进来了', that.atveSize)
          }
          that.isShow = false
          that.cheboxtext = '+多选'
          that.choice = false
          return false
        } else {
          that.cheboxArr = []
        }
        that.cheboxtext = '确定'
      },
      handleSizeChange (val) {
        console.log(`每页 ${val} 条`)
      },
      handleCurrentChange (val) {
        console.log(`当前页: ${val}`)
        this.pageNum = val
        this.getTableData()
      },
        // 分页
      goNext (n) { // Math.ceil(total/pageSize)=='0'?1:Math.ceil(total/pageSize)
        if (this.total === 0) {
          return false
        }
        this.pageNum = this.pageNum + n
        if (this.pageNum === 0) {
          this.pageNum = 1
          return
        }
        if (this.pageNum === Math.ceil(this.total / 10) + 1) {
          this.pageNum = Math.ceil(this.total / 10)
          return
        }
        this.getTableData()
      },
      goDetail (id) {
        console.log(id)
        this.$router.push({path: '/enterpriseApproveDetail', query: {id: id}})
      }
//      clickHigh (index) {
//        this.curAction = index
//        console.log(index)
//      },
//      renormal () {
//        this.num = -1
//      },
//      changeClass (index) {
//        this.num = index
//      },
    }
  }
</script>
<style scoped="">
  em, i {
    font-style: normal;
  }
  .listCon li a {
    text-decoration: none;
    color: #333;
  }
  .searchBox11 i {
    display: inline-block;
    width: 20px;
    height: 20px;
    font-size: 20px !important;
    color: #666;
    /*transform: translateX(-20px);*/
  }
  .searchBox11 {
    margin-left: 0px;
    margin-top: 0px;
    position: relative;
    z-index: 100;
  }
  .searchBox11 span {
    position: absolute;
    top: 6px;
    left: 274px;
    cursor: pointer;
  }
  .searchBox11 .button {
    display: inline-block;
    background-color: #56a8fe;
    width: 94px;
    height: 35px;
    line-height: 35px;
    border-radius: 5px;
    outline: none;
    font: normal 500 15px "宋体";
    color: white;
    margin-left: 32px;
    vertical-align: top;
    cursor: pointer;
    box-sizing: border-box;
    padding: 9px 0 0 18px;
  }
  .searchBox11 .button i {
    vertical-align: top;
    margin-right: 10px;
  }
  .public {
    z-index: 12;
    overflow-x: hidden;
  }
  .inputClass {
    margin-left: 20px;
    width: 225px;
    height: 35px;
    line-height: 35px;
    border: none;
    border-bottom: 1px solid #e3e3e3;
    /*border-radius: 5px;*/
    display: inline-block;
    /*padding-left: 10px;*/
    position: relative;
    font-size: 12px;
    transition: all .5s;
  }
  .inputClass:hover{
    border-bottom: 1px #55a8fd solid
  }
.inputClass:hover {
  border-bottom: 1px solid #55a8fd;
}
.inputClass:focus {
  border-bottom: 1px solid #55a8fd;
}
  .publicStatus {
    height: 42px;
    padding-top: 7px;
  }
  .publicStatus .publicStatusRight {
    background-color: #57A7FC;
    width: 40px;
    height: 40px;
    position: fixed;
    right: 10px;
    bottom: 40px;
    z-index: 101;
    box-sizing: border-box;
    padding: 10px 0 0 10px;
  }
  .tStyel {
    padding-left: 72px;
    padding-right: 125px;
    position: relative;
    box-sizing: border-box;
    padding-bottom: 10px;
    z-index: 100;
  }
  .tStyel .textName {
    position: absolute;
    left: 0;
    line-height: 26px;
    width: 72px;

  }
  .tStyel .listCon .checkboxStyle {
    display: none;
  }
  .tStyel .listCon.checkboxShow .checkboxStyle {
    display: inline-block;
  }
  .tStyel.tStyelfuw .listCon {
    position: relative;
    height: 30px;
  }
  .tStyel .textName {
    position: absolute;
    left: 0;
    line-height: 26px;
    width: 72px;
  }
  .tStyel .listCon.checkboxShow .checkboxStyle {
    display: inline-block;
  }
  .checkboxShow ul li {
    padding-left: 15px;
  }
  .checkboxShow .cheboxInput {
    display: inline-block;
  }
  .checkboxShow ul li em {
    left: 15px;
  }
  .listCon ul.heiauto {
    height: 100px;
    border: 1px #5cabfd solid;
    background-color: #fff;
  }
  .listCon ul li.wti {
    padding-left: 0;

  }
  .listCon ul li.wti:hover {
    color: #55a8fd;
  }
  .listCon ul li.active i.cheboxInput {
    background: url("../../images/inputchebox.png") no-repeat;
  }
  .listCon ul li.active {
    color: #55a8fd;
  }
  .listCon ul li.active a {
    color: #55a8fd;
  }
  .fontActive {
    color: #55a8fd;
  }
  .moreSytle.active {
    border: 1px #55a8fd solid;
    color: #55a8fd;
  }
  .cheboxAllSyle.active {
    border: 1px #55a8fd solid;
    color: #55a8fd;
  }
  .moreSytle.active .icon-arrow-down-copy {
    display: inline-block;
  }
  .moreSytle.active .icon-arrow-down {
    display: none;
  }
  .sortCon span.active {
    color: #55a8fd;
  }
  .sortCon span.active i.icon-jiantou-lower {
    color: #55a8fd;
  }
  .sortCon span.sortWord.active.wordUp i.icon-jiantou-up {
    display: block;
    color: #55a8fd;
  }
  .sortCon span.sortWord.active.wordUp i.icon-jiantou-lower {
    display: none;
  }
  .listCon ul li.active i.cheboxInput {
    background: url("../../images/inputchebox.png") no-repeat;
  }
  .checkboxShow .cheboxInput {
    display: inline-block;
  }
  .cheboxInput {
    background: url("../../images/inputcheboxs.png") no-repeat;
    width: 12px;
    height: 12px;
    vertical-align: middle;
    position: absolute;
    left: 0;
    top: 8px;

    display: none;
  }
  .selectedAll {
    background: #f7f7f7;
    color: #55a8fd;
    font-size: 12px;
    display: inline-block;
    line-height: 20px;
    padding-left: 6px;
    border: 1px #f7f7f7 solid;
    position: relative;
    padding-right: 20px;
    box-sizing: border-box;
  }
  .selectedAll:hover {
    border: 1px #55a8fd solid;
    background: #fff;
  }
  .selectedAll span:last-of-type i {
    display: none;
  }
  .selectedAll .dataAll {
    display: inline-block;
    height: 20px;
    width: 20px;
    text-align: center;
    position: absolute;
    right: 0;
    top: 0;
    cursor: pointer;
  }
  .selectedAll:hover .dataAll {
    background: #55a8fd;
    color: #fff;
  }
  .rightBut {
    position: absolute;
    right: 0;
    width: 180px;
    text-align: right;
    top: 0;
  }
  .rightBut button {
    margin: 0 10px;
  }
  .rightBut button:hover {
    border: 1px #55a8fd solid;
    color: #55a8fd;
  }
  .inpuChbox {
    width: 51px;
    height: 20px;
    border: 1px #e3e3e3 solid;
    color: #666666;
    display: inline-block;
    font-size: 12px;
    transition: all .3s;
    background-color: #fff !important;
  }
  .listCon {
    line-height: 26px;
  }
  .listCon ul li {
    float: left;
    margin-right: 29px;
    position: relative;
    transition: all 0.3s;
  }
  .listCon ul li:last-child{
    margin-right: 0px;
  }
  .listCon ul li a {
    cursor: pointer;
  }
  .queryListWord {
    height: 32px;
    border: 1px #f1f1f1 solid;
    overflow: hidden;
  }
  .sortCon {
    float: left;
  }
  .sortCon span.sortWord em {
    width: 64px;
    display: block;
  }
  .sortCon span.sortWord i {
    left: 50%;
    margin-left: 6px;
    top: 0;
    color: #797979;
    position: absolute;

  }
  .sortCon span.sortWord i.icon-jiantou-up {
    display: none;
  }
  .sortCon span.sortWord.active.wordUp i.icon-jiantou-up {
    display: block;
    color: #55a8fd;
  }
  .sortCon span.sortWord.active.wordUp i.icon-jiantou-lower {
    display: none;
  }
  .sortCon span.sortWord.active.wordUp i.icon-jiantou-up {
    display: block;
    color: #55a8fd;
  }
  .sortCon span.sortWord.active.wordUp i.icon-jiantou-lower {
    display: none;
  }
  .checkboxCon {
    float: right;
  }
  .checkboxCon .checkboxBut {
    width: 40px;
    line-height: 30px;
    color: #c9c9c9;
    border-left: 1px #f1f1f1 solid;
    text-align: center;
    cursor: default !important;
    background: #f5f5f5;
  }
  .checkboxCon .checkboxBut i{
    color: #e0e0e0 !important;
  }
  .checkboxCon .checkboxBut:hover i {
    color: #c9c9c9;
  }
  .checkboxCon .checkboxBut {
    width: 40px;
    line-height: 30px;
    color: #333;
    border-left: 1px #f1f1f1 solid;
    text-align: center;
    cursor: pointer;
  }

  .topPage {
    float: right;
  }
  .topPage span {
    border-left: 1px #f1f1f1 solid;
    cursor: pointer;
    width: 40px;
    float: left;
    line-height: 30px;
    color: #9e9e9e;
    text-align: center;
  }
  .topPage span:hover {
    color: #55a8fd;
  }
  .topPage em {

    float: left;
    line-height: 30px;
    color: #333;
    text-align: center;
    font-size: 14px;
    margin-right: 15px;
  }
  .topPage em i.cloer {
    color: #fb6233;
  }
  .topPage em i.cloer {
    color: #fb6233;
  }
  .pageTop {
    width: 80px;
    overflow: hidden;
  }
  .arrow:hover {
    color: #56a6fd;
    font-weight: bolder;
  }
  .more {
    width: 125px;
    height: 100%;
    float: right;
    line-height: 30px;
  }
  .more .sure {
    width: 50%;
    height: 100%;
    text-align: center;
    display: inline-block;
    cursor: pointer;
    color: #fb7085;
    border-left: 1px solid #f1f1f1;
  }
  .more .cancel {
    display: inline-block;
    width: 50%;
    height: 100%;
    text-align: center;
    float: right;
    cursor: pointer;
    border-left: 1px solid #f1f1f1;
  }
  .sortCon span {
    float: left;
    width: 80px;
    line-height: 30px;
    text-align: center;
    border-right: 1px solid #f1f1f1;
    color: #333;
    position: relative;
    cursor: pointer;
  }
  /*表*/
  .tableList .tableListLine {
    height: 99px;
    border-bottom: 1px solid #f1f1f1;
    border-right: 1px solid #f1f1f1;
    box-sizing: border-box;
    overflow: hidden;
    position: relative;
  }
  .tableList .tableListLine>div {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
   .tableList .tableListLine>div::after{
    content: '';
    transition: all 0.1s;
  }
  .tableList .tableListLine>div:hover::after{
   content: '';
    position: absolute;
    top:0;
    left: 0px;
    bottom: 0;
    right: 0;
    border: 2px #55a8fd solid;
    z-index: 96;
    box-shadow: 0 0 8px rgba(85,168,253,.7)
}
.action .sliderBtn {
    background-color: #55a8fd !important;
    color: #fff !important;
    position: absolute;
    width: 120px;
    height: 99px !important;
    top: 0;
    right: -120px !important;
    line-height: 99px !important;
    font-size: 14px;
    transition: all 0.4s;
    z-index: 500;
  }
  .tableList .tableListLine:hover .sliderBtn {
    right: 0px !important;
  }
  .tableListLeft {
    width: 90%;
    height: 100%;
    padding-left: 13px;
    padding-top: 23px;
    position: relative;
  }
  .tableListLeft  .img{
    position: absolute;
    left: 150px;
    top:15px;
  }
  .tableListLeft  .img img{
    height: 66px;
    width: auto;
  }
  .company {
    white-space: nowrap;
    text-overflow: ellipsis;
    width: 200px;
    height: 19px;
    text-align: left;
    font: normal 600 13px "microsoft yahei";
    display: inline-block;
    overflow: hidden;
  }
  .address {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    color: #333;
    width: 315px;
    margin-top: 7px;
  }
  .time {
    float: left;
    margin-top: 37px;
    padding-left: 16px;
    position: relative;
  }
  .action {
    height: 99px;
    width: 90px;
    background-color: #fcfcfc;
    float: right;
    position: relative;
  }
  .action > div {
    height: 100%;
    width: 120px;
    position: absolute;
    right: 0;
    border-left: 1px solid #f1f1f1;
    background-color: #fcfcfc;
    text-align: center;
    cursor: pointer;
    color: #000;
  }
  .action .sliderBtn{
    border-left: 0 none;
  }
 
  .checkone {
    position: relative;
    box-shadow: inset 0px 1px #56a8fe, inset -1px -0px #56a8fe;
    text-align: center;
    vertical-align: middle;
    line-height: 90px;
    width: 10%;
    height: 90px;
    transition: all ease-in-out 0.2s;
    background-color: #fcfcfc;
    color: black;
    cursor: pointer;
    z-index: 2;
  }

  .control-i i {
    position: relative;
    top: 0;
  }
  .datePickerclass button {
    width: 48px;
    height: 19px;
    background-color: #fff;
    border: 1px solid #859FAC;
    line-height: 15px;
    margin-left: 4px;
  }
  .datePickerclass button:hover{
    color: #55a8fd;
    border: 1px solid #55a8fd;
  }
  .applicationtime{
    color: #000;
    margin-top: 20px;
    margin-bottom: 10px;
  }
    .applicationtime i{
      margin-right: 5px;
      font-size: 14px;
    }
.time1{
  position: absolute;
  left: 631px;
  top:60px;
}
.applicationtime1{
  line-height: 16px;
}
 .fade-enter-active, .fade-leave-active {
    transition: opacity .5s
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active in below version 2.1.8 */ {
    opacity: 0
  }

  .showTips{
    width: 100%;
    margin-top: 100px;
    text-align: center;
  }
    .showTips img{
      width: 130px;
      height: auto;
      
    }
    .showTips p{
      font-size: 15px;
      margin-top: 10px;
    }

.isMaxNum{
  position: fixed;
  bottom:38px;
  left: 627px;
  z-index: 1000;
  padding-top: 30px;
}
</style>

