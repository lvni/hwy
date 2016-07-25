/*'use script'*/
/**
 * @author zhangyuliang
 * @date 2016-06
 * @brief 洪五爷珠宝
 **/
var config = {
    //'api': 'http://app.hong5ye.com/api/backend/web/index.php',
    'api': 'http://test.hong5ye.com/api/backend/web/index.php',
    'webapp': 'http://app.hong5ye.com/webapp/index.html',
    'page': {
        'confirm_order': 'myorder-placeorder.html',//订单确认页
        'detail': 'details.html',
        'select_address': 'address-select.html',
        'cart' : 'shoppingCart.html', //购物车
        'login': 'login.html', //登录页
        'home': 'index.html', //首页
        'address_edit': 'address-edit.html', //地址编辑页面
        'order_pay': 'myorder-paymode.html', //订单支付页面
        'order_detail': 'myorder-details.html',
        'user_king' : 'king.html',
        'user_supplier' : 'supplier.html',
        'collection': 'collection.html', //我的收藏
        'income_king' : 'myincome-king.html', //我的收入
        'income_supplier' : 'myincome-captain-mymember.html', //我的收入- 供应商
    },
    'default_icons': 'http://hwy-10042975.file.myqcloud.com/default.png',
    'share_logo' : "http://hwy-10042975.file.myqcloud.com/default.png",
    'navi_show_page':[
        'king.html', 'index.html', 'allproduct.html',
    ],
};
//错误码
var ErrorCode = {
    NO_LOGIN: 12, //没有登录
}
var Const = {
    GOODS_STATUS_ON_SELL: 1, //在售
    USER_ROLE_KING : 2,
    USER_ROLE_KING_ONE : 3, //一品王爷
    USER_ROLE_SUPPLIER : 4,
    USER_ROLE_SUPPLIER_LEADER : 5,
}

//消息盒子相关
var messageBox = {
    id : 0,
    hidde: function(target) {
        target.hide('slow').remove();
    }
    ,toast: function(msg) {
        var me = this;
        var html = '<div id="system_messagebox_toast" style="position:fixed; '
                     + 'bottom:30%;margin-left:auto;margin-right:auto;background:'
                     + '#262631;color: #fff;border-radius: 5px;padding: 6px 10px;'
                     + 'text-align: center;left:45%;z-index:999;">'+msg+'</div>';
        //alert(msg);
        if ($("#system_messagebox_toast").length) {
            return;
        }
        $('body').append(html);
        var marginLeft = 0 - $("#system_messagebox_toast").width() / 2;
        $("#system_messagebox_toast").css('margin-left', marginLeft + "px");
        setTimeout(function(){me.hidde($("#system_messagebox_toast"))}, 1000);
    }
    //弹出确认框
    ,confirm: function(msg, callback) {
        var html = '<div class="u-popodbox" id="js-confirm-box">'
                      + '<div class="cont"><h2>'
                      + msg + '</h2><div class="buttonbox">'
                      + '<button class="u-button-gray">'
                      + '<span>取消</span></button>'
                      + '<button class="u-button-main">'
                      + '<span>确认</span></button></div></div></div>';
        if ($("js-confirm-box").length) {
            return;
        }
        $('body').append(html);
        $("#js-confirm-box")[0].style.display = '-webkit-box';
        var yscfunc = function(){
            $("#js-confirm-box").remove();
            if (typeof callback == 'function') {
                callback();
            }
        }
        
        $("#js-confirm-box .u-button-main").bind('click', yscfunc);
        $("#js-confirm-box .u-button-gray").bind("click", function(){
            $("#js-confirm-box").remove();
        });
        
    }
    
};

String.prototype.replaceAll = function(s1,s2) { 
    return this.replace(new RegExp(s1,"gm"),s2); 
}


var History = {
    size : 20
    //将商品加入浏览记录，只保留最近浏览20条记录
    ,addGoodsView: function(goodsID) {
          var history = Storge.getItem("g_hstory");
          var size = 20;
          var arrH = [];
          if (history) {
              arrH = history.split(',');
              for (i =0 ; i < arrH.length; i++) {
                  if (arrH[i] == goodsID) {
                      //已存在
                      delete arrH[i];
                      break;
                  }
              }
              if (arrH.length > History.size) {
                  arrH.pop();
              }
          }
          if (goodsID) {
              arrH.unshift(goodsID);
              Storge.setItem("g_hstory" , arrH.join(','));
          }
          
    }
    ,getViewedGoods: function() {
        return Storge.getItem("g_hstory");
    }
    ,run: function() {
        var history = this.getViewedGoods();
        if (history) {
            Util.requestApi('?r=good/viewhistory', {goods_ids:history}, function(data){
                if (data.errno != 0) {
                    messageBox.toast(data.errmsg);
                    return; 
                }
                if (data.data.length == 0) {
                    Util.showTips($(".u-productlist"), "没有相关记录");
                    return;
                }
                var htm = "";
                var template = $("#list_item_template").html();
                for (i in data.data) {
                    var item = data.data[i];
                    htm += Template.renderByTemplate(template, item);
                }
                $(".u-productlist").html(htm);
                
            });
        } else {
            Util.showTips($(".u-productlist"), "没有相关记录");
        }
        
        
    }
    
}

//分页
var Page = function(target){
    
    return {
        target: target,
        addClickEvent: function(clickFunc) {
            var me = this;
            $(me.target).delegate('a', 'click', clickFunc);
        },
        render: function(page, page_count) {
            var me = this;
            if ( page_count > 1) {
                //页面大于1，显示分页
                var page_info = "";
                var prefx = "";
                var tail    = "";
                if (page_count > 4) {
                    //大于4页
                    prefx = "<a href='javascript:;' data='1'>首</a>";
                    tail = "<a href='javascript:;' data='"+page_count+"'>尾</a>";

                }
                var start = page - 2 > 0 ?   page - 2 : 1;
                var end  = start + 4 > page_count ? page_count : start + 4;
                if (end == page_count) {
                    start = end - 4 > 0 ? end - 4 : start;
                }
                for (i = start; i<= end; i++) {
                        var item = "<a href='javascript:;' data='"+i+"'>"+i+"</a>";
                        if (i == page) {
                            item = "<a href='javascript:;' class='number'>"+i+"</a>";
                        }
                        page_info += item;
                }
                $(me.target).html(prefx + page_info + tail);
            } else {
                $(me.target).html('');
            }
        }
        
        
    };
};


var Template = {
    id: 0,
    template: '',
    renderById: function(id, data) {
        this.id = id;
        this.template = $('#'+id).html();
        var html = this.template;
        for (i in data) {
            html = html.replace("{$"+i+"}", data[i]);
        }
        return html;
    },
    renderByTemplate: function(template, data) {
        var html = template;
        for (i in data) {
            html = html.replaceAll("\{\\$"+i+"\}", data[i]);
        }
        return html;
    }
    

};
//公共工具
var Util = {
    //防止注入，将字符串转义
    escape: function(s) {
        var regx_html_encode = /"|&|'|<|>|[\x00-\x20]|[\x7F-\xFF]|[\u0100-\u2700]/g;
        return (typeof s != "string") ? s :
          s.replace(regx_html_encode,
                    function($0){
                        var c = $0.charCodeAt(0), r = ["&#"];
                        c = (c == 0x20) ? 0xA0 : c;
                        r.push(c); r.push(";");
                        return r.join("");
                    });
    }
    //获取请求参数
    ,getQueryString: function(name) {
        var url = window.location.search;
        var theRequest = new Object();
        if (url.indexOf("?") != -1) {
          var str = url.substr(1);
          strs = str.split("&");
          for(var i = 0; i < strs.length; i ++) {
             theRequest[strs[i].split("=")[0]]=(strs[i].split("=")[1]);
          }
       }
       if (name in theRequest) {
           return decodeURI(theRequest[name]);
       }
       return ''; 
    }
    //跳转登录
    ,goLogin: function(redistrict) {
        var callback = redistrict ? redistrict : config.page.home; 
        var sid = Util.getQueryString('sid'); 
        if (sid) {
            callback += "&sid="+sid;
        }
        if (Util.isWeiXin()) {
             //微信端内，直接登陆
             Util.goWxLogin(callback);
        } else {
            window.location.href = config.page.login + "?redirect=" + callback;
        }
        
        
    }
    //同步请求
    ,syncRequest: function(api, data, callback, method) {
        var me = this;
        me.showLoading();
        var beforeCallback = function(data) {
              me.hideLoading();
             if (data.errno  == ErrorCode.NO_LOGIN) {
                 //没有登录，直接去登录
                 //messageBox.toast("请先登录");
                 var url = location.href;
                 me.goLogin(url);
                 return ;
             }
            return callback(data);
        }
        if (!method) {
            method = 'get';
        }
        var url = config.api + api;
        $.ajax({
            url: url,
            type: method,
            async: false,
            dataType: 'json',
            data: data,
            success: beforeCallback,
            error: function() {
                me.hideLoading();
                messageBox.toast("服务器出错啦");
            }
        });
    }
    //请求接口
    ,requestApi: function(api, data, callback, type, silence) {
        
        var me = this;
        if (!silence) {
            me.showLoading();
        } 
        var beforeCallback = function(data) {
              if (!silence) {
                  me.hideLoading();
              }
              
             if (data.errno  == ErrorCode.NO_LOGIN) {
                 //没有登录，直接去登录
                 //messageBox.toast("请先登录");
                 var url = location.href;
                 me.goLogin(url);
                 return ;
             }
            return callback(data);
        }
        var url = config.api + api;
        var dataType = 'jsonp';
        var method = 'get';
        if (type == 'post') {
            dataType = 'json';
            method = 'post';
        }
        $.ajax({
            url: url,
            type: method,
            dataType: dataType,
            data: data,
            success: beforeCallback,
            error: function() {
                me.hideLoading();
                messageBox.toast("服务器出错啦");
            }
        });
    }
    //是否在微信浏览器
    ,isWeiXin: function (){
            var ua = window.navigator.userAgent.toLowerCase();
            if(ua.match(/MicroMessenger/i) == 'micromessenger'){
                return true;
            }else{
                return false;
            }
    }
    ,goGoodsDetail: function(id) {
        window.location.href = "details.html?id=" + id ;
    }
    ,getHash: function() {
        return location.hash.replace('#', '');  
    }
    ,setHash: function(str) {
        location.hash = str;
    }
    //公众号内登录
    ,goWxLogin: function(redirect) {
        var url = config.api + "?r=user/loginwx";
        if (redirect) {
            url += "&redirect=" + redirect;
        }
        window.location.href = url;
    }
    //微信扫码登录
    ,goWxQrLogin: function(redirect) {
        
    }
    ,showTips: function(target, tips) {
        var div = "<div style='text-align:center;padding-top:100px;'>"+tips+"</div>";
        target.html(div);
    }
    ,isCorrectMobile: function(mobile) {
        var reg = /^0?(13[0-9]|15[012356789]|17[0678]|18[0-9]|14[57])[0-9]{8}$/;
        return reg.test(mobile);
    }
    ,loadingId: 0
    ,showLoading: function(){
         var html = '<div  id="loading_box"><div style="position: fixed;top: 0;width: 100%;height: 100%;background: #ECE6E6;opacity: 0.2;z-index: 10;"></div>'
                      + '<div style="position: fixed;top: 50%;left: 50%;margin-left: -54px;margin-top: -54px;width: 108px;height: 108px;z-index: 13;border-radius: 4px;text-align: center;line-height: 108px;background: #565353;">'
                      + '<img src="img/loading.gif" style="width: 56px;"></div></div>';
        if (this.loadingId == 0) {
            //延迟150ms出现
            this.loadingId = setTimeout(function(){$('body').append(html);}, 150);
        }
            
    }
    ,hideLoading: function() {
        clearTimeout(this.loadingId);
        $("#loading_box").remove();
    }
    //获取微信版本号
    ,getWxVer: function() {
        var ua = window.navigator.userAgent.toLowerCase();
        var preg = /MicroMessenger\/([0-9\.]+)/i;
        var a = ua.match(preg);
        if (a) {
            return a[1];
        }
        return false;
    }
    ,canWeixinPay: function() {
        //var isWeixin =  this.isWeiXin();
        var ver = this.getWxVer();
        if (ver == false) {
            return false;
        }
        var vers = ver.split('.');
        console.log(vers);
        if (parseInt[vers[0]] < 5) {
            return false;
        }
        return true;
    }
    ,goPage: function(page, params) {
        var strQuery = "";
        if (params) {
            var query = [];
            for (i in params) {
                query.push(i +"=" + params[i]);
            }
            strQuery = query.join('&');
        }
        if (strQuery != '') {
            page += "?" + strQuery;
        }
        window.location.href = page;
        return;
    }
    ,goKefu: function(param){
        location.href = "http://kefu.easemob.com/webim/im.html?tenantId=23970";
    }
    ,isIphone: function() {
        var ua = navigator.userAgent.toLowerCase();	
        if (/iphone|ipad|ipod/.test(ua)) {
             return true;		
        } 
        return false;
    }
};
//存储相关
var Storge = {
    removeItem: function(e) {
        return localStorage.removeItem(e);
    }
    ,getItem: function(e, d) {
        var r = localStorage.getItem(e);
        if (d != undefined && r == undefined) {
            return d;
        }
        return r;
    }
    ,setItem: function(k, e) {
        return localStorage.setItem(k, e);
    }
    
};  

