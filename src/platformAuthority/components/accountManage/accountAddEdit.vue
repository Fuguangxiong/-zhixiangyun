<template>
  <div id="platformAuthority">
	<div class="publicWidthHeightContainer">
	  <div class="commonRightBottoTopContainer">
		<right-top-nav :no-input="true" :links="topNavData.breadLinks" :searchname="topNavData.searchTitle" :searchword="topNavData.searchWord" v-on:search="topNavSearchHandler"></right-top-nav>
	  </div>
	  <div class="commonRightBottoBottomContainer">
		<div class="publicWidthHeightContainer whiteBg">
		  <div class="commonLayoutRightBottomContainer" style="padding-top: 20px;height: 100%;">
			<el-tabs v-model="activeTab" type="card" style="height: 100%;">
			  <el-tab-pane label="基础信息" name="basicInfo" style="padding-top:30px;height:100%;overflow-y:auto" @change="saveComfirm()">
				<div class="basicInfoField" style="height:100%;">
				  <div class="basicInfoFieldL">
					<div class="basicInfoFieldLTop">
					  <div class="basicInfoFieldLTopL">
						<ul>
						  <li>
                            <span class="textLabel">
                              <span class="requireLogo">*</span>姓名</span>
						  </li>
						  <li class="InputLi">
							<input class="tableInput" v-model="basicInfoForm.userName"/>
						  </li>
						</ul>
						<ul>
						  <li>
                            <span class="textLabel">
                              邮箱</span>
						  </li>
						  <li class="InputLi">
							<input class="tableInput" v-model="basicInfoForm.mail"/>
						  </li>
						</ul>
						<ul>
						  <li>
                            <span class="textLabel">
                              <span class="requireLogo">*</span>部门</span>
						  </li>
						  <li class="InputLi" style="position:relative;">
							<input id="departField" class="tableInput inputL" v-model="basicInfoForm.deptName" readonly/>
							<el-button icon="search" size="mini" @click="selectDepart" slot="append" style="position:absolute;top:0;right:5px;border:0" :disabled="!showSelectParentDepart"></el-button>
						  </li>
						</ul>
						<ul>
						  <li>
                            <span class="textLabel">
                              办公电话</span>
						  </li>
						  <li class="InputLi">
							<input class="tableInput" v-model="basicInfoForm.telephoneNo"/>
						  </li>
						</ul>
					  </div>
					  <div class="basicInfoFieldLTopR">
						<ul>
						  <li>
                            <span class="textLabel">
                              <span class="requireLogo">*</span>手机号码</span>
						  </li>
						  <li class="InputLi">
							<input class="tableInput" v-model="basicInfoForm.phone"/>
						  </li>
						</ul>
						<ul>
						  <li>
                            <span class="textLabel">
                              身份证号</span>
						  </li>
						  <li class="InputLi">
							<input class="tableInput" v-model="basicInfoForm.idCard"/>
						  </li>
						</ul>
						<ul>
						  <li>
                            <span class="textLabel">
                              职位</span>
						  </li>
						  <li class="InputLi">
							<input class="tableInput" v-model="basicInfoForm.position"/>
						  </li>
						</ul>
						<ul>
						  <li>
                            <span class="textLabel">
                              办公地址</span>
						  </li>
						  <li class="InputLi">
							<input class="tableInput" v-model="basicInfoForm.officeAddress"/>
						  </li>
						</ul>
					  </div>
					</div>
					<div class="basicInfoFieldLBotttom">
					  <ul>
						<li>
                          <span class="textLabel">
                            家庭地址</span>
						</li>
						<li class="inputF">
						  <input class="inputFam" v-model="basicInfoForm.homeAddress"/>
						</li>
					  </ul>
					  <ul class="beizhu">
						<li>
                          <span class="textLabel">
                            备注</span>
						</li>
						<li>
						  <textarea class="tableTextArea" v-model="basicInfoForm.remark"></textarea>
						</li>
					  </ul>
					</div>
				  </div>
				  <!-- <div class="basicInfoFieldR" v-on:click="openSelectFileDialog">
					<img v-if="basicInfoForm.headImage!==''" v-bind:src="basicInfoForm.headImage" class="headerImage" />
					<div v-else class="uploadFileButton">
					  <div class="upload"></div>
					  上传头像
					</div>
					<input type="file" id="uploadFile" @change="saveFilePath()" />
				  </div> -->
				  <div class="accountBtn">
					<el-button @click="saveBasicInfo" type="primary" style="margin:0 30px 0 -150px;background:#26d186;height:32px;width:82px;border:0;">
					  保存
					</el-button>
					<el-button @click="cancelBasicInfo" style="height:32px;width:82px;">取消</el-button>
				  </div>
				</div>
			  </el-tab-pane>
			  <el-tab-pane label="角色关系" name="roleRelation" :disabled="disableRole">
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
				  <el-button @click="saveBasicInfo" type="success" style="margin:0 30px 0 -150px;background:#26d186;height:32px;width:82px;border:0;">
					保存
				  </el-button>
				  <el-button @click="cancelBasicInfo" style="height:32px;width:82px;">取消</el-button>
				</div>
			  </el-tab-pane>
			</el-tabs>
		  </div>
		</div>
	  </div>
	</div>
	<my-transfer not-select="isEnterprise" :open="roleTransfer.openNum" :multiselect="roleTransfer.multiselect" :data="roleTransfer.data" :new-data="roleTransfer.newData" :box-title="'选择角色'" :left-title="'角色列表'" :right-title="'已选角色'" :key-att="'roleId'" :default-props="roleTransfer.defaultProps" v-on:change="RoleChangeHandler"></my-transfer>
	<my-transfer :open="departTransfer.openNum" :multiselect="departTransfer.multiselect" :data="departTransfer.data" :new-data="departTransfer.newData" :box-title="'选择部门'" :left-title="'部门列表'" :right-title="'已选部门'" :key-att="'id'" :default-props="departTransfer.defaultProps" v-on:change="departChangeHandler"></my-transfer>
  </div>
