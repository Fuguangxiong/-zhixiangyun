<template>
	<div class="newServiceFinish">
	<rightMenu></rightMenu>
		<div class="hauto">
		<!-- <div class="fiexe pleft">
		        <h2>常用</h2>
		        <div>
		        <span class="span">
		            智能客服
		        </span>
		            <i><em class="fix-1"></em></i>
		        </div>
		        <div>
		        <span class="span">
		            智能客服
		        </span>
		            <i><em class="fix-2"></em></i>
		        </div>
		        <div>
		        <span class="span">
		            智能客服
		        </span>
		            <i><em class="fix-3"></em></i>
		        </div>
		        <h3><a href="#" class="fixtop">顶部</a></h3>
		    </div> -->
			<!-- <div class="hade">
				<div class="w1200 tophade">
					            <div class="fl loade"><a href="#">请登录</a><a href="#">立即注册</a></div>
					            <div class="fr topup">
					                <h3><em>账户信息</em><i></i></h3>
					                <div class="topup-con">
					                    <p><a href="#">11111</a></p>
					                    <p><a href="#">11111</a></p>
					                    <p><a href="#">11111</a></p>
					                    <p><a href="#">11111</a></p>
					                </div>
					            </div>
					            <div class="fr xinx"><a href="#">高级搜索</a><a href="#">服务管理</a></div>
					        </div>
			</div> -->
		    <!-- 主题内容菜单 -->
		    <div class="resoubox ">
		        <div class="resou-con">
		            <div class="w1200 h100">
		             	<div class="publicNav breadCrumb">
						      <img class="hand" @click="toMain()" src="">
							  <i @click="goHome" class="iconfont icon-dingwei"></i>
						      <!-- <router-link :to="{name:'personRegisterManage'}">服务管理</router-link> -->
						      <router-link :to="{name:breadCrumbPage}">{{breadCrumb1}}</router-link>
						
						      <span class="active">{{breadCrumb2}}</span>
					    </div>
		            <div class="mode-div lanm-con" style="overflow:auto;overflow-x: hidden; position:absolute;top:64px;bottom:0;left:15px;right:0">
		                <div class="register">
		                    <div class="lanmpege">
		                        <div class="lanmp-con">
		                            <div class="lanbbag ">
		                                <p style="width: 100%"></p>
		                            </div>
		                            <div class="lanbag-text">
		                                <span class="tim1">基本信息</span>
		                                <span class="tim2">数据配置</span>
		                                <span class="tim3">配置完成</span>
		                                <!-- <span class="tim4">返回数据设置</span>
		                                <span class="tim5">配置完成</span> -->
		                            </div>
		                        </div>
		                    </div>
		                    <div class="iformcon">
		                        <div class="iformcon-con reg4">
									<i class="iconfont icon-shenqingguanli pictureone"></i>
		                            <div class="tonggo">恭喜您，您的数据注册已成功提交！</div>
		                        </div>
		                    </div>
		                    <!--/biaodan-->
		                    <div class="buttnet">

		                        <button class="btnBlue" @click="toServiceList">完成</button>

		                    </div>
		                </div>
		            </div>
		            </div>
		        </div>
		    </div>
		    <!-- /主题内容菜单 end -->
		</div>
	</div>
</template>
<script>
import rightMenu from '../../../publicComponent/publicRightMenu.vue'
	export default{
		data(){
			return{
                APIclass: '',
                breadCrumb1: '',
                breadCrumb2: '',
                breadCrumbPage: ''
			}
		},
        created () {
            this.APIclass = this.$route.query.type
            // console.log(this.$route)
            if (this.$route.query.type === 'APIjiekou') {
                this.breadCrumb1 = '个人注册'
                this.breadCrumb2 = '配置完成'
                this.breadCrumbPage = 'personRegisterManage'
            } else if (this.$route.query.type === 'API') {
                this.breadCrumb1 = '注册管理'
                this.breadCrumb2 = '配置完成'
                this.breadCrumbPage = 'registerManageAdministrator'
            }
        },
		methods:{
			goHome () {
          this.$router.push({name: 'Index'})
            },
			toServiceList(){
				this.$router.push("personRegisterManage?index=1")
			},
			toMain(){
				this.$router.push("personRegisterManage")
			}
		},
		components:{
			rightMenu
		}
	}
