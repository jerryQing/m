///<reference path="../tslib/node.d.ts" />
///<reference path="../tslib/express.d.ts" />
var HttpClient = require("../httpClient/httpClient");

var Router = require("../router/router");
var Toolkit = require("../toolkit/index");
var HomeModel=require("./home_model");
var UserModel = require("../scripts/userinfo_model");
var RemindsModel = require("../scripts/reminds_model");
var path=require("path");
var fs=require("fs");
var ejs = require("ejs");

var Logger = require("../logger/logger");

var logger = Logger.getLogger("app");

/*
// todo 
// 最好可以灵活适配选择前后端渲染，共用数据处理脚本。
// 前端渲染：读取初始化脚本并输出。
// 后端渲染：require数据处理脚本，获取数据
// 模板始终渲染数据，这需要提供默认的数据

// todo
// ejs缓存问题（应该是对多实例无效？）

两个规范：
1. 多个接口的数据处理依赖同一个模板的情况，需要在各自的renderPart调用中复用同一个html参数
2. 单个接口用以渲染多个模板的情况，在接口数据回调处理中重复调用多个renderPart即可（使用不同的key对应不同的视图）
*/

var HomePage = function(options){
        this.options = options;

        this.model = new HomeModel();
        this.request = options.request;
        this.response = options.response;
        var res = this.response;
        var self = this;
        //所有接口列表，用于checkAllReady函数检测所有接口加载成功后结束http请求
        var interfaceList = {
            rmInitDataConfig: null,
            mwInfoSet: null,
            addrQueryUserInfo: null,
            mwUnifiedPositionContent: null,
            birthContactsInfo: null,
            RemindMsg:null,
            CalendarView:null,
            WeatherView:null,
            MagazineView:null,
            //timeout:null,
            YesterdayMail:null,
            MailList:null
        };

        var pendingTemplate = Object.create(null);

        function checkAllReady(endCallback){
            for(elem in interfaceList){
                if(!interfaceList[elem]){
                    return false;
                }
            }
            checkAllReady = function(){}
            endCallback();
        }
        
        logger.info("access home");
        
        this.getSid = function () {
            return this.request.query.sid;
        };

        this.getProtocol = function () {
            return this.request.protocol+":";
            /*
            var protocol = this.request.query.Protocol;
            protocol = decodeURIComponent(protocol);
            protocol = this.encode(protocol);
            protocol = (protocol == 'undefined') ? 'http:' : protocol;
            return protocol;*/
        };

        this.encode = function (str) {
            if (typeof str != "string") return "";
            str = str.replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/\"/g, "&quot;")
                .replace(/\'/g, "&#39;")
                .replace(/ /g, "&nbsp;");
            return str;
        };
        
        this.getClientObj = function(){
	        var client = new HttpClient({
                cookies: this.request.cookies,
                sid: this.getSid(),
                clientIP: this.request.header('X-Forwarded-For') || this.request.ip
            });
            return client;
        }

		// 传输（接口）数据（并调用）
        this.renderData = function(key, data/*, needMore*/, callback){
            //if(!needMore) interfaceList[key] = true;
            //interfaceList[key] = true;
            console.log("renderData: " + key);
            logger.info("renderData: ", new Date());

			if(data) {
	            data = Toolkit.Json.stringifySafe(data);
            }
            var script = Toolkit.Text.format('\r\n<script>\r\n(function(){\r\n	var {key} = {dataStr};\r\n	render("{key}", {key});\r\n})();\r\n</script>\r\n', {key: key, dataStr: data});

            res.write(script);
            (typeof callback === "function") && callback(key);
        };

		// 传输HTML片段
        this.prepareHTML = function(conf, callback){

			var file = conf.template;

            logger.info("prepareHTML:", new Date());

			// 当模板关联多个接口的数据时，模板只渲染一次
			// 并保证所有依赖该模板的接口回调处理
            if(pendingTemplate[file]) {
	            if(pendingTemplate[file].compeleted) {
		           (typeof callback === "function") && callback();
	            } else {
		            pendingTemplate[file].callbacks.push(callback);
	            }
	            return;
            }

            pendingTemplate[file] = {compeleted: 0, callbacks: [callback]};

	        fs.readFile(path.resolve(__dirname, "../views/", file), {encoding: "utf-8"}, function(err, template){
                var html;

                if(err){
	                console.log("err read file " + file);
	                logger.error(err);
                }

                html = ejs.render(template, conf.data || {});

            	res.write(html);

				pendingTemplate[file].callbacks.forEach(function(callback){
					(typeof callback === "function") && callback();
				});
				pendingTemplate[file].compeleted = 1;
				pendingTemplate[file].callbacks = [];	// 调用后清空引用
            });
        };

		// 传输脚本（文件）
        this.prepareScript = function(file, callback) {
            // console.log(process.cwd()); // todo?

	        fs.readFile(path.resolve(__dirname, "../scripts/", file), {encoding: "utf-8"}, function(err, data){
                if(err){
	                logger.error(err);
                }
                res.write("\r\n<script>\r\n" + data + "\r\n</script>\r\n");
                (typeof callback === "function") && callback();
            });
        };

		/*
		* bigpipe统一渲染入口
		* @part 渲染配置参数，包含如下配置项：
		*	- key 接口返回数据将赋与的变量名
		*	- data 接口返回数据对象
		*	- script 将返回给前端的渲染脚本文件名（不包含路径，限定在scripts目录下）
		*	- html {
				template,	将返回给前端的渲染模板文件名（不包含路径，限定在views目录下）
				data		传递给模板引擎的渲染数据
			}
		* @callback 当前子数据输出完成后的回调
		*/
        this.renderPart = function(part, callback) {
	        var progress = 0;

	        function checkComplete(){
		        progress++;
		        if(progress == 3) {
			        // 模板和脚本先输出后，再输出调用入口代码
			        self.renderData(part.key, part.data, function(key){
						// todo 异常处理：出错无法end的情况
						// 放某些位置可能不安全，接口响应成功但数据解析出错时，可能执行不到
						interfaceList[key] = true;
						(typeof callback === "function") && callback();
						console.log(JSON.stringify(interfaceList, null, "\t"));
						checkAllReady(function(){ //请求全部结束
							console.log("------------------END");
							res.end("</body></html>"); //结束http响应
						});
			        });
		        }
	        }
	        
	        if(part.script) {
	        	this.prepareScript(part.script, checkComplete);
	        } else {
		        progress++;
	        }

	        if(part.html) {
	        	this.prepareHTML(part.html, checkComplete);
        	} else {
	        	progress++;
        	}
        	
        	checkComplete();
        };
        
        // 并发查询所有接口
        this.fetch = function(callback){
	        
            var client = this.getClientObj();

            var user_model = new UserModel();
            var reminds_model = new RemindsModel();
            
            /*setTimeout(function(){
	            self.renderPart({
                    key: "timeout",
                    data: "timeout"
	            });
	        }, 5000);*/
            console.log("------------------start--------------");

            var getMagazine = function(data){
	            var userInfo = data && data.UserInfo && data.UserInfo[0] || {};
                var options = {
                    userNumber : userInfo.un,
                    uin   : userInfo.UIN,
                    size : 3
                };
                client.mpostRecommend(options, function (err, resData) {
                    self.renderPart({
                        key: "MagazineView",
                        data: resData,
                        script: null
                    });
                });
            }//getMagazine

            client.getInitDataConfig(function (err, resData) {
                self.renderPart({
	                key: "rmInitDataConfig",
	                data: resData,
	                html: user_model.getTemplateConf(self),
	                script: "initDataConfig.js"
	            });
            });
            client.getInfoSet(function (err, resData) {
                self.renderPart({
	                key: "mwInfoSet",
	                data: resData,
	                html: user_model.getTemplateConf(self),
	                script: "userinfo.js"
	            });
            });
            client.getQueryUserInfo(function (err, resData) {
                self.renderPart({
	                key: "addrQueryUserInfo",
	                data: resData,
	                html: user_model.getTemplateConf(self),
	                script: "initAddrQueryUserInfo.js"
	            });

				// 同一接口数据继续渲染其它视图
	            /*
	            self.renderPart({
		            key: "xxxxx",
		            data: resData
	            });
	            */
                getMagazine(resData);
            });
            client.getUnifiedPositionContent(function (err, resData) {
                self.renderPart({
	                key: "mwUnifiedPositionContent",
	                data: resData,
	                script: "initunifiedpositioncontent.js"
	            });
            });
            client.getRemindMsg(function (err, resData) {

				// 构造数据
	            //resData = { "code":"S_OK", "summary":"操作成功", "var":[ { "seqNO":"9", "msgType":"addr_mkpn", "msgContent":"45", "createTime":"2015-03-04 18:55:09", "expireTime":"2015-04-08 10:14:13" } , { "seqNO":"29", "msgType":"calendar_cen", "msgContent":"count=0", "createTime":"2015-03-27 18:13:36", "expireTime":"2015-03-28 23:59:59" } , { "seqNO":"30", "msgType":"calendar_cain", "msgContent":"15", "createTime":"2015-03-27 00:54:18", "expireTime":"2015-04-06 23:59:59" } , { "seqNO":"31", "msgType":"cpo_cponm", "msgContent":"1", "createTime":"2015-03-27 19:27:53", "expireTime":"2015-04-26 19:27:53" } , { "seqNO":"56", "msgType":"cpo_cpopu", "msgContent":"2224", "createTime":"2015-03-27 19:27:53", "expireTime":"2015-04-26 19:27:53" } , { "seqNO":"1498", "msgType":"calendar_invite", "msgContent":"count=12|id=253811&name=二货&activity=大在在大&date=2015-03-27|id=253811&name=二货&activity=大在在大&date=2015-03-26|id=253811&name=[昨天]&activity=在大&date=2015-03-26", "createTime":"2015-03-27 18:27:16", "expireTime":"2015-04-06 23:59:59" } , { "seqNO":"1506", "msgType":"calendar_share", "msgContent":"count=3|id=253811&name=[昨天]&activity=在大&date=2015-03-26", "createTime":"2015-03-27 09:45:43", "expireTime":"2015-04-06 23:59:59" } , { "seqNO":"1510", "msgType":"calendar_task", "msgContent":"count=2|mid=010300046331186a00000016&name=测试&date=2015-03-27|mid=0103000462eac7e400000005&name=sql查询语句练习.docx&date=2015-03-27", "createTime":"2015-03-27 17:33:21", "expireTime":"2015-03-28 23:59:59" } ] };

                self.renderPart({
	                key: "RemindMsg",
	                data: reminds_model.transformData(resData["var"]),
	                html: {
		                template: "reminditem.ejs"
	                },
	                script: "reminds.js"
	            }, function(){
                    client.getBirthContactsInfo(function (err, resData) {
                        self.renderPart({
                            key: "birthContactsInfo",
                            data: resData
                        });
                    });
	            });
            });
            client.getCalendarView(null,function (err, resData) {
                self.renderPart({
	                key: "CalendarView",
	                data: resData,
	                //data: {"code":"S_OK","summary":"", "var":{}},
	                script: null
	            });
            });
            client.getDefaultWeather(function (err, resData) {
                self.renderPart({
                    key: "WeatherView",
                    data: resData,
                    script: null
                });
            });

            var now=new Date();
            var start=new Date(now.getFullYear(),now.getMonth(),now.getDate());
            var end=now;
            
            client.getMailList({today:true,start: start/1000, end: end/1000,count:10}, function (err, data) {
                
                self.model.handMailData(self,data["var"],function(renderData){
                    self.renderPart({
                        key: "MailList",
                        html: {
                            template: "home_maillist.ejs",
                            data: renderData
                        }
                    });
                });
                
                self.getYesterdayMailCount(client);
            });
        }

        this.getYesterdayMailCount = function(client, cb){
            var now=new Date();
        	var end = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        	var start = new Date(end - 24*60*60*1000);	//昨天
            client.getMailList({start: start/1000, end: end/1000,count:1}, function (err, data) {
                 self.renderPart({
                    key: "YesterdayMail",
                    data: (data["stats"] && data["stats"].messageCount) || 0
                });
                cb && cb();
            });
        },

        this.render = function(){
            //res.set('Cache-Control', 'private');
            logger.info("render....")
            res.writeHead(200, {
                'Content-Type' : 'text/html'
               // ,'Transfer-Encoding' : 'chunked'
            });
            
            if(this.request.query["type"]=="maillist"){
                this.refreshMailList(this.request.query["date"]);
                return ;
            }
            else if(this.request.query["type"]=="remindlist"){
                this.refreshRemindList(this.request.query["date"]);
                return ;
            }

            this.renderPart({
	            key: "Home",
	            html: {
		            template: "home.ejs",
					data: {
                        data: {a:1},
                        sid: this.getSid(),
                        protocol: this.getProtocol()
                    }
	            }
            }, function(){
	            //self.prepareScript("welcome_v4.html.pack.js", function(){
	            self.fetch();
            	//});
            });
        }

        this.refreshMailList=function(date){
            //var date= this.request.query["date"]||Toolkit.Text.formatDate("yyyy-MM-dd",new Date());
            //logger.info("-------------refreshMailList")
            var client = this.getClientObj();
            var now=new Date();
            var timestamp = Date.parse(date);
            if(date){
                now=new Date(timestamp);
            }
            

            var start=new Date(now.getFullYear(),now.getMonth(),now.getDate());
            var end=new Date(now.getFullYear(),now.getMonth(),now.getDate(),23,59);
            logger.info("refresh start:end-----------",start,end);
            client.getMailList({start: Math.ceil(start/1000), end: (end/1000),count:10}, function (err, data) {
                self.model.handMailData(self,data["var"],function(renderData){
					self.renderPart({
						key: "MailList",
	                    html: {
	                        template: "home_maillist.ejs",
	                        data: renderData
	                    }
					}, function(){
						var diff = +new Date - timestamp;
						console.log(diff, timestamp);
						if(diff < 24*3600*1000) {	// 请求今天的邮件
							self.getYesterdayMailCount(client, function(){
								res.end();
							});
						} else {
							res.end();
						}
	                });
                });
            });
        }

        this.refreshRemindList = function(date){
            
            var client = this.getClientObj();
            
            client.getRemindMsg(function (err, resData) {
	            //resData = { "code":"S_OK", "summary":"操作成功", "var":[ { "seqNO":"9", "msgType":"addr_mkpn", "msgContent":"45", "createTime":"2015-03-04 18:55:09", "expireTime":"2015-04-08 10:14:13" } , { "seqNO":"29", "msgType":"calendar_cen", "msgContent":"count=0", "createTime":"2015-03-27 18:13:36", "expireTime":"2015-03-28 23:59:59" } , { "seqNO":"30", "msgType":"calendar_cain", "msgContent":"15", "createTime":"2015-03-27 00:54:18", "expireTime":"2015-04-06 23:59:59" } , { "seqNO":"31", "msgType":"cpo_cponm", "msgContent":"1", "createTime":"2015-03-27 19:27:53", "expireTime":"2015-04-26 19:27:53" } , { "seqNO":"56", "msgType":"cpo_cpopu", "msgContent":"2224", "createTime":"2015-03-27 19:27:53", "expireTime":"2015-04-26 19:27:53" } , { "seqNO":"1498", "msgType":"calendar_invite", "msgContent":"count=12|id=253811&name=二货&activity=大在在大&date=2015-03-27|id=253811&name=二货&activity=大在在大&date=2015-03-26|id=253811&name=[昨天]&activity=在大&date=2015-03-26", "createTime":"2015-03-27 18:27:16", "expireTime":"2015-04-06 23:59:59" } , { "seqNO":"1506", "msgType":"calendar_share", "msgContent":"count=3|id=253811&name=[昨天]&activity=在大&date=2015-03-26", "createTime":"2015-03-27 09:45:43", "expireTime":"2015-04-06 23:59:59" } , { "seqNO":"1510", "msgType":"calendar_task", "msgContent":"count=2|mid=010300046331186a00000016&name=测试&date=2015-03-27|mid=0103000462eac7e400000005&name=sql查询语句练习.docx&date=2015-03-27", "createTime":"2015-03-27 17:33:21", "expireTime":"2015-03-28 23:59:59" } ] };
				//console.log(JSON.stringify(resData["var"]));
	            //console.log(JSON.stringify(reminds_model.transformData(resData["var"])), null, "\t");
                self.renderPart({
	                key: "RemindMsg",
	                data: (new RemindsModel()).transformData(resData["var"], {"date": date}),
	            }, function(){
		            res.end();
	            });
            });
        }
};

exports.HomeModel=HomeModel;
exports.HomePage = HomePage;
