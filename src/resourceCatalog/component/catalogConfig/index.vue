<template>
  <div class="catalogConfig w1200menu index" >
    <!--
      <div class="content-title">
  			<span class="content-title-home"></span>
  			<span>资源目录维护</span>
  		</div>
  		-->
    <div>
      <LableList :type="dataType" :catalogShow="true" @changeLable="changeDataType" />
    </div>

    <!-- 我修改的部分 -->
    <div class="tab-links-v fl" style="overflow:auto;overflow-x: hidden; position:absolute;top:73px;bottom:0;left:15px;right:15px">
      <div class="tab-link" :style="normalWidth" @mouseenter="changeWidth(index, item.id, item.name)" :class="[Math.floor(index/3) === Math.floor(active/3) ? (index === active ? 'treebox_active' : 'treebox_active_other') : 'treebox']" v-for="(item, index) in tabs" :key="item.id" >
        <span class="spanProperty">
          <i :class="['iconfont','iconfontclass',iconFont[index]]"></i>
          <span :title="allTreeTitle[index]" v-show="!(index===numi)">{{item.name}}</span>
          <input :title="allTreeTitle[index]" type="text"  v-model="allTreeTitle[index]" v-show="index===numi"  :class="item.className" @keyup.enter="saveChange(item,index,$event)" @blur="saveChange(item,index,$event)">
          <i v-if="changeBtn(item.children) && verifyPermission('009006008')" class="iconfont icon-3" @click="delRootNode(index)"></i>
          <i  @click="changeName(item,index,$event)" v-if="!changeBtn(item.children) && verifyPermission('009006007')" class="iconfont icon-bianji " ></i>
        </span>
          <div class="contentBorder">
          <Tree @changeNode="changeNode" :data="item.children" :defaultProps="defaultProps" :defaultExpanded="defaultExpanded" />
           <div v-show="Math.floor(index/3) === Math.floor(active/3) ? (index === active ? true : false) : false">
          <button v-if="changeBtn(item.children)" class="changebtn"  @click="addFirstNode(item.children)">添加节点</button> 
          <ul class=" fl oper-btns" v-else>
            <li class="" @click="addNode('add',item)">
              <span v-if="verifyPermission('009006001')" class="onlySpan">添加同级节点</span>
            </li>
            <li class="" @click="addNode('addSub',item)">
              <span v-if="verifyPermission('009006002')" class="onlySpan">添加子节点</span>
            </li>
            <li class="" @click="modNode(item)">
              <span v-if="verifyPermission('009006003')" class="onlySpan">修改节点</span>
            </li>
            <li class="" @click="addTag(item)">
              <span v-if="verifyPermission('009006004')" class="onlySpan">增加数据标签</span>
            </li>
            <li class="" @click="delNode(item)">
              <span v-if="verifyPermission('009006005')" class="onlySpan">删除</span>
            </li>
          </ul>
           </div>
        </div>
      </div>
     <!--添加树-->
      <div v-if="verifyPermission('009006007')" class="plusSign" :style="changeStyleone">
        <div class="plusImage" @click="displayElement()"></div>
      </div>
      <div class="tab-linkoneOne" :style="changeStyletwo">
        <span class="spanProperty" style="position: relative;">
          <input type="text" class="placeholder"  ref="focus" v-model="formnameOne" placeholder="请输入节点名称" @keyup.enter="saveRootNode()" @blur="saveRootNode()"><i class="iconfont icon-3 delImage" @click="displayNoneElement()"></i></span>
      </div>
    </div>

    <LabelView :dialogTagVisible.sync="dialogTagVisible" :model="currentNode.data" modelLabelKey="labels" :changeLabelCaller="saveLabel" />

    <el-dialog title="节点信息" :visible.sync="dialogFormVisible" size="tiny">
      目录名称:
      <el-input v-model="formName" auto-complete="off"></el-input>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button @click="saveNode">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="提示" :visible.sync="promptVisible" size="tiny">
      <span>{{promptMessage}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="promptVisible = false">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
// import NoticeBoxService from '@/publicJs/NoticeBoxService.js'
import privibutton from '@/publicComponent/privibutton'
import TipBoxService from '@/publicJs/TipBoxService.js'
import apiClient from '@/publicJs/ApiClient.js'
import LableList from './LableList'
// 我修改的部分
import Tree from './Tree'
// import LeftTab from './LeftTab'
import LoadingBoxService from '../../../publicJs/LoadingBoxService.js'
// import { Loading } from 'element-ui'
import Util from '@/publicJs/Util'
import LabelView from '@/publicComponent/labelView'

var binData = {
  numi: -1,
  currentTreeTitle: '',
  allTreeTitle: [],
  focusStatus: false,
  normalWidth: null,
  changeStyleone: {display: 'block'},
  changeStyletwo: {display: 'none'},
  iconFont: ['icon-hulianwang', 'icon-yewuyingyong', 'icon-jichushuju'],
  // 控制鼠标移入移出的类名
  active: -1,
  // 表格显示标志
  dialogFormVisible: false,
  // 弹出框显示标志
  dialogTagVisible: false,
  // 提示框显示标志
  promptVisible: false,
  // 已选中的标签列表
  checkedLabels: [],
  // 弹出框input的长度
  formLabelWidth: '120px',
  // 树中选中的节点
  currentNode: {
    data: {
      labels: []
    }
  },
  emptyNode: {
    data: {
      labels: []
    }
  },
  // 左侧菜单的当前ID
  tabId: '',
  // 左侧菜单的当前名称
  tabName: '',
  // 录入框对应字段
  formId: '',
  formnameOne: '',
  formName: '',
  formType: '',
  // 树节点集合
  nodes: [],
  // 左侧tab集合
  tabs: '',
  // 修改后的树根节点对象
  currentRoot: {},
  // 数据类型
  dataType: 'data',
  // 提示信息
  promptMessage: '',
  // 树解析配置
  defaultProps: {
    children: 'children',
    label: 'name'
  },
  defaultExpanded: [],
  isAverage: false
}

function loadingClose () {
  LoadingBoxService.close()
}

function loading () {
  LoadingBoxService.open('数据加载中...')
}

function changeTreeTitle (data) {
  binData.allTreeTitle.length = 0
  for (var i = 0; i < data.length; i++) {
    var obj = data[i]
    binData.allTreeTitle[i] = obj.name
  }
}

var getLeftTab = () => {
  loading()
  binData.tabId = ''
  apiClient.get('/rcapi/catalog/getTab', {
    type: binData.dataType
  }).then(data => {
    for (var i = 0; i < data.length; i++) {
      var obj = data[i]
//        console.log(obj.name)
      binData.allTreeTitle[i] = obj.name
//        console.log(binData.value1)
      obj.trueWrite = true
      obj.className = 'inputDefault'
    }
    binData.tabs = data
    loadingClose()
  }).catch(e => {
    binData.tabs = {}
    loadingClose()
  })
}

var saveNodeToDB = (pid, dataType) => {
  loading()

  apiClient.post('/rcapi/catalog/saveRootNode', {
    id: pid,
    name: binData.formnameOne,
    type: dataType,
    index: binData.tabs.length + 1
  }).then(data => {
//    for (var i = 0; i < data.tabs.length; i++) {
//    var obj = data.tabs[i]
//    obj.trueWrite = true
//    obj.className = 'inputDefault'
//    }
    binData.tabs = data.tabs
    changeTreeTitle(data.tabs)
    loadingClose()
  }).catch(e => {
    loadingClose()
  })
}

var modRootNode = (pid, name, dataType) => {
  loading()
  apiClient.post('/rcapi/catalog/modRootNode', {
    id: pid,
    name: name,
    type: dataType
  }).then(data => {
    // console.log(data)
    for (var i = 0; i < data.tabs.length; i++) {
      var obj = data[i]
      obj.trueWrite = true
      obj.className = 'inputDefault'
    }
    binData.tabs = data.tabs
    changeTreeTitle(data.tabs)
    loadingClose()
  }).catch(e => {
    loadingClose()
  })
}

var delTabNodeInDB = () => {
  loading()
  apiClient.get('/rcapi/catalog/delNode', {
    id: binData.tabId
  }).then(data => {
    for (var i = 0; i < data.tabs.length; i++) {
      var obj = data.tabs[i]
      obj.trueWrite = true
      obj.className = 'inputDefault'
    }
    binData.tabId = ''
    binData.tabName = ''
    binData.tabs = data.tabs
    changeTreeTitle(data.tabs)
    loadingClose()
  }).catch(e => {
    loadingClose()
  })
}

var modTreeInDB = (tree) => {
  loading()
  let treeJson = ''
  if (tree === '' || tree === undefined) {
    treeJson = cloneNodes(binData.currentRoot.childNodes)
  } else {
    treeJson = tree
  }
  apiClient.get('/rcapi/catalog/modTree', {
    rootId: binData.tabId,
    treeJson: JSON.stringify(treeJson),
    dataType: binData.dataType
  }).then(data => {
    binData.tabs = data.tabs
    changeTreeTitle(data.tabs)
    for (var i = 0; i < data.tabs.length; i++) {
      var obj = data.tabs[i]
      obj.trueWrite = true
      obj.className = 'inputDefault'
    }
    binData.currentNode = binData.emptyNode
    loadingClose()
  }).catch(e => {
    loadingClose()
  })
}

var modLabelInDB = (tree) => {
  let treeJson = ''
  if (tree === '' || tree === undefined) {
    treeJson = cloneNodes(binData.currentRoot.childNodes)
  } else {
    treeJson = tree
  }
  return apiClient.get('/rcapi/catalog/modTree', {
    rootId: binData.tabId,
    treeJson: JSON.stringify(treeJson),
    dataType: binData.dataType
  }).then(data => {
    return true
  }).catch(e => {
    console.error(e)
    return false
  })
}

function cloneNodes (nodes) {
  if (!nodes) {
    return []
  }
  let result = []
  nodes.forEach(function (val) {
    result.push(cloneNode(val, {}))
  })
  return result
}

function cloneNode (value, result) {
  if (value.hasOwnProperty('data')) {
    result.id = value.data.id
    result.name = value.data.name
    result.type = value.data.type
    result.labels = value.data.labels
  }
  if (value.hasOwnProperty('childNodes')) {
    for (var i = 0; i < value.childNodes.length; i++) {
      (result.children || (result.children = [])).push(cloneNode(value.childNodes[i], {}))
    }
  }
  return result
}

export default {
  name: 'CatalogConfig',
  data () {
    return binData
  },
  // 我修改的部分
  components: {
    LableList, LabelView, Tree, privibutton
  },
  directives: {
    focus: {
      inserted: function (el, {value}) {
        if (value) {
          el.focus()
        }
      }
    }
  },
  methods: {
    saveChange (item, index, $event) {
      let count = 0
      for (let i = 0; i < this.tabs.length; i++) {
        if (this.tabs[i].name === item.name) {
          if (count === 0) {
            count++
          } else {
            TipBoxService.open('分类名称不能重复', 2)
            return
          }
        }
      }

      item.trueWrite = true
      item.className = 'inputDefault'
//        $event.target.previousElementSibling.className = 'inputDefault'
//        $event.target.previousElementSibling.disabled=true
//        console.log(this.value2)
//        console.log($event.target.value)
      if (this.currentTreeTitle !== $event.target.value) {
        modRootNode(item.id, this.allTreeTitle[index], item.type)
        this.tabs[index].name = this.allTreeTitle[index]
      }
      this.numi = -1

    },
    changeName (item, index, $event) {
      this.numi = index

      item.className = 'inputBorder inputDefault'
      item.trueWrite = false
      this.$nextTick(function () {
//          console.error($event.target.parentNode.previousElementSibling.previousElementSibling);
          $event.target.parentNode.previousElementSibling.previousElementSibling.focus()
//          console.log(焦点);
      })
      this.currentTreeTitle = $event.target.parentNode.previousElementSibling.previousElementSibling.value
    },
    displayNoneElement () {
      this.changeStyleone = {
        display: 'block'
      }
      this.changeStyletwo = {
        display: 'none'
      }
    },
    saveRootNode () {
      this.isAverage = false
      if (!this.formnameOne) {
        this.displayNoneElement()
        return
      }
      if (this.checkNodeName(this.tabs, 'root')) {
        saveNodeToDB(Util.getId(), this.dataType)
        this.formnameOne = ''
        this.displayNoneElement()
      } else {
        return
      }
    },
    delRootNode (index) {
      this.$confirm('是否删除分类"' + this.tabName + '"，  删除后将无法撤回', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delTabNodeInDB()
        // this.allTreeTitle.splice(index, 1)
      }).catch(e => {
        console.error(e)
      })
    },
    displayElement () {
      this.isAverage = true
      this.active = this.tabs.length + 3
      this.changeStyleone = {
          display: 'none'
      }
      this.changeStyletwo = {
          display: 'block'
      }
      this.$nextTick(function () {
        this.$refs.focus.focus()
      })
    },
    changeBtn (n) {
      return !(n.length > 0)
    },
    changeWidth (index, id, name) {
      // console.log(this.isAverage)
      if (this.isAverage) { return }
      if (this.active !== index) {
        this.currentNode = this.emptyNode
      }
      this.tabId = id
      this.tabName = name
      this.active = index
    },
    changeNode (node, root) {
      this.currentNode = node
      this.currentRoot = root
    },
    changeDataType (type) {
      this.dataType = type
      this.nodes = []
      getLeftTab()
    },
    openNotify (message) {
      this.promptMessage = message
      this.promptVisible = true
    },
    openConfirm (message) {
      this.$confirm(message, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return true
      }).catch(() => {
        return false
      })
    },
    /*
    添加标签
    */
    addTag () {
      if (!this.currentNode.id) {
        TipBoxService.open('请选择节点', 2)
      } else {
        this.dialogTagVisible = true
      }
    },
    addFirstNode (nodes) {
      this.nodes = nodes
      this.addNode('firstNode')
    },
    /*
    添加同级节点
    */
    addNode (type) {
      if (type === 'addSub' && !this.currentNode.id) {
        TipBoxService.open('请选择节点', 2)
        return
      } else if (type === 'add' && !this.currentNode.id) {
        TipBoxService.open('请选择节点', 2)
        return
      }
      this.formName = ''
      this.formId = ''
      this.formType = type
      this.dialogFormVisible = true
    },
    /*
    修改节点
    */
    modNode () {
      if (!this.currentNode.id) {
        TipBoxService.open('请选择节点', 2)
      } else if (this.currentNode.id) {
        this.formName = this.currentNode.label
        this.formId = this.currentNode.id
        this.formType = 'mod'
        this.dialogFormVisible = true
      } else {
        TipBoxService.open('请选择节点', 2)
        // this.formName = this.tabName
        // this.formId = this.tabId
        // this.formType = 'modRoot'
        // this.dialogFormVisible = true
      }
    },
    /*
    删除节点
    */
    delNode (item) {
      if (!this.currentNode.id) {
        /*
        删除左侧tab节点
        */
        TipBoxService.open('请选择要删除的节点', 2)
        return
        // if (this.tabId === '') {
        //   TipBoxService.open('没有可删除的节点', 2);
        //   return
        // } else {
        //   if (this.nodes.length > 0) {
        //     TipBoxService.open('该节点存在子节点无法删除', 2);
        //   } else {
        //      this.$confirm('是否删除所选目录的节点，  删除后将无法撤回', '提示', {
        //       confirmButtonText: '确定',
        //       cancelButtonText: '取消',
        //       type: 'warning'
        //     }).then(() => {
        //       // this.changeBtn()
        //       delTabNodeInDB()
        //     }).catch(() => {
        //     })
        //   }
        // }
      } else {
        /*
        删除树中节点
        */
        if (this.currentNode.childNodes.length > 0) {
          TipBoxService.open('该节点存在子节点无法删除', 2)
        } else {
          // NoticeBoxService.open('是否删除所选目录的节点， 删除后将无法撤回', function(){
          //   this.defaultExpanded.splice(0)
          //   this.defaultExpanded.push(this.currentNode.parent.data.id)
          //   this.currentNode.store.remove(this.currentNode.data)
          //   modTreeInDB()
          //  })
          this.$confirm('是否删除所选目录的节点，  删除后将无法撤回', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            // this.changeBtn()
            this.defaultExpanded.splice(0)
            this.defaultExpanded.push(this.currentNode.parent.data.id)
            this.currentNode.store.remove(this.currentNode.data)
            modTreeInDB()
            // this.tabs[1].children[0].children.length=0
            // this.tabs[1].children = new Array();
            this.$router.push({name: 'catalogConfig'})
          }).catch(() => {
          })
        }
      }
    },
    /**
     校验节点名称是否重复
     */
    checkNodeName (nodes, type) {
      for (let i = 0; i < nodes.length; i++) {
        let name = ''
        if (type === 'root') {
          name = nodes[i].name
        } else {
          name = nodes[i].data.name
        }
        if (name === this.formName) {
          TipBoxService.open('同级节点名称不能重复', 2)
          return false
        }
      }
      return true
    },
    /*
    节点信息保存（新增/修改）
    */
    saveNode () {
      if (this.formName === '') {
        TipBoxService.open('节点名称不能为空', 2)
        return
      }
      if (this.formName.length > 14) {
        TipBoxService.open('节点名称不能超过14个字符', 2)
        return
      }
      if (this.formType === 'add') {
        if (!this.currentNode.id) {
          // 校验节点名称在当前层级是否重复
          if (this.checkNodeName(this.tabs, 'root')) {
            saveNodeToDB(Util.getId(), this.dataType)
          } else {
            return
          }
        } else if (this.currentNode.level === 1) {
          // 校验节点名称在当前层级是否重复
          if (this.checkNodeName(this.currentNode.parent.childNodes, 'tree')) {
            this.currentNode.store.append({ id: Util.getId(), name: this.formName, type: this.dataType, children: [] })
            this.defaultExpanded.splice(0)
            modTreeInDB()
          } else {
            return
          }
        } else {
          // 校验节点名称在当前层级是否重复
          if (this.checkNodeName(this.currentNode.parent.childNodes, 'tree')) {
            this.currentNode.store.append({ id: Util.getId(), name: this.formName, type: this.dataType, children: [] }, this.currentNode.parent.data)
            this.defaultExpanded.splice(0)
            this.defaultExpanded.push(this.currentNode.parent.data.id)
            modTreeInDB()
          } else {
            return
          }
        }
      } else if (this.formType === 'addSub') {
        if (!this.currentNode.id) {
          TipBoxService.open('请选择节点', 2)
          return
          // 校验节点名称在当前层级是否重复
          // if (this.checkNodeName(this.nodes, 'root')) {
          //   this.nodes.push({id: Util.getId(), name: this.formName, type: this.dataType, children: []})
          //   this.defaultExpanded.splice(0)
          //   modTreeInDB(this.nodes)
          // } else {
          //   return
          // }
        } else if (this.currentNode.level === 3) {
          this.dialogFormVisible = false
          TipBoxService.open('菜单只能添加三级', 2)
          return
        } else {
          // 校验节点名称在当前层级是否重复
          if (this.checkNodeName(this.currentNode.childNodes, 'tree')) {
            this.currentNode.store.append({ id: Util.getId(), name: this.formName, type: this.dataType, children: [] }, this.currentNode.data)
            this.defaultExpanded.splice(0)
            this.defaultExpanded.push(this.currentNode.data.id)
            modTreeInDB()
          } else {
            return
          }
        }
      } else if (this.formType === 'firstNode') { // j 添加第一个节点
        this.nodes.push({id: Util.getId(), name: this.formName, type: this.dataType, children: []})
        modTreeInDB(this.nodes)
      } else if (this.formType === 'mod') {
        // 校验节点名称在当前层级是否重复
        if (this.checkNodeName(this.currentNode.parent.childNodes, 'tree')) {
          this.currentNode.data.name = this.formName
          this.defaultExpanded.splice(0)
          this.defaultExpanded.push(this.currentNode.parent.data.id)
          modTreeInDB()
        } else {
          return
        }
      } else if (this.formType === 'modRoot') {
        // 校验节点名称在当前层级是否重复
        if (this.checkNodeName(this.tabs, 'root')) {
          modRootNode(this.formId, this.formName, this.dataType)
        } else {
          return
        }
      }
      this.dialogFormVisible = false
    },
    saveLabel () {
      return modLabelInDB()
    }
  },
  mounted () {
    getLeftTab()
  },
  watch: {
    // 'item.name': function (val, oldval) {

    // }
  }
}
</script>
<style src='' scoped></style>
<style  scoped>
.w1200menu {
  margin-top: 15px;
  background-color: #F3F7FD;
}

