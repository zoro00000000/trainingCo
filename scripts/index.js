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
    "./images/landscape_hint@2x.png",
    "./images/landscape_phone@2x.png",
    "./images/music_icon.png",
    "./images/dsz_autograph.jpg",
    "./images/dsz.jpg",
    "./images/fh_logo2.png",
    "./images/fu_logo.jpg",
    "./images/p1_bg.jpg",
    "./images/p2_num.png",
    "./images/p2_star.png",
    "./images/p4_img.jpg",
    "./images/p5_img.jpg",
    "./images/p5_star.jpg",
    "./images/p6_bg.jpg",
    "./images/p6_star.jpg",
    "./images/p7_bg.jpg",
    "./images/p8_bg.jpg",
    "./images/p10_bg.jpg",
    "./images/p12_bg.jpg",
    "./images/p13_bg.jpg",
    "./images/p17_bg.jpg",
    "./images/p18_bg.jpg",
    "./images/p25_img1.jpg",
    "./images/p25_img2.jpg",
    "./images/p25_img3.jpg",
    "./images/p25_img4.jpg",
    "./images/p27_img1.jpg",
    "./images/p27_img2.jpg",
    "./images/p27_img2.png",
    "./images/p27_img3.jpg",
    "./images/p28_bg.jpg",
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
    // music.play();
    // $(".music_icon").show();

    // 调用滚动方法
    // scrollPage();

    $(".ld_page").hide();
    $(".scroll-list").show();
});

/** 滚动页面 **/

function scrollPage() {

    var myScroll;
    // myScroll = new IScroll('#wrapper', {
    //     scrollX: true,
    //     scrollY: true,
    //     momentum: false,
    //     snap: true
    // });

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

    // $(".btn_right").on('click', function() {
    //     myScroll.next();
    // })
    // $(".btn_left").on('click', function() {
    //     myScroll.prev();
    // })
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
}

$("html").touchwipe({
    wipeUp: function() {
        if (cache.ind > 0) {
            console.log("向上滑动scrollIng：" + scrollIng);

            if (scrollIng) {
                cache.ind--;
                pageShow(cache.ind);
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
            } else {
                console.log("不滚动");
            }
        }
    },
    min_move_x: 80,
    min_move_y: 80
});

/*=============================================================================*/

//音频
// $(".music_icon").on("click", function() {
//     if ($(this).hasClass("mute")) {
//         music.play();
//         $(this).removeClass("mute");

//     } else {
//         music.pause();
//         $(this).addClass("mute");
//     }
// });

// $("html").touchwipe({
//     wipeUp: function() {
//         wipeUp();
//     },
//     wipeDown: function() {
//         wipeDown();
//     },
//     min_move_x: 80,
//     min_move_y: 80
// });


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