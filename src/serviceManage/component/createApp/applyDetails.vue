<template>
    <div class="publicContent">
        <div>
            <div class="inpfrom">
                <h2 class="tilesc"><span>《</span><span class="tilescSpan" :title="formData.service_name">{{formData.service_name}}</span><span>》</span><span>应用创建申请</span></h2>
                <div class="divtime">
                    <div class="tile">
                        <span class="titleInfo">
                            <i class="icon iconfont icon-tianxieshenqingrenxinxi"></i>
                            <em>申请人信息</em>
                        </span>
                    </div>
                    <div class="wid">
                        <ul class="divtimeUl">
                            <li>
                                <div class="divtimeUlDiv"><span class="text">申请人：</span><span>{{formData.Applicant}}</span></div>
                                <div class="divtimeUlDiv1"><span class="text">用户名：</span><span>{{formData.userName}}</span></div>
                            </li>
                            <li>
                                <div class="divtimeUlDiv"><span class="text">单位：</span><span>{{formData.enterprisename}}</span></div>
                                <div class="divtimeUlDiv1"><span class="text">手机号码：</span><span>{{formData.tel}}</span></div>
                            </li>
                            <li>
                                <div class="divtimeUlDiv"><span class="text">邮箱：</span><span>{{formData.email}}</span></div>
                                <div class="divtimeUlDiv1"><span class="text">申请时间：</span><span>{{create_time}}</span></div>
                            </li>
                        </ul>                         
                    </div>
                </div>
                <!--基础信息-->
                <div class="divtime">
                    <div class="tile">
                        <span class="titleInfo">
                            <i class="icon iconfont icon-iconset0335"></i>
                            <em>基础信息</em>
                        </span>
                    </div>
                    <div class="wid">
                        <ul class="basicInformationUl">
                            <li><span>应用名称：</span><span class="basicInformationSpan" :title="formData.service_name">{{formData.service_name}}</span></li>
                            <!-- <li><span>服务期限：</span><span class="date">2017.10.10</span>至<span class="date1">2018.01.01</span></li> -->
                            <!-- <li><span>归属企业：</span><span>{{formData.apptype}}</span></li> -->
                            <li><span>版本号：</span><span>{{formData.version_num}}</span></li>
                            <li class="basicLabeLi"><div class="basicLabe">应用标签：</div><div class="basicLabel"><span v-for="(tag,index) in formData.service_tag" :key="index" style="margin-right:10px;" :title="tag">{{tag}}</span></div></li>
                            <li class="appRemarkLi"><div>应用介绍：</div><div>{{formData.service_remark}}</div></li>
                        </ul>         
                    </div>
                </div>
                <!-- 应用上传 -->
                <div class="divtime">
                    <div class="tile">
                        <span class="titleInfo">
                            <i class="icon iconfont icon-guishu"></i>
                            <em>应用上传</em>
                        </span>
                    </div>
                    <div class="con-cont1 wid">
                        <div class="appUpload">
                            <span class="text">应用文件：</span>
                            <span>{{formData.service_file?formData.service_file + "("+formData.service_size+"MB)":"无文件"}}</span>                        
                        </div>
                    </div>
                </div>
                <!-- 审批流转信息 -->
                <div class="divtime" v-show="isShow">
                    <div class="tile">
                        <span class="titleInfo">
                            <i class="icon iconfont icon-shenpi1"></i>
                            <em>审批流转信息</em>
                        </span>
                    </div>
                    <div class="con-cont wid">
                        <div class="boxBody" id="boxBody">
                            <table border="0">
                                <tr class="title">
                                    <th>序号</th>
                                    <th>审批批次</th>
                                    <th>审批阶段</th>
                                    <th>审核人</th>
                                    <th>处理时间</th>
                                    <th>审核意见</th>
                                </tr>
                                <tr class="one" v-for="(item,index) in applyInfo" :key="index">
                                    <td>{{index+1}}</td>
                                    <td>第{{item.audit_batch_num}}次</td>
                                    <td>
                                        <span v-show="item.audit_phase == 1">企业审批</span>
                                        <span v-show="item.audit_phase == 2">平台审批</span>
                                        <span v-show="item.audit_phase == 3 && item.audit_status == 3">成功</span>
                                        <span v-show="item.audit_phase == 3 && item.audit_status == 2">打回</span>
                                    </td>
                                    <td>{{item.auditUserName}}</td>
                                    <td>{{item.audit_time}}</td>
                                    <td style="width:250px">
                                        <span class="approvalStatus" v-if="item.audit_status == 1">创建；</span>
                                        <span class="approvalStatus" v-if="item.audit_status == 2">不通过；</span>
                                        <span class="approvalStatus" v-if="item.audit_status == 3">通过；</span>
                                        <span class="approvalStatus" v-if="item.audit_status == 0">撤销；</span>
                                        <span :title="item.audit_remark" class="audit_remark">{{item.audit_remark}}</span>
                                    </td>
                                </tr>
                            </table>
                        </div>
                    </div>
                </div>
                <!-- 审批操作 -->
                <div class="divtime" v-show="isShow1">
                    <div class="tile">
                        <span class="titleInfo">
                            <i class="icon iconfont icon-shenpi2"></i>
                            <em>审批操作</em>
                        </span>
                    </div>
                    <div class="con-cont wid">
                        <div class="boxBody" id="boxBody1">
                            <div class="exAndApproval">
                                <span class="firstSpan text">审批</span>
                                <span @click="pass()" :class="{selected:isshow}" class="rs">通过</span>
                                <span @click="noPass()" class="rs" :class="{selected:!isshow}">不通过</span>
                                <br>
                                <div class="remarks">
                                    <span v-show="!isshow" class="xing">*</span>
                                    <span class="text">备注</span>
                                    <textarea name="desc" maxlength="50" style="resize:none;vertical-align:text-top;" @input="descInput" v-model="desc" id="" cols="60" rows="3"></textarea>
                                    <br>
                                    <span style="margin-right: 20px;float:right">您还可以输入<span style="color:red">{{remnant}}</span>个字</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div> 
        <!-- 底部 -->
        <div class="apply-actions">
            <div>
                <b>服务需求单：</b>
                <span>分为应用服务、远程服务，用户可将原有应用系统上传到平台或提供远程访问地址，平台提供从中拆分成单一服务的能力。且拆分出的服务具有标准的数据对接接口，可单独调用或扩展应用于其他系统的最小服务单元，这种最小服务单元统称为原子服务。</span>
            </div>
            <button class="apply-btn" @click="back()">返回</button>
            <button v-show="isShow1" class="apply-btn submit" @click='submitApply'>提交审核</button>
        </div>
    </div>
