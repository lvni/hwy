/*
 * hlSwiper幻灯片
 * 
 * 作者：黄磊
 * 
 * 邮箱：xfhxbb@yeah.net
 * 
 * Copyright 2015
 * 
 * 创建于：2015-11-11
 */
(function() {
    window.hlSwiper = function(selector, options) {
        var defaults = {
            loop: false,
            autoloop: false,
            speed: 3000
        };
        options = options || {};
        for (var def in defaults) {
            if (typeof options[def] === 'undefined') {
                options[def] = defaults[def];
            }
        }
        if (typeof selector === 'string') {
            selector = document.querySelector(selector);
        } else {
            selector = document;
        }
        selector.addEventListener("touchstart", slideStart);
        selector.addEventListener("touchend", slideEnd);
        selector.addEventListener("touchmove", slideMove);
        var timer = null;
        var loopwidth = 0;
        var sliding = startClientX = startPixelOffset = pixelOffset = currentSlide = 0,
            allpage = selector.querySelectorAll(".slide-list");
        slideCount = allpage.length;
        var minIndex = 0;
        var maxIndex = slideCount - 1;
        var width = parseInt(window.getComputedStyle(allpage[0], null).getPropertyValue("width"));
        if (options.loop) {
            minIndex = -1;
            maxIndex = slideCount;
            pixelOffset = -width;
            loopwidth = width;
        }
        var slides = selector.querySelector(".slides");
        var posNav = selector.querySelector(".position-nav");
        for (var i = 0, l = slideCount; i < l; i++) {
            var span = document.createElement("span");
            span.className = "position";
            posNav.appendChild(span);
        }
        if (options.loop) {
            var firstslide = allpage[0].cloneNode(true);
            slides.appendChild(firstslide);
            var lastslide = allpage[slideCount - 1].cloneNode(true);
            slides.insertBefore(lastslide, allpage[0]);
            slides.style["-webkit-transform"] = 'translate3d(' + pixelOffset + 'px,0,0)';
        }
        updatePosition();

        function slideStart(event) {
            clearInterval(timer);
            if (event.targetTouches)
                event = event.targetTouches[0];
            if (sliding == 0) {
                sliding = 1;
                startClientX = event.pageX;
            }
        }

        function slideMove(event) {
            event.preventDefault();
            if (event.targetTouches)
                event = event.targetTouches[0];
            var deltaSlide = event.clientX - startClientX;
            if (sliding == 1 && deltaSlide != 0) {
                sliding = 2;
                startPixelOffset = pixelOffset;
            }
            if (sliding == 2) {
                var touchPixelRatio = 1;
                if ((currentSlide == 0 && event.clientX > startClientX) || (currentSlide == slideCount - 1 && event.clientX < startClientX)) {
                    touchPixelRatio = 3;
                }
                if (options.loop) {
                    if (currentSlide == 0) {
                        startPixelOffset = -width;
                    }
                    if (currentSlide == slideCount - 1) {
                        startPixelOffset = -currentSlide * width - loopwidth;
                    }
                }
                pixelOffset = startPixelOffset + deltaSlide / touchPixelRatio;
                //跟随手指滑动
                //slides.style["-webkit-transform"] = 'translate3d(' + pixelOffset + 'px,0,0)';
                //slides.classList.remove("animate");
            }
        }

        function slideEnd(event) {
            if (sliding == 2) {
            	//不跟随手指滑动
                slides.style["-webkit-transform"] = 'translate3d(' + startPixelOffset + 'px,0,0)';
                slides.classList.remove("animate");

                sliding = 0;
                currentSlide = pixelOffset < startPixelOffset ? currentSlide + 1 : currentSlide - 1;
                currentSlide = Math.min(Math.max(currentSlide, minIndex), maxIndex);
                pixelOffset = -currentSlide * width - loopwidth;
                setTimeout(function() {
                slides.classList.add("animate");
                slides.style["-webkit-transform"] = 'translate3d(' + pixelOffset + 'px,0,0)';
                updatePosition();
                }, 100);
            }
            if (options.loop) {
                if (options.autoloop) {
                    timer = setInterval(function() {
                        autoMove();
                    }, options.speed);
                }
            }
        }

        function updatePosition() {
            var allPos = selector.querySelectorAll(".position");
            for (var i = 0, l = allPos.length; i < l; i++) {
                allPos[i].classList.remove('current');
            }
            var newSlide = document.querySelectorAll(".slide-list");
            for (var i = 0, l = newSlide.length; i < l; i++) {
                newSlide[i].classList.remove('active');
            }
            //假如是循环
            if (options.loop) {
                newSlide[currentSlide + 1].classList.add("active");
                if (currentSlide == maxIndex) {
                    currentSlide = 0;
                }
                if (currentSlide == minIndex) {
                    currentSlide = slideCount - 1;
                }
            } else {
                newSlide[currentSlide].classList.add("active");
            }
            allPos[currentSlide].classList.add("current");
        }
        if (options.loop) {
            if (options.autoloop) {
                timer = setInterval(function() {
                    autoMove();
                }, options.speed);
            }
        }
        //自动滚动
        function autoMove() {
            if (currentSlide == 0) {
                pixelOffset = -width;
            }
            if (currentSlide == slideCount - 1) {
                pixelOffset = -currentSlide * width - loopwidth;
            }
            slides.classList.remove("animate");
            slides.style["-webkit-transform"] = 'translate3d(' + pixelOffset + 'px,0,0)';
            currentSlide++;
            currentSlide = Math.min(Math.max(currentSlide, minIndex), maxIndex);
            pixelOffset = -currentSlide * width - loopwidth;
            setTimeout(function() {
                slides.classList.add("animate");
                slides.style["-webkit-transform"] = 'translate3d(' + pixelOffset + 'px,0,0)';
                updatePosition();
            }, 100);
        }
    }
})();
/*var swiper = new hlSwiper("#hl-swiper", {
    loop: true,
    autoloop: false,
    speed: 3000
});*/
