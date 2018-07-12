import Vue from 'vue'
import Router from 'vue-router'
import openPlatform from '../component/openPlatform.vue'
import accreditCode from '../component/accreditCode.vue'
import APIhelp from '../component/APIhelp.vue'
import APIList from '../component/apiList/APIList.vue' // API列表
import realNameCertification from '../component/realNameCertification/realNameCertification.vue'
import APIdetail from '../component/apiList/APIdetail.vue'
import consumptionOverview from '../component/consumptionOverview.vue'
// 登录页面
import register from '../../platformAuthority/components/register'
// 我的api
import myAPI from '../component/myAPI.vue'
// sdk下载
import SDKdownload from '../component/sdkDownload/sdkDownload.vue'
import sdkJavaDetail from '../component/sdkDownload/sdkJavaDetail.vue'
import examineInfo from '../component/myapiModule/examineInfo.vue'
import servicePortfolioDetailsExamine from '../component/myapiModule/servicePortfolioDetailsExamine.vue'
import ReApplyrealNameCertification from '../component/realNameCertification/ReApplyrealNameCertification.vue'
// 报表
// 已申请服务
import applyServer from '../component/reportManage/applyServer.vue'
// 方案统计
import planCount from '../component/reportManage/planCount.vue'
// 用户列表
import userList from '../component/reportManage/userList.vue'
// 整体调用统计
import useCount from '../component/reportManage/useCount.vue'
// 活跃用户排行
import userSort from '../component/reportManage/userSort.vue'
// 每日申请
import everyDayApplyReport from '../component/reportManage/everyDayApplyReport.vue'
// 服务调用趋势
import serviceInvocationTrend from '../component/reportManage/serviceInvocationTrend.vue'
// 调用占比
import invocationRatio from '../component/reportManage/invocationRatio.vue'

Vue.use(Router)
export default new Router({
  mode: 'hash',

  routes: [
    {
      path: '/',
      name: 'APIList',
      component: APIList
    },
    {
      path: '/openPlatform',
      name: 'openPlatform',
      component: openPlatform,
      children: [
        {
          path: '/accreditCode',
          name: 'accreditCode',
          component: accreditCode
        },
        {
          path: '/realNameCertification',
          name: 'realNameCertification',
          component: realNameCertification
        },
        {
          path: '/ReApplyrealNameCertification',
          name: 'ReApplyrealNameCertification',
          component: ReApplyrealNameCertification
        },
        {
          path: '/consumptionOverview',
          name: 'consumptionOverview',
          component: consumptionOverview
        },
        {
          path: '/myAPI',
          name: 'myAPI',
          component: myAPI
        },
        {
          path: '/examineInfo',
          name: 'examineInfo',
          component: examineInfo
        },
        {
          path: '/servicePortfolioDetailsExamine',
          name: 'servicePortfolioDetailsExamine',
          component: servicePortfolioDetailsExamine
        },
        {
          path: '/applyServer',
          name: 'applyServer',
          component: applyServer
        },
        {
          path: '/planCount',
          name: 'planCount',
          component: planCount
        },
        {
          path: '/userList',
          name: 'userList',
          component: userList
        },
        {
          path: '/useCount',
          name: 'useCount',
          component: useCount
        },
        {
          path: '/userSort',
          name: 'userSort',
          component: userSort
        },
        {
          path: '/everyDayApplyReport',
          name: 'everyDayApplyReport',
          component: everyDayApplyReport
        },
        {
          path: '/serviceInvocationTrend',
          name: 'serviceInvocationTrend',
          component: serviceInvocationTrend
        },
        {
          path: '/invocationRatio',
          name: 'invocationRatio',
          component: invocationRatio
        }
      ]
    },
    {
      path: '/APIhelp',
      name: 'APIhelp',
      component: APIhelp
    },
    {
      path: '/SDKdownload',
      name: 'SDKdownload',
      component: SDKdownload
    },
    {
      path: '/realNameCertification',
      name: 'realNameCertification',
      component: realNameCertification
    },

    {
      path: '/APIhelp',
      name: 'APIhelp',
      component: APIhelp
    },

    {
      path: '/SDKdownload',
      name: 'SDKdownload',
      component: SDKdownload
    },
    {
      path: '/APIdetail',
      name: 'APIdetail',
      component: APIdetail
    },
    {
      path: '/register',
      name: 'register',
      component: register
    },
    {
      path: '/sdkJavaDetail',
      name: 'sdkJavaDetail',
      component: sdkJavaDetail
    }
  ]

})
