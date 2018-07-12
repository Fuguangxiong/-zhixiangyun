<template>
  <div class="applyServerContent">
        <!-- 主题内容菜单 -->
            <div class="w1200"> 
            <div class="applyServerNav">
              <span class="headerTip"></span> <span class="">服务管理</span>
              <span class="">·{{menu}}·服务详情</span>
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
                            <ul class="basicul">
                                <!-- <li>标签：{{formData.service_tag}}</li> -->
                                <li>类型：{{formData.apptype}}</li>
                                <li>创建者：{{formData.Applicant}}</li>
                            </ul>
                        </div>
                    </div>
                    <div class="callInformation">
                       <div>
                           <div class="calldetail-right"><div class="callnum">{{formData.click_num}}</div><div class="calltitle">浏览量</div></div>
                           <div class="calldetail-center"><div class="callnum">{{formData.user_num}}</div><div class="calltitle">累计用户量</div></div>
                           <div class="calldetail"><div class="callnum">{{formData.visit_num}}</div><div class="calltitle">调用次数</div></div>                           
                       </div>
                       <!-- <div class="calloperate" v-show="btnData.length>0" >
                            <div class="caozuo">
                               <i v-show="formData.service_status!='已过期'" class="icon iconfont icon-xiangqing2" ></i>
                            </div>  
                            <ul class="modifyDeleteUl" >
                                <li  v-for="item in btnData" class="modifyDeleteLi">
                                    <div>
                                        <i class="icon iconfont" :class="item.icon" @click="onClickLable(item.code,formData)"></i> 
                                        <span class="calltitle" :title="item.label" @click="onClickLable(item.code,formData)">{{ item.label }}</span>
                                    </div>
                                </li>
                            </ul>
                       </div> -->
                    </div>
                </div>
                <!--基础信息 -->
                <div class="serviceInformation">
                    <div class="contenttitle"><span><i class="icon iconfont icon-jichuxinxiguanli-copy"></i>基础信息</span> <i @click="shouqi('isup')" class="icon iconfont iconright " :class="{'icon-arrow-down-copy':isup,'icon-arrow-down':!isup}"></i></div>
                     <ul v-show="isup">
                         <li><span class="titlewigth">服务名称:</span>{{formData.service_name}}</li>
                         <li><span class="titlewigth">服务期限:</span>{{formData.service_start_time}} 至  {{formData.service_end_time}}</li>
                         <li><span class="titlewigth">服务简介:</span>{{formData.service_brief}}</li>
                         <li>
                             <span class="titlewigth">服务介绍:</span>
                             <div class="contentremark"><pre>{{formData.service_remark}}</pre></div>
                         </li>
                     </ul>
                </div>
                <!--服务归属 -->
                <div class="serviceAttribution " v-show="serviceList">
                    <div class="contenttitle"><span><i class="icon iconfont icon-guishu"></i>服务归属</span> <i @click="shouqi('isup1')" class="icon iconfont iconright" :class="{'icon-arrow-down-copy':isup1,'icon-arrow-down':!isup1}"></i></div>
                      <ul v-show="isup1">
                         <li><span class="titlewigth">服务类型:</span>{{formData.apptype}}</li>
                         <li v-show="formData.apptype === '应用服务'"><span class="titlewigth">应用名称:</span>{{formData.appName}}</li>
                         <li><span class="titlewigth">页面类型:</span><span class="pageType" v-show="list1.serviceTypeShow">页面请求</span><span class="pageType" v-show="list2.serviceTypeShow">页面数据请求</span><span class="pageType" v-show="list3.serviceTypeShow">纯数据请求</span></li>
                         <li><span class="titlewigth">服务标签:</span><span class="serverlable" v-for="(item,index) in lableList" :key="index">{{item}}</span></li>
                     </ul>
                </div>
                <!--图片设置 -->
                <div class="imgRequest" v-show="imgList">
                     <div class="contenttitle"><span><i class="icon iconfont icon-tupian2"></i>图片配置</span><i @click="shouqi('isup2')" class="icon iconfont iconright" :class="{'icon-arrow-down-copy ':isup2,'icon-arrow-down':!isup2}"></i></div>
                     <div class="imgRequestdiv" v-show="isup2">
                     <div class="logoImg" >
                         <img :src="logo" alt="">
                         <div class="logoImgName">
                         <span>logo</span>
                         </div>
                    </div>
                    <div class="bgImg" >
                        <img :src="bgimg" alt="">
                        <div class="bgImgName">
                        <span>背景图</span>
                        </div>
                    </div>
                    </div>
                </div>
                <!--页面请求设置 -->
                <div class="dataRequest" v-show="list1.state">
                     <div class="contenttitle"><span><i class="icon iconfont icon-iconset0335"></i>页面请求设置</span><i @click="shouqi('isup3')" class="icon iconfont iconright" :class="{'icon-arrow-down-copy':isup3,'icon-arrow-down':!isup3}"></i></div>
                     <div class="dateRequestContent" v-show="isup3">
                         <div class="requerdiv"><span class="titlewigth">请求类型:</span>{{list1.request_type}} </div>                         
                         <div class="requerdiv"><span class="titlewigthmin">字符集:</span>{{list1.charset}}</div>
                         <div class="requerdiv"><span class="titlewigth">请求地址:</span>{{list1.url}}</div>
                         <!-- <div  class="requerdiv" v-show="list1.isShowInputBody"><span class="titlewigthmin">请求体:</span>{{list1.input_body}}</div> -->
                     </div>
                </div>                
                <!-- 页面数据请求设置 -->
                <div class="dataRequest"  v-show="list2.state">
                     <div class="contenttitle"><span><i class="icon iconfont icon-shuju"></i>页面数据请求设置</span><i @click="shouqi('isup5')" class="icon iconfont iconright" :class="{'icon-arrow-down-copy':isup5,'icon-arrow-down':!isup5}"></i></div>
                       <div class="dateRequestContent"  v-show="isup5" >
                         <div class="requerdiv"><span class="titlewigth">请求类型:</span>{{list2.request_type}}</div>
                         <div class="requerdiv"><span class="titlewigthmin">字符集:</span>{{list2.charset}}</div>
                         <div  class="requerdiv"><span class="titlewigth" style=" display:block">参数设置:</span>  
                            <span class="param">   
                                <div class="paramBox" :class="{changeDom:item.isTrue}" v-for="(item,index) in list2.tableList" >
                                    <div class="paramContent" :class="{changeDom:item.isTrue}">
                                        <p>名称：{{item.name}}</p>
                                        <p>序号：{{item.order}}</p>
                                        <p v-if="item.param_type == 1">类型：字符型</p>
                                        <p v-if="item.param_type == 2">类型：数值型</p>
                                        <p v-if="item.param_type == 3">类型：长文本型</p>
                                        <p>描述：{{item.describe}}</p>
                                        <div class="paramTag" :title="item.tag">标签：<span v-for="(service_tag,index) in item.tag" :key="index">{{service_tag}}<i>,</i></span></div>
                                        <p v-if="item.isRequired == true">必输：是</p>
                                        <p v-if="item.isRequired == false">必输：否</p>
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
                 <!--纯数据请求设置 -->
                <div class="dataRequest"  v-show="list3.state">
                     <div class="contenttitle"><span><i class="icon iconfont icon-shuju"></i>纯数据请求设置</span><i @click="shouqi('isup4')" class="icon iconfont iconright" :class="{'icon-arrow-down-copy':isup4,'icon-arrow-down':!isup4}"></i></div>
                       <div class="dateRequestContent" v-show="isup4">
                         <div class="requerdiv"><span class="titlewigth">请求类型:</span>{{list3.request_type}}</div>
                         <div class="requerdiv"><span class="titlewigthmin">字符集:</span>{{list3.charset}}</div>
                         <div  class="requerdiv"><span class="titlewigth" style=" display:block">参数设置:</span>  
                              <span class="param" >   
                                   <div class="paramBox" :class="{changeDom:item.isTrue}" v-for="(item,index) in list3.tableList" >
                                     <div class="paramContent" :class="{changeDom:item.isTrue}">
                                         <p>名称：{{item.name}}</p>
                                         <p>序号：{{item.order}}</p>
                                         <p v-if="item.param_type == 1">类型：字符型</p>
                                         <p v-if="item.param_type == 2">类型：数值型</p>
                                         <p v-if="item.param_type == 3">类型：长文本型</p>
                                         <p>描述：{{item.describe}}</p>
                                         <div class="paramTag" :title="item.tag">标签：<span v-for="(service_tag,index) in item.tag" :key="index">{{service_tag}}<i>,</i></span></div>
                                         <p v-if="item.isRequired == true">必输：是</p>
                                         <p v-if="item.isRequired == false">必输：否</p>
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
                                   <div class="paramBox" :class="{changeDom:item.isTrue}" v-for="(item,index) in list3.serviceOutParam">
                                     <div class="paramContent" :class="{changeDom:item.isTrue}" >
                                         <p>名称：{{item.name}}</p>
                                         <p>序号：{{item.order}}</p>
                                          <p v-if="item.param_type == 1">类型：字符型</p>
                                         <p v-if="item.param_type == 2">类型：数值型</p>
                                         <p v-if="item.param_type == 3">类型：长文本型</p>
                                        <p>描述：{{item.describe}}</p>
                                         <div class="paramTag" :title="item.tag">标签：<span v-for="(service_tag,index) in item.tag" :key="index">{{service_tag}}<i>,</i></span></div>
                                         <!-- <p v-if="true">必输：是</p>
                                         <p v-if="false">必输：否</p> -->
                                     </div>
                                     <div class="paramBtn">
                                           <i  @click="getMoreInfo(index,list3.serviceOutParam)" class="icon iconfont iconright" :class="{'icon-shangla':item.isTrue,'icon-xiala1':!item.isTrue}"></i> 
                                     </div>
                                </div>
                            </span> 
                         </div>
                         <div  class="requerdiv"><span class="titlewigth">输出格式:</span>{{list3.output_body}} </div>
                     </div>
                </div>
                 <!--可见性配置 -->
                <div class="pageRequest" v-show="showuable">
                      <div class="contenttitle"><span><i class="icon iconfont icon-kejian"></i>可见性配置</span><i @click="shouqi('isup6')" class="icon iconfont iconright" :class="{'icon-arrow-down-copy':isup6,'icon-arrow-down':!isup6}"></i></div>
                       <div class="pageRequestContent"  v-show="isup6">
                         <div><span class="titlewigth">可见范围:</span>{{uablelable}}</div>
                         <div v-show="!uableall" class="fanwei">
                         <span v-for="item in personaluable"><i class="icon iconfont icon-yonghu2"></i>{{item.USERNAME}} </span> 
                         <span v-for="item in enteruable"><i class="icon iconfont icon-qiye"></i>{{item.NAME}} </span></div>
                       </div>
                </div>
                 <!--屏蔽性配置 -->
                <div class="pageRequest" v-show="showbind">
                      <div class="contenttitle"><span><i class="icon iconfont icon-jianhao1"></i>屏蔽性配置</span><i @click="shouqi('isup7')" class="icon iconfont iconright" :class="{'icon-arrow-down-copy':isup7,'icon-arrow-down':!isup7}"></i></div>
                      <div class="pageRequestContent" v-show="isup7">
                         <div><span class="titlewigth">屏蔽范围:</span>{{bindlable}}</div>
                         <div class="fanwei" v-show="!bindall">
                           <span v-for="item in personalbind"><i  class="icon iconfont icon-yonghu2"></i>{{item.USERNAME}}</span>
                           <span v-for="item in enterbind"><i  class="icon iconfont icon-qiye"></i>{{item.NAME}} </span></div>
                         </div>
                 </div>
               
                 <!--计费方案 -->
                <div class="dataRequest" v-show="billlistshow">
                      <div class="contenttitle"><span><i class="icon iconfont icon-xiangqing1"></i>计费方案</span><i @click="shouqi('isup8')" class="icon iconfont iconright" :class="{'icon-arrow-down-copy':isup8,'icon-arrow-down':!isup8}"></i></div>
                      <div class="dateRequestContent topmargin" v-show="isup8"   v-for="(item,index) in billlist" :key="index">
                           <div class="billname">{{item.groupName}}: </div>
                           <div class="billlist" >
                             <el-popover class='rule' v-for="(tem,index) in item.feeInfo" :key="index" placement="right" trigger="hover">
                              <!-- 鼠标滑上提示 -->
                              <ul class='scheme-tip'>
                                <li><b>方案名称：</b>{{tem.scheme_name}}</li>
                                <li><b>是否收费：</b>{{getFeeText(tem.is_fee)}}</li>
                                <li v-if="tem.is_fee === '1'"><b>收费标准：</b>{{getFeeStandard(tem.fee_standard,tem.fee_price)}}</li>
                                <li><b>有效期：</b>{{formateTime(tem.expiry_start_date)}} 至 {{formateTime(tem.expiry_end_date)}}</li>
                                <li><b>调用限制：</b>{{getRestrictType(tem.restrict_type)}}{{tem.restrict_num}}次</li>
                                <li><b>使用申请：</b>{{getIsApprove(tem.is_approve)}}</li>
                                <li><b>创建时间：</b>{{formateTime(tem.created_time,'all')}}</li>
                              </ul>
                              <!-- 方案 --> 
                              <div slot="reference" class='billdetail'>
                                <img src="../../images/yfb.jpg" class="image">
                                <span v-if="item.isApplyAgain" class="scheme-con-mask"></span>
                                <div class="plan-con">
                                    <div class="scheme-con-num">
                                    <time class="time" v-if="tem.restrict_type == 1">每天{{tem.restrict_num}}次</time>
                                    <time class="time" v-if="tem.restrict_type == 2">每周{{tem.restrict_num}}次</time>
                                    <time class="time" v-if="tem.restrict_type == 3">每月{{tem.restrict_num}}次</time>
                                    <time class="time" v-if="tem.restrict_type == 4">每季度{{tem.restrict_num}}次</time>
                                    <time class="time" v-if="tem.restrict_type == 5">半年{{tem.restrict_num}}次</time>
                                    <time class="time" v-if="tem.restrict_type == 6">每年{{tem.restrict_num}}次</time>
                                    </div>
                                    <span class="plan-con-name">{{tem.scheme_name}}</span>
                                </div>
                                <span v-if="tem.is_fee==1" class="scheme-con-tag">收费</span>
                                <span v-else class="scheme-con-tag">免费</span>
                              </div>
                              <!-- 方案 -->
                            </el-popover>                                
                           </div>                         
                      </div>                                               
                </div>
            </div>
            </div>
    </div>
