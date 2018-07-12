  <template>
  <div class="publicContent">
    <!-- <left-nav :selectIndex="2"></left-nav> -->
    <!-- <div class="publicNav">
      <span>个人注册</span>
      <div class="publicRedBtn applyResourcesBtn" v-on:click="registerClickHandler">注册资源</div>
    </div> -->
    <div class="commonnav">
      <span class="item" :class="{active:item.active}" v-for="(item,index) in uiData.tabArr" :key="index" @click="tabItemClickHandler(index)">{{item.name}}</span>
      
      <button v-if="verifyPermission('009003001')" class="registerbtn" @click="registerClickHandler">注册资源</button>
    </div>
    <div class="loadDataBox">
      <!-- <div class="commonTableTabContainer">
            <div v-for="(item,index) in uiData.tabArr" class="commonTableTabItem" v-bind:class="{active:item.active}" v-on:click="tabItemClickHandler(index)">{{item.name}}</div>
          </div> -->
      <!--注册数据资源-->
      <div class="commonTabContent" v-bind:class="{active:uiData.tabArr[0].active}">
        <common-table-component :error-msg="searchResultMsg.data" :type-name="{name:'资源管理', childrenName:'我的注册'}" :body-data="dataData.bodyData" :header-data="dataData.headerData" :page-total="dataData.pageTotal" :admin="true" v-on:change="tableGetDataHandler" v-on:edit="tableItemEditHandler" v-on:remove="tableItemRemoveHandler" v-on:look="tableItemLookHandler" :tag-check-data="dataData.checkData" :component-type="dataData.resourceType">
          <!-- <div slot="tagSelct" @click.stop="dataTagshow=!dataTagshow" class="filterItem tagSelct">
                  <span>资源标签</span><i class="iconfont icon-xiala1"></i>
                  <div class="tagbox" v-show="dataTagshow">
                    <p v-for="(item,index) in dataData.bodyData.tags" @click="selectTag=item" :key="index">{{item}}</p>
                  </div>
                </div> -->
          <!-- <div slot="timeSelect" class="filterItem">
              <span>审核时间</span><i class="iconfont icon-iconzhenghe32"></i>
            </div> -->
          <div class="slotbox" :slot="'linedata'+index" v-for="(item,index) in dataData.bodyData.data" :key="index">
            <div class="msg">
              <div class="text">
                <span>数据资源名称： </span>
                <span>{{item.resourcename}}</span>
              </div>
            </div>
            <div class="msg">
              <div class="text">
                <span>资源标签： </span>
                <span>{{item.resourcetag}}</span>
              </div>
              <div class="text">
                <span>审核时间： </span>
                <span>{{item.audittime}}</span>
              </div>
              <div class="text">
                <span>创建时间：</span>
                <span>{{item.registtime}}</span>
              </div>
            </div>
            <div class="msg">
              <div class="text">
                <span>审核状态： </span>
                <span :class="dataStatus[item.status].color">{{dataStatus[item.status].name}}</span>
              </div>
              <div :title="item.datasourcedesc" class="text">
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
      <!--注册数据资源-->
      <!--注册接口-->
      <div class="commonTabContent" v-bind:class="{active:uiData.tabArr[1].active}">
        <div class="commonTabContent" v-bind:class="{active:uiData.tabArr[1].active}">
          <common-table-component :error-msg="searchResultMsg.interface" :type-name="{name:'资源管理', childrenName:'我的注册'}" :body-data="portData.bodyData" :header-data="portData.headerData" :page-total="portData.pageTotal" :admin="true" v-on:change="tableGetDataHandler" v-on:look="tableItemLookHandler" v-on:edit="tableItemEditHandler" v-on:remove="tableItemRemoveHandler" :tag-check-data="portData.checkData" :tags-data="portData.tagsData" :component-type="portData.resourceType">
            <div class="slotbox" :slot="'linedata'+index" v-for="(item,index) in portData.bodyData.data" :key="index">
              <div class="msg">
                <div class="text">
                  <span>接口名称： </span>
                  <span>{{item.name}}</span>
                </div>
              </div>
              <div class="msg">
                <div class="text">
                  <span>标签：</span>
                  <span>{{item.service_tag}}</span>
                </div>
                <div class="text">
                  <span>审核时间： </span>
                  <span>{{item.open_time}}</span>
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
      </div>
      <!--注册接口-->
      <!--注册数据元-->
      <div class="commonTabContent" v-bind:class="{active:uiData.tabArr[2].active}">
        <common-table-component :error-msg="searchResultMsg.metadata" :type-name="{name:'资源管理', childrenName:'我的注册'}" :body-data="dataElementData.bodyData" :admin="true" :header-data="dataElementData.headerData" :page-total="dataElementData.pageTotal" v-on:change="tableGetDataHandler" v-on:edit="tableItemEditHandler" v-on:remove="tableItemRemoveHandler" v-on:look="tableItemLookHandler" :tag-check-data="dataElementData.checkData" :tags-data="dataElementData.tagsData" :component-type="dataElementData.resourceType">
          <div class="slotbox" :slot="'linedata'+index" v-for="(item,index) in dataElementData.bodyData.dataList" :key="index">
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
                <span>数据元内部标识符： </span>
                <span>{{item.internalTag}}</span>
              </div>
            </div>
            <div class="msg">
              <div class="text">
                <span>标签： </span>
                <span>{{item.labels.toString()}}</span>
              </div>
              <div class="text">
                <span>审核时间： </span>
                <span>{{item.approveDate}}</span>
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
              <div class="text">
                <span>数据元标识符： </span>
                <span>{{item.tag}}</span>
              </div>
              <div class="text">
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        </common-table-component>
      </div>
      <!--注册数据元-->

    </div>
    <!--申请资源弹框-->
    <div class="overlay high-index" v-show="uiData.applyResourceBoxShow">
      <div class="rc_popupBox large">
        <div class="popupBoxHeader">注册资源
          <i class="popupBoxCloseIconBtn" v-on:click="closeRegisterBoxHandler"></i>
        </div>
        <div class="rc_popupBoxBody">
          <div class="popupBoxLine">
            <span class="popupBoxLineTitle">注册资源分类</span>
            <el-select popper-class="rc_selectDown" v-model="registerBoxData.firstSelectValue" @change="applyFirstSelectHandler" placeholder="请选择">
              <el-option v-for="item in registerBoxData.firstSelectData" :key="item" :label="item" :value="item">
              </el-option>
            </el-select>
          </div>
          <div class="popupBoxLine">
            <span class="popupBoxLineTitle">数据类型</span>
            <el-select popper-class="rc_selectDown" v-model="registerBoxData.secondSelectValue" placeholder="请选择">
              <el-option v-for="group in registerBoxData.secondSelectData" :key="group" :label="group" :value="group">
              </el-option>

            </el-select>
          </div>
        </div>
        <div class="rc_popupBoxBtnContainer">
          <div class="popupBoxBtn" v-on:click="closeRegisterBoxHandler">取消</div>
          <div class="popupBoxBtn redBg" v-on:click="applyBoxOkHandler">确定</div>
        </div>
      </div>
    </div>
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
    <CompDetail :show.sync="showInterface" :title=" '《' + showInterfaceName + '》' + '接口详情'">
      <div slot="component">
        <InterfaceDetail :id="showInterfaceId" />
      </div>
    </CompDetail>
  </div>
