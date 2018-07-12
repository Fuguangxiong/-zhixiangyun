<template>
<div class="outbox">   
 <div class="newService">
        <!-- /栏目头部 end-->
        <!-- 主题内容菜单 -->
        <div class="resoubox ">
            <div class="resou-con">
                <div class="w1200 h100">
                    <div class="publicNav">
                        <span class="hand" @click="toMain()"></span>
                        <span class="active">应用管理</span>
                        <span class="arrows">></span>
                        <span class="active">新建应用</span>
                        <div class="returnBtn publicRedBtn" @click="returnPage()">返回 </div>
                    </div>
                    <div class="mode-div lanm-con" v-bind:style="{'height':(fullHeight-160) +'px'}">
                        <div class="lanmpege">
                            <div class="lanmp-con">
                                <div class="lanbbag5 ">
                                    <p style="width:15%"></p>
                                </div>
                                <div class="lanbag-text1">
                                    <span class="tim1">基本信息</span>
                                    <span class="tim2">应用上传</span>
                                    <span class="tim3">资源配置</span>
                                    <span class="tim4">网络资源</span>
                                    <span class="tim5">配置完成</span>
                                </div>
                            </div>
                        </div>
                        <div class="register">
                            <div class="iformcon">
                                
                                <div class="iformcon-con reg2">
                                    <div class="time-x">
                                        <span class="texet lihei"><i>*</i>应用名称
                                        </span>
                                        <span class="inputime ">
                                            <input maxlength="20" type="text" class="inputborder textlinpu-text wi540" v-model="createAppForm.app_name" :class='{wrong:createAppForm.app_name == "" && isSubmit}'>
                                        </span>
                                    </div>
                                    <div class="time-x">
                                        <span class="texet"><i>*</i>应用类型</span>
                                        <span class="inputime ">
                                        <div name="appType" id="applyServer"class="css-radio" @click="changeState(1)" :class='{active:createAppForm.app_type ==1 }'><i></i><em>WEB应用</em></div>
                                        <div name="appType" id="applyServer"  class="css-radio" @click="changeState(2)" :class='{active:createAppForm.app_type == 2}'><i></i><em>后台应用</em></div>
                                    </span>
                                    </div>
                                    <div class="time-x">
                                        <span class="texet lihei"><i>*</i>归属企业</span>
                                        <span class="inputime ">
                                                <input type="text" class="inputborder textlinpu-text wi540" v-model="createAppForm.enterprise_name"
                                         :class='{wrong:createAppForm.enterprise_name == "" && isSubmit}'>
                                        </span>
                                    </div>
                                    <div class="time-x">
                                        <span class="texet lihei"><i>*</i>版本号</span>
                                        <span class="inputime ">
                                            <input type="text" class="inputborder textlinpu-text wi540" v-model="createAppForm.app_version"
                                            :class='{wrong:createAppForm.app_version == "" && isSubmit}'>
                                        </span>
                                    </div>
                                    <div class="time-x">
                                        <span class="texet lihei">服务期限</span>
                                        <el-date-picker
                                            v-model="startTime"
                                            type="date"
                                            format="yyyy-MM-dd"
                                            placeholder="选择日期"
                                            @change="changeStartDate"
                                            :picker-options="pickerOptions0">
                                        </el-date-picker>
                                        <span>至</span>
                                      <el-date-picker
                                            v-model="endTime"
                                            format="yyyy-MM-dd"                      
                                            type="date"
                                            placeholder="选择日期"
                                            @change="changeEndDate"
                                           :picker-options="pickerOptions1">
                                        </el-date-picker>
                                    </div>
                                    <div class="time-x">
                                        <span class="texet"><i>*</i>应用介绍</span>
                                        <span class="inputime ">
                                           <textarea class="inputborder wi550" v-model="createAppForm.app_remark"
                                            :class='{wrong:createAppForm.app_remark == "" && isSubmit}'></textarea>
                                        </span>
                                    </div>
                                    <div class="touxi">
                                   <dl>
                                            <dd class="box">
                                                <div>
                                                    <form name="mainForm">
                                                <input @change="handleFileChange('logo')"  id="id1"  type="file"  />
                                                        <img  :src="successUrl1" alt="">
                                                        <label for="id1"></label>
                                                        <div :class="{hidBox:hideFlag1}">
                                                            <i></i>
                                                            <p>服务logo上传</p> 
                                                        </div>
                                                    </form>
                                                </div>
                                            </dd>
                                            <dt><label for="id1" class="choiceLogo" @change="handleFileChange('logo')">选择logo</label></dt>
                                        </dl>
                                        <dl>
                                            <dd class="box">
                                                <div>
                                                    <form name="mainForm">
                                                        <input @change="handleFileChange('backImg')"  id="id2"  type="file"  />
                                                        <img :src="successUrl2" alt="">
                                                        <label for="id2"></label>
                                                        <div :class="{hidBox:hideFlag2}">
                                                            <i></i>
                                                            <p>服务背景图上传</p>
                                                        </div>
                                                    </form>
                                                </div>
                                            </dd>
                                            <dt><label for="id2" class="choiceBg" @change="handleFileChange('logo')">选择背景图</label></dt>
                                        </dl>
                                </div>
                                </div>
                                <div class="buttnet">
                                <span class="butonst" @click="temparySave()">暂存</span>
                                <span class="butonstred" @click="nextStep()">下一步</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
 </div>

