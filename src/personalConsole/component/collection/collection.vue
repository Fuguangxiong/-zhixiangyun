<template>
    <div class="collection">
        <!-- 栏目位置-->
        <div class="conCent">
            <div class="rise">
                <span class="textTlie">收藏管理</span>   
            </div>
            <div class="wordBlock tStyel">
                <span class="textName">服务名称：</span>
                <div>
                    <div class="search width248">
                        <input type="text" placeholder="请输入服务名称" class="inputStyle" v-model="myData.serviceName" @keyup.enter="searchEva">
                        <button class="searchBut"  @click="searchEva"><i class="icon iconfont icon-sousuo" ></i></button>
                    </div>
                </div>
            </div>
            <div class="wordBlock tStyel tStyelfuw ">
                <span class="textName">服务状态：</span>
                 <div class="listCon" :class="{checkboxShow: choicest}" v-show="isShowst">
                    <ul>
                        <li class="wti"  :class="{active:isAclass}" @click="seLinst()"><a>全部</a></li>
                       <li v-for="(fwzt,index) in dataliststat"  @click="togglestate(index,fwzt.DICT_KEY)" :class="{active: fwzt.checkbox}" v-if='fwzt.DICT_KEY=="1"||fwzt.DICT_KEY=="3"||fwzt.DICT_KEY=="4"' :key="index"><i class="cheboxInput"></i><em ><a>{{ fwzt.DICT_VALUE }}</a></em></li>
                    </ul>
                </div>
                <!-- v-show="isShowBut" -->
                <div class="rightBut" style="display: none">
                    
                    <button class="inpuChbox cheboxAllSyle" @click='cheboxAllstate()' :class="{active: choicest}">{{cheboxtextst}}</button>
                </div>
                
            </div>
            <div class="wordBlock tStyel tStyelfuw ">
                <span class="textName">服务标签：</span>
                <div class="listCon" :class="{checkboxShow: choice}" v-show="isShow">
                    <ul :class="{heiauto: moredm}" id="wdtcst">
                        <li class="wti"  :class="{active:isAclass1}" @click="seLinst1()"><a>全部</a></li>
                        <li v-for="(item,index) in datalist" @click="toggle(index)" :class="{active: item.checkbox}"><i class="cheboxInput"></i><em><a>{{ item.name }}</a></em></li>
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
                    <button  v-show="isShowText" class="inpuChbox moreSytle" @click='moreAll()' :class="{active: moredm}"><i class="icon iconfont icon-arrow-down"></i><i class="icon iconfont icon-arrow-down-copy"></i>{{moretexe}}</button>
                    <button v-show="isShowDuoxuan" class="inpuChbox cheboxAllSyle" @click='cheboxAll()' :class="{active: choice}">{{cheboxtext}}</button>
                </div>
                
            </div>
        </div>
        <!-- ／栏目位置 -->
        <div class="queryList">
            <div class="queryListWord">
                <div class="sortCon">
                    <span :class="{active:activec=='zn'}" @click="sortFun('zn')">智能</span>
                    <span class="sortWord" :class="{active:activec=='mc','wordUp':!flagObj.mc}" @click="sortFun('mc')"><em>名称</em><i class="icon iconfont icon-jiantou-up"></i><i class="icon iconfont icon-jiantou-lower"></i></span>
                    <span class="sortWord" :class="{active:activec=='pf','wordUp':!flagObj.pf}" @click="sortFun('pf')"><em>好评</em><i class="icon iconfont icon-jiantou-up"></i><i class="icon iconfont icon-jiantou-lower"></i></span>
                    <span class="sortWord" :class="{active:activec=='zt','wordUp':!flagObj.zt}" @click="sortFun('zt')"><em>状态</em><i class="icon iconfont icon-jiantou-up"></i><i class="icon iconfont icon-jiantou-lower"></i></span>
                    <span class="sortWord" :class="{active:activec=='sj','wordUp':!flagObj.sj}" @click="sortFun('sj')"><em>时间</em><i class="icon iconfont icon-jiantou-up"></i><i class="icon iconfont icon-jiantou-lower"></i></span>
                </div>
                <div v-show="pegeShow">
                <div class="checkboxCon" v-show="checkFlag">
                    <div class="checkboxBut" @click="checkMore"><i class="icon iconfont icon-caozuo"></i></div>
                </div>
                 <div class="topPage" v-show="checkFlag">
                      <em><i class="cloer">{{myData.pageNum}}</i>/{{Math.ceil(pageTotal/myData.pageSize)}}</em>
                      <div class="pageTop" v-show="noDataPage">
                        <span @click="goNext(-1)"><i class="icon iconfont icon-icozuola"></i></span>
                        <span @click="goNext(1)"><i class="icon iconfont icon-icozuola1"></i></span>
                      </div>
                  </div>
                <div class="more" v-show="!checkFlag">
                    <div class="sure" @click="surelFun">删除</div>
                    <div class="cancel" @click="cancelFun">取消</div>
                </div>
                </div>
            </div>
            <div class="listCon" :class="{nodata:!noData}" :style="{'height': !noData ? heightNub : 'auto' }">
                <div class="listLi" :class={evaluationLiFlag:!checkFlag}  v-for="(item,index) in listArry">
                   
                    <div :class="[item.service_status==3 ? 'corner' :'normal']">
                         <div class="inpuRiog" v-show="!checkFlag" @click.stop="toCheckBox(index)"></div>
                    <div class="listLiLeft">
                       <dl>
                           <dd><b class="classmona"></b><span class="porAlik" @click="toServiceDetails(item.server_id,item.service_status,item.up_down_status)"><img v-lazy="imgSrc[index]" alt="" ></span><i class="corner"></i></dd>
                           <dt>
                               <h2 > <span class="porAlik" @click="toServiceDetails(item.server_id,item.service_status,item.up_down_status)">{{item.name}}</span></h2>
                            
                               <h3>标签：<span v-for="biq in tagArry[index]">{{biq}}<i>,</i></span></h3>
                               <p>服务介绍:{{item.service_brief}}</p>
                           </dt>
                       </dl>
                      
                       <div class="score">
                           <div class="scoreCon">
                           <p class="pinfen">评分：<em class="fsClor"> {{item.avg|getFloat}}</em></p>
                            <div class="xingxingCon">
                                 <!-- <i class="icon iconfont icon-xing1-copy"></i>
                                <i class="icon iconfont icon-xing1-copy"></i>
                                <i class="icon iconfont icon-xing1-copy"></i>
                                <i class="icon iconfont icon-xing1-copy"></i>
                                <i class="icon iconfont icon-xing1-copy"></i>
                                <div class="xingIcon">
                                    <i class="icon iconfont icon-xing1" v-for="n in parseInt(item.avg)"></i>
                                </div> -->
                                <el-rate
                                        v-model="item.avg" disabled disabled-void-color="#ccc" :colors="colorRrry" disabled-void-icon-class="icon iconfont icon-xing1-copy">
                                </el-rate>
                                                                    </div>
                           </div>
                       </div>
                    </div>
                    <div class="setCheok" >
                        <div class="setCheokCon">
                            <div class="setDat">
                                <div class="titles"><i class="icon iconfont icon-shijianzhongbiao"></i><em>收藏时间</em> </div> 
                                <p>{{item.created_time|dataFormat}}  </p> 
                                <p>{{item.created_time|timeFormat}}</p> 
                            </div>  
                            <div class="checkItem" v-show="!checkFlag" @click.stop="toCheckBox(index)">
                                <div class="centr">
                                    <i class="icon iconfont icon-duigou" v-show="checkBox[index].flag"></i>
                                </div>
                            </div>
                            <div class="setEsc" @click="setEsc(item.id)"><button>取消收藏</button></div> 
                        </div>   
                    </div>
                </div>
                </div>
                
            </div>
        </div>
         <div class="block" v-show="noDataPage">
                <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page.sync="myData.pageNum"
                :page-size="myData.pageSize"
                layout="prev, pager, next, jumper"
                :total="pageTotal">
                </el-pagination>
        </div> 
        
    </div>
    
