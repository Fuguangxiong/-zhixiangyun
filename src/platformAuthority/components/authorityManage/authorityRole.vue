﻿
<template>
  <div id="platformAuthority">
	<div class="publicWidthHeightContainer">
	  <div class="commonRightBottoTopContainer">
		<right-top-nav :links="topNavData.breadLinks" :searchname="topNavData.searchTitle" :searchword="topNavData.searchWord" v-on:search="topNavSearchHandler"></right-top-nav>
	  </div>
	  <div class="commonRightBottoBottomContainer">
		<div class="publicWidthHeightContainer whiteBg ">
		  <div class="commonLayoutRightBottomContainer" style="padding-top: 20px;">
			<!-- <el-tabs v-model="activeName" type="card"> -->
			<!-- <el-tab-pane label="基础信息" name="first"> -->
			<p class="title">基础信息</p>
			<div class="formCon authorityRole">
			  <el-form :label-position="labelPosition" label-width="100px" :model="basicInfoForm" :rules="basicInfoRule">
				<el-form-item label="角色名称：" prop="roleName">
				  <el-input v-model="basicInfoForm.roleName"></el-input>
				</el-form-item>
				<el-form-item label="企业名称：">
				  <el-input v-model="enterprisename" :readonly="enterpriseNameIsDisabled">
					  <el-button slot="append" v-on:click="selectParentRole" icon="search" :disabled="ifsa"></el-button>
				  </el-input>
				</el-form-item>
				<el-form-item label="备注：">
				  <el-input type="textarea" v-model="basicInfoForm.remark" :rows="4"></el-input>
				</el-form-item>
			  </el-form>
			  <!-- <div class="acctBut" style="margin-top:50px;">
					<el-button type="primary" @click="saveBasicInfo" style="margin:0 20px 0 85px;padding:10px 25px;background:#26d186;border:0">保存</el-button>
					<el-button @click="cancelBasicInfo" style="margin: 0 20px;padding:10px 25px;background:#e3e3e3;color:#fff;border:0;">取消</el-button>
				  </div> -->
			</div>
			<!-- </el-tab-pane> -->
			<!-- <el-tab-pane label="菜单授权" name="second" :disabled="disableRole" style="position: static;"> -->
			<p class="title">菜单授权</p>
			<div class="tablist commonnav">
			  <!-- <dl>
					<dd v-for="(item,index) in lidata" :key="index">
					  <span @click="clickAll(index)" :class="{active:index==isActive}">{{item.name}}</span>
					</dd>
				  </dl> -->
			  <span v-if="item.show" class="item" @click="clickAll(item.index)" v-for="(item,index) in lidata" :key="index" :class="{active:item.index==isActive}">{{item.name}}</span>
			</div>
			<div class="arssTabCon">
			  <div class="accounTree" style="height:100%">
				<!-- <div class="treeTlie" style="height:10%">智享云数据分析平台</div> -->
				<div style="height:100%;overflow-y:auto">
				  <div v-show="showLoading" class="loadingBox">
					<img src="../../images/loading.gif" alt="">
					<p>数据加载中...</p>
				  </div>
				  <el-tree v-show="!showLoading" node-key="id" ref="roleTree" :data="authTree.data" highlight-current show-checkbox :props="authTree.defaultProps" @check-change="nodeClickHandler" @node-click="authTreeClick"></el-tree>
				</div>
			  </div>

			  <div class="commonLayoutRightBottomRightContainer" style="padding-top:0px;height:100%;">
				<div class="treeTlie">{{authTreeSelect.menuName}}</div>
				<div class="publicWidthHeightContainer hasScroll" style="z-index:1;margin-bottom:20px;height:87%">
				  <my-component :header-data="tableData.headerData" :body-data="tableData.bodyData" :renew="tableData.renewNum" :has-pagination="tableData.hasPagination" :get-select="tableData.getSelectNum" :get-table-data="tableData.departId" :page-total="tableData.pageTotal" :search-table-data="tableData.searchWord" v-on:searchlink="searchTableDataHandler" v-on:selectdata="getTableSelectDataHandler" v-on:link="tableLinkHandler" v-on:selectchange="tableSelectChangeHandler">
				  </my-component>
				</div>
			  </div>
			</div>
			<div class="acctBut" style="height:55px;line-height:55px;">
         <el-button type="primary" @click="saveBasicInfo" style="margin:0 20px 0 0px;padding:10px 25px;background:#26d186;border:0">
				保存
			  </el-button>
			  <el-button @click="cancelBasicInfo" style="margin: 0 20px;padding:10px 25px;background:#e3e3e3;color:#fff;border:0;">
				取消
			  </el-button>
			</div>
			<!--<div class="acctBut">
								<el-button type="primary" @click="saveBasicInfo">保存</el-button>
								<el-button @click="cancelBasicInfo">取消</el-button>
							</div>-->
			<!-- </el-tab-pane> -->
			<!-- </el-tabs> -->
		  </div>
		</div>
	  </div>
	</div>
  <!-- not-select="isEnterprise" -->
	<my-transfer search-title="企业名称"  :open="roleTransfer.openNum" :multiselect="roleTransfer.multiselect" :data="roleTransfer.data" :new-data="roleTransfer.newData" :box-title="'选择企业'" :left-title="'企业列表'" :right-title="'已选企业'" :key-att="'enterpsiseid'" :default-props="roleTransfer.defaultProps" v-on:change="RoleChangeHandler"></my-transfer>
  </div>
