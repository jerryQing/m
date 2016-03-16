
var libPath = require("path");

var Configs = {
	"rd139cm":"./conf/rd139cm.js",
    "10086rd":"./conf/10086rd.js",
    "10086ts": "./conf/10086ts.js",
    "10086.beta":"./conf/10086.js",
    "10086":"./conf/10086.js"
}

var line = "10086.beta";

//exports.isWindowsPC = require('os').platform() == "win32";
var isLocal = require('os').platform().indexOf("win") > -1;

exports = module.exports = require(Configs[line]);

//灰度有特殊的日志路径
if (line == "10086.beta" && !isLocal) {
    exports.LOG_PATH = '/home/logs/m2012server';
} else {
	exports.LOG_PATH = libPath.resolve(__dirname, '../log');
}

if (isLocal) {
    //本机默认启用fiddler模式
    exports.fiddlerMode = 1;
    if (line == "10086" || line == "10086.beta") {
        exports.BalanceList = null;
    }
}

if (isLocal || line !== "10086" && line !== "10086.beta") {
    exports.devMode = true;
}

if(isNaN(exports.ServerPort)) {
	exports.ServerPort = 80;
}

exports.startJSPath = libPath.resolve(__dirname, "../start.js");
exports.masterJSPath = libPath.resolve(__dirname, "master.js");
exports.workerJSPath = libPath.resolve(__dirname, "app.js");
exports.daemonJSPath = libPath.resolve(__dirname, "daemon.js");
exports.compressWorkerPath = libPath.resolve(__dirname, "toolkit/rawinflateWorker.js");
