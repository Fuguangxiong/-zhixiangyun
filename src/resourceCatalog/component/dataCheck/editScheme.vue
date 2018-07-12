<template>  
  <div class="resoubox">
    <div class="resou-con" >
      <div class="w1200 h100" >
        <div class="publicNav">
          <div class="breadCrumb">
            <i @click="goHome" class="iconfont icon-dingwei"></i>
            <router-link :to="{name:'dataCheckScheme'}">检测方案</router-link>
            <span class="active">编辑检测方案</span>
          </div>
          <!-- <button class="new_test">检测方案管理</button> -->
        </div>
        <div class="mode-div lanm-con" >

          <!-- 第一步 begin -->
          <div class="scheme_main" v-show="isShowFirstStep" >
            <div class="lanmpege">
              <div class="lanmp-con">
                <div class="lanbbag5">
                  <p style="width: 15%"></p>
                </div>
                <div class="lanbag-text1">
                  <span class="tim1">基本信息</span>
                  <span class="tim2">选择资源</span>
                  <span class="tim3">模型配置</span>
                  <span class="tim4">阈值设置</span>
                  <span class="tim5">配置完成</span>
                </div>
              </div>
            </div>
            <div class="scheme_center">
              <div class="test_scheme_name">
                <div class="scheme_title"><span class="red-star">*</span>检测方案名称</div>
                <input class="inp_tsn" type="text" v-model="dataCheckSpecs.name" 
                :class='{wrong:(dataCheckSpecs.name == "" && isFirstSubmit)||nameUnique === false}' @blur="checkName"/>
                <img src="../../../publicImages/loading_check.gif" class="loading-img" v-show="loadingImg"/>
              </div>
              <div class="plan_label">
                <div class="scheme_title"><span class="red-star">*</span>方案标签</div>
                <input class="inp_pl" type="text" :class='{wrong:labelStr == "" && isFirstSubmit}' v-model="labelStr" disabled/>
                <span class="xz_span_label" @click="dialogTagVisible=true">选择标签</span>
              </div>
              <div class="scheme_described clearfix">
                <div class="scheme_title">方案描述</div>
                <span class="spanClass">(50字以内)</span>
                <textarea class="texe_sd" name="description" v-model="dataCheckSpecs.description" placeholder="检测方案描述"></textarea>
                
              </div>
            </div>
            <div class="buttonBox">
              <!-- <button class="butonstdelet">上一步</button> -->
              <button class="btnGreen" @click="toSecondStep">下一步</button>
              <!-- <button class="butonst">暂缓</button> -->
            </div>
          </div>
          <LabelView :dialogTagVisible.sync="dialogTagVisible" :model="dataCheckSpecs" modelLabelKey="labels" :changeLabelCaller="saveDataCheckSpecs"/>

          <!-- 第一步 end -->
          <!-- 第二步 begin -->
          <div class="scheme_main" v-show="isShowSecondStep">
            <div class="lanmpege">
              <div class="lanmp-con">
                <div class="lanbbag5">
                  <p style="width:38%"></p>
                </div>
                <div class="lanbag-text1">
                  <span class="tim1">基本信息</span>
                  <span class="tim2">选择资源</span>
                  <span class="tim3">模型配置</span>
                  <span class="tim4">阈值设置</span>
                  <span class="tim5">配置完成</span>
                </div>
              </div>
            </div>
            <div class="scheme_center">
              <div class="detection_type">
                <div class="detection_title"><span class="red-star">*</span>检测类型</div>
                <div class="radic_xz">
                  <span class="radic_ico aclick">
                    <i></i>
                  </span>
                  <span class="rad_main">单一资源</span>
                </div>
                <div class="radic_xz radic_xz_marl">
                  <span class="radic_ico">
                    <i></i>
                  </span>
                  <span class="rad_main">类资源（标签）</span>
                </div>
              </div>
              <div class="detection_type">
                <div class="detection_title"><span class="red-star">*</span>资源位置</div>
                <div class="radic_xz">
                  <span class="radic_ico aclick">
                    <i></i>
                  </span>
                  <span class="rad_main">平台资源</span>
                </div>
                <div class="radic_xz radic_xz_marl">
                  <span class="radic_ico">
                    <i></i>
                  </span>
                  <span class="rad_main">本地数据库资源</span>
                </div>
              </div>
              <div class="detection_type_sele">
                <div class="detection_title"><span class="red-star">*</span>资源项</div>
                <el-select v-model="resourceName" disabled style="left:15px"></el-select>
              </div>
            </div>
            <div class="buttonBox">
              <button class="btnGreen btnSpace" @click="backToFirstStep">上一步</button>
              <button class="btnGreen" @click="toThirdStep">下一步</button>
              <!-- <button class="butonst">暂缓</button> -->
            </div>
          </div>
          <!-- 第二步 end -->

          <!-- 第三步 begin -->
          <div class="scheme_main" v-show="isShowThirdStep">
            <div class="lanmpege">
              <div class="lanmp-con">
                <div class="lanbbag5 ">
                  <p style="width:62%"></p>
                </div>
                <div class="lanbag-text1">
                  <span class="tim1">基本信息</span>
                  <span class="tim2">选择资源</span>
                  <span class="tim3">模型配置</span>
                  <span class="tim4">阈值设置</span>
                  <span class="tim5">配置完成</span>
                </div>
              </div>
            </div>
            <div class="scheme_center">
              <div class="model_selection clearfix">
                <div class="detection_title detection_titleone"><span class="red-star">*</span>指标选择</div>
                <div class="ms_main">
                  <table width="100%" class="ms_tab">
                    <thead>
                      <tr>
                        <td colspan="4" style="text-align:center">标准</td>
                        <td style="text-align:center" class="ms_bgcolor">检测资源</td>
                        <td></td>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th style="text-align:center">数据元</th>
                        <th style="text-align:center">数据类型</th>
                        <th style="text-align:center">表达格式</th>
                        <th style="text-align:center">数据项</th>
                        <th style="text-align:center" class="ms_bgcolor">检测对应字段</th>
                        <th style="text-align:center">操作</th>
                      </tr>
                      <tr v-for="(targetItem, index) in dataCheckSpecs.targetList" :key="index">
                        <td style="text-align:center" v-show="targetItem.metadata.name">{{targetItem.metadata.name}}</td>
                        <td style="text-align:center" v-show="!targetItem.metadata.name" class="m_color xz_data" @click="openMetadata(targetItem, index)">选择数据元</td>
                        <td style="text-align:center">{{targetItem.metadata.dataType}}</td>
                        <td style="text-align:center">{{targetItem.metadata.expressionFormat}}</td>
                        <td v-if="targetItem.metadata.metadataCodes.length === 0" style="text-align: center">-</td>
                        <td v-else style="text-align:center" class="m_color xz_data" @click="checkMetadataCodes(index)">{{targetItem.metadata.metadataCodes.length + '项'}}</td>
                        <td style="text-align: center" class="ms_bgcolor">
                          <select v-model="targetItem.targetName" @change="fieldHandleChange(targetItem, $event)" class="ms_select">
                            <option value="" disabled>请选择</option>
                            <option v-for="(item, index) in detectionField" :value="item.name" :key="index">
                              {{item.desc}}
                            </option>
                          </select>
                        </td>
                        <td @click="deleteIndex(index)" class="span_del_ms" style="text-align:center"><i class="iconfont icon-3"> </i></td>
                      </tr>
                    </tbody>
                  </table>
                  <button @click="addIndex" class="add_ms"><i></i>+ &nbsp添加检测指标</button>
                </div>
              </div>
            </div>
            <div class="buttonBox">
              <button class="btnGreen btnSpace" @click="backToSecondStep">上一步</button>
              <button class="btnGreen" @click="toFourthStep">下一步</button>
              <!-- <button class="butonst">暂缓</button> -->
            </div>

            <el-dialog title="选择数据元" :visible.sync="dialogTableVisible">
              <div class="sectioninput">
                <span >数据元名称</span>
                <input type="text" v-model="metadataName" @keyup.enter="selectMetadata" placeholder="请输入数据元名称" class="input_metadata"/>
                <button @click="selectMetadata" class="butonstT">搜索</button>
              </div>
              <br>
              <div class="sectioninput"> 
                <span>选择数据元</span>
                <el-select v-model="metadataValue" filterable placeholder="请选择" @change="handleChangeMetadata" style="left:10px">
                  <el-option
                    v-for="(item, index) in metadata"
                    :key="index"
                    :label="item.name"
                    :value="item.name">
                  </el-option>
                </el-select>
              </div>
              <div class="buttonBox">
                <button class="btnGray btnSpace"@click="dialogTableVisible = false">取 消</button>
                <button class="btnGreen" @click="saveMetadata">确 定</button>
              </div>  
              <!-- <div slot="footer" class="dialog-footer">
                <el-button @click="dialogTableVisible = false">取 消</el-button>
                <el-button @click="saveMetadata">确 定</el-button> 
              </div>   -->   
            </el-dialog>

            <!-- <el-dialog title="数据元代码" :visible.sync="codeDialogVisible">
              <div style=" overflow-y:auto; width:640px; height:400px;">
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
                    <tr v-for="(item, index) in metadataCodes" :key="item">
                      <td>{{index + 1}}</td>
                      <td>{{item.code}}</td>
                      <td>{{item.name}}</td>
                      <td>{{item.describe}}</td>
                    </tr> 
                  </tbody>    
                </table>
              </div>
            </el-dialog>     
                          -->
       <div class="element-detail">
         <el-dialog title="数据元代码" :visible.sync="codeDialogVisible" >
        <div style=" overflow-y:auto; width:640px; max-height:400px;">
          <div v-for="(item, index) in metadataCodes" :key="index" class="row element-row">
            <div class="col-xs-2">{{index + 1}}</div>
            <div class="col-xs-10 row">
              <div class="col-xs-4">代码：{{item.code}}</div>
              <div class="col-xs-8">名称：{{item.name}}</div>
              <div class="col-xs-12">说明：{{item.describe}}</div>
            </div>
          </div>
        </div>
      </el-dialog> 
          </div>
       
          </div>
          <!-- 第三步 end -->

          <!-- 第四步 begin -->
          <div class="scheme_main" v-show="isShowFourthStep">
            <div class="lanmpege">
              <div class="lanmp-con">
                  <div class="lanbbag5 ">
                    <p style="width:86%"></p>
                  </div>
                  <div class="lanbag-text1">
                    <span class="tim1">基本信息</span>
                    <span class="tim2">选择资源</span>
                    <span class="tim3">模型配置</span>
                    <span class="tim4">阈值设置</span>
                    <span class="tim5">配置完成</span>
                  </div>
              </div>
            </div>
            <div class="scheme_center">
              <div class="" style="font-size:12px"><span class="red-star">*</span>阈值参数设置&nbsp:</div>
              <div class="detection_type_sele">
                <div class="detection_title"><span class="red-star">*</span>阈值1：</div>
                <div class="threshold_main">
                  <div class="threshold_left">
                    <span class="span_tl">“完全可用”字段符合个数 >= </span>
                    <div class="tl_select">
                      <input type="text" v-model="dataCheckSpecs.fullyUsableThreshold.value" 
                      :class='{wrong:dataCheckSpecs.fullyUsableThreshold.value == "" && isFourthSubmit}' class="inp_tl"/>
                    </div>
                  </div>
                </div>
              </div>
              <div class="detection_type_sele">
                <div class="detection_title"><span class="red-star">*</span>阈值2：</div>
                <div class="threshold_main">
                  <div class="threshold_left">
                    <span class="span_tl">“一般可用”字段符合个数 >= </span>
                    <div class="tl_select">
                      <input type="text" v-model="dataCheckSpecs.barelyUsableThreshold.value" 
                      :class='{wrong:dataCheckSpecs.barelyUsableThreshold.value == "" && isFourthSubmit}' class="inp_tl"/>
                    </div>
                  </div>
                </div>
              </div>
              <div class="detection_type_sele">
                <div class="detection_title">阈值3：</div>
                <div class="threshold_main">
                  <div class="threshold_left">
                    <span class="span_tl">“不可用”字段符合个数 &nbsp;&nbsp;&nbsp;&nbsp;<&nbsp;&nbsp; </span>
                    <div class="tl_select">
                      <input type="text" v-model="dataCheckSpecs.barelyUsableThreshold.value" disabled class="inp_tl"/>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="buttonBox">
              
              <button class="btnGreen btnSpace" @click="backToThirdStep">上一步</button>
              <button class="btnGreen" @click="toFifthStep">下一步</button>
              <!-- <button class="butonst">暂缓</button> -->
            </div>
          </div>
          <!-- 第四步 end -->

          <!-- 第五步 begin -->
          <div class="scheme_main" v-show="isShowFifthStep">
            <div class="lanmpege">
              <div class="lanmp-con">
                <div class="lanbbag5 ">
                  <p style="width:100%"></p>
                </div>
                <div class="lanbag-text1">
                  <span class="tim1">基本信息</span>
                  <span class="tim2">选择资源</span>
                  <span class="tim3">模型配置</span>
                  <span class="tim4">阈值设置</span>
                  <span class="tim5">配置完成</span>
                </div>
              </div>
            </div>
            <div class="scheme_center">
              <div class="wanc">
                <span class="dui_h"></span>
                <i class="iconfont icon-shenqingguanli pictureone"></i>
                <span class="gongxi">恭喜您，您的检测方案已更新成功！</span>
              </div>
            </div>
            <div class="lastButtonBox">
              <!--<button class="butonstdelet">上一步</button>-->
              <button class="btnGreen" @click="finish" >完成</button>
              <!--<button class="butonst">暂缓</button>-->
            </div>
          </div
          <!-- 第五步 end -->
        </div>
      </div>
    </div>
  </div>        
