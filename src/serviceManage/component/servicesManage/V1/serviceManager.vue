<template>
  <div class="publicContent">
    <!-- <left-nav :selectIndex="1"></left-nav> -->
    <div class="publicNav">
      <ul class="commonTableTab">
        <li v-for="(item,index) in uiData.tabArr" 
             class="commonTableTabItem" 
             v-bind:class="{active:item.active}" 
             v-on:click="tabItemClickHandler(index)">
            {{item.name}}
        </li>
      </ul>
      <div v-if="getCreatBtn()" class="returnBtn publicRedBtn" @click="openServiceRegister">创建服务</div>
      <div class="searchBox">
         <input type="text" placeholder="请输入关键字" v-on:keyup.enter="interfaceSearchHandler()" v-model="keyWords">
        <span class="searchImg" :click="interfaceSearchHandler()"></span>
      </div>
    </div>
    <div class="loadDataBox" :style="{'height':(fullHeight-160) +'px'}">
      <!--<div class="commonTableTabContainer"> 
         <div v-for="(item,index) in uiData.tabArr" class="commonTableTabItem" v-bind:class="{active:item.active}" v-on:click="tabItemClickHandler(index)">{{item.name}}</div> 
      </div>-->
      <!--全部-->
      <div class="commonTabContent" v-bind:class="{active:uiData.tabArr[0].active}" :style="{'height':(fullHeight-160) +'px'}">
        <common-table-component 
        :body-data="allData.bodyData" 
        :header-data="allData.headerData" 
        :page-total="allData.pageTotal" 
        :admin="true" 
        :link="link" 
        :imgLine="true" 
        :searchWord='searchWord'
        v-on:change="tableGetDataHandler" 
        v-on:look="tableItemLookHandler" 
        v-on:edit="tableItemEditHandler" 
        v-on:remove="tableItemRemoveHandler" 
        :tag-check-data="allData.checkData" 
        :tags-data="allData.tagsData" 
         v-on:itemPreviewHandler='itemPreviewHandler' 
        :component-type="allData.resourceType"></common-table-component>
      </div>
      <!--全部-->
      <!--平台服务-->
      <div class="commonTabContent" v-bind:class="{active:uiData.tabArr[1].active}" :style="{'height':(fullHeight-160) +'px'}">
        <common-table-component
         :body-data="platformData.bodyData" 
         :header-data="platformData.headerData"
         :page-total="platformData.pageTotal"
        :admin="true" 
        :searchWord='searchWord'
         :link="link" 
          :imgLine="true" 
          v-on:change="tableGetDataHandler" 
          v-on:look="tableItemLookHandler" 
          v-on:edit="tableItemEditHandler"
           v-on:remove="tableItemRemoveHandler" 
        :tag-check-data="platformData.checkData" 
        :tags-data="platformData.tagsData" 
         v-on:itemPreviewHandler='itemPreviewHandler' 
        :component-type="platformData.resourceType"></common-table-component>
      </div>
      <!--平台服务-->
      <!--远程服务-->
      <div class="commonTabContent" v-bind:class="{active:uiData.tabArr[2].active}" :style="{'height':(fullHeight-160) +'px'}">
        <common-table-component 
        :body-data="remoteData.bodyData" 
        :header-data="remoteData.headerData" 
        :page-total="remoteData.pageTotal" 
        :admin="true"
        :searchWord='searchWord'
         :link="link" 
         :imgLine="true" 
         v-on:change="tableGetDataHandler"
          v-on:look="tableItemLookHandler"
           v-on:edit="tableItemEditHandler" 
           v-on:remove="tableItemRemoveHandler"
           v-on:itemPreviewHandler='itemPreviewHandler' 
        :tag-check-data="remoteData.checkData" 
        :tags-data="remoteData.tagsData" 
        :component-type="remoteData.resourceType"></common-table-component>
      </div>
      <!--远程服务-->

    </div>
    <!--创建服务弹框-->
    <div :class="{tankuang:overlayShow}"> 
    <div class="select_service_type" v-show="uiData.createService">
    <div class="select_service_type_top">
        <span class="sst_text">选择服务类型</span>
        <span class="sst_ico" @click="closeServiceRegister"></span>
    </div>
    <div  class="select_service_type_main">
        <div :class="{clickClass : border1}" @click="optService('1')" class="sstm_left limain">
            <div class="sstml_main aclickse" >
                <span class="cj_new_ico"></span>
                <p>创建原子服务</p>
            </div>
        </div>
        <div :class="{clickClass : border2}"  @click="optService('2')" class="sstm_right limain">
            <div class="sstmr_main aclickse" >
                <span class="fw_zh_ico"></span>
                <p>创建组合服务</p>
            </div>
        </div>
    </div>
    <div class="button_box">
        <span class="queding" @click="serviceRegister">确 定</span>
        <span class="quxiao" @click="closeServiceRegister">取 消</span>
    </div>
  </div>
  </div>
