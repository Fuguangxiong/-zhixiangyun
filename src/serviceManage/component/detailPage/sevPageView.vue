<template>
	<!-- 主题内容菜单 -->
	<div class="boxBody" id="boxBody">
		<top-header :tokenId="tokenId" :userName="userInfo.PHONE"></top-header>
		<div class="boxst">
	        <div class="timc-head brbgbs">
	            <div class="timc-title">	                                 
	                <span id="title" /> {{title}} </span>
	                <hr/>                             
	            </div>
	            <div class="timc-text" >
	            	<span id="sevRemark" /> {{sevRemark}} </span>	
	            </div>
	        </div>
	        <div class="timc-err" v-if="dataErr !=undefined && dataErr !='' ">
	            <div class="timc-err-title">
	            	<span>有服务返回异常，异常信息：</span>
	            </div>
				<div class="timc-err-txt">	            	
	            	<span id="dataErr" /> {{dataErr}} </span>
	            </div>
	        </div>
			<div class="timc-chlie brbgbs" v-for="areas in serverList">				
				<div class="chitiem">
					<div class="col-md"  v-for="(sev,index) in areas.sevs" :id="sev.pos_id" :style="{'width':sev.width,'padding-right':sev.right}">
						<div class="wiclie-t">
							<div style="height:40px;" class="rowtitle">
								<h2 style="float: left;">{{sev.label}}</h2>
							</div>							
							<div :id="'json_'+sev.pos_id" class="rowContent" :style="{'height':sev.height}" v-if="sev.type==='3' && sev.errmsg != ''">
								<span style="color: #f1592a;font-weight:bold;" >{{sev.errmsg}}</span>
							</div>
							<div :id="'json_'+sev.pos_id" class="rowContent" :style="{'height':sev.height}" v-else-if="sev.type==='3' && sev.errmsg == ''" v-html="sev.jsonData"></div>
							<div v-else-if="sev.type==='2'">
								<iframe v-if="sev.method=='get'" class="iframeBox" frameborder="no"  border="0" seamless='seamless' width='100%'							 
								  :height='sev.height' :id='"iframe_"+sev.pos_id' :src='sev.url' ></iframe>
								<iframe v-if="sev.method=='post'" class="iframeBox" frameborder="no"  border="0" 							 
								 seamless='seamless' width='100%' :height='sev.height' :name='"iframe_"+sev.pos_id' ></iframe>
								<form v-if="sev.method=='post' && sev.charset != '' " :target='"iframe_"+sev.pos_id' :id='"form_"+sev.pos_id' :name='"form_"+sev.pos_id' :accept-charset='sev.charset' 
									v-bind:method="sev.method" v-bind:action="sev.url" >
									<input type="hidden" v-for="ipd in sev.inputData"  :name="ipd.key" v-model="ipd.value">
								</form>
								<form v-if="sev.method=='post' && sev.charset == '' " :target='"iframe_"+sev.pos_id' :id='"form_"+sev.pos_id' :name='"form_"+sev.pos_id' :accept-charset='sev.charset' 
									v-bind:method="sev.method" v-bind:action="sev.url" >
									<input type="hidden" v-for="ipd in sev.inputData"  :name="ipd.key" v-model="ipd.value">
								</form> 
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>		
	</div>	
	<!-- /主题内容菜单 end -->
</template>

