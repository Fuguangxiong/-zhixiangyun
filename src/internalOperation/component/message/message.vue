<template>
    <div class="collection">
        <!-- 栏目位置-->
        <div class="conCent">
            <div class="rise">
                <span class="textTlie">消息管理</span>   
            </div>
            <div class="wordBlock tStyel">
                <span class="textName">消息内容：</span>
                <div>
                    <div class="search width248">
                        <input type="text" placeholder="请输入消息内容" class="inputStyle" v-model.trim="myData.message" @keyup.enter="getList">
                        <button class="searchBut"  @click="getList"><i class="icon iconfont icon-sousuo" ></i></button>
                    </div>
                </div>
            </div>
            <div class="wordBlock tStyel tStyelfuw ">
                <span class="textName">消息状态：</span>
                 <div class="listCon">
                    <ul>
                        <li class="wti"  :class="{active:isAclass}" @click="showAllStatus()"><a>全部</a></li>
                        <li :class="{active: statusItem.checkbox}" v-for="(statusItem,index) in dataliststat" :key='statusItem.name' @click="showMessageByStatus(index)">
                            <em><a>{{ statusItem.name }}</a></em>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="wordBlock tStyel tStyelfuw ">
                <span class="textName">消息类型：</span>
                <div class="listCon" :class="{checkboxShow: choice}" v-show="isShow">
                    <ul :class="{heiauto: moredm}" id="wdtcst">
                        <li class="wti"  :class="{active:isAclass1}" @click="showAllType()"><a>全部</a></li>
                        <li v-for="(item,index) in datalist" :key='item.name' @click="showMessageByType(index)" :class="{active: item.checkbox}">
                            <i class="cheboxInput"></i><em><a>{{ item.name }}</a></em>
                        </li>
                    </ul>
                </div>
                <div class="selected" v-show="!isShow">
                    <div class="selectedAll">
                        <span v-for="seleAll in cheboxArr" :key='seleAll'>
                            {{ seleAll }}<i>,</i>
                        </span>
                        <em class="dataAll" @click="clearAllType()">x</em>
                    </div>
                </div>
                <div class="rightBut" v-show="isShow">
                    <button v-show="isShowDuoxuan" class="inpuChbox cheboxAllSyle" @click='cheboxAll()' :class="{active: choice}">{{cheboxtext}}</button>
                </div>
            </div>
        </div>
        <!-- ／栏目位置 -->
        <div class="queryList">
            <div class="queryListWord">
                <div class="sortCon">
                    <span :class="{active:activec=='zn'}" @click="sortFun('zn')">智能</span>
                    <span class="sortWord" :class="{active:activec=='lx','wordUp':!flagObj.lx}" @click="sortFun('lx')"><em>类型</em><i class="icon iconfont icon-jiantou-up"></i><i class="icon iconfont icon-jiantou-lower"></i></span>
                    <span class="sortWord" :class="{active:activec=='zt','wordUp':!flagObj.zt}" @click="sortFun('zt')"><em>状态</em><i class="icon iconfont icon-jiantou-up"></i><i class="icon iconfont icon-jiantou-lower"></i></span>
                    <span class="sortWord" :class="{active:activec=='sj','wordUp':!flagObj.sj}" @click="sortFun('sj')"><em>时间</em><i class="icon iconfont icon-jiantou-up"></i><i class="icon iconfont icon-jiantou-lower"></i></span>
                </div>
                <div v-show="pageShow">
                <div class="checkboxCon" v-show="checkFlag">
                    <div class="checkboxBut" @click="checkMore"><i class="icon iconfont icon-caozuo"></i></div>
                </div>
                 <div class="topPage" v-show="checkFlag">
                      <em><i class="cloer">{{myData.pageNum}}</i>/{{Math.ceil(pageTotal/myData.pageSize)}}</em>
                      <div class="pageTop" v-show="noDataPage">
                        <span @click="goNext(-1)"><i class="icon iconfont icon-icozuola"></i></span>
                        <span @click="goNext(1)"><i class="icon iconfont icon-icozuola1"></i></span>
                      </div>
                  </div>
                  <!-- 批量删除 -->
                <div class="more" v-show="!checkFlag">
                    <div class="sure" @click="surelFun">删除</div>
                    <div class="cancel" @click="cancelFun">取消</div>
                </div>
                </div>
            </div>
            <div class="listCon" :class="{nodata:!noData}" :style="{'height': !noData ? heightNub : 'auto' }">
                <div class="listLi" :class={evaluationLiFlag:!checkFlag}  v-for="(item,index) in messageArray" :key='item.id'>
                    <div :class="[item.read_unread==2 ? 'corner' :'normal']">
                            <div class="inpuRiog" v-show="!checkFlag" @click.stop="toCheckBox(index)"></div>
                            <div class="listLiLeft">
                                <dl>
                                    <dd>
                                        <b class="classmona"></b>
                                        <span class="porAlik"></span>
                                         <i class="icon iconfont icon-xiaoxi"></i>
                                    </dd>
                                    <dt>
                                        <span v-bind:title="item.message" class="porAlik spanMessage" @click="toMessageDetails(item.id)">
                                               {{item.message.length>60?(item.message.substring(0,60)+'...'):item.message}}
                                        </span>
                                        <span class="spanType"> {{item.message_type==1?"申请结果":(item.message_type==2?"审批结果":
                                                (item.message_type==3?"账号信息":(item.message_type==4?"产品服务":"其他")))}}
                                        </span>
                                        <span class="spanTime"><p>{{item.created_time|dataFormat}}&nbsp;&nbsp;{{item.created_time|timeFormat}}</p> </span>
                                    </dt>
                                </dl>
                            </div>
                            <div class="setCheok" >
                                <div class="setCheokCon">
                                    <div class="setDat">
                                        <div class="titles"><em>删除</em></div> 
                                    </div>  
                                    <div class="checkItem" v-show="!checkFlag" @click.stop="toCheckBox(index)">
                                        <div class="centr">
                                            <i class="icon iconfont icon-duigou" v-show="checkBox[index].flag"></i>
                                        </div>
                                    </div>
                                    <div class="setEsc" @click="delMessageById(item.id)"><button>删除</button></div> 
                                </div>   
                            </div>
                    </div>
                </div>
            </div>
        </div>
         <div class="block" v-show="noDataPage">
                <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page.sync="myData.pageNum"
                :page-size="myData.pageSize"
                layout="prev, pager, next, jumper"
                :total="pageTotal">
                </el-pagination>
        </div> 
    </div>
