<template>
  <div class="collection">

    <div class="conCent">
      <div class="rise">
        <span class="textTlie">服务管理 · 企业服务 · 服务用户数</span>
      </div>
      <!-- 筛选 -->
      <select-component
          :select-setting='selectSetting'
          :refresh='isSelectRefresh'
          @select='onSelect'>
      </select-component>
    </div>

    <div class="queryList" style='position:relative;padding-right:390px;'>
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

      <!-- 图表 -->
      <div class="linechart" id="chart1">
        <div class="chartpart1">
          <ul>
            <li>用户统计</li>
            <li>统计区间 
              <el-select v-model="dataInterval" @change='loadChatData' popper-class='user-num-select' placeholder="请选择">
                <el-option label="近一周" value="week"></el-option>
                <el-option label="近一月" value="month"></el-option>
                <el-option label="近三月" value="three_month"></el-option>
              </el-select>
            </li>
          </ul>
        </div>
        <div class="chartpart2" id="zhexiantu1"></div>
        <div class="chartpart3" id="bingtu1"></div>
      </div>
    </div>

    <!-- 查看套餐详情 -->
    <scheme-info-dialog :is-show='isShowSchemeInfo' 
                        :service-data='serviceData'
                        @cancle='onCloseDialog'>
    </scheme-info-dialog>
    <!-- 点击企业名称 -->
    <div style="margin-top: 20px; height: 200px;" class="listline">
      <el-collapse-transition>
        <div v-show="showName" class="transition-box">
            <ul class='scheme-tip'>
              <li><span>企业名称：</span>{{userDetail.company}}</li>
              <li><span>法人代表：</span>{{userDetail.corporate_representative}}</li>
              <li><span>营业执照注册号：</span>{{userDetail.business_no}}</li>
              <li><span>所属行业：</span>{{userDetail.industry}}</li>
              <li><span>所在城市：</span>{{ userDetail.city }}</li>
              <li><span>详细地址：</span>{{ userDetail.address }}</li>
              <li><span>办公电话：</span>{{ userDetail.telephone }}</li>
            </ul>
          </div>
      </el-collapse-transition>
    </div>
    <div style="margin-top: 20px; height: 200px;" class="listlinePersonal">
      <el-collapse-transition>
        <div v-show="showName1" class="transition-box">
            <ul class='scheme-tip'>
              <li><span>用户名：</span>{{userDetail.userName}}</li>
              <li><span>真实姓名：</span>{{userDetail.trueName}}</li>
              <li><span>所属企业：</span>{{userDetail.belong_company}}</li>
              <li><span>手机号：</span>{{userDetail.phone}}</li>
              <li><span>通讯地址：</span>{{ userDetail.address}}</li>
            </ul>
          </div>
      </el-collapse-transition>
    </div>
  </div>
