import Vue from 'vue'
import Router from 'vue-router'

import Index from '../component/Index'
import ResourceCatalogList from '../component/rclist'
import personApplyManage from '../component/personApplyManage'
import applyManageAdministrator from '../component/applyManageAdministrator'
import personRegisterManage from '../component/personRegisterManage'
import newServiceForPersonRegister from '../component/createBasicService/newServiceForPersonRegister'
import newServiceNextForPersonRegister from '../component/createBasicService/newServiceNextForPersonRegister'
import newServiceFinishForPersonRegister from '../component/createBasicService/newServiceFinishForPersonRegister'
import registerManageAdministrator from '../component/registerManageAdministrator'
import Metadata from '../component/metadata/index.vue'
import MetadataRegister from '../component/metadata/Register.vue'
import MetadataDetail from '../component/metadata/Detail.vue'

import DataCheck from '../component/dataCheck/index.vue'
import RcDataCheckResult from '../component/dataCheck/result'
import RcDataCheckTask from '../component/dataCheck/task'
import RcDataCheckScheme from '../component/dataCheck/scheme'
import NewScheme from '../component/dataCheck/newScheme'
import EditScheme from '../component/dataCheck/editScheme'
import RcDataCheckReport from '../component/dataCheck/report'
import CatalogConfig from '../component/catalogConfig'
import dataintroduced from '../component/dataIntroduced' // 注册数据源

// import RcDataCheckSchemeDetail from '../component/dataCheck/schemeDetail'
// import RcDataCheckTestReport from '../component/dataCheck/testReport'
import applyFillInForm from '../component/applyFillInForm'
import interfaceDataDetail from '../component/interfaceDataDetail'
import dataResourceDbDetail from '../component/dataResourceDbDetail.vue'

import dataResourcesFillInFormDetail from '../component/dataResourcesFillInFormDetail'
import dataElementFillInFormDetail from '../component/dataElementFillInFormDetail'
import configAccomplish from '../component/configAccomplish'
import configinfo from '../component/configInfo'
import dataField from '../component/dataField'
// import ApplyFillInFormDetail from '../component/applyFillInFormDetail'
import RcDataDetail from '../component/rclist/dataDetail'
import InterfaceSummary from '../component/interface/summary'
import InterfaceDetail from '../component/interface/detail'

Vue.use(Router)
var myPath='/';
//if(process.env.NODE_ENV === 'production')
// myPath='/platform/rc';
   
export default new Router({
//mode: 'history',
  mode: 'hash',
  routes: [
    {
//    path: '/',
      path: myPath,
      name: 'Index',
      component: Index,
      redirect: { name: 'resourceCatalogList' },
      children: [
        {
          path: '/metadata/:page?/detail/:id',
          name: 'MetadataDetail',
          component: MetadataDetail
        },
        { // 资源目录
          path: '/resourceCatalog',
          name: 'resourceCatalogList',
          component: ResourceCatalogList
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
          redirect: { name: 'dataCheckResult' },
          children: [
            {
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
              path: '/task',  // 检测任务
              name: 'dataCheckTask',
              component: RcDataCheckTask
            },
            {
              path: '/report',  // 检测报告
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
//    beforeEnter: (to, from, next) => {
//      let str = to.fullPath;
//      let newStr = str.indexOf('router=')
//      if (newStr != -1) {
//        newStr = str.substr(newStr + 7);
//        let reg3 = /(%3F%2F)/img;
//        newStr = newStr.replace(reg3, '?');
//        let reg = /(%2F)/img;
//        newStr = newStr.replace(reg, '/');
//        let reg1 = /(%3F)/img;
//        newStr = newStr.replace(reg1, '?');
//        let reg2 = /(%3D)/img;
//        newStr = newStr.replace(reg2, '=');
//        next(newStr)
//      } else {
//        next()
//      }
//    }
    }

    /*
    {
      path: '/dataDetail',
      name: 'rcDataDetail',
      component: RcDataDetail
    },
    {
      path: '/dataCheck/report',
      name: 'dataCheckReport',
      component: RcDataCheckReport
    },
    // 质量检测
    {
      path: '/dataCheck/testReport',
      name: 'rcDataCheckTestReport',
      component: RcDataCheckTestReport
    },
    {
      path: '/dataCheck/schemeDetail',
      name: 'rcDataCheckSchemeDetail',
      component: RcDataCheckSchemeDetail
    },
    {
      // 申请管理-管理员-查看详情
      path: '/applyFillinFormDetail',
      name: 'ApplyFillInFormDetail',
      component: ApplyFillInFormDetail
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
    },
    {
      path: '/metadata/:page?/detail/:id',
      name: 'MetadataDetail',
      component: MetadataDetail
    },
    // 资源目录
    {
      path: '/',
      name: 'rcIndex',
      component: RcIndex,
      redirect: { name: 'rclist' },
      children: [
        
        {
          // 注册管理-配置信息
          path: '/rc/configinfo',
          name: 'configinfo',
          component: configinfo
        },
        {
          // 注册管理-数据字段
          path: '/rc/dataField',
          name: 'dataField',
          component: dataField
        },
        {
          // 注册管理-配置完成
          path: '/rc/configAccomplish',
          name: 'configAccomplish',
          component: configAccomplish
        },
        {
          // 申请-填写表单
          path: '/rc/applyFillInForm',
          name: 'ApplyFillInForm',
          component: applyFillInForm
        }
      ]
    }
    */
  ]
})
