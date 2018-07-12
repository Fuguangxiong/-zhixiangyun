<template>
	<div id="newServicePage" class="boxService">
		<div class="rightfix">
			<ul>
				<li v-for="(item,index) in blocks" :class="item.status" v-show="item.isShow" :key="index">{{item.name}}</li>
			</ul>
		</div>
		<div class="tattop">服务管理·新建服务·创建原子服务</div>
		<!-- 基础信息start -->
		<div v-for="(item,index) in blocks" :key="index" class="comcm" :class="{active:item.isOpen}">
			<div v-show="item.isShow" class="thade " @click="upSadt(index)">
				<span class="thade-cloe">
					<i class="icon iconfont" :class="item.icon"></i>
					<em>{{item.name}}</em>
				</span>
				<span class="upcnl">
					<em class="bianji" 
						v-show="item.status=='tree'" 
						@click.stop="formedit(index)">
						<i class="icon iconfont icon-bianji2"></i>
					</em>
					<em class="upjit">
						<i class="icon iconfont icon-arrow-down-copy"></i>
					</em>
				</span>
			</div>
			<!-- 基础信息 -->
			<base-information v-if='index==0' @submint='submint1' :is-editdm='item.data' @cancel="resetEdit" :is-chide='id' :is-edit="item.isEditShow"></base-information>
			<!-- 服务归属 -->
			<homeConfig v-if='index==1' @submint='submint2' :is-editdmb='item.data' :is-chide='id' @cancel="resetEditb" :is-edit="item.data.isEditShow"></homeConfig>
			<!-- 图片配置 -->
			<img-config v-if='index==2' @submint='submint3' :msg-img='item.data' :is-chide='id' :is-edit="item.data.isEditShow"></img-config>
			<!-- 页面请求设置 -->
			<htmlRequestb v-if='index==3' :class="{isShow:!item.isShow}" @submint='submint4' @cancel="resetEditd" :is-editdmset='item.data' :is-chide='id' :del-a='delA' :is-edit="item.isEditShow" :changeNo="changeNo" :isClean="isClean" :isAppServer="isAppServer"></htmlRequestb>
			<!-- 数据页面请求 -->
			<htmlRequest v-if='index==4' :class="{isShow:!item.isShow}" @submint='submint5' @cancel="resetEdite" :is-editdmd='item.data' :is-chide='id' :del-b="delB" :is-edit="item.isEditShow" :changeNo="changeNo" :isClean="isClean" :isAppServer="isAppServer"></htmlRequest>
			<!-- 纯数据请求 -->
			<htmlRequestc v-if='index==5' :class="{isShow:!item.isShow}" @submint='submint6' @cancel="resetEditf" :is-editdmdata='item.data' :is-chide='id' :del-c="delC" :is-edit="item.isEditShow" :changeNo="changeNo" :isClean="isClean" :isAppServer="isAppServer"></htmlRequestc>
			<!-- 可见性配置 -->
      <set-usable-rule v-if='index==6' @submit='submint7' :msg='item.data' type='1' :serviceId='id' :isEdit='item.isEditShow'></set-usable-rule>
      <!-- 屏蔽 -->
      <set-usable-rule v-if='index==7' @submit='submint8' :msg='item.data' type='2' :serviceId='id' :isEdit='item.isEditShow'></set-usable-rule>
			<!-- 计费方案配置 -->
			<set-scheme-rule v-if='index==8' @submit='submitCharge' :msg='item.data' :serviceId='id' :isEdit='item.isEditShow'></set-scheme-rule>
		</div>
		<!-- 底部 -->
		<div class="apply-actions">
			<div>
				<b>服务需求单：</b>
				<span>分为应用服务、远程服务，用户可将原有应用系统上传到平台或提供远程访问地址，平台提供从中拆分成单一服务的能力。且拆分出的服务具有标准的数据对接接口，可单独调用或扩展应用于其他系统的最小服务单元，这种最小服务单元统称为原子服务。</span>
			</div>
      <button class="apply-btn back" @click='onView'>测试</button>
			<button class="apply-btn back" @click="goBack()">返回</button>
			<!-- <button v-show='status=="edit"' class="apply-btn save" @click="onSave">保存草稿</button>
			<button v-show='status=="edit"' class="apply-btn submit" @click="onSubmit">提交</button> -->
			<button class="apply-btn submit" @click="submitService()">提交</button>
		</div>
	</div>
