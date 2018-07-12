<template>
    <div class="evaluation">
        <div class="conCent">
            <div class="rise">
                <span class="textTlie">评价管理</span>   
            </div>
            <div class="forHeight" :class="[choseFlag?'short':'long',foldingFlag?'':'mini']">
              <div class="wordBlock tStyel">
                  <span class="textName">筛选条件：</span>
                  <div class="textleft">
                      <span class="icon iconfont " :class="[choseFlag?'active':'',choseFlag?'icon-xuanzhong2':'icon-weixuanzhong1']" @click="chose(true)">&nbsp;&nbsp;基础</span>
                      <span class="icon iconfont " @click="chose(false)" :class="[choseFlag?'':'active',choseFlag?'icon-weixuanzhong1':'icon-xuanzhong2']"> &nbsp;&nbsp;高级</span>
                  </div>
              </div>
              <div class="wordBlock tStyel">
                  <span class="textName">服务名称：</span>
                  <div>
                      <div class="search width248">
                          <input type="text" placeholder="请输入服务名称" class="inputStyle" v-model="myData.serviceName" >
                          <!-- <button class="searchBut"><i class="icon iconfont icon-sousuo"  ></i></button> -->
                      </div>
                  </div>
              </div>
              <div class="wordBlock tStyel">
                  <span class="textName">用户名称：</span>
                  <div>
                      <div class="search width248">
                          <input type="text" placeholder="请输入用户名称" class="inputStyle"  v-model="myData.userName">
                          <!-- <button class="searchBut"><i class="icon iconfont icon-sousuo" ></i></button> -->
                      </div>
                  </div>
              </div>
              <div class="wordBlock tStyel">
                  <span class="textName">服务评分：</span>
                  <div class="textleft">
                     <span class="scope" v-for="(item,index) in serverScoreData"  @click="serverScore(index)" :class="{active:item.flag}">{{item.value}}</span>
                      <span class="nomall">自定义&nbsp;&nbsp;</span>
                    <input type="number"  max="5" min="0" placeholder="请输入评分" class="inputSmall" v-model="scropeServer[0]" @focus="serverInputBlur" @blur="servercheck('scropeServer')"/><i>--</i>
                      <input type="number"  max="5" min="0" placeholder="请输入评分" class="inputSmall" v-model="scropeServer[1]" @focus="serverInputBlur"  @blur="servercheck('scropeServer')"/>
                      <i class="checkmsg" v-show="scropeServerflag">评分范围0-5</i>
                  </div>
              </div>
              <div class="wordBlock tStyel">
                  <span class="textName">企业名称：</span>
                  <div>
                      <div class="search width248">
                          <input type="text" placeholder="请输入企业名称" class="inputStyle" v-model="myData.enterpriseName">
                          <!-- <button class="searchBut"><i class="icon iconfont icon-sousuo" ></i></button> -->
                      </div>
                  </div>
              </div>
              <div class="wordBlock tStyel">
                  <span class="textName">手机号码：</span>
                  <div>
                      <div class="search width248">
                          <input type="number" placeholder="请输入手机号码" class="inputStyle" v-model="myData.phone">
                          <!-- <button class="searchBut"><i class="icon iconfont icon-sousuo" ></i></button> -->
                      </div>
                  </div>
              </div>
              <div class="wordBlock tStyel">
                  <span class="textName">个人评分：</span>
                  <div class="textleft">
                    <span class="scope" v-for="(item,index) in userScoreData"  @click="userScore(index)" :class="{active:item.flag}">{{item.value}}</span>
                      <span class="nomall">自定义&nbsp;&nbsp;</span>
                      <input type="number" placeholder="请输入评分" class="inputSmall" v-model="scropeUser[0]" @focus="userInputBlur" @blur="servercheck('scropeUser')"/><i>--</i>
                      <input type="number" placeholder="请输入评分" class="inputSmall" v-model="scropeUser[1]" @focus="userInputBlur" @blur="servercheck('scropeUser')"/>
                       <i class="checkmsg" v-show="scropeUserflag">评分范围0-5</i>
                  </div>
              </div>
              <div class="wordBlock tStyel">
                  <span class="textName">时间范围：</span>
                  <div class="eva">
                      <el-select v-model="valueTime" placeholder="请选择" size="small" popper-class="eval" @change="timeChange">
                      <el-option
                        v-for="item in options2"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                        :disabled="item.disabled">
                      </el-option>
                    </el-select>
                     <span  v-show="timeFlag">
                        <span class="timer">选择时间：</span>  
                        <el-date-picker
                          v-model="beginvalue"
                          type="date"
                          placeholder="选择日期" @change="beginFun"  value-format="ms">
                        </el-date-picker>
                        <span class="">-----</span>  
                        <el-date-picker
                          v-model="endvalue"
                          type="date"
                          placeholder="选择日期" :picker-options="pickerOptions1" @change="endFun" value-format="ms">
                        </el-date-picker>
                      </span>
                      <i class="checkmsg" v-show="beginvalueflag">时间范围为一年</i>
                  </div>
                
              </div>
            </div>
            <div class="sureBox" :class="[foldingFlag?'':'suremini']">
                <span class="sureIcon" @click="folding"><i class="icon iconfont icon-down-copy-copy"></i></span><span class="sure" v-show="foldingFlag" @click="searchEva">确认</span>
            </div>
        </div>
        <div class="evaluationListBox" :class="{nodata:!noData}">  
            <div class="queryListWord">
                <div class="sortCon">
                    <span class="" :class="{active:active=='zn'}" @click="sortFun('zn')">智能</span>
                    <span class="sortWord" :class="{active:active=='mc','wordUp':!flagObj.mc}" @click="sortFun('mc')"><em>名称</em><i class="icon iconfont icon-jiantou-up"></i><i class="icon iconfont icon-jiantou-lower"></i></span>
                    <span class="sortWord" :class="{active:active=='hp','wordUp':!flagObj.hp}" @click="sortFun('hp')"><em>好评</em><i class="icon iconfont icon-jiantou-up"></i><i class="icon iconfont icon-jiantou-lower"></i></span>
                    <span class="sortWord" :class="{active:active=='sj','wordUp':!flagObj.sj}" @click="sortFun('sj')"><em>时间</em><i class="icon iconfont icon-jiantou-up"></i><i class="icon iconfont icon-jiantou-lower"></i></span>
                </div>
                <div class="" v-show="noData">
                  <div class="checkboxCon" v-show="checkFlag">
                      <div class="checkboxBut" @click="checkMore"><i class="icon iconfont icon-caozuo"></i></div>
                  </div>
                  <div class="topPage" v-show="checkFlag">
                      <em><i class="cloer">{{myData.pageNum}}</i>/{{Math.ceil(pageTotal/myData.pageSize)}}</em>
                      <div class="topPage" v-show="numData">
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
            <div class="evaluationLi" :class={evaluationLiFlag:checkFlag} v-for="(item,index) in listArry">
                <div class="userInfo">
                    <div class="userImg">
                        <img :src="userImgPath[index]" alt="" >
                    </div>
                    <div class="username">{{item.USER_NAME}}</div>
                    <div class="userscope">评分：<i>{{item.SCORE|scoreDo}}</i></div>
                    <div class="xingbox">
                        <div class="xingxingCon">
                            <i class="icon iconfont icon-xing1-copy"></i>
                            <i class="icon iconfont icon-xing1-copy"></i>
                            <i class="icon iconfont icon-xing1-copy"></i>
                            <i class="icon iconfont icon-xing1-copy"></i>
                            <i class="icon iconfont icon-xing1-copy"></i>
                            <div class="xingIcon">
                                <i class="icon iconfont icon-xing1" v-for="n in parseInt(item.SCORE>=0?item.SCORE:0)"></i>
                            </div>
                        </div>
                    </div> 
                </div>
                <div class="conTent">
                    <div class="evaConet">
                        {{item.estimate_desc}}
                    </div>
                    <div class="serInfo">
                        <div class="serImg" @click="toServiceDetails(item.server_id,item.up_down_status)">
                            <img alt=""  v-lazy="imgSrc[index]">
                            <!-- <img src="../../images/24.png" alt=""> -->
                        </div>
                        <div class="serCont">
                            <div class="sername">
                                <span @click="toServiceDetails(item.server_id,item.up_down_status)">{{item.name}}</span>
                                <i class="icon iconfont icon-41">&nbsp;&nbsp;{{item.visite_count}}</i>
                            </div>
                            <div class="tag">
                                标签：<span v-for="tag in tagArry[index]">{{tag}}<i>，</i></span>
                            </div>
                            <div class="introduce">
                                服务介绍：<span>{{item.service_brief}}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="timer" v-show="checkFlag">
                    <div class="titles"><i class="icon iconfont icon-shijianzhongbiao"></i><em>评价时间</em> </div> 
                        <p>{{item.ESTIMATE_DATE|dataFormat}}  </p> 
                        <p>{{item.ESTIMATE_DATE|timeFormat}}</p> 
                </div>
                <div class="checkItem" v-show="!checkFlag" @click.stop="toCheckBox(index)">
                    <div class="centr" >
                        <i class="icon iconfont icon-duigou" v-show="checkBox[index].flag"></i>
                    </div>
                </div>
                <div class="detele" @click="deleteList(item.ESTIMATE_ID)">
                    <i class="icon iconfont icon-shanchu"></i>
                    <p>删除评论</p>
                </div>
            </div>
             <div class="block" v-if="noData" v-show="numData">
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
    </div>
