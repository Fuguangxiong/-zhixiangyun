<template>
  <div class="io-category-manage" id="categoryManage">
    <h1>菜单管理</h1>

    <!-- 导航菜单 -->
    <div class="category-manage-left">
      <h2>导航菜单<i class='icon iconfont icon-jiahao' @click='onAddLevel1()'></i></h2>
      
      <ul>
        <li v-for="(item,index) in categoryList" 
            :key='index'
            :id="item.id"
            :title='item.name'
            @click='onEditLevel1(index)'>
          <i v-show='editIndex!==index' class='icon iconfont icon-wenjianjia'></i>
          <i v-show='editIndex===index' class='icon iconfont icon-ziyuanguanli'></i>
          {{item.name}}
          <i class='icon iconfont icon-shanchu' title='删除导航' @click='onDeleteLevel1(index,item.id)'></i>
        </li>
      </ul>
    </div>

    <!-- start: 右侧 -->
    <div class="category-manage-right">

      <!-- start: level2 -->
      <div v-for="(item,index) in editCategory.infos" 
          :key='index' 
          :data-index='index'
          class="category-manage-level2">
          
        <!-- input -->
        <el-form ref="forma" :model="item" label-width="100px" class="category-manage-level2-form">
          <el-form-item label="导航名称：" prop="name">
            <el-input v-model="item.name" :maxlength='15'></el-input>
          </el-form-item>

          <el-form-item label="标签：" prop="tags">
            <span @click="showTags(index)" class="add-tag-btn">添加</span>
            <span class="tag-span" v-for="(tag,indexChild) in item.tags" :key="index+'_'+indexChild">
              <label :title='tag'>{{tag}}</label>
              <i @click="deleteTag(index,indexChild)" class="icon iconfont icon-delete-black"></i>
            </span>
          </el-form-item>
        </el-form>

        <!-- add -->
        <button title='删除导航' @click='onDeleteLevel2(index)'><i class='icon iconfont icon-jianhao1'></i></button>        
        <button title='添加导航' @click='onAddLevel2(index)'><i class='icon iconfont icon-jiahao'></i></button>        
      </div>
      <!-- end: level2 -->

      <!-- 按钮 -->
      <div v-show="isEdit" class="category-manage-btns">
        <button class='blue' @click='onUpdateLevel1()'>保 存</button>
        <button class='grey' @click='onDeleteLevel1(editIndex,editCategory.id)'>全部删除</button>
      </div>
    </div>
    <!-- end: 右侧 -->

    <el-dialog title="添加导航分组" :visible.sync="isShowCategoryDialog" custom-class='add-category-dialog'>
      <el-form label-width="120px">
        <el-form-item label="导航分组名称：">
          <el-input v-model="newCategory" auto-complete="off" :maxlength='15' @keyup.enter="onAddLevel1Sure"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="onAddLevel1Cancle">取 消</el-button>
        <el-button type="primary" @click="onAddLevel1Sure">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 标签插件 -->
    <label-view :maxTag="10" 
              :dialogTagVisible.sync="isShowTagDialog" 
              :model="labelData" 
              modelLabelKey="serviceTag" 
              :changeLabelCaller="saveLabel">
    </label-view>
  </div>
