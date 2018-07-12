<template>
  <div class="publicContent">
    <!-- <left-nav :selectIndex="1"></left-nav> -->
    <!-- <div class="publicNav">
      <div class="tabContainer">
        <div v-for="(item,index) in uiData.tabArr" class="tabItem" v-bind:class="{active:item.active}" v-on:click="tabItemClickHandler(index)">{{item.name}}</div>  
      </div>
      <span>申请管理</span>
      <div class="publicRedBtn applyResourcesBtn" v-on:click="applyClickHandler">申请资源</div>
    </div> -->
    <div class="commonnav">
      <span class="item" v-show="item.name !== '服务申请'" :class="{active:item.active}" v-for="(item,index) in uiData.tabArr" :key="index" @click="tabItemClickHandler(index)">{{item.name}}</span>
      <privibutton :type="{name:'资源管理', childrenName:'申请管理', code:'applyResource'}">
        <button class="registerbtn" @click="applyClickHandler">申请资源</button>
      </privibutton>
    </div>
    <div class="loadDataBox">
      <!-- <div class="commonTableTabContainer">
        <div v-for="(item,index) in uiData.tabArr" class="commonTableTabItem" v-bind:class="{active:item.active}" v-on:click="tabItemClickHandler(index)">{{item.name}}</div>
      </div> -->
      <!--数据申请-->
      <div class="commonTabContent" v-bind:class="{active:uiData.tabArr[0].active}">
        <common-table-component :error-msg="searchResultMsg.data" :type-name="{name:'资源管理', childrenName:'申请管理'}" :body-data="dataData.bodyData" :header-data="dataData.headerData" :page-total="dataData.pageTotal" :admin="true" :link="link" v-on:change="tableGetDataHandler" v-on:edit="tableItemEditHandler" v-on:look="tableItemLookHandler" :tag-check-data="dataData.checkData" :tags-data="dataData.tagsData" :component-type="dataData.resourceType">
          <div class="slotbox slotbox1" :slot="'linedata'+index" v-for="(item,index) in dataData.bodyData.data" :key="index">
            <!-- <div class="msg">
              <div class="text">
                <span>申请人：</span>
                <span>{{item.truename}}</span>
              </div>
            </div> -->
            <div class="msg">
              <div class="text">
                <span>申请人：</span>
                <span>{{item.truename}}</span>
              </div>
              <div class="text">
                <span>所申请数据资源：</span>
                <span>{{item.resourcename}}</span>
              </div>
              <div class="text">
                <span>申请时间：</span>
                <span>{{item.applytime}}</span>
              </div>
              <!-- <div class="text">
                <span>使用期限：</span>
                <span>{{item.time}}</span>
              </div> -->
            </div>
            <div class="msg">
              <div class="text">
                <span>审核状态：</span>
                <span :class="status[item.status].color">{{status[item.status].name}}</span>
              </div>
              <div class="text">
                <span>使用期限：</span>
                <span>{{item.time==''?'长期使用':item.time}}</span>
              </div>
              <!-- <div class="text">
                <span>所在单位：</span>
                <span>{{item.enterprisename}}</span>
              </div>
              <div class="text">
                <span>所在部门：</span>
                <span>{{item.deptname}}</span>
              </div> -->
            </div>
          </div>
        </common-table-component>
      </div>
      <!--数据申请-->
      <!--接口申请-->
      <div class="commonTabContent" v-bind:class="{active:uiData.tabArr[1].active}">
        <common-table-component :error-msg="searchResultMsg.interface" :type-name="{name:'资源管理', childrenName:'申请管理'}" :body-data="interfaceData.bodyData" :header-data="interfaceData.headerData" :page-total="interfaceData.pageTotal" :admin="true" :link="link" v-on:change="tableGetDataHandler" v-on:edit="tableItemEditHandler" v-on:look="tableItemLookHandler" :tag-check-data="interfaceData.checkData" :tags-data="interfaceData.tagsData" :component-type="interfaceData.resourceType">
          <div class="slotbox slotbox1" :slot="'linedata'+index" v-for="(item,index) in interfaceData.bodyData.data" :key="index">
            <!-- <div class="msg">
              <div class="text">
                <span>申请人：</span>
                <span>{{item.truename}}</span>
              </div>
            </div> -->
            <div class="msg">
              <div class="text">
                <span>申请人：</span>
                <span>{{item.truename}}</span>
              </div>
              <div class="text">
                <span>所申请接口资源：</span>
                <span>{{item.resourcename}}</span>
              </div>
              <div class="text">
                <span>申请时间：</span>
                <span>{{item.applytime}}</span>
              </div>
              <!-- <div class="text">
                <span>使用期限：</span>
                <span>{{item.time}}</span>
              </div> -->
            </div>
            <div class="msg">
              <div class="text">
                <span>审核状态：</span>
                <span :class="status[item.status].color">{{status[item.status].name}}</span>
              </div>
               <div class="text">
                <span>使用期限：</span>
                <span>{{item.time==''?'长期使用':item.time}}</span>
              </div>
              <!-- <div class="text">
                <span>所在单位：</span>
                <span>{{item.enterprisename}}</span>
              </div>
              <div class="text">
                <span>所在部门：</span>
                <span>{{item.deptname}}</span>
              </div> -->
            </div>
          </div>
        </common-table-component>
      </div>
      <!--接口申请-->
      <!--服务申请-->
      <!-- <div class="commonTabContent" v-bind:class="{active:uiData.tabArr[2].active}">
        <common-table-component type-name="申请管理" :body-data="serviceData.bodyData" :header-data="serviceData.headerData" :page-total="serviceData.pageTotal" :admin="true" :link="link" v-on:change="tableGetDataHandler"
                                v-on:edit="tableItemEditHandler" v-on:look="tableItemLookHandler"
        :tag-check-data="serviceData.checkData" :tags-data="serviceData.tagsData" :component-type="serviceData.resourceType"></common-table-component>
      </div> -->
      <!--服务申请-->

    </div>
    <!--申请资源弹框-->
    <div class="overlay high-index" v-show="uiData.applyResourceBoxShow">
      <div class="rc_popupBox large">
        <div class="popupBoxHeader">申请资源
          <i class="popupBoxCloseIconBtn" v-on:click="closeApplyBoxHandler"></i>
        </div>
        <div class="rc_popupBoxBody">
          <div class="popupBoxLine">
            <span class="popupBoxLineTitle">资源分类</span>
            <el-select popper-class="rc_selectDown" v-model="applyBoxData.firstSelectValue" @change="applyFirstSelectHandler" placeholder="请选择">
              <el-option v-for="(item,index) in applyBoxData.firstSelectData" :key="index" :label="item" :value="index">
              </el-option>
            </el-select>
          </div>
          <div class="popupBoxLine">
            <span class="popupBoxLineTitle">资源目录</span>
            <el-cascader expand-trigger="click" :options="applyBoxData.secondSelectData" :props="applyBoxData.props" v-model="applyBoxData.secondSelectValue" change-on-select :show-all-levels="false" @change="handleChange">
            </el-cascader>
          </div>
          <div class="popupBoxLine selectLine">
            <span class="popupBoxLineTitle selectTitle">{{resourceTypeName}}</span>
            <span class="el-cascader selectCascder">
              <input class="selectBox" v-model="applyBoxData.thirdSelectValue" @keyup="findResource" placehold="请输入关键字查询" @focus="showSearchResult" @blur="hideSearchResult" />
              <i class="el-input__icon el-icon-caret-top" :class="iconSelected?'icon-reverse iconSelect':'iconSelect'" @click.stop="clickIcon"></i>
              <transition name="fade">
                <div class="selectList" v-show="showSelectList">
                  <div class="selectListRow" v-for="(item,index) in applyBoxData.thirdSelectData" :key="item.id">
                    <span @click="selectedData(item)">{{item.name}}</span>
                  </div>
                  <el-pagination small layout="prev, pager, next" :total="resourceTotal" :current-page.sync="pageNum" :page-size="pageSize" @current-change="handleCurrentChange" v-show="resourceTotal > 10">
                  </el-pagination>
                </div>
              </transition>
            </span>
          </div>
        </div>
        <div class="rc_popupBoxBtnContainer">
          <div class="popupBoxBtn" v-on:click="closeApplyBoxHandler">取消</div>
          <div class="popupBoxBtn redBg" v-on:click="applyBoxOkHandler">确定</div>
        </div>
      </div>
    </div>
    <!--审批弹框-->
    <common-approval-box :openNum="approvalBoxData.openNum" @change="approveBoxChangeHandler"></common-approval-box>
    <!--审批弹框结束-->
    <!-- 模态框 -->
    <CompDetail :show.sync="showDetail" :title=" '《'+showWithName +'》'+ '资源申请'">
      <div slot="component">
        <ApplyFormDetail :id="showWithId" />
      </div>
    </CompDetail>
  </div>
