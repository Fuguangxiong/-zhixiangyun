<template>
  <div class="applyServerContent">
        <!-- 主题内容菜单 -->
            <div class="w1200">
            <div class="applyServerNav">
             <span class="headerTip"></span> <span class="active">服务管理</span>
              <span class="active">· 服务详情</span>
              <div class="topbtnContainer">
              </div>
            </div>
            <div class="servermode-div lanm-con">
                 <!--服务详情 -->
                <div class="basicInformation">
                    <div class="serverdetail"> 
                        <img :src="successUrl1" alt="">
                        <div class="servertitle">
                          <span class="servicename">{{service_name}}</span> <span class="serverstate">({{service_status}})</span>
                            <ul class="basicul">
                                <li>标签：{{service_tag}}</li>
                                <li>类型：{{apptype}}</li>
                                <li>创建者：</li>
                            </ul>
                        </div>
                    </div>
                    <div class="callInformation">
                       <div >
                           <div class="calldetail"><span class="callnum">{{visit_num}}</span><span class="calltitle">调用次数</span></div>
                           <div class="calldetail"><span class="callnum">{{click_num}}</span><span class="calltitle">累计用户量</span></div>
                           <div class="calldetail"><span class="callnum">{{user_num}}</span><span class="calltitle">浏览量</span></div>
                       </div>
                           <div class="calloperate">
                           <div class="caozuo">  <i  class="icon iconfont icon-xiangqing2" ></i> </div> 
                            <ul class="modifyDeleteUl" >
                                <!-- 'test 测试 icon-ceshi','delete删除 icon-3', 'stop 停用 icon-suo', 'down下架 icon-unshelve','up 上架 icon-shelve ','start 开始 icon-able','rule计费规则 icon-xuefeishoujiaotongji' , 'usable可见性 icon-kejian1',
                                 'blind 屏蔽 icon-pingbi', 'viewApplyRegist 查看申请 icon-chakanshenqing'，'modify 修改 icon-bianji2'，'viewReason查看原因 icon-zl_yuanyin' -->
                                   <li  v-for="item in tuobj" class="modifyDeleteLi"><div><i  class="icon iconfont" :class=item @click="onClickLable(item,datalist)"></i> 
                                   <span class="calltitle" v-show="item=='icon-chakanshenqing'">查看申请</span>
                                   <span class="calltitle" v-show="item=='icon-bianji2'">编辑</span>
                                   <span class="calltitle" v-show="item=='icon-zl_yuanyin'">查看原因</span>
                                   <span class="calltitle" v-show="item=='icon-shelve'">申请上架</span>
                                   <span class="calltitle" v-show="item=='icon-unshelve'">申请下架</span>
                                   <span class="calltitle" v-show="item=='icon-able'">启用</span>
                                   <span class="calltitle" v-show="item=='icon-3'">删除</span>
                                   <span class="calltitle" v-show="item=='icon-pingbi'">屏蔽设置</span>
                                   <span class="calltitle" v-show="item=='icon-suo'">停用</span>
                                   <span class="calltitle" v-show="item=='icon-xuefeishoujiaotongji'">计费规则</span>
                                   <span class="calltitle" v-show="item=='icon-kejian1'">可见设置</span>
                                   <span class="calltitle" v-show="item=='icon-ceshi'">测试</span>
                                   <!-- <span class="calltitle" v-show="item=='icon-bianji2'">变更</span>
                                   <span class="calltitle" v-show="item=='icon-bianji2'">撤销</span> -->
                                   </div>
                                 
                                    </li>
                                  
                            </ul>
                            
                       </div>
                    </div>
                </div>
                 <!--基础信息 -->
                <div class="serviceInformation">
                    <div class="contenttitle"><span><i class="icon iconfont icon-jichuxinxiguanli-copy"></i>基础信息</span> <i @click="shouqi('isup')" class="icon iconfont iconright " :class="{'icon-arrow-down-copy':isup,'icon-arrow-down':!isup}"></i></div>
                     <ul v-show="isup">
                         <li><span class="titlewigth">服务名称：</span>{{service_name}}</li>
                         <li><span class="titlewigth">服务期限：</span>{{startdata|dataFormat}} 至  {{enddata|dataFormat}}</li>
                         <li><span class="titlewigth">服务简介：</span>{{service_remark}}</li>
                         <li><span class="titlewigth">服务介绍：</span><span>{{service_remark}}</span></li>
                     </ul>
                </div>
              
                 <!--图片设置 -->
                <div class="imgRequest">
                     <div class="contenttitle"><span><i class="icon iconfont icon-tupian2"></i>图片配置</span> <i @click="shouqi('isup2')" class="icon iconfont iconright " :class="{'icon-arrow-down-copy':isup2,'icon-arrow-down':!isup2}"></i></div>
                     <div class="imgRequestdiv" v-show="isup2">
                     <div class="logoImg">
                         <img :src="successUrl1" alt="">
                         <div class="logoImgName">
                         <span>logo</span>
                         </div>
                    </div>
                    <div class="bgImg">
                        <img :src="successUrl2" alt="">
                        <div class="bgImgName">
                        <span>背景图</span>
                        </div>
                    </div>
                     </div>
                </div>
                <!--拓扑图 -->
                <div class="pageRequest">
                      <div class="contenttitle"><span><i class="icon iconfont icon-yuanxingtuopu"></i>拓扑搭建</span> <i @click="shouqi('isup3')" class="icon iconfont iconright " :class="{'icon-arrow-down-copy':isup3,'icon-arrow-down':!isup3}"></i></div>
                       <div class="pageRequestContent" v-show="isup3">
                        	<div id="container"></div>
                       </div>
                </div>
                <!--页面详情 -->
                <div class="pageRequest">
                      <div class="contenttitle"><span><i class="icon iconfont icon-yuanxingtuopu"></i>页面详情</span> <i @click="shouqi('isup7')" class="icon iconfont iconright " :class="{'icon-arrow-down-copy':isup7,'icon-arrow-down':!isup7}"></i></div>
                     	
						 <div class="pageRequestContent" v-show="isup7">
                        	<SevPageShow :id='id'></SevPageShow>
                       </div>
                </div>

                   <!--可见性配置 -->
                <div class="pageRequest">
                      <div class="contenttitle"><span><i class="icon iconfont icon-kejian"></i>可见性配置</span><i @click="shouqi('isup4')" class="icon iconfont iconright" :class="{'icon-arrow-down-copy':isup4,'icon-arrow-down':!isup4}"></i></div>
                       <div class="pageRequestContent"  v-show="isup4">
                         <div><span class="titlewigth">可见范围:</span>{{uablelable}}</div>
                         <div v-show="!uableall" class="fanwei"><span v-for="item in personaluable">  <i  class="icon iconfont icon-yonghu2"></i>{{item.USERNAME}} </span> 
                         <span v-for="item in enterbind"><i  class="icon iconfont icon-qiye"></i>{{item.NAME}} </span></div>
                         
                       </div>
                </div>
                 <!--屏蔽性配置 -->
                <div class="pageRequest">
                      <div class="contenttitle"><span><i class="icon iconfont icon-jianhao1"></i>屏蔽性配置</span><i @click="shouqi('isup5')" class="icon iconfont iconright" :class="{'icon-arrow-down-copy':isup5,'icon-arrow-down':!isup5}"></i></div>
                      <div class="pageRequestContent" v-show="isup5">
                         <div><span class="titlewigth">屏蔽范围:</span>{{bindlable}}</div>
                         <div class="fanwei" v-show="!bindall"><span v-for="item in personalbind"><i  class="icon iconfont icon-yonghu2"></i>{{item.USERNAME}}</span>
                         <span v-for="item in enterbind"><i  class="icon iconfont icon-qiye"></i>{{item.NAME}} </span></div>
                         </div>
                 </div>
               
                 <!--计费方案 -->
                <div class="dataRequest">
                      <div class="contenttitle"><span><i class="icon iconfont icon-xiangqing1"></i>计费方案</span><i @click="shouqi('isup6')" class="icon iconfont iconright" :class="{'icon-arrow-down-copy':isup6,'icon-arrow-down':!isup6}"></i></div>
                      <div class="dateRequestContent topmargin" v-show="isup6"   v-for="(item,index) in billlist">
                            <div class="billname">{{index}}: </div>
                           <div class="billlist" >
                                 <div class="billdetail" v-for="tem in item">
                                    <img src="../../images/yfb.jpg" class="image">
                                    <div class="plan-con">
                                        <div class="scheme-con-num">
                                        <time class="time">{{tem.restrict_type}}{{tem.restrict_num}}次</time>
                                        </div>
                                        <span class="plan-con-name">{{tem.scheme_name}}</span>
                                    </div>
                                    <span v-if="tem.is_fee==1" class="scheme-con-tag">收费</span>
                                    <span v-else class="scheme-con-tag">免费</span>
                                 </div>
                           </div>
                         
                      </div>
                         
                      
                </div>

           
            </div>
            </div>
      
    
    <!-- /主题内容菜单 end -->
      


    </div>
