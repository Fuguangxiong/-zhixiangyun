<template>
<div v-show="isShow" class="wraper">
    <div class="demandListbox">
        <div class="demandList">
            <div class="detitle">
                《{{serviceData.serviceName}}》服务需求单
            </div>
            <div class="deinfo">
                <div class="top ">
                    <i class="icon iconfont icon-tianxieshenqingrenxinxi"></i> 申请人信息
                </div>
                <ul>
                    <li><b>申请人：</b>{{formData.Applicant}}</li>
                    <li><b>用户名：</b>{{formData.loginname}}</li>
                    <li><b>单位：</b>{{formData.enterprisename}}</li>
                    <li><b>手机号：</b>{{formData.phone}}</li>
                    <li><b>邮箱：</b>{{formData.email}}</li>
                    <li><b>申请日期：</b>提交时自动生成</li>
                </ul>
            </div>
            <div class="apply-message">
               
                 <h3 class="apply-message-title"><i class="icon iconfont icon-xuanzechaxunfangan"></i> 方案选择</h3>
                  <div class="fanganlist">
                    <el-row class='scheme-list'>
                     <el-col :span="4" v-for="(item,index) in data" :key="index" :offset="index > 0 ? 1 : 0">
                    <el-card :body-style="{ padding: '0px 0px 15px 0px' }">
                    <el-popover placement="right" trigger="hover">
                        <!-- 鼠标滑上提示 -->
                        <ul class='scheme-tip'>
                        <li><b>方案名称：</b>{{item.scheme_name}}</li>
                        <li><b>是否收费：</b>{{item.is_fee_text}}</li>
                        <li><b>有效期：</b>{{item.expiry_start_date}} 至 {{item.expiry_end_date}}</li>
                        <li><b>调用限制：</b>{{item.restrict_type_text}}{{item.restrict_num}}次</li>
                        <li><b>使用申请：</b>{{item.is_approve_text}}</li>
                        <li><b>创建时间：</b>{{item.created_time}}</li>
                        </ul>
                        <!-- 方案 -->
                        <el-button slot="reference" class='scheme-card' @click='onClickFee(item)' :class="{'selected':item.selected}">
                        <img src="../../images/yfb.jpg" class="image">
                        <div class="scheme-con">
                            <div class="scheme-con-num">
                            <time class="time">{{item.restrict_type_text}}{{item.restrict_num}}次</time>
                            </div>
                            <span class="scheme-con-name">{{item.scheme_name}}</span>
                        </div>
                        <span class="scheme-con-tag">{{item.is_fee_text}}</span>
                        <span class="scheme-con-select">
                            <i v-show='item.selected' class="el-icon-check"></i>
                        </span>
                        </el-button>
            <!-- 方案 -->
                    </el-popover>
                  </el-card>
                </el-col>
              </el-row>
                </div>
            </div>
             <!-- 需求描述 -->
            <div class="apply-message">
                <h3 class="apply-message-title"><i class='icon iconfont icon-icon11'></i>需求描述</h3>
                 <ul>
                <li><b>需求类型：</b><span class="orangeBg">{{formData.belong_type}}</span></li><br />
                <li><b>使用期限：</b>{{formData.expiry_start_date}} 至 {{formData.expiry_end_date}}</li>
                <li class='long'>
                  <b>需求目的：</b>
                  <textarea maxlength=300 v-show='status=="edit"'
                            v-model="formData.apply_description" 
                            placeholder="请详细描述您使用此数据的目的或用途（限300字以内）"
                            id="text1"
                            @keyup="onCount"
                            @keydown="onCount"
                            @focus="onCount"
                            @blur="onCount">
                  </textarea>
                  <p v-show='status=="edit"'><span>{{textNum1}} / 300</span>您还可以输入<span>{{300-textNum1}}</span>个字</p>
                  <div v-show='status!="edit"'>{{formData.apply_description}}</div>
                </li>
              </ul>
            </div>
            <!-- 其他备注 -->
            <div class="apply-message minheight">
                <h3 class="apply-message-title"><i class='icon iconfont icon-beizhu'></i>其他备注</h3>
                 <ul>
                  <li class='long'>
                    <b>备注：</b>
                    <textarea maxlength=100 v-show='status=="edit"' 
                              v-model="formData.apply_remark" 
                              placeholder="其他未尽事项请填写至此处（限100字以内）"
                              id="text2"
                              @keyup="onCount"
                              @keydown="onCount"
                              @focus="onCount"
                              @blur="onCount">
                    </textarea>
                    <p v-show='status=="edit"'><span>{{textNum2}} / 100</span>您还可以输入<span>{{100-textNum2}}</span>个字</p>
                    <div v-show='status!="edit"'>{{formData.apply_remark}}</div>
                  </li>
                </ul>
           </div>
            <!-- 按键 -->
            <div class="apply-actions">
              <div class="actionContent">
                  <div><b>服务需求单：</b><span>分为应用服务、远程服务，用户可将原有应用系统上传到平台或提供远程访问地址，平台提供从中拆分成单一服务的能力。且拆分出的服务具有标准的数据对接接口，可单独调用或扩展应用于其他系统的最小服务单元，这种最小服务单元统称为原子服务。</span></div>
                    <button class="apply-btn back" @click='onBack'>取消</button>
                     <!--<button v-show='status=="edit"' class="apply-btn save" @click="onSave">保存草稿</button> -->
                    <button v-show='status=="edit"' class="apply-btn submit" @click="onSubmit">提交</button>
                    <!-- <button v-show='status=="approved"' class="apply-btn submit" @click="onPass">提交</button> -->
              </div>
            </div>
        </div>
    </div>
