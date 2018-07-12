/**
 * Created by dell on 2017/12/18
 */


export default {
  open:function (obj,images,callback,callback2) {
    var that=this;
   this.close();
    var html ='<div class="overlayMarket overlay" id="NoticeBoxOverlay"><div class="popupBox"><div class="popupBoxHeader">'+obj.title+''+
      '<i  id="NoticeBoxOverlayCloseBtn" class="popupBoxCloseIconBtn"></i></div> <div class="popupBoxBody ' + images + '">' + obj.content+'</div> <div class="popupBoxBtnContainer"> '+'<div class="popupBoxBtn redBg" id="NoticeBoxOverlayOkBtn">'+obj.sure+'</div>' +
      '<div id="NoticeBoxOverlayCancleBtn" class="popupBoxBtn">' + obj.cancel+'</div></div></div></div>';
    $("body").append(html);
    $("#NoticeBoxOverlayCloseBtn").bind("click",function () {
      that.close();
    });
    $("#NoticeBoxOverlayCancleBtn").bind("click",function () {
      that.close();
       try{
        callback2("cancel");
      }catch(e){
      }
    });
    $("#NoticeBoxOverlayOkBtn").bind("click",function () {
      try{
        callback("ok");
      }catch(e){
      }
    });
  },
  close:function (){
    var currentoverlay=$("#NoticeBoxOverlay");
    if(currentoverlay.length>0 && currentoverlay!=null){
      $("#NoticeBoxOverlayCloseBtn").unbind("click");
      $("#NoticeBoxOverlayCancleBtn").unbind("click");
      $("#NoticeBoxOverlayOkBtn").unbind("click");
      currentoverlay.remove();
    }
  }
}
