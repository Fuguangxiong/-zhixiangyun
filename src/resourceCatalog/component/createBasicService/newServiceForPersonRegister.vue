<template>
  <div class="newService">
    <!-- /栏目头部 end-->
    <!-- 主题内容菜单 -->
    <rightMenu></rightMenu>
    <div class="resoubox ">
      <div class="resou-con">
        <div class="w1200 h100">
          <div class="publicNav breadCrumb">
            <img @click="toMain()" class="hand">
            <i @click="goHome" class="iconfont icon-dingwei"></i>
            <!-- <router-link :to="{name:'personRegisterManage'}">服务管理</router-link> -->
            <router-link :to="{name:breadCrumbPage}">{{breadCrumb1}}</router-link>
            <!-- <span class="active">个人注册</span> -->
            <span class="active">{{breadCrumb2}}</span>
          </div>
          <div class="mode-div lanm-con" style="overflow:auto;overflow-x: hidden; position:absolute;top:64px;bottom:0;left:15px;right:0">
            <div class="register">
              <div class="lanmpege">
                <div class="lanmp-con">
                  <div class="lanbbag ">
                    <p style="width: 25%"></p>
                  </div>
                  <div class="lanbag-text">
                    <span class="tim1">基本信息</span>
                    <span class="tim2">参数配置</span>
                    <span class="tim3">配置完成</span>
                  </div>
                </div>
              </div>
              <div class="iformcon">
                <div class="iformcon-con reg2">
                  <div class="time-x">
                    <span class="texet lihei">
                      <i class="mustAdd">*</i>服务资源名称</span>
                    <span class="inputime ">
                      <input placeholder="服务名称最多20字符" maxlength="20" v-model="service_name" type="text" class="inputborder textlinpu-text wi540">
                    </span>
                  </div>
                  <div class="time-x">
                    <span class="radic_ico">
                      <i></i>
                    </span>
                    <span class="texet">
                      <i class="mustAdd">*</i>归属应用</span>
                    <span style="background:#F4F4F4;">远程服务</span>
                  </div>
                  <div v-if="isShow" class="time-x">
                    <span class="texet">
                      <i class="mustAdd">*</i>应用名称</span>
                    <span class="inputime ">
                      <select @change="selectChange" v-model='obj' name="" id="selecrApp" class="inptcss inputborder wi540">
                        <option v-for="apply in applyList" :value="apply">{{apply.app_name}}</option>
                      </select>
                    </span>
                  </div>
                  <div class="time-x">
                    <span class="radic_ico">
                      <i></i>
                    </span>
                    <span class="texet">
                      <i class="mustAdd">*</i>页面配置类型</span>
                    <span style="background:#F4F4F4;">纯数据请求</span>
                  </div>
                  <div class="time-x">
                    <span class="texet lihei">
                      <i class="mustAdd">*</i>服务标签</span>
                    <span class="inputime ">
                      <input type="text" class="inputborder textlinpu-text wi450" v-model='metaData.resourcetag' readonly>
                    </span>
                    <span class="inputime padingstye">
                      <button @click="showTags" class="inputborder butbox">选择标签</button>
                    </span>
                  </div>
                  <div class="time-x">
                    <span class="texet">服务介绍</span>
                    <span class="inputime ">
                      <textarea v-model="service_remark" class="inputborder wi550"></textarea>
                    </span>
                  </div>
                  <div class="time-x">
                    <span class="texet">
                      <i class="mustAdd">*</i>公开方式</span>
                    <span class="inputime ">
                      <div @click="selectDisclosure('full')" class="css-radio" :class="{active:isFullDisclosure}">
                        <i></i>
                        <em>完全公开</em>
                      </div>
                      <div @click="selectDisclosure('term')" class="css-radio" :class="{active:isTermDisclosure}">
                        <i></i>
                        <em>条件公开</em>
                      </div>
                    </span>
                  </div>
                </div>
              </div>
              <!--/biaodan-->
              <div class="buttnet">
                <button @click="toSaveInfo('temporaryStorage')" class="btnGreen">暂存</button>
                <button @click="toSaveInfo('toNext')" class="btnBlue">下一步</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="foot"></div>
    <!-- 选择标签 -->
    <!-- <LabelView v-if="dialogTagVisible" isCreate="true" :checkedLabels="checkedLabels" @changeLabels="changeLabels"/> -->
    <LabelView :dialogTagVisible.sync="dialogTagVisible" :isCreateModel="!isEdit" :model="metaData" modelLabelKey="serviceTag" :changeLabelCaller="saveLabel" />
  </div>
  </div>
