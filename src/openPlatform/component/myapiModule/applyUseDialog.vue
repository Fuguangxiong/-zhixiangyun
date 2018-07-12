<template>
  <div class='apply-use-dialog'>

    <h2 class="name">《{{formData.serviceName}}》{{serviceNameAfter}}</h2>

    <!-- 申请人信息 -->
    <div class="apply-message">
      <h3 class="apply-message-title"><i class='icon iconfont icon-tianxieshenqingrenxinxi'></i>申请人信息</h3>
      <ul>
        <li><b>申请人：</b>{{formData.loginname}}</li>
        <li><b>用户名：</b>{{formData.Applicant}}</li>
        <li><b>单位：</b>{{formData.enterprisename}}</li>
        <li><b>手机号：</b>{{formData.phone}}</li>
        <li><b>邮箱：</b>{{formData.email}}</li>
        <li><b>申请日期：</b>{{formData.apply_time}}</li>
      </ul>
    </div>

    <!-- 需求描述 -->
    <div class="apply-message">
      <h3 class="apply-message-title"><i class='icon iconfont icon-icon11'></i>需求描述</h3>
      <ul>
        <li><b>需求类型：</b>{{formData.belong_type}}</li><br />
        <li><b>使用期限：</b>{{formData.expiry_start_date}} 至 {{formData.expiry_end_date}}</li>
        <li class='long'>
          <b>需求目的：</b>
          <textarea v-show='status=="edit"'
                    v-model="formData.apply_description" 
                    placeholder="请详细描述您使用此数据的目的或用途（限300字以内）"
                    id="text1"
                    @keyup="onCount"
                    @keydown="onCount"
                    @focus="onCount"
                    @blur="onCount"
                    maxlength="300"
                    >
          </textarea>
          <p v-show='status=="edit"'><span>{{textNum1}} / 300</span>您还可以输入<span>{{300-textNum1}}</span>个字</p>
          <div v-show='status!="edit"'>{{formData.apply_description}}</div>
        </li>
      </ul>
    </div>

    <!-- 其他备注 -->
    <div class="apply-message">
      <h3 class="apply-message-title"><i class='icon iconfont icon-beizhu'></i>其他备注</h3>
      <ul>
        <li class='long'>
          <b>备注：</b>
          <textarea v-show='status=="edit"' 
                    v-model="formData.apply_remark" 
                    placeholder="其他未尽事项请填写至此处（限100字以内）"
                    id="text2"
                    @keyup="onCount"
                    @keydown="onCount"
                    @focus="onCount"
                    @blur="onCount"
                    maxlength="100"
                     >
          </textarea>
          <p v-show='status=="edit"'><span>{{textNum2}} / 100</span>您还可以输入<span>{{100-textNum2}}</span>个字</p>
          <div v-show='status!="edit"'>{{formData.apply_remark}}</div>
        </li>
      </ul>
    </div>

    <!-- 审批流转 -->
    <div class="apply-message apply-message-margin" v-if='status!="edit"'>
      <h3 class="apply-message-title"><i class='icon iconfont icon-16gongwenliuzhuan'></i>审批流转</h3>
      <div class='auditExchageList'>
        <table>
          <tr>
            <th>序号</th>
            <th>审批阶段</th>
            <th>审核人</th>
            <th>处理时间</th>
            <th>审核意见</th>
          </tr>
          <tr v-for="(item,index) in auditInfo" :key='index'>
            <td>第{{index+1}}次</td>
            <td>{{item.approval_workflow}}</td>
            <td>{{item.auditUserName}}</td>
            <td>{{item.deal_time}}</td>
            <td><span><b :class='item.audit_status_class'>{{item.audit_status_text}}</b>{{item.audit_remark}}</span></td>
          </tr>
        </table>
      </div>
    </div>

    <!-- 审批操作 -->
    <div class="apply-message" v-show='status=="approved"'>
      <h3 class="apply-message-title"><i class='icon iconfont icon-shenpi'></i>审批操作</h3>
      <ul>
        <li>
          <b>审批：</b>
          <button @click="pass" class="apply-btn" :class="{active:isrequired}" >通过</button>
          <button @click="noPass" class="apply-btn" :class="{active:!isrequired}" >不通过</button>
        </li>
        <li class='long'>
          <span v-show="!isrequired" class="xing">*</span>
          <b>备注：</b>
          <textarea v-model="formData.audit_remark" 
                    placeholder="审批意见请填写至此处（限50字以内）"
                    id="text3"
                    maxlength="50"
                    @keyup="onCount"
                    @keydown="onCount"
                    @focus="onCount"
                    @blur="onCount"
                    >
          </textarea>
          <p><span>{{textNum3}} / 50</span>您还可以输入<span>{{50-textNum3}}</span>个字</p>
        </li>
      </ul>
    </div>

    <!-- 按键 -->
    <div class="apply-actions">
      <div v-show='status=="edit"'>
        <b>服务需求单：</b>
        <span>即发起服务使用申请，用户需详细、清楚地描述使用此服务的目的或用途，保证所填信息的真实性，其他未尽描述事项可填写到备注中。提交工单后，服务提供者会在3-5个工作日内进行审核处理，审批通过后方可获得调用此服务的权限。</span>
      </div>
      <div v-show='status!="edit"'>
        <b>服务使用申请：</b>
        <span>即用户发起的服务使用申请，作为服务提供者需认真审核用户所填使用目的或用途信息的有效性，并进行审批操作。提交工单后，系统会根据您的审批操作结果（通过or不通过），赋予用户相应的服务使用权限（有or无）。</span>
      </div>
      <button class="apply-btn back" @click='onBack'>返回</button>
      <button v-show='status=="edit"' class="apply-btn save" @click="onSave">保存草稿</button>
      <button v-show='status=="edit"' class="apply-btn submit" @click="onSubmit">提交</button>
      <button v-show='status=="approved"' class="apply-btn submit" @click="onPass">提交</button>
    </div>
  </div>
