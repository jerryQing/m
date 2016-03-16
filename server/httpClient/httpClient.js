///<reference path="../tslib/node.d.ts" />
///<reference path="../tslib/m2012.d.ts" />
var API = require("../api/api");
var Router = require("../router/router");
var Toolkit = require("../toolkit/index");
var Logger = require("../logger/logger");
var config = eval('require("../config.js")');

var logger = Logger.getLogger("app");

function HttpClient(options) {
    this.options = options;
    this.requestCookie = this.getRequestCookie();
    this.userNumber = this.getUserNumber();
}

Toolkit.Utils.extend(HttpClient.prototype, {
	
	getCommonLog: function () {
	    return 'PID=' + process.pid + '|USERNUMBER=' + this.userNumber + '|SID=' + this.options.sid + '|PARTID=' + this.getPartId() + '|CLIENTIP=' + this.getClientIP();
	},
	logInfo: function (log) {
	    var log = this.getCommonLog() + "|" + log;
	    logger.info(log);
	    console.info(log);
	},

	logError: function (log) {
	    var log = this.getCommonLog() + "|" + log;
	    logger.error(log);
	    console.error(log);
	},

	logRequestTime: function (httpStatus, url, reqTime, length) {
	    var log = "NAME=HttpClient|STATUS=" + httpStatus + "|URL=" + url + "|REQUESTTIME=" + reqTime + "|SIZE=" + length;
	    this.logInfo(log);
	},

	logTimeout: function (url) {
	    this.logError("NAME=HttpClient|TIMEOUT=" + url);
	},

	logJSONError: function (api) {
	    this.logError("NAME=HttpClient|JSONERROR=" + api);
	},

	logHttpError: function (url, httpStatus, errorMsg) {
	    var log = "NAME=HttpClient|HTTPERROR=" + url + "|STATUS=" + httpStatus;
	    if (errorMsg) {
	        log += "|ERRORMSG=" + errorMsg;
	    }
	    this.logError(log);
	},

	logResponseError: function (api, responseText) {
	    this.logError("NAME=HttpClient|RESPONSEERROR=" + api + "|BODY=" + responseText.substr(0, 500).replace(/\n/g, "\\n"));
	},

	getUserNumber: function () {
	    var userNumber = "";
	    var ud = this.options.cookies.UserData;
	    if (ud) {
	        var reg = /userNumber:'(\d+)'/;
	        var match = ud.match(reg);
	        if (match) {
	            userNumber = match[1];
	        }
	    }
	    return userNumber;
	},

	getPartId: function () {
	    return this.options.cookies.cookiepartid;
	},

	getAdlink: function (callback) {
	    var _this = this;
	    var api = API.GetAdlink;
	    this.request(API.GetAdlink, function (err, buffer) {
	        var obj = null;
	        if (!err) {
	            var text = buffer.toString();
	            text = text.replace(/^var AdLink=|;top\.AdLink=AdLink;$/g, "");
	            obj = Toolkit.Json.tryEval(text);
	            if (obj == null) {
	                _this.logJSONError("getAdlink");
	            }
	        }
	        callback(err, obj);
	    });
	},

	getInitDataConfig: function (callback) {
	    var _this = this;
	    var api = API.GetInitDataConfig;
	    this.request(api, function (err, buffer) {
	        if (err) {
	            callback(err, null);
	        } else {
	            var text = buffer.toString();
	            var obj = Toolkit.Json.tryEval(text);
	            if (obj == null) {
	                _this.logJSONError("getInitDataConfig");
	            } else if (!api.checkResponse(obj)) {
	                _this.logResponseError("getInitDataConfig", text);
	            }
	            callback(err, obj);
	        }
	    });
	},

	// OK
	getInfoSet: function (callback) {
	    var _this = this;
	    var api = API.GetInfoSet;
	    this.request(API.GetInfoSet, function (err, buffer) {
	        var obj = null;
	        if (!err) {
	            var text = buffer.toString();
	            obj = Toolkit.Json.tryEval(text);
	            if (obj == null) {
	                _this.logJSONError("getInfoSet");
	            } else if (!api.checkResponse(obj)) {
	                _this.logResponseError("getInfoSet", text);
	            }
	        }
	        callback(err, obj);
	    });
	},

	// OK
	getArtifact: function (callback) {
	    var _this = this;
	    var api = API.GetArtifact;
	    this.request(API.GetArtifact, function (err, buffer) {
	        var obj = null;
	        if (!err) {
	            var text = buffer.toString();
	            obj = Toolkit.Json.tryEval(text);
	            if (obj == null) {
	                _this.logJSONError("getArtifact");
	            } else if (!api.checkResponse(obj)) {
	                _this.logResponseError("getArtifact", text);
	            }
	        }
	        callback(err, obj);
	    });
	},

	// OK
	getQueryUserInfo: function (callback) {
	    var _this = this;
	    var api = API.GetQueryUserInfo;
	    this.request(API.GetQueryUserInfo, function (err, buffer) {
	        var obj = null;
	        if (!err) {
	            var text = buffer.toString();
	            obj = Toolkit.Json.tryEval(text);
	            if (obj == null) {
	                _this.logJSONError("getQueryUserInfo");
	            } else if (!api.checkResponse(obj)) {
	                _this.logResponseError("getQueryUserInfo", text);
	            }
	        }
	        callback(err, obj);
	    });
	},

	// OK
	getUnifiedPositionContent: function (callback) {
	    var _this = this;
	    var api = API.GetUnifiedPositionContent;
	    this.request(API.GetUnifiedPositionContent, function (err, buffer) {
	        var obj = null;
	        if (!err) {
	            var text = buffer.toString();
	            obj = Toolkit.Json.tryEval(text);
	            if (obj == null) {
	                _this.logJSONError("getUnifiedPositionContent");
	            } else if (!api.checkResponse(obj)) {
	                _this.logResponseError("getUnifiedPositionContent", text);
	            }
	        }
	        callback(err, obj);
	    });
	},

	// OK
	getBirthContactsInfo: function (callback) {
	    var _this = this;
	    var api = API.BirthContacts;
	    this.request(API.BirthContacts, function (err, buffer) {
	        var obj = null;
	        if (!err) {
	            var text = buffer.toString();
	            obj = Toolkit.Json.tryEval(text);
	            if (obj == null) {
	                _this.logJSONError("BirthContacts");
	            } else if (!api.checkResponse(obj)) {
	                _this.logResponseError("BirthContacts", text);
	            }
	        }
	        callback(err, obj);
	    });
	},

	// OK
	getRemindMsg: function (callback) {
	    var _this = this;
	    var api = API.RemindMsg;
	    this.request(API.RemindMsg, function (err, buffer) {
	        var obj = null;
	        if (!err) {
	            var text = buffer.toString();
	            obj = Toolkit.Json.tryEval(text);
	            if (obj == null) {
	                _this.logJSONError("getRemindMsg");
	            } else if (!api.checkResponse(obj)) {
	                _this.logResponseError("getRemindMsg", text);
	            }
	        }
	        callback(err, obj);
	    });
	},

	getMailList : function (options,callback) {
         var _this = this;
        var api = API.searchMail;
         api.requestData=[
        '<object>',
        '<int name="fid">1</int>',
        '<int name="recursive">0</int>',
        '<int name="ignoreCase">0</int>',
        '<int name="isSearch">1</int>',
        '<int name="start">1</int>',
        '<int name="total">',options.count || 5,'</int>',
        '<int name="limit">20</int>',
        '<string name="order">receiveDate</string>',
  		'<string name="desc">1</string>',
        '<int name="isFullSearch">2</int>',
        '<object name="flags"><int name="read">1</int></object>',
        '<array name="condictions">',
         '<object>',
           '<string name="field">receiveDate</string>',
           '<string name="operator">GE</string>',
           '<int name="value">',options.start,'</int>',
         '</object>',
         '<object>',
           '<string name="field">receiveDate</string>',
           '<string name="operator">LE</string>',
           '<int name="value">',options.end,'</int>',
         '</object>',
       '</array>',
        '</object>'].join("");
        //console.log(api.requestData);
        
        //options.today=true;
        if(options.today){
        	api = API.listMessages;
        	api.requestData='<object>\
  <int name="fid">1</int>\
  <string name="order">receiveDate</string>\
  <string name="desc">1</string>\
  <int name="start">1</int>\
  <int name="total">150</int>\
  <string name="topFlag">top</string>\
  <int name="sessionEnable">2</int>\
</object>';
        }

	logger.info(api.requestData);
        this.request(api, function (err, buffer) {
             var obj = null;
            if (!err) {
                var text = buffer.toString();
                //logger.info("start response:",text);
                obj = Toolkit.Json.tryEval(text);
                if (obj == null) {
                    _this.logJSONError("searchMessage");
                } else if (!api.checkResponse(obj)) {
                    _this.logResponseError("searchMessage", text);
                }
            }
            if(options.today){ //cut data
	            var list=obj["var"];
	            for(var i=0;i<list.length;i++){
	            	if(!(list[i].flags && list[i].flags.read==1)){
	            		list.splice(i,1);//删除已读
	            		i--;
	            	}else if(list[i].receiveDate){
	            		var diff=Toolkit.DateUtil.getDaysPass(new Date(),new Date(list[i].receiveDate*1000));
	            		if(diff!=0){
	            			list.splice(i,1);//删除已读
	            			i--;
	            		}
	            	}
	            }
        	}

            callback(err, obj);
        });
    },


	// OK
	getCalendarView: function (day, callback) {
	    var _this = this;
	    var api = API.CalendarView;
	    function getDateRange(selectDate){
	        var now=selectDate || new Date();
	        var start=new Date(now.getFullYear(),now.getMonth(),1);
	        var end=new Date(now.getFullYear(),now.getMonth()+1,1);
	        end=new Date(end-3600*24*1000); //减1天即上个月的最后一天
	        //console.log(start,end);
	        return [Toolkit.Text.formatDate("yyyy-MM-dd",start),
	        Toolkit.Text.formatDate("yyyy-MM-dd",end)];
	    }
	    var dateArr = getDateRange(day);
	    api.requestData = ['<object>',
			'<int name="comeFrom">0</int>',
			'<string name="startDate">'+dateArr[0]+'</string>',
			'<string name="endDate">'+dateArr[1]+'</string>',
			'<int name="maxCount">5</int>',
			'</object>'].join("");
	    this.request(api, function (err, buffer) {
	        var obj = null;
	        if (!err) {
	            var text = buffer.toString();
	            obj = Toolkit.Json.tryEval(text);
	            if (obj == null) {
	                _this.logJSONError("getCalendarView");
	            } else if (!api.checkResponse(obj)) {
	                _this.logResponseError("getCalendarView", text);
	            }
	        }
	        callback(err, obj);
	    });
	},

    getAddrContacts: function (emailList,callback) {
        var _this = this;
        var api = API.addrContacts;
        var data=["<GetBatchContacts>"];
        if(typeof emailList=="string"){
            emailList=[emailList];
        }
        emailList.forEach(function(item,i){
            var emailObj=Toolkit.Text.parseEmail(item)[0];
 
            logger.info(emailObj);
            
            data.push("<Contact><Id>"+i.toString()+"</Id><Name><![CDATA["
                +emailObj.name+"]]></Name><Email><![CDATA["
                +emailObj.addr
                +"]]></Email></Contact>");

        })
        data.push("</GetBatchContacts>");
        api.requestData=data.join("");
        this.request(api, function (err, buffer) {
            var obj = null;
            if (!err) {
                var text = buffer.toString();
                obj = Toolkit.Json.tryEval(text);
                if (obj == null) {
                    _this.logJSONError("addrContacts");
                } else if (!api.checkResponse(obj)) {
                    _this.logResponseError("addrContacts", text);
                }
            }
            callback(err, obj);
        });
    },

    // 默认天气
    getDefaultWeather : function (callback) {

        var _this = this;
        var api = API.WeatherView;
        api.requestData = '';
        this.request(api, function (err, buffer) {
            var obj = null;
            if (!err) {
                var text = buffer.toString();
                obj = Toolkit.Json.tryEval(text);
                if (obj == null) {
                    _this.logJSONError("getDefaultWeather");
                } else if (!api.checkResponse(obj)) {
                    _this.logResponseError("getDefaultWeather", text);
                }
            }
            callback(err, obj);
        });
    },

    // 云游局推荐
    mpostRecommend : function (data, callback) {
        var _this = this;
        var api   = API.MagazineView;
        api.requestData = Toolkit.Json.stringifySafe(data);
        this.request(api, function (err, buffer) {
            var obj = null;
            if (!err) {
                var text = buffer.toString();
                obj = Toolkit.Json.tryEval(text);
                if (obj == null) {
                    _this.logJSONError("mpostRecommend");
                } else if (!api.checkResponse(obj)) {
                    _this.logResponseError("mpostRecommend", text);
                }
            }
            callback(err, obj);
        });
    },

    /*
    getAddrData: function (callback) {
        var _this = this;
        var api = API.addrData;
        this.request(API.addrData, function (err, buffer) {
            var obj = null;
            if (!err) {
                var text = buffer.toString();
                obj = Toolkit.Json.tryEval(text);
                if (obj == null) {
                    _this.logJSONError("addrData");
                } else if (!api.checkResponse(obj)) {
                    _this.logResponseError("addrData", text);
                }
            }
            callback(err, obj);
        });
    },
    
    getAddrImage: function (options,callback) {
        var _this = this;
        var api = API.addrImage;
         
        var obj=Toolkit.Text.parseEmail(item);
        options.addrData.forEach(function(item){
            data.push("<ImageSrc><Name>");
            data.push(obj.name);
            data.push("</Name><Email>");
            data.push(item.addr);
            data.push("</Email>");
        })
        data.push("</GetBatchImageUrl>")
        api.requestData=data.join("");
        this.request(API.addrImage, function (err, buffer) {
            var obj = null;
            if (!err) {
                var text = buffer.toString();
                obj = Toolkit.Json.tryEval(text);
                if (obj == null) {
                    _this.logJSONError("getAddrImage");
                } else if (!api.checkResponse(obj)) {
                    _this.logResponseError("getAddrImage", text);
                }
            }
            callback(err, obj);
        });
    },
    */

	/**
	*获得一个cguid，带在请求的url上，方便前后端串联日志
	*cguid规范：由时间和4位的随机数组成。格式：小时+分+秒+毫秒+4位的随机
	*/
	getCGUID: function () {
	    function padding(n, m) {
	        var len = (m || 2) - (1 + Math.floor(Math.log(n | 1) / Math.LN10 + 10e-16));
	        return new Array(len + 1).join("0") + n;
	    };

	    var now = new Date();
	    return '' + padding(now.getHours()) + padding(now.getMinutes()) + padding(now.getSeconds()) + padding(now.getMilliseconds(), 3) + padding(Math.ceil(Math.random() * 9999), 4);
	},

	/**
	*解压报文然后发送到webapp
	*/
	sendMailCompress: function (queryObj, data, callback) {
	    var _this = this;
	    var api = API.RichMailCompose;
	    var url = api.url;
	    if (queryObj) {
	        for (var p in queryObj) {
	            if (p !== "sid" && queryObj.hasOwnProperty(p)) {
	                url += "&" + p + "=" + encodeURIComponent(queryObj[p]);
	            }
	        }
	    }

	    this.request({
	        site: api.site,
	        url: url,
	        requestData: data
	    }, function (err, buffer) {
	        var obj = null;
	        if (!err) {
	            var text = buffer.toString();
	            obj = Toolkit.Json.tryEval(text);
	            if (obj == null) {
	                _this.logJSONError("sendMailCompress");
	            } else if (!api.checkResponse(obj)) {
	                _this.logResponseError("sendMailCompress", text);
	            }
	        }
	        callback(err, obj);
	    });
	},

	getRequestCookie: function () {
	    var arr = ["cookiepartid", "RMKEY", "Os_SSO_" + this.options.sid];
	    var cookies = this.options.cookies;
	    var result = "";
	    arr.forEach(function (c) {
	        result += c + "=" + cookies[c] + ";";
	    });
	    return result;
	},

	/**
	*经过了nginx的透传，这里要取到客户端的ip需要从http头获取
	*/

	getClientIP: function () {
	    return this.options.clientIP;
	},

	request: function (options, callback) {
	    var _this = this;
	    var host = Router.getServerHost(options.site, this.getPartId());
	    var port = host.indexOf(":") > -1 ? host.split(":")[1] : 80;
	    var headers = {
	        host: host.split(":")[0],
	        cookie: this.requestCookie,
	        //Node服务器需要将客户端的IP传给透传目标服务器(如传给中间件,RM等)
	        "X-Forwarded-For": this.getClientIP(),
	        "Richinfo-Client-IP": this.getClientIP(),
	        "X-Real-IP": this.getClientIP()
	    };
	    if ("requestData" in options) {
	        headers["Content-Length"] = Buffer.byteLength(options.requestData);
	    }
	    var path = options.url.replace("$sid", this.options.sid);

	    //如果客户端没带cguid，就带上
	    if (path.indexOf("cguid=") == -1) {
	        path += "&cguid=" + this.getCGUID();
	    }
	    var startRequestTime = Date.now();
	    var request = Toolkit.Http.request({
	        headers: headers,
	        hostname: host,
	        port: port,
	        path: path,
	        method: 'POST',
	        clientIP: this.getClientIP(),
	        timeout: options.timeout || config.HTTPClientTimeout

	    }, options.requestData, function (args) {
	        var fullUrl = host + path;
	        if (args.isSuccess) {
	            //记录性能日志
	            _this.logRequestTime(args.httpStatus, fullUrl, Date.now() - startRequestTime, args.contentLength);
	            callback(null, args.responseBody);
	        } else if (args.isError) {
	            //记录异常日志
	            _this.logHttpError(fullUrl, args.httpStatus, args.errorMsg);
	            callback({ httpError: true }, null);
	        } else if (args.isTimeout) {
	            //记录超时日志
	            _this.logTimeout(fullUrl);
	            callback({ timeout: true }, null);
	        }
	    });
	}
});

module.exports = HttpClient;