</template>
<script>
import echarts from "echarts";
import apiClient from "../../../publicJs/ApiClient.js";
import LoadingBoxService from "../../../publicJs/LoadingBoxService.js";
import TipBoxService from "../common/TipBoxService.js";
import commonFunc from "../common/commonFunc.js";
import selectComponent from "../common/selectComponent.vue";
import tableComponent from "../common/tableComponent.vue";
import schemeInfoDialog from "../dialog/schemeInfoDialog.vue";
export default {
  name: "userNumInfo",
  components: {
    selectComponent,
    tableComponent,
    schemeInfoDialog
  },
  data() {
    return {
      userId:'',
      service_id: this.$route.query.id,
      searchKey: {}, //查询关键字
      selectSetting: [], //筛选项
      isSelectRefresh: false,
      sortSetting: [], //排序功能
      totalNumber: 0, //查询结果的总条数
      selectParams: {},
      sortParams: {},
      showName: false,
      showName1:false,
      dataInterval: "week", //统计区间
      userDetail: {}, // 弹窗 详情
      chartDate: [], //折线图日期
      chartData: [], //折线图数据
      chartLinkData: [], //折线图线的数据
      chartPieData: [], //饼状图数据
      chartParam: {
        between_time: "three_month",
        service_id: "",
        type: "line"
      },
      url: {
        query: "itsmApi/enterprisePlatform/getServiceUserNum",
        chart: "itsmApi/enterprisePlatform/getChart"
      },
      tableData: [],
      isFirst: true,
      serviceData: {},
      isShowSchemeInfo: false,
      top: 170,
      left: 400,
      titleLeft: 0,
      titleWidth: 0
    };
  },
  created() {
    this.loadChatData();
    this.setSortSetting();
  },
  mounted() {
    this.setSelectData();
  },
  methods: {
    // 设置筛选组件参数
    setSelectData: function() {
      let vm = this;
      let item1 = {
        label: "服务用户",
        paramName: "user_status",
        button: [],
        default:'1',
        data: [{ label: "正在使用", value: "1" }, { label: "全部用户", value: "2" }]
      };
      let item2 = {
        label: "用户类型",
        paramName: "belong_type",
        button: [],
        default:'3',
        data: [
          { label: "全部", value: "3" },
          { label: "企业", value: "1" },
          { label: "个人", value: "2" },
          { label: "平台", value: "4" }
        ]
      };
      vm.selectSetting = [item1, item2];
      vm.isSelectRefresh = true;
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
        { label: "类型", paramName: "typeSort", sortType: "asc" },
        { label: "时间", paramName: "timeSort", sortType: "desc" }
      ];
    },
    // 筛选操作
    onSelect: function(params) {
      this.selectParams = params;
      this.selectParams.user_status = this.selectParams.user_status.join(",");
      this.selectParams.belong_type = this.selectParams.belong_type.join(",");
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
      let params = $.extend({}, vm.selectParams, vm.sortParams, vm.chartParam);
      params.id = vm.service_id;
      vm.isFirst = false;
      console.log("查询条件：", params);
      LoadingBoxService.open("正在查询，请稍候...");
      apiClient.post(vm.url.query, params, function(data) {
        LoadingBoxService.close();
        if (data.status == "200") {
          vm.totalNumber = data.results.total;
          let dataList = [...data.results.data];
          vm.tableData = vm.onCreatTable(dataList);

            $(document).click(function (e) {
              var drag ="";
              var dragel ="";
              if(vm.tableData[vm.userId].user_info.belong_type=="PERSONAL"){
                drag = $(".listlinePersonal"),
                dragel = $(".listlinePersonal")[0] 
              }else{
                drag = $(".listline"),
                dragel = $(".listline")[0]
              }
                var target = e.target;
                var drageM = $(target).attr("class");
                console.log("drageM",$(target).attr("class"))
              if (dragel !== target && !$.contains(dragel, target) && drageM !== "listLiLeftName") {
                  vm.showName = false;
                  vm.showName1 = false;
              }else{
                if(vm.tableData[vm.userId].user_info.belong_type=="PERSONAL"){
                  vm.showName1 = true;
                  vm.showName = false;
                }else{
                  vm.showName = true;
                  vm.showName1 = false;
                }
              }
          })
        } else {
          TipBoxService.open(data.exception, 2);
        }
      });
    },
    //弹窗数据查询
    onQueryDetail: function(belong_type,id) {
      let vm = this;
      if(belong_type=="PERSONAL"){
        //用户名
       vm.userDetail.userName = vm.tableData[id].user_detail_info.USERNAME;
      //真实姓名
       vm.userDetail.trueName =
        vm.tableData[id].user_detail_info.TRUE_NAME;
      //所属企业
      vm.userDetail.belong_company = vm.tableData[id].user_detail_info.ENTERPRISE_NAME;
      //手机号
      vm.userDetail.phone = vm.tableData[id].user_detail_info.PHONE;
      //通讯地址
      vm.userDetail.address = vm.tableData[id].user_detail_info.OFFICE_ADDRESS;
    }else{
      vm.userDetail.company = vm.tableData[id].user_detail_info.NAME;
      //法人代表
      vm.userDetail.corporate_representative =
        vm.tableData[id].user_detail_info.CORPORATE_REPRESENTATIVE;
      //营业执照注册号
      vm.userDetail.business_no = vm.tableData[id].user_detail_info.BUSINESS_NO;
      //所属行业
      vm.userDetail.industry = vm.tableData[id].user_detail_info.INDUSTRY;
      //所在城市
      vm.userDetail.city = vm.tableData[id].user_detail_info.AREA;
      //详细地址
      vm.userDetail.address = vm.tableData[id].user_detail_info.ADDRESS;
      //办公电话
      vm.userDetail.telephone = vm.tableData[id].user_detail_info.TELEPHONE;
    }
    },
    // 列表数据
    onCreatTable: function(dataList) {
      let vm = this;
      let tableData = [];
      dataList.forEach(function(v, i) {
        let obj = Object.assign({}, v);
        obj.id = i;
        obj.sourceType = 'userNumInfo';
        obj.img=v.user_detail_info.IMAGE;
        obj.scheme_info.expiry_start_date = commonFunc.formatDate(
          obj.scheme_info.expiry_start_date,
          "yyyy-MM-dd"
        );
        obj.scheme_info.expiry_end_date = commonFunc.formatDate(
          obj.scheme_info.expiry_end_date,
          "yyyy-MM-dd"
        );
        obj.user_info.apply_time = commonFunc.formatDate(
          obj.user_info.apply_time,
          "yyyy-MM-dd HH:mm:ss"
        );
        obj.name = obj.user_info.user_name ||obj.user_detail_info.TRUE_NAME;
        //图片
        obj.img = obj.user_detail_info.IMAGE;
        obj.detail = [
          {
            label: "用户类型",
            value: commonFunc.getBelongType([v.user_info.belong_type]),
            width: "short"
          },
          {
            label: "所购套餐",
            value: v.scheme_info.scheme_name || "----",
            icon: v.scheme_info.scheme_id ? "icon-taocanneirong" : false,
            str: "schemeInfo",
            width: "short"
          },
          {
            label: "套餐有效期",
            value:
              v.scheme_info.expiry_start_date +
              " 至 " +
              v.scheme_info.expiry_end_date,
            width: "long"
          }
        ];

        //列表每行右侧模块
        obj.rightBlock = {
          label: "申请时间",
          value: v.user_info.apply_time,
          button: false
        };
        obj.seniorBtns = [];
        tableData.push(obj);
      });
      return tableData;
    },
    //点击企业名称，查看详情
    onClickName: function(item) {
      let vm = this;
      var id = item.id;  
      vm.userId = id;
      vm.onQueryDetail(vm.tableData[id].user_info.belong_type,id);
      vm.top = item.id * 99 + 170;
      vm.titleLeft = $(".listLiLeftName").offset().left;
      vm.titleWidth = $(".listLiLeftName").width();
      console.log(
        "vm.titleLeft,vm.titleWidth=====",
        vm.titleLeft,
        vm.titleWidth
      );
      vm.left = vm.titleLeft + vm.titleWidth;
     if(vm.tableData[id].user_info.belong_type=="PERSONAL"){
       vm.showName1 = !vm.showName1;
       if(vm.showName1){
          vm.showName = false;
       }
      $(".listlinePersonal").offset({ top: vm.top, left: vm.left });
     }else{
       vm.showName = !vm.showName;
       if(vm.showName){
          vm.showName1 = false;
       }
      $(".listline").offset({ top: vm.top, left: vm.left });
     }
     
    
    },
    //点击table按钮
    onClickTableBtn: function(str, item) {
      let vm = this;
      commonFunc.onClickTableBtn(vm, str, item);
    },
    //点击服务详情内容
    onClickTableDetail: function(str, item) {
      let vm = this;
      commonFunc.onClickTableDetail(vm, str, item);
    },
    //弹窗取消按钮
    onCloseDialog: function(flag) {
      this.isShowSchemeInfo = flag;
    },
    //获取折线图数据
    loadChatData() {
      let vm = this;
      let params = {
        //between_time:'week',
        service_id: vm.service_id
      };
      params.between_time = vm.dataInterval;
      console.log("图表条件：", params);
      apiClient.post(vm.url.chart, params, function(data) {
        console.log("图表结果", data);
        vm.chartDate = [];
        vm.chartLinkData = [];
        if (data.status == "200") {
          //得到的日期数据是个集合，所以要遍历
          let chartDateTemp = data.results[0];
          chartDateTemp.forEach(function(v, i) {
            //获取到的时间需要处理一下
            let chartDateValue = commonFunc.formatDate(v.date, "yyyy-MM-dd");
            //把后台数据放到定义的集合里
            vm.chartDate.push(chartDateValue);
            vm.chartLinkData.push(v.num);
          });
          // 饼状图 数据
          let chartPieDataFlag=false;
          data.results[1].forEach(function(v,i){
            if(v.value!=0){
              chartPieDataFlag=true;
            }
          })
          if(chartPieDataFlag){
            vm.chartPieData = data.results[1];
            vm.addChart();
          }
        } else {
          TipBoxService.open(data.exception, 2);
        }
      });
    },
    addChart() {
      let vm = this;
      var myChart1 = echarts.init(document.getElementById("zhexiantu1"));
      var myChart2 = echarts.init(document.getElementById("bingtu1"));
      var option1 = {
        title: {
          text: "用户数量趋势",
          subtext: "",
          x: "center",
          textStyle: {
            fontSize: 14
          }
        },
        tooltip: {
          trigger: "axis",
          // formatter: "{b} <br/><span style='color:red; '>·</span>{c}",
          backgroundColor: "rgba(255, 255, 255, 1)",
          textStyle: {
            color: "#666666"
          },
          axisPointer: {
            type: "none", //去指示线
            shadowStyle: {
              shadowColor: "rgba(202, 202, 202, 1)",
              // shadowOffsetX:3,
              // shadowOffsetY:3,
              shadowBlur: 10
            }
          }
        },

        xAxis: {
          type: "category",
          boundaryGap: false,
          axisLabel: {
            //调整x轴的lable
            // interval: 0,
            rotate: -35,
            textStyle: {
              fontSize: 8 // 让字体变小
            }
          },
          data: this.chartDate
        },
        yAxis: {
          axisLabel: {
            textStyle: {
              fontSize: 10 // 让字体变小
            }
          },
          splitLine: {
            show: false //去网格线
          }
        },
        visualMap: {
          top: 0,
          right: 0,
          itemWidth:10,
          itemHeight:6,
          itemGap:4,
          pieces: [
            {
              gt: 0,
              lte: 100,
              color: "#096"
            },
            {
              gt: 100,
              lte: 300,
              color: "#660099"
            },
            {
              gt: 300,
              color: "#7e0023"
            }
          ],
          outOfRange: {
            color: "#999"
          }
        },
        series: [
          {
            name:'通过审批用户数',
            type: "line",
            data: this.chartLinkData,
          }
        ]
      };

      var option2 = {
        title: {
          text: "用户数量分布",
          subtext: "",
          x: "center",
          textStyle: {
            fontSize: 14
          }
        },
        tooltip: {
          trigger: "item",
          formatter: "{b} <br/>{d}%",
          backgroundColor: "rgba(255, 255, 255, 1)",
          borderWidth: 1,
          textStyle: {
            color: "#666666"
          }
        },
        color: ["#ff967a", "#91c6ad",'#7e0023','#660099'],

        series: [
          {
            name: "",
            type: "pie",
            radius: "55%",
            center: ["50%", "60%"],
            data: vm.chartPieData,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            },
             label: {
                normal: {
                    formatter: "{b} \n ({c},{d}%)"
                }
            },
            labelLine: {
                normal: {    
                    length: 7        
                }
            },
          }
        ]
      };
      myChart1.setOption(option1);
      myChart2.setOption(option2);
    }
  }
};
</script>
<style src="../../css/common/tableComponent.css" scoped></style>
<style scoped>
.linechart {
  position: absolute;
  top: 0;
  right: 0;
  height: 580px;
  width: 383px;
  min-width: 383px;
  /* border:1px solid red; */
}
.chartpart1 {
  width: 383px;
  height: 30px;
  /* border:1px solid red; */
}
.chartpart1 ul {
  height: 100%;
}
.chartpart1 ul li {
  height: 100%;
  float: left;
  line-height: 30px;
}
.chartpart1 ul li:first-child {
  width: 45%;
  list-style-type: disc;
  margin-left: 5%;
  font-size: 14px;
}
.chartpart1 ul li:nth-child(2) {
  width: 190px;
}
.chartpart1 ul li select {
  width: 95%;
  height: 50%;
}
.chartpart2 {
  width: 383px;
  height: 245px;
  margin-top: 20px;
  /* border:1px solid red; */
}
.chartpart3 {
  width: 383px;
  height: 255px;
  /* border:1px solid red; */
}
.transition-box {
  margin-bottom: 10px;
  width: 300px;
  height: 220px;
  border-radius: 4px;
  background-color: #fff;
  text-align: left;
  color: #000;
  padding: 5px 5px;
  box-sizing: border-box;
  margin-right: 20px;
  border: 1px solid #ccc;
  line-height: 30px;
  opacity: 1;
}
.listline {
  position: absolute;
  /* top:150px;
    left:400px; */
  z-index: 999;
}
.listlinePersonal {
  position: absolute;
  /* top:150px;
    left:400px; */
  z-index: 999;
}
</style>
<style>
.chartpart1 .el-select {
  width: 130px;
  margin-left: 5px;
}
.chartpart1 .el-input__inner {
  height: 30px;
  line-height: 30px;
  border: 1px solid #f1f1f1;
}
.user-num-select.el-select-dropdown {
  margin: 0;
  border-radius:4px;
}
.user-num-select .el-scrollbar__wrap {
  overflow: hidden;
  margin: 0 !important;
}
.user-num-select .el-select-dropdown__list {
  padding: 0;
}
.user-num-select .el-select-dropdown__item {
  font-size: 12px;
  border-bottom: 1px solid #f1f1f1;
  text-align:left;
}
.user-num-select .el-select-dropdown__item:hover,
.user-num-select .el-select-dropdown__item.hover,
.user-num-select .el-select-dropdown__item.selected:hover,
.user-num-select .el-select-dropdown__item.selected.hover{
  color:#2ba9ff!important;
  background:none!important;
}
</style>
