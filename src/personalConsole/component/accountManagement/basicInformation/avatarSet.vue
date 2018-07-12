<template>
  <div class="shade" v-show="show">
    <div>
      <div class="changepicTop">头像设置
        <i class="iconfont icon-guanbi" @click="close"></i>
      </div>
      <div class="changepicContentBox">
        <div class="changepicNav">
          <span :class="{active: type === 'customize'}" @click="showCustomize">自定义头像</span>
          <span :class="{active: type === 'hot'}" @click="type = 'hot';uploadFlag = false">热门推荐头像</span>
        </div>
        <div class="changepicContent">
          <div class="changepicContentLeft">
            <div v-show="!showCrop && type === 'customize'" class="customizePic">
              <div>方法一：选择本地照片，上传编辑自己的头像</div>
              <div class="upload">
                <a><input ref="image" :accept="MIMEtype" name="image" @change="setImage" type="file" title=" ">选择图片</a>
                <span class="tip">支持jpg、jepg、gif、bmp格式的图片</span>
              </div>
              <div style="margin-bottom: 20px">方法二：选择推荐头像，快速上传优质头像</div>
              <span v-for="(item,index) in 5" :key="index" class="hotImg" @click="changeDefaultImg(index)" :class="{active:activeNum === index}">
                <img :src="defaultImgUrl +'avatar' + index + '.jpg&token=' + token" alt="">
                <i v-show="activeNum === index" class="iconfont icon-duigou"></i>
              </span>
              <span class="hotImg" @click="type = 'hot'">
                更多>
              </span>
            </div>
            <div v-show="showCrop && type === 'customize'">
              <vue-cropper ref='cropper' :guides='true' :view-mode='2' drag-mode="move" :auto-crop-area='0.5' :min-container-width='250' :min-container-height='180' :background='true' :rotatable='true' :src='imgSrc' alt="Source Image" :img-style="{ width: '400px', height: '250px' }" :aspectRatio='1' :cropend="cropImage" :ready="cropImage">
              </vue-cropper>
              <div class="upload" style="text-align:center">
                <a><input name="image" :accept="MIMEtype" @change="setImage" type="file" title=" ">重新选择</a>
              </div>
            </div>
            <div v-show="type === 'hot'" class="hotPic">
              <span v-for="(item,index) in 10" @click="changeDefaultImg(index)" :class="{active:activeNum === index}" :key="index" class="hotImg">
                <img :src="defaultImgUrl +'avatar' + index + '.jpg&token=' + token" alt="">
                <i v-show="activeNum === index" class="iconfont icon-duigou"></i>
              </span>
            </div>
          </div>
          <div class="changepicContentRight">
            <div class="title">头像预览</div>
            <img class="bigImg" :src="cropImg" alt="">
            <p>70px * 70px</p>
            <img class="smallImg" :src="cropImg" alt="">
            <p>30px * 30px</p>
            <!-- <div class="title">我使用过的头像</div>
            <span :key="index" class="hotImg" style="width:40px;height:40px;margin-right:7px">
              <img src="../../../images/pic1.jpg" alt="">
            </span> -->
            </span>
          </div>
        </div>
      </div>
      <div class="changepicBottom">
        <button class="savepic" @click="changeImage">确认</button>
        <button class="cancelpic" @click="close">取消</button>
      </div>
    </div>
  </div>
