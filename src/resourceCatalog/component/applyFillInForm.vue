<template>
  <div class="publicContent">
    <div class="breadCrumb">
      <i @click="goHome" class="iconfont icon-dingwei"></i>
      <router-link :to="{name:breadCrumbPage}">{{breadCrumb}}</router-link>
      <span class="active">{{formData.title}}</span>
    </div>
    <div class="loadDataBox">
      <div class="inpfrom">
        <div class="divtime">
          <div class="row head-input head-input-code-box">
              &nbsp;申请人信息
          </div>
          <div class="con-cont wid">
            <div class="row input">
              <div class="col-md-2 input-label"><span>申请人</span></div>
              <div class="col-md-3"><span>{{formData.name}}</span></div>
              <div class="col-md-1"><span class="validate-msg"></span></div>
              <div class="col-md-2 input-label"><span>申请日期</span></div>
              <div class="col-md-3"><span>{{formData.applyDate}}</span></div>
              <div class="col-md-1"><span class="validate-msg"></span></div>
            </div>
            <div class="row input">
              <div class="col-md-2 input-label"><span>单位</span></div>
              <div class="col-md-3"><span>{{formData.compony}}</span></div>
              <div class="col-md-1"><span class="validate-msg"></span></div>
              <div class="col-md-2 input-label"><span>部门</span></div>
              <div class="col-md-3"><span>{{formData.dep}}</span></div>
              <div class="col-md-1"><span class="validate-msg"></span></div>
            </div>
            <div class="row input">
              <div class="col-md-2 input-label"><span>性别</span></div>
              <div class="col-md-3"><span>{{formData.sex}}</span></div>
              <div class="col-md-1"><span class="validate-msg"></span></div>
              <div class="col-md-2 input-label"><span>联系电话</span></div>
              <div class="col-md-3"><span>{{formData.tel}}</span></div>
              <div class="col-md-1"><span class="validate-msg"></span></div>
            </div>
            
          </div>
        </div>
        <!--需求描述-->
        <div class="divtime">
          <div class="row head-input head-input-code-box">
              &nbsp;需求描述
          </div>
          <div class="con-cont wid">
            <div class="row input">
              <div class="col-md-2 input-label"><span>需求类型</span></div>
              <!-- <div class="col-md-9"><div class="css-radio-box fleradio"> -->
              <div v-for="(item,index) in uiData.demandType" :key="index" class="col-md-2 typeSelect" v-bind:class="{active:item.active}" v-on:click="demandTypeRadioClickHandler(item,index)">
                <i></i><span>{{item.name}}</span><b v-if="item.input" class="css-rinpu"><input v-model="submitData.demandnote" type="text" class="inputborder"></b>
              </div>
              <!-- </div></div> -->
            </div>
            <div class="row input">
              <div class="col-md-2 input-label"><span>使用期限</span></div>
              <div class="col-md-9"> 
                <div class="css-radio-box">
                <div v-for="(item,index) in uiData.useLife" :key="index" class="rili">
                  <div v-on:click="useLifeRadioClickHandler(item,index)" v-bind:class="{active:item.active}" class="css-radio"><i></i><span>{{item.name}}</span></div>
                  <div class="rili-con" v-if="item.dataPick" v-show="item.active">
                    <el-date-picker
                      type="daterange"
                      v-model="uiData.time"
                      @change="dateSelectChangeHandler"
                      placeholder="选择日期范围"
                      :editable="false"
                      :picker-options="pickerOptions"
                    >
                    </el-date-picker>
                  </div>
                </div>
              </div></div>
              <div class="col-md-1"><span class="validate-msg"></span></div>
            </div>
            <div class="row input">
              <div class="col-md-2 input-label"><span>需求目的</span></div>
              <div class="col-md-9"><textarea v-model="submitData.demanddesc" class="inputborder textlinpu-text textrea">请详细描述您使用此数据的目的或用途（限300字以内）</textarea></div>
              <div class="col-md-1"><span class="validate-msg"></span></div>
            </div>
          </div>
        </div>
        <!--需求描述结束-->
        <!--其他备注-->
        <div class="divtime">
          <div class="row head-input head-input-code-box">
              &nbsp;其他备注
          </div>
          <div class="con-cont wid">
            <div class="row input">
              <div class="col-md-2 input-label"><span>备注</span></div>
              <div class="col-md-9"><textarea v-model="submitData.remarks" class="inputborder textlinpu-text textrea">请详细描述您使用此数据的目的或用途（限300字以内）</textarea></div>
              <div class="col-md-1"><span class="validate-msg"></span></div>
            </div>
          </div>
        </div>
        <!--其他备注结束-->
      </div>
      <div class="save-btn-bottom-box">
        <button type="button" class="btnWhite" @click="returnHandler">返回</button>
        <button type="button" class="btnGreen" @click="submitHandler">提交</button>
        <button type="button" class="btnGreen" @click="saveHandler">暂存</button>
      </div>
    </div>
  </div>
