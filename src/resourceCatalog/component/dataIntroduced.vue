<template>
  <div class="publicContent" >
    <!-- <left-nav :selectIndex="2"></left-nav> -->
    <div class="breadCrumb">
      <!-- <img src="../../publicImages/home.png" @click="goHome" style="cursor:pointer;"> -->
      <i @click="goHome" class="iconfont icon-dingwei"></i>
      <router-link :to="{name:breadCrumbPage}">{{breadCrumb1}}</router-link>
      <!-- <span class="arrows">></span> -->
      <span class="active">{{breadCrumb2}}</span>
    </div>
    <div class="loadDataBox" style="overflow:auto;overflow-x: hidden; position:absolute;top:48px;bottom:0;left:1px;right:0">
      <!-- 步骤 -->
      <div class="lanmpege">
        <div class="lanmp-con">
          <div class="lanbbag">
            <p style="width: 18%"></p>
          </div>
          <div class="lanbag-text">
            <span class="tim1">基本信息</span>
            <span class="tim2">配置信息</span>
            <span class="tim3">数据字段</span>
            <span class="tim4">配置完成</span>
          </div>
        </div>
      </div>
      <!-- 主体内容 -->
      <div class="iformcon">
        <div class="iformcon-con reg1">
          <div class="time-x">
            <span class="texet"><i>*</i>服务资源名称</span>
            <span class="inputime ">
              <input type="text" class="inputborder textlinpu-text wi540" v-model='resource.resourcename'
              :class='{wrong:(resource.resourcename == "" && isSubmit)||nameUnique === false}' @blur="checkName">
              <img src="../../publicImages/loading_check.gif" v-show="loadingImg"/>
            </span>
          </div>
          <div class="time-x">
            <span class="texet"><i>*</i>资源标签</span>
            <span class="inputime">
              <!-- resource.resourcetag -->
              <input type="text" class="inputborder textlinpu-text wi450" v-model='resource.resourcetag' readonly
              :class='{wrong:resource.resourcetag == "" && isSubmit}' >
            </span>
            <span>
              <button class="inputborder butbox" @click='showTags'>选择标签</button>
            </span>
          </div>
          <div class="time-x">
            <span class="texet"><i>*</i>数据来源</span>
            <span class="inputime ">
              <input type="text" class="inputborder textlinpu-text wi540" v-model='resource.datasource'
              :class='{wrong:resource.datasource == "" && isSubmit}'>
            </span>
          </div>
          <div class="time-x datebox">
            <span class="texet">数据使用期限</span>
            <div class="dateSection">
              <div v-on:click="useLifeRadioClickHandler(0)" v-bind:class="{active:shortTimeRange}" class="css-radio"><i></i><span>某一段时间</span></div>
              <div v-show="shortTimeRange" class="datePicker">
                <span class="inputime">
                  <el-date-picker class='inputimeBox'
                    :class='{wrong:resource.begintime == "" && isSubmit}'
                    v-model='resource.begintime'
                    @change='getBegintime'
                    type="date"
                    placeholder="选择日期"
                    format="yyyy-MM-dd"
                    :picker-options="pickerOptions0"
                    :editable="false">
                  </el-date-picker>
                </span>
                <span>
                  至
                </span>
                <span class="inputime">
                  <el-date-picker class='inputimeBox'
                    :class='{wrong:resource.begintime == "" && isSubmit}'
                    v-model='resource.endtime'
                    @change='getEndtime'
                    type="date"
                    placeholder="选择日期"
                    format="yyyy-MM-dd"
                    :picker-options="pickerOptions1"
                    :editable="false">
                  </el-date-picker>
                </span>
              </div>
            </div>
            <div class="dateSection">
            <div v-on:click="useLifeRadioClickHandler(1)" v-bind:class="{active:longTimeRange}" class="css-radio"><i></i><span>长期使用</span></div>
            </div>
          </div>
          <div class="time-x">
            <span class="texet"><i>*</i>数据源介绍</span>
            <textarea class="inputborder textlinpu-text textreas wi540" placeholder="请详细描述您使用此数据的目的或用途（限300字以内）"  v-model='resource.datasourcedesc'
            :class='{wrong:resource.datasourcedesc == "" && isSubmit}'></textarea>
          </div>
          <div class="time-x">
            <span class="texet"><i>*</i>数据权限</span>
            <span class="riadio">
              <div class="css-radio fl " @click='transform("公开")' :class='{active:resource.datapriv =="公开"}'><i></i><em>公开</em></div>
              <div class="css-radio fl f1Right" @click='transform("非公开")' :class='{active:resource.datapriv =="非公开"}'><i></i><em>非公开</em></div>
          </span>
        </div>
        <p class="shuomin">说明：非公开指此资源申请者需通过审批才能调用此数据</p>
      </div>
    </div>
