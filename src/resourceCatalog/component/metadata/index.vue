<template>
<div class="root-body">
    <div class="container main-nav">
      <div class="nav_box">
            <div class="nav_position">
              <i @click="goHome" class="iconfont icon-dingwei"></i>
              <span class="nav_box_text">元数据管理</span>
            </div> 
            <div v-if="verifyPermission('009004001')" class="nav_box_button_group"> 
              <button type="button" class="registeMeta" @click="gotoRegister">注册数据元</button>
            </div>
        </div>
    </div>

    <!-- <div class="main-content-box" :style="{'height':(fullHeight - 166) + 'px','overflow-y':'scroll','overflow-x':'hidden'}"> -->
    <div class="main-content-box">
      <div class="container main-content">
        <div class="searchContainer clearfix">
          <div v-show="searchTop" class="search-Box tab-pane active">
            <div class="searchInputBox">
              <div class="simpleSearch clearfix">
                <input data-v-d8c8218e="" type="text" v-model="keyWord" v-on:keyup.enter="handleSearch" class="searchInput">
                <button data-v-d8c8218e="" @click="handleSearch" class="searchButton">搜索</button>
              </div>
              <div class="advanceSearchBtnGroup">
                <a type="button" @click="showAdvancedSearch" class="search_nav">高级搜索</a>
              </div>
            </div>
            <div class="searchResultBox">
              <p class="searchResultBox">共找到
                <span class="searchResultNumber"> {{searchResultNum}} </span> 条结果</p>
            </div>
          </div>

          <div class="advancedSearch tab-pane" v-show="searchAdvanced" style="display: none;">
            <a class="showSearBtn" @click="showSearchTop">
              <span @click="showSearchTop">普通搜索</span>
            </a>      
            <div class="row advancedSearInputBox">
              <div class="col-xs-2 s-label">
                <span>数据元名称：</span>
              </div>
              <div class="col-xs-3">
                <input type="text" v-model="name" name="name" />
              </div>
              <div class="col-xs-3 s-label">
                <span>数据元标识符：</span>
              </div>
              <div class="col-xs-3">
                <input type="text" v-model="tag" name="tag" />
              </div>
            </div>
            <div class="row advancedSearInputBox">  
              <div class="col-xs-2 s-label">
                <span>数据元中文名称：</span>
              </div>
              <div class="col-xs-3">
                <input type="text" v-model="cnName" name="cnName" />
              </div>
              <div class="col-xs-3 s-label">
                <span>数据元内部标识符：</span>
              </div>
              <div class="col-xs-3">
                <input type="text" v-model="internalTag" name="internalTag" />
              </div>
            </div>  
            <div class="row advancedSearInputBox">
              <div class="col-xs-2 s-label">
                <span>录入人单位：</span>
              </div>
              <div class="col-xs-3">
                <input type="text" v-model="recordUnit" name="recordUnit" />
              </div>
              <div class="col-xs-3 s-label">
                <span>创建日期：</span>
              </div>
              <div class="col-xs-3">
                <el-date-picker size="small" v-model="dateValue" @change="HandleDateChange" type="daterange" class="dataRangeInput" :editable="false">
                </el-date-picker>
              </div>
            </div>
            <div class="dashed-line"></div>

            <div class="row advancedSearBtnBox">
              <div class="col-xs-2 col-xs-offset-4 advanced-btn">
                <button class="normalButton" @click="clear"> 清空 </button>
              </div>
              <div class="col-xs-2 advanced-btn">
                <button class="normalButton" @click="advancedSearch"> 确定 </button>
              </div>
            </div>
            <div class="searchResultBox">
              <p class="searchResultBox">共找到
                <span class="searchResultNumber"> {{searchResultNum}} </span> 条结果</p>
            </div>
          </div>

        </div>

        <div class="searchResultContainer">
          <div>
            <div v-for="(item, index) in dataTable" :key="item.id" class="dataDetail">
              <el-row>
                <el-col :span="3" class="dataId"><i class="iconfont icon-yuanshujuguanli"></i><span class="strong">序号：</span><span class="indexCell">{{index + 1}}</span></el-col>
                <el-col :span="21">
                  <el-row class="dataRow">
                    <el-col :span="24">
                      <span class="strong">数据元名称：</span><span><a href="javascript:void(0)" @click="toDetailPage(item.id, item.name)">{{item.name}}</a></span>
                    </el-col>
                  </el-row>
                  <el-row class="dataRow">
                    <el-col :span="8"><span class="strong">数据元标识符：</span><span>{{item.tag}}</span></el-col>
                    <el-col :span="8"><span class="strong">数据元内部标识符：</span><span>{{item.internalTag}}</span></el-col>
                    <el-col :span="8"><span class="strong">数据元中文名称：</span><span>{{item.cnName}}</span></el-col>
                  </el-row>
                  <el-row class="dataRow">
                    <el-col :span="8"><span class="strong">录入人：</span><span>{{item.recordPerson}}</span></el-col>
                    <el-col :span="8"><span class="strong">录入人单位：</span><span>{{item.recordUnit}}</span></el-col>
                    <el-col :span="8"><span class="strong">创建日期：</span><span>{{item.createdTime | time}}</span></el-col>
                  </el-row>
                </el-col>
              </el-row>
            </div>
            <div class="rc paginationContainer">
              <div class="block" v-show="showpagination && totalNum > 10">
                <el-pagination @current-change="handleCurrentChange" layout="total,prev,pager,next,jumper" :current-page.sync="pageNum" :page-size="pagesize" :total="totalNum" :page-sizes="pageSizes" @size-change="sizeChange">
                </el-pagination>
              </div>
              <div class="searchResultMsg" v-show="!showpagination">
                {{searchResultMsg}}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
 
     <PopupDetail :show.sync="showDetail" :title="'《'+showWithName + '》' + '数据元详情'">
        <div slot="component"><metadataDetail :id="showWithId"/></div>
     </PopupDetail>  
  </div>
