<template>
  <el-dialog title="计费方案" @close='onCancle' :visible.sync="isShow" class='scheme-dialog' width='500px'>
    <el-row class='scheme-list'>
      <el-col :span="4" v-for="(item,index) in data" :key="index" :offset="index%5==0 ? 0 : 1">
        <el-card :body-style="{ padding: '0px 0px 15px 0px' }">
          <el-popover placement="right" trigger="hover">
            <!-- 鼠标滑上提示 -->
            <ul class='scheme-tip'>
              <li><b>方案名称：</b>{{item.scheme_name}}</li>
              <li><b>是否收费：</b>{{item.is_fee_text}}</li>
              <li v-if="item.is_fee === '1'"><b>收费标准：</b>{{getFeeStandard(item.fee_standard,item.fee_price)}}</li>
              <li><b>有效期：</b>{{item.expiry_start_date}} 至 {{item.expiry_end_date}}</li>
              <li><b>调用限制：</b>{{item.restrict_type_text}}{{item.restrict_num}}次</li>
              <li><b>使用申请：</b>{{item.is_approve_text}}</li>
              <li><b>创建时间：</b>{{item.created_time}}</li>
            </ul>
            <!-- 方案 -->
            <el-button slot="reference" class='scheme-card' @click='onClickFee(item)' :class="{'selected':item.selected}">
              <img src="../../images/yfb.jpg" class="image">
              <span v-if="item.isApplyAgain" class="scheme-con-mask"></span>
              <div class="scheme-con">
                <div class="scheme-con-num">
                  <time class="time">{{item.restrict_type_text}}{{item.restrict_num}}次</time>
                </div>
                <span class="scheme-con-name">{{item.scheme_name}}</span>
              </div>
              <span class="scheme-con-tag">{{item.is_fee_text}}</span>
              <span v-if="!item.isApplyAgain" class="scheme-con-select">
                <i v-show='item.selected' class="el-icon-check"></i>
              </span>
              <span v-if="item.isApplyAgain" class="scheme-con-ing">
                <i class="icon iconfont icon-zhengzaishiyong"></i>
              </span>
            </el-button>
            <!-- 方案 -->
          </el-popover>
        </el-card>
      </el-col>
    </el-row>

    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="onSure">确 认</el-button>
      <el-button @click="onCancle">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import apiClient from '../../../publicJs/ApiClient.js'