</template>
<script>
  import HttpService from '../../../publicJs/ApiClient'
  import rightTopNav from '../CommonRightTopNavComponent.vue'
  import TipBoxService from '../../../publicJs/TipBoxService'
  import NoticeBoxService from '../../../publicJs/NoticeBoxService'
  import transfer from '../MyTransfer.vue'
  import publicNavData from '../../publicJs/TransformLeftNavData'
  import ToolService from '../../publicJs/ToolService'
  import commonTable from '../CommonTableComponent.vue'
  import commonBtn from '../CommonBtnControlComponent.vue'
  import loadingBoxService from '../../../publicJs/LoadingBoxService'

  export default {
    name: 'accountAddEdit',
    data () {
      return {
        showSelectParentDepart: true,
        enterID: '',
        sign: 0,
        paramId: null,
        menuName: '用户管理',
        // 面包屑信息
        topNavData: {
          breadLinks: [{
            name: '用户管理',
            link: '/accountManage'
          }, {
            name: '',
            link: '#'
          }],
          searchTitle: '部门名称'
        },
        roleData: [],
        leftNavData: [],
        publicTopNavData: [],
        btnControlData: {},
        // 默认选中的tab
        activeTab: 'basicInfo',
        // 基础信息表单
        basicInfoForm: {
          id: '',
          userName: '', // 用户名
          phone: '', // 手机号码
          mail: '', // 邮箱
          idCard: '', // 身份证号
          deptId: '', // 部门id
          deptName: '', // 部门名
          position: '', // 职位
          telephoneNo: '', // 办公电话
          officeAddress: '', // 办公地址
          homeAddress: '', // 家庭住址
          remark: '', // 备注
          headImage: '', // 头像
          headImage2: '',
          userRole: [] // 用户角色
        },
        // 基础信息表单验证规则
        basicInfoRule: {},
        // 角色信息
        multipleSelection: [],
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
        departId: null,
        nameTest: 0, // 1表示姓名重复
        phoneTest: 0, // 1表示手机号重复
        nameTestmark: 0,
        duplicationOfName: 0 // 0表示点击保存触发效验  1表示点击保存不触发效验

      }
    },
    components: {
      'right-top-nav': rightTopNav,
      'my-component': commonTable,
      'btn-control': commonBtn,
      'my-transfer': transfer
    },
    mounted () {
      loadingBoxService.open('数据加载中...')
      this.sign = this.$route.query.sign
      this.paramId = this.$route.query.id
      this.departId = this.$route.query.departId
      if (this.paramId == null) {
        this.topNavData.breadLinks[1].name = '新建账户'
      } else {
        this.topNavData.breadLinks[1].name = '修改账户'
      }
  
      this.getDepartTree()
      if (this.$parent.prividata && this.$parent.prividata.length !== 0) {
        this.getBtnArr(this.$parent.prividata)
      }
      this.$parent.hub.$on('getPriviData', (data) => {
        this.getBtnArr(data)
      })
    },
    methods: {
      topNavSearchHandler: function (data) {
        console.info('search=', data)
        // window.location.href = 'accountManage.html?word=' + data
        this.$router.push('/accountManage?word=' + data)
      },
      selectParentDepart: function () {
        // console.log('selectParentDepart');
        var that = this
        if (this.basicInfoForm.pId !== '') {
          that.departTransfer.newData = [{
            id: this.basicInfoForm.pId,
            label: this.basicInfoForm.parentDepart
          }]
        } else {
          that.departTransfer.newData = []
        }
        that.departTransfer.openNum++
      },
      handleSelectionChange (val) {
        this.multipleSelection = val
      },
      // 获取角色树
      getRoleTree: function () {
        var that = this
        HttpService.get('priviapi/departrole/searchParam', {param: '', enterpriseId: that.enterID}, function (data) {
          if (data.status == '200') {
            console.log('roleTransfer.data22', data.data)
            that.roleTransfer.data = that.treeDataHandler(data.data)
          }
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
          temp.isEnterprise = true
          treeData.push(temp)
        }
        return treeData
      },
      // 获取部门树
      getDepartTree: function () {
        var that = this
        HttpService.get('priviapi/deptpriv/getDeptTreeNoOther', {
          param: ''
        }, function (data) {
          if (data.status == '200') {
            that.departTransfer.data = data.data
          }
          if (that.topNavData.breadLinks[1].name == '修改账户') {
            that.getUpdateInfo()
          } else {
            loadingBoxService.close()
          }
        })
      },
      getUpdateInfo: function () {
        var that = this
        // 根据id查部门信息
        HttpService.post('priviapi/userrole/searchUser', 'param=' + this.paramId + '&departmentId=' + this.departId, function (data) {
          if (data.status == '200') {
            console.log('根据id查部门信息', data.data)
            that.enterID = data.data.enterpriseId
            that.getRoleTree()
            that.basicInfoForm.id = data.data.id
            that.basicInfoForm.userName = data.data.userName
            that.basicInfoForm.phone = data.data.phone
            that.basicInfoForm.mail = data.data.mail
            that.basicInfoForm.idCard = data.data.idCard
            that.basicInfoForm.deptId = data.data.deptId
            that.basicInfoForm.position = data.data.position
            that.basicInfoForm.deptName = data.data.deptName
            if (data.data.id) {
              that.showSelectParentDepart = false
            }
            that.basicInfoForm.telephoneNo = data.data.telephoneNo
            that.basicInfoForm.officeAddress = data.data.officeAddress
            that.basicInfoForm.homeAddress = data.data.homeAddress
            that.basicInfoForm.remark = data.data.remark
            that.basicInfoForm.headImage2 = data.data.headImage
            that.basicInfoForm.userRole = data.data.userRole
            that.roleData = that.dataHandler(data.data.userRole)
            var allDepart = that.departTransfer.data
            that.getParentName(allDepart, that.basicInfoForm.deptId)
            sessionStorage.setItem('name', JSON.stringify(that.basicInfoForm.userName))
            sessionStorage.setItem('phone', JSON.stringify(that.basicInfoForm.phone))
            loadingBoxService.close()
          }
        })
      },
      // 保存基本信息
      saveBasicInfo: function () {
        var aryRole = []
        for (var i = 0; i < this.roleData.length; i++) {
          // console.info(this.basicInfoForm.userRole[i].roleId)
          aryRole.push(this.roleData[i].roleId)
        }
        this.basicInfoForm.userName = ToolService.trimStr(this.basicInfoForm.userName)
//        this.checkName(this.basicInfoForm.userName)
        if (this.basicInfoForm.userName == '') {
          TipBoxService.open('请输入姓名', 2)
          return false
        } else {
          if (this.basicInfoForm.userName.length > 25) {
            TipBoxService.open('姓名不可以超过25个字', 2)
            return false
          }
          if (!ToolService.regUserName(this.basicInfoForm.userName)) {
            TipBoxService.open('姓名只可输入汉字和英文', 2)
            return false
          }
        }
        if (this.basicInfoForm.phone == '') {
          TipBoxService.open('请输入手机号码', 2)
          return false
        } else {
          if (!ToolService.regPhone(this.basicInfoForm.phone)) {
            TipBoxService.open('请输入正确的手机号码', 2)
            return false
          }
        }
        if (this.basicInfoForm.mail !== '') {
          if (!ToolService.regMail(this.basicInfoForm.mail)) {
            TipBoxService.open('请输入正确的邮箱', 2)
            return false
          }
        }
        if (this.basicInfoForm.idCard !== '') {
          if (!ToolService.regIDCard(this.basicInfoForm.idCard)) {
            TipBoxService.open('请输入18位数字或字母（只限最后一位）', 2)
            return false
          }
        }
        if (this.basicInfoForm.deptName === '') {
          TipBoxService.open('请选择部门', 2)
          return false
        }
        if (this.basicInfoForm.telephoneNo !== '') {
          if (!ToolService.regPhone(this.basicInfoForm.telephoneNo)) {
            TipBoxService.open('请输入正确的办公电话', 2)
            return false
          }
        }
        if (this.basicInfoForm.position !== '') {
          if (this.basicInfoForm.position.length > 20) {
            TipBoxService.open('职位不可以超过20个字', 2)
            return false
          }
        }
        if (this.basicInfoForm.officeAddress !== '') {
          if (this.basicInfoForm.officeAddress.length > 100) {
            TipBoxService.open('办公地址不可以超过100个字', 2)
            return false
          }
        }
        if (this.basicInfoForm.homeAddress !== '') {
          if (this.basicInfoForm.homeAddress.length > 100) {
            TipBoxService.open('家庭地址不可以超过100个字', 2)
            return false
          }
        }
        if (this.basicInfoForm.remark !== '') {
          if (this.basicInfoForm.remark.length > 40) {
            TipBoxService.open('备注不可以超过40个字', 2)
            return false
          }
        }
        var param = {
          data: {
            id: this.basicInfoForm.id,
            userName: this.basicInfoForm.userName, // 用户名
            phone: this.basicInfoForm.phone, // 手机号码
            mail: this.basicInfoForm.mail, // 邮箱
            idCard: this.basicInfoForm.idCard, // 身份证号
            deptId: this.basicInfoForm.deptId, // 部门id
            position: this.basicInfoForm.position, // 职位
            deptName: this.basicInfoForm.deptName, // 部门名称
            telephoneNo: this.basicInfoForm.telephoneNo, // 办公电话
            officeAddress: this.basicInfoForm.officeAddress, // 办公地址
            homeAddress: this.basicInfoForm.homeAddress, // 家庭住址
            remark: this.basicInfoForm.remark, // 备注
            headImage: this.basicInfoForm.headImage2, // 头像
            userRole: aryRole // 用户角色
          }
        }
        var strUrl = ''
        var that = this
        if (this.topNavData.breadLinks[1].name == '新建账户') {
          param.data.headImage = 'avatar0.jpg'
          strUrl = 'priviapi/userrole/saveUser'
          loadingBoxService.open('请稍候...')
          // 姓名重名效验
          HttpService.get('priviapi/userrole/checkUserName', {
            userName: that.basicInfoForm.userName
          }).then(data => {
            console.log(data)
            loadingBoxService.close()
            if (data.data === true) {
              that.nameTest = 1
              setTimeout(function () {
                TipBoxService.open('此姓名已经存在!', 2)
              }, 1000)
              return false
            }
            if (data.data === false) {
              that.nameTest = 0
            }
          }).then(() => {
            console.log('1')
            console.log(that.nameTest)
            if (that.nameTest === 1) {
              return false
            }
            console.log('2')
            HttpService.post(strUrl, 'param=' + JSON.stringify(param), function (data) {
              if (data.status == '200') {
                TipBoxService.open('保存成功', 0)
                loadingBoxService.close()
                setTimeout(function () {
                  // window.location.href = 'accountManage.html'
                  that.$router.push('/accountManage')
                }, 2 * 1000)
              }
            }).catch((error) => {
              console.log('报错')
              if (error.response.data.status == '503') {
                loadingBoxService.close()
                TipBoxService.open(error.response.data.exception, 2)
              }
            })
          }).catch(e => {
          })
        } else {
          // 修改账户
          const NAME = JSON.parse(sessionStorage.getItem('name'))
          const PHONE = JSON.parse(sessionStorage.getItem('phone'))
          console.log(NAME)
          console.log(PHONE)
          strUrl = 'priviapi/account/saveAcount'
          loadingBoxService.open('请稍候...')
          HttpService.get('priviapi/userrole/checkUserName', {
            userName: that.basicInfoForm.userName === NAME ? '' : that.basicInfoForm.userName
          }).then(data => {
            if (data.data === true) {
//
              that.nameTestmark = 1
              that.nameTest = 1
              setTimeout(function () {
                TipBoxService.open('此姓名已经存在!', 2)
              }, 1000)
              return false
            }
            if (data.data === false) {
              that.nameTestmark = 0
              that.nameTest = 0
            }
          }).then(() => {
            if (that.nameTestmark === 1) {
              loadingBoxService.close()
              return
            }
            HttpService.get('priviapi/accountpriv/checkPhone', {
              phone: that.basicInfoForm.phone === PHONE ? '8888888' : that.basicInfoForm.phone
            }).then(data => {
//              loadingBoxService.close()
              console.log(data, '电话号码重名效验')
              if (data.data === true) {
                that.phoneTest = 1
                setTimeout(function () {
                  TipBoxService.open('此手机号已经存在!', 2)
                }, 1000)
                return false
              }
              if (data.data === false) {
                that.phoneTest = 0
              }
            }).then(() => {
              if (that.nameTest === 1 || that.phoneTest === 1) {
                loadingBoxService.close()
                return
              }
              HttpService.post(strUrl, 'param=' + JSON.stringify(param), function (data) {
                if (data.status == '200') {
                  loadingBoxService.close()
                  TipBoxService.open('保存成功', 0)
                  // setTimeout(function () {
                  //   that.$router.push('/accountManage')
                  // }, 2 * 1000)
                }
              })
            })
          })
        }
      },
      // 查父部门名称
      getParentName: function (data, pId) {
        for (var i = 0; i < data.length; i++) {
          if (data[i].id == pId) {
            this.basicInfoForm.deptName = data[i].label
            break
          } else {
            if (data[i].children) {
              this.getParentName(data[i].children, pId)
            }
          }
        }
      },
      // 取消基本信息
      cancelBasicInfo: function () {
        // window.location.href = './accountManage.html'
        this.$router.push('/accountManage?sign=' + this.sign)
      },
      // 选择角色
      addRole: function () {
        var that = this
        that.roleTransfer.newData = that.basicInfoForm.userRole
        that.roleTransfer.openNum++
      },
      // 删除角色
      deleteRole: function () {
        var that = this
        that.tableData.getSelectNum++
      },
      // 选择部门
      selectDepart: function () {
        var that = this
        if (that.basicInfoForm.deptId !== '') {
          that.departTransfer.newData = [{
            id: that.basicInfoForm.deptId,
            label: that.basicInfoForm.deptName
          }]
        } else {
          that.departTransfer.newData = []
        }
        that.departTransfer.openNum++
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
      // 角色框返回数据
      RoleChangeHandler: function (data) {
        console.info('roleData=', data)
        this.basicInfoForm.userRole = data
        this.roleData = this.dataHandler(data)
        console.info('roleData=', data)
      },
      departChangeHandler: function (data) {
        var that = this
        console.log('departChangeHandler33', data)
        that.enterID = data[0].enterpriseid
        that.getRoleTree()
        that.basicInfoForm.deptId = data[0].id
        that.basicInfoForm.deptName = data[0].label
      },
      headerCheckChangeHandler (data) {
        console.info('clickselect=', this.tableData.allSelected)
        this.tableData.bodyAllSelected = this.tableData.allSelected + '/' + Math.random()
        // this.$set(this.tableData,'bodyAllSelected',this.tableData.allSelected);
      },
      linkChangeHandler (link) {
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
      getBtnArr (data) {
        var that = this
        var menuId = publicNavData.getMenuId('用户管理', publicNavData.getPriviData('权限管理', data))
        var btnObj = {}
        HttpService.get('priviapi/authmanage/getUserAllPriv', {
          menuId: menuId
        }, function (data) {
          for (var i = 0; i < data.data.length; i++) {
            var obj = data.data[i]
            if (obj.title == '添加账户角色') {
              btnObj.add = {
                fn: that.addRole
              }
            } else if (obj.title == '删除账户角色') {
              btnObj.remove = {
                fn: that.deleteRole
              }
            }
          }
          that.btnControlData = btnObj
        })
      },
      dataHandler (dataList) {
        for (var i = 0; i < dataList.length; i++) {
          var obj = dataList[i]
          var lineData = [{
            img: true,
            imageClass: 'accout',
            itemWidth: '5%'
          }, {
            text: true,
            itemWidth: '45%',
            textData: {
              角色名称: obj.roleName
            }
          }, {
            text: true,
            itemWidth: '45%',
            textData: {
              备注: obj.remark
            }
          }, {
            check: true,
            itemWidth: '5%',
            checkData: false
          }]
          // var lineData=[{check:true,checkData:false},{link:false,text:true,name:obj.USERNAME},{text:true,name:obj.deptName.toString()},{text:true,name:obj.POSITION},{text:true,name:obj.PHONE},{text:true,name:obj.REMARK}];
          // obj.lineData=lineData;
          this.$set(obj, 'lineData', lineData)
        }
        return dataList
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
      openSelectFileDialog (data) {
        console.info('ffffffffffffdd=', uploadFile)
        uploadFile.click()
      },
      saveComfirm () {
        console.log(1)
      }
      //   saveFilePath (data) {
      //     var file = uploadFile.files[0]
      //     var filePath = event.currentTarget.files[0].name
      //     if (!/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(filePath)) {
      //       TipBoxService.open('头像只能选择图片文件', 2)
      //       return false
      //     }
      //     var that = this
      //     HttpService.upload('priviapi/addImg/addImgs?param=', file, function (data) {
      //       console.info('dkfjdjfj=', data)
      //       // var obj=JSON.parse(data);
      //       if (data.status == 'success') {
      //         that.basicInfoForm.headImage2 = data.pathUrl
      //         that.basicInfoForm.headImage = HttpService.apiBaseUrl + data.pathUrl
      //       }
      //     })
      //   }
    },
    computed: {
      // 是否禁用部门角色nav
      disableRole: function () {
        // debugger
        return this.basicInfoForm.deptName == '' || this.basicInfoForm.userName == '' || this.basicInfoForm.phone == '' || !ToolService.regPhone(this.basicInfoForm.phone) || !ToolService.regUserName(this.basicInfoForm.userName)
      }
    }
  }
</script>
<style src="../../css/departAddEdit.css" scoped></style>
<style src="../../css/accountAddEdit.css" scoped></style>
<style scoped>
  .commonRightBottoBottomContainer {
	overflow-y: visible;
	bottom: 43px;
  }
  .commonTableTable {
	padding-bottom: 55px;
  }
  .el-button {
	width: 28px;
	height: 30px;
  }
</style>

