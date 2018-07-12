<template>
    <div class="visibilitySet">
        <el-dialog :title="title" @close='onCancle' :visible.sync="show" :close-on-click-modal="false" width='90%'>
            <div class="searchDiv">
                <i class="icon iconfont icon-sousuo11" @click="remoteMethod(inputValue)"></i>
                <el-input placeholder="请输入搜索内容" v-model="inputValue" :disabled="visibleSelect" @change="inputBlur" @focus="inputBlur"
                class="input-with-select" suffix-icon="" @keyup.enter.native="remoteMethod(inputValue)" id="sousuo">
                     <el-select v-model="selectType" slot="prepend" placeholder="" :disabled="visibleSelect">
                        <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select> 
                </el-input>
                <el-checkbox v-model="checkAll" @change="checkAllBox()">选择全部</el-checkbox>
            </div>
            <div class="search_count">
                <span class="count" ref="countStyle">已选择<em>{{personalList.length+enterpriseList.length}}</em>个</span>
            </div>
            <div id="labels-autocomplete-list" class="aui-dd-parent resize-to-input" v-show="isShowSearched">
                <!-- 搜索下拉内容 -->
                <div class="aui-dropdown aui-dropdown-left"  @mouseout="selectOut" @mouseover="selectOver" v-show="selectflag">
                    <el-checkbox-group v-model="personalList" v-show="selectType == 1">
                        <ol class="last">
                            <li v-for="(label,index) in labelList" :key="index">                  
                                <a href="javaScript:void(0)" class="label-suggestion">
                                    <span v-if="label.isChecked == true" class="yesSetConent">
                                        <el-checkbox :disabled="label.isChecked" :label="label" value="label.ID">
                                            <i class="icon iconfont icon-yonghu3"></i>
                                            <em>{{label.PHONE}}(<label style="color:red">{{label.USERNAME}}</label>)</em>
                                            <em class="searchVisiStyles" v-if="visibilityType === '2' && loginUser == label.ID"></em>
                                            <em class="searchVisiStyles2" v-else>已设为可见</em>
                                        </el-checkbox>
                                    </span>
                                    <span v-else class="noSetConent">
                                        <el-checkbox :disabled="label.isChecked" :label="label" value="label.ID">
                                            <i class="icon iconfont icon-yonghu3"></i>
                                            <em>{{label.PHONE}}(<label style="color:red">{{label.USERNAME}}</label>)</em>
                                        </el-checkbox>
                                    </span>
                                </a>
                            </li>
                        </ol>
                    </el-checkbox-group>
                    <el-checkbox-group v-model="enterpriseList" v-show="selectType == 2">
                        <ol class="last">
                            <li v-for="(label,index) in labelList" :key="index">                      
                                <a href="javaScript:void(0)" class="label-suggestion">
                                    <span v-if="label.isChecked == true" class="yesSetConent">
                                        <el-checkbox :disabled="label.isChecked" :label="label" value="label.ID">
                                            <i class="icon iconfont icon-gongsi2"></i>
                                            <em style="color:red">{{label.NAME}}</em>
                                            <em class="searchVisiStyles" v-if="visibilityType === '2' && loginEnterprise == label.ID"></em>
                                            <em class="searchVisiStyles2" v-else>已设为可见</em>
                                        </el-checkbox>
                                    </span>
                                    <span v-else class="noSetConent">
                                        <el-checkbox :disabled="label.isChecked" :label="label" value="label.ID">
                                            <i class="icon iconfont icon-gongsi2"></i>
                                            <em>{{label.NAME}}</em>
                                        </el-checkbox>
                                    </span>
                                </a>
                            </li>
                        </ol>
                    </el-checkbox-group>
                </div>
            </div>
            <!-- 选中的内容 -->
            <div class="search_content" v-if="!checkAll">
                <div v-if="personalList.length > 0">
                    <i class="icon iconfont icon-yonghu3"></i>用户
                    <ul>
                        <li v-for="(user,index) in personalList" :key="index" @click="chooseDom(user.ID,personalList)" >
                            <el-popover
                                placement="top-start"
                                trigger="hover"
                                :content='user.PHONE+"("+user.USERNAME+")"'>
                            <div slot="reference">
                                <i class="icon iconfont icon-yonghu3"></i><em>{{user.PHONE}}({{user.USERNAME}})</em>
                                <i v-show="user.ischoose" @click="dataDel(user.ID,'personal')" class="icon iconfont icon-delete-black delbtn"></i>
                            </div>
                            </el-popover>
                        </li>
                    </ul>
                </div> 
                <div v-if="enterpriseList.length > 0">
                    <i class="icon iconfont icon-gongsi2"></i>企业
                    <ul>
                        <li v-for="(enterprise,index) in enterpriseList" :key="index" @click="chooseDom(enterprise.ID,enterpriseList)" >
                            <el-popover
                                placement="top-start"
                                trigger="hover"
                                :content='enterprise.NAME'>
                            <div slot="reference">
                                <i class="icon iconfont icon-gongsi2"></i><em>{{enterprise.NAME}}</em>
                                <i v-show="enterprise.ischoose" @click="dataDel(enterprise.ID,'enterprise')" class="icon iconfont icon-delete-black delbtn"></i>
                            </div>
                            </el-popover>
                        </li>
                    </ul>
                </div>
                 
            </div>
            <div class="search_content" v-if="checkAll">
                <div class="content_all" v-if="visibilityType =='1'">全部企业、个人用户均可见</div>
                <div class="content_all" v-if="visibilityType =='2'">全部企业、个人用户均屏蔽</div>
            </div>
            
            <div slot="footer" class="dialog-footer" :class='{hsaHover:setStyleHover}'>
                <el-button @click="addVisibilityToDB" type="primary">确 认</el-button>
                <el-button @click="onCancle" @mouseenter.native='setStyle(true)' @mouseleave.native='setStyle(false)'>取 消</el-button>
            </div>
        </el-dialog>  
    </div>
