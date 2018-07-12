<template>
  <div class="main-content-box">
    <!-- 主题内容菜单 -->
    <div class="main-content">
      <!--biaod-->
      <div class="divtime">
        <div class="row head-input">
          <div>
            <span>申请人信息</span>
          </div>
        </div>
        <div class="row input">
          <div class="col-xs-2 input-label">
            <span>申请人</span>
          </div>
          <div class="col-xs-3">
            <span>{{formData.Applicant}}</span>
          </div>
          <div class="col-xs-1">
            <span class="validate-msg"></span>
          </div>
          <div class="col-xs-2 input-label">
            <span>登录名</span>
          </div>
          <div class="col-xs-3">
            <span>{{formData.loginName}}</span>
          </div>
          <div class="col-xs-1">
            <span class="validate-msg"></span>
          </div>
        </div>
        <div class="row input">
          <div class="col-xs-2 input-label">
            <span>单位</span>
          </div>
          <div class="col-xs-3">
            <span>{{formData.enterprisename}}</span>
          </div>
          <div class="col-xs-1">
            <span class="validate-msg"></span>
          </div>
          <div class="col-xs-2 input-label">
            <span>部门</span>
          </div>
          <div class="col-xs-3">
            <span>{{formData.deptname}}</span>
          </div>
          <div class="col-xs-1">
            <span class="validate-msg"></span>
          </div>
        </div>
        <div class="row input">
          <div class="col-xs-2 input-label">
            <span>联系电话</span>
          </div>
          <div class="col-xs-3">
            <span>{{formData.phone}}</span>
          </div>
          <div class="col-xs-1">
            <span class="validate-msg"></span>
          </div>
          <div class="col-xs-2 input-label">
            <span>申请日期</span>
          </div>
          <div class="col-xs-3">
            <span>{{formData.applyTime}}</span>
          </div>
          <div class="col-xs-1">
            <span class="validate-msg"></span>
          </div>
        </div>
      </div>
      <div class="divtime">
        <div class="row head-input">
          <div>
            <span>基本信息</span>
          </div>
        </div>
        <div class="row input">
          <div class="col-xs-2 input-label">
            <span>接口名称</span>
          </div>
          <div class="col-xs-3">
            <span>{{formData.service_name}}</span>
          </div>
          <div class="col-xs-1">
            <span class="validate-msg"></span>
          </div>
        </div>
        <div class="row input">
          <div class="col-xs-2 input-label">
            <span>归属应用</span>
          </div>
          <div class="col-xs-3">
            <span>{{formData.apptype}}</span>
          </div>
          <div class="col-xs-1">
            <span class="validate-msg"></span>
          </div>
        </div>
        <div class="row input">
          <div class="col-xs-2 input-label">
            <span>接口标签</span>
          </div>
          <div class="col-xs-3">
            <span>{{formData.service_tag}}</span>
          </div>
          <div class="col-xs-1">
            <span class="validate-msg"></span>
          </div>
        </div>
        <div class="row input">
          <div class="col-xs-2 input-label">
            <span>公开方式</span>
          </div>
          <div class="col-xs-3">
            <span>{{formData.open_type}}</span>
          </div>
          <div class="col-xs-1">
            <span class="validate-msg"></span>
          </div>
        </div>
        <div class="row input">
          <div class="col-xs-2 input-label">
            <span>接口介绍</span>
          </div>
          <div class="col-md-9">
            <textarea class="col9-textarea" readonly="true" v-model="formData.service_remark"></textarea>
          </div>
          <div class="col-xs-1">
            <span class="validate-msg"></span>
          </div>
        </div>
      </div>
      <!--biaod  v-show="list1.state"-->
      <div class="divtime" v-show="list1.state">
        <div class="row head-input">
          <div>
            <span>页面请求设置</span>
          </div>
        </div>
        <div class="iformcon-con reg1">
          <div class="time-x">
            <span class="texet">请求类型</span>
            <span class="inputime ">
              <em class="ls">{{list1.request_type}}</em>
            </span>
          </div>
          <div class="time-x" v-show="list1.charset != null && list1.charset != '' ">
            <span class="texet">字符集</span>
            <span class="inputime ">
              <em class="ls">{{list1.charset}}</em>
            </span>
          </div>
          <div class="time-x">
            <span class="texet">请求地址</span>
            <span class="inputime ">
              <input v-show="formData.portIsShow" v-model="list1.request_port" readonly type="text" class="cssinput w200">
              <input v-model="list1.url" readonly type="text" class="cssinput w590">
            </span>
          </div>
          <div class="time-x" v-show="list1.isShowInputBody">
            <span class="texet">请求体</span>
            <span class="inputime ">
              <textarea v-model="list1.input_body" readonly type="text" class="cssinput teac"></textarea>
            </span>
          </div>
        </div>
      </div>
      <!--/biaodan-->
      <!--biaod-->
      <div class="divtime" v-show="list2.state">
        <div class="row head-input">
          <div>
            <span>页面数据请求设置</span>
          </div>
        </div>
        <div class="iformcon-con reg1">
          <div class="time-x">
            <span class="texet">请求类型</span>
            <span class="inputime ">
              <em class="ls">{{list2.request_type}}</em>
            </span>
          </div>
          <div class="time-x" v-show="list1.charset != null && list1.charset != '' ">
            <span class="texet">字符集</span>
            <span class="inputime ">
              <em class="ls">{{list2.charset}}</em>
            </span>
          </div>
          <div class="time-x">
            <span class="texet">参数设置</span>
            <span class="inputime ">
              <div class="tabth">
                <span class="ww1">参数名称</span>
                <span class="ww2">序号</span>
                <span class="ww3">参数类型</span>
                <span class="ww4">字段描述</span>
                <span class="ww5">标签</span>
              </div>
              <div class="tabcon">
                <div class="shulist-con">
                  <!--数据一条-->
                  <div class="shulist" v-for="(item,index) in list2.tableList" :key="index">
                    <div class="shulist-m">
                      <div class="w2 eqad">
                        <input disabled="" :value="item.name" type="text" class="inptcss inptcssw">
                      </div>
                      <div class="w1">
                        <input disabled="" :value="item.order" type="text" class="inptcss1">
                      </div>
                      <div class="w1">
                        <input disabled="" :value="item.param_type" type="text" class="inptcss3">
                      </div>
                      <div class="w3">
                        <input disabled="" :value="item.describe" type="text" class="inptcss2">
                      </div>
                      <div class="w2 poes">
                        <input disabled="" :value="item.tag" type="text" class="inptcss4">
                      </div>
                    </div>
                  </div>
                  <!--／数据一条end-->
                </div>
              </div>
            </span>
          </div>
          <div class="time-x">
            <span class="texet">请求地址</span>
            <span class="inputime ">
              <input v-show="formData.portIsShow" v-model="list2.request_port" readonly type="text" class="cssinput w200">
              <input v-model="list2.url" readonly type="text" class="cssinput w590">
            </span>
          </div>
          <div class="time-x" v-show="list2.isShowInputBody">
            <span class="texet">请求体</span>
            <span class="inputime ">
              <textarea v-model="list2.input_body" readonly type="text" class="cssinput teac"></textarea>
            </span>
          </div>
        </div>
      </div>
      <!--/biaodan-->
      <!--biaod-->
      <div class="divtime" v-show="list3.state">
        <div class="row head-input">
          <div>
            <span>纯数据请求设置</span>
          </div>
        </div>
        <div class="row input">
          <div class="col-xs-2 input-label">
            <span>请求类型</span>
          </div>
          <div class="col-xs-3">
            <span>{{list3.request_type}}</span>
          </div>
          <div class="col-xs-1">
            <span class="validate-msg"></span>
          </div>
        </div>
        <div class="row table-head">
          <div class="col-xs-1 col-xs-offset-1">请求类型</div>
          <div class="col-xs-1">参数名称</div>
          <div class="col-xs-1">序号</div>
          <div class="col-xs-1">参数类型</div>
          <div class="col-xs-3">字段描述</div>
          <div class="col-xs-2">标签</div>
        </div>
        <div class="table-body">
          <div v-for="(item, index) in list3.tableList" class="row table-row" :key="index">
            <div class="col-xs-1 col-xs-offset-2" :title="item.name">{{item.name}}</div>
            <div class="col-xs-1">{{item.order}}</div>
            <div class="col-xs-1">{{item.param_type}}</div>
            <div class="col-xs-3">{{item.describe}}</div>
            <div class="col-xs-2">{{item.tag}}</div>
          </div>
        </div>
        <div class="row input">
          <div class="col-xs-2 input-label">
            <span>请求地址</span>
          </div>
          <div class="col-xs-9" v-show="formData.portIsShow">
            <span>{{list3.request_port}}</span>
          </div>
          <div class="col-xs-9">
            <textarea class="col9-textarea" readonly="true" v-model="list3.url"></textarea>
          </div>
          <div class="col-xs-1">
            <span class="validate-msg"></span>
          </div>
        </div>
        <div class="row input" v-show="list3.isShowInputBody">
          <div class="col-xs-2 input-label">
            <span>请求体</span>
          </div>
          <div class="col-xs-9">
            <textarea class="col9-textarea" readonly="true" v-model="list3.input_body"></textarea>
          </div>
          <div class="col-xs-1">
            <span class="validate-msg"></span>
          </div>
        </div>
      </div>

      <div class="divtime" v-show="list3.state">
        <div class="row head-input">
          <div>
            <span>返回参数设置</span>
          </div>
        </div>
        <div class="row table-head">
          <div class="col-xs-1 col-xs-offset-1">参数设置</div>
          <div class="col-xs-1">参数名称</div>
          <div class="col-xs-1">序号</div>
          <div class="col-xs-1">参数类型</div>
          <div class="col-xs-3">字段描述</div>
          <div class="col-xs-2">标签</div>
        </div>
        <div class="table-body">
          <div v-for="(item, index) in list3.serviceOutParam" class="row table-row" :key="index">
            <div class="col-xs-1 col-xs-offset-2" :title="item.name">{{item.name}}</div>
            <div class="col-xs-1">{{item.order}}</div>
            <div class="col-xs-1">{{item.param_type}}</div>
            <div class="col-xs-3">{{item.describe}}</div>
            <div class="col-xs-2">{{item.tag}}</div>
          </div>
        </div>
        <div class="row input">
          <div class="col-xs-2 input-label">
            <span>输出格式</span>
          </div>
          <div class="col-xs-9">
            <textarea class="col9-textarea" readonly="true" v-model="list3.output_body"></textarea>
          </div>
          <div class="col-xs-1">
            <span class="validate-msg"></span>
          </div>
        </div>
      </div>
    </div>
    <!-- /主题内容菜单 end -->
  </div>
