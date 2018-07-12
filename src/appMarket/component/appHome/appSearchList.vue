<template>
  <div class="Scroll">
    <div class="bodyBox1 App">
      <top-header :tokenId="tokenId" :userName="userInfo.PHONE" ></top-header>
      <div class="bodyBox publicMain1" >
       <search v-on:toseach='queryData'></search> 
       <!--热门推荐更多内容-->
       <div class="hotRecommendationMain " >
        <div class="hotRecommendationTop">
          <h3 class="hotHead">智能推荐</h3>
          <div class="hotMain">
            <span class="hotSpanLab">标签：</span>
            <ul class="hotUl">
              <!-- <li class="hotLi"  @click="clickTags()">
                <em>
                <a class="hotLiA aclick" href="javascript:;">全部</a>
                </em>
                </li> -->
              <li class="hotLi" v-for="(item,index) in targsList" :class="{active:act==index}" @click="clickTags(item,index)">
                <em>
                <a class="hotLiA" href="javascript:;">{{item}}</a>
                </em>
                </li>
            </ul>
          </div>
        </div>
        <div class="hotRecommendationMainCenter">
          <div class="hotMainCenterTop">
            <ul class="hotMainCenterUl">
              <li class="hotMainCenterLi" v-bind:class="sortFlag == 0 ? 'aclickLi':''" @click="clickSort(0)">综合排序</li>
              <li class="hotMainCenterLi" v-bind:class="sortFlag == 1 ? 'aclickLi':''" @click="clickSort(1)">好评率<i class="ico iconfont icon-xiangxiajiantou hplIcon"></i></li>
              <li class="hotMainCenterLi" v-bind:class="sortFlag == 2 ? 'aclickLi':''" @click="clickSort(2)">点击率<i class="ico iconfont icon-xiangxiajiantou hplIcon"></i></li>
            </ul>
          </div>
          <div class="hotMainCenterMain">
            <div class="hotRecommendationCenter"  v-for="(service,index) in serviceList" @click='goDetails(service)'>
              <div class="hrcMain">
                <div class="hrcMainLeft">
                  <img :src="service.bg_img">
                </div>
                <div class="hrcMainCenter">
                  <div class="hrcMainCenterTheme">
                    <h3 class="hrmctH">{{service.name}}</h3>
                    <p class="hrmctP">{{service.service_remark}}</p>
                  </div>
                  <div class="editionTime">
                    <div class="editionMain">
                      <span class="spanBanB">标签:</span>
                      <span class="spanBanHao">{{service.service_tag}}</span>
                    </div>
                    <div class="TimeMain">
                      <span class="spanGengGaiTime">发布时间：</span>
                      <span class="spanGengGaiTimeMain">{{service.open_time}}</span>
                    </div>
                  </div>
                </div>
                <div class="hrcMainRight" v-show='service.grade_average != 0'>{{service.grade_average}}分</div>
                <div class="hrcMainRight text" v-show='service.grade_average == 0'>暂无评分</div>
              </div>
            </div>
          </div>
          <!--   <div class="hotMainCenterPage">
              <div id="kkpager"></div>
            </div> -->
            <div class="loadmore" @click="loadMore" v-show='hasData'>加载更多<span class="el-icon-arrow-down"></span></div>
            <div class="loadmore" v-show='!hasData'>暂无更多数据</div>
          </div>
        </div>
      </div>
    </div>
    <footer-box></footer-box>
  </div>

</template>
<script>
  import loadColor from '../../common/skinColor.js'
