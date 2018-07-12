import Vue from 'vue'
import Router from 'vue-router'
/* start */
import homeIndex from '../serviceManage/component/homeIndex.vue' /* 测试 */
/* 新建应用 */
/* 原子服务 */
import newServicePage from '../serviceManage/component/createBasicService/newServicePage.vue' /* 创建 */
import atomServiceDetail from '../serviceManage/component/createBasicService/atomServiceDetail.vue' /* 详情 */
import atomServiceModify from '../serviceManage/component/createBasicService/atomServiceModify.vue' /* 变更 */
import atomServiceApproval from '../serviceManage/component/createBasicService/atomServiceApproval.vue' /* 审批 */
/* 组合服务 */
import compositeServicePage from '../serviceManage/component/createCombinationService/compositeServicePage.vue' /* 创建 */
import compositeServiceDetail from '../serviceManage/component/createCombinationService/compositeServiceDetail.vue' /* 详情 */
import compositeServiceModify from '../serviceManage/component/createCombinationService/compositeServiceModify.vue' /* 变更 */
import compositeServiceApproval from '../serviceManage/component/createCombinationService/compositeServiceApproval.vue' /* 审批 */
/* 服务管理 */
import search from '../serviceManage/component/servicesManage/search.vue' /* 搜索 */
import searchResult from '../serviceManage/component/servicesManage/searchResult.vue' /* 搜索结果 */
import enterprise from '../serviceManage/component/servicesManage/enterprise.vue' /* 企业服务 */
import registered from '../serviceManage/component/servicesManage/registered.vue' /* 已注册服务 */
import applyUsing from '../serviceManage/component/servicesManage/applyUsing.vue' /* 待我审批 */
import applied from '../serviceManage/component/servicesManage/applied.vue' /* 已申请服务 */
import platformService from '../serviceManage/component/servicesManage/platformService.vue' /* 平台服务 */
import thirdPartyService from '../serviceManage/component/servicesManage/thirdPartyService.vue' /* 第三方服务 */
import chargePlanManage from '../serviceManage/component/servicesManage/chargePlanManage.vue' /* 计费方案 */
import userNumInfo from '../serviceManage/component/servicesManage/userNumInfo.vue' /* 服务用户数 */
/* 服务预览页面 */
import invoke from '../serviceManage/component/detailPage/Invoke.vue'
import sevPageView from '../serviceManage/component/detailPage/sevPageView.vue'
import CommonOutput from '../serviceManage/component/detailPage/commonOutput.vue'
import invokeVoice from '../serviceManage/component/detailPage/InvokeVoice.vue'
import APIhelp from '../serviceManage/component/detailPage/APIhelp.vue' /* API文档 */

/*企业个人-搜索*/
import epsearch from '../component/servicesManage/searchEP.vue'
/*企业个人-搜索结果*/
import epsearchResult from '../component/servicesManage/searchResultEP.vue'
/*企业个人-企业服务*/
import epenterprise from '../component/servicesManage/enterpriseEP.vue'
/*企业个人-已注册服务*/
import epregistered from '../component/servicesManage/registeredEP.vue'
/*企业个人-待我审批*/
import epapplyUsing from '../component/servicesManage/applyUsingEP.vue'
/*企业个人-已申请服务*/
import epapplied from '../component/servicesManage/appliedEP.vue'
/*企业个人-平台服务*/
import epplatformService from '../component/servicesManage/platformServiceEP.vue'
/*企业个人-第三方服务*/
import epthirdPartyService from '../component/servicesManage/thirdPartyServiceEP.vue'
/*企业个人-计费方案*/
import epchargePlanManage from '../component/servicesManage/chargePlanManageEP.vue'

Vue.use(Router);
var myPath = '/';
//if(process.env.NODE_ENV === 'production')
// myPath='/platform/sc';

export default new Router({
  // mode: 'history',
  mode: 'hash',
  routes: [{
    // path: '/',
    path: myPath,
    name: 'homeIndex',
    component: homeIndex,
    redirect: 'search',
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
        path: '/sevPageView',
        name: 'sevPageView',
        component: sevPageView
      },
      {
        path: '/commonOutput',
        name: 'CommonOutput',
        component: CommonOutput
      },
      {
        path: '/invoke',
        name: 'invoke',
        component: invoke
      },
      {
        path: '/epsearch',
        name: 'epsearch',
        component: epsearch
      },
      {
        path: '/epsearchResult',
        name: 'epsearchResult',
        component: epsearchResult
      },
      {
        path: '/epenterprise',
        name: 'epenterprise',
        component: epenterprise
      },
      {
        path: '/epplatformService',
        name: 'epplatformService',
        component: epplatformService
      },
      {
        path: '/epthirdPartyService',
        name: 'epthirdPartyService',
        component: epthirdPartyService
      },
      {
        path: '/epapplyUsing',
        name: 'epapplyUsing',
        component: epapplyUsing
      },
      {
        path: '/epregistered',
        name: 'epregistered',
        component: epregistered
      },
      {
        path: '/epapplied',
        name: 'epapplied',
        component: epapplied
      },
      {
        path: '/epchargePlanManage',
        name: 'epchargePlanManage',
        component: epchargePlanManage
      }
    ]
  }]
});