</template>
<script>
import apiClient from '@/publicJs/ApiClient.js'
import TipBoxService from "../common/TipBoxService.js";
import _ from 'lodash'
export default {
    props: {
        isShow: {},
        vueObj: {},
        visibilityType: {},
        visibilitySetCatagory: {},
        title:{}
    },
    data: function() {
      return {
        setStyleHover:false,
        serviceObj: {},
        visibilitDialog:true,
        visibleSelect:false,
        visibilityLevel:"",
        selectType: '',
        inputValue:'',
        isShowSearched: false,
        dialogVisible: false,
        labelList: [],
        checked:false,
        checkList:[],
        personalList:[],
        enterpriseList:[],
        checkAll:false,
        show:false,
        options: [
            {
                value: '1',
                label: '用户'
            }, 
            {
                value: '2',
                label: '企业'
            }
        ],
        selectflag:true,
        loginUser:'',//登陆人
        loginEnterprise:'',//登陆企业
        visibilityUserOrEnterprise:[]//可见设置中的用户或者企业
      }
    },
    watch: {
        //是否禁用下拉框
        'selectType'(value){
            if(value == 0){
                this.visibleSelect = true;
            }else{
                this.visibleSelect = false;
                this.labelList = [];
                this.isShowSearched = false
            }
        },
        dialogTagVisible (value) {
            if (value === true) {
                this.currentLabels = this.getLabelByModel().slice(0)
            }
            this.dialogVisible = value
        },
        inputValue (value) {
            //输入文字就立即搜索
            // if (value === '') {
            //     this.isShowSearched = false
            //     return
            // }
            // if (!this.selectItem) {
            //     this.remoteMethod(value)
            // } else {
            //     this.selectItem = false
            // }
            //将历史搜索清空
            if(value === ''){
                this.labelList = [];
                this.isShowSearched = false
            }
        },
        isShow: function(nv, ov) {
            let vm = this;
            if (nv) {
                this.show = nv;
                vm.serviceObj = Object.assign({}, vm.vueObj);
                vm.personalList = [];
                vm.enterpriseList = [];
                vm.getUsers();
            }
        }
    },
    mounted() {
    //   this.getUsers();
    },
    methods: {
        setStyle(status){
            this.setStyleHover = status;
            console.log(status)
        },
        //选择单个元素
        chooseDom(e,list){
            for(var j = 0 ; j < list.length ; j ++){
                if(list[j].ID == e){
                    if(list[j].ischoose){
                        for(var i = 0 ; i < list.length ; i ++){
                            list[i].ischoose = false;
                        }
                    }else{
                        for(var i = 0 ; i < list.length ; i ++){
                            list[i].ischoose = false;
                        }
                        list[j].ischoose = true;
                    }
                    break;
                }
                
            }
        },
        leave(e,list){
            for(var i = 0 ; i < list.length ; i ++){
                list[i].ischoose = false;
            }
        },
        //选中全部事件
        checkAllBox(){
            if(this.checkAll){
                this.$refs.countStyle.style.display = 'none'
                this.options.push({value: '0',label: '全部'});
                this.selectType = '0';
            }else{
                this.$refs.countStyle.style.display = 'block'
                this.selectType = '1';
                this.options = [];
                this.options = [
                    {
                        value: '1',
                        label: '用户'
                    }, 
                    {
                        value: '2',
                        label: '企业'
                    }
                ];
            }
        },
        //回写数据查询
        getUsers(){
            var myData = {
                 dataId:this.serviceObj.id,
                 visibility_type:this.visibilityType,//1可见2屏蔽
                 visibility_set_catagory:this.visibilitySetCatagory//1方案2服务
                //dataId:"7c3f63a1836745579f9ced993e0ebda1",//全部
                //visibility_type:"1",
                //visibility_set_catagory:"2"
            };
            var that = this;
            apiClient.post('itsmApi/outterVisible/outters', myData, function(data) {
                console.log(data);
                var results = data.results
                that.loginUser = results.USER_ID;
                that.loginEnterprise = results.ENTERPRISE_ID;
                //全部
                if(results.visibilityLevel === '1'){
                    that.checkAll = true
                    that.$refs.countStyle.style.display = 'none'
                    that.options.push({value: '0',label: '全部'});
                    that.selectType = '0';
                    that.$refs.countStyle.style.display = 'none'
                }else/* if(results.visibilityLevel === '2')*/{//部分
                    that.$refs.countStyle.style.display = 'block'
                    that.selectType = '1';
                    that.options = [];
                    that.options = [
                        {
                            value: '1',
                            label: '用户'
                        }, 
                        {
                            value: '2',
                            label: '企业'
                        }
                    ];
                    for(var i = 0 ; i < results.personal.length ; i ++){
                        results.personal[i].ischoose = false;
                    }
                    that.personalList = [...results.personal];
                    for(var i = 0 ; i < results.enterprise.length ; i ++){
                        results.enterprise[i].ischoose = false;
                    }
                    that.enterpriseList = [...results.enterprise]
                    that.checkAll = false;
                }
                 //获取可用设置数据
                that.getVisibilityUserOrEnterprise();
            }).catch(e => {
                if (e.response && e.response.status === 503) {
                    TipBoxService.open(e.response.data.exception,2)
                    LoadingBoxService.close()
                }
                throw e
            })
        },
        //搜索功能
        remoteMethod (value) {
            this.labelList = [];
            var selectUrl = ""
            if(this.selectType == 1){
                selectUrl = 'pubapi/user/getByName'
            }else if(this.selectType == 2){
                selectUrl = 'pubapi/enterprise/getByName'
            }
            if (value !== '' && selectUrl !== '') {
                apiClient.get(selectUrl, {name: value}).then(data => {
                    if (!data ||!data.list || data.list.length === 0) {
                        this.isShowSearched = false
                        return
                    }
                    for(var i = 0 ; i < data.list.length ; i ++){
                        data.list[i].ischoose = false;
                    }
                    this.isShowSearched = true
                    this.labelList = _.difference(data.list, this.currentLabels)
                    for(var i = 0 ; i < this.labelList.length ; i ++){
                        this.labelList[i].isChecked = false;
                        var labelId = this.labelList[i].ID;
                        //判断登陆用户、企业 --屏蔽：2
                        if(this.visibilityType == '2' && 
                            (labelId == this.loginUser || labelId == this.loginEnterprise)){
                            this.labelList[i].isChecked = true;//是否禁用
                        }
                        for(var k = 0 ; k < this.personalList.length ; k ++){
                            if(labelId == this.personalList[k].ID){
                                this.labelList[i].isChecked = true;//是否禁用
                            }
                        }
                        for(var k = 0 ; k < this.enterpriseList.length ; k ++){
                            if(labelId == this.enterpriseList[k].ID){
                                this.labelList[i].isChecked = true;//是否禁用
                            }
                        }
                        //判断可见中是否有设置
                        for(var k = 0 ; k < this.visibilityUserOrEnterprise.length ; k ++){
                            if(labelId == this.visibilityUserOrEnterprise[k].ID){
                                this.labelList[i].isChecked = true;//是否禁用
                            }
                        }
                    }
                }).catch(e => {
                    this.labelList = []
                    this.isShowSearched = false
                })
            }
        },
        //获取可见数据
        getVisibilityUserOrEnterprise(){
            if(this.visibilityType === '2'){
                var myData = {
                    dataId:this.serviceObj.id,
                    visibility_type:'1',//1可见2屏蔽
                    visibility_set_catagory:this.visibilitySetCatagory//1方案2服务
                };
                var that = this;
                apiClient.post('itsmApi/outterVisible/outters', myData, function(data) {
                    var results = data.results
                    //全部
                    if(results.visibilityLevel === '2'){
                        that.visibilityUserOrEnterprise = results.personal.concat(results.enterprise);
                    }
                }).catch(e => {
                    if (e.response && e.response.status === 503) {
                        TipBoxService.open(e.response.data.exception,2)
                        LoadingBoxService.close()
                    }
                    throw e
                })
            }
            
        },
        //新增操作
        addVisibilityToDB () {
            var that = this;
            console.log(this.checkAll)
            if(this.checkAll){
                this.visibilityLevel = "1";
            }
            else{
                this.visibilityLevel = "2";
                if(!this.personalList.length &&!this.enterpriseList.length){
                    TipBoxService.open('没有【全部】设置,【部分】设置时，数据不能为空', 1);                    
                    return;
                }
            }
            var myData = {
                data_id:this.serviceObj.id,
                visibility_level:this.visibilityLevel,
                visibility_type:this.visibilityType,
                visibility_set_catagory:this.visibilitySetCatagory,
                user_ids:[],
                enterprise_ids:[]
            };
            for (var i = 0; i < this.personalList.length; i++) {
                var id = this.personalList[i].ID;
                myData.user_ids.push(id);
            }
            for (var i = 0; i < this.enterpriseList.length; i++) {
                var id = this.enterpriseList[i].ID;
                myData.enterprise_ids.push(id);
            }
            //非空判断
            // if(!this.checkAll){
            //     if(myData.user_ids.length == 0 && myData.enterprise_ids.length == 0){
            //         TipBoxService.open('数据为空');
            //         return;
            //     }
            // }
            return apiClient.post('itsmApi/outterVisible/addOutter', myData,function(data){
                if (data.status == 200) {
                    TipBoxService.open('更新成功');
                    that.callBack();                    
                    that.onCancle();
                } else {
                    TipBoxService.open('更新失败');
                }
            }).catch(e => {
                if (e.response && e.response.status === 503) {
                    TipBoxService.open(e.response.data.exception,2)
                }
                throw e
            })
        },
        //删除标签
        dataDel (id,type) {
            if(type === "personal"){
                for (var i = 0; i < this.personalList.length; i++) {
                    var ids = this.personalList[i].ID;
                    if(id === ids){
                        this.personalList.splice(i, 1);
                    }
                }
            }else if(type === "enterprise"){
                for (var i = 0; i < this.enterpriseList.length; i++) {
                    var ids = this.enterpriseList[i].ID;
                    if(id === ids){
                        this.enterpriseList.splice(i, 1);
                    }
                }
            }
        },
        onCancle: function() {
            this.show = false;
            this.$emit("cancle", false);
            this.inputValue = ''
        },
        selectOut(){
            this.selectflag=false
            //搜素框失去焦点
            $("#sousuo").find("input").blur();
        },
        selectOver(){
            this.selectflag=true
        },
        inputBlur(){
            this.selectflag=true
        },
        //点击确定后回传数据方法
        callBack(){
            if(this.visibilityLevel=='1'){
                this.personalList=[];
                this.enterpriseList=[];
            }
            var obj ={
                personal:this.personalList,
                enterprise:this.enterpriseList,
                visibilityLevel:this.visibilityLevel
                }
            this.$emit('callback',obj)
        }
    }
}
</script>
<style src="../../css/dialog/visibilitySet.css" scoped></style>
<style>
.bigSreen2 .el-select-dropdown{
    margin: 0;
}
.visibilitySet .el-select-dropdown__list{
    text-align: center;
}

