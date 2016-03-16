
var libQueryString = require("querystring");
var libText = require("../toolkit/text");

/*
var libQueryString = {
 parse:function(str){
   var o = {};
   var ary = str.split("&");
   ary.forEach(function(item){
       var pair = item.split("=");
       o[pair[0]] = pair[1];
   });
   return o;
 }
};
*/

var transformMap = {
	mail: {
		key: "mail",
		type: 0,
		compile: function(item){
			return "";
		}
    },
	groupmail_gin: {
		key: "addrGroupinvite",
		compile: function(item){
			return "";
		}
    },
	addr_mkpn: {
		key: "addrMaykown",
		compile: function(item){
			return "";
		}
    },
    // calendar_cain
	calendar_invite: {
		key: "calendarInvite",
		type: 3,
		compile: function(item, options){
			//<li>胡老板 邀请您参加“<strong>爬山</strong>”活动</li>
			var ary = [];
			var list = item.msgContent.split("|");
			list.shift();
			var today = options && options.date || libText.formatDate("yyyy-MM-dd", new Date);
			
			ary = list.map(function(val, key){
				return libQueryString.parse(val);
			}).filter(function(obj, key){
				return obj.date && obj.date.indexOf(today) === 0;	// 只保留指定的当天提醒
			}).map(function(obj, key){
				// todo 如何区分“活动”和“会议”
				var type = /会议|例会|周会/i.test(obj.activity) ? "会议" : "活动";
				return '<li mid="' + obj.id + '" seqno="' + item.seqNO + '" class="ellipsis"><span class="name">' + libText.htmlEncode(obj.name) + '</span>邀请您参加 "<strong class="themeThree">' + libText.htmlEncode(obj.activity) + '</strong>" ' + type + '</li>';
			});
			
			return ary;
		}
    },
    calendar_share: {
		key: "calendarShare",
		type: 4,
		compile: function(item, options){
			//<li>刘志刚 分享给您“ <strong>亚冠比赛</strong>”日历</li>
			var ary = [];
			var list = item.msgContent.split("|");
			list.shift();
			var today = options && options.date || libText.formatDate("yyyy-MM-dd", new Date);
			
			ary = list.map(function(val, key){
				return libQueryString.parse(val);
			}).filter(function(obj, key){
				return obj.date && obj.date.indexOf(today) === 0;	// 只保留指定的当天提醒
			}).map(function(obj, key){
				return '<li mid="' + obj.id + '" seqno="' + item.seqNO + '" class="ellipsis"><span class="name">' + libText.htmlEncode(obj.name) + '</span>共享给您 "<strong class="themeFour">' + libText.htmlEncode(obj.activity) + '</strong>" 日历</li>';
			});
			
			return ary;
		}
    },
	calendar_cen: {
		key: "calendarActivity",
		type: 2,
		compile: function(item, options){
			//<li>16:00“<strong>赛龙舟</strong>”活动开始</li>
			var ary = [];
			var list = item.msgContent.split("|");
			list.shift();
			var today = options && options.date || libText.formatDate("yyyy-MM-dd", new Date);
			
			ary = list.map(function(val, key){
				return libQueryString.parse(val);
			}).filter(function(obj, key){
				var pair = obj.date.split(" ");
				obj.date = pair[1];
				return pair[0] == today;	// 只保留指定的当天提醒
			}).sort(function(a, b){
				//if(a.date=="今天") {
				if(a.date.charCodeAt(0) > 255) {
					return "00:00" > b.date;
				}else if(b.date.charCodeAt(0) > 255){
					return a.date > "00:00";
				}
				return a.date > b.date;
			}).map(function(obj, key){
				//obj.date = obj.date.split(" ")[1];
				return '<li mid="' + obj.id + '" seqno="' + item.seqNO + '" class="ellipsis">' + obj.date + ' "<strong class="themeTwo">' + libText.htmlEncode(obj.name) + '</strong>" 活动开始</li>';
			});
			
			return ary;
		}
    },
	netdisk_tsen: {
		key: "cabinet",
		type: 7,
		compile: function(item){
			// <li>毕业照.jpg、年度总结.doc、阿里金卡. <br />psd等<strong class="orange">5个</strong>文件即将到期</li>
			var str;
			var ary = [];
			var obj = libQueryString.parse(item.msgContent);

			if(obj.name) {
				ary = obj.name.split(",");
				ary = ary.map(function(val, key){
					return cut(val, 5);
				});
			}

			str = '<li mid="' + obj.id + '" seqno="' + item.seqNO + '" data-num="' + obj.count + '">' + ary.slice(0, 3).join("、");
			
			if(obj.count > 3) {
				str += ' 等<strong class="orange">' + obj.count + '个</strong>';
			}
			str += '文件即将到期</li>';

			return [str];
		}
    },
	cpo_cpopu: {
		key: "myMagazine",
		type: 6,
		compile: function(item){
			var num = parseInt(item.msgContent, 10);
			if(num > 0) {
				return ['<li seqno="' + item.seqNO + '">您的报刊今天更新了 <strong class="orange">' + num + '篇</strong> 文章</li>'];
			}
			return [];
		}
    },
	cpo_cponm: {
		key: "magazineHome",
		compile: function(item){
			var str = "";
			return str;
		}
    },
    calendar_task: {
		key: "myTask",
		type: 1,
		compile: function(item){
			//“<strong>12月15日会议邀请</strong>”邮件今日待处理
			var ary = [];
			var list = item.msgContent.split("|");
			list.shift();
			ary = list.map(function(val, key){
				var obj = libQueryString.parse(val);
				return '<li mid="' + obj.mid + '" seqno="' + item.seqNO + '" class="ellipsis"> "<strong class="themeOne">' + libText.htmlEncode(obj.name) + '</strong>" 邮件今日待处理</li>';
			});
			
			return ary;
		}
    }
};
/*
应答消息：
< GetContactsBirdayResp>
<ResultCode></ResultCode>
<ResultMsg></ResultMsg>
<TotalRecord/>//只有在获取第一页记录时会出现该字段，其他时候不出现
< BirthdayContactInfo>//0-n个子元素
		<AddrName ></ AddrName >
		<MobilePhone ></ MobilePhone >
		<FamilyEmail ></ FamilyEmail >
		<BusinessEmail ></ BusinessEmail >
		<OtherEmail ></ OtherEmail >
		<BirDay ></BirDay />
</ BirthdayContactInfo>
</ GetContactsBirdayResp>
*/

