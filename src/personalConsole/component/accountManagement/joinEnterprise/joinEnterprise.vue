<template>
  <div class="public">
    <breadcrumb :data="breadcrumb"></breadcrumb>
    <!-- v-show="userInfo.authStatus === 'AUTHORIZED'" -->
    <div v-show="userInfo.authStatus === 'AUTHORIZED'&&first>=1">
      <div class="establish" v-if="!showEnterprise&&sec">
        <img src="../../../images/noenterprise.jpg" alt="">
        <div>平台暂无企业加入，敬请期待~</div>
      </div>

      <div v-show="showEnterprise">
        <div class="searchBox11">
          <div class="searchType">
            <span class="typeTitle">企业名称：</span>
            <input class="searchInput" type="text" v-model="keyword" placeholder="请输入企业的名称" @keyup.enter="getTableList">
            <i @click="getTableList" class="iconfont icon-sousuo"></i>
          </div>
          <div class="searchType">
            <span class="typeTitle">企业类型：</span>
            <span class="searchStatus" :class="{active: enterpriseTypeActive === index}"  @click="clickStatus(index,item)"   v-for="(item,index) in enterpriseType" :key="index">{{item}}</span>
          </div>
          <!-- <div class="searchType">
            <span class="typeTitle">企业状态：</span>
            <span class="searchStatus" :class="{active: enterpriseStatusActive === index}" @click="enterpriseStatusActive = index" v-for="(item,index) in enterpriseStatus" :key="index"><i class="cheboxInput"></i><span>{{item}}</span></span>
          </div> -->
          <div class="tStyel tStyelfuw ">
            <span class="textName">申请状态：</span>
            <div class="listCon" :class="{checkboxShow: choice}" v-show="isShow">
              <ul id="wdtcst">
                <li class="wti"  :class="{active:isAclass1,grayColor:isgrayColor}"  @click="seLinst1"><a>全部</a></li>
                <li v-for="(item,index) in datalist" :key=index  @click="toggle(index)" :class="{active: item.checkbox,grayColor:isgrayColor}"><i class="cheboxInput"></i><em><a>{{item.name}}</a></em></li>
              </ul>
            </div>
            <div class="selected" v-show="!isShow">
              <div class="selectedAll">
                <span v-for="seleAll in cheboxArr">
                  {{seleAll}}<i>,</i>
                </span>
                <em class="dataAll" @click="showAll()">x</em>
              </div>
            </div>
            <div class="rightBut" v-show="isShow">
              <button class="inpuChbox cheboxAllSyle" @click='cheboxAll()' :class="{active: choice,grayColor1:isgrayColor}">{{cheboxtext}}</button>
            </div>
          </div>
        </div>
        <div class="queryListWord">
          <div class="sortCon">
            <span :class="{active:activec=='zn'}" @click="sortFun('zn')">智能</span>
            <span class="sortWord" :class="{active:activec=='lx','wordUp':!flagObj.lx}" @click="sortFun('lx')"><em>类型</em><i class="icon iconfont icon-jiantou-up"></i><i class="icon iconfont icon-jiantou-lower"></i></span>
            <span class="sortWord" :class="{active:activec=='zt','wordUp':!flagObj.zt}" @click="sortFun('zt')"><em>状态</em><i class="icon iconfont icon-jiantou-up"></i><i class="icon iconfont icon-jiantou-lower"></i></span>
            <span class="sortWord" :class="{active:activec=='sj','wordUp':!flagObj.sj}" @click="sortFun('sj')"><em>时间</em><i class="icon iconfont icon-jiantou-up"></i><i class="icon iconfont icon-jiantou-lower"></i></span>
          </div>
          <div v-show="pageShow">
            <div class="checkboxCon" v-show="checkFlag">
              <div class="checkboxBut"><i class="icon iconfont icon-caozuo"></i></div>
            </div>
            <div class="topPage" v-show="checkFlag">
              <em><i class="cloer">{{pageNum}}</i>/{{maxNum}}</em>
              <div class="pageTop" v-show="noDataPage">
                <span @click="goNext(-1)" class="arrow" style="font-family: simSun;">&lt;</span>
                <span @click="goNext(1)" class="arrow" style="font-family: simSun;">&gt;</span>
              </div>
            </div>
          </div>
        </div>
        <!-- <div class="searchBox11"><input v-model="keyword" class="inputClass" type="text" placeholder="请输入你要搜索公司的名称">
          <div @click="getTableList" class="button">
            <i class="iconfont icon-sousuo"></i>搜索</div>
        </div> -->
        <!-- <div class="publicStatus">
          <div class="publicStatusLeft">
            <span>
              全部
            </span>
          </div>
        </div> -->
        <div v-show="showTip" class="tipMsg">
          <img src="../../../images/noenterprise.jpg" alt="">
          <p>{{tipMsg}}</p>
        </div>
        <!-- <common-table :total="total" :table="table" :whatTable="whatTable" @pageChange="pageChange" @quit="quitEnterprise" @cancelApply="cancelApply" @child-say="listenToMyBoy"></common-table> -->
        <div class="tableBox">
          <div v-for="(item,index) in table" class="tableItem" :key="index">
            <div>
              <div class="enterpriseInfo">
                <div>
                  <span class="enterpriseName" :title="item.name">{{item.name}}</span>
                  <span class="status"  v-show="item.status" :class="item.status=='WAITING'? 'blueClass' : item.status == 'PASS'? 'greenClass' : item.status == 'NO_PASS'? 'redClass' :''">
                    {{item.status == "WAITING" ? "待审核" : item.status == "PASS" ? "已通过" : item.status == "NO_PASS" ? "未通过" : ""}}
                  </span>
                </div>
                <div class="enterpriseAddress"><i class="iconfont icon-location"></i>{{item.province}}{{item.city}}{{item.address}}</div>
              </div>  
              <div class="applyTime">{{item.applyTime}}</div>
              
              <!-- 驳回原因 -->
              <div v-show="item.reason!==''&&item.status=='NO_PASS'?true:false" class="reason">驳回原因:{{item.reason}}</div>
              <!-- 高级 -->
              <div v-show="item.status==''?false:true" @click="clickHigh(index)" class="advanced">
                <span>高级</span>
                <i class="iconfont icon-arrow-down"></i>
                <div v-show="index===curAction" class="frame">
                  <div v-show="(item.status==='NO_PASS')?true:false" @click="listenlistenToMyBoy(item, 'again')">重新申请</div>
                  <div v-show="(item.status==='PASS')?true:false" @click="quitEnterprise(item)">退出企业</div>
                  <div v-show="(item.status==='WAITING')?true:false" @click="cancelApply(item.id)">撤销申请</div>
                  <div v-show="(item.status==='')?true:false" @click="listenlistenToMyBoy(item)">申请加入</div>
                </div> 
              </div>
              
              <!-- 查看按钮 -->
              <div class="view" @click="listenlistenToMyBoy(item)">
                {{item.status==''?'申请加入':'查看'}}
              </div>
              <div class="slideView" @click="listenlistenToMyBoy(item)">
                {{item.status==''?'申请加入':'查看'}}
              </div>
            </div>
          </div>  
        </div>
         <!-- :class="{isMaxNum:pageNum==maxNum&&maxNumItems<4?true:false}" -->
        <div>
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" v-show="total>10&&showEnterprise" :current-page.sync="pageNum" :page-size="pageSize" layout="prev, pager, next,total,jumper" :total="total" prev-text="上一页" next-text="下一页">
          </el-pagination>
        </div>
      </div>
      <div v-show="cosplay" class="cosplay">
        <div class="message-tip">请完善一下信息,方便我们更好的为您服务</div>
        <div class="applyInfoContent">
          <h4>申请资料</h4>
          <div class="table">
            <span>手机号码：{{userInfo.phone}}</span>
            <span>真实姓名：{{userInfo.trueName}}</span>
            <span>证件号码：{{userInfo.idCard}}</span>
            <span>
              <span style="vertical-align: top;display: inline">申请说明：</span>
              <textarea maxlength="100" name="" id="" cols="30" rows="10" v-model="applyInfo" style="display: inline;width: 322px;height: 141px;border: 1px solid #EDEDED;border-radius: 5px"></textarea>
            </span>
            <div class="applyButton">
              <button class="btnGreen" @click="backTablePage">返回</button>
              <button class="btnBlue" @click="submit">提交</button>
            </div>
          </div>
        </div>
      </div>
        <div v-show="view" class="cosplay">
        <!-- <div class="message-tip">请完善一下信息,方便我们更好的为您服务</div> -->
        <div class="applyInfoContent">
          <h4>申请资料</h4>
          <div class="table">
            <span>手机号码：{{userInfo.phone}}</span>
            <span>真实姓名：{{userInfo.trueName}}</span>
            <span>证件号码：{{userInfo.idCard}}</span>
            <span>
              <span style="vertical-align: top;display: inline;">申请说明：</span>
              <!-- <textarea disabled id='disa' maxlength="100" name=""  cols="30" rows="10" v-model="applyInfo"></textarea> -->
              <span id='disa'>{{applyInfo}}</span>
            </span>
            <div class="applyButton applyButton1">
              <button class="btnGreen" @click="backTablePage">返回</button>
            </div>
          </div>
        </div>
      </div>
      <div class="content" v-show="oneplay">
        <div class="result">
          <div class="info">
            <span>
              <div class="success-info">申请完成,请等待具体审核结果</div>
              <div class="icon">
                <img src="../../../images/submitsuccess.png" alt="">
              </div>
            </span>
            <span></span>
          </div>
        </div>
        <div class="backinfo">
          <span title="点击返回" @click="goLogin">{{backCount}}秒后返回加入企业主页</span>
        </div>
      </div>
    </div>
    <div v-show="userInfo.authStatus === 'UNAUTHORIZED'" class="error">您还未通过个人实名认证，无法加入企业，<router-link to="realNameCertification">立即前往认证</router-link></div>
    <div v-show="userInfo.authStatus === 'AUTHORIZE_FAILED'" class="error">您的个人实名认证审批未通过，<router-link to="ReApplyrealNameCertification">重新认证</router-link></div>
    <div v-show="userInfo.authStatus === 'AUTHORIZING'" class="error">
      <img src="../../../images/waiting.png" class='waitImg'>您的实名认证已提交，请等待审核结果
    </div>
    
    
  </div>
