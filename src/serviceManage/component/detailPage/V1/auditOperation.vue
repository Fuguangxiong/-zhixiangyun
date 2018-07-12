<template>
  <!-- 主题内容菜单 -->
  <div class="boxBody" id="boxBody">
    <div class="exAndApproval">
      <span class="firstSpan">审批</span>
      <span @click="pass()" :class="{selected:isshow}" class="rs">通过</span>
      <span @click="noPass()" class="rs" :class="{selected:!isshow}">不通过</span>
      <br>
      <div class="remarks">
        <span v-show="!isshow" class="xing">*</span>
        <span>备注</span>
        <textarea name="desc" maxlength="50" style="resize:none;vertical-align:text-top;" @input="descInput" v-model="desc" id="" cols="60" rows="3"></textarea>
        <br>
        <span style="margin-right: 20px;float:right">您还可以输入<span style="color:red">{{remnant}}</span>个字</span>
      </div>
    </div>
    <div class="button_box">
      <span @click="submitApply()" class="queding">
        确定
      </span>
    </div>
  </div>
</template>

<script>
import $ from "jquery";
import JqUI from "../../lib/jquery-ui.min.js";
import apiClient from "../../../publicJs/ApiClient.js";
import TipBoxService from "../common/TipBoxService.js";

export default {
  name: "operation",
  components: {},
  data() {
    return {
      isshow: true,
      remnant: 50,
      desc: "",
      auditParam:{
        reviewnotes:"",
        reviewstatus:2,
        audit_type:"2"
      }
    };
  },
  mounted() {
    
  },
  methods: {
    pass() {
      this.isshow = true;
      this.auditParam.reviewstatus = 2;
    },
    noPass() {
      this.isshow = false;
      this.auditParam.reviewstatus = 3;
    },
    descInput() {
      var txtVal = this.desc.length;
      this.remnant = 50 - txtVal;
    },
    submitApply(){
      if(this.auditParam.reviewstatus == 3 && (this.desc == undefined || this.desc == "")){
        TipBoxService.open("备注信息不能为空!", 2);
        return;
      }
      this.auditParam.reviewnotes = this.desc
      this.$emit("submitApp", this.auditParam);
    }
  }
};
</script>
<style src="../../css/createCombinationServeice/jquery-ui.custom.min.css" scoped></style>
<!--<style src="../../css/detailPage/operation.css" scoped></style>-->
<style scoped>
.boxBody {
  width: 95%;
  padding: 0;
}
.active {
  display: none;
}
.remarks {
  margin-top: 30px;
  width: 800px;
  position: relative;
}
.xing {
  color: #cc3333;
  position: absolute;
  left: -8px;
  top: 2px;
}
.button_box {
    width: 100%;
    height: 32px;
    margin: 20px auto;
    text-align: center;
}
.button_box span {
    cursor: pointer;
    width: 82px !important;
    height: 30px !important;
    color: #fff !important;
    text-align: center !important;
    line-height: 30px;
    margin: 20px auto;
    margin-right: 175px;
    float: right;
}
.queding {
    background-color: #26d186 !important;
}
.quxiao{
    background-color: #eeeeee !important;
}
.firstSpan{
  float: left;
  margin-top: 5px;
}
.rs{
  width: 82px;
  height: 30px;
  text-align: center;
  line-height: 30px;
  border: 1px solid #cccccc;
  display: block;
  float: left;
  margin-left: 30px;
  cursor: pointer;
}
.rs.selected{
  border: 1px solid #ff9900;
  background-color: #ff9900;
  color: #fff;
}
textarea{
  width: 728px;
  height: 50px;
  margin-left: 26px;
}
</style>