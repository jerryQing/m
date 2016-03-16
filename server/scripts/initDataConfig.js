
var initDataConfigView = {

	render: function(data) {
		// 修正邮箱体验Tips位置
		setTimeout(function(){
			var pos = $("#healthSet").position();
			$('#healthSet').next(".tipsOther").css("left", (pos.left-30) + "px");
		}, 50);

		this.showUnreadMessageCount(data);
	},

    showUnreadMessageCount: function(data){
	    var self = this;
	    var info = {}, folder, tipStr;

		var folders = data["var"].folderList;

		for (var i = 0; i < folders.length; i++) {
			folder = folders[i];
			if (folder.fid == 1) {	// 1 收件箱
				tipStr = this.getTipStr(folder.stats.unreadMessageCount);
				if(tipStr) {
					this.unreadMessageCount = folder.stats.unreadMessageCount;
					$("#navigate").find("li[fid=1]").append(tipStr);
				}
				break;
			}
		}

		if(data.unreadStarCount > 0){
			this.unreadStarCount = data.unreadStarCount;
			tipStr = this.getTipStr(data.unreadStarCount);
			tipStr && $("#li_star").append(tipStr);
		}

		if(data.todoTaskCount > 0){
			this.todoTaskCount = data.todoTaskCount;
			tipStr = this.getTipStr(data.todoTaskCount);
			tipStr && $("#li_todo").append(tipStr);
		}

		// vip未读数显示
		top.$App.getView("mailbox").model.getVipMailCount(function(stats){
			if(stats){
				var tipStr = self.getTipStr(stats.unreadMessageCount);
				if(tipStr) {
					this.unreadVipMessageCount = stats.unreadMessageCount;
					$("#li_vip").append(tipStr);
				}
			}
		});
    },

    getTipStr: function(count){
	    count = count | 0;
	    if(count <= 0) {
		    return "";
	    }
		if(count > 99) {
			count = "99+";
		}
		return '<p class="i_icoTop"><span style="font-size: 14px;position: relative;top: -3px;left: -4px;display: inline-block;min-width: 26px;text-align: center;height: 14px;">' + count + '</span></p>';
    },

	updateUnreadMessageCount: function() {
		var tipStr, c;
		var folderModel = top.$App.getView("folder").model;
		c = folderModel.get("unreadMessageCount");
		if(this.unreadMessageCount != c) {
			tipStr = this.getTipStr(c);
			$("#navigate").find("li[fid=1]").find(".i_icoTop").remove().end().append(tipStr);
		}
		c = folderModel.get("unreadStarCount");
		if(this.unreadStarCount != c) {
			tipStr = this.getTipStr(c);
			$("#li_star").find(".i_icoTop").remove().end().append(tipStr);
		}
		c = folderModel.get("todoTaskCount");
		if(this.todoTaskCount != c) {
			tipStr = this.getTipStr(c);
			$("#li_todo").find(".i_icoTop").remove().end().append(tipStr);
		}
		c = folderModel.get("vipMailStats");
		c = c && c.unreadMessageCount;
		if(this.unreadMessageCount != c) {
			tipStr = this.getTipStr(c);
			$("#li_vip").find(".i_icoTop").remove().end().append(tipStr);
		}
	}
};