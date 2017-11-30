(function($) {
    $.fn.touchwipe = function(settings) {
        var config = {
            min_move_x: 20,
            min_move_y: 20,
            wipeLeft: function() {},
            wipeRight: function() {},
            wipeUp: function() {},
            wipeDown: function() {},
            preventDefaultEvents: true
        };
        if (settings) $.extend(config, settings);
        this.each(function() {
            var startX;
            var startY;
            var isMoving = false;

            function cancelTouch() {
                this.removeEventListener('touchmove', onTouchMove);
                startX = null;
                isMoving = false
            }

            function onTouchMove(e) {
                if (config.preventDefaultEvents) {
                    e.preventDefault()
                }
                if (isMoving) {
                    var x = e.touches[0].pageX;
                    var y = e.touches[0].pageY;
                    var dx = startX - x;
                    var dy = startY - y;
                    if (Math.abs(dx) >= config.min_move_x) {
                        cancelTouch();
                        if (dx > 0) {
                            config.wipeLeft(e)
                        } else {
                            config.wipeRight(e)
                        }
                    } else if (Math.abs(dy) >= config.min_move_y) {
                        cancelTouch();
                        if (dy > 0) {
                            config.wipeDown(e)
                        } else {
                            config.wipeUp(e)
                        }
                    }
                }
            }

            function onTouchStart(e) {
                if (e.touches.length == 1) {
                    startX = e.touches[0].pageX;
                    startY = e.touches[0].pageY;
                    isMoving = true;
                    this.addEventListener('touchmove', onTouchMove, false)
                }
            }
            if ('ontouchstart' in document) {
                this.addEventListener('touchstart', onTouchStart, false)
            }
        });
        return this;
    }
})(jQuery);

var music = document.getElementById("music");

//加载图片列表
var pics = [
    "./images/page1.jpg",
    "./images/page2.jpg",
    "./images/page3.jpg",
    "./images/page4.jpg",
    "./images/page5.jpg",
    "./images/page6.jpg",
    "./images/page7.jpg",
    "./images/page8.jpg",
    "./images/page9.jpg",
    "./images/page10.jpg",
    "./images/page11.jpg",
    "./images/page12.jpg",
];

function _loadImages(pics, callback, len) {
    len = len || pics.length;
    if (pics.length) {
        var IMG = new Image(),
            picelem = pics.shift();

        if (window._pandaImageLoadArray) {
            window._pandaImageLoadArray = window._pandaImageLoadArray
        } else {
            window._pandaImageLoadArray = [];
        }
        window._pandaImageLoadArray.push(picelem);
        IMG.src = picelem;
        // 从数组中取出对象的一刻，就开始变化滚动条
        _drawLoadProgress(window._pandaImageLoadArray.length / (len * len));
        // 缓存处理
        if (IMG.complete) {
            window._pandaImageLoadArray.shift();
            return _loadImages(pics, callback, len);
        } else {
            // 加载处理
            IMG.onload = function() {
                    window._pandaImageLoadArray.shift();
                    IMG.onload = null; // 解决内存泄漏和GIF图多次触发onload的问题
                }
                // 容错处理 todo 应该如何处理呢?
                // 目前是忽略这个错误，不影响正常使用
            IMG.onerror = function() {
                window._pandaImageLoadArray.shift();
                IMG.onerror = null;
            }
            return _loadImages(pics, callback, len);
        }
        return;
    }
    if (callback) _loadProgress(callback, window._pandaImageLoadArray.length, len);
}

// 监听实际的加载情况
function _loadProgress(callback, begin, all) {
    var loadinterval = setInterval(function() {
        if (window._pandaImageLoadArray.length != 0 && window._pandaImageLoadArray.length != begin) {
            _drawLoadProgress((begin - window._pandaImageLoadArray.length) / all);
        } else if (window._pandaImageLoadArray.length == 0) {
            _drawLoadProgress(1)
            setTimeout(function() {
                callback.call(window);
            }, 500);
            clearInterval(loadinterval);
        }
    }, 300);
}

//加载百分比
function _drawLoadProgress(w) {
    var num = Math.floor(w * 100) >= 100 ? 100 : Math.floor(w * 100);
    $(".ld_num").html(num + '%');
}

