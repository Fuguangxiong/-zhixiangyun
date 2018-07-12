<template>
<div>
  <div class="title">
    <h5>导航菜单</h5>
    <i class="icon iconfont icon-iconjia" @click="add" data-toggle="modal" data-target="#exampleModal" ></i>
   <!--  <i class="icon iconfont icon-shudian"></i> -->
  </div>
  <div v-if="notNull" class="tree-menu">
    <div class="tree">
     <draggable  element="ul" v-model="theModel" :options="dragOptions('description')" :move="onMove" @start="isDragging=true" @end="onEnd" >  
        <ul v-for="(menuItem,index) in theModel" :key="menuItem.sort_order">
           <li>
            <span @click="toggle(menuItem,index)" class="treecommon "  >
               <i class="icon iconfont icon-wenjianjia" ></i>
              <span v-for="text in menuItem.info" class="treeFlag" :class="{active:menuItem.state==true}">{{text.title}}<span>/</span></span>
              <i  class="shousuo icon iconfont" v-on:click.stop="isFolder(index)" :class="treeShowFlag[index]?(treeShowFlag[index].flag?'icon-xiangshangjiantouarrowup1':'icon-xiangxiajiantou1'):''"></i>
            </span>
            <ul v-show="treeShowFlag[index]?treeShowFlag[index].flag:''">
            <draggable  element="ul" v-model="menuItem.items" :options="dragOptions(index)" :move="onMove" @start="isDragging=true" @end="secondonEnd(index)" >  
               <li v-for="(item,num) in menuItem.items">
                  <span  @click="cltoggle( menuItem.items,num)" class="treecommon treesecond"  >
                   <i  class="icon iconfont icon-hengxian" ></i>
                   <span v-for="text in item.info" :class="{active:item.state==true}">{{text.title}}</span>
                   <i  class="icon iconfont icon-shanchu"   @click="deleteChidren(item)"></i>              
                   </span>
               </li>
            </draggable>
            </ul>
          </li>
        </ul> 
      </draggable>
    </div>
  </div>
 <div v-else class="noInformation" > 
				<img src="../../images/zanwuliebiao.png"  >
		  </div> 
  <!-- 弹框 -->
<div class="modal" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true" class="icon iconfont icon-guanbi1"></span></button>
        <h4 class="">添加导航菜单</h4>
      </div>
      <div class="modal-body">
        <form>
          <div class="form-group" :class="[rule.parent.flag? 'form-grouperro':'form-groupnormal']">
            <label for="recipient-selcet" class="control-label">所属父级:</label>
            <div class="select" @click.stop="select">
                <span class="" v-model="msg" >{{msg}}</span>
                <ul v-show="showFlag" id="sleul">
                  <li v-for="iterm in navOne" @click.stop="selectLi(iterm)">{{iterm.name}}</li>
                </ul>
             </div> 
          </div>
          <span class="parentmsg" v-show="rule.parent.flag">{{rule.parent.msg}}</span>   
          <div class="form-group" :class="[rule.name.flag? 'form-grouperro':'form-groupnormal',rule.spacil.flag? 'form-grouperro':'form-groupnormal',
          rule.same.flag? 'form-grouperro':'form-groupnormal',rule.twoLength.flag? 'form-grouperro':'form-groupnormal',rule.oneLength.flag? 'form-grouperro':'form-groupnormal']">
            <label for="recipient-name" class="control-label">导航名称:</label>
            <input type="text" class="form-control nameInput" id="recipient-name" v-model="tagName" @blur="nameBlur"  >
          </div>
          <span class="parentmsg" v-show="rule.spacil.flag">{{rule.spacil.msg}}</span>
          <span class="parentmsg" v-show="rule.same.flag">{{rule.same.msg}}</span> 
          <span class="parentmsg" v-show="rule.name.flag">{{rule.name.msg}}</span> 
          <span class="parentmsg" v-show="rule.twoLength.flag">{{rule.twoLength.msg}}</span> 
          <span class="parentmsg" v-show="rule.oneLength.flag">{{rule.oneLength.msg}}</span> 
        
        </form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-default" @click="saveData">保存</button>
        <button type="button" class="btn btn-primary" @click="closeModel">取消</button>
      </div>
    </div>
  </div>
  </div>  