.tab-links-v {
  box-sizing: border-box;
  overflow-y: auto;
  overflow-x: hidden;
  background-color: #FFFFFF;
  padding: 10px;
}

.tab-links-v .tab-link {
  box-sizing: border-box;
  position: relative;
  overflow-y: auto;
  overflow-x: hidden;
}

.tab-links-v .tab-link::-webkit-scrollbar {
  display: none;
}

.tab-links-v .tab-link .el-tree-node__content .el-tree-node__label {
  font-family: Mcrosoft Yahei;
  font-size: 13px;
  font-weight: 600;
}

.tab-links-v .tab-link .el-tree-node__content .el-tree-node__label:hover {
  font-family: Mcrosoft Yahei;
  font-size: 13px;
}

.tab-links-v .tab-link .el-tree-node__children .el-tree-node__label:hover {
  font-family: Mcrosoft Yahei;
  font-size: 12px;
}

.tab-links-v .contentBorder {
  min-height: 457px;
  box-sizing: content-box;
}

.tab-links-v .tab-link {
  border: 1px solid #EEEEEE;
  margin-bottom:10px;
}

.tab-links-v .tab-link:hover {
  box-shadow: 0px 0px 1px 2px #EEEEEE;
}

.tab-links-v .tab-link:nth-of-type(3n+1) {
  float: left;
  height: 500px;
  margin-right: 1%;
}

