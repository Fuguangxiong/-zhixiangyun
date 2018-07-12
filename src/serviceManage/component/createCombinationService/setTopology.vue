<template>
	<!-- 主题内容菜单 -->
  <div class="flow-chart">
    <!-- start: 内容 -->
    <div class="flow-chart-con">
      <!-- start: 左侧服务搜索及列表 -->
      <div class="flow-chart-left">
        <!-- tab和搜索 -->
        <div class="flow-chart-left-action">
          <span :class="{active:serverListType=='belong_type'}" @click='onSetServerListType("belong_type")'>按归属类型</span>
          <span :class="{active:serverListType=='tag'}" @click='onSetServerListType("tag")'>按标签类型</span>
          <div class="flow-chart-left-search">
            <input type="text" placeholder="请输入关键字" v-model="searchKey" @keyup.enter="getServerList" />
            <i class="icon iconfont icon-sousuo11" @click="getServerList"></i>
          </div>
        </div>
        <!-- 服务列表 -->
        <div class="flow-chart-left-list">
          <div id="flowChartServiceList" class='in'>
            <el-collapse v-model="activeName">
              <el-collapse-item v-for="(item, index) in serverList"
                                :key='index' 
                                :title="item.label" 
                                :name='index'>
                <el-popover placement="right" trigger="hover" width='300'
                            class="draggable" 
                            popper-class='draggable-service-tip'
                            v-for="(service,childIndex) in item.result" 
                            :id="service.id" 
                            :key='childIndex' 
                            :serviceTag="service.service_tag" 
                            :serviceDetail="JSON.stringify(service.service_detail)" 
                            :serviceType='JSON.stringify(service.service_type)'
                            :img="service.img">
                  <ul class='draggable-service-tip-ul'>
                    <li><b>服务名称：</b>{{service.name}}</li>
                    <li><b>服务归属：</b>{{getBelonging(service)}}</li>
                    <li><b>服务简介：</b><span>{{service.service_brief}}</span></li>
                    <li><b>服务期限：</b>{{formateTime(service.service_start_time)}} 至 {{formateTime(service.service_end_time)}}</li>
                  </ul>
                  <div class="draggable-div" slot="reference">
                    <img v-if='service.img=="logo-sm-default.jpg"' src="../../images/logo-sm-default.jpg" />                    
                    <img v-if='service.img!="logo-sm-default.jpg"' :src="apiBaseUrl +'/itsmApi/attachment/show?imgPath='+service.img" />                    
                    <span>{{service.name}}</span>
                  </div>
                </el-popover>                    
              </el-collapse-item>
            </el-collapse>           
          </div>
        </div>
      </div>
      <!-- end: 左侧服务搜索及列表 -->

      <!-- start: 右侧 -->
      <div class="flow-chart-right">
        <div class="flow-chart-right-title">拓扑搭建</div>
        <!-- start: 画图区域 -->
        <div class="flow-chart-right-con">
          <div class="infobox droppable" id="editContainer" :num="nodeLength" v-bind:class="nodeLength > 0 ? '' : 'showBg'">
            <!-- start: 智能推荐 -->
            <div class="flow-chart-right-list">
              <div @click="isShowRecommend = !isShowRecommend" class="tuijian">智能推荐</div>
              <div>
                <el-collapse-transition>
                  <div id='recommendTree' v-show="isShowRecommend" class="serverListDiv">
                    <div class="transition-box tjserver draggable" 
                        v-for="tj in tjserver" 
                        :id="tj.id" 
                        :serviceTag="tj.service_tag" 
                        :serviceDetail="JSON.stringify(tj.service_detail)"
                        :serviceType="tj.service_type" 
                        :title="tj.name" 
                        :img="tj.img">
                        <img v-if='tj.img=="logo-sm-default.jpg"' src="../../images/logo-sm-default.jpg" />                    
                        <img v-if='tj.img!="logo-sm-default.jpg"' :src="apiBaseUrl +'/itsmApi/attachment/show?imgPath='+tj.img" />                    
                        <!-- <img :src="apiBaseUrl+'itsmApi/attachment/show?imgPath='+tj.img" /> -->
                        {{tj.name }}
                    </div>
                  </div>
                </el-collapse-transition>
              </div>
            </div>
            <!-- end: 智能推荐 -->
          </div>
        </div>
        <!-- end: 画图区域 -->

        <!-- start: 步骤按钮 -->
        <div class="buttons">
          <h5>拓扑搭建：</h5>
          <p>即服务拓扑搭建，是根据具体业务的需要，对已有的原子服务进行拼接，打通服务之间的数据与调用顺序，实现对原子服务的接口、参数进行关联。</p>
          <span class="back" @click="back">返回</span>
          <span class="save" @click="save">保存</span>
        </div>
        <!-- end: 步骤按钮 -->
      </div>
      <!-- end: 右侧 -->
    </div>
    <!-- end: 内容 -->

    <!-- start: 条件关联 -->
    <el-dialog title="条件关联" @close='abolish' :visible.sync="isShowDialog" class='' :modal-append-to-body='false'>
      <!-- 服务类型 -->
      <div id="select_config" class="config">
        <div class="typeInput">类别：
          <el-select v-model="editConnection.serverType" @change='selectServerType()' placeholder="请选择">
            <el-option v-for="(item,index) in serverTypeList" 
                      :key="index" 
                      :label="item=='2'?'页面':'数据'" 
                      :value="item"
                      :disabled='!isSelectServerTypeOn'>
            </el-option>
          </el-select>
        </div>
      </div>
      <!-- 关联组合 -->
      <div id="select_sourceList" class="combination">
        <span class='configSpan' 
              v-for='(item,index) in parameterMap'
              :importIndex='item.importIndex'>
              {{item.importParame+'-->'+item.exportParame}}
            <i class='icon iconfont icon-delete-black' @click='deleteCombination(index,item.importIndex)'></i>
        </span>
      </div>
      <!-- 参数 -->
      <div id="select_targetList" class="listStyle listStyleRight">
        <!-- 入参 -->
        <div class="leftMenu">
          <p>输入参数<span>(<b>*</b>为必关联项)</span></p>
          <ul class="leftMenuList">
            <li class="leftMenuListItem" 
                v-for='(item,index) in importParameter' 
                @click='importSelect(index)' 
                :class='{active:item.state}' 
                :title='item.tag'
                v-show='!item.isBindTemp'>
                <span v-show='item.isRequired' style='color:#c64d4d;'>*</span>
                {{item.name}} ({{item.describe}})
            </li>
          </ul>
          <!-- <div class="describe">
            <p><span>{{importDescribeTitle + ':'}}</span> {{importDescribeContent}}</p>
          </div> -->
        </div>
        <!-- 出参 -->              
        <div class="rightMenu">
          <p>输出参数</p>
          <ul class="rightMenuList">
            <li v-for='(item,index) in exportParameter' @click='createParameterMap(item,index)'>
              <span class="componentSelectBtn" :class='{select:item.state}'></span>
              <span :title='item.tag'>{{item.name}} ({{item.describe}})</span>
            </li>
          </ul>
          <!-- <div class="describe">
            <p><span>{{exportDescribeTitle + ':'}}</span> {{exportDescribeContent}}</p>
          </div> -->
        </div>
      </div>
      <div class="clearBoth"></div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="createConnects">确 认</el-button>
        <el-button @click="abolish">取 消</el-button>
      </div>
    </el-dialog>
    <!-- end: 条件关联 -->
  </div>
