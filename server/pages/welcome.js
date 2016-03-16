///<reference path="../tslib/node.d.ts" />
///<reference path="../tslib/express.d.ts" />
var HttpClient = require("../httpClient/httpClient");

var Router = require("../router/router");
var Toolkit = require("../toolkit/index");


var WelcomeModel = (function () {
    function WelcomeModel() {
    }
    //邮箱已使用容量/总容量
    WelcomeModel.prototype.getMessageSize = function (data) {
        var messageInfo = data.var.messageInfo;
        var limitSize = messageInfo.limitMessageSize || 0;
        var usedSize = messageInfo.messageSize || 0;
        var scale = 1024;
        return {
            limitSize: (!limitSize ? 0 : parseInt(limitSize + "")) * scale,
            usedSize: (!usedSize ? 0 : parseInt(usedSize + "")) * scale
        };
    };
    WelcomeModel.prototype.formatText = function (templateStr, obj) {
        var reg = /\{([\w]+)\}/g;
        return templateStr.replace(reg, function ($0, $1) {
            var value = obj[$1];
            if (value !== undefined) {
                return value;
            } else {
                return "";
            }
        });
    };
    WelcomeModel.prototype.getFileSizeText = function (fileSize, options) {
        var unit = "B";
        if (!options) {
            options = {};
        }
        if (options.byteChar) {
            unit = options.byteChar; //用"字节"或者"Bytes"替代z最小单位"B"
            if (options.maxUnit == "B")
                options.maxUnit = unit;
        }
        var maxUnit = options.maxUnit || "G";
        if (unit != maxUnit && fileSize >= 1024) {
            unit = "K";
            fileSize = fileSize / 1024;
            if (unit != maxUnit && fileSize >= 1024) {
                unit = "M";
                fileSize = fileSize / 1024;

                //debugger
                if (unit != maxUnit && fileSize >= 1024) {
                    unit = "G";
                    fileSize = fileSize / 1024;
                }
            }
            fileSize = Math.ceil(fileSize * 100) / 100;
        }
        if (options.comma) {
            var reg = /(\d)(\d{3})($|\.)/;
            fileSize = fileSize.toString();
            while (reg.test(fileSize)) {
                fileSize = fileSize.replace(reg, "$1,$2$3");
            }
        }
        return fileSize + unit;
    };

    /**
    *未读邮件数量
    */
    WelcomeModel.prototype.getUnreadMailCount = function (data) {
        var unread = -1;
        try  {
            unread = data.var.messageInfo.unreadMessageCount;
        } catch (e) {
        }
        return unread;
    };

    WelcomeModel.prototype.getLastLoginDate = function (data) {
        var date = "";
        try  {
            date = data.var.userMainData.lastLoginDate;
        } catch (e) {
        }
        return date.slice(5,-3);
    };

    WelcomeModel.prototype.getUserIntegral = function (data) {
        var integral = {
            levelInt: "",
            integralLevel: "",
            integral: ""
        };
        try  {
            integral = data.var.userMainData.mainUserIntegral;
        } catch (e) {
        }
        return integral;
    };

    /**
    *获得用户头像
    */
    WelcomeModel.prototype.getUserImageUrl = function (data, sid, partId, protocol) {
        var headUrl = "/m2012/images/ad/face.jpg";
        try  {
            var info = data.UserInfo[0];
            var imgUrl = info.b8;
            if (imgUrl) {
	            if(/^https?:\/\//i.test(imgUrl)) {
		            headUrl = imgUrl;
                } else if(!/[<>]/.test(imgUrl)) {
                    headUrl = "http://" + this.getResourceDomain(partId) + imgUrl;
                }
            }
        } catch (e) {
        }
        if(protocol == "https:"){
            headUrl = headUrl.replace(/http:\/\/(image0|images).139cm.com/,"https://appmail3.mail.10086.cn/images_139cm");
        }
        return headUrl;
    };

    /**
    *获得用户昵称
    */
    WelcomeModel.prototype.getUserName = function (data) {
        var name = "";
        try  {
            var trueName = data.var.userAttrs.trueName;
            if (trueName) {
                name = trueName;
            } else {
                name = data.var.userAttrs.uid.split("@")[0];
            }
        } catch (e) {
        }
        return name;
    };

    WelcomeModel.prototype.getGreetingString = function () {
        var date = new Date();
        var hour = date.getHours();
        // var greetings = {
        //     "0": ["凡事只要持之以恒，定有回报｡", "还在忙碌的你，辛苦了｡", "乐观面对压力和挑战，你能行!", "生命因磨炼而美丽｡"],
        //     "1": ["每天叫醒自己的不是闹钟，而是梦想｡", "早晨的阳光，和今天一样充满希望｡", "新的一天，全力以赴地去奋斗吧!", "给胃一点营养，才能活力百倍｡"],
        //     "2": ["梦想还是要有的，万一实现了呢?", "不忘初心，方得始终｡", "抬眼望窗外，世界很大，风景很美｡", "有舍才有得，不舍则不得｡", "窗外鸟语花香，内心阳光明媚｡"],
        //     "3": ["能支配灵魂的，是自己的内心｡", "宝剑锋从磨砺出，梅花香自苦寒来｡", "人生适当健忘，难得糊涂｡", "松一松紧张的发条吧!"],
        //     "4": ["中午休息一下，精力更充沛｡", "喜欢就会放肆，但爱就是克制｡", "倦了听点歌，让心情换个频道｡", "自然简单，乐观积极面对一切｡"],
        //     "5": ["你可以输，但你绝不能放弃｡", "看看窗外，稍作休息｡", "倘若只是喜欢，何必夸张成爱｡", "要么你去驾驭压力，要么压力驾驭你｡", "万法相互缘起，世事不必强求｡"],
        //     "6": ["当断不断，反受其乱｡", "再忙也别忘了享用晚餐｡", "家人的等候，是夜晚不变的牵挂｡", "一念放下，万般自在｡"],
        //     "7": ["夜已深，正在奋斗的你早些休息｡", "往好处看，往大处想，往细处察，往深处解｡", "还在忙碌的你，辛苦了｡", "乐观的心态助你更有效率｡"]
        // };
        var greetings = {
            "0": [
                    "天道酬勤，定有回报｡", 
                    "张弛有道，一切方得长远｡", 
                    "乐观面对压力和挑战，你能行!", 
                    "新春好运到，139邮箱祝你吉星高照｡",
                    "调整好自己，迎接新的一天｡"
                ],
            "1": [
                    "每天给自己一个小期许，日进一步｡", 
                    "早晨时光贵如金，寸金难买寸光阴｡", 
                    "清晨空气最醒神，为梦想加油吧!", 
                    "新春好运到，139邮箱祝你吉星高照｡",
                    "享一份早餐，得健康好心情｡"
                ],
            "2": [
                    "天行健，君子以自强不息｡", 
                    "答应自己，会向着一切美好前行｡", 
                    "平常心让未来到来，让过去过去｡", 
                    "非学无以广才，非志无以成学｡", 
                    "新春好运到，139邮箱祝你吉星高照｡",
                    "梦想还是要有的，万一实现了呢?"
                ],
            "3": [
                    "不能改变天气，但你可以左右心情｡", 
                    "常怀感恩，总会有不期而遇的温暖｡", 
                    "每一种创伤，都是一种成熟｡", 
                    "新春好运到，139邮箱祝你吉星高照｡",
                    "窗外远眺，让眼睛休息一下吧!"
                ],
            "4": [
                    "累了倦了，听点歌来提提神｡", 
                    "万法相互缘起，世事不必强求｡", 
                    "种如是因，收如是果，一切唯心造｡",
                    "新春好运到，139邮箱祝你吉星高照｡", 
                    "中午休息一下，精力更充沛｡"
                ],
            "5": [
                    "再忙碌的工作，记得偶尔放松一下｡", 
                    "适当放下但不放弃，是智慧｡", 
                    "你可以输，但你绝不能放弃｡", 
                    "不开心时请看看窗外，天地高阔｡", 
                    "新春好运到，139邮箱祝你吉星高照｡",
                    "倘若只是喜欢，何必夸张成爱｡"
                ],
            "6": [
                    "家人的等候，是夜晚不变的牵挂｡", 
                    "只要面对现实，你才能超越现实｡", 
                    "一念放下，万般自在｡", 
                    "新春好运到，139邮箱祝你吉星高照｡",
                    "再忙也别忘了享用晚餐｡"
                ],
            "7": [
                    "不经一番寒彻骨，怎得梅花扑鼻香｡", 
                    "辛苦了，早些休息吧!",
                     "最暗的夜，才能看见最美的星光｡", 
                     "新春好运到，139邮箱祝你吉星高照｡",
                     "今日的坚持，岁月都将会给你回报｡"
                ]
        };

        //0:1点-6点, 1:6点-8点, 2:8点-10点, 3:10点-12点, 4:12点-14点, 5:14点-19点, 6:19点-22点，7:22点-1点……(新)
        //0:0点-6点, 1:6点-8点, 2:8点-10点, 3:10点-12点, 4:12点-14点, 5:14点-18点, 6:18点-24点……(旧)
        var hoursList = "700000112233344555566677";
        var index = hoursList.charAt(hour);
        var sentensIndex = parseInt(Math.random() * 10 + "") % greetings[index].length;
        return greetings[index][sentensIndex];
    };

    WelcomeModel.prototype.getResourceDomain = function (partId) {
        return Router.getServerHost("images", partId || "12");
    };

    WelcomeModel.prototype.stringifySafe = function (obj) {
        return Toolkit.Json.stringifySafe(obj);
    };
    return WelcomeModel;
})();
exports.WelcomeModel = WelcomeModel;