</template>
<script>
import NoticeBox from '../../common/NoticeBox.js';
import userService from '../../../publicJs/userService.js';
import apiToken from '../../../publicJs/apiToken.js';
import apiClient from '../../../publicJs/ApiClient.js';
import LoadingBoxService from '../../../publicJs/LoadingBoxService.js';
import UserCookieService from '../../../publicJs/UserCookieService.js';
import UtilService from '../../../publicJs/UtilService.js';
import publicPathConfig from '../../../publicJs/publicPathConfig.js';
import appPublicJs from '../../common/public.js';
import TipBoxService from '../../../publicJs/TipBoxService.js';
import Util from '../../../publicJs/Util.js'
export default {
  name: 'evaluation',
  data () {
    return {
      pickerOptions1: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          }
      },
      choseFlag: true,
      foldingFlag: true,
      timeFlag: false,
      options2: [
        {
          value: 7,
          label: '近一个星期的申请'
        },
        {
          value: 90,
          label: '近三个月的申请'
        },
        {
          value: 180,
          label: '近半年的申请'
        }, {
          value: 'years',
          label: '今年内的申请'
        } , {
          value: 'zdy',
          label: '自定义时间'
        }
      ],
      numData: true,
      beginvalue: '',
      endvalue: '',
      beginvalueflag: false,
      valueTime: '',
      checkFlag: true,
      active: 'zn',
      noData: true,
      flagObj: {
        mc: false,
        hp: false,
        sj: false
      },
      imgSrc: [],
      listId: [],
      checkBox: [],
      serviceName: '',
      myData: {
        serviceName: '',
        sort: 'desc',
        sortType: 'zn',
        phone: '',
        userName: '',
        personMinScore: '',
        personMaxScore: '',
        avgMinScore: '',
        avgMaxScore: '',
        startTime: '',
        enterpriseName: '',
        endTime: '',
        pageSize: 10,
        pageNum: 1
      },
      scropeUser: [],
      scropeServer: [],
      scropeUserflag: false,
      scropeServerflag: false,
      timecheckflag: false,
      userScoreData: [{
        value: '5分',
        min: 5,
        max: 5,
        flag: false
      },
      {
        value: '4-5分',
        min: 4,
        max: 4,
        flag: false
      },
      {
        value: '3-4分',
        min: 3,
        max: 3,
        flag: false
      },
      {
        value: '2-3分',
        min: 2,
        max: 2,
        flag: false
      },
      {
        value: '1-2分',
        min: 1,
        max: 1,
        flag: false
      } ],
      serverScoreData: [{
        value: '5分',
        min: 5,
        max: 5,
        flag: false
      },
      {
        value: '4-5分',
        min: 4,
        max: 5,
        flag: false
      },
      {
        value: '3-4分',
        min: 3,
        max: 4,
        flag: false
      },
      {
        value: '2-3分',
        min: 2,
        max: 3,
        flag: false
      },
      {
        value: '1-2分',
        min: 1,
        max: 2,
        flag: false
      }, {
        value: '低于1分',
        min: 0,
        max: 1,
        flag: false
      }],
      pageTotal: 1,
      listArry: [],
      tagArry: [],
      userImgPath: []
    }
  },
  created () {
    this.getList()
  },
  filters: {
    dataFormat: function (value) {
      return UtilService.formatDuring(value, 'yyyy-MM-dd')
    },
    timeFormat: function (value) {
      return UtilService.formatDuring(value, 'HH:mm:ss')
    },
    scoreDo: function (value) {
      if (value == 0) {
        return '暂无'
      } else if (value == null || value == '') {
        return '暂无'
      }else {
        return value + '.0'
      }
    }
  },
  methods: {
    
    userInputBlur () {
      if (this.scropeUser.length > 0) {
        for (let i = 0; i < this.userScoreData.length; i++) {
          const element = this.userScoreData[i]
          element.flag = false
        }
      }
    },
    beginFun () {
      let timeM = new Date(this.beginvalue).getTime()
      let now = new Date().getTime()
      if (this.beginvalue == '') {
        return
      }
      if (timeM < now - 31536000000 || timeM > now) {
        this.beginvalue = ''
        this.beginvalueflag = true
        return
      } else{
        this.beginvalueflag = false
      }
      this.myData.startTime = timeM
    },
    endFun () {
      let timeM = new Date(this.endvalue).getTime()
      let now = new Date().getTime()
      if (this.endvalue == '') {
        return
      }
      if (timeM < now - 31536000000 || timeM > now) {
        this.endvalue = ''
        this.beginvalueflag = true 
        return
      } else{
        this.beginvalueflag = false
      }
      if (this.endvalue < this.beginvalue) {
        this.endvalue = ''
        this.beginvalueflag = true 
        return
      } else{
        this.beginvalueflag = false
      }
      this.myData.endTime = new Date(this.endvalue).getTime()+86400000
    },
    servercheck (type) {
      let flag = false
      for (let i = 0; i < this[type].length; i++) {
        const el = this[type][i]
        if (el < 0) {
          flag = true
          break
        }
        if (el > 5) {
          flag = true
          break
        }
      }
      if (this[type][0] != '' && this[type][1] != '' && this[type][0] >  this[type][1]) {
        flag = true
      }
      if (flag) {
        this[type][0] = ''
        this[type][1] = ''
      }
      this[type + 'flag'] = flag
    },
    timeChange () {
      let myDate = new Date()
      let myTime = myDate.getTime()
      let day = 86400000
      if (this.valueTime == 'zdy') {
        this.timeFlag = true
        this.beginvalue = '';
        this.endvalue = '';
      } else if (this.valueTime == 'years') {
        let yearsTime = (new Date(myDate.getFullYear() + '/1/1 00:00:00')).getTime()
        this.myData.startTime = yearsTime
        this.myData.endTime = myTime
        this.timeFlag = false
      } else{
        let start = myTime - (this.valueTime * day)
        this.myData.endTime = myTime
        this.myData.startTime = start
        this.timeFlag = false
      }
    },
    serverInputBlur () {
      if (this.userScore.length > 0) {
        for (let i = 0; i < this.serverScoreData.length; i++) {
          const element = this.serverScoreData[i]
          element.flag = false
        }
      }
    },
    serverScore (index) {
      for (let i = 0; i < this.serverScoreData.length; i++) {
        const element = this.serverScoreData[i]
        element.flag = false
      }
      this.scropeServer[0] = '';
      this.scropeServer[1] = '';
      this.serverScoreData[index].flag = true
      this.myData.avgMinScore = this.serverScoreData[index].min
      this.myData.avgMaxScore = this.serverScoreData[index].max
    },

    userScore (index) {
      for (let i = 0; i < this.userScoreData.length; i++) {
        const element = this.userScoreData[i]
        element.flag = false
      }
      this.scropeUser[0] = '';
      this.scropeUser[1] = '';
      this.userScoreData[index].flag = true
      this.myData.personMinScore = this.userScoreData[index].min
      this.myData.personMaxScore = this.userScoreData[index].max
    },
    chose (flag) {
      this.choseFlag = flag
      this.foldingFlag = true
      if (flag) {
               // 清除筛选条件
        this.myData.startTime = ''
          this.myData.serviceName = ''
          this.myData.userName = ''
          this.myData.personMinScore = ''
          this.myData.personMaxScore = ''
          this.myData.endTime = ''
          this.myData.phone = ''
          this.myData.enterpriseName = ''
          this.myData.avgMinScore = ''
          this.myData.avgMaxScore = ''
        for (let i = 0; i < this.userScoreData.length; i++) {
          const element = this.userScoreData[i]
          element.flag = false
        }
        for (let i = 0; i < this.serverScoreData.length; i++) {
          const element = this.serverScoreData[i]
          element.flag = false
        }
        this.scropeUser = []
      }
    },
    folding () {
      this.foldingFlag = !this.foldingFlag
      if (!this.foldingFlag) {
        for (let key in this.myData) {
          if (key != 'pageSize' && key != 'pageNum') {
            this.myData[key] = '';
          }
        }
      }
    },
    searchEva () {
      this.listArry = []
      this.myData.serviceName = Util.trim(this.myData.serviceName)
      this.myData.phone = Util.trim(this.myData.phone)
      this.myData.userName = Util.trim(this.myData.userName)
      this.myData.enterpriseName = Util.trim(this.myData.enterpriseName)
      if (this.serverScoreflag || this.userScoreflag || this.beginvalueflag) {
        return
      }
      if (this.scropeServer.length > 0) {
        this.scropeServer[0] ? this.myData.avgMinScore = Util.trim(this.scropeServer[0]):'';
        this.scropeServer[1] ? this.myData.avgMaxScore = Util.trim(this.scropeServer[1]):'';
      }
      if (this.scropeUser.length > 0) {
        this.scropeUser[0] ? this.myData.personMinScore = Util.trim(this.scropeUser[0]):'';
        this.scropeUser[1] ? this.myData.personMaxScore = Util.trim(this.scropeUser[1]):'';
      }
      this.getList()
    },
    handleCurrentChange () {
      this.getList()
    },
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
    handleSizeChange () {},
    getList () {
      let that = this
      this.listArry = [] 
      this.checkBox = []
      this.checkFlag = true
      LoadingBoxService.open('加载中...')
      if (this.myData.serviceName != '') {
        this.myData.serviceName = Util.trim(this.myData.serviceName)
      }
      apiClient.get(apiToken.newApi('/ioapi/estimate/listestimate/'), that.myData, function (data) {
        LoadingBoxService.close()
        if (appPublicJs.checkData(data.results.list)) {
            that.noData = true
             that.pageTotal = Number(data.results.total)
             that.listArry = data.results.list
             that.imgSrc = []
             that.userImgPath = []
             that.listArry.forEach(element => {
               that.checkBox.push({'flag': true, 'id': element.ESTIMATE_ID})
                 that.tagArry.push(element.service_tag)
               that.imgSrc.push(apiClient.apiBaseUrl + appPublicJs.serviceImgShow + element.bg_img)
               that.userImgPath.push(apiClient.apiBaseUrl + '/pcapi/enterprise/pcShowImage/avatar?imgPath=' + element.IMAGE + '&token=' + apiClient.token)
             })
             if (that.myData.pageSize >= that.pageTotal) {
               that.numData = false
              }else {
               that.numData = true
             }
          } else{
            that.noData = false
          }
      }
      )
    },
    toServiceDetails (id,upAndDown) {
      if (upAndDown==0) {
        TipBoxService.open("该服务已下架",2)
        return
      }else{
         window.open(publicPathConfig.APP_MARKET + '#/appServiceDetail?id=' + id)
      }
     
    },
    surelFun () {
      let id = ''
      let estimateid = ''
      this.checkBox.forEach(element => {
          element.flag ? estimateid += element.id + ',':''
        })
       this.deleteList(estimateid.substring(0, estimateid.length - 1))
    },
    toCheckBox (index) {
      this.$set(this.checkBox[index], 'flag', !this.checkBox[index].flag)
    },
    deleteList (estimateid) {
      if (estimateid == '') {
        TipBoxService.open('请选中要删除的评论', 0) 
        return
      }
      let that = this
      let sure = function () {
        apiClient.delete(apiToken.newApi('/ioapi/estimate/deleteestimate/'), {'id': estimateid}, function (data) {
            if (data.results) {
                  NoticeBox.close()
                  TipBoxService.open('删除成功', 0) 
                  that.checkFlag = true
                  that.getList()
                  that.checkBox = []
                } else{
                  NoticeBox.close()
                  TipBoxService.open('删除失败', 0)
                }
          }
          )
      }
      NoticeBox.open('是否删除所选内容，删除后将无法撤回！', '', sure)
    },
    checkMore () {
      this.checkFlag = false
      for (let i = 0; i < this.checkBox.length; i++) {
        this.$set(this.checkBox[i], 'flag', true)
      }
    },
    cancelFun () {
      this.checkFlag = true
    },
    sortFun (flag) {
      for (let key in this.flagObj) {
        if (key == flag) {
          this.flagObj[key] = !this.flagObj[key]
          this.flagObj[key] ? this.myData.sort = 'desc':this.myData.sort = 'asc'
        } else {
          this.flagObj[key] = false
        }
      }
      this.active = flag
      this.myData.sortType = flag
      this.myData.pageNum = 1
      this.getList()
    }
  }
}
</script>
<style src="../../css/evaluation.css" scoped></style>
<style scoped>
.checkmsg{
  color: #ff4949;
  padding-left: 10px;
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button{
    -webkit-appearance: none !important;
    margin: 0; 
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
.nodata{
  min-height: 500px;
  background: url("../../images/test.png") no-repeat center center;
}
.evaluationListBox {
  margin-top: 15px;
  margin-bottom: 10px;
}
.evaluationLi {
  height: 175px;
  border-top: 2px solid #fff;
  border-left: 2px solid #fff;
  border-right: 2px solid #fff;
  border-bottom: 1px solid #eceaea;
  width: 100%;
  padding-left: 130px;
  padding-right: 125px;
  position: relative;
  box-sizing: border-box;
  overflow: hidden;
}
.evaluationLi .userInfo {
  width: 130px;
  height: 100%;
  position: absolute;
  left: 0;
}
.evaluationLi .conTent {
  width: 100%;
  height: 100%;
}
.evaluationLi .timer {
  width: 125px;
  height: 95%;
  position: absolute;
  bottom: 6px;
  right: 0;
  border: 1px solid #f1f1f1;
  background-color: #fcfcfc;
}
.evaluationLi .checkItem {
  width: 125px;
  height: 95%;
  position: absolute;
  bottom: 7px;
  right: 0;
  border: 1px solid #f1f1f1;
  background-color: #fcfcfc;
  cursor: pointer;
}
.checkItem .centr {
  width: 25px;
  height: 25px;
  border-radius: 50%;
  border: 2px solid #55a8fd;
  position: absolute;
  left: 50%;
  top: 50%;
  margin-left: -12.5px;
  margin-top: -12.5px;
  text-align: center;
  line-height: 25px;
}
.centr i {
  text-align: center;
  line-height: 25px;
  color: #55a8fd;
}
.timer .titles {
  text-align: center;
  height: 88px;
  line-height: 125px;
  font-size: 12px;
}
.evaluationLi .detele {
  width: 125px;
  height: 100%;
  position: absolute;
  top: 0;
  right: -125px;
  z-i: 999;
  cursor: pointer;
  color: #fff;
  transition: all 0.4s;
}
.evaluationLiFlag:hover .detele {
  transition: all 0.4s;
  background-color: #55a8fd;
  right: 0;
}
.evaluationLi:hover {
  border: 2px solid #55a8fd;
  box-shadow: 0px 0px 5px #55a8fd;
}
.evaluationLi:hover .checkItem {
  bottom: 0px;
  height: 100%;
  border: 1px solid #55a8fd;
  background-color: #55a8fd;
}
.evaluationLi:hover .centr {
  border: 2px solid #fff;
}
.evaluationLi:hover .centr i {
  color: #fff;
}
.evaluationLi:hover .centr {
  background-color: #55a8fd;
}
.detele i {
  display: inline-block;
  width: 100%;
  text-align: center;
  margin-top: 65px;
  font-size: 20px;
}
.detele p {
  width: 100%;
  text-align: center;
}
.timer p {
  text-align: center;
}
.userInfo .userImg {
  border-radius: 50%;
  height: 45px;
  width: 45px;
  margin: 0 auto;
  margin-top: 10px;
  overflow: hidden;
}
.userInfo .userImg img {
  width: 100%;
  height: 100%;
}
.userInfo .username {
  height: 30px;
  line-height: 30px;
  text-align: center;
}
.userInfo .userscope {
  text-align: center;
  height: 40px;
  line-height: 40px;
}
.userInfo .userscope i {
  font-size: 16px;  
  color: #fb6233;
}
.conTent .evaConet {
  height: 90px;
  padding: 10px 8px 0 8px;
  line-height: 25px;
  word-wrap:break-word;
}
.conTent .serInfo {
  height: 76px;
  background-color: #f9f9f9;
  padding-top: 6px;
  padding-left: 150px;
  position: relative;
  margin-left: 8px;
}
.serInfo .serImg {
  width: 120px;
  height: 60px;
  position: absolute;
  top: 8px;
  left: 10px;
  cursor: pointer;
}
.serInfo .serImg img {
  width: 100%;
  height: 100%;
}
.serInfo .serCont {
  width: 100%;
  height: 100%;
}

.serCont .sername {
  color: #8a8a8a;
  font-size: 14px;
  height: 24px;
  line-height: 24px;
}
.serCont .sername span{
  cursor: pointer;
}
.serCont .sername i {
  margin-left: 15px;
  color: #ffa729;
  font-size: 14px;
}
.serCont .tag {
  color: #afafaf;
}
.serCont .tag span:last-child i{
    display: none;
}
.serCont .introduce {
  height: 24px;
  line-height: 24px;
  color: #9d9d9d;
}
</style>
