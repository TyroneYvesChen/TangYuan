/**
 * @常用正则
 * @author Tyrone Yves Chen
 * @version 1.0
 * @description 项目中常用的正则或一些与正则有关的代码及方法，持续更新
 * @disclaimer 我只是代码的搬运工，借鉴于网上各位大佬的代码修改后在项目中使用，如有雷同，纯属巧合
 * @PS：汤圆萌萌哒~
 */



        /*英文字数统计*/
        function countKeywords(text,id){
            var t_keywords = text.replace(/[^a-zA-Z0-9]+/g,'#@#@#@#@#@');
            var arr = t_keywords.split('#@#@#@#@#@');
            var count=0;
            for(var i=0;i<arr.length;i++){
                if(arr[i]!=""){
                    count++;
                }
            }
            $("#"+id).text(count);
        }


        /*正则去掉字符串中的[""]*/
        function answerRegExp(str) {
            var str = str;
            str = str.replace(/[\([\"\])]/g,"");
            return str;
        }