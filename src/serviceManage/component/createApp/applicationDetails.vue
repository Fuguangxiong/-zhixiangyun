<template>
	<div class="boxService">
		<!-- 面包屑 -->
		<div class="tattop">应用管理 · {{menu}} · 应用详情</div>
    <div class="intro">
      <!-- 信息 -->
      <div class="intro-message">
        <div class="intro-messageTop" :title="listData.app_name">{{listData.app_name}}</div>
        <div class="intro-messageCon">
          <div><span>状态：</span><span class="intro-messageConSpan">{{listData.app_status}}</span><span>版本：</span><span>{{listData.app_version}}</span></div>
          <div>标签：{{listData.service_tag1}}</div>
          <!-- <div>归属企业：{{listData.apptype}}</div> -->
          <div>上传人：{{listData.user_name}}</div>
        </div>
      </div>

      <!-- 统计 -->
      <table class="intro-statistics">
        <tr>
          <th>{{listData.service_num}}</th>
          <th>{{listData.visit_num}}</th>
        </tr>
        <tr>
          <td>服务数</td>
          <td>调用次数</td>
        </tr>
      </table>
    </div>
    <div class="comcmm" v-for="(item,index) in blocks" :key="index" :class="{active:item.isOpen}">
			<div class="thade" @click="upSadt(index)">
				<span class="thade-cloe">
					<i class="icon iconfont" :class="item.icon"></i>
					<em>{{item.name}}</em>
				</span>
				<span class="upcnl">
					<em class="upjit">
						<i class="icon iconfont icon-arrow-down-copy"></i>
					</em>
				</span>
			</div>

			<!-- 基础信息 -->
			<div v-if='index==0' :isEdit='item.isEditShow' class="basicInformation">
          <ul class="basicInformationUl">
            <li><span>应用名称：</span><span class="basicInformationSpan" :title="listData.app_name">{{listData.app_name}}</span></li>
            <!-- <li><span>服务期限：</span><span class="date">2017.10.10</span>至<span class="date1">2018.01.01</span></li> -->
            <!-- <li><span>归属企业：</span><span>{{listData.apptype}}</span></li> -->
            <li><span>版本号：</span><span>{{listData.app_version}}</span></li>
            <li class="basicLabeLi"><div class="basicLabe">应用标签：</div><div class="basicLabel"><span v-for="(tag,index) in listData.service_tag" :key="index" style="margin-right:10px;" :title="tag">{{tag}}</span></div></li>
            <li class="appRemarkLi"><div>应用介绍：</div><div>{{listData.app_remark}}</div></li>
          </ul>
      </div>
			<!-- 应用上传 -->
			<div v-if='index==1' :isEdit='item.isEditShow' class="basicInformation">
          <div class="appUpload">
            <span>应用文件：</span>
            <span>{{listData.service_file?listData.service_file + "("+listData.service_size+"MB)":"无文件"}}</span>
          </div>
      </div>
		</div>
	</div>
