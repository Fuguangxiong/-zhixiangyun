<template>
  <div class="publicContent">
    <div class="publicNav">
      <img class="hand" @click="toMain" src="">
      <!--<span class="arrows">></span>-->
      <span class="active">应用管理</span>
      <span class="arrows">></span>
      <span class="active">应用详情</span>
    </div>
    <div class="mode-div lanm-con">
        <div class="lam-tdl">
             <dl>
                <dd>
                   <i class="poden"></i>
                   <h2 :title="appData.app_name">{{appData.app_name||12331513}}</h2>
                    <p :title="appData.app_status_name">状态：{{appData.app_status_name}}</p>
                    <!--<p>标签：刑事侦查、户籍查询</p>-->
                    <p :title="appData.enterprise_name">归属：{{appData.enterprise_name}}</p>
                    <p :title="appData.user_name">上传人：{{appData.user_name}}</p>
                    </dd>
                        <dt class="info">
                            <h4>版本 {{appData.app_version}}</h4>
                            <p>当前版本</p>
                        </dt>
                        <dt class="info">
                            <h4>{{remoteCount}}</h4>
                            <p>应用调用次数</p>
                        </dt>
                        <dt class="info">
                            <h4>{{visitedCount}}</h4>
                            <p>历史访问次数</p>
                        </dt>
                        <dt class="noe">
                        <p >
                         <span v-for="(item,index) in buttons">
                            <button :class="item.className" @click="executeButton(item)">{{item.buttonText}}</button>
                        </span>
                        </p>
                       </dt>
                    </dl>
                </div>
                    <!--biaod-->
                    <div class="iformcon">
                        <div class="iftop"><span class="bpboerd">基本信息</span><div class="line"></div></div>
                        <div class="iformcon-con reg1">
                            <div class="time-x">
                                <span class="texet">服务名称:</span>
                                <span class="inputime ">
                                    {{appData.app_name}}
                                </span>
                            </div>
                            <div class="time-x">
                                <span class="texet">应用类型:</span>
                                <span class="inputime ">{{appData.app_type_name}}</span>
                            </div>
                            <div class="time-x">
                                <span class="texet">归属企业:</span>
                                <span class="inputime ">{{appData.enterprise_name}}</span>
                            </div>
                            <div class="time-x">
                                <span class="texet">版本号:</span>
                                <span class="inputime ">{{appData.app_version}}</span>
                            </div>
                            <div class="time-x">
                                <span class="texet">服务期限:</span>
                                <span class="inputime "><em class="ls">
                                {{appData.serverRangeTime}}</em></span>
                            </div>
                            <div class="time-x">
                                <span class="texet">服务介绍:</span>
                                <span class="inputime ">{{appData.app_remark}}</span>
                            </div>
                        </div>
                    </div>
                    <!--/biaodan-->
                    <!--biaod-->
                    <div class="iformcon">
                        <div class="iftop"><span class="bpboerd">应用上传</span><div class="line"></div></div>
                        <div class="iformcon-con reg1">
                            <div class="time-x">
                                <span class="texet">WAR包名称:</span>
                                <span class="inputime ">
                                     <em class="ls">{{appData.archiver.archiver_name}}</em>
                                </span>
                            </div>
                            <div class="time-x">
                                <span class="texet">WAR包大小:</span>
                                <span class="inputime ">
                                    <em class="ls">{{appData.archiver.archiver_size}} MB</em>
                                </span>
                            </div>
                            <div class="time-x">
                                <span class="texet">WAR包版本:</span>
                                <span class="inputime ">
                                     <em class="ls">{{appData.archiver.archiver_version}}</em>
                                </span>
                            </div>
                            <div class="time-x">
                                <span class="texet">应用入口:</span>
                                <span class="inputime ">
                                     <em class="ls">{{appData.archiver.context_path}}</em>
                                </span>
                            </div>
                        </div>
                    </div>
                    <!--/biaodan-->
                <!--biaod-->
                <div class="iformcon">
                    <div class="iftop"><span class="bpboerd">资源配置</span><div class="line"></div></div>
                    <div class="iformcon-con reg1">
                        <div class="time-x">
                            <span class="texet">CPU:</span>
                            <span class="inputime ">
                                     <em class="ls">{{appData.res.cpu}} 核</em>
                            </span>
                        </div>
                        <div class="time-x">
                            <span class="texet">内存:</span>
                            <span class="inputime ">
                                    <em class="ls">{{appData.res.memory}} GB</em>
                            </span>
                        </div>
                        <div class="time-x">
                            <span class="texet">硬盘大小:</span>
                            <span class="inputime ">
                                    <em class="ls">{{appData.res.disk}} GB</em>
                            </span>
                        </div>
                    </div>
                </div>
                <!--/biaodan-->
                <!--biaod-->
                <div class="iformcon">
                    <div class="iftop"><span class="bpboerd">网络配置</span><div class="line"></div></div>
                    <div class="iformcon-con reg1">
                        <div class="time-x" v-for="(item,index) in appData.port">
                            <span class="texet">端口号:</span><!-- {{index+1}} -->
                            <span class="inputime ">
                                  <em class="ls">{{item.docker_port}}</em>
                            </span>
                        </div>
                    </div>
                </div>
                 <!--/biaodan-->
                        <div class="buttnet">
                            <!-- <button class="determine" @click='confirm'>关闭</button> -->
                        </div>
            </div>

  </div>
