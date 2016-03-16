var Domains = {
    //RM AppSvr
    rmappsvr: {
        "1": "rm.mail.10086ts.cn",
        "21": "rm.mail.10086ts.cn"
    },

    //RM Webapp
    rmwebapp: {
        "1": "rm.mail.10086ts.cn",
        "21": "rm.mail.10086ts.cn"
    },

    mpost: {
        "1": "192.168.9.181:18080",
        "21": "192.168.9.181:18080"
    },

    //中间件：短信、日程等
    mw: {
        "1": "smmw46.mail.10086ts.cn",
        "21": "smmw46.mail.10086ts.cn"
    },

    //资源服务器
    images: {
        "1": "192.168.9.193:2080",
        "21": "192.168.9.193:2080"
    },

    //通讯录服务
    addrsvr: {
        "1": "addrapi.mail.10086ts.cn",
        "21": "addrapi.mail.10086ts.cn"
    }
}

//负载平衡列表
var BalanceList = {
    "rm.mail.10086ts.cn": [
        "192.168.9.188"
    ],
    "rm2.mail.10086ts.cn": [
        "192.168.9.188"
    ],
    "smmw46.mail.10086ts.cn": [
        "192.168.9.190"
    ],
    "addrapi.mail.10086ts.cn": [
        "192.168.9.199"
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