
var initUnifiedPositionContentView = {
	render: function(data) {
		this.getActivityRecommandContent(data);
	},

	getActivityRecommandContent: function(data){
		var html = "";	// todo default

		if(data) {
			html = data["web_055"][0].content;// + data["web_056"][0].content;
		}

		if(window.location.protocol == "https:"){
			html = html.replace(/http:\/\/images.139cm.com/g,"https://appmail3.mail.10086.cn/images_139cm");
		}

		var wrapper = $("#advertising");
		if(html) {
			wrapper.find("div>p").html(html);
		}
		wrapper.find("img").attr({width: 190, height: 220});
		wrapper.show();
	}
};
