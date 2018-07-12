<template>
  <div class="commTable">
	<div class="commmonTable">
	  <div v-show="paginationShow" class="commonTableDivContainer">
		<div v-for="(item,index) in bodyData" class="commonTableItemLine">
		  <div class="commonTableItemDiv" :class="{check:val.check,image:val.img,mLine:val.mLine}" v-for="(val,index2) in item.lineData" v-bind:style="{width:val.itemWidth}" v-on:click="itemLinkHandler(val,item)">
			<div v-if="val.img" class="commonTableIcon" v-bind:class="val.imageClass"></div>
			<div v-if="val.check" class="commonTableCheck">
			  <el-checkbox v-model="val.checkData" @change="bodyCheckChangeHandler"></el-checkbox>
			</div>
			<div v-if="val.text" class="commonTableText">
			  <p v-for="(key,value) in val.textData">
				<span class="commonTableItemTitle">{{value}}&nbsp;&nbsp;:&nbsp;&nbsp;</span>
				<span class="commonTableItemText">{{key.split(",")[0]}}</span>
			  </p>
			</div>
			<div v-if="val.status" class="commonTableStatus">
			  <p :style="{color:val.color}">
				<span class="commonTableItemText">{{val.textStatus}}</span>
			  </p>
			</div>
			<div v-if="val.btn" class="commonTableBtnDiv">
        <!-- !(item.ROLE_TYPE==='admin'&&btn.title==='权限分配') -->
			  <span v-if="issa?true:(item.ROLE_TYPE==='admin'&&btn.title==='权限分配')?false:true" v-for="(btn,index3) in val.btnArr" class="commonTableBtn" v-bind:class="btn.class" :title="btn.title" v-on:click="itemBtnHandler(btn.clickType,item)"></span>
			</div>
			<div v-if="val.fontBtn" class="commonTableBtnDiv">
			  <span v-for="(btn2,index3) in val.btnArr" class="commonTableFontBtn" v-bind:class="btn2.class" v-on:click="itemBtnHandler(btn2.clickType,item)">{{btn2.title}}</span>
			</div>
		  </div>
		</div>
		<div v-show="paginationShow && pageTotal > pageSize" v-if="hasPagination" class="paginationContainer">
		  <el-pagination @current-change="interfacePaginatChangeHandler" layout="prev, pager, next,jumper" :current-page.sync="pageNum" :page-size="pageSize" :total="pageTotal">
		  </el-pagination>
		</div>
	  </div>
	</div>
	<p v-show="!paginationShow" class="commmonTableMsg">{{tableMsg}}</p>
	<!-- <div v-show="paginationShow" v-if="hasPagination" class="paginationContainer">
		<el-pagination @current-change="interfacePaginatChangeHandler" layout="prev, pager, next,jumper" :current-page.sync="pageNum" :page-size="pageSize" :total="pageTotal">
		</el-pagination>
	</div> -->
  </div>
