<template>
  <div>
         <announcementHeader></announcementHeader>
         <div class="announcementContent">
             <div class="contentList">
                 <div class="listTop"><span><i></i>公告列表 · 公告详情</span></div>
                 <div class="listmiddle">
                       <div class="title">{{noticeInfo.bulletin_name}}</div>
                       <div class="time">{{noticeInfo.release_time}}</div>
                 </div>
                 <div class="listbottom">
                  <pre> {{noticeInfo.bulletin_content}}</pre>
                 </div>
             </div>


         </div>
  </div>
</template>
<script>
import announcementHeader from './announcementHeader.vue'
import NoticeBox from "../../../publicJs/NoticeBoxService";
import userService from "../../../publicJs/userService.js";
import apiToken from "../../../publicJs/apiToken.js";
import apiClient from "../../../publicJs/ApiClient.js";
import LoadingBoxService from "../../../publicJs/LoadingBoxService.js";
import UserCookieService from "../../../publicJs/UserCookieService.js";
import UtilService from "../../../publicJs/UtilService.js";
import publicPathConfig from "../../../publicJs/publicPathConfig.js";
import appPublicJs from "../../common/public.js";
import TipBoxService from "../../../publicJs/TipBoxService.js";
import Util from '../../../publicJs/Util.js';
export default {
  data () {
    return {
      id: "",
      noticeInfo:[]
    }
  },
  	components: {
		announcementHeader
  },
  beforeCreate(){
     $('title').html("公共详情")
  },
  	mounted() {
      this.id = this.$route.query.id;
      this.getNoticeInfo();
     
		},
  methods: {
         	//公告管理
			getNoticeInfo() {
				var that = this;
				var myData = {
          id:that.id
				}
				apiClient.get(apiToken.newApi('pcapi/worktable/getNoticeInfo/'), myData, function(data) {
					if (appPublicJs.checkData(data.results.data)) {
                   console.info(data.results.data);
                 
              that.noticeInfo=data.results.data[0];
              if( that.noticeInfo.release_time != undefined &&  that.noticeInfo.release_time != '暂无') {
							 that.noticeInfo.release_time  = UtilService.formatDuring( that.noticeInfo.release_time , "yyyy-MM-dd")
						} else {
						    that.noticeInfo.release_time  = '暂无'
						}
           
					}else{
					
					}
				});
      },
  }
}
</script>
<style src="../../css/announcementDetail.css" scoped></style>