</template>
<script>
import UserCookieService from "../../../publicJs/UserCookieService.js";
import userService from "../../../publicJs/userService.js";
import apiToken from "../../../publicJs/apiToken.js";
import apiClient from "../../../publicJs/ApiClient.js";
import LoadingBoxService from "../../../publicJs/LoadingBoxService.js";
import UtilService from "../../../publicJs/UtilService.js";
import appPublicJs from "../../common/public.js";
import NoticeBox from "../../common/NoticeBox.js";
import TipBoxService from "../../../publicJs/TipBoxService.js";
    export default {
    name: "collection",
    data (){
            return {
                activec: "zn",
                texeSize:0,//标签数量
                checkFlag:true,
                active: 0,
                choice:false,//判断是单选还是多选
                moredm:false,//更多
                cheboxdm:false,//多选
                messageArray:[],//列表查询
                cheboxArr:[],//服务多选
                cheboxArrstatus:[],//状态多选
                checkBox:[],
                cheboxtext:'多选',
                 tagArry:[],
                 tagArryLn:[],
                flagObj:{
                        lx:false,
                        pf:false,
                        zt:false,
                        sj:false
                },
                myData:{
                    message:'',//消息名称
                    readUnread:'',//消息状态
                    messageType:'',//消息类型
                    sort: "desc",//排序
                    nameType: "zn",//排序类型
                    pageSize: 10,
                    pageNum: 1
                },
                atveSize:0,//知道我选中了几个标签
                isAclass1:true,//控制关键词高亮（类型）
                isAclass:true,//控制关键词高亮(状态)
                pageTotal: 1,//分页默认
                isShow:true,
                isShowDuoxuan:false,
                noData:true,
                noDataPage:false,//少于一页分页不显示
                heightNub:100,//未查询到数据显示dome 的默认高度
                pageShow:false,//根据分页显示隐藏
                datalist: [],//标签数据1
                dataliststat: [],//消息状态
                searSize:true
            }
        },
    created() {
        this.showStatus();//默认全部状态
        this.showType();//默认全部类型
        this.getList();
        this.tokenId = this.$route.query.tokenId || userService.getTokenId();
        if (this.tokenId != undefined) {
            var that = this;
            UserCookieService.userInfoToCookie(this.tokenId, function( userName,images ) {});
        }
    },
    filters: {
            dataFormat: function(value) {
            return UtilService.formatDuring(value,"yyyy-MM-dd")
            },
            timeFormat: function(value) {
            return UtilService.formatDuring(value,"HH:mm:ss")
            },
            imgPath:function(value){
               
            return  apiClient.apiBaseUrl + appPublicJs.serviceImgShow + value;
            }
        },
    mounted(){
        this.domWith();
        this.domHieg();
    },
    methods:{
        handleCurrentChange() {
            this.getList();
        },
        handleSizeChange() {},
        //消息状态（全部）
        showAllStatus(){
            var that = this;
            if(!that.noData) return false;
            var myData = '';
            that.isAclass = true;//高亮显示
           //点击全部取消其他关键词高亮
           for(var i =0 ; i<that.dataliststat.length;i++){
               that.dataliststat[i].checkbox = false;
           }
            that.myData.readUnread ='';
            that.myData.pageNum=1;
            that.getList();
        },
        // 消息状态（已读未读）
        showMessageByStatus(e){
            var that = this;
             if(!that.noData) return false;
            that.isAclass = false;//全部去掉高亮
            //其他去掉高亮
            for(var i = 0 ; i<that.dataliststat.length; i++ ){
                that.dataliststat[i].checkbox = false;
            }
            that.dataliststat[e].checkbox = true;//当前高亮
            that.myData.readUnread = that.dataliststat[e].code;
            that.myData.pageNum=1;
            that.getList();
        },

        //全部类型查询
        showAllType(){
            var that = this;
             if(!that.noData) return false;
            that.isAclass1=true;
            that.myData.messageType ='';
            //点击全部取消其他关键词高亮
           for(var i =0 ; i<that.datalist.length;i++){
               that.datalist[i].checkbox = false;
           }
           that.myData.pageNum=1;
           that.getList();
        },
        // 多选状态(根据类型查消息)
        showMessageByType(e){
            var that = this;
             if(!that.noData) return false;
            var sArr =[];
            that.isAclass1 = false;
            // 如果是多选就不查询，单选就查询
            if(that.choice){
                that.datalist[e].checkbox = !that.datalist[e].checkbox;
                for(var i = 0 ; i<that.datalist.length; i ++){
                   if(that.datalist[i].checkbox){
                         sArr.push(that.datalist[i].name);
                         that.atveSize = sArr.length;
                   }else{
                      
                   }
                }
              }else{
                    for(var i = 0 ; i<that.datalist.length; i++ ){
                        that.datalist[i].checkbox = false;
                    }
                    that.datalist[e].checkbox = true;
                    that.myData.messageType = that.datalist[e].code;
                    that.myData.pageNum=1;
                    that.getList();
              }
        },
         // 多选标签确定
        cheboxAll(){
            var that = this;
            var sty = ''
            that.cheboxArr=[];
            that.cheboxCodeArr=[];
            for(var i = 0 ; i<that.datalist.length; i++ ){
                if(that.datalist[i].checkbox){
                    that.cheboxArr.push(that.datalist[i].name);
                    that.cheboxCodeArr.push(that.datalist[i].code);
                } 
            }
            that.choice = true;
            for(var i =0 ; i<that.cheboxCodeArr.length; i++){
                if(i<( that.cheboxCodeArr.length-1)){
                    that.cheboxCodeArr[i]?sty+=that.cheboxCodeArr[i]+",":""
                }else{
                    that.cheboxCodeArr[i]?sty+=that.cheboxCodeArr[i]:""
                }
            }
        
            // 多选查询
            if(that.cheboxtext=="确定"){
                //如果多选状态下没有选中就当取消
                if(that.atveSize<=0){
                    that.cheboxtext="多选"
                    that.choice = false;
                    return false
                }
                //如果多选状态下没有选中1一个就走单选
                if(that.atveSize==1){
                     console.info('只能选中一个')
                    that.cheboxtext="多选"
                    that.choice = false;
                    that.myData.messageType = sty;
                    that.myData.pageNum=1;
                    that.getList();
                    return false
                }else{
                     console.info('1个进来了',that.atveSize)
                }
                that.isShow = false;
                that.cheboxtext="多选"
                that.choice = false;
                that.myData.messageType = sty;
                that.myData.pageNum=1;
                that.getList();
                return false;
                
            }else{
                 that.cheboxArr=[];
            }
            that.cheboxtext="确定";
            
        },
        
       //分页
       goNext(n){
        this.myData.pageNum=this.myData.pageNum+n;
        if(this.myData.pageNum==0){
            this.myData.pageNum=1
            return
        }
        if(this.myData.pageNum==Math.ceil(this.pageTotal/this.myData.pageSize)+1){
            this.myData.pageNum=Math.ceil(this.pageTotal/this.myData.pageSize)
            return
        }
        },
        // 取消重新选中
        clearAllType(){
            var that = this;
            that.atveSize='';
            that.isShow = true;
            that.isAclass1= true;
            that.myData.messageType = '';
            that.myData.pageNum=1;
            that.getList();
            for(var i = 0 ; i<that.datalist.length; i++ ){
                 that.datalist[i].checkbox=false;
            }
        },
        //设置多选删除
         toCheckBox(index){
             this.checkBox[index].flag=!this.checkBox[index].flag;
        },
        // 菜单排序查询
        sortFun(flag){
            var that = this;
            if(!that.noData) return false;
            for(let key in this.flagObj){
              if(key == flag) {
                    this.flagObj[key] = !this.flagObj[key]
                    this.flagObj[key]?this.myData.sort="desc":this.myData.sort="asc"          
                } else{
                    this.flagObj[key] = false      
                }
            }
            this.activec=flag;
            this.myData.nameType=flag;
            this.myData.pageNum = 1;
            this.getList()
        },


        checkMore(){
          this.checkFlag = false;
            for (let i = 0; i < this.checkBox.length; i++) {
                this.$set(this.checkBox[i],"flag",true)
            }
        },
        //取消批量删除
        cancelFun(){
          this.checkFlag=true;
        },
        
        // // 页面元素布局得到页面长度
        domWith(){
           var that = this; 
          var box = $('#wdtcst'),
              boxUlWit = box.width(),
              boxUlLi  = box.find('li').outerWidth(true);
              that.texeSize = parseInt(boxUlWit/boxUlLi);
        },
        // 页面元素布局得到高度
         domHieg(){
             var that = this; 
             var bodyhg = document.body.clientHeight;
             var pluHade= $('.publicTopNavComponent').outerHeight(true);//公共组件高度
             var topHade= $('.conCent').outerHeight(true);//头部高度
             var sortDm =$('.queryListWord').outerHeight(true);//排序高度
             that.heightNub = bodyhg-pluHade-topHade-sortDm+'px';
         },

        //状态请求
        // showStatus(){
        //     var that = this;
        //     var mydata ={
        //         'type':'0023'
        //     }
        //     that.dataliststat=[];
        //     apiClient.get(apiToken.newApi('/pubapi/dictionary/getDictionaryByType/'), mydata).then(data => {
        //         if (appPublicJs.checkData(data["0023"])) {
        //              for(var i = 0; i < data["0023"].length; i++){
        //                 var  obj={
        //                      name :data["0023"][i].DICT_VALUE,
        //                      checkbox:false,
        //                      code:data["0023"][i].DICT_KEY,
        //                      index:data["0023"][i].DICT_KEY
        //                 }
        //                 that.dataliststat.push(obj)
        //              }
        //         }else{

        //         }
        //     }).catch(e => {
        //         console.error(e)
        //     })
        // },



       

        //状态类型请求
        // showType(){
        //     var that = this;
        //     var mydata ={
        //         'type':'0024'
        //     }
        //     that.datalist=[];
        //     apiClient.get(apiToken.newApi('/pubapi/dictionary/getDictionaryByType/'), mydata).then(data => {
        //         if (appPublicJs.checkData(data["0024"])) {
        //             if(data["0024"].length>1){
        //                 that.isShowDuoxuan=true;
        //             }else{
        //                 that.isShowDuoxuan=false;
        //             }
        //             for(var i = 0; i < data["0024"].length; i++){
        //                 var obj={
        //                         name :data["0024"][i].DICT_VALUE,//申请结果
        //                         code :data["0024"][i].DICT_KEY,//1
        //                         checkbox:false,
        //                 }
        //                 that.datalist.push(obj)
        //             }
        //         }else{

        //         }
        //     }).catch(e => {
        //         console.error(e)
        //     })
        // },

    showStatus(){
            var that = this;
            var mydata ={
                'type':'0023'
            }
            that.dataliststat=[];
            apiClient.get(apiToken.newApi('/pubapi/dictionary/getDictionaryByType/'), mydata).then(data => {
                var listArray = data.list;
                if (appPublicJs.checkData(listArray)) {
                     for(var i = 0; i <listArray.length; i++){
                        var  obj={
                             name :listArray[i].DICT_VALUE,
                             checkbox:false,
                             code:listArray[i].DICT_KEY,
                             index:listArray[i].DICT_KEY
                        }
                        that.dataliststat.push(obj)
                     }
                }else{

                }
            }).catch(e => {
                console.error(e)
            })
        },

         showType(){
            var that = this;
            var mydata ={
                'type':'0024'
            }
            that.datalist=[];
            apiClient.get(apiToken.newApi('/pubapi/dictionary/getDictionaryByType/'), mydata).then(data => {
                var listArray = data.list;
                if (appPublicJs.checkData(listArray)) {
                    if(listArray.length>1){
                        that.isShowDuoxuan=true;
                    }else{
                        that.isShowDuoxuan=false;
                    }
                    for(var i = 0; i < listArray.length; i++){
                        var obj={
                                name :listArray[i].DICT_VALUE,//申请结果
                                code :listArray[i].DICT_KEY,//1
                                checkbox:false,
                        }
                        that.datalist.push(obj)
                    }
                }else{

                }
            }).catch(e => {
                console.error(e)
            })
        },

        // 列表
         getList() {
            
            let that = this;
            that.messageArray=[];
            LoadingBoxService.open('加载中...');
            apiClient.get(apiToken.newApi('/notice/message/getMessageList/'), that.myData).then(data => {
                LoadingBoxService.close();
                that.noData=true;
                console.log(data);
                if(appPublicJs.checkData(data.data)) {
                    that.messageArray = data.data;
                }else{
                    that.noData=false;
                    that.pageShow = false;
                    return false;
                }
                that.pageTotal = data.total;
                if(that.pageTotal>1){
                    that.pageShow = true;
                }else{
                     that.pageShow = false;
                }
                //判断如果内容长度小于一页不显示分页
                if( that.myData.pageSize >= data.total){
                    that.noDataPage = false;
                }else{
                    that.noDataPage = true;
                }
                that.messageArray.forEach(element => {
                    that.checkBox.push({"flag":true,"id":element.id});
                });
            }).catch(e => {
                console.error(e)
            })
        },

         //删除批量
        surelFun(){
            let id=""
            this.checkBox.forEach(element => {
                element.flag?id+=element.id+",":""
            });
            this.delMessageById(id.substring(0,id.length-1))
        },

        // 删除
        delMessageById(id){
            var that = this;
            if(id==""){
                TipBoxService.open("请选中要删除的评论",0); 
                return
            }
            var myData  ={
                'id':id,
            }
            let sure=function () {   
                apiClient.delete(apiToken.newApi('/notice/message/deleteMessage/'), myData).then(data => {
                    NoticeBox.close();
                    if(data==true){
                        that.isShow=true;
                        that.isAclass1=true;
                        TipBoxService.open("删除成功",0); 
                        that.checkFlag = true;
                        that.myData.pageNum=1;
                        that.getList();
                        that.checkBox=[]
                    }else{
                        TipBoxService.open("删除失败",2);
                    }
                }).catch(e => {
                    console.error(e)
                })
            }
            NoticeBox.open("是否删除所选内容，删除后将无法撤回！",'',sure) ;   
        },

        toMessageDetails(id){
                var that = this;
				var myData  ={
                    'id':id,
                }
                apiClient.put(apiToken.newApi('/notice/message/updateMessage/'), myData).then(data => {
                    if(data==true){
                        that.getList();
                    }else{

                    }
                }).catch(e => {
                    console.error(e)
                })
        },
    }
    };
</script>
<style src="../../css/message.css" scoped></style>

