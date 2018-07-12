<template>
  <div class="publicContent">
    <div class="publicNav">
         <ul class="commonTableTab">
        <li v-for="(item,index) in uiData.tabArr" 
             class="commonTableTabItem" 
             v-bind:class="{active:item.active}" 
             v-on:click="tabItemClickHandler(index)">
            {{item.name}}
        </li>
      </ul>
      <div class="returnBtn publicRedBtn"  v-show='isCreatePrivilage' @click="toCreateApp">新建应用</div>
      <div class="searchBox">
        <input type="text" placeholder="请输入关键字" v-on:keyup.enter="interfaceSearchHandler()" v-model="keyWords">
        <span class="searchImg" :click="interfaceSearchHandler()"></span>
      </div>
    </div>
    <div class="loadDataBox" :style="{'height':(fullHeight-160) +'px'}">
      <!--表头UI active状态切换-->
       <!--<div class="commonTableTabContainer">
        <div v-for="(item,index) in uiData.tabArr" 
             class="commonTableTabItem" 
             v-bind:class="{active:item.active}" 
             v-on:click="tabItemClickHandler(index)">
             {{item.name}}
        </div>
      </div> -->

      <!--全部应用数据列表-->
      <div class="commonTabContent" :class="{active:uiData.tabArr[0].active}" :style="{'height':(fullHeight-160) +'px'}">
        <common-table-component 
          :body-data="allAppsData.bodyData" 
          :header-data="allAppsData.headerData" 
          :page-total="allAppsData.pageTotal" 
          :admin="true" 
          :searchWord='searchWord'
          :link="link"
          v-on:change="tableGetDataHandler"
          v-on:edit="tableItemEditHandler" 
          v-on:newRemove="tableItemRemoveHandler" 
          v-on:look="tableItemLookHandler" 
          :tag-check-data="allAppsData.checkData" 
                    :imgLine="true" 
          :component-type="allAppsData.resourceType">
        </common-table-component>
      </div>

      <!--WEB应用数据列表-->
      <div class="commonTabContent" v-bind:class="{active:uiData.tabArr[1].active}" :style="{'height':(fullHeight-160) +'px'}">
        <common-table-component 
          :body-data="webAppsData.bodyData" 
          :header-data="webAppsData.headerData" 
          :page-total="webAppsData.pageTotal" 
          :admin="true"
          :searchWord='searchWord'
          :link="link"
          v-on:change="tableGetDataHandler"
          v-on:edit="tableItemEditHandler" 
          v-on:newRemove="tableItemRemoveHandler" 
          v-on:look="tableItemLookHandler" 
          :tag-check-data="webAppsData.checkData" 
                    :imgLine="true" 

          :component-type="webAppsData.resourceType">
        </common-table-component>
      </div>

      <!--后台应用数据列表-->
      <div class="commonTabContent" v-bind:class="{active:uiData.tabArr[2].active}" :style="{'height':(fullHeight-160) +'px'}">
        <common-table-component 
          :body-data="behindAppsData.bodyData" 
          :header-data="behindAppsData.headerData" 
          :page-total="behindAppsData.pageTotal" 
          :admin="true"
          :searchWord='searchWord' 
          :link="link"
          v-on:change="tableGetDataHandler"
          v-on:edit="tableItemEditHandler" 
          v-on:newRemove="tableItemRemoveHandler"
          v-on:look="tableItemLookHandler" 
          :tag-check-data="behindAppsData.checkData" 
                    :imgLine="true" 
          :component-type="behindAppsData.resourceType">
        </common-table-component>
      </div>
    </div>
    <!--审批弹框-->
    <div class="overlay" v-show="uiData.approvalBoxShow">
      <div class="popupBox">
        <div class="popupBoxHeader">审批<i class="popupBoxCloseIconBtn" v-on:click="closeApplyBoxHandler"></i> </div>
        <div class="popupBoxBody" v-bind:class="{noBottomPadding:approvalBoxData.tipShow}">
          <div class="popupBoxLine" style="text-align: left;">
            <span class="approveTitle">审批：</span>
            <el-radio-group v-model="approvalBoxData.approvalRadio" @change="approvalBoxRadioChangeHandler">
              <el-radio :label="2">通过</el-radio>
              <el-radio :label="3">不予通过</el-radio>
            </el-radio-group>
          </div>
          <div class="popupBoxLine" style="text-align: left;" v-show="approvalBoxData.tipShow">
              <span class="approveTitle"><span class="publicRedColor">*</span> 备注：</span>
              <textarea v-on:keyup="approveTextChangeHandler" v-model="approvalBoxData.reason" class="approvalText" placeholder="输入20字以内"></textarea>
              <p class="approvalBoxTipMsg">{{approvalBoxData.tipMsg}}</p>
          </div>
        </div>
        <div class="popupBoxBtnContainer">
          <div class="popupBoxBtn" v-on:click="closeApplyBoxHandler">取消</div>
          <div class="popupBoxBtn redBg" v-on:click="approvalBoxOkHandler">确定</div>
        </div>
      </div>
    </div>
    <!--审批弹框结束-->
  </div>
