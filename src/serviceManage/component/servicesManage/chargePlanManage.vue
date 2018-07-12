<template>
  <div class="collection">
    <div @click="onCreate" class="addGroupBtn" v-show="isShowCreateBtn">
      <i class="icon iconfont icon-iconjia"></i>
    </div>
    <!-- 栏目位置-->
    <div class="conCent">
      <!-- <div class="rise">
        <span class="textTlie">服务管理 · 企业服务</span>
      </div> -->
      <breadcrumb :data="breadcrumb"></breadcrumb>
      <!-- 筛选 -->
      <select-component
          :search-key='searchKey'
          :select-setting='selectSetting'
          :refresh='isRefresh'
          @clickBtn='onManage'
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
    <!-- 方案添加/修改 -->
    <created-charge-plan-dialog :is-show='isShowChargeDialog'
                                :vue-obj='vueObj'
                                :group-info='groupInfo'
                                :reload='isReLoad'
                                @cancle='onCloseDialog'
                                @sure='saveChargePlan'>
    </created-charge-plan-dialog>
    <!-- 分组管理 -->
    <charge-manage-dialog :is-show='isShowChargeGroupDialog'
                          :group-info='groupInfo'
                          @cancle='onCloseDialog'
                          @sure='saveChargeGroup'
                          @groupdel='groupDel'
                          @getGroupList='getGroupList'>
    </charge-manage-dialog>
    <!-- 可见设置 -->
    <set-usable-dialog :is-show='isShowUsableDialog'
                       :title = 'title'
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
import createdChargePlanDialog from "../dialog/createdChargePlanDialog";
import chargeManageDialog from "../dialog/chargeManageDialog";
import NoticeBoxService from '../../../publicJs/NoticeBoxService.js';
import setUsableDialog from "../dialog/setUsableDialog.vue";
export default {
  name: "chargePlanManage",
  components: {
    'breadcrumb': breadCrumb,
    selectComponent,
    tableComponent,
    createServiceDialog,
    setSchemeRuleDialog,
    createdChargePlanDialog,
    chargeManageDialog,
    setUsableDialog
  },
  data() {
    return {
      breadcrumb: [{name: '服务管理', link:sessionStorage.getItem('logintype')=="PERSONAL"?'/applyUsing':'/search'}, {name: '计费方案管理', link: ''}],
      sourceType: "1", //企业服务
      searchKey: {}, //查询关键字
      selectSetting: [], //筛选项
      sortSetting: [], //排序功能
      totalNumber: 0, //查询结果的总条数
      selectParams: {},
      sortParams: {},
      url: {
        query: "itsmApi/feeScheme/feeSchemeList"
      },
      title:"",
      tableData: [],
      isFirst: true,
      isShowCreatDialog: false,
      isShowChargeDialog: false,
      isShowChargeGroupDialog: false,
      isShowUsableDialog:false,
      visibilityType:"",
      visibilitySetCatagory:"",
      vueObj: {},
      planGroupList: [],
      groupInfo:[],
      selectData:{
        pageNum:1,
        pageSize:10,
        znSort:'0',
        nameSort:'',//升序asc降序desc
        statusSort:'',
        createDateSort:'',
        scheme_status:[],
        scheme_name:'',
        scheme_group_id:[]
      },
      isRefresh:false,
      isReLoad:false,
      btnArray:[],
      isShowCreateBtn:false,
      isShowTypeMgeBtn:false,
      isShowListRightBtn:false,
      list:[]  //当前菜单下的按钮集合
    };
  },
  created() {
    this.getMenuAndBtns();
    this.setSortSetting();
  },
  mounted() {
    this.getMenuAndBtns();
    this.getPlanGroup();
    this.$parent.$parent.setActive('服务管理','计费方案管理');
  },
  watch: {
    list (val, oldVal) {
      this.showBtn(val)
    },
    isShowTypeMgeBtn(val, oldVal){
      if(val && (val != oldVal) && this.planGroupList > 0){
        this.setSelectData(val)
      }      
    },
    planGroupList(val, oldVal){
      if(val != oldVal && this.isShowTypeMgeBtn && val.length > 0){
        this.setSelectData(val)
      }
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
                  if ((this.btnArray)[index].code == 'sc_newPlan') {
                    this.isShowCreateBtn=true;
                  }else if ((this.btnArray)[index].code == 'sc_planTypeManage') {
                    this.isShowTypeMgeBtn=true;
                  }else if ((this.btnArray)[index].code == 'sc_planRemove') {
                    this.isShowListRightBtn=true;
                  }
                }
                break;
              }
          }
        }
      }      
    },
    // 设置筛选组件参数
    setSelectData: function(showMgeBtn) {
      let vm = this;
      vm.searchKey = { label: "方案名称", paramName: "scheme_name" };
      let item1 = {
        label: "方案状态",
        paramName: "scheme_status",
        button: ["checkbox"]
      };
      item1.data = commonFunc.getChargeStatusDic();
      let btns = [];
      if(showMgeBtn){
        btns = ["checkbox",'manage']
      }else{
        btns = ["checkbox"]
      }
      let item2 = {
        label: "方案分组",
        paramName: "scheme_group_id",
        button: btns
      };
      item2.data = vm.planGroupList;
      vm.selectSetting = [item1, item2];
      vm.isRefresh=true;
    },
    // 设置排序参数
    setSortSetting: function() {
      let vm = this;
      vm.sortSetting = [
        {
          label: "智能",
          paramName: "znSort",
          sortType: false,
          default: true
        },
        { label: "名称", paramName: "nameSort", sortType: "desc" },
        { label: "状态", paramName: "statusSort", sortType: "desc" },
        { label: "时间", paramName: "createDateSort", sortType: "desc" }
      ];
    },
    // 筛选操作
    onSelect: function(params) {
      this.selectParams = params;
      // this.selectParams.service_status = this.selectParams.service_status.join(
      //   ","
      // );
      // this.selectParams.apptype = this.selectParams.apptype.join(",");
      // this.selectParams.reviewStatus = this.selectParams.audit_status.join(",");
      // if (this.selectParams.up_down_status.length == 2) {
      //   this.selectParams.up_down_status = "";
      // } else {
      //   this.selectParams.up_down_status = this.selectParams.up_down_status.join(
      //     ","
      //   );
      // }
        this.onQuery();
    },
    // 排序操作
    onSort: function(params) {
      this.sortParams = params;
      // if(params.sortField == "nameSort"){
      //   this.selectData.nameSort = params.sortType;
      //   this.selectData.createDateSort = '';
      //   this.selectData.znSort = '';
      //   this.selectData.statusSort = '';
      // }else if(params.sortField == "znSort"){
      //   this.selectData.nameSort = '';
      //   this.selectData.createDateSort = '';
      //   this.selectData.znSort = '0';
      //   this.selectData.statusSort = '';
      // }else if(params.sortField == "statusSort"){
      //   this.selectData.nameSort = '';
      //   this.selectData.createDateSort = '';
      //   this.selectData.znSort = '';
      //   this.selectData.statusSort = params.sortType;
      // }else if(params.sortField == "createDateSort"){
      //   this.selectData.nameSort = '';
      //   this.selectData.createDateSort = params.sortType;
      //   this.selectData.znSort = '';
      //   this.selectData.statusSort = '';
      // }
      // console.log('0000000000000')
      if (!this.isFirst) {
        this.onQuery();
      }
    },
    // 查询
    onQuery: function() {
      let vm = this;
      this.selectData.scheme_group_id = [...this.selectParams.scheme_group_id];
      this.selectData.scheme_name = this.selectParams.scheme_name;
      this.selectData.scheme_status = [...this.selectParams.scheme_status];
      this.selectData.nameSort = '';
      this.selectData.createDateSort = "";
      this.selectData.znSort = '';
      this.selectData.statusSort = '';
      if(this.sortParams.sortField == "znSort"){
        this.selectData.znSort = '0';
      }else{
        this.selectData[this.sortParams. sortField]=this.sortParams.sortType;
      }
      this.selectData.pageNum = this.sortParams.pageNum;
      let params = vm.selectData;
      vm.isFirst = false;
      LoadingBoxService.open("正在查询，请稍候...");
      apiClient.post(vm.url.query, params, function(data) {
        LoadingBoxService.close();
        if (data.status == "200") {
          vm.totalNumber = data.results.total;
          let dataList = [...data.results.data];
          // for(var i = 0 ; i < dataList.length ; i ++){
          //     if(dataList[i].restrict_type == 1){
          //         dataList[i].restrict_type = '每天'
          //     }else if(dataList[i].restrict_type == 2){
          //         dataList[i].restrict_type = '每周'
          //     }else if(dataList[i].restrict_type == 3){
          //         dataList[i].restrict_type = '每月'
          //     }else if(dataList[i].restrict_type == 4){
          //         dataList[i].restrict_type = '每季度'
          //     }else if(dataList[i].restrict_type == 5){
          //         dataList[i].restrict_type = '半年'
          //     }else if(dataList[i].restrict_type == 6){
          //         dataList[i].restrict_type = '每年'
          //     }
          // }
          vm.tableData = vm.onCreatTable(dataList);
        } else {
          TipBoxService.open(data.exception, 2);
        }
      });
    },
    // 生成服务列表数据
    onCreatTable: function(dataList) {
      let vm = this;
      let tableData = [];
      let isApply = "";
      let startTime = "";
      let endTime = "";
      let expiryDate = "";
      let restrict = "";
      dataList.forEach(function(v, i) {
        expiryDate = v.expiry_start_date+" 至 "+v.expiry_end_date
        let obj = Object.assign({}, v);
        if(obj.apply_is_audit == "1"){//兼容旧的数据。不需要被改成2了。设计时定的为0是不需要
          isApply = "需要";
        }else{
          isApply = "不需要";
        }
        startTime = vm.formatDuring(v.expiry_start_date,'yyyy-MM-dd');
        endTime = vm.formatDuring(v.expiry_end_date,'yyyy-MM-dd');
        expiryDate = startTime+" 至 "+endTime
        var restrictTypes = "";
        if(v.restrict_type == 1){
            restrictTypes = '每天'
        }else if(v.restrict_type == 2){
            restrictTypes = '每周'
        }else if(v.restrict_type == 3){
            restrictTypes = '每月'
        }else if(v.restrict_type == 4){
            restrictTypes = '每季度'
        }else if(v.restrict_type == 5){
            restrictTypes = '半年'
        }else if(v.restrict_type == 6){
            restrictTypes = '每年'
        }
        restrict = restrictTypes +"免费"+v.restrict_num+"次"
        obj.detail = [
          { label: "使用申请", value: isApply, width: "short" },
          {
            label: "方案分组",
            value: v.scheme_group_name,
            width: "short",
            wrap:true
          },
          { label: "有效日期", value: expiryDate, width: "short" },
          {
            label: "调用限制",
            value: restrict,
            width: "short",
            wrap:true
          }
        ];
        //列表每行右侧模块
        obj.rightBlock = {
          label: "创建时间",
          value: vm.formatDuring(v.created_time,"yyyy-MM-dd HH:mm:ss"),
        };
        //角标
        //if(vm.isShowListRightBtn){
          obj.rightBlock.button=vm.addRightPlanBtn(obj,vm.btnArray);
        //}        
        obj = vm.addSeniorBtns(obj,vm.btnArray);
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
      if(str == "edit"){
        this.isShowChargeDialog = true;
        item.expiry_start_date = this.formatDuring(item.expiry_start_date,'yyyy-MM-dd HH:mm:ss');
        item.expiry_end_date = this.formatDuring(item.expiry_end_date,'yyyy-MM-dd HH:mm:ss');
        this.vueObj = item;
        this.isReLoad = true;
      }else if(str == "release"){
        this.release(item.id,item.parent_id);
      }else if(str == "delete"){
        this.planDel(item.id,item.scheme_status,item.scheme_name)
      }else if(str == "usable"){
        this.title = "可见设置"
        this.isShowUsableDialog = true;
        this.vueObj = item;
        this.visibilityType = "1";
        this.visibilitySetCatagory = "1";
      }else if(str == "blind"){
        this.title = "屏蔽设置"
        this.isShowUsableDialog = true;
        this.vueObj = item;
        this.visibilityType = "2";
        this.visibilitySetCatagory = "1";
      }
    },
    //管理分组操作
    onManage: function(param){
      if(param == "manage"){
        this.isShowChargeGroupDialog = true;
      }
    },
    // 创建服务
    onCreate: function() {
      this.isShowChargeDialog = true;
    },
    updateChargeRule: function(param) {
      LoadingBoxService.open("请稍候...");
      var myData = {};
      myData = {
        serviceId: param.id,
        fieldName: "3",
        fieldValue: param.bill_rules.join(","),
        fieldType: "array"
      };
      apiClient.post(
        "itsmApi/enterprisePlatform/updateServiceForOneField",
        myData,
        function(data) {
          LoadingBoxService.close();
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
    release: function(id,parent_id){
        var that = this;
        var myData = {
            id:id,
            parent_id:parent_id
        };
        LoadingBoxService.open('正在处理.....')
        apiClient.post('itsmApi/feeScheme/feeSchemePublish', myData, function(data) {
            if(data.status == 200){
                LoadingBoxService.close();
                that.onQuery();
            }
        }).catch(e => {
            if (e.response && e.response.status === 503) {
                TipBoxService.open(e.response.data.exception,2)
                LoadingBoxService.close()
            }
            throw e
        })
    },
    planDel: function(id,status,name){
      var that = this;
      var myData = {data:[{id:id,scheme_status:status,scheme_name:name}]};
      NoticeBoxService.open("是否删除所选内容,删除后将无法撤回！",function(){
          NoticeBoxService.close();
          LoadingBoxService.open("正在删除，请稍候");
          apiClient.post('itsmApi/feeScheme/deleteFeeSchemes', myData, function(data) {
              if(data.status == 200){
                  that.onQuery();
                  TipBoxService.open("删除成功");
                  LoadingBoxService.close();
              }
          }).catch(e => {
              if (e.response && e.response.status === 503) {
                  TipBoxService.open(e.response.data.exception,2)
                  LoadingBoxService.close()
              }
              throw e
          })
      })
    },
    groupDel: function(obj){
      var that = this;
      var myData = {};
      var belong_id = '';
      if(obj.belong_type == "PERSONAL"){
          belong_id = obj.user_id;
      }else{
          belong_id = obj.enterprise_id;
      }
      myData = {id:obj.id,belong_type:obj.belong_type,belong_id:belong_id};
      LoadingBoxService.open('正在删除.....')
      apiClient.post('itsmApi/feeSchemeGroup/deleteSchemeGroup',myData, function(data) {
          LoadingBoxService.close();
          if(data.status == 200){
              that.getPlanGroup();
              TipBoxService.open('删除成功');
          }
      }).catch(e => {
          if (e.response && e.response.status === 503) {
              TipBoxService.open(e.response.data.exception,2)
              LoadingBoxService.close()
          }
          throw e
      })
    },
    saveChargePlan: function(param){
      var that = this;
      var myData = {};
      myData = param
      // that.onCloseDialog();
      LoadingBoxService.open("请稍候....");
      apiClient.post('itsmApi/feeScheme/insertOrUpdateFeeScheme', myData, function(data) {
          if(data.status == 200){
              TipBoxService.open("保存成功");
              that.onCloseDialog();
              LoadingBoxService.close();
              that.onQuery();
          }
      }).catch(e => {
          if (e.response && e.response.status === 503) {
              TipBoxService.open(e.response.data.exception,2)
              LoadingBoxService.close()
          }
          throw e
      })
    },
    saveChargeGroup: function(param){
      var that = this;
      var myData = {};
      myData = param;
    },
    // 关闭弹窗回调
    onCloseDialog: function(flag) {
      this.isReLoad = flag;
      this.isShowCreatDialog = flag;
      this.isShowChargeDialog = flag;
      this.isShowChargeGroupDialog = flag;
      this.isShowUsableDialog = flag;
    },
    getGroupList: function(){
      this.isRefresh = false;
      this.getPlanGroup();
    },
    //获取分组
    getPlanGroup: function() {
      var myData = "";
      var that = this;
      apiClient.get("itsmApi/feeSchemeGroup/querySchemeGroup", myData, function(data) {
          that.planGroupList = [{label:"全部",value:""}];
          for (var i = 0; i < data.group_list.length; i++) {
            data.group_list[i].checkbox = false;
            data.group_list[i].isChoose = false;
            data.group_list[i].isAdd = false;
          }
          for(var i = 0 ; i < data.group_list.length ; i++){
            var obj = {
              label:"",
              value:""
            }
            obj.label = data.group_list[i].scheme_group_name;
            obj.value = data.group_list[i].id;
            // 包装一个hover,因为后台字段中没有
            that.groupInfo = data.group_list.map(item => {
              item.hover = false;
              return item;
            });
            that.planGroupList.push(obj);
          }
          if(data.group_list.length==0){
              that.groupInfo = [];//说明是最后一个删除
          }
          that.setSelectData(true);
          that.$nextTick( () =>{
              that.isRefresh = false;//将刷新状态置为原始状态
          })
        })
        .catch(e => {
          if (e.response && e.response.status === 503) {
            TipBoxService.open(e.response.data.exception, 2);
            LoadingBoxService.close();
          }
          throw e;
        });
    },
    //计费方案右侧按钮
    addRightPlanBtn: function(obj,btnArray){
      let btn = {};
      if(obj.scheme_status != 3){
        btn = { label: '删除', str: 'delete' };
      }
      let isBtnNull = false;
      if(btn.str != undefined){
          for (let j = 0; j < btnArray.length; j++) {
            let rcode = this.transferBtnCode(btnArray[j].code);
            if(btn.str == rcode){
              return btn;
              
            }          
          }
      }
      if(!isBtnNull){
        return null;
      }
     
    },
    //高级按钮
    addSeniorBtns: function(obj, btnArray) {
      obj.isShowSenior = false;
      obj.seniorBtns = [];
      let btns = [];
      if(obj.scheme_status == "0"){
        btns = ['edit','release'];
      }else if(obj.scheme_status == "1"){
        btns = ['usable','blind'];
      }
      //obj.seniorBtns = btns;
      for(let i = 0; i < btns.length; i++){
        for(let j = 0; j < btnArray.length; j++){
          let rcode = this.transferBtnCode(btnArray[j].code);
          if(btns[i] == rcode){
            obj.seniorBtns.push(rcode);
          }
        }
      }
      return obj;
    },
    //转时间方法
    formatDuring: function(time, format){
        var t = new Date(time);
        var tf = function(i){return (i < 10 ? '0' : '') + i};
        return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function(a){
            switch(a){
                case 'yyyy':
                    return tf(t.getFullYear());
                    break;
                case 'MM':
                    return tf(t.getMonth() + 1);
                    break;
                case 'mm':
                    return tf(t.getMinutes());
                    break;
                case 'dd':
                    return tf(t.getDate());
                    break;
                case 'HH':
                    return tf(t.getHours());
                    break;
                case 'ss':
                    return tf(t.getSeconds());
                    break;
            }
        })
    },
    transferBtnCode:function(code){
      let rcode = '';
      switch (code) {
        case ("sc_newPlan"):
        rcode = 'create';
        break;
        case ("sc_planTypeManage"):
        rcode = 'planTypeManage';
        break;
        case ("sc_planPublish"):
        rcode = 'release';
        break;
        case ("sc_planEdit"):
        rcode = 'edit';
        break;
        case ("sc_planRemove"):
        rcode = 'delete';
        break;
        case ("sc_planUsable"):
        rcode = 'usable';
        break;
        case ("sc_planBlind"):
        rcode = 'blind';
        break;        
      }
      return rcode;
    }
  }
};
</script>
<style src="../../css/common/tableComponent.css" scoped></style>

