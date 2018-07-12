<template>
  <div class="publicContent">
    <!-- <div class="publicNav">
        <img class="hand" @click="toMain()" src="">
        <span class="active">服务审批</span>
        <span class="arrows">></span>
        <span class="active">服务详情</span>
        <div class="topbtnContainer">
        </div>
    </div> -->
    <div>
      <div class="inpfrom">
        <h2 class="tilesc">{{formData.title}}</h2>
        <div class="divtime">
            <div class="tile">
                <span class="titleInfo">
                    <i class="icon iconfont icon-tianxieshenqingrenxinxi"></i>
                    <em>申请人信息</em>
                </span>
            </div>
          <div class="wid">    
            <el-row>
                <el-col :span="12">
                    <div class="textlinpu">
                        <span class="text">申请人：</span>
                        <span class="inputborder textlinpu-text w240">{{formData.Applicant}}</span>
                    </div>
                </el-col>
                <el-col :span="12">
                    <div class="textlinpu">
                        <span class="text">部门：</span>
                        <span class="inputborder textlinpu-text w240">{{formData.DEPARTMENT_NAME}}</span>
                    </div>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <div class="textlinpu">
                        <span class="text">单位：</span>
                        <span class="inputborder textlinpu-text w240">{{formData.NAME}}</span>
                    </div>
                </el-col>
                <el-col :span="12">
                    <div class="textlinpu">
                        <span class="text">申请日期：</span>
                        <span class="inputborder textlinpu-text w240">{{formData.apply_time}}</span>
                    </div>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <div class="textlinpu">
                        <span class="text">联系电话：</span>
                        <span class="inputborder textlinpu-text w240">{{formData.tel}}</span>
                    </div>
                </el-col>
                <el-col :span="12">
                     <div class="textlinpu">
                        <span class="text">用户名：</span>
                        <span class="inputborder textlinpu-text w240">{{formData.loginName}}</span>
                    </div>
                </el-col>
            </el-row>
          </div>
        </div>
        <!--需求描述-->
        <div class="divtime">
            <div class="tile">
                <span class="titleInfo">
                    <i class="icon iconfont icon-iconset0335"></i>
                    <em>基础信息</em>
                </span>
            </div>
          <div class="wid">

            <el-row>
                <el-col :span="50">
                    <div class="textlinpu w100">
                        <span class="text">服务名称：</span>
                        <!--<div class="css-radio-box fleradio">
                            <div v-for="(item,index) in uiData.demandType" class="css-radio" v-bind:class="{active:item.active}" v-on:click="demandTypeRadioClickHandler(item,index)">
                            <i></i><em>{{item.name}}</em><b v-if="item.input" class="css-rinpu"><input v-model="submitData.demandnote" type="text" class="inputborder textlinpu-text w240"></b>
                            </div>
                        </div>-->
                        <input v-model="formData.service_name" readonly type="text" class="inputborder textlinpu-text w240">
                    </div>
                </el-col>
                <el-col :span="50">
                        <div class="textlinpu w100" style="">
                            <span class="text">服务期限：</span>
                            <input :value="startTime+'   至   '+endTime" readonly type="text" class="inputborder textlinpu-text w240">
                        </div>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="50">
                    <div class="textlinpu w100" style="">
                        <span class="text">服务简介：</span>
                        <input  v-model="formData.service_brief" readonly type="text" class="brief inputborder textlinpu-text w240">
                    </div>
                </el-col>
                <el-col :span="12">
                        <div class="textlinpu remark">
                            <span class="text">服务介绍：</span>
                            <div class="css-radio-box fleradio">
                                <textarea v-model="formData.service_remark" disabled class="inputborder textlinpu-text textrea">请详细描述您使用此数据的目的或用途（限300字以内）</textarea>
                            </div>
                        </div>
                </el-col>
            </el-row>
           
            
           <!--  <div class="textlinpu w100" style="">
             <span class="text">服务地址</span>
             <input v-model="formData.service_url" readonly type="text" class="inputborder textlinpu-text w240">
           </div> -->
            <!-- <div class="textlinpu w100" style="">
              <span class="text">服务标签</span>
              <input v-model="formData.service_tag" readonly type="text" class="inputborder textlinpu-text w240">
            </div> -->
            <!-- <div class="textlinpu w100" style="">
              <span class="text">公开方式</span>
              <input v-model="formData.open_type" readonly type="text" class="inputborder textlinpu-text w240">
            </div> -->
            
          </div>
        </div>
        <div class="divtime">
            <div class="tile">
                <span class="titleInfo">
                    <i class="icon iconfont icon-guishu"></i>
                    <em>服务归属</em>
                </span>
            </div>
            <div class="con-cont1 wid">
                <div class="textlinpu w100" style="">
                    <span class="text">服务类型：</span>
                    <input  v-model="formData.apptype" readonly type="text" class="inputborder textlinpu-text w240">
                </div>
                <div class="textlinpu w100">
                    <span class="text">请求类型：</span>
                    <div class="serviceTypeBox">
                        <span v-for="(serviceType,index) in serviceType" :key="index" class="serviceType">{{serviceType}}</span>
                    </div>
                </div>
                <div class="textlinpu w100">
                    <span class="text">服务标签：</span>
                    <span v-for="(tag,index) in formData.service_tag" :key="index" class="serviceTag">{{tag}}</span>
                </div>
            </div>
        </div>
        <div class="divtime">
            <div class="tile">
                <span class="titleInfo">
                    <i class="icon iconfont icon-tupian2"></i>
                    <em>图片配置</em>
                </span>
            </div>
            <div class="con-cont wid">
                <div class="logoImg">
                    <img v-show="bg_img_status == 1" src="../../images/logo-sm-default.jpg" alt="">
                    <img v-show="bg_img_status == 0" :src="logo_img_url" alt="">
                    <div class="logoImgName">
                        <span>logo</span>
                    </div>
                </div>
                <div class="bgImg">
                    <img v-show="logo_img_status == 1" src="../../images/logo-sm-default.jpg" alt="">
                    <img v-show="logo_img_status == 0" :src="bg_img_url" alt="">
                    <div class="bgImgName">
                        <span>背景图</span>
                    </div>
                </div>
            </div>
        </div>
        <!--需求描述结束-->
        <!--其他备注-->
        <!-- <div class="divtime">
          <div class="tile">其他备注</div>
          <div class="con-cont wid">
            <div class="textlinpu w100">
              <span class="text">备注</span>
              <div class="css-radio-box fleradio">
                <textarea  readonly class="inputborder textlinpu-text textrea">请详细描述您使用此数据的目的或用途（限300字以内）</textarea>
              </div>
            </div>
          </div>
        </div> -->
        <!--其他备注结束-->

            <!--/biaodan-->
                    <!--biaod  v-show="list1.state"-->
                    <div class="divtime" v-show="list1.state">
                        <div class="tile">
                            <span class="titleInfo">
                                <i class="icon iconfont icon-iconset0335"></i>
                                <em>页面请求设置</em>
                            </span>
                        </div>
                        <div class="con-cont wid">
                            <div class="time-x">
                                <span class="texet">请求类型：</span>
                                <span class="inputime ">
                                    <em class="ls">{{list1.request_type}}</em>
                                </span>
                            </div>
                            <div class="time-x">
                                <span class="texet">字符集：</span>
                                <span>
                                    <em class="ls">{{list1.chartset}}</em>
                                </span>
                            </div>                            
                            <div class="time-x">
                                <span class="texet">请求地址：</span>
                                <span class="inputime ">
                                    <input v-show="formData.portIsShow" v-model="list1.request_port" readonly type="text" class="cssinput w200">
                                    <input v-model="list1.url" readonly type="text" class="cssinput w590">
                                </span>
                            </div>
                            <div class="time-x" v-show="list1.isShowInputBody">
                                <span class="texet">请求体：</span>
                                <span class="inputime ">
                                     <textarea v-model="list1.input_body" disabled type="text" class="cssinput teac" ></textarea>
                                </span>
                            </div>
                        </div>
                    </div>
                    <!--/biaodan-->
                <!--biaod-->
                <div class="divtime" v-show="list2.state">
                    <div class="tile">
                        <span class="titleInfo">
                            <i class="icon iconfont icon-iconset0335"></i>
                            <em>数据请求配置</em>
                        </span>
                    </div>
                    <div class="con-cont wid">
                        <div class="time-x">
                            <span class="texet">请求类型：</span>
                            <span class="inputime ">
                                    <em class="ls">{{list2.request_type}}</em>
                            </span>
                        </div>
                        <div class="time-x setParam">
                            <span class="texet">参数设置：</span>
                            <span class="inputime pb">
                                 <div class="paramBox" v-for="(item,index) in list2.tableList" :class="{actives:item.isTrue}" :key="index">
                                     <div class="paramContent" :class="{actives:item.isTrue}">
                                         <p>名称：{{item.name}}</p>
                                         <p>序号：{{item.order}}</p>
                                         <p v-if="item.param_type == 1">类型：字符</p>
                                         <p v-if="item.param_type == 2">类型：长文本</p>
                                         <p v-if="item.param_type == 3">类型：数值</p>
                                         <p>描述：{{item.describe}}</p>
                                         <div class="paramTag">标签：<span>{{item.tag}}</span></div>
                                         <p v-if="item.isRequired">必输：是</p>
                                         <p v-if="!item.isRequired">必输：否</p>
                                     </div>
                                     <div class="paramBtn">
                                         <i @click="getMoreInfo(index,list2.tableList,'list2')" class="icon iconfont" :class="{'icon-xiangshangjiantouarrowup1':item.isTrue,'icon-xiangxiajiantou1':!item.isTrue}"></i>
                                     </div>
                                </div>
                                     <!-- <div class="tabth">
                                        <span class="ww1">参数名称</span>
                                        <span class="ww2">序号</span>
                                        <span class="ww3">参数类型</span>
                                        <span class="ww4">字段描述</span>
                                        <span class="ww5">标签</span>
                                        <span class="ww6">是否必输</span>
                                     </div> -->
                                     <!-- <div class="tabcon">
                                         <div class="shulist-con">
                                              <div class="shulist" v-for="(item,index) in list2.tableList">
                                              <div class="shulist-m">
                                                 <div class="w2 eqad">
                                                     <input disabled="" :value="item.name" type="text" class="inptcss inptcssw">
                                                 </div>
                                                 <div class="w1">
                                                     <input disabled="" :value="item.order" type="text" class="inptcss1">
                                                 </div>
                                                 <div class="w1">
                                                      <input v-if="item.param_type == 1" disabled="" value="字符" type="text" class="inptcss3">
                                                      <input v-if="item.param_type == 2" disabled="" value="长文本" type="text" class="inptcss3">
                                                      <input v-if="item.param_type == 3" disabled="" value="数值" type="text" class="inptcss3">
                                                 </div>
                                                 <div class="w3">
                                                     <input disabled="" :value="item.describe" type="text" class="inptcss2">
                                                 </div>
                                                 <div class="w2 poes">
                                                     <input disabled="" :value="item.tag" type="text" class="inptcss4">
                                                 </div>
                                                 <div class="w3">
                                                    <input v-model="item.isRequired" disabled type="checkbox" class="tableSelectBtn">
                                                </div>
                                               </div>
                                             </div>
                                         </div>
                                     </div> -->
                                 
                            </span>
                        </div>
                        <div class="time-x">
                            <span class="texet">请求地址：</span>
                            <span class="inputime ">
                                    <input v-show="formData.portIsShow" v-model="list2.request_port" readonly type="text" class="cssinput w200">
                                    <input v-model="list2.url" readonly type="text" class="cssinput w590">
                                </span>
                        </div>
                        <div class="time-x" v-show="list2.isShowInputBody">
                            <span class="texet">请求体：</span>
                            <span class="inputime ">
                                     <textarea v-model="list2.input_body" disabled type="text" class="cssinput teac"></textarea>
                                </span>
                        </div>
                    </div>
                </div>
                <!--/biaodan-->
                <!--biaod-->
                <div class="divtime" v-show="list3.state">
                    <div class="tile">
                        <span class="titleInfo">
                            <i class="icon iconfont icon-shuju"></i>
                            <em>纯数据请求配置</em>
                        </span>
                    </div>
                    <div class="con-cont wid">
                        <div class="time-x">
                            <span class="texet">请求类型：</span>
                            <span class="inputime ">
                                     <em class="ls">{{list3.request_type}}</em>
                                </span>
                        </div>
                        <div class="time-x setParam">
                            <span class="texet">参数设置：</span>
                            <div class="pb">
                            <span class="inputime ">
                                <div class="paramBox" :class="{actives:item.isTrue}" v-for="(item,index) in list3.tableList" :key="index">
                                     <div class="paramContent" :class="{actives:item.isTrue}">
                                         <p>名称：{{item.name}}</p>
                                         <p>序号：{{item.order}}</p>
                                         <p v-if="item.param_type == 1">类型：字符</p>
                                         <p v-if="item.param_type == 2">类型：长文本</p>
                                         <p v-if="item.param_type == 3">类型：数值</p>
                                         <p>描述：{{item.describe}}</p>
                                         <div class="paramTag">标签：<span>{{item.tag}}</span></div>
                                         <p v-if="item.isRequired">必输：是</p>
                                         <p v-if="!item.isRequired">必输：否</p>
                                     </div>
                                     <div class="paramBtn">
                                         <i @click="getMoreInfo(index,list3.tableList,'list3')" class="icon iconfont" :class="{'icon-xiangshangjiantouarrowup1':item.isTrue,'icon-xiangxiajiantou1':!item.isTrue}"></i>
                                     </div>
                                </div>
                                     <!-- <div>
                                         <div class="tabth">
                                            <span class="ww1">参数名称</span>
                                            <span class="ww2">序号</span>
                                            <span class="ww3">参数类型</span>
                                            <span class="ww4">字段描述</span>
                                            <span class="ww5">标签</span>
                                            <span class="ww6">是否必输</span>
                                         </div>
                                         <div class="tabcon">
                                             <div class="shulist-con">
                                                 <div v-for="(item,index) in list3.tableList" class="shulist">
                                                     <div class="shulist-m">
                                                         <div class="w2 eqad">
                                                             <input disabled="" :value="item.name" type="text" class="inptcss inptcssw">
                                                         </div>
                                                         <div class="w1">
                                                             <input disabled="" :value="item.order" type="text" class="inptcss1">
                                                         </div>
                                                         <div class="w1">
                                                             <input v-if="item.param_type == 1" disabled="" value="字符" type="text" class="inptcss3">
                                                             <input v-if="item.param_type == 2" disabled="" value="长文本" type="text" class="inptcss3">
                                                             <input v-if="item.param_type == 3" disabled="" value="数值" type="text" class="inptcss3">
                                                         </div>
                                                         <div class="w3">
                                                             <input disabled="" :value="item.describe" type="text" class="inptcss2">
                                                         </div>
                                                         <div class="w2 poes">
                                                             <input disabled="" :value="item.tag" type="text" class="inptcss4">
                                                         </div>
                                                         <div class="w3">
						                                     <input v-model="item.isRequired" disabled type="checkbox" class="tableSelectBtn">
						                                 </div>
                                                     </div>
                                                 </div>
                                             </div>
                                         </div>
                                     </div> -->
                                </span>
                            </div>
                        </div>
                        <div class="time-x">
                            <span class="texet">请求地址：</span>
                            <span class="inputime ">
                                <input v-show="formData.portIsShow" v-model="list3.request_port" readonly type="text" class="cssinput w200">
                                <input v-model="list3.url" readonly type="text" class="cssinput w590">
                            </span>
                        </div>
                        <div class="time-x" v-show="list3.isShowInputBody">
                            <span class="texet">请求体：</span>
                            <span class="inputime ">
                                     <textarea v-model="list3.input_body" disabled type="text" class="cssinput teac" ></textarea>
                                </span>
                        </div>
                    </div>
                </div>

                  <div class="divtime" v-show="list3.state">
                    <div class="tile">
                        <span class="titleInfo">
                            <i class="icon iconfont icon-canshu"></i>
                            <em>返回参数配置</em>
                        </span>
                    </div>
                    <div class="con-cont wid">
                        <!-- <div class="time-x">
                            <span class="texet">服务资源名称</span>
                            <span class="inputime ">
                                     <em class="ls">{{list3.request_type}}</em>
                                </span>
                        </div> -->
                        <div class="time-x setParam">
                            <span class="texet">参数设置：</span>
                            <span class="inputime">
                                <div class="pb">
                                <div class="paramBox" :class="{actives:item.isTrue}" v-for="(item,index) in list3.serviceOutParam" :key="index">
                                     <div class="paramContent" :class="{actives:item.isTrue}">
                                         <p>名称：{{item.name}}</p>
                                         <p>序号：{{item.order}}</p>
                                         <p v-if="item.param_type == 1">类型：字符</p>
                                         <p v-if="item.param_type == 2">类型：长文本</p>
                                         <p v-if="item.param_type == 3">类型：数值</p>
                                         <p>描述：{{item.describe}}</p>
                                         <div class="paramTag">标签：<span>{{item.tag}}</span></div>
                                         <!-- <p v-if="item.isRequired">必输：是</p>
                                         <p v-if="!item.isRequired">必输：否</p> -->
                                     </div>
                                     <div class="paramBtn">
                                         <i @click="getMoreInfo(index,list3.serviceOutParam,'outParam')" class="icon iconfont" :class="{'icon-xiangshangjiantouarrowup1':item.isTrue,'icon-xiangxiajiantou1':!item.isTrue}"></i>
                                     </div>
                                </div>
                                </div>
                                     <!-- <div>
                                         <div class="tabth">
                                            <span class="ww1">参数名称</span>
                                            <span class="ww2">序号</span>
                                            <span class="ww3">参数类型</span>
                                            <span class="ww4">字段描述</span>
                                            <span class="ww5">标签</span>
                                         </div>
                                         <div class="tabcon1">
                                             <div class="shulist-con">
                                                <div class="shulist" v-for="(item,index) in list3.serviceOutParam">
                                                     <div class="shulist-m">
                                                         <div class="w2 eqad">
                                                             <input disabled="" :value="item.name" type="text" class="inptcss inptcssw">
                                                         </div>
                                                         <div class="w1">
                                                             <input disabled="" :value="item.order" type="text" class="inptcss1">
                                                         </div>
                                                         <div class="w1">
                                                             <input v-if="item.param_type == 1" disabled="" value="字符" type="text" class="inptcss3">
                                                             <input v-if="item.param_type == 2" disabled="" value="长文本" type="text" class="inptcss3">
                                                             <input v-if="item.param_type == 3" disabled="" value="数值" type="text" class="inptcss3">
                                                         </div>
                                                         <div class="w3">
                                                             <input disabled="" :value="item.describe" type="text" class="inptcss2">
                                                         </div>
                                                         <div class="w2 poes">
                                                             <input disabled="" :value="item.tag" type="text" class="inptcss4">
                                                         </div>
                                                     </div>
                                                 </div>
                                             </div>
                                        </div>
                                     </div> -->
                                </span>
                        </div>
                        
                        <div class="time-x">
                            <span class="texet">输出格式：</span>
                            <span class="inputime ">
                                    <textarea v-model="list3.output_body" disabled type="text" class="cssinput teac" ></textarea>
                            </span>
                        </div>
                    </div>
                </div>
                    <div class="divtime" v-show="isShow">
                        <div class="tile">
                            <span class="titleInfo">
                                <i class="icon iconfont icon-shenpi1"></i>
                                <em>审批流转信息</em>
                            </span>
                        </div>
                        <div class="con-cont wid">
                            <div class="boxBody" id="boxBody">
                                <table border="0">
                                    <tr class="title">
                                        <th>序号</th>
                                        <th>审批批次</th>
                                        <th>审批阶段</th>
                                        <th>审核人</th>
                                        <th>处理时间</th>
                                        <th>审核意见</th>
                                    </tr>
                                    <tr class="one" v-for="(item,index) in applyInfo" :key="index">
                                        <td>{{index+1}}</td>
                                        <td>第{{item.audit_batch_num}}次</td>
                                        <td>
                                            <span v-show="item.audit_phase == 1">企业审批</span>
                                            <span v-show="item.audit_phase == 2">平台审批</span>
                                            <span v-show="item.audit_phase == 3 && item.audit_status == 2">成功</span>
                                            <span v-show="item.audit_phase == 3 && item.audit_status == 3">打回</span>
                                        </td>
                                        <td>{{item.auditUserName}}</td>
                                        <td>{{item.audit_time}}</td>
                                        <td style="width:250px">
                                        <span v-if="item.audit_status == 1">创建；</span>
                                        <span v-if="item.audit_status == 2">通过；</span>
                                        <span v-if="item.audit_status == 3">不通过；</span>
                                        <span v-if="item.audit_status == 0">撤销</span>
                                        <span :title="item.audit_remark" class="audit_remark">{{item.audit_remark}}</span>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div class="divtime" v-show="isShow1">
                        <div class="tile">
                            <span class="titleInfo">
                                <i class="icon iconfont icon-shenpi2"></i>
                                <em>审批操作</em>
                            </span>
                        </div>
                        <div class="con-cont wid">
                            <div class="boxBody" id="boxBody1">
                                <div class="exAndApproval">
                                    <span class="firstSpan">审批</span>
                                    <span @click="pass()" :class="{selected:isshow}" class="rs">通过</span>
                                    <span @click="noPass()" class="rs" :class="{selected:!isshow}">不通过</span>
                                    <br>
                                    <div class="remarks">
                                        <span v-show="!isshow" class="xing">*</span>
                                        <span>备注</span>
                                        <textarea name="desc" maxlength="50" style="resize:none;vertical-align:text-top;" @input="descInput" v-model="desc" id="" cols="60" rows="3"></textarea>
                                        <br>
                                        <span style="margin-right: 20px;float:right">您还可以输入<span style="color:red">{{remnant}}</span>个字</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
        <!-- <div class="divtime">
          <div class="butanlic"> -->
            <!--<div class="publicRedBtn autoWidth" v-on:click="submitHandler">提交</div>
            <div class="publicRedBtn autoWidth borderBtn" v-on:click="saveHandler">保存草稿</div>
            <div class="publicRedBtn autoWidth borderBtn" v-on:click="returnHandler">返回</div>-->
          <!-- </div> -->
        <!-- </div> -->
      </div>
    </div>
    <!-- 底部 -->
		<div class="apply-actions">
			<div>
				<b>服务需求单：</b>
				<span>分为应用服务、远程服务，用户可将原有应用系统上传到平台或提供远程访问地址，平台提供从中拆分成单一服务的能力。且拆分出的服务具有标准的数据对接接口，可单独调用或扩展应用于其他系统的最小服务单元，这种最小服务单元统称为原子服务。</span>
			</div>
			<button class="apply-btn" @click="back()">返回</button>
            <button v-show="isShow1" class="apply-btn submit" @click='submitApply'>提交审核</button>
		</div>
  </div>
