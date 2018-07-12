<template>
  <div class="plan-count">
      <h2>方案统计</h2>
      <div class="search clearfix">
          <div class="plan-name">
            <input type="text" placeholder="方案名称">
            <i class="iconfont icon-sousuo11"></i>
          </div>
          <div class="export">
            <i class="iconfont icon-daochu"></i>
            <a href="javascript:;">导出</a>
          </div>
      </div>
      <div class="content">
          <table>
              <thead>
                  <tr>
                    <th>方案名称</th>
                    <th>收费情况</th>
                    <th>收费标准</th>
                    <th>收费时长</th>
                    <th>关联次数</th>
                    <th>原子服务调用次数</th>
                    <th>组合服务调用次数</th>
                    <th>服务总调用次数</th>
                    </tr>
              </thead>
              <tbody>
                  <tr>
                      <td>1</td>
                      <td>2</td>
                      <td>3</td>
                      <td>4</td>
                      <td>5</td>
                      <td>6</td>
                      <td>7</td>
                      <td>8</td>
                  </tr>
              </tbody>
          </table>
      </div>
      <div class="paging" v-show="isPaging">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :page-size="pageSize"
            :current-page.sync="pageNum"
            layout="prev, pager, next, jumper"
            :total="total" 
            >
           </el-pagination>
      </div>
  </div>
</template>
<script>
    export default {
      name: 'planCount',
      data () {
        return {
          isPaging: true,
          pageSize: 20,
          pageNum: 1,
          total: 100
        }
      },
      methods: {
        handleSizeChange () {},
        handleCurrentChange () {}
      }
    }
</script>
<style src="../../css/reportManage/planCount.css" scoped></style>

