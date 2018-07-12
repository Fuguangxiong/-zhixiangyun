/**
 * Created by dell on 2017/10/10.
 */
import publicPathConfig from '../../publicJs/publicPathConfig.js'

var cloud = 'http://is-cloud.cn'; //智享云
var appDetailsAddress = publicPathConfig.SERVICE_MANAGE + '/#/invoke';
var serviceImgShow = "/itsmApi/attachment/show?imgPath=";
var getUserImgPath = publicPathConfig.PLATFORM_USER;//获取图片请求路径
var randomString = function (len) {
　　var len = len || 32;
　　var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
　　var maxPos = $chars.length;
　　var pwd = '';
　　for (var i = 0; i < len; i++) {
　　　　pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
　　}
　　return pwd;
}
var checkLogin = function (tokenId){
	if(tokenId != "" && tokenId != "1c14f665aa8643c28f899aa9b0efee56" && tokenId != null && tokenId != undefined){
		return true;
	}
	return false;
}
var isArray = function (obj) {
  return Array.isArray(obj) || toString.call(obj) === '[object Array]'
}
var checkData = function (data){
	return isArray(data)&&data.length>0
}
/*
file=上传的文件
maxSize=文件限制的大小
 */
var checkfile=function(file,maxSize){
  var maxSize=maxSize*1024*1024;
  return file.size<maxSize
}
/*
拖拽
 */
var dragData=function(data){
  var id=[];
  var Order=[]
  for (var i = 0; i < data.length; i++) {
    if(data.sortOrder!=i+1){
      id.push(data[i].id);
      Order.push(i+1)
    }
  }
  return {
    "id": id.join(","),
    "sort_order":Order.join(",") ,
  };
}
export default {
  detailUrl:appDetailsAddress,
  randomString:randomString, //随机生成32位字符串
  checkLogin,
  checkData,
  checkfile,
  getUserImgPath,
  cloud,
  serviceImgShow,
  dragData
}
