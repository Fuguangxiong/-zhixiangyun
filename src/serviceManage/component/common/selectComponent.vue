<template>
  <div id="selectComponent" class='select-component select-part'>
    <span v-show='isShowAll' @click='onControlHeight' class="select-more-btn"><i class="el-icon-arrow-down"></i></span>
    <div class="select">
      <!-- 关键字 -->
      <div v-show='searchKey && searchKey.label' class="wordBlock tStyel tStyelfuw">
        <span class="textName">{{searchData.label}}：</span>
        <div class="search width248">
          <input type="text" v-model="searchData.result" @keyup.enter="onSearchStr" :placeholder="'请输入'+ searchData.label" class="inputStyle">
          <button @click="onSearchStr" class="searchBut"><i class="icon iconfont icon-sousuo"></i></button>
        </div>
      </div>

      <!-- 筛选 -->
      <div class="wordBlock tStyel tStyelfuw select-options" v-for='(item,index) in selectData' :key='index'>
        <span class="textName">{{item.label}}：</span>
        <!-- 选项 -->
        <div class="listCon" :class="{checkboxShow:!item.isSingle}" v-show="!item.isMultiSeleced">
          <ul class="stateList">
            <li v-for="(dataItem, childIndex) in item.data" 
                :key="childIndex" 
                :value='dataItem.value'
                :class="{'yesCheck':dataItem.selected,'noChcek':!dataItem.selected,'item':dataItem.label!='全部'}"
                @click="onSelect(index,childIndex)">
              <i></i><em>{{dataItem.label}}</em>
            </li>
          </ul>
        </div>
        <!-- 多选的选择结果 -->
        <div class="selected" v-show="item.isMultiSeleced">
          <div class="selectedAll">
            <span>{{item.multiSelecedText}}</span>
            <i class="dataAll" @click="onClearResult(index)">x</i>
          </div>
        </div>
        <!-- 右侧按钮 -->
        <div class="rightBut">
          <button class="inpuChbox moreSytle" 
                  v-show='item.moreBtn=="more"' 
                  @click='toShowMore(index,true)'>+ 更多
          </button>
          <button class="inpuChbox moreSytle" 
                  v-show='item.moreBtn=="less"' 
                  @click='toShowMore(index,false)'>- 收起
          </button>
          <button class="inpuChbox moreSytle" 
                  v-show='item.isSingle && onShowBtn("checkbox", item.button)' 
                  @click='toMultiType(index)'>+ 多选
          </button>
          <button class="inpuChbox moreSytle active" 
                  v-show='!item.isSingle && onShowBtn("checkbox", item.button)' 
                  @click='onMultiSure(index)'>确定
          </button>
          <button class="inpuChbox icon iconfont icon-fenzu" 
                  v-show='onShowBtn("manage", item.button)'
                  @click='onClickBtn("manage", item)'> 管理
          </button>
        </div>
      </div>

      <!-- 时间段 -->
      <div class="wordBlock tStyel tStyelfuw timer" v-if='timer'>
        <span class="textName">{{timer.label}}：</span>
        <div class="listCon">
          <!-- 快速选择 -->
          <el-select v-model="timeField"
                    v-if='timer.data'
                    @change='onSelectTime' 
                    class='select-timer'
                    placeholder="快捷选择时间段"
                    popper-class='select-timer-quick'>
            <el-option v-for="item in timer.data"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>

          <el-date-picker class='select-timer'
                          v-model="startTime"
                          type="date"
                          placeholder="开始日期"
                          :picker-options="checkStartTime">
          </el-date-picker>
          <span class='el-icon-minus select-timer-gap'></span>
          <el-date-picker class='select-timer'
                          v-model="endTime"
                          type="date"
                          placeholder="结束日期"
                          :picker-options="checkEndTime">
          </el-date-picker>
          <el-button @click='onQuery' class='select-timer-btn'>确定</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import commonFunc from "../common/commonFunc.js";
