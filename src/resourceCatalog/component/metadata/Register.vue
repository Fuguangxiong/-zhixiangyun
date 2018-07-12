<template>
<div class="root-body">
    <div class="container main-nav">
        <div class="row nav_box">
          <i class="iconfont icon-dingwei" @click="goHome"></i><span class="nav_box_text_goback" @click="goBack">{{breadCrumbs[0]}}</span>
          <span>·</span>
          <span class="nav_box_text">注册数据元</span>
        </div>
    </div>
    <!-- <div class="main-content-box" :style="{'height':(fullHeight - 165) + 'px','overflow-y':'auto'}"> -->
    <div class="main-content-box" :style="{'position':'absolute','top':'60px','bottom':'0','left':'15px','right':'15px','overflow-y':'scroll'}">
      <div class="rescontent-box">
        <div class="container main-content">
          <form @submit.prevent="validateBeforeSubmit" id="metadataForm" name="metadataForm">
              <div class="row head-input">
                  <div>
                  <input type="text" required v-validate="'required'" name="name" v-model="metaData.name" @blur="checkName"><span style="margin-right:20px"> — 数据元</span>
                  <img src="../../../publicImages/loading_check.gif" v-show="loadingImg"/>
                  <span class="validate-msg" :class="[checkInfo === '数据元名称可用'?'checkSuccess':'checkFail']">{{checkInfo}}</span>
                  <span v-show="errors.has('name')" class="validate-msg">{{ errors.first('name') }}</span>
                  </div>
              </div>
              <div class="row input">
                  <div class="col-xs-1 input-label"><span><span class="red-star">*</span>内部标识符</span></div>
                  <div class="col-xs-3"><input type="text" required v-validate="'required'" name="internalTag" v-model="metaData.internalTag"></div>
                  <div class="col-xs-2 msg-box"><span v-show="errors.has('internalTag')" class="validate-msg">{{ errors.first('internalTag') }}</span></span></div>
                  <div class="col-xs-1 input-label"><span><span class="red-star">*</span>中文名称</span></div>
                  <div class="col-xs-3"><input type="text" required v-validate="'required'" name="cnName" v-model="metaData.cnName"></div>
                  <div class="col-xs-2 msg-box msg-box"><span v-show="errors.has('cnName')" class="validate-msg">{{ errors.first('cnName') }}</span></div>
              </div>
              <div class="row input">
                  <div class="col-xs-1 input-label"><span><span class="red-star">*</span>中文全拼</span></div>
                  <div class="col-xs-3"><input type="text" required v-validate="'required'" name="cnSpelling" v-model="metaData.cnSpelling"></div>
                  <div class="col-xs-2 msg-box"><span v-show="errors.has('cnSpelling')" class="validate-msg">{{ errors.first('cnSpelling') }}</span></div>
                  <div class="col-xs-1 input-label"><span>英文名称</span></div>
                  <div class="col-xs-3"><input type="text" name="enName" v-model="metaData.enName"></div>
                  <div class="col-xs-2 msg-box"><span class="validate-msg"></span></div>
              </div>
              <div class="row input">
                  <div class="col-xs-1 input-label"><span><span class="red-star">*</span>版本</span></div>
                  <div class="col-xs-3"><input type="text" required v-validate="'required'" name="version" v-model="metaData.version"></div>
                  <div class="col-xs-2 msg-box"><span v-show="errors.has('version')" class="validate-msg">{{ errors.first('version') }}</span></div>
                  <div class="col-xs-1 input-label"><span><span class="red-star">*</span>标识符</span></div>
                  <div class="col-xs-3"><input type="text" required v-validate="'required'" name="tag" v-model="metaData.tag"></div>
                  <div class="col-xs-2 msg-box"><span v-show="errors.has('tag')" class="validate-msg">{{ errors.first('tag') }}</span></div>
              </div>
              <div class="row input">
                  <div class="col-xs-1 input-label"><span>语境</span></div>
                  <div class="col-xs-3"><input type="text" name="languageContext" v-model="metaData.languageContext"></div>
                  <div class="col-xs-2 msg-box"><span class="validate-msg"></span></div>
                  <div class="col-xs-1 input-label"><span>同义名称</span></div>
                  <div class="col-xs-3"><input type="text" name="synonym" v-model="metaData.synonym" ></div>
                  <div class="col-xs-2 msg-box"><span class="validate-msg"></span></div>
              </div>    
              <div class="row input">
                  <div class="col-xs-1 input-label"><span>说明</span></div>
                  <div class="col-xs-9"><textarea  class="col9-textarea" name="explanation" v-model="metaData.explanation"/></div>
                  <div class="col-xs-2 msg-box"><span class="validate-msg"></span></div>
              </div>
              <div class="row input">
                  <div class="col-xs-1 input-label"><span><span class="red-star">*</span>对象类词</span></div>
                  <div class="col-xs-3"><input type="text" required v-validate="'required'" name="objectWord" v-model="metaData.objectWord"></div>
                  <div class="col-xs-2 msg-box"><span v-show="errors.has('objectWord')" class="validate-msg">{{ errors.first('objectWord') }}</span></div>
                  <div class="col-xs-1 input-label"><span><span class="red-star">*</span>特性词</span></div>
                  <div class="col-xs-3"><input type="text" required v-validate="'required'" name="characterWord" v-model="metaData.characterWord"></div>
                  <div class="col-xs-2 msg-box"><span v-show="errors.has('characterWord')" class="validate-msg">{{ errors.first('characterWord') }}</span></div>
              </div>
              <div class="row input">
                  <div class="col-xs-1 input-label"><span><span class="red-star">*</span>应用约束</span></div>
                  <div class="col-xs-3"><input type="text" class="col9-input" required v-validate="'required'" name="applyRestraint" v-model="metaData.applyRestraint"></div>
                  <div class="col-xs-2 msg-box"><span v-show="errors.has('applyRestraint')" class="validate-msg">{{ errors.first('applyRestraint') }}</span></div>
                  <div class="col-xs-1 input-label"><span>分类方案</span></div>
                  <div class="col-xs-3"><input type="text" name="solutionName" v-model="metaData.solutionName"></div>
                  <div class="col-xs-2 msg-box"><span class="validate-msg"></span></div>
              </div>
              <div class="row input">
                  <div class="col-xs-1 input-label"><span>分类方案值</span></div>
                  <div class="col-xs-3"><input type="text" name="solutionValue" v-model="metaData.solutionValue"></div>
                  <div class="col-xs-2 msg-box"><span class="validate-msg"></span></div>
                  <div class="col-xs-1 input-label"><span>关系</span></div>
                  <div class="col-xs-3"><input type="text" class="col9-input" name="relation" v-model="metaData.relation" ></div>
                  <div class="col-xs-2 msg-box"><span class="validate-msg"></span></div>
              </div>   
              <div class="row input">
                  <div class="col-xs-1 input-label"><span>表示词</span></div>
                  <div class="col-xs-3"><input type="text"  name="expressionWord" v-model="metaData.expressionWord" ></div>
                  <div class="col-xs-2 msg-box"><span class="validate-msg"></span></div>
                  <div class="col-xs-1 input-label"><span><span class="red-star">*</span>数据类型</span></div>
                  <div class="col-xs-3">
                    <select  name="dataType" v-model="metaData.dataType" required v-validate="'required'">
                      <option value="" disabled>请选择</option>
                      <option v-for="(dataType, index) in dataTypes" :key="index" :value="dataType.value">{{dataType.text}}</option>
                    </select></div>
                  <div class="col-xs-2 msg-box"><span v-show="errors.has('dataType')" class="validate-msg">{{ errors.first('dataType') }}</span></div>
              </div>
              <div class="row input">
                  <div class="col-xs-1 input-label"><span><span class="red-star">*</span>表示格式</span></div>
                  <div class="col-xs-3">
                    <input type="text" required v-validate="'required|verify_dataType'" name="expressionFormat" v-model="metaData.expressionFormat" style="width:70%"><input id="optionBtn" type="button" @click="openSetDataFormatDialog" :disabled="!showSetDataFormatBtn" value="设置" :class="{'showSetDataFormatBtn': showSetDataFormatBtn}"></div>
                  <div class="col-xs-2 msg-box"><span v-show="errors.has('expressionFormat')" class="validate-msg">{{ errors.first('expressionFormat') }}</span></div>
                  <div class="col-xs-1 input-label"><span>计量单位</span></div>
                  <div class="col-xs-3"><input type="text"  name="measureUnit" v-model="metaData.measureUnit" ></div>
                  <div class="col-xs-2 msg-box"><span class="validate-msg"></span></div>
              </div>
              <div class="row input">
                  <div class="col-xs-1 input-label"><span><span class="red-star">*</span>值域</span></div>
                  <div class="col-xs-9"><input type="text" class="col9-input" required v-validate="'required'" name="valueField" v-model="metaData.valueField"></div>
                  <div class="col-xs-2 msg-box"><span v-show="errors.has('valueField')" class="validate-msg">{{ errors.first('valueField') }}</span></div>
              </div>
              <div class="row input">
                  <div class="col-xs-1 input-label"><span>状态</span></div>
                  <div class="col-xs-3"><input type="text" name="state" v-model="metaData.state"></div>
                  <div class="col-xs-2 msg-box"><span class="validate-msg"></span></div>
                  <div class="col-xs-1 input-label"><span>注册机构</span></div>
                  <div class="col-xs-3"><input type="text" name="registedOrg" v-model="metaData.registedOrg"></div>
                  <div class="col-xs-2 msg-box"><span class="validate-msg"></span></div>
              </div>
              <div class="row input">
                  <div class="col-xs-1 input-label"><span><span class="red-star">*</span>提交机构</span></div>
                  <div class="col-xs-3"><input type="text" required v-validate="'required'" name="submitOrg" v-model="metaData.submitOrg"></div>
                  <div class="col-xs-2 msg-box"><span v-show="errors.has('submitOrg')" class="validate-msg">{{ errors.first('submitOrg') }}</span></div>
                  <div class="col-xs-1 input-label" v-show="showApproveDate"><span>批准日期</span></div>
                  <div class="col-xs-3" v-show="showApproveDate"><input type="text" readonly="readonly" name="approveDate" v-model="metaData.approveDate"></div>
                  <div class="col-xs-2 msg-box" v-show="showApproveDate"><span class="validate-msg"></span></div>
              </div>  
              <div class="row input">
                  <div class="col-xs-1 input-label"><span><span class="red-star">*</span>主要起草人</span></div>
                  <div class="col-xs-9"><textarea required v-validate="'required'" name="mainDraftsman" v-model="metaData.mainDraftsman" class="col9-textarea"></textarea></div>
                  <div class="col-xs-2 msg-box"><span v-show="errors.has('mainDraftsman')" class="validate-msg">{{ errors.first('mainDraftsman') }}</span></div>
              </div>
              <div class="row input">
                  <div class="col-xs-1 input-label"><span>备注</span></div>
                  <div class="col-xs-9"><textarea class="col9-textarea" name="comments" v-model="metaData.comments"></textarea></div>
                  <div class="col-xs-2 msg-box"></div>
              </div>
              <div class="row input">
                  <div class="col-xs-1 input-label"><span><span class="red-star">*</span>标签</span></div>
                  <div class="col-xs-3"><input type="text" required v-validate="'required'" readonly="true" name="labels" v-model="labelStr"></div>
                  <div class="col-xs-2"><span><a href="javascript:void(0)" @click="dialogTagVisible=true">选择标签</a></span></div>
                  <div class="col-xs-2 msg-box"><span v-show="errors.has('labels')" class="validate-msg">{{ errors.first('labels') }}</span></div>
              </div>
              <button v-show="false" class="btn btn-primary btn-block" type="submit" id="submitBtn" name="submitBtn">Submit</button>
          </form>
          <div class="row head-input head-input-code-box">
              {{metaData.name}}&nbsp;— 数据元代码
          </div>

          <div v-if="metaData.metadataCodes" style=" overflow-y:auto; width:886px; height:400px; margin: 0 0 20px 30px">
            <table class="table table-striped">
              <thead>
                <tr>
                  <th>序号</th>
                  <th>代码</th>
                  <th>名称</th>
                  <th>说明</th>
                </tr>
              </thead>
              <tbody>
                  <tr v-for="(item, index) in metaData.metadataCodes" :key="index">
                  <td>{{index + 1}}</td>
                  <td>{{item.code}}</td>
                  <td>{{item.name}}</td>
                  <td>{{item.describe}}</td>
                </tr> 
              </tbody>    
            </table>     
          </div>

          <div class="upload-box">
              <div><span v-show="uploadFileInfo.filename"><font style="font-weight:bold;font-size:14px;">已选择数据元文件: {{uploadFileInfo.filename}}，请点击提交按钮保存. </font>
              [<span @click="cleanUpFile" class="clearFileX" title="取消上传">
                <font style="font-weight:bold;font-size:14px">移除</font></span>] </span></div>
              <div class="upload-btn-group">
                  <button type="button" class="btn btn-primary" @click="selectFile">上传数据元代码文件</button>
                  <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
                  <span><a :href="apiDownloadUrl">下载标准模板</a></span>
              </div>
              <div class="upload-note-box">
                  <div>1、可直接上传本地已有数据元代码文件，支持xls、xlsx、csv格式文件；</div>
                  <div>2、若本地无数据元代码文件，可通过下载标准模板进行信息录入，然后上传。</div>
              </div>
              <div><span v-show="saveResultMsg" :class="isSaveError?'errorMsg':'successMsg'">{{saveResultMsg}}</span></div>
              <div>
                  <input class="file" v-show="false" id="inputFile" name="inputFile" type="file" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" @change="uploadFile"/>
              </div>
          </div>
      </div>
      <div class="save-btn-bottom-box">
        <button type="button" class="normalButton" @click="cancel()">返回</button>
        <button type="button" class="normalButton" @click="save(1)">提交</button>
        <button type="button" class="normalButton" @click="save(0)"  v-show="metaData.approvalStatus === 3 ? false : true">暂存</button>
      </div>
      </div>
    </div>
    
    <LabelView :dialogTagVisible.sync="dialogTagVisible" :isCreateModel="!isEdit" :model="metaData" modelLabelKey="labels" :changeLabelCaller="saveLabel" />
    <el-dialog
      title="设置元数据表示格式" :visible.sync="showDialog4SetDataFormat" size="tiny" @close="hasExpressionFormatError=''">
      <el-form :model="dateTypeFormatForm">
        <span v-if="metaData.dataType=='STRING'||metaData.dataType=='NUMERIC'">
          <el-form-item :label="getDataTypeObjects().text" :label-width="'140px'">
            <input size="1" type="text" v-model="dateTypeFormatForm.type" readonly class="dataTypeFormatInputType">
            <input type="number" class="dataTypeFormatInputNumber" v-model="dateTypeFormatForm.min"> - <input type="number" class="dataTypeFormatInputNumber" v-model="dateTypeFormatForm.max">
            <div v-if="metaData.dataType=='NUMERIC'">
               小数位：<input type="number" class="dataTypeFormatInputNumber" v-model="dateTypeFormatForm.decimal" >
            </div>
          </el-form-item>
         </span>
        <span v-if="metaData.dataType=='BOOLEAN'">
          <el-form-item :label="getDataTypeObjects().text" :label-width="'140px'">
            <select class="dataTypeFormatSelect" v-model="dateTypeFormatForm.bool">
              <option>true</option>
              <option>false</option>
              <option>1</option>
              <option>0</option>
            </select>
          </el-form-item>
        </span>
        <div class="hasExpressionFormatErrorDiv"><span v-show="hasExpressionFormatError" class="validate-msg">{{ hasExpressionFormatError }}</span></div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showDialog4SetDataFormat = false">取 消</el-button>
        <el-button type="primary" @click="setDataFormat()">确 定</el-button>
      </span>
    </el-dialog>