var WelcomePage = (function () {
    function WelcomePage(options) {
        this.options = options;
        this.data = {
            rmInitDataConfig: undefined,
            mwInfoSet: undefined,
            addrQueryUserInfo: undefined,
            mwUnifiedPositionContent: undefined,
            birthContactsInfo: undefined
        };
        this.model = new WelcomeModel();
        this.request = options.request;
        this.response = options.response;
    }
    WelcomePage.prototype.fetch = function (callback) {
        var self = this;
        var client = new HttpClient({
            cookies: this.request.cookies,
            sid: this.getSid(),
            clientIP: this.request.header('X-Forwarded-For') || this.request.ip
        });
        client.getInitDataConfig(function (err, resData) {
            self.data.rmInitDataConfig = resData;
            checkReady();
        });
        client.getInfoSet(function (err, resData) {
            self.data.mwInfoSet = resData;
            checkReady();
        });
        client.getQueryUserInfo(function (err, resData) {
            self.data.addrQueryUserInfo = resData;
            checkReady();
        });
        client.getUnifiedPositionContent(function (err, resData) {
            self.data.mwUnifiedPositionContent = resData;
            checkReady();
        });
        client.getBirthContactsInfo(function (err, resData) {
            self.data.birthContactsInfo = resData;
            checkReady();
        });

        /*
        client.getArtifact(function (resData) {
        self.data.mwGetArtifact = resData;
        checkReady();
        });
        */
        function checkReady() {
            for (var p in self.data) {
                if (self.data[p] === undefined) {
                    return false;
                }
            }
            callback();
        }
    };

    WelcomePage.prototype.render = function () {
        var _this = this;
        var res = this.response;
        this.fetch(function () {
            res.set('Cache-Control', 'private');
            res.render("welcome.ejs", {
                sid: _this.getSid(),
                model: _this.model,
                data: _this.data,
                protocol: _this.getProtocol(),
                //昵称
                userName: _this.model.getUserName(_this.data.rmInitDataConfig),
                //祝福语
                greetingString: _this.model.getGreetingString(),
                //头像
                userImageUrl: _this.model.getUserImageUrl(_this.data.addrQueryUserInfo, _this.getSid(), _this.request.cookies.cookiepartid, _this.getProtocol()),
                //最后登录时间
                lastLoginDate: _this.model.getLastLoginDate(_this.data.mwInfoSet),
                mainUserIntegral: _this.model.getUserIntegral(_this.data.mwInfoSet),
                showUnreadFolders: _this.getShowUnreadFolders()
            });
        });
    };

    WelcomePage.prototype.getShowUnreadFolders = function () {
        //账单是否已割接到收件箱
        var billGejieRelease = false;
        var data = [];

        /*[
        { fid: 1, name: "收件箱" },
        { fid: 8, name: "账单中心" },
        { fid: 9, name: "我的订阅" }];*/
        var list = [1, 8, 9];
        try  {
            if ("newBillCount" in this.data.rmInitDataConfig) {
                billGejieRelease = true;
            }
            if (billGejieRelease) {
                list = [1];
            }
            var folders = this.data.rmInitDataConfig.var.folderList;
            for (var i = 0; i < folders.length; i++) {
                var folder = folders[i];
                if (list.indexOf(folder.fid) > -1) {
                    data.push(folder);
                }
            }
            if (billGejieRelease) {
                data.push({
                    "fid": 8,
                    "name": "服务邮件",
                    "type": 1,
                    "parentId": 0,
                    "folderPassFlag": 0,
                    "location": 8,
                    "folderColor": 0,
                    "reserve": 0,
                    "keepPeriod": 7,
                    "pop3Flag": 1,
                    "hideFlag": 1,
                    "vipFlag": 0,
                    "stats": {
                        "messageCount": this.data.rmInitDataConfig.totalBillCount,
                        "messageSize": 0,
                        "unreadMessageCount": this.data.rmInitDataConfig.newBillCount,
                        "unreadMessageSize": 0,
                        "attachmentNum": 0
                    }
                });
                data.push({
                    "fid": 9,
                    "name": "订阅邮件",
                    "type": 1,
                    "parentId": 0,
                    "folderPassFlag": 0,
                    "location": 9,
                    "folderColor": 0,
                    "reserve": 0,
                    "keepPeriod": 7,
                    "pop3Flag": 1,
                    "hideFlag": 1,
                    "vipFlag": 0,
                    "stats": {
                        "messageCount": this.data.rmInitDataConfig.totalSubscriptionCount,
                        "messageSize": 0,
                        "unreadMessageCount": this.data.rmInitDataConfig.newSubscriptionCount,
                        "unreadMessageSize": 0,
                        "attachmentNum": 0
                    }
                });
            }
        } catch (e) {
        }
        return data;
    };

    //TODO 移到公共
    WelcomePage.prototype.getSid = function () {
        return this.request.query.sid;
    };
    WelcomePage.prototype.getProtocol = function () {
        var protocol = this.request.query.Protocol;
        protocol = decodeURIComponent(protocol);
        protocol = this.encode(protocol);
        return protocol;
    };

    WelcomePage.prototype.encode = function (str) {
        if (typeof str != "string") return "";
        str = str.replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/\"/g, "&quot;")
            .replace(/\'/g, "&#39;")
            .replace(/ /g, "&nbsp;");
        return str;
    };

    return WelcomePage;
})();
exports.WelcomePage = WelcomePage;