//功能导航
var FuncNavi = {
    data: {},
    funcs: [], //回调函数列表
    html: function(data) {
        var default_icons = {
            'index': 'img/hw_72.png',
            'product': 'img/hw_74.png',
            'cart': 'img/hw_78.png',
            'center': 'img/i_user.png',
        };
        var paths_icons = {
               '/webapp/' : {
                   key: 'index',
                   icon: 'img/s_home.png',
               },
               '/webapp/index.html' : {
                   key: 'index',
                   icon: 'img/s_home.png',
               },
               '/webapp/allproduct.html' : {
                   key: 'product',
                   icon: 'img/s-all.png',
               },
               '/webapp/king.html' : {
                   key: 'center',
                   icon: 'img/hw_80.png',
               },
               '/webapp/supplier.html' : {
                   key: 'center',
                   icon: 'img/hw_80.png',
               },
               '/webapp/shoppingCart.html' : {
                   key: 'cart',
                   icon: 'img/s-cart.png',
               }
        };
        var pathname = location.pathname;
        if (pathname in paths_icons) {
            var icon_info = paths_icons[pathname];
            default_icons[icon_info['key']] = icon_info['icon'];
        }
        var html = '<div class="u-bottomnav">'
                     + '<a href="index.html">'
                     + '<img src="'+default_icons.index+'">'
                     + '<p>首页</p>'
                     + '{$idx_num}</a>'
                     + '<a href="allproduct.html">'
                     + '<img src="'+default_icons.product+'">'
                     + '<p>所有产品</p>'
                     + '{$prod_num}</a>'
                     + '<a href="javascript:;">'
                     + '<img src="img/hw_76.png">'
                     + '<p>发现</p>'
                     + '{$find_num}</a>'
                     + '<a id="navi_goods_cart" href="{$cart_action}">'
                     + '<img src="'+default_icons.cart+'">'
                     + '<p>购物车</p>'
                     + '{$cart_num}</a>'
                     + '<a id="navi_ucenter" href="{$ucenter_action}">'
                     + '<img src="'+default_icons.center+'">'
                     + '<p>个人中心</p>'
                     + '{$uc_num}</a></div>';
         //shoppingCart.html , king.html
        var clickNone = 'javascript:;';
        var conf = {
            idx_num: '',
            prod_num: '',
            find_num: '',
            cart_num: '',
            uc_num: '',
        };
        var htmlStr = html;
        
        
        for (i in conf) {
            var vn = conf[i];
            if (data && data[i]) {
                vn = data[i];
            }
            if (vn) {
                htmlStr = htmlStr.replace("{$"+i+"}", "<span>"+vn+"</span>");
            } else {
                htmlStr = htmlStr.replace("{$"+i+"}", '');
            }
            
        }
        if (data && data.is_login) {
            //已登陆
            //to-do 不同角色，不同页面
            
            var ucenter_page = "king.html?" + Math.random();
            if (data.user.role >= Const.USER_ROLE_SUPPLIER) {
                ucenter_page = "supplier.html?"+ Math.random();
            }
            htmlStr = htmlStr.replace('{$cart_action}', 'shoppingCart.html')
                                     .replace('{$ucenter_action}', ucenter_page);
            window['hwy'] =  data;  // 全局存放        

             // 再注册分享事件
            
        } else if (data && data.is_login == 0){
            if (Util.isWeiXin()) {
                //微信内，直接跳登录
                Util.goWxLogin(window.location.href);
                return ;
            }
            var sid = Util.getQueryString('sid');
            var cl = "";
            if (sid) {
                cl = "&sid=" + sid;
            }
            htmlStr = htmlStr.replace('{$cart_action}', 'login.html?redirect=' + config.page.cart + cl)
                                     .replace('{$ucenter_action}', 'login.html?redirect=' + config.page.user_king + cl);
        } else {
            //初始化，不允许点击
             htmlStr = htmlStr.replace('{$cart_action}', clickNone)
                                      .replace('{$ucenter_action}', clickNone);
        }
        
        return htmlStr;
    }
    ,rendNavi: function(data) {
         var me = this;
         var html = me.html(data);
         $('.u-bottomnav').remove();
         if (!me.notShow) {
            $('body').append(html);
         }
         //渲染消息提醒
         if (data.msg_cnt) {
             $(".msgbox .msg").show();
         }
    }
    //加载提醒数据
    ,loadNaviData: function() {
          var sid = Util.getQueryString('sid');
          var params = {};
          if (sid) {
              params['sid'] = sid;
          }
          
          var api = config.api + "?r=center/navi";
          var me = this;
          if ( true) {
              $.ajax({
                  url: api,
                  data: params,
                  dataType : "jsonp",
                  success: function(data) {
                       if (data.errno ==0) {
                           me.data = data.data;
                           data.data  && me.rendNavi(data.data);
                       }
                       
                       for (i in me.funcs) {
                           me.funcs[i].func(me.data, me.funcs[i].proxy);
                       }
                  }
                  
            });
          }
          
    }
    ,addCallback: function (func, proxy) {
        var me = this;
        if (typeof func == 'function') {
            me.funcs.push({
                'proxy': proxy,
                'func'  : func
            });
        }
    }
    ,run: function(notShow) {
        //this.rendNavi();
        $('.u-bottomnav').remove();
        this.notShow = notShow;
        this.loadNaviData();
    }
};

//搜索工具
var SearchBox = {
    cacheKey: 'ecs_search'
    ,cacheKeep: 10 //缓存保留记录数
    ,addKeyWord: function(words) {
        var list = this.getCaches();
        var length = 1;
        var idx = this.isKeywordExists(words, list);
        if (idx) {
            //已经存在，暂不处理
            length = list.length;
        } else {
            length = list.unshift(words);
        }
        if (length > this.cacheKeep) {
            list.pop();
        }
        Storge.setItem(this.cacheKey, list.join('|'));
    }
    
    ,isKeywordExists: function(needle, arr) {
        for (i in arr) {
            if (arr[i] == needle) {
                return i;
            }
        }
        return false;
    }
    ,clearCache: function() {
        Storge.removeItem(this.cacheKey);
    }
    ,getCaches: function() {
        var list = Storge.getItem(this.cacheKey);
        if (list) {
            return list.split('|');
        } else {
            return [];
        }
    }
    //渲染搜索列表
    ,renderHistory: function() {
        var me = this;
        var list = me.getCaches();
        var html = "";
        for(i in list) {
            item = decodeURI(list[i]);
            html += "<li>"+Util.escape(item)+"</li>";
        }
        $('#js-searchHistory-li').html(html);
    }
    //在搜索框显示
    ,showinbox: function(word) {
        $('#js-search').val(word);
    }
    //绑定搜索事件
    ,bindSearchBntEvent: function() {
        var me = this;
        
        $('#js-titleSubmit').click(function(){
            var keyword = $.trim($('#js-search').val());
            if (keyword) {
                keyword = encodeURI(keyword);
                me.addKeyWord(keyword);
                //me.renderHistory();
                window.location.href = "allproduct.html?k="+keyword;
            }
        });
        $("#js-searchHistory-li").delegate('li', 'click',function(){
            var keyword = $(this).html();
            window.location.href = "allproduct.html?k="+keyword;
            
        });
        //删除历史记录
        $('.u-button-storkmain').click(function(){
            me.clearCache();
            me.renderHistory();
        });
        
        $('#js-search').keydown(function(e){
            if (event.keyCode == "13") {
                //回车
                $('#js-titleSubmit').trigger('click');
            }
        });
    }
    ,run: function() {
        this.bindSearchBntEvent();
        this.renderHistory();
    }
};

//购物车相关操作
var goodsCart = {
    
    
    add: function(goodsId, num, type, callback) {
        var num = num ? num : 1;
        var api = config.api + "?r=cart/add";
            $.ajax({
                url: api,
                dataType : "jsonp",
                data: {goods_id: goodsId, num:num,type:type},
                success: function(data) {
                    
                    if (typeof callback == 'function') {
                        callback(data);
                    } else {
                        messageBox.toast(data.errmsg);
                    }
                }
            });
    }
    ,remove: function(goodsIds, callback) {
        Util.requestApi('?r=cart/remove', {goods_ids:goodsIds}, callback)
    }
    ,buy: function(goodsId) {
        Util.goPage(config.page.confirm_order, {goods_ids:goodsId, type:'right'});
    }
    //购物车操作
    ,bindAddEvent: function() {
        var me = this;
        $('#add').click(function(){
            var goodsId = $(this).attr('data-id');
            me.add(goodsId);
        });
        $('#buy').click(function(){
            var goodsId = $(this).attr('data-id');
            me.buy(goodsId);
        });
        
    }
    
    ,updateSettle: function() {
        var goodCnt = 0;
         var goodPrice = 0;
         //计算勾选的货品数量，价格总额
         $(".u-shoppingCartlist .nomalBox input[type=checkbox]:checked").each(function(i){
              var dataInfo = $(this).attr('data-info').split('|');
              var num = parseInt(dataInfo[2]);
              var price = parseFloat(dataInfo[1]).toFixed(2);
              goodCnt++;
              goodPrice += price * num;
         });
         if (goodCnt) {
            $('#cart_num').html("("+goodCnt+")"); //
            $('#settlement').html("("+goodCnt+")");  //结算
            $('#money').html(goodPrice); 
         } else {
            $('#cart_num').html('');
            $('#money').html(0);
            $('#settlement').html("(0)"); 
             }
    }
    //绑定购物车列表页事件
    ,bindCartListEvent: function() {
        var me = this;
        //购物车勾选事件
        $('.u-shoppingCartlist').delegate('.u-checkbox', 'change', function() { 
             //购物车勾选变化
             //遍历所有checkbox
             me.updateSettle();

        }); 
        
        //全选事件
        $(".u-pay input[type=checkbox]").change(function(){
             console.log("全选");
             if ($(this).attr('checked') ) {
                $('.u-shoppingCartlist input[type=checkbox]').prop('checked', true).trigger('change');
                 
             } else {
                //取消全选
                $('.u-shoppingCartlist input[type=checkbox]').prop('checked', false).trigger('change');

             }
        });
        
        $("#edit_box a[data-role=clear]").click(function(){
            //批量删除
          
           var goodsIds =  $(".u-shoppingCartlist input[type=checkbox]:checked").map(function(i){
                    var dataInfo = $(this).attr('data-info').split('|');
                    return dataInfo[0];
                    }).get().join(',');
                    
            if (goodsIds) {
                
                messageBox.confirm("确认要删除选中商品吗？", function(){
                    goodsCart.remove(goodsIds, function(data){
                        messageBox.toast(data.errmsg);
                        if (data.errno == 0) {
                            location.reload();
                        }
                    });
                });
            }
        }); 
        
        //结算
        $('.u-pay .paynow').click(function() {
            var goodsIds = $(".u-shoppingCartlist input[type=checkbox]:checked").map(function(){
                var info = $(this).attr('data-info').split('|');
                return info[0];   
            }).get().join(',');
            if (goodsIds) {
                //跳转到订单提交页面
                window.location.href = config.page.confirm_order + "?goods_ids=" + goodsIds;
            } else {
                messageBox.toast("请选择商品");
            }
            
        });
        
        $("#edit_bnt").click(function(){
            var status = $(this).attr('data-status');
            if (status == 'edit') {   
                //关闭
                $(this).attr('data-status', 'show').html("编辑");
                $(".u-shoppingCartlist .nomalBox").show();
                $(".u-shoppingCartlist .editbox").hide();
                $("#settlement_box").show();
                $("#edit_box").hide();
                me.loadmyGoodsCart();
                
                //更新列表
            } else {
                //打开编辑状态 
                $(this).attr('data-status', 'edit').html("完成");
                $(".u-shoppingCartlist .nomalBox").hide();
                $(".u-shoppingCartlist .editbox").show();
                $("#settlement_box").hide();
                $("#edit_box").show();
            }
            
        });
        
        $(".u-shoppingCartlist").delegate('button','click', function(){
            var type = $(this).attr('data-type');
            var datainfo = $(this).closest('.editbox').attr('data-info');
            var self = this;
            if (datainfo) {
                //有数据信息
                var infos = datainfo.split("|");
                var appendNum = 0;
                infos[2] = parseInt( infos[2]);
                if (type == 'min') {
                    if (infos[2] == 1) {
                        //messageBox.toast("不能再少了");
                        return ;
                    } else {
                        appendNum --;
                    }
                }
                if (type == 'max') {
                    appendNum ++;
                }
                
                if (appendNum != 0) {
                    me.add(infos[0], appendNum, 'edit', function(data){
                            if (data.errno != 0) {
                                messageBox.toast(data.errmsg);
                                return;
                            }
                            if (data.errno == 0) {
                                infos[2] += appendNum;
                                $(self).closest('.editbox').attr('data-info', infos.join('|'));
                                $(self).closest('.editbox').find('.goods_number').html(infos[2]);
                            }
                     
                    });
                }
                
                if (type == "remove") {
                    //移除
                    messageBox.confirm("确认要删除该商品吗?", function(){
                       
                        me.remove(infos[0], function(data){
                            messageBox.toast(data.errmsg);
                            if (data.errno == 0) {
                                location.reload();
                            }
                        });
                    });
                }
                
            }
        });
    }
    //渲染购物车列表
    ,renderCartList: function(data) {
        var template = $('#cart_template').html();
        var html = "";
        for (i in data.list) {
            var item = data.list[i];
            var datainfo = item.goods_id+"|"+item.goods_price+"|"+item.goods_num;
            /**
            html += template.replaceAll('{$title}', item.goods_name)
                            .replaceAll('{$money}', item.goods_price)
                            .replaceAll('{$img}', item.goods_img)
                            .replaceAll('{$number}', item.goods_num)
                            .replaceAll('{$data}', datainfo);
            **/                
            item.datainfo = datainfo;
            html += Template.renderByTemplate(template, item);
        }
        if (html) {
            $('.u-shoppingCartlist').html(html);
            
        } else {
            $('.u-shoppingCartlist .empty').show();
            $("#edit_bnt,.u-pay").hide();
        }
        goodsCart.updateSettle();
       
    }
    ,loadmyGoodsCart: function() {
        //加载我的购物车
        var me = this;
        var api = config.api + "?r=cart/get";
            $.ajax({
                url: api,
                dataType : "jsonp",
                success: function(data) {
                    if (data.errno == 0) {
                        data.data && me.renderCartList(data.data);
                    } else {
                        messageBox.toast(data.errmsg);
                    }
                }
            });
    }
    //进入购物车
    ,runGoodsCart: function() {
        this.loadmyGoodsCart();
        this.bindCartListEvent();
    }
    
};

