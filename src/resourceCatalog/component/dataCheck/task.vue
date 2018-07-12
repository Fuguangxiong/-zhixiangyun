<template>
  <!--内容开始-->
  <div class="mode-div lanm-con lanm-con-bo">
    <div class="title">
      <i></i> 检测任务
      <div class="commonTableSearch">
        <i class="commonTableSearchIcon  iconfont icon-sousuo" v-on:click="search"></i>
        <input class="commonTableSearchInput" placeholder="请输入关键字" v-on:keyup.enter="search" v-model="keyWord" />
      </div>
    </div>
    <div class="detection_task_main">
      <div class="results_top clearfix">
        <span @click="checkedAll">
          <i class="iconfont check" v-bind:class="{'icon-xuanzhong5':allCheck,'icon-checkbox':!allCheck}"></i>全选</span>
        <span v-if="verifyPermission('009005004')">  
          <span @click="deleteRes">          
          <i class="iconfont icon-3"></i>删除</span>
        </span>  
        <span v-if="verifyPermission('009005005')">  
          <span @click="createCheck">
          <i class="iconfont icon-xinjian"></i>新建任务</span>
        </span>  
        <!-- <button class="report_btn" @click="createCheck">新建任务</button>
                    <button class="detect_btn" @click="deleteRes">删除</button> -->
      </div>
      <div class="tipMsg" v-show="taskData.length === 0">暂无数据</div>
      <div class="checktable">
        <div class="dataTable" v-for="(item, index) in taskData" :key="index">
          <i class="iconfont icon-renwu1"></i>
          <div class="content">
            <div class="line">
              <span>检测任务：
                <span :title="item.name">{{item.name}}</span>
              </span>
              <span>检测资源：
                <span :title="item.resourceName" class="text">{{item.resourceName}}</span>
              </span>
            </div>
            <div class="line">
              <span>检测方案：
                <a :title="item.dataCheckSpecs.name" herf="javascript:;" @click="toSchemeDetail(item.dataCheckSpecs.id,item.dataCheckSpecs.name)">{{item.dataCheckSpecs.name}}</a>
              </span>
              <span>任务创建时间：
                <span :title="item.createTime|time" class="text">{{item.createTime|time}}</span>
              </span>
            </div>
          </div>
          <span class="status">
            <el-progress :status="statusType(item.status)" :show-text="false" type="circle" :width="30" :stroke-width="5" :percentage="parseInt(item.checkedNum/item.totalNum * 100) || 0" :title="parseInt(item.checkedNum/item.totalNum * 100) + '%'">
              <!-- <template scope="scope"><i class="iconfont" :class="{'icon-iconfontplay2':scope.row.status === 'WAITING','icon-iconfontstop':scope.row.status === 'WORKING','icon-wrong':scope.row.status === 'HALT','icon-selected':scope.row.status === 'FINISH',error:scope.row.status === 'ERROR'}"></i></template> -->
            </el-progress>
            <span class="percent">{{(parseInt(item.checkedNum/item.totalNum * 100) || 0) + '%'}}</span>
            <i class="iconfont" :class="{'icon-iconfontplay2':item.status === 'WAITING','icon-iconfontstop':item.status === 'WORKING','icon-close':item.status === 'HALT','icon-selected':item.status === 'FINISH','icon-information':item.status === 'ERROR'}"></i>
            <i v-if="verifyPermission('009005006')" v-show="item.status === 'WORKING'" @click="statusClick(item.status,item.id)" class="iconfont tooltip" title="点击停止"></i>
            <i v-if="verifyPermission('009005007')" v-show="item.status === 'ERROR'" @click="statusClick(item.status,item.id)" class="iconfont tooltip" title="点击重试"></i>
            <span class="statusType">状态： 
              <span style="color:red" v-show="item.status === 'WAITING'">待检测</span>
              <span style="color:#ccc" v-show="item.status === 'HALT'">已停止</span>
              <span style="color:#ccc" v-show="item.status === 'HALTING'">停止中</span>
              <span style="color:#33D48D" v-show="item.status === 'FINISH'">已完成</span>
              <span style="color:#f50" v-show="item.status === 'WORKING'">检测中</span>
              <span style="color:#ff4949" v-show="item.status === 'ERROR'">发生错误</span>
            </span>
          </span>
          <span class="report">
            <span v-show="item.status !== 'FINISH'">-</span>
            <span v-if="verifyPermission('009005008')" @click="viewReport(item.id,item.resourceName)" v-show="item.status === 'FINISH'"><i></i>查看报告</span>
          </span>
          <span class="check">
            <i @click="item_checked(index)" class="iconfont" :class="{'icon-xuanzhong5':item.select,'icon-checkbox':!item.select}"></i>
            <i :class="{disabled:item.status === 'WORKING' || item.status === 'WAITING' || item.status === 'HALTING'}"></i>
          </span>
        </div>
      </div>
      <div class="zxf_pagediv">
        <div class="block" v-show="showpagination && searchResultNum > 10">
          <el-pagination @current-change="handleCurrentChange" layout="total,prev,pager,next,jumper" :current-page.sync="pageNum" :page-size="pagesize" :total="searchResultNum" :page-sizes="pageSizes" @size-change="sizeChange">
          </el-pagination>
        </div>
      </div>
    </div>
    <!-- <el-dialog title="任务创建" :visible.sync="taskCreateVisible" size="small" v-loading.body="taskCreateLoad" element-loading-text="加载中" class="creatdialog"> -->
    <el-dialog title="任务创建" :visible.sync="taskCreateVisible" size="small" class="creatdialog">
      <el-form :model="form" ref="form" :rules="taskRule">
        <el-form-item label="任务名称" :label-width="formLabelWidth" prop="taskName" style="position:relative;">
          <el-input v-model="form.taskName" auto-complete="off" :autofocus="true" @blur="checkName" :class="[nameUnique === true? '' : 'checkError']"></el-input>
          <img src="../../../publicImages/loading_check.gif" class="loading-img" v-show="loadingImg"/>
          <div class="el-form-item__error" :class="[checkInfo === '任务名称可用'?'checkSuccess':'']">{{checkInfo}}</div>
        </el-form-item>
        <el-form-item label="选择检测数据" :label-width="formLabelWidth" prop="selectedOptions">
          <el-cascader :options="form.selectData" :props="form.props" v-model="form.selectedOptions" :show-all-levels="false" @change="cascaderChange"></el-cascader>
        </el-form-item>
        <el-form-item label="资源项" :label-width="formLabelWidth" prop="resourceId">
          <el-select v-model="form.resourceId" placeholder="请选择资源项" @change="changeResource">
            <el-option v-for="(item, index) in resourceList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择方案" :label-width="formLabelWidth" prop="schemeId">
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
    <!-- 查看报告模态框 -->
    <PopupDetail :show.sync="showDetail" :title="showWithName">
      <div slot="component">
        <TestReport :id="showWithId" v-if="showTaskReport"/>
        <SchemeDetail :id="showWithId" v-if="showSchemeDetail"/>
      </div>
    </PopupDetail>
  </div>
  <!--内容结束-->
