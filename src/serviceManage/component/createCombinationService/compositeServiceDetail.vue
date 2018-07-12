<template>
	<div class="boxService" id='compositeServiceDetail'>

		<!-- 面包屑 -->
		<div class="tattop">服务管理 · {{menu}} · 查看组合服务详情</div>

    <div class="intro">
      <!-- 信息 -->
      <div class="intro-message">
        <img v-if='intro.img!="logo-sm-default.jpg"' :src="apiBaseUrl +'/itsmApi/attachment/show?imgPath='+intro.img" alt="">
        <img v-if='intro.img=="logo-sm-default.jpg"' src="../../images/logo-sm-default.jpg" alt="">
        <ul>
          <li class="intro-message-name"><span>{{intro.name}}</span>（{{isModify=='1'?'变更中':intro.service_status_zh}}）</li>
          <li>标签：{{intro.service_tag}}</li>
          <li>类型：组合服务</li>
          <li>创建者：{{intro.true_name}}</li>
        </ul>
      </div>

      <!-- 统计 -->
      <table class="intro-statistics">
        <tr>
          <th>{{intro.visit_num}}</th>
          <th>{{intro.user_num}}</th>
          <th>{{intro.click_num}}</th>
        </tr>
        <tr>
          <td>调用次数</td>
          <td>累计用户量</td>
          <td>浏览量</td>
        </tr>
      </table>
    </div>

		<div v-show="checkNull(item.data)" v-for="(item,index) in blocks" class="comcm " :class="{active:item.isOpen}">
			<div class="thade " @click="upSadt(index)">
				<span class="thade-cloe">
					<i class="icon iconfont" :class="item.icon"></i>
					<em>{{item.name}}</em>
				</span>
				<span class="upcnl">
					<em class="upjit">
						<i class="icon iconfont icon-arrow-down-copy"></i>
					</em>
				</span>
			</div>

			<!-- 基础信息 -->
			<set-basic-info v-if='index==0' :msg='item.data' :serviceId='id' :isEdit='item.isEditShow'></set-basic-info>
			<!-- 图片配置 -->
			<set-image v-if='index==1' :msg='item.data' :serviceId='id' :isEdit='item.isEditShow'></set-image>
			<!-- 拓扑搭建 -->
			<show-topology v-if='index==2' :msg='item.data' :serviceId='id' :isRefresh='item.isRefresh'></show-topology>
			<!-- 页面布局 -->
			<show-layout v-if='index==3' :msg='item.data' :serviceId='id' :isRefresh='item.isRefresh'></show-layout>
			<!-- 可见性设置 -->
			<set-usable-rule v-if='index==4' :msg='item.data' type='1' :serviceId='id' :isEdit='item.isEditShow'></set-usable-rule>
			<!-- 屏蔽性设置 -->
			<set-usable-rule v-if='index==5' :msg='item.data' type='2' :serviceId='id' :isEdit='item.isEditShow'></set-usable-rule>
			<!-- 计费方案 -->
			<set-scheme-rule v-if='index==6' :msg='item.data' :serviceId='id' :isEdit='item.isEditShow'></set-scheme-rule>
		</div>

	</div>
