/*判断可视区域（用于css3动画）*/
;(function () {
    /*options = {
     inFn: function (element) {
     //移入可视区域callback
     },
     outFn: function (element) {
     //移出可视区域callback
     }
     };*/
    ViewArea = function (element, options) {
        this.options  = $.extend({}, options);
        this.init(element);
    };
    ViewArea.prototype.ViewAreaResult = function (element) {
        var windowScrollTop = $(window).scrollTop(),    //滚轮距离顶部高度
            domTopDistance = $(element).offset().top,   //dom距离顶部高度
            domHeight = $(element).outerHeight(),    //dom自身高度
            windowHeight = $(window).height();      //window可视区域高度
        var scrollTop = windowScrollTop > (domTopDistance + domHeight),
            scrollBottom = windowScrollTop < (domTopDistance - windowHeight);
        var result = scrollTop || scrollBottom;
        return result;
    };
    ViewArea.prototype.callBackFn = function (element, result) {
        var options = this.options,
            inFn = options.inFn,
            outFn = options.outFn;
        if (!result && !!inFn) {
            inFn(element);
        }
        else if (!!outFn){
            outFn(element);
        }
    };
    ViewArea.prototype.init = function (element) {
        var result = this.ViewAreaResult(element);
        this.callBackFn(element, result);
    };
    $.fn.viewarea = function (options) {
        return this.each(function () {
            new ViewArea(this, options);
        })
    };
})(window.jQuery);