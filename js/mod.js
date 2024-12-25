let modInfo = {
	name: "数一亿粒米树",
	id: "countrice",
	author: "loader3229",
	pointsName: "粒米",
	modFiles: ["layers.js", "tree.js"],

	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal (0), // Used for hard resets and new players
	offlineLimit: 1,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.6",
	name: "1",
}

let changelog = ``

let winText = `Congratulations! You have reached the end and beaten this game, but for now...`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return true
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)

	let gain = buyableEffect("p",11).mul(buyableEffect("p",12)).add(layers.s.effect6());
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
	inactive: new Decimal(0)
}}

// Display extra things at the top of the page
var displayThings = [
	"作者：loader3229",
	function(){
		if(getLevel().gte(10))return "米袋储量："+formatWhole(player.inactive);return "";
	},
	function(){
		if(getRank().gte(1e8)){
			sc="3级折算|";
			return "您已经完成"+formatWhole(getRank())+"个"+sc+"目标";
		}
		if(getRank().gte(1)){
			let p=["一","十","一百","一千"];
			let q=["亿","兆","京","垓","秭","穰","沟","涧","正","载","极"];
			let s=formatWhole(getRankRequirement(getRank().add(1)));
			let sc="";
			let st=formatWhole(getRequirement(getLevel()));
			if(getRank().lt(44)){
				let r=getRank().toNumber();
				s=p[r%4]+q[Math.floor(r/4)];
			}
			if(getRank().gte(300)){
				sc="1级折算|";
			}
			if(getRank().gte(3912)){
				sc="2级折算|";
				st=formatWhole(player.points);
			}
			if(getRank().gte(10000)){
				sc="3级折算|";
			}
			return sc+"目标"+formatWhole(getRank().add(1))+"：数"+s+"粒米！当前："+st+"/"+formatWhole(getRankRequirement(getRank().add(1)))+"("+format(getRequirement(getLevel()).div(getRankRequirement(getRank().add(1))).mul(100),5)+"%)";
		}
		return "目标：数一亿粒米！当前："+formatWhole(getRequirement(getLevel()))+"/"+formatWhole(1e8)+"("+format(getRequirement(getLevel()).div(1e6),5)+"%)";
	},
	function(){
		let level=getLevel();
		let req1=getRequirement(level);
		let req2=getRequirement(level.add(1)).sub(req1);
		let prog=player.points.sub(req1);
		if(level.gte(1e8))return "您已经填满"+formatWhole(level)+"桶米";
		return "当前为第"+formatWhole(level.add(1))+"桶米，进度："+formatWhole(prog)+"/"+formatWhole(req2)+"("+format(prog.div(req2).mul(100),5)+"%)";
	},
	function(){
		if(player.points.gte("e2.2e16"))return "如果您每秒写3个数字，写下您数的米的数量需要的时间，<br>太阳系绕银河系旋转了"+format(player.points.add(1).log10().add(1).floor().div(2.2e16))+"圈。";
		if(player.points.gte("1e9467085600"))return "如果您每秒写3个数字，写下您数的米的数量需要"+format(player.points.add(1).log10().add(1).floor().div(9467085600))+"世纪。";
		if(player.points.gte("1e94670856"))return "如果您每秒写3个数字，写下您数的米的数量需要"+format(player.points.add(1).log10().add(1).floor().div(94670856))+"年。";//365.2425
		if(player.points.gte("1e7889238"))return "如果您每秒写3个数字，写下您数的米的数量需要"+format(player.points.add(1).log10().add(1).floor().div(7889238))+"个月。";//365.2425/12
		if(player.points.gte("1e259200"))return "如果您每秒写3个数字，写下您数的米的数量需要"+format(player.points.add(1).log10().add(1).floor().div(259200))+"天。";
		if(player.points.gte("1e10800"))return "如果您每秒写3个数字，写下您数的米的数量需要"+format(player.points.add(1).log10().add(1).floor().div(10800))+"小时。";
		if(player.points.gte(1e180))return "如果您每秒写3个数字，写下您数的米的数量需要"+format(player.points.add(1).log10().add(1).floor().div(180))+"分钟。";
		
		if(player.points.gte(1e200))return "如果一粒米的体积为1普朗克体积，您数的米相当于"+format(player.points.floor().div(1e200))+"个维度。";
		if(player.points.gte(1e176))return "如果一粒米的体积为1普朗克体积，您数的米相当于"+format(player.points.floor().div(1e176))+"个可观测宇宙。";
		
		if(player.points.gte(4e161))return "如果一粒米的体积为"+format(player.points.floor().pow(-1).mul(1e176))+"普朗克体积，您数的米相当于1个可观测宇宙。";
		if(player.points.gte(4e152))return "如果一粒米的体积为"+format(player.points.floor().pow(-1).mul(4e161))+"qm³，您数的米相当于1个可观测宇宙。";
		if(player.points.gte(4e143))return "如果一粒米的体积为"+format(player.points.floor().pow(-1).mul(4e152))+"rm³，您数的米相当于1个可观测宇宙。";
		if(player.points.gte(4e134))return "如果一粒米的体积为"+format(player.points.floor().pow(-1).mul(4e143))+"ym³，您数的米相当于1个可观测宇宙。";
		if(player.points.gte(4e125))return "如果一粒米的体积为"+format(player.points.floor().pow(-1).mul(4e134))+"zm³，您数的米相当于1个可观测宇宙。";
		if(player.points.gte(4e116))return "如果一粒米的体积为"+format(player.points.floor().pow(-1).mul(4e125))+"am³，您数的米相当于1个可观测宇宙。";
		if(player.points.gte(4e107))return "如果一粒米的体积为"+format(player.points.floor().pow(-1).mul(4e116))+"fm³，您数的米相当于1个可观测宇宙。";
		if(player.points.gte(4e98))return "如果一粒米的体积为"+format(player.points.floor().pow(-1).mul(4e107))+"pm³，您数的米相当于1个可观测宇宙。";
		if(player.points.gte(4e89))return "如果一粒米的体积为"+format(player.points.floor().pow(-1).mul(4e98))+"nm³，您数的米相当于1个可观测宇宙。";
		if(player.points.gte(4e80))return "如果一粒米的体积为"+format(player.points.floor().pow(-1).mul(4e89))+"μm³，您数的米相当于1个可观测宇宙。";
		if(player.points.gte(2e79))return "如果一粒米的体积为"+format(player.points.floor().pow(-1).mul(4e80))+"mm³，您数的米相当于1个可观测宇宙。";
		if(player.points.gte(1e60))return "如果一粒米的体积为20mm³，您数的米相当于"+format(player.points.floor().div(1e60))+"个银河系。";
		
		if(player.points.gte(1.469e48))return "如果一粒米的体积为20mm³，您数的米相当于"+format(player.points.floor().div(1.469e48))+"立方秒差距。";
		if(player.points.gte(4.233e46))return "如果一粒米的体积为20mm³，您数的米相当于"+format(player.points.floor().div(4.233e46))+"立方光年。";
		if(player.points.gte(1.674e41))return "如果一粒米的体积为20mm³，您数的米相当于"+format(player.points.floor().div(1.674e41))+"立方天文单位。";
		
		if(player.points.gte(5.649e32))return "如果一粒米的体积为20mm³，您数的米可以填满"+format(player.points.floor().div(5.649e32))+"个太阳。";
		if(player.points.gte(6.122e29))return "如果一粒米的体积为20mm³，您数的米可以填满"+format(player.points.floor().div(6.122e29))+"个木星。";
		if(player.points.gte(4.347e26))return "如果一粒米的体积为20mm³，您数的米可以填满"+format(player.points.floor().div(4.347e26))+"个地球。";
		if(player.points.gte(6.568e25))return "如果一粒米的体积为20mm³，您数的米可以填满"+format(player.points.floor().div(6.568e25))+"个火星。";
		if(player.points.gte(2.431e25))return "如果一粒米的体积为20mm³，您数的米可以填满"+format(player.points.floor().div(2.431e25))+"个水星。";
		if(player.points.gte(2.788e24))return "如果一粒米的体积为20mm³，您数的米可以填满"+format(player.points.floor().div(2.788e24))+"个冥王星。";
		
		if(player.points.gte(2e16))return "如果一粒米的体积为20mm³，您数的米相当于"+format(player.points.floor().div(2e16))+"个城市。";
		if(player.points.gte(1e14))return "如果一粒米的体积为20mm³，您数的米相当于"+format(player.points.floor().div(1e14))+"个小区。";
		if(player.points.gte(1e12))return "如果一粒米的体积为20mm³，您数的米可以填满"+format(player.points.floor().div(1e12))+"栋楼房。";
		if(player.points.gte(5e10))return "如果一粒米的体积为20mm³，您数的米可以填满"+format(player.points.floor().div(5e10))+"个房子。";
		if(player.points.gte(4e9))return "如果一粒米的体积为20mm³，您数的米可以填满"+format(player.points.floor().div(4e9))+"个房间。";
		if(player.points.gte(1e7))return "如果一粒米的体积为20mm³，您数的米可以填满"+format(player.points.floor().div(1e7))+"个冰箱。";
		if(player.points.gte(5e5))return "如果一粒米的体积为20mm³，您数的米可以填满"+format(player.points.floor().div(5e5))+"个柜子。";
		if(player.points.gte(25e3))return "如果一粒米的体积为20mm³，您数的米可以填满"+format(player.points.floor().div(25e3))+"个饮料瓶。";
		if(player.points.gte(5e3))return "如果一粒米的体积为20mm³，您数的米可以填满"+format(player.points.floor().div(5e3))+"个杯子。";
		return "如果一粒米的体积为20mm³，您数的米可以填满"+format(player.points.floor().div(50))+"个勺子。";
	},
]

