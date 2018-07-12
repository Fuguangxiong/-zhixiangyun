<template>
  <div v-if="dialogTagVisible" class="labelview">
    <el-dialog title="标签信息" :visible.sync="dialogVisible" @close="close" :close-on-click-modal="false">
      <div v-if="dialogTagWait" class="el-loading-mask">
        <div class="el-loading-spinner">
          <svg viewBox="25 25 50 50" class="circular">
            <circle cx="50" cy="50" r="20" fill="none" class="path"></circle>
          </svg>
        </div>
      </div>
      <div class="aui" @click.self="isShowSearched=false">
          <input maxlength="10" id="label-input" name="label-input" v-model.trim="inputValue" class="text" autocomplete="off" @keyup.enter="add" >
          <input id="add-labels-editor-button" type="button" class="aui-button" @click="add" value="添加">
       </div>
       <div id="labels-autocomplete-list" class="aui-dd-parent resize-to-input" v-show="isShowSearched">
          <div class="aui-dropdown aui-dropdown-left">
            <ol class="last">
              <li class="" v-for="label in labelList" :key="label"><a href="javaScript:void(0)" @click="selectItemInList(label)" class="label-suggestion">
               <span :title="label"><em>{{label}}</em></span></a>
              </li>
            </ol>
          </div>
        </div>
        <div style="border-top: 1px #d9d9d9 dashed;margin-top:10px;margin-bottom:10px;"></div>
        <el-tag :key="label" type="primary" v-for="label in currentLabels" :closable="true" :close-transition="false" @close="removeLabel(label)" style="margin-left:5px">
            {{label}}
          </el-tag>
		</el-dialog>
    <el-dialog title="提示" :visible.sync="promptVisible" size="tiny" >
      <span>{{promptMessage}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="promptConfirm">确 定</el-button>
      </span>
    </el-dialog>  
  </div>
</template>
<script>
import apiClient from '@/publicJs/ApiClient.js'
import TipBoxService from '@/publicJs/TipBoxService.js'
import _ from 'lodash'
export default {
  name: 'LabelView',
  props: ['bindLabelArray', 'model', 'modelLabelKey', 'changeLabelCaller', 'isCreateModel', 'dialogTagVisible', 'maxTag'],
  data () {
    return {
      labelList: [],
      inputValue: '',
      currentLabels: [],
      // 提示信息
      promptMessage: '',
      // 弹出等待标志
      dialogTagWait: false,
      dialogVisible: false,
      // 在编辑model数据时立即更改其标签
      changeRightAway: true,
      // 提示框标志
      promptVisible: false,
      // 点击弹出框以外的地方是否触发关闭方法
      dialogModel: false,
      isShowSearched: false,
      // 允许添加得标签数量
      maxNumber: 100,
      form: {}
    }
  },
  mounted () {
    if (!this.bindLabelArray) {
      if (!this.model || !this.modelLabelKey) {
        throw new Error('标签对话框组件需要传入bindLabelArray或者同时传入model对象极其标签属性名"')
      }
      if (!this.model.hasOwnProperty(this.modelLabelKey)) {
        throw new Error('标签对话框组件model的标签属性"' + this.modelLabelKey + '"不存在')
      }
    }

    if (this.maxTag) {
      if (typeof (this.maxTag) !== 'number') {
        throw new Error('标签对话组件只能maxTag只能传入number类型数值')
      } else {
        this.maxNumber = this.maxTag
      }
    }

    if (this.isCreateModel === true || this.isCreateModel === 'true') {
      this.changeRightAway = false
    }
  },
  watch: {
    dialogTagVisible (value) {
      if (value === true) {
        this.currentLabels = this.getLabelByModel().slice(0)
      }
      this.dialogVisible = value
    },
    inputValue (value) {
      if (value === '') {
        this.isShowSearched = false
        return
      }
      if (!this.selectItem) {
        this.remoteMethod(value)
      } else {
        this.selectItem = false
      }
    }
  },
  methods: {
    getLabelByModel () {
      if (this.bindLabelArray) {
        return this.bindLabelArray
      }
      return this.model[this.modelLabelKey]
    },
    setLabelByModel () {
      if (this.bindLabelArray) {
        this.$emit('update:bindLabelArray', this.currentLabels)
      } else {
        this.model[this.modelLabelKey] = this.currentLabels
      }
    },
    remoteMethod (value) {
      this.labelList = []
      if (value !== '') {
        apiClient.get('/pubapi/label/search', {matchName: value}).then(data => {
          if (!data || data.length === 0) {
            this.isShowSearched = false
            return
          }
          this.isShowSearched = true
          this.labelList = _.difference(data, this.currentLabels)
        }).catch(e => {
          this.labelList = []
          this.isShowSearched = false
        })
      }
    },
    existsLabel (labelName) {
      let labels = this.currentLabels
      for (let i = 0; i < labels.length; i++) {
        if (labelName === labels[i]) {
          return true
        }
      }
      return false
    },
    close () {
      this.$emit('update:dialogTagVisible', false)
      this.inputValue = ''
    },
    promptConfirm () {
      this.promptVisible = false
      this.$refs.saveTagInput.$refs.input.focus()
    },
    selectItemInList (val) {
      this.selectItem = this.inputValue !== val
      this.isShowSearched = false
      this.inputValue = val
    },
    addToLabels (val) {
      if (this.currentLabels.length + 1 > this.maxNumber) {
        TipBoxService.open('数量超过限制,最大数量为:' + this.maxNumber, 2)
        return
      }
      this.isShowSearched = false
      if (!this.existsLabel(val)) {
        this.currentLabels.push(val)
      }
    },
    removeLabel (tag) {
      if (this.changeRightAway) {
        this.getLabelByModel().splice(this.getLabelByModel().indexOf(tag), 1)
        let callResult = this.changeLabelCaller()
        this.callBack(callResult, this.removeToDB, tag)
      } else {
        this.currentLabels.splice(this.currentLabels.indexOf(tag), 1)
      }
    },
    add () {
      if (this.inputValue === '') {
        return
      }
      if (this.changeRightAway) {
        if (!this.existsLabel(this.inputValue)) {
          this.getLabelByModel().push(this.inputValue)
          let callResult = this.changeLabelCaller()
          this.callBack(callResult, this.addToDB)
        }
      } else {
        this.addToLabels(this.inputValue)
        this.setLabelByModel() // 修改标签数组
        this.inputValue = ''
      }
    },
    addToDB () {
      return apiClient.get('/pubapi/label/add', {name: this.inputValue}).then(data => {
        if (data) {
          this.addToLabels(this.inputValue)
        } else {
          this.promptVisible = true
          this.promptMessage = '添加失败'
        }
        this.inputValue = ''
      }).catch(e => {
        console.error(e)
      })
    },
    removeToDB (tag) {
      return apiClient.get('/pubapi/label/remove', {name: tag}).then(data => {
        if (data) {
          this.currentLabels.splice(this.currentLabels.indexOf(tag), 1)
        } else {
          this.promptVisible = true
          this.promptMessage = '删除失败'
        }
        this.inputValue = ''
      }).catch(e => {
        console.error(e)
      })
    },
    callBack (callResult, changeToDB, tag) {
      if (callResult) {
        if (callResult.then && typeof callResult.then == 'function') {
          this.waitLoading(true)
          callResult.then(() => {
            return changeToDB(tag)
          }).then(() => {
            this.waitLoading(false)
          }).catch(() => {
            this.waitLoading(false)
          })
        } else if (callResult === true) {
          this.waitLoading(true)
          changeToDB(tag)
          this.waitLoading(false)
        }
      }
    },
    waitLoading (flag) {
      this.dialogTagWait = flag
    }
  }
}
</script>

<style>
.el-dialog__header {
    padding: 15px 15px 0;
    background-color: #56A8FE;
}

.el-dialog__header .el-dialog__title {
    line-height: 1;
    font-size: 14px;
    font-weight: 400;
    color: white !important;
}

.dialog-footer .el-button:focus,.dialog-footer .el-button {
    color: #ffffff;
    border-color: #25D185;
    background-color:#25D185;
}
.dialog-footer .el-button:hover {
    color: #ffffff;
    border-color: #25D185;
    background-color:#25D185;
}
.el-dialog__headerbtn .el-dialog__close {
    color: white !important;
}

.el-dialog__headerbtn:focus .el-dialog__close, .el-dialog__headerbtn:hover .el-dialog__close {
    color: white;
}

</style>
<style scoped>
.el-loading-mask {
  top: 0px; 
  left: 0px; 
  height: 100%; 
  width: 100%;
}
.aui input.text {
    border-radius: 3px;
    border: 1px #cacaca solid;
    line-height: 22px;
    margin: 0;
    width: 200px;
    display: inline-block;
    box-sizing: border-box;
    color: #1f2d3d;
    font-size: inherit;
    height: 36px;
    outline: 0;
    padding: 3px 10px;
    font-family: inherit;
}

#add-labels-editor-button {
    margin-left: 8px;
}

