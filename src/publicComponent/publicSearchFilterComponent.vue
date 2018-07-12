<template>
    <div class="publicSearchFilterBox" id="publicSearchFilterBox" :class="{showAll:showAll}" :style="{height:boxHeight}">
        <span class="publicSearchFilterShowBtn" v-on:click="showBtnClickHandler"><i class="el-icon-arrow-down"></i></span>
        <div class="publicSearchFilterContainer">
            <div class="publicSearchFilterContainerContent">
                <div class="publicSearchFilterLine" v-for="(item,index) in data">
                    <span class="publicSearchFilterTitle">{{item.label}}</span>
                    <div class="publicSearchFilterContent">
                        <div v-if="item.inputType" class="publicSearchFilterInputContainer">
                            <input class="publicSearchFilterInput" :placeholder="item.inputType.placeholder" v-model="item.inputType.value" />
                            <button v-on:click="inputSearchHandler(item)" class="publicSearchBut"><i class="icon iconfont icon-sousuo"></i></button>
                        </div>
                        <div v-if="item.listData" class="publicSearchFilterListContainer" :class="{mSelect:item.mSelectState}">
                            <div v-show="!item.showSelectStr">
                                <div class="publicSearchFilterListItem" v-on:click="itemClickHandler(item,val)" :class="{select:val.active,all:val.all}" v-for="(val,listIndex) in item.listData.list">
                                    <i class="publicSearchFilterCheck"></i>{{val.name}}
                                </div>
                            </div>
                            <div v-show="item.showSelectStr"><div class="publicSearchFilterSlectStrContainer">
                                <span>{{item.selectStr}}</span><i class="publicSearchFilterSelectStrClose" v-on:click="closeSelctStrHandler(index)">x</i> </div>
                            </div>
                            <div class="publicSearchFilterScoreContainer" v-if="item.listData.score">
                                <span class="publicSearchFilterScoreTitle">{{item.listData.score.start.placeholder}}</span>
                                <input onkeyup="this.value=this.value.replace(/[^0-9\.]+/,'');" v-model="item.listData.score.start.value" class="publicSearchFilterSubInput" :placeholder="item.listData.score.start.placeholder" />
                                <span class="publicSearchFilterInputLine"></span>
                                <input onkeyup="this.value=this.value.replace(/[^0-9\.]+/,'');" class="publicSearchFilterSubInput" v-model="item.listData.score.end.value" :placeholder="item.listData.score.end.placeholder" />
                                <span class="publicSearchFilterSubBtn" v-on:click="okBtnClickHandler(item)">确定</span>
                            </div>
                            <div class="publicSearchFilterScoreContainer" v-if="item.listData.timer">
                                <span class="publicSearchFilterScoreTitle">{{item.listData.timer.title}}</span>
                                <el-date-picker
                                        v-model="item.listData.timer.startTime.value"
                                        type="date"
                                        :placeholder="item.listData.timer.startTime.placeholder">
                                </el-date-picker>
                                <span class="publicSearchFilterInputLine"></span>
                                <el-date-picker
                                        v-model="item.listData.timer.endTime.value"
                                        type="date"
                                        :placeholder="item.listData.timer.endTime.placeholder">
                                </el-date-picker>
                                <span class="publicSearchFilterSubBtn" v-on:click="okBtnClickHandler(item)">确定</span>
                            </div>
                            <div v-if="item.listData.mSelect" class="publicSearchFilterMselectContainer"><div v-on:click="mSelectHandler(index)" class="publicSearchFilterMselectBtn">+{{item.mSelectName}}</div></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import '../publicCss/publicSearchFilterComponent.css';
    export default {
        data: function() {
            return{
                showAll:false,
                boxHeight:"110px"
            }
        },
        created(){
            for(let i=0;i<this.data.length;i++){
                if(this.data[i].listData){
                    if(this.data[i].listData.mSelect){
                        this.data[i].mSelectState=false;
                        this.data[i].showSelectStr=false;
                        this.data[i].selectStr="";
                        this.data[i].mSelectName="多选";
                    }
                    if(this.data[i].listData.list && this.data[i].listData.list.length>0){
                        if(this.data[i].listData.list[0].name=="全部"){
                            this.data[i].listData.list[0].all=true;
                        }
                    }
                }
            }
        },
        props:{
            data:{}
        },
        methods:{
            mSelectHandler:function (index) {
                var obj=this.data[index];
                var select=obj.mSelectState;
                var selectStr="";
                if(select){
                    //obj.mSelectName="多选";
                    var mSelectNum=0;
                    var total=obj.listData.list.length-1;
                    if(total>0){
                        for(let i=0;i<obj.listData.list.length;i++){
                            var listObj=obj.listData.list[i];
                            if(listObj.active==true && listObj.all!=true){
                                selectStr+=listObj.name;
                                selectStr+=",";
                                mSelectNum++;
                            }
                            else if(listObj.all==true){
                                listObj.active=false;
                            }
                        }
                        if(mSelectNum>=1 && mSelectNum<total){
                            obj.selectStr=selectStr;
                            obj.showSelectStr=true;
                            obj.mSelectName="多选";
                            obj.mSelectState=false;
                        }
                        else if(mSelectNum==0){
                            obj.mSelectName="多选";
                            obj.selectStr="";
                            obj.mSelectState=false;
                        }
                        else if(mSelectNum==total){
                            for(let i=0;i<obj.listData.list.length;i++){
                                var listObj=obj.listData.list[i];
                                if(listObj.all==true){
                                   listObj.active=true;
                                }
                                if(listObj.active==true && listObj.all!=true){
                                   listObj.active=false;
                                }
                            }
                            obj.mSelectName="多选";
                            obj.selectStr="";
                            obj.mSelectState=false;
                        }
                        this.$emit("search",this.copyObj("multiselect",this.data));
                    }
                }
                else{
                    if(obj.showSelectStr==true){
                        obj.showSelectStr=false;
                        obj.mSelectState=true;
                        obj.selectStr='';
                        obj.mSelectName="确定";
                    }
                    else{
                        obj.mSelectName="确定";
                        obj.mSelectState=true;
                    }
                }
                //obj.mSelectState=!select;
                this.$set(this.data,index,obj);
            },
            itemClickHandler:function (item,val) {
                var list=item.listData.list;
                if(item.mSelectState){
                    val.active=!val.active;
                }
                else{
                    for(let i=0;i<list.length;i++){
                        list[i].active=false;
                    }
                    val.active=true;
                    this.$emit("search",this.copyObj("select",this.data));
                }

            },
            closeSelctStrHandler(index){
                var obj=this.data[index];
                obj.showSelectStr=false;
                obj.mSelectName="多选";
                obj.selectStr="";
                for(let i=0;i<obj.listData.list.length;i++){
                    var listObj=obj.listData.list[i];
                   if(i==0){
                       listObj.active=true;
                   }
                   else{
                       listObj.active=false;
                   }
                }
                this.$set(this.data,index,obj);
                this.$emit("search",this.copyObj("select",this.data));
            },
            okBtnClickHandler(data){
               if(data.listData.timer){
                   if(data.listData.timer.startTime.value!="" && data.listData.timer.endTime.value!=""){
                       var start=new Date(data.listData.timer.startTime.value).getTime();
                       var end=new Date(data.listData.timer.endTime.value).getTime();
                       data.listData.timer.startTime.value=start;
                       data.listData.timer.endTime.value=end;
                   }
               }
                this.$emit("search",this.copyObj("custorm",this.data));
            },
            showBtnClickHandler(e){
                this.showAll=!this.showAll;
                var height=0;
                if(this.showAll==true){
                    height=$("#publicSearchFilterBox .publicSearchFilterContainerContent").height();
                    this.boxHeight=height+"px";

                }
                else
                {
                    height=110;
                    this.boxHeight=height+"px";
                }
            },
            inputSearchHandler(data){
                this.$emit("search",this.copyObj("input",this.data));
            },
            copyObj(type,obj){
               var newObj=Object.assign({type:type},obj);
               return newObj;
            }
        }

    }
</script>