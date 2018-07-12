<template>
  <div class="publicContent">
    <!-- <left-nav :selectIndex="2"></left-nav> -->
    <div class="breadCrumb">
      <i @click="goHome" class="iconfont icon-dingwei"></i>
      <router-link :to="{name:breadCrumbPage}">{{breadCrumb1}}</router-link>
      <span class="active">{{breadCrumb2}}</span>
      <!-- <img src="../../publicImages/home.png" @click="goHome" style="cursor:pointer;"> -->
      <!-- <router-link :to="{name:''}">个人注册</router-link>
      <span class="arrows">></span> -->
      <!-- <span class="active">数据库类</span> -->
    </div>
    <div class="loadDataBox" style="overflow:auto;overflow-x: hidden; position:absolute;top:48px;bottom:0;left:1px;right:0">
      <!-- 步骤 -->
      <div class="lanmpege">
        <div class="lanmp-con">
          <div class="lanbbag">
           <p style="width: 50%"></p>
         </div>
         <div class="lanbag-text">
           <span class="tim1">基本信息</span>
            <span class="tim2">配置信息</span>
            <span class="tim3">数据字段</span>
            <span class="tim4 ">配置完成</span>
        </div>
      </div>
    </div>
    <!-- 主体内容 -->
    <div class="iformcon">
     <div class="iformcon-con reg2">
      <div class="iformcon-con reg2">
        <div class="time-x">
          <span class="texet"><i>*</i>数据访问地址</span>
          <span class="inputime ">
            <input type="text" class="inputborder textlinpu-text wi540"  v-model='dbinfo.dburl'
            :class='{wrong:dbinfo.dburl == "" && isSubmit}'>
          </span>
        </div>
        <div class="time-x">
          <span class="texet"><i>*</i>端口号</span>
          <span class="inputime ">
            <input type="text" class="inputborder textlinpu-text wi540" v-model='dbinfo.dbport'
            :class='{wrong:dbinfo.dbport == "" && isSubmit}'>
          </span>
        </div>
        <div class="time-x">
          <span class="texet"><i>*</i>库名</span>
          <span class="inputime ">
            <input type="text" class="inputborder textlinpu-text wi540"  v-model='dbinfo.dbname'
            :class='{wrong:dbinfo.dbname == "" && isSubmit}'>
          </span>
        </div>
        <div class="time-x">
          <span class="texet"><i>*</i>用户名</span>
          <span class="inputime ">
            <input type="text" class="inputborder textlinpu-text wi540"  v-model='dbinfo.username'
            :class='{wrong:dbinfo.username == "" && isSubmit}'>
          </span>
        </div>
        <div class="time-x">
          <span class="texet"><i>*</i>密码</span>
          <span class="inputime ">
            <input type="password" class="inputborder textlinpu-text wi540"  v-model='dbinfo.pwd'
            :class='{wrong:dbinfo.pwd == "" && isSubmit}'>
          </span>
        </div>
        <div class="time-x">
          <span class="texet"><i>*</i>数据库类型</span>
          <span class="inputime ">
            <el-select v-model="dbinfo.dbtype" placeholder="请选择数据库类型">
              <el-option label="mysql" value="mysql"></el-option>
              <el-option label="oracle" value="oracle"></el-option>
            </el-select>
            <!--<input type="text" class="inputborder textlinpu-text wi540"  v-model='dbinfo.dbtype' :class='{wrong:dbinfo.dbtype == "" && isSubmit}'>-->
          </span>
        </div>
        <div class="lastList">
          <span class="inputime q1">
            <button class="butbox" @click='linkTest'>连接测试</button>
          </span>
          <p class="shuomin">注:如果测试不成功,测试不能进入下一步</p>
        </div>
      </div>
    </div>
  </div>
  <!-- 下一步 -->
  <div class="fenye">
    <button class="btnBlue" @click='configInfoBack'>上一步</button>
    <button class="btnBlue" @click='configInfoNext'>下一步</button>
    <button class="btnGreen" @click='draft' v-show="approvalStatusCode=='NO_PASS'?false : true">暂存</button>
  </div>
