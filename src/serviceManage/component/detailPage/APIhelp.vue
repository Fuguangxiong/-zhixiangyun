<template>
	<div id="APIhelp" class="mainBox">
		<div class="outer-container">
			<div id="leftBox" class="leftBox">
				<span class="bg_color"></span>
			</div>	
		</div>
		<div id="contentBox" class="contentBox">
			<div class="demoLid">
				<h1>接口调用</h1>
				
			</div>
			<div class="demoLid">
				<h2>接口说明</h2>
				<ul>
					<li>实现接口调用分两部分：第一步，获取token；第二步调用实际接口。</li>
					<li>原子服务调用时需要指定其type的具体值，一个原子服务可能有多个type值，1表示页面类型，访问时不需要输入参数，结果为跳转到一个web页面；2表示页面数据类型，访问时需要输入参数，结果同样为跳转到一个web页面；3表示纯数据类型，可输入参数，也可不需要参数，结果为返回一个JSONObject。</li>
					<li>本接口调用目前仅支持原子服务调用</li>
				</ul>
			</div>
			<div class="demoLid">
				<h2>字符集</h2>
				<p>UTF-8</p>
			</div>
			<div class="demoLid">
			<h2>获取token</h2>
				<ul>
					<li>
						token为用户登录智享云平台分配的有效访问权限的字符串。
					</li>
					<li>
						请求token地址：http://is-cloud.cn/manager/priviapi/login/loginUser
					</li>
					<li>
						请求类型：post
					</li>
					<li>
						请求格式：json
					</li>
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
									<td>name</td>
									<td>智享云平台用户名</td>
									<td class="center">是</td>
								</tr>
								<tr>
									<td>password</td>
									<td>密码</td>
									<td class="center">是</td>
								</tr>
							</tbody>
						</table>
					</li>
					<li>
						返回格式：json
					</li>
					<li>
						返回数据:
						<table>
							<thead>
								<tr>
									<th>参数名</th>
									<th>参数说明</th>
									<th>上级字段</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td>status</td>
									<td>返回状态</td>
									<td></td>
								</tr>
								<tr>
									<td>data</td>
									<td>返回的数据对象</td>
									<td></td>
								</tr>
								<tr>
									<td>authtoken</td>
									<td>token字符串</td>
									<td>data</td>
								</tr>
							</tbody>
						</table>
					</li>
					<li>
						<p>示例代码:</p>
						<pre>
String tokenUrl = "http://is-cloud.cn/manager/priviapi/login/loginUser";
String username = "用户名";
String password = "密码";
HttpClientUtil client = new HttpClientUtil();
JSONObject toeknParam = new JSONObject();
toeknParam.put("name", username);
toeknParam.put("password", password);
JSONObject tokenResult = client.httpPost(tokenUrl, toeknParam, false);
if(tokenResult !=null && tokenResult.get("status").equals(200)) {
	String token = tokenResult.getJSONObject("data").getString("authtoken");
}
						</pre>
					</li>
				</ul>
			</div>
			<div class="demoLid">
				<h1>数据接口访问</h1>
				<p>原子服务调用时需要指定其type的具体值，一个原子服务可能有多个type值，1表示页面类型，访问时不需要输入参数，结果为跳转到一个web页面；2表示页面数据类型，访问时需要输入参数，结果同样为跳转到一个web页面；3表示纯数据类型，可输入参数，也可不需要参数，结果为返回一个JSONObject。</p>
				<p>当type为3时，返回结果为：</p>
				<pre>
{
  "time":81,
  "status":200,
  "exception":"无法获取服务数据信息！"
  "results":{
	"flag":3,
	"data":{}
	}
}
				</pre>
				<table>
					<thead>
						<tr>
							<th>字段名</th>
							<th>字段说明</th>
							<th>上级字段</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>time</td>
							<td>接口调用耗时时长</td>
							<td></td>
						</tr>
						<tr>
							<td>status</td>
							<td>接口返回状态，200表示正常，其它数值为异常情况</td>
							<td></td>
						</tr>
						<tr>
							<td>exception</td>
							<td>当status不为200时，会返回此值</td>
							<td></td>
						</tr>
						<tr>
							<td>flag</td>
							<td>原子服务的type值，3为纯数据类型</td>
							<td>results</td>
						</tr>
						<tr>
							<td>data</td>
							<td>原子服务调用返回的数据对象，jsonObject类型，其具体数据见具体的原子服务的返回字段</td>
							<td>results</td>
						</tr>
						<tr>
							<td></td>
							<td>原子服务输出字段，其具体数据见具体的原子服务的返回字段</td>
							<td>data</td>
						</tr>
					</tbody>
				</table>
			</div>
			<div class="demoLid">
				<h2>调用方式一</h2>
				<ul>
					<li>请求地址:http://is-cloud.cn/sc/itsmApi/se/invoke?token=xxx</li>
					<li>请求方式:post</li>
					<li>请求格式:json</li>
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
									<td>token</td>
									<td>token字符串，放在url后面，固定参数</td>
									<td class="center">是</td>
								</tr>
								<tr>
									<td>serviceId</td>
									<td>原子服务ID，见具体原子服务的serviceId，固定参数</td>
									<td class="center">是</td>
								</tr>
								<tr>
									<td>type</td>
									<td>调用的服务类似，见具体的原子服务支持的类型。固定参数</td>
									<td class="center">是</td>
								</tr>
								<tr>
									<td></td>
									<td>其它参数，见每一个原子服务输入参数</td>
									<td class="center"></td>
								</tr>
							</tbody>
						</table>
					</li>
					<li>
						<p>示例代码:</p>
