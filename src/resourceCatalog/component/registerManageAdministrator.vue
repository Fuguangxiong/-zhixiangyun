<template>
  <div class="publicContent">
    <!-- <left-nav :selectIndex="1"></left-nav> -->
    <!--<div class="tabContainer">
        <div v-for="(item,index) in uiData.tabArr" class="tabItem" v-bind:class="{active:item.active}" v-on:click="tabItemClickHandler(index)">{{item.name}}</div>

      </div>-->
    <!-- <div class="publicNav">
      <span>注册管理</span>
      <div class="publicRedBtn applyResourcesBtn" v-on:click="applyClickHandler">注册资源</div>
    </div> -->
    <div class="commonnav">
      <span class="item" :class="{active:item.active}" v-for="(item,index) in uiData.tabArr" :key="index" @click="tabItemClickHandler(index)">{{item.name}}</span>
      <privibutton :type="{name:'资源管理', childrenName:'注册管理', code:'registerResource'}">
        <button class="registerbtn" @click="applyClickHandler">注册资源</button>
      </privibutton>
    </div>
    <div class="loadDataBox">
      <!-- <div class="commonTableTabContainer">
        <div v-for="(item,index) in uiData.tabArr" class="commonTableTabItem" v-bind:class="{active:item.active}" v-on:click="tabItemClickHandler(index)">{{item.name}}</div>
      </div> -->
      <!--数据申请-->
      <div class="commonTabContent" v-bind:class="{active:uiData.tabArr[0].active}">
        <common-table-component :error-msg="searchResultMsg.data" :type-name="{name:'资源管理', childrenName:'注册管理'}" :body-data="dataData.bodyData" :header-data="dataData.headerData" :page-total="dataData.pageTotal" :link="link" v-on:change="tableGetDataHandler" v-on:edit="tableItemEditHandler" v-on:look="tableItemLookHandler" :tag-check-data="dataData.checkData" :tags-data="dataData.tagsData" :component-type="dataData.resourceType">
          <div class="slotbox" :slot="'linedata'+index" v-for="(item,index) in dataData.bodyData.data" :key="index">
            <div class="msg">
              <div class="text">
                <span>数据资源名称： </span>
                <span>{{item.resourcename}}</span>
              </div>
              <!-- <div class="text">
                <span>所在单位部门：</span>
                <span>{{item.deptname}}</span>
              </div> -->
              <div class="text">
                <span></span>
                <span></span>
              </div>
            </div>
            <div class="msg">
              <div class="text">
                <span>资源标签： </span>
                <span>{{item.resourcetag.join(',')}}</span>
              </div>
              <div class="text">
                <span>注册者：</span>
                <span>{{item.truename}}</span>
              </div>
              <div class="text">
                <span>创建时间： </span>
                <span>{{item.registtime}}</span>
              </div>
            </div>
            <div class="msg">
              <div class="text">
                <span>审核状态： </span>
                <span :class="dataStatus[item.status].color">{{dataStatus[item.status].name}}</span>
              </div>
              <div class="text">
                <span class="titleinfo">数据源介绍： </span>
                <span class="datainfo" :title="item.datasourcedesc">{{item.datasourcedesc}}</span>
              </div>
              <div class="text">
                <span>使用期限：</span>
                <span>{{item.time}}</span>
              </div>
            </div>
          </div>
        </common-table-component>
      </div>
      <!--数据申请-->
      <!--接口申请-->
      <div class="commonTabContent" v-bind:class="{active:uiData.tabArr[1].active}">
        <common-table-component :error-msg="searchResultMsg.interface" :type-name="{name:'资源管理', childrenName:'注册管理'}" :body-data="interfaceData.bodyData" :header-data="interfaceData.headerData" :page-total="interfaceData.pageTotal" :link="link" v-on:change="tableGetDataHandler" v-on:edit="tableItemEditHandler" v-on:look="tableItemLookHandler" :tag-check-data="interfaceData.checkData" :tags-data="interfaceData.tagsData" :component-type="interfaceData.resourceType">
          <div class="slotbox" :slot="'linedata'+index" v-for="(item,index) in interfaceData.bodyData.data" :key="index">
            <div class="msg">
              <div class="text">
                <span>接口名称： </span>
                <span>{{item.name}}</span>
              </div>
              <div class="text">
                <span>所在单位部门：</span>
                <span>{{item.enterpriseName}}</span>
              </div>
              <div class="text">
                <span></span>
                <span></span>
              </div>
            </div>
            <div class="msg">
              <div class="text">
                <span>标签： </span>
                <span>{{item.resourcetag.toString()}}</span>
              </div>
              <div class="text">
                <span>注册者： </span>
                <span>{{item.trueName}}</span>
              </div>
              <div class="text">
                <span>创建时间： </span>
                <span>{{item.apply_time}}</span>
              </div>
            </div>
            <div class="msg">
              <div class="text">
                <span>审核状态： </span>
                <span :class="statusInfo(item).color">{{statusInfo(item).status}}</span>
              </div>
              <div class="text">
                <span>接口介绍： </span>
                <span :title="item.service_remark">{{item.service_remark}}</span>
              </div>
              <div class="text">
                <span>使用期限：</span>
                <span>{{item.time}}</span>
              </div>
            </div>
          </div>
        </common-table-component>
      </div>
      <!--接口申请-->
      <!--服务申请-->
      <div class="commonTabContent" v-bind:class="{active:uiData.tabArr[2].active}">
        <common-table-component :error-msg="searchResultMsg.metadata" :type-name="{name:'资源管理', childrenName:'注册管理'}" :body-data="serviceData.bodyData" :header-data="serviceData.headerData" :page-total="serviceData.pageTotal" :link="link" v-on:change="tableGetDataHandler" v-on:edit="tableItemEditHandler" v-on:look="tableItemLookHandler" :tag-check-data="serviceData.checkData" :tags-data="serviceData.tagsData" :component-type="serviceData.resourceType">
          <div class="slotbox" :slot="'linedata'+index" v-for="(item,index) in serviceData.bodyData.dataList" :key="index">
            <div class="msg">
              <div class="text">
                <span>数据元名称： </span>
                <span>{{item.name}}</span>
              </div>
              <div class="text">
                <span>数据元中文名称： </span>
                <span>{{item.cnName}}</span>
              </div>
              <div class="text">
                <span></span>
                <span></span>
              </div>
            </div>
            <div class="msg">
              <div class="text">
                <span>标签： </span>
                <span>{{item.resourcetag.toString()}}</span>
              </div>
              <div class="text">
                <span>注册者： </span>
                <span>{{item.recordPerson}}</span>
              </div>
              <div class="text">
                <span>创建时间： </span>
                <span>{{item.createdTime}}</span>
              </div>
            </div>
            <div class="msg">
              <div class="text">
                <span>审核状态： </span>
                <span :class="statusInfo(item).color">{{status[item.approvalStatus]}}</span>
              </div>
              <!-- <div class="text">
                <span>所在单位部门： </span>
                <span>{{item.recordUnit}}</span>
              </div> -->
              <div class="text">
                <span>数据元内部标识符： </span>
                <span>{{item.internalTag}}</span>
              </div>
            </div>
          </div>
        </common-table-component>
      </div>

      <!--服务申请-->

    </div>
    <!--申请资源弹框-->
    <transition name="fade">
      <div class="overlay high-index" v-show="uiData.applyResourceBoxShow">
        <div class="rc_popupBox large">
          <div class="popupBoxHeader">注册资源
            <i class="popupBoxCloseIconBtn" v-on:click="closeApplyBoxHandler"></i>
          </div>
          <div class="rc_popupBoxBody">
            <div class="popupBoxLine">
              <span class="popupBoxLineTitle">注册资源分类</span>
              <el-select popper-class="rc_selectDown" v-model="applyBoxData.firstSelectValue" @change="applyFirstSelectHandler" placeholder="请选择">
                <el-option v-for="(item,index) in applyBoxData.firstSelectData" :key="item" :label="item" :value="item">
                </el-option>
              </el-select>
            </div>
            <div class="popupBoxLine">
              <span class="popupBoxLineTitle">数据类型</span>
              <el-select popper-class="rc_selectDown" v-model="applyBoxData.secondSelectValue" placeholder="请选择">

                <el-option v-for="group in applyBoxData.secondSelectData" :key="group" :label="group" :value="group">
                </el-option>

              </el-select>
            </div>
          </div>
          <div class="rc_popupBoxBtnContainer">
            <div class="popupBoxBtn" v-on:click="closeApplyBoxHandler">取消</div>
            <div class="popupBoxBtn redBg" v-on:click="applyBoxOkHandler">确定</div>
          </div>
        </div>
      </div>
    </transition>
    <!--审批弹框-->
    <common-approval-box :openNum="approvalBoxData.openNum" @change="approveBoxChangeHandler"></common-approval-box>
    <!--审批弹框end-->
    <CompDetail :show.sync="showResDetail" :title=" '《'+ showResName + '》' + '数据资源详情'">
      <div slot="component">
        <DataResourceDetail :resId="showResId" />
      </div>
    </CompDetail>
    <CompDetail :show.sync="showEleDetail" :title=" '《'+ showEleName + '》' + '数据元详情'">
      <div slot="component">
        <DataElementDetail :eleId="showEleId" />
      </div>
    </CompDetail>
    <CompDetail :show.sync="showInterface" :title=" '《'+ showInterfaceName +'》' + '接口详情'">
      <div slot="component">
        <InterfaceDetail :id="showInterfaceId" />
      </div>
    </CompDetail>
    <LabelView :dialogTagVisible.sync="dialogTagVisible" :model="selectItem" modelLabelKey="resourcetag" :changeLabelCaller="saveLabel" />
  </div>