</template>
<script>
import commonTableComponent from "../common/commonTableComponent.vue";
import apiToken from "../../../publicJs/apiToken.js";
import apiClient from "../../../publicJs/ApiClient.js";
import AlertBoxService from "../../../publicJs/AlertBoxService.js";
import TipBoxService from "../common/TipBoxService.js";
/*import createAppleftMenu from '@/components/serviceManager/createAppleftMenu'*/
import LoadingBoxService from "../../../publicJs/LoadingBoxService.js";
import NoticeBoxService from "../../../publicJs/NoticeBoxService.js";
import UtilService from "../../../publicJs/UtilService.js";
export default {
  name: "appsManager",
  components: {
    commonTableComponent
    //createAppleftMenu,
  },
  data() {
    return {
      keyWords: "",
      fullHeight: document.documentElement.clientHeight,
      uiData: {
        //设置表头选项操作
        tabArr: [
          { name: "全部", active: true },
          { name: "WEB应用", active: false },
          { name: "后台应用", active: false }
        ],
        currentTabName: "全部",
        applyResourceBoxShow: false,
        approvalBoxShow: false
      },
      approvalBoxData: {
        approvalRadio: 2,
        reason: "",
        id: "",
        tipShow: false,
        tipMsg: "不予通过，备注为必填"
      },
      allAppsData: {
        //全部应用
        bodyData: {},
        headerData: [],
        checkData: [
          { name: "审批已通过", select: true, statu: 3 },
          { name: "审批未通过", select: true, statu: 2 },
          { name: "待审批通过", select: true, statu: 1 }
        ],
        tagsData: [],
        resourceType: 0,
        pageTotal: 0
      },
      webAppsData: {
        //WEB应用
        bodyData: {},
        headerData: [],
        checkData: [
          { name: "审批已通过", select: true, statu: 3 },
          { name: "审批未通过", select: true, statu: 2 },
          { name: "待审批通过", select: true, statu: 1 }
        ],
        tagsData: [],
        resourceType: 1,
        pageTotal: 0
      },
      behindAppsData: {
        //后台应用
        bodyData: {},
        headerData: [],
        checkData: [
          { name: "审批已通过", select: true, statu: 3 },
          { name: "审批未通过", select: true, statu: 2 },
          { name: "待审批通过", select: true, statu: 1 }
        ],
        tagsData: [],
        resourceType: 2,
        pageTotal: 0
      },
      fullOptionData: {
        //穷举所有所有中状态的情况
        statusTransfer: [
          {
            approveStatus: "0",
            runStatus: "1",
            className: "notPass",
            buttonShow: "approvalShow,lookApprovalShow,lookReasonShow"
          },
          {
            approveStatus: "1",
            runStatus: "1",
            className: "notPass",
            buttonShow: "approvalShow,lookApprovalShow"
          },
          {
            approveStatus: "2",
            runStatus: "1",
            className: "notPass",
            buttonShow: "lookApprovalShow,lookReasonShow"
          },
          {
            approveStatus: "3",
            runStatus: "1",
            className: "pass",
            buttonShow: "lookApprovalShow"
          }
        ],
        //记录button种类，方便动态维护
        buttonConst: [
          { key: "lookApprovalShow", value: "查看申请" },
          { key: "approveShow", value: "审批" },
          { key: "lookReasonShow", value: "查看原因" }
        ],
        link: 0,
        //记录class种类，方便动态维护
        classConst: [
          { key: "pass", value: "通过" },
          { key: "notPass", value: "未通过" }
        ]
      },
      isDebug: false,
      metadataActived: false,

      privilageName: "应用审批",
      listPrivelageButtons: [],
      isCreatePrivilage: true,
      listPrivelageButtons2: [],
      listButtonPrivilageMapping: [
        {
          code: "reason",
          code_alias: "lookReasonShow"
        },
        {
          code: "detail",
          code_alias: "lookApprovalShow"
        },
        {
          code: "approval",
          code_alias: "approvalShow"
        }
      ]
    };
  },
  created() {
    /*  this.getAllAppsData();//初始化数据 ALL数据
        this.getWebAppsData();//初始化数据 WEB数据
        this.getBehindAppsData();//初始化数据 后台数据*/
    this.createHeaderData();
    let index = this.$route.query.index;
    if (index !== undefined || index !== "undefined") {
      this.tabItemClickHandler(index);
    }
    this.getPrivilageByCondition();
  },
  methods: {
    interfaceSearchHandler() {
      this.searchWord = this.keyWords;
    },
    tabItemClickHandler(index) {
      var currentIndex;
      for (var i = 0; i < this.uiData.tabArr.length; i++) {
        var obj = this.uiData.tabArr[i];
        if (obj.active == true) {
          currentIndex = i;
          break;
        }
      }
      if (currentIndex != index && index != undefined) {
        this.uiData.tabArr[index].active = true;
        this.uiData.tabArr[currentIndex].active = false;
        this.uiData.currentTabName = this.uiData.tabArr[index].name;
      }
      if (index == 2) {
        this.metadataActived = true;
      }
    },
    toMain() {
      this.$router.push("appsManage");
    },
    createHeaderData() {
      var that = this;
      var targetData = {};
      var settings = [
        {
          sort: true,
          name: "上传时间",
          sortField: "create_time",
          default: "true"
        }
      ];
      that.allAppsData.headerData = settings;
      that.webAppsData.headerData = settings;
      that.behindAppsData.headerData = settings;
    },
    tableGetDataHandler(val) {
      var that = this;
      if (
        that.listPrivelageButtons2 == null ||
        that.listPrivelageButtons2.size == 0
      ) {
        return;
      }

      var dataModel = {};
      dataModel.app_type = val.resourceType;
      dataModel.keyword = val.searchParam;
      dataModel.sortType = "1" == val.sortType ? "asc" : "desc";
      dataModel.sortField = val.sortField;
      dataModel.pageSize = val.pageSize;
      dataModel.pageNum = val.pageNum;
      dataModel.approveStatus = val.statusArray;
      //应用审批：过滤审批状态未提交状态
      if(val.resourceType!=0){
        dataModel.excludeApproveStatus = "0";
      }
      apiClient.post("itsmApi/application/findApps", dataModel, function(data) {
        console.log("这是返回的数据=", data);
        var total = data.results.total;
        var targetData = {};
        switch (val.resourceType) {
          case 0:
            targetData = that.allAppsData;
            break;
          case 1:
            targetData = that.webAppsData;
            break;
          case 2:
            targetData = that.behindAppsData;
            break;
        }
        targetData.pageTotal = total;
        var selectIndex = targetData.headerData.length - 1;
        targetData.headerData[selectIndex].tagItemList = data.results.runTags.data;
        var runMapper = data.results.appRunStatus;
        var approveMapper = data.results.appApproveStatus;
        var newData = that.dataHandler(data, runMapper, approveMapper);
        targetData.bodyData = newData;
      });

      // if (val.resourceType == 0) {
      //   //全部应用 
      //   var dataModel = {};
      //   dataModel.app_type = val.resourceType;
      //   dataModel.keyword = val.searchParam;
      //   dataModel.sortType = "1" == val.sort ? "asc" : "desc";
      //   dataModel.pageSize = val.pageSize;
      //   dataModel.pageNum = val.pageNum;
      //   dataModel.approveStatus = that.allAppsData.checkData;
      //   //应用审批：过滤审批状态未提交状态
      //   //dataModel.excludeApproveStatus = "0";
      //   var param = { params: JSON.stringify(dataModel) };
      //   console.info("查询-全部应用数据信息参数 = " + param.toString());
      //   apiClient.post("itsmApi/application/findApps", param, function(data) {
      //     console.info("查询-全部应用数据信息参数返回结果 = " + data.toString());
      //     var total = data.results.total;
      //     that.allAppsData.pageTotal = total;
      //     console.info("查询全部应用返回结果信息总数 = " + total);
      //     //that.dataData.headerData[1].tagsData=data.results.tags[0];
      //     that.allAppsData.headerData = [{ sort: true, name: "上传时间" }];
      //     console.info("查询全部应用返回结果信息 = " + data);
      //     var runMapper = data.results.appRunStatus;
      //     var approveMapper = data.results.appApproveStatus;
      //     var newData = that.dataHandler(data, runMapper, approveMapper);
      //     that.allAppsData.bodyData = newData;
      //   });
      // } else if (val.resourceType == 1) {
      //   //WEB应用
      //   var dataModel = {};
      //   dataModel.app_type = val.resourceType;
      //   dataModel.app_status = val.tag;
      //   dataModel.keyword = val.searchParam;
      //   dataModel.sortType = "1" == val.sort ? "asc" : "desc";
      //   dataModel.pageSize = val.pageSize;
      //   dataModel.pageNum = val.pageNum;
      //   dataModel.approveStatus = that.webAppsData.checkData;
      //   //应用审批：过滤审批状态未提交状态
      //   dataModel.excludeApproveStatus = "0";
      //   var param = { params: JSON.stringify(dataModel) };
      //   if (that.isDebug) {
      //     console.info("查询-全部应用数据信息参数 = " + param.toString());
      //   }
      //   apiClient.post("itsmApi/application/findApps", param, function(data) {
      //     if (that.isDebug) {
      //       console.info("查询-全部应用数据信息参数返回结果 = " + data.toString());
      //     }
      //     var total = data.results.total;
      //     that.webAppsData.pageTotal = total;
      //     /*  if(total > 0){
      //           that.webAppsData.headerData[2].tagsData = data.results.runTags;
      //         }*/
      //     that.webAppsData.headerData = [{ sort: true, name: "上传时间" }];
      //     if (that.isDebug) {
      //       console.info("查询全部应用返回结果信息总数 = " + total);
      //       console.info("查询全部应用返回结果信息 = " + data);
      //     }
      //     //that.dataData.headerData[1].tagsData=data.results.tags[0];
      //     var runMapper = data.results.appRunStatus;
      //     var approveMapper = data.results.appApproveStatus;
      //     var newData = that.dataHandler(data, runMapper, approveMapper);
      //     that.webAppsData.bodyData = newData;
      //   });
      // } else if (val.resourceType == 2) {
      //   //后台应用
      //   var dataModel = {};
      //   dataModel.app_type = val.resourceType;
      //   dataModel.app_status = val.tag;
      //   dataModel.keyword = val.searchParam;
      //   dataModel.sortType = "1" == val.sort ? "asc" : "desc";
      //   dataModel.pageSize = val.pageSize;
      //   dataModel.pageNum = val.pageNum;
      //   //应用审批：过滤审批状态未提交状态
      //   dataModel.excludeApproveStatus = "0";
      //   dataModel.approveStatus = that.behindAppsData.checkData;
      //   var param = { params: JSON.stringify(dataModel) };
      //   if (that.isDebug) {
      //     console.info("查询-全部应用数据信息参数 = " + param.toString());
      //   }
      //   apiClient.post("itsmApi/application/findApps", param, function(data) {
      //     console.info("查询-全部应用数据信息参数返回结果 = " + data.toString());
      //     var total = data.results.total;
      //     that.behindAppsData.pageTotal = total;
      //     if (total > 0) {
      //       that.behindAppsData.headerData[2].tagsData = data.results.runTags;
      //     }
      //     that.behindAppsData.headerData = [{ sort: true, name: "上传时间" }];
      //     if (that.isDebug) {
      //       console.info("查询全部应用返回结果信息总数 = " + total);
      //       //that.dataData.headerData[1].tagsData=data.results.tags[0];
      //       console.info("查询全部应用返回结果信息 = " + data);
      //     }
      //     var runMapper = data.results.appRunStatus;
      //     var approveMapper = data.results.appApproveStatus;
      //     var newData = that.dataHandler(data, runMapper, approveMapper);
      //     that.behindAppsData.bodyData = newData;
      //   });
      // }
    },
    tableItemEditHandler(val) {
      //表单组件点击编辑的事件

      //神
      if (val.tableItemChangeType == "approval") {
        this.approvalBoxData.id = val.id;
        this.uiData.approvalBoxShow = true;
      }
    },
    tableItemRemoveHandler(val) {
      //表单组件点击删除的事件
      var that = this;
      NoticeBoxService.open("是否删除当前注册数据项，删除后将无法撤回", function(data) {
        NoticeBoxService.close();
        var params = { app_id: val.id };
        LoadingBoxService.open("删除数据，请稍候...");
        apiClient.post("itsmApi/application/removeApp", params, function(data) {
          if (data.status == 200) {
            that.tableGetDataHandler(val.linkObj);
            LoadingBoxService.close();
            TipBoxService.open("删除成功");
          } else {
            LoadingBoxService.close();
            TipBoxService.open("删除失败");
          }
        });
      });
    },
    tableItemLookHandler(val) {
      //表单组件点击查看按钮的事件
      //进行查看原因
      if (val.tipText == "查看原因") {
        apiClient.post(
          "itsmApi/application/getReason",
          { id: val.id },
          function(data) {
            var msg = data.results.data[0].audit_reason;
            if (msg == "") msg = "无未通过原因";
            AlertBoxService.open(msg, "未通过原因");
          }
        );
      } else if (val.tipText == "查看申请") {
        //进行查看申请调用
        window.open("#/lookAppDetail?id=" + val.id, "_blank");
      }
    },
    dataHandler(data, runStatusMapper, approveStatusMapper) {
      let arr = [];
      let that = this;
      data.results.data.forEach(function(v, i) {
        console.info(v.audit_status);
        //if(v.audit_status != "0"){
        let obj = {};
        obj = v;
        console.log("aaasasas", obj);
        //设计传值字段
        obj.lineData = [
          { img: true, imgSrc: obj.imageServerPath },
          { name: obj.app_name },
          { name: "", stateText: true },
          { name: obj.app_version },
          { name: obj.service_num },
          { name: obj.user_name },
          { name: obj.upload_time },
          { name: obj.app_last_start_time },
          { name: "", control: true }
        ];

        obj.lineData = [
          { exImg: true, imgSrc: obj.imageServerPath, itemWidth: "10%" },
          {
            text: true,
            itemWidth: "20%",
            textData: [
              { title: "应用名称", value: obj.app_name },
              { title: "审核状态", value: "", colorClass: "red" },
              { title: "版本号", value: obj.app_version }
            ]
          },
          {
            text: true,
            itemWidth: "20%",
            textData: [
              { title: "服务数", value: obj.service_num },
              { title: "创建人", value: obj.user_name },
              { title: "上传时间", value: obj.upload_time }
            ]
          },
          {
            text: true,
            itemWidth: "30%",
            textData: [{ title: "上次启动时间", value: obj.app_last_start_time }]
          },
          {
            btn: true,
            itemWidth: "20%",
            btnArr: [{ class: "revokeShow", clickType: "user", title: "关联用户" }]
          }
        ];

        obj = that.dealStatusMapping(obj, obj.app_status, obj.audit_status);
        obj = that.dealApproveStatusMapper(obj, approveStatusMapper);
        console.info("class：类 " + obj.class);
        console.info(
          obj.app_name + " -->审批状态：" + obj.lineData[1].name + "-----"
        );
        arr.push(obj);
        //  }
      });
      if (false) {
        console.info("得出最终数组结果：");
        for (var element2 in arr) {
          //console.info("class：类 "+element2.class);
          //console.info("应用状态："+element2.lineData[2].name+"-----");
          // console.info("审批状态："+element2.lineData[1].name+"-----");
          console.info("总体:" + element2);
        }
      }
      return arr;
    },
    closeApplyBoxHandler() {
      //关闭申请资源弹框
      this.uiData.applyResourceBoxShow = false;
      this.uiData.approvalBoxShow = false;
      this.approvalBoxData.id = "";
      this.approvalBoxData.reason = "";
      this.approvalBoxData.tipShow = false;
      this.approvalBoxData.tipMsg = "不予通过，备注为必填";
    },
    approvalBoxRadioChangeHandler() {
      console.info(this.approvalBoxData.approvalRadio);
      var val = this.approvalBoxData.approvalRadio;
      if (val == 3) {
        this.approvalBoxData.tipShow = true;
      } else {
        this.approvalBoxData.tipShow = false;
      }
    },
    approvalBoxOkHandler() {
      //审批弹框点击确定事件
      console.info("approve=", this.approvalBoxData);
      var that = this;
      var reason = this.approvalBoxData.reason;
      if (that.approvalBoxData.tipShow == true) {
        if (reason.length > 0 && reason.length <= 20) {
          approvalLink();
        } else if (reason.length == 0) {
          this.approvalBoxData.tipMsg = "请填写备注";
        } else if (reason.length > 20) {
          this.approvalBoxData.tipMsg = "请输入20个字以内";
        }
      } else {
        approvalLink();
      }
      function approvalLink() {
        var obj = {
          reviewstatus: that.approvalBoxData.approvalRadio,
          reviewnotes: that.approvalBoxData.reason
        };
        var str = JSON.stringify(obj);
        that.uiData.approvalBoxShow = false;
        LoadingBoxService.open("正在审批中，请稍候...");
        apiClient.post(
          "itsmApi/application/approveData",
          { applyParam: str, id: that.approvalBoxData.id },
          function(data) {
            that.approvalBoxData.id = "";
            that.approvalBoxData.reason = "";
            that.approvalBoxData.tipShow = false;
            that.approvalBoxData.tipMsg = "不予通过，备注为必填";
            if (data.results.result == "success") {
              setTimeout(function() {
                LoadingBoxService.close();
                TipBoxService.open(data.exception, 0);
                that.link++;
              }, 2000);
            } else {
              LoadingBoxService.close();
              TipBoxService.open("审批失败：" + data.exception, 1);
            }
          }
        );
      }
    },
    approveTextChangeHandler() {
      //console.info(this.approvalBoxData.reason.length);
    },
    applyFirstSelectHandler(data) {
      //申请资源弹框第一个下拉框选择事件
      console.info("选择的值是=", data);
      var that = this;

      that.applyBoxData.secondSelectValue = "";
      apiClient.post(
        "itsmApi/findResourcesByType?token=",
        { resourceType: data },
        function(data) {
          //console.info("弹框数据=",data);
          that.applyBoxData.secondSelectData = data.results;
        }
      );
    },
    dealApproveStatusMapper(element, approveMapper) {
      console.info("接受到审批状态参数：" + approveMapper);
      //公共变量赋值操作
      element.lineData[1].textData[1].value =
        approveMapper[element.audit_status];
      element.tipText = approveMapper[element.audit_status];
      return element;
    },
    //处理状态映射按钮
    dealStatusMapping(element, runStatus, approveStatus) {
      let that = this;
      //前端静态化状态按钮显示静态关系：对应文件静态状态映射关系：
      //方便随时修改【approveStatus,runStatus】
      var ruleMapping = that.fullOptionData.statusTransfer; //规则映射
      var buttonMapping = that.fullOptionData.buttonConst; //按钮映射
      var classMapping = that.fullOptionData.classConst; //class样式映射
      //获取样式匹配方法
      return that.matchMethod(
        element,
        ruleMapping,
        classMapping,
        buttonMapping,
        approveStatus,
        runStatus
      );
    },
    //匹配合适规则显示按钮方法
    matchMethod(
      element,
      ruleMapping,
      classMapping,
      buttonMapping,
      approveStatus,
      runStatus
    ) {
      let that = this;
      if (ruleMapping == null || ruleMapping == undefined) {
        return element; //返回空
      } else {
        ruleMapping.forEach(function(v, i) {
          var tempObj = {}; //值传递操作
          tempObj = v;
          console.info(
            "传入的规则映射关系： " +
              " 审批状态: " +
              tempObj.approveStatus +
              " - 运行状态： " +
              tempObj.runStatus +
              " 类型样式： " +
              tempObj.className +
              " 按钮显示：" +
              tempObj.buttonShow
          );

          if (tempObj.approveStatus == approveStatus) {
            console.info(
              tempObj.approveStatus + "&&&&&&&&&&&&&& " + approveStatus
            );
            console.info("状态已匹配: " + tempObj.buttonShow);
            console.info("开始匹配Button按钮......");
            element = that.transferButtonMapping(element, tempObj.buttonShow);
            console.info("开始匹配class类......");
            element = that.matchClassMethod(
              element,
              tempObj.className,
              classMapping
            );
          }
        });
      }
      return element;
    },
    //匹配class类方法
    matchClassMethod(element, className, classMapping) {
      let that = this;
      if (className == null || className == "" || className == undefined) {
        return element;
      }
      //生产时可以放开无需匹配，作为扩展用,可以做为tip参考
      if (that.isDebug) {
        classMapping.forEach(function(v, i) {
          if (className == v.key) {
            console.info("已经匹配到对应key对应的映射关系按钮： " + v.value);
          }
        });
      }
      element.class = className;
      return element;
    },
    //匹配按钮方法
    matchButtonMethod(element, buttonElement) {
      let that = this;
      if (buttonElement == null || buttonElement == undefined) {
        return element;
      }
      element[buttonElement] = that.contains(buttonElement);
      return element;
    },
    toCreateApp() {
      if (
        sessionStorage.getItem("app_id") != null ||
        sessionStorage.getItem("key") != undefined
      ) {
        sessionStorage.removeItem("app_id");
      }
      this.$router.push({ name: "createApp", query: {} });
    },
    //转换映射关系：将对于的映射关系映射成对于的按钮显示关系
    transferButtonMapping(element, buttonShow) {
      let that = this;
      if (
        buttonShow == null ||
        buttonShow == undefined ||
        buttonShow == "" ||
        buttonShow.length == 0
      ) {
        return element;
      } else {
        var splitFlag = buttonShow.indexOf(",") > 0;
        if (splitFlag) {
          var buttonShowArray = buttonShow.split(",");
          buttonShowArray.forEach(function(v, i) {
            console.info("遍历Button节点： " + v);
            element = that.matchButtonMethod(element, v);
          });
        } else {
          element = that.matchButtonMethod(element, buttonShow);
        }
        console.info("Button最后输出：" + element.toString());
        return element;
      }
    },
    lookDetail(val) {
      //进行查看申请调用
      window.open("#/loadAppDetail?id=" + val.id, "_blank");
    },
    elementDataHandler(data) {
      //处理武汉数据元的数据
      var newArr = new Array();
      var dataArr = data.results.dataList;
      var that = this;
      for (var i = 0; i < dataArr.length; i++) {
        var obj = dataArr[i];
        var newObj = obj;
        // var time=new Date(parseInt(newObj.createdTime) * 1000).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");
        var time = UtilService.formatDuring(
          newObj.createdTime,
          "yyyy-MM-dd HH:mm:ss"
        );
        var time2 = UtilService.formatDuring(
          newObj.approveDate,
          "yyyy-MM-dd HH:mm:ss"
        );
        newObj.lineData = [
          { name: newObj.name },
          { name: newObj.tag },
          { name: newObj.internalTag },
          { name: newObj.cnName },
          { naem: "", stateText: true },
          { naem: time2 },
          { name: time },
          { name: "", control: true }
        ];
        if (newObj.approvalStatus == 1) {
          newObj.lineData[4].name = "待审批";
          newObj.class = "wait";
          newObj.lookApprovalShow = true;
        } else if (newObj.approvalStatus == 0) {
          newObj.lineData[4].name = "未提交";
          newObj.class = "notSubmit";
          obj.editShow = true;
          obj.removeShow = true;
        } else if (newObj.approvalStatus == 2) {
          newObj.lineData[4].name = "已通过";
          newObj.class = "pass";
        } else if (newObj.approvalStatus == 3) {
          newObj.lineData[4].name = "未通过";
          newObj.class = "notPass";
          newObj.lookReasonShow = true;
        }
        newArr.push(newObj);
      }
      return newArr;
    },
    getPrivilageByCondition() {
      var that = this;
      apiClient.get(
        "priviapi/auth/getAppDownMenuAndButton",
        { appId: "ServiceManger" },
        function(data) {
          console.info("获取权限", data);
          that.loadMenuResource(data.data);
          //加载操作信息服务
          console.info("加载信息结束......");
          that.link++;
          that.isCreatePrivilage = that.contains2(
            "addApp",
            that.listPrivelageButtons2
          );
        }
      );
    },
    loadMenuResource(elementList) {
      let that = this;
      if (elementList != null && elementList.length != 0) {
        for (var element in elementList) {
          var element2 = elementList[element];
          if (that.privilageName == element2.menuName) {
            var dataResourceList = element2.button;
            for (var element3 in dataResourceList) {
              that.listPrivelageButtons.push(
                that.transferButtonAlias(dataResourceList[element3].code)
              );
              that.listPrivelageButtons2.push(dataResourceList[element3].code);
            }
          }
        }
      }
    },
    //转换为本地页面级别的按钮名称
    transferButtonAlias(element) {
      let that = this;
      for (var element1 in that.listButtonPrivilageMapping) {
        if (element == that.listButtonPrivilageMapping[element1].code) {
          return that.listButtonPrivilageMapping[element1].code_alias;
        }
      }
      return "";
    },
    //判断是否包含
    contains(element1) {
      let that = this;
      for (var element in that.listPrivelageButtons) {
        if (element1 == that.listPrivelageButtons[element]) {
          return true;
        }
      }
      return false;
    },
    contains2(elem, arr) {
      for (var i = 0; i < arr.length; i++) {
        if (elem == arr[i]) {
          return true;
        }
      }
      return false;
    }
  },
  mounted() {
    var vm = this;
    $(window).resize(function() {
      vm.fullHeight = document.documentElement.clientHeight;
    });
  }
};
</script>
   <style src="../../css/common/public.css" scoped></style>
  <style src="../../css/servicesManage/personApplyManage.css" scoped></style>

