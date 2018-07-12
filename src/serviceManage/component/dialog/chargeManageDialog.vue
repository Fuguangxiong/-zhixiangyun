<template>
  <div class="chargeManageDialog">
      <el-dialog title="方案分组管理" @close='onCancle' :visible.sync="isShow" :close-on-click-modal="false" width='90%'>
        <div class="groupBox">
           <div v-for="(group,index) in groupInfo" :key="index" class="group" @mouseover="over(group)" @mouseout="out(group)" @click="chooseGroup(index)" :class="{active:group.isChoose,hover:group.hover}">
               <span v-show="!group.isAdd">{{group.scheme_group_name}}</span>
               <input placeholder="请输入分组名称" v-model="group_name" v-if="group.isAdd" type="text" @keyup.stop="addGroup($event,index)">
               <div>
                    <span v-show="group.isAdd" class="icon iconfont icon-delete-black" @click="resetAdd(index)"></span>
                    <i v-show="!group.isAdd" @click="groupEdit(index)" class="icon iconfont icon-bianji"></i>
                    <i v-show="!group.isAdd" @click="groupDel(group)" class="icon iconfont icon-delete-black"></i>
               </div>
           </div>
           <div class="group groupAdd" @click="groupAdd()">
               <span class="icon iconfont icon-iconjia"></span>
           </div>
        </div>
      <div slot="footer" class="dialog-footer" :class='{hsaHover:setStyleHover}'>
        <el-button @click="saveGroup()" type="primary">保 存</el-button>
        <el-button @click="onCancle" @mouseenter.native='setStyle(true)' @mouseleave.native='setStyle(false)'>取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import apiClient from "../../../publicJs/ApiClient.js";