//首页&&商品详情&&搜索
var Bootstrap = {
    data: []
    ,toast: function(msg) {
        messageBox.toast(msg);
    }
    ,searchQuery: {p:1,hasMore:1}
    //渲染首页按分类的商品列表
    ,renderHomeCategoryPage: function(data) {
        for (i in data) {
            //
            var item = data[i];
            var show = $('.u-box-left33-right66').eq(i);
            show.find('.content img').map(function(idx,ix){
                $(ix).attr('src',item['goods'][idx].img)
                     .attr('data-role', 'good')
                     .attr('good-id',item['goods'][idx].id);
            });
            var box = $('.u-threerowsbox').eq(i);
            box.find('.content img').map(function(idx,ix){
                idx += 3;
                $(ix).attr('src',item['goods'][idx].img)
                     .attr('data-role', 'good')
                     .attr('good-id',item['goods'][idx].id);
            });
        }
    }
    
    //渲染商品详情
    ,renderGoodsDetail: function(data) {
        var me = Bootstrap;
        $(".details-infobox .cont").html(data.detail);
        var attrHtml = "";
        var attrItemTemplate = "<p>{$key}: {$value}</p>";
        //轮播图模版
        var slideTemplate = '<div class="slide-list"><img src="{$src}" alt=""></div>';
        for (i in data.attr) {
            var item = data.attr[i];
            if (item.value != '') {
                attrHtml += attrItemTemplate.replace('{$key}', item.key)
                            .replace('{$value}', item.value);
            }
        }
        var slideHtml = '';
        for (i in data.pics) {
            var item = data.pics[i];
            slideHtml += slideTemplate.replace('{$src}', item);
        }
        $(".productinfo-head .title").html(data.title); 
        $(".productinfo-head .shop_price").html(data.price); 
        $(".productinfo-head .view").html(data.view_cnt); 
        $(".productinfo-head .likes").html(data.likes_cnt); 
        $(".productinfo-list .cont").html(attrHtml);
        $(".details-slide .slides").html(slideHtml);
        $("#add,#buy,#detail_collect,#detail_likes_up").attr('data-id', data.id);
        $("#detail_collect").attr('data-collected', data.is_collected);
        me.updateIcon(data.is_collected);
        me.setLikes(data.id);
        var swiper = new hlSwiper("#hl-swiper", {
            loop: true, //是否循环
            autoloop: true, //是否自动循环
            speed: 3000 //间隔时间毫秒
        });
        
        //重新注册分享信息
        window.shareContent = {
            title: data.title + "-洪五爷珠宝",
            desc: "让珠宝不再暴利,让珠宝零距离,让志同道合的业者都能共享平台成果",
            img: data.thumb,
        };
        if (data.sid != "") {
            Share.sid = data.sid;
        }
        Share.registerShare();
        //加入浏览记录
        History.addGoodsView(data.id);
    }
    ,setLikes: function(goodsId) {
        var key = 'gl_' + goodsId;
        var likeCnt = parseInt(Storge.getItem(key, 0));
        if (isNaN(likeCnt)) {
            likeCnt = 0;
        }
        if (likeCnt > 0) {
            $("#detail_likes_up img").attr('src', 'img/s-likes.png');
        }
    }
    ,updateIcon: function(collected) {
        
        if (collected == "1") {
            $("#detail_collect img").attr('src', 'img/star.png');
        } else {
            $("#detail_collect img").attr('src', 'img/details_22.png');
        }
    }
    //渲染搜索/所有产品页面
    ,renderSearch: function(data, append) {
        //console.log(data);
        var me = this;
        me.searchQuery.hasMore = data.hasMore;
        var template = $('#search-list-item').html();
        var html = '';
        for (i in data.list) {
            var item = data.list[i];
            html += template.replace('{$id}', item.id)
                    .replace('{$title}', item.title)
                    .replace('{$fav_cnt}', item.fav_cnt)
                    .replace('{$price}', item.price)
                    .replace('{$img}', item.img);
        }
        if (append == false) {
            if (html){
                $('.u-productlist').html(html);
            } else {
                $('.u-productlist').html($("#search-empty").html());
            }
        } else {
           $('.u-productlist').append(html);
        }
        
    }
    ,bindEvent: function(){
        //查看商品详情
        $('.content img').click(function(e){
            var goodId = $(this).attr('good-id');
            if (goodId) {
                window.location.href = "details.html?id="+goodId;
            }
        });
    }
    ,loadHomeCategoryGoods: function() {
        var api = config.api + '?r=good/index';
        var me = this;
        $.ajax({
            url : api,
            dataType : "jsonp",
            success: function(data) {
                if (data.errno == 0) {
                    data.category_goods && me.renderHomeCategoryPage(data.category_goods);
                } else {
                    me.toast(data.errmsg);
                }
            }
        });
    }
    ,loadGoodsDetail: function(goodsId) {
        var api = config.api + '?r=good/detail';
        var me = this;
        $.ajax({
            url: api,
            data: {id:goodsId},
            dataType: 'jsonp',
            success: function(data) {
                if (data.errno == 0) {
                    data.data && me.renderGoodsDetail(data.data);
                } else if (data.errno = 404) {
                    me.toast("商品不存在货已经下架");
                }
            }
        });
    }
    //搜索
    ,loadSearch: function(query, append) {
        var api = config.api + '?r=good/search';
        var me = this;
        Util.showLoading();
        $.ajax({
            url: api,
            data: query,
            dataType: 'jsonp',
            success: function(data) {
                Util.hideLoading();
                if (data.errno == 0) {
                    data.data && me.renderSearch(data.data,append);
                }
            }
        });
    
    }
    //检查滚动条是否到底部了
    ,checkWindowAtButtom: function() {
        return $(window).scrollTop() >= $(document).height()-$(window).height();
    }
    //处理搜索列表下拉
    ,handleSearchPull: function() {
        var me = Bootstrap;
        if (me.checkWindowAtButtom()) {
            console.log(me.searchQuery.hasMore);
            if (me.searchQuery.hasMore) {
                me.searchQuery.p += 1;
                me.loadSearch(me.searchQuery);
            }
            
        }
    }
    //渲染搜索分类
    ,reanderCategoriesArea: function(data) {
        //部位
        if (data[2]) {
            var html = '';
            list = data[2].list;
            for (i in list) {
                var item = list[i];
                html += "<a class=\"option\" data-role=\"buwei\" data-id= "+item.id+">"+item.name+"</a>";
            }
            $(".u-choosecontbox[data-role=buwei]").append(html);
        }
        //材质
        if (data[1]) {
            var html = '';
            list = data[1].list;
            for (i in list) {
                var item = list[i];
                 html += "<a class=\"option\" data-role=\"caizhi\" data-id= "+item.id+">"+item.name+"</a>";
            }
            $(".u-choosecontbox[data-role=caizhi]").append(html);
        }
        //筛选
        if (data[3]) {
            var list = data[3].list;
            for (i in list) {
                item = list[i];
                var html = "<div><span class=\"name\">"+ item.name +"</span></div><div class=\"priceboxes\">";
                for (j in item.children) {
                    var cat = item.children[j];
                    html += "<a href='javascript:;' data-role='shaixuan'  data-name='"
                         + cat.name+"' data-id='"+cat.id+"' >"
                         + cat.name+"</a>";
                }
                html += "</div>";
                $(html).insertBefore('#js-shaixuan-bnt');
            }
            
        }
    }
    //加载搜索的分类
    ,loadSearchCategories: function() {
        var api = config.api + '?r=good/getcategories';
        var me = this;
        $.ajax({
            url: api,
            dataType: 'jsonp',
            success: function(data) {
                if (data.errno == 0) {
                    data.data && me.reanderCategoriesArea(data.data);
                }
            }
        });
    }
    //产品搜索，监听滚动条事件
    ,bindSearchScroll: function() {
        var me = this;
        $(window).scroll(me.handleSearchPull);
    }
    
    ,getSearchQuery: function() {
        var me = Bootstrap;
        var cids = [];
        //获取分类ids
        $('#js-chooseclass .cont').each(function(i,e){
            cids.push($(e).attr('data_cat_id'));
        });
        //获取排序
        var sort_id = $(".u-choosecontbox a.on").attr('data-id');
        
        if (sort_id) {
            me.searchQuery.sort = sort_id;
        } else {
            me.searchQuery.sort = 0;
        }
        
        //价格
        
        var p_from = $("#price-range input[name=from]").val();
        var p_to = $("#price-range input[name=to]").val();
        if (p_from) {
            me.searchQuery.p_from = p_from;
        }
        if (p_to) {
            me.searchQuery.p_to = p_to;
        }
        me.searchQuery['cids'] = cids.join(',');
        me.searchQuery.p = 1; //重置页码
    }
    //搜索变化事件
    ,triggerSearchChange: function() {
        var me = this;
        me.getSearchQuery();
        $(".u-choosecontbox").hide();
        $('#js-navSelect div').removeClass('on');
        me.loadSearch(me.searchQuery, false);
    }
    ,bindSearchEvent: function() {
    
        var me = this;
        $('#js-navSelect select').change(function() {
            //获取查询条件
            me.triggerSearchChange();
        });
        $('#js-navSelect').delegate('div','click', function(){
            var role = $(this).attr('data-role');
            //其他的隐藏，
            var hasOn = $(this).hasClass('on');
            $('#js-navSelect div').removeClass('on');
            $(".u-choosecontbox").hide();
            if (hasOn) {
                
            } else {
                $(this).addClass("on");
                $(".u-choosecontbox[data-role="+role+"]").show();
                
            }
        });
        
        $("#price_confirm").click(function(){
            me.triggerSearchChange();
        });
        //取消查询条件
        $("#js-chooseclass").delegate('div', 'click', function(){
            
            if ($(this).attr('data-role') == 'shaixuan') {
                //将筛选对应的高亮取消
                var id = $(this).attr('data_cat_id');
                $("#js-choosecontbox a").each(function(){
                    var dataId = $(this).attr('data-id');
                    if (id == dataId) {
                        $(this).removeClass("on");
                        return;
                    }
                 });
            }
            $(this).remove();
            
            me.triggerSearchChange();
        });
        function createOption(optionCont, cid, role) {
            
            var nodeDiv = document.createElement('div');
            var nodeP = document.createElement('p');
            var nodeImg = document.createElement('img');

            nodeDiv.setAttribute('class','cont');
            nodeDiv.setAttribute('data_cat_id', cid); //设置分类id
            nodeDiv.setAttribute('data-role', role); //设置分类id
            nodeP.innerHTML = optionCont;
            nodeImg.setAttribute('src','img/hongwu_61.png');

            nodeDiv.appendChild(nodeP);
            nodeDiv.appendChild(nodeImg);
            return nodeDiv;
        }
        function addSearchTips(role, id, name) {
            var item = $("#js-chooseclass div[data-role="+role+"]");
            if (item.length) {
                //相同的分类已经存在，则更新id和 内容
                item.attr('data_cat_id', id);
                item.find("p").html(name);
            } else {
                $("#js-chooseclass").append(createOption(name,id,role));
            }
        }
        $(".u-choosecontbox").delegate("a", "click",  function(event){
            var role = $(this).attr('data-role');
            var cid = $(this).attr('data-id');
            var name = $(this).html();
            if (role != 'paixu') {
                //分类改变
                addSearchTips(role,cid,name);
            }
            if (role == 'paixu') {
                //排序改变
                var isOn = $(this).hasClass("on");
                $(".u-choosecontbox[data-role=paixu] a").removeClass('on');
                $(".u-choosecontbox[data-role=paixu] span").hide();
 
                if (!isOn) {
                    $(this).addClass("on");
                    $(this).find('span').show();
                } 
            }
            if (role == 'shaixuan') {
                $("#js-choosecontbox a").removeClass('on');
                $(this).addClass("on");
            }
            
            me.triggerSearchChange();
        });
        
        $(".u-productlist").delegate('a', 'click', function(){
            var goodsId = $(this).attr('data-id');
            //location.href = ;
            
            if (goodsId) {
                var url = config.page.detail + "?id="+goodsId;
                var stateObj = { goods_id: goodsId};
                context = {
                    'search' : me.searchQuery,
                    'context' : $("#context").html(),
                };
                Storge.setItem("search_context" , JSON.stringify(context));
                setTimeout(function(){location.href = url;}, 100);
            }

        });
    }
    //绑定详情页事件
    ,bindDetailEvent: function() {
        var me = this;
        //detail_collect
        //收藏
        $('#detail_collect').click(function(){
            var goodsId = $(this).attr('data-id');
            if (!goodsId) return;
            var collected = $(this).attr('data-collected') == '1' ? 0 : 1;
            if ($(this).attr('data-collected') == '1') {
                //移除
                var api = config.api + "?r=collect/remove";
                $.ajax({url: api,dataType:'jsonp',
                    data: {goods_ids: goodsId},
                    success:function(data){
                        //成功
                        messageBox.toast(data.errmsg);
                        $('#detail_collect').attr('data-collected', 0);
                }});
            } else {
                //可以收藏
                var api = config.api + "?r=collect/add";
                $.ajax({url: api,dataType:'jsonp',
                    data: {goods_id: goodsId},
                    success:function(data){
                        //成功
                        $('#detail_collect').attr('data-collected', 1);
                        messageBox.toast(data.errmsg);
                        
                }});
            }
            me.updateIcon(collected);
        });
        //detail_likes_up
        //点赞
        $('#detail_likes_up').click(function(){
            //var me = this;
            var goodsId = $(this).attr('data-id');
            if (!goodsId) {
                return ;
            }
            var key = 'gl_' + goodsId;
            var likeCnt = parseInt(Storge.getItem(key, 0));
            if (isNaN(likeCnt)) {
                likeCnt = 0;
            }
            if (likeCnt >= 15) {
                messageBox.toast("只能点赞15次");
                return ;
            }
            var api = config.api + "?r=good/likes";
            $.ajax({
                url: api,
                dataType: 'jsonp',
                data: {goods_id: goodsId},
                success: function(data) {
                    messageBox.toast(data.errmsg);
                    if (data.errno == 0) {
                        Storge.setItem(key, (likeCnt + 1) + '');
                        //详情点赞数 + 1
                        var oldCnt = parseInt($('.rightbox .likes').html());
                        $('.rightbox .likes').html(oldCnt + 1);
                        me.setLikes(goodsId);
                    }
                }
            });
            
        });
        $("#share").click(function(){
             Share.shareFriend();
        });
        
    }
    
    //首页入口
    ,runHome: function() {
       this.loadHomeCategoryGoods();
       this.bindEvent();
       
    }
    //商品详情页入口
    ,rungoodsdetail: function() {
        var goodsId = Util.getQueryString('id');
        this.loadGoodsDetail(goodsId);
        this.bindDetailEvent();
    }
    
    //搜索/所有产品入口
    ,runsearch: function() {
        var me = this;
        var context = Storge.getItem("search_context");
        if (context ) {
            //返回,恢复现场
            context = JSON.parse(context);
            Storge.removeItem("search_context");
            $("#context").html(context.context);
            me.searchQuery = context.search;
        } else {
            
            var k = Util.getQueryString('k');
            if (k) {
                $('title').html("搜索-"+Util.escape(k));
            }        
            this.loadSearchCategories();
            this.searchQuery.k = k;
            this.loadSearch(this.searchQuery, false);
        }
        this.bindSearchScroll();
        this.bindSearchEvent();
        
    }
};

