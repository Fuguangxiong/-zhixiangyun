/**
 * Created by dell on 2017/7/14.
 */
import $ from "jquery";
export default {
  open:function (text,title) {
    var that=this;
    if(title==undefined)
      title="提示"
   this.close();
    var html='<div class="overlay" id="NoticeBoxOverlay"><div id="noticeBox" class="rc_popupBox"><div class="popupBoxHeader">'+title+
      '<i id="NoticeBoxOverlayCloseBtn" class="popupBoxCloseIconBtn"></i></div> <div class="rc_popupBoxBody">'+text+'</div> <div class="rc_popupBoxBtnContainer"><div id="NoticeBoxOverlayCancleBtn" class="popupBoxBtn hoverRed">关闭</div> '+'' +
      '</div></div></div>';
    $("body").append(html);
    var top=$("#noticeBox").height()/2;
    top=-top;
    console.info("top=",top);
    $("#noticeBox").css({marginTop:top+"px"});
    $("#NoticeBoxOverlayCloseBtn").bind("click",function (e) {
      that.close();
    });
    $("#NoticeBoxOverlayCancleBtn").bind("click",function () {
      that.close();
    });
  },
  close:function (){
    var currentoverlay=$("#NoticeBoxOverlay");
    if(currentoverlay.length>0 && currentoverlay!=null){
      $("#NoticeBoxOverlayCloseBtn").unbind("click");
      $("#NoticeBoxOverlayCancleBtn").unbind("click");
      currentoverlay.remove();
    }
  }
}
