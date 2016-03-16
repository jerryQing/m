///<reference path="../tslib/node.d.ts" />
///<reference path="index.ts" />
///<reference path="../logger/logger.ts" />
var rawinflate = require("./rawinflate");

process.on("message", function (msg) {
    var body = rawinflate.inflate(msg.body);
    process['send'](body);
});

//防止服务不退出
setTimeout(function () {
    process.exit(1);
}, 30 * 1000);
