<template>
  <div class="formaCon domeheig-app" :class="{formboxru:rulesaShow}" style='display:block;'>
    <el-form ref="forma" :model="forma" status-icon :rules="rulesa" :show-message="false" label-width="120px" class="formbox">
      <!-- 应用名称： -->
      <el-form-item label="应用名称：" class="form-tr" prop="app_name">
        <el-col v-show="!rulesaShow">
					<el-col>
						<el-input  placeholder="请输入应用名称" v-model.trim="forma.app_name"></el-input>
					</el-col>
				  <el-col class="txet-ts" :class="rulesa.app_name[0].ruleFlag?'red':''"><i class="xingroe" >*</i>{{rulesa.app_name[0].rulname}}</el-col>
				</el-col>
				<el-col v-show="rulesaShow" class="stylefont">
					{{data.app_name}}
				</el-col>
      </el-form-item>
      <el-form-item label="版本号：" class="form-tr" prop="app_version">
        <el-col v-show="!rulesaShow">
					<el-col>
						<el-input  placeholder="请输入版本号" v-model.trim="forma.app_version"></el-input>
					</el-col>
				  <el-col class="txet-ts" :class="rulesa.app_version[0].ruleFlag?'red':''"><i class="xingroe" >
            *</i>{{rulesa.app_version[0].rulVersionNum}}
            </el-col>
				</el-col>
				<el-col v-show="rulesaShow" class="stylefont">
					{{data.app_version}}
				</el-col>
      </el-form-item>
      <!-- 应用标签： -->
      <el-form-item label="应用标签：" prop="">
        <span class="tagart but-style" v-for="(tag,index) in forma.app_tag" :key="index+'1'" v-show="rulesaShow">
          {{tag}}
        </span>
        <span @click="showTags" class="tagArea but-style" v-show="!rulesaShow">添加</span>
        <span class="tagart but-style" v-for="(tag,index) in forma.app_tag" :key="index" v-show="!rulesaShow">
          {{tag}}
          <i @click="deleteTag(index)" class="icon iconfont icon-delete-black"></i>
        </span>
        <el-col v-show="!rulesaShow" class="txet-ts" :class="rulesa.app_tag[1]?'red':''">
          <i class="xingroe">*</i>{{rulesa.app_tag[1]?rulesa.app_tag[0]:''}}
          </el-col>
      </el-form-item>
      <el-form-item st label="应用介绍：" class="form-tr bomac" prop="app_remark">
        <el-col v-show="rulesaShow" class="stylefont">
          {{data.app_remark}}
        </el-col>
        <el-col v-show="!rulesaShow">
        <el-input placeholder="请详细介绍您要注册的应用(200字以内)"  type="textarea" :rows="4" v-model.trim="forma.app_remark"  :maxlength="200"></el-input>
         <el-col class="txet-ts" :class="rulesa.app_remark[0].ruleFlag?'red':''"><i class="xingroe" >*</i>{{rulesa.app_remark[0].rulAppRemark}}</el-col>
        <el-col :span="24" class="tatl-texe">
          <span class="color-red">{{forma.app_remark.length}}/ 200</span> 您还可以输入 <span class="color-red">{{200-forma.app_remark.length}}</span> 个字
        </el-col>
        </el-col>
        <el-col v-show="!rulesaShow" class="txet-ts"><i class="xingroe">*</i></el-col>
		  </el-form-item>
      <el-form-item class="but-alin" v-show="!rulesaShow">
        <el-button class="serviceBtn" type="primary" @click="submitForm('forma')">保存</el-button>
        <el-button class="serviceBtn" @click="resetForm('forma')">取消</el-button>
      </el-form-item>
    </el-form>
    <LabelView :maxTag="5" 
              :dialogTagVisible.sync="dialogTagVisible" 
              :isCreateModel="isNew" 
              :model="labelData" 
              modelLabelKey="serviceTag" 
              :changeLabelCaller="saveLabel">
    </LabelView>
  </div>
