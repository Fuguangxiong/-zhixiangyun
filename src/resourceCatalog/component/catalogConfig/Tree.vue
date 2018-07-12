<template>
<div class="tree-cont fl">
  <el-tree  :data="data"
            node-key="id" 
            ref="tree"
            highlight-current 
            :props="defaultProps" 
            :default-expanded-keys="defaultExpanded" 
            default-expand-all 
            @node-click="handleNodeClick" 
            v-loading="treeLoad"></el-tree>
</div>
</template>

<script>
export default {
  name: 'tree',
  props: ['data', 'defaultProps', 'treeLoad', 'defaultExpanded'],
  components: {
  },
  data () {
    return {

    }
  },
  methods: {
    handleNodeClick (data, node) {
      this.$emit('changeNode', node, this.$refs.tree._data.root)
    }
  }
}

</script>
<style scoped>
.el-tree {
      border: 0px solid #d1dbe5; 
}
</style>

