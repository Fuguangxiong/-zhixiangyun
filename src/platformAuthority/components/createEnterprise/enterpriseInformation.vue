<template>
  <div>
    <div class="commonRightBottoTopContainer">
      <right-top-nav :links="topNavData.breadLinks" :noInput="true" :searchname="topNavData.searchTitle" :searchword="topNavData.searchWord" v-on:search="topNavSearchHandler"></right-top-nav>
    </div>
    <div class="commonRightBottoBottomContainer">
      <div class="publicWidthHeightContainer">
        <div class="commonLayoutRightBottomContainer" style="background:#fff;">
          <el-form class="basicInfoFiled" :model="basicInfoForm" :rules="basicInfoRule" label-width="150px" style="width:830px;padding-top:40px;padding-bottom: 40px;height:100%;margin:0 auto">
            <el-form-item label="用户姓名" prop="userName">
              <el-input v-model="basicInfoForm.userName "></el-input>
            </el-form-item>
            <el-form-item label="用户身份证号码" prop="userCard">
              <el-input v-model="basicInfoForm.userCard ">
              </el-input>
            </el-form-item>
            <el-form-item label="身份证扫描件" prop="idScan">
              <div style="height:280px;width:220px;overflow: hidden;position:relative;padding-top:30px;float:left;" prop="idCardScanFront">
                <p class="idScanFront">正面</p>
                <img v-if="basicInfoForm.idCardScanFront!==''" v-bind:src="basicInfoForm.idCardScanFront" class="headerImage" />
                <div v-else class="uploadFileButton">
                </div>
                <span class="view" v-on:click="lookBigImg(basicInfoForm.idCardScanFront)">点击查看模板</span>
                <button class="uploadBtn"><input type="file" id="uploadFile1" @change="saveFilePathFront" /style="height:100%;width:100%;cursor:pointer">上传图片</button>

              </div>
              <div style="height:280px;width:220px;overflow: hidden;position:relative;padding-top:30px;float:left;margin-left:78px;" prop="idCardScanBack">
                <p class="idScanSide">反面</p>
                <img v-if="basicInfoForm.idCardScanBack!==''" v-bind:src="basicInfoForm.idCardScanBack" class="headerImage" />
                <div v-else class="uploadFileButton">
                </div>

                <span class="view" v-on:click="lookBigImg(basicInfoForm.idCardScanBack)">点击查看模板</span>
                <button class="uploadBtn"><input type="file" id="uploadFile2" @change="saveFilePathSide" />上传图片</button>
              </div>
              <div style="float:left;width:140px;padding-top:68px;color:#b3b3b3;font-size:12px;margin-left:20px;line-height:20px">请提供证件的原件照片或彩色扫描件，文字/盖章清晰可辨认格式要求jpg、jpeg、png,不超过10M</div>
            </el-form-item>
            <el-form-item label="企业名称" prop="enterpriseName">
              <el-input v-model="basicInfoForm.enterpriseName "></el-input>
            </el-form-item>
            <el-form-item label="营业执照注册号" prop="blregistNum">
              <el-input v-model="basicInfoForm.blregistNum "></el-input>
            </el-form-item>
            <el-form-item label="营业执照扫描件" prop="blscanCopy">
              <div style="height:280px;width:220px;overflow: hidden;position:relative;padding-top:40px;float:left">
                <img v-if="basicInfoForm.blscanCopy!==''" v-bind:src="basicInfoForm.blscanCopy" class="headerImage" />
                <div v-else class="uploadFileButton">
                </div>

                <span class="view" v-on:click="lookBigImg(basicInfoForm.blscanCopy)">点击查看模板</span>
                <button class="uploadPartBtn"><input type="file" id="uploadFile3" @change="saveFilePath" />上传图片</button>
              </div>
              <div style="float:left;width:140px;padding-top:50px;color:#b3b3b3;font-size:12px;margin-left:20px;line-height:20px">请提供证件的原件照片或彩色扫描件(正副本均可)，文字/盖章清晰可辨认格式要求jpg、jpeg、png,不超过10M</div>
            </el-form-item>
            <el-form-item label="法人代表" prop="legalDelegate">
              <el-input v-model="basicInfoForm.legalDelegate "></el-input>
            </el-form-item>
            <el-form-item label="法人代表身份证号" prop="legalDelegateId">
              <el-input v-model="basicInfoForm.legalDelegateId "></el-input>
            </el-form-item>
            <el-form-item label="所在城市" prop="companyAddress">
              <el-select filterable placeholder="请选择省份" style="float:left;" @change="provinceSelected" v-model="basicInfoForm.province">
                <el-option v-for="item in listData" :key="item.id" :label="item.divisionsName" :value="item.divisionsName">
                </el-option>
              </el-select>
              <el-select filterable placeholder="请选择城市" style="float:left" v-model="basicInfoForm.city">
                <el-option v-for="item in authTree" :key="item.id" :label="item.divisionsName" :value="item.divisionsName">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="详细地址" prop="detailedAddress">
              <el-input v-model="basicInfoForm.detailedAddress" style="width:100%!important"></el-input>
            </el-form-item>

            <el-button @click="saveBasicInfo" type="success" style="padding:10px 25px;margin-left:40%;margin-top:20px;margin-bottom:15px">提交</el-button>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import rightTopNav from '../../components/CommonRightTopNavComponent.vue'