.tab-links-v .tab-link:nth-of-type(3n+2) {
  margin-right: 1%;
  float: left;
  height: 500px;
}

.tab-links-v .tab-link:nth-of-type(3n+3) {
  float: left;
  height: 500px;
}

.tab-links-v .tab-link .spanProperty {
  display: block;
  height: 40px;
  box-sizing: border-box;
  padding: 9px 0 0 5px;
  background-color: #F4FAFE;
  font-size: 13px;
  font-weight: 600;

}
.treebox {
  width: 32.66%;
  transition-property: width;
  transition-duration: 0.3s;
  transition-timing-function: cubic-bezier(.2, 1, .49, .73);
}

.treebox_active {
  width: 50%;
  transition-property: width;
  transition-duration: 0.3s;
  transition-timing-function: cubic-bezier(.2, 1, .49, .73);
}

.treebox_active_other{
  width: 24%;
  transition-property: width;
  transition-duration: 0.3s;
  transition-timing-function: cubic-bezier(.2, 1, .49, .73);
}

.tab-link .oper-btns {
  width: 112px;
  height: 243px;
  position: absolute;
  left: 365px;
  top: 72px;
}

.tab-link .oper-btns .onlySpan {
  position: relative;
  width: 112px;
  height: 32px;
  display: inline-block;
  margin-top: 22px;
  text-align: center;
  line-height: 32px;
  border: 1px solid #26D186;
  border-radius: 6px;
  background-color: #26D186;
  color: white;
  cursor: pointer;
}

