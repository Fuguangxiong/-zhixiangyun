import Vue from 'vue'
import Router from 'vue-router'
import Evaluation from '../component/evaluation/evaluation.vue'
import PersonalConsole from '../component/personalConsole.vue'
import Collection from '../component/collection/collection.vue'
import PersonalConsoleIndex from '../component/personalConsoleIndex/personalConsoleIndex.vue'
// 账号管理 start
import safetyManagement from '../component/accountManagement/safetyManagement/safetyManagement.vue'
import modifyPassword from '../component/accountManagement/safetyManagement/modifyPassword.vue'
import modifyPhoneNumber from '../component/accountManagement/safetyManagement/modifyPhoneNumber.vue'
import modifyEmail from '../component/accountManagement/safetyManagement/modifyEmail.vue'
import basicInformation from '../component/accountManagement/basicInformation/basicInformation.vue'
import realNameCertification from '../component/accountManagement/realNameCertification/realNameCertification.vue'
import ReApplyrealNameCertification from '../component/accountManagement/realNameCertification/ReApplyrealNameCertification.vue'
import createEnterprise from '../component/accountManagement/createEnterprise/createEnterprise.vue'
import innercreateEnterprise from '../component/accountManagement/createEnterprise/innercreateEnterprise.vue'
import detailcreateEnterprise from '../component/accountManagement/createEnterprise/detailcreateEnterprise.vue'
import joinEnterprise from '../component/accountManagement/joinEnterprise/joinEnterprise.vue'
import identityManagement from '../component/accountManagement/identityManagement/identityManagement.vue'
// 账号管理 end

// 调用服务
import invoke from '../../serviceManage/component/detailPage/Invoke.vue'
import CommonOutput from '../../serviceManage/component/detailPage/commonOutput.vue'
import sevPageView from '../../serviceManage/component/detailPage/sevPageView.vue'
// 资源目录
import resourceCatalog from './resourceCatalog'

// 服务管理
import serviceManager from './serviceManager'

import announcementHeader from '../component/announcement/announcementHeader.vue'
import announcementList from '../component/announcement/announcementList.vue'
import announcementDetail from '../component/announcement/announcementDetail.vue'
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
  routes: [{
    path: '/announcementHeader',
    name: 'announcementHeader',
    component: announcementHeader
  },
  {
    path: '/announcementDetail',
    name: 'announcementDetail',
    component: announcementDetail
  },
  {
    path: '/announcementList',
    name: 'announcementList',
    component: announcementList
  },
  {
    path: '/',
    name: 'personalConsole',
    component: PersonalConsole,
    redirect: '/personalConsoleIndex',
    children: [
      ...resourceCatalog,
      ...serviceManager,
      {
        path: '/personalConsoleIndex',
        name: 'personalConsoleIndex',
        component: PersonalConsoleIndex
      },
      {
        path: '/evaluation',
        name: 'evaluation',
        component: Evaluation
      },
      {
        path: '/collection',
        name: 'collection',
        component: Collection
      },
      {
        path: '/safetyManagement',
        name: 'safetyManagement',
        component: safetyManagement
      },
      {
        path: '/basicInformation',
        name: 'basicInformation',
        component: basicInformation
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
        path: '/createEnterprise',
        name: 'createEnterprise',
        component: createEnterprise
      },
      {
        path: '/innercreateEnterprise',
        name: 'innercreateEnterprise',
        component: innercreateEnterprise
      },
      {
        path: '/detailcreateEnterprise',
        name: 'detailcreateEnterprise',
        component: detailcreateEnterprise
      },
      {
        path: '/joinEnterprise',
        name: 'joinEnterprise',
        component: joinEnterprise
      },
      {
        path: '/identityManagement',
        name: 'identityManagement',
        component: identityManagement
      },
      {
        path: '/modifyPhoneNumber',
        name: 'modifyPhoneNumber',
        component: modifyPhoneNumber
      },
      {
        path: '/modifyPassword',
        name: 'modifyPassword',
        component: modifyPassword
      },
      {
        path: '/modifyEmail',
        name: 'modifyEmail',
        component: modifyEmail
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