</div>

</template>

<script>
import apiToken from '../../../publicJs/apiToken.js'
import apiClient from '../../../publicJs/ApiClient.js'
import TipBoxService from '../../../publicJs/TipBoxService.js'
import LoadingBoxService from '../../../publicJs/LoadingBoxService.js'
import appPublicJs from '../../common/public.js'
import draggable from 'vuedraggable'
import NoticeBoxService from '../../../publicJs/NoticeBoxService.js'
import Util from '../../../publicJs/Util.js'
export default {
  name: 'treeMenu',
  data() {
    return {
      notNull:true,
      theModel: null,
      rule:{
        parent:{
          msg:"必填项",
          flag:false
        },
        name:{
          msg:"名称在1到16个字符",
          flag:false
        },
        spacil:{
          msg:"名称不能是特殊字符",   
          flag:false
        },
        same:{
          msg:"已有同名的导航存在",
          flag:false
        },
        twoLength:{
          msg:"二级导航不能超过5个",
          flag:false
        },
        oneLength:{
          msg:"一级导航不能超过10个",
          flag:false
        }
      },
      active: false,
      navOne: [{
        "name": "--根目录--",
        "id": "0"
      }],
      msg: "",
      treeShowFlag:[],
      oneLength: 0,
      twoLength: [],
      showFlag: false,
      level: "1",
      parentId: "0",
      sort_order: 1, //已解决
      tagName: "",
      //拖拽 参数
      editable:true,
      isDragging: false,
      delayedDragging:false
    }
  },
  components:{
   draggable
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
    }
  },
  computed: {  
    
  },
  mounted() {
    this.getMenuList();
    document.onclick = function(event) {
      $("#sleul").hide()
    };
    this.$root.eventHub.$on('update', (yourData) => {
     this.getMenuList()
    })
  },
  methods: {
    dragOptions (description) {
      return  {
        animation: 0,
        group: description,
        disabled: !this.editable,
        ghostClass: 'ghost'
      };
    },
    onMove ({relatedContext, draggedContext}) {
      const relatedElement = relatedContext.element;
      const draggedElement = draggedContext.element;
      return (!relatedElement || !relatedElement.fixed) && !draggedElement.fixed
    },
    onEnd(){
      LoadingBoxService.open('加载中...');
      var id=[];
      var Order=[]
      for (var i = 0; i < this.theModel.length; i++) {
        id.push(this.theModel[i].id);
        Order.push(i+1)
      }
      var myData = {
        'templateId':this.$route.query.temId,
        "id": id.join(","),
        "sort_order":Order.join(",") ,
      };
      var that=this
      apiClient.put(apiToken.newApi('/appmarket/item/dragAndDropItem/'), myData, function(data) {
        LoadingBoxService.close();
      })
    },
    secondonEnd(index){
      var id=[];
      var Order=[];
      var that=this;
  
       for (var i = 0; i < that.theModel[index].items.length; i++) {
        id.push(that.theModel[index].items[i].id);
        Order.push(i+1)
      }
      var myData = {
        'templateId':this.$route.query.temId,
        "id": id.join(","),
        "sort_order":Order.join(",") ,
      };
      LoadingBoxService.open('加载中...');
      apiClient.put(apiToken.newApi('/appmarket/item/dragAndDropItem/'), myData, function(data) {
        LoadingBoxService.close();
      })
    },
    isFolder(index) {
      this.treeShowFlag[index].flag=!this.treeShowFlag[index].flag
    },
    toggle: function(menuItem,index) {
      this.theModel.map(function(v, i) {
        v.items ? v.items.map(function(s, i) {
          s.state = false;
        }) : "";
        v.id == menuItem.id ? v.state = true : v.state = false;
      });
      this.$root.eventHub.$emit('change', menuItem)
      this.$root.eventHub.$emit('forNameChek', this.theModel,index)
    },
    cltoggle: function(iterm, index) {
      this.theModel.map(function(v, i) {
        v.state = false;
        v.items ? v.items.map(function(a, b) {
          a.id == iterm[index].id ? a.state = true : a.state = false;
        }) : "";
      });
      
      this.$root.eventHub.$emit('change', iterm[index])
      this.$root.eventHub.$emit('forNameChek', iterm,index)
    },
    add: function() {
      this.msg = "";
      this.tagName = "";
      for(let key in this.rule){
        this.rule[key].flag=false;
      }
    },
    select: function() {
      this.showFlag = !this.showFlag;
    },
    selectLi: function(msg) {
      this.showFlag = false;
      this.msg = msg.name;
      this.parentId = msg.id;
      this.parentId == "0" ? this.level = "1" : this.level = "2";
      this.parentId == "0" ? this.sort_order = this.oneLength + 1 : this.sort_order = this.twoLength[msg.sort_order - 1] + 1;
    },
    deleteChidren:function(item){
      var that=this;
      var sure=function(){
        NoticeBoxService.close()
        var myData = {
          'templateId':this.$route.query.temId,
          "id": item.id,
          "sort_order":item.sort_order,
          "parent_id":item.parent_id
        };
        apiClient.delete(apiToken.newApi('appmarket/item/deleteItem/'), myData, function(data) {
          that.getMenuList()
          that.toggle(that.theModel[0],0)
          TipBoxService.open("删除成功",0);
        })
      }
      NoticeBoxService.open("是否确认删除", sure )
    },
    getMenuList(index) {
      var that = this;
      var myData = {
        'templateId':this.$route.query.temId,
        status: "0"
      };
      this.treeShowFlag=[]
      apiClient.get(apiToken.newApi('appmarket/item/getItem/'), myData, function(data) {   
        if (appPublicJs.checkData(data.results.itemTreeList)) {
          that.notNull=true;
          that.twoLength = [];
          that.navOne = [{
            "name": "--根目录--",
            "id": "0"
          }];
          that.theModel = data.results.itemTreeList;
          that.oneLength = data.results.itemTreeList.length;
          for (var i = 0; i < data.results.itemTreeList.length; i++) {
            var info = data.results.itemTreeList[i].info;
            var name = "";
            var id = data.results.itemTreeList[i].id;
            var sort_order = data.results.itemTreeList[i].sort_order;
            that.treeShowFlag.push({flag:false})
            for (var j = 0; j < info.length; j++) {
              name += info[j].title + "/";
            }
            name = name.substring(0, name.length - 1)
            var obj = {
              "name": name,
              "id": id,
              "sort_order": sort_order,
            }
            that.navOne.push(obj);
            data.results.itemTreeList[i].items ? that.twoLength.push(data.results.itemTreeList[i].items.length) : that.twoLength.push(0);
          }
          if(that.parentId=="0"){
            that.toggle(that.theModel[0],0)
          }else{
            index!=undefined? that.treeShowFlag[index].flag=true:"";
            index!=undefined? that.cltoggle(that.theModel[index].items[0],0):"";
          }       
        }
        else{
           that.navOne = [{
              "name": "--根目录--",
              "id": "0"
            }];
           that.theModel=[]
           that.notNull=false;
           that.$root.eventHub.$emit('change', false)
         }
       
      })
    },
    nameCheck(){
      var flag=true
      if (this.parentId==0&&this.theModel) {
        for (let i = 0; i < this.theModel.length; i++) {
          let element = this.theModel[i].info;
          for (let a = 0; a < element.length; a++) {
            let ele = element[a].title;
            ele==this.tagName?flag=false:""
          }
        }
      }else if(this.theModel){
        for (let i = 0; i < this.theModel.length; i++) {
          let element = this.theModel[i];
          if(this.parentId==element.id){
            if(element.items){
              for (let a = 0; a < element.items.length; a++) {
              let ele = element.items[a].info[0].title;
              ele==this.tagName?flag=false:""
             }
            }
          }
        }
      }
      flag?"":this.rule.same.flag=true
      return flag
    },
    twoLengthCheck(){
      var flag=true;
       for (let i = 0; i < this.theModel.length; i++) {
          let element = this.theModel[i];
          if(this.parentId==element.id){
            if (this.twoLength[i]==5) {
              this.rule.twoLength.flag=true
              flag=false
            }else{
              this.rule.twoLength.flag=false 
            }
          }
        };
        return flag
    },
    saveData: function() {
      //用户输入长度判读
      
      if(!this.checkfrom()){
        return
      }
      //导航菜单现有长度判读
      if(this.parentId==0){
        if(this.navOne.length>10){
        this.rule.oneLength.flag=true
        return;
        }else{
        this.rule.oneLength.flag=false
        }
      }else{
        if(!this.twoLengthCheck()){
          return
        }
      }
      //是否重名判断
      if(!this.nameCheck()){
        return
      }
      $('#exampleModal').modal('hide')
      var that = this;
      var info = [{
        "title": Util.trim(this.tagName),
        "tags": ""
      }];  
      var myData = {
        'templateId':this.$route.query.temId,
        "level": this.level,
        "parent_id": this.parentId,
        "sort_order": 1,
        "info": JSON.stringify(info),
        "status": "1",
      };
      apiClient.post(apiToken.newApi('appmarket/item/saveItem/'), myData, function(data) {
        that.msg="";
        that.tagName="";
        var index=0
        if(that.theModel){
          TipBoxService.open("保存成功",0);
          for (let i = 0; i < that.theModel.length; i++) {
            let element = that.theModel[i];
            that.parentId==element.id? index=i:""
          }
          that.getMenuList(index);
        }else{
          that.getMenuList()
        }
        
      })
    },
    closeModel:function(){
      $('#exampleModal').modal('hide')
      for (let key in this.rule) {
        this.rule[key].flag=false
      }
    },
    checkfrom:function(){
      
      this.tagName=Util.trim(this.tagName)
      if(this.tagName.length==0){
          this.rule.name.msg="请输入导航名称"
        }else{
          this.rule.name.msg="名称在1到16个字符"
      }
      if(this.regst(this.tagName)){
        return false
      };     
      if(this.msg == ""){
        this.rule.parent.flag=true;
        if(this.tagName.length>0&&this.tagName.length<17){
          this.rule.name.flag=false
        }else {
          this.rule.name.flag=true
          return false
        }
        return false
      }else{
        this.rule.parent.flag=false;
        if(this.tagName.length>0&&this.tagName.length<17){
          this.rule.name.flag=false
          return true
        }else {
          this.rule.name.flag=true
          return false
        }
      }
    },
    regst:function(value){
       var pattern = new RegExp("[`~!%+-.@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]")
       return pattern.test(value)
    },
    nameBlur:function(){
      this.tagName=Util.trim(this.tagName)
      if(this.tagName.length==0){
          this.rule.name.msg="请输入导航名称"
        }else{
          this.rule.name.msg="名称在1到16个字符"
      }
      this.tagName=Util.trim(this.tagName)
      if(this.regst(this.tagName)){
        this.rule.name.flag=false;
        this.rule.spacil.flag=true;
      }else{
        this.rule.spacil.flag=false;
      }
      if(this.tagName.length>0&&this.tagName.length<17){
        this.rule.name.flag=false
      }else {
        this.rule.name.flag=true
      }
    }
  }
}
</script>