</template>
<script>
import LabelView from '../../../publicComponent/labelView.vue'
import apiToken from '../../../publicJs/apiToken.js'
import apiClient from '../../../publicJs/ApiClient.js'
import TipBoxService from '../../../publicJs/TipBoxService.js'
import LoadingBoxService from '../../../publicJs/LoadingBoxService.js'
import rightMenu from '../../../publicComponent/publicRightMenu.vue'
export default {
  name: 'RcIndex',
  watch: {
    'metaData.serviceTag' (value) {
      this.service_tag = value
      this.metaData.resourcetag = value.join(',')
      LoadingBoxService.close()
    },
    'service_tag' (value) {
      this.metaData.serviceTag = value
    }
  },
  data () {
    return {
      APIclass: '',
      breadCrumb1: '',
      breadCrumb2: '',
      breadCrumbPage: '',
      indexNext: 0, // 记录点击下一步的次数
      dialogTagVisible: false, // 选择标签 是否隐藏。
      checkedLabels: [],
      isTeleService: false,
      isApplService: true,
      isPageRequest: false,
      isPageDataRequest: false,
      isDataRequest: false,
      isFullDisclosure: true,
      isTermDisclosure: false,
      configure: [],
      isShow: true,
      applyList: [],
      obj: '',
      applyId: '',
      service_name: '',
      apptype: '2',
      serviceType: [],
      service_type: [],
      service_tag: [],
      service_remark: '',
      open_type: '1',
      atomicId: '',
      service_param_detail: '',
      successUrl1: '',
      successUrl2: '',
      file: '',
      bg_img: '',
      img: '',
      hideFlag1: false,
      hideFlag2: false,
      opt: 0,
      metaData: {
        serviceTag: [], // 标签名称数组
        resourcetag: ''  // 标签名称字符串
      }, // 包含标签名称数组的对象
      isEdit: this.$route.query.atomicId !== undefined  // 用于标签判断是否是新建服务
    }
  },
  mounted () {
    this.getApplications()
    this.selectType('dataRequest')
    this.isSelect('teleService')
  },
  created () {
	    this.APIclass = this.$route.query.type ? this.$route.query.type : 'APIjiekou'
      // console.log(this.$route)
    if (this.$route.query.type === 'APIjiekou') {
      this.breadCrumb1 = '个人注册'
      this.breadCrumb2 = '注册接口'
      this.breadCrumbPage = 'personRegisterManage'
    } else if (this.$route.query.type === 'API') {
      this.breadCrumb1 = '注册管理'
      this.breadCrumb2 = '注册接口'
      this.breadCrumbPage = 'registerManageAdministrator'
    }
  },
  methods: {
    goHome () {
      this.$router.push({name: 'Index'})
    },
    toMain () {
      this.$router.push('personRegisterManage')
    },
    getBasicInfo () {
      var that = this
      if (this.$route.query.atomicId != undefined && this.$route.query.atomicId != '') {
        this.atomicId = this.$route.query.atomicId
				// document.getElementById("selecrApp").disabled='disabled';
        var myData = { id: this.$route.query.atomicId }
        apiClient.post('itsmApi/atomicService/loadServiceInfo', myData, function (data) {
          that.service_param_detail = data.results.data[0].service_param_detail
          that.applyId = data.results.data[0].app_id
          that.serviceType = data.results.data[0].service_type
          that.service_tag = data.results.data[0].service_tag
          that.successUrl1 = apiClient.baseUrl + '/attachment/uploadImg?method=showImg&imgPath=' + data.results.data[0].img + '&token=' + apiClient.tokenId
          that.img = data.results.data[0].img
          that.hideFlag1 = true
          that.successUrl2 = apiClient.baseUrl + '/attachment/uploadImg?method=showImg&imgPath=' + data.results.data[0].bg_img + '&token=' + apiClient.tokenId
          that.bg_img = data.results.data[0].bg_img
          that.hideFlag2 = true
          if (data.results.data[0].tag_id != undefined && data.results.data[0].tag_id.length != 0) {
            that.checkedLabels = data.results.data[0].tag_id
          }
          that.metaData.resourcetag = that.service_tag.join(',')
          for (var i = 0; i < that.applyList.length; i++) {
            var newObj = that.applyList[i]
            if (newObj.id == that.applyId) {
            that.obj = newObj
            break
          }
          }
          that.service_name = data.results.data[0].name
          that.service_remark = data.results.data[0].service_remark
          if (data.results.data[0].apptype == 1) {
            that.isTeleService = true
            that.isApplService = false
            that.apptype = 1
            that.isShow = false
          } else {
            that.isApplService = true
            that.isTeleService = false
            that.apptype = 2
            that.isShow = true
          }
          if (data.results.data[0].open_type == 1) {
            that.isFullDisclosure = true
            that.isTermDisclosure = false
            that.open_type = 1
          } else {
            that.isTermDisclosure = true
            that.isFullDisclosure = false
            that.open_type = 2
          }
          for (var i = 0; i < data.results.data[0].service_type.length; i++) {
            if (data.results.data[0].service_type[i] == 1) {
            that.isPageRequest = true
            that.serviceType[0] = 1
            that.configure[0] = '页面请求'
          } else if (data.results.data[0].service_type[i] == 2) {
        that.isPageDataRequest = true
        that.serviceType[1] = 2
        that.configure[1] = '页面数据请求'
      } else if (data.results.data[0].service_type[i] == 3) {
      that.isDataRequest = true
      that.serviceType[2] = 3
      that.configure[2] = '纯数据请求'
      that.configure[3] = '返回参数'
    }
          }
        })
      }
    },
    changeLabels (changed, selectLabels) {
      this.service_tag = []
      if (changed) {
        let labelIds = []
        let labelStr = ''
        for (let i = 0; i < selectLabels.length; i++) {
          labelIds.push(selectLabels[i].id)
          labelStr = labelStr + selectLabels[i].name + ','
          this.service_tag.push(selectLabels[i].name)
        }
        if (labelStr.length > 0) {
          labelStr = labelStr.substr(0, labelStr.length - 1)
        }
        this.resourcetag = labelStr
        this.checkedLabels = labelIds
      }
      this.dialogTagVisible = false
    },
    handleFileChange (name) {
      var that = this
      this.file = event.currentTarget.files[0]
      apiClient.uploadFile('attachment/uploadImg?method=upload', this.file, '', '', function (data) {
        if (name == 'logo') {
          that.successUrl1 = apiClient.baseUrl + 'attachment/uploadImg?method=showImg&imgPath=' + data.fileName + '&token=' + apiClient.tokenId
          that.img = data.fileName
          that.hideFlag1 = true
        } else {
          that.successUrl2 = apiClient.baseUrl + '/attachment/uploadImg?method=showImg&imgPath=' + data.fileName + '&token=' + apiClient.tokenId
          that.bg_img = data.fileName
          that.hideFlag2 = true
        }
      })
    },
    getApplications () {
      var that = this
      var myData = { params: {} }
      apiClient.post('itsmApi/application/selectApps', myData, function (data) {
        that.applyList = data.results.data
        that.getBasicInfo()
      })
    },
    selectChange () {
      if (this.obj != undefined) {
        this.applyId = this.obj.id
      }
    },
    showTags () {
      this.dialogTagVisible = true
    },
    isSelect (name) {
      var that = this
      if (that.atomicId == undefined || that.atomicId == '') {
        if (name == 'teleService') {
          if (this.isTeleService == false) {
            this.isTeleService = true
            this.isApplService = false
            this.apptype = 1
          } else {
            this.isTeleService = false
          }
          this.isShow = false
        } else {
          if (this.isApplService == false) {
            this.isApplService = true
            this.isTeleService = false
            this.apptype = 2
          } else {
            this.isApplService = false
          }
          this.isShow = true
        }
      }
    },
    selectType (name) {
      this.service_type = []
      if (name == 'pageRequest') {
        if (this.isPageRequest == false) {
          this.isPageRequest = true
          this.configure[0] = '页面请求'
          this.serviceType[0] = 1
        } else {
          this.isPageRequest = false
          this.configure[0] = undefined
          this.serviceType[0] = undefined
        }
      }
			//
      if (name == 'pageDataRequest') {
        if (this.isPageDataRequest == false) {
          this.isPageDataRequest = true
          this.configure[1] = '页面数据请求'
          this.serviceType[1] = 2
        } else {
          this.isPageDataRequest = false
          this.configure[1] = undefined
          this.serviceType[1] = undefined
        }
      }
      if (name == 'dataRequest') {
        if (this.isDataRequest == false) {
          this.isDataRequest = true
          this.configure[2] = '纯数据请求'
          this.configure[3] = '返回参数'
          this.serviceType[2] = 3
        } else {
          this.isDataRequest = false
          this.configure[2] = undefined
          this.configure[3] = undefined
          this.serviceType[2] = undefined
        }
      }
    },
    selectDisclosure (name) {
      if (name == 'full') {
        if (this.isFullDisclosure == false) {
          this.isFullDisclosure = true
          this.isTermDisclosure = false
          this.open_type = 1
        } else {
          this.isFullDisclosure = false
        }
      } else {
        if (this.isTermDisclosure == false) {
          this.isTermDisclosure = true
          this.isFullDisclosure = false
          this.open_type = 2
        } else {
          this.isTermDisclosure = false
        }
      }
    },
    checkNull (obj) {
      if (obj == '' || obj == undefined || obj.length == 0) {
        return false
      } else {
        return true
      }
    },
    saveBasicInfo (nameInfo) {
      var type_temp = new Array()
      for (var i = 0; i < 3; i++) {
        if (this.serviceType[i] != undefined && this.serviceType[i] != null && parseInt(this.serviceType[i]) == (i + 1)) {
          type_temp.push(this.serviceType[i])
        }
      }
      this.service_type = type_temp
      var that = this
      var flag = true
      var myData = { name: this.service_name, apptype: this.apptype, app_id: this.applyId, service_type: this.service_type, service_tag: this.service_tag, service_remark: this.service_remark, open_type: this.open_type, bg_img: this.bg_img, img: this.img, audit_status: this.opt, tag_id: this.checkedLabels }
      for (var key in myData) {
        if (key == 'name' && !that.checkNull(myData[key])) {
          TipBoxService.open('请填写服务名称', 2)
          flag = false
          return false
        }
        if (key == 'name' && myData[key].trim().length > 20) {
          TipBoxService.open('服务名称长度最多为20位', 1)
          flag = false
          return false
        }
        if (key == 'apptype' && !that.checkNull(myData[key])) {
          TipBoxService.open('请选择归属应用', 2)
          flag = false
          return false
        }
        if (key == 'app_id' && !that.checkNull(myData[key]) && this.apptype == 2) {
          TipBoxService.open('请选择服务', 2)
          flag = false
          return false
        }
        if (key == 'service_type' && !that.checkNull(myData[key])) {
          TipBoxService.open('请选择页面配置类型', 2)
          flag = false
          return false
        }
        if (key == 'service_tag' && !that.checkNull(myData[key])) {
          TipBoxService.open('请选择标签', 2)
          flag = false
          return false
        }
        if (key == 'service_remark' && myData[key].length > 200) {
          TipBoxService.open('服务介绍最多200字', 1)
          flag = false
          return false
        }
        if (key == 'open_type' && !that.checkNull(myData[key])) {
          TipBoxService.open('请选择开放模式', 2)
          flag = false
          return false
        }
      }
      if (flag && that.indexNext == 0) {
        LoadingBoxService.open('正在执行，请稍候...')
        if (this.atomicId == undefined || this.atomicId == null || this.atomicId == '') {
          apiClient.post('itsmApi/atomicService/insertAtomicInfo', { param: JSON.stringify(myData) }, function (data) {
            if (data.status == 200) {
            that.atomicId = data.results.atomicId
            if (nameInfo == 'toNext') {
            LoadingBoxService.close()
            that.$router.push({
          name: 'newServiceNextForPersonRegister',
          query: {
            name: JSON.stringify(that.configure),
            atomicId: that.atomicId,
            applyId: that.applyId,
            apptype: that.apptype,
            type: that.APIclass
          }
        })
            that.indexNext++
          } else {
            LoadingBoxService.close()
            TipBoxService.open('暂存成功！')
            that.$router.push({ path: 'personRegisterManage?index=1' + '&type=' + that.APIclass})
          }
          } else {
            LoadingBoxService.close()
            TipBoxService.open(data.exception, 1)
          }
          })
        } else {
          var arr = this.service_type
          var one = arr.indexOf(1)
          var two = arr.indexOf(2)
          var three = arr.indexOf(3)
          var itme = '{"service_param":[{}],"request_type":"","output_body":"","service_out_param":[],"input_body":"","request_port":"","url":""}'
          if (that.service_param_detail != undefined && that.service_param_detail != '') {
            if (one == '-1') {
            that.service_param_detail.splice(0, 1, itme)
          }
            if (two == '-1') {
            that.service_param_detail.splice(1, 1, itme)
          }
            if (three == '-1') {
            that.service_param_detail.splice(2, 1, itme)
          }
            var myDatas = { id: this.atomicId, name: this.service_name, apptype: this.apptype, app_id: this.applyId, service_type: this.service_type, service_tag: this.service_tag, service_remark: this.service_remark, open_type: this.open_type, service_param_detail: this.service_param_detail, bg_img: this.bg_img, img: this.img, audit_status: this.opt, tag_id: this.checkedLabels }
          } else {
            var myDatas = { id: this.atomicId, name: this.service_name, apptype: this.apptype, app_id: this.applyId, service_type: this.service_type, service_tag: this.service_tag, service_remark: this.service_remark, open_type: this.open_type, bg_img: this.bg_img, img: this.img, audit_status: this.opt, tag_id: this.checkedLabels }
          }

          LoadingBoxService.open('正在执行，请稍候...')
          apiClient.post('itsmApi/atomicService/updateAtomicInfo', { param: JSON.stringify(myDatas) }, function (data) {
            if (data.status == 200) {
            if (nameInfo == 'toNext') {
            LoadingBoxService.close()
            that.$router.push({
          name: 'newServiceNextForPersonRegister',
          query: {
          name: JSON.stringify(that.configure),
          atomicId: that.atomicId,
          applyId: that.applyId,
          apptype: that.apptype,
          type: that.APIclass
        }
        })
          } else {
            LoadingBoxService.close()
            TipBoxService.open('暂存成功！')
            that.$router.push({ path: 'personRegisterManage?index=1' })
          }
          } else {
            LoadingBoxService.close()
            TipBoxService.open(data.exception, 1)
          }
          })
        }
      }
    },
    toSaveInfo (name) {
      this.saveBasicInfo(name)
    },
    saveLabel () {
      this.service_tag = this.metaData.serviceTag
      this.metaData.resourcetag = this.service_tag.join(',')
      return true
    }

  },
  components: {
    LabelView,
    rightMenu
  }
}
</script>
<style src="" scoped>
.box {
  position: relative;
}
.box form {
  position: relative;
}
.box input {
  position: absolute;
  left: -9999px;
}
/* 使label充满整个box*/
.box label {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10; /* 这个z-index之后说到*/
  cursor: pointer;
}
.box img {
  position: absolute;
  left: -1px;
  top: -31px;
  width: 112px;
  height: 112px;
  border: 1px solid #ccc;
}
.porthide {
  display: none;
}
.hidBox {
  display: none;
}
.register {
  padding: 90px 0;
  position: relative;
  box-sizing: border-box;
}
.lanmpege {
  background: #fff;
  height: 90px;
  position: absolute;
  top: 0;
  width: 100%;
}
.lanmp-con {
  width: 960px;
  margin: 0 auto;
  padding-top: 30px;
}
.lanbbag {
  background: url("../../images/stepp3.png") no-repeat;
  width: 915px;
  height: 36px;
  background-size: cover;
}
.lanbbag p {
  background: url("../../images/step3.png") no-repeat;

  height: 36px;
  background-size: cover;
}
.iformcon-con.reg1 {
  width: 1100px;
  margin: 0 auto;
}
.iformcon-con.reg2 {
  width: 650px;
  margin: 0 auto;
}
.iformcon-con.reg2 .texet.lihei {
  line-height: 29px;
}
.lanbag-text {
  width: 992px;
  margin-top: 5px;
}
.time-x {
  position: relative;
  padding-left: 104px;
  box-sizing: border-box;
  margin-bottom: 20px;
  margin-top: 20px;
}
.time-x span {
  display: inline-block;
  vertical-align: middle;
}
.time-x .texet {
  position: absolute;
  left: 0;
  width: 86px;
  color: #333;
  font-size: 12px;
  text-align: right;
}
.inputime .css-radio {
  float: left;
  cursor: pointer;
  margin-right: 45px;
}
.css-radio i {
  background: url("../../../publicImages/radio.png") no-repeat;
  width: 12px;
  height: 12px;
  display: inline-block;
  vertical-align: middle;
  margin-right: 4px;
}
.css-radio.active i {
  background-position: 0 -13px;
}
.css-radio em {
  font-style: normal;
}
.shulist {
  overflow: hidden;
}
.wi540 {
  width: 459px;
  height: 30px;
  padding: 3px 5px;
  border: 1px solid #efefef;
  border-radius: 5px;
}
.wi450 {
  width: 459px;
  height: 30px;
  padding: 3px 5px;
  border: 1px solid #efefef;
  border-radius: 5px;
}
.wi560 {
  width: 262px;
}
.wi550 {
  width: 459px;
  height: 100px;
  padding: 5px 5px;
  border: 1px solid #efefef;
  border-radius: 5px;
}
.w1 {
  width: 10%;
  padding: 0 10px;
  box-sizing: border-box;
  float: left;
}
.tablnav {
  border-bottom: 1px #e0e0e0 solid;
}
.tablnav ul {
  width: 800px;
  margin: 0 auto;
  margin-top: 27px;
  padding-bottom: 27px;
}
.tablnav li {
  border: 1px #999 solid;
  padding: 0 10px;
  display: inline-block;
  line-height: 32px;
  border-radius: 3px;
  cursor: pointer;
  font-size: 14px;
  position: relative;
  margin-right: 3px;
}
.tablnav li.active {
  border: 1px #b61717 solid;
  color: #b61717;
}
.tablnav li.active::before {
  content: "";
  position: absolute;
  /* background: url("../img/tuerr.png") no-repeat; */
  width: 13px;
  height: 13px;
  position: absolute;
  top: 0;
  right: 0;
}
.shulist .inptcssw {
  width: 100px;
}
.inptcss {
  border: 1px #cacaca solid;
  border-radius: 3px;
  padding: 6px 0px 6px 0px;
}
.shulist .inptcssw1 {
  width: 140px;
}
.shulist .icobut {
  display: inline-block;
  border: 1px #959595 solid;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  font-size: 20px;
  text-align: center;
  line-height: 22px;
  cursor: pointer;
}
.shulist .icobut:hover {
  background: #b61717;
  border: 1px #b61717 solid;
  color: #fff;
}
.w2 {
  width: 20%;
  padding: 0 10px;
  box-sizing: border-box;
  float: left;
}
.butonst {
  border-radius: 3px;
  border: 1px #cacaca solid;
  text-align: center;
  font-size: 14px;
  line-height: 28px;
  cursor: pointer;
  padding: 0 12px;
}
.butonstdelet {
  border-radius: 3px;
  border: 1px #cacaca solid;
  text-align: center;
  font-size: 14px;
  line-height: 28px;
  cursor: pointer;
  padding: 0 12px;
}
.butonstdelet:hover {
  background: #b61717;
  border: 1px #b61717 solid;
  color: #fff;
}
.w3 {
  width: 30%;
  padding: 0 10px;
  box-sizing: border-box;
  float: left;
}
.shulist .inptcss {
  background: transparent;
  border: 1px #a9a9a9 solid;
  border-radius: 3px;
  height: 24px;
  padding: 0;
}
.shulist-con {
  background: #f5f5f5;
  border: 1px #a9a9a9 solid;
  border-radius: 3px;
  padding: 10px 0;
}
.tabcon {
  width: 800px;
}
.textreas {
  height: 180px;
}
.lanbag-text span {
  font-size: 14px;
  display: inline-block;
}
.lanbag-text span.tim2 {
  margin-left: 370px;
}
.lanbag-text span.tim3 {
  margin-left: 370px;
}
.lanbag-text span.tim4 {
  margin-left: 130px;
}
.lanbag-text span.tim5 {
  margin-left: 140px;
}
.shulist-c {
  border-top: 1px #33a6ff solid;
}
.shulist-m {
  overflow: hidden;
  border-top: 1px #cdcdcd solid;
  padding: 10px 0;
}
.shulist-m:first-child {
  border-top: none;
}
.shulist-c .shulist-m .eqad .inptcss {
  margin-left: 10px;
}
.shulist-c .shulist-m {
  border-top: none;
}
.shulist-c .shulist-c .shulist-m .eqad .inptcss {
  margin-left: 20px;
}
.shulist-c .shulist-c .shulist-m {
  border-top: none;
}
.cssinput {
  background: transparent;
  border: 1px #dadada solid;
  border-radius: 3px;
  height: 24px;
  padding: 0;
}
.tabth {
  padding-bottom: 10px;
  font-size: 14px;
  overflow: hidden;
}
.butbox {
  border-radius: 5px;
  border: 1px #52aaf2 solid;
  text-align: center;
  font-size: 14px;
  line-height: 28px;
  cursor: pointer;
  padding: 0 12px;
  background-color: #fff;
  color: #52aaf2;
}
.w200 {
  width: 90px;
  padding: 5px;
}
.w590 {
  width: 705px;
  padding: 14px 5px;
}
.fl {
  float: left;
}
.chepoc {
  float: left;
  margin: 4px 0 0 4px;
  position: relative;
}
.chepoc i.charu {
  background: url("../../images/fxin.png") no-repeat;
  width: 20px;
  height: 20px;
  cursor: pointer;
  display: inline-block;
}
.mustAdd {
  color: #b61717;
  font-style: normal;
  vertical-align: middle;
  padding-right: 7px;
  font-size: 15px;
}
.charutex {
  position: absolute;
  border: 1px #d9d9d9 solid;
  border-radius: 3px;
  display: none !important;
  width: 30px;
  padding: 3px 0;
  cursor: pointer;
  text-align: center;
  background: #fff;
}
.chepoc:hover .charutex {
  display: inline-block !important;
}

