///<reference path="tslib/node.d.ts" />
///<reference path="logger/logger.ts" />
///<reference path="toolkit/index.ts" />
var daemonLogger = require("./logger/logger").getLogger('daemon');
var c_p = require('child_process');
var Toolkit = require("./toolkit/index");
var http = require("http");
var config = eval('require("./config.js")');

//定时做health check，如果服务超过一段时间不响应，自动重启
var checkInterval = 3000;
var healthCheckCount = 0;
var MaxErrorCount = 3;

setInterval(function () {
    //使用简单http请求探测服务是否正常工作
    var healthCheckUrl = "http://127.0.0.1:" + config.ServerPort + "/m2012server/memory";
    /*
    // 需要启动外部命令进程，并且不跨平台
    var curl = c_p.spawn("curl", [healthCheckUrl]);
    curl.stdout.on("data", function (data) {
        data = data.toString();
        if (data.indexOf("heapTotal") > -1) {
            healthCheckCount = 0; //危险阀值清0
        }
    });
    curl.stdin.end();*/

    http.get(healthCheckUrl, function(res) {
	    res.on("data", function(data) {
			if(data.toString().indexOf("heapTotal") > -1) {
				healthCheckCount = 0; // 危险阀值清0
			}
		}).on("error", function(err){
			daemonLogger.error("healthCheckUrlException:%j", err && err.stack);
		});
    }).on("error", function(err) {
    });

    //健康检查没有得到响应
    if (healthCheckCount > MaxErrorCount) {
        daemonLogger.error("health check no response");
        healthCheckCount = 0;
        killAndRestart();
    } else {
        healthCheckCount++; // 危险阀值 +1
    }
}, checkInterval);

function killAndRestart() {
    Toolkit.Utils.killProcess(config.masterJSPath, function () {
        setTimeout(function () {
            c_p.spawn("node", [config.masterJSPath]);
        }, 2000);
    });
}

process.on("uncaughtException", function (err) {
	daemonLogger.error("uncaughtException:%j", err && err.stack);
    console.error("uncaughtException:%j", err && err.stack);
});
