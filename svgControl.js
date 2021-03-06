/**
 * Created by wisdom on 2017/9/4.
 */
!(function ($) {
    function SvgControl() {

    }
    var svgControl = new SvgControl();
    $.extend({
        svgControl : svgControl
    });

    var _svgControl = SvgControl.prototype;

    // SVG缩放平移////////////////////////////////////////////
    // 操作SVG缩放,in->-0.1,out->0.1;in-fasle,out-true
    _svgControl.operationSvgScale = function (svg){
        var svgDom = $(svg).
        scale = svgDom.data("zoom");
        if (scale <= 0.1) return;
        var newScale = svgScale(svgDom, scale, step);
        svgDom.data("zoom", scale);
    }

    // svg平移
    _svgControl.svgPan = function (svgContainer, isMulti){
        svgContainer.mousedown(function(event) {
            if (isMulti) {
                $(this).parents(".widget-container-span").sortable('disable');
            }
            $(this).css("cursor",
                "url(" + window.basePath + "/data/openhand.png), default");

            var svg = $(this).find("svg");
            var startX, startY, movingX, movingY, endX, endY;
            startX = event.pageX;
            startY = event.pageY;

            var scale = svg.data("zoom");
            var translate = svg.find("g#MapElement").attr("transform");
            var panScale = svg.attr("displayscale");

            $(this).bind("mousemove", function(evt) {
                movingX = evt.pageX;
                movingY = evt.pageY;
                endX = (movingX - startX) * panScale;
                endY = (movingY - startY) * panScale;

                endX = parseInt(moveX);
                endY = parseInt(moveY);

                var newtranslate = panAndScale(endX, endY, scale, translate);
                svg.find("#Backgroundcolor").attr("transform", newtranslate);
                svg.find("g#MapElement").attr("transform", newtranslate);

            });
        });
        svgContainer.mouseup(function(event) {
            $(this).css("cursor", "default");
            $(this).unbind("mousemove");
            if (isMulti) {
                $(this).parents(".widget-container-span").sortable('enable');
            }
        });
        svgContainer.mouseout(function() {
            $(this).css("cursor", "default");
            $(this).unbind("mousemove");
            if (isMulti) {
                $(this).parents(".widget-container-span").sortable('enable');
            }
        });
    }



    // SVG缩放平移////////////////////////////////////////////
    // 操作SVG缩放,in->-0.1,out->0.1;in-fasle,out-true
    // function operationSvgZoom(e, status) {
    //     var svg = e.parents(".widget-body").find("svg");
    //     var zoom = e.parent().data("zoom");
    //     var step = status ? 0.1 : (-0.1);
    //     if (zoom <= 0.1 && status)
    //     // if ((zoom >= 10 && !status) || (zoom <= 0.1 && status))
    //         return;
    //     var scale = svgZoom(svg, zoom, step);
    // console.log(e);
    // e.parent().data("zoom", scale);
    // }
    // SVG缩放具体方法
    function svgScale(svgDom, oldScale) {
        var step = 0.1;
        // 控制
        var scale = parseInt((oldScale + 0.0001) * 1000000) / 1000000.0;
        var translate = svgDom.find("g#MapElement").attr("transform");

        // viewBox会改变大小width,height大小
        var width = svgDom.attr("width"); 
        var height = svgDom.attr("height");

        var svgid = svgDom.attr("id");

        var vwidth = SVG(svgid).viewbox().width * step / 2;
        var vheight = SVG(svgid).viewbox().height * step / 2;


        var newtranslate = panAndScale(parseInt(vwidth), parseInt(vheight),
            scale, translate);
        svgDom.find("#Backgroundcolor").attr("transform", newtranslate);
        svgDom.find("g#MapElement").attr("transform", newtranslate);

        svgDom.attr("width", width);
        svgDom.attr("height", height);
        return scale;
    }
    // svg恢复初始状态
    function resetSVGScale(svg, mapzoom) {
        // var zoom = mapzoom.data("zoom");
        var newtranslate = panAndScale(0, 0, 1, undefined);
        svg.find("#Backgroundcolor").attr("transform", newtranslate);
        svg.find("g#MapElement").attr("transform", newtranslate);
        mapzoom.data("zoom", 1);
    }

    function panAndScale(x, y, scale, translate) {
        if (translate == undefined)
            return "translate(" + x + "," + y + ") scale(" + scale + ")";
        // var old = translate.replace("translate(", "").replace(")",
        // "").replace("scale(", ",").replace(")", "").split(",");

        var old = translate.match(/[-]?\d+(\.\d+)?/g);

        // console.log("OLDMOVE=="+parseInt(old[0])+"---"+parseInt(old[1]));
        var newx = parseInt(x) + parseInt(old[0]);
        var newy = parseInt(y) + parseInt(old[1])
        return "translate(" + newx + "," + newy + ") scale(" + scale + ")";
    }


})(jQuery)
