<template>
<div  class="" style="height:100%;">
    <div class="tagbox" v-show="notNull">
      <div class="tag" v-for="(name,index) in title" v-show="notNull">
        <div class="form" >
          <el-form :model="ruleForm[index]" :rules="rules[index]" ref="ruleForm[index]" label-width="100px" class="demo-ruleForm">
            <el-form-item label="导航名称" prop="name" >
              <el-input v-model="ruleForm[index].name" style="height:30px" ></el-input>
            </el-form-item>
         </el-form>
            <div class="tagtext">标签</div>
            <div class="tabTag">
              <ul >
                <li @click="add" v-for="(ta,i) in tag[index]">{{ta}} <span class="icon iconfont icon-cuohao hovershow" @click="deleteTag(index,i)"></span></li>
              </ul>
            </div>
            <span class="parentmsg" v-show="tagrule[index].flag">{{tagrule[index].msg}}</span> 
            <el-button :plain="true" :disabled="false" class="addTag" @click="addTag(index)">添加标签</el-button>
            <i class="iconfont icon icon-jianhao1" v-show="deleteflag[index].flag" @click="deleteHtml(index)"></i>
            <i class="iconfont icon icon-jiahao1" v-show="addflag[index].flag" @click="addHtml(name)"></i>
        </div>
      </div>
      <div class="top">
      <ul>
        <li>
           <el-button type="primary" @click="updateData">保存</el-button>
        </li>
        <li>
           <el-button type="info" @click="deleteData" plain>删除</el-button>
        </li>
      </ul>
    </div>
    </div>
     <div class="noInformation" v-show="!notNull" >
				<img src="../../images/zanwu.png"  >
		</div> 
   <LabelView :dialogTagVisible.sync="dialogTagVisible" :isCreateModel="isEdit" :model="metaData" modelLabelKey="serviceTag" :changeLabelCaller="saveLabel" />
   
</div>
</template>

