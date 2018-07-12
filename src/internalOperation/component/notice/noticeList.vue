<template>
    <div class="pickInfo">
    	<div class="topTitle">
    		<p><i class="colsBlue"></i>公告管理</p>
    	</div>
            <div class="wordBlock tStyel">
                <span class="textName">公告查询：</span>
                <div>
                    <div class="search width248">
                        <input type="text" placeholder="请输入公告名称" class="inputStyle" v-model.trim="noticeName" @keyup.enter="searchAll">
                        <button class="searchBut" @click="searchAll"><i class="icon iconfont icon-sousuo" ></i></button>
                    </div>
                </div>
            </div>

        <div class="wordBlock tStyel tStyelfuw ">
            <span class="textName">公告状态：</span>
            <div class="listCon" :class="{checkboxShow: choice}" v-show="isShow">
                <ul :class="{}" id="wdtcst">
                    <li class="wti"  :class="{active:isAclass1}" @click="seLinst1()"><a>全部</a></li>
                    <li v-for="(item,index) in datalist" :key="item.index" @click="toggle(index)" :class="{active: item.checkbox}">
                        <i class="cheboxInput"></i><em><a>{{ item.name }}</a></em>
                    </li>
                </ul>
            </div>
            <div class="selected" v-show="!isShow">
                <div class="selectedAll">
                    <span v-for="seleAll in cheboxArr" :key="seleAll.index">
                        {{ seleAll }}<i>,</i>
                    </span>
                    <em class="dataAll" @click="showAll()">x</em>
                </div>
            </div>
            <div class="rightBut" v-show="isShow">
                <button v-show="isShowDuoxuan" class="inpuChbox cheboxAllSyle" @click='cheboxAll()' :class="{active: choice}">{{cheboxtext}}</button>
            </div>
        </div>
    	<div class="queryListWord">
    		<ul class="sortCon">
    			<li :class="{active:activec=='zn'}" @click="sortFun('zn')" >智能</li>
    			<li class="sortWord" :class="{active:activec=='mc','wordUp':!flagObj.mc}" @click="sortFun('mc')">
                    <em>名称</em> <i class="icon iconfont icon-jiantou-up"></i><i class="icon iconfont icon-jiantou-lower"></i>
                </li>
                <li class="sortWord" :class="{active:activec=='zt','wordUp':!flagObj.zt}" @click="sortFun('zt')">
                    <em>状态</em><i class="icon iconfont icon-jiantou-up"></i><i class="icon iconfont icon-jiantou-lower"></i>
                </li>
                <li class="sortWord" :class="{active:activec==whatTime,'wordUp1':upOrDown}">
                    <div  @click="sortFun(whatTime)">
                        <span v-show="shijian">
                            <em>时间</em>
                            <i class="icon iconfont icon-arrow-down"></i>
                        </span>
                        <span class="spanIcon" v-show="timeshow">
                            <em>{{timeInfo}}</em><i  class="icon iconfont icon-jiantou-up"></i><i  class="icon iconfont icon-jiantou-lower"></i>
                        </span>
                    </div>
                    <ol class="timeInfo">
    					<li class="fbsj" :class="{active:activec=='fb','wordUp1':!flagObj.fb}" @click="timeSortFun('fb')">
                             <em>发布时间</em><i class="icon iconfont icon-jiantou-up"></i><i class="icon iconfont icon-jiantou-lower"></i>
                        </li>
    					<li class="cjsj" :class="{active:activec=='cj','wordUp1':!flagObj.cj}" @click="timeSortFun('cj')"> 
                            <em>创建时间</em><i class="icon iconfont icon-jiantou-up"></i><i class="icon iconfont icon-jiantou-lower"></i>
                        </li>
    					<li class="qysj" :class="{active:activec=='qy','wordUp1':!flagObj.qy}" @click="timeSortFun('qy')">
                            <em>弃用时间 </em><i class="icon iconfont icon-jiantou-up"></i><i class="icon iconfont icon-jiantou-lower"></i>
                        </li>
    				</ol>
                </li>
    		</ul>
             <div v-show="pegeShow">
                    <div class="checkboxCon" v-show="checkFlag">
                        <div class="checkboxBut"></div>
                    </div>
                    <div class="topPage" v-show="checkFlag">
                        <em><i class="cloer">{{myData.pageNum}}</i>/{{Math.ceil(pageTotal/myData.pageSize)}}</em>
                        <div class="pageTop" v-show="noDataPage">
                            <span @click="goNext(-1)"><i class="icon iconfont icon-icozuola"></i></span>
                            <span @click="goNext(1)"><i class="icon iconfont icon-icozuola1"></i></span>
                        </div>
                    </div>
            </div>
    	</div>
    	 <ul :class="{nodata:!noData}" :style="{'height': !noData ? heightNub : 'auto' }">
            <li v-for="item in noticeArray" :key="item.index" class="noticeListLi">
                <div class="addrBaseInfo clearfix" :class="['state'+item.bulletin_state,priviChek(item.bulletin_state)]">
                            <div class="baseInfoLeft fl">
                                <div class="baseInfoPic draft"></div>
                                <div class="character">
                                    <p class="addr"><em class="bulletin_name" @click="toDetails(item.id)">{{item.bulletin_name}}</em></p>
                                    <div class="downLine">
                                        <p class="cjr">创建人：<ins>{{item.founder_person}}</ins></p>
                                        <p class="fbr">发布人：<ins>{{item.posted_person}}</ins></p>
                                        <p class="fbr">发布时间：<ins>{{item.release_time|dataFormat}}</ins></p>
                                        <p class="qyr">弃用人：<ins>{{item.deprecated_person}}</ins></p>
                                        <p class="qytime">弃用时间：<ins>{{item.deprecated_time|dataFormat}}</ins></p>
                                    </div>
                                </div>
                            </div>
                            <div class="baseInfoRight fr">
                                <div class="upGrade">
                                    <span class="gaoJMain">高级<em></em></span>
                                    <ol class="gaojiInfo">
                                        <!-- <li @click="selectInfoById(item.id)" class="gj_bianji">编辑</li>
                                        <li @click="toDetails(item.id)" class="gj_show">查看</li>
                                        <li @click="delInfoById(item.id)" class="gj_del">删除</li>
                                        <li @click="abandoned(item)" class="gj_qy">弃用</li>
                                        <li @click="release(item)" class="gj_fb">发布</li> -->
                                        <li @click="selectInfoById(item.id)" class="gj_bianji" v-show="priviData.edit">编辑</li>
                                        <li @click="toDetails(item.id)" class="gj_show" >查看</li>
                                        <li @click="delInfoById(item.id)" class="gj_del" v-show="priviData.delete">删除</li>
                                        <li @click="abandoned(item)" class="gj_qy" v-show="priviData.deprecated">弃用</li>
                                        <li @click="release(item)" class="gj_fb" v-show="priviData.send">发布</li>

                                    </ol>
                                </div>
                                <div class="setCheok" >
                                    <div class="setCheokCon">
                                        <div class="setDat">
                                            <div class="titles"><i class="icon iconfont icon-shijianzhongbiao"></i><em>创建时间</em> </div> 
                                            <p>{{item.created_time|dataFormat}}</p> 
                                            <p>{{item.created_time|timeFormat}}</p> 
                                        </div>  
                                        <div id="qy" class="setEsc" @click="abandoned(item)" ><button>弃用</button></div> 
                                        <div id="fb" class="setEsc" @click="release(item)" ><button>发布</button></div> 
                                        <div id="ck" class="setEsc" @click="toDetails(item.id)"><button>查看</button></div>
                                    </div>   
                                </div>
                            <div class="discarded"></div>
                        </div>
                </div>
            </li>
          </ul>
        <div class="add" @click="addNotice">
           <i class="ico iconfont icon-iconjia"></i>
        </div>
        <div class="block" v-show="noDataPage">
                <el-pagination  @size-change="handleSizeChange"  @current-change="handleCurrentChange" :current-page.sync="myData.pageNum"
                                :page-size="myData.pageSize"  layout="prev, pager, next, jumper" :total="pageTotal">
                </el-pagination>
        </div> 
    </div>
