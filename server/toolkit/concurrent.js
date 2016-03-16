var util=require("util");
var events=require("events");


function Concurrent(){
    var conList={}; //并行回调列表
    var chainList=[]; //串行回调列表

    var keyList,endCallback=null;
    this.on("message",function(args){
        var key=args.key;
        conList[key]=args.data || true;
        checkReady(key);
    });


    function checkReady(key){ 
        console.log("checkReady",conList);
        var results=[];
        var list=keyList;
        for(var i=0;i<list.length;i++){
            var key=list[i];
            if(!conList[key]){
                return false;
            }else{
                results.push(conList[key]);
            }
        }
        console.log("end");
        endCallback(results);//完成时，把返回值全部回传
 
    };

    this.ready=this.done=function(key,data){
        this.emit("message",{key:key,data:data});

    }
    this.all=function(list,callback){
        keyList=list;
        endCallback=callback;
    }

    function chainNext(){
        if(chainList.length>0){
            var next=chainList.shift();
            console.log("chain",typeof next);
            next.call(this,chainNext);
        }
    }

    this.step=function(fn){
        //debugger;
        
        chainList.push(fn);
        if(chainList.length==1){ //第一个，多米诺骨牌启动
            setTimeout(function(){ //延时调用，避免比后面的链式操作先执行
                chainNext();
            },0);
            
        }
        return this;
    }

   
}

util.inherits(Concurrent,events.EventEmitter);
module.exports = Concurrent;

 

