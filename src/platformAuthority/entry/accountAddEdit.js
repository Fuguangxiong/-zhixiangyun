/**
 * Created by yancan
 */

import HttpService from '../../publicJs/ApiClient'
import Vue from 'vue'
import ElementUI from 'element-ui'

import header from '../../publicComponent/publicTopNavComponent.vue'
import leftNav from '../../publicComponent/publicLeftNavComponent.vue'
import rightTopNav from '../components/CommonRightTopNavComponent.vue'

import bottomComponent from '../../publicComponent/publicBottomComponent.vue'
import TipBoxService from '../../publicJs/TipBoxService'
import NoticeBoxService from '../../publicJs/NoticeBoxService'
import transfer from '../components/MyTransfer.vue'
import publicNavData from '../publicJs/TransformLeftNavData'
import ToolService from '../publicJs/ToolService'
import commonTable from '../components/CommonTableComponent.vue'
import commonBtn from '../components/CommonBtnControlComponent.vue'
import '../css/departAddEdit.css'
import '../css/accountAddEdit.css'
Vue.use(ElementUI)

Vue.use(ElementUI)

function init () {
  var paramId = ToolService.getQueryString('id')
  var tag = ''
  if (paramId == null) {
    tag = '新建账户'
  } else {
    tag = '修改账户'
  }
  var vue = new Vue({
    el: '#accountAddEdit',
    data: {
    menuName: '账户管理',
			// 面包屑信息
    topNavData: {
    breadLinks: [{
    name: '权限管理',
    link: '#'
  }, {
  name: '账户管理',
  link: 'accountManage.html'
}, {
  name: tag,
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
    btnControlData: {}
  },
    components: {
    'left-nav': leftNav,
    'public-header': header,
    'public-bottom': bottomComponent,
    'right-top-nav': rightTopNav,
    'my-component': commonTable,
    'btn-control': commonBtn,
    'my-transfer': transfer
  },
    mounted () {
    this.getRoleTree()
    this.getDepartTree()
    this.getBtnArr()
    this.leftNavData = publicNavData.getLeftNavData('账户管理')
    var that = this
    publicNavData.getTopNavData(function (data) {
    that.publicTopNavData = data
  })
  },
    methods: {
    topNavSearchHandler: function (data) {
    console.info('search=', data)
    window.location.href = 'accountManage.html?word=' + data
  },
    selectParentDepart: function () {
				//          	console.log('selectParentDepart');
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
    HttpService.get('departrole/searchParam', {
    param: ''
  }, function (data) {
  if (data.status == '200') {
    that.roleTransfer.data = data.data
  }
})
  },
			// 获取部门树
    getDepartTree: function () {
    var that = this
    HttpService.get('deptpriv/getDeptTreeNoOther', {
    param: ''
  }, function (data) {
  if (data.status == '200') {
    that.departTransfer.data = data.data
  }
  if (tag == '修改账户') {
    that.getUpdateInfo()
  }
})
  },
    getUpdateInfo: function () {
    var that = this
				// 根据id查部门信息
    HttpService.post('userrole/searchUser', 'param=' + paramId, function (data) {
    if (data.status == '200') {
    that.basicInfoForm.id = data.data.id
    that.basicInfoForm.userName = data.data.userName
    that.basicInfoForm.phone = data.data.phone
    that.basicInfoForm.mail = data.data.mail
    that.basicInfoForm.idCard = data.data.idCard
    that.basicInfoForm.deptId = data.data.deptId
    that.basicInfoForm.position = data.data.position
    that.basicInfoForm.deptName = data.data.deptName
    that.basicInfoForm.telephoneNo = data.data.telephoneNo
    that.basicInfoForm.officeAddress = data.data.officeAddress
    that.basicInfoForm.homeAddress = data.data.homeAddress
    that.basicInfoForm.remark = data.data.remark
    that.basicInfoForm.headImage = HttpService.apiBaseUrl + data.data.headImage
    that.basicInfoForm.headImage2 = data.data.headImage
    that.basicInfoForm.userRole = data.data.userRole
    that.roleData = that.dataHandler(data.data.userRole)
    var allDepart = that.departTransfer.data
    that.getParentName(allDepart, that.basicInfoForm.deptId)
  }
  })
  },
			// 保存基本信息
    saveBasicInfo: function () {
    var aryRole = []
    for (var i = 0; i < this.basicInfoForm.userRole.length; i++) {
    console.info(this.basicInfoForm.userRole[i].roleId)
    aryRole.push(this.basicInfoForm.userRole[i].roleId)
  }
    this.basicInfoForm.userName = ToolService.trimStr(this.basicInfoForm.userName)
    if (this.basicInfoForm.userName == '') {
    TipBoxService.open('请输入姓名', 2)
    return false
  } else {
    if (this.basicInfoForm.userName.length > 15) {
    TipBoxService.open('姓名不可以超过15个字', 2)
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
    if (this.basicInfoForm.telephoneNo !== '') {
    if (!ToolService.regPhone(this.basicInfoForm.telephoneNo)) {
    TipBoxService.open('公用电话输入数字、输入规范的长度', 2)
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
    if (this.basicInfoForm.remark.length > 100) {
    TipBoxService.open('备注不可以超过100个字', 2)
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
    if (tag == '新建账户') {
    strUrl = 'userrole/saveUser'
  } else {
    strUrl = 'account/saveAcount'
  }
    HttpService.post(strUrl, 'param=' + JSON.stringify(param), function (data) {
    if (data.status == '200') {
    TipBoxService.open('保存成功', 0)
    setTimeout(function () {
    window.location.href = 'accountManage.html'
  }, 2 * 1000)
  }
  }).catch((error) => {
  if (error.response.data.status == '503') {
    TipBoxService.open(error.response.data.exception, 2)
  }
})
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
    window.location.href = './accountManage.html'
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
    this.basicInfoForm.deptId = data[0].id
    this.basicInfoForm.deptName = data[0].label
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
    getBtnArr () {
    var that = this
    var menuId = publicNavData.getMenuId('账户管理')
    var btnObj = {}
    HttpService.get('authmanage/getUserAllPriv', {
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
    HttpService.get('userrole/searchDepart', data, function (data) {
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
    saveFilePath (data) {
    var file = uploadFile.files[0]
    var filePath = event.currentTarget.files[0].name
    if (!/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(filePath)) {
    TipBoxService.open('头像只能选择图片文件', 2)
    return false
  }
    var that = this
    HttpService.upload('addImg/addImgs?param=', file, function (data) {
    console.info('dkfjdjfj=', data)
					// var obj=JSON.parse(data);
    if (data.status == 'success') {
    that.basicInfoForm.headImage2 = data.pathUrl
    that.basicInfoForm.headImage = HttpService.apiBaseUrl + data.pathUrl
  }
  })
  }
  },
    computed: {
			// 是否禁用部门角色nav
    disableRole: function () {
    return this.basicInfoForm.userName == '' || this.basicInfoForm.phone == '' || this.basicInfoForm.userName.length > 15 || !ToolService.regPhone(this.basicInfoForm.phone) || !ToolService.regUserName(this.basicInfoForm.userName)
  }
  }
  })
}
init()
