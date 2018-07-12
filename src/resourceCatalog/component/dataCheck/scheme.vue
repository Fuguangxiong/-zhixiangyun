<template>
    <!--内容开始-->
    <div class="mode-div lanm-con lanm-con-bo">
      <div class="title">
        <i></i> 检测方案
      <div class="commonTableSearch">
        <i class="commonTableSearchIcon  iconfont icon-sousuo" v-on:click="getSchemeList"></i>
        <input class="commonTableSearchInput" placeholder="请输入关键字" v-on:keyup.enter="getSchemeList" v-model="keyWord" />
      </div>
      </div>
        <div class="detection_task_main">
            <div class="results_top clearfix">
                <!-- <button class="detect_btn" @click="deleteScheme">删除</button>
                <button class="report_btn" @click="newScheme">新建方案</button> -->
              <span @click="checkedAll">
                <i class="iconfont check" v-bind:class="{'icon-xuanzhong5':allCheck,'icon-checkbox':!allCheck}"></i>全选</span>
              <span v-if="verifyPermission('009005009')">  
                <span @click="deleteScheme">
                <i class="iconfont icon-3"></i>删除</span>
              </span>  
              <span v-if="verifyPermission('009005010')">  
                <span @click="newScheme">
                <i class="iconfont icon-xinjian"></i>新建方案</span>
              </span>  
            </div>

            <div class="tipMsg" v-show="dataList.length === 0">暂无数据</div>
            <div class="schemeTable">  
              <div class="dataTable" v-for="(item, index) in dataList" :key="index">
                <i class="iconfont icon-diannao"></i>
                <div class="content">
                  <div class="line">
                    <span>方案名称：
                      <a href="javascript:;" :title="item.name" @click="toSchemeDetail(item.id,item.name)" >{{item.name}}</a>
                    </span>
                    <span>标签：
                      <span :title="item.labels">{{item.labels?item.labels.join(','):''}}</span>
                    </span>
                    <span>创建时间：
                      <span :title="item.createTime | time">{{item.createTime | time}}</span>
                    </span>
                  </div>
                  <div class="line">
                    <span>方案类型：
                      <span>自定义</span>
                    </span>
                    <span>检测指标数：
                      <span>{{item.targetList.length}}</span>
                    </span>
                    <span></span>
                  </div>
                </div>
                <span class="status">
                  <span v-if="verifyPermission('009005011')">
                    <el-switch class="switch" v-model="item.usable" on-text="启用" off-text="停用" on-color="#55a8fd" off-color="#cccccc" :width="55" @change="change(index, item.id, item.usable)">
                    </el-switch>
                  </span>
                </span>
                <span class="action">
                  <span v-if="verifyPermission('009005012')">
                    <span class="edit" @click="edit(item)" title="编辑">
                      <i class="iconfont icon-bianji"></i>
                    </span>
                  </span>  
                  <span class="check">
                    <i @click="item_checked(index)" class="iconfont" :class="{'icon-xuanzhong5':item.select,'icon-checkbox':!item.select}"></i>
                  </span>
                </span>
              </div>
            </div>
            <div class="zxf_pagediv">
              <div class="block"  v-show="showpagination && searchResultNum > 10">
                <el-pagination
                  @current-change="handleCurrentChange"
                  layout="total,prev,pager,next,jumper"
                  :current-page.sync="pageNum"
                  :page-size="pagesize"
                  :total="searchResultNum"
                  :page-sizes="pageSizes"
                  @size-change="sizeChange">
                </el-pagination>
              </div>
            </div>
        </div>
        <!-- 方案详情模态框 -->
        <PopupDetail :show.sync="showDetail" :title=" '《'+showWithName + '》' + '方案详情'">
          <div slot="component"><SchemeDetail :id="showWithId"/></div>
        </PopupDetail>  
    </div>
    <!--内容结束-->
</template>