import TipBoxService from '../common/TipBoxService.js'
import commonFunc from '../common/commonFunc.js'
export default {
  props: {
    isShow: {},
    serviceData: {}
  },
  data: function () {
    return {
      serviceObj: {},
      data: {},
      url: 'itsmApi/feeScheme/loadSchemeList'
    }
  },
  watch: {
    isShow: function (nv, ov) {
      let vm = this
      if (nv) {
        vm.serviceObj = Object.assign({}, vm.serviceData)
        console.log('vm.serviceObj', vm.serviceObj)
        if (vm.serviceObj.use_status === '2' || vm.serviceObj.use_status === '4') {
          vm.serviceObj.scheme_id = ''
          vm.serviceObj.is_approve = ''
          vm.serviceObj.expiry_start_date = ''
          vm.serviceObj.expiry_end_date = ''
        }
        vm.onQuery()
      }
    }
  },
  mounted () {},
  methods: {
    onQuery: function () {
      let vm = this
      let param = { serviceId: vm.serviceObj.id }
      vm.data = new Array()
      apiClient.post(vm.url, param, function (data) {
        if (data.status === 200) {
          vm.data = [...data.results]
          console.log(vm.data)
          vm.data.forEach(function (v, i) {
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
            // v.is_approve = "0";
            v.is_approve_text = v.is_approve === '1' ? '需要' : '不需要'
            v.created_time = commonFunc.formatDate(v.created_time, 'yyyy-MM-dd HH:mm:ss')
            v.expiry_start_date = commonFunc.formatDate(v.expiry_start_date, 'yyyy-MM-dd')
            v.expiry_end_date = commonFunc.formatDate(v.expiry_end_date, 'yyyy-MM-dd')
            v.restrict_type_text = commonFunc.getRestrictType(v.restrict_type)
            v.selected = false
            if (vm.serviceObj.scheme_id === v.id && vm.serviceObj.use_status !== '4' && vm.serviceObj.use_status !== '2') {
              v.selected = true
              if (vm.serviceObj.use_status === 3) {
                v.isApplyAgain = true
                v.selected = false
              }
            }
          })
        } else {
          TipBoxService.open(data.exception, 2)
        }
      })
    },
    onChange: function () {
      this.onQuery()
    },
    onClickFee: function (item) {
      let vm = this
      if (item.isApplyAgain) {
        return
      }
      vm.data.forEach(function (v, i) {
        let obj = Object.assign({}, v)
        obj.selected = false
        if (obj.id === item.id) {
          obj.selected = true
        }
        vm.$set(vm.data, i, obj)
      })
      vm.serviceObj.scheme_id = item.id
      vm.serviceObj.is_approve = item.is_approve
      vm.serviceObj.expiry_start_date = item.expiry_start_date
      vm.serviceObj.expiry_end_date = item.expiry_end_date
    },
    onSure: function () {
      let vm = this
      if (vm.serviceObj.scheme_id && vm.serviceObj.scheme_id != vm.serviceData.scheme_id) {
        vm.$emit('sure', vm.serviceObj, )
      } else if (vm.serviceObj.scheme_id == vm.serviceData.scheme_id) {
        vm.$message({
          showClose: true,
          message: '不可选择正在使用的方案!',
          type: 'error'
        })
      } else {
        vm.$message({
          showClose: true,
          message: '请选择方案!',
          type: 'error'
        })
      }
    },
    onCancle: function () {
      this.$emit('cancle', false)
    },
    // 收费标准转换
    getFeeStandard (fee_standard, fee_price) {
      return commonFunc.getFeeStandard(fee_standard) + fee_price + '元'
    }
  }
}
</script>
<style>
.scheme-dialog .el-dialog {
  width: 600px;
  border-radius: 5px;
}
.scheme-dialog .el-dialog__header {
  width: 600px;
  padding: 15px 15px 10px 15px;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
}
.scheme-dialog .el-dialog__body {
  width: 600px;
}
.scheme-dialog .el-dialog__footer {
  padding: 0;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
}
.scheme-dialog .dialog-footer .el-button {
  color: #ffffff;
  float: left;
  height: 40px;
  border-radius: 0px;
  width: 50%;
  margin: 0 !important;
}
.scheme-dialog .el-button--primary {
  background-color: #7fa6f3;
  border-color: #7fa6f3;
  border-bottom-left-radius: 5px;
}
.scheme-dialog .el-button--default {
  background-color: #e2e2e2;
  border-color: #e2e2e2;
  border-bottom-right-radius: 5px;
}
.scheme-dialog .scheme-con-title {
  margin: -10px 0 15px 0;
  border-bottom: 1px solid #f1f1f1;
}
.scheme-dialog .scheme-con-title > span {
  display: inline-block;
  width: auto;
  margin-bottom: -1px;
  padding: 3px 0;
  border-bottom: 2px solid #ff4500;
  font-weight: bold;
}
.scheme-dialog .scheme-list {
  height: 200px;
  padding: 5px 4px 0 0;
  overflow-y: auto;
}
.scheme-dialog .el-card {
  border: none;
  box-shadow: none;
  position: relative;
  overflow: visible;
  cursor: pointer;
}
.scheme-dialog .scheme-card {
  padding: 0;
  margin: 0;
  background: none !important;
  border: none !important;
}
.scheme-dialog .image {
  width: 100%;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
}
.scheme-dialog .scheme-con-mask{
  position: absolute;
  left:0;
  display: inline-block;
  width:93px;
  height: 95px;
  z-index: 220;
  background: rgba(0,0,0,0.3);
  border-radius: 4px;
}
.scheme-dialog .scheme-con-num {
  text-align: center;
  font-size: 12px;
  background: #fabd7e;
  height: 22px;
  line-height: 22px;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  color: #c3601e;
}
.scheme-dialog .scheme-con-name {
  display: block;
  width:90px;
  white-space:nowrap;
  text-overflow:ellipsis;
  overflow:hidden;
  margin: 6px auto 0 auto;
  font-size: 12px;
}
.scheme-dialog .selected .scheme-con-name {
  color: #c3601e;
}
.scheme-dialog .scheme-con-tag {
  position: absolute;
  top: 3px;
  left: 5px;
  color: #fff;
  font-size: 12px;
  z-index: 100;
}
.scheme-dialog .scheme-con-select {
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
.scheme-dialog .scheme-con-select > i {
  color: #c3601e;
  transform: scale(0.6, 0.6);
  margin-left: -2px;
}
.scheme-dialog .scheme-con-ing{
  position: absolute;
  top: -2px;
  right: -1px;
  display: block;
  z-index: 9999;
}
.scheme-dialog .scheme-con-ing>i{
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