.aui-button {
      width: 80px;
    height: 30px;
    outline: none;
    border: none;
    background-color:#25D185;
    border-radius: 4px;
    color: #fff;
}
.aui-dd-parent {
    position: relative;
}

.aui-dd-parent .aui-dropdown {
    background-color: #fff;
    border: 1px solid #ccc;
    border-bottom-left-radius: 3px;
    border-bottom-right-radius: 3px;
    -moz-box-shadow: 0 3px 6px rgba(0,0,0,0.2);
    -webkit-box-shadow: 0 3px 6px rgba(0,0,0,0.2);
    box-shadow: 0 3px 6px rgba(0,0,0,0.2);
    padding: 0;
}
div.resize-to-input .aui-dropdown {
    width: 100%;
    margin-top: 5px;
}
.aui-dd-parent .aui-dropdown-left {
    left: 0;
}
.aui-dd-parent .aui-dropdown {
    background: #fff;
    border: 1px solid #ccc;
    border-bottom-left-radius: 3px;
    border-bottom-right-radius: 3px;
    -moz-box-shadow: 0 3px 6px rgba(0,0,0,0.2);
    -webkit-box-shadow: 0 3px 6px rgba(0,0,0,0.2);
    box-shadow: 0 3px 6px rgba(0,0,0,0.2);
    color: #000;
    margin-top: -1px;
    padding: 4px 0 4px 0;
    position: absolute;
    z-index: 2003;
}
	.aui-dropdown {
		list-style-type: none;
		overflow: auto;
		max-height: 250px;
	}
	
	.aui-dropdown li a span {
		background-position: 8px 50%;
		background-repeat: no-repeat;
		display: block;
		 padding-left: 20px; 
	}
	
	.aui-dropdown li:hover {
		/* color: #ffffff; */
		background-color: #e4e8f1;
		font-style: normal;
	}
	
	.label-suggestion span {
		color: #48576a;
	}
	
	.label-suggestion em {
		font-style: normal;
  }
  .aui-dropdown li  {
		list-style: none;
    line-height: 30px;
    padding: 0 10px;
    margin: 0;
    cursor: pointer;
    color: #48576a;
    font-size: 14px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
	}
</style>
