<template>
  <div>
    <div class="cqiye">
      <span class="podl" v-on:click="loda">重新登录</span>
      <h2>请选择登录身份</h2>
      <div class="loginTitleLine">
        <el-carousel :interval="4000" type="card" height="210px" v-on:change="changeSelectCompany" v-bind:autoplay="autoplay" indicator-position="none" arrow="always">
          <el-carousel-item v-for="(company, index) in companylist" :key="index">
            <div class="imgbox">
              <img src="../images/personalIcon.png" alt="" v-show="company.enterprise.name==='个人'">
              <img src="../images/enterpriseIcon.png" alt="" v-show="company.enterprise.name!=='个人'">
            </div>
            <h3>{{ company.enterprise.name }}</h3>
          </el-carousel-item>
        </el-carousel>
      </div>
      <div class="butonDtmei">
        <button class="butclas" v-on:click="netBut()">进入</button>
      </div>
    </div>
  </div>
</template>
<script>
import HttpService from '../../publicJs/ApiClient'
import envConfig from '../../../config/envConfig'
import TipBoxService from '../../publicJs/TipBoxService'
import user from '../../publicJs/userService'
import tool from '../publicJs/ToolService'
import path from '../../publicJs/publicPathConfig'
var countDownTimer = ''
export default{
  data: function () {
    return {
      userName: '名字',
      companylist: '',
      autoplay: false,
      nowSelectIndex: 0,
      selectEnterprise: {
        'id': '',
        'name': ''
      },
      password: '',
      username: ''
    }
  },
  props: {childCom: '', href: ''},
  mounted () {
    this.username = localStorage.getItem('username')
    this.password = localStorage.getItem('password')
  },
  watch: {
    childCom (val, oldVal) {
      let that = this
      // console.info('父传子', val)
      that.companylist = JSON.parse(JSON.stringify(val))
      that.companylist.unshift({enterprise: {name: '个人', id: ''}})
      // console.log('list',that.companylist)
    }
  },
  methods: {
            // 传递

    loda: function () {
      this.$emit('flpassb')
    },
    entList (data) {
      // cconsole.info('shuju', data)
    },
    netBut () {
      let that = this
      let param = ''
      let nameReg = /^[0-9]*$/
      // console.log(this.$parent.$children[0].$children[2])
      this.username = this.$parent.$children[0].$children[1].$children[0].telephone
      this.password = this.$parent.$children[0].$children[1].$children[0].password
      // HttpService.get('priviapi/enterprise/checkEnterprise', '', function (data) {
      //   console.log(data)
      // })
      // var source = tool.getQueryString('source')
      // if (source != null) {
      //   console.info('source=', source)
      //   if (source.indexOf('?') == -1) {
      //     href = source + '?tokenId=' + data.data.token
      //   } else {
      //     console.info('ok')
      //     href = source + '&tokenId=' + data.data.token
      //   }
      // } else {
      //   sessionStorage.menuName = JSON.stringify(data.data.userInfo.menuName)
      // }
      // var href = './departManage.html'
      if (this.companylist[this.nowSelectIndex].enterprise.name === '个人') {
        this.selectEnterprise.name = ''
      } else {
        this.selectEnterprise.name = this.companylist[this.nowSelectIndex].enterprise.name
      }
      if (this.companylist[this.nowSelectIndex].enterprise.id === null) {
        this.selectEnterprise.id = ''
      } else {
        this.selectEnterprise.id = this.companylist[this.nowSelectIndex].enterprise.id
      }
      if (that.username.length === 11 && nameReg.test(that.username) === true) {
        param = {
          phone: that.username,
          password: that.password,
          enterpriseId: that.selectEnterprise.id,
          enterpriseName: that.selectEnterprise.name
        }
      } else {
        param = {
          name: that.username,
          password: that.password,
          enterpriseId: that.selectEnterprise.id,
          enterpriseName: that.selectEnterprise.name
        }
      }
      HttpService.post('priviapi/login/loginUser', param, function (data) {
        var href = path.APP_MARKET + '#/?tokenId=' + data.data.authtoken
        var source = tool.getQueryString('source')
        if (process.env.NODE_ENV === 'development') {
          href = './#/safetyManagement'
        }
        if (source != null) {
          console.info('source=', source)
          source = decodeURIComponent(source)
          if (source.indexOf('?') == -1) {
            if (data.data.enterpriseids != undefined) {
              href = source + '?tokenId=' + data.data.authtoken + '&enterpriseid=' + data.data.enterpriseids + '&userId=' + data.data.authtoken
            } else if (data.data.webdata != undefined) {
              href = source + '?id=' + data.data.webdata
            } else { href = source + '?tokenId=' + data.data.authtoken }
          } else {
            console.info('ok')
            if (data.data.enterpriseids != undefined) {
              href = source + '&tokenId=' + data.data.authtoken + '&enterpriseid=' + data.data.enterpriseids + '&userId=' + data.data.authtoken
            } else if (data.data.webdata != undefined) {
              href = source + '&id=' + data.data.webdata
            } else { href = source + '&tokenId=' + data.data.authtoken }
          }
        } else {
          sessionStorage.menuName = JSON.stringify(data.data.userInfo.menuName)
        }
        if (data.data.loginStatus === '登录成功') {
          document.cookie = 'tokenId=' + data.data.authtoken + ';path=/'
          window.location.href = href
        } else {
          console.log(data)
        }
      }).catch(e => {
        TipBoxService.open('登录失败', 2)
        console.log(e)
      })
        // window.location.href = this.href
            // window.open(href);
    },
    changeSelectCompany: function (nowId, preId) {
      this.nowSelectIndex = nowId
    },
    enterInto: function () {

    }

  }
}
</script>
<style src="../css/register.css" scoped>

</style>

