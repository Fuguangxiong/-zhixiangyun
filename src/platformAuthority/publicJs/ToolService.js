/**
 * Created by dell on 2017/9/5.
 */
export default{
    getQueryString:function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return decodeURIComponent(r[2]);
        return null;
    },
    regMail:function(param){
    	var regMail = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;
		if(!regMail.test(param)){
			return false;
		}else{
			return true;
		}
    },
    regPhone:function(param){
    	var regPhone =  /^((0\d{2,3}-\d{7,8})|(1[35784]\d{9}))$/;
		if(!regPhone.test(param)){
			return false;
		}else{
			return true;
		}
    },
    regIDCard:function(param){
    	var regIDCard =/(^\d{15}$)|(^\d{17}([0-9]|X)$)/;
		if(!regIDCard.test(param)){
			return false;
		}else{
			return true;
		}
    },
    regUserName:function(param){
    	var regUserName =/^[\dA-Za-z\u4e00-\u9fa5]+$/;
    	if(!regUserName.test(param)){
			return false;
		}else{
			return true;
		}
    },
    trimStr:function(str){
    	return str.replace(/(^\s*)|(\s*$)/g,"");
    }
   
}
