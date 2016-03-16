var spawn = require('child_process').spawn;
var exec = require('child_process').exec;
var config = eval('require("./server/config.js")');

//启动守护进程mother
var mother = spawn("node", [config.masterJSPath]);

mother.on("exit", function(code){
	console.log("start fail!! =_=");
	process.stdout.write(code);
	process.exit();
});

mother.stdout.on("data", function(data){
	var code = data.toString();
	process.stdout.write("from mother: " + data + "\n");
	if(code == "200"){
	    console.log("start success!! ^_^");
	    var daemon = exec("node " + config.daemonJSPath);
	    setTimeout(function () {
	        process.exit(0);
	    }, 2000);
	}
});
