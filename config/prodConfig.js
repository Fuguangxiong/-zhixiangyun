
/**
 * Created by dell on 2017/8/28.
 */
/*module.exports = {
     NODE_ENV: '"production"',
     //API_SERVER: 'http://60.247.77.144:7000/xtgaj',
    API_SERVER: 'http://192.168.182.142:9001/platform/priviapi/',
    PLATFORM_LOGIN_URL:'./register.html',
     //PLATFORM_LOGIN_URL: 'http://60.247.77.211:8089/platform/user?method=enterpriseLogin',
     PLATFORM_USER: 'http://192.168.182.142:9001/platform/priviapi/', //权限用户图片路径
     SERVICE_MANAGE :'http://192.168.182.142/sc',    //服务管理
     APP_MARKET:'http://192.168.182.142/mall',		  //应用市场
     PLATFORM_AUTHORITY:"http://192.168.182.142/bc",//部门管理，跳转时需要加tokenId
     RESOURCE_CATALOG:""
 }*/
/*module.exports = {
    NODE_ENV: '"production"',
    //API_SERVER: 'http://60.247.77.144:7000/xtgaj',
    API_SERVER: 'http://is-cloud.cn/manager/priviapi/',
    PLATFORM_LOGIN_URL:'./register.html',
    //PLATFORM_LOGIN_URL: 'http://60.247.77.211:8089/platform/user?method=enterpriseLogin',
    PLATFORM_USER: 'http://is-cloud.cn/manager/priviapi/', //权限用户图片路径
    SERVICE_MANAGE :'http://is-cloud.cn/sc',    //服务管理
    APP_MARKET:'http://is-cloud.cn/mall',		  //应用市场
    PLATFORM_AUTHORITY:"http://is-cloud.cn/bc",//部门管理，跳转时需要加tokenId
    RESOURCE_CATALOG:""
}*/
module.exports = {
    NODE_ENV: '"production"',
    API_SERVER: "http://192.168.182.142/platform/",
    PLATFORM_USER: "http://192.168.182.142/platform/priviapi/",
    PLATFORM_LOGIN_URL: "http://192.168.182.142/login",
    SERVICE_MANAGE: "http://192.168.182.142/sc",
    APP_MARKET: "http://192.168.182.142/mall/",
    RESOURCE_CATALOG: "http://192.168.182.142/rc/",
    PLATFORM: "http://192.168.182.142/bc",
    PLATFORM_AUTHORITY: "http://192.168.182.142/bc",
    RESOURCE_CATALOG:"",
    EXTERNAL_CONFIG_URL:"./envConfig/prodConfig.json"
}

// 测试环境打包配置
/**
 * Created by dell on 2017/8/28.
 */
/* module.exports = {
NODE_ENV: '"production"',
//  API_SERVER:'http://192.168.182.142:8070/iscloud-platforms-mains/',
    API_SERVER: 'http://192.168.182.142/platform/',//api

	PLATFORM_USER:'http://192.168.182.142/platform/priviapi/',  //权限用户图片路径
    PLATFORM_LOGIN_URL: 'http://192.168.182.142/login',
   	SERVICE_MANAGE :'http://192.168.182.142/sc',    //服务管理
    APP_MARKET:'http://192.168.182.142/mall/',		  //应用市场
    RESOURCE_CATALOG:"http://192.168.182.142/rc/", 			  //资源目录
    PLATFORM:'http://192.168.182.142/bc',				  //权限管理
    PLATFORM_AUTHORITY:"http://192.168.182.142/bc" //部门管理，跳转时需要加tokenId
} */
// is-cloud生产环境打包配置
/**
 * Created by dell on 2017/8/28.
 */
/*module.exports = {
  NODE_ENV: '"production"',
  API_SERVER: 'http://is-cloud.cn/manager/', // api
  PLATFORM_USER: 'http://is-cloud.cn/manager/priviapi/', // 权限用户图片路径
  PLATFORM_LOGIN_URL: 'http://is-cloud.cn/login',
  SERVICE_MANAGE: 'http://is-cloud.cn/sc', // 服务管理
  APP_MARKET: 'http://is-cloud.cn/mall', // 应用市场
  RESOURCE_CATALOG: 'http://is-cloud.cn/rc', // 资源目录
  PLATFORM: 'http://is-cloud.cn/bc', // 权限管理
  PLATFORM_AUTHORITY: 'http://is-cloud.cn/bc', // 部门管理，跳转时需要加tokenId
  EXTERNAL_CONFIG_URL: './envConfig/prodConfig.json'
}*/
// 邢台公安局打包部署
// module.exports = {
// NODE_ENV: '"production"',
//  API_SERVER: 'http://20.119.0.42:9001/platform/',//api
//	PLATFORM_USER:'http://20.119.0.42:9001/platform/priviapi/',  //权限用户图片路径
//  PLATFORM_LOGIN_URL: 'http://20.119.0.42:9001/platform/login',
// 	SERVICE_MANAGE :'http://20.119.0.42:9001/platform/sc',    //服务管理
//  APP_MARKET:'http://20.119.0.42:9001/platform/mall',		  //应用市场
//  RESOURCE_CATALOG:"http://20.119.0.42:9001/platform/rc", 			  //资源目录
//  PLATFORM:'http://20.119.0.42:9001/platform/bc',	  //权限管理
//  PLATFORM_AUTHORITY:"http://20.119.0.42:9001/platform/bc" //部门管理，跳转时需要加tokenId
// }

