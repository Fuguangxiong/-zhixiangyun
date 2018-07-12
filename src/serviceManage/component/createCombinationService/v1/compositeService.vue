<template>
	<!-- 主题内容菜单 -->
  <div class="resoubox compositeService-el">
    <div class="resou-con">
      <div class="w1200">
        <!-- 定位导航 -->
        <div class="publicNav">
          <span class="hand" @click="toMain()"></span>
          <span class="active">服务管理</span>
          <span class="arrows">></span>
          <span class="active">新建组合服务</span>
          <!-- <div class="returnBtn publicRedBtn"@click='nextPage'>提交 </div> -->
        </div>

        <!-- start: 内容 -->
        <div class="mode-div lanm-con lanm-con-bo" v-bind:style="{'height':(fullHeight-160) +'px'}">
          <!-- start: 左侧服务搜索及列表 -->
          <div class="bota-left" v-bind:style="{'height':(fullHeight-160) +'px'}">
            <div class="inpt-mg">
              <input type="text" value="" class=" wmin control-tcss" placeholder="请输入关键字" v-model="searchKey" @keyup.enter="getServerList">
              <i class="soto" @click="getServerList"></i>
            </div>
            <div class="treecong">
              <div id="tree" v-bind:style="{'height':(fullHeight-265) +'px','overflow': 'auto'}">
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
                      <ul>
                        <li><b>服务名称：</b>{{service.name}}</li>
                        <li><b>服务归属：</b>{{getBelonging(service)}}</li>
                        <li><b>服务简介：</b><span>{{service.service_brief}}</span></li>
                        <li><b>服务期限：</b>{{formateTime(service.service_start_time)}} 至 {{formateTime(service.service_end_time)}}</li>
                      </ul>
                      <span slot="reference">{{service.name}}</span>
                    </el-popover>                    
                  </el-collapse-item>
                </el-collapse>           
              </div>
            </div>
          </div>
          <!-- end: 左侧服务搜索及列表 -->

          <!-- start: 右侧 -->
          <div class="bo-right">
            <div class="right-con">
              <div class="time-con">
                <!-- start: 画图区域 -->
                <div class="infobox droppable" id="container" :num="nodeLength" v-bind:class="nodeLength > 0 ? '' : 'showBg'">
                  <!-- start: 智能推荐 -->
                  <div class="info-left">
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
                              :img="tj.img">{{tj.name }}
                          </div>
                        </div>
                      </el-collapse-transition>
                    </div>
                  </div>
                  <!-- end: 智能推荐 -->
                </div>
                <!-- end: 画图区域 -->
              </div>
            </div>

            <!-- start: 步骤按钮 -->
            <div class="buttnet">
              <span class="butonst" @click="save()">暂存</span>
              <span class="butonstred" @click='back'>上一步</span>
              <span class="butonstrnext" @click='nextPage'>下一步</span>
            </div>
            <!-- end: 步骤按钮 -->
          </div>
          <!-- end: 右侧 -->
        </div>
        <!-- end: 内容 -->
      </div>
    </div>

    <!-- start: 条件关联 -->
    <div id="myModal" class="modal fade" aria-labelledby="myModalLabel" aria-hidden="true" data-backdrop='static'>
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-hidden="true" @click='abolish'>&times;</button>
            <h4 class="modal-title" id="myModalLabel">条件关联</h4>
          </div>
          <div class="modal-body">
            <!-- 服务类型 -->
            <div id="select_config" class="config">
              <div class="typeInput">
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
                  <i class='icon iconfont icon-guanbi' @click='deleteCombination(index,item.importIndex)'></i>
              </span>
            </div>
            <!-- 参数 -->
            <div id="select_targetList" class="listStyle listStyleRight">
              <!-- 入参 -->
              <div class="leftMenu">
                <p><span>输入参数</span></p>
                <ul class="leftMenuList">
                  <li class="leftMenuListItem" 
                      v-for='(item,index) in importParameter' 
                      @click='importSelect(index)' 
                      :class='{active:item.state}' 
                      :title='item.tag'
                      v-show='!item.isBindTemp'>{{item.name}}
                      <span v-show='item.isRequired' style='color:#c64d4d;'>（必填）</span>
                  </li>
                </ul>
                <div class="describe">
                  <p><span>{{importDescribeTitle + ':'}}</span> {{importDescribeContent}}</p>
                </div>
              </div>
              <div class="centerArrows">
                >>
              </div>
              <!-- 出参 -->              
              <div class="rightMenu">
                <p><span>输出参数</span></p>
                <ul class="rightMenuList">
                  <li v-for='(item,index) in exportParameter' @click='createParameterMap(item,index)'>
                    <span class="componentSelectBtn" :class='{select:item.state}'></span>
                    <span :title='item.tag'>{{item.name}}</span>
                  </li>
                </ul>
                <div class="describe">
                  <p><span>{{exportDescribeTitle + ':'}}</span> {{exportDescribeContent}}</p>
                </div>
              </div>
            </div>
            <div class="clearBoth"></div>
          </div>
          <div class="modal-footer">
            <button id="clear_label" type="button" class="btn btn-primary" data-dismiss="modal" @click='abolish'>取消</button>
            <button id="submit_label" type="button" class="btn btn-primary" data-dismiss="modal" @click='createConnects'>确定</button>
          </div>
        </div>
      </div>
    </div>
    <!-- end: 条件关联 -->
  </div>