<script>
import apiToken from '../../../publicJs/apiToken.js'
import apiClient from '../../../publicJs/ApiClient.js'
import TipBoxService from '../../../publicJs/TipBoxService.js'
import LoadingBoxService from '../../../publicJs/LoadingBoxService.js'
import LabelView from '../../../publicComponent/labelView.vue'
import appPublicJs from '../../common/public.js'
import NoticeBoxService from '../../../publicJs/NoticeBoxService.js'
import Util from '../../../publicJs/Util.js'
export default {
  data() {
    return {
      parent_id:"",
      sort_order:"",
      notNull:true,
      addflag:[],
      deleteflag:[],
      tag: [],
      title: [],
      dialogTagVisible: false,
      dataCheckSpecs: "",
      isEdit: "false",
      addIndex:"",
      id:"",
      isHasChild:true,
      htmlLenght:0,
      parentId:"",
      tagrule:[],
      nameTitle:[],
      nameIndex:0,
      nameControl:false,
      metaData: {
        serviceTag: [], //标签名称数组
        resourcetag:"" //标签名称字符串
      }, //包含标签名称数组的对象     
      ruleForm: [{
        name: "",
      /*  nameArry:[]//有问题 以后解决*/
      }],
      rules: [{
        name: [{
          required: true,
          message: '请输入导航名称',
          trigger: 'blur'
        }, {
          min: 0,
          max: 16,
          message: '长度在1到16个字符',
          trigger: 'blur'
        }]
      }]
    };
  },
  created() {
      this.$root.eventHub.$on('change', (data) => {
      let yourData=data;
      if(!yourData){
          this.notNull=false;
      }else{
      this.notNull=true;
      this.parent_id=yourData.parent_id;
      this.sort_order=yourData.sort_order;
      this.title = [];
      this.tag = [];
      this.id=yourData.id;
      this.addflag=[],
      this.deleteflag=[],
      this.parentId=yourData.parent_id;
      this.ruleForm=[];
      this.rules=[];
      this.tagrule=[];
      yourData.items?this.isHasChild=true:this.isHasChild=false; 
      this.htmlLenght=yourData.info.length;
      if(yourData.parent_id=="0"){
        for (let j = 0; j < this.htmlLenght+1; j++) {
          this.addflag.push({flag:true});
          this.deleteflag.push({flag:true})
        };
        this.htmlLenght==1?this.deleteflag[0].flag=false:"";  
        this.htmlLenght==4?this.addflag[3].flag=false:"";    
      }else{
        this.addflag.push({flag:false})
        this.deleteflag.push({flag:false})
      }  
      var rulesLength=Math.ceil(16/yourData.info.length) 
      
      for (var i = 0; i < yourData.info.length; i++) {
        var info = yourData.info[i];
        this.title.push(info.title);
        this.ruleForm.push({name:info.title});
        this.rules.push({name:[{
          required: true,
          message: '请输入导航名称',
          trigger: 'blur'
        }, {
          max: rulesLength,
          trigger: 'blur',
          validator:this.lengthCheck
        },{
          validator:this.regst,
          trigger: 'blur'
      } ,{
          validator:this.nameCheck,
          trigger: 'blur'
        }]})
        this.tag.push(info.tags.split(","));
        this.tag[0] == "" ? this.tag = [] : "";  
        this.tagrule.push({
          msg:"至少添加一个标签",
          flag:false
        }) 
      };
    }
    })
    this.$root.eventHub.$on('forNameChek', (data,index) => {
      this.nameTitle=[];
      this.nameIndex=index;
      if(data[0].parent_id=="0"){
        this.nameControl=true
        for (let i = 0; i < data.length; i++) {
          let element = data[i].info;
          this.nameTitle.push(element)
        } 
      }else{
        for (let i = 0; i < data.length; i++) {
          let element = data[i].info;
          for (let a = 0; a < element.length; a++) {
            let el = element[a].title;   
            this.nameTitle.push(el)      
          }
        } 
        this.nameControl=false
      }
    })
  },
  components: {
    LabelView
  },
  mounted() {

  },
  methods: {
    lengthCheck:function(rule, value, callback){
      var num=Util.trim(value)
      if(num.length>rule.max||num.length==0){
         callback(new Error('长度在1到'+rule.max+'个字符'))
      }else{
          callback();
      }
    },
    nameCheck:function(rule, value, callback){
      var flag=false
      if( this.nameControl){
        for (let i = 0; i < this.nameTitle.length; i++) {
         const element = this.nameTitle[i];
         if(i==this.nameIndex){
            let hash = {}; 
            for(let b in this.ruleForm) { 
              if(this.ruleForm[b].name==""){
                continue
              }
              if(hash[this.ruleForm[b].name]){
                flag=true
                break
              }else{
                 hash[this.ruleForm[b].name] = true;
              }        
            } 
         }else{
           for (let a = 0; a < element.length; a++) {
             const el = element[a].title;
             if(el==value){
               flag=true
               break
             }
           }
         }
       }
      }else{
        for (let i = 0; i < this.nameTitle.length; i++) {
         const element = this.nameTitle[i];
         if(i==this.nameIndex){
           continue
         }
         if(value==element){
           flag=true
           break
         }
       }
      }
       
       if (flag) {
          callback(new Error('已有同名的导航存在'));
        } else {
          callback();
        }  
    },
    regst:function(rule, value, callback){
       var pattern = new RegExp("[`~!%+-.@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]")
       if ( pattern.test(value)) {
          callback(new Error('不能是特殊字符'));
        } else {
          callback();
        } 
    },
    add: function() {      
      this.tagLayeFlag = !this.tagLayeFlag;
    },
    saveLabel:function() {
      this.tag[this.addIndex]=this.metaData.serviceTag;
      this.tagCheck()
      return true
    },
    addTag:function(index){
      this.addIndex=index;
      this.metaData.serviceTag=this.tag[index]?this.tag[index]:[];
      this.metaData.resourcetag=this.title[index]?this.title[index]:"";
      this.dialogTagVisible=true;
    },
    tagCheck(){  
      var flag=true
      for (let i = 0; i < this.ruleForm.length; i++) {
        if(!Util.isArray(this.tag[i])||!this.tag[i].length>0) {
          flag=false
          this.tagrule[i].flag=true
        }else{
          this.tagrule[i].flag=false
        }    
      }
      return flag
    },
    updateData: function() {
      if(this.fromCheck()&&this.tagCheck()){
      }else{
        /* TipBoxService.open("配置有问题",1); */
        return
      }
      
      var info = [];
      for(var i=0; i<this.ruleForm.length; i++){
          info.push({
            "title": Util.trim(this.ruleForm[i].name),
            "tags": this.tag[i]?this.tag[i].join(","):""
          })
      };
      var myData = {
        'templateId':this.$route.query.temId,
        "id": this.id,
        "info": JSON.stringify(info),
      };
      var that=this
      apiClient.put(apiToken.newApi('appmarket/item/updateItem/'), myData, function(data) {
        TipBoxService.open("保存成功",0);
        that.$root.eventHub.$emit('update', true)
      })
    },
    deleteData: function() {
      var that=this;
      var sure=function(){
        NoticeBoxService.close()
        var myData = {
          'templateId':that.$route.query.temId,
          "id": that.id, 
          "sort_order": that.sort_order,
          "parent_id":that.parent_id
         
        }
        apiClient.delete(apiToken.newApi('appmarket/item/deleteItem/'), myData, function(data) {
          that.$root.eventHub.$emit('update', true);
          TipBoxService.open("删除成功",0);
        })
      }
      NoticeBoxService.open("是否确认删除", sure )
    },
    deleteTag:function(index,i){
      this.tag[index].splice(i,1)
    },
    addHtml:function(){
      if(this.htmlLenght==4){
        TipBoxService.open("不能超过四条",1);
        return;
      }
      this.htmlLenght++;
      this.deleteflag[0].flag?"":this.deleteflag[0].flag=true;
      this.addflag.push({flag:true});
      this.deleteflag.push({flag:true})
      this.title.push("");
     /* this.tag.push(["测试"]);*/
      this.ruleForm.push({name:""});
      this.ruleRest(this.htmlLenght);
      console.log("add",this.rules)
      for (let i = 0; i < this.htmlLenght; i++) {
        if(i==3){
          this.addflag[i].flag=false; 
        }else{
           this.addflag[i].flag=true
        }     
      }
    },
    deleteHtml:function(index){
      this.htmlLenght--;
      this.addflag.splice(index,1)
      this.deleteflag.splice(index,1)
      this.tag.splice(index,1)
      this.title.splice(index,1)
      this.ruleForm.splice(index,1)
      this.ruleRest(this.htmlLenght)
      console.log("del",this.rules)
      for (let i = 0; i < this.htmlLenght; i++) {
          this.deleteflag[i].flag=true   
      }
      if(this.htmlLenght==1){
        this.deleteflag[0].flag=false
        this.addflag[0].flag=true
      }
    },
    ruleRest: function(index){
      this.rules=[];
      var length=Math.ceil(16/index);
      for (var i = 0; i < index+1; i++) {
         this.rules.push({name:[{
          required: true,
          message: '请输入导航名称',
          trigger: 'blur'
        }, {
          max: length,
          trigger: 'blur',
          validator:this.lengthCheck
        },{
          validator:this.regst,
          trigger: 'blur'
        },{
          validator:this.nameCheck,
          trigger: 'blur'
        }]})
        this.tagrule.push({
          msg:"至少添加一个标签",
          flag:false
        }) 
      }  
    },
    fromCheck:function(){
      var fromArry= this.$refs["ruleForm[index]"]
      for (var i = 0; i < fromArry.length; i++) {
        var flag=true
        fromArry[i].validate(function(a){
          flag=a 
        });
        if(flag){}else{
          return false
        }
      };
      return true
    }
  }
}
</script>
<style scoped>
 .noInformation{
    max-height: 100%;
    width: 98%;
    overflow: auto;
    height: 100%;
    background: #FFF;
    box-shadow: 0px 0px 5px #d8d7d7;
   padding: 21% 20% 0 40%;
   box-sizing: border-box;
}
.appNavConfigRight .tagbox{
  overflow-y: auto;
  max-height: 100%;
}
.appNavConfigRight .top{
    width: 100%;
    height: 49px;
    line-height: 49px;
    margin-bottom: 15px;
    bottom: 0;
    background-color:#fff;
    position: relative;
}
.appNavConfigRight .top ul{
  position: absolute;
  left: 50%;
  margin-left: -100px;
}
.appNavConfigRight .top li{
  float: left;
  padding: 0 10px;
}
.appNavConfigTag .top li button{
  width: 80px;
  height: 30px;
  padding: 0;
  border-radius: 5px;
}
.appNavConfigTag .top li:last-child button{
  background-color: #e3e3e3;
  border:none;
}
.demo-ruleForm{
  height: 100%;
}
.el-form-item {
  margin-top: 20px;
}
.tagtext{
    text-align: right;
    vertical-align: middle;
    float: left;
    font-size: 14px;
    color: #48576a;
    line-height: 1;
    padding: 11px 12px 11px 0;
    box-sizing: border-box;
    width: 100px;
    display: inline-block;
    margin-bottom: 5px;
    font-weight: bold;

}
.tagtext:before{
    content: '*';
    color: #ff4949;
    margin-right: 4px;
}
.el-input{
  width: 290px;
  margin: 0 auto;
}
.tabTag{
  height: 140px;
  width: 73%;
  border:1px solid #ededee;
  border-radius: 5px;
  margin-left: 100px;
}
.addTag{
  float: right;
  margin-top: -140px;
  margin-right: 20px;
  background: #fff;
  border-color: #20a0ff;
  color: #20a0ff;
  cursor: pointer;
}
.icon-jiahao1{
  width: 30px;
  height: 30px;
  line-height: 45px;
  text-align: center;
  float: right;
  font-size: 22px; 
  color: #cccccc  ;
  cursor: pointer;
}
.icon-jiahao1:hover{
  color: #52a1f2;
}
.icon-jianhao1:hover{
  color: #52a1f2;
}
.icon-jianhao1{
  width: 30px;
  height: 30px;
  line-height: 45px;
  text-align: center;
  float: right;
  font-size: 22px; 
  color: #cccccc  ;
  cursor: pointer;
}
.tabTag ul{
  width: 100%;
  max-height: 100%;
  overflow-y: auto;
}
.tabTag ul li{
  float: left;
  margin: 12px;
  margin-bottom: 0px;
  height: 28px;
  border:1px solid rgba(0,0,0,0.3);
  text-align: center;
  border-radius: 5px;
  padding: 3px;
  line-height: 20px;
  min-width: 40px;
  cursor: default;
  position: relative;
}
.tabTag ul li span{
    width: 12px;
    height: 12px;
    color: #f93838;
    position: absolute;
    top: -8px;
    right: -3px;
    font-size: 17px;
    cursor: pointer;
}
.tabTag ul li:hover{
  background: #fff;
  border-color: #20a0ff;
  color: #20a0ff;
}
.tabTag ul li .hovershow{
	display: none
}
.tabTag ul li:hover .hovershow{
	display: block;	
}
.tag{
  margin-bottom: 20px;
  height: 266px;
  width: 98%;
  border:1px solid #ededee;
  margin-right: 1%;
  border-radius: 3px;
  box-shadow: 0px 2px 3px 1px rgba(55, 55, 55, .2);
}
.tag:first-child{
  margin-top: 10px;
}
.top>ul>li{
  cursor: pointer;
}
.el-button--info{

}
.parentmsg{
    text-align: left;
    width: 50%;
    display: inline-block;
    padding-left: 100px;
    padding-top: 5px;
    color: #ff4949;
    font-size: 12px;
}
</style>
