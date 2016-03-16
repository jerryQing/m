///<reference path="../tslib/node.d.ts" />
///<reference path="../tslib/express.d.ts" />
///<reference path="../tslib/m2012.d.ts" />
var path = require('path');

/**
* 对log4js进行简单封装
*/
var log4js = require('log4js');

var config = eval('require("../config.js")');

var logPath = config.LOG_PATH;

var fileExt = "";

//由于多个worker进程无法写同一个日志文件，所以要根据编号加文件后缀，workerNumber这个进程变量来自master fork的时候传的参数
if (process.env.workerNumber) {
    fileExt = process.env.workerNumber;
}

//log4js.loadAppender('console');
//log4js.addAppender(log4js.appenders.console());

//log4js.loadAppender('file');
//log4js.addAppender(log4js.appenders.file(logPath + '/master.log'), 'master');

log4js.configure({
    appenders: [
        {
            category: 'master',
            type: 'file',
            filename: logPath + '/master.log'
        },
        {
            category: 'daemon',
            type: 'file',
            filename: logPath + '/daemon.log'
        },
        {
            category: 'app',
            type: 'dateFile',
            pattern: "-yyyy-MM-dd",
            filename: logPath + '/app' + fileExt + '.log',
            alwaysIncludePattern: false
        },
        {
            category: 'express',
            type: "dateFile",
            pattern: "-yyyy-MM-dd",
            filename: logPath + '/access' + fileExt + '.log',
            alwaysIncludePattern: false
        }
    ],
    replaceConsole: !config.fiddlerMode	// todo 生产环境下必须设为true
});

function getLogger(name) {
    if (!name) {
        name = "app";
    }
    return log4js.getLogger(name);
}
exports.getLogger = getLogger;

function getConnectLogger() {
    var logger = log4js.getLogger('express');
    logger.setLevel('INFO');

    //设置level为auto，遇到4xx和5xx会自动记录error级日志
    return log4js.connectLogger(logger, { level: 'auto', format: ':remote-addr :req[X-Forwarded-For] - ":method :url HTTP/:http-version" :status :response-time ":referrer" ":user-agent"' });
}
exports.getConnectLogger = getConnectLogger;
