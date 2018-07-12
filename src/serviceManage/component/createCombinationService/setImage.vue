<template>
  <div class="formaCon domeheig img-config">
    <el-form ref="formc">
      <div class="imgclorcom">
        <!-- ever -->
        <div class="addLogimg" @click="openDialog('logo')" v-show='isEdit'>
          <img v-if='imgDataTemp.img!="logo-sm-default.jpg"' :src="apiBaseUrl +'/itsmApi/attachment/show?imgPath='+imgDataTemp.img" alt="" class="imgCss">
          <img v-if='imgDataTemp.img=="logo-sm-default.jpg"' src="../../images/logo-sm-default.jpg" alt="" class="imgCss">
          <div class="logtxet">
            <i></i>
            <p>服务logo上传</p>
          </div>
        </div>
        <div class="addBgimg" @click="openDialog('bg')" v-show='isEdit'>
          <img v-if='imgDataTemp.bg_img!="logo-sm-default.jpg"' :src="apiBaseUrl +'/itsmApi/attachment/show?imgPath='+imgDataTemp.bg_img" alt="" class="bgimgCss">
          <img v-if='imgDataTemp.bg_img=="logo-sm-default.jpg"' src="../../images/logo-sm-default.jpg" alt="" class="bgimgCss">
          <label @click="chooseBg()"></label>
          <div class="logtxet">
            <i></i>
            <p>服务背景图上传</p>
          </div>
        </div>
        <div class="flixtie" v-show='isEdit'>
          <p>Logo建议分辨率200*200，大小不可超过20K；</p>
          <p>背景图建议分辨率700*350，大小不可超过50K。</p>
          <p>支持所有图片格式。</p>
        </div>
        <!-- ever -->

        <!-- over -->
        <div class="logimg" v-show='!isEdit'>
          <img v-if='imgData.img.length && imgData.img!="logo-sm-default.jpg"' :src="apiBaseUrl +'/itsmApi/attachment/show?imgPath='+imgData.img" alt="" class="logoImgCss">
          <img v-if='imgData.img=="logo-sm-default.jpg" || !imgData.img.length' src="../../images/logo-sm-default.jpg" alt="" class="logoImgCss">
          <p>logo</p>
        </div>
        <div class="bBgimg" v-show='!isEdit'>
          <img v-if=' imgData.bg_img.length && imgData.bg_img!="logo-sm-default.jpg"' :src="apiBaseUrl +'/itsmApi/attachment/show?imgPath='+imgData.bg_img" alt="" class="bgImgCss">
          <img v-if='imgData.bg_img=="logo-sm-default.jpg" || !imgData.bg_img.length' src="../../images/logo-sm-default.jpg" alt="" class="bgImgCss">
          <p>背景图</p>
        </div>
        <!-- over -->
      </div>
      <el-form-item class="but-alin" v-show='isEdit'>
        <el-button type="primary" @click="save()">保存</el-button>
        <el-button v-show='!isNew' @click="cancel()">取消</el-button>
      </el-form-item>
    </el-form>

    <!-- 选择图片 -->
    <el-dialog :title='imgType === "logo" ? "选择Logo" : "选择背景图"' :visible.sync="isDialogShow">
      <div class="checkPicture">
        <input @change="upload" id="setImg" type="file" />
        <label class="checkBtn" for="setImg">选择图片</label>
        <span>建议图片分辨率200*200，Logo大小不可超过20K，背景图大小不可超过50K，支持所有图片格式。</span>
      </div>
      <div class="clear">
        <ul>
          <li v-for="(img,index) in imgArr"
              :key="index"
              :class="{checkActive:img.isActive}" 
              @click="chooseImg(index)">
            <i class="icon iconfont icon-selected"></i>
            <img class="userImg" :src="img.imgPath"></img>
          </li>
        </ul>
      </div>
      <div slot="footer" class="dialog-footer">
        <button @click="dialogBtn(true)" class="confirmBtn">确 认</button>
        <button @click="dialogBtn(false)" class="resetBtn">取 消</button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import $ from 'jquery'
