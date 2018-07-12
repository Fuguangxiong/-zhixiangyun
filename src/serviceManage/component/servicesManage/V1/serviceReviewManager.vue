<template>
  <div class="publicContent">
    <!-- <left-nav :selectIndex="1"></left-nav> -->
    <div class="publicNav">
      <ul class="commonTableTab">
        <li  v-for="(item,index) in uiData.tabArr" class="commonTableTabItem" v-bind:class="{active:item.active}" v-on:click="tabItemClickHandler(index)">{{item.name}}
        </li>
      </ul>
      <div v-if="getCreatBtn()" class="returnBtn publicRedBtn" v-on:click="openServiceRegister">创建服务</div>
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
         :searchWord='searchWord'
         v-on:change="tableGetDataHandler"
         v-on:edit="tableItemEditHandler"
         v-on:look="tableItemLookHandler"
        v-on:itemPreviewHandler='itemPreviewHandler' 
        :imgLine="true"
         :tag-check-data="allData.checkData" 
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
        :link="link"
        :searchWord='searchWord'
         v-on:change="tableGetDataHandler"
         v-on:edit="tableItemEditHandler" 
         v-on:look="tableItemLookHandler"
        v-on:itemPreviewHandler='itemPreviewHandler' 
        :imgLine="true"
        :tag-check-data="platformData.checkData"
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
          :link="link" 
          :searchWord='searchWord'
         v-on:change="tableGetDataHandler"
        v-on:edit="tableItemEditHandler" 
        v-on:look="tableItemLookHandler" 
        v-on:itemPreviewHandler='itemPreviewHandler' 
        :imgLine="true"
        :tag-check-data="remoteData.checkData"
         :component-type="remoteData.resourceType"></common-table-component>
      </div>
      <!--远程服务-->

    </div>
 
     <!--审批弹框-->
    
     <common-approval-box :openNum="approvalBoxData.openNum" @change="approveBoxChangeHandler"></common-approval-box> 
    <!--审批弹框结束-->
    
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
   <!--创建服务弹框结束-->
</div>
</template>

