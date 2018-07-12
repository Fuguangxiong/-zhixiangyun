<template>
  <div class="mode-div lanm-con lanm-con-bo checkresult">
    <div class="title">
      <i></i> {{dataHead}}
      <div class="commonTableSearch">
        <i class="commonTableSearchIcon  iconfont icon-sousuo" v-on:click="getDataTable"></i>
        <input class="commonTableSearchInput" placeholder="请输入关键字" v-on:keyup.enter="getDataTable" v-model="keyWord" />
      </div>
    </div>
    <div class="tipMsg" v-show="dataTable.length === 0">{{searchResultMsg}}</div>
    <div class="bo-right" v-show="dataTable.length !== 0">
      <div class="filter">
        <div @mouseleave="dataTagshow=false" @click="dataTagshow = !dataTagshow" class="filterItem tagSelct">
          <span :title="resources">{{resources}}</span><i class="iconfont icon-xiala1"></i>
          <div class="tagbox" v-show="dataTagshow">
            <p :title="item" v-for="(item,index) in showLabels" @click="changeLabel(item)" :key="index">{{item}}</p>
          </div>
        </div>
      </div>
      <div class="results">
        <div class="dataTable" @mouseenter="tableSelectionChange(item)" v-for="(item, index) in dataTable" :key="index">
          <i class="iconfont icon-jiance1"></i>
          <span class="name">服务资源名称： <a :title="item.name" href="javascript:;" @click="viewResource(item.id,item.name)">{{item.name}}</a></span>
          <div class="content">
            <div class="line">
              <span>资源标签：
                <span :title="item.recordTag">{{item.recordTag}}</span>
              </span>
            </div>
            <div class="line">
              <span>资源说明：
                <span :title="item.recordDesc">{{item.recordDesc}}</span>
              </span>
            </div>
          </div>
          <span class="status">
            <span v-if="verifyPermission('009005001')">
              <el-switch class="switch"
                v-model="item.usableStatus"
                on-text="可用"
                off-text="不可用"
                on-color="#55a8fd"
                off-color="#cccccc"
                on-value=1
                off-value=0
                :width="64"
                @change="changeStatus($event, item.id)">
              </el-switch>
            </span>
          </span>
          <span class="action">
            <span v-if="verifyPermission('009005002')" class="test" title="检测" @click="check(item.id, item.name)"><i class="iconfont icon-jiance"></i></span>
            <span v-if="verifyPermission('009005003')" class="history" title="历史报告" @click="viewTaskList(item.id)"><i class="iconfont icon-xiangqing"></i></span>
          </span>
        </div>
        <div class="zxf_pagediv">
          <div class="block" v-show="showpagination">
            <el-pagination @current-change="handleCurrentChange" layout="total,prev,pager,next,jumper" :current-page.sync="pageNum" :page-size="pagesize" :total="searchResultNum" :page-sizes="pageSizes" @size-change="sizeChange">
            </el-pagination>
          </div>
        </div>
      </div>
    </div>
    <el-dialog title="任务创建" :visible.sync="taskCreateVisible" size="small" class="creatdialog">
      <el-form :model="form" ref="form" :rules="taskRule">
        <el-form-item label="任务名称:" :label-width="formLabelWidth" prop="taskName">
          <el-input v-model="form.taskName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="选择检测数据:" :label-width="formLabelWidth" v-show="!isChecked" prop="selectedOptions">
          <el-cascader :options="form.selectData" :props="form.props" v-model="form.selectedOptions" :show-all-levels="false" @change="cascaderChange" size="large"></el-cascader>
        </el-form-item>
        <el-form-item label="资源项:" :label-width="formLabelWidth" prop="resourceId">
          <el-select v-model="form.resourceId" placeholder="请选择资源项"  v-if="isChecked" :disabled="isChecked">
            <el-option v-for="(item, index) in dataTable" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
          <el-select v-model="form.resourceId" placeholder="请选择资源项" v-if="!isChecked">
            <el-option v-for="(item, index) in resourceList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择方案:" :label-width="formLabelWidth" prop="schemeId">
          <el-select v-model="form.schemeId" placeholder="请选择方案">
            <el-option v-for="(item, index) in schemeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
          <el-button type="text" @click="createScheme">新建方案</el-button>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <button class="btnGray btnSpace" @click="closeFormDialog">取 消</button>
        <button class="btnGreen" @click="submitForm('form')">确 定</button> 
      </div>
    </el-dialog>
    <el-dialog title="历史报告" :visible.sync="dialogTableVisible" size="large" :modal="false"  class="reportdialog">
      <div class="report-list">
        <div v-for="(item,index) in taskList" :key="index" class="row element-row" v-show="taskList!==''">
          <div class="row">
            <div class="col-xs-5" :title="item.resourceName"><span class="strong">任务名称：</span>{{item.resourceName}}</div>
            <div class="col-xs-3"><span class="strong">可靠性：</span>{{(item.dataCheckStatistics.fullyUsableNum / item.totalNum * 100).toFixed(2)}}%</div>
            <div class="col-xs-3 limit-width" :title="item.createTime|time"><span class="strong">检测时间：</span>{{ item.createTime|time }}</div>
            <div class="col-xs-1">
              <i class="iconfont icon-xiangqing1" @click="viewReport(item.id,item.name)" title="查看报告"></i>
            </div>
            <!-- <div class="col-xs-12 row"><span class="col-xs-3">主要错误说明：</span><span class="col-xs-9 row" v-html="formatter(item)"></span></div> -->
            <div v-html="formatter(item)"></div>
          </div>
          
        </div>
        <div v-show="taskList==''" class="nonedata">暂无数据</div>
        <div class="zxf_pagediv">
          <div class="block"  v-show="subShowPagination">
            <el-pagination
              @current-change="subHandleCurrentChange"
              layout="prev,pager,next,jumper"
              :current-page.sync="subPageNum"
              :total="subSearchResultNum"
              @size-change="subSizeChange"
              v-show="subPageNum>1">
            </el-pagination>
          </div>
        </div>
      </div>
    </el-dialog>
    <!-- 查看报告模态框 -->
    <PopupDetail :show.sync="showReportDetail" @showHistory="showHistory" :title="showReportName">
      <div slot="component">
        <TestReport :id="showReportId"/>
      </div>
    </PopupDetail>
    <PopupDetail :show.sync="showResourceDetail" :title="showResourceName">
      <div slot="component">
        <ResouceDetail :resId="showResourceId"/>
      </div>
    </PopupDetail>
  </div>
