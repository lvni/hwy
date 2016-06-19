var Area = Area || {};
(function(){
	var style = '<style>.gearArea{font-family:Helvetica Neue, Helvetica, Arial, sans-serif;font-size:10px;background-color:rgba(0,0,0,0.2);display:block;position:fixed;top:0;left:0;width:100%;height:100%;z-index:9900;overflow:hidden;-webkit-animation-fill-mode:both}.area_ctrl{vertical-align:middle;background-color:#d5d8df;color:#000;margin:0;height:auto;width:100%;position:absolute;left:0;bottom:0;z-index:9901;overflow:hidden;-webkit-transform:translate3d(0, 0, 0);transform:translate3d(0, 0, 0)}.slideInUp{animation:slideInUp .3s ease-in;-webkit-animation:slideInUp .3s ease-in}@-webkit-keyframes slideInUp{from{-webkit-transform:translate3d(0, 100%, 0);transform:translate3d(0, 100%, 0)}to{-webkit-transform:translate3d(0, 0, 0);' + 'transform:translate3d(0, 0, 0)}}.area_roll{display:-webkit-box;width:100%;height:auto;overflow:hidden;font-weight:bold;background-color:transparent;-webkit-mask:-webkit-gradient(linear, 0% 50%, 0% 100%, from(#debb47), to(rgba(36,142,36,0)));-webkit-mask:-webkit-linear-gradient(top, #debb47 50%, rgba(36,142,36,0))}.area_roll>div{font-size:1.6em;height:6em;float:left;background-color:transparent;position:relative;overflow:hidden;-webkit-box-flex:1}.area_roll>div .gear{width:100%;float:left;position:absolute;z-index:9902;margin-top:2em}.area_roll_mask{-webkit-mask:-webkit-gradient(linear, 0% 40%, 0% 0%, from(#debb47), to(rgba(36,142,36,0)));-webkit-mask:-webkit-linear-gradient(bottom, #debb47 50%, rgba(36,142,36,0));padding:0 0 3em 0}.area_grid{position:relative;top:2em;width:100%;height:2em;margin:0;box-sizing:border-box;z-index:0;border-top:1px solid #abaeb5;border-bottom:1px solid #abaeb5}.area_roll>div:nth-child(3) .area_grid>div{left:42%}.area_btn{color:#0575f2;font-size:1.6em;line-height:1em;text-align:center;padding:.8em 1em}.area_btn_box:before,.area_btn_box:after{content:\'\';position:absolute;height:1px;width:100%;display:block;background-color:#96979b;z-index:15;-webkit-transform:scaleY(0.33);transform:scaleY(0.33)}.area_btn_box{display:-webkit-box;-webkit-box-pack:justify;-webkit-box-align:stretch;background-color:#f1f2f4;position:relative}.area_btn_box:before{left:0;top:0;-webkit-transform-origin:50% 20%;transform-origin:50% 20%}.area_btn_box:after{left:0;bottom:0;-webkit-transform-origin:50% 70%;transform-origin:50% 70%}.tooth{height:2em;line-height:2em;text-align:center;display:-webkit-box;-webkit-line-clamp:1;-webkit-box-orient:vertical;overflow:hidden}</style>';
	var selecter = function(dom,options){
		var settings = {
			showEvent : 'focus',
			hideEvent : 'blur',
			areaData : {},
			dataModel : '',
			callback : function(){}
		};
		settings = $.extend(settings, options);
		this.showEvent = settings.showEvent;
		this.hideEvent = settings.hideEvent;
		this.areaData = settings.areaData;
		this.callback = settings.callback;
		this.dom = dom;
		this.item_html = '<div class="tooth js-area-option" data-value="{value}">{text}</div>';
		this.item_height = 0;
		this.provPos = [], //省选项的位置值
		this.cityPos = [], //市
		this.distPos = [], //区
		this.provBox = '',
		this.cityBox = '',
		this.distBox = '',
		this.box = '',
		this.nowTop = 0; //位移时的top值
		//this.init();
	};
	
	selecter.prototype = {
		init : function(){
			var self = this;
			$(this.dom).bind(this.showEvent, function(e){
				self.drawDom();
			});
		},
		
		drawDom : function(){
			if($('#js-area-box').length){
				$('#js-area-box').show();
				return false;
			}
			$('body').append(style);
			var box_html = '<div class="gearArea" id="js-area-box" style="display:none;"><div class="area_ctrl slideInUp">' +
			'<div class="area_btn_box"><div class="area_btn" id="js-area-cancle">取消</div>' +
			'<div class="area_btn" id="js-area-sure">确定</div></div><div class="area_roll_mask">' +
			'<div class="area_roll"><div><div class="gear area_province" id="js-area-provs" rel="provs"></div>' +
			'<div class="area_grid"></div></div><div><div class="gear area_city" id="js-area-citys" rel="citys"></div>' +
			'<div class="area_grid"></div></div><div><div class="gear area_county" id="js-area-dists" rel="dists"></div>' +
			'<div class="area_grid"></div></div></div></div></div></div>';
			$('body').append(box_html);
			this.box = $('#js-area-box');
			this.provBox = $('#js-area-provs');
			this.cityBox = $('#js-area-citys');
			this.distBox = $('#js-area-dists');
			this.append_provs();
			this.append_citys();
			this.append_dist();
			this.provBox.attr('data-check', 0);
			this.cityBox.attr('data-check', 0);
			this.distBox.attr('data-check', 0);
			
			this.box.show();
			this.item_height = $('.js-area-option:first').height();
			this.init_event();
		},
		
		append_provs : function(){
			var prov_html = '',html = '';
			for(var i in this.areaData['provs']){
				html = this.item_html.replace('{value}', this.areaData['provs'][i]['value']);
				html = html.replace('{text}', this.areaData['provs'][i]['text']);
				prov_html += html;
			}
			this.provBox.append(prov_html);
		},
		
		append_citys : function(val){
			if(!val){
				val = $('#js-area-provs .js-area-option:first').attr('data-value');
			}
			if(!this.areaData['citys'][val]){
				return;
			}
			var city_html = '', html = '';
			for(var i in this.areaData['citys'][val]){
				html = this.item_html.replace('{value}', this.areaData['citys'][val][i]['value']);
				html = html.replace('{text}', this.areaData['citys'][val][i]['text']);
				city_html += html;
			}
			this.cityBox.html(city_html);
			this.unset(this.cityBox);
		},
		
		append_dist : function(val){
			if(!val){
				val = $('#js-area-citys .js-area-option:first').attr('data-value');
			}
			if(!this.areaData['dists'][val]){
				return;
			}
			var dist_html = '', html = '';
			for(var i in this.areaData['dists'][val]){
				html = this.item_html.replace('{value}', this.areaData['dists'][val][i]['value']);
				html = html.replace('{text}', this.areaData['dists'][val][i]['text']);
				dist_html += html;
			}
			this.distBox.html(dist_html);
			this.unset(this.distBox);
		},
		
		init_event : function(){
			var self = this;
			this.provBox.bind('touchstart', function(e){self.touchStart(e);});
			this.provBox.bind('touchmove', function(e){self.touchMove(e);});
			this.provBox.bind('touchend', function(e){self.touchEnd(e);});
			this.cityBox.bind('touchstart', function(e){self.touchStart(e);});
			this.cityBox.bind('touchmove', function(e){self.touchMove(e);});
			this.cityBox.bind('touchend', function(e){self.touchEnd(e);});
			this.distBox.bind('touchstart', function(e){self.touchStart(e);});
			this.distBox.bind('touchmove', function(e){self.touchMove(e);});
			this.distBox.bind('touchend', function(e){self.touchEnd(e);});
			$('#js-area-cancle').bind('click', function(e){self.close(e)});
			$('#js-area-sure').bind('click', function(e){self.done(e)});
		},
		
		touchStart : function(e){
			e.preventDefault();
			var target = e.target;
			while (true) {
				if (!target.classList.contains("gear")) {
					target = target.parentElement;
				} else {
					break
				}
			}
			clearInterval(target["int_" + target.id]);
			target["old_" + target.id] = e.targetTouches[0].screenY;
			target["o_t_" + target.id] = (new Date()).getTime();
			var top = target.getAttribute('top');
			if (top) {
				target["o_d_" + target.id] = parseFloat(top.replace(/em/g, ""));
			} else {
				target["o_d_" + target.id] = 0;
			}
		},
		
		touchMove : function(e){
			e.preventDefault();
			var target = e.target;
			while (true) {
				if (!target.classList.contains("gear")) {
					target = target.parentElement;
				} else {
					break
				}
			}
			target["new_" + target.id] = e.targetTouches[0].screenY;
			target["n_t_" + target.id] = (new Date()).getTime();
			//var f = (target["new_" + target.id] - target["old_" + target.id]) * 18 / target.clientHeight;
			var f = (target["new_" + target.id] - target["old_" + target.id]) * 18 / 370;
			target["pos_" + target.id] = target["o_d_" + target.id] + f;
			target.style["-webkit-transform"] = 'translate3d(0,' + target["pos_" + target.id] + 'em,0)';
			target.setAttribute('top', target["pos_" + target.id] + 'em');
		},
		
		touchEnd : function(e){
			e.preventDefault();
			var target = e.target;
			while (true) {
				if (!target.classList.contains("gear")) {
					target = target.parentElement;
				} else {
					break;
				}
			}
			var flag = (target["new_" + target.id] - target["old_" + target.id]) / (target["n_t_" + target.id] - target["o_t_" + target.id]);
			if (Math.abs(flag) <= 0.2) {
				target["spd_" + target.id] = (flag < 0 ? -0.08 : 0.08);
			} else {
				if (Math.abs(flag) <= 0.5) {
					target["spd_" + target.id] = (flag < 0 ? -0.16 : 0.16);
				} else {
					target["spd_" + target.id] = flag / 2;
				}
			}
			if (!target["pos_" + target.id]) {
				target["pos_" + target.id] = 0;
			}
			this.rollGear(target);
		},
		
		rollGear : function(target) {
			var d = 0,
			    stopGear = false,
				self = this;
			clearInterval(target["int_" + target.id]);
			target["int_" + target.id] = setInterval(function() {
				var pos = target["pos_" + target.id];
				var speed = target["spd_" + target.id] * Math.exp(-0.03 * d);
				pos += speed;
				if (Math.abs(speed) > 0.1) {} else {
					speed = 0.1;
					var b = Math.round(pos / 2) * 2;
					if (Math.abs(pos - b) < 0.02) {
						stopGear = true;
					} else {
						if (pos > b) {
							pos -= speed
						} else {
							pos += speed
						}
					}
				}
				if (pos > 0) {
					pos = 0;
					stopGear = true;
				}
				var minTop = -(($(target).height() / self.item_height) - 1) * 2;
				if (pos < minTop) {
					pos = minTop;
					stopGear = true;
				}
				if (stopGear) {
					var gearVal = Math.abs(pos) / 2;
					self.setVal(target, gearVal);
					clearInterval(target["int_" + target.id]);
				}
				target["pos_" + target.id] = pos;
				target.style["-webkit-transform"] = 'translate3d(0,' + pos + 'em,0)';
				target.setAttribute('top', pos + 'em');
				d++;
			}, 30);
		},
		
		setVal : function(target, val){
			val = Math.round(val);
			var code = $(target).find('.js-area-option').eq(val).attr('data-value'),
				oCode,
				_fp,_fc,_fd,
				lvl = $(target).attr('rel');
			if(lvl == 'provs'){
				this.provPos[val] = $('#js-area-provs').attr('top');
				this.append_citys(code);
				oCode = (this.areaData['citys'][code].slice(0,1))[0];
				this.append_dist(oCode.value);
				this.provBox.attr('data-check', val);
				this.cityBox.attr('data-check', 0);
				this.distBox.attr('data-check', 0);
			}else if(lvl == 'citys'){
				this.append_dist(code);
				_fd = (this.areaData['dists'][code].slice(0,1))[0];
				this.cityBox.attr('data-check', val);
				this.distBox.attr('data-check', 0);
			}else{
				this.distBox.attr('data-check', val);
			}
		},
		
		close : function(e){
			var _p = $(this.dom).attr('prov-val') || 0,
				_c = $(this.dom).attr('city-val') || 0,
				_d = $(this.dom).attr('dist-val') || 0,
				code = this.provBox.find('.js-area-option').eq(_p).attr('data-value'),
				oCode = (this.areaData['citys'][code].slice(0,1))[0];
			this.append_citys(code);
			this.append_dist(oCode.value);
			this.unset(this.provBox, _p);
			this.unset(this.cityBox, _c);
			this.unset(this.distBox, _d);
			//this.rollGear();
			$('#js-area-box').hide();
			return false;
		},
		
		done : function(e){
			var _p = $('#js-area-provs').attr('data-check'),
				_c = $('#js-area-citys').attr('data-check'),
				_d = $('#js-area-dists').attr('data-check'),
				pval, cval, dval, code;
			$(this.dom).attr('prov-val', _p);
			$(this.dom).attr('city-val', _c);
			$(this.dom).attr('dist-val', _d);
			pval = $('#js-area-provs').find('.js-area-option').eq(_p);
			cval = $('#js-area-citys').find('.js-area-option').eq(_c);
			dval = $('#js-area-dists').find('.js-area-option').eq(_d);
			code = pval.attr('data-value') + ',' + cval.attr('data-value') + ',' + dval.attr('data-value');
			$(this.dom).attr('data-value', code);
			$(this.dom).val(pval.html() + ' ' + cval.html() + ' ' + dval.html());
			$('#js-area-box').hide();
			if(typeof this.callback == 'function'){
				this.callback(code);
			}
			return false;
		},
		
		unset : function(opt, val){
			val = val || 0;
			opt.css('-webkit-transform', 'translate3d(0,' + (-val*2) + 'em,0)');
			opt.attr('data-check', val).attr('top', (-val*2) + 'em');
			var id = opt.attr('id'),
				dom = document.getElementById(id);
			for(var i in dom){
				if(i.indexOf(id) > -1){
					delete(dom[i]);
				}
			}
		}
		
	}
	Area.selecter = selecter;
})();