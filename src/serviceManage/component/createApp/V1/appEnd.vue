<template>
    <div class="resoubox ">
        <div class="resou-con">
            <div class="w1200 h100">
                <div class="publicNav">
                    <span class="hand" @click="toMain"></span>
                    <span class="active">应用管理</span>
                    <span class="arrows">></span>
                    <span class="active">新建应用</span>
                    <div class="returnBtn publicRedBtn" @click="returnPage()">返回</div>
                </div>
                <div class="mode-div lanm-con">
                    <div class="register">
                        <div class="lanmpege">
                            <div class="lanmp-con">
                                <div class="lanbbag5 ">
                                    <p style="width: 100%"></p>
                                </div>
                                <div class="lanbag-text1">
                                    <span class="tim1">基本信息</span>
                                    <span class="tim2">应用上传</span>
                                    <span class="tim3">资源配置</span>
                                    <span class="tim4">网络资源</span>
                                    <span class="tim5">配置完成</span>
                                </div>
                            </div>
                        </div>
                        <div class="iformcon">
                            <div class="iformcon-con5 step_five">
                                <div class="complete">
                                    <span class="complete_ico"></span>
                                    <span class="complete_main">恭喜您，您的数据配置完成！</span>
                                </div>
                            </div>
                        </div>
                        <!--/biaodan-->
                        <div class="buttnet">
                            <span class="butonstred" @click='confirm'>确定</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</template>
<script>
/*    import LabelView from '../../rc/label/labelView'*/
    import $ from 'jquery'
    export default {
      name: 'appEnd',
      methods:{
        confirm(){
            this.$router.push({name:'appsManager'});
        },
        toMain(){
            this.$router.push({name:'appsManager'})
        },
        returnPage(){
         this.$router.push({name:'appsManager',query:{}})
        }

      }
    }
</script>
<style src="../../css/common/public.css" scoped></style>
<style src="../../css/createApp/appEnd.css" scoped></style>