//订单相关处理
var Order = {
    order_info : {}
    ,order_types : {
        'all':0,
        'wait_pay': 100,
        'wait_ship': 101,
        'wait_receive': 103,
        'wait_comment':104,
    }
    ,bindConfirmEvent: function() {
        var me = this;
        var lock = false;
        $('.u-mainbutton-little').click(function(){
            if (lock) {
                  return ; //屏蔽重复点击操作
            }
            if (me.order_info.order_sn) {
                me.gotoPay(me.order_info.order_sn);
                return;
            }
            //确认按钮点击事件
            var addressId = $('.placeorder-address').attr('data-address');
            if (!addressId) {
                messageBox.toast("请选择收货地址");
                return ;
            }
            var goodsIds = $('.u-productlist02').map(function(){
                return $(this).attr('data-id');
            }).get().join(',');
            if (!goodsIds) {
                messageBox.toast("商品列表为空");
                return ;
            }
            //是否选择运费险
            var express_insure  = $('.placeorder-infobox input[type=checkbox]').attr('checked') ? 1 : 0;
            
            var remarks = $('#remarks').html(); //备注信息
            //调用下单接口，获取订单号，成功的话跳转到支付页面
            var api = "?r=order/submit";
            var request = {
                'goods_ids' : goodsIds,
                'remarks': remarks,
                'address_id': addressId,
                'express_insure': express_insure,
            };
            lock = true;
            //请求下单接口，获得订单
            Util.requestApi(api, request, function(data){
                    lock = false;
                    if (data.errno != 0) {
                          messageBox.toast(data.errmsg);
                    } else {
                        me.order_info.order_sn = data.data.order_sn;
                        me.gotoPay(me.order_info.order_sn);
                    }
                
            });
            
            
        });
        
        //运费险打勾事件
        $('.placeorder-infobox input[type=checkbox]').click(function(){
            var checked = $(this).attr('checked') ? 1 : 0;
            var goods_cost =  me.order_info.goods_cost;
            var need_Pay = parseFloat(goods_cost);
            if (checked) {
                need_Pay += 2; //2块钱运费险
            }
            $('#confirm_price_bottom, #confirm_price').html("￥ " + need_Pay.toFixed(2));
        });
    }
    
    //跳转去支付
    ,gotoPay: function(order_sn) {
        window.location.href = config.page.order_pay + "?order=" + order_sn ;
    }
    ,gotoDetail: function(order_sn) {
        window.location.href = config.page.order_detail + "?order=" + order_sn ;
    }
    ,renderConfirmPage: function(data) {
        var tempate = $('#confirm_goods_template').html();
        var html = "";
        for(i in data.list) {
            var item = data.list[i];
 
            html += Template.renderByTemplate(tempate, item);
        }
        $(html).insertAfter('.placeorder-address');
        $('#order_confirm_num').html(data.goods_count);
        $('#confirm_price_bottom, #confirm_price').html("￥ " + data.goods_cost);
        
        //渲染地址
        if (data.address) {
            var address = data.address.province + data.address.city + data.address.district + data.address.address;
            $('#selected_consignee').html(data.address.consignee);
            $('#selected_mobile').html(data.address.mobile);
            $('#selected_address').html(address);
            $('#selected_consignee_box').show();
            $('.placeorder-address').attr('data-address', data.address.address_id);
        }
    }
    ,loadOrderInfo: function() {
        //加载订单确认信息
        var goodsIds = Util.getQueryString('goods_ids');
        var type = Util.getQueryString('type');
        var api = config.api + "?r=order/getorderinfo";
        var me = this;
        $.ajax({
            url: api,
            dataType: 'jsonp',
            data: {goods_ids:goodsIds,type:type},
            success: function(data) {
               if (data.errno == 0) {
                   me.order_info = data.data;
                   data.data && me.renderConfirmPage(data.data);
               } else {
                    messageBox.toast(data.errmsg);
                    if (data.errno == ErrorCode.NO_LOGIN) {
                        //跳转登录
                        Util.goLogin();
                    } else {
                       // history.go(-1);
                    }
               }
            }
        });
    }
    //订单确认
    ,runConfirm: function() {
        this.loadOrderInfo();
        this.bindConfirmEvent();
    }
    
    //订单主页面事件绑定
    ,bindMainEvent: function() {
        var me = this;
        
        $('#js-changecont').delegate('div', 'click', function() {
                var order_type = $(this).attr('data-type');
                //Util.setHash(order_type);
                me.loadOrder(order_type, 1);
        });
        $('#js-contbox01').delegate('.order_goods_list', 'click', function(){
              var order_sn = $(this).attr('order-sn');
              if (order_sn) {
                  window.location.href = config.page.order_detail + "?order=" + order_sn;
              }
        });
        $('body').delegate('button', 'click', function(){
            
            var order_sn = $(this).parent().attr('order-sn'); 
            var type = $(this).attr('data-type');
            if (!order_sn) {
                
                return ;
            }
            if (type == 'pay') {
                //去支付
                window.location.href = config.page.order_pay + "?order=" + order_sn;
            }
            if (type == 'comment') {
                //评价
                messageBox.toast("功能升级中,敬请期待");
            }
            if (type == 'remind') {
                //提现发货
                messageBox.toast("已提醒卖家，尽快为您发货");
            }
            if (type == 'cancel') {
                //取消订单
                
                location.href = "myorder-cancel.html?order="+order_sn;
                return;
                messageBox.confirm("您确定要取消订单吗？", function(){
                    Util.requestApi('?r=order/cancel', {order:order_sn}, function(data){
                            messageBox.toast(data.errmsg);
                            if (data.errno == 0) {
                                //重新加载列表
                                var type = $('#js-changecont .on').attr('data-type');
                                me.loadOrder(type, 1);
                            }
                        
                    });
                });
            }
            if (type == 'receive') {
                //确认收货
                messageBox.confirm("确认已经收到商品",function(){
                    Util.requestApi('?r=order/receive', {order:order_sn}, function(data){
                            messageBox.toast(data.errmsg);
                            if (data.errno == 0) {
                                //重新加载列表
                                var type = $('#js-changecont .on').attr('data-type');
                                //me.loadOrder(type);
                                setTimeout(function(){
                                    $("#js-changecont div[data-type=wait_comment]").trigger('click');
                                }, 1200);
                                
                            }
                        
                    });
                });
            }
        });
        
        //下拉事件
        $(window).scroll(me.orderMainScrollEvent);
    }
    //订单下拉事件实际处理
    ,orderMainScrollEvent: function() {
        var me = Order;
        console.log("gun");
        if (Bootstrap.checkWindowAtButtom()) {
        console.log("底部了");
            //到底部了，加载更多
            var type = $("#js-changecont .on").attr('data-type');
            var p = me.page;
            var hasMore = me.hasMore;
            if (hasMore) {
                console.log("底部触发下拉");
                me.loadOrder(type, p + 1);
            }
        }
        
    }
    //获取支付相关按钮
    ,renderPayBntsAndTips: function(goods) {
            var normalBntTemplate = $('#order_list_button').html();
            var mainBntTemplate = $('#order_list_button_main').html();
            var Buttons = "";
            var tips = "";
            if (goods.order_status == 100) {
                //待支付
                tips = "待付款";
                Buttons += normalBntTemplate.replace('{$type}', 'cancel').replace('{$tips}', '取消订单');
                Buttons += mainBntTemplate.replace('{$type}', 'pay').replace('{$tips}', '立即付款');
            }
            if (goods.order_status == 101) {
                //待发货
                tips = "待发货";
                Buttons += mainBntTemplate.replace('{$type}', 'remind').replace('{$tips}', '提醒发货');
            }
            if (goods.order_status == 103) {
                //待收货
                tips = "待收货";
                Buttons += mainBntTemplate.replace('{$type}', 'receive').replace('{$tips}', '确认收货');
            }
            if (goods.order_status == 104) {
                //待评价
                tips = "待评价";
                Buttons += mainBntTemplate.replace('{$type}', 'comment').replace('{$tips}', '立即评价');
            }
            if (goods.order_status == 102) {
                tips = "已完成";
                //已完成，已评价
                Buttons += mainBntTemplate.replace('{$type}', 'done').replace('{$tips}', '已完成');
            }
            if (goods.order_status == 105) {
                tips = "已取消";
            }
            if (goods.order_status == 107) {
                tips = "已退货";
            }
            if (goods.order_status == 108) {
                tips = "已失效";
            }
            if (goods.order_status == 109) {
                tips = "退款中";
            }
            if (goods.order_status == 110) {
                tips = "退款成功";
            }
            if (goods.order_status == 111) {
                tips = "退款失败";
            }
            return {'bnt': Buttons, 'tips': tips};
    }
    ,getOrderTips: function (order_info) {
        var tips = {
            100: {
                t: "等待买家付款",
                st: "1小时内未付款自动取消订单",
            },
            101: {
                t: "等待商家发货",
                st: "成功付款后48小时内发货",
            },
            102: {
                t: "交易已完成",
                st: "感谢您惠顾",
            },
            103: {
                t: "商品已发出",
                st: "",
            },
            104: {
                t: "交易完成",
                st: "感谢您惠顾",
            },
            105: {
                t: "交易已取消",
                st: "感谢您惠顾",
            },
            107: {
                t: "已退货",
                st: "感谢您惠顾",
            },
            108: {
                t: "订单已失效",
                st: "感谢您惠顾",
            },
            109: {
                t: "退款申请中",
                st: "感谢您惠顾",
            },
            110: {
                t: "退款完成",
                st: "感谢您惠顾",
            },
            111: {
                t: "退款失败",
                st: "感谢您惠顾",
            }
            
        };
        if (order_info.order_status in tips) {
                return tips[order_info.order_status];
        }
        return tips[104];
    }
    //渲染订单列表
    ,renderList: function(data) {
        
        var me = Order;
        if (data.errno == ErrorCode.NO_LOGIN) {
             Util.goLogin("myorder-allorders.html");
             return;
        }
        if (data.errno != 0) {
            messageBox.toast(data.errmsg);
        }
        if (data.data.list.length == 0) {
            //列表为空
            var html = $('#order_list_empty').html();
            $('#js-contbox01').html(html);
            return;
        }
        var html = "";
        var templte = $('#order_list_item').html();
        var GoodsListTemplate = $("#order_goods_item").html();
        var normalBntTemplate = $('#order_list_button').html();
        var mainBntTemplate = $('#order_list_button_main').html();
        var tips  = "";
        for (i in data.data.list) {
            var Buttons = "";
            var order = data.data.list[i];
            var goodsListHtml = "";
            for (j in order.goods) {
                goodsListHtml += Template.renderByTemplate(GoodsListTemplate, order.goods[j]);
            }
            delete order.goods;
            var BntAndTips = Order.renderPayBntsAndTips(order);
            order.buttons = BntAndTips.bnt;
            order.goods_list = goodsListHtml;
            order.order_tips = BntAndTips.tips;
            var list_item = Template.renderByTemplate(templte, order);
            html += list_item;
            
        }
        me.hasMore = data.data.hasMore;
        me.page = data.data.page;
        if (me.page == 1) {
            $('#js-contbox01').html(html);
        } else {
            //追加
            $('#js-contbox01').append(html);
        }
        
    }
    ,showLoading: function() {
        var html = $('#order_tips').html().replace('{$tips}', "加载中 ...");
        $('#js-contbox01').html(html);
    }
    ,loadOrder: function(type, p) {
        var me = Order;
        if (type) {
            $('#js-changecont div').removeClass('on');
            $('#js-changecont div[data-type= ' +type + ']' ).addClass('on');
        }
        if (p == 1) {
            //下拉则不需要显示loading
            me.showLoading();
        }
        Util.requestApi('?r=order/get',{type:type,p:p},me.renderList);
    }
    //订单管理页面
    ,runMain: function() {
        var type = Util.getHash();
        if ( !this.order_types[type]) {
            type = 'all';
        }
        this.bindMainEvent();
        this.loadOrder(type, 1);
        
    }
    ,renderDetail: function(data) {
        if (data.errno != 0) {
            var html = $('#order_empty_template').html().replace('{$tips}', data.errmsg);
            $(html).insertAfter('.u-top-msg');
            return;
        }
        var template = $('#order_detail_template').html();
        var goods_item_template = $('#order_goods_template').html();
        var goodsList = data.data.goods_list;
        delete data.data.goods_list;
        var goods_list_html = '';
        for (i in goodsList) {
            goods_list_html += Template.renderByTemplate(goods_item_template, goodsList[i]);
        }
        //获取订单不同状态的操作按钮
        var BntAndTips = Order.renderPayBntsAndTips(data.data);
        data.data.buttons = BntAndTips.bnt;
        var Tips = Order.getOrderTips(data.data);
        data.data.tips = Tips.t;
        data.data.pay_tips = "实付款";
        data.data.sub_tips = Tips.st;
        data.data.goods_list_html = goods_list_html;
        data.data.pay_time_tips = "";
        data.data.shipped_time_tips = "";
        if (data.data.order_status == 100) {
            data.data.pay_tips = "需付款";
        }
        if (data.data.pay_time != "") {
            data.data.pay_time_tips  = '<p>付款时间：'+data.data.pay_time+'</p>';
        }
        if (data.data.shipping_time != "") {
            data.data.shipped_time_tips  = '<p>发货时间：'+data.data.shipping_time+'</p>';
        }
        var html = Template.renderByTemplate(template, data.data);
        $(html).insertAfter('.u-top-msg');
    }
    //订单详情
    ,runDetail: function() {
        var order_sn = Util.getQueryString('order');
        Util.requestApi('?r=order/detail',{order_sn:order_sn},this.renderDetail);
        this.bindMainEvent();
    }
    
    //支付选择页面
    //请求微信支付的参数
    ,getWxPayParams: function(orderSn) {
        var api = config.api + "?r=order/weixinpayid";
        var ret = {};
        $.ajax({
            url: api,
            data: {order: orderSn},
            dataType: 'json',
            async: false,
            success: function(data) {
                ret = data;
            }
            
        });
        return ret;
    }
    //微信公众号支付
    ,weixinPay: function(orderSn) {
        var me = Order;
        if (!me.wxParams) {
             
        }
        me.wxParams = me.getWxPayParams(orderSn);
        if (me.wxParams.errno != 0) {
            messageBox.toast(me.wxParams.errmsg);
            return;
         }
         function onBridgeReady(){
           WeixinJSBridge.invoke(
               'getBrandWCPayRequest', me.wxParams.data,
               function(res){     
                    if (res.err_code) {
                        //有错误码，则表示支付失败
                         messageBox.toast("支付失败");
                    } else if (res.err_msg == 'get_brand_wcpay_request:cancel'){
                        //支付成功，进入订单详情页面
                        messageBox.toast("已取消支付");
                        me.gotoDetail(orderSn);
                    } else if (res.err_msg == 'get_brand_wcpay_request:ok') {
                        me.gotoDetail(orderSn);
                    }
                    
               }
           ); 
        }
        if (typeof WeixinJSBridge == "undefined"){
           if( document.addEventListener ){
               document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
           }else if (document.attachEvent){
               document.attachEvent('WeixinJSBridgeReady', onBridgeReady); 
               document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
           }
        }else{
           onBridgeReady();
        }
    }
    ,bindPaymentEvent: function(orderSn){
        //u-arrow-list
        var me = this;
        
        $('.u-arrow-list').delegate('.list', 'click', function(){
             var payType = $(this).attr('pay-type');
             
             if (payType == 'weixin') {
                 //微信支付

                 if (!Util.canWeixinPay()) {
                     messageBox.toast("请使用微信5.0以上版本打开");
                     return;
                 }
                 me.weixinPay(orderSn);
                 
             } 
        });

        }
    ,runPayment: function() {
        var orderSn = Util.getQueryString('order');
        var me = this;
        var errmsg = "";
        Util.requestApi('?r=order/getpayments', {order:orderSn}, function(data){
            if (data.errno != 0) {
                messageBox.toast(data.errmsg);
                errmsg = data.errmsg;
                me.gotoDetail(orderSn);
            } else {
                $('#order_fee').html(data.data.total_fee);
                
                //可以支付再绑定事件
                me.bindPaymentEvent(orderSn);
            }
        });
    }
};

