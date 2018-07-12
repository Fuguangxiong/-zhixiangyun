<template>
  <div>
	<breadcrumb :data="breadcrumb"></breadcrumb>
	<div v-show="display">
	  <div style="" class="tophead">
		<h4>查看企业</h4>
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
	  <el-row style="height: 12px"></el-row>
	  <el-row class="pclass">
          <el-col :span="9" class="span-info">
            <i>*</i>&nbsp;企业名称：</el-col><input type="text" disabled v-model="formdatas.name" name="aname" class="inputclass">
	  </el-row>
	  <el-row class="pclass">
          <el-col :span="9" class="span-info">
            <i>*</i>&nbsp;营业执照注册号：</el-col>
		<input type="text" v-model="formdatas.businessNo" disabled name="bname" class="inputclass" maxlength="35">
	  </el-row>
	  <el-row class="pclass" style="height:143px" title="点击查看大图">
          <el-col :span="9" class="span-info">
            <i>*</i>&nbsp;营业执照扫描件：</el-col>
		<span class="inputclass">
        <label class="imguploadinfo" @click="largePic">
          <img :src="imgsrc" alt="">
        </label>
      </span>
	  </el-row>
	  <el-row class="pclass">
          <el-col :span="9" class="span-info">
            <i>*</i>&nbsp;法人代表：</el-col>
		<input type="text" name="cname" disabled class="inputclass" v-model="formdatas.corporate">
	  </el-row>
	  <el-row class="pclass">
          <el-col :span="9" class="span-info">
            <i>*</i>&nbsp;法人代表身份证号：</el-col><input type="text" disabled name="dname" class="inputclass" v-model="formdatas.cardId" maxlength="18">
	  </el-row>
	  <div class="pclass">
          <el-col :span="9" class="span-info">
            <i>*</i>&nbsp;所在地址：</el-col>
		<div class="inputclass" style="line-height: 40px;display: flex;">
		  <input type="text" disabled v-model="curProvincevalue" style="width: 51px;">
		  <input type="text" disabled v-model="curCityvalue" style="width: 51px;">
		</div>
	  </div>
	  <el-row class="pclass">
          <el-col :span="9" class="span-info">
            <i>*</i>&nbsp;详细地址：</el-col>
		<input type="text" disabled name="gname" class="inputclass" v-model="formdatas.address" maxlength="30">
	  </el-row>
	  <el-row class="pclass">
		<el-col :span="9" class="span-info">所属行业：</el-col>
		<input type="text" disabled class="inputclass" v-model="formdatas.industry">
	  </el-row>
	  <el-row class="pclass">
		<el-col :span="9" class="span-info">&nbsp;邮箱：</el-col>
		<input type="text" name="iname" disabled class="inputclass" v-model="formdatas.email">
	  </el-row>
	  <el-row class="pclass">
		<el-col :span="9" class="span-info">&nbsp;联系电话：</el-col>
		<input type="text" name="jname" disabled class="inputclass" v-model="formdatas.phone">
	  </el-row>
	  <el-row class="pclass">
		<el-col :span="9" class="span-info">&nbsp;办公电话：</el-col>
		<input type="text" name="kname" disabled class="inputclass" v-model="formdatas.telephone">
	  </el-row>
	  <el-row class="pclass">
		<el-col :span="9" class="span-info">&nbsp;传真：</el-col>
		<input type="text" name="lname" disabled class="inputclass" v-model="formdatas.faxNumber">
	  </el-row>
	  <el-row class="pclass" style="margin-top: 30px">
		<input type="submit" value="返回" class="btnGreen pclassone" @click="goback">
	  </el-row>
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
	<transition name="fade">
	  <picenlarge :close="closeBox" :imgsource="picdata" v-if="lightBoxToggle"></picenlarge>
	</transition>
  </div>