</template>
<script>
import VueCropper from 'vue-cropperjs'
import ApiClient from '../../../../publicJs/ApiClient.js'
import TipBoxService from '../../../../publicJs/TipBoxService.js'
import LoadingBoxService from '../../../../publicJs/LoadingBoxService.js'
export default {
  name: 'avatarSet',
  props: {
    show: Boolean,
    userImg: String
  },
  components: {
    'vue-cropper': VueCropper
  },
  watch: {
    userImg (val) {
      this.cropImg = this.userImg
    }
  },
  mounted () {
    this.defaultImgUrl = ApiClient.apiBaseUrl + '/pcapi/enterprise/pcShowImage/avatar?imgPath='
    this.token = ApiClient.token
  },
  data () {
    return {
      showCrop: false,
      imgSrc: '',
      cropImg: '',
      type: 'customize',
      imagefile: '',
      defaultImgUrl: '',
      activeNum: -1,     // 默认头像编号
      uploadFlag: false, // 使用上传图片做头像
      MIMEtype: 'image/gif,image/jpeg,image/bmp',
      userImgName: '',
      token: ''
    }
  },
  methods: {
    close () {
      this.showCustomize()
      this.$emit('close')
    },
    // 切到自定义页面触发
    showCustomize () {
      this.type = 'customize'
      this.showCrop = false
      this.cropImg = this.userImg
      this.$refs.image.value = ''
      this.activeNum = -1
      this.uploadFlag = false
      this.userImgName = ''
    },
    changeDefaultImg (index) {
      this.activeNum = index
      this.cropImg = this.defaultImgUrl + 'avatar' + index + '.jpg&token=' + ApiClient.token
      this.userImgName = 'avatar' + index + '.jpg'
    },
    // 设置图片
    setImage (e) {
      const file = e.target.files[0]
      console.log(file)
      var MIMETYPE = this.MIMEtype.split(',')
      var typeflag = false
      for (var i = 0; i < MIMETYPE.length; i++) {
        if (file.type === MIMETYPE[i]) {
          typeflag = true
          break
        }
      }
      if (!typeflag) {
        alert('请选择支持的图片格式')
        return
      }
      if (file.size / 1024 / 1024 >= 2) {
        alert('请选择2M以下的图片文件')
        return
      }
      this.uploadFlag = true
      this.showCrop = true
      if (typeof FileReader === 'function') {
        const reader = new FileReader()

        reader.onload = (event) => {
          this.imgSrc = event.target.result
              // rebuild cropperjs with the updated source
          this.$refs.cropper.replace(event.target.result)
        }

        reader.readAsDataURL(file)
      } else {
        alert('Sorry, FileReader API not supported')
      }
    },
    // 截图
    cropImage () {
      // get image data for post processing, e.g. upload or setting image src
      this.cropImg = this.$refs.cropper.getCroppedCanvas().toDataURL()
    },
    // base64转二进制
    dataURLtoBlob (dataurl) {
      var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      return new Blob([u8arr], {type: mime})
    },
    // 上传图片
    uploadImage () {
      var imgFile = this.dataURLtoBlob(this.cropImg)
      LoadingBoxService.open('上传图片中...')
      ApiClient.uploadWithName('pcapi/enterprise/pcUploadImage/avatar', imgFile, 'avatar.png', {}).then(data => {
        console.log('data', data)
        LoadingBoxService.close()
        if (data.status) {
          this.cropImg = ApiClient.apiBaseUrl + '/pcapi/enterprise/pcShowImage/avatar?imgPath=' + data.fileName + '&token=' + ApiClient.token
          this.userImgName = data.fileName
          this.$emit('changeImg', this.cropImg)
          ApiClient.post('pcapi/userInfo/changeImage?imageName=' + this.userImgName, {}).then((data) => {
            TipBoxService.open('图片保存成功', null, 1)
            console.log('changeImage', data)
          }).catch((error) => {
            console.log(error)
            TipBoxService.open('图片上传失败', 2, 1)
            this.showCustomize()
            return
          })
          this.close()
        } else {
          TipBoxService.open('图片上传失败', 2, 1)
          this.showCustomize()
        }
      }).catch(data => {
        LoadingBoxService.close()
        console.log('catch', data)
      })
    },
    changeImage () {
      if (this.uploadFlag) {
        this.uploadImage()
        return
      }
      if (!this.userImgName) {
        TipBoxService.open('请选择您喜欢的图片', 2, 1)
        return
      }
      LoadingBoxService.open('图片保存中...')
      this.$emit('changeImg', this.cropImg)
      ApiClient.post('pcapi/userInfo/changeImage?imageName=' + this.userImgName, {}).then((data) => {
        LoadingBoxService.close()
        TipBoxService.open('图片保存成功', null, 1)
        console.log('changeImage', data)
      }).catch(err => {
        LoadingBoxService.close()
        console.log(err)
      })
      this.close()
    }
  }
}
</script>
<style lang="css" scoped>
@keyframes vicp {
  0% {
    opacity: 0;
    -webkit-transform: scale(0) translatey(-60px);
    transform: scale(0) translatey(-60px);
  }
  100% {
    opacity: 1;
    -webkit-transform: scale(1) translatey(0);
    transform: scale(1) translatey(0);
  }
}
.shade {
  position: fixed;
  display: block;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  z-index: 1000;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.65);
}
.shade > div {
  -webkit-box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.23);
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.23);
  position: fixed;
  display: block;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  z-index: 10000;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  width: 680px;
  height: 450px;
  background-color: #fff;
  border-radius: 4px;
  -webkit-animation: vicp 0.12s ease-in;
  animation: vicp 0.12s ease-in;
  overflow: hidden;
}
.shade .changepicTop {
  background-color: #55a7fd;
  height: 40px;
  line-height: 40px;
  color: #fff;
  font-size: 16px;
  padding: 0 10px;
}
.shade .changepicTop i {
  float: right;
  cursor: pointer;
}
.shade .changepicContentBox {
  position: absolute;
  top: 60px;
  bottom: 60px;
  left: 20px;
  right: 20px;
}
.shade .changepicContentBox .changepicNav {
  border-bottom: 1px solid #cccccc;
  height: 30px;
  line-height: 30px;
}
.shade .changepicContentBox .changepicNav > span {
  width: 110px;
  position: relative;
  top: -2px;
  text-align: center;
  cursor: pointer;
  font-size: 16px;
  color: #333;
  float: left;
}
.shade .changepicContentBox .changepicNav > span.active,
.shade .changepicContentBox .changepicNav > span:hover {
  border-bottom: 2px solid #55a7fd;
  color: #55a7fd;
}
.shade .changepicContentBox .changepicContent {
  position: absolute;
  left: 0px;
  right: 0px;
  top: 50px;
  bottom: 0px;
}
.shade .changepicContentBox .changepicContent .changepicContentLeft {
  padding-left: 20px;
  padding-top: 5px;
  height: 100%;
  float: left;
  font-size: 16px;
}
.shade
  .changepicContentBox
  .changepicContent
  .changepicContentLeft
  .customizePic
  .upload {
  height: 40px;
  margin: 25px 0;
}
.shade
  .changepicContentBox
  .changepicContent
  .changepicContentLeft
  .upload
  > a {
  position: relative;
  display: inline-block;
  width: 110px;
  text-align: center;
  /* background: #D0EEFF; */
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 4px 12px;
  overflow: hidden;
  color: #aaa;
  text-decoration: none;
  text-indent: 0;
  line-height: 20px;
  font-size: 12px;
  top: 5px;
}
.shade
  .changepicContentBox
  .changepicContent
  .changepicContentLeft
  .upload
  input {
  position: absolute;
  font-size: 100px;
  right: 0;
  top: 0;
  opacity: 0;
  cursor: pointer;
}
.shade
  .changepicContentBox
  .changepicContent
  .changepicContentLeft
  .customizePic
  .tip {
  font-size: 12px;
  display: inline-block;
  color: #aaa;
  height: 40px;
  line-height: 40px;
  position: relative;
  top: -5px;
  padding-left: 10px;
}
.shade .changepicContentBox .changepicContent .hotImg {
  border: 1px solid #ccc;
  border-radius: 3px;
  display: inline-block;
  width: 50px;
  height: 50px;
  line-height: 50px;
  text-align: center;
  overflow: hidden;
  margin-right: 10px;
  position: relative;
  color: #aaaaaa;
  font-size: 12px;
  cursor: pointer;
}
.shade .changepicContentBox .changepicContent .hotImg.active::after {
  content: "";
  position: absolute;
  width: 0;
  height: 0;
  border: 10px solid #55a7fd;
  border-top-color: transparent;
  border-left-color: transparent;
  bottom: 0;
  right: 0;
}
.shade .changepicContentBox .changepicContent .hotImg i.iconfont {
  position: absolute;
  bottom: -20px;
  right: 0;
  font-size: 8px;
  color: #fff;
  z-index: 10;
}
.shade .changepicContentBox .changepicContent .changepicContentLeft .hotPic {
  width: 330px;
  height: 100%;
}
.shade .changepicContentBox .changepicContent .hotImg.active,
.shade .changepicContentBox .changepicContent .hotImg:hover {
  border: 1px solid #55a7fd;
  color: #55a7fd;
}
.shade .changepicContentBox .changepicContent .hotImg img {
  width: 100%;
  height: 100%;
  position: relative;
  top: -3px;
}
.shade .changepicContentBox .changepicContent .changepicContentRight {
  float: right;
  width: 180px;
  height: 100%;
  border-left: 1px solid #ccc;
  padding-top: 5px;
  padding-left: 30px;
}
.shade .changepicContentBox .changepicContent .changepicContentRight .title {
  font-size: 16px;
  font-weight: 500;
}
/* .shade
  .changepicContentBox
  .changepicContent
  .changepicContentRight
  .title:last-of-type {
  margin: 8px 0;
} */
.shade .changepicContentBox .changepicContent .changepicContentRight .bigImg {
  width: 70px;
  height: 70px;
  margin: 8px 0;
}
.shade .changepicContentBox .changepicContent .changepicContentRight .smallImg {
  width: 30px;
  height: 30px;
  margin: 8px 0;
}
.shade .changepicContentBox .changepicContent .changepicContentRight .usedImg {
  width: 40px;
  height: 40px;
  margin-right: 10px;
}
.shade .changepicBottom {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 40px;
}
.shade .changepicBottom > button {
  width: 50%;
  border: none;
  outline: none;
  height: 100%;
  padding: 0;
  float: left;
  font-size: 16px;
  color: #ffffff;
}
.shade .changepicBottom > button.savepic {
  background-color: #6aa8f6;
}
.shade .changepicBottom > button.savepic:hover {
  background-color: #639fea;
}
.shade .changepicBottom > button.cancelpic {
  background-color: #e3e3e3;
}
.shade .changepicBottom > button.cancelpic:hover {
  background-color: #dcdcdc;
}
</style>
