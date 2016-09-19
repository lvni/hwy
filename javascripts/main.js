/*'use script'*/
/**
 * @author zhangyuliang
 * @date 2016-06
 * @brief 洪五爷珠宝
 **/
var host = location.host;
var prefx = "";
var pathname = location.pathname;
 if (pathname.indexOf('test') >= 0) {
     prefx = "/test";
 }
 var _czc = _czc || []; //统计
 host +=  prefx;
if (location.href.indexOf("https://") == 0) {
    host = "https://"+host;
} else {
    host = "http://" + host;
}
var config = {
    'api': host+'/api/backend/web/index.php',
    //'api': 'http://test.hong5ye.com/api/backend/web/index.php',
    'webapp': host+'/webapp/index.html',
    'page': {
        'confirm_order': 'myorder-placeorder.html',//订单确认页
        'detail': 'details.html',
        'comment' : 'updataimg.html', //评价
        'buyer_show' : 'buyersshow.html', //
        'select_address': 'address-select.html',
        'cart' : 'shoppingCart.html', //购物车
        'login': host+'/webapp/login.html', //登录页
        'home': 'index.html', //首页
        'address_edit': 'address-edit.html', //地址编辑页面
        'order_pay': 'myorder-paymode.html', //订单支付页面
        'order_detail': 'myorder-details.html',
        'user_king' : 'king.html',
        'refund' : 'refund-goods.html',
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
history.igo = history.go;
history.go = function(index){
    if (history.length > 1) {
        history.igo(index); 
    } else {
        location.replace("index.html");
    }
       
}
//错误码
var ErrorCode = {
    NO_LOGIN: 12, //没有登录
}
var Const = {
    GOODS_STATUS_ON_SELL: 1, //在售
    USER_ROLE_VISITOR : 0,
    USER_ROLE_YOUKE : 1,
    USER_ROLE_KING : 2,
    USER_ROLE_KING_ONE : 3, //一品王爷
    USER_ROLE_SUPPLIER : 4,
    USER_ROLE_SUPPLIER_LEADER : 5, //供应商队长
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
                     + 'bottom:30%;background:'
                     + '#262631;color: #fff;border-radius: 5px;padding: 6px 10px;'
                     + 'text-align: center;left:100;z-index:999;">'+msg+'</div>';
        //alert(msg);
        if ($("#system_messagebox_toast").length) {
            return;
        }
        $('body').append(html);
        var marginLeft = 0 - $("#system_messagebox_toast").width() / 2;
        $("#system_messagebox_toast").css('margin-left', marginLeft + "px").css("left", "50%");
        
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
    ,updateDialog: function(title, content, force, sid, callback) {
   
        var html = '<div class="u-popodbox" id="js-confirm-box">'
                      + '<div class="cont">'+'<span>' +title+'</span>'
                      +'<h2>'+ content + '</h2><div class="buttonbox">';
                      
        if (force != 1) {
            html +=  '<button class="u-button-gray"><span>稍后再说</span></button>';
        }
                      
        html  += '<button class="u-button-main">'
                      + '<span>马上升级</span></button></div></div></div>';
        if ($("js-confirm-box").length) {
            return;
        }
        $('body').append(html);
        $("#js-confirm-box")[0].style.display = '-webkit-box';
        var yscfunc = function(){
            //$("#js-confirm-box").remove();
            if (typeof callback == 'function') {
                callback();
            }
        }
        
        $("#js-confirm-box .u-button-main").bind('click', yscfunc);
        $("#js-confirm-box .u-button-gray").bind("click", function(){
            $("#js-confirm-box").remove();
            Storge.setItem('last_check_sid', sid);
        });
    }
    
};

String.prototype.replaceAll = function(s1,s2) { 
    return this.replace(new RegExp(s1,"gm"),s2); 
}
/**
 * 和PHP一样的时间戳格式化函数
 * @param  {string} format    格式
 * @param  {int}    timestamp 要格式化的时间 默认为当前时间
 * @return {string}           格式化的时间字符串
 */
function date(format, timestamp){ 
    var a, jsdate=((timestamp) ? new Date(timestamp*1000) : new Date());
    var pad = function(n, c){
        if((n = n + "").length < c){
            return new Array(++c - n.length).join("0") + n;
        } else {
            return n;
        }
    };
    var txt_weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var txt_ordin = {1:"st", 2:"nd", 3:"rd", 21:"st", 22:"nd", 23:"rd", 31:"st"};
    var txt_months = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]; 
    var f = {
        // Day
        d: function(){return pad(f.j(), 2)},
        D: function(){return f.l().substr(0,3)},
        j: function(){return jsdate.getDate()},
        l: function(){return txt_weekdays[f.w()]},
        N: function(){return f.w() + 1},
        S: function(){return txt_ordin[f.j()] ? txt_ordin[f.j()] : 'th'},
        w: function(){return jsdate.getDay()},
        z: function(){return (jsdate - new Date(jsdate.getFullYear() + "/1/1")) / 864e5 >> 0},
        // Week
        W: function(){
            var a = f.z(), b = 364 + f.L() - a;
            var nd2, nd = (new Date(jsdate.getFullYear() + "/1/1").getDay() || 7) - 1;
            if(b <= 2 && ((jsdate.getDay() || 7) - 1) <= 2 - b){
                return 1;
            } else{
                if(a <= 2 && nd >= 4 && a >= (6 - nd)){
                    nd2 = new Date(jsdate.getFullYear() - 1 + "/12/31");
                    return date("W", Math.round(nd2.getTime()/1000));
                } else{
                    return (1 + (nd <= 3 ? ((a + nd) / 7) : (a - (7 - nd)) / 7) >> 0);
                }
            }
        },
        // Month
        F: function(){return txt_months[f.n()]},
        m: function(){return pad(f.n(), 2)},
        M: function(){return f.F().substr(0,3)},
        n: function(){return jsdate.getMonth() + 1},
        t: function(){
            var n;
            if( (n = jsdate.getMonth() + 1) == 2 ){
                return 28 + f.L();
            } else{
                if( n & 1 && n < 8 || !(n & 1) && n > 7 ){
                    return 31;
                } else{
                    return 30;
                }
            }
        },
        // Year
        L: function(){var y = f.Y();return (!(y & 3) && (y % 1e2 || !(y % 4e2))) ? 1 : 0},
        //o not supported yet
        Y: function(){return jsdate.getFullYear()},
        y: function(){return (jsdate.getFullYear() + "").slice(2)},
        // Time
        a: function(){return jsdate.getHours() > 11 ? "pm" : "am"},
        A: function(){return f.a().toUpperCase()},
        B: function(){
            // peter paul koch:
            var off = (jsdate.getTimezoneOffset() + 60)*60;
            var theSeconds = (jsdate.getHours() * 3600) + (jsdate.getMinutes() * 60) + jsdate.getSeconds() + off;
            var beat = Math.floor(theSeconds/86.4);
            if (beat > 1000) beat -= 1000;
            if (beat < 0) beat += 1000;
            if ((String(beat)).length == 1) beat = "00"+beat;
            if ((String(beat)).length == 2) beat = "0"+beat;
            return beat;
        },
        g: function(){return jsdate.getHours() % 12 || 12},
        G: function(){return jsdate.getHours()},
        h: function(){return pad(f.g(), 2)},
        H: function(){return pad(jsdate.getHours(), 2)},
        i: function(){return pad(jsdate.getMinutes(), 2)},
        s: function(){return pad(jsdate.getSeconds(), 2)},
        //u not supported yet
        // Timezone
        //e not supported yet
        //I not supported yet
        O: function(){
            var t = pad(Math.abs(jsdate.getTimezoneOffset()/60*100), 4);
            if (jsdate.getTimezoneOffset() > 0) t = "-" + t; else t = "+" + t;
            return t;
        },
        P: function(){var O = f.O();return (O.substr(0, 3) + ":" + O.substr(3, 2))},
        //T not supported yet
        //Z not supported yet
        // Full Date/Time
        c: function(){return f.Y() + "-" + f.m() + "-" + f.d() + "T" + f.h() + ":" + f.i() + ":" + f.s() + f.P()},
        //r not supported yet
        U: function(){return Math.round(jsdate.getTime()/1000)}
    };
    return format.replace(/[\\]?([a-zA-Z])/g, function(t, s){
        if( t!=s ){
            // escaped
            ret = s;
        } else if( f[s] ){
            // a date function exists
            ret = f[s]();
        } else{
            // nothing special
            ret = s;
        }
        return ret;
    });
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
    ,logout: function() {
        location.href = config.api + "?r=user/logout";
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
        
        var me = Util;
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
        if (type && type.toLowerCase() == 'post') {
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
                if (!silence) {
                    messageBox.toast("服务器出错啦");
                }
                
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
    ,callAppApi: function(action, prams) {
        //调用本地api
        var iframe = document.createElement("iframe");
        iframe.src = action;
        iframe.style.display = 'none';
        document.getElementsByTagName('body')[0].appendChild(iframe);
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
    ,goAppWxLogin: function(callback) {
        //原生微信登陆
        Util.callAppApi("hwy://login?act=weixin&callback="+callback);
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
                      + '<img src="'+host+'/webapp/img/loading.gif" style="width: 56px;"></div></div>';
        if (this.loadingId == 0) {
            //延迟150ms出现
            this.loadingId = setTimeout(function(){$('body').append(html);}, 150);
        }
            
    }
    ,hideLoading: function() {
        clearTimeout(this.loadingId);
        $("#loading_box").remove();
    }
    ,isApp: function() {
        var ua = window.navigator.userAgent.toLowerCase();
        var preg = /hwy\/([0-9\.]+)/i;
        var a = ua.match(preg);
        if (a) {
            return a[1];
        }
        return "";
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
        //location.href = 'host+"/webapp/kefu/im.html?tenantId=23970";
    }
    ,isIphone: function() {
        var ua = navigator.userAgent.toLowerCase();	
        if (/iphone|ipad|ipod/.test(ua)) {
             return true;		
        } 
        return false;
    }
    ,getCookie: function (name) {
        var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
        if(arr=document.cookie.match(reg))
        return unescape(arr[2]);
        else
        return null;
    }
};
//存储相关
var Storge = {
    removeItem: function(e) {
        return localStorage.removeItem(e);
    }
    ,getItem: function(e, d) {
        var r = localStorage.getItem(e);
        if (d != undefined && (r == undefined || r == null)) {
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
    //去到某个页面，同事清除浏览器history
    rfPage: function(page) {
        var hl = history.length;
         history.igo(-hl);
         window.location.replace(page);
    },
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
        var pathname = location.pathname.replace(prefx, "");
        if (pathname in paths_icons) {
            var icon_info = paths_icons[pathname];
            default_icons[icon_info['key']] = icon_info['icon'];
        }
        var html = '<div class="u-bottomnav">'
                     + '<a href="javascript:;" onclick="FuncNavi.rfPage(\'index.html\')">'
                     + '<img src="'+default_icons.index+'">'
                     + '<p>首页</p>'
                     + '{$idx_num}</a>'
                     + '<a href="allproduct.html" >'
                     + '<img src="'+default_icons.product+'">'
                     + '<p>所有产品</p>'
                     + '{$prod_num}</a>'
                     + '<a href="discovered.html" >'
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
        if (data.msg && data.msg.id) {
            //有消息
            if (Storge.getItem("msg_read") != data.msg.id) {
                //可以显示
                var style = 'margin-left:10px;';
  
                var  msgHtml = '<div id="msg_tips" style="height: 32px;line-height: 32px;font-size: 1.2rem;position:fixed;top:0;width:100%;z-index:9999;background:rgba(12, 12, 12, 0.8);">'
                                + '<div style="display:inline-block;width:85%;height: 30px;overflow: hidden;" id="msg_container"><span style="'+style+'" id="msg_content">'+data.msg.content+'</span></div>'
                                + '<span id="msg_close" style="float:right;padding:0 10px;color:#fff;">x</span></div>';
                $('body').append(msgHtml);
                var msg = data.msg;
                $("#msg_tips").delegate('#msg_close', 'click', function(){ 
                     Storge.setItem("msg_read", msg.id);
                    $("#msg_tips").remove();
                });
                
                //设置跑马灯效果
                if ($("#msg_content").height() > $("#msg_container").height()) {
                   // console.log("内容溢出了");
                  var length = $("#msg_container").width()
                  var oldHtml = $("#msg_content").html();
                  $("#msg_content").html(oldHtml + "&nbsp;&nbsp;&nbsp;&nbsp;" + oldHtml);
                   var tid = setInterval(function(){
                        var left = $("#msg_content").offset().left;
                        if (0 - left > length) {
                            $("#msg_content").css("margin-left", "10px");
                        } else {
                            left -= 10;
                            $("#msg_content").css("margin-left", left + "px");;
                        }
                        
                    }, 500);
                    
                }
            }
        }
        if (data && data.is_login) {
            //已登陆
            //to-do 不同角色，不同页面
            
            var ucenter_page = "king.html";
            if (data.user.role >= Const.USER_ROLE_SUPPLIER) {
                ucenter_page = "supplier.html";
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
        
        var isLogin = data.is_login == 0 ? "未登录" : "已登录";
        _czc.push(["_setCustomVar","是否登录",isLogin,7200]);
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
          var find_last_time = Storge.getItem('find_last_time', 0);
          params['find_last_time'] = find_last_time;
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
            var num = parseInt($(this).attr('num'));
            if (num < 1) {
                messageBox.toast("库存不足");
                return;
            }
            me.add(goodsId);
        });
        
        $('#buy').click(function(){
            var goodsId = $(this).attr('data-id');
            var role = $(this).attr('user-role');
            var num = parseInt($(this).attr('num'));
            if (num < 1) {
                messageBox.toast("库存不足");
                return;
            }
            if (role >= Const.USER_ROLE_SUPPLIER) {
                messageBox.toast("供应商不能购买");
                return;
            }
            
            if (window['goods']) {
                if (window['goods'].act_type != 0) {
                    messageBox.toast("活动商品不能购买");
                return;
                }
            }
            
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
    ,goodsDetailLoadCallback: [] //商品加载回调
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
        if (data.video != "") {
            //有视频
            var video = '<video width="100%" src="'+data.video+'" controls="controls"></video>';
            $("#video").show().append(video);
        }
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
        window['goods'] = data;
        $(".productinfo-head .title").html(data.title); 
        $(".productinfo-head .shop_price").html(data.price); 
        $(".productinfo-head .view").html(data.view_cnt); 
        $(".productinfo-head .likes").html(data.likes_cnt); 
        $(".productinfo-list .cont").html(attrHtml);
        $(".details-slide .slides").html(slideHtml);
        $("#add,#buy,#detail_collect,#detail_likes_up").attr('data-id', data.id).attr('num', data.number);
        $("#add,#buy,#detail_collect,#detail_likes_up").attr('user-role', data.role);
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
        
        //商品回调
       for (i in Bootstrap.goodsDetailLoadCallback) {
           var fc = Bootstrap.goodsDetailLoadCallback[i];
           if (typeof fc == 'function') {
               fc();
           }
       }
        
    }
    ,setLikes: function(goodsId) {
        var key = 'gl_' + goodsId;
        var likeCnt = parseInt(Storge.getItem(key, 0));
        if (isNaN(likeCnt)) {
            likeCnt = 0;
        }
        if (likeCnt > 0) {
            $("#detail_likes_up img").attr('src', host+'/webapp/img/s-likes.png');
        }
    }
    ,updateIcon: function(collected) {
        
        if (collected == "1") {
            $("#detail_collect img").attr('src', host+'/webapp/img/star.png');
        } else {
            $("#detail_collect img").attr('src', host+'/webapp/img/details_22.png');
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
                    .replace('{$page}', data.page)
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
        
        //图片lazy load
        var imgs = [];
        $(".page_"+data.page+" img").each(function(){
           //加载图片
           var image = new Image();
           image.src = $(this).attr('data-src');
           image.target = this;
           image.onload = function(){
              this.target.src = this.src;
              delete this;
           }
           
        });
        
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
                $("#loading-more").html('加载中 ... <img src="img/loading.gif" style="width:24px;">');
            } else {
                $("#loading-more").html("没有更多");
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
        var material = [];
        var position = [];
        //获取分类ids
        $('#js-chooseclass .cont').each(function(i,e){
            var role = $(e).attr('data-role');
            var name  =$(e).find('p').html();
            if ( role== 'shaixuan') {
                cids.push($(e).attr('data_cat_id'));
            }
            if ( role== 'buwei') {
                position.push($(e).attr('data_cat_id'));
                _czc.push(["_setCustomVar", '部位',name,1]);
            }
            if ( role== 'caizhi') {
                material.push($(e).attr('data_cat_id'));
                _czc.push(["_setCustomVar", '材质',name,1]);
            }
            
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
        me.searchQuery.p_from = p_from;
        me.searchQuery.p_to = p_to;

        me.searchQuery['cids'] = cids.join(',');
        me.searchQuery['position'] = position.join(',');
        if (!Util.getQueryString('material')) {
            me.searchQuery['material'] = material.join(',');
        }
        
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
            var material = Util.getQueryString('material');
            if (k) {
                $('title').html("搜索-"+Util.escape(k));
            }        
            if (material) {
                this.searchQuery.material = material;
            }
            var type = Util.getQueryString('type');
            var typeTitles = {
                'zhen' : "臻品堂",
                'yujian': '玉见',
            };
            if (type in typeTitles) {
                $('title').html(typeTitles[type]);
                this.searchQuery.type = type;
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
                          if (data.errno == 10403) {
                              //需要绑定手机
                              $("#bind-mobile-box").show();
                          }
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
                window.location.href = config.page.comment + "?order="+order_sn;
            }
            if (type == 'remind') {
                //提现发货
                setTimeout(function(){messageBox.toast("已提醒卖家，尽快为您发货")},150);
            }
            if (type == "return_money") {
                //申请退款
                location.href = config.page.refund + "?act=1&order="+ order_sn;
            }
            if (type == "return_goods") {
                //申请退款
                location.href = config.page.refund + "?act=2&order="+ order_sn;
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
                                
                            } else {
                                location.reload();
                            }
                        
                    });
                });
            }
        });
        
        //下拉事件
        //console.log("注册事件");
        $(window).scroll(me.orderMainScrollEvent);
    }
    //订单下拉事件实际处理
    ,orderMainScrollEvent: function() {
        var me = Order;
        //console.log("gun");
        if (Bootstrap.checkWindowAtButtom()) {
        //console.log("底部了");
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
            if (goods.can_return_money) {
                Buttons += normalBntTemplate.replace('{$type}', 'return_money').replace('{$tips}', '申请退款');
            }
            if (goods.can_return_gooods) {
                Buttons += normalBntTemplate.replace('{$type}', 'return_goods').replace('{$tips}', '申请退货');
            }
            if (goods.order_status == 100) {
                //待支付
                tips = "待付款";
                Buttons += normalBntTemplate.replace('{$type}', 'cancel').replace('{$tips}', '取消订单');
                Buttons += mainBntTemplate.replace('{$type}', 'pay').replace('{$tips}', '立即付款');
            }
            if (goods.order_status == 101) {
                //待发货
                tips = "待发货";
                if (goods.can_return_money) {
                    Buttons += mainBntTemplate.replace('{$type}', 'remind').replace('{$tips}', '提醒发货');
                }
                
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
            if (goods.order_status == 112) {
                tips = "交易关闭";
            }
            return {'bnt': Buttons, 'tips': tips};
    }
    ,getOrderTips: function (order_info) {
        var tips = {
            100: {
                t: "等待买家付款",
                st: "1小时内未付款自动取消订单",
                icon: "img/order_wait_pay.png",
                type : 1,
            },
            101: {
                t: "等待商家发货",
                st: "成功付款后48小时内发货",
                icon: "img/order_wait_ship.png",
                type : 1,
            },
            102: {
                t: "交易已完成",
                st: "感谢您惠顾",
                icon: "img/order_done.png",
                type : 2,
            },
            103: {
                t: "商品已发出",
                st: "",
                icon: "img/order_wait_receive.png",
                type : 1,
            },
            104: {
                t: "交易完成",
                st: "感谢您惠顾",
                icon: "img/order_done.png",
                type : 2,
            },
            105: {
                t: "交易已取消",
                st: "感谢您惠顾",
                icon: "img/order_cancel.png",
                type : 2,
            },
            107: {
                t: "已退货",
                st: "感谢您惠顾",
                icon: "img/order_cancel.png",
                type : 1,
            },
            108: {
                t: "订单已失效",
                st: "感谢您惠顾",
                 icon: "img/order_invalid.png",
                 type : 1,
            },
            109: {
                t: "退款申请中",
                st: "感谢您惠顾",
                 icon: "img/order_cancel.png",
                 type : 1,
            },
            110: {
                t: "退款完成",
                st: "感谢您惠顾",
                 icon: "img/order_cancel.png",
                 type : 1,
            },
            111: {
                t: "退款失败",
                st: "感谢您惠顾",
                icon: "img/order_cancel.png",
                type : 1,
            },
            112: {
                t: "交易关闭",
                st: "感谢您惠顾",
                icon: "img/order_cancel.png",
                type : 2,
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
        data.data.order_img = Tips.icon;
        
        var detailHead = '<div class="details-head" >'
                              + '<img src="'+Tips.icon+'" class="icon">'
                              + '<h2 class="title">'+Tips.t+'</h2>'
                              + '<p class="tips">'+Tips.st+'</p></div>';
                              
         if (Tips.type == 2) {
             //另外的显示方式
             detailHead = '<div class="details-head" style="padding:20px;"><img src="'+Tips.icon+'" style="width:48px;padding-bottom:5px;"><p>'+Tips.t+'</p></div>';
         }
        data.data.pay_tips = "实付款";
        data.data.detail_head = detailHead;
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
        var isApp = Util.isApp();
        $.ajax({
            url: api,
            data: {order: orderSn,isApp:isApp},
            dataType: 'json',
            async: false,
            success: function(data) {
                ret = data;
            }
            ,error: function(data) {
                messageBox.toast("支付异常");
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
                        //messageBox.toast(res.err_msg);
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
        if (Util.isWeiXin() && Util.canWeixinPay()) {

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
                        
        }else if (Util.isApp()) {
            //app
            //稍微处理下
            var params = me.wxParams.data;
            //delete params['package'];
            params['order_sn'] = orderSn;
            var api = "hwy://pay?act=weixin&callback=AppCall.wxPayBack&params="
                       + encodeURIComponent(JSON.stringify(params));
            //messageBox.toast(api);
            AppCall.successCallback = function(){
                setTimeout(function(){me.gotoDetail(orderSn);}, 1500);
            };
            Util.callAppApi(api);
        } else {
            messageBox.toast("请在微信5.0打开");
        }
        
    }
    ,bindPaymentEvent: function(orderSn){
        //u-arrow-list
        var me = this;
        
        $('.u-arrow-list').delegate('.list', 'click', function(){
             var payType = $(this).attr('pay-type');
             
             if (payType == 'weixin') {
                 //微信支付
                 
                 if (!Util.isApp() && !Util.canWeixinPay()) {
                     messageBox.toast("请使用微信5.0以上版本打开");
                     return;
                 } 
                 me.weixinPay(orderSn);
                 
             } 
             
             if (payType == 'alipay') {
                 me.alipay(orderSn);
             }
        });

    }
    ,alipay: function(orderSn) {
        var api = config.api +"?r=order/alipay";
        var ret = {};
        var isApp = Util.isApp();
        //获取支付宝支付参数
        $.ajax({
            url: api,
            data: {order: orderSn,isApp:isApp},
            dataType: 'json',
            async: false,
            success: function(data) {
                ret = data;
            }
            ,error: function(data) {
                messageBox.toast("支付异常");
                return ;
            }
            
        });
        if (ret.errno != 0) {
            
            messageBox.toast(data.errmsg);
            return;
        }
        var nativeApi = "hwy://pay?act=alipay&callback=AppCall.aliPayBack&orderStr=" + encodeURIComponent(ret.data.orderStr);
        AppCall.successCallback = function(){
             setTimeout(function(){me.gotoDetail(orderSn);}, 1500);
        };
        Util.callAppApi(nativeApi);
        
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
    ,user_images : {
        0 : {
            img: '',  //身份标识
            title: '', //皇冠
        },
        1 : {
            img: '',  //身份标识
            title: '', //皇冠
        },
        2 : {
            img: 'img/user_y.png',  //身份标识
            title: '', //皇冠
        },
        3 : {
            img: 'img/user_yo.png',  //身份标识
            title: true, //皇冠
        },
        4: {
            img: 'img/user_sp.png',  //身份标识
            title: '', //皇冠
        },
        5 : {
            img: 'img/user_spl.png',  //身份标识
            title: '', //皇冠
        },
                
    }
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
                //$("#my_mate").show();
                $("#myincome-entry").attr('href', config.page.income_king);
                var role = data.user.role == Const.USER_ROLE_KING_ONE ? "一品王爷" : "王爷";
                $('title').html("个人中心-"+role);
            }
            
            if (User.user_images[data.user.role]) {
                var ifo = User.user_images[data.user.role];
                if (ifo.img != "") {
                    $(".u-person-head .id_notice").attr('src', ifo.img);
                } else {
                    $(".u-person-head .id_notice").hide();
                }
                
                
                if (ifo.title == true) {
                    $(".u-person-head .photo-king").show();
                }
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
        
        if (User.user_images[data.user.role]) {
                var ifo = User.user_images[data.user.role];
                 if (ifo.img != "") {
                    $(".u-person-head .id_notice").attr('src', ifo.img);
                } else {
                    $(".u-person-head .id_notice").hide();
                }
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
                if (parseFloat(item.rebate_money) == 0) {
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
    ,initMyjadeTeam: function(data) {
        
        if (data.is_login) {
            
        } else {
            //
            messageBox.toast("请先登录");
            Util.goLogin(location.href);
        }
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
       Share.sid = "";
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
            '/webapp/allproduct.html': 1,
            '/webapp/activity/201609/': 1,
            '/webapp/activity/201609/index.html': 1,
            '/webapp/activity/201609/details.html': 1,
       }
       if ( !(location.pathname.replace(prefx, '') in valids)) {
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
       var simg = host+'/webapp/img/share_guid.png'
       var html = '<div id="share_guid" style="position: fixed;top: 0; left: 0;width: 100%;height: 100%;background: rgba(0, 0, 0, 0.7);display: ;z-index: 20000;">'
                     + '<img style="position: fixed;right: 30px;top: 10px;z-index: 999;" src="'+simg+'"></div>';
        $('body').append(html);             
        $("#share_guid").click(function(){
            $(this).remove();
        });
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
            var url = host+'/api/backend/web/index.php?r=user/wxjsonfig&v='+Math.random();
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
       var me = this;
       if (Util.isApp()) {
           //是自己app
           var api = "hwy://share?callback=AppCall.shareBack&params="
                       + encodeURIComponent(JSON.stringify(me.getShareContent()));
           Util.callAppApi(api);
           return ;
       }
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
       if (Util.isWeiXin()) {
           wx.scanQRCode();
       }
       if (Util.isApp()) {
           var api = "hwy://scan?params={}&callback=AppCall.scanBack";
           Util.callAppApi(api);
       }
       
   }
    
};
var setName = {
    //修改用户昵称
    init: function(data) {
        if (data.is_login != 1) {
            //没有登录
            Util.goLogin();
            return;
        }
        $("#nick_name").val(data.user.name);
        
        var updateNickName = function(){
            var name = $("#nick_name").val().trim();
            if (name == "") {
                messageBox.toast("名称不能为空");
                return;
            }
            $("#nickname-save").unbind('click', updateNickName);
            Util.requestApi('?r=user/modifyname', {name:name}, function(data){
                messageBox.toast(data.errmsg);
                $("#nickname-save").bind('click', updateNickName);
            })
        };
        $("#nickname-save").bind('click', updateNickName);
    },
};
Share.init();
Share.init();
var NavFunc = {
       '/webapp/' : {show:true},
       '/webapp/index.html' : {show:true},
       '/webapp/allproduct.html' : {show:true},
       '/webapp/shoppingCart.html' : {show:true},
       '/webapp/discovered.html' : {show:true},
       '/webapp/king.html' : {show:true, callback:{a:User.initKing,b:User}},
       '/webapp/supplier.html' : {show:true, callback:{a:User.initSupplier,b:User}},
       '/webapp/editname.html': {show:false,callback:{a:setName.init,b:setName}}
};
//继承，用户页面可以自定义是否显示导航栏
if (typeof CustomNaviFunc == 'object') {
    NavFunc = $.extend(NavFunc, CustomNaviFunc);
}
path = location.pathname;
//注册分享回调
FuncNavi.addCallback(Share.registerShare, Share);
var funcRun;
path = path.replace(prefx, '');
if (path in NavFunc) {
    var item =  NavFunc[path];
    if (item.callback) {
        FuncNavi.addCallback(item.callback.a, item.callback.b);
    }
    funcRun = function() { FuncNavi.run(!item.show); }; 
} else {
    //不显示导航栏
    funcRun = function() { FuncNavi.run(true); }; 
    
}
funcRun();
//setInterval(funcRun, 4000);



//插入统计代码
var doc=document;  
var script=doc.createElement("script"); 
var url = 'https://s95.cnzz.com/z_stat.php?id=1259996740&web_id=1259996740';
script.setAttribute("src", url);  
var heads = doc.getElementsByTagName("head");  
heads[0].appendChild(script); 

$(function(){
    $(".u-backtop").click(function(){
        document.documentElement.scrollTop = document.body.scrollTop =0;
    });
    
});

//alert("test");

//客户端回调前端的js
var AppCall = {
    
    hello: function(obc) {
        messageBox.toast("hello : " + obc);
    },
    wxCallback: function(data) {
        //微信成功回调
        
        try {
            if (typeof data == 'object') {
                var jsObt  = data;
            } else {
                var jsObt  = JSON.parse(data);
            }
            
            if (jsObt.errCode != 0) {
                messageBox.toast("取消登录");
                return ;
            }
            var params = {
                isApp: 1,
                code: jsObt.code,
                state : 123,
            };
            //messageBox.toast(params.code);
            var redirect = Util.getQueryString('redirect');
            //调用服务端接口
            $.ajax({
                url: config.api +"?r=user/wxcallback",
                data:params,
                type: 'GET',
                dataType: 'json',
                success: function(redata) {
                    if (redata.errno == 0) {
                         messageBox.toast("登录成功");
                         redirect = redirect ? redirect : config.page.home;
                         location.href = redirect;
                    } else {
                        messageBox.toast(redata.errmsg);
                    }
                },
                error: function() {
                    messageBox.toast("登录出现问题，请稍后重试");
                }
                
            });
            
        }catch(e) {
            console.log(e);
            messageBox.toast("出错啦");
        }
         
    }
    //微信支付回调
    ,wxPayBack: function(data) {
        try {
            if (typeof data == 'object') {
                var jsObt  = data;
            } else {
                var jsObt  = JSON.parse(data);
            }
            if (jsObt.errCode == 0) {
                messageBox.toast("成功支付，请耐心等待");
                if (AppCall.successCallback) {
                    return AppCall.successCallback();
                } 
            } else {
                messageBox.toast("支付失败");
            }
            
        } catch(e) {
            messageBox.toast("支付异常");
        }
        
        
    }
    //支付宝支付回调
    ,aliPayBack: function(data) {
        try {
            if (typeof data == 'object') {
                var jsObt  = data;
            } else {
                var jsObt  = JSON.parse(data);
            }
            if (jsObt.resultStatus == '9000') {
                messageBox.toast("成功支付，请耐心等待");
                if (AppCall.successCallback) {
                    return AppCall.successCallback();
                } 
            } else {
                messageBox.toast("支付失败");
            }
            
        } catch(e) {
            messageBox.toast("支付异常");
        }
        
        
    }
    ,shareBack: function(data) {
        try {
            if (typeof data == 'object') {
                var jsObt  = data;
            } else {
                var jsObt  = JSON.parse(data);
            }
            if (jsObt.errCode == 0) {
                messageBox.toast("分享成功");
   
            } else {
                messageBox.toast("分享取消");
            }
            
        } catch(e) {
            messageBox.toast("分享异常");
        }
    }
    //二维码扫描回调
    ,scanBack: function(data) {
        try {
            if (typeof data == 'object') {
                var jsObt  = data;
            } else {
                var jsObt  = JSON.parse(data);
            }
            if (jsObt.errCode == 0) {
                //扫码成功
                var content = jsObt.content;
                if (content.indexOf('http') == 0) {
                    location.href=content;
                } else {
                    messageBox.toast("扫描结果:" + content);
                }
            }
            if (jsObt.errCode == -1) {
                messageBox.toast("扫描失败，请检查是否有摄像头权限");
            }
            if (jsObt.errCode == 1) {
                //正常取消
                //messageBox.toast("");
            }
            
        } catch(e) {
            messageBox.toast("扫码出现异常");
        }
    }
    
    //推送信息
    ,pushBack: function(data) {
          try {
            if (typeof data == 'object') {
                var jsObt  = data;
            } else {
                var jsObt  = JSON.parse(data);
            }
            //messageBox.toast(jsObt.title + ":" + jsObt.content);
            if (jsObt.customContent && jsObt.customContent.url) {
                //
                location.href = jsObt.customContent.url;
            }
          } catch (e) {
              //解析异常，不处理
          }
    }
    
    //设备注册
    ,deviceRegister: function(data) {
        try {
            if (typeof data == 'object') {
                var jsObt  = data;
            } else {
                var jsObt  = JSON.parse(data);
            }
            if (jsObt.token) {
                Util.requestApi("?r=device/bind", {token:jsObt.token}, function(data) {
                    console.log(data);
                }, "post", true);
            }
            
            
            
          } catch (e) {
              //解析异常，不处理
          }
    }
    
};

//当前客户端信息
var Client = {
    client : 3,// 1 app 2 weixin 3 web 
    buildNo:0,
    channel: "web",
    os: -1, // 0 android, 1 ios -1 web
    sv: "", 
    init:function() {
        var ua = window.navigator.userAgent.toLowerCase();
        var appPattern = /(hwy)\/([0-9\.]+)(\s+\((\d+)\))?/i;
        var wxPattern  = /MicroMessenger\/([0-9\.]+)/i;
        var androidPattern = /(android)/i;
        var iphonePattern =  /(iphone|ipad)/i;
        var channelPattern = /channel\((\d+)\)/i;
        var result ;
        var me = this;
        if (result = ua.match(appPattern)) {
            me.client = 1;
            me.buildNo = result[4] ? result[4] : 0;
            me.sv = result[2];
            
        }
        if (result = ua.match(wxPattern)) {
            me.client = 2;
        } 
        if (result = ua.match(androidPattern)) {
            me.os = 0;
        } 
        if (result = ua.match(iphonePattern)) {
            me.os = 1;
        } 
        if (result = ua.match(channelPattern)) {
            me.channel = result[1];
        } 
        
    },
    isApp: function() {
        return this.client == 1;
    },
    isAndroid: function() {
        return this.os == 0;
    },
    isIos: function() {
        return this.os == 1;
    },
    isWeixin: function() {
        return this.client == 2;
    },
    toString: function() {
        return "client " + this.client  
                   + " os " + this.os
                   + " channel " + this.channel
                   + " buildNo " + this.buildNo
                   + " sv " + this.sv;
    }
    
};

Client.init();


//统计相关
var Statics = {
    send: function() {
        $.get(config.api+"?r=statics/push", function(res){
            console.log(res);
        });
    }
    
};

setTimeout(function(){Statics.send()}, 1000);

var origin = "web";
origin = Util.isApp() ? "app" : origin;
origin = Util.isWeiXin() ? "weixin" : origin;
_czc.push(["_setCustomVar","终端",origin,0]);
if (Client.isApp()) {
    _czc.push(["_setCustomVar","渠道",Client.channel,0]);
}


//访问来源
var fr = Util.getQueryString('fr');
if (fr) {
    var frStr = "未知";
}
//Util.showLoading();


/**
 * app 检查更新
 **/
var UpdaterManager = {
    
     check: function() {
        //messageBox.toast("开始检查");
        try {
         Util.requestApi("?r=package/checkupdate", {}, function(data){
            
             if (data.errno ==0) {
                 if (data.data.has_update == '1') {
                     //有更新
                     //messageBox.toast("edfdf" + data.data.has_update);
                     var info = data.data.update_info;
                     var  title = "app有新版v"+info.sv;
                     //messageBox.toast(title);
                     messageBox.updateDialog(title, info.feature, info.is_force,data.data.sid, function(){
                         //调用接口更新
                         if (Client.isAndroid()) {
                             title = "洪五爷珠宝v"+info.sv;
                             var params = {
                                 title: title,
                                 url: info.link,
                                 desc: "正在下载洪五爷珠宝",
                             };
                             var api = "hwy://update?params="+encodeURIComponent(JSON.stringify(params));
                            Util.callAppApi(api);
                         }
                         
                         
                     });
                 }
             }
             
         },
         'get', true);
         } catch(e) {
             alert(e);
         }
     }
};
//UpdaterManager.check();


/**
 * 活动弹窗广告类
 **/
 
 var AdManager = {
     /**
      * 加载大图广告，每个页面都需要，所以每次都要请求
      **/
     requestAd: function() {
         
         if ((typeof notShowDiago != 'undefined') && notShowDiago == 1) {
             //特殊页面不显示
             return;
         }
         Util.requestApi('?r=ad/dialog', {}, function(data){
             
             if (data.data && data.data.id) {
                 //有广告
                 AdManager.showDialog(data.data);
             }
         },
         'get', true);
     }
     ,showDialog: function(data) {

         
         var yoAdInfo = data;
         var adId = yoAdInfo.id;
         var adshowinfo = Storge.getItem('ad_dialog');
         adshowinfo = JSON.parse(adshowinfo);
         if (adshowinfo == null) {
             adshowinfo = {id:0,st:0,t:0,sid:''};
         }
         var sid = yoAdInfo.sid; //会话id
         if (adshowinfo.sid == sid && adshowinfo.id == adId) {
              // 一次会话只显示一次
             return;
         }
         if (data.period == 0) {
             //常驻
             
         }
         if (data.period == 1) {
             //显示一次
             if (adshowinfo.id == adId) {
                 //显示过了
                 return ;
             }
         }
         if (data.period == 2) {
             //每天一次
             if (adshowinfo.id == adId) {
                 //检查今天是否显示过了
                 var today = date('Ymd');
                 var showDate = date('Ymd',adshowinfo.t / 1000);
                 if (today == showDate) {
                     return;
                 }
                 
             }
             
         }
         var htm = '<div id="yo_dialog" style=" position: fixed;width: 100%;height: 100%;background: rgba(0,0,0,0.5);top: 0;z-index: 999;text-align: center;">'
                      + '<table style="height: 100%;">'
                      + '<tr><td><div style="position:relative;"><img src="'+yoAdInfo.img+'" style="width:80%" id="yo_img">'
                      + '<img src="'+host+'/webapp/img/yo_close.png" style="position:absolute;top:0;right:10%;width:12%;" id="yo_close">'
                      + '</div></td></tr></table></div>';
         $('body').append(htm);
         $("body").bind("touchmove", function(event) {
            event.preventDefault();
        });
         function setView() {
             adshowinfo.id = data.id;
             adshowinfo.t = (new Date()).getTime();
             adshowinfo.st ++;
             adshowinfo.sid = sid;
             console.log(adshowinfo)
             Storge.setItem('ad_dialog', JSON.stringify(adshowinfo));
             $("body").unbind('touchmove');
         }
         if (yoAdInfo.link) {
             $("#yo_img").bind('click', function(){
                 setView();
                 location.href = yoAdInfo.link;
             });
         }
         $("#yo_close").bind('click', function(){
             //
             setView();
             $("#yo_dialog").remove();
         });
         
     } 
      
 };
 
 AdManager.requestAd();
