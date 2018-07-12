<template>
  <div class="publicContent">
    <div class="breadCrumb">
      <i @click="goHome" class="iconfont icon-dingwei"></i>
      <router-link to="/resourceCatalog">资源目录</router-link>
      <a href="javascript:;" @click="goBack">{{treeData.name}}</a>
      <span>接口说明</span>
      <div class="topbtnContainer">
      </div>
    </div>
    <div class="loadDataBox" style="overflow:auto;position:absolute;top:45px;bottom:0;left:0;right:0">
      <div class="inpfrom">
        <h2 class="tilesc">《{{interfaceDesc.name}}》接口说明</h2>
        <div class="divtime">
          <div class="con-cont wid">
            <div class="textlinpu">
              <span class="text">注册人</span>
              <input v-model="interfaceDesc.registerPerson" disabled type="text" class="inputborder textlinpu-text w240">
            </div>
            <div class="textlinpu">
              <span class="text">注册单位</span>
              <input v-model="interfaceDesc.registerUnit" disabled type="text" class="inputborder textlinpu-text w240">
            </div>
            <div class="textlinpu">
              <span class="text">接口标签</span>
              <input v-model="interfaceDesc.interfaceTag" disabled type="text" class="inputborder textlinpu-text w240">
            </div>
            <div class="textlinpu">
              <span class="text">创建时间</span>
              <input v-model="interfaceDesc.createdTime" disabled type="text" class="inputborder textlinpu-text w240">
            </div>
            <div class="textlinpu w100">
              <span class="text">公开方式</span>
              <input v-model="interfaceDesc.openAuth" disabled type="text" class="inputborder textlinpu-text w240">
            </div>
            <div class="textlinpu">
              <span class="text">输入参数</span>
              <input v-model="interfaceDesc.input" disabled type="text" class="inputborder textlinpu-text w240">
            </div>
            <div class="textlinpu">
              <span class="text">输出参数</span>
              <input v-model="interfaceDesc.output" disabled type="text" class="inputborder textlinpu-text w240">
            </div>
            <div class="textlinpu w100">
              <span class="text">接口说明</span>
              <textarea v-model="interfaceDesc.interfaceExplain" disabled type="text" class="inputborder textlinpu-text textrea"></textarea>
            </div>
          </div>
        </div>
        
      </div>
      <div class="save-btn-bottom-box">
        <button v-if="verifyPermission('009001007')" type="button" class="btnGreen" @click="download">下载说明</button>
        <span v-if="verifyPermission('009001006')">
          <button type="button" class="btnGreen" @click="apply" v-if="applyStatus === '' || applyStatus === 'NO_PASS' || applyStatus === 'EXPIRED'">申请接口</button>
          <button type="button" class="btnGreen" @click="editApply" v-if="applyStatus === 0">申请接口</button>
          <button type="button" class="btnGray" v-if="applyStatus === 'WAITING'" disabled title="审批中">申请接口</button>
          <button type="button" class="btnGreen" @click="showInterface" v-if="applyStatus === 'PASS'">查看接口</button> 
        </span>
        <button class="btnGreen goBack" @click="goBack">返回</button>
      </div>
    </div> 
  </div>
</template>

