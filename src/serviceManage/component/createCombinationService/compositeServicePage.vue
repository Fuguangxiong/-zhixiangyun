<template>
	<div class="boxService" id='compositeServicePage'>
		<!-- 导航 -->
		<div class="rightfix">
			<ul><li v-for="(item,index) in blocks" :class="item.status">{{item.name}}<b v-show='item.isRequired && item.status!="tree"'>*</b></li></ul>
		</div>

		<!-- 面包屑 -->
		<div class="tattop">服务管理 · 新建服务 · 创建组合服务</div>

		<div v-for="(item,index) in blocks" class="comcm " :class="{active:item.isOpen}">
			<div class="thade " @click="upSadt(index)">
				<span class="thade-cloe">
					<i class="icon iconfont" :class="item.icon"></i>
					<em>{{item.name}} <b v-show='item.isRequired'>*</b></em>
				</span>
				<span class="upcnl">
					<em class="bianji" 
              v-show="item.status=='tree'" 
              @click.stop="onEdit(index)">
						<i class="icon iconfont icon-bianji2"></i>
					</em>
					<em class="upjit">
						<i class="icon iconfont icon-arrow-down-copy"></i>
					</em>
				</span>
			</div>

			<!-- 基础信息 -->
			<set-basic-info v-if='index==0' @submit='submit0' :msg='item.data' :serviceId='id' :isEdit='item.isEditShow'></set-basic-info>
			<!-- 图片配置 -->
			<set-image v-if='index==1' @submit='submit' :msg='item.data' :serviceId='id' :isEdit='item.isEditShow'></set-image>
			<!-- 拓扑搭建 -->
			<show-topology v-if='index==2' @edit='onEdit(index)' :msg='item.data' :serviceId='id' :isRefresh='item.isRefresh'></show-topology>
			<!-- 页面布局 -->
			<show-layout v-if='index==3' @edit='onEdit(index)' :msg='item.data' :serviceId='id' :isRefresh='item.isRefresh'></show-layout>
			<!-- 可见性设置 -->
			<set-usable-rule v-if='index==4' @submit='submit' :msg='item.data' type='1' :serviceId='id' :isEdit='item.isEditShow'></set-usable-rule>
			<!-- 屏蔽性设置 -->
			<set-usable-rule v-if='index==5' @submit='submit' :msg='item.data' type='2' :serviceId='id' :isEdit='item.isEditShow'></set-usable-rule>
			<!-- 计费方案 -->
			<set-scheme-rule v-if='index==6' @submit='submit' :msg='item.data' :serviceId='id' :isEdit='item.isEditShow'></set-scheme-rule>

		</div>

		<!-- 拓扑图组件 -->
		<div id='flowChart' class="slide-in-page" v-show='blocks[2].isEditShow'>
			<set-topology :service-id='id' :is-show='blocks[2].isEditShow' :is-page-over='blocks[2].isPageOver' @submit='submit'></set-topology>
		</div>

		<!-- 页面配置组件 -->
		<div id='page' class="slide-in-page" v-show='blocks[3].isEditShow'>
			<set-layout :service-id='id' :is-show='blocks[3].isEditShow' :name='blocks[0].data.service_name' :msg='blocks[3].data' @submit='submit'></set-layout>
		</div>

		<!-- 底部 -->
		<div class="apply-actions-com">
			<div>
				<b>创建组合服务：</b>
				<span>是根据具体业务的需要，对已有的原子服务进行拼接，打通服务之间的数据与调用顺序，通过对服务进行接口、参数的关联及页面样式修改，快速组合形成新的服务，针对性的满足个性化的业务需求。组合服务可作为单一服务被外部调用。</span>
			</div>
			<button class="apply-btn back" @click='onView'>测试</button>
			<button class="apply-btn back" @click='onBack'>返回</button>
			<button class="apply-btn submit" @click='submitAll'>提交审核</button>
		</div>
	</div>