</div>
</template>
<script>
import apiClient from '../../../publicJs/ApiClient.js'
import commonFunc from '../../common/commonFunc.js'
import LoadingBoxService from '../../../publicJs/LoadingBoxService.js'
import UserCookieService from '../../../publicJs/UserCookieService.js'
import TipBoxService from '../../../publicJs/TipBoxService.js'
import publicPathConfig from '../../../publicJs/publicPathConfig.js'
export default{
  props: {
    isShow: false,
    serviceData: {}
  },
  data () {
    return {
      serviceObj: {},
      data: {},
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
      auditAction: ''
    }
  },
  watch: {
    isShow: function (nv, ov) {
      let vm = this
      vm.getUserInfo()
      vm.onQuery()
      vm.formData.apply_remark = ''
      vm.formData.apply_description = ''
      this.shenqingdetail()
    }
  },
  mounted () {
    // this.firstshengqing()
  },
  methods: {
    // 优惠方案
    onQuery () {
      let vm = this
      let param = { serviceId: this.$route.query.id }
      apiClient.post('itsmApi/feeScheme/loadSchemeList', param, function (data) {
        if (data.status === 200) {
          vm.data = [...data.results]
          vm.data.forEach(function (v, i) {
            v.is_fee_text = v.is_fee === '1' ? '收费' : '免费'
            v.is_approve = v.apply_is_audit
            // v.is_approve = "0";
            v.is_approve_text = v.is_approve === '1' ? '需要' : '不需要'
            v.created_time = commonFunc.formatDate(v.created_time, 'yyyy-MM-dd HH:mm:ss')
            v.expiry_start_date = commonFunc.formatDate(v.expiry_start_date, 'yyyy-MM-dd')
            v.expiry_end_date = commonFunc.formatDate(v.expiry_end_date, 'yyyy-MM-dd')
            v.restrict_type_text = commonFunc.getRestrictType(v.restrict_type)
            v.selected = false
            if (vm.serviceData.scheme_id === v.id) {
              vm.formData.scheme_id = v.id
              v.selected = true
            }
          })
        } else {
          TipBoxService.open(data.exception, 2)
        }
      })
    },
    // 服务详情
    shenqingdetail () {
      let vm = this
      let param = { id: this.$route.query.id }
      apiClient.post('/itsmApi/applyInfo/loadApplyInfo', param, function (data) {
        LoadingBoxService.close()
        // if (data.status === 200) {
        let dataList = Object.assign({}, data.results)
        if (dataList.total === 0) {
          vm.firstshengqing()
        } else {
          vm.formData.apply_time = dataList.apply_time
          vm.formData.belong_type = dataList.belongType + '使用'
          vm.formData.Applicant = dataList.userList.userName
          vm.formData.loginname = dataList.userList.trueName
          vm.formData.phone = dataList.userList.phone || '未知'
          vm.formData.email = dataList.userList.email || '未知'
          vm.formData.enterprisename = dataList.enterpriseName || '未知'
          vm.formData.expiry_start_date = commonFunc.formatDate(
            dataList.schemeList.stratDate,
            'yyyy-MM-dd'
          )
          vm.formData.expiry_end_date = commonFunc.formatDate(
            dataList.schemeList.endDate,
            'yyyy-MM-dd'
          )
          vm.formData.audit_batch_num = dataList.data[0].audit_batch_num
          vm.formData = Object.assign({}, vm.formData)
        }
        // } else {
        //   TipBoxService.open(data.exception, 2)
        // }
      })
    },
    firstshengqing () {
      let vm = this
      UserCookieService.getUserInfo(function (params) {
        switch (params.LOGIN_TYPE) {
        case 'ENTERPRISE':
          vm.formData.belong_type = '企业使用'
          break
        case 'PLATFORM':
          vm.formData.belong_type = '个人使用'
          break
        case 'PERSONAL':
          vm.formData.belong_type = '个人使用'
          break
        }
        vm.formData.apply_time = vm.initData.apply_time
        vm.formData = Object.assign({}, vm.formData)
      })
    },
    onClickFee (item) {
      let vm = this
      vm.data.forEach(function (v, i) {
        let obj = Object.assign({}, v)
        obj.selected = false
        if (obj.id === item.id) {
          obj.selected = true
        }
        vm.$set(vm.data, i, obj)
      })
      vm.formData.scheme_id = item.id
      vm.formData.is_approve = item.is_approve
      vm.formData.expiry_start_date = item.expiry_start_date
      vm.formData.expiry_end_date = item.expiry_end_date
      vm.formData = Object.assign({}, vm.formData)
    },
    getUserInfo () {
      let vm = this
      apiClient.get(vm.url.user, {}, function (data) {
        if (data.status === 200) {
          let user = data.results.userInfo
          vm.formData.loginname = user.USERNAME
          vm.formData.Applicant = user.USERNAME
          vm.formData.enterprisename = user.ENTERPRISE_NAME
          vm.formData.phone = user.PHONE || '未知'
          vm.formData.email = user.EMAIL || '未知'
          vm.formData = Object.assign({}, vm.formData)
        } else {
          TipBoxService.open(data.exception, 2)
        }
      })
    },
    onBack () {
      this.$emit('back', false)
    },
    onSubmit () {
      let vm = this
      if (vm.formData.scheme_id === undefined || vm.formData.scheme_id === '') {
        TipBoxService.open('请选择方案', 2)
        return
      }
      if (vm.serviceData.scheme_id === vm.formData.scheme_id) {
        TipBoxService.open('方案未变更,无需申请', 2)
        return
      }
      let param = {
        id: '',
        service_id: this.$route.query.id,
        scheme_id: vm.formData.scheme_id,
        apply_description: vm.formData.apply_description,
        apply_remark: vm.formData.apply_remark,
        is_approve: '1',
        audit_batch_num: vm.formData.audit_batch_num
      }
      LoadingBoxService.open('提交中，请稍等……')
      apiClient.post(vm.url.submit, param, function (data) {
        LoadingBoxService.close()
        if (data.status === 200) {
          TipBoxService.open('提交成功', 4)
          vm.$router.push({
            path: '/myAPI'
          })
        } else {
          TipBoxService.open(data.exception, 2)
        }
      })
    },

    onCount () {
      this.textNum1 = $('#text1')[0].textLength
      this.textNum2 = $('#text2')[0].textLength
    }

  }
}
</script>
<style scoped>
.wraper{
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    position: fixed;
    overflow: hidden;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1900;
}
.demandListbox{
    background-color: #fff;
    width: 100%;
    height: 100%;
    margin-top: 30px;
    overflow-y: auto;
}
.demandList{
    width: 1200px;
    height: 100%;
    margin: 0 auto;
}
.detitle{
    height: 50px;
    line-height: 40px;
    padding-top: 10px;
    color: #6aa8f6;
    font-size: 20px;
    text-align: center;
}
.orangeBg{
    background-color: #f09d39;
    color: #fff;
    padding: 7px 18px;
}    

 .top{
    height: 30px;
    box-sizing: border-box;
    background-color: #f9f9f9;
    border: 1px solid #f1f1f1;
    border-left: 4px solid #f1f1f1;
    font-size: 12px;
    color: #333;
    line-height: 28px;
    padding-left: 5px;
}
.deinfo ul{
    width: 100%;
    padding: 15px 0;
}
.deinfo ul span{
    display: inline-block;
    width: 76px;
    text-indent: 0;
    letter-spacing: 1px;
    color: #333;
}
.deinfo ul li{
    position: relative;
    display: inline-block;
    width: 49%;
    line-height: 34px;
    text-indent: 100px;
    color: #333;
}

