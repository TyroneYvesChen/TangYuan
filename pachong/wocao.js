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

let baseUrl = "http://top.baidu.com/";


async.waterfall([getPagesUrl, getInfoList], function (error, result) {
    console.log(error, '爬虫结束');
    console.log(result.length, "爬虫result")
});





// 处理要抓取的页面地址
function getPagesUrl(done) {
    request.get({
        url: baseUrl,
        encoding: null // buffer
    }, function (err, response, body) {
        //错误return
        if (err && response.statusCode !== 200) {
            console.error('请求失败', err);
            done(err);
            return
        }

        body = iconv.decode(body, 'gb2312');// 处理转码问题
        var $ = cheerio.load(body);// 解析页面
        // 拿到页面的相关链接
        $('#hot-list').find(".list-title").each(function (item) {
            var urls = $(this).attr('href');// 获取这个页面的我们要抓的url地址
            urls && urlsList.push(urls);
        });
        done(null, urlsList)
        console.log(urlsList)
    });
}





// 利用async 控制异步操作 的多个方法
// async.waterfall([getInfoList, getImageList], function (error) {
//     console.log('爬虫结束');
// });

// 获取百度搜索关键字首页数据
function getInfoList (List, done) {
    // 开始批量抓取 一次抓5页 分批抓取
    let arr = [],
    i = 0;
    async.forEachLimit(List, 2, function (url, callback) {
        // 发起请求
        request.get({
            url: url,
            encoding: null // buffer
        }, function (err, response, body) {
            if (err && response.statusCode !== 200) {
                console.error('请求失败', err);
                // 因为我们不希望报错停止抓取 所以不拦截报错
                callback(err);
            }
            body = iconv.decode(body, 'utf8');// 处理转码问题
            var $ = cheerio.load(body);// 解析页面
            // 拿到页面的相关链接
            $('.result.c-container').each(function (item) {
                var newsUrl = $(this).find('.t').find('a').attr('href');// 获取这个页面的我们要抓的url地址
                var newContent = $(this).find(".c-abstract").text();
                arr.push({
                    newsUrl: newsUrl,
                    newContent: removeTAG(newContent)
                });
            });
            console.log("------------------------------------------------------------------------------------");
            console.log(i++);
            console.log("------------------------------------------------------------------------------------");
            callback(null, arr);
        }); 
    }, function (error, result) {
        // 批量抓取的结果
        console.log(error)
        console.log(result)
        if (error) {
            console.error('获取详情列表页失败', error);
            done(error);
        } else {
            console.log('批量抓取列表页结束, 共计获取了', arr.length, '条详情页数据');
            done(null, arr);
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


function removeTAG(str){
return str.replace(/<[^>]+>/g, "");
}