//地址管理
var Address = {

    cfg : {}
    
    //获取选择的地址
    ,getSelectedAddressId: function() {
        var addressId = $('.u-arrow-list input[type=radio]:checked').attr('data-id');
        return addressId;
    }
    //绑定选择收货地址事件
    ,bindSelectEvent: function() {
        var me = this;
        $(".u-arrow-list").delegate('.u-checkbox','click',function(){
            //var addressId = $('.u-arrow-list input[type=radio]:checked').attr('data-id');
            var addressId  = me.getSelectedAddressId();
            if (addressId) {
                //选择当前地址
                Util.requestApi('?r=address/select', {address_id:addressId}, function(data){
                    if (data.errno == 0) {
                        history.go(-1);
                    } else {
                        messageBox.toast(data.errmsg);
                    }
                });
            }
        });
    }
    ,isChecked: function(data) {
        var me = Address;
        if (me.cfg.page == 'myaddress') {
            return data.is_default;
        } else {
            return data.selected;
        }
    }
    //渲染地址列表
    ,renderAddressList: function(data) {
        var me = Address;
        if (data.errno == 0) {
            var tempate = $('#tempate-address-list').html();
            var html = "";
            var selectId = 0;
            for (i in data.data) {
                var item = data.data[i];
                var href = config.page.address_edit + "?id=" + item.address_id;
                item.address = item.province + item.city + item.district + item.address;
                var checked = '';
                if (me.isChecked(item)) {
                    checked = "checked=checked";
                }
                var itemHtml = tempate.replace('{$consignee}', item.consignee)
                               .replace('{$mobile}', item.mobile)
                               .replace('{$href}', href)
                               .replace('{$checked}', checked)
                               .replace('{$address_id}', item.address_id)
                               .replace('{$address}', item.address);
                               
                
                html += itemHtml;
            }
            $('.u-arrow-list').html(html);
        } else {
            messageBox.toast(data.errmsg);
        }
        
    }
    //加载我的地址列表
    ,loadMyaddress: function() {
        var api = "?r=address/list";
        Util.requestApi(api, {}, this.renderAddressList);
    }
    //新增地址事件绑定
    ,bindNewAddressEvent: function() {
        var me = this;
        $('.u-mainbutton-little').click(function(){
            //保存按钮事件

            var params = me.getAddressFormData();
            if (params == false) {
                return;
            }
            var url = config.api + "?r=address/add";
            console.log(params);
            $.ajax({
                url: url,
                data: params,
                dataType: 'jsonp',
                xhrFields: {
                   withCredentials: true
                },
                crossDomain : true,
                success: function(data) {
                    messageBox.toast(data.errmsg)
                    if (data.errno == 0) {
                        //成功 返回
                        history.go(-1);
                    }
                },
                error: function() {
                    messageBox.toast("服务器出错，请稍后重试");
                }
            });
        });
        $(".u-arrow-list a").click(function(){
                $(this).find('input').focus();
            
        });
    }
    //收货地址主界面事件绑定
    ,bindMainEvent: function() {
        var me = this;
        $(".u-button-main").click(function(){
             var addressId  = me.getSelectedAddressId();
             if (addressId) {
                 var params = {address_id: addressId, 'is_default' : 1};
                 Util.requestApi('?r=address/update', params, function(data){
                     if (data.errno == 0) {
                         messageBox.toast("设置成功");
                     }
                     if (data.errno == 10032) {
                         //地址不全，请完善
                         messageBox.toast("请先完善地址");
                     }
                     
                 });
             }
            
        });
    }
    ,getAddressFormData: function(){
        var params = {};
        var notice = [];
        $('.u-arrow-list input').each(function(i){
            var name = $(this).attr('name');
            var value = $(this).attr('value');
            params[name] = value;
            notice[name] = $(this);
        });
        for (i in params) {
                if (params[i] == '') {
                    messageBox.toast(notice[i].attr('placeholder'));
                    notice[i].focus();
                    return false;
                }
        }
        //var reg = /^0?(13[0-9]|15[012356789]|17[0678]|18[0-9]|14[57])[0-9]{8}$/;
        if (!Util.isCorrectMobile(params['mobile'])) {
            //手机号码验证
            messageBox.toast("手机号码格式错误");
            notice['mobile'].focus();
            return false;
        }
        var areas = params['province_city_district'].split(" ");
        var areaCodes = $("input[name=province_city_district]").attr("data-value");
        delete params['province_city_district'];
        params['str_province'] = areas[0];
        params['str_city'] = areas[1];
        params['str_district'] = areas[2];
        params['add_code'] = areaCodes;
        return params;
    }
    //渲染地址详情页面
    ,renderDetail: function(data) {
        if (data.errno == 0) {
            var address = data.data;
            var province_city_district = address.province + " " + address.city + " " + address.district;
            address['province_city_district'] = province_city_district;
            delete address['province'];
            delete address['city'];
            delete address['district'];
            
            $(".u-arrow-list input").each(function(i){
                var name = $(this).attr('name');
                $(this).val(address[name]);
            });
            $(".u-arrow-list").show();
            $('#loading').hide();
        } else {
            messageBox.toast(data.errmsg);
        }
    }
    ,loadDetail: function() {
        var id = Util.getQueryString('id');
        if (id) {
            //console.log(id);
            Util.requestApi('?r=address/detail', {id:id}, this.renderDetail);
        }
    }
    ,handleDetailCallback: function(data) {
        messageBox.toast(data.errmsg);
        console.log(data);
        if (data.errno == 0) {
            history.go(-1);
        }
    }
    ,bindDetailEvent: function() {
        //保存修改
        var me = this;
        $('.u-mainbutton-little').click(function(){
            var addressId = $('input[name=address_id]').val();
            if (addressId) {
                var params = me.getAddressFormData();
                if (params == false) {
                    return;
                } else {
                    Util.requestApi('?r=address/update', params, me.handleDetailCallback);
                }
                
            }
        });
        
        //删除
        $('.del').click(function(){
            var addressId = $('input[name=address_id]').val();
            if (addressId) {
                messageBox.confirm("您确定要删除吗？", function(){
                    Util.requestApi('?r=address/remove', {id:addressId}, me.handleDetailCallback);
                });
            }
        });
        $(".u-arrow-list a").click(function(){
                $(this).find('input').focus();
            
        });
    }
    //管理主页
    ,runMain: function() {
        this.cfg.page = 'myaddress';
        this.loadMyaddress();
        this.bindMainEvent();
    }
    //地址选择页面
    ,runSelect: function() {
        this.loadMyaddress();
        this.bindSelectEvent();
    }
    //地址新增页面
    ,runNew: function() {
        this.bindNewAddressEvent();
        
    }
    //地址编辑页面
    ,runEdit: function() {
        this.loadDetail();
        this.bindDetailEvent();
    }

};


