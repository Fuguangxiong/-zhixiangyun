<template>
  <div class="publicContent">
    <!-- <left-nav :selectIndex="2"></left-nav> -->
    <div class="breadCrumb">
      <i @click="goHome" class="iconfont icon-dingwei"></i>
      <router-link :to="{name:breadCrumbPage}">{{breadCrumb1}}</router-link>
      <span class="active">{{breadCrumb2}}</span>
      <!-- <img src="../../publicImages/home.png" @click="goHome" style="cursor:pointer;">
      <router-link :to="{name:''}">个人注册</router-link>
      <span class="arrows">></span>
      <span class="active">数据库类</span> -->
    </div>
    <div class="loadDataBox" style="overflow:auto;overflow-x: hidden; position:absolute;top:48px;bottom:0;left:1px;right:0">
      <!-- 步骤 -->
      <div class="lanmpege">
        <div class="lanmp-con">
          <div class="lanbbag  ">
           <p style="width: 82%"></p>
         </div>
         <div class="lanbag-text">
           <span class="tim1 ">基本信息</span>
            <span class="tim2 ">配置信息</span>
            <span class="tim3 ">数据字段</span>
            <span class="tim4 ">配置完成</span>
        </div>
      </div>
    </div>
    <!-- 主体内容 -->
    <div class="iformcon-con reg3">
      <div class="select">
       <el-select  placeholder="请选择" v-model="table.tablename" @change='getTableData'>
       <el-option
       v-for="item in listData"
       :key="item"
       :label="item"
       :value="item">
     </el-option>
   </el-select>
   <div class="textSelectRight">
    表
  </div>
</div>
<table  border="0" cellspacing="0" cellpadding="0" v-show='isShowTable'>
  <thead>
    <tr>
      <th >是否注册</th>
      <th >自数据库字段</th>
      <th >字段说明</th>
      <th >字段标签</th>
      <th class="borderclear clearborder">操作</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for='(item,index) in tableData'> 
      <td align="center">
        <span>
        <select-component :message="item.status" :index="index" v-on:stateChange="singleSelectHandler"></select-component>
        <i></i>
      </span>
    </td>
    <td>{{item.name}}</td>
    <td>{{item.desc}}</td>
    <td>{{item.tag}}</td>
    <td  class="borderclear">
      <div class="char-bo" @click='openSelectTags(index)'>
        <span class="charu"></span>
        <a @click='openSelectTags(index)'>选择标签<i>></i> </a>
        
      </div>
    </td>
  </tr>
</tbody>
</table>
</div>
<!-- 暂存-上一步-下一步 -->
<div class="fenye" >
  <button class="btnBlue" @click='dataFieldBack'>上一步</button>
  <button class="btnBlue" @click='dataFieldNext'>下一步</button>
  <button class="btnGreen" @click='draft' v-show="approvalStatusCode=='NO_PASS'?false : true">暂存</button>
</div>
<!-- 暂存-上一步-下一步 -->
</div>

