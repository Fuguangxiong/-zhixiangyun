<template>
  <div>
         <announcementHeader></announcementHeader>
         <div class="announcementContent">
             <div class="contentList">
                 <div class="listTop"><span><i></i>公告列表</span></div>
                 <div class="listmiddle">
                     <ul>
                        <li v-for="(list,index) in annoucementList" @click="todetail(list.id)" >
                   
                        <div class="title"> <div class="newnotice" v-show="list.new=='true'"></div> {{list.bulletin_name.length>20?(list.bulletin_name.substring(0,20)+"……"):list.bulletin_name}}</div>
                        <div class="time">{{list.release_time}}</div>
                        </li> 
                        
                    </ul>
                 </div>
                 <div class="listbottom">
                <div class="block" v-show="noDataPage">
                <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page.sync="pageNum"
                :page-size="pageSize"
                layout="prev, pager, next, jumper"
                :total="pageTotal">
                </el-pagination>
        </div> 
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
import publicpath from "../../../publicJs/publicPathConfig.js";
export default {
  data () {
    return {
         tokenId:"",
         pageNum: 1,
         annoucementList:[],
         pageTotal: 1,//分页默认
         pageSize: 12,
         noDataPage:false,//少于一页分页不显示
    }
  },
    mounted(){
        
         this.getAnnoucement();
  },
  	components: {
		announcementHeader
    },
    beforeCreate(){
     $('title').html("公共列表")
    },
      created() {
      this.tokenId = this.$route.query.tokenId || userService.getTokenId();
		},
  methods: {
        todetail:function(id) {
        // this.$router.push({
        //   path: '/announcementDetail',
        //    query: {
        //     id:id
        //   }
        // })

          window.open(publicpath.PERSONAL_CONSOLE+'#/announcementDetail?tokenId='+this.tokenId+'&id='+id)
      },
       handleCurrentChange(val) {
            this.getAnnoucement();
        },
        handleSizeChange(val) {

        },
      	//公告管理
			getAnnoucement() {
                var that = this;
               
				var myData = {
					"pageNum": that.pageNum,
					"pageSize": that.pageSize,
				}
				apiClient.get(apiToken.newApi('pcapi/worktable/getNotice/'), myData, function(data) {
                   // data={"time":71,"exception":null,"status":200,"results":{"result":"success","total":13,"data":[{"created_time":1512552810389,"new":"false","posted_person":"鲁班七号","posted_id":"da09f4262c3c4a319a1274c199294912","stateName":null,"bulletin_content":"各位同事：\n  根据国务院办公厅节假日安排的通知精神，现将公司2017年国庆节和中秋节放假安排通知如下：\n  国庆节、中秋节：10月1日至8日放假调休，共8天。9月30日（星期六）上班。\n具体到各个分/子公司/部门的项目组，由项目经理和部门负责人根据项目实际情况综合考虑人员的放假安排和调休。请大家在放假前下班后务必防火断电，放假期间注意安全。\n在中秋佳节到来之际，公司为大家准备了精美的礼品，表达心意、传递祝福。\n预祝大家节日愉快！","bulletin_name":"中秋放假通知通知","bulletin_state":"1","id":"a4fed81e0b7e4aedbee507aa64e134dd","enterprise_id":"1c14f665aa8643c28f899aa9b0efee4b","esIndex":"operation","release_time":1512552810390},{"created_time":1512552742052,"new":"false","posted_person":"鲁班七号","posted_id":"da09f4262c3c4a319a1274c199294912","stateName":null,"bulletin_content":"潘何乔\n您好：\n神州泰岳信息化系统提醒您，您今天尚未完成日志信息的填写,请尽快完成,以免考勤出现错误 \n详细事宜请参考：http://60.247.77.186/ucas ","bulletin_name":"日志提醒通知","bulletin_state":"1","id":"0b5aeff5e4f64c3ab9b7e3f827d1c194","enterprise_id":"1c14f665aa8643c28f899aa9b0efee4b","esIndex":"operation","release_time":1512552742053},{"created_time":1512552546206,"new":"false","posted_person":"sa","posted_id":"1c14f665aa8643c28f899aa9b0efee55","stateName":null,"bulletin_content":"各位同事大家好：\n\n      近日，接到北京市朝阳区电力公司调度通知：本区域上级变电站电源出现故障，需要紧急抢修。\n故此定于2017年9月29日及2017年9月30日（22:00-22:30）对大厦的配电室进行倒闸断电","bulletin_name":"神州泰岳停电通知","bulletin_state":"1","id":"1c2fb1819b554576bc85f75f233addc2","enterprise_id":"1c14f665aa8643c28f899aa9b0efee4b","esIndex":"operation","release_time":1512552546206},{"created_time":1512552810389,"new":"false","posted_person":"鲁班七号","posted_id":"da09f4262c3c4a319a1274c199294912","stateName":null,"bulletin_content":"各位同事：\n  根据国务院办公厅节假日安排的通知精神，现将公司2017年国庆节和中秋节放假安排通知如下：\n  国庆节、中秋节：10月1日至8日放假调休，共8天。9月30日（星期六）上班。\n具体到各个分/子公司/部门的项目组，由项目经理和部门负责人根据项目实际情况综合考虑人员的放假安排和调休。请大家在放假前下班后务必防火断电，放假期间注意安全。\n在中秋佳节到来之际，公司为大家准备了精美的礼品，表达心意、传递祝福。\n预祝大家节日愉快！","bulletin_name":"中秋放假通知通知","bulletin_state":"1","id":"a4fed81e0b7e4aedbee507aa64e134dd","enterprise_id":"1c14f665aa8643c28f899aa9b0efee4b","esIndex":"operation","release_time":1512552810390},{"created_time":1512552810389,"new":"false","posted_person":"鲁班七号","posted_id":"da09f4262c3c4a319a1274c199294912","stateName":null,"bulletin_content":"各位同事：\n  根据国务院办公厅节假日安排的通知精神，现将公司2017年国庆节和中秋节放假安排通知如下：\n  国庆节、中秋节：10月1日至8日放假调休，共8天。9月30日（星期六）上班。\n具体到各个分/子公司/部门的项目组，由项目经理和部门负责人根据项目实际情况综合考虑人员的放假安排和调休。请大家在放假前下班后务必防火断电，放假期间注意安全。\n在中秋佳节到来之际，公司为大家准备了精美的礼品，表达心意、传递祝福。\n预祝大家节日愉快！","bulletin_name":"中秋放假通知通知","bulletin_state":"1","id":"a4fed81e0b7e4aedbee507aa64e134dd","enterprise_id":"1c14f665aa8643c28f899aa9b0efee4b","esIndex":"operation","release_time":1512552810390},{"created_time":1512552810389,"new":"false","posted_person":"鲁班七号","posted_id":"da09f4262c3c4a319a1274c199294912","stateName":null,"bulletin_content":"各位同事：\n  根据国务院办公厅节假日安排的通知精神，现将公司2017年国庆节和中秋节放假安排通知如下：\n  国庆节、中秋节：10月1日至8日放假调休，共8天。9月30日（星期六）上班。\n具体到各个分/子公司/部门的项目组，由项目经理和部门负责人根据项目实际情况综合考虑人员的放假安排和调休。请大家在放假前下班后务必防火断电，放假期间注意安全。\n在中秋佳节到来之际，公司为大家准备了精美的礼品，表达心意、传递祝福。\n预祝大家节日愉快！","bulletin_name":"中秋放假通知通知","bulletin_state":"1","id":"a4fed81e0b7e4aedbee507aa64e134dd","enterprise_id":"1c14f665aa8643c28f899aa9b0efee4b","esIndex":"operation","release_time":1512552810390},{"created_time":1512552810389,"new":"false","posted_person":"鲁班七号","posted_id":"da09f4262c3c4a319a1274c199294912","stateName":null,"bulletin_content":"各位同事：\n  根据国务院办公厅节假日安排的通知精神，现将公司2017年国庆节和中秋节放假安排通知如下：\n  国庆节、中秋节：10月1日至8日放假调休，共8天。9月30日（星期六）上班。\n具体到各个分/子公司/部门的项目组，由项目经理和部门负责人根据项目实际情况综合考虑人员的放假安排和调休。请大家在放假前下班后务必防火断电，放假期间注意安全。\n在中秋佳节到来之际，公司为大家准备了精美的礼品，表达心意、传递祝福。\n预祝大家节日愉快！","bulletin_name":"中秋放假通知通知","bulletin_state":"1","id":"a4fed81e0b7e4aedbee507aa64e134dd","enterprise_id":"1c14f665aa8643c28f899aa9b0efee4b","esIndex":"operation","release_time":1512552810390},{"created_time":1512552810389,"new":"false","posted_person":"鲁班七号","posted_id":"da09f4262c3c4a319a1274c199294912","stateName":null,"bulletin_content":"各位同事：\n  根据国务院办公厅节假日安排的通知精神，现将公司2017年国庆节和中秋节放假安排通知如下：\n  国庆节、中秋节：10月1日至8日放假调休，共8天。9月30日（星期六）上班。\n具体到各个分/子公司/部门的项目组，由项目经理和部门负责人根据项目实际情况综合考虑人员的放假安排和调休。请大家在放假前下班后务必防火断电，放假期间注意安全。\n在中秋佳节到来之际，公司为大家准备了精美的礼品，表达心意、传递祝福。\n预祝大家节日愉快！","bulletin_name":"中秋放假通知通知","bulletin_state":"1","id":"a4fed81e0b7e4aedbee507aa64e134dd","enterprise_id":"1c14f665aa8643c28f899aa9b0efee4b","esIndex":"operation","release_time":1512552810390},{"created_time":1512552810389,"new":"false","posted_person":"鲁班七号","posted_id":"da09f4262c3c4a319a1274c199294912","stateName":null,"bulletin_content":"各位同事：\n  根据国务院办公厅节假日安排的通知精神，现将公司2017年国庆节和中秋节放假安排通知如下：\n  国庆节、中秋节：10月1日至8日放假调休，共8天。9月30日（星期六）上班。\n具体到各个分/子公司/部门的项目组，由项目经理和部门负责人根据项目实际情况综合考虑人员的放假安排和调休。请大家在放假前下班后务必防火断电，放假期间注意安全。\n在中秋佳节到来之际，公司为大家准备了精美的礼品，表达心意、传递祝福。\n预祝大家节日愉快！","bulletin_name":"中秋放假通知通知","bulletin_state":"1","id":"a4fed81e0b7e4aedbee507aa64e134dd","enterprise_id":"1c14f665aa8643c28f899aa9b0efee4b","esIndex":"operation","release_time":1512552810390},{"created_time":1512552810389,"new":"false","posted_person":"鲁班七号","posted_id":"da09f4262c3c4a319a1274c199294912","stateName":null,"bulletin_content":"各位同事：\n  根据国务院办公厅节假日安排的通知精神，现将公司2017年国庆节和中秋节放假安排通知如下：\n  国庆节、中秋节：10月1日至8日放假调休，共8天。9月30日（星期六）上班。\n具体到各个分/子公司/部门的项目组，由项目经理和部门负责人根据项目实际情况综合考虑人员的放假安排和调休。请大家在放假前下班后务必防火断电，放假期间注意安全。\n在中秋佳节到来之际，公司为大家准备了精美的礼品，表达心意、传递祝福。\n预祝大家节日愉快！","bulletin_name":"中秋放假通知通知","bulletin_state":"1","id":"a4fed81e0b7e4aedbee507aa64e134dd","enterprise_id":"1c14f665aa8643c28f899aa9b0efee4b","esIndex":"operation","release_time":1512552810390},{"created_time":1512552810389,"new":"false","posted_person":"鲁班七号","posted_id":"da09f4262c3c4a319a1274c199294912","stateName":null,"bulletin_content":"各位同事：\n  根据国务院办公厅节假日安排的通知精神，现将公司2017年国庆节和中秋节放假安排通知如下：\n  国庆节、中秋节：10月1日至8日放假调休，共8天。9月30日（星期六）上班。\n具体到各个分/子公司/部门的项目组，由项目经理和部门负责人根据项目实际情况综合考虑人员的放假安排和调休。请大家在放假前下班后务必防火断电，放假期间注意安全。\n在中秋佳节到来之际，公司为大家准备了精美的礼品，表达心意、传递祝福。\n预祝大家节日愉快！","bulletin_name":"中秋放假通知通知","bulletin_state":"1","id":"a4fed81e0b7e4aedbee507aa64e134dd","enterprise_id":"1c14f665aa8643c28f899aa9b0efee4b","esIndex":"operation","release_time":1512552810390},{"created_time":1512552810389,"new":"false","posted_person":"鲁班七号","posted_id":"da09f4262c3c4a319a1274c199294912","stateName":null,"bulletin_content":"各位同事：\n  根据国务院办公厅节假日安排的通知精神，现将公司2017年国庆节和中秋节放假安排通知如下：\n  国庆节、中秋节：10月1日至8日放假调休，共8天。9月30日（星期六）上班。\n具体到各个分/子公司/部门的项目组，由项目经理和部门负责人根据项目实际情况综合考虑人员的放假安排和调休。请大家在放假前下班后务必防火断电，放假期间注意安全。\n在中秋佳节到来之际，公司为大家准备了精美的礼品，表达心意、传递祝福。\n预祝大家节日愉快！","bulletin_name":"中秋放假通知通知","bulletin_state":"1","id":"a4fed81e0b7e4aedbee507aa64e134dd","enterprise_id":"1c14f665aa8643c28f899aa9b0efee4b","esIndex":"operation","release_time":1512552810390},{"created_time":1512552810389,"new":"false","posted_person":"鲁班七号","posted_id":"da09f4262c3c4a319a1274c199294912","stateName":null,"bulletin_content":"各位同事：\n  根据国务院办公厅节假日安排的通知精神，现将公司2017年国庆节和中秋节放假安排通知如下：\n  国庆节、中秋节：10月1日至8日放假调休，共8天。9月30日（星期六）上班。\n具体到各个分/子公司/部门的项目组，由项目经理和部门负责人根据项目实际情况综合考虑人员的放假安排和调休。请大家在放假前下班后务必防火断电，放假期间注意安全。\n在中秋佳节到来之际，公司为大家准备了精美的礼品，表达心意、传递祝福。\n预祝大家节日愉快！","bulletin_name":"中秋放假通知通知","bulletin_state":"1","id":"a4fed81e0b7e4aedbee507aa64e134dd","enterprise_id":"1c14f665aa8643c28f899aa9b0efee4b","esIndex":"operation","release_time":1512552810390}],"innerHis":[]}}
					if (appPublicJs.checkData(data.results.data)) {

                        that.pageTotal = data.results.total;
                        var datalist = data.results.data;
                         
                        for(var i=0;i<datalist.length;i++){
                            if(datalist[i].release_time != undefined && datalist[i].release_time != '暂无') {
                                        datalist[i].release_time  = UtilService.formatDuring(datalist[i].release_time , "yyyy-MM-dd HH:mm:ss")
                                    } else {
                                        datalist[i].release_time  = '暂无'
                                    }
                        }
                        that.annoucementList=datalist;
					}else{
					
                    }
                     // 判断如果内容长度小于一页不显示分页
                 if( that.pageSize >= data.results.total){
                        that.noDataPage = false;
                    }else{
                        that.noDataPage = true;
                    }
				});
      },
  }
}
</script>
<style src="../../css/announcementList.css" scoped></style>
