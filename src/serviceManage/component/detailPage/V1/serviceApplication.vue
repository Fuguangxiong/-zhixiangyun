<template>
  <div class="publicContent">
      <div class="publicNav">
        <img class="hand">
        <span class="active">服务审批</span>
        <span class="arrows">></span>
        <span class="active">服务详情</span>
        <div class="topbtnContainer"></div>
      </div>
    <div class="loadDataBox">
        <div class="inpfrom">
          <h2 class="tilesc">{{formData.title}}</h2>
          <!-- 申请人信息 -->
          <div class="divtime">
              <div class="tile">
                <span class="titleInfo">
                    <i class="icon iconfont icon-tianxieshenqingrenxinxi"></i>
                    <em>申请人信息</em>
                </span>
              </div>           
          <div class="con-cont wid">
            <div class="textlinpu">
              <span class="text">申请人：</span>
              <input v-model="formData.Applicant" readonly type="text" class="inputborder textlinpu-text w240">
            </div>
            <div class="textlinpu">
              <span class="text">用户名：</span>
              <input v-model="formData.dep" readonly type="text" class="inputborder textlinpu-text w240">
            </div>
            <div class="textlinpu">
              <span class="text">单位：</span>
              <input v-model="formData.enterprisename" readonly type="text" class="inputborder textlinpu-text w240">
            </div>
            <div class="textlinpu">
              <span class="text">手机号码：</span>
              <input v-model="formData.apply_time" readonly type="text" class="inputborder textlinpu-text w240">
            </div>
            <div class="textlinpu">
              <span class="text">邮箱：</span>
              <input v-model="formData.tel" readonly type="text" class="inputborder textlinpu-text w240">
            </div>
             <div class="textlinpu">
              <span class="text">申请时间：</span>
              <input v-model="formData.loginName"  readonly type="text" class="inputborder textlinpu-text w240">
            </div>
          </div>
        </div>
        <!-- 需求描述 -->
           <div class="divtime">
            <div class="tile">
              <span class="titleInfo">
                  <i class="icon iconfont icon-tianxieshenqingrenxinxi"></i>
                  <em>需求描述</em>
              </span>
            </div>             
          <div class="con-cont wid">
            <div class="textlinpu">
              <span class="text w1000">需求类型：</span>
              <input v-model="formData.belong_type" readonly type="text" class="inputborder textlinpu-text w240">
            </div>
            <!-- <div class="textlinpu w1000">
              <span class="text">使用期限：</span>
                <input v-model="formData.service_start_time" readonly type="text" class="inputborder textlinpu-text w20">至<input v-model="formData.service_end_time" readonly type="text" class="inputborder textlinpu-text w20">
            </div> -->
            <div class="textlinpu w100" style="">
              <span class="text">使用期限：</span>
              <input :value="formData.service_start_time+'   至   '+formData.service_end_time" readonly type="text" class="inputborder textlinpu-text w240">
            </div>
            <div class="textlinpu">
              <span class="text">需求目的：</span>
              <textarea readonly="readonly" :value="formData.apply_description" class="inputborder textlinpu-text textrea">请详细描述您使用此数据的目的或用途（限300字以内）</textarea>
            </div>
          </div>
        </div>
        <!-- 其他备注 -->
        <div class="divtime">
          <div class="tile">
            <span class="titleInfo">
                <i class="icon iconfont icon-tianxieshenqingrenxinxi"></i>
                <em>其他备注</em>
            </span>
          </div>
          <div class="con-cont wid">
            <div class="textlinpu">
              <span class="text">备注：</span>
              <textarea readonly="readonly" :value="formData.apply_remark" class="inputborder textlinpu-text textrea">请详细描述您使用此数据的目的或用途（限300字以内）</textarea>
            </div>
          </div>
        </div>
        <!-- 审批流转信息 -->
        <div class="divtime">
          <div class="tile">
            <span class="titleInfo">
                <i class="icon iconfont icon-tianxieshenqingrenxinxi"></i>
                <em>审批流转</em>
            </span>
          </div>
          <div class="con-cont wid">
            <audit-exchange :apply-info="applyInfo"></audit-exchange>
          </div>
          
        </div>                      
        <!-- 审批流转信息 -->

        <!-- 审批操作 -->
        <div class="divtime">
          <div class="tile">
            <span class="titleInfo">
                <i class="icon iconfont icon-tianxieshenqingrenxinxi"></i>
                <em>审批操作</em>
            </span>
          </div>
          <div class="con-cont wid">
            <audit-operation @submitApp="submitApply"></audit-operation> 
          </div>
        </div>
                             
      </div>
    </div>
  </div>
</template>