function cut(str, len){
	if(str && str.length > len) {
		str = str.substr(0, len-1) + "…";
	}
	return str;
}

var RemindsModel = function(){
};

// RemindsModel.transformData(resData["var"])
RemindsModel.prototype.transformData = function (list, options) {
	var date, item, isToday, mapVal, today;
	var listObj = {};

	if(!(list && list.length)) {
		return listObj;
	}
	
	today = libText.formatDate("yyyy-MM-dd", new Date);
	isToday = !options || options.date == today;
try{
	var yesterday = isToday ? libText.formatDate("yyyy-MM-dd", new Date(Date.now()-24*3600*1000)) : "";
	
	for (var i = 0; i < list.length; i++) {
		item = list[i];
		mapVal = transformMap[item.msgType];

		if(!mapVal || mapVal.type == undefined || item.msgContent == 0) {
			continue;
		}
		if(!isToday && !(mapVal.type == 3 || mapVal.type == 4)) {
			continue;	// 今天以外的时间，只返回邀请、共享数据（节省计算）
		}
		
		date = Date.parse(item.createTime.trim());

		listObj[mapVal.type] = {
			seqNO: item.seqNO,
			date: date,	// number
			contents: mapVal.compile(item, options)
		};

		if(isToday && (mapVal.type == 3 || mapVal.type == 4)) {	// 请求“今天”的数据，连带返回昨天的
			listObj["yesterday_"+item.msgType] = mapVal.compile(item, {date: yesterday});
		}
	}
}catch(e){
	console.log(e);
	console.log(e.stack);
}

	console.log(JSON.stringify(listObj, null, "\t"));
	return listObj;
};

if(typeof module != "undefined" && module.exports) {
	module.exports = RemindsModel;
}
