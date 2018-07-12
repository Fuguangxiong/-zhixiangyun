<template>
  <div class="publicContainer">
            <router-view></router-view>
  </div>
</template>
<script>
  export default {
    name: 'app',
    data () {
    	return {
  
    	}
    }
  }
</script>

<style>
@import "http://at.alicdn.com/t/font_484230_5xu207aik4jthuxr.css";
@import "./css/public.css";
.publicRightBottomContentContainer{
    background-color: #fff;
    overflow-y: auto;
}
.publicLeftChildrenTitle{
  padding-left: 20px;
}
.publicRightBottomContentContainer.welcome{
    background-image: url('./images/welcome.png');
    background-position: center;
    background-repeat: no-repeat;
}
.el-pagination{
  text-align: center;
}
.wordBlock .el-input--small .el-input__inner{
    height: 25px;
    color: #999999;
    font-size: 12px;
}


.eval .el-select-dropdown__item{
  height: 25px;
  padding: 3px 10px;
  color: #999999;
  border-bottom: 1px solid #f5f5f5;
  font-size: 12px;
}
.eval .el-select-dropdown__item.hover{
  background-color: transparent;
  color: #55a8fd;
}
.eval .el-select-dropdown__item.selected{
  color: #55a8fd;
  background-color: transparent;
}
.eval .el-select-dropdown__item.selected.hover{
    background-color: transparent;
}
.eval.el-select-dropdown{
      border-radius: 5px;
}
.eval .el-select-dropdown__item{
  text-align: left;
}



.eva .el-select{
  margin-top: 1px;
  width: 220px;
}
.eva .el-date-editor .el-input__inner{
  width: 115px;
}
.eva .el-select .el-input__inner{
  width: 220px;
}
.eva span .el-input__inner{
  width: 115px;
}
.eva .el-date-editor.el-input{
  width: 115px;
}
.eva .el-input__inner{
  border-color: #f1f1f1 ;
  height: 25px;
  font-size: 12px;
  color: #999999;
}
.eva .el-input__inner::-webkit-input-placeholder { /* WebKit*/  
    color: #999999;  
} 
.eval .el-scrollbar{
  width: 220px;
}

.wordBlock .el-input--small .el-input__inner::-webkit-input-placeholder{
    color: #999999;
}

input::-webkit-input-placeholder { /* WebKit*/  
    color: #999999;  
} 

.block{
  margin-top: 10px;
}
.appSpecialConfig .labelview .el-dialog__wrapper {
    z-index: 5000 !important;
}

.appBannerImgUrlText .el-radio__input.is-checked .el-radio__inner{
    border-color:#e5e5e5;
    background: #fff;
    width: 14px;
    height: 14px;
}
.appBannerImgUrlText .el-radio__inner{
   width: 14px;
    height: 14px;
}
.appBannerImgUrlText .el-radio__inner::after{
  background-color: #fa405c;
}
.appBannerImgUrlText .el-input__inner{
      height: 30px;
}


.appImgConfigBox .el-dialog .el-dialog__header,.appNavConfigcontent .el-dialog .el-dialog__header{
	padding: 10px 20px 6px;
}
.appImgConfigBox .el-dialog .el-dialog__header .el-dialog__headerbtn,.appNavConfigcontent .el-dialog .el-dialog__header .el-dialog__headerbtn{
  font-size: 14px;
}
.appNavConfigcontent .el-tag--primary{
  margin-bottom: 5px;
}
.timeLimitMian .temporaryL .temporaryTime .el-date-editor.el-input{
  width: 165px;
}
.timeLimitMian .temporaryL .temporaryTime .el-date-editor.el-input .el-input__inner{
  font-size: 12px;
}
.timeLimitMian .temporaryL .el-input__icon{
  top:3px;
}
</style>