<style scoped>
ul {
  list-style: none;
}
.shousuo{
  float: right;
  margin-right: 15px;
  color: #999;
}
.icon-wenjianjia{
    color: #55a8fd;
    font-size: 18px;
    padding-left: 10px;
    display: inline-block;
    width: 40px;
    text-align: center;
    vertical-align: bottom;
}
.icon-hengxian{
    font-size: 18px;
    padding-left: 30px;
    vertical-align: middle;
}
.tree-menu .icon-shanchu{
  float: right;
  margin-right: 16px;
  cursor: pointer;
  text-align: center;
  display: none;
}
.treesecond:hover .icon-shanchu{
  display: block;
}
.treecommon{
  width: 100%;
  display: inline-block;
  height: 35px;
  border-bottom: 1px solid #fff;
  border-top: 1px solid #fff;
  line-height: 35px;
  cursor: pointer;
}
.treesecond span{
  margin-left: 5px;
}
.treesecond{
  padding-left: 11px;
}
.treecommon:hover{
  border-bottom: 1px solid #d2e8ff;
  border-top: 1px solid #d2e8ff;
  background-color: #f7fbff;
}
.active{
  color:#fc9fad;
}
.tree-menu li {
  line-height: 1.5;
}
.treeFlag:nth-last-child(2) span{
  display: none;
}
 .title{
  height:9%;
  color: #55a8fd;
  line-height: 54px;
  background-color: #ffffff;
}
 .title h5{
  height: 54px;
  line-height: 54px;
  padding-left: 10px;
  display: inline-block;
  width: 85%;
  font-weight: 600;
}
.title i{
  height: 100%;
  width: 9%;
  line-height: 54px;
  text-align: center;
  color: #a3a3a3;
  font-size: 18px;
  cursor: pointer;
  display: inline-block;
}

 .tree-menu{
  width: 100%;
  height:95%;
}
.tree{
  overflow-y: auto;
  height: inherit;
}
/* 弹框样式 */
#recipient-selcet{
    width: 60%;
    height: 35px;
    border-radius: 5px;
}

