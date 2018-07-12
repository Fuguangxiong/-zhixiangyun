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
                        <img :src="logo" alt="">
                        <div class="servertitle">
                          <span class="servicename">{{formData.service_name}}</span> <span class="serverstate">({{formData.service_status}})</span>
                            <ul>
                                <li>标签：{{formData.service_tag}}</li>
                                <li>类型：{{formData.apptype}}</li>
                                <li>来源应用：{{formData.appName}}</li>
                                <li>创建者：{{formData.Applicant}}</li>
                            </ul>
                        </div>
                    </div>
                    <div class="callInformation">
                       <div >
                           <div class="calldetail"><span class="callnum">{{formData.visit_num}}</span><span class="calltitle">调用次数</span></div>
                           <div class="calldetail"><span class="callnum">{{formData.user_num}}</span><span class="calltitle">累计用户量</span></div>
                           <div class="calldetail"><span class="callnum">{{formData.visit_num}}</span><span class="calltitle">浏览量</span></div>
                       </div>
                        <div class="calloperate">
                            <i  class="icon iconfont icon-xiangqing2" ></i> 
                            <ul class="modifyDeleteUl">
                                   <li class="modifyDeleteLi"><div><i  class="icon iconfont icon-able" ></i> <span class="calltitle">启用</span></div> </li>
                                   <li class="modifyDeleteLi"><div><i  class="icon iconfont icon-shelve" ></i> <span class="calltitle">申请上架</span></div> </li>
                                   <li class="modifyDeleteLi"><div><i  class="icon iconfont icon-bianji2" ></i> <span class="calltitle">编辑</span></div> </li>
                                   <li class="modifyDeleteLi"><div><i  class="icon iconfont icon-3" ></i> <span class="calltitle">删除</span></div> </li>
                            </ul>
                            
                       </div>
                    </div>
                </div>
                 <!--基础信息 -->
                <div class="serviceInformation">
                    <div class="contenttitle"><span><i class="icon iconfont icon-jichuxinxiguanli-copy"></i>基础信息</span><i @click="shouqi('isup')" class="icon iconfont iconright" :class="{'icon-arrow-down-copy ':isup,'icon-arrow-down':!isup}"></i></div>
                     <ul v-show="isup">
                         <li><span class="titlewigth">服务名称：</span>{{formData.service_name}}</li>
                         <li><span class="titlewigth">服务期限：</span>{{formData.apply_time}}</li>
                         <li><span class="titlewigth">服务简介：</span>{{formData.service_brief}}</li>
                         <li><span class="titlewigth">服务介绍：</span><span>{{formData.service_remark}}</span></li>
                     </ul>
                </div>
                 <!--服务归属 -->
                <div class="serviceAttribution ">
                    <div class="contenttitle"><span><i class="icon iconfont icon-guishu"></i>服务归属</span><i @click="shouqi('isup1')" class="icon iconfont iconright" :class="{'icon-arrow-down-copy ':isup1,'icon-arrow-down':!isup1}"></i></div>
                      <ul v-show="isup1">
                         <li><span class="titlewigth">服务类型：</span>{{formData.apptype}}</li>
                         <li><span class="titlewigth">应用名称：</span>应用1</li>
                         <li><span class="titlewigth">页面类型：</span><span class="pageType" v-show="list1.state">页面请求</span><span class="pageType" v-show="list2.state">页面数据请求</span><span class="pageType" v-show="list3.state">纯数据请求</span></li>
                         <li><span class="titlewigth">服务标签：</span><span class="serverlable" v-for="(item,index) in lableList">{{item}}</span></li>
                     </ul>
                </div>
                 <!--图片设置 -->
                <div class="imgRequest">
                     <div class="contenttitle"><span><i class="icon iconfont icon-tupian2"></i>图片配置</span><i @click="shouqi('isup2')" class="icon iconfont iconright" :class="{'icon-arrow-down-copy ':isup2,'icon-arrow-down':!isup2}"></i></div>
                      <div class="imgRequestdiv" v-show="isup2">
                        <div class="logoImg">
                            <img :src="logo" alt="">
                            <div class="logoImgName">
                            <span>logo</span>
                            </div>
                        </div>
                        <div class="bgImg">
                            <img :src="bgimg" alt="">
                            <div class="bgImgName">
                            <span>背景图</span>
                            </div>
                        </div>
                      </div>
                </div>
                 <!--页面请求设置 -->
                <div class="dataRequest" v-show="list1.state">
                     <div class="contenttitle"><span><i class="icon iconfont icon-iconset0335"></i>页面请求设置</span><i @click="shouqi('isup3')" class="icon iconfont iconright" :class="{'icon-arrow-down-copy ':isup3,'icon-arrow-down':!isup3}"></i></div>
                     <div class="dateRequestContent" v-show="isup3">
                         <div class="requerdiv"><span class="titlewigth">请求类型:</span>{{list1.request_type}} </div>
                         <div class="requerdiv"><span class="titlewigthmin">字符集:</span>{{list1.chartset}}</div>
                         <div class="requerdiv"><span class="titlewigth">请求地址:</span>{{list1.url}}</div>
                          <div  class="requerdiv" v-show="list1.isShowInputBody"><span class="titlewigthmin">请求体:</span>{{list1.input_body}}</div>
                     </div>
                </div>
                 <!--纯数据请求设置 -->
                <div class="dataRequest"  v-show="list3.state">
                     <div class="contenttitle"><span><i class="icon iconfont icon-shuju"></i>纯数据请求设置</span><i @click="shouqi('isup4')" class="icon iconfont iconright" :class="{'icon-arrow-down-copy ':isup4,'icon-arrow-down':!isup4}"></i></div>
                       <div class="dateRequestContent" v-show="isup4">
                         <div class="requerdiv"><span class="titlewigth">请求类型:</span>{{list3.request_type}}</div>
                         <div   class="requerdiv"><span class="titlewigth" style=" display:block">参数设置:</span>  
                              <span class="param" >   
                                   <div class="paramBox" :class="{active:item.isTrue}" v-for="(item,index) in list3.tableList" >
                                     <div class="paramContent" :class="{active:item.isTrue}">
                                         <p>名称：{{item.name}}</p>
                                         <p>序号：{{item.order}}</p>
                                         <p v-if="item.param_type == 1">类型：字符</p>
                                         <p v-if="item.param_type == 2">类型：长文本</p>
                                         <p v-if="item.param_type == 3">类型：数值</p>
                                         <p>描述：{{item.describe}}</p>
                                         <div class="paramTag">标签：<span>{{item.tag}}</span></div>
                                         <p v-if="item.isRequired">必输：是</p>
                                         <p v-else>必输：否</p>
                                     </div>
                                     <div class="paramBtn">
                                          <i  @click="getMoreInfo(index,list3.tableList)" class="icon iconfont" :class="{'icon-shangla':item.isTrue,'icon-xiala1':!item.isTrue}"></i> 
                                     </div>
                                </div>
                                
                            </span>  
                        </div>
                        
                         <div  class="requerdiv"><span class="titlewigth">请求地址:</span>{{list3.url}} </div>
                         <div  class="requerdiv" v-show="list3.isShowInputBody"><span class="titlewigthmin">请求体:</span>{{list3.input_body}}</div>
                         <div  class="requerdiv"><span class="titlewigth" style=" display:block">返回参数:</span><span class="param">   
                                   <div class="paramBox" :class="{active:item.isTrue}" v-for="(item,index) in list3.serviceOutParam">
                                     <div class="paramContent" :class="{active:item.isTrue}" >
                                         <p>名称：{{item.name}}</p>
                                         <p>序号：{{item.order}}</p>
                                          <p v-if="item.param_type == 1">类型：字符</p>
                                         <p v-if="item.param_type == 2">类型：长文本</p>
                                         <p v-if="item.param_type == 3">类型：数值</p>
                                        <p>描述：{{item.describe}}</p>
                                         <div class="paramTag">标签：<span>{{item.tag}}</span></div>
                                         <p v-if="item.isRequired">必输：是</p>
                                         <p v-else>必输：否</p>
                                     </div>
                                     <div class="paramBtn">
                                           <i  @click="getMoreInfo(index,list3.serviceOutParam)" class="icon iconfont" :class="{'icon-shangla':item.isTrue,'icon-xiala1':!item.isTrue}"></i> 
                                     </div>
                                </div>
                            </span> 
                         </div>
                         <div  class="requerdiv"><span class="titlewigth">输出格式:</span>{{list3.output_body}} </div>
                     </div>
                </div>
               <!-- 页面数据请求设置 -->
                <div class="dataRequest"  v-show="list2.state">
                     <div class="contenttitle"><span><i class="icon iconfont icon-shuju"></i>页面数据请求设置</span><i @click="shouqi('isup5')" class="icon iconfont iconright" :class="{'icon-arrow-down-copy ':isup5,'icon-arrow-down':!isup5}"></i></div>
                       <div class="dateRequestContent" v-show="isup5">
                         <div class="requerdiv"><span class="titlewigth">请求类型:</span>{{list2.request_type}}</div>
                         <div  class="requerdiv"><span class="titlewigth" style=" display:block">参数设置:</span>  
                              <span class="param">   
                                   <div class="paramBox" :class="{active:item.isTrue}" v-for="(item,index) in list2.tableList" >
                                     <div class="paramContent" :class="{active:item.isTrue}">
                                         <p>名称：{{item.name}}</p>
                                         <p>序号：{{item.order}}</p>
                                         <p v-if="item.param_type == 1">类型：字符</p>
                                         <p v-if="item.param_type == 2">类型：长文本</p>
                                         <p v-if="item.param_type == 3">类型：数值</p>
                                         <p>描述：{{item.describe}}</p>
                                         <div class="paramTag">标签：<span>{{item.tag}}</span></div>
                                         <p v-if="item.isRequired">必输：是</p>
                                         <p v-else>必输：否</p>
                                     </div>
                                     <div class="paramBtn">
                                          <i  @click="getMoreInfo(index,list2.tableList)" class="icon iconfont" :class="{'icon-shangla':item.isTrue,'icon-xiala1':!item.isTrue}"></i> 
                                     </div>
                                </div>
                                
                            </span>  
                        </div>
                        
                         <div  class="requerdiv"><span class="titlewigth">请求地址:</span>{{list2.url}} </div>
                         <div  class="requerdiv" v-show="list2.isShowInputBody"><span class="titlewigthmin">请求体:</span>{{list2.input_body}}</div>
                     </div>
                </div> 
                 <!--可见性配置 -->
                <div class="pageRequest">
                      <div class="contenttitle"><span><i class="icon iconfont icon-kejian"></i>可见性配置</span><i @click="shouqi('isup6')" class="icon iconfont iconright" :class="{'icon-arrow-down-copy ':isup6,'icon-arrow-down':!isup6}"></i></div>
                       <div class="pageRequestContent" v-show="isup6">
                         <div><span class="titlewigth">可见范围:</span>全部可见</div>
                       </div>
                </div>
                 <!--屏蔽性配置 -->
                <div class="pageRequest">
                      <div class="contenttitle"><span><i class="icon iconfont icon-jianhao1"></i>屏蔽性配置</span><i @click="shouqi('isup7')" class="icon iconfont iconright" :class="{'icon-arrow-down-copy ':isup7,'icon-arrow-down':!isup7}"></i></div>
                      <div class="pageRequestContent" v-show="isup7">
                         <div><span class="titlewigth">屏蔽范围:</span>全部可见</div>
                         <div class="fanwei"><span>dddddddd </span> <span>dddddddd </span></div>
                       </div>
                </div>
                 <!--计费方案 -->
                <div class="pageRequest">
                      <div class="contenttitle"><span><i class="icon iconfont icon-xiangqing1"></i>计费方案</span><i @click="shouqi('isup8')" class="icon iconfont iconright" :class="{'icon-arrow-down-copy ':isup8,'icon-arrow-down':!isup8}"></i></div>
                      <div class="pageRequestContent" v-show="isup8">
                         <div class="design"><span class="titlewigth designtitle">优惠活动:</span>
                            <div class="designimg">
                                <img src="../../images/yfb.jpg" alt="">
                                    <div class="">
                                    <span>logo</span>
                                   </div>
                            </div>
                            <div class="designimg">
                                <img src="../../images/yfb.jpg" alt="">
                                    <div class="">
                                    <span>logo</span>
                                    </div>
                            </div>
                        </div>
                          <div><span class="titlewigth">方案活动:</span>全部可见</div>
                       
                       </div>
                </div>

           
            </div>
            </div>
      
    
    <!-- /主题内容菜单 end -->
      


    </div>
