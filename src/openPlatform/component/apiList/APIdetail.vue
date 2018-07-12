<template>
<div class="publicContainer ">
  <div class="apidetailmain clear">
    <public-header ></public-header>
      <div v-show="!leftshow" class="apidetailleft">
          <div class="noPermission"> 没有权限访问</div>
      </div>
      <div v-show="leftshow" class="apidetailleft">
          <div class="apibasicinfo">
            <img :src="bgimg">
            <div class="decrib">
              <h1>{{serviceList.serviceName}}</h1>
              <span class="describinfo" :title="hoverRemark"> {{serviceRemark}}</span>
              <span class="develop">API提供方：</span>
              <span>{{developName}}</span>
              <span class="applyNameRightBtn1" @click="packageChange()" v-show="serviceState=='false'" >立即申请</span>
              <span class="applyNameRightBtn" v-show="serviceState=='true'" >已申请</span>
            </div>
        </div>
    <!-- 原子服务        -->
          <div class="apiusemedth" v-if="serviceList.isAtomic=='true'">
              <template>
                <el-tabs v-model="activeName" @tab-click="handleClick">
                  <el-tab-pane label="基本信息" name="first">
                    <div class="apiusemedthdetail">
                      <ul class="apiInterfaceddetaiDetail">
                       <li>serviceId：{{serviceList.serviceId}}</li>
                       <li v-show="serviceList.serviceDetailsInfo != ''">支持服务类型：<span v-for="(info,index) in serviceList.serviceDetailsInfo" :key="index">{{info.serviceTypeText}} &nbsp;&nbsp; </span></li>            
                      </ul>
                      <ul class="apiInterfaceddetaiDetail" v-for="(info,index) in serviceList.serviceDetailsInfo" :key="index" >
                        <li  v-show="info.serviceOutParam !=''">{{info.serviceTypeText}}</li>
                        <div style="margin-top:10px;">   
                           <p v-show="info.serviceInParam !=''">请求参数说明：</p> 
                           <table style="margin-top:10px;" v-show="info.serviceInParam !=''">
                                <thead>
                                    <tr>
                                        <th>名称</th>
                                        <th>类型</th>
                                        <th>必输</th>
                                        <th>说明</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(services,sindex) in info.serviceInParam" :key="sindex">
                                        <td>{{services.name}}</td>
                                        <td>{{services.type}}</td>
                                        <td>{{services.isRequired=='true'?'是':'否'}}</td>
                                        <td >{{services.describe}}</td>
                                    </tr>
                                </tbody>
                            </table>                        
                      
                            <p v-show="info.serviceTypeValue =='3'">返回参数格式：{{info.output_body}}</p>
                            <p v-show="info.serviceOutParam !=''">返回参数说明：</p>                             
                            <table style="margin-top:10px;" v-show="info.serviceOutParam !=''"> 
                                <thead>
                                    <tr >
                                        <th>名称</th>
                                        <th>类型</th>
                                        <th>必输</th>
                                        <th>说明</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(services,sindex) in info.serviceOutParam" :key="sindex">
                                        <td>{{services.name}}</td>
                                        <td>{{services.type}}</td>
                                        <td>{{services.isRequired=='true'?'是':'否'}}</td>
                                        <td >{{services.describe}}</td>
                                    </tr>	
                                </tbody>
                            </table>
                       </div>
                      </ul>

                    </div>
                     
                  </el-tab-pane>
                  <el-tab-pane label="使用须知" name="second">
                    <div class="demoLid useinfo" >
                        <ul>
                            <li>调用方式：API直接调用、SDK。</li>
                            <li>API直接调用分两部分：第一步，获取token；第二步调用实际接口。</li>
                            <li>本示例仅供参考，API直接获取token和调用服务的url为正确地址，服务调用示例不代表当前服务实际调用示例。</li>
                            <li>原子服务调用时需要指定其服务类型type的具体值，一个原子服务可能有多个type值，1表示页面类型，访问时不需要输入参数，结果为跳转到一个web页面；2表示页面数据类型，访问时需要输入参数，结果同样为跳转到一个web页面；3表示纯数据类型，可输入参数，也可不需要参数，结果为返回一个JSONObject。</li>					
                            <li>具体服务支持的服务类型type、输入参数、输出参数见基本信息</li>                        
                            <li>支持协议：http </li>
                            <li>长度限制：请求头不大于64KB，请求体不大于4M </li>
                            <li>字符集：UTF-8 </li>
                        </ul>
                    </div>
                  </el-tab-pane>
                  <el-tab-pane label="API调用" name="third">
                    <div class="demoLid" >
				      <ul>                        
					    <li>access_token获取</li>					
