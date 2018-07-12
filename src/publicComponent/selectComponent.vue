<template>
  <div>
    <span class="componentSelectBtn " v-on:mousedown="selectHandler" v-bind:class="{ select: message}"></span>
  </div>
</template>
<script>
  export default{
      props:{
          message:{
              type:Boolean,
              default: false
          },
          index:{

          }
      },
      data:function () {
        return {
            select:this.message
        }
      },
      methods:{
        selectHandler(e){
          console.log(8);
          e.stopPropagation();

          if(this.message==true)
              this.select=false;
          else
              this.select=true;
          var obj=new Object();
          obj.select=this.select;
          obj.index=this.index;
          this.$emit('stateChange',obj);
        }
      }
  }
</script>
<style style="" scoped>
  .componentSelectBtn {
    display: inline-block;
    width: 13px;
    height: 13px;
    border: 1px solid #ececec;
    cursor: pointer;
  }
  .componentSelectBtn.select{
    background-size:cover;
    width: 17px;
    height: 17px;
    background-image: url("../publicImages/checkbox.png");
    border:none;
    background-repeat: no-repeat;
  }
</style>