</template>
<script>

  import apiToken from '../../../publicJs/apiToken.js'
  import apiClient from '../../../publicJs/ApiClient.js'
import TipBoxService from "../common/TipBoxService.js";
  import LoadingBoxService from '../../../publicJs/LoadingBoxService.js'
  import NoticeBoxService from '../../../publicJs/NoticeBoxService.js'
  import Util from '../../../publicJs/Util'
  export default{
    name: 'applyServerDeatil',
    data(){
        return{ 
             formData:{
            butStyle:'',//启用停用按钮的颜色
            isShow:false,//是否显示启用停用按钮
            delIsShow:false,//删除按钮是否显示
            updateIsShow:false,//编辑按钮是否显示
            portIsShow:false,//端口是否显示
            service_name:'',//服务名称
            apptype:'',//归属应用
            address:'',//服务地址
            service_tag:'',//服务标签
            open_type:'',//公开方式
            service_brief:'',//服务简介
            service_remark:'',//服务介绍            
            service_type:'',//是数据服务还是页面服务1-有输入页面、2-无输入页面有输出页面、3-无输入页面无输出页面
            visit_num:'',//浏览量
            user_num:"",//累计用户量
            click_num:'',//调用次数
            id:'',//原子服务ID
            service_status:'',//服务状态
            Applicant:'',//申请人
            
            appName:'',//应用名称
            apply_time:'',
            service_param:[
            ],
            startAndStop:'',//启用  停用
            startAndStopBut:'',//启用  停用按钮显示
            audit_status:'',//审核状态
          },
          list1:{
            isShowInputBody:false,
            state:false,
            charset:'',
            tableList:[

            ],
            request_type:'',//请求类型post、get、无
            request_port:'',//请求端口 docker端口
            url:'',//原子服务的请求路径 端口以后的ulr部分 
            input_body:'',//页面请求体

          },
           list2:{
            isShowInputBody:false,
            state:false,
            charset:'',
            tableList:[

            ],
            request_type:'',//请求类型post、get、无
            request_port:'',//请求端口 docker端口
            url:'',//原子服务的请求路径 端口以后的ulr部分 
            input_body:'',//页面请求体

          },
           list3:{
            isShowInputBody:false,
            state:false,
            tableList:[
            ],
            url:'',//原子服务的请求路径 端口以后的ulr部分 
            output_body:'',//页面请求体
            serviceOutParam:[],//返回参数（输出）
            url:'',//原子服务的请求路径 端口以后的ulr部分 
            output_body:'',//输出格式
            intput_body:'',//输入格式
            request_type:'',//请求类型post、get、无
            request_port:'',//请求端口 docker端口
            url:'',//原子服务的请求路径 端口以后的ulr部分 
            serviceOutParam:[],//返回参数（输出）           
          },
          btnControlData:[],
          lableList:[],//服务归属标签数组
          logo:"",//logo图片
          bgimg:"",//背景图片
            isup:true,//下拉
            isup1:true,//下拉
            isup2:true,//下拉
            isup3:true,//下拉
            isup4:true,//下拉
            isup5:true,//下拉
            isup6:true,//下拉
            isup7:true,//下拉
            isup8:true,//下拉
        
        }
    },
    created(){
      this.formData.id=this.$route.query.id;
      this.formData.audit_status=this.$route.query.audit_status;
       this.getFormData(); 
    },
    mounted(){
        
     
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
            if(type=='isup7'){ this.isup7=!this.isup7;}
            if(type=='isup8'){ this.isup8=!this.isup8;}
        },
         getMoreInfo(i,table){
            let that=this;
            let obj=Object.assign({},table[i]);
            obj.isTrue=!obj.isTrue;
            that.$set(table, i, obj);
            // this.list2.tableList[i].isTrue = !this.list2.tableList[i].isTrue;
        },
      getFormData(){
       
        var that=this;
        var myData={id:that.formData.id};//that.formData.id
        LoadingBoxService.open('加载中')
        apiClient.post('itsmApi/atomicService/loadServiceInfo',myData,function(data){
            console.log(data)
            that.bgimg=   apiClient.apiBaseUrl +apiToken.newApi("/itsmApi/attachment/show?imgPath=") + data.results.data[0].bg_img +"&token=" + apiClient.token; ;
            that.logo=   apiClient.apiBaseUrl +apiToken.newApi("/itsmApi/attachment/show?imgPath=") +data.results.data[0].img +"&token=" +apiClient.token;;
            that.formData.service_name=data.results.data[0].name;
            that.formData.apply_time=data.results.apply_time;
            
            console.log(data.results.userList);
            if(data.results.userList != null){
                that.formData.Applicant=data.results.userList.truename;
            }
            that.formData.apptype=data.results.data[0].apptype;
            if(that.formData.apptype == 1){
              that.formData.apptype = '远程服务';
            }else{
              that.formData.apptype = '应用服务';
              that.formData.portIsShow = true;
            }
            that.formData.service_url=data.results.data[0].address;
            that.lableList=data.results.data[0].service_tag;
            if(data.results.data[0].service_tag != undefined){
                that.formData.service_tag=data.results.data[0].service_tag.toString();
            }   
            that.formData.open_type=data.results.data[0].open_type;
            if(that.formData.open_type == 1){
              that.formData.open_type = '完全公开';
            }else{
              that.formData.open_type = '条件公开';
            }
            that.formData.service_brief=data.results.data[0].service_brief;
            that.formData.service_remark=data.results.data[0].service_remark;
            that.formData.service_type=data.results.data[0].service_type;
            that.formData.service_status=data.results.serviceStatus;
            if(that.formData.service_status == "正常"){
              that.formData.startAndStopBut = '停用';
              that.formData.startAndStop = '关闭';
              that.formData.butStyle = 'butonstdelet';
            }else if(that.formData.service_status == "关闭"){
              that.formData.startAndStopBut = '启用';
              that.formData.startAndStop = '正常';
              that.formData.butStyle = 'butonst';
            }
            that.formData.visit_num=data.results.data[0].visit_num;
            if(that.formData.visit_num == undefined){
                that.formData.visit_num = '0';
            }
             that.formData.user_num=data.results.data[0].user_num;
            if(that.formData.user_num == undefined){
                that.formData.user_num = '0';
            }
            /*that.formData.audit_status=data.results.data[0].audit_status;*/
            if(that.formData.audit_status == "未通过"){
                that.formData.updateIsShow = true;
            }
            if(that.formData.audit_status == '已通过'){
                that.formData.isShow = true;
            }
            if(that.formData.audit_status == "0" || that.formData.audit_status == undefined){
              that.formData.updateIsShow = true;
              that.formData.delIsShow = true;
            }
            that.formData.click_num=data.results.data[0].click_num;
            that.formData.appName=data.results.appName;
            console.log(data.results.data[0].service_param_detail)
            that.formData.service_param=data.results.data[0].service_param_detail;
              for(var i=0; i<that.formData.service_type.length; i++){  
              var arr = that.formData.service_type[i];
              if(arr == '1'){
                if(that.formData.service_param != undefined){
                    that.formData.service_param[i] = JSON.parse(that.formData.service_param[0]);
                    that.list1.url = that.formData.service_param[i].url;
                    that.list1.request_type = that.formData.service_param[i].request_type;
                    if(that.list1.request_type =='post'){
                        that.list1.isShowInputBody = true; 
                    }
                      for(var i = 0 ; i < that.list1.tableList.length ; i ++){
                        that.list1.tableList[i].isTrue = false
                    }
                    that.list1.charset = that.formData.service_param[i].charset;
                    that.list1.input_body = that.formData.service_param[i].input_body;
                    that.list1.request_port = that.formData.service_param[i].request_port;
                    that.list1.tableList = that.formData.service_param[i].service_param;
                    that.list1.state = true;
               }
              }
              if(arr == '2'){ 
                if(that.formData.service_param != undefined){
                    that.formData.service_param[i] = JSON.parse(that.formData.service_param[1]);
                    that.list2.url = that.formData.service_param[i].url;
                    that.list2.request_type = that.formData.service_param[i].request_type;
                    if(that.list2.request_type =='post'){
                        that.list2.isShowInputBody = true; 
                    }
                    that.list2.charset = that.formData.service_param[i].charset;
                    that.list2.input_body = that.formData.service_param[i].input_body;
                    that.list2.request_port = that.formData.service_param[i].request_port;
                    that.list2.tableList = that.formData.service_param[i].service_param;
                    that.list2.state = true;
                }
              }
              if(arr == '3'){
                if(that.formData.service_param != undefined){
                    that.formData.service_param[i] = JSON.parse(that.formData.service_param[2]);
                    that.list3.input_body = that.formData.service_param[i].input_body;
                    that.list3.output_body = that.formData.service_param[i].output_body;
                    that.list3.tableList = that.formData.service_param[i].service_param;
                    that.list3.serviceOutParam = that.formData.service_param[i].service_out_param;
                    that.list3.request_port = that.formData.service_param[i].request_port;
                    that.list3.url = that.formData.service_param[i].url;
                    that.list3.request_type = that.formData.service_param[i].request_type;
                    if(that.list3.request_type =='post'){
                        that.list3.isShowInputBody = true; 
                    }
                     for(var i = 0 ; i < that.list3.tableList.length ; i ++){
                        that.list3.tableList[i].isTrue = false
                    }
                    that.list3.state = true;
                }   
              }
            }
            LoadingBoxService.close()
        });
      },
      
    },
  }
</script>
<style src="../../css/common/public.css" scoped></style>
<style src="../../css/detailPage/applyServerDeatil.css" scoped></style>