<pre>
var access_token = '';
$.ajax({
    type:"POST",
    url:'{{httprequest}}/uzp/oauth/token?client_secret=1232434584789898098&access_token='+access_token,
    data:$('#mainForm').serialize(),
    async:true,
    error:function(request){
        return;
    },
    success:function(data){
        access_token = data.results.access_token;
    }
});
</pre>

<div v-for="(info,index) in serviceList.serviceDetailsInfo" :key="index">
<li>{{info.serviceTypeText}}</li>					
<pre v-show="info.serviceTypeValue !='3'">
&lt;form id="mainForm" name="mainForm" method="post">
&lt;input type="button" value="提交" id="agreementSub"> 
&lt;/form>

let serviceId = 'c7e39392b71046bd8fcb51ce2ca46944';
let type = '2';
let param = "{'keyword':'神州泰岳'}";
$("#agreementSub").on("click",function(){
var params = '{"accessToken":"'+access_token+''","serviceId":"'+serviceId+''","type":"'+type+'",
"param":"'+param+'"}';
document.mainForm.action = '{{httprequest}}/itsmApi/se/web?params='+params;
document.mainForm.submit();
})
</pre>					
						
<pre v-show="info.serviceTypeValue =='3'">
let serviceId = 'c7e39392b71046bd8fcb51ce2ca46944';
let type = '2';
let param = "{'keyword':'神州泰岳'}";
var params = '{"accessToken":"'+access_token+''","serviceId":"'+serviceId+''","type":"'+type+'","param":"'+param+'"}';
$.ajax({
    type:"POST",
    url:'{{httprequest}}/itsmApi/se/invoke',
    data:params,
    contentType: "application/json",    
    error:function(request){
        return;
    },
    success:function(data){
        if(data != null && data.status == 200){
        let result = data.results;
        }
    }
});
</pre>
                        </div>					
				      </ul>
                    </div>		      
                  </el-tab-pane>
                  <el-tab-pane label="SDK调用" name="fourth">
                    <div class="demoLid sdkdowload" v-for="(info,index) in serviceList.serviceDetailsInfo" :key="index">
				      <ul v-show="info.serviceTypeValue !='3'">
                       <li>{{info.serviceTypeText}}</li>				
					   <li>参数:
						  <table>
							<thead>
								<tr>
									<th>参数名</th>
									<th>参数说明</th>
									<th class="center">是否必输</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td>SECRET_KEY</td>
									<td>用户授权码</td>
									<td class="center">是</td>
								</tr>
								<tr>
									<td>serviceId</td>
									<td>服务ID，见具体服务的serviceId，固定参数</td>
									<td class="center">是</td>
								</tr>
								<tr>
									<td>type</td>
									<td>调用的服务类似，见具体的服务支持的类型。固定参数</td>
									<td class="center">是</td>
								</tr>
								<tr>
									<td>HashMap</td>
									<td>具体服务要求参数，见每一个服务输入参数，type=1时，传一个实例化的map</td>
									<td class="center">是</td>
								</tr>
								<tr>
									<td>HttpServletResponse</td>
									<td>当页面或页面数据类型服务调用时需要response，通过response的流实现页面显示</td>
									<td class="center">是</td>
								</tr>
							</tbody>
						  </table>
					    </li>
