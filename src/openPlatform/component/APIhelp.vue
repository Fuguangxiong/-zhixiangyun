
<template>
<div class="publicContainer openPlatform">
<public-header ></public-header>
	<div id="APIhelp" class="apiHelpMainBox">

		<div class="outer-container">
			<div id="leftBox" class="leftBox">
				<span>.</span><span class="bg_color"></span>
			</div>	
		</div>
		<div id="contentBox" class="contentBox">
			<div class="textdowload" title="文档下载"><a :href="apiBaseUrl + '/developerApi/apidoc/download'"> <i class="iconfont icon-daoru"></i></a></div>
			<div class="demoLid" id="1">
				<span class="firsttitle">1.</span><h1>接口调用</h1>			
			</div>
			<div class="demoLid" id="1.1">
				<span class="secondtitle">1.1</span><h2>简介</h2>
				<ul>
					<li>目前仅支持原子服务调用。</li>
					<li>调用方式：API直接调用、SDK。</li>
					<li>实现接口调用分两部分：第一步，获取token；第二步调用实际接口。</li>
					<li>原子服务调用时需要指定其type的具体值，一个原子服务可能有多个type值，1表示页面类型，访问时不需要输入参数，结果为跳转到一个web页面；2表示页面数据类型，访问时需要输入参数，结果同样为跳转到一个web页面；3表示纯数据类型，可输入参数，也可不需要参数，结果为返回一个JSONObject。</li>					
					<li>组合服务调用提供两套接口：form接口和invoke接口，form跳转到一个web页面进行服务调用结果呈现，invoke为纯代码调用，并且只返回页面布局中、纯数据调用类型原子服务的JSON数据结果。</li>
					<li>具体服务调用相关说明在文档后半部分，这块介绍了每个服务的支持的GET/POST请求类型、请求参数、返回类型等。</li>
				</ul>
			</div>
			<div class="demoLid" id="1.2">
				<span class="secondtitle">1.2</span><h2>支持协议</h2>
				<span class="secondContent" >http</span>
			</div>
			<div class="demoLid" id="1.3">
				<span class="secondtitle">1.3</span><h2>长度限制</h2>
				<span class="secondContent">请求头不大于64KB，请求体不大于4M</span>
			</div>
			<div class="demoLid" id="1.4">
				<span class="secondtitle">1.4</span><h2>字符集</h2>
				<span class="secondContent">UTF-8</span>
			</div>
		
			<div class="demoLid" id="2">
				<span class="firsttitle">2.</span><h1>API直接调用</h1>				
			</div>
			<div class="demoLid" id="2.1">
				<span class="secondtitle">2.1</span><h2>access_token获取</h2>				
				<ul>
					<li>
						url：{{httprequest}}/uzp/oauth/token
					</li>
					<li>
						参数：client_secret 授权码；access_token 上次获取的access_token，首次传值为空
					</li>
					<li>
						请求类型：post、get
					</li>
					<li>
						返回参数：					
						<pre>
{
  "time":913,
  "exception":null,
  "status":200,
  "results":{
      "access_token":"blb0gwhaa8bShlh7hZgSgthGgNbHgQhcea09dc8d0c6445dcbd6c77488879a0f3",
      "success":true,
      "expires_in":86400
  }
}
					</pre>
				</li>										
				<li>
					示例代码:
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
					</li>
				</ul>
			</div>
			<div class="demoLid" id="2.2">
				<span class="secondtitle">2.2</span><h2>原子服务调用</h2>
				<ul>
					<li>
						<p>页面及页面类型url：{{httprequest}}/itsmApi/se/web</p>
						<p>纯数据url：{{httprequest}}/itsmApi/se/invoke</p>
						<p>纯数据，支持表单提交url：{{httprequest}}/itsmApi/se/form</p>
					</li>
					<li>
						请求参数：param json字符串
					</li>
					<li>
						请求类型：见具体服务支持的类型
					</li>
					<li>
						纯数据返回参数：					
						<pre>
{
  "time":请求毫秒数,
  "exception":异常描述，status=200,返回null
  "status":返回状态，200表示成功
  "results": 具体服务返回json对象，当status不为200，返回null	  
}
						</pre>
					</li>
					<li>
						示例代码，页面及页面数据类型:
						<pre>
