<template>
  <div class="publicContent">
    <div class="breadCrumb">
      <i @click="goHome" class="iconfont icon-dingwei"></i>
      <router-link to="/resourceCatalog">资源目录</router-link>
      <a href="javascript:;" @click="goBack">{{dataResourceDesc.datasourcedesc}}</a>
      <span>资源详情</span>
      <div class="topbtnContainer">
      </div>
    </div>
    <div class="loadDataBox" style="overflow:auto;position:absolute;top:45px;bottom:0;left:0;right:0">
      <div class="inpfrom">
        <h2 class="tilesc">《{{dataResourceDesc.name}}》数据资源说明</h2>
        <div class="divtime">
          <div class="con-cont wid">
            <div class="textlinpu">
              <span class="text">注册人</span>
              <input v-model="dataResourceDesc.registerPerson" disabled type="text" class="inputborder textlinpu-text w240">
            </div>
            <div class="textlinpu">
              <!--<span class="text">注册单位</span>-->
              <!--<input v-model="dataResourceDesc.registerUnit" disabled type="text" class="inputborder textlinpu-text w240">-->
            </div>
            <div class="textlinpu">
              <span class="text">数据注册时间</span>
              <input v-model="dataResourceDesc.dataRegisterTime" disabled type="text" class="inputborder textlinpu-text w240">
            </div>
            <div class="textlinpu">
              <span class="text">数据权限</span>
              <input v-model="dataResourceDesc.dataAuth" disabled type="text" class="inputborder textlinpu-text w240">
            </div>
            <div class="textlinpu w100">
              <span class="text">数据字段</span>
              <textarea v-model="dataResourceDesc.dataItem" disabled class="inputborder textlinpu-text textrea"></textarea>
            </div>
            <div class="textlinpu">
              <span class="text">数据来源</span>
              <input v-model="dataResourceDesc.dataSource" disabled type="text" class="inputborder textlinpu-text w240">
            </div>
            <div class="textlinpu">
              <span class="text">使用期限</span>
              <input v-model="dataResourceDesc.validTimeRange" disabled type="text" class="inputborder textlinpu-text w240  w250">
            </div>
            <div class="textlinpu w100">
              <span class="text">数据说明</span>
              <input v-model="dataResourceDesc.dataExplain" disabled type="text" class="inputborder textlinpu-text w240">
            </div>
          </div>
        </div>
        
      </div>
      <div class="save-btn-bottom-box">
        <button v-if="verifyPermission('009001005')" type="button" class="btnGreen" @click="download">下载说明</button>
        <span v-if="verifyPermission('009001004')">
          <button type="button" class="btnGreen" @click="apply" v-if="applyStatus === '' || applyStatus === 'NO_PASS' || applyStatus === 'EXPIRED'">申请访问</button>
          <button type="button" class="btnGreen" @click="editApply" v-if="applyStatus === 0">申请访问</button>
          <button type="button" class="btnGray" v-if="applyStatus === 'WAITING'" disabled title="审批中">申请访问</button>
          <button type="button" class="btnGreen" @click="showDataResource" v-if="applyStatus === 'PASS'">访问资源</button> 
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
import Constants from '@/publicJs/Constants.js'
import LoadingBoxService from '../../../publicJs/LoadingBoxService.js'
import Util from '@/publicJs/Util'
export default {
  name: 'dataDetail',
  components: {
    privibutton
  },
  mounted () {
    this.getResource()
    this.getApplyInfo()
    var treeData = sessionStorage.getItem('treeData')
    this.treeData = JSON.parse(treeData)
  },
  data () {
    return {
      treeData: {},
      dataResourceDesc: {
        datasourcedesc: '',
        name: '', // 数据名称
        registerPerson: '', // 注册人
        registerUnit: '', // 注册单位
        dataRegisterTime: '', // 数据注册时间
        dataAuth: '', // 数据权限
        dataItem: '', // 数据字段
        dataSource: '', // 数据来源
        validTimeRange: '', // 使用期限
        dataExplain: '', // 数据说明
        recordTag: '' // 资源标签
      },
      resourceId: '',
      applyId: '',
      applyStatus: ''
    }
  },
  methods: {
    getResource () {
      // let loadingInstance = Loading.service({ fullscreen: true, text: '加载中...' })
      LoadingBoxService.open('数据加载中...')
      this.resourceId = this.$route.query.id
      apiClient.get('/rcapi/findResourcesById', {resourceId: this.$route.query.id}).then(data => {
        // console.log(data)
        // this.dataResourceDesc.datasourcedesc = data.resource.datasourcedesc
        this.dataResourceDesc.datasourcedesc = this.treeData.name
        this.dataResourceDesc.name = data.resource.resourcename // 数据名称
        this.dataResourceDesc.registerPerson = data.resource.truename // 注册人
        this.dataResourceDesc.registerUnit = data.resource.bussid // 注册单位
        this.dataResourceDesc.dataRegisterTime = data.resource.registtime // 数据注册时间
        this.dataResourceDesc.dataAuth = data.resource.datapriv // 数据权限
        this.dataResourceDesc.recordTag = data.resource.resourcetag
        // console.log('标签', this.dataResourceDesc.recordTag)
        let dbfields = []
        for (let i = 0; i < data.table.dbfield.length; i++) {
          if (data.table.dbfield[i].status === true) {
            dbfields.push(data.table.dbfield[i])
          }
        }
        this.dataResourceDesc.dataItem = _.join(_.map(dbfields, function (v) {  // 数据字段
          return v.name + (v.desc ? '(' + v.desc + ')' : '')
        }), '、')
        this.dataResourceDesc.dataSource = data.resource.datasource // 数据来源
        if (data.resource.begintime === '1970-01-01' || data.resource.perioduse === 1) {
          this.dataResourceDesc.validTimeRange = '长期使用' // 使用期限
          this.time = '长期使用'
        } else {
          this.dataResourceDesc.validTimeRange = data.resource.begintime + ' 至 ' + data.resource.endtime
          this.time = data.resource.begintime + ' 至 ' + data.resource.endtime
        }
        this.dataResourceDesc.dataExplain = data.resource.datasourcedesc // 数据说明
        LoadingBoxService.close()
      }, error => {
        console.error(error)
        LoadingBoxService.close()
      })
    },
    getApplyInfo () {
      apiClient.get('rcapi/findAppResourceByToken', {resource: this.resourceId}).then(data => {
        // console.log(data)
        if (data.status || data.status === 0) {
          this.applyStatus = data.status
          this.applyId = data.id
        }
      })
    },
    download () {
      let params = $.param(this.dataResourceDesc)
      window.location.href = Constants.apiBaseUrl + '/rcapi/downloadResourcesDesc?token=' + Util.getToken() + '&' + params
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
    },
    goBack () {
      this.$router.push({path: 'resourceCatalog', query: {detail: true}})
    },
    apply () {
      this.$router.push({
        name: 'ApplyFillInForm',
        query: {
          type: 'person',
          resourcetype: '0',
          resourcetags: this.resourceId,
          resourcename: this.dataResourceDesc.name,
          tag: this.dataResourceDesc.recordTag,
          rootid: ''
        }
      })
      this.$parent.setActive('资源管理', '我的申请')
      // this.$parent.leftNavData[1].active = true
      // this.$parent.leftNavData[0].active = false
    },
    showDataResource () {
      sessionStorage.setItem('dataResourceDbDetailtitle', this.dataResourceDesc.name)
      this.$router.push({name: 'dataResourceDbDetail', query: {id: this.resourceId}})
      this.$parent.setActive('资源管理', '我的申请')
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
            resourcetype: '0',
            resourcetags: this.resourceId,
            resourcename: this.dataResourceDesc.name,
            tag: this.dataResourceDesc.recordTag,
            rootid: '',
            id: this.applyId
          }
        })
      }).catch(e => {
        console.error(e)
      })
      this.$parent.setActive('资源管理', '我的申请')
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
 .textlinpu .w250{
   width: 240px;
 }
</style>

