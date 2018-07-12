<template>
  <div id="platformAuthority">
	<div class="commonRightBottoTopContainer">
	  <right-top-nav :links="topNavData.breadLinks" :searchname="topNavData.searchTitle" :searchword="topNavData.searchWord" v-on:search="topNavSearchHandler"></right-top-nav>
	</div>
	<div class="commonRightBottoBottomContainer specil">
	  <div class="publicWidthHeightContainer whiteBg">
		<div class="commonLayoutRightBottomContainer auditEnterprise" style="padding-top: 20px;height: 100%;">
		  <el-tabs v-model="activeTab" type="card" style="height: 100%;">
			<el-tab-pane label="未审批" name="noAudit" style="height:100%;">
			  <div class="commonTableTable">
				<div class="publicWidthHeightContainer">
				  <div class="publicWidthHeightContainer hasScroll">
					<my-component :body-data="tableData.bodyData" :renew="tableData.renewNum" :get-table-data="tableData.departId" :page-total="tableData.pageTotal" :search-table-data="tableData.searchWord" v-on:searchlink="searchTableDataHandler" v-on:change="tableBtnClickHandler" v-on:link="tableLinkHandler"></my-component>
				  </div>
				</div>
			  </div>
			</el-tab-pane>
			<el-tab-pane label="已经审批" name="haveAudit">
			  <div class="commonTableTable">
				<div class="publicWidthHeightContainer">
				  <div class="publicWidthHeightContainer hasScroll">
					<my-component2 :body-data="tableData2.bodyData" :renew="tableData2.renewNum" :get-table-data="tableData2.departId" :page-total="tableData2.pageTotal" :search-table-data="tableData2.searchWord" v-on:searchlink="searchTableDataHandler2" v-on:change="tableBtnClickHandler" v-on:link="tableLinkHandler2" v-on:tablelinkclick="tableLinkClickHandler"></my-component2>
				  </div>
				</div>
			  </div>
			</el-tab-pane>
		  </el-tabs>
		</div>
	  </div>
	</div>
  </div>
</template>

