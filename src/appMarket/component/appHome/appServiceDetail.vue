<template>
	<div class="bodyMain App">
		<top-header :tokenId="tokenId" :userName="userInfo.PHONE"></top-header>
		<div class="publicMain Scroll">

			<!--搜索-->
			<!-- <search @event='queryData'></search> -->

			<!--应用详情内容-->
			<div class="applicationDetails wonderfulSpecialColumn">
				<div class="wonderfulSpecialColumnTitle">
					<span class="wscApplicationMarket">应用市场</span>
          <span class="wscSpanText">· 应用详情</span>
				</div>
				<div class="applicationDetailsMain">
					<div class="applyName">
						<div class="applyNameLeft">
							<img :src="serverInfo.img">
						</div>
						<div class="applyNameCenter">
							<h3 class="applyNameCenterH">{{serverInfo.name}}</h3>
							<p class="applyNameCenterP wordBreakDh4">{{serverInfo.service_brief}}</p>
							<div class="versionUpdateCollection">
								<div class="editionDiv">
									<span class="spanEdition">标签：</span>
									<span class="spanEdition tag">{{serverInfo.service_tag}}</span>
								</div>
								<div class="updateDiv">
									<span class="spanEdition">发布时间：</span>
									<span class="spanEdition">{{serverInfo.open_time}}</span>
								</div>
								 <div class="collectionDiv">
									<span class="spanIconJia"  @click="doColection" >
										<i class="ico iconfont icon-iconjia" v-show="flag"></i><span class="emShouCang" v-show="flag">收藏</span>
										<i class="ico iconfont icon-hengxian"v-show="!flag"></i><span class="emShouCang" v-show="!flag"> 取消收藏</span>
									</span>
								</div>
							</div>
						</div>
						<div class="applyNameRight">
							<div class="applyNameRightMain"><span class="spanPingfen">评分：</span><span class="spanPingshu" v-show='serverInfoScore.grade_average != 0'>{{serverInfoScore.grade_average}}</span></span><span class="spanPingshu mgs" v-show='serverInfoScore.grade_average == 0'>暂无评分</span></div>
							<span v-show="!personaflag">
                <span class="applyNameRightBtn1" @click='goRealName' v-show="(!loginFlag||!realName||!schemefalg)">立即申请</span>
                <span class="applyNameRightBtn" @click='goUsePage' v-show="loginFlag&&realName&&schemefalg">立即使用</span>
                <span class="applyNameRightBtn2" @click='packageChange' v-show="loginFlag&&realName&&schemefalg">套餐变更</span>
              </span>
              <span class="applyNameRightBtn applyNameRightBtn3" @click='goUsePage' v-show="personaflag">立即使用</span>
						</div>
					</div>
					<div class="applicationIntroduction">
						<h3 class="applicationIntroductionTop">应用介绍</h3>
						<div class="applicationIntroductionCenter">
							<div class="applicationIntroductionLeft">
								<img :src="serverInfo.bg_img">
							</div>
							<div class="applicationIntroductionMain">
                <p class="applicationIntroductionMainP" v-bind:title="serverInfo.service_remark">
                  {{serverInfo.service_remark!="" &&
                     serverInfo.service_remark!=null && 
                     serverInfo.service_remark.length>500?(serverInfo.service_remark.substring(0,500)+'...') : serverInfo.service_remark}}
                </p>
							</div>
						</div>
					</div>
				</div>
				<div class="relatedApplications">
					<h3 class="relatedApplicationsH">相关应用</h3>
					<div class="relatedApplicationsMain">
						<div class="ramCenter" v-for="likeService in queryLikeService" @click="toService(likeService.id)">
							<img :src="likeService.img">
							<div class="ramCenterTitle" :title='likeService.name'>{{likeService.name}}</div>
						</div>
					</div>
				</div>
				<div class="iwantToScore" >
					<div class="iwantToScoreTitle" v-show="!evaFlag">
						<span class="spanScore">我要评分</span>
						<el-rate v-model="commentScore" show-text :colors="['#99A9BF', '#F7BA2A', '#FF9900']" @change="commentScoreChange()"></el-rate>
						<div class="scoreStars">
							<!--<img src="../../static/images/xingxing_tp.png">-->
						</div>
					</div>
					<div class="commentaries" v-show="!evaFlag">
						<h3 class="commentariesH">评论<span class="commentariesHI">（<span class="clordg">{{commentText.length}}/200</span><span>您还可以输入<span  class="clordg">{{remnant}}</span>个字)</span></span></h3>
						<textarea class="commentariesTextarea" @input="descInput" v-model="commentText" maxlength="200"></textarea>
						<p></p>
						<div class="submitBox">
							<button class="submitBtn" @click="sendComment">提交</button>
						</div>
					</div>
					<div class="commentDisplayArea">
						<div class="commentDisplayAreaCenter">
							<div class="commentDisplayAreaMain" v-for="comment in commentLsit">
								<div class="cdamNameTime">
									<span class="cdamName">{{comment.userName | checkUserName}}</span>
									<span class="cdamTime">{{comment.created_time}}</span>
								</div>
								<p class="cdamCenter wordBreakDh">{{comment.estimate_desc}}</p>
							</div>
						</div>
						<div class="checkOutMore" v-show='msgData'>
							<div class="checkOutMoreMain"><span v-show="!commentNoMore" @click="loadMore">查看更多</span><span v-show="commentNoMore">暂无更多数据</span></div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<footer-box></footer-box>
		<!-- <select-scheme-dialog :is-show='isShowPlans' 
                          :service-data='serviceData'
                          @sure='packageChange'
                          @cancle='packageChange'>
   		 </select-scheme-dialog> -->
		<demand-list
		:is-show='isShow'
    :service-data="serviceData"
     @back='closeDemadnList'
		>
		</demand-list>
	</div>
