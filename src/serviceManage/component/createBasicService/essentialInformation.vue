<template>
    <div class="formaCon showBlck" :class="{formboxru:rulesaShow}">
     <el-form ref="forma" :model="forma" status-icon :rules="rulesa" label-width="120px" class="formbox">
			<el-form-item label="服务名称：" class="form-tr" prop="name" >
				<el-col v-show="!rulesaShow">
					<el-col>
						<el-input :maxlength="15" placeholder="请输入服务名称（最多15个字）" v-model.trim="forma.name" :disabled="isModify"></el-input>
					</el-col>
				<el-col class="txet-ts"><i class="xingroe">*</i>{{rulesa.name[0].rulname}}</el-col>
				</el-col>
				<el-col v-show="rulesaShow" class="stylefont">
					{{forma.name}}
				</el-col>
			</el-form-item>
			 <el-form-item label="服务期限：" class="form-tr">
				 <el-col v-show="rulesaShow" class="stylefont">
					 <el-col >
						{{forma.startTime}}至{{forma.endTime}}
					 </el-col>
				 </el-col>
				<el-col v-show="!rulesaShow">
				<el-col :span="11">
					<el-form-item prop="startTime">
						<el-date-picker
							v-model="forma.startTime"                    
							type="date"
							format="yyyy-MM-dd"
							placeholder="开始日期"
							:picker-options="pickerOptions0"
							@change="changeStartDate"
              :disabled="isModify"
							>
						</el-date-picker>
					</el-form-item>	
				</el-col>
				<el-col class="line" :span="2">----</el-col>
				<el-col class="txet-ts" :class="{clode:clode}"><i class="xingroe">*</i>{{rulesa.startTime[0].rulname}}</el-col>
				<el-col :span="11">
					<el-form-item prop="endTime">
					<el-date-picker
						v-model="forma.endTime"
						format="yyyy-MM-dd"                      
						type="date"
						placeholder="结束日期"
						:picker-options="pickerOptions1"
						@change="changeEndDate"
						>
					</el-date-picker>
					</el-form-item>
				</el-col>
				</el-col>
		</el-form-item>
		<el-form-item label="服务简介：" class="form-tr bomac" prop="brief">
			<el-col v-show="rulesaShow" class="stylefont">
				{{forma.brief}}
			</el-col>
			<el-col v-show="!rulesaShow">
			<el-input placeholder="简单文字介绍（50字以内）" type="textarea" :rows="3" v-model.trim="forma.brief"  :maxlength="50"></el-input>
			<el-col :span="24" class="tatl-texe">
				 <span class="color-red">{{forma.brief.length}}/50</span>  您还可以输入 <span class="color-red">{{50-forma.brief.length}}</span> 个字
			</el-col>
			</el-col>
			<el-col v-show="!rulesaShow" class="txet-ts" :class="{clode:clode}"><i class="xingroe">*</i>{{rulesa.brief[0].rulname}}</el-col>
		</el-form-item>
		<el-form-item st label="服务介绍：" class="form-tr bomac" prop="service_remark">
			<el-col v-show="rulesaShow" class="stylefont">
				{{forma.service_remark}}
			</el-col>
			<el-col v-show="!rulesaShow">
			<el-input placeholder="请详细介绍您要注册的服务(200字以内)"  type="textarea" :rows="4" v-model.trim="forma.service_remark"  :maxlength="200"></el-input>
			<el-col :span="24" class="tatl-texe">
				 <span class="color-red">{{forma.service_remark.length}}/ 200</span> 您还可以输入 <span class="color-red">{{200-forma.service_remark.length}}</span> 个字
			</el-col>
			</el-col>
			<el-col v-show="!rulesaShow" class="txet-ts" :class="{clode:clode}"><i class="xingroe">*</i>{{rulesa.service_remark[0].rulname}}</el-col>
		</el-form-item>
		<el-form-item class="but-alin" v-show="!rulesaShow">
			<el-button class="serviceBtn" type="primary" @click="submitForm('forma')">保存</el-button>
			<el-button class="serviceBtn" @click="resetForm('forma')">取消</el-button>
		</el-form-item>
		</el-form>
    
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
    isEdit: function (nv, ov) {
      this.rulesaShow = nv // 是否编辑
      if (nv) {
        console.log('shasdasqq', this.isEditdm)
        if (this.isEditdm.name != undefined && this.isEditdm.name != '') {
          this.forma = this.isEditdm
          this.data = Object.assign({}, this.isEditdm)
          console.log('asdsdsadsad', this.isEditdm)
          this.inputData = Object.assign({}, this.isEditdm)
        }
      }
    },
    isChide: function (nv, ov) {
      console.info('id', nv)
      this.id = nv
    }
  },
  name: '',
  props: {
    isEdit: false,
    isEditdm: {},
    isChide: {},
    isModify: false
  },
  data () {
    var that = this
    return {
      data: {},
      stdat: '', // 编辑状态
      rulesaShow: false,
      id: this.isChide,
      isDisabel: false,
      clode: false,
      clode1: false,
      inputData: {
        name: '', // 服务名称
        startTime: '', // 开始时间
        endTime: '', // 结束时间
        brief: '', // 服务简介
        service_remark: '', // 服务介绍
        changeId: ''
      },
      forma: {
        name: '', // 服务名称
        startTime: '', // 开始时间
        endTime: '', // 结束时间
        brief: '', // 服务简介
        service_remark: '', // 服务介绍
        changeId: ''
      },

      rulesa: {
        name: [
          {
            validator: this.validateName,
            rulname: '服务的唯一标识，审核后将不可更改',
            rulnameT: '服务的唯一标识，审核后将不可更改',
            rulnameF: '请输入服务名称',
            rulnameN: '服务名字重复，请重新输入'
          }
        ],
        startTime: [
          {
            validator: this.validateStartTime,
            type: 'date',
            rulname: '用户仅在设定的期限内对外提供服务',
            rulnameT: '用户仅在设定的期限内对外提供服务',
            rulnameF: '日期不能为空'
          }
        ],
        endTime: [
          {
            validator: this.validateEndTime,
            type: 'date',
            rulname: '用户仅在设定的期限内对外提供服务',
            rulnameT: '用户仅在设定的期限内对外提供服务',
            rulnameF: '日期不能为空'
          }
        ],
        brief: [
          {
            validator: this.validateBrief,
            rulname: '应用市场服务宣传展示素材',
            rulnameT: '应用市场服务宣传展示素材',
            rulnameF: '请输入应用市场服务宣传'
          }
        ],
        service_remark: [
          {
            validator: this.validateIntroduce,
            rulname: '应用市场服务详情展示素材',
            rulnameT: '应用市场服务详情展示素材',
            rulnameF: '请输入应用市场服务详情展示'
          }
        ]
      },
      pickerOptions0: {
        disabledDate (time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      },
      pickerOptions1: {
        disabledDate (time) {
          if (that.isModify) {
            return (
            time.getTime() < new Date(that.isEditdm.endTime).getTime() ||
            time.getTime() > new Date(that.forma.startTime).getTime() + 3600 * 1000 * 24 * 365 * 3
            )
          } else {
            return (time.getTime() < Date.now() ||
            time.getTime() < new Date(that.forma.startTime).getTime() ||
            time.getTime() > new Date(that.forma.startTime).getTime() + 3600 * 1000 * 24 * 365 * 3)
          }
        }
      }
    }
  },
  mounted () {},
  methods: {
    // 保存
    submitForm (formName) {
      var that = this
      this.$refs[formName].validate(valid => {
        // 基础服务
        var myData = {
          operate_page: '1',
          apptype: '1',
          name: this.forma.name, // "服务名称", analyzer
          service_start_time: this.forma.startTime, // 开通时间
          service_end_time: this.forma.endTime, // 结束时间
          service_brief: this.forma.brief, // 服务简介
          service_remark: this.forma.service_remark // "服务状态",
        }
        if (valid) {
          if (that.id == '' || that.id == undefined) {
            apiClient.post('itsmApi/createService/insertAtomicInfo', myData, function (data) {
              console.info('保存基础服务', data)
              that.id = data.results.atomicId
              that.$router.push({
                name: 'newService',
                query: { id: that.id }
              })
              if (data.status == '200') {
                that.rulesaShow = true
                let obj = {
                  isEditShow: true, // 为了监控
                  id: data.results.atomicId,
                  stdatRigTap: true,
                  item: that.forma
                }
                that.$emit('submint', obj)
              }
            }
            )
          } else {
            var myData = {
              operate_page: '1',
              id: that.id,
              name: that.forma.name, // 服务名称
              service_start_time: that.forma.startTime, // 开始时间
              service_end_time: that.forma.endTime, // 结束时间
              service_brief: that.forma.brief, // 服务简介
              service_remark: that.forma.service_remark // 服务介绍
            }
            if (that.forma.changeId != undefined && that.forma.changeId != '') {
              myData.change_id = that.forma.changeId
            }
            apiClient.post('itsmApi/createService/updateAtomicInfo', myData, function (data) {
              console.info('基础服务修改', myData)
              if (data.status == '200') {
                that.rulesaShow = true
                let obj = {
                  isEditShow: true,
                  id: that.id,
                  isSubmit: true,
                  item: that.forma
                }
                that.$emit('submint', obj)
              }
            }
            )
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm (formName) {
      if (this.id == '' || this.id == undefined) {
        this.$refs[formName].resetFields()
      } else {
        this.rulesaShow = true
        this.isEditdm.isEditShow = true
        this.$emit('cancel', this.data, this.isEditdm.isEditShow)
      }
    },

    changeStartDate (val) {
      var that = this
      var a = Object.assign({}, that.forma)
      a.startTime = val
      that.forma = Object.assign({}, a)
      // that.forma.startTime = val
      console.info('时间', val)
    },
    changeEndDate (val) {
      var that = this
      var a = Object.assign({}, that.forma)
      a.endTime = val
      that.forma = Object.assign({}, a)
      // that.forma.endTime = val
      console.info('时间', val)
    },
    submint () {},
    //* ******* 基本信息验证//
    validateName (rule, value, callback) {
      var that = this
      if (!this.isDisabel) {
        if (value === '') {
          that.rulesa.name[0].rulname = that.rulesa.name[0].rulnameF
          callback('请输入')
        } else {
          var myData = {
            id: that.id,
            name: value
          }
          that.rulesa.name[0].rulname = that.rulesa.name[0].rulnameT
          if ((that.stdat == '' || that.stdat == undefined) && (that.isEditdm.changeId == undefined || that.isEditdm.changeId == '')) {
            apiClient.post(
              'itsmApi/atomicService/validateName',
              myData,
              function (data) {
                if (data.status == '503') {
                  callback('名字重复')
                  that.rulesa.name[0].rulname = that.rulesa.name[0].rulnameN
                } else {
                  return callback()
                }
              }
            )
          } else {
            return callback()
          }
        }
      } else {
        return callback()
      }
    },
    formatDuring (time, format) {
      var t = new Date(time)
      var tf = function (i) {
        return (i < 10 ? '0' : '') + i
      }
      return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function (a) {
        switch (a) {
        case 'yyyy':
          return tf(t.getFullYear())
          break
        case 'MM':
          return tf(t.getMonth() + 1)
          break
        case 'mm':
          return tf(t.getMinutes())
          break
        case 'dd':
          return tf(t.getDate())
          break
        case 'HH':
          return tf(t.getHours())
          break
        case 'ss':
          return tf(t.getSeconds())
          break
        }
      })
    },
    validateStartTime (rule, value, callback) {
      if (value == '') {
        this.clode = true
        this.rulesa.startTime[0].rulname = this.rulesa.startTime[0].rulnameF
        callback('请输入')
      } else {
        if (this.forma.endTime == '') {
          this.rulesa.startTime[0].rulname = this.rulesa.startTime[0].rulnameF
        } else {
          if (this.forma.entTime == '') {
            this.rulesa.startTime[0].rulname = this.rulesa.startTime[0].rulnameF
          } else {
            this.clode = false
            this.rulesa.startTime[0].rulname = this.rulesa.startTime[0].rulnameT
            callback()
          }
        }
      }
    },
    validateEndTime (rule, value, callback) {
      if (value == '') {
        this.clode = true

        this.rulesa.startTime[0].rulname = this.rulesa.startTime[0].rulnameF
        callback('请输入')
      } else {
        if (this.forma.startTime == '') {
          this.rulesa.startTime[0].rulname = this.rulesa.startTime[0].rulnameF
        } else {
          this.clode = false
          this.rulesa.startTime[0].rulname = this.rulesa.startTime[0].rulnameT
          callback()
        }
      }
    },
    validateBrief (rule, value, callback) {
      if (value == '' || value == undefined || value.length == 0) {
        this.rulesa.brief[0].rulname = this.rulesa.brief[0].rulnameF
        callback('请输入')
      } else {
        this.rulesa.brief[0].rulname = this.rulesa.brief[0].rulnameT
        return callback()
      }
    },
    validateIntroduce (rule, value, callback) {
      if (value == '' || value == undefined || value.length == 0) {
        this.rulesa.service_remark[0].rulname = this.rulesa.service_remark[0].rulnameF
        callback('请输入')
      } else {
        this.rulesa.service_remark[0].rulname = this.rulesa.service_remark[0].rulnameT
        return callback()
      }
    }
    // 基本信息验证*********//
  }
}
</script>
<style src="../../css/createBasicService/newServiceCom.css" scoped></style>
<style>
.clode {
  color: red;
}
.is-error .txet-ts {
  color: red;
}
.formboxru .form-tr::after {
  content: "";
}
</style>
