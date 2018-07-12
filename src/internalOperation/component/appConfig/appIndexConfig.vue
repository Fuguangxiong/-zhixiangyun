<template>
<div class="appIndexConfigBoxCon" :class="{dmStop:dmShowoom}">
	<div class="appIndexConfigBox" >
        <div class="icSetBot">
        <div class="icTile">
            <span>自定义模板</span>
        </div>  
        <div class="icSelbox">
            <span class="fonColor">智享云平台默认模板</span>
            <div class="icButCon">
                <button class="clor" @click="preview()">预览</button>
                <button class="clor1" @click="Deposit()">确定</button>
                <button class="clor2" @click="escDep">取消</button>
            </div>
        </div>
        </div>
        <div class="icSetCon">
            <div class="icLeftNav">
                <div class="icLeftNavCon">
                    <h2 class="icLeftNavConTlie">可选栏目</h2>
                    <ul id="drags">
                    <draggable v-model="dataNavLeft" :options="dragOptionClone()" :move="onMove"  @start="onStart"  @end="onEnd">
                        <li class="draglist" v-for="site in dataNavLeft" :id="site.code">
                            <p draggable="true"><i></i><em>{{site.name}}</em></p>
                            <span class="tlet">{{site.remark}}</span>
                        </li>
                    </draggable>  
                    </ul>
                </div>
            </div>
             <div class="dustbin" id="drops">
                <div class="conCen">
                    <!-- 静态组件 -->
                    <draggable v-model="domeTeml" :options="dragOptions()" :move="onMove"  @start="onStart" @end="onEnd">
                        <components v-for="(column,index) in domeTeml" :is="column.code"  :child-msg="column" @upup="deleDome" :msg="commid" :lisize="pegesunm" :key="index">
                        </components>
                    </draggable>
                </div>
            </div>
            <!-- 编辑 -->
            <div class="editDome" :class="{active:appbanner}">
                <div class="conEdit" >
                    <div class="tilet">
                        <span class="htext">{{ecadatatitle}}</span>
                        <i class="icon iconfont icon-guanbi i-style" @click="escEdit"></i>
                    </div>
                    <div class="timeRadio stleMotop">
                        <h2 class="tbiaot"></h2>
                        
                    </div>
                    <div class="listTax stleMotop" v-for="editlist in ecadata">
                        <h2 class="tbiaot">{{editlist.name}}</h2>
                            <div v-if="editlist.type == 'radio' ">
                                <div class="inpuradio" >
                                <span class="radioDm" @click="radioClik(editlist.item,i)"  v-for="(e,i) in editlist.item" :class="e.checked=='true' ? 'active' :''"><i></i><em>{{e.name}}</em></span>
                                <!-- <span class="radioDm" @click="radioClik(editlist.item,i)"  v-for="(e,i) in editlist.item" :class="{active:e.checked}"><i></i><em>{{e.name}}</em></span> -->
                                <!--  需要拿到最近的 数量来显示  还未做 -->
                            </div>
                            
                        </div>
                        <div v-else-if="editlist.type == 'content'">
                             <ul>
                                <li class="" v-for="e in editlist.item" @click="lodacomm(e.url)">
                                +&nbsp;&nbsp;{{e.name}}
                                </li>
                            </ul>
                        </div>
                        <div v-else-if="editlist.type == 'css'">
                            <ul>
                                <li class="active" v-for="e in editlist.item" @click="lodacomm(e.url)">
                                +&nbsp;&nbsp;{{e.name}}
                               
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="editBut">
                            <button class="clor1" @click="qued()">确定</button>
                            <button class="clor2" @click="escEdit">取消</button>
                    </div>
                </div>
            </div>
        </div>
	</div>
    <div class="componentCon">
          <div class="componentConBox">
            <i class="incoStop" @click="dmShowoomp()"></i>
            <div class="componentmode">
              
               <components :is="commname"  :child-css="comDomData" :childlmid="lanmuId" :openfn="openChildFn" :child-moodid="temId" :child-hxcss="hxDataCss"  @colcss="changecss" :msg="msg" :key="commname">
                        </components>
               
            </div>
        </div>
        
    </div>
    </div>
