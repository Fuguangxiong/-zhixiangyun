<template>
  <div class="Recommendpage">

      <div class="part1">
        <span style="color:#757f8b">精彩推荐</span>
      </div>

      <div class="part2">
        <span>热门推荐(最多可建{{countLimitList.limit}}条)</span>
        <div class="new" @click="NewRecommend()">
          <i class="iconfont icon-jia"></i>&nbsp;
          <span>新建</span>
        </div>
      </div>

      <!--新建弹框-->
      <el-dialog title="新建" :visible.sync="dialogTableVisible">
        <div class="modal-body">		     
          <div class="appHotConfigTcTop">
            <span class="icoLn"></span><em>新增推荐</em>
          </div>
          <div class="appHotConfigTcIp">	
            <div class="aui" @click.self="isShowSearched=false">
              <input  v-model.trim="inputValue" class="text" autocomplete="off" placeholder="请输入内容" @focus="inputfocus()">
              <span class="hotCheck" v-show="saveflag">该推荐已存在!</span>
              <span class="hotCheck" v-show="numflag">最多可新建{{countLimitList.limit}}条!</span>
            </div>
            <div class="aui-dd-parent resize-to-input" v-show="isShowSearched">
              <div class="aui-dropdown aui-dropdown-left">
                <ol class="last">
                  <li  v-for="item in serverList" :key="item.id">
                    <a href="javaScript:void(0)" @click="selectItemInList(item.id,item.name)" class="label-suggestion">
                      <span :title="item.name"><em>{{item.name}}--{{item.belong}}</em></span></a>
                  </li>
                </ol>
              </div>
            </div>
          </div>

          <div class="appHotConfigTcTop">
            <span class="icoLn"></span><em>已增热门推荐</em>
          </div>
            
          <div class="appHotConfigTcList">
            <ul>
              <li v-for="(list,index) in serverArray2" :key="list.id" @click="tagToggle(index)">{{list.name}}
                <span class="icon iconfont icon-cuohao hovershow"   @click="deleteHotServer1(list)"></span>
              </li>		          		
            </ul>
          </div>
        </div>

        <div class="modal-footer">
          <span type="button" class="btn btn-primary" @click="saveServerNames()" >确定</span>
          <span type="button" class="btn btn-default" @click="dialogTableVisible=false">取消</span>		        
        </div>    
      </el-dialog>

      <div class="part3">
        <p v-show="!notNull">
          当前还没有推荐服务，如需使用，请新建
        </p>
        <ul v-show="notNull">
          <li class="sort" v-for="(data,index) in serverArray" :key=index>
            <img v-lazy="url[index]" class="logoimg">
            <div class="content">
              <p>
                <span>&nbsp;&nbsp;{{data.name}}</span>
              </p>         
              <p>
                {{data.service_brief.length>160?(data.service_brief.substring(0,160)+"…"):data.service_brief}}
              </p>
            </div>
            <i class="del1 iconfont icon-3" @click="DelRecommend(data)"></i>
          </li>
        </ul>
      </div>

  </div>