</template>

<script>
  import privibutton from '@/publicComponent/privibutton'
  import commonTableComponent from '@/publicComponent/commonTableComponent'
  import ApiClient from '@/publicJs/ApiClient'
  import TipBoxService from '@/publicJs/TipBoxService'
  import NoticeBoxService from '@/publicJs/NoticeBoxService'
  import LoadingBoxService from '@/publicJs/LoadingBoxService'
  import AlertBoxService from '@/publicJs/AlertBoxService'
  import UtilService from '@/publicJs/UtilService'
  import commonApprovalBox from '@/publicComponent/commonApprovalBox'
  import Constants from '@/publicJs/Constants.js'
  import CompDetail from '../../resourceCatalog/popupDetails/CompDetail.vue'
  import DataResourceDetail from '../component/dataResourcesFillInFormDetail.vue'
  import DataElementDetail from '../component/dataElementFillInFormDetail.vue'
  import InterfaceDetail from './interface/detail.vue'
  import Util from '@/publicJs/Util'
  import LabelView from '@/publicComponent/labelView'
  import apiClient from '@/publicJs/ApiClient.js'
  import codeMap from '../publicJs/status.js'
  export default {
    name: 'registerManageAdministrator',
    components: {
      commonTableComponent,
      commonApprovalBox,
      CompDetail,
      DataResourceDetail,
      DataElementDetail,
      LabelView,
      InterfaceDetail,
      privibutton
    },
    data () {
      return {
        searchResultMsg: {data: '', interface: '', metadata: ''},
        dialogTagVisible: false,
        selectItem: {resourcetag: ''},
        dataStatus: null,
        status: {
          0: '未提交',
          1: '待审核',
          2: '已通过',
          3: '未通过'
        },
        link: 0,
        showEleDetail: false,
        showResDetail: false,
        showResId: '',
        showEleId: '',
        showEleName: '',
        showResName: '',
        showInterface: false,
        showInterfaceId: '',
        showInterfaceName: '',
        uiData: {
          tabArr: [{name: '注册数据资源', active: true},
                   {name: '注册接口', active: false},
                   {name: '注册数据元', active: false}],
          applyResourceBoxShow: false,
          approvalBoxShow: false
        },
        applyBoxData: {
          firstSelectData: ['数据资源', '接口', '服务'],
          secondSelectData: [],
          firstSelectValue: '',
          secondSelectValue: ''
        },
        approvalBoxData: {
          id: '',
          openNum: 0
        },
        dataData: { // 数据申请
          bodyData: {},
          headerData: [],
          checkData: [{name: '待审批通过', select: true, statu: 1},
                      {name: '审批已通过', select: true, statu: 2},
                      {name: '审批未通过', select: true, statu: 3},
                      {name: '已过期', select: true, statu: 4 }],
          tagsData: [],
          resourceType: 0,
          pageTotal: 0
        },
        interfaceData: { // 接口申请
          bodyData: {},
          headerData: [],
          checkData: [{name: '待审批通过', select: true, statu: 1},
                      {name: '审批已通过', select: true, statu: 2},
                      {name: '审批未通过', select: true, statu: 3}],
          tagsData: [],
          resourceType: 1,
          pageTotal: 0
        },
        serviceData: { // 服务申请
          bodyData: {},
          headerData: [],
          checkData: [{name: '待审批通过', select: true, statu: 1},
                      {name: '审批已通过', select: true, statu: 2},
                      {name: '审批未通过', select: true, statu: 3}],
          tagsData: [],
          resourceType: 2,
          pageTotal: 0
        }
      }
    },
    created () {
      // var date = new Date()
      this.createDataData()
      this.createInterfaceData()
      this.createServiceData()
      this.dataStatus = codeMap.status
    },
    methods: {
      statusInfo (item) {
        let result = {}
        let status = item.status
        if (item.status === undefined) {
          status = item.audit_status
        }
        for (var k in this.status) {
          if (k - 0 == status) {
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
        that.dataData.headerData = [{name: '数据资源名称', textShow: true},
          {name: '资源标签', tagSelct: true, textShow: false, tagOpen: false, tagsData: []},
          {name: '数据源介绍', textShow: true},
          {name: '审批状态', textShow: true},
          {name: '注册者', textShow: true},
          {name: '所在单位部门', textShow: true},
          {name: '创建时间', timeSelect: true, textShow: false},
          {name: '操作', textShow: true}]
      },
      createInterfaceData () {
        var that = this
        that.interfaceData.headerData = [{name: '接口名称', textShow: true},
          {name: '标签', tagSelct: true, textShow: false, tagOpen: false, tagsData: []},
          {name: '接口介绍', textShow: true},
          {name: '审批状态', textShow: true},
          {name: '注册者', textShow: true},
          {name: '所在单位部门', textShow: true},
          {name: '创建时间', timeSelect: true, textShow: false},
          {name: '操作', textShow: true}]
      },

      /* 服务申请 */
      createServiceData () {
        var that = this
        that.serviceData.headerData = [{name: '数据元名称', textShow: true},
          {name: '数据元内部标识符', textShow: true},
          {name: '数据元中文名称', textShow: true},
          {name: '审批状态', textShow: true},
          {name: '注册者', textShow: true},
          {name: '所在单位部门', textShow: true},
          {name: '创建时间', timeSelect: true, textShow: false},
          {name: '操作', textShow: true}]
      },
      applyClickHandler () { // 打开注册资源弹框
        // console.info("申请资源");
        let that = this
        this.uiData.applyResourceBoxShow = true
        ApiClient.get('rcapi/dataSource', {}, function (data) {
          that.applyBoxData.firstSelectData = data.results
        })
      },
      closeApplyBoxHandler () { // 关闭申请资源弹框
        this.uiData.applyResourceBoxShow = false
      },
      applyBoxOkHandler () { // 注册资源弹框确定事件
        var that = this
        var firstVal = that.applyBoxData.firstSelectValue
        var secondValId = that.applyBoxData.secondSelectValue
        // var secondValContainerId = ''
        // var find = false
        if (firstVal == '' || secondValId == '') {
          TipBoxService.open('请选择所申请类型', 2)
        } else {
          let resource = that.applyBoxData.firstSelectValue
          let dbinfo = that.applyBoxData.secondSelectValue
          if (resource == '数据资源') {
            resource = '0'
          } else if (resource == '接口') {
            resource = '1'
          } else if (resource == '数据元') {
            resource = '2'
          }
          if (dbinfo == '数据库型') {
            dbinfo = '0'
          } else if (dbinfo == 'API型') {
            dbinfo = '1'
          } else if (dbinfo == '数据元') {
            dbinfo = '2'
          }
          if (that.applyBoxData.firstSelectValue == '数据资源') {
            sessionStorage.removeItem('page1')
            sessionStorage.removeItem('page2')
            sessionStorage.removeItem('page3')
            this.$router.push({name: 'dataintroduced', query: {resource: resource, dbinfo: dbinfo, type: 'register'}})
          } else if (that.applyBoxData.firstSelectValue == '数据元') {
            this.$router.push({name: 'metadataRegister', params: {page: 'new', breadCrumbStr: '注册管理>注册数据元'}})
          } else {
            this.$router.push({ name: 'newServiceForPersonRegister',
              query: { resource: resource, dbinfo: dbinfo, type: 'API' } }
  
          )
          }
        }
      },
      approveBoxChangeHandler (data) {
        var that = this
        var tabArr = that.uiData.tabArr
        for (var i = 0; i < tabArr.length; i++) {
          if (tabArr[i].active === true) {
            var num = i
            break
          }
        }
        if (num === 0) {
          data.resourceType = 'data'
        } else if (num === 1) {
          data.resourceType = 'interface'
        } else if (num === 2) {
          data.resourceType = 'metadata'
        }
        var str = JSON.stringify(data)
        LoadingBoxService.open('审批中，请稍候...')
        ApiClient.get('rcapi/auditResources', {applyParam: str, id: that.approvalBoxData.id}, function (data) {
          // console.log(data)
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
        })
      },

      applyFirstSelectHandler (data) {
          // 申请资源弹框第一个下拉框选择事件
        if (data == '数据资源') {
          data = '0'
        } else if (data == '接口') {
          data = '1'
        } else if (data == '数据元') {
          data = '2'
        }
        var that = this
        that.applyBoxData.secondSelectValue = ''
        ApiClient.get('rcapi/dataType', {resourceType: data}, function (datas) {
          that.applyBoxData.secondSelectData = datas.results
          // console.log(datas)
          // console.log('第二个下拉列表=',that.applyBoxData.secondSelectData)
        })
      },
      tableItemEditHandler (val) { // 表单组件点击审批的事件
        var type = val.tableItemChangeType
        if (type === 'changeLabel') {
          this.selectItem = val
          this.dialogTagVisible = true
        } else {
       // window.sessionStorage.setItem('editId',val.id);
        // this.$router.push({name:'ApplyFillInForm',params:{resourcetype:val.resourcetype,resourcetags:val.resourcetags,dbsource:val.dbsource}});
          this.approvalBoxData.id = val.id
          this.approvalBoxData.openNum++
        }
      },
      tableItemLookHandler (val) { // 表单组件点击查看的事件
        // window.sessionStorage.setItem('editId',val.id);
        var that = this
        if (val.tipText == '查看原因') {
          LoadingBoxService.open('数据加载中...')
          ApiClient.get('rcapi/viewRegistReason', {id: val.id, resourceType: val.resourceType}, function (data) {
            // console.info("弹框数据=",data);
            var msg = data.results.auditinfo
            if (msg == '' || msg == undefined) { msg = '无未通过原因' }
            LoadingBoxService.close()
            AlertBoxService.open(msg, '未通过原因')
          })
        } else if (val.tipText == '查看申请') {
            // if(val.)
          var tabArr = that.uiData.tabArr
          var num = 0
          var url = ''
          for (var i = 0; i < tabArr.length; i++) {
            if (tabArr[i].active == true) {
              num = tabArr[i].name
              break
            }
          }
          if (num == '注册数据资源')// 注册数据资源
          {
            // url = 'dataResourcesFillInFormDetail?resourcetype=' + val.resourcetype + '&id=' + val.id
            this.showResDetail = true
            this.showResName = val.resourcename
            this.showResId = val.id
          } else if (num == '注册接口') {
            if (val.isatomic == 'false') {
              window.open('/compositeServiceDetail?id=' + val.id + '&audit_status=' + val.audit_status, '_blank')
            } else {
              // window.open('/interfaceDetail?id=' + val.id + '&audit_status=' + val.audit_status, '_blank')
              this.showInterface = true
              this.showInterfaceId = val.id
              this.showInterfaceName = val.name
            }
          } else if (num == '注册数据元')// 注册数据源
          {
            // url = 'dataElementFillInFormDetail?id=' + val.id
            this.showEleDetail = true
            this.showEleName = val.name
            this.showEleId = val.id
          }

          // window.open(url + '&token=' + Constants.token, '_blank')
        }

        // this.$router.push({name:'ApplyFillInFormDetail',query:{resourcetype:val.resourcetype,resourcetags:val.resourcetags,dbsource:val.dbsource,id:val.id}});
      },
      tableItemRemoveHandler (val) { // 表单组件点击删除的事件
        var that = this
        NoticeBoxService.open('是否删除当前注册数据项，删除后将无法撤回', function (data) {
          NoticeBoxService.close()
          LoadingBoxService.open('删除中，请稍候...')
          ApiClient.get('rcapi/deleteApplicationResources', {id: val.id}, function (data) {
            // console.info("removeReturnData=",data);
            if (data._response_data.data == 'true') {
              LoadingBoxService.close()
              TipBoxService.open('删除成功')
              that.tableGetDataHandler(val.linkObj)
            } else {
              LoadingBoxService.close()
              TipBoxService.open('删除失败')
            }
          })
        })
      },
      tableGetDataHandler (val) {
        // 表单组件申请表数据
        // console.info("tableApplyData=", val);
        var that = this

        if (val.resourceType == 0)// 数据资源
        {
          var date = new Date()
          ApiClient.get('rcapi/queryRegistResources', val).then(function (data) {
            // console.log('数据', data)
            if (data != 'error') {
              if (data.data.length > 0) {
                var total = data.total
                that.dataData.pageTotal = total
                // if (that.dataData.headerData[1].tagsData.length == 0) { that.dataData.headerData[1].tagsData = data.tags[0] }
                // var newData = that.dataHandler(data)
                that.dataData.bodyData = data
                that.controlData(that.dataData.bodyData.data)
                that.dataData.bodyData.resourceType = 0
                // that.dataData.bodyData = newData
              } else {
                  // that.$set(that.dataData,'tipMsg',"无数据");
                that.dataData.bodyData = []
                that.dataData.bodyData.resourceType = 0
              }
            } else {
              that.dataData.bodyData = 'error'
            }
          }, error => {
            LoadingBoxService.close()
            if (error.response && error.response.status === 404) {
              this.searchResultMsg.data = 'API不存在或无法访问'
            } else {
              this.searchResultMsg.data = '检索数据失败, 访问API服务异常'
            }
          })
        } else if (val.resourceType == 1)// 接口申请
        {
          var newObj = new Object()
          newObj.serviceType = '1'// 归属应用，默认远程服务-1
          newObj.pageConfType = '3'// 页面配置类型 纯数据请求
          newObj.keyword = val.searchParam
          newObj.pageNum = val.pageNum
          newObj.pageSize = val.pageSize
          var dataStrArr = val.status.split(',')// 分割成字符串数组
          var dataIntArr = []// 保存转换后的整型字符串
          dataStrArr.forEach(function (data, index, arr) {
            dataIntArr.push(+data)
          })
          newObj.approvalStatusList = dataIntArr
          if (val.tag != null && val.tag != '') {
            var tag = JSON.parse(val.tag)
            newObj.labels = tag.tag
          }
          var sort = 'desc'
          if (val.sort == 1) { sort = 'asc' }
          newObj.sortType = sort
          ApiClient.post('itsmApi/atomicService/selectServiceForResourceByStatus', {param: JSON.stringify(newObj)}).then(function (data) {
            if (data != 'error') {
              console.log('注册接口', data)
              if (data.data.length > 0) {
                var total = data.total
                that.interfaceData.pageTotal = total
              // if (that.interfaceData.headerData[1].tagsData.length == 0) { that.interfaceData.headerData[1].tagsData = data.tags[0] }
                that.interfaceData.bodyData = data
                that.controlInterfaceData(that.interfaceData.bodyData.data)
                that.interfaceData.bodyData.resourceType = 1
              } else {
                that.interfaceData.bodyData = []
                that.interfaceData.bodyData.resourceType = 1
              }
            } else {
              that.interfaceData.bodyData = 'error'
            }
          }, error => {
            LoadingBoxService.close()
            if (error.response && error.response.status === 404) {
              this.searchResultMsg.interface = 'API不存在或无法访问'
            } else {
              this.searchResultMsg.interface = '检索数据失败, 访问API服务异常'
            }
          })
        } else if (val.resourceType == 2)// 注册数据元
        {
          var newObj = new Object()
          newObj.keyword = val.searchParam
          newObj.pageNum = val.pageNum
          newObj.pageSize = val.pageSize
          newObj.approvalStatusList = val.status
          if (val.tag != null && val.tag != '') {
            var tag = JSON.parse(val.tag)
            newObj.labels = tag.tag
          }
          var sort = 'desc'
          if (val.sort == 1) { sort = 'asc' }
          newObj.sortType = sort
          newObj.userFlag = '1' // 注册管理数据元查询不需要关联用户
          ApiClient.get('rcapi/metadata/query', newObj).then(function (data) {
            if (data != 'error') {
              if (data.dataList.length > 0) {
                var total = data.totalNum
                that.serviceData.pageTotal = total
                that.serviceData.bodyData = data
                that.controlElementData(that.serviceData.bodyData.dataList)
                that.serviceData.bodyData.resourceType = 2
              // console.log(data, 1111)
              // console.log(that.serviceData.bodyData, 2222)
              // var newData = that.elementDataHandler(data)
              // that.serviceData.bodyData = newData
              } else {
                that.serviceData.bodyData = []
                that.serviceData.bodyData.resourceType = 2
              }
            } else {
              that.serviceData.bodyData = 'error'
            }
          }, error => {
            LoadingBoxService.close()
            if (error.response && error.response.status === 404) {
              this.searchResultMsg.metadata = 'API不存在或无法访问'
            } else {
              this.searchResultMsg.metadata = '检索数据失败, 访问API服务异常'
            }
          })
        }
      },
      dataHandler (data) {
        var newArr = new Array()
        var dataArr = data.data
        for (var i = 0; i < dataArr.length; i++) {
          var obj = dataArr[i]
          var newObj = obj
          newObj.lineData = [{name: newObj.resourcename}, {name: newObj.resourcetag}, {name: newObj.datasourcedesc}, {name: '', stateText: true}, {name: newObj.truename}, {name: newObj.deptname}, {name: newObj.registtime}, {name: '', control: true}]
          // newObj.lineData=[{img:true,imgSrc:''},{name:newObj.resourcetag},{name:newObj.datasourcedesc},{name:'',stateText:true},{name:newObj.truename},{name:newObj.deptname},{name:newObj.registtime},{name:'',control:true}]
          if (newObj.status == '待审核') {
            newObj.lineData[3].name = '待审批'
            newObj.class = 'wait'
            newObj.approvalShow = true
            newObj.lookApprovalShow = true

          // newObj.downShow=true;
          } else if (newObj.status == '已通过') {
            newObj.lineData[3].name = '已通过'
            newObj.class = 'pass'
            newObj.lookApprovalShow = true
          /* newObj.switchShow=true;
          newObj.switchData=false;
          newObj.renewShow=true;
          newObj.upShow=true; */
          } else if (newObj.status == '未通过') {
            newObj.lineData[3].name = '未通过'
            newObj.class = 'notPass'
            newObj.lookApprovalShow = true
            newObj.lookReasonShow = true
          }
          newArr.push(newObj)
        }
        return newArr
      },
      controlData (data) {
        data.forEach(function (obj, i) {
          // 设置使用期限
          if (obj.perioduse === 0) {
            obj.time = UtilService.formatDuring(obj.begintime, 'yyyy-MM-dd') + ' - ' + UtilService.formatDuring(obj.endtime, 'yyyy-MM-dd')
          } else if (obj.perioduse === 1) {
            obj.time = '长期使用'
          }
          // 将标签值由字符串改成数组
          obj.resourcetag = obj.resourcetag.split(',')
          // 每条数据上都放上类型，用于修改标签保存操作
          obj.resourceType = 0
          if (obj.status == 'WAITING') {
            obj.lookApprovalShow = true
            obj.approvalShow = true
              /* obj.lookProcessShow=true; */
          } else if (obj.status == 'PASS') {
            obj.tipText = ''
            obj.lookApprovalShow = true
            obj.changeLabel = true
          } else if (obj.status == 'NO_PASS') {
            obj.tipText = '查看原因'
            obj.lookReasonShow = true
            obj.lookApprovalShow = true
          } else if (obj.status == 'EXPIRED') {
            obj.lookApprovalShow = true
          }
        })
      },
      controlInterfaceData (data) {
        data.forEach(function (obj, i) {
          // 为了便于标签组件处理，将标签属性名统一改成resourcetag
          obj.resourcetag = obj.service_tag
          // 每条数据上都放上类型，用于修改标签保存操作
          obj.resourceType = 1
          if (obj.audit_status == 1) {
            obj.lookApprovalShow = true
            obj.approvalShow = true
              /* obj.lookProcessShow=true; */
          } else if (obj.audit_status == 2) {
            obj.tipText = ''
            obj.lookApprovalShow = true
            obj.changeLabel = true
          } else if (obj.audit_status == 3) {
            obj.tipText = '查看原因'
            obj.lookReasonShow = true
            obj.lookApprovalShow = true
          }
        })
      },
      controlElementData (data) {
        data.forEach(function (obj, i) {
          // 每条数据上都放上类型，用于修改标签保存操作
          obj.resourceType = 2
          // 为了便于标签组件处理，将标签属性名统一改成resourcetag
          obj.resourcetag = obj.labels
          obj.createdTime = UtilService.formatDuring(obj.createdTime, 'yyyy-MM-dd HH:mm:ss')
          obj.status = obj.approvalStatus
          if (obj.approvalStatus === 1) {
            obj.lookApprovalShow = true
            obj.approvalShow = true
              /* obj.lookProcessShow=true; */
          } else if (obj.approvalStatus === 2) {
            obj.lookApprovalShow = true
            obj.changeLabel = true
          } else if (obj.approvalStatus === 3) {
            obj.lookReasonShow = true
            obj.lookApprovalShow = true
          }
        })
      },
      elementDataHandler (data) { // 处理武汉数据元的数据
        var newArr = new Array()
        var dataArr = data.dataList
        var that = this
        for (var i = 0; i < dataArr.length; i++) {
          var obj = dataArr[i]
          var newObj = obj
         // var time=new Date(parseInt(newObj.createdTime) * 1000).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");
          var time = UtilService.formatDuring(newObj.createdTime, 'yyyy-MM-dd HH:mm:ss')
          newObj.lineData = [{name: newObj.name}, {name: newObj.internalTag}, {name: newObj.cnName}, {naem: '', stateText: true}, {name: newObj.recordPerson}, {name: newObj.recordUnit}, {name: time}, {name: '', control: true}]
          if (newObj.approvalStatus == 1) {
            newObj.lineData[3].name = '待审批'
            newObj.class = 'wait'
            newObj.approvalShow = true
            newObj.lookApprovalShow = true
          } else if (newObj.approvalStatus == 2) {
            newObj.lineData[3].name = '已通过'
            newObj.class = 'pass'
            newObj.lookApprovalShow = true
          } else if (newObj.approvalStatus == 3) {
            newObj.lineData[3].name = '未通过'
            newObj.class = 'notPass'
            newObj.lookApprovalShow = true
            newObj.lookReasonShow = true
          }
          newArr.push(newObj)
        }
        return newArr
      },
      goHome () {
        this.$router.push({name: 'RcIndex'})
      },
      saveLabel () {
        var that = this
        return apiClient.get('/rcapi/changeLabel', {
          id: that.selectItem.id,
          tags: that.selectItem.resourcetag.join(','),
          resourceType: that.selectItem.resourceType
        }).then(data => {
          return true
        }).catch(e => {
          console.error(e)
          return false
        })
      }
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.registerbtn {
  height: 24px;
  line-height: 22px;
  padding: 0 8px;
  border: 1px solid #56a8fe;
  border-radius: 10px;
  background: #fff;
  color: #56a8fe;
  float: right;
  margin-top: 10px;
  margin-right: 15px;
  outline: none;
}
.slotbox {
  float: left;
}
/* .text span:nth-of-type(1) {
    color: #000;
  }
  .text span:nth-of-type(2) {
    color: #888;
  } */
.slotbox {
  float: left;
}
.overlay.high-index {
  z-index: 2000;
}
</style>