<script>
  import HttpService from '../../../publicJs/ApiClient'
  import header from '../../../publicComponent/publicTopNavComponent.vue'
  import leftNav from '../../../publicComponent/publicLeftNavComponent.vue'
  import rightTopNav from '../../components/CommonRightTopNavComponent.vue'
  import bottomComponent from '../../../publicComponent/publicBottomComponent.vue'
  import TipBoxService from '../../../publicJs/TipBoxService'
  import NoticeBoxService from '../../../publicJs/NoticeBoxService'
  import publicNavData from '../../publicJs/TransformLeftNavData'
  import ToolService from '../../publicJs/ToolService'
  import commonTable from '../../components/CommonTableComponent.vue'
  import commonBtn from '../../components/CommonBtnControlComponent.vue'

  export default {
    name: 'auditEnterprise',
    components: {
      'left-nav': leftNav,
      'public-header': header,
      'public-bottom': bottomComponent,
      'right-top-nav': rightTopNav,
      'my-component': commonTable,
      'my-component2': commonTable
    },
    data () {
      return {
        menuName: '审批企业',
        // 面包屑信息
        topNavData: {
          breadLinks: [{name: '企业用户审核', link: '#'}],
          searchTitle: '姓名/电话号'
        },
        leftNavData: [],
        publicTopNavData: [],
        activeTab: 'noAudit',
        tableData: {
          departId: 0,
          bodyData: [],
          renewNum: 0,
          pageTotal: 0,
          searchWord: '',
          getSelectNum: 0
        },
        tableData2: {
          departId: 0,
          bodyData: [],
          renewNum: 0,
          pageTotal: 0,
          searchWord: '',
          getSelectNum: 0
        },
        btnControlData: {}
      }
    },
    mounted () {
      this.$parent.hub.$on('getPriviData', (data) => {
        this.publicTopNavData = data
      })
      this.tableData.departId = ''
      this.tableData2.departId = ''
    },
    methods: {
      topNavSearchHandler: function (data) {
        //console.info("search=",data);
        // window.location.href = 'accountManage.html?word=' + data
        this.$router.push('/accountManage?word=' + data)
      },
      //表单请求事件
      tableLinkHandler (data) {
        var that = this
        data.status = 0
        data.param = that.tableData.searchWord
        HttpService.get('priviapi/enterprise/searchApproval', data, function (data) {
          if (data.data.approvalList != null && data.data.approvalList.length > 0) {
            that.tableData.pageTotal = data.data.page.rowCount
            var bodyData = that.dataHandler(data.data.approvalList)
            that.tableData.bodyData = bodyData
          } else {
            that.tableData.bodyData = 'error' + Math.random()
          }
        })
      },
      tableLinkHandler2 (data) {
        var that = this
        data.status = 1
        data.param = that.tableData2.searchWord
        HttpService.get('priviapi/enterprise/searchApproval', data, function (data) {
          if (data.data.approvalList != null && data.data.approvalList.length > 0) {
            that.tableData2.pageTotal = data.data.page.rowCount
            var bodyData = that.dataHandler2(data.data.approvalList)
            that.tableData2.bodyData = bodyData
          } else {
            that.tableData2.bodyData = 'error' + Math.random()
          }
        })
      },
      //把后台数据转化为表单需要的格式
      dataHandler (dataList) {
        for (var i = 0; i < dataList.length; i++) {
          var obj = dataList[i]
          var lineData = [
            {img: true, imageClass: 'depart', itemWidth: '5%'},
            {
              text: true,
              itemWidth: '30%',
              textData: {
                公司名称: obj.enterpriseName
              }
            },
            {
              text: true,
              itemWidth: '25%',
              textData: {
                申请人: obj.userName
              }
            },
            {
              text: true,
              itemWidth: '25%',
              textData: {
                手机号: obj.phone
              }
            },
            {
              fontBtn: true, itemWidth: '15%', btnArr: [{class: '', clickType: 'edit', title: '详情'}]
            }
          ]
          obj.lineData = lineData
        }
        return dataList
      },
      //把后台数据转化为表单需要的格式
      dataHandler2 (dataList) {
        for (var i = 0; i < dataList.length; i++) {
          var obj = dataList[i]
          var lineData = [
            {img: true, imageClass: 'depart', itemWidth: '10%'},
            {
              text: true,
              itemWidth: '30%',
              textData: {
                公司名称: obj.enterpriseName
              }
            },
            {
              text: true,
              itemWidth: '30%',
              textData: {
                申请人: obj.userName
              }
            },
            {
              text: true,
              itemWidth: '30%',
              textData: {
                手机号: obj.phone
              }
            }
          ]
          obj.lineData = lineData
        }
        return dataList
      },
      //公共头部搜索按钮事件
      topNavSearchHandler (data) {
        this.tableData.departId = 'noLink'
        this.tableData.searchWord = data
      },
      //表单发出的模糊搜索请求
      searchTableDataHandler (data) {
        //console.info("jkjkkk",data);
        var that = this
        data.status = 0
        data.param = that.tableData.searchWord
        HttpService.get('priviapi/enterprise/searchApproval', data, function (data) {
          if (data.data.approvalList != null && data.data.approvalList.length > 0) {
            that.tableData.pageTotal = data.data.page.rowCount
            var bodyData = that.dataHandler(data.data.approvalList)
            that.tableData.bodyData = bodyData
          } else {
            that.tableData.bodyData = 'error' + Math.random()
          }
        })
      },
      //表单发出的模糊搜索请求
      searchTableDataHandler2 (data) {
        //console.info("jkjkkk",data);
        var that = this
        data.status = 1
        data.param = that.tableData2.searchWord
        HttpService.get('priviapi/enterprise/searchApproval', data, function (data) {
          if (data.data.approvalList != null && data.data.approvalList.length > 0) {
            that.tableData.pageTotal = data.data.page.rowCount
            var bodyData = that.dataHandler(data.data.approvalList)
            that.tableData.bodyData = bodyData
          } else {
            that.tableData.bodyData = 'error' + Math.random()
          }
        })
      },
      //点击表单行的时候发出的请求
      tableLinkClickHandler (data) {
        console.info('dfdfdfd=', data)
        //      window.location.href ='./assignPermissions.html?id='+data.id;
      },
      //左侧菜单点击事件
      linkChangeHandler (link) {
        // console.info("link=",link);
        publicNavData.gotoLeftNavLink(link.link)
      },
      //表单按钮点击事件
      tableBtnClickHandler (data) {
        console.info('ffffffff=', data)
        var that = this
        if (data.tableBtnType == 'edit') {
          var hrefStr = './auditEnterpriseDetail.html?id=' + data.id
          // window.location.href = hrefStr
          this.$router.push('/auditEnterpriseDetail?id=' + data.id)
        }
      },
      searchClickHandler () {
        this.tableData.renewNum++
      }
    }
  }
</script>
<style scoped>
  .specil .commonTableTable {
	position: relative;
	top: 0;
  }
  .commonTableTable {
	padding-top: 0px;
  }
</style>

<style>
  .auditEnterprise .el-tabs__content {
	padding: 0;
  }
</style>