</template>

<script>
	import LabelView from '../../../publicComponent/labelView.vue';
	import apiToken from '../../../publicJs/apiToken.js';
	import apiClient from '../../../publicJs/ApiClient.js';
	import TipBoxService from '../../../publicJs/TipBoxService.js';
	import LoadingBoxService from '../../../publicJs/LoadingBoxService.js';
	import NoticeBox from "../../../publicJs/NoticeBoxService.js";
	import appPublicJs from '../../common/public.js';
    import draggable from 'vuedraggable';
    import formcss from '../../common/formatcss.js';
    import publicPathConfig from '../../../publicJs/publicPathConfig.js'
    //组件模块
    import appbanner from '../componentConfig/appbannerimgConfig.vue';
    import appsearch from '../componentConfig/appsearchConfig.vue';
    import apphotrecommended from '../componentConfig/apphotrecommendedConfig.vue';
    import appspecial from '../componentConfig/appspecialConfig.vue';
    import appnewapplication from '../componentConfig/appnewapplicationConfig.vue';
    import appranking from '../componentConfig/apprankingConfig.vue';
    import appnewarrival from '../componentConfig/appnewarrivalConfig.vue';
    import appfriendship from '../componentConfig/appfriendshipConfig.vue';
    import appwonderfulspecial from '../componentConfig/appkeywordsconfig.vue';
    //编辑组件
    import appbannerimgconfig from './appBannerImgConfig.vue';//轮播图导航配置
    import appnavconfig from './appNavConfig.vue';//导航菜单
    import appfriendshiplinkconfig from './appFriendshipLinkConfig.vue';//轮播图导航配置
    import appnewserviceconfig from './appNewServiceConfig.vue' //编辑新锐应用
    import appcssconfig from './appCssConfig.vue';//配置css
    import appspecialconfig from './appSpecialConfig.vue'; //精彩专题
    import apphotconfig from './appHotConfig.vue' //热门应用
    import appkeywordsconfig from './appKeyWordsConfig.vue' //关键词
    import appimgconfig from './appImgConfig.vue'
    
	export default {
		name: 'appKeyWordsConfig',
		data() {
			return {
                dmShow:false,//修改框框默认不现实
                appbanner:false,
                dataNavLeft:[],//左边菜单
                dataNavLeftcode:[],//左边菜单code
                domeTeml:[],//右边栏目模块数据
                comDomData:[],//组件穿过来的
                coomCofig:{},//整个模块dom 的config
                openChildFn:0,
                //编辑
                ecadata:[],
                lumAjx:false,
                //模块名称
                ecadatatitle:'',
                dmShowoom:false,
                commname:'',//编辑加载组件
                commid:'',
                groupId:'',//栏目分组
                lanmuId:'',//栏目id
                temId:'',
                hxDataCss:[],//回显css
                radioSize:0,//默认列表几个
                pegesunm:0,
                msg:'',
                isDragging:false,
                delayedDragging:false
			}
        },
        updated(){
        },
		mounted() {
            this.temId = this.$route.query.temId;//模版带过来的id
            this.listTemp();
            this.$root.eventHub.$on('comtiem', (data,t) => {
                var that = this;
                this.appbanner = t;
                this.comDomData = data;
                this.ecadatatitle=this.comDomData.name;
                this.dataEec();
            });  
		},
		watch: {
            isDragging (newValue) {
                if (newValue){
                    this.delayedDragging= true
                    return
                }
                this.$nextTick( () =>{
                    this.delayedDragging =false
                })
            },
		},
         components: {
            draggable,//拖拽
            appbanner,//轮播图
            appsearch,//搜索
            apphotrecommended, //热门
            appspecial, //专题
            appnewapplication, //新锐应用
            appranking,//热门排行
            appnewarrival,//最新上架
            appwonderfulspecial,
            appfriendship,//友情链接
            appbannerimgconfig,//编辑轮播图
            appnavconfig,//编辑轮播图关键词
            appfriendshiplinkconfig,//编辑友情链接
            appnewserviceconfig,//编辑新锐应用
            appspecialconfig,//编辑精彩专题
            appkeywordsconfig,//编辑关键词
            apphotconfig,//热门应用
            appcssconfig,//配置css
            appimgconfig,//配置图标
           
		},
		methods: {
            //拖拽参数
            dragOptions () {
                return  {
                    animation: 0,
                    group: {name:'description',pull:false},
                    disabled: false,
                    ghostClass: 'ghost'
                };
            },
            dragOptionClone () {
                return  {
                    animation: 0,
                    group: {name:'description',pull:'clone',put:false},
                    disabled: false,
                    ghostClass: 'ghost'
                };
            },
            onMove ({relatedContext, draggedContext}) {
                const relatedElement = relatedContext.element;
                const draggedElement = draggedContext.element;
                return (!relatedElement || !relatedElement.fixed) && !draggedElement.fixed
            },
            onEnd(eve){
                if($(eve.to).parent().attr('id')&&$(eve.to).parent().attr('id')=="drags"){
                    return
                }
                let htmlId=eve.item.getAttribute('id')
                for (let i = 0; i < this.domeTeml.length; i++) {
                    const element = this.domeTeml[i];
                    if(i==eve.newIndex){
                        continue
                    }
                   if(htmlId==element.code){
                       this.domeTeml.splice(eve.newIndex,1)
                       TipBoxService.open("栏目不允许重复",2)
                   }
                }
            },
            onStart(){
                this.isDragging=true
            },
            //预览
            preview(){
                var that = this;
                var id= that.temId;
                var myData={
                    id:id,
                    group:that.groupId,
                    config:JSON.stringify(this.domeTeml)
                };
               
                 apiClient.post(apiToken.newApi('ioapi/template/saveTemplateRedis/'),myData, function(data) {    
                    window.open(publicPathConfig.APP_MARKET+"#/?preview="+id+"");
                })
                // console.info('111',this.domeTeml)
            },
            // 取消保存
            escDep(){
                 this.$router.push({name:'appTemplateConfig',query:{}});
            },
            //保存
            Deposit(){
                var that = this;
                var id= that.temId;
                var myData={
                    id:id,
                    config:JSON.stringify(this.domeTeml)
                };
                LoadingBoxService.open('保存中...');
                console.info('adadadad',this.domeTeml)
                 apiClient.put(apiToken.newApi('ioapi/template/updateTemplate/'),myData, function(data) {
                    // console.info('文件',data)
                    LoadingBoxService.close();
                    that.$router.push({name:'appTemplateConfig',query:{}});
                })
              
            },
            //加载组件
            lodacomm(link){
                this.openChildFn ++;
                this.dmShowoom = true;
                this.escEdit();
                this.commname = link;
                console.info('gjc',this.commname)  
            },
            changecss(msg){
                var that = this;
                that.dmShowoom = false;
                console.info('css传到模版',msg);
                var that = this;
               
                var commode = that.domeTeml;//模块
                var comIndex = that.comDomData.code; //组件穿过来的
                
                for(var i = 0; i<commode.length;i++){
                    if(commode[i].code == comIndex){
                       
                        commode[i].css = msg;
                        //  console.info('css-s-',commode[i].css)
                    }     
              
                } 
            },
            //回显
            cssSrn(config){
                var that = this;
                that.hxDataCss = config//模版css
            },
            //编辑修改数据,那到左边栏目的code 
            dataEec(){
            var that = this;
            var dataIndex = this.dataNavLeft;//左边导航的
            var commode = that.domeTeml;//模块
            var comIndex = this.comDomData.code; //组件穿过来的
                if(!that.lumAjx) return false;
                for(var i = 0; i<dataIndex.length;i++){
                    if(dataIndex[i].code == comIndex){ 
                       that.ecadata=JSON.parse(dataIndex[i].config);
                       that.coomCofig = dataIndex[i];
                       that.lanmuId = dataIndex[i].id;
                       that.cssSrn(that.coomCofig);
                    }     
                } 
                for (let a = 0; a < commode.length; a++) {
                    const el = commode[a];
                    if(el.code==comIndex&&el.pageSize){
                        for (let b = 0; b < that.ecadata[0].item.length; b++) {
                            const cc = that.ecadata[0].item[b];
                            if(cc.value==el.pageSize){
                                that.ecadata[0].item[b].checked="true"
                            }else{
                                that.ecadata[0].item[b].checked="false"
                            }
                        }
                    }
                }
            },
            qued(){
                var that = this;
                var comIndex = that.comDomData.code; //组件穿过来的
                var commotip = that.domeTeml; //保存的大模版
                that.pegesunm ++;
                 this.appbanner=false;
                for(var i = 0; i<that.domeTeml.length;i++){
                  
                    if(that.domeTeml[i].code == comIndex){
                         console.info('lala',that.domeTeml[i])
                         that.domeTeml[i].pageSize = that.radioSize;
                    }
                    // if(that.domeTeml[i].code == 'apphotrecommended'){
                    //     console.info('lala',that.domeTeml[i])
                    //     that.domeTeml[i].pageSize = that.radioSizea;
                    // }
                }
            },
            //查询模版栏目列表拿到模版config
            listTemp(){
                var that = this;
                var myData={
                    id:that.temId
                };
                LoadingBoxService.open('加载中...');
                 apiClient.get(apiToken.newApi('ioapi/template/getTemplateByIdForConf/'),myData, function(data) {
                     
                    var groupId = data.results.data[0].group;
                    var arrObj = data.results.data;
                    LoadingBoxService.close();
                    that.domeTeml = JSON.parse(arrObj[0].config);
                    // for(var i = 0; i<arrObj.length;i++){
                    //         that.domeTeml=arrObj[i].config;
                    // }
                    that.navList(groupId);
                    console.info('得到模版',that.domeTeml); 
                })
                
            },
            //下载
            downloadStyle(){
                
                var myData='';
                apiClient.get(apiToken.newApi('ioapi/upload/downloadcss/'),myData, function(data) {
                   
                })
            },
            // 单选栏目个数
            radioClik(e,idex){
                console.log(33,this.ecadata)
                // e.checked = true;
                var that = this;
                for(var i = 0 ; i<e.length; i++){
                    e[i].checked = "false";
                }
                e[idex].checked="true";
             
                that.radioSize = e[idex].value;
               
            },
            //删除组件
            deleDome(commid) {
                var that = this;
                var sure=function(){
                    that.msg = commid;
                    for(var i=0; i<that.domeTeml.length;i++){
                        if(that.msg==that.domeTeml[i].code){
                            that.domeTeml.splice(i,1);
                             NoticeBox.close();
                        }
                    }
                }
                NoticeBox.open('确定删除模版？',sure)
            },
            // 关闭组件配置
            dmShowoomp(){
                this.dmShowoom=false;
            },
            //修改
            editData(code){
                this.appbanner=true;
            },
            // 关闭
            escEdit(){
                this.appbanner=false;
            },
            //删除dome
            escDmoe(code){
                var cls ="."+code;
                $(cls).hide();
            },
            navList(group){
                var that = this;
                var myData = {
                     group:group
                }
                apiClient.get(apiToken.newApi('ioapi/column/getColumnQueryList/'),myData, function(data) {
                        var navColumn =data.results.data;
                        that.lumAjx = true;
                        that.dataNavLeft = navColumn;
                        // 取左侧导航的code
                        for(var i =0 ; i< navColumn.length;i++){
                            that.dataNavLeftcode.push(navColumn[i].code);
                        }
                               
                })
            },
		}

	}
</script>

<style src='../../css/appIndexConfigBox.css' scoped>
</style>
