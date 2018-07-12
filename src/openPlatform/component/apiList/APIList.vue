<template>
  <div id="APIList">
    <public-header @getList="onQuery" :params="params"></public-header>

    <div class="api-list">
      <!-- 搜索 -->
      <div class="api-list-search">
        <input type="text" v-model="params.serviceName" @keyup.enter="onSearch" placeholder="请输入关键字搜索" />
        <button @click='onSearch'><i class="iconfont icon-sousuo searchIcon"></i></button>
      </div>

      <!-- start: 工具条 -->
      <div class="api-list-bar">
        <!-- 分类 -->
        <div class="api-list-select">
          <button @click='onOpenCategoryList'><i class="icon iconfont icon-mulu_"></i>API分类</button>
          <ul>
            <li v-for='(item,index) in categoryList' 
                :key='index' 
                :id='item.id'
                :data-tag='item.tags.join(",")'
                @click.stop='onSelect(item.tags.join(","))'>
              <span>{{ item.name }}</span>
              <span>/</span>
              <span v-for='(itemChild,indexChild) in item.infos' 
                    :key='index+"_"+indexChild'
                    :id='item.id+indexChild'
                    :data-tag='itemChild.tags.join(",")'
                    @click.stop='onSelect(itemChild.tags.join(","))'>
                {{itemChild.name}}
                <span>/</span>
              </span>
            </li>
          </ul>
        </div>

        <!-- 排序 -->
        <div class="api-list-sort">
          <label>排序方式：</label>
          <span @click='onSort("zn")' :class="{active:params.order=='zn'}">综合</span>
          <span @click='onSort("sj")' :class="{active:params.order=='sj'}">最新</span>
        </div>
      </div>
      <!-- end: 工具条 -->
    </div>

      <!-- start: 列表 -->
      <div class="api-list-query">
        <div v-for='(item,index) in dataList' 
            :key='index' 
            @click='toDetail(item)'
            :id='item.id'
            v-show="!isData"
            class="api-list-block">
          <div>
            <img :src="apiBaseUrl +'/itsmApi/attachment/show?imgPath='+item.img" alt="logo" />
            <ul>
              <li class="api-list-block-title" :title='item.name'><b>{{item.name}}</b></li>
              <li :title='item.service_brief'>{{item.service_brief}}</li>
            </ul>
          </div>
          <button><i v-show="item.recommend==='recommend'" class="icon iconfont icon-xing1-copy"></i>详情</button>
        </div>
        <div class="isDate" v-show="isData">
          <img src="../../images/nothing.png" alt="未查找到相关数据">
          <p>未查找到相关数据</p>
        </div>
      </div>
      <!-- end: 列表 -->

      <!-- 分页 -->
      <el-pagination v-show='pageTotal>1 & isPaging'
                    layout="prev, pager, next, jumper"
                    :current-page.sync="params.pageNum"
                    :page-size="params.pageSize"
                    :total="totalNumber"
                    @current-change="toPage"
                    class='api-list-pagination'>
      </el-pagination>

    <api-list-bottom></api-list-bottom>
  </div>
</template>