</template>
<script>
import NoticeBox from '../../../publicJs/NoticeBoxService'
import userService from '../../../publicJs/userService.js'
import apiToken from '../../../publicJs/apiToken.js'
import apiClient from '../../../publicJs/ApiClient.js'
import LoadingBoxService from '../../../publicJs/LoadingBoxService.js'
import UserCookieService from '../../../publicJs/UserCookieService.js'
import UtilService from '../../../publicJs/UtilService.js'
import publicPathConfig from '../../../publicJs/publicPathConfig.js'
import appPublicJs from '../../common/public.js'
import TipBoxService from '../../../publicJs/TipBoxService.js'
export default {
  name: 'collection',
  data () {
    return {
      activec: 'zn',
      texeSize: 0, // 标签数量
      checkFlag: true,
      active: 0,
      colorRrry: ['#ff9400', '#ff9400', '#ff9400'],
      choicest: false, // 判断是单选还是多选状态
      choice: false, // 判断是单选还是多选
      moredm: false, // 更多
      cheboxdm: false, // 多选
      listArry: [], // 列表查询
      cheboxArr: [], // 服务多选
      cheboxArrstatus: [], // 状态多选
      checkBox: [],
      moretexe: '更多',
      cheboxtext: '多选',
      cheboxtextst: '多选',
      tagArry: [],
      tagArryLn: [],
      flagObj: {
        mc: false,
        pf: false,
        zt: false,
        sj: false
      },
      myData: {
        serviceName: "", // 搜索
        serviceTag: "", // 服务标签
        servicetSatus: "", // 服务状态
        sort: "asc",
        sortType: "zn",
        pageSize: 10,
        pageNum: 1
      },
      atveSize: 0, // 知道我选中了几个标签
      isAclass1: true, // 控制关键词标签高亮
      isAclass: true, // 控制关键词状态高亮
      pageTotal: 1, // 分页默认
      isShow: true,
      isShowst: true,
      isShowDuoxuan: false,
      isShowText: false,
      noData: true,
      noDataPage: false, // 少于一页分页不显示
      heightNub: 100, // 未查询到数据显示dome 的默认高度
      pegeShow: false, // 根据分页显示隐藏
      isShowBut: true, // 栏目一右边按钮控制
      datalist: [], // 标签数据1
      dataliststat: [], // 标签数据2
      searSize: true,
      imgSrc:[]
    }
  },
  created () {
    this.LabelText(); // 请求标签
    this.servicetagsText(); // 请求标签2
    this.getList();
    this.tokenId = this.$route.query.tokenId || userService.getTokenId()
    if (this.tokenId != undefined) {
      var that = this;
      UserCookieService.userInfoToCookie(this.tokenId, function (
        userName,
        images
      ) {})
    }
  },
  filters: {
    dataFormat: function (value) {
      return UtilService.formatDuring(value, 'yyyy-MM-dd')
    },
    timeFormat: function (value) {
      return UtilService.formatDuring(value, 'HH:mm:ss')
    },
    getFloat: function (number) { 
    return number=parseFloat(number).toFixed(1);
    },
  },
  mounted () {
    this.domWith();
    this.domHieg();
  },
  methods: {
    handleCurrentChange () {
      this.getList();
    },
    handleSizeChange () {},
    // 全部状态查询
    seLinst () {
      var that = this;
      var myData = '';
      that.active = false;
      that.isAclass = true;
      that.myData.servicetSatus = '';
      // 点击全部取消其他关键词高亮
      for (var i = 0; i < that.dataliststat.length; i++) {
        that.dataliststat[i].checkbox = false;
      }
      that.myData.pageNum = 1;
      that.getList();
    },
    // 全部服务查询
    seLinst1 () {
      var that = this;
      var myData = '';
      that.active = false;

      that.isAclass1 = true;
      that.myData.serviceTag = '';
      // 点击全部取消其他关键词高亮
      for (var i = 0; i < that.datalist.length; i++) {
        that.datalist[i].checkbox = false;
      }

      that.myData.pageNum = 1
      that.getList()
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
            sArr.push(that.datalist[i].name);
            that.atveSize = sArr.length;
          } else {
          }
        }
      } else {
        for (var i = 0; i < that.datalist.length; i++) {
          that.datalist[i].checkbox = false;
        }
        that.datalist[e].checkbox = true;
        that.myData.serviceTag = that.datalist[e].name;
        that.myData.pageNum = 1;
        that.getList();
      }
      console.info('dsds', that.datalist)
    },
    // 多选标签确定
    cheboxAll () {
      var that = this;
      var sty = '';
      for (var i = 0; i < that.datalist.length; i++) {
        if (that.datalist[i].checkbox) {
          that.cheboxArr.push(that.datalist[i].name);
        }
      }
      that.choice = true;
      console.info('bq', that.cheboxArr)
      for (var i = 0; i < that.cheboxArr.length; i++) {
        that.cheboxArr[i] ? (sty += that.cheboxArr[i] + ',') : ''
      }

      // 多选查询
      if (that.cheboxtext == '确定') {
        console.info('进来了', that.atveSize)
        // 如果多选状态下没有选中就当取消
        if (that.atveSize <= 0) {
          that.cheboxtext = '多选';
          that.choice = false;
          return false
        }
        // 如果多选状态下没有选中1一个就走单选
        if (that.atveSize == 1) {
          console.info('只能选中一个')
          that.cheboxtext = '多选';
          that.choice = false;
          that.myData.serviceTag = sty
          that.myData.pageNum = 1
          that.getList()
          return false
        } else {
          console.info('1个进来了', that.atveSize)
        }
        that.isShow = false;
        that.cheboxtext = '多选';
        that.choice = false;
        that.myData.serviceTag = sty;
        that.myData.pageNum = 1;
        that.getList();
        return false;
      } else {
        that.cheboxArr = [];
      }
      that.cheboxtext = '确定';
    },
    // 多选状态
    togglestate (e,a) {
      var that = this;
      that.isAclass = false;

      if (that.choicest) {
        that.dataliststat[e].checkbox = !that.dataliststat[e].checkbox;
      } else {
        for (var i = 0; i < that.dataliststat.length; i++) {
          that.dataliststat[i].checkbox = false;
        }
        that.dataliststat[e].checkbox = true;
      }

      that.myData.serviceStatus = a
      that.myData.pageNum = 1
      that.getList()
    },
    // 多选
    cheboxAllstate () {
      var that = this
      that.cheboxArrstatus = []
      for (var i = 0; i < that.dataliststat.length; i++) {
        if (that.dataliststat[i].checkbox) {
          that.cheboxArrstatus.push(that.dataliststat[i].name)
        }
      }

      that.choicest = true

      if (that.cheboxtextst == '确定') {
        that.isShowst = false
        that.cheboxtextst = '多选'
        that.choicest = false
        return false
      }
      that.cheboxtextst = '确定'
    },
    // 分页
    goNext (n) {
      this.myData.pageNum = this.myData.pageNum + n
      if (this.myData.pageNum == 0) {
        this.myData.pageNum = 1
        return
      }
      if (
        this.myData.pageNum ==
        Math.ceil(this.pageTotal / this.myData.pageSize) + 1
      ) {
        this.myData.pageNum = Math.ceil(this.pageTotal / this.myData.pageSize)
        return
      }
    },
    // 更多
    moreAll () {
      var that = this
      that.moredm = !that.moredm
      if (that.moredm) {
        that.moretexe = '收起'
      } else {
        that.moretexe = '更多'
      }
    },
    // 取消重新选中
    showAll () {
      var that = this
      that.atveSize = ''
      that.isShow = true
      that.isAclass1 = true
      that.myData.serviceTag = ''
      that.myData.pageNum = 1
      that.getList()
      for (var i = 0; i < that.datalist.length; i++) {
        that.datalist[i].checkbox = false
      }
    },
    // 设置多选删除
    toCheckBox (index) {
      this.checkBox[index].flag = !this.checkBox[index].flag

      // this.$set(this.checkBox[index],"flag",!this.checkBox[index].flag);
    },
    // 菜单排序查询
    sortFun (flag) {
      var that = this
      if (!that.noData) return false
      for (let key in this.flagObj) {
        if (key == flag) {
          this.flagObj[key] = !this.flagObj[key]
          this.flagObj[key]
            ? (this.myData.sort = 'desc')
            : (this.myData.sort = 'asc')
        } else {
          this.flagObj[key] = false
        }
      }
      this.activec = flag
      this.myData.sortType = flag
      this.myData.pageNum = 1
      this.getList()
    },
    checkMore () {
      this.checkFlag = false
      for (let i = 0; i < this.checkBox.length; i++) {
        this.$set(this.checkBox[i], 'flag', true)
      }
    },
    // 取消批量删除
    cancelFun () {
      this.checkFlag = true
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
      var pluHade = $('.publicTopNavComponent').outerHeight(true) // 公共组件高度
      var topHade = $('.conCent').outerHeight(true) // 头部高度
      var sortDm = $('.queryListWord').outerHeight(true) // 排序高度

      that.heightNub = bodyhg - pluHade - topHade - sortDm + 'px'
    },
    // 搜索
    searchEva () {
      if (this.searSize) {
        if (this.myData.serviceName == '') return false

        this.searSize = false
        this.listArry = []
        this.getList()
      } else {
        this.searSize = true
        this.listArry = []
        this.getList()
      }
    },
    // 状态标签请求
    LabelText () {
      var myData = ''
      var that = this
      that.dataliststat = []
      apiClient.get(
        apiToken.newApi('/pcapi/store/servicestatus/'),
        myData,
        function (data) {
          if (data.results.length <= 1) {
            that.isShowBut = false
          } else {
            that.isShowBut = true
          }
          that.dataliststat=data.results.list
          console.log(that.dataliststat,222)
        }
      )
    },
    // 标签请求2
    servicetagsText () {
      var myData = ''
      var that = this
      that.datalist = []
      apiClient.get(
        apiToken.newApi('/pcapi/store/servicetags/'),
        myData,
        function (data) {
          console.info('lala2', data.results)
          if (data.results.length > 1) {
            that.isShowDuoxuan = true
          } else {
            that.isShowDuoxuan = false
          }
          for (var i = 0; i < data.results.length; i++) {
            var obj = {
              name: data.results[i],
              checkbox: false
            }
            that.datalist.push(obj)
          }

          if (that.texeSize > that.datalist.length) {
            that.isShowText = false
          } else {
            that.isShowText = true
          }
        }
      )
    },
    // 列表
    getList () {
      let that = this
      LoadingBoxService.open('加载中...')
      apiClient.get(
        apiToken.newApi('/pcapi/store/liststoreservice/'),
        that.myData,
        function (data) {
          LoadingBoxService.close()
          that.imgSrc=[]
          that.tagArry = []
          that.noData = true
          that.servicestatus = data.results.service_status
          that.listArry = data.results.data
          that.pageTotal = data.results.total
          if (that.pageTotal >= 1) {
            that.pegeShow = true
          } else {
            that.pegeShow = false
          }
          // 判断如果内容长度小于一页不显示分页
          if (that.myData.pageSize >= that.pageTotal) {
            that.noDataPage = false
          } else {
            that.noDataPage = true
          }
          //  没有数据
          if (data.results.data.length == 0) {
            that.noData = false
            that.pegeShow = false
            return false
          }

          that.listArry.forEach(element => {
            var avg = element.avg
            if (avg.length == 1) {
              element['avg'] = avg + '.0'
            }

            that.checkBox.push({ flag: true, id: element.id })
            that.tagArry.push(JSON.parse(element.service_tag))
            that.imgSrc.push(apiClient.apiBaseUrl + appPublicJs.serviceImgShow + element.img)
          })
        }
      )
    },
    // 取消收藏
    setEsc (id) {
      var that = this
      console.info('asas', that.checkBox)
      let sure = function () {
        apiClient.delete(
          apiToken.newApi('/pcapi/store/deletestoreservice/'),
          { id: id },
          function (data) {
            NoticeBox.close()

            that.isShow = true
            that.isAclass1 = true
            that.servicetagsText()
            that.LabelText()
            TipBoxService.open('取消成功', 0)

            that.checkFlag = true
            that.myData.pageNum = 1
            that.getList()
          }
        )
      }
      NoticeBox.open('是否取消收藏，取消后将无法撤回！', sure)
    },
    // 删除批量
    surelFun () {
      let id = ''
      this.checkBox.forEach(element => {
        element.flag ? (id += element.id + ',') : ''
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
    toServiceDetails (id, st,upAndDown) {
      if (upAndDown==0) {
        TipBoxService.open("该服务已下架",2)
        return
      }
      if (st == 3) {
        return false
      } else {
        window.open(
          publicPathConfig.APP_MARKET + '#/appServiceDetail?id=' + id
        )
      }
    }
  }
}
</script>
<style src="../../css/collection.css" scoped></style>

