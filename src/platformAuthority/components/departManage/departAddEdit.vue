<template>
  <div id="platformAuthority">
	<div class="publicWidthHeightContainer">
	  <div class="commonRightBottoTopContainer">
		<right-top-nav :links="topNavData.breadLinks" :searchname="topNavData.searchTitle" :searchword="topNavData.searchWord" v-on:search="topNavSearchHandler"></right-top-nav>
	  </div>
	  <div class="commonRightBottoBottomContainer">
		<div class="publicWidthHeightContainer whiteBg">
		  <div class="commonLayoutRightBottomContainer" style="padding-top: 20px;height: 100%;">
			<el-tabs v-model="activeTab" type="card" style="height: 100%;">
			  <el-tab-pane label="基础信息" name="basicInfo" style="overflow-y: auto;height:100%;">
				<el-form class="basicInfoFiled" :model="basicInfoForm" :rules="basicInfoRule" label-width="100px" style="margin-top:40px;padding-bottom: 40px;">
				  <el-form-item label="部门名称：" prop="departmentName">
					<el-input v-model="basicInfoForm.departmentName"></el-input>
				  </el-form-item>
				  <el-form-item label="上级部门：" prop="parentDepart">
					<el-input v-model="basicInfoForm.parentDepart" readonly>
					  <el-button class="SelectParentDepart" :disabled="!showSelectParentDepart" slot="append" v-on:click="selectParentDepart" icon="search"></el-button>
					</el-input>
				  </el-form-item>
				  <el-form-item label="部门电话：" prop="deptPhone">
					<el-input v-model="basicInfoForm.deptPhone"></el-input>
				  </el-form-item>
				  <el-form-item label="部门邮箱：" prop="deptMail">
					<el-input v-model="basicInfoForm.deptMail"></el-input>
				  </el-form-item>
				  <el-form-item label="备注：" prop="remark">
					<el-input type="textarea" :rows="4" v-model="basicInfoForm.remark"></el-input>
				  </el-form-item>
				  <el-form-item style="text-align: center;margin-top: 50px;">
					<el-button @click="saveBasicInfo" type="success" style="margin: 0 20px;padding:10px 25px;">保存
					</el-button>
					<el-button @click="cancelBasicInfo" style="margin: 0 20px;padding:10px 25px;">取消</el-button>
				  </el-form-item>
				</el-form>
			  </el-tab-pane>
			  <el-tab-pane label="部门角色" name="departRole" :disabled="disableRole" style="height: 100%;">
				<div class="commonTableBtnContainer">
				  <div class="allSelectContainer">
					<el-checkbox v-model="tableData.allSelected" @change="headerCheckChangeHandler">全选</el-checkbox>
				  </div>
				  <btn-control :btn-data="btnControlData"></btn-control>
				</div>
				<div class="commonTableTable">
				  <div class="publicWidthHeightContainer">
					<div class="publicWidthHeightContainer hasScroll">
					  <my-component :all-selected="tableData.bodyAllSelected" :body-data="roleData" :renew="tableData.renewNum" :get-select="tableData.getSelectNum" :get-table-data="tableData.departId" :page-total="tableData.pageTotal" :search-table-data="tableData.searchWord" :has-pagination="tableData.hasPagination" v-on:checkallchange="allCheckChangeHandler" v-on:selectdata="getTableSelectDataHandler" v-on:link="tableLinkHandler"></my-component>
					</div>
				  </div>
				</div>
				<div class="departRoleBtn">
				  <el-button @click="saveBasicInfo" type="success">保存</el-button>
				  <el-button @click="cancelBasicInfo">取消</el-button>
				</div>
			  </el-tab-pane>
			</el-tabs>
		  </div>
		</div>
	  </div>
	</div>
	<my-transfer :open="roleTransfer.openNum" :multiselect="roleTransfer.multiselect" :data="roleTransfer.data" :new-data="roleTransfer.newData" :box-title="'选择角色'" :left-title="'角色列表'" :right-title="'已选角色'" :key-att="'roleId'" :default-props="roleTransfer.defaultProps" v-on:change="RoleChangeHandler"></my-transfer>
	<my-transfer search-title="部门名称" :open="departTransfer.openNum" :multiselect="departTransfer.multiselect" :data="departTransfer.data" :new-data="departTransfer.newData" :box-title="'选择部门'" :left-title="'部门列表'" :right-title="'已选部门'" :key-att="'id'" :default-props="departTransfer.defaultProps" v-on:change="departChangeHandler"></my-transfer>
  </div>