</script>
<style scoped>
.box {
    position: relative;
}
.box form{
    position: relative;
}
.box input {
    position: absolute;
    left: -9999px;
}    
/* 使label充满整个box*/
.box label {
    position: absolute;
    top: 0;left: 0;right: 0;bottom: 0;
    z-index: 10; /* 这个z-index之后说到*/
    cursor:pointer ;
}
.box img{
    position: absolute;
    left: -1px;
    top: -31px;
    width: 112px;
    height: 112px;
    border: 1px solid #ccc;
}
.porthide{
    display: none;
}
.hidBox{
    display: none;
}
.register{
    padding: 90px 0;
    position: relative;
    box-sizing: border-box;
}
.lanmpege{
    background: #fff;
    height: 90px;
    position: absolute;
    top:0;
    width:100%;
}
.lanmp-con{
    width:960px;
    margin: 0 auto;
    padding-top: 30px;
}
.lanbbag{
	background: url("../../images/stepp3.png") no-repeat;
    width:915px;
    height: 36px;
	background-size:cover;
}
.lanbbag p{
    background: url("../../images/step3.png") no-repeat;
    
    height: 36px;
	background-size:cover;
}
.iformcon-con {
	position: relative;
}
.iformcon-con.reg1{
    width:1100px;
    margin: 0 auto;
}
.iformcon-con.reg2{
   width: 650px;
    margin: 0 auto;
}
.iformcon-con.reg2 .texet.lihei{
    line-height: 29px;
}
.lanbag-text{
    width:992px;
    margin-top: 5px;
}
.time-x{
    position: relative;
    padding-left: 150px;
    box-sizing: border-box;
    margin-bottom: 20px;
    margin-top: 20px;
}
.time-x span{
    display: inline-block;
    vertical-align: middle;
}
.time-x .texet{
    position: absolute;
    left: 0;
    width:145px;
    color: #333;
    font-size: 12px;
    text-align: right;
}
.inputime .css-radio{
    float: left;
    cursor: pointer;
    margin-right:45px;
}
.css-radio i {
    /* background: url(../img/radio.png) no-repeat; */
    width: 12px;
    height: 12px;
    display: inline-block;
    vertical-align: middle;
    margin-right: 4px;
}
.css-radio.active i{
    background-position: 0 -13px;
}
.shulist{
    overflow: hidden;
}
.wi540{
    width:350px;
    padding: 3px 5px;
}
.wi450{
    width: 265px;
    padding: 3px 5px;
}
.wi560{
    width:262px;
}
.wi550{
    width:350px;
    height: 100px;
    padding:5px 5px;
}
.w1{
    width:10%;
    padding: 0 10px;
    box-sizing: border-box;
    float: left;
}
.tablnav{
    border-bottom: 1px #e0e0e0 solid;
}
.tablnav ul{
    width: 800px;
    margin: 0 auto;
    margin-top: 27px;
    padding-bottom: 27px;

}
.tablnav li{
    border: 1px #999 solid;
    padding:0 10px;
    display: inline-block;
    line-height: 32px;
    border-radius: 3px;
    cursor: pointer;
    font-size: 14px;
    position: relative;
    margin-right: 3px;
}
.tablnav li.active{
    border: 1px #b61717 solid;
    color: #b61717;
}
.tablnav li.active::before{
    content: '';
    position: absolute;
    /* background: url("../img/tuerr.png") no-repeat; */
    width:13px;
    height: 13px;
    position: absolute;
    top:0;
    right: 0;
}
.shulist .inptcssw{
    width:100px;
}
.inptcss{
    border: 1px #cacaca  solid;
    border-radius: 3px;
    padding: 6px 0px 6px 0px;
}
.shulist .inptcssw1{
    width:140px;
}
.shulist .icobut{
    display: inline-block;
    border: 1px #959595 solid;
    border-radius: 50%;
    width:24px;
    height: 24px;
    font-size: 20px;
    text-align: center;
    line-height: 22px;
    cursor: pointer;
}
.shulist .icobut:hover{
    background: #b61717;
    border: 1px #b61717 solid;
    color: #fff;
}
.w2{
    width:20%;
    padding: 0 10px;
    box-sizing: border-box;
    float: left;
}
.butonst{
    border-radius: 3px;
    border: 1px #cacaca solid;
    text-align: center;
    font-size: 14px;
    line-height: 28px;
    cursor: pointer;
    padding: 0 12px;
}
.butonstdelet{
    border-radius: 3px;
    border: 1px #cacaca solid;
    text-align: center;
    font-size: 14px;
    line-height: 28px;
    cursor: pointer;
    padding: 0 12px;
}
.butonstdelet:hover{
    background: #b61717;
    border: 1px #b61717 solid;
    color: #fff;
}
.w3{
    width:30%;
    padding: 0 10px;
    box-sizing: border-box;
    float: left;
}
.shulist .inptcss{
    background: transparent;
    border: 1px #a9a9a9 solid;
    border-radius: 3px;
    height: 24px;
    padding:0;

}
.shulist-con{
    background: #f5f5f5;
    border: 1px #a9a9a9 solid;
    border-radius: 3px;
    padding: 10px 0;
}
.tabcon{
    width:800px;
}
.textreas{
    height: 180px;
}
.lanbag-text span{
    font-size: 14px;
    display: inline-block;
}
.lanbag-text span.tim2{
    margin-left: 370px;
}
.lanbag-text span.tim3{
    margin-left: 370px;
}
.lanbag-text span.tim4{
    margin-left: 130px;
}
.lanbag-text span.tim5{
    margin-left: 140px;
}
.shulist-c{
    border-top: 1px #33a6ff solid;

}
.shulist-m{
    overflow: hidden;
    border-top: 1px #cdcdcd solid;
    padding: 10px 0;
}
.shulist-m:first-child{
    border-top:none;
}
.shulist-c .shulist-m .eqad .inptcss{
    margin-left: 10px;
}
.shulist-c .shulist-m{
    border-top:none;
}
.shulist-c .shulist-c .shulist-m  .eqad .inptcss{
    margin-left: 20px;
}
.shulist-c .shulist-c .shulist-m{
    border-top:none;
}
.cssinput{
    background: transparent;
    border: 1px #dadada solid;
    border-radius: 3px;
    height: 24px;
    padding:0;
}
.tabth{
    padding-bottom:10px;
    font-size: 14px;
    overflow: hidden;
}
.butbox{
    border-radius: 3px;
    border: 1px #cacaca solid;
    text-align: center;
    font-size: 14px;
    line-height: 28px;
    cursor: pointer;
    padding: 0 12px;
}
.w200{
    width:90px;
    padding: 5px;
}
.w590{
    width:705px;
    padding: 14px 5px;
}
.fl{
    float: left;
}
.chepoc{
    float: left;
    margin:  4px 0 0 4px;
    position: relative;
}
.chepoc i.charu{
    /* background: url("../img/fxin.png") no-repeat; */
    width:20px;
    height: 20px;
    cursor: pointer;
    display: inline-block;
}
.mustAdd{
    color: #b61717
}
.charutex{
    position: absolute;
    border: 1px #d9d9d9 solid;
    border-radius: 3px;
    display: none!important;
    width:30px;
    padding: 3px 0;
    cursor: pointer;
    text-align: center;
    background: #fff;
}
.chepoc:hover .charutex{
    display: inline-block!important;
}