<!-- 选择标签 -->
<LabelView :dialogTagVisible.sync="dialogTagVisible" :isCreateModel="!isEdit" :bindLabelArray.sync="checkedLabels" :changeLabelCaller="saveLabel"  />
</div>
</template>
<script>
  // import HttpService from '../../publicService/HttpService'
  // import leftNav from '../partComponents/leftNav'
  import selectComponent from '../../publicComponent/selectComponent.vue'
  import LabelView from '@/publicComponent/labelView'
  import TipBoxService from '@/publicJs/TipBoxService'
  import apiClient from '@/publicJs/ApiClient.js'

  export default{
    name: 'dataField',
    components: {
  
      selectComponent,
      LabelView
    },
    data () {
      return {
        table: {
          tablename: '', // 表名
          status: 1, // 0暂存1保存
          dbfield: []
        },
        listData: [],
        tableData: '',
        isShowTable: false,
        dialogTagVisible: false, // 是否显示选择标签
        checkedLabels: [],  // 已选择的标签。
        labelStr: '', // 页面显示的
        indexNum: '',
        dbInfoId: '',
        resourceId: '',
        tableId: '',
        isEdit: sessionStorage.page3 !== undefined,
        breadCrumb1: '',
        breadCrumb2: '',
        breadCrumbPage: '',
        approvalStatusCode : ''
      }
    },
    mounted () {
      this.getSelectData()
      this.loadHistoryData()
    },
    created () {
        this.approvalStatusCode = this.$route.query.approvalStatusCode
//        this.approvalStatus = JSON.parse(sessionStorage.page3).approvalStatus
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
    watch: {
      'checkedLabels' (value) {
        this.labelStr = value.join(',')
        this.tableData[this.indexNum].tag = this.labelStr
      }
    },
    methods: {
      openSelectTags (index) {
        if (this.tableData[index].tag === '' || this.tableData[index].tag === null) {
          this.checkedLabels = []
        } else {
          this.checkedLabels = this.tableData[index].tag.split(',')
        }
        // console.log(this.checkedLabels)
        this.dialogTagVisible = true
        this.indexNum = index
      },
      changeLabels (changed, selectLabels) {
        if (changed) {
          let labelIds = []
          let labelStr = ''
          for (let i = 0; i < selectLabels.length; i++) {
            labelIds.push(selectLabels[i].id)
            labelStr = labelStr + selectLabels[i].name + ','
          }
          if (labelStr.length > 0) {
            labelStr = labelStr.substr(0, labelStr.length - 1)
          }
          this.labelStr = labelStr
          this.tableData[this.indexNum].tag = labelStr
        }
        // console.log(this.tableData[this.indexNum].tag)
        this.dialogTagVisible = false
      },
      singleSelectHandler (data) {
        var that = this
        that.tableData[data.index].status = data.select
      },
      getSelectData () {
        let that = this
        let query = JSON.parse(sessionStorage.page2)
        query = {dbinfo: JSON.stringify(query)}
        apiClient.get('/rcapi/getTableName', query, function (data) {
          that.listData = data.results.result
        })
      },
      getTableData () {
      let that = this
        let Tname = ''
        if (sessionStorage.page3 == undefined) {
          Tname = ''
        } else {
          Tname = JSON.parse(sessionStorage.page3).tablename
        }
        if (Tname == that.table.tablename && that.table.status != 0) {
          // 上一步回显
          that.tableData = JSON.parse(sessionStorage.page3).dbfield
          that.isShowTable = true
          // console.log( that.tableData)
        } else {
          // 首次进入 或者 从新选择
          var dbinfo = JSON.parse(sessionStorage.page2)
          dbinfo.tablename = that.table.tablename
          dbinfo = JSON.stringify(dbinfo)
          if (that.tableId == '') {
            var query = {dbinfo: dbinfo}
          } else {
            dbinfo = JSON.parse(dbinfo)
            dbinfo.dbInfoId = that.dbInfoId
            dbinfo.resourceId = that.resourceId
            dbinfo.tableId = that.tableId
            dbinfo = JSON.stringify(dbinfo)
            var query = {dbinfo: dbinfo}
          }
  
          apiClient.get('/rcapi/getTableField', query, function (datas) {
            let arr = []
            var resultsArray = datas.results.result == undefined ? datas.results.dbfield : datas.results.result
            resultsArray.forEach(function (val, index) {
              arr.push(val)
            })
            that.tableData = arr
            that.selectDbFields()
            if (datas.status == 200) {
              that.isShowTable = true
            }
          })
        }
      },
       // 点击暂存
      draft () {
        let that = this
        if (that.tableData.length != 0) {
          that.tableData.forEach(function (val, index) {
            let obj = {}
            obj.name = val.name
            obj.desc = val.desc
            obj.status = val.status
            obj.tag = val.tag
            that.table.dbfield.push(obj)
          })
          that.saveHistoryData()
        }
        that.table.dbfield = that.tableData
        this.table.status = 0
        let query = {resource: sessionStorage.page1, dbinfo: sessionStorage.page2, table: JSON.stringify(that.table)}
        // console.log('=====query====', query)
        apiClient.get('/rcapi/addResources', query, function (data) {
        // console.log(data)
          if (data.results.dbInfoId != '' && data.results.resourceId != '' && data.results.tableId != '') {
            that.dbInfoId = data.results.dbInfoId
            that.resourceId = data.results.resourceId
            that.tableId = data.results.tableId
            TipBoxService.open('暂存成功！')
          }
        })
        this.$router.push({name: 'personRegisterManage'})
        this.table.status = 0
      },
     // 点击下一步
      dataFieldNext () {
        let that = this
        if (that.isShowTable == true) {
          that.table.dbfield = []
          if (that.tableData.length != 0) {
            that.tableData.forEach(function (val, index) {
              let obj = {}
              obj.name = val.name
              obj.desc = val.desc
              obj.status = val.status
              obj.tag = val.tag
              that.table.dbfield.push(obj)
            })
            that.saveHistoryData()
          }
          let page1 = JSON.parse(sessionStorage.page1)
          page1.status = 1
          page1 = JSON.stringify(page1)
          that.table.id = sessionStorage.page3 == undefined ? '' : JSON.parse(sessionStorage.page3).id
          let query = {resource: page1, dbinfo: sessionStorage.page2, table: JSON.stringify(that.table)}
          apiClient.get('/rcapi/addResources', query, function (data) {
            // console.log('下一步，返回=', data)
            let page3 = JSON.parse(sessionStorage.page3)
            page3.id = data.results.tableId
            sessionStorage.page3 = JSON.stringify(page3)
            if (that.tableData.length != 0 && data.status == 200) {
              that.$router.push({path: 'configAccomplish', query: {type: 'person'}})
            } else {
              TipBoxService.open('请重新选择表', 1)
            }
          })
        } else {
          TipBoxService.open('请选择表', 2)
        }
      },
      saveLabel () {
        let that = this
        if (that.isShowTable == true) {
          that.table.dbfield = []
          if (that.tableData.length != 0) {
            that.tableData.forEach(function (val, index) {
              let obj = {}
              obj.name = val.name
              obj.desc = val.desc
              obj.status = val.status
              obj.tag = val.tag
              that.table.dbfield.push(obj)
            })
            that.saveHistoryData()
          }
          let page1 = JSON.parse(sessionStorage.page1)
          page1 = JSON.stringify(page1)
          that.table.id = JSON.parse(sessionStorage.page3).id
          let query = {resource: page1, dbinfo: sessionStorage.page2, table: JSON.stringify(that.table)}
          return apiClient.get('/rcapi/addResources', query).then(data => {
            let page3 = JSON.parse(sessionStorage.page3)
            page3.id = data.results.tableId
            sessionStorage.page3 = JSON.stringify(page3)
            if (that.tableData.length != 0 && data.status == 200) {
              that.$router.push({path: 'configAccomplish'})
            } else {
              console.error(data.status)
              // TipBoxService.open('请重新选择表', 1)
            }
          }).catch(e => {
            console.error(e)
          })
        }
      },
      // 点击上一步
      dataFieldBack () {
        let that = this
        if (that.tableData.length != 0) {
          that.table.dbfield = []
          that.tableData.forEach(function (val, index) {
            let obj = {}
            obj.name = val.name
            obj.desc = val.desc
            obj.status = val.status
            obj.tag = val.tag
            that.table.dbfield.push(obj)
          })
          this.saveHistoryData()
        } else {
        }
        this.$router.push({path: 'configinfo',query: {type: 'person'}})
      },
      saveHistoryData () {
        let that = this
        sessionStorage.page3 = ''
        var store = that.table
        store = JSON.stringify(store)
        sessionStorage.page3 = store
        // console.log(store)
      },
      loadHistoryData () {
        let that = this
        var store = sessionStorage.page3
        if (store != null && store != undefined && store.length != 0) {
           // 这个方法体里面实现要回显本地数据的方法
          store = JSON.parse(store)
          that.table.tablename = store.tablename // 表名
          that.table.status = store.status // 暂存/保存
          that.table.dbfield = store.dbfield
        }
      },
      goHome () {
        this.$router.push({name: 'Index'})
      },
      selectDbFields () {
        if (!sessionStorage.page3) {
          return
        }
        let dbfields = []
        let page3 = JSON.parse(sessionStorage.page3)
        if (page3 && page3.dbfield) {
          dbfields = page3.dbfield
        }
        this.tableData.forEach(item => {
          dbfields.forEach(dbfield => {
            if (item.name === dbfield.name) {
              item.status = dbfield.status
            }
          })
        })
      }

    }
  }
</script>
<style scoped>
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
.clearborder{
  display: none;
}
.borderclear{
  border:none !important;
  color:#57A8FA;
  font-size: 13px;
}
.borderclear i{
  font-style: normal;
  font-family: simsun;
  font-size: 13px;
}
.iformcon-con.reg3 table th{
  text-align:center;
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
    height: calc(100%-200px);
}
.iformcon-con{
    width:600px;
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
.lanbag-text span{
  font-size: 14px;
}
.lanbag-text span.tim2,.lanbag-text span.tim3,.lanbag-text span.tim4{
    margin-left: 209px;
}
/* 主体内容 */
.iformcon-con.reg3{
  min-height: 500px;
    margin: auto;
    margin-top: 40px;
    /* margin-bottom: 130px; */

}
.iformcon-con.reg3 table{
    margin-top:20px;
    border: 1px #c6c6c6 solid;
    width:100%;
    border-bottom: none;
    border-right: none;
}
.iformcon-con.reg3 table th{
    border-bottom: 1px #c6c6c6 solid;
    border-right: 1px #c6c6c6 solid;
    padding: 6px;
    box-sizing: border-box;
}
.iformcon-con.reg3 table td{
    border-bottom: 1px #c6c6c6 solid;
    border-right: 1px #c6c6c6 solid;
    padding: 6px;
    box-sizing: border-box;
    text-align: center;
}
.iformcon-con.reg3 table .charu{
    /* background: url(../img/insert.png) no-repeat; */
    /* width:20px; */
    height: 20px;
    display: inline-block;
    margin: 0 auto;
}
.iformcon-con.reg3 table .char-bo{
    position: relative;
    width:100%;
    text-align: center;
}
.char-bo a{
  cursor: pointer;
}
.iformcon-con.reg3 table .charu-h{
    -webkit-box-shadow: 0 0 3px 2px  #dedede;
    -moz-box-shadow: 0 0 3px 2px  #dedede;
    box-shadow: 0 0 3px 2px #dedede;
    border-radius: 3px;
    padding: 2px 4px;
    right: 0;
    position: absolute;
    background:#fff;
    display: none;
    top: -26px;
    cursor: pointer;
}
.iformcon-con.reg3 table .char-bo:hover .charu-h{
    display: inline-block;

}
.chebox i {
    /* background: url(../img/chebox.png) no-repeat; */
    width: 19px;
    height: 20px;
    display: inline-block;
}
.chebox.active i {
    /* background: url(../img/chebox.png) 0 -21px no-repeat; */
    width: 19px;
    height: 19px;
    display: inline-block;
}

.fenye{
    border-top:1px #d9d9d9 dashed;
    width:98%;
    height: 80px;
    text-align: center;
    margin: 37px auto;
    padding-top: 30px;
}
.select{
    height: 36px;
}
.el-select{
    float: left;
}
.textSelectRight{
    float: left;
    height: 36px;
    line-height: 36px;
    font-size: 14px;
    padding-left: 10px;
}


.lanbag-text span.tim1,.lanbag-text span.tim2,.lanbag-text span.tim3{
    color:#58A6F9
}
.butonstdelet {
    border-radius: 3px;
    border: 1px #b2b2b2 solid;
    text-align: center;
    font-size: 14px;
    color: #fff;
    line-height: 28px;
    cursor: pointer;
    padding: 0 12px;
    background: #b2b2b2;
}
.texet i{
  position: relative;
  left: -5px;
  top:2px;
  font-style:normal;
}
tbody td:last-child{
  border:none;
}
.iformcon-con .select {
  border-color:#5DAFFF
}
.tim1,.tim2,.tim3,.tim4{
  font-size: 14px !important;
}
</style>
