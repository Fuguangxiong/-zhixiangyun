<template>
	<div id="platformAuthority">
		<div class="commonRightBottoTopContainer">
			<right-top-nav :links="topNavData.breadLinks" :searchname="topNavData.searchTitle" :searchword="topNavData.searchWord" v-on:search="topNavSearchHandler"></right-top-nav>
		</div>
		<div class="commonRightBottoBottomContainer">
			<div class="publicWidthHeightContainer whiteBg">
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
		<my-transfer :open="departTransfer.openNum" :multiselect="departTransfer.multiselect" :data="departTransfer.data" :new-data="departTransfer.newData" :box-title="'添加超级管理员'" :left-title="'人员列表'" :right-title="'已选人员'" :key-att="'id'" :default-props="departTransfer.defaultProps" v-on:change="departChangeHandler"></my-transfer>
	</div>
</template>
<script>
import leftNav from '../../../publicComponent/publicLeftNavComponent.vue'
import header from '../../../publicComponent/publicTopNavComponent.vue'
import bottomComponent from '../../../publicComponent/publicBottomComponent.vue'
import rightTopNav from '../../components/CommonRightTopNavComponent.vue'
import HttpService from '../../../publicJs/ApiClient'
import TipBoxService from '../../../publicJs/TipBoxService'
import NoticeBoxService from '../../../publicJs/NoticeBoxService'
import commonTable from '../../components/CommonTableComponent.vue'
import commonBtn from '../../components/CommonBtnControlComponent.vue'
import transfer from '../../components/MyTransfer.vue'
import LoadingService from '../../../publicJs/LoadingBoxService'
import publicNavData from '../../publicJs/TransformLeftNavData'
export default {
  name: 'superAdministrator',
  components: {
    'left-nav': leftNav,
    'public-header': header,
    'public-bottom': bottomComponent,
    'right-top-nav': rightTopNav,
    'my-component': commonTable,
    'btn-control': commonBtn,
    'my-transfer': transfer
  },
  data () {
    return {
      test: '超级管理员',
      activeName: 'first',
      topNavData: {
        breadLinks: [{ name: '超级管理员', link: '#' }],
        searchTitle: '管理员',
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
      departTransfer: {
        openNum: 0,
        data: [],
        newData: [],
        multiselect: true,
        defaultProps: {
          children: 'children',
          label: 'name'
        }
      }
    }
  },
  mounted () {
    if (this.$parent.prividata && this.$parent.prividata.length !== 0) {
      this.getBtnArr(this.$parent.prividata)
    }
    this.$parent.hub.$on('getPriviData', (data) => {
      this.getBtnArr(data)
    })
    // this.tableData.departId = ''
    this.getDepartTree()
  },
  methods: {
		// 获取部门树
    getDepartTree: function () {
      var that = this
      HttpService.get('priviapi/authmanage/getDeptTree', { param: '' }, function (data) {
        if (data.status == '200') {
          that.departTransfer.data = data.data
        }
				/* if(tag=='修改账户'){
						that.getUpdateInfo();
				} */
      })
    },
    getBtnArr (data) {
      var that = this
      var menuId = publicNavData.getMenuId('超级管理员', data)
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
          }
        }
        that.btnControlData = btnObj
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
		// 选择部门
    addBtnHandler: function () {
      var that = this
      that.departTransfer.newData = []
      that.departTransfer.openNum++
    },
    removeBtnHandler () {
      console.info('删除')
      var that = this
      that.tableData.getSelectNum++
    },
    tableLinkHandler (data) {
      var that = this
      HttpService.get('priviapi/userrole/searchDepart', data, function (data) {
				// console.info("jjjjjjj=",data);

        if (data.data.userList != null) {
          that.tableData.pageTotal = data.data.page.rowCount
          var bodyData = that.dataHandler(data.data.userList)

          that.tableData.bodyData = bodyData
        }				else {
          that.tableData.bodyData = 'error' + Math.random()
        }
      })
    },
    dataHandler (dataList) {
      for (var i = 0; i < dataList.length; i++) {
        var obj = dataList[i]
        if (obj.USERNAME == 'null') {
          obj.USERNAME = '--'
        }
        if (obj.P_NAME == 'null') {
          obj.P_NAME = '--'
        }
        if (obj.POSITION == 'null') {
          obj.POSITION = '--'
        }
        if (obj.PHONE == 'null') {
          obj.PHONE = '--'
        }
        if (obj.REMARK == 'null') {
          obj.REMARK = '--'
        }
        var lineData = [
					{ img: true, imageClass: 'accout', itemWidth: '5%' },
          {						text: true,
            itemWidth: '30%',
            textData: {
              姓名: obj.USERNAME,
              所属部门: obj.deptName.toString()
            }					},
          {
            text: true,
            itemWidth: '30%',
            textData: {
              手机号: obj.PHONE,
              职位: obj.POSITION
            }
          },
          {
            text: true,
            itemWidth: '30%',
            textData: {
              备注: obj.REMARK
            }
          },
					{ check: true, itemWidth: '5%', checkData: false }
        ]
				// var lineData=[{check:true,checkData:false},{link:false,text:true,name:obj.USERNAME},{text:true,name:obj.deptName.toString()},{text:true,name:obj.POSITION},{text:true,name:obj.PHONE},{text:true,name:obj.REMARK}];
        obj.lineData = lineData
      }

      return dataList
    },
    topNavSearchHandler (data) {
      console.info('search=', data)
    },
    getTableSelectDataHandler (data) {
      var that = this

      if (data.length == 0) {
        TipBoxService.open('请选择删除项！', 2)
      }			else {
        NoticeBoxService.open('确定要删除用户吗？', function () {
          NoticeBoxService.close()

					// LoadingService.open("正在删除，请稍候...");
          var arr = new Array()
          for (var i = 0; i < data.length; i++) {
            var id = data[i].ID
            arr.push(id)
          }
          var sendData = { param: arr.toString(), roleId: '' }
          HttpService.get('priviapi/userrole/deleteAdminUser', sendData, function (data) {
            console.info('删除=', data)
            LoadingService.close()
            if (data.status == 200) {
              TipBoxService.open('删除成功！', 0)
              that.tableData.renewNum++
            }						else {
              TipBoxService.open('删除失败！', 1)
            }
          })
        })
      }
    },
    topNavSearchHandler (data) {
      this.tableData.departId = 'noLink'
      this.tableData.searchWord = data
    },
    searchTableDataHandler (data) {
      var that = this
      HttpService.get('priviapi/userrole/searchDepart', { param: '', condition: data.param, pageNum: '' }, function (data) {
        if (data.data.userList != null && data.data.userList.length) {
          that.tableData.pageTotal = data.data.page.rowCount
          var bodyData = that.dataHandler(data.data.userList)
          that.tableData.bodyData = bodyData
        }				else {
          that.tableData.bodyData = 'error' + Math.random()
        }
      })
    },
    tableLinkClickHandler (data) {

			// var hrefStr='./departAddEdit.html?id='+data.ID;
			// window.location.href=hrefStr;
    },
    departChangeHandler: function (data) {
      var that = this
      var dataArr = new Array()
      for (var i = 0; i < data.length; i++) {
        var id = data[i].id
        dataArr.push(id)
      }
			//              LoadingService.open("正在保存，请稍候...");
      HttpService.get('priviapi/userrole/saveAdminUser', { param: dataArr.toString() }, function (data) {
				//                  LoadingService.close();
				//                  if(data.status==200){
				//                      TipBoxService.open("保存成功！",0);
				//                      that.tableData.renewNum++;
				//                  }
				//                  else
				//                  {
				//                      TipBoxService.open("保存失败！",1);
				//                  }
        if (data.status == '200') {
          TipBoxService.open('保存成功', 0)
          that.tableData.renewNum++
          setTimeout(function () {
            that.$router.push('superAdministrator')
          }, 2 * 1000)
        }
      }).catch((error) => {
        if (error.response.data.status == '503') {
          TipBoxService.open(error.response.data.exception, 2)
        }
      })
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
