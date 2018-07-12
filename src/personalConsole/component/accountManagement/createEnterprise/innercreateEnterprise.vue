<template>
  <div>
	<breadcrumb :data="breadcrumb"></breadcrumb>
	<div v-show="display">
	  <div style="" class="tophead">
		<h4>创建企业</h4>
	  </div>
	  <el-row class="userinfo">
		<el-col :span="12" class="data-left">
		  <span class="normal-info spanTwo"><span class="span-info1">用户名：</span><span>{{userInfo.name}}</span></span>
		  <span class="normal-info spanTwo"><span>手机号码：</span> <span>{{userInfo.phone}}</span></span>
		  <span class="identify-info spanTwo" v-show="authenticated"><span>身份所属：</span><span>{{userInfo.identity}}</span></span>
		</el-col>
		<el-col :span="12" class="data-right" v-show="authenticated">
		  <span v-show="authenticated"></span>
		  <span class="identify-info" v-show="authenticated">真实姓名：{{userInfo.realName}}</span>
		  <span class="identify-info" v-show="authenticated">身份证号：{{userInfo.idCard}}</span>
		</el-col>
		<div class="authenticated" v-show="authenticated">
		  <img src="../../../images/renzheng.png">
		</div>
		<div class="unauthorized" v-show="authorizing">
		  <span>您的账号正在实名认证中。</span>
		</div>
		<div class="unauthorized" v-show="unauthorized">
		  <span>您的账号未通过实名认证。</span>
		  <span class="setting" @click="goIndentify">立即认证</span>
		</div>
	  </el-row>
	  <div>
		<el-row class="pclass" style="margin-top: 18px">
          <el-col :span="9" class="span-info">
            <i>*</i>&nbsp;企业名称：</el-col>
		  <el-col :span="12" class="input-info">
        <input type="text" v-model="formdatas.name" name="aname" class="inputclass" @focus="focustest" @blur="blurtest" :class="{'errorinput':industrytestone||industrytesttwo||nametest==0}" maxlength="30" @change="inputChange">
        <img src="../../../../publicImages/loading_check.gif" v-show="loadingImg"/>
        <span v-show="industrytest" class="tip-info">不超过30个字符,且不允许有特殊字符</span>
        <span v-show="industrytestone" class="error-info">! 此处不能为空</span>
        <span v-show="industrytesttwo" class="error-info">! 输入不符合要求</span>
		<span class="error-info">{{checkinfo}}</span>
        </el-col>
		</el-row>
		<el-row class="pclass">
          <el-col :span="9" class="span-info">
            <i>*</i>&nbsp;营业执照注册号：</el-col>
		  <el-col :span="12" class="input-info">
        <input type="text" v-model="formdatas.businessNo" name="bname" class="inputclass" @focus="focustestone" @blur="blurtestone" :class="{'errorinput':businesstestone||businesstesttwo}" maxlength="30">
        <span v-show="businesstest" class="tip-info">长度不大于30位的字母数字组合</span>
        <span v-show="businesstestone" class="error-info">! 此处不能为空</span>
        <span v-show="businesstesttwo" class="error-info">! 输入不符合要求</span>
          </el-col>
		</el-row>
		<el-row class="pclass" style="height: 187px;position: relative;">
          <el-col :span="9" class="span-info">
            <i>*</i>&nbsp;营业执照扫描件：</el-col>
		  <el-col :span="12" class="input-info">
      <div class="imgupload" :class="{'errorinput':filetest}">
        <label class="imguploadinfo" for="filepass">
          <img :src="imgsrc" alt="">
          <div class="imgicon" style="cursor: pointer;"></div>
          <input type="file" @change="change" id="filepass" class="imgicon" style="opacity: 0;position: relative; top:-42px;z-index:99;cursor: pointer; " accept="image/jpg, image/jpeg, image/png, image/JPG, image/PNG">
          <span>上传图片</span>
        </label>
      </div>
           </el-col>
		  <span class="pclass-info">注：请提供证件的原件照片或彩色扫描件,文字/盖章清晰可辨认格式要求jpg,jpeg,png 不超过5M</span>
		</el-row>
		<el-row class="pclass">
          <el-col :span="9" class="span-info">
            <i>*</i>&nbsp;法人代表：</el-col>
		  <el-col :span="12" class="input-info">
        <input type="text" name="cname" class="inputclass" v-model="formdatas.corporate" :class="{'errorinput':corporatetestone||corporatetesttwo}" @focus="focustesttwo" @blur="blurtesttwo">
        <span v-show="corporatetestone" class="error-info">! 此处不能为空</span>
        <span v-show="corporatetesttwo" class="error-info">! 输入不符合要求</span>
        <span v-show="corporatetest" class="tip-info">输入2-15位汉字</span>
         </el-col>
		</el-row>
		<el-row class="pclass">
          <el-col :span="9" class="span-info">
            <i>*</i>&nbsp;法人代表身份证号：</el-col>
		  <el-col :span="12" class="input-info">
        <input type="text" name="dname" class="inputclass" v-model="formdatas.cardId" :class="{'errorinput':cardIdtestone||cardIdtesttwo}" @focus="focustestthree" @blur="blurtestthree" maxlength="18">
        <span v-show="cardIdtest" class="tip-info">请输入18位身份证号</span>
        <span v-show="cardIdtestone" class="error-info">! 此处不能为空</span>
        <span v-show="cardIdtesttwo" class="error-info">! 身份证号错误</span>
          </el-col>
		</el-row>
		<el-row class="pclass">
          <el-col :span="9" class="span-info">
            <i>*</i>&nbsp;所在地址：</el-col>
		  <el-col :span="12" class="input-info">
        <div class="areaSelect">
          <myselect preview="省" :curvalue="curProvincevalue" :data="provinceData" @change="changeProvinceData" :verify="verify" :borderNum="borderNum"></myselect>
        </div>
        <div class="areaSelect">
          <myselect preview="市" :curvalue="curCityvalue" :data="cityData" @change="changeCityData" :verify="verify" :borderNum="borderNum"></myselect>
        </div>
          </el-col>
		</el-row>
		<el-row class="pclass">
          <el-col :span="9" class="span-info">
            <i>*</i>&nbsp;详细地址：</el-col>
		  <el-col :span="12" class="input-info">
        <input type="text" name="gname" class="inputclass" v-model="formdatas.address" @focus="focustestfour" @blur="blurtestfour" :class="{'errorinput':addresstestone||addresstesttwo}" maxlength="30">
        <span v-show="addresstest" class="tip-info">不超过30个字符,且不允许有特殊字符</span>
        <span v-show="addresstestone" class="error-info">! 此处不能为空</span>
        <span v-show="addresstesttwo" class="error-info">! 输入不符合要求</span>
          </el-col>
		</el-row>
		<el-row class="pclass">
		  <el-col :span="9" class="span-info">所属行业：</el-col>
		  <el-col :span="12" class="input-info">
        <!--<select  id="first" name="hname" class="inputclass selectclass" v-model="formdatas.industry">-->
			<!--<option v-for="(value,item) in industrydata">{{value.name}}</option>-->
			<!--</select>-->
           <div class="industrySelect">
          <myselect @change="changeIndustryData" :curvalue="formdatas.industry" preview="请选择" :data="industrydata" :industryVerify="industryVerify" :borderNum="borderNum"></myselect>
            </div>
          </el-col>
		</el-row>
		<el-row class="pclass">
		  <el-col :span="9" class="span-info">&nbsp;邮箱：</el-col>
		  <el-col :span="12" class="input-info">
        <input type="text" name="iname" class="inputclass" v-model="formdatas.email" @focus="focustestfive" @blur="blurtestfive" :class="{'errorinput':emailtest}">
        <span v-show="emailtest" class="error-info">! 请输入格式正确的邮箱</span>
          </el-col>
		</el-row>
		<el-row class="pclass">
		  <el-col :span="9" class="span-info">&nbsp;联系电话：</el-col>
		  <el-col :span="12" class="input-info">
        <input type="text" name="jname" class="inputclass" v-model="formdatas.phone" @focus="focustestsix" @blur="blurtestsix" :class="{'errorinput':phonetest}" maxlength="11">
        <span v-show="phonetest" class="error-info">! 请输入格式正确的手机号</span>
          </el-col>
		</el-row>

		<el-row class="pclass">
		  <el-col :span="9" class="span-info">&nbsp;办公电话：</el-col>
		  <el-col :span="12" class="input-info">
        <input type="text" name="kname" class="inputclass" v-model="formdatas.telephone" @focus="focustestseven" @blur="blurtestseven" :class="{'errorinput':telphonetest}" maxlength="13">
        <span v-show="telphonetest" class="error-info">! 请输入格式正确的电话号码</span>
          </el-col>
		</el-row>
		<el-row class="pclass">
		  <el-col :span="9" class="span-info">&nbsp;传真：</el-col>
		  <el-col :span="12" class="input-info">
        <input type="text" name="lname" class="inputclass" v-model="formdatas.faxNumber" @focus="focustesteight" @blur="blurtesteight" :class="{'errorinput':faxNumbertest}" maxlength="13">
        <span v-show="faxNumbertest" class="error-info">! 请输入格式正确的传真号码</span>
          </el-col>
		</el-row>
		<el-row class="pclass" style="margin-top: 30px">
		  <el-col :span="9" class="span-info"></el-col>
		  <el-col :span="12" class="input-info"><input type="submit" value="提交" class="inputsubmit btnBlue" @click="submit" style="left: 6%;"><input type="submit" value="返回" class="inputsubmit btnGreen" @click="goback" style="left: 14%;"></el-col>
		</el-row>
	  </div>
	</div>
	<div class="content" v-show="cosplay">
	  <div class="result">
		<div class="info">
          <span>
            <div class="success-info">提交成功!</div>
            <div class="icon">
              <img src="../../../images/submitsuccess.png" alt="">
            </div>
          </span>
		  <span></span>
		</div>
	  </div>
	  <div class="backinfo">
		<span title="点击返回" @click="goLogin">{{backCount}}秒后返回创建企业主页</span>
	  </div>
	</div>
  </div>