</template>
<script>
import apiClient from '../../../publicJs/ApiClient.js'
import LoadingBoxService from '../../../publicJs/LoadingBoxService.js'
import TipBoxService from '../../../publicJs/TipBoxService.js'
import NoticeBoxService from '../../../publicJs/NoticeBoxService.js'
import appPublicJs from '../../common/public.js'
export default {
  name: 'APImarketSort',
  data () {
    return {
      notNull: false,
      dialogTableVisible: false,
      isShowSearched: false,
	    saveflag: false,
      numflag: false,
      serverArray: [],
	    serverArray1: [],
      serverArray2: [],
      inputValue: '',
      serverList: [],
      ifMore: true,
      flag: true,
      flagWindow: true,
      i: -1,
      countLimitList: {
        limit: 0
      },
      url: []
    }
  },
  mounted () {
	  this.getHotList()
  },
  watch: {// 监听
    inputValue (value) {
      if (value === '') {
        this.isShowSearched = false
        return
      }
      if (!this.selectItem) {
        this.remoteMethod(value)
      } else {
        this.selectItem = false
      }
    }
  },
  methods: {
    countLimit () { // 数量限制
      var that = this
      var myData = {
        'type': 1
      }
      apiClient.get('/itsmApi/recommend/getRecommendParams', myData, function (data) {
        if (data.status === 200) {
          that.countLimitList = data.results.data[0]
        }
      })
    },
    remoteMethod (value) { // 搜索框
      if (value !== '') {
        var myData = {
          'name': value
        }
        apiClient.get('/itsmApi/recommend/findServiceForFuzzy', myData, function () {

        }).then(data => {
          if (appPublicJs.checkData(data.data)) {
            this.serverList = data.data
            this.isShowSearched = true
          } else {
            this.isShowSearched = false
            return
          }
        }).catch(e => {
          console.error(e)
        })
      }
    },
    NewRecommend () { // 新建
      var that = this
      that.i = -1
      that.dialogTableVisible = true
      that.inputValue = ''
      that.saveflag = false
      that.numflag = false
      this.getHotList1()
    },
    DelRecommend (data) { // 删除
      var that = this
      var myData = {
        'id': data.id
      }
      NoticeBoxService.open('是否删除服务？', function () {
        NoticeBoxService.close()
        apiClient.delete('/itsmApi/recommend/deleteRecommendAtomic', myData, function (data) {
          if (data.status === 200) {
            TipBoxService.open('删除成功')
            that.getHotList()
          }
        })
      })
    },
    getHotList () { // 查询列表
      var that = this
      var myData = {
        'type': 1
      }
      apiClient.get('/itsmApi/recommend/getRecommendServiceList', myData, function (data) {
        if (appPublicJs.checkData(data.results.data)) {
          that.notNull = true
          that.serverArray = data.results.data
          that.listlength = that.serverArray.length
          for (let i = 0; i < that.listlength; i++) {
            that.url.push(apiClient.apiBaseUrl + '/itsmApi/attachment/show?imgPath=' + that.serverArray[i].img + '&token=' + apiClient.token)
          }
          if (data.results.total < that.serverArray.length || data.results.total === that.serverArray.length || that.serverArray.length == 0) {
            that.ifMore = false
          } else {
            that.ifMore = true
          }
        } else {
          that.serverArray = []
          that.ifMore = false
          that.notNull = false
        }
      })
      that.countLimit()
    },
    getHotList1 () { // 回显数据serverArray2
      var that = this
      var myData = {
        'type': 1
      }
      apiClient.get('/itsmApi/recommend/getRecommendServiceList', myData, function (data) {
        if (appPublicJs.checkData(data.results.data)) {
          that.serverArray2 = data.results.data
        } else {
          that.serverArray2 = []
        }
      })
    },
    selectItemInList (id, name) {
	    var that = this
	    this.selectItem = this.inputValue !== name
	    this.isShowSearched = false
	    this.inputValue = name
	    var serverObj = {}
	    serverObj.id = id// 服务id
	    serverObj.name = name// 服务名
	    if (appPublicJs.checkData(that.serverArray2)) {
      if (this.haveItem(that.serverArray1, that.serverArray2, serverObj)) {
        that.saveflag = false
        that.numflag = false
        that.serverArray1.unshift(serverObj)// 新增
        that.serverArray2.unshift(serverObj)// 第一次回显和第二次新增后回显
      }
    } else {
      that.serverArray1.unshift(serverObj)
      that.serverArray2.unshift(serverObj)
    }
    },
    haveItem (serverArray1, serverArray2, serverObj) { // 判断服务已存在
      var flag = true
      for (var i = 0; i < serverArray1.length; i++) {
        if (serverArray1[i].id.indexOf(serverObj.id) != -1) {
          this.numflag = false
          this.saveflag = true
          flag = false
        }
      }
      for (var i = 0; i < serverArray2.length; i++) {
        if (serverArray2[i].id.indexOf(serverObj.id) != -1) {
          this.numflag = false
          this.saveflag = true
          flag = false
        }
      }
      return flag
    },
    tagToggle (index) {
	    this.i = index
    },
    inputfocus () { // 搜索框获得焦点事件
      var that = this
      if (that.serverArray2.length >= that.countLimitList.limit) {
        that.numflag = true
      } else {
        that.numflag = false
      }
    },
    saveServerNames () { // 保存数据
      var that = this
      if (appPublicJs.checkData(that.serverArray1)) {
        for (var i = 0; i < that.serverArray1.length; i++) {
          var myData = {
            'type': 1,
            'service_id': that.serverArray1[i].id
          }
          LoadingBoxService.open('加载中...')
          apiClient.post('/itsmApi/recommend/saveRecommendAtomic', myData, function (data) {
            LoadingBoxService.close()
            console.log('哈哈哈哈哈', data)
            if (data.status === 200 && data.results.result === true) {
              TipBoxService.open('添加成功!')
              that.dialogTableVisible = false
              that.serverArray1 = []
              that.serverArray2 = []
              that.pageNum = 1
              that.getHotList()
            } else if (data.status === 200 && data.results.result === false) {
              TipBoxService.open('超出最大限制数!', 2)
            } else {
              TipBoxService.open('添加失败!', 2)
            }
          })
        }
      } else {
        TipBoxService.open('无该推荐服务!', 2)
        that.dialogTableVisible = true
      }
    },
    deleteHotServer1 (list) { // 删除数据（新增和回显的）
      var that = this
      var id2Array = []
      var id1Array = []
      var myData = {
        'id': list.id
      }
      NoticeBoxService.open('确定删除吗?', function (val) {
        NoticeBoxService.close()
        // 原声数组remove()
        Array.prototype.remove = function (list) {
          var a = this.indexOf(list)
          if (a >= 0) {
            this.splice(a, 1)
            return true
          }
          return false
        }
        if (appPublicJs.checkData(that.serverArray1)) {
          for (var i = 0; i < that.serverArray1.length; i++) {
            id1Array = that.serverArray1[i].id
            if (id1Array.indexOf(list.id) != -1) {
              that.serverArray1.remove(list)
              that.serverArray2.remove(list)
              TipBoxService.open('删除成功!')
            }
          }
        }
        if (appPublicJs.checkData(that.serverArray2)) {
          for (var i = 0; i < that.serverArray2.length; i++) {
            id2Array = that.serverArray2[i].id
            if (id2Array.indexOf(list.id) != -1 && id1Array.indexOf(list.id) == -1) {
              apiClient.delete('/itsmApi/recommend/deleteRecommendAtomic', myData, function (data) {
                if (data.status === 200) {
                  TipBoxService.open('删除成功!')
                  that.getHotList1()
                  that.getHotList()
                } else {
                  TipBoxService.open('删除失败!', 2)
                }
              })
            }
          }
        }
      }, function (val) {})
    }
  }
}
</script>
<style scoped>
*{
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.part1{
  margin-top: 23px;
}
.part1 span{
  cursor: hand;
}
.part1:before {
  content: "";
  height: 10px;
  width: 2px;
  position: relative;
  display: inline-block;
  top: 1px;
  margin-right: 6px;
  background-color: #2ca3ee;
}
.part2{
  width: 100%;
  height: 41px;
  line-height: 40px;
  color:#757f8b;
}
.new{
  display: inline-block;
  float: right;
  margin-right: 15px;
  color:#7899ed;
  cursor: pointer;
}
.part3{
  margin-bottom: 45px;
}
.part3>p{
  margin-top: 200px;
  font-size: 16px;
  font-weight: bold;
  text-align: center;
}
.part3 ul{
  border:2px solid #f9f9f9;
}
.part3 ul li:last-of-type{
  border:none
}
.sort{
  width: 97%;
  height: 105px;
  margin: 2px auto;
  border-bottom:2px solid #f9f9f9; 
  position: relative;
}
.del1{
  display: none;
  position: absolute;
  top:40px;
  left: 96%;
  font-size: 20px;
  cursor: pointer;
  color: #56a8fe;
}
.sort:hover{
  box-shadow: 0 0 3px 1px #56a8fe;
}
.sort:hover .del1{
  display: block;
}
.sort>div{
  display: inline-block;
  vertical-align:top;
}
.logoimg{
  width: 80px;
  height: 80px;
  margin: 12px;
}
.content{
  width: 87%;
  height: 100%;
}
.content>p:first-of-type{
  height: 20%;
  margin-top: 12px;
}
.content>p:first-of-type span{
  font-size: 16px;
}
.content>p:last-of-type{
  height: 50%;
  margin-top: 10px;
  font-size: 12px;
  line-height: 20px;
}

/*新增弹窗*/
.modal-body{
	padding-top: 0;
	background:#fff;
}
.modal-body>.appHotConfigTcTop{
	width:100%;
	margin-top: 10px;
	padding: 10px;
	color:#575757;
	font-size: 15px;
	border-bottom:1px solid #d7e8f9;
	
}
.modal-body>.appHotConfigTcTop>span{
	width: 4px;
	height: 12px;
	border-radius: 4px;
	background: #55a8fd;
	display: inline-block;
}
.modal-body>.appHotConfigTcTop>em{
	font-style: normal;
	margin-left: 4px;
	font-size: 14px;
}
.modal-body>.appHotConfigTcIp>.el-select{
	width:560px;
	margin-left:100px;
	margin-bottom:20px
}
.appHotConfigTcIp{
	margin-top: 30px;
}
.appHotConfigTcIp span{
	color: red
}
.addServerName{
	width: 300px;
	height:30px;
	margin-top:-10px;
	margin-left:20px;
	margin-bottom:10px;
}
.modal-body>.appHotConfigTcIp>.el-select>.el-input>.el-select-dropdown{
	width:560px;
}
.modal-body>.appHotConfigTcListTop{
	width:100%;
	height:36px;
	line-height: 36px;
	color:#575757;
	font-size: 15px;
	border-bottom:1px solid #d7e8f9;
}
.modal-body>.appHotConfigTcListTop>span{
	color:#fa405c;
}
.modal-body>.appHotConfigTcList{
	width:100%;
	padding-top:15px;
	padding-left: 15px;
}
.modal-body>.appHotConfigTcList>ul{
	width:100%;
	overflow: auto;
	max-height: 100px;
}
.modal-body>.appHotConfigTcList>ul>li{
	padding: 0 8px;
	height:26px;
	line-height: 26px;
	text-align: center;
	border:1px solid #dbdbdb;
	border-radius: 2px;
	margin-bottom:18px;
	font-size: 14px;
	float: left;
	color:#333;
	margin:4px;
	
	text-overflow:ellipsis;
	white-space: nowrap;
	position: relative;
	cursor: pointer;
}
.modal-body>.appHotConfigTcList>ul>li>span{
	width:12px;
	height:12px;
	color:#f93838;
	position: absolute;
	top:-12px;
	right:-5px;
	z-index: 9999;
	font-size: 16px;
}

.modal-body>.appHotConfigTcList>ul li .hovershow{
	display: none
}
.modal-body>.appHotConfigTcList>ul li:hover .hovershow{
	display: block;	
}
.modal-body>.appHotConfigTcList>ul li:hover{
	background: #fff;
	border-color: #20a0ff;
	color: #20a0ff;
}

.modal-footer{
	margin-top: 20px;
	background:#fff;
	border-top:none;
	text-align: center;
	border-radius: 5px;
}

.btn-primary {
  height: 35px;
  line-height: 35px;
	color: #fff;
	background-color: #55a8fd;
	border-color: #55a8fd;
	width: 80px;
	margin-right: 70px;
 }

 .btn-default {
  height: 35px;
  line-height: 35px;
  color: #333;
  background-color: #e3e3e3;
  border-color: #e3e3e3;
  width: 80px;
  color: #fff;
  outline: none;
}

.modal-footer .btn-primary:hover{
	color: #fff;
	background: #388be0;
	cursor: pointer;
}
.modal-footer .btn-default:hover{
	color: #fff;
	background: #cdcbcb;
	cursor: pointer;
}
/*插件样式开始--下拉框*/
.aui input.text {
	border-radius: 3px;
	border: 1px #cacaca solid;
	line-height: 22px;
	width: 400px;
	display: inline-block;
	box-sizing: border-box;
	color: #1f2d3d;
	font-size: 14px;
	height: 33px;
	outline: 0;
	padding: 3px 10px;
	font-family: inherit;
	margin-left: 18px;
}

.aui-dd-parent {
	position: relative;
}
div.resize-to-input .aui-dropdown {
  width: 400px;
  margin-top: 5px;
  max-height: 187px;
}
div.resize-to-input .aui-dropdown li{
	list-style: none;
  line-height: 30px;
  padding: 0 10px;
  margin: 0;
  cursor: pointer;
  color: #48576a;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
	text-overflow: ellipsis;
	width: 100%;
}

.aui-dd-parent .aui-dropdown-left {
	left: 19px;
  width: 290px;
}

.aui-dd-parent .aui-dropdown {
	background: #fff;
	border: 1px solid #ccc;
	border-bottom-left-radius: 3px;
	border-bottom-right-radius: 3px;
	-moz-box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);
	-webkit-box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);
	box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);
	color: #000;
	margin-top: -1px;
	padding: 4px 0 4px 0;
	position: absolute;
	z-index: 2003;
}

.aui-dropdown {
	list-style-type: none;
	overflow: auto;
	max-height: 250px;
}

.aui-dropdown li a span {
	background-position: 8px 50%;
	background-repeat: no-repeat;
	display: block;
}

.aui-dropdown li:hover {
	background-color: #e4e8f1;
	font-style: normal;
}

.label-suggestion span {
	color: #48576a;
}

.label-suggestion em {
	font-style: normal;
}
</style>
<style>
.Recommendpage .el-dialog__header{
  padding-bottom: 10px;
}
.Recommendpage .el-dialog__body{
  padding-top: 0px;
}
</style>
