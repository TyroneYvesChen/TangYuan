// 加载第三方库
var request = require('request'),
    iconv = require('iconv-lite'),
    cheerio = require('cheerio'),
    async = require('async');

// 要抓取的页数 因为是学习所以写死2页 
var count = 2;
var urlsList = [];// 待抓取的页面地址
var xiaohuaUrlsList = [];// 待要抓取的详情页面地址
// 处理要抓取的页面地址
for (var i = 0; i < count; i++) {
    urlsList.push('http://www.xiaohuar.com/list-1-' + i + '.html');
}
// 查看要抓取的页面地址
console.log('urlsList:', urlsList);

// 利用async 控制异步操作 的多个方法
async.waterfall([getInfoList, getImageList], function (error) {
    console.log('爬虫结束');
});

// 获取详情页列表
function getInfoList (done) {
    // 开始批量抓取 一次抓5页 分批抓取
    async.forEachLimit(urlsList, 5, function (url, callback) {
        // 发起请求
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
                    // console.log(xiaohuaUrl);
                    /**
                     * 经过抓取发现格式不统一
                     * /p-1-146.html
                     * http://www.xiaohuar.com/p-1-584.html
                     * 所以统一一下格式
                     */
                    xiaohuaUrl = 'http://www.xiaohuar.com' + xiaohuaUrl.replace('http://www.xiaohuar.com', '');
                    // 放到容器内
                    xiaohuaUrlsList.push(xiaohuaUrl);
                });
                callback();
            } else {
                console.error('请求失败', err);
                // 因为我们不希望报错停止抓取 所以不拦截报错
                callback();
            }
        }); 
    }, function (error, result) {
        // 批量抓取的结果
        if (error) {
            console.error('获取详情列表页失败', error);
            done();
        } else {
            console.log('批量抓取列表页结束, 共计获取了', xiaohuaUrlsList.length, '条详情页数据');
            done();
        }
    });
}
// 根据详情页容器获取内容
function getImageList (done) {
    async.forEachLimit(xiaohuaUrlsList, 10, function (url, callback) {
        // 开始抓取
        request.get({
            url: url,
            encoding: null // buffer
        }, function (err, response, body) {
            if (!err && response.statusCode === 200) {
                body = iconv.decode(body, 'gb2312');// 处理转码问题
                var $ = cheerio.load(body);// 解析页面
                // 获取图片链接
                $('.photo_ul').find('img').each(function (item) {
                    var photosr = $(this).attr('src');
                    console.log(photosr);// 后期要下载的图片地址
                })
                callback();
            } else {
                console.error('请求失败', err);
                // 因为我们不希望报错停止抓取 所以不拦截报错
                callback();
            }
        });
    }, function (error, result) {
        if (error) {
            console.log('获取图片链接失败');
            done();
        }else{
            console.log('获取图片链接结束');
            done();
        }
    });
}

/*
    总结：
    5.在test4的基础上,实现分步操作抓取数据
        利用 async.waterfall 做异步的流程控制
        再利用之前学到的解析 获取每一个页面的图片地址

    4.在test3的基础上,实现多个页面的数据抓取
        首先我们模拟要抓取的多个页面地址
        然后通过async这个流程控制的库 批量抓取相应的列表页数据
        这里我们要注意一下数据格式的统一性。
        
        学习：async
        地址：https://github.com/caolan/async

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
