<template>
    <div>
        <breadcrumb :data="breadcrumb"></breadcrumb>
        <div class="userinfo clearfix" v-if="userInfo.authStatus=='AUTHORIZED'">
            <div class="success-icon" v-show="authenticated">
                <i class="iconfont icon-xuanzhong"></i>
            </div>
            <div class="data-left">
                <span class="normal-info">用户名：{{userInfo.name}}</span>
                <span class="normal-info">手机号码：{{userInfo.phone}}</span>
                <span class="identify-info" v-show="authenticated">身份所属：{{userInfo.identity}}</span>
            </div>
            <div class="data-right" v-show="authenticated">
                <span v-show="authenticated"></span>
                <span class="identify-info" v-show="authenticated">真实姓名：{{userInfo.realName}}</span>
                <span class="identify-info" v-show="authenticated">身份证号：{{userInfo.idCard}}</span>
            </div>
            <div class="authenticated" v-show="authenticated">
                <img src="../../../images/renzheng.png">
            </div>
            <div class="unauthorized" v-show="authorizing">
                <span>您的账号正在实名认证中。</span>
            </div>
            <div class="unauthorized" v-show="unauthorized">
                <span>您的账号未通过实名认证。</span>
                <span class="setting">立即认证</span>
            </div>
        </div>
        <div class="userinfoone" v-if="userInfo.authStatus=='UNAUTHORIZED'">
            <div class="normal-infoone">用户名：{{userInfo.name}}</div>
            <div class="normal-infoone">手机号码：{{userInfo.phone}}</div> 
            <div class="normal-infoone">
              身份所属：{{userInfo.identity}}
              <span class="realname">您的账号未认证。 <router-link :to="{name:'realNameCertification'}" style="color: #FF6104;">立即认证</router-link></span>
            </div> 
            
        </div>

         <div class="userinfoone" v-if="userInfo.authStatus=='AUTHORIZING'">
            <div class="normal-infoone">用户名：{{userInfo.name}}</div>
            <div class="normal-infoone">手机号码：{{userInfo.phone}}</div> 
            <div class="normal-infoone">
              身份所属：{{userInfo.identity}}
              <span class="realname">您的账号正在实名认证中。 </span>
            </div> 
            
        </div>

          <div class="userinfoone" v-if="userInfo.authStatus=='AUTHORIZE_FAILED'">
            <div class="normal-infoone">用户名：{{userInfo.name}}</div>
            <div class="normal-infoone">手机号码：{{userInfo.phone}}</div> 
            <div class="normal-infoone">
              身份所属：{{userInfo.identity}}
              <span class="realname">您的账号实名认证未通过。 <router-link :to="{name:'ReApplyrealNameCertification'}" style="color: #FF6104;">重新申请</router-link></span>
            </div> 
            
        </div>
        <div class="noenterprise" v-if="noenterprise">
          <img src="../../../images/noenterprise.jpg">
          <p>您还没有加入任何企业！</p>
        </div>
        <common-table class="public" :total="total" @pageChange="pageChange" :logintype="logintype" :enterpriseid="enterpriseid" :personInfo="personInfo" @changeEnterprise="changeEnterprise" :table="table" :whatTable="whatTable" :whatTablePerson1="whatTablePerson"></common-table> 
    </div>