// Determines when the game "ends"
function isEndgame() {
	return player.points.gte(new Decimal("e280000000"))
}



// Less important things beyond this point!

// Style for the background, can be a function
var backgroundStyle = {

}

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}


function getLevel(c=player.points){
	c=new Decimal(c);
	if(c.gte(Decimal.pow(10,35622.24815))){
		let p=c;
		p=p.log10().div(35622.24815).pow(1/0.65).mul(1e9);
		return p.floor();
	}
	if(c.gte(Number.MAX_VALUE)){
		let p=c;
		p=p.log10().div(Math.log10(2)*1024).add(0.31).div(1.31).pow(1/0.6).mul(569500);
		return p.floor().min(999999999);
	}
	if(c.gte(1e307)){
		let p=c;
		p=p.log10().sub(304.6963).div(2.3037).ln().mul(2.3037).div(0.0002713).add(565808);
		return p.floor().min(569499);
	}
	if(c.gte(1e8)){
		let p=c.div(1e4).floor().mul(1e4).add(5e3);
		p=p.log10().mul(6).add(1).pow(2).sub(1).div(6).sub(300);
		return p.floor();
	}
	if(c.gte(4e4)){
		let p=c.div(1e4).floor().mul(1e4).add(5e3);
		p=Decimal.pow(10,p.log10().div(4).sub(1).pow(1/0.59).add(1));
		return p.floor();
	}
	if(c.gte(2e4))return new Decimal(10);
	if(c.gte(1e4))return new Decimal(9);
	if(c.gte(5000))return new Decimal(8);
	if(c.gte(2000))return new Decimal(7);
	if(c.gte(1000))return new Decimal(6);
	if(c.gte(500))return new Decimal(5);
	if(c.gte(200))return new Decimal(4);
	if(c.gte(100))return new Decimal(3);
	if(c.gte(40))return new Decimal(2);
	if(c.gte(10))return new Decimal(1);
	return new Decimal(0);
}

