<template>
  <div class="collection platformService">
    <div v-show='login_type=="PLATFORM"' @click="onCreate" class="addGroupBtn">
      <i class="icon iconfont icon-iconjia"></i>
    </div>

    <div class="conCent">
      <!-- <div class="rise">
        <span class="textTlie">服务管理 · 平台服务</span>
      </div> -->
      <breadcrumb :data="breadcrumb"></breadcrumb>
      <!-- 筛选 -->
      <select-component
          :search-key='searchKey'
          :select-setting='selectSetting'
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

    <!-- 创建服务 -->
    <create-service-dialog :is-show='isShowCreatDialog' 
                          :vue-obj='vueObj'
                          @cancle='onCloseDialog'>
    </create-service-dialog>

    <!-- 选择计费方案 -->
    <select-scheme-dialog :is-show='isShowPlans' 
                          :service-data='serviceData'
                          @sure='onApply'
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
    <!-- 计费规则 -->
    <set-scheme-rule-dialog :is-show='isShowChargeDialog'
                        :vue-obj='vueObj'                        
                        @cancle='onCloseDialog'
                        @sure='updateChargeRule'>
    </set-scheme-rule-dialog>
    <!-- 设置可见性 -->
    <set-usable-dialog :is-show='isShowUsableDialog'
                       :title="title"
                       :vue-obj='vueObj'
                       :visibility-type='visibilityType'
                       :visibility-set-catagory='visibilitySetCatagory'
                       @cancle='onCloseDialog'>
    </set-usable-dialog>
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
import createServiceDialog from "../dialog/createServiceDialog.vue";
import selectSchemeDialog from "../dialog/selectSchemeDialog.vue";
import applyUseDialog from "../dialog/applyUseDialog.vue";
import schemeInfoDialog from "../dialog/schemeInfoDialog.vue";
import setSchemeRuleDialog from "../dialog/setSchemeRuleDialog.vue";
import setUsableDialog from "../dialog/setUsableDialog.vue";
export default {
  name: "platformService",
  components: {
    'breadcrumb': breadCrumb,
    selectComponent,
    tableComponent,
    createServiceDialog,
    selectSchemeDialog,
    applyUseDialog,
    schemeInfoDialog,
    setSchemeRuleDialog,
    setUsableDialog
  },
  data() {
    return {
      breadcrumb: [{name: '服务管理', link:sessionStorage.getItem('logintype')=="PERSONAL"?'/applyUsing':'/search'}, {name: '平台服务', link: ''}],
      login_type:userService.getInfo('logintype'),
      sourceType: "2", //平台服务
      searchKey: {}, //查询关键字
      selectSetting: [], //筛选项
      isSelectRefresh: false,
      sortSetting: [], //排序功能
      totalNumber: 0, //查询结果的总条数
      selectParams: {},
      sortParams: {},
      url: {
        query: "itsmApi/enterprisePlatform/selectEnterpriseServiceList",
        apply: "itsmApi/applyInfo/submitApplications",
        user: "/pubapi/token/getUserByToken"
      },
      tableData: [],
      isFirst: true,
      isShowCreatDialog: false,
      isShowPlans: false, //显示选择计费方案弹窗
      serviceData: {},
      isShowApplyUse: false,
      isShowSchemeInfo: false,
      isShowChargeDialog:false,
      isShowUsableDialog:false,
      visibilityType:'',//可见1，屏蔽2
      visibilitySetCatagory:'',//方案1，服务2
      title:'',
      vueObj: {},
      btnArray:[],
      isShowCreateBtn:true,
      isShowListRightBtn: false,
      list:[]  //当前菜单下的按钮集合
    };
  },
  created() {
    this.getMenuAndBtns();
    this.setSortSetting();
  },
  mounted() {
    this.setSelectData();
    this.$parent.$parent.setActive('服务管理','平台服务');
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
                for(let index in this.btnArray){
                  if ((this.btnArray)[index].code == 'sc_newService') {
                    this.isShowCreateBtn=true;
                    break;
                  }                  
                }
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
        label: "服务状态",
        paramName: "service_status",
        button: ["checkbox"]
      };
      let item2 = {
        label: "服务类型",
        paramName: "apptype",
        button: ["checkbox"]
      };
      item2.data = commonFunc.getApptypeDic();
      if(vm.login_type=='PLATFORM'){
        item1.data = commonFunc.getServiceStatusDic();
        let item3 = {
          label: "审核状态",
          paramName: "audit_status",
          button: ["checkbox"]
        };
        item3.data = commonFunc.getAuditStatusDic(["未提交"]);
        let item5 = {
          label: "上下架状态",
          paramName: "up_down_status",
          button: ["checkbox"]
        };
        item5.data = commonFunc.getUpDownDic();
        vm.selectSetting = [item1, item2, item3,item5];
      }else{
        item1.data = commonFunc.getServiceStatusDic(["待开通", "已过期", "已删除"]);
        let item3 = {
          label: "是否申请",
          paramName: "isApplied",
          button: ["checkbox"]
        };
        item3.data = commonFunc.getIsAppliedDic();
        vm.selectSetting = [item1, item2, item3];
      }
      vm.isSelectRefresh = true;
    },
    // 设置排序参数
    setSortSetting: function() {
      let vm = this;
      vm.sortSetting = [
        {
          label: "智能",
          paramName: "create_time",
          sortType: false,
          default: true
        },
        { label: "名称", paramName: "name", sortType: "asc" },
        { label: "类型", paramName: "apptype", sortType: "desc" },
        { label: "状态", paramName: "service_status", sortType: "desc" },
        { label: "时间", paramName: "open_time", sortType: "desc" }
      ];
    },
    // 筛选操作
    onSelect: function(params) {
      let vm = this;
      vm.selectParams = params;
      vm.selectParams.service_status = vm.selectParams.service_status.join(",");
      vm.selectParams.apptype = vm.selectParams.apptype.join(",");
      if(this.login_type=='PLATFORM'){
        vm.selectParams.reviewStatus = vm.selectParams.audit_status.join(",");
        if (this.selectParams.up_down_status.length == 2) {
          this.selectParams.up_down_status = "";
        } else {
          this.selectParams.up_down_status = this.selectParams.up_down_status.join(",");
        }
      }else{
        vm.selectParams.isApplied = vm.selectParams.isApplied.join(",");
        vm.selectParams.up_down_status = "1";
      }
      vm.onQuery();
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
      console.log("查询条件：", params);
      params.sourceType = vm.sourceType;
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
    // 表格数据
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
            label: "购买套餐",
            value: v.scheme_name || "----",
            icon: v.scheme_name ? "icon-taocanneirong" : false,
            str: "schemeInfo",
            width: "short"
          },
          { label: "内部调用次数", value: v.internal_visit_num, icon: "up", width: "short" },
          {
            label: "服务简介",
            value: v.service_brief,
            width: "long"
          }
        ];
        if(obj.login_type=='PLATFORM'){
          obj.detail = [
            {
              label: "服务类型",
              value: commonFunc.getApptype(v.apptype),
              width: "short"
            },
            { label: "内部调用次数", value: v.internal_visit_num, icon: "up", width: "short" },
            {
              label: "服务简介",
              value: v.service_brief,
              width: "long"
            }
          ];
        }
        //列表每行右侧模块
        obj.rightBlock = {
          label: "开通时间",
          value: v.open_time
        };
        //角标、水印、高级按钮、右侧按钮
        obj = commonFunc.addCornerIcon(obj);
        obj.watermarkClass = commonFunc.addWatermark(obj);
        obj = commonFunc.addSeniorBtns(obj,vm.btnArray);
        obj.rightBlock.button = commonFunc.addRightBtn(obj,vm.btnArray);
        obj = commonFunc.addTag(obj);

        tableData.push(obj);
      });
      console.log(tableData)
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
    onClickTableDetail: function(str, item) {
      let vm = this;
      commonFunc.onClickTableDetail(vm, str, item);
    },
    // 创建服务
    onCreate: function() {
      this.isShowCreatDialog = true;
      this.vueObj = this;
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
            vm.onQuery();
            TipBoxService.open("已提交申请", 4);
          } else {
            TipBoxService.open(data.exception, 2);
          }
        });
      }
    },
    //打开填写申请窗口
    openApplyUse(item) {
      let vm = this;
      vm.serviceData = Object.assign({}, item);
      vm.isShowPlans = false;
      vm.isShowApplyUse = true;
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
    updateChargeRule: function(param) {
      let vm = this;
      LoadingBoxService.open("请稍候...");
      var myData = {};
      myData = {
        serviceId: param.id,
        fieldName: "bill_rules",
        fieldValue: param.bill_rules.join(","),
        fieldType: "array"
      };
      console.log("输入参数", myData);
      apiClient.post(
        "itsmApi/enterprisePlatform/updateServiceForOneField",
        myData,
        function(data) {
          LoadingBoxService.close();
          TipBoxService.open("保存成功");
          vm.isShowChargeDialog = false;
          vm.onQuery();
          console.log(data);
          //by liujie add
          var operateScheme = {
            serviceId:param.id,
            newSchemeIds:param.bill_rules.length == 0?[]:param.bill_rules.join(","),
            oldSchemeIds:vm.vueObj.bill_rules.length == 0?[]:vm.vueObj.bill_rules.join(",")
          };
          //方案流转数据
          apiClient.post("itsmApi/schemeWorkflow/operateSchemeWorkflow", operateScheme, function(data) {});
        }
      );
    },
    //计费方案弹窗取消按钮按钮
    onCloseDialog: function(flag) {
      this.isShowCreatDialog = flag;
      this.isShowPlans = flag;
      this.isShowSchemeInfo = flag;
      this.isShowChargeDialog = flag;
      this.isShowUsableDialog = flag;
    }
  }
};
</script>
<style src="../../css/common/tableComponent.css" scoped></style>