</template>
<script>
import breadCrumb from '../../publicComponent/breadCrumb.vue'
import commonTable from '../../publicComponent/commonTable.vue'
import ApiClient from '../../../../publicJs/ApiClient'
import LoadingBoxService from '../../../../publicJs/LoadingBoxService'
import LOCATION from '../basicInformation/PF_LOCATION.json'
import NoticeBoxService from './NoticeBoxServiceOnly.js'
import userService from '../../../../publicJs/userService'
export default {
  name: 'identityManagement',
  components: {
    breadcrumb: breadCrumb,
    commonTable: commonTable
  },
  data () {
    return {
      noenterprise: false,
      logintype: '',
      enterpriseid: '',
      enterpriseNAME: '',
      personInfo: '', // 一直显示个人的状态
      userInfo: {
        name: '', // 登录状态
        phone: '', // 手机号码
        password: '',
        realName: '', // 真实姓名
        idCard: '', // 身份证号
        email: '',
        authStatus: '', // 认证状态
        identity: '', // 身份所属
        id: ''
      },
      authenticated: true, // 已认证
      authorizing: false, // 认证中
      unauthorized: false, // 未认证
      emailSetted: true,
      breadcrumb: [{ name: '账号管理', link: '/safetyManagement' }, { name: '身份管理', link: '' }],
      whatTable: 3,
      whatTablePerson: 4,
      //   个人组件的信息
      table1: [],
      //   企业组件的信息
      table: [],
      pageNum: 1, // 分页 当前第几页
      pageSize: 10, // 每页显示多少个
      total: 0
    }
  },
  mounted () {
    // 获取用户的信息
    this.getInfo()
    // 获取用户企业信息
    this.getEnterpriseInfo()
    this.$parent.setActive('账号管理', '身份管理')
  },
  methods: {
    getInfo () { // 获取用户信息
      LoadingBoxService.open('加载中...')
      var that = this
      ApiClient.get('pubapi/token/getUserByToken').then(data => {
        console.log(data)
        that.logintype = data.userInfo.LOGIN_TYPE // 获取用户登录的logintype
        if (that.logintype === 'PERSONAL') {
          that.personInfo = false // 如果以个人身份登录的那么无需显示个人栏
          that.userInfo.identity = '个人身份'
        } else {
          that.personInfo = true // 如果以企业用户登录的那么显示个人栏
          that.userInfo.identity = data.userInfo.ENTERPRISE_NAME
        }
        that.enterpriseid = data.userInfo.ENTERPRISE_ID // 获取用户登录的企业id
        this.userInfo.name = data.userInfo.USERNAME // 获取登陆账号
        this.userInfo.id = data.userInfo.ID // 用户id
        this.userInfo.phone = data.userInfo.PHONE.substring(0, 3) + '****' + data.userInfo.PHONE.substring(7, 11) // 获取手机号码
        this.userInfo.authStatus = data.userInfo.AUTH_STATUS // 获取实名认证的状态
        console.log(this.userInfo.authStatus)
        this.userInfo.realName = '*' + data.userInfo.TRUE_NAME.substring(1) // 获取真实姓名
        this.userInfo.idCard = data.userInfo.ID_CARD.substring(0, 3) + '******' + data.userInfo.ID_CARD.substring(14) // 获取身份证号
      })
      LoadingBoxService.close()
    },
    getEnterpriseInfo () { // 获取用户加入企业的信息
      var that = this
      ApiClient.get('/pcapi/enterpriseApply/list', {
        pageNum: that.pageNum,
        pageSize: 10,
        status: 'PASS',
        isApply: 'YES'
      }).then(data => {
        console.log(data)
        if (data.total == '0') {
          that.noenterprise = true
        } else {
          that.noenterprise = false
          that.table = data.data
          that.total = data.total
          for (let i = 0; i < that.table.length; i++) {
            const el = that.table[i]
            that.table[i].name = el.enterprise.name
            that.table[i].address = el.enterprise.address
            that.table[i].province = el.enterprise.province
            that.table[i].city = el.enterprise.city
          }
          that.transformCode()
        }
      })
    },
    // 把省和市的code转化为汉字
    transformCode () {
      var that = this
      for (let value of LOCATION.RECORDS.values()) {
        for (var i = 0; i < that.table.length; i++) {
          var obj = that.table[i]
          if (value.CODE === obj.province) {
            obj.province = value.NAME
          }
          if (value.CODE === obj.city) {
            obj.city = value.NAME
          }
        }
      }
    },
    changeEnterprise (item) { // 切换企业
      console.log(item)

      var that = this
      NoticeBoxService.open('您确定要切换身份吗？', function () {
        that.userInfo.identity = item.name
        if (item.name === '个人身份') {
          that.logintype = 'PERSONAL'
          that.personInfo = false
        } else {
          that.logintype = 'ENTERPRISE'
          that.personInfo = true
        }
      // that.logintype = 'ENTERPRISE' // data.userInfo.LOGIN_TYPE // 获取用户登录的logintype
        if (item.enterpriseId === '' || item.enterpriseName === null) { // 个人身份
          that.enterpriseid = ''
          that.enterpriseNAME = ''
        } else { // 企业身份
          that.enterpriseid = item.enterpriseId
          that.enterpriseNAME = item.name
        }
        NoticeBoxService.close()
        LoadingBoxService.open('加载中...')
        ApiClient.get('pcapi/enterprise/change', {// 调用切换身份状态的接口
          userId: that.userInfo.id,
          enterpriseId: that.enterpriseid
        }).then(data => {
          if (that.enterpriseNAME) {
            sessionStorage.setItem('enterpriseName', that.enterpriseNAME)
            sessionStorage.setItem('enterpriseId', that.enterpriseid)
            sessionStorage.setItem('logintype', 'ENTERPRISE')

            userService.storeInfo('logintype', 'ENTERPRISE')
            userService.storeInfo('identity', that.enterpriseNAME)
            that.$parent.$children[1].identity = that.enterpriseNAME
          } else {
            sessionStorage.setItem('enterpriseName', '')
            sessionStorage.setItem('enterpriseId', '')
            sessionStorage.setItem('logintype', 'PERSONAL')
            userService.storeInfo('logintype', 'PERSONAL')
            userService.storeInfo('identity', '')
            that.$parent.$children[1].identity = '个人'
          }
          LoadingBoxService.close()
        }).then(() => {
          window.location.reload()
        }).catch(e => {

        })
      })
    },
     // 分页变化
    pageChange (val) {
      LoadingBoxService.open('加载中...')
      this.pageNum = val
      this.getEnterpriseInfo()
      LoadingBoxService.close()
    }
  }
}
</script>
<style lang="css" scoped>
.noenterprise{
  text-align: center;
  margin-top: 90px;
}
.noenterprise p{
  color: #333;
  font-size: 14px;  
}
.realname{
  margin-left: 180px;
}
.public {
  z-index: 12;
  overflow-x: hidden;
}
.userinfo {
  padding: 20px 0 20px 30px;
  border-bottom: 1px solid #f1f1f1;
  height: 125px;
  position: relative;
}
.userinfoone {
  padding: 20px 0 20px 30px;
  border-bottom: 1px solid #f1f1f1;
  height: 120px;
}
.success-icon {
  width: 9%;
  height: 79px;
  float: left;
}
.success-icon i {
  font-size: 50px;
  color: #1bc001;
  line-height: 87px;
}
.data-left {
  width: 28%;
  height: 79px;
  float: left;
}
.data-left > span {
  display: block;
  line-height: 26px;
}
.data-right {
  width: 18%;
  height: 79px;
  float: left;
  margin-top: 26px;
  z-index: 3;
}
.data-right > span {
  display: block;
  line-height: 26px;
}
.authenticated {
  width: 30%;
  float: left;
  position: relative;
}
.authenticated img {
  position: absolute;
  top: 25px;
  left: -92px;
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
.normal-infoone {
  margin-bottom: 12px;
}
.person {
  white-space: nowrap;
  text-overflow: ellipsis;
  width: 203px;
  height: 19px;
  text-align: left;
  font: normal 600 15px "microsoft yahei";
  display: inline-block;
  overflow: hidden;
}
.tableList .tableListLine {
  height: 85px;
  border-bottom: 1px solid #eeeeee;
  border-right: 1px solid #eeeeee;
}
.tableListLeft {
  width: 90%;
  height: 85px;
  float: left;
  padding-left: 25px;
  padding-top: 20px;
}
.right {
  width: 10%;
  height: 85px;
  text-align: center;
  float: right;
  color: #56a8fe;
  position: relative;
  top: 24px;
  left: 3px;
  cursor: pointer;
}
.right i {
  width: 100%;
  display: block;
}
.clearfix:after{content:'';display:block;clear:both;height:0;overflow:hidden;visibility:hidden;}
.clearfix{zoom:1;}
</style>