.demandList .apply-message-title {
  width: 100%;
  height: 30px;
  line-height: 30px;
  border: 1px solid #f1f1f1;
  border-left-width: 4px;
  background: #f9f9f9;
  text-indent: 5px;
  font-size: 12px;
}
.demandList .apply-message-title > i {
  margin-right: 5px;
}
.demandList .apply-message > ul {
  width: 100%;
  padding: 15px 0;
}
.demandList .apply-message > ul > li {
  position: relative;
  display: inline-block;
  width: 49%;
  /* height: 34px; */
  line-height: 34px;
  text-indent: 100px;
}
.demandList .apply-message > ul > li.long {
  width: 100%;
  /* height: 146px; */
}
.demandList .apply-message > ul > li > b {
  display: inline-block;
  width: 76px;
  text-indent: 0;
  letter-spacing: 1px;
}
.demandList .apply-message > ul > li > textarea {
  display: inline-block;
  width: 870px;
  height: 85px;
  vertical-align: text-top;
  padding: 0 10px;
  line-height: 24px;
  margin: 3px 0 0 -5px;
}
.demandList .apply-message > ul > li > textarea:last-child{
  height: 60px;
}
.demandList .apply-message > ul > li > div {
  display: inline-block;
  width: 730px;
  height: auto;
  vertical-align: text-top;
  line-height: 24px;
  text-indent: 0;
  margin: -4px 0 0 -4px;
}
.demandList .apply-message > ul > li > p {
  width: 1048px;
  text-align: right;
}
.demandList .apply-message > ul > li > p > span {
  color: #fa405c;
  padding: 0 5px;
}
.demandList .apply-message > div {
  width: 100%;
  padding: 15px 176px;
}
.demandList .apply-message > div > table {
  width: 100%;
}
.demandList .apply-message > div > table>tr>th {
  padding:8px 0;
  text-align: center;
}
.demandList .apply-message > div > table>tr>td {
  padding:8px 0;
  text-align: center;
  color:#999999;
}
.demandList .apply-message > div > table .pass {
  color:#2dd28a;
}
.demandList .apply-message > div > table .unpass {
  color:#ff3755;
}
.apply-actions .actionContent{
  width: 1200px;
  height: 100%;
  margin: 0 auto;
  position: relative;
  background: rgba(245, 245, 245, 0.93);
  box-shadow: 1px 0 5px rgba(0, 0, 0, 0.2);
}
.apply-actions {
  position: fixed;
  width: 100%;
  height: 86px;
  right: 0;
  bottom: 0;
  text-align: right;
}
.actionContent > div {
  position: absolute;
  left: 20px;
  right: 330px;
  top: 25px;
  line-height: 20px;
  text-align: left;
  font-size: 14px;
}
.actionContent > div > span {
  position: absolute;
  left: 90px;
  right: 0;
  display: inline-block;
  font-size: 12px;
}
 .apply-btn {
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
 .apply-btn.submit {
  background: #55a8fd;
  color: #fff;
}
.apply-btn.back {
  background: #f6f6f6;
  color: #55a8fd;
}
.apply-btn.save {
  background: #26d186;
  border: 1px solid #26d186;
  color: #fff;
}
 .apply-btn.pass {
  background: #ff9900;
  border: 1px solid #ff9900;
  color: #fff;
  font-size: 12px;
  border-radius: 0;
  margin: 0 30px 0 -5px;
}
.apply-btn.reject {
  background: #fff;
  border: 1px solid #ccc;
  font-size: 12px;
  border-radius: 0;
  margin: 0;
}
/* 计费方案 */
 .scheme-card {
  padding: 0;
  margin: 0;
  background: none !important;
  border: none !important;
}
.image {
  width: 100%;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
}
 .scheme-con-num {
  text-align: center;
  font-size: 12px;
  background: #fabd7e;
  height: 22px;
  line-height: 22px;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  color: #c3601e;
}
.scheme-con-name {
  display: block;
  width:90px;
  white-space:nowrap;
  text-overflow:ellipsis;
  overflow:hidden;
  margin: 6px auto 0 auto;
  font-size: 12px;
}
.selected .scheme-con-name {
  color: #c3601e;
}
 .scheme-con-tag {
  position: absolute;
  top: 3px;
  left: 5px;
  color: #fff;
  font-size: 12px;
  z-index: 9999;
}
 .scheme-con-select {
  position: absolute;
  top: -3px;
  right: -5px;
  display: block;
  width: 16px;
  height: 16px;
  line-height: 16px;
  border: 1px solid #ff944c;
  border-radius: 8px;
  background: #fff;
  z-index: 9999;
}
 .scheme-con-select > i {
  color: #c3601e;
  transform: scale(0.6, 0.6);
  margin-left: -2px;
}
.scheme-tip > li {
  height: 28px;
  line-height: 28px;
}
 .scheme-tip > li > b {
  display: inline-block;
  width: 64px;
  font-weight: bold
  }
  .selected .scheme-con-name {
  color: #c3601e;
}
.demandList  .apply-message .fanganlist{
    width: 100%;
    margin: 0 auto;
    padding: 0;
}
.fangandetail{
    width: 100px;
    position: relative;
}
.minheight{
    height: 300px;
}
.scheme-list {
  /* height: 162px; */
  box-sizing: border-box;
  padding: 20px 176px 25px 95px;

}
.scheme-list .el-col-4 {
    width: auto;
}
.scheme-list .el-card {
    border: none;
    box-shadow: none;
    position: relative;
    overflow: visible;
    cursor: pointer;
}

    .demandListbox[data-v-2b73e5d5] {
        background-color: #fff;
        width: 100%;
        height: 100%;
        margin-top: 0%;
        overflow-y: auto;
    }
</style>
