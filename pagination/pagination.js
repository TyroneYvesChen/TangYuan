/**
 * @pagination
 * @author Tyrone Yves Chen
 * @version 1.0
 * @description 分页
 * @disclaimer 我只是代码的搬运工，借鉴于网上各位大佬的代码修改后在项目中使用，如有雷同，纯属巧合
 * @PS：汤圆萌萌哒~
 * 这个分页写的比较丑- -...但是功能还是能用的！以后有时间会重新整一下，要是有什么建议也阔以直接留言
 *
 * Param ：为{}格式     需要传给后台的参数
 * $(dom).pagination(param,callback);
 * Pagination.PARAM = { url: "xxx"}     接口路径
 * Pagination.className = {}     可修改对应元素class
 */

;(function ($) {
        Pagination = function (element, options, callback) {
            this.options  = $.extend({}, Pagination.DEFAULTS, options);
            this.domCacheElement = element;
            this.callback = callback;
            this.init(element, callback);
        };
        Pagination.DEFAULTS = {
            pageNum: 1,
            pageSize: 20
        };
        var className = Pagination.className;
        className = {
            PaginationWrap: "pagelist",
            PreviousPage: "pagePre",
            NextPage: "pagePro",
            CurrentPage: "current",
            PageDisplay: "pageShow",
            PageInput: "skip",
            PageSkip: "skipBtn"
        };
        var _pagination = Pagination.prototype;

        _pagination.createPaginationWrap = function (className) {
            return $('<div class="'+ className +'"></div>');
        };
        _pagination.createPreviousPage = function (className) {
            var dto = {
                    pageNum: parseInt(this.options.pageNum) - 1
                },
                dom = $('<a class="'+ className +' data-toggle" data-toggle="last" href="javascript:void(0)">上一页</a>');
            this.domClickEvent(dom, dto);
            return dom;
        };
        _pagination.createNextPage = function (className) {
            var dto = {
                    pageNum: parseInt(this.options.pageNum) + 1
                },
                dom = $('<a class="'+ className +' data-toggle" data-toggle="next" href="javascript:void(0)">下一页</a>');
            this.domClickEvent(dom, dto);
            return dom;
        };
        _pagination.createCurrentPage = function (className, pageNum) {
            return $('<span class="'+ className +'">' + pageNum + '</span>');
        };
        _pagination.createPageDisplay = function (className, allPages) {
            return $('<span class="'+ className +'">' + allPages + '</span>');
        };
        _pagination.createPageInput = function (className) {
            return $('<input type="text" class="'+ className +'">');
        };
        _pagination.createPageSkip = function (className) {
            return $('<span class="'+ className +'">跳转</span>');
        };
        _pagination.createPageDom = function (data) {
            // console.log(data);
            var that = this;
            var PaginationWrap = this.createPaginationWrap(className.PaginationWrap),
                PreviousPage = this.createPreviousPage(className.PreviousPage),
                NextPage = this.createNextPage(className.NextPage),
                CurrentPage = this.createCurrentPage(className.CurrentPage, data.pageNum),
                allPages = data.pageNum + "/" + data.pages,
                PageDisplay = this.createPageDisplay(className.PageDisplay, allPages),
                PageInput = this.createPageInput(className.PageInput),
                PageSkip = this.createPageSkip(className.PageSkip);
            PageSkip.on("click",function () {
                var dto = {
                    pageNum: parseInt(PageInput.val())
                };
                that.callInherit(dto);
            });
            PaginationWrap = this.add(PaginationWrap, PreviousPage, CurrentPage, NextPage, PageDisplay, PageInput, PageSkip);
            return PaginationWrap;
        };
        _pagination.add = function (domWrap) {
            var domWrap = domWrap,
                len = arguments.length;
            for (var i=0;i<len;i++){
                domWrap.append(arguments[i]);
            }
            // console.log(arguments);
            return domWrap;
        };
        _pagination.domClickEvent = function (dom, dto) {
            var that = this;
            dom.on("click",function () {
                that.callInherit(dto);
            });
        };
        _pagination.callInherit = function (options) {
            // console.log(this.options)
            if (options.pageNum < 1 || options.pageNum > this.options.pages || !options.pageNum) return;
            this.options  = $.extend({}, this.options, options);
            // console.log(this.options)
            this.init(this.domCacheElement, this.callback)
        };
        _pagination.init = function (element, callback) {
            var that = this;
            var ajax = new AjaxComponent(Pagination.PARAM.url, this.options);
            ajax.success = function (data) {
                console.log(data);
                if(data.code != 100) return;
                var _data = data.data,
                    create = that.createPageDom(_data);
                that.options.pages = _data.pages;
                $(element).empty().append(create);
                callback && typeof callback == "function" ? callback(_data) : "";
            };
            ajax.run();
        };
        $.fn.pagination = function (options, callback) {
            return this.each(function () {
                new Pagination(this, options, callback);
            })
        };
})(window.jQuery);