<pre>
public void getItemByStatus(HttpServletRequest request,HttpServletResponse response) {
    String SECRET_KEY = "blb0gwhaa8bShlh7hZgSgthGgNbHgQhc";
    String serviceId = "17026075b25c48a48ebdfed9b561d5c1";        
    String serviceType = "1";

    //实际服务要求的参数
    HashMap bodyParam = new HashMap&lt;String, String>();
    bodyParam.put("keyword","神州泰岳");

    // 初始化一个UzpApi
    UzpApi client  = new UzpApi(SECRET_KEY);

    // 可选：设置网络连接参数
    client.setConnectionTimeoutInMillis(2000);
    client.setSocketTimeoutInMillis(60000);

    //调用服务
    client.web(serviceId,serviceType,bodyParam,response);

}
</pre>
				      </ul>
                      <ul v-show="info.serviceTypeValue =='3'">
                        <li>{{info.serviceTypeText}} ，调用方式一</li>
                        <p class="leftmargin"> 简单模式，只支持简单参数调用</p>
                        <p class="leftmargin">参数:</p>
						<table class="table1">
							<thead>
								<tr>
									<th>参数名</th>
									<th>参数说明</th>
									<th class="center">是否必输</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td>SECRET_KEY</td>
									<td>用户授权码</td>
									<td class="center">是</td>
								</tr>
								<tr>
									<td>serviceId</td>
									<td>服务ID，见具体服务的serviceId，固定参数</td>
									<td class="center">是</td>
								</tr>
								<tr>
									<td>HashMap</td>
									<td>具体服务要求参数，见每一个服务输入参数</td>
									<td class="center">是</td>
								</tr>								
							</tbody>
						</table>
					    
<pre>
String SECRET_KEY = "blb0gwhaa8bShlh7hZgSgthGgNbHgQhc";
String serviceId = "17026075b25c48a48ebdfed9b561d5c1"; 

//实际服务要求的参数
HashMap urlParam = new HashMap&lt;String, String>();
urlParam.put("content","王二");

// 初始化一个UzpApi
UzpApi client  = new UzpApi(SECRET_KEY);

// 可选：设置网络连接参数
client.setConnectionTimeoutInMillis(2000);
client.setSocketTimeoutInMillis(60000);

//调用服务
JSONObject res = client.get(serviceId,urlParam);
System.out.println(res);
</pre>
                        <li>{{info.serviceTypeText}} ，调用方式二</li>
                        <p class="leftmargin"> 通用模式，任何情况都可以调用</p>
                        <p class="leftmargin">参数:</p>
						<table class="table1">
							<thead>
								<tr>
									<th>参数名</th>
									<th>参数说明</th>
									<th class="center">是否必输</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td>SECRET_KEY</td>
									<td>用户授权码</td>
									<td class="center">是</td>
								</tr>
								<tr>
									<td>serviceId</td>
									<td>服务ID，见具体服务的serviceId，固定参数</td>
									<td class="center">是</td>
								</tr>
								<tr>
									<td>HashMap</td>
									<td>具体服务要求参数，见每一个服务输入参数</td>
									<td class="center">是</td>
								</tr>								
							</tbody>
						</table>
					    
<pre>
String SECRET_KEY = "blb0gwhaa8bShlh7hZgSgthGgNbHgQhc";
String serviceId = "17026075b25c48a48ebdfed9b561d5c1";        

//实际服务要求的参数
HashMap bodyParam = new HashMap&lt;String, String>();
bodyParam.put("jsonData","[{\"name\":\"Mon\",\"value\":\"10\"},{\"name\":\"Tue\",\"value\":\"52\"},{\"name\":\"Wed\",\"value\":\"200\"},{\"name\":\"Thu\",\"value\":\"334\"},{\"name\":\"Fri\",\"value\":\"390\"},{\"name\":\"Sat\",\"value\":\"330\"},{\"name\":\"Sun\",\"value\":\"220\"}]");

// 初始化一个UzpApi
UzpApi client  = new UzpApi(SECRET_KEY);

