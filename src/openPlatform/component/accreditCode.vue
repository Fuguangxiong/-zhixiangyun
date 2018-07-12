<template>
    <div class="SecretKeyManager">

      <div class="part1">
        <span style="color:#757f8b">秘钥管理</span>
      </div>

      <div class="part2">
        &nbsp;&nbsp;服务状态：
        <span @click="changeServer('')" :class="{ pxcolor:change == 2}">全部</span>
        <span @click="changeServer('1')" :class="{ pxcolor:change == 1}">可用</span>
        <span @click="changeServer('0')" :class="{ pxcolor:change == 0}">失效</span>
        <div class="shenqing">
          <i class="iconfont icon-bianji3"></i>&nbsp;
          <span @click="ApplyKey()">申请</span>
        </div>
      </div>

      <div class="part3">
        <div>Secret Key</div>
        <div>申请时间</div>
        <div>状态</div>
        <div>操作</div>
      </div>

      <div class="part4">

        <p v-show="noData">
          您当前还没有生成秘钥，如需使用，请申请使用
        </p>

        <ul v-show="!noData">
          <li class="SecretKey" v-for="(data,index) in keysList" :key=index>
            <div class="chakan" v-show="data.chakan">
              <span @click="showkey(index)">查看</span>
            </div>
            <div class="yincang" v-show="!data.chakan">{{data.API_key}} 
              <span @click="showkey(index)">隐藏</span>
            </div>
            <div>{{data.apply_time|dataFormat}} {{data.apply_time|timeFormat}}</div>
            <div>
              <span v-show="data.is_validated" style="color:#27bc32;">可用</span>
              <span v-show="!data.is_validated" style="color:#FF0000;">失效</span>
            </div>
            <div>
              <span v-show="data.is_validated"><i class="delkey iconfont icon-3" @click="DeleteKey(data)"></i></span>
            </div>
          </li>
        </ul>

        <div :class="{'accreditnum': !noData}" v-show="change == 2">
          (您总共有{{countLimitList.astrict_count}}个可用授权码，当前授权码总数量为{{countLimitList.total}}，还可以申请{{countLimitList.canapply_count}}个授权码)
        </div>
        <div class="accreditnum" v-show="change == 1">
          (当前可用授权码数量为{{countLimitList.true_count}})
        </div>
        <div class="accreditnum" v-show="change == 0">
          (当前失效授权码数量为{{countLimitList.false_count}})
        </div>

        <div class="fenyema"  v-show="noPage">
          <el-pagination  @size-change="handleSizeChange"
                          @current-change="handleCurrentChange" 
                          :current-page.sync="myData.pageNum"
                          :page-size="myData.pageSize"  
                          layout="prev, pager, next, jumper" 
                          :total="total">
          </el-pagination>
        </div>

      </div>
    </div>