//用户相关
var User = {
    user: {}
    ,renderKing: function(data, direct) {
        Util.hideLoading();
        if (data.is_login != 1) {
            Util.goLogin(direct);
        } else {
            if (data.user.role >= Const.USER_ROLE_SUPPLIER) {
                //跳到供应商
                window.location.href = config.page.user_supplier;
                return;
            }
            if (data.user.role >= Const.USER_ROLE_KING) {
                //王爷以上，可以进入我的收入和我的下级
                $("#my_mate").show();
                $("#myincome-entry").attr('href', config.page.income_king);
                var role = data.user.role == Const.USER_ROLE_KING_ONE ? "一品王爷" : "王爷";
                $('title').html("个人中心-"+role);
            }
            $(".u-person-head, .u-person-cont, .u-person-order, .u-img-a-list").show();
            $(".u-person-head .name").append(data.user.name);
            $(".u-person-head .photo").attr('src', data.user.avatar);
            $("#loading").hide();
           
        }
    }
    ,renderSupplier: function(data, direct) {
        Util.hideLoading();
        if (data.is_login != 1) {
            Util.goLogin(direct);
            return;
        }
        if (data.user.role < Const.USER_ROLE_SUPPLIER) {
            //跳到供应商
            window.location.href = config.page.user_king;
            return;
        }
        if (data.user.role == Const.USER_ROLE_SUPPLIER_LEADER) {
            //供应商队长，开放下级入口
            $('#my_team').show();
            $('title').html("个人中心-供应商队长");
        } else {
            $('title').html("个人中心-供应商");
        }
        $(".u-person-head, .u-person-cont, .u-person-order, .u-img-a-list").show();
        $(".u-person-head .name").append(data.user.name);
        $(".u-person-head .photo").attr('src', data.user.avatar);
        $("#loading").hide();
    }
    ,bindShareEvent: function() {
        $("#share").bind('click', function(){
            Share.shareFriend();
        });
    }
    ,initKing: function(data, proxy) {
        if (!proxy) {
            proxy = this;
        }
        proxy.renderKing(data, config.page.user_king);
        
        //注册微信分享事件
        //Share.registerShare();
        proxy.bindShareEvent();
    }
    ,initSupplier: function(data, proxy) {
        proxy.renderSupplier(data, config.page.user_supplier);
        proxy.bindShareEvent();
    }
};



//收藏相关
var Collection = {
    
    remove: function(goods_ids, callback) {
        Util.requestApi('?r=collect/remove', {goods_ids:goods_ids}, callback);
    }
    ,run: function() {
        Util.requestApi('?r=collect/get', {}, this.renderList);
        this.bindEvent();
    }
    ,bindEvent: function(){
        var me = this;
        $('.productlistbox').delegate(".photo ", 'click', function(){
            
            var goods_id = $(this).attr('data-id');
            if (goods_id) {
                Util.goGoodsDetail(goods_id);
            }
        });
        
        $('.productlistbox').delegate(".count ", 'click', function() {
                $('#js-moreFunction').attr('data-id', $(this).attr('data-id'));
                $('#js-moreFunction').show();
        });
        
        $('#js-moreFunction .u-button-gray').click(function() {
            $('#js-moreFunction').hide();
        });
        $('#js-moreFunction').delegate('.cont', 'click', function(){
            
             var type = $(this).attr('data-action');
             var goods_id = $('#js-moreFunction').attr('data-id');
             if ('add-cart' == type) {
                 goodsCart.add(goods_id);
             }
             if ('remove' == type) {
                 me.remove(goods_id, function(data){
                     messageBox.toast(data.errmsg);
                     if (data.errno == 0) {
                        //重新获取 
                        $('#js-moreFunction').hide();
                        Util.requestApi('?r=collect/get', {}, me.renderList);
                     }
                 });
             }
             
        });
    }
    //渲染列表
    ,renderList: function(data) {
        if (data.errno == 12) {
            Util.goLogin(config.page.collection);
            return;
        } 
        if (data.errno != 0) {
            messageBox.toast(data.errmsg);
            return;
        }
        var tempate = $('#collect_list_tempate').html();
        var html = "";
        for (i in data.data.list) {
            var item = data.data.list[i];
            var icon = '';
            var sold = "";
            var tips = "";
            if (item.goods_number <= 0) {
                sold = 'sold';
                icon = '<img src="img/hwicon_07.png" class="icon">';
                tips = "已售罄";
            }
            if (item.goods_status != Const.GOODS_STATUS_ON_SELL) {
                sold = 'sold';
                icon = '<img src="img/hwicon_07.png" class="icon">';
                tips = "已结缘";
            }
            item.sold = sold;
            item.tips = tips;            
            item.icon = icon;            
            html += Template.renderByTemplate(tempate, item);
        }
        $('.productlistbox').html(html);
    }
};


//收入相关
var Income = {
    
    loadKingFee: function() {
        //加载收入概要 
        var api = "?r=income/resume";
        Util.requestApi(api, {}, function(data) {
             if (data.errno == Const.NO_LOGIN) {
                 //没有登录
                 Util.goLogin(config.page.income_king);
                 return;
             }
             if (data.errno != 0) {
                 messageBox.toast(data.errmsg);
                 return;
             }
             if (data.data.role >= Const.USER_ROLE_SUPPLIER) {
                 //Util.goPage(config.page.income_supplier);
             }
             $('#user_money').html(data.data.money);
             $('#trade_money').html(data.data.trade_money);
             //
        });
    }
    ,loadSupplierFee: function() {
        //加载收入概要 
        var api = "?r=income/resume";
        Util.requestApi(api, {}, function(data) {
             if (data.errno == Const.NO_LOGIN) {
                 //没有登录
                 Util.goLogin(config.page.income_king);
                 return;
             }
             if (data.errno != 0) {
                 messageBox.toast(data.errmsg);
                 return;
             }
             if (data.data.role < Const.USER_ROLE_SUPPLIER) {
                 //Util.goPage(config.page.income_king);
             }
             if (data.data.role == Const.USER_ROLE_SUPPLIER_LEADER) {
                 $("#changenode02").show(); //可以查看队员订单情况
             }
             $('#user_money').html(data.data.money);
             //$('#trade_money').html(data.data.trade_money);
             //
        });
    }
    //加载收入列表
    ,loadKingFeeDetail: function(p) {
         var api = "?r=income/detail";
         Util.showTips($('#income_list'), "加载中...");
         var me = Income;
         Util.requestApi(api, {p:p}, function(data) {
            if (data.errno != 0) {
                Util.showTips($('#income_list'), data.errmsg);
                return;
            }
            var template = $('#income_list_template').html();
            var html = "";
            if (data.data.list.length == 0) {
                html = "没有佣金记录";
                Util.showTips($('#income_list'), html);
                return
            }
            for (i in data.data.list) {
                var item = data.data.list[i];
                html += Template.renderByTemplate(template, item);
            }
            $('#income_list').html(html);
            
            var page_count = data.data.page_count;
            var curent_page = data.data.p;
            me.page.render(curent_page, page_count);
            
             
         });
    }
    //加载收入列表
    ,loadSupplierFeeDetail: function( params) {
         var api = "?r=income/supplierdetail";
         var me = Income;
         var target = params.myself ? $("#sold_content") : $("#sub_sold_content");
         var page = params.myself ? me.page_self : me.page_sub;
         Util.showTips(target, "加载中...");
         
         Util.requestApi(api, params, function(data) {
            if (data.errno != 0) {
                Util.showTips(target, data.errmsg);
                return;
            }
            var template = $('#income_list_template').html();
            var html = "";
            $("#goods_money").html("￥" + data.data.goods_money);
            $("#rebate_money").html(data.data.rebate_money);
            if (!params.myself) {
                //不是自己，隐藏货款
                $("#my_goods_money").hide();
            } else {
                $("#my_goods_money").show();
            }
            if (data.data.role == Const.USER_ROLE_SUPPLIER_LEADER) {
                //队长可以看返利
                $("#rebate_money_sum").show();
            } else {
                $("#rebate_money_sum").hide();
            }
            if (data.data.list.length == 0) {
                html = "没有佣金记录";
                Util.showTips(target, html);
                return
            }
            for (i in data.data.list) {
                var item = data.data.list[i];
                item.display = "";
                if (parseInt(item.rebate_money) == 0) {
                    item.display = "none";
                }
                html += Template.renderByTemplate(template, item);
            }
            target.html(html);
            
            var page_count = data.data.page_count;
            var curent_page = data.data.p;
            page.render(curent_page, page_count);
            
             
         });
    }
    ,bindKinFeeEvent: function() {
        var me = this;
        me.page = new Page('.u-flip');
        me.page.addClickEvent(function(){
            
             var page = $(this).attr('data');
             if (page) {
                 me.loadKingFeeDetail(page);
             }
        });
    }
    ,runKing: function() {
        this.loadKingFee();
        this.loadKingFeeDetail(1);
        this.bindKinFeeEvent();
    }
    ,bindSupplierEvent: function(){
         var me = this;
        $("#changenode01").click(function(){
            me.loadSupplierFeeDetail({myself:true, p:1});
        });
        
        $("#changenode02").click(function(){
            me.loadSupplierFeeDetail({myself:false, p:1});
        });
        
        $(".u-myincome-search button").click(function(){
            var act = $(this).attr('data-act');
            var myself = $('#js-changecont .on').attr('id') == 'changenode01' ? true : false;
            if (act == 'search') {
                //搜索
                var params = {};
                $(".u-myincome-search input").each(function(i) {
                      var val = $(this).val().trim();
                      var name = $(this).attr('name');
                      if (val != '') {
                          params[name] = val;
                      }
                });
                params.myself = myself;
                params.p = 1;
                me.loadSupplierFeeDetail(params);
            }
            if (act == 'view_all') {
                $(".u-myincome-search input").val('');
                me.loadSupplierFeeDetail({myself:myself, p:1});
            }
        });
    }
    ,runSupplier: function() {
        var me = this;
        me.page_self = new Page('#sold_page');
        me.page_sub = new Page('#sub_sold_page');
        me.page_self.addClickEvent(function(){
            
             var page = $(this).attr('data');
             if (page) {
                 me.loadSupplierFeeDetail({myself:true, p:1});
             }
        });
        me.page_sub.addClickEvent(function(){
            
             var page = $(this).attr('data');
             if (page) {
                 me.loadSupplierFeeDetail({myself:false, p:1});
             }
        });
        me.loadSupplierFee();
        me.bindSupplierEvent();
        myself = true;
        me.loadSupplierFeeDetail({myself:myself, p:1});
    }
    //进入提现页面
    , loadWithdrawals: function() {
         var me = this;
         Util.requestApi('?r=income/getaccount', {}, function(data){
              if (data.errno != 0) {
                  messageBox.toast(data.errmsg);
                  return;
              }
              me.money_limit = data.data.withdrawals_limit;
              me.total_money = data.data.money;
              $("#js-maxQuota, #js-alipayMaxQouta").html(data.data.money);
              $("#js-quota, #js-alipayQouta").attr("placeholder", "提现金额(最低提现"+me.money_limit+"元)");
              $('.user_money').html(data.data.user_money);
              
              if (data.data.withdrawals_account) {
                  //从历史中选择
                  var account = data.data.withdrawals_account;
                  me.withdrawals_account = data.data.withdrawals_account
                  if (account.account_type == Withdrawaccount.type_bank) {
                      //银行卡
                        var money  = $('#js-quota').val();
                        $('#js-card').val(account.account);
                        $('#js-personName').val(account.display_name);
                        if (me.canSubmit(money)) {
                            $('#js-cardsubmit').attr('data-money', money).removeClass('disable');
                            me.addSubmitApplyEvent($('#js-cardsubmit'), money);
                        }
                  } else {
                      //支付宝
                      var money  = $('#js-alipayQouta').val();
                      $('#changenode02').trigger('click');
                      $('#js-alipay-card').val(account.account);
                      $('#alipay-personName').html(account.display_name);
                      if (me.canSubmit(money)) {
                            $('#js-alipaysubmit').attr('data-money').removeClass('disable');
                            me.addSubmitApplyEvent($('#js-alipaysubmit'));
                      }
                  }
                  
              }
              
         });
    }
    ,canSubmit: function (money) {
            //检查是否可以提交申请
        var me = Income;
         if (me.money_limit == -1
             || money < me.money_limit
             || money > me.total_money
             || me.withdrawals_account == null) {
                //数据还未加载
            return false;
        }
        return true;
    }
    ,addSubmitApplyEvent: function(target) {
        var me = Income;
        
        var submit = function(){
                var money = target.attr('data-money');
                if (!me.canSubmit(money)) {
                    return;
                }
                target.unbind('click');
                var param = me.withdrawals_account;
                param.money = money;
                Util.requestApi('?r=income/applywithdrawals', param, function(data){
                    target.bind('click', submit);
                    messageBox.toast(data.errmsg);
                    if (data.errno != 0) {
                        return;
                    }
                    me.loadWithdrawals();
                    
                });
            
        }
        target.bind('click', submit);
    }
    ,runWithdrawals: function() {
        var me = this;
        me.money_limit = -1;
        me.withdrawals_account = null;
        this.loadWithdrawals();
        me.addSubmitApplyEvent($('#js-cardsubmit'));
        me.addSubmitApplyEvent($('#js-alipaysubmit'));
        $("#js-quota,#js-alipayQouta").bind('keyup', function(){
            var money = $(this).val();
            var submitBnt = $(this).attr('id') == 'js-quota' ? $('#js-cardsubmit') : $('#js-alipaysubmit');
              if (me.money_limit == -1) {
                  //数据还未加载
                  return;
              }
              submitBnt.addClass('disable');
              if (money < me.money_limit) {
                  //小于最低提现额度
                  $(this).addClass('error');
                  return;
              }
              if (money > me.total_money) {
                  $(this).addClass('error');
                  return;
              }
              $(this).removeClass('error');
              
              if (!me.canSubmit(money)) {
                  return;
              }
              //检查是否可以提交
              submitBnt.attr('data-money' , money);
              
              if ($(this).attr('id') == 'js-quota') {
                  //银行卡
                    submitBnt.removeClass('disable');
                  
              } else {
                  //支付宝
                  submitBnt.removeClass('disable');
              }
        });
    }
    ,loadHistory: function(p) {
        var me = Income;
        Util.requestApi('?r=income/history', {p:p}, function(data) {
                if (data.errno != 0) {
                    messageBox.toast(data.errmsg);
                    return;
                }
                var template = $("#draw_out_history").html();
                if (data.data.list.length == 0) {
                    Util.showTips($(".listbox"), "没有提取记录");
                    return;
                }
                var html = "";
                for (i in data.data.list) {
                    var item = data.data.list[i];
                    var params = {
                        'money': item.money,
                        'add_time': item.add_time,
                        'status': item.status,
                        'username': item.account_info.username,
                        'account': item.account_info.account,
                        'account_cat': item.account_info.account_cat,
                        
                    };
                    html += Template.renderByTemplate(template, params);
                }
                $(".listbox").html(html);
                me.page.render(data.data.page, data.data.page_count);
            
        });
    }
    //提取记录
    ,runHistory: function() {
        var me = this
        me.page = new Page('.u-flip');
        me.page.addClickEvent(function(){
            var page = $(this).attr('data');
            if (page) {
                me.loadHistory(page);
            }
            
        });
        me.loadHistory(1);
    }
    
};

