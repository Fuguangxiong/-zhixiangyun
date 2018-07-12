<template>
  <div class="msginput" @click.stop="toggle" :class="{active: showSelectlist}">
    <i class="iconfont icon-icon-up"></i>
    <input disabled :placeholder="preview" v-model="curdata" type="text">
    <div class="selectlist" v-show="showSelectlist" ref="main">
      <p class="selectlistItem" :title="item.name" @click="clickhandler(item)" v-for="(item,index) in data" :key="index">{{item.name}}</p>
    </div>
  </div>
</template>
<script>
export default {
  name: 'myselect',
  props: ['data', 'preview', 'curdata'],
  mounted () {
  },
  data () {
    return {
      showSelectlist: false
    }
  },
  methods: {
    clickhandler (item) {
      this.curdata = item.name
      this.$emit('change', item)
    },
    toggle () {
      if (this.data.length === 0) return
      this.showSelectlist ? this.hide() : this.show()
      this.$emit('changeSelect')
    },
    show () {
      this.showSelectlist = true
      document.addEventListener('click', this.hidePanel, false)
    },
    hide () {
      this.showSelectlist = false
      document.removeEventListener('click', this.hidePanel, false)
    },
    hidePanel (e) {
      if (!this.$refs.main.contains(e.target)) {
        this.hide()
      }
    }
  },
  beforeDestroy () {
    this.hide()
  }
}
</script>
<style lang="css" scoped>
  .border-error{
    border-color: #fa3753 !important;
  }
.msginput {
  position: relative;
  margin: 0 5px;
  flex: 1;
}
.msginput input[disabled],
.msginput input {
  /* margin: 0 5px; */
  border: 1px solid #bfcbd9;
  outline: none;
  flex: 1;
  height: 30px;
  line-height: 30px;
  border-radius: 4px;
  padding-left: 10px;
  padding-right: 20px;
  background-color: #fff;
  cursor: pointer;
  width: 100%;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
}
.msginput input:focus {
  border: 1px solid #20a0ff;
}
.msginput i.icon-icon-up {
  line-height: 1;
  color: #bfcbd9;
  font-size: 14px;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 13px;
  z-index: 10;
  transition: transform 0.3s;
}
.msginput.active i.icon-icon-up {
  transform: translateY(-50%) rotate(180deg);
}
.msginput.active input {
  border: 1px solid #20a0ff;
}
.msginput .selectlist {
  position: absolute;
  top: 40px;
  width: 100%;
  border: 1px solid #bfcbd9;
  z-index: 20;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  transition: height 3s;
  max-height: 160px;
  overflow-y: auto;
}
.msginput .selectlist p {
  height: 40px;
  line-height: 40px;
  padding-left: 10px;
  cursor: pointer;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
}
.msginput .selectlist p:hover {
  background-color: #e4e8f1;
}
</style>
