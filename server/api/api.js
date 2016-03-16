///<reference path="../tslib/node.d.ts" />
(function (GetInitDataConfig) {
    GetInitDataConfig.site = "rmappsvr";
    GetInitDataConfig.url = "/s?func=user:getInitDataConfig&sid=$sid";
    GetInitDataConfig.requestData = "<null />";

    function checkResponse(obj) {
        if (obj && obj.code === "S_OK") {
            return true;
        } else {
            return false;
        }
    }
    GetInitDataConfig.checkResponse = checkResponse;
})(exports.GetInitDataConfig || (exports.GetInitDataConfig = {}));

var GetInitDataConfig = exports.GetInitDataConfig;

(function (GetInfoSet) {
    GetInfoSet.site = "mw";
    GetInfoSet.url = "/setting/s?func=info:getInfoSet&sid=$sid";
    GetInfoSet.requestData = "<null />";

    function checkResponse(obj) {
        if (obj && obj.code === "S_OK") {
            return true;
        } else {
            return false;
        }
    }
    GetInfoSet.checkResponse = checkResponse;
})(exports.GetInfoSet || (exports.GetInfoSet = {}));

var GetInfoSet = exports.GetInfoSet;

(function (GetAdlink) {
    GetAdlink.site = "mw";
    GetAdlink.url = "/sharpapi/userconfig/service/ajaxhandler.ashx?func=user:adlink&sid=$sid";
    GetAdlink.requestData = "<null />";
})(exports.GetAdlink || (exports.GetAdlink = {}));

var GetAdlink = exports.GetAdlink;

(function (GetArtifact) {
    GetArtifact.site = "mw";
    GetArtifact.url = "/setting/s?func=umc:getArtifact&sid=$sid";
    GetArtifact.requestData = "<null />";

    function checkResponse(obj) {
        if (obj && obj.code === "S_OK") {
            return true;
        } else {
            return false;
        }
    }
    GetArtifact.checkResponse = checkResponse;
})(exports.GetArtifact || (exports.GetArtifact = {}));

var GetArtifact = exports.GetArtifact;

(function (GetQueryUserInfo) {
    GetQueryUserInfo.site = "addrsvr";
    GetQueryUserInfo.url = "/QueryUserInfo?sid=$sid&formattype=json";
    GetQueryUserInfo.requestData = "<QueryUserInfo><UserNumber></UserNumber></QueryUserInfo>";

    function checkResponse(obj) {
        if (obj && obj.ResultCode === "0") {
            return true;
        } else {
            return false;
        }
    }
    GetQueryUserInfo.checkResponse = checkResponse;
})(exports.GetQueryUserInfo || (exports.GetQueryUserInfo = {}));

var GetQueryUserInfo = exports.GetQueryUserInfo;

(function (GetUnifiedPositionContent) {
    GetUnifiedPositionContent.site = "mw";
    GetUnifiedPositionContent.url = "/setting/s?func=unified:getUnifiedPositionContent&sid=$sid";

    //    export var requestData = '<object><string name="positionCodes">web_050,web_051,web_052,web_053,web_054,web_055,web_056,web_057,web_060</string></object>';
    GetUnifiedPositionContent.requestData = '<object><string name="positionCodes">web_050,web_055,web_031</string></object>';

    function checkResponse(obj) {
        if (obj && obj.code === "S_OK") {
            return true;
        } else {
            return false;
        }
    }
    GetUnifiedPositionContent.checkResponse = checkResponse;
})(exports.GetUnifiedPositionContent || (exports.GetUnifiedPositionContent = {}));

var GetUnifiedPositionContent = exports.GetUnifiedPositionContent;

(function (SearchVipLetters) {
    SearchVipLetters.site = "rmappsvr";
    SearchVipLetters.url = "/bmail/s?func=mbox:searchMessages&sid=$sid";
    SearchVipLetters.requestData = [
        '<object>',
        '<int name="fid">0</int>',
        '<int name="recursive">0</int>',
        '<int name="ignoreCase">0</int>',
        '<int name="isSearch">1</int>',
        '<int name="start">1</int>',
        '<int name="total">20</int>',
        '<int name="limit">1000</int>',
        '<int name="isFullSearch">2</int>',
        '<array name="condictions">',
        '<object>',
        '<string name="field">from</string>',
        '<string name="operator">contains</string>',
        '<string name="value">wangzx@richinfo.cn;zhangjian@richinfo.cn;13500058946@139.com;panggan@richinfo.cn;xuzengshen@richinfo.cn;baixg@richinfo.cn;tiexg@richinfo.cn;jerry_richinfo@139.com;liht@richinfo.cn;lihaitaohust@139.com</string>',
        '</object>',
        '</array>',
        '</object>'].join("");
})(exports.SearchVipLetters || (exports.SearchVipLetters = {}));

