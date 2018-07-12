<template>
  <div class="tableList">
    <div class="tableListLine" v-if="personInfo">
      <div>
        <div class="tableListLeft" style="float: left;">
          <div style="float: left;">
            <div class="company">个人身份</div>
          </div>
        </div>

        <div class="action"  v-show="logintype!=='PERSONAL'">
          <div class="switch" @click="getWhichEnterprise(personalvalue)">
            <i class="iconfont icon-qiehuan"></i>
            <span>&nbsp;切换</span>
          </div>
          <div class="sliderBtn" @click="getWhichEnterprise(personalvalue)">
            <i class="iconfont icon-qiehuan"></i>
            <span>&nbsp;切换</span>
          </div>
        </div>
      </div>
    </div>

    <div v-for="(value,index) in table" :key="index" class="tableListLine" v-show="whatTablethree==whatTable&&enterpriseid!==value.enterpriseId">
      <div>
        <div class="tableListLeft" style="float: left;">
          <div style="float: left;">
            <div class="company" :title="value.name">{{value.name}}</div>
            <div class="address">
              <i class="iconfont icon-location" style="color: #D7B146;"></i>&nbsp;&nbsp;{{value.province}}{{value.city}}{{value.address}}
            </div>
          </div>
          <div class="time" v-show="value.applicationTime">
            <!-- <span>{{timeTitle}}</span> -->
            <span>{{value.applicationTime | formatDuring }}</span>
          </div>
          <!-- <div v-show="!(value.reason =='')" class="reason" style="float: right;">驳回原因:{{value.reason}}</div> -->
        </div>
        <div class="action" v-show="whatTableone==whatTable">
          <div @click="goRepeal(value.id)" class="sliderBtn check control-i" style="float: right;" :class="index==num? 'checkone' : ''" v-show="(value.status=='WAITING')?true:false"> <i class="iconfont icon-chexiao"></i><span>撤销申请</span></div>
          <div @click="goRepeal(value.id)" class="check control-i" style="float: right;" :class="index==num? 'checkone' : ''" v-show="(value.status=='WAITING')?true:false"> <i class="iconfont icon-chexiao"></i><span>撤销申请</span></div>
          <div @click="goInner(value.id)" class="sliderBtn check control-i" style="float: right;" :class="index==num? 'checkone' : ''" v-show="(value.status=='NO_PASS')?true:false"><i class="iconfont icon-zhongxinshangchuan"></i>重新申请</div>
          <div @click="goInner(value.id)" class="check control-i" style="float: right;" :class="index==num? 'checkone' : ''" v-show="(value.status=='NO_PASS')?true:false"><i class="iconfont icon-zhongxinshangchuan"></i>重新申请</div>
          <div @click="goDelete(value.id,value.status)" class="sliderBtn check control-i" style="float: right;" :class="index==num? 'checkone' : ''" v-show="(value.status=='PASS')?true:false"><i class="iconfont icon-shanchu"></i>删除企业</div>
          <div @click="goDelete(value.id,value.status)" class="check control-i" style="float: right;" :class="index==num? 'checkone' : ''" v-show="(value.status=='PASS')?true:false"><i class="iconfont icon-shanchu"></i>删除企业</div>
        </div>
        <div class="action" v-show="whatTabletwo==whatTable" style="float: right;" :class="index==num? 'pagetwoone' : ''">
          <div v-show="value.status==''" @click="jumpPage(value)">
            <i class="iconfont icon-jiaruwomen"></i>
            <span>申请加入</span>
          </div>
          <div class="sliderBtn" v-show="value.status==''" @click="jumpPage(value)">
            <i class="iconfont icon-jiaruwomen"></i>
            <span>申请加入</span>
          </div>
          <div v-show="value.status=='WAITING'" @click="cancelApply(value.id)">
            <i class="iconfont icon-chexiao"></i>
            <span>撤销申请</span>
          </div>
          <div class="sliderBtn" v-show="value.status=='WAITING'" @click="cancelApply(value.id)">
            <i class="iconfont icon-chexiao"></i>
            <span>撤销申请</span>
          </div>
          <div v-show="value.status=='NO_PASS'" @click="jumpPage(value,'again')">
            <i class="iconfont icon-zhongxinshangchuan"></i>
            <span>重新申请</span>
          </div>
          <div class="sliderBtn" v-show="value.status=='NO_PASS'" @click="jumpPage(value,'again')">
            <i class="iconfont icon-zhongxinshangchuan"></i>
            <span>重新申请</span>
          </div>
          <div v-show="value.status=='PASS'" @click="quit(value)">
            <i class="iconfont icon-shanchu"></i>
            <span>退出企业</span>
          </div>
          <div class="sliderBtn" v-show="value.status=='PASS'" @click="quit(value)">
            <i class="iconfont icon-shanchu"></i>
            <span>退出企业</span>
          </div>
          <div class="spancolor"></div>
        </div>
        <div class="action" v-show="whatTablethree==whatTable&&enterpriseid!==value.enterpriseId" style="float: right;" :class="index==num? 'pagetwoone' : ''">
          <div class="switch" @click="getWhichEnterprise(value)">
            <i class="iconfont icon-qiehuan"></i>
            <span>&nbsp;切换</span>
          </div>
          <div class="sliderBtn" @click="getWhichEnterprise(value)">
            <i class="iconfont icon-qiehuan"></i>
            <span>&nbsp;切换</span>
          </div>
        </div>
      </div>
    </div>
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" v-show="total>10" :current-page.sync="currentPage" :page-size="pageSize" layout="prev, pager, next,total,jumper" :total="total" prev-text="上一页" next-text="下一页">
    </el-pagination>
  </div>