</template>

<script>
import privibutton from '@/publicComponent/privibutton'
import commonTableComponent from '@/publicComponent/commonTableComponent'
import apiClient from '@/publicJs/ApiClient'
import TipBoxService from '@/publicJs/TipBoxService'
import NoticeBoxService from '@/publicJs/NoticeBoxService'
import LoadingBoxService from '@/publicJs/LoadingBoxService'
import AlertBoxService from '@/publicJs/AlertBoxService'
import commonApprovalBox from '@/publicComponent/commonApprovalBox'
import UtilService from '@/publicJs/UtilService'
import CompDetail from '../../resourceCatalog/popupDetails/CompDetail.vue'
import ApplyFormDetail from '../component/applyFillInFormDetail.vue'
import Util from '@/publicJs/Util'
import codeMap from '../publicJs/status.js'
export default {
  name: 'ApplyManageAdministrator',
  components: {
    commonTableComponent,
    commonApprovalBox,
    CompDetail,
    ApplyFormDetail,
    privibutton
  },
  data () {
    return {
      searchResultMsg: {data: '', interface: ''},
      status: {
        0: '未提交',
        1: '待审核',
        2: '已通过',
        3: '未通过',
        4: '已过期'
      },
      link: 0,
      uiData: {
        tabArr: [
          { name: '数据申请', active: true },
          { name: '接口申请', active: false },
          { name: '服务申请', active: false }
        ],
        applyResourceBoxShow: false,
        approvalBoxShow: false
      },
      applyBoxData: {
        // fu把数组里面的服务删除了
        firstSelectData: ['数据资源', '接口'],
        secondSelectData: [],
        firstSelectValue: '',
        secondSelectValue: [],
        thirdSelectValue: '',
        thirdSelectData: [],
        props: {
          value: 'labels',
          label: 'name'
        }
      },
      labels: [],
      resourceId: '', // 资源项id
      resourceName: '',
      resourceType: 0,
      resourceTypeName: '数据资源',
      tag: '', // 资源项标签
      resourceTotal: 0,
      resourceFlag: true,
      pageNum: 1, // 当前页数
      pageSize: 10, // 每页数量
      approvalBoxData: {
        id: '',
        openNum: 0
      },
      dataData: {
        // 数据申请
        bodyData: {},
        headerData: [],
        checkData: [
          { name: '待审批通过', select: true, statu: 1 },
          { name: '审批已通过', select: true, statu: 2 },
          { name: '审批未通过', select: true, statu: 3 },
          { name: '已过期', select: true, statu: 4 }
        ],
        tagsData: [],
        resourceType: 0,
        pageTotal: 0
      },
      interfaceData: {
        // 接口申请
        bodyData: {},
        headerData: [],
        checkData: [
          { name: '待审批通过', select: true, statu: 1 },
          { name: '审批已通过', select: true, statu: 2 },
          { name: '审批未通过', select: true, statu: 3 },
          { name: '已过期', select: true, statu: 4 }
        ],
        tagsData: [],
        resourceType: 1,
        pageTotal: 0
      },
      serviceData: {
        // 服务申请
        bodyData: {},
        headerData: [],
        checkData: [
          { name: '待审批通过', select: true, statu: 1 },
          { name: '审批已通过', select: true, statu: 2 },
          { name: '审批未通过', select: true, statu: 3 }
        ],
        tagsData: [],
        resourceType: 2,
        pageTotal: 0
      },
      showDetail: false,
      showWithName: '',
      showWithId: '',
      showSelectList: false,
      iconSelected: true
    }
  },
  created () {
    this.createDataData()
    this.createInterfaceData()
    this.createServiceData()
    this.status = codeMap.status
  },
  methods: {
    statusInfo (item) {
      let result = {}
      let status = item.status
      for (var k in this.status) {
        if (k - 0 === status) {
          result.color = 'statuscolor' + k
          result.status = this.status[k]
          break
        } else if (this.status[k] === status) {
          result.color = 'statuscolor' + k
          result.status = this.status[k]
          break
        }
      }
      if (!result.color) {
        result.color = 'statuserror'
      }
      return result
    },
    handleChange (data) {
      // console.info('选择的值是=', data)
      this.applyBoxData.thirdSelectData = []
      this.applyBoxData.thirdSelectValue = ''
      this.resourceId = ''
      this.resourceName = ''
      this.tag = ''
      this.resourceTotal = 0
      if (data.length < 2) {
        return
      }
      // let loadingInstance = Loading.service({ fullscreen: true })
      let labelsArray = data[data.length - 1]
      this.labels = labelsArray.slice(0)
      let url = ''
      let params
      LoadingBoxService.open('数据加载中...')
      if (this.resourceType === 0) {
        url = '/rcapi/findResourceItems'
        params = {pageNum: this.pageNum,
          pageSize: this.pageSize,
          resourceType: this.resourceType, // 资源类型
          approvalStatusList: 2,
          tags: this.labels.join(',')}
        apiClient.get(url, params).then(data => {
          LoadingBoxService.close()
          this.resourceTotal = data.totalNum
          this.applyBoxData.thirdSelectData = data.dataList
        }).catch(e => {
          LoadingBoxService.close()
        })
      } else if (this.resourceType === 1) {
        url = '/itsmApi/atomicService/selectServiceForResource'
        params = {param: {
          serviceType: '1', // 归属应用，默认远程服务-1
          pageConfType: '3', // 页面配置类型 纯数据请求
          pageNum: this.pageNum,
          pageSize: this.pagesize,
          labels: this.labels.join(','),
          approvalStatusList: [2]}}
        apiClient.post(url, params).then(data => {
          LoadingBoxService.close()
          this.resourceTotal = data.totalNum
          this.applyBoxData.thirdSelectData = data.dataList
        }).catch(e => {
          LoadingBoxService.close()
        })
      }
    },
    tabItemClickHandler (index) {
      // console.info(index);
      var currentIndex
      for (var i = 0; i < this.uiData.tabArr.length; i++) {
        var obj = this.uiData.tabArr[i]
        if (obj.active == true) {
          currentIndex = i
          break
        }
      }
      if (currentIndex != index) {
        this.uiData.tabArr[index].active = true
        this.uiData.tabArr[currentIndex].active = false
      }
    },
    createDataData () {
      var that = this
      that.dataData.headerData = [
        { name: '申请人', textShow: true },
        { name: '登录名', textShow: true },
        {
          name: '数据资源名称',
          tagSelct: true,
          textShow: false,
          tagOpen: false,
          tagsData: []
        },
        {
          name: '所在单位',
          tagSelct: true,
          textShow: false,
          tagOpen: false,
          tagsData: []
        },
        { name: '所在部门', textShow: true },
        { name: '审批状态', textShow: true },
        { name: '申请时间', timeSelect: true, textShow: false },
        { name: '操作', textShow: true }
      ]
    },
    createInterfaceData () {
      var that = this
      that.interfaceData.headerData = [
        { name: '申请人', textShow: true },
        { name: '登录名', textShow: true },
        {
          name: '所申请接口资源',
          tagSelct: true,
          textShow: false,
          tagOpen: false,
          tagsData: []
        },
        {
          name: '所在单位',
          tagSelct: true,
          textShow: false,
          tagOpen: false,
          tagsData: []
        },
        { name: '所在部门', textShow: true },
        { name: '审批状态', textShow: true },
        { name: '申请时间', timeSelect: true, textShow: false },
        { name: '操作', textShow: true }
      ]
    },

    /* 服务申请 */
    createServiceData () {
      var that = this
      that.serviceData.headerData = [
        { name: '申请人', textShow: true },
        { name: '登录名', textShow: true },
        {
          name: '所申请服务',
          tagSelct: true,
          textShow: false,
          tagOpen: false,
          tagsData: []
        },
        {
          name: '所在单位',
          tagSelct: true,
          textShow: false,
          tagOpen: false,
          tagsData: []
        },
        { name: '所在部门', textShow: true },
        { name: '审批状态', textShow: true },
        { name: '申请时间', timeSelect: true, textShow: false },
        { name: '操作', textShow: true }
      ]
    },
    applyClickHandler () {
      // 打开申请资源弹框
      // console.info('申请资源')
      this.uiData.applyResourceBoxShow = true
    },
    closeApplyBoxHandler () {
      // 关闭申请资源弹框
      this.uiData.applyResourceBoxShow = false
    },
    applyBoxOkHandler () {
      // 申请资源弹框确定事件
      var that = this
      var firstVal = that.applyBoxData.firstSelectValue
      firstVal = firstVal.toString()
      var arrLen = that.applyBoxData.secondSelectValue.length - 1
      var secondValId = that.applyBoxData.secondSelectValue[arrLen]
      var secondValContainerId = ''
      if (that.resourceId === '') {
        TipBoxService.open('请选择所申请的资源', 2)
        return
      }
      apiClient
        .get('/rcapi/findAppResourceByToken', { resource: that.resourceId })
        .then(data => {
          // console.log('资源项是否过期：', data)
          if (!data.status || data.status === 'EXPIRED' || data.status === 'NO_PASS') {
            var treeObj = UtilService.findTreeData(
              secondValId,
              that.applyBoxData.secondSelectData
            )
            // console.info('treeObj=', treeObj)
            this.$router.push({
              name: 'ApplyFillInForm',
              query: {
                type: 'administrator',
                resourcetype: firstVal,
                resourcetags: that.resourceId,
                resourcename: that.resourceName,
                rootid: treeObj.rootId,
                tag: that.tag
              }
            })
          } else {
            TipBoxService.open('该资源已申请，请不要重复申请', 2)
          }
        })
    },

    approveBoxChangeHandler (data) {
      var str = JSON.stringify(data)
      var that = this
      LoadingBoxService.open('审批中，请稍候...')
      apiClient.get(
        'rcapi/auditApplyResources',
        { applyParam: str, id: that.approvalBoxData.id },
        function (data) {
          that.approvalBoxData.id = ''
          if (data.status == '200') {
            LoadingBoxService.close()
            TipBoxService.open('审批成功')
            var num = that.link
            num++
            that.link = num
          } else {
            LoadingBoxService.close()
            TipBoxService.open('审批失败')
          }
        }
      )
    },
    applyFirstSelectHandler (data) {
      // 申请资源弹框第一个下拉框选择事件
      var that = this
      var obj = new Object()
      obj.enterpriseId = 'ZT'
      obj.type = data
      that.resourceType = data
      if (data === 0) {
        that.resourceTypeName = '数据资源'
      } else {
        that.resourceTypeName = '接口资源'
      }
      that.applyBoxData.thirdSelectData = []
      that.applyBoxData.thirdSelectValue = ''
      that.resourceId = ''
      that.resourceName = ''
      that.tag = ''
      that.resourceTotal = 0
      // that.applyBoxData.secondSelectValue=[];
      apiClient.get('rcapi/getTab', obj, function (data) {
        let resData = UtilService.filterChildren(data.results)
        that.applyBoxData.secondSelectData = resData
      })
    },
    tableItemEditHandler (val) {
      // 表单组件点击审批的事件
      this.approvalBoxData.id = val.id
      this.approvalBoxData.openNum++
    },
    tableItemLookHandler (val) {
      // 表单组件点击查看的事件
      // window.sessionStorage.setItem('editId',val.id);
      if (val.tipText == '查看原因') {
        LoadingBoxService.open('数据加载中...')
        apiClient.get('rcapi/viewReason', { id: val.id }, function (data) {
          // console.info("弹框数据=",data);
          var msg = data.results.auditinfo
          if (msg == '') {
            msg = '无未通过原因'
          }
          LoadingBoxService.close()
          AlertBoxService.open(msg, '未通过原因')
        })
      } else if (val.tipText == '查看申请') {
        // this.$router.push({name:'ApplyFillInForm',query:{resourcetype:val.resourcetype,resourcetags:val.resource,resourcename:val.resourcename,id:val.id}});
        // var url = 'applyFillinFormDetail?resourcetype=' + val.resourcetype + '&resourcetags=' + val.resource + '&resourcename=' + val.resourcename + '&id=' + val.id
        // window.open(url, '_blank')
        this.showDetail = true
        this.showWithName = val.resourcename
        this.showWithId = val.id
      }

      // this.$router.push({name:'ApplyFillInFormDetail',query:{resourcetype:val.resourcetype,resourcetags:val.resourcetags,dbsource:val.dbsource,id:val.id}});
    },
    tableItemRemoveHandler (val) {
      // 表单组件点击删除的事件
      var that = this
      NoticeBoxService.open('是否删除当前资源申请，删除后将无法撤回', function (data) {
        NoticeBoxService.close()
        LoadingBoxService.open('删除中，请稍候...')
        apiClient.get(
          'rcapi/deleteApplicationResources',
          { id: val.id },
          function (data) {
            // console.info("removeReturnData=",data);
            if (data.results._response_data.data == 'true') {
              LoadingBoxService.close()
              TipBoxService.open('删除成功')
              that.tableGetDataHandler(val.linkObj)
            } else {
              LoadingBoxService.close()
              TipBoxService.open('删除失败')
            }
          }
        )
      })
    },
    tableGetDataHandler (val) {
      // 表单组件申请表数据
      // console.info("tableApplyData=", val);
      var that = this
      if (val.resourceType == 0) {
        // 数据资源
        apiClient.get('rcapi/loadResourceData', val).then(function (data) {
          // console.info('数据资源=', data)
          LoadingBoxService.close()
          var total = data.total
          that.dataData.pageTotal = total
          // if(that.dataData.headerData[2].tagsData.length==0)
          //   that.dataData.headerData[2].tagsData=data.results.tags[0];
          // if(that.dataData.headerData[3].tagsData.length==0)
          //   that.dataData.headerData[3].tagsData=data.results.tags[1];
          that.dataHandler(data)
          that.dataData.bodyData = data
          that.dataData.bodyData.resourceType = 0
        }, error => {
          LoadingBoxService.close()
          if (error.response && error.response.status === 404) {
            this.searchResultMsg.data = 'API不存在或无法访问'
          } else {
            this.searchResultMsg.data = '检索数据失败, 访问API服务异常'
          }
        })
        // .then(data => {
        //   console.log(data)
        //   var total = data.total
        //   that.dataData.pageTotal = total
        // // if(that.dataData.headerData[2].tagsData.length==0)
        // //   that.dataData.headerData[2].tagsData=data.results.tags[0];
        // // if(that.dataData.headerData[3].tagsData.length==0)
        // //   that.dataData.headerData[3].tagsData=data.results.tags[1];
        //   that.dataHandler(data)
        //   that.dataData.bodyData = data
        //   that.dataData.bodyData.resourceType = 0
        // })
      } else if (val.resourceType == 1) {
        // 接口申请
        apiClient.get('rcapi/loadResourceData', val).then(function (data) {
          // console.info('接口资源=', data)
          LoadingBoxService.close()
          var total = data.total
          that.interfaceData.pageTotal = total
          // if(that.interfaceData.headerData[2].tagsData.length==0)
          //   that.interfaceData.headerData[2].tagsData=data.results.tags[0];
          // if(that.interfaceData.headerData[3].tagsData.length==0)
          //   that.interfaceData.headerData[3].tagsData=data.results.tags[1];
          that.dataHandler(data)
          that.interfaceData.bodyData = data
          that.interfaceData.bodyData.resourceType = 1
        }, error => {
          LoadingBoxService.close()
          if (error.response && error.response.status === 404) {
            this.searchResultMsg.interface = 'API不存在或无法访问'
          } else {
            this.searchResultMsg.interface = '检索数据失败, 访问API服务异常'
          }
        })
      }
      // else if (val.resourceType == 2) {
      //   // 服务申请
      //   apiClient.get('rcapi/loadResourceData', val, function (data) {
      //     var total = data.results.total
      //     that.serviceData.pageTotal = total
      //     // if(that.serviceData.headerData[2].tagsData.length==0)
      //     //   that.serviceData.headerData[2].tagsData=data.results.tags[0];
      //     // if(that.serviceData.headerData[3].tagsData.length==0)
      //     //   that.serviceData.headerData[3].tagsData=data.results.tags[1];
      //     that.dataHandler(data)
      //     that.serviceData.bodyData = data.results
      //     that.serviceData.bodyData.resourceType = 2
      //   })
      // }
    },
    dataHandler (data) {
      data.data.forEach(function (obj, i) {
        if (obj.status === 'WAITING') {
          obj.lookApprovalShow = true
          obj.approvalShow = true
          /* obj.lookProcessShow=true; */
        } else if (obj.status === 'PASS') {
          obj.lookApprovalShow = true
        } else if (obj.status === 'NO_PASS') {
          obj.lookReasonShow = true
          obj.lookApprovalShow = true
        } else if (obj.status === 'EXPIRED') {
          obj.lookApprovalShow = true
        }
      })
      // var newArr = new Array()
      // var dataArr = data.results.data
      // for (var i = 0; i < dataArr.length; i++) {
      //   var obj = dataArr[i]
      //   var newObj = obj
      //   newObj.lineData = [{name: newObj.truename}, {name: newObj.loginname}, {name: newObj.resourcename}, {name: newObj.enterprisename}, {name: newObj.deptname}, {name: '', stateText: true}, {name: newObj.applytime}, {name: '', control: true}]
      //   if (newObj.status == '待审核') {
      //     newObj.lineData[5].name = '待审核'
      //     newObj.class = 'wait'
      //     newObj.approvalShow = true
      //     newObj.lookApprovalShow = true
      //   } else if (newObj.status == '已通过') {
      //     newObj.lineData[5].name = '已通过'
      //     newObj.class = 'pass'
      //     newObj.lookApprovalShow = true
      //   } else if (newObj.status == '未通过') {
      //     newObj.lineData[5].name = '未通过'
      //     newObj.class = 'notPass'
      //     newObj.lookApprovalShow = true
      //     newObj.lookReasonShow = true
      //   }
      //   newArr.push(newObj)
      // }
      // return newArr
    },
    selectedData (data) {
      // console.log('选择的资源项：', data)
      this.applyBoxData.thirdSelectValue = data.name
      this.resourceId = data.id
      this.resourceName = data.name
      if (this.resourceType === 0) {
        this.tag = data.recordTag
      } else {
        let tags = ''
        let serviceTag = data.service_tag
        for (var i = 0; i < serviceTag.length; i++) {
          tags += serviceTag[i] + ','
        }
        this.tag = tags.substring(0, tags.length - 1) // 接口标签
      }
      this.showSelectList = false
      this.iconSelected = true
      this.resourceFlag = true
    },
    handleCurrentChange (val) {
      // console.log(this.applyBoxData.thirdSelectValue)
      let url = ''
      let params
      if (this.resourceType === 0) {
        url = '/rcapi/findResourceItems'
        params = {pageNum: this.pageNum,
          pageSize: this.pageSize,
          resourceType: this.resourceType, // 资源类型
          approvalStatusList: 2,
          tags: this.labels.join(',')}
        apiClient.get(url, params).then(data => {
        // loadingInstance.close()
          this.resourceTotal = data.totalNum
          this.applyBoxData.thirdSelectData = data.dataList
        }).catch(e => {
        // loadingInstance.close()
        })
      } else if (this.resourceType === 1) {
        url = '/itsmApi/atomicService/selectServiceForResource'
        params = {param: {
          serviceType: '1', // 归属应用，默认远程服务-1
          pageConfType: '3', // 页面配置类型 纯数据请求
          pageNum: this.pageNum,
          pageSize: this.pagesize,
          labels: this.labels.join(','),
          approvalStatusList: [2]}}
        apiClient.post(url, params).then(data => {
        // loadingInstance.close()
          this.resourceTotal = data.totalNum
          this.applyBoxData.thirdSelectData = data.dataList
        }).catch(e => {
        // loadingInstance.close()
        })
      }
    },
    findResource () {
      // console.log('11111', this.applyBoxData.thirdSelectValue)
      let url = ''
      let params
      if (this.resourceType === 0) {
        url = '/rcapi/findResourceItemsByName'
        params = {pageNum: 1,
          pageSize: this.pageSize,
          resourceType: this.resourceType, // 资源类型
          approvalStatusList: 2,
          searchParam: this.applyBoxData.thirdSelectValue,
          tags: this.labels.join(',')}
        apiClient.get(url, params).then(data => {
        // loadingInstance.close()
          this.resourceTotal = data.totalNum
          this.applyBoxData.thirdSelectData = data.dataList
        }).catch(e => {
        // loadingInstance.close()
        })
      } else if (this.resourceType === 1) {
        url = '/itsmApi/atomicService/selectServiceForResource'
        params = {param: {keyword: this.applyBoxData.thirdSelectValue,
          serviceType: '1', // 归属应用，默认远程服务-1
          pageConfType: '3', // 页面配置类型 纯数据请求
          pageNum: 1,
          pageSize: this.pagesize,
          labels: this.labels.join(','),
          approvalStatusList: [2]}}
        apiClient.post(url, params).then(data => {
        // loadingInstance.close()
          this.resourceTotal = data.totalNum
          this.applyBoxData.thirdSelectData = data.dataList
        }).catch(e => {
        // loadingInstance.close()
        })
      }
    },
    showSearchResult () {
      if (this.applyBoxData.thirdSelectData.length > 0) {
        this.showSelectList = true
        this.iconSelected = false
      } else if (this.applyBoxData.secondSelectData.length > 0) {
        TipBoxService.open('该目录暂无资源', 2)
      } else {
        TipBoxService.open('请选择资源分类以及目录', 2)
      }
    },
    hideSearchResult () {
      this.showSelectList = false
      this.iconSelected = true
    },
    clickIcon () {
      this.showSelectList = !this.showSelectList
      this.iconSelected = !this.iconSelected
    },
    goHome () {
      this.$router.push({ name: 'RcIndex' })
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style src="" scoped>
.selectBox {
  width: 200px;
  background-color: #fff;
  border-radius: 4px;
  border: 1px solid #58a6f9;
  box-sizing: border-box;
  color: #1f2d3d;
  font-size: inherit;
  height: 36px;
  line-height: 1;
  outline: 0;
  padding: 3px 10px;
  display: inline-block;
}
.selectList {
  position: absolute;
  display: inline-block;
  vertical-align: top;
  max-height: 268px;
  overflow: auto;
  border: solid 1px #d1dbe5;
  background-color: #fff;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  min-width: 200px;
  font-size: 12px;
  top: 40px;
  left: 0;
}
.selectListRow {
  height: 24px;
  line-height: 24px;
  cursor: pointer;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.selectListRow > span {
  float: left;
  padding-left: 12px;
}
.selectLine .selectList > .selectListRow:hover {
  background-color: #55a8fd;
}
.selectList > .selectListRow:nth-of-type(odd) {
  background-color: #ddefff;
}
.icon-reverse {
  transform: rotate(180deg);
}
.iconSelect {
  cursor: pointer;
}
.overlay.high-index {
  z-index: 2000;
}
.selectCascder .el-input__icon {
  right: 0;
}
</style>