</template>
<script>
import apiClient from '../../publicJs/ApiClient.js'
import LoadingBoxService from '../../publicJs/LoadingBoxService.js'
import TipBoxService from '../../publicJs/TipBoxService.js'
import NoticeBoxService from '../../publicJs/NoticeBoxService.js'
import appPublicJs from '../common/public.js'
import UtilService from '../../publicJs/UtilService.js'
export default {
  name: 'accreditCode',
  data () {
    return {
      noData: true,
      noPage: false,
      change: 2,
      keysList: '',
      myData: {
        pageSize: 8,
        pageNum: 1
      },
      clickstatus: '',
      countLimitList: {
        astrict_count: 0,
        total: 0,
        canapply_count: 0
      },
      total: 0,
      kfz_status: ''// 判断开发者实名状态
    }
  },
  created () {
    this.getKeysList()
    this.getAuthenticationInfo()
  },
  methods: {
    showkey (index) {
      this.keysList[index].chakan = !this.keysList[index].chakan
      this.$set(this.keysList, index, this.keysList[index])
    },
    handleSizeChange () {},
    handleCurrentChange () {
      this.getKeysList(this.clickstatus)
    },
    changeServer (status) {
      this.myData.pageNum = 1
      this.getKeysList(status)
    },
    getKeysList (status) {
      let that = this
      that.clickstatus = status
      if (status === '1') {
        that.change = 1
      } else if (status === '0') {
        that.change = 0
      } else {
        that.change = 2
      }
      LoadingBoxService.open('加载中...')
      var myData1 = {
        pageSize: 8,
        pageNum: that.myData.pageNum,
        is_validated: status
      }
      apiClient.get('/itsmApi/apiKey/getApiKeyList', myData1, function (data) {
        LoadingBoxService.close()
        //  没有数据
        if (data.results.total === 0) {
          that.noData = true
          that.noPage = false
          return false
        } else {
          that.noData = false
          that.keysList = data.results.data
          that.total = data.results.total
          // 往列表中插入chakan属性用来显示隐藏密钥
          for (let i = 0; i < that.keysList.length; i++) {
            that.keysList[i].chakan = true
          }
          // 判断如果内容长度小于一页不显示分页
          if (that.myData.pageSize >= that.total) {
            that.noPage = false
          } else {
            that.noPage = true
          }
        }
      })
      that.countLimit()
    },
    countLimit () {
      var that = this
      apiClient.get('/itsmApi/apiKey/getUsebleApiKeyCount', '', function (data) {
        if (data.status === 200) {
          that.countLimitList = data.results
        }
      })
    },
    getAuthenticationInfo () {  // 实名状态
      var that = this
      apiClient.get('itsmApi/auth/findAuthenticationInfo').then(data => {
        that.kfz_status = data.auth_kfz_status
      })
    },

    ApplyKey () { // 申请授权码
      var that = this
      if (that.countLimitList.canapply_count <= 0) {
        TipBoxService.open('超出申请限额')
      } else if (that.kfz_status === 'UNAUTHORIZED') {
        TipBoxService.open('您还没有进行实名认证，请先去认证', 2)
      } else {
        NoticeBoxService.open('是否申请授权码？', function () {
          NoticeBoxService.close()
          apiClient.post('/itsmApi/apiKey/apiKeyApply', '', function (data) {
            if (data.status === 200) {
              TipBoxService.open('申请成功')
              that.pageNum = 1
              that.getKeysList()
            }
          })
        })
      }
    },
    DeleteKey (data) { // 删除授权码
      var that = this
      var myData = {
        'apiKey': data.API_key
      }
      NoticeBoxService.open('是否删除授权码？', function () {
        NoticeBoxService.close()
        apiClient.delete('/itsmApi/apiKey/deleteApiKey', myData, function (data) {
          if (data.status === 200) {
            TipBoxService.open('授权码失效')
            that.pageNum = 1
            that.getKeysList()
          }
        })
      })
    }
  },
  filters: {
    dataFormat: function (value) {
      return UtilService.formatDuring(value, 'yyyy-MM-dd')
    },
    timeFormat: function (value) {
      return UtilService.formatDuring(value, 'HH:mm:ss')
    },
    imgPath: function (value) {
      return apiClient.apiBaseUrl + appPublicJs.serviceImgShow + value
    }
  }
}
</script>
<style scoped>
*{
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.SecretKeyManager{
  width: 100%;
  height: 100%;
}
.part1{
  margin-top: 23px;
}
.part1:before {
  content: "";
  height: 10px;
  width: 2px;
  position: relative;
  display: inline-block;
  top: 1px;
  margin-right: 6px;
  background-color: #2ca3ee;
}
.part2{
  width: 100%;
  height: 41px;
  line-height: 40px;
  color:#757f8b;
}
.shenqing{
  display: inline-block;
  float: right;
  margin-right: 15px;
  color:#7899ed;
}
.shenqing i {
  margin-top: 10px;
} 
.pxcolor{
  color:#2ca3ee;
}
.part2>span {
  margin-left: 20px;
}
.part2 span{
  cursor: pointer;
}
.part3{
  height: 34px;
  background: #f3f6f8;
}
.part3>div{
  width: 24.7%;
  line-height: 34px;
  text-align: center;
  display: inline-block;
  /* background: #ff1; */
}
.part4{
  text-align: center;
}
.part4>p{
  margin-top: 200px;
}
.part4>div{
  color: #8d99a5;
}
.SecretKey{
  height: 52px;
  background: #f9fbfc;
  margin-top: 3px;
  line-height: 52px;
  text-align: left;
}
.SecretKey:hover{
  background: #edf2f5;
  /* color: #2ca3ee; */
}
.SecretKey>div{
  display: inline-block;
  width: 24.7%;
  text-align: center;
}
.chakan span,.yincang span,.delkey{
  cursor: pointer;
  color:#2ca3ee
}
.accreditnum{
  float: right;
  margin-top: 10px;
  margin-right: 15px;
}
.fenyema{
  text-align: center;
  margin-top: 25px;
}
</style>
