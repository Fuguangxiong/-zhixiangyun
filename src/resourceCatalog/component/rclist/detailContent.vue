<template>
  <div class="box">
    <i class="iconfont icon-shuju"></i>
    <span class="num">序号 : {{index + 1}}</span>
    <div class="msg">
      <span class="tableName">{{tableName[typeNum]}} : <a href="javascript:;" @click="toNextPage(item.id)">{{item.name}}</a></span>
    </div>
    <div class="msg">
      <span class="sourceName">注册者所在部门 : <span class="textinfo">{{item.recordUnit}}</span></span>
      <span class="creater">注册者 : <span class="textinfo">{{item.recordPerson}}</span></span>
      <span class="createTime">注册时间 : <span class="textinfo">{{item.createdTime | time}}</span></span>
    </div>
  </div>
</template>
<script>
export default {
  name: 'detailContent',
  props: [
    'type',
    'item',
    'index'
  ],
  data () {
    return {
      tableName: ['数据资源名称', '接口名称', '标准规范名称']
    }
  },
  computed: {
    typeNum () {
      if (this.type === 'data') {
        return 0
      } else if (this.type === 'interface') {
        return 1
      } else if (this.type === 'standard') {
        return 2
      }
    }
  },
  methods: {
    toNextPage (id) {
      this.$emit('toNextPage', id)
    }
  }
}
</script>
<style lang="css" scoped>
  .box {
    height: 90px;
    background-color: #f9f9f9;
    line-height: 90px;
    margin-bottom: 10px;
    min-width: 840px;
  }
  .box a {
    color: #2C4FFE;
    text-decoration: none;
  }
  .box:hover {
    background-color: #F5F9FF;
  }
  .box:hover i.icon-shuju {
    color:#63ADFD;
  }
  i.icon-shuju {
    font-size: 22px;
    padding: 0 28px;
    color: #33D48D;
    float: left;
  }
  span.num {
    float: left;
  }
  .msg {
    line-height: 45px;
    margin-left: 150px;
    display: flex;
  }
  .msg .sourceName {
    display: inline-block;
    width: 300px;
    color: #000;
    flex: 1;
  }
  .msg .creater {
    display: inline-block;
    width: 245px;
    color: #000;
    flex: 1;
  }
  .msg .createTime {
    color: #000;
    flex: 1;
  }
  .textinfo {
    color: #888;
  }
</style>
