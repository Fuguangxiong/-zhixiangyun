<template>
	<div class="boxBody" id="boxBody">
		<top-header :tokenId="tokenId" :userName="userInfo.PHONE"></top-header>
		<div class="boxst">
      <!-- title -->
      <!-- <div class="timc-head brbgbs">
          <div class="timc-title">	                                 
              <span id="title" />服务名称：{{sevName}}</span>
          </div>
          <div class="timc-text" >
            <span id="sevRemark" />服务简介：{{sevRemark}}</span>	
          </div>
      </div> -->
      <!-- result -->
			<div class="timc-chlie brbgbs">				
				<div class="chitiem">
					<div class="col-md" :id="this.sev.pos_id" :style="{'width':this.sev.width}">
						<div class="wiclie-t">
							<div class='resultPage'>
								<iframe v-if="this.sev.method=='get'" class="iframeBox" frameborder="no"  border="0" seamless='seamless' width='100%'							 
								  :height='sev.height' :id='"iframe_"+this.sev.pos_id' :src='this.sev.url' ></iframe>
								<iframe v-if="this.sev.method=='post'" class="iframeBox" frameborder="no"  border="0" 							 
								 seamless='seamless' width='100%' :height='sev.height' :name='"iframe_"+sev.pos_id' ></iframe>
								<form v-if="this.sev.method=='post' && this.sev.charset == '' " :target='"iframe_"+sev.pos_id' :id='"form_"+sev.pos_id' :name='"form_"+sev.pos_id' v-bind:method="sev.method" v-bind:action="sev.url" >
									<input type="hidden" v-for="ipd in sev.inputData"  :name="ipd.key" v-model='ipd.value'>
								</form>
								<form v-if="this.sev.method=='post' && this.sev.charset != '' " :target='"iframe_"+sev.pos_id' :id='"form_"+sev.pos_id' :name='"form_"+sev.pos_id' v-bind:method="sev.method" v-bind:action="sev.url" v-bind:accept-charset="sev.charset">
									<input type="hidden" v-for="ipd in sev.inputData"  :name="ipd.key" v-model='ipd.value'>
								</form>
							</div>
						</div>
					</div>
				</div>
			</div>           
		</div>		
	</div>	
</template>