<script>
import LabelView from "../../../publicComponent/labelView.vue";
import apiToken from "../../../publicJs/apiToken.js";
import apiClient from "../../../publicJs/ApiClient.js";
import TipBoxService from "../common/TipBoxService.js";
import LoadingBoxService from "../../../publicJs/LoadingBoxService.js";
import auditOperation from "../auditOperation.vue";
import auditExchange from "../auditExchange.vue";
export default {
  name: "serviceApplication",
  data() {
    return {
      formData: {
        portIsShow: false, //端口是否显示
        title: "",
        Applicant: "", //申请人
        loginName: "", //登录名
        tel: "", //联系电话
        dep: "", //部门
        enterprisename: "", //单位
        service_name: "", //服务名称
        belong_type: "", //需求类型
        apply_description: "基于业界领先的语义认知、大数据、人工智能技术，帮助金融机构整合企业内、外部资源，缔造新型投顾体系", //需求目的
        service_start_time: "2017-12-12", //开始时间
        service_end_time: "2018-12-12", //结束时间
        apply_remark: "基于大数据与人工智能技术，提供多种微应用及标准企业应用服务，是专注于企业及开发者的自主共享式基础云服务平台,提供全方位动态信息监测服务，实时掌握企业动态，是企业运营决策的利器", //备注
        apptype: "", //归属应用
        address: "", //服务地址
        service_tag: "", //服务标签
        open_type: "", //公开方式
        service_remark: "", //服务介绍
        service_type: "", //是数据服务还是页面服务1-有输入页面、2-无输入页面有输出页面、3-无输入页面无输出页面
        visit_num: "", //访问次数（调用次数）
        id: "", //申请ID
        apply_time: "", //申请时间.
        desc: ""
      }
    };
  },
  components: {
    auditExchange,
    auditOperation
  },
  created() {
    // this.formData.id = this.$route.query.id;
    this.getFormData();
    console.log("00000000000");
  },
  methods: {
    closeDetail() {
      //   this.$router.push();
    },
    getFormData() {
      var that = this;
      var myData = {
        id: (that.formData.id = "eb967e2cfddf4af49f6982911e9e9ea9")
      };
      apiClient.post("itsmApi/applyInfo/loadApplyInfo", myData, function(data) {
        console.log(data);
        that.formData.title = "《" + data.results.serviceList.name + "》服务使用申请";
        if (data.results.userList != null) {
          that.formData.Applicant = data.results.userList.truename;
          that.formData.dep = data.results.userList.loginname;
          that.formData.enterprisename = data.results.userList.enterprisename;
          that.formData.apply_time = data.results.userList.phone;
          that.formData.tel = data.results.userList.eamil;
          that.formData.loginName = data.results.apply_time;
        }
        that.formData.belong_type = data.results.data[0].belong_type;
        if (that.formData.belong_type == "enterprise") {
          that.formData.belong_type = "企业";
        } else if (that.formData.belong_type == "platform") {
          that.formData.belong_type = "平台";
        } else {
          that.formData.belong_type = "个人";
        }
        //that.formData.apply_description = data.results.apply_description;
      });
    },

    okBtn() {
      var operationComp = this.$refs.operationComp;
      var isshow = operationComp.isshow;
      var desc = operationComp.desc;
      if (isshow && desc == "") {
        TipBoxService.open("不通过的，备注信息必输", 2);
        this.desc = desc;
      } else {
        alert("正常调用接口");
        //   this._ajaxPost();
      }
      console.log(this.$refs.operationComp);
    },
    // 提交接口数据
    _ajaxPost() {
      let myData = this.formData;
      // 确定接口地址，拼接数据
      apiClient.post("itsmApi/atomicService/loadServiceInfo", myData, function(
        data
      ) {
        // 成功之后业务处理
        TipBoxService.open("暂存成功");
      });
    }
  }
};
</script>
<style scoped>
.btns {
  width: 100%;
  height: 32px;
  margin: 60px auto;
  text-align: center;
}
.cancel {
  display: inline-block;
  border-radius: 3px;
  text-align: center;
  font-size: 14px;
  height: 32px;
  width: 82px;
  line-height: 32px;
  cursor: pointer;
  color: #cc3333;
  background: #fff;
  border: 1px solid #ccc;
  margin: 0 auto;
  cursor: pointer;
}
.determine {
  display: inline-block;
  border-radius: 3px;
  text-align: center;
  font-size: 14px;
  height: 32px;
  width: 82px;
  line-height: 32px;
  cursor: pointer;
  color: #fff;
  background: #cc3333;
  margin: 0 auto;
  cursor: pointer;
  margin-left: 20px;
}

.textlinpu input {
  border: none;
}
.useDuration input {
  border: none;
}
</style>
<style src="../../css/detailPage/serviceApplication.css" scoped></style>
<style src="../../css/common/public.css" scoped></style>
@import "../../css/createCombinationServeice/jquery-ui.custom.min.css";

