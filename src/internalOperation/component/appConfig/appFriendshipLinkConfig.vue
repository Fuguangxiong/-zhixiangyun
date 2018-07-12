<template>
	<div class="appFriendshipLink">
		<div class="appFriendHead">
			<div class="appFriendHeadName"><span>友情链接</span></div>
			<div class="appFriendHeadAddLink" data-toggle="modal" data-target="#saveModal" @click="clearData">新建</div>
		</div>
		<div v-if="notNull" class="appFriendBody">
			<div class="appFriendBodyTitle"><font class='dian'>·</font>&nbsp;&nbsp;友情链接列表（最多<span>{{pageSize}}</span>条）</div>
			<draggable class="conoxList" v-model="appFriendshipList" :move="getdata" @update="datadragEnd">
			<ul class="appFriendBodyContent" v-for="list in appFriendshipList" :key="list.title">
				<li class="appFriendBodyLi">
					<span class="appFriendBodyLiName" @click="appServiceDetail(list.url)">{{list.title}}</span>
					<span class="appFriendBodyLiUrl" v-bind:title="list.url">{{(list.url!="" && list.url!=null && list.url.length)>70?(list.url.substring(0,70)):list.url}}</span>
					<span class="appFriendBodyLiBtn" data-toggle="modal" data-target="#saveModal">
						<el-button type="text" @click="showFriendLinkById(list.id)">
							<i class="icon iconfont icon-bianji2"></i>
							<span>编辑</span>
						</el-button>
					</span>
					<span class="appFriendBodyLiBtn">
						<el-button type="text" @click="delFriendLinkById(list)">
							<i class="icon iconfont icon-shanchu"></i>
							<span>删除</span>
						</el-button>
					</span>
				</li>
			</ul>
			</draggable>
			<!--<div class="appFriendHeadAddLinkBottom">
			    <span v-show="ifMore" @click="showMore">查看更多<i class="el-icon-arrow-down"></i></span>
				<span v-show="!ifMore">暂无更多数据!</span>
		    </div>-->
		</div>
         <div v-else class="noInformation" > 
				<img src="../../images/zanwu.png"  >
		  </div> 
		<!-- 添加或修改Modal -->
		<div class="modal fade" id="saveModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" >
			<div class="modal-dialog" role="document">
				<div class="modal-content">
					<div class="modal-header">
						<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
						<h4 class="modal-title" id="myModalLabel">{{addOrUpdateTitle}}</h4>
					</div>
					<div class="modal-body">
						<div class="appFriendModal">
							<div class="appFriendModalDiv"><span><b>*</b>链接名称</span><input type="text" v-model.trim="title"  placeholder="不能为空，不超过15个字" /></div>
							<span class="check" >{{titleflag}}</span>
						   	 <div class="appFriendModalDiv"><span><b>*</b>链接URL</span><input type="text"  v-model.trim="url" placeholder="请输入标准网址" /></div>
							 <span class="check" >{{urlflag}}</span>
						</div>
					</div>
					<div class="modal-footer">
						<span @click="saveFriendLink" class="btn btn-primary">确定</span>
						<span class="btn btn-default" data-dismiss="modal">取消</span>
					</div>
				</div>
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
		name: 'appConfig',
		data() {
			return {
				notNull:true,
				listlength:'',
                id:'',
                title:'',
                url:'',
				ifMore:true,
				pageNum:1,
				pageSize:14,
				appFriendshipList: [],
				addOrUpdateTitle:'添加链接',
				titleflag:'',
				urlflag:'',
				saveStatus:0
			}
		},
		components: {
			draggable
		},
		mounted() {
			this.findFriendLink();
		},
		methods: {
			getdata (evt) {
		        console.log(evt.draggedContext.element.id)
		      },
		      datadragEnd (evt) {
		         console.info("------------",appPublicJs.dragData(this.appFriendshipList));
		        apiClient.put(apiToken.newApi('appmarket/content/dragAndContentDrop/'), appPublicJs.dragData(this.appFriendshipList), function(data) {
                   if(data.results.status==false){
                        TipBoxService.open("拖拽失败!",2);
				   }
                 })
		      },
			clearData(){
			    var that = this ;
				that.id = '';
				that.titleflag='';
				that.urlflag ='';
				that.addOrUpdateTitle ='添加链接';
				that.title='';
				that.url='';
				that.listlength=1;
			},
			
			//编辑回显数据
			showFriendLinkById(id){
				var that = this;
					that.titleflag='';
					that.urlflag ='';
				var myData  ={
					'templateId':this.$route.query.temId,
					'id':id,
					'contentType':'link ',
					'contentName':'友情链接'
				}
				that.addOrUpdateTitle = '编辑链接';
				apiClient.get(apiToken.newApi('/appmarket/content/getCotentById/'),myData,function(data){
					if(appPublicJs.checkData(data.results.data)){
						that.id = id;
						that.title = data.results.data[0].title;
						that.url = data.results.data[0].url;
						that.listlength=data.results.data[0].sort_order;
					}					
				});
			},
			
			//保存数据
			saveFriendLink(){
				var that = this;
						var myData  ={
							'templateId':this.$route.query.temId,
							'contentType':'link',
							'contentName':'友情链接',
							'title':that.title,
							'url':that.url,
							'status':'1',
							"sort_order":that.listlength
						}
						var reg= /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/ ;
						var pattern = new RegExp("[+-`~!@#$%^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]") ;
						if(myData.title==''|| myData.title==null){
							that.titleflag ='链接名称不能为空';
							return;
						}else{
							if(pattern.test(myData.title)){
								that.titleflag ='请不要输入特殊字符';
								return;
							}else{
								that.titleflag ='';
							}
							
							if(myData.title.length>15){
								that.titleflag ='输入内容超过字数上限';
								return;
							}else{
								that.titleflag ='';
							}


							if(myData.title.length>15){
								that.titleflag ='输入内容超过字数上限';
								return;
							}else{
								that.titleflag ='';
							}
							

							if(myData.url=='' || myData.title==null){
									that.urlflag ='链接URL不能为空';
									return;
							}else{
								if(!reg.test(myData.url)){
									that.urlflag ='链接URL有误';
									return;
								}else{
									that.urlflag ='';
								}
							}
							if(that.id!=""){
								    LoadingBoxService.open('加载中...')
								    myData.id = that.id;
									apiClient.put(apiToken.newApi('/appmarket/content/updateContent/'),myData,function(data){
									   $('#saveModal').modal('hide');
										LoadingBoxService.close();
										if(data.results.status==true){
											TipBoxService.open("修改成功!"); 
											// that.pageNum=1;
											that.findFriendLink();
										}else{
											TipBoxService.open("修改失败!",2);
										}
								});	
							}else{
								if (appPublicJs.checkData(that.appFriendshipList)) {
									for (var i = 0; i < that.appFriendshipList.length; i++) {
										if(that.appFriendshipList[i].title == that.title){
											that.titleflag ='链接名称已存在';
											return;
									　　}else{
											that.titleflag ='';
										}
									}
								}
								if(that.appFriendshipList.length >= that.pageSize){
									that.titleflag ='已达条数上线，无法增加';
									return;
								}else{
									that.titleflag ='';
								}
								LoadingBoxService.open('加载中...')
								apiClient.post(apiToken.newApi('/appmarket/content/saveCotent/'),myData,function(data){
									LoadingBoxService.close();
									$('#saveModal').modal('hide');
									if(data.results.status==true){
										TipBoxService.open("添加成功!"); 
										// that.pageNum=1;
										that.findFriendLink();
									}else{
										TipBoxService.open("添加失败!",2);
									}
								});
							}
						}
			},
				
			//删除数据
			delFriendLinkById(list) {
				var that = this;
				var myData  ={
					'templateId':this.$route.query.temId,
					'id':list.id,
					'contentType':'link ',
					'contentName':'友情链接',
					'sort_order':list.sort_order
				}
				NoticeBoxService.open('确定删除吗?',function(val){
						apiClient.delete(apiToken.newApi('/appmarket/content/deleteContent/'),myData,function(data){
								if(data.results.status==true){
								   TipBoxService.open("删除成功!"); 
								   NoticeBoxService.close();
								   that.pageNum=1;
								   that.findFriendLink();
								}else{
									TipBoxService.open("删除失败!",2);
								}
					     });
					},function(val){
				});
			},
			//查询列表数据
			findFriendLink(){
				var that = this;
				var myData  ={
					'templateId':this.$route.query.temId,
					"pageNum": that.pageNum,
					"pageSize": that.pageSize,
					'contentType':'link',
					'contentName':'友情链接'
				}
				apiClient.get(apiToken.newApi('/appmarket/content/getCotentByType/'), myData, function(data) {
					if(appPublicJs.checkData(data.results.data)){
							that.notNull=true;
						that.appFriendshipList = data.results.data;
						that.listlength=that.appFriendshipList.length;
						if(data.results.total < that.appFriendshipList.length || data.results.total==that.appFriendshipList.length || that.appFriendshipList.length==0){
							that.ifMore = false;
						}else{
							that.ifMore = true;
						}
					}else{
						that.notNull=false;
						that.appFriendshipList =[];
						that.ifMore = false;
					}				
			   });
			},

		}
	}
</script>
<style src="../../css/appFriendshipLink.css" scoped></style>