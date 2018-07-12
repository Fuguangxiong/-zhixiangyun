<template>
    <div class="tableList">
        <div v-for="(value,index) in table"
             class="tableListLine" @mouseenter="changeClass(index)" @mouseleave="renormal()"
             :class="index==num? 'statusColorOne' : ''">
            <div>
                <div class="tableListLeft" style="float: left;">
                    <div style="float: left;">
                        <div class="company" :title="value.name">{{value.name}}</div>
                        <div class="address"><i v-show="!(whatTablePerson==whatTablePerson1)" class="iconfont icon-location"
                                                style="color: #D7B146;"></i>&nbsp&nbsp{{value.address}}
                        </div>
                    </div>
                    <div class="time">
                        <i ></i><span>{{value.applicationTime}}</span>
                    </div>
                    
                </div>
              
                <div v-show="whatTablethree==whatTable" class="pagethree" style="float: right;" :class="index==num? 'pagetwoone' : ''">
                    <div v-show="switch1"><i class="iconfont icon-qiehuan"></i><span>&nbsp切换</span></div>
                    <div></div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import UtilService from '../../../publicJs/UtilService.js'
import ApiClient from '../../../publicJs/ApiClient'
export default {
  props: [
    'table',
    'switch1',
    'whatTable',
    'whatTablePerson1',
    'total',
    'status'
  ],
  data () {
    return {
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
      }
    }
  },
  methods: {
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      var that = this
      this.currentPage = val
      ApiClient.get('/pcapi/enterprise/list', {
        keyword: '',
        pageNum: val,
        pageSize: 10,
        approvalStatus: that.status,
        soteType: '',
        tokenId: '6e431187589d4e81a9bb890f88f9c90d'
      })
        .then(data => {
          that.$emit('passdata', data)
        })
        .catch(e => {})
    },
    renormal () {
      this.num = -1
    },
    // 获取列表数据
    //            getTableData() {
    //                var that = this
    //                ApiClient.get('/pcapi/enterprise/queryCreateApplyList', {
    //                    keyword: '',
    //                    pageNum: 1,
    //                    pageSize: 10,
    //                    status: '',
    //                    soteType: ''
    //                }).then(data => {
    //                    that.tableone = data.results.data
    //                }).catch(e => {
    //                })
    //            },
    changeClass (index) {
      this.num = index
    },
    jumpPage () {
      this.$emit('child-say', this.somedata)
    },
    goInner (id) {
      //                var that = this
      //               ApiClient.get('/pcapi/enterprise/update', {
      //                   keyword: '',
      //                    pageNum: 1,
      //                    pageSize: 10,
      //                    status: '',
      //                    soteType: ''
      //                }).then(data => {
      //                    that.tableone = data.results.data
      //               }).catch(e => {
      //               })
      this.$router.push({ path: 'innercreateEnterprise?' + '&id=' + id })
    }
  }
}
</script>
<style scoped>
.tableList .tableListLine {
  height: 92px;
  border-bottom: 1px solid #eeeeee;
}

.tableListLeft {
  width: 90%;
  height: 92px;
  padding-left: 25px;
  padding-top: 20px;
}

.tableList .time {
}

.company {
  white-space: nowrap;
  text-overflow: ellipsis;
  width: 203px;
  height: 19px;
  text-align: left;
  font: normal 600 15px "microsoft yahei";
  display: inline-block;
  overflow: hidden;
}

.status {
  display: inline-block;
  border: 1px solid;
  width: 57px;
  height: 19px;
  border-radius: 5px;
  text-align: center;
  vertical-align: top;
  margin-left: 30px;
}

.address {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  color: gray;
  width: 315px;
  margin-top: 11px;
}

/* .address i{
         display: inline-block;
         width: 15px;
         height: 15px;
     }*/
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
  padding-left: 119px;
}

.check {
  position: relative;
  text-align: center;
  vertical-align: middle;
  line-height: 90px;
  width: 10%;
  height: 90px;
  background-color: #fcfcfc;
  color: #56a8fe;
  z-index: 2;
}

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
  display: block;
  margin-top: 8px;
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
</style>
