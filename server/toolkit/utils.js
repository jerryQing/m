///<reference path="../tslib/node.d.ts" />
var child_process = require('child_process');

function killProcess(searchText, callback) {
    var result = 0;
    var psText = "";
    // win
    // taskkill /pid /f
    // tasklist|findstr "node.exe"
    child_process.exec("ps -ax|grep node", function (err, stdOut, stdErr) {
        psText = stdOut.toString();
        matchAndKill();
        if (callback) {
            callback(result);
        }
    });

    function matchAndKill() {
        var lines = psText.split("\n");
        for (var i = 0; i < lines.length; i++) {
            var l = lines[i];
            if (l.indexOf("node ") > -1 && l.indexOf(searchText) > -1) {
                var match = l.match(/\s*(\d+)/);
                if (match) {
                    var pid = parseInt(match[1]);
                    try  {
                        console.log("try to kill pid:" + pid);
                        process.kill(pid, 'SIGTERM');
                        result++;
                        console.log("kill nodejs at pid:" + pid);
                    } catch (e) {
                        console.log("kill nodejs fail");
                    }
                }
            }
        }
    }
}

function extend(target, source) {
	for (var prop in source) {
		target[prop] = source[prop];
	}
	return target;
}

exports.extend = extend;
exports.killProcess = killProcess;