.teac {
  width: 800px;
  height: 100px;
  font-size: 16px;
  padding: 5px 5px;
}
.buttnet {
  text-align: center;
  padding-top: 38px;
  margin-top: 50px;
}
.buttnet button {
  margin: 0 10px;
}
.touxi {
  position: absolute;
  left: 55%;
  width: 300px;
  margin-left: 240px;
}
.touxi dl {
  float: left;
  margin-right: 20px;
}
.touxi dl dd {
  width: 112px;
  height: 112px;
  border: 1px #ccc solid;
  border-radius: 3px;
  cursor: pointer;
}
.touxi dl dd div {
  text-align: center;
  margin-top: 30px;
}
.touxi dl dd i {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 2px #ccc solid;
  display: inline-block;
  text-align: center;
  line-height: 23px;
  font-size: 22px;
  color: #333;
}
.touxi dl dd p {
  color: #333;
  font-size: 14px;
}
.touxi dl dt label {
  width: 100%;
  margin-top: 10px;
  font-weight: 400;
}
.iformcon-con.reg4 .tonggo {
  font-size: 24px;
  /* background: url(../img/dui.png) no-repeat; */
  line-height: 70px;
  padding-left: 80px;
  color: #2c9801;
  margin: 140px auto;
  width: 464px;
}
.lanm-con {
  width: 98%;
  margin-top: 10px;
  background-color: white;
}
.tabcon-mian {
}
.tabcon-mian .tabl-top {
  height: 52px;
}
.tabcon-mian .tabl-top-nav {
  padding: 11px 18px 0 18px;
  height: 41px;
  border: 1px #d8d8d8 solid;
}
.tabcon-mian .tabl-top-nav li {
  height: 40px;
  width: 88px;
  display: inline-block;
  margin-right: -4px;
  cursor: pointer;
  text-align: center;
  border-width: 1px 0 0 1px;
  border-color: #d8d8d8;
  border-style: solid;
  border-radius: 3px 3px 0 0;
  line-height: 40px;
  background: #fff;
}
.tabcon-mian .tabl-top-nav li:last-child {
  border-right: 1px #d8d8d8 solid;
}
.tabcon-mian .tabl-top-nav li.active {
  border-top: 1px #b61717 solid;
  color: #b61717;
  height: 41px;
}
.tabl-body {
}
.tabl-body-bod {
  position: relative;
  height: 50px;
  padding-top: 10px;
  margin-top: 10px;
}
.tabl-body-bod label {
  cursor: pointer;
  margin: 0 20px;
}
.tabl-body-bod .inptexcss {
  position: absolute;
  right: 20px;
  top: 0;
  background-color: #fff;
}
.tabl-body-bod label span {
  vertical-align: middle;
  font-size: 14px;
  display: inline-block;
}

