///<reference path="../tslib/node.d.ts" />
var vm = require('vm');

function tryEval(str) {
    var obj = null;
    try  {
        obj = vm.runInThisContext("(" + str + ")");
    } catch (e) {
        console.warn("eval script error:%j", str.substring(0, 20));
    }
    return obj;
}
exports.tryEval = tryEval;

function stringifySafe(obj) {
    var text = JSON.stringify(obj);
    text = text.replace(/</g, "\\u003c").replace(/>/g, "\\u003e");
    return text;
}
exports.stringifySafe = stringifySafe;

