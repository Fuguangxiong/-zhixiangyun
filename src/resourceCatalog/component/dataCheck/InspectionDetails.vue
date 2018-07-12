<template>
   <div class="w1200">
        <div class="mode-div lanm-hed ouehide">
            <div class="crumbs">质量检测&gt;<a href="#" class="cred">检测明细</a></div>
            <button class="new_test">新建检测</button>
        </div>
        <div class="mode-div lanm-con lanm-con-bo">
            <div class="resources_detail">
                <div class="resources_detail_top">58租房信息检测明细</div>
                <div class="resources_detail_main">
                   <el-table ref="multipleTable" 
                    v-loading.body="tableLoad"
                    :data="dataList" border
                    tooltip-effect="dark"
                    style="width: 100%"
                    @selection-change="handleSelectionChange">
                    <el-table-column type="index" width="55"></el-table-column>
                    <el-table-column prop="taskName"  label="检测任务" width="240" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="resourceNum" label="检测资源" width="160"></el-table-column>
                    <el-table-column prop="resourceName" label="检测资源" width="240" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="planName" label="检测方案" width="240" show-overflow-tooltip></el-table-column>
                    <el-table-column label="创建时间" width="160" sortable><template scope="scope">{{ scope.row.createTime }}</template></el-table-column>
                    <el-table-column label="完成时间" width="160" sortable><template scope="scope">{{ scope.row.finishTime }}</template></el-table-column>
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
     </div>
</template>
<script>
export default {
  name: 'inspectionDetails',
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
    handleSelectionChange (val) {
       // 选择变化时触发
    },
    handleCurrentChange () {
      // 分页改变时触发
    },
    sizeChange () {
      // 页面显示数量更改
    }
  }
}
</script>
<style src="" scoped></style>
<style scoped>

</style>
