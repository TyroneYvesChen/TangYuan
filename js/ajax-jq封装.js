/**
 * @AjaxComponent
 * @author Tyrone Yves Chen
 * @version 1.0
 * @description AJAX封装（基于JQ）
 * @disclaimer 我只是代码的搬运工，借鉴与网上各位大佬的代码修改后在项目中使用，如有雷同，纯属巧合
 * @PS：汤圆萌萌哒~
 * var ajax = new AjaxComponent(url,data);
 * ajax.success = function (data){}
 * ajax.run();
 */
;(function () {
    /*JQ  AJAX*/
    function AjaxComponent(url,data) {
        this.type = 'post';
        this.async = true;
        if(data) this.data = data;
        this.url = AJAX_URL + url;
        this.error = function(e) {
            console.log(e);
        };
        this.run = function () {
            //console.log(this);
            $.ajax(this);
        }
    }

})();