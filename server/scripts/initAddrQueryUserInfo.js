var initAddrQueryUserInfoView = {

	render: function(data) {
		var userData = data && data[0] || {};
		this.getUserImageUrl(userData);
		this.getTrueName(userData);
	},

	getTrueName: function(UserInfo) {
		if(UserInfo.c) {
			$id("userName").innerHTML = $TextUtils.htmlEncode(UserInfo.c);
		}
	},
	
	/**
	 *获得用户头像
	 */
	getUserImageUrl: function(UserInfo) {
		var headUrl = "/m2012/images/ad/face.jpg";
		var imgUrl = UserInfo.b8;

		if (imgUrl) {
			if (/^https?:\/\//i.test(imgUrl)) {
				headUrl = imgUrl;
			} else if (!/[<>]/.test(imgUrl)) {
				headUrl = top.getDomain("resource") + imgUrl;
			}
		}

		if (window.location.protocol == "https:") {
			headUrl = headUrl.replace(/http:\/\/image(0|s).139cm.com/, "https://appmail3.mail.10086.cn/images_139cm");
		}
		
		$id("userImg").src = headUrl;
	}
};