</div>
</div>
</template>
<script>
  // import HttpService from '../../publicService/HttpService'
  // import leftNav from '../partComponents/leftNav'
  // import TipBoxService from '../../publicService/TipBoxService'
  import apiClient from '@/publicJs/ApiClient.js'
  import TipBoxService from '@/publicJs/TipBoxService'
  export default{
    name: 'configinfo',
    components: {
  
    },
    data () {
      return {
        dbinfo: {
          resourcename: '', // 资源名称
          dburl: '', // 数据访问地址
          dbport: '', // 端口号
          dbname: '', // 库名
          username: '', // 用户名
          pwd: '', // 密码
          status: 1, // 0暂存1保存
          dbtype: ''// oracle
        },
        isSubmit: false,
        testState: false,
        breadCrumb1: '',
        breadCrumb2: '',
        breadCrumbPage: '',
        approvalStatusCode :''
      }
    },
    created () {
        this.approvalStatusCode = this.$route.query.approvalStatusCode
//      this.approvalStatus = JSON.parse(sessionStorage.page2).approvalStatus
      this.loadHistoryData()
      this.getQuery()
      if (this.$route.query.type === 'person') {
        this.breadCrumb1 = '个人注册'
        this.breadCrumb2 = '数据库类'
        this.breadCrumbPage = 'personRegisterManage'
      } else if (this.$route.query.type === 'register') {
        this.breadCrumb1 = '注册管理'
        this.breadCrumb2 = '注册数据资源'
        this.breadCrumbPage = 'registerManageAdministrator'
      }
    },
    methods: {
      getQuery () {
        this.dbinfo.resourcename = this.$route.query.resourcename
      },
   // 点击暂存
      draft () {
        this.dbinfo.status = 0
        let query = {resource: sessionStorage.page1, dbinfo: JSON.stringify(this.dbinfo)}
        apiClient.get('/rcapi/addResources', query, function (data) {
          // console.log(data)
          if (data.results.dbInfoId != '' && data.results.resourceId != '') {
            TipBoxService.open('暂存成功！')
          }
        })
        this.$router.push({name: 'personRegisterManage'})
      },
   // 点击下一步
      configInfoNext () {
        let that = this
        if (sessionStorage.page1 == undefined) {
          that.saveHistoryData()
        }
        // console.log(that.dbinfo)
        let sum = 0
        for (var o in that.dbinfo) {
          if (that.dbinfo[o] === '') {
            sum++
          }
        }
    // that.saveHistoryData();
        if (sum == 0) {
          if (that.testState == true) {
            that.dbinfo.id = sessionStorage.page2 == undefined ? '' : JSON.parse(sessionStorage.page2).id
            let query = {resource: sessionStorage.page1, dbinfo: JSON.stringify(this.dbinfo)}
            apiClient.get('rcapi/getjdbcstatus', query, function (data) {
              let page2 = that.dbinfo
              page2.id = data.results.dbinfo
              sessionStorage.page2 = JSON.stringify(page2)
              that.$router.push({path: 'dataField', query: {resourcename: that.dbinfo.resourcename, type: that.$route.query.type,approvalStatusCode : that.approvalStatusCode}})
            })
          } else {
            TipBoxService.open('请先进行连接测试！', 2)
          }
        } else {
          that.isSubmit = true
          TipBoxService.open('请输入必填项！', 2)
        }
      },
    // 点击上一步
      configInfoBack () {
        this.saveHistoryData()
        this.$router.push({path: 'dataintroduced', query: {type: this.$route.query.type}})
      },
      saveHistoryData () {
        let that = this
        var store = that.dbinfo
        store = JSON.stringify(store)
        sessionStorage.page2 = store
      },
      loadHistoryData () {
        var store = sessionStorage.page2
        let that = this
        if (store != null && store != undefined && store.length != 0) {
        // 这个方法体里面实现要回显本地数据的方法
          store = JSON.parse(store)
          that.dbinfo.diresourcename = store.diresourcename, // 资源名称
        that.dbinfo.dburl = store.dburl, // 数据访问地址
        that.dbinfo.dbport = store.dbport, // 端口号
        that.dbinfo.dbname = store.dbname, // 库名
        that.dbinfo.username = store.username, // 用户名
        that.dbinfo.pwd = store.pwd, // 密码
        that.dbinfo.status = store.status, // 0暂存1保存
        that.dbinfo.dbtype = store.dbtype // oracle
        }
      },
      linkTest () {
        let that = this
        let query = {dbinfo: JSON.stringify(that.dbinfo)}
        apiClient.get('rcapi/getjdbcstatus', query, function (data) {
          if (data.results !== null) {
            that.testState = data.results.result
            if (that.testState) {
              TipBoxService.open('连接成功')
            } else {
              TipBoxService.open('连接失败', 1)
            }
          } else {
            TipBoxService.open('连接异常', 1)
          }
        })
      },
      goHome () {
        this.$router.push({name: 'Index'})
      }
    }
}
</script>
<style src="" scoped>
.publicNav{
  box-sizing: border-box;
  padding: 15px; 
      height: 45px;
    background-color: #fff;
    -webkit-box-shadow: 0 0 5px #ccc;
    box-shadow: 0 0 5px #ccc;
    border-radius: 1px
}
.publicNav img{
  width: 16px;
  height: 15px;
  background-size: cover;
}
.lanmpege{
    background: #ffffff;
    height: 90px;
    width:100%;
}
.lanmp-con{
    width:918px;
    margin: 0 auto;
    padding-top: 30px;
}
.lanbbag{
    background: url("../../publicImages/1.png") no-repeat;
    width:861px;
    height: 34px;
    background-size: cover
}
.lanbbag p{
    background: url("../../publicImages/2.png") no-repeat;
    /* width:861px !important; */
    height: 34px;
    background-size: cover
}
.iformcon{
    height: 365px;
}
.iformcon-con{
    width:730px;
}
.lanbag-text{
    width:992px;
    margin-top: 5px;
}
.lanbag-text span{
	font-size: 12px;
}
.lanbag-text span.tim2,.lanbag-text span.tim3,.lanbag-text span.tim4{
    margin-left: 228px;
}
/* 主体内容 */
.iformcon-con{
    width:730px;
    margin: 0 auto;
    margin-top: 40px;
}