</template>
<script>

import topHeader from '../../../publicComponent/topHeader.vue'
import footerBox from './footer.vue'
import demandList from './demandList.vue'
import apiToken from '../../../publicJs/apiToken.js'
import apiClient from '../../../publicJs/ApiClient.js'
import TipBoxService from '../../../publicJs/TipBoxService.js'
import LoadingBoxService from '../../../publicJs/LoadingBoxService.js'
import search from './appSearch.vue'
import UtilTool from '../../../publicJs/Util.js'
import Util from '../../../publicJs/UtilService.js'
import tool from '../../common/public.js'
import NoticeBox from '../../common/NoticeBox.js'
import userService from '../../../publicJs/userService.js'
import UserCookieService from '../../../publicJs/UserCookieService.js'
import publicPathConfig from '../../../publicJs/publicPathConfig.js'
import appPublicJs from '../../common/public.js'
import selectSchemeDialog from '../../../serviceManage/component/dialog/selectSchemeDialog.vue'
export default {
  name: 'appHomes',
  data () {
    return {
      enterpriseId: '',
      estimate_id: '',
      isShow: false, // 计费方案
      loginFlag: false,
      packageId: '',
      schemefalg: false, // 是否有套餐
      personaflag: false,
	    schemeData: [], // 套餐信息
      tokenId: null,
      userInfo: {
        ID_CARD_SCAN_BACK: '',
        PHONE: '',
        IMAGE: '',
        ID: ''
      },
      id: '',
      realName: false,
      evaFlag: false,
      grade_id: '',
      flag: true,
      commentScore: 0,
      sorceSelect: 0,
      pageSize: 1, // 滚动加载页面
      commentLoadNum: 10, // 滚动加载条数
      serverInfo: {},
      serverInfoScore: {},
      searchKeyWord: '',
      commentLsit: [],
      commentText: '', // 要提交评论文字
      remnant: 200, // 剩余可输入字数
      commentClickFlage: true, // 评论是否可点击
      flage: true,
      msgData: true, // 如果一条数据也没有，就都不显示
      commentNoMore: false, // 没有更多评论
      queryLikeService: [], // 相关服务列表
      targsList: [], // 搜索框下方标签
      serviceData: {},
      userId: ''
    }
  },
  created () {
   
    this.enterpriseId = sessionStorage.getItem('enterpriseId')
    this.userInfo.PHONE = userService.getUsername()
    this.tokenId = this.$route.query.tokenId || userService.getTokenId()
    if (this.tokenId != undefined) {
      this.loginFlag = appPublicJs.checkLogin(this.tokenId)
    }
    let state = userService.getInfo('state')
    if (state == 'UNAUTHORIZED') {
      this.realName = false
    } else if (state == 'AUTHORIZED') {
      this.realName = true
    }


  },
  filters: {
    checkUserName: function (value) {
      var length = value.length
      var mtel
      if (
        length == 11 &&
        /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(14[0-9]{1})|)+\d{8})$/.test(
          value
        )
      ) {
        mtel = value.substr(0, 3) + '****' + value.substr(7)
      } else {
        mtel = value
      }
      return mtel
    }
  },
  //  beforeRouteUpdate (to, from, next) {
  //   // react to route changes...
  //   // don't forget to call next()
  //   console.log(to,from)
  // },
  watch: {
    $route (to, from) {
      // 刷新参数放到这里里面去触发就可以刷新相同界面了
      if (to.query.id != from.query.id) {
        this.commentScore = 0
        this.id = this.$route.query.id
        this.loginFlag = tool.checkLogin(userService.getInfo('tokenId'))
        this.commentLsit = [] // 清空评论列表
        this.getHandleById() // 查评分
        this.getServerInfo()
        this.getHandleList(-1)
        this.getfootPrintInfo()
        this.searchEvaFlag()
      }
    },
    isShow(newval,oldval){
      if(newval){
        $("#app").css({"overflow": "hidden"})
      }else{
         $("#app").css({"overflow": "auto"})
      }
    }
  },
  mounted () {
    this.id = this.$route.query.id
    this.loginFlag = tool.checkLogin(userService.getInfo('tokenId'))
    this.getUser()
    this.getHandleById() // 查评分
    this.getServerInfo()
    this.getHandleList()
    this.getfootPrintInfo()
    this.searchEvaFlag()
    /* 进入页面判断是否评论，如果没有则生成一个32位的随机字符串，
			否则从后台得到该数据。
			每次查评分都讲带上这个随机数
      **/

  },
  components: {
    search,
    topHeader,
    footerBox,
    demandList
  },
  methods: {
    
    toService (id) {
      this.$router.push({
        name: 'appServiceDetail',
        query: {
          id: id
        }
      })
    },
    getUser () {
      let that = this
      UserCookieService.getUserInfo(function (params) {
        that.userId = params.ID
      })
    },
    searchEvaFlag () {
      let that = this
      apiClient.get(
        apiToken.newApi('pcapi/estimate/findEstimateByUserId/'),
        { serviceId: that.id },
        function (data) {
          that.evaFlag = data.results
        }
      )
    },
    queryData (data) {
      if (data.trim() != '') {
        this.searchKeyWord = data
        this.searchService()
      }
    },
    closeDemadnList (flag) {
      this.isShow = false
    },
    schemefalgCheck (id) {
      let that = this
      LoadingBoxService.open('加载中...')
      apiClient.post('itsmApi/applyInfo/findSchemeId', {'service_id': id}, function (data) {
        LoadingBoxService.close()
        that.serviceData = data.results
        that.serviceData.name = that.serverInfo.name
        if (that.serviceData.id) {
          that.schemefalg = true
        } else {
          that.schemefalg = false
        }
      })
    },
    goRealName () {
      let fun = function () {
        window.location =
          publicPathConfig.PERSONAL_CONSOLE + '#/realNameCertification'
      }
      if (this.loginFlag) {
        if (!this.realName) {
          NoticeBox.open(
            {
              title: '身份认证提示',
              content: '对不起,当前操作需在已认证身份下进行',
              sure: '去认证',
              cancel: '取消'
            },
          'noImages',
          fun
         )
        } else if (!this.schemefalg) {
          this.packageChange()
        }
      } else {
        this.goto(0)
      }
    },
    packageChange () {
      this.isShow = true
    },
    goto (type) {
      var path = window.location.href
      path = Util.removeUrlItem(path, 'tokenId')
      path =
        publicPathConfig.PLATFORM_LOGIN_URL +
        '?type=' +
        type +
        '&source=' +
        encodeURIComponent(path)
      window.location = path
    },
    goUsePage () {
      window.open(
        tool.detailUrl + '?id=' + this.id + '&tokenId=' + this.tokenId
      )
    },
    loadMore () {
      this.pageSize++
      this.getHandleList()
    },
    getfootPrintInfo () {
      var that = this
      var myData = {
        serviceId: that.id
      }
      if (this.loginFlag) {
        apiClient.get(
          apiToken.newApi('appmarket/footprint/insertFootPrint/'),
          myData,
          function (data) {}
        ) // 足迹
      }
      apiClient.get(
        apiToken.newApi('appmarket/footprint/insertRecord/'),
        myData,
        function (data) {}
      ) // 点击量
    },
    // 收藏和取消
    doColection () {
      if (this.loginFlag) {
        var that = this
        if (this.flag == true) {
          var myData = {
            type: 'collect',
            serverId: that.id,
            name: '收藏',
            collect_status: 1, // 收藏状态
            // id: that.serverInfo.collectId
           id: that.serverInfoScore.collectId


          }
          apiClient.post(
            apiToken.newApi('appmarket/handle/insertHandle/'),
            myData,
            function (data) {
              that.flag = !that.flag
            }
          )
        } else {
          let myData = {
            type: 'collect',
           id: that.serverInfoScore.collectId

          }
          apiClient.delete(
            apiToken.newApi('appmarket/handle/deleteHandle/'),
            myData,
            function (data) {
              that.flag = !that.flag
            }
          )
        }
      } else {
        this.goto(0)
      }
    },
    commentScoreChange () {
      var grade = parseInt(this.serverInfoScore.grade)
      if (this.loginFlag) {
        if (!this.flage) {
          this.commentScore = grade
        }
        if (this.commentScore != grade && this.flage) {
          this.flage = false
          var that = this
          if (that.estimate_id != '') {
            var myData = {
              id: that.grade_id,
              serverId: this.id,
              type: 'grade',
              name: '评分',
              grade: this.commentScore
            }
            apiClient.post(
              apiToken.newApi('appmarket/handle/insertHandle/'),
              myData,
              function (data) {
                that.flage = true
                that.getHandleById() // 查评分
              }
            )
          }
        }
      } else {
        this.goto(0)
      }
    },
    searchService () {
      let that = this
      that.$router.push({
        name: 'appSearchList',
        query: {
          searchKeyWord: this.searchKeyWord
        }
      })
    },
    clickTags (targs) {
      this.searchKeyWord = targs
      this.searchService()
    },
    getServerInfo () {
      var that = this
      LoadingBoxService.open('加载中...')
      var myData = {
        serverId: this.id,
        pageSize: 1,
        pageNum: 1
      }
      apiClient.get(
        apiToken.newApi('appmarket/atomic/getAtomic/'),
        myData,
        function (data) {
          LoadingBoxService.close()
          if (tool.checkData(data.results.data)) {
            that.serverInfo = data.results.data[0]
            if ((that.serverInfo.belong_type == 'PERSONAL' && that.serverInfo.user_id == that.userId) || (that.serverInfo.belong_type == 'ENTERPRISE' && that.serverInfo.enterprise_id == that.enterpriseId)) {
              that.personaflag = true
            } else {
              that.personaflag = false
            }
            that.serverInfo.service_tag = that.serverInfo.service_tag.join(',')
            if (
              that.serverInfo.open_time != undefined &&
              that.serverInfo.open_time != '暂无'
            ) {
              that.serverInfo.open_time = Util.formatDuring(
                that.serverInfo.open_time,
                'yyyy-MM-dd'
              )
            } else {
              that.serverInfo.open_time = '暂无'
            }
            if (that.serverInfo.img == '') {
              that.serverInfo.img = 'favicon.png'
            }
            if (that.serverInfo.bg_img == '') {
              that.serverInfo.bg_img = 'bg-img.png'
            }
            if (that.serverInfo.service_brief == undefined) {
              that.serverInfo.service_brief = '暂无简介'
            }
            that.serverInfo.img =
              apiClient.apiBaseUrl +
              appPublicJs.serviceImgShow +
              that.serverInfo.img +
              '&token=' +
              apiClient.token
            that.serverInfo.bg_img =
              apiClient.apiBaseUrl +
              appPublicJs.serviceImgShow +
              that.serverInfo.bg_img +
              '&token=' +
              apiClient.token
           // that.flag = that.serverInfo.handle.collect_status != '1'
            that.queryLikeServiceList()
            that.schemefalgCheck(that.id)
          }
        }
      )
    },
    getHandleById () {
      var that = this
      var myData = {
        serverId: this.id
      }

      apiClient.get(
        apiToken.newApi('appmarket/handle/getHandleById/'),
        myData,
        function (data) {
          if (data.results && data.results.data) {
            if (
              data.results.data.grade_id == undefined ||
              data.results.data.grade_id == '' ||
              data.results.data.grade_id == null
            ) {
              that.grade_id = tool.randomString()
            } else {
              that.grade_id = data.results.data.grade_id
            }
            that.serverInfoScore = data.results.data
            that.estimate_id = data.results.data.estimate_id
           if (data.results.data.collect_id) {
              that.serverInfoScore.collectId = data.results.data.collect_id
              that.flag = false
            } else {
              that.serverInfoScore.collectId = tool.randomString()
              that.flag = true
            }

            if (that.serverInfoScore.grade) {
              var grade = parseInt(that.serverInfoScore.grade)
              that.commentScore = grade
            }
          }
        }
      )
    },
    getHandleList (num) {
      var that = this
      var myData = {
        serverId: this.id,
        type: 'estimate',
        pageSize: this.commentLoadNum,
        pageNum: this.pageSize,
        grade_id: that.grade_id
      }
      apiClient.get(
        apiToken.newApi('appmarket/handle/getHandleList/'),
        myData,
        function (data) {
          var totle = data.results.total
          if (tool.checkData(data.results.data)) {
            var list = data.results.data
            if (num == 0) {
              that.commentLsit = []
              that.commentLsit = list
            } else {
              for (var i = 0; i < list.length; i++) {
                that.commentLsit.push(list[i])
              }
            }
          } else {
            if (num == -1) {
              that.commentLsit = []
            }
            that.msgData = false
          }
          if (
            totle / that.commentLoadNum < that.pageSize ||
            totle / that.commentLoadNum == that.pageSize
          ) {
            that.commentNoMore = true
          }
        }
      )
    },
     descInput () {
      this.commentText = UtilTool.trim(this.commentText)
      let txtVal = this.commentText.length
      this.remnant = 200 - txtVal
    },
    sendComment () {
      if (this.loginFlag) {
        this.commentText = UtilTool.trim(this.commentText)
        if (this.commentText !== '' && this.commentClickFlage) {
          if (this.commentScore == 0) {
            TipBoxService.open('请您进行评分', 2)
            return
          }
          var that = this
          this.commentClickFlage = false
          var myData = {
            serverId: this.id,
            type: 'estimate',
            name: '评价',
            estimate_desc: this.commentText
          }
          apiClient.post(
            apiToken.newApi('appmarket/handle/insertHandle/'),
            myData,
            function (data) {
              if (data.results.status) {
                that.commentText = ''
                TipBoxService.open('评论成功')
                that.getHandleList(0)
                that.evaFlag = true
              } else {
                TipBoxService.open('评论失败', 1)
              }
              that.commentClickFlage = true
            }
          )
        } else {
          TipBoxService.open('评论内容不能为空', 2)
        }
      } else {
        this.goto(0)
      }
    },
    queryLikeServiceList () {
      var that = this
      var tags = this.serverInfo.service_tag
      var myData = {
        tags: tags.toString(),
        pageSize: 8,
        pageNum: 1,
        eliminateServerId: this.id
      }
      apiClient.get(
        apiToken.newApi('appmarket/atomic/getAtomicGroup/'),
        myData,
        function (data) {
          if (tool.checkData(data.results.data)) {
            that.queryLikeService = data.results.data
            var length = that.queryLikeService.length
            for (var i = 0; i < length; i++) {
              that.queryLikeService[i].img =
                apiClient.apiBaseUrl +
                appPublicJs.serviceImgShow +
                that.queryLikeService[i].img +
                '&token=' +
                apiClient.token
            }
          }
        }
      )
    }
  }
}
</script>

