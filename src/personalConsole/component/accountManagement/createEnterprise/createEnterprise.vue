<template>
  <div class="public">
	<breadcrumb :data="breadcrumb"></breadcrumb>
	<div v-show="userInfo.authStatus === 'AUTHORIZED'">
	  <div v-show="!showTip">
		<div class="searchBoxcreateEnterprise">
		  企业名称: <input type="text" class="inputClass" placeholder="请输入公司的名称" v-model="content" @keyup.enter="searchCompany"><span @click="searchCompany"><i class="iconfont icon-sousuo"></i></span>
		</div>
		<div class="publicStatus">
		  <div class="publicStatusLeft">
			<div class="wordBlock tStyel tStyelfuw">
			  <span class="textName">企业状态：</span>
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
		  <router-link class="publicStatusRight" :to="{name:'innercreateEnterprise'}" style="text-decoration: none;">
			<!--<img src="../../../images/plus.png" alt="创建企业">-->
			<i class="icon iconfont icon-iconjia"></i>
		  </router-link>
		</div>

		<div class="queryListWord">
		  <div class="sortCon">
			<span :class="{active:activec=='zn'}" @click="sortFun('zn')">智能</span>
			<span class="sortWord" :class="{active:activec=='mc','wordUp':!flagObj.mc}" @click="sortFun('mc')"><em>名称</em><i class="icon iconfont icon-jiantou-up"></i><i class="icon iconfont icon-jiantou-lower"></i></span>
			<span class="sortWord" :class="{active:activec=='pf','wordUp':!flagObj.pf}" @click="sortFun('pf')"><em>状态</em><i class="icon iconfont icon-jiantou-up"></i><i class="icon iconfont icon-jiantou-lower"></i></span>
			<span class="sortWord" :class="{active:activec=='zt','wordUp':!flagObj.zt}" @click="sortFun('zt')"><em>时间</em><i class="icon iconfont icon-jiantou-up"></i><i class="icon iconfont icon-jiantou-lower"></i></span>
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

		<common-table :table="table" :whatTable="whatTable" :total="total" :status="status" @pageChange="pageChange" :currentPage="currentPage"></common-table>
	  </div>
	</div>
	<div class="establish" v-show="showTip">
	  <img src="../../../images/noenterprise.jpg" alt="">
	  <div>您还没有创建企业哟!</div>
	  <button @click="goInnercreate">创建企业</button>
	</div>

	<div v-show="userInfo.authStatus === 'UNAUTHORIZED'" class="error">您还未通过个人实名认证，无法创建企业，
	  <router-link to="realNameCertification">立即前往认证</router-link>
	</div>
	<div v-show="userInfo.authStatus === 'AUTHORIZE_FAILED'" class="error">您的个人实名认证审批未通过，
	  <router-link to="ReApplyrealNameCertification">重新认证</router-link>
	</div>
	<div v-show="userInfo.authStatus === 'AUTHORIZING'" class="error">
	  <img src="../../../images/waiting.png" class='waitImg'>您的实名认证已提交，请等待审核结果
	</div>
	<div v-show="showTip===false? showtip_info : false" class="error"><img
			src="../../../images/tip-image.png" alt="" style="position: relative;top: -15px;">暂无数据
	</div>
  </div>
