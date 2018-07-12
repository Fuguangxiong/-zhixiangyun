<template>
  <div class="outbox" id='portManage'>
    <div class="newService">
      <!-- /栏目头部 end-->
      <!-- 主题内容菜单 -->
      <div class="resoubox ">
        <div class="resou-con">
          <div class="w1200 h100">
            <!-- start: position -->
            <div class="publicNav">
              <!-- <span class="hand" @click="toMain()"></span> -->
              <!-- <span class="Active">应用管理</span>
              <span class="arrows">></span>
              <span class="Active">端口管理</span> -->
              <breadcrumb :data="breadcrumb"></breadcrumb>
              <!-- <div class="returnBtn publicRedBtn" @click="returnPage()">返回 </div> -->
            </div>
            <div class="portManageSearch">
              <span>端口状态：</span>
              <span v-for="item in portStatus" :key="item.value" @click='onSelectStatus(item)' :class="{active:item.value == activeColor}">{{item.label}}</span>
            </div>
            <!--智能-->
            <div class="queryListWord">
              <div class="sortCon">
                <!-- <span :class="{active:activec=='zn'}" @click="sortFun('zn')">智能</span> -->
                <!-- <span class="sortWord" :class="{active:activec=='mc','wordUp':!flagObj.mc}" @click="sortFun('mc')"><em>名称</em><i class="icon iconfont icon-jiantou-up" style="margin-top:2px;"></i><i class="icon iconfont icon-jiantou-lower" style="margin-top:2px;"></i></span>
                <span class="sortWord" :class="{active:activec=='zt','wordUp':!flagObj.zt}" @click="sortFun('zt')"><em>状态</em><i class="icon iconfont icon-jiantou-up" style="margin-top:2px;"></i><i class="icon iconfont icon-jiantou-lower" style="margin-top:2px;"></i></span>
                <span class="sortWord" :class="{active:activec=='sj','wordUp':!flagObj.sj}" @click="sortFun('sj')"><em>申请时间</em><i class="icon iconfont icon-jiantou-up" style="margin-left: 22px; margin-top:2px;"></i><i class="icon iconfont icon-jiantou-lower" style="margin-left: 22px; margin-top:2px;"></i></span> -->
              </div>
              <div>
                <div class="checkboxCon">
                  <div class="checkboxBut"><i class="icon iconfont icon-caozuo"></i></div>
                </div>
                <div class="topPage">
                  <em><i class="cloer">{{pageNum}}</i>/{{maxNum}}</em>
                  <div class="pageTop">
                    <span @click="goNext(-1)" :class="{mouseZt:activeMouse}" class="arrow" style="font-family: simSun;">&lt;</span>
                    <span @click="goNext(1)" class="arrow" style="font-family: simSun;">&gt;</span>
                  </div>
                </div>
              </div>
            </div>
            <div v-show="showTips" class="showTips">
              <img src="../../../internalOperation/images/nothing.png" alt="">
              <p>未查找到相关数据</p>
            </div>
            <!--列表-->
            <div class="tableList" v-show="!showTips">
              <div v-for="(item,index) in tableData" :key="index"  class="tableListLine">
                <div>
                  <div class="tableListLeft">
                    <div class="tableListLeftDiv">
                      <!-- <div class="company">{}</div> -->
                      <div class="address">
                        IP：{{item.address}}
                      </div>
                    </div>
                    <div class="time">
                      <span>端口：{{item.port}}</span>
                    </div>
                    <div class="time1">
                      <span class="coorperateTime">状态：{{item.port_status_text}}</span>
                    </div>
                    <el-dropdown class='senior' trigger="click" v-show='item.port_status=="1"'>
                      <span class="el-dropdown-link">
                        高级<i class="el-icon-arrow-down el-icon--right"></i>
                      </span>
                      <el-dropdown-menu slot="dropdown" class='sm-senior'>
                        <el-dropdown-item>
                          <span @click="doActon('release', item)" class="el-dropdown-release">释放</span>
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                    <!-- <div class="reason" style="float: left;">操作时间:{{value.applicationTime}}</div> -->
                  </div>
                  <div class="action">
                    <div class="sliderBtn" :class="index==num? 'checkone' : ''">
                      <span class="port-row-btnD" @click="doActon('delete', item)">删除</span>
                    </div>
                    <div class="checkRight check control-i" style="float: right;" :class="index==num? 'checkone' : ''">
                      <p class="applicationtime"><i class="iconfont icon-shijianzhongbiao"></i>创建时间</p>
                      <p class="applicationtime1">
                        {{item.create_time1}}<br/>
                        {{item.create_time2}} {{item.create_time3}}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" v-show="total>10" :current-page.sync="pageNum" :page-size="pageSize" layout="prev, pager, next,total,jumper" :total="total" prev-text="上一页" next-text="下一页">
                  </el-pagination>
              </div>
            </div>
            <!-- end: content -->
          </div>
        </div>
      </div>
      <div class="port-action-item" @click="onOpenAddDialog('addForm')">
          <i class="icon iconfont icon-iconjia"></i>
      </div>
    </div>

    <!-- 添加窗口 -->
    <el-dialog title="添加端口" @close='onResetForm("addForm")' :visible.sync="dialogAddFlag" width='90%'>
      <el-form ref="addForm" :model="addForm">
        <el-form-item label="IP：" 
                      prop="address" 
                      :rules="[{ required: true, message: '请选择活动区域', trigger: 'change' }]"
                      label-width="180">
          <el-select v-model="addForm.address" placeholder="请选择IP">
            <el-option v-for="item in addForm.addressList" :key="item" :label="item" :value="item"></el-option>
          </el-select>                
        </el-form-item>
        <el-form-item v-for="(item, index) in addForm.portList" 
                    label="端口：" 
                    label-width="180"
                    :prop="'portList[' + index + '].value'"
                    :rules="[
                            { required: true, message: '端口号不能为空',},
                            { type: 'number', min:1025,max:65535, message: '端口号必须为1025-65535之间的数字值', },
                            ]" :key="index">
          <el-input v-model.number="item.value" auto-complete="off"></el-input>
          <span class="port-dialog-action-btn add" @click='onAddPortItem'></span>
          <span v-show='index>0' class="port-dialog-action-btn del" @click.prevent='onDelPortItem(item)'></span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAddFlag = false">取 消</el-button>
        <el-button type="primary" @click="onAddPort('addForm')">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import $ from "jquery";
