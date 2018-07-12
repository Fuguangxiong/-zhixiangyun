<template>
	<!-- 主题内容菜单 -->
	<div class="boxBody" id="boxBody">
    <table border="0">
        <tr class="title">
            <th>序号</th>
            <th>审批批次</th>
            <th>审批阶段</th>
            <th>审核人</th>
            <th>处理时间</th>
            <th>审核意见</th>
        </tr>
        <tr class="one" v-for="(item,index) in applyInfo" :key="index">
            <td>{{index+1}}</td>
            <td>第{{item.audit_batch_num}}次</td>
            <td>
                <span v-show="item.audit_phase == 1">企业审批</span>
                <span v-show="item.audit_phase == 2">平台审批</span>
                <span v-show="item.audit_phase == 3 && item.audit_status == 2">成功</span>
                <span v-show="item.audit_phase == 3 && item.audit_status == 3">打回</span>
            </td>
            <td>{{item.auditUserName}}</td>
            <td>{{item.audit_time}}</td>
            <td style="width:250px;">
              <span v-if="item.audit_status == 1">创建；</span>
              <span v-if="item.audit_status == 2">通过；</span>
              <span v-if="item.audit_status == 3">不通过；</span>
              <span v-if="item.audit_status == 0">撤销</span>
              <span :title="audit_remark" class="audit_remark">{{item.audit_remark}}</span>
            </td>
        </tr>
    </table>
	</div>
	<!-- /主题内容菜单 end -->
</template>

<script>
import $ from "jquery";
import JqUI from "../../lib/jquery-ui.min.js";
import apiToken from "../../../publicJs/apiToken.js";
import apiClient from "../../../publicJs/ApiClient.js";

export default {
  name: "exchange",
  components: {},
  props:{
    applyInfo:{}
  },
  data() {
    return {
    };
  },
};
</script>
<style src="../../css/createCombinationServeice/jquery-ui.custom.min.css" scoped></style>
<style scoped>
.boxBody {
  width: 95%;
  padding: 0;
}
.boxBody table {
  width: 100%;
}
.boxBody table #title {
  background-color: #ccc;
}
.boxBody table th {
  text-align: left;
}
.boxBody table tr {
  width: 100%;
  height: 30px;
  line-height: 30px;
  text-align: left;
}
.audit_remark{
    width: 150px;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
}
</style>