//提现账号选择设置相关
var Withdrawaccount = {
    
    type_bank : 1
    ,type_alipay: 2
    
    //渲染列表
    ,renderList: function(data) {
        var me = Withdrawaccount;
        var html = "";
        var template = $('#income_draw_template').html();
        for (i in data.data) {
            var item = data.data[i];
            var dispay = item.account_cat + ' ' + item.account;
            if (item.account_type == me.type_alipay) {
                dispay =  item.account + "  " + item.username; 
            }
            var arrData = {
                display: dispay,
                id: item.id,
            };
            html += Template.renderByTemplate(template, arrData);
        }
        $(html).insertAfter('.u-buttonbox');
    }
    
    ,bindEvent: function() {
        var params = {};
        var tips = {};
        $(".u-infolistbox input").each(function(){
                var name = $(this).attr('name');
                params[name] = $(this).val().trim();
                tips[name] = $(this);
        });
        $(".u-infolistbox input").bind('blur', function(){
                var value = $(this).val().trim();
                if (value == '') {
                    $(this).addClass('error');
                    $(this).val('');
                } else {
                    $(this).removeClass('error');
                }
        });
        $(".u-infolistbox input").bind('keyup', function(){ 
               var name = $(this).attr('name');
               var value = $(this).val().trim();
               params[name] = value;
               if (value == '') {
                    $(this).addClass('error');
                    $(this).val('');
                } else {
                    $(this).removeClass('error');
                }
               for (i in params) {
                   if (params[i] == '') {
                       //有空的
                       $('#js-submit').addClass('disable');
                       return
                   }
               }
               $('#js-submit').removeClass('disable');
        });
        var submitAccount = function() {
               for (i in params) {
                   if (params[i] == "") {
                        messageBox.toast(tips[i].attr('placeholder'));
                        return;
                   }
               }
               $('#js-submit').unbind('click', submitAccount);
               Util.requestApi('?r=withdrawaccount/add', params, function(data){
                    $('#js-submit').bind('click', submitAccount);
                    if (data.errno != 0) {
                        messageBox.toast(data.errmsg);
                        return;
                    }
                    history.go(-1);
                    
               }, 'post');
        };
        $('#js-submit').bind('click', submitAccount);
        
        $('body').delegate('.u-radio' , 'click', function(){
                var id = $(this).val();
                if (!id) {
                    return ;
                }
                Util.requestApi('?r=withdrawaccount/select', {id:id}, function(data){
                        if (data.errno != 0) {
                            messageBox.toast(data.errmsg);
                            return;
                        }
                        history.go(-1);
                    
                });
            
        });
    }
    ,runBank: function() {
        var me = this;
        me.bindEvent();
        Util.requestApi('?r=withdrawaccount/list', {account_type:me.type_bank}, function(data){
            if (data.errno != 0) {
                messageBox.toast(data.errmsg);
            }
            me.renderList(data);
            
        });
        
    }
    ,runAlipay: function() {
        var me = this;
        me.bindEvent();
        Util.requestApi('?r=withdrawaccount/list', {account_type:me.type_alipay}, function(data){
            if (data.errno != 0) {
                messageBox.toast(data.errmsg);
            }
            me.renderList(data);
            
        });
        
    }
};

//用户关系， 用户下级
var UserRelation = {
    
    loadRelation: function(p){
        var me  = UserRelation;
        Util.requestApi("?r=user/downstream",{p:p}, function(data){
                if (data.errno != 0) {
                    messageBox.toast("data.errmsg");
                    return ;
                }
                if (data.data.list.length <= 0) {
                    Util.showTips($('.infolistbox'), "您没有下级");
                    return;
                }
                var html = "";
                var template = $('#downstream_item_template').html();
                for (i in data.data.list) {
                    var item = data.data.list[i];
                    html += Template.renderByTemplate(template, item);
                }
                $('.infolistbox').html(html);
                me.mainPage.render(data.data.page, data.data.page_count);
            
        });
    }
    ,runMain: function(){
        var me = this;
        me.loadRelation(1);
        me.mainPage = new Page('.u-flip');
        me.mainPage.addClickEvent(function(){
            var page = $(this).attr('data');
            if (page) {
                me.loadRelation(page);
            }
        });
    }
    ,loadSubIncome: function(id, p) {
        var me = UserRelation;
         Util.requestApi("?r=income/rebatestatics",{p:p,id:id}, function(data){
                if (data.errno != 0) {
                    messageBox.toast("data.errmsg");
                    return ;
                }
                if (data.data.list.length <= 0) {
                    Util.showTips($('#content'),"没有相关记录");
                    return;
                }
                var html = "";
                var template = $('#money_static_template').html();
                for (i in data.data.list) {
                    var item = data.data.list[i];
                    html += Template.renderByTemplate(template, item);
                }
                $('#content').html(html);
                me.page.render(data.data.page, data.data.page_count);
            
        });
    }
    //下级的佣金统计
    ,runSubIncome: function() {
        var me = this;
        var id = Util.getQueryString('id');
        me.loadSubIncome(id, 1);
        me.page = new Page('.u-flip');
        me.page.addClickEvent(function(){
            var page = $(this).attr('data');
            if (page) {
                me.loadSubIncome(id, page);
            }
        });
    }
};


