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
  import setUser from '../../publicJs/SetUserInfo'

  export default {
    name: 'departManage',
    data () {
      return {
        deleteType: 2,
        deleteEnterpriseId: '',
        sign: 0,
        menuName: '部门管理',
        topNavData: {
          breadLinks: [{name: '部门管理', link: '/departManage'}],
          searchTitle: '部门名称',
          searchWord: ''
        },
        leftNavData: [],
        publicTopNavData: [],
        publicTopUserChange: 0,
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
        }
      }
    },
    components: {
      'right-top-nav': rightTopNav,
      'my-component': commonTable,
      'btn-control': commonBtn
    },
    mounted () {
      this.sign = this.$route.query.sign
      if (this.$parent.prividata && this.$parent.prividata.length !== 0) {
        this.getBtnArr(this.$parent.prividata)
      }
      this.$parent.hub.$on('getPriviData', (data) => {
        this.getBtnArr(data)
      })
      this.initApp()
      // 点击取消返回的时候展示列表
      if (this.sign === '1') {
        let data = JSON.parse(sessionStorage.getItem('nodeData'))
        console.log(data, '从暂存中取的data')
        this.nodeClickHandler(data)
      }
    },
    methods: {
      initApp () {
        this.link()
        // var word = ToolService.getQueryString('word')
        var word = this.$route.query.word
        // this.leftNavData = publicNavData.getLeftNavData('部门管理')
        // var that = this
        // publicNavData.getTopNavData(function (data) {
        //   that.publicTopNavData = data
        // })
        if (word != null) {
          this.topNavData.searchWord = word
          this.tableData.departId = 'noLink'
          this.tableData.searchWord = word
        }
      },
      link () {
        var that = this
        LoadingService.open('数据加载中...')
        HttpService.get('priviapi/deptpriv/getDeptTree', {param: ''}, function (data) {
          console.info('树1=', data.data)
          that.treeData.data = data.data
          // that.treeData.data = that.treeDataHandler(data.data)
          console.info('treeData.data', that.treeData.data)
          LoadingService.close()
        })
      },
      treeDataHandler (data) {
        var treeData = []
        for (let i = 0; i < data.length; i++) {
          const obj = data[i]
          let temp = {}
          temp.roleName = obj.enterpriseName
          temp.enterpriseId = obj.enterpriseId
          temp.children = obj.roleList
          treeData.push(temp)
        }
        return treeData
      },
      // 根据roleId找到对应的对象
      findRoleIdObject (PID, id) {
        var that = this
        var allTreeData = that.treeData.data // tree上的所有的数据
        for (var i = 0; i < allTreeData.length; i++) {
          var enterpriseID = allTreeData[i].enterpriseid
          if (PID === enterpriseID) {
            var oneTreeData = allTreeData[i].children
          // for (var j = 0; j < oneTreeData.length; j++) {
          //   var temp = oneTreeData[j]
          //   var roleID = oneTreeData[j].roleId
          //   if (roleID === id) {
          //     if (typeof temp.children === 'object') {
          //       that.deleteType = 1 // 说明有 不能删除
          //     } else {
          //       that.deleteType = 2 // 说明没有 可以删除
          //     }
          //     break
          //   }
          // }
            this.hasChildren(oneTreeData, id)
            break
          }
        }
      },
      hasChildren (data, id) {
        for (let i = 0; i < data.length; i++) {
          const el = data[i]
        // debugger
          if (el.children && el.children.length > 0) {
            if (el.id === id) {
              this.deleteType = 1
              break
            } else {
              this.hasChildren(el.children, id)
            }
          } else {
            if (el.id === id) {
              this.deleteType = 2
              break
            }
          }
        }
      },
      getBtnArr (data) {
        var that = this
        var menuId = publicNavData.getMenuId('部门管理', publicNavData.getPriviData('权限管理', data))
        var btnObj = {}
        HttpService.get('priviapi/authmanage/getUserAllPriv', {menuId: menuId}, function (data) {
          for (var i = 0; i < data.data.length; i++) {
            var obj = data.data[i]
            if (obj.title == '新建') {
              btnObj.add = {fn: that.addBtnHandler}
            } else if (obj.title = '删除') {
              btnObj.remove = {fn: that.removeBtnHandler}
            }
          }
          that.btnControlData = btnObj
        })
      },
      getTableSelectDataHandler (data) {
        console.info('selectData=', data)
        var that = this
        if (data.length === 0) {
          TipBoxService.open('请选择删除项！', 2)
        } else {
          NoticeBoxService.open('确定要删除部门吗？', function () {
            NoticeBoxService.close()
            // LoadingService.open('正在删除，请稍候...')
            that.deleteEnterpriseId = data[0].ENTERPRISEID // 获取企业的ID
            console.log('aaaa', that.deleteEnterpriseId)
            var arr = new Array()
            for (var i = 0; i < data.length; i++) {
              var id = data[i].ID
              that.findRoleIdObject(that.deleteEnterpriseId, id)
              if (that.deleteType === 1) {
                TipBoxService.open('删除项中存在子部门，无法删除！', 2)
                return false
              } else {
                arr.push(id)
              }
            }
            LoadingService.open('正在删除，请稍候...')
            var sendData = {param: arr.toString()}
            HttpService.get('priviapi/deptpriv/batchDeleteDept', sendData, function (data) {
              console.info('删除=', data)
              LoadingService.close()
              if (data.status == 200) {
                TipBoxService.open('删除成功！', 0)
                that.tableData.renewNum++
                that.link()
              } else {
                TipBoxService.open('删除失败！', 1)
              }
            })
          })
        }
      },
      topNavSearchHandler: function (data) {
        console.info('search=', data)
        this.tableData.departId = 'noLink'
        this.tableData.searchWord = data
        // var obj={param:data,pageNum:1}
        /* HttpService.getLink('accountpriv/searchUser',obj,function (data) {

		}); */
      },
      addBtnHandler () {
        console.info('新建')
        // window.location.href = './departAddEdit.html'
        this.$router.push('/departAddEdit')
      },
      removeBtnHandler () {
        console.info('删除')
        var that = this
        that.tableData.getSelectNum++
      },
      searchTableDataHandler (data) {
        console.info('表单模糊查询的连接请求', data)
        var that = this
        HttpService.get('priviapi/departrole/searchDepartName', data, function (data) {
          console.info('kkkkkkk=', data)
          if (data.data.departList != null) {
            that.tableData.pageTotal = data.data.page.rowCount
            var bodyData = that.dataHandler(data.data.departList)
            that.tableData.bodyData = bodyData
          } else {
            that.tableData.bodyData = 'error' + Math.random()
          }
        })
      },
      tableLinkHandler (data) {
        console.log('点击根节点触发的方法1')
        console.info('表单发起的连接请求', data)
        var that = this
        HttpService.get('priviapi/departrole/searchDepart', data, function (data) {
          console.info('jjjjjjj=', data)
          if (data.data.departList != null) {
            that.tableData.pageTotal = data.data.page.rowCount
            var bodyData = that.dataHandler(data.data.departList)
            console.info('bodyData右侧表单数据==', bodyData)
            that.tableData.bodyData = bodyData
          } else {
            that.tableData.bodyData = 'error' + Math.random()
          }
        })
      },
      dataHandler (dataList) {
        console.info('dataList右侧表单数据=', dataList)
        for (var i = 0; i < dataList.length; i++) {
          var obj = dataList[i]
          // var lineData=[{check:true,checkData:false},{link:true,text:true,name:obj.DEPARTMENT_NAME},{text:true,name:obj.P_NAME},{text:true,name:obj.DEPARTMENT_PHONE},{text:true,name:obj.REMARK}];
          var lineData = [
            {img: true, imageClass: 'depart', itemWidth: '8%'},
            {
              text: true,
              itemWidth: '30%',
              textData: {
                部门名称: obj.DEPARTMENT_NAME,
                上级部门: obj.P_NAME
              }
            },
            {
              text: true,
              itemWidth: '27%',
              textData: {
                部门电话: obj.DEPARTMENT_PHONE
              }
            },
            {
              text: true,
              itemWidth: '30%',
              textData: {
                备注: obj.REMARK
              }
            },
            {check: true, itemWidth: '5%', checkData: false}
          ]
          obj.lineData = lineData
        }
        console.info('aaaaaaaaa')
        return dataList
      },
      nodeClickHandler (data) {
        console.log('点击根节点触发的方法1')
        console.info('nodeData=', data)
        sessionStorage.setItem('nodeData', JSON.stringify(data))
        this.tableData.searchWord = 'noLink'
        this.tableData.departId = data.id
        // this.tableData.bodyData=[];
        // if(data.children==undefined || data.children.length==0){
        // this.tableData.departId=data.id;
        // }
      },
      tableLinkClickHandler (data) {
        console.info('表单链接点击=', data)
        // var hrefStr = './departAddEdit.html?id=' + data.ID
        // window.location.href = hrefStr
        this.$router.push('/departAddEdit?id=' + data.ID + '&sign=' + 1)
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
<style lang="css" scoped>

</style>
