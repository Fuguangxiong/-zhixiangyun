<template>
    <div class="appIndexConfigBoxCon ">
        <div class="appIndexConfigBox ">
            <div class="icSetBot">
                <div class="icTile">
                    <span>自定义模板</span>
                </div> 
            </div>
            <div class="tempCon">
                <div class="modeTemp" v-for="(tmlist,index) in templist" :key="index">
                    <div class="modeTempList" :class="{active:tmlist.use}">
                        <div class="modeStyle mobg">
                            <div class="butCen">
                                <div class="butbg">
                                    <p><button class="lan" v-show="!tmlist.use" @click="save(tmlist.id)">启用</button></p>
                                    <p><button class="lv" @click="preview(tmlist.id)" >预览</button></p>
                                </div>
                            </div>
                            <div class="centetColor" :class="'color'+tmlist.colorStatus">
                          <span  v-show="tmlist.colorStatus==1">典雅白</span>
                          <span  v-show="tmlist.colorStatus==2">深邃黑</span>
                          <span  v-show="tmlist.colorStatus==3">安静蓝</span>
                            </div>
                        </div>
                        <div class="txetUl">
                            <div class="moverHover">
                            <i class="icon iconfont icon-gengduo styHover"></i>
                            <ul>
                                <li @click="save(tmlist.id)">启用</li>
                                <li @click="editDom(tmlist.id)" v-show="!tmlist.use">编辑</li>
                                <!-- <li>主题配置</li> -->
                                <li @click="preview(tmlist.id)">预览</li>
                                <li v-show="!tmlist.use&&tmlist.name!='系统模板1'" @click="daletTemp(tmlist.id)">删除</li>
                                 <li @click="chageSkin(tmlist)">换肤</li>
                            </ul>
                            </div>
                        </div>
                        <div class="talit">
                            <i class="icon iconfont icon-wenhao"></i>
                            <div class="xinxi">
                                <p>{{tmlist.remark|noDataFitler}}</p>
                                <!-- <p>此模板通过卡片式的布局及智能的服务推荐算法，针对你不同的用户喜好来定义栏目分类，并提供美观大方的主题风格呈现给广大用户。</p> -->
                            </div>
                        </div>
                        <p class="listName">{{tmlist.name}}</p>
                    </div>
                </div>
                    <div class="modeTemp">
                        <div class="modeTempList" >
                        <div class="modeStyle ">
                            <div class="addTemp" @click="addTemp">
                                <p><i class="icon iconfont icon-plus"></i></p>
                                <p>自定义配置</p>
                            </div>
                        </div>
                       
                    </div>
                    </div>
            </div>
	</div>
    <div class="popupBg" v-show="pophide">
        <div class="popupCon">
            <div class="modetato">自定义模版</div>
            <el-form :model="formInline" :rules="rules" ref="formInline" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="标题：" prop="name">
                        <el-input v-model.trim="formInline.name" placeholder="最多输入8个字"></el-input>
                    </el-form-item>
                    <el-form-item label="模版选择：" prop="region">
                        <el-select v-model="formInline.region" placeholder="模版选择">
                        <el-option v-for="fromtmlist in templist" :label="fromtmlist.name"  :value="fromtmlist.id" :key="fromtmlist.id"></el-option>
                        </el-select>
                    </el-form-item>
                     <el-form-item label="备注：" >
                        <el-input type="textarea" v-model.trim="formInline.desc" :maxlength="50"></el-input>
                         <span class="textareaNum">{{formInline.desc.length}}/50</span>
                    </el-form-item>
                   
            </el-form>
          
            <div class="timeBut">
                    <button class="determine" @click="onSubmit('formInline')">确定</button>
                    <button class="escDete" @click="resetForm('formInline')">取消</button>
                </div>
            </div>  
    </div>

      <!-- 换肤弹框 -->
       <div class="overlay" v-show="mackBg">
            <div class="chageSkin">
                <div class="chageSkinTitle">
                    <span class="titleText">配置样式</span>
                    <i class="ico iconfont icon-guanbi"  @click="closeBtn"></i>
                </div>
                <div class="chageSkinCenter">
                      <div class="skincolor"  v-for="(item,index) in colorlist">
                          <div class="detalutcolor" @click="changeshincolor(item.code,index)"  :class="{whitecolor:item.code==1, bluecolor:item.code==3,blackcolor:item.code==2}">
                                 <span  class="nochose" ></span>
                                 <span  v-show="item.code==1&&skindefaultcolor==1||item.code==2&&skindefaultcolor==2||item.code==3&&skindefaultcolor==3" class="chose"></span> 
                          </div>
                          <span class="colorTitle">{{item.name}}</span>
                      </div>
                </div>
                <div class="chageSkinBtn">
                    <button class="confirmBtn" @click="submitchageSkin">确认</button>
                    <button @click="closeBtn">取消</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
	import LabelView from '../../../publicComponent/labelView.vue'
	import apiToken from '../../../publicJs/apiToken.js'
	import apiClient from '../../../publicJs/ApiClient.js'
	import TipBoxService from '../../../publicJs/TipBoxService.js'
    import LoadingBoxService from '../../../publicJs/LoadingBoxService.js'
    import publicPathConfig from '../../../publicJs/publicPathConfig.js'
    import NoticeBox from "../../../publicJs/NoticeBoxService.js";
	import appPublicJs from '../../common/public.js'
    import draggable from 'vuedraggable'
    import appbannerimgConfig from '../componentConfig/appbannerimgConfig.vue'

	export default {
        name: 'appTemplateConfig',//模版
       
		data() {
			return {
                rules: {
                    name: [
                        { required: true, message: '请输入标题', trigger: 'blur' },
                        { min: 1, max: 8, message: '长度在 1 到 8 个字符', trigger: 'blur' },
                        { validator:this.nameN, trigger:'blur'}
                    ],
                     region: [
                        { required: true, message: '请选择模版', trigger: 'change' }
                    ],
                },
                formInline: {
                    name: '',
                    region: '',
                    desc:''
                },
                templist:{},
                 pophide:false,//弹出层
                 modeId:'',//模版id
                 nameTrr:true,
                 mackBg:false,//换肤弹框
                 checkColor:false,//选中样式
                 colorlist:[],//换肤颜色列表
                 skindefaultcolor:"",//默认皮肤
                 templistid:"",
                 tokenId:""
			}
        },
        filters:{
            noDataFitler:function(val){
                if(val==undefined||val==""){
                    return "暂无备注"
                }else{
                    return val
                }
            }
        },
		mounted(){
            this.list();
            this.getSkinColor();
		},
		watch: {
		},
        components:{
          
        },
		methods: {
            //从cookie中获取信息
            getInfo: function (name) {
                var v = window.document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)')
                return v ? v[2] : null
            },
            //启动
            save(id){
                debugger;
                var that =this;
                this.tokenId = this.getInfo("tokenId");
                //判断tokenid是否过期
                if (appPublicJs.checkLogin(this.tokenId)) {
                    var myData={
                        id:id
                    };
                    LoadingBoxService.open('加载中...');
                    apiClient.post(apiToken.newApi('ioapi/template/saveEnterpriseTemplate/'),myData, function(data) {
                        LoadingBoxService.close();
                            that.list();
                        })
                
                }else{
                   that.$router.push({name:'internalLogin'}); 
                }
               
            },
            // 编辑模版
            editDom(id){
                 this.$router.push({name:'appIndexConfig',query:{temId:id}}); 
            },
            //删除模版
            daletTemp(id){
               var that =this;
                    var myData={
                        id:id,
                    };
                var sure=function(){ 
                    LoadingBoxService.open('加载中...');
                    apiClient.delete(apiToken.newApi('ioapi/template/deleteTemplateById/'),myData, function(data) {
                        console.info('list==',data);
                        LoadingBoxService.close();
                        NoticeBox.close();
                        that.list();
                    })
                 }
                NoticeBox.open('确定删除模版？',sure)
            },
            //预览
            preview(id){
                window.open(publicPathConfig.APP_MARKET+"#/?template="+id+"");   
            },
            addTemp(){
                this.pophide=true;
            },
            nameN(rule, value, callback){
                var that = this;
                    var myData={
                        name:value,
                    }
                    if (!value) {
                        return false;
                    }else{
                        apiClient.get(apiToken.newApi('ioapi/template/getTemplateByName/'),myData, function(data) {
                            console.info(data);
                            if(!data.results){
                                callback();
                                that.nameTrr = true;
                            }else{
                                callback(new Error('名字重复'));
                                that.nameTrr = false;
                            }
                        })
                    }
            },
            //确定
            onSubmit(formName) {
                var that = this;
                this.$refs[formName].validate((valid) => {
                if (valid) {
                    var myData={
                                id:this.formInline.region,
                                name:this.formInline.name,
                                type:'0',
                                remark:this.formInline.desc,
                                sort_order:this.templist.length+1
                            };
                            LoadingBoxService.open('加载中...');
                            
                            apiClient.get(apiToken.newApi('ioapi/template/copyTemplateEs/'),myData, function(data) {
                                console.info('list==',data.results.id) ;
                                LoadingBoxService.close();
                                that.$router.push({name:'appIndexConfig',query:{temId:data.results.id}}); 
                                
                            })
                } else {
                 
                    return false;
                }
                });
      
               
            },
             resetForm(formName) {
                var that = this;
                that.$refs[formName].resetFields();
                that.pophide=false;
            },
           list(){
               var that = this;
               LoadingBoxService.open('加载中...');
                apiClient.get(apiToken.newApi('ioapi/template/getTemplateList/'),'', function(data) {
                    LoadingBoxService.close();
                    that.templist = data.results.systemTemplateList;
                    console.log(that.templist,22)
                })
          },
         // 点击弹窗关闭按钮-关闭弹窗
         closeBtn () {
            this.mackBg = false
         },
        //  点击换肤按钮显示弹框
         chageSkin(tmlist){
            this.templistid=tmlist.id;
            this.skindefaultcolor=tmlist.colorStatus;
            this.mackBg = true
         },
        //  加载换肤颜色列表
         getSkinColor(){
               var that = this;
                apiClient.get(apiToken.newApi('ioapi/template/getTemplateColorStatus/'),'', function(data) {
                    that.colorlist = data.results;
                })
         },
         changeshincolor(id,index){
                if(id==1){
                    this.skindefaultcolor=1;                  
                }else if(id==2){
                   this.skindefaultcolor=2;
                }else{
                    this.skindefaultcolor=3;
                }
         },
         submitchageSkin(){
                var that = this;
                var myData={
                    id:that.templistid,
                    colorStatus:that.skindefaultcolor
                };
                LoadingBoxService.open('保存中...');
                 apiClient.put(apiToken.newApi('ioapi/template/updateTemplateColor/'),myData, function(data) {
                    LoadingBoxService.close();
                    that.mackBg = false;
                    that.list();
                })
                
            },
		}

	}