<script>
import Bootstrap from 'bootstrap/dist/js/bootstrap.min.js';
import JqUI from '../../lib/jquery-ui.min.js';
import JSONFormat from '../../lib/jquery.json.format.js';
import JSONLint from '../../lib/jsonlint.js';
import niceScroll from '../../lib/jquery.nicescroll.min.js';
import topHeader from '../../../publicComponent/topHeader.vue';
import userService from '../../../publicJs/userService.js';
import UtilService from '../../../publicJs/UtilService.js';
export default {
  name: 'CommonOutput',
  data () {
    return {
      targsList: [
        '火车票查询',
        '测试',
        '在逃犯罪',
        '办公',
        '人工智能',
        '教育',
        '银行贷款',
        '人工智能',
        '教育'
      ], // 搜索框下方标签
      searchKeyWord: '', // 搜索关键词
      jsonData: '',
      htmlData: '',
      sevName: '',
      sevRemark: '',
      sev: {},
      iforms: {},
      serviceType: '', // 服务调用第几种方式
      tokenId: '',
      userInfo: {
        ID_CARD_SCAN_BACK: '',
        PHONE: '',
        IMAGE: '',
        ID: ''
      }
    }
  },
  components: {
    topHeader
  },
  created () {
    var that = this
    that.tokenId = userService.getTokenId()
    that.userInfo.PHONE = userService.getUsername()
    // this.jsonData = this.$route.query.outputData;
    // this.htmlData = this.$route.query.outputData;
    // var data = that.$route.query.serviceInfo;
    that.jsonData = sessionStorage.getItem(that.$route.query.outputData)
    that.htmlData = sessionStorage.getItem(that.$route.query.outputData)
    var data = sessionStorage.getItem(that.$route.query.serviceInfo)
    if (data != '') {
      var json = JSON.parse(data)
      that.sevName = json.name
      that.sevRemark = json.serviceBrief
      that.sev.pos_id = json.serviceId
      that.serviceType = json.serviceType
      UtilService.resetDocumentTitle(that.sevName)
    }
    that.loadServices()
  },
  watch: {
    iforms (curVal, oldVal) {
      // 如果数据仍然不显示，就放开下面的注释
      // that.$nextTick(function () {
      console.log('iforms已有数据----' + JSON.stringify(this.iforms))
      for (var id in this.iforms) {
        var iform = this.iforms[id]
        document.getElementById(iform).submit()
      }
      // });
    }
  },
  mounted () {
    $('.boxst').delegate('.hideTag', 'click', function () {
      JSONFormat.hide(this)
    })

    $('.boxst').delegate('.showTag', 'click', function () {
      JSONFormat.show(this)
    })
    var vm = this
    $(window).resize(function () {
      vm.resizeCallback()
    })

    this.resizeCallback()
  },

  updated () {
    $('.iframeBox').niceScroll({
      cursorborder: '',
      cursorcolor: '#999999',
      boxzoom: true
    })
  },
  methods: {
    resizeCallback () {
      var winHeight = document.documentElement.clientHeight,
        targetTop = $('.resultPage').offset().top
      // $(".resultPage").height(winHeight - targetTop - 15);
      $('.resultPage').height(winHeight - 30)
      $('.resultPage>iframe').height($('.resultPage').height())
    },
    searchService () {
      let that = this
      that.$router.push({
        path: '/appSearchList',
        query: { searchKeyWord: this.searchKeyWord }
      })
    },
    clickTags (targs) {
      this.searchKeyWord = targs
      this.searchService()
    },
    loadServices () {
      var that = this
      var type = this.$route.query.type

      that.sev.width = '100%';
      that.sev.height = '600px';
      if (that.htmlData == '') {
        sev.errmsg = '#后台出现异常#';
        return
      }
      var _pageData = JSON.parse(that.htmlData)
      console.log('j----', JSON.stringify(_pageData))
      that.sev.pageData = _pageData
      that.sev.method = _pageData.requestType

      that.sev.url =
        '/service_' +
        that.serviceType +
        '/' +
        that.sev.pos_id +
        _pageData.pageUrl

      if (that.sev.method == 'post') {
        that.sev.inputData = _pageData.inputData
        that.sev.charset = _pageData.charset
        var iforms = new Array()
        iforms.push('form_' + that.sev.pos_id)
        console.log('iforms增加数据----=form_' + that.sev.pos_id)
        that.iforms = iforms
        console.log('that.iforms增加数据后------' + JSON.stringify(that.iforms))
        //alert(document.getElementById("form_"+that.sev.pos_id).length);
        //document.getElementById("form_"+that.sev.pos_id).submit();
      }
    }
  }
}
</script>
<style src="../../css/common/public.css" scoped></style>
<style src="../../lib/jquery-ui.custom.min.css" scoped></style>
<style src="../../css/detailPage/sevPageView.css" scoped></style>
<style src="../../css/detailPage/searchInput.css" scoped></style>
<style scoped>
.boxst {
  margin: 30px auto 0 auto;
  width: 100%;
  height: auto;
}
.timc-head {
  border: 1px solid #f1f8fe;
  padding: 15px 20px;
}
.brbgbs {
  box-shadow: none !important;
  -webkit-box-shadow: none !important;
}
.timc-title {
  font-size: 14px;
  padding: 0;
  font-weight: 500;
}
.timc-text {
  line-height: 1.5;
  margin-top: 10px;
  font-size: 14px;
}
.chitiem .wiclie-t h2 {
  height: 30px;
  line-height: 30px;
  padding-left: 10px;
  padding-right: 10px;
  font-size: 14px;
  position: relative;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
}
.resultPage {
  /* background: #fbfbfb; */
  /* border: 1px solid #f1f8fe;
  padding: 15px; */
  /* margin-top: 15px; */
}
.resultPage>iframe{
  width:100%;
  height:100%;
  overflow: auto;
}
</style>