</div>
</template>
 
<script>
import commonTableComponent from "../common/commonTableComponent.vue";
import apiToken from "../../../publicJs/apiToken.js";
import apiClient from "../../../publicJs/ApiClient.js";
import TipBoxService from "../common/TipBoxService.js";
import LoadingBoxService from "../../../publicJs/LoadingBoxService.js";
import leftNav from "../../../publicComponent/leftNav.vue";
import NoticeBoxService from "../../../publicJs/NoticeBoxService.js";
import AlertBoxService from "../../../publicJs/AlertBoxService.js";
import Util from "../../../publicJs/Util";
export default {
  name: "serviceManager",
  components: {
    commonTableComponent,
    leftNav
  },
  data() {
    return {
      keyWords: "",
      fullHeight: document.documentElement.clientHeight,
      overlayShow: false,
      link: 0,
      border1: false,
      border2: false,
      uiData: {
        tabArr: [
          { name: "全部", active: true },
          { name: "平台服务", active: false },
          { name: "远程服务", active: false }
        ],
        applyResourceBoxShow: false,
        approvalBoxShow: false,
        createService: false,
        optService: ""
      },
      approvalBoxData: {
        id: "",
        openNum: 0
      },
      allData: {
        //全部
        bodyData: {},
        headerData: [],
        checkData: [
          { name: "已通过", select: true, statu: 2 },
          { name: "待审核", select: true, statu: 1 },
          { name: "未通过", select: true, statu: 3 },
          { name: "未提交", select: true, statu: 0 }
        ],
        tagsData: [],
        resourceType: 0,
        pageTotal: 0
      },
      platformData: {
        //应用服务
        bodyData: {},
        headerData: [],
        checkData: [
          { name: "已通过", select: true, statu: 2 },
          { name: "待审核", select: true, statu: 1 },
          { name: "未通过", select: true, statu: 3 },
          { name: "未提交", select: true, statu: 0 }
        ],
        tagsData: [],
        resourceType: 2,
        pageTotal: 0
      },
      remoteData: {
        //远程服务
        bodyData: {},
        headerData: [],
        checkData: [
          { name: "已通过", select: true, statu: 2 },
          { name: "待审核", select: true, statu: 1 },
          { name: "未通过", select: true, statu: 3 },
          { name: "未提交", select: true, statu: 0 }
        ],
        tagsData: [],
        resourceType: 1,
        pageTotal: 0
      },
      btnControlData: []
    };
  },
  created() {
    this.createHeaderData();
  },
  mounted() {
    this.getBtnArr();
    var vm = this;
    $(window).resize(function() {
      vm.fullHeight = document.documentElement.clientHeight;
    });
  },
  methods: {
    interfaceSearchHandler() {
      this.searchWord = this.keyWords;
    },
    toMain() {
      this.$router.push("appsManager");
    },
    itemPreviewHandler(obj) {
      var id = obj.id;
      window.open("#/invoke?previewTag=1&id=" + id, "_blank");
    },
    tabItemClickHandler(index) {
      //console.info(index);
      var currentIndex;
      for (var i = 0; i < this.uiData.tabArr.length; i++) {
        var obj = this.uiData.tabArr[i];
        if (obj.active == true) {
          currentIndex = i;
          break;
        }
      }
      if (currentIndex != index) {
        this.uiData.tabArr[index].active = true;
        this.uiData.tabArr[currentIndex].active = false;
      }
    },
    createHeaderData() {
      var that = this;
      var targetData = {};
      var settings = [
        {
          sort: false,
          name: "上传时间",
          sortField: "apply_time",
          default: "true"
        },
        { sort: true, name: "开通时间", sortField: "open_time" },
        { sort: true, name: "调用次数", sortField: "visit_num" },
        {
          tag: true,
          name: "服务状态",
          tagItemList: [],
          tagOpen: false
        }
      ];
      that.allData.headerData = settings;
      that.remoteData.headerData = settings;
      that.platformData.headerData = settings;
    },
    // createAllData() {
    //   var that = this;
    //   that.allData.headerData = [
    //     {
    //       sort: false,
    //       name: "上传时间",
    //       sortField: "apply_time",
    //       default: "true"
    //     },
    //     { sort: true, name: "开通时间", sortField: "visit_num" },
    //     { sort: true, name: "调用次数", sortField: "open_time" },
    //     {
    //       tag: true,
    //       name: "服务状态",
    //       tagItemList: [],
    //       tagOpen: false
    //     }
    //   ];
    // },
    // createPlatformData() {
    //   var that = this;
    //   that.platformData.headerData = [
    //     {
    //       sort: false,
    //       name: "上传时间",
    //       sortField: "apply_time",
    //       default: "true"
    //     },
    //     { sort: true, name: "开通时间", sortField: "visit_num" },
    //     { sort: true, name: "调用次数", sortField: "open_time" },
    //     {
    //       tag: true,
    //       name: "服务状态",
    //       tagItemList: [],
    //       tagOpen: false
    //     }
    //   ];
    // },
    // createRemoteData() {
    //   var that = this;
    //   that.remoteData.headerData = [
    //     {
    //       sort: false,
    //       name: "上传时间",
    //       sortField: "apply_time",
    //       default: "true"
    //     },
    //     { sort: true, name: "开通时间", sortField: "visit_num" },
    //     { sort: true, name: "调用次数", sortField: "open_time" },
    //     {
    //       tag: true,
    //       name: "服务状态",
    //       tagItemList: [],
    //       tagOpen: false
    //     }
    //   ];
    // },
    optService(val) {
      //创建服务弹框中选择的按钮
      var that = this;
      that.uiData.optService = val;
      if (val == "1") {
        if (this.border1 == false) {
          this.border1 = true;
          this.border2 = false;
        } else {
          this.border1 = false;
          this.border2 = false;
        }
      } else {
        if (this.border2 == false) {
          this.border2 = true;
          this.border1 = false;
        } else {
          this.border2 = false;
          this.border1 = false;
        }
      }
    },
    serviceRegister() {
      //创建服务
      var that = this;
      if (that.uiData.optService == "1") {
        that.$router.push({
          name: "newService"
        });
      } else if (that.uiData.optService == "2") {
        that.$router.push({
          name: "newCompositeService"
        });
      } else {
        TipBoxService.open("请选择服务", 2);
      }
    },
    openServiceRegister() {
      //打开创建窗口
      var that = this;
      that.overlayShow = true;
      that.uiData.createService = true;
    },
    closeServiceRegister() {
      //关闭创建窗口
      var that = this;
      that.uiData.optService = "";
      that.overlayShow = false;
      that.uiData.createService = false;
    },
    tableItemLookHandler(val) {
      //表单组件点击查看的事件
      //window.sessionStorage.setItem('editId',val.id);
      //        console.info("ffjkdj=",val);
      if (val.tipText == "查看原因") {
        apiClient.post(
          "itsmApi/atomicService/viewReason",
          { id: val.id },
          function(data) {
            //console.info("弹框数据=",data);
            var msg = data.results.data[0].audit_reason;
            if (msg == "") msg = "无未通过原因";
            AlertBoxService.open(msg);
          }
        );
      } else if (val.tipText == "查看申请") {
        if (val.isatomic == "false") {
          if (val.audit_status == 2 || val.audit_status == 3) {
            window.open(
              "#/servicePortfolioDetailsExamine?id=" + val.id,
              "_blank"
            );
          } else {
            window.open("#/compositeServiceDetail?id=" + val.id, "_blank");
          }
        } else {
          window.open(
            "#/serviceInfo?id=" + val.id + "&audit_status=" + val.audit_status,
            "_blank"
          );
        }
      }
      //this.$router.push({name:'ApplyFillInFormDetail',query:{resourcetype:val.resourcetype,resourcetags:val.resourcetags,dbsource:val.dbsource,id:val.id}});
    },
    tableItemEditHandler(val) {
      //表单组件点击编辑的事件
      console.info("editData=", val);
      var that = this;
      var type = val.tableItemChangeType;
      //启停
      if (type == "switch") {
        if (val.service_status == "正常") {
          LoadingBoxService.open("正在关闭，请稍候...");
          var myData = {
            serviceId: val.id,
            appId: val.app_id,
            serviceStatus: "关闭"
          };
        } else if (val.service_status == "关闭") {
          LoadingBoxService.open("正在启动，请稍候...");
          var myData = {
            serviceId: val.id,
            appId: val.app_id,
            serviceStatus: "正常"
          };
        } else {
          LoadingBoxService.open("正在关闭，请稍候...");
          var myData = {
            serviceId: val.id,
            appId: val.app_id,
            serviceStatus: "关闭"
          };
        }
        apiClient.post("itsmApi/atomicService/startAndStop", myData, function(
          data
        ) {
          if (data.status == "200") {
            LoadingBoxService.close();
            that.tableGetDataHandler(val.linkObj);
            TipBoxService.open("成功");
          } else {
            LoadingBoxService.close();
            TipBoxService.open("失败", 2);
          }
        });
      } else if (type == "revoke") {
        //撤销
        NoticeBoxService.open("是否撤销当前审核，撤销后将不再审核", function(data) {
          NoticeBoxService.close();
          LoadingBoxService.open("撤销操作，请稍候...");
          apiClient.post(
            "itsmApi/atomicService/revokeAudit",
            { serviceId: val.id },
            function(data) {
              if (data.status == "200") {
                LoadingBoxService.close();
                TipBoxService.open("撤销成功");
                that.tableGetDataHandler(val.linkObj);
              } else {
                LoadingBoxService.close();
                TipBoxService.open("撤销失败", 2);
              }
            }
          );
        });
      } else if (type == "edit") {
        //编辑
        if (val.isatomic == "false") {
          this.$router.push({
            name: "newCompositeService",
            query: { id: val.id }
          });
        } else {
          this.$router.push({
            name: "newService",
            query: { atomicId: val.id }
          });
        }
      }
    },
    tableItemRemoveHandler(val) {
      //表单组件点击删除的事件
      var that = this;
      NoticeBoxService.open("是否删除当前服务，删除后将无法撤回", function(data) {
        NoticeBoxService.close();
        LoadingBoxService.open("删除数据，请稍候...");
        apiClient.post(
          "itsmApi/atomicService/deleteAtomicInfo",
          { serviceId: val.id },
          function(data) {
            if (data.status == "200") {
              LoadingBoxService.close();
              TipBoxService.open("删除成功");
              that.tableGetDataHandler(val.linkObj);
            } else {
              LoadingBoxService.close();
              TipBoxService.open("删除失败", 2);
            }
          }
        );
      });
    },
    tableGetDataHandler(val) {
      //表单组件申请表数据
      var that = this;
      //如果没有取到权限的值，则不执行
      if (that.btnControlData.length == 0) {
        return;
      }
      val.apptype = val.resourceType;
      val.keyword = val.searchParam;
      val.reviewStatus = val.status;
      //全部
      apiClient.post("itsmApi/atomicService/selectServiceInfo", val, function(
        data
      ) {
        var total = data.results.total;
        var targetData = {};
        switch (val.apptype) {
          case 0:
            targetData = that.allData;
            break;
          case 1:
            targetData = that.remoteData;
            break;
          case 2:
            targetData = that.platformData;
            break;
        }
        var selectIndex = targetData.headerData.length - 1;
        targetData.pageTotal = total;
        targetData.headerData[selectIndex].tagItemList = data.results.tags.data;
        var newData = that.dataHandler(data);
        targetData.bodyData = newData;
      });
    },
    dataHandler(data) {
      var that = this;
      var newArr = new Array();
      var dataArr = data.results.data;

      for (var i = 0; i < dataArr.length; i++) {
        var obj = dataArr[i];
        var newObj = obj;
        if (obj.img == "") {
          obj.img = "favicon.png";
        }
        var imageServerPath =
          apiClient.apiBaseUrl +
          "itsmApi/attachment/show?imgPath=" +
          obj.img +
          "&token=" +
          apiClient.token;
        /*  newObj.lineData=[{img:true,imgSrc:imageServerPath},{name:newObj.name},{name:newObj.app_name},{name:newObj.audit_status,stateText:true},{name:newObj.service_status,stateText:true},{name:newObj.open_time},{name:newObj.visit_num},{name:'',control:true}]*/
        if (newObj.visit_num == undefined) {
          newObj.visit_num = 0;
        }
        obj.lineData = [
          { exImg: true, imgSrc: imageServerPath, itemWidth: "10%" },
          {
            text: true,
            itemWidth: "20%",
            textData: [
              { title: "服务名称", value: newObj.name },
              { title: "服务归属", value: newObj.app_name },
              { title: "审批状态", value: newObj.audit_status, colorClass: "red" }
            ]
          },
          {
            text: true,
            itemWidth: "20%",
            textData: [{ title: "服务状态", value: newObj.service_status }]
          },
          {
            text: true,
            itemWidth: "20%",
            textData: [
              { title: "开通时间", value: newObj.open_time },
              { title: "调用次数", value: newObj.visit_num }
            ]
          },
          {
            btn: true,
            itemWidth: "30%",
            btnArr: [{ class: "revokeShow", clickType: "user", title: "关联用户" }]
          }
        ];
        if (newObj.service_status == "待开通") {
          newObj.previewShow = true;
        }
        //          console.info(newObj.img);

        if (newObj.audit_status == undefined || newObj.audit_status == 0) {
          newObj.lineData[1].textData[2].value = "未提交";
          newObj.class = "notSubmit";
          newObj.tipText = "";
          newObj.editShow = true;
          newObj.removeShow = true;
          newObj.lookApprovalShow = true;
        } else if (newObj.audit_status == 1) {
          newObj.lineData[1].textData[2].value = "待审核";
          newObj.class = "wait";
          //            newObj.revokeShow=true;   //撤销功能暂停
          //newObj.tipText = "查看审批流程";
          //newObj.lookProcessShow = true;
          newObj.lookApprovalShow = true;
        } else if (newObj.audit_status == 2) {
          newObj.lineData[1].textData[2].value = "已通过";
          newObj.class = "pass";
          newObj.switchShow = true;
          newObj.lookApprovalShow = true;
          if (newObj.service_status == "正常") {
            newObj.switchData = false;
          } else if (newObj.service_status == "关闭") {
            newObj.switchData = true;
          }
        } else if (newObj.audit_status == 3) {
          newObj.lineData[1].textData[2].value = "未通过";
          newObj.class = "notPass";
          newObj.tipText = "查看原因";
          newObj.editShow = true;
          newObj.lookReasonShow = true;
          newObj.lookApprovalShow = true;
        }
        //权限判断
        if (
          that.btnControlData.indexOf("删除服务") < 0 &&
          newObj.removeShow == true
        ) {
          newObj.removeShow = false;
        }
        if (
          that.btnControlData.indexOf("编辑服务") < 0 &&
          newObj.editShow == true
        ) {
          newObj.editShow = false;
        }
        if (
          that.btnControlData.indexOf("查看详情") < 0 &&
          newObj.lookApprovalShow == true
        ) {
          newObj.lookApprovalShow = false;
        }
        if (
          that.btnControlData.indexOf("启用/停用开关") < 0 &&
          newObj.switchShow == true
        ) {
          newObj.switchShow = false;
        }
        if (
          that.btnControlData.indexOf("查看流程") < 0 &&
          newObj.lookProcessShow == true
        ) {
          newObj.lookProcessShow = false;
        }
        if (
          that.btnControlData.indexOf("查看原因") < 0 &&
          newObj.lookReasonShow == true
        ) {
          newObj.lookReasonShow = false;
        }
        if (
          that.btnControlData.indexOf("预览") < 0 &&
          newObj.previewShow == true
        ) {
          newObj.previewShow = false;
        }
        //console.log("--------------",newObj);

        newArr.push(newObj);
      }
      //       newObj.open_time = formatDate();
      return newArr;
    },
    getCreatBtn() {
      var that = this;
      if (
        that.btnControlData.indexOf("创建服务") < 0 &&
        that.btnControlData.length > 0
      ) {
        return false;
      } else {
        return true;
      }
    },
    getBtnArr() {
      var that = this;
      var btnObj = {};
      apiClient.get(
        "priviapi/auth/getAppDownMenuAndButton",
        { token: Util.getToken(), appId: "ServiceManger" },
        function(data) {
          for (var i = 0; i < data.data.length; i++) {
            var obj = data.data[i];
            if (obj.menuName == "服务管理") {
              for (var j = 0; j < obj.button.length; j++) {
                var str = obj.button[j].title;
                that.btnControlData.push(str);
              }
            }
            var num = that.link;
            num++;
            that.link = num;
          }
        }
      );
    }
  }
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style src="../../css/common/public.css" scoped></style>
<style src="../../css/servicesManage/serviceManage.css" scoped></style>
<style src="../../css/servicesManage/inspection.css" scoped></style>

