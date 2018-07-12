<template>
  <el-dialog title="计费方案" @close='onCancle' :visible.sync="isShow" :close-on-click-modal="false" style="top:-8%;" class='setChargeRuleDialog' width='500px'>

    <el-form ref="form" label-width="">
        <el-form-item label="是否需要申请：">
        <el-select v-model="selectData.apply_is_audit" @change='onChange' placeholder="请选择">
            <el-option label="全部" value=""></el-option>
            <el-option label="是" value="1"></el-option>
            <el-option label="否" value="0"></el-option>
        </el-select>
        </el-form-item>
    </el-form>
  <div style="height:330px;overflow: auto;">
    <div v-for="(chargePlan,index) in chargePlanList" :key="index">
      <div class="plan-con-title"><span>{{chargePlan.key}}</span></div>
        <el-row class='plan-list'>
          <el-col :span="4" v-for="(item,index) in chargePlan.value" :key="index" :offset="index%5==0 ? 0 : 1">
            <el-card :body-style="{ padding: '0px 0px 15px 0px' }">
              <el-popover placement="right" trigger="hover">
                <!-- 鼠标滑上提示 -->
                <ul class='plan-tip'>
                  <li><b>方案名称：</b>{{item.scheme_name}}</li>
                  <li><b>是否收费：</b>{{item.is_fee_text}}</li>
                  <li v-if="item.is_fee === '1'"><b>收费标准：</b>{{getFeeStandard(item.fee_standard,item.fee_price)}}</li>
                  <li><b>有效期：</b>{{item.expiry_start_date}} 至 {{item.expiry_end_date}}</li>
                  <li><b>调用限制：</b>{{item.restrict_type_text}}{{item.restrict_num}}次</li>
                  <li><b>使用申请：</b>{{item.is_approve_text}}</li>
                  <li><b>创建时间：</b>{{item.created_time}}</li>
                </ul>

                <!-- 方案 -->
                <el-button slot="reference" class='plan-card' @click='!item.serviceUseFeeSchemeStatus?onClickFee(item,index,""):onClickFee(item,index,"0")' :class="{'selected':item.selected}">
                  <img src="../../images/yfb.jpg" class="image" v-if="!item.serviceUseFeeSchemeStatus">
                  <img src="../../images/ygq2.jpg" class="image" v-else>
                  <div class="plan-con">
                    <div :class="!item.serviceUseFeeSchemeStatus?'plan-con-num':'plan-con-num-ygq'">
                      <time class="time">{{item.restrict_type_text}}{{item.restrict_num}}次</time>
                    </div>
                    <span :class="!item.serviceUseFeeSchemeStatus?'plan-con-name':'plan-con-name-ygq'">{{item.scheme_name}}</span>
                  </div>
                  <span class="plan-con-tag">{{item.is_fee_text}}</span>
                  <span class="plan-con-select" v-if="!item.serviceUseFeeSchemeStatus">
                    <i v-show='item.selected' class="el-icon-check"></i>
                  </span>
                  <span class="plan-con-select-ygq" v-else @mouseover="selectOver(item,index)" @mouseout="selectOut(item,index)">
                    <i v-show='item.selected && !item.selectflag' class="icon iconfont icon-delete-black"></i>
                    <i v-show='item.selected && item.selectflag' class="icon iconfont icon-gouxuan"></i>
                  </span>
                </el-button>
                <!-- 方案 -->
              </el-popover>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </div>
    <!-- <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="onSure">确 认</el-button>
      <el-button @click="onCancle">取 消</el-button>
    </div> -->
    <div slot="footer" class="dialog-footer" :class='{hsaHover:setStyleHover}'>
        <el-button @click="onSure" type="primary">确 认</el-button>
        <el-button @click="onCancle" @mouseenter.native='setStyle(true)' @mouseleave.native='setStyle(false)'>取 消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import apiClient from '../../../publicJs/ApiClient.js'
