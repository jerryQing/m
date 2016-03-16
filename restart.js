var Toolkit = require("./server/toolkit");
var config = eval('require("./server/config.js")');
var spawn = require('child_process').spawn;


Toolkit.Utils.killProcess(config.daemonJSPath, function () {
    Toolkit.Utils.killProcess(config.masterJSPath, function () {
        var start = spawn("node", [config.startJSPath]);

        start.stdout.on("data", function (data) {
            process.stdout.write(data);		// 子进程的输出接到当前进程的输出
            //process.stdin.write(data);
        });

        start.on("exit", function () {
            process.exit();
        });
    });
});
