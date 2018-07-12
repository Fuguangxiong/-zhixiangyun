/**
 * Created by dell on 2017/9/5.
 */
function LeapYear (intYear) {
  if (intYear % 100 == 0) {
    if (intYear % 400 == 0) {
      return true
    }
  } else {
    if ((intYear % 4) == 0) {
      return true
    }
  }
  return false
}
function GetVerifyBit (id) {
  var result
  var nNum = eval(id.charAt(0) * 7 + id.charAt(1) * 9 + id.charAt(2) * 10 +
    id.charAt(3) * 5 + id.charAt(4) * 8 + id.charAt(5) * 4 +
    id.charAt(6) * 2 + id.charAt(7) * 1 + id.charAt(8) * 6 +
    id.charAt(9) * 3 + id.charAt(10) * 7 + id.charAt(11) * 9 +
    id.charAt(12) * 10 + id.charAt(13) * 5 + id.charAt(14) * 8 +
    id.charAt(15) * 4 + id.charAt(16) * 2)
  nNum = nNum % 11
  switch (nNum) {
  case 0:
    result = '1'
    break
  case 1:
    result = '0'
    break
  case 2:
    result = 'X'
    break
  case 3:
    result = '9'
    break
  case 4:
    result = '8'
    break
  case 5:
    result = '7'
    break
  case 6:
    result = '6'
    break
  case 7:
    result = '5'
    break
  case 8:
    result = '4'
    break
  case 9:
    result = '3'
    break
  case 10:
    result = '2'
    break
  }
  return result
}
export default {
  getQueryString: function (name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
    var r = window.location.search.substr(1).match(reg)
    if (r != null) return decodeURIComponent(r[2])
    return null
  },
  regMail: function (param) {
    var regMail = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/
    if (!regMail.test(param)) {
      return false
    } else {
      return true
    }
  },
  regPhone: function (param) {
    var regPhone = /^((0\d{2,3}-\d{7,8})|(1[35784]\d{9}))$/
    if (!regPhone.test(param)) {
      return false
    } else {
      return true
    }
  },
  regOfficePhone: function (param) {
    var regOfficePhone = /^(0\d{2,3}-\d{7,8})$/
    if (!regOfficePhone.test(param)) {
      return false
    } else {
      return true
    }
  },
  regIDCard: function (param) {
    var regIDCard = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
    if (!regIDCard.test(param)) {
      return false
    } else {
      return true
    }
  },
  regUserName: function (param) {
    var regUserName = /^[A-Za-z\u4e00-\u9fa5]+$/
    if (!regUserName.test(param)) {
      return false
    } else {
      return true
    }
  },
  regChinaName: function (param) {
    var regChinaName = /^[\u4E00-\u9FA5]{2,15}$/
    if (!regChinaName.test(param)) {
      return false
    } else {
      return true
    }
  },
  trimStr: function (str) {
    return str.replace(/(^\s*)|(\s*$)/g, '')
  },
  checkIdCard: function (idCard) {
    var SystemDate = new Date()
    var year = SystemDate.getFullYear()
    var month = SystemDate.getMonth() + 1
    var day = SystemDate.getDate()
    var yyyy // 年
    var mm // 月
    var dd // 日
    var birthday // 生日
    var sex // 性别
    var id = idCard
    var id_length = id.length
    if (id_length == 0) {
      // alert("请输入身份证号码!");
      return false
    }
    if (id_length != 15 && id_length != 18) {
      // alert("身份证号长度应为15位或18位！");
      return false
    }
    if (id_length == 15) {
      for (var i = 0; i < id_length; i++) {
        if (isNaN(idCard.charAt(i))) {
          // alert("15位身份证号中不能有字符！");
          return false
        }
      }
      yyyy = '19' + id.substring(6, 8)
      mm = id.substring(8, 10)
      dd = id.substring(10, 12)
      if (mm > 12 || mm <= 0) {
        // alert("身份证号月份非法！");
        return false
      }
      if (dd > 31 || dd <= 0) {
        // alert("身份证号日期非法！");
        return false
      }
      // 4,6,9,11月份日期不能超过30
      if ((mm == 4 || mm == 6 || mm == 9 || mm == 11) && (dd > 30)) {
        // alert("身份证号日期非法！");
        return false
      }
      // 判断2月份
      if (mm == 2) {
        if (LeapYear(yyyy)) {
          if (dd > 29) {
            // alert("身份证号日期非法！");
            return false
          }
        } else {
          if (dd > 28) {
            // alert("身份证号日期非法！");
            return false
          }
        }
      }
    } else {
      for (var i = 0; i < id_length - 1; i++) {
        if (isNaN(idCard.charAt(i))) {
          // alert("身份证号中前17位中不能有字符！");
          return false
        }
      }
      if (isNaN(idCard.charAt(17)) && idCard.charAt(17) != 'X' &&
        idCard.charAt(17) != 'x') {
        // alert("身份证校验错误，请认真检查！");
        return false
      }
      if (idCard.indexOf('X') > 0 && idCard.indexOf('X') != 17 ||
        idCard.indexOf('x') > 0 && idCard.indexOf('x') != 17) {
        // alert("身份证中\"X\"输入位置不正确！");
        return false
      }
      yyyy = id.substring(6, 10)
      if (yyyy > year || yyyy < 1900) {
        // alert("身份证号年度非法！");
        return false
      }
      mm = id.substring(10, 12)
      if (mm > 12 || mm <= 0) {
        // alert("身份证号月份非法！");
        return false
      }
      if (yyyy == year && mm > month) {
        // alert("身份证号月份非法！");
        return false
      }
      dd = id.substring(12, 14)
      if (dd > 31 || dd <= 0) {
        // alert("身份证号日期非法！");
        return false
      }
      // 4,6,9,11月份日期不能超过30
      if ((mm == 4 || mm == 6 || mm == 9 || mm == 11) && (dd > 30)) {
        // alert("身份证号日期非法！");
        return false
      }
      // 判断2月份
      if (mm == 2) {
        if (LeapYear(yyyy)) {
          if (dd > 29) {
            // alert("身份证号日期非法！");
            return false
          }
        } else {
          if (dd > 28) {
            // alert("身份证号日期非法！");
            return false
          }
        }
      }
      if (yyyy == year && mm == month && dd > day) {
        // alert("身份证号日期非法！");
        return false
      }
      if (id.charAt(17) == 'x' || id.charAt(17) == 'X') {
        if (GetVerifyBit(id) != 'x' && GetVerifyBit(id) != 'X') {
          // alert("身份证校验错误，请认真检查！");
          return false
        }
      } else {
        if (id.charAt(17) != GetVerifyBit(id)) {
          // alert("身份证校验错误，请认真检查！");
          return false
        }
      }
    }
    return true
  }
}
