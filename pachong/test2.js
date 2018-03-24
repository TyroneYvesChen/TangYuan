// 加载第三方库
var request = require('request'),
    iconv = require('iconv-lite');
// 要抓取的url
var url = 'http://www.xiaohuar.com/list-1-0.html';
// 开始抓取
request.get({
    url: url,
    encoding: null // buffer
}, function (err, response, body) {
    if (!err && response.statusCode === 200) {
        body = iconv.decode(body, 'gb2312');// 处理转码问题
        console.log(body);// 请求页面返回的html数据
    } else {
        console.error('请求失败', err);
    }
});

/*
    总结：
    2.在test1的基础上,处理解决乱码问题
        通过iconv-lite这个库解决乱码问题
        使用方式很简单 让body 直接是buffer
        首先让request请求的返回直接buffer
        然后 iconv.decode(body, 'gb2312') 即可

    1.这是一个简单的请求页面数据的方式
        通过request来请求此页面数据
        此库是对http这个标准库的封装
        
        学习 ：request
        地址 ：https://github.com/request/request
        
        注意：
        此页面为gbk编码，会出现中文乱码
 */
