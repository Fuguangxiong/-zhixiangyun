<template>
    <!--内容开始-->
    <div class="mode-div lanm-con lanm-con-bo">
        <div class="detection_task_main">
            <div class="results_top">
                <button class="detect_btn">删除</button>
                <button class="report_btn">导出</button>
            </div>
            <div class="table-css" style="margin-top:10px">
                <el-table ref="multipleTable" 
                    v-loading.body="tableLoad"
                    :data="dataList" border
                    tooltip-effect="dark"
                    style="width: 100%"
                    @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column label="检测任务" width="240" show-overflow-tooltip>
                      <template slot-scope="scope">
                        <el-button type="text" @click="toTestReport(scope.row.id)">{{scope.row.taskName}}</el-button> 
                      </template>
                    </el-table-column>
                    <el-table-column prop="resourceNum" label="检测资源" width="160"></el-table-column>
                    <el-table-column prop="resourceName" label="检测资源" width="240" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="planName" label="监测方案" width="240" show-overflow-tooltip></el-table-column>
                    <el-table-column label="创建时间" width="160" sortable><template slot-scope="scope">{{ scope.row.createTime }}</template></el-table-column>
                    <el-table-column label="完成时间" width="160" sortable><template slot-scope="scope">{{ scope.row.finishTime }}</template></el-table-column>
                </el-table>
            </div>
            <div class="zxf_pagediv">
              <div class="block"  v-show="showpagination">
                <el-pagination
                  @current-change="handleCurrentChange"
                  layout="total,sizes,prev,pager,next,jumper"
                  :current-page.sync="pageNum"
                  :page-size="pagesize"
                  :total="searchResultNum"
                  :page-sizes="pageSizes"
                  @size-change="sizeChange">
                </el-pagination>
              </div>
            </div>
        </div>
    </div>
    <!--内容结束-->
</template>

<script>
export default {
  name: 'report',
  data () {
    return {
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
      checkTask: [],
      dataList: [
        {
          id: '1',
          taskName: '互联网租房信息检测1',
          resourceNum: '2',
          resourceName: '58同城租房信息1',
          planName: '互联网信息检测方案1',
          createTime: '2017-06-23 20:00',
          finishTime: '2017-06-24 20:00'
        },
        {
          id: '2',
          taskName: '互联网租房信息检测2',
          resourceNum: '1',
          resourceName: '58同城租房信息2',
          planName: '互联网信息检测方案2',
          createTime: '2017-06-22 20:00',
          finishTime: '2017-06-25 20:00'
        }
      ]
    }
  },
  methods: {
    sizeChange (pagesize) {
      // this.pagesize = pagesize
      // this.pageNum = 1
      // this.getSchemeList()
    },
    handleCurrentChange (val) {
      // this.pageNum = val
      // this.getSchemeList()
    },
    handleSelectionChange () {},
    toTestReport (id) {
      // console.log('报告id：', id)
      window.open('dataCheck/testReport', '_blank')
    }
  }
}
</script>
<style src="" scoped></style>
<style scoped>
</style>

