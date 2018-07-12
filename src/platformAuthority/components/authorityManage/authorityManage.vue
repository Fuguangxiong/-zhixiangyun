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
          <p class="title">角色列表</p>
          <input type="text" v-model="filterText">
          <el-tree ref="tree" :filter-node-method="filterNode" :data="treeData.data" highlight-current :expand-on-click-node="treeData.clickNode" :props="treeData.defaultProps" @node-click="nodeClickHandler"></el-tree>
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
                  <my-component :all-selected="tableData.bodyAllSelected" :body-data="tableData.bodyData" :issa='issa' :renew="tableData.renewNum" :get-select="tableData.getSelectNum" :get-table-data="tableData.departId" :page-total="tableData.pageTotal" :search-table-data="tableData.searchWord" v-on:change="tableBtnClickHandler" v-on:searchlink="searchTableDataHandler" v-on:checkallchange="allCheckChangeHandler" v-on:selectdata="getTableSelectDataHandler" v-on:link="tableLinkHandler" v-on:tablelinkclick="tableLinkClickHandler"></my-component>
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
//    import leftNav from '../../../publicComponent/publicLeftNavComponent.vue';
//    import header from '../../../publicComponent/publicTopNavComponent.vue';
//    import bottomComponent from '../../../publicComponent/publicBottomComponent.vue';
import rightTopNav from '../CommonRightTopNavComponent.vue'
import HttpService from '../../../publicJs/ApiClient'
import TipBoxService from '../../../publicJs/TipBoxService'
import NoticeBoxService from '../../../publicJs/NoticeBoxService'
import commonTable from '../CommonTableComponent.vue'
import commonBtn from '../CommonBtnControlComponent.vue'
import LoadingService from '../../../publicJs/LoadingBoxService'
import ToolService from '../../publicJs/ToolService'
import publicNavData from '../../publicJs/TransformLeftNavData'
import userService from '../../../publicJs/userService'

