<template>
  <div class="boxBody" id="boxBody">
    <top-header :tokenId="tokenId" :userName="userInfo.PHONE"></top-header>
	  <div class="boxst invoke" :class='resultStyle==="data"? "invoke-data":"invoke-page"'>
      <div id="inputData" class='invoke-input'>
        <div class='invoke-input-title'>· {{results.serviceInfo.name}} ·<i class="glyphicon glyphicon-question-sign" @click="openInfo(results.serviceInfo.serviceRemark)"></i></div>
        <div class='invoke-input-tip'>说明：{{results.serviceInfo.serviceBrief}}</div>
        <form method="post">
          <table cellspacing="0" cellpadding="0" align="center" rules="rows" class="personForm" >
            <tr v-for="(item,index) in results.data" key='index'>
                <th class="key1"><span v-if="item.isRequired || item.isRequired == undefined" class="required">*</span>
                <el-tooltip placement="bottom">
                  <div slot="content">{{item.describe}}</div>
                  <el-button style="border: 0px solid #c4c4c4;">{{item.describeInfo}}：</el-button>
                </el-tooltip></th>
                <td class="value borderLeft">
                  <input name="item" :class='{wrong:(item.isRequired || item.isRequired == undefined) && isNull && (item.value == undefined || item.value == "")}' v-if="item.param_type!='2'" type="text" v-model="item.value" />
                  <textarea name="item" :class='{wrong:(item.isRequired || item.isRequired == undefined) && isNull && (item.value == undefined || item.value == "")}' v-if="item.param_type=='2'" v-model="item.value" rows="10" cols="50"></textarea>
                  <span v-if='(item.isRequired || item.isRequired == undefined) && isNull && (item.value == undefined || item.value == "")' class="error">参数{{item.describe}}为必输参数，不能为空</span>
                  <!-- 用于只有一个input时，回车会刷新页面 -->
                  <input type="text" style="display:none" />
                </td>
            </tr>
          </table>
            <input id="hiddenText" type="text" style="display:none" />
            <div class="formEnd">
              <button type="button" class="btn" @click="sumitBtnHandler">提 交</button>
          </div>
        </form>
      </div>
      <div class="timc-chlie brbgbs invoke-outPut" id="resultData" v-if='resultStyle=="data"'>				
        <div class="rowtitle">获取的数据</div>							
        <div class="rowContent"></div>
			</div>
		</div>
	</div>	
</template>

<script>
// import '../../css/common/public.css';
import topHeader from '../../../publicComponent/topHeader.vue'
import TipBoxService from '../common/TipBoxService.js'
import LoadingBoxService from '../../../publicJs/LoadingBoxService.js'
import userService from '../../../publicJs/userService.js'
import apiToken from '../../../publicJs/apiToken.js'
import apiClient from '../../../publicJs/ApiClient.js'
import Bootstrap from 'bootstrap/dist/js/bootstrap.min.js'
import JqUI from '../../lib/jquery-ui.min.js'
import JSONFormat from '../../lib/jquery.json.format.js'
import JSONLint from '../../lib/jsonlint.js'
import niceScroll from '../../lib/jquery.nicescroll.min.js'
import UtilService from '../../../publicJs/UtilService.js'

