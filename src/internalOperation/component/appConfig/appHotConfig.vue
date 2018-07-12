<template>
	<div class="appImgConfigBox appdialog">
		<div class="appHotConfigTop">
			<div class="appHotConfigTopLeft">
				<span>热门推荐(最多可新建30条)</span><em class="maxsize"></em>
			</div>
			<div class="appHotConfigTopRight" @click="selectAll">新增</div>
		</div>
		<!--新增热门应用弹框-->
		<el-dialog title="热门应用新建" :visible.sync="dialogTableVisible">
		      <div class="modal-body">		     
		         <div class="appHotConfigTcTop">
		         	<span class="icoLn"></span><em>新增热门应用</em>
		         </div>
		          <div class="appHotConfigTcIp">	
						<div class="aui" @click.self="isShowSearched=false">
							<input  v-model.trim="inputValue" class="text" autocomplete="off" placeholder="请输入内容">
						</div>
						<div class="aui-dd-parent resize-to-input" v-show="isShowSearched">
							<div class="aui-dropdown aui-dropdown-left">
								<ol class="last">
									<li  v-for="item in serverList" :key="item.id">
										<a href="javaScript:void(0)" @click="selectItemInList(item.id,item.name)" class="label-suggestion">
											<span :title="item.name"><em>{{item.name}}</em></span></a>
									</li>
								</ol>
							</div>
						</div>
					   <span class="hotCheck" v-show="addflag">请选择热门应用!</span>
					   <span class="hotCheck" v-show="saveflag">该应用已存在!</span>
					   <span class="hotCheck" v-show="numflag">最多可新建30条!</span>
		          </div>
		          <div class="appHotConfigTcTop">
		          	<span class="icoLn"></span><em>已增热门应用</em>
		          </div>
		          
		          <div class="appHotConfigTcList">
		          	<ul>
		          		<li v-for="(list,index) in serverArray2" :key="list.id" @click="tagToggle(index)">{{list.serverName}}
		          			<span class="icon iconfont icon-cuohao hovershow"    @click="deleteHotServer1(list)"></span>
		          		</li>		          		
		          	</ul>
		          </div>
		      </div>
		      <div class="modal-footer">
		      	<span type="button" class="btn btn-primary" @click="saveServerNames" >确定</span>
		        <span type="button" class="btn btn-default" @click="dialogTableVisible=false">取消</span>		        
		      </div>
		    
		</el-dialog>
		<!--列表内容-->
		<div class="appHotConfigContent">
			<div v-if="notNull" class="conLst">
			 <!--拖拽-->
		      <draggable class="conoxList" v-model="serverArray" :move="getdata" @end="onEnd">

		      	
				 <div class="serverli" v-for="list in serverArray" :key="list.id">
				      <div class="appHotConfigContentImg">
						<img v-lazy="list.img"/>
					</div>
					<!--内容-->
					<div class="appHotConfigContentCenter">
						<h4>{{list.serverName}}</h4>
						<p v-bind:title="list.serviceRemark">
							{{(list.serviceRemark!=undefined && list.serviceRemark.length>110)?(list.serviceRemark.substring(0,110)+"……"):list.serviceRemark}}
						</p>
					</div>
					<!--删除-->
					<div class="appHotConfigDlie" >
						<i @click="deleteHotServer(list)"></i>
					</div>
				   </div>
				       
				</draggable>
			</div>
			<div v-else class="noInformation" > 
					<div>	<img src="../../images/zanwu.png"  ></div>
				 </div> 
		</div>
	</div>
</template>