import breadCrumb from '../../../personalConsole/component/publicComponent/breadCrumb'
import apiToken from "../../../publicJs/apiToken.js";
import apiClient from "../../../publicJs/ApiClient";
import TipBoxService from "../common/TipBoxService.js";
import LoadingBoxService from "../../../publicJs/LoadingBoxService.js";
import UtilService from '../../../publicJs/UtilService.js';
export default {
  name: 'portManage',
  components: {
    'breadcrumb': breadCrumb,
  },
  data() {
    return {
      breadcrumb: [{name: '应用管理', link: ''}, {name: '端口管理', link: ''}],
      fullHeight: document.documentElement.clientHeight,
      portStatus: [
        { label: "全部", value: "" },
        { label: "可用", value: "0" },
        { label: "已用", value: "1" }
      ],
      showTips: false, // 是否显示无数据的提示
      activeColor:'',
      activeMouse:false,
      port_status: "", // 0空闲/可用，1占用/已用
      url: {
        query: "/itsmApi/port/findPorts",
        save: "/itsmApi/port/savePort",
        release: "/itsmApi/port/releasePort",
        delete: "/itsmApi/port/removePort",
        getAddress: "/itsmApi/port/loadAddress"
      },
      releaseDe:"释放",
      tableData: [],
      seniorBtns: [],
      accordingRelease:false,
      tipMsg: "",
      num: -1,
      total: 1,
      pageSize: 10,
      pageCount: 0,
      pageNum: 1,
      dialogAddFlag: false,
      addForm: {
        portList: [{ value: "" }],
        addressList: [],
        ports: "",
        address: ""
      },
      create_time:'',
      rules: {
        address: [{ required: true, message: "请选择IP" }]
      }
    };
  },
  computed: {
      maxNum () {
        if (this.total / this.pageSize === 0) {
          return 1
        } else {
          return Math.ceil(this.total / this.pageSize)
        }
      },
      maxNumItems () {
        return this.total - 10 * (this.maxNum - 1)
      }
    },
  mounted() {
    var vm = this;
    $(window).resize(function() {
      vm.fullHeight = document.documentElement.clientHeight;
    });
    vm.onQuery();
  },
  methods: {
    toMain() {
    //   this.$router.push("appsManager");
      // this.$router.back(-1);
    },
    //返回
    returnPage() {
    //   this.$router.push({ name: "appsManager", query: {} });
      // this.$router.back(-1);
    },
    //翻页
    handleSizeChange (val) {
        console.log(`每页 ${val} 条`)
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.pageNum = val
      this.onQuery();
    },
    accordRelease(item){
      this.accordingRelease = true;
    },
     // 小分页
    goNext (n) { // Math.ceil(total/pageSize)=='0'?1:Math.ceil(total/pageSize)
      if (this.total === 0) {
        return false
      }
      this.pageNum = this.pageNum + n
      if (this.pageNum === 0) {
        this.pageNum = 1;
        return
      }
      if (this.pageNum === Math.ceil(this.total / 10) + 1) {
        this.pageNum = Math.ceil(this.total / 10)
        return
      }
      this.onQuery()
    },
    //选择状态
    onSelectStatus(item) {
      this.port_status = item.value;
      this.activeColor = item.value;
      this.onQuery();
    },
    //打开新增窗口
    onOpenAddDialog(formName) {
      var vm = this;
      vm.dialogAddFlag = true;

      //清空输入项
      vm.addForm.address = "";
      vm.addForm.portList = [{}];
      // vm.addForm.addressList = ["192.168.2.2", "192.168.2.277"];

      apiClient.post(vm.url.getAddress, {}, function(data) {
        if (data.status == 200) {
          vm.addForm.addressList = data.results.address;
        } else {
          TipBoxService.open(data.exception,1);
        }
      });
    },
    //重置表单
    onResetForm(formName){
      this.$refs[formName].resetFields();
    },
    //保存
    onAddPort(formName) {
      var vm = this;
      var portArray = [];

      this.$refs[formName].validate(valid => {
        if (valid) {
          for (var i = 0; i < vm.addForm.portList.length; i++) {
            var v = vm.addForm.portList[i];
            if ($.inArray(v.value, portArray)!=-1) {
              TipBoxService.open("端口" + v.value + "重复输入！", 1);
              return;
            } else {
              portArray.push(v.value);
            }
          }
          vm.addForm.ports = portArray.toString();
          LoadingBoxService.open("正在保存,请稍等......");
          apiClient.post(vm.url.save, vm.addForm, function(data) {
            if (data.status == 200) {
              LoadingBoxService.close();
              vm.dialogAddFlag = false;
              TipBoxService.open("端口" + vm.addForm.ports + "添加成功", 4);
              vm.pageNum = 1;
              setTimeout(function(){
                vm.onQuery();
              },3000);
            } else {
              LoadingBoxService.close();
              // vm.dialogAddFlag = false;
              TipBoxService.open(data.exception, 1);
            }
          });
        } 
      });
    },
    //添加端口项
    onAddPortItem() {
      this.addForm.portList.push({
        value: "",
        key: Date.now()
      });
    },
    //减少端口项
    onDelPortItem(item) {
      var index = this.addForm.portList.indexOf(item);
      if (index !== -1) {
        this.addForm.portList.splice(index, 1);
      }
    },
    //释放、删除
    doActon(action, item) {
      var vm = this;
      var param = { id: item.id };
      var url = action == "release" ? vm.url.release : vm.url.delete;
      var actionTip = action == "release" ? "释放" : "删除";

      vm
        .$confirm("此操作将" + actionTip + "该端口, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          LoadingBoxService.open("请稍等......");
          apiClient
            .post(url, param, function(data) {
              if (data.status == 200) {
                var Data = data;
                console.log('data',Data);
                LoadingBoxService.close();
                TipBoxService.open(actionTip + "成功!");
                vm.pageNum = 1;
                vm.onQuery();
              } else {
                LoadingBoxService.close();
                TipBoxService.open(data.exception,1);
              }
            })
            .catch(e => {});
        });
    },
    //table
    onCreateTable(data) {
      this.tableData = data;
      this.tableData.forEach(function(v, i) {
        v.port_status_text = v.port_status == "0" ? "可用" : "已用";
      });
    },
    //查询
    onQuery() {
      var vm = this;
      var param = {};
      param.pageNum = vm.pageNum;
      param.pageSize = vm.pageSize;
      param.port_status = vm.port_status;
      LoadingBoxService.open("正在查询,请稍等......");
      apiClient.post(vm.url.query, param, function(data) {
        if (data.status == 200) {
          var dataList = data.results.data;
          vm.tableData = data.results.data;
          console.log("数据",dataList);
          for(var i = 0 ; i < vm.tableData.length ; i ++){
            const el = vm.tableData[i];
            if(el.create_time != undefined){
                vm.tableData[i].create_time1 = UtilService.formatDuring(dataList[i].create_time,"yyyy-MM-dd");
                vm.tableData[i].create_time2 = UtilService.formatDuring(dataList[i].create_time,"HH:mm:ss");
            }else{
              vm.tableData[i].create_time3 = '暂无--'
            }
          };
          LoadingBoxService.close();
          if (vm.tableData.length === 0) {
            vm.showTips = true
          } else {
            vm.showTips = false
          }
          vm.total = data.results.total;
          if (data.results.total) {
            vm.onCreateTable(dataList);
            vm.tipMsg = "";
          } else {
            vm.tipMsg = "查询无数据";
          }
        } else {
          LoadingBoxService.close();
          TipBoxService.open(data.exception,2)
        }
      });
    },
    //   format (time, format) {
    //     var t = new Date(time)
    //     var tf = function (i) { return (i < 10 ? '0' : '') + i }
    //     return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function (a) {
    //     switch (a) {
    //     case 'yyyy':
    //         return tf(t.getFullYear())
    //         break
    //     case 'MM':
    //         return tf(t.getMonth() + 1)
    //         break
    //     case 'mm':
    //         return tf(t.getMinutes())
    //         break
    //     case 'dd':
    //         return tf(t.getDate())
    //         break
    //     case 'HH':
    //         return tf(t.getHours())
    //         break
    //     case 'ss':
    //         return tf(t.getSeconds())
    //         break
    //     }
    //     })
    // }
  }
};
</script>
<style src="../../css/createApp/portManager.css" scoped></style>
<style scoped>
#portManage .el-table__body-wrapper > table {
  border: none;
}
#portManage .el-table {
  border: none;
}
#portManage .el-table::after,
.el-table::before {
  background: #fff !important;
}
#portManage .el-table tr {
  height:99px;
  /* background: #f9f9f9 !important;
  border: none;
  margin-bottom: 10px;
  border-bottom: 10px solid #fff; */
  border-bottom: 1px solid #f1f1f1;
  border-right: 1px solid #f1f1f1;
  box-sizing: border-box;
}
#portManage .el-table td {
  border: none;
  padding: 15px 0;
}
#portManage .el-dialog__header {
  padding: 15px;
}
#portManage .el-dialog__title {
  font-size: 16px;
  letter-spacing: 2px;
}
#portManage .el-dialog__body {
  padding-bottom: 10px;
}
#portManage .el-dialog__body .el-input,
#portManage .el-dialog__body .el-input__inner {
  width: 350px;
}
#portManage .el-form-item__label {
  width: 80px;
}
#portManage .port-con .port-action-select .el-input,
#portManage .port-con .port-action-select .el-input__inner {
  height: 26px;
  font-size: 12px;
}
.port-con .el-select-dropdown__list {
  padding: 0 !important;
}
.port-con .el-select-dropdown__item {
  font-size: 12px !important;
  height: 32px !important;
  line-height: 1 !important;
}
.el-dropdown-menu.sm-senior{
  height:30px;
  line-height:30px;
  left:1144px!important;
  cursor: pointer;
}
.el-dropdown-menu__item{
  line-height:30px!important;
}
/* .BreadCrumb{
  height:60px!important;
  line-height:60px!important;
  float:left;
} */
</style>