</template>
<script>
import LabelView from '../../../publicComponent/labelView.vue'
import apiClient from '../../../publicJs/ApiClient.js'
import TipBoxService from '../common/TipBoxService.js'
import LoadingBoxService from '../../../publicJs/LoadingBoxService.js'
export default {
  name: 'setBasicInfo',
  components: {
    LabelView
  },
  props: {
    isEdit: false,
    appId: {},
    msg: {}
  },
  data () {
    return {
      id: '',
      data: {},
      isNew: true, // 判断是新建还是编辑
      rulesaShow: false,
      dialogTagVisible: false, // 选择标签 是否隐藏。
      labelData: {
        serviceTag: [], // 标签名称数组
        resourcetag: '' // 标签名称字符串
      }, // 包含标签名称数组的对象
      forma: {
        id: '',
        app_name: '',
        app_version: '',
        app_tag: '',
        app_remark: ''
      },
      rulesa: {
        app_name: [
          {
            validator: this.validateName,
            trigger: 'blur',
            rulname: '应用的唯一标识，审核后将不可更改',
            rulnameT: '应用的唯一标识，审核后将不可更改',
            rulnameF: '请输入应用名称',
            rulnameN: '应用名字重复，请重新输入',
            rulnameL: '应用名称过长控制在15以内',
            ruleFlag: false
          }
        ],
        app_tag: ['标签不能为空', false],
        app_version: [
          {
            validator: this.validateVersionNum,
            trigger: 'blur',
            rulVersionNum: '应用版本号例如:1.0',
            rulVersionNumA: '应用版本号例如:1.0',
            rulVersionNumT: '请输入版本号',
            rulVersionNumF: '版本号长度过长',
            rulVersionNumN: '版本号格式化不正确',
            ruleFlag: false
          }
        ],
        app_remark: [
          {
            validator: this.validateIntroduce,
            trigger: 'blur',
            rulAppRemark: '请填写应用介绍',
            rulAppRemarkT: '请填写应用介绍',
            ruleFlag: false
          }
        ]
      }
    }
  },
  watch: {
    isEdit: function (nv, ov) {
      this.rulesaShow = !nv // 是否编辑
      this.isNew = !this.appId // 判断是新建还是编辑
      this.id = this.appId || ''
      if (nv) {
        this.forma = Object.assign({}, this.msg)
        this.forma.app_tag = Object.assign([], this.msg.app_tag)
        this.labelData.resourcetag = this.forma.app_tag.join(',')
        this.labelData.serviceTag = this.forma.app_tag
      } else {
        this.data = Object.assign({}, this.msg)
        this.data.app_tag = Object.assign([], this.msg.app_tag)
        this.labelData.resourcetag = this.data.app_tag.join(',')
        this.labelData.serviceTag = this.data.app_tag
      }
    },
    labelData: {
      handler (newValue, oldValue) {
        this.forma.app_tag = this.labelData.serviceTag
        this.labelData.resourcetag = this.forma.app_tag.join(',')
        if (this.forma.app_tag.length > 1) {
          this.$set(this.rulesa.app_tag, 1, false)
        }
      },
      deep: true
    }
  },
  mounted () {

  },
  methods: {
    // 显示标签组件
    showTags () {
      var that = this
      that.dialogTagVisible = true
    },
    resetForm (formName) {
      if (this.isEdit) {
        this.rulesaShow = true
        this.$emit('cancel')
      } else {
        this.$refs[formName].resetFields()
      }
      this.forma.app_tag = this.msg.app_tag
    },
    // 保存标签的回调方法
    saveLabel () {
      this.forma.app_tag = this.labelData.serviceTag
      this.labelData.resourcetag = this.forma.app_tag.join(',')
      return true
    },
    // 删除标签
    deleteTag (index) {
      this.labelData.serviceTag.splice(index, 1)
      this.forma.app_tag = this.labelData.serviceTag
    },
    // 名称校验
    validateName (rule, value, callback) {
      var that = this
      if (value === '') {
        that.rulesa.app_name[0].rulname = that.rulesa.app_name[0].rulnameF
        that.rulesa.app_name[0].ruleFlag = true
        callback('请输入应用名称')
      } else if (value.length > 15) {
        that.rulesa.app_name[0].ruleFlag = true
        that.rulesa.app_name[0].rulname = that.rulesa.app_name[0].rulnameL
      } else {
        // return callback()
        var myData = {
          id: this.id,
          app_name: value
        }
        that.rulesa.app_name[0].rulname = that.rulesa.app_name[0].rulnameT
        apiClient.post('itsmApi/application/validateName', myData, function (data) {
          if (data.status == '503') {
            callback('名字重复')
          } else {
            that.rulesa.app_name[0].ruleFlag = false
            return callback()
          }
        }).catch(error => {
          if (error.response.data.status == 503) {
            callback('名字重复')
            that.rulesa.app_name[0].rulname = that.rulesa.app_name[0].rulnameN
            that.rulesa.app_name[0].ruleFlag = true
          }
          throw error
        })
      }
    },
    validateVersionNum (rule, value, callback) {
      let that = this
      if (value === '') {
        that.rulesa.app_version[0].rulVersionNum = that.rulesa.app_version[0].rulVersionNumT
        that.rulesa.app_version[0].ruleFlag = true
        return callback('请输入版本号')
      } else if (String(Number(value)) === 'NaN') {
        that.rulesa.app_version[0].rulVersionNum = that.rulesa.app_version[0].rulVersionNumN
        that.rulesa.app_version[0].ruleFlag = true
        return callback('版本号格式不正确')
      } else if (value.length > 20) {
        that.rulesa.app_version[0].rulVersionNum = that.rulesa.app_version[0].rulVersionNumF
        that.rulesa.app_version[0].ruleFlag = true
        return callback('版本号长度过长')
      } else {
        that.rulesa.app_version[0].rulVersionNum = that.rulesa.app_version[0].rulVersionNumA
        that.rulesa.app_version[0].ruleFlag = false
        return callback()
      }
    },
    validateIntroduce (rule, value, callback) {
      if (value === '') {
        this.rulesa.app_remark[0].rulAppRemark = this.rulesa.app_remark[0].rulAppRemarkT
        this.rulesa.app_remark[0].ruleFlag = true
        return callback('请输入应用介绍')
      } else {
        this.rulesa.app_remark[0].ruleFlag = false
        return callback()
      }
    },
    submitForm (formName) {
      let that = this
      this.$refs[formName].validate(valid => {
        if (this.forma.app_tag.length === 0) {
          that.$set(that.rulesa.app_tag, 1, true)
          return
        } else {
          that.$set(that.rulesa.app_tag, 1, false)
        }
        // 基础应用
        let myData = {
          id: that.id,
          app_name: $.trim(that.forma.app_name), // 应用名称
          app_version: that.forma.app_version, // 版本号
          app_tag: that.forma.app_tag, // 标签
          app_remark: that.forma.app_remark, // 应用简介
          operate_page: '1'
        }
        let url = '/itsmApi/application/operateApp'
        console.log('valid', valid)
        if (valid) {
          LoadingBoxService.open('正在保存，请稍候...')
          apiClient.post(url, myData, function (data) {
            LoadingBoxService.close()
            that.forma.id = data.results.id
            if (data.status == '200') {
              that.rulesaShow = true
              that.$emit('submit', true, that.forma, 0)
            } else {
              TipBoxService.open(data.exception, 2)
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>
<style src="../../css/createBasicService/newServiceCom.css" scoped></style>

<style  scoped>
.txet-ts.red{
  color: #ff4949;
}
.tagart{
  display: inline-block;
  width: 80px;
  height: 30px;
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
<style>
.domeheig-app .el-form-item{
  margin-bottom: 15px;
}
</style>
