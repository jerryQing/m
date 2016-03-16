///<reference path="../tslib/node.d.ts" />
///<reference path="../tslib/express.d.ts" />
///<reference path="../tslib/m2012.d.ts" />
var express = require("express");
var welcome = require("../pages/welcome");
var home = require("../pages/home");
var logger = require("../logger/logger");
var HttpClient = require("../httpClient/httpClient");
var childProcess = require("child_process");
var cookieParser = require('cookie-parser');
var config = eval('require("../config.js")');

function getServerHost(siteName, cookiePartId) {
    var domain = config.Domains[siteName];
    if (domain && domain[cookiePartId]) {
        return domain[cookiePartId];
    } else {
        return "";
    }
}
exports.getServerHost = getServerHost;

function routerServer(app) {
    app.use("/m2012server", cookieParser());
    app.use("/m2012server/composeCompress", function (req, res, next) {
        req.body = '';
        req.setEncoding('utf8');

        req.on('data', function (chunk) {
            req.body += chunk;
        });

        req.on('end', function () {
            createWorker();
        });

        function createWorker() {
            var log = logger.getLogger();
            log.info("URL=" + req.url + "|NAME=Create_Rawinflate_Worker");

            //启动子进程有几毫秒的损耗
            var date_b = Date.now();
            var worker = childProcess.fork(config.compressWorkerPath, null, {});
            worker.on("message", function (newChunk) {
                //性能日志
                log.info("URL=" + req.url + "|Length=" + req.query.length + "|CompressUsing=" + req.query.usedTime + "|UncompressUsing=" + (Date.now() - date_b));
                clearTimeout(timer);
                req.body = newChunk;
                next();
            });

            //send 需要传 {}
            worker.send({ body: req.body }, null);
            var timer = setTimeout(function () {
                //防止子进程不退出
                log.error("URL=" + req.url + "|NAME=Rawinflate_Worker_By_Kill");
                worker.kill();
                next();
            }, 5000);
        }
    });
    app.use("/m2012server/composeCompress", cookieParser());

    app.get("/m2012server/memory", function (req, res) {
        res.send(200, JSON.stringify(process.memoryUsage()));
    });

    app.get("/m2012server/welcome", function (req, res) {
        if (!req.cookies.RMKEY || !req.cookies.cookiepartid || !/^\w+$/.test(req.query.sid)) {
            res.send(202, "<h1>会话验证失败</h1>");
        } else {
            var page = new welcome.WelcomePage({
                request: req,
                response: res
            });
            page.render();
        }
    });

    app.get("/m2012server/home", function (req, res) {
        //if (!req.cookies.RMKEY || !req.cookies.cookiepartid || !/^\w+$/.test(req.query.sid)) {
            //res.send(202, "<h1>会话验证失败</h1>");
        //} else {
            var page = new home.HomePage({
                request: req,
                response: res
            });
            page.render();
        //}
    });

    app.post("/m2012server/composeCompress", function (req, res) {
        if (!req.cookies.RMKEY || !req.cookies.cookiepartid || !/^\w+$/.test(req.query.sid)) {
            res.send(202, "<h1>会话验证失败</h1>");
        } else {
            var httpClient = new HttpClient.HttpClient({
                clientIP: req.header('X-Forwarded-For') || req.ip,
                sid: req.query.sid,
                cookies: req.cookies
            });
            httpClient.sendMailCompress(req.query, req.body, function (err, obj) {
                httpClient.logInfo("ComposeCompressResponse=" + JSON.stringify(obj));
                if (!err) {
                    res.send(200, JSON.stringify(obj));
                } else {
                    res.send(202, JSON.stringify(obj));
                }
            });
        }
    });

    if (config.devMode) {
        app.use(require('errorhandler')()); //研发线，测试线，或者本地挂载生产线，页面出错可以打印异常堆栈
    } else {
        //生产线要输出友好的错误提示
        app.use("/m2012server/welcome", function (err, req, res, next) {
            if (err) {
                var log = logger.getLogger();
                log.error("STATUS=500|STACK=" + err.stack);
                res.render("welcome500.ejs", {}); //输出友好的欢迎页出错页（静态无数据页面）
            }
        });
        app.use("/m2012server/composeCompress", function (err, req, res, next) {
            if (err) {
                var log = logger.getLogger();
                log.error("STATUS=500|STACK=" + err.stack);
                res.send(202, JSON.stringify({
                    code: "FA_UNKNOWN",
                    var: err.status
                }));
            }
        });
        app.use(function (err, req, res, next) {
            if (err) {
                var log = logger.getLogger();
                log.error("STATUS=500|STACK=" + err.stack);
                res.send(500, 'Server Error!');
            }
        });
    }
}
exports.routerServer = routerServer;