.iconfontclass {
  position: relative;
  color: #6BB3FD;
  left: 0;
  top: 0;
}
.el-input{
    position: relative;
    font-size: 14px;
    left: 9px;
    width: 75% !important;
    display: inline-block;
    margin-left: 2px;
}
.el-dialog .el-dialog__header {
  background-color: #55A8FD;
  position: relative;
  padding: 10px 2px 2px 0 !important;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
}

.el-dialog {
  border-radius: 5px;
}

.el-button--default {
  background-color: #26D186;
  color: #FFFFFF;
}

.el-button--primary {
  background-color: #26D186 !important;
  border-color: #26D186 !important;
  color: white !important;
}

.el-button--primary :hover {
  border: 0px solid red !important;
}

.el-button:hover {
  box-sizing: border-box;
  color: white !important;
  border: 1px solid transparent !important;
}

.el-message-box__title {
  height: 30px;
  padding-left: 20px;
  color: #FFFFFF !important;
}

.el-message-box__header {
  padding: 8px 0 0 0;
  position: relative;
}

.el-message-box__close {
  position: absolute;
  left: -15px;
  bottom: -9px;
  color: #FFFFFF !important;
}

#add-labels-editor-button {
  background-color: #26D186;
  color: #FFFFFF;
  width: 81px;
  height: 32px;
  outline: none;
}
.changebtn {
    position: relative;
    width: 112px;
    height: 32px;
    display: inline-block;
    margin-top: 22px;
    text-align: center;
    border: 1px solid #26D186;
    border-radius: 6px;
    background-color: #26D186;
    color: white;
    cursor: pointer;
    right: -365px;
    top: -10px;
    outline-style: none;
    line-height:29px; 
}
  .plusSign {
    border:1px dashed #eee;
    width: 24%;
    /* margin-left: 1%; */
    height: 170px;
    float: left;
    position: relative;
  }
  .plusImage {
    width: 66px;
    height: 70px;
    background: url("../../../publicImages/plus.png") center center;
    position: absolute;
    top:50%;
    left:50%;
    transform: translate(-50%,-50%);
    cursor: pointer;
  }
  .tab-linkone {
    border: 1px solid #EEEEEE;
    margin-left: 0%;
    float: left;
    height: 500px;
    width: 32.66%;
    display: none;
  }
  .tab-linkone .spanProperty {
    display: block;
    height: 40px;
    box-sizing: border-box;
    padding: 9px 0 0 5px;
    background-color: #F4FAFE;
    font-size: 13px;
    font-weight: 600;
  }
