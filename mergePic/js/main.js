window.onload = function(){
	//从本地拖拽文件经过网页时，阻止默认事件
	window.ondragover = function(e){
		var e = event || window.event;
		e.preventDefault();
	}
	/**
	*手机外框合并图片事件
	*@param {Object} canvas是画布对象
	*@param {Object} ctx是上下文绘图环境
	*@param {Array} picCanArr=[{picCanObj1},{picCanObj2}]是所有手机外壳合并的本地图片所需的绘制数据的对象组成的数组
	*/
	var DrawPicture = function(canvas,ctx,picCanArr){//构造函数
		this.canvas = canvas;
		this.ctx = ctx;
		this.picCanArr = picCanArr;
		this.picCanObj = null;//被选择的手机外壳屏幕部分所需要的基本数据
	}
	DrawPicture.prototype = {
		/**
		*手机外框合并图片事件
		*@param {Object} e是鼠标事件
		*@param {Object} uploadPic是上传按钮
		*@param {Object} uploadPicSi是代理的上传按钮
		*@param {Object} downloadPic是下载按钮
		*/
		pickBg:function(e,uploadPic,uploadPicSi,downloadPic){//判断将要选择的手机外壳
			var e = window.event || event;
			var id = e.target.id;
			var src = '';
			uploadPic.disabled = false;//取消按钮禁用效果
			uploadPicSi.disabled = false;
			downloadPic.disabled = false;
			if(id === 'pickIos'){
				src = 'images/ios_bg.png';
				this.picCanObj = this.picCanArr[0];
				this.drawBg(src);
			}else{
				src = 'images/android_bg.png';
				this.picCanObj = this.picCanArr[1];
				this.drawBg(src,this.picCanObj);
			}
			//console.log( this.picCanObj)
			return this.picCanObj;
		},
		/**
		*绘制手机外框
		*@param {String} src为img的src
		*/
		drawBg: function(src){
			var imgBg = new Image();
			imgBg.src = src;
			var that = this;
			//imgBg.crossOrigin = 'anonymous';
			imgBg.onload = function(){
				var canHeight = imgBg.height;//画布的高度
				var canWidth = imgBg.width;//画布的宽度 
				that.canvas.height = canHeight;
				that.canvas.width = canWidth;
				that.ctx.drawImage(imgBg,0,0);
			}
		},
		/**
		*@param {number} dx为距离手机左上角的横坐标
		*@param {number} dy为距离手机左上角的纵坐标	
		*@param {number} width为绘制的宽度
		*@param {number} height为绘制的高度
		*@param {Object} e为鼠标事件
		*/
		drawPic: function(picCanObj,r,render,e,imgVal){//添加需要合成的图片
			var img = new Image();
			var that = this;
			var dxFix = picCanObj.dx;
			var dyFix = picCanObj.dy;
			var widthFix = picCanObj.width;
			var heightFix = picCanObj.height;
			var dx = dxFix;//上传图片距离手机图片左上角的横坐标
			var dy = dyFix;;//上传图片距离手机图片左上角的纵坐标
			var width = widthFix;
			var height = heightFix;
			img.onload = function(){	
				r = img.height/img.width;
				if(img.width > img.height){
					img.width = widthFix;
					img.height = img.width * r;
					height = img.height;
					width = img.width;
					dy = (heightFix -height)/2 + dyFix;	
				}else{
					img.height = heightFix;
					img.width = img.height/r;
					width = img.width;
					height = img.height;
					dx = (widthFix - width)/2 + dxFix;
					if(width > widthFix){
						width = widthFix;
						img.width = width;
						img.height = width * r;
						height = img.height;	
						dx = dxFix;
						dy = (heightFix -height)/2 + dyFix;
						}
					}	
					that.ctx.drawImage(img,dx,dy,width,height);
				}
				if(render){
					img.src = e.target.result;
				}else{
					img.src = imgVal;
				}
				
		},
		/**
		*上传图片
		*@param {number} dx为距离手机左上角的横坐标
		*@param {number} dy为距离手机左上角的纵坐标	
		*@param {number} width为绘制的宽度
		*@param {number} height为绘制的高度
		*@param {number} r为图片宽高比
		*@param {Object} e为鼠标事件
		*/
		dealRenderPic: function(picCanObj,r,e){
			var that = this;
			var render = new window.FileReader();
				render.onload = function(e){
					that.drawPic(picCanObj,r,render,e,null);
			}
				render.readAsDataURL(e.target.files[0]);
		},
		/**
		*拖放图片
		*@param {number} dx为距离手机左上角的横坐标
		*@param {number} dy为距离手机左上角的纵坐标	
		*@param {number} width为绘制的宽度
		*@param {number} height为绘制的高度
		*@param {number} r为图片宽高比
		*@param {Object} e为鼠标事件
		*@param {string} imgVal为drag的图片
		*/
		dealDragPic:function(picCanObj,r,e,imgVal){
				var picCanObj = picCanObj;
				var  imgDrag = new Image();
				imgDrag.src = imgVal;
				var that  = this;
				imgDrag.onload = function(){
					that.drawPic(picCanObj,r,null,e,imgVal);	
				}
		},
		/**
		*@param {Object} e为鼠标事件
		*@param {string} imgVal是drag的图片
		*/
		dealPicture:function(picCanObj,e,imgVal){//绘制白色矩形背景,将图片文件进行转码并渲染到白色背景上面		
			this.ctx.fillStyle = "#ffffff";
			var dx = picCanObj.dx;//上传图片距离手机图片左上角的横坐标
			var dy = picCanObj.dy;//上传图片距离手机图片左上角的纵坐标
			var width = picCanObj.width;
			var height = picCanObj.height;
			this.ctx.fillRect(dx,dy,width,height);
			var r = 0;// 图片原本的宽高比	
			if(imgVal){
				this.dealDragPic(picCanObj,r,e,imgVal);
			}else{
				this.dealRenderPic(picCanObj,r,e);
			}
		}
	}

	/**
	*代理手机外框合并图片事件,提供事件接口
	*@param {Object} canvas是画布对象
	*@param {Object} ctx是上下文绘图环境
	*/
	var DrawPictureProxy = function(canvas,ctx,picCanArr){
		this.canvas = canvas;
		this.ctx = ctx;
		this.drawPicture = null;
		this.picCanArr = picCanArr;
	}
	DrawPictureProxy.prototype = {
		proxyInit: function(){//缓存代理，在需要时进行初始化DrawPicture
			//console.log(this.canvas);
			//console.log(this.ctx);
			this.drawPicture = new DrawPicture(this.canvas,this.ctx,this.picCanArr);
		},
		drawBgProxy:function(){
			this.canvas.width = 300;
			this.canvas.height = 500;
			this.ctx.fillStyle = '#000000';
			this.ctx.fillRect(0,0,300,500);
		},
		/**
		*手机外框合并图片事件
		*@param {Object} e是鼠标事件
		*@param {Object} uploadPic是上传按钮
		*@param {Object} uploadPicSi是代理的上传按钮
		*@param {Object} downloadPic是下载按钮
		*/
		pickBg:function(e,uploadPic,uploadPicSi,downloadPic){
			this.proxyInit();
			return this.drawPicture.pickBg(e,uploadPic,uploadPicSi,downloadPic);
		},
		/**
		*绘制手机外框
		*@param {String} src为img的src
		*/
		drawBg:function(src){
			this.proxyInit();
			return this.drawPicture.drawBg(src);
		},
		/**
		*@param {number} dx为距离手机左上角的横坐标
		*@param {number} dy为距离手机左上角的纵坐标	
		*@param {number} width为绘制的宽度
		*@param {number} height为绘制的高度
		*@param {Object} e为鼠标事件
		*/
		drawPic: function(picCanObj,r,render,e,imgVal){//添加需要合成的图片
			this.proxyInit();
			return this.drawPicture.drawPic(picCanObj,r,render,e,imgVal);
		},
		/**
		*@param {number} dx为距离手机左上角的横坐标
		*@param {number} dy为距离手机左上角的纵坐标	
		*@param {number} width为绘制的宽度
		*@param {number} height为绘制的高度
		*@param {number} r为图片宽高比
		*@param {Object} e为鼠标事件
		*/
		dealRenderPic: function(picCanObj,r,e){
			this.proxyInit();
			return this.drawPicture.dealRenderPic(picCanObj,r,render,e,imgVal);
		},
		/**
		*@param {number} dx为距离手机左上角的横坐标
		*@param {number} dy为距离手机左上角的纵坐标	
		*@param {number} prototypeth为绘制的宽度
		*@param {number} height为绘制的高度
		*@param {number} r为图片宽高比
		*@param {Object} e为鼠标事件
		*@param {string} imgVal为drag的图片
		*/
		dealDragPic:function(picCanObj,r,e,imgVal){
			this.proxyInit();
			return this.drawPicture.dealDragPic(picCanObj,r,render,e,imgVal);
		},
		/**
		*@param {Object} e为鼠标事件
		*@param {string} imgVal是drag的图片
		*/
		dealPicture:function(picCanObj,e,imgVal){//绘制白色矩形背景,将图片文件进行转码并渲染到白色背景上面
			this.proxyInit();
			return this.drawPicture.dealPicture(picCanObj,e,imgVal);
		}
	}

		//监听网页变化
		var winChangeListener = {
			uploadPicListener:function(picCanObj){//监听页面是否发生上传事件
				uploadPic.onchange = function(e){//当点击上传按钮时
					var e = event||window.event;
					var type = e.target.files[0].type;
					var typeRex = /^image/;

					var typeVal = typeRex.test(type);//判断是否为image
					if(typeVal){//如果上传文件为图片,发布绘制图片消息
						drawPictureProxy.dealPicture(picCanObj,e);
					}		
				}
			},
			ondropPicListener:function(picCanObj,canvas){//监听网页是否发生drop事件
				window.ondrop = function(e){//本地文件在网页上drop时
					var e = event || window.event;
					e.preventDefault();
					var data = e.dataTransfer.files[0];
					//e.target.appendChild(document.getElementById(data));
					var imageType = data.type;
					var typeRex = /^image/;
					var typeVal = typeRex.test(imageType);//判断是否为image
					var target = e.target;
					if(target === canvas){//判断当前目标元素是否为canvas
						//drawListener(e)
						var imgVal = window.webkitURL.createObjectURL(data);
						var body = document.getElementsByTagName('body');
						drawPictureProxy.dealPicture(picCanObj,e,imgVal);
					}
				}
			}
		}
		/**
		*canvas将图片导到本地
		*@param {object} canvas为画布对象
		*@param {String} type为导出图片的后缀(.png|.jpg...)
		*/
	var Download = function(canvas,type){//构造函数
		this.canvas = canvas;
		this.type = type;
		this.imgdata = canvas.toDataURL(type);//保存的图片的类型
	}
	Download.prototype = {
		/**
		*@param {String} type为导出图片的后缀(.png|.jpg...)
		*/
		fixtype:function(type){//将mime-type改为image/octet-stream,强制让浏览器下载
			type = type.toLocaleLowerCase().replace(/jpg/i, 'jpeg');
		    var r = type.match(/png|jpeg|bmp|gif/)[0];
		    return 'image/' + r;
		},
		/**
		*@param {String} data图片的保存类型
		*@param {String} filename为图片的名称
		*/
		saveFile:function(data, filename){//将图片保存到本地
			var link = document.createElement('a');
	        link.href = data;
	        link.download = filename;
	        var event = document.createEvent('MouseEvents');
	        event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
	        link.dispatchEvent(event);
		},
		dealDownload:function(){
			this.imdData = this.imgdata.replace(this.fixtype(this.type), 'image/octet-stream');
			var filename = new Date().toLocaleDateString() + '.' + this.type;
			 this.saveFile(this.imgdata, filename);
		}
	}
	

	var drawPictureProxy = null;
	var uploadPic = null;//上传图片按钮
	var downloadPic = null;//下载按钮
	var uploadPicSi = null;//代理的上传图片按钮
	var drawInit = function(){//初始化当前绘画背景
		var canvas = document.getElementById('myCanvas');//获取canvas对象
		var ctx = canvas.getContext('2d');//获取上下文绘图环境
		uploadPic = document.getElementById('uploadPic');//上传图片按钮
		uploadPicSi = document.getElementById('uploadPicSi');//代理的上传图片按钮
		downloadPic = document.getElementById('downloadPic');//下载按钮
		var picCanArr = [{name:'ios',dx:18,dy:74,width:284,height:501},{name:'android',dx:19,dy:57,width:284,height:501}]
		drawPictureProxy = new DrawPictureProxy(canvas,ctx,picCanArr);
		drawPictureProxy.drawBgProxy();//默认绘制黑色矩形
		var pickIos = document.getElementById('pickIos');
		var pickAndroid = document.getElementById('pickAndroid');
		var picCanObj = null;//将上传或拖拽图片所需要的基本数据信息
		pickAndroid.onclick = function(e){
			picCanObj = drawPictureProxy.pickBg(e,uploadPic,uploadPicSi,downloadPic);
			winChangeListener.uploadPicListener(picCanObj);
			winChangeListener.ondropPicListener(picCanObj,canvas);
		}
		pickIos.onclick = function(e){
			picCanObj = drawPictureProxy.pickBg(e,uploadPic,uploadPicSi,downloadPic);
			winChangeListener.uploadPicListener(picCanObj);
			winChangeListener.ondropPicListener(picCanObj,canvas);
		}
		//DrawPicture.drawBg();//绘制手机外框	
		//DrawPictureProxy(canvas,ctx);	
		
	downloadPic.onclick = function(){
		var type = 'png';
		var download = new Download(canvas,type);
		download.dealDownload();
	}
	}
	drawInit();
}
	
