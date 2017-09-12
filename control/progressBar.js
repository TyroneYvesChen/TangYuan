(function($){
    function ProgressBar(element, options) {
        this.tag = false;
        this.oy = 0;
        this.top = 165;
        this.bgTop = 0;
        this.options = options;
        this.init(element);
    }

    var _progressBar = ProgressBar.prototype;

    _progressBar.init = function (element) {
        var dom = this.createDom();
        $(dom).find(".BMap_stdMpSliderBar").css("top", this.top);
        this.mouseDownEvent(dom);
        this.mouseUpEvent();
        this.mouseMoveEvent(dom);
        this.clickEvent(dom);
        this.params = {
            ele: element
        };
        $(element).append(dom)
        this.barHeight = $(dom).find(".BMap_stdMpSliderMask").height() - 20;
    }

    _progressBar.createDom = function () {
        var dom = $('<div class="BMap_stdMpCtrl">'
                    +'<div class="BMap_stdMpZoom">'
                    +'<div class="BMap_button BMap_stdMpZoomIn" title="放大一级"></div>'
                    +'<div class="BMap_button BMap_stdMpZoomOut" title="缩小一级"></div>'
                    +'<div class="BMap_stdMpSlider">'
                    +'<div class="BMap_stdMpSliderBgTop"></div>'
                    +'<div class="BMap_stdMpSliderBgBot"></div>'
                    +'<div class="BMap_stdMpSliderMask" title="放置到此级别"></div>'
                    +'<div class="BMap_stdMpSliderBar" title="拖动缩放" style="cursor: grab;"></div>'
                    +'</div>'
                    +'</div>'
                    +'</div>');
        this.ele = dom;
        return dom
    }

    _progressBar.mouseDownEvent = function (dom) {
        var _this = this
        $(dom).find(".BMap_stdMpSliderBar").mousedown(function(e) {
            _this.oy = e.pageY - _this.top;
            _this.tag = true;
            e.preventDefault();
        });
    };

    _progressBar.mouseUpEvent = function () {
        var _this = this;
        $(document).mouseup(function(e) {
            _this.tag = false;
            document.onmousemove = null; //弹起鼠标不做任何操作
            e.preventDefault();
        });
    };

    _progressBar.mouseMoveEvent = function (dom) {
        var _this = this;
        $(dom).mousemove(function(e) {//鼠标移动
            var barHeight = _this.barHeight;
            if (_this.tag) {
                _this.bgTop = $(dom).find('.BMap_stdMpSliderMask').offset().top;
                _this.top = e.pageY - _this.bgTop * 1.5;
                if (_this.top < 0) {
                    _this.top = 0;
                    return
                }else if (_this.top > barHeight) {
                    _this.top = barHeight;
                }
                var bgBotTop = 160-_this.top;

                $(dom).find('.BMap_stdMpSliderBar').css('top', _this.top + 5);
                $(dom).find('.BMap_stdMpSliderBgBot').height(bgBotTop);
                var percent = parseInt((bgBotTop/barHeight)*100);
                _this.params.percent = percent;
                _this.options.callBack && typeof _this.options.callBack == "function" && _this.options.callBack(_this.params);
            }
            e.preventDefault();
            e.stopPropagation();
            //防止选择内容--当拖动鼠标过快时候，弹起鼠标，bar也会移动，修复bug
            window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
        });
    };

    _progressBar.clickEvent = function (dom) {
        var _this = this;

        //鼠标点击改变进度条
        $(dom).find('.BMap_stdMpSliderMask').click(function(e) {
            var options = {
                event: e,
                ele: dom,
                _this: _this,
                isMove: false
            };
            barControl(options)
        });

        //加号
        $(dom).find('.BMap_stdMpZoomIn').on("click", function () {

        })

        //减号
        $(dom).find('.BMap_stdMpZoomOut').on("click", function () {

        })
    };

    function barControl(options) {
        var e = options.event,
            dom = options.ele,
            _this = options._this,
            isMove = options.isMove;
        if (!_this.tag) {
            createDistance(e, dom, _this);
            barMove(dom, _this, isMove);
        }
        e.preventDefault();
        e.stopPropagation();
    }

    function createDistance(e, dom, _this) {
        var barHeight = _this.barHeight;
        _this.bgTop = $(dom).find('.BMap_stdMpSliderMask').offset().top;
        _this.top = e.pageY - _this.bgTop * 1.5;
        if (_this.top <= 0) {
            _this.top = 0;
        }else if (_this.top > barHeight) {
            _this.top = barHeight;
        }
    }

    function barMove(dom, _this, isMove) {
        var bgBotTop = 160-_this.top,
            barHeight = _this.barHeight;
        $(dom).find('.BMap_stdMpSliderBar').css('top', _this.top + 5);
        if (isMove){
            $(dom).find('.BMap_stdMpSliderBgBot').height(bgBotTop);
        }else {
            $(dom).find('.BMap_stdMpSliderBgBot').animate({height:bgBotTop},300);
        }

        var percent = parseInt((bgBotTop/barHeight)*10000)/100;
        _this.params.percent = percent;
        _this.options.callBack && typeof _this.options.callBack == "function" && _this.options.callBack(_this.params);
    }

    $.fn.progressBar = function (options) {
        return this.each(function () {
            new ProgressBar(this, options);
        })
    };

})(jQuery);
