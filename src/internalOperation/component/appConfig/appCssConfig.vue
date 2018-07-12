<template>

	<div class="componentConBox" >
            
           
                <!-- css -->
                <div class="cssStyleCon">
                    <div class="topStyle">
                        <div class="icButCon">
                            <button class="clor1" @click="baocun()">确定</button>
                            <button class="clor" @click="resetFrom()">重置</button>
                          
                        </div>
                    </div>
                    <div class="cssCome">
                            <div class="leftStyle wAtuo">
                                <div class="wAtuTop">
                                    <span class="">示例代码</span>    
                                </div>
                                <div class="wAtuoCon">
                                    <textarea class="inputtex daelse" disabled>
                                        {{cssMr}}
                                    </textarea>
                                </div>
                                <div class="wAtuoBtom">
                                    <span class="hovtTdel" @click="downloadStyle">下载演示</span>    
                                </div>
                            </div>
                            <div class="leftRight wAtuo">
                                <div class="wAtuTop">
                                    <span class="">自定义CSS</span>    
                                </div>
                                <div class="wAtuoCon">
                                    <textarea class="inputtex"  v-model="cssMle">{{cssMle}}</textarea>
                                </div>
                                <div class="wAtuoBtom">
                                    <form name="mainForm" enctype="multipart/form-data">
                                        <input type="file" id="uploadFile" class="flieCs"  />
                                    
                                    <span class="hovtTdel hovtoright" v-on:click.capture="flix">上传</span> 
                                       </form>
                                    <p class="fonsTlas">支持.css文件上传,格式规范请参考系统示例,文件最大不超过100KB</p>
                                </div>
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
	import NoticeBoxService from '../../../publicJs/NoticeBoxService.js' //简单提示框
    import appPublicJs from '../../common/public.js'
    import publicPathConfig from '../../../publicJs/publicPathConfig.js';
    import formcss from '../../common/formatcss.js';
	export default {
		name: 'appCssConfigConfig',
		data() {
			return {
                cssMr:'',//栏目的css
                cssMle:'',//自定义css
                num:0
              
			}
        },
        created(){
          
        },
		mounted() {
            this.cssSty();
		},
		components: {
			
        },
        props: {
            childCss: '' ,//这样可以指定传入的类型，如果类型不对，会警告
            childlmid: '' ,//这样可以指定传入的类型，如果类型不对，会警告
            childMoodid:'',
            childHxcss:'',
            openfn:{}
        },
		watch: {
			// childLmid:function(val){
            //  this.cssSty();
            // },
            openfn:function(val){
                console.info('bian',val)
                this.cssSty();
            }
        },
        computed:{

        },
       
		methods: {
            resetFrom(){//重置
                var that = this;
                    that.cssMle = that.cssMr;
            },
            cssSty(){
                var that = this;
                let list=new formcss.formathtmljscss(that.childHxcss.defcss)
                list.formatcss();
                that.cssMr = list.source;
                if(that.childCss.css&&that.childCss.css!=""){
                    let listcs=new formcss.formathtmljscss(that.childCss.css)
                    listcs.formatcss();
                    that.cssMle = listcs.source;
                }
            },
            downloadStyle(){
                // console.info('id',that.childlmid)
                var that =this;
                let url=apiClient.apiBaseUrl
                window.location.href=apiToken.newApi(url + '/ioapi/upload/downloadcss/')+'?columnId='+that.childlmid+apiToken.newApi('&token=');
                   
            },
            baocun(){
                var that =this;
                this.$emit('colcss',that.cssMle);
            },
            flix(){
                var file =uploadFile.files[0];
                var that = this;
                if(file){
                    var filePath=uploadFile.files[0].name;
                    if(!/\.(css)$/.test(filePath)){
                        TipBoxService.open("只能上传css文件",2);
                        return false;
                    }
                    if(file.size>100*1024){
                        TipBoxService.open("css文件已超过100KB",2);
                        return false;
                    }
                    apiClient.upload('ioapi/upload/uploadFile?method=uploadFile',file,function(data){
                        let list=new formcss.formathtmljscss(data.cssdata)
                        list.formatcss();
                         that.cssMle = list.source;
                        if(data.status=="success"||file.value != ''){
                            TipBoxService.open("上传成功！",0);
                        } else {
                            TipBoxService.open("上传失败！",1);
                        }
                    });
                }
            }
		}
	}
</script>

<style  scoped>
/* buton */
button.clor{
    background-color: #26d186;
}
button.clor:hover{
    background-color: #23be78;
}
button.clor1{
    background-color: #55a8fd;
}
button.clor1:hover{
    background-color: #2774c2;
}
button.clor2{
    background-color: #e3e3e3;
}
button.clor2:hover{
    background-color: #cccbcb;
}
.icSetBot{
    position: absolute;
    width: 100%;
    top:0;
}
.icButCon{
    position: absolute;
    right: 0;
    top:0;
}
.flieCs{
   height: 25px;
}
.hovtTdel{
    color: #55a8fd;
    cursor: pointer;
}
.hovtoright{
    position: absolute;
    right: 100px;
    top: 0px;
}
.hovtTdel:hover{
    text-decoration: underline;
}
.icButCon button{
    width: 83px;
    height: 32px;
    text-align: center;
    line-height: 32px;
    font-size: 14px;
    color: #fff;
    transition: all .5s;
    margin: 0 10px;
}
.cssStyleCon{
    height: 100%;
    position: relative;
    padding-top: 60px;
}
.topStyle{
    position: absolute;
    width: 100%;
    top:30px;
}
.incoStop{
    width: 14px;
    height: 44px;
    position: absolute;
    top: 50%;
    left: 0;
    margin-top: -22px;
    background: #000;
    cursor: pointer;
}
.componentmode{
    height: 100%;
   
    box-shadow: 0 0 4px rgba(0, 0, 0, .4);
    
}
.cssStyleCon{
    height: 100%;
    position: relative;
    padding-top: 60px;
}
.topStyle{
    position: absolute;
    width: 100%;
    top:30px;
}
.cssCome{
    height: 100%;
}
.wAtuo{
    width: 48%;
    float: left;
    margin: 0 1%;
    height: 100%;
    padding: 30px 0 50px 0;
    position: relative;
}
.wAtuTop{
    position: absolute;
    width: 100%;
    height: 30px;
    top:0;
    left:0;
    font-size: 14px;
}
.wAtuoBtom{
    position: absolute;
    width: 100%;
    height: 45px;
    bottom:0;
    left:0;
    font-size: 14px;

   
}

.wAtuoCon{
    height: 100%;
}

.inputtex{
    width: 100%;
    height: 100%;
    border: 1px #f1f1f1 solid;
}
.daelse{
    background-color: #fafafa;
}
.fonsTlas{
    font-size: 12px;
    color: #9e9e9e;
}
.boxConConfig{
    padding: 10px;
}

.domeFigureConfigCon img{
   width: 100%;
}
.domeConfig{
    margin-bottom: 10px;
}

.domeSearchConfigCon{
   
}
.dustbin{
    overflow: auto;
    height: 100%;
    padding-right: 5px;
}
</style>