<template>
    <ul class="tab-links-v fl">
        <li class="tab-link" v-bind:class = "{ active: checked == index }" v-for="(item, index) in tabs" :key="item.name" @click="changeTab(item.id, item.name, index)" :title="item.name"><span>{{item.name}}</span></li>
    </ul>
</template>
<script>
export default {
  name: 'leftTab',
  props: ['tabs'],
  data () {
    return {
      checked: 0
    }
  },
  methods: {
    changeTab (id, name, index) {
      this.checked = index
      this.$emit('changeTab', id, name)
    }
  },
  watch: {
    tabs: function (val, oldVal) {
      if (val.length > 0) {
        this.checked = 0
        this.$emit('changeTab', val[0].id, val[0].name)
      }
    }
  }
}
</script>

