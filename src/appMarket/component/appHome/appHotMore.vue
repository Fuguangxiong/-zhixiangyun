<template>
	<div class="bodyMain App">
		<div class="bodyMainBox">
			<top-header :tokenId="tokenId" :userName="userInfo.PHONE" ></top-header>
		<div class="publicMain Scroll">
			<!--搜索-->			
			<search></search> 		
			<!--热门推荐更多内容-->
			<div class="hotRecommendationMain" >
				<div class="hotRecommendationTop">
					<h3 class="hotHead">{{moreConent}}</h3>
					<div class="hotMain">
						<span class="hotSpanLab">标签：</span>
						<ul class="hotUl">
							<li class="hotLi" @click="clickTag('')">
								<em>
								<a class="hotLiA" href="javascript:;">全部</a>
								</em>
							</li>
							<li class="hotLi" v-for="(tag,index) in tagList" @click="clickTag(tag,index)" :class="{active: active == index}">
								<em>
								<a class="hotLiA" href="javascript:;">{{tag}}</a>
								</em>
							</li>
						</ul>
					</div>
				</div>
				<div class="hotRecommendationMainCenter">
					<div class="hotMainCenterTop">
						<ul class="hotMainCenterUl">
							<li class="hotMainCenterLi" :class="{aclickLi:normalFlag}" @click="toggle(0,'normalFlag')">综合排序</li>
							<li class="hotMainCenterLi" :class="{aclickLi:scoreFlag}" @click="toggle(1,'scoreFlag')">好评率<i class="ico iconfont icon-xiangxiajiantou hplIcon"></i></li>
							<li class="hotMainCenterLi" :class="{aclickLi:rateFlag}" @click="toggle(2,'rateFlag')">点击率<i class="ico iconfont icon-xiangxiajiantou hplIcon"></i></li>
						</ul>
					</div>
					<div class="hotMainCenterMain">
						<div class="hotRecommendationCenter"  v-for="(list,index) in listData" @click="toServiceDetail(list.id)">
							<div class="hrcMain">
								<div class="hrcMainLeft">
									<img v-lazy="imgSrc[index]" >
								</div>
								<div class="hrcMainCenter">
									<div class="hrcMainCenterTheme">
										<h3 class="hrmctH" :title='list.name'>{{list.name}}</h3>
										<p class="hrmctP" :title='list.service_remark'>{{list.service_remark}}</p>
									</div>
									<div class="editionTime">
										<div class="editionMain">
											<span class="spanBanB">标签：</span>
											<span class="spanBanHao">{{list.service_tag}}</span>
										</div>
										<div class="TimeMain">
											<span class="spanGengGaiTime">发布时间：</span>
											<span class="spanGengGaiTimeMain">{{list.open_time}}</span>
										</div>
									</div>
								</div>
								<div class="hrcMainRight" v-show='list.grade_average != 0'>{{list.grade_average}}分</div>
								<div class="hrcMainRight text" v-show='list.grade_average == 0'>暂无评分</div>
							</div>
						</div>
						<div class="loadmore" @click="loadMore" v-show='hasData'>加载更多<span class="el-icon-arrow-down"></span></div>
						<div class="loadmore" v-show='!hasData'>暂无更多数据</div>
					</div>
				</div>
			</div>
		</div>
		</div>
		<div class="footerBox">
			<footer-box></footer-box>
		</div>
	</div>
</template>
<script>
    import loadColor from '../../common/skinColor.js'
