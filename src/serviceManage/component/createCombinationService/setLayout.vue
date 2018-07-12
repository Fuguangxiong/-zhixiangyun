<template>
  <div class="set-layout" id="setLayout">
    <!-- 服务列表 -->
    <div class="layout-left">
      <h2>已选原子服务</h2>
      <div class="layout-left-list">
        <ul id='setLayoutServiceList'>
          <li v-for="(service,index) in serviceList" 
              :key='index'
              :id="service.BlockId"
              :data-img='service.BlockImg'
              :data-type='service.stype'
              class="draggable layout-service" 
              :title='service.BlockContent.trim()'>
            <img v-if='service.BlockImg=="logo-sm-default.jpg" || !service.BlockImg' src="../../images/logo-sm-default.jpg" />                    
            <img v-if='service.BlockImg!="logo-sm-default.jpg" && service.BlockImg' :src="apiBaseUrl +'/itsmApi/attachment/show?imgPath='+service.BlockImg" />                    
            {{service.BlockContent.trim()}}
          </li>
        </ul>
      </div>
    </div>

    <!-- 右侧 -->
    <div class="layout-right">
      <div class="layout-right-title">页面布局</div>

      <!-- start: 布局区域 -->
      <div class="layout-right-con" id='setLayoutAreaList'>
        <!-- 一栏 -->
        <div v-for="(area,index) in areaList" 
            :key='index' 
            :id='area.id+"_set_layout"'
            :data-index='index'
            class="layout-right-area">
          <input v-model='area.title' maxlength="20" placeholder="请输入栏目名称" type='text' class='layout-right-area-title' />
          <i class='icon iconfont icon-shanchu' @click='onDeleteArea(index)'></i>

          <!-- start: 服务 -->
          <div v-for="(service,indexChild) in area.sevs" 
              :key="index+'_'+indexChild" 
              :id='service.sev_id+"_set_layout"'
              :data-indexChild='indexChild'
              class="layout-right-service"
              :style="'width:'+service.width || '48%'">
            <h5>{{service.sev_name}}</h5>
            <i class='icon iconfont icon-shanchu' @click='onDeleteService(index,indexChild)'></i>
            <div>
              <img v-if='service.sev_img=="logo-sm-default.jpg" || !service.sev_img' src="../../images/logo-sm-default.jpg" />                    
              <img v-if='service.sev_img!="logo-sm-default.jpg" && service.sev_img' :src="apiBaseUrl +'/itsmApi/attachment/show?imgPath='+service.sev_img" />                    
              <span>此区域展示内容为{{setTypeText(service.stype)}}</span>
            </div>
          </div>
          <!-- end: 服务 -->
        </div>
        <!-- end: 一栏 -->

        <div class="icon iconfont icon-weibiaoti2zhuanhuan layout-right-add" title='添加栏目' @click='onAddArea()'></div>
      </div>
      <!-- end: 布局区域 -->
      
      <!-- start: 步骤按钮 -->
      <div class="buttons">
        <h5>页面布局:</h5>
        <p>即服务拓扑搭建，是根据具体业务的需要，对已有的原子服务进行拼接，打通服务之间的数据与调用顺序，实现对原子服务的接口、参数进行关联。</p>
        <span class="back" @click="back()">返 回</span>
        <span class="save" @click="save('1')">保 存</span>
      </div>
      <!-- end: 步骤按钮 -->
    </div>
  </div>