<!-- 下一步 -->
    <div class="fenye">
      <button class="btnBlue" @click='dataIntroducedNext'>下一步</button>
      <button class="btnGreen " @click='draft' v-show="approvalStatusCode=='NO_PASS'?false : true">暂存</button>
    </div>
  </div>

<!-- 选择标签 -->
  <LabelView :dialogTagVisible.sync="dialogTagVisible" :isCreateModel="true" :model="resource" modelLabelKey="checkedLabels"/>
</div>
</template>
<script>
  import LabelView from '@/publicComponent/labelView'
  import TipBoxService from '@/publicJs/TipBoxService'
  import apiClient from '@/publicJs/ApiClient.js'
  import ApiClient from '@/publicJs/ApiClient'
  import _ from 'lodash'

  let vueIns = null
  export default{
    name: 'dataintroduced',
    components: {
      LabelView
    },
    watch: {
      'resource.checkedLabels' (value) {
        this.resource.resourcetag = value.join(',')
      }
    },
    data () {
      return {
        breadCrumb1: '',
        breadCrumb2: '',
        breadCrumbPage: '',
        pickerOptions0: {
          disabledDate (time) {
            return (time.getTime() < Date.now() - 8.64e7) || (vueIns.resource.endtime && (time.getTime() > new Date(vueIns.resource.endtime)))
          }
        },
        pickerOptions1: {
          disabledDate (time) {
            return (time.getTime() < Date.now() - 8.64e7) || (vueIns.resource.begintime && (time.getTime() < new Date(vueIns.resource.begintime)))
          }
        },
        mockDate: '',
        mockDate1: '',
        dialogTagVisible: false, // 选择标签 是否隐藏。
        labelStr: '',  // 页面显示的
        isSubmit: false,
        isEdit: sessionStorage.page1 !== undefined,
        resource: {
          resourcetype: '', // 资源划分
          datatype: '', // 数据类型
          resourcename: '', // 服务资源名称
          resourcetag: '', // 标签
          checkedLabels: [], // 标签id
          datasource: '', // 数据来源
          begintime: '', // 开始时间
          endtime: '', // 结束时间
          datasourcedesc: '', // 数据源介绍
          status: 0, // 0暂存1保存
          datapriv: '公开', // 数据权限
          perioduse: 0 // 是否长期 0范围 1长期
        },
        shortTimeRange: true,
        longTimeRange: false,
        loadingImg: false,
        nameUnique: true,
        nameStorage: '',
        approvalStatusCode: ''
      }
    },
    created () {
      // console.log(this.$route)
        this.approvalStatusCode = this.$route.query.approvalStatusCode
      if (this.$route.query.type === 'person') {
        this.breadCrumb1 = '个人注册'
        this.breadCrumb2 = '数据库类'
        this.breadCrumbPage = 'personRegisterManage'
      } else if (this.$route.query.type === 'register') {
        this.breadCrumb1 = '注册管理'
        this.breadCrumb2 = '注册数据资源'
        this.breadCrumbPage = 'registerManageAdministrator'
      }
      vueIns = this
    },
    mounted () {
      this.getQuery()  // 获取路径中的参数
      this.loadHistoryData()
    },
    methods: {
      showTags () {
        this.dialogTagVisible = true
      },
      changeDate (date) {
        return Date(Date.parse(date.replace(/-/g, '/'))).getTime()
      },
      getQuery () {
        this.resource.resourcetype = this.$route.query.resource
        this.resource.datatype = this.$route.query.dbinfo
      },
      transform (val) {
        if (val === '公开') {
          this.resource.datapriv = '公开'
        } else {
          this.resource.datapriv = '非公开'
        }
      },
      getBegintime (date) {
        this.resource.begintime = date
        if (this.resource.perioduse === 0 && this.resource.endtime !== '' && this.resource.begintime > this.resource.endtime) {
          TipBoxService.open('截止日期必须大于等于开始日期', 2)
        }
      },
      getEndtime (date) {
        this.resource.endtime = date
        if (this.resource.perioduse === 0 && this.resource.begintime !== '' && this.resource.begintime > this.resource.endtime) {
          TipBoxService.open('截止日期必须大于等于开始日期', 2)
        }
      },
    // 点击下一步
      dataIntroducedNext () {
        if (!this.checkData()) {
          return false
        }
        // 清空长期使用时的时间
        if (this.resource.perioduse === 1) {
          this.resource.begintime = ''
          this.resource.endtime = ''
        }
        let that = this
        if (sessionStorage.page1 === undefined) {
          that.saveHistoryData()
        }
        nextStep()
        function nextStep () {
          that.resource.id = sessionStorage.page1 === undefined ? '' : JSON.parse(sessionStorage.page1).id
          let query = {resource: JSON.stringify(that.resource)}
          apiClient.get('rcapi/addResources', query, function (data) {
            let page1 = that.resource
            page1.id = data.results.resourceId
            sessionStorage.page1 = JSON.stringify(page1)
            that.$router.push({path: 'configinfo', query: {resourcename: that.resource.resourcename, type: that.$route.query.type,approvalStatusCode : that.approvalStatusCode}})
          })
        }
      },
    // 点击暂存
      draft () {
        if (!this.checkData()) {
          return false
        }
        // 清空长期使用时的时间
        if (this.resource.perioduse === 1) {
          this.resource.begintime = ''
          this.resource.endtime = ''
        }
        let that = this
        this.resource.status = 0
        this.resource.id = sessionStorage.page1 == undefined ? '' : JSON.parse(sessionStorage.page1).id
        // console.log('resource', this.resource)
        let query = {resource: JSON.stringify(this.resource)}
        apiClient.get('rcapi/addResources', query, function (data) {
          if (data.results.resourceId != '') {
            let page1 = that.resource
            page1.id = data.results.resourceId
            sessionStorage.page1 = JSON.stringify(page1)
            TipBoxService.open('暂存成功！')
          }
        })
        // this.$parent.leftNavData[3].active = true
        // this.$parent.leftNavData[4].active = false
        this.$parent.setActive('资源管理', '我的注册')
        this.$router.push({name: 'personRegisterManage'})
      },
      // 保存标签信息
      // saveLabel () {
      //   let that = this
      //   this.resource.id = JSON.parse(sessionStorage.page1).id
      //   this.resource.resourcetag = this.resource.checkedLabels.join(',')
      //   let query = {resource: JSON.stringify(this.resource)}
      //   return apiClient.get('/rcapi/addResources', query).then(data => {
      //     let page1 = that.resource
      //     page1.id = data.results.resourceId
      //     sessionStorage.page1 = JSON.stringify(page1)
      //   }).catch(e => {
      //     console.error(e)
      //   })
      // },
      saveHistoryData () {
        let that = this
        var store = JSON.stringify(that.resource)
        sessionStorage.page1 = store
      },
      loadHistoryData () {
        let that = this
        var store = sessionStorage.page1
        // console.log(store)
        if (store != null && store != undefined && store.length != 0) {
          store = JSON.parse(store)
          // 这个方法体里面实现要回显本地数据的方法
          that.resource.resourcetype = store.resourcetype
          that.resource.datatype = store.datatype // 数据类型
          that.resource.resourcename = store.resourcename // 服务资源名称
          that.nameStorage = store.resourcename
          that.resource.resourcetag = store.resourcetag // 标签
          that.resource.checkedLabels = store.checkedLabels // 标签id
          that.resource.datasource = store.datasource // 数据来源
          that.resource.begintime = store.begintime // 开始时间
          that.resource.endtime = store.endtime // 结束时间
          that.resource.datasourcedesc = store.datasourcedesc // 数据源介绍
          that.resource.status = store.status // 0暂存1保存
          that.resource.datapriv = store.datapriv // 数据权限
          that.resource.perioduse = store.perioduse
          that.useLifeRadioClickHandler(that.resource.perioduse)
        }
      },
      // 切换使用期限方法
      useLifeRadioClickHandler (num) {
        if (num === 0) {
          this.shortTimeRange = true
          this.longTimeRange = false
          this.resource.perioduse = 0
        } else if (num === 1) {
          this.shortTimeRange = false
          this.longTimeRange = true
          this.resource.perioduse = 1
        }
      },
      // 返回主页
      goHome () {
        this.$router.push({name: 'Index'})
        this.$parent.setActive('资源管理', '资源目录')
        // this.$parent.leftNavData[3].active = false
        // this.$parent.leftNavData[4].active = false
        // this.$parent.leftNavData[0].active = true
      },
      // 校验数据
      checkData () {
        if (this.nameUnique === false){
          TipBoxService.open('资源名称校验未通过', 2)
          return false
        }
        let sum = 0
        for (var o in this.resource) {
          if (this.resource[o] === '' && o !== 'begintime' && o !== 'endtime') {
            sum++
          }
        }
        if (sum !== 0) {
          this.isSubmit = true
          TipBoxService.open('请填写必填项', 2)
          return false
        } else {
          // console.log('perioduse+', this.resource.perioduse)
          if (this.resource.perioduse === 1) {
            return true
          } else if (this.resource.perioduse === 0 && this.resource.begintime === '' && this.resource.endtime === '') {
            TipBoxService.open('请选择开始和结束时间', 2)
          } else if (this.resource.perioduse === 0 && this.resource.begintime === '' && this.resource.endtime !== '') {
            TipBoxService.open('请选择开始时间', 2)
          } else if (this.resource.perioduse === 0 && this.resource.begintime !== '' && this.resource.endtime === '') {
            TipBoxService.open('请选择结束时间', 2)
          } else if (this.resource.perioduse === 0 && this.resource.begintime > this.resource.endtime) {
            TipBoxService.open('截止日期必须大于等于开始日期', 2)
          } else {
            return true
          }
          return false
        }
      },
      checkName () {
        this.nameUnique = true
        if (this.resource.resourcename.trim() !== '' && this.resource.resourcename.trim() !== this.nameStorage) {
          this.loadingImg = true
          let name = this.resource.resourcename.trim()
          let dataTotal = {}
          ApiClient.get('rcapi/queryRegistResources',
            { keyword: '',
              tag: '',
              status: '0,1,2,3,4',
              resourceType: 0,
              searchParam: name,
              pageNum: 1,
              pageSize: 1000,
              sort: 0,
              visitSort: 3}).then(data => {
                if (data.data === null || data.total === 0) {
                  TipBoxService.open('资源名称可用', 0)
                  this.nameUnique = true
                } else {
                  dataTotal = data.data
                  for (let i = 0; i < dataTotal.length; i++){
                    if (dataTotal[i].resourcename === name) {
                      TipBoxService.open('资源名称重复', 2)
                      this.nameUnique = false
                      break
                    }
                    TipBoxService.open('资源名称可用', 0)
                    this.nameUnique = true
                  }
                }
                this.loadingImg = false
              }, error => {
                if (error.response && error.response.status === 404) {
                  TipBoxService.open('API不存在或无法访问', 2)
                  this.nameUnique = false
                } else {
                  TipBoxService.open('检索数据失败, 访问API服务异常', 2)
                  this.nameUnique = false
                }
              })
        } else if (this.resource.resourcename.trim() === '') {
          TipBoxService.open('资源名称不能为空', 2)
          this.nameUnique = false
        }
      }
    }
  }