import apiToken from '../../../publicJs/apiToken.js'
import apiClient from '../../../publicJs/ApiClient.js'
import UtilService from '../../../publicJs/UtilService.js'
import TipBoxService from '../../../publicJs/TipBoxService.js'
import LoadingBoxService from '../../../publicJs/LoadingBoxService.js'
import search from './appSearch.vue'
  import footerBox from './footer.vue'
  import topHeader from '../../../publicComponent/topHeader.vue'
  import tool from '../../common/public.js'
  import userService from '../../../publicJs/userService.js'
  import Util from '../../../publicJs/UtilService.js'
  import appPublicJs from '../../common/public.js'
  export default {
    name: 'appHomes',
    data () {
      return {
        tags: '',
        tokenId: null,
        hasData: true,
        act: 10,
        userInfo: {
          ID_CARD_SCAN_BACK: '',
          PHONE: '',
          IMAGE: '',
          ID: ''
        },
        noopsycheList: [], // 智能搜索列表
        commentList: [], // 好评率列表
        clickNumList: [], // 点击量列表
        sortFlag: 0, // 0.智能搜索，1.好评率，2点击量
        serviceList: [], // 搜索返回服务列表
				 targsList: [], // 搜索框下方标签
        searchKeyWord: '', // 搜索关键词
        pageSize: 10, // 一页查询条数
        pageNum: 1, // 页码
        status: 0, // 0.智能搜索，1.好评率，2点击量
        startTime: '',
        endTime: ''

      }
    },

    created () {
      this.userInfo.PHONE = userService.getUsername()
      this.tokenId = this.$route.query.tokenId || userService.getTokenId()
      if (this.tokenId != undefined) {
        userService.storeInfo('tokenId', this.tokenId)
      }
    },

    mounted () {
      var data = new Date()
      this.endTime = UtilService.formatDuring(data.getTime(), 'yyyy-MM-dd')
      data.setMonth(data.getMonth() - 1)
      this.startTime = UtilService.formatDuring(data.getTime(), 'yyyy-MM-dd')
      this.searchKeyWord = this.$route.query.searchKeyWord
      this.searchService()
      this.getTargsList()
    },
    components: {
      search,
      footerBox,
      topHeader
    },
    methods: {
    /* 查询标签 */
      getTargsList () {
        let that = this
        let param = {query: this.searchKeyWord }
        apiClient.get(apiToken.newApi('appmarket/atomic/getAtomicQueryLable/'), param, function (data) {
          if (tool.checkData(data.results.data)) {
            that.targsList = data.results.data
            that.targsList.unshift('全部')
          } else {
            that.targsList = []
          }
        })
      },
    /* 点击标签查询 */
      clickTags (tags, index) {
        this.tags = tags
        this.searchService()
//    console.info('sasa',index)
        this.act = index
      },
    /* 到详情页面 */
      goDetails (service) {
        console.log(service.id)
        this.$router.push({name: 'appServiceDetail', query: {id: service.id, templateId: window.configinfo.configId}})
      },
      clickSort (num) {
        this.sortFlag = num
        if (num == 1) {
          this.status = 1
          this.searchService()
        } else if (num == 2) {
          this.status = 2
          this.searchService()
        } else {
          this.status = 0
          this.searchService()
        }
      },
      queryData (data) {
        if (data.trim() != '') {
          this.act = 0
          this.searchKeyWord = data
          this.tags = ''
          this.pageNum = 1
          this.searchService()
          this.$router.push({name: 'appSearchList', query: {searchKeyWord: this.searchKeyWord}})
        }
      },
      searchService (sta) {
        if (sta == -1) {
          this.pageNum++
        } else {
          this.pageNum = 1
          this.serviceList = []
        }

        this.getTargsList()
        var that = this
        if (that.tags == '全部') {
          that.tags = ''
        }
        var param = {
          pageSize: that.pageSize,
          pageNum: that.pageNum,
          status: that.status,
          query: that.searchKeyWord,
          tag: that.tags
   					// startTime:that.startTime,
					// endTime:that.endTime
        }
        LoadingBoxService.open('加载中...')
        apiClient.get(apiToken.newApi('appmarket/atomic/getAtomicQueryList/'), param, function (data) {
          LoadingBoxService.close()
          console.log('是数据啊啊啊啊啊', data)
          var totle = data.results.total
          if (data.results.data && data.results.data.length > 0) {
            if (sta == -1) {
              for (var i = 0; i < data.results.data.length; i++) {
                        // data.results.data[i].service_tag= data.results.data[i].service_tag.join(',')
                that.serviceList.push(data.results.data[i])
              }
            } else {
              that.serviceList = data.results.data
            }
            that.hasData = true
            for (var i = 0; i < that.serviceList.length; i++) {
              if (tool.checkData(that.serviceList[i].service_tag)) {
                that.serviceList[i].service_tag = that.serviceList[i].service_tag.join(',')
              }
              if (that.serviceList[i].bg_img == '') {
                that.serviceList[i].bg_img = 'favicon.png'
              }
              if (that.serviceList[i].bg_img.indexOf('http') < 0) {
                that.serviceList[i].bg_img = apiClient.apiBaseUrl + appPublicJs.serviceImgShow + that.serviceList[i].bg_img + '&token=' + apiClient.token
                if (that.serviceList[i].open_time != undefined && that.serviceList[i].open_time != '暂无') {
                  that.serviceList[i].open_time = Util.formatDuring(that.serviceList[i].open_time, 'yyyy-MM-dd')
                } else {
                  that.serviceList[i].open_time = '暂无'
                }
              }

              if (that.status == 1) {
                that.commentList.push(that.serviceList[i])
              } else if (that.status == 2) {
                that.clickNumList.push(that.serviceList[i])
              } else {
                that.noopsycheList.push(that.serviceList[i])
              }
            }
          } else {
            that.hasData = false
          };
          if (totle / that.pageSize < that.pageNum || totle / that.pageSize == that.pageNum) {
            that.hasData = false
          }
        })
      },
      loadMore () {
        this.searchService(-1)
      }
    }
  }
</script>

<style scoped>
.loadmore{
    text-align: center;
    width: 100%;
    height: 30px;
    margin: 0 auto;
    font-size: 14px;
    line-height: 30px;
    cursor: pointer;
  }

.publicMain1{
    position: relative;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    padding-top: 50px;
    background: #ffffff;
    min-height:455px;
  }
.Scroll{
    height: 100%;
    box-sizing: border-box;
    padding-bottom: 207px;
  }
.bodyBox1{
    min-height: 100%
  }
 