import commonFunc from "../common/commonFunc.js";
import TipBoxService from "../common/TipBoxService.js";
import LoadingBoxService from '../../../publicJs/LoadingBoxService.js'
export default {
    props: {
        isShow: {},
        groupInfo:{}
    },
    data: function(){
        return{
            setStyleHover:false,
            group_name: '',
            group_order:'',
            groupIndex:'',
        }
    },
    methods:{
        setStyle(status){
            this.setStyleHover = status;
            console.log(status)
        },
        onCancle: function(){
            if(this.groupInfo.length!=0 && this.groupInfo[this.groupInfo.length-1].id == undefined){
                this.groupInfo.splice(this.groupInfo.length-1,1);
                this.groupIndex = "";
            }
            this.$emit("cancle", false);
        },
        over(group){
           group.hover = true;
        },
        out(group){
            group.hover = false;
        },
        chooseGroup: function(e){
            for(var i = 0 ; i < this.groupInfo.length ; i ++){
                if(this.groupInfo[i].isAdd){
                    return;
                }
            }
            if(this.groupInfo[e] != undefined){
                if(this.groupInfo[e].isChoose){
                    this.groupInfo[e].isChoose = false;
                }else{
                    for(var i = 0 ; i < this.groupInfo.length ; i ++){
                        this.groupInfo[i].isChoose = false;
                    }
                    this.groupInfo[e].isChoose = true;
                }
            }
        },

        groupEdit: function(e){
             var that = this;
            for(var i = 0 ; i < this.groupInfo.length ; i ++){
                this.groupInfo[i].isChoose = false;
                if(this.groupInfo[i].isAdd && this.groupInfo[i].scheme_group_name != undefined){
                    TipBoxService.open('请先取消已有编辑状态',2);
                    return;
                }
            }

            console.info("fdfdf",this.groupInfo)
            this.groupIndex = e;
            this.groupInfo[e].isAdd = true;
            this.group_name = this.groupInfo[e].scheme_group_name;
        },
        groupAdd: function(){
            var that = this;
            for(var i = 0 ; i < this.groupInfo.length ; i ++){
                this.groupInfo[i].isChoose = false;
                if(this.groupInfo[i].isAdd && this.groupInfo[i].scheme_group_name != undefined){
                    TipBoxService.open('请取消当前修改再进行添加',2);
                    return;
                }
                if(this.groupInfo[i].isAdd && this.groupInfo[i].scheme_group_name == undefined){
                    TipBoxService.open('请填写当前分组信息',2);
                    return;
                }
            }
            var obj = {isAdd:false};
            this.group_name = '';
            that.groupIndex = that.groupInfo.length;
            that.groupInfo.push(obj);
            that.groupInfo[that.groupInfo.length-1].isAdd = true;
            //focus到新增的框中
            this.$nextTick(function(){
                $(".groupAdd").prev().find('input').focus()
            })           
        },
        resetAdd: function(e){
            if(this.groupInfo[e].id != undefined){

                this.groupInfo[e].isAdd = false;
            }else{
                this.groupInfo.splice(e,1);
            }
            this.groupIndex = '';
        },
        groupDel: function(obj){
            this.$emit("groupdel",obj)
        },
        addGroup: function(ev,i){
            if(ev.keyCode == 13){
                var that = this;
                that.group_order = that.groupInfo.length;
                if(that.groupInfo[i].id != undefined){
                    that.upDateGroup(i);
                }else{
                    that.insertGroup(i);
                }
            }
        },
        saveGroup: function(){
            var that = this;
            if(that.groupIndex !== ''){
                that.group_order = that.groupInfo.length;
                if(that.groupInfo[that.groupIndex].id != undefined){
                    that.upDateGroup(that.groupIndex);
                }else{
                    that.insertGroup(that.groupIndex);
                }
            }else{
                this.onCancle();
            }
        },
        insertGroup: function(i){
            var that = this;
            var myData = {};
            if(that.group_name.length > 10){
                TipBoxService.open("分组名称不能超过10个字符",1);
                return;
            }
            myData = {group_name:that.group_name,seq_num:that.group_order}
            if(this.group_name == ''){
                TipBoxService.open('请填写分组信息',2);
            }else{
                LoadingBoxService.open('请稍候......')
                apiClient.post('itsmApi/feeSchemeGroup/insertSchemeGroup', myData, function(data) {
                    LoadingBoxService.close();
                    if(data.status == 200){
                        that.$emit("getGroupList");  
                        that.groupInfo[i].isAdd = false; 
                        TipBoxService.open('添加成功');
                        that.onCancle();
                    }else{
                        TipBoxService.open(data.exception,2);
                    }
                    that.groupIndex = '';
                }).catch(e => {
                    if (e.response && e.response.status === 503) {
                        TipBoxService.open(e.response.data.exception,2)
                        LoadingBoxService.close()
                    }
                    throw e
                })
            }
        },       
        upDateGroup: function(i){
            var that = this;
            var myData = {};
            if(that.group_name.length > 10){
                TipBoxService.open("分组名称不能超过10个字符",1);
                return;
            }
            myData = {
                        input_group_name:that.group_name,
                        group_id:that.groupInfo[i].id,
                        belong_type:that.groupInfo[i].belong_type,
                        id:"",
                    }
            if(that.groupInfo[i].belong_type != "PERSONAL"){
                myData.id = that.groupInfo[i].enterprise_id
            }else{
                myData.id = that.groupInfo[i].user_id
            }
            LoadingBoxService.open('请稍候......')
            apiClient.post('itsmApi/feeSchemeGroup/editSchemeGroup', myData, function(data) {
                LoadingBoxService.close();
                if(data.status == 200){
                    that.$emit("getGroupList");    
                    TipBoxService.open('修改成功');
                    that.onCancle();
                }else{
                    TipBoxService.open(data.exception,2);
                }
                that.groupIndex = '';
            }).catch(e => {
                if (e.response && e.response.status === 503) {
                    TipBoxService.open(e.response.data.exception,2)
                    this.groupInfo[i].isAdd = false;
                    LoadingBoxService.close()
                }
                throw e
            })
        },

    }
}
</script>
<style src="../../css/servicesManage/collection.css" scoped></style>
<style>
.chargeManageDialog .el-dialog__title{
    display: inline-block;
    padding-top: 5px;
}
.chargeManageDialog .el-dialog__header{
    width: 506px;
    padding: 10px 10px 10px;
    border-top-right-radius: 6px;
    border-top-left-radius: 6px;
    line-height: 22px;
    box-sizing: border-box;
}
.chargeManageDialog .el-dialog__body{
    width: 506px;
    height: 320px;
    padding: 15px 15px;
}
.chargeManageDialog .el-dialog{
    width: 506px;
    border-top-right-radius: 6px;
    border-top-left-radius: 6px;
}
.chargeManageDialog .el-icon-close{
    font-size: 12px;
}
.chargeManageDialog .dialog-footer .el-button:focus,.chargeManageDialog .dialog-footer .el-button {
    color: #ffffff;
    float: left;
    height: 40px;
    border-radius: 0px;
    width: 50%;
}
.chargeManageDialog .el-dialog__footer{
    padding: 0px;
}
.chargeManageDialog .el-button.el-button{
    margin: 0px;
}
.chargeManageDialog .el-button--primary{
    background-color: #7fa6f3;
    border-color: #7fa6f3;
}
.chargeManageDialog .el-button--default{
    background-color: #e2e2e2;
    border-color: #e2e2e2;
}
.chargeManageDialog .dialog-footer .el-button:hover {
    color: #ffffff;
    border:#7fa6f3;
    background-color: #7fa6f3;
}
.groupBox .group{
    height: 32px;
}
.groupBox .group.hover {
  border: #74a6fa;
  box-shadow: 0px 0px 1px 2px #74a6fa;
}
.groupBox .group.hover div i{
    display: inline-block;
    margin-left: 3px;
    margin-right: 3px;
}

.chargeManageDialog .hsaHover .el-button--primary {
    background-color: #e2e2e2;
    border-color: #e2e2e2;
}
.chargeManageDialog .hsaHover .el-button--default {
    color: #ffffff;
    border-color: #7fa6f3;
    background-color: #7fa6f3;
}
</style>


