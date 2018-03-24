// 加载第三方库
var request = require('request'),
    rp = require('request-promise'),
    iconv = require('iconv-lite'),
    cheerio = require('cheerio'),
    async = require('async');
// 加载标准库依赖
var path = require('path'),
    fs = require('fs');


let wocao = request({
    url: "http://www.xiaohuar.com/images/banner/a.jpg",
    encoding: null // buffer
}, function (error, response, body) {
    // if (!fs.existsSync(__dirname + '/images')) {
    //     fs.mkdirSync(__dirname + '/images');
    //     console.log('初始化创建目录');
    // }
    // wocao.pipe(fs.createWriteStream('images/a.jpg'))
    // console.log(body)
}).on('error', function(err) {
    console.log(err)
})
    // .pipe(fs.createWriteStream('images/a.jpg'))

