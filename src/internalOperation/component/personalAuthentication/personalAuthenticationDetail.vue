<template>
<div class="maincontent">
  <breadcrumb :data="breadCrumb"></breadcrumb>
  <div class="section-box">
    <div class="auth-title">
      <span class="section-one">用户信息</span>
    </div>
    <div class="auth-content">
      <div class="left-blank"></div>
      <div class="right-info">
        <div class="content-line">
          <span><span class="bold-title">真实姓名：</span><span>{{userInfo.realName}}</span></span>
          <span><span class="bold-title">手机号码：</span><span>{{userInfo.phone}}</span></span>
        </div>
        <div class="content-line">
          <span><span class="bold-title">证件类型：</span><span>{{userInfo.credType}}</span></span>
          <span><span class="bold-title">用户身份证号码：</span><span>{{userInfo.idCard}}</span></span>
        </div>
        <div class="content-img">
          <div>
            <span class="bold-title">身份证扫描件：</span>
            <div>
              <span>
                <span v-show="isShowLoading1" class="id-photo photo" :class="{showLoading:isShowLoading1}"></span>
                <img v-show="!isShowLoading1" class="id-photo" :src="url1"/>
                <span @click="openBox('f')">点击看大图</span>
              </span>
              <span>
                <span v-show="isShowLoading2" class="id-photo photo" :class="{showLoading:isShowLoading2}"></span>
                <img v-show="!isShowLoading2" class="id-photo" :src="url2"/>
                <span @click="openBox('b')">点击看大图</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="section-box">
    <div class="auth-title">
      <span class="section-two" v-if="!isApproved">审批操作</span>
      <span class="section-two" v-if="isApproved">审批结果</span>
    </div>
    <div class="auth-content bottom-content" :class="{longsection:!isApproved}">
      <div class="left-blank"></div>
      <div class="right-info">
        <div class="content-bottom button-content" :class="{approved:isApproved}">
          <span>
            <span class="bold-title">审批：</span>
            <div class="button-box" v-if="!isApproved">
              <span class="pa-button" :class="{active:passSelected}" @click="approve('pass')">通过</span>
              <span class="pa-button" :class="{active:nopassSelected}" @click="approve('nopass')">不通过</span>
            </div>
            <div class="result" v-if="isApproved">{{resultInfo}}</div>
          </span>
        </div>
        <div class="content-bottom">
          <span>
            <span :class="{'normal-lineheight':!isApproved}" class="bold-title">备注：</span>
            <div :class="{approved:isApproved}">
              <textarea v-model="comment" v-if="!isApproved"></textarea>
              <span v-if="isApproved" class="text-area">{{comment}}</span>
            </div>
          </span>
        </div>
      </div>    
    </div>
  </div>
  <div class="fixed-box" v-if="!isApproved">
    <div class="left-info">
      <span>通过个人认证：</span>
      <span>该用户通过个人认证后，该用户将获得服务管理、创建企业、加入企业等功能。请仔细核对用户身份证号是否与图片一致。</span>
    </div>
    <div class="right-info">
      <span @click="goback">返回</span>
      <span @click="submit">提交</span>
    </div>
  </div>
  <transition name="fade">
    <picenlarge :close="closeBox" :imgsource="picdata" v-if="lightBoxToggle"></picenlarge>
  </transition>  