.fatherSelect:focus{
   border-radius: 5px;
}
.nameInput{
    width: 390px;
    display: inline-block;
    height: 30px;
}
.form-group{
  text-align: center;

}
.form-groupnormal{
  margin-bottom: 17px;
}
.form-grouperro{
  margin-bottom: 0;
}
.modal-header{
  background-color: #55a8fd;
  color: #fff;
  border-radius: 6px 6px 0 0 ;
  height: 40px;
  line-height: 40px;
  padding: 12px;
}
.modal-header h4{
  font-size: 15px;
}
.modal-footer{
  border-top: none;
  text-align: center;
  padding-top: 0px;
}
.btn-default{
  background-color: #26d186;
  color: #fff;
}
.btn-primary{
  background-color: #e3e3e3;
  color: #505050;
  border:1px solid #e3e3e3;
}

.btn{
  width: 80px;
  margin: 0 20px;
  height: 30px;
  border-radius: 5px;
  line-height: 17px;
}
.btn-default{
   background-color: #55a8fd;
}
label{
      font-weight: 500;
    font-size: 14px;
}
.select{
    height: 30px;
    padding: 6px 12px;
    font-size: 14px;
    line-height: 1.42857143;
    color: #555;
    background-color: #fff;
    background-image: none;
    border: 1px solid #ccc;
    border-radius: 4px;
    display: inline-block;
    width: 390px;
    vertical-align: bottom;
    cursor: text;
    position: relative;
}
.select ul{
    display: block;
    position: absolute;
    width: 100%;
    text-align: left;
    background: #fff;
    top: 29px;
    left: 0;
    border: 1px solid #ccc;
    border-radius: 4px;
    border-top: none;
}
.select ul li{
  padding: 10px 5px;
  cursor: pointer;
  height: 35px;
}
.select ul li:not(:first-child){
padding-left: 17px;
}
.select ul li:hover{
  background: #ccc;
}
.select span{
   display: inline-block;
  width: 100%;
  height: 100%;

  text-align: left;
}
.parentmsg{
    text-align: left;
    width: 100%;
    display: inline-block;
    padding-left: 15%;
    color: #ff4949;
    font-size: 12px;
}
.modal-dialog{
  width: 534px;
  height: 216px;
  top: 50%;
  margin: 0 auto;
  margin-top: -168px;
}
.modal-body {
    padding: 25px 30px;
    padding-bottom: 10px;
} 
.modal-dialog .icon-guanbi1{
    color: rgba(255,255,255,1);
    opacity: 1;
}
.appNavConfigLeft .noInformation{
    max-height: 496px;
    width: 100%;
    overflow: auto;
    /* min-height: 370px; */
    height: 100%;
    background: #FFF;
    /* box-shadow: 0px 0px 5px #d8d7d7; */
    padding: 33% 20% 0 25%;
}
</style>