</template>

<script>
import apiClient from '@/publicJs/ApiClient.js'
import UtilService from '@/publicJs/UtilService'
import TipBoxService from '@/publicJs/TipBoxService'
import NoticeBoxService from '@/publicJs/NoticeBoxService'
import LoadingBoxService from '@/publicJs/LoadingBoxService'
import PopupDetail from '../../popupDetails/CompDetail'
import SchemeDetail from './schemeDetail'
import TestReport from './testReport'
import privibutton from '@/publicComponent/privibutton'
var validateselectedOptions = (rule, value, callback) => {
  if (value.length === 0) {
    callback(new Error('请选择检测数据'))
  } else {
    callback()
  }
}

export default {
  name: 'task',
  components: {PopupDetail, TestReport, SchemeDetail, privibutton},
  data () {
    return {
      // 搜索关键字
      keyWord: '',
      // 全选
      allCheck: false,
      // 分页组件显示标志
      showpagination: true,
      // 当前页数
      pageNum: 1,
      // 每页数量
      pagesize: 10,
      // 可选页数
      pageSizes: [10, 20, 50],
      // 排序
      sort: 'desc',
      // 搜索提示信息
      searchResultMsg: '',
      // 查询结果数量
      searchResultNum: 0,
      // 表格加载标志
      tableLoad: false,
      // 创建任务页面标志
      taskCreateVisible: false,
      // 创建任务页面等标志
      taskCreateLoad: false,
      // 任务列表数据
      taskData: [],
      // taskId 与对象关联
      taskDataMap: {},
      errorJobs: {},
      checkTask: [],
      // 方案列表
      schemeList: [],
      // 通过菜单查询的资源列表
      resourceList: [],
      // 详情模态框数据
      showDetail: false,
      showTaskReport: false,
      showSchemeDetail: false,
      showWithId: '',
      showWithName: '',
      // 重名校验
      nameUnique: true,
      loadingImg: false,
      checkInfo: '',
      // 任务列表校验规则
      taskRule: {
        taskName: [
          { required: true, message: '任务名称不能为空', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        selectedOptions: [
          { required: true, validator: validateselectedOptions, trigger: 'change' }
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
        schemeId: '',
        props: {
          value: 'id',
          label: 'name'
        }
      },
      formLabelWidth: '200px'
    }
  },
  methods: {
    search () {
      this.getTaskData(false)
    },
    checkedAll () {
      this.allCheck = !this.allCheck
      this.taskData.forEach(item => {
        if (item.status === 'FINISH' || item.status === 'HALT') {
          item.select = this.allCheck
        }
      })
    },
    item_checked (i) {
    //   console.log(this.taskData[i].select)
    //   var selected = this.taskData[i].select
    //   if (this.taskData[i].status === 'FINISH' || this.taskData[i].status === 'HALT') {
    //     this.taskData[i].select = !selected
    //   }
    //   console.log(this.taskData[i].select)
      var isAllChecked = this.allCheck
      var isItemChecked = false
      this.allCheck = !this.allCheck
      var selected = this.taskData[i].select
      if (this.taskData[i].status === 'FINISH' || this.taskData[i].status === 'HALT' || this.taskData[i].status === 'ERROR') {
        this.taskData[i].select = !selected
        isItemChecked = this.taskData[i].select === true
      }
      this.allCheck = isAllChecked && isItemChecked
    },
    statusClick (status, id) {
      if (status === 'WORKING') {
        this.stop(id)
      } else if (status === 'ERROR') {
        this.retry(id)
      }
    },
    statusType (status) {
      if (status === 'FINISH') {
        return 'success'
      } else if (status === 'HALT' || status === 'ERROR') {
        return 'exception'
      }
    },
    handleCurrentChange (val) {
      // 分页改变时触发
      this.pageNum = val
      this.getTaskData(false)
    },
    sizeChange (pagesize) {
      // 页面显示数量更改
      this.pagesize = pagesize
      this.pageNum = 1
      this.getTaskData(false)
    },
    getTaskData (isInit) {
      LoadingBoxService.open('数据加载中...')
      let that = this
      this.tableLoad = true
      apiClient.get('/rcapi/dataCheckTask/list', {
        pageNum: this.pageNum,
        pageSize: this.pagesize,
        keyWord: this.keyWord
      }).then(data => {
        // console.log(data)
        let dataMap = this.taskDataMap
        this.taskData = data.data
        this.taskData.forEach(function (item) {
          item.select = false
          dataMap[item.id] = item
          if (that.errorJobs[item.id]) {
            dataMap[item.id].status = 'ERROR'
            delete that.errorJobs[item.id]
          }
        })
        this.searchResultNum = data.total
        this.tableLoad = false
        LoadingBoxService.close()
      }, errorObj => {
        this.tableLoad = false
        LoadingBoxService.close()
      }).then(() => {
        if (isInit) {
          this.queryStatus()
        }
      })
    },
    tableSelectionChange (val) {
      this.tableSelections = val
    },
    checkboxInit (row, index) {
      if (row.status === 'WAITING' || row.status === 'WORKING' || row.status === 'PAUSE' || row.status === 'HALTING') {
        return false
      } else {
        return true
      }
    },
    deleteRes () {
      // let selections = this.tableSelections
      let selections = []
      this.taskData.forEach((item) => {
        if (item.select) {
          selections.push(item.id)
        }
      })
      if (!selections || selections.length === 0) {
        TipBoxService.open('请选择要删除的数据', 2)
        return
      }

      let that = this
      NoticeBoxService.open('是否删除当前任务，删除后将无法撤回', function (data) {
        NoticeBoxService.close()
        let selectionIds = []
        for (let i = 0; i < selections.length; i++) {
          selectionIds.push(selections[i])
        }
        // 调用后台方法
        LoadingBoxService.open('删除数据，请稍候...')
        apiClient.delete('/rcapi/dataCheckTask/delete', {
          ids: selectionIds.join(',')
        }).then(data => {
          LoadingBoxService.close()
          if (data) {
            that.allCheck = false
            that.getTaskData(false)
          } else {
            TipBoxService.open('删除失败', 2)
            that.getTaskData(false)
          }
        }).catch(e => {
          LoadingBoxService.close()
          TipBoxService.open('删除错误', 2)
        })
      })
    },
    cascaderChange (value) {
      // 级联下拉更改
      if (value.length < 2) {
        return
      }
      this.form.resourceId = ''
      this.taskCreateLoad = true
      let params = {
        pageNum: 1,
        pageSize: 1000,
        resourceType: 0, // 资源类型
        rootId: value[0],
        selectedId: value[value.length - 1]
      }
      apiClient.get('/rcapi/findResourceItemsById', params).then(data => {
        this.resourceList = data.dataList
        this.taskCreateLoad = false
      }).catch(e => {
        this.taskCreateLoad = true
      })
    },
    // 创建方案
    createScheme () {
      this.$router.push({name: 'newScheme'})
    },
    // 创建检测任务
    createCheck () {
      this.taskCreateVisible = true
      this.getTreeData()
    },
    // 提交任务
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid && this.nameUnique === true) {
          LoadingBoxService.open('数据加载中...')
          apiClient.post('/rcapi/dataCheckTask/check', {
            name: this.form.taskName,
            resourceId: this.form.resourceId,
            dataCheckSpecs: {
              id: this.form.schemeId
            }
          }).then(data => {
            // console.log(data)
            if (data) {
              this.taskCreateVisible = false
              TipBoxService.open('任务提交成功', 0)
            } else {
              TipBoxService.open('任务提交失败', 2)
            }
            this.clearFormField('form')
            this.handleCurrentChange(1)
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
    // 更改资源项时
    changeResource (val) {
      this.form.schemeId = ''
      if (val !== '') {
        this.getSchemeList(val)
      }
    },
    // 查询方案列表
    getSchemeList (resourceId) {
      this.taskCreateLoad = true
      let url = '/rcapi/dataCheckSpecs/resource/' + resourceId
      apiClient.get(url, {
        usable: '1'
      }).then(data => {
        this.schemeList = data
        this.taskCreateLoad = false
      }, error => {
        if (error.response && error.response.status === 404) {
          this.searchResultMsg = 'API不存在或无法访问'
        } else {
          this.searchResultMsg = '检索数据失败, 访问API服务异常'
        }
        this.taskCreateLoad = false
      })
    },
    getTreeData () {
      this.taskCreateLoad = true
      apiClient.get('/rcapi/catalog/getTab', { type: 'data' }).then(data => {
        this.form.selectData = UtilService.filterChildren(data)
        this.taskCreateLoad = false
      }, errorObj => {
        this.taskCreateLoad = false
      })
    },
    viewReport (id, name) {
      if (id === '') {
        TipBoxService.open('任务提交失败', 2)
      } else {
        // window.open('/rc/dataCheck/testReport?id=' + id, '_blank')
        this.showDetail = true
        this.showSchemeDetail = false
        this.showTaskReport = true
        this.showWithId = id
        this.showWithName = '《' + name + '》' + '数据质量检测报告'
      }
    },
    queryStatus () {
      let dataMap = this.taskDataMap
      let that = this
      apiClient.get('/rcapi/dataCheckTask/status').then(function (data) {
        if (data) {
          for (let jobId in data) {
            if (dataMap[jobId]) {
              dataMap[jobId].status = data[jobId].status
              dataMap[jobId].checkedNum = data[jobId].checkedNum
              dataMap[jobId].totalNum = data[jobId].totalNum
            }
          }
        }
      }).then(function () {
        apiClient.websocket.debug(true).subscribe('/topic/checkData/status', function (message) {
          if (message && dataMap[message.jobId]) {
            dataMap[message.jobId].status = message.status
            dataMap[message.jobId].checkedNum = message.checkedNum
            dataMap[message.jobId].totalNum = message.totalNum
            dataMap[message.jobId].errMsg = message.errMsg
          } else if (message && message.status === 'ERROR') {
            that.errorJobs[message.jobId] = message
          }
        })
      })
    },
    stop (jobId) {
      let dataMap = this.taskDataMap
      dataMap[jobId].status = 'HALTING'
      apiClient.post('/rcapi/dataCheckTask/halt/' + jobId).then(data => {
        if (!data) {
          dataMap[jobId].status = 'WORKING'
          TipBoxService.open('中止出错', 2)
        }
      }).catch(e => {
        TipBoxService.open('中止出错', 2)
      })
    },
    retry (jobId) {
      let dataMap = this.taskDataMap
      dataMap[jobId].status = 'WAITING'
      apiClient.post('/rcapi/dataCheckTask/retry/' + jobId).then(data => {
        if (!data) {
          dataMap[jobId].status = 'ERROR'
          TipBoxService.open('重试失败', 2)
        }
      }).catch(e => {
        TipBoxService.open('重试失败', 2)
      })
    },
    toSchemeDetail (id, name) {
      // window.open('/rc/dataCheck/schemeDetail?id=' + id, '_blank')
      this.showDetail = true
      this.showTaskReport = false
      this.showSchemeDetail = true
      this.showWithId = id
      this.showWithName = '《' + name + '》' + '方案详情'
    },
    checkName () {
      this.checkInfo = ''
      this.nameUnique = true
      if (this.form.taskName.length >= 3 && this.form.taskName.length <= 20) {
        this.loadingImg = true
        let name = this.form.taskName.trim()
        apiClient.get('rcapi/dataCheckTask/queryByName',
          { name: name}).then(data => {
            if (data.results === null) {
              this.checkInfo = '任务名称可用'
              this.nameUnique = true
            } else {
              this.checkInfo = '任务名称重复'
              this.nameUnique = false
            }
            this.loadingImg = false
          }, error => {
            if (error.response && error.response.status === 404) {
              this.checkInfo = 'API不存在或无法访问'
              this.nameUnique = false
            } else {
              this.checkInfo = '检索数据失败, 访问API服务异常'
              this.nameUnique = false
            }
          })
      }
    }
  },
  mounted () {
    this.getTaskData(true)
  }
}
</script>
<style src="../../css/dataTable.css" scoped></style>
<style scoped>
.tipMsg {
  height: 1000px;
  line-height: 200px;
  text-align: center;
}
.loading-img{
  position: absolute;
  top: 10px;
  left: 215px;
}
.checkSuccess{
  color: #21C838;
}
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
.results_top {
  margin-bottom: 10px;
  margin-right: 28px;
}

.results_top span {
  padding: 0 5px;
  float: right;
  cursor: pointer;
}

.results_top span i {
  padding-right: 10px;
  color: #63ADFD;
}
.results_top span i.icon-xinjian {
  font-size: 14px;
}

.results_top span i.icon-3 {
  font-size: 15px;
  position: relative;
  top: 1px;
}
.checktable {
  min-width: 900px;
}
.dataTable .content {
  float: left;
  flex: 3;
  padding: 10px 0;
}
.dataTable .report {
  flex: 1;
}
.tooltip {
  width: 16px;
  height: 30px;
  z-index: 50;
  cursor: pointer;
}
.dataTable > i.icon-renwu1{
  color: #33D48D;
  flex: 1;
  padding: 0;
  max-width: 126px;
}
.dataTable .status {
  position: relative;
}
.dataTable .status i.iconfont {
  position: absolute;
  top: 31px;
  left: 67px;
  line-height: 30px;
}
.dataTable .status i.icon-iconfontstop {
  cursor: pointer;
}
.dataTable .status i.icon-iconfontplay2 {
  color: #33D48D;
  cursor: pointer;
}
.dataTable .status i.icon-close {
  color: #888;
  font-weight: bolder;
}
.dataTable .status i.iconfontstop {
  cursor: pointer;
}
.dataTable .status i.icon-selected {
  color: #33D48D;
}
.dataTable .status i.icon-information {
  color: #ff4949;
}
.dataTable .status > span.percent{
  position: absolute;
  width: 150px;
  top: 15px;
  left: 3px;
  text-align: center;
}
.dataTable .status > span.statusType{
  position: absolute;
  top: 35px;
  left: 40px;
}
.dataTable .report {
  color: #63ADFD;
}
.dataTable .report > span:nth-of-type(2) {
  cursor: pointer;
}
.check {
  position: relative;
}
.check i.disabled {
  background-color: #ddd;
  width: 13px;
  height: 12px;
  position: absolute;
  top: 48px;
  left: 69px;
}
.block {
  text-align: center;
}
.detection_task_main .line a:hover, .detection_task_main .line a:focus {
    color: #63ADFD;
    text-decoration: none;
}
.detection_task_main .line a{
  cursor: pointer;
  color: #63ADFD;
}
</style>
<style>
  .creatdialog .dialog-footer{
    text-align: center;
  }
  .creatdialog .el-dialog__header{
    background-color: #56A8FE;
    height: 50px;
  }
  .creatdialog .el-dialog__title{
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
  .creatdialog input{
    width: 240px;
  }
  .creatdialog .el-button.el-button--text span{
    margin-left: 10px;
  }
</style>
<style>
.creatdialog .checkError>input{
  border-color: #ff4949;
}
</style>