</template>
<script>
  import select from '../../publicComponent/select'
  import breadCrumb from '../../publicComponent/breadCrumb.vue'
  import ApiClient from '../../../../publicJs/ApiClient.js'
  import LoadingBoxService from '../../../../publicJs/LoadingBoxService'
  import ToolService from '../../../common/ToolService'
  import TipBoxService from '../../../../publicJs/TipBoxService'

  var countBack = ''
  export default {
    name: 'innercreateEnterprise',
    data () {
      return {
        showDetail: 0,
        checkinfo: '',
        loadingImg: false,
        userId: '',
        file: null,
        backCount: 3,
        display: true,
        cosplay: false,
        // 验证状态
        filetest: false,
        industrytest: false,
        industrytestone: false,
        industrytesttwo: false,
        businesstest: false,
        businesstestone: false,
        businesstesttwo: false,
        corporatetest: false,
        corporatetestone: false,
        corporatetesttwo: false,
        addresstest: false,
        addresstestone: false,
        addresstesttwo: false,
        cardIdtest: false,
        cardIdtestone: false,
        cardIdtesttwo: false,
        emailtest: false,
        phonetest: false,
        telphonetest: false,
        faxNumbertest: false,
        // 验证是否通过标记符 用于提交时拦截
        signone: 0,
        signtwo: 0,
        signthree: 0,
        signfour: 0,
        signfive: 0,
        signsix: 0,
        signseven: 0,
        signeight: 0,
        signnine: 0,
        // 更新信息标记符
        updateone: true,
        updatetwo: true,
        updatethree: true,
        updatefour: true,
        updatefive: true,
        updatesix: true,
        updateseven: true,
        updateeight: true,
        updatenine: true,
        // 验证省和市是否选择的标记符0表示未选择
        verifyPrivince: 0,
        verify: false,
        verifyCity: 0,
        industryVerify: true,
        // 是否通过重名测试
        nametest: 1,
        imgsrc: '',
        industrydata: [{name: '移动应用服务'},
          {name: '社交'},
          {name: '在线教育'},
          {name: '电子商务'},
          {name: '精准营销'},
          {name: '网络游戏'},
          {name: '在线视频'},
          {name: '互联网金融'},
          {name: '互联网其他'}
        ],
        breadcrumb: [{name: '账号管理', link: '/safetyManagement'}, {name: '创建企业', link: ''}],
        userInfo: {
          name: '',
          phone: '',
          password: '',
          realName: '',
          idCard: '',
          email: '',
          authStatus: '', // 认证状态
          identity: '' // 身份所属
        },
        authenticated: true, // 已认证
        authorizing: false, // 认证中
        unauthorized: false, // 未认证
        formdatas: {
          name: '',        // 企业名称
          businessNo: '',  // 营业执照注册号
          image: '',       // 营业执照扫描件
          corporate: '',   // 法人代表
          cardId: '',      // 法人代表身份证号
          province: '',    // 省份
          city: '',       // 城市
          address: '',    // 详细地址
          industry: '',   // 所属行业
          email: '',      // 邮箱
          phone: '',      // 联系电话
          telephone: '',   // 办公电话
          faxNumber: '',   // 传真
          userId: '',      // 用户id
          status: '',      // 申请状态
          reason: '',      // 驳回原因
          changeImg: '',   // 是否变更图片
          oldImg: ''
        },
        provinceData: [],
        cityData: [],
        curProvincevalue: '',
        curCityvalue: '',
        industryName: '', // 用于对未通过的企业  更改企业名称重名效验时使用
        flag: 1,      // 重名效验阀(只有重名效验后才能点击提交)
        borderNum: true
      }
    },
    components: {
      'breadcrumb': breadCrumb,
      'myselect': select
    },
    methods: {
      changeIndustryData (item) {
        this.formdatas.industry = item.name
      },
      getProvinceData () {
        ApiClient.get('pcapi/location/getList').then((data) => {
          console.log('getProvinceData', data)
          this.provinceData = data
        })
      },
      getCityData (item) {
        ApiClient.get('pcapi/location/getList', {code: item.code}).then((data) => {
          this.cityData = data
        })
      },
      changeProvinceData (item) {
        this.formdatas.province = item.code
        this.verifyPrivince = 1
        this.cityData = []
        this.getCityData(item)
      },
      changeCityData (item) {
        this.formdatas.city = item.code
        this.verify = false
        this.verifyCity = 1
      },
      goLogin () {
        clearInterval(countBack)
        this.$router.push({name: 'createEnterprise'})
      },
      // 以下表单效验
      focustest () {
        this.industrytest = true
        this.industrytestone = false
        this.industrytesttwo = false
      },
      blurtest () {
        let pwdReg = /[@!#\$\(\)%\^&\*]+/
        if (pwdReg.test(this.formdatas.name) === true) {
          this.industrytesttwo = true
          this.updateone = false
        } else {
          this.signone = 1
          this.updateone = true
        }
        if (this.formdatas.name.trim() == '') {
          this.industrytestone = true
          this.industrytesttwo = false
        }
        this.industrytest = false
        this.checkinfo = ''
      },
      focustestone () {
        this.businesstest = true
        this.businesstestone = false
        this.businesstesttwo = false
      },
      blurtestone () {
        let pwdReg = /^[0-90-9A-Za-z]{1,30}$/
        if (pwdReg.test(this.formdatas.businessNo.trim()) === false) {
          this.updatetwo = false
          this.businesstesttwo = true
        } else {
          this.signtwo = 1
          this.updatetwo = true
        }
        if (this.formdatas.businessNo.trim() == '') {
          this.businesstestone = true
          this.businesstesttwo = false
        }
        this.businesstest = false
      },
      focustesttwo () {
        this.corporatetest = true
        this.corporatetestone = false
        this.corporatetesttwo = false
      },
      blurtesttwo () {
        this.corporatetest = false
        let pwdReg = /^[\u4E00-\u9FA5]{2,15}$/
        if (pwdReg.test(this.formdatas.corporate.trim()) === false) {
          this.updatethree = false
          this.corporatetesttwo = true
        } else {
          this.updatethree = true
          this.signthree = 1
          this.corporatetesttwo = false
        }
        if (this.formdatas.corporate.trim() == '') {
          this.corporatetesttwo = false
          this.corporatetestone = true
        } else {
          this.corporatetestone = false
        }
      },
      focustestthree () {
        this.cardIdtest = true
        this.cardIdtestone = false
        this.cardIdtesttwo = false
      },
      blurtestthree () {
        this.cardIdtest = false
        if (ToolService.checkIdCard(this.formdatas.cardId.trim()) === false) {
          this.updatefour = false
          this.cardIdtesttwo = true
          this.signfour = 0
        } else {
          this.updatefour = true
          this.signfour = 1
          this.cardIdtesttwo = false
        }
        if (this.formdatas.cardId.trim() == '') {
          this.cardIdtesttwo = false
          this.cardIdtestone = true
        } else {
          this.cardIdtestone = false
        }
      },
      focustestfour () {
        this.addresstest = true
        this.addresstestone = false
        this.addresstesttwo = false
      },
      blurtestfour () {
        this.addresstest = false
        let pwdReg = /[@!#\$\(\)%\^&\*]+/
        if (pwdReg.test(this.formdatas.address.trim()) === true) {
          this.addresstesttwo = true
          this.updatefive = false
        } else {
          this.signfive = 1
          this.addresstesttwo = false
          this.updatefive = true
        }
        if (this.formdatas.address.trim() == '') {
          this.addresstesttwo = false
          this.addresstestone = true
        } else {
          this.addresstestone = false
        }
      },
      // 邮箱验证
      focustestfive () {
        this.emailtest = false
      },
      blurtestfive () {
        let pwdReg = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,5}$/
        if (pwdReg.test(this.formdatas.email.trim()) === false && (this.formdatas.email.trim() != '')) {
          this.updatesix = false
          this.emailtest = true
          this.signsix = 1
        } else {
          this.updatesix = true
          this.emailtest = false
          this.signsix = 0
        }
      },
      focustestsix () {
        this.phonetest = false
      },
      blurtestsix () {
        let pwdReg = /^[1][3,4,5,7,8][0-9]{9}$/
        if (pwdReg.test(this.formdatas.phone.trim()) === false && (this.formdatas.phone.trim() != '')) {
          this.updateseven = false
          this.phonetest = true
          this.signseven = 1
        } else {
          this.updateseven = true
          this.phonetest = false
          this.signseven = 0
        }
      },
      focustestseven () {
        this.telphonetest = false
      },
      blurtestseven () {
        let pwdReg = /^(0\d{2,3}-\d{7,8})$/
        if (pwdReg.test(this.formdatas.telephone.trim()) === false && (this.formdatas.telephone.trim() != '')) {
          this.updateeight = false
          this.telphonetest = true
          this.signeight = 1
        } else {
          this.updateeight = true
          this.telphonetest = false
          this.signeight = 0
        }
      },
      focustesteight () {
        this.faxNumbertest = false
      },
      blurtesteight () {
        let pwdReg = /^(0\d{2,3}-\d{7,8})$/
        if (pwdReg.test(this.formdatas.faxNumber.trim()) === false && (this.formdatas.faxNumber.trim() != '')) {
          this.faxNumbertest = true
          this.signnine = 1
          this.updatenine = false
        } else {
          this.updatenine = true
          this.faxNumbertest = false
          this.signnine = 0
        }
      },
      change (e) {
        console.log('图片重复')
        var file = e.currentTarget.files[0]
        console.log(file.name, '文件名')
        this.file = file
        var filePath = e.currentTarget.files[0].name
        if (!/\.(jpg|jpeg|png|JPG|PNG)$/.test(filePath)) {
          TipBoxService.open('只能选择jpg、png、jpeg格式的图片文件', 2, 2)// 验证正面照
          e.target.value = ''
          return false
        }
        if (file.size / 1024 / 1024 >= 5) {
          TipBoxService.open('请选择5M以下的图片文件', 2, 2)// 验证图片大小
          e.target.value = ''
          return false
        }
        this.filetest = false
        var that = this
        var fr = new FileReader()
        fr.readAsDataURL(file)
        fr.onloadend = function (e) {
          that.imgsrc = this.result
        }
        if (that.userId) {
          that.formdatas.changeImg = 'changed'
        }
      },
      goIndentify () {
        this.$router.push('./realNameCertification')
      },
      submit () {
        console.log(this.flag, 'flag')
      // 在重名认证中不让提交
        if (this.flag === 2) {
          TipBoxService.open('企业名称重名效验中...', 2, 2)
          return
        }
        // 提交信息
        var that = this
        if (that.userId == undefined) {
          console.log('提交信息')
          if (that.nametest === 0) {
            that.checkinfo = '!当前名称重复不可用'
            return false
          } else {
            that.checkinfo = ''
          }
          if (that.formdatas.name.trim() === '' || that.signone === 0) {
            that.industrytesttwo = true
            return
          }
          if (that.formdatas.businessNo.trim() === '' || that.signtwo === 0) {
            that.businesstesttwo = true
            return
          }
          if (that.file == null) {
            that.filetest = true
            return
          }
          if (that.formdatas.corporate.trim() === '' || that.signthree === 0) {
            that.corporatetesttwo = true
            return
          }
          if (that.formdatas.cardId.trim() === '' || that.signfour === 0) {
            that.cardIdtesttwo = true
            return
          }
          if (that.formdatas.address.trim() === '' || that.signfive === 0) {
            that.addresstesttwo = true
            return
          }
          if (that.verifyPrivince === 0) {
            that.verify = true
            return
          }
          if (that.verifyCity === 0) {
            that.verify = true
            return
          }
          if (that.signsix === 1) {
            return
          }
          if (that.signseven === 1) {
            return
          }
          if (that.signeight === 1) {
            return
          }
          if (that.signnine === 1) {
            return
          }
          LoadingBoxService.open('数据保存中...')
          ApiClient.upload('/pcapi/enterprise/create', that.file, that.formdatas).then(data => {
            if (data.results === false) {
              TipBoxService.open('创建企业失败', 2, 2)
              LoadingBoxService.close()
			  return
            }
            that.display = false
            that.cosplay = true
            LoadingBoxService.close()
            countBack = setInterval(function () {
              if (that.backCount > 0) {
                that.backCount--
              } else {
                that.goLogin()
              }
            }, 1000)
          })
        } else {
          console.log('更新信息')
        // 更新信息
          if (that.nametest === 0) {
            that.checkinfo = '!当前名称重复不可用'
            return false
          } else {
            that.checkinfo = ''
          }
          if (that.formdatas.name.trim() === '') {
            that.industrytesttwo = true
            return
          }
          if (that.formdatas.businessNo.trim() === '') {
            that.businesstesttwo = true
            return
          }
          if (that.formdatas.corporate.trim() === '') {
            that.corporatetesttwo = true
            return
          }
          if (that.formdatas.cardId.trim() === '') {
            that.cardIdtesttwo = true
            return
          }
          if (that.formdatas.address.trim() === '') {
            that.addresstesttwo = true
            return
          }
          if (that.updateone === true && that.updatetwo === true && that.updatethree === true && that.updatefour === true && that.updatefive === true && that.updatesix === true && that.updateseven === true && that.updateeight === true && that.updatenine === true) {
            console.log('true')
          } else {
            console.log('false')
            return
          }
          LoadingBoxService.open('数据更新中...')
          console.log(that.formdatas, '对象')
          ApiClient.upload('/pcapi/enterprise/update', that.file, that.formdatas).then(data => {
            that.display = false
            that.cosplay = true
            LoadingBoxService.close()
            countBack = setInterval(function () {
              if (that.backCount > 0) {
                that.backCount--
              } else {
                that.goLogin()
              }
            }, 1000)
          }).catch(e => {
          })
        }
      },
      // 重新申请回显信息
      backshow () {
        LoadingBoxService.open('加载中...')
        var that = this
        ApiClient.get('/pcapi/enterprise/queryById', {
          id: that.userId
        }).then(data => {
          LoadingBoxService.close()
          console.log(data)
          delete data.applicationTime
          delete data.updateTime
          delete data.approvalTime
          that.formdatas = data
          that.industryName = data.name
          ApiClient.get('pcapi/location/getList', {code: data.province}).then((data) => {
            that.cityData = data
            console.log(data)
            for (let i = 0; i < that.cityData.length; i++) {
              const el = that.cityData[i]
              if (el.code === that.formdatas.city) {
                that.curCityvalue = el.name
                that.curProvincevalue = el.province
              }
            }
          })
          that.formdatas.oldImg = data.image
          that.imgsrc = ApiClient.apiBaseUrl + '/pcapi/enterprise/pcShowImage/certificate?imgPath=' + data.image + '&token=' + ApiClient.token
        }).catch(e => {
          console.log(e)
        })
      },
      // 重名效验
      inputChange () {
        this.flag = 2
        // 重新申请企业的时候 把企业名称改为别的再改回来会提示重名 前端处理
        if (this.userId != undefined && this.industryName == this.formdatas.name.trim()) {
          this.updateone = true
          this.nametest = 1
          return
        }
        console.log('重名效验')
        var that = this
        that.loadingImg = true
        let name = that.formdatas.name.trim()
        ApiClient.get('/pcapi/enterprise/queryByName', {
          name: name
        }).then(data => {
          console.log(data.name, '重名测试')
          if (name == data.name) {
            that.updateone = false
            that.checkinfo = '!当前名称重复不可用'
            that.nametest = 0
          } else {
            that.updateone = true
            that.nametest = 1
            that.checkinfo = ''
          }
          that.loadingImg = false
          that.flag = 3
        }).catch(e => {
        })
      },
      goback () {
        this.$router.push({path: 'createEnterprise'})
      },
      getUserInfo () {
        var that = this
        ApiClient.get('pcapi/userInfo/getInfo').then(data => {
          console.log(data, '获取信息')
          that.userInfo.name = data.userName
          that.userInfo.phone = data.phone.substring(0, 3) + '****' + data.phone.substring(7, 11)
          that.userInfo.realName = '*' + data.trueName.substring(1)
          that.userInfo.idCard = data.idCard.substring(0, 4) + '**********' + data.idCard.substring(14, 18)
//                    that.userInfo.identity = data.identity
        })
        ApiClient.get('pubapi/token/getUserByToken').then(data => {
          console.log(data.userInfo.LOGIN_TYPE, '企业信息')
          if (data.userInfo.LOGIN_TYPE == 'PERSONAL') {
            that.userInfo.identity = '个人'
          }
          if (data.userInfo.LOGIN_TYPE == 'ENTERPRISE') {
            that.userInfo.identity = data.userInfo.ENTERPRISE_NAME
          }
        })
      }
    },
    mounted () {
      this.getUserInfo()
      this.getProvinceData()
      this.userId = this.$route.query.id
      this.showDetail = this.$route.query.path
      if (this.userId || this.showDetail == 1) {
        console.log('回显')
        this.backshow()
      }
    }
  }
</script>
<style scoped>
  .tophead {
	margin: 67px 113px 0 113px;
	border-bottom: 1px solid #f1f1f1;
  }
  .tophead h4 {
	display: inline-block;
	border-bottom: 2px solid #ff4400;
	padding-bottom: 5px;
  }
  .userinfo {
	margin: 0px 113px 0 113px;
	padding: 24px 0 0px 30px;
	border-bottom: 1px solid #f1f1f1;
	height: 148px;
  }
  .success-icon i {
	font-size: 50px;
	color: #1bc001;
  }
  .data-left {
	height:100%;
	padding-left: 193px;

  }
  .data-left > span {
	height: 33%;
  }
  .data-right {
	height:100%;
	padding-right: 193px;
	z-index: 3;
  }
  .data-right > span {
	display: block;
	height:33%;
  }
  .spanTwo {
	display: block;
  }
  .authenticated {
	position: relative;
  }
  .authenticated img {
	position: absolute;
	top: 52px;
	left: 64%;
	z-index: 1;
  }
  .unauthorized {
	flex: 10;
	padding-top: 40px;
  }
  .setting {
	color: #fa3753;
	cursor: pointer;
	padding: 8px 0px;
  }
  .setting:hover {
	text-decoration: underline;
  }
  .imgupload {
	width: 321px;
	height: 136px;
	border: 1px solid #eee;
	border-radius: 5px;
	cursor: pointer;
	margin-left: 6px;
  }
  .imguploadinfo {
	cursor: pointer;
	width: 290px;
	height: 111px;
	border: 1px dashed #eeeeee;
	border-radius: 5px;
	margin: 12px 0 0 14px;
	padding: 25px 0 0 122px;
	position: relative;
  }
  .imguploadinfo img {
	position: absolute;
	width: 288px;
	height: 109px;
	left: 0;
	top: 0;
	z-index: 99;
  }
  .imguploadinfo span {
	position: relative;
	color: #898989;
	left: -5px;
	top: -40px;
	font-weight: normal;
  }
  .imgicon {
	width: 42px;
	height: 42px;
	background-image: url(../../../images/uploadIcon.png);
	background-repeat: no-repeat;
  }
  .pclass {

  }
  .input-info {

	height: 40px;
  }
  .span-info {

	text-align: right;
	height: 40px;
	line-height: 30px;
  }
  .pclass i {
	font-style: normal;
	vertical-align: baseline;
	color: #fa3753;
  }
  .inputclass {
	width: 321px;
	height: 31px;
	margin-left: 6px;
	padding-left: 5px;
	border: 1px solid #eee;
	border-radius: 5px;
  }
  .inputclass:focus {
	outline: none;
	border: 1px solid #20a0ff;
  }
  .inputsubmit {
	position: relative;
  }
  .pclass .pclassinfo {
	display: inline-block;
	width: 321px;
	color: #f97f8c;
	transform: translateX(51%);
  }
  .areaSelect {
	display: inline-block;
	width: 163px;
	height: 30px;
  }
  .areaSelect:first-of-type {
	margin-left: 2px;
  }
  .industrySelect {
	display: inline-block;
	width: 331px;
	height: 30px;
  }
  .industrySelect:first-of-type {
	margin-left: 2px;
  }
  .error-info {
	/*margin-left: 10px;*/
	color: #fa3753;
	font-size: 12px;
	position: relative;
	top: 0px !important;
  }
  .tip-info {
	/*margin-left: 10px;*/
	color: gray;
	font-size: 12px;
	position: relative;
	top: 0px;
  }
  .errorinput {
	border-color: #fa3753 !important;
  }
  .content {
	padding: 0 100px;
  }
  .error-info {
	margin-left: 10px;
	color: #fa3753;
	font-size: 12px;
	position: relative;
	top: -5px;
  }
  .modify-input .input .errorinput {
	border-color: #fa3753;
  }
  .modify-title span {
	font-size: 16px;
	border-bottom: 2px solid #ff4500;
	padding: 5px 0px;
  }
  .modify-input .title {
	flex: 3;
	text-align: right;
	padding-right: 5px;
	font-size: 14px;
  }
  .modify-input .input {
	flex: 7;
	position: relative;
  }
  .modify-input .input input {
	height: 30px;
	border: 1px solid #f1f1f1;
	border-radius: 6px;
	padding: 0 6px;
	-moz-outline-radius: 6px;
	position: relative;
	top: -6px;
	width: 320px;
  }
  .password-tips ul {
	list-style-type: circle;
	color: #888;
	width: 150px;
  }
  .icon {
	position: relative;
  }
  .info .icon img {
	width: 55px;
	height: 55px;
	position: absolute;
	top: -30px;
	left: -75px;
  }
  .backinfo {
	display: flex;
	justify-content: center;
  }
  .backinfo span {
	cursor: pointer;
	color: #888;
	font-size: 12px;
	margin-left: -50px;
  }
  .backinfo span:hover {
	text-decoration: underline;
  }
  .result {
	margin: 70px 0 50px 0;
	display: flex;
	justify-content: center;
  }
  .result .info span:first-child {
	font-size: 16px;
	height: 46px;
	line-height: 46px;
  }
  .success-info {
	position: relative;
	top: 18px;
  }
  .pclass-info {
	display: inline-block;
	position: absolute;
	left: 38%;
	top: 78%;
	width: 309px;
	/*transform: translate(-44%, -63%);*/
	color: #FF2D67;
  }
  img[src=""] {
	opacity: 0;
  }
</style>