import apiClient from '../../../publicJs/ApiClient.js'
import LoadingBoxService from '../../../publicJs/LoadingBoxService.js'
import TipBoxService from '../common/TipBoxService.js'
export default {
  props: {
    isEdit: false,
    serviceId: {},
    msg: {}
  },
  watch: {
    isEdit: function (nv, ov) {
      this.id = this.serviceId
      if (nv) {
        // this.imgDataTemp = Object.assign({}, this.msg);
        this.imgDataTemp.img = this.msg.img || ''
        this.imgDataTemp.bg_img = this.msg.bg_img || ''
        if (this.imgDataTemp.img.length || this.imgDataTemp.bg_img.length) {
          this.isNew = false
        }
      } else {
        this.imgData = Object.assign({}, this.msg)
      }
    }
  },
  data () {
    return {
      token: apiClient.token,
      apiBaseUrl: apiClient.apiBaseUrl,
      isNew: true,
      id: '',
      imgData: {
        img: '',
        bg_img: ''
      },
      imgDataTemp: {
        img: '',
        bg_img: ''
      },
      isDialogShow: false, // 图片上传弹出层控制
      imgArr: [], // 图片列表
      imgType: '',
      imgChoose: ''
    }
  },
  created () {
    this.getImgdefault()
  },
  methods: {
    // 获取默认图片
    getImgdefault () {
      for (var i = 1; i <= 15; i++) {
        let imgPath = this.apiBaseUrl + '/itsmApi/attachment/show?imgPath=default_logo_' + i + '.jpg'
        var obj = {
          imgName: 'default_logo_' + i + '.jpg',
          isActive: false,
          imgPath: imgPath
        }
        this.imgArr.push(obj)
      }
    },
    // 打开弹窗
    openDialog (type) {
      this.imgType = type
      this.isDialogShow = true
    },
    // 选择图片
    chooseImg (index) {
      for (var i = 0; i < 15; i++) {
        this.imgArr[i].isActive = false
      }
      this.imgArr[index].isActive = true
      this.imgChoose = this.imgArr[index].imgName
    },
    // 上传图片
    upload () {
      let vm = this
      let uploadImg = event.currentTarget.files[0]
      vm.imgChoose = this.imgType === 'logo' ? vm.imgDataTemp.img : vm.imgDataTemp.bg_img
      console.log(vm.imgType)
      apiClient
        .upload('itsmApi/attachment/upload?imgType=' + vm.imgType, uploadImg, '')
        .then(data => {
          $('#setImg').val('')
          console.log(data)
          if (data.status === 'success') {
            TipBoxService.open('上传成功！', 0)
            vm.imgChoose = data.fileName
            vm.dialogBtn(true)
          } else {
            TipBoxService.open(data.info, 1)
          }
        })
    },
    // 弹窗按钮事件
    dialogBtn (flag) {
      this.isDialogShow = false
      this.imgArr.forEach(function (v, i) {
        v.isActive = false
      })
      if (flag) {
        if (this.imgType === 'logo') {
          this.imgDataTemp.img = this.imgChoose
        } else {
          this.imgDataTemp.bg_img = this.imgChoose
        }
      }
    },
    // 保存
    save () {
      let vm = this
      let logoTip = this.imgDataTemp.img.length ? '' : '服务LOGO'
      let bgTip = this.imgDataTemp.bg_img.length ? '' : '服务背景'
      if (logoTip.length || bgTip.length) {
        let imgTip = logoTip.length && bgTip.length ? logoTip + '和' + bgTip : logoTip || bgTip
        imgTip += '图片尚未设置，此时保存将会设置为默认图片，是否确定继续？'
        vm.$confirm(imgTip, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          vm.imgDataTemp.img = logoTip.length ? 'logo-sm-default.jpg' : vm.imgDataTemp.img
          vm.imgDataTemp.bg_img = bgTip.length ? 'logo-sm-default.jpg' : vm.imgDataTemp.bg_img
          vm.saveAction()
        })
      } else {
        vm.saveAction()
      }
    },
    // 保存
    saveAction () {
      let vm = this
      let url = 'itsmApi/createService/operateCombinationService'

      let myData = {
        operate_page: '4',
        img: vm.imgDataTemp.img,
        bg_img: vm.imgDataTemp.bg_img,
        id: vm.id
      }
      // debugger
      LoadingBoxService.open('正在保存，请稍候...')
      apiClient.post(url, myData, function (data) {
        LoadingBoxService.close()
        if (data.status === 200) {
          let item = {
            img: vm.imgDataTemp.img || '',
            bg_img: vm.imgDataTemp.bg_img || ''
          }
          vm.$emit('submit', true, 1, item)
        } else {
          TipBoxService.open(data.exception, 2)
        }
      })
    },
    // 取消
    cancel () {
      this.$emit('submit', false, 1)
    }
  }
}
</script>
<style src="../../css/common/public.css" scoped></style>
<style src="../../css/createCombinationServeice/newComStyle.css" scoped></style>
<style>
.img-config .el-dialog__header {
  padding: 15px 15px 10px 15px;
}
</style>
<style scoped>
.logimg {
  width: 150px;
  border-radius: 3px;
  position: relative;
  float: left;
}
.logoImgCss {
  width: 148px;
  height: 148px;
  border-radius: 3px;
}
.bBgimg {
  float: left;
  width: 300px;
  border-radius: 3px;
  position: relative;
  margin-left: 40px;
}
.logimg p,
.bBgimg p {
  padding-top: 5px;
  text-align: center;
  font-size: 14px;
  color: #666;
}
.logoImgCss {
  width: 148px;
  height: 148px;
  border-radius: 3px;
}
.bgImgCss {
  width: 298px;
  height: 148px;
  border-radius: 3px;
}
</style>