</template>
<script>
  import apiClient from '../../../publicJs/ApiClient.js';
  import TipBoxService from "../common/TipBoxService.js";
  import LoadingBoxService from '../../../publicJs/LoadingBoxService.js'
    export default{
        name: 'applyDetails',
        data(){
            return{ 
                url: {
                    getAllData: "itsmApi/application/loadApp", //获取申请详情信息
                },
                formData:{
                    id:"",
                    title:"",//标题
                    Applicant:'',//申请人
                    userName:'',//用户名
                    enterprisename:'',//单位
                    tel:'',//手机号码
                    email:'',//邮箱
                    apply_time:'',//申请时间
                    service_name:'',//应用名称
                    service_period:'',//服务期限
                    startTime:'',//开始时间
                    endTime:'',//结束时间
                    apptype:'',//归属企业
                    version_num:'',//版本号
                    service_tag:[],//应用标签
                    service_remark:'',//应用介绍
                    service_file:'',//应用文件
                    service_size:'',//应用文件大小
                    approval_workflow:0,
                    change_id:'',//变更服务id,
                    belongType:'',
                    userId:'',
                    enterprise_id:'',
                    approval_batchNo:'',
                    physical:''
                },
                approvalData:{

                },
                desc:'',
                isShow1:false,
                isShow: false,
                isshow: true,
                remnant:'50',
                create_time:'',
                auditParam:{
                    reviewnotes:"",//不通过原因
                    reviewstatus:3,//审批状态
                    audit_type:"2"//审批类型
                },
                login_type:'',
                USERID:'',
                applyInfo:[]
            }
        },
        created(){
            this.formData.id=this.$route.query.id;
        },  
        mounted(){
            this.getFormData(); 
            let that = this;
            $(".apply-actions").css({ width: that.getControllerWidth() + "px" });
            if (window.iscEvent) {
                window.iscEvent.on("menuchange", function () {
                    let targetW = that.getControllerWidth();
                    $(".apply-actions").animate({ width: targetW + "px" }, 500);
                });
            }
        }, 
        methods:{
            getControllerWidth() {
                let targetW = 0;
                if ($('body').hasClass('bigSreen') && !$('body').hasClass('bigSreen2')) {
                    targetW = $(window).width() - 58;
                } else {
                    targetW = $(window).width() - 208;
                }
                return targetW;
            },
            // 返回
            back(){
                this.$router.back(-1)
            },
            // 通过
            pass() {
                this.isshow = true;
                this.auditParam.reviewstatus = 3;
            },
            // 未通过
            noPass() {
                this.isshow = false;
                this.auditParam.reviewstatus = 2;
            },
            //不通过原因
            descInput() {
                var txtVal = this.desc.length;
                this.remnant = 50 - txtVal;
            },
            getUserInfo() {
                var that = this;
                apiClient.get("/pubapi/token/getUserByToken", {}, function(data) {
                    if (data.status == 200) {
                        console.log('用户信息', data.results.userInfo)// 平台PLATFORM;个人PERSONAL;企业ENTERPRISE 二级审批
                        that.login_type = data.results.userInfo.LOGIN_TYPE;
                        that.USERID = data.results.userInfo.ID
                        if(that.formData.userId == that.USERID && that.login_type == "PERSONAL"){
                            that.isShow1 = false;
                            that.isShow = true;
                        }else{
                            if(that.applyInfo[that.applyInfo.length-1].audit_phase == 3){
                                that.isShow1 = false;
                                that.isShow = true;
                            }
                            if(that.applyInfo[that.applyInfo.length-1].audit_phase == 2 && that.applyInfo[that.applyInfo.length-1].audit_status == 3 && that.login_type == "PLATFORM"){
                                that.isShow1 = true;
                                that.isShow = true;
                            }
                            if(that.applyInfo[that.applyInfo.length-1].audit_phase == 2 && that.applyInfo[that.applyInfo.length-1].audit_status == 2 && that.login_type == "PLATFORM"){
                                that.isShow1 = false;
                                that.isShow = true;
                            }
                            if(that.applyInfo[that.applyInfo.length-1].audit_phase == 2 && that.login_type == "ENTERPRISE"){
                                that.isShow1 = false;
                                that.isShow = true;
                            }
                            if(that.applyInfo[that.applyInfo.length-1].audit_phase == 1 && that.login_type == "ENTERPRISE"){
                                that.isShow1 = true;
                                that.isShow = true;
                            }
                            if(that.applyInfo[that.applyInfo.length-1].audit_phase == 1 && that.login_type == "PLATFORM"){
                                that.isShow1 = false;
                                that.isShow = true;
                            }
                            if(that.applyInfo[that.applyInfo.length-1].audit_phase == 2 && that.login_type == "PLATFORM"){
                                that.isShow1 = true;
                                that.isShow = true;
                            }
                        }
                        for(var i = 0 ; i < that.applyInfo.length ; i ++){
                            if(that.applyInfo[i].audit_time != undefined){
                                that.applyInfo[i].audit_time = that.format(that.applyInfo[i].audit_time,"yyyy-MM-dd HH:mm:ss");
                            }
                        }
                    } else {
                        TipBoxService.open(data.exception, 2);
                    }
                });
            },
            //获取数据
            getFormData() {
                LoadingBoxService.open('正在查询，请稍候...')
                var that = this;
                apiClient.post(that.url.getAllData, { app_id: this.formData.id }, function(data) {
                    LoadingBoxService.close();
                    if (data.status === 200) {
                        var dataList = data.results.data;
                        var List = data;
                        console.log("数据",List);
                        that.formData.Applicant=dataList.applicant;//申请人
                        that.formData.userName=dataList.loginname;//用户名
                        that.formData.enterprisename=dataList.department_name;//单位
                        that.formData.tel=dataList.phone;//手机号码
                        that.formData.email=dataList.email;//邮箱
                        that.formData.apply_time=dataList.create_time;//申请时间
                        that.formData.service_name=dataList.app_name;//应用名称
                        // that.formData.service_period = dataList.app_remark;//服务期限
                        // that.formData.apptype=dataList.app_remark;//归属企业
                        that.formData.version_num = dataList.app_version;//版本号
                        // that.formData.service_tag = dataList.app_tag;//应用标签
                        that.formData.service_remark = dataList.app_remark;//应用介绍
                        that.formData.service_file = dataList.archiver_real_name;//应用文件
                        that.formData.service_size = dataList.archiver_size;//应用文件大小
                        that.create_time = that.format(parseInt(dataList.create_time), 'yyyy-MM-dd HH:mm:ss');
                        that.formData.enterprise_id = dataList.enterprise_id;//企业id
                        that.formData.belongType = dataList.belong_type;
                        that.formData.userId = dataList.user_id;
                        let portP = JSON.parse(dataList.port);
                        that.formData.physical = portP[0].physical_port
                        // that.formData.service_tag = dataList.app_tag.split(',');
                        if (dataList.app_tag != undefined) {
                            let service_tag_tmp = dataList.app_tag;
                            if (typeof service_tag_tmp === 'string') {
                                that.formData.service_tag = JSON.parse(service_tag_tmp)
                            } else {
                                that.formData.service_tag = dataList.app_tag;
                            }
                        }
                    }else{
                        TipBoxService.open(data.exception, 2)
                    }
                    that.getApprovalInfo()
                    that.getUserInfo()
                });
            },
            // 提交审核
            submitApply(){
                var myData = {};
                var that = this;
                if(that.auditParam.reviewstatus=="2" && (that.desc=="" || that.desc == undefined)){//不通过时。校验备注信息
                    TipBoxService.open("备注信息不能为空!", 2);
                    return;
                }
                that.auditParam.reviewnotes = that.desc
                myData = {
                    id:that.formData.id,
                    audit_status:that.auditParam.reviewstatus,
                    auditReason:that.auditParam.reviewnotes,
                    physical_port:this.formData.physical
                }
                LoadingBoxService.open("正在处理....")
                apiClient.post("itsmApi/application/auditApp", myData, function(data) {
                    LoadingBoxService.close();
                    var Data = data;
                    console.log("2222",Data);
                    if(data.status == 200){
                        TipBoxService.open("审批成功");
                        that.getApprovalInfo();
                        that.back ();
                    }else{
                        TipBoxService.open(data.exception,2)
                    }
                });
            },
            getApprovalInfo(){
                var myData = {
                    belongType:this.formData.belongType, 
                    appSubjectIdl : this.formData.id,
                    approvalType:"1",
                    enterpriseId:this.formData.enterprise_id,
                    applyUserId:this.formData.userId,
                    batchNo:this.formData.approval_batchNo
                };
                var that = this;
                apiClient.post("itsmApi/process/loadAuditFlowInfo", myData, function(data) {
                    if(data.status == 200){
                        var Data = data;
                        that.applyInfo = [...data.results.data];
                        console.log('审批数据',Data);
                        for(var i = 0 ; i < that.applyInfo.length ; i ++){
                            that.getUserInfo();
                        }
                    }
                });
             },
             format (time, format) {
                var t = new Date(time)
                var tf = function (i) { return (i < 10 ? '0' : '') + i }
                return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function (a) {
                switch (a) {
                case 'yyyy':
                    return tf(t.getFullYear())
                    break
                case 'MM':
                    return tf(t.getMonth() + 1)
                    break
                case 'mm':
                    return tf(t.getMinutes())
                    break
                case 'dd':
                    return tf(t.getDate())
                    break
                case 'HH':
                    return tf(t.getHours())
                    break
                case 'ss':
                    return tf(t.getSeconds())
                    break
                }
                })
            }
        } 
    }
</script>
<style src="../../css/createApp/applyDetails.css" scoped></style>
