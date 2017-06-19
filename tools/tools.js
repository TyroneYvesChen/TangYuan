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
        /**
         * 来源于https://juejin.im/post/590861b744d90400693a1891
         * var props = {
                    user: {
                        posts: [
                            { title: 'Foo', comments: [ 'Good one!', 'Interesting...' ] },
                            { title: 'Bar', comments: [ 'Ok' ] },
                            { title: 'Baz', comments: []}
                        ],
                        comments: [...]
                    }
                }
         var getUserComments = getFromJsonAppointedValue(['user', 'posts', 0, 'comments'])
         console.log(getUserComments(props))        // [ 'Good one!', 'Interesting...' ]
         console.log(getUserComments({user:{posts: []}}))       // null
         * */
        function getFromJsonAppointedValue(path) {
            return function (json) {
                return path.reduce(function (xs, x) {
                    return (xs && xs[x]) ? xs[x] : null;
                }, json);
            }
        }




        
        function distinguishBetweenMobileAndPC() {
            var browser = {
                versions: function() {
                    var u = navigator.userAgent,
                        app = navigator.appVersion;
                    return {
                        mobile: !!u.match(/AppleWebKit.*Mobile.*/),
                        ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
                        android: u.indexOf("Android") > -1 || u.indexOf("Linux") > -1,
                        iPhone: u.indexOf("iPhone") > -1,
                        iPad: u.indexOf("iPad") > -1
                    };
                } (),
                language: (navigator.browserLanguage || navigator.language).toLowerCase()
            };

            //判断 浏览器 类型
            var ex = navigator.userAgent,
                bUA;
            if (ex.indexOf("MSIE") >= 0) {
                bUA = "Internet Explorer 10  Or Earlier"; //IE
            } else if (ex.indexOf("Firefox") >= 0) {
                bUA = "Firefox";
            } else if (ex.indexOf("Chrome") >= 0) {
                bUA = "Chrome";
                if (ex.indexOf("360SE") >= 0) { //360安全浏览器
                    bUA = "360SE";
                } else if (ex.indexOf("360EE") >= 0) { //360急速浏览器
                    bUA = "360EE";
                } else if (ex.indexOf("SE") >= 0 && ex.indexOf("360SE") == -1) { //搜狗浏览器
                    bUA = "SouGou";
                } else if (ex.indexOf("Maxthon") >= 0) { //遨游浏览器
                    bUA = "Maxthon";
                }
            } else if (ex.indexOf("UCBrowser") >= 0 || ex.indexOf("UCWEB") >= 0) { // UC浏览器
                bUA = "UCBrowser";
            } else if (ex.indexOf("Opera") >= 0) {
                bUA = "Opera";
            } else if (ex.indexOf("Safari") >= 0) { // 苹果浏览器
                bUA = "Safari";
            } else if (ex.indexOf("Netscape") >= 0) {
                bUA = "Netscape";
            } else if (ex.indexOf("like Gecko") >= 0 && ex.indexOf("Trident") >= 0) {
                bUA = "Internet Explorer 11 Or Later"; //IE11 以后，不再用 MSIE
            } else {
                bUA = "Other Broswer";
            }
            browser.bUA = bUA;
            return browser;
        }


    // $("#aa2").append("userAgent 内容: <BR/>" + navigator.userAgent + "<BR/><BR/>");
    // $("#aa2").append("是否为移动终端: " + browser.versions.mobile + "<BR/>");
    // $("#aa2").append("是否 ios: " + browser.versions.ios + "<BR/>");
    // $("#aa2").append("是否 android: " + browser.versions.android + "<BR/>");
    //
    //
    //
    // $("#aa2").append("当前浏览器: " + bUA + "<BR/>");






