<template>
	<div>
		<breadcrumb :data="breadcrumb"></breadcrumb>
		<p class="tip" v-show="status==='UNAUTHORIZED'">请完善以下信息，方便我们更好的为您服务</p>
		<div class="realNameCertificationcontent">
			<h4 class="title">实名认证</h4>
			<div class="infobox">

				<!-- 未认证的状态 -->
				<div class="userinfo" v-if="status=='UNAUTHORIZED'">
					<div class="infoItem">
						<div>
							<span class="titleName">手机号码：</span>
							<div class="msginput">
								<input type="tel" v-model="telNum" readonly disabled>
							</div>
						</div>
					</div>

					<div class="infoItem">
						<div>
							<span class="titleName"><span class='xing'>*</span>&nbsp;真实姓名：</span>
							<div class="msginput">
								<input type="text" v-model="basicInfoForm.realUserName" :class="{errorClass:errorUsernameClass}" @blur="comfirmUsername" @focus="UsernameFormate">
								<span class="telReg" v-show="errorUsername">{{userTip}}</span>
                <span class="AllReg" v-show="realNameReg">
                  <ul>
                    <li>全部为中文</li>
                    <li>长度为2-15个字符</li>
                    <p class="iconfont icon-xiangzuojiantou"></p>
                  </ul>
                </span>
							</div>
						</div>
					</div>

					<div class="infoItem">
           	<div>
              <span class="titleName"><span class='xing'>*</span>&nbsp;证件类型：</span>
							<div class="msginput">
                <!-- <el-select v-model="basicInfoForm.certificateType" placeholder="请选择" >
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :value="item.label">
                  </el-option>
                </el-select> -->
                <div class="selectwidth">
                  <myselect  @changeSelect="changeSelect" @change="changeCertificateTypeData" preview="请选择" :data="industrydata"></myselect>
                  <span class="telReg CertificateTypeTip" v-show="errorCertificateType">{{CertificateTypeTip}}</span>
                </div>
               
							</div>
           	</div>
         	</div>

					<div class="infoItem">
						<div>
							<span class="titleName"><span class='xing'>*</span>&nbsp;证件号码：</span>
							<div class="msginput">
								<input maxlength="18" type="text" v-model="basicInfoForm.idCardNum" :class="{errorClass:errorIdNumClass}" @blur="confirmIdNum" @focus="idCardNumFormate">
                <span class="telReg" v-show="errorIdNum">{{idNumTip}}</span>
              </div>
						</div>
					</div>

					<div class="infoItem1">
						<div>
							<span class="titleName"><span class='xing'>*</span>&nbsp;证件照片：</span>
							<div class="msginput msginput1">
								<ul>
									<li>
										<input type="file" id="front" @change="idCardFront" class="photo">
										<label for="front">
											上传正面照
											<img v-if="basicInfoForm.idCardScanFront!==''" :src="basicInfoForm.idCardScanFront"/>
										</label>
									</li>
									<li>		
										<input type="file" id="back" class="photo" @change="idCardBack">
										<label for="back">
											上传背面照
											<img v-if="basicInfoForm.idCardScanBack!==''" :src="basicInfoForm.idCardScanBack"/>
										</label>
									</li>
								</ul>
								<p>注：身份证上传大小不超过5M，建议照片分辨率为<br>200px*150px，图片支持JPEG,PNG格式</p>	
							</div>
						</div>
					</div>

					<!-- 立即认证按钮 -->
					<div class="savebtn">
        			<input type="button" @click="saveBasicInfo" value="立即认证" class="btnBlue">
      		</div>
				</div>
				<!-- 认证中的状态 -->
				<div  v-else-if="status=='AUTHORIZING'" class="certificationing">
					<img src="../../../images/waiting.png" class='statusimg'>
					<span>您的实名认证已提交，请等待审核结果</span>
					<!-- <span class="jupmto">	
						<span>(</span><span class="time">{{time}}</span><span>S后即将跳转到首页)</span>
					</span> -->
				</div>

				<!-- 已认证的状态 -->
				<div  v-else-if="status=='AUTHORIZED'" class="certificationing">
					<img src="../../../images/submitsuccess.png" class='statusimg1'>
					<span>实名认证已成功</span>
					<span></span>
				</div>

        <!-- 审核未通过的状态 -->
				<div  v-else-if="status=='AUTHORIZE_FAILED'" class="certificationing">
					<i class="iconfont icon-shenpi_weitongguo"></i>
					<span>您的实名认证审核未通过</span>
          <router-link :to="{name:'ReApplyrealNameCertification'}">重新申请</router-link>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import breadCrumb from '../../publicComponent/breadCrumb'
