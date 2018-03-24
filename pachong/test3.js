// 加载第三方库
var request = require('request'),
    iconv = require('iconv-lite'),
    cheerio = require('cheerio');

// 要抓取的url
var url = 'http://www.xiaohuar.com/list-1-0.html';
// 开始抓取
request.get({
    url: url,
    encoding: null // buffer
}, function (err, response, body) {
    if (!err && response.statusCode === 200) {
        body = iconv.decode(body, 'gb2312');// 处理转码问题
        var $ = cheerio.load(body);// 解析页面
        // 拿到页面的相关链接
        $('#list_img').find('.item').each(function (item) {
            var xiaohuaUrl = $(this).find('a').attr('href');// 获取这个页面的我们要抓的url地址
            console.log(xiaohuaUrl);
        });
    } else {
        console.error('请求失败', err);
    }
});

/*
    总结：
    3.在test2的基础上,解析页面,获取到我们想要的数据
        首先查看一下页面的结构
        然后通过cheerio对整个页面进行一个解析,其方便之处就是用类似jq的语法直接获取节点
        
        学习：cheerio
        地址：https://github.com/cheeriojs/cheerio

    2.在test1的基础上,处理解决乱码问题
        通过iconv-lite这个库解决乱码问题
        使用方式很简单 让body 直接是buffer
        首先让request请求的返回直接buffer
        然后 iconv.decode(body, 'gb2312') 即可

    1.这是一个简单的请求页面数据的方式
        通过request来请求此页面数据
        此库是对http这个标准库的封装
        
        学习：request
        地址：https://github.com/request/request
        
        注意：
        此页面为gbk编码，会出现中文乱码
 */
