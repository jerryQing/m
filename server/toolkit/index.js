///<reference path="../tslib/node.d.ts" />
var json = require("./json");
var http = require("./httpUtils");
var utils = require("./utils");
var text = require("./text");
var concurrent = require("./concurrent.js");

var DateUtil={
	getDaysPass: function (startDate, endDate) {
            var t = endDate.getTime() - startDate.getTime();//相差毫秒
            var day = Math.round(t / 1000 / 60 / 60 / 24);
            if (day == 0 || day == 1) {
                day = startDate.getDate() == endDate.getDate() ? 0 : 1;
            }
            return day;
        }
}
exports.DateUtil=DateUtil;

exports.Json = json;
exports.Http = http;
exports.Utils = utils;
exports.Text = text;
exports.Concurrent = concurrent;