<script>
import $ from 'jquery'
import apiClient from '../../../publicJs/ApiClient.js'
import LoadingBoxService from '../../../publicJs/LoadingBoxService.js'
import TipBoxService from '../../../publicJs/TipBoxService.js'
import publicHeader from '../publicComponent/openPlatformTopNav.vue'
import apiListBottom from './apiListBottom.vue'
export default {
  name: 'APIList',
  components: {
    publicHeader,
    apiListBottom
  },
  data () {
    return {
      isData: false,
      isPaging: true,
      apiBaseUrl: apiClient.apiBaseUrl,
      url: {
        getCategoryList: 'itsmApi/category/getCategoryList',
        onQuery: 'developerApi/api/getServiceAtomicList'
      },
      isCategoryListOpen: false, // 是否显示API分类列表
      categoryList: [], // API分类
      params: {
        serviceName: '', // 查询关键字
        keyWord: '',
        order: 'zn', // 查询结果排序方式，默认智能排序(zn),时间排序(sj)
        pageNum: 1, // 当前页
        pageSize: 25 // 每页显示条数
      },
      totalNumber: 0, // 查询结果的总条数
      dataList: [] // 查询结果
    }
  },
  computed: {
    // 总页数
    pageTotal: function () {
      return Math.ceil(this.totalNumber / this.params.pageSize)
    }
  },
  watch: {
    isCategoryListOpen (nv, ov) {
      if (nv) {
        $('.api-list-select>ul').slideDown('fast')
      } else {
        $('.api-list-select>ul').slideUp('fast')
      }
    }
  },
  created () {
    this.getCategoryList()
    this.onQuery()
  },
  mounted () {
    $('.api-list-select>ul').slideUp(5)
  },
  methods: {
    // 打开关闭API分类列表
    onOpenCategoryList () {
      this.isCategoryListOpen = !this.isCategoryListOpen
    },
    // 获取API分类
    getCategoryList () {
      let vm = this
      apiClient.get(vm.url.getCategoryList, {}, function (data) {
        if (data.status === 200) {
          vm.categoryList = data.results.data
          vm.categoryList.forEach(function (v, i) {
            v.tags = []
            v.infos = JSON.parse(v.infos)
            v.infos.forEach(function (m, n) {
              m.tags.forEach(function (o, j) {
                if (!v.tags.includes(o)) {
                  v.tags.push(o)
                }
              })
            })
          })
          console.log('API分类', data)
        } else {
          TipBoxService.open(data.exception, 2)
        }
      })
    },
    // 关键字查询
    onSearch () {
      this.params.keyWord = ''
      this.params.serviceName = this.params.serviceName.trim()
      if (this.params.serviceName === '') {
        this.onSort('zn')
        this.params.order = 'zn'
      } else {
        this.onQuery()
      }
    },
    // 选择API分类
    onSelect (str) {
      this.params.keyWord = str
      this.params.serviceName = ''
      this.isCategoryListOpen = !this.isCategoryListOpen
      this.onQuery()
    },
    // 排序
    onSort (type) {
      this.params.order = type
      this.params.pageNum = 1
      this.onQuery()
    },
    // 翻页
    toPage (page) {
      if (page >= 1 && page <= this.pageTotal) {
        this.params.pageNum = page
        this.onQuery()
      }
    },
    // 查询
    onQuery () {
      let vm = this
      if (vm.params.serviceName.length) {
        // 校验查询关键字不能为纯数字
        if (vm.checkFullNumber(vm.params.serviceName)) {
          return
        }
        // 校验查询关键字不能为一位汉字
        if (vm.checkOneChineseCharacter(vm.params.serviceName)) {
          return
        }
        // 限制查询关键字长度不能超过20
        if (vm.params.serviceName.length > 20) {
          TipBoxService.open('查询关键字长度不能超过20！', 2)
          return
        }
      }
      LoadingBoxService.open('正在加载，请稍候...')
      apiClient.get(vm.url.onQuery, vm.params, function (data) {
        LoadingBoxService.close()
        if (data.status === 200) {
          if (data.results.total === 0) {
            vm.isData = true
            vm.isPaging = false
            return false
          } else {
            vm.isData = false
            vm.isPaging = true
            vm.totalNumber = data.results.total
            vm.dataList = data.results.data
          }
        } else {
          TipBoxService.open(data.exception, 2)
        }
      })
    },
    // 详情
    toDetail (item) {
      console.log('详情', item)
      this.$router.push({
        path: '/APIdetail',
        query: { id: item.id }
      })
    },
    // 校验查询关键字不能为纯数字
    checkFullNumber (value) {
      let reg = /^[0-9]*$/
      if (reg.test(value) === true) {
        TipBoxService.open('查询关键字不能为纯数字！', 2)
        return true
      } else {
        return false
      }
    },
    // 校验查询关键字不能为一位汉字
    checkOneChineseCharacter (value) {
      let reg = /^[\u4e00-\u9fa5]+$/
      if (reg.test(value) === true && value.length === 1) {
        TipBoxService.open('查询关键字不能是一个纯汉字！', 2)
        return true
      } else {
        return false
      }
    }
  }
}
</script>
<style src="../../css/APIList.css" scoped></style>