.tab-linkone .spanProperty input {
  border-top-style: none;
  border-right-style: none;
  border-left-style: none;
  background-color: #F4FAFE;
  border-bottom:1px solid #333333;
  box-sizing: border-box;
  }
.tab-linkoneOne {
  border: 1px solid #EEEEEE;
  margin-left: 0%;
  float: left;
  height: 500px;
  width: 25%;
  display: none;
}
.tab-linkoneOne .spanProperty {
  display: block;
  height: 40px;
  box-sizing: border-box;
  padding: 9px 0 0 5px;
  background-color: #F4FAFE;
  font-size: 13px;
  font-weight: 600;
}
.tab-linkoneOne .spanProperty input {
  border-top-style: none;
  border-right-style: none;
  border-left-style: none;
  background-color: #F4FAFE;
  border-bottom:1px solid #333333;
  box-sizing: border-box;
}
.tab-link .spanProperty i:first-child {
  position: relative;
  cursor: pointer;
  color: #6BB3FD;
  right: -27%;
  font-weight: normal;
  top: 0;
  }
.tab-link .spanProperty i:last-child {
  color: #6BB3FD;
  cursor: pointer;
  position: absolute;
  right:4px;
  top:10px;
  font-weight: normal;
}
.delImage {
  color: #6BB3FD;
  cursor: pointer;
  position: absolute;
  right:4px;
  top:10px;
}
  .inputDefault {
    background-color: #F4FAFE;
    border:none;
  }
  .inputBorder {
    border: 0px solid #ccc;
    border-radius: 3px;
    -webkit-box-shadow: 0px 0px 6px #007eff;
    box-shadow: 0px 0px 6px #007eff;
    -webkit-transition: border-color ease-in-out .15s,-webkit-box-shadow ease-in-out .15s;
    -o-transition: border-color ease-in-out .15s,box-shadow ease-in-out .15s;
    transition: border-color ease-in-out .15s,box-shadow ease-in-out .15s
  }
  .inputBorder:focus {
  border: 1px solid #fafafa;
  -webkit-box-shadow: 0px 0px 8px #007eff;
  -moz-box-shadow: 0px 0px 8px #007eff;
  box-shadow: 0px 0px 8px #007eff;
  }
  .placeholder::-webkit-input-placeholder {   
    color:#333333;  
    font-size:13px;
}  
  .placeholder::-moz-placeholder {
    color:#333333;  
    font-size:13px; 
    opacity: 1;
}  
  .placeholder:-moz-placeholder {
    color:#333333;  
    font-size:13px;
    opacity: 1;
}  
  .placeholder:-ms-input-placeholder {
    color:#333333;  
    font-size:13px;
}
  .spanProperty span {
    border:1px solid transparent;
  }
