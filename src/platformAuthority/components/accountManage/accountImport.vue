<template>
  <div id="platformAuthority">
    <div class="publicWidthHeightContainer">
      <div class="commonRightBottoTopContainer">
        <right-top-nav :links="topNavData.breadLinks" :searchname="topNavData.searchTitle" :searchword="topNavData.searchWord" v-on:search="topNavSearchHandler"></right-top-nav>
      </div>
      <div class="commonRightBottoBottomContainer">
        <div class="publicWidthHeightContainer" style="height:100%">
          <!--上传-->
          <div class="imporCon">
            <div class="boxImpor">
              <div class="ImporTexe">
                <p>1.导入前请先下载导入模板
                  <span class="cklcp" @click="accImport">下载模版</span>
                </p>
                <p>2.根据模板中的字段进行填写，其中姓名和手机号为必填项</p>
                <p>3.账号导入后默认密码为123456，请及时通过短信功能或其它方式通知用户修改。</p>
                <p>4.上传后平台会对上传信息格式进行审核，请按照表格要求进行填写</p>
              </div>
              <div class="flisecon">

                <input type="file" id="uploadFile" class="flieCss" />
                <button @click="saveFilePath" class="buCss">上传</button>

              </div>
              <div class="accountRoleBtn">
                <el-button class="buCsslv" @click="saveBasicInfo" style="position:absolute;left:calc(50% - 85px);bottom:10px">导入</el-button>
              </div>
            </div>
          </div>
          <!--上传-->
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
import env from '../../../../config/envConfig'
import publicPath from '../../../publicJs/publicPathConfig'
import '../../css/accountImport.css'
export default {
  name: 'accountImport',
  data () {
    return {
      menuName: '用户管理',
      topNavData: {
        breadLinks: [{name: '用户管理', link: '#'}, {name: '导入账户', link: '#'}],
        searchTitle: '姓名/电话号',
        searchWord: ''
      },
      leftNavData: [],
      publicTopNavData: [],
      fileName: '',
      fileList: []
    }
  },
  components: {
    'right-top-nav': rightTopNav,
    'my-component': commonTable,
    'btn-control': commonBtn
  },
  mounted () {
    var word = this.$route.query.word
    if (word != null) {
      this.topNavData.searchWord = word
      this.tableData.departId = 'noLink'
      this.tableData.searchWord = word
    }
  },
  methods: {
    topNavSearchHandler (data) {
      console.info('search=', data)
      this.tableData.departId = 'noLink'
      this.tableData.searchWord = data
    },

    linkChangeHandler (link) {
      console.info('link=', link)
      publicNavData.gotoLeftNavLink(link.link)
    },
            // 下载模版
    accImport () {
      window.open(env.API_SERVER + 'account/download?param=批量上传模板.xlsx')
    },
            // 上传
    saveFilePath () {
      var file = uploadFile.files[0]
      var that = this
      if (file) {
        var filePath = uploadFile.files[0].name

        if (!/\.(xlsx)$/.test(filePath)) {
          TipBoxService.open('只能上传xlsx文件', 2)
          return false
        }

        HttpService.upload('account/uploadExcel', file, function (data) {
          console.info('dasdsada', data)
          LoadingService.close()

          if (data.status == 'success' || file.value != '') {
            TipBoxService.open('上传成功！', 0)
            that.fileName = data.headExcel
          } else {
            TipBoxService.open('上传失败！', 1)
          }
        })
      }
    },
            // 点导入跳转带名字过去
    saveBasicInfo () {
      var that = this
      if (that.fileName != '') {
        // window.location.href = 'accountImportList.html?name=' + that.fileName
        that.$router.push('/accountImportList?name=' + that.fileName)
      } else {
        TipBoxService.open('请选择文件上传', 2)
      }
    },
    gotoAppMarketHanlder () {
      window.location.href = publicPath.APP_MARKET
    }

  }
}
</script>
<style lang="css" scoped>
.accountRoleBtn .buCsslv {
  width:170px;
	height: 30px;
	background: #26d186;
	border-radius: 3px;
	color: #fff;
	cursor: pointer;
	text-align: center;
	padding: 0;
}
</style>
