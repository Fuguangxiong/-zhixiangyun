<template>
<div class="chargePlan">
  <el-dialog title="创建计费方案" @close='onCancle' :visible.sync="isShow" :close-on-click-modal="false" width='90%'>
      <el-form ref="addForm">
        <div class="tkBox">
            <div class="nrBox">
                <div class="titleBox">
                    <i>*</i>
                    <span>方案名称：</span>
                </div>
                <div class="srBox srBoxHeight">
                    <el-input v-model="planParam.scheme_name" placeholder="请输入内容"></el-input>
                </div>
            </div>
            <div class="nrBox">
                <div class="titleBox">
                    <i>*</i>
                    <span>选择分组：</span>
                </div>
                    <div class="srBox srBoxHeight">
                        <el-select class="srBSelect" popper-class='srBSelectDropdown' v-model="planParam.parent_id" placeholder="请选择">
                            <el-option
                                v-for="(planGroup,index) in groupInfo"
                                :key="index"
                                :label="planGroup.scheme_group_name"
                                :value="planGroup.id">
                            </el-option>
                    </el-select>
                </div>
            </div>
            <div class="nrBox">
                <div style="marginLeft:10px" class="titleBox">
                    <span>是否收费：</span>
                </div>
                <div class="srBox">
                    <!-- <el-radio checked >免费</el-radio> -->
                    <!-- <input checked type="radio" name="" id="">免费 -->
                    <el-radio v-model="planParam.is_fee" label="0" checked>免费</el-radio>
                    <el-radio v-model="planParam.is_fee" label="1">收费</el-radio>
                </div>
            </div>
            <div class="nrBox" v-show="planParam.is_fee === '1'">
                <div class="titleBox">
                    <i>*</i>
                    <span>收费标准：</span>
                </div>
                <div class="srBox srcBoxLimit">
                     <el-select v-model="planParam.fee_standard" placeholder="请选择">
                        <el-option
                            v-for="(restrict,index) in feeStandard"
                            :key="index"
                            :label="restrict.label"
                            :value="restrict.value">
                        </el-option>
                    </el-select>
                    <el-input class="maxCall" v-model="planParam.fee_price" placeholder="收费价位"></el-input>&nbsp;元
                </div>
            </div>
            <div class="nrBox">
                <div class="titleBox">
                    <i>*</i>
                    <span>有效日期：</span>
                </div>
                <div class="srBox">
                    <el-date-picker
                        v-model="startTime"
                        type="date"
                        format="yyyy-MM-dd"
                        placeholder="选择日期"
                        @change="changeStartDate"
                        :picker-options="pickerOptions0"
                        popper-class = "ck"
                        >
                    </el-date-picker>
                    <div class="jgLine" style="width: 22px;margin-top: 15px;"></div>
                    <el-date-picker
                        v-model="endTime"
                        format="yyyy-MM-dd"                      
                        type="date"
                        placeholder="选择日期"
                        @change="changeEndDate"
                        :picker-options="pickerOptions1"
                        popper-class = "ck"
                        >
                    </el-date-picker>
                </div>
            </div>
            <div class="nrBox">
                <div class="titleBox">
                    <i>*</i>
                    <span>调用限制：</span>
                </div>
                <div class="srBox srcBoxLimit">
                     <el-select v-model="planParam.restrict_type" placeholder="请选择">
                        <el-option
                            v-for="(restrict,index) in restrictNum"
                            :key="index"
                            :label="restrict.label"
                            :value="restrict.value">
                        </el-option>
                    </el-select>
                    <el-input class="maxCall" v-model="planParam.restrict_num" placeholder="最大调用次数"></el-input>&nbsp;次
                </div>
            </div>
            <div class="nrBox">
                <div style="marginLeft:10px" class="titleBox">
                    <span>使用申请：</span>
                </div>
                <div class="srBox">
                      <el-radio v-model="planParam.apply_is_audit" label="1">需要</el-radio>
                      <el-radio v-model="planParam.apply_is_audit" label="0">不需要</el-radio>
                </div>
            </div>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer" :class='{hsaHover:setStyleHover}'>
        <el-button @click="onSure()" type="primary">保 存</el-button>
        <el-button @click="onCancle" @mouseenter.native='setStyle(true)' @mouseleave.native='setStyle(false)'>取 消</el-button>
      </div>
    </el-dialog>
