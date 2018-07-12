<template>
        <div class="formaCon">
         <el-form class="foamta formbox" :rules="rulesb" ref="formb" :model="formb" label-width="120px" size="mini">
				<el-form-item label="服务类型：">
                    <el-radio-group v-model="formb.apptype"  v-show="!rulesaShow"> 
                        <el-radio-button :disabled="isModify" label="1" >远程服务</el-radio-button>
                        <el-radio-button :disabled="isModify" label="2">应用服务</el-radio-button>
                    </el-radio-group>
                    <el-col v-show="rulesaShow">
                        {{apptype_dm}}
                    </el-col>
				</el-form-item>
				<el-form-item label="应用列表：" :class="formb.apptype==1 ? 'notSend' : 'send' ">
          <el-select :disabled="isModify" v-show="!rulesaShow" v-model="appValue" placeholder="请选择" @change="getSelectApp()">
            <el-option
              v-for="item in appList"
              :key="item.id"
              :label="item.app_name"
              :value="item.id">
            </el-option>
          </el-select>
          <el-col v-show="rulesaShow" class="stylefont">
            {{appName}}
          </el-col>
				</el-form-item>
				<el-form-item label="页面类型：" prop="service_type">
          <el-radio-group v-model="formb.service_type"  v-show="!rulesaShow" > 
              <el-radio-button :disabled="isModify" label="1"><span class="clope" >页面请求</span></el-radio-button>
              <el-radio-button :disabled="isModify" label="2"><span class="clope" >页面数据请求</span></el-radio-button>
              <el-radio-button :disabled="isModify" label="3"><span class="clope" >纯数据请求</span></el-radio-button>
          </el-radio-group>
          <!-- <el-checkbox-group  v-model="formb.service_type" v-show="!rulesaShow" @change="cshoice">
            <el-checkbox-button :disabled="isModify" label="1" name="type"><span class="clope" @click="cshoicea('1')">页面请求</span></el-checkbox-button>
            <el-checkbox-button :disabled="isModify" label="2" name="type"><span class="clope" @click="cshoicea('2')">页面数据请求</span></el-checkbox-button>
            <el-checkbox-button :disabled="isModify" label="3" name="type"><span class="clope" @click="cshoicea('3')">纯数据请求</span></el-checkbox-button>
				  </el-checkbox-group> -->
          <el-col v-show="rulesaShow">
            <span class="tagart but-style" v-for="(time,index) in service_type_dm" :key="index">
                <span class="tagstyle" :title="time">{{time}}</span>
            </span>
          </el-col>
          <el-col class="txet-ts" v-show="!rulesaShow"><i class="xingroe">*</i>{{rulesb.service_type[0].rulname}}</el-col>
				</el-form-item>
				<el-form-item label="服务标签：" prop="type1">
          <el-col v-show="!rulesaShow">
            <span @click="showTags" class="tagArea but-style">添加</span>
            <span class="tagart but-style" v-for="(tag,index) in formb.service_tag" :key="index">
              <span class="tagstyle" :title="tag">{{tag}}</span>
              <i @click="deleteTag(index)" class="icon iconfont icon-delete-black"></i>
            </span>
          </el-col>
          <el-col v-show="rulesaShow">
            <span class="tagart but-style" v-for="(time,index) in formb.service_tag" :key="index">
                <span class="tagstyle" :title="time">{{time}}</span>
            </span>
          </el-col>
          <el-col class="txet-ts" v-show="!rulesaShow"><i class="xingroe">*</i>{{rulesb.type1[0].rulname}}</el-col>
				</el-form-item>
				<el-form-item class="but-alin"  v-show="!rulesaShow">
					<el-button class="serviceBtn" type="primary" @click="submitForm('formb')">保存</el-button>
					<el-button class="serviceBtn" @click="resetForm('formb')">取消</el-button>
				</el-form-item>
			</el-form>
            <LabelView :maxTag="10" :dialogTagVisible.sync="dialogTagVisible" :isCreateModel="!isEdit" :model="metaData" modelLabelKey="serviceTag" :changeLabelCaller="saveLabel" />
        </div>
</template>
    <script>