.hrcMainRight.text{
    font-size: 12px;
  }

.hotLi .hotLiA:hover{
    color:#fb6233
}
.hotLi{
    float: left;
    height: 35px;
    line-height: 35px;
    font-size: 14px;
    min-width: 80px;
    position: relative;
    padding-left: 15px;
}
.hotLi em{
    min-width: 80px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: inline-block;
    height: 35px; 
    font-style: normal;
}
.hotLi:hover .hotLiA {
    position: absolute;
    left: 15px;
    top:0;
    background-color: #fff;
    width: auto;
    color:#fb6233;
    white-space: nowrap;
    z-index: 99;
    padding-right: 5px;
}
.hotLi .hotLiA{
    display: inline-block;
    width: 80px;
    height: 35px;
    color: #333333;
    transition: all .3s;
}
.hotLi.active a{
	color:#fb6233;
}
.hotLi .hotLiA.aclick{
    color:#fb6233
}

/*内容-热门推荐*/
.hotRecommendationMain{
    width: 1200px;
    height: auto;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    padding-top: 15px;
    margin: 0 auto;
}
.hotRecommendationTop{
    height: 100px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    border: 1px solid #e0e0e0;
    border-radius: 2px;
    box-shadow: -1px 2px 5px #e0e0e0;
    margin-bottom: 13px;
}
.hotHead{
    background: #fafafa;
    font-size: 14px;
    color: #333333;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    height: 50px;
    line-height:50px;
    font-weight: 600;
    padding-left: 15px;
    margin-bottom: 5px;
}
.hotMain{
    height: 35px;
    line-height: 35px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    padding-left: 15px;
}
.hotSpanLab{
    display: block;
    float: left;
    width: auto;
    font-size: 14px;
    color: #333333;
    font-weight: 600;
    line-height: 35px;
}
.hotUl{
    float: left;
    line-height: 35px;
}



.hotRecommendationMainCenter{
    height: auto;
}
.hotMainCenterTop{
    height: 50px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    border: 1px solid #ededee;
    background: #fafafa;
    border-radius: 2px;
    box-shadow: -1px 2px 5px #ededee;
    margin-bottom: 13px;
}
.hotMainCenterUl{
    height: 48px;
    line-height: 48px;
}
.hotMainCenterTop .hotMainCenterLi{
    line-height: 48px;
    float: left;
    padding: 0 20px;
    border-right: 1px solid transparent;
    border-left: 1px solid transparent;
    cursor: pointer;
    font-size: 14px;
}
.hotMainCenterTop .hotMainCenterLi.aclickLi{
    background: #ffffff;
    border-color: #ededee;
    color: #fb6233;
}
.hotMainCenterMain{
    height: auto;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    border: 1px solid #ededee;
    border-radius: 2px;
    box-shadow: 1px 2px 5px #ededed;
    margin-bottom: 10px;
}
.hotRecommendationCenter{
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    padding: 0 15px;
    min-height: 160px;
    cursor: pointer;
    background: #ffffff;
    border: 1px solid transparent;
}
.hotRecommendationCenter:hover{
    position: relative;
    z-index: 99;
    box-shadow: 0px 6px 20px #e5e5e5;
    border-color:#eeeeee;
}
.hrcMain{
    width: 100%;
    height: auto;
    padding: 15px 0;
    border-bottom: 1px dashed #eeeeee;
    overflow: hidden;
}
.hrcMainLeft{
    width: 207px;
    height: 132px;
    float: left;
    border-radius: 2px;
    overflow: hidden;
    margin: -1px;
    border-radius: 6px;
}
.hrcMainLeft>img{
    width: 205px;
    height: 130px;
    border-radius: 6px;
}
.hrcMainCenter{
    width: 70%;
    height: 100%;
    float: left;
    margin-left: 20px;
}
.hrcMainCenterTheme{
    min-height: 100px;
}
.hrmctH{
    font-size: 16px;
    color: #333333;
    height: 30px;
    line-height: 30px;
    font-weight: 600;
    margin-bottom: 10px;
}
.hrmctP{
    line-height: 20px;
    font-size: 14px;
    color: #666666;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    word-break: break-all;
}
.editionTime{
    height: 30px;
    line-height: 30px;
}
.editionMain{
    float: left;
    line-height: 30px;
    font-size: 14px;
}
.spanBanB{
    display: inline-block;
    color: #666666;
}
.spanBanHao{
    display: inline-block;
    color: #666;
}
.spanGengGaiTimeMain{
    color: #666;
}
.spanGengGaiTime{
    display: inline-block;
    color: #666;
}
.TimeMain,.spanGengGaiTimeMain{
    float: right;
    line-height: 30px;
}
.hrcMainRight{
    float: right;
    width: 10%;
    min-height: 130px;
    text-align: center;
    line-height: 130px;
    font-size: 18px;
    color: #ff6666;
}
.hotMainCenterPage{
    height: 55px;
    padding-top: 5px;
}
.hotMainCenterPage #kkpager{
    padding-left: 32%;
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
