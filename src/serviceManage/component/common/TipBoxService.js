/**
 * Created by dell on 2017/6/26.
 */
export default {
  timer: null,
  open: function(text, type, pc) {
    if ($('#publicTipBox').length > 0) {
      if (this.timer != null) {
        clearTimeout(this.timer)
      }
      $('#publicTipBox').stop().remove()
    }
    // 0正常,1错误,2警告
    if (type == undefined || type == null) {
      type = 0
    }
    var iconClass = 'success'
    var pcTipTitle = 'pcTipTitle'
    if (type == 1) {
      iconClass = 'erro'
    } else if (type == 2) {
      iconClass = 'warn'
      pcTipTitle = 'pcTipTitleRed'
    }
    var htmlStr = '<div style="z-index:999999;width:auto;max-width:400px;min-width:260px;height:auto;padding:0 15px 15px 15px;" class="publicTipBox" id="publicTipBox">' +
      '<i class="publicTipIcon ' + iconClass + '"></i><p class="publicTipText" style="line-height:26px;"> ' + text + '</p>' +
      '</div>'
    if (pc) {
      htmlStr = '<div style="z-index:999999;width:auto;max-width:400px;min-width:260px;height:auto;padding:0 15px 15px 15px;" class="pcTipBox" id="publicTipBox">' +
        '<p class=' + pcTipTitle + '>提示</p>' +
        '<i class="publicTipIcon ' + iconClass + '"></i><p class="pcTipText" style="line-height:26px;"> ' + text + '</p>' +
        '</div>'
    }
    $('body').append(htmlStr)
    this.timer = setTimeout(function() {
      $('#publicTipBox').fadeOut(1000, function() {
        $('#publicTipBox').remove()
      })
    }, 2000)
  }
}