<style scoped>
.icon-sousuo {
  font-size: 25px;
}
.applyNameRightBtn1 {
  cursor: pointer;
  width: 90px;
  height: 36px;
  font-size: 14px;
  color: #fb6233;
  line-height: 36px;
  border-radius: 2px;
  border: 1px solid #fb6233;
  position: absolute;
  bottom: 10px;
  right: 35px;
  text-align: center;
}
.applyNameRightBtn3.applyNameRightBtn{
  right: 35px;
}
.applyNameRightBtn2 {
  cursor: pointer;
  width: 90px;
  height: 36px;
  font-size: 14px;
  color: #55a8fd;
  line-height: 36px;
  border-radius: 2px;
  border: 1px solid #55a8fd;
  position: absolute;
  bottom: 10px;
  right: -20px;
  text-align: center;
}

.applyNameRightBtn1:hover {
  background-color: #fb6233;
  color: #fff;
}
.applyNameRightBtn {
  cursor: pointer;
  width: 90px;
  height: 36px;
  /* background-color: #6aa8f6; */
  font-size: 14px;
  color: #fb6233;
  line-height: 36px;
  right: 90px;
  border-radius: 2px;
}
.applyNameRightBtn:hover {
  background-color: #639fea;
}
.ramCenter {
  cursor: pointer;
}
.spanEdition{
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.spanPingshu.mgs {
  font-size: 14px;
}
.bodyMain{
    position: relative;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    padding-top: 30px;
    /* height: 100%; */
}
.publicMain{
    position: relative;
    /* height:100%; */
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    background: #ffffff;
}
.wordBreakDh{
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    word-break: break-all;
}
.wordBreakDh4{
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    word-break: break-all;
}
.wonderfulSpecialColumn{
    width: 100%;
    height: auto;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    padding-top: 15px;
}
.wonderfulSpecialColumnTitle{
    height: 50px;
    line-height: 50px;
    background: #fafafa;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    padding: 0 15px;
    font-size: 14px;
}
.wscApplicationMarket{
    /* display: inline-block; */
    line-height: 50px;
    color: #666666;
}
.wscSpanText{
    /* display: inline-block; */
    line-height: 50px;
    color: #333333;
}
.wonderfulSpecialColumnMain{
    height: auto;
    margin-top: 5px;
}
.wonderfulSpecialColumnMainTop{
    height: 40px;
    line-height: 40px;
}
.wonderfulSpecialColumnMainTop .iconChuangYi{
    font-size: 28px;
    color: #fb6233;
    font-weight: 600;
    margin-right: 5px;
    float: left;
}

/**********************应用详情内容**************************/
.applicationDetails{
    width: 1200px;
    height: auto;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    padding-top: 15px;
    margin: 0 auto;
}
.applicationDetailsMain{
    margin-top: 15px;
    border: 1px solid #ededee;
    border-radius: 2px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    padding: 15px;
    box-shadow: 0 3px 10px #ededee;
}
.applyName{
    min-height: 215px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    padding-bottom: 15px;
    border-bottom: 1px dashed #ededed;
}
.applyNameLeft{
    float: left;
    width: 200px;
    height: 200px;
    margin-right: 15px;
}
.applyNameLeft img{
	width: 200px;
    height: 200px;
}
.applyNameCenter{
    float: left;
    width: 55%;
    min-height: 200px;
    position: relative;
}
.applyNameCenterH{
    font-size: 18px;
    color: #333333;
    font-weight: 600;
}
.applyNameCenterP{
    font-size: 14px;
    color: #333333;
    line-height: 22px;
    margin-top: 10px;
}
.versionUpdateCollection{
    height:auto;
    margin-top: 10px;
    position: absolute;
    bottom: 0;

}
.editionDiv{
    height: 24px;
    line-height: 20px;
}

.updateDiv{
    height: 24px;
    line-height: 20px;
}
.collectionDiv{
    height: 25px;
    padding-top: 34px;
}
.spanIconJia{
    display: block;
    float: left;
    width: auto;
    padding: 0 10px;
    height: 25px;
    line-height: 23px;
    margin-top: 2px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    border: 1px solid #cccccc;
    border-radius: 6px ;
    font-size: 12px;
    color: #333333;
    cursor: pointer;
}
.spanIconJia .icon-iconjia{
    font-size: 14px;
    margin-right: 5px;
}
.spanIconJia:hover{
    /*background: #f44e58;*/
    color: #fb6233;
    border-color:#fb6233;
}

.applyNameRight{
    position: relative;
    width: 124px;
    min-height: 200px;
    float: right;
    margin-right: 20px;
}
.applyNameRightMain{
    position: absolute;
    top: 40%;
    width: 100%;
    height: 40px;
}
.spanPingfen{
    display: inline-block;
    width: auto;
    float: left;
    line-height: 40px;
    font-size: 16px;
    color: #666666;
}
.spanPingshu{
    display: inline-block;
    width: auto;
    float: left;
    line-height: 40px;
    font-size: 28px;
    color: #fb6233;
}
.applyNameRightBtn{
    position: absolute;
    bottom: 10px;
    text-align: center;
}

.applyNameRightBtn:hover{
    color: #fff;
    background: #fb6233;
}
.applicationIntroduction{
    min-height: 315px;

    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    /*padding-top: 15px;*/
}
.applicationIntroductionTop{
    height: 42px;
    line-height: 42px;
    font-size: 16px;
    color: #333333;
    font-weight: 600;
}
.applicationIntroductionCenter{
    position: relative;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    padding-left: 485px;
}
.applicationIntroductionLeft{
    position: absolute;
    top:0;
    left: 0px;
    width: 470px;
    height: 270px;
}
.applicationIntroductionLeft img{
	width: 460px;
    height: 260px;
}
.applicationIntroductionMain{
    width: 100%;
    min-height: 270px;
}
.applicationIntroductionMainP{
    line-height: 22px;
    font-size: 14px;
    color: #333333;
}
.relatedApplications{
    margin-top: 15px;
    min-height: 190px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    border: 1px solid #ededee;
    border-radius: 2px;
    box-shadow: 0 3px 10px #ededee;
    padding: 10px 0 0 15px;
    overflow: hidden;
}
.relatedApplicationsH{
    line-height: 30px;
    font-size: 16px;
    color: #333333;
    font-weight: 600;
}
.relatedApplicationsMain{
    min-height: 134px;
}
.ramCenter{
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    position: relative;
    width: 134px;
    margin-right: 13px;
    height: 134px;
    border: 1px solid transparent;
    float: left;
    margin-bottom: 10px;
}
.ramCenter:hover{
    box-shadow: 0 3px 10px #e5e5e5;
}
.ramCenter img{
	width: 134px;
    height: 134px;
}
.ramCenterTitle{
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;  
    height: 28px;
    line-height: 28px;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    background:rgba(0,0,0,.6);
    font-size: 12px;
    color: #ffffff;
    padding: 0 5px;
}
.iwantToScore{
    margin-top: 15px;
    margin-bottom: 40px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    border: 1px solid #ededee;
    box-shadow: 0 3px 10px #ededee;
    padding: 15px;
    border-radius: 2px;
}
.iwantToScoreTitle{
    height: 25px;
    line-height: 25px;
}
.spanScore{
    display: block;
    float: left;
    font-size: 16px;
    color: #333333;
    font-weight: 600;
    margin-right: 10px;
}

.scoreStars{
    float: left;
    height: 25px;
}
.commentaries{
    margin-top: 20px;
    height: auto;
}
.commentariesH{
    font-size: 16px;
    color: #333;
    font-weight: 600;
}
.commentariesHI{
    color: #666666;
    font-weight: 500;
    font-size: 14px;
}
.commentariesTextarea{
    min-height: 130px;
    background: #ffffff;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    padding: 10px;
    border: 1px solid #eeeeee;
    width: 100%;
    margin-top: 15px;
    font-size: 14px;
    color: #333333;
    line-height: 25px;
}
.submitBox{
    margin-top: 15px;
    height: 32px;
}
.submitBtn{
    height: 32px;
    line-height: 32px;
    padding: 0 25px;
    float: right;
    font-size: 14px;
    color: #ffffff;
    background: #6aa8f6;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    border-radius: 2px;
    border: 1px solid #66a1ec;
}
.commentDisplayArea{
    width: 100%;
    height: auto;
    margin-top: 15px;
}
.commentDisplayAreaCenter{
    width: 100%;
    height: auto;
}
.commentDisplayAreaMain{
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    height: auto;
    border-top: 1px dashed #eeeeee;
    padding: 10px 0;
}
.cdamNameTime{
    height: 25px;
    line-height: 25px;
}
.cdamName{
    display: block;
    float: left;
    width: auto;
    line-height: 25px;
    font-size: 12px;
    color: gray;
}
.cdamTime{
    display: block;
    float: right;
    width: auto;
    line-height: 25px;
    font-size: 14px;
    color: #333333;
}
.cdamCenter{
    line-height: 22px;
    font-size: 14px;
    color: #333333;
}
.checkOutMore{
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    height: auto;
    border-top: 1px dashed #eeeeee;
    padding: 10px 0;
}
.checkOutMoreMain{
    width: 100px;
    height: 25px;
    line-height: 25px;
    margin: 0 auto;
    font-size: 14px;
    color: #333333;
    cursor: pointer;
}
.checkOutMoreMain .icon-xiala{
    font-size: 16px;
    margin-left: 5px;
    color: #747474;
}
.userName{
    height: 30px;
    line-height:30px;
    width: auto;
    float: left;
    color: #ffffff;
    font-size: 12px;
    margin-left: 20px;
}
.userName .iconXiaLa{
    font-size: 12px;
    color: #ffffff;
    margin-left: 10px;
    cursor: pointer;
}
</style>