</template>
<script>
import breadCrumb from '../../publicComponent/breadCrumb.vue'
import commonTable from '../../publicComponent/commonTable.vue'
import apiClient from '../../../../publicJs/ApiClient.js'
import LoadingBoxService from '../../../../publicJs/LoadingBoxService.js'
import NoticeBoxService from '../../../../publicJs/NoticeBoxService.js'
import UtilService from '../../../../publicJs/UtilService.js'
import LOCATION from '../basicInformation/PF_LOCATION.json'
import TipBoxService from '../../../../publicJs/TipBoxService'
import userService from '../../../../publicJs/userService'
var countBack = ''
export default {
  name: 'joinEnterprise',
  components: {
    'breadcrumb': breadCrumb,
    'commonTable': commonTable
  },
  data () {
    return {
      sec: true,
      first: 0,
      bigshowTip: false,
      statusAll: true,
      view: false,
      viewTips: '',
      isgrayColor: false,
      enterpriseType: ['全部', '已申请加入', '未申请加入'],
      enterpriseStatus: ['待审核', '未通过', '已通过'],
      enterpriseTypeActive: 0,
      enterpriseStatusActive: 0,
      filterType: ['智能', '类型', '状态', '时间'],
      filterTypeActive: 0,
      cosplay: false, // 显示申请加入页面
      showEnterprise: true, // 显示带有企业页面
      oneplay: false,
      breadcrumb: [{name: '账号管理', link: '/safetyManagement'}, {name: '加入企业', link: ''}],
      whatTable: 2,
      backCount: 3,
      table: [],
      currentPage: 1,
      pageNum: 1,
      pageSize: 10,
      total: 0,
      approvalStatus: '', // 第一行的搜索
      keyword: '', // 搜索的关键字
      userInfo: {
        phone: '',
        trueName: '',
        idCard: ''
      },
      noData: true,
      enterpriseId: '',
      id: '',
      applyInfo: '', // 申请的信息
      type: '', // 区别是申请还是重新申请
      tipMsg: '',
      showTip: false,
      cheboxArr: [], // 服务多选
      choicest: false, // 判断是单选还是多选状态
      choice: false, // 判断是单选还是多选
      moredm: false, // 更多
      isAclass1: true, // 控制关键词标签高亮
      isShowText: false,
      isShowDuoxuan: true,
      isShow: true,
      cheboxtext: '+多选',
      atveSize: 0, // 知道我选中了几个标签
      dataliststat: [], // 状态数据
      datalist: [{name: '待审核', checkbox: false}, {name: '未通过', checkbox: false}, {name: '已通过', checkbox: false}],
      myData: {
        serviceName: '', // 搜索
        serviceTag: '', // 服务标签
        servicetSatus: '', // 服务状态
        sort: 'asc',
        sortType: 'zn'
      },
      pageShow: true, // 根据分页显示隐藏
      checkFlag: true,
      activec: 'zn',
      flagObj: {
        lx: false,
        zt: false,
        sj: false
      },
      noDataPage: true,
      curAction: -1,
      timeSort: '', // 根据时间排序
      nameSort: '', // 根据名称排序
      statusSort: '', // 根据状态排序
      isApply: '',
      selectBox: []
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
    this.getUserInfo()// 获取用户的信息
    this.StatusText() // 请求状态更新datalist列表
    this.$parent.setActive('账号管理', '加入企业')
  },
  methods: {
    // 把省和市的code转化为汉字
    transformCode () {
      var that = this
      for (let value of LOCATION.RECORDS) {
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
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.pageNum = val
      this.getTableList()
    },
     // 分页
    goNext (n) {
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

      this.getTableList()
    },
    // 菜单排序查询
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
        that.timeSort = ''
        that.nameSort = ''
        that.statusSort = ''
        that.pageNum = 1
        that.getTableList()
      }
      if (flag === 'lx') {
        console.log(this.flagObj.lx, '升序降序')

        if (that.flagObj.lx === true) {
          that.nameSort = 'DESC'
        }
        if (that.flagObj.lx === false) {
          that.nameSort = 'ASC'
        }
        that.statusSort = ''
        that.timeSort = ''
        that.pageNum = 1
        that.getTableList()
      }
      if (flag === 'zt') {
        console.log(this.flagObj.zt, '升序降序')
        that.timeSort = ''
        that.nameSort = ''
        that.pageNum = 1
        if (that.flagObj.zt === true) {
          that.statusSort = 'DESC'
        }
        if (that.flagObj.zt === false) {
          that.statusSort = 'ASC'
        }
        that.getTableList()
      }
      if (flag === 'sj') {
        console.log(this.flagObj.sj, '升序降序')
        that.statusSort = ''
        that.nameSort = ''
        that.pageNum = 1
        if (that.flagObj.sj === true) {
          that.timeSort = 'DESC'
          console.log(that.timeSort)
        }
        if (that.flagObj.sj === false) {
          that.timeSort = 'ASC'
          console.log(that.timeSort)
        }
        that.getTableList()
      }
    },
    clickStatus (index, item) { // 改变全部 已申请 未申请的状态
      console.log(item)
      var that = this
      this.enterpriseTypeActive = index
      if (item === '全部') {
        that.statusAll = true
        that.isgrayColor = false
        this.isAclass1 = true
        for (var i = 0; i < that.datalist.length; i++) {
          that.datalist[i].checkbox = false
        }
        that.showAll()
        that.isApply = ''
        that.approvalStatus = ''
        that.pageNum = 1
      } else if (item === '已申请加入') {
        that.statusAll = false
        that.isgrayColor = false
        that.isApply = 'YES'
        that.pageNum = 1
        that.approvalStatus = 'PASS,WAITING,NO_PASS'
        that.isAclass1 = true
        for (var i = 0; i < that.datalist.length; i++) {
          that.datalist[i].checkbox = false
        }
      } else if (item === '未申请加入') {
        that.statusAll = false
        that.isgrayColor = true
        that.isApply = 'NO'
        that.approvalStatus = ''
        that.pageNum = 1
      }
      that.getTableList()
    },
    StatusText () { // 页面开始加载将状态赋给dataliststat
      var that = this
      that.dataliststat = []
      for (var i = 0; i < that.enterpriseStatus.length; i++) {
        var obj = {
          name: that.enterpriseStatus[i],
          checkbox: false
        }
        that.dataliststat.push(obj)
      }
    },
    getTableList () { // 按条件获取所有企业的列表
      var that = this
      var param = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        status: this.approvalStatus,
        keyword: this.keyword,
        sortType: this.timeSort, // 根据时间排序
        nameSort: this.nameSort, // 根据名称排序
        statusSort: this.statusSort, // 根据状态排序
        isApply: this.isApply
      }

      LoadingBoxService.open('加载中...')
      apiClient.get('pcapi/enterpriseApply/list', param).then(data => { // 调取企业的接口
        LoadingBoxService.close()
        that.first++
        this.table = data.data
        // this.table = []
        console.log('first', that.first)
        console.log(data.data)
        if (this.table.length === 0 && that.first > 1) {
          this.tipMsg = '未找到相关数据'
          this.showTip = true
        } else if (this.table.length === 0 && that.first <= 1) {
          console.log(111111111)
          this.showEnterprise = false
          this.showTip = false
          console.log(this.showEnterprise)
        } else {
          this.showTip = false
        }
        // this.showEnterprise = true// 显示企业列表

        this.total = data.total

        for (let i = 0; i < this.table.length; i++) {
          const el = this.table[i]
          this.table[i].name = el.enterprise.name
          this.table[i].address = el.enterprise.address
          this.table[i].province = el.enterprise.province
          this.table[i].city = el.enterprise.city
          if (el.applicationTime !== null) {
            this.table[i].applyTime = UtilService.formatDuring(el.applicationTime, 'yyyy-MM-dd HH:mm:ss')
          } else {
            this.table[i].applyTime = ''
          }
        }
        that.transformCode()
      }).catch(e => {
        LoadingBoxService.close()
        console.log(e)
        TipBoxService.open('获取列表失败', 2, 2)
      })
    },
    getUserInfo () { // 获取用户信息
      apiClient.get('pcapi/userInfo/getInfo').then(data => {
        console.log(data)
        this.userInfo = data
        if (this.userInfo.authStatus === 'AUTHORIZED') {
          this.getTableList()
        }
        this.userInfo.phone = this.userInfo.phone.substring(0, 3) + '****' + this.userInfo.phone.substring(7, 11)
      }).catch(e => {
        console.log(e)
        TipBoxService.open('获取用户信息失败', 2, 2)
      })
    },
    // 跳转申请
    listenlistenToMyBoy (value, type) {
      console.log('value', value)
      console.log('type', type)
      if (value.status === '') { // 未申请点击查看
        this.view = false
        this.cosplay = true
      } else if (value.status === 'NO_PASS' && type === 'again') {
        this.view = false
        this.cosplay = true
      } else {
        this.view = true
        this.cosplay = false
      }
      this.sec = false
      this.showEnterprise = false // 显示渲染的企业列表
      this.enterpriseId = value.enterprise.id
      this.applyInfo = value.applyInfo
      this.type = type
      this.id = value.id
    },
    // 返回
    backTablePage () {
      this.showEnterprise = true
      this.cosplay = false
      this.view = false
    },
    // 提交申请分为第一次提交和重新申请
    submit () {
      if (this.applyInfo === '') {
        TipBoxService.open('请完善申请说明信息', 2, 2)
        return false
      }
      LoadingBoxService.open('加载中...')
      var that = this
      var param = {
        enterpriseId: this.enterpriseId,
        applyInfo: this.applyInfo
      }
      var apiUrl = 'pcapi/enterpriseApply/create'
      if (this.type) {
        apiUrl = 'pcapi/enterpriseApply/update'
        param = {
          id: this.id,
          applyInfo: this.applyInfo
        }
      }
      apiClient.get(apiUrl, param).then(data => {
        LoadingBoxService.close()
        console.log(this.type, data)
        this.cosplay = false
        this.showEnterprise = false
        this.oneplay = true
        countBack = setInterval(function () {
          if (that.backCount > 0) {
            that.backCount--
          } else {
            that.goLogin()
          }
        }, 1000)
      }).catch(e => {
        console.log(e)
        TipBoxService.open('提交申请失败', 2, 2)
      })
    },
    // 撤销申请
    cancelApply (id) {
      var that = this
      NoticeBoxService.open('您确定要撤销申请？', function () {
        NoticeBoxService.close()
        apiClient.delete('pcapi/enterpriseApply/cancel', {id: id}).then(data => {
          console.log('cancelApply', data)
          that.getTableList()
        })
      })
    },
    // 退出企业
    quitEnterprise (value) {
      var that = this
      console.log('quitEnterprise', value)
      NoticeBoxService.open('您确定要退出企业？', function () {
        NoticeBoxService.close()
        var enterpriseName = userService.getInfo('identity')
        if (enterpriseName) {
          enterpriseName = decodeURI(enterpriseName)
          console.log('enterpriseName Cookie', 'enterpriseName')
        } else {
          console.log('enterpriseName在cookie中没取到')
        }
        if (enterpriseName === value.name) {
          TipBoxService.open('该企业为身份所属企业,不能退出', 2, 2)
          return false
          // apiClient.get('pcapi/enterprise/change').then(data => {
          //   console.log(data)
          //   sessionStorage.setItem('enterpriseName', '')
          //   sessionStorage.setItem('enterpriseId', '')
          //   sessionStorage.setItem('logintype', 'PERSONAL')
          //   that.$parent.$children[1].identity = '个人'
          // })
        }
        apiClient.get('pcapi/enterpriseApply/quit', {id: value.id}).then(data => {
          console.log('cancelApply', data)
          console.log('111111222222')
          console.log('token', '_' + apiClient.token)
          that.getTableList()
        }).catch(e => {
          LoadingBoxService.close()
          console.log(e)
          TipBoxService.open('退出企业失败', 2, 2)
        })
      }, null, 2)
    },
    // 多选标签确定
    cheboxAll () {
      if (this.isgrayColor) { // 点击未申请加入 多选不能点击
        return false
      }
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
//            that.approvalStatus=that.cheboxArr.join()
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
        that.isApply = 'YES'
        that.pageNum = 1
        that.getTableList()
        console.log(that.approvalStatus, '状态')
        console.info('点击确定了', that.atveSize)
          // 如果多选状态下没有选中就当取消
        if (that.atveSize <= 0) {
          that.cheboxtext = '+多选'
          that.choice = false
          return false
        }
          // 如果多选状态下没有选中1一个就走单选
        if (that.atveSize == 1) {
          console.info('只能选中一个')
          that.cheboxtext = '+多选'
          that.choice = false
//            that.myData.serviceTag = sty;
//            that.myData.pageNum=1;
//            that.getList();
          return false
        } else {
          console.info('1个进来了', that.atveSize)
        }
        that.isShow = false
        that.cheboxtext = '+多选'
        that.choice = false
//          that.myData.serviceTag = sty;
//          that.myData.pageNum=1;
//          that.getList();
        return false
      } else {
        that.cheboxArr = []
      }
      that.cheboxtext = '确定'
    },

     // 全部企业状态查询
    seLinst1 () {
      if (this.isgrayColor) { // 点击未申请加入 多选不能点击
        return false
      }
      var that = this
      that.active = false
      that.isAclass1 = true
        // 点击全部取消其他关键词高亮
      for (var i = 0; i < that.datalist.length; i++) {
        that.datalist[i].checkbox = false
      }
      if (that.statusAll) {
        that.isApply = ''
        that.approvalStatus = ''
        that.pageNum = 1
        that.getTableList()
      } else {
        that.isApply = 'YES'
        that.approvalStatus = 'PASS,WAITING,NO_PASS'
        that.pageNum = 1
        that.getTableList()
      }
    },
      // 多选状态
    toggle (e) {
      if (this.isgrayColor) { // 点击未申请加入 多选不能点击
        return false
      }
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
//          that.myData.serviceTag = that.datalist[e].name;
//          that.getList();
        that.pageNum = 1
        let val = (e === 0 ? 'WAITING' : e === 2 ? 'PASS' : e === 1 ? 'NO_PASS' : '')
        that.approvalStatus = val
        that.getTableList()
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

      that.pageNum = 1

      // 判断是否为全部状态还是已申请加入状态
      if (that.statusAll) {
        that.isApply = ''
        that.approvalStatus = ''
      } else {
        that.isApply = 'YES'
        that.approvalStatus = 'PASS,WAITING,NO_PASS'
      }
      that.getTableList()
      for (var i = 0; i < that.datalist.length; i++) {
        that.datalist[i].checkbox = false
      }
    },
    // 分页变化W
    pageChange (val) {
      this.pageNum = val
      this.getTableList()
    },
    goLogin () {
      this.backCount = 3
      clearInterval(countBack)
      this.showEnterprise = true
      this.cosplay = false
      this.oneplay = false
      this.getTableList()
    },
    clickHigh (index) {
      if (this.curAction === index) {
        this.curAction = -1
      } else {
        this.curAction = index
        console.log(index)
      }
    }
  }
}
</script>
<style src="../../../css/collection.css" scoped></style>
<style lang="css" scoped>
.reason {
  height: 53px;
  width: 240px;
  position: absolute;
  right: 252px;
  top:20px;
  left: 630px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  text-overflow: ellipsis;
  text-align: justify;
  text-justify: inter-ideograph;
  overflow: hidden;
  color: #ff3855;
  z-index: 43;
}
.advanced{
  position: absolute;
  right: 132px;
  top:17px;
  color: #56a8fe;
  font-size: 12px;
  z-index: 42;
  cursor: pointer;
}
.advanced i{
  margin-top: 5px;
  font-size: 10px;
}
.advanced .frame{
  width: 58px;
  height: 31px;
  line-height: 31px;
  text-align: center;
  position: absolute;
  top:18px;
  right: -9px;
  color: #333;
  /* padding: 8px 4px; */
  border: 1px solid #f1f1f1;
  font-size: 12px;
  border-radius: 5px;
  box-shadow: 0px 1px 2px rgba(0, 0, 0, .2);
}
.advanced .frame:hover{
  /* background-color: #e4e8f1; */
  color: #56a8fe;
}
#wdtcst{
  margin-left: -14px;
}
.message-tip {
  height: 24px;
  background-color: #fafafa;
  text-align: center;
  line-height: 25px;
}
.cosplay h4 {
  height: 40px;
  line-height: 40px;
  display: inline-block;
  border-bottom: 3px solid #fa4500;
  position: relative;
  top: 1px;
}
/* .cosplay h4 span {
  border-bottom: 2px solid #bf5e34;
} */
.applyInfoContent {
  padding: 15px 100px 0;
}
.publicStatus .publicStatusLeft {
  float: left;
}
.publicStatus {
  height: 54px;
  padding-top: 25px;
  padding-left: 25px;
  border-bottom: 1px solid #eeeeee;
}
.publicStatus .publicStatusLeft span {
  color: #56a8fe;
  font-size: 14px;
}
.public {
  z-index: 12;
  overflow-x: hidden;
}
.searchBox11 {
  height: 105px;
  padding: 3px 0;
  border-bottom: 1px solid #e4e4e4;
  margin-bottom: 10px;
}
.searchBox11 .searchType {
  height: 33px;
  line-height: 33px;
  position: relative;
  z-index: 100;
}
.searchBox11 .searchType i.icon-sousuo {
  position: absolute;
  left: 306px;
  top:2px;
  color: #666666;
  cursor: pointer;
  font-size: 20px;
}
.searchBox11 .typeTitle {
  margin-right: 20px;
}
.searchBox11 .searchInput {
  outline: none;
  border: none;
  border-bottom: 1px solid #f1f1f1;
  width: 244px;
  height: 30px;
  line-height: 30px;
}
.searchBox11 .searchInput:hover {
  border-bottom: 1px solid #55a8fd;
}
.searchBox11 .searchInput:focus {
  border-bottom: 1px solid #55a8fd;
}
.searchBox11 input.searchInput::-webkit-input-placeholder {
  color: #ACACAC;
}
.searchBox11 input.searchInput:-moz-placeholder {
  color: #ACACAC;
}
.searchBox11 input.searchInput::-moz-placeholder {
  color: #ACACAC;
}
.searchBox11 input.searchInput:-ms-input-placeholder {
  color: #ACACAC;
}
.searchBox11 .searchType .searchStatus {
  margin-right: 30px;
  cursor: pointer;
  position: relative;
}
.searchBox11 .searchType .searchStatus.active {
  color: #55a8fd;
}
.filterBox {
  margin-top: 15px;
  height: 34px;
  line-height: 34px;
  border: 1px solid #f1f1f1;
  overflow: hidden;
}
.filterBox .filterType {
  display: inline-block;
  width: 80px;
  height: 36px;
  text-align: center;
  position: relative;
  top: -2px;
  border-right: 1px solid #f1f1f1;
  cursor: pointer;
}
.filterBox .filterType.active {
  color: #55a8fd;
}
.filterBox .filterType i {
  position: relative;
  top: 2px;
  display: inline-block;
  width: 10px;
}
.filterBox .fastPagination {
  float: right;
  height: 100%;
}
.filterBox .fastPagination > span {
  display: inline-block;
  width: 40px;
  text-align: center;
  border-right: 1px solid #f1f1f1;
}
.filterBox .fastPagination > span > i {
  font-size: 10px;
}
.filterBox .fastPagination > span > i.icon-zuoyou,
.filterBox .fastPagination > span > i.icon-zuoyou1 {
  cursor: pointer;
}
.tableBox .tableItem {
  height: 90px;
  border-bottom: 1px solid #f1f1f1;
  border-right: 1px solid #f1f1f1;
  box-sizing: border-box;
  padding-left: 26px;
  position: relative;
}
.tableBox .tableItem>div{
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.tableBox .tableItem>div .view{
  width: 120px;
  height: 89px;
  background-color: #fcfcfc;
  cursor: pointer;
  z-index:10;
  border-left: 1px solid #f1f1f1;
  position: absolute;
  right: 0;
  top: 0;
  color: #56a8fe;
  line-height: 89px;
  text-align: center;
  box-sizing: border-box;
}
.tableBox .tableItem>div .slideView{
  width: 120px;
  height: 89px;
  background-color: #56a8fe;
  position: absolute;
  right: -121px;
  top: 0;
  color: #fff;
  line-height: 89px;
  text-align: center;
  box-sizing: border-box;
  cursor: pointer;
  transition: all 0.4s;
   z-index:100;
}
.tableBox .tableItem>div::after{
  content: '';
  transition: all 0.1s;
}
.tableBox .tableItem>div:hover::after{
   content: '';
    position: absolute;
    top:0;
    left: 0px;
    bottom: 0;
    right: 0;
    border: 2px #55a8fd solid;
    z-index: 11;
    box-shadow: 0 0 8px rgba(85,168,253,.7)
}
.tableBox .tableItem>div:hover .slideView{
  right: 0;
}
.tableBox .tableItem .enterpriseInfo {
  width: 400px;
  float: left;
}
.tableBox .tableItem .enterpriseInfo .enterpriseName {
  display: inline-block;
  margin-top: 20px;
  font-weight: 700;
  font-size: 14px;
  padding-right: 10px;
  /* width: 220px; */
  /* overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap; */
}
.tableBox .tableItem .enterpriseInfo .status {
  display: inline-block;
  width: 55px;
  height: 20px;
  border: 1px solid transparent;
  border-radius: 10px;
  text-align: center;
  position: relative;
  top:-1px;
}
.tableBox .tableItem .enterpriseInfo .enterpriseAddress {
  margin-top: 15px;
  font-size: 10px;
  height: 17px;
  line-height: 17px;
  color: #959595;
  width: 350px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
.tableBox .tableItem .enterpriseInfo .enterpriseAddress i {
  color: #FE9400;
}
.tableBox .tableItem .applyTime {
  position: relative;
  top: 60px;
  float: left;
  height: 14px;
  line-height: 14px;
  font-size: 10px;
  color: #959595;
}
.content {
  padding: 0 100px;
}
.error-info {
  margin-left: 10px;
  color: #fa3753;
  font-size: 12px;
  position: relative;
  top: -5px;
}
.modify-input .input .errorinput {
  border-color: #fa3753;
}

.modify-title span {
  font-size: 16px;
  border-bottom: 2px solid #ff4500;
  padding: 5px 0px;
}

.modify-input .title {
  flex: 3;
  text-align: right;
  padding-right: 5px;
  font-size: 14px;
}
.modify-input .input {
  flex: 7;
  position: relative;
}
.modify-input .input input {
  height: 30px;
  border: 1px solid #f1f1f1;
  border-radius: 6px;
  padding: 0 6px;
  -moz-outline-radius: 6px;
  position: relative;
  top: -6px;
  width: 320px;
}

.password-tips ul {
  list-style-type: circle;
  color: #888;
  width: 150px;
}
.icon {
  position: relative;
}
.info .icon img {
  width: 55px;
  height: 55px;
  position: absolute;
  top: -30px;
  left: -75px;
}

.backinfo span {
  cursor: pointer;
  color: #888;
  font-size: 12px;
  margin-left: -50px;
}
.backinfo span:hover {
  text-decoration: underline;
}
.result {
  margin: 70px 0 50px 0;
  display: flex;
  justify-content: center;
}
.result .info span:first-child {
  font-size: 16px;
  height: 46px;
  line-height: 46px;
}
.success-info {
  position: relative;
  top: 18px;
}
.backinfo {
  text-align: center;
}
.backinfo span {
  cursor: pointer;
  color: #888;
  font-size: 12px;
  margin-left: -50px;
}
.backinfo span:hover {
  text-decoration: underline;
}
.applyButton {
  margin-top: 30px;
  text-align: center;
}
.applyButton1{
  text-align: left !important;
}
.applyButton button {
  margin-right: 50px;
}
.error {
  text-align: center;
  padding-top: 150px;
  font-size: 16px;
}
.error a {
  color: red;
}
.tipMsg {
  text-align: center;
  padding-top: 92px;
  font-size: 14px;
}
.waitImg {
  position: relative;
  top: -10px;
}
.tStyel{
    padding-left: 72px;
    padding-right: 125px;
    position: relative;
    box-sizing:border-box;
    padding-bottom: 10px;
}
.tStyel .textName{
    position: absolute;
    left: 0;
    line-height: 26px;
    width: 72px;
}
.tStyel.tStyelfuw .listCon{
   
    position: relative;
    height: 30px;
    
}
.tStyel .listCon .checkboxStyle{
    display: none;
}
.tStyel .listCon.checkboxShow .checkboxStyle{
    display: inline-block;
}
.listCon ul{
    z-index: 100;
    overflow: hidden;
    position: absolute;
    width: 100%;
    transition: all .4s;
    height: 26px;
}
.listCon ul.heiauto{
    height: 100px;
    border: 1px #5cabfd solid;
    background-color: #fff;
}
.listCon ul li{
    width: 53px;
    text-align: left;
    float: left;
    box-sizing: border-box;
    line-height: 24px;
    height: 24px;
    
    position: relative;
    
    margin-right: 6px;
    margin-left: 10px;
}
.listCon ul li.wti:hover{
    color: #55a8fd;
} 
.listCon ul li.wti{
  position: relative;
  left:15px;
}
.listCon ul li.active i.cheboxInput{
    background: url("../../../images/inputchebox.png") no-repeat;
}
.checkboxShow .cheboxInput{
    display: inline-block;
}
.cheboxInput{
    background: url("../../../images/inputcheboxs.png") no-repeat;
    width: 12px;
    height: 12px;
    vertical-align: middle;
    position: absolute;
    left: 0;
    top:0px;
   
   display: none;
}
.listCon ul li em{
    display: inline-block;
    vertical-align: middle;
    cursor: pointer;
    width: 65px;
    overflow: hidden;
    position: absolute;
    transition: all .3s;
    left: 0;
    top:1px;
    text-overflow:ellipsis;
    white-space: nowrap;
}
.checkboxShow ul li em{
    left: 15px;
}
.listCon ul li:hover em{
    width: auto;
    
    white-space :  nowrap ;
    background: #fff;
    z-index: 99;
}
.listCon ul li a{
    cursor: pointer;
    color: #333;
}
.listCon ul li a:hover{
    color: #55a8fd;
    text-decoration: none;
}
.listCon ul li.active{
    color: #55a8fd;
}
.listCon ul li.active a{
    color: #55a8fd;
}
.listCon ul li label{
    cursor: pointer;
}
.listCon ul li input{
    margin-right:4px;
}
.rightBut{
    position: absolute;
    right: 0;
    width: 180px;
    text-align: right;
    top:0;
}
.rightBut button{
    margin: 0 10px;
}
.rightBut button:hover{
    border: 1px #55a8fd solid;
    color: #55a8fd;
}
.inpuChbox{
    width: 46px;
    height: 20px;
    border: 1px #e3e3e3 solid;
    border-radius: 0;
    color: #666666;
    display:inline-block;
    font-size: 12px;
    transition: all .3s;
}
em,i{
    font-style: normal;
}
.cheboxAllSyle.active{
    border: 1px #55a8fd solid;
    color: #55a8fd;
}
.selectedAll{
    background: #f7f7f7;
    color: #55a8fd;
    font-size: 12px;
    display: inline-block;
    line-height: 20px;
    padding-left:  6px;
    border: 1px #f7f7f7 solid;
    position: relative;
    padding-right: 20px;
    box-sizing: border-box;
}
.selectedAll:hover{
    border: 1px #55a8fd solid;
    background: #fff;
}
.selectedAll span:last-of-type i{
    display: none;
}
.selectedAll .dataAll{
    display: inline-block;
    height: 20px;
    width: 20px;
    text-align: center;
    position: absolute;
    right: 0;
    top:0;    
    cursor: pointer;
}
.selectedAll:hover .dataAll{
    background: #55a8fd;
    color: #fff;
}
.queryListWord{
    height: 32px;
    border: 1px #f1f1f1 solid;
    overflow: hidden;
}
.sortCon{
    
    float: left;
}
.sortCon span{
    float:left;
    width: 80px;
    line-height: 30px;
    text-align: center;
    border-right:1px #f1f1f1 solid;
    color: #333;
    position: relative;
    cursor: pointer;
}
.sortCon span.sortWord em{
  width: 64px;
  display: block;
}
.sortCon span.sortWord i{
    left: 50%;
    margin-left:6px;
    top:0;
    color: #797979;
   position: absolute;
   
}
.sortCon span.active{
    color: #55a8fd;
}
.sortCon span.sortWord i.icon-jiantou-up{
    display: none;
}

.sortCon span.active i.icon-jiantou-lower{
    color: #55a8fd;
}
.sortCon span.sortWord.active.wordUp i.icon-jiantou-up{
    display: block;
    color: #55a8fd;
}
.sortCon span.sortWord.active.wordUp i.icon-jiantou-lower{
    display: none;
}
.checkboxCon{
    float: right;
}
.checkboxCon:hover{
  color: #e0e0e0 !important;
}
.checkboxCon .checkboxBut{
    width: 40px;
    line-height: 30px;
    color: #e0e0e0;
    border-left:1px #f1f1f1 solid;
    text-align: center;
    background: #f5f5f5;
    cursor: default;
}
.checkboxCon .checkboxBut:hover i{
    color: #e0e0e0;
}
.topPage{
    float: right;
}
.topPage span{
    border-left:1px #f1f1f1 solid;
    cursor: pointer;
    width: 40px;
    float:left;
    line-height: 30px;
    color: #9e9e9e;
    text-align: center;
}
.topPage span:hover{
    color: #55a8fd;
}
.topPage em{
    
    float:left;
    line-height: 30px;
    color: #333;
    text-align: center;
    font-size: 14px;
    margin-right: 15px;
}
.topPage em i.cloer{
    color: #fb6233;
}
.pageTop{
    width: 80px;
    overflow: hidden;
}
.tableBox .tableItem .enterpriseInfo .status.greenClass {
  color: #19c000;
  border-color: #19c000;
}
.tableBox .tableItem .enterpriseInfo .status.redClass {
  color: #ff365a;
  border-color: #ff365a;
}
.tableBox .tableItem .enterpriseInfo .status.blueClass {
  color: #40afff;
  border-color: #40afff;
}
.table {
    width: 100%;
    max-width: 100%;
    margin-bottom: 20px;
    border-top: 1px solid #f1f1f1;
    padding: 30px 200px 0;
}
.table span{
    margin-top: 30px;
    display: block;
}
textarea:focus{
  border:2px solid #9cbef5 !important;
}
.arrow:hover{
  color: #56a6fd;
  font-weight: bolder;
}
.grayColor a{
  color: gray !important;
  cursor: default !important;
}
.grayColor1:hover{
    border: 1px #e3e3e3 solid !important;
    color: #666 !important;
    cursor: default !important;
}
#disa{
  background-color: #fff;
  display: inline-block;
  width: 322px;
  height: 141px;
  margin-top: 0px !important;
}
.icon-location{
  color: #ff9400 !important;
  margin-right: 5px;
  height: 17px;
}
  .establish {
    margin: 100px auto;
    margin-left: 50%;
    transform: translateX(-17%);
  }
  .establish div:first-of-type {
   
    font-size: 15px;
    font-weight: 500;
  }
  .btnGreen {
    background-color: #67cd8c;
    border: 1px solid #63c586;
}
.btnBlue {
    background-color: #6aa8f6 !important;
    border: 1px solid #66a1ec;
}
.isMaxNum{
  position: fixed;
  bottom:38px;
  left: 626px;
  z-index: 1000;
  padding-top: 30px;
}
</style>

<style>
/* input.searchInput::-webkit-input-placeholder,
input.searchInput:-moz-placeholder,
input.searchInput::-moz-placeholder,
input.searchInput:-ms-input-placeholder {
  color: red;
} */
</style>

