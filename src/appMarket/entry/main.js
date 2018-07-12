import Vue from 'vue';
import App from '../App.vue'
import router from '../router';
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import jQuery from 'jquery'
import Bootstrap from 'bootstrap/dist/js/bootstrap.min.js'
window.jQuery = jQuery;
import VueLazyload from "vue-lazyload";


import apiToken from '../../publicJs/apiToken.js'
import apiClient from '../../publicJs/ApiClient.js'
import loadColor from '../common/skinColor.js'
import userService from '../../publicJs/userService.js'
import UtilService from '../../publicJs/UtilService'

router.afterEach((to,from,next) => {
    window.scrollTo(0,0);
});
Vue.use(VueLazyload, {
error: require('../images/err.jpg'),//这个是请求失败后显示的图片
loading:require('../images/loading55.gif') ,//这个是加载的loading过渡效果
try: 4, // 这个是加载图片数量
preLoad:1
})
userService.autoAddTokenId();
let token = UtilService.getQuery('token') || UtilService.getQuery('tokenId')
if (token) {
    userService.storeInfo('tokenId', token)
}
Vue.use(ElementUI)
new Vue({
    el: '#app',
    router,
    template: '<app/>',
    components: { 'app':App },
    created(){
        window.configinfo = {
            dataList: [],
            configId: "",
            page: []
        }
        this.template = this.$route.query.template;
        this.preview = this.$route.query.preview;
        if (this.template != undefined) {
            this.getEsPreview(this.template)
        } else if (this.preview != undefined) {
            this.getRedisPreview(this.preview)
        } else if (this.template == undefined && this.preview == undefined) {
            this.getTemplate()
        }
    },
    mounted(){
    },
    methods:{
        getTemplate() {
            let that = this
            apiClient.get(apiToken.newApi('/ioapi/template/getTemplateByUser/'), "", function (data) {
                that.setConfig(data.results.data.config)
                that.changeskinstyle(data.results.data.colorStatus);
                window.configinfo.configId = data.results.data.id
                userService.storeInfo("templateId", that.configId);
            })
        },
        getRedisPreview(id) {
            let that = this
            apiClient.get(apiToken.newApi('/ioapi/template/getTemplatePreview/'), { id: id }, function (data) {
                that.setConfig(data.results.config)
                that.changeskinstyle(data.results.colorStatus);
                window.configinfo.configId = data.results.id
            })
        },
        getEsPreview(id) {
            let that = this
            apiClient.get(apiToken.newApi('/ioapi/template/getTemplateById/'), { id: id }, function (data) {
                that.setConfig(data.results.data[0].config)
                that.changeskinstyle(data.results.data[0].colorStatus);
                window.configinfo.configId = data.results.data[0].id
            })
        },
        changeskinstyle(colorStatus){
            if (colorStatus == 2) {
                let blckcss = '<style>' + loadColor.skincolor.blackcolor + '</style>'
                $('body').before(blckcss);
            } else if (colorStatus == 3) {
                let blckcss = '<style>' + loadColor.skincolor.bulecolor + '</style>'
                $('body').before(blckcss);
            }
        },
        setConfig(list){
            let configcss = ""
            let usercss = ""
            for (let i = 0; i < list.length; i++) {
                let el = list[i];
                window.configinfo.dataList.push(el.code)
                if (el.defcss) {
                    configcss += el.defcss
                }
                if (el.css) {
                    usercss += el.css
                }
                el.pageSize ? window.configinfo.page.push(el.pageSize) : window.configinfo.page.push('')
            }
            let astr = '<style>' + configcss + '</style>'
            let bstr = '<style>' + usercss + '</style>'
            $('body').before(astr);
            $('body').before(bstr);
        },
    },
})
