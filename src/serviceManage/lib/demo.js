/**
 *模型分析
 */

export default{
//	instance : instance,
	// loadChartByJSON: loadChartByJSON,
	// connectorPaintStyle:connectorPaintStyle,
	// connectorHoverStyle:connectorHoverStyle,
	// hollowCircle:hollowCircle
	//根蒂根基连接线样式
 	connectorPaintStyle : {
            lineWidth: 4,
            strokeStyle: "rgb(0,32,80)",
            joinstyle: "round",
            outlineColor: "rgb(251,251,251)",
            outlineWidth: 2
        },

        // 鼠标悬浮在连接线上的样式
      connectorHoverStyle : {
            lineWidth: 4,
            strokeStyle: "#216477",
            outlineWidth: 0,
            outlineColor: "rgb(251,251,251)"
        },
        //端点样式设置
		hollowCircle: {
			endpoint: ["Dot", { cssClass: "endpointcssClass" }], //端点形状
			connectorStyle: this.connectorPaintStyle,
			paintStyle: {
				stroke:'orange',
				strokeWidth:1,
				strokeOpacity:0.5,
				radius: 4
			}, //端点的颜色样式
			isSource: true, //是否可拖动（作为连接线起点）
			connector: ["Flowchart", { stub: 30, gap: 0, coenerRadius: 0, alwaysRespectStubs: true, midpoint: 0.5 }],
			isTarget: true, //是否可以放置（连接终点）
			maxConnections: -1
		},
	loadChartByJSON:function (data){
      var unpack=JSON.parse(data);
      if(!unpack){
        return false;
      }
      var flowConnector={
        anchors:["BottomCenter","TopCenter"],
        endpoints:["dot","blank"]

      };
      for(var i=0;i<unpack['block'].length;i++){
        var BlockId=unpack['block'][i]['BlockId'];
        var BlockContent=unpack['block'][i]['BlockContent'];
        var BlockX=unpack['block'][i]['BlockX'];
        var BlockY=unpack['block'][i]['BlockY'];
        var width=unpack['block'][i]['BlockWidth'];
        var height=unpack['block'][i]['BlockHeight'];
        var blockAttr=BlockId.split('-')[0];
        var html = '<div id="'+ BlockId +'" style="border: 1px #d5d5d5 solid;width: 100px;height: 100px;position: absolute;left: 40%;top: 50px;border-radius: 3px;background: rgb(255, 255, 255) !important">'+
											'<i class="dle" style="position: absolute;width: 18px;height: 18px;right: 2px;top: 2px;border-radius: 50%;border: 1px #c9c9c9 solid;text-align: center;line-height: 18px;color: #999;">X</i>'+
											'<dl style="text-align: center;padding-top: 16px;">'+
												'<dd><img src="" alt="" style="width: 42px;height: 42px;border-radius: 3px;border: 1px #d3d3d3 solid;"></dd>'+
												'<dt style="font-size: 14px;margin-top: 5px;">'
												+12+'</dt>'+
											'</dl>'+
										'</div>';
        $('.info-left').append(html);
        $("#"+BlockId)
          .css("left",BlockX)
          .css("top",BlockY)
          .css("position","absolute")
          .css("margin","0px")
          .css("width",width)
          .css("height",height)
      }

      for(i=0;i<unpack['connects'].length;i++){
        var ConnectionId=unpack['connects'][i]['ConnectionId'];
        var PageSourceId=unpack['connects'][i]['PageSourceId'];
        var PageTargetId=unpack['connects'][i]['PageTargetId'];

        //用jsPlumb添加锚点
        jsPlumb.addEndpoint(PageSourceId,{anchors: "TopCenter"},this.hollowCircle);
        jsPlumb.addEndpoint(PageSourceId,{anchors: "RightMiddle"},this.hollowCircle);
        jsPlumb.addEndpoint(PageSourceId,{anchors: "BottomCenter"},this.hollowCircle);
        jsPlumb.addEndpoint(PageSourceId,{anchors: "LeftMiddle"},this.hollowCircle);

        jsPlumb.addEndpoint(PageTargetId,{anchors: "TopCenter"},this.hollowCircle);
        jsPlumb.addEndpoint(PageTargetId,{anchors: "RightMiddle"},this.hollowCircle);
        jsPlumb.addEndpoint(PageTargetId,{anchors: "BottomCenter"},this.hollowCircle);
        jsPlumb.addEndpoint(PageTargetId,{anchors: "LeftMiddle"},this.hollowCircle);

        jsPlumb.draggable(PageSourceId);
        jsPlumb.draggable(PageTargetId);

        // $("#"+PageSourceId).draggable({containment: "parent"});//保证拖动不跨界
        // $("#"+PageTargetId).draggable({containment: "parent"});//保证拖动不跨界

        jsPlumb.connect({
          source:PageSourceId,
          target:PageTargetId,
          anchors:["Right", "Left"],
          endpoint: ["Dot",{radius:2}],
	        paintStyle: {
	        	strokeWidth:1, stroke:'rgb(68, 85, 102)',
	            strokeStyle: "rgb(0,32,80)",
	            fillStyle: "rgb(0,32,80)",
	            opacity: 0.5,
	            radius: 2,
	            lineWidth: 2,
	            outlineWidth: 2
	        },//端点的色彩样式
        connector: ["Flowchart", { stub: 30, gap: 0, coenerRadius: 0, alwaysRespectStubs: true, midpoint: 0.5 }],
		  overlays:[ 
			    ["Arrow",{ location:1,
			    	visible:true,
			    width:11,
			    length:11,
			    direction:1}
			    ]
			  ]
          });

      }
      return true;
    }
}
