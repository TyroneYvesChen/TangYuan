/**
 * @formDownload
 * @author Tyrone Yves Chen
 * @version 1.0
 * @description form表单文件下载
 * @disclaimer 我只是代码的搬运工，借鉴与网上各位大佬的代码修改后在项目中使用，如有雷同，纯属巧合
 * @PS：汤圆萌萌哒~
 * url   请求接口路径
 * method    post||get
 * options   {key: value}
 * */
(function ($) {
    // form表单文件下载
    $.formDownload = function(url, method, options){
        var domForm =$('<form action="'+url+'" method="'+(method||'post')+'" hidden="hidden"></form>');
        var domInput = $('<input type="text"/>');
        for (var key in options){
            var tmpInput = domInput.clone();
            tmpInput.attr("name", key);
            tmpInput.attr("value", options[key]);
            domForm.append(tmpInput);
        }
        domForm.appendTo('body').submit().remove();
    };
})(window.jQuery);