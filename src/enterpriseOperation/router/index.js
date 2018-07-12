import Vue from 'vue'
import Router from 'vue-router'

import enterpriseOperation from '../component/enterpriseOperation.vue'
import enterpriseAuthenticationList from '../component/enterpriseAuthentication/enterpriseAuthenticationList.vue'
import enterpriseAuthenticationDetail from '../component/enterpriseAuthentication/enterpriseAuthenticationDetail.vue'
import enterpriseManagement from '../component/enterpriseManagement'

import invoke from '../../serviceManage/component/detailPage/Invoke.vue'
import CommonOutput from '../../serviceManage/component/detailPage/commonOutput.vue'
import sevPageView from '../../serviceManage/component/detailPage/sevPageView.vue'
// 登录页面
// import register from '../../platformAuthority/components/register'
// 资源目录
import resourceCatalog from './resourceCatalog'

// 权限管理
// import platformAuthority from './platformAuthority'

// 帐号管理
import accountManagement from './accountManagement'
// 服务管理
import serviceManager from './serviceManager'

Vue.use(Router)
export default new Router({
  // mode: 'history',
  mode: 'hash',
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      if (from.meta.keepAlive) {
        from.meta.savedPosition = document.body.scrollTop
      }
      return {
        x: 0,
        y: to.meta.savedPosition || 0
      }
    }
  },
  routes: [
    {
      path: '/',
      name: 'enterpriseOperation',
      component: enterpriseOperation,
      children: [
        ...accountManagement,
        ...resourceCatalog,
        ...serviceManager,
        {
          path: '/enterpriseAuthenticationList',
          name: 'enterpriseAuthenticationList',
          component: enterpriseAuthenticationList
        },
        {
          path: '/enterpriseAuthenticationDetail',
          name: 'enterpriseAuthenticationDetail',
          component: enterpriseAuthenticationDetail
        },
        {
          path: '/enterpriseManagement',
          name: 'enterpriseManagement',
          component: enterpriseManagement
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
