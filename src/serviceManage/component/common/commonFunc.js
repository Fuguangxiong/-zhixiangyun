import apiClient from '../../../publicJs/ApiClient.js'
import AlertBoxService from '../../../publicJs/AlertBoxService.js'
import TipBoxService from '../common/TipBoxService.js'
import LoadingBoxService from '../../../publicJs/LoadingBoxService.js'
// import UtilService from '../../../publicJs/UtilService.js'
export default {
  // 加角标
  addCornerIcon: function (obj) {
    if (obj.sourceType != '4' && obj.sourceType != '6') {
      let corner_icon_dic = this.getCornerIconDic(0)
      corner_icon_dic.forEach(function (m, n) {
        if (obj.service_status === m.value) {
          obj.corner = {}
          obj.corner.className = m.className
          obj.corner.text = m.label
          obj.corner.show = m.show
          return
        }
      })
    } else {
      let corner_icon_dic = this.getCornerIconDic(1)
      corner_icon_dic.forEach(function (m, n) {
        if (obj.use_status === m.value) {
          obj.corner = {}
          obj.corner.className = m.className
          obj.corner.text = m.label
          obj.corner.show = m.show
          return
        }
      })
    }
    return obj
  },
  // 加水印
  addWatermark: function (obj) {
    let watermarkClass = ''
    if (obj.sourceType != '4' && obj.sourceType != '6') {
      let watermark_dic = this.getWatermarkDic(0)
      watermark_dic.forEach(function (m, n) {
        if (obj.audit_status && obj.audit_status == m.audit_status) {
          watermarkClass = m.className
        } else if (obj.audit_status == '2') {
          if (!obj.use_status) {
            obj.use_status = ''
          }
          if (obj.use_status == m.use_status && obj.sourceType != '1' && obj.sourceType != '5') {
            watermarkClass = m.className
          }
          if (obj.login_type == 'PLATFORM' && obj.sourceType == '2') {
            watermarkClass = ''
          }
        }
      })
    } else if (obj.sourceType == '4') {
      let watermark_dic = this.getWatermarkDic(1)
      watermark_dic.forEach(function (m, n) {
        if (obj.use_status == m.use_status) {
          watermarkClass = m.className
        }
      })
    } else if (obj.sourceType == '6') {
      let watermark_dic = this.getWatermarkDic(2)
      watermark_dic.forEach(function (m, n) {
        if (obj.use_status == m.use_status) {
          watermarkClass = m.className
        }
      })
    }
    return watermarkClass
  },
  // 加右侧公共按钮
  addRightBtn: function (obj, btnArray) {
    let btn = {}
    switch (obj.sourceType) {
    case ('1'): // 企业服务
      btn = { label: '查看创建申请', str: 'viewApplyRegist' }
      break
    case ('2'): // 平台服务
      if (obj.login_type != 'PLATFORM') {
        if (obj.use_status == '0' || !obj.use_status) {
          btn = { label: '申请使用', str: 'applyUse' }
        } else {
          btn = { label: '查看使用申请', str: 'viewApplyUse' }
        }
      } else {
        btn = { label: '查看创建申请', str: 'viewApplyRegist' }
      }
      break
    case ('3'): // 第三方服务
      if (obj.login_type != 'PLATFORM') {
        if (obj.use_status == '0' || !obj.use_status) {
          btn = { label: '申请使用', str: 'applyUse' }
        } else {
          btn = { label: '查看使用申请', str: 'viewApplyUse' }
        }
      } else {
        if (obj.use_status == '1' || obj.use_status == '2' || obj.use_status == '3') {
          btn = { label: '查看使用申请', str: 'viewApplyUse' }
        } else {
          btn = { label: '查看创建申请', str: 'viewApplyRegist' }
        }
      }
      break
    case ('4'): // 待我审批
      btn = { label: '查看使用申请', str: 'viewApplyUse' }
      break
    case ('5'): // 我的注册
      if (obj.audit_status == '0') {
        btn = { label: '编辑', str: 'edit' }
      } else {
        btn = { label: '查看创建申请', str: 'viewApplyRegist' }
      }
      break
    case ('6'): // 我的申请
      if (obj.use_status == '0') {
        btn = { label: '编辑', str: 'edit' }
      } else {
        btn = { label: '查看使用申请', str: 'viewApplyUse' }
      }
      break
    }
    let isBtnNull = false
    if (btn.str != undefined) {
      for (let j = 0; j < btnArray.length; j++) {
        let rcode = this.transferBtnCode(btnArray[j].code)
        if (btn.str == rcode) {
          return btn
        }
      }
    }
    if (!isBtnNull) {
      return null
    }
  },
  // 加标签
  addTag: function (obj) {
    if (obj.sourceType == '1' || obj.sourceType == '5') {
      obj.tag = []
      if (obj.audit_status == '2') {
        obj.tag.push({
          className: 'passed',
          text: '已通过'
        })
      }
      if (obj.service_status != '5' && obj.service_status != '6' && obj.up_down_status == '1') {
        obj.tag.push({
          className: 'up',
          text: '已上架'
        })
      }
    } else if (obj.login_type == 'PLATFORM' && (obj.sourceType == '2' || obj.sourceType == '3')) {
      obj.tag = []
      if (obj.audit_status == '2') {
        obj.tag.push({
          className: 'passed',
          text: '已通过'
        })
      }
      if (obj.service_status != '5' && obj.up_down_status == '1') {
        obj.tag.push({
          className: 'up',
          text: '已上架'
        })
      }
    } else if (obj.sourceType == '4' || obj.sourceType == '6') {
      obj.tag = []
      if (obj.use_status == '3') {
        obj.tag.push({
          className: 'passed',
          text: '已通过'
        })
      }
    }
    return obj
  },
  // 加高级按钮
  addSeniorBtns: function (obj, btnArray) {
    obj.isShowSenior = false
    obj.seniorBtns = []
    let btns = []

    switch (obj.sourceType) {
    case ('1'): // 企业服务
      if (obj.audit_status == '2' && obj.service_status == '1' && obj.up_down_status == '1') {
        btns = ['stop', 'down', 'rule', 'usable', 'blind', 'viewApplyRegist']
      } else if (obj.audit_status == '2' && obj.service_status == '1' && obj.up_down_status != '1') {
        btns = ['stop', 'up', 'rule', 'usable', 'blind', 'viewApplyRegist']
      } else if (obj.audit_status == '2' && obj.service_status == '3' && obj.up_down_status == '1') {
        btns = ['start', 'down', 'modify', 'delete', 'rule', 'usable', 'blind', 'viewApplyRegist']
      } else if (obj.audit_status == '2' && obj.service_status == '3' && obj.up_down_status != '1') {
          btns = ['start', 'modify', 'delete', 'rule', 'usable', 'blind', 'viewApplyRegist']
        } else if (obj.audit_status == '2' && obj.service_status == '4' && obj.up_down_status == '1') {
          btns = ['stop', 'down', 'rule', 'usable', 'blind', 'viewApplyRegist']
        } else if (obj.audit_status == '2' && obj.service_status == '4' && obj.up_down_status != '1') {
          btns = ['stop', 'up', 'rule', 'usable', 'blind', 'viewApplyRegist']
        } else if (obj.audit_status == '2' && obj.service_status == '5' && obj.up_down_status != '1') {
          btns = ['delete', 'viewApplyRegist']
        } else if (obj.audit_status == '2' && obj.service_status == '6' && obj.up_down_status != '1') {
          btns = ['viewApplyRegist']
        } else if (obj.audit_status == '1') {
          btns = ['test', 'viewApplyRegist']
        } else if (obj.audit_status == '3') {
          if (obj.service_status == '6') {
            btns = ['viewReason', 'viewApplyRegist']
          } else {
            btns = ['edit', 'delete', 'viewReason', 'viewApplyRegist']
          }
        }
      break
    case ('2'): // 平台服务
      if (obj.login_type != 'PLATFORM') {
        if (obj.use_status == '3') {
            // btns = ['usable', 'blind', 'applyUseAgain', 'viewApplyUse'];
          btns = ['applyUseAgain', 'viewApplyUse'] // 暂不提供内部可见屏蔽设置
        } else if (obj.use_status == '1') {
          btns = ['viewApplyUse']
        } else if (obj.use_status == '0' || !obj.use_status) {
            btns = ['applyUse']
          } else if (obj.use_status == '4') {
            btns = ['viewApplyUse', 'applyUseAgain']
          } else if (obj.use_status == '2') {
            btns = ['viewApplyUse', 'applyUseAgain']
          }
      } else { // 平台用户
        if (obj.audit_status == '2' && obj.service_status == '1' && obj.up_down_status == '1') {
          btns = ['stop', 'down', 'rule', 'usable', 'blind', 'viewApplyRegist']
        } else if (obj.audit_status == '2' && obj.service_status == '1' && obj.up_down_status != '1') {
          btns = ['stop', 'up', 'rule', 'usable', 'blind', 'viewApplyRegist']
        } else if (obj.audit_status == '2' && obj.service_status == '3' && obj.up_down_status == '1') {
            btns = ['start', 'down', 'modify', 'delete', 'rule', 'usable', 'blind', 'viewApplyRegist']
          } else if (obj.audit_status == '2' && obj.service_status == '3' && obj.up_down_status != '1') {
            btns = ['start', 'modify', 'delete', 'rule', 'usable', 'blind', 'viewApplyRegist']
          } else if (obj.audit_status == '2' && obj.service_status == '4' && obj.up_down_status == '1') {
            btns = ['stop', 'down', 'rule', 'usable', 'blind', 'viewApplyRegist']
          } else if (obj.audit_status == '2' && obj.service_status == '4' && obj.up_down_status != '1') {
            btns = ['stop', 'up', 'rule', 'usable', 'blind', 'viewApplyRegist']
          } else if (obj.audit_status == '2' && obj.service_status == '5' && obj.up_down_status != '1') {
            btns = ['delete', 'viewApplyRegist']
          } else if (obj.audit_status == '2' && obj.service_status == '6' && obj.up_down_status != '1') {
            btns = ['viewApplyRegist']
          } else if (obj.audit_status == '1') {
            btns = ['test', 'viewApplyRegist']
          } else if (obj.audit_status == '3') {
            if (obj.service_status == '6') {
              btns = ['viewReason', 'viewApplyRegist']
            } else {
              btns = ['edit', 'delete', 'viewReason', 'viewApplyRegist']
            }
          }
      }
      break
    case ('3'): // 第三方服务
      if (obj.login_type != 'PLATFORM') {
        if (obj.use_status == '3') {
            // btns = ['usable', 'blind', 'applyUseAgain', 'viewApplyUse'];
          btns = ['applyUseAgain', 'viewApplyUse'] // 暂不提供内部可见屏蔽设置
        } else if (obj.use_status == '1') {
          btns = ['viewApplyUse']
        } else if (obj.use_status == '0' || !obj.use_status) {
            btns = ['applyUse']
          } else if (obj.use_status == '4') {
            btns = ['viewApplyUse', 'applyUseAgain']
          } else if (obj.use_status == '2') {
            btns = ['viewApplyUse', 'applyUseAgain']
          }
      } else {
        if (obj.audit_status == '2' && obj.use_status == '3' && obj.service_status != '5') {
          btns = ['stop', 'down', 'applyUseAgain', 'viewApplyUse']
        } else if (obj.audit_status == '2' && obj.use_status == '2' && obj.service_status != '5') {
          btns = ['stop', 'down', 'applyUseAgain', 'viewApplyUse']
        } else if (obj.audit_status == '2' && obj.use_status == '1') {
            btns = ['stop', 'down', 'viewApplyUse']
          } else if (obj.audit_status == '2' && obj.use_status == '0' && obj.service_status != '5') {
            btns = ['stop', 'down', 'applyUse']
          } else if (obj.audit_status == '2' && !obj.use_status && obj.service_status != '5') {
            btns = ['stop', 'down', 'applyUse']
          } else if (obj.audit_status == '2' && obj.use_status == '4' && obj.service_status != '5') {
            btns = ['viewApplyUse', 'applyUseAgain']
          } else if (obj.audit_status == '1') {
            btns = ['test', 'viewApplyRegist']
          } else if (obj.audit_status == '3') {
            btns = ['viewReason', 'viewApplyRegist']
          }
      }
      break
    case ('4'): // 待我审批
      if (obj.use_status == '1' || obj.use_status == '3') {
        btns = ['viewApplyUse']
      } else if (obj.use_status == '4') {
        btns = ['viewReason', 'viewApplyUse']
      }
      break
    case ('5'): // 我的注册
      if (obj.audit_status == '2' && obj.service_status == '1' && obj.up_down_status == '1') {
        btns = ['stop', 'down', 'rule', 'usable', 'blind', 'viewApplyRegist']
      } else if (obj.audit_status == '2' && obj.service_status == '1' && obj.up_down_status != '1') {
        btns = ['stop', 'up', 'rule', 'usable', 'blind', 'viewApplyRegist']
      } else if (obj.audit_status == '2' && obj.service_status == '3' && obj.up_down_status == '1') {
        btns = ['start', 'down', 'modify', 'delete', 'rule', 'usable', 'blind', 'viewApplyRegist']
      } else if (obj.audit_status == '2' && obj.service_status == '3' && obj.up_down_status != '1') {
          btns = ['start', 'modify', 'delete', 'rule', 'usable', 'blind', 'viewApplyRegist']
        } else if (obj.audit_status == '2' && obj.service_status == '4' && obj.up_down_status == '1') {
          btns = ['stop', 'down', 'rule', 'usable', 'blind', 'viewApplyRegist']
        } else if (obj.audit_status == '2' && obj.service_status == '4' && obj.up_down_status != '1') {
          btns = ['stop', 'up', 'rule', 'usable', 'blind', 'viewApplyRegist']
        } else if (obj.audit_status == '2' && obj.service_status == '5' && obj.up_down_status != '1') {
          btns = ['delete', 'viewApplyRegist']
        } else if (obj.audit_status == '2' && obj.service_status == '6' && obj.up_down_status != '1') {
          btns = ['viewApplyRegist']
        } else if (obj.audit_status == '1') {
          btns = ['test', 'revokeRegist', 'viewApplyRegist']
        } else if (obj.audit_status == '3') {
          if (obj.service_status == '6') {
            btns = ['viewReason', 'viewApplyRegist']
          } else {
            btns = ['edit', 'delete', 'viewReason', 'viewApplyRegist']
          }
        } else if (obj.audit_status == '0') {
          btns = ['edit', 'delete']
        }
      break
    case ('6'): // 我的申请
      if (obj.use_status == '3') {
        if (obj.login_type != 'PERSONAL') {
            // btns = ['usable', 'blind', 'viewApplyUse', 'applyUseAgain'];
          btns = ['applyUseAgain', 'viewApplyUse'] // 暂不提供内部可见屏蔽设置
        } else {
          btns = ['viewApplyUse', 'applyUseAgain']
        }
      } else if (obj.use_status == '1') {
        btns = ['revokeUse', 'viewApplyUse']
      } else if (obj.use_status == '4') {
        btns = ['viewReason', 'edit', 'viewApplyUse']
      } else if (obj.use_status == '0') {
          btns = ['edit', 'delete']
        } else if (obj.use_status == '2') {
          btns = ['viewApplyUse', 'applyUseAgain']
        }
      break
    }
    // obj.seniorBtns = btns;
    for (let i = 0; i < btns.length; i++) {
      for (let j = 0; j < btnArray.length; j++) {
        let rcode = this.transferBtnCode(btnArray[j].code)
        if (btns[i] == rcode) {
          obj.seniorBtns.push(rcode)
        }
      }
    }

    return obj
  },
  // 按钮的权限码转换
  transferBtnCode: function (code) {
    let rcode = ''
    let transfer_btn_dic = this.transferBtnDic()
    transfer_btn_dic.forEach(function (v, i) {
      if (v.authority_code == code) {
        rcode = v.code
      }
    })
    return rcode
  },
  // 点击table按钮
  onClickTableBtn: function (Vue, str, item) {
    let vm = this
    switch (str) {
    case 'test':
      window.open('#/invoke?previewTag=1&id=' + item.id, '_blank')
      break
    case 'edit':
      vm.toEdit(Vue, item)
      break
    case 'modify':
      vm.toModify(Vue, item)
      break
    case 'revokeRegist':
      vm.toRevokeRegist(Vue, item)
      break
    case 'revokeUse':
      vm.toRevokeUse(Vue, item)
      break
    case 'delete':
      vm.toDelete(Vue, item)
      break
    case 'stop':
      vm.toStartOrStop(Vue, item)
      break
    case 'start':
      vm.toStartOrStop(Vue, item)
      break
    case 'up':
      vm.toUpOrDown(Vue, item)
      break
    case 'down':
      vm.toUpOrDown(Vue, item)
      break
    case 'blind':
      vm.toSetBlind(Vue, item)
      break
    case 'usable':
      vm.toSetUsable(Vue, item)
      break
    case 'rule':
      vm.toSetRule(Vue, item)
      break
    case 'applyUse':
      vm.toApplyUse(Vue, item, false)
      break
    case 'applyUseAgain':
      vm.toApplyUse(Vue, item, true)
      break
    case 'viewApplyRegist':
      vm.toViewApplyRegist(Vue, item)
      break
    case 'viewApplyUse':
      vm.toViewApplyUse(Vue, item)
      break
    case 'viewReason':
      vm.toViewReason(item)
      break
    }
  },
  // 点击详细信息
  onClickTableDetail: function (Vue, str, item) {
    switch (str) {
    case 'schemeInfo':
      if (item.scheme_id != undefined && item.scheme_id != '') {
        Vue.isShowSchemeInfo = true
        Vue.serviceData = Object.assign({}, item)
      } else if (item.scheme_info.scheme_id != undefined && item.scheme_info.scheme_id != '') {
        Vue.isShowSchemeInfo = true
        Vue.serviceData.scheme_id = item.scheme_info.scheme_id
        Vue.serviceData.apply_time = item.user_info.apply_time
      }
      break
    case 'userNumInfo':
      Vue.$router.push({
        name: 'userNumInfo',
        query: { id: item.id }
      })
      break
    }
  },
  // 编辑
  toEdit: function (Vue, item) {
    // 企业服务、已注册服务编辑服务
    if (item.sourceType === '1' || item.sourceType === '2' || item.sourceType === '5') {
      let name = ''
      if (item.isatomic === 'false') { // 组合服务
        if (item.change_id && item.change_id.length) {
          name = 'compositeServiceModify' // 变更的编辑
        } else {
          name = 'compositeServicePage' // 创建的编辑
        }
      } else { // 原子服务
        if (item.change_id && item.change_id.length) {
          name = 'atomServiceModify' // 变更的编辑
        } else {
          name = 'newServicePage' // 创建的编辑
        }
      }
      Vue.$router.push({
        name: name,
        query: { id: item.id, source_type: Vue.sourceType }
      })
    }
    // 已申请服务编辑申请
    else if (item.sourceType == '6') {
      item.fromEdit = true
      Vue.openApplyUse(item)
    }
  },
  // 变更
  toModify: function (Vue, item) {
    let vm = this
    LoadingBoxService.open('正在检测,请稍候')
    apiClient.post('itsmApi/createService/validateCopy', { serviceId: item.id }, function (data) {
      LoadingBoxService.close()
      if (data.status == 200) {
        vm.toModifyAction(Vue, item)
      } else if (data.status == 503) {
        TipBoxService.open('该服务正在变更中！', 2)
      } else {
        TipBoxService.open(data.exception, 2)
      }
    })
  },
  toModifyAction: function (Vue, item) {
    Vue.$confirm('是否确定变更当前记录?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        LoadingBoxService.open('正在复制服务,请稍候')
        apiClient.post('itsmApi/atomicService/copyService', { serviceId: item.id }, function (data) {
          LoadingBoxService.close()
          if (data.status == 200) {
            let changeId = data.results.id
            if (item.isatomic == 'false') {
              Vue.$router.push({
                name: 'compositeServiceModify', // 组合服务
                query: { id: changeId, source_type: Vue.sourceType }
              })
            } else {
              Vue.$router.push({
                name: 'atomServiceModify',
                query: { atomicId: changeId, source_type: Vue.sourceType }
              })
            }
          } else {
            TipBoxService.open(data.exception, 2)
          }
        })
      })
  },
  // 撤消注册
  toRevokeRegist: function (Vue, item) {
    let params = {
      id: item.id
    }
    LoadingBoxService.open('正在撤销，请稍候...')
    apiClient.post('itsmApi/atomicService/revoke', params, function (data) {
      LoadingBoxService.close()
      if (data.status == '200') {
        TipBoxService.open('撤销成功')
        Vue.onQuery()
      } else {
        TipBoxService.open(data.exception, 2)
      }
    })
  },
  // 撤消申请
  toRevokeUse: function (Vue, item) {
    let params = {
      id: item.apply_id
    }
    LoadingBoxService.open('正在撤销，请稍候...')
    apiClient.post('itsmApi/applyInfo/revokeApply', params, function (data) {
      LoadingBoxService.close()
      if (data.status == '200') {
        TipBoxService.open('撤销成功')
        Vue.onQuery()
      } else {
        TipBoxService.open(data.exception, 2)
      }
    })
  },
  // 删除
  toDelete: function (Vue, item) {
    Vue.$confirm('此操作将删除该服务, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        if (Vue.sourceType == '6') {
          let params = { id: item.apply_id, use_status: item.use_status }
          LoadingBoxService.open('正在删除，请稍候...')
          apiClient.post('itsmApi/applyInfo/deleteApplyInfo', params, function (data) {
            LoadingBoxService.close()
            if (data.status == '200') {
              TipBoxService.open('删除成功')
              Vue.onQuery()
            } else {
              TipBoxService.open(data.exception, 2)
            }
          })
        } else {
          let params = {
            serviceId: item.id,
            removeType: item.audit_status == '0' ? '1' : '2' // 1-物理删除，2-逻辑删除
          }
          LoadingBoxService.open('正在删除，请稍候...')
          apiClient.post('itsmApi/atomicService/removeServiceInfo', params, function (data) {
            LoadingBoxService.close()
            if (data.status == '200') {
              TipBoxService.open('删除成功')
              Vue.onQuery()
            } else {
              TipBoxService.open(data.exception, 2)
            }
          })
        }
      })
  },
  // 上下架
  toUpOrDown: function (Vue, item) {
    let up_down_status = item.up_down_status == '0' ? '1' : '0'
    let text = up_down_status == '0' ? '下架' : '上架'
    let param = {
      serviceId: item.id,
      fieldName: 'up_down_status',
      fieldValue: up_down_status,
      fieldType: 'string'
    }
    LoadingBoxService.open('正在操作，请稍候...')
    apiClient.post('itsmApi/enterprisePlatform/updateServiceForOneField', param, function (data) {
      LoadingBoxService.close()
      if (data.status == '200') {
        TipBoxService.open('已' + text)
        Vue.onQuery()
      } else {
        TipBoxService.open(data.exception, 2)
      }
    })
  },
  // 启用停用
  toStartOrStop: function (Vue, item) {
    let status = item.service_status == '1' ? '3' : '1'
    let text = status == '1' ? '启用' : '停用'
    let param = {
      serviceId: item.id,
      serviceStatus: status,
      app_id: item.app_id
    }
    LoadingBoxService.open('正在操作，请稍候...')
    apiClient.post('itsmApi/atomicService/startAndStop', param, function (data) {
      LoadingBoxService.close()
      if (data.status == '200') {
        TipBoxService.open('已' + text)
        Vue.onQuery()
      } else {
        TipBoxService.open(data.exception, 2)
      }
    })
  },
  // 可见设置
  toSetUsable: function (Vue, item) {
    if (Vue.sourceType != '6') {
      Vue.vueObj = item
      Vue.isShowUsableDialog = true
      Vue.visibilityType = 1
      Vue.visibilitySetCatagory = 2
      Vue.title = '可见设置'
    } else {
      Vue.$alert('抱歉，该功能尚未开放！', '提示', {
        confirmButtonText: '确定',
        callback: action => {}
      })
    }
  },
  // 屏蔽设置
  toSetBlind: function (Vue, item) {
    Vue.title = '屏蔽设置'
    Vue.vueObj = item
    Vue.isShowUsableDialog = true
    Vue.visibilityType = 2
    Vue.visibilitySetCatagory = 2
  },
  // 计费规则
  toSetRule: function (Vue, item) {
    Vue.vueObj = item
    Vue.isShowChargeDialog = true
  },
  // 申请使用
  toApplyUse: function (Vue, item, again) {
    Vue.serviceData = item
    if (again) {
      apiClient.post('itsmApi/applyInfo/checkApply', { service_id: item.id }, function (data) {
        if (data.status == 200) {
          console.log('申请使用', data)
          Vue.serviceData.isApplyAgain = again
          if (data.flag && Vue.serviceData.use_status == '2') {
            Vue.$confirm('该服务已经申请通过, 是否确认再次申请？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            })
              .then(() => {
                let newInfo = Object.assign({}, data.results)
                Vue.serviceData.use_status = newInfo.use_status
                Vue.serviceData.scheme_id = newInfo.scheme_id
                Vue.serviceData.apply_id = newInfo.id
                Vue.isShowPlans = true
              })
          } else {
            Vue.isShowPlans = true
          }
        } else {
          TipBoxService.open(data.exception, 2)
        }
      })
    } else {
      Vue.isShowPlans = true
    }
  },
  // 查看注册申请
  toViewApplyRegist: function (Vue, item) {
    if (item.isatomic == 'false') {
      Vue.$router.push({
        name: 'compositeServiceApproval',
        query: { id: item.id, source_type: item.sourceType, change_id: item.change_id }
      })
    } else {
      Vue.$router.push({
        name: 'atomServiceApproval',
        query: { id: item.id }
      })
    }
  },
  // 查看申请使用
  toViewApplyUse: function (Vue, item) {
    Vue.openApplyUse(item)
  },
  // 查看原因
  toViewReason: function (item) {
    var myData = {}
    if (item.apply_id != undefined && item.apply_id != '') {
      myData.appSubjectIdl = item.apply_id
    } else {
      myData.appSubjectIdl = item.id
    }
    apiClient.post(
      'itsmApi/businessProcess/notPassProcess', myData,
      function (data) {
        console.info('弹框数据=', data)
        var msg = data.results.result[0].audit_remark
        if (msg == '') msg = '无未通过原因'
        AlertBoxService.open(msg)
      }
    )
  },
  // 查看服务详情
  toDetailPage: function (item, btnArray) {
    // let showBtns = [];
    // let btns = item.seniorBtns;
    // if (btns != undefined && btns != null && btns.length > 0) {
    //   for (let i = 0; i < btns.length; i++) {
    //     for (let j = 0; j < btnArray.length; j++) {
    //       let rcode = this.transferBtnCode(btnArray[j].code);
    //       if (btns[i] == rcode) {
    //         showBtns.push(rcode);
    //       }
    //     }
    //   }
    // }
    // var key_btn = UtilService.uuid()
    // sessionStorage.setItem(
    //   key_btn,
    //   JSON.stringify(showBtns)
    // )

    if (item.isatomic == 'false') {
      // window.open("#/compositeServiceDetail?id=" + item.id + "&btnKey=" + key_btn + "&source_type=" + item.sourceType, "_blank");
      if (item.change_id) {
        window.open('#/compositeServiceDetail?id=' + item.id + '&isModify=' + 1 + '&source_type=' + item.sourceType, '_blank')
      } else {
        window.open('#/compositeServiceDetail?id=' + item.id + '&source_type=' + item.sourceType, '_blank')
      }
    } else {
      window.open(
        // "#/atomServiceDetail?id=" + item.id + "&audit_status=" + item.audit_status + "&btnKey=" + key_btn,"_blank"
        '#/atomServiceDetail?id=' + item.id + '&audit_status=' + item.audit_status + '&source_type=' + item.sourceType, '_blank'
      )
    }
  },
  // 获取方案类型文字
  getRestrictType: function (str) {
    let list = [
      { label: '每天', value: '1' },
      { label: '每周', value: '2' },
      { label: '每月', value: '3' },
      { label: '每季', value: '4' },
      { label: '半年', value: '5' },
      { label: '每年', value: '6' }
    ]
    let restrict_type = ''
    list.forEach(function (v, i) {
      if (str == v.value) {
        restrict_type = v.label
        return
      }
    })
    return restrict_type
  },
  // 获取方案收费标准文字
  getFeeStandard: function (str) {
    let list = [
      { label: '每次', value: '1' },
      { label: '每天', value: '2' },
      { label: '每月', value: '3' }
    ]
    let fee_standard = ''
    list.forEach(function (v, i) {
      if (str === v.value) {
        fee_standard = v.label
        return
      }
    })
    return fee_standard
  },
  // 获取服务类型文字
  getApptype: function (str) {
    let list = this.getApptypeDic()
    let apptype = ''
    list.forEach(function (v, i) {
      if (str == v.value) {
        apptype = v.label
        return
      }
    })
    return apptype
  },
  // 获取服务归属文字
  getBelongType: function (str) {
    let list = this.getBelongTypeDic()
    let belong_type = ''
    list.forEach(function (v, i) {
      if (str == v.value) {
        belong_type = v.label
        return
      }
    })
    return belong_type
  },
  // 获取服务来源文字
  getSourceType: function (str) {
    let list = this.getSourceTypeDic()
    let sourceType = ''
    list.forEach(function (v, i) {
      if (str == v.value) {
        sourceType = v.label
        return
      }
    })
    return sourceType
  },
  // 角标字典
  getCornerIconDic: function (type) {
    let corner_icon_dic = []
    corner_icon_dic[0] = [
      { label: '正常', value: '1', show: false, className: '' },
      { label: '待开通', value: '2', show: false, className: '' },
      { label: '关闭', value: '3', show: true, className: 'closed' },
      { label: '异常', value: '4', show: true, className: 'abnormal' },
      { label: '过期', value: '5', show: true, className: 'expired' },
      { label: '删除', value: '6', show: true, className: 'deleted' }
    ]
    corner_icon_dic[1] = [
      { label: '过期', value: '2', show: true, className: 'expired' }
    ]
    return corner_icon_dic[type]
  },
  // 水印字典
  getWatermarkDic: function (type) {
    let watermark_dic = []
    watermark_dic[0] = [
        { label: '审核中', audit_status: '1', className: 'processing' },
        { label: '未通过', audit_status: '3', className: 'unPass' },
        { label: '未申请', use_status: '', className: 'beforeApply' },
        { label: '未申请', use_status: '0', className: 'beforeApply' },
        { label: '申请中', use_status: '1', className: 'appling' }
    ]
      // 待我审批
    watermark_dic[1] = [
        { label: '待审核', use_status: '1', className: 'waiting' },
        { label: '未通过', use_status: '4', className: 'unPass' }
    ]
      // 我的申请
    watermark_dic[2] = [
      { label: '审核中', use_status: '1', className: 'processing' },
      { label: '未通过', use_status: '4', className: 'unPass' }
    ]
    return watermark_dic[type]
  },
  // 服务归属字典
  getBelongTypeDic: function (array) {
    let belong_type_dic = [
      { label: '全部', value: '' },
      { label: '企业', value: 'ENTERPRISE' },
      { label: '平台', value: 'PLATFORM' },
      { label: '个人', value: 'PERSONAL' }
    ]
    if (array) {
      belong_type_dic.forEach(function (v, i) {
        if ($.inArray(v.label, array) != -1) { belong_type_dic.splice(i, 1) }
      })
    }
    return belong_type_dic
  },
  // 服务来源字典
  getSourceTypeDic: function (array) {
    let source_type_dic = [
      { label: '全部', value: '' },
      { label: '企业服务', value: '1' },
      { label: '平台服务', value: '2' },
      { label: '第三方服务', value: '3' }
    ]
    if (array) {
      source_type_dic.forEach(function (v, i) {
        if ($.inArray(v.label, array) != -1) { source_type_dic.splice(i, 1) }
      })
    }
    return source_type_dic
  },
  // 服务状态字典
  getServiceStatusDic: function (array) {
    let service_status_dic = [
      { label: '全部', value: '' },
      { label: '正常', value: '1' },
      { label: '待开通', value: '2' },
      { label: '关闭', value: '3' },
      { label: '异常', value: '4' },
      { label: '已过期', value: '5' },
      { label: '已删除', value: '6' }
    ]
    if (array) {
      service_status_dic.forEach(function (v, i) {
        if ($.inArray(v.label, array) != -1) { service_status_dic.splice(i, 1) }
      })
    }
    return service_status_dic
  },
  // 审批状态字典
  getAuditStatusDic: function (array) {
    let audit_status_dic = [
      { label: '全部', value: '' },
      { label: '未提交', value: '0' },
      { label: '审核中', value: '1' },
      { label: '已通过', value: '2' },
      { label: '未通过', value: '3' }
    ]
    if (array) {
      audit_status_dic.forEach(function (v, i) {
        if ($.inArray(v.label, array) != -1) { audit_status_dic.splice(i, 1) }
      })
    }
    return audit_status_dic
  },
  // 方案状态字典
  getChargeStatusDic: function (array) {
    let charge_status_dic = [
      { label: '全部', value: '' },
      { label: '草稿', value: '0' },
      { label: '已发布', value: '1' },
      { label: '已过期', value: '4' },
      { label: '已删除', value: '3' }
    ]
    return charge_status_dic
  },
  // 服务类型字典
  getApptypeDic: function () {
    let apptype_dic = [
      { label: '全部', value: '' },
      { label: '远程服务', value: '1' },
      { label: '应用服务', value: '2' },
      { label: '组合服务', value: '3' }
    ]
    return apptype_dic
  },
  // 上下架状态字典
  getUpDownDic: function () {
    let up_down_dic = [
      { label: '全部', value: '' },
      { label: '已下架', value: '0' },
      { label: '已上架', value: '1' }
    ]
    return up_down_dic
  },
  // 申请状态字典
  getIsAppliedDic: function (array) {
    let isApplied_dic = [
      { label: '全部', value: '' },
      { label: '已申请', value: '1' },
      { label: '申请中', value: '2' },
      { label: '未申请', value: '0' }
    ]
    if (array) {
      isApplied_dic.forEach(function (v, i) {
        if ($.inArray(v.label, array) != -1) { isApplied_dic.splice(i, 1) }
      })
    }
    return isApplied_dic
  },
  // 待我审批--使用审批状态字典
  getUseStatusDic: function (array, isApplied) {
    let use_status_dic = [
      { label: '全部', value: '' },
      { label: '未提交', value: '0' },
      { label: '待审核', value: '1' },
      { label: '已过期', value: '2' },
      { label: '已通过', value: '3' },
      { label: '未通过', value: '4' }
    ]
    if (isApplied) {
      use_status_dic[2].label = '审核中'
    }
    if (array) {
      use_status_dic.forEach(function (v, i) {
        if ($.inArray(v.label, array) != -1) { use_status_dic.splice(i, 1) }
      })
    }
    return use_status_dic
  },
  // 按钮的权限码表字典
  transferBtnDic: function () {
    let transfer_btn_dic = [
      { authority_code: 'sc_stop', code: 'stop' },
      { authority_code: 'sc_start', code: 'start' },
      { authority_code: 'sc_up', code: 'up' },
      { authority_code: 'sc_down', code: 'down' },
      { authority_code: 'sc_sevDelete', code: 'delete' },
      { authority_code: 'sc_sevUsable', code: 'usable' },
      { authority_code: 'sc_sevBlind', code: 'blind' },
      { authority_code: 'sc_sevRule', code: 'rule' },
      { authority_code: 'sc_viewApplyRegist', code: 'viewApplyRegist' },
      { authority_code: 'sc_viewApplyUse', code: 'viewApplyUse' },
      { authority_code: 'sc_viewReason', code: 'viewReason' },
      { authority_code: 'sc_sevEditRegist', code: 'edit' },
      { authority_code: 'sc_sevModify', code: 'modify' },
      { authority_code: 'sc_test', code: 'test' },
      { authority_code: 'sc_revokeRegist', code: 'revokeRegist' },
      { authority_code: 'sc_applyUse', code: 'applyUse' },
      { authority_code: 'sc_applyUseAgain', code: 'applyUseAgain' },
      { authority_code: 'sc_innerUsable', code: 'innerUsable' },
      { authority_code: 'sc_innerBlind', code: 'innerBlind' },
      { authority_code: 'sc_sevDeleteUse', code: 'delete' },
      { authority_code: 'sc_sevEditUse', code: 'edit' },
      { authority_code: 'sc_revokeUse', code: 'revokeUse' }
    ]
    return transfer_btn_dic
  },
  // 按钮的权限码表字典
  getBtnItem: function (code) {
    let btnItem = {}
    let btn_dic = [
      // { label: "测试", code: "test" , str: "icon-ceshi" },
      { label: '编辑', code: 'edit', icon: 'icon-bianji2' },
      { label: '变更', code: 'modify', icon: 'icon-change' },
      { label: '撤消', code: 'revokeRegist', icon: 'icon-chexiao2' },
      { label: '撤消', code: 'revokeUse', icon: 'icon-chexiao1' },
      { label: '删除', code: 'delete', icon: 'icon-3' },
      { label: '停用', code: 'stop', icon: 'icon-suo' },
      { label: '启用', code: 'start', icon: 'icon-able' },
      { label: '上架', code: 'up', icon: 'icon-shelve' },
      { label: '下架', code: 'down', icon: 'icon-unshelve' },
      { label: '可见设置', code: 'usable', icon: 'icon-kejian1' },
      { label: '屏蔽设置', code: 'blind', icon: 'icon-pingbi' },
      { label: '计费规则', code: 'rule', icon: 'icon-xuefeishoujiaotongji' },
      { label: '申请使用', code: 'applyUse', icon: 'icon-xinshenqing' },
      { label: '再次申请', code: 'applyUseAgain', icon: 'icon-jiekuanshenqing' },
      { label: '查看创建申请', code: 'viewApplyRegist', icon: 'icon-chakanshenqing' },
      { label: '查看使用申请', code: 'viewApplyUse', icon: 'icon-chakan1' },
      { label: '查看原因', code: 'viewReason', icon: 'icon-zl_yuanyin' },
      { label: '发布', code: 'release', icon: 'icon-fabu' }
    ]
    if (code != undefined && code != null && code != '') {
      for (let index in btn_dic) {
        let item = btn_dic[index]
        if (item.code == code) {
          btnItem = item
          break
        }
      }
    }
    return btnItem
  },

  /**
   * 格式化日期
   *
   * 参数：
   * time：long类型日期
   * format：格式(yyyy-MM-dd HH:mm:ss)
   */
  formatDate: function (time, format) {
    var t = new Date(parseInt(time))
    var tf = function (i) { return (i < 10 ? '0' : '') + i }
    return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function (a) {
      switch (a) {
      case 'yyyy':
        return tf(t.getFullYear())
        break
      case 'MM':
        return tf(t.getMonth() + 1)
        break
      case 'mm':
        return tf(t.getMinutes())
        break
      case 'dd':
        return tf(t.getDate())
        break
      case 'HH':
        return tf(t.getHours())
        break
      case 'ss':
        return tf(t.getSeconds())
        break
      }
    })
  },
  onClickLable: function (Vue, str, item) {
    // 'test 测试 icon-ceshi','delete删除 icon-3', 'stop 停用 icon-suo',
    // 'down下架 icon-unshelve','up 上架 icon-shelve ','start 开始 icon-able',
    // 'rule计费规则 icon-xuefeishoujiaotongji' , 'usable可见性 icon-kejian1',
    // 'blind 屏蔽 icon-pingbi', 'viewApplyRegist 查看申请 icon-chakanshenqing'，
    // 'modify 修改 icon-bianji2'，'viewReason 查看原因 icon-zl_yuanyin'
    let vm = this
    switch (str) {
    case 'icon-ceshi':
      window.open('#/invoke?previewTag=1&id=' + item.id, '_blank')
      break
    case 'icon-bianji2':
      vm.toEdit(Vue, item)
      break
    case 'icon-bianji2':
      vm.toModify(Vue, item)
      break
    case 'revokeRegist':
      vm.toRevokeRegist(Vue, item)
      break
    case 'revokeUse':
      vm.toRevokeUse(Vue, item)
      break
    case 'icon-3':
      vm.toDelete(Vue, item)
      break
    case 'icon-suo':
      vm.toStartOrStop(Vue, item)
      break
    case 'icon-able':
      vm.toStartOrStop(Vue, item)
      break
    case 'icon-shelve':
      vm.toUpOrDown(Vue, item)
      break
    case 'icon-unshelve':
      vm.toUpOrDown(Vue, item)
      break
    case 'icon-pingbi':
      vm.toSetBlind(Vue, item)
      break
    case 'icon-kejian1':
      vm.toSetUsable(Vue, item)
      break
    case 'icon-xuefeishoujiaotongji':
      vm.toSetRule(Vue, item)
      break
    case 'applyUse':
      vm.toApplyUse(Vue, item, false)
      break
    case 'applyUseAgain':
      vm.toApplyUse(Vue, item, true)
      break
    case 'icon-chakanshenqing':
      vm.toViewApplyRegist(Vue, item)
      break
    case 'viewApplyUse':
      vm.toViewApplyUse(Vue, item)
      break
    case 'icon-zl_yuanyin':
      vm.toViewReason(item)
      break
    }
  },
  isEmptyObject: function (e) {
    var t
    for (t in e) { return !1 }
    return !0
  }
}
