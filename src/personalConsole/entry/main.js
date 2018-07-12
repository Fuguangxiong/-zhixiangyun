import Vue from 'vue'
import App from '../App.vue'
import router from '../router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import '../css/btn.css'

import {verifyPermission} from '../../publicJs/verifyPermission'
Vue.prototype.verifyPermission = verifyPermission

import VueLazyload from 'vue-lazyload'
router.afterEach((to, from, next) => {
  window.scrollTo(0, 0)
})
Vue.use(VueLazyload, {
  error: require('../images/err.jpg'), // 这个是请求失败后显示的图片
  loading: require('../images/loading43.gif'), // 这个是加载的loading过渡效果
  try: 4, // 这个是加载图片数量
  preLoad: 1
})
Vue.use(ElementUI)
// user.autoAddTokenId(); //写死的tokenId
new Vue({
  el: '#app',
  router,
  template: '<app/>',
  components: {
    'app': App
  }
})
