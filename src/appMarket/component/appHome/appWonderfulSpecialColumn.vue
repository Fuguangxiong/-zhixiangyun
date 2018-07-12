<template>
	<div class="bodyMain App">
		<div class="bodyBox">
			<top-header :tokenId="tokenId" :userName="userInfo.PHONE" ></top-header>
			<div class="publicMain Scroll">
				<!--搜索-->
				<search @event='queryData'></search> 
				<!--精彩专题列内容-->
				<div class="wonderfulSpecialColumn">
					<div class="wonderfulSpecialColumnTitle">
						<span class="wscApplicationMarket">应用市场</span>
						<span class="wscSpanText">· 精彩专题列表</span>
					</div>
					<div class="wonderfulSpecialColumnMain" v-for="list in subjectDetailList">
						<div class="wonderfulSpecialColumnMainTop">
							<i class="ico iconfont icon-chuangyi iconChuangYi"></i>
							<span class="spanTitle">{{list.title}}</span>
							<a href="javascript:;" class="viewAll" @click="subjectMore(list)">查看全部>></a>
						</div>
						<div :class="{wonderfulSpecialColumnMainCenter:list.atomics.length==0}">
							<div class="msg" v-show='list.atomics.length==0'>此专题暂无服务</div>
							<div class="row">
								<div class="col-md-4 wsccmcModular" v-for="listIn in list.atomics" @click="appServiceDetail(listIn.id)">
									<div class="wsccmcModularTop">
										<div class="wsccmcModularTopLeft">
											<img v-lazy="listIn.bg_img">
										</div>
										<div class="wsccmcModularTopRight">
											<h3  class="wmtrTitle ellipsisYc">{{listIn.name}}</h3>
											<div class="editionAndUpdate">
												<p class="editionP tag" :title='listIn.service_tag'>标签：{{listIn.service_tag}}</p>
												<p class="UpdateP">发布时间：{{listIn.open_time}}</p>
											</div>
										</div>
									</div>
									<p class="wsccmcModularMainP wordBreakDh">{{listIn.service_remark}}</p>
								</div>							
							</div>
						</div>
					</div>
					<div class="wonderfulSpecialColumnMainBottom" @click="showMore" v-show='hasData'>加载更多<span class="el-icon-arrow-down"></span></div>
					<div class="wonderfulSpecialColumnMainBottom" v-show='!hasData'>暂无更多数据</div>
					<div class="hotMainCenterPage">
						<div id="kkpager"></div>
					</div>
				</div>

			</div>
		</div>
		<footer-box></footer-box>
	</div>
</template>

