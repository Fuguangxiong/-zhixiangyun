<template>
<div class="appser_appSearch1" :class='{toTopAppSearch:isGoTop}' >
    <div class="appser_searchplacehold">
        <div  class="appser_appSearch" >
            <div class="appser_searchTerm">
                <div class="appser_searchTermMain">
                    <div class="appser_searchTermMlogo" @click='goHome'>
                        <a class="appser_logoIco" ></a>
                        <span class="appser_logoText" >IS · CLOUD</span>
                    </div>
                    <div class="appser_searchMainCenter">
                        <div class="appser_searchBox">
                <input class="appser_inpSearch" v-model.trim="searchKeyWord" type="text" placeholder="请输入应用名称" @keyup.enter="searchService" />
                            <span class="appser_searchBtnIco" @click="searchService" >
                                <em><i class="iconfont icon-sousuo searchIcon"></i></em>
                            </span>
                        </div>
                        <div class="appser_searchOptions">
                            <ul class="appser_soUl">
                                <li class="appser_soLi" v-for="targs in targsList" @click="clickTags(targs.keyword)"><a class="appser_soLiA">{{targs.keyword}}</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>    
</div>    
</template>
<script>
    import apiToken from '../../../publicJs/apiToken.js'
    import apiClient from '../../../publicJs/ApiClient.js'
    import userService from '../../../publicJs/userService.js'
    import TipBoxService from '../../../publicJs/TipBoxService.js'
    import Util from '../../../publicJs/Util.js'
    import appPublicJs from '../../common/public.js'
    export default {
      name: 'appSearch',
      data () {
        return {
          isGoTop: false, // 中间的搜索框是否到顶部
          searchKeyWord: '', // 搜索关键词
          targsList: []
        }
      },
      props: {
        configId: '',
        type: ''
    
      },
      created () {
        this.searchKeyWord = this.$route.query.searchKeyWord === undefined ? '' : this.$route.query.searchKeyWord
        this.getTargsList()
        if (this.type == 'appsearch') {
          window.addEventListener('scroll', this.handleScroll) // 添加事件滚动监听
        }
      },
      watch: {
        configId: function (newConfigId, oldConfigId) {
          this.configId = newConfigId
          this.getTargsList()
        }
      },
      destroyed () {
		  window.removeEventListener('scroll', this.handleScroll) // 离开页面时移除scroll事件
      },
    
      methods: {
        handleScroll () {
			  var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
			  var offsetTop = document.querySelector('.appser_appSearch').offsetTop
			  if (scrollTop > offsetTop) {
			    this.isGoTop = true
			  } else {
			    this.isGoTop = false
			  }
        },
        searchService () {
          this.$router.push({name: 'appSearchList', query: {searchKeyWord: this.searchKeyWord}})
          this.$emit('toseach', this.searchKeyWord)
        },
        clickTags (targs) {
          this.searchKeyWord = targs
          this.searchService()
        },
        goHome () {
          let router = this.$route.name
          if (router == 'appHome') {
            window.scrollTo(0, 0)// 滚动到顶部
                // location.reload()
          } else {
            this.$router.push({name: 'appHome', query: {tokenId: userService.getTokenId()}})
          }
        },
        getTargsList () {
          let that = this
          var myData = {
            'templateId': window.configinfo.configId,
            'contentType': 'keyword',
            'contentName': '搜索关键词',
            'pageNum': 1,
            'pageSize': 10
          }
          apiClient.get(apiToken.newApi('/appmarket/content/getCotentByType/'), myData, function (data) {
            console.log(data, 333)
            that.targsList = data.results.data
          })
        }
      }
    }
</script>
<style scoped>
/* .toTopAppSearch{
	position: fixed;
	top: 30px;
	z-index: 777;
}
.appser_appSearch1 {
	width: 100%;
	margin: 0 auto;
}
.appser_appSearch{
	background:#fff;
	width:100vw;
	padding:20px 0;
	position: relative;
	box-shadow: 0.5px 1px 1px 1px rgba(0,0,0,0.1);
}
.appser_searchTerm{
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
}
.appser_searchTermMain{
    width: 900px;
    height: 70px;
    margin: 0 auto;
}
.appser_searchTermMlogo{
    width: 170px;
    height: 50px;
    line-height: 50px;
    float: left;
}

.appser_logoText{
    display: block;
    width: auto;
    line-height: 50px;
    font-size: 17px;
    color: #333333;
    cursor: pointer;
}
.appser_searchMainCenter{
    float: left;
    width: 80%;
    height: 70px;
}
.appser_searchBox{
    width: 100%;
    height: 40px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    border: 1px solid #f44e59;
    border-radius: 2px;
}
.appser_inpSearch{
    width: 90%;
    height: 38px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    padding-left: 15px;
    float: left;
    font-size: 14px;
    color: #8e8e8e;
    background: none;
}
.appser_searchBtnIco{
    width: 50px;
    height: 38px;
    line-height: 38px;
    text-align: center;
    background: #f44e59;
    float: right;
    cursor: pointer;
}
.appser_searchBtnIco .searchIcon{
    font-size: 30px;
    color: #ffffff;
}
.appser_searchOptions,.appser_soUl{
    width: 100%;
    height: 30px;
}
.appser_searchOptions .appser_soLi{
    float: left;
    width: auto;
    padding: 0 15px;
    line-height: 30px;
    font-size: 12px;
    color: #333333;
}
.appser_searchOptions .appser_soLi .appser_soLiA{
    color: #333333;
    cursor: pointer;
}
.appser_searchOptions .appser_soLi .appser_soLiA:hover{
    color: #f44e58;
}
.appser_searchplacehold .appser_appSearch{
    background: #fff;
    padding: 20px 0;
    position: fixed;
    top: 30px;
    z-index: 777;
    box-shadow: 0.5px 1px 1px 1px rgba(0,0,0,0.1);
    margin: 0 auto;
    width: 100%;
}

.appser_searchplacehold{
    height: 110px;
    width: 100%;
}
.appser_appSearch1 .appser_appSearch {
    background: #fff;
    padding: 20px 0;
    position: relative;
    z-index: 777;
    top: 0px;
    box-shadow: 0.5px 1px 1px 1px rgba(0,0,0,0.1);
    margin: 0 auto;
    width: 100%;
}
.appser_searchBtnIco em{
	width: 30px;
	height: 30px;
	display:inline-block;
} */
.appser_logoIco{
    display: block;
    width: 50px;
    height: 50px;
    background: url("../../images/logos.png") no-repeat;
    float: left;
    margin-right: 5px;
    cursor: pointer;
}
.appser_searchBtnIco:hover em{
	animation: myfirst .5s linear;
/* Firefox: */
-moz-animation: myfirst .5s linear ;
/* Safari 和 Chrome: */
-webkit-animation: myfirst .5s linear ;
}
@keyframes myfirst
{
0%   {
	transform:scale(1.2);
    -webkit-transform:scale(1.2);
}
25%  {
	transform:scale(.8);
    -webkit-transform:scale(.8);
}
25%  {
	transform:scale(.8);
    -webkit-transform:scale(.8);
}
50%  {
	transform:scale(1.3);
    -webkit-transform:scale(1.3);
}
75%  {
	transform:scale(1.1);
    -webkit-transform:scale(1.1);
}
100% {
	transform:scale(1);
    -webkit-transform:scale(1);
}
}
</style>
