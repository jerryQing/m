var Toolkit = require("./server/toolkit");
Toolkit.Utils.killProcess(__dirname + "/server/daemon.js", function (result) {
    console.log("kill process:" + result);
    Toolkit.Utils.killProcess(__dirname + "/server/master.js", function (result) {
		console.log("kill process:" + result);
		process.exit();
	});
});
