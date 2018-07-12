<template>
	
		<div class="formaCon">
			<el-form  ref="formpz" :model="service_param_detail[2]" class="rulseStyle" :rules="rulesb" label-width="80px">
				<el-form-item label=" 请求类型：">
					<el-radio-group v-model="service_param_detail[2].request_type" v-show="!rulesaShow" @change="changeRequestType()"> 
						<el-radio-button label="post" ></el-radio-button>
						<el-radio-button label="get"></el-radio-button>
					</el-radio-group>
					<el-col v-show="rulesaShow">
						{{service_param_detail[2].request_type}}
					</el-col>
				</el-form-item>
				<!-- 参数设置： -->
				<el-form-item label=" 参数设置：">
					<el-row  v-show="!rulesaShow">
						<div class="add-palanad" v-for="(tm,index) in service_param_detail[2].service_param">
							<span class="daleLi" @click="daleLi(index)"><i class="icon iconfont icon-weibiaoti101"></i></span>
							<div class="dalchet" :class="{abncss:cssHag}">
								<p>名称：<em>{{tm.name}}</em></p>
								<p>序号：<em>{{index+1}}</em></p>
								<p>类型：<em v-if="tm.param_type == 1">字符型</em><em v-if="tm.param_type == 2">数值型</em><em v-if="tm.param_type == 3">长文本型</em>
                </p>
								<p :title="tm.tag">标签：<em v-for="listbq in tm.tag">{{listbq}}<i>,</i></em></p>
								<p>描述：<em>{{tm.describe}}</em></p>
							</div>
							<div class="movead" @click="moveadCss()"></div>
						</div>
						<div class="add-palan" @click="addPnl('pezi')"></div>
					</el-row>
					<el-row  v-show="rulesaShow">
						<div class="add-palanad" v-for="(tm,index) in service_param_detail[2].service_param">
							<div class="dalchet" :class="{abncss:cssHag}">
								<p>名称：<em>{{tm.name}}</em></p>
								<p>序号：<em>{{index+1}}</em></p>
								<p>类型：<em v-if="tm.param_type == 1">字符型</em><em v-if="tm.param_type == 2">数值型</em><em v-if="tm.param_type == 3">长文本型</em>
                </p>
								<p :title="tm.tag">标签：<em v-for="listbq in tm.tag">{{listbq}}<i>,</i></em></p>
								<p>描述：<em>{{tm.describe}}</em></p>
							</div>
							<div class="movead" @click="moveadCss()"></div>
						</div>
					</el-row>
					<el-row>
						<div class="forpz" v-show="pnLdome">
							<el-form ref="pezi" :rules="rulesa" class="forpz-con rulseStyle" :model="pezi" label-width="80px">
								<el-form-item label="参数名称：" prop="name">
									<el-input v-model="pezi.name"></el-input>
								</el-form-item>
								<el-form-item label="序号：">
									<el-input v-model="service_param_detail[2].service_param.length+1" disabled="disabled"></el-input>
								</el-form-item>
								<el-form-item label=" 是否必填：">
									<el-radio-group v-model="pezi.isRequired"> 
										<el-radio-button label="是" ></el-radio-button>
										<el-radio-button label="否"></el-radio-button>
									</el-radio-group>
								</el-form-item>
								<el-form-item label="参数类型：">
									<el-radio-group v-model="pezi.param_type" > 
										<el-radio-button label="字符型"></el-radio-button>
										<el-radio-button label="数值型"></el-radio-button>
										<el-radio-button label="长文本型"></el-radio-button>
									</el-radio-group>
								</el-form-item>
								<el-form-item label="服务标签：" prop="service_tag">
									<span  @click="showTagsfx" class="tagArea but-style">添加</span>
									<span class="tagart but-style" v-for="(tag,index) in pezi.service_tag" :key="index">
										<span class="tagstyle" :title="tag">{{tag}}</span>
										<i @click="deleteTag(index)" class="icon iconfont icon-delete-black"></i>
									</span>
								</el-form-item>
								<el-form-item label="参数描述：" prop="describe">
									<el-input v-model="pezi.describe" placeholder="字段描述（10字以内）" :maxlength="10"></el-input>
									<el-col :span="24" class="tatl-texe">
										<span class="color-red">{{pezi.describe.length}}/10</span> 您还可以输入 <span class="color-red">{{10-pezi.describe.length}}</span> 个字
									</el-col>
								</el-form-item>
								<el-form-item class="but-alin">
									<el-button class="serviceBtn" type="primary" @click="addpalanList('pezi')">保存</el-button>
									<el-button class="serviceBtn" @click="resetForm('pezi')">取消</el-button>
								</el-form-item>
							</el-form>
						</div>
					</el-row>
				</el-form-item>
				<el-form-item label="请求地址：" prop="url">
					<el-col  v-show="!rulesaShow"><el-input v-model="service_param_detail[2].url" ></el-input></el-col>
					<el-col  v-show="rulesaShow" style="word-wrap: break-word;">{{service_param_detail[2].url}}</el-col>
				</el-form-item>
				<el-form-item label="请求体：" v-show="service_param_detail[2].request_type == 'post'" prop="input_body">
					<el-col  v-show="!rulesaShow"><el-input spellcheck="false" type="textarea" v-model="service_param_detail[2].input_body"></el-input></el-col>
					<el-col  v-show="rulesaShow">{{service_param_detail[2].input_body}}</el-col>
				</el-form-item>
				<!-- 输出参数： -->
				<el-form-item label="输出参数：">
					<el-row  v-show="!rulesaShow">
						<div class="add-palanad" v-for="(tm,index) in service_param_detail[2].service_out_param">
							<span class="daleLi" @click="daleLi1(index)"><i class="icon iconfont icon-weibiaoti101"></i></span>
							<div class="dalchet" :class="{abncss:cssHag}">
								<p>名称：<em>{{tm.name}}</em></p>
								<p>序号：<em>{{index+1}}</em></p>
								<p>类型：<em v-if="tm.param_type == 1">字符型</em><em v-if="tm.param_type == 2">数值型</em><em v-if="tm.param_type == 3">长文本型</em>
                </p>
								<p :title="tm.tag">标签：<em v-for="listbq in tm.tag">{{listbq}}<i>,</i></em></p>
								<p>描述：<em>{{tm.describe}}</em></p>
							</div>
							<div class="movead" @click="moveadCss()"></div>
						</div>
						<div class="add-palan" @click="addPnl('pezib')"></div>
					</el-row>
					<el-row v-show="rulesaShow">
						<div class="add-palanad" v-for="(tm,index) in service_param_detail[2].service_out_param">
							<div class="dalchet" :class="{abncss:cssHag}">
								<p>名称：<em>{{tm.name}}</em></p>
								<p>序号：<em>{{index+1}}</em></p>
								<p>类型：<em v-if="tm.param_type == 1">字符型</em><em v-if="tm.param_type == 2">数值型</em><em v-if="tm.param_type == 3">长文本型</em>
                </p>
								<p :title="tm.tag">标签：<em v-for="listbq in tm.tag">{{listbq}}<i>,</i></em></p>
								<p>描述：<em>{{tm.describe}}</em></p>
							</div>
							<div class="movead" @click="moveadCss()"></div>
						</div>
					</el-row>
					<el-row>
						<div class="forpz" v-show="pnLdomeb">
							<el-form ref="pezib" :rules="rulesc" class="forpz-con rulseStyle" :model="pezib" label-width="80px">
								<el-form-item label="参数名称" prop="name">
									<el-input v-model="pezib.name"></el-input>
								</el-form-item>
								<el-form-item label="序号：">
									<el-input v-model="service_param_detail[2].service_out_param.length+1" disabled="disabled"></el-input>
								</el-form-item>
								<el-form-item label="参数类型：">
									<el-radio-group v-model="pezib.param_type" > 
										<el-radio-button label="字符型"></el-radio-button>
										<el-radio-button label="数值型"></el-radio-button>
										<el-radio-button label="长文本型"></el-radio-button>
									</el-radio-group>
								</el-form-item>
								<el-form-item label="服务标签：" prop="service_tag">
									<span  @click="showTagsfx" class="tagArea but-style">添加</span>
									<span class="tagart but-style" v-for="(tag,index) in pezib.service_tag" :key="index">
										<span class="tagstyle" :title="tag">{{tag}}</span>
										<i @click="deleteTag(index)" class="icon iconfont icon-delete-black"></i>
									</span>
								</el-form-item>
								<el-form-item label="参数描述：" prop="describe">
									<el-input v-model="pezib.describe" placeholder="字段描述（10字以内）" :maxlength="10"></el-input>
									<el-col :span="24" class="tatl-texe">
										<span class="color-red">{{pezib.describe.length}}/10</span> 您还可以输入 <span class="color-red">{{10-pezib.describe.length}}</span> 个字
									</el-col>
								</el-form-item>
								<el-form-item class="but-alin">
									<el-button class="serviceBtn" type="primary" @click="addpalanList('pezib')">保存</el-button>
									<el-button class="serviceBtn" @click="resetForm('pezib')">取消</el-button>
								</el-form-item>
							</el-form>
						</div>
					</el-row>
				</el-form-item>
				<el-form-item label="输出格式：" prop="output_body">
					<el-col  v-show="!rulesaShow"><el-input spellcheck="false" type="textarea" v-model="service_param_detail[2].output_body"></el-input></el-col>
					<el-col  v-show="rulesaShow">{{service_param_detail[2].output_body}}</el-col>
				</el-form-item>
				<el-form-item class="but-alin"  v-show="!rulesaShow">
					<el-button class="serviceBtn" type="primary" @click="submitForm('formpz')">保存</el-button>
					<el-button class="serviceBtn" @click="resetForm('formpz')">取消</el-button>
				</el-form-item>
			</el-form>
			 <LabelView :maxTag="10" :dialogTagVisible.sync="dialogTagVisible" :isCreateModel="!isEdit" :model="metaDatafx" modelLabelKey="serviceTag" :changeLabelCaller="saveLabel" />
		</div>
	
