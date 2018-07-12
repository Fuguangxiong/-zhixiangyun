import Vue from 'vue';
import App from '../App.vue'
import router from '../router';
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import jQuery from 'jquery'
import user from '../../publicJs/userService.js'
window.jQuery = jQuery;
Vue.use(ElementUI)
// user.autoAddTokenId(); //写死的tokenId
new Vue({
    el: '#app',
    router,
    template: '<app/>',
    components: { 'app':App }
})
