<template>
  <div class="mode-div lanm-hed nav">
    <div class="navItems">
      <i class="iconfont icon-iconfontzhizuobiaozhun023107"></i>
      <span class="navItem" @mouseleave="closemenu" v-bind:class="{ active: type == 'result' }" @mouseover="showmenu1()" @click="changeTab('result')">检测结果</span>
      <span class="navItem" v-bind:class="{ active: type == 'task' }" @click="changeTab('task')">检测任务</span>
      <!--<span v-bind:class = "{ active: type == 'report' }" @click="changeTab('report')">检测报告</span>-->
      <span class="navItem" v-bind:class="{ active: type == 'scheme' }" @click="changeTab('scheme')">检测方案</span>
      <div @mouseleave="closemenu">
        <ul class="menu1" v-show="ismenu1"  @mouseover="showmenu1()">
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
    </div>
  </div>
</template>

<script>
import apiClient from '@/publicJs/ApiClient.js'
import privibutton from '@/publicComponent/privibutton'
export default {
  name: 'tabList',
  components: {privibutton},
  props: ['type'],
  data () {
    return {
      ismenu1: false,
      ismenu2: false,
      ismenu3: false,
      ismenu4: false,
      treeData: [],
      datamenu2: [],
      datamenu3: [],
      datamenu4: []
    }
  },
  methods: {
    showmenu1 () {
      if (this.$route.name === 'dataCheckResult') {
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
    },
    changeTab (type) {
      this.$emit('changeTab', type)
      if (type === 'task') {
        this.$router.push({name: 'dataCheckTask'})
      } else if (type === 'result') {
        this.ismenu1 = true
        this.$router.push({name: 'dataCheckResult'})
      } else if (type === 'report') {
        this.$router.push({name: 'dataCheckReport'})
      } else if (type === 'scheme') {
        this.$router.push({name: 'dataCheckScheme'})
      }
    },
    getTreeData () {
      // this.treeLoad = true
      apiClient.get('/rcapi/catalog/getTab', {type: 'data'}).then(data => {
        // console.log(data)
        this.treeData = data
        // this.treeLoad = false
        // this.form.selectData = UtilService.filterChildren(data)
      }, errorObj => {
        // this.treeLoad = false
      })
    },
    handleNodeClick (item) {
      // console.log(this.$parent)
      this.$parent.$parent.hub.$emit('handleNodeClick', item)
      this.closemenu()
    }
  },
  mounted () {
    this.getTreeData()
  }
}
</script>
<style src="" scoped></style>
<style scoped>
.nav {
  position: absolute;
  left: 15px;
  top: 0px;
  width: 45px;
  height: 100%;
}
.navItems {
  border: 1px solid #ccc;
  text-align: center;
}
.icon-iconfontzhizuobiaozhun023107 {
  font-size: 28px;
  color: #33d48d;
}
.navItem {
  cursor: pointer;
  display: block;
  padding: 5px 5px;
  text-align: center;
  height: 45px;
  border-bottom: 1px solid #ccc;
}
.navItem.active {
  color: #63adfd;
}
.navItem:first-of-type {
  border-top: 1px solid #ccc;
}
.navItem:last-of-type {
  border-bottom: none;
}
.navItems .menu1,
.navItems .menu2,
.navItems .menu3,
.navItems .menu4 {
  position: absolute;
  left: 44px;
  top: 0;
  bottom: 15px;
  z-index: 99;
  background-color: #edf5fe;
  border: 1px solid #ccc;
  color: #000;
}
.navItems .menu2 {
  left: 235px;
}
.navItems .menu3 {
  left: 426px;
}
.navItems .menu4 {
  left: 617px;
}
.navItems .menu1 li,
.navItems .menu2 li,
.navItems .menu3 li,
.navItems .menu4 li {
  width: 190px;
  height: 50px;
  line-height: 50px;
  text-align: left;
  padding-left: 15px;
  position: relative;
}
.navItems .menu2 li,
.navItems .menu3 li,
.navItems .menu4 li {
  cursor: pointer;
}
.navItems .menu1 li::before,
.navItems .menu2 li::before,
.navItems .menu3 li::before,
.navItems .menu4 li::before {
  content: ">";
  position: absolute;
  right: 18px;
  top: 0;
  font-family: "SimHei";
  font-size: 16px;
}
.navItems .menu1 li.last::before,
.navItems .menu2 li.last::before,
.navItems .menu3 li.last::before,
.navItems .menu4 li.last::before {
  content: "";
}
.navItems .menu1 li:hover,
.navItems .menu2 li:hover,
.navItems .menu3 li:hover,
.navItems .menu4 li:hover {
  color: #63adfd;
}
</style>
