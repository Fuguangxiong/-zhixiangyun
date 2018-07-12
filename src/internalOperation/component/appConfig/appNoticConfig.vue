<template>
	<div class="appImgConfigBox">
		<div class="appNoticConfigTop">
			<div class="appNoticeConfigTopLeft">
				<span class="icon iconfont icon-weizhi"></span>首页公告
			</div>
			<div class="appNoticeConfigTopRight" data-toggle="modal" data-target="#exampleModal" @click="selectServerName">
				新建公告
			</div>						
		</div>
		<!--新建公告弹窗-->
		<div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel">
		  <div class="modal-dialog" role="document">
		    <div class="modal-content">
		      <div class="modal-header">
		        <button type="button" class="close icon iconfont icon-guanbi1" data-dismiss="modal" aria-label="Close"><span aria-hidden="true"></span></button>
		        <h4 class="modal-title" id="exampleModalLabel">{{addOrUpdateTitle}}</h4>
		      </div>
		      <div class="modal-body">		     
		          <div class="appNoticeTitle">
		            	标题<input type="text" class="form-control" v-model="title" maxlength="15" placeholder="不能为空，不能超过15个字">		            
		          </div>
		          <div class="appNoticeTag">
		            	选择标签
		            	<ul>
		            		<li v-for="(tag,index) in tagsList" @click="tagToggle(index)">
		            			{{tag}}
		            			<span class="icon iconfont icon-xiaoduihao" v-show="index == i"></span>
		            		</li>		            		
		            	</ul>
		          </div>
		          <div class="appNoticeName">
		          		服务名称
					  <el-autocomplete  class="serverName" v-model="serverName" :fetch-suggestions="querySearchAsync" 
							  	placeholder="请输入内容"  :trigger-on-focus="false" @select="handleSelect">
					  </el-autocomplete>
		          </div>
		      </div>
		      <div class="modal-footer">
		      	<button type="button" class="btn btn-primary" @click="saveNoticInfo" data-dismiss="modal">确定</button>
		        <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>		        
		      </div>
		    </div>
		  </div>
		</div>
		
		<!--列表内容-->
		<div class="appNoticConfigContent">
			<ul>
				<li v-for="(list,index) in appNoticConfigList">
					<div class="appNoticConfigContentLeft">
							  <span class="icon iconfont icon-gonggao1"></span>
						序号: <span>{{index+1}}</span>
					</div>
					<div class="appNoticConfigContentCenter">
						<div class="appNoticeConfigContentTitle">标题：<span>{{list.title}}</span></div>
						<div class="appNoticeConfigContentName">服务名称：<span>{{list.serverName}}</span></div>
					</div>
					<div class="appNoticConfigContentCenter1">
						<div class="appNoticeConfigContentTag">
							标签：<span>{{list.tags[0]}}</span>
						</div>
					</div>
					<div class="appNoticConfigContentRight">
						<span class="icon iconfont icon-bianji2" @click="showNoticInfoById(list.id)" data-target="#exampleModal" data-toggle="modal"></span>
						<span class="icon iconfont icon-shanchu" @click="delNoticInfoById(list.id)"></span>
					</div>
				</li>								
			</ul>
			<div class="appNoticConfigBottom">
			    <span v-show="ifMore" @click="showMore">查看更多<i class="el-icon-arrow-down"></i></span>
				<span v-show="!ifMore">暂无更多数据!</span>
			</div>
		</div>
	</div>
</template>