function getELevel(){
	return getLevel(player.e.points);
}

function getRank(){
	let r=getLevel().add(300).mul(6).add(1).sqrt().sub(1).div(6).sub(7).max(0).floor();
	if(r.gte(3912)){
		r=getLevel().mul(40).add(41e8).sqrt().sub(1e4).div(20).max(0).floor();
	}
	if(r.gte(10000)){
		r=getLevel().div(10).sqrt().max(0).floor();
	}
	return r;
}

function getTier(){
	let r=getRank().sub(400).div(60).max(0).floor();
	if(r.gte(10)){
		r=getRank().div(10).sqrt().max(0).floor();
	}
	return r;
}

function getRequirement(c){
	c=new Decimal(c);
	if(c.gte(1e9)){
		let p=Decimal.pow(10,c.div(1e9).pow(0.65).mul(35622.24815));
		return p;
	}
	if(c.gte(569500)){
		let p=Decimal.pow(10,c.div(569500).pow(0.6).mul(1.31).sub(0.31).mul(Math.log10(2)*1024));
		return p;
	}
	if(c.gte(565808)){
		let p=Decimal.pow(10,c.sub(565808).mul(0.0002713).div(2.3037).exp().mul(2.3037).add(304.6963));
		return p;
	}
	if(c.gte(100)){
		let p=Decimal.pow(10,c.add(300).mul(6).add(1).sqrt().sub(1).div(6));
		p=p.div(1e4).round().mul(1e4);
		return p;
	}
	if(c.gte(11)){
		let p=Decimal.pow(10,c.log10().sub(1).pow(0.59).add(1).mul(4));
		p=p.div(1e4).round().mul(1e4);
		return p;
	}
	if(c.lte(0))return new Decimal(0);
	if(c.lte(1))return new Decimal(10);
	if(c.lte(2))return new Decimal(40);
	if(c.lte(3))return new Decimal(100);
	if(c.lte(4))return new Decimal(200);
	if(c.lte(5))return new Decimal(500);
	if(c.lte(6))return new Decimal(1000);
	if(c.lte(7))return new Decimal(2000);
	if(c.lte(8))return new Decimal(5000);
	if(c.lte(9))return new Decimal(1e4);
	if(c.lte(10))return new Decimal(2e4);
	if(c.lte(11))return new Decimal(4e4);
}