import topHeader from '../../../publicComponent/topHeader.vue'
import footerBox from './footer.vue'
import userService from '../../../publicJs/userService.js'
import apiToken from '../../../publicJs/apiToken.js'
import apiClient from '../../../publicJs/ApiClient.js'
import TipBoxService from '../../../publicJs/TipBoxService.js'
import LoadingBoxService from '../../../publicJs/LoadingBoxService.js'
import UtilService from '../../../publicJs/UtilService.js'
import Util from '../../../publicJs/Util.js'
import search from './appSearch.vue'
import appPublicJs from '../../common/public.js'
export default {
  name: '',
  data () {
        return {
          active: -1,
          hasData: true,
          isGoTop: '',
          hotKeyWord: '',
          moreConent: '',
          imgSrc: [],
          listData: [],
          pageNum: 1,
          status: 0,
          normalFlag: true,
          scoreFlag: false,
          rateFlag: false,
          timeArry: [],
          sum: 200,
          pageSize: 10,
          tagList: [],
          queryTag: '',
          tokenId: null,
          configId: '',

          userInfo: {
				      ID_CARD_SCAN_BACK: '',
				      PHONE: '',
				      IMAGE: '',
				      ID: ''
          }
        }
  },
		 components: {
       search,
       topHeader,
       footerBox
     },
  mounted () {
        this.hotKeyWord = this.$route.query.hotKeyWord
        this.hotKeyWord == 1 ? this.moreConent = '热门推荐' : this.moreConent = '新锐应用'
        this.getList()
        this.getHotLable()
  },
		  created () {
        this.configId = this.$route.query.configId
        this.tokenId = userService.getTokenId()
        this.userInfo.PHONE = userService.getUsername()
  },
  methods: {

        clickTag (tag, index) {
          this.queryTag = tag
          this.imgSrc = []
          this.listData = []
          this.timeArry = []
          this.pageNum = 1
          this.getList()
          this.active = index
        },
        getHotLable () {
          this.pageNum = 1
          var that = this
          LoadingBoxService.open('数据加载中...')
          var myData = {
            'templateId': window.configinfo.configId,
            'sum': this.sum
          }
          apiClient.get(apiToken.newApi('appmarket/atomic/getAtomicRecommendLable/'), myData, function (data) {
            LoadingBoxService.close()
            that.tagList = data.results.data
          })
        },
        getList () {
          var that = this
          LoadingBoxService.open('数据加载中...')
          var myData = {
            'templateId': window.configinfo.configId,
            'pageSize': this.pageSize,
            'pageNum': this.pageNum,
            'tag': this.queryTag,
            'sum': this.sum,
            'form': this.hotKeyWord,
            'status': this.status // status 0:默认 1:评分 2：访问量
          }
          apiClient.get(apiToken.newApi('appmarket/atomic/getAtomicRecommendList/'), myData, function (data) {
            LoadingBoxService.close()
					   var totle = data.results.total
					   var data = data.results.data
            if (Util.isArray(data) && data.length > 0) {
              that.hasData = true
              for (var i = 0; i < data.length; i++) {
                data[i].service_tag = data[i].service_tag.join(',')
                that.imgSrc.push(apiClient.apiBaseUrl + appPublicJs.serviceImgShow + data[i].bg_img + '&token=' + apiClient.token)
                data[i].open_time = UtilService.formatDuring(data[i].open_time, 'yyyy-MM-dd')
                that.listData.push(data[i])
              }
            } else {
              that.hasData = false
            }
            if (totle / that.pageSize < that.pageNum || totle / that.pageSize == that.pageNum) {
              that.hasData = false
            }
          })
        },
        loadMore: function () {
          this.pageNum++
          this.getList()
        },
        toServiceDetail: function (id) {
          this.$router.push({
            path: '/appServiceDetail',
            query: {
              id: id,
			  templateId: window.configinfo.configId

            }
          })
        },
        toggle: function (status, flag) {
          this.pageNum = 1
          this.status = status
          this.normalFlag = false
          this.scoreFlag = false
          this.rateFlag = false
          this[flag] = true
          this.imgSrc = [],
				this.listData = [],
				this.timeArry = [],
				this.getList()
        }
  }
}
</script>
<style scoped>
/*内容-热门推荐*/
.hotRecommendationMain{
    width: 1200px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    padding-top: 15px;
    margin: 0 auto;
    min-height: 100%;
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
    padding-left: 60px;
    position: relative;
}
.hotSpanLab{

    width: auto;
    font-size: 14px;
    color: #333333;
    font-weight: 600;
    line-height: 35px;
    position: absolute;
    left: 15px;
    top: 0;
}
.hotUl{
    float: left;
    line-height: 35px;
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
	font-style: normal;
    min-width: 80px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: inline-block;
    height: 35px; 
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
    box-shadow: 0px 1px 20px #e5e5e5;
    border-color:#eeeeee;
}
.hotRecommendationCenter:hover .hrcMain{
	border-bottom: 1px dashed rgba(0,0,0,0);
}
.hrcMain{
    width: 100%;
    height: auto;
    padding: 15px 0;
    border-bottom: 1px dashed #eeeeee;
    overflow: hidden;
    border-bottom: 1px dashed rgba(0,0,0,0.2);
}
.hrcMainLeft{
    width: 205px;
    height: 130px;
    overflow:hidden;
    float: left;
    border-radius: 2px;
}
.hrcMainLeft>img{
    width: 207px;
    height: 132px;
    margin:-1px;
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
.spanBanHao,.spanGengGaiTime{
    display: inline-block;
    color: #666;
}
.TimeMain,.spanGengGaiTimeMain{
    float: right;
    line-height: 30px;

}
.spanGengGaiTimeMain{
    color:#666;
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
.hrcMainRight.text{
	font-size: 12px;
}
.wscSpanText{
    display: inline-block;
    line-height: 50px;
    color: #333333;
}
.bodyMain{
    position: relative;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    padding-top: 30px;
    height: 100%; 
}
.publicMain{
    position: relative;
    min-height:100%;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    overflow-y: auto;
}
.loadmore{
    text-align: center;
    width: 100%;
    height: 30px;
    margin: 15px auto 10px auto;
    font-size: 14px;
    line-height: 30px;
    cursor: pointer;
  }
.bodyMainBox{
    min-height: 100%;
    box-sizing: border-box;
    padding-bottom: 207px;
  }

.footerBox{
    margin-top: -207px;
  } 
</style>
