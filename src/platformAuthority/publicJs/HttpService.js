/**
 * Created by dell on 2017/8/18.
 */
import env from '../../../config/envConfig';
import user from '../../publicJs/userService'
export default{
    baseUrl:env.API_SERVER,
    getLink:function(url,data,callback){
        console.info("baseUrl=",this.baseUrl);
        var token=user.getTokenId();
        $.ajax({
            url: this.baseUrl + url ,
            type: 'get',
            data: data,
            headers: {'X-Auth-Token': token},
            success: function (data) {
                try{
                    callback(data);
                }catch(e){

                }
            },
            error:function (data) {
                if(data.status=='401'){
                    window.location.href='register.html';
                }
                else{
                	var returnStr=data.responseText;
                	var returnObj=JSON.parse(returnStr);
                    try{
                        callback(returnObj);
                    }catch(e){

                    }
                }
            }
        });
    },
    postLink:function (url,data,callback) {
        var token=user.getTokenId();
            $.ajax({
                url: this.baseUrl + url,
                type: 'post',
                data: data,
                headers: {'X-Auth-Token':token},
                success: function (data) {
                    try{
                        callback(data);
                    }catch(e){

                    }
                },
                error:function (data) {
                    console.info("vvvvvvvvvvvv=",data);
                    if(data.status=='401'){
                       window.location.href='register.html';
                    }
                    else{
                            var returnStr=data.responseText;
		                	var returnObj=JSON.parse(returnStr);
		                    try{
		                        callback(returnObj);
		                    }catch(e){
		
		                    }
                        }
                    }
            });
    },
    uploadFile:function (url,file,callback) {
        var fileUploadUrl=this.baseUrl;
        var formData=new FormData();
        formData.append("fileid",file);
        if(window.FormData) {
            var xhr = new XMLHttpRequest();
            xhr.open('POST',fileUploadUrl+url);
            xhr.setRequestHeader('X-Auth-Token', this.tokenId);
            xhr.onload=function () {
                if (xhr.status === 200) {
                    var obj=JSON.parse(xhr.response);
                    if(obj.status=="success")
                    {
                        callback(obj);
                    }
                }
                else {
                    LoadingBoxService.close();
                    TipBoxService('访问异常，请重试！');
                    console.info("访问异常错误信息=",data.msg);
                }
            }
            xhr.send(formData);
        }
        else
        {
            console.info("不支持H5文件上传");
        }
    }
}