</template>
<script>
  import LoadingBoxService from '../../publicJs/LoadingBoxService'
  
  export default {
    props: {
      issa: '',
      bodyData: '',
      getSelect: '',
      getTableData: '', // 传过来的departmentId
      renew: '',
      pageTotal: {},
      searchTableData: '', // 传过来的searchWord
      allSelected: '',
      hasPagination: {default: true}
    },
    data: function () {
      return {
        pageSize: 10,
        pageNum: 1,
        paginationShow: false,
        tableMsg: '请选择左侧菜单',
        itemWidth: {width: 0}
      }
    },
    mounted () {
      console.info('body', this.bodyData)
    },
    watch: {
      getSelect (val, oldVal) {
        this.sentSelectData(0)
      },
      getTableData (val, oldVal) {
        if (val != 'noLink') {
          this.pageNum = 1
          this.createLinkObj()
          this.tableMsg = ''
          LoadingBoxService.open('数据加载中...')
          this.paginationShow = false
        }
      },
      renew (val, oldVal) {
        this.pageNum = 1
        if (this.getTableData != 'noLink') {
          this.createLinkObj()
        } else {
          this.searchLinkObj()
        }
        this.tableMsg = ''
        LoadingBoxService.open('数据加载中...')
        this.paginationShow = false
      },
      // 监控传递过来的tableData.searchWord
      searchTableData (val) {
        if (val != 'noLink') {
          this.pageNum = 1
          this.searchLinkObj()
          this.tableMsg = ''
          LoadingBoxService.open('数据加载中...')
          this.paginationShow = false
        }
      },
      searchRenew (val) {
        this.pageNum = 1
        this.searchLinkObj()
        this.tableMsg = ''
        LoadingBoxService.open('数据加载中...')
        this.paginationShow = false
      },
      bodyData (val, oldVal) {
        if (typeof val === 'string' || val.length === 0) {
          this.tableMsg = '无数据'
          LoadingBoxService.close()
        } else {
          this.paginationShow = true
          LoadingBoxService.close()
        }
      },
      bodyData: {
        handler (val, oldVal) {
          // console.info("val====",val);
          if (typeof val === 'string') {
            this.tableMsg = '无数据'
            LoadingBoxService.close()
          } else {
            this.paginationShow = true
            // this.bodyCheckChangeHandler();
            LoadingBoxService.close()
          }
        },
        deep: true
      },
      allSelected (val, oldVal) {
        console.info('select=', val)
        this.allSelected = val
        this.headCheckChangeHandler()
      }
    },
    methods: {
      createLinkObj () {
        var obj = new Object()
        obj.param = this.getTableData
        if (this.hasPagination) {
          obj.pageNum = this.pageNum
        }
        this.$emit('link', obj)  // 通过link事件传一个obj回去
      },
      searchLinkObj () {
        var obj = new Object()
        obj.param = this.searchTableData
        if (this.hasPagination) {
          obj.pageNum = this.pageNum
        }
        this.$emit('searchlink', obj)
      },
      itemLinkHandler (val, item) {
        console.log('点击了这一行')
        if (item.notClick) {
        } else {
          if (val.check == true) {
          } else if (val.btn == true) {
          } else {
            this.$emit('tablelinkclick', item)
          }
        }
        // this.$emit('tablelinkclick',item);
      },
      interfacePaginatChangeHandler (data) {
        this.pageNum = data
        if (this.getTableData == 'noLink') {
          this.searchLinkObj()
        } else {
          this.createLinkObj()
        }
      },
      sentSelectData (type) {
        var that = this
        var dataArr = new Array()
        for (var i = 0; i < that.bodyData.length; i++) {
          var arr = that.bodyData[i].lineData
          for (var j = 0; j < arr.length; j++) {
            var obj = arr[j]
            if (obj.check == true) {
              if (obj.checkData == true) {
                dataArr.push(that.bodyData[i])
              }
            }
          }
        }
        if (type == 0) {
          this.$emit('selectdata', dataArr)
        } else if (type == 1) {
          this.$emit('selectchange', dataArr)
        }
      },
      headCheckChangeHandler () {
        // console.info("data=",this.headerData);
        var that = this
        var strIndex = that.allSelected.indexOf('/')
        console.info('strIndex=', that.allSelected.substring(0, strIndex))
        var checkData = eval(that.allSelected.substring(0, strIndex))
        console.info('2sdata=', checkData)
        for (var j = 0; j < that.bodyData.length; j++) {
          var arr = that.bodyData[j].lineData
          for (var k = 0; k < arr.length; k++) {
            var obj = arr[k]
            if (obj.check == true) {
              obj.checkData = checkData
            }
          }
        }
        this.sentSelectData(1)
      },
      bodyCheckChangeHandler () {
        var that = this
        var finded = false
        var changed = false
        for (var j = 0; j < that.bodyData.length; j++) {
          var arr = that.bodyData[j].lineData
          for (var k = 0; k < arr.length; k++) {
            var obj = arr[k]
            if (obj.check == true) {
              if (j == 0) {
                finded = obj.checkData
              }
              if (finded != obj.checkData) {
                changed = true
                break
              }
            }
          }
          if (changed == true) {
            break
          }
        }
        this.$emit('checkallchange', {select: finded, allData: !changed})
        this.sentSelectData(1)
      },
      itemBtnHandler (val, item) {
        item.tableBtnType = val
        this.$emit('change', item)
      }
    }
  }
</script>

<style src="../css/componentCss/tableComponent.css" scoped></style>

<style scoped>
  .paginationContainer {
	height: 30px !important;
  }
  .commmonTable {
	height: auto !important;
  }
</style>