// 可选：设置网络连接参数
client.setConnectionTimeoutInMillis(2000);
client.setSocketTimeoutInMillis(60000);

//调用服务
JSONObject res = client.invoke(serviceId,bodyParam);
System.out.println(res);
</pre>
                      </ul>
                    </div>
                  </el-tab-pane>
                  
                </el-tabs>
                </template>
       </div>
       <!-- 组合服务                        -->
       <div class="apiusemedth" v-else>
            <template>
                <el-tabs v-model="activeName" @tab-click="handleClick">
                  <el-tab-pane label="基本信息" name="first">
                    <div class="apiusemedthdetail">
                      <ul class="apiInterfaceddetaiDetail">
                       <li>serviceId：{{serviceList.serviceId}}</li>
                      </ul>
                      <ul class="apiInterfaceddetaiDetail" >
                        <li>输入参数：</li>
                        <div style="margin-top:10px;">                            
                           <table style="margin-top:10px;" >
                                <thead>
                                    <tr>
                                        <th>名称</th>
                                        <th>类型</th>
                                        <th>必输</th>
                                        <th>说明</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(inputParams,index) in serviceList.combinationInPut" :key="index">
                                        <td>{{inputParams.name}}</td>
                                        <td>{{inputParams.param_type}}</td>
                                        <td>{{inputParams.isRequired}}</td>
                                        <td>{{inputParams.describe}}</td>
                                    </tr>
                                </tbody>
                            </table>                        
                        </div>
                        <li>SDK调用返回参数格式：</li>                        
                        <pre>
{
  "time":请求毫秒数,
  "exception":异常描述，status=200,返回null
  "status":返回状态，200表示成功
  "results": 具体服务返回，原子服务返回json对象；
             布局中纯数据类型的原子服务调用返回的结果，服务返回jsonArray对象。
             当status不为200，返回null	 
    [{
      "sev_id":"",原子服务id
      "data":{}	原子服务返回参数，可参考具体的此原子调用返回参数		
    }] 
}
				        </pre>
                        <div style="margin-top:10px;" v-for="(outputParams,idx) in serviceList.combinationOutPut" :key="idx">
                            <p>原子服务 {{outputParams.service_id}} ：</p>
                            <table style="margin-top:10px;" > 
                                <thead>
                                    <tr >
                                        <th>名称</th>
                                        <th>类型</th>
                                        <th>必输</th>
                                        <th>说明</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(outputParam,sindex) in outputParams.service_out_param" :key="sindex">
                                        <td>{{outputParam.name}}</td>
                                        <td>{{outputParam.param_type}}</td>
                                        <td>{{outputParam.isRequired}}</td>
                                        <td>{{outputParam.describe}}</td>
                                    </tr>	
                                </tbody>
                            </table>
                       </div>
                      </ul>
                    </div>
                    <ul class="apiInterfaceddetaiDetail">
                        <!-- 拓扑搭建-->
                        <li>拓扑图：                        
                            <show-flow  :msg='serviceList' :serviceId='serviceList.serviceId' ></show-flow>
                        </li>
                        <!-- 页面布局 -->
                        <li>页面布局：                        
			                <show-layout  :msg='serviceList' :serviceId='serviceList.serviceId' :isRefresh='isRefresh'></show-layout>
                       </li>           
                      </ul>
                  
                    
                  </el-tab-pane>
                  <el-tab-pane label="使用须知" name="second">
                    <div class="demoLid useinfo" >
                        <ul>
                            <li>调用方式：API直接调用、SDK。</li>
                            <li>API直接调用分两部分：第一步，获取token；第二步调用实际接口。</li>
                            <li>本示例仅供参考，API直接获取token和调用服务的url为正确地址，服务调用示例不代表当前服务实际调用示例。</li>
                            <li>提供两个调用接口：form、invoke。</li>
                            <li>form接口通过response输出流，呈现出web组合结果；invoke则返回组合服务的布局中所包含的纯数据请求类型原子服务的JSONObject。</li>					
                            <li>用户如果想以web页面形式呈现输出结果，应当从前端发起请求到自己的后台，由后台再调用form接口</li>
                            <li>用户如果是需要拿到json数据，则应调用invoke接口。</li>
                            <li>支持协议：http</li>
                            <li>长度限制：请求头不大于64KB，请求体不大于4M</li>
                            <li>字符集：UTF-8</li>
                        </ul>
                    </div>                    
                  </el-tab-pane>
                  <el-tab-pane label="API调用" name="third">
                    <div class="demoLid" >
				      <ul>
					    <li>access_token获取</li>					