</template>
<script type="text/javascript" src="../../lib/jsPlumb-2.2.8.js" ></script>
<script>
import jsPlumb from "../../lib/jsPlumb-2.2.8.js";
import Bootstrap from "bootstrap/dist/js/bootstrap.min.js";
import JqUI from "../../lib/jquery-ui.min.js";
import Demo from "../../lib/demo.js";
import apiToken from "../../../publicJs/apiToken.js";
import apiClient from "../../../publicJs/ApiClient.js";
import commonFunc from "../common/commonFunc.js";
import TipBoxService from "../common/TipBoxService.js";
import LoadingBoxService from "../../../publicJs/LoadingBoxService.js";
import { Message } from 'element-ui';
export default {
  name: "CompositeService",
  components: {},
  data() {
    return {
      source_type:this.$route.query.source_type,
      serverListType:'belong_type',
      fullHeight: document.documentElement.clientHeight,
      isShowRecommend: false, //是否显示推荐服务列表
      isSelectServerTypeOn: true, //关联窗口是否允许选择服务类型
      compositeServiceWords: {
        id: "", //组合服务id
        combination_data_config: {
          connects: [], // 组合服务保存格式 -- connects 字段
          start: {},
          end: [],
          block: []
        }
      },
      nodeLength: 0, //节点个数
      degreeInput: [], //入度为0数组
      degreeOutput: [], //出度为0数组
      noneList: [], //没有连线孤立的节点
      activeName: "0", //左侧服务列表开合绑定值，'1'为打开，其他值关
      nodeSortFlag: 0, //所有节点的id最后一位排序数字最大值，用于再新建节点时，保证新节点id不会与之前重复
      serverList: [], //系统服务列表
      tjserver: [], //推荐服务列表
      conn: "", // 点和线的关系
      searchKey: "", //搜索关键字
      linkList: [], //用于出度入度
      editConnection:{
        // ConnectionId:'',
        // PageSourceId:'',
        // PageTargetId:'',
        serverType:'',
      },
      editLine:{}, //保存当前连接线信息
      serverTypeList: "", // 服务下拉列表
      importParameter: [], //入参
      exportParameter: [], //出参
      importDescribeIndex: "", //选中的入参信息
      importDescribeTitle: "", 
      importDescribeContent: "", 
      exportDescribeTitle: "", //选中的出参信息
      exportDescribeContent: "",
      parameterMap: [], //参数关联组合
      approval_workflow:0,//流程审批：
      approval_batchNo:0,//批次号
      isLoopFlag:false, //是否闭环标识
    };
  },
  updated() {
    this.leftMenuDrag();
  },
  mounted() {
    let that = this;
    that.init();
    $(window).resize(function() {
      that.fullHeight = document.documentElement.clientHeight;
    });
  },
  methods: {
    // 返回
    toMain() {
			if (this.source_type == "1") {
        this.$router.push("/enterprise");
      } else if (this.source_type == "5") {
        this.$router.push("/registered");
      } else if (this.source_type == "2") {
        this.$router.push("/platformService");
      }
    },
    back() {
      let that = this;
      that.$router.push({
        path: "newCompositeService",
        query: { id: that.$route.query.id,source_type:that.source_type}
      });
    },
    //初始化
    init(){
      let that = this;
      that.initInstance(); // 初始化画图区域设置
      that.getServerList(); // 获取左侧服务列表
      that.bindDomEvent(); // 绑定监听和Dom事件
      that.getRecoveryData(); // 回显
    },
    //画图区域设置初始化
    initInstance() {
      this.instance = jsPlumb.getInstance({
        DragOptions: { cursor: "pointer", zIndex: 2000 },
        ConnectionOverlays: [
          [
            "Arrow",
            {
              location: 1,
              visible: true,
              width: 11,
              length: 11,
              direction: 1,
              id: "arrow_forwards"
            }
          ],
          [
            "Label",
            {
              location: 0.5,
              id: "label",
              cssClass: "aLabel"
            }
          ]
        ],
        Container: "container"
      });
      this.instance.importDefaults({
        ConnectionsDetachable: true,
        ReattachConnections: true
      });
    },
    //绑定监听和Dom事件
    bindDomEvent() {
      let that = this;

      //监听新的连接
      that.instance.bind("connection", function(connInfo, originalEvent) {
        
        //画连接线校验
        let isChecked = that.checkDrawLine(connInfo);

        //未通过校验，删除连接线。
        if(isChecked=='error'){
          jsPlumb.detach(connInfo);
        }
        //回显
        else if (isChecked=='recovery') {
          that.setlabel(connInfo.connection); //添加连接线上的修改、删除图标
        }
        //新建连接线
        else if (isChecked=='new') {
          that.setlabel(connInfo.connection); //添加连接线上的修改、删除图标
          that.editConnection = {
            ConnectionId: connInfo.connection.id,
            PageSourceId: connInfo.sourceId,
            PageTargetId: connInfo.targetId,
            serverType:''
          };
          that.compositeServiceWords.combination_data_config.connects.push(that.editConnection);
          that.editLine = connInfo.connection; //保存当前连接线信息
          that.openModal(); //打开条件关联窗口
        }
      });

      //监听连接上的按钮点击事件
      that.instance.bind("click", function(conn, originalEvent) {
        let target = $(originalEvent.target);
        that.editLine = conn; //保存当前连接线信息
        // 编辑关联参数
        if (target.hasClass("glyphicon-pencil")) {
          that.openModal(); //打开条件关联窗口
        }
        // 删除
        else if (target.hasClass("glyphicon-remove")) {
          that.$confirm('此操作将删除该连线, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            that.instance.detach(conn);
            that.deleteConnectsOnLine();
          })
        }
      });

      //删除节点
      $("#container").on("click", ".nodeDiv .icon-guanbi", function() {
        //要先保存父元素的DOM,因为出现确认对话框之后(this)会消失
        let node = $(this).parent();
        let nodeId = node.attr("id");
        that.$confirm('此操作将删除该节点及其相关所有连线, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          that.instance.removeAllEndpoints(nodeId); //删除节点的所有连接线
          node.remove(); //删除节点DOM
          that.deleteConnectsByNodeId(nodeId);//删除相关连线数据
          that.nodeLength--;
        })
      });

      // 关闭模态框的回调
      $("#myModal").on("hidden.bs.modal", function(e) {
        that.importDescribeTitle = "";
        that.importDescribeContent = "";
        that.exportDescribeTitle = "";
        that.exportDescribeContent = "";
      });
    },
    //获取左侧服务列表
    getServerList() {
      let that = this;
      let param = { query_type: that.serverListType, fuzzy_info: that.searchKey };
      console.log('param',param)
      LoadingBoxService.open("加载数据，请稍候......");
      apiClient.post(
        "itsmApi/combination/queryTopologicalServiceTree",
        param,
        function(data) {
          LoadingBoxService.close();
          if (data.status == "200") {
            let dataList = [...data.results];
            console.log("ServerList", data);
            if(that.serverListType=='belong_type'){
              dataList.forEach(function(v,i){
                v.label=that.getSourceType(v.label);
              });
            }
            that.serverList=dataList;
          } else {
            console.log("no ServerList");
            TipBoxService.open("未查询到服务", 0);
          }
        }
      );
    },
    //拖拽（左侧服务列表和智能推荐服务列表）
    leftMenuDrag() {
      let that = this;
      let draggableType = true; //拖拽后是否刷新右侧推荐服务列表
      //拖拽设置，左侧
      $("#tree .draggable").draggable({
        containment: ".mode-div.lanm-con.lanm-con-bo",
        helper: "clone",
        scope: "plant",
        stop: function() {
          draggableType = true;
        }
      });
      //拖拽设置，推荐
      $("#recommendTree .draggable").draggable({
        containment: ".mode-div.lanm-con.lanm-con-bo",
        helper: "clone",
        scope: "plant",
        stop: function() {
          draggableType = false;
        }
      });
      $("#container").droppable({
        scope: "plant",
        drop: function(event, ui) {
          /*防止拖拽的服务压住边框线*/
          let state1 = ui.offset.left >= $("#container").offset().left, //left
            state2 = ui.offset.top >= $("#container").offset().top, //top
            state3 =
              ui.offset.top + 100 <=
              $("#container").offset().top + $("#container").height(), //bottom
            state4 =
              ui.offset.left + 100 <=
              $("#container").offset().left + $("#container").width(); //right

          if (state1 && state2 && state3 && state4) {
            if (draggableType) {
              that.createNode(ui, $(this), true);
            } else {
              that.createNode(ui, $(this));
            }
          }
        }
      });
    },
    /**
     * 创建节点
     * @param ui
     * @param selector
     * @param refresh 是否刷新右侧推荐服务列表
		**/
    createNode(ui, selector, refresh) {
      let that = this;
      let block_id=$(ui.draggable).attr("id");
      let service_tag = $(ui.draggable).attr("servicetag");

      //整理参数数组，给参数添加是否绑定的属性
      let paramsJson=JSON.parse($(ui.draggable).attr('servicedetail'));
      paramsJson.splice(0,1);
      paramsJson.forEach(function(v,i){
        v.params.forEach(function(o,j){
          o.isBind=false;
        });
      });

      let node={};
      node.BlockId = block_id + "_model_" + that.nodeSortFlag++;
      node.BlockParams = JSON.stringify(paramsJson);
      node.BlockServiceType =$(ui.draggable).attr("servicetype");
      node.BlockServiceTypeSelected='';
      node.BlockContent = $(ui.draggable).text();
      node.BlockX=parseInt(ui.offset.left - $(selector).offset().left);
      node.BlockY=parseInt(ui.offset.top - $(selector).offset().top);

      that.creatNodeDom(node);
      that.nodeLength++;

      if (refresh) {
        this.getRecommendServerList(block_id, service_tag);
      }
    },
    //获取智能推荐服务列表
    getRecommendServerList(block_id, service_tag) {
      LoadingBoxService.open("加载数据，请稍候......");
      let that = this;
      let paramStr = { service_tag: service_tag, block_id: block_id };
      apiClient.post(
        "itsmApi/combination/findRecommendAtomicList",
        paramStr,
        function(data) {
          that.tjserver = data.results.data;
          LoadingBoxService.close();
          that.isShowRecommend = true;
        }
      );
    },
    /************************** 回显 ***************************/
    //获取回显数据
    getRecoveryData() {
      let that = this;
      let serverId = that.$route.query.id;
      if (serverId != undefined) {
        apiClient.post("itsmApi/combination/findCombinationService", { id: serverId }, function(data) {
          that.approval_workflow = data.results.data.approval_workflow;
           that.approval_batchNo = data.results.data.approval_batchNo;
          let config = data.results.data.combination_data_config;
          if (config != undefined && config != "") {
            config.block = JSON.parse(config.block);
            config.connects = JSON.parse(config.connects);

            that.compositeServiceWords.combination_data_config.connects = config.connects;
            that.recoveryInit(config);
          }
        });
      }
    },
    //回显
    recoveryInit(config) {
      let that = this;
      if (!config) {
        return false;
      }
      if (config.block.length > 0) {
        that.nodeLength = config.block.length;
      }

      //回显节点
      let idIndex = [];
      for (let i = 0; i < config.block.length; i++) {
        let node=config.block[i];
        let blockId=node.BlockId;
        idIndex.push(parseInt(blockId.substr(39))); //取节点ID最后一位的序号保存
        that.creatNodeDom(node);
      }
      //保证再新建节点时，ID最后一位的序号比当前序号中的最大值大1
      if (idIndex.length > 0) {
        this.nodeSortFlag = idIndex.sort(sortNumber)[idIndex.length - 1];
        this.nodeSortFlag++;
      }
      function sortNumber(a,b){
        return a - b;
      }

      //回显连接
      for (let i = 0; i < config.connects.length; i++) {
        this.instance.connect(
          {
            id: config.connects[i].ConnectionId,
            source: config.connects[i].PageSourceId,
            target: config.connects[i].PageTargetId,
            anchors: ["Right", "Left"],
            endpoint: [
              "Dot",
              {
                radius: 2
              }
            ],
            paintStyle: {
              strokeWidth: 1,
              stroke: "rgb(68, 85, 102)",
              strokeStyle: "rgb(0,32,80)",
              fillStyle: "rgb(0,32,80)",
              opacity: 0.5,
              radius: 2,
              lineWidth: 6,
              outlineWidth: 6
            }, //端点的色彩样式
            connector: [
              "Flowchart",
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
                "Arrow",
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
        );
      }
    },
    /************************* 条件关联 myModal ****************************/
    //打开条件关联窗口
    openModal(){
      let that=this;

      //内容初始化
      that.isSelectServerTypeOn= true;
      that.editConnection.serverType='';
      that.parameterMap = [];
      that.importParameter = [];
      that.exportParameter = [];
      that.importDescribeIndex= "";
      that.importDescribeTitle= "";
      that.importDescribeContent= "";
      that.exportDescribeTitle= "";
      that.exportDescribeContent= "";

      that.serverTypeList = that.getServerTypeByID(that.editLine.targetId);
      console.log('that.serverTypeList',that.serverTypeList)
      that.recoveryModal();
      $("#myModal").modal();
    },
    //回显关联
    recoveryModal() {
      let that=this;
      let connects={};
      that.compositeServiceWords.combination_data_config.connects.forEach(
        function(v, i) {
          if (that.editLine.id == v.ConnectionId) {
            that.editConnection=Object.assign({}, v); //克隆对象而不是复制指针
          }
        }
      );

      if(that.getServerTypeSelectedByID(that.editLine.targetId)!=''){
        that.editConnection.serverType= that.getServerTypeSelectedByID(that.editLine.targetId);
        that.isSelectServerTypeOn= false;
        that.selectServerType();

        //如果已关联过，回显关联组合
        if (that.editConnection.param != undefined) {
          for (let i = 0; i < that.editConnection.param.src.length; i++) {
            let params=that.editConnection.param;
            that.parameterMap.push({
              importTag: params.target[i].param_tag,
              exportTag: params.src[i].param_tag,
              importParame: params.target[i].param_name,
              exportParame: params.src[i].param_name,
              importKey: params.target[i].key,
              exportKey: params.src[i].key,
              importIndex:params.target[i].index
            });
          }
        }
      }
    },
    //选择服务类型，生成入参出参
    selectServerType() {
      let that = this;
      
      //生成输出参数
      let param = {
        outputBlockId: that.editLine.sourceId,
        inputBlockId: that.editLine.targetId,
        inputServiceType: that.editConnection.serverType
      };
      
      apiClient.post("itsmApi/combination/findAtomicParam", param, function(data) {
        that.exportParameter = [];
        if(data.results.data[that.editLine.sourceId].length){
          data.results.data[that.editLine.sourceId].forEach(function(v, i) {
            that.exportParameter.push({
              tag: v.tag,
              name: v.name,
              key: v.key,
              describe: v.describe,
              state: false
            });
          });
        }
      });

      //生成输入参数
      let paramsList = that.getParamListByID(that.editLine.targetId);
      that.importParameter = [];
      if(paramsList.length){
        paramsList.forEach(function(v,i){
          if(v.service_type.toString()==that.editConnection.serverType){
            v.params.forEach(function(o,j){
              that.importParameter.push({
                tag: o.tag,
                name: o.name,
                key: o.key,
                describe: o.describe,
                state: false, //控制选中样式
                isRequired:o.isRequired,
                isBindTemp:o.isBind //临时关联状态
              });
            })
          }
        });
      }
    },
    //选择输入参数
    importSelect(index) {
      let that = this;
      that.importDescribeIndex = index;
      that.importDescribeTitle = that.importParameter[index].name;
      that.importDescribeContent = that.importParameter[index].describe;
      that.importParameter.forEach(function(val, index) {
        val.state = false;
      });
      that.importParameter[index].state = true;

      that.exportParameter.forEach(function(v,i){
        that.exportParameter[i].state = false;
      })
      that.exportDescribeTitle = '';
      that.exportDescribeContent = '';
    },
    //选择出参，生成参数关联组合
    createParameterMap(v, i) {
      let that = this;
      that.exportDescribeTitle = v.name;
      that.exportDescribeContent = v.describe;
      that.importParameter.forEach(function(val, index) {
        if (val.state) {
          //单选按钮的切换
          that.exportParameter.forEach(function(v, j) {
            v.state = false;
          });
          that.exportParameter[i].state = true;
          //生成绑定标签
          that.parameterMap.push({
            importParame: val.name,
            exportParame: v.name,
            importTag: val.tag,
            importKey: val.key,
            exportTag: v.tag,
            exportKey: v.key,
            importIndex: that.importDescribeIndex
          });
          that.importParameter[that.importDescribeIndex].isBindTemp=true;

          //清除入参的选中状态
          that.importParameter[that.importDescribeIndex].state = false;
          that.importDescribeIndex = '';
        }
      });
    },
    //删除参数关联组合
    deleteCombination(index,importIndex) {
      this.parameterMap.splice(index, 1);
      this.importParameter[importIndex].isBindTemp=false;
    },
    //确定
    createConnects() {
      let that = this;
      let targetNodeName= that.getServerNameByID(that.editLine.targetId);
      let serverTypeSelected= that.getServerTypeSelectedByID(that.editLine.targetId);

      if (!serverTypeSelected && that.editConnection.serverType!='') {
        that.$confirm('此操作后，服务“' + targetNodeName + '”的服务类型将无法再修改，是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          that.sureAction();
        }).catch(() => {
          return        
        });
      }else{
        that.sureAction();
      }
    },
    //确定的操作
    sureAction(){
      let that = this;
      let connectIndex; 
      let paramList=that.getParamListByID(that.editLine.targetId);

      //获取连接的记录索引
      that.compositeServiceWords.combination_data_config.connects.forEach(
        function(v, i) {
          if (v.ConnectionId == that.editConnection.ConnectionId) {
            connectIndex = i;
          }
        }
      );
      //记录参数关联组合
      let src=[],target=[];
      that.parameterMap.forEach(function(v, i) {
        src.push({
          param_name: v.exportParame,
          param_tag: v.exportTag,
          key: v.exportKey
        });
        target.push({
          param_name: v.importParame,
          param_tag: v.importTag,
          key: v.importKey,
          index:v.importIndex,
        });
      });
      that.editConnection.param={ src: src, target: target };
      that.compositeServiceWords.combination_data_config.connects[connectIndex] = Object.assign({}, that.editConnection);//克隆对象而不是复制指针
      //保存参数列表和选中的服务类型至DOM
      paramList.forEach(function(v,i){
        if(v.service_type.toString()==that.editConnection.serverType){
          v.params.forEach(function(o,j){
            that.importParameter.forEach(function(m,n){
              if(o.name==m.name){
                o.isBind=m.isBindTemp;
              }
            })
          })
        }
      });
      that.saveParamListByID(that.editLine.targetId, paramList);
      that.saveServerTypeSelectedByID(that.editLine.targetId,that.editConnection.serverType);

      //校验参数饱和
      that.checkSaturation(that.editLine.targetId,true);
    },
    //取消
    abolish() {},
    /************************** 暂存&下一步 ***************************/
    // 暂存
    save() {
      let that=this;
      that.compositeServiceWords.combination_data_config.block = that.getNodeList();
      let param = {
        combination_data_config: that.compositeServiceWords.combination_data_config,
        operate_page: "2",
        id: that.$route.query.id,
        approval_workflow:that.approval_workflow,
        approval_batchNo:that.approval_batchNo,
        source_type:that.source_type
      };
      LoadingBoxService.open("保存中，请稍等");
      apiClient.post(
        "itsmApi/combination/operateCombinationService",
        param,
        function(data) {
          LoadingBoxService.close();
          if (data.status == 200) {
            TipBoxService.open("暂存成功", 0);
          } else {
            TipBoxService.open("暂存失败", 1);
          }
        }
      );
    },
    //下一步 || 生成页面
    nextPage() {
      let that = this;
      let id = that.$route.query.id;

      if(that.checkNextStep()){
        console.log('下一步')
        let nodes=that.getNodesIdList(['source','target']);

        //起始点
        let sourceNode = {
          id: nodes.source[0],
          name: that.getServerNameByID(nodes.source[0])
        };
        this.compositeServiceWords.combination_data_config.start = sourceNode;

        //结束点
        nodes.target.forEach(function(v,i){
          if(!nodes.source.includes(v)){
            let targetNode={
              id: v,
              name: that.getServerNameByID(v),
              atomic_type: that.getServerTypeSelectedByID(v)
            };
            that.compositeServiceWords.combination_data_config.end.push(targetNode);
          }
        });

        //所有节点
        that.compositeServiceWords.combination_data_config.block = that.getNodeList();
        
        let param = {
          combination_data_config: that.compositeServiceWords.combination_data_config,
          operate_page: "2",
          approval_workflow:that.approval_workflow,
	  		  approval_batchNo:that.approval_batchNo,
          id: id,
          source_type:that.$route.query.source_type          
        };

        LoadingBoxService.open("跳转中,请稍等");
        apiClient.post(
          "itsmApi/combination/operateCombinationService",
          param,
          function(data) {
            setTimeout(function() {
              LoadingBoxService.close();
              that.$router.push({ name: "pageGen", query: { id: id,source_type:that.$route.query.source_type } });
            }, 3000);
        });
      }
    },
    /***************************** 校验 *******************************/
    //画连接线校验
    checkDrawLine(connInfo){
      let that = this;
      let key="new";
      that.compositeServiceWords.combination_data_config.connects.forEach(
        function(v, i) {
          if (v.ConnectionId == connInfo.connection.id) {
            console.log('回显已有连线');           
            key='recovery';
            return key;
          }else if(v.PageSourceId==connInfo.sourceId && v.PageTargetId==connInfo.targetId){
            TipBoxService.open("不允许两个服务节点重复连线！", 1);
            key='error';
            return key;
          }
        }
      );
      if(key == "error"){
        return key;
      }

      if (connInfo.sourceId == connInfo.targetId) {
        TipBoxService.open("服务节点不允许连接自身！", 1);
        key='error';
        return key;
      }
      
      let type=that.getServerTypeByID(connInfo.sourceId);
      if(type.length == 1 && type[0] == "2"){
        let serverName = that.getServerNameByID(connInfo.sourceId)
        TipBoxService.open('服务"' + serverName + '"不能做为连接的开始节点！', 1);
        key='error';
        return key;
      }
      
      if(key!='recovery'){
        that.isLoopFlag=false;
        let newConnection = {
          ConnectionId: connInfo.connection.id,
          PageSourceId: connInfo.sourceId,
          PageTargetId: connInfo.targetId,
          serverType:''
        };
        that.compositeServiceWords.combination_data_config.connects.push(newConnection);
        that.checkLoop();
        let n=that.compositeServiceWords.combination_data_config.connects.length-1;
        that.compositeServiceWords.combination_data_config.connects.splice(n, 1);
        if(that.isLoopFlag){
          TipBoxService.open("服务连接不能形成闭环！", 1);
          key='error';
          return key;
        }
      }

      return key;
    },
    //下一步校验
    checkNextStep(){
      let that = this;
      let source=that.getNodesIdList(['source']).source;
      let islands=that.getIslands();

      if(that.nodeLength<=1){
        TipBoxService.open("这是组合服务，服务节点数必须大于1！", 1);
        return false;
      }
      
      let sourceUnique=that.checkSourceUnique();
      if(!sourceUnique){
        TipBoxService.open("开始节点不唯一！", 1);
        return false;
      }
      
      if(islands.length){
        let name='';
        islands.forEach(function(v,i){
          let serverName=that.getServerNameByID(v);
          name += serverName + '、';
        });
        name = name.substring(0, name.length-1);
        TipBoxService.open('服务“' + name + '”是孤立节点！', 1);
        return false;
      }
      
      //校验所有服务参数是否饱和
      if(!that.checkSaturationAll()){
        return false;
      }

      //校验所有连线上是否都做了参数关联
      if(!that.checkBindAll()){
        return false;
      }

      return true;
    },
    //校验起始节点是否唯一
    checkSourceUnique(){
      let that = this;
      let num=0;
      let source=that.getNodesIdList(['source']).source;
      let target=that.getNodesIdList(['target']).target;

      source.forEach(function(v,i){
        if(!target.includes(v)){
          num++;
        }
      });
      console.log(num)
      return num>1?false:true;
    },
    //校验单个服务参数是否饱和，未饱和返回服务名称，饱和返回false
    checkSaturation(targetId, isShowTip) {
      let that = this;
      let paramList=this.getParamListByID(targetId);
      let serverType=this.getServerTypeSelectedByID(targetId);
      let serverName=this.getServerNameByID(targetId);
      let status=true;
      paramList.forEach(function(v,i){
        if(v.service_type.toString()==serverType){
          v.params.forEach(function(o,j){
            if(o.isRequired==true && o.isBind==false){
              status=false;
            }
          })
        }
      });
      if(!status){
        if(isShowTip){
          TipBoxService.open('服务“' + serverName + '”必填入参未饱和，将无法进入下一步', 2);
        }
        return serverName;
      }else{
        return false;
      }
    },
    //校验所有服务参数是否饱和，未饱和返回false，饱和返回true
    checkSaturationAll() {
      let that = this;
      let targetIdList=that.getNodesIdList(['target']).target;
      let status=true;
      let nodeNames=[];
      let text='';

        // console.log('targetIdList',targetIdList)
      targetIdList.forEach(function(v,i){
        let name = that.checkSaturation(v,false);
        if(name){
          status=false;
          nodeNames.push(name);
        }
      });

      if(!status){
        nodeNames.forEach(function(v,i){
          text += v + '、';
        });
        text = text.substring(0, text.length-1);
        TipBoxService.open('服务“' + text + '”的必填入参未饱和，当前无法进入下一步！', 1);
        return false;
      }else{
        return true;
      }
    },
    //校验所有连线上是否都做了参数关联，是返回true，否返回false
    checkBindAll(){
      let vm=this;
      let flag=true;
      let connects=[...vm.compositeServiceWords.combination_data_config.connects];
      connects.forEach(function(v,i){
        if(!v.param){
          let start=vm.getServerNameByID(v.PageSourceId);
          let end=vm.getServerNameByID(v.PageTargetId);
          TipBoxService.open('服务“' + start + '”与服务“' + end + '”之间的连线未做参数关联，无法进入下一步！', 1);
          flag=false;
          return;
        }
      });
      return flag;
    },
    //闭环校验，形成闭环返回true
    checkLoop() {
      let that=this;
      let connects=[...that.compositeServiceWords.combination_data_config.connects];
      let nodes=that.getNodesIdList(['all']).all;
      let delNodes=that.checkLoopDelNodes(connects,nodes);
      if(delNodes){
        that.checkLoopFor(connects,nodes,delNodes);        
      }else{
        if(connects.length>0){
          that.isLoopFlag=true;
        }
      }
    },
    checkLoopFor(connects,nodes,delNodes){
      let that=this;
      delNodes.forEach(function(v,i){
        nodes.splice($.inArray(v,nodes), 1);
        connects.forEach(function(m,n){
          if(m.PageSourceId==v){
            connects.splice(n, 1);
          }
        });
      });
      if(connects.length>0){
        let delNodesNew=that.checkLoopDelNodes(connects,nodes);
        if(delNodesNew){
          that.checkLoopFor(connects,nodes,delNodesNew);        
        }else{
          if(nodes.length>0){
            that.isLoopFlag=true;
          }
        }
      }
    },
    checkLoopDelNodes(connects,nodes){
      let that=this;
      let target=that.getNodesIdList(['target'],connects).target;
      let delNodes=[];
      nodes.forEach(function(v,i){
        if(!target.includes(v)){
          delNodes.push(v)
        }
      });
      if(delNodes.length>0){
        return delNodes;
      }else{
        return false;
      }
    },
    //校验是否是孤立点，是孤立点返回true
    checkIsland(nodeId){
      let that = this;
      let islands = that.getIslands();
      if($.inArray(nodeId, islands)==-1){
        return false;
      }else{
        return true;
      }
    },
    /************************* 公共方法 ****************************/
    //添加节点的dom元素
    creatNodeDom(node){
      let that=this;
      let html="<div id='" +
        node.BlockId +
        "'servicetype='" +
        node.BlockServiceType +
        "'servicetypeselected='" +
        node.BlockServiceTypeSelected +
        "'params='" +
        node.BlockParams +
        "'servicename='"+
        node.BlockContent +
        "' class='nodeDiv'>" +
        "<span class='icon iconfont icon-guanbi'></span>" +
        "<span class='serverName' title='" +
        node.BlockContent +
        "'>" +
        node.BlockContent +
        '</span></div>';
      $('#container').append(html);

      node.BlockWidth=node.BlockWidth||"auto";
      node.BlockHeight=node.height?node.BlockHeight:'auto';
      $("#" + node.BlockId)
        .css({
          "position": "absolute",
          "left": node.BlockX+"px",
          "top": node.BlockY+"px",
          'width': node.BlockWidth,
          'height': node.BlockHeight
          });
      //添加连接点
      that.instance.addEndpoint(
        node.BlockId,
        {
          anchors: "RightMiddle"
        },
        Demo.hollowCircle
      );
      that.instance.addEndpoint(
        node.BlockId,
        {
          anchors: "LeftMiddle"
        },
        Demo.hollowCircle
      );
      that.instance.addEndpoint(
        node.BlockId,
        {
          anchors: "TopCenter"
        },
        Demo.hollowCircle
      );
      that.instance.addEndpoint(
        node.BlockId,
        {
          anchors: "BottomCenter"
        },
        Demo.hollowCircle
      );
      //注册实体可draggable
      $("#" + node.BlockId).draggable({
        containment: "parent",

        drag: function(event, ui) {
          that.instance.repaintEverything();
        },
        stop: function() {
          that.instance.repaintEverything();
        }
      });
    },
    //设置连接线上的修改删除按钮
    setlabel(conn) {
      let str ='<div class="glyphicon glyphicon-pencil" aria-hidden="true" style="cursor:pointer"></div> <div style="cursor:pointer" class="glyphicon glyphicon-remove" aria-hidden="true" ></div>';
      conn.getOverlay("label").setLabel(str);
      conn.setParameter("twoWay", false);
      conn.hideOverlay("arrow_backwards");
    },
    //按节点删除相关连线数据
    deleteConnectsByNodeId(nodeId) {
      let that = this;
      let connects=[...that.compositeServiceWords.combination_data_config.connects];
      //因为循环里是删除操作，如果上面不深拷贝出来，下面的循环会少执行
      connects.forEach(function(v, i) {
        if (v.PageSourceId == nodeId || v.PageTargetId == nodeId) {
          that.deleteConnectsOnLine(v.ConnectionId);
        }
      });
    },
    //删除单条连接线
    deleteConnectsOnLine(editLineId){
      let that=this;
      let delConnection={};
      let lineId = editLineId || that.editLine.id;

      //删除记录
      that.compositeServiceWords.combination_data_config.connects.forEach(
        function(v, i) {
          if (lineId == v.ConnectionId) {
            delConnection=Object.assign({},v);
            that.compositeServiceWords.combination_data_config.connects.splice(i, 1);
          }
        }
      );

      //修改DOM节点上保存的参数关联状态
      if($("#"+delConnection.PageTargetId)[0]){
        let paramList=that.getParamListByID(delConnection.PageTargetId);
        delConnection.param.target.forEach(function(v,i){
          paramList.forEach(function(o,j){
            if(o.service_type.toString()==delConnection.serverType){
              o.params.forEach(function(m,n){
                if(v.param_name==m.name){
                  m.isBind=false;
                }
              })
            }
          });
        });
        that.saveParamListByID(delConnection.PageTargetId,paramList);

        //如果目标节点已经是孤立点，清除已选服务类型
        if(that.checkIsland(delConnection.PageTargetId)){
          that.saveServerTypeSelectedByID(delConnection.PageTargetId,'');
        }
        //如果目标节点不是孤立点，校验服务参数是否饱和
        else{
          that.checkSaturation(delConnection.PageTargetId,true);
        }
      }
    },
    //从dom获取节点的服务名称
    getServerNameByID(id){
      return $("#"+id).attr('servicename');
    },
    //从dom获取节点的服务类型列表
    getServerTypeByID(id){
      return JSON.parse($("#"+id).attr('servicetype'));
    },
    //从dom获取节点的参数列表
    getParamListByID(id){
      return JSON.parse($("#"+id).attr('params'));
    },
    //保存节点的参数列表至dom
    saveParamListByID(id,paramList){
      $("#"+id).attr('params',JSON.stringify(paramList));
    },
    //从dom获取节点选中的服务类型
    getServerTypeSelectedByID(id){
      return $("#"+id).attr('servicetypeselected');
    },
    //保存节点选中的服务类型至dom
    saveServerTypeSelectedByID(id,servicetype){
      $("#"+id).attr('servicetypeselected',servicetype);
    },
    //遍历DOM获取当前所有节点信息
    getNodeList() {
      let blocks = [];
      $(".nodeDiv").each(function() {
        let elem = $(this);
        blocks.push({
          BlockId: elem.attr("id"),
          BlockParams:elem.attr('params'),
          BlockServiceType:elem.attr('servicetype'),
          BlockServiceTypeSelected:elem.attr('servicetypeselected'),
          BlockContent: elem.attr('servicename'),
          BlockX: parseInt(elem.css("left"), 10),
          BlockY: parseInt(elem.css("top"), 10),
          BlockWidth: parseInt(elem.css("width"), 10),
          BlockHeight: parseInt(elem.css("height"), 10),
        });
      });
      return blocks;
    },
    /**
      * 获取起始、结束、全部节点id
      * type：['source','target','all']
      * result：{source:[],target:[],all:[]}
    */
    getNodesIdList(type,lines,points){
      let that=this;
      let connects=lines || that.compositeServiceWords.combination_data_config.connects;
      let nodes=points||that.getNodeList();
      let idList={source:[],target:[],all:[]};
      let result={};

      connects.forEach(function(v,i){
        if($.inArray(v.PageSourceId, idList.source)==-1){
          idList.source.push(v.PageSourceId);
        }
        if($.inArray(v.PageTargetId, idList.target)==-1){
          idList.target.push(v.PageTargetId);
        }
      });

      nodes.forEach(function(v,i){
        idList.all.push(v.BlockId);
      });

      type.forEach(function(v,i){
        result[v]=idList[v];
      });
      return result;
    },
    //获取孤立点id
    getIslands(){
      let that=this;
      let idList=that.getNodesIdList(['all']).all;
      let source=that.getNodesIdList(['source']).source;
      let target=that.getNodesIdList(['target']).target;
      let islands=[];
      idList.forEach(function(v,i){
        if($.inArray(v, source)==-1 && $.inArray(v, target)==-1){
          islands.push(v);
        }
      });
      return islands;
    },
    //获取服务来源文字
    getSourceType: function(str) {
      let list = [
        { label: "企业服务", value: "ENTERPRISE" },
        { label: "平台服务", value: "PLATFORM" },
        { label: "第三方服务", value: "THIRDPART" },
        { label: "个人服务", value: "PERSONAL"}
      ];
      let sourceType = '';
      list.forEach(function(v, i) {
        if (str == v.value) {
          sourceType = v.label;
          return;
        }
      });
      return sourceType;
    },
    //时间格式转换
    formateTime:function(time){
      return commonFunc.formatDate(time,'yyyy-MM-dd');
    },
    //转换服务归属
    getBelonging:function(item){
      switch(item.belong_type){
        case 'ENTERPRISE':
          return item.enterpriseName;
          break;
        case 'PLATFORM':
          return '平台';
          break;
        case 'PERSONAL':
          return item.userName;
          break;
      }
    }
  }
};
</script>
<style src="../../css/common/public.css" scoped></style>
<style src="../../css/createCombinationServeice/compositeService.css" scoped></style>
<style>
/* 复写element样式生效必要条件：1、必须写在vue页面里；2、不能加“scoped”；3、前面需要私有类名限制 */
.compositeService-el .el-collapse-item__content {
    padding: 0;
}
.compositeService-el .el-collapse-item__content>div {
    padding: 6px 10px;
}
.compositeService-el .draggable:nth-child(2n-1){
    background:#F3F7FD;
}
.compositeService-el .draggable:nth-child(2n-1):hover,.compositeService-el .draggable:nth-child(2n):hover{
    background:#b8dafd;
}
.compositeService-el .buttnet{
  padding-bottom:0;
}
.compositeService-el .nodeDiv {
  border: 1px #d5d5d5 solid;
  /* width:100px;
  height:100px; */
  padding:8px 10px;
  position: absolute;
  left: 40%;
  top: 50px;
  border-radius: 0;
  background: rgb(255, 255, 255) !important;
  -webkit-box-shadow: 1px 1px 2px #ccc;
  -moz-box-shadow:1px 1px 2px #ccc;
  box-shadow:1px 1px 2px #ccc;
  cursor: pointer;
}
.compositeService-el .nodeDiv .icon-guanbi {
  position: absolute;
  top:-7px;
  right:-5px;
  width:14px;
  height: 14px;
  line-height: 14px !important;
  text-align: center;
  border-radius: 50%;
  background:#d9435c;
  font-size: 12px;
  color:#fff;
  /* font-weight: bold; */
  font-family: '微软雅黑';
  cursor: pointer;
  display:none;
}
.compositeService-el .nodeDiv:hover .icon-guanbi {
  display:block;
}
.compositeService-el .configSpan .icon-guanbi {
  position: absolute;
  top:-7px;
  right:-5px;
  width:18px;
  height: 18px;
  line-height: 18px !important;
  text-align: center;
  border-radius: 7px;
  background:#d9435c;
  font-size: 12px;
  color:#fff;
  /* font-weight: bold; */
  font-family: '微软雅黑';
  cursor: pointer;
  transform: scale(0.6,0.6);
}
.compositeService-el .nodeDiv .serverImg {
  width: 42px;
  height: 42px;
  margin:0 auto 5px auto;
  border-radius: 3px;
  border: 1px #d3d3d3 solid;
}
.compositeService-el .nodeDiv .serverImg>img {
  width: 100%;
  height: 100%;
}
.compositeService-el .nodeDiv .serverName {
  width:100%;
  height: auto;
  text-align: center;
  font-weight: normal;
  font-size: 12px;
}
</style>

