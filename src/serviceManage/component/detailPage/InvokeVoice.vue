<template>
  <div class="boxBody" id="boxBody">
		<div class="boxst">
      <div class="voiceBox" id="inputData">
        <div class="pleaseSpeak" v-show="isRadioShow">请讲话……</div>
        <div class="pleaseSpeak" v-show="isEndShow">录音完毕</div>
        <div class="beginRadio" @click="beginRadio" v-show="isBeginShow">
        	
        </div>
          <div class="endRadio" @click="endRadio" v-show="isRadioShow">
        	
        </div>
        <!--
        <img @click="endRadio" src="../../img/dialogue.png" height="117" width="300" alt="" v-show="isBeginShow">
        <img @click="endRadio" src="../../img/dialogue.gif" height="117" width="300" alt="" v-show="isRadioShow">
        -->
      </div>
		</div>	
  </div>
</template>

<script>
// import leftNav from '@/components/partComponents/leftNav'
// import leftMenu from '@/components/serviceManager/leftMenu/LeftMenu'
import TipBoxService from '../common/TipBoxService.js'
import LoadingBoxService from '../../../publicJs/LoadingBoxService.js'
import apiToken from '../../../publicJs/apiToken.js'
import apiClient from '../../../publicJs/ApiClient.js'
import Bootstrap from 'bootstrap/dist/js/bootstrap.min.js'
import JqUI from '../../lib/jquery-ui.min.js'

export default {
  name: 'InvokeVoice',
  data () {
    return {
      isRadioShow: false,
      isBeginShow: true,
      isEndShow: false,
      serviceId: '',
      formData: {},
      serviceInfo: {},
      voiceWord: '2017-9-8,17:22:44,车牌号渝F25311,在高速G65包茂高速武隆至黔江段,汽车抛锚'  // 测试数据
    }
  },
  created () {
    this.serviceId = this.$route.query.id
  },
  mounted () {
    this.loadHandler()
  },
  methods: {
    beginRadio () {
      this.isBeginShow = false
      this.isRadioShow = true
      this.isEndShow = false
    },
    endRadio () {
      this.isRadioShow = false
      this.isBeginShow = true
      this.isEndShow = true
      this.sumitBtnHandler()
    },
    sumitBtnHandler () {
      var that = this
      var total = that.formData.length
      var data = new Object()
      for (var i = 0; i < that.formData.length; i++) {
        var obj = that.formData[i]
        data[obj.name] = that.voiceWord
      }
      console.log('j----', JSON.stringify(data))
      LoadingBoxService.open('正在上传表单请稍候...')
      var url = ''
      if (that.serviceInfo.isatomic == 'false') {
        data.serviceId = that.serviceId
        LoadingBoxService.close()
        that.$router.push({name: 'sevPageView', query: {params: JSON.stringify(data)}})
      } else {
        url = 'itsmApi/atomicService/commitAtomic'
        apiClient.post(url, data, function (data) {
          LoadingBoxService.close()
          if (data.status == '200' || data.status == '201') {
            if (data.results.flag == '3') {
              that.$router.push({name: 'CommonOutput', query: {type: 'json', outputData: JSON.stringify(data.results.data.data), serviceInfo: JSON.stringify(that.serviceInfo)}})
            } else {
              that.$router.push({name: 'CommonOutput', query: {type: 'page', outputData: JSON.stringify(data.results.data.data), serviceInfo: JSON.stringify(that.serviceInfo)}})
            }
          } else if (data.status = '503') {
            LoadingBoxService.close()
            TipBoxService.open('调用失败：' + data.exception, 1)
          }
        }).catch(error => {
          LoadingBoxService.close()
          if (error.response.data.exception) {
            TipBoxService.open(error.response.data.exception, 2)
          }
          throw error
        })
      }
    },
    loadHandler () {
      var that = this
      apiClient.post('itsmApi/atomicService/analysisAtomic', {serviceId: that.serviceId}, function (data) {
        if (data.status == '200' || data.status == '201') {
          if (data.results.flag == '3') {
            that.formData = data.results.data
            that.serviceInfo = data.results.serviceInfo
          } else if (data.results.flag == '2') {
            var serviceInfo = JSON.stringify(data.results.serviceInfo)
            var outputData = JSON.stringify(data.results.data.data)
            that.$router.push({name: 'CommonOutput', query: {type: 'page', outputData: outputData, serviceInfo: serviceInfo}})
          }
        } else {
          LoadingBoxService.close()
          TipBoxService.open('调用失败：' + data.exception, 1)
        }
      }).catch(error => {
        LoadingBoxService.close()
        if (error.response.data.exception) {
          TipBoxService.open(error.response.data.exception, 2)
        }
        throw error
      })
    }

  }
}
</script>
<style scoped>
  .voiceBox{
    margin-top: 10%;
    margin-left: 38%;
  }
  .voiceBox img{
    cursor: pointer;
  }
  .beginRadio{
  	background-image:url(../../images/dialogue.png);
  	height:117px;
  	width:230px;
  	cursor: pointer;
  }
  .endRadio{
  	background-image:url(../../images/dialogue.gif);
  	height:117px;
  	width:300px;
  	cursor: pointer;
  }
  
  .pleaseSpeak{
    font-size: 20px;
    font-weight: 500;
    float: left;
    margin-top: -80px;
    margin-left: 13%;
  }
</style>
