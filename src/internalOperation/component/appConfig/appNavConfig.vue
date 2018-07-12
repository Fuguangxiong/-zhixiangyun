<template>
    <div class="appNavConfig">
		<div class="appNavConfigTop">
			<span class="textTlie">导航菜单</span> 
		</div>
		<div v-show="notnull" class="appNavConfigcontent">
   		<div class="appNavConfigLeft">
			    <myTree></myTree>

   		</div>
   		<div class="appNavConfigRight">
			<div class="appNavConfigTag">
					<tag-Form ></tag-Form>
			</div>
   		</div>
	 </div>
	<!-- <div  v-show="!notnull"  class="noInformation" > 
				<img src="../../images/zanwu.png"  >
	</div>  -->
   	  <div class="appNavConfigLayer">		
   	</div>
    </div>
</template>

<script>

import myTree from './appNavtree.vue';
import tagForm from './appNavName.vue';
export default {
	name: 'appNavConfig',
	data() {
		return {
			activeLi: {
				'addflag':true,
				'navNname':"项目管理",
				'navTag':["人员","机器","人造","VR","互联网","车辆"],
			},
			notnull:true
		}
	},
	components: {
		myTree,
		'tag-Form':tagForm
	},
	mounted() {
		
	},
	methods: {
		// get(msg){
		// 	debugger;
        //  this.notnull= msg ;
        //   }
	}
}
</script>

<style scoped>
.appNavConfigTop .textTlie{
	position: relative;
    padding-left: 8px;
    line-height: 12px;
}
.appNavConfigTop .textTlie:after{
	content: "";
    position: absolute;
    left: 0;
    top: 2px;
    width: 2px;
    height: 12px;
    border-radius: 2px;
    background-color: #55a8fd;
}
.appNavConfigTop{
	width: 100%;
    height: 35px;
    line-height: 35px;
    font-size: 12px;
    background: #ffffff;
	border-bottom: 1px solid #f0f0f0;
	position: absolute;
	top: 0;
	left: 0;
}
.noInformation{
	max-height: 496px;
    width: 100%;
    overflow: auto;
    /* min-height: 370px; */
    height: 100%;
    background: #FFF;
    box-shadow: 0px 0px 5px #d8d7d7;
    padding: 15% 20% 0 40%;
}
.appNavConfigcontent{
	width: 100%;
	height: 100%;
	padding-top: 35px;
}
.icon-weizhi{
	color:#29d288;
	margin-right: 8px;
	font-weight: bold;
}

.appNavConfigTag {
	height: 100%;
}
.appNavConfigTag .tag{
	margin-bottom: 20px;
	height: 266px;
	width: 98%;
	border:1px solid #ededee;
	margin-right: 1%;
	border-radius: 3px;
	box-shadow: 0px 2px 3px 1px rgba(55, 55, 55, .2);
}
.appNavConfigTag .tag .el-input{
	width: 50%;
}
.appNavConfigRight .top{
	width: 100%;
	height: 55px;
	line-height: 55px;
}
.appNavConfigRight .top ul{
	height: 100%;
	width: 100%;
	padding-left:70%;
}
.appNavConfigRight .top li{
	float: left;
	padding: 0 10px;
}
.appNavConfig{
	width: 100%;
	height: 100%;
	position: relative;
}
.appNavConfigLeft{
	padding-bottom: 40px;
	width: 295px;
	height: 100%;
	background-color: #fff;
	float: left;
	margin-right: 1%;
    box-shadow: 1px 1px 3px 1px rgba(55, 55, 55, .2);
}
.appNavConfigRight{
	width: 100%;
	height: 100%;
	background-color: #fff;
	padding-left: 295px;
}
.appNavConfigLeft .title{
	height:9%;
	color: #55a8fd;
	line-height: 54px;
}
.appNavConfigLeft .title h5{
	height: 54px;
	line-height: 54px;
	padding-left: 10px;
	display: inline-block;
	width: 75%;
	font-weight: 600;
}
.appNavConfigLeft .title i{
	height: 100%;
	width: 10%;
	line-height: 54px;
	text-align: center;
	color: #a3a3a3;
	font-size: 18px;
	cursor: pointer;
	display: inline-block;
}

.appNavConfigLeft .tree-menu{
	width: 100%;
	height:90%;
	overflow-y: scroll;
}
.modal-footer.btn-primary：hover{
	margin-right: 40px;
}
</style>