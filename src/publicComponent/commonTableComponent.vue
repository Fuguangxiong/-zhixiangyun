<template>
  <div class="box">
    <div class="commonTableControlContainer">
      <div class="commonCheckBtnContainer">
        <!-- <el-checkbox :checked="item.select" v-for="(item,index) in tagCheckData" :key="index" @change="checkSelectHandler(index)">{{item.name}}</el-checkbox> -->
        <div v-for="(item,index) in tagCheckData" :key="index" class="commonCheckItem" v-on:click="checkSelectHandler(index)">
          <span class="iconfont check" v-bind:class="{'icon-xuanzhong5':item.select,'icon-checkbox':!item.select}"></span>
          <span class="tableSelectBtnText">{{item.name}}</span>
        </div>
      </div>
      <div class="commonSearchContainer">
        <div class="commonTableSearch">
          <i class="commonTableSearchIcon  iconfont icon-sousuo" v-on:click="interfaceSearchHandler()"></i>
          <input class="commonTableSearchInput" placeholder="请输入关键字" v-on:keyup.enter="interfaceSearchHandler()" v-model="keyWords" />
        </div>
      </div>
    </div>
    <div class="filter clearfix">
      <!-- <slot name="tagSelct" class="filterItem"></slot> -->
      <!-- 数据资源标签 -->
      <div v-show="bodyData.resourceType === 0" @mouseleave="dataTagshow=false" @click.stop="dataTagshow = !dataTagshow" class="filterItem tagSelct tag-search">
        <span :title="resources">{{resources}}</span>
        <i class="iconfont icon-xiala1"></i>
        <div class="tagbox" v-show="dataTagshow">
          <input type="text" class="tag-input" v-model='tagSearchName' @click.stop="preventClick" @keyup="searchTag" placeholder="请输入关键字">
          <p v-show="bodyDataTags.data.length === 0"  @click.stop="preventClick" class="no-result">无结果</p>
          <p :title="item" v-for="(item,index) in bodyDataTags.data" @click.stop="tagSelectHandler(item,bodyDataTags.tagId,bodyDataTags.name)" :key="index">{{item}}</p>
        </div>
      </div>
      <!-- 所在部门标签 -->
      <div v-show="bodyData.resourceType === 0 && enterpriseTags.tagId" @mouseleave="enterpriseTagshow=false" @click.stop="enterpriseTagshow = !enterpriseTagshow" class="filterItem tagSelct">
        <span :title="enterprise">{{enterprise}}</span>
        <i class="iconfont icon-xiala1"></i>
        <div class="tagbox" v-show="enterpriseTagshow">
          <p :title="item" v-for="(item,index) in enterpriseTags.data" @click="tagSelectHandler(item,enterpriseTags.tagId,enterpriseTags.name)" :key="index">{{item}}</p>
        </div>
      </div>
      <!-- 接口标签 -->
      <div v-show="bodyData.resourceType === 1" @mouseleave="dataTagshow=false" @click.stop="dataTagshow = !dataTagshow" class="filterItem tagSelct tag-search">
        <span :title="interfaceTag">{{interfaceTag}}</span>
        <i class="iconfont icon-xiala1"></i>
        <div class="tagbox" v-show="dataTagshow">
          <input type="text" class="tag-input" v-model='tagSearchName' @click.stop="preventClick" @keyup="searchTag" placeholder="请输入关键字">
          <p v-show="bodyDataTags.data.length === 0"  @click.stop="preventClick" class="no-result">无结果</p>
          <p :title="item" v-for="(item,index) in bodyDataTags.data" @click="tagSelectHandler(item,bodyDataTags.tagId,bodyDataTags.name)" :key="index">{{item}}</p>
        </div>
      </div>
      <!-- 数据元标签 -->
      <div v-show="bodyData.resourceType === 2" @mouseleave="dataTagshow=false" @click.stop="dataTagshow = !dataTagshow" class="filterItem tagSelct tag-search">
        <span :title="metadataTag">{{metadataTag}}</span>
        <i class="iconfont icon-xiala1"></i>
        <div class="tagbox" v-show="dataTagshow">
          <input type="text" class="tag-input" v-model='tagSearchName' @click.stop="preventClick" @keyup="searchTag" placeholder="请输入关键字">
          <p v-show="bodyDataTags.data.length === 0"  @click.stop="preventClick" class="no-result">无结果</p>
          <p :title="item" v-for="(item,index) in bodyDataTags.data" @click="tagSelectHandler(item,bodyDataTags.tagId,bodyDataTags.name)" :key="index">{{item}}</p>
        </div>
      </div>
      <!-- <slot name="timeSelect" class="filterItem"></slot> -->
      <div v-show="bodyData.resourceType || bodyData.resourceType === 0" class="filterItem" v-on:click="interfaceSortHandler()">
        <span>创建时间</span>
        <i class="timeDefault" :class="{up:!timedown,down:timedown}"></i>
      </div>
    </div>
    <div class="commonTableContainer">
      <div v-show="!isLoading" class="datacontent" v-for="(item,index) in bodyData.data || bodyData.dataList" :key="index">
        <i class="iconfont icon-shuju"></i>
        <slot :name="'linedata'+index">{{index}}</slot>
        <div class="control" v-on:click.stop="stopEventHandler">
          <span v-if="item.switchShow" class="switch">
            <span class="commonSwitchContainer">
              <el-switch v-model="item.switchData" :width="55" on-color="#cccccc" off-color="#55a8fd" on-text="停用" off-text="启用" @change="itemSwitchHandler(item)"></el-switch>
            </span>
          </span>
          <span v-if="item.editShow">
            <span v-if="verifyPermission('009007003')">
              <el-tooltip content="编辑" placement="right" effect="light">
                <i class="iconfont icon-bianji2" v-on:click="itemEditHandler(item,'edit')"></i>
              </el-tooltip>
            </span>
          </span>
          <span v-if="item.removeShow">
            <span v-if="verifyPermission('009007004')">
              <el-tooltip content="删除" placement="right" effect="light">
                <i class="iconfont icon-3" v-on:click="itemRemoveHandler(item)"></i>
              </el-tooltip>
            </span>
          </span>
          <span v-if="item.approvalShow">
            <privibutton :type="{name:typeName.name,childrenName:typeName.childrenName,code:'approve'}">
              <el-tooltip content="审批" placement="right" effect="light">
                <i class="iconfont icon-shenpi" v-on:click="itemEditHandler(item,'approval')"></i>
                <!-- <a class="commonTableApprovalBtn" v-on:click="itemEditHandler(item,'approval')"></a> -->
              </el-tooltip>
            </privibutton>
          </span>
          <span v-if="item.revokeShow">
            <el-tooltip content="撤销" placement="right" effect="light">
              <a class="commonTableApprovalBtn revokeShow" v-on:click="itemEditHandler(item,'revoke')"></a>
            </el-tooltip>
          </span>
          <span v-if="item.renewShow">
            <el-tooltip content="更新" placement="right" effect="light">
              <a class="commonTableApprovalBtn renewShow" v-on:click="itemEditHandler(item,'renew')"></a>
            </el-tooltip>
          </span>
          <span v-if="item.maintenanceShow">
            <el-tooltip content="维护" placement="right" effect="light">
              <a class="commonTableApprovalBtn maintainShow" v-on:click="itemEditHandler(item,'maintenance')"></a>
            </el-tooltip>
          </span>
          <span v-if="item.upShow">
            <el-tooltip content="上架" placement="right" effect="light">
              <a class="commonTableApprovalBtn upShow" v-on:click="itemEditHandler(item,'up')"></a>
            </el-tooltip>
          </span>
          <span v-if="item.downShow">
            <el-tooltip content="下架" placement="right" effect="light">
              <a class="commonTableApprovalBtn downShow" v-on:click="itemEditHandler(item,'down')"></a>
            </el-tooltip>
          </span>
          <span v-if="item.deployShow">
            <el-tooltip content="部署" placement="right" effect="light">
              <a class="commonTableApprovalBtn deployShow" v-on:click="itemEditHandler(item,'deploy')"></a>
            </el-tooltip>
          </span>
          <span v-if="item.cancelShow">
            <el-tooltip content="取消" placement="right" effect="light">
              <a class="commonTableApprovalBtn cancelShow" v-on:click="itemEditHandler(item,'cancel')"></a>
            </el-tooltip>
          </span>
          <span v-if="item.lookReasonShow">
            <span v-if="verifyPermission('009007002')">
              <el-tooltip content="查看原因" placement="right" effect="light">
                <i class="iconfont icon-wentifankuiHD" v-on:click.stop="infterfaceItemLookHandler(item,'查看原因')"></i>
              </el-tooltip>
            </span>
          </span>
          <span v-if="item.lookDataShow">
            <span v-if="verifyPermission('009007005')">
              <el-tooltip content="查看数据" placement="right" effect="light">
                <i class="iconfont icon-yulan" v-on:click.stop="dataDetailHandler(item,'查看数据')"></i>
              </el-tooltip>
            </span>
          </span>
          <span v-if="item.lookApprovalShow">
            <span v-if="verifyPermission('009007001')">
              <el-tooltip content="查看详情" placement="right" effect="light">
                <i class="iconfont icon-chakan-" v-on:click.stop="infterfaceItemLookHandler(item,'查看申请')"></i>
              </el-tooltip>
            </span>
          </span>
          <span v-if="item.lookProcessShow">
            <el-tooltip content="查看审批流程" placement="right" effect="light">
              <a class="approval commonTableLookBtn" v-bind:class="{}" v-on:click.stop="infterfaceItemLookHandler(item,'查看审批流程')"></a>
            </el-tooltip>
          </span>
          <span v-if="item.changeLabel">
            <privibutton :type="{name:typeName.name,childrenName:typeName.childrenName, code:'modifyTag'}">
              <el-tooltip content="修改标签" placement="right" effect="light">
                <i class="iconfont icon-biaoqian" v-bind:class="{}" v-on:click.stop="itemEditHandler(item,'changeLabel')"></i>
              </el-tooltip>
            </privibutton>
          </span>

        </div>
        <!-- <div class="msg">
                <div class="text">
                  <slot name="one"></slot>
                  <span>{{headerData[0].name}}</span>
                  <span></span>
                </div>
              </div>
              <div class="msg">
                <div class="text">
                  <slot name="two1"></slot>
                  <span>{{headerData[1].name}}</span>
                  <span></span>
                </div>
                <div class="text">
                  <slot name="two2"></slot>
                  <span>{{headerData[2].name}}</span>
                  <span></span>
                </div>
                <div class="text">
                  <slot name="two3"></slot>
                  <span>{{headerData[3].name}}</span>
                  <span></span>
                </div>
              </div>
              <div class="msg">
                <div class="text">
                  <slot name="three1"></slot>
                  <span>{{headerData[4].name}}</span>
                  <span></span>
                </div>
                <div class="text">
                  <slot name="three2"></slot>
                  <span>{{headerData[5].name}}</span>
                  <span></span>
                </div>
                <div class="text">
                  <slot name="three3"></slot>
                  <span>{{headerData[6].name}}</span>
                  <span></span>
                </div>
              </div> -->
      </div>
      <!-- <table class="commonTable" :class="{imgLine:imgLine}">
                <thead>
                <tr>
                  <th v-for="(item,index) in headerData"><span v-if="item.textShow">{{item.name}}</span>
                    <div v-if="item.tagSelct" v-on:click.stop="tagContainerOpenHandler(item)" class="commonTableMarketBtn"><span>{{item.name}}</span><i class="commonTableMarketBtnIcon"></i>
                      <div class="commonTableTagContainer" v-show="item.tagOpen">
                        <p v-for="(item2,index) in item.tagsData.data" class="commonTableTag" v-on:click="tagSelectHandler(item2,item)">{{item2}}</p>
                      </div>
                    </div>
                    <div v-if="item.timeSelect" class="commonTalbeUploadTimeBtn" v-bind:class="{up:sort}" v-on:click="interfaceSortHandler()">{{item.name}}</div>
                    <div v-if="item.visitSelect" class="commonTalbeUploadTimeBtn" v-bind:class="{up:visitSort}" v-on:click="visitSortHandler()">{{item.name}}</div>
                  </th>
                </tr>
                </thead>
                <tbody class="admin " v-show="!isLoading">
                   <tr v-for="(item,index) in bodyData" v-bind:class="item.class" v-on:click="itemTrHandler(item)">
                      <td v-for="(val,index2) in item.lineData">
                        <span v-if="!val.control" :title="val.name" v-bind:class="{commonStateText:val.stateText}">{{val.name}}<span class="commonTableImg" v-if="val.img" v-bind:style="{ 'background-image': 'url(' + val.imgSrc + ')' }"></span></span>
                        <span v-if="val.control" v-on:click.stop="stopEventHandler">
                          <span v-if="item.switchShow"><span class="commonSwitchContainer"> <el-switch v-model="item.switchData" on-color="#1bb617" off-color="#b2b2b2" on-text="启用" off-text="停用" @change="itemSwitchHandler(item)"></el-switch></span></span>
                          <span v-if="item.editShow"><el-tooltip content="编辑" placement="right" effect="light"><a class="commonTableEditBtn" v-on:click="itemEditHandler(item,'edit')"></a></el-tooltip></span>
                          <span v-if="item.removeShow"><el-tooltip content="删除" placement="right" effect="light"><a class="commonTableRemoveBtn" v-on:click="itemRemoveHandler(item)"></a></el-tooltip></span>
                          <span v-if="item.approvalShow"><el-tooltip content="审批" placement="right" effect="light"><a class="commonTableApprovalBtn" v-on:click="itemEditHandler(item,'approval')"></a></el-tooltip></span>
                          <span v-if="item.revokeShow"><el-tooltip content="撤销" placement="right" effect="light"><a class="commonTableApprovalBtn revokeShow" v-on:click="itemEditHandler(item,'revoke')"></a></el-tooltip></span>
                          <span v-if="item.renewShow"><el-tooltip content="更新" placement="right" effect="light"><a class="commonTableApprovalBtn renewShow" v-on:click="itemEditHandler(item,'renew')"></a></el-tooltip></span>
                          <span v-if="item.maintenanceShow"><el-tooltip content="维护" placement="right" effect="light"><a class="commonTableApprovalBtn maintainShow" v-on:click="itemEditHandler(item,'maintenance')"></a></el-tooltip></span>
                          <span v-if="item.upShow"><el-tooltip content="上架" placement="right" effect="light"><a class="commonTableApprovalBtn upShow" v-on:click="itemEditHandler(item,'up')"></a></el-tooltip></span>
                          <span v-if="item.downShow"><el-tooltip content="下架" placement="right" effect="light"><a class="commonTableApprovalBtn downShow" v-on:click="itemEditHandler(item,'down')"></a></el-tooltip></span>
                          <span v-if="item.deployShow"><el-tooltip content="部署" placement="right" effect="light"><a class="commonTableApprovalBtn deployShow" v-on:click="itemEditHandler(item,'deploy')"></a></el-tooltip></span>
                          <span v-if="item.cancelShow"><el-tooltip content="取消" placement="right" effect="light"><a class="commonTableApprovalBtn cancelShow" v-on:click="itemEditHandler(item,'cancel')"></a></el-tooltip></span>
                          <span v-if="item.lookReasonShow">
                            <el-tooltip content="查看原因" placement="right" effect="light"><a class="erro commonTableLookBtn" v-bind:class="{}" v-on:click.stop="infterfaceItemLookHandler(item,'查看原因')"></a></el-tooltip>
                          </span>
                          <span v-if="item.lookApprovalShow"><el-tooltip content="查看详情" placement="right" effect="light"><a class="wait commonTableLookBtn" v-on:click.stop="infterfaceItemLookHandler(item,'查看申请')"></a></el-tooltip></span>
                          <span v-if="item.lookProcessShow">
                            <el-tooltip content="查看审批流程" placement="right" effect="light"><a class="approval commonTableLookBtn" v-bind:class="{}" v-on:click.stop="infterfaceItemLookHandler(item,'查看审批流程')"></a></el-tooltip>
                          </span>
                        </span>
                      </td>
                   </tr>
                </tbody>
              </table> -->

    </div>
    <div v-show="isLoading" class="commonTableTipMsg">{{tipMsg}}</div>
    <div v-show="!isLoading" class="paginationContainer">
      <div class="block" v-show="pageTotal > 10">
        <el-pagination @current-change="interfacePaginatChangeHandler" layout="total,prev,pager,next,jumper" :current-page.sync="pageNum" :page-size="pageSize" :total="pageTotal">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import $ from 'jquery'
