<template class="public">
  <div class="personalAuthentication">
	<breadcrumb :data="breadcrumb"></breadcrumb>
	<div class="searchBoxenterprise">
	  申请人: <input type="text" class="inputClass" placeholder="请输入申请人的姓名" v-model="content" @keyup.enter="searchApply"><span @click="searchApply"><i class="iconfont icon-sousuo"></i></span>
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
				<span style="color: #BFCBD9;">——</span>
				<span class="inputime" style="margin-left: 7px">
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
		<span class="sortWord" :class="{active:activec=='mc','wordUp':!flagObj.mc}" @click="sortFun('mc')"><em>名称</em><i class="icon iconfont icon-jiantou-up"></i><i class="icon iconfont icon-jiantou-lower"></i></span>
		<span class="sortWord" :class="{active:activec=='pf','wordUp':!flagObj.pf}" @click="sortFun('pf')"><em>状态</em><i class="icon iconfont icon-jiantou-up"></i><i class="icon iconfont icon-jiantou-lower"></i></span>
		<span class="sortWord" :class="{active:activec=='zt','wordUp':!flagObj.zt}" @click="sortFun('zt')"><em>申请时间</em><i class="icon iconfont icon-jiantou-up" style="margin-left: 22px;"></i><i class="icon iconfont icon-jiantou-lower" style="margin-left: 22px;"></i></span>
	  </div>
	  <div v-show="pegeShow">
		<div class="checkboxCon" v-show="checkFlag">
		  <div class="checkboxBut" @click=""><i class="icon iconfont icon-caozuo"></i></div>
		</div>
		<div class="topPage" v-show="checkFlag">
		  <em><i class="cloer">{{pageNum}}</i>/{{Math.ceil(total / 10) > 0 ? Math.ceil(total / 10) : 1}}</em>
		  <div class="pageTop" v-show="noDataPage">
			<span @click="goNext(-1)" class="arrow" style="font-family: simSun;">&lt;</span>
			<span @click="goNext(1)" class="arrow" style="font-family: simSun;">&gt;</span>
		  </div>
		</div>
		<div class="more" v-show="!checkFlag">
		  <div class="sure" @click="surelFun">删除</div>
		  <div class="cancel" @click="cancelFun">取消</div>
		</div>
	  </div>
	</div>

	<div v-show="showTips" class="showTips">
	  <img src="../../images/nothing.png" alt="">
	  <p>未查找到相关数据</p>
	</div>
	<!--列表-->
	<div class="tableList">
	  <div v-for="(value,index) in table" :key="index" class="tableListLine">
		<div>
		  <div class="tableListLeft" style="float: left;">
			<div style="float: left; margin-top: 5px;">
			  <div class="address">
				申请人 :&nbsp&nbsp {{value.username}}
			  </div>
			  <!-- 图片未通过 已通过 待审核 -->
			  <div class="img">
				<img v-show="value.status==='NO_PASS'?true:false" src="../../images/no_pass.png">
				<img v-show="value.status==='WAITING'?true:false" src="../../images/waiting.png">
				<img v-show="value.status==='PASS'?true:false">
			  </div>
			</div>
			<div class="time">
			  <span v-show="value.phone==''?false:true">联系电话：{{value.phone}}</span>
			</div>
			<div class="time1">
			  <span v-show="value.status=='WAITING'?false:true" class="coorperateTime">审批时间：{{value.approvalTime | formatDuring}}</span>
			</div>
		  </div>
		  <div class="action">
			<div class="sliderBtn" @click="goDetail(value.id)" style="float: right;" :class="index==num? 'checkone' : ''">
			  查看详情
			</div>
			<div class="checkRight check control-i" @click="" style="float: right;" :class="index==num? 'checkone' : ''">
			  <p class="applicationtime"><i class="iconfont icon-shijianzhongbiao"></i>申请时间</p>
			  <p class="applicationtime1">
				{{value.applicationTime | formatDuring}}
				<br/>
			  </p>
			</div>
		  </div>
		</div>
	  </div>
	  <div class="pageNation">
		<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" v-show="total>10" :current-page.sync="pageNum" :page-size="pageSize" layout="prev, pager, next,total,jumper" :total="total" prev-text="上一页" next-text="下一页">
		</el-pagination>
	  </div>
	</div>
  </div>
