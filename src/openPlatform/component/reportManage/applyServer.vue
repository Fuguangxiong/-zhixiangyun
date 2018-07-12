<template>
  <div class="apply-server">
      <h2>已申请服务</h2>
      <div class="search clearfix">
          <div class="search-affiliation">
              <select name="" id="">
                  <option value="">服务归属</option>
                  <option value="">个人</option>
                  <option value="">企业</option>
                  <option value="">平台</option>
              </select>
          </div>
          <div class="search-name">
              <input type="text" placeholder="服务名称" class="server-name">
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
                  <th>服务名称</th>
                  <th>服务归属</th>
                  <th>使用方案</th>
                  <th>收费标准</th>
                  <th>方案起始时间</th>
                  <th>方案结束时间</th>
                  <th>原子服务调用次数</th>
                  <th>组合服务调用次数</th>
                  <th>服务总调用次数</th>
                  <th>当前费用</th>
                  <th>总费用</th>
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
                  <td>9</td>
                  <td>10</td>
                  <td>11</td>
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
      name: 'applyserver',
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
<style  src="../../css/reportManage/applyServer.css" scoped></style>

