<template>
    <div class="pickInfo">
    	<div class="topTitle">
    		<p><font  @click="toNoticeList" class="mianbaoxie"><i  class="colsBlue"></i>公告管理</font> · 公告详情</p>
    	</div>
    	<div class="bulletinName">
             <p class="detail_bulletinName">{{noticData.bulletinName}}</p>
    	</div>
    	<div v-show="timeShow">
             <p class="detail_time">{{noticData.time|dataFormat}}&nbsp;{{noticData.time|timeFormat}}</p>
    	</div>
    	<div >
              <textarea readonly="readonly" class="detail_info" v-model.trim="noticData.bulletinContent"></textarea>
    	</div>
    </div>
</template>
<script>
import apiToken from '../../../publicJs/apiToken.js'
import apiClient from '../../../publicJs/ApiClient.js'
import appPublicJs from '../../common/public.js'
import UtilService from '../../../publicJs/UtilService.js'
export default {
  data () {
    return {
      id: '',
      noticData: {
        bulletinName: '',
        bulletinContent: '',
        time: '',
        bulletinState: ''
      },
      timeShow: false
    }
  },
  mounted () {
    this.id = this.$route.query.id
    this.getNoticeDetails()
  },

  watch: {},
  filters: {
    dataFormat: function (value) {
      return UtilService.formatDuring(value, 'yyyy-MM-dd')
    },
    timeFormat: function (value) {
      return UtilService.formatDuring(value, 'HH:mm:ss')
    },
    imgPath: function (value) {
      return apiClient.apiBaseUrl + appPublicJs.serviceImgShow + value
    }
  },
  methods: {
    getNoticeDetails () {
      var that = this
      var param = { id: this.id }
      apiClient.get(
        apiToken.newApi('/ioapi/bulletin/bulletinDetails/'),
        param,
        function (data) {
          if (appPublicJs.checkData(data.results.data)) {
            var detailData = data.results.data[0]
            that.noticData.bulletinName = detailData.bulletin_name
            that.noticData.bulletinContent = detailData.bulletin_content
            that.noticData.bulletinState = detailData.bulletin_state
            if (that.noticData.bulletinState == '1') {
              that.noticData.time = detailData.release_time
              that.timeShow = true
            } else if (that.noticData.bulletinState == '2') {
              that.noticData.time = detailData.created_time
              that.timeShow = false
            } else if (that.noticData.bulletinState == '3') {
              that.noticData.time = detailData.deprecated_time
              that.timeShow = false
            }
          }
        }
      )
    },
    toNoticeList () {
      var that = this
      that.$router.push({ name: 'notice' })
    }
  }
}
</script>
<style src="../../css/notice.css" scoped></style>