</template>
<script>
  // import HttpService from '../../publicService/HttpService'
   import apiClient from '@/publicJs/ApiClient.js'
  // import TipBoxService from '../../publicService/TipBoxService'
   import TipBoxService from '@/publicJs/TipBoxService'
   import LoadingBoxService from '@/publicJs/LoadingBoxService'
   let vueIns = null
   export default{
     name: 'ApplyFillinForm',
     data () {
       return {
         breadCrumb: '',
         breadCrumbPage: '',
         uiData: {
           demandType: [ {name: '临时办案', input: false, active: true}, {name: '日常查询', input: false, active: false}, {name: '开发应用', input: false, active: false}, {name: '其他', input: true, active: false} ],
           useLife: [{name: '某一段时间', active: true, dataPick: true}, {name: '长期使用', active: false, dataPick: false}],
           time: '',
           btnControlSwitch: true,
           resourcetags: ''
         },
         formData: {
           title: '',
           name: '',
           username: '',
           compony: '',
           dep: '',
           sex: '',
           tel: '',
           applyDate: ''
         },
         submitData: {
           resourcename: '',
           resourcetype: '',
           demandtype: 0,
           demandnote: '',
           time: '',
           demanddesc: '',
           perioduse: 0,
           remarks: '',
           resource: '',
           id: '',
           rootId: '',
           tag: ''
         },
         resourceEndTime: '',
         pickerOptions: {
           disabledDate (time) {
             if (vueIns.resourceEndTime !== '') {
               return time.getTime() < Date.now() - 8.64e7 ||
               time.getTime() > Date.parse(vueIns.resourceEndTime.replace(/-/g, '/'))
             } else {
               return time.getTime() < Date.now() - 8.64e7
             }
           }
         }
       }
     },
     created () {
       if (this.$route.query.type === 'person') {
         this.breadCrumb = '个人申请'
         this.breadCrumbPage = 'personApplyManage'
       } else if (this.$route.query.type === 'administrator') {
         this.breadCrumb = '申请管理'
         this.breadCrumbPage = 'applyManageAdministrator'
       }
       this.submitData.resourcename = this.$route.query.resourcename
       this.submitData.resource = this.$route.query.resourcetags
       this.submitData.resourcetype = this.$route.query.resourcetype
       this.submitData.id = this.$route.query.id
       this.submitData.rootId = this.$route.query.rootid
       this.submitData.tag = this.$route.query.tag
       this.getFormData()
       if (this.$route.query.resourcetype == 0) {
         this.findResourceById()
       }
       vueIns = this
      //  this.$parent.changeLeftNavActive(this.breadCrumb)
     },
     methods: {
       findResourceById () {
         apiClient.get('rcapi/findResourcesById', { resourceId: this.$route.query.resourcetags }).then(data => {
           if (data.resource.endtime !== '') {
             this.uiData.useLife = [{name: '某一段时间', active: true, dataPick: true}]
             this.resourceEndTime = data.resource.endtime
           }
         })
       },
       getFormData () {
         var that = this
         var myData = {resourceType: that.submitData.dbsource}
         apiClient.get('rcapi/findApplyerInfo', myData, function (data) {
            // console.info("data=",data);
           var title = '《' + that.submitData.resourcename + '》' + '数据资源申请'
           that.formData.title = title
           that.formData.name = data.results.truename
           that.formData.username = data.results.loginname
           that.formData.compony = data.results.enterprisename
           that.formData.dep = data.results.deptname
           that.formData.sex = data.results.sex
           that.formData.tel = data.results.phone
           that.formData.applyDate = data.results.applydate
         })

         var id = that.submitData.id
      // console.info("editId=",id);
         if (id != null && id != undefined && id != '') {
           this.backShow(id)
         }
       },
       demandTypeRadioClickHandler (val, index) {
         var that = this
         var uiArr = that.uiData.demandType
         for (var i = 0; i < uiArr.length; i++) {
           uiArr[i].active = false
         }
         val.active = true
         that.submitData.demandtype = index
         if (index != 3) { that.submitData.demandnote = '' }
       },
       useLifeRadioClickHandler (val, index) {
         var that = this
         var uiArr = that.uiData.useLife
         for (var i = 0; i < uiArr.length; i++) {
           uiArr[i].active = false
         }
         val.active = true
         that.submitData.perioduse = index
         if (index == 1) {
           that.submitData.time = ''
           that.uiData.time = ''
         }
       },
       dateSelectChangeHandler (data) {
         this.submitData.time = data
       },
       backShow (id) { // 编辑的时候从后台得到数据
         var that = this
         apiClient.get('rcapi/editApplicationResources', {id: id}, function (data) {
            // console.info("formData2=",data)
            /* that.submitData.demandtype=parseInt(data.results.demandtype);
            that.submitData.resourcename=data.results.resourcename;
            var title=that.submitData.resourcename+"资源申请";
            that.formData.title=title; */
           that.submitData.demandtype = parseInt(data.results.demandtype)
           that.submitData.rootId = data.results.rootId
           var uiArr = that.uiData.demandType
           for (var i = 0; i < uiArr.length; i++) {
             uiArr[i].active = false
           }
           uiArr[that.submitData.demandtype].active = true
           if (uiArr[that.submitData.demandtype].name == '其他') { that.submitData.demandnote = data.results.demandnote }
           that.submitData.perioduse = parseInt(data.results.perioduse)
           if (that.submitData.perioduse == 0) {
             that.submitData.time = data.results.starttime + ' - ' + data.results.endtime
             that.dateFormat(data.results.starttime, data.results.endtime)
           }
           var uiArr2 = that.uiData.useLife
           for (var j = 0; j < uiArr2.length; j++) {
             uiArr2[j].active = false
           }
           uiArr2[that.submitData.perioduse].active = true
           that.submitData.demanddesc = data.results.demanddesc
           that.submitData.remarks = data.results.remarks
           that.submitData.tag = data.results.tag
         })
       },
       dateFormat (startTime, endTime) {
         var that = this
         var data = new Array()
         var start = new Date(Date.parse(startTime.replace(/-/g, '/')))
         data.push(start)
         var end = new Date(Date.parse(endTime.replace(/-/g, '/')))
         data.push(end)
         that.uiData.time = data
       },
       submitHandler () {
         var that = this
         if (that.uiData.btnControlSwitch) {
           that.uiData.btnControlSwitch = false
           if (that.submitData.perioduse == 0 && that.submitData.time == '') {
             TipBoxService.open('请选择日期!', 2)
             that.uiData.btnControlSwitch = true
           } else {
             if (that.submitData.perioduse == 0) {
               let endDate = that.submitData.time.slice(13)
               let endTime = Date.parse(endDate.replace(/-/g, '/'))
               if (endTime + 86400000 < new Date().getTime()) {
                 TipBoxService.open('截止日期不能小于当前日期!', 2)
                 that.uiData.btnControlSwitch = true
                 return
               }
             }
             LoadingBoxService.open('数据保存中...')
             var str = JSON.stringify(that.submitData)
             var resourceTag = that.submitData.resource
             var resourceName = that.submitData.resourcename
             var resourceType = that.submitData.resourcetype
             var myData = {applyParam: str, id: that.submitData.id, resource: resourceTag, resourceType: resourceType, rootId: that.submitData.rootId, tag: that.submitData.tag}
             apiClient.get('rcapi/addApplicationResources', myData, function (data) {
              //  console.info('data=', data.results._response_data.data)
               LoadingBoxService.close()
               if (data.results._response_data.data == 'true') {
                 TipBoxService.open('保存成功')
                 setTimeout(function () {
                  //  that.$parent.leftNavData[2].active = false
                  //  that.$parent.leftNavData[1].active = true
                   that.$parent.setActive('资源管理', '我的申请')
                   that.$router.push('/personApplyManage?index=' + resourceType)
                  //  that.$router.go(-1)
                 }, 3000)
               } else {
                 TipBoxService.open('保存失败，请重试')
                 that.uiData.btnControlSwitch = true
               }
             })
           }
         }
       },
       saveHandler () {
         var that = this
         if (that.uiData.btnControlSwitch) {
           that.uiData.btnControlSwitch = false
           if (that.submitData.perioduse == 0 && that.submitData.time == '') {
             TipBoxService.open('请选择日期!', 2)
             that.uiData.btnControlSwitch = true
           } else {
             if (that.submitData.perioduse == 0) {
               let endDate = that.submitData.time.slice(13)
               let endTime = Date.parse(endDate.replace(/-/g, '/'))
               if (endTime + 86400000 < new Date().getTime()) {
                 TipBoxService.open('截止日期不能小于当前日期!', 2)
                 that.uiData.btnControlSwitch = true
                 return
               }
             }
             LoadingBoxService.open('数据保存中...')
             var str = JSON.stringify(that.submitData)
             var resourceTag = that.submitData.resource
             var resourceName = that.submitData.resourcename
             var resourceType = that.submitData.resourcetype
             var myData = {applyParam: str, id: that.submitData.id, resource: resourceTag, resourceType: resourceType, rootId: that.submitData.rootId, tag: that.submitData.tag}
             apiClient.get('rcapi/saveDraft', myData, function (data) {
               //  console.info('data=', data.results._response_data.data)
               LoadingBoxService.close()
               if (data.results._response_data.data == 'true') {
                 TipBoxService.open('保存成功')
                 setTimeout(function () {
                  //  that.$parent.leftNavData[2].active = false
                  //  that.$parent.leftNavData[1].active = true
                   that.$parent.setActive('资源管理', '我的申请')
                   that.$router.push('/personApplyManage?index=' + resourceType)
                 }, 2000)
               } else {
                 TipBoxService.open('保存失败，请重试')
                 that.uiData.btnControlSwitch = true
               }
             })
           }
         }
       },
       returnHandler () {
         this.$router.go(-1)
       },
       goHome () {
         this.$router.push({name: 'Index'})
         this.$parent.setActive('资源管理', '资源目录')
        //  this.$parent.leftNavData[1].active = false
        //  this.$parent.leftNavData[2].active = false
        //  this.$parent.leftNavData[0].active = true
       }
     }
   }
