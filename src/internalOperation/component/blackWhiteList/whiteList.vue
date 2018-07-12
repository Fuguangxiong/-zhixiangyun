<template>
    <div class="collection">
        <!-- 栏目位置-->
        <div class="conCent">
            <div class="rise">
                <span class="textTlie">白名单管理</span>   
            </div>
            <div class="wordBlock tStyel">
                <span class="textName">限制对象：</span>
                <div>
                    <div class="search width248">
                        <input type="text" maxlength="17" placeholder="请输入IP／MAC/手机号搜索" class="inputStyle" v-model="myData.objName" @keyup.enter="searchEva">
                        <button class="searchBut"  @click="searchEva"><i class="icon iconfont icon-sousuo" ></i></button>
                    </div>
                </div>
            </div>
            <div class="wordBlock tStyel tStyelfuw ">
                <span class="textName">时长限制：</span>
                 <div class="listCon" :class="{checkboxShow: choicest}" v-show="isShowst">
                    <ul>
                        <li class="wti"  :class="{active:isAclass}" @click="seLinst()"><a>全部</a></li>
                        <!-- <li><a>永久</a></li>
                        <li><a>临时</a></li> -->
                      <li v-for="(fwzt,index) in dataliststat"  @click="toggle(index)" :class="{active: fwzt.checkbox}"><i class="cheboxInput"></i><em ><a>{{ fwzt.name }}</a></em></li>
                    </ul>
                </div>
                <!-- v-show="isShowBut" -->
                
                
            </div>
            <div class="wordBlock tStyel tStyelfuw ">
                <span class="textName">限制类别：</span>
                <div class="listCon" :class="{checkboxShow: choice}" v-show="isShow">
                    <ul :class="{heiauto: moredm}" id="wdtcst">
                        <li class="wti"  :class="{active:isAclass1}" @click="seLinst1()"><a>全部</a></li>
                        <!-- <li><i class="cheboxInput"></i><em><a>IP地址</a></em></li>
                        <li><i class="cheboxInput"></i><em><a>MAC地址</a></em></li>
                        <li><i class="cheboxInput"></i><em><a>用户</a></em></li> -->
                        <li v-for="(item,index) in datalist" @click="togglestate(index)" :class="{active: item.checkbox}"><i class="cheboxInput"></i><em><a>{{ item.name }}</a></em></li> 
                    </ul>
                </div>
                 <div class="rightBut"  style="display: none" >
                    
                    <button class="inpuChbox cheboxAllSyle" @click='cheboxAll()' :class="{active: choicest}"><i class="ico iconfont icon-iconjia"></i>{{cheboxtextst}}</button>
                </div>
                <div class="selected" v-show="!isShow">
                    <div class="selectedAll">
                        <span v-for="seleAll in cheboxArr">
                            {{ seleAll }}<i>,</i>
                        </span>
                        <em class="dataAll" @click="showAll()">x</em>
                    </div>
                </div>
                <div class="rightBut" v-show="isShow">
                    <!-- <button  v-show="isShowText" class="inpuChbox moreSytle" @click='moreAll()' :class="{active: moredm}"><i class="icon iconfont icon-arrow-down"></i><i class="icon iconfont icon-arrow-down-copy"></i>{{moretexe}}</button> -->
                 <button v-show="isShowDuoxuan" class="inpuChbox cheboxAllSyle" @click='cheboxAll()' :class="{active: choice}">{{cheboxtextst}}</button>
                  
                </div>
                
            </div>

           <div class="wordBlock tStyel tStyelfuw eva">
                <span class="textName">日期范围：</span>
                <div class="dateRangeMain">
                    <ul>
                        <!-- <li v-for="rqfw in dateRange"  @click="taggleDateRange" ><a>{{rqfw.name}}</a></li> -->
                        <li @click='nearlyTime("7")' :class="{active: isActive}">近一周</li>
                        <li @click='nearlyTime("30")' :class="{active: isActiveOne}">近一月</li>
                        <li @click='nearlyTime("90")' :class="{active: isActiveThree}">近三个月</li>
                        <li @click='nearlyTime("180")' :class="{active: isActiveSix}">近半年</li>
                    </ul>
                </div>
                <div class="customTime">
                    <span class="customTimeName">自定义时间:</span>
                      <el-date-picker
                          v-model="beginvalue"
                          type="date"
                          placeholder="选择日期" @change="beginFun" value-format="ms">
                        </el-date-picker>
                        <span class="">-----</span>  
                        <el-date-picker
                          v-model="endvalue"
                          type="date"
                          placeholder="选择日期" :picker-options="pickerOptions1" @change="endFun">
                        </el-date-picker>
                     
                    <span class="determineBtn" @click="choseSelectTime">确定</span>
                    <span class="checktimeclass" >{{checktime}}</span>
                </div>
            </div>

        </div>
        <!-- ／栏目位置 -->
        <div   class="queryList">
            <div class="queryListWord">
                <div class="sortCon">
                    <span :class="{active:activec=='zn'}" @click="sortFun('zn')">智能</span>
                    <span class="sortWord" :class="{active:activec=='lb','wordUp':!flagObj.lb}" @click="sortFun('lb')"><em>类别</em><i class="icon iconfont icon-jiantou-up"></i><i class="icon iconfont icon-jiantou-lower"></i></span>
                    <span class="sortWord" :class="{active:activec=='sx','wordUp':!flagObj.sx}" @click="sortFun('sx')"><em>时限</em><i class="icon iconfont icon-jiantou-up"></i><i class="icon iconfont icon-jiantou-lower"></i></span>
                    <!-- <span class="sortWord" :class="{active:activec=='zt','wordUp':!flagObj.zt}" @click="sortFun('zt')"><em>状态</em><i class="icon iconfont icon-jiantou-up"></i><i class="icon iconfont icon-jiantou-lower"></i></span> -->
                    <span class="sortWord" :class="{active:activec=='sj','wordUp':!flagObj.sj}" @click="sortFun('sj')"><em>时间</em><i class="icon iconfont icon-jiantou-up"></i><i class="icon iconfont icon-jiantou-lower"></i></span>
                </div>
                <div v-show="pegeShow">
                <div class="checkboxCon" v-show="checkFlag">
                    <div class="checkboxBut" @click="checkMore"><i class="icon iconfont icon-caozuo"></i></div>
                </div>
                 <div class="topPage" v-show="checkFlag">
                      <em><i class="cloer">{{myData.pageNum}}</i>/{{Math.ceil(pageTotal/myData.pageSize)}}</em>
                      <div class="pageTop" v-show="noDataPage">
                        <span @click="goNext(-1)">&lt;</span>
                        <span @click="goNext(1)">&gt;</span>
                      </div>
                  </div>
                <div class="more" v-show="!checkFlag">
                    <div class="sure" @click="surelFun">删除</div>
                    <div class="cancel" @click="cancelFun">取消</div>
                </div>
                </div>
            </div>
            <div v-if="showlist" class="listCon" :class="{nodata:!noData}" :style="{'height': !noData ? heightNub : 'auto' }">
                <div class="listLi" :class={evaluationLiFlag:!checkFlag}  v-for="(item,index) in listArry">
                   
                    <div :class="[item.limit_type==3 ? 'corner' :'normal']">
                         <div class="inpuRiog" v-show="!checkFlag" @click.stop="toCheckBox(index)"></div>
                    <div class="listLiLeft">
                       <dl>
                           <dd><span class="porAlik" >
                           <img v-if="item.order_type==1 && item.limit_type==3 " src="../../images/unip.png" alt="" >
                           <img v-if="item.order_type==2 && item.limit_type==3 " src="../../images/unmac.png" alt="" >
                           <img v-if="item.order_type==3 && item.limit_type==3 " src="../../images/unuser.png" alt="" >
                           <img v-if="item.order_type==1 && item.limit_type==1 || item.order_type==1 &&item.limit_type==2 " src="../../images/ip.png" alt="" >
                           <img v-if="item.order_type==2 && item.limit_type==1 || item.order_type==2 &&item.limit_type==2 " src="../../images/mac.png" alt="" >
                           <img v-if="item.order_type==3 && item.limit_type==1 || item.order_type==3 &&item.limit_type==2" src="../../images/user.png" alt="" ></span></dd>
                           <dt>
                               <h2 > <span class="porAlik" >{{item.title}}</span><em v-show="item.limit_type==1" class="permanentSign">永久</em><em v-show="item.limit_type==2 || item.limit_type==3" class="temporaryY">临时</em></h2>
                            
                               <h3><span class="controlServicesBiaos">控制服务：<span >{{item.serviceName}}</span></span><span class="founderName"><em>创建人：</em><em>{{item.username}}</em></span>  <span v-if="item.limit_type==2 ||item.limit_type==3" class="failureTime"><em>失效时间：</em><em>{{item.end_date|dataFormat}} {{item.end_date|timeFormat}}</em></span> </h3>
                               <p>备注：{{item.mark}}</p>
                           </dt>
                       </dl>
                      
                       <div class="score">
                           <div class="senior">
                               <span class="seniorGao">高级<i class="ico iconfont icon-arrow-down"></i></span>
                               <ul class="modifyDeleteUl">
                                   <li class="modifyDeleteLi"  @click="detailList(item)">修改</li>
                                   <li class="modifyDeleteLi" @click="deteleWhiteList(item.id)">删除</li>
                               </ul>
                            </div>
                           <!-- <div class="scoreCon">
                                <p class="pinfen">评分：<em class="fsClor"> {{item.avg}}</em></p>
                                <div class="xingxingCon">
                                    <el-rate v-model="item.avg" disabled></el-rate>
                                </div>
                           </div> -->
                       </div>
                    </div>
                    <div class="setCheok" >
                        <div class="setCheokCon">
                            <div class="setDat">
                                <div class="titles"><i class="icon iconfont icon-shijianzhongbiao"></i><em>创建时间</em> </div> 
                                <p>{{item.create_date|dataFormat}}  </p> 
                                <p>{{item.create_date|timeFormat}}</p> 
                            </div>  
                            <div class="checkItem" v-show="!checkFlag" @click.stop="toCheckBox(index)">
                                <div class="centr">
                                    <i class="icon iconfont icon-duigou" v-show="checkBox[index].flag"></i>
                                </div>
                            </div>
                            <div class="setEsc" @click="detailList(item)"><button>修改</button></div> 
                        </div>   
                    </div> 
                </div>
                </div>
                
            </div>
            <div v-else class="noInformation" > 
				<img src="../../images/zanwu.png"  >
		   </div> 
        </div>
         
        <div class="addIconBtn" @click="showMack">
            <i class="ico iconfont icon-iconjia"></i>
        </div>
            <!-- 添加弹框 -->
         <div class="overlay" v-show="mackBg">
            <div class="addBlackWhiteList" v-show="addBlackWhiteListMain">
                <div class="addBlackWhiteListTitle">
                    <span class="titleText">{{tankuangtitle}}</span>
                    <i class="ico iconfont icon-guanbi" @click="closeBtn"></i>
                </div>
                <div class="addBlackWhiteListCenter">
                    <!-- 修改时显示 -->
                    <div class="ipAddress" v-if="clickUpdate">
                            <span v-if="updateip" class="spanrcName"><i class="ico iconfont icon-asterisk"></i>IP地址：</span>
                            <span v-if="updatemac" class="spanrcName"><i class="ico iconfont icon-asterisk"></i>MAC地址：</span>
                            <span v-if="updateuser" class="spanrcName"><i class="ico iconfont icon-asterisk"></i>用户：</span>
                            <div class="spanInp">
                                <input type="text" readonly="readonly" v-model="listTitle" class="ipInput">
                            </div>
                    </div>
                    <div  class="restrictedCategory" v-if="addList">
                        <span class="spanrcName"><i class="ico iconfont icon-asterisk"></i>限制类别：</span>
                        <div class="ipMacUserMain">
                            <el-radio-group v-model="radio2" @change="showipmacuser()">
                            <el-radio :label="1" >ip地址</el-radio>
                            <el-radio :label="2" >MAC</el-radio>
                            <el-radio :label="3" >用户</el-radio>
                            </el-radio-group>
                        </div>
                    </div>

                    <div class="addressUserMain" v-if="addList">
                        <!-- IP地址 -->
                        <div class="ipAddress" v-show="showIp">
                            <span class="spanrcName"><i class="ico iconfont icon-asterisk"></i>IP地址：</span>
                            <div class="spanInp">
                                <input type="text" @blur="checkIp"  v-model="ipInfo" placeholder="例如：192.168.140.31" class="ipInput">
                            </div>
                            <span class="checkIpInfoSpan">{{checkIpInfo}}</span>

                        </div>
                       <!-- MAC地址 -->
                        <div class="macAddress" v-show="showMac">
                            <span class="spanrcName"><i class="ico iconfont icon-asterisk"></i>Mac地址：</span>
                            <div class="macInp">
                                <input type="text" id="type1" class="inputMac" v-model="items.type1" ref="1" maxlength="2" v-on:keyup.8="keyupFun('type1')"/>
                                <input type="text" id="type2" readonly="readonly" class="inputMac" v-model="items.type2" ref="2" maxlength="2" v-on:keyup.8="keyupFun('type2')"/>   
                                <input type="text" id="type3" readonly="readonly" class="inputMac" v-model="items.type3" ref="3" maxlength="2" v-on:keyup.8="keyupFun('type3')"/> 
                                <input type="text" id="type4" readonly="readonly" class="inputMac" v-model="items.type4" ref="4" maxlength="2" v-on:keyup.8="keyupFun('type4')"/> 
                                <input type="text" id="type5" readonly="readonly" class="inputMac" v-model="items.type5" ref="5" maxlength="2" v-on:keyup.8="keyupFun('type5')"/> 
                                <input type="text" id="type6" readonly="readonly" class="inputMac" v-model="items.type6" ref="6" maxlength="2" v-on:keyup.8="keyupFun('type6')"/>  
                            </div>
                            <span class="checkIpInfoSpan" style="    margin-left: -10px;">{{checkIpInfo}}</span>
                        </div>
                        
                        <!-- 用户 -->
                        <div class="userAddress" v-show="showUser">
                            <span class="spanrcName"><i class="ico iconfont icon-asterisk"></i>用户：</span>
                            <div class="userInp">
                                <div class="appHotConfigTcIp">	
                                        <div class="aui" >
                                            <input v-model="inputPhone" class="textPhone" autocomplete="off" placeholder="请输入用户手机号搜索">
                                        </div>
                                        <div class="aui-dd-parent resize-to-input" v-show="isShowSearched">
                                            <div class="aui-dropdown aui-dropdown-left">
                                                <ol class="last">
                                                    <li  v-for="item2 in pnoneList" >
                                                        <a href="javaScript:void(0)" @click=" selectItemInList(item2.ID,item2.PHONE,item2.isWhite)"  class="label-suggestion">
                                                            <span v-bind:class="item2.isWhite==2 ? 'inwhiteList':''"><em>{{item2.PHONE}}({{item2.USERNAME}})</em> <em v-show="item2.isWhite==2" class="showwhite">白名单</em> </span>   
                                                        </a>
                                                    </li>
                                                </ol>
                                            </div>
                                        </div>

                                
                                </div>
                                <div class="appHotConfigTcList">
                                    <ul>
                                        <li v-for="(list,index) in serverArray1" ><i class="ico iconfont icon-yonghu1"></i>{{list.phone}}
                                            <span class="icon iconfont icon-delete hovershow"  @click="deleteHotServer1(list)"></span>
                                        </li>		          		
                                    </ul>
                                </div>
                                <span class="checkIpInfoSpan">{{checkIpInfo}}</span>
                            </div>
                        </div>
                    </div>
                    <!-- 控制服务 -->
                    <div class="controlService" >
                        <span class="spanrcName"><i class="ico iconfont icon-asterisk"></i>控制服务：</span>
                        <div class="allSingleMain">
                        <div class="fullService">
                        <el-radio-group v-model="radio" @change="radioClicks">
                        <div class="radioboxR"><el-radio :label="1" >全部服务</el-radio></div>  
                        <div class="radioboxR"> <el-radio :label="2" >单个服务</el-radio> 
                            <div class="singleServiceInp" v-show="singleServiceInp">
                                    <div class="appHotConfigTcIp">	
                                        <div class="aui" >
                                            <input v-model.trim="inputValueInp" class="text" autocomplete="off" placeholder="请输入关键词搜索服务">
                                        </div>
                                        <div class="aui-dd-parent resize-to-input singleServiceMain" v-show="isShowSearchedSingle">
                                            <div class="aui-dropdown aui-dropdown-left">
                                                <ol class="last">
                                                    <li  v-for="item in serverList" :key="item.id">
                                                        <a href="javaScript:void(0)" @click="singleServiceInput(item.id,item.name)"  class="label-suggestion">
                                                            <span :title="item.name"><em>{{item.name}}</em></span>
                                                        </a>
                                                    </li>
                                                </ol>
                                            </div>
                                        </div>
                                </div>
                                
                                </div>
                        </div>

                        </el-radio-group>
                        <div class="checkservreInfo">{{checkservreInfo}}</div>
                        </div>
                        </div>
                    </div>
                


                    <!-- 时间限制 -->
                    <div class="timeLimit">
                        <span class="spanrcName"><i class="ico iconfont icon-asterisk"></i>时长限制：</span>
                        <div class="timeLimitMian">
                            <div class="permanentY">
                                <el-radio-group v-model="radioTime" @change="permanentYong()">
                                <el-radio :label="12" >永久</el-radio>
                                <el-radio :label="15" >临时</el-radio>
                                </el-radio-group>
                            </div>
                            <div class="temporaryL">
                                <div class="temporaryTime" v-show="temporaryTimeTerm">
                                    <span class="termValidity">有效期至</span>
                                    <el-date-picker
                                    v-model="value1"
                                    type="datetime"
                                    placeholder="选择日期时间" :picker-options="pickerOptions">
                                    </el-date-picker>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- 备注 -->
                    <div class="remarksBeiz">
                        <span class="spanrcName"><i class="ico iconfont icon-asterisk"></i>备注：</span>
                        <div class="remarksBeizText">
                            <textarea  v-model.trim="textarea"  @input="descInput"  maxlength="30" placeholder="备注最多30个字"></textarea>
                            <!-- <el-input
                            type="textarea"
                            :rows="2"
                            placeholder="请输入内容"
                            v-model="textarea" @input="descInput">
                            </el-input> -->
                            <span class="checkMarkinfo">{{checkMarkinfo}}</span>
                        
                            <span class="checknum"><span class="remnants">{{remnant}}</span>/30</span> 
                        </div>
                    </div>
                </div>
                <div class="addBlackWhiteListBtn">
                    <button class="confirmBtn" @click="submit">确认</button>
                    <button @click="closeBtn">取消</button>
                </div>
            </div>
        </div>
           <div class="block" v-show="noDataPage">
                <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page.sync="myData.pageNum"
                :page-size="myData.pageSize"
                layout="prev, pager, next, jumper"
                :total="pageTotal">
                </el-pagination>
        </div> 
        
    </div>
    
