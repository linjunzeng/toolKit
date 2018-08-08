/*******************************************************************************
* @文本框搜索 
* 
* @param name <string>  容器  required 
* @param value <string>  默认值   default ''
* @param placeholder <string>  提示文本  default  ''
* @param scrollHeight <number>  是否固定高度滚动  default  0
* @param data <Array || Json>  列表初始化数据  default null
* @param updata <function>  文本框内容改变时是否更新新数据

* @示例
*var demo = new jquerySearch({
*	 name: '#demo',
*	 placeholder: '搜索订单号',
*	 updata: function( _this, val){
		var newdata = [1,2,3,4,5]
*	 	 _this.createList(newdata);  // 回调传回新的dta
*	 }
*})
* @version 1.0.1 (2018-08-07) 十一
*******************************************************************************/

(function(window,$){
	var jquerySearch = function(option){

		if(!option.name){
			console.warn('容器不能为空');
			return false;
		}
		//合并参数
		this.option = $.extend({}, this.option, option);

		//生成 input id
		this.option.id = this.option.name+'_input';

		this.init();
	}
	jquerySearch.prototype = {
		constructor: jquerySearch,
		//默认参数
		option: {
			name: '',
			value: '',
			placeholder: '',
			scrollHeight: 0,
			data: [],
			updata: null
		},
		init: function(){
			this.createDiv();
		},
		//生成 input
		createDiv: function(){
			var content = '<div id='+this.option.id.substr(1)+' class="search_con"><input name='+this.option.name.substr(1)+' type="text" ischeck="" value="'+this.option.value+'" placeholder="'+this.option.placeholder+'" autocomplete="off"><ul></ul></div>',
				option = this.option;

			//添加到容器里面
			$(option.name).append(content);

			//是否限制高度滚动
			if(option.scrollHeight){
				$(option.id+' ul').css('height',option.scrollHeight + 'px');
			}
			this.bind();
		},
		//绑定事件
		bind: function(){
			var _self = this,
				option = this.option;
				
			$(option.id+' input').focus(function(){
				$(option.id+' ul').show();
				_self.isUpdata($(this).val());
			}).keyup(function(){
				_self.isUpdata($(this).val());
			})

			$(window).click(function(e){
				var len = $(e.target).parents(option.id).length,
					val = $(option.id+' input').val(),
					text = $(option.id+' input').attr('ischeck');

				if(!len){
					$(option.id+' ul').hide();
					val != text && $(option.id+' input').val(text);
				}
			})

			$(option.id+' ul').on('click', 'li', function(){
				var val = $(this).data('val'),
					text = $(this).text();

				if(val !== ''){
					$(option.id+' ul').hide();
					$(option.id+' input').val(text).attr('ischeck',text);
				}
			})
		},

		//下一步判断是否需要更新数据
		isUpdata: function(val){
			if(this.option.updata){
				this.option.updata(this, val);
			}else{
				this.searchOption(val);
			}
		},

		//搜索数据 
		searchOption: function(text){
			var data = {};
			if(text){
				$.each(this.option.data, function(key,value){
					value.indexOf(text) > -1 ? data[key] = value : '';
				})
			}else{
				data = this.option.data;
			}
			this.createList(data);
		},

		//生成 li 列表
		createList: function(data){
			var list = '';

			if(data){
				$.each(data,function(key,value){
					list += '<li data-val='+key+'>'+value+'</li>';
				})
			}

			if(!list){
				list = '<li data-val="">搜索不到该选项</li>';
			}
			$(this.option.id+' ul').html(list);
		}
	}

	window.jquerySearch = jquerySearch;
})(window,$)