export default {
  name: 'Invoke',
  data () {
    return {
      isNull: '',
      tokenId: '',
      serviceId: '',
      results: {
        data: {},
        serviceInfo: {}
      },
      resultStyle: '',
      userInfo: {
        ID_CARD_SCAN_BACK: '',
        PHONE: '',
        IMAGE: '',
        ID: ''
      },
      fullHeight: document.documentElement.clientHeight,
      serviceInfoWin: null
    }
  },
  components: {
    topHeader
  },
  created () {
    this.serviceId = this.$route.query.id
    this.tokenId = this.$route.query.tokenId || userService.getTokenId()
    if (this.tokenId != undefined) {
      userService.storeInfo('tokenId', this.tokenId)
    }
    this.userInfo.PHONE = userService.getUsername()
  },
  mounted () {
    var that = this
    if (this.serviceId != undefined && this.serviceId != '') {
      this.loadHandler()
    }
    $(window).resize(function () {
      that.fullHeight = document.documentElement.clientHeight
      $('.invoke-info-win.el-notification').height(that.fullHeight - 100)
      $('.invoke-info-win .el-notification__content').height(
        that.fullHeight - 130
      )
    })
  },
  methods: {
    sumitBtnHandler () {
      var that = this
      var data = new Object()
      for (var i = 0; i < that.results.data.length; i++) {
        var obj = that.results.data[i]
        if (obj.value == undefined) {
          data[obj.name] = ''
        } else {
          data[obj.name] = obj.value
        }
      }

      if (this.serviceInfoWin) {
        this.serviceInfoWin.close()
      }
      for (var i = 0; i < that.results.data.length; i++) {
        if (that.results.data[i].isRequired == undefined || that.results.data[i].isRequired) {
          if (that.results.data[i].value == undefined || that.results.data[i].value == '') {
            this.isNull = true
            return
          }
        }
      }
      data.serviceId = that.serviceId
      data.previewTag = that.$route.query.previewTag
      LoadingBoxService.open('正在上传表单请稍候...')
      if (that.results.serviceInfo.isatomic == 'false') {
        LoadingBoxService.close()
        var key_data = UtilService.uuid()
        sessionStorage.setItem(
          key_data,
          JSON.stringify(data)
        )
        that.$router.push({
          name: 'sevPageView',
          query: { params: key_data }
        })
      } else {
        var url = 'itsmApi/atomicService/commitAtomic'
        apiClient.post(url, data, function (data) {
          LoadingBoxService.close()
          // console.log("调用结果---》", data);
          if (data.status == '200' || data.status == '201') {
            if (data.results.flag == '3') {
              var jsonData = data.results.data
              var errmsg = ''
              var dataJson = ''
              if (jsonData == undefined || jsonData == '') {
                errmsg =
                  '<span style="color: #f1592a;font-weight:bold;" >#后台出现异常#</span>'
              } else {
                try {
                  if (typeof jsonData === 'string') {
                    var _jsonStr = jsonData
                    JSONLint.jsonlint.parse(_jsonStr)
                    var _jsonData = JSONFormat.JSONFormat.format2(_jsonStr, 4)
                    dataJson = _jsonData
                  } else {
                    var _jsonStr = JSON.stringify(jsonData)
                    JSONLint.jsonlint.parse(_jsonStr)
                    var _jsonData = JSONFormat.JSONFormat.format2(_jsonStr, 4)
                    dataJson = _jsonData
                  }
                } catch (e) {
                  errmsg =
                    '<span style="color:#E63F1F;font-weight:bold;" >#数据格式异常#　' +
                    e +
                    '</span>'
                }
              }
              if (errmsg != '') {
                $('.rowContent').html(errmsg)
              } else {
                $('.rowContent').html(dataJson)
              }

              that.adjustHeight()
            } else {
              var key_outputData = UtilService.uuid()
              var key_serviceInfo = UtilService.uuid()
              that.$router.push({
                name: 'CommonOutput',
                query: {
                  type: 'page',
                  outputData: key_outputData,
                  serviceInfo: key_serviceInfo
                }
              })
              sessionStorage.setItem(
                key_outputData,
                JSON.stringify(data.results.data)
              )
              sessionStorage.setItem(
                key_serviceInfo,
                JSON.stringify(that.results.serviceInfo)
              )
            }
          } else if ((data.status = '503')) {
            LoadingBoxService.close()
            TipBoxService.open('调用失败：' + data.exception, 1)
          } // if 200
        }).catch(error => {
          LoadingBoxService.close()
          if (error.response.data.exception) {
            TipBoxService.open(error.response.data.exception, 2)
          } else {
            TipBoxService.open('发现未知错误', 2)
          }
          throw error
        })// get
      }
    },
    loadHandler () {
      var that = this
      var url = 'itsmApi/atomicService/analysisAtomic'
      var previewTag = this.$route.query.previewTag
      LoadingBoxService.open('正在加载页面，请稍候...')
      apiClient.post(url, { serviceId: that.serviceId, previewTag: previewTag }, function (data) {
        LoadingBoxService.close()
        if (data.status == '200' || data.status == '201') {
          that.results = data.results
          // 遍历截取长字符串
          for (var i = 0; i < that.results.data.length; i++) {
            if (that.results.data[i].describe != undefined && that.results.data[i].describe != '' && that.results.data[i].describe.length > 10) {
              that.results.data[i].describeInfo = that.results.data[i].describe.substring(0, 10) + '...'
            } else {
              that.results.data[i].describeInfo = that.results.data[i].describe
            }
          }
          console.log(that.results)
          UtilService.resetDocumentTitle(that.results.serviceInfo.name)

          if (
            that.results.serviceInfo.isatomic == 'true' &&
            that.results.serviceInfo.serviceType == '3'
          ) {
            that.resultStyle = 'data'
            setTimeout(function () {
              that.adjustHeight()
            }, 10)
          } else if (
            that.results.serviceInfo.isatomic == 'true' &&
            that.results.serviceInfo.serviceType == '1'
          ) {
            var key_outputData = UtilService.uuid()
            var key_serviceInfo = UtilService.uuid()
            that.$router.push({
              name: 'CommonOutput',
              query: {
                type: 'page',
                outputData: key_outputData,
                serviceInfo: key_serviceInfo
              }
            })
            sessionStorage.setItem(
              key_outputData,
              JSON.stringify(data.results.data)
            )
            sessionStorage.setItem(
              key_serviceInfo,
              JSON.stringify(that.results.serviceInfo)
            )
          } else {
            that.resultStyle = 'page'
          }
        } else {
          $('#inputData').hide()
          $('#resultData').hide()
          LoadingBoxService.close()
          TipBoxService.open('调用失败：' + data.exception, 1)
        }
      }).catch(error => {
        LoadingBoxService.close()
        $('#inputData').hide()
        $('#resultData').hide()
        if (error.response.data.exception) {
          TipBoxService.open(error.response.data.exception, 2)
        } else {
          TipBoxService.open('发现未知错误', 2)
        }
        throw error
      })
    },
    adjustHeight () {
      $('.invoke-input').css(
        'min-height',
        $('.invoke-outPut').outerHeight() + 'px'
      )
    },
    openInfo (info) {
      var that = this
      if (that.serviceInfoWin == null) {
        that.serviceInfoWin = that.$notify({
          title: '服务描述',
          dangerouslyUseHTMLString: true,
          message: info,
          offset: 30,
          duration: 0,
          customClass: 'invoke-info-win',
          onClose: function () {
            that.serviceInfoWin = null
          }
        })
        $('.invoke-info-win.el-notification').height(that.fullHeight - 100)
        $('.invoke-info-win .el-notification__content')
          .html('<pre class=\'invoke-info-text\'>' + info + '</pre>')
          .height(that.fullHeight - 130)
      }
    }
  }
}
</script>
<style src="../../lib/jquery-ui.custom.min.css" scoped></style>
<style src="../../css/detailPage/sevPageView.css" scoped></style>
<style src="../../css/detailPage/searchInput.css" scoped></style>
<style scoped>
.invoke {
  margin: 30px auto 0 auto;
  padding: 28px 0;
}
.invoke-data {
  width: 1200px;
}
.invoke-page {
  width: 765px;
}
.wrong{
  border-color: #b61717;
}
/* invoke-input */
.invoke-input {
  width: 100%;
}
.invoke-data .invoke-input {
  width: 640px;
  float: left;
  padding-right: 15px;
  border-right: 1px dashed #b8dafd;
}
.invoke-input-title {
  padding-bottom: 10px;
  border-bottom: 1px solid #b8dafd;
  font-size: 18px;
  color: #55a8fd;
  letter-spacing: 2px;
  font-weight: bold;
}
.invoke-input-title .glyphicon {
  margin: 3px 0 0 10px;
  font-weight: normal;
  font-size: 16px;
  cursor: pointer;
}
.invoke-input-tip {
  color: #666666;
  height: 34px;
  line-height: 34px;
  text-indent: 14px;
}
/* table */
.personForm {
  margin-top: 20px;
  width: 100%;
  text-align: left;
}
.personForm .key1 {
  width: 38px;
  /* width: 140px; */
  /* max-width: 140px; */
  text-align: left;
  /* padding-right: 15px;  */
  padding-bottom: 30px;
  font-weight: normal;
  white-space: nowrap;
  vertical-align: middle;
}
.key1 .required {
  display: inline-block;
  color: #e63f1f;
  font-size: 16px;
  font-weight: bold;
  vertical-align: text-top;
  padding: 0;
  padding-top: 1px;
  margin-right: 8px;
}
.value {
  padding-bottom: 30px;
}
.value > input,
.value > textarea {
  width: 100%;
  border: 1px solid #b8dafd;
  border-radius: 5px;
}
.value > input{
  height:32px;
}
tr {
  border: #fff !important;
}
.formEnd {
  width: 100%;
  text-align: center;
}
.invoke-data .formEnd {
  text-align: right;
}
.formEnd > button {
  background: #55a8fd;
  border: none;
  color: #fff;
}
/* invoke-outPut */
.invoke-outPut {
  float: right;
  width: 540px;
  border: 1px solid #b8dafd;
}
.rowtitle {
  height: 40px;
  line-height: 40px;
  padding-left: 40px;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
  border-bottom: 1px solid #b8dafd;
  background: #f4f9ff url(../../images/invoke-outPut.png) 15px center no-repeat;
  letter-spacing: 1px;
}
.rowContent {
  min-height: 300px;
  max-height: 500px;
  overflow: auto;
}
</style>
<style>
/* invoke-info-win */
#boxBody .invoke-info-win.el-notification {
  width: 550px;
  /* padding: 20px 30px; */
}
#boxBody .invoke-info-win .el-notification__content {
  overflow: auto;
}
#boxBody .invoke-info-text {
  border: none;
  background: #f9fafc;
  color: #5e6d82;
  white-space: pre-wrap !important;
  word-wrap: break-word !important;
  *white-space: normal !important;
  word-break: break-all !important;
  text-indent: 2em;
  line-height: 2em;
  font-family: "微软雅黑";
}
#boxBody .error{
  color: #b61717
}
.el-button{
  border: 0px solid #c4c4c4;
}
.personForm .el-button{
  padding: 10px 0;
}
</style>