import myselect from '../../publicComponent/select'
import ApiClient from '../../../../publicJs/ApiClient'
import TipBoxService from '../../../../publicJs/TipBoxService'
import ToolService from '../../../common/ToolService'
import LoadingBoxService from '../../../../publicJs/LoadingBoxService'
export default {
  name: 'realNameCertification',
  components: {
    breadcrumb: breadCrumb,
    myselect: myselect
  },
  data () {
    return {
      breadcrumb: [
        { name: '账号管理', link: '/safetyManagement' },
        { name: '实名认证', link: '' }
      ],
      industrydata: [{name: '身份证'}],
      // options: [{// select多选
      //   value: '选项1',
      //   label: '身份证'
      // }],
      status: '', // 验证个人状态
      userTel: '', // 用户手机号
      errorUsername: false, // 验证真实姓名
      errorUsernameClass: false,
      userTip: '',
      realNameReg: false, // 点击的时候真实姓名的提示信息
      errorCertificateType: false,  // 验证证件类型
      CertificateTypeTip: '',
      errorIdNum: false,  // 验证证件号码
      errorIdNumClass: false,
      idNumTip: '',

      // 基础信息表单
      basicInfoForm: {
        id: '',
        realUserName: '', // 用户姓名
        certificateType: '',  // 证件类型
        idCardNum: '', // 用户身份证号
        idCardScanFront: '', // 身份正面证扫描件本地链接url
        idCardScanFrontName: '', // 身份正面扫描件文件名
        idCardScanFrontFile: '',  // 身份正面证扫描件文件
        idCardScanBack: '', // 身份反面证扫描件本地链接url
        idCardScanBackName: '', // 身份背面扫描件文件名
        idCardScanBackFile: '' // 身份背面证扫描件文件
      }
      // imgName: ''
    }
  },
  computed: {
    telNum () { // 处理手机号
      return this.userTel.substring(0, 3) + '****' + this.userTel.substring(7)
    }
  },
  // watch: {
  //   imgName (val, oldval) {
  //     console.log('新的文件名', val)
  //     console.log('旧的文件名', oldval)
  //     if (val == oldval) {
  //       TipBoxService.open('图片选择重复', 2, 2)// 验证正面照
  //     }
  //   }
  // },
  mounted () {
    this.getInfo()// 获取数据
    this.$parent.setActive('账号管理', '实名认证')
  },
  methods: {
    getInfo () { // 获取数据方法
      LoadingBoxService.open('加载中...')
      ApiClient.get('pubapi/token/getUserByToken').then(data => {
        // console.log(data)
        this.userTel = data.userInfo.PHONE // 获取电话号码
        this.status = data.userInfo.AUTH_STATUS // 获取认证状态
      })
      LoadingBoxService.close()
    },
    changeCertificateTypeData (item) { // 改变select框
      console.log(item)
      if (item.name === '身份证') {
        this.basicInfoForm.certificateType = 'IdCard'
      } else {
        this.basicInfoForm.certificateType = ''
      }
      console.log(this.basicInfoForm.certificateType)
    },
    changeSelect () { // select框聚焦的时候不显示错误提示
      this.errorCertificateType = false
      this.CertificateTypeTip = ''
    },
    idCardFront (data) { // 上传正面照
      console.log(data)
      var that = this
      var file = data.currentTarget.files[0] // 上传后的文件
      var filePath = data.currentTarget.files[0].name // 文件的名字
      console.log(data.target.value)
      // this.imgName = filePath
      if (!/\.(jpg|jpeg|png|JPG|PNG)$/.test(filePath)) {
        TipBoxService.open('只能选择jpg、png格式的图片文件', 2, 2)// 验证正面照
        data.target.value = ''// 清空inputfile的value
        return false
      }
      if (file.size / 1024 / 1024 >= 5) {
        TipBoxService.open('请选择5M以下的图片文件', 2, 2)// 验证图片大小
        data.target.value = ''// 清空inputfile的value
        return false
      }
      that.basicInfoForm.idCardScanFrontFile = file
      console.log(that.basicInfoForm.idCardScanFrontFile)
      that.basicInfoForm.idCardScanFrontName = filePath
      var fr = new FileReader()
      fr.onloadend = function (e) {
        that.basicInfoForm.idCardScanFront = e.target.result
      }
      fr.readAsDataURL(file)
    },

    idCardBack (data) { // 上传背面照
      var that = this
      var file = data.currentTarget.files[0]
      var filePath = data.currentTarget.files[0].name
      if (!/\.(jpg|jpeg|png|JPG|PNG)$/.test(filePath)) {
        TipBoxService.open('只能选择jpg、png格式的图片文件', 2, 2)// 验证背面照
        data.target.value = ''// 清空inputfile的value
        return false
      }
      if (file.size / 1024 / 1024 >= 5) {
        TipBoxService.open('请选择5M以下的图片文件', 2, 2)// 验证图片大小
        data.target.value = ''// 清空inputfile的value
        return false
      }
      that.basicInfoForm.idCardScanBackFile = file
      that.basicInfoForm.idCardScanBackName = filePath
      var fr = new FileReader()
      fr.onloadend = function (e) {
        that.basicInfoForm.idCardScanBack = e.target.result
      }
      fr.readAsDataURL(file)
    },

    UsernameFormate () { // 真实姓名聚焦focus
      this.errorUsername = false
      this.errorUsernameClass = false
      this.userTip = ''
      this.realNameReg = true
    },

    idCardNumFormate () { // 证件号码聚焦focus
      this.errorIdNum = false
      this.errorIdNumClass = false
      this.idNumTip = ''
      // this.realNameReg = true
    },
    // 判定姓名是否填写并判定格式
    comfirmUsername () {
      this.realNameReg = false
      this.basicInfoForm.realUserName = ToolService.trimStr(this.basicInfoForm.realUserName)
      if (this.basicInfoForm.realUserName === '') {
        this.errorUsername = true
        this.errorUsernameClass = true
        this.userTip = '！ 真实姓名不可为空'
        return false
      } else if (this.basicInfoForm.realUserName.length > 15 || this.basicInfoForm.realUserName.length < 2 || !ToolService.regChinaName(this.basicInfoForm.realUserName)) {
        this.errorUsername = true
        this.errorUsernameClass = true
        this.userTip = '！ 真实姓名格式不符合规范(中文2-15位字符)'
        return false
      } else {
        this.errorUsername = false
        this.errorUsernameClass = false
        this.userTip = ''
      }
    },
    // 判定证件号码是否填写并判定格式
    confirmIdNum () {
      if (this.basicInfoForm.idCardNum === '') {
        this.errorIdNum = true
        this.errorIdNumClass = true
        this.idNumTip = '！ 证件号码不可为空'
        return false
      } else if (!ToolService.checkIdCard(this.basicInfoForm.idCardNum)) {
        this.errorIdNum = true
        this.errorIdNumClass = true
        this.idNumTip = '！ 证件号码格式错误'
        return false
      } else {
        this.errorIdNum = false
        this.errorIdNumClass = false
        this.idNumTip = ''
      }
    },
     // 点击按钮保存基本信息
    saveBasicInfo () {
      // 验证真实姓名
      this.basicInfoForm.realUserName = ToolService.trimStr(this.basicInfoForm.realUserName)
      if (this.basicInfoForm.realUserName === '') {
        this.errorUsername = true
        this.errorUsernameClass = true
        this.userTip = '！ 真实姓名不可为空'
        return false
      } else if (this.basicInfoForm.realUserName.length > 15 || this.basicInfoForm.realUserName.length < 2 || !ToolService.regChinaName(this.basicInfoForm.realUserName)) {
        this.errorUsername = true
        this.errorUsernameClass = true
        this.userTip = '！ 真实姓名格式不符合规范(中文2-15位字符)'
        return false
      }
      // 验证证件类型是否选择
      if (this.basicInfoForm.certificateType === '') {
        this.errorCertificateType = true
        this.CertificateTypeTip = '！ 请选择证件类型'
        return false
      }
      // 验证证件号码
      if (this.basicInfoForm.idCardNum === '') {
        this.errorIdNum = true
        this.errorIdNumClass = true
        this.idNumTip = '！ 证件号码不可为空'
        return false
      } else if (!ToolService.checkIdCard(this.basicInfoForm.idCardNum)) {
        this.errorIdNum = true
        this.errorIdNumClass = true
        this.idNumTip = '！ 证件号码格式错误'
        return false
      }
      // 验证身份证文件是否上传
      if (this.basicInfoForm.idCardScanFrontFile === '') {
        TipBoxService.open('请上传证件正面照片', 2, 2)
        return false
      }
      if (this.basicInfoForm.idCardScanBackFile === '') {
        TipBoxService.open('请上传证件背面照片', 2, 2)
        return false
      }
      var param = {
        realName: this.basicInfoForm.realUserName,           // 真实姓名
        certificateType: this.basicInfoForm.certificateType,                            // 证件类型
        certificateNo: this.basicInfoForm.idCardNum        // 证件号码
      }
      var frontFile = this.basicInfoForm.idCardScanFrontFile
      var frontFileName = this.basicInfoForm.idCardScanFrontName
      var backFile = this.basicInfoForm.idCardScanBackFile
      var backFileName = this.basicInfoForm.idCardScanBackName
      // console.log(frontFile)
      // console.log(frontFileName)
      // console.log(backFile)
      // console.log(backFileName)
      var fileAndNames = [
        {param: 'frontFile', fileName: frontFileName, file: frontFile},
        {param: 'backFile', fileName: backFileName, file: backFile}
      ]
      // console.log(fileAndNames)
      // 提交form表单及身份证件文件
      var that = this
      LoadingBoxService.open('加载中...')
      ApiClient.uploadMultiFiles('pcapi/authentication/apply', fileAndNames, param).then(data => {
        console.log('data', data)
        LoadingBoxService.close()
        if (data) {
          // 点击按钮更改认证的状态status
          that.getInfo()
        }
      })
    }
  }
}
</script>
<style src="../../../css/btn.css"></style>
<style lang="css" scoped>
.xing{
  color: #ff3755;
}
.statusimg1{
  width: 55px;
  height: 55px;
  margin-right: 15px;
}
.statusimg{
  width: 140px;
  margin-right: -24px;
  margin-bottom: 24px;
  vertical-align: middle;
}
.errorClass {
  border: 1px solid #ff3755 !important;
}
.telReg {
  color: #ff3755;
  padding-left: 10px;
}
.tip {
  text-align: center;
  background-color: #fafafa;
  height: 24px;
  line-height: 24px;
}
.realNameCertificationcontent {
  padding: 15px 100px 0;
}
.realNameCertificationcontent .title {
  height: 40px;
  line-height: 40px;
  display: inline-block;
  border-bottom: 3px solid #fa4500;
  position: relative;
  top: 1px;
}
.realNameCertificationcontent .infobox {
  border-top: 1px solid #f1f1f1;
  padding-top: 30px;
  display: flex;
}
.realNameCertificationcontent .infobox .userinfo {
  flex: 1;
}
.realNameCertificationcontent .infobox .userinfo .infoItem {
  flex: 1;
  height: 40px;
  line-height: 40px;
  margin-top: 1px;
}