<pre>
String url = "http://is-cloud.cn/sc/itsmApi/seinvoke?token=85d53eea90dd464b9b0f7cb438e7736c";
JSONObject param = new JSONObject();
param.put("serviceId", "a28dea43a52f46e1b8338557a40110ba");
param.put("type", "3");
param.put("content", "神州泰岳股份有限公司");
JSONObject result = client.httpPost(url, param, false);
</pre>
					</li>
					<li>
<p>对应的httpPost代码:</p>
<pre>
public static JSONObject httpPost(String url,JSONObject jsonParam, boolean noNeedResponse){
	//post请求返回结果
	CloseableHttpClient httpClient = HttpClients.createDefault();
	
	JSONObject jsonResult = null;
	HttpPost method = new HttpPost(url);
	RequestConfig requestConfig = RequestConfig.custom()    
	        .setConnectTimeout(10000).setConnectionRequestTimeout(10000)    
	        .setSocketTimeout(10000).build();//单位为毫秒    
	method.setConfig(requestConfig); 
	try {
		if (null != jsonParam) {
			//解决中文乱码问题
			StringEntity entity = new StringEntity(jsonParam.toString(), "utf-8");
			entity.setContentEncoding("UTF-8");
			entity.setContentType("application/json");
			method.setEntity(entity);
		}
		CloseableHttpResponse result = httpClient.execute(method);
		url = URLDecoder.decode(url, "UTF-8");
		/**请求发送成功，并得到响应**/
		if (result.getStatusLine().getStatusCode() == 200) {
			String str = "";
			try {
				/**读取服务器返回过来的json字符串数据**/
				str = EntityUtils.toString(result.getEntity());
				if (noNeedResponse) {
					return null;
				}
				/**把json字符串转换成json对象**/
				jsonResult = JSONObject.parseObject(str);
			} catch (Exception e) {
				logger.error("post请求提交失败:" + url, e);
			}finally {
				result.close();
			}
		}
	} catch (IOException e) {
		logger.error("post请求提交失败:" + url, e);
	}finally {
		
	}                    		
    return jsonResult;
}
</pre>
					</li>
				</ul>
			</div>
			<div class="demoLid">
				<h2>调用方式二</h2>
				<p>form提交，get请求</p>
				<ul>
					<li>
						请求地址http://is-cloud.cn/sc/itsmApi/se/form?token=xxx & serviceId=xxx & type=xxx & param=xxx
					</li>
					<li>
						请求类型:get
					</li>
					<li>
						请求格式:json
					</li>
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
									<td>token</td>
									<td>token字符串，放在url后面，固定参数</td>
									<td class="center">是</td>
								</tr>
								<tr>
									<td>serviceId</td>
									<td>原子服务ID，见具体原子服务的serviceId，固定参数</td>
									<td class="center">是</td>
								</tr>
								<tr>
									<td>type</td>
									<td>调用的服务类似，见具体的原子服务支持的类型。固定参数</td>
									<td class="center">是</td>
								</tr>
								<tr>
									<td>param</td>
									<td>其它参数，json对象，词字段包含的具体参数见每一个原子服务输入参数</td>
									<td class="center"></td>
								</tr>
							</tbody>
						</table>
					</li>
					<li>
						<p>示例代码:</p>
