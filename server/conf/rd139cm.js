var Domains = {
    //RM AppSvr
    rmappsvr: {
        "1": "rm.mail.rd139cm.com",
        "21": "rm.mail.rd139cm.com"
    },

    //RM Webapp
    rmwebapp: {
        "1": "rm.mail.rd139cm.com",
        "21": "rm.mail.rd139cm.com"
    },

    //中间件：短信、日程等
    mw: {
        "1": "smmw46.mail.rd139cm.com",
        "21": "smmw46.mail.rd139cm.com"
    },

    //资源服务器
    images: {
        "1": "192.168.9.193:2080",
        "21": "192.168.9.193:2080"
    },

    //通讯录服务
    addrsvr: {
        "1": "addrapi.mail.rd139cm.com",
        "21": "addrapi.mail.rd139cm.com"
    }
}

//负载平衡列表
var BalanceList = {
    "rm.mail.rd139cm.com": [
        "192.168.5.8"
    ],
    "smmw46.mail.rd139cm.com": [
        "192.168.5.3"
    ],
    "addrapi.mail.rd139cm.com": [
        "192.168.5.8"
    ]
};

exports.Domains = Domains;
//服务器端口
exports.ServerPort = "9500";
//邮件域
exports.EmailDomain = "hmg1.rd139.com";

//日志级别
exports.LogLevel = "INFO";
exports.BalanceList = BalanceList;
