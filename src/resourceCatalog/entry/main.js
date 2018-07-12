import Vue from 'vue'
import App from '../App.vue'
import router from '../router'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import '../../publicCss/public.css'

import '../css/btn.css'
import '../css/default.css'
import '../css/breadCrumb.css'
import userService from '../../publicJs/userService'

Vue.use(ElementUI)
userService.autoAddTokenId()
Vue.prototype.fullHeight = document.documentElement.clientHeight

new Vue({
  el: '#app',
  router,
  template: '<app/>',
  components: { app: App }
})