<pre>
String url = "http://is-cloud.cn/sc/itsmApi/se/form?token=85d53eea90dd464b9b0f7cb438e7736c";
JSONObject jsonParam = new JSONObject();
jsonParam.put("content", "神州泰岳股份有限公司");
url = url+" & serviceId=a28dea43a52f46e1b8338557a40110ba & type=3 & param="+URLEncoder.encode(jsonParam.toJSONString());
JSONObject result = client.httpFormGet(url);
</pre>
					</li>
					<li>
						<p>对应httpFormGet代码:</p>
<pre>
public static JSONObject httpFormGet(String url){
	//post请求返回结果
	CloseableHttpClient httpClient = HttpClients.createDefault();
	JSONObject jsonResult = null;
	try {
		HttpGet method = new HttpGet(url);
		RequestConfig requestConfig = RequestConfig.custom()    
		    .setConnectTimeout(10000).setConnectionRequestTimeout(10000)    
		    .setSocketTimeout(20000).build();//单位为毫秒    
		method.setConfig(requestConfig);
		CloseableHttpResponse result = httpClient.execute(method);
		url = URLDecoder.decode(url, "UTF-8");
		/**请求发送成功，并得到响应**/
		if (result.getStatusLine().getStatusCode() == 200) {
			String str = "";
			try {
				/**读取服务器返回过来的json字符串数据**/
				str = EntityUtils.toString(result.getEntity());
				
				/**把json字符串转换成json对象**/
				jsonResult = JSONObject.parseObject(str);
			} catch (Exception e) {
				logger.error("httpFormGet请求提交失败:" + url, e);
			}finally {
				result.close();
			}
		}
	} catch (IOException e) {
		logger.error("httpFormGet请求提交失败:" + url, e);
	}finally {
		
	}
}
</pre>
					</li>
				</ul>
			</div>
			<div class="demoLid">
				<h2>调用方式三</h2>
				<p>form提交，post请求</p>
				<ul>
					<li>
						请求地址http://is-cloud.cn/sc/itsmApi/se/invoke?token=xxx
					</li>
					<li>
						请求类型：post
					</li>
					<li>
						请求格式：json
					</li>
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
									<td>token</td>
									<td>token字符串，放在url后面，固定参数</td>
									<td class="center">是</td>
								</tr>
								<tr>
									<td>serviceId</td>
									<td>原子服务ID，见具体原子服务的serviceId，固定参数</td>
									<td class="center">是</td>
								</tr>
								<tr>
									<td>type</td>
									<td>调用的服务类似，见具体的原子服务支持的类型。固定参数</td>
									<td class="center">是</td>
								</tr>
								<tr>
									<td>param</td>
									<td>其它参数，json对象，词字段包含的具体参数见每一个原子服务输入参数</td>
									<td class="center"></td>
								</tr>
							</tbody>
						</table>
					</li>
					<li>
						<p>示例代码:</p>
<pre>
String url = "http://is-cloud.cn/sc/itsmApi/se/form?token=85d53eea90dd464b9b0f7cb438e7736c";
JSONObject jsonParam = new JSONObject();
jsonParam.put("serviceId", "a28dea43a52f46e1b8338557a40110ba");
jsonParam.put("type", "3");
	JSONObject sparam = new JSONObject();
	sparam.put("content", "神州泰岳股份有限公司");
jsonParam.put("param", sparam.toJSONString());
JSONObject result = client.httpFormPost(url, jsonParam, false);
</pre>
					</li>
					<li>
						<p>对应httpFormPost代码</p>