</template>

<script>
import apiClient from '../../../publicJs/ApiClient.js'
import userService from '../../../publicJs/userService.js'
import TipBoxService from '../../../publicJs/TipBoxService.js'
import LoadingBoxService from '../../../publicJs/LoadingBoxService.js'
import commonFunc from '../../common/commonFunc.js'
export default {
  props: {
    isShow: false,
    statue: '',
    serviceData: {}
  },
  data () {
    let that = this
    return {
      serviceObj: {},
      url: {
        save: 'itsmApi/applyInfo/insertOrUpdateApplyInfo',
        submit: 'itsmApi/applyInfo/submitApplications',
        user: '/pubapi/token/getUserByToken',
        query: 'itsmApi/applyInfo/loadApplyInfo',
        auditInfo: 'itsmApi/applyInfo/loadAuditFlowInfo',
        audit: 'itsmApi/applyInfo/approve'
      },
      status: 'edit', // edit,view,approved
      textNum1: 0,
      textNum2: 0,
      textNum3: 0,
      serviceNameAfter: '服务需求单',
      initData: {
        serviceName: '',
        loginname: '',
        Applicant: '',
        enterprisename: '',
        phone: '',
        email: '',
        apply_time: '提交时自动生成',
        expiry_start_date: '',
        expiry_end_date: '',
        belong_type: '',
        apply_description: '',
        apply_remark: '',
        audit_remark: '',
        audit_batch_num: 0,
        approval_workflow: 0
      },
      formData: {},
      auditInfo: [],
      auditAction: '2',
      isrequired: true
    }
  },
  watch: {
    isShow: function (nv, ov) {
      let vm = this
      $('.apply-use-dialog .apply-actions')
        .css({
          right: '-2000px',
          width: $('.publicWidthHeightContainer').width() - 5
        })
        .animate({ right: '5px' }, 500)
      vm.init()
      if (nv) {
        if (vm.serviceObj.apply_id && !vm.serviceObj.isApplyAgain) {
          vm.onQuery()
        } else {
          vm.serviceObj.apply_id = ''
          vm.getUserInfo()
        }
      }
    }
  },
  mounted () {
    if (window.iscEvent) {
      window.iscEvent.on('menuchange', function () {
        let targetW = 0
        if ($('body').hasClass('bigSreen') && !$('body').hasClass('bigSreen2')) {
          targetW = $(window).width() - 58
        } else {
          targetW = $(window).width() - 208
        }
        $('.apply-use-dialog .apply-actions').animate({ width: targetW + 'px' }, 500)
      })
    }
  },
  methods: {
    // 对服务使用申请进行默认设置 author: caimin ,time:20180117
    checkServiceAndScheme (serviceId, schemeId) {
      let vm = this
      if (serviceId == '5' || serviceId == '6' || schemeId == '4' || schemeId == '3') {
        vm.noPass()// 选中不通过按钮
        if (serviceId === '5') {
          vm.formData.audit_remark = '此服务已过期'
        } else if (serviceId === '6') {
          vm.formData.audit_remark = '此服务已删除'
        } else if (schemeId === '4') {
          vm.formData.audit_remark = '此服务使用的方案已过期'
        } else if (schemeId === '3') {
          vm.formData.audit_remark = '此服务使用的方案已删除'
        }
        return
      }
    },
    onBack () {
      this.$emit('back', false)
      $('.apply-use-dialog .apply-actions').animate({ right: '-2000px' }, 500)
    },
    pass () {
      this.isrequired = true
      this.auditAction = 2
    },
    noPass () {
      this.isrequired = false
      this.auditAction = 3
    },
    init () {
      let vm = this
      console.log('serviceData', vm.serviceData)
      vm.serviceObj = Object.assign({}, vm.serviceData)
      if (
        !vm.serviceObj.use_status ||
        vm.serviceObj.use_status == '0' ||
        (vm.serviceObj.use_status == '4' && vm.serviceObj.fromEdit) ||
        vm.serviceObj.isApplyAgain
      ) {
        vm.status = 'edit'
        vm.serviceNameAfter = '服务需求单'
      } else if (
        vm.serviceObj.use_status == '1' &&
        vm.serviceObj.sourceType == '4'
      ) {
        vm.status = 'approved'
        vm.serviceNameAfter = '服务使用申请'
      } else {
        vm.status = 'view'
        vm.serviceNameAfter = '服务使用申请'
      }
      vm.initData.serviceName = vm.serviceObj.name
      vm.initData.expiry_start_date = vm.serviceObj.expiry_start_date
      vm.initData.expiry_end_date = vm.serviceObj.expiry_end_date
      vm.formData = Object.assign({}, vm.initData)
    },
    getUserInfo () {
      let vm = this
      apiClient.get(vm.url.user, {}, function (data) {
        if (data.status == 200) {
          let user = data.results.userInfo
          console.log('用户信息', user)
          vm.formData.loginname = user.USERNAME
          vm.formData.Applicant = user.USERNAME
          vm.formData.enterprisename = user.ENTERPRISE_NAME
          vm.formData.phone = user.PHONE
          vm.formData.email = user.EMAIL
          switch (user.LOGIN_TYPE) {
          case 'ENTERPRISE':
            vm.formData.belong_type = '企业使用'
            break
          case 'PLATFORM':
            vm.formData.belong_type = '平台使用'
            break
          case 'PERSONAL':
            vm.formData.belong_type = '个人使用'
            break
          }
        } else {
          TipBoxService.open(data.exception, 2)
        }
      })
    },
    onCount () {
      this.textNum1 = $('#text1')[0].textLength
      this.textNum2 = $('#text2')[0].textLength
      this.textNum3 = $('#text3')[0].textLength
    },
    onSave () {
      let vm = this
      let param = {
        id: vm.serviceObj.apply_id || '',
        service_id: vm.serviceObj.id,
        scheme_id: vm.serviceObj.scheme_id,
        apply_description: vm.formData.apply_description,
        apply_remark: vm.formData.apply_remark,
        is_approve: '1'
      }
      LoadingBoxService.open('保存草稿成功中，请稍等……')
      apiClient.post(vm.url.save, param, function (data) {
        LoadingBoxService.close()
        if (data.status == 200) {
          TipBoxService.open('保存草稿成功', 4)
          console.log(vm.serviceObj)
        } else {
          TipBoxService.open(data.exception, 2)
        }
      })
    },
    onSubmit () {
      let vm = this
      let param = {
        id: vm.serviceObj.apply_id || '',
        service_id: vm.serviceObj.id,
        scheme_id: vm.serviceObj.scheme_id,
        apply_description: vm.formData.apply_description,
        apply_remark: vm.formData.apply_remark,
        is_approve: '1',
        audit_batch_num: vm.formData.audit_batch_num
      }
      console.log(vm.serviceObj)
      LoadingBoxService.open('提交中，请稍等……')
      apiClient.post(vm.url.submit, param, function (data) {
        LoadingBoxService.close()
        if (data.status == 200) {
          TipBoxService.open('提交成功', 4)
          vm.$emit('back', true)
          $('.apply-use-dialog .apply-actions').animate(
            { right: '-2000px' },
            500
          )
        } else {
          TipBoxService.open(data.exception, 2)
        }
      })
    },
    onQuery () {
      let vm = this
      let param = { id: vm.serviceObj.apply_id }
      console.log('param', param)
      LoadingBoxService.open('信息加载中，请稍等……')
      apiClient.post(vm.url.query, param, function (data) {
        LoadingBoxService.close()
        if (data.status == 200) {
          let dataList = Object.assign({}, data.results)
          console.log('dataList', dataList)
          vm.formData.serviceName = vm.serviceObj.name
          vm.formData.apply_time = dataList.apply_time
          vm.formData.belong_type = dataList.belongType + '使用'
          vm.formData.Applicant = dataList.userList.userName
          vm.formData.loginname = dataList.userList.trueName
          vm.formData.phone = dataList.userList.phone
          vm.formData.email = dataList.userList.email
          vm.formData.enterprisename = dataList.enterpriseName
          vm.formData.expiry_start_date = commonFunc.formatDate(
            dataList.schemeList.stratDate,
            'yyyy-MM-dd'
          )
          vm.formData.expiry_end_date = commonFunc.formatDate(
            dataList.schemeList.endDate,
            'yyyy-MM-dd'
          )
          vm.formData.apply_description =
            dataList.data[0].apply_description || '无'
          vm.formData.apply_remark = dataList.data[0].apply_remark || '无'
          vm.formData.audit_batch_num = dataList.data[0].audit_batch_num
          vm.formData.approval_workflow =
            dataList.serviceList.serviceList[0].approval_workflow
          vm.getAuditInfo(
            vm.formData.audit_batch_num,
            dataList.data[0].apply_user_id,
            dataList.data[0].belong_type
          )

          // 对服务使用申请进行默认设置 author: caimin ,time:20180116
          vm.checkServiceAndScheme(
            dataList.serviceList.serviceList[0].service_status,
            dataList.schemeList.scheme_status
          )
        } else {
          TipBoxService.open(data.exception, 2)
        }
      })
    },
    getAuditInfo (batchNo, applyUserId, belongType) {
      let vm = this
      let param = {
        belongType: belongType,
        appSubjectIdl: vm.serviceObj.apply_id,
        batchNo: batchNo,
        approvalType: 3,
        enterpriseId: vm.serviceObj.apply_enterprise_id,
        applyUserId: applyUserId
      }
      vm.auditInfo = []
      apiClient.post(vm.url.auditInfo, param, function (data) {
        if (data.status == 200) {
          console.log('审批信息', data)
          let dataList = data.results.data
          dataList.forEach(function (v, i) {
            let obj = {}
            // obj.approval_workflow = v.audit_phase == "2" ? "平台审核" : "成功";
            obj.approval_workflow = commonFunc.getBelongType(vm.serviceObj.belong_type) + '审核'
            if (v.audit_time) {
              obj.deal_time = commonFunc.formatDate(
                v.audit_time,
                'yyyy-MM-dd HH:mm:ss'
              )
            } else if (v.apply_time) {
              obj.deal_time = commonFunc.formatDate(
                v.apply_time,
                'yyyy-MM-dd HH:mm:ss'
              )
            } else {
              obj.deal_time = '----'
            }
            if (v.audit_status == '1') {
              obj.audit_status_text = '提交申请'
              obj.audit_status_class = 'pass'
            } else if (v.audit_status == '2') {
              obj.audit_status_text = '通过'
              obj.audit_status_class = 'pass'
            } else if (v.audit_status == '3') {
              obj.audit_status_text = '不予通过'
              obj.audit_status_class = 'unpass'
            } else if (v.audit_status == '0') {
              obj.audit_status_text = '撤消'
              obj.audit_status_class = 'revoke'
            }
            // obj.audit_status_text = v.audit_status == "2" ? "通过" : "不予通过";
            obj.audit_status = v.audit_status
            obj.audit_remark = '，' + v.audit_remark
            obj.auditUserName = v.auditUserName
            console.log(obj)
            vm.auditInfo.push(obj)
          })
        } else {
          TipBoxService.open(data.exception, 2)
        }
      })
    },
    onPass () {
      let vm = this
      let param = {
        apply_id: vm.serviceObj.apply_id,
        audit_remark: vm.formData.audit_remark,
        audit_status: vm.auditAction,
        approval_workflow: vm.formData.approval_workflow
      }
      if (vm.auditAction == 3 && (vm.formData.audit_remark == undefined || vm.formData.audit_remark == '')) {
        TipBoxService.open('备注信息不能为空!', 2)
        return
      }
      console.log(param)
      LoadingBoxService.open('正在处理....')
      apiClient.post(vm.url.audit, param, function (data) {
        LoadingBoxService.close()
        if (data.status == 200) {
          TipBoxService.open('审批操作成功', 4)
          vm.$emit('back', true)
          vm.isrequired = true
        } else {
          TipBoxService.open(data.exception, 2)
        }
      })
    }
  }
}
</script>
<style scoped>
.apply-use-dialog {
  position: relative;
  width: 100%;
  padding-bottom: 100px;
}
.apply-use-dialog .name {
  width: 100%;
  text-align: center;
  font-weight: bold;
  font-size: 20px;
  color: #55a8fd;
  margin: 20px 0;
}
.apply-use-dialog .apply-message {
  padding: 0 15px;
}
.apply-use-dialog .apply-message-margin {
  margin-bottom: 15px;
}
.apply-use-dialog .apply-message-title {
  width: 100%;
  height: 30px;
  line-height: 30px;
  border: 1px solid #f1f1f1;
  border-left-width: 4px;
  background: #f9f9f9;
  text-indent: 5px;
}
.apply-use-dialog .apply-message-title > i {
  margin-right: 5px;
}
.apply-use-dialog .apply-message > ul {
  width: 100%;
  padding: 15px 0;
}
.apply-use-dialog .apply-message > ul > li {
  position: relative;
  display: inline-block;
  width: 49%;
  /* height: 34px; */
  line-height: 34px;
  text-indent: 100px;
}
.apply-use-dialog .apply-message > ul > li.long {
  width: 100%;
  /* height: 146px; */
}
.apply-use-dialog .apply-message > ul > li > b {
  display: inline-block;
  width: 76px;
  text-indent: 0;
  letter-spacing: 1px;
}
.apply-use-dialog .apply-message > ul > li > textarea {
  display: inline-block;
  width: 730px;
  height: 100px;
  vertical-align: text-top;
  padding: 0 10px;
  line-height: 24px;
  margin: 3px 0 0 -5px;
}
.apply-use-dialog .apply-message > ul > li > div {
  display: inline-block;
  width: 730px;
  height: auto;
  vertical-align: text-top;
  line-height: 24px;
  text-indent: 0;
  margin: -4px 0 0 -4px;
}
.apply-use-dialog .apply-message > ul > li > p {
  width: 905px;
  text-align: right;
}
.apply-use-dialog .apply-message > ul > li > p > span {
  color: #fa405c;
  padding: 0 5px;
}
.apply-use-dialog .apply-message > div {
  width: 100%;
  padding: 15px 176px;
}
.apply-use-dialog .apply-message > div > table {
  width: 100%;
}
.apply-use-dialog .apply-message > div > table > tr > th {
  padding: 8px 0;
  text-align: left;
}
.apply-use-dialog .apply-message > div > table > tr > td {
  padding: 4px 0;
  text-align: left;
  color: #999999;
}
.apply-use-dialog .apply-message > div > table > tr > td >span{
  display: inline-block;
  max-width:200px;
  line-height:28px;
}
.apply-use-dialog .apply-message > div > table .pass {
  color: #2dd28a;
}
.apply-use-dialog .apply-message > div > table .unpass {
  color: #ff3755;
}
.apply-use-dialog .apply-message > div > table .revoke {
  color: #999;
}
.apply-use-dialog .apply-actions {
  position: fixed;
  right: -2000px;
  bottom: 38px;
  height: 86px;
  background: rgba(245, 245, 245, 0.93);
  box-shadow: 1px 0 5px rgba(0, 0, 0, 0.2);
  text-align: right;
}
.apply-use-dialog .apply-actions > div {
  position: absolute;
  left: 20px;
  right: 330px;
  top: 25px;
  line-height: 20px;
  text-align: left;
  font-size: 14px;
}
.apply-use-dialog .apply-actions > div > span {
  position: absolute;
  left: 90px;
  right: 0;
  display: inline-block;
  font-size: 12px;
}
.apply-use-dialog .apply-btn {
  display: inline-block;
  width: 80px;
  height: 30px;
  line-height: 1;
  margin: 28px 20px 0 0;
  text-align: center;
  border: 1px solid #55a8fd;
  border-radius: 2px;
  font-size: 14px;
  letter-spacing: 1px;
}
.apply-use-dialog .apply-btn.submit {
  background: #55a8fd;
  color: #fff;
}
.apply-use-dialog .apply-btn.back {
  background: #f6f6f6;
  color: #55a8fd;
}
.apply-use-dialog .apply-btn.save {
  background: #26d186;
  border: 1px solid #26d186;
  color: #fff;
}
.apply-use-dialog .apply-btn {
  background: #fff;
  border: 1px solid #ccc;
  font-size: 12px;
  border-radius: 0;
  margin: 0 30px 0 -5px;
  margin-top: 29px;
}
.apply-use-dialog .apply-btn.active {
  background: #ff9900;
  border: 1px solid #ff9900;
  color: #fff;
}
.xing {
  color: #cc3333;
  position: absolute;
  left: -8px;
  top: 2px;
}

</style>
