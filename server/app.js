///<reference path="tslib/node.d.ts" />
///<reference path="tslib/express.d.ts" />
///<reference path="tslib/m2012.d.ts" />
///<reference path="logger/logger.ts" />
var express = require("express");
var ejs = require("ejs");

var logger = require("./logger/logger");
var router = require("./router/router");
var compress = require('compression');

var config = eval('require("./config.js")');

var app = express();

//启动gzip压缩返回报文（影响bigpipe即时输出）
//app.use(compress());

//app.use(function (req, res, next) {
    //注册日志为log4js托管
    app.use(logger.getConnectLogger());
    // The view directory path, defaulting to "process.cwd() + '/views'"
    app.set('views', __dirname + '/views');
    //next();
//});

//设置模板引擎为ejs（默认为jade)
app.set("view engine", "ejs");

//注册ejs可以处理html文件,否则默认只处理.ejs后缀名文件
app.engine('html', ejs.renderFile);

//配置所有路径路由
router.routerServer(app);

app.listen(config.ServerPort);

process.on("uncaughtException", function (err) {
    logger.getLogger().error("uncaughtException:%j", err && err.stack);
});

//1秒钟发一次心跳, process['send'] 只有在 worker模式有效
setInterval(function () {
    process['send'] && process['send']('worker request!');
}, 1000);