import LabelView from '../../../publicComponent/labelView.vue'
import htmlRequest from './htmlRequest.vue'
import apiToken from '../../../publicJs/apiToken.js'
import apiClient from '../../../publicJs/ApiClient.js'
import TipBoxService from '../common/TipBoxService.js'
import LoadingBoxService from '../../../publicJs/LoadingBoxService.js'
export default {
  watch: {
    metaData: {
      handler (newValue, oldValue) {
        this.formb.service_tag = this.metaData.serviceTag
        this.metaData.resourcetag = this.formb.service_tag.join(',')
        console.info('-----1', newValue)
      },
      deep: true
    },
    isChide: function (nv, ov) {
      this.id = nv
    },
    isEdit: function (nv, ov) {
      var that = this
      this.editState = this.isEditdmb.isEditShow
      this.rulesaShow = this.isEditdmb.isEditShow // 是否编辑
      if (nv) {
        if (
          this.isEditdmb.service_type != undefined &&
          this.isEditdmb.service_type != ''
        ) {
          this.editState = this.isEditdmb.isEditShow
          this.formb.apptype = this.isEditdmb.apptype
          this.formb.app_id = this.isEditdmb.app_id
          this.appValue = this.isEditdmb.app_id
          this.formb.service_type = this.isEditdmb.service_type[0]
          this.formb.service_tag = this.isEditdmb.service_tag
          this.metaData.resourcetag = this.isEditdmb.service_tag.join(',')
          this.metaData.serviceTag = this.isEditdmb.service_tag
          this.checkList = this.isEditdmb.service_type
          that.service_type_dm = []
          // 转换
          if (that.formb.service_type == '1') {
            that.service_type_dm.push('页面请求')
          } else if (that.formb.service_type == '2') {
            that.service_type_dm.push('页面数据请求')
          } else if (that.formb.service_type == '3') {
            that.service_type_dm.push('纯数据请求')
          }
          if (that.formb.apptype == '1') {
            that.apptype_dm = '远程服务'
          } else if (that.formb.apptype == '2') {
            that.apptype_dm = '应用服务'
          }
          this.getAppList()
        }
      }
    }
  },
  name: '',
  props: {
    isEdit: false,
    isEditdmb: {},
    isChide: {},
    isModify: false
  },
  data () {
    return {
      isClean: false,
      checkList: [],
      appList: [],
      appValue: '',
      appName: '',
      // a: false,
      // b: false,
      // c: false,
      // isDela: false,
      // isDelb: false,
      // isDelc: false,
      editState: false, // 给个表示是否进入编辑状态
      id: this.isChide,
      apptype_dm: '',
      stdat: '', // 服务id
      isEdit: this.$route.query.atomicId !== undefined, // 用于标签判断是否是新建服务
      type1Show: false,
      service_type_dm: [],
      rulesaShow: false,
      dialogTagVisible: false, // 选择标签 是否隐藏。
      metaData: {
        serviceTag: [], // 标签名称数组
        resourcetag: '' // 标签名称字符串
      }, // 包含标签名称数组的对象
      service_type: '',
      formb: {
        apptype: '1',
        service_type: '',
        type1: '',
        service_tag: '',
        app_id: ''
      },
      service_param_detail: [
        {
          url: '',
          request_type: 'POST'
        },
        {
          url: '',
          request_type: 'POST',
          chartset: '',
          input_body: '',
          request_port: '8080',
          output_body: '',
          service_param: [],
          service_out_param: []
        },
        {
          url: '',
          request_type: 'POST',
          input_body: '',
          request_port: '8080',
          output_body: '',
          service_param: [],
          service_out_param: []
        }
      ],
      rulesb: {
        service_type: [
          {
            type: 'array',
            validator: this.validateType,
            rulname: '页面类型，可多选',
            message: '请至少选择一个页面类型',
            trigger: 'change'
          }
        ],
        type1: [
          {
            validator: this.validateType1,
            rulname: '服务类别标识，可多选',
            message: '请至少选择一个服务类别标识'
          }
        ]
      }
    }
  },
  mounted () {
    this.getAppList()
  },
  methods: {
    getSelectApp () {
      console.log(this.appValue)
    },
    getAppList () {
      let vm = this
      let myData = {}
      apiClient.post('itsmApi/application/selectApps', myData, function (data) {
        vm.appList = [...data.results.data]
        data.results.data.forEach(function (v, k) {
          if (v.id === vm.appValue) {
            vm.appName = v.app_name
          }
        })
        console.log('应用列表', data.results.data)
      })
    },
    resetForm (formName) {
      if (this.isEditdmb.apptype == '' || this.isEditdmb.apptype == undefined) {
        this.formb.apptype = 1
        this.formb.service_type = []
        this.metaData.serviceTag = []
      } else {
        this.rulesaShow = true
        this.isEditdmb.isEditShow = true
        this.$emit('cancel', this.data)
      }
    },
    submint () {
      this.$emit('submint', true)
    },
    saveLabel () {
      this.metaData.resourcetag = this.service_tag.join(',')
      return true
    },
    showTags () {
      var that = this
      that.acti = 0
      that.dialogTagVisible = true
    },
    validateType (rule, value, callback) {
      var that = this
      if (value.length == 0) {
        that.rulesb.service_type[0].rulname =
          that.rulesb.service_type[0].message
        callback('最少选择一项')
      } else {
        callback()
      }
    },
    deleteTag (e) {
      var that = this
      that.formb.service_tag.splice(e, 1)
    },
    validateType1 (rule, value, callback) {
      var that = this
      if (that.formb.service_tag.length == 0) {
        that.rulesb.type1[0].rulname = that.rulesb.type1[0].message
        callback('最少选择一项')
      } else {
        callback()
      }
    },
    // cshoice () {
    //   if (!this.editState) {
    //     this.checkList = this.formb.service_type
    //     for (var i = 0; i < this.checkList.length; i++) {
    //       if (this.checkList[i] == '1') {
    //         this.a = true
    //       }
    //       if (this.checkList[i] == '2') {
    //         this.b = true
    //       }
    //       if (this.checkList[i] == '3') {
    //         this.c = true
    //       }
    //     }
    //     console.info(this.a + '----' + this.b + '----' + this.c)
    //   }
    // },
    // cshoicea (i) {
    //   if (!this.editState) {
    //     if (i == '1') {
    //       this.a = !this.a
    //     }
    //     if (i == '2') {
    //       this.b = !this.b
    //     }
    //     if (i == '3') {
    //       this.c = !this.c
    //     }
    //   }
    // },
    compare (value1, value2) {
      if (value1 < value2) {
        return -1
      } else if (value1 > value2) {
        return 1
      } else {
        return 0
      }
    },
    compareServiceType (oldType, newType) {
      if (typeof (oldType) !== 'undefined' && typeof (newType) !== 'undefined') {
        if (oldType.sort(this.compare).join(',') === newType.sort(this.compare).join(',')) {
          return false
        } else {
          return true
        }
      }
    },
    submitForm (formName) {
      var that = this
      this.$refs[formName].validate(valid => {
        if (that.formb.apptype == '1') {
          that.apptype_dm = '远程服务'
        } else if (that.formb.apptype == '2') {
          that.apptype_dm = '应用服务'
        }
        var serviceTypeArr = new Array()
        that.checkList = []
        that.checkList.push(that.formb.service_type)
        for (var i = 0; i < this.checkList.length; i++) {
          serviceTypeArr.push(parseInt(this.checkList[i]))
        }
        var myData = {
          operate_page: '2',
          id: this.id,
          service_tag: this.formb.service_tag,
          apptype: this.formb.apptype,
          app_id: this.appValue,
          service_type: serviceTypeArr,
          serviceTypeIsChange: 2
        }
        if (this.isEditdmb.service_type != undefined && this.isEditdmb.service_type.length != 0 && (this.isEditdmb.service_type.length != this.checkList.length) || this.compareServiceType(this.isEditdmb.service_type, this.checkList)) {
          myData.serviceTypeIsChange = 1
          this.isClean = true
        }
        console.log(myData)
        if (valid) {
          that.service_type_dm = []
          console.log(that.formb)
          that.formb.service_type = [...that.checkList]
          that.checkList.forEach(function (e, i) {
            if (e == '1') {
              that.service_type_dm.push('页面请求')
            } else if (e == '2') {
              that.service_type_dm.push('页面数据请求')
            } else if (e == '3') {
              that.service_type_dm.push('纯数据请求')
            }
          })
          // if (!that.editState) {
          //   for (var i = 0; i < this.checkList.length; i++) {
          //     if (this.checkList[i] == '1') {
          //       this.a = true
          //       this.isDela = false
          //     }
          //     if (this.checkList[i] == '2') {
          //       this.b = true
          //       this.isDelb = false
          //     }
          //     if (this.checkList[i] == '3') {
          //       this.c = true
          //       this.isDelc = false
          //     }
          //   }
          //   if (!this.a) {
          //     this.isDela = true
          //   }
          //   if (!this.b) {
          //     this.isDelb = true
          //   }
          //   if (!this.c) {
          //     this.isDelc = true
          //   }
          // }
          apiClient.post(
            'itsmApi/createService/updateAtomicInfo',
            myData,
            function (data) {
              that.rulesaShow = true
              let obj = {
                isEditShow: true,
                id: that.id,
                stdatype: that.checkList,
                apptype: that.formb.apptype,
                service_tag: that.formb.service_tag,
                app_id: that.appValue,
                isClean: that.isClean,
                isAppServer: false
              }
              if (that.appValue != '') {
                obj.isAppServer = true
              }
              that.$emit('submint', obj)
              // that.$emit('submint', obj, that.isDela, that.isDelb, that.isDelc)
            }
          )
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  },
  components: {
    LabelView
  }
}
</script>
<style src="../../css/createBasicService/newServiceCom.css" scoped></style>
<style>
.submintBtn {
  width: 120px;
  height: 60px;
  line-height: 60px;
  text-align: center;
  cursor: pointer;
  border: 1px solid #000000;
}
.notSend {
  display: none;
}
.is-error .txet-ts {
  color: red;
}
</style>
