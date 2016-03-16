var Text = {
     parseEmail : function(text){
            var reg=/(?:[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}|(?:"[^"]*")?\s?<[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}>)\s*(?=;|,|，|；|$)/gi;
            var regName=/["']?(.+?)["']?</;
            var regAddr=/<?([A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4})>?/i;
            var matches=text.match(reg);
            var result=[];
            if(matches){
                for(var i=0,len=matches.length;i<len;i++){
                    var item={};
                    item.all=matches[i];
                    var m=text.match(regName);
                    if(m)item.name=m[1];
                    m=matches[i].match(regAddr);
                    if(m)item.addr=m[1];
                    if(item.addr){
                        item.account=item.addr.split("@")[0];
                        item.domain=item.addr.split("@")[1];
                        if(!item.name)item.name=item.account;
                        result.push(item);
                    }
                }
            }
            return result;
    },

    format: function (tpl, data, computeFunc) {
        var i, len, re, ret;
        var key, keys = [], keydata = {};

        if (!data.length) { data = [data]; }
        len = data.length;

        re = /\{([\w]+)\}/g;

        for (i = 0, ret = []; i < len; i++) {
            ret.push(tpl.replace(re, function ($0, $1) {
                var field = $1;
                if (data[i][field]) {
                    return String(data[i][field]);
                } else if (computeFunc && computeFunc[field]) {
                    return computeFunc[field].apply(data[i]);
                }
            }));
        }

        return ret.join("");
    },
    formatDate: function (text, date) {
        var reg = /yyyy|yy|M+|d+|h+|m+|s+|q+|S|w/g;
        text = text.replace(reg, function (pattern) {
            var result;
            switch (pattern) {
                case "yyyy":
                    result = date.getFullYear();
                    break;
                case "yy":
                    result = date.getFullYear().toString().substring(2);
                    break;
                case "M":
                case "MM":
                    result = date.getMonth() + 1;
                    break;
                case "dd":
                case "d":
                    result = date.getDate();
                    break;
                case "hh":
                case "h":
                    result = date.getHours();
                    break;
                case "mm":
                case "m":
                    result = date.getMinutes();
                    break;
                case "ss":
                case "s":
                    result = date.getSeconds();
                    break;
                case "q":
                    result = Math.floor((date.getMonth() + 3) / 3);
                    break;
                case "S":
                    result = date.getMilliseconds();
                    break;
                case "w":
                    result = "日一二三四五六".charAt(date.getDay());
                    break;
                default:
                    result = "";
                    break;
            }
            if (pattern.length == 2 && result.toString().length == 1) {
                result = "0" + result;
            }
            return result;
        });
        return text;
    },
    htmlEncode: function (str) {
        if (typeof str != "string") return "";
        str = str.replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/\"/g, "&quot;")
            .replace(/\'/g, "&#39;")
            .replace(/ /g, "&nbsp;")
        //.replace(/&amp;#([^\;]+);/ig, "&#$1;"); //将&#20117;转成相应的汉字“井”
        return str;
    }
}
module.exports=Text;