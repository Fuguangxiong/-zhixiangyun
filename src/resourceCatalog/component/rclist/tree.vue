<template>
  <div class="tree">
      <div class="title">
        <i class="iconfont" 
           :class="{'icon-jichushuju': treeData.name === '基础数据资源',
                    'icon-hulianwang': treeData.name === '互联网数据',
                    'icon-yewuyingyong': treeData.name === '业务应用数据',
                    'icon-yuanshujuguanli': treeData.name === '数据元标准',
                    'icon-zhuceguanli': (treeData.name === '数据查询' || treeData.name === '数据比对' || treeData.name === '人车布控')}"></i>
        <span>{{treeData.name}}</span>
      </div>
      <el-tree
        class="treeData"
        :data="treeData.children"
        node-key="id"
        ref="tree"
        default-expand-all
        @node-click="handleNodeClick"
        :filter-node-method="filterNode"
        :props="defaultProps">
      </el-tree>
  </div>
</template>
<script>
export default {
  name: 'tree',
  props: ['treeData'],
  data () {
    return {
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  created () {
    this.$parent.hub.$on('filterText', val => {
      this.$refs.tree.filter(val)
    })
  },
  methods: {
    handleNodeClick (data, node) {
      this.$emit('handleNodeClick', data, node)
    },
    filterNode (value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    }
  }
}
</script>
<style lang="css" scoped>
  .tree {
    width: 100%;
    height: 579px;
    float: left;
    overflow: hidden;
    /* margin-right: 22px; */
    /* margin-bottom: 15px; */
    background-color: #FAFDFF;
    border: 1px solid #ccc;
  }
  .tree:nth-of-type(3n) {
    margin-right: 0;
  }
  .title {
    font-size: 13px;
    font-weight: 700;
    height: 40px;
    line-height: 40px;
    padding-left: 12px;
    background-color: #EFF8FD;
  }
  .title i {
    color:#63ADFD;
    margin-right: 15px;
    font-weight: normal;
  }
  .treeData {
    margin-left: 40px;
    border: none;
    height: 537px;
    overflow-y: auto;

  }
  .treeData::-webkit-scrollbar{
    display: none;   
  }
</style>

<style>
  .el-tree-node__content {
    height: 30px;
    line-height: 30px;
    font-size: 13px;   
    font-weight: 700;
  }
  .el-tree-node__label {
    font-size: 13px;   
    font-weight: 700;
  }
  .el-tree-node__children .el-tree-node__label {
    font-size: 12px;
    font-weight: normal;
  }
  .el-tree-node__expand-icon {
    position: relative;
  }
  .tree .is-leaf {
      border:none;
      border-top-width:1px;
      border-bottom-width:1px;
      width: 9px;
      height: 1px;
      display: inline-block;
      background-color: #797979;
  }
</style>
