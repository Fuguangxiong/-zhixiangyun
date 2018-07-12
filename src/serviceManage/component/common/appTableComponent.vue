<template>
  <div id="tableComponent">
    <div class="queryListWord">
      <!-- 排序 -->
      <div class="sortCon">
        <span v-for='(item, index) in sortSetting' 
              class="sortWord" 
              :class="{active:item.active,wordUp:sortType=='asc'}"
              :key="index"
              @click="onSort(index)">
          <em :class="{noSortType:!item.sortType}">{{item.label}}</em>
          <i v-show='item.sortType' class="icon iconfont icon-jiantou-up"></i>
          <i v-show='item.sortType' class="icon iconfont icon-jiantou-lower"></i>
        </span>
      </div>
      <!-- 批量操作按钮 -->
      <div class="checkboxCon" v-show="isBatchOperation">
        <!-- <div class="checkboxBut" @click="toBatchOperation"><i class="icon iconfont icon-caozuo"></i></div> -->
        <div class="checkboxBut"><i class="icon iconfont icon-caozuo"></i></div>
      </div>
      <!-- 小分页 -->
      <div class="topPage">
        <em v-show='totalNumber!=0'><i class="cloer">{{paging.pageNum}}</i>/{{pageTotal}}</em>
        <span class="icon iconfont icon-arrow-left" @click="toPage(paging.pageNum-1)"></span>
        <span class="icon iconfont icon-right" @click="toPage(paging.pageNum+1)"></span>
        <div :class='pageTotal==0?"pageNoneZero":pageTotal==1?"pageNone":"pageBlock"'></div>
      </div>
      <!-- 批量操作列表 -->
      <div class="more" v-show="false">
        <div  class="sure">删除</div>
        <div class="cancel" >取消</div>
      </div>
    </div>
    
    <div class="listCon" :class='{"no-data":totalNumber==0}'>
      <!-- 列表 -->
      <div v-for="(item,index) in tableList"  :key="index" class="listLi" :class="{abnormalClx:true}">
        <div class="listLiLeft app-listLiLeft" :class="{scheme:item.scheme_status,'userInfo':item.sourceType =='userNumInfo'}">
          <dl>
            <!-- <dd :class="{scheme:item.scheme_status,'userInfo':item.sourceType =='userNumInfo'}">
              <img v-show="item.audit_status=='0'" src="../../images/draft.png" alt="草稿" />
              <img v-show="item.sourceType!='userNumInfo'&&item.img && item.audit_status!='0'" :src="apiBaseUrl +'/itsmApi/attachment/show?imgPath='+item.img" alt="logo" />
              <img v-show="item.sourceType=='userNumInfo'&&item.img" :src="apiBaseUrl +'/pcapi/enterprise/pcShowImage/avatar?imgPath='+item.img+ '&token=' + token" alt="用户头像" />
              <img v-show="!item.scheme_status && !item.img && item.audit_status!='0'" src="../../images/logo-sm-default.jpg" alt="" />
              <img v-if="item.scheme_status == 0" src="../../images/cg.jpg" alt="">
              <img v-if="item.scheme_status == 1" src="../../images/yfb.jpg" alt="">
              <img v-if="item.scheme_status == 3" src="../../images/ysc.jpg" alt="">
              <img v-if="item.scheme_status == 4" src="../../images/ygq.jpg" alt="">
              <span v-show='item.corner && item.corner.show' class="cornerIcon" :class="item.corner?item.corner.className:''">{{item.corner?item.corner.text:''}}</span>
            </dd> -->
            <dt class='watermark' :class='item.watermarkClass'>
              <h2>
                <a v-show='item.name'  href='#' class='listLiLeftName'>
                  {{item.name}}
                  <b v-show='item.change_id'>（变更中）</b>
                </a>
                <span v-show='true' class='listLiLeftName' @click='onClickName(item)'>{{item.app_name}}</span>
                <span v-if='item.tag' v-for="(tag,i) in item.tag" class='statueTag' :class='tag.className' :key="i">{{tag.text}}</span>
              </h2>
              <el-row :gutter="15" style="padding-right:260px;">
                <el-col v-for='(detail, detailIndex) in item.detail' 
                        :span="detail.width=='short'? 6 : 24"
                        :key="detailIndex"
                        :offset="detail.wrap? 4 : 0">    
                  <h3>
                    {{detail.label}}：
                    <span :class='{clickable:detail.icon}' @click='onClickDetail(detail.str,item)'>
                      {{detail.value}}
                      <i v-if='detail.icon' class='icon iconfont' :class='detail.icon'></i>
                    </span>
                  </h3>
                </el-col>
              </el-row>
            </dt>
          </dl>

          <el-dropdown class='senior' trigger="click" v-show='item.seniorBtns.length>0'>
            <span class="el-dropdown-link">
              高级<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown" class='sm-senior'>
              <el-dropdown-item  v-for="(btn, btnIndex) in seniorBtns"
                                v-show='item.seniorBtns.includes(btn.str)'
                                :key="btnIndex">
                <span class='seniorBtn' @click="onClickTableBtn(btn.str, item)">{{ btn.label }}</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>

        <!-- 最右侧 -->
        <div class="setCheok">
          <div class="setCheokCon" v-show="true">
            <div class="setDat">
              <div class="titles"><i class="icon iconfont icon-shijianzhongbiao"></i><em> {{item.rightBlock.label}}</em> </div>
              <p>{{item.rightBlock.value || '-- 暂无 --'}}</p>
            </div>
            <div v-if='item.rightBlock.button' class="setEsc" @click="onClickTableBtn(item.rightBlock.button.str, item)"><button>{{item.rightBlock.button.label}}</button></div>
          </div>
          <div class="plDel">
            <i v-show="item.checked" class="icon iconfont icon-xuanzhong1"></i>
            <i v-show="!item.checked" class="icon iconfont icon-weixuanzhong"></i>
          </div>
        </div>
      </div>

      <!-- 大分页 -->
      <el-pagination v-show='pageTotal>1'
                    layout="prev, pager, next, jumper"
                    :current-page.sync="paging.pageNum"
                    :page-size="paging.pageSize"
                    :total="totalNumber"
                    @current-change="toPage">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import apiClient from '../../../publicJs/ApiClient.js'