<script>
import apiClient from '@/publicJs/ApiClient.js'
import TipBoxService from '@/publicJs/TipBoxService'
import LoadingBoxService from '@/publicJs/LoadingBoxService'
import NoticeBoxService from '@/publicJs/NoticeBoxService'
import PopupDetail from '../../popupDetails/CompDetail'
import SchemeDetail from './schemeDetail'
import privibutton from '@/publicComponent/privibutton'
export default {
  name: 'scheme',
  components: {PopupDetail, SchemeDetail, privibutton},
  mounted () {
    this.getSchemeList()
  },
  data () {
    return {
      // 搜索关键字
      keyWord: '',
      // 全选
      allCheck: false,
      // 分页组件显示标志
      showpagination: false,
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
      checkTask: [],
      dataList: [],
      dataCheckSpecsList: [], // 选中的检测方案
      ids: [], // 选中的检测方案的id
      // 详情模态框数据
      showDetail: false,
      showWithId: '',
      showWithName: ''
    }
  },
  methods: {
    checkedAll () {
      this.allCheck = !this.allCheck
      this.dataList.forEach(item => {
        item.select = this.allCheck
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
      var selected = this.dataList[i].select
      this.dataList[i].select = !selected
      isItemChecked = this.dataList[i].select === true
      this.allCheck = isAllChecked && isItemChecked
    },
    sizeChange (pagesize) {
      this.pagesize = pagesize
      this.pageNum = 1
      this.getSchemeList()
    },
    handleCurrentChange (val) {
      this.pageNum = val
      this.getSchemeList()
    },
    newScheme () {
      // this.$router.push('/resourceCatalog/dataCheck/newScheme')
      this.$router.push({name: 'newScheme'})
    },
    getSchemeList () {
      // this.showpagination = false
      LoadingBoxService.open('数据加载中...')
      apiClient.get('/rcapi/dataCheckSpecs/list', {
        pageNum: this.pageNum,
        pageSize: this.pagesize,
        sortType: this.sort,
        keyWord: this.keyWord
      }).then(data => {
        // console.log(data)
        this.showpagination = true
        this.dataList = data.data
        this.dataList.forEach(item => {
          // item.labels = item.labels.join(',')
          item.labels2 = item.labels.join(',')
          item.select = false
        })
        this.searchResultNum = data.total
        LoadingBoxService.close()
      }, error => {
        this.showpagination = false
        console.error(error)
        LoadingBoxService.close()
      })
    },
    handleSelectionChange (val) {
      this.dataCheckSpecsList = val
      this.ids.length = 0
      for (let i = 0; i < this.dataCheckSpecsList.length; i++) {
        this.ids.push(this.dataCheckSpecsList[i].id)
      }
    },
    formatLabel (row, column) {
      return row.labels.join('，')
    },
    deleteScheme () {
      this.dataList.forEach(item => {
        if (item.select) {
          this.ids.push(item.id)
        }
      })
      if (this.ids.length === 0) {
        TipBoxService.open('请选择要删除的数据', 2)
        return
      }
      let that = this
      NoticeBoxService.open('是否删除当前检测方案，删除后将无法撤回', function (data) {
        NoticeBoxService.close()
        LoadingBoxService.open('删除数据，请稍候...')
        apiClient.delete('/rcapi/dataCheckSpecs/delete', {
          ids: that.ids.join(',')}).then(data => {
            if (data === true) {
              that.allCheck = false
              TipBoxService.open('删除成功')
              that.pageNum = 1
              that.getSchemeList()
              that.ids.length = 0
            } else if (data.results === false) {
              TipBoxService.open('该方案关联着检测任务，不能删除！', 2)
            }
            LoadingBoxService.close()
          }, error => {
            console.error(error)
            LoadingBoxService.close()
            TipBoxService.open('删除失败')
          })
      })
    },
    change (index, id, usable) {
      // console.log('状态：', usable)
      apiClient.get('/rcapi/dataCheckSpecs/updateUsable', {id: id, usable: usable}).then(data => {
        TipBoxService.open('修改成功')
      }, error => {
        console.error(error)
        TipBoxService.open('修改失败')
        this.getSchemeList()
      })
    },
    toSchemeDetail (id, name) {
      // window.open('/rc/dataCheck/schemeDetail?id=' + id, '_blank')
      this.showDetail = true
      this.showWithId = id
      this.showWithName = name
    },
    edit (dataCheckSpecs) {
      this.$router.push({name: 'editScheme', query: {dataCheckSpecs: dataCheckSpecs}})
    },
    sortChange (value) {
      if (value.order === 'descending') {
        this.sort = 'desc'
        this.getSchemeList()
      }
      if (value.order === 'ascending') {
        this.sort = 'asc'
        this.getSchemeList()
      }
    }
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
  margin-right: 9px;
}

.results_top span {
  padding: 0 5px;
  float: right;
  cursor: pointer;
}
i.icon-diannao {
  color: #FACD51;
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
.schemeTable {
  min-width: 900px;
}
.dataTable .action span {
  padding: 0 10px;
}
.dataTable .action span i {
  cursor: pointer;
}
.block {
  text-align: center;
}
</style>