var SearchVipLetters = exports.SearchVipLetters;

(function (RichMailCompose) {
    RichMailCompose.site = "rmwebapp";
    RichMailCompose.url = "/RmWeb/mail?func=mbox:compose&sid=$sid";

    function checkResponse(obj) {
        if (obj && obj.code === "S_OK") {
            return true;
        } else {
            return false;
        }
    }
    RichMailCompose.checkResponse = checkResponse;
})(exports.RichMailCompose || (exports.RichMailCompose = {}));

var RichMailCompose = exports.RichMailCompose;

(function (BirthContacts) {
    BirthContacts.site = "addrsvr";
    BirthContacts.url = "/GetContactsBirday?sid=$sid&formattype=json&comefrom=54";
    BirthContacts.requestData = '<GetContactsBirday><UserNumber></UserNumber></GetContactsBirday>';

    function checkResponse(obj) {
        if (obj) {
            return true;
        } else {
            return false;
        }
    }
    BirthContacts.checkResponse = checkResponse;
})(exports.BirthContacts || (exports.BirthContacts = {}));

var BirthContacts = exports.BirthContacts;

exports.RemindMsg={
    site:"mw",
    url:"/setting/s?func=msg:getRemindMsg&comefrom=54&sid=$sid",
    requestData:"<object></object>",
    checkResponse:function(obj){
         if (obj && obj.code === "S_OK") {
            return true;
        } else {
            return false;
        }
    }
}

exports.CalendarView={
    site:"mw",
    url:"/calendar/s?func=calendar:getCalendarView&comefrom=54&sid=$sid",
    requestData:"<object></object>",
    checkResponse:function(obj){
         if (obj && obj.code === "S_OK") {
            return true;
        } else {
            return false;
        }
    }
}

exports.WeatherView={
    site:"mw",
    url:"/weather/weather?func=weather:getDefaultWeather&comefrom=54&sid=$sid",
    requestData:"<object></object>",
    checkResponse:function(obj){
         if (obj && obj.code === "S_OK") {
            return true;
        } else {
            return false;
        }
    }
}

exports.MagazineView={
    site:"mpost",
    url:"/inner/index/mpostRecommend?comefrom=54&sid=$sid",
    requestData:"<object></object>",
    checkResponse:function(obj){
         if (obj && obj.code === "S_OK") {
            return true;
        } else {
            return false;
        }
    }
}

exports.listMessages={
    site : "rmappsvr",
    url : "/RmWeb/mail?func=mbox:listMessages&sid=$sid",
    requestData: "",
    checkResponse:function(obj){
         if (obj && obj.code === "S_OK") {
            return true;
        } else {
            return false;
        }
    }
}
exports.searchMail={
    site : "rmwebapp",
    url : "/RmWeb/mail?func=mbox:searchMessages&sid=$sid",
    requestData: "",
    checkResponse:function(obj){
         if (obj && obj.code === "S_OK") {
            return true;
        } else {
            return false;
        }
    }
}

exports.addrContacts={
    site : "addrsvr",
    url : "/GetBatchContacts?sid=$sid&formattype=json",
    requestData : "<GetBatchContacts><Contact><Email>zjq2602@139.com</Email></Contact></GetBatchContacts>",
    checkResponse:function(obj) {
        if (obj && obj.ResultCode === "0") {
            return true;
        } else {
            return false;
        }
    }

}

exports.addrData={
    site : "addrsvr",
    url : "/GetUserAddrJsonData?sid=$sid&formattype=json",
    requestData : "<QueryUserInfo><UserNumber></UserNumber></QueryUserInfo>",
    checkResponse:function(obj) {
        if (obj && obj.ResultCode === "0") {
            return true;
        } else {
            return false;
        }
    }

}

exports.addrImage={
    site : "addrsvr",
    url : "/GetBatchImageUrl?sid=$sid&formattype=json",
    requestData : "",
    checkResponse:function(obj) {
        if (obj && obj.ResultCode === "0") {
            return true;
        } else {
            return false;
        }
    }

}