<pre>
var access_token = '';
$.ajax({
    type:"POST",
    url:'{{httprequest}}/uzp/oauth/token?client_secret=1232434584789898098&access_token='+access_token,
    data:$('#mainForm').serialize(),
    async:true,
    error:function(request){
        return;
    },
    success:function(data){
        access_token = data.results.access_token;
    }
});
</pre>
                    
                        
                        <li>form接口调用</li>					
<pre>
&lt;form id="mainForm" name="mainForm" method="post">
    &lt;input type="button" value="提交" id="agreementSub"> 
&lt;/form>

let serviceId = 'c7e39392b71046bd8fcb51ce2ca46944';
let param = "{'keyword':'神州泰岳'}";
$("#agreementSub").on("click",function(){
    var params = '{"accessToken":"'+access_token+''","serviceId":"'+serviceId+''",
    "param":"'+param+'"}';
    document.mainForm.action = '{{httprequest}}/uzp/combination/form?params='+params;
    document.mainForm.submit();
})
</pre>					
						<li>invoke接口调用</li>
<pre>
let serviceId = 'c7e39392b71046bd8fcb51ce2ca46944';
let param = "{'keyword':'神州泰岳'}";
var params = '{"accessToken":"'+access_token+''","serviceId":"'+serviceId+''","param":"'+param+'"}';
$.ajax({
    type:"POST",
    url:'{{httprequest}}/uzp/combination/invoke',
    data:params,
    contentType: "application/json",    
    error:function(request){
        return;
    },
    success:function(data){
        if(data != null && data.status == 200){
        let result = data.results;
        }
    }
});
</pre>
                       				
				      </ul>
                    </div>		      
                  </el-tab-pane>
                  <el-tab-pane label="SDK调用" name="fourth">
                    <div class="demoLid sdkdowload" >
				      <ul>                       				
					   <li>参数
						  <table>
							<thead>
								<tr>
									<th>参数名</th>
									<th>参数说明</th>
									<th class="center">是否必输</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td>SECRET_KEY</td>
									<td>用户授权码</td>
									<td class="center">是</td>
								</tr>
								<tr>
									<td>serviceId</td>
									<td>服务ID，见具体服务的serviceId，固定参数</td>
									<td class="center">是</td>
								</tr>								
								<tr>
									<td>HashMap</td>
									<td>具体服务要求参数，见每一个服务输入参数，type=1时，传一个实例化的map</td>
									<td class="center">是</td>
								</tr>
								<tr>
									<td>HttpServletResponse</td>
									<td>当页面或页面数据类型服务调用时需要response，通过response的流实现页面显示，invoke接口无此参数。</td>
									<td class="center">是</td>
								</tr>
							</tbody>
						  </table>
					    </li>
                        <li>示例代码</li>
