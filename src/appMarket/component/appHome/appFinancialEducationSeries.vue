<template>
	<!--导航-->
<div class="bodyMain App">
<top-header :tokenId="tokenId" :userName="userInfo.PHONE" ></top-header>
<div class="publicMain Scroll">
    <!--搜索-->
    <search @event='queryData'></search> 
    <!--金融教育系列内容-->
    <div class="financialEducationSeries wonderfulSpecialColumn">
        <div class="wonderfulSpecialColumnTitle">
            <span class="wscApplicationMarket">应用市场</span>
            <span class="wscApplicationMarket">· 精彩专题</span>
            <span class="wscSpanText">· 精彩专题列表</span>
        </div>
        <div class="financialEducationSeriesMain" v-for="list in subjectDetailList1">
            <div class="fesmLeft"><img :src="list.pic"/></div>
            <div class="fesmRight">
                <h3  class="fesmRightH">{{list.title}}</h3>
                <p class="fesmRightP wordBreakDh">导语：{{list.desc}}</p>
                <div class="fesmRightFoot">共<em>&nbsp;{{total}}&nbsp;</em>款应用</div>
            </div>
        </div>
        <div class="financialEducationSeriesCenter" >
            <div class="row" >
				<div class="msgTitle" v-show='subjectDetailList.length<=0'>暂无服务</div>
                <div class="col-md-3 fesmCenter"  v-for="list in subjectDetailList" @click="appServiceDetail(list.id)">
                    <div class="fesmCenterLeft">
                        <img :src="list.img">
                    </div>
                    <div class="fesmCenterRight">
                        <h3 class="fcrH">{{list.name}}</h3>
                        <p class="fcrP wordBreakDh">{{list.service_remark}}</p>
                    </div>
                </div>              
            </div>
            <div class="hotMainCenterPage">
                <div id="kkpager"></div>
            </div>
        </div>
        <div class="financialEducationSeriesBottom" @click="showMore" v-show='hasShowMore'>加载更多<span class="el-icon-arrow-down"></span></div>
        <div class="financialEducationSeriesBottom" v-show='!hasShowMore'>暂无更多数据</div>
    </div>
</div>
	<footer-box></footer-box>
</div>
</template>

