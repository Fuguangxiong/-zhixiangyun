<template id="dialog-template">
  <transition name="modal" v-if="show">
    <div class="modal-mask" id="modal-mask" @click.stop="clickMask">
      <div class="modal-wrapper" id="modal-wrapper" v-bind:class="modalOptions.customClass">
          <div class="modal-container">
                <slot name="header">
                  <div class="modal-header" v-if="!modalOptions.hideTitle">
                     <h3>{{modalOptions.title}}</h3>
                     <i class="iconfont icon-weibiaoti101"  @click="close"></i>
                  </div>
                </slot>
              <slot name="component"></slot>
              <slot name="footer">
                  <div class="footer-button" v-if="!modalOptions.hideFooter">
                    <button class="btnGreen" @click="close">{{modalOptions.closeBtnText}}</button>
                  </div>
              </slot>
          </div>
      </div>
    </div>
  </transition>
</template>
<script>

export default {
  name: 'compDetail',
  props: ['show', 'title', 'customClass', 'closeBtnText', 'options'],
  data () {
    return {
    }
  },
  mounted () {
    window.document.onkeyup = (event) => {
      let options = this.options || {}
      if (event.keyCode === 27 && options.closeOnPressEscape !== false) {
        this.close()
      }
    }
  },
  watch: {

  },
  computed: {
    modalOptions () {
      let result = {}
      let options = this.options || {}
      result.title = this.title || options.title
      result.hideTitle = options.hideTitle
      result.hideFooter = options.hideFooter
      result.closeBtnText = options.closeBtnText || '关闭'
      result.customClass = this.customClass || options.customClass

      return result
    }
  },
  methods: {
    close: function () {
      this.$emit('update:show', false)
      this.$emit('showHistory')
    },
    clickMask (event) {
      if ((event.target.id === 'modal-wrapper' || event.target.id === 'modal-mask') && this.options && this.options.hideFooter) {
        this.close()
      }
    }
  }
}
</script>

<style scoped>
.modal-mask {
  position: fixed;
  z-index: 900;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .5);
  display: table;
  transition: opacity .3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
  z-index: 901;
}

.modal-container {
  width: 75%;
  max-height: 98%;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
  transition: all .3s ease;
  font-family: Helvetica, Arial, sans-serif;
  overflow-y: auto;
  margin-top: 15px;
  margin-bottom: 15px;
  opacity: 0.95;
}
.modal-container::-webkit-scrollbar{
  display: none;
}
.modal-header{
  border: 0;
}
.modal-header h3 {
  margin-top: 0;
  color: #56A4FE;
  text-align: center;
  font-size: 16px;
}

.dialog-footer {
  text-align: center;
}

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}

.footer-button {
  text-align: center;
}
.footer-button button:active{
  border: none;
}
.icon-weibiaoti101{
  font-size: 24px;
  color: #56A4FE;
  cursor: pointer;
  float: right;
  margin-top: -30px;
}
</style>