.teac{
    width:800px;
    height: 100px;
    font-size: 16px;
    padding: 5px 5px;
}
.buttnet{
    text-align: center;
    padding-top: 0px;
	margin-top: 50px;
	position: relative;
}
.buttnet button{
	margin: 0 10px;
	position: absolute;
	top:0;
	left:44%;
}
.touxi{
    position: absolute;
    left: 55%;
    width:300px;
    margin-left: 240px;
}
.touxi dl{
    float: left;
    margin-right: 20px;
}
.touxi dl dd{
    width:112px;
    height: 112px;
    border: 1px #ccc solid;
    border-radius: 3px;
    cursor: pointer;
}
.touxi dl dd div{
    text-align: center;
    margin-top: 30px;
}
.touxi dl dd i{
    width:30px;
    height: 30px;
    border-radius: 50%;
    border: 2px #ccc solid;
    display: inline-block;
    text-align: center;
    line-height: 23px;
    font-size: 22px;
    color: #333;
}
.touxi dl dd p{
    color: #333;
    font-size: 14px;
}
.touxi dl dt label{
    width:100%;
    margin-top: 10px;
    font-weight: 400;
}
.iformcon-con.reg4 .tonggo{
    font-size: 24px;
    /* background: url(../img/dui.png) no-repeat; */
    line-height: 70px;
    padding-left: 21px;
    color: #2c9801;
    margin: 140px auto;
    width: 464px;

}
.lanm-con{
	width:98%;
    margin-top: 10px;
	background-color:white;
}
.tabcon-mian{

}
.tabcon-mian .tabl-top{
    height: 52px;
}
.tabcon-mian .tabl-top-nav{

    padding: 11px 18px 0 18px;
    height: 41px;
    border: 1px #d8d8d8 solid;
}
.tabcon-mian .tabl-top-nav li{
    height: 40px;
    width:88px;
    display: inline-block;
    margin-right:-4px;
    cursor: pointer;
    text-align: center;
    border-width:1px 0 0 1px;
    border-color: #d8d8d8;
    border-style:solid;
    border-radius: 3px 3px 0 0;
    line-height: 40px;
    background: #fff;
}
.tabcon-mian .tabl-top-nav li:last-child{
    border-right: 1px #d8d8d8 solid;
}
.tabcon-mian .tabl-top-nav li.active{
    border-top: 1px #b61717 solid;
    color:#b61717;
    height: 41px;
}
.tabl-body{}
.tabl-body-bod{
    position: relative;
    height: 50px;
    padding-top: 10px;
    margin-top: 10px;
}
.tabl-body-bod label{
    cursor: pointer;
    margin: 0 20px;
}
.tabl-body-bod .inptexcss{
    position: absolute;
    right: 20px;
    top:0;
    background-color: #fff;
}
.tabl-body-bod label span{
    vertical-align: middle;
    font-size: 14px;
    display: inline-block;
}

