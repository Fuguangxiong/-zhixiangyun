<template>
    <div class="evaluation">
        <div class="conCent">
            <div class="rise">
                <span class="textTlie">评价管理</span>   
            </div>
            <div class="wordBlock tStyel">
                <span class="textName">服务名称：</span>
                <div>
                    <div class="search width248">
                        <input type="text" placeholder="请输入服务名称" class="inputStyle" v-model="myData.serviceName" @keyup.enter="searchEva">
                        <button class="searchBut"><i class="icon iconfont icon-sousuo"  @click="searchEva"></i></button>
                    </div>
                </div>
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
                        <img :src="userInfo.IMAGE" alt="" >
                    </div>
                    <div class="username">{{userInfo.PHONE}}</div>
                    <div class="userscope">评分：<i>{{item.SCORE|scoreDo}}</i></div>
                    <div class="xingbox">
                        <div class="xingxingCon">
                                <i class="icon iconfont icon-xing1-copy"></i>
                                <i class="icon iconfont icon-xing1-copy"></i>
                                <i class="icon iconfont icon-xing1-copy"></i>
                                <i class="icon iconfont icon-xing1-copy"></i>
                                <i class="icon iconfont icon-xing1-copy"></i>
                            <div class="xingIcon">
                                <i class="icon iconfont icon-xing1" v-for="n in parseInt(item.SCORE)"></i>
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
                                <i class="icon iconfont icon-41">&nbsp;&nbsp;{{item.estimateCount}}</i>
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
import Util from '../../../publicJs/Util.js'
export default {
  name: 'evaluation',
  data () {
    return {
      checkFlag: true,
      active: 'zn',
      noData: true,
      flagObj: {
        mc: false,
        hp: false,
        sj: false
      },
      numData: true,
      tokenId: '',
      userInfo: {
        PHONE: '',
        IMAGE: ''
      },
      imgSrc: [],
      listId: [],
      checkBox: [],
      serviceName: '',
      myData: {
        serviceName: '',
        sort: 'desc',
        sortType: 'zn',
        pageSize: 10,
        pageNum: 1
      },
      pageTotal: 1,
      listArry: [],
      tagArry: []
    }
  },
  created () {
    this.tokenId = this.$route.query.tokenId || userService.getTokenId()
    if (this.tokenId != undefined) {
      var that = this
      UserCookieService.userInfoToCookie(this.tokenId, function (userName, images) {
        that.userInfo.PHONE = userName
        that.userInfo.IMAGE = images
      })
    };
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
      } else {
        return value + '.0'
      }
    }
  },
  methods: {
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
      apiClient.get(apiToken.newApi('/pcapi/estimate/getEstimateQueryList/'), that.myData, function (data) {
        LoadingBoxService.close()
        if (appPublicJs.checkData(data.results.list)) {
          that.noData = true
          that.imgSrc = []
          that.pageTotal = Number(data.results.total)
          that.listArry = data.results.list
          that.listArry.forEach(element => {
            that.checkBox.push({'flag': true, 'id': element.ESTIMATE_ID})
            that.tagArry.push(element.service_tag)
            that.imgSrc.push(apiClient.apiBaseUrl + appPublicJs.serviceImgShow + element.bg_img)
          })
          if (that.myData.pageSize >= data.results.total) {
            that.numData = false
          } else {
            that.numData = true
          }
        } else {
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
      this.checkBox.forEach(element => {
        element.flag ? id += element.id + ',' : ''
      })
      this.deleteList(id.substring(0, id.length - 1))
    },
    searchEva () {
      this.listArry = []
      this.getList()
    },
    toCheckBox (index) {
      this.$set(this.checkBox[index], 'flag', !this.checkBox[index].flag)
    },
    deleteList (id) {
      if (id == '') {
        TipBoxService.open('请选中要删除的评论', 0)
        return
      }
      let that = this
      let sure = function () {
        apiClient.delete(apiToken.newApi('/pcapi/estimate/deleteEstimateById/'), {id: id}, function (data) {
          NoticeBox.close()
          TipBoxService.open('删除成功', 0)
          that.checkFlag = true
          that.getList()
          that.checkBox = []
        }
            )
      }
      NoticeBox.open('是否删除所选内容，删除后将无法撤回！', sure)
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
          this.flagObj[key] ? this.myData.sort = 'desc' : this.myData.sort = 'asc'
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
  bottom: 7px;
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
  margin: 8px;
  height: 75px;
  margin-top: 0px;
  background-color: #f9f9f9;
  padding-top: 10px;
  padding-left: 150px;
  position: relative;
  margin-right: 0px;
}
.serInfo .serImg {
  width: 120px;
  height: 60px;
  position: absolute;
  top: 10px;
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