<script>
	import LabelView from '../../../publicComponent/labelView.vue'
	import apiToken from '../../../publicJs/apiToken.js'
	import apiClient from '../../../publicJs/ApiClient.js'
	import TipBoxService from '../../../publicJs/TipBoxService.js'
	import LoadingBoxService from '../../../publicJs/LoadingBoxService.js'
	import NoticeBoxService from '../../../publicJs/NoticeBoxService.js'
	import appPublicJs from '../../common/public.js'
	export default {
		name: 'appNoticConfig',
		data() {
			return {
				id: '',
				tag:'',
				title:'',
				addOrUpdateTitle:'新增公告',
				serverId: '',
				serverName: '',
				restaurants: [],
				pageNum: 1,
				pageSize: 10,
				ifMore: true,
				i: -1,
				tagShow: '',
				appNoticConfigList: [],
				tagsList: ["热门", "最新", "热议", "热点", "通知"],
                ifNull:''
			}
		},
		mounted() {
			this.findNoticInfo();
			this.restaurants = this.selectServerName();
		},
		methods: {
			//查询列表数据
			findNoticInfo() {
				var that = this;
				var myData = {
					"pageSize": that.pageSize,
					"pageNum": that.pageNum,
					'contentType': 'notice',
					'contentName': '公告'
				}
				apiClient.get(apiToken.newApi('/appmarket/content/getCotentByNotice/'), myData, function(data) {
					if (appPublicJs.checkData(data.results.data)) {
						that.appNoticConfigList = data.results.data;
						if(data.results.total < that.appNoticConfigList.length || data.results.total==that.appNoticConfigList.length || that.appNoticConfigList.length==0){
							that.ifMore = false;
						}else{
							that.ifMore = true;
						}
					}else{
						that.appNoticConfigList =[];
						that.ifMore = false;
					}
				});
			},
			
			//保存数据
			saveNoticInfo() {
				var that = this;
				var myData = {
					'contentType': 'notice',
					'contentName': '公告',
					'title': that.title,
					'tags': that.tag,
					'serverId': that.serverId,
					'serverName': that.serverName,
					'status': '1'
				}
				if (myData.title == "") {
						TipBoxService.open("标题不能为空!", 2);
						return;
				}else{
					if (appPublicJs.checkData(that.appNoticConfigList)) {
						var titleObj = {};
							titleObj = that.title;
						for (var i = 0; i < that.appNoticConfigList.length; i++) {
						     if(that.appNoticConfigList[i].title.indexOf(titleObj)!=-1){
						　　　　　　TipBoxService.open("该标题已存在!",2);
							    return;
						　　　 }
					    }
				    }
				}
				if (myData.tags == "") {
						TipBoxService.open("标签不能为空!", 2);
						return;
				}
				if (myData.serverName != "" && myData.serverId == "") {
						TipBoxService.open("没有此服务名称!", 2);
						return;
				}
				if (myData.serverName == "") {
						TipBoxService.open("服务名称不能为空!", 2);
						return;
				}else{
					if(myData.serverId!="" && myData.title != "" && myData.tags != ""){
							if(that.id==""){
								apiClient.post(apiToken.newApi('/appmarket/content/saveCotent/'), myData, function(data) {
									if (data.results.status == true) {
										TipBoxService.open("添加成功!");
										that.pageNum = 1;
										that.findNoticInfo();
									} else {
										TipBoxService.open("添加失败!", 2);
									}
								});
							}else{
								myData.id = that.id;
								apiClient.put(apiToken.newApi('/appmarket/content/updateContent/'), myData, function(data) {
									if (data.results.status == true) {
										TipBoxService.open("修改成功!");
										that.pageNum = 1;
										that.findNoticInfo();
									} else {
										TipBoxService.open("修改失败!", 2);
									}
								});
							}
					}
				}
			},
			
			//删除数据
			delNoticInfoById(id) {
				var that = this;
				var myData = {
					'id': id,
					'contentType': 'notice',
					'contentName': '公告'
				}
				NoticeBoxService.open('确定删除吗?', function(val) {
					apiClient.delete(apiToken.newApi('/appmarket/content/deleteContent/'), myData, function(data) {
						if(data.results.status==true){
						   TipBoxService.open("删除成功!"); 
						   NoticeBoxService.close();
						   that.pageNum=1;
						   that.findNoticInfo();
						}else{
							TipBoxService.open("删除失败!",2);
						}
					});
				}, function(val) {});
			},
			
			//编辑回显数据
			showNoticInfoById(id) {
				var that = this;
				var myData = {
					'id': id,
					'contentType': 'notice',
					'contentName': '公告'
				}
				that.addOrUpdateTitle = '编辑公告';
				apiClient.get(apiToken.newApi('/appmarket/content/getCotentById/'), myData, function(data) {
					if (appPublicJs.checkData(data.results.data)) {
						that.id = data.results.data[0].id;
						that.title = data.results.data[0].title;
						that.tag = data.results.data[0].tags[0];
						if (that.tag == '热门') {
							that.i = 0;
						}
						if (that.tag == '最新') {
							that.i = 1;
						}
						if (that.tag == '热议') {
							that.i = 2;
						}
						if (that.tag == '热点') {
							that.i = 3;
						}
						if (that.tag == '通知') {
							that.i = 4;
						}
						that.serverId = '';
						that.serverName = data.results.data[0].serverName;
					}

				})
			},
			
			//点击新增公告--查询服务名称
			selectServerName() {
				var myData = {};
				var that = this;
					that.id = '';
					that.title = '';
					that.tag = '';
					that.serverId = '';
					that.serverName = '';
					that.i = -1;
					that.addOrUpdateTitle='新增公告';
				var resArray = [];
				myData = {
					status: 1,
					pageSize: 10000,
					pageNum: 1
				};
				apiClient.get(apiToken.newApi('/appmarket/atomic/getAtomic/'), myData, function(data) {
					var atomicArray = data.results.data;
					if (appPublicJs.checkData(atomicArray)) {
						for (var i = 0; i < atomicArray.length; i++) {
							var name = atomicArray[i].name;
							atomicArray[i].value = name;
							resArray.push(atomicArray[i]);
						}
					}
				});
				return resArray;
			},

			//模糊匹配查询服务
			querySearchAsync(queryString, cb) {
				var restaurants = this.restaurants;
				var that = this;
				var results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants;
				clearTimeout(this.timeout);
				this.timeout = setTimeout(() => {
					cb(results);
				}, 3000 * Math.random());
			},

			createStateFilter(queryString) {
				return (state) => {
					return (state.value.indexOf(queryString.toLowerCase()) === 0);
				};
			},

			//点击下拉框获取id和name
			handleSelect(item) {
				this.serverId = item.id;
				this.serverName = item.name;
			},

			//新增-获取选中的标签
			tagToggle(index) {
				this.tag = this.tagsList[index];
				this.i = index;
			},

			//加载更多
			showMore() {
				var that = this;
				that.pageNum++;
				var myData = {
					'contentType': 'notice',
					'contentName': '公告',
					"pageNum": that.pageNum,
					"pageSize": that.pageSize,
				}
				apiClient.get(apiToken.newApi('/appmarket/content/getCotentByNotice/'), myData, function(data) {
					if (appPublicJs.checkData(data.results.data)) {
					    var res = data.results.data;
						for (var i = 0; i < res.length; i++) {
							that.appNoticConfigList.push(res[i]);
						}
						if(data.results.total < that.appNoticConfigList.length || data.results.total==that.appNoticConfigList.length || that.appNoticConfigList.length==0){
							that.ifMore = false;
						}else{
							that.ifMore = true;
						}
					}else {
						that.ifMore = false;
					}
				});
			}
		}
	}
</script>

<style src='../../css/appNoticConfig.css' scoped></style>