</template>

<script>
import apiClient from '@/publicJs/ApiClient.js'
import _ from 'lodash'
import TipBoxService from '@/publicJs/TipBoxService'
import LabelView from '@/publicComponent/labelView'
import LoadingBoxService from '@/publicJs/LoadingBoxService.js'
export default {
  name: 'editScheme',
  components: {
    LabelView
  },
  mounted () {
    // this.dataCheckSpecs = this.$route.query.dataCheckSpecs
    this.labelStr = this.dataCheckSpecs.labels.join(',')
    this.checkedLabels = this.dataCheckSpecs.labels.slice(0)
    this.findResourcesById(this.dataCheckSpecs.resourceId)
    this.selectMetadata()
    this.nameStorage = this.$route.query.dataCheckSpecs.name
  },
  data () {
    return {
      dataCheckSpecs: this.$route.query.dataCheckSpecs,
      isShowFirstStep: true,
      isShowSecondStep: false,
      isShowThirdStep: false,
      isShowFourthStep: false,
      isShowFifthStep: false,
      isFirstSubmit: false,
      isSecondSubmit: false,
      isThirdSubmit: false,
      isFourthSubmit: false,
      dialogTagVisible: false, // 标签显隐
      checkedLabels: [],
      labelStr: '',

      // 第二步
      labels: [],
      resourceName: '',

      // 第三步
      targetList: {
        metadata: {metadataCodes: []},
        targetName: ''
      },
      newTargetList: {
        metadata: {}
      },
      dialogTableVisible: false, // 选择数据元弹窗
      codeDialogVisible: false, // 数据元项弹窗
      metadataName: '',
      metadata: [], // 选择数据元
      metadataValue: '',
      targetListIndex: 0,
      detectionField: [], // 检测对应字段字段
      metadataCodes: [],
      nameUnique: true,
      loadingImg: false,
      nameStorage: ''
    }
  },
  watch: {
    'dataCheckSpecs.labels' (value) {
      this.labelStr = value.join(',')
    }
  },
  methods: {
    goHome () {
      this.$router.push({name: 'Index'})
    },
    // 第一步
    toSecondStep () {
      if (this.nameUnique === false) {
        TipBoxService.open('方案名称校验未通过', 2)
        return
      }
      if (this.dataCheckSpecs.name === '' || this.labelStr === '') {
        this.isFirstSubmit = true
        TipBoxService.open('请填写必填项', 2)
        return
      }
      if (_.size(this.dataCheckSpecs.name) > 30) {
        TipBoxService.open('方案名称不能超出30个字符', 2)
        return
      }
      if (_.size(this.dataCheckSpecs.description) > 200) {
        TipBoxService.open('方案描述不能超过200个字符', 2)
        return
      }
      // console.log('新建方案第一步：', this.dataCheckSpecs)
      this.isShowFirstStep = false
      this.isShowSecondStep = true
      this.isShowThirdStep = false
      this.isShowFourthStep = false
      this.isShowFifthStep = false
    },
    // 第二步
    backToFirstStep () {
      this.isShowFirstStep = true
      this.isShowSecondStep = false
      this.isShowThirdStep = false
      this.isShowFourthStep = false
      this.isShowFifthStep = false
    },
    toThirdStep () {
      if (!this.dataCheckSpecs.resourceId) {
        TipBoxService.open('请选择资源项', 2)
        return
      }
      // ('新建方案第二步：', this.dataCheckSpecs)
      this.isShowFirstStep = false
      this.isShowSecondStep = false
      this.isShowThirdStep = true
      this.isShowFourthStep = false
      this.isShowFifthStep = false
    },
    findResourcesById (respurceId) {
      apiClient.get('/rcapi/findResourcesById', {resourceId: respurceId}).then(data => {
        this.resourceName = data.resource.resourcename
        let dbfields = []
        for (let i = 0; i < data.table.dbfield.length; i++) {
          if (data.table.dbfield[i].status === true) {
            dbfields.push(data.table.dbfield[i])
          }
        }
        this.detectionField = _.map(dbfields, function (v) {
          return {name: v.name, desc: v.desc || v.name}
        })
      }).catch(e => {})
    },

    // 第三步
    backToSecondStep () {
      this.isShowFirstStep = false
      this.isShowSecondStep = true
      this.isShowThirdStep = false
      this.isShowFourthStep = false
      this.isShowFifthStep = false
    },
    toFourthStep () {
      if (this.dataCheckSpecs.targetList.length === 0) {
        TipBoxService.open('请添加检测指标', 2)
        return
      }
      let metadataFlag = true
      let targetDescFlag = true
      let list = this.dataCheckSpecs.targetList
      let i
      for (i = 0; i < list.length; i++) {
        if (!list[i].metadata.name) {
          metadataFlag = false
          break
        }
        if (!list[i].targetDesc) {
          targetDescFlag = false
          break
        }
      }
      if (!metadataFlag) {
        TipBoxService.open('第' + (i + 1) + '条请选择数据元', 2)
        return
      }
      if (!targetDescFlag) {
        TipBoxService.open('第' + (i + 1) + '条请选择检测对应字段', 2)
        return
      }
      // console.log('新建方案第三步：', this.dataCheckSpecs)
      this.isShowFirstStep = false
      this.isShowSecondStep = false
      this.isShowThirdStep = false
      this.isShowFourthStep = true
      this.isShowFifthStep = false
    },
    addIndex () {
      this.targetList = {
        metadata: {metadataCodes: []},
        targetName: ''
      }
      this.dataCheckSpecs.targetList.push(this.targetList)
    },
    deleteIndex (index) {
      // 删一个数组元素
      this.dataCheckSpecs.targetList.splice(index, 1)
    },
    openMetadata (targetItem, index) {
      this.targetListIndex = index
      this.dialogTableVisible = true
      // console.log('第几项:   ', index)
    },
    selectMetadata () {
      LoadingBoxService.open('数据加载中...')
      apiClient.get('/rcapi/metadata/query', {
        pageNum: 1,
        pageSize: 1000,
        name: this.metadataName,
        approvalStatusList: 2,
        userFlag: '1'}).then(data => {
          // console.log('数据元：  ', data.dataList)
          LoadingBoxService.close()
          this.metadata = data.dataList
        }, error => {
          console.error(error)
          LoadingBoxService.close()
        })
    },
    handleChangeMetadata (data) {
        if (data) {
            // console.log('handleChangeMetadata  ', data)
            for (let i = 0; i < this.metadata.length; i++) {
                if (data === this.metadata[i].name) {
                    this.newTargetList.metadata = this.metadata[i]
                    this.newTargetList.metadataCodesLength = this.metadata[i].metadataCodes.length
                    return
                }
            }
            // this.newTargetList.metadata = data
            // this.newTargetList.metadataCodesLength = data.metadataCodes.length
        }
    },
    saveMetadata () {
      this.dataCheckSpecs.targetList[this.targetListIndex].metadata = this.newTargetList.metadata
      // 添加完newTargetList对象后，重置newTargetList对象
      this.newTargetList = {
        metadata: {}
      }
      // this.metadata = []
      this.metadataValue = ''
      this.dialogTableVisible = false
    },
    checkMetadataCodes (index) { // 查看数据数据元项
      this.codeDialogVisible = true
      this.metadataCodes = this.dataCheckSpecs.targetList[index].metadata.metadataCodes
    },
    fieldHandleChange (targetItem, event) {
      targetItem.targetName = event.target.value
      targetItem.targetDesc = event.target[event.target.selectedIndex].text
      // this.newTargetList.targetName = event.target.value
    },
    // 第四步
    backToThirdStep () {
      this.isShowFirstStep = false
      this.isShowSecondStep = false
      this.isShowThirdStep = true
      this.isShowFourthStep = false
      this.isShowFifthStep = false
    },
    toFifthStep () {
      let threshold1 = this.dataCheckSpecs.fullyUsableThreshold.value
      let threshold2 = this.dataCheckSpecs.barelyUsableThreshold.value
      if (threshold1 === '' || threshold2 === '') {
        this.isFourthSubmit = true
        TipBoxService.open('请填写必填项', 2)
        return
      }
      if (!this.isPositiveInteger(threshold1) || !this.isPositiveInteger(threshold2)) {
        TipBoxService.open('阈值请填写正整数', 2)
        return
      }
      if (parseInt(threshold1) > this.dataCheckSpecs.targetList.length) {
        TipBoxService.open('阈值1不能超过检测指标数量', 2)
        return
      }
      if (parseInt(threshold1) <= parseInt(threshold2)) {
        TipBoxService.open('阈值2必须小于阈值1', 2)
        return
      }
      // console.log('新建方案第四步：', this.dataCheckSpecs)
      this.saveDataCheckSpecs().then(data => {
        this.isShowFirstStep = false
        this.isShowSecondStep = false
        this.isShowThirdStep = false
        this.isShowFourthStep = false
        this.isShowFifthStep = true
      })
    },
    isPositiveInteger (s) { // 是否为正整数
      var re = /^[0-9]+$/
      return re.test(s)
    },
    saveDataCheckSpecs () {
      this.dataCheckSpecs.value2FullyUsableThreshold = this.dataCheckSpecs.fullyUsableThreshold.value
      this.dataCheckSpecs.value2BarelyUsableThreshold = this.dataCheckSpecs.barelyUsableThreshold.value
      delete this.dataCheckSpecs.fullyUsableThreshold.usableStatus
      delete this.dataCheckSpecs.barelyUsableThreshold.usableStatus
      delete this.dataCheckSpecs.unusableThreshold.usableStatus

      // console.log('保存方案：', this.dataCheckSpecs)
      return apiClient.post('/rcapi/dataCheckSpecs/update', this.dataCheckSpecs).then(data => {
        return data
      }).catch(e => {
        console.error(e)
      })
    },
    // 第五步
    finish () {
      this.$router.push({name: 'dataCheckScheme'})
    },
    checkName () {
      this.nameUnique = true
      if (this.dataCheckSpecs.name.trim() !== '' && this.dataCheckSpecs.name.trim() !== this.nameStorage) {
        this.loadingImg = true
        let name = this.dataCheckSpecs.name.trim()
        apiClient.get('rcapi/dataCheckSpecs/queryByName',
          { name: name}).then(data => {
            if (data.results === null) {
              TipBoxService.open('方案名称可用', 0)
              this.nameUnique = true
            } else {
              TipBoxService.open('方案名称重复', 2)
              this.nameUnique = false
            }
            this.loadingImg = false
          }, error => {
            if (error.response && error.response.status === 404) {
              TipBoxService.open('API不存在或无法访问', 2)
              this.nameUnique = false
            } else {
              TipBoxService.open('检索数据失败, 访问API服务异常', 2)
              this.nameUnique = false
            }
          })
      } else if (this.dataCheckSpecs.name.trim() === '') {
        TipBoxService.open('方案名称不能为空', 2)
        this.nameUnique = false
      }
    }
  }
}
</script>

