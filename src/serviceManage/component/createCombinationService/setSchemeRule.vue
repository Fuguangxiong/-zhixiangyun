
<template>
  <div id='setSchemeRule' class="formaCon">
    <p v-show="isNew ||isEdit" class="tempContent">
      <b>选择方案：</b>
      <el-button type="primary" @click='onOpenDialog'>添 加</el-button>
      <el-button type="default" @click='onBack'>取 消</el-button>
    </p>
    <div v-show="!isNew" class="rules" v-for="(list,i) in bill_rules">
      <p :title='list.groupName'>{{list.groupName}}</p>
      <div class='rule-list'>
        <el-popover class='rule' v-for="(item,index) in list.feeInfo" :key="index" placement="right" trigger="hover">
          <!-- 鼠标滑上提示 -->
          <ul class='scheme-tip'>
            <li><b>方案名称：</b>{{item.scheme_name}}</li>
            <li><b>是否收费：</b>{{getFeeText(item.is_fee)}}</li>
            <li v-if="item.is_fee === '1'"><b>收费标准：</b>{{getFeeStandard(item.fee_standard,item.fee_price)}}</li>
            <li><b>有效期：</b>{{item.expiry_start_date}} 至 {{item.expiry_end_date}}</li>
            <li><b>调用限制：</b>{{getRestrictType(item.restrict_type)}}{{item.restrict_num}}次</li>
            <li><b>使用申请：</b>{{getIsApprove(item.is_approve)}}</li>
            <li><b>创建时间：</b>{{item.created_time}}</li>
          </ul>
          <!-- 方案 -->
          <div slot="reference" class='scheme-card'>
            <img src="../../images/yfb.jpg" class="image">
            <span v-if="item.isApplyAgain" class="scheme-con-mask"></span>
            <div class="scheme-con">
              <div class="scheme-con-num">
                <time class="time">{{getRestrictType(item.restrict_type)}}{{item.restrict_num}}次</time>
              </div>
              <span class="scheme-con-name">{{item.scheme_name}}</span>
            </div>
            <span class="scheme-con-tag">{{getFeeText(item.is_fee)}}</span>
          </div>
          <!-- 方案 -->
        </el-popover>
      </div>
    </div>
    <set-scheme-rule-dialog :is-show='isShowDialog' 
                      :vue-obj='serviceObj'
                      :return-all='true'
                      @cancle='onCloseDialog'
                      @sure='updateSchemeRule'>
    </set-scheme-rule-dialog>
  </div>