export default {
  components: {
    'right-top-nav': rightTopNav,
    'my-component': commonTable,
    'btn-control': commonBtn
  },
  data () {
    return {
      selectEnterprise: '',
      selectEnterpriseId: '',
      enterName: '',
      enterId: '',
      user: '',
      issa: '',
      deleteType: 2,
      deleteEnterpriseName: '',
      filterText: '',
      menuName: '角色管理',
      topNavData: {
        breadLinks: [{ name: '角色管理', link: '#' }],
        searchTitle: '角色名称',
        searchWord: ''
      },
      leftNavData: [],
      publicTopNavData: [],
      btnControlData: {},
      tableData: {
        getSelectNum: 0,
        departId: 0,
        allSelected: false,
        bodyAllSelected: false,
        bodyData: [],
        renewNum: 0,
        pageTotal: 0,
        searchWord: '',
        btnArr: [],
        hasPagination: true
      },
      treeData: {
        data: [],
        clickNode: false,
        defaultProps: {
          children: 'children',
          label: 'roleName'
        }
      },
      queryRolesByEnterpriseId: false
    }
  },
  watch: {
    filterText (val) {
      this.$refs.tree.filter(val)
    }
  },
  mounted () {
    this.user = userService.getInfo('username')
    if (this.user) {
      this.link()
    }
    this.getUserNameByCookieIsSa()
    if (this.$route.query.roleId) {
      this.tableData.departId = this.$route.query.roleId
    }
//      console.log(this.$route.query.roleId,'hahahah');
//	  if(this.$route.query.roleId){
//	      var data=this.$route.query.roleId
//
//          this.nodeClickHandler (data)
//
//	  }

    var word = ToolService.getQueryString('word')
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
  },
  methods: {
     // 从cookie中获取登陆的用户名并判断是否为SA
    getUserNameByCookieIsSa () {
      var username = userService.getInfo('username')
      console.log('username', username)
      if (username === 'sa') {
        this.issa = true
      } else {
        this.issa = false
      }
    },
    filterNode (value, data) {
      if (!value) return true
      return data.roleName.indexOf(value) !== -1
    },
    link () {
      var that = this
      LoadingService.open('数据加载中...')
      HttpService.get('priviapi/departrole/searchParam', { param: '' }, function (data) {
        console.info('树=', data.data)
        that.treeData.data = that.treeDataHandler(data.data)
        console.log('that.treeData.data123', that.treeData.data)
        if (that.user !== 'sa') {
          that.enterName = encodeURI(that.treeData.data[0].roleName)
          that.enterId = that.treeData.data[0].enterpriseId
          console.log('that.enterName', that.enterName)
        }
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
        // debugger
        if (obj.enterpriseId === 'iscloud' && userService.getInfo('username') !== 'sa') {
          const deleteRoleId = ['normalUser', 'enterpriseUser', 'superAdmin', 'authUser']
          for (let i = 0; i < obj.roleList.length; i++) {
            const el = obj.roleList[i]
            if (deleteRoleId.indexOf(el.roleId) !== -1) {
              obj.roleList.splice(i, 1)
              i--
            }
          }
        }
        temp.children = obj.roleList
        treeData.push(temp)
      }
      return treeData
    },
    // 根据roleId找到对应的对象
    findRoleIdObject (name, id) {
      var that = this
      var allTreeData = that.treeData.data // tree上的所有的数据
      for (var i = 0; i < allTreeData.length; i++) {
        var enterpriseName = allTreeData[i].roleName
        if (name === enterpriseName) {
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
          if (el.roleId === id) {
            this.deleteType = 1
            break
          } else {
            this.hasChildren(el.children, id)
          }
        } else {
          if (el.roleId === id) {
            this.deleteType = 2
            break
          }
        }
      }
    },
    getBtnArr (data) {
      var that = this
      var menuId = publicNavData.getMenuId('角色管理', publicNavData.getPriviData('权限管理', data))
//			for (var i = 0; i < data.length; i++) {
//				if (data[i].menuName === '授权管理') {
//					menuId = data[i].menuId
//				}
//			}
      var btnObj = {}
      HttpService.get('priviapi/authmanage/getUserAllPriv', { menuId: menuId }, function (data) {
        for (var i = 0; i < data.data.length; i++) {
          var obj = data.data[i]
          if (obj.title == '新建') {
            btnObj.add = { fn: that.addBtnHandler }
          }					else if (obj.title == '删除') {
            btnObj.remove = { fn: that.removeBtnHandler }
          }					else if (obj.title == '导入') {
            btnObj.export = { fn: that.bumImport }
          }					else if (obj.title == '导出') {
            btnObj.export = { fn: that.exportHandler }
          }					else if (obj.title == '发送短信') {
            btnObj.sentMsg = { fn: that.sentMsgHandler }
          }					else if (obj.title == '重置密码') {
            btnObj.resetPassword = { fn: that.resetPasswordHandler }
          }					else if (obj.title == '关联用户') {
            that.tableData.btnArr.push({ class: 'associatedUsers', clickType: 'user', title: '关联用户' })
          }					else if (obj.title == '权限分配') {
            that.tableData.btnArr.push({ class: 'authorityAssignment', clickType: 'authority', title: '权限分配' })
          }					else if (obj.title == '关联部门') {
            that.tableData.btnArr.push({ class: 'relatedDepartment', clickType: 'depart', title: '关联部门' })
          }
        }
        that.btnControlData = btnObj
      })
    },
    getTableSelectDataHandler (data) {
      console.info('selectData=', data)
      var that = this
      if (data.length == 0) {
        TipBoxService.open('请选择删除项！', 2)
      } else {
        NoticeBoxService.open('确定要删除该角色吗？', function () {
          NoticeBoxService.close()
          // LoadingService.open('正在删除，请稍候...')
          that.deleteEnterpriseName = data[0].NAME // 获取企业的名称
          var arr = new Array()
          for (var i = 0; i < data.length; i++) {
            var id = data[i].ROLEID
            that.findRoleIdObject(that.deleteEnterpriseName, id)
            if (that.deleteType === 1) {
              TipBoxService.open('删除项中存在子节点，无法删除！', 2)
              return false
            } else {
              arr.push(id)
            }
          }
          LoadingService.open('正在删除，请稍候...')
          var sendData = { param: arr.toString() }
          HttpService.get('priviapi/authmanage/batchDeleteRole', sendData, function (data) {
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
    topNavSearchHandler (data) {
      console.info('search=', data)
      this.tableData.departId = 'noLink'
      this.tableData.searchWord = data
    },
    addBtnHandler () {
      console.info('新建')
			/* var that=this;
			for(var i=0;i<that.tableData.bodyData.length;i++){
					if(i%2==0){
							var lineData=that.tableData.bodyData[i].lineData;

							lineData[0].checkData=true;
					}
			} */
//			window.location.href = './authorityRole.html';
      if (this.user !== 'sa' && this.enterName && this.enterId) {
        this.$router.push('/authorityRole?enterName=' + this.enterName + '&enterId=' + this.enterId)
      } else {
        this.$router.push({name: 'authorityRole'})
      }
    },
    removeBtnHandler () {
      console.info('删除')
      var that = this
      that.tableData.getSelectNum++
    },
    searchTableDataHandler (data) {
      console.info('表单发起模糊查询', data)
      var that = this
      HttpService.get('priviapi/authmanage/searchAuthName', data, function (data) {
        if (data.data.authList != null && data.data.authList.length) {
          that.tableData.pageTotal = data.data.page.rowCount
          var bodyData = that.dataHandler(data.data.authList)
          that.tableData.bodyData = bodyData
        } else {
          that.tableData.bodyData = 'error' + Math.random()
        }
      })
    },
    tableLinkHandler (data) {
      console.info('表单发起的连接请求1234', data)

      var that = this

      if (this.queryRolesByEnterpriseId) {
        // this.queryRolesByEnterpriseId = false
        data.enterpriseId = data.param
        HttpService.get('priviapi/authmanage/queryRolesByEnterpriseId', data, function (data) {
          if (data.data.authList != null && data.data.authList.length) {
            that.tableData.pageTotal = data.data.page.rowCount
            var bodyData = that.dataHandler(data.data.authList)
            that.tableData.bodyData = bodyData
            console.log('aaa', that.tableData.bodyData)
            if (that.user === 'sa') {
              that.selectEnterprise = encodeURI(that.tableData.bodyData[0].NAME)
              that.selectEnterpriseId = that.tableData.bodyData[0].ENTERPRISEID
            }
          } else {
            that.tableData.bodyData = 'error' + Math.random()
          }
        })
        return
      }
      HttpService.get('priviapi/authmanage/searchAuth', data, function (data) {
        if (data.data.authList != null && data.data.authList.length) {
          that.tableData.pageTotal = data.data.page.rowCount
          var bodyData = that.dataHandler(data.data.authList)
          that.tableData.bodyData = bodyData
        } else {
          that.tableData.bodyData = 'error' + Math.random()
        }
      })
    },
    dataHandler (dataList) {
      var that = this
      for (var i = 0; i < dataList.length; i++) {
        var obj = dataList[i]
				/* var lineData=[{check:true,checkData:false},{link:true,text:true,name:obj.ROLE_NAME},{text:true,name:obj.parentrole},
						{text:true,name:obj.ROLE_REMARK},{authorityBtn:true,userBtn:true,departBtn:true}]; */
        var lineData = [
					{ img: true, imageClass: 'accout', itemWidth: '8%' },
          {						text: true,
            itemWidth: '30%',
            textData: {
              角色名称: obj.ROLE_NAME,
              备注: obj.ROLE_REMARK
            }					},
          {
            text: true,
            itemWidth: '27%',
            mLine: true,
            textData: {
              企业名称: obj.NAME
            }
          },
          {
            btn: true, itemWidth: '30%', btnArr: that.tableData.btnArr
          },
					{ check: true, itemWidth: '5%', checkData: false }
        ]
        obj.lineData = lineData
				// obj.notClick=true;
      }
      return dataList
    },
    nodeClickHandler (data, node, el) {
      // console.log('data', data)
      // console.log('node', node)
      // console.log('el', el)
      this.tableData.searchWord = 'noLink'
      if (node.level === 1) {
        this.queryRolesByEnterpriseId = true
        this.tableData.departId = data.enterpriseId
      } else {
        this.queryRolesByEnterpriseId = false
        this.tableData.departId = data.roleId
      }
    },
    tableLinkClickHandler (data) {
      console.info('表单链接点击11=', data)
			/* console.info("表单链接点击=", data);
			var hrefStr = './authorityRole.html?id=' + data.ROLEID;
			window.location.href = hrefStr; */
      this.$router.push('/authorityRelation?id=' + data.ROLEID + '&departId=' + this.tableData.departId + '&type=0' + '&enterpriseId=' + this.tableData.bodyData[0].ENTERPRISEID)
    },
//    getTableBtn () {
//
//    },
    tableBtnClickHandler (data) {
      console.info('表单按钮点击=', data)
      var hrefStr = ''
      if (data.tableBtnType == 'authority') { // 权限分配
        hrefStr = '/authorityRole?id=' + data.ROLEID + '&type=1' + '&enterName=' + this.enterName + '&enterId=' + this.enterId + '&selectEnterprise=' + this.selectEnterprise + '&selectEnterpriseId=' + this.selectEnterpriseId
      }			else if (data.tableBtnType == 'user') { // 关联用户
        hrefStr = '/authorityRelation?id=' + data.ROLEID + '&departId=' + this.tableData.departId + '&type=0' + '&enterpriseId=' + this.tableData.bodyData[0].ENTERPRISEID
      }			else if (data.tableBtnType == 'depart') { // 关联部门
        hrefStr = '/authorityRelation?id=' + data.ROLEID + '&departId=' + this.tableData.departId + '&type=1' + '&enterpriseId=' + this.tableData.bodyData[0].ENTERPRISEID
      }
  //   window.location.href = hrefStr
      this.$router.push(hrefStr)
    },
		// 当表单选择check按钮时触发的事件
    tableSelectChangeHandler (data) {
      console.info('当表单选择check按钮时触发的事件', data)
    },
    linkChangeHandler (link) {
      console.info('link=', link)
      publicNavData.gotoLeftNavLink(link.link)
    },
    allCheckChangeHandler (data) {
      if (data.allData == true) {
        if (data.select == true) {
          this.tableData.allSelected = true
        }				else {
          this.tableData.allSelected = false
        }
      }			else {
        this.tableData.allSelected = false
      }
    },
    headerCheckChangeHandler (data) {
      console.info('clickselect=', this.tableData.allSelected)
      this.tableData.bodyAllSelected = this.tableData.allSelected + '/' + Math.random()
			// this.$set(this.tableData,'bodyAllSelected',this.tableData.allSelected);
    }
  }

}
</script>

<style scoped>
.title {
  color: #55a8fd;
}
</style>
