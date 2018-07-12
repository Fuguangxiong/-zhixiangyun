<template>
  <div class="rcIndex">
    <LableList :show="isDetail" :type="dataType" :treeData="treeData" @handleNodeClick="handleNodeClick" @changeLable="changeDataType" @toggleDetail="toggleDetail" @showmenu1="showmenu1" />
    <div v-show="!isDetail" style="overflow:auto;position:absolute;top:75px;bottom:0;left:0;right:0">
      <div class="treeBox clearfix">
        <div v-for="(item,index) in treeData" :key="index">
          <Tree :treeData="item" @handleNodeClick="handleNodeClick"></Tree>
        </div>
      </div>
    </div>
    <div class="detailBox" style="overflow:auto;position:absolute;top:16px;bottom:0;left:0;right:0" v-show="isDetail">
      <div class="title">
        <i></i>
        <span>{{dataHead}}</span>
        <div class="commonTableSearch" v-show="isDetail">
          <i class="commonTableSearchIcon iconfont icon-sousuo" @click="handleSearch"></i>
          <input type="text" placeholder="请输入关键字" v-model="keyword" @keyup.enter="handleSearch" class="commonTableSearchInput">
        </div>
      </div>
      <div class="detailContent">
        <DetailContent v-for="(item, index) in dataTable" :key="index" :type="nameType" :item="item" :index="index" @toNextPage="toNextPage"></DetailContent>
      </div>
      <div class="searchResultMsg" v-show="!showpagination">
        {{searchResultMsg}}
      </div>
      <div class="block" v-show="showpagination && searchResultNum > 10">
        <el-pagination @current-change="handleCurrentChange" layout="total,prev,pager,next,jumper" :current-page.sync="pageNum" :page-size="pagesize" :total="searchResultNum" :page-sizes="pageSizes" @size-change="sizeChange">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import LableList from '../catalogConfig/LableList'