</template>
<script>
import $ from 'jquery'
import apiClient from '../../../publicJs/ApiClient.js'
import TipBoxService from '../common/TipBoxService.js'
import LoadingBoxService from '../../../publicJs/LoadingBoxService.js'
export default {
  props: {
    isShow: false,
    serviceId: {},
    name: '',
    msg: {}
  },
  data () {
    return {
      apiBaseUrl: apiClient.apiBaseUrl,
      id: '',
      url: {
        serverList: 'itsmApi/combination/findCombinationBlocks',
        pageData: 'itsmApi/combination/findCombinationService',
        save: 'itsmApi/createService/operateCombinationService'
      },
      title: '',
      areaList: [],
      serviceList: [],
      serviceMaxWidth: 1000
    }
  },
  watch: {
    isShow (nv, ov) {
      if (nv) {
        this.id = this.serviceId
        this.title = this.name
        this.getServiceList()
        if (JSON.stringify(this.msg) !== '{}') {
          this.areaList = [...this.msg.combination_page_config.areas]
        } else {
          this.areaList = []
          this.serviceList = []
          this.onAddArea()
        }
      }
    }
  },
  updated () {
    this.bindUI()
  },
  methods: {
    // 绑定拖拽和Resizable事件
    bindUI () {
      let vm = this
      // 拖拽
      $('#setLayoutServiceList .layout-service').draggable({
        containment: $('#setLayout'),
        helper: 'clone',
        scope: 'layout',
        stop: function (event, ui) {
          if (!$('#setLayout .layout-right-area').size()) {
            TipBoxService.open('请先添加栏目！', 2)
          }
        }
      })
      $('#setLayoutAreaList .layout-right-area').droppable({
        scope: 'layout',
        drop: function (event, ui) {
          vm.onAddService($(ui.draggable), $(this))
        }
      })

      // resizable
      vm.serviceMaxWidth = $('#setLayout .layout-right-area').width() * 0.98
      $('#setLayout .layout-right-service').resizable({
        maxHeight: 100,
        minHeight: 100,
        maxWidth: vm.serviceMaxWidth,
        stop: function (event, ui) {
          // console.log($(this))
          // let index = $(this).parent().attr('data-index')
          // let indexChild = $(this).attr('data-indexChild')
          // let list = [...vm.areaList]
          // list[index].sevs[indexChild].width = Math.floor($(this).width() / $(this).parent().width() * 100) + '%'
          // vm.areaList = [...list]
          // console.log(list[index].sevs[indexChild].width, vm.areaList)
        }
      })
    },
    // 获取服务列表
    getServiceList () {
      let vm = this
      LoadingBoxService.open('正在获取服务列表,请稍等')
      apiClient.post(vm.url.serverList, { id: vm.id }, function (data) {
        LoadingBoxService.close()
        if (data.status === 200) {
          vm.serviceList = data.results.data
          console.log('服务列表', vm.serviceList)
        } else {
          TipBoxService.open(data.exception, 1)
        }
      })
    },
    // 添加栏目
    onAddArea () {
      let area = {
        id: this.newAreaID(),
        sevs: [],
        title: ''
      }
      this.areaList.push(area)
    },
    // 添加服务
    onAddService (item, selector) {
      let service = {
        pos_id: selector.attr('id'),
        sev_id: item.attr('id'),
        sev_name: item.attr('title'),
        sev_img: item.attr('data-img'),
        label: item.attr('title'),
        width: '48%',
        height: '120px',
        // mwidth: "98%",
        // mheight: "120px",
        // mleft:'',
        stype: item.attr('type')
      }
      this.areaList[selector.attr('data-index')].sevs.push(service)
    },
    // 删除栏目
    onDeleteArea (index) {
      let vm = this
      vm
        .$confirm('确定删除整个栏目？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          let list = [...vm.areaList]
          list.splice(index, 1)
          vm.areaList = [...list]
        })
    },
    // 删除服务
    onDeleteService (index, indexChild) {
      let vm = this
      vm
        .$confirm('确定删除该服务？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          let list = [...vm.areaList]
          list[index].sevs.splice(indexChild, 1)
          vm.areaList = [...list]
        })
    },
    // 保存
    save: function (operate_way) {
      let vm = this

      if ($('#setLayout .layout-right-service').size()) {
        let config = {
          areas: [...vm.areaList],
          title: vm.title
        }
        config.areas.forEach(function (v, i) {
          v.sevs.forEach(function (m, n) {
            let area = $('#setLayout .layout-right-area').eq(i)
            let serv = area.find('.layout-right-service').eq(n)
            m.width = Math.floor(serv.width() / area.width() * 100) + '%'
          })
        })
        // 保存到后台
        let saveData = {
          operate_way: operate_way,
          operate_page: '3',
          id: vm.id,
          combination_page_config: config
        }

        LoadingBoxService.open('正在保存,请稍候')
        apiClient.post(vm.url.save, saveData, function (data) {
          LoadingBoxService.close()
          if (data.status === 200) {
            TipBoxService.open('保存成功', 0)
            let item = {}
            item.combination_page_config = config
            vm.$emit('submit', true, 3, item)
          } else {
            TipBoxService.open(data.exception, 1)
          }
        })
      } else {
        TipBoxService.open('展示内容不可为空！', 1)
      }
    },
    // 返回
    back () {
      let vm = this
      vm.$confirm('是否确定放弃当前页面已有的操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        vm.areaList = []
        vm.$emit('submit', false, 3)
      })
    },
    // 转换服务展示内容文字
    setTypeText (str) {
      let text = str === '2' ? '一个网页' : '数据'
      return text
    },
    // 生成新栏目id
    newAreaID () {
      return Date.parse(new Date()) * 1000
    }
  }
}
</script>
<style>
#setLayout .ui-resizable {
  position: relative
}
#setLayout .ui-resizable-handle {
  position: absolute;
  font-size: .1px;
  display: block;
  -ms-touch-action: none;
  touch-action: none
}
#setLayout .ui-resizable-autohide .ui-resizable-handle, .ui-resizable-disabled .ui-resizable-handle {
  display: none
}
#setLayout .ui-resizable-n {
  cursor: n-resize;
  height: 7px;
  width: 100%;
  top: -5px;
  left: 0
}
#setLayout .ui-resizable-s {
  cursor: s-resize;
  height: 7px;
  width: 100%;
  bottom: -5px;
  left: 0
}
#setLayout .ui-resizable-e {
  cursor: e-resize;
  width: 7px;
  right: -5px;
  top: 0;
  height: 100%
}
#setLayout .ui-resizable-w {
  cursor: w-resize;
  width: 7px;
  left: -5px;
  top: 0;
  height: 100%
}
#setLayout .ui-resizable-se {
  cursor: se-resize;
  width: 12px;
  height: 12px;
  right: 1px;
  bottom: 1px
}
#setLayout .ui-resizable-sw {
  cursor: sw-resize;
  width: 9px;
  height: 9px;
  left: -5px;
  bottom: -5px
}
#setLayout .ui-resizable-nw {
  cursor: nw-resize;
  width: 9px;
  height: 9px;
  left: -5px;
  top: -5px
}
#setLayout .ui-resizable-ne {
  cursor: ne-resize;
  width: 9px;
  height: 9px;
  right: -5px;
  top: -5px
}
</style>
<style src="../../css/createCombinationServeice/jquery-ui.custom.min.css" scoped></style>
<style src="../../css/createCombinationServeice/setLayout.css" scoped></style>