.tab-box span{
    display: inline-block;
    margin-right: -4px;
    font-size: 14px;

}
.tab-box{
    margin: 0 14px;
}
.tab-box-head{
  border-bottom: 1px #0066ca solid;
}
.tab-box-head span{
    padding: 10px 0;
}
.tab-box .w10{
    width:13%;
}
.tab-box .w12{
    width:16%;
}
.biaotiimg img{
    border: 1px #d3d3d3 solid;
    border-radius: 3px;
    background: #fff;
    vertical-align: middle;
    margin-right: 4px;
    margin-left: 1px;
}
.biaotiimg em{

}
.tab-box-body .tblist{
    border-bottom: 1px #dedede solid;
}
.tab-box-body .tblist li:hover{
    background: #faf4f4;
}
.tab-box-body .tblist li{
    height: 60px;
    padding-top: 14px;
}
.up-lc{
    position: relative;
}
.up-lc-con{
    position: absolute;
    z-index:99;
    border: 1px #1056bf solid;
    border-radius: 3px;
    background: #fff;
    width: 68px;

    text-align: center;
}
.up-lc-con p{
    color: #999999;
    line-height: 34px;
    cursor: pointer;

}
.up-lc-con p.active{
    background: #1056bf;
    color: #fff;
}
.alicen{
    text-align: center;
}
.caoz{
    float: left;

}
.caoz i{
    display: inline-block;
    cursor: pointer;
    position: relative;
}

.caoz i.ico4{
    /* background:url("../img/ico-fw4.png") center no-repeat; */
    width:24px;
    height: 24px;
}
.caoz i::before{
    background: #fff;
    box-shadow: 2px 2px 2px #ccc;
    border-radius: 3px;
    display: none;
    text-align: center;
    position: absolute;
    top:0;
}
.caoz i.ico::before{
    content: '查看原因';
    width: 80px;
    right: -80px;
    line-height: 24px;
    height:24px;
}
.caoz i.ico1::before{
    content: '编辑';
    width: 40px;
    right: -40px;
    line-height: 24px;
    height:24px;
}
.caoz i.ico2::before{
    content: '删除';
    width: 40px;
    right: -40px;
    line-height: 24px;
    height:24px;
}
.caoz i.ico3::before{
    content: '撤销';
    width: 40px;
    right: -40px;
    line-height: 24px;
    height:24px;
}
.caoz i.ico4::before{
    content: '查看审批流程';
    width: 120px;
    right: -120px;
    line-height: 24px;
    height:24px;
}
.caoz i:hover::before{
    display: block;
    z-index: 99;
}
.caoz i.ico{
    /* background:url("../img/ico-fw.png") center no-repeat; */
    width:24px;
    height: 24px;
}
.caoz i.ico1{
    /* background:url("../img/ico-fw1.png") center no-repeat; */
    width:24px;
    height: 24px;
}
.caoz i.ico2{
    /* background:url("../img/ico-fw2.png") center no-repeat; */
    width:24px;
    height: 24px;
}
.caoz i.ico3{
    /* background:url("../img/ico-fw3.png") center no-repeat; */
    width:24px;
    height: 24px;
}
.kaiguanbut{
    width: 70px;
    height: 26px;
    background: #1bb617;
    display: inline-block;
    border-radius: 13px;
    position: relative;
    cursor: pointer;
}
.kaiguanbut i{
    position: absolute;
    width: 35px;
    height: 24px;
    border: 1px #1bb617 solid;
    border-radius: 12px;
    background: #fff;
}
.kaiguanbut.active{
    background: #b2b2b2;
}
.kaiguanbut.active i{
    right: 0;
    border: 1px #b2b2b2 solid;
}
.kaiguanbut b{
    font-weight: normal;
    width:50%;
    float: left;
    line-height: 26px;
    text-align: center;
    color: #fff;
}
</style>
<style scoped>
.lanbag-text span.tim1{
    color:#58A6F9
}
.lanbag-text span.tim2{
    color:#58A6F9
}
.lanbag-text span.tim3{
    color:#58A6F9
}
.pictureone{
   font-size: 81px;
   color:#57A8FA;
   position: absolute;
   left: 45%;
   top:-84px;
}
</style>