.tab-box span {
  display: inline-block;
  margin-right: -4px;
  font-size: 14px;
}
.tab-box {
  margin: 0 14px;
}
.tab-box-head {
  border-bottom: 1px #0066ca solid;
}
.tab-box-head span {
  padding: 10px 0;
}
.tab-box .w10 {
  width: 13%;
}
.tab-box .w12 {
  width: 16%;
}
.biaotiimg img {
  border: 1px #d3d3d3 solid;
  border-radius: 3px;
  background: #fff;
  vertical-align: middle;
  margin-right: 4px;
  margin-left: 1px;
}
.biaotiimg em {
}
.tab-box-body .tblist {
  border-bottom: 1px #dedede solid;
}
.tab-box-body .tblist li:hover {
  background: #faf4f4;
}
.tab-box-body .tblist li {
  height: 60px;
  padding-top: 14px;
}
.up-lc {
  position: relative;
}
.up-lc-con {
  position: absolute;
  z-index: 99;
  border: 1px #1056bf solid;
  border-radius: 3px;
  background: #fff;
  width: 68px;

  text-align: center;
}
.up-lc-con p {
  color: #999999;
  line-height: 34px;
  cursor: pointer;
}
.up-lc-con p.active {
  background: #1056bf;
  color: #fff;
}
.alicen {
  text-align: center;
}
.caoz {
  float: left;
}
.caoz i {
  display: inline-block;
  cursor: pointer;
  position: relative;
}