//加载完成回调
_loadImages(pics, function() {

    $(".ld_page").hide();
    $(".scroll-list").show();
    $(".btn_down").show();
    
});

/** 滚动页面 **/

function scrollPage() {

    var myScroll;

    myScroll = new IScroll("#wrapper", {
        mouseWheel: true,
        momentum: false,
        vScroll: false,
        snap: true,
        snapSpeed: 600,
        click: true,
        fadeScrollbars: false,
        hScrollbar: false,
        vScrollbar: false,
    });

    document.addEventListener('touchmove', function(e) {
        e.preventDefault();
    }, isPassive() ? {
        capture: false,
        passive: false
    } : false);
}

/*=============================================================================*/
// 新增上下滚动
/*=============================================================================*/
// 是否滚动
var scrollIng = true;

var cache = {
    winH: $(window).height(),
    container: $(".scroll-list"),
    mod: $('.scroll-list .page'),
    len: $('.scroll-list .page').length,
    ind: 0
}

function pageShow(ind) {
    var scrollTop = -(ind * cache.winH) + 'px';
    cache.container.css({
        "-webkit-transform": "translateY(" + scrollTop + ")"
    })
    cache.mod.removeClass("play").eq(ind).addClass("play");
    if (cache.ind == 0) {
        $(".btn_up").hide();
        $(".btn_down").show();
    } else if (cache.ind == 41) {
        $(".btn_up").show();
        $(".btn_down").hide();
    } else if (cache.ind == 1 || cache.ind == 40) {
        $(".btn_down").show();
        $(".btn_up").show();
    } else {
        $(".btn_up").hide();
        $(".btn_down").hide();
    } 
}

$("html").touchwipe({
    wipeUp: function() {
        if (cache.ind > 0) {
            console.log("向上滑动scrollIng：" + scrollIng);

            if (scrollIng) {
                cache.ind--;
                pageShow(cache.ind);

                var n = $(".scroll-list .slide").index($(".slide .play"));
                console.log(n, cache.ind);
            } else {
                console.log("不滚动");
            }
        }
    },
    wipeDown: function() {
        if (cache.ind <= cache.len - 2) {
            console.log("向下滑动scrollIng：" + scrollIng);

            if (scrollIng) {
                cache.ind++;
                pageShow(cache.ind);

                var n = $(".scroll-list .slide").index($(".slide .play"));
                console.log(n, cache.ind);
            } else {
                console.log("不滚动");
            }
        }
    },
    min_move_x: 80,
    min_move_y: 80
});

/*=============================================================================*/

//向上滑动
function wipeUp() {

}

//向下滑动
function wipeDown() {

}

/**
 * [wxShare 微信分享]
 * @param  {[text]} shareTitle [分享标题]
 * @param  {[text]} shareDesc  [分享描述]
 * @param  {[link]} link       [分享链接]
 */


// wxShare('text','desc');
function wxShare(shareTitle, shareDesc, link) {
    if (!link) { var link = location.href; }
    var uri = window.location.href.split("#")[0];
    $.post("http://public.oyoozo.com/wxapi.php", {
        uri: uri
    }, function(data) {
        data = eval("(" + data + ")");
        var apilist = [
            'onMenuShareTimeline',
            'onMenuShareAppMessage'
        ];
        wx.config({
            debug: false,
            appId: data.appid,
            timestamp: data.timestamp,
            nonceStr: data.noncestr,
            signature: data.signature,
            jsApiList: apilist
        });

        wx.ready(function() {
            // 分享给朋友事件绑定
            wx.onMenuShareAppMessage({
                title: shareTitle,
                desc: shareDesc,
                link: link,
                imgUrl: 'http://7xren0.com2.z0.glb.qiniucdn.com/girlweixin.jpg',
                success: function() {

                }
            });

            // 分享到朋友圈
            wx.onMenuShareTimeline({
                title: shareTitle,
                link: link,
                imgUrl: 'http://7xren0.com2.z0.glb.qiniucdn.com/girlweixin.jpg',
                success: function() {

                }
            });
        })
    });
}