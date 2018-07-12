<template>
  <transition name="fade">
    <div class="overlay" v-show="open">
      <div class="rc_popupBox">
        <div class="popupBoxHeader">审批<i class="popupBoxCloseIconBtn" v-on:click="closeBoxHandler"></i> </div>
        <div class="rc_popupBoxBody" v-bind:class="{noBottomPadding:tipShow}">
          <div class="popupBoxLine" style="text-align: left;">
            <span class="approveTitle">审批：</span>
            <div v-for="(item,index) in radioData" class="css-radio" v-bind:class="{active:item.active}" v-on:click="radioClickHandler(index)"><i></i><span>{{item.name}}</span></div>
          </div>
          <div class="popupBoxLine" style="text-align: left;" v-show="tipShow">
            <span class="approveTitle"><span class="publicRedColor">*</span> 备注：</span>
            <textarea v-on:keyup="textChangeHandler" v-model="reason" class="approvalText" placeholder="输入20字以内"></textarea>
            <p class="approvalBoxTipMsg">{{tipMsg}}</p>
          </div>
        </div>
        <div class="rc_popupBoxBtnContainer">
          <div class="popupBoxBtn" v-on:click="closeBoxHandler">取消</div>
          <div class="popupBoxBtn redBg" v-on:click="boxOkHandler">确定</div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
  import TipBoxService from '../publicJs/TipBoxService.js'
  export default{
    props:{
        openNum:{

        },
    },
    data:function () {
      return {
        open:false,
        tipShow:false,
        reason:'',
        tipMsg:'',
        radioData:[{name:"通过",active:true},{name:"不予通过",active:false}],
        approvalRadio:2
      }
    },
    watch:{
        openNum(val,oldVal){
            this.open=true;
        }
    },
    methods:{
      radioClickHandler(index){
          //console.info("item=",item);
        var arr=this.radioData;
        for(var i=0;i<arr.length;i++){
            var obj=arr[i];
            if(obj.active==true){
                obj.active=false;
                break;
            }
        }
        arr[index].active=true;
        if(index==0){
          this.tipShow=false;
          this.tipMsg="";
          this.approvalRadio=2;
          this.reason="";
        }
        else{
          this.tipShow=true;
          this.tipMsg="不予通过，备注为必填";
          this.approvalRadio=3;
        }
      },
      closeApplyBoxHandler(){

      },
      closeBoxHandler(){
        this.open=false;
        this.radioClickHandler(0);

      },
      textChangeHandler(){

      },
      boxOkHandler(){
        if(this.tipShow==true){
            if(this.reason.length==0){
                this.tipMsg="请填写备注";
            }
            else if(this.reason.length>20){
              this.tipMsg="请输入20个字以内";
            }
            else if(this.reason.length>0 && this.reason.length<=20){
              var obj={reviewstatus:this.approvalRadio,reviewnotes:this.reason};
              this.$emit('change',obj);
              this.open=false;
              this.radioClickHandler(0);
            }
        }
        else {
          var obj={reviewstatus:this.approvalRadio,reviewnotes:this.reason};
          this.$emit('change',obj);
          this.open=false;
          this.radioClickHandler(0);
        }
      },

    }
  }
</script>
<style scoped>
  .approveTitle{
    font-size: 14px;
    color: #333;
    width: 55px;
    text-align: right;
    display: inline-block;
    vertical-align: top;
  }
  .popupBoxLine{
    color: #333;
    padding: 10px 0;
  }
  .css-radio{
    display: inline-block;
    position: relative;
    margin-right: 30px;
    cursor: pointer;
  }
  .css-radio i{
    background:url("../serviceManage/images/radio.png") no-repeat;
    width: 12px;
    height: 12px;
    display: inline-block;
    vertical-align: middle;
    margin-right: 4px;
  }
  .css-radio span{
    display: inline-block;
    vertical-align: middle;
    font-size: 14px;
  }
  .css-radio.active i{
    background-position: 0 -13px;
  }
  .approvalText{
    width: 238px;
    height: 60px;
    padding: 10px;
    color: #333;
    font-size: 12px;
  }
  .rc_popupBox{
    margin-top: -120px;
  }
  .approvalBoxTipMsg{
    font-size: 12px;
    height: 20px;
    line-height: 20px;
    margin-top: 10px;
    text-indent: 62px;
    color: #b61717;
  }
  .rc_popupBoxBody.noBottomPadding{
    padding-bottom: 0px;
  }
</style>