</template>
<script>
  import UtilService from "../../../publicJs/UtilService.js";
  import apiToken from '../../../publicJs/apiToken.js'
  import apiClient from '../../../publicJs/ApiClient.js'
import TipBoxService from "../common/TipBoxService.js";
  import LoadingBoxService from '../../../publicJs/LoadingBoxService.js'
  import NoticeBoxService from '../../../publicJs/NoticeBoxService.js'
  import Util from '../../../publicJs/Util'
  import SevPageShow from './sevPageShow.vue'
  import auditExchange from "./auditExchange.vue";
  import commonFunc from "../common/commonFunc.js";
  export default{
    name: 'applyServerDeatil',
    data(){
        return{ 
         	fullHeight: document.documentElement.clientHeight, //浏览器可视高度
				id:"",//服务id
				isFullDisclosure: true,
				isTermDisclosure: false,
				service_tag: [],//服务标签
				service_remark: "",//服务介绍
				open_type: "",//服务是否公开
				service_name: "",//服务名称
				successUrl1: "", //logo图片全路径
				successUrl2: "", //背景图片全路径
				loginname :"",//登录名
				truename:"",//  申请人  
				deptname:"",// 部门名称 
				phone:"",// 联系电话
				apply_time:"",//申请时间
				enterprisename:"",//单位
				applyInfo:[],
				isShow:true,
				isShow1:true,
				approval_workflow:0,
				approval_batchNo:0,
				user_id:'',
				enterprise_id:'',
                belongType:'' ,
                apptype:'',//应用类型
                service_status:'',//服务状态
                butStyle:'',//启用停用按钮的颜色
                startAndStop:'',//启用  停用
                startAndStopBut:'',//启用  停用按钮显示
                audit_status:'',//审核状态
                startdata:"",//服务开始日期
                enddata:"",//服务结束日期
                visit_num:'',//浏览量
                user_num:"",//累计用户量
                click_num:'',//调用次数
                isup:true,//下拉
                isup1:true,//下拉
                isup2:true,//下拉
                isup3:true,//下拉
                isup4:true,//下拉
                isup5:true,//下拉
				isup6:true,//下拉
				isup7:true,//下拉
                isup8:true,//下拉
				billname:[],//方案名称 
				billlist:{}, //方案列表
				tuobj:[],
				lable:'',
				uableall:'',//可见性
				uablelable:'',//可见性名称
				personaluable:[],//部分人员可见性
				enteruable:[],//部分企业可见性
				personalbind:[],//部分人员屏蔽性
				enterbind:[],//部分企业屏蔽性
				bindlable:"",
				bindall:"",
				billlistshow:true,//是否显示计费方案
				showuable:true,//是否显示可见性
				showbind:true,//是否显示屏蔽性
				datalist:"",

        }
    },
    filters: {
            dataFormat: function(value) {
            return UtilService.formatDuring(value,"yyyy-MM-dd")
            }
    },
     created(){
      this.id=this.$route.query.id;
    },
   	components : {
			 SevPageShow,
			 auditExchange,
        	
        },
        mounted() {
			this.getbind();//查询屏蔽性
           this.getuable();//查询可见性
			this.instance = jsPlumb.getInstance({
				DragOptions: { cursor: "pointer", zIndex: 2000 },
				ConnectionOverlays: [
						[ "Arrow", {
						    location: 1,
						    visible:true,
						    width:11,
						    length:11,
						    direction:1,
						    id:"arrow_forwards"
						} ],
			            [ "Label", {
			                location: 0.5,
			                id: "label",
			                cssClass: "aLabel"
			            }]
			        ],
				Container: "container"
			});
			this.instance.importDefaults({
				 ConnectionsDetachable:true,
				 ReattachConnections:true
			});
			
			this.id = this.$route.query.id;
			this.getData();
		},
    methods:{
         shouqi(type){
            if(type=='isup'){ this.isup=!this.isup;}
            if(type=='isup1'){ this.isup1=!this.isup1;}
            if(type=='isup2'){ this.isup2=!this.isup2;}
            if(type=='isup3'){ this.isup3=!this.isup3;}
            if(type=='isup4'){ this.isup4=!this.isup4;}
            if(type=='isup5'){ this.isup5=!this.isup5;}
            if(type=='isup6'){ this.isup6=!this.isup6;}
        },
        getData() {
				let that = this,param;
				param = that.$route.query.id
				param = {
					id: param
				}
				apiClient.post('itsmApi/combination/findCombinationServiceDetail',param,function(data){
					var data = data.results.data;
					that.datalist=data
					console.log("dasdasdas",data)
					if(data.audit_status != "1"){
						that.isShow1 = false;
						that.isShow = true;
					}else{
						that.isShow1 = true;
						that.isShow = false;
                    }
                    that.startdata=data.service_start_time;
                     that.enddata=data.service_end_time;
                    //服务类型
                    if(data.apptype == 1){
                         that.apptype = '远程服务';
                    }else if(data.apptype == 3){
                         that.apptype  = '远程服务';
                     }
                      //调用次数
                     that.visit_num=data.visit_num;
                          if(that.visit_num == undefined){
                             that.visit_num = '0';
                          }
                    that.user_num=data.user_num;
                        if(that.user_num == undefined){
                        that.user_num = '0';
                        }
                    that.click_num=data.click_num;
                        if(that.click_num == undefined){
                        that.click_num = '0';
                        }
                     that.service_status=data.service_status;
                        if(that.service_status == "正常"){
                        that.startAndStopBut = '停用';
                        that.startAndStop = '关闭';
                        that.butStyle = 'butonstdelet';
                        }else if(that.service_status == "关闭"){
                        that.startAndStopBut = '启用';
                        that.startAndStop = '正常';
                        that.butStyle = 'butonst';
                    }
					that.service_name = data.name;
					that.service_tag = data.service_tag.toString();
					that.service_remark = data.service_remark;
					that.open_type = data.open_type;
					that.loginname = data.loginname;
					that.truename = data.truename;
					that.deptname = data.deptname;
					that.phone = data.phone;
					that.approval_workflow = data.approval_workflow;
					that.approval_batchNo = data.approval_batchNo
					that.service_end_time = data.service_end_time;
					that.service_start_time = data.service_start_time;
					that.user_id = data.user_id;
					that.enterprise_id = data.enterprise_id;
					that.belongType = data.belong_type;
					that.enterprisename = data.enterprisename;
					that.apply_time = data.apply_time;
					that.successUrl1 = apiClient.apiBaseUrl + '/itsmApi/attachment/show?imgPath=' + data.img + "&token=" + apiClient.token;
					that.successUrl2 = apiClient.apiBaseUrl + '/itsmApi/attachment/show?imgPath=' + data.bg_img + "&token=" + apiClient.token;
					if(data.combination_data_config != undefined || data.combination_data_config != '') {
						data.combination_data_config.block = JSON.parse(data.combination_data_config.block)
						data.combination_data_config.connects = JSON.parse(data.combination_data_config.connects)
						that.loadChartByJSON(JSON.stringify(data.combination_data_config))
					}
					that.getApprovalInfo();
					 //计划方案
            if(data.bill_rules != undefined){
               that.billlist=data.bill_rules[0];
               that.billlistshow=true;
               }else{
                 that.billlistshow=false;
               }
            //操作按钮
            that.tuobj= that.addSeniorBtns(data).seniorBtns
            LoadingBoxService.close()
				});
			},
			submitApply(param){
				var myData = {};
				var that = this;
				myData = {
					"serviceId":this.id,
					"auditParam":param
				}
				myData.auditParam.approval_workflow = that.approval_workflow
				console.log(myData)
				var that = this;
				LoadingBoxService.open("正在处理....")
				apiClient.post("itsmApi/atomicService/auditAtomic", myData, function(data) {
					LoadingBoxService.close();
					if(data.status == 200){
						that.getApprovalInfo();
					}
				});
			},
			getApprovalInfo(){
			var myData = {
                        belongType:this.belongType, 
                        appSubjectIdl : this.id,
                        approvalType:"2",
                        enterpriseId:this.enterprise_id,
                        applyUserId:this.user_id,
                        batchNo:this.approval_batchNo
					};
			var that = this;

			apiClient.post("itsmApi/applyInfo/loadAuditFlowInfo", myData, function(data) {
					if(data.status == 200){
						that.applyInfo = data.results.data;
					}
				});
			},
			format(time, format){
				var t = new Date(time);
				var tf = function(i){return (i < 10 ? '0' : '') + i};
				return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function(a){
					switch(a){
						case 'yyyy':
							return tf(t.getFullYear());
							break;
						case 'MM':
							return tf(t.getMonth() + 1);
							break;
						case 'mm':
							return tf(t.getMinutes());
							break;
						case 'dd':
							return tf(t.getDate());
							break;
						case 'HH':
							return tf(t.getHours());
							break;
						case 'ss':
							return tf(t.getSeconds());
							break;
					}
				})
			},
			loadChartByJSON(data) {
				var unpack = JSON.parse(data);
				if(!unpack) {
					return false;
				}
				var flowConnector = {
					anchors: ["BottomCenter", "TopCenter"],
					endpoints: ["dot", "blank"]
				};
				for(var i = 0; i < unpack['block'].length; i++) {
					var BlockId = unpack['block'][i]['BlockId'];
					var BlockContent = unpack['block'][i]['BlockContent'];
					var BlockX = unpack['block'][i]['BlockX'];
					var BlockY = unpack['block'][i]['BlockY'];
					var width = unpack['block'][i]['BlockWidth'];
					var height = unpack['block'][i]['BlockHeight'];
					var blockAttr = BlockId.split('-')[0];
					var html = '<div id="' + BlockId + '" class="nodeDiv" style="border: 1px #d5d5d5 solid;width: 100px;height: 100px;position: absolute;left: 40%;top: 50px;border-radius: 3px;background: rgb(255, 255, 255) !important">' +
//						'<i class="dle" style="position: absolute;width: 18px;height: 18px;right: 2px;top: 2px;border-radius: 50%;border: 1px #c9c9c9 solid;text-align: center;line-height: 18px;color: #999;">X</i>' +
						'<dl style="text-align: center;padding-top: 16px;">' +
						'<dd><img src="" alt="" style="width: 42px;height: 42px;border-radius: 3px;border: 1px #d3d3d3 solid;"></dd>' +
						'<dt class="serverName" style="font-size: 14px;margin-top: 5px;" title="' +BlockContent + '">' + BlockContent + '</dt>' +
						'</dl>' +
						'</div>';
					$('#container').append(html);
					$("#" + BlockId)
						.css("left", BlockX)
						.css("top", BlockY)
						.css("position", "absolute")
						.css("margin", "0px")
						.css("width", width)
						.css("height", height)
				}
				for(i = 0; i < unpack['connects'].length; i++) {
					var ConnectionId = unpack['connects'][i]['ConnectionId'];
					var PageSourceId = unpack['connects'][i]['PageSourceId'];
					var PageTargetId = unpack['connects'][i]['PageTargetId'];
					this.instance.connect({
						source: PageSourceId,
						target: PageTargetId,
						anchors: ["Right", "Left"],
						endpoint: ["Dot", {
							radius: 2
						}],
						paintStyle: {
							strokeWidth: 1,
							stroke: 'rgb(68, 85, 102)',
							strokeStyle: "rgb(0,32,80)",
							fillStyle: "rgb(0,32,80)",
							opacity: 0.5,
							radius: 2,
							lineWidth: 2,
							outlineWidth: 2
						}, //端点的色彩样式
						connector: ["Flowchart", {
							stub: 30,
							gap: 0,
							coenerRadius: 0,
							alwaysRespectStubs: true,
							midpoint: 0.5
						}],
						overlays: [
							["Arrow", {
								location: 1,
								visible: true,
								width: 11,
								length: 11,
								direction: 1
							}]
						]
					});
				}
			},	
			closeDetail(){
//				 window.open("","_self").close();
				 window.close();
			},
			  onClickLable(item,datalist){
               let vm = this;
             commonFunc.onClickLable(vm,item,datalist);
      },
      //屏蔽性
      getbind(){
        var that = this;
				var myData = {
					dataId: this.id,
          visibility_type: 2,
          visibility_set_catagory:2
				}
				apiClient.post('itsmApi/outterVisible/outters', myData, function(data) {
          if(data.results.visibilityLevel==1){
              that.bindall=true;
              that.bindlable="全部可见"
          }else if(data.results.visibilityLevel==2){
              that.bindall=false;
              that.bindlable="部分可见"
              that.personalbind=data.results.personal;//人员
              that.enterbind=data.results.enterprise;//企业
          }else{
             that.showbind=false;
          }
				});
      },
      //可见性
      getuable(){
        var that = this;
				var myData = {
					dataId: this.id,
          visibility_type: 1,
          visibility_set_catagory:2
				}
				apiClient.post('itsmApi/outterVisible/outters', myData, function(data) {
          if(data.results.visibilityLevel==1){
              that.uableall=true;
              that.uablelable="全部可见"
          }else if(data.results.visibilityLevel==2){
              that.uableall=false;
              that.uablelable="部分可见"
              that.personaluable=data.results.personal;//人员
              that.enteruable=data.results.enterprise;//企业
          }else{
               that.showuable=false;
          }
				});
      },
            addSeniorBtns(obj){
    //'test 测试 icon-ceshi','delete删除 icon-3', 'stop 停用 icon-suo', 'down下架 icon-unshelve','up 上架 icon-shelve ','start 开始 icon-able','rule计费规则 icon-xuefeishoujiaotongji' , 'usable可见性 icon-kejian1',
      //                           'blind 屏蔽 icon-pingbi', 'viewApplyRegist 查看申请 icon-chakanshenqing'，'modify 修改 icon-bianji2'，'viewReason查看原因 icon-zl_yuanyin' -->  
         
        if (obj.audit_status == '2' && obj.service_status == '1' && obj.up_down_status == '1') {
          obj.seniorBtns = ['icon-suo', 'icon-unshelve', 'ruicon-xuefeishoujiaotongjile', 'icon-kejian1', 'icon-pingbi', 'icon-chakanshenqing'];
        } else if (obj.audit_status == '2' && obj.service_status == '1' && obj.up_down_status != '1') {
          obj.seniorBtns = ['icon-suo', 'icon-shelve', 'icon-xuefeishoujiaotongji', 'icon-kejian1', 'icon-pingbi', 'icon-chakanshenqing'];
        } else if (obj.audit_status == '2' && obj.service_status == '3' && obj.up_down_status == '1') {
          obj.seniorBtns = ['icon-able', 'icon-unshelve', "icon-bianji2", 'icon-3', 'icon-xuefeishoujiaotongji', 'icon-kejian1', 'icon-pingbi', 'icon-chakanshenqing'];
        } else if (obj.audit_status == '2' && obj.service_status == '3' && obj.up_down_status != '1') {
          obj.seniorBtns = ['icon-able', "icon-bianji2", 'icon-3', 'icon-xuefeishoujiaotongji', 'icon-kejian1', 'icon-pingbi', 'icon-chakanshenqing'];
        } else if (obj.audit_status == '2' && obj.service_status == '4' && obj.up_down_status == '1') {
          obj.seniorBtns = ['icon-suo', 'icon-unshelve', 'icon-xuefeishoujiaotongji', 'icon-kejian1', 'icon-pingbi', 'icon-chakanshenqing'];
        } else if (obj.audit_status == '2' && obj.service_status == '4' && obj.up_down_status != '1') {
          obj.seniorBtns = ['icon-suo', 'icon-shelve', 'icon-xuefeishoujiaotongji', 'icon-kejian1', 'icon-pingbi', 'icon-chakanshenqing'];
        } else if (obj.audit_status == '2' && obj.service_status == '5' && obj.up_down_status != '1') {
          obj.seniorBtns = ['icon-3', 'icon-chakanshenqing'];
        } else if (obj.audit_status == '1') {
          obj.seniorBtns = ['icon-ceshi', 'icon-chakanshenqing'];
        } else if (obj.audit_status == '3') {
          obj.seniorBtns = ['icon-bianji2', 'icon-3', 'icon-zl_yuanyin', 'icon-chakanshenqing'];
        }
        return obj;
      },
			
		}
  }
</script>
<style src="../../css/common/public.css" scoped></style>
<style src="../../css/detailPage/applyServerDeatil.css" scoped></style>
<style>
@import '../../css/createCombinationServeice/jquery-ui.custom.min.css';
</style>
<style scoped>
	.inputime .css-radio {
		float: left;
		cursor: pointer;
		margin-right: 80px;
	}
	
	.css-radio i {
		background: url(../../images/radio.png) no-repeat;
		width: 12px;
		height: 12px;
		display: inline-block;
		vertical-align: middle;
		margin-right: 4px;
	}
	
	.css-radio.active i {
		background-position: 0 -13px;
	}
	.resoubox{
	    padding-bottom: 0px !important;
	}
</style>
