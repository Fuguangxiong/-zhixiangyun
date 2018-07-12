<template>
<div class="maincontent">
  <breadcrumb :data="breadCrumb"></breadcrumb>
  <div class="section-box">
    <div class="auth-title">
      <span class="section-one">基本信息</span>
    </div>
    <div class="auth-content">
      <div class="left-blank"></div>
      <div class="right-info">
        <div class="content-line">
          <span><span class="ei-title">企业名称：</span><span class="leftblank">{{enterpriseName}}</span></span>
          <span><span class="ei-title">营业执照注册号：</span><span>{{licenseId}}</span></span>
        </div>
        <div class="content-line">
          <span><span class="ei-title">法人代表：</span><span class="leftblank">{{artificialPerson}}</span></span>
          <span><span class="ei-title">法人代表身份证号码：</span><span>{{artificialPersonId}}</span></span>
        </div>
      </div>
    </div>
  </div>
  <div class="section-box">
    <div class="auth-title edit-title">
      <span class="section-two" :class="{edit:isEdit}">详细信息</span>
      <span class="edit-icon" title="编辑" @click="edit" :class="{edit:isEdit}"></span>
    </div>
    <div class="auth-content content-two" :class="{edit:isEdit}">
      <div class="left-blank2"></div>
      <div class="right-info">
        <div class="content-line">
          <span>
            <span class="ei-title"> <i>*</i>所在城市：</span>
            <span>
              <div class="select-box" v-show="isEdit">
                <myselect preview="省" :curvalue="editProvince" :data="provinceData" @change="changeProvinceData" :entManage="true"></myselect>
                <span class="select-blank"></span>
                <myselect preview="市" :curvalue="editCity" :data="cityData" @change="changeCityData" :entManage="true"></myselect>
              </div>
              <span class="selected-box leftblank" v-show="!isEdit">
                <em>{{province}}</em>
                <span class="select-blank"></span>
                <em>{{city}}</em>
              </span>
            </span>
          </span>
        </div>
        <div class="content-line">
          <span>
            <span class="ei-title"> <i>*</i>详细地址：</span>
            <span>
              <input type="text" v-model="editAddress" v-show="isEdit" maxlength="30" @blur="checkAddress" @focus="errorAddress = false" :class="{error:errorAddress}"><em class="error-tips" v-show="isEdit&&errorAddress">！请输入地址信息</em>
              <span v-show="!isEdit" class="leftblank">{{address}}</span>
            </span>
          </span>
        </div>
        <div class="content-line">
          <span>
            <span class="ei-title"> <i>*</i>所属行业：</span>
            <span>
              <myselect @change="changeIndustryData" :curvalue="editBusinessType" preview="请选择" :data="industrydata" v-show="isEdit" :entManage="true"></myselect>
              <span v-show="!isEdit" class="leftblank">{{businessType}}</span>
            </span>
          </span>
        </div>
        <div class="content-line">
          <span>
            <span class="ei-title">联系电话：</span>
            <span>
              <input type="text" v-model="editPhone" v-show="isEdit" @blur="checkPhone" @focus="errorPhone = false" :class="{error:errorPhone}" maxlength="13"><em class="error-tips" v-show="isEdit&&errorPhone">！请输入格式正确的电话号码</em>
              <span v-show="!isEdit" class="leftblank">{{phone}}</span>
            </span>
          </span>
        </div>
        <div class="content-line">
          <span>
            <span class="ei-title">办公电话：</span>
            <span>
              <input type="text" v-model="editOfficePhone" v-show="isEdit" @blur="checkOfficePhone" @focus="errorOfficePhone = false" :class="{error:errorOfficePhone}" maxlength="13"><em class="error-tips" v-show="isEdit&&errorOfficePhone">！请输入格式正确的办公号码</em>
              <span v-show="!isEdit" class="leftblank">{{officePhone}}</span>
            </span>
          </span>
        </div>
        <div class="content-line">
          <span>
            <span class="ei-title">传真号码：</span>
            <span>
              <input type="text" v-model="editFax" v-show="isEdit" @blur="checkFax" @focus="errorFax = false" :class="{error:errorFax}" maxlength="13"><em class="error-tips" v-show="isEdit&&errorFax">！请输入格式正确的传真号码</em>
              <span v-show="!isEdit" class="leftblank">{{fax}}</span>
            </span>
          </span>
        </div>
        <transition name="fade">
          <div class="content-line button-box" v-show="isEdit">
            <button class="btnBlue" @click="save">保存</button>
            <button class="btnGray" @click="cancel">取消</button>
          </div>  
        </transition>
      </div>
      <div class="right-blank"></div>
    </div>
  </div>
