<template>
	<div class="appImgConfigBox">
		<div class="appKeyWordsConfigTop">
			<span ></span>搜索关键词
		</div>
		<div class="appKeyWordsConfigContent">
		
			<div class="appKeyWordsConfigContentBt">
				<div class="appKeyWordsConfigContentBtLeft">搜索关键词</div>
				<div class="appKeyWordsConfigContentBtRight">
				<div class="appKeyWordsConfigTcIp">
						<div class="aui" @click.self="isShowSearched=false">
							<input id="label-input" @keyup.13="add" name="label-input" v-model.trim="inputValue" class="text" autocomplete="off">
						</div>
						<div id="labels-autocomplete-list" class="aui-dd-parent resize-to-input" v-show="isShowSearched">
							<div class="aui-dropdown aui-dropdown-left">
								<ol class="last">
									<li class="" v-for="label in labelList" :key="label">
										<a href="javaScript:void(0)" @click="selectItemInList(label)" class="label-suggestion">
											<span :title="label"><em>{{label}}</em></span></a>
									</li>
								</ol>
							</div>
						</div>
	                 <span class="keywords" v-show="keyflag">关键词不能为空</span>
					 <span class="keywords" v-show="keylength">关键词长度不能大于4个字</span>
					 <span class="keywords" v-show="keyrepeat">关键词不能重复</span>
					 <span class="keywords" v-show="spacil">关键词不能出现特殊字符</span>
					  
				</div>
					<div id="add-labels-editor-button" class="appKeyWordsConfigAdd" @click="add">添加</div>
				</div>

			</div>
				<div class="appKeyWordsConfigContentTop">
				<div class="appKeyWordsConfigContentTopLeft">关键词</div>
				<div class="appKeyWordsConfigContentTopRight">
					<ul>
						 <draggable class="conoxList" v-model="keywordArray" :move="getdata" @update="datadragEnd">
						<li v-for="list in keywordArray">{{list.keyword}}
							<span class="icon iconfont icon-cuohao hovershow"  @click="delKeyWord(list)"></span>
						</li>
						</draggable>
					</ul>
					<div v-if="maxflag" class="maxwords">关键词最多放置8个</div>
					<div class="appKeyWordsConfigTs">(点击可拖拽，最多放置8个)</div>
				</div>
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
	import NoticeBoxService from '../../../publicJs/NoticeBoxService.js' //简单提示框
	import appPublicJs from '../../common/public.js'
	import draggable from 'vuedraggable'
	export default {
		name: 'appKeyWordsConfig',
		data() {
			return {
				inputValue: '',
				labelList: [],
				isShowSearched: false,
				keywordArray: [],
				pageNum: 1,
				pageSize: 10,
				keyflag:false,
				keylength:false,
				keyrepeat:false,
				maxflag:false,
				spacil:false,
				listlength:"",
				restaurants:[]
			}
		},
		mounted() {
			this.findKeyWord();
		},
		watch: {
			inputValue(value) {
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
         components: {
			draggable
		
		},
		methods: {
		//特殊字符校验
		 regst:function(value){
           var pattern = new RegExp("[`~!%+-.@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]")
           return pattern.test(value)
          },
			getdata (evt) {
		       // console.log(evt.draggedContext.element.id)
		      },
		      datadragEnd (evt) {
				LoadingBoxService.open('加载中...');
				 console.info(this.keywordArray)
		        // console.info("------------",appPublicJs.dragData(this.keywordArray));
		        apiClient.put(apiToken.newApi('appmarket/content/dragAndContentDrop/'), appPublicJs.dragData(this.keywordArray), function(data) {
				 LoadingBoxService.close();
				  if(data.results.status==false){
                        TipBoxService.open("拖拽失败!",2);
				   }
                 })
		      },
			remoteMethod(value) {
				
				this.labelList = [];
				if (value !== '') {
					apiClient.get('/pubapi/label/search', {
						matchName: value
					}).then(data => {
						console.log(data)
						if (!data || data.length === 0) {
							this.isShowSearched = false
							return
						}
						this.isShowSearched = true
						this.labelList = _.difference(data, this.currentLabels)
					}).catch(e => {
						console.error(e)
					})
				}
			},

			add() {
				this.isShowSearched = false
				if(this.regst(this.inputValue)){
				  this.spacil=true;
				  this.maxflag=false;
				  this.keylength=false;
				  this.keyrepeat=false;
				  this.keyflag=false;
				  	return;
                 }
				if (this.inputValue == '') {
					 this.spacil=false;
					this.maxflag=false;
					this.keylength=false;
					this.keyrepeat=false;
					this.keyflag=true;
					return;
				};
				if(this.inputValue.length>4){
					 this.spacil=false;
					this.maxflag=false;
					this.keyflag=false;
					this.keyrepeat=false;
					this.keylength=true;
                     return 
				};
				if (this.keywordArray.length < 8) {
					var keywordObj = {};
					keywordObj.keyword = this.inputValue;
					this.spacil=false;
					this.maxflag=false;
					this.keyflag=false;
					this.keylength=false;
					this.keyrepeat=false;
					var flag=false
			//判断关键词是否存在
				for (var i = 0; i < this.keywordArray.length; i++) {
				
					if(this.inputValue == this.keywordArray[i].keyword ){
						flag=true;
					 }
			    }
					if (flag) {
						this.spacil=false;
						this.maxflag=false;
						this.keyflag=false;
						this.keylength=false;
					    this.keyrepeat=true;
						return
					}else{
						this.keyrepeat=false;
					   this.spacil=false;
					  
						this.keywordArray.unshift(keywordObj);
						this.saveKeyWork(this.inputValue);
					}
					
				} else {
					this.spacil=false;
					this.keyflag=false;
					this.keylength=false;
					this.keyrepeat=false;
					this.maxflag=true;
					return;
				};

			},

			//保存数据
			saveKeyWork(keyword) {
			
				var that = this;
				
				var myData = {
					'templateId':this.$route.query.temId,
					'contentType': 'keyword',
					'contentName': '搜索关键词',
					'keyword': keyword,
					'sort_order':1
				}
				apiClient.post(apiToken.newApi('/appmarket/content/saveCotent/'), myData, function(data) {
					if (data.results.status == true) {
						TipBoxService.open("添加成功!");
						that.addToDB (keyword);
						that.findKeyWord();
					} else {
						TipBoxService.open("添加失败!", 2);
					}
				});

			},
			
			 addToDB (keyword) {
			      return apiClient.get('/pubapi/label/add', {name: keyword}).then(data => {
			        this.inputValue = ''
			      }).catch(e => {
			        console.error(e)
			      })
			    },
						

			delKeyWord(list) {
			
				var that = this;
				var myData = {
					'templateId':this.$route.query.temId,
					'id': list.id,
					'contentType': 'keyword',
					'contentName': '搜索关键词',
					'sort_order':list.sort_order
				}
				NoticeBoxService.open('确定删除吗?', function(val) {
					NoticeBoxService.close();
					apiClient.delete(apiToken.newApi('/appmarket/content/deleteContent/'), myData, function(data) {
						if (data.results.status == true) {
							that.findKeyWord();
						
							that.maxflag=false;
							that.removeLabel(list.keyword);
							TipBoxService.open("删除成功!");
							
							
						} else {
							TipBoxService.open("删除失败!", 2);
						}
					});

				}, function(val) {});
			},

			//查询列表数据
			findKeyWord() {
				var that = this;
				var myData = {
					'templateId':this.$route.query.temId,
					'contentType': 'keyword',
					'contentName': '搜索关键词',
					'pageNum': that.pageNum,
					'pageSize': that.pageSize
				}
				apiClient.get(apiToken.newApi('/appmarket/content/getCotentByType/'), myData, function(data) {
					
					if (appPublicJs.checkData(data.results.data)) {
						
						that.keywordArray = data.results.data;
						that.listlength = data.results.data.length;
					}else{
						that.keywordArray =[];
					}

				});
			},
			
			removeLabel(keyword) {
			      return apiClient.get('/pubapi/label/remove', {name: keyword}).then(data => {
			        this.inputValue = ''
			      }).catch(e => {
			        console.error(e)
			      })
		    },
			

			selectItemInList(val) {
				this.selectItem = this.inputValue !== val;
				this.isShowSearched = false
				this.inputValue = val
			}
		}

	}
</script>

<style src='../../css/appKeyWordsConfig.css' scoped></style>