</template>
<script>
  import rightTopNav from '../CommonRightTopNavComponent.vue'
  import TipBoxService from '../../../publicJs/TipBoxService'
  import NoticeBoxService from '../../../publicJs/NoticeBoxService'
  import transfer from '../MyTransfer.vue'
  import ToolService from '../../publicJs/ToolService'
  import commonTable from '../CommonTableComponent.vue'
  import commonBtn from '../CommonBtnControlComponent.vue'
  import publicNavData from '../../publicJs/TransformLeftNavData'
  import HttpService from '../../../publicJs/ApiClient'

  export default {
    name: 'departAddEdit',
    data () {
      return {
        enterID: '',
        pId: '',
        enterpriseid: '',
        sign: 0,
        paramId: null,
        menuName: '部门管理',
        // 面包屑信息
        topNavData: {
          breadLinks: [{name: '部门管理', link: '/departManage'}, {name: '', link: '#'}],
          searchTitle: '部门名称'
        },
        leftNavData: [],
        publicTopNavData: [],
        // 默认选中的tab
        activeTab: 'basicInfo',
        // 基础信息表单
        basicInfoForm: {
          id: '',
          departmentName: '',  // 部门名
          parentDepart: '', // 上级部门
          pId: '', // 父id
          deptPhone: '', // 部门电话
          deptMail: '', // 部门邮箱
          remark: ''
        },
        // 基础信息表单验证规则
        basicInfoRule: {
          departmentName: [
            {
              required: true,
              trigger: 'blur',
              message: '请输入部门名称'
            },
            {
              max: 15,
              message: '部门名称最长为15个字',
              trigger: 'blur'
            }
          ],
          parentDepart: [
            {
              required: true,
              trigger: 'blur',
              message: '请输入上级部门'
            }
          ],
          deptPhone: [],
          deptMail: [],
          remark: []
        },
        // 角色信息
        roleData: [],
        multipleSelection: [],
        roleTransfer: {
          openNum: 0,
          data: [],
          newData: [],
          multiselect: true,
          defaultProps: {
            children: 'children',
            label: 'roleName'
          }
        },
        departTransfer: {
          openNum: 0,
          data: [],
          newData: [],
          multiselect: false,
          defaultProps: {
            children: 'children',
            label: 'label'
          }
        },
        tableData: {
          departId: 0,
          allSelected: false,
          bodyAllSelected: false,
          bodyData: [],
          renewNum: 0,
          pageTotal: 0,
          searchWord: '',
          hasPagination: false,
          getSelectNum: 0
        },
        btnControlData: {},
        showSelectParentDepart: true
      }
    },
    components: {
      'right-top-nav': rightTopNav,
      'my-transfer': transfer,
      'my-component': commonTable,
      'btn-control': commonBtn
    },
    mounted () {
      // this.paramId = ToolService.getQueryString('id')
      this.paramId = this.$route.query.id
      this.sign = this.$route.query.sign
      if (this.paramId == null) {
        this.topNavData.breadLinks[1].name = '新建部门'
      } else {
        this.topNavData.breadLinks[1].name = '修改部门'
      }
      if (this.$parent.prividata && this.$parent.prividata.length !== 0) {
        this.getBtnArr(this.$parent.prividata)
      }
      this.$parent.hub.$on('getPriviData', (data) => {
        this.getBtnArr(data)
      })
  
      this.getDepartTree()
    },
    methods: {
      // 头部搜索
      topNavSearchHandler: function (data) {
        console.info('search=', data)
        // window.location.href = 'departManage.html?word=' + data
        this.$router.push('/departManage?word=' + data)
      },
      selectParentDepart: function () {
        var that = this
        if (this.basicInfoForm.pId !== '') {
          that.departTransfer.newData = [{id: this.basicInfoForm.pId, label: this.basicInfoForm.parentDepart}]
        } else {
          that.departTransfer.newData = []
        }
        that.departTransfer.openNum++
      },
      // 若为修改时，查修改信息
      getUpdateInfo: function () {
        var that = this
        // 根据id查部门信息
        HttpService.get('priviapi/deptpriv/getDetail', 'param=' + this.paramId, function (data) {
          if (data.status == '200') {
            console.info('zzzzzzzzzzz')
            console.info('PID11', data.data)
            // that.pid = data.data.pid
            // 获取角色树
            that.enterID = data.data.enterpriseid
            that.getRoleTree()
            that.basicInfoForm.id = data.data.id
            that.basicInfoForm.departmentName = data.data.deptName
            // that.basicInfoForm.parentDepart = data.data.pid;
            that.basicInfoForm.pId = data.data.pid
            if (that.basicInfoForm.pId) {
              that.showSelectParentDepart = false
            }
            that.basicInfoForm.deptPhone = data.data.deptPhone
            that.basicInfoForm.deptMail = data.data.deptEmail
            that.basicInfoForm.remark = data.data.remark
            that.roleData = that.dataHandler(data.data.deptRole)
            var allDepart = that.departTransfer.data
            that.getParentName(allDepart, that.basicInfoForm.pId)
          }
        })
      },
      // 查父部门名称
      getParentName: function (data, pId) {
        for (var i = 0; i < data.length; i++) {
          if (data[i].id == pId) {
            this.basicInfoForm.parentDepart = data[i].label
            break
          } else {
            if (data[i].children) {
              this.getParentName(data[i].children, pId)
            }
          }
        }
      },
      // 获取角色树
      getRoleTree: function () {
        var that = this
        var para = {param: '', enterpriseId: that.enterID}
        HttpService.get('priviapi/departrole/searchParam', para, function (data) {
          if (data.status == '200') {
            console.log('roleTransfer.data123', data.data)
            that.roleTransfer.data = data.data[0].roleList
          }
        })
      },
      // 获取部门树
      getDepartTree: function () {
        var that = this
        HttpService.get('priviapi/deptpriv/getDeptTreeNoOther', {param: ''}, function (data) {
          if (data.status == '200') {
            console.log('departTransfer.data11', data.data)
            that.departTransfer.data = data.data
          }
          if (that.topNavData.breadLinks[1].name === '修改部门') {
            that.getUpdateInfo()
          }
        })
      },
      // 保存基本信息
      saveBasicInfo: function () {
        var aryRole = []
        for (var i = 0; i < this.roleData.length; i++) {
          aryRole.push(this.roleData[i].roleId)
        }
        this.basicInfoForm.departmentName = ToolService.trimStr(this.basicInfoForm.departmentName)
        if (this.basicInfoForm.departmentName == '') {
          TipBoxService.open('请输入部门名称', 2)
          return false
        } else {
          if (this.basicInfoForm.departmentName.length > 15) {
            TipBoxService.open('部门名称不可以超过15个字', 2)
            return false
          }
        }
        if (this.basicInfoForm.pId == '') {
          TipBoxService.open('请选择上级部门', 2)
          return false
        }
        if (this.basicInfoForm.deptPhone !== '') {
          if (!ToolService.regPhone(this.basicInfoForm.deptPhone)) {
            TipBoxService.open('请输入正确的电话号码', 2)
            return false
          }
        }
        if (this.basicInfoForm.deptMail !== '') {
          if (!ToolService.regMail(this.basicInfoForm.deptMail)) {
            TipBoxService.open('请输入正确的邮箱', 2)
            return false
          }
        }
        if (this.basicInfoForm.remark !== '') {
          if (this.basicInfoForm.remark.length > 40) {
            TipBoxService.open('备注不可超过40个字', 2)
            return false
          }
        }
        var param = {
          data: {
            id: this.basicInfoForm.id,
            deptName: this.basicInfoForm.departmentName,
            deptPhone: this.basicInfoForm.deptPhone,
            remark: this.basicInfoForm.remark,
            pId: this.basicInfoForm.pId,
            deptMail: this.basicInfoForm.deptMail,
            deptRole: aryRole
          }
        }
        var strUrl = ''
        if (this.topNavData.breadLinks[1].name == '新建部门') {
          strUrl = 'priviapi/deptpriv/saveDept'
        } else {
          strUrl = 'priviapi/deptpriv/updateDept'
        }
        var that = this
        HttpService.post(strUrl, 'param=' + JSON.stringify(param), function (data) {
          if (data.status == '200') {
            TipBoxService.open('保存成功', 0)
            // setTimeout(function () {
            //   that.$router.push('/departManage')
            // }, 2 * 1000)
          }
        }).catch((error) => {
          if (error.response.data.status == '503') {
            TipBoxService.open(error.response.data.exception, 2)
          }
        })
      },
      // 取消基本信息
      cancelBasicInfo: function () {
        // window.location.href = './departManage.html'
        this.$router.push('/departManage?sign=' + this.sign)
      },
      // 添加角色
      addRole: function () {
        var that = this
        that.roleTransfer.newData = that.roleData
        that.roleTransfer.openNum++
      },
      // 删除角色
      deleteRole: function () {
        var that = this
        that.tableData.getSelectNum++
      },
      // 角色列表多选
      handleSelectionChange (val) {
        this.multipleSelection = val
      },
      // 角色穿梭框返回数据
      RoleChangeHandler (data) {
        console.info('roleData=', data)
        this.roleData = this.dataHandler(data)
        // this.roleData = data;
        // this.tableData.bodyData=this.dataHandler(data);
      },
      linkChangeHandler (link) {
        publicNavData.gotoLeftNavLink(link.link)
      },
      // 部门穿梭框返回数据
      departChangeHandler (data) {
        var that = this
        console.log('返回的数据111', data)
        that.enterID = data[0].enterpriseid
        that.getRoleTree()
        that.basicInfoForm.parentDepart = data[0].label
        that.basicInfoForm.pId = data[0].id
      },
      getBtnArr (data) {
        var that = this
        var menuId = publicNavData.getMenuId('部门管理', publicNavData.getPriviData('权限管理', data))
        var btnObj = {}
        HttpService.get('priviapi/authmanage/getUserAllPriv', {menuId: menuId}, function (data) {
          for (var i = 0; i < data.data.length; i++) {
            var obj = data.data[i]
            if (obj.title == '新建部门角色') {
              btnObj.add = {fn: that.addRole}
            } else if (obj.title == '删除部门角色') {
              btnObj.remove = {fn: that.deleteRole}
            }
          }
          that.btnControlData = btnObj
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
      // 删除角色
      getTableSelectDataHandler (data) {
        var that = this
        if (data.length == 0) {
          TipBoxService.open('请选择删除项！', 2)
        } else {
          NoticeBoxService.open('确定要删除所选角色吗？', function () {
            var delRole = data
            var nowRoleData = []
            var roleData = that.roleData
            for (var i = 0; i < roleData.length; i++) {
              var isPush = true
              for (var j = 0; j < delRole.length; j++) {
                if (delRole[j].roleId == roleData[i].roleId) {
                  isPush = false
                }
              }
              if (isPush) {
                nowRoleData.push(roleData[i])
              }
            }
            that.roleData = nowRoleData
            NoticeBoxService.close()
          })
        }
      },
      tableLinkHandler (data) {
        var that = this
        HttpService.get('priviapi/userrole/searchDepart', data, function (data) {
          console.info('jjjjjjj=', data)
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
          var lineData = [
            {img: true, imageClass: 'accout', itemWidth: '5%'},
            {
              text: true,
              itemWidth: '45%',
              textData: {
                角色名称: obj.roleName
              }
            },
            {
              text: true,
              itemWidth: '45%',
              textData: {
                备注: obj.remark
              }
            },
            {check: true, itemWidth: '5%', checkData: false}
          ]
          // var lineData=[{check:true,checkData:false},{link:false,text:true,name:obj.USERNAME},{text:true,name:obj.deptName.toString()},{text:true,name:obj.POSITION},{text:true,name:obj.PHONE},{text:true,name:obj.REMARK}];
          // obj.lineData=lineData;
          this.$set(obj, 'lineData', lineData)
        }
        return dataList
      },
      // 全选
      headerCheckChangeHandler (data) {
        console.info('clickselect=', this.tableData.allSelected)
        this.tableData.bodyAllSelected = this.tableData.allSelected + '/' + Math.random()
        // this.$set(this.tableData,'bodyAllSelected',this.tableData.allSelected);
      }
    },
    computed: {
      // 是否禁用部门角色nav
      disableRole: function () {
        console.info('kdfjdjf=', this.basicInfoForm.departmentName == '' || this.basicInfoForm.parentDepart == '' || this.basicInfoForm.departmentName.length > 15)
        return this.basicInfoForm.departmentName == '' || this.basicInfoForm.departmentName.length > 15
      }
    }
  }
</script>
<style src="../../css/departAddEdit.css" scoped></style>
<style scoped>
  .commonRightBottoBottomContainer {
	overflow-y: visible;
	bottom: 43px;
  }
  #platformAuthority .SelectParentDepart.is-disabled {
	padding: 6px 15px;
	background-color: #eef1f6;
	border-radius: 0;
  }
</style>

<style>
  .commonLayoutRightBottomContainer .el-tabs .el-tabs__header {
	margin-bottom: 1px;
  }
  #platformAuthority .el-tabs__nav {
	width: auto;
  }
</style>

