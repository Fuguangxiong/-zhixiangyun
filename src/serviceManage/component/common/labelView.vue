<template>
  <div v-if="dialogTagVisible" class="labelview2">
		<el-dialog title="标签信息" :visible.sync="dialogVisible" @close="close" :close-on-click-modal="false"
			v-loading.fullscreen.lock="dialogTagWait" element-loading-text="加载中" >
      <div class="aui" @click.self="isShowSearched=false">
          <input id="label-input" name="label-input" maxlength="10" v-model.trim="inputValue" class="text" autocomplete="off" @keyup.enter="add" >
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
        <div slot="footer" class="dialog-footer" v-if="!changeRightAway">
          <el-button @click="close">取 消</el-button>
          <el-button @click="close(true)">确 定</el-button>
        </div>
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
import apiClient from '../../../publicJs/ApiClient.js'
import _ from 'lodash'
export default {
  name: 'LabelView',
  props: ['bindLabelArray', 'model', 'modelLabelKey', 'changeLabelCaller', 'isCreateModel', 'dialogTagVisible'],
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
        this.dialogTagWait = true
        apiClient.get('/api/label/search', {matchName: value}).then(data => {
          if (!data || data.length === 0) {
            this.isShowSearched = false
            this.dialogTagWait = false
            return
          }
          this.isShowSearched = true
          this.dialogTagWait = false
          this.labelList = _.difference(data, this.currentLabels)
        }).catch(e => {
          this.labelList = []
          this.isShowSearched = false
          this.dialogTagWait = false
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
    close (changed) {
      if (changed === true) {
        this.setLabelByModel()
      }
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
        this.inputValue = ''
      }
    },
    addToDB () {
      apiClient.get('/api/label/add', {name: this.inputValue}).then(data => {
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
      apiClient.get('/api/label/remove', {name: tag}).then(data => {
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
          callResult.then(() => {
            changeToDB(tag)
          })
        } else if (callResult === true) {
          changeToDB(tag)
        }
      }
    }
  }
}
</script>

<style>
.labelview2 .el-dialog__header {
    padding: 20px 20px 0;
    background-color: #B61717;
}

.labelview2 .el-dialog__title {
    line-height: 1;
    font-size: 14px;
    font-weight: 500;
    color: white;
}

.labelview2 .el-button:focus, .labelview2 .el-button:hover {
    color: #b61717;
    border-color: #b61717;
}

.labelview2 .el-dialog__headerbtn .el-dialog__close {
    color: white;
}

.labelview2 .el-dialog__headerbtn:focus .el-dialog__close, .labelview2 .el-dialog__headerbtn:hover .el-dialog__close {
    color: white;
}

</style>
<style scoped>
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
    background-color: #f2f2f2;
    box-shadow: inset 0 3px 6px rgba(0,0,0,.1);
    border-color: #999;
    color: #000;
    border: 1px solid #ccc;
    border-radius: 3.01px;
    box-sizing: border-box;
    cursor: pointer;
    display: inline-block;
    font-family: inherit;
    font-size: 14px;
    font-variant: normal;
    font-weight: normal;
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
    padding-left: 33px;
}
.label-suggestion span:hover {
    color: #ffffff;
    background-color: #3b73af;
    font-style: italic;
}
.label-suggestion span {
   color: #3b73af;
}
.label-suggestion em {
  font-style: italic;
}
</style>
