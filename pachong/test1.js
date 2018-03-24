// 加载第三方库
var request = require('request');
// 要抓取的url
// var url = 'http://www.xiaohuar.com/list-1-0.html';
var url = 'http://www.yitianyibu.com/category';
// 开始抓取
request.get({
    url: url
}, function (err, response, body) {
    if (!err && response.statusCode === 200) {
        console.log(body);// 请求页面返回的html数据
    } else {
        console.error('请求失败', err);
    }
});

/*
    总结：
    1.这是一个简单的请求页面数据的方式
        通过request来请求此页面数据
        此库是对http这个标准库的封装
        
        学习 ：request
        地址 ：https://github.com/request/request
        
        注意：
        此页面为gbk编码，会出现中文乱码
 */
