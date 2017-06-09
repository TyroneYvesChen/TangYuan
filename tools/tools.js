/**
 * @我的常用代码库
 * @author Tyrone Yves Chen
 * @version 1.0
 * @description 项目中常用的一些工具方法代码，持续更新
 * @disclaimer 我只是代码的搬运工，借鉴于网上各位大佬的代码修改后在项目中使用，如有雷同，纯属巧合
 * @PS：汤圆萌萌哒~
 */



        /*写入cookie    key value*/
        function setCookie(cname,cvalue){
            exdays = 1; //此 cookie 将被保存天数
            var d = new Date();
            d.setTime(d.getTime() + (exdays*24*60*60*1000));
            var expires = "expires=" + d.toUTCString();
            document.cookie = cname + "=" + cvalue + "; " + expires;
        }

        /*获取cookie*/
        function getCookie(cookieName){
            var name = cookieName + "=";
            var ca = document.cookie.split(";");
            for(var i=0;i<ca.length;i++){
                var c = ca[i];
                while(c.charAt(0)==' '){
                    c = c.substring(1);
                }
                if(c.indexOf(cookieName) == 0){
                    return c.substring(name.length,c.length);
                }
            }
            return "";
        }

        /*删除cookie*/
        function delCookie(name){
            var exp = new Date();
            exp.setTime(exp.getTime() - 1);
            var cval=getCookie(name);
            if(cval!=null)
                document.cookie= name + "="+cval+";expires="+exp.toGMTString();
        }

        /*清除所有的cookie*/
        function clearCookie(){
            var keys=document.cookie.match(/[^ =;]+(?=\=)/g);
            if (keys) {
                for (var i = keys.length; i--;)
                    document.cookie=keys[i]+'=0;expires=' + new Date( 0).toUTCString()
            }
        }

        /*判断对象是否为空*/
        function isEmptyObject(obj) {
            for (var key in obj) {
                return false;
            }
            return true;
        }


        //深度克隆对象
        function objClone(obj) {
            var result = {};
            for (var key in obj){
                result[key] = obj[key];
            }
            return result;
        }


        //删除数组中指定项
        function delArray(myArray, data) {
            var newArr = [];
            for(var i=0;i<=myArray.length-1;i++){
                if(myArray[i] != data){
                    newArr.push(myArray[i]);
                }
            }
            return newArr;
        }



        //优雅安全的从深层数据结构中取值
        //来源于https://juejin.im/post/590861b744d90400693a1891
        function getFromJsonAppointedValue(path) {
            return function (json) {
                return path.reduce(function (xs, x) {
                    return (xs && xs[x]) ? xs[x] : null;
                }, json);
            }
        }