<style scoped>
  .span_del_ms{
    font-size: 12px;
    
    cursor: pointer;
  }
  .span_del_ms i {
    color: #56A8FE;
  }
  .red-star {
    color: red;
    padding: 0px 5px 0px 5px;
    vertical-align: middle;
  }
  .wrong {
    border-color: #b61717;
  }
  .input_metadata{
    width: 200px;
    height: 36px;
    line-height: 35px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    border: 1px solid #dadada;
    border-radius: 2px;
    font-size: 14px;
    color: #666666;
    margin-left: 10px;
    padding: 0 10px;
  }
</style>
<style scoped>
  .loading-img{
    position: relative;
    top: 4px;
    left: 12px;
  }
  .resoubox {
    position: absolute;
    left: 15px !important;
    right: 15px;
    top: 0px;
    background-color: #fff;
    /* margin-top:15px;
    margin-left: 15px; */
    padding:0;
  }
  .hade{
    height: 30px;
    background: #eeeeee;
  }
  .hade-line{
    height: 125px;
    position: relative;
  }
  .logo{
    width: 279px;
    height: 103px;
    position: absolute;
    left:0;
    top:0;
  }
  .cred{
    color: #b61717;
  }
  .ouehide{
    overflow: hidden;
  }
  .crumbs{
    padding-left: 20px;
    margin-top: 20px;
    font-size: 14px;
  }
  .pormbutton button{
    margin: 0 2px;
  }
  input:disabled {
    background-color: #FFFFFF;
  }
  /*按钮*/
  .butonst{
    border-radius: 3px;
    border: 1px #b61717 solid;
    text-align: center;
    font-size: 12px;
    color: #b61717;
    line-height: 28px;
    cursor: pointer;
    padding: 0 12px;

  }
  .butonstdelet{
    border-radius: 3px;
    border: 1px #b2b2b2 solid;
    text-align: center;
    font-size: 12px;
    color: #fff;
    line-height: 28px;
    cursor: pointer;
    padding: 0 12px;
    background: #b2b2b2;
  }

  /*按钮绿*/
  .butonstred{
    border-radius: 3px;
    border: 1px #27D188 solid;
    text-align: center;
    font-size: 14px;
    background:#27D188 ;
    color: #fff;
    line-height: 28px;
    cursor: pointer;
    padding: 0 12px;
  }
  .butonst:hover{
    background:#b61717 ;
    color: #fff;
  }
  .butonst1{
    border-radius: 3px;
    border: 1px #1056bf solid;
    text-align: center;
    font-size: 14px;
    color: #1056bf;
    line-height: 28px;
    cursor: pointer;
    padding: 0 12px;

  }
  .butonst1:hover{
    background:#1056bf ;
    color: #fff;
  }
  /*表单文本*/
  .inputborder{
    border: 1px #dadada solid;
    border-radius: 3px;
    padding:8px 12px;
    font-size: 12px;
    margin: 0;
  }
  .inputborder:focus{
    border: 1px #b61717 solid;
  }
  .inputborder.w240{
    width:240px;
    color: #333;
  }
  .css-rinpu{
    display: none;
    position: absolute;
    top:-8px;
    margin-left: 4px;
  }
  .css-radio{
    position: relative;
    margin-right: 10px;
    cursor: pointer;

  }
  .css-radio.active .css-rinpu{
    display: inline-block;
  }
  .fleradio .css-radio{
    float: left;
  }
  .css-radio i{
    /* background: url(../../images/radio.png) no-repeat; */
    width: 12px;
    height: 12px;
    display: inline-block;
    vertical-align: middle;
    margin-right: 4px;
  }
  .css-radio.active i{
    background-position: 0 -13px;
  }
  .css-radio em{

    display: inline-block;
    vertical-align: middle;
  }
  .w1200{
    width: 100%;
    position: relative;
    margin: 0 auto;
    background-color: #F3F7FD;
    overflow-x: hidden;
  }
  /*.w1200menu::-webkit-scrollbar{
    display: none !important;
  }*/
  .matop{
    margin-top: 10px;
  }
  .styenone{
    border-bottom: 0!important;
  }
  .spanClass {
    position: relative;
    left: -82%;
    top: 28px;
    color:#CDCDCD;
    font-size:12px;
  }
  #logo{
    /* background: url(../images/logo.png) no-repeat; */
    width:223px;
    height: 70px;
    text-indent:-9999px;
    display: inline-block;
  }
  /*左右悬浮*/

  .pright{
    right: 50%;
    margin-right: 610px;
    top:200px;

  }

  .fiexe{
    width: 60px;
    position: fixed;
     -webkit-box-shadow: 0 0 3px 2px  #dedede;
     -moz-box-shadow: 0 0 3px 2px  #dedede;
    box-shadow: 0 0 3px 2px #dedede;
    z-index: 999;
    background: #fefefe;


  }

  .fiexe h2{
    border-bottom:1px #dcdcdc solid;
    line-height: 50px;
    text-align: center;
    margin: 0 4px;
    font-size: 14px;
  }
  .fiexe h3{

    line-height: 40px;
    text-align: center;
    margin: 0 4px;
    font-size: 14px;
    padding-top:10px;
  }
  .fiexe div .span{
    display: block;
    width: 24px;
    padding: 15px 14px;
    height: 30px;
    color: #666;
    margin: 0 4px;
    border-bottom:1px #dcdcdc solid;
  }
  .fiexe div i{
    display: none;
    width: 60px;
    height: 43px;
    cursor: pointer;
    text-align: center;
    padding-top: 18px;
    /* background: url(../../images/fixebg.jpg) no-repeat; */
  }
  .fiexe div:hover .span{
    display: none;
  }
  .fiexe div:hover i{
    display:block;
  }
  .pright div:hover .span{
    display: block;
  }
  .fiexe div{
    position: relative;
  }
  .fiexe div.wthse3 span{
    width: 36px;
    padding: 15px 8px;
    text-align: center;
  }
  .fiexe .fix-1{
    /* background: url(../../img/fix-1.png) no-repeat; */
    width: 27px;
    height: 25px;
    display: inline-block;
  }
  .fiexe .fix-2{
    /* background: url(../../img/fix-2.png) no-repeat; */
    width: 25px;
    height: 25px;
    display: inline-block;
  }
  .fiexe .fix-3{
    /* background: url(../../img/fix-3.png) no-repeat; */
    width: 25px;
    height: 25px;
    display: inline-block;
  }
  .fiexe .fixtop{
    /* background: url(../../img/upt.png) center top no-repeat; */
    display: block;
  }
  .soto{
    border-radius: 3px ;
    border: 1px #bfbfbf solid;
    /*background: url(../../img/fdj.png) 6px 8px no-repeat;*/
  }

  .soto:focus{
    border: 1px #b61717 solid;
  }
  .wmin{

    height: 30px;
    padding-left: 30px;
    color: #999;
    font-size: 12px;
  }
  /*ie多行省略号*/
  .tiebon{
    height: 48px;
    overflow: hidden;
    position: relative;
  }
  .tedian{
    position: absolute;
    right: 0;
    bottom: 0;
    display: none;
  }
  .foot{
    background: #eeeeee;
    height:28px;
  }

  .resou-con{
    position: relative;
  }
  .pleft{
    left: 50%;
    margin-left: 610px;
    bottom: 10%;
    width:44px;
  }
  .pleft div .span{
    display: block;
    width: 24px;
    padding: 5px 6px;
    height: 30px;
    color: #666;
    margin: 0 4px;
    border-bottom:1px #dcdcdc solid;
    text-align: center;
  }
  .pleft div i{
    display: none;
    width: 44px;
    height: 33px;
    cursor: pointer;
    text-align: center;
    padding-top: 8px;
  }

  .lanm-hed{
    height: 60px;
  }

  .lanm-span{
    padding-left: 13px;
    /*border-bottom: 1px solid #ccc;*/
    box-sizing: content-box;
    height: 38px;
    padding-top: 10px;
  }

  .lanm-span span{
    float: left;
    width: 88px;
    height: 38px;
    line-height: 38px;
    border: 1px #b71717 solid;
    border-radius: 3px 3px 0 0;
    background: #b71717;
    text-align: center;
    font-size: 12px;
    color: #ffffff;
    cursor: pointer;
    margin-top: 1px;
    margin-left: 1px;
    /* border-bottom: 1px #ccc solid; */
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
  }
  .lanm-span span.active{
    color: #b61717;
    /* border-top: 1px solid #b61717; */
    border-bottom: 1px solid #fff;
    background: #ffffff;
  }
  .lanm-span span:hover{
    color: #b61717;
    /* border-top: 1px solid #b61717; */
    border-bottom: 1px solid #fff;
    background: #ffffff;
  }
  /*一屏*/
  .scrol{
    height: 100%;
    box-sizing: border-box;
    padding-top: 100px;
    position: relative;
  }
  .scrol .hade{
    position: absolute;
    top:0;
    width:100%;
  }
  .scrol .hade2{
    position: absolute;
    top:30px;
    width:100%;
  }
  .ba-red{
    background-color: #b61717;
    height: 70px;
  }

  .scrol .resoubox{
    position: absolute;
    top:110px;
    bottom: 40px;
    width:100%;
  }
  .scrol .h100{
    height: 100%;
  }
  .scrol .resou-con{
    height: 100%;
  }
  /*.scrol .lanm-con{
    position: absolute;
    top:72px;
    bottom: 0;

    width:100%;
  }*/
  .scrol .foot{
    position: absolute;
    bottom: 0;
    width:100%;
  }
  /*高度auto*/
  .hauto .resou-con{
    margin: 10px 0;
  }
  .hauto .lanm-con-bo{
    margin-top: 10px;
    overflow: hidden;
  }

  /*分页*/
  div.zxf_pagediv{
    text-align: center;
    color: #999999;
    bottom: 10px;
    width: 100%;
    font-size: 12px;
  }
  div.zxf_pagediv a{
    text-decoration: none;

  }
  div.zxf_pagediv span,div.zxf_pagediv a{
    display: inline-block;
    box-sizing: border-box;
  }
  span.disabled{
    height: 22px;
    width: 65px;
    line-height: 22px;
    background: #f2f2f2;
    margin: 0 5px;
  }
  .zxfPagenum{
    color: #999999;
    background: #FFFFFF;
    width: 22px;
    height: 22px;
    line-height: 22px;
    border: 1px solid #dfdfdf;
    margin: 0 5px;
  }
  .nextbtn,.prebtn{
    color: #999999;
    background: #FFFFFF;
    width: 65px;
    height: 22px;
    line-height: 22px;
    border: 1px solid #dfdfdf;
  }
  .zxfinput{
    width: 35px;
    height: 22px;
    text-align: center;
    box-sizing: border-box;
    border: 1px solid #dfdfdf;
    margin: 0 12px;
  }
  .zxfokbtn{
    width: 45px;
    height: 22px;
    line-height: 22px;
    border: 1px solid #dfdfdf;
    cursor: pointer;
  }
  .nextpage{
    color: #d71f1b;
    margin: 0 5px;
    border: 1px solid #d71f1b;
  }
  .current{
    color: #ffffff;
    background: #d71f1b;
    border: none;
  }
  /*顶部状态条*/
  .tophade{
    padding-top: 6px;
  }

  .tophade .loade a{
    margin: 0 10px;
  }
  .tophade .xinx a{
    margin: 0 20px;
  }
  .topup{
    position: relative;
  }
  .topup h3{
    font-size: 12px;
  }
  .topup-con{
    position: absolute;
    z-index: 9;
     -webkit-box-shadow: 0 0 5px #dedede;
     -moz-box-shadow: 0 0 5px #dedede;
    box-shadow: 0 0 3px 2px #dedede;
    background: #fff;
    padding: 0 10px;
  }
  /*复选*/
  .chebox i{
    /* background: url(../../images/chebox.png) no-repeat; */
    width: 19px;
    height: 20px;
    display: inline-block;
  }
  .chebox.active i{
    /*background: url(../../img/rc/chebox.png) 0 -21px no-repeat;*/
    width: 19px;
    height: 19px;
    display: inline-block;
  }

  .table-css table{
    border-collapse:collapse;
    border-spacing:0;
  }
  .table-css table th{
    text-align: left;
    border-bottom: 1px #0066ca solid;
    line-height: 40px;
    height: 40px;
    font-weight: normal;
  }
  .table-css table td{
    line-height: 40px;
    height: 40px;
    color: #333;
  }
  .table-css table td .telic{
    padding-left: 10px;
  }
  .table-css table tr:hover td{
    background: #f0f0f0!important;
    color: #0066ca;
  }
  .table-css table tr td a{
    color: #333;
  }
  .table-css table tr:hover td a{
    color: #0066ca;
  }


  .icoup{
    position: relative;
    cursor: pointer;
  }
  .icoup i{
    /* background: url("../../images/jiantou.png") no-repeat; */
    width: 6px;
    display: inline-block;
    height: 13px;
    margin-left:4px;
    position: absolute;
    top:1px;
  }
  .icoup i.active{
    background-position: -6px 0;
  }
  .ellipsis{
    white-space:nowrap;
    overflow:hidden;
    text-overflow:ellipsis;
  }

  /* InspectionDetails*/
  .mode-div{
    margin-top: 15px !important;
    border-radius: 2px;
    background-color: #F3F7FD;
     -webkit-box-shadow: 0 0 5px #dedede;
     -moz-box-shadow: 0 0 5px #dedede;
    box-shadow: 0 0 3px 2px #dedede;
  }
  .lanm-ul{
    padding-top: 13px;
    padding-left: 13px;
  }
  .lanm-ul span{
    float: left;
    width:88px;
    height: 33px;
    line-height: 33px;
    border: 1px #b61717 solid;
    border-radius: 3px 3px 0 0;
    margin-left:1px;
    text-align: center;
    background: #b61717;
    color: #fff;
    border-bottom: 0;
    cursor: pointer;
  }
  .lanm-ul span.active{
    background: #fff;
    color: #b61717;
  }
  .lanm-hed{
    height: 60px;
  }




  .tree_main{
    width: 234px;
    float: left;
  }
  .results{
    margin:0 15px;
  }
  .results_top{
    margin-top: 10px;
    height: 30px;
  }
  .results_top button{
    width: 75px;
    height: 30px;
     -webkit-box-sizing: border-box;
     -moz-box-sizing: border-box;
    box-sizing: border-box;
    line-height: 28px;
    text-align: center;
    font-size: 14px;
    color: #b61717;
    border: 1px solid #b61717;
    border-radius: 2px;
    margin-left: 8px;
    cursor: pointer;
  }
  .results .results_main{
    width: 100%;
    height: auto;
    margin-top: 10px;
  }
  .chebox i{
    float: left;
    margin-left: 10px;
  }
  .table-css table tr td a.a_results{
    width: 120px;
    display:block;
    height: 40px;
    line-height: 40px;
  }
  span.offno,span.available_noavailable{
    display: inline-block;
    width: 75px;
    height: 27px;
    cursor: pointer;
    float: left;
  }
  span.offno i{
    display: inline-block;
    width: 75px;
    height: 27px;
    /*background: url("../../img/rc/no_off.png") no-repeat 0 -34px;*/
  }
  span.available_noavailable i{
    display: inline-block;
    width: 75px;
    height: 27px;
    /*background: url("../../img/rc/available_noavailable_ico.png") no-repeat 0 0;*/
  }
  span.offno.aclick i{
    display: inline-block;
    width: 75px;
    height: 27px;
    /*background: url("../../img/rc/no_off.png") no-repeat 0 0;*/
  }
  span.available_noavailable.aclick i{
    display: inline-block;
    width: 75px;
    height: 27px;
    /*background: url("../../img/rc/available_noavailable_ico.png") no-repeat 0 -34px;*/
  }
  .table-css table tr:hover{
    /*border: 1px solid #d7d7d7;*/
  }

  .detection_task_main{
    position: relative;
     -webkit-box-sizing: border-box;
     -moz-box-sizing: border-box;
    box-sizing: border-box;
    padding: 0 15px;
  }
  span.termination{
    display: inline-block;
    width:auto;
    height: 30px;
    float: left;
  }
  span.termination i{
    display: inline-block;
    width: 22px;
    height: 26px;
    /*background: url("../../img/rc/jz_ico.png") no-repeat;*/
  }
  span.jcz_color{
    color: #333333;
  }
  .ywc_color{
    color: #0d9b06;
  }
  span.yzz_color{
    color: #b61717;
  }
  span.termination em{
    display: inline-block;
    width: 65px;
    height: 30px;
    /*background: url("../../img/rc/zhongz_ico.png") no-repeat;*/
  }
  span.view{
    display: inline-block;
    width:auto;
    height: 30px;
    float: left;
  }
  span.view i{
    display: inline-block;
    width: 22px;
    height: 30px;
    /*background: url("../../img/rc/look_ico.png") no-repeat;*/
  }
  span.view em{
    display: inline-block;
    width: 80px;
    height: 30px;
    /*background: url("../../img/rc/bg_ico.png") no-repeat;*/
  }

  .select_sc{
    width: auto;
    height: 25px;
    line-height: 25px;
     -webkit-box-sizing: border-box;
     -moz-box-sizing: border-box;
    box-sizing: border-box;
    padding-left: 10px;
    border: none;
  }
  span.edit{
    display: inline-block;
    width: 18px;
    height: 18px;
    cursor: pointer;
    float: left;
    margin-left: 30px;
  }
  span.edit i{
    display: inline-block;
    width: 18px;
    height: 18px;
    cursor: pointer;
    /*background: url("../../img/rc/ico-fw1.png") no-repeat;*/
  }


  .resources_detail{
    width: 100%;
    position: relative;
     -webkit-box-sizing: border-box;
     -moz-box-sizing: border-box;
    box-sizing: border-box;
    padding: 0 15px 40px;
  }
  .resources_detail_top{
    width: 100%;
    height: 60px;
    line-height: 60px;
    text-align: center;
    font-size: 18px;
    color: #b61717;
    font-weight: bold;
  }
  .new_test{
    width: auto;
    height: 30px;
    line-height: 30px;
    border-radius: 4px;
    font-size: 14px;
    color: #ffffff;
    background: #b61717;
    padding: 0 10px;
    float: right;
    margin-top: -23px;
    margin-right: 20px;
    cursor: pointer;
  }
  .resources_detail_main{
    width: 100%;
    height: auto;
    overflow-x: auto;
    margin-bottom: 20px;
  }
  .tab_rdm{
    height: auto;
    border-collapse: collapse;
    border-spacing: 0;
    margin-bottom: 20px;
    font-size: 14px;
    color: #333333;
  }
  .tab_rdm tr th{
    text-align: left;
    height: 52px;
    line-height: 52px;
    border: 1px solid #d4d4d4;
    background: #e1e1e1;
  }
  .tab_rdm tr th.rd_tab_center{
    text-align: center;
  }
  .tab_rdm tr td.rd_tab_center{
    text-align: center;
  }
  .tab_rdm tr td{
    height: 52px;
    line-height: 52px;
    border: 1px solid #d4d4d4;
  }
  .resources_detail_main table tr td a.a_results{
    width: 120px;
    display:block;
    height: 40px;
    line-height: 40px;
  }
  .resources_detail_main table tr td a.a_resources{
    width: 120px;
    display:block;
    height: 40px;
    line-height: 40px;
  }
  em.em_fou{
    font-size: 14px;
    color: #cc0000;
  }


  .lanm-con{
    margin-top: 10px;
  }

  .scheme_main{
    width: 100%;
    height: auto;
    position: relative;
    background-color:white ;
    padding-bottom: 90px;
    overflow-y: scroll;
  }
  .scheme_main::-webkit-scrollbar {
    display: none;
  }
  .lanmpege {
    background: white;
    height: 120px;
    width: 100%;
    border-bottom: 1px solid #E6E6E6;
  }
  .lanmp-con {
    width: 960px;
    margin: 0 auto;
    padding-top: 30px;
  }
  .lanbbag5 {
    
    background-image: url("../../../publicImages/apinu5.png");
    width: 914px;
    height: 38px;
    background-size: cover;
  }
  .lanbbag5 p {
    
    background-image: url("../../../publicImages/apinun5.png");
    width: 914px;
    height: 38.5px;
    background-size: cover
  }
  .lanbag-text1 {
    width: 992px;
    margin-top: 5px;
  }
  .lanbag-text1 span {
    font-size: 14px;
    display: inline-block;
  }
  .lanbag-text1 span.tim2 {
    margin-left: 155px;
  }
  .lanbag-text1 span.tim3 {
    margin-left: 158px;
  }
  .lanbag-text1 span.tim4 {
    margin-left: 158px;
  }
  .lanbag-text1 span.tim5 {
    margin-left: 155px;
  }
  .scheme_center{
    width: 700px;
    height: auto;
    margin: 40px auto 0;
  }
  .buttonBox {
    margin-top: 40px;
    text-align: center;
  }
  .lastButtonBox{
    margin-top: 140px;
    text-align: center;
  }
  .test_scheme_name,.plan_label{
    width: 100%;
    height: 35px;
    margin-bottom: 10px;
  }
  .scheme_title{
    width: 105px;
    height: 29px;
    line-height: 29px;
    text-align: right;
    font-size: 12px;
    color: #333333;
    float: left;
  }
  .inp_tsn{
    width: 507px;
    height: 29px;
    line-height: 29px;
     -webkit-box-sizing: border-box;
     -moz-box-sizing: border-box;
    box-sizing: border-box;
    border: 1px solid #dadada;
    border-radius: 4px;
    font-size: 12px;
    color: #666666;
    float: left;
    margin-left: 10px;
    padding:0 10px;
  }
  .inp_pl{
    width: 507px;
    height: 29px;
    line-height: 29px;
     -webkit-box-sizing: border-box;
     -moz-box-sizing: border-box;
    box-sizing: border-box;
    border: 1px solid #dadada;
    border-radius: 4px;
    font-size: 12px;
    color: #666666;
    float: left;
    margin-left: 10px;
    padding:0 10px;
  }
  span.xz_span_label{
    display: inline-block;
    width: 54px;
    height: 22px;
    line-height: 27px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    text-align: center;
    font-size: 12px;
    color: #5CA6FF;
    float: left;
    margin-left: 13px;
    border-bottom: 1px solid #5CA6FF;
    cursor: pointer;
  }
  .scheme_described{
    width: 100%;
    height:auto;
    margin-bottom: 10px;
  }
  textarea.texe_sd{
    width: 507px;
    height: 129px;
     -webkit-box-sizing: border-box;
     -moz-box-sizing: border-box;
    box-sizing: border-box;
    border: 1px solid #dadada;
    border-radius: 4px;
    font-size: 12px;
    color: #666666;
    float: left;
    margin-left: 10px;
    padding:5px 10px;
  }
 
  .detection_type{
    width: 100%;
    height: 25px;
    line-height: 25px;
    margin-bottom: 10px;
    padding-left:23%;
  }
  .detection_title{
    width: 80px;
    height: 25px;
    line-height: 25px;
    font-size: 12px;
    color: #333333;
    float: left;
    text-align: right;
  }
  .detection_titleone {
    float:none;
    height:33px;
    transform: translate(-76%);
  }

  .radic_xz{
    width: auto;
    float: left;
    height: 25px;
    line-height: 25px;
    margin-left: 24px;
  }
  .radic_ico{
    display: inline-block;
    width: 12px;
    height: 12px;
    float: left;
    margin-top: 7px;
  }
  .radic_ico i{
    display: inline-block;
    width: 12px;
    height: 12px;
    background: url("../../../publicImages/radio.png") no-repeat;
    float: left;
  }
  .radic_ico.aclick i{
    background:url("../../../publicImages/radio.png") no-repeat 0 -13px;
  }
  .rad_main{
    display: inline-block;
    width: auto;
    float: left;
    height: 25px;
    line-height: 25px;
    font-size: 12px;
    color: #333333;
    margin-left: 5px;
  }
  .radic_xz_marl{
    margin-left: 25px;
  }
  .select_dt{
    margin-left: 15px;
    width: 360px;
    height: 35px;
     -webkit-box-sizing: border-box;
     -moz-box-sizing: border-box;
    box-sizing: border-box;
    line-height: 35px;
    border: 1px solid #dadada;
    border-radius: 4px;
    padding-left: 10px;
    float: left;
  }
  select.select_dt_two{
    margin-left: 15px;
    width: 285px;
    height: 35px;
     -webkit-box-sizing: border-box;
     -moz-box-sizing: border-box;
    box-sizing: border-box;
    line-height: 35px;
    border: 1px solid #dadada;
    border-radius: 4px;
    padding-left: 10px;
    float: left;
  }
  input.inp_dt{
    margin-left: 15px;
    width: 285px;
    height: 35px;
     -webkit-box-sizing: border-box;
     -moz-box-sizing: border-box;
    box-sizing: border-box;
    line-height: 35px;
    border: 1px solid #dadada;
    border-radius: 4px;
    padding:0 10px;
    float: left;
  }
  .detection_type_sele{
    width: 100%;
    height: 35px;
    line-height: 35px;
    margin-bottom: 10px;
    padding-left:23%
  }
  .detection_type_sele .detection_title{
    height: 35px;
    line-height: 35px;
  }
  a.a_dt{
    width: auto;
    float: left;
    margin-left: 10px;
    text-decoration: underline;
    font-size: 14px;
    color: #1056bf;
  }
  div.detection_title_tm{
    width: 125px;
  }
  .model_selection{
    width: 100%;
    height: auto;
    margin-bottom: 10px;
  }
  .select_box{
    margin-left: 15px;
    width: 360px;
    height: 35px;
     -webkit-box-sizing: border-box;
     -moz-box-sizing: border-box;
    box-sizing: border-box;
    line-height: 35px;
    /*border: 1px solid #dadada;
    border-radius: 4px;*/
    /*padding-left: 10px;*/
    float: left;
    position: relative;
  }
  .select_main_c{
    width: 360px;
    height: 35px;
     -webkit-box-sizing: border-box;
     -moz-box-sizing: border-box;
    box-sizing: border-box;
    line-height: 35px;
    border: 1px solid #dadada;
    border-radius: 4px;
  }
  .option_ul_main{
     -webkit-box-sizing: border-box;
     -moz-box-sizing: border-box;
    box-sizing: border-box;
    width: 100%;
    height: 200px;
    border: 1px solid #1056bf;
    border-radius: 4px;
    position: absolute;
    top: 36px;
    left: 0;
    background: #ffffff;
    overflow-y: auto;
    overflow-x: hidden;
  }
  .text_cf_main{
    width: 335px;
    height: 33px;
    line-height: 33px;
     -webkit-box-sizing: border-box;
     -moz-box-sizing: border-box;
    box-sizing: border-box;
    padding: 0 10px;
    float: left;
  }
  .option_ul_main ul.ztree{
    width: 358px;
    padding: 0;

  }
  .option_ul_main ul.ztree li a{
    width: 355px;
    border-bottom: 1px solid #d7d7d7;
  }
  .option_ul_main ul.ztree li a.level0{
    background-color: #1056bf;
  }
  .option_ul_main ul.ztree li a.curSelectedNode{
    color: #1056bf;
  }
  .option_ul_main ul.ztree li span.button.switch.level1 {
    width: 20px;
    height: 20px;
    float: right;
    margin-top: 5px;
  }
  .option_ul_main ul.ztree li span.button{
    /*background-image: url("../../img/rc/left_menuForOutLook.gif");*/
  }
  .option_ul_main ul.ztree li span.button {
    margin-top: -2px;
  }
  .option_ul_main ul.ztree li span.button.noline_docu{
    background: none;
  }
  .option_ul_main ul.ztree li span.button.noline_open.level0{
    margin-top: 5px;
  }
  .option_ul_main ul.ztree li span.button.noline_close.level0{
    margin-top: 5px;
  }
  .option_ul_main ul.ztree li.level1 span{
    margin-left: 15px;
  }
  .option_ul_main ul.ztree li.level2 span{
    margin-left: 7px;
  }

  
  .ms_main{
    width: 565px;
    height: auto;
    float: left;
    margin-left: 30px;
    position: relative;
  }
  table.ms_tab{
    border-collapse: collapse;
    border-spacing: 0;
    border: 1px solid #dadada;
    border-radius: 4px;
    font-size: 12px;
    color: #626262;
    width:600px;
  }
  table.ms_tab tr th{
    border: 1px solid #dadada;
    height: 36px;
    line-height: 36px;
    text-align: left;
  }
  table.ms_tab tr td{
    border: 1px solid #dadada;
    height: 30px;
    line-height: 30px;
  }
  table.ms_tab tbody tr th{
    font-weight:normal;
  }
  table.ms_tab thead tr td {
    font-weight:bold;
    color:#000000;
  }
  select.ms_select{
    width: 110px;
    height: 25px;
    border: none;
    background: none;
    color: #626262;
  }
  table.ms_tab tr td.m_color{
    color: #56A8FE;
  }
  .add_ms{
    width:600px;
    height: 31px;
    background-color:#27D188;
    line-height: 25px;
    font-size: 14px;
    color: #ffffff;
    cursor: pointer;
    border:1px solid #27D188;
    outline-style:none;
    border-radius:4px;
  }
  .sectioninput{
    padding-left: 150px;
  }
  .add_ms i{
    display: inline-block;
    width: 16px;
    height: 16px;
    /*background: url("../../img/rc/add_ico.png") no-repeat;*/
    float: left;
    margin-top: 4px;
    margin-right: 5px;
  }
  table.ms_tab tr.blue_bor{
    border: 2px solid #1056bf;
  }
  table.ms_tab tr.blue_bor td{
    border-right: 1px solid #dadada;
    border-left:0;
    border-top: 0;
    border-bottom: 0;
  }
  table.ms_tab tr td.ms_bgcolor,table.ms_tab tr th.ms_bgcolor{
    color: #F50010;
  }

  span.span_del_ms{
    display: inline-block;
    width: auto;
    height: 30px;
    line-height: 30px;
    position: absolute;
    right: -35px;
    bottom: 43px;
    font-size: 14px;
    color: #b61717;
    cursor: pointer;
  }
  .xz_data{
    cursor: pointer;
    text-decoration:underline;
    color:#83C1FC;
  }
  
  .threshold_main{
    width: auto;
    float: left;
    height: 35px;
    line-height: 35px;
  }
  .threshold_left{
    float: left;
    height: 35px;
    line-height: 35px;
  }
  .span_tl{
    display: inline-block;
    width: auto;
    float: left;
    height: 35px;
    line-height: 35px;
    font-size: 12px;
    color: #666666;
    margin-right: 6px;
  }
  .tl_select{
    width: auto;
    height: 30px;
    float: left;
  }
  .tl_select_main{
    width: 88px;
    height: 30px;
    float: left;
    position: relative;
    margin-top: 2px;
  }
  .select_tl{
    width: 88px;
    height: 30px;
     -webkit-box-sizing: border-box;
     -moz-box-sizing: border-box;
    box-sizing: border-box;
    border: 1px solid #d5d5d5;
    border-radius: 4px;
  }
  i.i_xico{
    display: inline-block;
    width: 16px;
    height: 10px;
    float: right;
    /*background: url("../../img/rc/select_xlico.png") no-repeat;*/
    margin-top: 10px;
    margin-right: 5px;
    cursor: pointer;
  }
  .option_m{
    width: 100%;
    height: auto;
    border: 1px solid #1056bf;
    position: absolute;
    top: 30px;
    left: 0;
     -webkit-box-sizing: border-box;
     -moz-box-sizing: border-box;
    box-sizing: border-box;
    border-radius: 4px;
    background: #ffffff;
    display: none;
  }
  .option_m>div{
     -webkit-box-sizing: border-box;
     -moz-box-sizing: border-box;
    box-sizing: border-box;
    width: 100%;
    border-bottom: 1px solid #dbdbdb;
    text-align: center;
    font-size: 14px;
    color: #999999;
    cursor: pointer;
  }
  div.op_bgcolor{
    background: #1056bf;
    color: #ffffff;
  }
  .inp_tl{
    float: left;
    width: 88px;
    height: 30px;
     -webkit-box-sizing: border-box;
     -moz-box-sizing: border-box;
    box-sizing: border-box;
    border: 1px solid #d5d5d5;
    border-radius: 4px;
    margin-top: 2px;
    margin-left: 5px;
    padding: 0 5px;
  }
  span.ji_span{
    display: inline-block;
    float: left;
    margin-left: 15px;
    line-height: 35px;
    font-size: 14px;
    color: #000000;
    margin-right: 5px;
  }
  div.jiselect{
    width: 115px;
    height: 30px;
    float: left;
    position: relative;
  }
  .jiselect_main{
    width: 115px;
    height: 30px;
     -webkit-box-sizing: border-box;
     -moz-box-sizing: border-box;
    box-sizing: border-box;
    border: 1px solid #cfcfcf;
    border-radius: 4px;
    margin-top: 2px;
  }
  div.tl_box_text{
    width: 63px;
    height: 28px;
    line-height: 28px;
    float: left;
  }
  div.box_text{
    width: 90px;
    height: 28px;
    line-height: 28px;
    float: left;
  }
  .jia_h{
    float: left;
    width: 27px;
    height: 27px;
    /*background: url("../../img/rc/jia_ico.png") no-repeat;*/
    cursor: pointer;
    margin-left: 10px;
    margin-top: 4px;
  }

 
  .wanc{
    width: 410px;
    height: 70px;
    margin: 0 auto;
  }
  span.dui_h{
    display: inline-block;
    float: left;
    width: 70px;
    height: 70px;
    margin-left: 150px;
    /*background: url("../../img/rc/dui.png") no-repeat;*/
  }
  span.gongxi{
    width: auto;
    float: left;
    height: 70px;
    line-height: 70px;
    margin-left:25px;
    font-size: 24px;
    color: #2c9801;
  }

  
  .btn_cj,.btn_xbsj,.btn_sds,.btn_xbsj_wu,.btn_rwcj{
    height: 30px;
    line-height: 30px;
    width: auto;
    padding: 0 15px;
    background-color: #b61717;
    font-size: 14px;
    color: #ffffff;
    border-radius: 4px;
    cursor: pointer;
  }
  .mask_bg{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #000000;
    opacity: 0.5;
    display: none;
  }
  .select_service_type{
    width: 535px;
    height: 350px;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -175px;
    margin-left: -265px;
    background: #ffffff;
    border-radius: 4px;
    display: none;
  }
  .select_service_type_top{
    width: 100%;
    height: 46px;
    background: #b61717;
    border-radius: 4px 4px 0 0;
  }
  span.sst_text{
    display: inline-block;
    width: auto;
    height: 46px;
    line-height: 46px;
    float: left;
    margin-left: 20px;
    font-size: 14px;
    color: #ffffff;
  }
  span.sst_ico{
    display: inline-block;
    float: right;
    width: 18px;
    height: 18px;
    /*background: url("../../img/rc/gb_ico.png") no-repeat;*/
    margin-right: 15px;
    margin-top: 12px;
    cursor: pointer;
  }
  .select_service_type_main{
    width: 100%;
    height: 160px;
     -webkit-box-sizing: border-box;
     -moz-box-sizing: border-box;
    box-sizing: border-box;
    padding: 0 70px;
    margin-top: 35px;
  }
  .sstm_left,.sstm_right{
    width: 190px;
    height: 155px;
    float: left;
    border-right: 1px dashed #dbdbdb;
     -webkit-box-sizing: border-box;
     -moz-box-sizing: border-box;
    box-sizing: border-box;
    padding: 12px;
  }
  .sstm_right{
    border-right:none;
  }
  .sstml_main,.sstmr_main{
    width: 130px;
    height: 130px;
    margin:0 auto;
    border-radius: 2px;
     -webkit-box-sizing: border-box;
     -moz-box-sizing: border-box;
    box-sizing: border-box;
    padding-top: 12px;
  }
  .aclickse{
    width: 129px;
    height: 129px;
    border: 1px solid #228dd8;
    margin-top: -1px;
  }
  .cj_new_ico{
    display: block;
    width: 78px;
    height: 78px;
    margin:0 auto;
    /*background: url("../../img/rc/cj_new_ico.png") no-repeat;*/
  }
  .fw_zh_ico{
    display: block;
    width: 78px;
    height: 78px;
    margin:0 auto;
    /*background: url("../../img/rc/sz_ico.png") no-repeat;*/
  }
  .sstml_main p,.sstmr_main p{
    text-align: center;
    font-size: 14px;
    color: #333333;
  }
  .button_box{
    text-align:center;
    width: 100%;
    height: 30px;
    margin-top: 50px;
  }
  .button_box button{
    margin-right: 20px;
    border: 0;
    background: 0;
    height: 30px;
    line-height: 29px;
    cursor: pointer;
    color: #ffffff;
    font-size: 14px;
  }
  .button_box .quxiao{
    background:#b5b5b5;
    border-radius: 4px;
    padding: 0 20px;
  }
  .button_box .queding{
    background:#b61717;
    border-radius: 4px;
    padding: 0 20px;
  }
  
  .gender_data_item{
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -214px;
    margin-left: -325px;
    width: 650px;
    height: 428px;
    background-color: #ffffff;
    border-radius: 4px;
    box-shadow: 0px 2px 8px #333333;
    display: none;
  }
  .gdi_top{
    width: 100%;
    height: 46px;
    background-color: #b61717;
    border-radius: 4px 4px 0 0;
  }
  .gdi_main{
     -webkit-box-sizing: border-box;
     -moz-box-sizing: border-box;
    box-sizing: border-box;
    padding: 0 10px;
    width: 98%;
    height: 350px;
    margin: 20px auto 10px;
    overflow-y: auto;
  }
  table.gdi_tab{
    margin: 0 auto;
    border-collapse: collapse;
    border-spacing: 0;
  }
  .gdi_main .gdi_tab tr th,.gdi_main .gdi_tab tr td{
    height: 36px;
    line-height: 36px;
    border: 1px solid #bcbcbc;
    font-size: 14px;
    color: #666666;
    text-align: center;
  }
  
  .select_data_source{
    width: 490px;
    height: 320px;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -160px;
    margin-left: -245px;
    background-color: #ffffff;
    border-radius: 4px;
    box-shadow: 0px 2px 8px #333333;
    display: none;
  }
  .select_data_source_top{
    width: 100%;
    height: 42px;
    background-color: #b61717;
    border-radius: 4px 4px 0 0;
  }
  .select_data_source_main{
    width: 100%;
    height: 160px;
     -webkit-box-sizing: border-box;
     -moz-box-sizing: border-box;
    box-sizing: border-box;
    padding: 0 70px;
    margin-top: 40px;
  }
  .sdsm_resources{
    width: 100%;
    height: auto;
  }
  .span_resources{
    display: block;
    width: auto;
    height: 26px;
    line-height: 26px;
    float: left;
    font-size: 14px;
    color: #333333;
    margin-right: 10px;
  }
  .select_sdsmr_box{
    width:205px;
    height: 26px;
     -webkit-box-sizing: border-box;
     -moz-box-sizing: border-box;
    box-sizing: border-box;
    line-height: 26px;
    position: relative;
    float: left;
  }
  .select_sdsmr_main{
    width: 100%;
    height: 26px;
    line-height: 26px;
     -webkit-box-sizing: border-box;
     -moz-box-sizing: border-box;
    box-sizing: border-box;
     -webkit-border-radius: 4px;
     -moz-border-radius: 4px;
    border-radius: 4px;
    border: 1px solid #acabab;
  }
  .ssm_cf{
    width: 180px;
    height: 24px;
    line-height: 24px;
     -webkit-box-sizing: border-box;
     -moz-box-sizing: border-box;
    box-sizing: border-box;
    padding: 0 10px;
    float: left;
  }
  .select_sdsmr_main i.i_xico{
    margin-top: 7px;
  }
  .select_sdsmr_main.aclickm i.i_xico{
    margin-top: 7px;
    /*background: url("../../img/rc/blue_ico.png") no-repeat;*/
  }
  .select_sdsmr_moption{
    width: 100%;
    height: 120px;
     -webkit-box-sizing: border-box;
     -moz-box-sizing: border-box;
    box-sizing: border-box;
    border: 1px solid #1056bf;
    border-radius: 4px;
    position: absolute;
    top: 26px;
    left: 0;
    background: #ffffff;
    overflow-y: auto;
    overflow-x: hidden;
  }

  .select_sdsmr_moption ul.ztree{
    width: 203px;
    padding: 0;

  }
  .select_sdsmr_moption ul.ztree li a{
    width: 200px;
    border-bottom: 1px solid #d7d7d7;
  }
  .select_sdsmr_moption ul.ztree li a.level0{
    background-color: #1056bf;
  }
  .select_sdsmr_moption ul.ztree li a.curSelectedNode{
    color: #1056bf;
  }
  .select_sdsmr_moption ul.ztree li span.button.switch.level1 {
    width: 20px;
    height: 20px;
    float: right;
    margin-top: 5px;
  }
  .select_sdsmr_moption ul.ztree li span.button{
    /*background-image: url("../../img/rc/left_menuForOutLook.gif");*/
  }
  .select_sdsmr_moption ul.ztree li span.button {
    margin-top: -2px;
  }
  .select_sdsmr_moption ul.ztree li span.button.noline_docu{
    background: none;
  }
  .select_sdsmr_moption ul.ztree li span.button.noline_open.level0{
    margin-top: 5px;
  }
  .select_sdsmr_moption ul.ztree li span.button.noline_close.level0{
    margin-top: 5px;
  }
  .select_sdsmr_moption ul.ztree li.level1 span{
    margin-left: 15px;
  }
  .select_sdsmr_moption ul.ztree li.level2 span{
    margin-left: 7px;
  }
  a.go_register{
    display: block;
    width: auto;
    line-height: 26px;
    float: left;
    font-size: 14px;
    color: #1056bf;
    margin-left: 8px;
  }
  .quque_btn{
    width: 100%;
    height: 30px;
    text-align: center;
    margin-top: 20px;
  }
  .quque_btn button{
    width: 80px;
    height: 30px;
    line-height: 30px;
    font-size: 14px;
    color: #ffffff;
    border-radius: 4px;
    cursor: pointer;
  }
  .btn_qx{
    background: #b5b5b5;
  }
  .btn_qd{
    background: #b61717;
  }
  
  .name_data_item{
    width: 440px;
    height: 260px;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top:-130px;
    margin-left: -220px;
    background: #ffffff;
    border-radius: 4px;
    box-shadow: 0px 2px 8px #333333;
    display: none;
  }
  .name_data_item_top{
    width: 100%;
    height: 42px;
    background: #b61717;
    border-radius: 4px 4px 0 0;
  }
  .name_data_item_main{
    width: 78%;
    height: 200px;
    line-height: 200px;
    font-size: 14px;
    color: #333333;
    text-align: center;
  }
  /*���񴴽�*/
  .task_creation{
    width: 490px;
    height: 380px;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -190px;
    margin-left: -245px;
    background: #ffffff;
    border-radius: 4px;
    box-shadow: 0px 2px 8px #333333;
    display: none;
  }
  .task_creation_top{
    width: 100%;
    height: 42px;
    background: #b61717;
    border-radius: 4px 4px 0 0;
  }
  .task_creation_main{
    width: 100%;
    height: auto;
     -webkit-box-sizing: border-box;
     -moz-box-sizing: border-box;
    box-sizing: border-box;
    padding: 20px 40px;
  }
  .tcm_box{
    width: 100%;
    height: 30px;
    line-height: 30px;
    margin-bottom: 10px;
  }
  .tcm_title{
    display: block;
    float: left;
    width: 90px;
    height: 30px;
    line-height: 30px;
    text-align: right;
    margin-right: 15px;
    font-size: 14px;
    color: #333333;
  }
  .inp_tcmname{
    width: 205px;
    height: 30px;
    line-height: 30px;
    float: left;
    border: 1px solid #b8b8b8;
    border-radius: 4px;
     -webkit-box-sizing: border-box;
     -moz-box-sizing: border-box;
    box-sizing: border-box;
    padding: 0 10px;
    margin-bottom: 7px;
  }
  .testing_data{
    width: 205px;
    height: 30px;
    line-height: 30px;
    float: left;
    position: relative;
  }
  .testingd_select{
    width: 205px;
    height: 30px;
    line-height: 30px;
     -webkit-box-sizing: border-box;
     -moz-box-sizing: border-box;
    box-sizing: border-box;
    border: 1px solid #b8b8b8;
    border-radius: 4px;
  }
  .ts_box{
    width: 180px;
    height: 28px;
    line-height: 28px;
    font-size: 14px;
    color: #333333;
     -webkit-box-sizing: border-box;
     -moz-box-sizing: border-box;
    box-sizing: border-box;
    padding: 0 10px;
    float: left;
  }
  .ts_option{
    width: 100%;
    height: 120px;
    overflow-y: auto;
     -webkit-box-sizing: border-box;
     -moz-box-sizing: border-box;
    box-sizing: border-box;
    border: 1px solid #1056bf;
    border-radius: 4px;
    position: absolute;
    top: 30px;
    left: 0;
    background: #ffffff;
    display: none;
    z-index: 999;
  }
  .ts_option>div{
    width: 100%;
    height: 30px;
    line-height: 30px;
     -webkit-box-sizing: border-box;
     -moz-box-sizing: border-box;
    box-sizing: border-box;
    padding-left: 10px;
    font-size: 14px;
    color: #333333;
    border-bottom: 1px solid #e5e5e5;
  }
  .ts_option>div:hover{
    background: #e5e5e5;
  }
  .testingd_select.aclickm i.i_xico{
    margin-top: 9px;
    /*background: url("../../img/rc/blue_ico.png") no-repeat;*/
  }
  .test_resources{
    width: 205px;
    height: 30px;
    line-height: 30px;
    float: left;
    position: relative;
  }
  .tr_select{
    width: 100%;
    height: 30px;
    line-height: 30px;
     -webkit-box-sizing: border-box;
     -moz-box-sizing: border-box;
    box-sizing: border-box;
    border: 1px solid #b8b8b8;
    border-radius: 4px;
  }
  .tr_option{
    width: 205px;
    height: 120px;
     -webkit-box-sizing: border-box;
     -moz-box-sizing: border-box;
    box-sizing: border-box;
    border: 1px solid #1056bf;
    position: absolute;
    top: 30px;
    left: 0;
    overflow-y: auto;
    overflow-x: hidden;
    display: none;
  }
  .tr_option ul.ztree{
    width: 203px;
    padding: 0;
  }
  .tr_option ul.ztree li a{
    width: 200px;
    border-bottom: 1px solid #d7d7d7;
  }
  .tr_option ul.ztree li a.level0{
    background-color: #1056bf;
  }
  .tr_option ul.ztree li a.curSelectedNode{
    color: #1056bf;
  }
  .tr_option ul.ztree li span.button.switch.level1 {
    width: 20px;
    height: 20px;
    float: right;
    margin-top: 5px;
  }
  .tr_option ul.ztree li span.button{
    /*background-image: url("../../img/rc/left_menuForOutLook.gif");*/
  }
  .tr_option ul.ztree li span.button {
    margin-top: -2px;
  }
  .tr_option ul.ztree li span.button.noline_docu{
    background: none;
  }
  .tr_option ul.ztree li span.button.noline_open.level0{
    margin-top: 5px;
  }
  .tr_option ul.ztree li span.button.noline_close.level0{
    margin-top: 5px;
  }
  .tr_option ul.ztree li.level1 span{
    margin-left: 15px;
  }
  .tr_option ul.ztree li.level2 span{
    margin-left: 7px;
  }
  .jc_data{
    width: 205px;
    height: 30px;
    float: left;
  }
  .zdyfa_main{
    width: 102px;
    height: 30px;
    float: left;
  }
  .zdyfa_main i.i_cosbox_ico{
    display: block;
    float: left;
    width: 12px;
    height: 12px;
    /*background: url("../../img/rc/radio.png") no-repeat;*/
    margin-top: 9px;
  }
  em.em_zdy{
    display: block;
    width: auto;
    height: 30px;
    float: left;
    margin-left: 5px;
    font-size: 14px;
    color: #333333;
  }
  .zdyfa_main i.i_cosbox_ico.aclickbox{
    /*background: url("../../img/rc/radio.png") no-repeat 0 -13px;*/
  }
  button.new_fa{
    width: 75px;
    margin-left: 5px;
    height: 30px;
    line-height: 28px;
    border: 1px solid #1056bf;
    cursor: pointer;
    font-size: 14px;
    color: #1056bf;
    box-sizing: border-box;
    border-radius: 4px;
  }
  .tc_btn{
    width: 100%;
    height: 30px;
    text-align: center;
  }
  .tc_btn button {
    width: 80px;
    height: 30px;
    line-height: 30px;
    font-size: 14px;
    color: #ffffff;
    border-radius: 4px;
    cursor: pointer;
  }
  .aclickm{
    border: 1px solid #1056bf;
  }
 
  div.test_report_box{
    width: 1200px;
    margin-top: 30px;
    background: #ffffff;
    box-shadow: 0px 2px 10px #dedede;
    padding-bottom: 40px;
    /* margin-bottom: 50px; */
  }
  .test_report_top{
    width:100%;
    height: 52px;
    border-radius: 4px;
    background:#b61717;
  }
  span.trt_name{
    display: block;
    float: left;
    width: auto;
    height: 52px;
    line-height: 52px;
    margin-left: 25px;
    font-size: 16px;
    color: #ffffff;
  }
  .tst_btn{
    float: right;
    width: auto;
    height: 30px;
    line-height: 28px;
     -webkit-box-sizing: border-box;
     -moz-box-sizing: border-box;
    box-sizing: border-box;
    border: 1px solid #ffffff;
    border-radius: 4px;
    font-size: 12px;
    color: #ffffff;
    margin-top: 11px;
    margin-right: 20px;
    cursor: pointer;
  }
  .test_report_main{
    width: 100%;
    height: auto;
    min-height: 640px;
  }
  .review,.bi_top{
    width: 1150px;
    height: 38px;
    line-height: 38px;
    margin: 8px auto;
    background-color: #f4f4f4;
    font-size: 14px;
    color: #b61717;
     -webkit-box-sizing: border-box;
     -moz-box-sizing: border-box;
    box-sizing: border-box;
    padding-left: 10px;
    font-weight: bold;
  }
  .trm_chart{
    width: 100%;
    height: 300px;
     -webkit-box-sizing: border-box;
     -moz-box-sizing: border-box;
    box-sizing: border-box;
    padding: 0 35px;
  }
  .trm_cleft{
    float: left;
    width: 740px;
    height: 300px;
     -webkit-box-sizing: border-box;
     -moz-box-sizing: border-box;
    box-sizing: border-box;
    padding-top: 10px;
  }
  .name_sfzh{
    width: 100%;
    height: 30px;
  }
  span.name_span_title,span.dtr_span{
    display: block;
    height: 30px;
    line-height: 30px;
    width: auto;
    float: left;
    font-size: 14px;
    color: #666666;
  }
  span.name_span_main{
    display: block;
    height: 30px;
    line-height: 30px;
    float: left;
    width: 100px;
    font-size: 14px;
    color: #333333;
  }
  .data_test_results{
    width: 100%;
    height: auto;
  }
  .span_dtr_main{
    display: block;
    width: 570px;
    line-height: 30px;
    font-size: 14px;
    color: #333333;
    float: left;
  }
  .trm_chart_main{
    width: 380px;
    height: 300px;
    float: right;
    border-left: 1px solid #f0ebeb;
     -webkit-box-sizing: border-box;
     -moz-box-sizing: border-box;
    box-sizing: border-box;
    padding-top: 20px;
    padding-left: 20px;
  }
  .trm_chart_m{
    width: 100%;
    height: auto;
  }
  .basic_information{
    width: 1150px;
    height:auto;
    margin: 10px auto;
  }
  .basic_information_main{
    width: 100%;
    height: auto;
    overflow-x: auto;
  }
  .basic_information_main table.bi_tab{
    border-collapse: collapse;
    border-spacing: 0;
    margin-bottom: 15px;
  }
  .basic_information_main table.bi_tab tr th,.basic_information_main table.bi_tab tr td{
    height: 43px;
    line-height: 43px;
    border: 1px solid #d5d1d1;
    font-size: 14px;
    color: #333333;
  }
  a.a_bi{
    display: block;
    width: 150px;
    height: 43px;
    line-height: 43px;
    font-size: 14px;
    color: #333333;
  }
  .button_bi_btn{
    width: 100%;
    height: 38px;
    text-align: center;
    margin-top: 25px;
  }
  .button_bi_btn button{
    width: 100px;
    height: 38px;
    line-height: 38px;
    text-align: center;
    margin-right: 5px;
    border-radius: 4px;
    cursor: pointer;
  }
  button.download_report{
    background-color: #b61717;
    font-size: 14px;
    color: #ffffff;
  }
  button.shut_down{
    background-color: #ffffff;
    font-size: 14px;
    color: #b61717;
    border: 1px solid #b61717;
  }
  div.noborder{
    border: none;
  }
  .pictureone{
   font-size: 81px;
   color:#57A8FA;
   position: relative;
   left: -13%;
}
   .element-row .col-xs-2, .element-row .col-xs-4, .element-row .col-xs-8 , .element-row .col-xs-12{
    padding: 0;
  }
  .element-row .col-xs-2{
    text-align: center;
    line-height: 48px;
  }
  .element-row .col-xs-4,.element-row .col-xs-8,.element-row .col-xs-12{
    line-height: 24px;
  }
  .element-row{
    height: 57px;
    font-size: 12px;
    border: 1px solid #ccc;
    background: #fff !important;
  }
  .element-row.row{
    margin: 0 0 10px 0;
  }
   .el-dialog__body{
    background-color: #F8F8F8 !important;
  }
  .element-detail .el-dialog__header{
    background-color: #56A8FE;
    height: 50px;
  }
  .element-detail .el-dialog__title{
    color: #fff;
    font-size: 16px;
    font-weight: normal;
    padding: 17px 11px 10px 15px;
  }
  .element-detail .el-dialog__headerbtn .el-dialog__close{
    color: #fff;
  }
  .butonstT {
    border-radius: 3px;
    border: 1px #56A8FE solid;
    text-align: center;
    font-size: 12px;
    color: #56A8FE;
    background-color:#FFFFFF;
    line-height: 28px;
    cursor: pointer;
    padding: 0 14px;
  }
  .butonstT:hover {
    border-radius: 3px;
    border: 1px #56A8FE solid;
    text-align: center;
    font-size: 12px;
    color: #56A8FE;
    background-color:#FFFFFF;
    line-height: 28px;
    cursor: pointer;
    padding: 0 14px;
  }
</style>
<style> 
.resoubox .el-dialog__title {
    line-height: 1;
    font-size: 14px;
    font-weight: 500;
    color: white ;
}
.resoubox .el-input.is-disabled .el-input__inner {
  font-size:12px;
  background-color:#fff;
}
.resoubox .el-dialog__body {
  background-color: #F8F8F8 !important;
}
</style>