</template>
<script>
  import UtilService from '../../../publicJs/UtilService.js'
  import breadCrumb from '../publicComponent/breadCrumb.vue'
  import ApiClient from '../../../publicJs/ApiClient.js'
  import LoadingBoxService from '../../../publicJs/LoadingBoxService'
  import TipBoxService from '../../../publicJs/TipBoxService'
  import $ from 'jquery'
  export default {
    name: 'enterpriseAuthenticationList',
    components: {
      'breadcrumb': breadCrumb
    },
    filters: {
      formatDuring (time) {
        return UtilService.formatDuring(time, 'yyyy-MM-dd HH:mm:ss')
      }
    },
    data () {
      return {
        dateShow: false,
        fontBool: false,
        showTips: false, // 是否显示无数据的提示
        check_info: true,
        checkinfo: true,
        currentPage: 1,
        num: -1,
        noData: true,
        breadcrumb: [{name: '员工审核', link: ''}],
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
          pf: false,
          zt: false
        },
        pegeShow: true, // 根据分页显示隐藏
        checkFlag: true,
        total: 1,
        noDataPage: true, // 少于一页分页不显示
        table: [],
        selectBox: [],
        // 请求表单参数
        keyword: '',
        pageSize: 10,
        pageNum: 1,
        approvalStatus: 'WAITING,NO_PASS,PASS', // status状态
        startTime: '',
        endTime: '',
        enterpriseId: '', // 企业id  查对应企业的申请用户
        nameSort: '',  // 根据名称排序 DESC
        sortType: '',   // 根据时间排序 DESC
        statusSort: '',  // 根据状态排序 DESC
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
    methods: {
      // 搜索申请人
      searchApply () {
        this.getTableData()
      },
      goNext (n) {
        if (this.total === 0) {
          return
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
      sortFun (flag) {
        var that = this
        if (!that.noData) return false
        for (let key in this.flagObj) {
          if (key == flag) {
            console.log('倒序')
            this.flagObj[key] = !this.flagObj[key]
          } else {
            this.flagObj[key] = false
          }
        }
        this.activec = flag
        console.log(flag, 'flag')
        if (flag === 'zn') {
          console.log('点击只能了')
          that.sortType = 'DESC'
          that.nameSort = ''
          that.statusSort = ''
          that.getTableData()
        }
        if (flag === 'mc') {
          console.log(this.flagObj.mc, '升序降序11')
          if (that.flagObj.mc === true) {
            that.sortType = ''
            that.nameSort = 'DESC'
            that.statusSort = ''
          }
          if (that.flagObj.mc === false) {
            that.sortType = ''
            that.nameSort = 'ASC'
            that.statusSort = ''
          }
          that.getTableData()
        }
        if (flag === 'pf') {
          console.log(this.flagObj.pf, '升序降序22')
          if (that.flagObj.pf === true) {
            that.sortType = ''
            that.nameSort = ''
            that.statusSort = 'DESC'
          }
          if (that.flagObj.pf === false) {
            that.sortType = ''
            that.nameSort = ''
            that.statusSort = 'ASC'
          }
          that.getTableData()
        }
        if (flag === 'zt') {
          console.log(this.flagObj.zt, '升序降序33')
          if (that.flagObj.zt === true) {
            that.sortType = 'DESC'
            that.nameSort = ''
            that.statusSort = ''
          }
          if (that.flagObj.zt === false) {
            that.sortType = 'ASC'
            that.nameSort = ''
            that.statusSort = ''
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
      // 全部服务查询
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
        that.approvalStatus = 'WAITING,NO_PASS,PASS'
        that.getTableData()
      },
      seLinst2 () {
        var that = this
        that.value11 = ''
        that.value12 = ''
        that.checkinfo = true
        that.check_info = true
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
//        that.approvalStatus = 'WAITING,NO_PASS,PASS'
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
      toggleIndex (e) {
        var that = this
        var sArr = []
        that.value11 = ''
        that.value12 = ''
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
        console.log(currentTime)
        console.log(e)
        if (e === 0) {
          that.dateShow = false
          that.fontBool = false
          that.checkinfo = true
          that.check_info = true
          // 一个月时间戳
          let oneMonth = timestamp - 86400000 * 30
          let oneMonthNear = new Date(oneMonth)
          let year = oneMonthNear.getFullYear()
          let month = oneMonthNear.getMonth() + 1
          let date = oneMonthNear.getDate() + 1
          let passTimeOneMonth = year + '-' + month + '-' + date
          that.endTime = currentTime
          that.startTime = passTimeOneMonth
          console.log(that.startTime)
          console.log(that.endTime)
          $('div.el-picker-panel').css('visibility', 'hidden')
        }
        if (e === 1) {
          that.dateShow = false
          that.fontBool = false
          that.checkinfo = true
          that.check_info = true
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
          that.dateShow = false
          that.fontBool = false
          that.checkinfo = true
          that.check_info = true
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
          that.dateShow = false
          that.fontBool = false
          that.checkinfo = true
          that.check_info = true
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
      // 取消重新选中
      showAll () {
        var that = this
        that.atveSize = ''
        that.isShow = true
        that.isAclass1 = true
        that.startTime = ''
        that.endTime = ''
//        that.sortType = ''
//        that.sortName = ''
        that.approvalStatus = 'WAITING,NO_PASS,PASS'
        that.getTableData()
        for (var i = 0; i < that.datalist.length; i++) {
          that.datalist[i].checkbox = false
        }
      },
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
      handleCurrentChange (val) {
        console.log(`当前页: ${val}`)
        this.pageNum = val
        this.getTableData()
      },
      handleSizeChange (val) {
        console.log(`每页 ${val} 条`)
      },
      goDetail (id) {
        this.$router.push({path: '/enterpriseAuthenticationDetail', query: {id: id}})
      },
      // 获取列表数据
      getTableData () {
        LoadingBoxService.open('加载中...')
        var that = this
        ApiClient.get('/pcapi/enterpriseApply/approvalList', {
          pageNum: this.pageNum,
          pageSize: 10,
          startTime: this.startTime,
          endTime: this.endTime,
          sortType: this.sortType,
          nameSort: this.nameSort,
          statusSort: this.statusSort,
          status: this.approvalStatus,
          keyword: this.content || this.keyword,
          enterpriseId: this.enterpriseId
        }).then(data => {
          LoadingBoxService.close()
          that.total = data.total
          that.table = data.data
          if (that.table.length === 0) {
            that.showTips = true
          } else {
            that.showTips = false
          }
//          that.tableone = data.data.concat(data.data)
//          that.table.push(data.data)
        }).catch(e => {
          console.log(e)
        })
      },
      comfirmTime () {
        if (this.value11 == '' || this.value12 == '') {
          TipBoxService.open('请选择需要查询的时间段', 2, 2)// 验证正面照
          return false
        }
        var that = this
        let monthstart = that.value11.getMonth() + 1
        let monthend = that.value12.getMonth() + 1
        that.startTime = that.value11.getFullYear() + '-' + monthstart + '-' + that.value11.getDate()
        that.endTime = that.value12.getFullYear() + '-' + monthend + '-' + (that.value12.getDate() + 1)
        console.log(that.startTime)
        console.log(that.endTime)
        that.getTableData()
      }
    },
    mounted () {
      this.enterpriseId = sessionStorage.getItem('enterpriseId')
      this.getTableData()
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
  .personalAuthentication .searchBoxenterprise i {
	display: inline-block;
	width: 20px;
	height: 20px;
	font-size: 20px !important;
	/*transform: translateX(-20px);*/
  }
  .personalAuthentication .searchBoxenterprise {
	height: 32px;
	line-height: 32px;
	/*border-radius: 6px;*/
	margin-top: 5px;
	margin-right: 40px;
	position: relative;
	z-index: 20;
  }
  .personalAuthentication .searchBoxenterprise span {
	position: absolute;
	top: 3px;
	left: 260px;
	cursor: pointer;
  }
  .personalAuthentication .searchBoxenterprise .button {
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
  .personalAuthentication .searchBoxenterprise .button i {
	vertical-align: top;
	margin-right: 10px;
  }
  .public {
	z-index: 12;
	overflow-x: hidden;
  }
  .personalAuthentication .inputClass {
	margin-left: 20px;
	width: 225px;
	height: 35px;
	line-height: 35px;
	border: none;
	border-bottom: 1px solid #e3e3e3;
	border-radius: 0;
	display: inline-block;
	position: relative;
	font-size: 12px;
	transition: all .5s;
  outline: none;
  }
  .personalAuthentication .inputClass:hover, .personalAuthentication .inputClass:focus {
	border-bottom: 1px #55a8fd solid
  }
  .personalAuthentication .publicStatus {
	height: 42px;
	padding-top: 7px;
  }
  .personalAuthentication .publicStatus .publicStatusRight {
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
  .personalAuthentication .tStyel {
	padding-left: 72px;
	padding-right: 125px;
	position: relative;
	box-sizing: border-box;
	padding-bottom: 10px;
	z-index: 20;
  }
  .personalAuthentication .tStyel .textName {
	position: absolute;
	left: 0;
	line-height: 26px;
	width: 72px;

  }
  .personalAuthentication .tStyel .listCon .checkboxStyle {
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
  .moreSytle.active {
	border: 1px #55a8fd solid;
	color: #55a8fd;
  }
  .fontActive {
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
	margin-top: 4px;
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
	line-height: 15px;
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
  .listCon ul li a {
	cursor: pointer;
  }
  .queryListWord {
	height: 32px;
	border: 1px #f1f1f1 solid;
	overflow: hidden;
	position: relative;
	z-index: 20;
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
	color: #333;
	/*background: #f5f5f5;*/
	border-left: 1px #f1f1f1 solid;
	text-align: center;
	/*cursor: pointer;*/
  }
  .checkboxCon .checkboxBut i {
	color: #c9c9c9 !important;
  }
  /*.checkboxCon .checkboxBut:hover i {
    color: #55a8fd;
  }*/
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
  .personalAuthenticationTable {

  }
  /*表*/
  /*.tableList {
    overflow-y: auto;
  }
  .tableList::-webkit-scrollbar {
    width: 5px;
    height: 8px;
    !*background-color: #eee;*!
    cursor: pointer;
  }

  !*定义滚动条轨道 内阴影+圆角*!

  .tableList::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    border-radius: 8px;
    !*background-color: #eee;*!
    cursor: pointer;
  }

  !*定义滑块 内阴影+圆角*!

  .tableList::-webkit-scrollbar-thumb {
    border-radius: 8px;
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    background-color: #55a8fd;
    cursor: pointer;
  }*/
  .tableList .tableListLine {
	height: 99px;
	border-bottom: 1px solid #f1f1f1;
	border-right: 1px solid #f1f1f1;
	box-sizing: border-box;
	overflow: hidden;
	position: relative;
  }
  .tableList .tableListLine > div {
	width: 100%;
	height: 100%;
	overflow: hidden;
  }
  .tableList .tableListLine > div::after {
	content: '';
	transition: all 0.1s;
  }
  .tableList .tableListLine > div:hover::after {
	content: '';
	position: absolute;
	top: 0;
	left: 0px;
	bottom: 0;
	right: 0;
	border: 2px #55a8fd solid;
	z-index: 96;
	box-shadow: 0 0 8px rgba(85, 168, 253, .7)
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
  .tableListLeft .img {
	position: absolute;
	left: 87px;
	top: 15px;
  }
  .tableListLeft .img img {
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
	margin-top: 17px;
	padding-left: 16px;
	position: relative;
  }
  .action {
	height: 99px;
	width: 120px;
	background-color: #fcfcfc;
	float: right;
	position: absolute;
	right: 0;
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
  .action .sliderBtn {
	border-left: 0 none;
  }
  .action .checkRight {

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
  .datePickerclass {
	float: left;
	position: relative;
	left: -28px;
  }
  .datePickerclass button {
	width: 48px;
	height: 19px;
	background-color: #fff;
	border: 1px solid #859FAC;
	line-height: 15px;
	margin-left: 4px;
  }
  .datePickerclass button:hover {
	color: #55a8fd;
	border: 1px solid #55a8fd;
  }
  .applicationtime {
	color: #000;
	margin-top: 20px;
	margin-bottom: 10px;
  }
  .applicationtime i {
	margin-right: 5px;
	font-size: 14px;
  }
  .time1 {
	position: absolute;
	left: 631px;
	top: 40px;
  }
  .applicationtime1 {
	line-height: 16px;
	width: 114px;
	padding-left: 10px;
	text-align: center;
  }
  .fade-enter-active, .fade-leave-active {
	transition: opacity .5s
  }
  .fade-enter, .fade-leave-to {
	opacity: 0
  }
  .showTips {
	width: 100%;
	margin-top: 100px;
	text-align: center;
  }
  .showTips img {
	width: 130px;
	height: auto;

  }
  .showTips p {
	font-size: 15px;
	margin-top: 10px;
  }
</style>
<style>
  .pageNation .el-pagination {
	text-align: center;
  }
  .datePickerclass .el-date-editor.el-input {
	width: 146px !important;
  }
  .datePickerclass .el-input__inner {
	height: 24px;
	font-size: 12px;
	/*transform: scale(0.90)*/
  }
</style>