</template>
<script>
import privibutton from '@/publicComponent/privibutton'
import commonTableComponent from '@/publicComponent/commonTableComponent'
import TipBoxService from '@/publicJs/TipBoxService'
import leftNav from '@/publicComponent/leftNav'
import LoadingBoxService from '@/publicJs/LoadingBoxService'
import NoticeBoxService from '@/publicJs/NoticeBoxService'
import UtilService from '@/publicJs/UtilService'
import ApiClient from '@/publicJs/ApiClient.js'
import AlertBoxService from '@/publicJs/AlertBoxService'
import CompDetail from '../../resourceCatalog/popupDetails/CompDetail.vue'
import DataResourceDetail from '../component/dataResourcesFillInFormDetail.vue'
import DataElementDetail from '../component/dataElementFillInFormDetail.vue'
import InterfaceDetail from './interface/detail.vue'
import apiToken from '../../publicJs/apiToken.js'
import codeMap from '../publicJs/status.js'
export default {
  name: 'personRegisterManage',
  components: {
    commonTableComponent,
    leftNav,
    CompDetail,
    DataResourceDetail,
    DataElementDetail,
    InterfaceDetail,
    privibutton
  },
  data () {
    return {
      searchResultMsg: {data: '', interface: '', metadata: ''},
      APIclass: '',
      selectTag: '',
      dataTagData: [],
      dataStatus: null,
      status: {
        0: '未提交',
        1: '待审核',
        2: '已通过',
        3: '未通过'
      },
      uiData: {
        tabArr: [
          { name: '注册数据资源', active: true },
          { name: '注册接口', active: false },
          { name: '注册数据元', active: false }
        ],
        applyResourceBoxShow: false,
        currentTabName: '注册数据资源'
      },
      registerBoxData: {
        firstSelectData: '',
        secondSelectData: '',
        firstSelectValue: '',
        secondSelectValue: ''
      },
      dataData: {
        // 注册数据资源
        bodyData: {},
        headerData: [],
        checkData: [
          { name: '已通过', select: true, statu: 2 },
          { name: '待审核', select: true, statu: 1 },
          { name: '未通过', select: true, statu: 3 },
          { name: '未提交', select: true, statu: 0 },
          { name: '已过期', select: true, statu: 4 }
        ],
        tagsData: [],
        resourceType: 0,
        pageTotal: 0
      },
      portData: {
        // 注册接口
        bodyData: {},
        headerData: [],
        checkData: [
          { name: '已通过', select: true, statu: 2 },
          { name: '待审核', select: true, statu: 1 },
          { name: '未通过', select: true, statu: 3 },
          { name: '未提交', select: true, statu: 0 }
        ],
        tagsData: [],
        resourceType: 1,
        pageTotal: 0
      },
      dataElementData: {
        // 注册数据元DataElement
        bodyData: {},
        headerData: [],
        checkData: [
          { name: '已通过', select: true, statu: 2 },
          { name: '待审核', select: true, statu: 1 },
          { name: '未通过', select: true, statu: 3 },
          { name: '未提交', select: true, statu: 0 }
        ],
        tagsData: [],
        resourceType: 2,
        pageTotal: 0
      },
      hardwareData: {
        // 注册硬件资源
        bodyData: {},
        headerData: [],
        checkData: [
          { name: '已通过', select: true, statu: 2 },
          { name: '待审核', select: true, statu: 1 },
          { name: '未通过', select: true, statu: 3 },
          { name: '未提交', select: true, statu: 0 }
        ],
        tagsData: [],
        resourceType: 3,
        pageTotal: 0
      },
      networkData: {
        // 注册网络资源
        bodyData: {},
        headerData: [],
        checkData: [
          { name: '已通过', select: true, statu: 2 },
          { name: '待审核', select: true, statu: 1 },
          { name: '未通过', select: true, statu: 3 },
          { name: '未提交', select: true, statu: 0 }
        ],
        tagsData: [],
        resourceType: 4,
        pageTotal: 0
      },
      metadataActived: false,
      showEleDetail: false,
      showResDetail: false,
      showResId: '',
      showEleId: '',
      showEleName: '',
      showResName: '',
      showInterface: false,
      showInterfaceId: '',
      showInterfaceName: '',
      approvalStatusCode: ''
    }
  },
  created () {
    this.APIclass = this.$route.query.type
    this.createDataData() // 初始化数据
    this.createportData()
    this.createdataElementData()
    // this.createHardwareData();
    // this.createNetworkData();
    let index = this.$route.query.index
    if (index !== undefined || index !== 'undefined') {
      this.tabItemClickHandler(index)
    }
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
        if (k - 0 === status || k === status) {
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
    date (input) {
      var d = new Date(input)
      var year = d.getFullYear()
      var month = d.getMonth() + 1
      var day = d.getDate() < 10 ? '0' + d.getDate() : '' + d.getDate()
      var hour = d.getHours()
      var minutes = d.getMinutes()
      var seconds = d.getSeconds()
      return (
        year +
        '-' +
        month +
        '-' +
        day +
        ' ' +
        hour +
        ':' +
        minutes +
        ':' +
        seconds
      )
    },
    tabItemClickHandler (index) {
      var currentIndex
      for (var i = 0; i < this.uiData.tabArr.length; i++) {
        var obj = this.uiData.tabArr[i]
        if (obj.active == true) {
          currentIndex = i
          break
        }
      }
      if (currentIndex != index && index != undefined) {
        this.uiData.tabArr[index].active = true
        this.uiData.tabArr[currentIndex].active = false
        this.uiData.currentTabName = this.uiData.tabArr[index].name
      }
      if (index == 2) {
        this.metadataActived = true
      }
    },
    /* 注册数据资源 */
    createDataData () {
      var that = this
      that.dataData.headerData = [
        { name: '数据资源名称', textShow: true },
        {
          name: '资源标签',
          tagSelct: true,
          textShow: false,
          tagOpen: false,
          tagsData: []
        },
        { name: '审核时间', textShow: true },
        { name: '创建时间', timeSelect: true, textShow: false },
        { name: '数据元介绍', textShow: true },
        { name: '审核状态', textShow: true },
        { name: '操作', textShow: true }
      ]
    },
    /* 注册接口 */
    createportData () {
      var that = this
      that.portData.headerData = [
        { name: '接口名称', textShow: true },
        { name: '标签', textShow: true },
        { name: '接口介绍', textShow: true },
        { name: '审核状态', textShow: true },
        { name: '审核时间', textShow: true },
        { name: '创建时间', timeSelect: true, textShow: false },
        { name: '操作', textShow: true }
      ]
    },

    /* 注册数据元 */
    createdataElementData () {
      var that = this
      that.dataElementData.headerData = [
        { name: '数据元名称', textShow: true },
        { name: '数据元标识符', textShow: true },
        { name: '数据元内部标识符', textShow: true },
        { name: '数据元中文名称', textShow: true },
        { name: '审核状态', textShow: true },
        { name: '审核时间', textShow: true },
        { name: '创建时间', timeSelect: true, textShow: false },
        { name: '操作', textShow: true }
      ]
    },
    /* 注册硬件资源 */
    createHardwareData () {
      var that = this
      that.hardwareData.headerData = [
        { name: '所申请服务', textShow: true },
        {
          name: '服务标签',
          tagSelct: true,
          textShow: false,
          tagOpen: false,
          tagsData: []
        },
        { name: '需求类型', textShow: true },
        { name: '使用期限', textShow: true },
        { name: '审核状态', textShow: true },
        { name: '审核时间', timeSelect: true, textShow: false },
        { name: '操作', textShow: true }
      ]
    },
    /* 注册网络资源 */
    createNetworkData () {
      var that = this
      that.networkData.headerData = [
        { name: '所申请服务', textShow: true },
        {
          name: '服务标签',
          tagSelct: true,
          textShow: false,
          tagOpen: false,
          tagsData: []
        },
        { name: '需求类型', textShow: true },
        { name: '使用期限', textShow: true },
        { name: '审核状态', textShow: true },
        { name: '审核时间', timeSelect: true, textShow: false },
        { name: '操作', textShow: true }
      ]
    },
    registerClickHandler () {
      // 打开注册资源弹框
      let that = this
      this.uiData.applyResourceBoxShow = true
      ApiClient.get('rcapi/dataSource', {}, function (data) {
        that.registerBoxData.firstSelectData = data.results
      })
    },
    closeRegisterBoxHandler () {
      // 关闭注册资源弹框
      this.uiData.applyResourceBoxShow = false
    },
    applyBoxOkHandler () {
      // 申请资源弹框确定事件
      var that = this
      var firstVal = that.registerBoxData.firstSelectValue
      var secondValId = that.registerBoxData.secondSelectValue
      var secondValContainerId = ''
      var find = false
      if (firstVal == '' || secondValId == '') {
        TipBoxService.open('请选择所申请类型', 2)
      } else {
        let resource = that.registerBoxData.firstSelectValue
        let dbinfo = that.registerBoxData.secondSelectValue
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
        if (that.registerBoxData.firstSelectValue == '数据资源') {
          sessionStorage.removeItem('page1')
          sessionStorage.removeItem('page2')
          sessionStorage.removeItem('page3')
          this.$router.push({
            name: 'dataintroduced',
            query: { resource: resource, dbinfo: dbinfo, type: 'person' }
          })
        } else if (that.registerBoxData.firstSelectValue == '数据元') {
          // this.$router.push({path:'metadata/register/new'})
          this.$router.push({
            name: 'metadataRegister',
            params: { page: 'new', breadCrumbStr: '个人注册>注册数据元' }
          })
        } else {
          this.$router.push({ name: 'newServiceForPersonRegister',
            query: { resource: resource, dbinfo: dbinfo, type: 'APIjiekou' }
          })
        }
      }
    },
    applyFirstSelectHandler (data) {
      // 申请资源弹框第一个下拉框选择事件
      // console.info('选择的值是=', data)
      if (data == '数据资源') {
        data = '0'
      } else if (data == '接口') {
        data = '1'
      } else if (data == '数据元') {
        data = '2'
      }
      var that = this
      that.registerBoxData.secondSelectValue = ''
      ApiClient.get('rcapi/dataType', { resourceType: data }, function (datas) {
        that.registerBoxData.secondSelectData = datas.results
        //  console.log('第二个下拉列表=',that.registerBoxData.secondSelectData)
      })
    },
    tableGetDataHandler (val) {
      // 表单组件申请表数据
      var that = this
      var value = { pageNum: 1, pageSize: 10 }
      if (val.resourceType == 0) {
        // 注册数据资源
        ApiClient.get('rcapi/findResources', val).then(function (data) {
          // console.log('数据资源=', data)
          var total = data.total
          that.dataData.pageTotal = total
          // var newData = that.dataHandler(data)
          that.dataData.bodyData = data
          that.controlData(that.dataData.bodyData.data)
          that.dataData.bodyData.resourceType = 0
          // console.log(that.dataData.bodyData.tags)
        }, error => {
          LoadingBoxService.close()
          if (error.response && error.response.status === 404) {
            this.searchResultMsg.data = 'API不存在或无法访问'
          } else {
            this.searchResultMsg.data = '检索数据失败, 访问API服务异常'
          }
        })
      } else if (val.resourceType == 1) {
        // 注册接口
        var newObj = new Object()
        newObj.serviceType = '1' // 归属应用，默认远程服务-1
        newObj.pageConfType = '3' // 页面配置类型 纯数据请求
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
        if (val.sort == 1) {
          sort = 'asc'
        }
        newObj.sortType = sort
        ApiClient.post(
          'itsmApi/atomicService/selectServiceForResourceByStatus'
          ,
          { param: JSON.stringify(newObj) }).then(
          function (data) {
            console.log('接口', data)
            var total = data.total
            that.portData.pageTotal = total
            // that.portData.headerData[4].tagsData = data.tags
            that.portData.bodyData = data
            that.controlData(that.portData.bodyData.data, 'interface')
            that.portData.bodyData.resourceType = 1
          },
          error => {
            LoadingBoxService.close()
            if (error.response && error.response.status === 404) {
              this.searchResultMsg.interface = 'API不存在或无法访问'
            } else {
              this.searchResultMsg.interface = '检索数据失败, 访问API服务异常'
            }
          }
        )
      } else if (val.resourceType == 2) {
        // 注册数据元
        var newObj = {}
        newObj.keyword = val.searchParam
        newObj.pageNum = val.pageNum
        newObj.pageSize = val.pageSize
        newObj.approvalStatusList = val.status
        if (val.tag != null && val.tag != '') {
          var tag = JSON.parse(val.tag)
          newObj.labels = tag.tag
        }
        var sort = 'desc'
        if (val.sort == 1) {
          sort = 'asc'
        }
        newObj.sortType = sort
        ApiClient.get('rcapi/metadata/query', newObj).then(function (data) {
          // console.info("注册数据元=",data)
          if (data != 'error') {
            var total = data.totalNum
            that.dataElementData.pageTotal = total
            that.dataElementData.bodyData = data
            that.dataElementData.bodyData.resourceType = 2
            // console.log(data.results, 1111)
            that.controlElementData(that.dataElementData.bodyData.dataList)
            // console.log(that.dataElementData.bodyData, 2222)
          } else {
            that.serviceData.bodyData = data
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
    tableItemEditHandler (val) {
      // 表单组件点击编辑的事件

      if (this.uiData.currentTabName == '注册接口') {
        var that = this
        var type = val.tableItemChangeType
        // 启停
        if (type == 'switch') {
          if (val.service_status == '正常') {
            LoadingBoxService.open('正在关闭，请稍候...')
            var myData = {
              serviceId: val.id,
              appId: val.app_id,
              serviceStatus: '关闭'
            }
          } else if (val.service_status == '关闭') {
            LoadingBoxService.open('正在启动，请稍候...')
            var myData = {
              serviceId: val.id,
              appId: val.app_id,
              serviceStatus: '正常'
            }
          } else {
            LoadingBoxService.open('正在关闭，请稍候...')
            var myData = {
              serviceId: val.id,
              appId: val.app_id,
              serviceStatus: '关闭'
            }
          }
          ApiClient.post(
            'itsmApi/atomicService/startAndStop',
            myData,
            function (data) {
              if (data.status == '200') {
                LoadingBoxService.close()
                that.tableGetDataHandler(val.linkObj)
                TipBoxService.open('成功')
              } else {
                LoadingBoxService.close()
                TipBoxService.open('失败', 2)
              }
            }
          )
        } else if (type == 'revoke') {
          // 撤销
          NoticeBoxService.open('是否撤销当前审核，撤销后将不再审核', function (data) {
            NoticeBoxService.close()
            LoadingBoxService.open('撤销操作，请稍候...')
            ApiClient.post(
              'itsmApi/atomicService/revokeAudit',
              { serviceId: val.id },
              function (data) {
                // console.info('removeReturnData=',data);
                if (data.status == '200') {
                  LoadingBoxService.close()
                  TipBoxService.open('撤销成功')
                  that.tableGetDataHandler(val.linkObj)
                } else {
                  LoadingBoxService.close()
                  TipBoxService.open('撤销失败', 2)
                }
              }
            )
          })
        } else if (type == 'edit') {
          // 编辑
          this.$router.push({
            name: 'newServiceForPersonRegister',
            query: { atomicId: val.id, type: this.APIclass ? this.APIclass : 'APIjiekou'}
          })
        }
      } else {
        if (this.metadataActived) {
          // 进入数据元编辑页面
          // this.$router.push({path: '/rc/metadata/register/edit/' + val.id, params: {breadCrumbStr: '个人注册>注册数据元'}})
          this.$router.push({
            name: 'metadataRegister',
            params: { page: 'edit', id: val.id, breadCrumbStr: '个人注册>注册数据元' }
          })

          return
        }
        let that = this
        ApiClient.get('rcapi/findResourcesById', { resourceId: val.id }, function (
          data
        ) {
//            console.log("wo",data.results.resource.status);
          that.approvalStatusCode = data.results.resource.status
            // 覆盖page1       data.results.resource
          if (data.results.resource != '') {
            var page1 = {}
            page1.resourcetype = data.results.resource.resourcetype
            page1.datatype = data.results.resource.datatype // 数据类型
            page1.resourcename = data.results.resource.resourcename // 服务资源名称
            page1.resourcetag = data.results.resource.resourcetag // 标签
            page1.checkedLabels = data.results.resource.checkedLabels // 标签id
            page1.datasource = data.results.resource.datasource // 数据来源
            page1.begintime = data.results.resource.begintime // 开始时间
            page1.endtime = data.results.resource.endtime // 结束时间
            page1.datasourcedesc = data.results.resource.datasourcedesc // 数据源介绍
            page1.perioduse = data.results.resource.perioduse// 使用期限
            // page1.status = data.results.resource.status, // 0暂存1保存
            page1.status = 0
            page1.datapriv = data.results.resource.datapriv // 数据权限
            page1.id = data.results.resource.id
//            page1.approvalStatus = data.results.resource.status
            sessionStorage.page1 = JSON.stringify(page1)
//             console.log( sessionStorage.page1)
          }
          // 覆盖page2  data.results.dbinfo
          if (data.results.dbinfo != '') {
            let page2 = {};
            (page2.diresourcename = data.results.dbinfo.diresourcename), // 资源名称
              (page2.dburl = data.results.dbinfo.dburl), // 数据访问地址
              (page2.dbport = data.results.dbinfo.dbport), // 端口号
              (page2.dbname = data.results.dbinfo.dbname), // 库名
              (page2.username = data.results.dbinfo.username), // 用户名
              (page2.pwd = data.results.dbinfo.pwd), // 密码
              (page2.status = data.results.dbinfo.status), // 0暂存1保存
              (page2.dbtype = data.results.dbinfo.dbtype), // oracle
//              (page2.approvalStatus = data.results.resource.status),
            sessionStorage.page2 = JSON.stringify(page2)
//             console.log( sessionStorage.page2)
          }
          // 覆盖page3
          // data.results.table
          if (data.results.table != '') {
            let page3 = {}
            page3.tablename = data.results.table.tablename; // 表名
            (page3.status = data.results.table.status), // 暂存/保存
              (page3.dbfield = data.results.table.dbfield),
//                (page3.approvalStatus = data.results.resource.status),
            sessionStorage.page3 = JSON.stringify(page3)
//             console.log( sessionStorage.page3)
          }
          that.$router.push({
            name: 'dataintroduced',
            query: { resourceId: val.id, type: 'person', approvalStatusCode: that.approvalStatusCode}
          })
        })
        // sessionStorage.removeItem('page1')
        //  sessionStorage.removeItem('page2')
        //   sessionStorage.removeItem('page3')
      }
    },
    tableItemRemoveHandler (val) {
      // 表单组件点击删除的事件
      var that = this
      NoticeBoxService.open('是否删除当前注册数据项，删除后将无法撤回', function (data) {
        NoticeBoxService.close()
        LoadingBoxService.open('删除中，请稍候...')
        if (val.linkObj.resourceType === 1) {
          // 删除接口数据
          ApiClient.post(
            'itsmApi/atomicService/deleteAtomicInfo',
            { serviceId: val.id },
            function (data) {
              if (data.status == '200') {
                LoadingBoxService.close()
                TipBoxService.open('删除成功')
                that.tableGetDataHandler(val.linkObj)
              } else {
                LoadingBoxService.close()
                TipBoxService.open('删除失败', 2)
              }
            }
          )
        } else if (val.linkObj.resourceType === 2) {
          // 删除数据元草稿
          ApiClient.delete('/rcapi/metadata/delete/' + val.id).then(
            data => {
              LoadingBoxService.close()
              TipBoxService.open('删除成功')
              that.tableGetDataHandler(val.linkObj)
            },
            error => {
              LoadingBoxService.close()
              TipBoxService.open('删除失败')
            }
          )
        } else {
          ApiClient.get('rcapi/delResources', { resourceId: val.id }, function (
            data
          ) {
            if (data.status == 200) {
              LoadingBoxService.close()
              TipBoxService.open('删除成功')
              that.tableGetDataHandler(val.linkObj)
            } else {
              LoadingBoxService.close()
              TipBoxService.open('删除失败')
            }
          })
        }
      })
    },
    tableItemLookHandler (val) {
      // 表单组件点击查看按钮的事件
      if (val.tipText == '查看原因') {
        LoadingBoxService.open('数据加载中...')
        var detailUrl = ''
        if (this.uiData.currentTabName == '注册接口') {
          detailUrl = 'itsmApi/atomicService/viewReason'
          ApiClient.post(detailUrl, { id: val.id, resourceType: val.resourcetype }, function (data) {
          // console.info('弹框数据=',data);
            var msg = data.results.auditinfo
            if (msg == '' || msg == undefined) {
              msg = '无未通过原因'
            }
            LoadingBoxService.close()
            AlertBoxService.open(msg, '未通过原因')
          })
        } else {
          detailUrl = 'rcapi/viewRegistReason'
          ApiClient.get(detailUrl, { id: val.id, resourceType: val.resourcetype }, function (data) {
          // console.info('弹框数据=',data);
            var msg = data.results.auditinfo
            if (msg == '' || msg == undefined) {
              msg = '无未通过原因'
            }
            LoadingBoxService.close()
            AlertBoxService.open(msg, '未通过原因')
          })
        }
      } else if (val.tipText == '查看申请') {
        var url = ''
        if (this.uiData.currentTabName == '注册数据资源') {
          this.showResDetail = true
          this.showResName = val.resourcename
          this.showResId = val.id
        } else if (this.uiData.currentTabName == '注册接口') {
          // window.open('InterfaceDetail?id=' + val.id, '_blank');
          this.showInterface = true
          this.showInterfaceId = val.id
          this.showInterfaceName = val.name
        } else if (this.uiData.currentTabName == '注册数据元') {
          this.showEleDetail = true
          this.showEleName = val.name
          this.showEleId = val.id
        }
      }
    },
    dataHandler (data, type) {
      let arr = []
      let that = this
      data.data.forEach(function (v, i) {
        let obj = {}
        obj = v
        let str = v.resourcetag
        if (str != undefined) {
          str = str.toString()
        }

        if (type == 'service') {
          // 将js数组转成逗号分隔的字符串用于显示
          obj.service_tag = obj.service_tag.join(',')
          obj.lineData = [
            { name: obj.name },
            { name: obj.service_tag },
            { name: obj.service_remark },
            { name: obj.audit_status, stateText: true },
            { name: obj.audittime },
            { name: obj.apply_time },
            { name: '', control: true }
          ]
          if (obj.audit_status == undefined || obj.audit_status == 0) {
            obj.lineData[3].name = '未提交'
            obj.class = 'notSubmit'
            obj.tipText = ''
            obj.editShow = true
            obj.removeShow = true
            obj.lookApprovalShow = false
          } else if (obj.audit_status == '待审核') {
            obj.lineData[3].name = '待审核'
            obj.class = 'wait'
            //            obj.revokeShow=true;   //撤销功能暂停
            obj.tipText = '查看审批流程'
            obj.lookProcessShow = true
            obj.lookApprovalShow = true
          } else if (obj.audit_status == '已通过') {
            obj.lineData[3].name = '已通过'
            obj.class = 'pass'
            obj.switchShow = true
            obj.lookApprovalShow = true
            if (obj.service_status == '正常') {
              obj.switchData = false
            } else if (obj.service_status == '关闭') {
              obj.switchData = true
            }
          } else if (obj.audit_status == '未通过') {
            obj.lineData[3].name = '未通过'
            obj.class = 'notPass'
            obj.tipText = '查看原因'
            // obj.editShow = true;
            obj.lookReasonShow = true
            obj.lookApprovalShow = true
          }
        } else {
          obj.lineData = [
            { name: obj.resourcename },
            { name: str },
            { name: obj.datasourcedesc },
            { name: '', stateText: true },
            { name: obj.audittime },
            { name: obj.registtime },
            { name: '', control: true }
          ]

          if (v.status == 0) {
            // obj.lineData[3].name = '未提交'
            obj.class = 'notSubmit'
            obj.tipText = ''
            obj.editShow = true
            obj.removeShow = true
          } else if (v.status == '待审核') {
            // obj.lineData[3].name = '待审核'
            obj.class = 'wait'
            obj.tipText = '查看审批流程'
            obj.lookApprovalShow = true
            /* obj.lookProcessShow=true; */
          } else if (v.status == '已通过') {
            // obj.lineData[3].name = '已通过'
            obj.class = 'pass'
            obj.tipText = ''
            obj.lookApprovalShow = true
          } else if (v.status == '未通过') {
            // obj.lineData[3].name = '未通过'
            obj.class = 'notPass'
            obj.tipText = '查看原因'
            obj.lookReasonShow = true
            obj.lookApprovalShow = true
          }
        }
        arr.push(obj)
      })
      return arr
    },
    controlData (data, type) {
      data.forEach(function (obj, i) {
        // 注册接口功能
        if (type == 'interface') {
          obj.resourcetype = 1
          obj.open_time = UtilService.formatDuring(
          obj.open_time,
          'yyyy-MM-dd HH:mm:ss'
        )
          // 将js数组转成逗号分隔的字符串用于显示
          obj.service_tag = obj.service_tag.join(',')
          obj.resourcetype = 1
          // obj.status = obj.audit_status - 0
          if (obj.audit_status == undefined || obj.audit_status == 0) {
            obj.editShow = true
            obj.removeShow = true
            // obj.lookApprovalShow = false
          } else if (obj.audit_status == 1) {
            obj.lookProcessShow = true
            obj.lookApprovalShow = true
          } else if (obj.audit_status == 2) {
            obj.switchShow = true
            obj.lookApprovalShow = true
            if (obj.service_status == '正常') {
              obj.switchData = false
            } else if (obj.service_status == '关闭') {
              obj.switchData = true
            }
          } else if (obj.audit_status == 3) {
            obj.editShow = true
            obj.lookReasonShow = true
            obj.lookApprovalShow = true
          }
        } else { // 注册数据功能
          obj.resourcetype = 0
          if (obj.perioduse === 0) {
            obj.time = obj.begintime.substr(0, 10) + ' - ' + obj.endtime.substr(0, 10)
          } else if (obj.perioduse === 1) {
            obj.time = '长期使用'
          }
          if (obj.status == 'NO_SUBMIT') {
            obj.tipText = ''
            obj.editShow = true
            obj.removeShow = true
          } else if (obj.status == 'WAITING') {
            obj.tipText = '查看审批流程'
            obj.lookApprovalShow = true
            /* obj.lookProcessShow=true; */
          } else if (obj.status == 'PASS') {
            obj.tipText = ''
            obj.lookApprovalShow = true
          } else if (obj.status == 'NO_PASS') {
            obj.tipText = '查看原因'
            obj.editShow = true
            obj.lookReasonShow = true
            obj.lookApprovalShow = true
          } else if (obj.status == 'EXPIRED') {
            obj.lookApprovalShow = true
          }
        }
      })
    },
    controlElementData (data) {
      data.forEach(function (obj, i) {
        obj.createdTime = UtilService.formatDuring(
          obj.createdTime,
          'yyyy-MM-dd HH:mm:ss'
        )
        obj.resourcetype = 2
        obj.status = obj.approvalStatus
        if (obj.approvalStatus === 0) {
          obj.tipText = ''
          obj.editShow = true
          obj.removeShow = true
        } else if (obj.approvalStatus === 1) {
          obj.tipText = '查看审批流程'
          obj.lookApprovalShow = true
          /* obj.lookProcessShow=true; */
        } else if (obj.approvalStatus === 2) {
          obj.tipText = ''
          obj.lookApprovalShow = true
        } else if (obj.approvalStatus === 3) {
          obj.tipText = '查看原因'
          obj.editShow = true
          obj.lookReasonShow = true
          obj.lookApprovalShow = true
        }
      })
    },
    elementDataHandler (data) {
      // 处理武汉数据元的数据
      var newArr = new Array()
      var dataArr = data.dataList
      var that = this
      for (var i = 0; i < dataArr.length; i++) {
        var obj = dataArr[i]
        var newObj = obj
        // var time=new Date(parseInt(newObj.createdTime) * 1000).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");
        var time = UtilService.formatDuring(
          newObj.createdTime,
          'yyyy-MM-dd HH:mm:ss'
        )
        // var time2=UtilService.formatDuring(newObj.approveDate,'yyyy-MM-dd HH:mm:ss');
        newObj.lineData = [
          { name: newObj.name },
          { name: newObj.tag },
          { name: newObj.internalTag },
          { name: newObj.cnName },
          { naem: '', stateText: true },
          { name: newObj.approveDate },
          { name: time },
          { name: '', control: true }
        ]
        if (newObj.approvalStatus == 1) {
          newObj.lineData[4].name = '待审批'
          newObj.class = 'wait'
          // newObj.lookProcessShow=true;
          newObj.lookApprovalShow = true
        } else if (newObj.approvalStatus == 0) {
          newObj.lineData[4].name = '未提交'
          newObj.class = 'notSubmit'
          obj.editShow = true
          obj.removeShow = true
        } else if (newObj.approvalStatus == 2) {
          newObj.lineData[4].name = '已通过'
          newObj.class = 'pass'
          newObj.lookApprovalShow = true
        } else if (newObj.approvalStatus == 3) {
          newObj.lineData[4].name = '未通过'
          newObj.class = 'notPass'
          newObj.lookReasonShow = true
          newObj.lookApprovalShow = true
        }
        newArr.push(newObj)
      }
      return newArr
    },
    goHome () {
      this.$router.push({ name: 'RcIndex' })
    }
  }
}
</script>
  <!-- Add "scoped" attribute to limit CSS to this component only -->
  <style src="" scoped></style>
<style scoped>
.registerbtn {
  height: 24px;
  line-height: 22px;
  padding: 0 8px;
  border: 1px solid #56a8fe;
  color: #56a8fe;
  border-radius: 10px;
  background: #fff;
  float: right;
  margin-top: 10px;
  margin-right: 15px;
  outline: none;
}

.slotbox {
  float: left;
}
.overlay.high-index {
  z-index: 2000;
}
</style>