</template>
<script>
import UtilService from '../../../publicJs/UtilService.js'
import ApiClient from '../../../publicJs/ApiClient'
import LoadingBoxService from '../../../publicJs/LoadingBoxService.js'
import NoticeBoxService from '../../../publicJs/NoticeBoxService.js'
export default {
  props: ['table', 'whatTable', 'personInfo', 'whatTablePerson1', 'total', 'status', 'logintype', 'enterpriseid'],
  filters: {
    formatDuring (time) {
      return UtilService.formatDuring(time, 'yyyy-MM-dd HH:mm:ss')
    }
  },
  data () {
    return {
      personalvalue: {// 模拟的个人的数据
        name: '个人身份',
        enterpriseId: '' || null,
        enterpriseName: '' || null
      },
      whatTableone: 1,
      whatTabletwo: 2,
      whatTablethree: 3,
      whatTablePerson: 4,
      indexNum: -1,
      num: -1,
      currentPage: 1,
      pageSize: 10,
      somedata: {
        cosplay: true,
        display: false
      },
      timeTitle: ''
    }
  },
  mounted () {
    console.log(this.$route.name)
    if (this.$route.name === 'createEnterprise') {
      this.timeTitle = '创建时间：'
    } else {
      this.timeTitle = '申请加入时间：'
    }
  },
  methods: {
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.$emit('pageChange', val)
    },
    renormal () {
      this.num = -1
    },

    changeClass (index) {
      this.num = index
    },
        // 跳申请页面
    jumpPage (value, type) {
      this.$emit('child-say', value, type)
    },
        // 取消申请
    cancelApply (id) {
      this.$emit('cancelApply', id)
    },
    // 退出企业
    quit (value) {
      this.$emit('quit', value)
    },
    goInner (id) {
      this.$router.push({path: 'innercreateEnterprise?' + '&id=' + id})
    },
    getWhichEnterprise (value) {
      console.log(2222)
      this.$emit('changeEnterprise', value)
    },
//    goDetail (id) {
//      this.$router.push({path: 'innercreateEnterprise?' + '&id=' + id + '&path=' + 1})
//    },
    goRepeal (id) {
      var that = this
      NoticeBoxService.open('您确定要撤销申请？', function () {
//              LoadingBoxService.open('正在撤销申请...')
        ApiClient.get('/pcapi/enterprise/deleteById', {
          id: id
        }).then(data => {
          that.$parent.getTableData()
          NoticeBoxService.close()
          console.log(100)
//                  LoadingBoxService.close()
        }).catch(e => {
        })
      })
    },
    goDelete (id, status) {
      console.log(id)
      var that = this
      NoticeBoxService.open('您确定要删除企业？', function () {
//          LoadingBoxService.open('正在退出企业...')
        ApiClient.get('/pcapi/enterprise/delete', {
          id: id
        }).then(data => {
          NoticeBoxService.close()
          console.log(data)
          ApiClient.get('/pcapi/enterprise/list', {
            keyword: '',
            pageNum: '',
            pageSize: 10,
            approvalStatus: status,
            soteType: ''
          }).then(data => {
            that.$emit('passdata', data)
            that.$parent.getTableData()
//                  LoadingBoxService.close()
          }).catch(e => {
          })
        }).catch(e => {
        })
      })
    }
  }
}
</script>
<style scoped>
.tableList .tableListLine {
  height: 90px;
  border-bottom: 1px solid #f1f1f1;
  border-right: 1px solid #f1f1f1;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
}
.tableList .tableListLine > div::after{
  content: '';
  transition: all 0.1s;
}
.tableList .tableListLine > div:hover::after{
   content: '';
    position: absolute;
    top:0;
    left: 0px;
    bottom: 0;
    right: 0;
    border: 2px #55a8fd solid;
    z-index: 96;
    box-shadow: 0 0 8px rgba(85,168,253,.7)
}
/* .tableList .tableListLine:hover {
  border: 2px solid #55a8fd;
 
  box-shadow: 0 0 8px rgba(85,168,253,.7);
  box-sizing: border-box;
} */