<script>
import privibutton from '@/publicComponent/privibutton'
import apiClient from '@/publicJs/ApiClient.js'
import _ from 'lodash'
import $ from 'jquery'
import { Loading } from 'element-ui'
import Constants from '@/publicJs/Constants.js'
import LoadingBoxService from '../../../publicJs/LoadingBoxService.js'
import Util from '@/publicJs/Util'
export default {
  name: 'interfaceSummary',
  components: {
    privibutton
  },
  mounted () {
    this.getInterface()
    this.getApplyInfo()
    var treeData = sessionStorage.getItem('treeData')
    this.treeData = JSON.parse(treeData)
    // this.$parent.leftNavData[0].active = true
  },
  data () {
    return {
      treeData: {},
      interfaceDesc: {
        name: '', // 接口名称
        registerPerson: '', // 注册人
        registerUnit: '', // 注册单位
        interfaceTag: '', // 接口标签
        createdTime: '', // 创建时间
        openAuth: '', // 公开方式
        input: '', // 输入参数
        output: '', // 输出参数
        interfaceExplain: '' // 接口说明
      },
      resourceId: '',
      applyId: '',
      applyStatus: ''
    }
  },
  methods: {
    getInterface () {
      // let loadingInstance = Loading.service({ fullscreen: true, text: '加载中...' })
      LoadingBoxService.open('数据加载中...')
      this.resourceId = this.$route.query.id
      apiClient.post('itsmApi/atomicService/loadServiceInfo', {id: this.$route.query.id}).then(data => {
        this.interfaceDesc.interfacedesc = this.treeData.name
        this.interfaceDesc.name = data.data[0].name // 接口名称
        this.interfaceDesc.registerPerson = data.userList.truename // 注册人
        this.interfaceDesc.registerUnit = data.userList.enterprisename // 注册单位
        var tag = ''
        var service_tag = data.data[0].service_tag
        for (var i = 0; i < service_tag.length; i++) {
          tag += service_tag[i] + ','
        }
        this.interfaceDesc.interfaceTag = tag.substring(0, tag.length - 1) // 接口标签
        this.interfaceDesc.createdTime = data.apply_time // 创建时间
        this.interfaceDesc.openAuth = data.data[0].open_type // 公开方式
        if (this.interfaceDesc.openAuth == 1) {
          this.interfaceDesc.openAuth = '完全公开'
        } else {
          this.interfaceDesc.openAuth = '条件公开'
        }
        var service_param = data.data[0].service_param_detail
        var service_type = data.data[0].service_type
        for (var i = 0; i < service_type.length; i++) {
          var arr = service_type[i]
          if (arr == '3') {
            if (service_param != undefined) {
              var param = JSON.parse(service_param[2])
              var input_param = ''
              for (var j = 0; j < param.service_param.length; j++) {
                input_param += param.service_param[j].name + ','
              }
              this.interfaceDesc.input = input_param.substring(0, input_param.length - 1) // 输入参数
              var output_param = ''
              for (var k = 0; k < param.service_out_param.length; k++) {
                output_param += param.service_out_param[k].name + ','
              }
              this.interfaceDesc.output = output_param.substring(0, output_param.length - 1) // 输出参数
            }
          }
        }
        this.interfaceDesc.interfaceExplain = data.data[0].service_remark // 接口说明
        LoadingBoxService.close()
      }, error => {
        console.error(error)
        LoadingBoxService.close()
      })
    },
    getApplyInfo () {
      apiClient.get('rcapi/findAppResourceByToken', {resource: this.resourceId}).then(data => {
        if (data.status || data.status === 0) {
          this.applyStatus = data.status
          this.applyId = data.id
          console.log(data.status)
        }
      })
    },
    download () {
      let params = $.param(this.interfaceDesc)
      window.location.href = Constants.apiBaseUrl + '/rcapi/downloadInterfaceDesc?token=' + Util.getToken() + '&' + params
      // apiClient.post('/api/downloadResourcesDesc', this.dataResourceDesc).then(data => {
      //   // console.log(data)
      //   let blob = new Blob([data], {type: 'application/pdf'})
      //   console.log(blob)
      //   let link = document.createElement('a')
      //   link.href = window.URL.createObjectURL(blob)
      //   link.download = 'ResourcesDesc_' + this.dataResourceDesc.name + '.pdf'
      //   link.click()
      // }, error => {
      //   console.error(error)
      // })
    },
    goHome () {
      this.$router.push({name: 'Index'})
      // this.$parent.leftNavData[1].active = false
      // this.$parent.leftNavData[0].active = true
    },
    goBack () {
      this.$router.push({path: 'resourceCatalog', query: {detail: true}})
    },
    apply () {
      this.$router.push({
        name: 'ApplyFillInForm',
        query: {
          type: 'person',
          resourcetype: '1',
          resourcetags: this.resourceId,
          resourcename: this.interfaceDesc.name,
          rootid: '',
          tag: this.interfaceDesc.interfaceTag
        }
      })
      // this.$parent.leftNavData[1].active = true
      // this.$parent.leftNavData[0].active = false
    },
    showInterface () {
      this.$router.push({name: 'dataResourceDbDetail', query: {id: this.resourceId}})
      this.$router.push({name: 'InterfaceDataDetail',
        query: {
          type: 'person',
          resourcetype: 1,
          id: this.resourceId}})
      // this.$parent.leftNavData[1].active = true
      // this.$parent.leftNavData[0].active = false
    },
    editApply () {
      this.$confirm('存在未提交的申请，是否编辑该申请', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$router.push({
          name: 'ApplyFillInForm',
          query: {
            type: 'person',
            resourcetype: '1',
            resourcetags: this.resourceId,
            resourcename: this.interfaceDesc.name,
            rootid: '',
            tag: this.interfaceDesc.interfaceTag,
            id: this.applyId
          }
        })
      }).catch(e => {
        console.error(e)
      })
      // this.$parent.leftNavData[1].active = true
      // this.$parent.leftNavData[0].active = false
    }
  }
}
</script>

<style src="../../css/btn.css" scoped></style>
<style scoped>
 /* 面包屑 */
  .breadCrumb {
    height: 45px;
    line-height: 45px;
    background-color: #ffffff;
    padding-left: 12px;
    font-size: 12px;
  }
  .icon-dingwei {
    color: #33D48D;
    padding-right: 10px;
  }
  .breadCrumb a {
    color: #000;
    text-decoration: none;
    padding-right: 17px;
    position: relative;
  }
  .breadCrumb a::before {
    content:'·';
    position: absolute;
    right: 3px;
    font-size: 26px;
    line-height: 42px;
    color: #000;
  }
  .breadCrumb a:hover {
    color: #33D48D;
  }
  /* 面包屑 */
  /* 内容 */
  .textlinpu.w100 {
    width: 100%;
  }
  .textlinpu.w100 .text {
    vertical-align: top;
  }
  .loadDataBox {
    padding-top: 30px;
    overflow-x: auto;
  }
  .inpfrom {
    min-width: 890px;
  }
  .loadDataBox input {
    border: none;
    outline: none;
    background-color: #fff;
    /* width: 240px; */
    color: #999;
  }
  .loadDataBox textarea {
    border: none;
    outline: none;
    background-color: #F9FBFE;
    width: 60%;
    resize: none;
    font-size: 14px;
    padding: 15px;
    color: #999;
  }
  .loadDataBox .tilesc {
    font-size: 16px;
    color: #63ADFD;
    padding-bottom: 85px;
    text-align: center;
  }
  .textlinpu {
    width: 49%;
    font-size: 12px;
    padding-bottom: 30px;
    display: inline-block;
  }
  .textlinpu .text {
    display: inline-block;
    width: 240px;
    text-align: right;
    padding-right: 20px;
  }
  .save-btn-bottom-box {
    text-align: center;
    padding-bottom: 40px;
    min-width: 890px;
  }
  .btnGreen,.btnBlue,.btnGray {
    margin-right: 120px;
  }
  /* 内容 */
  /* 返回按钮 */
  .goBack {
    margin-right: 0;
  }
  /* 返回按钮 */
</style>