import LoadingBoxService from '../publicJs/LoadingBoxService.js'
import privibutton from '@/publicComponent/privibutton'

export default {
  components: {
    privibutton
  },
  props: [
    'bodyData',
    'headerData',
    'tagCheckData',
    'tagsData',
    'componentType',
    'resourcesTag',
    'pageTotal',
    'imgLine',
    'link',
    'typeName',
    'errorMsg'
  ],
  data: function () {
    return {
      interfaceTag: '接口标签',
      resources: '资源标签',
      metadataTag: '数据元标签',
      enterprise: '所在单位',
      timedown: true,
      enterpriseTagshow: false,
      dataTagshow: false,
      pageNum: 1,
      pageSize: 10,
      tagSelectShow: false,
      keyWords: '',
      selectTag: '',
      sort: 0, // 倒序
      visitSort: 3, // 默认为3，按照申请时间去排序
      tipMsg: '',
      isLoading: true,
      headerDataClone: this.headerData,
      switchValue: true,
      bodyDataTags: { data: [], tagId: '', name: '' },
      enterpriseTags: { data: [], tagId: '', name: '' },
      tagSearchName: '',
      searchResultData: []
    }
  },
  created () {
    // console.log(this.tagCheckData)
    this.createInterfaceData()
  },
  mounted () {
  },
  watch: {
    link: function (val, oldVal) {
      // console.info('link', val)
      // console.info('oldVal', oldVal)
      if (val !== oldVal) {
        this.pageNum = 1
        this.createInterfaceData()
      }
    },
    errorMsg (val, oldVal) {
      this.tipMsg = val
    },
    'bodyData.tags': function (val, old) {
      if (val && val.length > 0) {
        this.bodyDataTags.data = val[0].data
        this.searchResultData = val[0].data
        this.bodyDataTags.tagId = val[0].tag
        this.bodyDataTags.name = val[0].name
        if (val[1]) {
          this.enterpriseTags.data = val[1].data
          this.enterpriseTags.tagId = val[1].tag
          this.enterpriseTags.name = val[1].name
        }
      }
    },
    'bodyData.data': function (val, oldVal) {
      //         console.info("cccccc=",val);
      // console.log(val, this.componentType, 2222)
      LoadingBoxService.close()
      if (val !== 'error') {
        // this.tipMsg="数据加载失败";
        if (val && val.length > 0) {
          this.isLoading = false
        } else {
          // console.log(this.componentType, 1111111)
          this.tipMsg = '无数据'
        }
      } else {
        this.tipMsg = '数据加载失败'
      }
    },
    'bodyData.dataList': function (val, oldVal) {
      //         console.info("cccccc=",val);
      // console.log(val, this.componentType, 2222)
      LoadingBoxService.close()
      if (val !== 'error') {
        // this.tipMsg="数据加载失败";
        if (val.length > 0) {
          this.isLoading = false
        } else {
          // console.log(this.componentType, 1111111)
          this.tipMsg = '无数据'
        }
      } else {
        this.tipMsg = '数据加载失败'
      }
    }
  },
  methods: {
    createInterfaceData () {
      var that = this
      var status = new Array()
      var tagCheckData = this.tagCheckData
      for (var i = 0; i < tagCheckData.length; i++) {
        var obj = tagCheckData[i]
        if (obj.select === true) {
          status.push(obj.statu)
        }
      }
      var statusStr = status.toString()
      var linkObj = {
        resourceType: that.componentType,
        searchParam: that.keyWords,
        status: statusStr,
        tag: that.selectTag,
        sort: that.sort,
        visitSort: that.visitSort,
        pageNum: that.pageNum,
        pageSize: that.pageSize
      }
      this.isLoading = true
      this.tipMsg = ''
      LoadingBoxService.open('数据加载中...')
      this.$emit('change', linkObj)
    },
    interfacePaginatChangeHandler (data) {
      this.pageNum = data
      this.createInterfaceData()
    },
    checkSelectHandler (val) {
      this.tagCheckData[val].select = !this.tagCheckData[val].select
      this.pageNum = 1
      this.createInterfaceData()
    },
    interfaceSearchHandler () {
      this.pageNum = 1
      this.createInterfaceData()
    },
    interfaceSortHandler () {
      this.timedown = !this.timedown
      if (this.sort == 0) {
        this.sort = 1
      } else {
        this.sort = 0
      }
      this.pageNum = 1
      this.visitSort = ''
      this.createInterfaceData()
    },
    visitSortHandler () {
      if (this.visitSort == 0) {
        this.visitSort = 1
      } else {
        this.visitSort = 0
      }
      this.pageNum = 1
      this.createInterfaceData()
    },
    infterfaceItemLookHandler (item, val) {
      item.tipText = val
      this.$emit('look', item)
    },
    dataDetailHandler (item, val) {
      item.tipText = val
      this.$emit('dataDetail', item)
    },
    itemEditHandler (item, type) {
      // console.info("eiditId=",item.id);
      // var data={type:"edit",id:item.id};
      item.tableItemChangeType = type
      item.commonTableResourceType = this.componentType

      var that = this
      var status = new Array()
      var tagCheckData = this.tagCheckData
      for (var i = 0; i < tagCheckData.length; i++) {
        var obj = tagCheckData[i]
        if (obj.select == true) {
          status.push(obj.statu)
        }
      }
      var statusStr = status.toString()
      item.linkObj = {
        resourceType: that.componentType,
        searchParam: that.keyWords,
        status: statusStr,
        tag: that.selectTag,
        sort: that.sort,
        visitSort: that.visitSort,
        pageNum: that.pageNum,
        pageSize: that.pageSize
      }
      this.$emit('edit', item)
    },
    itemRemoveHandler (item) {
      // console.info("eiditId=",item.id);
      // var data={type:"edit",id:item.id};
      var that = this
      var status = new Array()
      var tagCheckData = this.tagCheckData
      for (var i = 0; i < tagCheckData.length; i++) {
        var obj = tagCheckData[i]
        if (obj.select == true) {
          status.push(obj.statu)
        }
      }
      var statusStr = status.toString()
      var obj = new Object()
      obj.id = item.id
      obj.linkObj = {
        resourceType: that.componentType,
        searchParam: that.keyWords,
        status: statusStr,
        tag: that.selectTag,
        sort: that.sort,
        visitSort: that.visitSort,
        pageNum: that.pageNum,
        pageSize: that.pageSize
      }
      this.$emit('remove', obj)
      item.tableItemChangeType = 'newRemove'
      item.commonTableResourceType = this.componentType
      this.$emit('newRemove', item)
    },
    tagContainerOpenHandler (show) {
      try {
        if (this.bodyDataTags.data.length > 0) {
          // console.log(show)
          show = !show
          // console.log(show)
          if (show == true) {
            $(window).bind('click', function (e) {
              // console.log(show)
              show = false
              // console.log(show)
              $(window).unbind('click')
            })
          }
        }
      } catch (e) {}
    },
    tagSelectHandler (val, id) {
      if (
        id === 'resourcetags' ||
        id === 'resourcename' ||
        id === 'resourcetag' ||
        id === 'interfacetag' ||
        id === 'metadatatag'
      ) {
        if (val === '显示全部') {
          this.resources = '所有标签'
          this.interfaceTag = '所有标签'
          this.metadataTag = '所有标签'
          // this.tagSearchName = ''
        } else {
          this.resources = val
          this.interfaceTag = val
          this.metadataTag = val
        }
      } else if (id === 'enterprisename') {
        if (val === '显示全部') {
          this.enterprise = '所有单位'
        } else {
          this.enterprise = val
        }
      }
      var obj = new Object()
      obj.id = id
      // console.log('id', id)
      obj.tag = val
      if (val === '显示全部') {
        obj.tag = ''
        this.selectTag = ''
        this.tagSearchName = ''
      } else {
        var str = JSON.stringify(obj)
        this.selectTag = str
      }
      console.log('tag', this.selectTag)
      this.pageNum = 1
      this.createInterfaceData()
    },
    itemSwitchHandler (data) {
      // console.info("switchChange=",data);
      data.tableItemChangeType = 'switch'
      data.commonTableResourceType = this.componentType

      var that = this
      var status = new Array()
      var tagCheckData = this.tagCheckData
      for (var i = 0; i < tagCheckData.length; i++) {
        var obj = tagCheckData[i]
        if (obj.select == true) {
          status.push(obj.statu)
        }
      }
      var statusStr = status.toString()
      data.linkObj = {
        resourceType: that.componentType,
        searchParam: that.keyWords,
        status: statusStr,
        tag: that.selectTag,
        sort: that.sort,
        visitSort: that.visitSort,
        pageNum: that.pageNum,
        pageSize: that.pageSize
      }
      this.$emit('edit', data)
    },
    itemTrHandler (item) {
      this.$emit('tableLineClick', item)
    },
    stopEventHandler () {
      // 此函数主要是解决事件冒泡问题，不执行任何操作
    },
    preventClick () {
      return false
      // 阻止父元素点击关闭事件
    },
    searchTag () {
      this.noResult = false
      let tagName = this.tagSearchName
      let dataResult = this.searchResultData
      var searchResult = []
      if (tagName === '') {
        searchResult = dataResult
      } else {
        for (let i = 0; i < dataResult.length; i++) {
          if (dataResult[i].split(tagName).length !== 1) {
            searchResult.push(dataResult[i])
          }
        }
      }
      this.bodyDataTags.data = searchResult
    }
  }
}
</script>
<style scoped>
.box {
  padding: 0 15px;
  min-width: 890px;
}