</template>
<script>
  import breadCrumb from '../../publicComponent/breadCrumb.vue'
  import commonTable from '../../publicComponent/createEnterpriseTable.vue'
  import ApiClient from '../../../../publicJs/ApiClient.js'
  import LoadingBoxService from '../../../../publicJs/LoadingBoxService'
  import LOCATION from '../basicInformation/PF_LOCATION.json'

  export default {
    name: 'createEnterprise',
    data () {
      return {
        noDataPage: true, // 少于一页分页不显示
        checkFlag: true,
        flagObj: {
          mc: false,
          pf: false,
          zt: false
        },
        noData: true,
        pegeShow: true, // 根据分页显示隐藏
        activec: 'zn',
        atveSize: 0, // 知道我选中了几个标签
        isShowText: false,
        isShowDuoxuan: true,
        isShow: true,
        cheboxArr: [], // 服务多选
        choicest: false, // 判断是单选还是多选状态
        choice: false, // 判断是单选还是多选
        moredm: false, // 更多
        isAclass1: true, // 控制关键词标签高亮
        moretexe: '更多',
        cheboxtext: '+多选',
        isShowst: true,
        imageshow: false,
        content: '',
        status: '',
        whatTable: 1,
        breadcrumb: [{name: '账号管理', link: '/safetyManagement'}, {name: '创建企业', link: ''}],
        statusOne: ['全部', '待审核', '未通过', '已通过'],
        datalist: [{name: '待审核', checkbox: false}, {name: '未通过', checkbox: false}, {name: '已通过', checkbox: false}],
        indexNum: 0,
        num: -1,
        pageSize: 1,
        tableone: [],
        table: [],
        total: 1,
        authenticated: false, // 已认证
        authorizing: false, // 认证中
        unauthorized: true, // 未认证
        userInfo: {
          name: '',
          phone: '',
          password: '',
          realName: '',
          idCard: '',
          email: '',
          authStatus: '' // 认证状态
//                    identity: '' // 身份所属
        },
        keyword: '',
        pageNum: 1,
        approvalStatus: '',
        sortType: '', // 根据时间排序
        nameSort: '', // 根据名称排序
        statusSort: '', // 根据状态排序
        selectBox: [],
        showTip: false,
        showtip_info: false,
        first: 0,
        currentPage: 1
      }
    },
    components: {
      'breadcrumb': breadCrumb,
      'commonTable': commonTable
    },
    methods: {
      // 分页
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
        this.currentPage = this.pageNum
        this.getTableData()
      },
      sortFun (flag) {
        var that = this
        if (!that.noData) return false
        for (let key in this.flagObj) {
          if (key == flag) {
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
          that.getTableData()
        }
        if (flag === 'mc') {
          console.log(this.flagObj.mc, '升序降序')
          that.sortType = ''
          if (that.flagObj.mc === true) {
            that.nameSort = 'DESC'
          }
          if (that.flagObj.mc === false) {
            that.nameSort = 'ASC'
          }
          that.statusSort = ''
          that.getTableData()
        }
        if (flag === 'pf') {
          console.log(this.flagObj.pf, '升序降序')
          that.sortType = ''
          that.nameSort = ''
          if (that.flagObj.pf === true) {
            that.statusSort = 'DESC'
          }
          if (that.flagObj.pf === false) {
            that.statusSort = 'ASC'
          }
          that.getTableData()
        }
        if (flag === 'zt') {
          console.log(this.flagObj.zt, '升序降序')
          if (that.flagObj.zt === true) {
            that.sortType = 'DESC'
          }
          if (that.flagObj.zt === false) {
            that.sortType = 'ASC'
          }
          that.nameSort = ''
          that.statusSort = ''
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
//        that.myData.pageNum=1;
//        that.getList();
        that.approvalStatus = ''
        that.getTableData()
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
          let val = (e === 0 ? 'WAITING' : e === 2 ? 'PASS' : e === 1 ? 'NO_PASS' : '')
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
            if (that.cheboxArr[i] === '待审核') {
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
          // 如果多选状态下没有选中就当取消
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
      getdata (data) {
        this.total = data.total
        this.table = data.data
      },
// 把省和市的code转化为汉字
      transformCode () {
        var that = this
        for (let value of LOCATION.RECORDS.values()) {
          for (var i = 0; i < that.table.length; i++) {
            var obj = that.table[i]
            if (value.CODE === obj.province) {
              obj.province = value.NAME
            }
            if (value.CODE === obj.city) {
              obj.city = value.NAME
            }
          }
        }
      },
      // 获取列表数据
      getTableData () {
        LoadingBoxService.open('加载中...')
        var that = this
        that.showtip_info = false
        ApiClient.get('/pcapi/enterprise/list', {
          keyword: this.content || this.keyword,
          pageNum: this.pageNum,
          pageSize: 10,
          status: this.approvalStatus,
          sortType: this.sortType,
          nameSort: this.nameSort,
          statusSort: this.statusSort
        }).then(data => {
          that.total = data.total
          that.table = data.data
          LoadingBoxService.close()
          that.first++
          console.log('first', that.first)
          console.log(data)
          if (that.table.length === 0 && that.first <= 1) {
            that.showTip = true
          } else {
            that.showTip = false
          }
          if (that.table.length === 0) {
            that.showtip_info = true
          }
          that.transformCode()
        }).catch(e => {
        })
      },
      clickStatus (index, item) {
        LoadingBoxService.open('加载中...')
        var that = this
        this.indexNum = index
        that.tableone = []
        console.log(item)
        let val = (item == '待审核' ? 'WAITING' : item == '已通过' ? 'PASS' : item == '未通过' ? 'NO_PASS' : '')
        that.approvalStatus = val
        var that = this
        ApiClient.get('/pcapi/enterprise/list', {
          keyword: that.content || '',
          pageNum: '',
          pageSize: 10,
          approvalStatus: val,
          soteType: ''
        }).then(data => {
          LoadingBoxService.close()
          console.log(data, '状态')
          that.total = data.total
          that.table = data.data
          that.transformCode()
        }).catch(e => {
        })
      },
      searchCompany () {
        LoadingBoxService.open('加载中...')
        var that = this
        that.indexNum = 0
        that.getTableData()
      },
      getUserInfo () {
        var that = this
        ApiClient.get('pcapi/userInfo/getInfo').then(data => {
          console.log(data, 'userinfo')
          that.userInfo.name = data.userName
          that.userInfo.phone = data.phone
          that.userInfo.password = data.passWord
          that.userInfo.realName = data.trueName
          that.userInfo.idCard = data.idCard
          that.userInfo.email = data.email
          that.userInfo.authStatus = data.authStatus
          if (that.userInfo.authStatus === 'AUTHORIZED') {
            this.getTableData()
          }
//                    that.userInfo.identity=data.authStatus
          console.log(that.userInfo)
          this.userInfo.phone = this.userInfo.phone.substring(0, 3) + '****' + this.userInfo.phone.substring(7, 11)
        })
      },
      pageChange (val) {
        console.log(`当前页: ${val}`)
        this.pageNum = val
        this.getTableData()
      },
      goInnercreate () {
        this.$router.push('/innercreateEnterprise')
      }
    },
    mounted () {
      this.tableone = this.table
      this.getUserInfo()
      this.$parent.setActive('账号管理', '创建企业')
    }
  }
</script>
<style lang="css" scoped>
  .inputClass {
	margin-left: 20px;
	width: 225px;
	height: 35px;
	line-height: 35px;
	border: none;
	border-bottom: 1px solid #e3e3e3;
	display: inline-block;
	position: relative;
	font-size: 12px;
	transition: all .5s;
  }
  .inputClass:hover, .inputClass:focus {
	border-bottom: 1px #55a8fd solid
  }
  .searchBoxcreateEnterprise i {
	display: inline-block;
	width: 20px;
	height: 20px;
	font-size: 20px !important;
  }
  .inputClass:focus {
	outline: none;
  }
  .searchBoxcreateEnterprise {
	margin-left: 0px;
	margin-top: 0px;
	position: relative;
	z-index: 30;
  }
  .searchBoxcreateEnterprise span {
	position: absolute;
	top: 6px;
	left: 274px;
	cursor: pointer;
  }
  .searchBoxcreateEnterprise .button {
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
  .searchBoxcreateEnterprise .button i {
	vertical-align: top;
	margin-right: 10px;
  }
  ::-webkit-input-placeholder {
	font-size: 12px;
	color: #999999;

  }
  :-moz-placeholder {
	font-size: 12px;
	color: #999999;

  }
  ::-moz-placeholder {
	font-size: 12px;
	color: #999999;
	opacity: 1;

  }
  :-ms-input-placeholder {
	font-size: 12px;
	color: #999999 !important;

  }
  .publicStatus {
	height: 42px;
	padding-top: 7px;
	border-bottom: 1px solid #EEEEEE;
  }
  .publicStatus .publicStatusRight {
	width: 40px;
	height: 40px;
	position: fixed;
	right: 10px;
	bottom: 40px;
	z-index: 101;
	box-sizing: border-box;
	padding: 7px 0 0 10px;
	background-color: #666;
  }
  .publicStatus .publicStatusRight:hover {
	background-color: #57A7FC;
  }
  .publicStatus .publicStatusRight .iconfont {
	font-size: 20px;
	color: #fff;
  }
  .statusColor {
	color: #56A8FE;
  }
  .tableList .tableListLine {
	height: 92px;
	border-bottom: 1px solid #EEEEEE;
	position: relative;
  }
  .tableListLeft {
	width: 90%;
	height: 92px;
	padding-left: 25px;
	padding-top: 20px;
  }
  .tableList .time {
	width: 10%;
  }
  .company {
	white-space: nowrap;
	text-overflow: ellipsis;
	width: 203px;
	height: 19px;
	text-align: left;
	font: normal 600 15px 'microsoft yahei';
	display: inline-block;
	overflow: hidden;
  }
  .status {
	display: inline-block;
	border: 1px solid;
	width: 57px;
	height: 19px;
	border-radius: 5px;
	text-align: center;
	vertical-align: top;
	margin-left: 30px;
  }
  .address {
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow: hidden;
	color: gray;
	width: 315px;
	margin-top: 11px;
  }
  /* .address i{
       display: inline-block;
       width: 15px;
       height: 15px;
   }*/
  .reason {
	height: 53px;
	width: 285px;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 3;
	overflow: hidden;
	color: #FF97A7;
  }
  .time {
	padding: 14px 0 0 10px;
	text-align: center;
	background-color: #FCFCFC;
	height: 91px;
  }
  .timex {
	padding: 32px 0 0 3px;
	background-color: #56A8FE;
	color: white;
	cursor: pointer;
	transition: all ease-in-out 0.5s;

  }
  .time span {
	display: block;
	margin-top: 8px;
  }
  .public {
	z-index: 12;
	overflow-x: hidden;
  }
  .statusColorOne {
	box-shadow: inset 2px 2px #56A8FE, inset -2px -2px #56A8FE;
	transition: all ease-in-out 0.2s;

  }
  .redClass {
	color: #FF365A;
	border-color: #FF365A;
  }
  .blueClass {
	color: #40AFFF;
	border-color: #40AFFF;
  }
  .greenClass {
	color: #19C000;
	border-color: #19C000;
  }
  .statusColorTwo {
	box-shadow: inset 0px 2px #56A8FE, inset -2px -2px #56A8FE;
	transition: all ease-in-out 0.2s;

  }
  .identify {
	margin: 126px 0 0 360px;
	font-size: 15px;
  }
  .identify .identify-info {
	color: #fa3753;
  }
  .identify .identify-info :hover {
	text-decoration: underline;
  }
  .error {
	text-align: center;
	padding-top: 150px;
	font-size: 16px;
  }
  .error a {
	color: red;
  }
  .waitImg {
	position: relative;
	top: -10px;
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
  .establish {
	margin: 100px auto;
	margin-left: 50%;
	transform: translateX(-17%);
  }
  .establish div:first-of-type {
	text-indent: 2em;
	font-size: 15px;
	font-weight: 500;
  }
  .establish button {
	color: #56A8FC;
	border: 1px solid #56A8FC;
	width: 99px;
	height: 35px;
	border-radius: 4px;
	position: relative;
	top: 60px;
	left: 50px;
  }
  .checkboxCon .checkboxBut {
	width: 40px;
	line-height: 30px;
	color: #e0e0e0;
	border-left: 1px #f1f1f1 solid;
	text-align: center;
	cursor: default !important;
	background: #f5f5f5;
  }
  .checkboxCon .checkboxBut i {
	color: #e0e0e0;
  }
  .checkboxCon .checkboxBut:hover i {
	color: #e0e0e0 !important;
  }
</style>
<style src="../../../css/collection.css" scoped>
</style>
<style scoped>
  .listCon ul li {
	text-align: left;
	float: left;
	box-sizing: border-box;
	line-height: 24px;
	height: 24px;
	position: relative;
	margin-right: 14px !important;
	margin-left: 0px !important;
  }
  .listCon ul li.wti {
	padding-left: 0px !important;
	width: 41px;
	padding-top: 0px;
  }
  .queryListWord {
	height: 32px;
	border: 1px #f1f1f1 solid;
	overflow: hidden;
	margin-top: 13px !important;
	position: relative;
	z-index: 30;
  }
  .arrow:hover {
	color: #56a6fd;
	font-weight: bolder;
  }
  .checkboxShow ul li {
	padding-left: 0px;
  }
</style>
