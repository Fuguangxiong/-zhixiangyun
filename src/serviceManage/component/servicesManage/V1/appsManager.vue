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
      <div class="returnBtn publicRedBtn"  v-show='isCreatePrivilage' @click="toPortManage">端口维护</div>
      <div class="returnBtn publicRedBtn"  v-show='isCreatePrivilage' @click="toCreateApp">新建应用</div>
      <div class="searchBox"> 
        <input type="text" placeholder="请输入关键字"  v-on:keyup.enter="interfaceSearchHandler()" v-model="keyWords">
        <span class="searchImg" :click="interfaceSearchHandler()"></span>
      </div>
    </div>
    <div class="loadDataBox" v-bind:style="{'height':(fullHeight-160) +'px'}">
      <!--表头UI active状态切换-->
     <!--  <div class="commonTableTabContainer">
       <div v-for="(item,index) in uiData.tabArr" 
            class="commonTableTabItem" 
            v-bind:class="{active:item.active}" 
            v-on:click="tabItemClickHandler(index)">
            {{item.name}}
       </div>
     </div>
      -->
      <!--全部应用数据列表-->
      <div class="commonTabContent" :class="{active:uiData.tabArr[0].active}" :style="{'height':(fullHeight-160) +'px'}">
        <common-table-component 
          :body-data="allAppsData.bodyData" 
          :header-data="allAppsData.headerData" 
          :page-total="allAppsData.pageTotal" 
          :admin="true" 
          :link="link" 
          :searchWord='searchWord'
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
                    :link="link" 
          :searchWord='searchWord'
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
                    :link="link"  
          :searchWord='searchWord'
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
  </div>
