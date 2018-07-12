/**
 * Created by dell on 2018/1/8.
 */
import apiClient from './ApiClient'
import constants from './Constants'
import userService from './userService'
export default{
    link:function (callback) {
        var user=userService.getTokenId();
        if(user!=undefined && user!='null' && user!=null){
            var url='/user/'+user+'/message';
            apiClient.getWebsocket(constants.msgSocketServer+'/message/endpointMessage').debug(true).subscribe(url,function (msg) {
                callback(msg);
            });
        }
        else{
            console.info("用户没有登录,不能连接消息");
        }
    }
}