</div>
</template>
<script>
import Vue from 'vue'
import VeeValidate, { Validator } from 'vee-validate'
import ApiClient from '@/publicJs/ApiClient'
import Util from '@/publicJs/Util'
import $ from 'jquery'
import _ from 'lodash'
import Constants from '@/publicJs/Constants'
import LabelView from '@/publicComponent/labelView'
import LoadingBoxService from '../../../publicJs/LoadingBoxService.js'
// Validator.updateDictionary({
//   en: {
//     messages: {
//       required: field => '此项必须填写'
//     }
//   }
// })

const config = {
  fieldsBagName: 'fieldBags'
}
Vue.use(VeeValidate, config)

let dataTypeObjects = [
  {value: 'STRING', text: '字符型(string)', formatTag: 'c'},
  {value: 'NUMERIC', text: '数值型(numeric)', formatTag: 'n'},
  {value: 'DATE', text: '日期型(date)', formatValue: 'yyyy-xsd'},
  {value: 'DATETIME', text: '日期时间型(datetime)', formatValue: 'yyyy-xsdHHmmss'},
  {value: 'BOOLEAN', text: '布尔型(boolean)', formatValues: ['true', 'false', '1', '0']},
  {value: 'BINARY', text: '二进制型(binary)', formatValue: 'b'}
]