</template>
<script>
import LabelView from '../../../publicComponent/labelView.vue'
import apiClient from '../../../publicJs/ApiClient.js'
import TipBoxService from '../common/TipBoxService.js'
import LoadingBoxService from '../../../publicJs/LoadingBoxService.js'
import baseInformation from './essentialInformation.vue'
import homeConfig from './homeConfig.vue'
import imgConfig from './imgConfig.vue'
import htmlRequest from './htmlRequest.vue'
import htmlRequestb from './htmlRequestb.vue'
import htmlRequestc from './htmlRequestc.vue'
import setUsableRule from '../createCombinationService/setUsableRule.vue'
import setSchemeRule from '../createCombinationService/setSchemeRule.vue'
import $ from 'jquery'
export default {
  name: '',
  data () {
    return {
      blocks: [
        {
          name: '基本信息',
          icon: 'icon-jichuxinxiguanli-copy',
          status: 'stant', // tree：完成；stant：正在操作；initial：未编辑；
          isOpen: true,
          isEditShow: null,
          isShow: true,
          data: {}
        },
        {
          name: '服务归属',
          icon: 'icon-guishu',
          status: '', // tree：完成；stant：正在操作；initial：未编辑；
          isOpen: false,
          isEditShow: false,
          isShow: true,
          data: {}
        },
        {
          name: '图片设置',
          icon: 'icon-guishu',
          status: '', // tree：完成；stant：正在操作；initial：未编辑；
          isOpen: false,
          isEditShow: null,
          isShow: true,
          data: {}
        },
        {
          name: '页面请求设置',
          icon: 'icon-guishu',
          status: '', // tree：完成；stant：正在操作；initial：未编辑；
          isOpen: false,
          isEditShow: false,
          isShow: true,
          data: {}
        },
        {
          name: '页面数据请求设置',
          icon: 'icon-guishu',
          status: '', // tree：完成；stant：正在操作；initial：未编辑；
          isOpen: false,
          isEditShow: false,
          isShow: true,
          data: {}
        },
        {
          name: '纯数据请求设置',
          icon: 'icon-guishu',
          status: '', // tree：完成；stant：正在操作；initial：未编辑；
          isOpen: false,
          isEditShow: false,
          isShow: true,
          data: {}
        },
        {
          name: '可见性设置',
          icon: 'icon-guishu',
          status: '', // tree：完成；stant：正在操作；initial：未编辑；
          isOpen: false,
          isEditShow: null,
          isShow: true,
          data: {}
        },
        {
          name: '屏蔽性设置',
          icon: 'icon-guishu',
          status: '', // tree：完成；stant：正在操作；initial：未编辑；
          isOpen: false,
          isEditShow: null,
          isShow: true,
          data: {}
        },
        {
          name: '计费方案',
          icon: 'icon-guishu',
          status: '', // tree：完成；stant：正在操作；initial：未编辑；
          isOpen: false,
          isEditShow: null,
          isShow: true,
          data: {}
        }
      ],
      isAppServer: 0,
      isClean: 0,
      changeNo: 0,
      gainData: '', // 屏蔽组件抛出获取
      source_type: '', // 跳转来源
      delA: false,
      delB: false,
      delC: false,
      serv: [], // 回显示 页面请求设置，纯数据设置，页面请求设置，抛出来存储
      id: this.$route.query.atomicId || '', // 服务id
      serviceId: '', // 变更
      publicWidth: 0,
      isPlanChange: false,
      stdatypeArr: '', // 组件归属输出我选择了 哪几个 页面请求方式
      kjInfo: '',
      pbInfo: '',
      billRules: ''
    }
  },
  watch: {
    // 页面请求设置，纯数据设置，页面请求设置，抛出来存储
    serv: {
      handler (newValue, oldValue) {
        this.blocks[3].data = newValue
        this.blocks[4].data = newValue
        this.blocks[5].data = newValue
        console.info(
          ' 页面请求设置，纯数据设置，页面请求设置，抛出来存储',
          newValue
        )
      },
      deep: true
    }
  },
  mounted () {
    var that = this
    that.source_type = that.$route.query.source_type
    that.id = that.$route.query.id
    // 判断是否是修改或者变更
    if (this.checkNull(this.id)) {
      this.getData()
      this.getUsableData()
    }
    // 控制总保存，浮动框
    $('.apply-actions').css({ width: that.getControllerWidth() + 'px' })
    if (window.iscEvent) {
      window.iscEvent.on('menuchange', function () {
        let targetW = that.getControllerWidth()
        $('.apply-actions').animate({ width: targetW + 'px' }, 500)
      })
    }
    for (let i = 1; i < that.blocks.length; i++) {
      $('.formaCon')
        .eq(i)
        .slideUp(10)
    }
  },
  methods: {
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
    goBack () {
      var that = this
      if (that.source_type == 1) {
        that.$router.push('/enterprise')
      } else if (that.source_type == 5) {
        that.$router.push('/registered')
      } else if (that.source_type == 2) {
        that.$router.push('/platformService')
      }
    },
    checkRequired () {
      let flag = {
        flagRequired: true,
        flagRequiredTip: '',
        flagNotRequired: true,
        flagNotRequiredTip: ''
      }
      for (let i = 0; i < this.blocks.length; i++) {
        if (this.blocks[i].status != 'tree') {
          if (this.blocks[i].isShow) {
            if (i < 6) {
              flag.flagRequired = false
              flag.flagRequiredTip += '“' + this.blocks[i].name + '”' + '，'
            } else {
              flag.flagNotRequiredTip += '“' + this.blocks[i].name + '”' + '，'
              flag.flagNotRequired = false // 后三项选择设置
            }
          }
        }
      }
      if (flag.flagRequiredTip.length) {
        flag.flagRequiredTip = flag.flagRequiredTip.substring(0, flag.flagRequiredTip.length - 1) + '信息未填写完整，当前无法提交审核！'
      }
      if (flag.flagNotRequiredTip.length) {
        flag.flagNotRequiredTip = flag.flagNotRequiredTip.substring(0, flag.flagNotRequiredTip.length - 1) + '尚未完成设置，是否确定提交？'
      }
      return flag
    },
    submitService () {
      let vm = this
      let flag = vm.checkRequired()
      if (flag.flagRequired) {
        var myData = {
          id: this.id,
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
            if (vm.blocks[6].status != 'tree') {
              vm.onSaveUsable()
            }
            vm.submitAllAction(myData)
          })
        }
      } else {
        TipBoxService.open(flag.flagRequiredTip + '信息未填写完整，当前无法提交审核！', 2)
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
      apiClient.post('itsmApi/outterVisible/addOutter', myData, function (data) {
        if (data.status == 200) {
        } else {
          TipBoxService.open(data.exception, 1)
        }
      })
    },
    submitAllAction (myData) {
      let that = this
      LoadingBoxService.open('正在提交，请稍候...')
      apiClient.post('itsmApi/createService/updateAtomicInfo', myData, function (
          data
        ) {
        LoadingBoxService.close()
        if (that.source_type == 1) {
          that.$router.push('/enterprise')
        } else if (that.source_type == 5) {
          that.$router.push('/registered')
        } else if (that.source_type == 2) {
          that.$router.push('/platformService')
        } else {
          that.$router.push('/search')
        }
      })
    },
    getControllerWidth () {
      let targetW = 0
      if ($('body').hasClass('bigSreen') && !$('body').hasClass('bigSreen2')) {
        targetW = $(window).width() - 58
      } else {
        targetW = $(window).width() - 208
      }
      return targetW
    },
    // 数据回显并且分发到各个组件
    getData () {
      let that = this
      apiClient.post(
        'itsmApi/atomicService/loadServiceInfo',
        { id: that.id },
        function (data) {
          console.log('黑线那上单打', data)
          var datas = data.results
          var data = data.results.data[0]
          // 基础信息
          if (data.name != undefined && data.name != '') {
            console.info('进入基础信息回显')
            that.blocks[0].status = 'tree'
            that.blocks[0].isOpen = true
            that.blocks[0].isEditShow = true
            that.blocks[0].data.name = data.name
            that.blocks[0].data.startTime = that.formatDuring(
              parseInt(data.service_start_time),
              'yyyy-MM-dd'
            )
            that.blocks[0].data.endTime = that.formatDuring(
              parseInt(data.service_end_time),
              'yyyy-MM-dd'
            )
            that.blocks[0].data.change_id = data.change_id
            that.blocks[0].data.brief = data.service_brief
            that.blocks[0].data.service_remark = data.service_remark
            that.blocks[0].data.isEditShow = true
            $('.formaCon')
              .eq(0)
              .slideDown()
            // 如果进入回显，把右边开启 编辑状态
            that.blocks.forEach(function (v, i) {
              if (i == 1 && v.status != 'tree') {
                that.blocks[3].status = 'modes'
                that.blocks[4].status = 'modes'
                that.blocks[5].status = 'modes'
                if (v.status != 'tree') {
                  if (v.status != 'modes') {
                    v.status = 'initial'
                  }
                }
              } else {
                if (v.status != 'tree') {
                  if (v.status != 'modes') {
                    v.status = 'initial'
                  }
                }
              }
            })
          }
          if (data.service_tag != undefined && data.service_tag != '') {
            console.info('进入归属服务回显', data)
            that.blocks[1].data.isEditShow = true
            that.blocks[1].status = 'tree'
            that.blocks[1].isOpen = true
            that.blocks[1].isEditShow = true
            $('.formaCon')
              .eq(1)
              .slideDown()
            that.blocks[1].data.service_tag = data.service_tag
            that.blocks[1].data.apptype = data.apptype
            that.blocks[1].data.app_id = data.app_id
            if (data.app_id != '') {
              that.isAppServer ++// 判断是否为应用服务，如果是则累加用于组件内部监听
            }
            that.blocks[1].data.service_type = data.service_type
            that.blocks[3].isShow = false
            that.blocks[4].isShow = false
            that.blocks[5].isShow = false
            that.stdatypeArr = data.service_type
            for (var i = 0; i < data.service_type.length; i++) {
              if (data.service_type[i] == '1') {
                that.blocks[3].isShow = true
                that.blocks[3].status = 'initial'
              } else if (data.service_type[i] == '2') {
                that.blocks[4].isShow = true
                that.blocks[4].status = 'initial'
              } else if (data.service_type[i] == '3') {
                that.blocks[5].isShow = true
                that.blocks[5].status = 'initial'
              }
            }
            that.blocks.forEach(function (v, i) {
              if (v.status != 'tree') {
                if (v.status != 'modes') {
                  v.status = 'initial'
                }
              }
            })
          }
          // 图片数据
          if (data.img != undefined && data.img != '') {
            that.blocks[2].data.isEditShow = true
            that.blocks[2].status = 'tree'
            that.blocks[2].isOpen = true
            that.blocks[2].isEditShow = true
            $('.formaCon')
              .eq(2)
              .slideDown() // 展开
            that.blocks[2].data.img = data.img // logo
            that.blocks[2].data.bg_img = data.bg_img // 背景图片
            that.blocks[2].id = data.id //
          }
          // 页面请求
          if (data.service_param_detail != undefined) {
            var serv = data.service_param_detail
            serv[0] = JSON.parse(serv[0])
            serv[1] = JSON.parse(serv[1])
            serv[2] = JSON.parse(serv[2])
            if (serv[0].url != '' || serv[1].url != '' || serv[2].url != '') {
              var type = data.service_type
              that.blocks[3].data = serv
              that.blocks[3].isEditShow = true
              if (serv[0].url != '') {
                that.blocks[3].status = 'tree'
                that.blocks[3].isOpen = true
                that.blocks[3].data.isEditShow = true
                that.changeNo++
                $('.formaCon')
                .eq(3)
                .slideDown() // 展开
              }
            }
            // 数据页面请求
            if (serv[0].url != '' || serv[1].url != '' || serv[2].url != '') {
              that.blocks[4].data = serv
              that.blocks[4].isEditShow = true
              if (serv[1].url != '') {
                that.blocks[4].status = 'tree'
                that.blocks[4].isOpen = true
                that.blocks[4].data.isEditShow = true
                that.changeNo++
                $('.formaCon')
                .eq(4)
                .slideDown() // 展开
              }
            }
            // 纯数据请求
            if (serv[0].url != '' || serv[1].url != '' || serv[2].url != '') {
              that.blocks[5].data = serv
              that.blocks[5].data.isEditShow = true
              if (serv[2].url != '') {
                that.blocks[5].status = 'tree'
                that.blocks[5].isOpen = true
                that.blocks[5].isEditShow = true
                that.changeNo++
                $('.formaCon')
                .eq(5)
                .slideDown() // 展开
              }
            }
          }
          // 计费方案
          that.billRules = datas.bill_rules
          if (datas.bill_rules && datas.bill_rules.length !== 0) {
            that.blocks[8].data.isEditShow = false
            that.blocks[8].status = 'tree'
            that.blocks[8].isOpen = true
            that.blocks[8].isEditShow = false
            $('.formaCon')
              .eq(8)
              .slideDown() // 展开
            console.log('计费方案', datas.bill_rules)
            datas.bill_rules.forEach(function (v, k) {
              v.feeInfo.forEach(function (z, t) {
                z.expiry_end_date = that.formatDuring(parseInt(z.expiry_end_date), 'yyyy-MM-dd')
                z.expiry_start_date = that.formatDuring(parseInt(z.expiry_start_date), 'yyyy-MM-dd')
                z.created_time = that.formatDuring(parseInt(z.created_time), 'yyyy-MM-dd')
              })
            })
            that.blocks[8].data = datas.bill_rules
          }
        }
      )
    },
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
      apiClient.post('itsmApi/outterVisible/outters', myData1, function (data) {
        vm.blocks[6].isEditShow = false // 显示第一个编辑按钮
        vm.blocks[6].data.isEditShow = false // 给子组件传递信息
        if (data.results.visibilityLevel.length) {
          vm.blocks[6].status = 'tree' // 右边悬浮标示
          vm.blocks[6].isOpen = true
          vm.blocks[6].data = data.results
          $('.formaCon')
              .eq(6)
              .slideDown() // 展开
          vm.kjInfo = data
          console.log('可见', data)
        }
      })
      apiClient.post('itsmApi/outterVisible/outters', myData2, function (data) {
        vm.blocks[7].isEditShow = false // 显示第一个编辑按钮
        vm.blocks[7].data.isEditShow = false // 给子组件传递信息
        if (data.results.visibilityLevel.length) {
          vm.blocks[7].status = 'tree' // 右边悬浮标示
          vm.blocks[7].isOpen = true
          vm.blocks[7].data = data.results
          $('.formaCon')
              .eq(7)
              .slideDown() // 展开
          vm.pbInfo = data
          console.log('屏蔽', data)
        }
      })
    },
    // 计费方案通知改变
    editChange (status) {
      console.info('计费方案通知改变', status)
      this.isPlanChange = status // 通知子组件改变
    },
    // 计费--保存
    Prtion (data) {
      this.blocks[8].isEditShow = data.isEditShow // 显示第一个编辑按钮
      this.blocks.data.isEditShow = data.isEditShow // 给子组件传递信息
      this.blocks[8].status = 'tree'
    },
    // 处理计费方案的数据(因两个接口返回的数据不一致，后期优化后可注释)
    planData (data) {
      if (data == undefined || data.length == 0) {
        return
      }
      data.map(function (val) {
        val.key = val.groupName
        val.value = val.feeInfo
      })
      return data
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
    // 点击展开
    upSadt (index) {
      let isEdit = true
      var that = this
      console.info('---进入点击', index)
      // 判断状态
      this.blocks.forEach(function (v, i) {
        if (v.status == 'stant') {
          isEdit = false
        }
      })
      // 编辑状态不能<=0 的时候， 或者状态是成功的时候
      if (isEdit || this.blocks[index].status == 'tree') {
        if (this.blocks[index].status != 'modes') {
          if (this.blocks[index].status != 'tree') {
            this.blocks[index].status =
              this.blocks[index].status != 'stant' ? 'stant' : 'initial'
            $('.formaCon')
              .eq(index)
              .slideDown()
            console.log($('.formaCon').size())
            that.blocks[index].isOpen = true
            if (index == 8) {
              that.blocks[8].isEditShow = true
            }
          } else {
            if (that.blocks[index].isOpen) {
              $('.formaCon')
                .eq(index)
                .slideUp()
              that.blocks[index].isOpen = false
            } else {
              $('.formaCon')
                .eq(index)
                .slideDown()
              that.blocks[index].isOpen = true
            }
          }
        } else {
          TipBoxService.open('请先配置服务归属', 2)
        }
      }
    },
    // 编辑按钮
    formedit (index) {
      var that = this
      switch (index) {
      case 0:
        this.blocks[0].isEditShow = false // 控制编辑消失
        this.blocks[0].data.isEditShow = false // 告诉子组件
        this.blocks[0].isOpen = true // 控制编辑消失
        $('.formaCon')
            .eq(0)
            .slideDown()
        break
      case 1:
        this.blocks[1].isEditShow = false // 控制编辑消失
        this.blocks[1].data.isEditShow = false // 告诉子组件
        this.blocks[1].isOpen = true // 控制编辑消失
        $('.formaCon')
            .eq(1)
            .slideDown()
        break
      case 2:
        this.blocks[2].isEditShow = false // 控制编辑消失
        this.blocks[2].data.isEditShow = false // 告诉子组件
        this.blocks[2].isOpen = true
        $('.formaCon')
            .eq(2)
            .slideDown()
        break
      case 3:
        this.blocks[3].isEditShow = false // 控制编辑消失
        this.blocks[3].data.isEditShow = false // 告诉子组件
        this.blocks[3].isOpen = true
        $('.formaCon')
            .eq(3)
            .slideDown()
        break
      case 4:
        this.blocks[4].isEditShow = false // 控制编辑消失
        this.blocks[4].data.isEditShow = false // 告诉子组件
        this.blocks[4].isOpen = true
        $('.formaCon')
            .eq(4)
            .slideDown()
        break
      case 5:
        this.blocks[5].isEditShow = false // 控制编辑消失
        this.blocks[5].data.isEditShow = false // 告诉子组件
        this.blocks[5].isOpen = true
        $('.formaCon')
            .eq(5)
            .slideDown()
        break
      case 6:
        this.blocks[6].isEditShow = true // 控制编辑消失
        this.blocks[6].data.isEditShow = true // 告诉子组件
        this.blocks[6].isOpen = true
        $('.formaCon')
            .eq(6)
            .slideDown()
        break
      case 7:
        this.blocks[7].isEditShow = true // 控制编辑消失
        this.blocks[7].data.isEditShow = true // 告诉子组件
        this.blocks[7].isOpen = true
        $('.formaCon')
            .eq(7)
            .slideDown()
        break
      case 8:
        this.blocks[8].isEditShow = true // 控制编辑消失
        this.blocks[8].data.isEditShow = true // 告诉子组件
        $('.formaCon')
            .eq(8)
            .slideDown()
        this.blocks[8].isOpen = true
        this.isPlanChange = true // 通知子组件改变
        break
      }
      this.blocks[index].isOpen = true
      this.blocks[index].status = 'stant'
    },
    // 基础服务
    submint1 (obj) {
      let that = this
      console.info('服务管理组件跑出------>', obj)
      this.blocks[0].isEditShow = obj.isEditShow // 显示第一个编辑按钮
      this.blocks[0].data.isEditShow = obj.isEditShow // 给子组件传递信息
      this.id = obj.id
      this.getUsableData()
      this.getData()
      this.blocks[0].status = 'tree'
      this.blocks[0].data = obj.item
      this.blocks.forEach(function (v, i) {
        if (i == 1 && v.status != 'tree') {
          that.blocks[3].status = 'modes'
          that.blocks[4].status = 'modes'
          that.blocks[5].status = 'modes'
          if (v.status != 'tree') {
            if (v.status != 'modes') {
              v.status = 'initial'
            }
          }
        } else {
          if (v.status != 'tree') {
            if (v.status != 'modes') {
              v.status = 'initial'
            }
          }
        }
      })
      this.$router.push({ name: 'newServicePage', query: { id: this.id } })
    },
    resetEdit (item, flag) {
      this.blocks[0].isEditShow = flag
      this.blocks[0].data = item
      this.blocks[0].status = 'tree'
    },
    resetEditb (item) {
      this.getData()
    },
    resetEditd (item, flag) {
      this.blocks[3].data = item
      this.blocks[3].isEditShow = flag
      this.blocks[3].status = 'tree'
    },
    resetEdite (item, flag) {
      this.blocks[4].data = item
      this.blocks[4].isEditShow = flag
      this.blocks[4].status = 'tree'
    },
    resetEditf (item, flag) {
      this.blocks[5].data = item
      this.blocks[5].isEditShow = flag
      this.blocks[5].status = 'tree'
    },
    // 服务管理
    submint2 (obj) {
      console.log('服务归属回显数据:', obj)
      // this.delA = isDela
      // this.delB = isDelb
      // this.delC = isDelc
      // this.blocks[3].isShow = !isDela
      // this.blocks[4].isShow = !isDelb
      // this.blocks[5].isShow = !isDelc
      if (obj.isClean) {
        this.isClean ++
      }
      if (obj.isAppServer) {
        this.isAppServer ++
      }
      this.blocks[1].isEditShow = obj.isEditShow // 显示第一个编辑按钮
      this.blocks[1].data = obj
      this.blocks[1].data.isEditShow = obj.isEditShow // 给子组件传递信息
      this.stdatypeArr = obj.stdatype
      this.blocks[1].data.service_type = obj.stdatype
      this.blocks[1].status = 'tree'
      this.blocks[3].status = 'modes'
      this.blocks[4].status = 'modes'
      this.blocks[5].status = 'modes'
      for (var i = 0; i < obj.stdatype.length; i++) {
        if (obj.stdatype[i] == '1') {
          this.blocks[3].status = 'initial'
        } else if (obj.stdatype[i] == '2') {
          this.blocks[4].status = 'initial'
        } else if (obj.stdatype[i] == '3') {
          this.blocks[5].status = 'initial'
        }
      }
      this.getData()
    },
    // 图片配置--保存
    submint3 (obj) {
      this.blocks[2].data.img = obj.img // logo
      this.blocks[2].data.bg_img = obj.bg_img // 背景图片
      this.blocks[2].isEditShow = obj.isEditShow // 显示第一个编辑按钮
      this.blocks[2].data.isEditShow = obj.isEditShow // 给子组件传递信息
      this.blocks[2].status = 'tree'
    },
    // 页面请求
    submint4 (obj) {
      this.serv = obj.spdetail
      this.blocks[3].data = obj.spdetail
      this.blocks[3].isEditShow = obj.isEditShow // 显示第一个编辑按钮
      this.blocks[4].isEditShow = obj.isEditShow
      this.blocks[5].isEditShow = obj.isEditShow
      this.blocks[3].data.isEditShow = obj.isEditShow // 给子组件传递信息
      this.blocks[3].status = 'tree'
      this.changeNo++
    },
    // 页面数据请求
    submint5 (obj) {
      this.serv = obj.spdetail
      this.blocks[4].data = obj.spdetail
      this.blocks[3].isEditShow = obj.isEditShow // 显示第一个编辑按钮
      this.blocks[4].isEditShow = obj.isEditShow
      this.blocks[5].isEditShow = obj.isEditShow
      this.blocks[4].data.isEditShow = obj.isEditShow // 给子组件传递信息
      this.blocks[4].status = 'tree'
      this.changeNo++
    },
    // 纯数据请求
    submint6 (obj) {
      this.serv = obj.spdetail
      this.blocks[5].data = obj.spdetail
      this.blocks[3].isEditShow = obj.isEditShow // 显示第一个编辑按钮
      this.blocks[4].isEditShow = obj.isEditShow
      this.blocks[5].isEditShow = obj.isEditShow
      this.blocks[5].data.isEditShow = obj.isEditShow // 给子组件传递信息
      this.blocks[5].status = 'tree'
      this.changeNo++
    },
    // 可见性
    submint7 (flag, index, item) {
      if (flag && item) {
        this.blocks[6].data = item
        this.blocks[6].isEditShow = item.isEditShow // 显示第一个编辑按钮
        this.blocks[6].data.isEditShow = item.isEditShow // 给子组件传递信息
        this.blocks[6].status = 'tree' // 右边悬浮标示
      } else {
        if (this.kjInfo == '') {
          $('.formaCon').eq(6).slideUp()
          this.blocks[6].isOpen = false
          this.blocks[6].status = 'initial'
        } else {
          this.blocks[6].isEditShow = false
          this.blocks[6].data.isEditShow = false
          this.blocks[6].status = 'tree'
        }
      }
    },
    // 屏蔽性
    submint8 (flag, index, item) {
      if (flag && item) {
        this.blocks[7].data = item
        this.blocks[7].isEditShow = item.isEditShow // 显示第一个编辑按钮
        this.blocks[7].data.isEditShow = item.isEditShow // 给子组件传递信息
        this.blocks[7].status = 'tree' // 右边悬浮标示
      } else {
        if (this.pbInfo == '') {
          $('.formaCon').eq(7).slideUp()
          this.blocks[7].isOpen = false
          this.blocks[7].status = 'initial'
        } else {
          this.blocks[7].isEditShow = false
          this.blocks[7].data.isEditShow = false
          this.blocks[7].status = 'tree'
        }
      }
    },
    // 校验是否为空
    checkNull (obj) {
      if (obj == '' || obj == undefined || obj.length == 0) {
        return false
      } else {
        return true
      }
    },
    // 屏蔽性抛出
    gainSc (data) {
      this.gainData = data
    },
    submitCharge (flag, index, item) {
      if (item && item.length !== 0) {
        this.blocks[8].data.isEditShow = false
        this.blocks[8].status = 'tree'
        this.blocks[8].isOpen = true
        this.blocks[8].isEditShow = false
        $('.formaCon')
              .eq(8)
              .slideDown() // 展开
        console.log('计费方案', item)
      } else {
        this.blocks[8].data.isEditShow = false
        this.blocks[8].isEditShow = false
        this.blocks[8].isOpen = false
        this.isPlanChange = true // 通知子组件改变
        this.blocks[8].status = 'initial'
        $('.formaCon')
              .eq(8)
              .slideUp() // 展开
      }
      if (flag && item) {
        this.blocks[8].data = item
      } else {
        if (this.billRules == undefined || this.billRules == '' || item.length === 0) {
          $('.formaCon').eq(8).slideUp()
          this.blocks[8].isOpen = false
          this.blocks[8].status = 'initial'
        } else {
          this.blocks[8].isEditShow = false
          this.blocks[8].data.isEditShow = false
          this.blocks[8].status = 'tree'
        }
      }
    }
  },
  components: {
    LabelView,
    baseInformation,
    imgConfig,
    homeConfig,
    htmlRequestb,
    htmlRequest,
    htmlRequestc,
    setSchemeRule,
    setUsableRule
  }
}
</script>
<style src="../../css/common/public.css" scoped></style>
<style src="../../css/createBasicService/newServiceCom.css" scoped></style>
<style>
#newServicePage .is-error .txet-ts {
  color: red;
}
#newServicePage.boxService .el-input__icon + .el-input__inner {
  width: auto;
}
#newServicePage .formboxru .form-tr::after {
  content: "";
}
/* .boxService .el-form-item__error{
	display: none;
} */
#newServicePage.boxService .forpz-con .el-form-item__label {
  font-weight: normal;
}
#newServicePage.boxService .forpz-con.rulseStyle .el-form-item {
  margin-bottom: 22px;
}
#newServicePage.boxService .el-radio-button {
  margin-right: 20px;
}
#newServicePage.boxService .el-checkbox-button {
  margin-right: 16px;
}
#newServicePage.boxService .el-radio-button__inner,
#newServicePage.boxService .el-checkbox-button__inner {
  border: 1px #cccccc solid;
  height: 30px;
  width: 80px;
  padding: 0;
  font-size: 12px;
  line-height: 29px;
  font-weight: normal;
}
#newServicePage.boxService .el-radio-button:last-child .el-radio-button__inner,
#newServicePage.boxService .el-checkbox-button:first-child .el-checkbox-button__inner,
#newServicePage.boxService .el-checkbox-button:last-child .el-checkbox-button__inner {
  border-radius: 0;
}
#newServicePage.boxService .el-radio-button:first-child .el-radio-button__inner {
  border-radius: 0;
}
#newServicePage.boxService .el-radio-button:first-child .el-radio-button__inner:hover {
  background-color: #ff9900;
  border: 1px #ff9900 solid;
  box-shadow: 0 0 0 0;
  color: #fff;
}
#newServicePage.boxService .el-radio-button__orig-radio:checked + .el-radio-button__inner {
  border-radius: 0;
}
#newServicePage.boxService .el-radio-button__orig-radio:checked + .el-radio-button__inner,
#newServicePage.boxService .el-radio-button__inner:hover,
#newServicePage.boxService .el-checkbox-button.is-checked .el-checkbox-button__inner,
#newServicePage.boxService .el-checkbox-button__inner:hover {
  background-color: #ff9900;
  border: 1px #ff9900 solid;
  box-shadow: 0 0 0 0;
  color: #fff;
}
#newServicePage.boxService .el-checkbox-button.is-checked .el-checkbox-button__inner::before {
  content: "";
  width: 18px;
  height: 18px;
  position: absolute;
  right: -1px;
  top: -1px;
  background: red;
  background: url("../../images/activeicon.png") no-repeat;
}
#newServicePage.boxService .radio-css .el-radio__label {
  position: absolute;
  width: 80px;
  height: 30px;
  text-align: center;
  line-height: 30px;
  padding: 0;
  left: 0;
  top: 0;
}
#newServicePage.boxService .radio-css .is-checked .el-radio__label {
  color: #fff;
}
#newServicePage.boxService .el-form-item.is-required .el-form-item__label:before {
  content: "";
}
#newServicePage.boxService .el-form-item__label,
#newServicePage.boxService .el-input,
#newServicePage.boxService .el-textarea__inner {
  font-size: 12px;
}
#newServicePage.boxService textarea {
  height: auto;
}
#newServicePage.boxService .serviceBtn {
  width: 80px;
  height: 30px;
  cursor: pointer;
  line-height: 30px;
  text-align: center;
  padding: 0;
}
#newServicePage.boxService .el-button--primary {
  background-color: #55a8fd;
  border-color: #55a8fd;
}
#newServicePage.boxService .el-button--default {
  background-color: #e3e3e3;
  border: 1px #e3e3e3 solid;
  color: #fff;
}
#newServicePage.boxService .el-button--default:hover {
  background-color: #55a8fd;
  border-color: #55a8fd;
  color: #fff;
}
#newServicePage.newService .el-dialog__body {
  min-height: 430px;
  padding-top: 20px;
}
#newServicePage.boxService .el-date-editor.el-input {
  width: 163px !important;
}
#newServicePage .newService .el-dialog__header {
  background-color: #fff;
  padding: 0;
  padding-bottom: 15px;
  border-bottom: 1px solid #eeeeee;
}
#newServicePage .newService .el-dialog__header .el-dialog__title {
  color: #1f2d3d !important;
}
#newServicePage .newService .el-dialog__headerbtn .el-dialog__close {
  color: #bfcbd9 !important;
}
#newServicePage .newService .el-dialog.el-dialog--small {
  padding: 20px 20px 0 20px;
}
#newServicePage.boxService .isShow {
  display: none !important;
}
#newServicePage.boxService .el-form-item__error{
  display: none
}
</style>
