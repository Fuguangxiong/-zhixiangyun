<template>
  <div class="collection">

    <div class="conCent">
      <!-- <div class="rise">
        <span class="textTlie">服务管理 · 我的申请</span>
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
          @clickBtn='onClickTableBtn'
          @clickDetail='onClickTableDetail'>
      </table-component>
    </div>

    <!-- 选择计费方案 -->
    <select-scheme-dialog :is-show='isShowPlans' 
                          :service-data='serviceData'
                          @sure='openApplyUse'
                          @cancle='onCloseDialog'>
    </select-scheme-dialog>

    <!-- 申请使用 -->
    <div id='applyUseDialogBox' class="slide-in-page" v-show='isShowApplyUse'>
      <apply-use-dialog :is-show='isShowApplyUse' 
                        :service-data='serviceData'
                        @back='closeApplyUse'>
      </apply-use-dialog>     
    </div>

    <!-- 查看套餐详情 -->
    <scheme-info-dialog :is-show='isShowSchemeInfo' 
                        :service-data='serviceData'
                        @cancle='onCloseDialog'>
    </scheme-info-dialog>
  </div>
</template>
<script>
import breadCrumb from '../../../personalConsole/component/publicComponent/breadCrumb'
import apiClient from "../../../publicJs/ApiClient.js";
import userService from '../../../publicJs/userService'
import LoadingBoxService from "../../../publicJs/LoadingBoxService.js";
import TipBoxService from "../common/TipBoxService.js";
import commonFunc from "../common/commonFunc.js";
import selectComponent from "../common/selectComponent.vue";
import tableComponent from "../common/tableComponent.vue";
import selectSchemeDialog from "../dialog/selectSchemeDialog.vue";
import applyUseDialog from "../dialog/applyUseDialog.vue";
import schemeInfoDialog from "../dialog/schemeInfoDialog.vue";
export default {
  name: "applied",
  components: {
    'breadcrumb': breadCrumb,
    selectComponent,
    tableComponent,
    selectSchemeDialog,
    applyUseDialog,
    schemeInfoDialog
  },
  data() {
    return {
      breadcrumb: [{name: '服务管理', link:sessionStorage.getItem('logintype')=="PERSONAL"?'/applyUsing':'/search'}, {name: '我的申请', link: ''}],
      login_type:userService.getInfo('logintype'),
      sourceType: "6", //已申请的服务
      searchKey: {}, //查询关键字
      selectSetting: [], //筛选项
      isSelectRefresh: false,
      timeSelect: [], //时间段选择
      sortSetting: [], //排序功能
      totalNumber: 0, //查询结果的总条数
      selectParams: {},
      sortParams: {},
      url: {
        query: "itsmApi/enterprisePlatform/selectRegisterAndAuditServiceList",
        apply: "itsmApi/applyInfo/submitApplications",
        user: "/pubapi/token/getUserByToken"
      },
      tableData: [],
      isFirst: true,
      isShowPlans: false, //显示选择计费方案弹窗
      serviceData: {},
      isShowApplyUse: false,
      isShowSchemeInfo: false,
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
    this.$parent.$parent.setActive('服务管理','我的申请');
  },
  watch: {
    list (val, oldVal) {
      this.showBtn(val)
    }
  },
  methods: {
    getMenuAndBtns(){
      var that = this;
      this.$parent.$parent.hub.$on('getPriviData', (data) => { 
        this.list = data
      });
      if (this.list === null || this.list.length <= 0) {
        this.list = this.$parent.$parent.prividata
      }
      if(this.list==undefined){
        this.list = [];
      }
    },
    showBtn (list) {
      let menuData = this.$parent.$parent.menuData;
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
      };
      if (vm.$route.query.applyStatus) {
        item1.default = vm.$route.query.applyStatus;
      }
      item1.data = commonFunc.getUseStatusDic([],true);
      let item2 = {
        label: "服务类型",
        paramName: "apptype",
        button: ["checkbox"]
      };
      item2.data = commonFunc.getApptypeDic();
      let item3 = {
        label: "服务来源",
        paramName: "serviceSource",
        button: ["checkbox"]
      };
      if(vm.login_type=='ENTERPRISE'){
        item3.data = commonFunc.getSourceTypeDic();
      }else{
        item3.data = commonFunc.getSourceTypeDic(["企业服务"]);
      }
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
      this.selectParams.serviceSource = this.selectParams.serviceSource.join(",");
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
        obj.login_type = vm.login_type;
        obj.detail = [
          {
            label: "服务类型",
            value: commonFunc.getApptype(v.apptype),
            width: "short"
          },
          {
            label: "服务来源",
            value: obj.serviceSourceName,
            width: "short"
          },
          { label: "提供商", value: v.provider, width: "short" },
          {
            label: "购买套餐",
            value: v.scheme_name || "----",
            icon: v.scheme_name ? "icon-taocanneirong" : false,
            str: "schemeInfo",
            width: "short"
          },
          { label: "已调用的次数", value: v.internal_visit_num || 0, width: "short" }
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
    //点击服务详情内容
    onClickTableDetail:function(str, item) {
      let vm = this;
      console.log(8)
      commonFunc.onClickTableDetail(vm, str, item);
    },
    //计费方案弹窗确定按钮
    onApply: function(serviceObj) {
      let vm = this;
      if (serviceObj.is_approve == "1") {
        vm.openApplyUse(serviceObj);
      } else {
        let params = {
          service_id: serviceObj.id,
          is_approve: serviceObj.is_approve,
          scheme_id: serviceObj.scheme_id
        };
        console.log(params);
        LoadingBoxService.open("正在申请，请稍候...");
        apiClient.post(vm.url.apply, params, function(data) {
          LoadingBoxService.close();
          if (data.status == "200") {
            vm.isShowPlans = false;
            TipBoxService.open("已提交申请", 4);
          } else {
            TipBoxService.open(data.exception, 2);
          }
        });
      }
    },
    //打开填写申请窗口
    openApplyUse(item) {
      this.isShowPlans = false;
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
    },
    //计费方案弹窗取消按钮按钮
    onCloseDialog: function(flag) {
      this.isShowPlans = flag;
      this.isShowSchemeInfo = flag;
    }
  }
};
</script>
<style src="../../css/common/tableComponent.css" scoped></style>