</template>
<script>
import apiToken from '../../../publicJs/apiToken.js'
import apiClient from '../../../publicJs/ApiClient.js'
import TipBoxService from '../common/TipBoxService.js'
import LoadingBoxService from '../../../publicJs/LoadingBoxService.js'
import NoticeBoxService from '../../../publicJs/NoticeBoxService.js'
import Util from '../../../publicJs/Util'
import UtilService from '../../../publicJs/UtilService.js'
import commonFunc from '../common/commonFunc.js'
export default {
  name: 'applyServerDeatil',
  data () {
    return {
      formData: {
        butStyle: '', // 启用停用按钮的颜色
        isShow: false, // 是否显示启用停用按钮
        delIsShow: false, // 删除按钮是否显示
        updateIsShow: false, // 编辑按钮是否显示
        portIsShow: false, // 端口是否显示
        service_name: '', // 服务名称
        apptype: '', // 归属应用
        address: '', // 服务地址
        service_tag: '', // 服务标签
        open_type: '', // 公开方式
        service_brief: '', // 服务简介
        service_remark: '', // 服务介绍
        service_type: '', // 是数据服务还是页面服务1-有输入页面、2-无输入页面有输出页面、3-无输入页面无输出页面

        id: '', // 原子服务ID
        service_status: '', // 服务状态
        Applicant: '', // 申请人

        appName: '', // 应用名称
        apply_time: '',
        service_param: [],
        startAndStop: '', // 启用  停用
        startAndStopBut: '', // 启用  停用按钮显示
        audit_status: '' // 审核状态
      },
      list1: {
        isShowInputBody: false,
        state: false,
        serviceTypeShow: false,
        charset: '',
        tableList: [],
        request_type: '', // 请求类型post、get、无
        request_port: '', // 请求端口 docker端口
        url: '', // 原子服务的请求路径 端口以后的ulr部分
        input_body: '' // 页面请求体
      },
      list2: {
        isShowInputBody: false,
        state: false,
        serviceTypeShow: false,
        charset: '',
        tableList: [],
        request_type: '', // 请求类型post、get、无
        request_port: '', // 请求端口 docker端口
        url: '', // 原子服务的请求路径 端口以后的ulr部分
        input_body: '' // 页面请求体
      },
      list3: {
        charset: '',
        isShowInputBody: false,
        state: false,
        serviceTypeShow: false,
        tableList: [],
        url: '', // 原子服务的请求路径 端口以后的ulr部分
        output_body: '', // 页面请求体
        serviceOutParam: [], // 返回参数（输出）
        url: '', // 原子服务的请求路径 端口以后的ulr部分
        output_body: '', // 输出格式
        intput_body: '', // 输入格式
        request_type: '', // 请求类型post、get、无
        request_port: '', // 请求端口 docker端口
        url: '', // 原子服务的请求路径 端口以后的ulr部分
        serviceOutParam: [] // 返回参数（输出）
      },
      menu: '', // 跳转列表名称
      source_type: this.$route.query.source_type, // 从哪个列表跳转过来
      btnControlData: [],
      lableList: [], // 服务归属标签数组
      logo: '', // logo图片
      bgimg: '', // 背景图片
      visit_num: '', // 浏览量
      user_num: '', // 累计用户量
      click_num: '', // 调用次数
      isup: true, // 下拉
      isup1: true, // 下拉
      isup2: true, // 下拉
      isup3: true, // 下拉
      isup4: true, // 下拉
      isup5: true, // 下拉
      isup6: true, // 下拉
      isup7: true, // 下拉
      isup8: true, // 下拉
      billname: [], // 方案名称
      billlist: {}, // 方案列表
      tuobj: [],
      lable: '',
      uableall: '', // 可见性
      uablelable: '', // 可见性名称
      personaluable: [], // 部分人员可见性
      enteruable: [], // 部分企业可见性
      personalbind: [], // 部分人员屏蔽性
      enterbind: [], // 部分企业屏蔽性
      bindlable: '',
      bindall: '',
      billlistshow: true, // 是否显示计费方案
      showuable: true, // 是否显示可见性
      showbind: true, // 是否显示屏蔽性
      serviceList: true, // 是否显示服务归属
      imgList: true, // 是否显示图片设置
      btnData: []
    }
  },
  created () {
    this.formData.id = this.$route.query.id
    this.formData.audit_status = this.$route.query.audit_status
    // this.getBtns();
    this.getFormData()
  },
  mounted () {
    this.getbind() // 查询屏蔽性
    this.getuable() // 查询可见性
    this.menu = this.getMenu(this.source_type)
  },
  methods: {
    // 获取跳转列表名称
    getMenu (str) {
      let menu = ''
      let menuDic = [
        { label: '企业服务', value: '1' },
        { label: '平台服务', value: '2' },
        { label: '第三方服务', value: '3' },
        { label: '待我审批', value: '4' },
        { label: '我的注册', value: '5' },
        { label: '我的申请', value: '6' }
      ]
      menuDic.forEach(function (v, i) {
        if (str == v.value) {
          menu = v.label
          return
        }
      })
      return menu
    },
    getBtns () {
      let btnCodes = JSON.parse(
        sessionStorage.getItem(this.$route.query.btnKey)
      )
      for (var i = 0; i < btnCodes.length; i++) {
        let btnItem = commonFunc.getBtnItem(btnCodes[i])
        if (!commonFunc.isEmptyObject(btnItem)) {
          this.btnData.push(btnItem)
        }
      }
    },
    shouqi (type) {
      if (type == 'isup') {
        this.isup = !this.isup
      }
      if (type == 'isup1') {
        this.isup1 = !this.isup1
      }
      if (type == 'isup2') {
        this.isup2 = !this.isup2
      }
      if (type == 'isup3') {
        this.isup3 = !this.isup3
      }
      if (type == 'isup4') {
        this.isup4 = !this.isup4
      }
      if (type == 'isup5') {
        this.isup5 = !this.isup5
      }
      if (type == 'isup6') {
        this.isup6 = !this.isup6
      }
      if (type == 'isup7') {
        this.isup7 = !this.isup7
      }
      if (type == 'isup8') {
        this.isup8 = !this.isup8
      }
    },
    getMoreInfo (i, table) {
      let that = this
      let obj = Object.assign({}, table[i])
      obj.isTrue = !obj.isTrue
      that.$set(table, i, obj)
      // this.list2.tableList[i].isTrue = !this.list2.tableList[i].isTrue;
    },
    getFormData () {
      var that = this
      var myData = { id: that.formData.id } // that.formData.id
      LoadingBoxService.open('加载中')
      apiClient.post('itsmApi/atomicService/loadServiceInfo', myData, function (
        data
      ) {
        console.log('sssbbb', data)
        that.bgimg =
          apiClient.apiBaseUrl +
          '/itsmApi/attachment/show?imgPath=' +
          data.results.data[0].bg_img
        that.logo =
          apiClient.apiBaseUrl +
          '/itsmApi/attachment/show?imgPath=' +
          data.results.data[0].img
        that.formData.service_name = data.results.data[0].name
        that.formData.apply_time = data.results.apply_time
        that.formData.service_start_time = data.results.service_start_time
        that.formData.service_end_time = data.results.service_end_time
        console.log(data.results.userList)
        if (data.results.userList != null) {
          that.formData.Applicant = data.results.userList.TRUE_NAME
        }
        that.formData.apptype = data.results.data[0].apptype
        if (that.formData.apptype == 1) {
          that.formData.apptype = '远程服务'
        } else {
          that.formData.apptype = '应用服务'
          // that.formData.portIsShow = true
        }
        that.formData.service_url = data.results.data[0].address

        that.lableList = data.results.data[0].service_tag
        if (data.results.data[0].service_tag != undefined) {
          that.formData.service_tag = data.results.data[0].service_tag.toString()
        }
        if (that.lableList != undefined) {
          that.serviceList = true
        } else {
          that.serviceList = false
        }
        if (data.results.data[0].img != null || data.results.data[0].bg_img != null) {
          that.imgList = true
        } else {
          that.imgList = false
        }
        that.formData.open_type = data.results.data[0].open_type
        if (that.formData.open_type == 1) {
          that.formData.open_type = '完全公开'
        } else {
          that.formData.open_type = '条件公开'
        }
        that.formData.service_brief = data.results.data[0].service_brief
        that.formData.service_remark = data.results.data[0].service_remark
        that.formData.service_type = data.results.data[0].service_type
        that.formData.service_status = data.results.serviceStatus
        if (that.formData.service_status == '正常') {
          that.formData.startAndStopBut = '停用'
          that.formData.startAndStop = '关闭'
          that.formData.butStyle = 'butonstdelet'
        } else if (that.formData.service_status == '关闭') {
          that.formData.startAndStopBut = '启用'
          that.formData.startAndStop = '正常'
          that.formData.butStyle = 'butonst'
        }
        that.formData.visit_num = data.results.data[0].visit_num
        if (that.formData.visit_num == undefined) {
          that.formData.visit_num = '0'
        }
        that.formData.user_num = data.results.user_num
        if (that.formData.user_num == undefined) {
          that.formData.user_num = '0'
        }
        console.log('audit_status----------' + that.formData.audit_status)

        if (
          that.formData.audit_status == undefined ||
          that.formData.audit_status == '0'
        ) {
          that.formData.updateIsShow = true
          that.formData.delIsShow = true
        }
        that.formData.click_num = data.results.data[0].click_num
        that.formData.appName = data.results.appName
        if (that.formData.service_type != undefined) {
          that.formData.service_type.forEach(function (v, i) {
            if (v === '1') {
              that.list1.serviceTypeShow = true
            } else if (v === '2') {
              that.list2.serviceTypeShow = true
            } else if (v === '3') {
              that.list3.serviceTypeShow = true
            }
          })
        }
        if (data.results.data[0].service_param_detail != undefined) {
          that.formData.service_param.push(data.results.data[0].service_param_detail[0])
          that.formData.service_param.push(JSON.parse(data.results.data[0].service_param_detail[1]))
          that.formData.service_param.push(JSON.parse(data.results.data[0].service_param_detail[2]))
          for (var i = 0; i < that.formData.service_type.length; i++) {
            var arr = that.formData.service_type[i]
            console.log(arr)
            if (arr == '1') {
              if (JSON.parse(that.formData.service_param[0]).url != undefined && JSON.parse(that.formData.service_param[0]).url != '') {
                that.formData.service_param[0] = JSON.parse(
                that.formData.service_param[0]
              )
                that.list1.url = that.formData.service_param[0].url
                that.list1.request_type =
                that.formData.service_param[0].request_type
                if (that.list1.request_type == 'post') {
                  that.list1.isShowInputBody = true
                }
                for (var t = 0; t < that.list1.tableList.length; t++) {
                  that.list1.tableList[t].isTrue = false
                }
                that.list1.charset = that.formData.service_param[0].charset
                if (that.list1.charset == undefined || that.list1.charset == '') {
                  that.list1.charset = 'UTF-8'
                }
                that.list1.input_body = that.formData.service_param[0].input_body
                that.list1.request_port =
                that.formData.service_param[0].request_port
                that.list1.tableList =
                that.formData.service_param[0].service_param
                that.list1.state = true
              }
            }
            if (arr == '2') {
              if (that.formData.service_param[1].url != undefined && that.formData.service_param[1].url != '') {
                that.list2.url = that.formData.service_param[1].url
                that.list2.request_type =
                that.formData.service_param[1].request_type
                if (that.list2.request_type == 'post') {
                  that.list2.isShowInputBody = true
                }
                that.list2.charset = that.formData.service_param[1].charset
                if (that.list2.charset == undefined || that.list2.charset == '') {
                  that.list2.charset = 'UTF-8'
                }
                that.list2.input_body = that.formData.service_param[1].input_body
                that.list2.request_port =
                that.formData.service_param[1].request_port
                that.list2.tableList =
                that.formData.service_param[1].service_param
                that.list2.state = true
              }
            }
            if (arr == '3') {
              if (that.formData.service_param[2].url != undefined && that.formData.service_param[2].url != '') {
                that.list3.input_body = that.formData.service_param[2].input_body
                that.list3.output_body =
                that.formData.service_param[2].output_body
                that.list3.tableList =
                that.formData.service_param[2].service_param
                that.list3.serviceOutParam =
                that.formData.service_param[2].service_out_param
                that.list3.request_port =
                that.formData.service_param[2].request_port
                that.list3.url = that.formData.service_param[2].url
                that.list3.request_type =
                that.formData.service_param[2].request_type
                that.list3.charset = that.formData.service_param[2].charset
                if (that.list3.charset == undefined || that.list3.charset == '') {
                  that.list3.charset = 'UTF-8'
                }
                if (that.list3.request_type == 'post') {
                  that.list3.isShowInputBody = true
                }
                for (var t = 0; t < that.list3.tableList.length; t++) {
                  that.list3.tableList[t].isTrue = false
                }
                that.list3.state = true
              }
            }
          }
        }
        // 计划方案
        if (data.results.bill_rules !== undefined && data.results.bill_rules.length !== 0) {
          that.billlist = data.results.bill_rules
          console.log('asdsrfasd', that.billlist)
          that.billlistshow = true
        } else {
          that.billlistshow = false
        }
        // 操作按钮
        // that.tuobj= that.addSeniorBtns(data.results.data[0]).seniorBtns
        LoadingBoxService.close()
      })
    },
    onClickLable (item, formData) {
      let vm = this
      commonFunc.onClickLable(vm, item, formData)
    },
    // 屏蔽性
    getbind () {
      var that = this
      var myData = {
        dataId: that.formData.id,
        visibility_type: 2,
        visibility_set_catagory: 2
      }
      apiClient.post('itsmApi/outterVisible/outters', myData, function (data) {
        if (data.results.visibilityLevel == 1) {
          that.bindall = true
          that.bindlable = '全部屏蔽'
        } else if (data.results.visibilityLevel == 2) {
          that.bindall = false
          that.bindlable = '部分屏蔽'
          that.personalbind = data.results.personal // 人员
          that.enterbind = data.results.enterprise // 企业
        } else {
          that.showbind = false
        }
      })
    },
    // 可见性
    getuable () {
      var that = this
      var myData = {
        dataId: that.formData.id,
        visibility_type: 1,
        visibility_set_catagory: 2
      }
      apiClient.post('itsmApi/outterVisible/outters', myData, function (data) {
        if (data.results.visibilityLevel == 1) {
          that.uableall = true
          that.uablelable = '全部可见'
        } else if (data.results.visibilityLevel == 2) {
          that.uableall = false
          that.uablelable = '部分可见'
          that.personaluable = data.results.personal // 人员
          that.enteruable = data.results.enterprise // 企业
        } else {
          that.showuable = false
        }
      })
    },
    addSeniorBtns (obj) {
      // 'test 测试 icon-ceshi','delete删除 icon-3', 'stop 停用 icon-suo', 'down下架 icon-unshelve','up 上架 icon-shelve ','start 开始 icon-able','rule计费规则 icon-xuefeishoujiaotongji' , 'usable可见性 icon-kejian1',
      //                           'blind 屏蔽 icon-pingbi', 'viewApplyRegist 查看申请 icon-chakanshenqing'，'modify 修改 icon-bianji2'，'viewReason查看原因 icon-zl_yuanyin' -->

      if (
        obj.audit_status == '2' &&
        obj.service_status == '1' &&
        obj.up_down_status == '1'
      ) {
        obj.seniorBtns = [
          'icon-suo',
          'icon-unshelve',
          'ruicon-xuefeishoujiaotongjile',
          'icon-kejian1',
          'icon-pingbi',
          'icon-chakanshenqing'
        ]
      } else if (
        obj.audit_status == '2' &&
        obj.service_status == '1' &&
        obj.up_down_status != '1'
      ) {
        obj.seniorBtns = [
          'icon-suo',
          'icon-shelve',
          'icon-xuefeishoujiaotongji',
          'icon-kejian1',
          'icon-pingbi',
          'icon-chakanshenqing'
        ]
      } else if (
        obj.audit_status == '2' &&
        obj.service_status == '3' &&
        obj.up_down_status == '1'
      ) {
        obj.seniorBtns = [
          'icon-able',
          'icon-unshelve',
          'icon-bianji2',
          'icon-3',
          'icon-xuefeishoujiaotongji',
          'icon-kejian1',
          'icon-pingbi',
          'icon-chakanshenqing'
        ]
      } else if (
        obj.audit_status == '2' &&
        obj.service_status == '3' &&
        obj.up_down_status != '1'
      ) {
        obj.seniorBtns = [
          'icon-able',
          'icon-bianji2',
          'icon-3',
          'icon-xuefeishoujiaotongji',
          'icon-kejian1',
          'icon-pingbi',
          'icon-chakanshenqing'
        ]
      } else if (
        obj.audit_status == '2' &&
        obj.service_status == '4' &&
        obj.up_down_status == '1'
      ) {
        obj.seniorBtns = [
          'icon-suo',
          'icon-unshelve',
          'icon-xuefeishoujiaotongji',
          'icon-kejian1',
          'icon-pingbi',
          'icon-chakanshenqing'
        ]
      } else if (
        obj.audit_status == '2' &&
        obj.service_status == '4' &&
        obj.up_down_status != '1'
      ) {
        obj.seniorBtns = [
          'icon-suo',
          'icon-shelve',
          'icon-xuefeishoujiaotongji',
          'icon-kejian1',
          'icon-pingbi',
          'icon-chakanshenqing'
        ]
      } else if (
        obj.audit_status == '2' &&
        obj.service_status == '5' &&
        obj.up_down_status != '1'
      ) {
        obj.seniorBtns = ['icon-3', 'icon-chakanshenqing']
      } else if (obj.audit_status == '1') {
        obj.seniorBtns = ['icon-ceshi', 'icon-chakanshenqing']
      } else if (obj.audit_status == '3') {
        obj.seniorBtns = [
          'icon-bianji2',
          'icon-3',
          'icon-zl_yuanyin',
          'icon-chakanshenqing'
        ]
      }
      return obj
    },
    // 时间格式转换
    formateTime (time, type) {
      if (type === 'all') {
        return commonFunc.formatDate(time, 'yyyy-MM-dd HH:mm:ss')
      } else {
        return commonFunc.formatDate(time, 'yyyy-MM-dd')
      }
    },
    // 计费方式转换
    getIsApprove (is_approve) {
      return is_approve === '1' ? '需要' : '不需要'
    },
    // 计费方式转换
    getRestrictType (restrict_type) {
      return commonFunc.getRestrictType(restrict_type)
    },
    // 是否收费转换
    getFeeText (is_fee) {
      let is_fee_text = is_fee === '1' ? '收费' : '免费'
      return is_fee_text
    },
    // 收费标准转换
    getFeeStandard (fee_standard, fee_price) {
      return commonFunc.getFeeStandard(fee_standard) + fee_price + '元'
    }
  }
}
</script>
<style src="../../css/common/public.css" scoped></style>
<style src="../../css/detailPage/applyServerDeatil.css" scoped></style>
<style scoped>
.basicInformation .serverdetail {
  height: 100%;
  float: left;
  width: 80%;
}
.basicInformation .callInformation {
  height: 100%;
  float: left;
  /* width: 20% */
}
.basicInformation .callInformation .calldetail {
  width: auto;
  float: right;
}
.basicInformation .callInformation .calldetail-center {
  float: right;
  padding-left: 25px;
  padding-right: 20px;
}
.basicInformation .callInformation .calldetail-right {
  float: right;
  padding-left: 0px;
  padding-right: 0px;
}
.basicInformation .callInformation .calldetail .calltitle {
  display: block;
  margin: 0 auto;
  text-align: center;
}
.basicInformation .callInformation .calldetail .callnum {
  margin: 0 auto;
  text-align: center;
}
.basicInformation .callInformation .calldetail-center .callnum {
  margin: 0 auto;
  text-align: center;
}
.basicInformation .callInformation .calldetail-right .callnum {
  margin: 0 auto;
  text-align: center;
}
.calloperate {
  margin-top: 25px;
  float: right;
  width: 25px;
  height: 26px;
}
.calloperate .caozuo {
  margin-left: 0px;
}
.serviceInformation ul li {
  line-height: 40px;
  color: #000;
  padding-left: 80px;
  position: relative;
}
.serviceInformation .titlewigth {
  margin-right: 25px;
  position: absolute;
  left: 0;
}
.contentremark {
  display: inline-block;
}
.contentremark pre {
  white-space: pre-wrap;
  white-space: -moz-pre-wrap;
  white-space: -pre-wrap;
  white-space: -o-pre-wrap;
  word-wrap: break-word;
  font-family: "microsoft yahei", Tahoma, Geneva, sans-serif;
  background: #fff;
  border: 0px;
  font-size: 12px;
  padding-left: 0px;
}
.modifyDeleteUl div {
  width: auto;
  float: left;
}
</style>
