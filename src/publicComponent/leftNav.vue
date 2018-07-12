<template>
  <div>
    <div class="fiexe pright">
     <div v-for='(item, index) in navList'>
        <span class="span" :class='{active:index === selectIndex}'>
          <a href="javascript:void(0)" @click='goThere(item.toPath, index)'>{{item.label}}</a>
        </span>
      </div>
    </div>
  </div>
</template>
<script>
  import _ from 'lodash'
  export default{
    data () {
      return {
        selectIndex: 0,
        navList: [
          { label: '资源目录', toPath: '/rc/list' },
          {label: '申请管理', toPath: '/applyManageAdministrator'},
          {label: '个人注册', toPath: '/personRegisterManage'},
          {label: '注册管理', toPath: '/personRegisterManage'},
          {label: '数据元管理', toPath: '/rc/metadata'},
          {label: '质量监测', toPath: ''},
          {label: '目录维护', toPath: '/rc/catalogConfig'}
        ]}
    },
    props: {
      // selectIndex: {
      // }
    },
    methods: {
      goThere (toPath, index) {
        if (!toPath) return
        this.$router.push(toPath)
        this.selectIndex = index
      }
    }
  }
</script>
<style scoped>
 .fiexe{
  width: 60px;
  position: fixed;
  -webkit-box-shadow: 0 0 3px 2px  #dedede;
  -moz-box-shadow: 0 0 3px 2px  #dedede;
  box-shadow: 0 0 3px 2px #dedede;
  z-index: 999;
  background: #fefefe;
}
.fiexe div {
  position: relative;
}
.fiexe div .span {
  display: block;
  width: 24px;
  padding: 15px 14px;
  height: 30px;
  color: #666;
  margin: 0 4px;
  border-bottom: 1px #dcdcdc solid;
}
.fiexe div span.active::before {
  content: '';
  width: 0;
  height: 0;
  border-top: 10px solid transparent;
  border-bottom: 10px solid transparent;
  border-left: 10px solid #fff;
  position: absolute;
  right: -10px;
  top: 50%;
  margin-top: -5px;
}
.fiexe div span.active a {
  color: #b61717;
}
</style>