</template>
<script>
import apiClient from '../../../publicJs/ApiClient.js'
import userService from '../../../publicJs/userService'
import TipBoxService from '../common/TipBoxService.js'
import LoadingBoxService from '../../../publicJs/LoadingBoxService.js'
import commonFunc from '../common/commonFunc.js'
import setBasicInfo from './setBasicInfo.vue'
import setImage from './setImage.vue'
import showTopology from './showTopology.vue'
import showLayout from './showLayout.vue'
import setUsableRule from './setUsableRule.vue'
import setSchemeRule from './setSchemeRule.vue'
export default {
  name: 'compositeServiceDetail',
  components: {
    setBasicInfo, // 基础信息组件
    setImage, // 图片上传组件
    showTopology, // 拓扑回显
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
    let vm = this
    return {
      apiBaseUrl: apiClient.apiBaseUrl,
      id: this.$route.query.id, // 服务id
      source_type: this.$route.query.source_type, // 从哪个列表跳转过来
      isModify: this.$route.query.isModify || '2',
      menu: '', // 跳转列表名称
      login_type: userService.getInfo('logintype'), // 登录身份
      isLoading: 0, // 等于3时，获取后台数据的loading效果消失
      url: {
        getAllData: 'itsmApi/combination/findCombinationService', // 获取除可见性、屏蔽性数据
        getUsableData: 'itsmApi/outterVisible/outters' // 获取可见性、屏蔽性数据
      },
      intro: {
        name: '',
        img: '',
        service_status_zh: '',
        service_tag: [],
        true_name: '',
        visit_num: '',
        user_num: '',
        click_num: ''
      },
      blocks: [
        {
          name: '基本信息',
          icon: 'icon-jichuxinxiguanli-copy',
          isOpen: true,
          isEditShow: null,
          data: {}
        },
        {
          name: '图片配置',
          icon: 'icon-tupian2',
          isOpen: false,
          isEditShow: null,
          data: {}
        },
        {
          name: '拓扑搭建',
          icon: 'icon-yuanxingtuopu',
          isOpen: false,
          isEditShow: false,
          isRefresh: 0,
          isPageOver: false,
          data: {}
        },
        {
          name: '页面布局',
          icon: 'icon-buju',
          isOpen: false,
          isEditShow: false,
          isRefresh: 0,
          data: {}
        },
        {
          name: '可见性设置',
          icon: 'icon-kejian1',
          isOpen: false,
          isEditShow: null,
          data: {}
        },
        {
          name: '屏蔽性设置',
          icon: 'icon-pingbi',
          isOpen: false,
          isEditShow: null,
          data: {}
        },
        {
          name: '计费方案',
          icon: 'icon-mianfeishejibaojiafangan',
          isOpen: false,
          isEditShow: null,
          data: {}
        }
      ]
    }
  },
  created () {
    LoadingBoxService.open('正在获取数据，请稍候...')
    this.getData()
    this.getUsableData()
  },
  mounted () {},
  methods: {
    // 刷新页面时左侧菜单控制
    initMenu () {
      this.menu = this.getMenu(this.source_type)
      this.$parent.$parent.setActive('服务管理', this.menu)
      this.$parent.$parent.leftDataChange++
    },
    // 获取数据
    getData () {
      let vm = this

      apiClient.post(vm.url.getAllData, { id: this.id }, function (data) {
        let dataList = data.results.data
        vm.isLoading++
        console.log('已保存信息', dataList)

        vm.intro.name = dataList.name
        vm.intro.img = dataList.img
        vm.intro.service_status_zh = dataList.service_status_zh
        vm.intro.service_tag = dataList.service_tag.join(',')
        vm.intro.true_name = dataList.userList.TRUE_NAME
        vm.intro.visit_num = dataList.visit_num
        vm.intro.user_num = dataList.user_num
        vm.intro.click_num = dataList.click_num || '0'

        // 基本信息
        if (dataList.name != undefined && dataList.name != '') {
          console.log('基本信息数据over')
          vm.blocks[0].data.service_name = dataList.name
          vm.blocks[0].data.service_tag = dataList.service_tag
          vm.blocks[0].data.startTime = commonFunc.formatDate(
            parseInt(dataList.service_start_time),
            'yyyy-MM-dd'
          )
          vm.blocks[0].data.endTime = commonFunc.formatDate(
            parseInt(dataList.service_end_time),
            'yyyy-MM-dd'
          )
          vm.blocks[0].data.service_brief = dataList.service_brief
          vm.blocks[0].data.service_remark = dataList.service_remark
          vm.onOpenBlock(0)
        }

        // 图片配置
        if (dataList.img) {
          console.log('图片配置over')
          vm.blocks[1].data.img = dataList.img // logo
          vm.blocks[1].data.bg_img = dataList.bg_img // 背景图片
          vm.onOpenBlock(1)
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
          vm.onOpenBlock(2)
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
          vm.onOpenBlock(3)
        }

        // 计费方案
        if (dataList.bill_rules && dataList.bill_rules.length) {
          console.log('计费方案')
          vm.blocks[6].data = dataList.bill_rules
          vm.onOpenBlock(6)
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
          vm.onOpenBlock(4)
        }
      })
      apiClient.post(vm.url.getUsableData, myData2, function (data) {
        vm.isLoading++
        if (data.results.visibilityLevel.length) {
          vm.blocks[5].data = data.results
          console.log('屏蔽', data)
          vm.onOpenBlock(5)
        }
      })
    },
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
    // 点击手风琴
    upSadt (index) {
      if (this.blocks[index].isOpen) {
        this.onCloseBlock(index)
      } else {
        this.onOpenBlock(index)
      }
    },
    // 打开模块
    onOpenBlock (index) {
      this.blocks[index].isEditShow = false
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
    // 校验是否为空
    checkNull (obj) {
      if (
        obj == '' ||
        obj == undefined ||
        obj.length == 0 ||
        JSON.stringify(obj) === '{}'
      ) {
        return false
      } else {
        return true
      }
    }
  }
}
</script>
<style src="../../css/createCombinationServeice/newComStyle.css" scoped></style>
<style>
#compositeServiceDetail{
  padding: 10px 18px 20px 18px;
}
#compositeServiceDetail .comcm {
  padding-right: 0;
}
#compositeServiceDetail .el-form-item {
  margin-bottom: 10px;
}
#compositeServiceDetail .el-form-item__label {
  font-size:12px;
}
#compositeServiceDetail .boxService .is-error .txet-ts {
  color: red;
}
#compositeServiceDetail .boxService .el-input__icon + .el-input__inner {
  width: auto;
  padding-right: 12px;
}
#compositeServiceDetail .boxService .el-date-editor.el-input {
  width: 163px !important;
}
#compositeServiceDetail .el-form-item__error {
  display: none;
}
</style>
