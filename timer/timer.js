/**
 * @timer
 * @author Tyrone Yves Chen
 * @version 1.0
 * @description 定时器
 * @disclaimer 我只是代码的搬运工，借鉴于网上各位大佬的代码修改后在项目中使用，如有雷同，纯属巧合
 * @PS：汤圆萌萌哒~
 * Param ：
 * options = {
        initTime :100,   //初始化时间单位毫秒
        inFn :function () {
            //定时器执行时所要执行方法
        },
        endFn :function () {
            //定时器结束时所要执行方法
        }
    };
 */

    function timer(options){
        var options = options,
            initTime = options.initTime ? options.initTime : 0,
            inFn = options.inFn,
            endFn = options.endFn;

        var timerId = window.setInterval(function(){
            var minute = 0,
                second = 0;//时间默认值
            if(initTime > 0){
                minute = Math.floor(initTime / 60);
                second = Math.floor(initTime) - (minute * 60);
                minute <= 9 ? minute = '0' + minute : minute;
                second <= 9 ? second = '0' + second : second;
                var timerText = minute + ":" + second,
                    val = {
                        minute :minute,
                        second :second,
                        timerText :timerText
                    };
                inFn && typeof inFn == "function" ? inFn(val) : "";
            }
            else if (initTime == 0) {
                clearInterval(timerId);
                endFn && typeof endFn == "function" ? endFn() : "";
            }
            initTime --;
        }, 1000);
    }