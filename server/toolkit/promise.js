
function noop(){}

function Promise(next){
	this.state = 0;
	this.next = next || function(obj) { return obj; };
	this.thens = [];
};

Promise.prototype = {
	onResolve: function(fn){
		if(typeof fn === "function") {
			this.onResolve = fn;
		} else {
			this.onResolve = noop;
		}
	},
	resolve: function(ret){
		var next = this.next;
		if (this.state === 0) {
			this.result = next(ret); // 执行下个任务，with no `this` value
			//console.log("res: " + this.result);
			this.state = 1;
			this.onResolve();

			// 依次调用该任务的后续任务
			for (var i=0, len=this.thens.length; i<len; i++){
				this._fire(this.thens[i]);	// 是否应该pop？
			}
		}
		return this;
	},
	_fire: function(nextPromise){
		var nextResult = this.result;
		if (nextResult instanceof Promise){
			// 异步的情况，返回值是一个Promise，则当其resolve的时候，nextPromise才会被resolve
			nextResult.then(function(ret){
				nextPromise.resolve(ret);
			});
		}else{
			// 同步的情况，返回值是普通结果，立即将nextPromise给resolve掉
			nextPromise.resolve(nextResult);
		}
	},
	then: function(next){
		// SF: next和thens的区别何在？
		// next是串接这些promise任务单元的筋脉
		// thens表示中间某个promise完成后，某些任务已达到执行所需的条件。
		var nextPromise = new Promise(next);
		if (this.state === 1){
			// 如果当前状态是已完成，则next会被立即调用
			this._fire(nextPromise);
		}else{
			// 否则将会被加入队列中
			this.thens.push(nextPromise);
		}
		return nextPromise;
	},
	delay: function(ms){
		return this.then(function(obj){
			var promise = new Promise();
			setTimeout(function(){
				promise.resolve(obj);
			}, ms);
			return promise;
		});
	}
};

exports.Promise = Promise;