</template>
<script>
import apiClient from "../../../publicJs/ApiClient.js";
import LoadingBoxService from '../../../publicJs/LoadingBoxService.js';
	export default {
    name: 'applicationDetails',
    components: {
      
    },
		data() {
			return {
        id: this.$route.query.id, //服务id
        // id:'fe69fd0ee3f94a59848ce9ff168b3bbc',
        status_code: this.$route.query.status_code, //从哪个列表跳转过来  企业：4 平台：1 我的：2 第三方：3
        menu: '', //跳转列表名称
        isLoading: 0, //等于3时，获取后台数据的loading效果消失
        url: {
          getAllData: "itsmApi/application/loadApp", //获取应用详情信息
        },
        // routerSource:'',
        listData:{
          app_name:'',//应用名称
          app_status:'',//应用状态
          app_version:'', //应用版本号
          service_num:'',//服务数
          user_name:'',//上传人
          app_remark:'',//应用介绍
          service_period:'',//服务期限
          service_tag:'',//应用标签
          service_tag1:'',
          apptype:'',//归属企业
          service_file:'',//应用文件
          service_size:'',//应用文件大小
          visit_num:'',//调用次数
          belongType:''
        },
				blocks: [
        {
          name: "基本信息",
          icon: "icon-jichuxinxiguanli-copy",
          isOpen: true,
          isEditShow: null,
          data: {}
        },
        {
          name: "应用上传",
          icon: "icon-tupian2",
          isOpen: true,
          isEditShow: null,
          data: {}
        }
      ]
			};
    },
    // beforeRouteEnter (to, from, next) {
    //   debugger
    //   next(vm => {
    //     if (from.name === 'enterpriseApp') {
    //       vm.routerSource = '企业应用'
    //     } else if (from.name === 'myApp') {
    //       vm.routerSource = '我的应用'
    //     } else if (from.name === 'thirdPartyApp') {
    //       vm.routerSource = '第三方应用'
    //     } else {
    //       vm.routerSource = '应用'
    //     }
    //   })
    // },
    created() {
      this.getData();
    },
		methods: {
      // 获取跳转列表名称
      getMenu (str) {
        let menu = ''
        let menuDic = [
          { label: '平台应用', value: '1' },
          { label: '我的应用', value: '2' },
          { label: '第三方应用', value: '3' },
          { label: '企业应用', value: '4' },
        ]
        menuDic.forEach(function (v, i) {
          if (str == v.value) {
            menu = v.label
            return
          }
        })
        return menu
      },
      //获取数据
      getData() {
        LoadingBoxService.open('正在查询，请稍候...')
        var that = this;
        apiClient.post(that.url.getAllData, { app_id: this.id }, function(data) {
          LoadingBoxService.close();
          if (data.status === 200) {
            var dataList = data.results.data;
            var List = data;
            console.log("详情数据",List);
            that.isLoading++;
            that.listData.app_name=dataList.app_name;//应用名称
            that.listData.app_status=dataList.app_status_text;//应用状态
            that.listData.app_version=dataList.app_version;//应用版本号
            that.listData.service_num=dataList.serviceNum;//服务数
            that.listData.user_name=dataList.applicant;//上传人
            that.listData.visit_num=dataList.remoteCount;//调用次数
            // that.listData.service_period=dataList.serverRangeTime;//服务期限
            // that.listData.service_tag=dataList.app_tag;//应用标签
            // that.listData.service_tag1=dataList.app_tag.join(',');//应用标签
            // that.listData.apptype=dataList.enterprise_name;//归属企业
            that.listData.service_file=dataList.archiver_real_name;//应用文件
            that.listData.service_size=dataList.archiver_size;//应用文件大小
            that.listData.app_remark=dataList.app_remark;//应用介绍
            // that.listData.service_tag1=dataList.app_tag.split(',');  
            that.listData.belongType = dataList.belong_type;
            that.getBelongType();
            if (dataList.app_tag != undefined) {
                let service_tag_tmp = dataList.app_tag;
                console.log(typeof(service_tag_tmp));
                if (typeof service_tag_tmp === 'string') {
                    that.listData.service_tag = JSON.parse(service_tag_tmp);
                    var service_tag2 = JSON.parse(service_tag_tmp);
                    that.listData.service_tag1 = service_tag2.join(',');
                } else {
                    that.listData.service_tag = dataList.app_tag;
                    that.listData.service_tag1 = dataList.app_tag.join(',');
                }
            }        
          }else{
            TipBoxService.open(data.exception, 2)
          }    
        });
      },
      getBelongType(){
        var that = this;
        if(that.listData.belongType === 'ENTERPRISE' && that.status_code != '2' && that.status_code != '3'){
          that.status_code = 4;
          that.menu = that.getMenu(that.status_code);
        }else{
          that.menu = that.getMenu(that.status_code);
        }
      },
			//点击手风琴
      upSadt(index) {
        if (this.blocks[index].isOpen) {
          this.onCloseBlock(index);
        } else {
          this.onOpenBlock(index);
        }
      },
      //打开模块
      onOpenBlock(index) {
        this.blocks[index].isEditShow = false;
        this.blocks[index].isOpen = true;
        $(".basicInformation")
          .eq(index)
          .slideDown(); //展开
      },
      //关闭模块
      onCloseBlock(index) {
        this.blocks[index].isOpen = false;
        $(".basicInformation")
          .eq(index)
          .slideUp();
      },
		}
	};
</script>
<style src="../../css/createApp/applicationDetails.css" scoped></style>