.caoz i.ico4 {
  /* background:url("../img/ico-fw4.png") center no-repeat; */
  width: 24px;
  height: 24px;
}
.caoz i::before {
  background: #fff;
  box-shadow: 2px 2px 2px #ccc;
  border-radius: 3px;
  display: none;
  text-align: center;
  position: absolute;
  top: 0;
}
.caoz i.ico::before {
  content: "查看原因";
  width: 80px;
  right: -80px;
  line-height: 24px;
  height: 24px;
}
.caoz i.ico1::before {
  content: "编辑";
  width: 40px;
  right: -40px;
  line-height: 24px;
  height: 24px;
}
.caoz i.ico2::before {
  content: "删除";
  width: 40px;
  right: -40px;
  line-height: 24px;
  height: 24px;
}
.caoz i.ico3::before {
  content: "撤销";
  width: 40px;
  right: -40px;
  line-height: 24px;
  height: 24px;
}
.caoz i.ico4::before {
  content: "查看审批流程";
  width: 120px;
  right: -120px;
  line-height: 24px;
  height: 24px;
}
.caoz i:hover::before {
  display: block;
  z-index: 99;
}
.caoz i.ico {
  /* background:url("../img/ico-fw.png") center no-repeat; */
  width: 24px;
  height: 24px;
}
.caoz i.ico1 {
  /* background:url("../img/ico-fw1.png") center no-repeat; */
  width: 24px;
  height: 24px;
}
.caoz i.ico2 {
  /* background:url("../img/ico-fw2.png") center no-repeat; */
  width: 24px;
  height: 24px;
}
.caoz i.ico3 {
  /* background:url("../img/ico-fw3.png") center no-repeat; */
  width: 24px;
  height: 24px;
}
.kaiguanbut {
  width: 70px;
  height: 26px;
  background: #1bb617;
  display: inline-block;
  border-radius: 13px;
  position: relative;
  cursor: pointer;
}
.kaiguanbut i {
  position: absolute;
  width: 35px;
  height: 24px;
  border: 1px #1bb617 solid;
  border-radius: 12px;
  background: #fff;
}
.kaiguanbut.active {
  background: #b2b2b2;
}
.kaiguanbut.active i {
  right: 0;
  border: 1px #b2b2b2 solid;
}
.kaiguanbut b {
  font-weight: normal;
  width: 50%;
  float: left;
  line-height: 26px;
  text-align: center;
  color: #fff;
}
</style>
<style src="" scoped>
.lanbag-text span.tim1 {
  color: #58a6f9;
}
/*.radic_ico{
    display: inline-block;
    width: 12px;
    height: 12px;
    float: left;
    margin-top: 4px;
  }
.radic_ico i{
    display: inline-block;
    width: 12px;
    height: 12px;
    background: url("../../../publicImages/radio.png") no-repeat 0 -13px;
    float: left;
  }*/
</style>
