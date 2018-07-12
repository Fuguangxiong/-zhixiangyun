<template>
  <div class="commonnav" @mouseleave="closemenu" v-bind:class="{ vartical: show }">
    <i class="iconfont icon-mulu_" @click="toggleDetail(type)"></i>
      <span v-if="verifyPermission('009001001')" class="item" v-bind:class="{ vartical: show, active: type == 'data'}" @click="changeLable('data')" @mouseenter="showmenu1('data')">数据</span>
      <span v-if="verifyPermission('009001002')" class="item" v-bind:class="{ vartical: show, active: type == 'interface'}" @click="changeLable('interface')" @mouseenter="showmenu1('interface')">接口</span>
      <span v-show="catalogShow" class="item" v-bind:class="{ active: type == 'service' }" @click="changeLable('service')">服务</span>
      <span v-if="verifyPermission('009001003')" class="item" v-bind:class="{ vartical: show, active: type == 'standard'}" @click="changeLable('standard')" @mouseenter="showmenu1('standard')">标准</span>
    <div class="commonTableSearch" v-show="!show" v-if="!catalogShow">
        <i class="commonTableSearchIcon iconfont icon-sousuo"></i>
        <input type="text" placeholder="请输入菜单关键字" v-model="filterText" class="commonTableSearchInput">
    </div>
    <ul class="menu1" v-show="ismenu1">
      <li v-for="(item,index) in treeData" :key="index" :class="{last:!item.children.length}" @mouseenter="showmenu2(item)">{{item.name}}</li>  
    </ul>
    <ul class="menu2" v-show="ismenu2">
      <li v-for="(item,index) in datamenu2" @click="handleNodeClick(item)" :class="{last:!item.children.length}" :key="index" @mouseenter="showmenu3(item)">{{item.name}}</li>
    </ul>
    <ul class="menu3" v-show="ismenu3">
      <li v-for="(item,index) in datamenu3" @click="handleNodeClick(item)" :class="{last:!item.children.length}" :key="index" @mouseenter="showmenu4(item)">{{item.name}}</li>
    </ul>
    <ul class="menu4" v-show="ismenu4">
      <li v-for="(item,index) in datamenu4" @click="handleNodeClick(item)" class="last" :key="index">{{item.name}}</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'lableList',
  props: ['type', 'show', 'treeData', 'catalogShow'],
  data () {
    return {
      keyword: '',
      ismenu1: false,
      ismenu2: false,
      ismenu3: false,
      ismenu4: false,
      datamenu2: [],
      datamenu3: [],
      datamenu4: [],
      filterText: ''
    }
  },
  methods: {
    handleNodeClick (data) {
      this.$emit('handleNodeClick', data)
      this.closemenu()
    },
    toggleDetail (type) {
      this.$emit('toggleDetail', type)
      this.closemenu()
    },
    changeLable (type) {
      if (this.show) return
      this.$emit('changeLable', type)
    },
    showmenu1 (type) {
      this.$emit('showmenu1', type)
      if (this.show) {
        this.ismenu1 = true
        this.ismenu2 = false
        this.ismenu3 = false
        this.ismenu4 = false
      }
    },
    showmenu2 (item) {
      this.datamenu2 = []
      if (item.children.length === 0) return
      this.ismenu1 = true
      this.ismenu2 = true
      this.ismenu3 = false
      this.ismenu4 = false
      this.datamenu2 = item.children
    },
    showmenu3 (item) {
      this.datamenu3 = []
      if (item.children.length === 0) return
      this.ismenu1 = true
      this.ismenu2 = true
      this.ismenu3 = true
      this.ismenu4 = false
      this.datamenu3 = item.children
    },
    showmenu4 (item) {
      this.datamenu4 = []
      if (item.children.length === 0) return
      this.ismenu1 = true
      this.ismenu2 = true
      this.ismenu3 = true
      this.ismenu4 = true
      this.datamenu4 = item.children
    },
    closemenu () {
      this.ismenu1 = false
      this.ismenu2 = false
      this.ismenu3 = false
      this.ismenu4 = false
    }
  },
  watch: {
    filterText (val) {
      // console.log(this.$parent)
      this.$parent.hub.$emit('filterText', val)
      // this.$emit('filterdata',val)
      // this.$refs.tree.filter(val)
    }
  }
}
</script>
<style src="../../css/default.css" scoped></style>
<style scoped>
.commonnav {
  margin-bottom: 12px;
  position: relative;
}
.commonnav.vartical {
  position: absolute;
  left: 0;
  width: 50px;
  text-align: center;
  /* border: 1px solid #ccc; */
  height: 100%;
  box-shadow: none;
  background-color: #F4F9FF;
}
.commonnav i.icon-mulu_ {
  display: inline-block;
  width: 49px;
  height: 45px;
  font-size: 30px;
  color: #fff;
  background-color: #63ADFD;
  border: 1px solid #ccc;
  cursor: pointer;
  float: left;
  text-align: center;
}
.commonnav.vartical .item {
  width: 100%;
  height: 50px;
  line-height: 50px;
  border: 1px solid #ccc;
  border-top: none;
}
.commonnav .menu1,.commonnav .menu2,.commonnav .menu3,.commonnav .menu4 {
  position: absolute;
  left: 48px;
  top: -1px;
  bottom: 0;
  z-index: 99;
  background-color: #EDF5FE;
  border: 1px solid #ccc;
}
.commonnav .menu2 {
  left: 239px;
}
.commonnav .menu3 {
  left: 430px;
}
.commonnav .menu4 {
  left: 620px;
}
.commonnav .menu1 li,.commonnav .menu2 li,.commonnav .menu3 li,.commonnav .menu4 li {
  width: 190px;
  height: 50px;
  line-height: 50px;
  text-align: left;
  padding-left: 15px;
  position: relative;
}
.commonnav .menu2 li,.commonnav .menu3 li,.commonnav .menu4 li {
  cursor: pointer;
}
.commonnav .menu1 li::before,.commonnav .menu2 li::before,.commonnav .menu3 li::before,.commonnav .menu4 li::before {
  content: '>';
  position: absolute;
  right: 18px;
  top: 0;
  font-family: "SimHei";
  font-size: 16px
}
.commonnav .menu1 li.last::before,.commonnav .menu2 li.last::before,.commonnav .menu3 li.last::before,.commonnav .menu4 li.last::before {
  content: ''
}
.commonnav .menu1 li:hover,.commonnav .menu2 li:hover,.commonnav .menu3 li:hover,.commonnav .menu4 li:hover {
  color: #63ADFD;
}
</style>