</div>  
</template>
<script>
import breadCrumb from '../../../personalConsole/component/publicComponent/breadCrumb'
import tipBoxService from '../../../publicJs/TipBoxService'
import picEnlarge from '../publicComponent/pictureEnlarge'
import apiClient from '../../../publicJs/ApiClient'
import LoadingBoxService from '../../../publicJs/LoadingBoxService'
export default{
  name: 'personalAuthenticationDetail',
  components: {
    'breadcrumb': breadCrumb,
    'picenlarge': picEnlarge
  },
  data () {
    return {
      breadCrumb: [{name: '个人认证', link: '/personalAuthenticationList'}, {name: '详情', link: ''}],
      passSelected: false,
      nopassSelected: false,
      userInfo: {
        realName: '',
        phone: '',
        credType: '',
        idCard: ''
      },
      comment: '',
      isApproved: false,
      frontPic: '',
      backPic: '',
      picdata: '',
      lightBoxToggle: false,
      resultInfo: '',
      id: '',
      url1: '',
      url2: '',
      isShowLoading1: true,
      isShowLoading2: true
    }
  },
  mounted () {
    var that = this
    this.id = this.$route.query.id
    LoadingBoxService.open('加载中...')
    apiClient.get('pcapi/authentication/' + this.id, {}).then(data => {
      console.log('info', data)
      this.userInfo.realName = data.realName
      this.userInfo.phone = data.user.phone
      if (data.certificateType === 'IdCard') {
        this.userInfo.credType = '身份证'
      }
      this.userInfo.idCard = data.certificateNo
      this.frontPic = apiClient.apiBaseUrl + '/pcapi/enterprise/pcShowImage/identity?imgPath=' + data.certificateFront + '&token=' + apiClient.token
      this.backPic = apiClient.apiBaseUrl + '/pcapi/enterprise/pcShowImage/identity?imgPath=' + data.certificateBack + '&token=' + apiClient.token
      if (data.status === 'PASS') {
        this.isApproved = true
        this.passSelected = true
        this.resultInfo = '通过'
        this.comment = data.approvalComment
      } else if (data.status === 'NO_PASS') {
        this.isApproved = true
        this.nopassSelected = true
        this.resultInfo = '不通过'
        this.comment = data.approvalComment
      } else {
        this.isApproved = false
      }

      var newImg1 = new Image()
      newImg1.src = that.frontPic
      console.log('12', newImg1.src)
        // newImg1.onerror = () => {    // 图片加载错误时的替换图片
        //   newImg1.src = 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1489486509807&di=22213343ba71ad6436b561b5df999ff7&imgtype=0&src=http%3A%2F%2Fa0.att.hudong.com%2F77%2F31%2F20300542906611142174319458811.jpg'
        // }
      newImg1.onload = () => { // 图片加载成功后把地址给原来的img
        that.isShowLoading1 = false
        that.url1 = newImg1.src
      }
      var newImg2 = new Image()
      newImg2.src = that.backPic
        // newImg2.onerror = () => {    // 图片加载错误时的替换图片
        //   newImg2.src = 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1489486509807&di=22213343ba71ad6436b561b5df999ff7&imgtype=0&src=http%3A%2F%2Fa0.att.hudong.com%2F77%2F31%2F20300542906611142174319458811.jpg'
        // }
      newImg2.onload = () => { // 图片加载成功后把地址给原来的img
        that.isShowLoading2 = false
        that.url2 = newImg2.src
      }
      LoadingBoxService.close()
    }).catch(e => {
      console.log(e)
    })
  },
  methods: {
    approve (e) {
      if (this.isApproved) {
        return false
      } else {
        if (e === 'pass') {
          this.passSelected = true
          this.nopassSelected = false
        } else {
          this.passSelected = false
          this.nopassSelected = true
        }
      }
    },
    goback () {
      this.$router.push('/personalAuthenticationList')
    },
    submit () {
      var that = this
      if (!this.passSelected && !this.nopassSelected) {
        tipBoxService.open('请选择审批结果', 2)
      } else if (this.passSelected) {
        if (this.comment.length > 50) {
          tipBoxService.open('通过原因最长为50个字', 2, 2)
        } else {
          let param = {
            id: this.id,
            status: 'PASS',
            approvalComment: this.comment
          }
          LoadingBoxService.open('请稍候...')
          apiClient.put('pcapi/authentication/audit', param).then(data => {
            if (data === true) {
              LoadingBoxService.close()
              tipBoxService.open('审批成功', null, 1)
              setTimeout(() => {
                that.goback()
              }, 1500)
            } else {
              LoadingBoxService.close()
              console.log(data)
              tipBoxService.open('审批失败', 2, 2)
            }
          }).catch(e => {
            LoadingBoxService.close()
            console.log(e)
            tipBoxService.open('审批失败', 2, 2)
          })
        }
      } else {
        if (this.comment === '') {
          tipBoxService.open('请填写未通过原因', 2, 2)
        } else if (this.comment.length > 50) {
          tipBoxService.open('未通过原因最长为50个字', 2, 2)
        } else {
          let param = {
            id: this.id,
            status: 'NO_PASS',
            approvalComment: this.comment
          }
          LoadingBoxService.open('请稍候...')
          apiClient.put('pcapi/authentication/audit', param).then(data => {
            if (data === true) {
              LoadingBoxService.close()
              tipBoxService.open('审批成功', null, 1)
              setTimeout(() => {
                that.goback()
              }, 1500)
            } else {
              LoadingBoxService.close()
              console.log(data)
              tipBoxService.open('审批失败', 2, 2)
            }
          }).catch(e => {
            console.log(e)
            LoadingBoxService.close()
            tipBoxService.open('审批失败', 2, 2)
          })
        }
      }
    },
    openBox (e) {
      if (e === 'f') {
        this.picdata = this.frontPic
      } else {
        this.picdata = this.backPic
      }
      this.lightBoxToggle = !this.lightBoxToggle
    },
    closeBox () {
      this.lightBoxToggle = false
    }
  }
}
</script>
<style scoped>
  .maincontent{
    position: relative;
    width: 100%;
    height: 100%;
    min-height: 500px;
    min-width: 800px;
  }
  .section-box{
    margin-top: 26px;
  }
  .section-box .auth-title{
    height: 30px;
    background: #F8F8F8;
    border: 1px solid #f1f1f1;
    border-left: 4px solid #f1f1f1;
    line-height: 30px;
    margin-bottom: 5px;
  }
  .section-box .auth-title>span:before{
    width: 16px;
    height: 16px;
    content: '';
    display: inline-block;
    position: relative;
    top: 3px;
    margin: 0 6px;
  }
  .section-box .auth-title .section-one:before{
    background: url('../../images/pa-userinfo.png');
  }
  .section-box .auth-title .section-two:before{
    background: url('../../images/pa-approve.png');
  } 
  .section-box .longsection{
    height: 240px;
  }
  .section-box .auth-content{
    display: flex;
  }
  .section-box .auth-content .left-blank{
    flex: 1;
  }
  .section-box .auth-content .right-info{
    flex: 6;
  }
  .section-box .auth-content .right-info .content-line{
    display: flex;
    height: 40px;
    line-height: 40px;
  }
  .section-box .auth-content .right-info .content-line>span{
    flex: 1;
    display: flex;
  }
  .section-box .auth-content .right-info .content-line>span span:first-child{
    flex: 2;
  }
  .section-box .auth-content .right-info .content-line>span span:last-child{
    flex: 5;
  }
  .section-box .auth-content .right-info .content-img{
    margin-top: 12px;
  }
  .section-box .auth-content .right-info .content-bottom{
    line-height: 40px;
  }
  .section-box .auth-content .right-info .content-bottom .normal-lineheight{
    line-height: 20px;
  }
  .section-box .auth-content .right-info .content-bottom>span{
    display: flex;
  }
  .section-box .auth-content .right-info .content-bottom>span>span{
    flex: 1;
  }
  .section-box .auth-content .right-info .content-bottom>span>div{
    flex: 10;
  }
  .section-box .auth-content .right-info .content-bottom>span>div.result{
    flex: 6;
  }
  .section-box .auth-content .right-info .content-bottom>span>div.approved{
    flex: 6;
  }
  .section-box .auth-content .right-info .content-bottom span .button-box{
    padding-top: 5px;
  }
  .section-box .auth-content .right-info .content-bottom>span div .pa-button{
    width: 82px;
    height: 30px;
    border: 1px solid #ccc;
    display: block;
    line-height: 30px;
    text-align: center;
    float: left;
    margin-right: 3%; 
    transition: all 0.2s;
    -webkit-transition: all 0.2s;
  }
  .section-box .auth-content .right-info .content-bottom>span div .pa-button{
    cursor: pointer;
  }
  .section-box .auth-content .button-content{
    margin-top: 10px;
    margin-bottom: 15px;
  }
  .section-box .auth-content .button-content.approved{
    margin-bottom: 5px;
  }
  .section-box .auth-content .right-info .content-bottom>span div .pa-button:hover{
    color: #fff;
    background: #fe9900;
    border: 1px solid #DE9E3C;
  }
  .section-box .auth-content .right-info .content-bottom>span div .pa-button.active{
    color: #fff;
    background: #fe9900;
    border: 1px solid #DE9E3C;
    transition: all 0.2s;
    -webkit-transition: all 0.2s;
  }
  .section-box .auth-content .right-info .content-bottom span div textarea{
    width: 65%;
    height: 50px;
    resize: none;
    line-height: 20px;
    height: 52px;
    border: 1px solid #ededed;
    border-radius: 4px;
    padding: 4px 6px;
  }
  .section-box .auth-content .right-info .content-bottom span div textarea:focus{
    outline: 1px solid rgba(85,168,253,0.8);
    box-shadow: 0 0 1px #55a8fd;
  }
  .section-box .auth-content .right-info .content-bottom span div .text-area{
    display: inline-block;
    width: 65%;
    line-height: 20px;
    height: 50px;
  }
  .section-box .auth-content .right-info .content-img>div{
    display: flex;
  }
  .section-box .auth-content .right-info .content-img>div>span{
    flex: 2;
  }
  .section-box .auth-content .right-info .content-img>div>div{
    flex: 12;
    padding-top: 3px;
  }
  .section-box .auth-content .right-info .content-img>div>div>span{
    height: 130px;
    width: 160px;
    display: inline-block;
    margin-right: 20px;
  }
  .section-box .auth-content .right-info .content-img>div>div>span>span:last-child{
    width: 70px;
    height: 24px;
    text-align: center;
    line-height: 24px;
    margin-top: 8px;
    margin-left: 45px;
    display: inline-block;
    color: #55a8fd;
    cursor: pointer;
  }
  .section-box .auth-content .right-info .content-img .id-photo{
    width: 160px;
    height: auto;
    max-height: 101px;
    min-height: 90px;
    display: inline-block;
    border-radius:6px; 
    border: none 0 !important;
  }
  .bigSreen .fixed-box{
    left: 50px;
    transition: all 0.5s;
    -webkit-transition: all 0.5s;
  }
  .fixed-box{
    position: fixed;
    height: 90px;
    line-height: 60px;
    background: #f7f7f7;
    bottom: 55px;
    right: 0;
    left: 200px;
    box-shadow: 0 3px 10px rgba(0,0,0,0.2);
    transition: all 0.5s;
    -webkit-transition: all 0.5s;
    display: flex;
  }
  .fixed-box .left-info{
    flex: 4;
  }
  .fixed-box .left-info span:first-child{
    font-size: 14px;
    margin-left: 20px;
  }
  .fixed-box .right-info{
    flex: 1;
    line-height: 90px;
  }
  .fixed-box .right-info span{
    width: 80px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    display: inline-block;
    font-size: 14px;
    cursor: pointer;
    margin-right: 10%;
  }
  .fixed-box .right-info span:first-child{
    color: #55a8fd;
    border: 1px solid #66a1ec;
  }
  .fixed-box .right-info span:first-child:hover{
    background: #fff;
    border: 1px solid #5a90d4;
  }
  .fixed-box .right-info span:last-child{
    color: #fff;
    background: #66a8f6;
    border: 1px solid #66a1ec;
  }
  .fixed-box .right-info span:last-child:hover{
    background: #639fea;
    border: 1px solid #5a90d4;
  }
   .showLoading{
    background:url(../../images/loading1.gif) no-repeat center center;
  }
  .photo{
    background-color: #f8f8f8;
  }
  .bold-title{
    font-weight: bold;
  }
</style>
