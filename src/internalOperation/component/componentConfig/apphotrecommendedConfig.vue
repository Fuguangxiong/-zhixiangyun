<template>
  <!-- 轮播图 -->
    <div class="domeConfig styleBorder " >
        <div class="seticon">
                             <i class="icon iconfont icon-bianji1"  @click="editData()"></i>
                    <i class="icon iconfont icon-shanchu" @click="deleDome()"></i>
                        </div>
                        <span class="domeTitle"><i></i><em>热门应用</em></span>
                        <div class="boxConConfig">
                            <div class="domeHotConfigCon">
                                <ul>
                                     <li v-for="time in arrTset"><img src="../../images/adClon.png" :alt="time.name"></li>
                                </ul>
                            </div>
                        </div>
    </div>
</template>
<script>
    export default{
    data () {
      return {
        props: ['childMsg'],
        listSize:4,
        arrTset:[],
       }
    },
    props: {
        childMsg: '', //这样可以指定传入的类型，如果类型不对，会警告
        lisize:{}
    },
    mounted(){

        this.listSize = this.childMsg.pageSize||4;
        this.listSizeImg();
    },
    watch: {
        lisize:function(val){
            console.info('bian1',this.childMsg.pageSize);
            this.listSize = this.childMsg.pageSize;
            this.listSizeImg();
        }
    },
    methods: {
         listSizeImg(){
           var that =this;
            that.arrTset = [];
           for(var i = 0; i<that.listSize;i++ ){
           
              var obj ={
                  name:"服务"
                }
              that.arrTset.push(obj);
             
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
.domeTitle i{
    width: 22px;
    height: 22px;
    float: left;
    background: url('../../images/hotImg.png') center no-repeat;
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