import $ from 'jquery'
export default {
  props: {
    sortSetting: {}, // 排序数据
    tableList: {},
    totalNumber: 0
  },
  data: function () {
    return {
      apiBaseUrl: apiClient.apiBaseUrl,
      token: apiClient.token,
      sortField: '', // 排序字段
      sortText: '',
      sortType: '', // 排序方式
      paging: {
        total: 0, // 查询结果的总条数
        pageNum: 1, // 当前页
        pageSize: 10 // 每页显示条数
      },
      isBatchOperation: true, // 是否显示批量操作菜单
      params: {},
      corner_icon_dic: [],
      watermark_dic: [],
      statusTag_dic: [],
      seniorBtns: []
    }
  },
  computed: {
    // 总页数
    pageTotal: function () {
      return Math.ceil(this.totalNumber / this.paging.pageSize)
    }
  },
  watch: {
    tableList: function (nv, ov) {
      if (this.totalNumber === 0) {
        setTimeout(function () {
          $('.no-data').height($(window).height() - $('.conCent').height() - 160)
        }, 30)
      }
    }
  },
  created () {
    this.init()
  },
  mounted () {
    this.onQuery()
  },
  methods: {
    // 参数初始化
    init: function () {
      let vm = this
      vm.initSeniorBtns()
      vm.initSort()
    },
    // 初始化高级按钮
    initSeniorBtns: function () {
      let vm = this
      vm.seniorBtns = [
        { label: '编辑', str: 'edit' },
        { label: '撤消', str: 'revokeRegist' },
        { label: '删除', str: 'delete' }, // 物理删除 未审批之前
        { label: '停止', str: 'stop' },
        { label: '强行停止', str: 'forciblyStop' },
        { label: '启动', str: 'start' },
        // { label: '上架', str: 'up' },
        // { label: '下架', str: 'down' },
        { label: '部署', str: 'deploy' },
        { label: '维护', str: 'maintain' },
        { label: '删除', str: 'deleteStatus' },
        { label: '查看创建申请', str: 'viewApplyRegist' }
      ]
    },
    // 初始化排序参数
    initSort: function () {
      let vm = this
      // vm.sortSetting = [...vm.sortSetting];
      vm.sortSetting.forEach(function (v, i) {
        if (v.default) {
          v.active = true
          vm.sortField = v.paramName
          vm.sortText = v.label
          if (v.sortType) {
            vm.sortType = v.sortType
          }
        } else {
          v.active = false
        }
      })
    },
    // 点击排序按钮
    onSort: function (index) {
      let vm = this
      let obj = vm.onCopy(index)

      if (!obj.sortType && vm.sortText === obj.label) {
        return
      } else {
        if (vm.sortText !== obj.label) {
          console.log('3333333')
          vm.sortField = obj.paramName
          vm.sortType = obj.sortType
          vm.sortText = obj.label
          vm.unActive()
          obj.active = true
        } else {
          console.log('0000000000')
          if (obj.sortType) {
            if (vm.sortType === 'asc') {
              vm.sortType = 'desc'
            } else {
              vm.sortType = 'asc'
            }
          } else {
            vm.sortType = ''
          }
        }
      }
      vm.reCopy(index, obj)
      vm.onQuery()
    },
    // 取消排序选中状态
    unActive: function () {
      let vm = this
      vm.sortSetting.forEach(function (v, i) {
        if (v.active === true) {
          let o = vm.onCopy(i)
          o.active = false
          vm.reCopy(i, o)
        }
      })
    },
    // 打开批量操作菜单
    toBatchOperation: function () {
      this.$alert('抱歉，该功能尚未开放！', '提示', {
        confirmButtonText: '确定',
        callback: action => {}
      })
    },
    // 翻页
    toPage: function (page) {
      if (page >= 1 && page <= this.pageTotal) {
        this.paging.pageNum = page
        this.onQuery()
      }
    },
    // 点击名称
    onClickName: function (item) {
      this.$emit('clickName', item)
    },
    // 点击table按钮
    onClickTableBtn: function (str, item) {
      this.$emit('clickBtn', str, item)
    },
    // 点击详细信息
    onClickDetail: function (str, item) {
      if (str) {
        this.$emit('clickDetail', str, item)
      }
    },
    // 查询
    onQuery: function () {
      let vm = this
      vm.params.sortField = vm.sortField
      vm.params.sortType = vm.sortType || ''
      vm.params.pageNum = vm.paging.pageNum
      vm.params.pageSize = vm.paging.pageSize
      vm.$emit('sort', vm.params)
    },
    // 深拷贝sortSetting[index]
    onCopy: function (index) {
      let vm = this
      let obj = Object.assign({}, vm.sortSetting[index])
      return obj
    },
    // 将修改后的数据赋回sortSetting[index]
    reCopy: function (index, obj) {
      let vm = this
      vm.$set(vm.sortSetting, index, obj)
    }
  }
}
</script>
<style src="../../css/common/appTableComponent.css" scoped></style>
<style>
.sm-senior.el-dropdown-menu {
  z-index: 99 !important;
}
.pageNone{
  position:  relative;
  left: 36px;
  opacity: 0.5;
  /* cursor: not-allowed; */
  width: 83px;
  height: 30px;
  display: block;
}
.pageNoneZero{
  position:  relative;
  left: 0;
  opacity: 0.5;
  /* cursor: not-allowed; */
  width: 83px;
  height: 30px;
  display: block;
}
.pageBlock{
  display: none;
}
</style>