</div>
</template>
<script>
import apiClient from "../../../publicJs/ApiClient.js";
import commonFunc from "../common/commonFunc.js";
import TipBoxService from "../common/TipBoxService.js";
export default {
    props: {
        isShow: {},
        vueObj:{},
        groupInfo:{},
        reload: false
    },
    data:function(){
        let vm = this;
        return{
            setStyleHover:false,
            pickerOptions0: {
                disabledDate(time) {
                    return time.getTime() < Date.now() - 8.64e7;
                }
            },
            pickerOptions1: {
                disabledDate(time) {
                    return (
                        time.getTime() < Date.now() ||
                        time.getTime() < new Date(vm.startTime).getTime()
                    );
                }
            },
            startTime: "",
            endTime:"",
            planParam:{
                id:'',
                scheme_name:'',
                parent_id:'请选择',
                is_fee:'0',
                expiry_start_date:'',
                expiry_end_date:'',
                restrict_num:'',
                restrict_type:'请选择',
                apply_is_audit:'1',
                fee_standard:'请选择',
                fee_price:''

            },
            restrictNum:[],
            datalist: [],
            planGroupList:[],
            feeStandard:[{label:'按次',value:'1'},{label:'按天',value:'2'},{label:'按月',value:'3'}]
        }
    },
    watch:{
        reload: function(nv, ov) {
            if (nv) {
                this.planParam.id = this.vueObj.id;
                this.planParam.restrict_type = this.vueObj.restrict_type
                this.planParam.scheme_name = this.vueObj.scheme_name;
                this.planParam.parent_id = this.vueObj.parent_id;
                this.planParam.is_fee = this.vueObj.is_fee;
                this.planParam.restrict_num = this.vueObj.restrict_num;
                this.planParam.apply_is_audit = this.vueObj.apply_is_audit;
                this.planParam.expiry_start_date = this.vueObj.expiry_start_date;
                this.planParam.expiry_end_date = this.vueObj.expiry_end_date;
                this.startTime = this.vueObj.expiry_start_date;
                this.endTime = this.vueObj.expiry_end_date;
                //收费标准
                this.planParam.fee_standard = this.vueObj.fee_standard;
                this.planParam.fee_price = this.vueObj.fee_price;
                // if(this.vueObj.restrict_type == 1){
                //     this.planParam.restrict_type = '每天'
                // }else if(this.vueObj.restrict_type == 2){
                //     this.planParam.restrict_type = '每周'
                // }else if(this.vueObj.restrict_type == 3){
                //     this.planParam.restrict_type = '每月'
                // }else if(this.vueObj.restrict_type == 4){
                //     this.planParam.restrict_type = '每季度'
                // }else if(this.vueObj.restrict_type == 5){
                //     this.planParam.restrict_type = '半年'
                // }else if(this.vueObj.restrict_type == 6){
                //     this.planParam.restrict_type = '每年'
                // }
                this.computeDay();
            }
        },
        'planParam.is_fee':function(v){
            if(v === '1'){
                $(".chargePlan .el-dialog__body").css({"height":"370px"});
                
            }else{
                $(".chargePlan .el-dialog__body").css({"height":"320px"});
            }
        }
    },
    methods:{
        /* 保存 取消按钮样式调整*/
        setStyle(status){
            this.setStyleHover = status;
        },
        changeStartDate: function(val) {
            this.startTime = val;
        },
        changeEndDate: function(val) {
            this.endTime = val;
            this.computeDay();
        },
        computeDay(){
            let arr = [{label:'每天',value:'1'},{label:'每周',value:'2'},
                                    {label:'每月',value:'3'},{label:'每季度',value:'4'},
                                    {label:'半年',value:'5'},{label:'每年',value:'6'}];
            var days = this.DateDiff(this.endTime,this.startTime);
            if(days > 0 && days < 7){
                this.restrictNum = arr.slice(0,1);
            }
            if(days >= 7 && days < 30){
                this.restrictNum = arr.slice(0,2);
            }
            if(days >= 30 && days < 90){
                this.restrictNum = arr.slice(0,3);
            }
            if(days >= 90 && days < 180){
                this.restrictNum = arr.slice(0,4);
            }
            if(days >=180 && days <365){
                this.restrictNum = arr.slice(0,5);
            }
            if(days >= 365){
                this.restrictNum = arr.slice(0,6);
            }
        },
        //计算天数差的函数，通用  
        DateDiff(endDate,startDate){    //sDate1和sDate2是2006-12-18格式
            if(endDate != undefined && startDate != undefined){
                var startTime = new Date(Date.parse(startDate.replace(/-/g,   "/"))).getTime();     
                var endTime = new Date(Date.parse(endDate.replace(/-/g,   "/"))).getTime();     
                var dates = parseInt(Math.abs((startTime - endTime))/(1000*60*60*24));     
                return  dates;
            }
        },
        onCancle: function(){
            this.$emit("cancle", false);
            this.planParam.id = '';
            this.planParam.scheme_name = '';
            this.planParam.parent_id = '请选择';
            this.planParam.is_fee = '0';
            this.planParam.expiry_start_date = '';
            this.planParam.expiry_end_date = '';
            this.planParam.restrict_num = '';
            this.planParam.restrict_type = '请选择';
            this.planParam.apply_is_audit = "1";
            this.startTime = '';
            this.endTime = '';
            //新加收费标准、收费价格
            this.planParam.fee_standard = '请选择';
            this.planParam.fee_price = '';
        },
        onSure: function(){
            if(this.planParam.scheme_name.length == 0){
                TipBoxService.open('请填写方案名称',1);
                return;
            }
            if(this.planParam.scheme_name.length > 15){
                TipBoxService.open('方案名称不得超过15个字符',1)
                return;
            }
            if(this.planParam.parent_id == "请选择"){
                TipBoxService.open('请选择方案分组',1)
                return;
            }
            //判断是否为收费，再判断收费收费标准、收费价位是否为空等格式校验
            if(this.planParam.is_fee === '1'){
                if(this.planParam.fee_standard == "请选择"){
                    TipBoxService.open('请选择收费标准',1)
                    return;
                }
                if(this.planParam.fee_price == ""){
                    TipBoxService.open('请输入收费价位',1)
                    return;
                }
            }
            if(this.startTime == ""){
                TipBoxService.open('请选择开始时间',1)
                return;
            }
            if(this.endTime == ""){
                TipBoxService.open('请选择结束时间',1)
                return;
            }
            if(this.planParam.restrict_type == "请选择"){
                TipBoxService.open('请选择调用限制类型',1)
                return;
            }
            if(this.planParam.restrict_num == ""){
                TipBoxService.open('请输入最大调用次数',1)
                return;
            }
            // if(this.planParam.restrict_num > 0){
            //     alert(this.planParam.restrict_type);
            //     if(this.planParam.restrict_type){
            //     this.MN = 10000;
            //     }
            //     if(this.planParam.restrict_type){
            //         this.MN = 70000;
            //     }
            //     if( this.planParam.restrict_type){
            //         this.MN = 300000;
            //     }
            //     if(this.planParam.restrict_type){
            //         this.MN = 900000;
            //     }
            //     if(this.planParam.restrict_type){
            //         this.MN = 1800000;
            //     }
            //     if(this.planParam.restrict_type){
            //         this.MN = 70000;
            //     }
            //     TipBoxService.open('最大调用次数不得超过'+this.MN,1)
            //     return;
            // }
            if(!/^[1-9]*[1-9][0-9]*$/.test(this.planParam.restrict_num)){
                TipBoxService.open('最大调用次数只能填写正整数',1)
                return;
            }
            // if(this.planParam.apply_is_audit == ''){
            //     TipBoxService.open('请选择使用申请',1)
            //     return;
            // }
            if(this.planParam.restrict_type == '1'){
                if(this.planParam.restrict_num > 10000){
                    TipBoxService.open('最大调用次数不得超过一万',1)
                    return;
                }
            }else if(this.planParam.restrict_type == '2'){
                if(this.planParam.restrict_num > 70000){
                    TipBoxService.open('最大调用次数不得超过七万',1)
                    return;
                }
            }else if(this.planParam.restrict_type == '3'){
                if(this.planParam.restrict_num > 300000){
                    TipBoxService.open('最大调用次数不得超过三十万',1)
                    return;
                }
            }else if(this.planParam.restrict_type == '4'){
                if(this.planParam.restrict_num > 90000){
                    TipBoxService.open('最大调用次数不得超过九十万',1)
                    return;
                }
            }else if(this.planParam.restrict_type == '5'){
                if(this.planParam.restrict_num > 1800000){
                    TipBoxService.open('最大调用次数不得超过一百八十万',1)
                    return;
                }
            }else if(this.planParam.restrict_type == '6'){
                if(this.planParam.restrict_num > 3600000){
                    TipBoxService.open('最大调用次数不得超过三百六十万',1)
                    return;
                }
            }
            this.planParam.expiry_start_date = this.startTime;
            this.planParam.expiry_end_date = this.endTime;
            this.$emit("sure", this.planParam);
            // console.log(this.planParam.restrict_type)
        }
    }
}
</script>
<style>
.chargePlan .el-dialog__title{
    display: inline-block;
    padding-top: 5px;
}
.chargePlan .el-input__inner{
    height: 30px;
    font-size: 12px;
}
.chargePlan .el-date-editor.el-input {
    width: 115px!important;
}
.chargePlan .el-radio__input.is-checked .el-radio__inner{
    background: #ffffff
}
.chargePlan .el-radio__inner{
    width: 12px;
    height: 12px;
}
.chargePlan .el-radio__inner::after{
    background-color:#20a0ff;
    width: 7px;
    height: 7px;
}
.chargePlan .el-dialog__header{
    width: 506px;
    padding: 10px 10px 10px;
    border-top-right-radius: 6px;
    border-top-left-radius: 6px;
}
.chargePlan .el-dialog__body{
    width: 506px;
    height: 320px;
    padding: 15px 15px;
}
.chargePlan .el-dialog{
    width: 506px;
    border-top-right-radius: 6px;
    border-top-left-radius: 6px;
}
.chargePlan .el-icon-close{
    font-size: 12px;
}
.chargePlan .dialog-footer .el-button:focus,.chargePlan .dialog-footer .el-button {
    color: #ffffff;
    float: left;
    height: 40px;
    border-radius: 0px;
    width: 50%;
}
.chargePlan .el-dialog__footer{
    padding: 0px;
}
.chargePlan .el-button.el-button{
    margin: 0px;
}
.chargePlan .el-button--primary{
    background-color: #7fa6f3;
    border-color: #7fa6f3;
}
.chargePlan .el-button--default{
    background-color: #e2e2e2;
    border-color: #e2e2e2;
}
.chargePlan .dialog-footer .el-button:hover {
    color: #ffffff;
    border-color: #7fa6f3;
    background-color: #7fa6f3;
}
/* .srBox .el-input{
    width: 264px;
    height: 28px;
} */
.chargePlan .srBoxHeight input{
    width: 264px;
    height: 30px;
}
.chargePlan .srcBoxLimit input{
    width: 122px;
    height: 30px;
}
.chargePlan .el-input__inner{
    font-size: 12px !important;
}
.chargePlan .titleBox span{
   line-height: 30px;
}
.chargePlan .srBox{
    line-height: 30px;
}
.srBSelectDropdown.el-select-dropdown {
  margin: 0;
  border-radius:4px;
}
.srBSelectDropdown .el-scrollbar__wrap {
  overflow: hidden;
  margin: 0 !important;
}
.srBSelectDropdown .el-select-dropdown__list {
  padding: 0;
}
.srBSelectDropdown .el-select-dropdown__item {
  font-size: 12px;
  border-bottom: 1px solid #f1f1f1;
  text-align:left;
}
/* 保存 取消按钮样式调整*/
.chargePlan .hsaHover .el-button--primary {
    background-color: #e2e2e2;
    border-color: #e2e2e2;
}
.chargePlan .hsaHover .el-button--default {
    color: #ffffff;
    border-color: #7fa6f3;
    background-color: #7fa6f3;
}
.dialog-footer{
    text-align: center;
     padding-bottom: 0px; 
}
</style>
<style src="../../css/servicesManage/collection.css" scoped></style>

