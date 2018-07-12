// 权限管理 start
import register from '../../platformAuthority/components/register'
// 部门管理
import departManage from '../../platformAuthority/components/departManage/departManage'
import departAddEdit from '../../platformAuthority/components/departManage/departAddEdit'
// 授权管理
import authorityManage from '../../platformAuthority/components/authorityManage/authorityManage'
import authorityRelation from '../../platformAuthority/components/authorityManage/authorityRelation'
import authorityRole from '../../platformAuthority/components/authorityManage/authorityRole'
// 账户管理
import accountManage from '../../platformAuthority/components/accountManage/accountManage'
import accountAddEdit from '../../platformAuthority/components/accountManage/accountAddEdit'
import accountImport from '../../platformAuthority/components/accountManage/accountImport'
// 账户审核
import auditUser from '../../platformAuthority/components/auditUser/auditUser'
import auditUserDetails from '../../platformAuthority/components/auditUser/auditUserDetails'
// 超级管理员
import superAdministrator from '../../platformAuthority/components/superAdministrator/superAdministrator'
// 权限管理 end

export default [
  { // 部门管理 // 权限管理 start
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
  { // 权限管理 end
    path: '/register',
    name: 'register',
    component: register
  }
]
