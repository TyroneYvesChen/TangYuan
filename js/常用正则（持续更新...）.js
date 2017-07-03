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


        // 常见的 正则表达式 校验
        // QQ号、手机号、Email、是否是数字、去掉前后空格、是否存在中文、邮编、身份证、URL、日期格式、IP
        //摘自于http://www.lovebxm.com/2017/05/31/RegExp/
        var myRegExp = {
            // 检查字符串是否为合法QQ号码
            isQQ: function(str) {
                // 1 首位不能是0  ^[1-9]
                // 2 必须是 [5, 11] 位的数字  \d{4, 9}
                var reg = /^[1-9][0-9]{4,9}$/gim;
                if (reg.test(str)) {
                    console.log('QQ号码格式输入正确');
                    return true;
                } else {
                    console.log('请输入正确格式的QQ号码');
                    return false;
                }
            },
            // 检查字符串是否为合法手机号码
            isPhone: function(str) {
                var reg = /^(0|86|17951)?(13[0-9]|15[012356789]|18[0-9]|14[57]|17[678])[0-9]{8}$/;
                if (reg.test(str)) {
                    console.log('手机号码格式输入正确');
                    return true;
                } else {
                    console.log('请输入正确格式的手机号码');
                    return false;
                }
            },
            // 检查字符串是否为合法Email地址
            isEmail: function(str) {
                var reg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
                // var reg = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
                if (reg.test(str)) {
                    console.log('Email格式输入正确');
                    return true;
                } else {
                    console.log('请输入正确格式的Email');
                    return false;
                }
            },
            // 检查字符串是否是数字
            isNumber: function(str) {
                var reg = /^\d+$/;
                if (reg.test(str)) {
                    console.log(str + '是数字');
                    return true;
                } else {
                    console.log(str + '不是数字');
                    return false;
                }
            },
            // 去掉前后空格
            trim: function(str) {
                var reg = /^\s+|\s+$/g;
                return str.replace(reg, '');
            },
            // 检查字符串是否存在中文
            isChinese: function(str) {
                var reg = /[\u4e00-\u9fa5]/gm;
                if (reg.test(str)) {
                    console.log(str + ' 中存在中文');
                    return true;
                } else {
                    console.log(str + ' 中不存在中文');
                    return false;
                }
            },
            // 检查字符串是否为合法邮政编码
            isPostcode: function(str) {
                // 起始数字不能为0，然后是5个数字  [1-9]\d{5}
                var reg = /^[1-9]\d{5}$/g;
                // var reg = /^[1-9]\d{5}(?!\d)$/;
                if (reg.test(str)) {
                    console.log(str + ' 是合法的邮编格式');
                    return true;
                } else {
                    console.log(str + ' 是不合法的邮编格式');
                    return false;
                }
            },
            // 检查字符串是否为合法身份证号码
            isIDcard: function(str) {
                var reg = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
                if (reg.test(str)) {
                    console.log(str + ' 是合法的身份证号码');
                    return true;
                } else {
                    console.log(str + ' 是不合法的身份证号码');
                    return false;
                }
            },
            // 检查字符串是否为合法URL
            isURL: function(str) {
                var reg = /^https?:\/\/(([a-zA-Z0-9_-])+(\.)?)*(:\d+)?(\/((\.)?(\?)?=?&?[a-zA-Z0-9_-](\?)?)*)*$/i;
                if (reg.test(str)) {
                    console.log(str + ' 是合法的URL');
                    return true;
                } else {
                    console.log(str + ' 是不合法的URL');
                    return false;
                }
            },
            // 检查字符串是否为合法日期格式 yyyy-mm-dd
            isDate: function(str) {
                var reg = /^[1-2][0-9][0-9][0-9]-[0-1]{0,1}[0-9]-[0-3]{0,1}[0-9]$/;
                if (reg.test(str)) {
                    console.log(str + ' 是合法的日期格式');
                    return true;
                } else {
                    console.log(str + ' 是不合法的日期格式，yyyy-mm-dd');
                    return false;
                }
            },
            // 检查字符串是否为合法IP地址
            isIP: function(str) {
                // 1.1.1.1  四段  [0 , 255]
                // 第一段不能为0
                // 每个段不能以0开头
                //
                // 本机IP: 58.50.120.18 湖北省荆州市 电信
                var reg = /^([1-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])(\.([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])){3}$/gi;
                if (reg.test(str)) {
                    console.log(str + ' 是合法的IP地址');
                    return true;
                } else {
                    console.log(str + ' 是不合法的IP地址');
                    return false;
                }
            }
        }
        // 测试
        // console.log(myRegExp.isQQ('80583600'));
        // console.log(myRegExp.isPhone('17607160722'));
        // console.log(myRegExp.isEmail('80583600@qq.com'));
        // console.log(myRegExp.isNumber('100a'));
        // console.log(myRegExp.trim('  100  '));
        // console.log(myRegExp.isChinese('baixiaoming'));
        // console.log(myRegExp.isChinese('小明'));
        // console.log(myRegExp.isPostcode('412345'));
        // console.log(myRegExp.isIDcard('42091119940927001X'));
        // console.log(myRegExp.isURL('https://www.baidu.com/'));
        // console.log(myRegExp.isDate('2017-4-4'));
        // console.log(myRegExp.isIP('1.0.0.0'));