<script>
	import topHeader from '../../../publicComponent/topHeader.vue'
	import footerBox from './footer.vue'
	import apiToken from '../../../publicJs/apiToken.js'
	import apiClient from '../../../publicJs/ApiClient.js'
	import TipBoxService from '../../../publicJs/TipBoxService.js'
	import LoadingBoxService from '../../../publicJs/LoadingBoxService.js'
	import search from './appSearch.vue'
	import userService from '../../../publicJs/userService.js'
	import Util from '../../../publicJs/UtilService.js'
	import appPublicJs from '../../common/public.js'
	export default {
	  name: 'appWonderfulSpecialColumn',
	  data () {
	    return {
	      searchKeyWord: '',
	      subjectDetailList: [], // 列表专题
	      atomics: [],
	      pageNum: 1,
	      hasData: true,
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
	  created () {
	    this.tokenId = userService.getTokenId()
	    this.userInfo.PHONE = userService.getUsername()
	  },
		// 获取数据
	  mounted () {
	    this.configId = this.$route.query.configId
	    this.showMore()
	  },
	  methods: {
	
	    queryData (data) {
	      this.searchKeyWord = data
	      if (data.trim() != '') {
	        this.searchService()
	      }
	    },
	    subjectMore (list) { // 查看更多路由跳转带id
	      let that = this
	      if (list.tags.length > 1) {
	        list.tags = list.tags.join(',')
	      } else {
	        list.tags = list.tags[0]
	      }
	      that.$router.push({ path: '/appFinancialEducationSeries', query: {id: list.id, tag: list.tags}})
	    },
	    searchService () {
	      let that = this
	      that.$router.push({ path: '/appSearchList', query: {searchKeyWord: this.searchKeyWord } })
	    },
	    clickTags (targs) {
	      this.searchKeyWord = targs
	      this.searchService()
	    },
	    appServiceDetail (id) { // 详情页路由调用
	      let that = this
	      that.$router.push({ path: '/appServiceDetail', query: { id: id, templateId: window.configinfo.configId } })
	    },
	    showMore () { // 加载更多
	      LoadingBoxService.open('数据加载中...')
	      var that = this
	      var myData = {
	        'templateId': window.configinfo.configId,
	        'contentType': 'subject',
	        'pageSize': '6',
	        'pageNum': this.pageNum,
	        'status': this.status
	      }
	      console.info(this.list)
	      apiClient.get(apiToken.newApi('appmarket/content/getCotentBySubjectToShow/'), myData, function (data) {
	        LoadingBoxService.close()
	        if (appPublicJs.checkData(data.results.data)) {
	          var list = data.results.data
	          that.hasData = true
	          var subjectDetailListLength = list.length
	          for (var i = 0; i < subjectDetailListLength; i++) {
	            var atomicsLength = list[i].atomics.length
	            for (var j = 0; j < atomicsLength; j++) {
	              list[i].atomics[j].service_tag = 	list[i].atomics[j].service_tag.join(',')
	              list[i].atomics[j].bg_img = apiClient.apiBaseUrl + appPublicJs.serviceImgShow + list[i].atomics[j].bg_img + '&token=' + apiClient.token
	              if (list[i].atomics[j].open_time != undefined && list[i].atomics[j].open_time != '暂无') {
	                list[i].atomics[j].open_time = Util.formatDuring(list[i].atomics[j].open_time, 'yyyy-MM-dd')
	              } else {
	                list[i].atomics[j].open_time = '暂无'
	              }
            }
	            that.subjectDetailList.push(list[i])
	          }
	        } else {
	          that.hasData = false
	        }
	      })
	      that.pageNum++
	    }

	  }
	}
</script>
<style scoped>
.msg{
    margin-top: 200px;
    font-size: 16px;
    text-align: center;
}
.wonderfulSpecialColumn{
    width: 1200px;
    height: auto;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    padding-top: 15px;
    margin: 0 auto;
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
    line-height: 50px;
    color: #666666;
}
.wscSpanText{
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
.spanTitle{
    display: block;
    font-size: 16px;
    color: #fb6233;
    font-weight: 600;
    float: left;
    line-height:40px;
}
.viewAll{
    display: block;
    float: right;
    line-height: 35px;
    font-size: 12px;
    color: #333333;
}
.viewAll:hover{
    color: #fb6233;
}
.wonderfulSpecialColumnMainCenter{
    height: 421px;
    border: 1px solid #ededee;
}
.wsccmcModular{
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    border: 1px solid #ededed;
    padding-top: 15px;
    padding-bottom: 15px;
    min-height: 210px;
    cursor: pointer;
}
.wsccmcModular:hover{
    position: relative;
    z-index: 22;
    box-shadow: 0px 3px 10px #e5e5e5;
}
.wsccmcModularTop{
    height: 120px;
}
.wsccmcModularTopLeft{
    width: 180px;
    height: 110px;
    float: left;
    margin-right: 15px;
    background: #ccc;
    border-radius: 4px;
    overflow: hidden;
}
.wsccmcModularTopLeft>img{
        width: 180px;
    height: 110px;
}
.wsccmcModularTopRight{
    width: 45%;
    height: 100%;
    float: left;
}
.wsccmcModularTopRight>.wmtrTitle{
	cursor: pointer;
}
.wmtrTitle{
    font-size: 14px;
    color: #333333;
    font-weight: 600;
    margin-bottom: 50px;
}

.editionP.tag{
        overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 150px;
}
.editionP,.UpdateP{
    line-height: 25px;
    font-size: 12px;
    color: #666666;
}
.wsccmcModularMainP{
    line-height: 20px;
    font-size: 14px;
    color: #333333;
    margin-top: 15px;
    cursor: pointer;
}
.wonderfulSpecialColumnMainBottom{
	height:40px;
	width:100%;
	line-height: 40px;
	text-align: center;
	font-size: 13px;
	cursor: pointer;
    margin-bottom:10px;
	border: 1px solid #ededee;
}
.wonderfulSpecialColumnMainBottom:hover{
	box-shadow: 0px 3px 3px #e5e5e5;
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

.ellipsisYc{
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
}
.wordBreakDh{
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    word-break: break-all;
    padding-left: 15px;
}
.wordBreakDh4{
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
    word-break: break-all;
}
.bodyBox{
	min-height: 100%;
	box-sizing: border-box;
	padding-bottom: 207px;
}
.bodyMain{
    position: relative;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    padding-top: 30px;
  	/* width:100%; */
    height: 100%;
    /* overflow-y: auto; */
}
.publicMain{
    position: relative;
    /*height:100%;*/
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
/*    padding: 0 6%; */
}
.bottomFooter1{
	margin-top: -217px;
}
</style>

