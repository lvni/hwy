'use script'
/**
 * @author zhangyuliang
 * @date 2016-06
 * @brief 洪五爷珠宝
 **/
var config = {
    'api': 'http://h5.hong5ye.com/api/backend/web/index.php',
    'page': {
        'confirm_order': 'myorder-placeorder.html',//订单确认页
        'select_address': 'address-select.html',
        'cart' : 'shoppingCart.html', //购物车
        'login': 'login.html', //登录页
        'home': 'index.html', //首页
        'address_edit': 'address-edit.html', //地址编辑页面
        'order_pay': 'myorder-paymode.html', //订单支付页面
        'user_king' : 'king.html',
        'collection': 'collection.html', //我的收藏
    },
};
//错误码
var ErrorCode = {
    NO_LOGIN: 12, //没有登录
}
var Const = {
    GOODS_STATUS_ON_SELL: 1, //在售
    
}

//消息盒子相关
var messageBox = {
    toast: function(msg) {
        alert(msg);
    }
    
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
    renderByTempate: function(template, data) {
        var html = template;
        for (i in data) {
            html = html.replace("{$"+i+"}", data[i]);
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
        window.location.href = config.page.login + "?redirect=" + callback;
        
    }
    //请求接口
    ,requestApi: function(api, data, callback) {
        var url = config.api + api;
        $.ajax({
            url: url,
            dataType: 'jsonp',
            data: data,
            success: callback,
            error: function() {
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
        var html = '<div class="u-bottomnav">'
                     + '<a href="index.html">'
                     + '<img src="img/hw_72.png">'
                     + '<p>首页</p>'
                     + '{$idx_num}</a>'
                     + '<a href="allproduct.html">'
                     + '<img src="img/hw_74.png">'
                     + '<p>所有产品</p>'
                     + '{$prod_num}</a>'
                     + '<a href="javascript:;">'
                     + '<img src="img/hw_76.png">'
                     + '<p>发现</p>'
                     + '{$find_num}</a>'
                     + '<a id="navi_goods_cart" href="{$cart_action}">'
                     + '<img src="img/hw_78.png">'
                     + '<p>购物车</p>'
                     + '{$cart_num}</a>'
                     + '<a id="navi_ucenter" href="{$ucenter_action}">'
                     + '<img src="img/hw_80.png">'
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
            htmlStr = htmlStr.replace('{$cart_action}', 'shoppingCart.html')
                                     .replace('{$ucenter_action}', 'king.html');
        } else if (data && data.is_login == 0){
            htmlStr = htmlStr.replace('{$cart_action}', 'login.html')
                                     .replace('{$ucenter_action}', 'login.html');
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
         $('body').append(html);
    }
    //加载提醒数据
    ,loadNaviData: function() {
          var api = config.api + "?r=center/navi";
          var me = this;
          $.ajax({
              url: api,
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
    ,addCallback: function (func, proxy) {
        var me = this;
        if (typeof func == 'function') {
            me.funcs.push({
                'proxy': proxy,
                'func'  : func
            });
        }
    }
    ,run: function() {
        //this.rendNavi();
        $('.u-bottomnav').remove();
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
    
    
    //购物车操作
    bindAddEvent: function() {
        var me = this;
        $('#add').click(function(){
            var goodsId = $(this).attr('data-id');
            var api = config.api + "?r=cart/add";
            $.ajax({
                url: api,
                dataType : "jsonp",
                data: {goods_id: goodsId, num:1},
                success: function(data) {
                    messageBox.toast(data.errmsg);
                }
            });
        });
        
    }
    
    //绑定购物车列表页事件
    ,bindCartListEvent: function() {
        
        //购物车勾选事件
        $('.u-shoppingCartlist').delegate('.u-checkbox', 'change', function() { 
             //购物车勾选变化
             //遍历所有checkbox
             var goodCnt = 0;
             var goodPrice = 0;
             //计算勾选的货品数量，价格总额
             $(".u-shoppingCartlist input[type=checkbox]:checked").each(function(i){
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

        }); 
        
        //全选事件
        $(".u-pay input[type=checkbox]").change(function(){
             if ($(this).attr('checked') ) {
                $('.u-shoppingCartlist input[type=checkbox]').prop('checked', true).trigger('change');
              
                 
             } else {
                //取消全选
                $('.u-shoppingCartlist input[type=checkbox]').prop('checked', false).trigger('change');
             
                 
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
    }
    //渲染购物车列表
    ,renderCartList: function(data) {
        var template = $('#cart_template').html();
        var html = "";
        for (i in data.list) {
            var item = data.list[i];
            var datainfo = item.goods_id+"|"+item.goods_price+"|"+item.goods_num;
            html += template.replace('{$title}', item.goods_name)
                            .replace('{$money}', item.goods_price)
                            .replace('{$img}', item.goods_img)
                            .replace('{$number}', item.goods_num)
                            .replace('{$data}', datainfo);
        }
        if (html) {
            $('.u-shoppingCartlist').html(html);
        } else {
            $('.u-shoppingCartlist .empty').show();
        }
       
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
        console.log(data);
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
        var swiper = new hlSwiper("#hl-swiper", {
            loop: true, //是否循环
            autoloop: true, //是否自动循环
            speed: 3000 //间隔时间毫秒
        });
    }
    //渲染搜索/所有产品页面
    ,renderSearch: function(data, append) {
        //console.log(data);
        var me = this;
        me.hasMore = data.hasMore;
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
        $.ajax({
            url: api,
            data: query,
            dataType: 'jsonp',
            success: function(data) {
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
                html += "<option value="+item.name+" data_id= "+item.id+">"+item.name+"</option>";
            }
            $("div[data-role=buwei] select").append(html);
        }
        //材质
        if (data[1]) {
            var html = '';
            list = data[1].list;
            for (i in list) {
                var item = list[i];
                html += "<option value="+item.name+" data_id= "+item.id+">"+item.name+"</option>";
            }
            $("div[data-role=caizhi] select").append(html);
        }
        //筛选
        if (data[3]) {
            var list = data[3].list;
            for (i in list) {
                item = list[i];
                var html = "<div><span class=\"name\">"+ item.name +"</span></div><div class=\"priceboxes\">";
                for (j in item.children) {
                    var cat = item.children[j];
                    html += "<a javascript:;  data-name='"
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
    //搜索变化事件
    ,triggerSearchChange: function() {
        var me = this;
        var cids = [];
        $('#js-chooseclass .cont').each(function(i,e){
            cids.push($(e).attr('data_cat_id'));
        });
        me.searchQuery['cids'] = cids.join(',');
        me.searchQuery.p = 1; //重置页码
        me.loadSearch(me.searchQuery, false);
    }
    ,bindSearchEvent: function() {
    
        var me = this;
        $('#js-navSelect select').change(function() {
            //获取查询条件
            me.triggerSearchChange();
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
            if ($(this).attr('data-collected') == '1') {
                //移除
                var api = config.api + "?r=collect/remove";
                $.ajax({url: api,dataType:'jsonp',
                    data: {goods_ids: goodsId},
                    success:function(data){
                        //成功
                        messageBox.toast(data.errmsg);
                        $(this).attr('data-collected', 0);
                }});
            } else {
                //可以收藏
                var api = config.api + "?r=collect/add";
                $.ajax({url: api,dataType:'jsonp',
                    data: {goods_id: goodsId},
                    success:function(data){
                        //成功
                        messageBox.toast(data.errmsg);
                        $(this).attr('data-collected', 1);
                }});
            }
        });
        //detail_likes_up
        //点赞
        $('#detail_likes_up').click(function(){
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
                    }
                }
            });
            
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
        this.bindSearchScroll();
        this.bindSearchEvent();
        var k = Util.getQueryString('k');
        if (k) {
            $('title').html("搜索-"+Util.escape(k));
        }        
        this.loadSearchCategories();
        this.searchQuery.k = k;
        this.loadSearch(this.searchQuery, false);
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
        
        $('.placeorder-infobox input[type=checkbox]').click(function(){
            var checked = $(this).attr('checked') ? 1 : 0;
            var goods_cost =  me.order_info.goods_cost;
            var need_Pay = goods_cost;
            if (checked) {
                need_Pay += 2; //2块钱运费险
            }
            $('#confirm_price_bottom, #confirm_price').html("￥ " + need_Pay);
        });
    }
    
    //跳转去支付
    ,gotoPay: function(order_sn) {
           window.location.href = config.page.order_pay + "?order=" + order_sn ;
    }
    ,renderConfirmPage: function(data) {
        var tempate = $('#confirm_goods_template').html();
        var html = "";
        for(i in data.list) {
            var item = data.list[i];
            html += tempate.replace('{$goods_name}', item.goods_name)
                           .replace('{$goods_img}', item.goods_img)
                           .replace('{$goods_id}', item.goods_id)
                           .replace('{$goods_price}', item.goods_price)
                           .replace('{$goods_num}', item.goods_num)
                           .replace('{$goods_sn}', item.goods_sn);
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
        var api = config.api + "?r=order/getorderinfo";
        var me = this;
        $.ajax({
            url: api,
            dataType: 'jsonp',
            data: {goods_ids:goodsIds},
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
                        history.go(-1);
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
    
    ,bindMainEvent: function() {
        var me = this;
        
        $('#js-changecont').delegate('div', 'click', function() {
                var order_type = $(this).attr('data-type');
                Util.setHash(order_type);
                me.loadOrder();
        });
    }
    ,renderList: function(data) {
        if (data.errno == ErrorCode.NO_LOGIN) {
             Util.goLogin("myorder-allorders.html");
             return;
        }
        if (data.errno != 0) {
            messageBox.toast(data.errmsg);
        }
        if (data.data.list.length == 0) {
            //列表为空
            var html = $('#order_tips').html().replace('{$tips}', "空空如也");
            $('#js-contbox01').html(html);
            return;
        }
        var html = "";
        var templte = $('#order_list_item').html();
        var normalBntTemplate = $('#order_list_button').html();
        var mainBntTemplate = $('#order_list_button_main').html();
        var tips  = "";
        for (i in data.data.list) {
            var Buttons = "";
            var goods = data.data.list[i];
            goods.goods_cost = parseInt(goods.goods_price) * goods.goods_number;
            goods.goods_count = goods.goods_number;
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
            goods.buttons = Buttons;
            goods.order_tips = tips;
            var list_item = Template.renderByTempate(templte, goods);
            html += list_item;
            
        }
        $('#js-contbox01').html(html);
    }
    ,showLoading: function() {
        var html = $('#order_tips').html().replace('{$tips}', "加载中 ...");
        $('#js-contbox01').html(html);
    }
    ,closeLoading: function() {
        
    }
    ,loadOrder: function() {
        var hash = Util.getHash();
        if ( !this.order_types[hash]) {
            hash = 'all';
        }
        if (hash) {
            $('#js-changecont div').removeClass('on');
            $('#js-changecont div[data-type= ' +hash + ']' ).addClass('on');
        }
        this.showLoading();
        Util.requestApi('?r=order/get',{type:hash},this.renderList);
    }
    //订单管理页面
    ,runMain: function() {
        this.bindMainEvent();
        this.loadOrder();
        
    }
};

//地址管理
var Address = {

    cfg : {}
    
    //获取选择的地址
    ,getSelectedAddressId() {
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
        var reg = /^0?(13[0-9]|15[012356789]|17[0678]|18[0-9]|14[57])[0-9]{8}$/;
        if (!reg.test(params['mobile'])) {
            //手机号码验证
            messageBox.toast("手机号码格式错误");
            notice['mobile'].focus();
            return false;
        }
        var areas = params['province_city_district'].split(" ");
        delete params['province_city_district'];
        params['str_province'] = areas[0];
        params['str_city'] = areas[1];
        params['str_district'] = areas[2];
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
                Util.requestApi('?r=address/remove', {id:addressId}, me.handleDetailCallback);
            }
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
    ,init: function(data, direct) {
        if (data.is_login != 1) {
            Util.goLogin(direct);
        } else {
            $(".u-person-head, .u-person-cont, .u-person-order, .u-img-a-list").show();
            $("#loading").hide();
            $(".u-person-head .name").append(data.user.name);
            $(".u-person-head .photo").attr('src', data.user.avatar);
        }
    }
    ,initKing: function(data, proxy) {
        if (!proxy) {
            proxy = this;
        }
        proxy.init(data, config.page.user_king);
    }
};



//收藏相关
var Collection = {
    
    run: function() {
        Util.requestApi('?r=collect/get', {}, this.renderList);
        this.bindEvent();
    }
    ,bindEvent: function(){
        
        $('.productlistbox').delegate(".u-collection-productlist ", 'click', function(){
            
            var goods_id = $(this).attr('data-id');
            if (goods_id) {
                Util.goGoodsDetail(goods_id);
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
            if (item.goods_status != Const.GOODS_STATUS_ON_SELL) {
                sold = 'sold';
                icon = '<img src="img/hwicon_07.png" class="icon">';
                tips = "已结缘";
            }
            html += tempate.replace('{$goods_id}', item.goods_id)
                                    .replace('{$goods_img}',item.goods_img)
                                    .replace('{$icon}', icon)
                                    .replace('{$sold}', sold)
                                    .replace('{$tips}', tips)
                                    .replace('{$goods_name}',item.goods_name)
                                    .replace('{$goods_price}',item.goods_price)
                                    .replace('{$likes_count}',item.likes_count)
                                    .replace('{$fav_count}',item.fav_count);
        }
        $('.productlistbox').html(html);
    }
};