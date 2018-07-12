<template>
    <div class="personalConsoleIndex ">
        <div class="personaltop">
           <div class="personaltopright">
              <div class="perinformation">
                 <!-- <img src="../../images/dingwei.png" alt=""> -->
                <img   v-lazy="userinfo.IMAGE"/>
                <div><span>您好:</span><span class="username">{{userinfo.USERNAME}}</span></div>
              </div>
              <div v-if="certification" class="certification through">
                <span class="truename">{{userinfo.TRUE_NAME}}</span>
                <span class="company">{{userinfo.ENTERPRISE_NAME}}</span>
                <i class="throughimg"></i>   
              </div>
              <div v-else class="certification  nothrough">
                <span class="unname"> <i class="icon iconfont icon-xiaolvdashitubiao33310 jinggao"></i>您还未进行实名认证，为了您的账号更安全，我们建议您进行<span @click="realNameCertification">实名认证</span></span>
              </div>
           </div>
           <div class="personaltopleft">
                 <div class="apply" @click="clickaudit">
                   <i class="applyimg"></i>  
                    <span class="applynum">{{audit}}</span>     
                   <span class="applytext">待我审批</span>        
                 </div>
                <div class="apply applyleft" @click="clickkmycreate">
                  <i class="applyleftimg"></i>   
                    <span class="applynum">{{mycreate}}</span>     
                    <span class="applytext">我的创建</span>         
                </div> 
           </div>
        </div>
        <div class="personalmiddle" > 
           <div class="personalmiddleright">
             <span class="contenttitle">服务调用统计图</span>
              <div class="linechart" id="chart1">
                     
               </div>
               <div class="charttitle"><span>最近7天</span>  
              <div class="tuli"></div>
               <div class="tulitext">调用服务</div>
               </div>
           </div>
           <div class="personalmiddleleft">
             <span class="contenttitle">公告<span v-show="gonggaoshow" class="checkmore gonggao" @click="toMore"> 查看全部>></span>  </span>
              <ul v-if="shownotice">
              <!-- <li v-for="(list,index) in annoucementList" @click="todetail(list.id)" >
               <span class="title"><i v-show="list.new=='true'"> NEW</i>{{list.bulletin_name.length>20?(list.bulletin_name.substring(0,20)+"……"):list.bulletin_name}}</span>
               <span class="time">{{list.release_time}}</span>
             </li>  -->
             <li v-for="(list,index) in annoucementList" @click="todetail(list.id)" >  
                     
                        <div class="noticetitle">  <div class="newnotic" v-show="list.new=='true'"></div> {{list.bulletin_name.length>15?(list.bulletin_name.substring(0,15)+"…"):list.bulletin_name}}</div>
                        <div class="noticetime">{{list.release_time}}</div>
                     
             </li> 
              </ul>
             <div v-else class="noNotic"></div>
           </div> 
        </div> 
         <div class="personalbottom" >  
            <div class="personalbottomright">
              <span class="contenttitle">申请通过的服务   <span v-show="showservice" class="checkmore shenqing" @click="tomorepass" > 查看全部>></span></span>
                <ul v-if="showPassServer">
                  <li  v-for="(list,index) in passsService"  @click="topassServiceDetail(list)"  v-bind:class="list.service_status=='3' ? 'liclose':'liopen'"  >
                    <span v-bind:class="list.service_status=='4' ? 'error':''"></span>
                    <span v-bind:class="list.service_status=='3' ? 'isclose':''"></span>
                        <div class="bottomrightimg"><img v-lazy="list.bg_img"/></div>
                        <div class="bottomrighttitle">{{list.name}}</div>
                        <div class="bottomrighttext">{{list.service_brief}}</div>        
                  </li>
                </ul>
               <div v-else class="noNotic"></div> 
           </div>
           <div class="personalbottomleft">
              <span class="contenttitle">推荐服务   <span class="checkmore tuijian" @click="tomorecommend" v-show="commendservice"> 查看全部>></span> </span>
                  <ul v-if="showRecommendSer">
                      <li v-for="(list,index) in commendService" @click="toserviceDetail(list)">
                        <div class="bottomcontent">
                            <div class="bottomrightimg"><img v-lazy="list.bg_img"/></div>
                            <div class="bottomlefttitle">{{list.name.length>8?(list.name.substring(0,8)+"…"):list.name}}</div>
                            <div class="bottomlefttext">{{list.service_brief.length>15?(list.service_brief.substring(0,15)+"…"):list.service_brief}} </div> 
                          </div>       
                      </li>
                  </ul>
                 <div v-else class="noNotic"></div> 
           </div> 
        </div>   
    </div>
