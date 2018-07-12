<template>
  <span v-if="isShow()">
    <slot></slot>
  </span>
</template>
<script>
export default {
  name: 'privibutton',
  props: ['type'],
  data () {
    return {
      list: null
    }
  },
  created () {
    this.$root.$children[0].$children[0].hub.$on('getPriviData', (data) => {
      this.list = data
    })
    if (this.list === null) {
      this.list = this.$root.$children[0].$children[0].prividata
    }
  },
  methods: {
    isShow () {
      if (this.list) {
        // debugger
        for (var i = 0; i < this.list.length; i++) {
          var el1 = this.list[i]
          if (el1.menuName === this.type.name) {
            for (let j = 0; j < el1.sublist.length; j++) {
              const el2 = el1.sublist[j]
              if (el2.menuName === this.type.childrenName) {
                for (var k = 0; k < el2.button.length; k++) {
                  var btn = el2.button[k]
                  // console.log('btn', btn)
                  if (btn.code === this.type.code) {
                    return true
                  }
                }
                return false
              }
            }
          }
        }
      }
    }
  },
  mounted () {
    // console.log(this.type)
  }
}
</script>
<style lang="css" scoped>

</style>
