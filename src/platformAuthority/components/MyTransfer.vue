<template>
  <div v-show="boxOpen" class="overlay">
    <div class="transferBox">
      <div class="transferBoxTitleContainer">
        <div class="transferBoxTitle">{{boxTitle}}</div>
        <i class="transferBoxClose" v-on:click="closeHandler"></i>
      </div>
      <div class="transferBoxSearchContainer">
        <div class="transferBoxSearchDiv">
          <input :placeholder="searchTitle" v-model="filterText" class="commonLayoutRightTopSearchInput" @keyup.enter="filterNodeHandlerEnter()">
          <div class="commonLayoutRightTopSearchBtn" v-on:click="filterNodeHandler"></div>
        </div>
      </div>
      <div class="transferBoxContentContainer">
        <div class="transferBoxContentLeftContainer">
          <p class="transferBoxContentName">{{leftTitle}}</p>
          <div class="transferBoxContentLeftBox">
            <el-tree :data="data" :props="defaultProps" highlight-current ref="tree2" :filter-node-method="filterNode" @node-click="handleNodeClick"></el-tree>
          </div>
        </div>
        <div class="transferBoxContentBtnContainer">
          <div class="transferBoxControlBtnContainer">
            <div class="transferBoxBtn left" v-on:click="leftToRightHandler"></div>
            <div class="transferBoxBtn right" v-on:click="rightToLeftHandler"></div>
          </div>
          <div v-if="multiselect" class="transferBoxControlBtnContainer">
            <div class="transferBoxBtn mLeft" v-on:click="allLeftToRightHandler"></div>
            <div class="transferBoxBtn mRight" v-on:click="allRightToLeftHandler"></div>
          </div>
        </div>
        <div class="transferBoxContentRightContainer">
          <p class="transferBoxContentName">{{rightTitle}}</p>
          <div class="transferBoxContentRightBox">
            <div class="transferBoxRightList" :class="{select:item.transferSelect}" v-for="(item,index) in rightDataList" v-on:click="rightListSelectHandler(index)">{{item[defaultProps.label]}}</div>
          </div>
        </div>
      </div>
      <div class="transferBoxBtnContainer">
        <div class="publicBtn green" v-on:click="okHandler">确定</div>
        <div class="publicBtn gray" v-on:click="closeHandler">取消</div>
      </div>
    </div>
  </div>
</template>
<script>
    import '../css/componentCss/transferComponent.css'
export default{
      props: {
        open: {},
        data: {},
        newData: {},
        multiselect: {},
        keyAtt: {default: 'id'},
        notSelect: {},
        boxTitle: {},
        leftTitle: {},
        rightTitle: {},
        defaultProps: {},
        searchTitle: {default: '角色名称'}
      },
      watch: {
        open (val, oldVal) {
          this.boxOpen = true
        },
        newData (val, oldVal) {
            	console.info('newData-', this.newData)
          this.rightDataList = this.newData.slice(0)
            // this.leftToRightHandler();
        }
            /* filterText(val) {
                this.$refs.tree2.filter(val);
            } */
      },
      data: function () {
        return {
          filterText: '',
          boxOpen: false,
          tempDataArr: [],
          rightDataList: this.newData
                /* defaultProps: {
                    children: 'children',
                    label: 'label',
                    notSelect:
                } */
        }
      },
      methods: {
        closeHandler () {
          this.boxOpen = false
        },
        handleNodeClick (data) {
          console.info('zzzzz=', data)
          var that = this
          var find = false
            /* if(!that.multiselect){
                that.tempDataArr=new Array();
                that.tempDataArr.push(data);
            }
            else{
                for(var i=0;i<that.tempDataArr.length;i++){
                    var obj=that.tempDataArr[i];
                    if(data[that.keyAtt]==obj[that.keyAtt]){
                        find=true;
                        break;
                    }
                }
                if(find==false){
                    that.tempDataArr.push(data);
                }
            } */
          that.tempDataArr = new Array()
          that.tempDataArr.push(data)
        },
        rightListSelectHandler (index) {
          console.info('jkjkjk=', index)
          for (var i = 0; i < this.rightDataList.length; i++) {
            var obj = this.rightDataList[i]
            if (obj.transferSelect == true) { obj.transferSelect = false }
          }
          this.rightDataList[index].transferSelect = true
        },
        leftToRightHandler () {
                // this.rightDataList=new Array();
          var that = this

          for (var i = 0; i < that.tempDataArr.length; i++) {
            var obj = that.tempDataArr[i]
            console.info('ffffffffffffffff=', that.notSelect)
            if (that.notSelect != undefined) {
              console.info('uuuuuuuuuuuu=', obj[that.notSelect])
              if (obj[that.notSelect]) {
                console.info('部门节点不可选择')
              } else {
                findItem()
              }
            } else {
              findItem()
            }
          }

          function findItem () {
            var find = false
            for (var j = 0; j < that.rightDataList.length; j++) {
              var newObj = that.rightDataList[j]
              if (obj[that.keyAtt] == newObj[that.keyAtt]) {
                find = true
              }
            }

            if (find == false) {
                   	if (!that.multiselect) {
	                    that.rightDataList = new Array()
	                }
              that.$set(obj, 'transferSelect', false)
              that.rightDataList.push(obj)
            }
          }
        },
        rightToLeftHandler () {
          for (var i = 0; i < this.rightDataList.length; i++) {
            var obj = this.rightDataList[i]
            if (obj.transferSelect == true) {
              this.rightDataList.splice(i, 1)
              break
            }
          }
        },
        allLeftToRightHandler () {
          this.tempDataArr = new Array()
          var that = this
          for (let i = 0; i < that.data.length; i++) {
            filterEmptyChildren(that.data[i])
          }
          this.rightDataList = new Array()
          for (var i = 0; i < this.tempDataArr.length; i++) {
            var obj = this.tempDataArr[i]
                // obj.select="false";
            if (that.notSelect != undefined && obj[that.notSelect] == 'true') {
              console.info('this is a no select node')
            } else {
              this.$set(obj, 'transferSelect', false)
              this.rightDataList.push(obj)
            }
          }
          function filterEmptyChildren (value) {
            if (!value.isDepartment) {
              that.tempDataArr.push(value)
            }
            if (value.hasOwnProperty('children')) {
              if (value.children.length == 0) {
               // delete value.children
              } else {
                for (var j = 0; j < value.children.length; j++) {
                  filterEmptyChildren(value.children[j])
                }
              }
            }
          }
        },
        allRightToLeftHandler () {
          this.tempDataArr = new Array()
          this.rightDataList = new Array()
        },
        okHandler () {
          if (this.rightDataList.length > 0) {
            this.$emit('change', this.rightDataList)
          }
          this.boxOpen = false
        },
        filterNode (value, data) {
          if (!value) return true
          return data[this.defaultProps.label].indexOf(value) !== -1
        },
        filterNodeHandler () {
          this.$refs.tree2.filter(this.filterText)
        },
        filterNodeHandlerEnter: function () {
          this.$refs.tree2.filter(this.filterText)
        }
      }
    }
</script>
