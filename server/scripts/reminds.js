
// 渲染提醒数量
var initRemindsView = {

	render: function(data) { // data是对象，不是数组
		var self = this;
		window._remind_list_data = data;

		if (window.mainView) {
			if(mainView.remindListView) {
				window.mainView.remindListView.model.setData(data);
			} else {
				console.error("mainView not fully initialized!!!");
			}
		}
		var timestamp = $("#currDayTitle").attr("timestamp");
		var currDay = new Date(parseInt(timestamp));
		var isToday = (+new Date - currDay < 24*3600*1000) && ((new Date).getDate() == currDay.getDate());
		
		$("#loadingTips").remove();
		$id("remindList").innerHTML = $id("remindItemTpl").innerHTML;
		
		$("#remindList").find("li[rid]").each(function(i) {
			var card = data[i + 1];
			var contents = card && card.contents;

			if(i+1==5 && isToday && self.birthText) {	// 生日提醒消息
				$(this).find("ul").html(self.birthText);
			} else if (!contents || contents.length === 0) {
				$(this).hide();
			} else {
				if(isToday || i+1 == 3 || i+1 == 4){	// 今天的全部显示，以前的只显示日历“邀请”和“共享”
					// 按消息中的提醒内容的时间属性过滤出当天的（已在node端处理好）
					$(this).find("ul").html(card.contents.splice(0, 5).join(""));
				} else {	// 以前的时间点，除日历“邀请”和“共享”的其它类型都隐藏
					$(this).hide();
				}
			}
		});
		$("#remindList").show();

		if(!this.isFirstLoaded) {
			$(".mailListHeaderCon>span").hide();	// 首次加载，先隐藏所有数量显示信息
		}
		
		if(isToday) {
			this.showYesterdayMsgCount(data);	// 以往消息可操作，所以需要更新
		}

		if(this.isFirstLoaded) {
			mainView.adjustContentListHeight();
			return;
		}
		this.isFirstLoaded = true;

		if(window._calendar_view_data_) {
			this.initMsgCount(_calendar_view_data_);
		}
		
		if(window._yesterday_mail_count_ != undefined){
			this.onYesterdayMailArrive(_yesterday_mail_count_);
		}
	},

	showYesterdayMsgCount: function(data){
		// 显示昨天的消息数量
		var yesInvites = data["yesterday_calendar_invite"];
		var yesShares = data["yesterday_calendar_share"];
		this.showOrHideCountInfo("#prevDayInvite", yesInvites && yesInvites.length);
		this.showOrHideCountInfo("#prevDayShare", yesShares && yesShares.length);
	},
	
	// 生日提醒为独立接口，单独处理
	renderBirthRemind: function(data){
		var str = "今日生日，赶紧送上祝福吧~";
		var len, list, wrapper;
		var names = [], addrs = [];

		data = data || {};
		list = data.BirthdayContactInfo;

		function cut(str, len){
			if(str && str.length > len) {
				str = str.substr(0, len-1) + "…";
			}
			return str;
		}

		if(data.TotalRecord > 0 && list && list.length) {
			len = list.length;
			for(var i=0; i<Math.min(len, 3); i++){
				names.push(cut(list[i].AddrName, 4));
				addrs.push(list[i].FamilyEmail || list[i].MobilePhone);
			}
			names = names.join("、");
			if(len > 3) {
				str = names + '等<strong class="orange">' + len + '人</strong>' + str;
			} else {
				str = names + str;
			}
			wrapper = $("#remindList li[rid=5]");
			// 缓存，下次切换日期重新渲染时直接用
			this.birthText = '<li data-emails="' + addrs.join(";") + '">' + str + '</li>';
			wrapper.find("ul").html(this.birthText);
			wrapper.show();
		}
	},

	/*
	 * 根据日历提醒数据获明天的提醒数量
	 */
	initMsgCount: function(result) {
		var activity,
			nextDayActivity = 0,
			nextDayTask = 0;
		var dateNow = (new Date()).getDate();
		var tomorrow = $Date.format("yyyy-MM-dd", new Date(new Date().setDate(dateNow + 1)));

		var listDetail = result["table"];
		var ids = result["var"][tomorrow];
		
		if (ids) {
			ids = ids.info || [];

			for (var i = 0; i < ids.length; i++) {
				activity = listDetail[ids[i]];

				if(activity.specialType == 6) {
					nextDayTask ++;
				// 邀请 / 共享 / 群活动 / 订阅
				} else if (activity.isInvitedCalendar || activity.isSharedCalendar || activity.isGroup || activity.isSubCalendar) {
					continue;
				} else {
					// 普通日历活动
					nextDayActivity ++;
				}
			}
		}
		this.showOrHideCountInfo("#nextDayActivity", nextDayActivity);
		this.showOrHideCountInfo("#nextDayTask", nextDayTask);
	},

	showOrHideCountInfo: function(selector, count) {
		var element = $(selector);
		count = Math.abs(count|0);
		var action = count ? "show" : "hide";

		element.find("var").html(count).end()[action]();

		if (element.prevAll(":visible").length) {		// 前已有可见项，处理前面的顿号
			if(!element.prevAll(":visible:first").is(".js_dot")) {
				element.prev(".js_dot")[action]();
			}
		} else if(element.nextAll(":visible").length){	// 后已有可见项，处理后面的顿号
			if(!element.nextAll(":visible:first").is(".js_dot")) {
				element.next(".js_dot")[action]();
			}
		} else {	// 首个消息数量信息变动，则父标题栏显示/隐藏
			mainView.adjustContentListHeight(function(){
				element.closest(".mailListHeader")[action]();
			});		// 显示逻辑执行完毕，调整高度
		}
	},

	onYesterdayMailArrive: function(data) {
		this.showOrHideCountInfo("#prevDayMail", data);
	}
};