</template>
<script>
  import apiToken from '../../../publicJs/apiToken.js'
  import apiClient from '../../../publicJs/ApiClient.js'
import TipBoxService from "../common/TipBoxService.js";
  import LoadingBoxService from '../../../publicJs/LoadingBoxService.js'
  import auditOperation from "../detailPage/auditOperation.vue";
  export default{
    name: 'examineInfo',
    data(){
        return{ 
          formData:{
            userId:"",
            portIsShow:false,//端口是否显示
            title:"",
            Applicant:'',//申请人
            loginName:'',//登录名
            tel:'',//联系电话
            dep:'',//部门
            enterprisename:'',//单位
            service_name:'',//服务名称
            apptype:'',//归属应用
            address:'',//服务地址
            service_tag:'',//服务标签
            open_type:'',//公开方式
            service_remark:'',//服务介绍
            service_type:'',//是数据服务还是页面服务1-有输入页面、2-无输入页面有输出页面、3-无输入页面无输出页面
            visit_num:'',//访问次数（调用次数）
            id:'',//原子服务ID
            apply_time:'',//申请时间
            approval_batchNo:0,
            approval_workflow:0,
            user_id:'',
            enterprise_id:'',
            belongType:'' ,
            service_end_time:'',
            service_start_time:'',
            service_brief:'',
            bg_img:'',
            logo_img:'',
            change_id:'',//变更服务id,
            audit_status:"",
            NAME:"",
            DEPARTMENT_NAME:""
          },
            isshow: true,
            remnant: 50,
            desc: "",
            auditParam:{
                reviewnotes:"",
                reviewstatus:2,
                audit_type:"2"
            },
          serviceType:[],
          startTime:'',
          endTime:'',
          isTrue:false,
          bg_img_url:'',
          logo_img_url:'',
          logo_img_status:0,
          bg_img_status:0,
          list1:{
            isShowInputBody:false,
            chartset:'',
            state:false,
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
            output_body:'',//输出格式
            intput_body:'',//输入格式
            request_type:'',//请求类型post、get、无
            request_port:'',//请求端口 docker端口
            url:'',//原子服务的请求路径 端口以后的ulr部分 
            serviceOutParam:[],//返回参数（输出）
          },
          applyInfo:[],
          isShow:false,
          isShow1:false,
          login_type:"",
          USERID:""
        }
    },
    components: {
        auditOperation
    },
    created(){
        this.formData.id=this.$route.query.id;
    },
    mounted(){
        this.getFormData(); 
        let that = this;
        $(".apply-actions").css({ width: that.getControllerWidth() + "px" });
        if (window.iscEvent) {
            window.iscEvent.on("menuchange", function () {
                let targetW = that.getControllerWidth();
                $(".apply-actions").animate({ width: targetW + "px" }, 500);
            });
        }
    },
    methods:{
        getControllerWidth() {
            let targetW = 0;
            if ($('body').hasClass('bigSreen') && !$('body').hasClass('bigSreen2')) {
                targetW = $(window).width() - 58;
            } else {
                targetW = $(window).width() - 208;
            }
            return targetW;
        },
        back(){
            this.$router.back(-1)
        },
        pass() {
            this.isshow = true;
            this.auditParam.reviewstatus = 2;
        },
        noPass() {
            this.isshow = false;
            this.auditParam.reviewstatus = 3;
        },
        descInput() {
            var txtVal = this.desc.length;
            this.remnant = 50 - txtVal;
        },
        getUserInfo() {
            let vm = this;
            apiClient.get("/pubapi/token/getUserByToken", {}, function(data) {
                if (data.status == 200) {
                    console.log("用户信息",data.results.userInfo)//平台PLATFORM;个人PERSONAL;企业ENTERPRISE
                    vm.login_type = data.results.userInfo.LOGIN_TYPE;
                    vm.USERID = data.results.userInfo.ID
                    if(vm.formData.userId == vm.USERID && vm.login_type == "PERSONAL"){
                        vm.isShow1 = false;
                        vm.isShow = true;
                    }else{
                        if(vm.applyInfo[vm.applyInfo.length-1].audit_phase == 3){
                            vm.isShow1 = false;
                            vm.isShow = true;
                        }
                        if(vm.applyInfo[vm.applyInfo.length-1].audit_phase == 2 && vm.applyInfo[vm.applyInfo.length-1].audit_status == 2 && vm.login_type == "PLATFORM"){
                            vm.isShow1 = true;
                            vm.isShow = true;
                        }
                        if(vm.applyInfo[vm.applyInfo.length-1].audit_phase == 2 && vm.applyInfo[vm.applyInfo.length-1].audit_status == 3 && vm.login_type == "PLATFORM"){
                            vm.isShow1 = false;
                            vm.isShow = true;
                        }
                        if(vm.applyInfo[vm.applyInfo.length-1].audit_phase == 2 && vm.login_type == "ENTERPRISE"){
                            vm.isShow1 = false;
                            vm.isShow = true;
                        }
                        if(vm.applyInfo[vm.applyInfo.length-1].audit_phase == 1 && vm.login_type == "ENTERPRISE"){
                            vm.isShow1 = true;
                            vm.isShow = true;
                        }
                        if(vm.applyInfo[vm.applyInfo.length-1].audit_phase == 1 && vm.login_type == "PLATFORM"){
                            vm.isShow1 = false;
                            vm.isShow = true;
                        }
                        if(vm.applyInfo[vm.applyInfo.length-1].audit_phase == 2 && vm.login_type == "PLATFORM"){
                            vm.isShow1 = true;
                            vm.isShow = true;
                        }
                    }
                    for(var i = 0 ; i < vm.applyInfo.length ; i ++){
                        if(vm.applyInfo[i].audit_time != undefined){
                            vm.applyInfo[i].audit_time = vm.format(vm.applyInfo[i].audit_time,"yyyy-MM-dd HH:mm:ss");
                        }
                    }
                } else {
                    TipBoxService.open(data.exception, 2);
                }
            });
        },
        getMoreInfo(i,list,name){
            let that=this;
            let obj=Object.assign({},list[i]);
            obj.isTrue=!obj.isTrue;
            if(name == "list2"){
                that.$set(that.list2.tableList, i, obj);
            }else if(name == "list3"){
                that.$set(that.list3.tableList, i, obj);
            }else if(name == "outParam"){
                that.$set(that.list3.serviceOutParam, i, obj);
            }
            // this.list2.tableList[i].isTrue = !this.list2.tableList[i].isTrue;
        },
        getFormData(){
            var that=this;
            var myData={id:that.formData.id};
            // LoadingBoxService.open('加载中')
            apiClient.post('itsmApi/atomicService/loadServiceInfo',myData,function(data){
                console.log("sdsaddas",data)
                that.formData.title="《"+data.results.data[0].name+"》  原子服务创建申请";
                if(data.results.userList != null){
                    that.formData.loginName=data.results.userList.USERNAME;
                    that.formData.Applicant=data.results.userList.TRUE_NAME;
                    that.formData.userId = data.results.userList.ID
                    that.formData.DEPARTMENT_NAME=data.results.userList.DEPARTMENT_NAME;
                    that.formData.tel=data.results.userList.PHONE;
                    that.formData.NAME=data.results.userList.NAME;
                }
                if(data.results.data[0].service_end_time == undefined){
                    that.endTime = "暂无数据";
                }else{
                    that.endTime = that.format(parseInt(data.results.data[0].service_end_time),'yyyy-MM-dd')
                }
                if(data.results.data[0].service_start_time == undefined){
                    that.startTime = "暂无数据";
                }else{
                    that.startTime = that.format(parseInt(data.results.data[0].service_start_time),'yyyy-MM-dd')
                }
                if(data.results.data[0].change_id == undefined){
                    that.change_id = "";
                }else{
                    that.change_id = data.results.data[0].change_id;
                }
                that.formData.bg_img = data.results.data[0].bg_img;
                that.formData.logo_img = data.results.data[0].img;
                if(that.formData.bg_img == "favicon.png" || that.formData.bg_img == ""){
                    that.bg_img_status = 1
                }
                if(that.formData.logo_img == "favicon.png" || that.formData.logo_img == ""){
                    that.logo_img_status = 1
                }
                that.formData.audit_status = data.results.data[0].audit_status;
                that.logo_img_url = apiClient.apiBaseUrl + '/itsmApi/attachment/show?imgPath=' + that.formData.logo_img + "&token="+apiClient.token;
                that.bg_img_url = apiClient.apiBaseUrl + '/itsmApi/attachment/show?imgPath=' + that.formData.bg_img + "&token="+apiClient.token;
                that.formData.service_brief = data.results.data[0].service_brief;
                that.formData.service_end_time = data.results.data[0].service_end_time;
                that.formData.service_start_time = data.results.data[0].service_start_time;
                that.formData.user_id = data.results.data[0].user_id;
                that.formData.enterprise_id = data.results.data[0].enterprise_id;
                that.formData.belongType = data.results.data[0].belong_type;
                that.formData.service_name=data.results.data[0].name;
                that.formData.apptype=data.results.data[0].apptype;
                that.formData.approval_batchNo = data.results.data[0].approval_batchNo
                that.formData.approval_workflow = data.results.data[0].approval_workflow
                if(that.formData.apptype == 1){
                that.formData.apptype = '远程服务';
                }else{
                that.formData.apptype = '应用服务';
                that.formData.portIsShow = true;
                }
                that.formData.service_url=data.results.data[0].address;
                if(data.results.data[0].service_tag != undefined){
                    let service_tag_tmp = data.results.data[0].service_tag;
                    if(typeof service_tag_tmp =="string"){
                        that.formData.service_tag=JSON.parse(service_tag_tmp);
                    }else {
                        that.formData.service_tag=data.results.data[0].service_tag;
                    }
                }
                that.formData.open_type=data.results.data[0].open_type;
                if(that.formData.open_type == 1){
                that.formData.open_type = '完全公开';
                }else{
                that.formData.open_type = '条件公开';
                }
                that.formData.service_remark=data.results.data[0].service_remark;
                that.formData.service_type=data.results.data[0].service_type;
                for(var i = 0 ; i < data.results.data[0].service_type.length ; i ++){
                    if(data.results.data[0].service_type[i] == 1){
                        that.serviceType.push("页面请求")
                    }else if(data.results.data[0].service_type[i] == 2){
                        that.serviceType.push("页面数据请求")
                    }else if(data.results.data[0].service_type[i] == 3){
                        that.serviceType.push("纯数据请求")
                    }
                }
                that.formData.visit_num=data.results.data[0].visit_num;
                that.formData.apply_time=data.results.apply_time;
                that.formData.service_param=data.results.data[0].service_param_detail;
                for(var i=0; i<that.formData.service_type.length; i++){
                var arr = that.formData.service_type[i];
                if(arr == '1'){
                    if(that.formData.service_param != undefined){
                        that.formData.service_param[i] = JSON.parse(that.formData.service_param[0]);
                        that.list1.url = that.formData.service_param[i].url;
                        that.list1.request_type = that.formData.service_param[i].request_type;
                        that.list1.chartset = that.formData.service_param[i].chartset;
                        if(that.list1.chartset == undefined || that.list1.chartset == ""){
                            that.list1.chartset = "无"
                        }
                        if(that.list1.request_type =='post'){
                            that.list1.isShowInputBody = true; 
                        }
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
                        that.list2.chartset = that.formData.service_param[i].chartset;
                        if(that.list2.chartset == undefined || that.list2.chartset == ""){
                            that.list2.chartset = "无"
                        }
                        if(that.list2.request_type =='post'){
                            that.list2.isShowInputBody = true; 
                        }
                        that.list2.input_body = that.formData.service_param[i].input_body;
                        that.list2.request_port = that.formData.service_param[i].request_port;
                        that.list2.tableList = that.formData.service_param[i].service_param;
                        for(var i = 0 ; i < that.list2.tableList.length ; i ++){
                            that.list2.tableList[i].isTrue = false
                        }
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
                        that.list3.chartset = that.formData.service_param[i].chartset;
                        if(that.list3.chartset == undefined || that.list3.chartset == ""){
                            that.list3.chartset = "无"
                        }
                        if(that.list3.request_type =='post'){
                            that.list3.isShowInputBody = true; 
                        }
                        for(var i = 0 ; i < that.list3.tableList.length ; i ++){
                            that.list3.tableList[i].isTrue = false
                        }
                        for(var i = 0 ; i < that.list3.serviceOutParam.length ; i ++){
                            that.list3.serviceOutParam[i].isTrue = false
                        }
                        that.list3.state = true;
                    }
                }
                }
                that.getApprovalInfo()
                that.getUserInfo()
                LoadingBoxService.close()
            });

        },
        submitApply(){
            var myData = {};
            var that = this;
            if(this.auditParam.reviewstatus=="3" && (this.desc=="" || this.desc == undefined)){//不通过时。校验备注信息
                TipBoxService.open("备注信息不能为空!", 2);
                return;
            }
            this.auditParam.reviewnotes = this.desc
            myData = {
                "serviceId":this.formData.id,
                "auditParam":this.auditParam
            }

            console.log(myData)
            myData.auditParam.approval_workflow = that.formData.approval_workflow;
            myData.auditParam.change_id = that.formData.change_id;
            if(that.formData.change_id!=""){//说明是变更
                myData.auditParam.audit_type = "4";//变更审批类型为4
            }
            var that = this;
            LoadingBoxService.open("正在处理....")
            apiClient.post("itsmApi/atomicService/auditAtomic", myData, function(data) {
                LoadingBoxService.close();
                if(data.status == 200){
                    TipBoxService.open("审批成功");
                    that.getApprovalInfo();
                }else{
                    TipBoxService.open(data.exception,2)
                }
            });
        },
        getApprovalInfo(){
        var myData = {
                        belongType:this.formData.belongType, 
                        appSubjectIdl : this.formData.id,
                        approvalType:"2",
                        enterpriseId:this.formData.enterprise_id,
                        applyUserId:this.formData.user_id,
                        batchNo:this.formData.approval_batchNo
                    };
                    console.log("查询审批流转参数",myData)
        var that = this;
        apiClient.post("itsmApi/applyInfo/loadAuditFlowInfo", myData, function(data) {
                if(data.status == 200){
                    that.applyInfo = [...data.results.data];
                    console.log("审批流转信息",that.applyInfo)
                    for(var i = 0 ; i < that.applyInfo.length ; i ++){
                        that.getUserInfo();
                    }
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
        }
    /*  back(){
        window.close();
     },*/
    },
  }
</script>
<style src="../../css/common/public.css" scoped></style>
<style src="../../css/detailPage/examineinfo.css" scoped></style>