function getFixLenthMatch (typeTag, value) {
  return new RegExp('^' + typeTag + '\\d+$').exec(value)
}
function getTypeMinMaxMatch (typeTag, value) {
  return new RegExp('^' + typeTag + '(\\d*)\\.\\.(\\d+)$').exec(value)
}
function getDecimalMatch (value) {
  return /^n(\d*)\.\.(\d+)\s*,\s*(\d+)$/.exec(value) || /^n(\d+)\s*,\s*(\d+)$/.exec(value)
}

export default {
  components: {
    LabelView
  },
  data () {
    return {
      metaData: {name: '', dataType: '', labels: []},
      approvalStatus: 0, // 0： 暂存； 1：提交
      saveResultMsg: '',
      isSaveError: false,
      uploadFileInfo: {file: null, filename: ''},
      apiDownloadUrl: Constants.apiBaseUrl + '/rcapi/metadata/downloadMetaCodeTemplate?token=' + Util.getToken(),
      isEdit: this.$route.params.page === 'edit',
      metaDataId: this.$route.params.id,
      showApproveDate: false,
      dialogTagVisible: false,
      breadCrumbs: [], // 面包屑数组
      labelStr: '',
      dataTypes: dataTypeObjects,
      showSetDataFormatBtn: false,
      showDialog4SetDataFormat: false,
      loadingImg: false,
      checkInfo: '',
      dateTypeFormatForm: {
        type: '',
        min: '',
        max: '',
        decimal: '',
        bool: ''
      },
      hasExpressionFormatError: '',
      title: '数据元管理',
      nameStorage: ''
    }
  },
  created () {
    Validator.extend('verify_dataType', {
      getMessage: field => '格式不正确',
      validate: value => {
        if (!this.metaData.dataType) {
          return true
        }
        let dataType = this.getDataTypeObjects()
        if (!dataType) {
          return false
        }
        if (dataType.formatValue) {
          return value === dataType.formatValue
        }
        if (dataType.formatValues) {
          return _.findIndex(dataType.formatValues, function (o) { return o == value }) >= 0
        }
        if (dataType.formatTag) {
          if (getFixLenthMatch(dataType.formatTag, value) != null) {
            return true
          }

          let minMaxMatch = getTypeMinMaxMatch(dataType.formatTag, value)
          let decimalMatch = null
          if (minMaxMatch == null) {
            decimalMatch = getDecimalMatch(value)
          }
          if (minMaxMatch == null && decimalMatch == null) {
            return false
          }
          let min = '0'
          if (minMaxMatch != null) {
            min = minMaxMatch[1] || '0'
          } else {
            min = decimalMatch[1] || '0'
          }
          let max = ''
          if (minMaxMatch != null) {
            max = minMaxMatch[2]
          } else if (decimalMatch.length > 3) {
            max = decimalMatch[2]
          }

          if (min !== '0' && min.charAt(0) === '0') {
            return false
          }
          if (max !== '' && max.charAt(0) === '0') {
            return false
          }
          if (max === '') {
            return true
          }
          return parseInt(max) > parseInt(min)
        }
      }
    })
   // this.$validator.attach('expressionFormat', 'required|verify_dataType')
  },
  mounted () {
    if (this.$route.params.breadCrumbStr) {
      this.saveBreadCrumb()
      let breadCrumbStr = this.$route.params.breadCrumbStr
      this.breadCrumbs = breadCrumbStr.split('>')
    } else {
      this.breadCrumbs = sessionStorage.getItem('metadataBreadCrumb').split(',')
    }
    $('input[type="text"]').on('change', () => {
      this.saveResultMsg = ''
      this.isSaveError = false
    })
    if (this.isEdit && this.metaDataId) {
      this.getMetadataToEdit(this.metaDataId)
      this.showApproveDate = true
    }
  },
  watch: {
    'metaData.dataType' (value) {
      let dataType = this.getDataTypeObjects(value)
      if (dataType && dataType.formatValue) {
        this.metaData.expressionFormat = dataType.formatValue
        this.showSetDataFormatBtn = false
      } else {
        this.showSetDataFormatBtn = true
      }
      this.dateTypeFormatForm.type = dataType && dataType.formatTag || ''
      this.$validator.validate('expressionFormat', this.metaData.expressionFormat)
    },
    'metaData.labels' (value) {
      this.labelStr = value.join(',')
    },
    'metaData.name' (value) {
      if (value === '') {
        this.checkInfo = ''
      }
    }
  },
  methods: {
    getMetadataToEdit (id) {
      LoadingBoxService.open('数据加载中...')
      ApiClient.get(Util.sf('/rcapi/metadata/id/{}', id)).then(data => {
        this.metaData = data
        this.nameStorage = data.name
        LoadingBoxService.close()
      })
    },
    validateBeforeSubmit () {
      this.$validator.validateAll()
      if (!this.errors.any() && (this.checkInfo === '数据元名称可用' || this.checkInfo === '')) {
        this.submitForm()
      }
    },
    submitForm () {
      // let loadingInstance = Loading.service({ fullscreen: true, text: '加载中' })
      LoadingBoxService.open('数据保存中...')
      this.metaData.approvalStatus = this.approvalStatus
      this.saveResultMsg = ''
      let promise = null
      let apiUrl = '/rcapi/metadata/create'
      if (this.isEdit && this.metaDataId) {
        apiUrl = '/rcapi/metadata/update'
      } else {
        this.metaData.id = Util.getId()
      }
      if (this.uploadFileInfo.file == null) {
        promise = ApiClient.post(apiUrl, this.metaData)
      } else {
        if (this.isEdit && this.metaDataId) {
          delete this.metaData.metadataCodes
          apiUrl = '/rcapi/metadata/updateAndUploadCodeFile'
        } else {
          apiUrl = '/rcapi/metadata/saveAndUploadCodeFile'
        }
        promise = ApiClient.upload(apiUrl, this.uploadFileInfo.file, this.metaData)
      }
      promise.then(result => {
        // loadingInstance.close()
        LoadingBoxService.close()
        this.isSaveError = false
        this.saveResultMsg = this.approvalStatus ? '保存成功' : '数据已暂存'
        this.cleanUpFile()
        this.$router.push('/personRegisterManage?index=2')
        // this.$router.go(-1)
      }, errs => {
        // loadingInstance.close()
        LoadingBoxService.close()
        let cause = ''
        window.errs = errs
        if (errs.response && errs.response.data && errs.response.data.exception) {
          cause = ', ' + errs.response.data.exception
        }
        this.isSaveError = true
        this.saveResultMsg = this.approvalStatus ? '保存失败' + cause : '数据暂存失败' + cause
        console.error(errs)
      })
    },
    saveLabel () {
      this.metaData.approvalStatus = this.approvalStatus
      return ApiClient.post('/rcapi/metadata/update', this.metaData)
    },
    save (state) {
      // console.log(this)
      // this.$parent.leftNavData[4].active = false
      // this.$parent.leftNavData[3].active = true
      this.approvalStatus = state
      this.$parent.setActive('资源管理', '我的注册')
      window.metadataForm.submitBtn.click()
    },
    selectFile () {
      window.inputFile.click()
    },
    uploadFile (e) {
      let fileInfo = this.checkfile(e)
      if (!fileInfo) {
        return
      }
      _.assign(this.uploadFileInfo, fileInfo)
    },
    checkfile (e) {
      let files = e.target.files
      if (files.length === 0) {
        return null
      }
      let validExts = ['.xlsx', '.xls', '.csv']
      let filename = files[0].name
      let fileExt = filename.substring(filename.lastIndexOf('.'))
      if (validExts.indexOf(fileExt) < 0) {
        alert('Invalid file selected, valid files are of ' +
                validExts.toString() + 'types.')
        return null
      }
      return {'file': files[0], 'filename': filename}
    },
    cleanUpFile () {
      this.uploadFileInfo.file = null
      this.uploadFileInfo.filename = ''
    },
    downloadTemplate () {
      ApiClient.get('/rcapi/metadata/downloadMetaCodeTemplate').catch(function (error) {
        console.error(error)
      })
    },
    cancel () {
      this.goBack()
    },
    goBack () {
      this.$router.go(-1)
    },
    goHome () {
      this.$router.push({name: 'Index'})
      // console.log(this)
      this.$parent.setActive('资源管理', '资源目录')
      // this.$parent.leftNavData[5].active = false
      // this.$parent.leftNavData[0].active = true
    },
    getDataTypeObjects (type) {
      let theType = type || this.metaData.dataType
      return _.find(dataTypeObjects, ['value', theType])
    },
    openSetDataFormatDialog () {
      this.dateTypeFormatForm.min = ''
      this.dateTypeFormatForm.max = ''
      this.dateTypeFormatForm.decimal = ''
      this.showDialog4SetDataFormat = true
      let expressionFormat = this.metaData.expressionFormat
      if (expressionFormat !== '') {
        let match = /^(c|n)((\d+)|(\d*)..(\d+))(\s*,\s*(\d+))?$/.exec(expressionFormat)
        if (match != null) {
          if (match[2].indexOf('..') === -1) {
            this.dateTypeFormatForm.min = match[2]
          } else {
            this.dateTypeFormatForm.min = match[4]
            this.dateTypeFormatForm.max = match[5]
          }
          this.dateTypeFormatForm.decimal = match[7] || ''
        }
      }
    },
    setDataFormat () {
      this.hasExpressionFormatError = ''
      let result = ''
      if (this.metaData.dataType === 'BOOLEAN') {
        result = this.dateTypeFormatForm.bool
      } else if (this.metaData.dataType === 'STRING' || this.metaData.dataType === 'NUMERIC') {
        let type = this.dateTypeFormatForm.type
        let min = this.dateTypeFormatForm.min
        let max = this.dateTypeFormatForm.max
        let decimal = this.dateTypeFormatForm.decimal
        if (min === '' && max === '') {
          this.hasExpressionFormatError = '格式不正确'
          return
        }
        if (min !== '' && max !== '' && parseInt(min) >= parseInt(max)) {
          this.hasExpressionFormatError = '格式不正确'
          return
        }
        result = type + min
        if (max !== '') {
          result += '..' + max
        }
        if (decimal !== '') {
          result += ',' + decimal
        }
      }
      this.$validator.validate('expressionFormat', result).then(val => {
        if (val) {
          this.metaData.expressionFormat = result
          this.hasExpressionFormatError = ''
          this.showDialog4SetDataFormat = false
        } else {
          this.hasExpressionFormatError = '格式不正确'
        }
      })
    },
    // 重名校验
    checkName () {
      this.checkInfo = ''
      if (this.metaData.name.trim() !== '' && this.metaData.name.trim() !== this.nameStorage) {
        this.loadingImg = true
        let name = this.metaData.name.trim()
        let dataTotal = {}
        ApiClient.get('/rcapi/metadata/query',
          {keyword: '',
            pageNum: 1,
            pageSize: 1000,
            name: name,
            approvalStatusList: '0,1,2,3',
            userFlag: '1'}).then(data => {
              if (data === null || data.totalNum === 0) {
                this.checkInfo = '数据元名称可用'
              } else {
                dataTotal = data.dataList
                for (let i = 0; i < dataTotal.length; i++) {
                  if (dataTotal[i].name === name) {
                    this.checkInfo = '数据元名称重复'
                    break
                  }
                  this.checkInfo = '数据元名称可用'
                }
              }
              this.loadingImg = false
            }, error => {
              if (error.response && error.response.status === 404) {
                this.checkInfo = 'API不存在或无法访问'
              } else {
                this.checkInfo = '检索数据失败, 访问API服务异常'
              }
            })
      }
    },
    saveBreadCrumb () {
      sessionStorage.setItem('metadataBreadCrumb', this.$route.params.breadCrumbStr.split('>'))
    }
  }
}
</script>
<style src=""></style>
<style scoped>
.main-nav {
  margin-top: 15px;
}
  .nav_box_text_goback{
    cursor: pointer;
  }
  .container{
    background: none;
  }
  .nav_box_text_goback:hover{
    color: #33D48D;
  }
  .main-content{
    padding: 18px;
  }
  .head-input{
    border-bottom: 1px solid #bbd0e5;
    height: 60px;
    padding-top: 20px;
    margin-bottom: 50px !important;
  }
  .head-input>div{
    display: inline-block;
  }
  .head-input input{
    width: 262px;
    height: 30px;
    border: 1px solid #56a8fe;
    border-radius: 4px;
    padding: 0 5px;
  }
  .input .col-xs-2 span{
    color: #e34b60;
  }
  .head-input span:first-of-type{
    color: #56a8fe;
    font-size: 16px;
  }
  .head-input span:last-of-type{
    color: #e34b60;
  }
  .row{
    margin: 0;
  }
  .col-xs-1, .col-xs-2 , .col-xs-3, .col-xs-9{
    padding: 0;
  }
  .main-content .row .col-xs-3{
    padding-right: 16px;
  }
  .main-content .row .col-xs-9{
    padding-right: 16px;
  }
  .main-content .row .col-xs-3 input{
    height: 31px;
    width: 100%;
    border: 1px solid #eee;
    border-radius: 4px;
    padding: 0px 5px;
  }
  .main-content .row .col-xs-1>span{
    float: right;
    margin-right: 10px;
  }
  .main-content .row .col-xs-9 input{
    height: 31px;
    width: 100%;
    border: 1px solid #eee;
    border-radius: 4px;
    padding: 0px 5px;
  }
  .icon-dingwei {
    cursor: pointer;
  }
  .main-content select{
    height: 31px;
    width: 100%;
    border: 1px solid #eee;
    border-radius: 4px;
    padding: 0px 5px;
  }
  .main-content textarea{
    height: 95px;
    width: 100%;
    border: 1px solid #eee;
    border-radius: 4px;
    padding: 5px 5px;
    resize: none;
  }
  .main-content .col3-textarea{
    height: 31px;
    width: 262px;
  }
  .main-content .row div span{
    line-height: 30px;
  }
  .main-content .row{
    margin-bottom: 14px;
  }
  .red-star{
    color: #fa405c;
  }
  #optionBtn{
    height: 31px;
    width: 30%;
    color: #fff;
    background: #e3e3e3;
  }
  .head-input-code-box{
    color: #56a8fe;
    font-size: 16px;
    line-height: 40px;
  }
  .upload-box{
    height: 183px;
    text-align: center;
  }
  .upload-btn-group{
    margin-bottom: 38px;
  }
  .upload-btn-group button{
    width: 187px;
    height: 40px;
    color: #fff;
    background: #55a7fd;
    border: 0;
  }
  .upload-btn-group span a {
    color: #55a7fd;
  }
  .upload-note-box{
    display: inline-block;
    color: #999;
    text-align: left;
  }
  .save-btn-bottom-box{
    background: #fff;
    height: 62px;
    box-shadow: 0px 0px 5px #ccc inset;
    text-align: center;
    padding-top: 15px;
    margin-top: 10px;
  }
  .save-btn-bottom-box button:first-child{
    color: #80befd;
    background: #fff;
  }
  .save-btn-bottom-box button:nth-child(2){
    margin: 0 140px;
    background: #26d185;
    color: #fff;
  }
  .save-btn-bottom-box button:last-child{
    color: #fff;
    background: #26d185;
  }
  .normalButton{
    width: 82px;
    height: 32px;
    border: 0;
    border-radius: 4px;
  }
  #optionBtn.showSetDataFormatBtn {
    background: #55a7fd;
    cursor: pointer;
  }
  .dataTypeFormatInputNumber{
    border: 1px solid #cacaca;
    line-height: 18px;
    width: 40px
  }
  .dataTypeFormatInputType{
    line-height: 18px;
    width: 20px;
    border-radius: 3px;
    border: 1px solid #cacaca;
  }
  i.iconfont{
    color: #36d593;
    margin-right: 6px;
    margin-left: 10px;
  }
  .main-content-box .container{
    padding: 0 14px;
  }
  .main-content-box{
    box-shadow: none;
    margin-top: 12px;
  }
  .container{
    width: 100%;
    padding: 0;
  }
  .clearFileX{
    cursor: pointer;
  }
  .errorMsg{
    font-size: 14px;
    color: #fa405c;
    margin-top: 10px;
    display: inline-block;
  }
  .checkSuccess{
    color: #21C838;
  }
  .checkFail{
    color: #e34b60;
  }
</style>
