<template>
  <div id='overlay'>
    <span title="关闭" @click='close'></span>
    <img :src='picUrl' :class="{'long-img':vertical}" ref="image"/>
  </div>  
</template>
<script>
export default {
  name: 'picturnEnlarge',
  props: {
    imgsource: '',
    close: Function,
    direction: ''
  },
  data () {
    return {
      picUrl: '',
      vertical: false
    }
  },
  mounted () {
    var overlay = document.getElementById('overlay')
    overlay.setAttribute('style', 'height:' + window.innerHeight + 'px; ' + 'width:' + window.innerWidth + 'px')
    this.picUrl = this.imgsource
    var that = this
    var image = new Image()
    image.src = this.picUrl
    image.onload = function () {
      let width = image.width
      let height = image.height
      if (width > height) {
        that.vertical = false
      } else {
        that.vertical = true
      }
    }
  }
}
</script>
<style scoped>
  body {
    border: 0;
    margin: 0;
    font-family: 'Avenir', sans-serif;
    background-image: linear-gradient(to top, #dfe9f3 0%, white 100%);
    box-sizing: border-box;
  }
  #app {
    width: 100vw;
    min-height: 100vh;
  }
  img {
    width: 100%;
  }
  #overlay {
    position: fixed;
    width: 100vw;
    /* height: 100vh; */
    background-color: rgba(0, 0, 0, 0.7);
    top: 0;
    left: 0;
    z-index: 999;
  }
  #overlay img {
    height: 45%;
    width: auto;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);  
  }
  #overlay .long-img {
    height: 90%;
    width: auto;
    position: absolute;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
  }
  #overlay span{
    position: absolute;
    top: 0px;
    right: 0px;
    width: 48px;
    height: 48px;
    display: block;
    padding: 0 0 10px 10px;
    box-sizing: content-box;
    background: url('../../images/em-close.png') no-repeat content-box;
    cursor: pointer;
  }
  #overlay span:hover{
    background: url('../../images/em-close1.png') no-repeat content-box;
  }
  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
</style>
