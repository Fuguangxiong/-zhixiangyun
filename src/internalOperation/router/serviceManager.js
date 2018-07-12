/* start */
import homeIndex from '../../serviceManage/component/homeIndex.vue' /* 测试 */
/* 新建应用 */
/* 原子服务 */
import newServicePage from '../../serviceManage/component/createBasicService/newServicePage.vue' /* 创建 */
import atomServiceDetail from '../../serviceManage/component/createBasicService/atomServiceDetail.vue' /* 详情 */
import atomServiceModify from '../../serviceManage/component/createBasicService/atomServiceModify.vue' /* 变更 */
import atomServiceApproval from '../../serviceManage/component/createBasicService/atomServiceApproval.vue' /* 审批 */
/* 组合服务 */
import compositeServicePage from '../../serviceManage/component/createCombinationService/compositeServicePage.vue' /* 创建 */
import compositeServiceDetail from '../../serviceManage/component/createCombinationService/compositeServiceDetail.vue' /* 详情 */
import compositeServiceModify from '../../serviceManage/component/createCombinationService/compositeServiceModify.vue' /* 变更 */
import compositeServiceApproval from '../../serviceManage/component/createCombinationService/compositeServiceApproval.vue' /* 审批 */
/* 服务管理 */
import search from '../../serviceManage/component/servicesManage/search.vue' /* 搜索 */
import searchResult from '../../serviceManage/component/servicesManage/searchResult.vue' /* 搜索结果 */
import enterprise from '../../serviceManage/component/servicesManage/enterprise.vue' /* 企业服务 */
import registered from '../../serviceManage/component/servicesManage/registered.vue' /* 已注册服务 */
import applyUsing from '../../serviceManage/component/servicesManage/applyUsing.vue' /* 待我审批 */
import applied from '../../serviceManage/component/servicesManage/applied.vue' /* 已申请服务 */
import platformService from '../../serviceManage/component/servicesManage/platformService.vue' /* 平台服务 */
import thirdPartyService from '../../serviceManage/component/servicesManage/thirdPartyService.vue' /* 第三方服务 */
import chargePlanManage from '../../serviceManage/component/servicesManage/chargePlanManage.vue' /* 计费方案 */
import userNumInfo from '../../serviceManage/component/servicesManage/userNumInfo.vue' /* 服务用户数 */
/* 服务预览页面 */
import invokeVoice from '../../serviceManage/component/detailPage/InvokeVoice.vue'
import APIhelp from '../../serviceManage/component/detailPage/APIhelp.vue' /* API文档 */
/* 应用管理页面 */
import enterpriseApp from '../../serviceManage/component/createApp/enterpriseApp.vue' /* 应用管理企业应用 */
import myApp from '../../serviceManage/component/createApp/myApp.vue' /* 应用管理我的应用 */
import thirdPartyApp from '../../serviceManage/component/createApp/thirdPartyApp.vue' /* 应用管理第三方应用 */
import applicationDetails from '../../serviceManage/component/createApp/applicationDetails.vue' /* 应用详情 */
import applyDetails from '../../serviceManage/component/createApp/applyDetails.vue' /* 应用申请详情 */
import createApplication from '../../serviceManage/component/createApp/createApplication.vue'/* 创建应用 */
import portManager from '../../serviceManage/component/createApp/portManager.vue' /* 应用管理端口维护 */
export default [{ // 服务管理路由
  path: '/homeIndex',
  name: 'homeIndex',
  component: homeIndex,
  redirect: {
    name: 'search'
  },
  children: [{
    path: '/search',
    name: 'search',
    component: search
  },
  {
    path: '/searchResult',
    name: 'searchResult',
    component: searchResult
  },
  {
    path: '/enterprise',
    name: 'enterprise',
    component: enterprise
  },
  {
    path: '/platformService',
    name: 'platformService',
    component: platformService
  },
  {
    path: '/thirdPartyService',
    name: 'thirdPartyService',
    component: thirdPartyService
  },
  {
    path: '/applyUsing',
    name: 'applyUsing',
    component: applyUsing
  },
  {
    path: '/registered',
    name: 'registered',
    component: registered
  },
  {
    path: '/applied',
    name: 'applied',
    component: applied
  },
  {
    path: '/chargePlanManage',
    name: 'chargePlanManage',
    component: chargePlanManage
  },
  {
    path: '/userNumInfo',
    name: 'userNumInfo',
    component: userNumInfo
  },
  {
    path: '/newServicePage',
    name: 'newServicePage',
    component: newServicePage
  },
  {
    path: '/atomServiceModify',
    name: 'atomServiceModify',
    component: atomServiceModify
  },
  {
    path: '/atomServiceDetail',
    name: 'atomServiceDetail',
    component: atomServiceDetail
  },
  {
    path: '/atomServiceApproval',
    name: 'atomServiceApproval',
    component: atomServiceApproval
  },
  {
    path: '/compositeServicePage',
    name: 'compositeServicePage',
    component: compositeServicePage
  },
  {
    path: '/compositeServiceDetail',
    name: 'compositeServiceDetail',
    component: compositeServiceDetail
  },
  {
    path: '/compositeServiceModify',
    name: 'compositeServiceModify',
    component: compositeServiceModify
  },
  {
    path: '/compositeServiceApproval',
    name: 'compositeServiceApproval',
    component: compositeServiceApproval
  },
  {
    path: '/invokeVoice',
    name: 'invokeVoice',
    component: invokeVoice
  },
  {
    path: '/APIhelp',
    name: 'APIhelp',
    component: APIhelp
  },
  {
    path: '/enterpriseApp',
    name: 'enterpriseApp',
    component: enterpriseApp
  },
  {
    path: '/myApp',
    name: 'myApp',
    component: myApp
  },
  {
    path: '/thirdPartyApp',
    name: 'thirdPartyApp',
    component: thirdPartyApp
  },
  {
    path: '/applicationDetails',
    name: 'applicationDetails',
    component: applicationDetails
  },
  {
    path: '/applyDetails',
    name: 'applyDetails',
    component: applyDetails
  },
  {
    path: '/createApplication',
    name: 'createApplication',
    component: createApplication
  },
  {
    path: '/portManager',
    name: 'portManager',
    component: portManager
  }
  ]
}]