</template>
<script type="text/javascript" src="../../lib/jsPlumb-2.2.8.js" ></script>
<script>
import $ from 'jquery'
import jsPlumb from '../../lib/jsPlumb-2.2.8.js'
import Demo from '../../lib/demo.js'
import apiClient from '../../../publicJs/ApiClient.js'
import TipBoxService from '../common/TipBoxService.js'
import LoadingBoxService from '../../../publicJs/LoadingBoxService.js'
import commonFunc from '../common/commonFunc.js'
export default {
  props: {
    serviceId: {},
    isShow: false,
    isPageOver: false
  },
  data () {
    return {
      apiBaseUrl: apiClient.apiBaseUrl,
      serverListType: 'belong_type',
      instance: {},
      paintStyle: {
        strokeWidth: 2,
        stroke: '#5da7ee',
        strokeStyle: '#5da7ee',
        fillStyle: '#5da7ee',
        opacity: 0.5,
        radius: 3,
        lineWidth: 3,
        outlineWidth: 3
      },
      isShowRecommend: false, // 是否显示推荐服务列表
      compositeServiceWords: {
        id: '', // 组合服务id
        combination_data_config: {
          connects: [], // 组合服务保存格式 -- connects 字段
          start: {},
          end: [],
          block: []
        }
      },
      nodeLength: 0, // 节点个数
      noneList: [], // 没有连线孤立的节点
      activeName: '1', // 左侧服务列表开合绑定值，'1'为打开，其他值关
      nodeSortFlag: 0, // 所有节点的id最后一位排序数字最大值，用于再新建节点时，保证新节点id不会与之前重复
      serverList: [], // 系统服务列表
      tjserver: [], // 推荐服务列表
      conn: '', // 点和线的关系
      abolishObj: {}, // 取消时暂时储存
      searchKey: '', // 搜索关键字
      linkList: [], // 用于出度入度
      editConnection: {
        // ConnectionId:'',
        // PageSourceId:'',
        // PageTargetId:'',
        serverType: ''
      },
      editLine: {}, // 保存当前连接线信息
      isShowDialog: false,
      isSelectServerTypeOn: true, // 关联窗口是否允许选择服务类型
      serverTypeList: '', // 服务下拉列表
      importParameter: [], // 入参
      exportParameter: [], // 出参
      importDescribeIndex: '', // 选中的入参信息
      importDescribeTitle: '',
      importDescribeContent: '',
      exportDescribeTitle: '', // 选中的出参信息
      exportDescribeContent: '',
      parameterMap: [], // 参数关联组合
      approval_workflow: 0, // 流程审批：
      approval_batchNo: 0, // 批次号
      isLoopFlag: false // 是否闭环标识
    }
  },
  watch: {
    isShow: function (nv, ov) {
      let vm = this
      if (nv) {
        vm.init()
      }
    }
  },
  updated () {
    this.leftMenuDrag()
  },
  methods: {
    // 初始化
    init () {
      let that = this
      that.initInstance() // 初始化画图区域设置
      that.getServerList() // 获取左侧服务列表
      that.bindDomEvent() // 绑定监听和Dom事件
      that.getRecoveryData() // 回显
    },
    initParams () {
      let that = this
      that.compositeServiceWords = {
        id: '', // 组合服务id
        combination_data_config: {
          connects: [], // 组合服务保存格式 -- connects 字段
          start: {},
          end: [],
          block: []
        }
      }
      $('#editContainer .nodeDiv .icon').each(function () {
        let node = $(this).parent()
        let nodeId = node.attr('id')
        that.instance.removeAllEndpoints(nodeId) // 删除节点的所有连接线
        node.remove() // 删除节点DOM
        that.deleteConnectsByNodeId(nodeId) // 删除相关连线数据
        that.nodeLength--
      })
      this.instance = {}
    },
    // 画图区域设置初始化
    initInstance () {
      let that = this
      this.instance = jsPlumb.getInstance({
        DragOptions: { cursor: 'pointer', zIndex: 2000 },
        PaintStyle: that.paintStyle,
        ConnectionOverlays: [
          [
            'Arrow',
            {
              location: 1,
              visible: true,
              width: 12,
              length: 14,
              direction: 1,
              id: 'arrow_forwards'
            }
          ],
          [
            'Label',
            {
              location: 0.5,
              id: 'label',
              cssClass: 'aLabel'
            }
          ]
        ],
        Container: 'editContainer'
      })
      this.instance.importDefaults({
        ConnectionsDetachable: true,
        ReattachConnections: true
      })
    },
    // 绑定监听和Dom事件
    bindDomEvent () {
      let that = this

      // 监听新的连接
      that.instance.bind('connection', function (connInfo, originalEvent) {
        // 画连接线校验
        let isChecked = that.checkDrawLine(connInfo)

        // 未通过校验，删除连接线。
        if (isChecked === 'error') {
          jsPlumb.detach(connInfo)
        } else if (isChecked === 'recovery') {
          // 回显
          that.setlabel(connInfo.connection) // 添加连接线上的修改、删除图标
        } else if (isChecked === 'new') {
          // 新建连接线
          that.setlabel(connInfo.connection) // 添加连接线上的修改、删除图标
          that.editConnection = {
            ConnectionId: connInfo.connection.id,
            PageSourceId: connInfo.sourceId,
            PageTargetId: connInfo.targetId,
            serverType: ''
          }
          that.compositeServiceWords.combination_data_config.connects.push(
            that.editConnection
          )
          that.editLine = connInfo.connection // 保存当前连接线信息
          that.openModal() // 打开条件关联窗口
        }
      })

      // 监听连接上的按钮点击事件
      that.instance.bind('click', function (conn, originalEvent) {
        let target = $(originalEvent.target)
        that.editLine = conn // 保存当前连接线信息
        // 编辑关联参数
        if (target.hasClass('glyphicon-pencil')) {
          that.openModal() // 打开条件关联窗口
        } else if (target.hasClass('glyphicon-remove')) {
          // 删除
          that
            .$confirm('此操作将删除该连线, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            })
            .then(() => {
              that.instance.detach(conn)
              that.deleteConnectsOnLine()
            })
        }
      })

      // 删除节点
      $('#editContainer').delegate('.nodeDiv .icon', 'click', function () {
        // 要先保存父元素的DOM,因为出现确认对话框之后(this)会消失
        let node = $(this).parent()
        let nodeId = node.attr('id')
        that
          .$confirm('此操作将删除该节点及其相关所有连线, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
          .then(() => {
            that.instance.removeAllEndpoints(nodeId) // 删除节点的所有连接线
            node.remove() // 删除节点DOM
            that.deleteConnectsByNodeId(nodeId) // 删除相关连线数据
            that.nodeLength--
          })
      })

      // 关闭模态框的回调
      $('#myModal').on('hidden.bs.modal', function (e) {
        that.importDescribeTitle = ''
        that.importDescribeContent = ''
        that.exportDescribeTitle = ''
        that.exportDescribeContent = ''
      })
    },
    // 选择服务列表归类方式
    onSetServerListType (str) {
      this.serverListType = str
      this.getServerList()
    },
    // 获取左侧服务列表
    getServerList () {
      let that = this
      let param = { query_type: that.serverListType, fuzzy_info: that.searchKey }
      console.log('param', param)
      LoadingBoxService.open('加载数据，请稍候......')
      apiClient.post(
        'itsmApi/combination/queryTopologicalServiceTree',
        param,
        function (data) {
          LoadingBoxService.close()
          if (data.status === 200) {
            let dataList = [...data.results]
            console.log('ServerList', dataList)
            if (that.serverListType === 'belong_type') {
              dataList.forEach(function (v, i) {
                v.label = that.getSourceType(v.label)
              })
            }
            that.serverList = dataList
          } else {
            console.log('no ServerList')
            TipBoxService.open('未查询到服务', 2)
          }
        }
      )
    },
    // 拖拽（左侧服务列表和智能推荐服务列表）
    leftMenuDrag () {
      let that = this
      let draggableType = true // 拖拽后是否刷新右侧推荐服务列表
      // 拖拽设置，左侧
      $('#flowChartServiceList .draggable').draggable({
        containment: '.flow-chart-con',
        helper: 'clone',
        scope: 'plant',
        stop: function () {
          draggableType = true
        }
      })
      // 拖拽设置，推荐
      // $("#recommendTree .draggable").draggable({
      //   containment: ".flow-chart-con",
      //   helper: "clone",
      //   scope: "plant",
      //   stop: function() {
      //     draggableType = false;
      //   }
      // });
      $('#editContainer').droppable({
        scope: 'plant',
        drop: function (event, ui) {
          /* 防止拖拽的服务压住边框线 */
          let state1 = ui.offset.left >= $('#editContainer').offset().left // left
          let state2 = ui.offset.top >= $('#editContainer').offset().top // top
          let state3 = ui.offset.top + 100 <= $('#editContainer').offset().top + $('#editContainer').height() // bottom
          let state4 = ui.offset.left + 100 <= $('#editContainer').offset().left + $('#editContainer').width() // right

          if (state1 && state2 && state3 && state4) {
            if (draggableType) {
              that.createNode(ui, $(this), true)
            } else {
              that.createNode(ui, $(this))
            }
          }
        }
      })
    },
    /**
     * 创建节点
     * @param ui
     * @param selector
     * @param refresh 是否刷新右侧推荐服务列表
    **/
    createNode (ui, selector, refresh) {
      let that = this
      let blockId = $(ui.draggable).attr('id')
      let serviceTag = $(ui.draggable).attr('servicetag')

      // 整理参数数组，给参数添加是否绑定的属性
      let paramsJson = JSON.parse($(ui.draggable).attr('servicedetail'))
      paramsJson.splice(0, 1)
      paramsJson.forEach(function (v, i) {
        v.params.forEach(function (o, j) {
          o.isBind = false
        })
      })

      let node = {}
      node.BlockId = blockId + '_model_' + that.nodeSortFlag++
      node.BlockImg = $(ui.draggable).attr('img')
      node.BlockParams = JSON.stringify(paramsJson)
      node.BlockServiceType = $(ui.draggable).attr('servicetype')
      node.BlockServiceTypeSelected = ''
      node.BlockContent = $(ui.draggable).text()
      node.BlockX = parseInt(ui.offset.left - $(selector).offset().left)
      node.BlockY = parseInt(ui.offset.top - $(selector).offset().top)

      that.creatNodeDom(node)
      that.nodeLength++

      if (refresh) {
        this.getRecommendServerList(blockId, serviceTag)
      }
    },
    // 获取智能推荐服务列表
    getRecommendServerList (blockId, serviceTag) {
      LoadingBoxService.open('加载数据，请稍候......')
      let that = this
      let paramStr = { service_tag: serviceTag, block_id: blockId }
      apiClient.post(
        'itsmApi/combination/findRecommendAtomicList',
        paramStr,
        function (data) {
          that.tjserver = data.results.data
          LoadingBoxService.close()
          that.isShowRecommend = true
        }
      )
    },
    /** ************************ 回显 ************************* **/
    // 获取回显数据
    getRecoveryData () {
      let that = this
      let serverId = that.$route.query.id
      if (serverId && serverId.length) {
        apiClient.post('itsmApi/combination/findCombinationService', { id: serverId }, function (data) {
          that.approval_workflow = data.results.data.approval_workflow
          that.approval_batchNo = data.results.data.approval_batchNo
          let config = data.results.data.combination_data_config
          console.log('回显的数据0', config)
          if (that.checkNull(config)) {
            config.block = JSON.parse(config.block)
            config.connects = JSON.parse(config.connects)

            that.compositeServiceWords.combination_data_config.connects =
                config.connects
            that.recoveryInit(config)
          }
        }
        )
      }
    },
    // 回显
    recoveryInit (config) {
      let that = this
      if (!config) {
        return false
      }
      if (config.block.length > 0) {
        that.nodeLength = config.block.length
      }
      console.log('config', config)
      // 回显节点
      let idIndex = []
      for (let i = 0; i < config.block.length; i++) {
        let node = config.block[i]
        let blockId = node.BlockId
        idIndex.push(parseInt(blockId.substr(39))) // 取节点ID最后一位的序号保存
        that.creatNodeDom(node)
      }
      // 保证再新建节点时，ID最后一位的序号比当前序号中的最大值大1
      if (idIndex.length > 0) {
        this.nodeSortFlag = idIndex.sort(sortNumber)[idIndex.length - 1]
        this.nodeSortFlag++
      }
      function sortNumber (a, b) {
        return a - b
      }

      // 回显连接
      for (let i = 0; i < config.connects.length; i++) {
        this.instance.connect(
          {
            id: config.connects[i].ConnectionId,
            source: config.connects[i].PageSourceId,
            target: config.connects[i].PageTargetId,
            anchors: ['Right', 'Left'],
            endpoint: [
              'Dot',
              {
                radius: 2
              }
            ],
            paintStyle: that.paintStyle,
            connector: [
              'Flowchart',
              {
                stub: 30,
                gap: 0,
                coenerRadius: 0,
                alwaysRespectStubs: true,
                midpoint: 0.5
              }
            ],
            overlays: [
              [
                'Arrow',
                {
                  location: 1,
                  visible: true,
                  width: 11,
                  length: 11,
                  direction: 1
                }
              ]
            ]
          },
          { test: 123 }
        )
      }
    },
    /** *********************** 条件关联 myModal ****************************/
    // 打开条件关联窗口
    openModal () {
      let that = this

      // 内容初始化
      that.isSelectServerTypeOn = true
      that.editConnection.serverType = ''
      that.parameterMap = []
      that.importParameter = []
      that.exportParameter = []
      that.importDescribeIndex = ''
      that.importDescribeTitle = ''
      that.importDescribeContent = ''
      that.exportDescribeTitle = ''
      that.exportDescribeContent = ''

      that.serverTypeList = that.getServerTypeByID(that.editLine.targetId)
      that.recoveryModal()
      that.isShowDialog = true // 打开条件关联窗口
    },
    // 回显关联
    recoveryModal () {
      let that = this
      that.compositeServiceWords.combination_data_config.connects.forEach(
        function (v, i) {
          if (that.editLine.id === v.ConnectionId) {
            that.editConnection = Object.assign({}, v) // 克隆对象而不是复制指针
          }
        }
      )

      if (that.getServerTypeSelectedByID(that.editLine.targetId) !== '') {
        that.editConnection.serverType = that.getServerTypeSelectedByID(
          that.editLine.targetId
        )
        that.isSelectServerTypeOn = false
        that.selectServerType()

        // 如果已关联过，回显关联组合
        if (that.checkNull(that.editConnection.param)) {
          for (let i = 0; i < that.editConnection.param.src.length; i++) {
            let params = that.editConnection.param
            that.parameterMap.push({
              importTag: params.target[i].param_tag,
              exportTag: params.src[i].param_tag,
              importParame: params.target[i].param_name,
              exportParame: params.src[i].param_name,
              importDescribe: params.target[i].param_describe,
              exportDescribe: params.src[i].param_describe,
              importKey: params.target[i].key,
              exportKey: params.src[i].key,
              importIndex: params.target[i].index
            })
          }
        }
      }
    },
    // 选择服务类型，生成入参出参
    selectServerType () {
      let that = this

      // 生成输出参数
      let param = {
        outputBlockId: that.editLine.sourceId,
        inputBlockId: that.editLine.targetId,
        inputServiceType: that.editConnection.serverType
      }
      apiClient.post('itsmApi/combination/findAtomicParam', param, function (
        data
      ) {
        that.exportParameter = []
        if (data.results.data[that.editLine.sourceId].length) {
          data.results.data[that.editLine.sourceId].forEach(function (v, i) {
            that.exportParameter.push({
              tag: v.tag,
              name: v.name,
              key: v.key,
              describe: v.describe,
              state: false
            })
          })
        }
      })

      // 生成输入参数
      let paramsList = that.getParamListByID(that.editLine.targetId)
      that.importParameter = []
      if (paramsList.length) {
        paramsList.forEach(function (v, i) {
          if (v.service_type.toString() === that.editConnection.serverType) {
            v.params.forEach(function (o, j) {
              that.importParameter.push({
                tag: o.tag,
                name: o.name,
                key: o.key,
                describe: o.describe,
                state: false, // 控制选中样式
                isRequired: o.isRequired,
                isBindTemp: o.isBind // 临时关联状态
              })
            })
          }
        })
      }
    },
    // 选择输入参数
    importSelect (index) {
      let that = this
      that.importDescribeIndex = index
      that.importDescribeTitle = that.importParameter[index].name
      that.importDescribeContent = that.importParameter[index].describe
      that.importParameter.forEach(function (val, index) {
        val.state = false
      })
      that.importParameter[index].state = true

      that.exportParameter.forEach(function (v, i) {
        that.exportParameter[i].state = false
      })
      that.exportDescribeTitle = ''
      that.exportDescribeContent = ''
    },
    // 选择出参，生成参数关联组合
    createParameterMap (v, i) {
      let that = this
      that.exportDescribeTitle = v.name
      that.exportDescribeContent = v.describe
      that.importParameter.forEach(function (val, index) {
        if (val.state) {
          // 单选按钮的切换
          that.exportParameter.forEach(function (v, j) {
            v.state = false
          })
          that.exportParameter[i].state = true
          // 生成绑定标签
          that.parameterMap.push({
            importParame: val.name,
            exportParame: v.name,
            importDescribe: val.describe,
            exportDescribe: v.describe,
            importTag: val.tag,
            importKey: val.key,
            exportTag: v.tag,
            exportKey: v.key,
            importIndex: that.importDescribeIndex
          })
          that.importParameter[that.importDescribeIndex].isBindTemp = true

          // 清除入参的选中状态
          that.importParameter[that.importDescribeIndex].state = false
          that.importDescribeIndex = ''
        }
      })
    },
    // 删除参数关联组合
    deleteCombination (index, importIndex) {
      this.parameterMap.splice(index, 1)
      this.importParameter[importIndex].isBindTemp = false
    },
    // 确定
    createConnects () {
      let that = this
      let targetNodeName = that.getServerNameByID(that.editLine.targetId)
      let serverTypeSelected = that.getServerTypeSelectedByID(
        that.editLine.targetId
      )

      if (!serverTypeSelected && that.editConnection.serverType !== '') {
        that.$confirm('此操作后，服务“' + targetNodeName + '”的服务类型将无法再修改，是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          that.sureAction()
        }).catch(() => {
          return
        })
      } else {
        that.sureAction()
      }
    },
    // 确定的操作
    sureAction () {
      let that = this
      let connectIndex
      let paramList = that.getParamListByID(that.editLine.targetId)

      // 获取连接的记录索引
      that.compositeServiceWords.combination_data_config.connects.forEach(
        function (v, i) {
          if (v.ConnectionId === that.editConnection.ConnectionId) {
            connectIndex = i
          }
        }
      )
      // 记录参数关联组合
      let src = []
      let target = []
      that.parameterMap.forEach(function (v, i) {
        src.push({
          param_name: v.exportParame,
          param_describe: v.exportDescribe,
          param_tag: v.exportTag,
          key: v.exportKey
        })
        target.push({
          param_name: v.importParame,
          param_describe: v.importDescribe,
          param_tag: v.importTag,
          key: v.importKey,
          index: v.importIndex
        })
      })
      that.editConnection.param = { src: src, target: target }
      that.compositeServiceWords.combination_data_config.connects[connectIndex] = Object.assign({}, that.editConnection) // 克隆对象而不是复制指针
      // 保存参数列表和选中的服务类型至DOM
      paramList.forEach(function (v, i) {
        if (v.service_type.toString() === that.editConnection.serverType) {
          v.params.forEach(function (o, j) {
            that.importParameter.forEach(function (m, n) {
              if (o.name === m.name) {
                o.isBind = m.isBindTemp
              }
            })
          })
        }
      })
      that.saveParamListByID(that.editLine.targetId, paramList)
      that.saveServerTypeSelectedByID(
        that.editLine.targetId,
        that.editConnection.serverType
      )

      // 校验参数饱和
      that.checkSaturation(that.editLine.targetId, true)
      that.isShowDialog = false
    },
    // 取消
    abolish () {
      this.isShowDialog = false
    },
    /** ************************ 返回&保存 ***************************/
    // 返回
    back () {
      let that = this
      that.compositeServiceWords.combination_data_config.block = that.getNodeList()
      that.$confirm('是否确定放弃当前页面编辑的内容？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          that.$emit('submit', false, 2)
          that.initParams() // 初始化画图区域设置
        })
    },
    // 保存
    save () {
      let that = this
      if (that.isPageOver) {
        that.$confirm('此操作后，页面布局已经编辑的内容将会被清空，是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            that.saveAction()
          })
      } else {
        that.saveAction()
      }
    },
    saveAction () {
      let that = this
      let id = that.$route.query.id

      if (that.checkNextStep()) {
        let nodes = that.getNodesIdList(['source', 'target'])

        // 起始点
        let sourceNode = {
          id: nodes.source[0],
          name: that.getServerNameByID(nodes.source[0])
        }
        this.compositeServiceWords.combination_data_config.start = sourceNode

        // 结束点
        nodes.target.forEach(function (v, i) {
          if (!nodes.source.includes(v)) {
            let targetNode = {
              id: v,
              name: that.getServerNameByID(v),
              atomic_type: that.getServerTypeSelectedByID(v)
            }
            that.compositeServiceWords.combination_data_config.end.push(targetNode)
          }
        })

        // 所有节点
        that.compositeServiceWords.combination_data_config.block = that.getNodeList()

        let param = {
          combination_data_config: that.compositeServiceWords.combination_data_config,
          operate_page: '2',
          approval_workflow: that.approval_workflow,
          approval_batchNo: that.approval_batchNo,
          id: id,
          source_type: that.$route.query.source_type
        }

        LoadingBoxService.open('正在保存,请稍等')
        apiClient.post(
          'itsmApi/createService/operateCombinationService',
          param,
          function (data) {
            LoadingBoxService.close()
            if (data.status === 200) {
              TipBoxService.open('保存成功', 0)
              that.$emit('submit', true, 2, that.compositeServiceWords)
              that.initParams() // 初始化画图区域设置
            } else {
              TipBoxService.open(data.exception, 1)
            }
          })
      }
    },
    /** *************************** 校验 *******************************/
    // 画连接线校验
    checkDrawLine (connInfo) {
      let that = this
      let key = 'new'
      // console.log(that.compositeServiceWords.combination_data_config.connects,connInfo)
      that.compositeServiceWords.combination_data_config.connects.forEach(
        function (v, i) {
          if (v.ConnectionId === connInfo.connection.id) {
            console.log('回显已有连线')
            key = 'recovery'
            return key
          }
          let points = [connInfo.sourceId, connInfo.targetId]
          if (points.includes(v.PageSourceId) && points.includes(v.PageTargetId)) {
            TipBoxService.open('不允许两个服务节点重复连线！', 1)
            key = 'error'
            return key
          }
        }
      )
      if (key === 'error') {
        return key
      }

      if (connInfo.sourceId === connInfo.targetId) {
        TipBoxService.open('服务节点不允许连接自身！', 1)
        key = 'error'
        return key
      }

      let type = that.getServerTypeByID(connInfo.sourceId)
      if (type.length === 1 && type[0] === '2') {
        let serverName = that.getServerNameByID(connInfo.sourceId)
        TipBoxService.open('服务"' + serverName + '"不能做为连接的开始节点！', 1)
        key = 'error'
        return key
      }

      if (key !== 'recovery') {
        that.isLoopFlag = false
        let newConnection = {
          ConnectionId: connInfo.connection.id,
          PageSourceId: connInfo.sourceId,
          PageTargetId: connInfo.targetId,
          serverType: ''
        }
        that.compositeServiceWords.combination_data_config.connects.push(newConnection)
        that.checkLoop()
        let n = that.compositeServiceWords.combination_data_config.connects.length - 1
        that.compositeServiceWords.combination_data_config.connects.splice(n, 1)
        if (that.isLoopFlag) {
          TipBoxService.open('服务连接不能形成闭环！', 1)
          key = 'error'
          return key
        }
      }

      return key
    },
    // 保存校验
    checkNextStep () {
      let that = this
      let islands = that.getIslands()

      if (that.nodeLength <= 1) {
        TipBoxService.open('这是组合服务，服务节点数必须大于1！', 1)
        return false
      }

      let sourceUnique = that.checkSourceUnique()
      if (!sourceUnique) {
        TipBoxService.open('开始节点不唯一！', 1)
        return false
      }

      if (islands.length) {
        let name = ''
        islands.forEach(function (v, i) {
          let serverName = that.getServerNameByID(v)
          name += serverName + '、'
        })
        name = name.substring(0, name.length - 1)
        TipBoxService.open('服务“' + name + '”是孤立节点！', 1)
        return false
      }

      // 校验所有服务参数是否饱和
      if (!that.checkSaturationAll()) {
        return false
      }

      // 校验所有连线上是否都做了参数关联
      if (!that.checkBindAll()) {
        return false
      }

      return true
    },
    // 校验起始节点是否唯一
    checkSourceUnique () {
      let that = this
      let num = 0
      let source = that.getNodesIdList(['source']).source
      let target = that.getNodesIdList(['target']).target

      source.forEach(function (v, i) {
        if (!target.includes(v)) {
          num++
        }
      })
      console.log(num)
      return !(num > 1)
    },
    // 校验单个服务参数是否饱和，未饱和返回服务名称，饱和返回false
    checkSaturation (targetId, isShowTip) {
      let paramList = this.getParamListByID(targetId)
      let serverType = this.getServerTypeSelectedByID(targetId)
      let serverName = this.getServerNameByID(targetId)
      let status = true
      paramList.forEach(function (v, i) {
        if (v.service_type.toString() === serverType) {
          v.params.forEach(function (o, j) {
            if (o.isRequired === true && o.isBind === false) {
              status = false
            }
          })
        }
      })
      if (!status) {
        if (isShowTip) {
          TipBoxService.open('服务“' + serverName + '”必填入参未饱和，将无法进入下一步', 2)
        }
        return serverName
      } else {
        return false
      }
    },
    // 校验所有服务参数是否饱和，未饱和返回false，饱和返回true
    checkSaturationAll () {
      let that = this
      let targetIdList = that.getNodesIdList(['target']).target
      let status = true
      let nodeNames = []
      let text = ''

      // console.log('targetIdList',targetIdList)
      targetIdList.forEach(function (v, i) {
        let name = that.checkSaturation(v, false)
        if (name) {
          status = false
          nodeNames.push(name)
        }
      })

      if (!status) {
        nodeNames.forEach(function (v, i) {
          text += v + '、'
        })
        text = text.substring(0, text.length - 1)
        TipBoxService.open('服务“' + text + '”的必填入参未饱和，当前无法进入下一步！', 1)
        return false
      } else {
        return true
      }
    },
    // 校验所有连线上是否都做了参数关联，是返回true，否返回false
    checkBindAll () {
      let vm = this
      let flag = true
      let connects = [...vm.compositeServiceWords.combination_data_config.connects]
      connects.forEach(function (v, i) {
        if (!vm.checkNull(v.param) || !vm.checkNull(v.param.src)) {
          let start = vm.getServerNameByID(v.PageSourceId)
          let end = vm.getServerNameByID(v.PageTargetId)
          TipBoxService.open('服务“' + start + '”与服务“' + end + '”之间的连线未做参数关联，无法进入下一步！', 1)
          flag = false
          return
        }
      })
      return flag
    },
    // 闭环校验，形成闭环返回true
    checkLoop () {
      let that = this
      let connects = [...that.compositeServiceWords.combination_data_config.connects]
      let nodes = that.getNodesIdList(['all']).all
      let delNodes = that.checkLoopDelNodes(connects, nodes)
      if (delNodes.length) {
        that.checkLoopFor(connects, nodes, delNodes)
      } else {
        if (connects.length > 0) {
          that.isLoopFlag = true
        }
      }
    },
    checkLoopFor (connects, nodes, delNodes) {
      let that = this
      // debugger
      delNodes.forEach(function (v, i) {
        nodes.splice($.inArray(v, nodes), 1)
        // 删除多个元素时，倒着删，防止删除后改变数组长度，后面的元素遍历不到
        for (let n = connects.length - 1; n >= 0; n--) {
          if (connects[n].PageSourceId === v) {
            connects.splice(n, 1)
          }
        }
      })
      if (connects.length > 0) {
        let delNodesNew = that.checkLoopDelNodes(connects, nodes)
        if (delNodesNew) {
          that.checkLoopFor(connects, nodes, delNodesNew)
        } else {
          if (nodes.length > 0) {
            that.isLoopFlag = true
          }
        }
      }
    },
    checkLoopDelNodes (connects, nodes) {
      let that = this
      let target = that.getNodesIdList(['target'], connects).target
      let delNodes = []
      nodes.forEach(function (v, i) {
        if (!target.includes(v)) {
          delNodes.push(v)
        }
      })
      if (delNodes.length > 0) {
        return delNodes
      } else {
        return false
      }
    },
    // 校验是否是孤立点，是孤立点返回true
    checkIsland (nodeId) {
      let that = this
      let islands = that.getIslands()
      if ($.inArray(nodeId, islands) === -1) {
        return false
      } else {
        return true
      }
    },
    // 校验是否为空
    checkNull (obj) {
      if (
        obj === '' ||
        obj === undefined ||
        obj.length === 0 ||
        JSON.stringify(obj) === '{}'
      ) {
        return false
      } else {
        return true
      }
    },
    /** *********************** 公共方法 ****************************/
    // 添加节点的dom元素
    creatNodeDom (node) {
      let that = this
      let html =
        '<div id=\'' +
        node.BlockId +
        '\' imgUrl=\'' +
        node.BlockImg +
        '\' servicetype=\'' +
        node.BlockServiceType +
        '\'servicetypeselected=\'' +
        node.BlockServiceTypeSelected +
        '\'params=\'' +
        node.BlockParams +
        '\'servicename=\'' +
        node.BlockContent +
        '\' class=\'nodeDiv\'>' +
        '<i class=\'icon iconfont icon-delete-black\'></i>' +
        '<img src=\'' + that.apiBaseUrl + '/itsmApi/attachment/show?imgPath=' + node.BlockImg + '\' alt=\'\' />' +
        '<span class=\'fc-serverName\' title=\'' +
        node.BlockContent +
        '\'>' +
        node.BlockContent +
        '</span></div>'
      $('#editContainer').append(html)

      node.BlockWidth = node.BlockWidth || 'auto'
      node.BlockHeight = node.height ? node.BlockHeight : 'auto'
      $('#' + node.BlockId).css({
        position: 'absolute',
        left: node.BlockX + 'px',
        top: node.BlockY + 'px',
        width: node.BlockWidth,
        height: node.BlockHeight
      })
      // 添加连接点
      that.instance.addEndpoint(
        node.BlockId,
        {
          anchors: 'RightMiddle'
        },
        Demo.hollowCircle
      )
      that.instance.addEndpoint(
        node.BlockId,
        {
          anchors: 'LeftMiddle'
        },
        Demo.hollowCircle
      )
      that.instance.addEndpoint(
        node.BlockId,
        {
          anchors: 'TopCenter'
        },
        Demo.hollowCircle
      )
      that.instance.addEndpoint(
        node.BlockId,
        {
          anchors: 'BottomCenter'
        },
        Demo.hollowCircle
      )
      // 注册实体可draggable
      $('#' + node.BlockId).draggable({
        containment: 'parent',

        drag: function (event, ui) {
          that.instance.repaintEverything()
        },
        stop: function () {
          that.instance.repaintEverything()
        }
      })
    },
    // 设置连接线上的修改删除按钮
    setlabel (conn) {
      let str =
        '<div class="glyphicon glyphicon-pencil" aria-hidden="true" style="cursor:pointer"></div> <div style="cursor:pointer" class="glyphicon glyphicon-remove" aria-hidden="true" ></div>'
      conn.getOverlay('label').setLabel(str)
      conn.setParameter('twoWay', false)
      conn.hideOverlay('arrow_backwards')
    },
    // 按节点删除相关连线数据
    deleteConnectsByNodeId (nodeId) {
      let that = this
      let connects = [
        ...that.compositeServiceWords.combination_data_config.connects
      ]
      // 因为循环里是删除操作，如果上面不深拷贝出来，下面的循环会少执行
      connects.forEach(function (v, i) {
        if (v.PageSourceId === nodeId || v.PageTargetId === nodeId) {
          that.deleteConnectsOnLine(v.ConnectionId)
        }
      })
      console.log(that.compositeServiceWords.combination_data_config)
    },
    // 删除单条连接线
    deleteConnectsOnLine (editLineId) {
      let that = this
      let delConnection = {}
      let lineId = editLineId || that.editLine.id

      // 删除记录
      that.compositeServiceWords.combination_data_config.connects.forEach(
        function (v, i) {
          if (lineId === v.ConnectionId) {
            delConnection = Object.assign({}, v)
            that.compositeServiceWords.combination_data_config.connects.splice(
              i,
              1
            )
          }
        }
      )

      // 修改DOM节点上保存的参数关联状态
      if ($('#' + delConnection.PageTargetId)[0]) {
        let paramList = that.getParamListByID(delConnection.PageTargetId)
        delConnection.param.target.forEach(function (v, i) {
          paramList.forEach(function (o, j) {
            if (o.service_type.toString() === delConnection.serverType) {
              o.params.forEach(function (m, n) {
                if (v.param_name === m.name) {
                  m.isBind = false
                }
              })
            }
          })
        })
        that.saveParamListByID(delConnection.PageTargetId, paramList)

        // 如果目标节点已经是孤立点，清除已选服务类型
        if (that.checkIsland(delConnection.PageTargetId)) {
          that.saveServerTypeSelectedByID(delConnection.PageTargetId, '')
        } else {
          // 如果目标节点不是孤立点，校验服务参数是否饱和
          that.checkSaturation(delConnection.PageTargetId, true)
        }
      }
    },
    // 从dom获取节点的服务名称
    getServerNameByID (id) {
      return $('#' + id).attr('servicename')
    },
    // 从dom获取节点的服务类型列表
    getServerTypeByID (id) {
      let list = JSON.parse($('#' + id).attr('servicetype'))
      if (list.includes('1')) {
        let n = $.inArray('1', list)
        list.splice(n, 1)
      }
      return list
    },
    // 从dom获取节点的参数列表
    getParamListByID (id) {
      return JSON.parse($('#' + id).attr('params'))
    },
    // 保存节点的参数列表至dom
    saveParamListByID (id, paramList) {
      $('#' + id).attr('params', JSON.stringify(paramList))
    },
    // 从dom获取节点选中的服务类型
    getServerTypeSelectedByID (id) {
      return $('#' + id).attr('servicetypeselected')
    },
    // 保存节点选中的服务类型至dom
    saveServerTypeSelectedByID (id, servicetype) {
      $('#' + id).attr('servicetypeselected', servicetype)
    },
    // 遍历DOM获取当前所有节点信息
    getNodeList () {
      let blocks = []

      $('#editContainer .nodeDiv').each(function () {
        let elem = $(this)
        blocks.push({
          BlockId: elem.attr('id'),
          BlockImg: elem.attr('imgUrl'),
          BlockParams: elem.attr('params'),
          BlockServiceType: elem.attr('servicetype'),
          BlockServiceTypeSelected: elem.attr('servicetypeselected'),
          BlockContent: elem.attr('servicename'),
          BlockX: parseInt(elem.css('left'), 10),
          BlockY: parseInt(elem.css('top'), 10),
          BlockWidth: parseInt(elem.css('width'), 10),
          BlockHeight: parseInt(elem.css('height'), 10)
        })
      })
      return blocks
    },
    /**
      * 获取起始、结束、全部节点id
      * type：['source','target','all']
      * result：{source:[],target:[],all:[]}
    */
    getNodesIdList (type, lines, points) {
      let that = this
      let connects = lines || that.compositeServiceWords.combination_data_config.connects
      let nodes = points || that.getNodeList()
      let idList = {source: [], target: [], all: []}
      let result = {}

      connects.forEach(function (v, i) {
        if ($.inArray(v.PageSourceId, idList.source) === -1) {
          idList.source.push(v.PageSourceId)
        }
        if ($.inArray(v.PageTargetId, idList.target) === -1) {
          idList.target.push(v.PageTargetId)
        }
      })

      nodes.forEach(function (v, i) {
        idList.all.push(v.BlockId)
      })

      type.forEach(function (v, i) {
        result[v] = idList[v]
      })
      return result
    },
    // 获取孤立点id
    getIslands () {
      let that = this
      let idList = that.getNodesIdList(['all']).all
      let source = that.getNodesIdList(['source']).source
      let target = that.getNodesIdList(['target']).target
      let islands = []
      idList.forEach(function (v, i) {
        if ($.inArray(v, source) === -1 && $.inArray(v, target) === -1) {
          islands.push(v)
        }
      })
      return islands
    },
    // 获取服务来源文字
    getSourceType: function (str) {
      let list = [
        { label: '企业服务', value: 'ENTERPRISE' },
        { label: '平台服务', value: 'PLATFORM' },
        { label: '第三方服务', value: 'THIRDPART' },
        { label: '个人服务', value: 'PERSONAL' }
      ]
      let sourceType = ''
      list.forEach(function (v, i) {
        if (str === v.value) {
          sourceType = v.label
          return
        }
      })
      return sourceType
    },
    // 时间格式转换
    formateTime: function (time) {
      return commonFunc.formatDate(time, 'yyyy-MM-dd')
    },
    // 转换服务归属
    getBelonging: function (item) {
      switch (item.belong_type) {
      case 'ENTERPRISE':
        return item.enterpriseName
      case 'PLATFORM':
        return '平台'
      case 'PERSONAL':
        return item.userName
      }
    }
  }
}
</script>
<style src="../../css/createCombinationServeice/setTopology.css" scoped></style>
<style>
/* 复写element样式生效必要条件：1、必须写在vue页面里；2、不能加“scoped”；3、前面需要私有类名限制 */
.flow-chart .el-collapse {
  border:none;
  width:180px;
  overflow: hidden;
}
.flow-chart .el-collapse-item__header {
  height: 30px;
  line-height: 30px;
  border-bottom: 1px solid #f1f1f1;
  font-size: 12px;
  padding-left:10px;
  font-weight: bold;
  position: relative;
}
.flow-chart .el-collapse-item__header::after{
    content: '';
    width: 2px;
    height: 12px;
    position: absolute;
    left: 2px;
    top:10px;
    background-color: #55a8fd;
}
.flow-chart .el-collapse-item__header__arrow{
  float: right;
  font-weight: 300;
  line-height: 30px;
  transform: scale(0.8, 0.8);
}
.flow-chart .el-collapse-item__wrap{
  background:none;
  border:none;
}
.flow-chart .el-collapse-item__content {
  padding: 0;
}
.flow-chart .buttnet {
  padding-bottom: 0;
}
.flow-chart .nodeDiv {
  border: 1px #ccc solid;
  position: absolute;
  left: 40%;
  top: 50px;
  border-radius: 2px;
  background: #fff !important;
}
.flow-chart .nodeDiv:hover{
  border:1px solid #55a8fd;
}
.flow-chart .nodeDiv .icon {
  position: absolute;
  right: 0;
  top: 0;
  color: #d9435c;
  font-size: 12px;
  transform: scale(1.2, 1.2) translate(30%,-30%);
  cursor: pointer;
  display: none;
}
.flow-chart .nodeDiv:hover .icon {
  display: block;
}
.flow-chart .nodeDiv .fc-serverName {
  display: inline-block;
  padding:5px 10px 5px 5px;
  font-weight: normal;
  font-size: 12px;
  white-space:nowrap;
  vertical-align: middle;
}
.flow-chart .nodeDiv>img {
  width: 14px;
  height: 14px;
  vertical-align: middle;
  margin-left:10px;
}
/* .el-dialog */

.flow-chart .el-dialog {
  width: 600px;
  border-radius: 5px;
}
.flow-chart .el-dialog__header {
  width: 600px;
  padding: 15px 15px 10px 15px;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
}
.flow-chart .el-dialog__body {
  width: 600px;
  padding: 20px;
}
.flow-chart .el-dialog__footer {
  padding: 0;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
}
.flow-chart .dialog-footer .el-button {
  color: #ffffff;
  float: left;
  height: 40px;
  border-radius: 0px;
  width: 50%;
  margin: 0 !important;
}
.flow-chart .el-button--primary {
  background-color: #7fa6f3;
  border-color: #7fa6f3;
  border-bottom-left-radius: 5px;
}
.flow-chart .el-button--default {
  background-color: #e2e2e2;
  border-color: #e2e2e2;
  border-bottom-right-radius: 5px;
}
</style>

