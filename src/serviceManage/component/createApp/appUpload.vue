<template>
  <div class="formaCon appUpload"  >
      <el-form>
        <div class="appUploadArea" v-show="!rulesaShow">
            <div class="uploadBotton">
                <span class="uploadTip" v-show="old_archiver_name!=''">{{archiver_real_name}}</span>
            </div>
            <div class="uploadBtnBox" :class="old_archiver_name==''?'':'red'">
                <i class="icon iconfont icon-daochu"></i>
                <input @change="appUpload()" id="id1" class="uploadInput" type="file">
                <label  for="id1" class="uploadBtn">{{old_archiver_name==''?"上传文件":"重新上传"}}</label>
                <!-- <label>{{data.archiver_real_name || archiver_real_name}}</label> -->
            </div>
            <div class="uploadTipBox">
                <span class="uploadTip" v-show="old_archiver_name==''">支持war格式压缩文件(文件最大不超过200M)</span>
            </div>
        </div>
        <el-form-item v-show="rulesaShow" label="应用文件：" class="app-upload-creat">
        <el-col class="stylefont">
          {{archiver_real_name?archiver_real_name+"("+archiver_size+"MB"+")":"无"}}
        </el-col>
      </el-form-item>
        <el-form-item class="but-alin uploadBtnArea" v-show="!rulesaShow">
            <el-button class="serviceBtn" type="primary" @click="submitForm('forma')">保存</el-button>
            <el-button class="serviceBtn" @click="resetForm()">取消</el-button>
        </el-form-item>
      </el-form>
  </div>
</template>
<script>
    import apiClient from '../../../publicJs/ApiClient.js'
    import TipBoxService from '../common/TipBoxService.js'
    import LoadingBoxService from '../../../publicJs/LoadingBoxService.js'
    import $ from 'jquery'
    export default {
      name: 'appUpload',
      props: {
        isEdit: false,
        appId: {},
        msg: {}
      },
      data () {
        return {
          id: '',
          forma: {},
          data: {},
          isNew: true,
          old_archiver_name: '',
          successUrl: '',
          archiver_name: '',
          archiver_real_name: '',
          archiver_size: '',
          rulesaShow: false
        }
      },
      watch: {
        isEdit: function (nv, ov) {
          this.rulesaShow = !nv // 是否编辑
          this.isNew = !this.appId // 判断是新建还是编辑
          this.id = this.appId || ''
          if (nv) {
            this.forma = Object.assign({}, this.msg)
            this.old_archiver_name = this.forma.archiver_real_name
          } else {
            this.data = Object.assign({}, this.msg)
            this.archiver_real_name = this.data.archiver_real_name
            this.archiver_size = this.data.archiver_size
            this.old_archiver_name = ''
          }
          if (this.old_archiver_name === undefined) {
            this.old_archiver_name = ''
          }
        }
      },
      mounted () {

      },
      methods: {
        appUpload () {
          let that = this
          let url = '/itsmApi/appAttachment/upload2'
          this.file = event.currentTarget.files[0]
          let fileType = this.file.name.substring(this.file.name.lastIndexOf('.') + 1, this.file.name.length)
          if (fileType === 'war' || fileType === 'jar') {
          } else {
            TipBoxService.open('请上传格式正确的文件', 2)
            return
          }
          if (this.file.size / 1024 / 1024 > 200) {
            TipBoxService.open('文件需小于200MB', 2)
            return
          }
          LoadingBoxService.open('正在上传，请稍候...')
          apiClient.upload(url, this.file, '').then(data => {
            LoadingBoxService.close()
            that.archiver_name = data.archiver_name
            that.archiver_size = data.archiver_size
            that.archiver_real_name = data.archiver_real_name
            $('#id1').val('')
            this.old_archiver_name = this.archiver_name
            // that.successUrl = apiClient.apiBaseUrl + '/itsmApi/attachment/show?imgPath=' + data.fileName + '&token=' + apiClient.token
          }).catch(error => {
            LoadingBoxService.close()
            if (error.response.data.status == 503) {
              TipBoxService.open(error.response.data.exception, 2)
            }
            throw error
          })
        },
        submitForm (formaName) {
          console.log(this.appId)
          let that = this
          let myData = {
            operate_page: '2',
            id: that.appId,
            docker_port: '8080',
            old_archiver_name: that.old_archiver_name,
            archiver_name: that.archiver_name,
            archiver_real_name: that.archiver_real_name,
            archiver_size: that.archiver_size.toString()
          }
          if (myData.archiver_size.length === 0) {
            TipBoxService.open('请先上传文件', 2)
            return
          }
          LoadingBoxService.open('正在保存，请稍候...')
          apiClient.post('/itsmApi/application/operateApp', myData, function (data) {
            LoadingBoxService.close()
            console.log('war包名称=', data)
            let obj = {
              app_id: that.appId,
              archiver_name: that.archiver_name,
              archiver_real_name: that.archiver_real_name,
              archiver_size: that.archiver_size
            }
            if (data.status == '200') {
              that.rulesaShow = true
              that.$emit('submit', true, obj, 1)
            } else {
              TipBoxService.open(data.exception, 2)
            }
          })
        },
        resetForm () {
          let that = this
          let myData = {
            archiver_name: that.archiver_name
          }
          if (this.isEdit) {
            this.rulesaShow = true
            this.$emit('cancel')
            return
          }
          if (myData.archiver_name.length === 0) {
            TipBoxService.open('请先上传文件', 2)
            return
          }
          apiClient.post('/itsmApi/application/delWar', myData, function (data) {
            if (data.results.exec_result === 'true') {
              that.archiver_name = ''
              that.archiver_real_name = ''
              that.archiver_size = ''
            }
          })
        }
      }
    }
</script>
<style>
.app-upload-creat .stylefont{
  color: #55a8fd;
}
.app-upload-creat label{
  width: 120px;
}
.app-upload-creat .el-form-item__content{
  margin-left: 120px;
}
</style>

<style scoped>

    .uploadBtnArea {
        text-align: center;
    }
    .appUpload{
        padding-bottom: 100px;
    }
    .appUploadArea{
        width: 490px;
        height: 150px;
        border: 1px solid #cbcbcb;
        margin: 20px auto;
        position: relative;
    }
    .uploadBtnBox{
        position: absolute;
        width: 80px;
        height: 30px;
        border: 1px solid #74a6fa;
        color: #74a6fa;
        border-radius: 3px;
        line-height: 30px;
        text-align: center;
        left: 50%;
        top: 45%;
        transform:translate(-50%,-50%);
    }
    .uploadBtnBox.red{
       border: 1px solid #d9425b;
        color:#d9425b;
        top: 70%;
    }
    .uploadBtn{
        cursor: pointer;
    }
    .uploadTipBox{
        position: absolute;
        left: 50%;
        top: 70%;
        transform:translate(-50%,-50%);
    }
    .uploadBotton{
      position: absolute;
        left: 50%;
        top: 35%;
        transform:translate(-50%,-50%);
    }
    .uploadBotton .uploadTip{
      color:#74a6fa;
    }
    .uploadTip{
        color: #666666;
    }
    .uploadInput{
        position: absolute;
        left: -9999px;
    }
</style>