</style>

<style>
.catalogConfig .el-dialog .el-dialog__header {
  background-color: #55A8FD;
  position: relative;
  padding: 14px 18px 2px 18px;
}
.contentBorder .is-leaf {
  border: none;
  border-top-width: 1px;
  border-bottom-width: 1px;
  width: 9px;
  height: 1px;
  display: inline-block;
  background-color: #797979;
}

.tab-links-v .tab-link .el-tree-node__children .el-tree-node__label {
  font-family: 'Microsoft Yahei';
  font-size: 12px;
  color: black;
  font-weight: 500;
}
.catalogConfig .el-message-box__message p{
  margin-left: 4px;
}
.catalogConfig .el-message-box__status.el-icon-warning{
  display: none;
}
.catalogConfig .el-message-box__header{
  background-color: #55A8FD;
  position: relative;
  padding: 10px 15px 10px 18px !important;
}
.catalogConfig .el-message-box__header .el-message-box__title {
  padding-left: 0;
  margin-bottom: 0;
  font-size: 16px;
  font-weight: 500;
  height: 18px;
  color: white !important;
}

.catalogConfig .el-message-box__headerbtn .el-message-box__close{
  color:white !important;
}
.catalogConfig .el-message-box__headerbtn .el-message-box__close:hover{
  color:white !important;
}
.catalogConfig .el-message-box__content {
    padding: 54px 20px;
    color: #48576a;
    font-size: 14px;
    position: relative;
}
.catalogConfig .el-message-box__headerbtn {
    position: absolute !important;
    top: 11px !important;
    right: 16px;
    background: 0 0;
    border: none;
    outline: 0;
    padding: 0;
    cursor: pointer;
}
.catalogConfig .el-message-box__btns button:first-of-type,.el-message-box__btns button:last-of-type,.el-message-box__btns .el-dialog__footer .dialog-footer button:first-of-type{
   background-color:#26D186;
   border:1px solid #26D186;
   color: white;
}
.catalogConfig .el-message-box .el-message-box__btns  button:first-of-type{
  background-color:#999999 !important;
  border:1px solid #999999 !important;
}
.catalogConfig .el-dialog .el-dialog__footer button:first-child {
  background-color:#999999;
  border:1px solid #999999;
}
.catalogConfig .el-tree-node__content .el-tree-node__label{
  font-size:13px;
  font-weight:600;
}
</style>
