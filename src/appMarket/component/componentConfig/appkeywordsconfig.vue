<template>
  <!-- 轮播图 -->
    <div class="domeConfig styleBorder ">
        <div class="seticon">
                            <i class="icon iconfont icon-bianji1"  @click="editData()"></i>
                    <i class="icon iconfont icon-shanchu" @click="deleDome()"></i>
                        </div>
                        <span class="domeTitle"><i></i><em>精彩专题</em></span>
                        <div class="boxConConfig">
                            <div class="domeHotConfigCon">
                                <div class="imglin">
                                    <img src="../../images/zhuti.jpg" alt="">
                                    </div>
                            </div>
                        </div>
    </div>
</template>
<script>
  export default{
    data () {
      return {
        props: ['childMsg'],
        listSize:8,
       }
    },
    props: {
        childMsg: '' //这样可以指定传入的类型，如果类型不对，会警告
    },
    mounted(){
        
    //    alert(1);
    },
    methods: {
        listSizeImg(){
            alert(this.listSize)
           for(var i = 0; i<this.listSize;i++ ){
               alert(1);
           }
        },
       deleDome(){
           this.$emit('upup',this.childMsg.code);
       },
      editData(){
        
           this.$root.eventHub.$emit('comtiem', this.childMsg,true)
    }
  }
  }
</script>

<style scoped>
.boxConConfig{
    padding: 10px;
}
.seticon{
    position: absolute;
    right: 7px;
    top:10px;
}
.seticon i{
    cursor: pointer;
    margin-left: 15px;
    color: #9a9a9a;
}
.seticon i:hover{
    color: #56a9fd;
}
.domeTitle{
    position: absolute;
    left: 10px;
    top:8px;
}
.domeTitle em{
    font-size: 14px;
    font-weight: bold;
    float: left;
    margin-top: 3px;
    margin-left: 3px;
    font-style: normal;
}
.imglin{
  
}
.imglin img{
    width: 100%;
}
.domeTitle i{
    width: 22px;
    height: 22px;
    float: left;
    background: url('../../images/zhutiicon.png') center no-repeat;
}

.domeHotConfigCon ul{
    overflow: hidden;
}
.domeHotConfigCon ul li{
    float: left;
    width: 25%;
    padding: 0 6px;
   
}
.domeHotConfigCon ul li img{
   
    width: 100%;
}
</style>
