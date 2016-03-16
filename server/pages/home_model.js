///<reference path="../tslib/node.d.ts" />
///<reference path="../tslib/express.d.ts" />
var HttpClient = require("../httpClient/httpClient");

var Router = require("../router/router");
var Toolkit = require("../toolkit/index");
var ejs = require("ejs");
var fs=require("fs");
var path=require("path");


var Logger = require("../logger/logger");

var logger = Logger.getLogger("app");



var HomeModel=function(){

	//获取相对时间
	/*
	function getDateRelative(input){
		//debugger;
		var now=new Date();
    	Object.defineProperties(now,{
    		times: {
		        value: now.getTime(),
		        writable: true,
		        enumerable: true,
		        configurable: true
		    },years: {
		        value: now.getFullYear(),
		        writable: true,
		        enumerable: true,
		        configurable: true
		    },
        month: {
		        value: now.getMonth(),
		        writable: true,
		        enumerable: true,
		        configurable: true
		    },
        date: {
		        value: now.getDate(),
		        writable: true,
		        enumerable: true,
		        configurable: true
		    },
        hour: {
		        value: now.getHours(),
		        writable: true,
		        enumerable: true,
		        configurable: true
		    },
        minutes: {
		        value: now.getMinutes(),
		        writable: true,
		        enumerable: true,
		        configurable: true
		    }
    	});
    	
		var date = new Date(Number(input) * 1000);
        var result;
        //今天的邮件
        var t = now.times - date.getTime(); 	//相差毫秒
        if (t < 0) {
            if (t > -60000) {
                result = "刚刚";
            } else {
                result = Toolkit.Text.formatDate("yyyy-M-dd(w) hh:mm", date);
            }
        }else if (date.getFullYear() == now.years && date.getMonth() == now.month && date.getDate() == now.date) {
            var minutes = Math.round(t / 1000 / 60);
            if (minutes < 1) {
                //minutes = 0;
                result = "刚刚";
            }else if (minutes >= 1 && minutes < 60) {
                result = minutes + "分钟前";
            } else {
                result = Math.floor(minutes / 60) + "小时前";
            }
        } else if (date.getFullYear() == now.years) {
            result = Toolkit.Text.formatDate("M-dd(w) hh:mm",date);
        } else {
            result = Toolkit.Text.formatDate("yyyy-M-dd(w)",date);
        }
        return result;
	}*/
	this.handMailData=function(page,data,callback){
		var targetData=[],emailList=[],todayCount=0,yesterdayCount=0;
		var lineCount=5;
		data.forEach(function(item,i){
			if(i<lineCount){ //只处理前5条
				//item.receiveDateRel=getDateRelative(item.receiveDate);
				item.receiveDateRel=Toolkit.Text.formatDate("hh:mm",new Date(item.receiveDate*1000));
				
				emailList.push(item.from);
				targetData.push(item);
			}
			/*
			var diff=Toolkit.DateUtil.getDaysPass(new Date(),new Date(item.receiveDate*1000));
			if(diff==0){
				todayCount++;
			}else if(diff=-1){
				yesterdayCount++;
			}*/
		});
		todayCount=data.length;

		var options={
                cookies: page.request.cookies,
                sid: page.getSid(),
                clientIP:  page.request.ip
            };
            
		 var client = new HttpClient(options);

		  client.getAddrContacts(emailList,function (err, resData) {

		  		var contacts=resData["Contacts"];
		  		var len = emailList.length;
		  		for(var i=0;i<len;i++){
		  			var emailObj=Toolkit.Text.parseEmail(targetData[i].from)[0];

		  			targetData[i].addr=emailObj.addr;
		  			targetData[i].Name=contacts[i].Name;
		  			targetData[i].ImgUrl=contacts[i].ImgUrl;
		  		}
                //logger.info(resData);

				var renderData={
					todayCount:todayCount,
		        	imagesDomain:"http://"+ Router.getServerHost("images",client.getPartId()),
		        	list:targetData
		        };
                callback(renderData);
                
                /*
               
				*/
				
           });
 		
	}
}

module.exports=HomeModel;