.realNameCertificationcontent .infobox .userinfo .infoItem > div {
  flex: 1;
  display: flex;
}
.realNameCertificationcontent .infobox .userinfo .infoItem1 {
  display: flex;
  line-height: 40px;
}

.realNameCertificationcontent .infobox .userinfo .infoItem1 > div {
  flex: 1;
  display: flex;
}
.titleName {
  flex: 3;
  display: inline-block;
  width: 80px;
  text-align: right;
}
.msginput {
  position: relative;
  margin: 0 5px;
  flex: 7;
}

.msginput input[disabled],
.msginput input {
  /* margin: 0 5px; */
  border: 1px solid #bfcbd9;
  outline: none;
  flex: 1;
  height: 30px;
  line-height: 30px;
  border-radius: 6px;
  padding-left: 11px;
  background-color: #fff;
  cursor: pointer;
  width: 321px;
  transition: all 0.5s;
  font-size: 12px;
}
/* .msginput input:hover{
  border: 1px solid #8391a5;
} */
.selectwidth {
  width: 331px;
  margin-left: -5px;
  position: relative;
}
.msginput input:focus {
  border: 1px solid #20a0ff;
}

.msginput1 ul {
  display: flex;
  width: 321px;
  justify-content: space-between;
  margin-top: 6px;
}
.msginput1 ul li {
  position: relative;
}
.msginput1 ul li .photo {
  opacity: 0;
  position: absolute;
}
.msginput1 ul li {
  width: 48%;
  height: 100px;
  border: 1px solid #bfcbd9;
  border-radius: 6px;
  cursor: pointer;
  background-color: #fff;
  overflow: hidden;
}
.msginput1 ul li label {
  display: block;
  height: 100px;
  cursor: pointer;
  text-align: center;
  line-height: 100px;
  color: #888888;
  font-style: normal;
  font-weight: normal;
  background: url(../../../images/photobg.png) center center no-repeat;
  overflow: hidden;
  position: relative;
}
.msginput1 ul li label img {
  width: 155px;
  height: 113px;
  border: none 0;
  position: absolute;
	z-index: 200;
  left: 50%;
  top: 50%;
	transform: translate(-50%,-50%);
}
.msginput1 ul li:hover {
  background-color: #f9f9f9;
}
.msginput1 p {
  color: #ff3755;
  line-height: 16px;
  margin-top: 10px;
}
.savebtn {
  display: flex;
  justify-content: center;
  padding-top: 26px;
  margin-right: 50px;
}
.btnBlue:hover{
  background-color: #639fea;
  border: 1px solid #5a90d4;
}
.certificationing {
  width: 100%;
  text-align: center;
  font-size: 17px;
  color: #343434;
  padding-top: 100px;
  letter-spacing: 1px;
}
.certificationing a{
  color: #ff3755 !important;
}
.certificationing .icon-tijiao1 {
  display: inline-block;
  vertical-align: middle;
  font-size: 50px;
  color: #3095fd;
  margin-right: 10px;
}
.certificationing .icon-qiyeyonghuzhuceshenhe {
  display: inline-block;
  vertical-align: middle;
  font-size: 50px;
  color: #3095fd;
  margin-right: 10px;
}
.time {
  color: red;
}
.jupmto {
  font-size: 14px;
}
.el-select {
    display: inline-block;
    position: relative;
    width: 321px;
    height: 30px !important;
}
.AllReg{
  width: 147px;
  padding: 5px 0 5px 23px;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 337px;
  background-color: #f8f8f8;
  border-radius: 6px;
  font-size: 12px;
}
.AllReg ul{
  position: relative;
  list-style-type: circle;
  color: #888;
  width: 150px;
  height: 50px;
}
.AllReg .icon-xiangzuojiantou{
  position: absolute;
  top:50%;
  transform: translateY(-50%);
  left: -35px;
  color: #f8f8f8;
}
.AllReg ul li{
  height: 25px;
  line-height: 25px;
}
.icon-shenpi_weitongguo{
  font-size: 80px;
  display:inline-block;
  vertical-align: middle; 
  margin-right: 10PX;
  color: #b8dfb2 !important;
}
.selectwidth .CertificateTypeTip{
  width: 200px;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 330px;
}
</style>