</template>
<script>
import commonTableComponent from "../common/commonTableComponent.vue";
import apiToken from "../../../publicJs/apiToken.js";
import apiClient from "../../../publicJs/ApiClient.js";
import AlertBoxService from "../../../publicJs/AlertBoxService.js";
import TipBoxService from "../common/TipBoxService.js";
import LoadingBoxService from "../../../publicJs/LoadingBoxService.js";
import NoticeBoxService from "../../../publicJs/NoticeBoxService.js";
import UtilService from "../../../publicJs/UtilService.js";
/*import createAppleftMenu from '@/components/serviceManager/createAppleftMenu'*/
export default {
  name: "appsManager",
  components: {
    commonTableComponent
    //createAppleftMenu,
  },
  data() {
    return {
      tokenId: null,
      link: 0,
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
        //applyResourceBoxShow:false,
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
          { name: "已通过", select: true, statu: 3 },
          { name: "待审核", select: true, statu: 1 },
          { name: "未通过", select: true, statu: 2 },
          { name: "未提交", select: true, statu: 0 }
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
          { name: "已通过", select: true, statu: 3 },
          { name: "待审核", select: true, statu: 1 },
          { name: "未通过", select: true, statu: 2 },
          { name: "未提交", select: true, statu: 0 }
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
          { name: "已通过", select: true, statu: 3 },
          { name: "待审核", select: true, statu: 1 },
          { name: "未通过", select: true, statu: 2 },
          { name: "未提交", select: true, statu: 0 }
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
            className: "notSubmit",
            buttonShow: "editShow,removeShow,lookApprovalShow"
          },
          {
            approveStatus: "1",
            runStatus: "1",
            className: "notPass",
            buttonShow: "revokeShow,lookApprovalShow"
          },
          {
            approveStatus: "2",
            runStatus: "1",
            className: "notPass",
            buttonShow: "editShow,removeShow,lookApprovalShow,lookReasonShow"
          },
          {
            approveStatus: "3",
            runStatus: "2",
            className: "pass",
            buttonShow: "deployShow,lookApprovalShow"
          },
          {
            approveStatus: "3",
            runStatus: "8",
            className: "pass",
            buttonShow: "cancelShow,lookApprovalShow"
          },
          {
            approveStatus: "3",
            runStatus: "3",
            className: "pass",
            buttonShow: "switchShow,lookApprovalShow"
          },
          {
            approveStatus: "3",
            runStatus: "9",
            className: "pass",
            buttonShow: "lookApprovalShow"
          },
          {
            approveStatus: "3",
            runStatus: "4",
            className: "pass",
            buttonShow: "maintenanceShow,lookApprovalShow"
          },
          {
            approveStatus: "3",
            runStatus: "5",
            className: "pass",
            buttonShow: "switchShow,downShow,lookApprovalShow"
          },
          {
            approveStatus: "3",
            runStatus: "10",
            className: "pass",
            buttonShow: "lookApprovalShow"
          },
          {
            approveStatus: "3",
            runStatus: "6",
            className: "pass",
            buttonShow: "switchShow,downShow,lookApprovalShow"
          },
          {
            approveStatus: "3",
            runStatus: "7",
            className: "pass",
            buttonShow: "upShow,removeShow,lookApprovalShow"
          },
          {
            approveStatus: "3",
            runStatus: "11",
            className: "pass",
            buttonShow: "lookApprovalShow"
          },
          {
            approveStatus: "3",
            runStatus: "0",
            className: "pass",
            buttonShow: "lookApprovalShow"
          }
        ],
        //记录button种类，方便动态维护
        buttonConst: [
          { key: "editShow", value: "编辑" },
          { key: "removeShow", value: "删除" },
          { key: "revokeShow", value: "撤销" },
          { key: "lookProcessShow", value: "查看流程" },
          { key: "lookApprovalShow", value: "查看详情" },
          { key: "deployShow", value: "部署" },
          { key: "cancelShow", value: "取消" },
          { key: "switchShow", value: "启动" },
          { key: "maintenanceShow", value: "维护" },
          { key: "switchShow", value: "停止" },
          { key: "downShow", value: "下架" },
          { key: "upShow", value: "上架" },
          { key: "lookReasonShow", value: "查看原因" }
        ],
        //记录class种类，方便动态维护
        classConst: [
          { key: "notSubmit", value: "未提交" },
          { key: "pass", value: "通过" },
          { key: "notPass", value: "未通过" }
        ]
      },
      isDebug: false,
      metadataActived: false,
      loadDelaySecond: 5000,
      privilageName: "应用管理",
      listPrivelageButtons2: [],
      isCreatePrivilage: true,
      listPrivelageButtons: [],
      listButtonPrivilageMapping: [
        {
          code: "edit",
          code_alias: "editShow"
        },
        {
          code: "detail",
          code_alias: "lookApprovalShow"
        },
        {
          code: "start",
          code_alias: "switchShow"
        },
        {
          code: "off",
          code_alias: "downShow"
        },
        {
          code: "on",
          code_alias: "upShow"
        },
        {
          code: "revoked",
          code_alias: "revokeShow"
        },
        {
          code: "protect",
          code_alias: "maintenanceShow"
        },
        {
          code: "deploy",
          code_alias: "deployShow"
        },
        {
          code: "cancle",
          code_alias: "cancelShow"
        },
        {
          code: "stop",
          code_alias: "switchShow"
        },
        {
          code: "delete",
          code_alias: "removeShow"
        }
      ]
    };
  },
  created() {
    //setTimeout(function(){
    //  LoadingBoxService.open("正在加载,请稍等......")
    /*   this.getAllAppsData();//初始化数据 ALL数据
          this.getWebAppsData();//初始化数据 WEB数据
          this.getBehindAppsData();//初始化数据 后台数据*/
    //加载是否有创建应用服务按钮操作
    //this.isCreatePrivilage = this.contains2("new",this.listPrivelageButtons2);
    console.info("展现出所有相关的创建权限：", this.listPrivelageButtons2);
    this.createHeaderData();
    let index = this.$route.query.index;
    if (index !== undefined || index !== "undefined") {
      this.tabItemClickHandler(index);
    }
    // },this.loadDelaySecond);

    // LoadingBoxService.close();
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
      var vm = this;
      $(window).resize(function() {
        vm.fullHeight = document.documentElement.clientHeight;
      });
    },
    toMain() {
      this.$router.push("appsManager");
    },
    createHeaderData() {
      var that = this;
      var targetData = {};
      var settings1 = [
        {
          sort: true,
          name: "创建时间",
          sortField: "create_time",
          default: "true"
        },
        {
          tag: true,
          name: "应用状态",
          tagItemList: [],
          tagOpen: false
        }
      ];
      var settings2 = [
        {
          sort: true,
          name: "创建时间",
          sortField: "create_time",
          default: "true"
        },
        {
          tag: true,
          name: "资源标签",
          tagItemList: [],
          tagOpen: false
        }
      ];
      that.allAppsData.headerData = settings1;
      that.webAppsData.headerData = settings2;
      that.behindAppsData.headerData = settings2;
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
      dataModel.app_status = val.tag;
      dataModel.keyword = val.searchParam;
      dataModel.sortType = "1" == val.sortType ? "asc" : "desc";
      dataModel.pageSize = val.pageSize;
      dataModel.sortField = val.sortField;
      dataModel.pageNum = val.pageNum;
      dataModel.approveStatus = val.statusArray;
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
        targetData.headerData[selectIndex].tagItemList =
          data.results.runTags.data;
        var runMapper = data.results.appRunStatus;
        var approveMapper = data.results.appApproveStatus;
        var newData = that.dataHandler(data, runMapper, approveMapper);
        targetData.bodyData = newData;
      });

      // if (val.resourceType == 0) {
      //   //全部应用
      //   var dataModel = {};
      //   dataModel.app_type = val.resourceType;
      //   dataModel.app_status = val.tag;
      //   dataModel.keyword = val.searchParam;
      //   dataModel.sortType = "1" == val.sort ? "asc" : "desc";
      //   dataModel.pageSize = val.pageSize;
      //   dataModel.pageNum = val.pageNum;
      //   dataModel.approveStatus = that.allAppsData.checkData;
      //   var param = { params: JSON.stringify(dataModel) };
      //   apiClient.get(
      //     apiToken.newApi("itsmApi/application/findApps/"),
      //     param,
      //     function(data) {
      //       console.log("这是返回的数据=", data);
      //       var total = data.results.total;
      //       that.allAppsData.pageTotal = total;
      //       //if(total > 0){
      //       that.allAppsData.headerData = [
      //         { sort: true, name: "创建时间" },
      //         {
      //           tag: true,
      //           name: "应用状态",
      //           tagItemList: data.results.runTags.data,
      //           tagOpen: false
      //         }
      //       ];
      //       //that.allAppsData.headerData[3].tagsData = data.results.runTags;
      //       //}
      //       //that.dataData.headerData[1].tagsData=data.results.tags[0];
      //       var runMapper = data.results.appRunStatus;
      //       var approveMapper = data.results.appApproveStatus;
      //       var newData = that.dataHandler(data, runMapper, approveMapper);
      //       that.allAppsData.bodyData = newData;
      //     }
      //   );
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
      //   var param = { params: JSON.stringify(dataModel) };
      //   if (that.isDebug) {
      //   }
      //   apiClient.get(
      //     apiToken.newApi("itsmApi/application/findApps/"),
      //     param,
      //     function(data) {
      //       if (that.isDebug) {
      //       }
      //       var total = data.results.total;
      //       that.webAppsData.pageTotal = total;
      //       // //if(total > 0){
      //       //   that.webAppsData.headerData[3].tagsData = data.results.runTags;
      //       that.webAppsData.headerData = [
      //         { sort: true, name: "创建时间" },
      //         {
      //           tag: true,
      //           name: "资源标签",
      //           tagItemList: data.results.runTags.data,
      //           tagOpen: false
      //         }
      //       ];
      //       //}
      //       if (that.isDebug) {
      //       }
      //       //that.dataData.headerData[1].tagsData=data.results.tags[0];
      //       var runMapper = data.results.appRunStatus;
      //       var approveMapper = data.results.appApproveStatus;
      //       var newData = that.dataHandler(data, runMapper, approveMapper);
      //       that.webAppsData.bodyData = newData;
      //     }
      //   );
      // } else if (val.resourceType == 2) {
      //   //后台应用
      //   var dataModel = {};
      //   dataModel.app_type = val.resourceType;
      //   dataModel.app_status = val.tag;
      //   dataModel.keyword = val.searchParam;
      //   dataModel.sortType = "1" == val.sort ? "asc" : "desc";
      //   dataModel.pageSize = val.pageSize;
      //   dataModel.pageNum = val.pageNum;
      //   dataModel.approveStatus = that.behindAppsData.checkData;
      //   var param = { params: JSON.stringify(dataModel) };
      //   if (that.isDebug) {
      //   }
      //   apiClient.get(
      //     apiToken.newApi("itsmApi/application/findApps/"),
      //     param,
      //     function(data) {
      //       var total = data.results.total;
      //       that.behindAppsData.pageTotal = total;
      //       // if(total > 0){
      //       /* that.behindAppsData.headerData[3].tagsData = data.results.runTags;*/
      //       that.behindAppsData.headerData = [
      //         { sort: true, name: "创建时间" },
      //         {
      //           tag: true,
      //           name: "资源标签",
      //           tagItemList: data.results.runTags.data,
      //           tagOpen: false
      //         }
      //       ];

      //       // }
      //       if (that.isDebug) {
      //         //that.dataData.headerData[1].tagsData=data.results.tags[0];
      //       }
      //       var runMapper = data.results.appRunStatus;
      //       var approveMapper = data.results.appApproveStatus;
      //       var newData = that.dataHandler(data, runMapper, approveMapper);
      //       that.behindAppsData.bodyData = newData;
      //     }
      //   );
      // }
    },
    //系统所有的编辑操作处理器
    tableItemEditHandler(val) {
      console.log("编辑操作传参======", val);
      var that = this;
      var type = val.tableItemChangeType;
      var param = { id: val.id };
      //修改
      if (type == "edit") {
        this.$router.push({ name: "createApp", query: { app_id: val.id } });
      } else if (type == "deploy") {
        //部署
        LoadingBoxService.open("正在部署,请稍等......");
        apiClient.post("itsmApi/application/deployApp", param, function(data) {
          console.info("执行撤回操作 ：" + data.toString());
          if (data.status == 200) {
            val.resourceType = val.commonTableResourceType;
            setTimeout(function() {
              that.tableGetDataHandler(val.linkObj);
              LoadingBoxService.close();
              TipBoxService.open("部署成功", 0);
            }, that.loadDelaySecond);
          } else {
            LoadingBoxService.close();
            TipBoxService.open("部署失败", 1);
          }
        });
      } else if (type == "revoke") {
        //撤销
        NoticeBoxService.open("是否撤销当前审核，撤销后将不再审核", function(data) {
          NoticeBoxService.close();
          LoadingBoxService.open("正在撤销,请稍等......");
          apiClient.post("itsmApi/application/revokeApp", param, function(
            data
          ) {
            if (data.status == 200) {
              val.resourceType = val.commonTableResourceType;
              setTimeout(function() {
                that.tableGetDataHandler(val.linkObj);
                LoadingBoxService.close();
                TipBoxService.open("撤销成功", 0);
              }, that.loadDelaySecond);
            } else {
              LoadingBoxService.close();
              TipBoxService.open("撤销失败", 1);
            }
          });
        });
      } else if (type == "cancel") {
        //取消
        LoadingBoxService.open("正在取消,请稍等......");
        apiClient.post("itsmApi/application/cancelApp", param, function(data) {
          if (data.status == 200) {
            val.resourceType = val.commonTableResourceType;
            setTimeout(function() {
              that.tableGetDataHandler(val.linkObj);
              LoadingBoxService.close();
              TipBoxService.open("取消成功", 0);
            }, that.loadDelaySecond);
          } else {
            LoadingBoxService.close();
            TipBoxService.open("取消失败", 1);
          }
        });
      } else if (type == "switch") {
        //启动-停止
        if (!val.switchData) {
          LoadingBoxService.open("正在启用,请稍等......");
          apiClient.post("itsmApi/application/startApp", param, function(data) {
            if (data.status == 200) {
              val.resourceType = val.commonTableResourceType;
              setTimeout(function() {
                console.log("启用后======", val);
                that.tableGetDataHandler(val.linkObj);
                LoadingBoxService.close();
                TipBoxService.open("启动成功", 0);
              }, that.loadDelaySecond);
            } else {
              setTimeout(function() {
                that.tableGetDataHandler(val.linkObj);
                LoadingBoxService.close();
                TipBoxService.open("启动失败", 1);
              }, 3000);
            }
          });
        } else {
          //停用操作
          apiClient.post(
            "itsmApi/application/getAtomicNumByAppId",
            { id: val.id },
            function(data) {
              var text = "当前有" + data.results.data + "个正常启动的服务,是否仍然停用!";
              NoticeBoxService.open(
                text,
                function(data) {
                  NoticeBoxService.close();
                  LoadingBoxService.open("正在停用,请稍等......");
                  apiClient.post("itsmApi/application/stopApp", param, function(
                    data
                  ) {
                    if (data.status == 200) {
                      val.resourceType = val.commonTableResourceType;
                      setTimeout(function() {
                        console.log("tingyong======", val);
                        that.tableGetDataHandler(val.linkObj);
                        LoadingBoxService.close();
                        TipBoxService.open("停用成功", 0);
                      }, that.loadDelaySecond);
                    } else {
                      that.tableGetDataHandler(val.linkObj);
                      setTimeout(function() {
                        LoadingBoxService.close();
                        TipBoxService.open("停用失败", 1);
                      }, 3000);
                    }
                  });
                },
                function() {
                  if (val.commonTableResourceType == 0) {
                    that.allAppsData.bodyData.forEach(function(v, i) {
                      if (v.id == val.id) {
                        that.allAppsData.bodyData[i].switchData = false;
                      }
                    });
                  } else if (val.commonTableResourceType == 1) {
                    webAppsData.bodyData;
                  } else {
                    behindAppsData.bodyData;
                  }
                }
              );
            }
          );
        }
      } else if (type == "maintenance") {
        //维护
        apiClient.post("itsmApi/application/maintainApp", param, function(
          data
        ) {
          LoadingBoxService.open("正在维护,请稍等......");
          if (data.status == 200) {
            val.resourceType = val.commonTableResourceType;
            setTimeout(function() {
              that.tableGetDataHandler(val.linkObj);
              LoadingBoxService.close();
              TipBoxService.open("维护成功", 0);
            }, that.loadDelaySecond);
          } else {
            LoadingBoxService.close();
            TipBoxService.open("维护失败", 1);
          }
        });
      } else if (type == "up") {
        //上架
        apiClient.post("itsmApi/application/upApp", param, function(data) {
          LoadingBoxService.open("正在上架,请稍等......");
          if (data.status == 200) {
            val.resourceType = val.commonTableResourceType;
            setTimeout(function() {
              that.tableGetDataHandler(val.linkObj);
              LoadingBoxService.close();
              TipBoxService.open("上架成功", 0);
            }, that.loadDelaySecond);
          } else {
            LoadingBoxService.close();
            TipBoxService.open("上架失败", 1);
          }
        });
      } else if (type == "down") {
        //下架
        LoadingBoxService.open("正在下架,请稍等......");
        apiClient.post("itsmApi/application/downApp", param, function(data) {
          if (data.status == 200) {
            val.resourceType = val.commonTableResourceType;
            setTimeout(function() {
              that.tableGetDataHandler(val.linkObj);
              LoadingBoxService.close();
              TipBoxService.open("下架成功", 0);
            }, that.loadDelaySecond);
          } else {
            LoadingBoxService.close();
            TipBoxService.open("下架失败", 1);
          }
        });
      } else {
        TipBoxService.open("系统无法是被该属性!");
      }
    },
    tableItemRemoveHandler(val) {
      //表单组件点击删除的事件
      var that = this;
      var params = { id: val.id };
      var url =
        val.audit_status == "3"
          ? "itsmApi/application/delApp"
          : "itsmApi/application/removeApp";
      NoticeBoxService.open("是否删除当前注册数据项，删除后将无法撤回", function(data) {
        NoticeBoxService.close();
        LoadingBoxService.open("删除数据，请稍候...");
        apiClient.post(url, params, function(data) {
          if (data.status == 200) {
            setTimeout(function() {
              that.tableGetDataHandler(val.linkObj);
              LoadingBoxService.close();
              TipBoxService.open("删除成功", 0);
            }, that.loadDelaySecond);
          } else {
            LoadingBoxService.close();
            TipBoxService.open("删除失败", 1);
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
        window.open("#/loadAppDetail?id=" + val.id, "_blank");
      }
    },
    dataHandler(data, runStatusMapper, approveStatusMapper) {
      let arr = [];
      let that = this;
      data.results.data.forEach(function(v, i) {
        let obj = {};
        obj = v;
        //设计传值字段
        console.info("obj=", obj.logoServerPath);
        obj.lineData = [
          { exImg: true, imgSrc: obj.logoServerPath, itemWidth: "10%" },
          {
            text: true,
            itemWidth: "20%",
            textData: [
              { title: "应用名称", value: obj.app_name },
              { title: "审核状态", value: "", colorClass: "red" },
              { title: "应用状态", value: "", colorClass: "red" }
            ]
          },
          {
            text: true,
            itemWidth: "20%",
            textData: [
              { title: "版本号", value: obj.app_version },
              { title: "服务数", value: obj.service_num },
              { title: "上传时间", value: obj.upload_time }
            ]
          },
          {
            text: true,
            itemWidth: "30%",
            textData: [
              { title: "创建时间", value: obj.create_time },
              { title: "上次启动时间", value: obj.app_last_start_time }
            ]
          },
          {
            btn: true,
            itemWidth: "20%",
            btnArr: [{ class: "revokeShow", clickType: "user", title: "关联用户" }]
          }
        ];
        /*obj.switchShow=true;
              obj.editShow=true;
              obj.revokeShow=true;*/
        //obj.lineData=[{img:true,imgSrc:obj.imageServerPath},{name:obj.app_name},{name:'',stateText:true},{name:'',stateText:true},{name:obj.app_version},{name:obj.service_num},{name:obj.upload_time},{name:obj.create_time},{name:obj.app_last_start_time},{name:'',control:true}]
        obj = that.dealStatusMapping(obj, obj.app_status, obj.audit_status);
        obj = that.dealRunStatusMapper(obj, runStatusMapper);
        obj = that.dealApproveStatusMapper(obj, approveStatusMapper);
        arr.push(obj);
      });
      if (false) {
        for (var element2 in arr) {
          //console.info("class：类 "+element2.class);
          //console.info("应用状态："+element2.lineData[2].name+"-----");
          // console.info("审批状态："+element2.lineData[1].name+"-----");
          console.info("总体:" + element2);
        }
      }
      return arr;
    },
    dealRunStatusMapper(element, runMapper) {
      //公共变量赋值操作
      element.lineData[1].textData[2].value = runMapper[element.app_status];
      element.tipText = runMapper[element.app_status];
      return element;
    },
    dealApproveStatusMapper(element, approveMapper) {
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
          if (
            tempObj.approveStatus == approveStatus &&
            tempObj.runStatus == runStatus
          ) {
            element = that.transferButtonMapping(element, tempObj.buttonShow);
            element = that.matchClassMethod(
              element,
              tempObj.className,
              classMapping
            );
          } else {
            //判断该条数据是否属于未开通状态
            if (approveStatus == 0) {
              //待开通状态的样式展出
              element.class = "notSubmit";
              //待开通状态的样式展出：此处为手动侵入写法 不支持 不推荐 暂时方案
              element.editShow = true;
              element.removeShow = true;
              //待开通状态的修改更新：侵入性修改
              element.app_status = "1";
            }
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
          }
        });
      }
      element.lineData[1].textData[2].value;
      element.class = className;
      return element;
    },
    //匹配按钮方法
    matchButtonMethod(element, buttonElement) {
      let that = this;
      if (buttonElement == null || buttonElement == undefined) {
        return element;
      }
      //判断是否属于维护中状态
      if ("5" == element.app_status) {
        element.switchData = false;
      } else if ("3" == element.app_status) {
        element.switchData = true;
      } else if ("6" == element.app_status) {
        element.switchData = true;
      }
      element[buttonElement] = that.contains(buttonElement);
      return element;
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
            element = that.matchButtonMethod(element, v);
          });
        } else {
          element = that.matchButtonMethod(element, buttonShow);
        }
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
    toCreateApp() {
      if (
        sessionStorage.getItem("app_id") != null ||
        sessionStorage.getItem("key") != undefined
      ) {
        sessionStorage.removeItem("app_id");
      }
      this.$router.push({ name: "createApp", query: {} });
    },
    refreshPage(val) {
      val.resourceType = 1;
      this.tableGetDataHandler(val);
      val.resourceType = 2;
      this.tableGetDataHandler(val);
      val.resourceType = 0;
      this.tableGetDataHandler(val);
      //switch(resourceType){
      //  case 0:this.tableGetDataHandler();break;
      ///  case 1:this.tableGetDataHandler();break;
      //  case 2:this.tableGetDataHandler();break;
      //  default :
      ///    this.tableGetDataHandler();
      //    this.tableGetDataHandler();
      //    this.tableGetDataHandler();
      //    console.info("刷新页面失败!");
      // }
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
    },
    toPortManage() {
      // if (
      //   sessionStorage.getItem("app_id") != null ||
      //   sessionStorage.getItem("key") != undefined
      // ) {
      //   sessionStorage.removeItem("app_id");
      // }
      this.$router.push({ name: "portManage", query: {} });
    },
  }
};
</script>
  <!-- Add "scoped" attribute to limit CSS to this component only -->
  <style src="../../css/common/public.css" scoped></style>
  <style src="../../css/servicesManage/personApplyManage.css" scoped></style>

