<template>
	
	<div class="formaCon">
		<el-form ref="formpz" :model="service_param_detail[0]" :rules="rulesa" label-width="80px" class="formbox">
			<el-form-item label=" 请求类型：">
				<el-radio-group v-model="service_param_detail[0].request_type" v-show="!rulesaShow"> 
					<el-radio-button label="post" ></el-radio-button>
					<el-radio-button label="get"></el-radio-button>
				</el-radio-group>
				<el-col  v-show="rulesaShow">
					{{service_param_detail[0].request_type}}
				</el-col>
			</el-form-item>
			<el-form-item label="请求地址：" prop="url">
				<el-col  v-show="!rulesaShow"><el-input v-model="service_param_detail[0].url" ></el-input></el-col>
				<el-col class="txet-ts" v-show="!rulesaShow"><i class="xingroe">*</i>{{rulesa.url[0].rulurl}}</el-col>
				<el-col  v-show="rulesaShow">{{service_param_detail[0].url}}</el-col>
			</el-form-item>
			<el-form-item class="but-alin"  v-show="!rulesaShow">
				<el-button class="serviceBtn" type="primary" @click="submitForm('formpz')">保存</el-button>
				<el-button class="serviceBtn" @click="resetForm('formpz')">取消</el-button>
			</el-form-item>
		</el-form>
		
	</div>
	