</script>
<style src="" scoped>
.btnGreen {
  margin-left: 120px;
}
.publicNav{
  box-sizing: border-box;
  padding: 15px; 
      height: 45px;
    background-color: #fff;
    -webkit-box-shadow: 0 0 5px #ccc;
    box-shadow: 0 0 5px #ccc;
    border-radius: 1px
}
.publicNav  img{
  width: 16px;
  height: 15px;
  background-size: cover;
}
.lanmpege{
    background: #ffffff;
    height: 90px;
    width:100%;
}
.lanmp-con{
    width:918px;
    margin: 0 auto;
    padding-top: 30px;
}
/* .lanbbag{
    background: url("../../publicImages/1.png") no-repeat;
    background-size: cover;
    width:917px;
    height: 5px;
}
.lanbbag p{
    background: url("../../publicImages/2.png") no-repeat;
    background-size: cover;
    width:992px;
    height: 5px;
} */
.lanbbag{
    background: url("../../publicImages/1.png") no-repeat;
    width:861px;
    height: 34px;
    background-size: cover
}
.lanbbag p{
    background: url("../../publicImages/2.png") no-repeat;
    /* width:861px !important; */
    height: 34px;
    background-size: cover
}
.iformcon{
    height: 100%;
}
.iformcon-con{
    width:730px;
}
.lanbag-text{
    width:992px;
    margin-top: 5px;
    position: relative;
}
.lanbag-text span:nth-child(1){
  position:absolute;
  left: -10px;
  top:0;
}
.lanbag-text span:nth-child(2){
  position:absolute;
  left: 55px;
  top:0;
}
.lanbag-text span:nth-child(3){
  position:absolute;
  left: 330px;
  top:0;
}
.lanbag-text span:nth-child(4){
  position:absolute;
  left: 604px;
  top:0;
}
.lanbag-text span{
font-size: 16px;
}
.lanbag-text span:nth-child(1) {

}
.lanbag-text span.tim1{
    color:#58A6F9
}
/* 主体内容 */
.iformcon-con{
    width:730px;
    margin: 0 auto;
    margin-top: 40px;
}

