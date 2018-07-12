<template>
  <!-- 轮播图 -->
    <div class="domeConfig styleBorder "   >
        <div class="seticon">
            <i class="icon iconfont icon-bianji1"  @click="editData()"></i>
            <i class="icon iconfont icon-shanchu" @click="deleDome()"></i>
        </div>
        <div class="boxConConfig">
            <div class="domeFigureConfigCon">
                <img src="../../images/configmode1bg.jpg" alt="">
            </div>
        </div>
    </div>
</template>
<script>
  export default{
    data () {
      return {
        props: ['childMsg'],
       }
    },
    props: {
        childMsg: '' //这样可以指定传入的类型，如果类型不对，会警告
    },
    mounted(){
        
    },
    methods: {
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
.domeFigureConfigCon img{
   width: 100%;
}
.domeConfig{
    margin-bottom: 10px;
}

.styleBorder{
    border: 1px #e3e3e3 dashed;
    position: relative;
    padding-top: 38px;
    box-sizing: border-box;
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
</style>
