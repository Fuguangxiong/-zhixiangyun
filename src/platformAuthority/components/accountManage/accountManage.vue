<template>
  <div id="platformAuthority">
	<div class="commonRightBottoTopContainer">
	  <right-top-nav :links="topNavData.breadLinks" :searchname="topNavData.searchTitle" :searchword="topNavData.searchWord" v-on:search="topNavSearchHandler"></right-top-nav>
	  <!-- <div class="breadCrumb">
			  <i @click="" class="iconfont icon-dingwei"></i>
			  <a href="javascript:;" @click="">权限管理</a>
			  <span>部门管理</span>
			</div> -->
	</div>
	<div class="commonRightBottoBottomContainer">
	  <div class="publicWidthHeightContainer">
		<div class="commonTreeContainer">
		  <el-tree :data="treeData.data" highlight-current :expand-on-click-node="treeData.clickNode" :props="treeData.defaultProps" @node-click="nodeClickHandler"></el-tree>
		</div>
		<div class="commonTableContainer">
		  <div class="publicWidthHeightContainer">
			<div class="commonTableBtnContainer">
			  <div class="allSelectContainer">
				<el-checkbox v-model="tableData.allSelected" @change="headerCheckChangeHandler">全选</el-checkbox>
			  </div>
			  <btn-control :btn-data="btnControlData"></btn-control>
			</div>
			<div class="commonTableTable">
			  <div class="publicWidthHeightContainer">
				<div class="publicWidthHeightContainer hasScroll">
				  <my-component :all-selected="tableData.bodyAllSelected" :body-data="tableData.bodyData" :renew="tableData.renewNum" :get-select="tableData.getSelectNum" :get-table-data="tableData.departId" :page-total="tableData.pageTotal" :search-table-data="tableData.searchWord" v-on:searchlink="searchTableDataHandler" v-on:checkallchange="allCheckChangeHandler" v-on:selectdata="getTableSelectDataHandler" v-on:link="tableLinkHandler" v-on:tablelinkclick="tableLinkClickHandler"></my-component>
				</div>
			  </div>
			</div>
		  </div>
		</div>
	  </div>
	</div>
  </div>
