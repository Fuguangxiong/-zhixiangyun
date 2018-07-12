<template>
	<div class="formaCon domeheig">
		<div id="containerBox" >
			<div class="msgBox">
					<ul class="msgBox-output">
						<li>
							<span class="flog"></span>
							<span class="text">输出参数</span>
						</li>
						<li v-for="(item,index) in param.src" :key='index'>
							<span class="msgBox-output-text">{{item.param_tag}}</span>
						</li>
					</ul>
					<ul class="msgBox-input clears">
						<li>
							<span class="flog"></span>
							<span class="text">输入参数</span>
						</li>
						<li v-for="(item,index) in param.target" :key='index'>
							<span class="msgBox-input-text">{{item.param_tag}}</span>
						</li>
					</ul>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import apiClient from '../../../publicJs/ApiClient.js'
import jsPlumb from '../../lib/jsPlumb-2.2.8.js'
export default {
  props: {
    msg: '',
    serviceId: {}
  },

  data () {
    return {
      apiBaseUrl: apiClient.apiBaseUrl,
      isNew: true,
      id: '',
      data_config: '',
      instance1: {},
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
      param: {}
    }
  },
  watch: {
    msg: function (val, old) {
      this.init()
      this.data_config = Object.assign({}, val.combinationDataConfig)
      this.onDraw()
    }
  },

  methods: {
    // 打开编辑页面
    onEdit () {
      this.$emit('edit', 'flowChart')
    },
    // 删除节点和连线
    initParams () {
      let that = this
      $('.nodeDiv1 .fc-serverName').each(function () {
        let node = $(this).parent()
        let nodeId = node.attr('id')
        that.instance1.removeAllEndpoints(nodeId) // 删除节点的所有连接线
        node.remove() // 删除节点DOM
      })
    },
    // 初始化
    init () {
      $('#containerBox').html('')
      this.instance1 = jsPlumb.getInstance({
        DragOptions: { cursor: 'pointer', zIndex: 2000 },
        ConnectionOverlays: [
          [
            'Arrow',
            {
              location: 1,
              visible: true,
              width: 11,
              length: 11,
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
        Container: 'containerBox'
      })
      this.instance1.importDefaults({
        ConnectionsDetachable: true,
        ReattachConnections: true
      })
      this.bindDomEvent()
    },
    // 添加事件
    bindDomEvent () {
      let that = this
      this.instance1.bind('click', function (conn, originalEvent) {
        originalEvent.stopPropagation()
        that.getParams(conn)
        $('.msgBox').css({
          'left': originalEvent.clientX + 15 + 'px',
          'top': originalEvent.clientY - 30 + 'px',
          'display': 'block'
        })
        $(document).click(function (event) {
          $('.msgBox').css('display', 'none')
        })
        $('.publicRightBottomContentContainer').scroll(function () {
          $('.msgBox').css('display', 'none')
        })
      })
    },
    // 根据数据绘制拓扑图
    onDraw () {
      let that = this
      let config = that.data_config
      let block = JSON.parse(config.block)
      for (let i = 0; i < block.length; i++) {
        let node = block[i]
        this.creatNodeDom(node)
      }
      let connects = JSON.parse(config.connects)
      for (let i = 0; i < connects.length; i++) {
        console.log('this.instance1', connects[i])
        this.instance1.connect(
          {
            id: connects[i].ConnectionId,
            source: connects[i].PageSourceId + '_show',
            target: connects[i].PageTargetId + '_show',
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
          }
        )
      }
    },
    // 添加节点的dom元素
    creatNodeDom (node) {
      let that = this
      let src = node.BlockImg == 'logo-sm-default.jpg' ? '../../images/logo-sm-default.jpg' : that.apiBaseUrl + '/itsmApi/attachment/show?imgPath=' + node.BlockImg
      node.BlockId = node.BlockId + '_show'
      let html =
        '<div id=\'' +
        node.BlockId +
        '\' class=\'nodeDiv1\'>' +
        '<img src=\'' + src + '\' alt=\'\' />' +
        '<span class=\'fc-serverName\' title=\'' +
        node.BlockContent +
        '\'>' +
        node.BlockContent +
        '</span></div>'
      $('#containerBox').append(html)

      node.BlockWidth = node.BlockWidth || 'auto'
      node.BlockHeight = node.height ? node.BlockHeight : 'auto'
      $('#' + node.BlockId).css({
        position: 'absolute',
        left: node.BlockX + 'px',
        top: node.BlockY + 'px',
        width: node.BlockWidth,
        height: node.BlockHeight
      })
    },
    // 根据线的id查找线的信息
    getParams (conn) {
      let that = this
      let config = that.data_config
      let connects = JSON.parse(config.connects)
      connects.forEach(function (v, i) {
        if (conn.id === v.ConnectionId) {
          that.param = v.param
        }
      })
    }
  }
}
</script>
<style scoped>
#containerBox {
  width: 100%;
  height:500px;
  position: relative;
}
.msgBox {
	position: fixed;
	display: none;
	width:220px;
  border: 1px solid #ddd;
  z-index: 9999;
  background: #fff;
}
.clears::after {
  margin: 0;
  content: "";
  display: block;
	clear: both;
	height:0;
}
.msgBox-output {
	float: left;
	width:50%;
	padding:5px 5px 10px 10px;
}
.msgBox-output>li{
	margin:8px 0;
}
.msgBox-output .flog {
  display: inline-block;
  width: 18px;
  height: 9px;
  background: #4fa7ff;
  border: 1px solid #8896b3;
  margin-right: 6px;
}
.msgBox-input {
  float: right;
	width:50%;
	padding:5px 10px 10px 5px;
}
.msgBox-input>li{
	margin:8px 0;
}
.msgBox-input .flog {
  display: inline-block;
  width: 18px;
  height: 9px;
  background: #ff8e48;
  border: 1px solid #8896b3;
  margin-right: 6px;
}
.msgBox-input-text {
	display:inline-block;
  color: #789ec5;
  border: 1px solid #789ec5;
	padding: 2px 4px;
	max-width:100%;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.msgBox-output-text {
	display:inline-block;
  color: #d1a28e;
  border: 1px solid #d1a28e;
  padding: 2px 4px;
	max-width:100%;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

/* 新建提示信息 */
.contentBox {
  padding: 20px 0;
}
.contentBox::after {
  content: '';
  display: block;
  clear: both;
}
.leftBox {
  cursor: pointer;
  z-index: 2;
  width: 102px;
  height: 72px;
  border: 1px #cccccc solid;
  border-radius: 3px;
  position: relative;
  float: left;
  background: url(../../images/addimglog.png) center 10px no-repeat;
}
.ltext {
  position: absolute;
  width: 100%;
  height: 22px;
  background-color: #f9f9f9;
  bottom: 0;
  text-align: center;
  line-height: 22px;
  left: 0;
  color: #666;
}
.rightBox {
  position: relative;
}
.rightBox p {
  padding-left: 120px;
  color: #333;
  font-size: 12px;
  line-height: 22px;
}
.mgsText {
  position: absolute;
  top: 2px;
  left: 104px;
  color: red;
}
</style>
<style>
#containerBox .nodeDiv1 {
  border: 1px #ccc solid;
  position: absolute;
  left: 40%;
  top: 50px;
  border-radius: 2px;
  background: #fff !important;
}
#containerBox .nodeDiv1:hover {
  border: 1px solid #55a8fd;
}
#containerBox .nodeDiv1 .fc-serverName {
  display: inline-block;
  padding: 5px 10px 5px 5px;
  font-weight: normal;
  font-size: 12px;
  white-space: nowrap;
  vertical-align: middle;
}
#containerBox .nodeDiv1 > img {
  width: 14px;
  height: 14px;
  vertical-align: middle;
  margin-left: 10px;
}
.color-red{
    color: #fa405c;
}


.basics-time{
    margin-top: 18px;
}
.formaCon{
    width: 710px;
    margin: 0 auto;
   
    overflow: hidden;
    font-size: 12px;
}
.formaCon.showBlck {
    display: block
}
/**服务页面需要以上样式   end **/

.publicRightBottomContentContainer {
  overflow-y: auto;
  /* padding: 0 5px; */
}
</style>
