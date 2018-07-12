<template>
  <div class="formaCon domeheig" :class="{formboxru:rulesaShow}" style='display:block;'>
    <el-form ref="forma" :model="formaData" status-icon :rules="rules" label-width="120px" class="formbox">
      <!-- 服务名称： -->
      <el-form-item label="服务名称：" class="form-tr" prop="service_name">
        <el-col v-show="rulesaShow" class="stylefont">
          {{data.service_name}}
        </el-col>

        <el-col v-show="!rulesaShow">
          <el-col>
            <el-input placeholder="请输入服务名称" v-model="formaData.service_name" :maxlength='15' :disabled="isModify"></el-input>
          </el-col>
          <el-col class="txet-ts"><i class="xingroe">*</i>{{rules.service_name[0].rulname}}</el-col>
        </el-col>
      </el-form-item>

      <!-- 服务期限： -->
      <el-form-item label="服务期限：" class="form-tr">
        <el-col v-show="rulesaShow" class="stylefont">
          <el-col>
            {{data.startTime}} 至 {{data.endTime}}
          </el-col>
        </el-col>

        <el-col v-show="!rulesaShow">
          <el-col :span="11">
            <el-form-item prop="startTime">
              <el-date-picker v-model="formaData.startTime" type="date" format="yyyy-MM-dd" placeholder="开始日期" :picker-options="startTimeRule" @change="changeStartDate" :disabled="isModify">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col class="line" :span="2">--</el-col>
          <el-col :span="11">
            <el-form-item prop="endTime">
              <el-date-picker v-model="formaData.endTime" format="yyyy-MM-dd" type="date" placeholder="结束日期" :picker-options="endTimeRule" @change="changeEndDate">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col class="txet-ts" :class='{clode:clode}'><i class="xingroe">*</i>{{rules.startTime[0].rulname}}</el-col>
        </el-col>
      </el-form-item>

      <!-- 服务标签： -->
      <el-form-item label="服务标签：" prop="type1">
        <span class="tagart but-style" v-for="(tag,index) in data.service_tag" :key="index" v-show="rulesaShow">
         <span class="tagstyle" :title="tag">{{tag}}</span>
        </span>

        <span @click="showTags" class="tagArea but-style" v-show="!rulesaShow">添加</span>
        <span class="tagart but-style" v-for="(tag,index) in formaData.service_tag" :key="index" v-show="!rulesaShow">
          <span class="tagstyle" :title="tag">{{tag}}</span>
          <i @click="deleteTag(index)" class="icon iconfont icon-delete-black"></i>
        </span>
        <el-col class="txet-ts" :class='{clode:!labelTip.flag}' v-show="!rulesaShow"><i class="xingroe">*</i>{{labelTip.view}}</el-col>
      </el-form-item>

      <!-- 服务简介： -->
      <el-form-item label="服务简介：" class="form-tr bomac" prop="service_brief">
        <el-col v-show="rulesaShow" class="stylefont">
          {{data.service_brief}}
        </el-col>

        <el-col v-show="!rulesaShow">
          <el-input placeholder="简单文字介绍（50字以内）" type="textarea" :rows="3" v-model="formaData.service_brief" :maxlength="50"></el-input>
          <el-col :span="24" class="tatl-texe">
            <span class="color-red">{{formaData.service_brief.length}}/50</span> 您还可以输入
            <span class="color-red">{{50-formaData.service_brief.length}}</span> 个字
          </el-col>
        </el-col>
        <el-col v-show="!rulesaShow" class="txet-ts">
          <i class="xingroe">*</i>{{rules.service_brief[0].rulname}}</el-col>
      </el-form-item>

      <!-- 服务介绍： -->
      <el-form-item label="服务介绍：" class="form-tr bomac" prop="service_remark">
        <el-col v-show="rulesaShow" class="stylefont">
          {{data.service_remark}}
        </el-col>

        <el-col v-show="!rulesaShow">
          <el-input placeholder="请信息介绍您要注册的服务(200字以内)" type="textarea" :rows="4" v-model="formaData.service_remark" :maxlength="200"></el-input>
          <el-col :span="24" class="tatl-texe">
            <span class="color-red">{{formaData.service_remark.length}}/ 200</span> 您还可以输入
            <span class="color-red">{{200-formaData.service_remark.length}}</span> 个字
          </el-col>
        </el-col>
        <el-col v-show="!rulesaShow" class="txet-ts">
          <i class="xingroe">*</i>{{rules.service_remark[0].rulname}}</el-col>
      </el-form-item>

      <!-- 按钮 -->
      <el-form-item class="but-alin" v-show="!rulesaShow">
        <el-button type="primary" @click="submitForm('forma')">保存</el-button>
        <el-button v-show="!isNew" @click="resetForm('forma')">取消</el-button>
      </el-form-item>
    </el-form>
    <LabelView :maxTag="10" 
              :dialogTagVisible.sync="dialogTagVisible" 
              :isCreateModel="isNew" 
              :model="labelData" 
              modelLabelKey="serviceTag" 
              :changeLabelCaller="saveLabel">
    </LabelView>
  </div>
