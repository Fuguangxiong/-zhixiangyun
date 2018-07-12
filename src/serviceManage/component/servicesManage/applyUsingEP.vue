<template>
  <div class="collection">
    <!-- 栏目位置-->
    <div class="conCent">
      <!-- <div class="rise">
        <span class="textTlie">服务管理 · 待我审批</span>
      </div> -->
      <breadcrumb :data="breadcrumb"></breadcrumb>
      <!-- 筛选 -->
      <select-component
          :search-key='searchKey'
          :select-setting='selectSetting'
          :timer='timeSelect'
          :refresh='isSelectRefresh'
          @select='onSelect'>
      </select-component>
    </div>

    <div class="queryList" v-show='!isShowApplyUse'>
      <!-- 列表 -->
      <table-component
          :sort-setting='sortSetting'
          :total-number='totalNumber'
          :table-list='tableData'
          @sort='onSort'
          @clickName='onClickName'
          @clickBtn='onClickTableBtn'>
      </table-component>
    </div>

    <div id='applyUseDialogBox' class="slide-in-page" v-show='isShowApplyUse'>
      <apply-use-dialog :is-show='isShowApplyUse' 
                        :service-data='serviceData'
                        @back='closeApplyUse'>
      </apply-use-dialog>     
    </div>
  </div>