<pre>
public static JSONObject httpFormPost(String url,JSONObject jsonParam, boolean noNeedResponse){
	//post请求返回结果
	CloseableHttpClient httpClient = HttpClients.createDefault();
	
	JSONObject jsonResult = null;
	HttpPost method = new HttpPost(url);
	RequestConfig requestConfig = 
	RequestConfig.custom().setConnectTimeout(10000).setConnectionRequestTimeout(10000).setSocketTimeout(20000).build();    
	method.setConfig(requestConfig); 
	try {
		if (null != jsonParam) {
			List<\NameValuePair\> formparams = new ArrayList<\NameValuePair\>();
			for(Entry<\String\, \Object\> entry:jsonParam.entrySet()){
				formparams.add(new BasicNameValuePair(entry.getKey(),jsonParam.getString(entry.getKey())));
			}
			UrlEncodedFormEntity entity = new UrlEncodedFormEntity(formparams, Consts.UTF_8);
			method.setEntity(entity);
		}
		CloseableHttpResponse result = httpClient.execute(method);
		url = URLDecoder.decode(url, "UTF-8");
		/**请求发送成功，并得到响应**/
		if (result.getStatusLine().getStatusCode() == 200) {
			String str = "";
			try {
				/**读取服务器返回过来的json字符串数据**/
				str = EntityUtils.toString(result.getEntity());
				if (noNeedResponse) {
					return null;
				}
				/**把json字符串转换成json对象**/
				jsonResult = JSONObject.parseObject(str);
			} catch (Exception e) {
				logger.error("post请求提交失败:" + url, e);
			}finally {
				result.close();
			}
		}
	} catch (IOException e) {
		logger.error("post请求提交失败:" + url, e);
	}finally {
	
	}
}
</pre>
					</li>
				</ul>
			</div>
			<div class="demoLid">
				<h1>数据接口访问</h1>
				<ul>
					<li>请求地址http://is-cloud.cn/sc/itsmApi/se/web?token=xxx</li>
					<li>请求类型：post</li>
					<li>请求格式：json</li>
					<li>
						<p>参数:</p>
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
									<td>token</td>
									<td>token字符串，放在url后面，固定参数</td>
									<td class="center">是</td>
								</tr>
								<tr>
									<td>serviceId</td>
									<td>原子服务ID，见具体原子服务的serviceId，固定参数</td>
									<td class="center">是</td>
								</tr>
								<tr>
									<td>type</td>
									<td>调用的服务类似，见具体的原子服务支持的类型。固定参数</td>
									<td class="center">是</td>
								</tr>
								<tr>
									<td></td>
									<td>其它参数，见每一个原子服务输入参数</td>
									<td class="center"></td>
								</tr>
							</tbody>
						</table>
					</li>
				</ul>
			</div>
			<div class="demoLid">
				<h1>服务接口</h1>
				 <span class="cklcp" @click="downloadApidoc">服务接口下载</span>
				
			</div>
			<div class="demoLid" v-for="(item,index) in tableData" :key="index">
				<h2>{{item.serviceName}}</h2>
				<p>serviceID：{{item.serviceId}}</p>
				type支持类型：
				<table class="type">
					<tr v-for="(service,sindex) in item.serviceDetailsInfo" :key = "sindex">
						<td class="td1">{{service.serviceTypeValue}}</td>
						<td class="td2">{{service.serviceTypeText}}</td>
					</tr>
				</table>
				<!-- 请求参数详情 -->
				<div v-for="(service,sindex) in item.serviceDetailsInfo" :key = "sindex">
					<!-- 输入参数说明 -->
					<div v-if="service.serviceInParam.length > 0">
						<p>参数: type = {{service.serviceTypeValue}}</p>
						<p>请求方式: {{service.requestType}}</p>
						<p>url: {{service.url}}</p>
						<table>
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
					<div v-if="service.serviceOutParam.length > 0">
						<p>输出说明:</p>
						<table>
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
				</div>
				<!--<p>测试用例:</p>
					<pre>
						输入:
						content=经理
						输出:
						{"data":
							["副经理","总经理","总监","市场总监","副总经理","店长","经理助理","业务经理","区域经理","客户经理",
							"李经理","合伙人","业务员","科长","市场部","老总","项目经理","王经理","产品部","导购员","副总裁",
							"杨经理","销售主管","主管","采购员","分析师","处长","理财师","公司老总","促销员","一峰","负责人",
							"老板","销售员","总裁","厨师长","财务总监","销售部","副总","部门经理","顾问","厂长","分析员",
							"营业员","陈经理","领班","课长","工程师","管理人员","吴经理"]
						}
					</pre> -->
				</div>
			</div>
		</div>
</template>

<script>
import apiToken from "../../../publicJs/apiToken.js";
import apiClient from "../../../publicJs/ApiClient.js";
import TipBoxService from "../common/TipBoxService.js";
import LoadingBoxService from "../../../publicJs/LoadingBoxService.js";
import env from '../../../../config/envConfig'