import Tree from './tree'
import DetailContent from './detailContent'
import apiClient from '@/publicJs/ApiClient.js'
import LoadingBoxService from '../../../publicJs/LoadingBoxService.js'
import Util from '@/publicJs/Util'
export default {
  components: {
    LableList,
    Tree,
    DetailContent
  },
  mounted () {
    this.$root.$children[0].$children[0].hub.$on('getPriviData', (data) => {
      let firstData = 0
      let firstInterface = 0
      let firstStandard = 0
      for (var i = 0; i < data.length; i++) {
        if (data[i].menuName === '资源目录') {
          for (var j = 0; j < data[i].button.length; j++) {
            var el = data[i].button[j]
            if (el.code === 'rc_data') {
              firstData = 1
            } else if (el.code === 'rc_interface') {
              firstInterface = 1
            } else if (el.code === 'rc_standard') {
              firstStandard = 1
            }
          }
          break
        }
      }
      if (firstData === 1) {
        this.dataType = 'data'
      } else if (firstInterface === 1) {
        this.dataType = 'interface'
      } else if (firstStandard === 1) {
        this.dataType = 'standard'
      }
      this.getTreeData()
    })
    this.getTreeData()
    this.changeResourceType(this.dataType)
    if (this.$route.query.detail) {
      // console.log(111, this.$parent.hub.treeData)
      var detaildata = sessionStorage.getItem('treeData')
      this.detaildata = JSON.parse(detaildata)
      this.isDetail = true
      this.nameType = this.detaildata.type
      this.dataType = this.detaildata.type
      this.labels = this.detaildata.labels
      this.dataHead = this.detaildata.name
      this.getDataTable()
      this.isHandleSearch = true
    }
  },
  data () {
    return {
      detaildata: {},
      hub: new Vue(),
      isDetail: false,
      dataType: 'data',
      searchResultNum: 0,
      pagesize: 10,
      pageNum: 1,
      pageSizes: [10, 20, 50],
      treeData: [],
      filterText: '',
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      isUp: true,
      dataTable: [],
      showpagination: false,
      searchResultMsg: '请选择左侧菜单',
      isData: true,
      isInterface: false,
      isService: false,
      isStandard: false,
      dataHead: '',
      labels: [],
      treeLoad: false,
      resourceType: 0,
      nameType: 'data',
      sort: 'desc',
      isHandleSearch: false, // 一级菜单不让模糊查询和按时间排序
      keyword: ''
    }
  },
  methods: {
    toggleDetail (type) {
      if (this.isDetail) {
        this.dataType = type
        this.getTreeData()
        // console.log(type)
      }
      this.isDetail = !this.isDetail
    },
    showmenu1 (type) {
      if (!this.isDetail) return
      this.dataType = type
      this.changeResourceType(type)
      this.getTreeData()
    },
    changeDataType (type) {
      this.dataHead = ''
      // this.$router.push({ path: '/rc/list-' + type })
      this.dataType = type
      this.nameType = type
      this.getTreeData()
      this.dataTable.splice(0)
      this.showpagination = false
      this.searchResultMsg = ''
      this.changeResourceType(type)
      this.keyword = ''
      this.sort = 'desc'
      this.isUp = true
      this.isHandleSearch = false
    },
    filterNode (value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    handleNodeClick (data) {    // 树的节点点击事件
      // console.log(data)
      if ((!this.isDetail && data.children && data.children.length === 0) || this.isDetail) {
        var treeData
        treeData = JSON.stringify(data)
        sessionStorage.setItem('treeData', treeData)
        this.isDetail = true
        // this.dataType = data.type
        this.nameType = data.type
        this.labels = data.labels
        this.dataHead = data.name
        this.getDataTable()
        this.isHandleSearch = true
      }
      // if (node.level === 1) {
      //   this.dataHead = ''
      //   this.showpagination = false
      //   this.searchResultMsg = ''
      //   this.dataTable.splice(0)
      //   this.isHandleSearch = false
      // } else {
      //   //this.isDetail = true
        // this.dataHead = data.name
        // this.labels = data.labels
        // this.getDataTable()
        // this.isHandleSearch = true
      // }
    },
    sizeChange (pagesize) {
      this.pagesize = pagesize
      this.pageNum = 1
      this.getDataTable()
    },
    handleCurrentChange (val) {
      this.pageNum = val
      this.getDataTable()
    },
    getTreeData () {
      this.treeLoad = true
      apiClient.get('/rcapi/catalog/getTab', { type: this.dataType }).then(data => {
        // console.log(data)
        this.treeData = data
        this.treeLoad = false
      }, errorObj => {
        this.treeLoad = false
      })
    },
    timeSortHandler () {
      if (this.isHandleSearch) {
        this.isUp = !this.isUp
        if (this.isUp) {
          this.sort = 'desc'
        } else {
          this.sort = 'asc'
        }
        this.pageNum = 1
        this.getDataTable()
      }
    },
    getDataTable () {
      this.dataTable.splice(0)
      LoadingBoxService.open('数据加载中...')
      this.searchResultMsg = ''
      this.showpagination = false
      let url = ''
      let params
      if (this.dataType === 'standard') {
        url = '/rcapi/metadata/queryByLabels'
        params = {
          keyword: this.keyword,
          pageNum: this.pageNum,
          pageSize: this.pagesize,
          labels: this.labels.join(','),
          approvalStatusList: 2,
          sortType: this.sort
        }
      } else if (this.dataType === 'interface') {
        url = '/itsmApi/atomicService/selectServiceForResource'
        params = {param: {keyword: this.keyword,
          serviceType: '1', // 归属应用，默认远程服务-1
          pageConfType: '3', // 页面配置类型 纯数据请求
          pageNum: this.pageNum,
          pageSize: this.pagesize,
          labels: this.labels.join(','),
          approvalStatusList: [2],
          sortType: this.sort}}
        apiClient.post(url, params).then(data => {
          LoadingBoxService.close()
          // console.log(data)
          if (data === null || data.totalNum === 0) {
            this.showpagination = false
            this.searchResultMsg = '没有查找到结果！'
          } else {
          // console.log(data.dataList)
            this.dataTable = data.dataList
            this.searchResultNum = data.totalNum
            if (this.dataTable.length > 0) {
              this.showpagination = true
            }
          }
        }, error => {
          LoadingBoxService.close()
          if (error.response && error.response.status === 404) {
            this.searchResultMsg = 'API不存在或无法访问'
          } else {
            this.searchResultMsg = '检索数据失败, 访问API服务异常'
          }
        })
        return
      } else {
        url = '/rcapi/findResourceItems'
        params = {
          searchParam: this.keyword,
          pageNum: this.pageNum,
          pageSize: this.pagesize,
          resourceType: this.resourceType, // 资源类型
          tags: this.labels.join(','),
          sort: this.sort
        }
      }
      apiClient.get(url, params).then(data => {
        LoadingBoxService.close()
        // console.log(data)
        if (data === null || data.totalNum === 0) {
          this.showpagination = false
          this.searchResultMsg = '没有查找到结果！'
        } else {
          // console.log(data.dataList)
          this.dataTable = data.dataList
          this.searchResultNum = data.totalNum
          if (this.dataTable.length > 0) {
            this.showpagination = true
          }
        }
      }, error => {
        LoadingBoxService.close()
        if (error.response && error.response.status === 404) {
          this.searchResultMsg = 'API不存在或无法访问'
        } else {
          this.searchResultMsg = '检索数据失败, 访问API服务异常'
        }
      })
    },
    toNextPage (id) {
      let url
      if (this.dataType === 'standard') {
        url = '/metadata/list/detail/' + id
        document.cookie = 'dataHead=' + encodeURIComponent(this.dataHead)
      } else if (this.dataType === 'interface') {
        url = '/interfaceSummary?id=' + id
      } else {
        url = '/dataDetail?resourcetype=' + this.resourceType + '&id=' + id
        // url = 'dataResourcesFillInFormDetail?resourcetype=' + this.resourceType + '&id=' + id
        // this.$router.push('dataResourcesFillInFormDetail?resourcetype=' + this.resourceType + '&id=' + id)
      }
      this.$router.push(url)
    },
    handleSearch () {
      if (this.isHandleSearch) {
        this.getDataTable()
      }
    },
    changeResourceType (type) {
      if (type === 'data') {
        this.isData = true
        this.isInterface = false
        this.isService = false
        this.isStandard = false
        this.resourceType = 0
      } else if (type === 'interface') {
        this.isData = false
        this.isInterface = true
        this.isService = false
        this.isStandard = false
        this.resourceType = 1
      } else {
        this.isData = false
        this.isInterface = false
        this.isService = false
        this.isStandard = true
        this.resourceType = 2
      }
    }
  },
  watch: {
    filterText (val) {
      this.$refs.tree.filter(val)
    }
  }
}
</script>
<style src="../../css/default.css" scoped></style>
<style scoped>
.treeBox {
  padding: 15px;
  background-color: #fff;
  min-width: 890px;
  /* overflow-x: auto; */
}
.treeBox > div {
  padding: 10px;
  width: 33.3%;
  float: left;
}
.rcIndex {
  position: relative;
  height: 100%;
  min-width: 800px;
}

.detailBox {
  margin-left: 50px;
  background-color: #fff;
  padding: 0 15px;
  box-shadow: 0 0 3px 2px #dedede;
}

.detailBox .title {
  height: 50px;
  line-height: 50px;
  background-color: #fff;
}

.detailBox .title > i {
  /* border: 1px solid #63ADFD;
  border-radius: 100%; */
  display: inline-block;
  width: 20px;
  height: 16px;
  background-image: url(../../images/status.png);
  background-size: 20px 16px;
  position: relative;
  top: 4px;
}
.detailBox .title .icon-sousuo {
  line-height: 28px;
}

.detailContent {
  padding-bottom: 10px;
}

.searchResultMsg {
  text-align: center;
  height: 480px;
  padding-top: 70px;
}
.block {
  text-align: center;
}
.commonTableSearchIcon {
  cursor: pointer;
}
</style>