import HttpService from '../../../publicJs/ApiClient'
import TipBoxService from '../../../publicJs/TipBoxService'
import NoticeBoxService from '../../../publicJs/NoticeBoxService'
import transfer from '../../components/MyTransfer.vue'
import publicNavData from '../../publicJs/TransformLeftNavData'
import ToolService from '../../publicJs/ToolService'
import commonTable from '../../components/CommonTableComponent.vue'
export default {
  name: 'enterpriseInformation',
  components: {
    'right-top-nav': rightTopNav,
    'my-component': commonTable,
    'my-transfer': transfer
  },
  data () {
    return {
      menuName: '创建企业',
      // 面包屑信息
      topNavData: {
        breadLinks: [{
          name: '创建企业',
          link: '#'
        }, {
          name: '账填写企业信息',
          link: '#'
        }]
      },
      listData: [],
      authTree: [],
      leftNavData: [],
      publicTopNavData: [],
      // 基础信息表单
      basicInfoForm: {
        id: '',
        userName: '', // 用户名
        userCard: '', // 身份证号
        idCardScanFront: '', // 身份正面证扫描件
        idCardScanFront2: '',
        idCardScanBack: '', // 身份反面证扫描件
        idCardScanBack2: '',
        enterpriseName: '', // 企业名称
        blregistNum: '', // 营业执照注册号
        blscanCopy: '', // 营业执照扫描件
        blscanCopy2: '',
        legalDelegate: '', // 法人代表
        legalDelegateId: '', // 法人代表身份证号
        companyAddress: '', // 公司地址
        province: '', // 所在省份
        city: '', // 所在城市
        detailedAddress: '' //详细地址
      },
      // 基础信息表单验证规则
      basicInfoRule: {
        userName: [{
          required: true,
          trigger: 'blur',
          message: '请输入用户姓名'
        }, {
          max: 15,
          message: '用户姓名最长为15个字',
          trigger: 'blur'
        }],
        userCard: [{
          required: true,
          trigger: 'blur',
          message: '请输入身份证号'
        }],
        idScan: [{
          required: true,
          trigger: 'blur',
          message: '请上传身份证正面扫描件'
        }],
        idCardScanFront: [{
          required: true,
          trigger: 'blur',
          message: '请上传身份证正面扫描件'
        }],
        idCardScanBack: [{
          required: true,
          trigger: 'blur',
          message: '请上传身份证反面扫描件'
        }],
        enterpriseName: [{
          required: true,
          trigger: 'blur',
          message: '请输入企业名称'
        }],
        blregistNum: [{
          required: true,
          trigger: 'blur',
          message: '请输入营业执照注册号'
        }],
        blscanCopy: [{
          required: true,
          trigger: 'blur',
          message: '请上传营业执照扫描件'
        }],
        legalDelegate: [{
          required: true,
          trigger: 'blur',
          message: '请输入法人代表'
        }],
        legalDelegateId: [{
          required: true,
          trigger: 'blur',
          message: '请输入法人代表身份证号'
        }],
        companyAddress: [{
          required: true,
          trigger: 'blur'
        }],
        detailedAddress: [{
          required: true,
          trigger: 'blur',
          message: '请输入详细地址'
        }]
      }
    }
  },
  mounted () {
    this.$parent.hub.$on('getPriviData', (data) => {
      this.publicTopNavData = data
    })
    // 获取上个页面传过来的id
    var id = ToolService.getQueryString('id')
    this.tableLinkHandler(id)
  },
  methods: {
    topNavSearchHandler: function (data) {
      console.info('search=', data)
      // window.location.href = 'createEnterprise.html?word=' + data
      this.$router.push('createEnterprise?word=' + data)
    },
    selectParentDepart: function () {
      var that = this
      if (this.basicInfoForm.pId !== '') {
        that.departTransfer.newData = [{
          id: this.basicInfoForm.pId,
          label: this.basicInfoForm.parentDepart
        }]
      } else {
        that.departTransfer.newData = []
      }
      that.departTransfer.openNum++
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    // 获取省份、城市数据
    tableLinkHandler (data) {
      var that = this
      //后台的接口
      HttpService.get('priviapi/enterprise/searchCity', { param: '' }, function (data) {
        console.info('信息请求=', data)
        that.listData = data.data
        console.info('asdasjdasj=', that.listData)
      })
    },
    provinceSelected: function (divisionsName) {
      console.info('dfkdjfd')
      var that = this
      var param = { param: divisionsName }
      HttpService.get('priviapi/enterprise/searchCity', param, function (data) {
        if (data.status == '200') {
          that.authTree = data.data
        }
        console.info('aaaaaaaaa=', that.authTree)
      })
    },
    // 保存基本信息
    saveBasicInfo: function () {
      this.basicInfoForm.userName = ToolService.trimStr(this.basicInfoForm.userName)
      if (this.basicInfoForm.userName == '') {
        TipBoxService.open('请输入姓名', 2)
        return false
      } else {
        if (this.basicInfoForm.userName.length > 15) {
          TipBoxService.open('姓名不可以超过15个字', 2)
          return false
        }
        if (!ToolService.regUserName(this.basicInfoForm.userName)) {
          TipBoxService.open('姓名只可输入汉字和英文', 2)
          return false
        }
      }
      if (this.basicInfoForm.userCard == '') {
        TipBoxService.open('请输入身份证号', 2)
        return false
      } else {
        if (this.basicInfoForm.userCard !== '') {
          if (!ToolService.regIDCard(this.basicInfoForm.userCard)) {
            TipBoxService.open('请输入18位数字或字母（只限最后一位）', 2)
            return false
          }
        }
      }
      if (this.basicInfoForm.idScanFront == '') {
        TipBoxService.open('请上传身份证正面扫描件', 2)
        return false
      }
      if (this.basicInfoForm.idScanSide == '') {
        TipBoxService.open('请上传身份证反面扫描件', 2)
        return false
      }
      if (this.basicInfoForm.companyName == '') {
        TipBoxService.open('请输入企业名称', 2)
        return false
      }
      if (this.basicInfoForm.blregistNum == '') {
        TipBoxService.open('请输入营业执照注册号', 2)
        return false
      }
      if (this.basicInfoForm.blscanCopy == '') {
        TipBoxService.open('请上传营业执照扫描件', 2)
        return false
      }
      if (this.basicInfoForm.legalDelegate == '') {
        TipBoxService.open('请输入法人代表', 2)
        return false
      } else {
        if (this.basicInfoForm.legalDelegate.length > 15) {
          TipBoxService.open('法人代表不可以超过15个字', 2)
          return false
        }
        if (!ToolService.regUserName(this.basicInfoForm.legalDelegate)) {
          TipBoxService.open('法人代表只可输入汉字和英文', 2)
          return false
        }
      }
      if (this.basicInfoForm.legalDelegateId == '') {
        TipBoxService.open('请输入法人代表身份证号', 2)
        return false
      } else {
        if (this.basicInfoForm.legalDelegateId !== '') {
          if (!ToolService.regIDCard(this.basicInfoForm.legalDelegateId)) {
            TipBoxService.open('请输入18位数字或字母（只限最后一位）', 2)
            return false
          }
        }
      }
      if (this.basicInfoForm.province == '') {
        TipBoxService.open('请选择所在省份', 2)
        return false
      }
      if (this.basicInfoForm.city == '') {
        TipBoxService.open('请选择所在城市', 2)
        return false
      }
      if (this.basicInfoForm.detailedAddress == '') {
        TipBoxService.open('请输入详细地址', 2)
        return false
      } else {
        if (this.basicInfoForm.detailedAddress !== '') {
          if (this.basicInfoForm.detailedAddress.length > 100) {
            TipBoxService.open('详细地址不可以超过100个字', 2)
            return false
          }
        }
      }
      var param = {
        data: {
          id: this.basicInfoForm.id,
          userName: this.basicInfoForm.userName, // 用户名
          userCard: this.basicInfoForm.userCard, // 身份证号
          idCardScanFront: this.basicInfoForm.idCardScanFront2, // 身份证正面扫描件
          idCardScanBack: this.basicInfoForm.idCardScanBack2, // 身份证反面扫描件
          enterpriseName: this.basicInfoForm.enterpriseName, // 企业名称
          blregistNum: this.basicInfoForm.blregistNum, // 营业执照注册号
          blscanCopy: this.basicInfoForm.blscanCopy2, // 营业执照扫描件
          legalDelegate: this.basicInfoForm.legalDelegate, // 法人代表
          legalDelegateId: this.basicInfoForm.legalDelegateId, // 法人代表身份证号
          companyAddress: this.basicInfoForm.province + this.basicInfoForm.city, // 公司地址
          province: this.basicInfoForm.province, // 所在省份
          city: this.basicInfoForm.city, // 所在城市
          detailedAddress: this.basicInfoForm.detailedAddress //详细地址
        }
      }
      var that = this
      HttpService.post('priviapi/enterprise/saveEnterprise', 'param=' + JSON.stringify(param), function (data) {
        console.info('aaaaaaa=', data)
        if (data.status == '200') {
          TipBoxService.open('保存成功', 0)
          setTimeout(function () {
            // window.location.href = 'createEnterprise.html';
            that.$router.push('/createEnterprise')
          }, 2 * 1000)
        }
      }).catch((error) => {
        if (error.response.data.status == '503') {
          TipBoxService.open(error.response.data.exception, 2)
        }
      })
    },
    linkChangeHandler (link) {
      publicNavData.gotoLeftNavLink(link.link)
    },
    // 点击查看模板（大图）
    lookBigImg (url) {
      window.open(url)
    },
    // 上传身份证正面
    saveFilePathFront (data) {
      console.info('dfdfdf=', data)
      var file = data.currentTarget.files[0]
      var filePath = event.currentTarget.files[0].name
      if (!/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(filePath)) {
        TipBoxService.open('只能选择图片文件', 2)
        return false
      }
      var that = this
      HttpService.upload('priviapi/addImg/addImgs?param=', file, function (data) {
        console.info('dkfjdjfj=', data)
        //var obj=JSON.parse(data);
        if (data.status == 'success') {
          that.basicInfoForm.idCardScanFront2 = data.pathUrl
          that.basicInfoForm.idCardScanFront = HttpService.apiBaseUrl + data.pathUrl
        }
      })
    },
    // 上传身份证反面
    saveFilePathSide (data) {
      console.info('dfdfdf=', data)
      var file = data.currentTarget.files[0]
      var filePath = event.currentTarget.files[0].name
      if (!/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(filePath)) {
        TipBoxService.open('只能选择图片文件', 2)
        return false
      }
      var that = this
      HttpService.upload('priviapi/addImg/addImgs?param=', file, function (data) {
        console.info('dkfjdjfj=', data)
        //var obj=JSON.parse(data);
        if (data.status == 'success') {
          that.basicInfoForm.idCardScanBack2 = data.pathUrl
          that.basicInfoForm.idCardScanBack = HttpService.apiBaseUrl + data.pathUrl
        }
      })
    },
    // 上传营业执照
    saveFilePath (data) {
      console.info('dfdfdf=', data)
      var file = data.currentTarget.files[0]
      var filePath = event.currentTarget.files[0].name
      if (!/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(filePath)) {
        TipBoxService.open('只能选择图片文件', 2)
        return false
      }
      var that = this
      HttpService.upload('priviapi/addImg/addImgs?param=', file, function (data) {
        console.info('dkfjdjfj=', data)
        //var obj=JSON.parse(data);
        if (data.status == 'success') {
          that.basicInfoForm.blscanCopy2 = data.pathUrl
          that.basicInfoForm.blscanCopy = HttpService.apiBaseUrl + data.pathUrl
        }
      })
    }
  }
}
</script>
<style src="../../css/enterpriseInformation.css" scoped></style>
