<template>
    <div class="tableControlBtnDiv">
        <div v-if="btnData.import" class="tableControlBtn import" v-on:click="btnData.import.fn">导入</div>
        <div v-if="btnData.export" class="tableControlBtn export" v-on:click="btnData.export.fn">导出</div>
        <div v-if="btnData.sentMsg" class="tableControlBtn sentMsg" v-on:click="btnData.sentMsg.fn">发送短信</div>
        <div v-if="btnData.resetPassword" class="tableControlBtn resetPassword" v-on:click="btnData.resetPassword.fn">重置密码</div>
        <div v-if="btnData.remove" class="tableControlBtn remove" v-on:click="btnData.remove.fn">删除</div>
        <div v-if="btnData.add" class="tableControlBtn add" v-on:click="btnData.add.fn">新建</div>
        <div v-if="btnData.addd" class="tableControlBtn add" v-on:click="btnData.addd.fn">添加</div>

        <div v-if="btnData.reject" class="tableControlBtn tableControlBtn2" v-on:click="btnData.reject.fn">驳回</div>
        <div v-if="btnData.pass" class="tableControlBtn tableControlBtn2" v-on:click="btnData.pass.fn">通过</div>
    </div>
</template>
<script>
    export default{
        props:{
            btnData:''
        }
    }
</script>