</template>
<script>
  import rightTopNav from '../CommonRightTopNavComponent.vue'
  import HttpService from '../../../publicJs/ApiClient'
  import TipBoxService from '../../../publicJs/TipBoxService'
  import NoticeBoxService from '../../../publicJs/NoticeBoxService'
  import commonTable from '../CommonTableComponent.vue'
  import commonBtn from '../CommonBtnControlComponent.vue'
  import LoadingService from '../../../publicJs/LoadingBoxService'
  import ToolService from '../../publicJs/ToolService'
  import publicNavData from '../../publicJs/TransformLeftNavData'
  import publicPath from '../../../publicJs/publicPathConfig'
  import UtilService from '../../../publicJs/UtilService'

  export default {
    components: {
      'right-top-nav': rightTopNav,
      'my-component': commonTable,
      'btn-control': commonBtn
    },
    data () {
      return {
        sign: 0,
        menuName: '用户管理',
        topNavData: {
          breadLinks: [{name: '用户管理', link: '#'}],
          searchTitle: '姓名/电话号',
          searchWord: ''
        },
        leftNavData: [],
        publicTopNavData: [],
        btnControlData: {},
        tableData: {
          departId: 0,
          allSelected: false,
          bodyAllSelected: false,
          bodyData: [],
          renewNum: 0,
          pageTotal: 0,
          searchWord: '',
          getSelectNum: 0
        },
        treeData: {
          data: [],
          clickNode: false,
          defaultProps: {
            children: 'children',
            label: 'label'
          }
        },
        btnSelectType: 'no'
      }
    },
    mounted () {
      this.sign = this.$route.query.sign
      this.link()
      // var word = ToolService.getQueryString('word')
      var word = this.$route.query.word
      if (this.$parent.prividata && this.$parent.prividata.length !== 0) {
        this.getBtnArr(this.$parent.prividata)
      }
      this.$parent.hub.$on('getPriviData', (data) => {
        this.getBtnArr(data)
      })
      if (word != null) {
        this.topNavData.searchWord = word
        this.tableData.departId = 'noLink'
        this.tableData.searchWord = word
      }
      // 点击取消返回的时候展示列表
      console.log(this.sign)
      if (this.sign === '1') {
        let data = JSON.parse(sessionStorage.getItem('nodeData1'))
        console.log(data, '从暂存中取的data');
        this.nodeClickHandler(data)
      }
    },
    methods: {
      link () {
        // console.info("jkjkjkj");
        LoadingService.open('数据加载中...')
        var that = this
        HttpService.get('priviapi/deptpriv/getDeptTree', {param: ''}, function (data) {
          console.info('树=', data)
          that.treeData.data = data.data
          LoadingService.close()
        })
      },
      getBtnArr (data) {
        var that = this
        var menuId = publicNavData.getMenuId('用户管理', publicNavData.getPriviData('权限管理', data))
        var btnObj = {}
        HttpService.get('priviapi/authmanage/getUserAllPriv', {menuId: menuId}, function (data) {
          console.info('asa', data)
          for (var i = 0; i < data.data.length; i++) {
            var obj = data.data[i]
            if (obj.title == '新建') {
              btnObj.add = {fn: that.addBtnHandler}
            } else if (obj.title == '删除') {
              btnObj.remove = {fn: that.removeBtnHandler}
            } else if (obj.title == '发送短信') {
              btnObj.sentMsg = {fn: that.sentMsgHandler}
            } else if (obj.title == '重置密码') {
              btnObj.resetPassword = {fn: that.resetPasswordHandler}
            }
          }
          that.btnControlData = btnObj
        })
      },
      getTableSelectDataHandler (data) {
        console.info('selectData=', data)
        var that = this
        if (that.btnSelectType == 'remove') {
          if (data.length == 0) {
            TipBoxService.open('请选择删除项！', 2)
          } else {
            NoticeBoxService.open('确定要删除账户吗？', function () {
              NoticeBoxService.close()
              LoadingService.open('正在删除，请稍候...')
              let arr = new Array()
              for (var i = 0; i < data.length; i++) {
                let id = data[i].userId
                let entId = data[i].enterpriseId
                arr.push({enterpriseId: entId, userId: id})
              }
              var sendData = arr
              LoadingService.close()
              // HttpService.getLink('deptpriv/batchDeleteDept',sendData,function (data) {
              HttpService.post('priviapi/accountpriv/batchDeleteUser', sendData, function (data) {
                console.info('删除=', data)
                LoadingService.close()
                if (data.status == 200) {
                  TipBoxService.open('删除成功！', 0)
                  that.tableData.renewNum++
                  that.link()
                } else {
                  TipBoxService.open('删除失败！', 1)
                }
              }).catch(e => {
                TipBoxService.open('删除失败！', 1)
              })
            })
          }
        } else if (that.btnSelectType == 'reset') {
          if (data.length == 0) {
            TipBoxService.open('请勾选要重置的账户！', 2)
          } else {
            NoticeBoxService.open('确定要将所勾选账户重置密码吗？', function () {
              NoticeBoxService.close()
              LoadingService.open('正在重置，请稍候...')
              let arr = new Array()
              for (var i = 0; i < data.length; i++) {
                let id = data[i].userId
                arr.push(id)
              }
              HttpService.get('priviapi/account/resetPwd', 'param=' + arr.toString(), function (data) {
                LoadingService.close()
                if (data.status == '200') {
                  if (data.data.result == 'success') {
                    TipBoxService.open('重置成功，默认密码为123456！', 0)
                  }
                } else {
                }
              })
            })
          }
        }
      },
      topNavSearchHandler (data) {
        console.info('search=', data)
        this.tableData.departId = 'noLink'
        this.tableData.searchWord = data
      },
      addBtnHandler () {
        console.info('新建')
        // window.location.href = './accountAddEdit.html'
        this.$router.push('/accountAddEdit')
      },
      removeBtnHandler () {
        console.info('删除')
        var that = this
        that.btnSelectType = 'remove'
        that.tableData.getSelectNum++
      },
      resetPasswordHandler () {
        console.info('重置密码')
        var that = this
        that.btnSelectType = 'reset'
        that.tableData.getSelectNum++
      },
      sentMsgHandler () {
        console.info('发送密码')
      },
      exportHandler () {
        console.info('导出')
      },
      searchTableDataHandler (data) {
        console.info('表单发起的连接请求', data)
        var that = this
        HttpService.get('priviapi/accountpriv/searchUser', data, function (data) {
          that.tableData.bodyData = bodyData
          if (data.data.userList != null) {
            that.tableData.pageTotal = data.data.page.rowCount
            var bodyData = that.dataHandler(data.data.userList)
            that.tableData.bodyData = bodyData
          } else {
            that.tableData.bodyData = 'error' + Math.random()
          }
        })
      },
      tableLinkHandler (data) {
        console.info('表单发起的连接请求', data)
        var that = this
        HttpService.get('priviapi/userrole/searchDepartIdUser', data, function (data) {
          console.info('jjjjjjj=', data)
          that.tableData.bodyData = bodyData
          if (data.data.userList != null) {
            that.tableData.pageTotal = data.data.page.rowCount
            var bodyData = that.dataHandler(data.data.userList)
            that.tableData.bodyData = bodyData
          } else {
            that.tableData.bodyData = 'error' + Math.random()
          }
        })
      },
      dataHandler (dataList) {
        for (var i = 0; i < dataList.length; i++) {
          var obj = dataList[i]
          // var lineData=[{check:true,checkData:false},{link:true,text:true,name:obj.userName},{text:true,name:obj.phone},{text:true,name:obj.phone},{text:true,name:obj.position},{text:true,name:obj.mail},{text:true,name:obj.createTime}];
          var lineData = [
            {img: true, imageClass: 'accout', itemWidth: '5%'},
            {
              text: true,
              itemWidth: '25%',
              textData: {
                姓名: obj.userName,
                手机: obj.phone
              }
            },
            {
              text: true,
              itemWidth: '30%',
              textData: {
                职位: obj.position,
                邮箱: obj.email
              }
            },
            {
              text: true,
              itemWidth: '35%',
              textData: {
                创建时间: UtilService.formatDuring(obj.createTime, 'yyyy-MM-dd'),
                所属企业: obj.enterpriseName
              }
            },
            {check: true, itemWidth: '5%', checkData: false}
          ]
          obj.lineData = lineData
        }
        return dataList
      },
      nodeClickHandler (data) {
        // if(data.children==undefined || data.children.length==0){
        console.info('detail', data)
        sessionStorage.setItem('nodeData1', JSON.stringify(data))
        this.tableData.departId = data.id
        // this.tableData.departId='111';
        // }
      },
      bumImport () {
        this.$router.push('/accountImport')
      },
      tableLinkClickHandler (data) {
        console.info('表单链接点击=', data)
        this.$router.push('/accountAddEdit?id=' + data.userId + '&departId=' + data.departId +'&sign=' +1)
      },
      linkChangeHandler (link) {
        console.info('link=', link)
        publicNavData.gotoLeftNavLink(link.link)
      },
      allCheckChangeHandler (data) {
        if (data.allData == true) {
          if (data.select == true) {
            this.tableData.allSelected = true
          } else {
            this.tableData.allSelected = false
          }
        } else {
          this.tableData.allSelected = false
        }
      },
      headerCheckChangeHandler (data) {
        console.info('clickselect=', this.tableData.allSelected)
        this.tableData.bodyAllSelected = this.tableData.allSelected + '/' + Math.random()
        // this.$set(this.tableData,'bodyAllSelected',this.tableData.allSelected);
      },
      gotoAppMarketHanlder () {
        window.location.href = publicPath.APP_MARKET
      }
    }
  }
</script>
<style scoped>

</style>