.lanbag-text{
    width:992px;
    margin-top: 5px;
}
.time-x{
    /* // padding-left: 150px; */
    box-sizing: border-box;
    margin-bottom: 10px;
}
.time-x span{
    display: inline-block;
    vertical-align: middle;
}
.time-x .texet{
    width:145px;
    color: #333;
    font-size: 12px;
    line-height: 36px;
    text-align: right;
}
.time-x .padingstye{
    padding: 20px 0;
}
.time-x .butbox{
    border: 1px #56A8FA solid;
    color: #56A8FA;
    background-color: #ffffff;
}
.time-x .wi540{
    width:540px;
}
.time-x .wi450{
    width:450px;
}
.time-x .wi250{
    width:247px;
}
.time-x .texet i{
    color:#b61717;
}
.time-x .wrong{
  border-color:  #b61717  ;
}
.time-x .wrong>.el-input__inner{
  border-color:  #b61717  ;
}
.time-x .riadio{
    overflow: hidden;
    padding: 10px 0;
    font-size: 12px;
}
.time-x .shuomin{
    color: #999999;
}
.textreas{
    height: 180px;
}
.lanbag-text span{
    font-size: 12px;
    display: inline-block;
}
.lanbag-text span.tim2,.lanbag-text span.tim3,.lanbag-text span.tim4{
    margin-left: 209px;
}
.inputborder {
    border: 1px #dadada solid;
    border-radius: 3px;
    padding: 8px 12px;
    font-size: 12px;
    margin: 0;
}
.css-radio{
    cursor: pointer;
    display: inline-block;
}
.css-radio i{
    background: url("../../publicImages/radio.png") no-repeat;
    background-color: white;
    width: 12px;
    height: 12px;
    display: inline-block;
    vertical-align: middle;
    margin-right: 4px; 
}
.css-radio.active i{
    background-position: 0 -13px;
}
.css-radio em{
    font-style:normal;
    display: inline-block;
    vertical-align: middle;
}
.f1Right{
	padding-left: 49px;
}
.shuomin{
	padding-left: 152px;
	margin-top: -15px;
	color: #999;
	font-size: 12px;
	padding-bottom: 50px;
}
.fenye{
    border-top:1px #d9d9d9 dashed;
    width:98%;
    height: 60px;
    text-align: center;
    margin: 0 auto;
    padding-top: 15px;
}
.texet i{
  position: relative;
  left: -5px;
  top:2px;
  font-style:normal;
}
.el-dialog__header{
  background-color: #56A8FE;
}
.tim1,.tim2,.tim3,.tim4{
  font-size: 14px !important;
}
.arrows {
  font-family: 'SimHei';
}
.inputimeBox{
  width: 250px;
}
.datePicker{
  position: relative;
  top: -28px;
  left: 85px;
}
.datebox{
  position: relative;
}
.dateSection{
  height: 30px;
  margin-bottom: 10px;
  position: relative;
  top: -27px;
  left: 150px;
}
.dateSection:nth-of-type(2){
  margin-bottom: -30px;
}
</style>
<style>
.el-dialog .el-dialog__header{
  background-color: #56A8FE;
}
.aui-button{
   width: 80px;
    height: 30px;
    outline: none;
    border: none;
    border-radius: 4px;
    color: #fff;
    background-color:#56A8FE;
}
</style>

