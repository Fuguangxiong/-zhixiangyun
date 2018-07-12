<template>
  <div class="tableList">
	<div class="tableListLine" v-if="personInfo">
	  <div>
		<div class="tableListLeft" style="float: left;">
		  <div style="float: left;">
			<div class="company">个人身份</div>
		  </div>
		</div>

		<div class="action" style="float: right;" v-show="logintype!=='PERSONAL'">
		  <div @click="getWhichEnterprise(personalvalue)">
			<i class="iconfont icon-qiehuan"></i>
			<span>&nbsp切换</span>
		  </div>
		  <div class="sliderBtn" @click="getWhichEnterprise(personalvalue)">
			<i class="iconfont icon-qiehuan"></i>
			<span>&nbsp切换</span>
		  </div>
		</div>
	  </div>
	</div>

	<div v-for="(value,index) in table" :key="index" class="tableListLine">
	  <div>
		<div class="tableListLeft" style="float: left;">
		  <div style="float: left; margin-top: 5px;">
			<div class="company" :title="value.name">{{value.name}}</div>
			<div class="status" v-show="value.status" :class="value.status=='WAITING'? 'blueClass' : value.status == 'PASS'? 'greenClass' : value.status == 'NO_PASS'? 'redClass' :''">
			  {{value.status == "WAITING" ? "待审核" : value.status == "PASS" ? "已通过" : value.status == "NO_PASS" ? "未通过" : ""}}
			</div>
			<div class="address">
			  <i class="iconfont icon-location" style="color: #ff9400"></i>&nbsp&nbsp{{value.province}}{{value.city}}{{value.address}}
			</div>
		  </div>
		  <div class="time" v-show="value.applicationTime">
			<span>{{value.applicationTime | formatDuring }}</span>
		  </div>
		  <div v-show="value.status == 'NO_PASS' && value.reason != ''? true : false" class="reason" style="float: left;">
			驳回原因:{{value.reason}}
		  </div>
		  <div class="high-ranking">
			<div @click="clickHigh(index)" style="cursor: pointer;"><span style="vertical-align: baseline">高级</span>
			  <i class="iconfont icon-arrow-down"></i></div>
			<div v-show="index===curAction">
			  <div class="high-rankingDiv" v-show="(value.status==='NO_PASS')?true:false" @click="goInner(value.id)" style="cursor: pointer;margin:0;color: #000;">
				重新申请
			  </div>
			  <div class="high-rankingDiv" v-show="(value.status==='PASS')?true:false" @click="goDelete(value.id,value.status)" style="cursor: pointer;">
				删除企业
			  </div>
			  <div class="high-rankingDiv" v-show="(value.status==='WAITING')?true:false" @click="goRepeal(value.id)" style="cursor: pointer;">
				撤销申请
			  </div>
			</div>
		  </div>
		</div>
		<div class="action" v-show="whatTableone==whatTable">
		  <div class="sliderBtn control-i" @click="goDetail(value.id)">
			查看
		  </div>
		  <div class="control-i" @click="goDetail(value.id)">
			查看
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
  import TipBoxService from '../../../publicJs/TipBoxService.js'

  export default {
    props: ['table', 'whatTable', 'personInfo', 'whatTablePerson1', 'total', 'status', 'logintype', 'enterpriseid', 'currentPage'],
    filters: {
      formatDuring (time) {
        return UtilService.formatDuring(time, 'yyyy-MM-dd HH:mm:ss')
      }
    },
    data () {
      return {
        clickshowHigh: false,
        personalvalue: {// 模拟的个人的数据
          name: '个人身份',
          enterpriseId: '' || null,
          enterpriseName: '' || null
        },
        whatTableone: 1,
        whatTabletwo: 2,
        whatTablethree: 3,
        whatTablePerson: 4,
        showNum: 0,
        indexNum: -1,
        num: -1,
        pageSize: 10,
        somedata: {
          cosplay: true,
          display: false
        },
        timeTitle: '',
        curAction: -1
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
      goDetail (id) {
        this.$router.push({path: 'detailcreateEnterprise?' + '&id=' + id + '&path=' + 1})
      },
      clickHigh (index) {
        if (this.curAction === index) {
          this.curAction = -1
        } else {
          this.curAction = index
        }
      },
      goRepeal (id) {
        var that = this
        NoticeBoxService.open('您确定要撤销申请？', function () {
//              LoadingBoxService.open('正在撤销申请...')
          ApiClient.get('/pcapi/enterprise/deleteById', {
            id: id
          }).then(data => {
            that.curAction = -1
            console.log(data, '撤销申请状态码');
            if (data === true) {
              that.$parent.getTableData()
            }
            if (data === false) {
              TipBoxService.open('撤销申请失败', 2)
            }
            NoticeBoxService.close()
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
            that.curAction = -1
            NoticeBoxService.close()
            console.log(data)
            if (data === 3) {
              TipBoxService.open('该企业有用户加入无法删除', 2)
            }
            if (data === 2) {
              TipBoxService.open('删除企业失败', 2)
            }
            if (data === 1) {
              ApiClient.get('/pcapi/enterprise/list', {
                keyword: '',
                pageNum: '',
                pageSize: 10,
                approvalStatus: status,
                soteType: ''
              }).then(data => {
                console.log(data, '状态码');
                that.$emit('passdata', data)
                that.$parent.getTableData()
//                  LoadingBoxService.close()
              }).catch(e => {
              })
            }
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
	padding: 2px 0 0;
	border-bottom: 1px solid #eeeeee;
	overflow: hidden;
	position: relative;
  }
  /*用伪元素造边框*/
  .tableList .tableListLine > div::after {
	content: '';
	transition: all 0.1s;
  }
  .tableList .tableListLine > div:hover::after {
	content: '';
	position: absolute;
	top: 0;
	left: 0;
	bottom: 0;
	right: 0;
	border: 2px #55a8fd solid;
	z-index: 20;
	box-shadow: 0 0 8px #55a8fd
  }
  .tableListLeft {
	width: 90%;
	height: 100%;
	padding-left: 25px;
	padding-top: 12px;
  }
  .tableList .time {
  }
  .company {
	white-space: nowrap;
	text-overflow: ellipsis;
	/*width: 200px;*/
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
	margin-left: 10px;
  }
  .address {
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow: hidden;
	color: gray;
	width: 315px;
	margin-top: 7px;
	color: #959595;
  }
  .reason {
	margin-left: 64px;
	height: 53px;
	width: 201px;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 3;
	overflow: hidden;
	color: #ff97a7;
  }
  .time {
	float: left;
	margin-top: 37px;
	padding-left: 100px;
	color: #959595;
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
	/* display: block; */
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
  .action {
	height: 89px;
	width: 121px;
	background-color: #fafafa;
	line-height: 89px;
	border-left: 1px solid #f1f1f1;
	border-right: 1px solid #f1f1f1;
	float: right;
	position: absolute;
	top: 0px;
	right: 0px;
	box-sizing: border-box;
  }
  .action > div {
	height: 88px;
	width: 120px;
	line-height: 88px;
	text-align: center;
	cursor: pointer;
	color: #55a8fd;
	box-sizing: border-box;
  }
  .sliderBtn {
	background-color: #55a8fd !important;
	color: #fff !important;
	border-left: 1px solid #55a8fd;
	border-right: 1px solid #55a8fd;
	position: absolute;
	width: 89px;
	left: 121px;
	top: 0;
	transition: all 0.4s;
	z-index: 100;
  }
  .tableList .tableListLine:hover .sliderBtn {
	left: 0px;
	position: absolute;
	top: 0;
  }
  .control-i {
	line-height: 90px;
  }
  .control-i i {
	position: relative;
	top: 0;
  }
  .high-ranking {
	width: 67px;
	height: 45px;
	float: right;
	position: relative;
	top: 0;
	left: -7px;
  }
  .high-ranking div:first-of-type {
	margin: 0 0 0 12px;
	color: #56A8FC;
	position: relative;
	z-index: 30;
  }
  .high-ranking .high-rankingDiv {
	border: 1px solid #EEEEEE;
	text-align: center;
	border-radius: 5px;
	height: 29px;
	line-height: 29px;
	position: relative;
	z-index: 30;
	width: 56px;
	left: 5px;
	box-shadow: 0px 1px 2px rgba(0, 0, 0, .2);
  }
  .high-ranking .high-rankingDiv:hover {
	color: #56a8fe;
  }
  .tableList .tableListLine:hover .sliderBtn {
	left: -1px;
  }
</style>