</template>
<script>
import NoticeBox from '../../../publicJs/NoticeBoxService'
import userService from '../../../publicJs/userService.js'
import apiToken from '../../../publicJs/apiToken.js'
import apiClient from '../../../publicJs/ApiClient.js'
import LoadingBoxService from '../../../publicJs/LoadingBoxService.js'
import UserCookieService from '../../../publicJs/UserCookieService.js'
import UtilService from '../../../publicJs/UtilService.js'
import publicPathConfig from '../../../publicJs/publicPathConfig.js'
import appPublicJs from '../../common/public.js'
import TipBoxService from '../../../publicJs/TipBoxService.js'
import Util from '../../../publicJs/Util.js'
import echarts from 'echarts'
import publicpath from '../../../publicJs/publicPathConfig.js'
// let echarts = require("echarts/lib/echarts");
// require("echarts/lib/chart/line");
// let ecConfig = require("echarts/config");
export default {
  name: 'evaluation',
  data () {
    return {
      templateId: '', // 模板id
      tokenId: null,
      certification: '', // 认证通过标识
      errorState: true,
      closestate: true,
      pageNum: 1,
      pageSize: 5,
      annoucementList: [], // 公告列表
      userinfo: '', // 用户信息
      mycreate: '', // 我的创建
      audit: '', // 待我审核
      passsService: [], // 申请通过的服务
      commendService: [], // 推荐服务
      shownotice: true, // 暂无公告
      showPassServer: true, // 暂无申请服务
      showRecommendSer: true, // 暂无推荐服务
      showservice: false, // 控制申请通过的查看全部是否显示
      commendservice: false,
      gonggaoshow: false

    }
  },
  mounted () {
    this.getuserInfo()
    this.getEchartData()
    this.getAnnoucement()
    this.createnum()
    this.auditnum()
    this.getPassedService()
    this.getRecommendService()
  },
  created () {
    this.tokenId = this.$route.query.tokenId || userService.getTokenId()
  },
  methods: {
    // 待我审核跳转
    clickaudit () {
      var logintype = this.getInfo('logintype')
      // let  audit_status=[];
      // audit_status.push('1');
      if (logintype == 'PERSONAL') { // 个人登陆
        this.$router.push({
          path: '/applyUsing',
          query: { tokenId: this.tokenId,
            applyStatus: '1'}
        })
      } else {
        this.$router.push({
          path: '/epapplyUsing',
          query: { tokenId: this.tokenId,
            applyStatus: '1' }
        })
      }
      // this.$router.push({
      //   path: '/applyUsing',
      //   query: { tokenId: this.tokenId }
      // })epapplyUsing
      //  window.open(publicpath.SERVICE_MANAGE+'#/applyUsing?tokenId='+this.tokenId)
    },
    // 点击我创建的跳转
    clickkmycreate () {
      var logintype = this.getInfo('logintype')
      // let  audit_status=[];
      // audit_status.push(2);
      if (logintype == 'PERSONAL') { // 个人登陆
        this.$router.push({
          path: '/registered',
          query: { tokenId: this.tokenId,
            audit_status: '2'}
        })
      } else {
        this.$router.push({
          path: '/epregistered',
          query: { tokenId: this.tokenId,
            audit_status: '2' }
        })
      }
    },
    // 我的创建
    createnum () {
      var that = this
      var myData = {}
      apiClient.get(
        apiToken.newApi('pcapi/worktable/getCjService/'),
        myData,
        function (data) {
          if (data.status == 200) {
            that.mycreate = data.results.total
          } else {
            that.mycreate = '0'
          }
        }
      )
    },
    // 待我审核
    auditnum () {
      var that = this
      var myData = {}
      apiClient.get(
        apiToken.newApi('pcapi/worktable/getShService/'),
        myData,
        function (data) {
          if (data.status == 200) {
            that.audit = data.results.total
          } else {
            that.audit = '0'
          }
        }
      )
    },
    // 获取用户信息
    getuserInfo () {
      var that = this
      var myData = {}
      apiClient.get(
        apiToken.newApi('pcapi/worktable/getUserInfo/'),
        myData,
        function (data) {
          //    data={"time":59,"exception":null,"status":200,"results":{"DEPARTMENT_NAME":"服务管理","DEPARTMENTID":"a7eace3a148046a8be6443f7c962d639","ID_CARD_SCAN_BACK":"b3e8be75c5f74d4d97dec74540f92342.png","ENTERPRISE_NAME":"","PHONE":"13718571277","EMAIL":"","LAST_TIME":1513658803000,"POSITION":"","STATUS":"","IMAGE":"","USERNAME":"贺社广","ID":"f86df72ade2d48d7a7aae8de9dc2f1e1","CREATE_TIME":1512126439000,"JOB_NO":"","REMARK":"","OFFICE_AREA":"","OFFICE_CITY":"","INDUSTRY":"","AUTH_STATUS":"AUTHORIZED","ENTERPRISE_ID":"","enterid":"1c14f665aa8643c28f899aa9b0efee4b","HOME_ADDRESS":"","LOGIN_TYPE":"PERSONAL","PASSWORD":"e10adc3949ba59abbe56e057f20f883e","ID_CARD_SCAN_FRONT":"c17b593788e94a5d897aa15acba94390.png","TRUE_NAME":"贺社广","ENTERPRISEID":"1c14f665aa8643c28f899aa9b0efee4b","TELEPHONE_NO":"","FAX":"","OFFICE_ADDRESS":"","ID_CARD":"420802198201180353","OFFICE_PROVINCE":"","CERTIFICATE_TYPE":""}}
          if (data.results.AUTH_STATUS == 'AUTHORIZED') {
            that.certification = true
          }
          if (data.results.ENTERPRISE_NAME == '') {
            data.results.ENTERPRISE_NAME = '个人'
          }
          // data.results.IMAGE = apiClient.apiBaseUrl + '/appmarket/upload/picimg?token=' + apiClient.token + '&img=' +  data.results.IMAGE;
          data.results.IMAGE = that.getInfo('image')
          that.userinfo = data.results
        }
      )
    },
    // 公告管理
    getAnnoucement () {
      var that = this
      var myData = {
        pageNum: that.pageNum,
        pageSize: that.pageSize
      }
      apiClient.get(
        apiToken.newApi('pcapi/worktable/getNotice/'),
        myData,
        function (data) {
          if (appPublicJs.checkData(data.results.data)) {
            that.gonggaoshow = true
            var data = data.results.data
            for (var i = 0; i < data.length; i++) {
              if (
                data[i].release_time != undefined &&
                data[i].release_time != '暂无'
              ) {
                data[i].release_time = UtilService.formatDuring(
                  data[i].release_time,
                  'yyyy-MM-dd'
                )
              } else {
                data[i].release_time = '暂无'
              }
            }
            that.annoucementList = data
          } else {
            that.shownotice = false
            that.gonggaoshow = false
          }
        }
      )
    },
    // 申请通过的服务
    getPassedService () {
      var that = this
      var myData = {
        pageNum: that.pageNum,
        pageSize: 12
      }
      apiClient.get(
        apiToken.newApi('pcapi/worktable/getPassedService/'),
        myData,
        function (data) {
          if (appPublicJs.checkData(data.results.data)) {
            // data={"time":21,"exception":null,"status":200,"results":{"result":"success","total":"2","data":[{"bj_img":"img1.jpg","service_brief":"111对内容所表达的情感态度进行智能化分析，得到正、中、负的情感态度判断，并自动识别并生成相应的分析结果","name":"服务1","service_status":"1","id":"1"},{"bj_img":"img2.jpg","service_brief":"222对内容所表达的情感态度进行智能化分析，得到正、中、负的情感态度判断，并自动识别并生成相应的分析结果","name":"服务2","service_status":"4","id":"2"}]}}
            that.passsService = data.results.data
            that.showservice = true
            for (var i = 0; i < that.passsService.length; i++) {
              that.passsService[i].bg_img =
                apiClient.apiBaseUrl +
                appPublicJs.serviceImgShow +
                that.passsService[i].bg_img +
                '&token=' +
                apiClient.token
            }
          } else {
            that.showservice = false
            that.showPassServer = false
          }
        }
      )
    },
    // 推荐服务
    getRecommendService () {
      var that = this
      var myData = {
        pageNum: that.pageNum,
        pageSize: that.pageSize
      }
      apiClient.get(
        apiToken.newApi('appmarket/atomic/getRecommendService/'),
        myData,
        function (data) {
          if (appPublicJs.checkData(data.results)) {
            that.commendservice = true
            that.commendService = data.results
            for (var i = 0; i < that.commendService.length; i++) {
              that.commendService[i].bg_img =
                apiClient.apiBaseUrl +
                appPublicJs.serviceImgShow +
                that.commendService[i].bg_img +
                '&token=' +
                apiClient.token
            }
          } else {
            that.commendservice = false
            that.showRecommendSer = false
          }
        }
      )
    },
    getEchartData () {
      var myData = {}
      apiClient.get(
        apiToken.newApi('pcapi/worktable/getServiceCall/'),
        myData,
        function (data) {
          var chartdata = ''
          if (appPublicJs.checkData(data.results)) {
            chartdata = data.results
          } else {
            chartdata = [
              { time: '', invokeNum: '', serviceNum: '' },
              { time: '', invokeNum: '', serviceNum: '' },
              { time: '', invokeNum: '', serviceNum: '' },
              { time: '', invokeNum: '', serviceNum: '' },
              { time: '', invokeNum: '', serviceNum: '' },
              { time: '', invokeNum: '', serviceNum: '' },
              { time: '', invokeNum: '', serviceNum: '' }
            ]
          }

          var that = this
          var point = []
          var xdata = []
          var ydata = []
          let zdata = []
          let chart1 = document.getElementById('chart1')
          for (var i = 0; i < chartdata.length; i++) {
            xdata.push(chartdata[i].time)
            ydata.push(chartdata[i].invokeNum)
            zdata.push(chartdata[i].serviceNum)
          }

          let option = {
            tooltip: {
              trigger: 'item',
              position: function (p) {
                // 其中p为当前鼠标的位置
                return [p[0] - 30, p[1] + 20]
              },
              backgroundColor: '#fff',
              borderColor: '#e5e5e5',
              borderWidth: 1,
              borderRadius: 4,
              textStyle: {
                color: '#666666'
              },
              formatter: function (params) {
                var res =
                  '<div><p>' +
                  params.name +
                  '</p></div><p>我调用<span style="color:#3f9dfd"> ' +
                  zdata[params.dataIndex] +
                  ' </span>个服务   共计<span style="color:#3f9dfd"> ' +
                  params.data +
                  ' </span>次</p>'
                return res
              }
            },
            legend: {
              x: 'center',
              selectedMode: false,
              top: '70%',
              left: '90%',
              orient: 'vertical ',
              align: 'left',
              bottom: '20%',
              textStyle: {
                color: '#3f9dfd'
              },
              data: ['调用服务']
            },
            grid: {
              top: '20%',
              left: '3%',
              right: '3%',
              bottom: '2%',
              containLabel: true
            },

            xAxis: {
              axisTick: {
                show: false
              },
              type: 'category',
              boundaryGap: false,
              data: xdata,
              // 设置轴线的属性
              axisLine: {
                lineStyle: {
                  color: '#c7c7c7'
                }
              },
              axisLabel: {
                show: true,
                textStyle: {
                  color: '#333333'
                }
              }
            },
            yAxis: {
              // max: 100,
              min: 0,
              axisTick: {
                show: false
              },
              type: 'value',
               // 设置轴线的属性
              axisLine: {
                lineStyle: {
                  color: '#c7c7c7'
                }
              },
              axisLabel: {
                show: true,
                textStyle: {
                  color: '#333333'
                }
              }
            },
            series: [
              {
                itemStyle: {
                  normal: {
                    color: '#3f9dfd' // 图标颜色
                  }
                },
                symbolSize: 12,
                type: 'line',
                data: ydata,
                markPoint: {
                  //  symbol: 'image://../../images/dingwei.png',
                  //  symbol:'pin',
                  //    symbolOffset: [0, -40],
                  //    label: {
                  //         borderWidth:1,
                  //         borderRadius :60,
                  //         borderColor:'red',
                  //         normal: {show:true,
                  //          color: 'red',
                  //         backgroundColor: '#fff'
                  //            }
                  //    },
                  itemStyle: {
                    normal: {
                      color: '#ff3755'
                    }
                  },
                  symbol:
                    'path://M 512 1024 c 0 0 -357.96 -463.652 -357.96 -662.36 c 0 -198.708 160.275 -359.8 357.96 -359.8 c 197.686 0 357.96 161.092 357.96 359.8 C 869.96 560.348 512 1024 512 1024 Z M 508.32 208.521 c -84.1238 0 -152.404 68.5869 -152.404 153.12 c 0 84.5326 68.1781 153.12 152.404 153.12 c 84.1238 0 152.404 -68.5869 152.404 -153.12 C 660.724 277.005 592.444 208.521 508.32 208.521 Z',
                  symbolOffset: [0, -25],
                  symbolSize: [20, 25],
                  label: {
                    normal: {
                      show: false
                    }
                  }
                  // data: []
                }
              }
            ]
          }
          let myChart = echarts.init(chart1)
          myChart.setOption(option)
          myChart.on('mousemove', function (params) {
            let flag = 0
            let datLen = 0
            let markPointData = option.series[0].markPoint.data
            if (markPointData !== undefined) {
              if (markPointData.length === 0) {
                markPointData.push({xAxis: params.dataIndex, yAxis: params.value})
                myChart.setOption(option)
              } else {
                if (markPointData !== undefined) {
                  datLen = markPointData.length
                }
                for (let i = 0; i < datLen; i++) {
                  if (markPointData[i].xAxis === params.dataIndex) {
                    flag = 1
                  }
                }
                if (flag === 0) {
                  markPointData.push({xAxis: params.dataIndex, yAxis: params.value})
                  myChart.setOption(option)
                }
              }
            }
          })
          myChart.on('mouseout', function (params) {
            option.series[0].markPoint.data = []
            myChart.setOption(option)
          })
        }
      )
    },

    getInfo: function (name) {
      var v = window.document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)')
      return v ? v[2] : null
    },

    toMore: function () {
      window.open(
        publicpath.PERSONAL_CONSOLE +
          '#/announcementList?tokenId=' +
          this.tokenId
      )
    },
    todetail: function (id) {
      window.open(
        publicpath.PERSONAL_CONSOLE +
          '#/announcementDetail?tokenId=' +
          this.tokenId +
          '&id=' +
          id
      )
    },
    // 申请通过的服务列表
    tomorepass: function () {
      // window.open( publicpath.PERSONAL_CONSOLE + '#/applied?tokenId=' + this.tokenId+'&isApplied=1')
      var logintype = this.getInfo('logintype')
      if (logintype == 'PERSONAL') { // 个人登陆
        window.open(publicpath.PERSONAL_CONSOLE + '#/applied?tokenId=' + this.tokenId + '&applyStatus=3')
      } else {
        window.open(publicpath.PERSONAL_CONSOLE + '#/epapplied?tokenId=' + this.tokenId + '&applyStatus=3')
      }
    },
    // 推荐服务列表
    tomorecommend: function () {
      this.templateId = this.getInfo('templateId')
      window.open(
        publicpath.APP_MARKET +
          '#/appHotMore?tokenId=' +
          this.tokenId +
          '&templateId=' +
          this.templateId
      )
    },
    // 服务详情
    toserviceDetail: function (list) {
      debugger
      window.open(
        publicpath.APP_MARKET +
          '#/appServiceDetail?tokenId=' +
          this.tokenId +
          '&id=' +
          list.id
      )
    },
    // 服务详情
    topassServiceDetail: function (list) {
      if (list.service_status != '3') {
        window.open(
          publicpath.APP_MARKET +
            '#/appServiceDetail?tokenId=' +
            this.tokenId +
            '&id=' +
            list.id
        )
      } else {
      }
    },
    //
    realNameCertification: function () {
      this.$router.push({
        path: '/realNameCertification',
        query: {}
      })
    }
  }
}
</script>
<style src="../../css/personalConsoleIndex.css" scoped></style>