export default {
  props: {
    searchKey: {},
    selectSetting: {},
    timer: {},
    refresh: false
  },
  data: function() {
    let vm = this;
    return {
      searchData: {},
      selectData: [],
      timeField: "",
      startTime: "",
      endTime: "",
      time: [],
      fullHeight: "",
      initHeight: 106,
      initLineHeight:30,
      isShowAll: false,
      params: {},
      checkStartTime: {
        disabledDate(time) {
          if (vm.endTime) {
            return time.getTime() > vm.endTime.getTime();
          } else {
            return time.getTime() > Date.now();
          }
        }
      },
      checkEndTime: {
        disabledDate(time, startTime) {
          if (vm.startTime) {
            return time.getTime() < vm.startTime.getTime();
          } else {
            return false;
          }
        }
      }
    };
  },
  watch: {
    refresh: function(nv, ov) {
      if (nv) {
        this.init();
      }
    }
  },
  updated() {
  },
  methods: {
    //参数初始化
    init: function() {
      let vm = this;
      if (vm.searchKey) {
        vm.searchData = Object.assign({}, vm.searchKey);
        if (!vm.searchData.result) {
          vm.searchData.result = "";
        }
      }
      vm.selectData = [...vm.selectSetting];
      vm.selectData.forEach(function(v, i) {
        v.isSingle = true; //当前是否是单选模式
        v.isMultiSeleced = false; //是否已经多选完
        v.multiSelecedText = ""; //多选结果的拼接显示内容
        v.result = []; //选择的结果
        v.resultTemp = []; //多选点击确定前选择的结果
        if (v.default) {
          v.data.forEach(function(o, j) {
            if (o.value == v.default) {
              o.selected = true;
              v.result.push(o.value);
            } else {
              o.selected = false;
            }
          });
        } else {
          v.data.forEach(function(o, j) {
            if (j == 0) {
              o.selected = true;
            } else {
              o.selected = false;
              v.result.push(o.value);
            }
          });
        }
      });
      setTimeout(vm.addMoreBtn,100);
      vm.initSelectHeight();
      vm.onQuery();
    },
    //添加“更多”按钮
    addMoreBtn(){
      let vm = this;
      let dataList=[...vm.selectData];
      dataList.forEach(function(v, i) {
        let outBlock = $(".select-options")
          .eq(i)
          .find(".listCon");
        let inBlock = $(".select-options")
          .eq(i)
          .find(".stateList");
        if (outBlock.height() < inBlock.height()) {
          v.moreBtn='more';
        }
      });
      vm.selectData=dataList;
    },
    //初始化筛选显示高度
    initSelectHeight: function() {
      let vm = this;
      if (vm.selectData.length > 2) {
        vm.fullHeight = 34 + 36 * vm.selectData.length;
        if (vm.timer) {
          vm.fullHeight += 44;
        }
        $("#selectComponent .select").height(vm.initHeight);
        vm.isShowAll = true;
      }
    },
    //切换是否显示全部筛选条件
    onControlHeight: function() {
      let vm = this;
      if ($("#selectComponent.select-component").hasClass("select-part")) {
        $("#selectComponent.select-component").removeClass("select-part");
        $("#selectComponent .select").animate(
          { height: vm.fullHeight + "px" },
          500
        );
      } else {
        $("#selectComponent.select-component").addClass("select-part");
        $("#selectComponent .select").animate(
          { height: vm.initHeight + "px" },
          500
        );
      }
    },
    //是否显示某个按钮
    onShowBtn: function(str, array) {
      if (array.includes(str)) {
        return true;
      } else {
        return false;
      }
    },
    //关键字查询
    onSearchStr: function() {
      this.onQuery();
    },
    //更多
    toShowMore: function(index,flag) {
      let vm = this;
      let outBlock=$('.select-options').eq(index).find('.listCon');
      let inBlock=$('.select-options').eq(index).find('.stateList');
      let dataList=[...vm.selectData];
      if(flag){
        outBlock.animate({'height':inBlock.height()+6+'px'},300);
        dataList[index].moreBtn="less";
      }else{
        outBlock.animate({'height':vm.initLineHeight+'px'},300);
        dataList[index].moreBtn='more';
      }
      vm.selectData=dataList;
    },
    //切换多选
    toMultiType: function(index) {
      let vm = this;
      let obj = vm.onCopy(index);
      obj.isSingle = false;
      obj.isMultiSeleced = false;
      obj.result = [];
      obj.resultTemp = [];
      obj.data.forEach(function(v, i) {
        if (v.selected == true && v.value) {
          obj.resultTemp.push(v);
        }
      });
      vm.reCopy(index, obj);
    },
    //选择某个选项
    onSelect: function(index, childIndex) {
      let vm = this;
      if (vm.selectData[index].isSingle) {
        vm.onSingleSelect(index, childIndex);
      } else {
        vm.onMultiSelect(index, childIndex);
      }
    },
    //单选
    onSingleSelect: function(index, childIndex) {
      let vm = this;
      let obj = vm.onCopy(index);
      if (!obj.data[childIndex].selected) {
        vm.setSingleOption(obj, childIndex);
        vm.reCopy(index, obj);
        vm.onQuery();
      }
    },
    //多选
    onMultiSelect: function(index, childIndex) {
      let vm = this;
      let obj = vm.onCopy(index);
      if (obj.data[childIndex].value) {
        if (!obj.data[0].value && obj.data[0].selected) {
          obj.data[0].selected = false;
          obj.resultTemp = [];
        }
        obj.data[childIndex].selected = !obj.data[childIndex].selected;
        if (obj.data[childIndex].selected) {
          obj.resultTemp.push(obj.data[childIndex]);
        } else {
          let i = $.inArray(obj.data[childIndex], obj.resultTemp);
          obj.resultTemp.splice(i, 1);
        }
        vm.reCopy(index, obj);
      } else {
        vm.setSingleOption(obj, 0);
        vm.reCopy(index, obj);
        vm.onQuery();
      }
    },
    //多选的确定
    onMultiSure: function(index) {
      let vm = this;
      let obj = vm.onCopy(index);
      obj.isSingle = true;
      if (
        obj.resultTemp.length != obj.data.length - 1 &&
        obj.resultTemp.length != 0
      ) {
        let text = "";
        obj.resultTemp.forEach(function(v, i) {
          text += v.label + "、";
          obj.result.push(v.value);
        });
        text = text.substring(0, text.length - 1);
        obj.multiSelecedText = text;
        obj.isMultiSeleced = true;
      } else {
        vm.setSingleOption(obj, 0);
      }
      vm.reCopy(index, obj);
      vm.onQuery();
    },
    //清空多选结果
    onClearResult: function(index) {
      let vm = this;
      let obj = vm.onCopy(index);
      obj.isMultiSeleced = false;
      obj.isSingle = true;
      vm.setSingleOption(obj, 0);
      vm.reCopy(index, obj);
      vm.onQuery();
    },
    //快捷选择时间
    onSelectTime: function(value) {
      let vm = this;
      let start = new Date();
      let end = new Date();
      if (value) {
        start = start.getTime() - 3600 * 1000 * 24 * value;
        end = end.getTime();
      } else {
        start = "";
        end = end.getTime() - 3600 * 1000 * 24 * 365;
      }
      vm.startTime = new Date();
      vm.endTime = new Date();
      if (start) {
        vm.startTime.setTime(start);
      } else {
        vm.startTime = "";
      }
      vm.endTime.setTime(end);
      vm.time = [start, end];
    },
    //查询
    onQuery: function() {
      let vm = this;
      vm.params[vm.searchData.paramName] = $.trim(vm.searchData.result);
      vm.selectData.forEach(function(v, i) {
        vm.params[v.paramName] = v.result;
      });

      if (vm.timer) {
        vm.params[vm.timer.paramName[0]] = vm.startTime
          ? vm.startTime.getTime()
          : "";
        vm.params[vm.timer.paramName[1]] = vm.endTime
          ? vm.endTime.getTime() + 3600 * 1000 * 24
          : "";
      }
      vm.$emit("select", vm.params);
    },
    //除多选外的其他按钮的点击事件
    onClickBtn: function(str, item) {
      this.$emit("clickBtn", str, item);
    },
    //深拷贝selectData[index]
    onCopy: function(index) {
      let vm = this;
      let obj = Object.assign({}, vm.selectData[index]);
      return obj;
    },
    //将修改后的数据赋回selectData[index]
    reCopy: function(index, obj) {
      let vm = this;
      vm.$set(vm.selectData, index, obj);
    },
    setSingleOption: function(obj, childIndex) {
      obj.result = [];
      obj.resultTemp = [];
      obj.multiSelecedText = "";
      obj.isSingle = true;
      obj.data.forEach(function(m, n) {
        m.selected = false;
      });
      if (obj.data[childIndex].value) {
        obj.data[childIndex].selected = true;
        obj.result.push(obj.data[childIndex].value);
      } else {
        obj.data[childIndex].selected = true;
        obj.data.forEach(function(m, n) {
          if (n) {
            obj.result.push(m.value);
          }
        });
      }
    }
  }
};
</script>
<style src="../../css/common/tableComponent.css" scoped></style>
<style>
#selectComponent.select-component {
  position: relative;
}
#selectComponent .select-more-btn {
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  display: inline-block;
  width: 40px;
  height: 8px;
  background: #e5e5e5;
  text-align: center;
  overflow: hidden;
  cursor: pointer;
  border-bottom-left-radius: 2px;
  border-bottom-right-radius: 2px;
}
#selectComponent .select-more-btn:hover {
  background: #55a8fd;
}
#selectComponent .select-more-btn > i {
  transform: translateY(-6px) scale(0.5, 0.5) rotateX(180deg);
  color: #fff;
}
#selectComponent.select-part .select-more-btn > i {
  transform: translateY(-6px) scale(0.5, 0.5);
}
#selectComponent .select {
  position: relative;
  border-bottom: 1px solid #f1f1f1;
  margin-bottom: 20px;
  height: auto;
  overflow: hidden;
}
#selectComponent .tStyel.timer {
  padding-bottom: 15px;
}
#selectComponent .select-timer {
  margin-top: 2px;
  margin-right: 12px;
  float: left;
}
#selectComponent .select-timer-gap {
  margin: 10px 12px 0 0;
  float: left;
  color: #cacaca;
  font-size: 12px;
}
#selectComponent .select-timer .el-input__inner {
  height: 26px;
  font-size: 12px;
}
#selectComponent .select-timer-btn {
  margin: 2px 0 0 0 !important;
  padding: 6px 10px;
  background: #fff !important;
  border: 1px solid #c4c4c4 !important;
  font-size: 12px !important;
}
.select-timer-quick .el-scrollbar__wrap {
  overflow: hidden;
  margin: 0 !important;
}
.select-timer-quick .el-select-dropdown__list {
  padding: 0;
}
.select-timer-quick .el-select-dropdown__item {
  padding: 0 10px;
  height: 24px;
  line-height: 24px;
  font-size: 12px;
  border-bottom: 1px solid #f5f5f5;
  text-align: left;
}
.select-timer-quick .el-select-dropdown__item.hover,
.select-timer-quick .el-select-dropdown__item:hover {
  background: none;
  color: #55a8fd;
}
</style>
