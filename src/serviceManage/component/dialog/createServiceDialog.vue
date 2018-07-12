<template>
    <el-dialog title="选择服务类型" 
              :visible.sync="isShow" 
              class='create-service' 
              width='500px'
              @close='onCancle'>

      <div class="select_service_type_main">
        <div :class="{clickClass : is_tomic}" @click="onClick(true)" class="sstm_left limain">
          <div class="sstml_main aclickse">
            <span class="cj_new_ico"></span>
            <p>创建原子服务</p>
          </div>
        </div>
        <div :class="{clickClass : is_combination}" @click="onClick(false)" class="sstm_right limain">
          <div class="sstmr_main aclickse">
            <span class="fw_zh_ico"></span>
            <p>创建组合服务</p>
          </div>
        </div>
      </div>
      <!-- <div slot="footer" class="dialog-footer">
        <el-button @click="onCancle">取 消</el-button>
        <el-button type="primary" @click="onSure">确 定</el-button>
      </div> -->
      <div slot="footer" class="dialog-footer" :class='{hsaHover:setStyleHover}'>         
        <el-button @click="onCancle" @mouseenter.native='setStyle(true)' @mouseleave.native='setStyle(false)'>取 消</el-button>
        <el-button @click="onSure" type="primary">确 认</el-button>
      </div>
    </el-dialog>
</template>

<script>
import apiClient from "../../../publicJs/ApiClient.js";
export default {
  props: {
    isShow: {},
    vueObj: {}
  },
  data: function() {
    return {
      setStyleHover:false,
      is_tomic: false,
      is_combination: false
    };
  },
  mounted() {},
  methods: {
    setStyle(status){
      this.setStyleHover = status;
    },
    onClick: function(flag) {
      this.is_tomic = flag;
      this.is_combination = !flag;
    },
    onSure: function() {
      let vm = this;
      if(vm.is_tomic){
        vm.vueObj.$router.push({
          name: "newServicePage",
//            name: "newServicePage",//新版原子服务
          query: { source_type: vm.vueObj.sourceType }
        });
      }else if(vm.is_combination){
        vm.vueObj.$router.push({
          // name: "newCompositeService",
           name: "compositeServicePage",//新版组合服务
          query: { source_type: vm.vueObj.sourceType }
        });
      }else{
        vm.$message({
          showClose: true,
          message: '请选择服务!',
          type: 'error'
        });
      }
    },
    onCancle:function(){
      this.$emit("cancle", false);
    }
  }
};
</script>
<style src="../../css/servicesManage/inspection.css" scoped></style>
<style>
.create-service .el-dialog {
  width: 470px;
}
.create-service .el-dialog__header {
  width: 470px;
  padding: 15px 15px 10px 15px;
}
.create-service .el-dialog__body {
  width: 470px;
}
.create-service .el-dialog__footer {
  padding: 0;
}
.create-service .dialog-footer .el-button {
  color: #ffffff;
  float: left;
  height: 40px;
  border-radius: 0px;
  width: 50%;
  margin: 0 !important;
}
.create-service .el-button--primary {
  background-color: #7fa6f3;
  border-color: #7fa6f3;
}
.create-service .el-button--default {
  background-color: #e2e2e2;
  border-color: #e2e2e2;
}
.create-service .select_service_type_main {
  height: 174px;
  margin: 20px 0;
  padding: 0 20px;
}

.create-service .hsaHover .el-button--primary {
    background-color: #e2e2e2;
    border-color: #e2e2e2;
}
.create-service .hsaHover .el-button--default {
    color: #ffffff;
    border-color: #7fa6f3;
    background-color: #7fa6f3;
}
.create-service .dialog-footer .el-button:hover {
    color: #ffffff;
    border-color: #7fa6f3;
    background-color:#7fa6f3;
}
</style>