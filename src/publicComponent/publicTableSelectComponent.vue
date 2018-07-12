<template>
   <div class="publicTableSelectBox">
      <div class="publicTableSelectLeftContainer">
         <div class="publicTableSelectItem" :class="{active:item.active,icon:item.icon}" v-for="(item,index) in leftData" v-on:click="itemClickHandler(item,$event)">
            <span class="publicTableSelectItemName">{{item.name}}</span>
            <span class="publicTableSelectItemIconContainer" v-if="item.icon">
               <i class="publicTableSelectItemUpIcon iconfont" v-show="!item.down"></i>
               <i class="publicTableSelectItemDownIcon iconfont" v-show="item.down"></i>
            </span>
            <span class="publicTableSelectItemIconContainer childrenIcon" v-if="item.children">
               <i class="publicTableSelectItemChildrenIcon iconfont"></i>
            </span>
            <div class="publicTableSelectChildrenContainer" v-if="item.children" v-show="item.open">
               <div class="publicTableSelectChildrenItem" :class="{active:val.active}" v-for="(val,index2) in item.children" v-on:click="secondItemClickHandler(item,val)">
                  <span class="publicTableSelectItemName">{{val.name}}</span>
                  <span class="publicTableSelectItemIconContainer" v-if="val.icon">
                     <i class="publicTableSelectItemUpIcon iconfont" v-show="!val.down"></i>
                     <i class="publicTableSelectItemDownIcon iconfont" v-show="val.down"></i>
                  </span>
               </div>
            </div>
         </div>
      </div>
      <div class="publicTableSelectRightContainer">
         <div v-show="!showMore">
            <div class="publicTableSelectPageContainer">
               <span><span class="publicTableSelectColor">{{currentPage}}</span>/{{totalPage}}</span>
            </div>
            <div class="publicTableSelectControlContainer">
               <span class="publicTableSelectPageBtn" v-on:click="pageChangeClickHandler('prew')"><</span>
               <span class="publicTableSelectPageBtn" v-on:click="pageChangeClickHandler('next')">></span>
               <span class="publicTableSelectMoreBtnContainer icon iconfont icon-caozuo" v-on:click="moreBtnClickHandler">
               </span>
            </div>
         </div>
         <div v-show="showMore">
            <div class="publicTableSelectDelBtn" v-on:click="deletBtnHandler">删除</div>
            <div class="publicTableSelectCancleBtn" v-on:click="noShowMoreHandler">取消</div>
         </div>
      </div>
   </div>
</template>
<script>
    import '../publicCss/publicTableSelectComponent.css';
    export default {
        data:function () {
            return{
               showMore:false
            }
        },
        props:{
            leftData:{},
            currentPage:{},
            totalPage:{}
        },
        methods:{
            itemClickHandler(item,event){
                var that=this;
                   if(item.children){
                       event.stopPropagation();
                       var open=!item.open;
                       if(open==true){
                           $(window).unbind("click").bind("click",function (e) {
                               item.open=false;
                           })
                       }
                       else{
                           $(window).unbind("click");
                       }
                       item.open=open;
                   }
                   else if(item.children!=true && item.icon!=true)//点击智能
                   {
                     for(let i=0;i<this.leftData.length;i++){
                         if(this.leftData[i].active==true){
                             this.leftData[i].active=false;
                             if(this.leftData[i].children){
                                 this.setChildrenFlase(this.leftData[i].children);
                             }
                             break;
                         }
                     }
                     item.active=true;
                       this.$emit("sortChange",item);
                   }
                   else{
                       for(let i=0;i<this.leftData.length;i++){
                           if(this.leftData[i].active==true){
                               if(this.leftData[i]==item){
                                  item.down=!item.down;
                               }
                               else{
                                   this.leftData[i].active=false;
                                   if(this.leftData[i].children){
                                       this.setChildrenFlase(this.leftData[i].children);
                                   }
                                   item.active=true;
                                   break;
                               }
                           }
                       }
                       this.$emit("sortChange",item);
                   }

            },
            secondItemClickHandler(parent,child){
                var childrenList=parent.children;
                var find=false;
                for(let i=0;i<childrenList.length;i++){
                    if(childrenList[i].active==true){
                        if(childrenList[i]==child){
                           child.down=!child.down;
                        }
                        else
                        {
                           childrenList[i].active=false;
                           child.active=true;
                        }
                        find=true;
                        break;
                    }
                }
                if(find==false){
                    for(let i=0;i<this.leftData.length;i++){
                        if(this.leftData[i].active==true){
                            this.leftData[i].active=false;
                            child.active=true;
                            parent.active=true;
                            break;
                        }
                    }
                }
                this.$emit("sortChange",child);
            },
            setChildrenFlase(list)
            {
                for(let i=0;i<list.length;i++){
                    list[i].active=false;
                }
            },
            pageChangeClickHandler(type){
                if(type=="prew"){
                    this.$emit("pageChange","prew");
                }
                else if(type=="next"){
                    this.$emit("pageChange","next");
                }
            },
            moreBtnClickHandler(){
                //console.info("fdfdfdf");
                this.showMore=true;
            },
            noShowMoreHandler(){
                this.showMore=false;
            },
            deletBtnHandler(){
                this.$emit("delet");
            }
        }
    }
</script>