</template>
<script>
  //    import leftNav from '../../publicComponent/publicLeftNavComponent.vue';
  //    import header from '../../publicComponent/publicTopNavComponent.vue';
  //    import bottomComponent from '../../publicComponent/publicBottomComponent.vue';
  import rightTopNav from '../CommonRightTopNavComponent.vue'
  import HttpService from '../../../publicJs/ApiClient'
  import TipBoxService from '../../../publicJs/TipBoxService'
  import userService from '../../../publicJs/userService'
  import NoticeBoxService from '../../../publicJs/NoticeBoxService'
  import commonTable from '../CommonTableComponent.vue'
  import transfer from '../MyTransfer.vue'
  import LoadingService from '../../../publicJs/LoadingBoxService'
  import publicNavData from '../../publicJs/TransformLeftNavData'
  import ToolService from '../../publicJs/ToolService'
  //    import '../../css/authorityRole.css'
  export default {
    name: 'authorityRole',
    components: {
      'right-top-nav': rightTopNav,
      'my-component': commonTable,
      'my-transfer': transfer
    },
    data () {
      return {
        newRoleEnterpriseId: '',
        enterpriseNameIsDisabled: true,
        selectEnterprise: '',
        selectEnterpriseId: '',
        enterprisename: '',
        enterName: '',
        enterId: '',
        ifsa: true,
        user: '', // 登录的用户名
        paramId: null,
        menuName: '权限管理',
        activeName: '',
        topNavData: {
          breadLinks: [{name: '角色管理', link: '/authorityManage'}, {name: '新建角色', link: '#'}],
          searchTitle: '角色名称'
        },
        labelPosition: 'right',
        leftNavData: [],
        publicTopNavData: [],
        lidata: [
          {index: 0, name: '个人工作台', value: 'PersonalConsole', show: false},
          {index: 1, name: '企业管理平台', value: 'EnterpriseManage', show: false},
          {index: 2, name: '内部运营平台', value: 'InternalOperation', show: false},
          {index: 3, name: '智能上报', value: 'ReportUpload', show: true}
        ],
        isActive: 0,
        // 基本信息
        basicInfoForm: {
          id: '',
          ENTERPRISE_ID: '', // 企业id
          pId: '', // 父id
          roleName: '', // 角色名
          enterprisename: '', // 企业名称
          pIdRoleName: '', // 上级角色
          remark: '', // 备注
          menuArray: []
        },
        // 基础信息表单验证规则
        basicInfoRule: {
          roleName: [
            {
              required: true,
              trigger: 'blur',
              message: '请输入角色名称'
            }
          ],
          pIdRoleName: [
            {
              required: true,
              trigger: 'blur',
              message: '请选择上级角色'
            }
          ],
          remark: []
        },
        // 角色穿梭框
        roleData: [],
        multipleSelection: [],
        roleTransfer: {
          openNum: 0,
          data: [],
          newData: [],
          multiselect: false, // 多选
          defaultProps: {
            children: 'children',
            label: 'enterprisename'
          }
        },
        defaultAuthTree: [],
        // 权限树
        authTree: {
          data: [],
          defaultProps: {
            children: 'children',
            label: 'menuName'
          }
        },
        // 权限树当前所选节点
        authTreeSelect: {},
        // 权限点表格数据
        authPointData: [],
        tableData: {
          getSelectNum: 0,
          departId: 0,
          headerData: [{check: true, checkData: false}, {name: '模块名称'}, {name: '流程展示'}],
          bodyData: [],
          renewNum: 0,
          pageTotal: 0,
          searchWord: '',
          hasPagination: false
        },
        showLoading: true
      }
    },
    mounted () {
      var loginType = userService.getInfo('logintype')
      var username = userService.getInfo('username')
      this.user = userService.getInfo('username')
      console.log('this.user', this.user)
      if (this.user === 'sa') { // 如果登陆的用户名为sa的话
        this.ifsa = false
        this.getAllEnterprise()// 获取所有企业
      }
  
      // 通过路由传值获取企业名称和企业ID
      this.enterName = this.$route.query.enterName
      this.enterId = this.$route.query.enterId
      this.selectEnterprise = this.$route.query.selectEnterprise
      this.selectEnterpriseId = this.$route.query.selectEnterpriseId
      console.log('this.enterName11', this.enterId)
      if (this.enterName && this.user !== 'sa') {
        this.enterprisename = decodeURI(this.enterName)
      } else if (this.selectEnterprise && this.user === 'sa') {
        this.enterprisename = decodeURI(this.selectEnterprise)
        this.ifsa = true
      }
      console.log(loginType)
      if (username === 'sa') {
        for (let i = 0; i < this.lidata.length; i++) {
          this.lidata[i].show = true
        }
      } else if (loginType === 'ENTERPRISE') {
        this.lidata[1].show = true
      } else if (loginType === 'PLATFORM') {
        this.lidata[2].show = true
      }
      this.paramId = this.$route.query.id
      console.log(this.$route.query.id)
      if (this.paramId == null) {
        this.topNavData.breadLinks[1].name = '新建角色'
      } else {
        this.topNavData.breadLinks[1].name = '修改角色'
        this.getRoleInfo()
      }
      if (this.$route.query.type == null) {
        this.activeName = 'first'
      } else {
        this.activeName = 'second'
      }
      // this.getRoleTree()
      // this.getAuthTree()
    },
    methods: {
      // 获取所有的企业列表
      getAllEnterprise () {
        console.log('12345677')
        var that = this
        HttpService.get('pcapi/enterprise/enterpriseList', '', function (data) {
          if (data.status == '200') {
            console.log('获取所有的企业列表', data)
            var allEnters = data.results
            var newAllEnters = new Array()
            for (let i = 0; i < allEnters.length; i++) {
              var el = allEnters[i]
              var enterpriseOne = {
                'enterpsiseid': el.id,
                'enterprisename': el.name
              }
              newAllEnters.push(enterpriseOne)
            }
            console.log('cccc', newAllEnters)
            that.roleTransfer.data = newAllEnters
            // that.getAuthTree()
          }
        })
      },
      // 获取角色树
      // getRoleTree () {
      //   var that = this
      //   HttpService.get('priviapi/departrole/searchParam', 'param=', function (data) {
      //     console.info('qqqqqq=', data)
      //     if (data.status == '200') {
      //       that.roleTransfer.data = that.treeDataHandler(data.data)
      //       that.getAuthTree()
      //     }
      //   })
      // },
      treeDataHandler (data) {
        var treeData = []
        for (let i = 0; i < data.length; i++) {
          const obj = data[i]
          let temp = {}
          temp.roleName = obj.enterpriseName
          temp.enterpriseId = obj.enterpriseId
          temp.children = obj.roleList
          temp.isEnterprise = true
          treeData.push(temp)
        }
        return treeData
      },
      // 点击应用事件
      clickAll (index) {
        var that = this
        that.tableData.bodyData = []
        that.isActive = index
        if (this.defaultAuthTree[index] && this.defaultAuthTree[index] !== 0) {
          this.authTree.data = this.defaultAuthTree[index]
          var treeChecked = []
          for (var i = 0; i < that.basicInfoForm.menuArray.length; i++) {
            treeChecked.push(that.basicInfoForm.menuArray[i].menuId)
          }
          for (let i = 0; i < this.authTree.data.length; i++) {
            const el = this.authTree.data[i]
            var idx = treeChecked.indexOf(el.id)
            if (idx !== -1) {
              if (el.children && this.authTreeChildrenNotIdInMenuArray(treeChecked, el.children)) {
                treeChecked.splice(idx, 1)
              }
            }
          }
          that.$refs.roleTree.setCheckedKeys(treeChecked)
        } else {
          this.showLoading = true
          var value = that.lidata[index].value
          var param = {param: value}
          HttpService.get('priviapi/authmanage/getFullMenuTree', param, function (data) {
            that.defaultAuthTree[index] = data.data
            that.authTree.data = that.defaultAuthTree[index]
            console.table(that.authTree.data)
            // 如果不是sa 不让他看到角色管理
//            const username = localStorage.getItem('username')
            const username = userService.getInfo('username')
            console.log(username, 'username')
            if (username !== 'sa') {
              for (var i = 0; i < that.authTree.data.length; i++) {
                var obj = that.authTree.data[i]
                console.log(obj)
                if (obj.menuName === '权限管理') {
                  console.table(obj.children)
                  for (var o in obj.children) {
                    console.log(obj.children[o])
                    if (obj.children[o].menuName === '角色管理') {
                      console.log(o, 'shuzu')
                      obj.children.splice(o, 1)
                    }
                  }
                }
              }
            }
            var treeChecked = []
            for (var i = 0; i < that.basicInfoForm.menuArray.length; i++) {
              treeChecked.push(that.basicInfoForm.menuArray[i].menuId)
            }
            for (let i = 0; i < that.authTree.data.length; i++) {
              const el = that.authTree.data[i]
              var idx = treeChecked.indexOf(el.id)
              if (idx !== -1) {
                if (el.children && that.authTreeChildrenNotIdInMenuArray(treeChecked, el.children)) {
                  treeChecked.splice(idx, 1)
                }
              }
            }
            that.$refs.roleTree.setCheckedKeys(treeChecked)
            that.showLoading = false
          })
        }
      },
      authTreeChildrenNotIdInMenuArray (treeChecked, children) {
        for (let i = 0; i < children.length; i++) {
          if (treeChecked.indexOf(children[i].id) === -1) {
            return true
          }
        }
      },
      // 获取权限树
      getAuthTree () {
        for (let i = 0; i < this.lidata.length; i++) {
          if (this.lidata[i].show) {
            this.clickAll(i)
            break
          }
        }
//            LoadingService.close()
        // var that = this
        // HttpService.get('priviapi/authmanage/getFullMenuTree', '', function (data) {
        //   if (data.status == '200') {
        //     that.defaultAuthTree.data = data.data
        //     if (that.topNavData.breadLinks[2].name == '修改角色') {
        //       that.getRoleInfo()
        //     }
        //   }
        // })
      },
      topNavSearchHandler (data) {
        console.info('search=', data)
//          window.location.href = 'authorityManage.html?word=' + data
        this.$router.push('/authorityManage?word=' + data)
      },
      // 选择上级角色
      selectParentRole () {
        var that = this
        if (that.basicInfoForm.pId !== '') {
          that.roleTransfer.newData = [{id: that.basicInfoForm.pId, roleName: that.basicInfoForm.pIdRoleName}]
        } else {
          that.roleTransfer.newData = []
        }
        that.roleTransfer.openNum++
      },
      // 角色穿梭框保存
      RoleChangeHandler (data) {
        console.log('角色穿梭框保存', data)
        this.newRoleEnterpriseId = data[0].enterpsiseid
        this.enterprisename = data[0].enterprisename
        console.log('this.newRoleEnterpriseId', this.newRoleEnterpriseId)
        // if (data[0].roleId == this.basicInfoForm.roleId) {
        //   TipBoxService.open('上级角色不可选择自身角色！', 2)
        //   this.roleTransfer.newData = []
        //   this.roleTransfer.openNum++
        // } else {
        //   this.basicInfoForm.pId = data[0].roleId
        //   this.basicInfoForm.pIdRoleName = data[0].roleName
        // }
      },
      // 权限树点击事件
      authTreeClick (data) {
        var that = this
        that.authTreeSelect = data
        // 查已勾选信息
        var allMenu = that.basicInfoForm.menuArray
        var thisMenu = {}
        for (var i = 0; i < allMenu.length; i++) {
          if (allMenu[i].menuId == that.authTreeSelect.id) {
            thisMenu = allMenu[i]
          }
        }
        // 若该节点存在勾选信息
        var showData = that.dataHandler(that.authTreeSelect.privArray)
        if (thisMenu.privArray) {
          var defaultSelect = []
          for (var i = 0; i < thisMenu.privArray.length; i++) {
            for (var j = 0; j < showData.length; j++) {
              if (thisMenu.privArray[i].pressId == showData[j].id) {
                showData[j].lineData[0].checkData = true
              }
            }
          }
        }
        // 展示信息
        console.info('点击showData=', showData)
        that.authPointData = showData
        that.tableData.bodyData = showData
      },
      // 权限树勾选
      nodeClickHandler (data, select, children) {
        // 选中
        console.log('data', data)
        console.log('select', select)
        console.log('children', children)
        if (select) {
          console.log('选中')
          var isPush = true
          var preMenuArray = this.basicInfoForm.menuArray
          for (var i = 0; i < preMenuArray.length; i++) {
            if (preMenuArray[i].menuId == data.id) {
              isPush = false
            }
          }
          if (isPush) {
            var privArray = []
            var authPointer = data.privArray
            for (var i = 0; i < authPointer.length; i++) {
              privArray.push({
                pressId: authPointer[i].id
              })
            }
            this.basicInfoForm.menuArray.push({
              menuId: data.id,
              privArray: privArray
            })
          }
        } else {   // 取消选中则在数据里删
          // 如果子节点有被选中的  则不取消
          if (children) return
          console.log('取消')
          var menuArray = []
          var preMenuArray = this.basicInfoForm.menuArray
          for (var i = 0; i < preMenuArray.length; i++) {
            if (preMenuArray[i].menuId != data.id) {
              menuArray.push(preMenuArray[i])
            }
          }
          this.basicInfoForm.menuArray = menuArray
        }
        // 若右侧功能点为该节点的信息  则进行操作
        if (data.id == this.authTreeSelect.id) {
          for (var i = 0; i < this.tableData.bodyData.length; i++) {
            var preAllMenu = this.basicInfoForm.menuArray
            var preSelect = []
            for (var j = 0; j < preAllMenu.length; j++) {
              if (preAllMenu[j].menuId == data.id) {
                preSelect = preAllMenu[j].privArray
              }
            }
            var check = false
            for (var j = 0; j < preSelect.length; j++) {
              if (this.tableData.bodyData[i].id == preSelect[j].pressId) {
                check = true
              }
            }
            console.info('勾选showData=', this.tableData.bodyData)
            this.tableData.bodyData[i].lineData[0].checkData = check
          }
        }
      },
      // 查询角色信息
      getRoleInfo () {
        var that = this
        // 根据id查部门信息
        HttpService.get('priviapi/authmanage/getDetail', 'param=' + this.paramId, function (data) {
          console.info('zzzz=', data.data)
          that.basicInfoForm = data.data
          console.log('menuArray', that.basicInfoForm.menuArray)
//              LoadingService.close()
          var treeChecked = []
          for (var i = 0; i < that.basicInfoForm.menuArray.length; i++) {
            treeChecked.push(that.basicInfoForm.menuArray[i].menuId)
          }
          for (let i = 0; i < that.authTree.data.length; i++) {
            const el = that.authTree.data[i]
            var idx = treeChecked.indexOf(el.id)
            if (idx !== -1) {
              if (el.children && that.authTreeChildrenNotIdInMenuArray(treeChecked, el.children)) {
                treeChecked.splice(idx, 1)
              }
            }
          }
          that.$refs.roleTree.setCheckedKeys(treeChecked)
        })
      },
      // 查父部门名称
      getParentName: function (data, pId) {
        for (var i = 0; i < data.length; i++) {
          if (data[i].id == pId) {
            this.basicInfoForm.pIdRoleName = data[i].label
            break
          } else {
            if (data[i].children) {
              this.getParentName(data[i].children, pId)
            }
          }
        }
      },
      // 功能点勾选事件  全部勾选时 自动勾上右侧树中对应节点
      tableSelectChangeHandler (data) {
        var nowData = this.basicInfoForm.menuArray
        var thisData
        for (var i = 0; i < nowData.length; i++) {
          if (nowData[i].menuId == this.authTreeSelect.id) {
            thisData = nowData[i]
          }
        }
        var aryId = []
        for (var i = 0; i < data.length; i++) {
          aryId.push({
            pressId: data[i].id
          })
        }
        if (thisData) {
          thisData.privArray = aryId
        } else {
          if (aryId.length > 0) {
            this.basicInfoForm.menuArray.push({
              menuId: this.authTreeSelect.id,
              privArray: aryId
            })
          }
        }
        if (data.length > 0) {
          this.$refs.roleTree.setChecked(this.authTreeSelect.id, true, true)
        } else if (data.length == 0) {
          this.$refs.roleTree.setChecked(this.authTreeSelect.id, false, true)
        }
      },
      searchTableDataHandler (data) {
      },
      // 获取勾选项
      getTableSelectDataHandler (data) {
      },
      // 查找表单数据
      tableLinkHandler (data) {
      },
      dataHandler (dataList) {
        var that = this
        for (var i = 0; i < dataList.length; i++) {
          var obj = dataList[i]
          var lineData = [
            {check: true, itemWidth: '5%', checkData: false},
//                      {img:true,imageClass:"accout",itemWidth:"5%"},
            {
              text: true,
              itemWidth: '45%',
              textData: {
                权限: obj.title
              }
            },
            {
              text: true,
              itemWidth: '45%',
              textData: {
                备注: obj.flow
              }
            }
          ]
//                  var lineData=[{check:true,checkData:false},{text:true,name:obj.title},{text:true,name:obj.flow}];
          // obj.lineData=lineData;
          that.$set(obj, 'lineData', lineData)
        }
        return dataList
      },
      // 如果子菜单被选中，则父菜单也被选中
      parentChecked () {
        var menuarrayId = []
        for (let i = 0; i < this.basicInfoForm.menuArray.length; i++) {
          menuarrayId.push(this.basicInfoForm.menuArray[i].menuId)
        }
        for (let i = 0; i < this.authTree.data.length; i++) {
          const el = this.authTree.data[i]
          if (!el.children) continue
          for (let j = 0; j < el.children.length; j++) {
            const cl = el.children[j]
            if (menuarrayId.indexOf(cl.id) !== -1 && menuarrayId.indexOf(el.id) === -1) {
              this.basicInfoForm.menuArray.push({
                menuId: el.id,
                privArray: el.privArray
              })
              break
            }
          }
        }
      },
      // 保存
      saveBasicInfo () {
        this.basicInfoForm.roleName = ToolService.trimStr(this.basicInfoForm.roleName)
        if (this.basicInfoForm.roleName == '') {
          TipBoxService.open('请输入角色名称', 2)
          return false
        } else {
          if (this.basicInfoForm.roleName.length > 20) {
            TipBoxService.open('角色名称不可超过20个字', 2)
            return false
          }
        }
        if (this.enterprisename == '') {
          TipBoxService.open('请选择角色所属的企业', 2)
          return false
        }
        if (this.basicInfoForm.remark !== '') {
          if (this.basicInfoForm.remark.length > 40) {
            TipBoxService.open('备注不可超过40个字', 2)
            return false
          }
        }
        LoadingService.open('配置保存中...')
  
        // 保存创建新用户的时候根据是否为sa判断传basicInfoForm.ENTERPRISE_ID来源
        if (this.user !== 'sa') {
          this.basicInfoForm.ENTERPRISE_ID = this.enterId
        } else if (this.user == 'sa' && this.selectEnterpriseId) {
          this.basicInfoForm.ENTERPRISE_ID = this.selectEnterpriseId
        } else {
          this.basicInfoForm.ENTERPRISE_ID = this.newRoleEnterpriseId
        }
        var param = {
          data: this.basicInfoForm
        }
        console.log('param', param)
        var strUrl = ''
        if (this.topNavData.breadLinks[1].name == '新建角色') {
          strUrl = 'priviapi/authmanage/saveRole'
        } else {
          strUrl = 'priviapi/authmanage/updateRole'
        }
        var that = this
        this.parentChecked()
        HttpService.post(strUrl, param).then((data) => {
          if (data.status == '200') {
            LoadingService.close()
            TipBoxService.open('保存成功', 0)
            // that.$router.push('/authorityManage?roleId=' + that.basicInfoForm.roleId)
          }
        }).catch((error) => {
          console.log(error.response)
          LoadingService.close()
          if (error.response.data.status == '503') {
            TipBoxService.open(error.response.data.exception, 2)
            return false
          }
        })
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
      tableLinkClickHandler (data) {
        console.info('表单链接点击=', data)
        var hrefStr = '/departAddEdit?id=' + data.ID
//          window.location.href = hrefStr
        this.$router.push(hrefStr)
      },
      linkChangeHandler (link) {
        console.info('link=', link)
        publicNavData.gotoLeftNavLink(link.link)
      },
      cancelBasicInfo () {
//          window.location.href = 'authorityManage.html'
        this.$router.push('/authorityManage?roleId=' + this.basicInfoForm.roleId)
      }
    },
    computed: {
      // 是否禁用配置管理nav
      disableRole: function () {
        return this.basicInfoForm.roleName == '' || this.basicInfoForm.roleName.length > 20
      }
    }
  }
</script>
<style src="../../css/authorityRole.css" scoped></style>
<style scoped>
  .el-tree {
	border: none;
  }
  .commonLayoutRightBottomContainer {
	padding: 0 15px;
  }
  .commonLayoutRightBottomContainer > .title {
	border-bottom: 1px solid #58a6f9;
	font-size: 14px;
	margin-bottom: 20px;
	padding-left: 10px;
	height: 30px;
	line-height: 30px;
  }
  .commonnav {
	height: 45px;
	background-color: #fff;
	-webkit-box-shadow: 0 0 5px #ccc;
	box-shadow: 0 0 5px #ccc;
	border-radius: 1px;
  }
  .commonnav .item {
	display: inline-block;
	width: 116px;
	height: 45px;
	line-height: 45px;
	text-align: center;
	color: #000000;
	cursor: pointer;
	float: left;
  }
  .commonnav .item.active,
  .commonnav .item:hover {
	color: #63adfd;
	border-bottom: 2px solid #63adfd;
  }
  .loadingBox {
	text-align: center;
	color: #333;
	padding-top: 30px;
  }
  .loadingBox img {
	width: 30px;
	height: 30px;
	margin-bottom: 15px;
  }
</style>
<style>
  .el-tree {
	border: 0;
  }
  .el-tree-node__label {
	font-size: 13px;
	color: #404040;
  }
  .el-tree-node__content {
	text-align: left;
	margin-left: 50px;
  }
  .authorityRole label {
	font-weight: 100;
  }
</style>
