// 资源目录 start
import ResourceCatalogList from '../../resourceCatalog/component/rclist/index.vue'
import personApplyManage from '../../resourceCatalog/component/personApplyManage'
import applyManageAdministrator from '../../resourceCatalog/component/applyManageAdministrator'
import personRegisterManage from '../../resourceCatalog/component/personRegisterManage'
import newServiceForPersonRegister from '../../resourceCatalog/component/createBasicService/newServiceForPersonRegister'
import newServiceNextForPersonRegister from '../../resourceCatalog/component/createBasicService/newServiceNextForPersonRegister'
import newServiceFinishForPersonRegister from '../../resourceCatalog/component/createBasicService/newServiceFinishForPersonRegister'
import registerManageAdministrator from '../../resourceCatalog/component/registerManageAdministrator'
import Metadata from '../../resourceCatalog/component/metadata/index.vue'
import MetadataRegister from '../../resourceCatalog/component/metadata/Register.vue'
import MetadataDetail from '../../resourceCatalog/component/metadata/Detail.vue'

import DataCheck from '../../resourceCatalog/component/dataCheck/index.vue'
import RcDataCheckResult from '../../resourceCatalog/component/dataCheck/result'
import RcDataCheckTask from '../../resourceCatalog/component/dataCheck/task'
import RcDataCheckScheme from '../../resourceCatalog/component/dataCheck/scheme'
import NewScheme from '../../resourceCatalog/component/dataCheck/newScheme'
import EditScheme from '../../resourceCatalog/component/dataCheck/editScheme'
import RcDataCheckReport from '../../resourceCatalog/component/dataCheck/report'
import CatalogConfig from '../../resourceCatalog/component/catalogConfig'
import dataintroduced from '../../resourceCatalog/component/dataIntroduced'

import applyFillInForm from '../../resourceCatalog/component/applyFillInForm'
import interfaceDataDetail from '../../resourceCatalog/component/interfaceDataDetail'
import dataResourceDbDetail from '../../resourceCatalog/component/dataResourceDbDetail.vue'

import dataResourcesFillInFormDetail from '../../resourceCatalog/component/dataResourcesFillInFormDetail'
import dataElementFillInFormDetail from '../../resourceCatalog/component/dataElementFillInFormDetail'
import configAccomplish from '../../resourceCatalog/component/configAccomplish'
import configinfo from '../../resourceCatalog/component/configInfo'
import dataField from '../../resourceCatalog/component/dataField'

import RcDataDetail from '../../resourceCatalog/component/rclist/dataDetail'
import InterfaceSummary from '../../resourceCatalog/component/interface/summary'
import InterfaceDetail from '../../resourceCatalog/component/interface/detail'
// 资源目录 end

export default [
  { // 资源目录
    path: '/resourceCatalog',
    name: 'resourceCatalogList',
    component: ResourceCatalogList
  },
  {
    path: '/metadata/:page?/detail/:id',
    name: 'MetadataDetail',
    component: MetadataDetail
  },
  { // 个人申请
    path: '/personApplyManage',
    name: 'personApplyManage',
    component: personApplyManage
  },
  { // 申请管理
    path: '/applyManageAdministrator',
    name: 'applyManageAdministrator',
    component: applyManageAdministrator
  },
  { // 个人注册
    path: '/personRegisterManage',
    name: 'personRegisterManage',
    component: personRegisterManage
  },
  {
    path: '/newServiceForPersonRegister',
    name: 'newServiceForPersonRegister',
    component: newServiceForPersonRegister
  },
  {
    path: '/newServiceNextForPersonRegister',
    name: 'newServiceNextForPersonRegister',
    component: newServiceNextForPersonRegister
  },
  {
    path: '/newServiceFinishForPersonRegister',
    name: 'newServiceFinishForPersonRegister',
    component: newServiceFinishForPersonRegister
  },
  {
        // 个人注册-数据注册
    path: '/dataintroduced',
    name: 'dataintroduced',
    component: dataintroduced
  },
  {
        // 注册管理-配置信息
    path: '/configinfo',
    name: 'configinfo',
    component: configinfo
  },
  {
        // 注册管理-数据字段
    path: '/dataField',
    name: 'dataField',
    component: dataField
  },
  {
        // 注册管理-配置完成
    path: '/configAccomplish',
    name: 'configAccomplish',
    component: configAccomplish
  },
  {
        // 申请-填写表单
    path: '/applyFillInForm',
    name: 'ApplyFillInForm',
    component: applyFillInForm
  },
  {
        // 申请-查看数据详情
    path: '/interfaceDataDetail',
    name: 'InterfaceDataDetail',
    component: interfaceDataDetail
  },
  {
        // 申请-查看数据资源数据库表详情
    path: '/dataResourceDbDetail',
    name: 'dataResourceDbDetail',
    component: dataResourceDbDetail
  },
  { // 注册管理
    path: '/registerManageAdministrator',
    name: 'registerManageAdministrator',
    component: registerManageAdministrator
  },
  { // 数据元管理
    path: '/metadata',
    name: 'metadata',
    component: Metadata
  },
  { // 注册数据元
    path: '/metadata/register/:page/:id?',
    name: 'metadataRegister',
    component: MetadataRegister
  },
  { // (数据)质量检测
    path: '/dataCheck',
    name: 'dataCheck',
    component: DataCheck,
    redirect: {
      name: 'dataCheckResult'
    },
    children: [{
      path: '/result', // 检测结果
      name: 'dataCheckResult',
      component: RcDataCheckResult
    },
    {
      path: '/scheme', // 检测方案
      name: 'dataCheckScheme',
      component: RcDataCheckScheme
    },
    {
      path: '/newScheme', // 新建检测方案
      name: 'newScheme',
      component: NewScheme
    },
    {
      path: '/editScheme', // 编辑检测方案
      name: 'editScheme',
      component: EditScheme
    },
    {
      path: '/task', // 检测任务
      name: 'dataCheckTask',
      component: RcDataCheckTask
    },
    {
      path: '/report', // 检测报告
      name: 'dataCheckReport',
      component: RcDataCheckReport
    }
    ]
  },
  { // 目录维护
    path: '/catalogConfig',
    name: 'catalogConfig',
    component: CatalogConfig
  },
  {
    path: '/dataDetail',
    name: 'rcDataDetail',
    component: RcDataDetail
  },
  {
    path: '/interfaceSummary',
    name: 'interfaceSummary',
    component: InterfaceSummary
  },
  {
    path: '/InterfaceDetail',
    name: 'InterfaceDetail',
    component: InterfaceDetail
  },
  {
        // 注册管理-管理员-注册数据资源查看详情
    path: '/dataResourcesFillInFormDetail',
    name: 'DataResourcesFillInFormDetail',
    component: dataResourcesFillInFormDetail
  },
  {
        // 注册管理-管理员-注册数据元查看详情
    path: '/dataElementFillInFormDetail',
    name: 'DataElementFillInFormDetail',
    component: dataElementFillInFormDetail
  }
]