</template>
<script>
  import select from '../../publicComponent/select'
  import breadCrumb from '../../publicComponent/breadCrumb.vue'
  import ApiClient from '../../../../publicJs/ApiClient.js'
  import LoadingBoxService from '../../../../publicJs/LoadingBoxService'
  import ToolService from '../../../common/ToolService'
  import TipBoxService from '../../../../publicJs/TipBoxService'
  import picEnlarge from '../../../../internalOperation/component/publicComponent/pictureEnlarge.vue'

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
        breadcrumb: [{name: '账号管理', link: '/safetyManagement'}, {name: '查看企业', link: ''}],
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
          changeImg: '',
          oldImg: ''
        },
        provinceData: [],
        cityData: [],
        curProvincevalue: '',
        curCityvalue: '',
        lightBoxToggle: false,
        picdata: ''
      }
    },
    components: {
      'breadcrumb': breadCrumb,
      'myselect': select,
      'picenlarge': picEnlarge
    },
    methods: {
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
        this.verifyCity = 1
      },
      goLogin () {
        clearInterval(countBack)
        this.$router.push({name: 'createEnterprise'})
      },
      change (data) {
        return false
      },
      goIndentify () {
        this.$router.push('./realNameCertification')
      },
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
          that.formdatas = data
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
      inputChange () {
        var that = this
        that.loadingImg = true
        let name = that.formdatas.name.trim()
        ApiClient.get('/pcapi/enterprise/queryByName', {
          name: name
        }).then(data => {
          console.log(data.name, '重名测试')
          if (name == data.name) {
            that.checkinfo = '!当前名称重复不可用'
            that.nametest = 0
          } else {
            that.nametest = 1
            that.checkinfo = ''
          }
          that.loadingImg = false
        }).catch(e => {
        })
//                that.loadingImg=false
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
      },
      closeBox () {
        this.lightBoxToggle = false
      },
      largePic () {
        console.log(1)
        this.picdata = this.imgsrc
        this.lightBoxToggle = !this.lightBoxToggle
      }
    },
    mounted () {
      this.getUserInfo()
      this.getProvinceData()
      this.userId = this.$route.query.id
      this.showDetail = this.$route.query.path
      if (this.userId || this.showDetail === 1) {
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
  .span-info1{
	text-align: right;
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

  }
  .imguploadinfo {
	cursor: pointer;
	width: 320px;
	height: 133px;
	border-radius: 5px;
	margin: 12px 0 0 0;
	position: relative;
	left: -8px;
  }
  .imguploadinfo img {
	position: absolute;
	width: 320px;
	height: 133px;
	left: 0;
	top: 0;
	z-index: 99;
  }
  .imguploadinfo span {
	position: relative;
	color: #cccccc;
	left: -5px;
	top: -40px;
  }
  .imgicon {
	width: 42px;
	height: 42px;
	background-image: url(../../../images/uploadIcon.png);
	background-repeat: no-repeat;
  }
  .pclass {

  }
  .pclass i {
	font-style: normal;
	vertical-align: baseline;
	color: #fa3753;
  }
  .inputclass {
	flex: 5;
	height: 40px;
	padding-left: 6px;
	box-sizing: border-box;
  }
  .inputsubmit {
	position: absolute;
	left: 50%;
	transform: translateX(-145%);
	width: 84px;
	height: 33px;
	background-color: #56a8fe;
	color: white;
	outline: none;
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
	margin-left: 45px;
  }
  .selectclass {
	width: 154px;
	height: 29px;
	border: 1px solid #bfcbd9;
	border-radius: 5px;
	transform: translateX(34%);
	appearance: none;
	-moz-appearance: none;
	-webkit-appearance: none;
	background: url("../../../images/select.png") no-repeat scroll right center transparent;
	padding-right: 16px;
  }
  .error-info {
	margin-left: 10px;
	color: #fa3753;
	font-size: 12px;
	position: relative;
	top: 0px !important;
  }
  .tip-info {
	margin-left: 10px;
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
  input:disabled {
	background-color: #fff;
	border: none;
  }
  .span-info {

	text-align: right;
	height: 40px;
	line-height: 40px;
  }
  .pclassone {
	position: relative;
	left: 50%;
	top: 36px;
	transform: translateX(-50%);
  }
  .spanTwo {

  }
  .spanTwo span:first-child{

	text-align: right;
  }
  .spanTwo span:last-child{

  }
</style>
