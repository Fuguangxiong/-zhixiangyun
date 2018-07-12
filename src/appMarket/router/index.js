import Vue from 'vue'
import Router from 'vue-router'
// 登录页面
import register from '../../platformAuthority/components/register'
import forgetPassword from '../component/accountManagement/forgetPassword.vue'
import accountRegister from '../component/accountManagement/register.vue'
import enterpriseSelect from '../component/accountManagement/enterpriseSelect.vue'
// 应用市场首页
import appHome from '../component/appHome/appHome.vue'
// 精彩专题详情页
import appWonderfulSpecialColumn from '../component/appHome/appWonderfulSpecialColumn.vue'
// 专题详情页查看更多
import appFinancialEducationSeries from '../component/appHome/appFinancialEducationSeries.vue'
// 服务详情页
import appServiceDetail from '../component/appHome/newAppServiceDetail.vue'
// 服务详情页------新版
import newAppServiceDetail from '../component/appHome/appServiceDetail.vue'
// 搜索列表页
import appSearchList from '../component/appHome/appSearchList.vue'
// 热门推荐更多 与新锐应用更多
import appHotMore from '../component/appHome/appHotMore.vue'
import invoke from '../../serviceManage/component/detailPage/Invoke.vue'
import sevPageView from '../../serviceManage/component/detailPage/sevPageView.vue'
import CommonOutput from '../../serviceManage/component/detailPage/commonOutput.vue'
Vue.use(Router)

export default new Router({
  mode: 'hash',
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      if (from.meta.keepAlive) {
        from.meta.savedPosition = document.body.scrollTop
      }
      return { x: 0, y: to.meta.savedPosition || 0 }
    }
  },
  routes: [
    { // 登录注册
      path: '/register',
      name: 'register',
      component: register
    },
    {
      path: '/forgetPassword',
      name: 'forgetPassword',
      component: forgetPassword
    },
    {
      path: '/accountRegister',
      name: 'accountRegister',
      component: accountRegister
    },
    {
      path: '/enterpriseSelect',
      name: 'enterpriseSelect',
      component: enterpriseSelect
    },
    {
      path: '/',
      name: 'appHome',
      component: appHome
    },
    {
      path: '/appWonderfulSpecialColumn',
      name: 'appWonderfulSpecialColumn',
      component: appWonderfulSpecialColumn
    },
    {
      path: '/appFinancialEducationSeries',
      name: 'appFinancialEducationSeries',
      component: appFinancialEducationSeries
    },
    {
      path: '/appHotMore',
      name: 'appHotMore',
      component: appHotMore
    },
    {
      path: '/appServiceDetail',
      name: 'appServiceDetail',
      component: appServiceDetail
    },
    {
      path: '/newAppServiceDetail',
      name: 'newAppServiceDetail',
      component: newAppServiceDetail
    },

    {
      path: '/appSearchList',
      name: 'appSearchList',
      component: appSearchList
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