</template>

<script>
import apiClient from '@/publicJs/ApiClient.js'
import UtilService from '@/publicJs/UtilService'
import { Loading } from 'element-ui'
import _ from 'lodash'
import TipBoxService from '@/publicJs/TipBoxService'
import commonTableComponent from '@/publicComponent/commonTableComponent.vue'
import LoadingBoxService from '@/publicJs/LoadingBoxService'
import PopupDetail from '../../popupDetails/CompDetail'
import TestReport from './testReport'
import ResouceDetail from '../dataResourcesFillInFormDetail'
import privibutton from '@/publicComponent/privibutton'
// var validateselectedOptions = (rule, value, callback) => {
//   if (!binData.isChecked && value.length === 0) {
//     callback(new Error('请选择检测数据'))
//   } else {
//     callback()
//   }
// }

export default {
  name: 'result',
  components: {
    commonTableComponent, PopupDetail, TestReport, ResouceDetail, privibutton
  },
  data () {
    return {
      resources: '资源标签',
      dataTagshow: false,
      // tab选中的标签页
      type: 'result',
      // 树加载标志
      treeLoad: false,
      // 树数据
      treeData: [],
      // 菜单名称
      dataHead: '检测结果',
      // 搜索提示信息
      searchResultMsg: '请选择左侧菜单',
      // 标签数组
      labels: [],
      // 查询的表格数据
      dataTable: [],
      // 查询出得标签列表
      showLabels: [],
      // 选择得标签id
      selectId: '',
      // 搜索关键字
      keyWord: '',
      // 主页分页模块内容
      // 页数
      pageNum: 1,
      // 每页数量
      pagesize: 10,
      // 可选页数
      pageSizes: [10, 20, 50],
      // 分页模块显示标志
      showpagination: false,
      // 查询结果数量
      searchResultNum: 0,

      // 弹出框分页模块和其他内容
      // 页数
      subPageNum: 1,
      // 每页数量
      subPageSize: 10,
      // 分页模块显示标志
      subShowPagination: false,
      // 查询结果数量
      subSearchResultNum: 0,
      // 弹出显隐控制
      dialogTableVisible: false,
      // 任务列表数据
      taskList: [],
      // 列表加载标志
      subTableLoad: false,
      // 查看报告时的资源id
      resourceId: '',

      // 排序
      sort: 'desc',
      // 是否多选标志
      isMultiple: false,
      // 一级菜单不让模糊查询和按时间排序
      isHandleSearch: false,
      // 表格加载状态
      tableLoad: false,
      // 表格选中的对象
      tableSelection: '',
      // 创建任务页面标志
      taskCreateVisible: false,
      // 任务名称
      taskName: '',
      // 是否已选择数据标志
      isChecked: false,
      // 通过菜单查询的资源列表
      resourceList: [],
      // 方案列表
      schemeList: [],
      // 详情模态框数据
      showReportDetail: false,
      showReportId: '',
      showReportName: '',
      showResourceDetail: false,
      showResourceId: '',
      showResourceName: '',
      // 任务列表校验规则
      taskRule: {
        taskName: [
          { required: true, message: '任务名称不能为空', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        selectedOptions: [
          { validator: this.validateselectedOptions, trigger: 'change' }
        ],
        resourceId: [
          { required: true, message: '选择资源项', trigger: 'change' }
        ],
        schemeId: [
          { required: true, message: '选择方案', trigger: 'change' }
        ]
      },
      form: {
        taskName: '',
        selectData: [],
        selectedOptions: [],
        resourceId: '',
        resourceName: '',
        schemeId: '',
        props: {
          value: 'id',
          label: 'name'
        }
      },
      formLabelWidth: '200px',
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  methods: {
    showHistory () {
      this.dialogTableVisible = true
    },
    changeDataType (type) {
      this.type = type
    },
    getTreeData () {
      this.treeLoad = true
      apiClient.get('/rcapi/catalog/getTab', { type: 'data' }).then(data => {
        // console.log(data)
        this.treeData = data
        this.treeLoad = false
        this.form.selectData = UtilService.filterChildren(data)
      }, errorObj => {
        this.treeLoad = false
      })
    },
    handleNodeClick (data) {
      // if (node.level === 1) {
      //   this.dataHead = ''
      //   this.showpagination = false
      //   this.searchResultMsg = ''
      //   this.dataTable.splice(0)
      //   this.isHandleSearch = false
      // } else {
      // console.log(data)
      this.dataHead = data.name
      this.labels = data.labels
      this.getDataTable()
      this.isHandleSearch = true
      // }
    },
    filterNode (value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    // 移动当前第几页
    handleCurrentChange (val) {
      this.pageNum = val
      this.getDataTable()
    },
    // 改变页面大小
    sizeChange (pagesize) {
      this.pagesize = pagesize
      this.pageNum = 1
      this.getDataTable()
    },
    changeLabel (item) {
      this.resources = item
      if (item === '全部标签') {
        this.selectId = ''
      } else {
        this.selectId = item
      }
      this.getDataTable(1)
    },
    getDataTable (type) {
      LoadingBoxService.open('数据加载中...')
      this.dataTable.splice(0)
      this.tableLoad = true
      this.searchResultMsg = ''
      this.showpagination = false
      this.tableSelection = ''
      let url = ''
      let params
      url = '/rcapi/findResourceItems'
      params = {
        searchParam: this.keyWord,
        pageNum: this.pageNum,
        pageSize: this.pagesize,
        resourceType: 0, // 资源类型
        tags: this.labels.join(','),
        selectTags: this.selectId,
        status: 2,
        sort: this.sort
      }
      apiClient.get(url, params).then(data => {
        // console.log(data)
        if (data === null || data.totalNum === 0) {
          LoadingBoxService.close()
          this.showpagination = false
          this.searchResultMsg = '暂无数据'
        } else {
          // this.dataTable = _.map(data.dataList, function (item) {
          //   if (typeof item.usableStatus === 'number') {
          //     item.usableStatus = String(item.usableStatus)
          //   }
          //   return item
          // })
          // console.log(data.dataList[1].usableStatus)
          LoadingBoxService.close()
          this.dataTable = data.dataList
          this.searchResultNum = data.totalNum
          if (this.dataTable.length > 0) {
            this.showpagination = true
          }
        }

        if (type !== 1) { // 刷新label下拉的内容
          // this.showLabels = this.changeLabelType(data.labels.split(','))
          this.showLabels = data.labels.split(',')
          this.showLabels.unshift('全部标签')
        }
        this.tableLoad = false
      }, error => {
        LoadingBoxService.close()
        if (error.response && error.response.status === 404) {
          this.searchResultMsg = 'API不存在或无法访问'
        } else {
          this.searchResultMsg = '检索数据失败, 访问API服务异常'
        }
        this.tableLoad = false
      })
    },
    changeLabelType (labels) {
      let labelList = []
      for (let i = 0; i < labels.length; i++) {
        labelList.push({ text: labels[i], value: labels[i] })
      }
      return labelList
    },
    filterTag (value, row) {
      return false
    },
    cascaderChange (value) {
      // 级联下拉更改
      if (value.length < 2) {
        return
      }
      let loadingInstance = Loading.service({ fullscreen: true })
      let params = {
        pageNum: 1,
        pageSize: 1000,
        resourceType: 0, // 资源类型
        rootId: value[0],
        selectedId: value[value.length - 1]
      }
      apiClient.get('/rcapi/findResourceItemsById', params).then(data => {
        this.resourceList = data.dataList
        loadingInstance.close()
      })
    },
    // 列表选中项发生变化得时候触发
    tableSelectionChange (val) {
      this.tableSelection = val
    },
    // 查询方案列表
    getSchemeList (resourceId) {
      let url = '/rcapi/dataCheckSpecs/resource/' + resourceId
      apiClient.get(url, {
        usable: '1'
      }).then(data => {
        this.schemeList = data
      }, error => {
        if (error.response && error.response.status === 404) {
          this.searchResultMsg = 'API不存在或无法访问'
        } else {
          this.searchResultMsg = '检索数据失败, 访问API服务异常'
        }
      })
    },
    // 检测按钮响应方法
    check (resourceId, resourceName) {
      if (resourceId === '') {
        // 无选择内容时
        this.form.resourceId = '' // 清空选中值
        this.isChecked = false
        this.taskCreateVisible = true
      } else {
        // 选择一条记录时
        this.getSchemeList(resourceId)
        this.form.selectedOptions = []
        this.form.resourceId = resourceId // 给下拉赋值
        this.form.resourceName = resourceName // 下拉资源得名称
        this.isChecked = true
        this.taskCreateVisible = true
      }
    },
    // 创建方案
    createScheme () {
      if (this.isChecked) {
        this.$router.push('/newScheme?resourceId=' + this.tableSelection.id + '&resourceName=' + this.tableSelection.name)
      } else {
        this.$router.push({name: 'newScheme'})
      }
    },
    // 提交任务
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          LoadingBoxService.open('数据加载中...')
          apiClient.post('/rcapi/dataCheckTask/check', {
            name: this.form.taskName,
            resourceId: this.form.resourceId,
            dataCheckSpecs: {
              id: this.form.schemeId
            }
          }).then(data => {
            if (data) {
              this.taskCreateVisible = false
              TipBoxService.open('任务提交成功', 0)
              this.clearFormField('form')
            } else {
              TipBoxService.open('任务提交失败', 2)
            }
            LoadingBoxService.close()
          }, error => {
            if (error.response && error.response.status === 404) {
              this.searchResultMsg = 'API不存在或无法访问'
            } else {
              this.searchResultMsg = '检索数据失败, 访问API服务异常'
            }
            LoadingBoxService.close()
          })
        } else {
          return false
        }
      })
    },
    closeFormDialog () {
      this.taskCreateVisible = false
      this.clearFormField('form')
    },
    // 清除弹出框中表格的数据
    clearFormField (formName) {
      this.$refs[formName].resetFields()
    },
    viewTaskList (resourceId) {
      if (resourceId === '') {
        TipBoxService.open('请先选择一条资源记录', 2)
      } else {
        this.resourceId = resourceId
        this.dialogTableVisible = true
        this.getTasksByResouceId()
      }
    },
    viewReport (id, name) {
      // window.open('/rc/dataCheck/testReport?id=' + jobId, '_blank')
      this.showReportDetail = true
      this.dialogTableVisible = false
      this.showReportId = id
      this.showReportName = '《' + name + '》' + '数据质量检测报告'
    },
    viewResource (id, name) {
      this.showResourceDetail = true
      this.showResourceId = id
      this.showResourceName = '《' + name + '》' + '数据资源详情'
    },
    // 弹出框分页控件方法
    // 移动当前第几页
    subHandleCurrentChange (val) {
      this.subPageNum = val
      this.getTasksByResouceId()
    },
    // 改变页面大小
    subSizeChange (pagesize) {
      this.subPageSize = pagesize
      this.subPageNum = 1
      this.getTasksByResouceId()
    },
    getTasksByResouceId () {
      LoadingBoxService.open('数据加载中...')
      this.taskList.splice(0)
      this.subTableLoad = true
      this.subShowPagination = false
      let url = ''
      let params
      url = '/rcapi/dataCheckTask/list'
      params = {
        pageNum: this.subPageNum,
        pageSize: this.subPageSize,
        taskStatus: 'FINISH',
        resourceId: this.resourceId
      }
      apiClient.get(url, params).then(data => {
        if (data === null || data.totalNum === 0) {
          this.subShowPagination = false
          LoadingBoxService.close()
        } else {
          this.taskList = data.data
          this.subSearchResultNum = data.total
          LoadingBoxService.close()
          if (this.taskList.length > 0) {
            this.subShowPagination = true
            LoadingBoxService.close()
          }
        }
        this.subTableLoad = false
      }, error => {
        if (error.response && error.response.status === 404) {
          // 提示信息
        } else {
          // 提示信息
        }
        this.subTableLoad = false
        LoadingBoxService.close()
      })
    },
    formatter (row) {
      let resMap = _.map(JSON.parse(row.dataCheckStatistics.errorColumnStatistics), function (value, key) {
        return { 'sortId': value, 'value': '字段“' + key + '” 有' + value + '处错误' }
      })
      let orderMap = _.orderBy(resMap, ['sortId'], ['desc'])
      if (orderMap.length > 0) {
        let resultStr = ''
        for (let i = 0; i < orderMap.length; i++) {
          if (i === 0) {
            resultStr = '<span class="col-xs-5"><span class="strong">主要错误说明：</span>' + orderMap[i].value + '</span>'
          }
          resultStr += '<span class="col-xs-3">' + orderMap[i].value + '</span>'
          if (i === 1) {
            return resultStr
          }
        }
        return resultStr
      } else {
        return ''
      }
    },
    validateselectedOptions (rule, value, callback) {
      if (!this.isChecked && value.length === 0) {
        callback(new Error('请选择检测数据'))
      } else {
        callback()
      }
    },
    changeStatus (usable, id) {
      apiClient.get('/rcapi/updateResourcesUsableStatus', { resourceId: id, usableStatus: usable }).then(data => {
        TipBoxService.open('修改成功')
      }, error => {
        console.error(error)
        TipBoxService.open('修改失败', 0)
        this.getSchemeList()
      })
    }
  },
  mounted () {
    // this.getTreeData()
    this.$emit('changeTab', 'result')
    this.$parent.$parent.hub.$on('handleNodeClick', (data) => {
      this.handleNodeClick(data)
    })
  }
}
</script>

<style src="../../css/dataTable.css" scoped></style>
<style src="../../css/filter.css" scoped></style>
<style scoped>
.title {
  height: 40px;
  line-height: 40px;
  background-color: #fff;
  margin-bottom: 5px;
}

.title > i {
  display: inline-block;
  width: 20px;
  height: 16px;
  background-image: url(../../images/status.png);
  background-size: 20px 16px;
  position: relative;
  top: 4px;
}
.title .commonTableSearch {
  height: 40px;
}
.tipMsg {
  height: 1000px;
  line-height: 200px;
  text-align: center;
}
i.icon-xiala1 {
  font-size: 12px;
}
.results .dataTable .content {
  flex: 3;
}
.results .dataTable .icon-jiance1 {
  color: #33D48D;
}
.results .dataTable .name {
  flex: 2;
  text-align: left;
  color: #000;
  display: flex;
  min-width: 230px;
}
.results .dataTable .name a {
  text-decoration: none;
  height: 30px;
  line-height: 30px;
  margin-top: 41px;
  white-space: nowrap;
  text-overflow:ellipsis;
  overflow:hidden;
  display: inline-block;
  max-width: 150px;
}
.results .dataTable .action span {
  padding: 0 10px;
}
.results .dataTable .action span i {
  cursor: pointer;
}
.block {
  text-align: center;
}
.nonedata {
  text-align: center;
  color: #777;
}
</style>
<style>
  .reportdialog .strong{
    color: #222;
  }
  .reportdialog .el-dialog__body{
    color: #888;
  }
  .report-list span, .limit-width{
    white-space: nowrap;
    text-overflow:ellipsis;
    overflow:hidden;
  }
  .creatdialog .dialog-footer{
    text-align: center;
  }
  .creatdialog .el-dialog__header,.reportdialog .el-dialog__header{
    background-color: #56A8FE;
    height: 40px;
  }
  .creatdialog .el-dialog__title,.reportdialog .el-dialog__title{
    color: #fff;
    font-size: 16px;
    font-weight: normal;
  }
  .creatdialog .el-dialog__headerbtn .el-dialog__close{
    color: #fff;
  }
  .creatdialog label{
    font-weight: 400;
    padding-right: 20px;
  }
  .creatdialog .el-dialog__body{
    padding: 30px 0px 10px 0px;
  }
  .creatdialog .dialog-footer{
    padding-bottom: 20px;
  }
  .creatdialog .el-form-item.is-required .el-form-item__label:before{
    content: '';
  }
  .creatdialog input.el-input__inner{
    width: 240px;
  }
  .creatdialog .el-select .el-input .el-input__icon {
    right: 20px;
}
  .creatdialog .el-button.el-button--text span{
    margin-left: 10px;
  }
  .checkresult .el-dialog--large{
    width: 70%;
  }
  .report-list .element-row.row{
    height: 60px;
    border: 1px solid #ccc;
    background-color: #fff;
    padding: 6px 12px;
    line-height: 24px;
    font-size: 12px;
    margin-bottom: 10px;
  }
  .element-row .col-xs-1,.element-row .col-xs-3,.element-row .col-xs-5{
    padding: 0 5px;
  }
  .report-list .row{
    margin: 0;
  }
  .col-xs-1{
    text-align: center;
  }
  .col-xs-1 >i{
    cursor: pointer;
    font-size: 20px;
    color: #55a8fd;
    position: relative;
    top: 12px;
  }
  .checkresult .el-dialog__wrapper{
   z-index: 900 !important;
  }
  .v-modal{
   z-index: 850 !important;
  }

/* 开关修改 */
.switch .el-switch__core,.switch .el-switch__label {
  height: 20px;
}
.switch .el-switch__label span {
  font-size: 12px;
}
.switch .el-switch__core .el-switch__button {
  width: 14px;
  height: 14px;
}
  .reportdialog .el-dialog__body{
    padding: 30 30px;
  }
</style>