&lt;form id="mainForm" name="mainForm" method="post">
    &lt;input type="button" value="提交" id="agreementSub"> 
&lt;/form>

let serviceId = 'c7e39392b71046bd8fcb51ce2ca46944';
let type = '2';
let param = "{'keyword':'神州泰岳'}";
$("#agreementSub").on("click",function(){
    var params = '{"accessToken":"'+access_token+''","serviceId":"'+serviceId+''","type":"'+type+'","param":"'+param+'"}';
    document.mainForm.action = '{{httprequest}}/itsmApi/se/web?params='+params;
    document.mainForm.submit();
})
						</pre>
					</li>
					<li>
						示例代码，纯数据类型:
						<pre>
let serviceId = 'c7e39392b71046bd8fcb51ce2ca46944';
let type = '2';
let method = 'post';
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
					</li>
				</ul>
			</div>
			<div class="demoLid" id="2.3">
				<span class="secondtitle">2.3</span><h2>组合服务调用</h2>
				<ul>
					<li>
						<p>form接口url：{{httprequest}}/uzp/combination/form</p>
						<p>invoke接口url：{{httprequest}}/uzp/combination/invoke</p>						
					</li>
					<li>
						请求参数：开始节点需要的参数，param json字符串
					</li>
					<li>
						请求类型：见具体服务支持的类型
					</li>
					<li>
						invoke接口返回参数：					
						<pre>
{
  "time":请求毫秒数,
  "exception":异常描述，status=200,返回null
  "status":返回状态，200表示成功
  "results": 布局中纯数据类型的原子服务调用返回的结果，服务返回jsonArray对象，当status不为200，返回null	
		[{
			"sev_id":"",原子服务id
			"data":{}	原子服务返回参数，可参考具体的此原子调用返回参数		
		}]
}
						</pre>
					</li>
					<li>
						示例代码，form调用:
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
					</li>
					<li>
						示例代码，invoke调用:
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
					</li>
				</ul>
			</div>
			<div class="demoLid" id="3">
				<span class="firsttitle">3.</span><h1>SDK服务调用</h1>
				
				<pre class="textmargin">
{
  "time":请求毫秒数,
  "exception":异常描述，status=200,返回null
  "status":返回状态，200表示成功
  "results": 具体服务返回，原子服务返回json对象；布局中纯数据类型的原子服务调用返回的结果，服务返回jsonArray对象。当status不为200，返回null	 
    [{
      "sev_id":"",原子服务id
      "data":{}	原子服务返回参数，可参考具体的此原子调用返回参数		
    }] 
}
				</pre>				
			</div>
			<div class="demoLid" id="3.1">
				<span class="secondtitle">3.1</span><h2>页面及页面数据调用</h2>
				<ul>					
					<li>
						参数:
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
					<li>
						<p>示例代码:</p>
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
					</li>					
				</ul>
			</div>
			<div class="demoLid" id="3.2">
				<span class="secondtitle">3.2</span><h2>纯数据调用方式一</h2>
				<p class="textmargin"> 简单模式，只支持简单参数调用</p>
				<ul>
					<li>
						参数:
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
									<td>具体服务要求参数，见每一个服务输入参数</td>
									<td class="center">是</td>
								</tr>								
							</tbody>
						</table>
					</li>
					<li>
						<p>示例代码:</p>
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
					</li>					
				</ul>
			</div>
			<div class="demoLid" id="3.3">
				<span class="secondtitle">3.3</span><h2>纯数据调用方式二</h2>
				<p class="textmargin"> 通用模式，任何情况都可以调用</p>
				<ul>					
					<li>
						参数:
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
									<td>具体服务要求参数，见每一个服务输入参数</td>
									<td class="center">是</td>
								</tr>								
							</tbody>
						</table>
					</li>
					<li>
						<p>示例代码:</p>
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
					</li>					
				</ul>
			</div>
			<div class="demoLid" id="3.4">
				<span class="secondtitle">3.4</span><h2>组合服务调用</h2>				
				<ul>					
					<li>
						参数:
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
					<li>
						<p>示例代码:</p>
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
					</li>					
				</ul>
			</div>

			<div class="demoLid" id="4">
				<span class="firsttitle">4.</span><h3>原子服务</h3>
			</div>
			<div class="demoLid" v-for="(item,index) in tableData" :key="index" :id="'4.'+(parseInt(index)+1)">
				<span class="secondtitle">4.{{index+1}}</span><h4>{{item.serviceName}}</h4>
				<ul class="serviceInfo">
					<li>serviceID：{{item.serviceId}}</li>
			    	<li> type支持类型：</li>
					<table class="type textmargin">
						<tr v-for="(service,sindex) in item.serviceDetailsInfo" :key = "sindex">
							<td class="td1">{{service.serviceTypeValue}}</td>
							<td class="td2">{{service.serviceTypeText}}</td>
						</tr>
					</table>
				</ul>
				
				<!-- 请求参数详情 -->
				<div v-for="(service,sindex) in item.serviceDetailsInfo" :key = "sindex">
					<!-- 输入参数说明 -->
					<div v-show="service.serviceInParam !=''">
						<ul>
							<li>type = {{service.serviceTypeValue}} </li>
							<div style="margin-bottom: 0px; ">
								<p class="textmargin">输入参数：</p>
								<table class="textmargin tablewidth">
									<thead>
										<tr>
											<th>参数名</th>
											<th>参数说明</th>
											<th class="center">是否必输</th>
										</tr>
									</thead> 
									<tbody>
										<tr v-for="(serviceInParams,sindex1) in service.serviceInParam" :key = "sindex1">
											<td>{{serviceInParams.name}}</td>
											<td>{{serviceInParams.describe}}</td>
											<td class="center">{{serviceInParams.isRequired}}</td>
										</tr>
									</tbody>
								</table>
							</div>
							<!-- 输出参数说明 -->
							<div v-show="service.serviceOutParam !=''">
								<p class="textmargin">输出说明:</p>
								<table class="textmargin tablewidth">
									<thead> 
										<tr>
											<th>字段名</th>
											<th>类型</th>
											<th>字段说明</th>
											<th>上级字段</th>
										</tr>
									</thead>
									<tbody>
										<tr v-for="(serviceOutParams,sindex1) in service.serviceOutParam" :key = "sindex1">
											<td>{{serviceOutParams.name}}</td>
											<td>{{serviceOutParams.type}}</td>
											<td>{{serviceOutParams.describe}}</td>
											<td>results.data</td>
										</tr>
									</tbody>
								</table>
							</div>						
						</ul>												
					</div>					
				</div>				
			</div>

			<div class="demoLid" id="5">
				<span class="firsttitle">5.</span><h5>组合服务</h5>
			</div>
			<div class="demoLid" v-for="(item,index) in combinationData" :key="item.serviceId" :id="'5.'+(parseInt(index)+1)">
				<span class="secondtitle">5.{{index+1}}</span><h6>{{item.serviceName}}</h6>
				<ul class="serviceInfo">
					<li>serviceID：{{item.serviceId}}</li>
			    	
				</ul>
				
				<!-- 请求参数详情 -->
				
					<!-- 输入参数说明 -->
					<div v-show="item.combinationInPut !=''">
						<ul>
							<li>输入参数：</li>
							<div style="margin-bottom: 0px; ">								
								<table class="textmargin tablewidth">
									<thead>
										<tr>
											<th>参数名</th>
											<th>参数说明</th>
											<th class="center">是否必输</th>
										</tr>
									</thead> 
									<tbody>
										<tr v-for="(serviceInParam,sindex1) in item.combinationInPut" :key = "sindex1">
											<td>{{serviceInParam.name}}</td>
											<td>{{serviceInParam.describe}}</td>
											<td class="center">{{serviceInParam.isRequired}}</td>
										</tr>
									</tbody>
								</table>
							</div>
							<!-- 输出参数说明 -->
							<li>输出说明：</li>
							<div v-show="item.serviceOutParam !=''">
								
								<table class="textmargin tablewidth">
									<thead> 
										<tr>
											<th>字段名</th>
											<th>类型</th>
											<th>字段说明</th>
											<th>上级字段</th>
										</tr>
									</thead>
									<tbody v-for="(sevoutput,sindex1) in item.combinationOutPut" :key = "sindex1">
										<tr v-for="(outParam,idx) in sevoutput.service_out_param" :key = "idx">
											<td>{{outParam.name}}</td>
											<td>{{outParam.param_type}}</td>
											<td>{{outParam.describe}}</td>
											<td>results[index].data</td>
										</tr>
									</tbody>
								</table>
							</div>						
						</ul>												
					</div>					
								
			</div>
			<public-bottom></public-bottom>
		</div>			
	</div>	