</div>
    </div>
</div>
</div>
</template>
<script>
import $ from "jquery";
import apiToken from "../../../publicJs/apiToken.js";
import ApiClient from "../../../publicJs/ApiClient";
import LoadingBoxService from "../../../publicJs/LoadingBoxService";
/*  import selectComponent from '../../../publicComponent/selectComponent.vue'*/
import NoticeBoxService from "../../../publicJs/NoticeBoxService";
import TipBoxService from "../../../publicJs/TipBoxService";
export default {
  name: "createApp",
  components: {},
  data() {
    let that = this;
    return {
      fullHeight: document.documentElement.clientHeight,
      startTime: "",
      endTime: "",
      pickerOptions0: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      pickerOptions1: {
        disabledDate(time) {
          return (
            time.getTime() < Date.now() ||
            time.getTime() < new Date(that.startTime).getTime()
          );
        }
      },
      indexNext: 0, //记录点击下一步的次数
      successUrl1: "",
      successUrl2: "",
      hideFlag1: false,
      hideFlag2: false,
      checkedLabels: [],
      createAppForm: {
        id: "",
        app_name: "",
        app_type: 1,
        enterprise_name: "",
        app_version: "",
        app_start_time: "",
        app_end_time: "",
        app_remark: "",
        imgPath: "",
        isLast: "1",
        backg_img:'',
        logo:''
      },
      app_id: "",
      // isDefaultShow:true,
      // isSelfDefineShow:false,
      // successUrl1:'',
      isSubmit: "",
      isPass: true,
      wordMapper: [
        { name: "app_name", value: "应用名称" },
        { name: "enterprise_name", value: "企业名称" },
        { name: "app_version", value: "应用版本" },
        { name: "app_start_time", value: "开始时间" },
        { name: "app_end_time", value: "结束时间" },
        { name: "app_remark", value: "应用介绍" }
      ]
    };
  },
  created() {
    //sessionStorage.clear();

    if (
      this.$route.query.app_id != null &&
      this.$route.query.app_id != undefined &&
      this.$route.query.app_id != ""
    ) {
      this.app_id = this.$route.query.app_id;
      this.fetchData();
    } else if (
      sessionStorage.getItem("app_id") != null &&
      sessionStorage.getItem("app_id") != "null" &&
      sessionStorage.getItem("app_id") != undefined
    ) {
      this.app_id = sessionStorage.getItem("app_id");
      this.fetchData();
    }
  },
  methods: {
    changeStartDate(val) {
      this.startTime = val;
    },
    changeEndDate(val) {
      this.endTime = val;
    },
    handleFileChange(name) {
      var that = this;
      // that.hideFlag1 = false;
      // that.hideFlag2 = false;
      that.file = event.currentTarget.files[0];
      var suffix = that.file.name.substring(
        that.file.name.lastIndexOf(".") + 1,
        that.file.name.length
      );
      if (
        suffix != "jpg" &&
        suffix != "bmp" &&
        suffix != "gif" &&
        suffix != "png"
      ) {
        TipBoxService.open("只能上传图片", 1);
      } else {
        LoadingBoxService.open("正在上传请稍候...");
        if (name == "logo") {
          ApiClient.upload(
            "/itsmApi/appAttachment/addLogo?app_id=" + that.app_id,
            that.file,
            ""
          ).then(data => {
            if (data.message == 200) {
              that.createAppForm.logo=data.other;
              that.successUrl1 =ApiClient.apiBaseUrl + '/itsmApi/appAttachment/picimg?imgPath=' + that.createAppForm.logo + "&token="+ApiClient.token;
              if (that.successUrl1 != null && that.successUrl1 != undefined) {
                that.hideFlag1 = true;
              }
              console.info("获取文件图片服务器路径为:" + that.successUrl1);
              setTimeout(function() {
                LoadingBoxService.close();
                TipBoxService.open("Logo上传成功");
              }, 500);
            } else {
              LoadingBoxService.close();
              TipBoxService.open("文件上传失败,请另存文件格式后重试", 2);
            }
          });
        } else {
          console.log(that.file);
          ApiClient.upload(
            "/itsmApi/appAttachment/addImg?app_id=" + that.app_id,
            that.file,
            ""
          ).then(data => {
            if (data.message == 200) {
              that.createAppForm.backg_img=data.other;
              that.successUrl2 =ApiClient.apiBaseUrl + '/itsmApi/appAttachment/picimg?imgPath=' + that.createAppForm.backg_img + "&token="+ApiClient.token;
              if (that.successUrl2 != null && that.successUrl2 != undefined) {
                that.hideFlag2 = true;
              }
              console.info("获取文件图片服务器路径为:" + that.successUrl2);
              setTimeout(function() {
                LoadingBoxService.close();
                TipBoxService.open("背景图片上传成功", 0);
              }, 500);
            } else {
              LoadingBoxService.close();
              TipBoxService.open("文件上传失败,请另存文件格式后重试", 2);
            }
          });
        }
      }
    },
    changeLabels(changed, selectLabels) {
      if (changed) {
        let labelIds = [];
        let labelStr = "";
        for (let i = 0; i < selectLabels.length; i++) {
          labelIds.push(selectLabels[i].id);
          labelStr = labelStr + selectLabels[i].name + ",";
        }
        if (labelStr.length > 0) {
          labelStr = labelStr.substr(0, labelStr.length - 1);
        }
        this.resource.resourcetag = labelStr;
        this.checkedLabels = labelIds;
      }
      this.dialogTagVisible = false;
    },
    changeState(value) {
      let that = this;
      that.createAppForm.app_type = value;
    },
    toMain() {
      this.$router.push("appsManager");
    },
    fetchData() {
      let that = this;
      var myData = { id: that.app_id };

      ApiClient.post(
        "itsmApi/application/loadApp",
        { id: that.app_id },
        function(data) {
          console.info("结果：", data);
          var app_id = data.results.id || that.app_id;
          if (data.status == 200 && data.results.data) {
            let key = Object.keys(data.results.data[0]);
            key.forEach(function(v, i) {
              if (that.createAppForm[v] != undefined) {
                that.createAppForm[v] = data.results.data[0][v];
              }
            });
            if (that.createAppForm)
              that.successUrl1 = data.results.logoServerPath;
            that.successUrl2 = data.results.imageServerPath;
            console.info("页面加载时：获取资源路径：" + that.successUrl1);
            that.startTime = that.createAppForm.app_start_time;
            that.endTime = that.createAppForm.app_end_time;
            if (that.successUrl1 != null && that.successUrl1 != undefined) {
              that.hideFlag1 = true;
            }
            if (that.successUrl2 != null && that.successUrl2 != undefined) {
              that.hideFlag2 = true;
            }
          } else {
            TipBoxService.open("数据异常", 1);
          }
        }
      );
    },
    nextStep() {
      let that = this;
      that.isSubmit = true;
      that.createAppForm.app_start_time = that.startTime;
      that.createAppForm.id = that.app_id;
      that.createAppForm.app_end_time = that.endTime;
      that.validator();
      if (!that.isPass) {
        return;
      }
      if (that.indexNext == 0) {
        var myData = that.createAppForm;
        ApiClient.post("itsmApi/application/saveApp", myData, function(data) {
          var app_id = data.results.id;
          if (data.status == 200) {
            sessionStorage.removeItem("app_id");
            that.$router.push({ path: "uploadApp", query: { app_id: app_id } });
            that.indexNext++;
          } else {
            TipBoxService.open(data.exception, 1);
          }
        });
      }
    },
    temparySave() {
      let that = this;
      that.isSubmit = true;
      that.createAppForm.id = that.app_id;
      that.createAppForm.app_start_time = that.startTime;
      that.createAppForm.app_end_time = that.endTime;
      that.validator();
      if (!that.isPass) {
        return;
      }
      LoadingBoxService.open("正在暂存......");
      var myData = that.createAppForm;
      ApiClient.post("itsmApi/application/saveApp", myData, function(data) {
        that.app_id = data.results.id;
        // sessionStorage.setItem("app_id", that.app_id);
        if (data.status == 200) {
          TipBoxService.open("暂存成功!", 0);
          LoadingBoxService.close();
        } else {
          if (
            that.$route.query.app_id == null ||
            that.$route.query.app_id == undefined ||
            that.$route.query.app_id == ""
          ) {
            that.app_id = null;
            sessionStorage.setItem("app_id", that.app_id);
          }
          TipBoxService.open(data.exception, 1);
          LoadingBoxService.close();
        }
      });
    },
    validator() {
      let that = this;
      that.isPass = true;
      var elements = Object.keys(that.createAppForm);
      var breakValue = false;
      var checkVersion = /^[^\u4e00-\u9fa5]+$/;
      elements.forEach(function(v, i) {
        if (breakValue) {
          return;
        }
        if (
          "imgPath" != v &&
          "id" != v &&
          "app_start_time" != v &&
          "backg_img" != v &&
          "logo" != v &&
          "app_end_time" != v
        ) {
          var value = that.createAppForm[v];
          if (
            "" == value ||
            value.length == 0 ||
            value == null ||
            value == undefined
          ) {
            that.isPass = false;
            var wordText = "";
            that.wordMapper.forEach(function(localValue, i) {
              if (localValue.name == v) {
                wordText = localValue.value;
                TipBoxService.open(wordText + "不可以为空!", 1);
                breakValue = true;
                return;
              }
            });
          }
          if (v == "app_name" && value.length > 20) {
            TipBoxService.open("应用名称长度最多为20个字符", 1);
            breakValue = true;
            that.isPass = false;
            return;
          }
          if (v == "enterprise_name" && value.length > 20) {
            TipBoxService.open("企业名称长度最多为20个字符", 1);
            breakValue = true;
            that.isPass = false;
            return;
          }
          if (v == "app_version") {
            if (value == "") {
              TipBoxService.open("版本号不能为空", 1);
              breakValue = true;
              that.isPass = false;
              return;
            } else if (!checkVersion.test(value)) {
              TipBoxService.open("版本号仅允许输入半角英文、数字及特殊符号", 1);
              breakValue = true;
              that.isPass = false;
              return;
            } else if (value.length > 20) {
              TipBoxService.open("版本号长度不能超过20", 1);
              breakValue = true;
              that.isPass = false;
              return;
            }
          }
          if (v == "app_remark" && value.length > 200) {
            TipBoxService.open("应用介绍最多为200个字", 1);
            breakValue = true;
            that.isPass = false;
            return;
          }
        }
      });
    },
    returnPage() {
      this.$router.push({ name: "appsManager", query: {} });
    }
  }
};
</script>
<style src="../../css/common/public.css" scoped></style>
<style src="../../css/createApp/createApp.css" scoped></style>