</script>
<style src="" scoped>
  .row{
    margin: 0;
  }
  .col-md-1, .col-md-2 , .col-md-3, .col-md-9{
    padding: 0;
  }
  .save-btn-bottom-box{
    background: #fff;
    height: 62px;
    box-shadow: 0px 0px 5px #ccc inset;
    text-align: center;
    padding-top: 15px;
    margin-top: 10px;
  }
  .save-btn-bottom-box button:nth-child(2){
    margin: 0 140px;
  }
  .head-input-code-box{
    color: #56a8fe;
    font-size: 14px;
    line-height: 40px;
    border-bottom: 1px solid #bbd0e5;
    height: 60px;
    padding-top: 20px;
    margin-bottom: 50px !important;
  }
  .input .input-label span{
    float: right;
    color: #222;
  }
  .loadDataBox{
    background-color: #f3f7fd;
    font-size: 12px;
    box-shadow: none;
  }
  .loadDataBox .input{
    margin-bottom: 26px;
  }
  .input .col-md-3>span, .input .col-md-9>span{
    color: #888;
    width: 100%;
  }
  .input textarea{
    height: 95px;
    width: 100%;
    border: 1px solid #eee;
    border-radius: 4px;
    padding: 5px 5px;
    resize : none;
    color: #888;
  }
  .table thead{
    table-layout:fixed;
  }
  .title {
    height: 80px;
    line-height: 80px;
    border-bottom: 1px solid #ccc;
    font-size: 16px;
    color: #55a8fd;
    text-align: center;
    margin-bottom: 55px;
  }
  .head-input{
    overflow: hidden;
    margin-bottom: 55px;
  }
  .commonnav{
    line-height: 45px;
  }
  .inpfrom{
    padding: 0 15px 20px 15px;
    -webkit-box-shadow: 0px 0px 5px #dedede inset;
    box-shadow: 0px 0px 5px #dedede inset;
    border-radius: 1px;
    background-color: #fff;
    border-radius: 2px;
  }
  .col-md-2 i, .rili i{
    width: 12px;
    height: 12px;
    margin-right: 4px;
    display: inline-block;
    vertical-align: middle;
    background: url('../../publicImages/radio.png') no-repeat;
  }
  .col-md-2.active i, .rili .active i{
    background-position: 0 -13px;
  }
  .col-md-2 span, .css-radio span{
    color: #888;
  }
  .fleradio .css-radio{
    float: left;
  } 
  .typeSelect{
    padding-left: 0px;
  }
  .rili{
    padding-bottom: 20px;
    height: 30px;
  }
  .el-date-editor.el-input{
    width: 266px;
    position: relative;
    top: -25px;
    left: 100px;
  }
  .el-input__inner{
    height: 30px;
  }
  .css-rinpu {
    display: none;
    position: absolute;
    top: -8px;
    margin-left: 4px;
  }
  .col-md-2.active .css-rinpu {
    display: inline-block;
  }
  .inputborder {
    height: 31px;
    width: 100%;
    border: 1px solid #eee;
    border-radius: 4px;
    padding: 0px 5px;
  }
</style>
<style>
  .css-radio-box .rili input{
    width: 262px;
    height: 31px;
    border: 1px solid #d4e2ed !important;
    border-radius: 4px;
    padding: 0px 10px;
  }
</style>