<script>
	import apiToken from '../../../publicJs/apiToken.js'
	import apiClient from '../../../publicJs/ApiClient.js'
	import TipBoxService from '../../../publicJs/TipBoxService.js'
	import LoadingBoxService from '../../../publicJs/LoadingBoxService.js'
	import NoticeBoxService from '../../../publicJs/NoticeBoxService.js'
	import appPublicJs from '../../common/public.js'
	import draggable from 'vuedraggable'
	export default {
	  name: 'appHotConfig',
	  data () {
	    return {
	    notNull: true,
	    dialogTableVisible: false,
	    i: -1,
	    a: -1,
	    pageNum: 1,
	    pageSize: 30,
	    flag: true,
	    flagWindow: true,
	    serverArray: [],
	    serverArray1: [],
	    serverArray2: [],
	    ifMore: true,
	    addflag: false,
	    saveflag: false,
	    numflag: false,
	    listlength: '',
	    tags: [
		            {id: 'ida1', ida: 'ida', idb: 'ida'},
		            {id: 'ida2', ida: 'ida', idb: 'ida'},
		            {id: 'ida3', ida: 'ida', idb: 'ida'},
		            {id: 'ida4', ida: 'ida', idb: 'ida'}
			    ],
			    isShowSearched: false,
	    inputValue: '',
	    serverList: [],
	    saveStatus: 0
	  }
	  },
	  components: {
	    draggable
	  },
	  mounted () {
	    this.getHotList()
	  },
	  watch: {
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
	    remoteMethod (value) {
	    if (value !== '') {
	    apiClient.get(apiToken.newApi('/appmarket/atomic/getAtomicFuzzySearch/'), {
	    title: value
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
	
	    getdata (evt) {
		        // console.log(evt.draggedContext.element.id)
		      },
		      onEnd (evt) {
				  LoadingBoxService.open('加载中...')
	        apiClient.put(apiToken.newApi('appmarket/content/dragAndContentDrop/'), appPublicJs.dragData(this.serverArray), function (data) {
				 LoadingBoxService.close()
			   if (data.results.status == false) {
     TipBoxService.open('拖拽失败!', 2)
			   }
        })
			  },
			// 查询列表
	    getHotList () {
	    var that = this
	    var myData = {
		'templateId':this.$route.query.temId,
	  'contentType': 'hot',
	  'contentName': '热门推荐',
	  'pageNum': that.pageNum,
	  'pageSize': that.pageSize
	}
	    apiClient.get(apiToken.newApi('/appmarket/content/getCotentByNotice/'), myData, function (data) {
	    if (appPublicJs.checkData(data.results.data)) {
	    that.notNull = true
	    that.serverArray = data.results.data
	    that.listlength = that.serverArray.length
	    for (var i = 0; i < that.serverArray.length; i++) {
	  that.serverArray[i].img = apiClient.apiBaseUrl + appPublicJs.serviceImgShow + that.serverArray[i].img + '&token=' + apiClient.token
	}
	    if (data.results.total < that.serverArray.length || data.results.total == that.serverArray.length || that.serverArray.length == 0) {
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
	  },
	
			// 加载更多
	    showMore () {
	    var that = this
			    that.pageNum++
	    var myData = {
		'templateId':this.$route.query.temId,
	  'pageNum': that.pageNum,
	  'pageSize': that.pageSize,
	  'contentType': 'hot',
	  'contentName': '热门推荐'
	}
	
	    apiClient.get(apiToken.newApi('/appmarket/content/getCotentByNotice/'), myData, function (data) {
	    if (appPublicJs.checkData(data.results.data)) {
	    var res = data.results.data
					 for (var i = 0; i < res.length; i++) {
							 that.serverArray[i].img = apiClient.apiBaseUrl + appPublicJs.serviceImgShow + that.serverArray[i].img + '&token=' + apiClient.token
						 that.serverArray.unshift(res[i])
	 }
	    if (data.results.total < that.serverArray.length || data.results.total == that.serverArray.length || that.serverArray.length == 0) {
	    that.ifMore = false
	  } else {
	    that.ifMore = true
	  }
	  } else {
						 that.ifMore = false
	  }
	  })
	  },
	
	    selectAll () {
	    var that = this
	    that.i = -1
	    that.dialogTableVisible = true
	    that.inputValue = ''
	    that.addflag = false
	    that.saveflag = false
	    that.numflag = false
	    this.getHotList1()
	  },
			// 回显数据serverArray2
	    getHotList1 () {
	    var that = this
	    var myData = {
		'templateId':this.$route.query.temId,
	  'contentType': 'hot',
	  'contentName': '热门推荐',
	  'pageNum': '1',
	  'pageSize': 100
	}
	    apiClient.get(apiToken.newApi('/appmarket/content/getCotentByNotice/'), myData, function (data) {
	    if (appPublicJs.checkData(data.results.data)) {
	    that.serverArray2 = data.results.data
	  } else {
	    that.serverArray2 = []
	  }
	  })
	  },

			// 点击下拉框获取服务id和服务名
	    selectItemInList (id, name) {
	    var that = this
	    this.selectItem = this.inputValue !== name
	    this.isShowSearched = false
	    this.inputValue = name
	    var serverObj = {}
	    serverObj.serverId = id// 服务id
	    serverObj.serverName = name// 服务名
	    if (appPublicJs.checkData(that.serverArray2)) {
	  if (this.haveItem(that.serverArray1, that.serverArray2, serverObj)) {
					    that.addflag = false
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
			// 判断服务已存在
	    haveItem (serverArray1, serverArray2, serverObj) {
	    var flag = true
	    for (var i = 0; i < serverArray1.length; i++) {
	  if (serverArray1[i].serverId.indexOf(serverObj.serverId) != -1) {
	    this.addflag = false
	    this.numflag = false
	    this.saveflag = true
	    flag = false
	  }
			    }
	    for (var i = 0; i < serverArray2.length; i++) {
	    if (serverArray2[i].serverId.indexOf(serverObj.serverId) != -1) {
	    this.addflag = false
	    this.numflag = false
	    this.saveflag = true
	    flag = false
	  }
			    }
	    return flag
	  },
			// 保存数据
	    saveServerNames () {
	    var that = this
	    // if (that.saveStatus == 0) {
	  if (appPublicJs.checkData(that.serverArray1)) {
	    if (that.serverArray2.length >= 30) {
	    that.numflag = true
	    that.addflag = false
					    that.saveflag = false
	    return
     } else {
	    that.numflag = false
	  }
	    for (var i = 0; i < that.serverArray1.length; i++) {
	    var myData = {
			'templateId':this.$route.query.temId,
	    'contentType': 'hot',
	    'contentName': '热门推荐',
	    'serverId': that.serverArray1[i].serverId,
	    'serverName': that.serverArray1[i].serverName,
	    'sort_order': 1
		}
			LoadingBoxService.open('加载中...')
	    apiClient.post(apiToken.newApi('/appmarket/content/saveCotent/'), myData, function (data) {
				LoadingBoxService.close();
	    if (data.results.status == true) {
	    TipBoxService.open('添加成功!')
	    that.dialogTableVisible = false
	    that.serverArray1 = []
	    that.serverArray2 = []
	    that.pageNum = 1
	    that.getHotList()
	  } else {
	    TipBoxService.open('添加失败!', 2)
	  }
	  })
	  }
	  } else {
	    that.addflag = true
	    that.saveflag = false
	    that.numflag = false
	    return
}
// 	  that.saveStatus++
// 	} else {
// 	  that.saveStatus = 0
// 	  return
// }
	  },
	
		    // 删除列表数据
	    deleteHotServer (list) {
	    var that = this
	    var myData = {
		'templateId':this.$route.query.temId,
		'id': list.id,
	  'contentType': 'hot',
	  'contentName': '热门推荐',
	  'sort_order': list.sort_order
	}
	    NoticeBoxService.open('确定删除吗?', function (val) {
					    NoticeBoxService.close()
	    apiClient.delete(apiToken.newApi('/appmarket/content/deleteContent/'), myData, function (data) {
	  if (data.results.status == true) {
							   TipBoxService.open('删除成功!')
						    that.pageNum = 1
						    that.getHotList()
	  } else {
	    TipBoxService.open('删除失败!', 2)
	  }
	})
  }, function (val) {
	})
	  },
			 // 删除数据（新增和回显的）
	    deleteHotServer1 (list) {
	    var that = this
	    var id2Array = []
	    var id1Array = []
	    var myData = {
		'templateId':this.$route.query.temId,
		'id': list.id,
	  'contentType': 'hot',
	  'contentName': '热门推荐',
	  'sort_order': list.sort_order
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
	    id1Array = that.serverArray1[i].serverId
	    if (id1Array.indexOf(list.serverId) != -1) {
	  that.serverArray1.remove(list)
	  that.serverArray2.remove(list)
	  TipBoxService.open('删除成功!')
	}
	  }
	  }
	    if (appPublicJs.checkData(that.serverArray2)) {
	    for (var i = 0; i < that.serverArray2.length; i++) {
	    id2Array = that.serverArray2[i].serverId
	    if (id2Array.indexOf(list.serverId) != -1 && id1Array.indexOf(list.serverId) == -1) {
	  apiClient.delete(apiToken.newApi('/appmarket/content/deleteContent/'), myData, function (data) {
	    if (data.results.status == true) {
	    TipBoxService.open('删除成功!')
	    that.getHotList1()
	  } else {
	    TipBoxService.open('删除失败!', 2)
	  }
							        })
					        }
	  }
	  }
	  }, function (val) {
	})
	  },

	    tagToggle (index) {
	    this.i = index
	  },
	    appHotConfigBianji (index) {
	    this.a = index
	  }
	
	  }
}
</script>
<style src='../../css/appHotConfig.css' scoped></style>