</template>
<script>
import apiToken from '../../../publicJs/apiToken.js'
import apiClient from '../../../publicJs/ApiClient.js'
import LoadingBoxService from '../../../publicJs/LoadingBoxService.js'
import UtilService from '../../../publicJs/UtilService.js'
import appPublicJs from '../../common/public.js'
import NoticeBox from '../../common/NoticeBox.js'
import TipBoxService from '../../../publicJs/TipBoxService.js'
export default {
  data () {
    return {
      myData: {
        pageSize: 10,
        pageNum: 1,
        keyWord: '',
        state: '',
        sort: 'desc',
        nameType: 'zn'
      },

      noticeName: '',
      checkbox: false,
      cheboxtext: '多选',
      checkState: 0,
      stateList: [],
      noticeArray: [],
      id: '',
      socl: false,
      choice: false, // 判断是单选还是多选
      isShow: true,
      isAclass1: true, // 控制关键词标签高亮
      cheboxArr: [], // 服务多选
      cheboxCodeArr: [],
      datalist: [], // 标签数据1
      atveSize: 0, // 知道我选中了几个标签
      isShowDuoxuan: false,

      timeInfo: '时间',
      shijian: true,
      timeshow: false,
      activec: 'zn',
      flagObj: {
        zn: false,
        mc: false,
        zt: false,
        fb: false,
        cj: false,
        qy: false,
        sj: false
      },
      pageTotal: 1, // 分页默认
      pegeShow: false, // 根据分页显示隐藏
      checkFlag: true,
      noDataPage: false, // 少于一页分页不显示fbsj
      noData: true,
      upOrDown: false,
      whatTime: 'sj',
      priviData: {
        edit: false,
        deprecated: false,
        send: false,
        delete: false
      }
    }
  },
  mounted () {
    this.priviFun()
    this.searchAll()
    this.getBulletinState()
    this.domWith()
    this.domHieg()
  },
  filters: {
    dataFormat: function (value) {
      return UtilService.formatDuring(value, 'yyyy-MM-dd')
    },
    timeFormat: function (value) {
      return UtilService.formatDuring(value, 'HH:mm:ss')
    },
    imgPath: function (value) {
      return apiClient.apiBaseUrl + appPublicJs.serviceImgShow + value
    }
  },
  methods: {
             // 分页
    goNext (n) {
      this.myData.pageNum = this.myData.pageNum + n
      if (this.myData.pageNum == 0) {
        this.myData.pageNum = 1
        return
      }
      if (this.myData.pageNum == Math.ceil(this.pageTotal / this.myData.pageSize) + 1) {
        this.myData.pageNum = Math.ceil(this.pageTotal / this.myData.pageSize)
        return
      }
    },
        // 权限
    priviFun () {
      let that = this
      apiClient.get('priviapi/auth/getAppDownMenuAndButton', {appId: 'InternalOperation'}, function (data) {
        if (data.data != null && data.data !== undefined && data.data.length !== 0) {
          for (let i = 0; i < data.data.length; i++) {
            const element = data.data[i]
            if (element.menuId == '3008') {
              let btn = element.button
              for (let a = 0; a < btn.length; a++) {
                const ele = btn[a]
                that.priviData[ele.code] = true
              }
            }
          }
        }
      })
    },
    priviChek (data) {
      if (data == '1') {
        if (this.priviData.send) {
          return 'stateflag1'
        } else {
          return 'stateflag3'
        }
      }
      if (data == '2') {
        if (this.priviData.deprecated) {
          return 'stateflag2'
        } else {
          return 'stateflag3'
        }
      }
      return 'stateflag3'
    },
    handleSizeChange () {},
    handleCurrentChange () {
      this.searchAll()
    },
         // 页面元素布局得到页面长度
    domWith () {
      var that = this
      var box = $('#wdtcst'),
        boxUlWit = box.width(),
        boxUlLi = box.find('li').outerWidth(true)
      that.texeSize = parseInt(boxUlWit / boxUlLi)
    },
        // 页面元素布局得到高度
    domHieg () {
      var that = this
      var bodyhg = document.body.clientHeight
      var pluHade = $('.publicTopNavComponent').outerHeight(true)// 公共组件高度
      var topHade = $('.conCent').outerHeight(true)// 头部高度
      var sortDm = $('.queryListWord').outerHeight(true)// 排序高度
      that.heightNub = bodyhg - pluHade - topHade - sortDm + 'px'
    },
    timeSortFun (timeType) {
      let that = this
      that.socl = true
      that.timeshow = true// 显示点击时间
      that.shijian = false// 隐藏第一次默认时间
      that.upOrDown = true// 箭头向上
      if (timeType == 'fb') {
        that.timeInfo = '发布时间'
      } else if (timeType == 'cj') {
        that.timeInfo = '创建时间'
      } else if (timeType == 'qy') {
        that.timeInfo = '弃用时间'
      }
      that.whatTime = timeType// 时间类型传给样式
      that.activec = timeType// 时间类型传给样式
      this.sortFun(timeType)
    },
        // 菜单排序查询
    sortFun (flag) {
      var that = this
             // 默认时间不触发查询
      if (flag == 'sj') {
        return
      }
      if (!that.noData) return false

      for (let key in this.flagObj) {
        if (key == flag) {
          this.flagObj[key] = !this.flagObj[key]  // 切换箭头，true向上/false向下
          this.flagObj[key] ? this.myData.sort = 'desc' : this.myData.sort = 'asc'
          this.activec = flag
        } else {
          this.flagObj[key] = false
        }
      }

      if (flag == 'zn') {
        this.myData.sort = 'desc'
      } else if (flag == 'fb') {
        that.upOrDown = !that.upOrDown
        this.activecfb = flag
      } else if (flag == 'cj') {
        that.upOrDown = !that.upOrDown
        this.activeccj = flag
      } else if (flag == 'qy') {
        that.upOrDown = !that.upOrDown
        this.activecqy = flag
      }
      this.myData.nameType = flag
      this.myData.pageNum = 1
      this.searchAll()
    },
    getBulletinState () {
      var myData = ''
      var that = this
      that.datalist = []
      apiClient.get(apiToken.newApi('/ioapi/bulletin/getStatus/'), myData).then(data => {
        if (appPublicJs.checkData(data.results)) {
          if (data.results.length > 1) {
            that.isShowDuoxuan = true
          } else {
            that.isShowDuoxuan = false
          }
          for (var i = 0; i < data.results.length; i++) {
            var obj = {
              name: data.results[i].name,
              code: data.results[i].code,
              checkbox: false
            }
            that.datalist.push(obj)
          }
        }
      }).catch(e => {
        console.error(e)
      })
    },
        // 取消重新选中
    showAll () {
      var that = this
      that.atveSize = ''
      that.isShow = true
      that.isAclass1 = true
      that.myData.pageNum = 1
      that.searchAll()
      for (var i = 0; i < that.datalist.length; i++) {
        that.datalist[i].checkbox = false
      }
    },
         // 全部服务查询
    seLinst1 () {
      var that = this
      var myData = ''
      that.active = false
      that.isAclass1 = true
      that.myData.state = ''
            // 点击全部取消其他关键词高亮
      for (var i = 0; i < that.datalist.length; i++) {
        that.datalist[i].checkbox = false
      }
      that.myData.pageNum = 1
      that.searchAll()
    },

        // 多选状态
    toggle (e) {
      var that = this
      var sArr = []
      that.isAclass1 = false
            // 如果是多选就不查询，单选就查询
      if (that.choice) {
        that.datalist[e].checkbox = !that.datalist[e].checkbox
        for (var i = 0; i < that.datalist.length; i++) {
          if (that.datalist[i].checkbox) {
            sArr.push(that.datalist[i].name)
            that.atveSize = sArr.length
          } else {

          }
        }
      } else {
        for (var i = 0; i < that.datalist.length; i++) {
          that.datalist[i].checkbox = false
        }
        that.datalist[e].checkbox = true
        that.myData.state = ''
        that.myData.state = that.datalist[e].code
        that.myData.pageNum = 1
        that.searchAll()
      }
      console.info('状态', that.datalist)
    },
         // 多选标签确定
    cheboxAll () {
      var that = this
      var sty = ''
      that.cheboxArr = []
      that.cheboxCodeArr = []
      for (var i = 0; i < that.datalist.length; i++) {
        if (that.datalist[i].checkbox) {
          that.cheboxArr.push(that.datalist[i].name)
          that.cheboxCodeArr.push(that.datalist[i].code)
        }
      }
      that.choice = true
      console.info('多选状态', that.cheboxArr)
      for (var i = 0; i < that.cheboxCodeArr.length; i++) {
        if (i < (that.cheboxCodeArr.length - 1)) {
          that.cheboxCodeArr[i] ? sty += that.cheboxCodeArr[i] + ',' : ''
        } else {
          that.cheboxCodeArr[i] ? sty += that.cheboxCodeArr[i] : ''
        }
      }

            // 多选查询
      if (that.cheboxtext == '确定') {
        console.info('进来了', that.atveSize)
                // 如果多选状态下没有选中就当取消
        if (that.atveSize <= 0) {
          that.cheboxtext = '多选'
          that.choice = false
          return false
        }
                // 如果多选状态下没有选中1一个就走单选
        if (that.atveSize == 1) {
          console.info('只能选中一个')
          that.cheboxtext = '多选'
          that.choice = false
          that.myData.state = ''
          that.myData.state = sty
          that.myData.pageNum = 1
          that.searchAll()
          return false
        } else {
          console.info('1个进来了', that.atveSize)
        }
        that.isShow = false
        that.cheboxtext = '多选'
        that.choice = false
        that.myData.state = ''
        that.myData.state = sty
        that.searchAll()
        return false
      } else {
        that.cheboxArr = []
      }
      that.cheboxtext = '确定'
    },
    searchAll () {
      var that = this
      if (that.noticeName != '') {
        that.myData.keyWord = that.noticeName
        this.showNoticeInfo(that.myData)
      } else {
        that.myData.keyWord = ''
        this.showNoticeInfo(that.myData)
      }
    },

    showNoticeInfo (myData) {
      var that = this
      that.noticeArray = []
      LoadingBoxService.open('加载中...')
      apiClient.get(apiToken.newApi('/ioapi/bulletin/getBulletinList/'), myData).then(data => {
        LoadingBoxService.close()
        that.noData = true
        if (appPublicJs.checkData(data.data)) {
          that.noticeArray = data.data
          console.log(2223, that.noticeArray, that.priviData)

          that.pageTotal = data.total
          if (that.pageTotal > 1) {
            that.pegeShow = true
          } else {
            that.pegeShow = false
          }
                            // 判断如果内容长度小于一页不显示分页
          if (that.myData.pageSize >= data.total) {
            that.noDataPage = false
          } else {
            that.noDataPage = true
          }
        } else {
          that.noData = false
          that.pegeShow = false
          return false
        }
      }).catch(e => {
        console.error(e)
      })
    },

    selectInfoById (id) {
      var that = this
      that.$router.push({name: 'addNotice', query: {id: id, priviFlag: this.priviData.send}})
    },

    addNotice () {
      var that = this
      that.$router.push({name: 'addNotice', query: {id: that.id, priviFlag: this.priviData.send}})
    },
    toDetails (id) {
      var that = this
      that.$router.push({name: 'noticeDetails', query: {id: id}})
    },
    delInfoById (id) {
      var that = this
      var myData = {
        'id': id
      }
      let sure = function () {
        apiClient.delete(apiToken.newApi('/ioapi/bulletin/deleteBulletinById/'), myData).then(data => {
          NoticeBox.close()
          if (data.status == true) {
            TipBoxService.open('删除公告成功', 0)
            that.searchAll()
          } else {
            TipBoxService.open('删除公告失败', 2)
          }
        }).catch(e => {
          console.error(e)
        })
      }
      NoticeBox.open('是否删除所选内容，删除后将无法撤回！', '', sure)
    },
    abandoned (item) {
      var that = this
      var myData = {
        'id': item.id,
        'state': '3'
      }
      let sure = function () {
        apiClient.get(apiToken.newApi('/ioapi/bulletin/updateBulletinState/'), myData).then(data => {
          NoticeBox.close()
          if (data.status == true) {
            TipBoxService.open('该公告已弃用', 0)
            that.searchAll()
          } else {
            TipBoxService.open('弃用失败', 2)
          }
        }).catch(e => {
          console.error(e)
        })
      }
      NoticeBox.open('是否弃用所选内容，弃用后将无法恢复', 'abandan', sure)
    },

    release (item) {
      var that = this
      var myData = {
        'id': item.id,
        'state': '1'
      }
      let sure = function () {
        apiClient.get(apiToken.newApi('/ioapi/bulletin/updateBulletinState/'), myData).then(data => {
          NoticeBox.close()
          if (data.status == true) {
            TipBoxService.open('该公告已发布', 0)
            that.searchAll()
          } else {
            TipBoxService.open('发布失败', 2)
          }
        }).catch(e => {
          console.error(e)
        })
      }
      NoticeBox.open('是否要发布所选内容?', 'publish', sure)
    }

  }
}
</script>
<style src="../../css/notice.css" scoped></style>