</template>
<script>
import LabelView from '../../../publicComponent/labelView.vue'
import apiToken from '../../../publicJs/apiToken.js'
import apiClient from '../../../publicJs/ApiClient.js'
import TipBoxService from '../common/TipBoxService.js'
import LoadingBoxService from '../../../publicJs/LoadingBoxService.js'
export default {
  name: 'RcIndex',
  watch: {
    isChide: function (nv, ov) {
      if (nv) {
        this.id = nv
      }
    },
    isEdit: function (nv, ov) {
      if (nv) {
        if (this.isEditdmset[0].url != undefined && this.isEditdmset[0].url != '') {
          this.data = Object.assign({}, this.isEditdmset[0])
          this.service_param_detail[0] = this.isEditdmset[0]
          this.rulesaShow = nv // 是否编辑
        }
        this.service_param_detail[1] = this.isEditdmset[1]
        this.service_param_detail[2] = this.isEditdmset[2]
        console.info('页面请求hhhhhhhh', this.service_param_detail)
      } else {
        this.rulesaShow = this.isEditdmset.isEditShow // 是否编辑
      }
    },
    changeNo: function (nv, ov) {
      if (this.isEditdmset[0].url != undefined && this.isEditdmset[0].url != '') {
        this.service_param_detail[0] = this.isEditdmset[0]
      }
      this.service_param_detail[1] = this.isEditdmset[1]
      this.service_param_detail[2] = this.isEditdmset[2]
    },
    delA: function (nv, ov) {
      if (nv) {
        console.log('cccccccccc')
      }
    },
    isClean: function (nv, ov) {
      this.service_param_detail[0].url = ''
      this.service_param_detail[0].request_type = 'post'
      this.rulesaShow = false // 是否编辑
    },
    isAppServer: function (nv, ov) {
      if (nv > 0) {
        this.appServer = true
      }
    }
  },
  props: {
    isEdit: false,
    isEditdmset: {},
    isChide: {},
    delA: {},
    changeNo: 0,
    isClean: 0,
    isAppServer: 0
  },
  data () {
    return {
      n: 1,
      data: {},
      appServer: false,
      dialogTagVisible: false,
      pnLdome: false,
      rulesaShow: false,
      isEdit: this.$route.query.atomicId !== undefined,
      id: this.isChide,
      service_param_detail: [
        {
          url: '',
          request_type: 'post',
          request_port: '8080'
        },
        {
          url: '',
          request_type: 'post',
          chartset: '',
          input_body: '',
          request_port: '8080',
          output_body: '',
          service_param: [],
          service_out_param: []
        },
        {
          url: '',
          request_type: 'post',
          input_body: '',
          request_port: '8080',
          output_body: '',
          service_param: [],
          service_out_param: []
        }
      ],

      rulesa: {
        url: [
          {
            validator: this.validateUrl,
            rulurl: '请输入请求地址',
            rulurlF: '请输入请求地址',
            rulurlT: '请求地址格式不正确'
          }
        ]
      }
    }
  },
  mounted () {},
  methods: {
    resetForm (formName) {
      if (this.isEditdmset[0] != undefined) {
        if (this.isEditdmset[0].url != undefined && this.isEditdmset[0].url != '') {
          this.rulesaShow = true
          this.isEditdmset.isEditShow = true
          this.service_param_detail[0] = this.data
          this.$emit('cancel', this.service_param_detail, this.isEditdmset.isEditShow)
        }
      } else {
        this.service_param_detail[0].request_type = 'post'
        this.service_param_detail[0].url = ''
      }
    },
    validateUrl (rule, value, callback) {
      var that = this
      if (value === '') {
        that.rulesa.url[0].rulurl = that.rulesa.url[0].rulurlF
        callback('请输入URL')
      } else {
        if (!that.urlValidate(value) && !that.appServer) {
          that.rulesa.url[0].rulurl = that.rulesa.url[0].rulurlT
          callback('请求地址有误')
        } else {
          that.rulesa.url[0].rulurl = that.rulesa.url[0].rulurlF
          return callback()
        }
      }
    },
    saveLabel () {
      this.service_tag = this.metaDatafx.serviceTag
      this.metaDatafx.resourcetag = this.service_tag.join(',')
      console.info('this.service_tag', this.service_tag)
      return true
    },
    // 添加
    addPnl () {
      var that = this
      that.pnLdome = true
    },
    showTagsfx () {
      var that = this
      that.dialogTagVisible = true
      that.acti = 1
    },
    submitForm (formName) {
      var that = this
      this.$refs[formName].validate(valid => {
        // var serviceObj={
        // 		request_type:that.formpz.request_type,
        // 		url:that.formpz.url,// "原子服务的请求路径 端口以后的ulr部分 ",
        // }
        var myData = {
          id: that.id,
          operate_page: '4',
          service_param_detail: that.service_param_detail
        }
        console.info('wwwewewe', myData)
        if (valid) {
          apiClient.post(
            'itsmApi/createService/updateAtomicInfo',
            myData,
            function (data) {
              that.rulesaShow = true
              let obj = {
                isEditShow: true,
                spdetail: that.service_param_detail,
                isSubmit: true
              }
              that.$emit('submint', obj)
            }
          )
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    urlValidate (value) {
      const urlReg = /^(http(s)?:\/\/)?(www\.)?[\w-]+\.\w{2,4}(\/)?$/ // 允许英文，中文和英文不能同时出现，1-20位
      var re_weburl = new RegExp(
        '^' +
          // protocol identifier
          '(?:(?:https?|ftp)://)' +
          // user:pass authentication
          '(?:\\S+(?::\\S*)?@)?' +
          '(?:' +
          // IP address dotted notation octets
          // excludes loopback network 0.0.0.0
          // excludes reserved space >= 224.0.0.0
          // excludes network & broacast addresses
          // (first & last IP address of each class)
          '(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])' +
          '(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}' +
          '(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))' +
          '|' +
          // host name
          '(?:(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)' +
          // domain name
          '(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*' +
          // TLD identifier
          '(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))' +
          ')' +
          // port number
          '(?::\\d{2,5})?' +
          // resource path
          '(?:/\\S*)?',
        'i'
      )
      if (!value) {
        return false
      } else {
        if (!re_weburl.test(value)) {
          return false
        } else {
          return true
        }
      }
    }
  },
  components: {
    LabelView
  }
}
</script>
<style src="../../css/common/public.css" scoped></style>
<style src="../../css/createBasicService/newServiceCom.css" scoped></style>
<style>
.newService .el-dialog__body {
  min-height: 430px;
  padding-top: 20px;
}
.newService .el-dialog__header {
  background-color: #fff;
  padding: 0;
  padding-bottom: 15px;
  border-bottom: 1px solid #eeeeee;
}
.newService .el-dialog__header .el-dialog__title {
  color: #1f2d3d !important;
}
.newService .el-dialog__headerbtn .el-dialog__close {
  color: #bfcbd9 !important;
}
.newService .el-dialog.el-dialog--small {
  padding: 20px 20px 0 20px;
}
</style>