<script>
import topHeader from '../../../publicComponent/topHeader.vue'
import footerBox from './footer.vue'
import apiToken from '../../../publicJs/apiToken.js'
import apiClient from '../../../publicJs/ApiClient.js'
import search from './appSearch.vue'
import userService from '../../../publicJs/userService.js'
import Util from '../../../publicJs/Util.js'
import appPublicJs from '../../common/public.js'
export default {
	name: 'appFinancialEducationSeries',
	data() {
		return {
			hasShowMore: true,
			id: '',
			searchKeyWord: "",
			total: 0,
			pageNum: 1,
			subjectDetailList: [],
			subjectDetailList1: [], //单个接口数据
			//targsList: ["火车票查询", "测试", "在逃犯罪", "办公", "人工智能", "教育", "银行贷款", "人工智能", "教育"], //搜索框下方标签
            tokenId: null,
            configId:"",
			userInfo: {
				ID_CARD_SCAN_BACK: "",
				PHONE: "",
				IMAGE: "",
				ID: ""
			}
		}
    },
    // props:{
    //     configId:""
    // },
	components: {
		topHeader,
		footerBox,
		search
	},
	created() {
       
       
		this.tokenId = userService.getTokenId();
		this.userInfo.PHONE = userService.getUsername();
		//			console.info("this.loginFlag",this.loginFlag)
	},
	//获取数据
	mounted() {
		var that = this;
        this.id = this.$route.query.id; //接上个页面跳转过来的id
        this.configId = this.$route.query.configId;
        this.showMore();
		var myData1 = {
            'templateId':window.configinfo.configId,
            'id': this.id
		}
		//单个接口
		apiClient.get(apiToken.newApi('/appmarket/content/getCotentById/'), myData1, function(data) {
			if(Util.isArray(data.results.data)&&data.results.data.length > 0){
				that.subjectDetailList1 = data.results.data;

				var subjectDetailList1Length = that.subjectDetailList1.length;
				for (var i = 0; i < subjectDetailList1Length; i++) {
					if (that.subjectDetailList1[i].pic.indexOf('http') < 0) {
						that.subjectDetailList1[i].pic = apiClient.apiBaseUrl + '/appmarket/upload/picimg?token=' + apiClient.token+'&img=' + that.subjectDetailList1[i].pic;
					}
				}
			}
		})

	},
	methods: {
   
   
		 queryData(data){
                this.searchKeyWord = data;
                if(data.trim() != ''){
                this.searchService();
            }
            },
		appServiceDetail(id) { //详情页路由调用
			let that = this
				that.$router.push({
				path: '/appServiceDetail',
				query: {
					id: id
				}
			})
		},
		searchService() {
			let that = this
			that.$router.push({
				path: '/appSearchList',
				query: {
					searchKeyWord: this.searchKeyWord
				}
			})
		},
		clickTags(targs) {
			this.searchKeyWord = targs;
			this.searchService();
		},
		showMore() {
			var that = this,
				tags;
			tags = this.$route.query.tag;
		
			var myData = {
				'tags': tags,
				"pageSize": "8",
				"pageNum": this.pageNum,
				"status": this.status
			};
			apiClient.get(apiToken.newApi('/appmarket/atomic/getAtomic/'), myData, function(data) {
				if(Util.isArray(data.results.data)){
					var list = data.results.data;
					if (list.length > 0) {
						that.hasShowMore = true
					} else {
						that.hasShowMore = false
					}
					that.total = data.results.total;
					for (var i = 0; i < list.length; i++) {
						list[i].img = apiClient.apiBaseUrl + appPublicJs.serviceImgShow + list[i].img +'&token'+apiClient.token;
						that.subjectDetailList.push(list[i]);
					}
					if(that.subjectDetailList.length<8){
						that.hasShowMore = false
					};
					if((that.total/8)<that.pageNum-1||(that.total/8)==that.pageNum-1){
						that.hasShowMore = false;
					}
				}				
			})
			that.pageNum++;
	
		}
	}
}
</script>
<style scoped>
/*金融教育*/
.financialEducationSeries{
    width: 1200px;
    height: auto;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    padding-top: 15px;
    margin: 0 auto;
}
.financialEducationSeriesMain{
    margin-top: 15px;
    min-height: 200px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    border: 1px solid #ededee;
    border-radius: 2px;
    box-shadow: 0 3px 10px #ededed;
    padding:15px 15px 15px 337px;
    position: relative;
}
.fesmLeft{
    position: absolute;
    top: 15px;
    left: 15px;
    width: 307px;
    height: 169px;
}
.fesmLeft>img{
	width:100%;
	height:100%;
}
.fesmRight{
    position: relative;
    min-height: 170px;
}
.fesmRightH{
    font-size: 14px;
    color: #333333;
    font-weight: 600;
    margin-bottom: 20px;
}
.fesmRightP{
    font-size: 14px;
    color: #333333;
    line-height: 25px;
}
.fesmRightFoot{
    position: absolute;
    bottom: 0;
    left: 0;
    line-height: 30px;
    font-size: 12px;
    color: #333333;
}
.msgTitle{
    padding-top: 100px;
    text-align: center;
}
.financialEducationSeriesCenter{
    margin-top: 15px;
    height: auto;
    border: 1px solid #ededee;
    border-radius: 2px;
    box-shadow: 0 0 15px #ededee;
}
.financialEducationSeriesCenter>.row{
    min-height: 240px;
}
.fesmCenter{
    position: relative;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    min-height: 120px;
    padding-top: 10px;
    padding-bottom: 10px;
    padding: 10px 15px 10px 120px;
}
.fesmCenter:hover{
    box-shadow: 0px 0px 20px #e5e5e5;
}
.fesmCenterLeft{
    position: absolute;
    top: 10px;
    left: 15px;
    width: 100px;
    height: 100px;
    border-radius: 4px;
    overflow:hidden;
    background: #ccc;
}
.fesmCenterLeft>img{
	width:100%;
	height:100%;
     border-radius: 4px;
}
.fesmCenterRight{
    min-height: 100px;
    padding: 10px 0 0 20px;
}
.fcrH{
   font-size: 14px;
    color: #333333;
    font-weight: 600;
    cursor: pointer;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.wordBreakDh{
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    word-break: break-all;
}
.wonderfulSpecialColumnTitle{
    height: 50px;
    line-height: 50px;
    background: #fafafa;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    padding: 0 15px;
    font-size: 14px;
}
.fcrP{
    font-size: 14px;
    color: #333333;
    line-height: 25px;
    margin-top: 24px;
    cursor: pointer;
}
.bodyMain{
    position: relative;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    padding-top: 30px;
    width: 100%;
    overflow: hidden;
}
.publicMain{
    position: relative;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
}
/*加载更多*/
.financialEducationSeriesBottom{
	height:40px;
	line-height: 40px;
	width:100%;
	text-align: center;
	font-size: 13px;
	border: 1px solid #ededee;
	cursor: pointer;
    margin-bottom: 10px;
}
.financialEducationSeriesBottom:hover{
	box-shadow: 0 0 10px #ededee;
}
em,i{
    font-style: normal;
}

</style>