.commonTableControlContainer {
  height: 50px;
  line-height: 50px;
}

.commonCheckBtnContainer {
  float: left;
  height: 50px;
}

.commonSearchContainer {
  float: right;
}
.commonCheckItem {
  float: left;
  margin-right: 20px;
}
span.check {
  position: relative;
  top: 2px;
}
span.icon-xuanzhong5 {
  font-size: 16px;
  color: #63adfd;
  font-weight: bolder;
}
.datacontent {
  height: 110px;
  line-height: 115px;
  background-color: #f9f9f9;
  margin-bottom: 10px;
  display: flex;
}
.datacontent:hover {
  background-color: #ebf5ff;
}

.datacontent:hover i.icon-shuju {
  color: #63adfd;
}

.datacontent a {
  color: #2c4ffe;
  text-decoration: none;
}

i.icon-shuju {
  width: 95px;
  font-size: 26px;
  color: #33d48d;
  padding: 0 38px 0 32px;
  float: left;
}
.datacontent .slotbox {
  flex: 1;
  /* min-width: 600px; */
}
.slotbox1{
  padding-top: 21px;
  box-sizing: border-box;
}
.msg {
  height: 35px;
  line-height: 35px;
  display: flex;
}

div.text {
  display: flex;
  width: 285px;
  /* flex: 1; */
}
div.text span:nth-of-type(2) {
  flex: 1;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  max-width: 260px;
}
.control {
  float: left;
  width: 120px;
  position: relative;
}
.control > span > span {
  margin-right: 20px;
}
/* .commonSwitchContainer {
  position: absolute;
  left: -10px;
  top: 70px;
  line-height: 30px;
} */
i.icon-sousuo {
  cursor: pointer;
  color: #63affd;
  font-size: 18px;
  top: 14px;
}
/* 过滤 */
.filter {
  background-color: #f9f9f9;
  margin-bottom: 10px;
  height: 30px;
  line-height: 30px;
  padding-left: 15px;
}
.filterItem {
  float: left;
  margin-right: 20px;
  cursor: pointer;
}
.filterItem > span {
  display: inline-block;
  width: 60px;
  text-align: center;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  vertical-align: middle;
  position: relative;
  top: -2px;
}
i.icon-xiala1 {
  font-size: 12px;
}
.tagSelct {
  position: relative;
}
.tagbox {
  position: absolute;
  left: 0;
  top: 28px;
  width: 100px;
  border: 1px solid #ccc;
  background-color: #fff;
  max-height: 216px;
  overflow-y: auto;
  border-radius: 4px;
  box-shadow: 2px 0px 5px #ccc;
}
.tagbox p {
  border-bottom: 1px solid #ccc;
  padding-left: 10px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.tagbox p:hover {
  color: #63adfd;
}
.tagbox p:last-child {
  border-bottom: none;
}
.tag-search .tagbox{
  width: 130px;
}
.tag-search .tag-input{
  position: relative;
  width: 120px;
  height: 30px;
  border-radius: 4px;
  border: 1px solid #ccc;
  outline: none;
  padding-left: 6px;
  color: #000;
  top: 2px;
  left: 2px;
}
.tag-search .no-result{
  color: #888;
}
.tag-search .no-result:hover{
  color: #888;
  cursor: default;
}
i.iconfont {
  cursor: pointer;
}
.icon-bianji2,
.icon-3,
.icon-shenpi,
.icon-wentifankuiHD,
.icon-chakan-,
.icon-biaoqian {
  color: #55a7fd;
}
.commonTableTipMsg {
  text-align: center;
  margin-top: 100px;
}
.icon-shenpi {
  font-size: 20px;
  position: relative;
  top: 2px;
}
.icon-wentifankuiHD {
  font-size: 18px;
  position: relative;
  top: 1px;
}
.icon-3 {
  font-size: 19px;
  position: relative;
  top: 1px;
}
.icon-biaoqian {
  font-size: 18px;
  position: relative;
  top: 2px;
}
i.icon-yulan {
  color: #55a7fd;
  font-size: 20px;
  position: relative;
  top: 2px;
  right: 2px;
} 
i.timeDefault {
  display: inline-block;
  width: 20px;
  height: 20px;
  background-size: 20px 20px;
  position: relative;
  top: -2px;
  vertical-align: middle;
}
i.up {
  background-image: url(../publicImages/up.png);
}
i.down {
  background-image: url(../publicImages/down.png);
}
.text span:nth-of-type(1) {
  color: #000;
}
.text span:nth-of-type(2) {
  color: #888;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
/* .text span.titleinfo {
    position: relative;
    top: -13px;
  }
  .text span.datainfo {
    white-space: nowrap;
    text-overflow:ellipsis;
    overflow:hidden;
    display: inline-block;
    width: 170px;
  }
@media screen and (max-width: 1200px) {
    .text span.datainfo {
      width: 145px;
    }
} */
.slotbox {
  float: left;
}
/* 未提交 */
.text span.statuscolor0 {
  color: #60dca6;
}
/* 待审核 */
.text span.statuscolor1 {
  color: #55a8fd;
}
/* 已通过 */
.text span.statuscolor2 {
  color: #00008b;
}
/* 未通过 */
.text span.statuscolor3 {
  color: #fa405c;
}
/* 已过期 */
.text span.statuscolor4 {
  color: #888888;
}
/* error */
.text span.statuscolorerror {
  color: #000000;
}
</style>