<pre>
public void doServer(HttpServletRequest request,HttpServletResponse response) {
    String SECRET_KEY = "blb0gwhaa8bShlh7hZgSgthGgNbHgQhc";
    String serviceId = "17026075b25c48a48ebdfed9b561d5c1";        

    //实际服务要求的参数
HashMap bodyParam = new HashMap&lt;String, String>();
bodyParam.put("keyword","神州泰岳");

// 初始化一个UzpApi
UzpApi client  = new UzpApi(SECRET_KEY);

// 可选：设置网络连接参数
client.setConnectionTimeoutInMillis(2000);
client.setSocketTimeoutInMillis(60000);

//调用服务
client.invoke(serviceId,serviceType,bodyParam);

//form方式
//client.form(serviceId,serviceType,bodyParam,response);

}
</pre>
				      </ul>
                      
                    </div>
                  </el-tab-pane>
                  
                </el-tabs>
                
                </template> 
              	
       </div>
      </div>
      <div class="apidetailright">
           <ul>
                <li v-for="(list,index) in hotServiceList" :key="index">
                    <div class="bottomcontent">
                        <div class="bottomrightimg"><img v-lazy="imgSrc[index]"></div>
                        <div class="bottomlefttitle" v-bind:title="list.name" @click="godetail(list.id)">{{list.name.length>12?(list.name.substring(0,12)+"…"):list.name}}</div>
                        <div class="bottomlefttext" v-bind:title="list.service_remark">简介：{{list.service_remark.length>20?(list.service_remark.substring(0,20)+"…"):list.service_remark}} </div> 
                    </div>       
                </li>                     
             </ul>
      </div>
        
  </div>
  	<demand-list
		:is-show='isShow'
        :service-data="serviceList"
         @back='closeDemadnList'
		>
		</demand-list>
    <public-footer></public-footer>  
