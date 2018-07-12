import Vue from 'vue'
import Router from 'vue-router'

import Index from '../components/index'
import register from '../components/register'
// 部门管理
import departManage from '../components/departManage/departManage'
import departAddEdit from '../components/departManage/departAddEdit'
// 授权管理
import authorityManage from '../components/authorityManage/authorityManage'
import authorityRelation from '../components/authorityManage/authorityRelation'
import authorityRole from '../components/authorityManage/authorityRole'
// 账户管理
import accountManage from '../components/accountManage/accountManage'
import accountAddEdit from '../components/accountManage/accountAddEdit'
import accountImport from '../components/accountManage/accountImport'
// 账户审核
import auditUser from '../components/auditUser/auditUser'
import auditUserDetails from '../components/auditUser/auditUserDetails'
// 超级管理员
import superAdministrator from '../components/superAdministrator/superAdministrator'
// 创建企业
import createEnterprise from '../components/createEnterprise/createEnterprise'
import enterpriseInformation from '../components/createEnterprise/enterpriseInformation'
// 加入企业
import joinEnterprise from '../components/joinEnterprise/joinEnterprise'
// 审批企业
import auditEnterprise from '../components/auditEnterprise/auditEnterprise'
import auditEnterpriseDetail from '../components/auditEnterprise/auditEnterpriseDetail'
//加入登陆界面

Vue.use(Router)

var myPath = '/'

export default new Router({
  mode: 'hash',
  routes: [
    {
      path: '/register',
      name: 'register',
      component: register
    },
    {
      path: myPath,
      name: 'Index',
      component: Index,
      redirect: {
        name: 'departManage'
      },
      children: [
        { // 部门管理
          path: '/departManage',
          name: 'departManage',
          component: departManage
        },
        { // 部门管理-新建
          path: '/departAddEdit',
          name: 'departAddEdit',
          component: departAddEdit
        },
        { // 授权管理
          path: '/authorityManage',
          name: 'authorityManage',
          component: authorityManage
        },
        { // 授权管理-关联部门
          path: '/authorityRelation',
          name: 'authorityRelation',
          component: authorityRelation
        },
        { // 授权管理-权限分配
          path: '/authorityRole',
          name: 'authorityRole',
          component: authorityRole
        },
        { // 账户管理
          path: '/accountManage',
          name: 'accountManage',
          component: accountManage
        },
        { // 账户管理-新建
          path: '/accountAddEdit',
          name: 'accountAddEdit',
          component: accountAddEdit
        },
        { // 账户管理-导入
          path: '/accountImport',
          name: 'accountImport',
          component: accountImport
        },
        { // 账户审核
          path: '/auditUser',
          name: 'auditUser',
          component: auditUser
        },
        { // 账户审核-详情
          path: '/auditUserDetails',
          name: 'auditUserDetails',
          component: auditUserDetails
        },
        { // 超级管理员
          path: '/superAdministrator',
          name: 'superAdministrator',
          component: superAdministrator
        },
        { // 创建企业
          path: '/createEnterprise',
          name: 'createEnterprise',
          component: createEnterprise
        },
        { // 创建企业-创建信息
          path: '/enterpriseInformation',
          name: 'enterpriseInformation',
          component: enterpriseInformation
        },
        { // 加入企业
          path: '/joinEnterprise',
          name: 'joinEnterprise',
          component: joinEnterprise
        },
        { // 审批企业
          path: '/auditEnterprise',
          name: 'auditEnterprise',
          component: auditEnterprise
        },
        { // 审批企业-详情
          path: '/auditEnterpriseDetail',
          name: 'auditEnterpriseDetail',
          component: auditEnterpriseDetail
        }
      ]
    }
  ]
})