</script>

<style src='../../css/appTemplateConfig.css' scoped>
</style>
<style>
.popupBg .el-form-item__label{
   width: 100px;
   text-align: right;
   font-weight: normal;
}
.popupBg .el-form-item__label{
    margin-bottom: 0;
}
.popupBg .el-textarea__inner{
    width:250px;
    height: 135px;
}
.popupBg .el-select{
    width:250px;
}
.popupBg .el-input__inner{
    width:250px;
    height: 30px;
}
.popupBg .demo-ruleForm{
    padding-left:35px;
}
.chageSkin{
    position: absolute;
    width: 506px;
    height: auto;
    top: 50%;
    left: 50%;
    margin-top: -260px;
    margin-left: -253px;
    background: #ffffff;
    z-index:1901;
    border-radius: 4px;
}
.chageSkinTitle{
    width: 100%;
    height: 40px;
    background: #6aa8f6;
    border-radius: 4px 4px 0 0;
    line-height: 40px;
}
.chageSkinTitle i{
    float: right;
    font-size: 20px;
    color: #ffffff;
    margin-right: 10px;
    cursor: pointer;
}
.chageSkinCenter{
    box-sizing: border-box;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    width: 100%;
    height: 280px;
    padding:15px 20px;
}
.chageSkinBtn{
    width:100%;
    text-align: center;
    background: #e3e3e3;
    border-radius: 0 0 4px 4px;
}
.chageSkinBtn button{
    width: 49.5%;
    border: none;
    line-height: 40px;
    font-size: 14px;
    cursor: pointer;
}
.chageSkinBtn .confirmBtn{
    background: #6aa8f6;
    color: #ffffff;
    border-radius: 0 0 0 4px;
}
.titleText{
    display: inline-block;
    width: auto;
    height: 40px;
    line-height: 40px;
    padding-left: 10px;
    font-size: 14px;
    color: #ffffff;
}
.skincolor{
     width: 85px;
     height: 85px;
     float: left;
     margin-left: 25px;
     margin-top: 5px;
     border-radius: 5px;
     padding:5px;
     border: 1px #fff solid;
}
.skincolor:hover {
    cursor: pointer;
    border: 1px #e3e3e3 dashed;
}
.icon-weixuanzhong{
   font-size:0px;
}
.checkSkinColor{ 
   border: 1px #e3e3e3 dashed;
}
.whitecolor{
  border: 1px #6aa8f6 solid;
}
.whitecolor::after{
  border: 1px #6aa8f6 solid;
}
.bluecolor{
  background: #00aaf2;
}
.blackcolor{
  background: #363a46;
}
.detalutcolor{
     width: 72px;
     height: 72px;
     border-radius: 5px;
     position: relative;
}
.detalutcolor:hover .nochose{
    position: absolute;
    display: inline-block;
    background: url('../../images/weixuanzhong.png') center no-repeat;
    width: 16px;
    height: 16px;
    margin-top: 60px;
    margin-left: 60px;
}
.chose{
    position: absolute;
    z-index: 2000;
    display: inline-block;
    background: url('../../images/xuanzhong.png') center no-repeat;
    width: 16px;
    height: 16px;
    margin-top: 60px;
    margin-left: 60px;
}
.skincoloractive::after {
    content: '';
    position: absolute;
    background: url('../../images/xuanzhong.png') no-repeat;
    width: 43px;
    height: 43px;
    right: 0;
    top: 0;
}
.colorTitle{
    position: absolute;
    margin-top: 10px;
    font-size: 14px;
    margin-left: 15px;
    color: #333333;
}
.popupBg .textareaNum{
    position: absolute;
    right: 79px;
    bottom: -10px;
    font-size: 12px;
    color: #999999;
}
</style>