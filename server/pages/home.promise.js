///<reference path="../tslib/node.d.ts" />
///<reference path="../tslib/express.d.ts" />
var HttpClient = require("../httpClient/httpClient");

var Router = require("../router/router");
var Toolkit = require("../toolkit/index");
var HomeModel=require("./home_model");
var UserModel = require("../scripts/userinfo_model");
var path=require("path");
var fs=require("fs");
var ejs = require("ejs");
var Promise = require("../toolkit/promise").Promise;

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
            var protocol = this.request.query.Protocol;
            protocol = decodeURIComponent(protocol);
            protocol = this.encode(protocol);
            protocol = (protocol == 'undefined') ? 'http:' : protocol;
            return protocol;
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
                res.write("\r\n<script>" + data + "</script>\r\n");
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
				//if(!part.html.id) {
				//	part.html.id = part.key;
				//}
	        	this.prepareHTML(part.html, checkComplete);
        	} else {
	        	progress++;
        	}
        	
        	checkComplete();
        };
        
        // 并发查询所有接口
        this.fetch = function(callback){

            var client = new HttpClient({
                cookies: this.request.cookies,
                sid: this.getSid(),
                clientIP: this.request.header('X-Forwarded-For') || this.request.ip
            });

            var user_model = new UserModel();
            
            /*setTimeout(function(){
	            self.renderPart({
                    key: "timeout",
                    data: "timeout"
	            });
	        }, 5000);*/
            console.log("------------------start--------------");

            var getMagazine = function(data){
                var options = {
                    userNumber : data.UserInfo[0].un,
                    uin   : data.UserInfo[0].UIN,
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

	        var promise = new Promise();

	        promise.then(function(){var promise = new Promise();
            client.getInitDataConfig(function (err, resData) {
                self.renderPart({
	                key: "rmInitDataConfig",
	                data: resData,
	                html: user_model.getTemplateConf(self),
	                script: "initDataConfig.js"
	            }, function(){
		            promise.resolve();
	            });
            });
            return promise;
            }).then(function(){var promise = new Promise();
            client.getInfoSet(function (err, resData) {
                self.renderPart({
	                key: "mwInfoSet",
	                data: resData,
	                html: user_model.getTemplateConf(self),
	                script: "userinfo.js"
	            }, function(){
		            promise.resolve();
	            });
            });
            return promise;
            }).then(function(){var promise = new Promise();
            client.getQueryUserInfo(function (err, resData) {
                self.renderPart({
	                key: "addrQueryUserInfo",
	                data: resData,
	                html: user_model.getTemplateConf(self),
	                /*html: {
		                //id: "userinfoTpl",	// 多个接口引用同一模板,id须保持一致，完全可以将script标签置于模板中，省去许多麻烦。。
		                template: "userinfo.ejs"
		                ,data: {greetingString:"", sid:"", userImageUrl:"", userName:""}
	                },*/
	                script: "initAddrQueryUserInfo.js"
	            }, function(){
		            promise.resolve();
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
            return promise;
            }).then(function(){var promise = new Promise();
            client.getUnifiedPositionContent(function (err, resData) {
                self.renderPart({
	                key: "mwUnifiedPositionContent",
	                data: resData,
	                script: null
	            }, function(){
		            promise.resolve();
	            });
            });
            return promise;
            }).then(function(){var promise = new Promise();
            client.getBirthContactsInfo(function (err, resData) {
                self.renderPart({
	                key: "birthContactsInfo",
	                data: resData,
	                script: null
	            }, function(){
		            promise.resolve();
	            });
            });
            return promise;
            }).then(function(){var promise = new Promise();
            client.getRemindMsg(function (err, resData) {

				// 构造数据
	            resData = [
	            	{type:1, text: '<li class="hover" title="“2015年1月139邮箱2015年1月139邮箱2015年1月139邮箱2015年1月139邮箱“邮件今日待处理">“<strong>2015年1月139邮箱..</strong>”邮件今日待处理<span class="mailListConBox_info_ok"><a href="#">标记完成</a><a href="#">取消任务</a></span></li><li>“<strong>12月15日会议邀请</strong>”邮件今日待处理</li><li>“<strong>12月15日会议邀请</strong>”邮件今日待处理</li><li>“<strong>12月15日会议邀请</strong>”邮件今日待处理</li>'},
	            	{type:2, text: '<li class="hover">今天“<strong>赛龙舟</strong>”活动开始<span class="mailListConBox_info_ok"><a href="#">忽略</a></span></li><li>11:00“<strong>公司旅游</strong>”活动开始</li><li>16:00“<strong>看电影</strong>”活动开始</li>'},
	            	{type:3, text: '<li>李刚 邀请您参加“ <strong>朋友聚会</strong>”活动</li><li class="hover">蔡冠冕 邀请您参加“<strong>部门周会</strong>”会议<span class="mailListConBox_info_ok"><a href="#">接受</a><a href="#">拒绝</a></span></li><li>胡老板 邀请您参加“<strong>爬山</strong>”活动</li>'},
	            	{type:4, text: '<li>刘志刚 分享给您“ <strong>亚冠比赛</strong>”日历</li>'},
	            	{type:5, text: '<li>李小康、蔡爱明、胡志军等 <strong class="orange">5个</strong> 今日生<br />日，快送上生日祝福吧！</li>'},
	            	{type:6, text: '<li>您的报刊今天更新了 <strong class="orange">12篇</strong> 文章</li>'},
	            	{type:7, text: '<li>毕业照.jpg、年度总结.doc、阿里金卡. <br />psd等<strong class="orange">5人</strong>文件即将到期</li>'}
	            ];
	            
                self.renderPart({
	                key: "RemindMsg",
	                data: resData,
	                html: {
		                template: "reminditem.ejs"
	                },
	                script: "reminds.js"
	            }, function(){
		            promise.resolve();
	            });
            });
            return promise;
            }).then(function(){var promise = new Promise();
            client.getCalendarView(null,function (err, resData) {
                self.renderPart({
	                key: "CalendarView",
	                data: resData,
	                script: null
	            }, function(){
		            promise.resolve();
	            });
            });
            return promise;
            }).then(function(){//var promise = new Promise();
            client.getDefaultWeather(function (err, resData) {
                self.renderPart({
                    key: "WeatherView",
                    data: resData,
                    script: null
                }, function(){
		            //promise.resolve();
	            });
            });
            //return promise;
            });
            promise.resolve();

            var now=new Date();
            var start=new Date(now.getFullYear(),now.getMonth(),now.getDate());
            var end=now;
            
            client.getMailList({start: start/1000, end: end/1000}, function (err, data) {
                
                self.model.handMailData(self,data["var"],function(renderData){

                    self.renderPart({
                    key: "MailList",
                    html: {
                        template: "home_maillist.ejs",
                        data: renderData
                    }
                });
                });    

                
            });
	       
        }

        this.render = function(){
            //res.set('Cache-Control', 'private');

            res.writeHead(200, {
                'Content-Type' : 'text/html'
               // ,'Transfer-Encoding' : 'chunked'
            });
            
            this.renderPart({
	            key: "Home",
	            html: {
		            template: "home.ejs",
					data: {
                        data: {a:1},
                        sid: this.getSid(),
                        protocol: this.getProtocol()
                    }
	            },
	            data: "",
	            script: ""
            });

            this.fetch();
        }
};

exports.HomeModel=HomeModel;
exports.HomePage = HomePage;