function getRankRequirement(c,x){
	c=new Decimal(c);let f=new Decimal(0);
	if(c.lte(0))return new Decimal(0);
	if(c.lte(3912)){
		c=c.add(7);
		f=c.pow(2).mul(6).add(c).add(c).sub(300);
	}else if(c.lt(10000)){
		f=c.pow(2).mul(10).add(c.mul(10000)).sub(1e8);
	}else{
		f=c.pow(2).mul(10);
	}
	if(x)return f;
	return getRequirement(f);
}

function getTierRequirement(c){
	c=new Decimal(c);let f=new Decimal(0);
	if(c.lt(10)){
		f=c.mul(60).add(400);
	}else{
		f=c.pow(2).mul(10);
	}
	return f;
}

function getRankEffect2(){
	if(getRank().gte(480))return Decimal.pow(getRank().div(25),getRank().div(2));
	if(getRank().gte(159))return Decimal.pow(getRank().div(53).mul(9),getRank().div(3));
	if(getRank().gte(99))return Decimal.pow(4,getRank().sub(33).max(0));
	if(getRank().gte(84))return Decimal.pow(3.5,getRank().sub(26).max(0));
	if(getRank().gte(46))return Decimal.pow(3,getRank().sub(18).max(0));
	if(getRank().gte(22))return Decimal.pow(2.5,getRank().sub(12.5).max(0));
	return Decimal.pow(2,getRank().sub(9.5).max(0));
}