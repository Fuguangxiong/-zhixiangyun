<template>
  <div class="publicContent welcome">
	  <!-- <img src='../../images/service-main.png' /> -->
  </div>
</template>

<script>
export default {
  name: "welcomePage",
  components: {},
  data() {
    return {};
  },
  props: {},
  mounted() {
    var vm = this;
    vm.winResize();
    $(window).resize(function() {
      vm.winResize();
    });
  },
  methods: {
    winResize() {
      var winTop = $(".welcome").offset().top;
      var fullHeight = document.documentElement.clientHeight;
      $(".welcome").height(fullHeight - winTop - 22 - 5);
    }
  }
};
</script>
<style scoped>
.welcome {
  width: 100%;
  height: 100%;
  margin-top: 15px;
  background: #fff url("../../images/service-main.png") no-repeat center center;
  /* background: #fff; */
  /* box-shadow: 0 0 3px 2px #dedede; */
  border-radius: 2px;
}
.welcome>img{
	width:100%;
	height:100%;
}
</style>