export default{
	data(){
		return{
			tableData: []
		}
	},
	created() {
    	this.getServiceInfos();
  	},
	mounted(){
		var that = this;
		// 滚动条事件
		$(window).scroll(function(){
			// 当前滚动条的高度
			var sl_this = $(this).height();
			// 滚动条上放的高度
			var sl_top = $(this).scrollTop();
			// 出现的高度
			var show_ht = sl_top+sl_this/2;
			// 获取楼层的层数，0层开始
			var key = 0;

			// 此处可以根据自己的情况进行更改
			// for，each，for in都可以 建议改为for循环
			// console.log(bd_height);
		
			bd_height.map(function(value,index){
			
				// 阶梯判断[这一步很重要]
		
				if(sl_top >= value){
					key = index;
				}
			
			})
			// 修改楼梯的样式
				$('dd').eq(key).addClass('active').siblings().removeClass('active');
		
		})
		/*点击跳转到楼层*/
		$('dd').click(function(){
			var key = $(this).index();
			$(this).addClass('active').siblings().removeClass('active');
			// 跳转建筑
			that.change_building(key);
		})

		//查询所有服务
	},
	methods:{
		//获取菜单
		getLeftMenu(){
			var that = this;
			var bd_height = new Array();
			// 记忆变量
			var old_key = 0;
			/*加载完成执行*/
			var h1List=new Array(),h2List=new Array();
			var i1=0,i2=0,n1=0,n2=0;
			var temp='<dl>';
			temp += "<dd class='cate-item1'></dd>";//浏览器中，第一行被隐藏了，所以加一行空的
			var cateList=$('#contentBox').html().match(/(<h[1-2][^>]*>.*?<\/h[1-2]>)/ig);
			for(var i=0;i<cateList.length;i++){
				if(/(<h1[^>]*>.*?<\/h1>)/ig.test(cateList[i])){
					n1++;
					n2=0;
					temp+='<dd class="cate-item1"><span>'+n1+'</span>'+cateList[i].replace(/<[^>].*?>/g,"")+'</dd>';
					h1List[i1]=n1;
					i1++;
				}else{
					n2++;
					temp+='<dd class="cate-item2"><span>'+n1+'.'+n2+'</span>'+cateList[i].replace(/<[^>].*?>/g,"")+'</dd>';
					h2List[i2]=n1+'_'+n2;
					i2++;
				}
			}
			temp+='</dl>';
			$('#leftBox').append(temp);
			$('#contentBox .demoLid').each(function(){
				bd_height[$(this).index()] = $(this).offset().top;
			})
		},
		/*修改楼梯的函数*/
		change_step(key){
			// 获取当前的背景块定位
			var bg_color = $('.bg_color');
			var old_top = bg_color.position().top;
			// 获取目标位置的高度
			var ul_ftop = $('dl').offset().top;
			var li_ftop = $('dd').eq(key).offset().top;
			
			var target_top = li_ftop-ul_ftop;
			

			//console.info(ul_ftop+"----"+li_ftop+"--"+target_top);
			// 开启动画
			bg_color.animate({top:target_top}, 'fast');
		},
		/*修改建筑的函数*/
		change_building(key){
			// 当前滚动条的高度
			var sl_this = $(window).height();
			// 获取目标的位置
			var target = $('#contentBox .demoLid').eq(key).offset().top;

			// 开启动画
			$('html,body').animate({scrollTop:target});
		},
		//获取所有原子服务
		getServiceInfos(){
			debugger
			let vm = this;
			var params = {};
			apiClient.post("itsmApi/api/findServiceInfoLists", params, function(data) {
				if (data.status == "200") {
					let dataList = [...data.results.data];
					vm.tableData = dataList ;
				}
			}).then((response) => {
				this.$nextTick(function(){
					debugger
					//渲染完毕
					vm.getLeftMenu();
				});
			});
		},
		downloadApidoc () {
			window.open(env.API_SERVER + 'itsmApi/apidoc/download?token='+apiClient.token)
		},
	}
}
</script>
<style src="../../css/detailPage/APIhelp.css" scoped></style>
<style>
	#APIhelp .leftBox{
		float: left;
		position: fixed;
		top: 0;
		bottom: 0;
		box-shadow:0px 0px 10px #999999;
		width: 200px;
		overflow-x: scroll;
 		overflow-y: scroll;
	}
	#APIhelp .leftBox dl{
	 	width: 200px;
	}
	#APIhelp .leftBox::-webkit-scrollbar {
	 	display: none;
	}
	#APIhelp .cate-item2{
		width: 200px;
		height: 40px;
		padding-left: 50px;
		line-height: 40px;
		cursor: pointer;
	}
	#APIhelp .cate-item2:hover,.cate-item1:hover{
		background-color: #f8f8f8;
	}
	#APIhelp .cate-item1{
		width: 200px;
		height: 40px;
		padding-left: 30px;
		cursor: pointer;
		font-size: 14px;
		font-weight: 700;
	}
	#APIhelp .cate-item1 span,.cate-item1 a{
		font-size: 14px;
		font-weight: 700;
		line-height: 40px;
		color: #000;
	}
	#APIhelp .active{
		background-color: #f8f8f8;
	}
</style>