</template>
<script>
import $ from 'jquery'
import apiClient from '../../../publicJs/ApiClient.js'
import TipBoxService from '../../../publicJs/TipBoxService.js'
import LoadingBoxService from '../../../publicJs/LoadingBoxService.js'
import LabelView from '../../../publicComponent/labelView.vue'
export default {
  name: 'categoryManage',
  components: {
    LabelView
  },
  data () {
    return {
      url: {
        getCategoryList: 'itsmApi/category/getConfigCategoryList', // 查询api分类
        saveCategory: 'itsmApi/category/saveCategory', // 添加api分类
        updateCategory: 'itsmApi/category/updateCategory', // 修改api分类信息
        deleteCategory: 'itsmApi/category/deleteCategory' // 删除api分类
      },
      isShowCategoryDialog: false, // 是否显示新建一级导航窗口
      newCategory: '', // 新建一级导航临时名称绑定字段
      categoryList: [], // 导航列表
      isEdit: false, // 是否正在编辑某一级导航
      editIndex: -1, // 正在编辑的一级导航的索引
      editCategory: {}, // 正在编辑的一级导航
      labelData: {
        serviceTag: [], // 标签名称数组
        resourcetag: '' // 标签名称字符串
      }, // 包含标签名称数组的对象
      isShowTagDialog: false, // 是否显示标签弹窗
      editLevel2Index: 0 // 正在编辑的二级导航的索引
    }
  },
  watch: {
    labelData: {
      handler (newValue, oldValue) {
        this.editCategory.infos[this.editLevel2Index].tags = this.labelData.serviceTag
        this.labelData.resourcetag = this.editCategory.infos[this.editLevel2Index].tags.join(',')
      },
      deep: true
    }
  },
  created () {
    this.getCategoryList()
  },
  methods: {
    // 获取API分类
    getCategoryList (id) {
      let vm = this
      apiClient.get(vm.url.getCategoryList, {}, function (data) {
        console.log('API分类', data)
        if (data.status === 200) {
          vm.categoryList = data.results.data
          vm.categoryList.forEach(function (v, i) {
            v.infos = JSON.parse(v.infos)
          })
          if (id) {
            let index = -1
            vm.categoryList.forEach(function (v, i) {
              if (v.id === id) {
                index = i
              }
            })
            vm.onEditLevel1(index, true)
          }
        } else {
          TipBoxService.open(data.exception, 2)
        }
      })
    },
    // 添加导航
    onAddLevel1 () {
      this.isShowCategoryDialog = true
    },
    // 添加导航——确定
    onAddLevel1Sure () {
      let vm = this
      let level1 = {
        pid: '0',
        level: '1',
        name: this.newCategory,
        infos: []
      }
      console.log('level1', level1)
      LoadingBoxService.open('正在添加,请稍候')
      apiClient.post(vm.url.saveCategory, level1, function (data) {
        LoadingBoxService.close()
        if (data.status === 200) {
          console.log('添加成功', data)
          vm.onAddLevel1Cancle()
          vm.getCategoryList(data.results.id)
        } else {
          TipBoxService.open(data.exception, 1)
        }
      })
    },
    // 添加导航——取消
    onAddLevel1Cancle () {
      this.newCategory = ''
      this.isShowCategoryDialog = false
    },
    // 编辑导航
    onEditLevel1 (index, isNew) {
      this.isEdit = true
      this.editIndex = index
      this.editCategory = this.categoryList[index]
      console.log('editCategory', this.editCategory)
      if (isNew) {
        this.editCategory.infos = []
        this.onAddLevel2()
      }
      if (this.editCategory.infos.length === 0) {
        this.onAddLevel2()
      }
    },
    // 修改导航
    onUpdateLevel1: function () {
      let vm = this
      if (vm.checkUpdate()) {
        let level1 = {
          id: vm.editCategory.id,
          infos: vm.editCategory.infos
        }
        console.log('level1', level1)
        LoadingBoxService.open('正在添加,请稍候')
        apiClient.post(vm.url.updateCategory, level1, function (data) {
          LoadingBoxService.close()
          if (data.status === 200) {
            console.log('保存成功', data)
            vm.getCategoryList()
            vm.isEdit = false
            vm.editIndex = -1
            vm.editCategory = []
          } else {
            TipBoxService.open(data.exception, 1)
          }
        })
      } else {
        TipBoxService.open('必填信息不可为空！', 1)
      }
    },
    // 删除导航
    onDeleteLevel1 (index, id) {
      let vm = this
      vm.$confirm('确定删除整个导航？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        apiClient.delete(vm.url.deleteCategory, {id: id}, function (data) {
          LoadingBoxService.close()
          if (data.status === 200) {
            TipBoxService.open('已删除导航！', 0)
            let list = [...vm.categoryList]
            list.splice(index, 1)
            vm.categoryList = [...list]
            if (index === vm.editIndex) {
              vm.editCategory = {}
              vm.editIndex = -1
              vm.isEdit = false
            }
          } else {
            TipBoxService.open(data.exception, 1)
          }
        })
      })
    },
    // 添加子导航
    onAddLevel2 () {
      let item = {'name': '', 'tags': []}
      this.editCategory.infos.push(item)
    },
    // 删除子导航
    onDeleteLevel2 (index) {
      let vm = this
      vm.$confirm('确定删除该导航？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let list = Object.assign({}, vm.editCategory)
        list.infos.splice(index, 1)
        vm.editCategory = Object.assign({}, list)
      })
    },
    // 显示标签组件
    showTags (index) {
      this.editLevel2Index = index
      this.labelData = {
        serviceTag: this.editCategory.infos[this.editLevel2Index].tags,
        resourcetag: this.editCategory.infos[this.editLevel2Index].tags.join(',')
      }
      this.isShowTagDialog = true
    },
    // 保存标签的回调方法
    saveLabel () {
      this.editCategory.infos[this.editLevel2Index].tags = this.labelData.serviceTag
      this.labelData.resourcetag = this.editCategory.infos[this.editLevel2Index].tags.join(',')
      return true
    },
    // 删除标签
    deleteTag (index, indexChild) {
      let item = [...this.editCategory.infos[index].tags]
      item.splice(indexChild, 1)
      this.editCategory.infos[index].tags = item
    },
    // 转换服务展示内容文字
    setTypeText (str) {
      let text = str === '2' ? '一个网页' : '数据'
      return text
    },
    // infos为空校验
    checkUpdate () {
      let flag = true
      let item = this.editCategory.infos
      item.forEach(function (v, i) {
        if (!v.name.length || !v.tags.length) {
          flag = false
        }
      })
      return flag
    }
  }
}
</script>
<style src="../../css/categoryManage.css" scoped></style>
<style>
.io-category-manage .add-category-dialog {
  width: 450px;
  border-radius: 5px;
}
.io-category-manage .add-category-dialog .el-dialog__header {
  width: 100%;
  padding: 15px 15px 10px 15px;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
}
.io-category-manage .add-category-dialog .el-dialog__close  {
  transform: scale(0.8,0.8) translateY(-5px);
}
.io-category-manage .add-category-dialog .el-dialog__body {
  width: 100%;
  padding: 35px 40px 10px 40px;
}
.io-category-manage .add-category-dialog .el-dialog__footer {
  padding: 0;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
}
.io-category-manage .add-category-dialog .dialog-footer .el-button {
  color: #ffffff;
  float: left;
  height: 40px;
  border-radius: 0px;
  width: 50%;
  margin: 0 !important;
}
.io-category-manage .add-category-dialog .el-button--primary {
  background-color: #7fa6f3;
  border-color: #7fa6f3;
  border-bottom-left-radius: 5px;
}
.io-category-manage .add-category-dialog .el-button--default {
  background-color: #e2e2e2;
  border-color: #e2e2e2;
  border-bottom-right-radius: 5px;
}
</style>
