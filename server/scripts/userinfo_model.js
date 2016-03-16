
// var greetings = {
//     "0": ["凡事只要持之以恒，定有回报｡", "还在忙碌的你，辛苦了｡", "乐观面对压力和挑战，你能行!", "生命因磨炼而美丽｡"],
//     "1": ["每天叫醒自己的不是闹钟，而是梦想｡", "早晨的阳光，和今天一样充满希望｡", "新的一天，全力以赴地去奋斗吧!", "给胃一点营养，才能活力百倍｡"],
//     "2": ["梦想还是要有的，万一实现了呢?", "不忘初心，方得始终｡", "抬眼望窗外，世界很大，风景很美｡", "有舍才有得，不舍则不得｡", "窗外鸟语花香，内心阳光明媚｡"],
//     "3": ["能支配灵魂的，是自己的内心｡", "宝剑锋从磨砺出，梅花香自苦寒来｡", "人生适当健忘，难得糊涂｡", "松一松紧张的发条吧!"],
//     "4": ["中午休息一下，精力更充沛｡", "喜欢就会放肆，但爱就是克制｡", "倦了听点歌，让心情换个频道｡", "自然简单，乐观积极面对一切｡"],
//     "5": ["你可以输，但你绝不能放弃｡", "看看窗外，稍作休息｡", "倘若只是喜欢，何必夸张成爱｡", "要么你去驾驭压力，要么压力驾驭你｡", "万法相互缘起，世事不必强求｡"],
//     "6": ["当断不断，反受其乱｡", "再忙也别忘了享用晚餐｡", "家人的等候，是夜晚不变的牵挂｡", "一念放下，万般自在｡"],
//     "7": ["夜已深，正在奋斗的你早些休息｡", "往好处看，往大处想，往细处察，往深处解｡", "还在忙碌的你，辛苦了｡", "乐观的心态助你更有效率｡"]
// };

var greetings = {
    "0": [
            "天道酬勤，定有回报｡", 
            "张弛有道，一切方得长远｡", 
            "乐观面对压力和挑战，你能行!", 
            "调整好自己，迎接新的一天｡"
        ],
    "1": [
            "每天给自己一个小期许，日进一步｡", 
            "早晨时光贵如金，寸金难买寸光阴｡", 
            "清晨空气最醒神，为梦想加油吧!", 
            "享一份早餐，得健康好心情｡"
        ],
    "2": [
            "天行健，君子以自强不息｡", 
            "答应自己，会向着一切美好前行｡", 
            "平常心让未来到来，让过去过去｡", 
            "非学无以广才，非志无以成学｡", 
            "梦想还是要有的，万一实现了呢?"
        ],
    "3": [
            "不能改变天气，但你可以左右心情｡", 
            "常怀感恩，总会有不期而遇的温暖｡", 
            "每一种创伤，都是一种成熟｡", 
            "窗外远眺，让眼睛休息一下吧!"
        ],
    "4": [
            "累了倦了，听点歌来提提神｡", 
            "万法相互缘起，世事不必强求｡", 
            "种如是因，收如是果，一切唯心造｡",
            "中午休息一下，精力更充沛｡"
        ],
    "5": [
            "再忙碌的工作，记得偶尔放松一下｡", 
            "适当放下但不放弃，是智慧｡", 
            "你可以输，但你绝不能放弃｡", 
            "不开心时请看看窗外，天地高阔｡", 
            "倘若只是喜欢，何必夸张成爱｡"
        ],
    "6": [
            "家人的等候，是夜晚不变的牵挂｡", 
            "只要面对现实，你才能超越现实｡", 
            "一念放下，万般自在｡", 
            "再忙也别忘了享用晚餐｡"
        ],
    "7": [
            "不经一番寒彻骨，怎得梅花扑鼻香｡", 
            "辛苦了，早些休息吧!",
             "最暗的夜，才能看见最美的星光｡", 
             "今日的坚持，岁月都将会给你回报｡"
        ]
};

var UserModel = function(){
};

UserModel.prototype.getGreetingString = function () {
	var hoursList = "700000112233344555566677";
	var category = hoursList.charAt(new Date().getHours());
	var index = parseInt(Math.random() * 10) % greetings[category].length;
	return greetings[category][index];
};
    
UserModel.prototype.getTemplateConf = function(home) {
	var conf = this.conf;

	if(conf){
		return conf;
	}

	conf = Object.create(null);
	conf.template = "userinfo.ejs";
	conf.data = {
		sid: home.getSid(),	// not good
		userImageUrl: "",
		userName: ""
	};

	conf.data.greetingString = this.getGreetingString();

	return (this.conf = conf);
};

if(module && module.exports) {
	module.exports = UserModel;
}
