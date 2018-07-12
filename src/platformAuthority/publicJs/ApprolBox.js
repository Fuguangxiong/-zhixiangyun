/**
 * Created by dell on 2017/7/14.
 */
import $ from "jquery";
export default {
  open:function (title,callback) {
    var that=this;
    if(title==undefined)
      title="提示"
   this.close();
    var html='<div class="overlay" id="NoticeBoxOverlay"><div id="noticeBox" class="popupBox"><div class="popupBoxHeader">'+title+
      '<i id="NoticeBoxOverlayCloseBtn" class="popupBoxCloseIconBtn"></i></div> <div class="popupBoxBody"><textarea id="approBoxText" class="approBoxText"></textarea><p id="approBoxTextTip" class="approBoxTextTip">*驳回原因不能超过50个字。</p></div> <div class="popupBoxBtnContainer"><div id="NoticeBoxOverlayCancleBtn" class="popupBoxBtn hoverRed">确定</div> '+'' +
      '</div></div></div>';
    $("body").append(html);
    var top=$("#noticeBox").height()/2;
    top=-top;
    //$("#noticeBox").css({marginTop:top+"px"});
    $("#NoticeBoxOverlayCloseBtn").bind("click",function (e) {
      that.close();
    });
    $("#NoticeBoxOverlayCancleBtn").bind("click",function () {
      //callback()
        var str=$("#approBoxText").val();
        if(str.length > 50){
        	$("#approBoxTextTip").text("您已经超过50个字！");
        }else{
        	callback(str);
        }
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