</div>
</template>

<script >
// import $ from 'jQuery'
import apiClient from '../../publicJs/ApiClient.js'
import env from '../../../config/envConfig'
import header from '../component/publicComponent/openPlatformTopNav.vue'
import bottomComponent from '../../publicComponent/publicBottomComponent.vue'
import publicPathConfig from '../../publicJs/publicPathConfig.js'
import userService from '../../publicJs/userService.js'
export default{
  data () {
    return {
      tableData: [],
	  httprequest: '',
	  tokenId: '',
	  apiBaseUrl: '',
	  combinationData: []
    }
  },
  created () {
    this.getServiceInfos()
    this.httprequest = publicPathConfig.OPEN_PLATFORM_API_PAHT
    this.apiBaseUrl = apiClient.apiBaseUrl
  },
  components: {
    'public-header': header,
    'public-bottom': bottomComponent
  },
  mounted () {
    this.getLeftMenu()
    var that = this
    var bd_height = new Array()
// 滚动条事件
    $(window).scroll(function () {
// 当前滚动条的高度
      var sl_this = $(this).height()
// 滚动条上放的高度
      var sl_top = $(this).scrollTop()
// 出现的高度
      var show_ht = sl_top + sl_this / 2
// 获取楼层的层数，0层开始
      var key = 0

// 此处可以根据自己的情况进行更改
// for，each，for in都可以 建议改为for循环
// console.log(bd_height);

      bd_height.map(function (value, index) {
// 阶梯判断[这一步很重要]

        if (sl_top >= value) {
          key = index
        }
      })
// 修改楼梯的样式
      $('dd').eq(key).addClass('active').siblings().removeClass('active')
    })
/* 点击跳转到楼层 */
    $('dd').click(function () {
      var key = $(this).index()
      $(this).addClass('active').siblings().removeClass('active')
// 跳转建筑
	  that.change_building(key)
    })

	// 1 2 3 一级菜单控制二级菜单显示隐藏
    function controlItem (item, cateItem) {
      $('#' + item).on('click', function () {
	  $('.' + cateItem).toggle(700)
	  let flag = $('#' + item + ' .iconfont').hasClass('icon-arrow-down-copy')
	  if (flag) {
		  $('#' + item + ' .iconfont').removeClass('icon-arrow-down-copy').addClass('icon-arrow-down')
	  } else {
		  $('#' + item + ' .iconfont').removeClass('icon-arrow-down').addClass('icon-arrow-down-copy')
	  }
      })
    }
    controlItem('item1', 'cateItem1')
    controlItem('item2', 'cateItem2')
    controlItem('item3', 'cateItem3')

	// 点击左侧菜单 hash值不变
    $('#leftBox a').on('click', function () {
	  setTimeout(function () {
		  location.hash = '#/APIhelp'
	  }, 0)
    })

// 查询所有服务
  },
  methods: {
// 获取菜单
    getLeftMenu () {
      var that = this
      var bd_height = new Array()
// 记忆变量
      var old_key = 0
/* 加载完成执行 */
      var h1List = new Array(), h2List = new Array()
      var i1 = 0, i2 = 0, n1 = 0, n2 = 0, n3 = -1
	  var temp = '<dl>'
    //   temp += '<dd class=\'cate-item1\'></dd>'// 浏览器中，第一行被隐藏了，所以加一行空的
	  var cateList = $('#contentBox').html().match(/(<h[1-2][^>]*>.*?<\/h[1-2]>)/ig)
      for (var i = 0; i < cateList.length; i++) {
        if (/(<h1[^>]*>.*?<\/h1>)/ig.test(cateList[i])) {
          n1++
		  n2 = 0
		  n3 = 0
          temp += '<dd id=item' + n1 + ' class="cate-item1"><span>' + n1 + '.</span><a href="#' + n1 + '">' + cateList[i].replace(/<[^>].*?>/g, '') + '</a><i class="iconfont icon-arrow-down-copy" style="float:right;"></i></dd>'
          h1List[i1] = n1
		  i1++
        } else {
		  n2++
		  n3++
          var onelist = cateList[i].replace(/<[^>].*?>/g, '')
          if (onelist.length > 8) {
            onelist = cateList[i].replace(/<[^>].*?>/g, '').substring(0, 8) + '…'
		  }
          temp += '<dd name=' + n1 + '.' + n2 + ' class="cate-item2 cateItem' + n1 + '" title=' + cateList[i].replace(/<[^>].*?>/g, '') + '><span>' + n1 + '.' + n2 + '</span><a href="#' + n1 + '.' + n3 + '">' + onelist + '</a></dd>'
          h2List[i2] = n1 + '_' + n2
		  i2++
        }
	  }
      temp += '</dl>'
      $('#leftBox').append(temp)
      $('#contentBox .demoLid').each(function () {
        bd_height[$(this).index()] = $(this).offset().top
      })
    },
    getLeftMenuFour () {
      var that = this
      var bd_height = new Array()
// 记忆变量
      var old_key = 0
/* 加载完成执行 */
      var h1List = new Array(), h2List = new Array()
      var i1 = 0, i2 = 0, n1 = 3, n2 = 0, n3 = -1
      var temp = '<dl>'
    //   temp += '<dd class=\'cate-item1\'></dd>'// 浏览器中，第一行被隐藏了，所以加一行空的
      var cateList = $('#contentBox').html().match(/(<h[3-4][^>]*>.*?<\/h[3-4]>)/ig)
      for (var i = 0; i < cateList.length; i++) {
        if (/(<h3[^>]*>.*?<\/h3>)/ig.test(cateList[i])) {
          n1++
		  n2 = 0
		  n3 = 0
          temp += '<dd id=item' + n1 + ' class="cate-item1"><span>' + n1 + '.</span><a href="#' + n1 + '">' + cateList[i].replace(/<[^>].*?>/g, '') + '</a><i class="iconfont icon-arrow-down" style="float:right;"></i></dd>'
          h1List[i1] = n1
          i1++
        } else {
		  n2++
		  n3++
          var onelist = cateList[i].replace(/<[^>].*?>/g, '')
          if (onelist.length > 8) {
            onelist = cateList[i].replace(/<[^>].*?>/g, '').substring(0, 8) + '…'
		  }
          temp += '<dd name=' + n1 + '.' + n2 + ' class="cate-item2 cateItem' + n1 + '" title=' + cateList[i].replace(/<[^>].*?>/g, '') + '><span>' + n1 + '.' + n2 + '</span><a href="#' + n1 + '.' + n3 + '">' + onelist + '</a></dd>'
          h2List[i2] = n1 + '_' + n2
          i2++
        }
      }
      temp += '</dl>'
      $('#leftBox').append(temp)
      $('#contentBox .demoLid').each(function () {
        bd_height[$(this).index()] = $(this).offset().top
      })
    },
    getLeftMenuFive () {
      var that = this
      var bd_height = new Array()
// 记忆变量
      var old_key = 0
/* 加载完成执行 */
      var h1List = new Array(), h2List = new Array()
      var i1 = 0, i2 = 0, n1 = 4, n2 = 0, n3 = -1
      var temp = '<dl>'
    //   temp += '<dd class=\'cate-item1\'></dd>'// 浏览器中，第一行被隐藏了，所以加一行空的
      var cateList = $('#contentBox').html().match(/(<h[5-6][^>]*>.*?<\/h[5-6]>)/ig)
      for (var i = 0; i < cateList.length; i++) {
        if (/(<h5[^>]*>.*?<\/h5>)/ig.test(cateList[i])) {
          n1++
		  n2 = 0
		  n3 = 0
          temp += '<dd id=item' + n1 + ' class="cate-item1"><span>' + n1 + '.</span><a href="#' + n1 + '">' + cateList[i].replace(/<[^>].*?>/g, '') + '</a><i class="iconfont icon-arrow-down" style="float:right;"></i></dd>'
          h1List[i1] = n1
          i1++
        } else {
		  n2++
		  n3++
          var onelist = cateList[i].replace(/<[^>].*?>/g, '')
          if (onelist.length > 8) {
            onelist = cateList[i].replace(/<[^>].*?>/g, '').substring(0, 8) + '…'
		  }
          temp += '<dd name=' + n1 + '.' + n2 + ' class="cate-item2 cateItem' + n1 + '" title=' + cateList[i].replace(/<[^>].*?>/g, '') + '><span>' + n1 + '.' + n2 + '</span><a href="#' + n1 + '.' + n3 + '">' + onelist + '</a></dd>'
          h2List[i2] = n1 + '_' + n2
          i2++
        }
      }
      temp += '</dl>'
      $('#leftBox').append(temp)
      $('#contentBox .demoLid').each(function () {
        bd_height[$(this).index()] = $(this).offset().top
      })
    },
/* 修改楼梯的函数 */
    change_step (key) {
// 获取当前的背景块定位
      var bg_color = $('.bg_color')
      var old_top = bg_color.position().top
// 获取目标位置的高度
      var ul_ftop = $('dl').offset().top
      var li_ftop = $('dd').eq(key).offset().top
      var target_top = li_ftop - ul_ftop

// console.info(ul_ftop+"----"+li_ftop+"--"+target_top);
// 开启动画
      bg_color.animate({top: target_top}, 'fast')
    },
/* 修改建筑的函数 */
    change_building (key) {
// 当前滚动条的高度
      var sl_this = $(window).height()
// 获取目标的位置
      var target = $('#contentBox .demoLid').eq(key).offset().top

// 开启动画
      $('html,body').animate({scrollTop: target})
    },
	// 4 5 一级菜单控制二级菜单显示隐藏
    controlFF (item, cateItem) {
      $('#' + item).on('click', function () {
        $('.' + cateItem).toggle(700)
        let flag = $('#' + item + ' .iconfont').hasClass('icon-arrow-down')
	  if (flag) {
		  $('#' + item + ' .iconfont').removeClass('icon-arrow-down').addClass('icon-arrow-down-copy')
	  } else {
		  $('#' + item + ' .iconfont').removeClass('icon-arrow-down-copy').addClass('icon-arrow-down')
	  }
      })
    },
// 获取所有原子服务
    getServiceInfos () {
      let vm = this
	  vm.tokenId = vm.$route.query.tokenId || userService.getTokenId()
      if (vm.tokenId !== null) {
        var params = {
          token: vm.tokenId
        }
	  } else {
		 var params = {
 		}
	  }
      apiClient.get('developerApi/api/findServiceInfoLists', params, function (data) {
        if (data.status === 200) {
		  vm.tableData = data.results.data
		  console.log('原子服务', data)
        }
      }).then((response) => {
        this.$nextTick(function () {
          vm.getLeftMenuFour()
          vm.controlFF('item4', 'cateItem4')
		  })
		  // 组合服务信息
        apiClient.get('/developerApi/api/findServiceGroupInfoLists', params, function (data) {
          if (data.status === 200) {
            vm.combinationData = data.results.data
		  console.log('组合服务', data)
          }
        }).then((response) => {
          this.$nextTick(function () {
            vm.getLeftMenuFive()
            vm.controlFF('item5', 'cateItem5')
          })
        })
      })
    },
    downloadApidoc () {
      window.open(env.API_SERVER + 'developerApi/apidoc/download?token=' + apiClient.token)
    },
    downloadApijar () {
      window.open(env.API_SERVER + 'developerApi/apidoc/downloadsdk?token=' + apiClient.token)
    }
  }
}
</script>
<style>
	.apiHelpMainBox .leftBox{
		margin-top: 66px;
		float: left;
		position: fixed;
		top: 0;
		bottom: 0;
		box-shadow:0px 0px 10px #999999;
		width: 200px;
		overflow-x: scroll;
 		overflow-y: scroll;
	}
     .apiHelpMainBox .leftBox dl{
	 	width: 200px;
	}
	.apiHelpMainBox .leftBox::-webkit-scrollbar {
	 	display: none;
	}
	.apiHelpMainBox .cate-item2{
		width: 200px;
		height: 40px;
		padding-left: 50px;
		line-height: 40px;
		cursor: pointer;
	}
	.apiHelpMainBox .cateItem4 {
		display: none;
	}
	.apiHelpMainBox .cateItem5 {
		display: none;
	}
	.apiHelpMainBox .cate-item2:hover,.cate-item1:hover{
		background-color: #f8f8f8;
	}
	.apiHelpMainBox .cate-item1{
		width: 200px;
		height: 40px;
		line-height: 40px;
		padding:0 30px;
		cursor: pointer;
		font-size: 14px;
		font-weight: 700;
	}
	.apiHelpMainBox  .cate-item1 span,.cate-item1 a{
		font-size: 14px;
		font-weight: 700;
		line-height: 40px;
		color: #000;
		margin-right: 5px;
	}
	.apiHelpMainBox .cate-item2 span{
		margin-right: 5px;
	}
	.apiHelpMainBox .active{
		background-color: #f8f8f8;
	}
	a:hover, a:visited, a:link, a:active {
	color: #000;
	text-decoration: none; 
}
	.openPlatform{
		padding-top: 76px;
	}
	.apiHelpMainBox{
		position: relative;
		overflow-y: auto;
		width: 100%;
		height: 100%;
	}
	.contentBox{
		position: absolute;
		left: 220px;
		/* top:20px; */
		right: 40px;
	}
	.contentBox .demoLid{
		width: 100%;
	}
	.contentBox div:nth-last-child(2){
		margin-bottom: 50px;
	}
	.outer-container {
		overflow: hidden;
		width: 200px;
	}

	.apiHelpMainBox h1,h3,h5{
		font-size: 20px;
		margin-top: 20px;
		margin-bottom: 15px;
		display: inline-block;
	}
	.apiHelpMainBox h2,h4,h6{
		font-size: 18px;
		margin-left: 15px;
		margin-bottom: 5px;
		display: inline-block;
	}
	.apiHelpMainBox p{
		font-size: 14px;
		/* margin-bottom:10px; */
		line-height: 30px;
		
	}
	.demoLid ul li{
		list-style: disc;
		margin-left: 45px;
		font-size: 14px;
		margin-top: 5px;
		margin-bottom: 10px;
	}
	.apiHelpMainBox table{
		margin: 5px 0;
		width: 100%;
		border: 1px solid #ebebeb;
		border-collapse: collapse;
	}
	.apiHelpMainBox thead {
		background-color: #e6f2fd;
		color: #666;
	}
	.apiHelpMainBox thead th{
		height: 40px;
		line-height: 40px;
		font-size: 14px;
		font-weight: 400;
		border-right: 1px solid #ebebeb;
	}
	.apiHelpMainBox thead tr th{
		padding-left: 10px;
	}
	.apiHelpMainBox tbody tr td{
		font-size: 14px;
		height: 40px;
		line-height: 40px;
		border-right: 1px solid #ebebeb;
	}
	.apiHelpMainBox tbody tr td{
		padding-left: 10px;
	}
	.apiHelpMainBox tbody tr:nth-child(even){
		background: #f8f8f8;
	}
	.apiHelpMainBox pre{
		font-size: 14px;
		margin:0 0 10px;
		text-align: left;
		color: #fff;
		background-color: #000;
		margin-top: 10px;
	}
	.apiHelpMainBox .td1{
		width: 30px !important;
		height: 40px;
		border-right: 1px #f8f8f8 solid;
		padding-left: 10px;
		border-bottom: 1px #f8f8f8 solid;
	}
	.apiHelpMainBox .td2{
		width: 30px !important;
		height: 40px;
		border-right: 1px #f8f8f8 solid;
		padding-left: 10px;
	    border-bottom: 1px #f8f8f8 solid;
	}
	.apiHelpMainBox .type{
		width: 50%;
	}
	.apiHelpMainBox .center{
		text-align: center;
		padding-right: 10px;
	}
	.apiHelpMainBox .textmargin{
		margin-left: 40px;
	}
	.apiHelpMainBox .secondtitle{
		margin-right: -10px;
		font-size: 18px;
		margin-left: 5px;
	}
	.apiHelpMainBox .secondContent{
		margin-top: 10px;
		margin-left: 40px;
		display:block;
		height: 27px;
		font-size: 14px;
	}
	.apiHelpMainBox .firsttitle{
		margin-right: 4px;
		font-size: 20px;
	}
	.apiHelpMainBox .namemargin{
		margin-right: 4px;
	}
	.apiHelpMainBox .demoLid .tablewidth{
		width: 96%;
	}
	.apiHelpMainBox .serviceInfo{
		margin-top: 10px;
	}
	.textdowload{
		position: fixed;
		top: 533px;
		left: 1310px;
		background-color: #5ba9f1;
		padding: 5px;
		border-radius: 5px
	}
	.icon-daoru{
		color: #fff;
	}
    .textdowload:hover{
		background-color: #168bf1;
	}
</style>