</template>
<script>
  import apiToken from '../../../publicJs/apiToken.js'
  import apiClient from '../../../publicJs/ApiClient.js'
import TipBoxService from "../common/TipBoxService.js";
  import LoadingBoxService from '../../../publicJs/LoadingBoxService.js'
  export default{
    name: 'loadAppDetail',
    data(){
        return{
           appData:{//全部信息
                app_name:'',
                app_status:'',
                app_status_name:'',
                audit_status:'',
                enterprise_name:'',
                user_name:'',
                app_version:'',
                app_type_name:'',
                serverRangeTime:'',
                app_remark:'',
                port:'',
                archiver:{
                    archiver_name:'',
                    archiver_size:'',
                    archiver_version:'',
                    context_path:''
                },
                res:{
                   cpu:'',
                   memory:0,
                   disk:0
                }
           },
            remoteCount:0,
            visitedCount:0,
            fullOptionData:{
              //穷举所有所有中状态的情况
              statusTransfer: 
              [
            {approveStatus:"0",runStatus:"1",className:"notSubmit",buttonShow:"editShow,removeShow"},
            {approveStatus:"1",runStatus:"1",className:"notPass",buttonShow:"revokeShow"},
            {approveStatus:"2",runStatus:"1",className:"notPass",buttonShow:"editShow,removeShow"},
            {approveStatus:"3",runStatus:"2",className:"pass",buttonShow:"deployShow"},
            {approveStatus:"3",runStatus:"8",className:"pass",buttonShow:"cancelShow"},
            {approveStatus:"3",runStatus:"3",className:"pass",buttonShow:"start"},
            {approveStatus:"3",runStatus:"9",className:"pass",buttonShow:""},
            {approveStatus:"3",runStatus:"4",className:"pass",buttonShow:"maintenanceShow"},
            {approveStatus:"3",runStatus:"5",className:"pass",buttonShow:"shutdown,downShow"},
            {approveStatus:"3",runStatus:"10",className:"pass",buttonShow:""},
            {approveStatus:"3",runStatus:"6",className:"pass",buttonShow:"downShow"},
            {approveStatus:"3",runStatus:"7",className:"pass",buttonShow:"upShow,delShow"},
            {approveStatus:"3",runStatus:"11",className:"pass",buttonShow:""},
            {approveStatus:"3",runStatus:"0",className:"pass",buttonShow:""},
             ],
                buttonConst:
            [
            {key:"editShow",value:"编辑",className:"butonst"},
            {key:"removeShow",value:"删除",className:"butonstdelet"},
            {key:"delShow",value:"删除",className:"butonstdelet"},
            {key:"revokeShow",value:"撤销",className:"butonstdelet"},
            {key:"lookProcessShow",value:"查看流程",className:"butonst"},
            {key:"deployShow",value:"部署",className:"butonst"},
            {key:"cancelShow",value:"取消",className:"butonstdelet"},
            {key:"start",value:"启动",className:"butonst"},
            {key:"maintenanceShow",value:"维护",className:"butonst"},
            {key:"shutdown",value:"停止",className:"butonstdelet"},
            {key:"downShow",value:"下架",className:"butonstdelet"},
            {key:"upShow",value:"上架",className:"butonst"}
            ]
            },
            buttons:[],
			privilageName:'应用管理',
			listPrivelageButtons:[],
			listButtonPrivilageMapping:
			[
				{
                    "code": "edit",
					"code_alias":"editShow",
                },
                {
                    "code": "detail",
					"code_alias":"lookApprovalShow",
               
                },
                {
                    "code": "start",
					"code_alias":"switchShow",
                    
                },
                {
                    "code": "off",
					"code_alias":"downShow",
                    
                },
                {
                    "code": "on",
					"code_alias":"upShow",
                    
                },
                {
                    "code": "revoked",
					"code_alias":"revokeShow",
                    
                },
                {
                    "code": "protect",
					"code_alias":"maintenanceShow",
                   
                },
                {
                    "code": "deploy",
					"code_alias":"deployShow",
                    
                },
                {
                    "code": "cancle",
					"code_alias":"cancelShow",
                    
                },
                {
                    "code": "stop",
					"code_alias":"switchShow",
                    
                },
                {
                    "code": "delete",
					"code_alias":"removeShow",
                    
                }
		   ] 
        }
    },
    created()
    {
      var app_id = this.$route.query.id;
      this.getAppData(app_id);
     // this.getPrivilageByCondition();
    }
    ,
    methods:{
        getAppData(app_id){
            var that=this;
            var myData={id:app_id};
            apiClient.post('itsmApi/application/loadApp',myData,function(data){
              if(data.status == 200){
               that.appData = $.extend({},that.appData,data.results.data[0])
               console.log(that.appData)
               var statusMapping = data.results.appRunStatus;
               that.visitedCount = data.results.visitedCount;
               that.remoteCount = data.results.remoteCount;
               that.appData.app_status_name = statusMapping[that.appData.app_status];
                     that.getPrivilageByCondition();
              }
            });
        },
        toMain(){
            this.$router.push("appsManager")
        },
        /*confirm(){
            window.close();
        },*/
        showButtons(){
            let that = this;
            console.info("获取服务器端传输状态：",that.appData.audit_status,that.appData.app_status);
            if(that.appData.audit_status == null || that.appData.audit_status == undefined){
                return ;
            }
            if(that.appData.app_status == null || that.appData.app_status == undefined){
                return ;
            }
            that.fullOptionData.statusTransfer.forEach(function(v,i){
                var obj = v;
                if((v.approveStatus == that.appData.audit_status) && (v.runStatus == that.appData.app_status)){
                    console.info("匹配到了状态：",that.appData.audit_status,that.appData.app_status);
                    that.fullOptionData.buttonConst.forEach(function(v1,i){
                        var obj2 = v1;
                        if(obj.buttonShow.indexOf(",") > 0){
                          //console.info("多类匹配",obj.buttonShow);
                          var elements = obj.buttonShow.split(",");
                          elements.forEach(function(v2,i){
                            var element2 = v2;
                            if(element2 == obj2.key){
                                if(that.containsArray(element2))
							    {    
								    that.buttons.push(
									       {key:obj2.key,className:obj2.className,buttonText:obj2.value}
								    );
							    }
                            }
                          });
                        }
                        else {
                          if(obj2.key == obj.buttonShow){
                            console.info("单类匹配");
                            var element = v;
                            console.info("匹配到了类名",obj.buttonShow);
							if(that.containsArray(obj.buttonShow))
							{

                                that.buttons.push(
									{key:obj2.key,className:obj2.className,buttonText:obj2.value}
								);
                            }
						 }
                        }
                        console.log(that.buttons)
                    });
                }
            });
            LoadingBoxService.close();
            console.info("showbuttons执行结束");
        },
        executeButton(item){
            let that = this;
            console.info(item.key,"执行方法");
            LoadingBoxService.open("正在执行......");
            var param = {app_id:this.$route.query.id};
            var url = 'itsmApi/application/';
            var temp = item.key;
            if("downShow" == temp){
              url +='downApp';
            }
            else if("maintenanceShow" == temp){
              url +='maintainApp';

            }
            else if("editShow" == temp){
                LoadingBoxService.close();
                that.$router.push({name:'createApp',query:param});
                return ;
            }
            else if("revokeShow" == temp){
              url +='revokeApp';

            }
            else if("deployShow" == temp){
              url +='deployApp';

            }
            else if("upShow" == temp){
              url +='upApp';

            }
            else if("removeShow" == temp){
              url +='removeApp';
            }
            else if("delShow" == temp){
              url +='delApp';

            }
            else if("cancelShow" == temp){

            }
            else if("lookProcessShow" == temp){

            }
            else if("start" == temp){
                url+="startApp";
            }
            else if("shutdown" == temp){
                url+="stopApp";
            }
            apiClient.post(url,param,function(data){
              if(data.status == 200){
                that.buttons = [];
                if("removeShow" == temp){
                   window.close();     
                }else{
                    setTimeout(function(){
                        that.getAppData(that.$route.query.id);
                        //that.showButtons();
                        LoadingBoxService.close();
                        TipBoxService.open("执行成功",0);
                    },4000);
                }
              }
              else{
                LoadingBoxService.close();
                TipBoxService.open("执行失败",2);
              } 
           });
        },
		getPrivilageByCondition()
		{ 
			var that=this;
			apiClient.get('priviapi/auth/getAppDownMenuAndButton',{appId:'ServiceManger'},function(data){
                 console.info("获取权限数据信息:",data);
			     that.loadMenuResource(data.data);
            });
		},
		loadMenuResource(elementList)
		{
			let that = this;
			if(elementList != null && elementList.length != 0)
			{   
				for(var element in elementList){
					if(that.privilageName == elementList[element].menuName)
					{
						var dataResourceList = elementList[element].button;
						for(var element2 in dataResourceList)
						{  
                            var tmep = that.transferButtonAlias(dataResourceList[element2].code);
                            
                            if( tmep != null && tmep.length !=0 && tmep != "")
                            {   
                               console.info("已经放入：",tmep);
                               that.listPrivelageButtons.push(tmep);
                            }
						}
					}
				}
			}
            that.showButtons();
		},
   //转换为本地页面级别的按钮名称
    transferButtonAlias(element)
    {
      let that = this;
      for(var element1 in that.listButtonPrivilageMapping)
      { 
        if(element == that.listButtonPrivilageMapping[element1].code)
        { 
          return that.listButtonPrivilageMapping[element1].code_alias;
        }
      }
      return '';
    },
   //判断是否包含
    containsArray(element1){
      let that = this;
      console.info("分析按钮权限集合："+that.listPrivelageButtons);
      for(var element=0;element<that.listPrivelageButtons.length;element++)
      {         
        if(element1 == that.listPrivelageButtons[element])
        {
          return true;
        }
      }
      return false;
    },
    }
  }
</script>
<style src="../../css/common/public.css" scoped></style>
<style src="../../css/detailPage/loadAppDetail.css" scoped></style>