<template>
    <div id="createApplication">
        <div class="rightfix">
			<ul>
				<li v-for="(item,index) in blocks" :class="item.status" :key="index">{{item.name}}</li>
			</ul>
		</div>
        <div class="tattop">应用管理·{{routerTitle}}·新建应用</div>
        <div v-for="(item,index) in blocks" :key="index" class="comcm" :class="{active:item.isOpen}">
			<div class="thade " @click="upSadt(index)">
				<span class="thade-cloe">
					<i class="icon iconfont" :class="item.icon"></i>
					<em>{{item.name}}</em>
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
			<set-basic-info v-if='index==0' @submit='submit' :msg='item.data' :appId='id' :isEdit="item.isEditShow" @cancel="resetEdit(index)"></set-basic-info>
      <!-- 文件上传 -->
      <app-upload v-if="index==1" @submit='submit' :msg='item.data' :appId='id' :isEdit="item.isEditShow" @cancel="resetEdit(index)"></app-upload>
		</div>
        <div class="apply-actions">
			<div>
				<b>服务需求单：</b>
				<span>分为应用服务、远程服务，用户可将原有应用系统上传到平台或提供远程访问地址，平台提供从中拆分成单一服务的能力。且拆分出的服务具有标准的数据对接接口，可单独调用或扩展应用于其他系统的最小服务单元，这种最小服务单元统称为原子服务。</span>
			</div>
			<button class="apply-btn back" @click="goBack()">返回</button>
			<button class="apply-btn submit" @click="submitAllAction()">提交</button>
		</div>
    </div>
</template>
<script>
import $ from 'jquery'
import setBasicInfo from './setBasicInfo.vue'
import apiClient from '../../../publicJs/ApiClient.js'
import appUpload from './appUpload.vue'
import LoadingBoxService from '../../../publicJs/LoadingBoxService.js'
import TipBoxService from '../common/TipBoxService.js'
export default {
  name: 'createApplication',
  components: {
    setBasicInfo,
    appUpload
  },
  data () {
    return {
      id: this.$route.query.id || '',
      routerSource: '',
      routerTitle: '',
      blocks: [
        {
          name: '基本信息',
          icon: 'icon-jichuxinxiguanli-copy',
          status: 'stant', // tree：完成；stant：正在操作；initial：未编辑；
          isOpen: true,
          isEditShow: null,
          data: {}
        },
        {
          name: '应用上传',
          icon: 'icon-jichuxinxiguanli-copy',
          status: '', // tree：完成；stant：正在操作；initial：未编辑；
          isOpen: false,
          isEditShow: null,
          data: {}
        }
      ]
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.routerSource = from.name
      if (from.name === 'enterpriseApp') {
        vm.routerTitle = '企业应用'
      } else if (from.name === 'myApp') {
        vm.routerTitle = '我的应用'
      } else if (from.name === 'thirdPartyApp') {
        vm.routerTitle = '第三方应用'
      } else {
        vm.routerTitle = '应用'
      }
    })
  },
  mounted () {
    this.initUI()
    if (this.id != '') {
      this.getData()
    }
  },
  methods: {
    // 初始化样式
    initUI () {
      let vm = this
      $('.apply-actions').css({ width: vm.getControllerWidth() + 'px' })
      if (window.iscEvent) {
        window.iscEvent.on('menuchange', function () {
          let targetW = vm.getControllerWidth()
          $('.apply-actions').animate({ width: targetW + 'px' }, 500)
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
    // 转为编辑完成状态
    onEditOver (index) {
      this.blocks[index].status = 'tree'
      this.blocks[index].isEditShow = false
      if (!this.blocks[index].isOpen || index == 0) {
        this.onOpenBlock(index)
      }
    },
    // 获取应用数据
    getData () {
      let vm = this
      apiClient.post('/itsmApi/application/loadApp', { app_id: this.id }, function (data) {
        let datas = data.results.data
        console.log(datas)
        if (typeof (datas.app_tag) === 'string') {
          let tagArr = []
          tagArr = datas.app_tag.split(',')
          vm.blocks[0].data.app_tag = [...tagArr]
        } else {
          vm.blocks[0].data.app_tag = datas.app_tag
        }
        vm.blocks[0].data.app_name = datas.app_name
        vm.blocks[0].data.app_version = datas.app_version
        vm.blocks[0].data.app_remark = datas.app_remark
        vm.onEditOver(0)
        vm.blocks[1].data.archiver_real_name = datas.archiver_real_name
        vm.blocks[1].data.archiver_name = datas.archiver_name
        vm.blocks[1].data.archiver_size = datas.archiver_size
        vm.onEditOver(1)
      })
    },
    submit (flag, item, index) {
      if (flag && item) {
        if (index == 0) {
          this.id = item.id
          this.blocks[0].data = item
          this.onEditOver(index)
          this.$router.push({ name: 'createApplication', query: { id: this.id } })
        }
        if (index == 1) {
          this.blocks[1].data = item
          this.onEditOver(index)
        }
      }
    },
    submitAllAction () {
      let that = this
      let flag = true
      let tipNodes = ''
      let myData = {
        id: this.id,
        operate_page: '3'
      }
      for (let i = 0; i < that.blocks.length; i++) {
        if (that.blocks[i].status != 'tree') {
          flag = false
          tipNodes += '“' + that.blocks[i].name + '”' + '，'
        }
      }
      if (flag) {
        LoadingBoxService.open('正在保存，请稍候...')
        apiClient.post('/itsmApi/application/operateApp', myData, function (data) {
          LoadingBoxService.close()
          that.$router.push({ name: 'myApp' })
        })
      } else {
        tipNodes = tipNodes.substring(0, tipNodes.length - 1) + '信息未填写完整，当前无法提交审核！'
        TipBoxService.open(tipNodes, 2)
      }
    },
    // 编辑
    onEdit (index) {
      let vm = this
      vm.blocks[index].isEditShow = true
      this.blocks[index].status = 'stant'
      vm.onOpenBlock(index)
    },
    resetEdit (index) {
      this.blocks[index].isEditShow = false
      this.blocks[index].status = 'tree'
    },
    // 关闭模块
    onCloseBlock (index) {
      this.blocks[index].isOpen = false
      $('.formaCon')
        .eq(index)
        .slideUp()
    },
    // 打开模块
    onOpenBlock (index) {
      this.blocks[index].isOpen = true
      $('.formaCon')
        .eq(index)
        .slideDown() // 展开
    },
    // 点击手风琴
    upSadt (index) {
      let isEdit = true
      let editList = [1, 4, 5, 6]
      this.blocks.forEach(function (v, i) {
        if (v.status == 'stant') {
          isEdit = false
        }
      })
      if (isEdit || this.blocks[index].status == 'tree') {
        if (this.blocks[index].status != 'tree') {
          if (index == 3 && this.blocks[2].status != 'tree') {
            return
          }
          this.blocks[index].status != 'stant' ? 'stant' : 'initial'
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
    goBack () {
      this.$router.push({
        name: this.routerSource || 'myApp'
      })
    }
  }
}
</script>
<style src="../../css/common/public.css" scoped></style>
<style src="../../css/createApp/createApplication.css" scoped></style>

