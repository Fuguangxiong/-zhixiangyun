<template>
  <div class="collection">
    <div @click="onCreate" class="addGroupBtn" v-show="isShowCreateBtn">
      <i class="icon iconfont icon-iconjia"></i>
    </div>
    <!-- 栏目位置-->
    <div class="conCent">
      <!-- <div class="rise">
        <span class="textTlie">服务管理 · 我的注册</span>
      </div> -->
      <breadcrumb :data="breadcrumb"></breadcrumb>
      <!-- 筛选 -->
      <select-component
          :search-key='searchKey'
          :select-setting='selectSetting'
          :refresh='isSelectRefresh'
          :timer='timeSelect'
          @select='onSelect'>
      </select-component>
    </div>
    <!-- ／栏目位置 -->
    <div class="queryList">
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

    <!-- 创建服务 -->
    <create-service-dialog :is-show='isShowCreatDialog' 
                          :vue-obj='vueObj'
                          @cancle='onCloseDialog'>
    </create-service-dialog>
    <!-- 设置计费规则 -->
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
import LoadingBoxService from "../../../publicJs/LoadingBoxService.js";
import TipBoxService from "../common/TipBoxService.js";
import commonFunc from "../common/commonFunc.js";
import selectComponent from "../common/selectComponent.vue";
import tableComponent from "../common/tableComponent.vue";
import createServiceDialog from "../dialog/createServiceDialog.vue";
import setSchemeRuleDialog from "../dialog/setSchemeRuleDialog.vue";
import setUsableDialog from "../dialog/setUsableDialog.vue";
export default {
  name: "registered",
  components: {
    'breadcrumb': breadCrumb,
    selectComponent,
    tableComponent,
    createServiceDialog,
    setSchemeRuleDialog,
    setUsableDialog
  },
  data() {
    return {
      breadcrumb: [{name: '服务管理', link:sessionStorage.getItem('logintype')=="PERSONAL"?'/applyUsing':'/search'}, {name: '我的注册', link: ''}],
      sourceType: "5", //已注册的服务
      searchKey: {}, //查询关键字
      selectSetting: [], //筛选项
      isSelectRefresh:false,
      timeSelect: [], //时间段选择
      sortSetting: [], //排序功能
      totalNumber: 0, //查询结果的总条数
      selectParams: {},
      sortParams: {},
      url: {
        query: "itsmApi/enterprisePlatform/selectEnterpriseServiceList"
      },
      tableData: [],
      isFirst: true,
      isShowCreatDialog: false,
      isShowChargeDialog:false,
      isShowUsableDialog: false,
      vueObj: {},
      visibilityType:'',//可见1，屏蔽2
      visibilitySetCatagory:'',//方案1，服务2
      title:'',
      btnArray:[],
      isShowCreateBtn:true,
      list:[]  //当前菜单下的按钮集合
    };
  },
  created() {
    this.setSortSetting();      
  },
  mounted() {
    this.getMenuAndBtns();  
    this.setSelectData();   
    this.$parent.$parent.setActive('服务管理','我的注册');   
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
        label: "审核状态",
        paramName: "audit_status",
        button: ["checkbox"],
        // default:'2'
      };
      if(vm.$route.query.audit_status){
        item1.default=vm.$route.query.audit_status;
      }
      item1.data = commonFunc.getAuditStatusDic();
      let item2 = {
        label: "服务类型",
        paramName: "apptype",
        button: ["checkbox"]
      };
      item2.data = commonFunc.getApptypeDic();
      let item3 = {
        label: "服务状态",
        paramName: "service_status",
        button: ["checkbox"]
      };
      item3.data = commonFunc.getServiceStatusDic();
      let item4 = {
        label: "上下架状态",
        paramName: "up_down_status",
        button: ["checkbox"]
      };
      item4.data = commonFunc.getUpDownDic();
      vm.selectSetting = [item1, item2, item3,item4];

      vm.timeSelect = {
        label: "创建时间",
        paramName: ["creat_time_start", "creat_time_end"],
        default: "1",
        data: [
          { label: "近一个月内创建", value: 30 },
          { label: "近三个月内创建", value: 90 },
          { label: "近半年内创建", value: 180 },
          { label: "近一年内创建", value: 365 },
          { label: "一年之前创建", value: false }
        ]
      };
      vm.isSelectRefresh=true;
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
        { label: "状态", paramName: "audit_status", sortType: "desc" },
        { label: "时间", paramName: "create_time", sortType: "desc" }
      ];
    },
    // 筛选操作
    onSelect: function(params) {
      this.selectParams = params;
      this.selectParams.reviewStatus = this.selectParams.audit_status.join(",");
      this.selectParams.apptype = this.selectParams.apptype.join(",");
      this.selectParams.service_status = this.selectParams.service_status.join(",");
      if (this.selectParams.up_down_status.length == 2) {
        this.selectParams.up_down_status = "";
      } else {
        this.selectParams.up_down_status = this.selectParams.up_down_status.join(",");
      }
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
      console.log('查询条件：',params);
      vm.isFirst = false;
      LoadingBoxService.open("正在查询，请稍候...");
      apiClient.post(vm.url.query, params, function(data) {
        LoadingBoxService.close();
        if (data.status == "200") {
          console.log('查询结果：',data);
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
        obj.sourceType=vm.sourceType;
        obj.detail = [
          {
            label: "服务类型",
            value: commonFunc.getApptype(v.apptype),
            width: "short"
          },
          { label: "被调用的次数", value: v.visit_num, width: "short" },
          {
            label: "服务简介",
            value: v.service_brief,
            width: "long"
          }
        ];
        //列表每行右侧模块
        obj.rightBlock = {
          label: "创建时间",
          value: commonFunc.formatDate(v.create_time,'yyyy-MM-dd HH:mm:ss'),
        };
        //角标、水印、高级按钮、右侧按钮、标签
        obj = commonFunc.addCornerIcon(obj);
        obj.watermarkClass = commonFunc.addWatermark(obj);
        obj = commonFunc.addSeniorBtns(obj,vm.btnArray);
        obj.rightBlock.button=commonFunc.addRightBtn(obj,vm.btnArray);
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
    // 创建服务
    onCreate: function() {
      this.isShowCreatDialog = true;
      this.vueObj = this;
    },
    updateChargeRule: function(param){
      let vm = this;
      LoadingBoxService.open('请稍候...')
      var myData = {};
      myData = {
        serviceId: param.id,
        fieldName: "bill_rules",
        fieldValue: param.bill_rules.join(","),
        fieldType: "array"
      };
      apiClient.post("itsmApi/enterprisePlatform/updateServiceForOneField", myData, function(data) {
        //LoadingBoxService.close();
        //此状态用于判断是否服务中的方案是否为删除操作
        //if(param.feeUseStatus=='0'){
            // TipBoxService.open("删除成功");
            // var addScheme = {
            //   service_id:param.id,
            //   scheme_id:param.delSchemeId
            // };
            // //方案流转数据
            // apiClient.post("itsmApi/schemeWorkflow/addDelSchemeToWorkflow", addScheme, function(data) {
            //   param.feeUseStatus = "";
            // });
        //}else{
          LoadingBoxService.close();
          TipBoxService.open("保存成功");
          vm.isShowChargeDialog = false;
          vm.onQuery();
          console.log(data)

          var operateScheme = {
            serviceId:param.id,
            newSchemeIds:param.bill_rules.length == 0?[]:param.bill_rules.join(","),
            oldSchemeIds:vm.vueObj.bill_rules.length == 0?[]:vm.vueObj.bill_rules.join(",")
          };
          //方案流转数据
          apiClient.post("itsmApi/schemeWorkflow/operateSchemeWorkflow", operateScheme, function(data) {});
        //}
      });
    },
    // 关闭创建服务弹窗回调
    onCloseDialog: function(flag) {
      this.isShowCreatDialog = flag;
      this.isShowChargeDialog = flag;
      this.isShowUsableDialog = flag;
    }
  }
};
</script>
<style src="../../css/common/tableComponent.css" scoped></style>
