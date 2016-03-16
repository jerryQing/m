/*
 * 客户端初始化用户信息版面脚本（不包含交互）
 */
var initUserInfoView = {

	//el: "#userInfo",

	render: function(data) {
		var userData = data.userMainData || {};

		this.showAliasName(userData.uidList);
		
		// 渲染数据
		this.renderIntegral(userData.mainUserIntegral);
		this.renderHealth();

		// 显示视图
		$id("userInfo").style.display = "";
		return this;
	},

	showAliasName: function(list) {
		var item;
		var name = $id("userName").innerHTML;

		if(name){
			return;
		}
		//console.log(list);
		for(var i=0, len=list.length; i < len; i++) {
			item = list[i];
			if(item.type == "0") {	// 优先取别名
				name = item.name.split("@")[0];
				break;
			} else if(item.type == "2") {	// 手机号
				name = item.name.split("@")[0];
			}
		}
		$id("userName").innerHTML = $TextUtils.htmlEncode(name);
	},

	// 积分兑换
	getScoreLink: function() {
		var flag, url;
		var links = [15, 16, 17];
		flag = links[parseInt(Math.random() * 100) % links.length];
		url = window.location.protocol + '//zone.mail.10086.cn/api/sso/ssoformail.ashx?to=CN201204A1&flag=' + flag + '&sid=' + top.sid;
		$id('scoreExchange').href = url;
	},

	renderIntegral: function(data) {
		$id("myintegral").innerHTML = (data.integral | 0);
		this.getScoreLink();
	},

	renderHealth: function() {
		$('#healthSet').hover(function(){
			$(this).next(".tipsOther").show();	// todo 显示位置
		},function(){
			$(this).next(".tipsOther").hide();
		});
	}
};
