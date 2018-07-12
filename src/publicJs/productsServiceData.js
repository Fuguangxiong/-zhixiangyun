/**
 * Created by dell on 2018/1/5.
 */
import publicPath from './publicPathConfig'
export default {
  getData: function () {
    var topNavData = [
      {
        title: '账号中心',
        list: [
                { name: '安全管理', link: publicPath.PERSONAL_CONSOLE + '/#/safetyManagement' },
                { name: '基本资料', link: publicPath.PERSONAL_CONSOLE + '/#/basicInformation' },
                { name: '实名认证', link: publicPath.PERSONAL_CONSOLE + '/#/realNameCertification' },
                { name: '创建企业', link: publicPath.PERSONAL_CONSOLE + '/#/createEnterprise' },
                { name: '加入企业', link: publicPath.PERSONAL_CONSOLE + '/#/joinEnterprise' },
                { name: '身份管理', link: publicPath.PERSONAL_CONSOLE + '/#/identityManagement' }
        ]
      },
      {
        title: '个人管理',
        list: [
                { name: '个人收藏', link: publicPath.PERSONAL_CONSOLE + '/#/collection' },
                { name: '评价管理', link: publicPath.PERSONAL_CONSOLE + '/#/evaluation' },
                { name: '资源申请', link: publicPath.PERSONAL_CONSOLE + '/#/personApplyManage' },
                { name: '资源注册', link: publicPath.PERSONAL_CONSOLE + '/#/personRegisterManage' },
                { name: '服务申请', link: publicPath.PERSONAL_CONSOLE + '/#/applied' },
                { name: '服务注册', link: publicPath.PERSONAL_CONSOLE + '/#/registered' },
                { name: '待我审批', link: publicPath.PERSONAL_CONSOLE + '/#/applyUsing' }
        ]
      },
      {
        title: '企业信息维护',
        list: [
                { name: '企业资料', link: publicPath.COMPANY_OPERATION + '/#/enterpriseManagement' },
                { name: '员工审核', link: publicPath.COMPANY_OPERATION + '/#/enterpriseAuthenticationList' },
                { name: '用户管理', link: publicPath.COMPANY_OPERATION + '/#/accountManage' },
                { name: '角色管理', link: publicPath.COMPANY_OPERATION + '/#/authorityManage' },
                { name: '部门管理', link: publicPath.COMPANY_OPERATION + '/#/departManage' }
        ]
      },
      {
        title: '企业服务管理',
        list: [
                { name: '服务检索', link: publicPath.COMPANY_OPERATION + '/#/search' },
                { name: '企业服务管理', link: publicPath.COMPANY_OPERATION + '/#/enterprise' },
                { name: '平台服务管理', link: publicPath.COMPANY_OPERATION + '/#/platformService' },
                { name: '第三方服务管理', link: publicPath.COMPANY_OPERATION + '/#/thirdPartyService' },
                { name: '计费方案管理', link: publicPath.COMPANY_OPERATION + '/#/chargePlanManage' }
        ]
      },
      {
        title: '企业资源管理',
        list: [
                { name: '资源目录', link: publicPath.COMPANY_OPERATION + '/#/resourceCatalogList' },
                { name: '数据元管理', link: publicPath.COMPANY_OPERATION + '/#/metadata' },
                { name: '质量检测', link: publicPath.COMPANY_OPERATION + '/#/dataCheck' },
                { name: '资源申请管理', link: publicPath.COMPANY_OPERATION + '/#/applyManageAdminist' },
                { name: '资源注册管理', link: publicPath.COMPANY_OPERATION + '/#/registerManageAdmin' },
                { name: '目录维护', link: publicPath.COMPANY_OPERATION + '/#/catalogConfig' }
        ]
      }
    ]
    return topNavData
  }
}