//供应商，
var Supplier = {
    
    //加载在售的商品
    loadSelling: function(p, callback){
        var me = Supplier;
        me.sellingPageNo = p;
        Util.requestApi("?r=good/myselling",{p:p}, function(data) {
            if (data.errno != 0) {
                
                messageBox.toast(data.errmsg);
                return;
            }
            callback(data);
        });
    }
    //加载交易中
    ,loadtrading: function(p) {
        Util.requestApi("?r=good/mytrading",{p:p}, function(data) {
            if (data.errno != 0) {
                
                messageBox.toast(data.errmsg);
                return;
            }
            //渲染列表
            var me = Supplier;
            var html = "";
            var template = $("#trade_sold_template").html();
            if (data.data.list.length == 0) {
                Util.showTips($("#trade_content"), "没有相关记录");
                return;
            }
            for (i in data.data.list) {
                 var item = data.data.list[i];
                 item.status = "交易中";
                 html += Template.renderByTemplate(template, item);
             }
             me.tradingPage.render(data.data.page, data.data.page_count);
             $("#trade_content").html(html);
        });
    }
    //加载已售的 
    ,loadsold: function(p) {
        var me = Supplier;
        Util.requestApi("?r=good/mysold",{p:p}, function(data) {
            if (data.errno != 0) {
                
                messageBox.toast(data.errmsg);
                return;
            }
            //渲染列表
            var me = Supplier;
            var html = "";
            var template = $("#trade_sold_template").html();
            if (data.data.list.length == 0) {
                Util.showTips($("#sold_content"), "没有相关记录");
                return;
            }
            for (i in data.data.list) {
                 var item = data.data.list[i];
                 item.status = "已售";
                 html += Template.renderByTemplate(template, item);
             }
             me.soldPage.render(data.data.page, data.data.page_count);
             $("#sold_content").html(html);
        });
    }
    ,renderSelling: function(data) {
         var me = Supplier;
         var html = "";
         var template = $("#myproduct_selling_template").html();
         
         if (data.data.list.length == 0) {
                Util.showTips($("#selling_content"), "没有相关记录");
                return;
         }
         for (i in data.data.list) {
             var item = data.data.list[i];
             
             html += Template.renderByTemplate(template, item);
         }
         me.sellingPage.render(data.data.page, data.data.page_count);
         $("#selling_content").html(html);
    }
    ,renderModify: function(data) {
         var me = Supplier;
         var html = "";
         var template = $("#modify_template").html();
         if (data.data.list.length == 0) {
                Util.showTips($("#modify_content"), "没有相关记录");
                return;
         }
         for (i in data.data.list) {
             var item = data.data.list[i];
             
             html += Template.renderByTemplate(template, item);
         }
         me.modifyPage.render(data.data.page, data.data.page_count);
         $("#modify_content").html(html);
    }
    ,initSeeling: function(){
        var me = Supplier;
        if (!me.sellingPage) {
            me.sellingPage = new Page("#selling_page");
            me.sellingPage.addClickEvent(function() {
                var page = $(this).attr('data');
                if (page) {
                    me.loadSelling(page,me.renderSelling);
                }
            });
            
        }
        me.loadSelling(1,me.renderSelling);
        
    }
    //初始化交易中
    ,initTrading: function() {
        var me = Supplier;
        if (!me.tradingPage) {
            me.tradingPage = new Page("#trade_page");
            me.tradingPage.target = "#trade_page";
            me.tradingPage.addClickEvent(function() {
                var page = $(this).attr('data');
                if (page) {
                    me.loadtrading(page);
                }
            });
            
        }
        me.loadtrading(1);
        
    }
    ,initSold: function() {
        var me = this;
        if (!me.soldPage) {
            me.soldPage = new Page("#sold_page");
            me.soldPage.addClickEvent(function() {
                var page = $(this).attr('data');
                if (page) {
                    me.loadsold(page);
                }
            });
            
        }
        me.loadsold(1);
    }
    //初始化修改价格
    ,initModify: function() {
        var me = Supplier;
        if (!me.modifyPage) {
            me.modifyPage = new Page("#modify_page");
            me.modifyPage.addClickEvent(function() {
                var page = $(this).attr('data');
                if (page) {
                    me.loadSelling(page,me.renderModify);
                }
            });
            
        }
        me.loadSelling(1,me.renderModify);
    }
    ,tabFunction: function(data, proxy) {
        if (!proxy) {
            var me = Supplier;
        } else {
            me = proxy;
        }
        
        if (data == 'selling') {
              me.initSeeling();
              return;
          }
          if (data == 'trading') {
              me.initTrading();
              return;
          }
          if (data == 'sold') {
              me.initSold();
              return ;
          }
          if (data == 'modify') {
              me.initModify();
              return ;
          }
          if (data == 'refund') {
              Util.showTips($("#js-contbox05"), "陆续开放中 ...");
              return;
          }
    }
    //事件绑定处理
    ,bindEvent: function() {
         //选项卡切换事件
         var me = this;
        $("#js-changecont").delegate("div", 'click', function(){
              var data = $(this).attr('data');
              me.tabFunction(data, me);
        });
        
        //批量修改
        $("#js-chooseall .u-checkbox").change(function(){
             if ($(this).prop('checked')) {
                 //全选
                 $("#modify_content .u-checkbox").prop('checked', true);
             } else {
                 //全不选
                 $("#modify_content .u-checkbox").prop('checked', false);
             }
        });
        $("#js-contbox04 .u-myproduct-bottomedit button").click(function(){
                
                //提交批量修改价格
                var goodsIds = "";
                goodsIds = $("#modify_content input[type=checkbox]:checked").map(function(i){
                        return $(this).val();
                }).get().join(',');  
                if (goodsIds == "") {
                    messageBox.toast("请选择要修改的商品");
                    return;
                }
                var percent = $("#js-contbox04 .u-myproduct-bottomedit input[type=number]").val().trim();
                if (percent == "") {
                     messageBox.toast("请输入折扣值");
                    return;
                }
                percent = parseInt(percent);
                if (isNaN(percent) || 1 > percent || 99 < percent) {
                    messageBox.toast("只能输入0 - 99");
                    return;
                }
                Util.syncRequest('?r=good/batmodifyprice', {goods_ids:goodsIds,percent:percent}, function(data){
                    messageBox.toast(data.errmsg);
                    if (data.errno == 0) {
                         //修改成功，刷新页面
                         //me.sellingPageNo
                         $('.u-myproduct-editpopod .u-button-gray').trigger('click');
                         me.loadSelling(me.sellingPageNo,me.renderModify);
                    }
                    
                });
                

        });
        //修改框的事件
        $("#selling_content").delegate(".editnode", 'click', function(){
              $("#js-editpricebox")[0].style.display = "-webkit-box";
              var goodsId = $(this).attr('data-id');
              var goodsPrice = $(this).attr('data-price');
              $("#src_price").html(goodsPrice);
              $("#goods_id").val(goodsId);
        });
        //修改价格和状态按钮的事件
        var modifyBntClick = function(){
            var type =  $("#js-editpricebox .nav .on").attr('box');
            var goodsId = $("#js-editpricebox input[name=goods_id]").val();
            if (type == 0) {
                //修改价格
                var price = parseInt($("#mod_price").html());
                if (isNaN(price) || price == 0) {
                    messageBox.toast("请输入调整的价格");
                    return; 
                }
                Util.syncRequest('?r=good/modifyprice', {goods_id:goodsId,price:price}, function(data){
                    messageBox.toast(data.errmsg);
                    if (data.errno == 0) {
                         //修改成功，刷新页面
                         //me.sellingPageNo
                         $('.u-myproduct-editpopod .u-button-gray').trigger('click');
                         me.loadSelling(me.sellingPageNo,me.renderSelling);
                    }
                    
                });
            } else {
                //修改价格
                var status = $("#js-editpricebox select").val();
                Util.syncRequest('?r=good/modifystatus', {goods_id:goodsId,status:status}, function(data){
                    messageBox.toast(data.errmsg);
                    if (data.errno == 0) {
                         //修改成功，刷新页面
                         //me.sellingPageNo
                         $('.u-myproduct-editpopod .u-button-gray').trigger('click');
                         me.loadSelling(me.sellingPageNo,me.renderSelling);
                    }
                    
                });
            }
        };
        $("#js-editpricebox .u-button-main").bind('click',modifyBntClick);
        //注册价格框keyup事件，实时判断价格是否合法
        $("#js-editpricebox .contbox input").bind("keyup", function(){
            var price = parseInt($("#src_price").html());
            var name = $(this).attr('name');
            var value = $(this).val();
             $(this).removeClass("error");
            if (name == 'discount') {
                 if (value < 1 || value > 99) {
                     $(this).addClass("error");
                     $("#mod_price").html("");
                     return;
                 } else {
                     $("#mod_price").html(price * value / 100);
                 }
            }
            if (name == 'new_price') {
                 if (value < 1 || value > price) {
                     $(this).addClass("error");
                     $("#mod_price").html("");
                     return;
                 } else {
                     $("#mod_price").html(value);
                 }
            }
        });
    }
    //管理我商品
    ,runMainProducts: function() {
        var me = this;
        me.bindEvent();
        var type = Util.getHash();
        var types = {'selling':1, 'trading':1,'sold':1,'modify':1,'refund':1};
        if (!(type in types)) {
            type = 'selling';
        }
        $('#js-changecont div').removeClass('on');
        $('#js-changecont div[data='+type+']').addClass('on').trigger('click');
        //me.tabFunction(type, me);
    }
    ,loadSupplierGoods: function(param) {
        var me = Supplier;
        Util.requestApi("?r=good/subselling", param, function(data) {
            if (data.errno != 0) {
                messageBox.toast(data.errmsg);
                return;
            }
            var template = $("#goods_template").html();
            if (data.data.list.length ==0 ) {
                Util.showTips($("#selling_content"), "没找到相关记录");
                return;
            }
            var html = "";
            for (i in data.data.list) {
                var item = data.data.list[i];
                html += Template.renderByTemplate(template, item);
            }
            $("#selling_content").html(html);
            me.subPage.render(data.data.page, data.data.page_count);
        })
    }
    //下级商品
    ,runSubProducts: function() {
        var me = this;
        var id = Util.getQueryString('id');
        var name = Util.escape(Util.getQueryString('name'));
        me.subPage = new Page("#selling_page");
        me.subPage.addClickEvent(function(){
            var page = $(this).attr('data');
            if (page) {
                me.loadSupplierGoods({id:id,p:page});
            }
            
        });
        name && $("#user_name").html(name+"的商品");
        me.loadSupplierGoods({id:id,p:1});
    }
    //我的收入里面涉及已售商品相关
    ,runIncome: function() {
        
        var me = this;
        
    }
    
};

//二维码
var Qrcode = {
    
    run: function() {
        var mycode = "";
        $("#view_qrcode").click(function(){
            if (mycode) {
                $("#QRcord").show();
                return;
            }
            //请求服务端
            Util.requestApi('?r=user/myqrcode', {}, function(data) {
                if (data.errno != 0) {
                    messageBox.toast(data.errmsg);
                    return;
                }
                mycode = data.data.src;
                $("#QRcordBox .cord").attr("src" , mycode);
                $("#QRcordBox .cont").attr("href" , mycode);
                $("#QRcord").show();
            });
            
            
        });
        
    }
};

//分享相关操作

//微信相关操作
var Share = {
    
    is_register : 0 
   ,getShareContent: function() {
       var content = window.shareContent ? window.shareContent : new Object(); //从全局中后去分享内容
       var title = content.hasOwnProperty('title') ? content.title : "让珠宝不再暴利-洪五爷珠宝";
       var desc = content.hasOwnProperty('desc') ? content.desc : "让珠宝不再暴利,让珠宝零距离,让志同道合的业者都能共享平台成果";
       var link = content.hasOwnProperty('link')? content.link :  location.href;
       var img = content.hasOwnProperty('img') ? content.img : config.share_logo;
       if (window.hwy && window.hwy.user) {
           //一登陆用户
           //修改sid ,替换为自己的分享
           var user = window.hwy.user;
           Share.sid = user.sid;
       }
       var reg = /sid=[0-9a-zA-Z]+/;
       //可以分享的链接
       var valids = {
            '/webapp/' : 1,
            '/webapp/index.html':1,
            '/webapp/details.html' : 1,
            '/webapp/allproduct.html': 1
       }
       if ( !(location.pathname in valids)) {
           link = config.webapp;
       }
       if (reg.test(link)) {
           link = link.replace(reg, "sid="+Share.sid);
       } else {
           link += (link.indexOf('?') > 0 ? ("&sid=" + Share.sid) : ("?sid="+Share.sid));
       }
       console.log(link);
       return {
           title: title,
           desc: desc,
           link: link,
           img: img,
           
       };
   }
   //微信分享引导
   ,wxShareGuid: function() {
       var html = '<div id="share_guid" style="position: fixed;top: 0; left: 0;width: 100%;height: 100%;background: rgba(0, 0, 0, 0.7);display: ;z-index: 20000;">'
                     + '<img style="position: fixed;right: 30px;top: 10px;z-index: 999;" src="img/share_guid.png"></div>';
        $('body').append(html);             
   }
   ,registerShare: function(proxy){
      
       
       
       if (!Util.isWeiXin()) {
           return;
       }
       var content = Share.getShareContent();
       wx.ready(function () {  
            //'http://app.hong5ye.com/webapp/img/logo.png'
            //发给朋友
            Share.is_register = 1;
            wx.onMenuShareAppMessage({  
               title: content.title, // 分享标题
               desc: content.desc,
               link: content.link, // 分享链接
               imgUrl: content.img, // 分享图标,
               success: function(){
                $("#share_guid").remove();
               },
               cancel:  function(){
                $("#share_guid").remove();
                }
            });
            
            
            //发到朋友圈
            wx.onMenuShareTimeline({  
               title: content.title, // 分享标题
               link: content.link, // 分享链接
               imgUrl: content.img, // 分享图标
               success: function(){
                $("#share_guid").remove();
               },
               cancel:  function(){
                $("#share_guid").remove();
                }
            });
            
            
        });
   }
   ,init: function() {
       
       //微信初始化
       if (Util.isWeiXin()) {
            var doc=document;  
            var script=doc.createElement("script"); 
            var url = 'https://res.wx.qq.com/open/js/jweixin-1.0.0.js';
            script.setAttribute("src", url);  
            var heads = doc.getElementsByTagName("head");  
            heads[0].appendChild(script); 
            
            
            //var doc=document;  
            var script=doc.createElement("script"); 
            var url = 'http://app.hong5ye.com/api/backend/web/index.php?r=user/wxjsonfig&v='+Math.random();
            script.setAttribute("src", url);  
            //var heads = doc.getElementsByTagName("head");  
            heads[0].appendChild(script); 
            
            
            $("body").delegate("#share_guid", 'click', function(){
                $(this).remove();
            })
       }
       
   }

    ,register: function(call) {
        
        function onBridgeReady(){
            call();
        }
        if (typeof WeixinJSBridge == "undefined"){
           if( document.addEventListener ){
               document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
           }else if (document.attachEvent){
               document.attachEvent('WeixinJSBridgeReady', onBridgeReady); 
               document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
           }
        }else{
           onBridgeReady();
        }
    }
   ,shareFriend: function() {
       
       if (!Util.isWeiXin()) {
           return;
       }
       var me = Share;
       me.wxShareGuid();
       if (me.is_register == 0) {
           me.registerShare();
       }
       return;
       
       me.register(function(){
//       WeixinJSBridge.on('menu:share:appmessage', function(argv){
       content = me.getShareContent();
       WeixinJSBridge.invoke('sendAppMessage',{
              'img_url': content.img,
              'link': content.link,
              'desc': content.desc,
              'title': content.title
              }, function(res){
                console.log(res);
          });
      // });
       });
   }
   ,scan: function(){
       wx.scanQRCode();
   }
    
};

Share.init();
var NavFunc = {
       '/webapp/' : {show:true},
       '/webapp/index.html' : {show:true},
       '/webapp/allproduct.html' : {show:true},
       '/webapp/shoppingCart.html' : {show:true},
       '/webapp/king.html' : {show:true, callback:{a:User.initKing,b:User}},
       '/webapp/supplier.html' : {show:true, callback:{a:User.initSupplier,b:User}}
};
path = location.pathname;
//注册分享回调
FuncNavi.addCallback(Share.registerShare, Share);
if (path in NavFunc) {
    var item = NavFunc[path];
    if (item.callback) {
        FuncNavi.addCallback(item.callback.a, item.callback.b);
    }
    FuncNavi.run();
} else {
    //不显示导航栏
    FuncNavi.run(true);
}

history.igo = history.go;
history.go = function(index){
    if (history.length > 1) {
        history.igo(index); 
    } else {
        location.replace("index.html");
    }
       
}