import commonFunc from '../common/commonFunc.js'
import LoadingBoxService from '../../../publicJs/LoadingBoxService.js'
import TipBoxService from '../common/TipBoxService.js'
export default {
  props: {
    isShow: {},
    vueObj: {},
    returnAll: false
  },
  data: function () {
    return {
      selectflag: true,
      selectflagId: '', // 过期方案，样式变化
      setStyleHover: false,
      serviceObj: {},
      isRequiredApply: '',
      data: {},
      chargePlanList: [],
      url: 'itsmApi/feeScheme/feeSchemeGroupList',
      checkArr: [],
      selectData: {
        pageNum: 1,
        pageSize: 10,
        parent_id: '',
        znSort: '0',
        nameSort: '', // 升序asc降序desc
        statusSort: '',
        createDateSort: '',
        scheme_status: [1],
        scheme_name: '',
        scheme_group_id: [],
        apply_is_audit: ''
      }
    }
  },
  watch: {
    isShow: function (nv, ov) {
      let vm = this
      if (nv) {
        vm.serviceObj = Object.assign({}, vm.vueObj)
        vm.onQuery()
      }
    }
  },
  mounted () {},
  methods: {
    /** 确认取消按钮样式 */
    setStyle (status) {
      this.setStyleHover = status
    },
    selectOut (item, index) {
      let vm = this
      let obj = item
      obj.selectflag = true
      for (var i = 0; i < vm.chargePlanList.length; i++) {
        for (var k = 0; k < vm.chargePlanList[i].value.length; k++) {
          if (item.id === vm.chargePlanList[i].value[k].id) {
            vm.$set(vm.chargePlanList[i].value, index, obj)
          }
        }
      }
    },
    selectOver (item, index) {
      let vm = this
      let obj = item
      obj.selectflag = false
      for (var i = 0; i < vm.chargePlanList.length; i++) {
        for (var k = 0; k < vm.chargePlanList[i].value.length; k++) {
          if (item.id === vm.chargePlanList[i].value[k].id) {
            vm.$set(vm.chargePlanList[i].value, index, obj)
          }
        }
      }
    },
    onQuery: function () {
      let vm = this
      let param = {
        // 当前服务所使用的套餐
        // bill_rules:vm.serviceObj.bill_rules,//当窗口关闭再打开，获取的是老的bill_rules数据
        // service_end_time:vm.serviceObj.service_end_time,
        serviceId: vm.serviceObj.id,
        apply_is_audit: vm.selectData.apply_is_audit
      }
      // 清空数据
      vm.chargePlanList = []
      vm.checkArr = []
      apiClient.post(vm.url, param, function (data) {
        if (data.status === 200) {
          vm.chargePlanList = [...data.results]
          console.log('cnmd方案', data.results)
          let dataList = [...data.results]
          console.log(vm.serviceObj)
          console.log(dataList)
          vm.data = new Array()
          for (var k = 0; k < dataList.length; k++) {
            dataList[k].value.forEach(function (v, i) {
              v.selectflag = true
              v.is_fee_text = v.is_fee === '1' ? '收费' : '免费'
              if (v.is_fee === '1') {
                if (v.fee_standard === '1') {
                  v.fee_standard_text = '每次'
                } else if (v.fee_standard === '2') {
                  v.fee_standard_text = '每天'
                } else if (v.fee_standard === '3') {
                  v.fee_standard_text = '每月'
                }
              }
              v.is_approve = v.apply_is_audit
              v.is_approve_text = v.is_approve === '1' ? '需要' : '不需要'
              v.created_time = commonFunc.formatDate(v.created_time, 'yyyy-MM-dd HH:mm:ss')
              v.expiry_start_date = commonFunc.formatDate(v.expiry_start_date, 'yyyy-MM-dd')
              v.expiry_end_date = commonFunc.formatDate(v.expiry_end_date, 'yyyy-MM-dd')
              v.restrict_type_text = commonFunc.getRestrictType(v.restrict_type)
              v.selected = false
              v.serviceUseFeeSchemeStatus = false
              if (vm.serviceObj.bill_rules !== undefined) {
                for (var j = 0; j < vm.serviceObj.bill_rules.length; j++) {
                  if (v.id === vm.serviceObj.bill_rules[j]) {
                    v.selected = true
                    vm.checkArr.push(v.id)
                    // 是否是当前服务使用中，已过期的方案
                    if (v.useFeeSchemeStatus !== undefined && v.useFeeSchemeStatus === '4') {
                      v.serviceUseFeeSchemeStatus = true
                    }
                  }
                }
              }
              if (v.apply_is_audit === vm.isRequiredApply || vm.isRequiredApply === '') {
                let obj = Object.assign({}, v)
                vm.data.push(obj)
              }
            })
          }
          // vm.data = [...dataList];
          console.log('checkArr', vm.checkArr)
        } else {
          TipBoxService.open(data.exception, 2)
        }
      })
    },
    // feeUseStatus,用于判断当前服务管理的方案操作为：删除，对已过期方案的删除
    onClickFee: function (item, index, feeUseStatus) {
      console.log(item, index)
      let vm = this
      vm.checkArr = []
      let obj = item
      obj.selected = !obj.selected
      for (var i = 0; i < vm.chargePlanList.length; i++) {
        for (var k = 0; k < vm.chargePlanList[i].value.length; k++) {
          if (item.id === vm.chargePlanList[i].value[k].id) {
            vm.$set(vm.chargePlanList[i].value, index, obj)
          }
          if (vm.chargePlanList[i].value[k].selected) {
            vm.checkArr.push(vm.chargePlanList[i].value[k].id)
          }
        }
      }
      // vm.$set(vm.data, index, obj);
      // vm.serviceObj.scheme_id = item.id;
      // for (var i = 0; i < vm.data.length; i++) {
      //   if (vm.data[i].selected) {
      //     vm.checkArr.push(vm.data[i].id);
      //   }
      // }
      vm.serviceObj.bill_rules = [...vm.checkArr]
      console.log('checkArr', vm.checkArr)
      // debugger;
      // 点击删除按钮，删除服务中已过期的方案
      if (feeUseStatus === '0') {
        vm.serviceObj.feeUseStatus = '0'
        // vm.serviceObj.delSchemeId = obj.id;
        // vm.onSure();
        vm.removeCheckedFeeScheme(obj.id)
      }
    },
    onSure: function () {
      let vm = this
      if (vm.returnAll) {
        let obj = []
        vm.chargePlanList.forEach(function (v, i) {
          let list = []
          v.value.forEach(function (o, j) {
            if (o.selected) {
              list.push(o)
            }
          })
          if (list.length) {
            let item = {}
            item.groupName = v.key
            item.feeInfo = list
            obj.push(item)
          }
        })
        vm.$emit('sure', vm.serviceObj, obj)
      } else {
        vm.$emit('sure', vm.serviceObj)
      }
    },
    onCancle: function () {
      this.$emit('cancle', false)
      // //清空数据
      // this.chargePlanList = [];
      // this.checkArr = [];
    },
    onChange: function () {
      this.onQuery()
    },
    removeCheckedFeeScheme: function (delSchemeId) {
      // for(var i=0; i < this.checkArr.length; i++) {
      //   if(this.checkArr[i] == delSchemeId) {
      //     this.checkArr.splice(i, 1);
      //     break;
      //   }
      // }
      // debugger
      let vm = this
      LoadingBoxService.open('请稍候...')
      var myData = {
        serviceId: vm.serviceObj.id,
        fieldName: 'bill_rules',
        fieldValue: vm.serviceObj.bill_rules.join(','),
        fieldType: 'array'
      }
      apiClient.post('itsmApi/enterprisePlatform/updateServiceForOneField', myData, function (data) {
        LoadingBoxService.close()
        TipBoxService.open('删除成功')
        vm.onQuery()
        var addScheme = {
          service_id: vm.serviceObj.id,
          scheme_id: delSchemeId
        }
        // 方案流转数据
        apiClient.post('itsmApi/schemeWorkflow/addDelSchemeToWorkflow', addScheme, function (data) {
          vm.serviceObj.feeUseStatus = ''// 在父窗口中使用的
        })
      })
    },
    // 收费标准转换
    getFeeStandard (fee_standard, fee_price) {
      return commonFunc.getFeeStandard(fee_standard) + fee_price + '元'
    }
  }
}
</script>
<style>
.setChargeRuleDialog .el-dialog {
  width: 600px;
  border-radius: 5px;
}
.setChargeRuleDialog .el-dialog__header {
  width: 600px;
  padding: 15px 15px 10px 15px;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
}
.setChargeRuleDialog .el-dialog__body {
  width: 600px;
}
.setChargeRuleDialog .el-dialog__footer {
  padding: 0;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
}
.setChargeRuleDialog .dialog-footer .el-button {
  color: #ffffff;
  float: left;
  height: 40px;
  border-radius: 0px;
  width: 50%;
  margin: 0 !important;
}
.setChargeRuleDialog .el-button--primary {
  background-color: #7fa6f3;
  border-color: #7fa6f3;
  border-bottom-left-radius: 5px;
}
.setChargeRuleDialog .el-button--default {
  background-color: #e2e2e2;
  border-color: #e2e2e2;
  border-bottom-right-radius: 5px;
}
.setChargeRuleDialog .plan-con-title {
  margin: -5px 0 15px 0;
  border-bottom: 1px solid #f1f1f1;
}
.setChargeRuleDialog .plan-con-title > span {
  display: inline-block;
  width: auto;
  margin-bottom: -1px;
  padding: 3px 0;
  border-bottom: 2px solid #ff4500;
  font-weight: bold;
}
.setChargeRuleDialog .plan-list {
  min-height: 128px;
  padding: 5px 4px 0 0;
  overflow-y: auto;
  overflow-x: hidden;
}
.setChargeRuleDialog .el-card {
  border: none;
  box-shadow: none;
  position: relative;
  overflow: visible;
  cursor: pointer;
}
.setChargeRuleDialog .plan-card {
  width:auto;
  height:auto;
  padding: 0;
  margin: 0;
  background: none !important;
  border: none !important;
}
.setChargeRuleDialog .image {
  width: 100%;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
}
.setChargeRuleDialog .plan-con-num {
  text-align: center;
  font-size: 12px;
  background: #fabd7e;
  height: 22px;
  line-height: 22px;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  color: #c3601e;
}
.setChargeRuleDialog .plan-con-name {
  display: block;
  width:90px;
  white-space:nowrap;
  text-overflow:ellipsis;
  overflow:hidden;
  margin: 6px auto 0 auto;
  font-size: 12px;
  color: #666
}
.setChargeRuleDialog .selected .plan-con-name {
  color: #c3601e;
}
.setChargeRuleDialog .plan-con-name-ygq {
  display: block;
  width:90px;
  white-space:nowrap;
  text-overflow:ellipsis;
  overflow:hidden;
  margin: 6px auto 0 auto;
  font-size: 12px;
  color: #666
}
.setChargeRuleDialog .selected .plan-con-name-ygq{
  color: #666
}
.setChargeRuleDialog .plan-con-tag {
  position: absolute;
  top: 3px;
  left: 5px;
  color: #fff;
  font-size: 12px;
  z-index: 9999;
}
.setChargeRuleDialog .plan-con-select {
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
.setChargeRuleDialog .plan-con-select > i {
  color: #c3601e;
  transform: scale(0.6, 0.6);
  margin-left: -2px;
}
.setChargeRuleDialog .plan-tip > li {
  height: 28px;
  line-height: 28px;
}
.setChargeRuleDialog .plan-tip > li > b {
  display: inline-block;
  width: 64px;
  font-weight: bold;
}
/** 已过期图标样式 */
.setChargeRuleDialog .scheme-con-ing{
  position: absolute;
  top: -2px;
  right: -1px;
  display: block;
  z-index: 9999;
}
.setChargeRuleDialog .scheme-con-ing>i{
  color: #fff;
  font-size: 26px;
}
.setChargeRuleDialog .plan-con-num-ygq {
  text-align: center;
  font-size: 12px;
  background: #999999;
  height: 22px;
  line-height: 22px;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  color: #333;
}
.setChargeRuleDialog .plan-con-select-ygq {
  position: absolute;
  top: -3px;
  right: -5px;
  display: block;
  width: 16px;
  height: 16px;
  line-height: 16px;
  border: 1px solid #999;
  border-radius: 8px;
  background: #fff;
  z-index: 9999;
}
.setChargeRuleDialog .plan-con-select-ygq > i {
  color: #999999;
  transform: scale(0.6, 0.6); 
}
.setChargeRuleDialog .plan-con-select-ygq .icon-delete-black{
  margin-left: -3px;
}
.setChargeRuleDialog .plan-con-select-ygq .icon-gouxuan{
  margin-left: -2px;
  font-size: 17px;
}
/** 确认取消按钮样式*/
.setChargeRuleDialog .hsaHover .el-button--primary {
    background-color: #e2e2e2;
    border-color: #e2e2e2;
}
.setChargeRuleDialog .hsaHover .el-button--default {
  color: #ffffff;
  border-color: #7fa6f3;
  background-color: #7fa6f3;
}
.setChargeRuleDialog .dialog-footer .el-button:hover{
  color: #ffffff;
  border-color: #7fa6f3;
  background-color: #7fa6f3;
}

</style>