.lanbag-text{
    width:992px;
    margin-top: 5px;
    position: relative;
}
.lanbag-text span:nth-child(1){
  position:absolute;
  left: -10px;
  top:0;
}
.lanbag-text span:nth-child(2){
  position:absolute;
  left: 55px;
  top:0;
}
.lanbag-text span:nth-child(3){
  position:absolute;
  left: 330px;
  top:0;
}
.lanbag-text span:nth-child(4){
  position:absolute;
  left: 604px;
  top:0;
}
.time-x{
    box-sizing: border-box;
    margin-bottom: 10px;
}
.time-x span{
    display: inline-block;
    vertical-align: middle;
}
.time-x .texet{
    width:145px;
    color: #333;
    font-size: 12px;
    line-height: 36px;
    text-align: right;
}
.time-x .padingstye{
    padding: 20px 0;
}
.butbox{
    border:none;
    color: #56A8FA;
    background-color: #ffffff;
   border-radius: 3px;
    padding: 8px 12px;
    font-size: 12px;
  text-decoration: underline;
}
.time-x .wi540{
    width:540px;
}
.time-x .wi450{
    width:450px;
}
.time-x .wi250{
    width:247px;
}
.time-x .texet i{
    color:#b61717;
}
.time-x .riadio{
    overflow: hidden;
    padding: 10px 0;
    font-size: 12px;
}
.time-x .shuomin{
    color: #b61717;
}
.textreas{
    height: 180px;
}
.lanbag-text span{
    font-size: 12px;
    display: inline-block;
}
.lanbag-text span.tim2,.lanbag-text span.tim3,.lanbag-text span.tim4{
    margin-left: 209px;
}
.lanbag-text span.tim1,.lanbag-text span.tim2{
    color:#58A6F9
}
.inputborder {
    border: 1px #dadada solid;
    border-radius: 3px;
    padding: 8px 12px;
    font-size: 12px;
    margin: 0;
}
.css-radio i{
    /* background: url(../img/radio.png) no-repeat; */
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
.f1Right{
	padding-left: 49px;
}
.lastList{
    padding-left: 150px;
    margin: 0 0 50px 0;
}
 .shuomin{
    color: #b61717;
    font-size: 12px;
    padding-top: 10px;
    float: left;
}
 .q1 {
    float: right; 
    margin-right: 42px !important;
    border:none;
 }
.fenye{
    border-top:1px #d9d9d9 dashed;
    width:98%;
    height: 80px;
    text-align: center;
    margin: 0 auto;
    padding-top: 30px;
}

/* 暂存-上一步-下一步 */
.butonstred {
    border-radius: 3px;
    border: 1px #b61717 solid;
    text-align: center;
    font-size: 12px;
    background: #b61717;
    color: #fff;
    line-height: 28px;
    cursor: pointer;
    padding: 0 12px;
    margin: 0 30px;

}
.butonst {
    border-radius: 3px;
    border: 1px #b61717 solid;
    text-align: center;
    font-size: 12px;
    color: #b61717;
    line-height: 28px;
    cursor: pointer;
    padding: 0 12px;
}
.butonst:hover{
    color:#fff;
    background: #b61717;
}
.butonstdelet {
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
.time-x .wrong {
  border-color: #b61717;
}
.texet i{
  position: relative;
  left: -5px;
  top:2px;
  font-style:normal;
}
.tim1,.tim2,.tim3,.tim4{
  font-size: 14px !important;
}
</style>