.visibilitySet div.el-select .el-input__inner{
     padding-left: 34px; 
}
.visibilitySet .el-input-group__prepend{
    width: 102px;
    padding-right: 10px;
    text-align: center;
}
.el-select-dropdown__item{
    text-align: center;
}
/*  复选默认样式*/
.visibilitySet .last .el-checkbox__inner{
    width: 14px;
    height: 14px;
    border-radius: 0px;
    margin-left: -18px;
}
/*  复选选中的颜色*/
.visibilitySet .last .yesSetConent .el-checkbox__inner{
    border: 1px solid #55a8fd;
}
/*  复选没有选中的颜色*/
.visibilitySet .last .noSetConent .el-checkbox__inner{
    border: 1px solid #55a8fd;
}
.visibilitySet .el-input-group{
    width: 510px;
    margin-right: 40px;
}
.visibilitySet .el-checkbox__label{
    font-weight: 400;
}
.visibilitySet .el-input-group__append, .el-input-group__prepend{
    width: 100px;
}
.visibilitySet .el-dialog__header {
  width: 673px;
  padding: 10px 10px 10px;
  border-top-right-radius: 6px;
  border-top-left-radius: 6px;
}
.visibilitySet .el-dialog__body {
  width: 673px;
  height: 374px;
  padding: 15px 15px;
}
.visibilitySet .el-dialog {
  width: 673px;
  border-top-right-radius: 6px;
  border-top-left-radius: 6px;
}
.visibilitySet .el-icon-close {
  font-size: 12px;
}
.visibilitySet .dialog-footer .el-button:focus,
.visibilitySet .dialog-footer .el-button {
  color: #ffffff;
  float: left;
  height: 40px;
  border-radius: 0px;
  width: 50%;
}
.visibilitySet .el-dialog__footer {
  padding: 0px;
}
.visibilitySet .el-button.el-button {
  margin: 0px;
}
.visibilitySet .el-button--primary {
  background-color: #7fa6f3;
  border-color: #7fa6f3;
}
.visibilitySet .el-button--default {
  background-color: #e2e2e2;
  border-color: #e2e2e2;
}
.visibilitySet .dialog-footer .el-button:hover {
  color: #ffffff;
  border-color: #7fa6f3;
  background-color: #7fa6f3;
}
.visibilitySet .el-dialog__header .el-dialog__title {
    line-height: 22px;
    height: 22px;
    font-weight: 400;
    color: white !important;
}
.visibilitySet .hsaHover .el-button--primary {
    background-color: #e2e2e2;
    border-color: #e2e2e2;
}
.visibilitySet .hsaHover .el-button--default {
    color: #ffffff;
    border-color: #7fa6f3;
    background-color: #7fa6f3;
}
</style>