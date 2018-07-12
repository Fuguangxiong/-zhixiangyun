<template>
    <div v-show="boxOpen" class="overlay">
        <div class="transferBox">
            <div class="transferBoxTitleContainer">
                <div class="transferBoxTitle">企业审核详情</div>
                <i class="transferBoxClose" v-on:click="closeHandler"></i>
            </div>
            <div class="transferBoxSearchContainer approlDetail">
                <div v-for="(item,index) in data" class="approlDetailList">
                    <div class="approDetailListPot"></div>
                    <div class="approDetailListTimeContainer">
                        <span class="approDetailListYear">{{item.date}}</span><span class="approlDetailListTime">{{item.time}}</span>
                    </div>
                    <div class="approlDetailListContent">{{item.content}}</div>
                </div>
            </div>
            <div class="transferBoxBtnContainer">
                <div class="publicBtn green" v-on:click="closeHandler">确定</div>
            </div>
        </div>
    </div>
</template>
<script>
    import '../css/componentCss/transferComponent.css';
    export default{
        props:{
            open:{},
            data:{},
        },
        watch:{
            open(val,oldVal){
                this.boxOpen=true;
            },
        },
        data:function () {
            return{
                boxOpen:false,
            }
        },
        methods:{
            closeHandler(){
                this.boxOpen=false;
            },
        }
    }
</script>