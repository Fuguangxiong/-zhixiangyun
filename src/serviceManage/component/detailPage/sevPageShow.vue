<template>
	<!-- 主题内容菜单 -->
	<div class="boxBody" id="boxBody" style="background: #eeeeee; ">
		<div class="boxst" style="padding:0px; border: 1px #eee solid;">			
	        <!-- 右侧 -->
	        <div class="Right">
	            <!--<div class="rightTitle clearfix">
	                <div class="Iptboxer fl">	                 
	                    <input type="text" class="aIpt" id="title" v-model="title" readonly/>      
	                </div>
	                <div class="btnOuter">	                    
	                    <a href="javascript:;" class="aBtn" onclick="goBack()">上一步</a>
	                </div>               
	            </div>-->
	            <div class="rightBody" >
	            	<div class="rightBody-con">
	            		<div class="DIYBox" v-for="sever in areas" :id="sever.id" >
							
								<div class="editorAreaBox clearfix" >
									<div class="editorArea whaotu" v-for="sev in sever.sevs" :id="sev.pos_id" :style="{width:sev.mwidth,height:sev.mheight,left:sev.mleft}">
										<div class="indexcode" >
											<div class="rowtitle" style="height:40px;" >
												<input class="box-label" type="text" v-model="sev.label" readonly />		
											</div>
											<div class="box-cont" v-if="sev.stype=='2'">此区域展示内容为一个网页</div>
											<div class="box-cont" v-if="sev.stype=='3'">此区域展示内容为数据</div>
										</div>
									</div>
								</div> 
							
						</div>	            	  	
	            	</div>	                
	            </div>	            
	        </div>
		</div>		
	</div>

	
	<!-- /主题内容菜单 end -->
</template>

<script>
	import $ from 'jquery'
	/*import Bootstrap from 'bootstrap/dist/js/bootstrap.min.js'*/
	import JqUI from '../../lib/jquery-ui.min.js'
	import apiToken from '../../../publicJs/apiToken.js'
	import apiClient from '../../../publicJs/ApiClient.js'
	
	export default {
		name: 'sevPageShow',
		components: {
		},
		data() {
			return {				
				title:"", //组合服务名称
				areas:[]
			}
		},
		 props: {
		        id: String  //定义传值的类型
		},
		mounted() {	
			this.loadServices();	
		},
		methods: {			
			loadServices(){
			    var that = this;
			    //获取已经保存的模板数据	  
			    apiClient.post('itsmApi/combination/findCombinationService',{id:that.id},function(data){
		            var combination_page = data.results.data.combination_page_config;
		            if(combination_page != undefined){
		                that.title = combination_page.title;		                
		                that.areas = JSON.parse(combination_page.areas);
		            }
			    });
			},
			goBack(){
				window.history.back(-1); 
			}
		}
	}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style src="../../css/createCombinationServeice/jquery-ui.custom.min.css" scoped></style>
<style src="../../css/detailPage/pageShow.css" scoped></style>
<style scoped>
	
	.boxBody{
		width:95%;
		padding: 0;
	}
	.Right{
		background-color: #fff;
    	padding: 0px;
	}
</style>