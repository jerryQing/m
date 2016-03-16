var Domains = {
    //RM AppSvr
    rmappsvr : {
        "1":"rm.mail.10086rd.cn",
        "12" : "rm.mail.10086rd.cn"
    },
    
    //RM Webapp
    rmwebapp : {
        "1": "rm.mail.10086rd.cn",
        "12" : "rm.mail.10086rd.cn"
    },
    
    //中间件：短信、日程等
    mw : {
        "1": "192.168.9.91",
        "12": "192.168.9.91"
    },

    //资源服务器
    images:{
        "1": "192.168.9.104",
        "12": "192.168.9.104"
    },

    //通讯录服务
    addrsvr: {
        "1": "addrapi.mail.10086rd.cn",
        "12": "addrapi.mail.10086rd.cn"
    }
}

//负载平衡列表
var BalanceList = {
    "addrapi.mail.10086rd.cn":[
        "192.168.9.26:8888"
    ],
    "rm2.mail.10086rd.cn":[
        "192.168.9.93"
    ],
    "rm.mail.10086rd.cn":[
        "192.168.9.107"
    ],
    "g2.mail.10086rd.cn":[
        "192.168.9.105"
    ]
};

exports.Domains = Domains;
//服务器端口
exports.ServerPort = "9500";
//邮件域
exports.EmailDomain = "rd139.com";

//日志级别
exports.LogLevel = "INFO";
exports.BalanceList = BalanceList;