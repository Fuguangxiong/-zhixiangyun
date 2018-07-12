import Vue from 'vue'
import Router from 'vue-router'
import internalOperation from '../component/internalOperation.vue'
import Notice from '../component/notice/noticeList.vue'
import Message from '../component/message/message.vue'
import AddNotice from '../component/notice/addNotice.vue'
import NoticeDetails from '../component/notice/noticeDetails.vue'
import Evaluation from '../component/evaluation/evaluation.vue'
import blackList from '../component/blackWhiteList/blackList.vue'
import whiteList from '../component/blackWhiteList/whiteList.vue'
import evaluationBlackList from '../component/blackWhiteList/evaluationBlackList.vue'
import personalAuthenticationList from '../component/personalAuthentication/personalAuthenticationList.vue'
import personalAuthenticationDetail from '../component/personalAuthentication/personalAuthenticationDetail.vue'
import enterpriseApproveList from '../component/enterpriseApprove/enterpriseApproveList.vue'
import enterpriseApproveDetail from '../component/enterpriseApprove/enterpriseApproveDetail.vue'

// 内部运营平台登录
import internalLogin from '../component/internalLogin.vue'
// 应用市场配置--主页

// 应用市场配置--主页
import appConfig from '../component/appConfig/appConfig.vue'
// 首页公告配置页
import appNoticConfig from '../component/appConfig/appNoticConfig.vue'
// 应用市场配置--图标配置
import appImgConfig from '../component/appConfig/appImgConfig.vue'
// 导航配置页
import appNavConfig from '../component/appConfig/appNavConfig.vue'
// 应用市场配置--轮播图
import appBannerImgConfig from '../component/appConfig/appBannerImgConfig.vue'
// 应用市场配置--热门推荐
import appHotConfig from '../component/appConfig/appHotConfig.vue'
// 应用市场配置--搜索关键词
import appKeyWordsConfig from '../component/appConfig/appKeyWordsConfig.vue'
// 应用市场配置--精彩专题
import appSpecialConfig from '../component/appConfig/appSpecialConfig.vue'
// 应用市场配置--新锐应用
import appNewServiceConfig from '../component/appConfig/appNewServiceConfig.vue'
// 应用市场配置--友情链接
import appFriendshipLinkConfig from '../component/appConfig/appFriendshipLinkConfig.vue'
// 应用市场配置--模板配置
import appTemplateConfig from '../component/appConfig/appTemplateConfig.vue'
import appIndexConfig from '../component/appConfig/appIndexConfig.vue'

// 资源目录
import resourceCatalog from './resourceCatalog'
// 权限管理
// import platformAuthority from './platformAuthority'
// 帐号管理
import accountManagement from './accountManagement'
// 服务管理
import serviceManager from './serviceManager'
import invoke from '../../serviceManage/component/detailPage/Invoke.vue'
import sevPageView from '../../serviceManage/component/detailPage/sevPageView.vue'
import CommonOutput from '../../serviceManage/component/detailPage/commonOutput.vue'
// 开发者平台
import categoryManage from '../component/openPlatform/categoryManage.vue'
import APImarketSort from '../component/openPlatform/apiMarketSort.vue'
Vue.use(Router)
export default new Router({
  // mode: 'history',
  mode: 'hash',
  routes: [{
    path: '/',
    name: 'internalLogin',
    component: internalLogin
  },
  {
    path: '/internalOperation',
    name: 'internalOperation',
    component: internalOperation,
      // redirect: '/login',
    children: [
      ...resourceCatalog,
      ...accountManagement,
      ...serviceManager,
      {
        path: '/categoryManage',
        name: 'categoryManage',
        component: categoryManage
      },
      {
        path: '/APImarketSort',
        name: 'APImarketSort',
        component: APImarketSort
      },

      {
        path: '/notice',
        name: 'notice',
        component: Notice
      },
      {
        path: '/message',
        name: 'message',
        component: Message
      },
      {
        path: '/noticeDetails',
        name: 'noticeDetails',
        component: NoticeDetails
      },
      {
        path: '/addNotice',
        name: 'addNotice',
        component: AddNotice
      },
      {
        path: '/evaluation',
        name: 'evaluation',
        component: Evaluation
      },
      {
        path: '/blackList',
        name: 'blackList',
        component: blackList
      },
      {
        path: '/whiteList',
        name: 'whiteList',
        component: whiteList
      },
      {
        path: '/evaluationBlackList',
        name: 'evaluationBlackList',
        component: evaluationBlackList
      },
      {
        path: '/personalAuthenticationList',
        name: 'personalAuthenticationList',
        component: personalAuthenticationList
      },
      {
        path: '/personalAuthenticationDetail',
        name: 'personalAuthenticationDetail',
        component: personalAuthenticationDetail
      },
      {
        path: '/enterpriseApproveList',
        name: 'enterpriseApproveList',
        component: enterpriseApproveList
      },
      {
        path: '/enterpriseApproveDetail',
        name: 'enterpriseApproveDetail',
        component: enterpriseApproveDetail
      },
      {
        path: '/appConfig',
        name: 'appConfig',
        component: appConfig,
        redirect: 'appImgConfig',
        children: [{
          path: '/appFriendshipLinkConfig',
          name: 'appFriendshipLinkConfig',
          component: appFriendshipLinkConfig
        },
        {
              // 导航配置
          path: '/appNavConfig',
          name: 'appNavConfig',
          component: appNavConfig
        },
        { // 轮播图
          path: '/appBannerImgConfig',
          name: 'appBannerImgConfig',
          component: appBannerImgConfig
        },
        { // 精彩专题
          path: '/appSpecialConfig',
          name: 'appSpecialConfig',
          component: appSpecialConfig
        },
        { // 首页公告
          path: '/appNoticConfig',
          name: 'appNoticConfig',
          component: appNoticConfig
        },
        { // 热门推荐
          path: '/appHotConfig',
          name: 'appHotConfig',
          component: appHotConfig
        },
        { // 搜索关键词
          path: '/appKeyWordsConfig',
          name: 'appKeyWordsConfig',
          component: appKeyWordsConfig
        },
        { // 图标配置
          path: '/appImgConfig',
          name: 'appImgConfig',
          component: appImgConfig
        },
        { // 新锐应用
          path: '/appNewServiceConfig',
          name: 'appNewServiceConfig',
          component: appNewServiceConfig
        },
        { // 模板配置
          path: '/appTemplateConfig',
          name: 'appTemplateConfig',
          component: appTemplateConfig
        },
        {
          path: '/appIndexConfig',
          name: 'appIndexConfig',
          component: appIndexConfig
        }
        ]
      }
    ]
  },
  {
    path: '/invoke',
    name: 'invoke',
    component: invoke
  },
  {
    path: '/commonOutput',
    name: 'CommonOutput',
    component: CommonOutput
  },
  {
    path: '/sevPageView',
    name: 'sevPageView',
    component: sevPageView
  }
  ]
})