.tableListLeft {
  width: 90%;
  height: 90px;
  padding-left: 25px;
  padding-top: 20px;
  box-sizing: border-box;
}
.company {
  white-space: nowrap;
  text-overflow: ellipsis;
  width: 200px;
  height: 19px;
  text-align: left;
  font: normal 600 13px "microsoft yahei";
  display: inline-block;
  overflow: hidden;
}

.status {
  display: inline-block;
  border: 1px solid;
  width: 57px;
  height: 20px;
  border-radius: 10px;
  text-align: center;
  vertical-align: top;
  margin-left: 30px;
}

.address {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  color: #666;
  width: 315px;
  margin-top: 7px;
}
.reason {
  height: 53px;
  width: 285px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
  color: #ff97a7;
}

.time {
  float: left;
  margin-top: 32px;
  padding-left: 100px;
  box-sizing: border-box;
}

/*.check {*/
  /*position: relative;*/
  /*text-align: center;*/
  /*vertical-align: middle;*/
  /*line-height: 81px;*/
  /*width: 10%;*/
  /*height: 81px;*/
  /*background-color: #fcfcfc;*/
  /*color: #56a8fe;*/
/*}*/

.checkone {
  position: relative;
  box-shadow: inset 0px 1px #56a8fe, inset -1px -0px #56a8fe;
  text-align: center;
  vertical-align: middle;
  line-height: 90px;
  width: 10%;
  height: 90px;
  transition: all ease-in-out 0.2s;
  background-color: #fcfcfc;
  color: black;
  cursor: pointer;
  z-index: 2;
}
.checkblock {
  position: relative;
  text-align: center;
  vertical-align: middle;
  line-height: 92px;
  width: 10%;
  height: 90px;
  background-color: #56a8fe;
  opacity: 0.5;
  transform: translateX(1000%);
  color: white;
  z-index: 2;
}
.checkblockone {
  position: relative;
  z-index: 2;
  opacity: 0.5;
  text-align: center;
  vertical-align: middle;
  line-height: 92px;
  width: 10%;
  height: 90px;
  background-color: #56a8fe;
  transform: translateX(900%);
  transition: all ease-in-out 0.4s;
  color: black;
  cursor: pointer;
}
.time span {
  /* display: block; */
  margin-top: 8px;
  color: #666;
}

.public {
  z-index: 12;
}

.statusColorOne {
  box-shadow: inset 1px 1px #56a8fe, inset -1px -1px #56a8fe;
  transition: all ease-in-out 0.2s;
}
.redClass {
  color: #ff365a;
  border-color: #ff365a;
}
.blueClass {
  color: #40afff;
  border-color: #40afff;
}
.greenClass {
  color: #19c000;
  border-color: #19c000;
}
.statusColorTwo {
  box-shadow: inset 0px 1px #56a8fe, inset -1px -1px #56a8fe;
  transition: all ease-in-out 0.2s;
}
.pagetwo {
  text-align: center;
  vertical-align: middle;
  line-height: 90px;
  width: 10%;
  height: 90px;
  background-color: #fcfcfc;
  color: #56a8fe;
  z-index: 2;
  cursor: pointer;
}
.pagetwo i {
  position: relative;
  top: -13px;
  left: 31px;
}
.pagetwo span {
  position: relative;
  top: 8px;
  /*display: block;*/
}
.pagetwoone {
  box-shadow: inset 0px 1px #56a8fe, inset -1px 0px #56a8fe;
  transition: all ease-in-out 0.2s;
}
.spancolor {
}
.pagethree {
  text-align: center;
  vertical-align: middle;
  line-height: 90px;
  width: 10%;
  height: 90px;
  background-color: #fcfcfc;
  color: #56a8fe;
  z-index: 2;
  cursor: pointer;
}
.pagethree i {
  position: relative;
  top: -12px;
  left: 17px;
}
.pagethree span {
  position: relative;
  top: 8px;
  left: -6px;
  /*display: block;*/
}
.action {
  height: 90px;
  width: 10%;
  border-left: 1px solid #f1f1f1;
  background-color: #fcfcfc;
  float: right;
  position: relative;
  box-sizing: border-box;
}
.action .switch {
  width: 100%;
  height: 90px;
  text-align: center;
  cursor: pointer;
  color: #6aa7f7;
  font-size: 14px;
}
.action > div > i {
  display: block;
  padding-top: 20px;
  padding-bottom: 2px;
  box-sizing: border-box;
  font-size: 18px;
}
.sliderBtn {
  width: 100%;
  height: 90px;
  background-color: #56a8fe !important;
  color: #fff !important;
  font-size: 14px;
  position: absolute;
  left: 102%;
  top: 0;
  text-align: center;
  cursor: pointer;
  transition: all 0.4s;
  z-index: 100;
}
.tableList .tableListLine:hover .sliderBtn {
  left: 0;
}
.control-i i {
  position: relative;
  top:0;
}
.icon-location{
  color: #ff9400 !important;
}
</style>
