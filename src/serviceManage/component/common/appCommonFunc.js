import apiClient from '../../../publicJs/ApiClient.js'
import TipBoxService from '../common/TipBoxService.js'
import LoadingBoxService from '../../../publicJs/LoadingBoxService.js'
import $ from 'jquery'
export default {
    // 应用状态字典
  getAppStatusDic: function (array) {
    let appStatusDic = [
      { label: '全部', value: '' },
      { label: '待开通', value: '1' },
      { label: '待部署', value: '2' },
      { label: '部署中', value: '8' },
      { label: '未启动', value: '3' },
      { label: '运行中', value: '4' },
      { label: '维护中', value: '5' },
      { label: '已停止', value: '6' },
      { label: '已删除', value: '0' }
       // { label: '已下架', value: '7' },
       // { label: '已上架', value: '9' }
    ]
    if (array) {
      let newAppStatusDic = []
      appStatusDic.forEach(function (v, i) {
        if ($.inArray(v.label, array) !== -1) {
          newAppStatusDic.push(appStatusDic[i])
        }
      })
      appStatusDic = newAppStatusDic
    }
    return appStatusDic
  },
    // 审批状态字典
  getAuditStatusDic: function (array) {
    let auditStatusDic = [
        { label: '全部', value: '' },
        { label: '未提交', value: '0' },
        { label: '待审核', value: '1' },
        { label: '未通过', value: '2' },
        { label: '已通过', value: '3' }
    ]
    if (array) {
      let newAuditStatusDic = []
      auditStatusDic.forEach(function (v, i) {
        if ($.inArray(v.label, array) !== -1) {
          newAuditStatusDic.push(auditStatusDic[i])
        }
      })
      auditStatusDic = newAuditStatusDic
    }
    return auditStatusDic
  },
    // 获取应用状态文字
  getAppStatusStr: function (str) {
    let list = this.getAppStatusDic()
    let appStr = ''
    list.forEach(function (v, i) {
      if (str === v.value) {
        appStr = v.label
        return
      }
    })
    return appStr
  },
    // 水印字典
  getWatermarkDic: function () {
    let watermarkDic = [
        { label: '草稿', audit_status: '0', className: 'draft' },
        { label: '审核中', audit_status: '1', className: 'processing' },
        { label: '未通过', audit_status: '2', className: 'unPass' }
    ]
    return watermarkDic
  },
    // 加水印
  addWatermark: function (num) {
    let watermarkClass = ''
    let watermark = this.getWatermarkDic()
    watermark.forEach(function (v, i) {
      if (v.audit_status === num) {
        watermarkClass = v.className
      }
    })
    return watermarkClass
  },

  addSeniorBtns: function (obj, flag) {
    obj.seniorBtns = []
    if (obj.audit_status === '0' && obj.app_status === '1') {
      obj.seniorBtns = ['edit', 'delete']
    } else if (obj.audit_status === '1' && obj.app_status === '1') {
       // 二级审批限制
      if (obj.belong_type === 'PERSONAL' || obj.belong_type === 'PLATFORM') {
        if (obj.approval_workflow === 2) {
          obj.seniorBtns = ['revokeRegist', 'viewApplyRegist']
        }
      } else {
        if (obj.approval_workflow > 1) {
          obj.seniorBtns = ['viewApplyRegist']
        } else {
          obj.seniorBtns = ['revokeRegist', 'viewApplyRegist']
        }
      }
      // 第三方限制
      if (flag === 'thirdParty') {
        obj.seniorBtns = ['viewApplyRegist']
      }
    } else if (obj.audit_status === '2' && obj.app_status === '1') {
      obj.seniorBtns = ['edit', 'delete', 'viewApplyRegist']
    } else if (obj.audit_status === '3') {
      if (obj.app_status === '0') {
        obj.seniorBtns = ['viewApplyRegist']
      } else if (obj.app_status === '2') {
        obj.seniorBtns = ['deploy', 'viewApplyRegist']
      } else if (obj.app_status === '3') {
        obj.seniorBtns = ['start', 'viewApplyRegist']
      } else if (obj.app_status === '4') {
        if (flag === 'thirdParty') {
          obj.seniorBtns = ['forciblyStop', 'viewApplyRegist']
        } else {
          obj.seniorBtns = ['maintain', 'viewApplyRegist']
        }
      } else if (obj.app_status === '5') {
        obj.seniorBtns = ['stop', 'viewApplyRegist']
      } else if (obj.app_status === '6') {
        obj.seniorBtns = ['deleteStatus', 'start', 'viewApplyRegist']
      } else if (obj.app_status === '8') {
        obj.seniorBtns = ['viewApplyRegist']
      }
    }
    return obj
  },
    // 加右侧公共按钮
  addRightBtn: function (obj) {
    let btn = {}
    if (obj.audit_status === '0') {
      btn = { label: '编辑', str: 'edit' }
    } else {
      btn = { label: '查看创建申请', str: 'viewApplyRegist' }
    }
    return btn
  },
  // 添加标签
  addTag: function (obj) {
    obj.tag = []
    if (obj.audit_status === '3') {
      obj.tag.push({
        className: 'passed',
        text: '已通过'
      })
    }
    return obj
  },
  // 点击table按钮
  onClickTableBtn: function (Vue, str, item) {
    let vm = this
    switch (str) {
    case 'revokeRegist':
      vm.toRevokeRegist(Vue, item)
      break
    case 'delete':
      vm.toDelete(Vue, item)
      break
    case 'start':
      vm.toStart(Vue, item)
      break
    case 'viewApplyRegist':
      vm.toViewApplyRegist(Vue, item)
      break
    case 'deploy':
      vm.toDeploy(Vue, item)
      break
    case 'maintain':
      vm.toMaintain(Vue, item)
      break
    case 'stop':
      vm.toStop(Vue, item)
      break
    case 'deleteStatus':
      vm.toDeleteStatus(Vue, item)
      break
    case 'edit':
      vm.toEdit(Vue, item)
      break
    case 'forciblyStop':
      vm.toforciblyStop(Vue, item)
      break
    }
  },
    // 去编辑
  toEdit: function (Vue, item) {
    Vue.$router.push({
      name: 'createApplication',
      query: { id: item.id }
    })
  },
  // 去应用详情
  toDetailPage: function (Vue, item) {
    // Vue.$router.push({
    //   name: 'applicationDetails',
    //   query: { id: item.id }
    // })
    window.open('#/applicationDetails?id=' + item.id + '&status_code=' + item.status_code, '_blank')
  },
  // 查看创建申请
  toViewApplyRegist (Vue, item) {
    if (item.audit_status === '0') {
      Vue.$router.push({
        name: 'createApplication',
        query: { id: item.id }
      })
    } else {
      Vue.$router.push({
        name: 'applyDetails',
        query: { id: item.id }
      })
    }
  },
  // 撤销操作
  toRevokeRegist (Vue, item) {
    let params = {
      'app_id': item.id
    }
    LoadingBoxService.open('正在撤销，请稍候...')
    apiClient.post('itsmApi/application/appRevoke', params, function (data) {
      LoadingBoxService.close()
      if (data.results.exec_result === 'true') {
        TipBoxService.open('撤销成功')
        Vue.onQuery()
      } else {
        TipBoxService.open(data.exception, 2)
      }
    })
  },
  // 物理删除
  toDelete (Vue, item) {
    Vue.$confirm('此操作将删除该服务, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      let params = { id: item.id }
      LoadingBoxService.open('正在删除，请稍候...')
      apiClient.post('/itsmApi/application/removeApp', params, function (data) {
        LoadingBoxService.close()
        if (data.results.exec_result === 'true') {
          TipBoxService.open('删除成功')
          Vue.onQuery()
        } else {
          TipBoxService.open('删除失败', 2)
        }
      })
    })
  },
  // 删除状态
  toDeleteStatus (Vue, item) {
    let params = { id: item.id }
    LoadingBoxService.open('正在删除，请稍候...')
    apiClient.post('/itsmApi/application/delApp', params, function (data) {
      LoadingBoxService.close()
      if (data.results.exec_result === 'true') {
        TipBoxService.open('删除成功')
        Vue.onQuery()
      } else {
        TipBoxService.open('删除失败', 2)
      }
    })
  },
  // 启用
  toStart (Vue, item) {
    let params = {
      'id': item.id
    }
    LoadingBoxService.open('正在启用，请稍候...')
    apiClient.post('/itsmApi/application/startApp', params, function (data) {
      LoadingBoxService.close()
      if (data.results.exec_result === 'true') {
        TipBoxService.open('启用成功')
        Vue.onQuery()
      } else {
        TipBoxService.open('启用失败', 2)
      }
    })
  },
  // 部署
  toDeploy (Vue, item) {
    let params = {
      'id': item.id
    }
    LoadingBoxService.open('正在部署，请稍候...')
    apiClient.post('/itsmApi/application/deployApp', params, function (data) {
      LoadingBoxService.close()
      if (data.results.exec_result === 'true') {
        TipBoxService.open('部署成功')
        Vue.onQuery()
      } else {
        TipBoxService.open('部署失败', 2)
      }
    })
  },
  // 维护
  toMaintain (Vue, item) {
    let params = {
      'id': item.id
    }
    LoadingBoxService.open('正在维护，请稍候...')
    apiClient.post('/itsmApi/application/maintainApp', params, function (data) {
      LoadingBoxService.close()
      if (data.results.exec_result === 'true') {
        TipBoxService.open('维护成功')
        Vue.onQuery()
      } else {
        TipBoxService.open('维护失败', 2)
      }
    })
  },
  // 停止
  toStop (Vue, item) {
    let params = {
      'id': item.id
    }
    LoadingBoxService.open('正在停止，请稍候...')
    apiClient.post('/itsmApi/application/stopApp', params, function (data) {
      LoadingBoxService.close()
      if (data.results.exec_result === 'true') {
        TipBoxService.open('停止成功')
        Vue.onQuery()
      } else {
        TipBoxService.open('停止失败', 2)
      }
    })
  },
  // 强制停止
  toforciblyStop (Vue, item) {
    let params = {
      'id': item.id
    }
    LoadingBoxService.open('正在停止，请稍候...')
    apiClient.post('/itsmApi/application/mustStopApp', params, function (data) {
      LoadingBoxService.close()
      if (data.results.exec_result === 'true') {
        TipBoxService.open('强制停止成功')
        Vue.onQuery()
      } else {
        TipBoxService.open('强制停止失败', 2)
      }
    })
  }
}
