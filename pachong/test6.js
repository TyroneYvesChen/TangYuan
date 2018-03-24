// 加载第三方库
var request = require('request'),
    iconv = require('iconv-lite'),
    cheerio = require('cheerio'),
    async = require('async');
// 加载标准库依赖
var path = require('path'),
    fs = require('fs');

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
        // 利用定时器来模拟人操作的延迟行为 防止一次请求太多 对目标网站造成ddoc攻击
        setTimeout(function () {
            // 开始抓取
            request.get({
                url: url,
                encoding: null // buffer
            }, function (err, response, body) {
                if (!err && response.statusCode === 200) {
                    body = iconv.decode(body, 'gb2312');// 处理转码问题
                    var $ = cheerio.load(body);// 解析页面
                    var photosr = [];
                    // 获取图片链接
                    $('.photo_ul').find('img').each(function (item) {
                        photosr.push($(this).attr('src'));
                    })
                    // 下载图片
                    async.forEach(photosr, function (item, downloadImgCallback) {
                        // 处理一下链接不存在的可能
                        if (!item) {
                            return downloadImgCallback();
                        }
                        var imgsrc = 'http://www.xiaohuar.com' + item;
                        var filename = parseUrlForFileName(imgsrc);
                        downloadImg(imgsrc, filename, function () {
                            console.log(filename + ' done');
                            downloadImgCallback();
                        });
                    }, function () {
                        console.log('某个妹子图片下载处理结束');
                        callback();
                    });
                } else {
                    console.error('请求失败', err);
                    // 因为我们不希望报错停止抓取 所以不拦截报错
                    callback();
                }
            });
        }, 500 + Math.floor(Math.random() * 500));
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
// 生成文件名
function parseUrlForFileName (address) {
    var filename = path.basename(address);
    return filename;
}
// 下载图片
function downloadImg (_url, filename, callback) {
    // 判断是否有存放文件的文件夹
    if (!fs.existsSync(__dirname + '/images')) {
        fs.mkdirSync(__dirname + '/images');
        console.log('初始化创建目录');
    }
    // 请求下载
    request.head(_url, function (err, res, body) {
        // console.log('content-type:', res.headers['content-type']);  //这里返回图片的类型
        // console.log('content-length:', res.headers['content-length']);  //图片大小
        if (err) {
            console.log('err: ' + err);
            return false;
        }
        // 调用request的管道来下载到 images文件夹下
        request(_url)
            .pipe(fs.createWriteStream('images/' + filename))
            .on('close', callback);  
    });
}

/*
    总结：
    6.在test5的基础上,实现图片的下载
        现在我们有了图片的地址和图片的名字 就可以下载了 
        在这里我们调用的是request模块的head方法来下载 
        请求到图片再调用fs文件系统模块中的createWriteStream来下载到本地目录

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
