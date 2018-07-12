<template>
	<div class="newServiceFinish">
		<div class="hauto">
		    <div class="resoubox ">
		        <div class="resou-con">
		            <div class="w1200 h100">
		             	<div class="publicNav">
						      <img class="hand" @click="toMain()" src="">
						      <!-- <router-link :to="{name:'personRegisterManage'}">服务管理</router-link> -->
						      <span class="active">服务管理</span>
						      <span class="arrows">></span>
						      <span class="active">创建完成</span>
						      
					    </div>
		            <div class="mode-div lanm-con" v-bind:style="{'height':(fullHeight-160) +'px'}">
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
		                        	<img src="../../images/successfully.png" height="78" width="78" alt="">
		                            <div class="tonggo">恭喜您，您的数据注册已成功提交！</div>
		                        </div>
		                    </div>
		                    <!--/biaodan-->
		                    <div class="buttnet">
		                        <span class="butonstred" @click="toServiceList">完成</span>
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
import apiClient from "../../../publicJs/ApiClient.js";
import TipBoxService from "../common/TipBoxService.js";
export default {
  data() {
    return {
      fullHeight: document.documentElement.clientHeight,
      source_type: ""
    };
  },
  mounted() {
    this.getSourceType();
  },
  methods: {
    getSourceType() {
      let vm = this;
      apiClient.post(
        "/itsmApi/atomicService/getSourceType",
        { id: vm.$route.query.id },
        function(data) {
          if (data.status == "200") {
            console.log("查询结果：", data);
            vm.source_type = data.results.source_type;
          } else {
            TipBoxService.open(data.exception, 2);
          }
        }
      );
    },
    toServiceList() {
      if ((this.source_type == "1")) {
        this.$router.push("/enterprise");
      } else if ((this.source_type == "5")) {
        this.$router.push("/registered");
      }else if ((this.source_type == "2")) {
        this.$router.push("/platformService");
      }
    },
    toMain() {
      if ((this.source_type == "1")) {
        this.$router.push("/enterprise");
      } else if ((this.source_type == "5")) {
        this.$router.push("/registered");
      }else if ((this.source_type == "2")) {
        this.$router.push("/platformService");
      }
    }
  }
};
</script>
<style src="../../css/common/public.css" scoped></style>
<style src="../../css/createBasicService/newServiceFinish.css" scoped></style>
