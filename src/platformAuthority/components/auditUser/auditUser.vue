<template>
  <div id="platformAuthority" class="publicWidthHeightContainer">
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
              <my-component :all-selected="tableData.bodyAllSelected" :body-data="tableData.bodyData" :renew="tableData.renewNum" :get-select="tableData.getSelectNum" :get-table-data="tableData.departId" :page-total="tableData.pageTotal" :search-table-data="tableData.searchWord" v-on:searchlink="searchTableDataHandler" v-on:checkallchange="allCheckChangeHandler" v-on:selectdata="getTableSelectDataHandler" v-on:link="tableLinkHandler" v-on:tablelinkclick="tableLinkClickHandler" v-on:change="tableBtnClickHandler"></my-component>
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
import transfer from '../MyTransfer.vue'
import LoadingService from '../../../publicJs/LoadingBoxService'
import publicNavData from '../../publicJs/TransformLeftNavData'
export default {
  name: 'auditUser',
  data () {
    return {
      test: '超级管理员',
      activeName: 'first',
      topNavData: {
        breadLinks: [{name: '用户管理', link: '#'}, {name: '账户审核', link: '#'}],
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
      }
    }
  },
  components: {
    'right-top-nav': rightTopNav,
    'my-component': commonTable,
    'btn-control': commonBtn,
    'my-transfer': transfer
  },
  mounted () {
    if (this.$parent.prividata && this.$parent.prividata.length !== 0) {
      this.getBtnArr(this.$parent.prividata)
    }
    this.$parent.hub.$on('getPriviData', (data) => {
      this.getBtnArr(data)
    })
    // this.tableData.departId = ''
  },
  methods: {
    getBtnArr (data) {
      var that = this
      var menuId = publicNavData.getMenuId('账户审核', data)
      var btnObj = {}
      HttpService.get('priviapi/authmanage/getUserAllPriv', {menuId: menuId}, function (data) {
        for (var i = 0; i < data.data.length; i++) {
          var obj = data.data[i]
          if (obj.title == '通过') {
            btnObj.pass = {fn: that.addBtnHandler}
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
            // 通过
    addBtnHandler: function () {
      var that = this
      that.tableData.getSelectNum++
    },

    tableLinkHandler (data) {
      var that = this
      console.info('kdjfkdjf=', data)
      HttpService.get('priviapi/enterprise/searchApprovals', data, function (data) {
        if (data.data.approvalList != null && data.data.approvalList.length > 0) {
          that.tableData.pageTotal = data.data.page.rowCount
          var bodyData = that.dataHandler(data.data.approvalList)

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
          {text: true,
            itemWidth: '21%',
            textData: {
              姓名: obj.userName
            }},
          {
            text: true,
            itemWidth: '23%',
            textData: {
              身份证号: obj.idCard
            }
          },
          {
            text: true,
            itemWidth: '23%',
            textData: {
              手机号: obj.phone
            }
          },
          {
            fontBtn: true, itemWidth: '23%', btnArr: [{class: '', clickType: 'edit', title: '详情'}]
          },
                        {check: true, itemWidth: '5%', checkData: false}
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
        TipBoxService.open('请选择要通过的申请项！', 2)
      } else {
        NoticeBoxService.open('确定要通过这些申请吗？', function () {
          NoticeBoxService.close()
          LoadingService.open('正在发送请求，请稍候...')
          var arr = new Array()
          console.info('data-', data)
          for (var i = 0; i < data.length; i++) {
            var obj = new Object()
            obj.enterpriseId = ''
            obj.userId = data[i].id
            arr.push(obj)
          }
                        // var param=[{enterpriseId:that.basicInfoForm.ENTERPRISE_ID,userId:that.basicInfoForm.userId}];
          var param = arr
          console.info('jfdkfjdkf=', encodeURIComponent(JSON.stringify(param)))
          HttpService.post('priviapi/enterprise/approve', 'param=' + encodeURIComponent(JSON.stringify(param)), function (data) {
            LoadingService.close()
            TipBoxService.open('通过成功!')
            that.tableData.renewNum++
          }).catch((error) => {
            LoadingService.close()
            if (error.response.data.status == '503') {
              TipBoxService.open(error.response.data.exception, 2)
            }
          })
                        /* for(var i=0;i<data.length;i++){
                            var id=data[i].ID;
                            arr.push(id);
                        }
                        var sendData={param:arr.toString(),roleId:''};
                        HttpService.get('userrole/deleteAdminUser',sendData,function (data) {
                            console.info("删除=",data);
                            LoadingService.close();
                            if(data.status==200){
                                TipBoxService.open("删除成功！",0);
                                that.tableData.renewNum++;
                            }
                            else
                            {
                                TipBoxService.open("删除失败！",1);
                            }
                        }); */
        })
      }
    },
    topNavSearchHandler (data) {
      this.tableData.departId = 'noLink'
      this.tableData.searchWord = data
    },
    searchTableDataHandler (data) {
      console.info('hhhhhhhhh=', data)
      var that = this
      HttpService.get('priviapi/enterprise/searchApprovals', data, function (data) {
        if (data.data.approvalList != null && data.data.approvalList.length > 0) {
          that.tableData.pageTotal = data.data.page.rowCount
          var bodyData = that.dataHandler(data.data.approvalList)

          that.tableData.bodyData = bodyData
        } else {
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
      LoadingService.open('正在保存，请稍候...')
      HttpService.get('priviapi/userrole/saveAdminUser', {param: dataArr.toString()}, function (data) {
        LoadingService.close()
        if (data.status == 200) {
          TipBoxService.open('保存成功！', 0)
          that.tableData.renewNum++
        } else {
          TipBoxService.open('保存失败！', 1)
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
        } else {
          this.tableData.allSelected = false
        }
      } else {
        this.tableData.allSelected = false
      }
    },
            // 表单按钮点击事件
    tableBtnClickHandler (data) {
      console.info('ffffffff=', data)
      var that = this
      if (data.tableBtnType == 'edit') {
        // var hrefStr = './auditUserDetails.html?id=' + data.id
        console.info('ffffffff=', data)
        // window.location.href = hrefStr
        this.$router.push('./auditUserDetails?id=' + data.id)
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
<style lang="css" scoped>

</style>