</template>
<script>
import $ from 'jquery';
import NoticeBox from '../../common/NoticeBox.js';
import userService from '../../../publicJs/userService.js';
import apiToken from '../../../publicJs/apiToken.js';
import apiClient from '../../../publicJs/ApiClient.js';
import LoadingBoxService from '../../../publicJs/LoadingBoxService.js';
import UserCookieService from '../../../publicJs/UserCookieService.js';
import UtilService from '../../../publicJs/UtilService.js';
import publicPathConfig from '../../../publicJs/publicPathConfig.js';
import appPublicJs from '../../common/public.js';
import TipBoxService from '../../../publicJs/TipBoxService.js';
export default {
      name: 'collection',
      data () {
      return {
                 // 临时时间不能选当前时间之前的时间
              pickerOptions: {
                   disabledDate (time) {
                   return time.getTime() < Date.now() - 1 * 24 * 3600 * 1000
                 }
                 },
                 pickerOptions1: {
                   disabledDate(time) {
                   return time.getTime() > Date.now();
                }
                },
              items: {
                                  type1: '', type2: '', type3: '', type4: '', type5: '', type6: '' },
              isActive: false, // 近一周
              isActiveOne: false, // 近一月
              isActiveThree: false, // 近三月
              isActiveSix: false, // 近半年
              mackBg: false, // 关闭弹窗
              addBlackWhiteListMain: false,
              beginvalue: '', // 开始日历
              endvalue: '', // 结束日历
              activec: 'zn',
              texeSize: 0, // 标签数量
              checkFlag: true,
              active: 0,
              choicest: false, // 判断是单选还是多选状态
              choice: false, // 判断是单选还是多选
              moredm: false, // 更多
              cheboxdm: false, // 多选
              listArry: [], // 列表查询
              cheboxArr: [], // 限制类别
              cheboxArrstatus: [], // 状态多选
              checkBox: [],
              moretexe: '更多',
              cheboxtext: '多选',
              cheboxtextst: '多选',
              flagObj: {
                  lb: false, // 类别
                  sx: false, // 时限
                  sj: false// 时间
                },
              myData: {
                  tagTime: '7',
                  sort: 'desc', // 排序(desc asc)
                  nameType: 'zn', // 排序名称("zn","lb","sx","sj")
                  pageSize: 10,
                  pageNum: 1,
                  bwType: 2, // 类型（1黑，2白，3评论黑名单）
                  objName: '', // 限制对象 (ip,mac,姓名模糊)
                  limitType: '', // 时限类型 (全部 永久 临时)
                  restrictedCategory: '', // 限制类别  (ip,mac,姓名分类筛选)
                  startDate: '', // 开始时间
                  endDate: '' //结束时间
                },
              atveSize: 0, // 知道我选中了几个标签
              isAclass1: true, // 控制关键词标签高亮
              isAclass: true, // 控制关键词状态高亮
              pageTotal: 1, // 分页默认
              isShow: true,
              isShowst: true,
              isShowDuoxuan: false,
              isShowText: false,
              noData: true,
              noDataPage: false, // 少于一页分页不显示
              heightNub: 100, // 未查询到数据显示dome 的默认高度
              pegeShow: true, // 根据分页显示隐藏
              isShowBut: true, // 栏目一右边按钮控制
              datalist: [], // 时长限制数组
              dataliststat: [], // 限制类别数组
              searSize: true,
              textarea: '', // 备注
                  // 临时-日历插件
              temporaryTimeTerm: false,
              serverList: ['a', 'b', 'c'],
              isShowSearchedSingle: false, // 单个服务的输入框
              isShowSearched: false, // 用户输入狂
              radio2: 1, // 限制类别单选框
              radio: 1, // 控制服务单选
              radioTime: 12, // 控制服务单选
              serverArray2: [],
              showIp: true, // 是否显示ip
              showMac: false, // 是否显示mac
              showUser: false, // 是否显示user
              inputValue: '', // 用户
              inputValueInp: '', // 服务
              value1: '', // 临时时间的截至日期
              clickUpdate: false, // 点修改时弹框显示的内容
              addList: true, // 点击添加时探矿显示的内容
              updateip: false, // 修改时显示（ip/mac/user）
              updatemac: false, // 修改时显示（ip/mac/user）
              updateuser: false, // 修改时显示（ip/mac/user）
              listTitle: '', // 限制类型的名称
              tankuangtitle: '添加白名单', // 弹框显示的标题
              id: '', // 用修改时存储白名单id
              ordertype: '', // 修改时判断类型（ip/mac/user）
              ipInfo: '',
              checkIpInfo: '',
              inputPhone: '', // 用户手机号
              pnoneList: [],
              serverArray1: [],
              remnant: 30, // 剩余可输入字数
              checkservreInfo: '', // 验证服务
              checkMarkinfo: '', // 验证备注
              falseIp: false,
              singleServiceInp: false,
              selectItem: false, // 选择服务下拉框加不加载
              checktime: '',
              showlist: true
            }
    },
      created () {
      this.LabelText()//请求标签
       this.servicetagsText()//请求标签2
        this.tokenId = this.$route.query.tokenId || userService.getTokenId()
        if (this.tokenId != undefined) {
          var that = this
        UserCookieService.userInfoToCookie(this.tokenId, function (userName, images) {

        })
        }
    },
      filters: {
      dataFormat: function (value) {
              return UtilService.formatDuring(value, 'yyyy-MM-dd')
            },
      timeFormat: function (value) {
              return UtilService.formatDuring(value, 'HH:mm:ss')
            },
      imgPath: function (value) {
              return apiClient.apiBaseUrl + appPublicJs.serviceImgShow + value
            }
    },
      mounted () {
      this.myData.tagTime = '7'
      this.getList()
        this.domWith()
        this.domHieg()
    },
      watch: {

        items: {
             handler: function (val, oldval) {
                  var reg = new RegExp('^[0-9a-zA_Z]+$')
                //    if(!reg.test(this.items.type1)){
                //        this.items.type1="";
                //        this.checkIpInfo="请输数字英文"
                //    }
                   
                 var _this = this
                 var _sum = 2 //字体限制为100个
                  for (var key in val) {
                    debugger
                       if (!reg.test(val[key]) && val[key] != '') {
                         val[key] = '';
                         this.checkIpInfo = '请输数字英文'
                         return
                       } else{
                         let num = parseInt(key.replace(/[^0-9]/ig, ''))
                       let beforenum = num - 1
                      if (val[key].length == 2) {
                        let num = parseInt(key.replace(/[^0-9]/ig, ''))
                            let nextnum = num + 1
                            if (num != 6) {
                              $('#type' + nextnum).attr('readonly', false)
                                $('#type' + nextnum).focus()
                                 $('#type' + num).addClass('bordercolor')
                                $('#type' + num).attr('readonly', true)
                            }else {
                              $('#type' + num).addClass('bordercolor')
                            }
                      }
                       }
                  }
                },
             deep: true
           },
          	inputPhone (value) {
            if (value === '') {
               		this.isShowSearched = false
                  	return
}
            if (!this.selectItem) {
                  this.remoteMethodUser(value)
                  this.isShowSearched = true
                } else {
                  this.isShowSearched = false
                  this.selectItem = false
                }
          },
            // 服务下拉
        inputValueInp (value) {
              debugger
				if (value === '') {
               		this.isShowSearchedSingle = false
                  	return
}
              if (!this.selectItem) {
                  this.remoteMethod(value)
                  this.isShowSearchedSingle = true
                } else {
                  this.isShowSearched = false
                  this.selectItem = false
                }
            }
      },
      methods: {
      nearlyTime (time) { // 近一月
         // debugger
           var that = this
    //   var datas = new Date()
      // that.myData.endDate = new Date().getTime()
      // that.myData.startDate = new Date().getTime() - time * 24 * 3600 * 1000
           if (time === '7') {
        that.isActive = true
        that.isActiveOne = false
        that.isActiveThree = false
        that.isActiveSix = false
        that.myData.tagTime = '7'
      } else if (time === '30') {
        that.isActive = false
        that.isActiveOne = true
        that.isActiveThree = false
        that.isActiveSix = false
        that.myData.tagTime = '30'
      } else if (time === '90') {
        that.isActive = false
        that.isActiveOne = false
        that.isActiveThree = true
        that.isActiveSix = false
        that.myData.tagTime = '90'
      } else if (time === '180') {
        that.isActive = false
        that.isActiveOne = false
        that.isActiveThree = false
        that.isActiveSix = true
        that.myData.tagTime = '180'
      };
           that.getList()
         },

        // 新增剩余字数
      descInput () {
  var txtVal = this.textarea.length
				if (txtVal <= 30) {
  this.remnant = 30 - txtVal
				} else{
  this.canwrite = true	
				}
},
      deleteHotServer1 (item) {
         // 原声数组remove()
          Array.prototype.remove = function (list) {
              var a = this.indexOf(list) 
                if (a >= 0) {
                  this.splice(a, 1) 
                    return true 
                }
              return false 
            };
          for (var i = 0; i < this.serverArray1.length; i++) {
           if (this.serverArray1[i].id == item.id) {
               this.serverArray1.remove(item)
             }
         }
        },
         // 用户
      remoteMethodUser (value) {
              if (value !== '') {
  apiClient.get(apiToken.newApi('/ioapi/bwlist/getBwListByPhoneToUser/'), {
  phone: value,
  bwType: 1
}).then(data => {
  if (appPublicJs.checkData(data.userlist)) {
  this.pnoneList = data.userlist
                            this.isShowSearched = true
						} else{
  this.isShowSearched = false
  return
}
}).catch(e => {
  console.error(e)
})
}
		    },
         // IP地址输入格式验证
      checkIp () {
          var that = this
           var pattern = new RegExp('^(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|[1-9])\\.'+
                                        '(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|\\d)\\.'+
                                        '(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|\\d)\\.'+
                                        '(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|\\d)$')
            if (!pattern.test(that.ipInfo)) {
              this.checkIpInfo = '请输入正确IP'
                this.falseIp = true
                return;
            } else{
              this.checkIpInfo = ''
                this.falseIp = false
            }
        },
     // 监听backspace事件
      keyupFun (id) {
         if ($('#' + id).val().length == 0) {
             let beforen = parseInt(id.replace(/[^0-9]/ig, ''))
               let altern = parseInt(id.replace(/[^0-9]/ig, '')) + 1
                let num = parseInt(id.replace(/[^0-9]/ig, '')) - 1
                $('#type' + num).attr('readonly', false).focus()
                $('#type' + beforen).removeClass('bordercolor')
                $('#type' + altern).attr('readonly', true)
                
           }
       },
        // 服务下拉列表
      remoteMethod (value) {
          if (value !== '') {
  apiClient.get(apiToken.newApi('/ioapi/bwlist/getSearchServiceByName/'), {
  name: value
}).then(data => {
  if (appPublicJs.checkData(data.data)) {
  this.serverList = data.data
							this.isShowSearchedSingle = true
} else{
  this.isShowSearchedSingle = false
  return
}
}).catch(e => {
  console.error(e)
})
}
		    },
        // 删除黑白名单
      deteleWhiteList (id) {
          debugger
            var that = this
          var id = id
            var mydate = {
              id: id
            }
          let sure = function () {
              apiClient.delete(apiToken.newApi('/ioapi/bwlist/delBwList/'), mydate, function (data) {
              NoticeBox.close()
                that.isShow = true
                that.isAclass1 = true
                TipBoxService.open('删除成功', 0) 
                that.checkFlag = true
                that.myData.pageNum = 1
                that.mackBg = false
                that.getList()
            })
            }
          NoticeBox.open('是否删除所选内容，删除后将无法撤回！', '', sure)
        },
        // 点击确定按钮提交
      submit () {
          var that = this
            var serviceid = '';
          var limitType = '';
          var endDate = '';
          var mark = that.textarea
            if (that.radio == 1) {
              serviceid = '*'
            } else{
                // 判断服务是否为空
              if (that.serverArray2.length == 0) {
                  that.checkservreInfo = '请选择服务';
                  return
                } else{
                  debugger
                   serviceid = that.serverArray2[0].serverId
                  that.checkservreInfo = '';
                }
            }
            // 判断备注是否为空
          if (mark == '') {
              that.checkMarkinfo = '备注不能为空'
              return
            } else{
              that.checkMarkinfo = ''
            }
          if (that.radioTime == 12) {
              limitType = 1
                } else{
              limitType = 2
                    endDate = new Date(that.value1).getTime()
            }
          if (that.tankuangtitle == '修改白名单') {
              var id = that.id
                var startDate = that.myData.startDate
                var restrictionValue = this.listTitle
                var orderType = this.ordertype
                    var mydate = {
                      id: id,
                      serviceId: serviceid, // 服务id
                      bwType: 2, // 类型（1黑，2白，3评论黑名单）
                      limitType: limitType, // 时限类型 (全部 永久 临时)
                      startDate: startDate, // 开始时间
                      endDate: endDate, // 结束时间
                      mark: mark

                    }

              apiClient.put(apiToken.newApi('/ioapi/bwlist/updateBwList/'), mydate, function (data) {
                      console.info(data)
                    that.mackBg = false
                    that.addBlackWhiteListMain = false
                    var date = new Date()
                    that.endvalue = date.toString('r') 
                    // that.myData.endDate=new Date(that.endvalue).getTime()
                    // that.myData.startDate=new Date(that.endvalue).getTime()-365 * 24 * 3600 * 1000;
                      that.myData.tagTime = '7'
                      that.getList()
                    })
            } else if (that.tankuangtitle == '添加白名单') {
              var that = this
                    var namelist = []
                    var restrictionValue = '';
              var restrictedCategory = ''
              var amcaddress = that.items.type1 + '-' + that.items.type2 + '-' + that.items.type3 + '-' + that.items.type4 + '-' + that.items.type5 + '-' + that.items.type6
              for (var i = 0; i < that.serverArray1.length; i++) {
                      namelist.push(that.serverArray1[i].id)
                    }
              if (that.radio2 == 1) {
                      if (that.ipInfo == '') {
                          that.checkIpInfo = 'ip地址不能为空';
                          return
                        } else{
                          restrictionValue = that.ipInfo
                            restrictedCategory = 1
                            that.checkIpInfo = '';
                        }
                    } else if (that.radio2 == 3) {
                      if (namelist.toString() == '') {
                          that.checkIpInfo = '用户不能为空';
                          return
                        }else {
                          restrictionValue = namelist.toString()
                            restrictedCategory = 3
                            that.checkIpInfo = '';
                        }
                    }else {
                      if (amcaddress == '-----' || amcaddress.length != 17) {
                          that.checkIpInfo = 'MAC输入错误';
                          return
                        } else{
                          restrictionValue = amcaddress
                            restrictedCategory = 2
                            that.checkIpInfo = '';
                        }
                    }
              if (that.falseIp == true) {
                      this.checkIpInfo = '请输入正确IP'
                           return;
                    }
              var myData = {
                      'restrictedCategory': restrictedCategory,
                      'restrictionValue': restrictionValue,
                        // "fullService" :that.radio2,
                      'limitType': limitType,
                      'mark': mark,
                      'bwType': 2,
                      'endDate': endDate,
                      'serviceId': serviceid
                    }

              console.log(33333, myData)
              apiClient.post(apiToken.newApi('/ioapi/bwlist/addBwList/'), myData).then(data => {
                          if (data.status == true) {
                              that.closeBtn()
                                TipBoxService.open('添加白名单成功', 0) 
                                that.myData.tagTime = '7'
                              that.getList()
                            }else {
                              TipBoxService.open('添加白名单失败', 2)
                            }
                        }).catch(e => {
                          console.error(e)
                        })
            }
        },
      showipmacuser () {
          this.checkIpInfo = '';
          this.falseIp = false
            //console.info(this.radio2);
          if (this.radio2 == 1) {
            this.showIp = true
              this.showMac = false
              this.showUser = false
          } else if (this.radio2 == 2) {
            this.showIp = false
              this.showMac = true
              this.showUser = false
          } else if (this.radio2 == 3) {
            this.showIp = false
              this.showMac = false
              this.showUser = true
          }
        },
         // 点击添加按钮显示添加弹窗
      showMack () {
            this.checkMarkinfo=""
          this.value1=""
          this.checkIpInfo=""
          this.inputPhone = ''
          this.items.type1 = '';
          this.items.type2 = '';
          this.items.type3 = '';
          this.items.type4 = '';
          this.items.type5 = '';
          this.items.type6 = '';
          this.textarea = '';
          this.endDate = '';
          this.ipInfo = '';
          this.serverArray1 = []
            this.inputValueInp = '';
          this.tankuangtitle = '添加白名单'
          this.clickUpdate = false
            this.radio2 = 1
            this.radio = 1
            this.radioTime = 12
            this.addList = true
            this.mackBg = true
            this.addBlackWhiteListMain = true
            this.remnant=30;
        },
        // 点击弹窗关闭按钮-关闭弹窗
      closeBtn () {
          $('#type1').attr('readonly', false)
            $('#type2').attr('readonly', true)
            $('#type3').attr('readonly', true)
            $('#type4').attr('readonly', true)
            $('#type5').attr('readonly', true)
            $('#type5').attr('readonly', true)
            $('#type6').attr('readonly', true)
              //点击添加重置弹框
            $('#type1').removeClass('bordercolor')
            $('#type2').removeClass('bordercolor')
            $('#type3').removeClass('bordercolor')
            $('#type4').removeClass('bordercolor')
            $('#type5').removeClass('bordercolor')
            $('#type6').removeClass('bordercolor')
            this.mackBg = false
            this.addBlackWhiteListMain = false
        },
          // 时间限制点击控制
      permanentYong () {
          if (this.radioTime == 12) {
              this.temporaryTimeTerm = false
            } else if (this.radioTime == 15) {
              this.temporaryTimeTerm = true
            }
        },

        // 控制服务
      radioClicks () {
          if (this.radio == 1) {
              this.singleServiceInp = false
            } else if (this.radio == 2) {
              this.singleServiceInp = true
            }
        },
  // 选择时间查询
      choseSelectTime () {
          debugger
              if (this.checktime == '') {
                if (this.endvalue == '') {
                    this.checktime = '请选择结束时间'
                    return
                  } else if (this.beginvalue == '') {
                    this.checktime = '请选择开始时间'
                    return
                  } else{
                    this.myData.tagTime = 0
          this.myData.endDate = UtilService.formatDuring(new Date(this.endvalue).getTime(), 'yyyy-MM-dd')
                    this.myData.startDate = UtilService.formatDuring(new Date(this.beginvalue).getTime(), 'yyyy-MM-dd')
         // this.myData.startDate=new Date(this.beginvalue).getTime();
                    this.getList()
                  }
              }else {
                return
              }
        },
        // 日历
      beginFun () {
          if (this.beginvalue != '' && new Date(this.beginvalue).getTime() > new Date()) {
             this.checktime = '开始时间需小于当前日期'
           } else if (this.beginvalue != '' && new Date(this.beginvalue).getTime() > new Date(this.endvalue).getTime()) {
               this.checktime = '开始日期需小于结束日期'
             }else {
               this.checktime = ''
             }
        },
      endFun () {
          if (this.endvalue != '' && new Date(this.beginvalue).getTime() > new Date(this.endvalue).getTime()) {
              this.checktime = '结束日期需大于开始日期'
            } else{
              this.checktime = ''
            }
        },
      handleCurrentChange () {
          this.getList()
        },
      handleSizeChange () {},
        // 全部状态查询
      seLinst () {
          var that = this
            var myData = ''
            that.active = false
            that.isAclass = true
            that.myData.limitType = ''
           //点击全部取消其他关键词高亮
           for (var i = 0; i < that.dataliststat.length; i++) {
             that.dataliststat[i].checkbox = false
           }
          that.myData.pageNum = 1
            that.getList()
        },
        // 全部服务查询
      seLinst1 () {
          var that = this
            var myData = ''
            that.active = false
          
            that.isAclass1 = true
            that.myData.restrictedCategory = ''
            //点击全部取消其他关键词高亮
           for (var i = 0; i < that.datalist.length; i++) {
             that.datalist[i].checkbox = false
           }

          that.myData.pageNum = 1
            that.getList()
            
        },
        // 多选状态
      toggle (e) {
          var that = this
            var sArr = []
            that.isAclass = false
            // 如果是多选就不查询，单选就查询
       
            if (that.choice) {
              that.dataliststat[e].checkbox = !that.dataliststat[e].checkbox
                for (var i = 0; i < that.dataliststat.length; i++) {
                  if (that.dataliststat[i].checkbox) {
                     sArr.push(that.dataliststat[i].name)
                         that.atveSize = sArr.length
                   } else{

                   }
                }
            } else{
              for (var i = 0; i < that.dataliststat.length; i++) {
                      that.dataliststat[i].checkbox = false
                    }
              that.dataliststat[e].checkbox = true
                 
                     if (that.dataliststat[e].name == '永久') {
                       that.myData.limitType = 1
                      } else{
                       that.myData.limitType = 2
                     }

              that.myData.pageNum = 1
                    that.getList()
              }
          console.info('dsds', that.dataliststat)
        },
         // 多选标签确定
      cheboxAll () {
          var that = this
            var sty = ''
            var codeNmae = []
            for (var i = 0; i < that.datalist.length; i++) {
              if (that.datalist[i].checkbox) {
                      that.cheboxArr.push(that.datalist[i].name)
                         codeNmae.push(that.datalist[i].code)
                    }
            }
          that.choice = true
            console.info('bq', that.cheboxArr)
          for (var i = 0; i < codeNmae.length; i++) {
              codeNmae[i] ? sty += codeNmae[i] + ',':''
            }
            // 多选查询
          if (that.cheboxtextst == '确定') {
              console.info('进来了', that.atveSize)
                // 如果多选状态下没有选中就当取消
              if (that.atveSize <= 0) {
                  that.cheboxtextst = '多选'
                  that.choice = false
                    return false
                }
                // 如果多选状态下没有选中1一个就走单选
              if (that.atveSize == 1) {
                  console.info('只能选中一个')
                  that.cheboxtextst = '多选'
                  that.choice = false
                    that.myData.restrictedCategory = sty
                    that.myData.pageNum = 1
                    that.getList()
                    return false
                } else{
                  console.info('1个进来了', that.atveSize)
                }
              that.isShow = false
                that.cheboxtextst = '多选'
              that.choice = false
                that.myData.restrictedCategory = sty
                that.myData.pageNum = 1
                that.getList()
                return false
                
            } else{
              that.cheboxArr = []
            }
          that.cheboxtextst = '确定';
        },
        // 多选状态
      togglestate (e) {
          var that = this
            that.isAclass1 = false
            var sArr = []

          if (that.choice) {
              that.datalist[e].checkbox = !that.datalist[e].checkbox
                for (var i = 0; i < that.datalist.length; i++) {
                  if (that.datalist[i].checkbox) {
                     sArr.push(that.datalist[i].name)
                         that.atveSize = sArr.length
                   } else{

                   }
                }
            } else{
              for (var i = 0; i < that.datalist.length; i++) {
                      that.datalist[i].checkbox = false
                    }
              that.datalist[e].checkbox = true
              that.myData.restrictedCategory = that.datalist[e].code
              that.myData.pageNum = 1
              that.getList()
              }
        },
        // 多选
      cheboxAllstate () {
          var that = this
            that.cheboxArrstatus = []
            for (var i = 0; i < that.dataliststat.length; i++) {
              if (that.dataliststat[i].checkbox) {
                      that.cheboxArrstatus.push(that.dataliststat[i].name)
                    }
            }

          that.choicest = true
            
            if (that.cheboxtextst == '确定') {
              that.isShowst = false
                that.cheboxtextst = '多选'
              that.choicest = false
                return false
            }
          that.cheboxtextst = '确定';
        },
       // 分页
      goNext (n) {
         this.myData.pageNum = this.myData.pageNum + n
        if (this.myData.pageNum == 0) {
          this.myData.pageNum = 1
          return
        }
         if (this.myData.pageNum == Math.ceil(this.pageTotal / this.myData.pageSize) + 1) {
          this.myData.pageNum = Math.ceil(this.pageTotal / this.myData.pageSize)
          return
        }
       },
        // 更多
      moreAll () {
          var that = this
            that.moredm = !that.moredm
            if (that.moredm) {
              that.moretexe = '收起';
            }else {
              that.moretexe = '更多';
            }
        },
        // 取消重新选中
      showAll () {
          var that = this
            that.atveSize = ''
            that.isShow = true
            that.isAclass1 = true
            that.myData.restrictedCategory = ''
            that.myData.pageNum = 1
            that.getList()
            for (var i = 0; i < that.datalist.length; i++) {
              that.datalist[i].checkbox = false
            }
        },
        // 设置多选删除
      toCheckBox (index) {
           debugger
             this.checkBox[index].flag = !this.checkBox[index].flag
             
            // this.$set(this.checkBox[index],"flag",!this.checkBox[index].flag);
           
      
        },
        // 菜单排序查询
      sortFun (flag) {
          var that = this
         if (!that.noData) return false
        
          for (let key in this.flagObj) {
            if (key == flag) {
                this.flagObj[key] = !this.flagObj[key]
                this.flagObj[key] ? this.myData.sort = 'desc':this.myData.sort = 'asc'
              } else {
                this.flagObj[key] = false
              }
          }
          this.activec = flag
            this.myData.nameType = flag
            this.myData.pageNum = 1
            this.getList()
        },
      checkMore () {
          this.checkFlag = false
            for (let i = 0; i < this.checkBox.length; i++) {
              this.$set(this.checkBox[i], 'flag', true)
            }
        },
        // 取消批量删除
      cancelFun () {
          this.checkFlag = true 
        },

        // 页面元素布局得到页面长度
      domWith () {
          var that = this 
          var box = $('#wdtcst'),
            boxUlWit = box.width(),
            boxUlLi = box.find('li').outerWidth(true)
              that.texeSize = parseInt(boxUlWit / boxUlLi)
        },
        // 页面元素布局得到高度
      domHieg () {
           var that = this 
             var bodyhg = document.body.clientHeight
             var pluHade = $('.publicTopNavComponent').outerHeight(true)//公共组件高度
             var topHade = $('.conCent').outerHeight(true)//头部高度
             var sortDm = $('.queryListWord').outerHeight(true)//排序高度
               
                that.heightNub = bodyhg - pluHade - topHade - sortDm + 'px'
             
         },
        // 搜索
      searchEva () {
          if (this.searSize) {
          this.searSize = false
                this.listArry = []
                this.getList()
        } else{
          this.searSize = true
                this.listArry = []
                this.getList()
        }
        },
        // 状态标签请求
      LabelText () {
          var myData = {
              type: '0021'
            }
            var that = this
            that.dataliststat = []
            apiClient.get(apiToken.newApi('pubapi/dictionary/getDictionaryByType/'), myData, function (data) {
              if (data.results.length <= 1) {
                 that.isShowBut = false
               } else{
                 that.isShowBut = true
               }
              console.info(data.results.list)
                for (var i = 0; i < data.results.list.length; i++) {
                  var obj = {
                    name: data.results.list[i].DICT_VALUE,
                    checkbox: false,
                    code: data.results.list[i].DICT_KEY,
                    index: data.results.list[i].DICT_KEY
                  }

                  that.dataliststat.push(obj)
                }
            })
        },
        // 标签请求2
      servicetagsText () {
          var myData = {
              type: '0022'
            }
            var that = this
           that.datalist = []
            apiClient.get(apiToken.newApi('pubapi/dictionary/getDictionaryByType/'), myData, function (data) {
              console.info('lala2', data.results)
              if (data.results.list.length > 1) {
                 that.isShowDuoxuan = true
                } else{
                 that.isShowDuoxuan = false
                }

              for (var i = 0; i < data.results.list.length; i++) {
                   var obj = {
                      name: data.results.list[i].DICT_VALUE,
                      checkbox: false,
                      code: data.results.list[i].DICT_KEY,
                      index: data.results.list[i].DICT_KEY
                    }

                   that.datalist.push(obj)
                 }
            })
        },
        // 列表
      getList () {
           let that = this
            LoadingBoxService.open('加载中...')
            apiClient.get(apiToken.newApi('/ioapi/bwlist/getBwList/'), that.myData, function (data) {
              LoadingBoxService.close()     
                //  没有数据
                 if (data.results.total == 0) {
                   that.noData = false
                    that.pegeShow = false
                     that.showlist = false
                      that.noDataPage = false
                   return false
                }else {
                   that.showlist = true
                   that.noData = true
                 that.listArry = data.results.data
                   that.pageTotal = data.results.total
                
                 if (that.pageTotal > 1) {
                   that.pegeShow = true
                 } else{
                   that.pegeShow = false
                 }
                // 判断如果内容长度小于一页不显示分页
                   if (that.myData.pageSize >= data.results.total) {
                   that.noDataPage = false
                    }else {
                   that.noDataPage = true
                    }

                   for (var i = 0; i < that.listArry.length; i++) {
                      that.checkBox.push({'flag': true, 'id': that.listArry[i].id})
                }
                 }
            }
            )
            },
        // 修改
      detailList (item) {
          var serverObj = {}
          serverObj.serverId = item.service_id;// 服务id
          serverObj.serverName = item.serviceName;// 服务名
          this.serverArray2.push(serverObj);
          this.selectItem = true
            debugger;
          if (item.order_type == 1) {
              this.updateip = true
                this.updatemac = false
                this.updateuser = false
            } else if (item.order_type == 2) {
              this.updatemac = true
                this.updateuser = false
                this.updateip = false
            } else{
              this.updateuser = true
                this.updateip = false
                this.updatemac = false
            }
          var that = this
            console.info(item)
            this.addList = false
            this.clickUpdate = true
            if (item.service_id == '*') {
              this.radio = 1
              this.inputValueInp = '';
            }else {
              this.radio = 2
              this.inputValueInp = item.serviceName
            }
          if (item.limit_type == 1) {
              this.radioTime = 12
            }else {
              this.radioTime = 15
              this.value1 = new Date(item.end_date)
                console.info(this.value1)
            }
          this.remnant = 30 - item.mark.length
          this.tankuangtitle = '修改白名单'
          this.listTitle = item.title
            this.textarea = item.mark
            this.mackBg = true
           
            //$("#uservername").html(item.serviceName)
            this.addBlackWhiteListMain = true
            this.id = item.id
            this.myData.startDate = item.start_date
            this.ordertype = item.order_type
              
        },
        // 删除批量
      surelFun () {
           debugger
            let id = ''
           this.checkBox.forEach(element => {
              element.flag ? id += element.id + ',':''
            })
             
            console.info('ididid', id.substring(0, id.length - 1))
           if (id == '') {
              TipBoxService.open('请选中您要删除的选项', 0) 
                // this.cancelFun();
                return false
            } else{
              this.deteleWhiteList(id.substring(0, id.length - 1))
            }
         },
      toServiceDetails (id, st) {
          if (st == 3) {
              return false
            } else{
              console.info('挑战', id + '--' + st)
              window.open(publicPathConfig.APP_MARKET + '#/appServiceDetail?id=' + id)
            }
        },
          // 点击下拉框获取服务id和服务名--单个服务
      singleServiceInput (id, name) {
  var that = this
                 that.serverArray2 = []
                this.selectItem = this.inputValueInp !== name
				this.isShowSearchedSingle = false
                this.inputValueInp = name
				var serverObj = {}
				serverObj.serverId = id//服务id
				serverObj.serverName = name//服务名
				that.serverArray2.push(serverObj)
					
				
            },
            // 用户--点击下拉框获取服务id和服务名
      selectItemInList (id, name) {
  var that = this
				this.selectItem = this.inputPhone !== name
				this.isShowSearched = false
				this.inputPhone = name
				var serverObj = {}
				serverObj.id = id//服务id
				serverObj.phone = name//服务名
                that.serverArray1.push(serverObj)//新增
            }
    }
    }
</script>
<style src="../../css/whiteList.css" scoped></style>

