<template>
  <div class="pageGen-boxBody" id="boxBody">
    <div class="publicNav">
      <span class="hand" @click="toMain()"></span>
      <span class="active">服务管理</span>
      <span class="arrows">></span>
      <span class="active">页面配置</span>
      <div class="pageGen-Iptboxer pageGen-fl"></div>
    </div>
    <div class="pageGen-boxst" :style="{'height':(fullHeight-160) +'px'}">
      <!-- 左侧 -->
      <div class="pageGen-Left" :style="{'height':(fullHeight-160) +'px'}">
        <div class="pageGen-treeOuter">
          <h2>{{title}}</h2>
          <div class="pageGen-scrol">
            <ul class="pageGen-tul" id="gallery">
              <li class="pageGen-liNoChild draggable" v-for="myServer in myServerList" :id="myServer.BlockId">
                <h3>{{myServer.BlockContent.trim()}}</h3>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <!-- 右侧 -->
      <div class="pageGen-Right" :style="{'height':(fullHeight-160) +'px'}">
        <div class="pageGen-rightBody">
          <div class="pageGen-rightBody-con">
          </div>
          <div>
            <b class="pageGen-iconAdd" @click="addArea"></b>
          </div>
          <div class="buttnet">
            <span class="butonst" @click="saveTemplate('1')">暂&nbsp;存</span>
            <!-- <span class="butonpre" @click="previewHandler">预&nbsp;览</span> -->
            <span class="butonstdelet" @click="goBack()">上一步</span>
            <span class="butonstred" @click="saveTemplate('2')">提交审核</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import $ from "jquery";
  import JqUI from "../../lib/jquery-ui.min.js";
  import apiToken from "../../../publicJs/apiToken.js";
  import apiClient from "../../../publicJs/ApiClient.js";
  import TipBoxService from "../common/TipBoxService.js";
  import LoadingBoxService from "../../../publicJs/LoadingBoxService.js";
  import NoticeBoxService from "../../../publicJs/NoticeBoxService.js";
  export default {
    name: "pageGen",
    components: {},
    data() {
      return {
        num: 0,
        modelCounter: 0,
        title: "",
        DIYBoxId: Date.parse(new Date()) * 1000, // div标识
        draggableFlag: false, //是否处于拖拽状态
        mouseoverId: "",
        myServerList: [],
        serverList: [],
        sev_id: this.$route.query.id,
        fullHeight: document.documentElement.clientHeight,
        source_type: "",
        approval_workflow:0,//流程审批：
        //sev_id:"3e9a75f6c4f149eebd1a5a9b6bc8a691"
      };
    },
    updated() {
      this.zhuaidon();
    },
    mounted() {
      this.init();
    },
    methods: {
      init() {
        var that = this;
        apiClient.post(
          "itsmApi/combination/findCombinationBlocks",
          { id: that.sev_id },
          function (data) {
            var combination_data = data.results.data;
            if (combination_data == "") {
              TipBoxService.open("无服务数据，请增加服务组合", 2);
            } else {
              that.myServerList = combination_data;
            }
          }
        );
        //获取已经保存的模板数据
        apiClient.post(
          "itsmApi/combination/findCombinationService",
          { id: that.sev_id },
          function (data) {
            console.info("已有数据=", data);
            that.source_type = data.results.data.source_type;
            if(data.results.data.approval_workflow){
              that.approval_workflow=data.results.data.approval_workflow;
            }
            var combination_page = data.results.data.combination_page_config;
            if (
              combination_page != undefined &&
              !$.isEmptyObject(combination_page)
            ) {
              that.title = combination_page.title;
              that.serverList = JSON.parse(combination_page.areas);
              if (
                combination_page.areas == undefined ||
                that.serverList.length <= 0
              ) {
                that.addArea();
              } else {
                var boxs = "";
                for (var i = 0; i < that.serverList.length; i++) {
                  var sever = that.serverList[i];
                  var box =
                    '<div class="pageGen-DIYBox" id="' +
                    sever.id +
                    '" >' +
                    '<div class="pageGen-Iptboxer pageGen-divHr">' +
                    '<b class="pageGen-iconDelete" sid="' +
                    sever.id +
                    '"></b>' +
                    "</div>" +
                    '<div class="pageGen-editorAreaBox clearfix" >';
                  for (var j = 0; j < sever.sevs.length; j++) {
                    var sev = sever.sevs[j];
                    var cont = "";
                    if (sev.stype == "2") {
                      cont = "此区域展示内容为一个网页";
                    } else if (sev.stype == "3") {
                      cont = "此区域展示内容为数据";
                    }
                    var areas =
                      '<div class="pageGen-editorArea" id="' +
                      sev.pos_id +
                      '" style="width:' +
                      sev.width +
                      ";height:" +
                      sev.height +
                      ";margin-left:" +
                      sev.mleft +
                      ';" ' +
                      'mheight="' +
                      sev.mheight +
                      '" mwidth="' +
                      sev.mwidth +
                      '" mleft="' +
                      sev.mleft +
                      '" sid="' +
                      sev.sev_id +
                      '" stype="' +
                      sev.stype +
                      '" sname="' +
                      sev.sev_name +
                      '">' +
                      '<div class="indexcode" >' +
                      '<div class="pageGen-rowtitle" style="height:40px;" >' +
                      '<input class="pageGen-box-label" type="text" value="' +
                      sev.label +
                      '" />' +
                      '<div class="pageGen-right-but" style="overflow: auto;">' +
                      '<a href="javascript:;" class="pageGen-sc clearfix" sid="' +
                      sev.pos_id +
                      '">删除</a>' +
                      "</div>" +
                      "</div>" +
                      '<div class="pageGen-box-cont" >' +
                      cont +
                      "</div>" +
                      "</div>" +
                      "</div>";
                    box += areas;
                  }
                  boxs += box;
                  boxs += "</div></div>";
                }
                $(".pageGen-rightBody-con").html(boxs);
                //that.zhuaidon();

                that.zjSize();
              }
            } else {
              that.title = data.results.data.name;
              that.addArea();
              //that.zjSize();
            }
          }
        );

        for (var i = 0; i < that.serverList.length; i++) {
          var state = true;
          $("#" + that.serverList[i].id).on("keyup", "input", function () {
            if ($(this).val().length > 20 && state == true) {
              $(this).css("border", "1px solid red");
              $(".pageGen-rightBody").scrollTop(
                $(this)
                  .parent()
                  .parent()[0].scrollHeight
              );
              var html =
                "<span style='margin-left: 30px;color: red;' class='flage' >标题太长,最多20个字符！</span>";
              $(this)
                .parent()
                .append(html);
              state = false;
              // TipBoxService.open("标题最多20个字符",2);
              // saveFlage = false;
            }
            if ($(this).val().length <= 20) {
              $(this)
                .siblings(".flage")
                .remove();
              $(this).css("border", "none");
              state = true;
            }
          });
        }

        $(".pageGen-rightBody-con").delegate(
          ".pageGen-maskClose",
          "click",
          function () {
            var ztTitle = $(".pageGen-rightBody-con").find(".pageGen-aIpt");
            $(this)
              .prev(".pageGen-aIpt")
              .val("");
          }
        );

        $(".pageGen-rightBody-con").delegate(
          ".pageGen-iconDelete",
          "click",
          function () {
            var sid = $(this).attr("sid");
            NoticeBoxService.open("确定要删除吗？", function () {
              NoticeBoxService.close();
              $("#" + sid).remove();
            });
          }
        );

        $(".pageGen-rightBody-con").delegate(".pageGen-sc", "click", function () {
          var sid = $(this).attr("sid");
          NoticeBoxService.open("确定要删除吗？", function () {
            NoticeBoxService.close();
            $("#" + sid).remove();
          });
        });
        /**
              $(".pageGen-rightBody-con").delegate(".pageGen-editorArea","mouseover",function(){					
            that.mouseoverId = $(this).attr("id");
            if(that.draggableFlag){
              $(this).before('<div class="pageGen-editorArea pageGen-editorArea" id="editorArea"></div>');
              that.draggableFlag = false;
            }
          })
          $(".pageGen-rightBody-con").delegate(".pageGen-editorArea","mouseout",function(){					
            $("#pageGen-editorArea").remove();					
            that.mouseoverId = "";	
              	
          })
          **/
        that.zhuaidon();
      },
      addArea() {
        var that = this;
        var id = that.DIYBoxId;
        $(".pageGen-rightBody-con").append(
          '<div class="pageGen-DIYBox" id="' +
          id +
          '">' +
          '<div class="pageGen-Iptboxer pageGen-divHr">' +
          '<b class="pageGen-iconDelete" sid="' +
          id +
          '"></b>' +
          "</div>" +
          '<div class="pageGen-editorAreaBox clearfix" ></div>' +
          "</div>"
        );
        var state = true;
        $("#" + id).on("keyup", "input", function () {
          console.log("sds");
          if ($(this).val().length > 20 && state == true) {
            $(this).css("border", "1px solid red");
            $(".pageGen-rightBody").scrollTop(
              $(this)
                .parent()
                .parent()[0].scrollHeight
            );
            var html =
              "<span style='margin-left: 30px;color: red;' class='flage' >标题太长,最多20个字符！</span>";
            $(this)
              .parent()
              .append(html);
            state = false;
            // TipBoxService.open("标题最多20个字符",2);
            // saveFlage = false;
          }
          if ($(this).val().length <= 20) {
            $(this)
              .siblings(".flage")
              .remove();
            $(this).css("border", "none");
            state = true;
          }
        });
        that.DIYBoxId++;
        that.zhuaidon();
      },

      zhuaidon() {
        var that = this;

        // 需要拽动的目标
        $(".pageGen-liNoChild").draggable({
          appendTo: "body",
          helper: "clone",
          start: function () {
            that.draggableFlag = true;
          },
          stop: function () {
            that.draggableFlag = false;
          }
        });

        var editorAreaId = "";
        // 拽过来的位置
        $(".pageGen-editorAreaBox")
          .droppable({
            hoverClass: "pageGen-ui-state-hover",
            accept: ":not(.ui-sortable-helper)",
            drop: function (event, ui) {
              var data_id = ui.draggable.attr("id");
              var currData = {};
              for (var i = 0; i < that.myServerList.length; i++) {
                if (that.myServerList[i].BlockId == data_id) {
                  currData = that.myServerList[i];
                  break;
                }
              }

              var parentId = $(this)
                .parents(".pageGen-DIYBox")
                .attr("id");
              editorAreaId = "editorArea" + Date.parse(new Date());
              //整个存放布局的区域宽度
              var areaBoxWidth = $(
                $(".pageGen-rightBody-con")
                  .children(":first")
                  .find(".pageGen-editorAreaBox")[0]
              ).outerWidth();
              console.info("areaBoxWidth===" + areaBoxWidth);
              //默认一个服务内容区域的宽度
              var areaWidth = areaBoxWidth / 2 - 4;

              var cont = "";
              if (currData.type == 3) {
                cont = "此区域展示内容为数据";
              } else if (currData.type == 2) {
                cont = "此区域展示内容为一个网页";
              }
              var editorAreaHtml =
                '<div class="pageGen-editorArea" id="' +
                editorAreaId +
                '" sid="' +
                data_id +
                '" stype="' +
                currData.type +
                '" sname="' +
                currData.BlockContent.trim() +
                '" style="width:' +
                areaWidth +
                'px">' +
                '<div class="indexcode" >' +
                '<div class="pageGen-rowtitle" style="height:40px;" >' +
                '<input class="pageGen-box-label" type="text"  value="' +
                currData.BlockContent.trim() +
                '"/>' +
                '<div class="pageGen-right-but" style="overflow: auto;">' +
                '<a href="javascript:;" class="pageGen-sc clearfix" sid="' +
                editorAreaId +
                '">删除</a>' +
                "</div>" +
                "</div>" +
                '<div class="pageGen-box-cont">' +
                cont +
                "</div>" +
                "</div>" +
                "</div>";
              if ($(this).find(".pageGen-editorArea").length == 0) {
                $(this).prepend(editorAreaHtml);
              } else if (that.mouseoverId != "") {
                $("#" + that.mouseoverId).before(editorAreaHtml);

                that.mouseoverId = "";
              } else {
                //sessionmouseoverId
                $(this).append(editorAreaHtml);
              }
              // 新增的绑定改变大小
              that.zjSize($("#" + editorAreaId));
            }
          })
          .sortable();
      },
      zjSize: function (obj) {
        var w = $(".pageGen-editorAreaBox").width();
        var divWidth = $(".pageGen-editorAreaBox").innerWidth() - 2;
        if (obj != undefined && obj != null) {
          var left = $(obj).position().left;
          console.info(
            "w====" + w + ",divWidth===" + divWidth + ",left===" + left
          );
          if (left == 1) {
            $(obj).css({ "margin-left": "1px" });
            $(obj).attr("mleft", "1px");
          }
        }
        $(".pageGen-editorArea").resizable({
          maxWidth: w - 2,
          minHeight: 220,
          minWidth: w / 2 - 50,
          stop: function (event, ui) {
            var height = event.target.offsetHeight;
            var width = event.target.offsetWidth;
            var percentage = parseFloat(width / divWidth * 100);
            console.info("大小改变后宽高====" + height + ",width===" + width);
            // 为全局配置赋值
            $(this).attr("mheight", height + "px");
            $(this).attr("mwidth", percentage + "%");
            console.info("left====" + $(this).position().left);
            if ($(this).position().left == 1) {
              $(this).css({ "margin-left": "1px" });
              $(this).attr("mleft", "1px");
            } else {
              $(this).css({ "margin-left": "10px" });
              $(this).attr("mleft", "10px");
            }
          }
        });
      },
      cleanSevName: function () {
        this.title = "";
      },
      blockcontent(event) {
        console.log(event);
      },
      saveTemplate: function (operate_way) {
        var that = this;
        var saveFlage = true;

        if (that.title == "") {
          TipBoxService.open("请填写模板名称", 2);
          return false;
        }
        if (that.title.length > 20) {
          TipBoxService.open("模板名称最多20个字符", 2);
          return false;
        }

        var boxs = $(".pageGen-DIYBox");
        if (boxs.length <= 0) {
          TipBoxService.open("请增加区域模块", 2);
          return false;
        }

        var ztTitle = $(".pageGen-aIpt");
        var i = 0;
        ztTitle.css("border", "");
        $(".pageGen-divHr")
          .find("span")
          .remove();
        ztTitle.each(function (k, v) {
          if ($(this).val() == null || $(this).val() == "") {
            $(this).css("border", "1px solid red");
            ztTitle.eq(k).focus();
            var html =
              "<span style='margin-left: 30px;color: red;' >标题不能为空</span>";
            $(this)
              .parent()
              .append(html);
            saveFlage = false;
          } else {
            if ($(this).val().length > 20) {
              saveFlage = false;
            }
          }
          i++;
        });

        if (!saveFlage) {
          return false;
        }

        var pageData = {};
        pageData.title = that.title;
        var dataBoxs = new Array();
        boxs.each(function (k, v) {
          var areas = $(v).find(".pageGen-editorArea");
          if (areas.length <= 0) {
            TipBoxService.open("有区域模块无服务，请增加服务", 2);
            saveFlage = false;
            return false;
          }

          var sevs = new Array();

          areas.each(function (k2, v2) {
            var sev = {};
            sev.pos_id = $(v2).attr("id");
            sev.sev_id = $(v2).attr("sid");
            sev.sev_name = $(v2).attr("sname");
            sev.label = $(v2)
              .children(":first")
              .children(":first")
              .children(":first")
              .val();
            sev.stype = $(v2).attr("stype");
            var mleft = $(v2).attr("mleft");
            var mheight = $(v2).attr("mheight");
            var mwidth = $(v2).attr("mwidth");

            if (mleft == undefined) {
              mleft = "10px";
            }
            if (mheight == undefined) {
              mheight = "300px";
            }
            if (mwidth == undefined) {
              var divWidth = $(".pageGen-editorAreaBox").innerWidth() - 2;
              var w = parseFloat(width / divWidth * 100);
              mwidth = w + "%";
            }
            sev.mleft = mleft;
            sev.mheight = mheight;
            sev.mwidth = mwidth;

            var height = $(v2).css("height");
            var width = $(v2).css("width");

            if (height != undefined) {
              sev.height = height;
            }
            if (width != undefined) {
              sev.width = width;
            }

            sevs.push(sev);
          });

          var dataBox = {};
          dataBox.id = $(v).attr("id");
          dataBox.title = $(v)
            .children(":first")
            .children()
            .val();
          dataBox.sevs = sevs;

          dataBoxs.push(dataBox);
        });

        if (saveFlage) {
          LoadingBoxService.open("正在保存,请稍候");
          pageData.areas = dataBoxs;
          //保存到后台
          var saveData = {
            operate_way: operate_way,
            operate_page: "3",
            approval_workflow:that.approval_workflow,
            id: that.sev_id,
            combination_page_config: pageData
          };
          console.log("保存页面生成模板：" + saveData);
          apiClient.post(
            "itsmApi/combination/operateCombinationService",
            saveData,
            function (data) {
              LoadingBoxService.close();
              console.info("弹框数据=", JSON.stringify(data));
              if (data.status == 200) {
                if (operate_way == "1") {
                  TipBoxService.open("暂存成功", 0);
                } else if (operate_way == "2") {
                  if ((that.source_type == "1")) {
                    that.$router.push("/enterprise");
                  } else if ((that.source_type == "5")) {
                    that.$router.push("/registered");
                  }else if (that.source_type == "2") {
                    that.$router.push("/platformService");
                  }
                }
              } else {
                TipBoxService.open("保存失败", 0);
              }
            }
          );
        }
      },
      goBack() {
        if (confirm("返回上一步将会清空当前页面所做的配置，确定要返回吗?")) {
          let id = this.$route.query.id;
          let source_type=this.source_type;
          this.$router.push({ name: "compositeService", query: { id: id ,source_type:source_type} });
        }
      },
      toMain() {
        if (this.source_type == "1") {
          this.$router.push("/enterprise");
        } else if (this.source_type == "5") {
          this.$router.push("/registered");
        } else if (this.source_type == "2") {
          this.$router.push("/platformService");
        }
      },
      previewHandler() {
        window.open("#/invoke?previewTag=1&id=" + this.sev_id, "_blank");
      }
    }
  };
</script>
<style src="../../css/common/public.css" scoped></style>
<style src="../../css/createCombinationServeice/pageGen.css"></style>
<style src="../../css/createCombinationServeice/jquery-ui.custom.min.css"></style>