</div>
</template>
<script>
import demandList from './demandList.vue'
import header from '../publicComponent/openPlatformTopNav.vue'
import showFlow from './showFlow.vue'
import showLayout from './showLayout.vue'
import ApiClient from '../../../publicJs/ApiClient'
import LoadingBoxService from '../../../publicJs/LoadingBoxService'
import footer from '../publicComponent/footer.vue'
import appPublicJs from '../../common/public.js'
import userService from '../../../publicJs/userService.js'
import UtilService from '../../../publicJs/UtilService.js'
import publicPathConfig from '../../../publicJs/publicPathConfig.js'
export default {
  name: 'Test',
  data () {
    return {
      id: '',
      serviceList: {},
      bgimg: '',
      hotServiceList: [],
      imgSrc: [],
      serviceState: '',
      isShow: false, // 计费方案
      loginFlag: false,
      leftshow: true, // 是否有权限访问详情页面
      activeName: 'first',
      httprequest: '',
      serviceRemark: '',
      hoverRemark: '',
      isRefresh: 0,
      developName: ''// api提供方
    }
  },
  components: {
    showLayout, // 页面布局
    showFlow, // 拓扑图回显
    'public-header': header,
    'public-footer': footer,
    demandList
  },
  created () {
    this.id = this.$route.query.id
    this.tokenId = this.$route.query.tokenId || userService.getTokenId()
    if (this.tokenId !== 'null' && this.tokenId !== undefined && this.tokenId !== '1c14f665aa8643c28f899aa9b0efee56') {
      this.loginFlag = appPublicJs.checkLogin(this.tokenId)
    }
    this.httprequest = publicPathConfig.OPEN_PLATFORM_API_PAHT
  },
  mounted () {
    this.getInfo()// 获取数据
    this.getServiceInfo()// 获取精彩推荐
  },
  methods: {
    handleClick (tab, event) {
      console.log(tab, event)
    },
    getInfo () {
        // 获取数据方法
        var that = this
        var mydata = {
        service_id: this.id
      }
      that.activeName = 'first'
      LoadingBoxService.open('加载中...')
      ApiClient.get(('/developerApi/api/findServiceInfo'), mydata, function (data) {
        that.serviceList = data.results.data[0]
        that.bgimg = ApiClient.apiBaseUrl + '/itsmApi/attachment/show?imgPath=' + that.serviceList.img + '&token=' + ApiClient.token
        that.hoverRemark = that.serviceList.serviceRemark
        if (that.serviceList.serviceRemark.length > 300) {
          that.serviceRemark = (that.serviceList.serviceRemark).substring(0, 300) + '…'
        } else {
          that.serviceRemark = that.serviceList.serviceRemark
        }
        if (that.serviceList.belongType === 'PLATFORM') {
          that.developName = '平台'
        } else if (that.serviceList.belongType === 'PERSONAL') {
          that.developName = '个人'
        } else {
          that.developName = '企业'
        }
        that.serviceState = data.results.data[0].serviceEnabled
        //debugger
        console.info("that.serviceList="+that.serviceList);
        
        LoadingBoxService.close()
      })
    },
    getServiceInfo () {
      var that = this
      var mydata = {
        service_id: that.id
      }
      LoadingBoxService.open('加载中...')
      ApiClient.get('/itsmApi/recommend/findIndividuationServiceList', mydata, function (data) {
        LoadingBoxService.close()
        if (data.status === 200) {
          that.hotServiceList = data.results.data
          for (var i = 0; i < that.hotServiceList.length; i++) {
       //   that.bgimg = ApiClient.apiBaseUrl + apiToken.newApi('/itsmApi/attachment/show?imgPath=') + that.serviceList.bgImg + '&token=' + ApiClient.token
            that.imgSrc.push(ApiClient.apiBaseUrl + '/itsmApi/attachment/show?imgPath=' + that.hotServiceList[i].img + '&token=' + ApiClient.token)
          }
        } else if (data.status === 404) {
          that.leftshow = false
        }
      })
    },
    godetail (id) {
      this.id = id
      this.getInfo()// 获取数据
      this.getServiceInfo()// 获取精彩推荐
      this.$router.push({
        path: '/APIdetail',
        query: {
          id: id
        }
      })
    },
    closeDemadnList (flag) {
      this.isShow = false
    },
    packageChange () {
      if (this.loginFlag) {
        this.isShow = true
      } else {
        this.goto(0)
      }
    },
    goto (type) {
      var path = window.location.href
      path = UtilService.removeUrlItem(path, 'tokenId')
      this.$router.push({path: '/register', query: {type: type, source: encodeURIComponent(path)}})
    }
  }

}
</script>
<style lang="css" scoped>
    
    .publicContainer{
        overflow-y: auto
    }
   .apidetailmain{
        margin-top: 76px;
        width: 100%;
        /* height: 100%; */
        padding: 0 80px;
        margin-bottom: 20px;
    }
    .apidetailleft{
         width: 75%;
         height: 100%;
         float: left;
    }
    .apidetailleft .apibasicinfo{
         border: 1px #fafafa solid;
         width: 100%;
         height: 194px;
         float: left;
    }
     .apidetailleft .apiusemedth{
         border: 1px #fafafa solid;
         width: 100%;
         margin-top: 10px;
         float: left;
    }
    
    .apidetailright{
         border: 1px #fafafa solid;
         width: 24%;
         /* height: 100%; */
         float: left;
         margin-left: 1%
    }
    .apibasicinfo img{
        width: 120px;
        height: 110px;
        float: left;
        margin-left: 30px;
        margin-top: 40px;
    }
    .decrib{
       padding: 5px;
       margin-left: 190px;
       position: relative;
    }
    .decrib h1{
        font-size: 14px;
        font-weight: 700;
        display: block;
        margin-top: 15px;
        margin-bottom: 20px;
    }
    .describinfo {
        display: block;
        line-height: 20px;
        color: #757f8b;
        font-size: 12px;
        height: 95px;
    }
    .develop{
        margin-top: 13px;
        display: inline-block;
        color: #363636;
    }
    .applyNameRightBtn1 {
       cursor: pointer;
        width: 78px;
        height: 35px;
        font-size: 14px;
        color: #ffffff;
        line-height: 36px;
        border-radius: 2px;
        position: absolute;
        bottom: 10px;
        right: 35px;
        text-align: center;
        background: #68a0fe;
    }   
    .applyNameRightBtn1:hover {
        background-color: #68a0fe;
        color: #fff;
    }  
    .applyNameRightBtn {
         cursor: hand;
        width: 78px;
        height: 35px;
        font-size: 14px;
        color: #ffffff;
        line-height: 36px;
        border-radius: 2px;
        position: absolute;
        bottom: 10px;
        right: 35px;
        text-align: center;
        background: #fb6233;
    }
    .applyNameRightBtn:hover {
        background-color: #fb6233;
        color: #fff;
    }
    .apiusemedth .apititle{
        width: 100%;
        height: 50px;
        border-bottom: 1px #fafafa solid;
    }
   .apiusemedth  .apiusemedthfont{
        display: block;
        width: 95px;
        line-height: 50px;
        padding-left: 5px;
        border-bottom: 2px #2ca3ee solid;
        color: #2ca3ee;
        font-size: 14px;
   }
   .apiusemedthdetail{
       /* padding: 15px; */
       width: 100%;
       height: 100%;
   }
   .apiusemedthdetail pre{
       margin-top: 10px;
       background-color: #fbfbfb;
       border-color: #f1f1f1;
       color: #717171;
       margin-left: 0px;
       margin-right: 18px;
   }
   .apiInterface{
       font-size: 12px;
       color: #333333;
       line-height: 26px;
   }
   .apiInterfaceddetaiDetail{
        list-style: disc;
        color: #333333;
        margin-left: 45px;
        line-height: 24px;
        /* margin-top: 10px; */
   }
   table{
		margin: 20px 0;
		width: 98%;
		border: 1px solid #ebebeb;
		border-collapse: collapse;
	}
	thead {
		background-color: #fbfbfb;
        color: #333332;
	}
	thead th{
		height: 35px;
		line-height: 35px;
		font-size: 12px;
	}
	thead tr th{
        padding-left: 10px;
         width: 57px;
	}
	tbody tr td{
		font-size: 12px;
		height: 35px;
        line-height: 35px;
        color: #7f838f;
	}
	tbody tr td{
		padding-left: 10px;
    }
    pre{
        margin-top: 10px;
        background-color: #fbfbfb;
        border-color: #f1f1f1;
        color: #717171;
        margin-left: 36px;
        margin-right: 26px;
    }
    .apidetailright ul li {
        position: relative;
        padding-left: 10px;
        padding-top: 10px;
        height: 77px;
    }
    .apidetailright img {
       width: 66px;
       height: 66px;
       /* border: 1px solid #f1f1f1; */
    }
    .apidetailright li div {
        position: absolute;
    }
    .apidetailright li{
        position: relative;
        padding-left: 10px;
        padding-top: 10px;
        height: 66px;
    }
    .apidetailright .bottomlefttitle{
        margin-left: 83px;
        font-size: 14px;
        margin-top: -3px;
    }
     .apidetailright .bottomlefttitle:hover{
       color: #2ca3ee;
       cursor: pointer;
    }
   .apidetailright .bottomlefttext{
        margin-left: 83px;
        font-size: 12px;
        margin-top: 21px;
        color: #666;
    }
    .apidetailright .bottomcontent{
        width: 94%;
        height: 70px;
        /* border-bottom: 1px dashed #f1f1f1; */
    }
    .apidetailright li:last-child div{
        border-bottom: 0px;
    }
    .clear::after {
        content: ".";
        clear: both;
        display: block;
        overflow: hidden;
        font-size: 0;
        height: 0;
    }
    .clear {
        zoom: 1;
    }
    .noPermission{
        text-align: center;
        margin-top: 154px;
        font-size: 14px;
    }
    .apiusemedth .demoLid ul li{
        font-size: 12px
    }
    .sdkdowload pre{
        margin-left: 43px;
        margin-right: 18px;
    }
    .sdkdowload .table1{
        margin-left: 43px;
        margin-right: 18px;
        width: 93.5%;
    }
    .sdkdowload .leftmargin{
        margin-left: 43px
    }
    .useinfo ul li {
        font-size: 12px;
        line-height: 24px;
        margin-bottom: 0px;
        margin-top: 0px
    }
     .useinfo  {
        margin-right: 20px
    }
</style>
