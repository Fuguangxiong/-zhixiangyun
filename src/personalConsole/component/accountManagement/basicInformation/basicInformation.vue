<template>
  <div>
    <breadcrumb :data="breadcrumb"></breadcrumb>
    <p class="tip">请完善以下信息，方便我们更好的为您服务</p>
    <div class="basicInformationcontent">
      <h4 class="title">基本资料</h4>
      <div class="infobox">
        <div class="userpic">
          <img :src="imgDataUrl" alt="">
          <div @click="showUploadBox" class="changepic">更换头像</div>
          <avatar-set @changeImg="changeImg" :show="showupload" :userImg="imgDataUrl" @close="showupload = false"></avatar-set>
        </div>
        <div class="userinfo">
          <div class="infoItem">
            <div>
              <span class="mustEnter titleName">用户名：</span>
              <span>{{userInfo.userName}}</span>
            </div>
            <div></div>
          </div>
          <div class="infoItem">
            <div>
              <span class="mustEnter titleName">手机号：</span>
              <span>{{phone}}</span>
            </div>
            <div></div>
          </div>
          <div v-show="logintype === 'ENTERPRISE'" class="infoItem">
            <div>
              <span class="mustEnter titleName">所属企业：</span>
              <span>{{enterpriseName}}</span>
            </div>
            <div>
              <!-- <span class="mustEnter titleName">员工编号：</span>
              <span></span> -->
            </div>
          </div>
          <div v-show="userInfo.authStatus === 'AUTHORIZED'" class="infoItem">
            <div>
              <span class="mustEnter titleName">真实姓名：</span>
              <span>{{trueName}}</span>
            </div>
            <div></div>
          </div>
          <div class="infoItem">
            <div>
              <span class="titleName">备用邮箱：</span>
              <span>{{userInfo.email}}</span>
            </div>
            <div></div>
          </div>
          <!-- <div class="infoItem">
            <div>
              <span class="titleName">所属行业：</span>
              <myselect @change="changeIndustryData" :curvalue="userInfo.industry" preview="请选择" :data="industrydata"></myselect>
            </div>
            <div></div>
          </div> -->
          <div class="infoItem">
            <div>
              <span class="titleName">通讯地址：</span>
              <myselect preview="省" :curvalue="curProvincevalue" :data="provinceData" @change="changeProvinceData"></myselect>
              <myselect preview="市" :curvalue="curCityvalue" :data="cityData" @change="changeCityData"></myselect>
              <myselect preview="县" :curvalue="curAreavalue" :data="areaData" @change="changeAreaData"></myselect>
              <!-- <div class="msginput">
                <i class="iconfont icon-icon-up"></i>
                <input disabled placeholder="省" v-model="curIndustry" type="text">
                <div class="selectlist" v-show="showSelectlist">
                  <p class="selectlistItem" @click="curIndustry = item" v-for="(item,index) in industrydata" :key="index">{{item}}</p>
                </div>
              </div>
              <div class="msginput">
                <i class="iconfont icon-icon-up"></i>
                <input disabled placeholder="市" v-model="curIndustry" type="text">
                <div class="selectlist" v-show="showSelectlist">
                  <p class="selectlistItem" @click="curIndustry = item" v-for="(item,index) in industrydata" :key="index">{{item}}</p>
                </div>
              </div>
              <div class="msginput">
                <i class="iconfont icon-icon-up"></i>
                <input disabled placeholder="县" v-model="curIndustry" type="text">
                <div class="selectlist" v-show="showSelectlist">
                  <p class="selectlistItem" @click="curIndustry = item" v-for="(item,index) in industrydata" :key="index">{{item}}</p>
                </div>
              </div> -->
            </div>
            <div></div>
          </div>
          <div class="infoItem">
            <div>
              <span class="titleName">详细地址：</span>
              <div class="msginput">
                <input type="text" v-model="userInfo.officeAddress" maxlength="35">
              </div>
            </div>
            <div></div>
          </div>
          <!-- <div class="infoItem">
            <div>
              <span class="titleName">办公电话：</span>
              <div class="msginput">
                <input type="text" maxlength="12" v-model="userInfo.telephoneNo" @blur="checkTelephoneNo" @focus="errorTelephoneNo = false">
              </div>
            </div>
            <div>
              <span class="errorTip" v-show="errorTelephoneNo">！电话号码格式错误</span>
            </div>
          </div> -->
          <!-- <div class="infoItem">
            <div>
              <span class="titleName">传真：</span>
              <div class="msginput">
                <input type="text" maxlength="12" v-model="userInfo.fax" @blur="checkFax" @focus="errorFax = false">
              </div>
            </div>
            <div>
              <span class="errorTip" v-show="errorFax">！传真号码格式错误</span>
            </div>
          </div> -->
        </div>
      </div>
      <div class="savebtn">
        <button @click="uploadUserInfo" class="btnBlue">保存</button>
      </div>
    </div>
  </div>
