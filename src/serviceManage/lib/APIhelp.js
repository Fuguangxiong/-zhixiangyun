jQuery.CateNav=function(elem1,elem2){
		//添加目录
		var currObj;
		var offsetTop=0;
		var h1List=new Array(),h2List=new Array();
		var addNav=function(){
			var i1=0,i2=0,n1=0,n2=0;
			var temp='<dl>';
			var cateList=$(elem1).html().match(/(<h[1-2][^>]*>.*?<\/h[1-2]>)/ig);
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
			$(elem2).append(temp);
		};
		//添加锚点
		var addPoint=function(){
			var i1=i2=0;
			$(elem1).find('h1').each(function(){
				$(this).prepend('<a name="'+h1List[i1]+'"></a>');
				i1++;
			});
			$(elem1).find('h2').each(function(){
				$(this).prepend('<a name="'+h2List[i2]+'"></a>');
				i2++;
			});
		};
		//点击锚点，跳转制定位置
		var clickPoint=function(){
			$(elem2+' dd').click(function(e){
				e.preventDefault();
				$(this).addClass('active').siblings().removeClass('active');
			
				currObj=$("[name='"+$(this).find('a').attr('href').replace(/#/,'')+"']");
				offsetTop=currObj.offset().top;
				$('html,body').animate({
					scrollTop:offsetTop
				},500,'swing');
			});
		};
		//屏幕滚动，显示并选中锚点
		var scrollWin=function(){
		var windowTop=0;
		
			$(window).scroll(function(){
				
				windowTop=$(window).scrollTop();
				if(windowTop>=$(elem1).offset().top){
					$(elem2+' dl').slideDown(750);
				}else{
					$(elem2+' dl').slideUp(750);
				}
				$(elem2+' a').each(function(){
					currObj=$("[name='"+$(this).attr('href').replace(/#/,'')+"']");
					offsetTop=currObj.offset().top;
					if(windowTop>offsetTop){
						$(elem2+' dd').removeClass('active');
						$(this).parent('dd').addClass('active');
						return;
					}

				});
			});
		};
		var init=function(){
			addNav();
			//addPoint();
			//clickPoint();
			//scrollWin();
		}
		init();
	}