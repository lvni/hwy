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
    },
};
//错误码
var ErrorCode = {
    NO_LOGIN: 12, //没有登录
}

//消息盒子相关
var messageBox = {
    toast: function(msg) {
        alert(msg);
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
    ,goLogin: function(redirect) {
        var callback = redirect ? redirect : config.page.home; 
        window.location.href = config.page.login + "?" + callback;
        
    }
    //请求接口
    ,requestApi: function(api, data, callback) {
        var url = config.api + api;
        $.ajax({
            url: url,
            dataType: 'jsonp',
            data: data,
            success: callback
        });
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
                       data.data  && me.rendNavi(data.data);
                   }
              }
              
          });
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
        $('.u-shoppingCartlist').html(html);
       
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
            $('.u-productlist').html(html);
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
        this.loadSearch(this.searchQuery);
    }
};

//订单相关处理
var Order = {

    bindConfirmEvent: function() {
        $('.u-mainbutton-little').click(function(){
            //确认按钮点击事件
            var addressId = $('.placeorder-address').attr('data-address');
            if (!addressId) {
                messageBox.toast("请选择收货地址");
                return ;
            }
        });
    }
    ,renderConfirmPage: function(data) {
        var tempate = $('#confirm_goods_template').html();
        var html = "";
        for(i in data.list) {
            var item = data.list[i];
            html += tempate.replace('{$goods_name}', item.goods_name)
                           .replace('{$goods_img}', item.goods_img)
                           .replace('{$goods_price}', item.goods_price)
                           .replace('{$goods_num}', item.goods_num)
                           .replace('{$goods_sn}', item.goods_sn);
        }
        $(html).insertAfter('.placeorder-address');
        $('#order_confirm_num').html(data.goods_count);
        $('#confirm_price_bottom, #confirm_price').html("￥ " + data.goods_cost);
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
                   data.data && me.renderConfirmPage(data.data);
               } else {
                    messageBox.toast(data.errmsg);
                    if (data.errno == ErrorCode.NO_LOGIN) {
                        //跳转登录
                        Util.goLogin();
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
};

//地址管理
var Address = {


    //渲染地址列表
    renderAddressList: function(data) {
        if (data.errno == 0) {
            var tempate = $('#tempate-address-list').html();
            var html = "";
            for (i in data.data) {
                var item = data.data[i];
                item.address = item.province + item.city + item.address;
                html += tempate.replace('{$consignee}', item.consignee)
                               .replace('{$mobile}', item.mobile)
                               .replace('{$address}', item.address);
            }
            $('.u-arrow-list').html(html);
            
        } else {
            messageBox.toast(data.errmsg);
        }
        
    }
    ,loadMyaddress: function() {
        var api = "?r=address/list";
        Util.requestApi(api, {}, this.renderAddressList);
    }
    //管理主页
    ,runMain: function() {
        this.loadMyaddress();
    }
    ,runSelect: function() {
        this.loadMyaddress();
    }

};