</template>
<script>
import breadCrumb from '../../publicComponent/breadCrumb'
import select from '../../publicComponent/select'
import avatarSet from './avatarSet'
import apiClient from '../../../../publicJs/ApiClient.js'
import LoadingBoxService from '../../../../publicJs/LoadingBoxService.js'
import TipBoxService from '../../../../publicJs/TipBoxService.js'
import LOCATION from './PF_LOCATION.json'
import ToolService from '../../../common/ToolService'
import userService from '../../../../publicJs/userService'
export default {
  name: 'basicInformation',
  components: {
    'breadcrumb': breadCrumb,
    'myselect': select,
    'avatar-set': avatarSet
  },
  data () {
    return {
      breadcrumb: [{name: '账号管理', link: '/safetyManagement'}, {name: '基本资料', link: ''}],
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
      curIndustry: '',
      uesrName: '',
      imgDataUrl: '',
      showupload: false,
      provinceData: [],
      cityData: [],
      areaData: [],
      userInfo: {
        userName: '',
        phone: '',
        trueName: '',
        industry: '',
        email: '',
        telephoneNo: '',
        officeProvince: '',
        officeCity: '',
        officeArea: '',
        officeAddress: '',
        fax: ''
      },
      enterpriseName: '',
      phone: '',
      trueName: '',
      curProvincevalue: '',
      curCityvalue: '',
      curAreavalue: '',
      areaTable: LOCATION.RECORDS,
      logintype: '',
      errorTelephoneNo: false,
      errorFax: false
    }
  },
  mounted () {
    this.getProvinceData()
    this.getUserInfo()
    this.$parent.setActive('账号管理', '基本资料')
    this.logintype = sessionStorage.getItem('logintype')
    this.enterpriseName = sessionStorage.getItem('enterpriseName')
  },
  methods: {
    getUserInfo () {
      apiClient.get('pcapi/userInfo/getInfo').then((data) => {
        console.log('getUserInfo', data)
        this.userInfo = data
        this.phone = this.userInfo.phone.substring(0, 3) + '****' + this.userInfo.phone.substring(7, 11)
        if (this.userInfo.trueName) {
          this.trueName = '*' + this.userInfo.trueName.substr(1)
        }
        this.imgDataUrl = apiClient.apiBaseUrl + '/pcapi/enterprise/pcShowImage/avatar?imgPath=' + this.userInfo.image + '&token=' + apiClient.token
        var areaTable = LOCATION.RECORDS
        if (!this.userInfo.officeProvince) return
        for (var i = 0; i < areaTable.length; i++) {
          const el = areaTable[i]
          if (el.CODE === this.userInfo.officeProvince) {
            this.curProvincevalue = el.NAME
            break
          }
        }
        for (i; i < areaTable.length; i++) {
          const el = areaTable[i]
          if (el.CODE === this.userInfo.officeCity) {
            this.curCityvalue = el.NAME
            break
          }
        }
        for (i; i < areaTable.length; i++) {
          const el = areaTable[i]
          if (el.CODE === this.userInfo.officeArea) {
            this.curAreavalue = el.NAME
            break
          }
        }
        apiClient.get('pcapi/location/getList', {code: this.userInfo.officeProvince}).then((data) => {
          this.cityData = data
        })
        apiClient.get('pcapi/location/getList', {code: this.userInfo.officeCity}).then((data) => {
          this.areaData = data
        })
      })
    },
    changeImg (data) {
      this.imgDataUrl = data
      userService.storeInfo('image', data)
      this.$parent.$children[1].userimage = data
    },
    // 打开上传组件
    showUploadBox () {
      this.showupload = true
    },
    uploadUserInfo () {
      if (this.errorFax || this.errorTelephoneNo) {
        return
      }
      LoadingBoxService.open('保存中...')
      apiClient.post('pcapi/userInfo/updateBasicInfo', this.userInfo).then((data) => {
        // console.log('uploadUserInfo', data)
        LoadingBoxService.close()
        TipBoxService.open('保存成功', null, 1)
      })
    },
    getProvinceData () {
      // for (let i = 0; i < this.areaTable.length; i++) {
      //   const el = this.areaTable[i]
      //   if (el.CODE.substr(-4) === '0000') {
      //     let temp = {}
      //     temp.name = el.NAME
      //     temp.code = el.CODE
      //     temp.index = i
      //     this.provinceData.push(temp)
      //   }
      // }
      apiClient.get('pcapi/location/getList').then((data) => {
        // console.log('getProvinceData', data)
        this.provinceData = data
      })
    },
    getCityData (item) {
      // for (let i = item.index + 1; i < this.areaTable.length; i++) {
      //   const el = this.areaTable[i]
      //   if (el.CODE.substr(0, 2) === item.code.substr(0, 2) && el.CODE.substr(-2) === '00') {
      //     let temp = {}
      //     temp.name = el.NAME
      //     temp.code = el.CODE
      //     temp.index = i
      //     this.cityData.push(temp)
      //   }
      //   if (el.CODE.substr(0, 2) !== item.code.substr(0, 2)) break
      // }
      apiClient.get('pcapi/location/getList', {code: item.code}).then((data) => {
        // console.log('getCityData', data)
        this.cityData = data
      })
    },
    getAreaData (item) {
      // for (let i = item.index + 1; i < this.areaTable.length; i++) {
      //   const el = this.areaTable[i]
      //   if (el.CODE.substr(0, 4) === item.code.substr(0, 4)) {
      //     let temp = {}
      //     temp.name = el.NAME
      //     temp.code = el.CODE
      //     temp.index = i
      //     this.areaData.push(temp)
      //   } else {
      //     break
      //   }
      // }
      apiClient.get('pcapi/location/getList', {code: item.code}).then((data) => {
        // console.log('getAreaData', data)
        this.areaData = data
      })
    },
    changeProvinceData (item) {
      this.userInfo.officeProvince = item.code
      this.cityData = []
      this.areaData = []
      this.getCityData(item)
    },
    changeCityData (item) {
      this.userInfo.officeCity = item.code
      this.areaData = []
      this.getAreaData(item)
    },
    changeAreaData (item) {
      this.userInfo.officeArea = item.code
    },
    changeIndustryData (item) {
      this.userInfo.industry = item.name
    },
    checkTelephoneNo () {
      if (this.userInfo.telephoneNo.trim() === '') return
      if (!ToolService.regOfficePhone(this.userInfo.telephoneNo)) {
        this.errorTelephoneNo = true
      }
    },
    checkFax () {
      if (this.userInfo.fax.trim() === '') return
      if (!ToolService.regOfficePhone(this.userInfo.fax)) {
        this.errorFax = true
      }
    }
  }
}
</script>
<style lang="css" scoped>
.tip {
  text-align: center;
  background-color: #fafafa;
  height: 24px;
  line-height: 24px;
}
.basicInformationcontent {
  padding: 15px 100px 0;
  position: relative;
}
.basicInformationcontent .title {
  height: 40px;
  line-height: 40px;
  display: inline-block;
  border-bottom: 3px solid #fa4500;
  position: relative;
  top: 1px;
}
.basicInformationcontent .infobox {
  border-top: 1px solid #f1f1f1;
  padding-top: 30px;
  display: flex;
}
.basicInformationcontent .infobox .userpic {
  width: 72px;
  height: 72px;
  position: relative;
  border: 1px solid #ccc;
  overflow: hidden;
}
.basicInformationcontent .infobox .userpic img {
  width: 70px;
  height: 70px;
}
.basicInformationcontent .infobox .userpic .changepic {
  position: absolute;
  bottom: -20px;
  width: 100%;
  height: 20px;
  line-height: 20px;
  text-align: center;
  color: #fff;
  background-color: rgba(0, 0, 0, 0.6);
  cursor: pointer;
  transition: all 0.3s;
}
.basicInformationcontent .infobox .userpic:hover .changepic {
  bottom: 0;
}
.basicInformationcontent .infobox .userinfo {
  flex: 1;
  padding-left: 70px;
}
.basicInformationcontent .infobox .userinfo .infoItem {
  display: flex;
  height: 40px;
  line-height: 40px;
}
.basicInformationcontent .infobox .userinfo .infoItem > div {
  flex: 1;
  display: flex;
}
.titleName {
  display: inline-block;
  width: 80px;
  text-align: right;
}
.mustEnter::before {
  content: "*";
  color: red;
  margin-right: 5px;
}
.msginput {
  position: relative;
  margin: 0 5px;
  flex: 1;
}
.msginput input[disabled],
.msginput input {
  /* margin: 0 5px; */
  border: 1px solid #bfcbd9;
  outline: none;
  flex: 1;
  height: 30px;
  line-height: 30px;
  border-radius: 4px;
  padding-left: 10px;
  background-color: #fff;
  width: 100%;
}
.msginput input:focus {
  border: 1px solid #20a0ff;
}
.msginput i.icon-icon-up {
  color: #bfcbd9;
  font-size: 14px;
  position: absolute;
  top: 0px;
  right: 13px;
  z-index: 10;
  transition: transform 0.3s;
}
.msginput.active i.icon-icon-up {
  transform: rotate(180deg);
}
.msginput.active input {
  border: 1px solid #20a0ff;
}
.msginput .selectlist {
  position: absolute;
  top: 40px;
  width: 100%;
  border: 1px solid #bfcbd9;
  z-index: 20;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  transition: height 3s;
}
.msginput .selectlist p {
  padding-left: 10px;
  cursor: pointer;
}
.msginput .selectlist p:hover {
  background-color: #e4e8f1;
}
.savebtn {
  text-align: center;
  padding-top: 20px;
  padding-bottom: 10px;
  margin-right: 160px;
}
.errorTip {
  color: #ff3754;
  padding-left: 10px;
}
</style>
