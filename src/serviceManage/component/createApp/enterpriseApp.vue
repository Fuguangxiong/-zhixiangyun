<template>
<div>
    <div @click="onCreate" class="addGroupBtn" >
      <i class="icon iconfont icon-iconjia"></i>
    </div>
    <!-- 面包屑 -->
    <breadcrumb :data="breadcrumb"></breadcrumb>
    <!-- 筛选条件 -->
    <select-component
          :search-key='searchKey'
          :select-setting='selectSetting'
          :refresh='isSelectRefresh'
          @select='onSelect'>
    </select-component>
    <!-- ／栏目位置 -->
    <div class="queryList">
      <!-- 列表 -->
      <table-component
          :sort-setting='sortSetting'
          :total-number='totalNumber'
          :table-list='tableData'
          @sort='onSort'
          @clickName='onClickName'
          @clickBtn='onClickTableBtn'
          @clickDetail='onClickTableDetail'>
      </table-component>
    </div>
</div>
</template>
<script>
import breadCrumb from '../../../personalConsole/component/publicComponent/breadCrumb'
import apiClient from '../../../publicJs/ApiClient.js'
import LoadingBoxService from '../../../publicJs/LoadingBoxService.js'
import TipBoxService from '../common/TipBoxService.js'
import selectComponent from '../common/selectComponent.vue'
import commonFunc from '../common/commonFunc.js'
import appCommonFunc from '../common/appCommonFunc.js'
import tableComponent from '../common/appTableComponent.vue'
import $ from 'jquery'
export default{
  name: 'appManagerList',
  components: {
    'breadcrumb': breadCrumb,
    selectComponent,
    tableComponent
  },
  data () {
    return {
      breadcrumb: [{name: '应用管理', link: ''}, {name: $.cookie('logintype') === 'PLATFORM' ? '平台应用' : '企业应用', link: ''}],
      searchKey: {}, // 查询关键字
      selectSetting: [], // 筛选项
      isSelectRefresh: false,
        // 分割线
      sortSetting: [], // 排序功能
      totalNumber: 0, // 查询结果的总条数
      tableData: [],
      isFirst: true,
      selectParams: {},
      sortParams: {},
      appSortParams: {},
      sourceType: '1', // 企业服务
      list: [],  // 当前菜单下的按钮集合
      btnArray: [],
      status_code:'1'
    }
  },
  created () {
  },
  mounted () {
    this.init()
  },
  watch: {

  },
  methods: {
    init () {
            // 筛选参数
      this.setSelectData()
      this.setSortSetting()
            // 查询列表数据
            // this.onQuery()
    },
    onSelect: function (params) {
      this.selectParams = {}
      this.selectParams.app_name = params.app_name
      this.selectParams.appStatuses = params.service_status
      this.selectParams.auditStatuses = params.audit_status
      this.onQuery()
    },

    // 创建应用入口
    onCreate () {
      this.$router.push({
        name: 'createApplication'
      })
    },
    setSelectData: function () {
      let vm = this
      vm.searchKey = { label: '应用名称', paramName: 'app_name' }
      let item1 = {
        label: '应用状态',
        paramName: 'service_status',
        button: ['checkbox']
      }
      item1.data = appCommonFunc.getAppStatusDic()
      let item2 = {
        label: '审核状态',
        paramName: 'audit_status',
        button: ['checkbox']
      }
      item2.data = appCommonFunc.getAuditStatusDic(['全部', '待审核', '未通过', '已通过'])
      vm.selectSetting = [item1, item2]
      vm.isSelectRefresh = true
    },
        // 设置排序参数
    setSortSetting: function () {
      let vm = this
      vm.sortSetting = [
        {
          label: '智能',
          paramName: 'znSort',
          sortType: false,
          default: true
        },
        { label: '状态', paramName: 'statusSort', sortType: 'desc' },
        { label: '时间', paramName: 'createDateSort', sortType: 'desc' }
      ]
    },
        // 排序操作
    onSort: function (params) {
      this.sortParams = params
      this.appSortParams = {}
      if (params.sortField !== '') {
        let sortKet = params.sortField
        let sortVla = params.sortType
        this.appSortParams[sortKet] = sortVla
      } else {
        this.appSortParams.znSort = 'desc'
      }
      this.appSortParams.pageNum = params.pageNum
      this.appSortParams.pageSize = params.pageSize
      if (!this.isFirst) {
        this.onQuery()
      }
    },
        // 点击名称，查看详情
    onClickName: function (item) {
      let vm = this
      appCommonFunc.toDetailPage(vm, item)
    },
        // 点击table按钮
    onClickTableBtn: function (str, item) {
      let vm = this
      appCommonFunc.onClickTableBtn(vm, str, item)
    },
        // 点击服务详情内容
    onClickTableDetail: function (str, item) {
      // let vm = this
      // commonFunc.onClickTableDetail(vm, str, item)
    },
        // 查询
    onQuery: function () {
      let vm = this
      let params = $.extend({}, vm.selectParams, vm.appSortParams)
            // params.sourceType = vm.sourceType;
      console.log('查询条件：', vm.selectParams)
      vm.isFirst = false
      LoadingBoxService.open('正在查询，请稍候...')
      apiClient.post('/itsmApi/application/queryEnterpriseAppList', params, function (data) {
        LoadingBoxService.close()
        if (data.status === 200) {
          vm.totalNumber = data.results.total
          let dataList = [...data.results.data]
          vm.tableData = vm.onCreatTable(dataList)
        } else {
          TipBoxService.open(data.exception, 2)
        }
      })
    },
        // 生成服务列表数据
    onCreatTable: function (dataList) {
      let vm = this
      let tableData = []
      dataList.forEach(function (v, i) {
        let obj = Object.assign({}, v)
        obj.sourceType = vm.sourceType
        obj.status_code = vm.status_code
        obj.detail = [
                { label: '创建者', value: v.true_name, width: 'short' },
          {
            label: '应用状态',
            value: appCommonFunc.getAppStatusStr(v.app_status),
            width: 'short'
          },
          {
            label: '版本号',
            value: v.app_version,
            width: 'short'
          },
          {
            label: '服务数',
            value: v.serviceNum ? v.serviceNum : 0,
            str: 'userNumInfo',
            width: 'short'
          },
          {
            label: '应用介绍',
            value: v.app_remark ? v.app_remark : '',
            width: 'long'
          }
        ]
                // 列表每行右侧模块
        obj.rightBlock = {
          label: '开通时间',
          value: commonFunc.formatDate(v.create_time, 'yyyy-MM-dd HH:mm:ss')
        }
                // 水印、
        obj.watermarkClass = appCommonFunc.addWatermark(obj.audit_status)
                // 高级 按钮 功能
        obj = appCommonFunc.addSeniorBtns(obj)
                // 右侧hover功能
        obj.rightBlock.button = appCommonFunc.addRightBtn(obj)
                // 标签
        obj = appCommonFunc.addTag(obj)

        tableData.push(obj)
      })
      return tableData
    }
  }
}
</script>
<style src="../../css/common/appTableComponent.css" scoped></style>