</template>
<script>
import $ from 'jquery'
import apiClient from '../../../publicJs/ApiClient.js'
import userService from '../../../publicJs/userService'
import TipBoxService from '../common/TipBoxService.js'
import LoadingBoxService from '../../../publicJs/LoadingBoxService.js'
import commonFunc from '../common/commonFunc.js'
import setBasicInfo from './setBasicInfo.vue'
import setImage from './setImage.vue'
import setTopology from './setTopology.vue'
import showTopology from './showTopology.vue'
import setLayout from './setLayout.vue'
import showLayout from './showLayout.vue'
import setUsableRule from './setUsableRule.vue'
import setSchemeRule from './setSchemeRule.vue'
export default {
  name: 'compositeServicePage',
  components: {
    setBasicInfo, // 基础信息组件
    setImage, // 图片上传组件
    setTopology, // 拓扑搭建
    showTopology, // 拓扑回显
    setLayout, // 页面布局
    showLayout, // 页面布局回显
    setUsableRule, // 可见性，屏蔽性设置
    setSchemeRule // 计费方案
  },
  watch: {
    // 控制页面初加载时获取后台数据的loading效果消失
    isLoading: function (nv, ov) {
      if (nv === 3) {
        LoadingBoxService.close()
        this.initMenu()
        this.isLoading++
      }
    }
  },
  data () {
    return {
      source_type: this.$route.query.source_type, // 从哪个列表跳转过来
      login_type: userService.getInfo('logintype'), // 登录身份
      login_type_text:
        commonFunc.getBelongType(userService.getInfo('logintype')) + '服务',
      isLoading: 0, // 等于3时，获取后台数据的loading效果消失
      url: {
        getAllData: 'itsmApi/combination/findCombinationService', // 获取除可见性、屏蔽性数据
        getUsableData: 'itsmApi/outterVisible/outters', // 获取可见性、屏蔽性数据
        submit: 'itsmApi/createService/operateCombinationService', // 提交审核
        saveUsable: 'itsmApi/outterVisible/addOutter'
      },
      id: this.$route.query.id || '', // 服务id
      blocks: [
        {
          name: '基本信息',
          isRequired: true,
          icon: 'icon-jichuxinxiguanli-copy',
          status: 'stant', // tree：完成；stant：正在操作；initial：未编辑；
          isOpen: true,
          isEditShow: true,
          data: {}
        },
        {
          name: '图片配置',
          isRequired: true,
          icon: 'icon-tupian2',
          status: '',
          isOpen: false,
          isEditShow: null,
          data: {}
        },
        {
          name: '拓扑搭建',
          isRequired: true,
          icon: 'icon-yuanxingtuopu',
          status: '',
          isOpen: false,
          isEditShow: false,
          isRefresh: 0,
          isPageOver: false,
          data: {}
        },
        {
          name: '页面布局',
          isRequired: true,
          icon: 'icon-buju',
          status: '',
          isOpen: false,
          isEditShow: false,
          isRefresh: 0,
          data: {}
        },
        {
          name: '可见性设置',
          icon: 'icon-kejian1',
          status: '',
          isOpen: false,
          isEditShow: null,
          data: {}
        },
        {
          name: '屏蔽性设置',
          icon: 'icon-pingbi',
          status: '',
          isOpen: false,
          isEditShow: null,
          data: {}
        },
        {
          name: '计费方案',
          icon: 'icon-mianfeishejibaojiafangan',
          status: '',
          isOpen: false,
          isEditShow: null,
          data: {}
        }
      ]
    }
  },
  created () {
    if (this.checkNull(this.id)) {
      LoadingBoxService.open('正在获取数据，请稍候...')
      this.getData()
      this.getUsableData()
    }
  },
  mounted () {
    this.initUI()
  },
  methods: {
    // 刷新页面时左侧菜单控制
    initMenu () {
      let vm = this
      let menu = ''
      if (vm.source_type === '1') {
        menu = '企业服务'
      } else if (vm.source_type === '5') {
        menu = '我的注册'
      } else if (vm.source_type === '2') {
        menu = '平台服务'
      }
      vm.$parent.$parent.setActive('服务管理', menu)
      vm.$parent.$parent.leftDataChange++
    },
    // 初始化样式
    initUI () {
      let vm = this
      $('.apply-actions-com').css({ width: vm.getControllerWidth() + 'px' })
      if (window.iscEvent) {
        window.iscEvent.on('menuchange', function () {
          let targetW = vm.getControllerWidth()
          $('.apply-actions-com').animate({ width: targetW + 'px' }, 500)
        })
      }
      for (let i = 1; i < vm.blocks.length; i++) {
        $('.formaCon')
          .eq(i)
          .slideUp(10)
      }
    },
    // 获取下方操作按钮工具条宽度
    getControllerWidth () {
      let targetW = 0
      if ($('body').hasClass('bigSreen') && !$('body').hasClass('bigSreen2')) {
        targetW = $(window).width() - 58
      } else {
        targetW = $(window).width() - 208
      }
      return targetW
    },
    // 获取数据
    getData () {
      let vm = this

      apiClient.post(vm.url.getAllData, { id: this.id }, function (data) {
        let dataList = data.results.data
        vm.isLoading++
        console.log('已保存信息', dataList)
        // 基本信息
        if (dataList.name !== undefined && dataList.name !== '') {
          vm.blocks.forEach((v, i) => {
            if (v.status !== 'tree' && i !== 3) {
              v.status = 'initial'
            }
          })
          console.log('基本信息数据over')
          vm.blocks[0].data.service_name = dataList.name
          vm.blocks[0].data.service_tag = dataList.service_tag
          vm.blocks[0].data.startTime = commonFunc.formatDate(
            dataList.service_start_time,
            'yyyy-MM-dd'
          )
          vm.blocks[0].data.endTime = commonFunc.formatDate(
            dataList.service_end_time,
            'yyyy-MM-dd'
          )
          vm.blocks[0].data.service_brief = dataList.service_brief
          vm.blocks[0].data.service_remark = dataList.service_remark
          vm.onEditOver(0)
        }

        // 图片配置
        if (dataList.img) {
          console.log('图片配置over')
          vm.blocks[1].data.img = dataList.img // logo
          vm.blocks[1].data.bg_img = dataList.bg_img // 背景图片
          vm.onEditOver(1)
        }

        // 拓扑图
        if (
          dataList.combination_data_config &&
          dataList.combination_data_config.block
        ) {
          console.log('拓扑图over')
          let config = dataList.combination_data_config
          config.block = JSON.parse(config.block)
          config.connects = JSON.parse(config.connects)
          vm.blocks[2].data.combination_data_config = config
          vm.blocks[2].isRefresh++
          vm.onEditOver(2)
          vm.blocks[3].status = 'initial'
        }

        // 页面布局
        if (
          dataList.combination_page_config &&
          dataList.combination_page_config.areas
        ) {
          console.log('页面布局over')
          vm.blocks[2].isPageOver = true
          let config = dataList.combination_page_config
          config.areas = JSON.parse(config.areas)
          vm.blocks[3].data.combination_page_config = config
          vm.blocks[3].isRefresh++
          vm.onEditOver(3)
        }

        // 计费方案
        if (dataList.bill_rules && dataList.bill_rules.length) {
          console.log('计费方案')
          dataList.bill_rules.forEach(function (v, k) {
            v.feeInfo.forEach(function (z, t) {
              z.expiry_end_date = vm.formatDuring(parseInt(z.expiry_end_date), 'yyyy-MM-dd')
              z.expiry_start_date = vm.formatDuring(parseInt(z.expiry_start_date), 'yyyy-MM-dd')
              z.created_time = vm.formatDuring(parseInt(z.created_time), 'yyyy-MM-dd')
            })
          })
          vm.blocks[6].data = dataList.bill_rules
          vm.onEditOver(6)
        }
      })
    },
    formatDuring (time, format) {
      var t = new Date(time)
      var tf = function (i) {
        return (i < 10 ? '0' : '') + i
      }
      return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function (a) {
        switch (a) {
        case 'yyyy':
          return tf(t.getFullYear())
          break
        case 'MM':
          return tf(t.getMonth() + 1)
          break
        case 'mm':
          return tf(t.getMinutes())
          break
        case 'dd':
          return tf(t.getDate())
          break
        case 'HH':
          return tf(t.getHours())
          break
        case 'ss':
          return tf(t.getSeconds())
          break
        }
      })
    },
    // 获取可见&&屏蔽范围
    getUsableData () {
      let vm = this
      let myData1 = {
        dataId: vm.id,
        visibility_type: '1', // 1可见2屏蔽
        visibility_set_catagory: '2' // 1方案2服务
      }
      let myData2 = {
        dataId: vm.id,
        visibility_type: '2', // 1可见2屏蔽
        visibility_set_catagory: '2' // 1方案2服务
      }
      apiClient.post(vm.url.getUsableData, myData1, function (data) {
        vm.isLoading++
        if (data.results.visibilityLevel.length) {
          vm.blocks[4].data = data.results
          console.log('可见', data)
          vm.onEditOver(4)
        }
      })
      apiClient.post(vm.url.getUsableData, myData2, function (data) {
        vm.isLoading++
        if (data.results.visibilityLevel.length) {
          vm.blocks[5].data = data.results
          console.log('屏蔽', data)
          vm.onEditOver(5)
        }
      })
    },
    // 编辑
    onEdit (index) {
      let vm = this
      vm.blocks[index].isEditShow = true
      if (index !== 2 && index !== 3) {
        vm.blocks[index].status = 'stant'
      }
      vm.onOpenBlock(index)
      switch (index) {
      case 2:
        vm.onOpenSlidePage('flowChart')
        break
      case 3:
        vm.onOpenSlidePage('page')
        break
      }
    },
    // 点击手风琴
    upSadt (index) {
      let isEdit = true
      let editList = [1, 4, 5, 6]

      this.blocks.forEach(function (v, i) {
        if (v.status === 'stant') {
          isEdit = false
        }
      })
      if (isEdit || this.blocks[index].status === 'tree') {
        if (this.blocks[index].status !== 'tree') {
          if (index === 3 && this.blocks[2].status !== 'tree') {
            return
          }
          this.blocks[index].status !== 'stant' ? 'stant' : 'initial'
          this.onOpenBlock(index)
          if (editList.includes(index)) {
            this.onEdit(index)
          }
        } else {
          if (this.blocks[index].isOpen) {
            this.onCloseBlock(index)
          } else {
            this.onOpenBlock(index)
          }
        }
      }
    },
    /** ************************ 保存 & 返回 & 提交审核 ***************************/
    // 基本信息--保存flag为true,取消flag为false
    submit0 (flag, item, isNew, id) {
      this.onEditOver(0)
      if (flag) {
        this.blocks[0].data = item
        if (isNew) {
          this.id = id
          this.$router.push({
            name: 'compositeServicePage',
            query: { source_type: this.source_type, id: id }
          })
          this.getData()
        }
      }
    },
    // 其他模块--保存flag为true,取消flag为false
    submit (flag, index, item) {
      if (index === 2) {
        this.onCloseSlidePage('flowChart')
      }
      if (index === 3) {
        this.onCloseSlidePage('page')
      }
      // 保存
      if (flag && item) {
        this.blocks[index].data = item
        if (index === 6 && item.length === 0) {
          this.blocks[index].status = 'initial'
          this.blocks[index].isEditShow = false
          this.onCloseBlock(index)
        } else {
          this.onEditOver(index)
        }
        if (index === 2) {
          this.blocks[index].isRefresh++ // 拓扑图编辑后刷新
          this.blocks[2].isPageOver = false
          this.blocks[3].isEditShow = false
          this.blocks[3].status = 'initial'
          this.blocks[3].data = {}
          this.blocks[3].isRefresh++
          this.onCloseBlock(3)
        }
        if (index === 3) {
          this.blocks[index].isRefresh++ // 页面布局编辑后刷新
          this.blocks[2].isPageOver = true
        }
      } else {
        // 取消
        if (index > 3 && !this.checkNull(this.blocks[index].data)) {
          this.blocks[index].status = 'initial'
          this.blocks[index].isEditShow = false
          this.onCloseBlock(index)
        } else if (this.checkNull(this.blocks[index].data)) {
          this.onEditOver(index)
        } else if (index === 2 || index === 3) {
          this.blocks[index].isEditShow = null
        }
      }
    },
    // 提交审核
    submitAll () {
      let vm = this
      let flag = vm.checkRequired()
      if (flag.flagRequired) {
        let myData = {
          id: vm.id,
          operate_page: '6'
        }
        if (flag.flagNotRequired) {
          vm.submitAllAction(myData)
        } else {
          vm.$confirm(flag.flagNotRequiredTip + '尚未完成设置，是否确定提交？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            if (vm.blocks[4].status !== 'tree') {
              vm.onSaveUsable()
            }
            vm.submitAllAction(myData)
          })
        }
      } else {
        TipBoxService.open(flag.flagRequiredTip + '信息未填写完整，当前无法提交审核！', 1)
      }
    },
    onSaveUsable () {
      let vm = this
      let myData = {
        data_id: vm.id,
        visibility_level: '1',
        visibility_type: '1',
        visibility_set_catagory: '2',
        user_ids: [],
        enterprise_ids: []
      }
      apiClient.post(vm.url.saveUsable, myData, function (data) {
        if (data.status === 200) {
        } else {
          TipBoxService.open(data.exception, 1)
        }
      })
    },
    submitAllAction (myData) {
      let vm = this
      LoadingBoxService.open('正在提交，请稍候...')
      apiClient.post(vm.url.submit, myData, function (data) {
        LoadingBoxService.close()
        if (data.status === 200) {
          TipBoxService.open('提交成功!')
          vm.onBack()
        } else {
          TipBoxService.open(data.exception, 1)
        }
      })
    },
    // 返回
    onBack () {
      if (this.source_type === '1') {
        this.$router.push('/enterprise')
      } else if (this.source_type === '5') {
        this.$router.push('/registered')
      } else if (this.source_type === '2') {
        this.$router.push('/platformService')
      }
    },
    // 测试
    onView () {
      let vm = this
      let flag = vm.checkRequired()
      if (flag.flagRequired) {
        window.open('#/invoke?previewTag=1&id=' + this.id, '_blank')
      } else {
        TipBoxService.open(flag.flagRequiredTip + '信息未填写完整，当前无法测试！', 1)
      }
    },
    /** *********************** 公共方法 ****************************/
    // 转为编辑完成状态
    onEditOver (index) {
      this.blocks[index].status = 'tree'
      this.blocks[index].isEditShow = false
      if (!this.blocks[index].isOpen || index === 0) {
        this.onOpenBlock(index)
      }
    },
    // 打开模块
    onOpenBlock (index) {
      this.blocks[index].isOpen = true
      $('.formaCon')
        .eq(index)
        .slideDown() // 展开
    },
    // 关闭模块
    onCloseBlock (index) {
      this.blocks[index].isOpen = false
      $('.formaCon')
        .eq(index)
        .slideUp()
    },
    // 打开滑出页面
    onOpenSlidePage (id) {
      let winW = $(window).width()
      let winH = $(window).height()
      $('#' + id)
        .width(winW - 50)
        .height(winH - 50)
      $('#' + id).animate({ right: '0' }, 500)
    },
    // 关闭滑出页面
    onCloseSlidePage (id) {
      $('#' + id).animate({ right: '-3000px' }, 800)
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
    // 校验必填信息是否填写完整
    checkRequired () {
      let vm = this
      let flag = {
        flagRequired: true,
        flagRequiredTip: '',
        flagNotRequired: true,
        flagNotRequiredTip: ''
      }
      vm.blocks.forEach(function (v, i) {
        if (v.status !== 'tree') {
          if (i < 4) {
            flag.flagRequired = false // 前4项必填
            flag.flagRequiredTip += '“' + v.name + '”' + '，'
          } else {
            flag.flagNotRequiredTip += '“' + v.name + '”' + '，'
            flag.flagNotRequired = false // 后三项选择设置
          }
        }
      })
      if (flag.flagRequiredTip.length) {
        flag.flagRequiredTip = flag.flagRequiredTip.substring(0, flag.flagRequiredTip.length - 1)
      }
      if (flag.flagNotRequiredTip.length) {
        flag.flagNotRequiredTip = flag.flagNotRequiredTip.substring(0, flag.flagNotRequiredTip.length - 1)
      }
      return flag
    }
  }
}
</script>
<style src="../../css/createCombinationServeice/newComStyle.css" scoped></style>
<style scoped>
.boxService .slide-in-page {
  position: fixed;
  width: 100%;
  top: 52px;
  right: -3000px;
  z-index: 109;
  background: #fff;
  /* right: 0; */
}
</style>
<style>
#compositeServicePage .el-form-item__label {
  font-size: 12px;
}
#compositeServicePage .el-input__inner {
  font-size: 12px;
}
#compositeServicePage .boxService .is-error .txet-ts {
  color: red;
}
#compositeServicePage .boxService .el-input__icon + .el-input__inner {
  width: auto;
  padding-right: 12px;
}
#compositeServicePage .boxService .el-date-editor.el-input {
  width: 163px !important;
}
#compositeServicePage .el-form-item__error {
  display: none;
}
</style>
