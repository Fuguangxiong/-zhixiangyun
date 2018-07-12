<template>
    <div class="pickInfo">
    	<div class="topTitle">
    		<p><font class="mianbaoxie" @click="toNoticeList"><i class="colsBlue"></i>公告管理</font> · 新建公告</p>
    	</div>
        <ul class="annouceTitle">
            <li>
                <label for="">公告标题：</label>
                <input type="text" v-model.trim="noticeTitle" @blur="notNUll" placeholder="请输入公告标题"/>
                <p class="checkNoticeTitle">{{titleflag}}</p>
            </li>
            <li class="annouceMain">
                <label for="">公告正文：</label>
                <textarea v-model="noticeContent" @blur="notNUll"></textarea>
                <p class="checkNoticeTitle">{{contentflag}}</p>
            </li>
            <li class="annouceBtn">
                <ol>
                    <li @click="saveNotice('2')"><a class="store">暂存</a></li>
                    <li @click="releaseNotice('1')"><a class="publish" v-show="priviFlag">直接发布</a></li>
                    <li @click="toNoticeList"><a class="cancel">取消</a></li>
                </ol>
            </li>
        </ul>
    </div>
</template>
<script>
import apiToken from '../../../publicJs/apiToken.js';
import apiClient from '../../../publicJs/ApiClient.js';
import LoadingBoxService from '../../../publicJs/LoadingBoxService.js';
import UtilService from '../../../publicJs/UtilService.js';
import appPublicJs from '../../common/public.js';
import NoticeBox from '../../common/NoticeBox.js';
import TipBoxService from '../../../publicJs/TipBoxService.js';

export default {
      data () {
  return {
              pageSize: 10,
              pageNum: 1,
              noticeTitle: '',
              titleflag: '',
              contentflag: '',
              noticeContent: '',
              id: '',
              priviFlag: this.$route.query.priviFlag
            }
},
      mounted () {
  this.id = this.$route.query.id
            if (this.id != '') {
              this.selectInfoById(this.id)
            }
},
      methods: {

  notNUll () {
            var that = this
               var pattern = new RegExp('[@!！￥......#（）\$\(\)%\^&\*]+')
              if (that.noticeTitle == '' || that.noticeTitle == null) {
                that.titleflag = '公告标题不能为空'
                    that.contentflag = ''
                    return false
              } else{
                if (pattern.test(that.noticeTitle)) {
                      that.titleflag = '不允许输入!@#￥%...&*()-+'
                        that.contentflag = ''
                        return false
                    } else if (that.noticeTitle.length > 25) {
                      that.titleflag = '最多不超过25个字'
                        that.contentflag = ''
                        return false
                    }else {
                      that.titleflag = ''
                    }
              }
            if (that.noticeContent == '' || that.noticeContent == null) {
                that.contentflag = '公告正文不能为空'
                    that.titleflag = ''
                    return false
              } else{
                that.contentflag = ''
              }
            return true
       },
  saveNotice (state) {
         var that = this
            var flag = this.notNUll()
           if (flag == true) {
             if (that.id == '') {
                  var myData = {
                      'state': state,
                      'bulletin_name': that.noticeTitle,
                      'bulletin_content': that.noticeContent
                    }
                  apiClient.post(apiToken.newApi('/ioapi/bulletin/addBulletin/'), myData).then(data => {
                      if (data.status == true) {
                          TipBoxService.open('新增公告成功', 0) 
                        } else{
                          TipBoxService.open('新增公告失败', 2)
                        }
                      that.$router.push({name: 'notice'})
                    }).catch(e => {
                      console.error(e)
                    })
                }else {
                  var myData = {
                       'id': that.id,
                       'state': state,
                       'bulletin_name': that.noticeTitle,
                       'bulletin_content': that.noticeContent
                     }
                  apiClient.get(apiToken.newApi('/ioapi/bulletin/updateBulletinState/'), myData).then(data => {
                      if (data.status == true) {
                          TipBoxService.open('编辑公告成功', 0) 
                        }else {
                          TipBoxService.open('编辑公告失败', 2)
                        }
                      that.$router.push({name: 'notice'})
                    }).catch(e => {
                      console.error(e)
                    })
                }
           } else{
             return
           }
       },
  releaseNotice (state) {
          var that = this
            var flag = this.notNUll()
           if (flag == true) {
             if (that.id == '') {
                  var myData = {
                      'state': state,
                      'bulletin_name': that.noticeTitle,
                      'bulletin_content': that.noticeContent
                    }
                  let sure = function () {
                      apiClient.post(apiToken.newApi('/ioapi/bulletin/addBulletin/'), myData).then(data => {
                              NoticeBox.close()
                                if (data.status == true) {
                                  TipBoxService.open('发布成功', 0) 
                                } else{
                                  TipBoxService.open('发布失败', 2)
                                }
                              that.$router.push({name: 'notice'})
                            }).catch(e => {
                              console.error(e)
                            })
                    }
                  NoticeBox.open('是否要发布所选内容?', 'publish', sure)
                }else {
                  var myData = {
                       'id': that.id,
                       'state': state,
                       'bulletin_name': that.noticeTitle,
                       'bulletin_content': that.noticeContent
                     }
                  let sure = function () {
                      apiClient.get(apiToken.newApi('/ioapi/bulletin/updateBulletinState/'), myData).then(data => {
                              NoticeBox.close()
                                if (data.status == true) {
                                  TipBoxService.open('发布成功', 0) 
                                } else{
                                  TipBoxService.open('发布失败', 2)
                                }
                              that.$router.push({name: 'notice'})
                            }).catch(e => {
                              console.error(e)
                            })
                    }
                  NoticeBox.open('是否要发布所选内容?', 'publish', sure)
                }
           } else{
             return
           }
        },
  selectInfoById (id) {
          var that = this 
            var myData = {
              id: id
            }
          apiClient.get(apiToken.newApi('/ioapi/bulletin/bulletinDetails/'), myData).then(data => {
              if (appPublicJs.checkData(data.data)) {
                    	that.id = id
						that.noticeTitle = data.data[0].bulletin_name
						that.noticeContent = data.data[0].bulletin_content
                }
            }).catch(e => {
              console.error(e)
            })
        },
  toNoticeList () {
          var that = this
            that.$router.push({name: 'notice'})
        }
}
    }
</script>
<style src="../../css/notice.css" scoped></style>
