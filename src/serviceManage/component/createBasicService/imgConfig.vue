<template>
    <div class="formaCon domeheig">
        <el-form ref="formc" :model="formc">
            <div class="imgclorcom">
                <div class="addLogimg" @click="chooseLogo()" v-on:input="inputFunc('formc')" v-show='!isEditShow'>
                    <input @change="handleFileChange('logo')" id="id1" type="file" />
                    <img :src="successUrl1" alt="" class="imgCss">
                    <div class="logtxet">
                        <i></i>
                        <p>服务logo上传</p>
                    </div>
                </div>                
                <div class="addBgimg" @click="chooseBg()" v-show='!isEditShow'>
                    <input @change="handleFileChange('backImg')" id="id2" type="file" />
                    <img :src="successUrl2" alt="" class="bgimgCss">
                    <label @click="chooseBg()"></label>
                    <div class="logtxet">
                        <i></i>
                        <p>服务背景图上传</p>
                    </div>
                </div>
                <div class="logimg" v-show='isEditShow'>
                    <img :src="successUrl1" alt="" class="logoImgCss">
                    <p>logo</p>
                </div>
                <div class="bBgimg" v-show='isEditShow'>
                    <img :src="successUrl2" alt="" class="bgImgCss">
                    <p>背景图</p>
                </div>
                <div class="flixtie"  v-show='!isEditShow'>
                    <p> Logo建议大小 200*200，大小不超过20k；</p>
                    <p> 背景图建议大小700*350，大小不超过50k。</p>
                    <p> 支持所有图片格式。</p>
                </div>
            </div>
            <el-form-item class="but-alin"  v-show='!isEditShow'>
                <el-button type="primary" @click="submitForm()">保存</el-button>
                <el-button v-show="!isNew" @click="resetForm()">取消</el-button>
            </el-form-item>
        </el-form>
        <el-dialog title="选择Logo" :visible.sync="chooseLogoShow">
            <div class="checkPicture">
                <label class="checkBtn" for="id1">选择图片</label>
                <span>Logo建议大小200*200，大小不超过20k，支持所有图片格式。</span>
            </div>
            <div class="clear">
                <ul>
                    <li :class="{checkActive:img.logoIsActive}" @click="chooseLogoImg(index)" v-for="(img,index) in imgArr" :key="index">
                        <!-- <i class="icon iconfont icon-shanchu2 deleteBtn"></i> -->
                        <img class="userImg" :src="img.imgPath"></img>
                    </li>
                </ul>
            </div>
            <div slot="footer" class="dialog-footer">
                <button @click="confirmLogoUpdate()" class="confirmBtn">确 认</button>
                <button @click="resetLogoUpdate()" class="resetBtn">取 消</button>
            </div>
        </el-dialog>

        <!-- 背景图 -->
        <el-dialog title="选择背景图" :visible.sync="chooseBgShow">
            <div class="checkPicture">
                <label class="checkBtn" for="id2">选择图片</label>
                <span>背景图建议大小700*350，大小不超过50k，支持所有图片格式。</span>
            </div>
            <div class="clear">
                <ul>
                    <li :class="{checkActive:img.bgIsActive}" @click="chooseBgImg(index)" v-for="(img,index) in imgArr" :key="index">
                        <!-- <i class="icon iconfont icon-shanchu2 deleteBtn"></i> -->
                        <img class="userImg" :src="img.imgPath"></img>
                    </li>
                </ul>
            </div>
            <div slot="footer" class="dialog-footer">
                <button @click="confirmBgUpdate()" class="confirmBtn">确 认</button>
                <button @click="resetBgUpdate()" class="resetBtn">取 消</button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import apiClient from '../../../publicJs/ApiClient.js'
