<template>
	<div>
		<div class="fiexe pleft publicRightMenu">
		    <div>
		        <span class="workbench span"></span>
		    </div>
		    <div>
		        <span class="customerService span"></span>
		    </div>
		    <div>
		        <span class="opinion span"></span>
		    </div>
		    <div>
		    	<span class="fixtop stick ">顶部</span>
		    </div>
		</div>
	</div>
</template>
<script>
	export default{
		name: 'publicRightMenu',
		data(){
			return{

			}
		},
		methods:{

		},
		mounted(){

		}
	}
</script>
<style scoped>
.pleft {
 	right: 28px;
    bottom: 10%;
}
.fiexe{
    position: fixed;
    box-shadow: 0 0 3px 2px #dedede;
    z-index: 999;
    background: #fefefe;
}
.fiexe div{
    position: relative;
    border:1px solid #fff;
    border-bottom: 1px solid #ebebeb;
    cursor: pointer;
}
.fiexe div:hover{
	background:#f9f9f9;
}
.pleft div .span{
    display: block;
    width: 19px;
    height: 19px;
    color: #666;
    margin:15px;
    text-align: center;
}
.pleft div .fixtop.stick{
	display: inline-block;
	width: 100%;
	text-align: center;
	padding-top: 15px;
	margin-top: 10px;
	color: #ff526f;
	padding-bottom: 10px;
}
</style>