</div>
</template>
<script>
import breadCrumb from '../../personalConsole/component/publicComponent/breadCrumb'
import tipBoxService from '../../publicJs/TipBoxService'
import loadingBoxService from '../../publicJs/LoadingBoxService'
import select from '../../personalConsole/component/publicComponent/select'
import LOCATION from '../../personalConsole/component/accountManagement/basicInformation/PF_LOCATION.json'
import apiClient from '../../publicJs/ApiClient'
import ToolService from '../../personalConsole/common/ToolService'
export default {
  name: 'personalAuthenticationDetail',
  components: {
    'breadcrumb': breadCrumb,
    'myselect': select
  },
  data () {
    return {
      breadCrumb: [{name: '企业信息', link: ''}],
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
      provinceData: [],
      cityData: [],
      enterpriseName: '',
      licenseId: '',
      artificialPerson: '',
      artificialPersonId: '',
      province: '',
      city: '',
      address: '',
      businessType: '',
      phone: '',
      officePhone: '',
      fax: '',
      editProvince: '',
      editCity: '',
      editAddress: '',
      editBusinessType: '',
      editPhone: '',
      editOfficePhone: '',
      editFax: '',
      officeProvince: '',
      officeCity: '',
      isEdit: false,
      areaTable: LOCATION.RECORDS,
      errorAddress: false,
      errorPhone: false,
      errorOfficePhone: false,
      errorFax: false,
      id: ''
    }
  },
  mounted () {
    let provinceCode = {}
    this.id = sessionStorage.getItem('enterpriseId')
    if (this.id === '') return
    loadingBoxService.open('加载中...')
    apiClient.get('pcapi/enterprise/queryEnterpriseById', {id: this.id}).then(data => {
      console.log('info', data)
      this.enterpriseName = data.name
      this.licenseId = data.businessNo
      this.artificialPerson = data.corporate
      this.artificialPersonId = data.cardId
      provinceCode.code = data.province
      var areaTable = LOCATION.RECORDS
      if (data.province) {
        for (var i = 0; i < areaTable.length; i++) {
          const el = areaTable[i]
          if (el.CODE === data.province) {
            this.province = el.NAME
            break
          }
        }
        for (i; i < areaTable.length; i++) {
          const el = areaTable[i]
          if (el.CODE === data.city) {
            this.city = el.NAME
            break
          }
        }
      }
      this.address = data.address
      this.businessType = data.industry
      this.phone = data.phone
      this.officePhone = data.telephone
      this.fax = data.faxNumber
      loadingBoxService.close()
      this.copyData()
      this.getProvinceData()
      this.getCityData(provinceCode)
    }).catch(e => {
      loadingBoxService.close()
      console.log(e)
    })
  },
  methods: {
    edit () {
      this.isEdit = true
    },
    save () {
      this.checkPhone()
      this.checkOfficePhone()
      this.checkFax()
      if (this.errorAddress || this.errorFax || this.errorPhone || this.errorOfficePhone) return
      let param = {
        id: this.id,
        province: this.officeProvince,
        city: this.officeCity,
        address: this.editAddress,
        industry: this.editBusinessType,
        phone: this.editPhone,
        telephone: this.editOfficePhone,
        faxNumber: this.editFax
      }
      loadingBoxService.open('请稍候...')
      apiClient.get('pcapi/enterprise/updateEnterprise', param).then(data => {
        tipBoxService.open('保存成功', null, 1)
        this.editData() // 数据改写
        this.isEdit = false
        loadingBoxService.close()
      }).catch(e => {
        tipBoxService.open('保存失败', 2, 2)
        loadingBoxService.close()
      })
    },
    cancel () {
      this.copyData() // 数据还原
      this.isEdit = false
    },
    changeIndustryData (item) {
      this.editBusinessType = item.name
    },
    getProvinceData () {
      apiClient.get('pcapi/location/getList').then((data) => {
        this.provinceData = data
      })
    },
    getCityData (item) {
      apiClient.get('pcapi/location/getList', {code: item.code}).then((data) => {
        this.cityData = data
      })
    },
    changeProvinceData (item) {
      this.officeProvince = item.code
      this.editProvince = item.name
      this.cityData = []
      this.getCityData(item)
    },
    changeCityData (item) {
      this.officeCity = item.code
      this.editCity = item.name
    },
    copyData () {
      this.editProvince = this.province
      this.editCity = this.city
      this.editAddress = this.address
      this.editBusinessType = this.businessType
      this.editPhone = this.phone
      this.editOfficePhone = this.officePhone
      this.editFax = this.fax
    },
    editData () {
      this.province = this.editProvince
      this.city = this.editCity
      this.address = this.editAddress
      this.businessType = this.editBusinessType
      this.phone = this.editPhone
      this.officePhone = this.editOfficePhone
      this.fax = this.editFax
    },
    checkAddress () {
      if (this.editAddress.trim() === ''){
        this.errorAddress = true
      }
    },
    checkPhone () {
      if (this.editPhone.trim() !== '' && !ToolService.regPhone(this.editPhone)) {
        this.errorPhone = true
      } else {
        this.errorPhone = false
      }
    },
    checkOfficePhone () {
      if (this.editOfficePhone.trim() !== '' && !ToolService.regOfficePhone(this.editOfficePhone)) {
        this.errorOfficePhone = true
      } else {
        this.errorOfficePhone = false
      }
    },
    checkFax () {
      if (this.editFax.trim() !== '' && !ToolService.regOfficePhone(this.editFax)) {
        this.errorFax = true
      } else {
        this.errorFax = false
      }
    }
  }
}
</script>
<style scoped>
  .maincontent{
    position: relative;
    width: 100%;
    height: 100%;
    min-height: 500px;
    min-width: 800px;
  }
  .section-box{
    margin-top: 26px;
  }
  .section-box .content-two{
    padding-top: 10px;
  }
  .section-box:last-child{
    margin-top: 6px;
  }
  .section-box .auth-title{
    height: 30px;
    background: #F8F8F8;
    border: 1px solid #f1f1f1;
    border-left: 4px solid #f1f1f1;
    line-height: 30px;
    margin-bottom: 5px;
    position: relative; 
  }
  .section-box .auth-title .section-two{
    transition: all 0.3s;
  }
  .section-box .auth-title>span:before{
    width: 16px;
    height: 16px;
    content: '';
    display: inline-block;
    position: relative;
    top: 3px;
    margin: 0 6px;
  }
  .section-box .edit-title .edit-icon{
    width: 16px;
    height: 16px;
    content: '';
    display: inline-block;
    position: absolute;
    right: 5px;
    top: 1px;
    padding: 5px;
    box-sizing: content-box;
    cursor: pointer;
    background: url('../images/em-edit.png') no-repeat content-box;
  }
  .section-box .edit-title .edit-icon:hover{
    background: url('../images/em-edit1.png') no-repeat content-box;
  }
  .section-box .edit-title .edit-icon.edit {
    background: url('../images/em-edit1.png') no-repeat content-box;
    cursor: default;
  }
  .section-box .auth-title .section-one:before{
    background: url('../images/em-baseinfo.png');
  }
  .section-box .auth-title .section-two:before{
    background: url('../images/em-detailinfo.png');
  }
  .section-box .auth-title .section-two.edit:before{
    background: url('../images/em-detailinfo1.png');
  }
  .section-box .auth-title .section-two.edit{
    color: #55a8df;
    transition: all .3s;
  }
  .section-box .longsection{
    height: 240px;
  }
  .section-box .auth-content{
    display: flex;
  }
  .section-box .auth-content .left-blank{
    flex: 1;
  }
  .section-box .auth-content .right-info{
    flex: 6;
  }
  .section-box .auth-content .left-blank2{
    flex: 2;
  }
  .section-box .auth-content .right-blank{
    flex: 6;
  }
  .section-box .auth-content .right-info .content-line{
    display: flex;
    height: 40px;
    line-height: 40px;
  }
  .section-box .auth-content .right-info .content-line>span{
    flex: 1;
    display: flex;
    position: relative;
  }
  .section-box .auth-content .right-info .content-line>span:first-child span:first-child{
    flex: 1;
  }
  .section-box .auth-content .right-info .content-line>span:first-child span:last-child{
    flex: 4;
  }
  .section-box .auth-content .right-info .content-line>span span:first-child{
    flex: 2;
  }
  .section-box .auth-content .right-info .content-line>span span:last-child{
    flex: 5;
  }
  .section-box .auth-content .right-info .content-line>span span:last-child input{
    height: 30px;
    line-height: 30px;
    padding-left: 6px;
    border-radius: 6px;
    border: 1px solid #d9d9d9;
    width: 90%;
  }
  .section-box .auth-content .right-info .content-line>span span:last-child .error{
    border: 1px solid #ff3755;
  }
  .section-box .auth-content .right-info .content-line>span span:last-child input:focus{
    border: 1px solid #55a8fd;
  }
  .section-box .auth-content .right-info .content-line .select-box{
    display: flex;
    width: 90%;
  }
  .section-box .auth-content .right-info .content-line .select-box .select-blank{
    width: 14px;
    height: 30px;
    display: inline-block;
  }
  .section-box .auth-content .right-info .content-line .selected-box .select-blank{
    width: 21px;
    height: 30px;
    display: inline-block;
  }
  .section-box .auth-content .right-info .content-line .selected-box{
    width: 90%;
    display: flex;
  }
  .section-box .auth-content .right-info .content-line .selected-box em{
    font-style: normal;
    flex: 1;
  }
  .section-box .auth-content .right-info .content-line.button-box{
    display: block;
    line-height: 30px;
    text-align: center;
    margin-top: 25px;
  }
  .section-box .auth-content .right-info .content-line.button-box button{
    text-align: center;
    line-height: 28px;
  }
  .section-box .auth-content .right-info .button-box .btnBlue{
    margin-right: 30px;
  }
  .content-line .msginput{
    margin: 0;
    width: 90%;
  }
  .leftblank{
    padding-left: 7px;
  }
  .error-tips{
    font-style: normal;
    position: absolute;
    width: 160px;
    left: 95%;
    top: 0;
    color: #ff3755;
  }
  .ei-title {
    font-weight: bold;
  }
  .ei-title i{
    position: absolute;
    left:-12px;
    top:0;
    font-style: normal;
    vertical-align: baseline;
    color: #fa3753;
  }
</style>