<script>
// import '../../css/common/public.css';
import Bootstrap from 'bootstrap/dist/js/bootstrap.min.js'
import JqUI from '../../lib/jquery-ui.min.js'
import JSONFormat from '../../lib/jquery.json.format.js'
import JSONLint from '../../lib/jsonlint.js'
/**	import Nicescroll from '../../lib/jquery.nicescroll.min.js' */
import TipBoxService from '../common/TipBoxService.js'
import NoticeBoxService from '../../../publicJs/NoticeBoxService.js'
import apiToken from '../../../publicJs/apiToken.js'
import apiClient from '../../../publicJs/ApiClient.js'
import LoadingBoxService from '../../../publicJs/LoadingBoxService.js'
import topHeader from '../../../publicComponent/topHeader.vue'
import userService from '../../../publicJs/userService.js'
import UtilService from '../../../publicJs/UtilService.js'
export default {
  name: 'sevPageView',
  components: {},
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
      // sev_id: this.$route.query.params,
      sev_id: sessionStorage.getItem(this.$route.query.params),
      title: '',
      sevRemark: '',
      serverList: [],
      iforms: {},
      dataErr: '',
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
    this.tokenId = userService.getTokenId()
    this.userInfo.PHONE = userService.getUsername()
  },
  mounted () {
    this.loadServices()
    this.setContent()
  },
  /**	updated(){
			$(".iframeBox").niceScroll({cursorborder:"",cursorcolor:"#999999",boxzoom:true});
		}, */
  methods: {
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
      var params = sessionStorage.getItem(this.$route.query.params)
      LoadingBoxService.open('正在加载数据，请稍候...')
      if (params != undefined && params != '') {
        apiClient.post('itsmApi/combination/doInvokeCombinationService', JSON.parse(params), function (data) {
         // debugger
          LoadingBoxService.close()
          if (data.status == 200 || data.status == 201) {
            that.sev_id = data.results.sevId
            that.title = data.results.title
            that.sevRemark = data.results.serviceBrief
              // 当前先显示第一条错误信息
            if (data.results.errorInfo != undefined && data.results.errorInfo.length > 0) {
              that.dataErr = data.results.errorInfo[0].errorInfo
            }
            UtilService.resetDocumentTitle(that.title)
            var _serverList = data.results.serverList
            var l_serverList = []
            var iforms = new Array()
            if (_serverList != undefined && !$.isEmptyObject(_serverList)) {
              for (var i = 0; i < _serverList.length; i++) {
                var areas = {}
                areas.id = _serverList[i].id
                areas.title = _serverList[i].title
                var _sevs = JSON.parse(_serverList[i].sevs)
                console.log(_sevs)
                var sevs = []
                var slength = _sevs.length
                for (var k = 0; k < slength; k++) {
                  var sev = {}
                  sev.sev_id = _sevs[k].sev_id
                  sev.pos_id = _sevs[k].pos_id
                  var width = _sevs[k].mwidth
                  if (parseFloat(width) >= parseFloat('90%')) {
                    width = '100%'
                  }
                  if (parseInt(slength) > 1 && k == 0) {
                    sev.right = '10px'
                  } else {
                    sev.right = '0px'
                  }
                  sev.width = width
                  sev.height = _sevs[k].mheight
                  sev.label = _sevs[k].label
                  sev.type = _sevs[k].stype
                  sev.jsonData = ''
                  sev.errmsg = ''

                  sevs[k] = sev
                  if (_sevs[k].stype == '3') {
                    if (_sevs[k].data == undefined) {
                      sev.errmsg = '#后台出现异常#'
                    } else {
                      try {
                        var _jsonStr = JSON.stringify(_sevs[k].data)
                        JSONLint.jsonlint.parse(_jsonStr)
                        var _jsonData = JSONFormat.JSONFormat.format2(
                            _jsonStr,
                            4
                          )
                        sev.jsonData = _jsonData
                      } catch (e) {
                        sev.errmsg = '#数据格式异常#' + e
                      }
                    }
                  } else if (_sevs[k].stype == '2') {
                    var _pageData = _sevs[k].data

                    sev.pageData = _pageData
                    sev.method = _pageData.requestType
                    var sid = sev.sev_id.substring(0, sev.sev_id.indexOf('_'))
                    sev.url = '/service_2/' + sid + _pageData.pageUrl
                    if (sev.method == 'post') {
                      sev.inputData = _pageData.inputData
                      sev.charset = ''
                      if (
                          _pageData.charset != undefined &&
                          _pageData.charset != null
                        ) {
                        sev.charset = _pageData.charset
                      }
                      iforms.push('form_' + _sevs[k].pos_id)
                    }
                  }
                }
                areas.sevs = sevs
                l_serverList[i] = areas
              }

              that.serverList = l_serverList
              that.iforms = iforms
            }
            $('.boxst').delegate('.hideTag', 'click', function () {
              JSONFormat.hide(this)
            })
            $('.boxst').delegate('.showTag', 'click', function () {
              JSONFormat.show(this)
            })
          } else {
            LoadingBoxService.close()
            TipBoxService.open(data.exception, 2)
          }
        }).catch(error => {
          LoadingBoxService.close()
          if (error.response.data.exception) {
            TipBoxService.open(error.response.data.exception, 2)
          }
          throw error
        })
      } else {
        LoadingBoxService.close()
        TipBoxService.open('调用信息已失效，请重新调用！', 2)
      }
    },
    setContent () {
      var that = this
      this.$watch('iforms', function () {
        // 如果数据仍然不显示，就放开下面的注释
        // that.$nextTick(function () {
        for (var id in that.iforms) {
          var iform = that.iforms[id]
          document.getElementById(iform).submit()
        }
        // });
      })
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style src="../../lib/jquery-ui.custom.min.css" scoped></style>
<style src="../../css/detailPage/sevPageView.css" scoped></style>
<style src="../../css/detailPage/searchInput.css" scoped></style>
<style scoped>
.boxst {
  margin-top: 30px;
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
</style>

