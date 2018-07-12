<template>
  <el-dialog title="购买套餐详情" @close='onCancle' :visible.sync="isShow" class='scheme-info-dialog' width='500px'>
    <ul class='scheme-info-list'>
      <li><b>套餐名称：</b>{{info.scheme_name}}</li>
      <li><b>套餐期限：</b>{{info.expiry_start_date}} 至 {{info.expiry_end_date}}</li>
      <!-- 免费-->
      <li v-if="info.is_fee === '0'"><b>套餐内容：</b>{{info.restrict_type_text}}{{info.is_fee_text}}{{info.restrict_num}}次</li>
      <!-- 收费-->
      <li v-else><b>套餐内容：</b>{{info.fee_standard_text}}{{info.is_fee_text}}{{info.fee_price}}元</li>
      <li><b>购买时间：</b>{{info.apply_time}}</li>
    </ul>
  </el-dialog>
</template>

<script>
import apiClient from "../../../publicJs/ApiClient.js";
import commonFunc from "../common/commonFunc.js";
export default {
  props: {
    isShow: {},
    serviceData: {}
  },
  data: function() {
    return {
      serviceObj: {},
      info: {},
      url: "itsmApi/feeScheme/findFeeSchemeById"
    };
  },
  watch: {
    isShow: function(nv, ov) {
      let vm = this;
      if (nv) {
        vm.serviceObj = Object.assign({}, vm.serviceData);
        vm.onQuery();
      }
    }
  },
  methods: {
    onQuery: function() {
      let vm = this;
      let param = { id: vm.serviceData.scheme_id };
      apiClient.post(vm.url, param, function(data) {
        if (data.status == "200") {
          vm.info = Object.assign({}, data.results);
          console.log(data.results);
          vm.info.is_fee_text = vm.info.is_fee == "1" ? "收费" : "免费";
          if(vm.info.is_fee === '1'){
            if(vm.info.fee_standard == '1'){
              vm.info.fee_standard_text = "每次";
            }else if(vm.info.fee_standard == '2'){
              vm.info.info.fee_standard_text = "每天";
            }else if(vm.info.fee_standard == '3'){
              vm.info.fee_standard_text = "每月";
            }
          }
          vm.info.created_time = commonFunc.formatDate(
            vm.info.created_time,
            "yyyy-MM-dd HH:mm:ss"
          );
          vm.info.expiry_start_date = commonFunc.formatDate(
            vm.info.expiry_start_date,
            "yyyy-MM-dd"
          );
          vm.info.expiry_end_date = commonFunc.formatDate(
            vm.info.expiry_end_date,
            "yyyy-MM-dd"
          );
          vm.info.restrict_type_text = commonFunc.getRestrictType(
            vm.info.restrict_type
          );
          if(vm.serviceObj.apply_time){
            vm.info.apply_time = commonFunc.formatDate(
              vm.serviceObj.apply_time,
              "yyyy-MM-dd HH:mm:ss"
            );
          }else{
            vm.info.apply_time='';
          }
        } else {
          TipBoxService.open(data.exception, 2);
        }
      });
    },
    onCancle: function() {
      this.$emit("cancle", false);
    }
  }
};
</script>
<style>
.scheme-info-dialog .el-dialog {
  width: 280px;
  border-radius: 4px;
}
.scheme-info-dialog .el-dialog__header {
  width: 280px;
  padding: 15px 15px 12px 15px;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
}
.scheme-info-dialog .el-dialog__headerbtn{
  font-size: 12px;
}
.scheme-info-dialog .el-dialog__body {
  width: 280px;
  padding:20px 15px;
}
.scheme-info-dialog .scheme-info-list > li {
  height: 28px;
  line-height: 28px;
  font-size: 12px;
}
.scheme-info-dialog .scheme-info-list > li > b {
  display: inline-block;
  width: 64px;
  font-weight: bold;
}
</style>