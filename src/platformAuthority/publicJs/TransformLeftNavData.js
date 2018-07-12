/**
 * Created by dell on 2017/9/21.
 */
import HttpService from '../../publicJs/ApiClient'
export default {
  getLeftNavData: function (index) {
    var dataStr = window.sessionStorage.getItem('menuName')

    var data = JSON.parse(dataStr)
    var leftNavData = new Array()
    for (var i = 0; i < data.length; i++) {
      var obj = data[i]
      var newObj = new Object()
      newObj.name = obj.menuName
      if (index == obj.menuName) {
        newObj.active = true
      }
      newObj.link = obj.menuUrl
      if (obj.menuName == '部门管理') {
        newObj.imageClass = 'departmentManage'
      } else if (obj.menuName == '账户管理') {
        newObj.imageClass = 'accoutManage'
      } else if (obj.menuName == '授权管理') {
        newObj.imageClass = 'authority'
      } else if (obj.menuName == '账户审核') {
        newObj.imageClass = 'accoutApproval'
      } else if (obj.menuName == '超级管理员') {
        newObj.imageClass = 'superAdmin'
      } else if (obj.menuName == '审批企业') {
        newObj.imageClass = 'approvalEnterprise'
      } else if (obj.menuName == '企业授权') {
        newObj.imageClass = 'enterpriseLicensing'
      } else if (obj.menuName == '创建企业') {
        newObj.imageClass = 'createEnterprise'
      } else if (obj.menuName == '加入企业') {
        newObj.imageClass = 'joinEnterprise'
      }
      leftNavData.push(newObj)
    }
    return leftNavData
  },
  gotoLeftNavLink: function (link) {
    window.location.href = link
  },
  getTopNavData: function (callback) {
    HttpService.get('auth/appMenus', {}, function (data) {
      callback(data.data)
    })
    /* var topNavData=[
        {
            title:"弹性计算",
            list:[{name:"云服务器 ECS",link:"#"},{name:"GPU 云服务器",link:"#"},{name:"GPU 云服务器",link:"#"},{name:"FPGA 云服务器",link:"#"},{name:"块储存",link:"#"},{name:"专有网络 VPC",link:"#"}
                ,{name:"负载均衡 SLB",link:"#"},{name:"高性能计算 HPC",link:"#"},{name:"弹性伸缩",link:"#"},{name:"资源编排",link:"#"}]
        },
        {
            title:"存储和CDN",
            list:[{name:"对象存储 OSS",link:"#"},{name:"块存储",link:"#"},{name:"文件存储 NAS",link:"#"},{name:"表格存储 TableStore",link:"#"},{name:"归档存储 OAS",link:"#"},{name:"云存储网关",link:"#"},
                {name:"闪电立方",link:"#"}]
        },
        {
            title:"安全解决方案",
            list:[{name:"等保合规安全解决方案",link:"#"},{name:"政务云安全解决方案",link:"#"},{name:"新零售安全解决方案",link:"#"},{name:"混合云态势感知解决方案",link:"#"},{name:"互联网金融安全解决方案",link:"#"},
                {name:"游戏安全解决方案",link:"#"},{name:"社交/媒体spam解决方案",link:"#"},{name:"移动App推广欺诈解决方案",link:"#"},{name:"企业预防勒索解决方案",link:"#"}]
        }
    ];
    return topNavData; */
  },
  getMenuId: function (name, data) {
    var menuId = null
    for (var i = 0; i < data.length; i++) {
      var obj = data[i]
      if (obj.menuName == name) {
        menuId = obj.menuId
        break
      }
    }
    return menuId
  },
  getPriviData: function (name, data) {
    for (let i = 0; i < data.length; i++) {
      const el = data[i]
      if (el.menuName === name) {
        return el.sublist
      }
    }
  }
}
