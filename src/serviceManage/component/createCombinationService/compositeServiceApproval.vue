<template>
	<div class="boxService" id='compositeServiceApproval'>

		<div class="apply-name">《{{blocks[1].data.service_name}}》组合服务创建申请</div>

		<div v-show="checkShowBlock(item.data,index)" v-for="(item,index) in blocks" class="comcm " :class="{active:item.isOpen}">
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

			<!-- 申请人信息 -->
			<div v-if='index==0' class="formaCon">
        <table class='apply-info'>
          <tr>
            <th>申请人：</th>
            <td><span>{{item.data.TRUE_NAME}}</span></td>
            <th>申请日期：</th>
            <td><span>{{formateTime(item.data.apply_time)}}</span></td>
          </tr>
          <tr>
            <th>用户名：</th>
            <td><span>{{item.data.USERNAME}}</span></td>
            <th>联系电话：</th>
            <td><span>{{item.data.PHONE}}</span></td>
          </tr>
          <tr>
            <th>单位：</th>
            <td><span :title="setEnterpriseName(item.data)">{{setEnterpriseName(item.data)}}</span></td>
            <th>邮箱：</th>
            <td><span>{{item.data.EMAIL}}</span></td>
          </tr>
        </table>
			</div>

			<!-- 基础信息 -->
			<set-basic-info v-if='index==1' :msg='item.data' :serviceId='id' :isEdit='item.isEditShow'></set-basic-info>
			<!-- 图片配置 -->
			<set-image v-if='index==2' :msg='item.data' :serviceId='id' :isEdit='item.isEditShow'></set-image>
			<!-- 拓扑搭建 -->
			<show-topology v-if='index==3' :msg='item.data' :serviceId='id' :isRefresh='item.isRefresh'></show-topology>
			<!-- 页面布局 -->
			<show-layout v-if='index==4' :msg='item.data' :serviceId='id' :isRefresh='item.isRefresh'></show-layout>
			<!-- 可见性设置 -->
			<set-usable-rule v-if='index==5' :msg='item.data' type='1' :serviceId='id' :isEdit='item.isEditShow'></set-usable-rule>
			<!-- 屏蔽性设置 -->
			<set-usable-rule v-if='index==6' :msg='item.data' type='2' :serviceId='id' :isEdit='item.isEditShow'></set-usable-rule>
			<!-- 计费方案 -->
			<set-scheme-rule v-if='index==7' :msg='item.data' :serviceId='id' :isEdit='item.isEditShow'></set-scheme-rule>
			<!-- 审批流转信息 -->
			<div v-if='index==8' class="formaCon">
        <table class="approval-info">
          <tr>
            <th>序号</th>
            <th>审批批次</th>
            <th>审核人</th>
            <th>下一审批阶段</th>
            <th>处理时间</th>
            <th>审核意见</th>
          </tr>
          <tr v-for="(info,indexChild) in item.data" :key="index+'_'+indexChild">
            <td>{{indexChild+1}}</td>
            <td>第{{info.audit_batch_num}}次</td>
            <td>{{info.auditUserName.length?info.auditUserName:'平台'}}</td>
            <td>{{setAuditPhase(info.audit_phase,info.audit_status)}}</td>
            <td>{{formateTime(info.audit_time,info.apply_time)}}</td>
            <td>{{setAuditRemark(info.audit_type, info.audit_status)}}<span :title='info.audit_remark'>{{info.audit_remark}}</span></td>
          </tr>
        </table>
      </div>
			<!-- 审批操作 -->
			<div v-if='index==9' class="formaCon approval-action">
        <ul>
          <li>
            <b>审批：</b>
            <button @click="onPass(true)" class="apply-btn" :class="{active:!approvalAction.isrequired}" >通过</button>
            <button @click="onPass(false)" class="apply-btn" :class="{active:approvalAction.isrequired}" >不通过</button>
          </li>
          <li>
            <b>备注：<span v-show="approvalAction.isrequired" class="isrequired">*</span></b>
            <textarea v-model="approvalAction.reviewnotes" 
                      placeholder="审批意见请填写至此处（限50字以内）"
                      maxlength="50"
                      @keyup="onCount"
                      @keydown="onCount"
                      @focus="onCount"
                      @blur="onCount">
            </textarea>
            
            <p><span>{{approvalAction.reviewnotesNum}} / 50</span>您还可以输入<span>{{50-approvalAction.reviewnotesNum}}</span>个字</p>
          </li>
        </ul>
      </div>
		</div>

		<!-- 底部 -->
		<div class="apply-actions-com">
			<div>
				<b>组合服务创建申请：</b>
				<span>即用户发起的组合服务创建申请，作为管理员需认真审核用户所注册此服务中各项数据信息的准确性、有效性及真实性，并进行审批操作。提交工单后，系统会根据您的审批操作结果（通过or不通过），后台自动执行相应流程或操作。</span>
			</div>
			<button class="apply-btn back" @click='onBack'>返回</button>
			<button v-show="checkShowBlock(blocks[9].data,9)" class="apply-btn submit" @click='submit'>提交</button>
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
import showTopology from './showTopology.vue'
import showLayout from './showLayout.vue'
import setUsableRule from './setUsableRule.vue'
import setSchemeRule from './setSchemeRule.vue'
export default {
  name: 'compositeServiceApproval',
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
      if (nv === 4) {
        LoadingBoxService.close()
        this.initMenu()
        this.isLoading++
      }
    }
  },
  data () {
    return {
      apiBaseUrl: apiClient.apiBaseUrl,
      id: this.$route.query.id, // 服务id
      source_type: this.$route.query.source_type, // 从哪个列表跳转过来
      menu: '', // 跳转列表名称
      login_type: userService.getInfo('logintype'), // 登录身份
      login_id: userService.getInfo('loginId'), // 登录id
      isLoading: 0, // 等于4时，获取后台数据的loading效果消失
      url: {
        getAllData: 'itsmApi/combination/findCombinationService', // 获取除可见性、屏蔽性数据
        getUsableData: 'itsmApi/outterVisible/outters', // 获取可见性、屏蔽性数据
        getApprovalInfo: 'itsmApi/applyInfo/loadAuditFlowInfo', // 获取审批流转信息
        approvalAction: 'itsmApi/atomicService/auditAtomic' // 审批操作
      },
      blocks: [
        {
          name: '申请人信息',
          icon: 'icon-tianxieshenqingrenxinxi',
          isOpen: true,
          isEditShow: null,
          data: {}
        },
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
        },
        {
          name: '审批流转信息',
          icon: 'icon-16gongwenliuzhuan',
          isOpen: false,
          isEditShow: null,
          data: {}
        },
        {
          name: '审批操作',
          icon: 'icon-shenpi',
          isOpen: false,
          isEditShow: null,
          data: {}
        }
      ],
      dataList: {}, // getData()获取的所有信息
      approvalAction: {
        isrequired: false,
        reviewstatus: 2,
        audit_type: '2',
        reviewnotes: '',
        reviewnotesNum: 0,
        change_id: this.$route.query.change_id || ''
      }
    }
  },
  created () {
    LoadingBoxService.open('正在获取数据，请稍候...')
    this.getData()
    this.getUsableData()
    this.getApprovalInfo()
  },
  mounted () {
    this.initUI()
  },
  methods: {
    // 刷新页面时左侧菜单控制
    initMenu () {
      this.menu = this.getMenu(this.source_type)
      this.$parent.$parent.setActive('服务管理', this.menu)
      this.$parent.$parent.leftDataChange++
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
    // 模块显示控制
    checkShowBlock (data, index) {
      if (index < 9 && this.checkNull(data)) {
        return true
      } else if (index === 9 && this.isLoading > 4) {
        let audit_phase = this.blocks[8].data[this.blocks[8].data.length - 1].audit_phase
        let audit_status = this.blocks[8].data[this.blocks[8].data.length - 1].audit_status
        if (this.login_type === 'ENTERPRISE' && audit_phase === 1) {
          return true
        } else if (this.login_type === 'PLATFORM' && audit_phase === 2) {
          return true
        } else {
          return false
        }
      } else {
        return false
      }
    },
    // 获取数据
    getData () {
      let vm = this

      apiClient.post(vm.url.getAllData, { id: this.id }, function (data) {
        vm.dataList = Object.assign({}, data.results.data)
        vm.isLoading++
        console.log('已保存信息', vm.dataList)

        vm.blocks[0].data = vm.dataList.userList
        vm.blocks[0].data.apply_time = vm.dataList.apply_time_long

        // 基本信息
        if (vm.dataList.name !== undefined && vm.dataList.name !== '') {
          console.log('基本信息数据over')
          vm.blocks[1].data.service_name = vm.dataList.name
          vm.blocks[1].data.service_tag = vm.dataList.service_tag
          vm.blocks[1].data.startTime = commonFunc.formatDate(
            parseInt(vm.dataList.service_start_time),
            'yyyy-MM-dd'
          )
          vm.blocks[1].data.endTime = commonFunc.formatDate(
            parseInt(vm.dataList.service_end_time),
            'yyyy-MM-dd'
          )
          vm.blocks[1].data.service_brief = vm.dataList.service_brief
          vm.blocks[1].data.service_remark = vm.dataList.service_remark
          vm.onOpenBlock(1)
        }

        // 图片配置
        if (vm.dataList.img) {
          console.log('图片配置over')
          vm.blocks[2].data.img = vm.dataList.img // logo
          vm.blocks[2].data.bg_img = vm.dataList.bg_img // 背景图片
          vm.onOpenBlock(2)
        }

        // 拓扑图
        if (
          vm.dataList.combination_data_config &&
          vm.dataList.combination_data_config.block
        ) {
          console.log('拓扑图over')
          let config = vm.dataList.combination_data_config
          config.block = JSON.parse(config.block)
          config.connects = JSON.parse(config.connects)
          vm.blocks[3].data.combination_data_config = config
          vm.blocks[3].isRefresh++
          vm.onOpenBlock(3)
        }

        // 页面布局
        if (
          vm.dataList.combination_page_config &&
          vm.dataList.combination_page_config.areas
        ) {
          console.log('页面布局over')
          vm.blocks[3].isPageOver = true
          let config = vm.dataList.combination_page_config
          config.areas = JSON.parse(config.areas)
          vm.blocks[4].data.combination_page_config = config
          vm.blocks[4].isRefresh++
          vm.onOpenBlock(4)
        }

        // 计费方案
        if (vm.dataList.bill_rules && vm.dataList.bill_rules.length) {
          console.log('计费方案')
          vm.blocks[7].data = vm.dataList.bill_rules
          vm.onOpenBlock(7)
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
          vm.blocks[5].data = data.results
          console.log('可见', data)
          vm.onOpenBlock(5)
        }
      })
      apiClient.post(vm.url.getUsableData, myData2, function (data) {
        vm.isLoading++
        if (data.results.visibilityLevel.length) {
          vm.blocks[6].data = data.results
          console.log('屏蔽', data)
          vm.onOpenBlock(6)
        }
      })
    },
    // 获取审批流转信息
    getApprovalInfo () {
      let vm = this
      let myData = {
        belongType: this.dataList.belong_type,
        appSubjectIdl: this.id,
        approvalType: '2,4',
        enterpriseId: this.dataList.enterprise_id,
        applyUserId: this.dataList.user_id,
        batchNo: this.dataList.approval_batchNo
      }
      apiClient.post(vm.url.getApprovalInfo, myData, function (data) {
        vm.isLoading++
        if (data.status === 200) {
          vm.blocks[8].data = [...data.results.data]
          console.log('审批流转信息', vm.blocks[8].data)
          vm.onOpenBlock(8)
          vm.onOpenBlock(9)
        }
      })
    },
    // 审批意见选择
    onPass (flag) {
      if (flag) {
        // 通过
        this.approvalAction.isrequired = false
        this.approvalAction.reviewstatus = 2
      } else {
        this.approvalAction.isrequired = true
        this.approvalAction.reviewstatus = 3
      }
    },
    // 审批意见字数限制
    onCount () {
      this.approvalAction.reviewnotesNum = this.approvalAction.reviewnotes.length
    },
    // 提交审核
    submit () {
      let vm = this
      if (vm.approvalAction.isrequired && !vm.approvalAction.reviewnotes.length) {
        TipBoxService.open('请在备注中填写审批不通过的原因！', 1)
        return
      }
      let myData = {
        serviceId: vm.id,
        auditParam: vm.approvalAction
      }
      LoadingBoxService.open('正在提交，请稍候...')
      apiClient.post(vm.url.approvalAction, myData, function (data) {
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
      let path = this.getMenu(this.source_type, 'path')
      this.$router.push(path)
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
    // 获取跳转列表名称
    getMenu (str, flag) {
      let menu = ''
      let path = ''
      let menuDic = [
        { label: '企业服务', value: '1', path: '/enterprise' },
        { label: '平台服务', value: '2', path: '/platformService' },
        { label: '第三方服务', value: '3', path: '/thirdPartyService' },
        { label: '待我审批', value: '4', path: '/applyUsing' },
        { label: '我的注册', value: '5', path: '/registered' },
        { label: '我的申请', value: '6', path: '/applied' }
      ]
      menuDic.forEach(function (v, i) {
        if (str === v.value) {
          menu = v.label
          path = v.path
          return
        }
      })
      if (flag === 'path') {
        return path
      } else {
        return menu
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
    setEnterpriseName (data) {
      if (this.dataList.belong_type === 'PLATFORM') {
        return '平台'
      } else if (this.dataList.belong_type === 'ENTERPRISE') {
        return data.NAME
      } else {
        return '无'
      }
    },
    // 审批阶段转换
    setAuditPhase (audit_phase, audit_status) {
      if (audit_phase === 1) {
        return '企业审批'
      } else if (audit_phase === 2) {
        return '平台审批'
      } else if (audit_phase === 3 && audit_status === '2') {
        return '成功'
      } else if (audit_phase === 3 && audit_status === '3') {
        return '打回'
      }
    },
    // 审批意见转换
    setAuditRemark (audit_type, audit_status) {
      switch (audit_status) {
      case '0':
        return '撤销；'
      case '1':
        if (audit_type === '2') {
          return '创建；'
        } else if (audit_type === '4') {
          return '变更；'
        }
        break
      case '2':
        return '通过；'
      case '3':
        return '不通过；'
      }
    },
    // 时间格式转换
    formateTime: function (audit_time, apply_time) {
      if (audit_time) {
        return commonFunc.formatDate(audit_time, 'yyyy-MM-dd HH:mm:ss')
      } else {
        return commonFunc.formatDate(apply_time, 'yyyy-MM-dd HH:mm:ss')
      }
    }
  }
}
</script>
<style src="../../css/createCombinationServeice/newComStyle.css" scoped></style>
<style>
#compositeServiceApproval .apply-actions-com > div {
  right: 250px;
}
#compositeServiceApproval .apply-actions-com > div > span {
  left: 130px;
}
#compositeServiceApproval .comcm {
  padding-right: 0;
}
#compositeServiceApproval .el-form-item {
  margin-bottom: 10px;
}
#compositeServiceApproval .el-form-item__label {
  font-size: 12px;
}
#compositeServiceApproval .boxService .is-error .txet-ts {
  color: red;
}
#compositeServiceApproval .boxService .el-input__icon + .el-input__inner {
  width: auto;
  padding-right: 12px;
}
#compositeServiceApproval .boxService .el-date-editor.el-input {
  width: 163px !important;
}
#compositeServiceApproval .el-form-item__error {
  display: none;
}
</style>
