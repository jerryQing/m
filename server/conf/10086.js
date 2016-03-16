var Domains = {
    //RM AppSvr
    rmappsvr : {
        "1":"appmail3.mail.10086.cn",
        "12" : "appmail.mail.10086.cn"
    },
    
    //RM Webapp
    rmwebapp : {
        "1": "webapp3.mail.10086.cn",
        "12" : "webapp.mail.10086.cn"
    },

    mpost: {
        "1": "172.16.200.15:9001",
        "21": "subscribe-js.api.localdomain:5100"
    },

    //中间件：短信、日程等
    mw : {
        "1": "smsrebuild0.mail.10086.cn",
        "12": "smsrebuild1.mail.10086.cn"
    },

    //资源服务器
    images:{
        "1": "image0.139cm.com",
        "12": "images.139cm.com"
    },

    //通讯录服务
    addrsvr: {
        "1": "addrapi.mail.10086.cn",
        "12": "addrapi.mail.10086.cn"
    }
}

//替代服务端host
var BalanceList = {
    "subscribe2.mail.10086.cn": [
        "172.16.72.80:5100",
        "172.16.72.81:5100"
    ],
    "subscribe3.mail.10086.cn": [
        "172.16.200.15:9001"
    ],

    "g2.mail.10086.cn":[
        "172.16.72.1",
        "172.16.72.2",
        "172.16.72.3",
        //"172.16.72.4",
        "172.16.72.5",
        "172.16.72.6",
        "172.16.72.7",
        "172.16.72.8"
    ],
    "g3.mail.10086.cn":[
        "172.16.72.11"
    ],
    "addrapi.mail.10086.cn":[
        "addr.api.localdomain:8090"
    ],
    "appmail.mail.10086.cn":[
        "172.16.182.168:9002"
    ],

    "appmail3.mail.10086.cn": [
        "172.16.182.98:9002",
        "172.16.182.99:9002"
    ],

    "smsrebuild1.mail.10086.cn":[
        "172.16.210.162"
    ],
    "smsrebuild0.mail.10086.cn":[
        "172.16.210.51"
    ],
    "webapp.mail.10086.cn":[
        "172.16.182.168:9001"
    ],

    "webapp3.mail.10086.cn":[
        "172.16.182.98:9001",
        "172.16.182.99:9001"
    ],

    "mw.mail.10086.cn": [
        "172.16.210.170"
    ],
    "mw-test.mail.10086.cn":[
        "172.16.210.29"
    ],
    "images.139cm.com": [
        "172.16.172.171:2080"
    ],
    "image0.139cm.com": [
        "172.16.72.69:2080"
    ]
};

exports.HTTPClientTimeout = 10000;

exports.Domains = Domains;
//服务器端口
exports.ServerPort = "9500";
//邮件域
exports.EmailDomain = "139.com";

//日志级别
exports.LogLevel = "INFO";
exports.BalanceList = BalanceList;