</template>
<script>
import breadCrumb from '../../../personalConsole/component/publicComponent/breadCrumb'
import apiClient from "../../../publicJs/ApiClient.js";
import LoadingBoxService from "../../../publicJs/LoadingBoxService.js";
import commonFunc from "../common/commonFunc.js";
import selectComponent from "../common/selectComponent.vue";
import tableComponent from "../common/tableComponent.vue";
import applyUseDialog from "../dialog/applyUseDialog.vue";
export default {
  name: "applyUsing",
  components: {
    'breadcrumb': breadCrumb,
    selectComponent,
    tableComponent,
    applyUseDialog
  },
  data() {
    return {
      breadcrumb: [{name: '服务管理', link:sessionStorage.getItem('logintype')=="PERSONAL"?'/applyUsing':'/search'}, {name: '待我审批', link: ''}],
      sourceType: "4", //待我审批
      searchKey: {}, //查询关键字
      selectSetting: [], //筛选项
      isSelectRefresh: false,
      timeSelect: [], //时间段选择
      sortSetting: [], //排序功能
      totalNumber: 0, //查询结果的总条数
      selectParams: {},
      sortParams: {},
      url: {
        query: "itsmApi/enterprisePersonal/selectRegisterAndAuditServiceList"
      },
      tableData: [],
      isFirst: true,
      serviceData: {},
      isShowApplyUse: false,
      isShowListRightBtn: false,
      btnArray:[],
      list:[]  //当前菜单下的按钮集合
    };
  },
  created() {
    this.setSortSetting();
  },
  mounted() {
    this.getMenuAndBtns();
    this.setSelectData();
    this.$parent.setActive('服务管理','待我审批');
  },
  watch: {
    list (val, oldVal) {
      this.showBtn(val)
    }
  },
  methods: {
    getMenuAndBtns(){
      var that = this;
      this.$parent.hub.$on('getPriviData', (data) => { 
        this.list = data
      });
      if (this.list === null || this.list.length <= 0) {
        this.list = this.$parent.prividata
      }
      if(this.list==undefined){
        this.list = [];
      }
    },
    showBtn (list) {
      let menuData = this.$parent.menuData;
      for(var i = 0; i < list.length; i++){
        if(list[i].menuId == menuData.pId){
          let menuList = list[i].sublist;
          for(var j = 0; i < menuList.length; j++){
              if(menuList[j].menuId == menuData.menuId){
                console.log('getBtnArr------', menuList[j])
                this.btnArray = menuList[j].button;  
                break;
              }
          }
        }
      }      
    },
    // 设置筛选组件参数
    setSelectData: function() {
      let vm = this;
      vm.searchKey = { label: "服务名称", paramName: "keyword" };
      let item1 = {
        label: "审核状态",
        paramName: "applyStatus",
        button: ["checkbox"]
        // default:'1'
      };
      if (vm.$route.query.applyStatus) {
        item1.default = vm.$route.query.applyStatus;
      }
      item1.data = commonFunc.getUseStatusDic(["未提交"]);
      let item2 = {
        label: "服务类型",
        paramName: "apptype",
        button: ["checkbox"]
      };
      item2.data = commonFunc.getApptypeDic();
      let item3 = {
        label: "用户类型",
        paramName: "user_type",
        button: ["checkbox"],
      };
      item3.data = commonFunc.getBelongTypeDic();
      vm.selectSetting = [item1, item2, item3];

      vm.timeSelect = {
        label: "申请日期",
        paramName: ["apply_time_start", "apply_time_end"],
        default: "1",
        data: [
          { label: "近一个月内申请", value: 30 },
          { label: "近三个月内申请", value: 90 },
          { label: "近半年内申请", value: 180 },
          { label: "近一年内申请", value: 365 },
          { label: "一年之前申请", value: false }
        ]
      };
      vm.isSelectRefresh = true;
    },
    // 设置排序参数
    setSortSetting: function() {
      let vm = this;
      vm.sortSetting = [
        {
          label: "智能",
          paramName: "apply_time",
          sortType: false,
          default: true
        },
        // { label: "名称", paramName: "name", sortType: "asc" },
        // { label: "类型", paramName: "apptype", sortType: "desc" },
        { label: "状态", paramName: "use_status", sortType: "desc" },
        { label: "时间", paramName: "apply_time", sortType: "desc" }
      ];
    },
    // 筛选操作
    onSelect: function(params) {
      this.selectParams = params;
      this.selectParams.applyStatus = this.selectParams.applyStatus.join(",");
      this.selectParams.apptype = this.selectParams.apptype.join(",");
      this.selectParams.user_type = this.selectParams.user_type.join(",");
      this.onQuery();
    },
    // 排序操作
    onSort: function(params) {
      this.sortParams = params;
      if (!this.isFirst) {
        this.onQuery();
      }
    },
    // 查询
    onQuery: function() {
      let vm = this;
      let params = $.extend({}, vm.selectParams, vm.sortParams);
      params.sourceType = vm.sourceType;
      console.log("查询条件：", params);
      vm.isFirst = false;
      LoadingBoxService.open("正在查询，请稍候...");
      apiClient.post(vm.url.query, params, function(data) {
        LoadingBoxService.close();
        if (data.status == "200") {
          console.log("查询结果：", data);
          vm.totalNumber = data.results.total;
          let dataList = [...data.results.data];
          vm.tableData = vm.onCreatTable(dataList);
        } else {
          TipBoxService.open(data.exception, 2);
        }
      });
    },
    // 列表数据
    onCreatTable: function(dataList) {
      let vm = this;
      let tableData = [];
      dataList.forEach(function(v, i) {
        let obj = Object.assign({}, v);
        obj.sourceType = vm.sourceType;
        obj.detail = [
          { label: "申请人", value: v.apply_user_name, width: "short" },
          {
            label: "服务类型",
            value: commonFunc.getApptype(v.apptype),
            width: "short"
          },
          {
            label: "用户类型",
            value: commonFunc.getBelongType(v.apply_belong_type),
            width: "short"
          },
          {
            label: "服务简介",
            value: v.service_brief,
            width: "long"
          }
        ];
        //列表每行右侧模块
        obj.rightBlock = {
          label: "申请时间",
          value: commonFunc.formatDate(v.apply_time, "yyyy-MM-dd HH:mm:ss")
        };
        //角标、水印、高级按钮、右侧按钮
        obj = commonFunc.addCornerIcon(obj);
        obj.watermarkClass = commonFunc.addWatermark(obj);
        obj = commonFunc.addSeniorBtns(obj,vm.btnArray);
        obj.rightBlock.button = commonFunc.addRightBtn(obj,vm.btnArray);
        obj = commonFunc.addTag(obj);

        tableData.push(obj);
      });
      return tableData;
    },
    // 点击名称，查看详情
    onClickName: function(item) {
      commonFunc.toDetailPage(item, this.btnArray);
    },
    // 点击table按钮
    onClickTableBtn: function(str, item) {
      let vm = this;
      commonFunc.onClickTableBtn(vm, str, item);
    },
    //打开填写申请窗口
    openApplyUse(item) {
      this.serviceData = item;
      this.isShowApplyUse = true;
      $("#applyUseDialogBox").animate({ right: "0" }, 500);
    },
    //收起填写申请窗口
    closeApplyUse(flag) {
      let vm = this;
      $("#applyUseDialogBox").animate({ right: "-2000px" }, 500, function() {
        vm.isShowApplyUse = false;
        if (flag) {
          vm.onQuery();
        }
      });
    }
  }
};
</script>
<style src="../../css/common/tableComponent.css" scoped></style>