<script>
import commonTableComponent from "../common/commonTableComponent.vue";
import apiToken from "../../../publicJs/apiToken.js";
import apiClient from "../../../publicJs/ApiClient.js";
import TipBoxService from "../common/TipBoxService.js";
import leftNav from "../../../publicComponent/leftNav.vue";
import LoadingBoxService from "../../../publicJs/LoadingBoxService.js";
import NoticeBoxService from "../../../publicJs/NoticeBoxService.js";
import AlertBoxService from "../../../publicJs/AlertBoxService.js";
import commonApprovalBox from "../../../publicComponent/commonApprovalBox.vue";
import Util from "../../../publicJs/Util";
export default {
  name: "serviceManager",
  components: {
    commonTableComponent,
    commonApprovalBox,
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
          { name: "审批已通过", select: true, statu: 2 },
          { name: "审批未通过", select: true, statu: 3 },
          { name: "待审批通过", select: true, statu: 1 }
        ],
        resourceType: 0,
        pageTotal: 0
      },
      platformData: {
        //应用服务
        bodyData: {},
        headerData: [],
        checkData: [
          { name: "审批已通过", select: true, statu: 2 },
          { name: "审批未通过", select: true, statu: 3 },
          { name: "待审批通过", select: true, statu: 1 }
        ],
        resourceType: 2,
        pageTotal: 0
      },
      remoteData: {
        //远程服务
        bodyData: {},
        headerData: [],
        checkData: [
          { name: "审批已通过", select: true, statu: 2 },
          { name: "审批未通过", select: true, statu: 3 },
          { name: "待审批通过", select: true, statu: 1 }
        ],
        resourceType: 1,
        pageTotal: 0
      },
      linkObj: "",
      btnControlData: []
    };
  },
  created() {
    this.createHeaderData();
    /*this.createAllData();
      this.createPlatformData();
      this.createRemoteData();*/
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
    itemPreviewHandler(obj) {
      var id = obj.id;
      window.open("#/invoke?previewTag=1&id=" + id, "_blank");
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
    approveBoxChangeHandler(data) {
      console.info("approveChange=", data);
      var str = JSON.stringify(data);
      var that = this;
      LoadingBoxService.open("上传数据，请稍候...");
      apiClient.post(
        "itsmApi/atomicService/auditAtomic",
        { auditParam: str, serviceId: that.approvalBoxData.id },
        function(data) {
          that.approvalBoxData.id = "";
          if (data.status == "200") {
//            setTimeout(function() {
              LoadingBoxService.close();
              TipBoxService.open("审批成功");
              that.tableGetDataHandler(that.linkObj);
 //           }, 4000);
          } else {
            LoadingBoxService.close();
            TipBoxService.open("审批失败：" + data.exception, 1);
          }
        }
      );
    },
    tableItemEditHandler(val) {
      //表单组件点击审批的事件
      // window.sessionStorage.setItem('editId',val.id);
      //this.$router.push({name:'ApplyFillInForm',params:{resourcetype:val.resourcetype,resourcetags:val.resourcetags,dbsource:val.dbsource}});
      this.approvalBoxData.id = val.id;
      this.approvalBoxData.openNum++;
      this.linkObj = val.linkObj;
    },
    tableItemLookHandler(val) {
      //表单组件点击查看的事件
      //window.sessionStorage.setItem('editId',val.id);
      if (val.tipText == "查看原因") {
        apiClient.post(
          "itsmApi/atomicService/viewReason",
          { id: val.id },
          function(data) {
            console.log("-------->", data);
            var msg = data.results.data[0].audit_reason;
            if (msg == "") msg = "无未通过原因";
            AlertBoxService.open(msg, "未通过原因");
          }
        );
      } else if (val.tipText == "查看申请") {
        if (val.isatomic == "false") {
          window.open("#/servicePortfolioDetailsExamine?id=" + val.id, "_blank");
        } else {
          window.open("#/examineInfo?id=" + val.id, "_blank");
        }
      }

      //this.$router.push({name:'ApplyFillInFormDetail',query:{resourcetype:val.resourcetype,resourcetags:val.resourcetags,dbsource:val.dbsource,id:val.id}});
    },
    tableGetDataHandler(val) {
      //表单组件申请表数据
      var that = this;
      //如果没有取到权限的值，则不执行
      if (that.btnControlData.length == 0) {
        return;
      }
      val.apptype=val.resourceType;
      val.keyword=val.searchParam;
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
        /*   newObj.lineData=[{img:true,imgSrc:imageServerPath},{name:newObj.name},{name:newObj.app_name},{name:newObj.audit_status,stateText:true},{name:newObj.trueName},{name:newObj.open_time},{name:newObj.visit_num},{name:'',control:true}]*/

        newObj.lineData = [
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
            textData: [{ title: "创建人", value: newObj.trueName }]
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

        if (newObj.audit_status == 1) {
          newObj.lineData[1].textData[2].value = "待审批";
          newObj.class = "wait";
          newObj.approvalShow = true;
          newObj.lookApprovalShow = true;

          newObj.previewShow = true; //预览
        } else if (newObj.audit_status == 2) {
          newObj.lineData[1].textData[2].value = "已通过";
          newObj.class = "pass";
          newObj.lookApprovalShow = true;
        } else if (newObj.audit_status == 3) {
          newObj.lineData[1].textData[2].value = "未通过";
          newObj.class = "notPass";
          newObj.lookApprovalShow = true;
          newObj.lookReasonShow = true;
        } else {
          newObj.lineData[1].textData[2].value = "待审批";
          newObj.approvalShow = true;
          newObj.lookApprovalShow = true;
        }
        //权限判断

        console.log("that.btnControlData====>", that.btnControlData);

        if (
          that.btnControlData.indexOf("审批") < 0 &&
          newObj.approvalShow == true
        ) {
          newObj.approvalShow = false;
        }
        if (
          that.btnControlData.indexOf("查看详情") < 0 &&
          newObj.lookApprovalShow == true
        ) {
          newObj.lookApprovalShow = false;
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

        newArr.push(newObj);
      }
      console.log("newArr====>", newArr);
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
            if (obj.menuName == "服务审批") {
              for (var j = 0; j < obj.button.length; j++) {
                var str = obj.button[j].title;
                that.btnControlData.push(str);
              }
            }
          }
          var num = that.link;
          num++;
          that.link = num;
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