</template>
<script>
import apiClient from '../../../publicJs/ApiClient.js'
import TipBoxService from '../common/TipBoxService.js'
import LoadingBoxService from '../../../publicJs/LoadingBoxService.js'
import setSchemeRuleDialog from '../dialog/setSchemeRuleDialog.vue'
import commonFunc from '../common/commonFunc.js'
export default {
  props: {
    isEdit: false,
    serviceId: {},
    msg: {}
  },
  components: {
    setSchemeRuleDialog
  },
  watch: {
    isEdit: function (nv, ov) {
      let vm = this
      vm.serviceObj.id = vm.serviceId
      if (vm.msg.length) {
        vm.isNew = false
        vm.serviceObj.bill_rules = []
        vm.msg.forEach(function (v, i) {
          v.feeInfo.forEach(function (o, j) {
            vm.serviceObj.bill_rules.push(o.id)
          })
        })
        vm.bill_rules = [...vm.msg]
      } else {
        vm.isNew = true
        vm.bill_rules = []
        vm.serviceObj.bill_rules = []
      }
    }
  },
  data () {
    return {
      isNew: true,
      urlSave: 'itsmApi/enterprisePlatform/updateServiceForOneField',
      bill_rules: [],
      serviceObj: {
        id: '',
        bill_rules: []
      },
      isShowDialog: false
    }
  },
  methods: {
    // 打开弹窗
    onOpenDialog () {
      this.isShowDialog = true
    },
    // 关闭弹窗
    onCloseDialog: function (flag) {
      this.isShowDialog = flag
    },
    // 提交
    updateSchemeRule (serviceObj, bill_rules) {
      let that = this
      if (!bill_rules.length) {
        TipBoxService.open('未选择任何计费方案！', 2)
        // that.onCloseDialog(false)
        // that.$emit('submit', true, 6, [])
        // return
      }
      let myData = {}
      myData = {
        serviceId: serviceObj.id,
        fieldName: 'bill_rules',
        fieldValue: serviceObj.bill_rules.join(','),
        fieldType: 'array'
      }
      LoadingBoxService.open('正在保存，请稍候...')
      apiClient.post(that.urlSave, myData, function (data) {
        LoadingBoxService.close()
        if (data.status === 200) {
          that.$emit('submit', true, 6, bill_rules)
          that.isShowDialog = false
        } else {
          TipBoxService.open(data.exception, 1)
        }
      })
    },
    // 返回
    onBack () {
      this.$emit('submit', false, 6)
    },
    // 时间格式转换
    formateTime (time, type) {
      if (type === 'all') {
        return commonFunc.formatDate(time, 'yyyy-MM-dd HH:mm:ss')
      } else {
        return commonFunc.formatDate(time, 'yyyy-MM-dd')
      }
    },
    // 计费方式转换
    getIsApprove (is_approve) {
      return is_approve === '1' ? '需要' : '不需要'
    },
    // 计费方式转换
    getRestrictType (restrict_type) {
      return commonFunc.getRestrictType(restrict_type)
    },
    // 是否收费转换
    getFeeText (is_fee) {
      let is_fee_text = is_fee === '1' ? '收费' : '免费'
      return is_fee_text
    },
    // 收费标准转换
    getFeeStandard (fee_standard, fee_price) {
      return commonFunc.getFeeStandard(fee_standard) + fee_price + '元'
    }
  }
}
</script>
<style scoped>
.tempContent {
  position: relative;
  padding: 20px 0 20px 0;
}
.tempContent>b {
  margin-right: 20px;
}
.rules>p{
  width:80px;
  padding-top:20px;
  float: left;
  font-weight: bold;
  white-space: nowrap;
  text-overflow: ellipsis; 
  overflow: hidden;
}
.rule-list{
  padding:20px 0;
  float: left;
  width:616px;
}
.rule{
  float: left;
  margin-left:15px;
}
#setSchemeRule .scheme-card {
  position: relative;
  width:92px;
  padding: 0;
  margin: 0;
  background: none !important;
  border: none !important;
}
#setSchemeRule .image {
  width: 100%;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
}
#setSchemeRule .scheme-con-mask{
  position: absolute;
  left:0;
  display: inline-block;
  width:93px;
  height: 95px;
  z-index: 220;
  background: rgba(0,0,0,0.3);
  border-radius: 4px;
}
#setSchemeRule .scheme-con-num {
  text-align: center;
  font-size: 12px;
  background: #fabd7e;
  height: 22px;
  line-height: 22px;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  color: #c3601e;
}
#setSchemeRule .scheme-con-name {
  display: block;
  width:90px;
  white-space:nowrap;
  text-overflow:ellipsis;
  overflow:hidden;
  margin: 6px auto 0 auto;
  font-size: 12px;
}
#setSchemeRule .selected .scheme-con-name {
  color: #c3601e;
}
#setSchemeRule .scheme-con-tag {
  position: absolute;
  top: 3px;
  left: 5px;
  color: #fff;
  font-size: 12px;
  z-index: 100;
}
#setSchemeRule .scheme-con-select {
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
#setSchemeRule .scheme-con-select > i {
  color: #c3601e;
  transform: scale(0.6, 0.6);
  margin-left: -2px;
}
#setSchemeRule .scheme-con-ing{
  position: absolute;
  top: -2px;
  right: -1px;
  display: block;
  z-index: 9999;
}
#setSchemeRule .scheme-con-ing>i{
  color: #fff;
  font-size: 26px;
}
.scheme-tip > li {
  height:28px;
  line-height: 28px;
}
.scheme-tip > li > b {
  display: inline-block;
  width: 64px;
  font-weight: bold;
}
</style>