</template>
<script>
import apiToken from '../../../publicJs/apiToken.js'
import apiClient from '../../../publicJs/ApiClient.js'
import TipBoxService from '../../../publicJs/TipBoxService.js'
import LoadingBoxService from '../../../publicJs/LoadingBoxService.js'
import NoticeBoxService from '../../../publicJs/NoticeBoxService.js'
export default {
  name: 'examineInfo',
  props: ['id'],
  data () {
    return {
      formData: {
        butStyle: '', // 启用停用按钮的颜色
        isShow: false, // 是否显示启用停用按钮
        delIsShow: false, // 删除按钮是否显示
        updateIsShow: false, // 编辑按钮是否显示
        portIsShow: false, // 端口是否显示
        service_name: '', // 服务名称
        apptype: '', // 归属应用
        address: '', // 服务地址
        service_tag: '', // 服务标签
        open_type: '', // 公开方式
        service_brief: '', // 服务简介
        service_remark: '', // 服务介绍
        service_type: '', // 是数据服务还是页面服务1-有输入页面、2-无输入页面有输出页面、3-无输入页面无输出页面
        visit_num: '', // 调用次数
        id: '', // 原子服务ID
        service_status: '', // 服务状态
        Applicant: '', // 申请人
        enterprisename: '', // 单位
        deptname: '', // 部门
        loginName: '', // 登录名
        phone: '', // 电话
        applyTime: '', // 申请时间
        browseCount: '', // 历史访问
        appName: '', // 应用名称
        service_param: [],
        startAndStop: '', // 启用  停用
        startAndStopBut: '', // 启用  停用按钮显示
        audit_status: '' // 审核状态
      },
      list1: {
        isShowInputBody: false,
        state: false,
        charset: '',
        tableList: [],
        request_type: '', // 请求类型post、get、无
        request_port: '', // 请求端口 docker端口
        url: '', // 原子服务的请求路径 端口以后的ulr部分
        input_body: '' // 页面请求体
      },
      list2: {
        isShowInputBody: false,
        state: false,
        charset: '',
        tableList: [],
        request_type: '', // 请求类型post、get、无
        request_port: '', // 请求端口 docker端口
        url: '', // 原子服务的请求路径 端口以后的ulr部分
        input_body: '' // 页面请求体
      },
      list3: {
        isShowInputBody: false,
        state: false,
        tableList: [],
        url: '', // 原子服务的请求路径 端口以后的ulr部分
        output_body: '', // 页面请求体
        serviceOutParam: [], // 返回参数（输出）
        intput_body: '', // 输入格式
        request_type: '', // 请求类型post、get、无
        request_port: '' // 请求端口 docker端口
      }
    }
  },
  created () {
    this.formData.id = this.id
    this.formData.audit_status = this.$route.query.audit_status
    this.getFormData()
  },
  methods: {
    getFormData () {
      var that = this
      var myData = { id: that.formData.id } // that.formData.id
      LoadingBoxService.open('数据加载中...')
      apiClient.post(
        'itsmApi/atomicService/loadServiceInfo',
        myData,
        function (data) {
          that.formData.service_name = data.results.data[0].name
          // console.log(data.results)
          if (data.results.userList != null) {
            that.formData.Applicant = data.results.userList.truename
            that.formData.loginName = data.results.userList.loginname
            that.formData.enterprisename = data.results.userList.enterprisename
            that.formData.deptname = data.results.userList.deptname
            that.formData.phone = data.results.userList.phone
            that.formData.applyTime = data.results.apply_time
          }
          that.formData.apptype = data.results.data[0].apptype
          if (that.formData.apptype == 1) {
            that.formData.apptype = '远程服务'
          } else {
            that.formData.apptype = '应用服务'
            that.formData.portIsShow = true
          }
          that.formData.service_url = data.results.data[0].address
          if (data.results.data[0].service_tag != undefined) {
            that.formData.service_tag = data.results.data[0].service_tag.toString()
          }
          that.formData.open_type = data.results.data[0].open_type
          if (that.formData.open_type == 1) {
            that.formData.open_type = '完全公开'
          } else {
            that.formData.open_type = '条件公开'
          }
          that.formData.service_brief = data.results.data[0].service_brief
          that.formData.service_remark = data.results.data[0].service_remark
          that.formData.service_type = data.results.data[0].service_type
          that.formData.service_status = data.results.serviceStatus
          if (that.formData.service_status == '正常') {
            that.formData.startAndStopBut = '停用'
            that.formData.startAndStop = '关闭'
            that.formData.butStyle = 'butonstdelet'
          } else if (that.formData.service_status == '关闭') {
            that.formData.startAndStopBut = '启用'
            that.formData.startAndStop = '正常'
            that.formData.butStyle = 'butonst'
          }
          that.formData.visit_num = data.results.data[0].visit_num
          if (that.formData.visit_num == undefined) {
            that.formData.visit_num = '0'
          }
          /* that.formData.audit_status=data.results.data[0].audit_status; */
          if (that.formData.audit_status == '未通过') {
            that.formData.updateIsShow = true
          }
          if (that.formData.audit_status == '已通过') {
            that.formData.isShow = true
          }
          if (
            that.formData.audit_status == '0' ||
            that.formData.audit_status == undefined
          ) {
            that.formData.updateIsShow = true
            that.formData.delIsShow = true
          }

          that.formData.browseCount = data.results.browseCount
          that.formData.appName = data.results.appName
          that.formData.service_param =
            data.results.data[0].service_param_detail
          for (var i = 0; i < that.formData.service_type.length; i++) {
            var arr = that.formData.service_type[i]
            if (arr == '1') {
              if (that.formData.service_param != undefined) {
                that.formData.service_param[i] = JSON.parse(
                  that.formData.service_param[0]
                )
                that.list1.url = that.formData.service_param[i].url
                that.list1.request_type =
                  that.formData.service_param[i].request_type
                if (that.list1.request_type == 'post') {
                  that.list1.isShowInputBody = true
                }
                that.list1.charset = that.formData.service_param[i].charset
                that.list1.input_body =
                  that.formData.service_param[i].input_body
                that.list1.request_port =
                  that.formData.service_param[i].request_port
                that.list1.tableList =
                  that.formData.service_param[i].service_param
                that.list1.state = true
              }
            }
            if (arr == '2') {
              if (that.formData.service_param != undefined) {
                that.formData.service_param[i] = JSON.parse(
                  that.formData.service_param[1]
                )
                that.list2.url = that.formData.service_param[i].url
                that.list2.request_type =
                  that.formData.service_param[i].request_type
                if (that.list2.request_type == 'post') {
                  that.list2.isShowInputBody = true
                }
                that.list2.charset = that.formData.service_param[i].charset
                that.list2.input_body =
                  that.formData.service_param[i].input_body
                that.list2.request_port =
                  that.formData.service_param[i].request_port
                that.list2.tableList =
                  that.formData.service_param[i].service_param
                that.list2.state = true
              }
            }
            if (arr == '3') {
              if (that.formData.service_param != undefined) {
                that.formData.service_param[i] = JSON.parse(
                  that.formData.service_param[2]
                )
                that.list3.input_body =
                  that.formData.service_param[i].input_body
                that.list3.output_body =
                  that.formData.service_param[i].output_body
                that.list3.tableList =
                  that.formData.service_param[i].service_param
                that.list3.serviceOutParam =
                  that.formData.service_param[i].service_out_param
                that.list3.request_port =
                  that.formData.service_param[i].request_port
                that.list3.url = that.formData.service_param[i].url
                that.list3.request_type =
                  that.formData.service_param[i].request_type
                if (that.list3.request_type == 'post') {
                  that.list3.isShowInputBody = true
                }
                that.list3.state = true
              }
            }
          }
          LoadingBoxService.close()
        }
      )
    },
    // 删除服务
    deleteService () {
      var that = this
      NoticeBoxService.open('是否删除当前服务，删除后将无法撤回', function (data) {
        NoticeBoxService.close()
        LoadingBoxService.open('删除数据，请稍候...')
        apiClient.post(
          'itsmApi/atomicService/deleteAtomicInfo',
          { serviceId: that.formData.id },
          function (data) {
            if (data.status == '200') {
              LoadingBoxService.close()
              TipBoxService.open('删除成功')
              that.$router.push({
                name: 'serviceManager'
              })
            } else {
              LoadingBoxService.close()
              TipBoxService.open('删除失败', 2)
            }
          }
        )
      })
    },
    // 启用停用
    startAndStop (val) {
      // 正常，关闭
      var that = this
      LoadingBoxService.open('正在' + that.formData.startAndStopBut + '，请稍候...')
      var myData = { serviceId: that.formData.id, serviceStatus: val } // that.formData.id
      apiClient.post(
        'itsmApi/atomicService/startAndStop',
        myData,
        function (data) {
          if (data.status == '200') {
            LoadingBoxService.close()
            that.getFormData()
            TipBoxService.open('成功')
          } else {
            LoadingBoxService.close()
            TipBoxService.open('失败', 2)
          }
        }
      )
    },
    // 编辑
    editService () {
      var that = this
      that.$router.push({
        name: 'newService',
        query: {
          atomicId: that.formData.id
        }
      })
    },
    back () {
      window.close()
    }
  }
}
</script>
<style scoped>
.input .input-label span {
  float: right;
  color: #222;
}
.main-content-box {
  box-shadow: none;
  background-color: #fff;
  padding: 0 15px;
  font-size: 12px;
}
.main-content-box .input {
  margin-bottom: 26px;
}
.main-content {
  box-shadow: none !important;
}
.input .col-xs-3 > span,
.input .col-xs-9 > span {
  color: #888;
  width: 100%;
}
.input textarea {
  border: 0;
  padding: 0;
  width: 100%;
  resize: none;
  color: #888;
  background-color: #f0f9fe;
}
.table thead {
  table-layout: fixed;
}
.title {
  height: 80px;
  line-height: 80px;
  border-bottom: 1px solid #ccc;
  font-size: 16px;
  color: #55a8fd;
  text-align: center;
  margin-bottom: 55px;
}
.head-input {
  overflow: hidden;
  margin-bottom: 55px;
}
.head-input > div {
  height: 40px;
  border: 1px solid #55a8fd;
  display: inline-block;
  line-height: 40px;
  position: relative;
}
.head-input > div:after {
  content: "";
  position: absolute;
  height: 1px;
  display: inline-block;
  width: 1920px;
  top: 19px;
  left: 100%;
  background: #aad3fe;
}
.head-input > div > span {
  font-size: 14px;
  color: #55a8fd;
  padding: 0 18px;
  position: relative;
}
.head-input > div > span:before {
  display: inline-block;
  height: 28px;
  width: 2px;
  content: "";
  background: #fff;
  position: absolute;
  top: -6px;
  right: -2px;
  border: 1px solid #fff;
}
.head-input > div > span:after {
  display: inline-block;
  height: 28px;
  width: 2px;
  content: "";
  background: #fff;
  position: absolute;
  top: -6px;
  left: -2px;
  border: 1px solid #fff;
}
.table-head {
  margin-bottom: 20px;
  color: #222;
  text-align: center;
}
.table-row {
  margin-bottom: 26px;
  color: #888;
}
.table-body {
  width: 100%;
  max-height: 260px;
  overflow-y: auto;
  overflow-x: hidden;
}
.table-body div {
  text-align: center;
}
.table-body .col-xs-1,
.table-body .col-xs-3 {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.table-head .col-xs-1,
.table-head .col-xs-1,
.table-head .col-xs-3 {
  padding: 0 6px;
}
.table-body .col-xs-1,
.table-head .col-xs-1,
.table-head .col-xs-3 {
  padding: 0 6px;
}
.table-row .col-xs-2,
.table-row .col-xs-3 {
  text-align: center;
}
.save-btn-bottom-box {
  text-align: center;
  padding-bottom: 40px;
}
.btnGreen {
  margin-right: 120px;
}
</style>