</template>

<script>
import apiToken from "../../../publicJs/apiToken.js";
import apiClient from "../../../publicJs/ApiClient.js";
import TipBoxService from "../common/TipBoxService.js";
import LoadingBoxService from "../../../publicJs/LoadingBoxService.js";
import LabelView from "../../../publicComponent/labelView.vue";
export default {
  props: {
    isEdit: false,
    serviceId: {},
    msg: {},
    isModify: false
  },
  components: {
    LabelView
  },
  data() {
    var that = this;
    return {
      data: {}, //暂存初始化数据，用于取消
      isNew: true, //判断是新建还是编辑
      dialogTagVisible: false, //选择标签 是否隐藏。
      labelData: {
        serviceTag: [], //标签名称数组
        resourcetag: "" //标签名称字符串
      }, //包含标签名称数组的对象
      rulesaShow: null,
      id: "",
      clode: false,
      clode1: false,
      formaData: {
        service_name: "", //服务名称
        startTime: "", //开始时间
        endTime: "", //结束时间
        service_tag: "", //服务标签
        service_brief: "", //服务简介
        service_remark: "" //服务介绍
      },
      rules: {
        service_name: [
          {
            validator: this.validateName,
            rulname: "服务的唯一标识，审核后将不可更改",
            rulnameT: "服务的唯一标识，审核后将不可更改",
            rulnameF: "请输入服务名称",
            rulnameN: "服务名字重复，请重新输入"
          }
        ],
        startTime: [
          {
            validator: this.validateStartTime,
            type: "date",
            rulname: "用户仅可在设定的期限内对外提供服务",
            rulnameT: "用户仅可在设定的期限内对外提供服务",
            rulnameF: "请选择日期不能为空"
          }
        ],
        endTime: [
          {
            validator: this.validateEndTime,
            type: "date",
            rulname: "服务仅在设定的期限内对外设定服",
            rulnameT: "服务仅在设定的期限内对外设定服",
            rulnameF: "请选择日期不能为空"
          }
        ],
        service_brief: [
          {
            validator: this.validateBrief,
            rulname: "应用市场服务宣传展示素材",
            rulnameT: "应用市场服务宣传展示素材",
            rulnameF: "请输入应用市场服务宣传"
          }
        ],
        service_remark: [
          {
            validator: this.validateIntroduce,
            rulname: "应用市场服务详情展示素材",
            rulnameT: "应用市场服务详情展示素材",
            rulnameF: "请输入应用市场服务详情展示"
          }
        ]
      },
      labelTip: {
        flag: true,
        view: "服务类别标识，可多选",
        defult: "服务类别标识，可多选",
        error: "请选择服务类别标识！"
      },
      isModifyData: "",
      startTimeRule: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      endTimeRule: {
        disabledDate(time) {
          if (that.isModify) {
            return (
              time.getTime() < new Date(that.isModifyData).getTime()||
              time.getTime() > new Date(that.formaData.startTime).getTime() + 3600 * 1000 * 24 * 365 * 3
            );
          } else {
            return (
              time.getTime() < Date.now() ||
              time.getTime() < new Date(that.formaData.startTime).getTime() ||
              time.getTime() > new Date(that.formaData.startTime).getTime() + 3600 * 1000 * 24 * 365 * 3
            );
          }
        }
      }
    };
  },
  watch: {
    isEdit: function(nv, ov) {
      this.rulesaShow = !nv; //是否编辑
      this.isNew = this.serviceId ? false : true; //判断是新建还是编辑
      this.id = this.serviceId || "";
      if (nv) {
        this.formaData = Object.assign({}, this.msg);
        this.isModifyData = this.formaData.endTime;
        this.labelData.resourcetag = this.formaData.service_tag.join(",");
        this.labelData.serviceTag = this.formaData.service_tag;
      } else {
        this.data = Object.assign({}, this.msg);
        this.labelData.resourcetag = this.data.service_tag.join(",");
        this.labelData.serviceTag = this.data.service_tag;
      }
    },
    labelData: {
      handler(newValue, oldValue) {
        this.formaData.service_tag = this.labelData.serviceTag;
        this.labelData.resourcetag = this.formaData.service_tag.join(",");
        if (this.formaData.service_tag.length) {
          this.labelTip.flag = true;
          this.labelTip.view = this.labelTip.defult;
        }
      },
      deep: true
    }
  },
  mounted() {},
  methods: {
    //显示标签组件
    showTags() {
      var that = this;
      that.dialogTagVisible = true;
    },
    //保存标签的回调方法
    saveLabel() {
      this.formaData.service_tag = this.labelData.serviceTag;
      this.labelData.resourcetag = this.formaData.service_tag.join(",");
      return true;
    },
    //删除标签
    deleteTag(index) {
      this.labelData.serviceTag.splice(index, 1);
      this.formaData.service_tag = this.labelData.serviceTag;
    },
    //取消
    resetForm() {
      if (this.id) {
        this.$emit("submit", false);
      } else {
        TipBoxService.open("请填写基本信息并保存！", 2);
      }
    },
    //保存
    submitForm(formName) {
      var that = this;
      console.log("valid");
      this.$refs[formName].validate(valid => {
        if (!that.labelData.resourcetag.length) {
          that.labelTip.flag = false;
          that.labelTip.view = that.labelTip.error;
          return;
        }
        //基础服务
        let myData = {
          operate_page: "1", //后台为了区别数据
          name: $.trim(that.formaData.service_name), //服务名称
          service_start_time: that.formaData.startTime, //开通时间
          service_end_time: that.formaData.endTime, //结束时间
          service_tag: that.labelData.resourcetag, //标签
          service_brief: that.formaData.service_brief, //服务简介
          service_remark: that.formaData.service_remark, //"服务状态"
          id: that.id //服务id
        };
        let url = "itsmApi/createService/operateCombinationService";
        console.log("valid", valid);
        if (valid) {
          LoadingBoxService.open("正在保存，请稍候...");
          apiClient.post(url, myData, function(data) {
            LoadingBoxService.close();
            that.id = data.results.id;
            if (data.status == "200") {
              that.rulesaShow = true;
              that.$emit("submit", true, that.formaData, true, that.id);
            } else {
              TipBoxService.open(data.exception, 2);
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //日期插件的change事件
    changeStartDate(val) {
      var that = this;
      that.formaData.startTime = val;
    },
    changeEndDate(val) {
      var that = this;
      that.formaData.endTime = val;
    },
    //******** 基本信息验证//
    validateName(rule, value, callback) {
      var that = this;
      if (value === "") {
        that.rules.service_name[0].rulname =
          that.rules.service_name[0].rulnameF;
        callback("请输入");
      } else {
        var myData = {
          name: value,
          id: this.id
        };
        that.rules.service_name[0].rulname =
          that.rules.service_name[0].rulnameT;
        apiClient.post("itsmApi/atomicService/validateName", myData, function(
          data
        ) {
          if (data.status == "503" && !that.isModify) {
            callback("名字重复");
            that.rules.service_name[0].rulname =
              that.rules.service_name[0].rulnameN;
          } else {
            return callback();
          }
        });
      }
    },
    validateStartTime(rule, value, callback) {
      if (value == "") {
        this.clode = true;
        this.rules.startTime[0].rulname = this.rules.startTime[0].rulnameF;
        callback("请输入");
      } else {
        if (this.formaData.endTime == "") {
          this.rules.startTime[0].rulname = this.rules.startTime[0].rulnameF;
        } else {
          if (this.formaData.entTime == "") {
            this.rules.startTime[0].rulname = this.rules.startTime[0].rulnameF;
          } else {
            this.clode = false;
            this.rules.startTime[0].rulname = this.rules.startTime[0].rulnameT;
            callback();
          }
        }
      }
    },
    validateEndTime(rule, value, callback) {
      if (value == "") {
        this.clode = true;
        this.rules.startTime[0].rulname = this.rules.startTime[0].rulnameF;
        callback("请输入");
      } else {
        if (this.formaData.startTime == "") {
          this.rules.startTime[0].rulname = this.rules.startTime[0].rulnameF;
        } else {
          this.clode = false;
          this.rules.startTime[0].rulname = this.rules.startTime[0].rulnameT;
          callback();
        }
      }
    },
    validateBrief(rule, value, callback) {
      if (value == "" || value == undefined || value.length == 0) {
        this.rules.service_brief[0].rulname = this.rules.service_brief[0].rulnameF;
        callback("请输入");
      } else {
        this.rules.service_brief[0].rulname = this.rules.service_brief[0].rulnameT;
        return callback();
      }
    },
    validateIntroduce(rule, value, callback) {
      if (value == "" || value == undefined || value.length == 0) {
        this.rules.service_remark[0].rulname = this.rules.service_remark[0].rulnameF;
        callback("请输入");
      } else {
        this.rules.service_remark[0].rulname = this.rules.service_remark[0].rulnameT;
        return callback();
      }
    }
    // 基本信息验证*********//
  }
};
</script>
<style src="../../css/createCombinationServeice/newComStyle.css" scoped></style>
<style scoped>
.el-date-editor.el-input {
  width: 100%;
}
.clode {
  color: red;
}
.line {
  text-align: center;
}
.is-error .txet-ts {
  color: red;
}

.formboxru .form-tr::after {
  content: "";
}
</style>