</template>

<script>
import ApiClient from '../../../publicJs/ApiClient.js'
import Vue from 'vue'
import PopupDetail from '../../popupDetails/CompDetail'
import metadataDetail from './Detail'
import LoadingBoxService from '../../../publicJs/LoadingBoxService.js'
import privibutton from '@/publicComponent/privibutton'
Vue.filter('time', function (longTypeDate) {
  // return new Date(parseInt(longTypeDate) * 1000).toLocaleString().replace(/年|月/g, '-').replace(/日/g, ' ')
  var d = new Date(longTypeDate)
  var year = d.getFullYear()
  var month = (d.getMonth() + 1) < 10 ? '0' + (d.getMonth() + 1) : (d.getMonth() + 1)
  var day = d.getDate() < 10 ? '0' + d.getDate() : d.getDate()
  var hour = d.getHours() < 10 ? '0' + d.getHours() : d.getHours()
  var minutes = d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes()
  var seconds = d.getSeconds() < 10 ? '0' + d.getSeconds() : d.getSeconds()
  return year + '-' + month + '-' + day + ' ' + hour + ':' + minutes + ':' + seconds
})
export default {
  name: 'metadata',
  components: {PopupDetail, metadataDetail, privibutton},
  data () {
    return {
      dataTable: [],
      searchResultNum: 0,
      searchResultMsg: '正在查找数据...',
      showpagination: false,
      totalNum: 0,
      pagesize: 10,
      pageNum: 1,
      pageSizes: [10, 20, 50],
      keyWord: '',
      dateValue: '',
      beginTime: '',
      endTime: '',
      name: '', // 数据元名称
      tag: '', // 数据元标识符
      cnName: '', // 数据元中文名称
      internalTag: '',  // 数据元内部标识符
      recordUnit: '',  // 录入单位
      isUp: true,
      sort: 'desc',
      showDetail: false,
      showWithId: '',
      showWithName: '',
      searchTop: true,
      searchAdvanced: false
    }
  },
  mounted () {
    this.getMetadata()
  },
  methods: {
    sizeChange (pagesize) {
      this.pagesize = pagesize
      this.pageNum = 1
      this.getMetadata()
    },
    handleCurrentChange (val) {
      this.pageNum = val
      this.getMetadata()
    },
    handleSearch (e) {
      this.getMetadata()
    },
    getMetadata () {
      this.dataTable.splice(0)
      this.searchResultNum = 0
      LoadingBoxService.open('数据加载中...')
      this.searchResultMsg = ''
      this.showpagination = false
      ApiClient.get('/rcapi/metadata/query',
        {keyword: this.keyWord,
          pageNum: this.pageNum,
          pageSize: this.pagesize,
          name: this.name,
          cnName: this.cnName,
          tag: this.tag,
          internalTag: this.internalTag,
          recordUnit: this.recordUnit,
          recordStartTime: this.beginTime,
          recordEndTime: this.endTime,
          approvalStatusList: 2,
          sortType: this.sort}).then(data => {
            LoadingBoxService.close()
            if (data === null || data.totalNum === 0) {
              this.showpagination = false
              this.searchResultMsg = '没有查找到结果！'
            } else {
              this.dataTable = data.dataList
              this.totalNum = data.totalNum
              this.searchResultNum = data.totalNum
              if (this.dataTable.length > 0) {
                this.showpagination = true
              }
            }
          }, error => {
            LoadingBoxService.close()
            if (error.response && error.response.status === 404) {
              this.searchResultMsg = 'API不存在或无法访问'
            } else {
              this.searchResultMsg = '检索数据失败, 访问API服务异常'
            }
          })
    },
    showAdvancedSearch () {
      this.keyWord = ''
      this.searchTop = false
      this.searchAdvanced = true
    },
    showSearchTop () {
      this.clear()
      this.searchAdvanced = false
      this.searchTop = true
    },
    HandleDateChange (data) {
      var strIndex = data.indexOf(' - ')
      var startTime = data.substring(0, strIndex)
      var endTime = data.substring(strIndex + 3, data.length)
      this.beginTime = startTime
      this.endTime = endTime
    },
    advancedSearch () {
      this.getMetadata()
    },
    clear () {
      this.dateValue = ''
      this.name = ''
      this.tag = ''
      this.cnName = ''
      this.internalTag = ''
      this.recordUnit = ''
    },
    timeSortHandler () {
      this.isUp = !this.isUp
      // this.dataTable.reverse()
      if (this.isUp) {
        this.sort = 'desc'
      } else {
        this.sort = 'asc'
      }
      this.pageNum = 1
      this.getMetadata()
    },
    gotoRegister () {
      this.$router.push({name: 'metadataRegister', params: {page: 'new', breadCrumbStr: '数据元管理>注册数据元'}})
    },
    toDetailPage (id, name) {
      // var url = 'metadata/detail/' + id
      // window.open(url, '_blank')
      // this.$router.push({name: 'MetadataDetail', params: {id: id}})
      this.showWithId = id
      this.showWithName = name
      this.showDetail = true
    },
    goHome () {
      this.$router.push({name: 'Index'})
      // console.log(this)
      this.$parent.setActive('资源管理', '资源目录')
      // this.$parent.leftNavData[5].active = false
      // this.$parent.leftNavData[0].active = true
    }
  }
}
</script>
<style src=""></style>
<style scoped>
  .main-content-box{
     position: absolute;
     top :60px;
     bottom: 0;
     left: 20px;
     right: 20px;
     overflow-y : scroll;
     overflow-x : auto;
  }
  .root-body .container.main-nav{
    padding-left: 0;
    width: 100%;
    background-image: none;
    margin-top: 15px;
  }
  .container {
    background-image: none;
  }
  div.publicRightBottomContentContainer{
    background: #f3f6fd;
    padding: 14px 14px 0 14px;
    overflow-y: auto;
  }
  .nav_position{
    float: left;
  }
  i.iconfont{
    color: #36d593;
    margin-right: 6px;
    margin-left: 10px;
  }
  .icon-dingwei {
    cursor: pointer;
  }
  .icon-yuanshujuguanli{
    padding-right: 16px;
    margin-right: 0;
  }
  .nav_box_button_group{
    height: 46px;
    line-height: 46px;
    float: right;
    margin-right: 14px;
  }
  .nav_box_button_group button{
    height: 24px;
    line-height: 22px;
    padding: 0 8px;
    border: 1px solid #56a8fe;
    border-radius: 10px;
    background: #fff;
    color: #56a8fe;
    outline :none;
  }
  .search-Box{
    text-align: center;
    margin-top: 33px;
  }
  .searchContainer{
    background: #fff;
    border-bottom: 1px solid #f1f1f1;
  }
  .advanceSearchBtnGroup {
    line-height: 38px;
    margin-left: 18px;
    background-color: white;
    height: 38px;
    float: left;
  }
  .searchInputBox {
    height: 43px;
    display: inline-block;
    text-align: center;
    margin: 0 auto;
  }
  
  .searchInput {
    width: 530px;
    height: 30px;
    font-family: 'Arial Normal', 'Arial';
    font-weight: 400;
    font-size: 14px;
    text-decoration: none;
    text-align: left;
    border-color: transparent;
    outline-style: none;
    padding: 1px 0px 1px 0px;
    box-sizing: border-box;
    border-radius: 3px;
    border: 1px #ffffff solid;
    line-height: 22px;
    float: left;
  }
  .searchResultBox{
    text-align: left;
    font-size: 12px;
    padding-left: 3px;
    color: #777;
  }
  .searchResultNumber {
    color:#FF0000;
  }
  .advancedSearch{
    height: 224px;
  }
  .advancedSearch .row{
    margin: 15px 0;
    height: 31px;
  }
  .advancedSearch .advancedSearBtnBox{
    margin-top: 32px;
  }
  .advancedSearch .row input{
    width: 182px;
    height: 31px;
    border: 1px solid #d4e2ed;
    border-radius: 4px;
    padding: 0px 10px;
  }
  .advancedSearch .row div span{
    float: right;
    line-height: 30px;
  }
  .advanced-btn{
  text-align: center;
  }
  .showSearBtn{
    width:0;
    height:0;
    border-width: 0 60px 60px 0;
    border-style:solid;
    border-color: transparent #56a8fe transparent transparent;
    margin:40px auto;
    position: absolute;
    top: -40px;
    right: 2px;
    cursor: pointer;
  }
  .showSearBtn span{
    width: 50px;
    display: inline-block;
    color: #fff;
    transform: rotateZ(45deg);
    position: absolute;
    right: -63px;
    top: 14px;
  }
  .advancedSearch button{
    height: 32px;
    background: #56a8fe;
    color: #fff;
    border: 0;
    padding: 0px 20px;
    border-radius: 4px;
  }
  .simpleSearch{
    float: left;
    border: 1px solid #56a8fe;
    border-radius: 6px;
    overflow: hidden;
    width: 610px;
  }
  .search_nav {
    color: #56A4FE;
  }
  .search_nav:hover {
    cursor: pointer;
  }
  th img {
    margin-left: 4px;
  }
  .dataDetail{
    height: 110px;
    background: #f9f9f9;
    margin-top: 12px;
    border-bottom: 1px solid #efefef;
    color: #888;
  }
  .dataDetail a{
    color: #2C4FFE;
  }
  .dataDetail a:hover{
    text-decoration: none;
  }
  .dataId{
    height: 108px;
    line-height: 108px;
    text-align: center;
  }
  .dataRow{
    height: 36px;
    line-height: 36px;
  }
  .strong{
    color: #222;
  }
  .searchButton{
    width: 77px;
    background: #56A4FE;
    float: right;
    margin-left: 0;
    height: 38px;
    color: #fff;
    border-radius: 0;
    padding: 0;
    border: none;
    outline: none;
  }
  .searchButton:active{
    border: 0;
  }
  .simpleSearch input{
    height: 38px;
    line-height: 38px;
    padding-left: 10px;
    float: left;
  }
  .clearfix::after {
    content: ".";
    clear: both;
    display: block;
    overflow: hidden;
    height: 0;
  }
  .dataDetail:hover{
    background: #EBF5FF;
  }
</style>
<style>
  .main-content{
    padding: 0 14px;
  }
  .main-content-box{
    position: relative;
    /* box-shadow: 2px 0px 5px #ccc; */
    box-shadow: 0 0 3px 2px #dedede;
    margin-top: 12px;
    background-color: #fff;
  }
  .main-content-box .container{
    width: 100%;
    min-width: 832px;
  }
  .main-nav{
    background: #fff;
    height: 46px;
    line-height: 46px;
    box-shadow: 0px 0px 5px #dedede;
    border-radius: 2px;
  }
  a:hover, a:focus{
    text-decoration: none;
  }
  .dataRangeInput input.el-input__inner{
    width: 182px;
    border-color: #d4e2ed;
  }
  .el-input__inner:hover{
    border-color: #d4e2ed;
  }
  .dataRangeInput .el-input__icon{
  color: #fd3d64;
  right: 40px;
  }
</style>