import TipBoxService from '../common/TipBoxService.js'
export default {
  name: '',
  props: {
    isEdit: false,
    msgImg: {},
    isChide: {}
  },
  watch: {
    isEdit: function (nv, ov) {
      this.isEditShow = this.msgImg.isEditShow // 是否编辑
      if (nv) {
        if (this.msgImg.isEditShow) {
          this.echoImg(this.msgImg)
        }
        console.log('这是图片组件内监听到的变化=', this.msgImg)
        if (this.msgImg.img != undefined && this.msgImg.img != '') {
          this.successUrl1 = apiClient.apiBaseUrl + '/itsmApi/attachment/show?imgPath=' + this.msgImg.img
        }
        if (this.msgImg.bg_img != undefined && this.msgImg.bg_img != '') {
          this.successUrl2 = apiClient.apiBaseUrl + '/itsmApi/attachment/show?imgPath=' + this.msgImg.bg_img
        }
      } else {
        this.isNew = false
      }
    },
    isChide (newValue, oldValue) {
      this.id = newValue
      console.info('dfdfdfdf=', this.msgImg)
    }
  },
  data () {
    return {
      formc: {},
      id: this.isChide,
      chooseBgShow: false, // 图片上传弹出层控制
      chooseLogoShow: false, // 控制logo弹窗口的显示隐藏
      file: '',
      successUrl1: '',
      successUrl2: '',
      imgArr: [], // 图片列表
      hideFlag2: false,
      bg_img: '', // ”背景图片”,
      img: '', // ” logo”,
      isEditShow: false,
      old_img: '',
      old_bg_img: '',
      isNew: true
    }
  },
  created () {
    this.immgdefault()
  },
  methods: {
    chooseLogo () {
      this.chooseLogoShow = true
    },
    // 获取上传图片默认
    immgdefault () {
      for (var i = 1; i <= 15; i++) {
        var obj = {
          imgName: 'default_logo_' + i + '.jpg',
          logoIsActive: false,
          bgIsActive: false,
          imgPath:
            apiClient.apiBaseUrl +
            '/itsmApi/attachment/show?imgPath=default_logo_' +
            i +
            '.jpg&token=' +
            apiClient.token
        }
        this.imgArr.push(obj)
      }
    },
    // 上传图片
    handleFileChange (name) {
      var that = this
      this.file = event.currentTarget.files[0]
      if (name === 'logo') {
        if (this.file.size / 1024 > 20) {
          TipBoxService.open('图片需小于20KB', 2)
          return
        }
      } else if (name === 'backImg') {
        if (this.file.size / 1024 > 50) {
          TipBoxService.open('图片需小于50KB', 2)
          return
        }
      }
      let param = name === 'logo' ? 'logo' : 'bg'
      apiClient
        .upload('itsmApi/attachment/upload?imgType=' + param, this.file, '')
        .then(data => {
          if (data.status === 'success') {
            TipBoxService.open('上传成功！', 0)
            if (name === 'logo') {
              $('#id1').val('')
              that.successUrl1 =
              apiClient.apiBaseUrl +
              '/itsmApi/attachment/show?imgPath=' +
              data.fileName +
              '&token=' +
              apiClient.token
              that.img = data.fileName
              that.hideFlag1 = true
              that.chooseLogoShow = false
              for (var i = 0; i < that.imgArr.length; i++) {
                that.imgArr[i].logoIsActive = false
              }
            } else {
              $('#id2').val('')
              that.successUrl2 =
              apiClient.apiBaseUrl +
              '/itsmApi/attachment/show?imgPath=' +
              data.fileName +
              '&token=' +
              apiClient.token
              that.bg_img = data.fileName
              that.hideFlag2 = true
              that.chooseBgShow = false
              for (var i = 0; i < that.imgArr.length; i++) {
                that.imgArr[i].bgIsActive = false
              }
            }
          } else {
            TipBoxService.open(data.info, 1)
          }
        })
    },
    // 关闭图片
    chooseBg () {
      this.chooseBgShow = true
    },
    confirmBgUpdate () {
      this.hideFlag2 = true
      this.chooseBgShow = false
      this.successUrl2 =
        apiClient.apiBaseUrl +
        '/itsmApi/attachment/show?imgPath=' +
        this.bg_img +
        '&token=' +
        apiClient.token
    },
    resetBgUpdate () {
      if (this.successUrl2 == '') {
        this.hideFlag2 = false
      }
      // for (var i = 0; i < 15; i++) {
      //   this.imgArr[i].bgIsActive = false
      // }
      this.chooseBgShow = false
      this.bg_img = ''
    },
    resetLogoUpdate () {
      if (this.successUrl1 == '') {
        this.hideFlag1 = false
      }
      // for (var i = 0; i < 15; i++) {
      //   this.imgArr[i].logoIsActive = false
      // }
      this.chooseLogoShow = false
      this.img = ''
    },
    confirmLogoUpdate () {
      this.hideFlag1 = true
      this.chooseLogoShow = false
      this.successUrl1 =
        apiClient.apiBaseUrl +
        '/itsmApi/attachment/show?imgPath=' +
        this.img +
        '&token=' +
        apiClient.token
    },
    chooseBgImg (e) {
      for (var i = 0; i < 15; i++) {
        this.imgArr[i].bgIsActive = false
      }
      this.imgArr[e].bgIsActive = true
      this.bg_img = this.imgArr[e].imgName
    },
    chooseLogoImg (e) {
      for (var i = 0; i < 15; i++) {
        this.imgArr[i].logoIsActive = false
      }
      this.imgArr[e].logoIsActive = true
      this.img = this.imgArr[e].imgName
    },
    // 保存
    submitForm () {
      // 将图片名称保存到es
      let that = this
      let id = this.id
      if (this.img == '') {
        this.img = 'logo-sm-default.jpg'
        this.successUrl1 = apiClient.apiBaseUrl + '/itsmApi/attachment/show?imgPath=logo-sm-default.jpg'
      }
      if (this.bg_img == '') {
        this.bg_img = 'logo-sm-default.jpg'
        this.successUrl2 = apiClient.apiBaseUrl + '/itsmApi/attachment/show?imgPath=logo-sm-default.jpg'
      }
      let myData = {
        operate_page: '3',
        img: this.img,
        bg_img: this.bg_img,
        id: id
      }

      apiClient.post('itsmApi/createService/updateAtomicInfo', myData, function (
        data
      ) {
        console.log('保存图片名称=', data)
        let obj = {
          isEditShow: true,
          isSubmit: true,
          img: that.img,
          bg_img: that.bg_img
        }
        that.$emit('submint', obj)
        that.isEditShow = true
      })
    },
    resetForm () {
      // 取消
      this.img = this.old_img
      this.bg_img = this.old_bg_img
      this.successUrl1 = apiClient.apiBaseUrl + '/itsmApi/attachment/show?imgPath=' + this.old_img
      this.successUrl2 = apiClient.apiBaseUrl + '/itsmApi/attachment/show?imgPath=' + this.old_bg_img
      let obj = {
        isEditShow: true,
        isSubmit: true
      }
      this.$emit('submint', obj)
    },
    echoImg (imgObj) {
      // 回显
      if (imgObj.img != undefined && imgObj.img != '') {
        // logo
        this.successUrl1 =
          apiClient.apiBaseUrl +
          '/itsmApi/attachment/show?imgPath=' +
          imgObj.img
        this.img = imgObj.img
        this.old_img = imgObj.img
      }
      if (imgObj.bg_img != undefined && imgObj.bg_img != '') {
        // 背景图片
        this.successUrl2 =
          apiClient.apiBaseUrl +
          '/itsmApi/attachment/show?imgPath=' +
          imgObj.bg_img
        this.bg_img = imgObj.bg_img
        this.old_bg_img = imgObj.bg_img
      }
    }
  }
}
</script>
<style src="../../css/common/public.css" scoped></style>
<style src="../../css/createBasicService/newServiceCom.css" scoped></style>
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
.logimg p,
.bBgimg p {
  padding-top: 5px;
  text-align: center;
  font-size: 14px;
  color: #666;
}
.bBgimg {
  float: left;
  width: 300px;
  border-radius: 3px;
  position: relative;
  margin-left: 40px;
}
.bgImgCss {
  width: 298px;
  height: 148px;
  border-radius: 3px;
}
</style>
