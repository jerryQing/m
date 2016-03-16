///<reference path="tslib/node.d.ts" />
///<reference path="tslib/m2012.d.ts" />
///<reference path="logger/logger.ts" />
var masterLogger = require("./logger/logger").getLogger('master');
var cluster = require("cluster");
var os = require('os');
var config = eval('require("./config.js")');

var DaemonApp = (function () {
    function DaemonApp(options) {
        var _this = this;
        this.options = options;
        this.workers = [];
        this.lastWorkersTick = {};
        this.childMessageCount = 0;
        this.workerNumbers = {};
        
		// 获取工人进程数量
		this.workerCount = (function (max) {
		    var numCPUs = os.cpus().length;
		    return Math.min(numCPUs, max);
		})(options.maxWorkerCount);

		var workerCount = this.workerCount;
		console.log(options.childScript);

        cluster.setupMaster({ exec: options.childScript });

        cluster.on('exit', function (worker, code, signal) {
            _this.onWorkerExit(worker, code, signal);
        });
        /*cluster.on('online', function(worker) {
            console.log("Yay, the worker responded after it was forked");
        });*/

        for (var i = 0; i < workerCount; i++) {
            this.createWorker();
        }

        setInterval(function () {
            _this.checkWorkerHealth();
        }, 1000);

        /**
        *3秒钟收不到所有子进程启动成功的信息就退出
        */
        setTimeout(function () {
            if (_this.childMessageCount < workerCount) {
                console.error("start fail -_-!!!");
                process.exit(1);
            }
        }, 3000);
    }

    /**
    * 给子多个worker进程分配编号
    * 永远是1开始，maxWorkerCount结束，用来规范每个进程的日志写入特定编号的文件中
    */
    DaemonApp.prototype.getFreeWorkerNumber = function () {
        var count = this.workerCount;
        for (var i = 1; i <= count; i++) {
            if (!this.workerNumbers[i]) {
                return i;
            }
        }
        return 0;
    };

    DaemonApp.prototype.removeWorkerNumber = function (pid) {
        for (var p in this.workerNumbers) {
            if (this.workerNumbers[p] == pid) {
                delete this.workerNumbers[p];
            }
        }
    };

    /**
    *创建子进程
    */
    DaemonApp.prototype.createWorker = function () {
        var _this = this;
        var workerNumber = this.getFreeWorkerNumber();
        var child = cluster.fork({
            workerNumber: workerNumber
        });
        child.on('message', function (message) {
            _this.onWorkerMessage(child, message);
        });

        // 标记该worker编号被占用
        this.workerNumbers[workerNumber] = child.process.pid;

        this.workers.push(child);
        
        console.log('worker ' + child.process.pid + ' start');
        masterLogger.info('worker ' + child.process.pid + ' start');
    };

    DaemonApp.prototype.onWorkerMessage = function (worker, message) {
        this.childMessageCount++;
        if (this.childMessageCount == this.workerCount) {
            //console.info("start success ^_^ !!!");
            process.stdout.write("200"); //告诉主进程我已经成功启动
        }

        //console.log("worder " + worker.process.pid + " send message:" + message);
        this.lastWorkersTick[worker.process.pid] = Date.now();
    };

    DaemonApp.prototype.onWorkerExit = function (worker, code, signal) {
        delete this.lastWorkersTick[worker.process.pid];
        this.removeWorkerNumber(worker.process.pid);
        for (var i = 0; i < this.workers.length; i++) {
            if (this.workers[i] == worker) {
                this.workers.splice(i, 1);
            }
        }
        masterLogger.error('worker ' + worker.process.pid + ' died');
        console.error('worker ' + worker.process.pid + ' died');
        this.createWorker();
    };

    DaemonApp.prototype.checkWorkerHealth = function () {
        var now = Date.now();
        var child, lastTick;
        var len = this.workers.length;
        for (var i = 0; i < len; i++) {
            child = this.workers[i];
            lastTick = this.lastWorkersTick[child.process.pid];
            if (lastTick) {
                //子进程长时间没响应就杀进程
                if (now - lastTick > this.options.noResponseToKill) {
                    this.stopWorker(child);
                }
            } else {
                this.lastWorkersTick[child.id] = now;
            }
        }
    };

    DaemonApp.prototype.stopWorker = function (child) {
        console.log("kill worker " + child.process.pid);
        child.process.kill();
    };
    return DaemonApp;
})();

var app = new DaemonApp({
    childScript: config.workerJSPath,
    maxWorkerCount: 4,
    noResponseToKill: 5000
});

process.on("uncaughtException", function (err) {
	masterLogger.error("uncaughtException:%j", err && err.stack);
    console.error("uncaughtException:%j", err && err.stack);
});