</template>
<script>
import LabelView from '../../../publicComponent/labelView.vue'
import apiToken from '../../../publicJs/apiToken.js'
import apiClient from '../../../publicJs/ApiClient.js'
import TipBoxService from '../common/TipBoxService.js'
import LoadingBoxService from '../../../publicJs/LoadingBoxService.js'
import JSONLint from '../../lib/jsonlint.js'
export default {
  name: 'RcIndex',
  watch: {
    'metaDatafx.serviceTag' (value) {
      this.service_tag = value
      this.pezi.service_tag = value
      this.pezib.service_tag = value
      console.info('aaa', value)
      this.metaDatafx.serviceTag = value
    },
    service_tag (value) {
      console.info('ssss', value)
      this.metaDatafx.serviceTag = value
    },
    isChide: function (nv, ov) {
      if (nv) {
        this.id = nv
      }
    },
    delC: function (nv, ov) {
      if (nv) {
        console.log('cccccccccccccc')
      }
    },
    isEdit: function (nv, ov) {
      if (nv) {
        if (this.isEditdmdata[2].url != '') {
          this.rulesaShow = nv // 是否编辑
          this.service_param_detail[2] = this.isEditdmdata[2]
          this.data = Object.assign({}, this.isEditdmdata[2])
        }
        this.service_param_detail[0] = this.isEditdmdata[0]
        this.service_param_detail[1] = this.isEditdmdata[1]
        console.info('纯数据请求2', this.service_param_detail)
      } else {
        this.rulesaShow = this.isEditdmdata.isEditShow // 是否编辑
      }
    },
    changeNo: function (nv, ov) {
      if (this.isEditdmdata[2].url != '') {
        this.service_param_detail[2] = this.isEditdmdata[2]
      }
      this.service_param_detail[0] = this.isEditdmdata[0]
      this.service_param_detail[1] = this.isEditdmdata[1]
      console.info('纯数据请求2', this.service_param_detail)
    },
    isClean: function (nv, ov) {
      this.rulesaShow = false // 是否编辑
      this.service_param_detail[2].request_type = 'post'
      this.service_param_detail[2].url = ''
      this.service_param_detail[2].charset = 'UTF-8'
      this.service_param_detail[2].input_body = ''
      this.service_param_detail[2].request_port = '8080'
      this.service_param_detail[2].output_body = ''
      this.service_param_detail[2].service_param = []
      this.service_param_detail[2].service_out_param = []
    },
    isAppServer: function (nv, ov) {
      if (nv > 0) {
        this.appServer = true
      }
    }
  },
  props: {
    isEdit: false,
    isEditdmdata: {},
    isChide: {},
    delC: {},
    changeNo: 0,
    isClean: 0,
    isAppServer: 0
  },
  data () {
    return {
      n: 1,
      data: {},
      cssHag: false,
      appServer: false,
      dialogTagVisible: false,
      pnLdome: false,
      pnLdomeb: false,
      id: this.isChide,
      rulesaShow: false,
      isEdit: this.$route.query.atomicId !== undefined,
      outPutArr: [],
      pezi: {
        name: '', // "参数名称",
        order: 0, // "序号",
        param_type: '字符型', // "参数类型",
        isRequired: '是',
        service_tag: [], // "参数标签",
        describe: '', // "参数描述"
        newParam_type: ''// 参数类型转换成数字
      },
      pezib: {
        name: '', // "参数名称",
        order: 0, // "序号",
        param_type: '字符型', // "参数类型",
        service_tag: '', // "参数标签",
        describe: '', // "参数描述"
        newParam_type: ''// 参数类型转换成数字
      },
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
      metaDatafx: {
        serviceTag: [], // 标签名称数组
        resourcetag: '' // 标签名称字符串
      }, // 包含标签名称数组的对象
      formpz: {
        request_type: 'post', // 请求类型
        charset: '默认', // 字符集
        url: '',
        input_body: '',
        service_param: []
      },
      rulesa: {
        name: [
          {
            validator: this.validateName,
            rulname: '请输入参数名称',
            rulnameT: '参数名已存在请重新输入',
            rulnameF: '请输入参数名称'
          }
        ],
        describe: [
          {
            validator: this.validateDescribe,
            rulnDescribe: '请输入字段描述',
            rulnDescribeT: '请输入字段描述'
          }
        ],
        service_tag: [
          {
            validator: this.validateInputBodyTag,
            rulnServiceTag: '请选择标签',
            rulnServiceTagT: '请选择标签'
          }
        ]
      },
      rulesb: {
        input_body: [
          {
            validator: this.validateInputBody,
            rulname: '请输入请求体',
            rulnameE: '请求体格式有误，请重新输入',
            rulnameT: '请求体不支持数组格式',
            rulnameF: '请求体中存在重复参数',
            rulnameN: '请求体中存在重复名称',
            rulnameH: '请求体和路径中存在重复参数',
            rulnameZ: '请输入请求体',
            rulnameM: '请输入完整请求体'
          }
        ],
        output_body: [
          {
            validator: this.validateOutputBody,
            rulname: '请输入输出参数',
            rulnameE: '输出参数格式有误，请重新输入',
            rulnameT: '输出参数不支持数组格式',
            rulnameF: '输出参数中存在重复参数',
            rulnameN: '输出参数中存在重复名称',
            rulnameH: '输出参数和路径中存在重复参数',
            rulnameZ: '请输入输出参数',
            rulnameM: '请输入完整输出参数'
          }
        ],
        url: [
          {
            validator: this.validateUrl,
            rulurl: '请输入请求地址',
            rulurlF: '请输入请求地址',
            rulurlT: '请求地址格式不正确',
            rulurlL: '请求路径中存在重复参数',
            rulurlM: '请求路径参数和配置参数不一致'
          }
        ]
      },
      rulesc: {
        name: [
          {
            validator: this.validateName,
            rulname: '请输入参数名称',
            rulnameT: '参数名已存在请重新输入',
            rulnameF: '请输入参数名称'
          }
        ],
        describe: [
          {
            validator: this.validateDescribe,
            rulnDescribe: '请输入字段描述',
            rulnDescribeT: '请输入字段描述'
          }
        ],
        service_tag: [
          {
            validator: this.validateOutPutBodyTag,
            rulnServiceTag: '请选择标签',
            rulnServiceTagT: '请选择标签'
          }
        ]
      }
    }
  },
  mounted () {},
  methods: {
    daleLi (i) {
      var that = this
      that.service_param_detail[2].service_param.splice(i, 1)
      console.info(
        'that.formpz.service_param',
        that.service_param_detail[2].service_param
      )
    },
    daleLi1 (i) {
      var that = this
      that.service_param_detail[2].service_out_param.splice(i, 1)
      console.info(
        'that.formpz.service_param',
        that.service_param_detail[2].service_out_param
      )
    },
    changeRequestType () {
      if (this.service_param_detail[2].request_type === 'get') {
        this.service_param_detail[2].input_body = ''
      }
    },
    resetForm (formName) {
      if (formName == 'formpz' && this.isEditdmdata[2] != undefined && this.isEditdmdata[2].url != '') {
        this.rulesaShow = true
        this.isEditdmdata.isEditShow = true
        this.service_param_detail[2] = this.data
        this.$emit('cancel', this.service_param_detail, this.isEditdmdata.isEditShow)
      } else {
        if (formName == 'pezi') {
          this.pnLdome = false
          this.pezi.name = ''
          this.pezi.param_type = '字符型'
          this.metaDatafx.serviceTag = []
          this.pezi.describe = ''
        } else if (formName == 'pezib') {
          this.pnLdomeb = false
          this.pezib.name = ''
          this.pezib.param_type = '字符型'
          this.metaDatafx.serviceTag = []
          this.pezib.describe = ''
        } else {
          this.service_param_detail[2].url = ''
          this.service_param_detail[2].input_body = ''
          this.service_param_detail[2].output_body = ''// bug修改
          this.service_param_detail[2].request_type = 'post'
          this.service_param_detail[2].charset = 'UTF-8'
          this.service_param_detail[2].service_param = []
          this.service_param_detail[2].service_out_param = []
        }
      }
    },
    saveLabel () {
      this.service_tag = this.metaDatafx.serviceTag
      this.metaDatafx.resourcetag = this.service_tag.join(',')
      console.info('this.service_tag', this.service_tag)
      return true
    },
    addpalanList (formName) {
      if (formName == 'pezi') {
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.pnLdome = false
            if (this.pezi.param_type == '字符型') {
              this.pezi.newParam_type = '1'
            } else if (this.pezi.param_type == '数值型') {
              this.pezi.newParam_type = '2'
            } else if (this.pezi.param_type == '长文本型') {
              this.pezi.newParam_type = '3'
            }
            var obj = {
              name: this.pezi.name, // "参数名称",
              order: this.n, // "序号",
              param_type: this.pezi.newParam_type, // "参数类型",
              tag: this.service_tag, // "参数标签",
              describe: this.pezi.describe, // "参数描述"
              isRequired: true
            }
            if (this.pezi.isRequired == '是') {
              obj.isRequired = true
            } else {
              obj.isRequired = false
            }
            this.service_param_detail[2].service_param.push(obj)
            this.pezi.name = ''
            this.pezi.param_type = '字符型'
            this.metaDatafx.serviceTag = []
            this.pezi.service_tag = []
            this.pezib.service_tag = []
            this.pezi.describe = ''
            console.info(
              '.11this.11',
              this.service_param_detail[2].service_param
            )
          }
        })
      }
      if (formName == 'pezib') {
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.pnLdomeb = false
            if (this.pezib.param_type == '字符型') {
              this.pezib.newParam_type = '1'
            } else if (this.pezib.param_type == '数值型') {
              this.pezib.newParam_type = '2'
            } else if (this.pezib.param_type == '长文本型') {
              this.pezib.newParam_type = '3'
            }
            var obj = {
              name: this.pezib.name, // "参数名称",
              order: this.n, // "序号",
              param_type: this.pezib.newParam_type, // "参数类型",
              tag: this.service_tag, // "参数标签",
              describe: this.pezib.describe // "参数描述"
            }
            this.service_param_detail[2].service_out_param.push(obj)
            this.pezib.name = ''
            this.pezib.param_type = '字符型'
            this.metaDatafx.serviceTag = []
            this.pezib.service_tag = []
            this.pezi.service_tag = []
            this.pezib.describe = ''
          }
        })
      }
    },
    moveadCss () {
      var that = this
      that.cssHag = !that.cssHag
    },
    // 添加
    addPnl (name) {
      var that = this
      if (name == 'pezi') {
        that.pnLdome = true
      }
      if (name == 'pezib') {
        that.pnLdomeb = true
      }
    },
    showTagsfx () {
      var that = this
      that.dialogTagVisible = true
      that.acti = 1
    },
    submitForm (formName) {
      var that = this
      this.$refs[formName].validate(valid => {
        var serviceObj = {
          request_type: that.formpz.request_type,
          charset: that.formpz.charset, // 字符集
          input_body: that.formpz.input_body, // "页面请求体",
          service_param: that.formpz.service_param
        }
        // service_param_detail.push(serviceObj);
        console.info('service_param_detail', that.service_param_detail)
        that.service_param_detail[2].service_param.forEach(function (v, i) {
          v.order = i + 1
        })
        that.service_param_detail[2].service_out_param.forEach(function (v, i) {
          v.order = i + 1
        })
        var myData = {
          id: that.id,
          operate_page: '4',
          service_param_detail: that.service_param_detail
        }
        console.info(myData)
        if (that.service_param_detail[2].service_param.length == 0) {
          TipBoxService.open('请输入纯数据请求参数配置', 2)
          return false
        }
        if (that.service_param_detail[2].service_out_param.length == 0) {
          TipBoxService.open('请输入返回参数的参数配置', 2)
          return false
        }
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
    validateName: function (rule, value, callback) {
      if (value == '') {
        this.rulesa.name[0].rulname = this.rulesa.name[0].rulnameF
        callback('请输入参数名称')
      } else {
        if (this.formpz.service_param.length != 0) {
          for (var i = 0; i < this.formpz.service_param.length; i++) {
            if (this.formpz.service_param[i].name == this.pezi.name) {
              this.rulesa.name[0].rulname = this.rulesa.name[0].rulnameT
              callback('配置参数有重复。请修改')
            } else {
              callback()
            }
          }
        } else {
          callback()
        }
      }
    },
    validateDescribe: function (rule, value, callback) {
      if (value == '') {
        this.rulesa.describe[0].rulnDescribe = this.rulesa.describe[0].rulnDescribeT
        callback('请输入参数描述')
      } else {
        callback()
      }
    },
    validateInputBody: function (rule, value, callback) {
      console.log(this.service_param_detail[2].service_param)
      var flag = true
      var that = this
      var lastArg = ''
      var newArr = new Array()
      var nameArr = new Array()
      var urlArr = new Array()
      urlArr = [...this.outPutArr]
      if (value != '') {
        try {
          JSONLint.jsonlint.parse(value)
        } catch (e) {
          this.rulesb.input_body[0].rulname = this.rulesb.input_body[0].rulnameE
          callback('请求体格式有误，请输入正确格式')
          flag = false
          return
        }
        var re = /^[0-9]+.?[0-9]*$/
        if (re.test(value)) {
          callback('请求体格式有误，请输入正确格式')
          flag = false
          return
        }

        if (value.indexOf('[') != -1 || value.indexOf(']') != -1) {
          this.rulesb.input_body[0].rulname = this.rulesb.input_body[0].rulnameT
          callback('请求体不支持数组格式')
          flag = false
          return
        } else {
          if (value != '{}') {
            var inputArr = []
            inputArr = value.split(',')
            var valStr = JSON.stringify(value)
            var val = JSON.parse(JSON.parse(valStr))
            valStr = valStr.substring(1, valStr.length - 1)
            valStr = this.Trim(valStr, 'g')
            valStr = valStr.replace(/(\\n)|(\\)/g, '')
            var newVal = JSON.stringify(val)
            for (var k = 0; k < inputArr.length; k++) {
              var paramsArr = inputArr[k].split(':')
              var kvArray = inputArr[k].split(':')
              if (kvArray.length > 2) {
                var paramKey = kvArray[kvArray.length - 2]
                var paramValue = kvArray[kvArray.length - 1]
              } else {
                var paramKey = kvArray[0]
                var paramValue = kvArray[1]
              }
              if (paramValue.indexOf('#{') != -1) {
                newArr.push(paramValue.substring(3, paramValue.indexOf('}')))
              }
            }
          } else {
            this.rulesb.input_body[0].rulname = this.rulesb.input_body[0].rulnameM
            callback('请输入完整请求体')
            flag = false
            return
          }
        }
        if (valStr !== newVal) {
          this.rulesb.input_body[0].rulname = this.rulesb.input_body[0].rulnameN
          callback('请求体中存在重复名称', 2)
          flag = false
          return
        }
        if ((new Set(newArr)).size != newArr.length) {
          this.rulesb.input_body[0].rulname = this.rulesb.input_body[0].rulnameF
          callback('请求体中存在重复参数', 2)
          flag = false
          return
        }
            // 将请求路径中和请求体中的参数合并在同一个数组中
        for (var i = 0; i < newArr.length; i++) {
          urlArr.push(newArr[i])
        }
            // 判断请求路径和请求体中是否存在相同的参数
        var s = urlArr.join(',') + ','
        for (var i = 0; i < urlArr.length; i++) {
          if ((s.replace(urlArr[i] + ',', '').indexOf(urlArr[i] + ',') > -1) && s.replace(urlArr[i] + ',', '') === urlArr[i] + ',') {
            lastArg = urlArr[i]
          }
        }
        if (lastArg != '') {
          this.rulesb.input_body[0].rulname = this.rulesb.input_body[0].rulnameH
          callback('请求体和路径中存在重复参数', 2)
          flag = false
          return
        }
        var res = []
            // var json = {};
        for (var i = 0; i < urlArr.length; i++) {
              // if(!json[outPutArr[i]]){
          res.push(urlArr[i])
              // 	json[outPutArr[i]] = 1;
              // }
        }
        for (var i = 0; i < this.service_param_detail[2].service_param.length; i++) {
          nameArr.push(this.service_param_detail[2].service_param[i].name)
        }
        var _a = JSON.stringify(nameArr.sort())
        var _b = JSON.stringify(res.sort())
        if (_a != _b) {
          callback('配置参数和请求参数不一致！')
          flag = false
          return
        }
        if (nameArr.length != res.length) {
          callback('配置参数和请求参数不一致！')
          flag = false
          return
        }
        if (flag) {
          callback()
        }
      } else {
        if (that.outPutArr.length != this.service_param_detail[2].service_param.length) {
          callback('请输入请求体')
          flag = false
          return
        } else {
          return callback()
        }
      }
      return callback()
    },
    validateInputBodyTag (rule, value, callback) {
      if (value == '') {
        this.rulesa.service_tag[0].rulnServiceTag = this.rulesa.service_tag[0].rulnServiceTagT
        callback('请选择参数标签')
      } else {
        callback()
      }
    },
    validateOutPutBodyTag (rule, value, callback) {
      if (value == '') {
        this.rulesa.service_tag[0].rulnServiceTag = this.rulesa.service_tag[0].rulnServiceTagT
        callback('请选择参数标签')
      } else {
        callback()
      }
    },
    Trim (str, is_global) {
      var result
      result = str.replace(/(^\s+)|(\s+$)/g, '')
      if (is_global.toLowerCase() == 'g') {
        result = result.replace(/\s/g, '')
      }
      return result
    },
    validateOutputBody (rule, value, callback) {
      console.log(this.service_param_detail[2].service_out_param)
      var flag = true
      var that = this
      var newArr = new Array()
      var nameArr = new Array()
      for (var i = 0; i < this.service_param_detail[2].service_out_param.length; i++) {
        nameArr.push(this.service_param_detail[2].service_out_param[i].name)
      }
      if (nameArr.length != newArr.length) {
        if (value != '') {
          try {
            JSONLint.jsonlint.parse(value)
          } catch (e) {
            this.rulesb.output_body[0].rulname = this.rulesb.output_body[0].rulnameE
            callback('输出参数格式有误，请输入正确格式')
            flag = false
            return
          }
          var re = /^[0-9]+.?[0-9]*$/
          if (re.test(value)) {
            callback('输出参数格式有误，请输入正确格式')
            flag = false
            return
          }

          if (value.indexOf('[') != -1 || value.indexOf(']') != -1) {
            this.rulesb.output_body[0].rulname = this.rulesb.output_body[0].rulnameT
            callback('输出参数不支持数组格式')
            flag = false
            return
          } else {
            if (value != '{}') {
              var inputArr = []
              inputArr = value.split(',')
              var valStr = JSON.stringify(value)
              var val = JSON.parse(JSON.parse(valStr))
              valStr = valStr.substring(1, valStr.length - 1)
              valStr = this.Trim(valStr, 'g')
              valStr = valStr.replace(/(\\n)|(\\)/g, '')
              var newVal = JSON.stringify(val)
              for (var k = 0; k < inputArr.length; k++) {
                var paramsArr = inputArr[k].split(':')
                var kvArray = inputArr[k].split(':')
                if (kvArray.length > 2) {
                  var paramKey = kvArray[kvArray.length - 2]
                  var paramValue = kvArray[kvArray.length - 1]
                } else {
                  var paramKey = kvArray[0]
                  var paramValue = kvArray[1]
                }
                if (paramValue.indexOf('#{') != -1) {
                  newArr.push(paramValue.substring(3, paramValue.indexOf('}')))
                }
              }
            } else {
              this.rulesb.output_body[0].rulname = this.rulesb.output_body[0].rulnameM
              callback('输出参数格式有误，请输入正确格式')
              flag = false
              return
            }
          }
           // 判断输出参数是否存在重复参数
          if (valStr !== newVal) {
            this.rulesb.output_body[0].rulname = this.rulesb.output_body[0].rulnameN
            callback('输出参数中存在重复名称', 2)
            flag = false
            return
          }
          if ((new Set(newArr)).size != newArr.length) {
            this.rulesb.output_body[0].rulname = this.rulesb.output_body[0].rulnameF
            callback('输出参数中存在重复参数', 2)
            flag = false
            return
          }
          var res = []
            // var json = {};
          for (var i = 0; i < newArr.length; i++) {
              // if(!json[outPutArr[i]]){
            res.push(newArr[i])
              // 	json[outPutArr[i]] = 1;
              // }
          }
          var _a = JSON.stringify(nameArr.sort())
          var _b = JSON.stringify(res.sort())
          if (_a != _b) {
            callback('配置参数和输出参数不一致！')
            flag = false
            return
          }
          if (nameArr.length != res.length) {
            callback('配置参数和输出参数不一致！')
            flag = false
            return
          }
          if (flag) {
            callback()
          }
        } else {
          callback('请输入输出参数')
          flag = false
          return
        }
      } else {
        callback()
      }
    },
    validateUrl (rule, value, callback) {
      var that = this
      var outPutArg = ''
      this.outPutArr = []
      let nameArr = []
      for (var i = 0; i < this.service_param_detail[2].service_param.length; i++) {
        nameArr.push(this.service_param_detail[2].service_param[i].name)
      }
      if (value === '') {
        that.rulesb.url[0].rulurl = that.rulesb.url[0].rulurlF
        callback('请输入URL')
      } else {
        if (!that.urlValidate(value)) {
          that.rulesb.url[0].rulurl = that.rulesb.url[0].rulurlT
          callback('请求地址有误')
        } else {
          // 将请求路径中的参数存在数组中
          if (value.split('#{').length != 1) {
            var f1 = value.split('#{')
            for (var i = 0; i < f1.length; i++) {
              if (i < f1.length - 1) {
                var a1 = f1[i + 1]
                var a = a1.indexOf('{')
                var e = a1.indexOf('}')
                this.outPutArr.push(a1.substring(a + 1, e))
              }
            }
          }
          // 判断路径中是否存在重复参数
          var s = this.outPutArr.join(',') + ','
          for (var i = 0; i < this.outPutArr.length; i++) {
            if (
              s
                .replace(this.outPutArr[i] + ',', '')
                .indexOf(this.outPutArr[i] + ',') > -1
            ) {
              outPutArg = this.outPutArr[i]
            }
          }
          if (outPutArg != '') {
            callback('路径中存在重复参数', 2)
            that.rulesb.url[0].rulurl = that.rulesb.url[0].rulurlL
            return
          }
          if (this.service_param_detail[2].request_type === 'get') {
            var res = []
            for (let i = 0; i < this.outPutArr.length; i++) {
              res.push(this.outPutArr[i])
            }
            var _a = JSON.stringify(nameArr.sort())
            var _b = JSON.stringify(res.sort())
            if (_a != _b) {
              callback('配置参数和路径参数不一致！')
              that.rulesb.url[0].rulurl = that.rulesb.url[0].rulurlM
              return
            }
            if (nameArr.length != res.length) {
              callback('配置参数和路径参数不一致！')
              that.rulesb.url[0].rulurl = that.rulesb.url[0].rulurlM
              return
            }
          }
          return callback()
        }
      }
    },
    isCatalogUrl (str_url) {
      let strRegex = '^(\/{1})([a-zA-Z_0-9-](\/?))*$'//
      let re = new RegExp(strRegex)

      if (re.test(str_url)) {
        return (true)
      } else {
        return (false)
      }
    },
    isRemoteUrl (str_url) {
      let strRegex = '^((https|http|ftp|rtsp|mms)?://)' +
									'?(([0-9a-z_!~*\'().&=+$%-]+: )?[0-9a-z_!~*\'().&=+$%-]+@)?' +
									'(([0-9]{1,3}\.){3}[0-9]{1,3}' + // IP形式的URL- 199.194.52.184
									'|' + // 允许IP和DOMAIN（域名）
									'([0-9a-z_!~*\'()-]+\.)*' + // 域名- www.
									'([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\.' + // 二级域名
									'[a-z]{2,6})' +
									'(:[0-9]{1,5})?' + // 端口- :80898
									'((/?)|' +
									'(/[0-9a-z_!~*\'().;?:@&=+$,%#-]+)+/?)'
      let re = new RegExp(strRegex)    // re.test()

      if (re.test(str_url)) {
        return (true)
      } else {
        return (false)
      }
    },
    urlValidate (value) {
      let that = this
      // if (that.appServer) {
      //   that.isCatalogUrl(value)
      // } else {
      //   that.isRemoteUrl(value)
      // }
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
        if (!re_weburl.test(value) && !that.appServer) {
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
.rulseStyle .el-form-item__error {
  display: block !important;
}
</style>
