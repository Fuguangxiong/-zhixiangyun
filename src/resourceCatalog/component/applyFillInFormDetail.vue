<template>
  <div class="main-content-box">
    <div class="main-content">
      <div class="inpfrom">
        <div class="divtime">
          <div class="row head-input">
            <div><span>申请人信息</span></div>
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
            <!-- <div class="row input">
              <div class="col-md-2 input-label"><span>单位</span></div>
              <div class="col-md-3"><span>{{formData.compony}}</span></div>
              <div class="col-md-1"><span class="validate-msg"></span></div>
              <div class="col-md-2 input-label"><span>部门</span></div>
              <div class="col-md-3"><span>{{formData.dep}}</span></div>
              <div class="col-md-1"><span class="validate-msg"></span></div>
            </div> -->
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
          <div class="row head-input">
            <div><span>需求描述</span></div>
          </div>
          <div class="con-cont wid">
            <div class="row input">
              <div class="col-md-2 input-label"><span>需求类型</span></div>
              <div class="col-md-3"><span>{{formData.demandType}}</span></div>
              <div class="col-md-1"><span class="validate-msg"></span></div>
            </div>
            <div class="row input">
              <div class="col-md-2 input-label"><span>使用期限</span></div>
              <div class="col-md-3"><span>{{formData.perioduse}}</span></div>
              <div class="col-md-1"><span class="validate-msg"></span></div>
            </div>
            <div class="row input">
              <div class="col-md-2 input-label"><span>需求目的</span></div>
              <div class="col-md-9"><textarea class="col9-textarea" readonly="true" v-model="formData.demanddesc"></textarea></div>
              <div class="col-md-1"><span class="validate-msg"></span></div>
            </div> 
          </div>
        </div>
        <!--需求描述结束-->
        <!--其他备注-->
        <div class="divtime">
          <div class="row head-input">
            <div><span>其他备注</span></div>
          </div>
          <div class="con-cont wid">
            <div class="row input">
              <div class="col-md-2 input-label"><span>备注</span></div>
              <div class="col-md-9"><textarea class="col9-textarea" readonly="true" v-model="formData.remarks"></textarea></div>
              <div class="col-md-1"><span class="validate-msg"></span></div>
            </div> 
          </div>
        </div>
        <!--其他备注结束-->
      </div>
    </div>
  </div>
</template>
<script>
import ApiClient from '../../publicJs/ApiClient.js'
// import TipBoxService from '../../publicJs/TipBoxService.js'
import LoadingBoxService from '../../publicJs/LoadingBoxService.js'
export default {
  name: 'ApplyFillInFormDetail',
  props: ['id'],
  data () {
    return {
      uiData: {
        demandType: [
          { name: '临时办案', input: false, active: true },
          { name: '日常查询', input: false, active: false },
          { name: '开发应用', input: false, active: false },
          { name: '其他', input: true, active: false }
        ],
        useLife: [
          { name: '某一段时间', active: true, dataPick: true },
          { name: '长期使用', active: false, dataPick: false }
        ],
        time: '',
        btnControlSwitch: true
      },
      formData: {
        title: '',
        name: '',
        username: '',
        compony: '',
        dep: '',
        sex: '',
        tel: '',
        applyDate: '',
        demandType: '',
        perioduse: '',
        demanddesc: '',
        remarks: ''
      },
      submitData: {
        resourcetype: '',
        resourcetags: '',
        dbsource: '',
        demandtype: 0,
        demandnote: '',
        time: '',
        demanddesc: '',
        perioduse: 0,
        remarks: '',
        id: ''
      }
    }
  },
  mounted () {
    if (this.id != null) {
      this.backShow(this.id)
    } else {
      this.backShow(this.$route.params.id)
    }
  },
  methods: {
    backShow (id) {
      // 编辑的时候从后台得到数据
      // var that=this;
      LoadingBoxService.open('数据加载中...')
      ApiClient.get('rcapi/editApplicationResources?token=', {
        id: id
      }).then(data => {
        // console.info( "formData2=",data)
        this.formData.name = data.truename
        this.formData.username = data.loginname
        this.formData.compony = data.enterprisename
        this.formData.dep = data.deptname
        this.formData.sex = data.sex
        this.formData.tel = data.phone
        this.formData.applyDate = data.applytime
        this.formData.demandType = data.demandname
        // this.formData.perioduse = data.time
        if (data.perioduse == 1) {
          this.formData.perioduse = '长期使用'
        } else {
          this.formData.perioduse = data.time
        }
        this.formData.demanddesc = data.demanddesc
        if (data.remarks == '') {
          this.formData.remarks = '无'
        } else {
          this.formData.remarks = data.remarks
        }
        LoadingBoxService.close()
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
    goHome () {
      this.$router.push({ name: 'RcIndex' })
    }
  }
}
</script>
<style scoped>
.input .input-label span {
  float: right;
  color: #222;
}
.main-content-box {
  box-shadow: none;
  background-color: #fff;
  padding: 0 15px;
  font-size: 12px;
}
.main-content-box .input {
  margin-bottom: 26px;
}
.main-content {
  box-shadow: none !important;
}
.input .col-md-3 > span,
.input .col-md-9 > span {
  color: #888;
  width: 100%;
}
.input textarea {
  border: 0;
  padding: 0;
  width: 100%;
  resize: none;
  color: #888;
  background-color: #f0f9fe;
}
.table thead {
  table-layout: fixed;
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
.head-input {
  overflow: hidden;
  margin-bottom: 55px;
}
.head-input > div {
  height: 40px;
  border: 1px solid #55a8fd;
  display: inline-block;
  line-height: 40px;
  position: relative;
}
.head-input > div:after {
  content: '';
  position: absolute;
  height: 1px;
  display: inline-block;
  width: 1920px;
  top: 19px;
  left: 100%;
  background: #aad3fe;
}
.head-input > div > span {
  font-size: 14px;
  color: #55a8fd;
  padding: 0 18px;
  position: relative;
}
.head-input > div > span:before {
  display: inline-block;
  height: 28px;
  width: 2px;
  content: '';
  background: #fff;
  position: absolute;
  top: -6px;
  right: -2px;
  border: 1px solid #fff;
}
.head-input > div > span:after {
  display: inline-block;
  height: 28px;
  width: 2px;
  content: '';
  background: #fff;
  position: absolute;
  top: -6px;
  left: -2px;
  border: 1px solid #fff;
}
.table-head {
  margin-bottom: 20px;
  color: #222;
  text-align: center;
}
.table-row {
  margin-bottom: 26px;
  color: #888;
}
.table-body {
  width: 100%;
  height: 260px;
  overflow-y: auto;
  overflow-x: hidden;
}
.table-row .col-md-2,
.table-row .col-md-3 {
  text-align: center;
}
.save-btn-bottom-box {
  text-align: center;
  padding-bottom: 40px;
}
.btnGreen {
  margin-right: 120px;
}
</style>
