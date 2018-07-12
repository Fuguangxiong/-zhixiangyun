<template>
  <div id="app" class="publicAppContainer">
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: 'app',
  data () {
    return {
      clientHeight: this.fullHeight
    }
  }
}
</script>

