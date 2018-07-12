/**
 * Created by dell on 2017/10/25.
 */
import userService from '../../publicJs/userService';
import HttpService from '../../publicJs/ApiClient';
export default{
    setUser:function (tokenId,callback) {
        userService.storeInfo("tokenId",tokenId);
        HttpService.get('token/getUserByToken',{param:''},function(data){
            console.info("tokenIdData=",data);
            userService.storeInfo("username",data.data.userInfo.userName);
            var userImg="";
            if(data.data.userInfo.enterpriseid[0].IMAGE!="" && data.data.userInfo.enterpriseid[0].IMAGE!=undefined){
                userImg=HttpService.apiBaseUrl+data.data.userInfo.enterpriseid[0].IMAGE;
            }
            userService.storeInfo("image",userImg);
            //that.publicTopUserChange++;
            sessionStorage.menuName = JSON.stringify(data.data.userInfo.menuName);
            callback();
        });
    }
}