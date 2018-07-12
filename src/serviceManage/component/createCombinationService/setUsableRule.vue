
<template>
  <div id='setUsable' class="formaCon">
    <p v-show="isEdit ||isNew" class="tempContent">
      <b>选择{{config.text}}范围：</b>
      <el-button type="primary" @click='onSetVisibility(true)'>全部{{config.text}}</el-button>
      <el-button type="primary" @click='onSetVisibility(false)'>部分{{config.text}}</el-button>
      <el-button type="default" @click='onBack()'>取 消</el-button>
    </p>
    
    <!-- 部分列表 -->
    <div v-show="!isNew&&config.visibilityLevel==='2'" class="isNotAll">
      <p>{{config.text}}范围：</p>
      <ul v-show='enterprise.length' class='visible-list'>
        <li class='visible-list-title'><i class="icon iconfont icon-gongsi2"></i>企业</li>
        <li v-for="(item,index) in enterprise" :key="index"><i class="icon iconfont icon-gongsi2"></i>{{item.NAME}}</li>
      </ul>
      <ul v-show='personal.length' class='visible-list'>
        <li class='visible-list-title'><i class="icon iconfont icon-yonghu3"></i>个人</li>
        <li v-for="(user,index) in personal" :key="index"><i class="icon iconfont icon-yonghu3"></i>{{user.PHONE}}({{user.USERNAME}})</li>
      </ul>
    </div>

    <!-- 全部 -->
    <div v-show="!isNew&&config.visibilityLevel==='1'" class="isAll"><b>{{config.text}}范围：</b>全部{{config.text}}</p></div>


    <set-usable-dialog :is-show='isShowDialog'
                      :title="config.text+'性设置'"
                      :vue-obj='serviceObj'
                      :visibility-type='config.type'
                      :visibility-set-catagory='config.catagory'
                      @cancle='onCloseDialog' 
                      @callback='callBack'>
    </set-usable-dialog>
  </div>
</template>
<script>
import apiClient from "../../../publicJs/ApiClient.js";
import TipBoxService from "../common/TipBoxService.js";
import LoadingBoxService from "../../../publicJs/LoadingBoxService.js";
import setUsableDialog from "../dialog/setUsableDialog.vue";
import commonFunc from "../common/commonFunc.js";
export default {
  props: {
    type: 0,
    isEdit: null,
    serviceId: {},
    msg: {}
  },
  components: {
    setUsableDialog
  },
  watch: {
    isEdit: function(nv, ov) {
      let vm = this;
      vm.serviceObj.id = vm.serviceId;
      if (vm.msg.visibilityLevel && vm.msg.visibilityLevel.length) {
        vm.isNew = false;
        vm.config.visibilityLevel = vm.msg.visibilityLevel||'';
        vm.enterprise = [...vm.msg.enterprise];
        vm.personal = [...vm.msg.personal];
      } else {
        vm.isNew = true;
      }       
    }
  },
  data() {
    let vm = this;
    return {
      isNew: true, //是否第一次设置
      isAll: true, //是否全部可见
      urlSave: "itsmApi/outterVisible/addOutter",
      enterprise: [], //部分可见列表
      personal: [], //部分可见列表
      config: {
        text: vm.type === "1" ? "可见" : "屏蔽",
        type: vm.type === "1" ? "1" : "2", //可见1，屏蔽2
        catagory: "2", //方案1，服务2
        visibilityLevel: "" //全部1，部分2
      },
      serviceObj: {
        id: ""
      },
      isShowDialog: false
    };
  },
  methods: {
    //选择可见范围
    onSetVisibility(type) {
      let vm = this;

      if (type) {
        //全部可见
        let myData = {
          data_id: vm.serviceObj.id,
          visibility_level: "1",
          visibility_type: vm.config.type,
          visibility_set_catagory: vm.config.catagory,
          user_ids: [],
          enterprise_ids: []
        };
        vm.$confirm("是否确定设置全部" + vm.config.text + "？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
          .then(() => {
            apiClient.post(vm.urlSave, myData, function(data) {
              console.log("全部", data);
              let item = {
                enterprise: [],
                personal: [],
                visibilityLevel: "1"
              };
              if (vm.type === "1") {
                vm.$emit("submit", true, 4, item);
              } else {
                vm.$emit("submit", true, 5, item);
              }
            });
          });
      } else {
        //部分可见
        vm.onOpenDialog();
      }
    },
    //打开弹窗
    onOpenDialog() {
      this.serviceObj.id = this.serviceId;
      this.isShowDialog = true;
    },
    //关闭弹窗
    onCloseDialog: function(flag) {
      this.isShowDialog = flag;
    },
    //弹窗回调
    callBack(obj) {
      console.log("弹窗回传", obj);
      let item = {};
      if (obj.enterprise.length || obj.personal.length) {
        item = {
          enterprise: obj.enterprise,
          personal: obj.personal,
          visibilityLevel: "2"
        };
      } else {
        item = {
          enterprise: [],
          personal: [],
          visibilityLevel: "1"
        };
      }
      if (this.type === "1") {
        this.$emit("submit", true, 4, item);
      } else {
        this.$emit("submit", true, 5, item);
      }
    },
    //返回
    onBack() {
      if (this.type === "1") {
        this.$emit("submit", false, 4);
      } else {
        this.$emit("submit", false, 5);
      }
    }
  }
};
</script>
<style scoped>
.tempContent {
  position: relative;
  padding: 20px 0 20px 0;
}
.tempContent > b {
  margin-right: 20px;
}
</style>
<style>
#setUsable .el-button,
#setUsable .el-textarea__inner {
  font-size: 12px;
}
#setUsable .isAll {
  padding: 20px 0;
  width: 700px;
}
#setUsable .isAll > b {
  display: inline-block;
  width: 80px;
}
#setUsable .isNotAll {
  padding: 20px 0;
  width: 700px;
  height: auto;
}
#setUsable .isNotAll:after,
#setUsable .visible-list:after {
  display: block;
  clear: both;
  content: "";
}
#setUsable .isNotAll > p {
  float: left;
  width: 80px;
  font-weight: bold;
  height: 30px;
  line-height: 30px;
}
#setUsable .visible-list {
  float: right;
  width: 616px;
}
#setUsable .visible-list li {
  float: left;
  width: 200px;
  height: 30px;
  line-height: 30px;
  padding: 0 10px;
  margin: 0 10px 15px 0;
  border-radius: 3px;
  box-shadow: 0px 0px 7px #55a8fd;
  box-sizing: border-box;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
#setUsable .visible-list li.visible-list-title{
  float:none;
  clear: both;
  border:none;
  box-shadow:none;
  font-weight:bold;
  vertical-align:middle;
  /* color: #55a8fd; */
}
#setUsable .visible-list li.visible-list-title>i{
  vertical-align:middle;
  margin-right:5px;  
}
</style>





