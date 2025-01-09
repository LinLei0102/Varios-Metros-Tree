addLayer("p", {
    name: "P", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "数米", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
		best: new Decimal(0),
    }},
    color: "#FFFFFF",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "金币", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult(a) { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
		if(getTier().gte(21))mult = mult.mul(getLevel());else mult = mult.mul(getLevel().div(2).max(1));
		if(getTier().gte(21))mult = mult.mul(getRank());else if(getRank().gte(15))mult = mult.mul(getRank().div(2).max(1));else mult = mult.mul(getRank().div(5).add(1));
		if(getTier().gte(7))mult = mult.mul(getTier());
		if(getELevel().gte(55000000))mult = mult.mul(getELevel()); else if(getELevel().gte(1500))mult = mult.mul(getELevel().div(100).max(1)); else mult = mult.mul(getELevel().sqrt().div(4).max(1));
		if(hasAchievement("a",111))mult = mult.mul(player.a.points.add(1));else if(hasAchievement("a",11))mult = mult.mul(player.a.points.div(10).add(1));
		mult = mult.mul(layers.s.effect3());
		if(hasAchievement("a",14) && a)mult = mult.mul(2);
		if(hasAchievement("a",24) && a)mult = mult.mul(2);
		if(hasAchievement("a",34) && a)mult = mult.mul(2);
		if(hasAchievement("a",44) && a)mult = mult.mul(2);
		mult = mult.mul(buyableEffect("t",11));
		if(getLevel().gte(25) && a)mult = mult.mul(2);
		if(getRank().gte(6) && a)mult = mult.mul(2);
		if(getELevel().gte(1.3e8))mult = mult.mul(10);else if(getLevel().gte(30) && Math.random()<getLevel().mul(200).cbrt().div((getLevel().gte(50) && a)?100:200).max(0.1).min(2).toNumber())mult = mult.mul(2);
		mult = mult.mul(layers.x.effect());
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
    ],
	clickables: {
            11: {
                title: "开始数米",
                display(){
					return "+"+formatWhole(buyableEffect("p",11))+"粒米";
				},
                unlocked() { return true}, 
				canClick(){return true},
				onClick(){
					player.points=player.points.add(buyableEffect("p",11));
					if(getLevel().gte(25)){
						player.p.points=player.p.points.add(layers.p.gainMult(1));
					}else if(getLevel().gte(1)){
						if(Math.random()<getLevel().mul(3).sqrt().div(10).min(2).toNumber())player.p.points=player.p.points.add(layers.p.gainMult(1));
					}
				},
                style: {'height':'100px','width':'150px'},
            },
            12: {
                title: "释放米袋",
                display(){
					return "+"+formatWhole(player.inactive)+"粒米";
				},
                unlocked() { return getLevel().gte(10)}, 
				canClick(){return true},
				onClick(){
					player.points=player.points.add(player.inactive);player.inactive=new Decimal(0);
				},
                style: {'height':'100px','width':'150px'},
            },
            13: {
                title: "自动购买数米能力",
                display(){
					return player.p.a1?("已开启"):"已关闭";
				},
                unlocked() { return getLevel().gte(20) && getRank().lt(70000)}, 
				canClick(){return true},
				onClick(){
					player.p.a1=!player.p.a1;
				},
                style: {'height':'100px','width':'150px'},
            },
            14: {
                title: "自动购买自动数米",
                display(){
					return player.p.a2?("已开启"):"已关闭";
				},
                unlocked() { return getELevel().gte(100) && getRank().lt(70000)}, 
				canClick(){return true},
				onClick(){
					player.p.a2=!player.p.a2;
				},
                style: {'height':'100px','width':'150px'},
            },
            21: {
                title: "自动购买米袋升级",
                display(){
					return player.p.a3?("已开启"):"已关闭";
				},
                unlocked() { return getRank().gte(10) && getRank().lt(70000)}, 
				canClick(){return true},
				onClick(){
					player.p.a3=!player.p.a3;
				},
                style: {'height':'100px','width':'150px'},
            },
            22: {
                title: "自动购买数米加成",
                display(){
					return player.p.a4?("已开启"):"已关闭";
				},
                unlocked() { return getRank().gte(50) && getRank().lt(70000)}, 
				canClick(){return true},
				onClick(){
					player.p.a4=!player.p.a4;
				},
                style: {'height':'100px','width':'150px'},
            },
            23: {
                title: "自动购买自动数米加成",
                display(){
					return player.p.a5?("已开启"):"已关闭";
				},
                unlocked() { return getRank().gte(70) && getRank().lt(70000)}, 
				canClick(){return true},
				onClick(){
					player.p.a5=!player.p.a5;
				},
                style: {'height':'100px','width':'150px'},
            },
            24: {
                title: "自动购买米袋加成",
                display(){
					return player.p.a6?("已开启"):"已关闭";
				},
                unlocked() { return getRank().gte(185) && getRank().lt(70000)}, 
				canClick(){return true},
				onClick(){
					player.p.a6=!player.p.a6;
				},
                style: {'height':'100px','width':'150px'},
            },
	},
	update(diff){
		if(getLevel().gte(5)){
			if(Math.random()<getLevel().mul(3).sqrt().div(10).min(2).toNumber())player.p.points=player.p.points.add(layers.p.gainMult().mul(diff).mul(buyableEffect("p",12)));
		}
		if(getLevel().gte(10)){
			player.inactive=player.inactive.add(buyableEffect("p",11).mul(buyableEffect("p",12)).mul(buyableEffect("p",21)).mul(diff));
		}
		if(getRank().gte(2)){
			if(player.s.a1)player.s.points=player.s.points.add(player.inactive.mul(new Decimal(1).sub(getRank().sqrt().mul(0.1).add(1).pow(-diff))));
			else player.points=player.points.add(player.inactive.mul(new Decimal(1).sub(getRank().sqrt().mul(0.1).add(1).pow(-diff))));
			player.inactive=player.inactive.mul(getRank().sqrt().mul(0.1).add(1).pow(-diff)).max(0);
		}
		player.p.best=player.p.best.max(player.p.points);
		if(getRank().gte(70000)){
			delete player.p.a1;
			delete player.p.a2;
			delete player.p.a3;
			delete player.p.a4;
			delete player.p.a5;
			delete player.p.a6;
			player.p.buyables[11]=player.p.buyables[11].add(player.p.points.mul(layers.t.buyables[23].effect()).mul(layers.t.buyables[21].effect()).mul(diff));
			player.p.buyables[12]=player.p.buyables[12].add(player.p.points.root(4).mul(layers.t.buyables[21].effect()).mul(diff));
			player.p.buyables[13]=player.p.buyables[13].add(player.p.points.root(6).mul(layers.t.buyables[21].effect()).mul(diff));
			player.p.buyables[21]=player.p.buyables[21].add(player.p.points.root(3).mul(layers.t.buyables[21].effect()).mul(diff));
			player.p.buyables[22]=player.p.buyables[22].add(player.p.points.root(9).mul(layers.t.buyables[21].effect()).mul(diff));
			player.p.buyables[23]=player.p.buyables[23].add(player.p.points.root(12).mul(layers.t.buyables[21].effect()).mul(diff));
		}else if(getRank().gte(440)){
			let auto_enabled=0;
			for(let i=1;i<=6;i++)if(player.p["a"+i])auto_enabled++;
			if(auto_enabled>0){
				let max_price=player.p.points.div(buyableEffect("t",21)).div(auto_enabled).mul(0.5);
				if(player.p.a1){
					let tmp=max_price.div(layers.t.buyables[23].effect()).ceil();
					player.p.buyables[11]=player.p.buyables[11].add(tmp);
					if(player.p.points.lte("ee10"))player.p.points=player.p.points.sub(tmp.mul(layers.t.buyables[23].effect()).mul(buyableEffect("t",21)));
				}
				if(player.p.a2){
					let target=max_price.mul(8).add(player.p.buyables[12].pow(4)).root(4).floor().max(player.p.buyables[12]);
					if(player.p.points.lte("ee10"))player.p.points=player.p.points.sub(target.pow(4).sub(player.p.buyables[12].pow(4)).div(8).mul(buyableEffect("t",21)));
					player.p.buyables[12]=target;
				}
				if(player.p.a3){
					let target=max_price.add(player.p.buyables[21].pow(3)).cbrt().floor().max(player.p.buyables[21]);
					if(player.p.points.lte("ee10"))player.p.points=player.p.points.sub(target.pow(3).sub(player.p.buyables[21].pow(3)).mul(buyableEffect("t",21)));
					player.p.buyables[21]=target;
				}
				if(player.p.a4){
					let target=max_price.add(player.p.buyables[13].pow(6)).root(6).floor().max(player.p.buyables[13]);
					if(player.p.points.lte("ee10"))player.p.points=player.p.points.sub(target.pow(6).sub(player.p.buyables[13].pow(6)).mul(buyableEffect("t",21)));
					player.p.buyables[13]=target;
				}
				if(player.p.a5){
					let target=max_price.add(player.p.buyables[22].pow(9)).root(9).floor().max(player.p.buyables[22]);
					if(player.p.points.lte("ee10"))player.p.points=player.p.points.sub(target.pow(9).sub(player.p.buyables[22].pow(9)).mul(buyableEffect("t",21)));
					player.p.buyables[22]=target;
				}
				if(player.p.a6){
					let target=max_price.add(player.p.buyables[23].pow(12)).root(12).floor().max(player.p.buyables[23]);
					if(player.p.points.lte("ee10"))player.p.points=player.p.points.sub(target.pow(12).sub(player.p.buyables[23].pow(12)).mul(buyableEffect("t",21)));
					player.p.buyables[23]=target;
				}
			}
		}else{
			if(getLevel().gte(20)&&player.p.a1){
				let tmp=player.p.points.div(layers.t.buyables[23].effect().mul(buyableEffect("t",21).max(0.01)).mul(101)).ceil();
				if(tmp.mul(layers.t.buyables[23].effect()).gte(player.p.points))return;
				player.p.buyables[11]=player.p.buyables[11].add(tmp);
				player.p.points=player.p.points.sub(tmp.mul(layers.t.buyables[23].effect()).mul(buyableEffect("t",21).max(0.01)));
			}
			if(getRank().gte(32)&&player.p.a2){
				let target=player.p.points.mul(player.p.buyables[12].gte(1e15)?7:8).add(player.p.buyables[12].pow(4)).root(4).floor().max(player.p.buyables[12]);
				if(player.p.points.gte(target.pow(4).sub(player.p.buyables[12].pow(4)).div(8))){
					player.p.points=player.p.points.sub(target.pow(4).sub(player.p.buyables[12].pow(4)).div(8).mul(buyableEffect("t",21)));
					player.p.buyables[12]=target;
				}
			}else if(getELevel().gte(100)&&player.p.a2){
				if(player.p.points.gte(layers.p.buyables[12].cost())){
					player.p.points=player.p.points.sub(layers.p.buyables[12].cost().mul(buyableEffect("t",21)));
					player.p.buyables[12]=player.p.buyables[12].add(1);
				}
			}
			if(getRank().gte(21)&&player.p.a3){
				let target=player.p.points.div(10).add(player.p.buyables[21].pow(3)).cbrt().floor().max(player.p.buyables[21]);
				if(player.p.points.gte(target.pow(3).sub(player.p.buyables[21].pow(3)))){
					player.p.points=player.p.points.sub(target.pow(3).sub(player.p.buyables[21].pow(3)).mul(buyableEffect("t",21)));
					player.p.buyables[21]=target;
				}
			}else if(getRank().gte(10)&&player.p.a3){
				if(player.p.points.gte(layers.p.buyables[21].cost().mul(10))){
					player.p.points=player.p.points.sub(layers.p.buyables[21].cost().mul(buyableEffect("t",21)));
					player.p.buyables[21]=player.p.buyables[21].add(1);
				}
			}
			if(getRank().gte(50)&&player.p.a4){
				let target=player.p.points.div(2).add(player.p.buyables[13].pow(6)).root(6).floor().max(player.p.buyables[13]);
				if(player.p.points.gte(target.pow(6).sub(player.p.buyables[13].pow(6)))){
					player.p.points=player.p.points.sub(target.pow(6).sub(player.p.buyables[13].pow(6)).mul(buyableEffect("t",21)));
					player.p.buyables[13]=target;
				}
			}
			if(getRank().gte(70)&&player.p.a5){
				let target=player.p.points.add(player.p.buyables[22].pow(9)).root(9).floor().max(player.p.buyables[22]);
				if(player.p.points.gte(target.pow(9).sub(player.p.buyables[22].pow(9)))){
					player.p.points=player.p.points.sub(target.pow(9).sub(player.p.buyables[22].pow(9)).mul(buyableEffect("t",21)));
					player.p.buyables[22]=target;
				}
			}
			if(getRank().gte(185)&&player.p.a6){
				let target=player.p.points.add(player.p.buyables[23].pow(15)).root(15).floor().max(player.p.buyables[23]);
				if(player.p.points.gte(target.pow(15).sub(player.p.buyables[23].pow(15)))){
					player.p.points=player.p.points.sub(target.pow(15).sub(player.p.buyables[23].pow(15)).mul(buyableEffect("t",21)));
					player.p.buyables[23]=target;
				}
			}
		}
	},
	tabFormat: [
		"main-display",
		["display-text",function(){if(player.p.best.gte(Number.MAX_VALUE))return "您已经达到的最多的金币数量（"+format(player.p.best)+"）超过了无限，这使您的无限点数获取×"+format(Decimal.pow(2,player.p.best.add(2).log2().sqrt().sub(32).max(0)));return "";}],
		"clickables","buyables","milestones"
	],
    layerShown(){return true},
	buyables: {
            11: {
                title: "数米能力", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    let cost = layers.t.buyables[23].effect()
                    return cost
                },
				totalCost(){
					return player[this.layer].buyables[this.id].mul(layers.t.buyables[23].effect());
				},
                effect(x=player[this.layer].buyables[this.id]) { // Effects of owning x of the items, x is a decimal
					let eff = x.mul(player.i.buyables[this.id].add(1));
					if(getRank().gte(700))eff = eff.mul(layers.p.buyables[13].effect());
					if(getRank().gte(3240))eff = eff.mul(getLevel());
					if(player.x.points.gte(1024))eff = eff.mul(layers.x.effect());
					if(getELevel().gte(70000000))eff = eff.mul(getELevel());
					eff = eff.mul(layers.et.buyables[11].effect());
					if(getTier().gte(70))eff = eff.mul(layers.g.effect1());
					if(getTier().gte(144))eff = eff.mul(layers.s.effect1().pow(getTier().gte(250)?1:getTier().gte(183)?0.5:0.1));
					if(hasUpgrade("y",14))eff = eff.mul(buyableEffect("t",12));
					
					eff = Decimal.add(1, eff.pow(layers.g.effect2()));
					
					if(getRank().gte(4) && getRank().lt(3240))eff = eff.mul(getLevel().div(400));
					if(getRank().gte(7) && getRank().lt(700))eff = eff.mul(layers.p.buyables[13].effect());
					if(getRank().gte(365))eff = eff.mul((player.timePlayed/100000)**2+1);
					if(getELevel().gte(150) && getELevel().lt(70000000))eff = eff.mul(getELevel().div(100));
					if(!hasUpgrade("y",14))eff = eff.mul(buyableEffect("t",12));
					if(hasAchievement("a",124))eff = eff.mul(player.a.points.add(1));
					else if(hasAchievement("a",26))eff = eff.mul(player.a.points.div(10).add(1));
					eff = eff.mul(getRankEffect2());
					if(getTier().lt(144))eff = eff.mul(layers.s.effect1());
					eff = eff.mul(layers.n.effect());
					if(getTier().gte(4))eff = eff.mul(getTier());
					if(player.x.points.gte(16)&&player.x.points.lt(1024))eff = eff.mul(layers.x.effect());
					return eff;
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
					return "等级："+(getRank().gte(301)?"(":"")+formatWhole(player[this.layer].buyables[this.id])+(getRank().gte(301)?"×"+formatWhole(player.i.buyables[this.id].add(1).mul((getRank().gte(700))?(layers.p.buyables[13].effect()):1).mul((getRank().gte(3240))?(getLevel()):1).mul((getELevel().gte(70000000))?(getELevel()):1).mul((player.x.points.gte(1024))?(layers.x.effect()):1).mul((getTier().gte(70))?(layers.g.effect1()):1).mul((getTier().gte(144))?(layers.s.effect1().pow(getTier().gte(250)?1:getTier().gte(183)?0.5:0.1)):1).mul(hasUpgrade("y",14)?buyableEffect("t",12):1).mul(layers.et.buyables[11].effect()))+")":"")+(getRank().gte(100)?"<sup>"+format(layers.g.effect2())+"</sup>":"")+"\n\
					数米能力：" + formatWhole(data.effect) + "粒/次\n"+
					(getRank().gte(70000)?("+"+formatWhole(player.p.points.mul(layers.t.buyables[23].effect()).mul(layers.t.buyables[21].effect()))+"/s"):(data.cost.lt(1)?("1金币可以提升"+formatWhole(data.cost.recip())+"级"):("花费：" + formatWhole(data.cost) + " 金币"))+(getRank().gte(15)&&getRank().lt(70000)?("\n\
					当前总计花费：" + formatWhole(data.totalCost) + " 金币"):""));
                },
                unlocked() { return getLevel().gte(2) }, 
                canAfford() {
                    return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
                    player[this.layer].points = player[this.layer].points.sub(cost.mul(buyableEffect("t",21).max(0.1)))	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                    player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.add(cost) // This is a built-in system that you can use for respeccing but it only works with a single Decimal value
                },
                purchaseLimit: 9e15,
                style: {'height':'222px'},
            },
            12: {
                title: "自动数米", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    let cost = x.add(1).pow(3)
					if(getRank().gte(32))cost=x.pow(3).add(x).mul(0.5).add(x.pow(2).mul(0.75).add(0.125)).ceil();
                    return cost
                },
				totalCost(){
					if(getRank().gte(32))return player[this.layer].buyables[this.id].pow(4).div(8);
					return player[this.layer].buyables[this.id].mul(player[this.layer].buyables[this.id].add(1)).div(2).pow(2);
				},
                effect(x=player[this.layer].buyables[this.id]) { // Effects of owning x of the items, x is a decimal
					let eff = new Decimal(x).mul(player.i.buyables[this.id].add(1)).mul(layers.et.buyables[11].effect())
					eff = eff.mul(buyableEffect("p",22));
					eff = eff.mul(buyableEffect("t",22));
					if(hasAchievement("a",71))eff = eff.mul(buyableEffect("p",21).add(1));
					eff = eff.mul(layers.s.effect7());
					eff = eff.mul(layers.g.effect1());
					if(player.x.points.gte(4))eff = eff.mul(layers.x.effect());
					if(getTier().gte(6))eff = eff.mul(getTier());
					return eff;
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
					return "等级："+formatWhole(player[this.layer].buyables[this.id])+(getRank().gte(308)?"×"+formatWhole(player.i.buyables[this.id].add(1).mul(layers.et.buyables[11].effect())):"")+"\n\
					自动数米：" + formatWhole(data.effect) + "次/秒\n\
					花费：" + formatWhole(data.cost) + " 金币"+(getRank().gte(70000)?("\n+"+formatWhole(player.p.points.root(4).mul(layers.t.buyables[21].effect()))+"/s"):getRank().gte(15)?("\n\
					当前总计花费：" + formatWhole(data.totalCost) + " 金币"):"");
                },
                unlocked() { return getLevel().gte(5) }, 
                canAfford() {
                    return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
                    player[this.layer].points = player[this.layer].points.sub(cost.mul(buyableEffect("t",21)))	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                    player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.add(cost) // This is a built-in system that you can use for respeccing but it only works with a single Decimal value
                },
                purchaseLimit: 9e15,
                style: {'height':'222px'},
            },
            13: {
                title: "数米加成", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    let cost = x.add(1).pow(6)
					if(getRank().gte(48)){
						cost = x.pow(5).mul(6).add(x.pow(4).mul(15)).add(x.pow(3).mul(20)).add(x.pow(2).mul(15)).add(x.pow(1).mul(6)).add(1);
					}
                    return cost
                },
				totalCost(){
					if(getRank().gte(48))return player[this.layer].buyables[this.id].pow(6);
				},
                effect(x=player[this.layer].buyables[this.id]) { // Effects of owning x of the items, x is a decimal
					let eff = new Decimal(x).mul(player.i.buyables[this.id].add(1)).mul(layers.et.buyables[11].effect()).div(getRank().gte(55)?1:10).add(1);
					if(getRank().gte(700) && x.lte(1e40)){
						eff=eff.pow(x.max(1e20).log10().div(40));
					}
					return eff;
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
					if(getRank().gte(700)){
						return "等级："+formatWhole(player[this.layer].buyables[this.id])+(getRank().gte(315)?"×"+formatWhole(player.i.buyables[this.id].add(1).mul(layers.et.buyables[11].effect())):"")+"\n\
						数米能力等级变为原来的" + format(data.effect) + "倍\n\
						花费：" + formatWhole(data.cost) + " 金币"+(getRank().gte(70000)?("\n+"+formatWhole(player.p.points.root(6).mul(layers.t.buyables[21].effect()))+"/s"):getRank().gte(48)?("\n\
						当前总计花费：" + formatWhole(data.totalCost) + " 金币"):"");
					}
					return "等级："+formatWhole(player[this.layer].buyables[this.id])+(getRank().gte(315)?"×"+formatWhole(player.i.buyables[this.id].add(1)):"")+"\n\
					数米能力变为原来的" + format(data.effect) + "倍\n\
					花费：" + formatWhole(data.cost) + " 金币"+(getRank().gte(70000)?("\n+"+formatWhole(player.p.points.root(6).mul(layers.t.buyables[21].effect()))+"/s"):getRank().gte(48)?("\n\
					当前总计花费：" + formatWhole(data.totalCost) + " 金币"):"");
                },
                unlocked() { return getRank().gte(7) }, 
                canAfford() {
                    return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
                    player[this.layer].points = player[this.layer].points.sub(cost.mul(buyableEffect("t",21)))	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                    player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.add(cost) // This is a built-in system that you can use for respeccing but it only works with a single Decimal value
                },
                purchaseLimit: 9e15,
                style: {'height':'222px'},
            },
            21: {
                title: "米袋升级", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    let cost = x.add(1).pow(2).mul(10)
					if(getRank().gte(21)){
						cost = x.pow(2).add(x).mul(3).add(1);
					}
                    return cost
                },
				totalCost(){
					if(getRank().gte(21))return player[this.layer].buyables[this.id].pow(3);
					return player[this.layer].buyables[this.id].mul(player[this.layer].buyables[this.id].add(1)).mul(player[this.layer].buyables[this.id].mul(2).add(1)).div(6);
				},
                effect(x=player[this.layer].buyables[this.id]) { // Effects of owning x of the items, x is a decimal
					let eff = new Decimal(x).mul(player.i.buyables[this.id].add(1)).mul(layers.et.buyables[11].effect()).add(1).cbrt().div(4);
					if(getTier().gte(200)){
						if(eff.gte(1))eff=Decimal.pow(10,eff.log10().sqrt());
					}else{
						if(eff.gte(1))eff=eff.log10().add(1);
					}
					eff = eff.mul(buyableEffect("p",23));
					if(player.o.points.gte(6))eff = eff.mul(player.o.points);
					return eff;
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
					return "等级："+formatWhole(player[this.layer].buyables[this.id])+(getRank().gte(321)?"×"+formatWhole(player.i.buyables[this.id].add(1).mul(layers.et.buyables[11].effect())):"")+"\n\
					米袋倍数：" + format(data.effect.mul(4)) + "倍\n\
					花费：" + formatWhole(data.cost) + " 金币"+(getRank().gte(70000)?("\n+"+formatWhole(player.p.points.root(3).mul(layers.t.buyables[21].effect()))+"/s"):getRank().gte(15)?("\n\
					当前总计花费：" + formatWhole(data.totalCost) + " 金币"):"");
                },
                unlocked() { return getLevel().gte(15) }, 
                canAfford() {
                    return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
                    player[this.layer].points = player[this.layer].points.sub(cost.mul(buyableEffect("t",21)))	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                    player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.add(cost) // This is a built-in system that you can use for respeccing but it only works with a single Decimal value
                },
                purchaseLimit: 9e15,
                style: {'height':'222px'},
            },
            22: {
                title: "自动数米加成", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    let cost = x.add(1).pow(10)
					if(getRank().gte(65)){
						cost = x.pow(8).mul(9).add(x.pow(7).mul(36)).add(x.pow(6).mul(84)).add(x.pow(5).mul(126)).add(x.pow(4).mul(126)).add(x.pow(3).mul(84)).add(x.pow(2).mul(36)).add(x.pow(1).mul(9)).add(1);
					}
                    return cost
                },
				totalCost(){
					if(getRank().gte(65))return player[this.layer].buyables[this.id].pow(9);
				},
                effect(x=player[this.layer].buyables[this.id]) { // Effects of owning x of the items, x is a decimal
					let eff = new Decimal(x).mul(player.i.buyables[this.id].add(1)).mul(layers.et.buyables[11].effect()).div(getRank().gte(110)?1:10).add(1);
					return eff;
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
					return "等级："+formatWhole(player[this.layer].buyables[this.id])+(getRank().gte(327)?"×"+formatWhole(player.i.buyables[this.id].add(1).mul(layers.et.buyables[11].effect())):"")+"\n\
					自动数米速度变为原来的" + format(data.effect) + "倍\n\
					花费：" + formatWhole(data.cost) + " 金币"+(getRank().gte(70000)?("\n+"+formatWhole(player.p.points.root(9).mul(layers.t.buyables[21].effect()))+"/s"):getRank().gte(65)?("\n\
					当前总计花费：" + formatWhole(data.totalCost) + " 金币"):"");
                },
                unlocked() { return getRank().gte(17) }, 
                canAfford() {
                    return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
                    player[this.layer].points = player[this.layer].points.sub(cost.mul(buyableEffect("t",21)))	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                    player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.add(cost) // This is a built-in system that you can use for respeccing but it only works with a single Decimal value
                },
                purchaseLimit: 9e15,
                style: {'height':'222px'},
            },
            23: {
                title: "米袋加成", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    let cost = x.add(1).pow(15)
					if(getRank().gte(95)){
						cost = x.pow(14).mul(15)
						.add(x.pow(13).mul(105))
						.add(x.pow(12).mul(455))
						.add(x.pow(11).mul(1365))
						.add(x.pow(10).mul(3003))
						.add(x.pow(9).mul(5005))
						.add(x.pow(8).mul(6435))
						.add(x.pow(7).mul(6435))
						.add(x.pow(6).mul(5005))
						.add(x.pow(5).mul(3003))
						.add(x.pow(4).mul(1365))
						.add(x.pow(3).mul(455))
						.add(x.pow(2).mul(105))
						.add(x.pow(1).mul(15))
						.add(1);
					}
					if(getRank().gte(420)){
						cost = x.pow(11).mul(12);
					}
                    return cost
                },
				totalCost(){
					if(getRank().gte(440))return player[this.layer].buyables[this.id].pow(12);
					if(getRank().gte(95))return player[this.layer].buyables[this.id].pow(15);
				},
                effect(x=player[this.layer].buyables[this.id]) { // Effects of owning x of the items, x is a decimal
					let eff = new Decimal(x).mul(player.i.buyables[this.id].add(1)).mul(layers.et.buyables[11].effect()).mul(3).add(1).log10().add(1).sqrt().pow(hasAchievement("a",141)?1.1:1);
					if(getRank().gte(160))eff = new Decimal(x).mul(player.i.buyables[this.id].add(1)).mul(layers.et.buyables[11].effect()).mul(3).add(1).log10().add(1).pow(hasAchievement("a",141)?1.1:1);
					
					
					if(hasUpgrade("y",23)){
						eff = Decimal.pow(10,new Decimal(x).mul(player.i.buyables[this.id].add(1)).mul(layers.et.buyables[11].effect()).mul(3).add(1).log10().sqrt());
					}
					return eff;
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
					return "等级："+formatWhole(player[this.layer].buyables[this.id])+(getRank().gte(333)?"×"+formatWhole(player.i.buyables[this.id].add(1).mul(layers.et.buyables[11].effect())):"")+"\n\
					米袋速度变为原来的" + format(data.effect) + "倍\n\
					花费：" + formatWhole(data.cost) + " 金币"+(getRank().gte(70000)?("\n+"+formatWhole(player.p.points.root(12).mul(layers.t.buyables[21].effect()))+"/s"):getRank().gte(95)?("\n\
					当前总计花费：" + formatWhole(data.totalCost) + " 金币"):"");
                },
                unlocked() { return getRank().gte(23) }, 
                canAfford() {
                    return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
                    player[this.layer].points = player[this.layer].points.sub(cost.mul(buyableEffect("t",21)))	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                    player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.add(cost) // This is a built-in system that you can use for respeccing but it only works with a single Decimal value
                },
                purchaseLimit: 9e15,
                style: {'height':'222px'},
            },
	},
	milestones: [
		{
			requirementDescription: "完成1桶米",
            done() {return getLevel().gte(1)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "每次数米时30%概率获得1金币。";
			},
        },
		{
			requirementDescription: "完成2桶米",
            done() {return getLevel().gte(2)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "解锁第一个可购买项。";
			},
        },
		{
			requirementDescription: "完成3桶米",
            done() {return getLevel().gte(3)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "根据完成的米桶数增加金币获取数量。";
			},
        },
		{
			requirementDescription: "完成4桶米",
            done() {return getLevel().gte(4)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "根据完成的米桶数增加金币获取概率。";
			},
        },
		{
			requirementDescription: "完成5桶米",
            done() {return getLevel().gte(5)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "解锁第二个可购买项。";
			},
        },
		{
			requirementDescription: "完成10桶米",
            done() {return getLevel().gte(10)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "解锁米袋。";
			},
        },
		{
			requirementDescription: "完成15桶米",
            done() {return getLevel().gte(15)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "解锁第三个可购买项。";
			},
        },
		{
			requirementDescription: "完成20桶米",
            done() {return getLevel().gte(20)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "可以自动购买第一个可购买项。";
			},
        },
		{
			requirementDescription: "完成25桶米",
            done() {return getLevel().gte(25)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "手动数米一定可以获得金币，且手动数米的金币获取翻倍。";
			},
        },
		{
			requirementDescription: "完成30桶米",
            done() {return getLevel().gte(30)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "获得金币时有10%概率暴击。";
			},
        },
		{
			requirementDescription: "完成40桶米",
            done() {return getLevel().gte(40)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "获得金币时的暴击率随完成的米桶数而提高。";
			},
        },
		{
			requirementDescription: "完成50桶米",
            done() {return getLevel().gte(50)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "手动数米获得金币时的暴击率翻倍。";
			},
        },
		{
			requirementDescription: "完成70桶米",
            done() {return getLevel().gte(70)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "解锁成就。";
			},
        },
	]
})

addLayer("e", {
    name: "E", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "吃米", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#FF00FF",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "粒被吃掉的米", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult(a) { // Calculate the multiplier for main currency from bonuses
		if(buyableEffect("e",11)[0]===undefined)buyableEffect("e",11)[0]=new Decimal(0);
		if(buyableEffect("e",12)[0]===undefined)buyableEffect("e",12)[0]=new Decimal(0);
		if(buyableEffect("e",13)[0]===undefined)buyableEffect("e",13)[0]=new Decimal(0);
		if(buyableEffect("e",14)[0]===undefined)buyableEffect("e",14)[0]=new Decimal(0);
		if(buyableEffect("e",15)[0]===undefined)buyableEffect("e",15)[0]=new Decimal(0);
		if(buyableEffect("e",16)[0]===undefined)buyableEffect("e",16)[0]=new Decimal(0);
		if(buyableEffect("e",11)[1]===undefined)buyableEffect("e",11)[1]=new Decimal(0);
		if(buyableEffect("e",12)[1]===undefined)buyableEffect("e",12)[1]=new Decimal(0);
		if(buyableEffect("e",13)[1]===undefined)buyableEffect("e",13)[1]=new Decimal(0);
		if(buyableEffect("e",14)[1]===undefined)buyableEffect("e",14)[1]=new Decimal(0);
		if(buyableEffect("e",15)[1]===undefined)buyableEffect("e",15)[1]=new Decimal(0);
		if(buyableEffect("e",16)[1]===undefined)buyableEffect("e",16)[1]=new Decimal(0);
        mult = buyableEffect("e",11)[0].add(buyableEffect("e",12)[0]).add(buyableEffect("e",13)[0]).add(buyableEffect("e",14)[0]).add(buyableEffect("e",15)[0]).add(buyableEffect("e",16)[0]).mul(buyableEffect("e",11)[1]).mul(buyableEffect("e",12)[1]).mul(buyableEffect("e",13)[1]).mul(buyableEffect("e",14)[1]).mul(buyableEffect("e",15)[1]).mul(buyableEffect("e",16)[1]);
		mult = mult.mul(buyableEffect("t",13));
		if(hasAchievement("a",21))mult = mult.mul(buyableEffect("p",21).add(1));
		if(hasAchievement("a",127))mult = mult.mul(player.a.points.add(1));
		else if(hasAchievement("a",25))mult = mult.mul(player.a.points.div(10).add(1));
		if(getELevel().gte(600))mult = mult.mul(getELevel().div(100));
		mult = mult.mul(getRankEffect2());
		mult = mult.mul(layers.s.effect2());
		if(getTier().gte(3))mult = mult.mul(layers.n.effect());
		if(player.x.points.gte(16))mult = mult.mul(layers.x.effect());
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 2, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
    ],
	branches: ['p'],
	update(diff){
		player.t.points=getRank();
	},
	tabFormat: [
		"main-display",["display-text",function(){return "总计吃米能力："+formatWhole(layers.e.gainMult())+"*"+format(new Decimal(1).sub(player.e.points.div(getRequirement(getLevel()).max(1))).pow(2).mul(100).mul(getELevel().gte(8e10)?player.points.add(1).pow(0.5):getELevel().gte(3e10)?player.points.add(1).pow(0.4):getELevel().gte(1e9)?player.points.add(1).pow(1/3):getELevel().gte(1600000)?player.points.add(1).pow(0.3):getELevel().gte(800000)?player.points.add(1).pow(0.25):getELevel().gte(20000)?player.points.add(1).pow(0.2):getELevel().gte(12000)?player.points.add(1).pow(0.05):1).max(player.e.points.div(layers.e.gainMult().mul(1e30)).div(player.e.buyables[21].max(1))))+"%"}],
	["display-text",function(){
		let level=getELevel();
		let req1=getRequirement(level);
		let req2=getRequirement(level.add(1)).sub(req1);
		let prog=player.e.points.sub(req1);
		if(level.gte(1e8))return "您已经吃掉"+formatWhole(level)+"桶米";
		return "当前正在吃第"+formatWhole(level.add(1))+"桶米，进度："+formatWhole(prog)+"/"+formatWhole(req2)+"("+format(prog.div(req2).mul(100),5)+"%)";
	}],["display-text",function(){return "你有"+formatWhole(player.p.points)+"金币"}]
		,"clickables","buyables","milestones"
	],
    layerShown(){return getRank().gte(5)},
	getEffectiveEPoints(a=0){
		if(getLevel().lte(1))return new Decimal(0);
		a=new Decimal(a);
		if(a.div(getRequirement(getLevel())).lte(1e-7))return a;
		return a.div(getRequirement(getLevel())).add(1).pow(-1).sub(1).mul(-1).mul(getRequirement(getLevel()));
	},
	getRawEPoints(){
		if(getLevel().lte(1))return new Decimal(0);
		if(player.e.points.div(getRequirement(getLevel())).lte(1e-7))return player.e.points;
		return player.e.points.div(getRequirement(getLevel())).min(1).sub(1).pow(-1).add(1).mul(-1).mul(getRequirement(getLevel())).min(getRequirement(getLevel()).add(1).pow(2).mul(1e200));
	},
	update(diff){
		if(getELevel().gte(5)){
			player.e.points=layers.e.getEffectiveEPoints(layers.e.getRawEPoints().add(layers.e.gainMult().mul(getELevel().gte(8e10)?player.points.add(1).pow(0.5):getELevel().gte(3e10)?player.points.add(1).pow(0.4):getELevel().gte(1e9)?player.points.add(1).pow(1/3):getELevel().gte(1600000)?player.points.add(1).pow(0.3):getELevel().gte(800000)?player.points.add(1).pow(0.25):getELevel().gte(20000)?player.points.add(1).pow(0.2):getELevel().gte(12000)?player.points.add(1).pow(0.05):1).mul(buyableEffect("e",21)).mul(diff)));
		}
		if(getELevel().gte(300000)){
			delete player.e.a1;
			let target=player.p.points.root(3).floor();
			player.e.buyables[21]=player.e.buyables[21].max(target);
		}else if(getELevel().gte(4000)&&player.e.a1){
			let target=player.p.points.div(2).add(player.e.buyables[21].pow(4)).root(4).floor().max(player.e.buyables[21]);
			if(player.p.points.gte(target.pow(4).sub(player.e.buyables[21].pow(4)))){
				player.p.points=player.p.points.sub(target.pow(4).sub(player.e.buyables[21].pow(4)));
				player.e.buyables[21]=target;
			}
		}
		if(hasUpgrade("y",33)){
			player.e.buyables[11]=player.e.buyables[11].add(player.p.points.mul(diff));
			player.e.buyables[12]=player.e.buyables[12].add(player.p.points.mul(diff));
			player.e.buyables[13]=player.e.buyables[13].add(player.p.points.mul(diff));
			player.e.buyables[14]=player.e.buyables[14].add(player.p.points.mul(diff));
			player.e.buyables[15]=player.e.buyables[15].add(player.p.points.mul(diff));
			player.e.buyables[16]=player.e.buyables[16].add(player.p.points.mul(diff));
			player.e.buyables[21]=player.e.buyables[21].add(player.p.points.mul(diff));
		}else if(getELevel().gte(1.7e10)){
			for(let i=11;i<=16;i++){
				let target=player.p.points.add(1).pow(1/i).ceil();
				if(player.e.buyables[i].lte(target))player.e.buyables[i]=target;
			}
		}else if(getELevel().gte(200000)){
			let target=player.p.points.add(1).log(getELevel().gte(1.2e8)?1.01:getELevel().gte(3000000)?1.05:getELevel().gte(1200000)?1.15:1.25).max(0).ceil();
			if(player.e.buyables[11].lte(target))player.e.buyables[11]=target;
			target=player.p.points.add(1).log(getELevel().gte(1.2e8)?1.011:getELevel().gte(3000000)?1.06:getELevel().gte(1200000)?1.17:1.28).max(0).ceil();
			if(player.e.buyables[12].lte(target))player.e.buyables[12]=target;
			target=player.p.points.add(1).log(getELevel().gte(1.2e8)?1.012:getELevel().gte(3000000)?1.07:getELevel().gte(1200000)?1.19:1.31).max(0).ceil();
			if(player.e.buyables[13].lte(target))player.e.buyables[13]=target;
			target=player.p.points.add(1).log(getELevel().gte(1.2e8)?1.013:getELevel().gte(3000000)?1.08:getELevel().gte(1200000)?1.21:1.34).max(0).ceil();
			if(player.e.buyables[14].lte(target))player.e.buyables[14]=target;
			target=player.p.points.add(1).log(getELevel().gte(1.2e8)?1.014:getELevel().gte(3000000)?1.09:getELevel().gte(1200000)?1.23:1.37).max(0).ceil();
			if(player.e.buyables[15].lte(target))player.e.buyables[15]=target;
			target=player.p.points.add(1).log(getELevel().gte(1.2e8)?1.015:getELevel().gte(3000000)?1.1:getELevel().gte(1200000)?1.25:1.4).max(0).ceil();
			if(player.e.buyables[16].lte(target))player.e.buyables[16]=target;
		}
	},
	milestones: [
		{
			requirementDescription: "吃掉5桶米",
            done() {return getELevel().gte(5)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "解锁自动吃米。";
			},
        },
		{
			requirementDescription: "吃掉10桶米",
            done() {return getELevel().gte(10)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "解锁第二个吃米小鸟。";
			},
        },
		{
			requirementDescription: "吃掉15桶米",
            done() {return getELevel().gte(15)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "解锁第三个吃米小鸟。";
			},
        },
		{
			requirementDescription: "吃掉17桶米",
            done() {return getELevel().gte(17)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "吃掉的米桶数增加金币获取。";
			},
        },
		{
			requirementDescription: "吃掉25桶米",
            done() {return getELevel().gte(25)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "解锁第四个吃米小鸟。";
			},
        },
		{
			requirementDescription: "吃掉40桶米",
            done() {return getELevel().gte(40)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "吃米小鸟更便宜。";
			},
        },
		{
			requirementDescription: "吃掉50桶米",
            done() {return getELevel().gte(50)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "解锁第五个吃米小鸟。";
			},
        },
		{
			requirementDescription: "吃掉150桶米",
            done() {return getELevel().gte(150)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "吃掉的米桶数增加数米能力"+(getELevel().gte(70000000)?"等级。":"。");
			},
        },
		{
			requirementDescription: "吃掉200桶米",
            done() {return getELevel().gte(200)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "吃米小鸟更便宜。";
			},
        },
		{
			requirementDescription: "吃掉300桶米",
            done() {return getELevel().gte(300)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "吃米小鸟的基础吃米能力更好。";
			},
        },
		{
			requirementDescription: "吃掉450桶米",
            done() {return getELevel().gte(450)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "吃米小鸟的吃米能力加成更好。";
			},
        },
		{
			requirementDescription: "吃掉600桶米",
            done() {return getELevel().gte(600)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "吃掉的米桶数增加吃米能力。";
			},
        },
		{
			requirementDescription: "吃掉750桶米",
            done() {return getELevel().gte(750)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "吃米小鸟的基础吃米能力更好。";
			},
        },
		{
			requirementDescription: "吃掉1000桶米",
            done() {return getELevel().gte(1000)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "吃米小鸟的吃米能力加成更好。";
			},
        },
		{
			requirementDescription: "吃掉1200桶米",
            done() {return getELevel().gte(1200)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "吃米小鸟更便宜。";
			},
        },
		{
			requirementDescription: "吃掉1500桶米",
            done() {return getELevel().gte(1500)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "吃掉的米桶数增加金币获取。";
			},
        },
		{
			requirementDescription: "吃掉1750桶米",
            done() {return getELevel().gte(1750)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "吃米小鸟的基础吃米能力更好。";
			},
        },
		{
			requirementDescription: "吃掉2000桶米",
            done() {return getELevel().gte(2000)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "吃米小鸟的吃米能力加成更好。";
			},
        },
		{
			requirementDescription: "吃掉2250桶米",
            done() {return getELevel().gte(2250)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "吃米小鸟更便宜。";
			},
        },
		{
			requirementDescription: "吃掉3000桶米",
            done() {return getELevel().gte(3000)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "吃米小鸟的基础吃米能力更好。";
			},
        },
		{
			requirementDescription: "吃掉3500桶米",
            done() {return getELevel().gte(3500)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "吃米小鸟的吃米能力加成更好。";
			},
        },
		{
			requirementDescription: "吃掉4000桶米",
            done() {return getELevel().gte(4000)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "自动吃米更便宜。解锁自动购买自动吃米。";
			},
        },
		{
			requirementDescription: "吃掉4500桶米",
            done() {return getELevel().gte(4500)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "吃米小鸟的吃米能力加成更好。";
			},
        },
		{
			requirementDescription: "吃掉8000桶米",
            done() {return getELevel().gte(8000)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "吃米小鸟的吃米能力加成更好。";
			},
        },
		{
			requirementDescription: "吃掉9000桶米",
            done() {return getELevel().gte(9000)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "解锁吃米小鸟6。";
			},
        },
		{
			requirementDescription: "吃掉10000桶米",
            done() {return getELevel().gte(10000)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "吃米小鸟更便宜。";
			},
        },
		{
			requirementDescription: "吃掉12000桶米",
            done() {return getELevel().gte(12000)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "根据总计数米的数量，吃米速度更快。";
			},
        },
		{
			requirementDescription: "吃掉14000桶米",
            done() {return getELevel().gte(14000)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "吃米小鸟更便宜。";
			},
        },
		{
			requirementDescription: "吃掉20000桶米",
            done() {return getELevel().gte(20000)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "根据总计数米的数量，吃米速度更快。";
			},
        },
		{
			requirementDescription: "吃掉200000桶米",
            done() {return getELevel().gte(200000)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "自动购买吃米小鸟，吃米小鸟加成更好，购买吃米小鸟不消耗金币。";
			},
        },
		{
			requirementDescription: "吃掉300000桶米",
            done() {return getELevel().gte(300000)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "始终自动购买自动吃米，自动吃米更便宜，购买自动吃米不消耗金币。";
			},
        },
		{
			requirementDescription: "吃掉800000桶米",
            done() {return getELevel().gte(800000)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "根据总计数米的数量，吃米速度更快。";
			},
        },
		{
			requirementDescription: "吃掉900000桶米",
            done() {return getELevel().gte(900000)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "吃米小鸟的吃米能力加成更好。";
			},
        },
		{
			requirementDescription: "吃掉1200000桶米",
            done() {return getELevel().gte(1200000)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "吃米小鸟更便宜。";
			},
        },
		{
			requirementDescription: "吃掉1600000桶米",
            done() {return getELevel().gte(1600000)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "根据总计数米的数量，吃米速度更快。";
			},
        },
		{
			requirementDescription: "吃掉3000000桶米",
            done() {return getELevel().gte(3000000)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "吃米小鸟更便宜。";
			},
        },
		{
			requirementDescription: "吃掉55000000桶米",
            done() {return getELevel().gte(55000000)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "吃掉的米桶数增加金币获取。";
			},
        },
		{
			requirementDescription: "吃掉70000000桶米",
            done() {return getELevel().gte(70000000)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "吃掉150桶米的里程碑效果更好。";
			},
        },
		{
			requirementDescription: "吃掉一亿桶米",
            done() {return getELevel().gte(1e8)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "完成10个目标的里程碑效果根据吃掉的米桶数（最多6亿）变得更好。";
			},
        },
		{
			requirementDescription: "吃掉1.1亿桶米",
            done() {return getELevel().gte(1.1e8)}, // Used to determine when to give the milestone
            unlocked() {return getELevel().gte(1e8)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "所有吃米小鸟的基础吃米能力根据所有吃米小鸟的的等级变得更好。";
			},
        },
		{
			requirementDescription: "吃掉1.2亿桶米",
            done() {return getELevel().gte(1.2e8)}, // Used to determine when to give the milestone
            unlocked() {return getELevel().gte(1e8)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "吃米小鸟的吃米能力加成更好。吃米小鸟更便宜。";
			},
        },
		{
			requirementDescription: "吃掉1.3亿桶米",
            done() {return getELevel().gte(1.3e8)}, // Used to determine when to give the milestone
            unlocked() {return getELevel().gte(1e8)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "取消获取金币时的暴击，但是金币获取变为10倍。";
			},
        },
		{
			requirementDescription: "吃掉10亿桶米",
            done() {return getELevel().gte(1e9)}, // Used to determine when to give the milestone
            unlocked() {return getELevel().gte(1e8)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "根据总计数米的数量，吃米速度更快。";
			},
        },
		{
			requirementDescription: "吃掉50亿桶米",
            done() {return getELevel().gte(5e9)}, // Used to determine when to give the milestone
            unlocked() {return getELevel().gte(1e8)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "工人更便宜。";
			},
        },
		{
			requirementDescription: "吃掉170亿桶米",
            done() {return getELevel().gte(17e9)}, // Used to determine when to give the milestone
            unlocked() {return getELevel().gte(1e8)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "吃米小鸟更便宜。";
			},
        },
		{
			requirementDescription: "吃掉300亿桶米",
            done() {return getELevel().gte(3e10)}, // Used to determine when to give the milestone
            unlocked() {return getELevel().gte(1e8)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "根据总计数米的数量，吃米速度更快。";
			},
        },
		{
			requirementDescription: "吃掉800亿桶米",
            done() {return getELevel().gte(8e10)}, // Used to determine when to give the milestone
            unlocked() {return getELevel().gte(1e8)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "根据总计数米的数量，吃米速度更快。";
			},
        },
	],
	clickables: {
            11: {
                title: "开始吃米",
                display(){
					return "开始吃米";
				},
                unlocked() { return true}, 
				canClick(){return true},
				onClick(){
					player.e.points=layers.e.getEffectiveEPoints(layers.e.getRawEPoints().add(layers.e.gainMult().mul(getELevel().gte(8e10)?player.points.add(1).pow(0.5):getELevel().gte(3e10)?player.points.add(1).pow(0.4):getELevel().gte(1e9)?player.points.add(1).pow(1/3):getELevel().gte(1600000)?player.points.add(1).pow(0.3):getELevel().gte(800000)?player.points.add(1).pow(0.25):getELevel().gte(20000)?player.points.add(1).pow(0.2):getELevel().gte(12000)?player.points.add(1).pow(0.05):1)));
				},
                style: {'height':'100px','width':'150px'},
            },
            12: {
                title: "自动购买自动吃米",
                display(){
					return player.e.a1?("已开启"):"已关闭";
				},
                unlocked() { return getELevel().gte(4000) && getELevel().lte(300000)}, 
				canClick(){return true},
				onClick(){
					player.e.a1=!player.e.a1;
				},
                style: {'height':'100px','width':'150px'},
            },
	},
	buyables: {
            11: {
                title: "吃米小鸟1", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
					if(getELevel().gte(1.7e10))return x.pow(11);
                    let cost = Decimal.pow(getELevel().gte(1.2e8)?1.01:getELevel().gte(3000000)?1.05:getELevel().gte(1200000)?1.15:getELevel().gte(14000)?1.25:getELevel().gte(10000)?1.4:getELevel().gte(2250)?1.6:getELevel().gte(1200)?2:getELevel().gte(200)?3:getELevel().gte(40)?5:10,x);
                    return cost
                },
                effect(x=player[this.layer].buyables[this.id]) { // Effects of owning x of the items, x is a decimal
					let eff = [Decimal.pow(x.add(1),getELevel().gte(3000)?4:getELevel().gte(1750)?3.5:getELevel().gte(750)?3:getELevel().gte(300)?2.5:2),Decimal.add(1,x.add(1).mul(getELevel().gte(8000)?1:getELevel().gte(4500)?0.5:getELevel().gte(3500)?0.4:getELevel().gte(2000)?0.3:getELevel().gte(1000)?0.2:getELevel().gte(450)?0.15:0.1))];
					if(getELevel().gte(200000))eff[1]=eff[1].max(x.add(1).pow(2).div(getELevel().gte(900000)?1:100));
					if(getELevel().gte(1.2e8))eff[1]=eff[1].max(x.add(1).pow(3));
					if(getELevel().gte(1.1e8)){
						eff[0]=Decimal.pow(x.add(1),3);
						for(let i=11;i<=16;i++)eff[0]=eff[0].mul(Decimal.pow(player[this.layer].buyables[i].add(1),3));
					}
					return eff;
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
					return "等级："+formatWhole(player[this.layer].buyables[this.id].add(1))+"\n\
					吃米能力：" + formatWhole(data.effect[0]) + "粒/次\n\
					吃米加成：" + format(data.effect[1]) + "倍\n\
					花费：" + formatWhole(data.cost) + " 金币";
                },
                unlocked() { return true; }, 
                canAfford() {
                    return player.p.points.gte(tmp[this.layer].buyables[this.id].cost)},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
                    if(getELevel().lt(200000))player.p.points = player.p.points.sub(cost)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                },
                purchaseLimit: 9e15,
                style: {'height':'222px'},
            },
            21: {
                title: "自动吃米", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    let cost = x.add(1).pow(4)
					if(getELevel().gte(4000))cost=x.pow(3).add(x).mul(4).add(x.pow(2).mul(6).add(1));
					if(getELevel().gte(300000))cost=x.add(1).pow(3);
                    return cost
                },
                effect(x=player[this.layer].buyables[this.id]) { // Effects of owning x of the items, x is a decimal
					let eff = new Decimal(x)
					return eff;
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
					return "等级："+formatWhole(player[this.layer].buyables[this.id])+"\n\
					自动吃米：" + formatWhole(data.effect) + "次/秒\n\
					花费：" + formatWhole(data.cost) + " 金币";
                },
                unlocked() { return getELevel().gte(5) }, 
                canAfford() {
                    return player.p.points.gte(tmp[this.layer].buyables[this.id].cost)},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
                    if(getELevel().lte(300000))player.p.points = player.p.points.sub(cost)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                },
                purchaseLimit: 9e15,
                style: {'height':'222px'},
            },
            12: {
                title: "吃米小鸟2", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
					if(getELevel().gte(1.7e10))return x.pow(12);
                    let cost = Decimal.pow(getELevel().gte(1.2e8)?1.011:getELevel().gte(3000000)?1.06:getELevel().gte(1200000)?1.17:getELevel().gte(14000)?1.28:getELevel().gte(10000)?1.44:getELevel().gte(2250)?1.7:getELevel().gte(1200)?2.25:getELevel().gte(200)?3.5:getELevel().gte(40)?6:10,x);
                    return cost
                },
                effect(x=player[this.layer].buyables[this.id]) { // Effects of owning x of the items, x is a decimal
					let eff = [Decimal.pow(x,getELevel().gte(3000)?4:getELevel().gte(1750)?3.5:getELevel().gte(750)?3:getELevel().gte(300)?2.5:2),Decimal.add(1,x.mul(getELevel().gte(8000)?1:getELevel().gte(4500)?0.5:getELevel().gte(3500)?0.4:getELevel().gte(2000)?0.3:getELevel().gte(1000)?0.2:getELevel().gte(450)?0.15:0.1))];
					if(getELevel().gte(200000))eff[1]=eff[1].max(x.add(1).pow(2).div(getELevel().gte(900000)?1:100));
					if(getELevel().gte(1.2e8))eff[1]=eff[1].max(x.add(1).pow(3));
					if(getELevel().gte(1.1e8)){
						eff[0]=Decimal.pow(x,3);
						for(let i=11;i<=16;i++)eff[0]=eff[0].mul(Decimal.pow(player[this.layer].buyables[i].add(1),3));
					}
					return eff;
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
					return "等级："+formatWhole(player[this.layer].buyables[this.id])+"\n\
					吃米能力：" + formatWhole(data.effect[0]) + "粒/次\n\
					吃米加成：" + format(data.effect[1]) + "倍\n\
					花费：" + formatWhole(data.cost) + " 金币";
                },
                unlocked() { return getELevel().gte(10) }, 
                canAfford() {
                    return player.p.points.gte(tmp[this.layer].buyables[this.id].cost)},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
                    if(getELevel().lt(200000))player.p.points = player.p.points.sub(cost)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                },
                purchaseLimit: 9e15,
                style: {'height':'222px'},
            },
            13: {
                title: "吃米小鸟3", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
					if(getELevel().gte(1.7e10))return x.pow(13);
                    let cost = Decimal.pow(getELevel().gte(1.2e8)?1.012:getELevel().gte(3000000)?1.07:getELevel().gte(1200000)?1.19:getELevel().gte(14000)?1.31:getELevel().gte(10000)?1.48:getELevel().gte(2250)?1.8:getELevel().gte(1200)?2.5:getELevel().gte(200)?4:getELevel().gte(40)?7:10,x);
                    return cost
                },
                effect(x=player[this.layer].buyables[this.id]) { // Effects of owning x of the items, x is a decimal
					let eff = [Decimal.pow(x,getELevel().gte(3000)?4:getELevel().gte(1750)?3.5:getELevel().gte(750)?3:getELevel().gte(300)?2.5:2),Decimal.add(1,x.mul(getELevel().gte(8000)?1:getELevel().gte(4500)?0.5:getELevel().gte(3500)?0.4:getELevel().gte(2000)?0.3:getELevel().gte(1000)?0.2:getELevel().gte(450)?0.15:0.1))];
					if(getELevel().gte(200000))eff[1]=eff[1].max(x.add(1).pow(2).div(getELevel().gte(900000)?1:100));
					if(getELevel().gte(1.2e8))eff[1]=eff[1].max(x.add(1).pow(3));
					if(getELevel().gte(1.1e8)){
						eff[0]=Decimal.pow(x,3);
						for(let i=11;i<=16;i++)eff[0]=eff[0].mul(Decimal.pow(player[this.layer].buyables[i].add(1),3));
					}
					return eff;
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
					return "等级："+formatWhole(player[this.layer].buyables[this.id])+"\n\
					吃米能力：" + formatWhole(data.effect[0]) + "粒/次\n\
					吃米加成：" + format(data.effect[1]) + "倍\n\
					花费：" + formatWhole(data.cost) + " 金币";
                },
                unlocked() { return getELevel().gte(15) }, 
                canAfford() {
                    return player.p.points.gte(tmp[this.layer].buyables[this.id].cost)},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
                    if(getELevel().lt(200000))player.p.points = player.p.points.sub(cost)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                },
                purchaseLimit: 9e15,
                style: {'height':'222px'},
            },
            14: {
                title: "吃米小鸟4", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
					if(getELevel().gte(1.7e10))return x.pow(14);
                    let cost = Decimal.pow(getELevel().gte(1.2e8)?1.013:getELevel().gte(3000000)?1.08:getELevel().gte(1200000)?1.21:getELevel().gte(14000)?1.34:getELevel().gte(10000)?1.52:getELevel().gte(2250)?1.9:getELevel().gte(1200)?2.75:getELevel().gte(200)?4.5:getELevel().gte(40)?8:10,x);
                    return cost
                },
                effect(x=player[this.layer].buyables[this.id]) { // Effects of owning x of the items, x is a decimal
					let eff = [Decimal.pow(x,getELevel().gte(3000)?4:getELevel().gte(1750)?3.5:getELevel().gte(750)?3:getELevel().gte(300)?2.5:2),Decimal.add(1,x.mul(getELevel().gte(8000)?1:getELevel().gte(4500)?0.5:getELevel().gte(3500)?0.4:getELevel().gte(2000)?0.3:getELevel().gte(1000)?0.2:getELevel().gte(450)?0.15:0.1))];
					if(getELevel().gte(200000))eff[1]=eff[1].max(x.add(1).pow(2).div(getELevel().gte(900000)?1:100));
					if(getELevel().gte(1.2e8))eff[1]=eff[1].max(x.add(1).pow(3));
					if(getELevel().gte(1.1e8)){
						eff[0]=Decimal.pow(x,3);
						for(let i=11;i<=16;i++)eff[0]=eff[0].mul(Decimal.pow(player[this.layer].buyables[i].add(1),3));
					}
					return eff;
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
					return "等级："+formatWhole(player[this.layer].buyables[this.id])+"\n\
					吃米能力：" + formatWhole(data.effect[0]) + "粒/次\n\
					吃米加成：" + format(data.effect[1]) + "倍\n\
					花费：" + formatWhole(data.cost) + " 金币";
                },
                unlocked() { return getELevel().gte(25) }, 
                canAfford() {
                    return player.p.points.gte(tmp[this.layer].buyables[this.id].cost)},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
                    if(getELevel().lt(200000))player.p.points = player.p.points.sub(cost)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                },
                purchaseLimit: 9e15,
                style: {'height':'222px'},
            },
            15: {
                title: "吃米小鸟5", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
					if(getELevel().gte(1.7e10))return x.pow(15);
                    let cost = Decimal.pow(getELevel().gte(1.2e8)?1.014:getELevel().gte(3000000)?1.09:getELevel().gte(1200000)?1.23:getELevel().gte(14000)?1.37:getELevel().gte(10000)?1.56:getELevel().gte(2250)?2:getELevel().gte(1200)?3:getELevel().gte(200)?5:getELevel().gte(40)?9:10,x);
                    return cost
                },
                effect(x=player[this.layer].buyables[this.id]) { // Effects of owning x of the items, x is a decimal
					let eff = [Decimal.pow(x,getELevel().gte(3000)?4:getELevel().gte(1750)?3.5:getELevel().gte(750)?3:getELevel().gte(300)?2.5:2),Decimal.add(1,x.mul(getELevel().gte(8000)?1:getELevel().gte(4500)?0.5:getELevel().gte(3500)?0.4:getELevel().gte(2000)?0.3:getELevel().gte(1000)?0.2:getELevel().gte(450)?0.15:0.1))];
					if(getELevel().gte(200000))eff[1]=eff[1].max(x.add(1).pow(2).div(getELevel().gte(900000)?1:100));
					if(getELevel().gte(1.2e8))eff[1]=eff[1].max(x.add(1).pow(3));
					if(getELevel().gte(1.1e8)){
						eff[0]=Decimal.pow(x,3);
						for(let i=11;i<=16;i++)eff[0]=eff[0].mul(Decimal.pow(player[this.layer].buyables[i].add(1),3));
					}
					return eff;
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
					return "等级："+formatWhole(player[this.layer].buyables[this.id])+"\n\
					吃米能力：" + formatWhole(data.effect[0]) + "粒/次\n\
					吃米加成：" + format(data.effect[1]) + "倍\n\
					花费：" + formatWhole(data.cost) + " 金币";
                },
                unlocked() { return getELevel().gte(50) }, 
                canAfford() {
                    return player.p.points.gte(tmp[this.layer].buyables[this.id].cost)},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
                    if(getELevel().lt(200000))player.p.points = player.p.points.sub(cost)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                },
                purchaseLimit: 9e15,
                style: {'height':'222px'},
            },
            16: {
                title: "吃米小鸟6", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
					if(getELevel().gte(1.7e10))return x.pow(16);
                    let cost = Decimal.pow(getELevel().gte(1.2e8)?1.015:getELevel().gte(3000000)?1.1:getELevel().gte(1200000)?1.25:getELevel().gte(14000)?1.4:getELevel().gte(10000)?1.6:2.1,x);
                    return cost
                },
                effect(x=player[this.layer].buyables[this.id]) { // Effects of owning x of the items, x is a decimal
					let eff = [Decimal.pow(x,getELevel().gte(3000)?4:getELevel().gte(1750)?3.5:getELevel().gte(750)?3:getELevel().gte(300)?2.5:2),Decimal.add(1,x.mul(getELevel().gte(8000)?1:getELevel().gte(4500)?0.5:getELevel().gte(3500)?0.4:getELevel().gte(2000)?0.3:getELevel().gte(1000)?0.2:getELevel().gte(450)?0.15:0.1))];
					if(getELevel().gte(200000))eff[1]=eff[1].max(x.add(1).pow(2).div(getELevel().gte(900000)?1:100));
					if(getELevel().gte(1.2e8))eff[1]=eff[1].max(x.add(1).pow(3));
					if(getELevel().gte(1.1e8)){
						eff[0]=Decimal.pow(x,3);
						for(let i=11;i<=16;i++)eff[0]=eff[0].mul(Decimal.pow(player[this.layer].buyables[i].add(1),3));
					}
					return eff;
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
					return "等级："+formatWhole(player[this.layer].buyables[this.id])+"\n\
					吃米能力：" + formatWhole(data.effect[0]) + "粒/次\n\
					吃米加成：" + format(data.effect[1]) + "倍\n\
					花费：" + formatWhole(data.cost) + " 金币";
                },
                unlocked() { return getELevel().gte(9000) }, 
                canAfford() {
                    return player.p.points.gte(tmp[this.layer].buyables[this.id].cost)},
                buy() { 
                    cost = tmp[this.layer].buyables[this.id].cost
                    if(getELevel().lt(200000))player.p.points = player.p.points.sub(cost)	
                    player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
                },
                purchaseLimit: 9e15,
                style: {'height':'222px'},
            },
	}
})

addLayer("t", {
    name: "T", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "目标", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#00FFFF",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "个目标已完成", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
	base(){
		if(getTier().gte(60))return 1.1;
		if(getTier().gte(54))return new Decimal(1.4).sub(getTier().mul(0.005));
		if(getTier().gte(53))return 1.14;
		if(getTier().gte(52))return 1.16;
		if(getTier().gte(51))return 1.17;
		if(getTier().gte(45))return new Decimal(1.69).sub(getTier().mul(0.01));
		if(getTier().gte(41))return new Decimal(3.01).sub(getTier().mul(0.04));
		if(getTier().gte(34))return new Decimal(1.8).sub(getTier().mul(0.01));
		if(getTier().gte(33))return 1.48;
		if(getTier().gte(32))return 1.53;
		if(getTier().gte(31))return 1.6;
		if(getTier().gte(30))return 1.62;
		if(getTier().gte(21))return 1.65;
		if(getTier().gte(20))return 1.7;
		return 1.9;
	},
    exponent: 0.5, // Prestige currency exponent
    gainMult(a) { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 2, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
    ],
	branches: ['p'],
	update(diff){
		player.t.points=getRank();
		
		if(getRank().gte(460)){
			let target=layers.t.getBuyPoint().add(1).log(layers.t.base()).max(0).ceil();
			if(player.t.buyables[11].lte(target))player.t.buyables[11]=target;
			if(player.t.buyables[12].lte(target))player.t.buyables[12]=target;
			if(player.t.buyables[13].lte(target))player.t.buyables[13]=target;
			if(player.t.buyables[21].lte(target))player.t.buyables[21]=target;
			if(player.t.buyables[22].lte(target))player.t.buyables[22]=target;
			if(player.t.buyables[23].lte(target))player.t.buyables[23]=target;
		}
	},
	tabFormat: [
		"main-display",["display-text",function(){if(getRank().gte(3))return "剩余钻石数量："+formatWhole(layers.t.getBuyPoint());return "";}],["clickable",11],"buyables","milestones"
	],
    layerShown(){return getRank().gte(1)},
	milestones: [
		{
			requirementDescription: "完成1个目标",
            done() {return getRank().gte(1)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "根据完成的目标数增加金币获取数量。";
			},
        },
		{
			requirementDescription: "完成2个目标",
            done() {return getRank().gte(2)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "根据完成的目标数，每秒自动释放"+format(new Decimal(1).sub(getRank().sqrt().mul(0.1).add(1).pow(-1)).mul(100))+"%米袋累计的米。";
			},
        },
		{
			requirementDescription: "完成3个目标",
            done() {return getRank().gte(3)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "解锁钻石，和第一个钻石购买项。完成目标可以获得钻石。";
			},
        },
		{
			requirementDescription: "完成4个目标",
            done() {return getRank().gte(4)}, // Used to determine when to give the milestone
            effectDescription: function(){
				if(getRank().gte(3240))return "解锁第二个钻石购买项。";
				return "解锁第二个钻石购买项。根据完成的米桶数增加数米能力。";
			},
        },
		{
			requirementDescription: "完成5个目标",
            done() {return getRank().gte(5)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "解锁新的层级。";
			},
        },
		{
			requirementDescription: "完成6个目标",
            done() {return getRank().gte(6)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "解锁第三个钻石购买项。手动数米获得的金币翻倍。";
			},
        },
		{
			requirementDescription: "完成7个目标",
            done() {return getRank().gte(7)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "解锁第四个金币购买项。";
			},
        },
		{
			requirementDescription: "完成10个目标",
            done() {return getRank().gte(10)}, // Used to determine when to give the milestone
            effectDescription: function(){
				let r=getRankEffect2().root(getRank());
				return "根据完成的目标数，数米能力和吃米能力增加。当前：每完成一个目标，变为原来的"+format(r)+"倍。";
			},
        },
		{
			requirementDescription: "完成13个目标",
            done() {return getRank().gte(13)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "解锁第四个钻石购买项。";
			},
        },
		{
			requirementDescription: "完成14个目标",
            done() {return getRank().gte(14)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "钻石购买项价格减半。";
			},
        },
		{
			requirementDescription: "完成15个目标",
            done() {return getRank().gte(15)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "根据完成的目标数增加金币获取数量。";
			},
        },
		{
			requirementDescription: "完成17个目标",
            done() {return getRank().gte(17)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "解锁第五个金币购买项。";
			},
        },
		{
			requirementDescription: "完成20个目标",
            done() {return getRank().gte(20)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "解锁新的层级。";
			},
        },
		{
			requirementDescription: "完成21个目标",
            done() {return getRank().gte(21)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "米袋升级更便宜。";
			},
        },
		{
			requirementDescription: "完成23个目标",
            done() {return getRank().gte(23)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "解锁第六个金币购买项。";
			},
        },
		{
			requirementDescription: "完成25个目标",
            done() {return getRank().gte(25)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "解锁第五个钻石购买项。";
			},
        },
		{
			requirementDescription: "完成30个目标",
            done() {return getRank().gte(30)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "解锁第六个钻石购买项。";
			},
        },
		{
			requirementDescription: "完成32个目标",
            done() {return getRank().gte(32)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "自动数米更便宜。";
			},
        },
		{
			requirementDescription: "完成35个目标",
            done() {return getRank().gte(35)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "米神提供更多加成。";
			},
        },
		{
			requirementDescription: "完成40个目标",
            done() {return getRank().gte(40)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "米神提供更多加成。";
			},
        },
		{
			requirementDescription: "完成45个目标",
            done() {return getRank().gte(45)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "根据已完成的目标数量（至多450000），第一行钻石升级更好。";
			},
        },
		{
			requirementDescription: "完成48个目标",
            done() {return getRank().gte(48)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "数米加成更便宜。";
			},
        },
		{
			requirementDescription: "完成50个目标",
            done() {return getRank().gte(50)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "解锁自动购买数米加成。";
			},
        },
		{
			requirementDescription: "完成55个目标",
            done() {return getRank().gte(55)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "数米加成效果更好。";
			},
        },
		{
			requirementDescription: "完成58个目标",
            done() {return getRank().gte(58)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "钻石购买项价格减半。";
			},
        },
		{
			requirementDescription: "完成60个目标",
            done() {return getRank().gte(60)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "米神提供更多加成。";
			},
        },
		{
			requirementDescription: "完成65个目标",
            done() {return getRank().gte(65)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "自动数米加成更便宜。";
			},
        },
		{
			requirementDescription: "完成70个目标",
            done() {return getRank().gte(70)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "解锁自动购买自动数米加成。";
			},
        },
		{
			requirementDescription: "完成75个目标",
            done() {return getRank().gte(75)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "米神提供更多加成。";
			},
        },
		{
			requirementDescription: "完成85个目标",
            done() {return getRank().gte(85)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "钻石购买项价格减半。";
			},
        },
		{
			requirementDescription: "完成90个目标",
            done() {return getRank().gte(90)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "米神提供更多加成。";
			},
        },
		{
			requirementDescription: "完成95个目标",
            done() {return getRank().gte(95)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "米袋加成更便宜。";
			},
        },
		{
			requirementDescription: "完成100个目标",
            done() {return getRank().gte(100)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "解锁新的层级。";
			},
        },
		{
			requirementDescription: "完成110个目标",
            done() {return getRank().gte(110)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "自动数米加成效果更好。";
			},
        },
		{
			requirementDescription: "完成125个目标",
            done() {return getRank().gte(125)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "根据已完成的目标数量（至多450000），第一行钻石升级和钻石升级“自动数米”更好。";
			},
        },
		{
			requirementDescription: "完成150个目标",
            done() {return getRank().gte(150)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "钻石升级不再消耗钻石。";
			},
        },
		{
			requirementDescription: "完成160个目标",
            done() {return getRank().gte(160)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "米袋加成效果更好。";
			},
        },
		{
			requirementDescription: "完成175个目标",
            done() {return getRank().gte(175)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "解锁工人升级。";
			},
        },
		{
			requirementDescription: "完成185个目标",
            done() {return getRank().gte(185)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "解锁自动购买米袋加成。";
			},
        },
		{
			requirementDescription: "完成200个目标",
            done() {return getRank().gte(200)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "解锁新的层级。";
			},
        },
		{
			requirementDescription: "完成301个目标",
            done() {return getRank().gte(301)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "？？？";
			},
        },
	],
	clickables: {
			11: {
				title: "重置钻石升级",
				display: "重置钻石升级",
				unlocked(){return getRank().gte(3)&&getRank().lt(460)},
				canClick(){return true},
				onClick(){
					player.t.buyables[11]=new Decimal(0);
					player.t.buyables[12]=new Decimal(0);
					player.t.buyables[13]=new Decimal(0);
					player.t.buyables[21]=new Decimal(0);
					player.t.buyables[22]=new Decimal(0);
					player.t.buyables[23]=new Decimal(0);
				},
                style: {'height':'100px','width':'150px'},
			},
	},
	buyables: {
            11: {
                title: "金币获取", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    let cost = Decimal.pow(2,x.add(getRank().gte(85)?0:getRank().gte(58)?1:getRank().gte(14)?2:3));
                    if(getRank().gte(460))cost = Decimal.pow(layers.t.base(), x);
					return cost
                },
                effect(x=player[this.layer].buyables[this.id]) { // Effects of owning x of the items, x is a decimal
					if(getTier().gte(500))return Decimal.add(1,x).pow(getTier().mul(0.1).add(150));
					let eff = Decimal.add(1,x).pow(getRank().gte(450000)?200:getRank().gte(280000)?getRank().div(10000).add(155):getRank().gte(128000)?getRank().div(8000).add(148):getRank().gte(48000)?getRank().div(2000).add(100):getRank().gte(16000)?getRank().div(800).add(64):getRank().gte(10000)?getRank().div(250).add(20):getRank().gte(1000)?getRank().div(200).add(10):getRank().gte(700)?getRank().sub(700).div(300).add(14):getRank().gte(125)?getRank().div(50):getRank().gte(45)?getRank().div(100).add(1):1)
					return eff;
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
					return "等级："+formatWhole(player[this.layer].buyables[this.id])+"\n\
					金币获取变为原来的" + format(data.effect) + "倍\n\
					花费：" + formatWhole(data.cost) + " 钻石";
                },
                unlocked() { return getRank().gte(3) }, 
                canAfford() {
                    return layers[this.layer].getBuyPoint().gte(tmp[this.layer].buyables[this.id].cost)
				},
                buy() { 
					if(layers[this.layer].getBuyPoint().gte(tmp[this.layer].buyables[this.id].cost)){
						player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
					}
                },
                purchaseLimit: 9e15,
                style: {'height':'222px'},
            },
            12: {
                title: "数米能力", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    let cost = Decimal.pow(2,x.add(getRank().gte(85)?0:getRank().gte(58)?1:getRank().gte(14)?2:3));
                    if(getRank().gte(460))cost = Decimal.pow(layers.t.base(), x);
                    return cost
                },
                effect(x=player[this.layer].buyables[this.id]) { // Effects of owning x of the items, x is a decimal
					if(getTier().gte(500))return Decimal.add(1,x).pow(getTier().mul(0.1).add(150));
					let eff = Decimal.add(1,x).pow(getRank().gte(450000)?200:getRank().gte(280000)?getRank().div(10000).add(155):getRank().gte(128000)?getRank().div(8000).add(148):getRank().gte(48000)?getRank().div(2000).add(100):getRank().gte(16000)?getRank().div(800).add(64):getRank().gte(10000)?getRank().div(250).add(20):getRank().gte(1000)?getRank().div(200).add(10):getRank().gte(700)?getRank().sub(700).div(300).add(14):getRank().gte(125)?getRank().div(50):getRank().gte(45)?getRank().div(100).add(1):1)
					return eff;
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
					return "等级："+formatWhole(player[this.layer].buyables[this.id])+"\n\
					数米能力"+(hasUpgrade("y",14)?"等级":"")+"变为原来的" + format(data.effect) + "倍\n\
					花费：" + formatWhole(data.cost) + " 钻石";
                },
                unlocked() { return getRank().gte(4) }, 
                canAfford() {
                    return layers[this.layer].getBuyPoint().gte(tmp[this.layer].buyables[this.id].cost)
				},
                buy() { 
					if(layers[this.layer].getBuyPoint().gte(tmp[this.layer].buyables[this.id].cost)){
						player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
					}
                },
                purchaseLimit: 9e15,
                style: {'height':'222px'},
            },
            13: {
                title: "吃米能力", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    let cost = Decimal.pow(2,x.add(getRank().gte(85)?0:getRank().gte(58)?1:getRank().gte(14)?2:3));
                    if(getRank().gte(460))cost = Decimal.pow(layers.t.base(), x);
                    return cost
                },
                effect(x=player[this.layer].buyables[this.id]) { // Effects of owning x of the items, x is a decimal
					if(getTier().gte(500))return Decimal.add(1,x).pow(getTier().mul(0.1).add(150));
					let eff = Decimal.add(1,x).pow(getRank().gte(450000)?200:getRank().gte(280000)?getRank().div(10000).add(155):getRank().gte(128000)?getRank().div(8000).add(148):getRank().gte(48000)?getRank().div(2000).add(100):getRank().gte(16000)?getRank().div(800).add(64):getRank().gte(10000)?getRank().div(250).add(20):getRank().gte(1000)?getRank().div(200).add(10):getRank().gte(700)?getRank().sub(700).div(300).add(14):getRank().gte(125)?getRank().div(50):getRank().gte(45)?getRank().div(100).add(1):1)
					return eff;
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
					return "等级："+formatWhole(player[this.layer].buyables[this.id])+"\n\
					吃米能力变为原来的" + format(data.effect) + "倍\n\
					花费：" + formatWhole(data.cost) + " 钻石";
                },
                unlocked() { return getRank().gte(6) }, 
                canAfford() {
                    return layers[this.layer].getBuyPoint().gte(tmp[this.layer].buyables[this.id].cost)
				},
                buy() { 
					if(layers[this.layer].getBuyPoint().gte(tmp[this.layer].buyables[this.id].cost)){
						player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
					}
                },
                purchaseLimit: 9e15,
                style: {'height':'222px'},
            },
            21: {
                title: "金币返还", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    if(x.gte(14)&&getRank().lt(440))return Decimal.dInf;
                    let cost = Decimal.pow(2,x.add(getRank().gte(85)?0:getRank().gte(58)?1:getRank().gte(14)?2:3));
                    if(getRank().gte(460))cost = Decimal.pow(layers.t.base(), x);
                    return cost
                },
                effect(x=player[this.layer].buyables[this.id]) { // Effects of owning x of the items, x is a decimal
					if(getRank().gte(70000))return Decimal.pow(1.01,x).add(x);
					let eff = Decimal.sub(1,Decimal.mul(0.1,x));
					if(x.gte(8))eff = Decimal.add(0.01,Decimal.sub(15,x).mul(Decimal.sub(14,x)).div(200));
					if(x.gte(15))eff = Decimal.add(0.0001,Decimal.pow(0.99,x).mul(0.01));
					return eff;
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
					if(getRank().gte(70000)){
						return "等级："+formatWhole(player[this.layer].buyables[this.id])+"\n\
						所有金币升级的等级增加速度变为原来的" + format(data.effect) + "倍\n\
						花费：" + formatWhole(data.cost) + " 钻石";
					}
					return "等级："+formatWhole(player[this.layer].buyables[this.id])+"\n\
					购买金币升级后返还" + format(Decimal.sub(100,data.effect.mul(100))) + "%金币\n\
					对吃米升级无效。\n\
					花费：" + formatWhole(data.cost) + " 钻石";
                },
                unlocked() { return getRank().gte(13) }, 
                canAfford() {
                    return layers[this.layer].getBuyPoint().gte(tmp[this.layer].buyables[this.id].cost) && (player[this.layer].buyables[this.id].lt(14) || getRank().gte(440))
				},
                buy() { 
					if(layers[this.layer].getBuyPoint().gte(tmp[this.layer].buyables[this.id].cost)){
						if(getRank().lt(440))player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1).min(14)
						else player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
					}
                },
                purchaseLimit: 9e15,
                style: {'height':'222px'},
            },
            22: {
                title: "自动数米", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    let cost = Decimal.pow(2,x.add(getRank().gte(85)?0:getRank().gte(58)?1:getRank().gte(14)?2:3));
                    if(getRank().gte(460))cost = Decimal.pow(layers.t.base(), x);
                    return cost
                },
                effect(x=player[this.layer].buyables[this.id]) { // Effects of owning x of the items, x is a decimal
					if(getTier().gte(500))return Decimal.add(1,x).pow(getTier().mul(0.1).add(150));
					let eff = Decimal.add(1,x).pow(getRank().gte(450000)?200:getRank().gte(280000)?getRank().div(10000).add(155):getRank().gte(128000)?getRank().div(8000).add(148):getRank().gte(48000)?getRank().div(2000).add(100):getRank().gte(16000)?getRank().div(800).add(64):getRank().gte(10000)?getRank().div(250).add(20):getRank().gte(2000)?getRank().div(200).add(10):getRank().gte(125)?getRank().div(100):1)
					return eff;
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
					return "等级："+formatWhole(player[this.layer].buyables[this.id])+"\n\
					自动数米速度变为原来的" + format(data.effect) + "倍\n\
					花费：" + formatWhole(data.cost) + " 钻石";
                },
                unlocked() { return getRank().gte(25) }, 
                canAfford() {
                    return layers[this.layer].getBuyPoint().gte(tmp[this.layer].buyables[this.id].cost)
				},
                buy() { 
					if(layers[this.layer].getBuyPoint().gte(tmp[this.layer].buyables[this.id].cost)){
						player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
					}
                },
                purchaseLimit: 9e15,
                style: {'height':'222px'},
            },
            23: {
                title: "数米能力价格", // Optional, displayed at the top in a larger font
                cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
                    if(x.gte(9)&&getRank().lt(380))return Decimal.dInf;
					let cost = Decimal.pow(2,x.add(getRank().gte(85)?0:getRank().gte(58)?1:getRank().gte(14)?2:3));
                    if(getRank().gte(460))cost = Decimal.pow(layers.t.base(), x);
                    return cost
                },
                effect(x=player[this.layer].buyables[this.id]) { // Effects of owning x of the items, x is a decimal
					if(getRank().gte(70000))return Decimal.pow(1.1,x).add(x);
					if(x.gte(10))return Decimal.pow(1.1,x).add(x).sub(10).floor().recip();
					let eff = Decimal.sub(10,x)
					return eff;
                },
                display() { // Everything else displayed in the buyable button after the title
                    let data = tmp[this.layer].buyables[this.id]
					if(getRank().gte(70000)){
						return "等级："+formatWhole(player[this.layer].buyables[this.id])+"\n\
						数米能力等级增加速度变为原来的" + format(data.effect) + "倍\n\
						花费：" + formatWhole(data.cost) + " 钻石";
					}
					if(player[this.layer].buyables[this.id].gte(10))return "等级："+formatWhole(player[this.layer].buyables[this.id])+"\n\
					数米能力价格：1/" + formatWhole(data.effect.recip()) + " 金币\n\
					花费：" + formatWhole(data.cost) + " 钻石";
					return "等级："+formatWhole(player[this.layer].buyables[this.id])+"\n\
					数米能力价格：" + formatWhole(data.effect) + "金币\n\
					花费：" + formatWhole(data.cost) + " 钻石";
                },
                unlocked() { return getRank().gte(30) }, 
                canAfford() {
                    return layers[this.layer].getBuyPoint().gte(tmp[this.layer].buyables[this.id].cost) && (player[this.layer].buyables[this.id].lt(9) || getRank().gte(380))
				},
                buy() { 
					if(layers[this.layer].getBuyPoint().gte(tmp[this.layer].buyables[this.id].cost)){
						if(getRank().lt(380))player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1).min(9)
						else player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
					}
                },
                purchaseLimit: 9e15,
                style: {'height':'222px'},
            },
	},
	getBuyPoint(){
		let bp=player.t.points.pow(2);
		if(getRank().gte(1210)){
			bp=getRank().pow(getRank().div(600).min(3));
		}
		bp=bp.mul(layers.s.effect4());
		bp=bp.mul(layers.i.buyables[31].effect());
		bp=bp.mul(layers.et.buyables[21].effect());
		bp=bp.floor().add(1e-10);
		if(getTier().gte(2))bp=bp.mul(getTier());
		if(player.o.points.gte(7))bp=bp.mul(player.o.points);
		if(getRank().gte(150))return bp;
		bp=bp.sub(Decimal.pow(2,player.t.buyables[11].add(getRank().gte(85)?0:getRank().gte(58)?1:getRank().gte(14)?2:3)).sub(getRank().gte(85)?1:getRank().gte(58)?2:getRank().gte(14)?4:8));
		bp=bp.sub(Decimal.pow(2,player.t.buyables[12].add(getRank().gte(85)?0:getRank().gte(58)?1:getRank().gte(14)?2:3)).sub(getRank().gte(85)?1:getRank().gte(58)?2:getRank().gte(14)?4:8));
		bp=bp.sub(Decimal.pow(2,player.t.buyables[13].add(getRank().gte(85)?0:getRank().gte(58)?1:getRank().gte(14)?2:3)).sub(getRank().gte(85)?1:getRank().gte(58)?2:getRank().gte(14)?4:8));
		bp=bp.sub(Decimal.pow(2,player.t.buyables[21].add(getRank().gte(85)?0:getRank().gte(58)?1:getRank().gte(14)?2:3)).sub(getRank().gte(85)?1:getRank().gte(58)?2:getRank().gte(14)?4:8));
		bp=bp.sub(Decimal.pow(2,player.t.buyables[22].add(getRank().gte(85)?0:getRank().gte(58)?1:getRank().gte(14)?2:3)).sub(getRank().gte(85)?1:getRank().gte(58)?2:getRank().gte(14)?4:8));
		bp=bp.sub(Decimal.pow(2,player.t.buyables[23].add(getRank().gte(85)?0:getRank().gte(58)?1:getRank().gte(14)?2:3)).sub(getRank().gte(85)?1:getRank().gte(58)?2:getRank().gte(14)?4:8));
		return bp;
	}
})

addLayer("a", {
    name: "A", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "成就", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#FFFF00",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "成就点", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult(a) { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 'side', // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
    ],
	branches: [],
	update(diff){
		player.a.points=new Decimal(player.a.achievements.length);
		if(hasAchievement("a",52))player.a.points=player.a.points.mul(2);else if(hasAchievement("a",51))player.a.points=player.a.points.mul(1.5);
		player.a.points=player.a.points.mul(layers.s.effect5());
	},
	tabFormat: [
		"main-display","achievements"
	],
    layerShown(){return getLevel().gte(75)},
    achievementPopups: true,
	achievements:{
		11:{
			name: "一切的开始",
			done() {return getRank().gte(1)},
			tooltip: "数完一亿粒米！奖励：解锁新的层级，并且成就点加成金币获取。",
		},
		12:{
			name: "新的货币",
			done() {return getRank().gte(3)},
			tooltip: "完成3个目标。",
		},
		13:{
			name: "青铜米袋",
			done() {return player.p.buyables[21].gte(100)},
			tooltip: "达到100级米袋。",
		},
		14:{
			name: "青铜自动机",
			done() {return player.p.buyables[12].gte(100)},
			tooltip: "达到100级自动数米。奖励：手动数米获得的金币翻倍。",
		},
		15:{
			name: "吸引力",
			done() {return getRank().gte(5)},
			tooltip: "完成5个目标。",
		},
		16:{
			name: "更快的吃米速度",
			done() {return getELevel().gte(50)},
			tooltip: "解锁5个吃米小鸟。",
		},
		17:{
			name: "吃一亿粒米",
			done() {return getELevel().gte(100)},
			tooltip: "吃掉一亿粒米。奖励：解锁自动购买自动数米。",
		},
		21:{
			name: "中倍率米袋",
			done() {return buyableEffect("p",21).gte(1.25)},
			tooltip: "米袋倍数达到5。奖励：米袋倍数提升吃米能力。",
		},
		22:{
			name: "一次一亿粒米",
			done() {return player.p.buyables[11].gte(1e8)},
			tooltip: "达到一亿级数米能力。",
		},
		23:{
			name: "白银米袋",
			done() {return player.p.buyables[21].gte(500)},
			tooltip: "达到500级米袋。",
		},
		24:{
			name: "白银自动机",
			done() {return player.p.buyables[12].gte(500)},
			tooltip: "达到500级自动数米。奖励：手动数米获得的金币翻倍。",
		},
		25:{
			name: "万、亿、兆后面是什么？",
			done() {return getRank().gte(8)},
			tooltip: "完成8个目标。奖励：成就点加成吃米能力。",
		},
		26:{
			name: "吃的小饱",
			done() {return getELevel().gte(500)},
			tooltip: "吃掉500桶米。奖励：成就点加成数米能力。",
		},
		27:{
			name: "指数级增长",
			done() {return getRank().gte(10)},
			tooltip: "完成10个目标。奖励：解锁自动购买米袋升级。",
		},
		31:{
			name: "千层米",
			done() {return getELevel().gte(1000)},
			tooltip: "吃掉1000桶米。",
		},
		32:{
			name: "20个0",
			done() {return getRank().gte(13)},
			tooltip: "完成13个目标。",
		},
		33:{
			name: "黄金米袋",
			done() {return player.p.buyables[21].gte(2000)},
			tooltip: "达到2000级米袋。",
		},
		34:{
			name: "黄金自动机",
			done() {return player.p.buyables[12].gte(2000)},
			tooltip: "达到2000级自动数米。奖励：手动数米获得的金币翻倍。",
		},
		35:{
			name: "兆、京、垓后面是什么？",
			done() {return getRank().gte(16)},
			tooltip: "完成16个目标。",
		},
		36:{
			name: "吃的较饱",
			done() {return getELevel().gte(2500)},
			tooltip: "吃掉2500桶米。",
		},
		37:{
			name: "青铜加成",
			done() {return player.p.buyables[13].gte(100)},
			tooltip: "达到100级数米加成。",
		},
		41:{
			name: "这已经很多了吗？",
			done() {return getLevel().gte(4000)},
			tooltip: "数完4000桶米。",
		},
		42:{
			name: "米神下凡",
			done() {return getRank().gte(20)},
			tooltip: "完成20个目标。",
		},
		43:{
			name: "白金米袋",
			done() {return player.p.buyables[21].gte(10000)},
			tooltip: "达到10000级米袋。",
		},
		44:{
			name: "白金自动机",
			done() {return player.p.buyables[12].gte(10000)},
			tooltip: "达到10000级自动数米。奖励：手动数米获得的金币翻倍。",
		},
		45:{
			name: "垓、秭、穰后面是什么？",
			done() {return getRank().gte(24)},
			tooltip: "完成24个目标。",
		},
		46:{
			name: "吃的饱饱",
			done() {return getELevel().gte(5000)},
			tooltip: "吃掉5000桶米。",
		},
		47:{
			name: "黄金吃米自动机",
			done() {return player.e.buyables[21].gte(2000)},
			tooltip: "达到2000级自动吃米。",
		},
		51:{
			name: "米神供奉者 1",
			done() {return layers.s.effect2().gte(2)},
			tooltip: "米神的吃米能力加成达到2倍。奖励：成就点变为1.5倍。",
		},
		52:{
			name: "米神供奉者 2",
			done() {return layers.s.effect1().gte(2)},
			tooltip: "米神的数米能力加成达到2倍。奖励：上一个成就的奖励变为2倍。",
		},
		53:{
			name: "钻石米袋",
			done() {return player.p.buyables[21].gte(200000)},
			tooltip: "达到200000级米袋。",
		},
		54:{
			name: "钻石自动机",
			done() {return player.p.buyables[12].gte(200000)},
			tooltip: "达到200000级自动数米。",
		},
		55:{
			name: "穰、沟、涧后面是什么？",
			done() {return getRank().gte(32)},
			tooltip: "完成32个目标。",
		},
		56:{
			name: "白金吃米自动机",
			done() {return player.e.buyables[21].gte(10000)},
			tooltip: "达到10000级自动吃米。",
		},
		57:{
			name: "米神供奉者 3",
			done() {return layers.s.effect3().gte(2)},
			tooltip: "米神的金币加成达到2倍。",
		},
		61:{
			name: "数一万桶米",
			done() {return getLevel().gte(10000)},
			tooltip: "完成一万桶米。",
		},
		62:{
			name: "更强的吸引力",
			done() {return getELevel().gte(9000)},
			tooltip: "解锁吃米小鸟6。",
		},
		63:{
			name: "万层米",
			done() {return getELevel().gte(10000)},
			tooltip: "吃掉一万桶米。",
		},
		64:{
			name: "青铜自动机加成",
			done() {return player.p.buyables[22].gte(100)},
			tooltip: "达到100级自动数米加成。",
		},
		65:{
			name: "涧、正、载后面是什么？",
			done() {return getRank().gte(40)},
			tooltip: "完成40个目标。",
		},
		66:{
			name: "米神供奉者 4",
			done() {return layers.s.effect4().gte(2)},
			tooltip: "米神的钻石加成达到2倍。奖励：米神增加成就点获取。",
		},
		67:{
			name: "白银加成",
			done() {return player.p.buyables[13].gte(500)},
			tooltip: "达到500级数米加成。",
		},
		71:{
			name: "高倍率米袋",
			done() {return buyableEffect("p",21).gte(5)},
			tooltip: "米袋倍数达到20。奖励：米袋倍数提升自动数米能力。",
		},
		72:{
			name: "米神供奉者 5",
			done() {return layers.s.effect1().gte(10)},
			tooltip: "米神的数米能力加成达到10倍。",
		},
		73:{
			name: "黄金加成",
			done() {return player.p.buyables[13].gte(2000)},
			tooltip: "达到2000级数米加成。",
		},
		74:{
			name: "闪光米袋",
			done() {return player.p.buyables[21].gte(5000000)},
			tooltip: "达到5000000级米袋。",
		},
		75:{
			name: "比太阳系还大",
			done() {return getRank().gte(35)},
			tooltip: "数1e42粒米。",
		},
		76:{
			name: "无限进度20%",
			done() {return getRank().gte(60)},
			tooltip: "完成60个目标。",
		},
		77:{
			name: "白金加成",
			done() {return player.p.buyables[13].gte(10000)},
			tooltip: "达到10000级数米加成。",
		},
		81:{
			name: "白银自动机加成",
			done() {return player.p.buyables[22].gte(500)},
			tooltip: "达到500级自动数米加成。",
		},
		82:{
			name: "比银河系还大",
			done() {return getRank().gte(53)},
			tooltip: "数1e60粒米。",
		},
		83:{
			name: "米神供奉者 6",
			done() {return layers.s.effect3().gte(10)},
			tooltip: "米神的金币加成达到10倍。",
		},
		84:{
			name: "米袋王者",
			done() {return player.p.buyables[21].gte(1e8)},
			tooltip: "达到一亿级米袋。",
		},
		85:{
			name: "闪光自动机",
			done() {return player.p.buyables[12].gte(5000000)},
			tooltip: "达到5000000级自动数米。",
		},
		86:{
			name: "自动王者",
			done() {return player.p.buyables[12].gte(1e8)},
			tooltip: "达到一亿级自动数米。",
		},
		87:{
			name: "古戈尔",
			done() {return getRank().gte(93)},
			tooltip: "数1e100粒米。",
		},
		91:{
			name: "黄金自动机加成",
			done() {return player.p.buyables[22].gte(2000)},
			tooltip: "达到2000级自动数米加成。",
		},
		92:{
			name: "钻石加成",
			done() {return player.p.buyables[13].gte(200000)},
			tooltip: "达到200000级数米加成。",
		},
		93:{
			name: "吃米王者",
			done() {return player.e.buyables[21].gte(1e8)},
			tooltip: "达到一亿级自动吃米。",
		},
		94:{
			name: "青铜米袋加成",
			done() {return player.p.buyables[23].gte(100)},
			tooltip: "达到100级米袋加成。",
		},
		95:{
			name: "协同工作",
			done() {return player.g.points.gte(1)},
			tooltip: "拥有1名工人。",
		},
		96:{
			name: "白金自动机加成",
			done() {return player.p.buyables[22].gte(10000)},
			tooltip: "达到10000级自动数米加成。",
		},
		97:{
			name: "米神供奉者 7",
			done() {return layers.s.effect5().gte(2)},
			tooltip: "米神的成就点加成达到2倍。",
		},
		101:{
			name: "一个小组",
			done() {return player.g.points.gte(10)},
			tooltip: "拥有10名工人。",
		},
		102:{
			name: "闪光加成",
			done() {return player.p.buyables[13].gte(5000000)},
			tooltip: "达到5000000级数米加成。",
		},
		103:{
			name: "白银米袋加成",
			done() {return player.p.buyables[23].gte(500)},
			tooltip: "达到500级米袋加成。",
		},
		104:{
			name: "超级米袋",
			done() {return buyableEffect("p",21).gte(25)},
			tooltip: "米袋倍数达到100。",
		},
		105:{
			name: "加成王者",
			done() {return player.p.buyables[13].gte(1e8)},
			tooltip: "达到一亿级数米加成。",
		},
		106:{
			name: "钻石自动机加成",
			done() {return player.p.buyables[22].gte(200000)},
			tooltip: "达到200000级自动数米加成。",
		},
		107:{
			name: "转基因米",
			done() {return getRank().gte(200)},
			tooltip: "完成200个目标。",
		},
		111:{
			name: "元-成就",
			done() {return player.a.points.gte(333)},
			tooltip: "拥有333成就点。奖励：成就点对金币的加成更好。",
		},
		112:{
			name: "黄金米袋加成",
			done() {return player.p.buyables[23].gte(2000)},
			tooltip: "达到2000级米袋加成。",
		},
		113:{
			name: "好多金币",
			done() {return player.p.points.gte(1e50)},
			tooltip: "拥有1e50金币。",
		},
		114:{
			name: "米神供奉者 8",
			done() {return layers.s.effect4().gte(10)},
			tooltip: "米神的钻石加成达到10倍。",
		},
		115:{
			name: "白金米袋加成",
			done() {return player.p.buyables[23].gte(10000)},
			tooltip: "达到10000级米袋加成。",
		},
		116:{
			name: "闪光自动机加成",
			done() {return player.p.buyables[22].gte(5000000)},
			tooltip: "达到5000000级自动数米加成。",
		},
		117:{
			name: "即将无限",
			done() {return getRank().gte(300)},
			tooltip: "完成300个目标。",
		},
		121:{
			name: "无限达成！",
			done() {return getRank().gte(301)},
			tooltip: "达到无限。",
		},
		122:{
			name: "又是新的点数！",
			done() {return player.i.points.gte(1)},
			tooltip: "得到1无限点数。",
		},
		123:{
			name: "每秒无限",
			done() {return layers.i.gainMult().gte(1)},
			tooltip: "得到1无限点数每秒。",
		},
		124:{
			name: "小团体",
			done() {return player.g.points.gte(25)},
			tooltip: "拥有25名工人。奖励：成就点对数米能力的加成更好。",
		},
		125:{
			name: "分数价格",
			done() {return player.t.buyables[23].gte(10)},
			tooltip: "数米能力价格小于1金币。",
		},
		126:{
			name: "自动机加成王者",
			done() {return player.p.buyables[22].gte(1e8)},
			tooltip: "达到一亿级自动数米加成。",
		},
		127:{
			name: "360度数米",
			done() {return getRank().gte(360)},
			tooltip: "完成360个目标。奖励：成就点对吃米能力的加成更好。",
		},
		131:{
			name: "钻石米袋加成",
			done() {return player.p.buyables[23].gte(200000)},
			tooltip: "达到200000级米袋加成。",
		},
		132:{
			name: "升级无限",
			done() {return getRank().gte(390)},
			tooltip: "解锁9个无限购买项。",
		},
		133:{
			name: "突变王者",
			done() {return player.n.points.gte(1e8)},
			tooltip: "拥有一亿突变基因。",
		},
		134:{
			name: "数一百万桶米",
			done() {return getLevel().gte(1e6)},
			tooltip: "完成一百万桶米。",
		},
		135:{
			name: "开始成仙",
			done() {return getRank().gte(400)},
			tooltip: "完成400个目标。",
		},
		136:{
			name: "闪光米袋加成",
			done() {return player.p.buyables[23].gte(5000000)},
			tooltip: "达到5000000级米袋加成。",
		},
		137:{
			name: "境界提升",
			done() {return player.x.points.gte(4)},
			tooltip: "达到4修为。",
		},
		141:{
			name: "米袋加成王者",
			done() {return player.p.buyables[23].gte(1e8)},
			tooltip: "达到一亿级米袋加成。奖励：米袋加成的效果更好。",
		},
		142:{
			name: "阶层晋升",
			done() {return getRank().gte(460)},
			tooltip: "达到阶层1。",
		},
		143:{
			name: "钻石王者",
			done() {return layers.t.getBuyPoint().gte(1e8)},
			tooltip: "拥有一亿钻石。",
		},
		144:{
			name: "超级米袋 II",
			done() {return buyableEffect("p",21).gte(250)},
			tooltip: "米袋倍数达到1000。",
		},
		145:{
			name: "阶层晋升 II",
			done() {return getRank().gte(520)},
			tooltip: "达到阶层2。",
		},
		146:{
			name: "古戈尔 II",
			done() {return player.p.points.gte(1e100)},
			tooltip: "有1e100金币。",
		},
		147:{
			name: "境界提升 II",
			done() {return player.x.points.gte(16)},
			tooltip: "达到16修为。",
		},
		151:{
			name: "阶层晋升 III",
			done() {return getRank().gte(700)},
			tooltip: "达到阶层5。",
		},
		152:{
			name: "1000个0",
			done() {return player.points.gte("1e1000")},
			tooltip: "数1e1000粒米。",
		},
		153:{
			name: "100个成就",
			done() {return player.a.achievements.length>=100},
			tooltip: "拥有100个成就",
		},
		154:{
			name: "中团体",
			done() {return player.g.points.gte(50)},
			tooltip: "拥有50名工人。",
		},
		155:{
			name: "1000成就点",
			done() {return player.a.points.gte(1000)},
			tooltip: "拥有1000成就点",
		},
		156:{
			name: "阶层晋升 IV",
			done() {return getRank().gte(1000)},
			tooltip: "达到阶层10。",
		},
		157:{
			name: "境界提升 III",
			done() {return player.x.points.gte(64)},
			tooltip: "达到64修为。",
		},
		161:{
			name: "10倍无限",
			done() {return player.points.gte(Decimal.pow(2,10240))},
			tooltip: "数3.52e3082粒米。",
		},
		162:{
			name: "境界提升 IV",
			done() {return player.x.points.gte(4096)},
			tooltip: "达到4096修为。",
		},
		163:{
			name: "超级突变",
			done() {return player.n.buyables[11].gte(120)},
			tooltip: "解锁十级突变基因。",
		},
		164:{
			name: "阶层晋升 V",
			done() {return getRank().gte(2250)},
			tooltip: "达到阶层15。",
		},
		165:{
			name: "超级米袋 III",
			done() {return buyableEffect("p",21).gte(2500)},
			tooltip: "米袋倍数达到10000。",
		},
		166:{
			name: "无限基因",
			done() {return player.n.points.gte(Decimal.pow(2,1024))},
			tooltip: "拥有1.79e308突变基因。",
		},
		167:{
			name: "无限金币",
			done() {return player.p.points.gte(Decimal.pow(2,1024))},
			tooltip: "拥有1.79e308金币。奖励：超过1.79e308的最佳金币数量增加无限点数获取。",
		},
		171:{
			name: "阶层晋升 VI",
			done() {return getRank().gte(4000)},
			tooltip: "达到阶层20。",
		},
		172:{
			name: "超级协同工作",
			done() {return player.g.buyables[13].gte(1)},
			tooltip: "购买第三个工人购买项。",
		},
		173:{
			name: "一次无限粒米",
			done() {return player.p.buyables[11].gte(Decimal.pow(2,1024))},
			tooltip: "达到1.79e308级数米能力。",
		},
		174:{
			name: "境界提升 V",
			done() {return player.x.points.gte(65536)},
			tooltip: "达到65536修为。",
		},
		175:{
			name: "大团体",
			done() {return player.g.points.gte(100)},
			tooltip: "拥有100名工人。",
		},
		176:{
			name: "一个不存在的成就",
			done() {return player.points.gte("8.888e8888")},
			tooltip: "数8.888e8888粒米。",
		},
		177:{
			name: "数一亿桶米",
			done() {return getLevel().gte(1e8)},
			tooltip: "完成一亿桶米。",
		},
		181:{
			name: "吃一亿桶米",
			done() {return getELevel().gte(1e8)},
			tooltip: "吃掉一亿桶米。",
		},
		182:{
			name: "10000个0",
			done() {return player.points.gte("1e10000")},
			tooltip: "数1e10000粒米。",
		},
		183:{
			name: "古戈尔 III",
			done() {return player.i.points.gte(1e100)},
			tooltip: "拥有1e100无限点数。",
		},
		184:{
			name: "境界提升 VI",
			done() {return player.x.points.gte(1048576)},
			tooltip: "达到1048576修为。",
		},
		185:{
			name: "超级米袋 IV",
			done() {return buyableEffect("p",21).gte(25000)},
			tooltip: "米袋倍数达到100000。",
		},
		186:{
			name: "超级米神",
			done() {return layers.s.effect6().add(10).log10().div(player.s.points.add(10).log10()).gte(1.01) && player.s.points.gte("1e10000")},
			tooltip: "米神的帮助数米指数超过1.01。",
		},
		187:{
			name: "数十亿桶米",
			done() {return getLevel().gte(1e9)},
			tooltip: "完成十亿桶米。",
		},
		191:{
			name: "超大团体",
			done() {return player.g.points.gte(200)},
			tooltip: "拥有200名工人。",
		},
		192:{
			name: "阶层晋升 VII",
			done() {return getRank().gte(16000)},
			tooltip: "达到阶层40。",
		},
		193:{
			name: "要到永恒了吗？",
			done() {return player.i.points.gte(Number.MAX_VALUE)},
			tooltip: "拥有1.8e308无限点数。奖励：解锁永恒。",
		},
		194:{
			name: "100000个0",
			done() {return player.points.gte("1e100000")},
			tooltip: "数1e100000粒米。",
		},
		195:{
			name: "境界提升 VII",
			done() {return player.x.points.gte(67108864)},
			tooltip: "达到67108864修为。",
		},
		196:{
			name: "超无限金币",
			done() {return player.p.points.gte("1e1000")},
			tooltip: "拥有1e1000金币。",
		},
		197:{
			name: "高质量工作",
			done() {return buyableEffect("g",12).gte(0.1)},
			tooltip: "工作质量达到0.1。",
		},
		201:{
			name: "数一百亿桶米",
			done() {return getLevel().gte(1e10)},
			tooltip: "完成一百亿桶米。",
		},
		202:{
			name: "阶层晋升 VIII",
			done() {return getRank().gte(25000)},
			tooltip: "达到阶层50。",
		},
		203:{
			name: "吃一百亿桶米",
			done() {return getELevel().gte(1e10)},
			tooltip: "吃掉一百亿桶米。",
		},
		204:{
			name: "一亿修为",
			done() {return player.x.points.gte(1e8)},
			tooltip: "达到一亿修为。",
		},
		205:{
			name: "超级米袋 V",
			done() {return buyableEffect("p",21).gte(250000)},
			tooltip: "米袋倍数达到1000000。",
		},
		206:{
			name: "10000个0 II",
			done() {return player.n.points.gte("1e10000")},
			tooltip: "拥有1e10000个突变基因。",
		},
		207:{
			name: "不要只想着工人了",
			done() {return player.g.points.gte(300)},
			tooltip: "拥有300名工人。奖励：解锁工厂。",
		},
		211:{
			name: "超级米神 II",
			done() {return layers.s.effect6().add(10).log10().div(player.s.points.add(10).log10()).gte(1.1) && player.s.points.gte("1e10000")},
			tooltip: "米神的帮助数米指数超过1.1。",
		},
		212:{
			name: "阶层晋升 IX",
			done() {return getTier().gte(75)},
			tooltip: "达到阶层75。",
		},
		213:{
			name: "更好的工作环境",
			done() {return player.o.points.gte(1)},
			tooltip: "拥有1个工厂。",
		},
		214:{
			name: "更好的自动化？",
			done() {return getRank().gte(70000)},
			tooltip: "完成70000个目标。",
		},
		215:{
			name: "超级米袋 VI",
			done() {return buyableEffect("p",21).gte(2500000)},
			tooltip: "米袋倍数达到10000000。",
		},
		216:{
			name: "小工厂群",
			done() {return player.o.points.gte(10)},
			tooltip: "拥有10个工厂。奖励：成就点增加无限点数获取。",
		},
		217:{
			name: "阶层晋升 X",
			done() {return getTier().gte(100)},
			tooltip: "达到阶层100。奖励：成就点增加所有突变基因获取。",
		},
		221:{
			name: "自己的地盘",
			done() {return player.u.points.gte(1)},
			tooltip: "拥有1块土地。奖励：解锁科技。",
		},
		222:{
			name: "科技改变生活",
			done() {return player.y.points.gte(1)},
			tooltip: "拥有1科技点。",
		},
		223:{
			name: "自己的领地",
			done() {return player.u.points.gte(10)},
			tooltip: "拥有10块土地。",
		},
		224:{
			name: "1000000个0",
			done() {return player.points.gte("1e1000000")},
			tooltip: "数1e1000000粒米。",
		},
		225:{
			name: "阶层晋升 XI",
			done() {return getTier().gte(200)},
			tooltip: "达到阶层200。奖励：米袋倍数更好。",
		},
		226:{
			name: "工厂里的机器不比工人好吗？",
			done() {return player.g.points.gte(1000)},
			tooltip: "拥有1000名工人。",
		},
		227:{
			name: "境界提升 VIII",
			done() {return player.x.points.gte(1073741824)},
			tooltip: "达到凝气·起·最终阶。",
		},
		231:{
			name: "超级米神 III",
			done() {return layers.s.effect6().add(10).log10().div(player.s.points.add(10).log10()).gte(1.5) && player.s.points.gte("1e10000")},
			tooltip: "米神的帮助数米指数超过1.5。",
		},
		232:{
			name: "10000000个0",
			done() {return player.points.gte("1e10000000")},
			tooltip: "数1e10000000粒米。",
		},
		233:{
			name: "中级工厂群",
			done() {return player.o.points.gte(30)},
			tooltip: "拥有30个工厂。",
		},
		234:{
			name: "阶层晋升 XII",
			done() {return getTier().gte(500)},
			tooltip: "达到阶层500。",
		},
		235:{
			name: "境界提升 IX",
			done() {return player.x.points.gte(Decimal.pow(4,16))},
			tooltip: "达到凝气·承。",
		},
		236:{
			name: "超级米神 IV",
			done() {return layers.s.effect6().add(10).log10().div(player.s.points.add(10).log10()).gte(2) && player.s.points.gte("1e10000")},
			tooltip: "米神的帮助数米指数超过2。",
		},
		237:{
			name: "数一亿个零",
			done() {return player.points.gte("1e1e8")},
			tooltip: "数1e1e8粒米。当前残局就是这个成就。",
		},
	},
})


addLayer("s", {
    name: "S", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "米神", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 2, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#FF9933",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "粒已经供奉的米", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult(a) { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 2, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
    ],
	branches: ['p'],
	update(diff){
		
	},
	effect1(){
		if(getTier().gte(57))return player.s.points.add(10).log10().pow(100);
		if(getRank().gte(940))return player.s.points.add(10).log10().pow(getRank().gte(2250)?10:getRank().gte(1960)?9:getRank().gte(1000)?8:7);
		if(getRank().gte(740))return player.s.points.add(1e10).log10().div(10).pow(getRank().gte(850)?8:getRank().gte(800)?7.5:7);
		return player.s.points.add(1e25).log10().div(25).pow(getRank().gte(395)?7.5:getRank().gte(90)?7:getRank().gte(75)?6:getRank().gte(60)?4.5:3);
	},
	effect2(){
		if(getTier().gte(57))return player.s.points.add(10).log10().pow(1000);
		if(getRank().gte(940))return player.s.points.add(10).log10().pow(getRank().gte(2250)?50:getRank().gte(1960)?30:20);
		if(getRank().gte(740))return player.s.points.add(1e10).log10().div(10).pow(getRank().gte(850)?20:getRank().gte(800)?17:14);
		return player.s.points.add(1e25).log10().div(25).pow(getRank().gte(395)?15:getRank().gte(90)?9:getRank().gte(75)?8:getRank().gte(40)?7:getRank().gte(35)?5:4);
	},
	effect3(){
		if(getTier().gte(250))return player.s.points.add(10).log10().pow(7);
		if(getTier().gte(58))return player.s.points.add(10).log10().pow(5);
		if(getRank().gte(940))return player.s.points.add(10).log10().pow(getRank().gte(2250)?4:getRank().gte(1960)?3.5:getRank().gte(1000)?3:2.5);
		if(getRank().gte(800))return player.s.points.add(1e10).log10().div(10).pow(getRank().gte(850)?3:2.5);
		return player.s.points.add(1e25).log10().div(25).pow(getRank().gte(395)?3:getRank().gte(90)?2.5:2);
	},
	effect4(){
		if(hasUpgrade("y",15))return player.s.points.add(10).log10().pow(2.3);
		if(getRank().gte(880))return player.s.points.add(10).log10().pow(getRank().gte(2250)?2:getRank().gte(1960)?1.7:getRank().gte(940)?1.5:1.2);
		if(getRank().gte(740))return player.s.points.add(1e10).log10().div(10).pow(getRank().gte(800)?1.5:1.2);
		return player.s.points.add(1e25).log10().div(25).pow(getRank().gte(395)?1.2:getRank().gte(35)?1:0);
	},
	effect5(){
		let ret=player.s.points.add(1e25).log10().div(25).pow(hasAchievement("a",66)?0.4:0);
		if(getRank().gte(740))ret=player.s.points.add(1e10).log10().div(10).pow(0.5);
		if(getRank().gte(880))ret=player.s.points.add(10).log10().pow(0.5);
		if(ret.gte(4))ret=new Decimal(5).sub(new Decimal(3).div(ret.sub(1)));
		return ret;
	},
	effect6(){
		if(getTier().gte(500))return Decimal.pow(10,player.s.points.add(10).log10().pow(getTier().mul(0.00001).add(1.045).min(1.1)));
		if(getTier().gte(60))return Decimal.pow(10,player.s.points.add(10).log10().pow(getTier().mul(0.0001).add(1)));
		if(getTier().gte(55))return Decimal.pow(10,player.s.points.add(10).log10().pow(1.005));
		if(getTier().gte(50))return Decimal.pow(10,player.s.points.add(10).log10().pow(1.004));
		if(getTier().gte(45))return Decimal.pow(10,player.s.points.add(10).log10().pow(1.003));
		if(getTier().gte(40))return Decimal.pow(10,player.s.points.add(10).log10().pow(1.002));
		if(getTier().gte(16))return Decimal.pow(10,player.s.points.add(10).log10().pow(1.001));
		if(getRank().gte(800))return player.s.points.pow(1.001);
		return player.s.points.add(1).log10().mul(player.s.points).mul(getRank().gte(40)?0.001:0);
	},
	effect7(){
		if(hasUpgrade("y",15))return player.s.points.add(10).log10().pow(7);
		if(getRank().gte(880))return player.s.points.add(10).log10();
		if(getRank().gte(850))return player.s.points.add(1e10).log10().div(10);
		return player.s.points.add(getRank().gte(395)?1e25:1e75).log10().div(getRank().gte(395)?25:75).pow(getRank().gte(90)?1:0);
	},
	effect8(){
		if(getRank().gte(1000))return player.s.points.add(10).log10().pow(0.5);
		return new Decimal(1);
	},
	clickables:{
            11: {
                title: "供奉开关",
                display(){
					return player.s.a1?("开启\n米袋自动释放的米将会供奉给米神"):"关闭\n米袋自动释放的米将不会供奉给米神";
				},
                unlocked() { return true}, 
				canClick(){return true},
				onClick(){
					player.s.a1=!player.s.a1;
				},
                style: {'height':'100px','width':'150px'},
            },
	},
	tabFormat: [
		"main-display",
		["display-text","你可以通过下面的按钮将米袋自动释放的米供奉给米神。"],
		["clickable",11],
		["display-text","米神为你提供以下加成"],
		["display-text",function(){
			if(getTier().gte(144))return "数米能力等级："+format(layers.s.effect1().pow(getTier().gte(250)?1:getTier().gte(183)?0.5:0.1))+"倍";
			return "数米能力："+format(layers.s.effect1())+"倍";
		}],
		["display-text",function(){
			return "吃米能力："+format(layers.s.effect2())+"倍";
		}],
		["display-text",function(){
			return "金币获取："+format(layers.s.effect3())+"倍";
		}],
		["display-text",function(){
			if(getRank().gte(35))return "钻石获取："+format(layers.s.effect4())+"倍";
			return "";
		}],
		["display-text",function(){
			if(getRank().gte(90))return "自动数米："+format(layers.s.effect7())+"倍";
			return "";
		}],
		["display-text",function(){
			if(getRank().gte(1000))return "无限点数："+format(layers.s.effect8())+"倍";
			return "";
		}],
		["display-text",function(){
			if(hasAchievement("a",66))return "成就点获取："+format(layers.s.effect5())+"倍";
			return "";
		}],
		["display-text",function(){
			if(getRank().gte(40))return "帮助数米："+format(layers.s.effect6())+"/秒";
			return "";
		}],
		["display-text",function(){
			if(getTier().gte(16))return "帮助数米指数：^"+format(layers.s.effect6().add(10).log10().div(player.s.points.add(10).log10()),6);
			return "";
		}],
	],
    layerShown(){return getRank().gte(20)},
})


addLayer("g", {
    name: "G", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "工人", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 2, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#999999",
    requires(){
		if(getTier().gte(29))return new Decimal(1);
		return new Decimal(1e29);
	}, // Can be a function that takes requirement increases into account
    resource: "数米工人", // Name of prestige currency
    baseResource: "金币", // Name of resource prestige is based on
    baseAmount() {return player.p.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent(){
		if(getTier().gte(500))return new Decimal(1.302).sub(getTier().mul(0.0001)).max(1.2);
		if(getTier().gte(300))return new Decimal(1.352).sub(getTier().mul(0.0002));
		if(getTier().gte(170))return new Decimal(1.442).sub(getTier().mul(0.0005));
		if(getTier().gte(100))return new Decimal(1.527).sub(getTier().mul(0.001));
		if(getTier().gte(92))return new Decimal(1.626).sub(getTier().mul(0.002));
		if(getTier().gte(90))return new Decimal(1.625).sub(getTier().mul(0.002));
		if(getTier().gte(85))return new Decimal(1.624).sub(getTier().mul(0.002));
		if(getTier().gte(84))return new Decimal(1.623).sub(getTier().mul(0.002));
		if(getTier().gte(83))return new Decimal(1.622).sub(getTier().mul(0.002));
		if(getTier().gte(82))return new Decimal(1.621).sub(getTier().mul(0.002));
		if(getTier().gte(80))return new Decimal(1.623).sub(getTier().mul(0.002));
		if(getTier().gte(79))return new Decimal(1.624).sub(getTier().mul(0.002));
		if(getTier().gte(78))return new Decimal(1.623).sub(getTier().mul(0.002));
		if(getTier().gte(77))return new Decimal(1.624).sub(getTier().mul(0.002));
		if(getTier().gte(76))return new Decimal(1.623).sub(getTier().mul(0.002));
		if(getTier().gte(75))return new Decimal(1.624).sub(getTier().mul(0.002));
		if(getTier().gte(73))return new Decimal(1.623).sub(getTier().mul(0.002));
		if(getTier().gte(71))return new Decimal(1.622).sub(getTier().mul(0.002));
		if(getTier().gte(68))return new Decimal(1.62).sub(getTier().mul(0.002));
		if(getTier().gte(66))return new Decimal(1.619).sub(getTier().mul(0.002));
		if(getTier().gte(64))return new Decimal(1.62).sub(getTier().mul(0.002));
		if(getELevel().gte(5e9))return new Decimal(1.495);
		return new Decimal(1.5);
	},  // Prestige currency exponent
	base: 2,
    gainMult(a) { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
    ],
	branches: ['p'],
	update(diff){
		
	},
	buyables:{
		11: {
			title: "工作速度", // Optional, displayed at the top in a larger font
			cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
				if(getTier().gte(23))return Decimal.pow(10,x);
				let cost = Decimal.pow(10,x).mul(1e40);
				return cost
			},
			effect(x=player[this.layer].buyables[this.id]) { // Effects of owning x of the items, x is a decimal
				let eff = x.mul(layers.g.buyables[11].effectMult()).add(1);
				return eff;
			},
			effectMult(){
				let eff = layers.i.buyables[32].effect();
				eff = eff.mul(layers.o.effect1());
				if(player.o.points.gte(30))eff = eff.mul(player.g.points.max(1).sqrt());
				return eff;
			},
			display() { // Everything else displayed in the buyable button after the title
				let data = tmp[this.layer].buyables[this.id]
				return "等级："+formatWhole(player[this.layer].buyables[this.id])+(getRank().gte(385)?"×"+formatWhole(tmp.g.buyables[11].effectMult):"")+"\n\
				工人的自动数米速度加成：" + format(data.effect) + "倍\n" +
				((player.o.points.gte(4))?("+"+formatWhole(player.p.points.log10().pow(hasUpgrade("y",25)?3:2).div(hasUpgrade("y",22)?1:10000))+"/s"):"花费：" + formatWhole(data.cost) + " 金币");
			},
			unlocked() { return true; }, 
			canAfford() {
				return player.p.points.gte(tmp[this.layer].buyables[this.id].cost)},
			buy() { 
				cost = tmp[this.layer].buyables[this.id].cost
				player.p.points = player.p.points.sub(cost)	
				player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
			},
                purchaseLimit: 9e15,
			style: {'height':'222px'},
		},
		12: {
			title: "工作质量", // Optional, displayed at the top in a larger font
			cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
				if(getTier().gte(23))return Decimal.pow(1000,x);
				let cost = Decimal.pow(1000,x).mul(1e45);
				return cost
			},
			effect(x=player[this.layer].buyables[this.id]) { // Effects of owning x of the items, x is a decimal
				let eff = x.mul(0.001).add(0.005);
				if(getTier().gte(29)){
					let scStart=getTier().div(1e3);
					if(eff.gte(scStart))eff=eff.mul(scStart).mul(scStart).cbrt();
				}else if(getTier().gte(25)){
					if(eff.gte(0.028))eff=eff.mul(0.028).mul(0.028).cbrt();
				}else if(getTier().gte(24)){
					if(eff.gte(0.027))eff=eff.mul(0.027).mul(0.027).cbrt();
				}else if(getTier().gte(23)){
					if(eff.gte(0.026))eff=eff.mul(0.026).mul(0.026).cbrt();
				}else{
					if(eff.gte(0.025))eff=eff.mul(0.025).mul(0.025).cbrt();
				}
				return eff;
			},
			display() { // Everything else displayed in the buyable button after the title
				let data = tmp[this.layer].buyables[this.id]
				return "等级："+formatWhole(player[this.layer].buyables[this.id])+"\n\
				工人的数米能力等级指数：+" + format(data.effect) + "\n\
				花费：" + formatWhole(data.cost) + " 金币";
			},
			unlocked() { return true; }, 
			canAfford() {
				return player.p.points.gte(tmp[this.layer].buyables[this.id].cost)},
			buy() { 
				cost = tmp[this.layer].buyables[this.id].cost
				player.p.points = player.p.points.sub(cost)	
				player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
			},
                purchaseLimit: 9e15,
			style: {'height':'222px'},
		},
		13: {
			title: "工作协同", // Optional, displayed at the top in a larger font
			cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
				if(getTier().gte(25))return Decimal.pow(1e5,x);
				if(getTier().gte(24))return Decimal.pow(1e5,x).mul(1e200);
				let cost = Decimal.pow(1e5,x).mul(1e280);
				return cost
			},
			effect(x=player[this.layer].buyables[this.id]) { // Effects of owning x of the items, x is a decimal
				let eff = x.mul(0.02).add(1);
				if(eff.gte(10))eff=eff.mul(10).pow(0.5);
				return eff;
			},
			display() { // Everything else displayed in the buyable button after the title
				let data = tmp[this.layer].buyables[this.id]
				return "等级："+formatWhole(player[this.layer].buyables[this.id])+"\n\
				工人的自动数米速度加成指数：^" + format(data.effect) + "\n\
				花费：" + formatWhole(data.cost) + " 金币";
			},
			unlocked() { return true; }, 
			canAfford() {
				return player.p.points.gte(tmp[this.layer].buyables[this.id].cost)},
			buy() { 
				cost = tmp[this.layer].buyables[this.id].cost
				player.p.points = player.p.points.sub(cost)	
				player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
			},
                purchaseLimit: 9e15,
			style: {'height':'222px'},
		},
	},
	effect1(){
		return player.g.points.mul(buyableEffect("g",11)).pow(buyableEffect("g",13)).add(1);
	},
	effect2(){
		return player.g.points.mul(buyableEffect("g",12)).add(1);
	},
	effectDescription(){
		let data=tmp[this.layer];
		if(getTier().gte(70))return "自动数米速度变为原来的"+format(data.effect1)+"倍，数米能力等级变为原来的"+format(data.effect1)+"倍之后变为"+format(data.effect2)+"次方";
		return "自动数米速度变为原来的"+format(data.effect1)+"倍，数米能力等级变为原来的"+format(data.effect2)+"次方";
	},
	tabFormat: [
		"main-display",
		"prestige-button",
		"resource-display",
		["display-text","本层级不会重置任何东西。"],"buyables"
	],
    layerShown(){return getRank().gte(100)},
    autoPrestige(){return hasUpgrade("y",12)},
    canBuyMax(){return hasUpgrade("y",12)},
	resetsNothing: true,
})


addLayer("n", {
    name: "N", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "基因", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
		progress: [
			new Decimal(0),
			new Decimal(0),
			new Decimal(0),
			new Decimal(0),
			new Decimal(0),
			new Decimal(0),
			new Decimal(0),
			new Decimal(0),
			new Decimal(0),
			new Decimal(0),
			new Decimal(0),
			new Decimal(0),
			new Decimal(0),
			new Decimal(0),
		],
		gen: [
			new Decimal(0),
			new Decimal(0),
			new Decimal(0),
			new Decimal(0),
			new Decimal(0),
			new Decimal(0),
			new Decimal(0),
			new Decimal(0),
			new Decimal(0),
			new Decimal(0),
			new Decimal(0),
			new Decimal(0),
			new Decimal(0),
			new Decimal(0),
		],
    }},
    color: "#FF6666",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "突变基因", // Name of prestige currency
    baseResource: "金币", // Name of resource prestige is based on
    baseAmount() {return player.p.points}, // Get the current amount of baseResource
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1.5, // Prestige currency exponent
	base: 2,
    gainMult(a) { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
    ],
	branches: ['p'],
	update(diff){
		
		if(player[this.layer].buyables[11].gte(777)){
			player.n.points=player.n.points.add(player.points.add(10).log10().pow(player.n.buyables[11].div(player[this.layer].buyables[11].gte(1420)?4:player[this.layer].buyables[11].gte(1366)?5:player[this.layer].buyables[11].gte(1200)?6:player[this.layer].buyables[11].gte(888)?8:player[this.layer].buyables[11].gte(800)?9:10)).max(player.points.add(10).log10().pow(3).mul(Decimal.pow(1.1,player.n.buyables[11]))).mul(layers.i.buyables[33].effect()).mul(player.n.gen[0].add(1)).mul(diff).mul(layers.u.effect1()).mul(player.x.points.gte(256)?layers.x.effect():1).mul(getTier().gte(100)?player.et.points.add(1):1).mul(getTier().gte(100)?player.a.points.add(1):1));
			player.n.progress[0]=new Decimal(0);
			for(var i=1;i<=11;i++){
				player.n.progress[i]=player.n.progress[i].add(player.points.add(10).log10().pow(player.n.buyables[11].div(player[this.layer].buyables[11].gte(1420)?55:player[this.layer].buyables[11].gte(1366)?60:player[this.layer].buyables[11].gte(1200)?65:player[this.layer].buyables[11].gte(888)?70:player[this.layer].buyables[11].gte(800)?75:80)).max(player.points.add(10).log10().pow(3).mul(Decimal.pow(1.1,player.n.buyables[11]))).mul(layers.i.buyables[33].effect()).mul((i==1?player.n.points:player.n.gen[i-2]).pow(0.2)).mul(player.n.gen[i].add(1)).mul(diff).mul((player.x.points.gte(i==2?16384:4194304)?layers.x.effect():1)).mul(getRank().gte(30000)?player.et.points.add(1):1).mul(getTier().gte(100)?player.a.points.add(1):1));
				player.n.gen[i-1]=player.n.gen[i-1].add(player.n.progress[i].div(100).floor());
				player.n.progress[i]=player.n.progress[i].sub(player.n.progress[i].div(100).floor().mul(100));
			}
		}else{
			if(player[this.layer].buyables[11].gte(175)){
				player.n.progress[0]=player.n.progress[0].add(player.points.add(10).log10().pow(3).mul(Decimal.pow(1.1,player.n.buyables[11])).mul(layers.i.buyables[33].effect()).mul(player.n.gen[0].add(1)).mul(diff).mul(player.x.points.gte(256)?layers.x.effect():1));
			}else{
				player.n.progress[0]=player.n.progress[0].add(player.points.add(10).log10().div(200).pow(2).mul(player.n.buyables[11].pow(player.n.buyables[11].gte(42)?1:0.5)).mul(layers.i.buyables[33].effect()).mul(player.n.gen[0].add(1)).mul(player[this.layer].buyables[11].gte(18)?100:(Math.random()*20+10)).mul(diff)).mul(player.x.points.gte(256)?layers.x.effect():1);
			}
			if(player.n.progress[0].gte(100)){
				player.n.points=player.n.points.add(player.n.progress[0].div(100).floor());
				player.n.progress[0]=player.n.progress[0].sub(player.n.progress[0].div(100).floor().mul(100));
			}
			if(player[this.layer].buyables[11].gte(90)){
				for(var i=1;i<=(player[this.layer].buyables[11].gte(555)?11:player[this.layer].buyables[11].gte(350)?10:player[this.layer].buyables[11].gte(120)?9:player[this.layer].buyables[11].gte(100)?8:7);i++){
					player.n.progress[i]=player.n.progress[i].add(player.points.add(10).log10().pow(player[this.layer].buyables[11].gte(200)?3:player[this.layer].buyables[11].gte(175)?2.5:2).mul(player.n.buyables[11].gte(115)?Decimal.pow(1.1,player.n.buyables[11]):player.n.buyables[11].gte(110)?Decimal.pow(1.07,player.n.buyables[11]):player.n.buyables[11]).mul(layers.i.buyables[33].effect()).mul((i==1?player.n.points:player.n.gen[i-2]).pow(0.2)).mul(player.n.gen[i].add(1)).mul(diff).mul(i==7?Decimal.pow(10,player[this.layer].buyables[11].sub(100).min(0)):(i==8?Decimal.pow(1.8,player[this.layer].buyables[11].sub(150).min(0)):(i==9?Decimal.pow(1.5,player[this.layer].buyables[11].sub(200).min(0)):(i==10?Decimal.pow(2,player[this.layer].buyables[11].sub(500).min(0)):(i==11?Decimal.pow(2,player[this.layer].buyables[11].sub(750).min(0)):1))))).mul((player.x.points.gte(i==2?16384:4194304)?layers.x.effect():1)).mul(getRank().gte(30000)?player.et.points.add(1):1));
					player.n.gen[i-1]=player.n.gen[i-1].add(player.n.progress[i].div(100).floor());
					player.n.progress[i]=player.n.progress[i].sub(player.n.progress[i].div(100).floor().mul(100));
				}
			}else{
				if(player[this.layer].buyables[11].gte(70)){
					for(var i=1;i<=2;i++){
						player.n.progress[i]=player.n.progress[i].add(player.points.add(10).log10().pow(2).mul(player.n.buyables[11]).mul(layers.i.buyables[33].effect()).mul((i==1?player.n.points:player.n.gen[i-2]).pow(0.2)).mul(player.n.gen[i].add(1)).mul(diff));
						player.n.gen[i-1]=player.n.gen[i-1].add(player.n.progress[i].div(100).floor());
						player.n.progress[i]=player.n.progress[i].sub(player.n.progress[i].div(100).floor().mul(100));
					}
				}else{
					if(player[this.layer].buyables[11].gte(10)){
						player.n.progress[1]=player.n.progress[1].add(player.points.add(10).log10().div(200).pow(2).mul(player.n.buyables[11].pow(player.n.buyables[11].gte(42)?1:0.5)).mul(layers.i.buyables[33].effect()).mul(player.n.points.pow(0.2)).mul(player.n.gen[1].add(1)).mul(player[this.layer].buyables[11].gte(36)?10:(Math.random()*2+1)).mul(diff));
						player.n.gen[0]=player.n.gen[0].add(player.n.progress[1].div(100).floor());
						player.n.progress[1]=player.n.progress[1].sub(player.n.progress[1].div(100).floor().mul(100));
					}
					if(player[this.layer].buyables[11].gte(15)){
						player.n.progress[2]=player.n.progress[2].add(player.points.add(10).log10().div(200).pow(2).mul(player.n.buyables[11].pow(player.n.buyables[11].gte(42)?1:0.5)).mul(layers.i.buyables[33].effect()).mul(player.n.gen[0].pow(0.2)).mul(player.n.gen[2].add(1)).mul(player[this.layer].buyables[11].gte(36)?1:(Math.random()*0.2+0.1)).mul(diff));
						player.n.gen[1]=player.n.gen[1].add(player.n.progress[2].div(100).floor());
						player.n.progress[2]=player.n.progress[2].sub(player.n.progress[2].div(100).floor().mul(100));
					}
				}
				if(player[this.layer].buyables[11].gte(72)){
					for(var i=3;i<=4;i++){
						player.n.progress[i]=player.n.progress[i].add(player.points.add(10).log10().pow(2).mul(player.n.buyables[11]).mul(layers.i.buyables[33].effect()).mul(player.n.gen[i-2].pow(0.2)).mul(player.n.gen[i].add(1)).mul(Decimal.pow(10,player[this.layer].buyables[11].sub(75).min(0))).mul(diff));
						player.n.gen[i-1]=player.n.gen[i-1].add(player.n.progress[i].div(100).floor());
						player.n.progress[i]=player.n.progress[i].sub(player.n.progress[i].div(100).floor().mul(100));
					}
				}else{
					if(player[this.layer].buyables[11].gte(20)){
						player.n.progress[3]=player.n.progress[3].add(player.points.add(10).log10().div(200).pow(2).mul(player.n.buyables[11].pow(player.n.buyables[11].gte(42)?1:0.5)).mul(layers.i.buyables[33].effect()).mul(player.n.gen[1].pow(0.2)).mul(player.n.gen[3].add(1)).mul(player[this.layer].buyables[11].gte(64)?0.1:Math.random()*0.02+0.01).mul(diff));
						player.n.gen[2]=player.n.gen[2].add(player.n.progress[3].div(100).floor());
						player.n.progress[3]=player.n.progress[3].sub(player.n.progress[3].div(100).floor().mul(100));
					}
					if(player[this.layer].buyables[11].gte(40)){
						player.n.progress[4]=player.n.progress[4].add(player.points.add(10).log10().div(200).pow(2).mul(player.n.buyables[11].pow(player.n.buyables[11].gte(42)?1:0.5)).mul(layers.i.buyables[33].effect()).mul(player.n.gen[2].pow(0.2)).mul(player.n.gen[4].add(1)).mul(player[this.layer].buyables[11].gte(64)?0.01:Math.random()*0.002+0.001).mul(diff));
						player.n.gen[3]=player.n.gen[3].add(player.n.progress[4].div(100).floor());
						player.n.progress[4]=player.n.progress[4].sub(player.n.progress[4].div(100).floor().mul(100));
					}
				}
				if(player[this.layer].buyables[11].gte(75)){
					for(var i=5;i<=6;i++){
						player.n.progress[i]=player.n.progress[i].add(player.points.add(10).log10().pow(2).mul(player.n.buyables[11]).mul(layers.i.buyables[33].effect()).mul(player.n.gen[i-2].pow(0.2)).mul(player.n.gen[i].add(1)).mul(Decimal.pow(10,player[this.layer].buyables[11].sub(80).min(0))).mul(diff));
						player.n.gen[i-1]=player.n.gen[i-1].add(player.n.progress[i].div(100).floor());
						player.n.progress[i]=player.n.progress[i].sub(player.n.progress[i].div(100).floor().mul(100));
					}
				}else{
					if(player[this.layer].buyables[11].gte(45)){
						player.n.progress[5]=player.n.progress[5].add(player.points.add(10).log10().div(200).pow(2).mul(player.n.buyables[11].pow(player.n.buyables[11].gte(42)?1:0.5)).mul(layers.i.buyables[33].effect()).mul(player.n.gen[3].pow(0.2)).mul(player.n.gen[5].add(1)).mul(Math.random()*0.0002+0.0001).mul(diff));
						player.n.gen[4]=player.n.gen[4].add(player.n.progress[5].div(100).floor());
						player.n.progress[5]=player.n.progress[5].sub(player.n.progress[5].div(100).floor().mul(100));
					}
					if(player[this.layer].buyables[11].gte(60)){
						player.n.progress[6]=player.n.progress[6].add(player.points.add(10).log10().div(200).pow(2).mul(player.n.buyables[11].pow(player.n.buyables[11].gte(42)?1:0.5)).mul(layers.i.buyables[33].effect()).mul(player.n.gen[4].pow(0.2)).mul(player.n.gen[6].add(1)).mul(Math.random()*0.00002+0.00001).mul(diff));
						player.n.gen[5]=player.n.gen[5].add(player.n.progress[6].div(100).floor());
						player.n.progress[6]=player.n.progress[6].sub(player.n.progress[6].div(100).floor().mul(100));
					}
				}
				if(player[this.layer].buyables[11].gte(70)){
					player.n.progress[7]=player.n.progress[7].add(player.points.add(10).log10().div(200).pow(2).mul(player.n.buyables[11].pow(player.n.buyables[11].gte(42)?1:0.5)).mul(layers.i.buyables[33].effect()).mul(player.n.gen[5].pow(0.2)).mul(Math.random()*0.000002+0.000001).mul(diff));
					player.n.gen[6]=player.n.gen[6].add(player.n.progress[7].div(100).floor());
					player.n.progress[7]=player.n.progress[7].sub(player.n.progress[7].div(100).floor().mul(100));
				}
			}
		}
	},
	buyables:{
		11: {
			title: "基因突变", // Optional, displayed at the top in a larger font
			cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
				let cost = Decimal.pow(100,x).mul(1e45);
				if(x.gte(256))cost = Decimal.pow(100,x);
				if(hasUpgrade("y",24))cost = Decimal.pow(10,x);
				return cost
			},
			effect(x=player[this.layer].buyables[this.id]) { // Effects of owning x of the items, x is a decimal
				let eff = x.mul(0.001).add(0.005);
				return eff;
			},
			display() { // Everything else displayed in the buyable button after the title
				let data = tmp[this.layer].buyables[this.id]
				return "等级："+formatWhole(player[this.layer].buyables[this.id])+"\n\
				基于数米数量增加突变进度\n\
				花费：" + formatWhole(data.cost) + " 金币";
			},
			unlocked() { return true; }, 
			canAfford() {
				return player.p.points.gte(tmp[this.layer].buyables[this.id].cost)},
			buy() { 
				cost = tmp[this.layer].buyables[this.id].cost
				player.p.points = player.p.points.sub(cost)	
				player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
			},
                purchaseLimit: 9e15,
			style: {'height':'222px'},
		},
		12: {
			title: "基因重组", // Optional, displayed at the top in a larger font
			cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
				let cost = Decimal.pow(1e10,x.add(160));
				if(getTier().gte(90))cost = Decimal.pow(1e10,x.add(150));
				if(hasUpgrade("y",21))cost = Decimal.pow(1e10,x);
				return cost;
			},
			effect(x=player[this.layer].buyables[this.id]) { // Effects of owning x of the items, x is a decimal
				let eff = x.mul(layers.u.effect2()).add(1);
				return eff;
			},
			display() { // Everything else displayed in the buyable button after the title
				let data = tmp[this.layer].buyables[this.id]
				return "等级："+formatWhole(player[this.layer].buyables[this.id])+"\n\
				突变基因效果指数：^"+format(data.effect)+"\n\
				花费：" + formatWhole(data.cost) + " 金币";
			},
			unlocked() { return getTier().gte(80); }, 
			canAfford() {
				return player.p.points.gte(tmp[this.layer].buyables[this.id].cost)},
			buy() { 
				cost = tmp[this.layer].buyables[this.id].cost
				player.p.points = player.p.points.sub(cost)	
				player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
			},
                purchaseLimit: 9e15,
			style: {'height':'222px'},
		},
	},
	effect(){
		return player.n.points.div(player[this.layer].buyables[11].gte(13)?1:10).add(1).pow(layers[this.layer].buyables[12].effect());
	},
	effectDescription(){
		let data=tmp[this.layer];
		return "数米能力变为原来的"+format(data.effect)+"倍";
	},
	tabFormat: [
		"main-display",
		["display-text",function(){if(player[this.layer].buyables[11].gte(10))return "二级突变基因：" + formatWhole(player[this.layer].gen[0]);return "突变进度：" + format(player[this.layer].progress[0]) + "%";}],
		["display-text",function(){if(player[this.layer].buyables[11].gte(15))return "三级突变基因：" + formatWhole(player[this.layer].gen[1]);if(player[this.layer].buyables[11].gte(10))return "二级突变进度：" + format(player[this.layer].progress[1]) + "%";}],
		["display-text",function(){if(player[this.layer].buyables[11].gte(20))return "四级突变基因：" + formatWhole(player[this.layer].gen[2]);if(player[this.layer].buyables[11].gte(15))return "三级突变进度：" + format(player[this.layer].progress[2]) + "%";}],
		["display-text",function(){if(player[this.layer].buyables[11].gte(40))return "五级突变基因：" + formatWhole(player[this.layer].gen[3]);if(player[this.layer].buyables[11].gte(20))return "四级突变进度：" + format(player[this.layer].progress[3]) + "%";}],
		["display-text",function(){if(player[this.layer].buyables[11].gte(45))return "六级突变基因：" + formatWhole(player[this.layer].gen[4]);if(player[this.layer].buyables[11].gte(40))return "五级突变进度：" + format(player[this.layer].progress[4]) + "%";}],
		["display-text",function(){if(player[this.layer].buyables[11].gte(60))return "七级突变基因：" + formatWhole(player[this.layer].gen[5]);if(player[this.layer].buyables[11].gte(45))return "六级突变进度：" + format(player[this.layer].progress[5]) + "%";}],
		["display-text",function(){if(player[this.layer].buyables[11].gte(70))return "八级突变基因：" + formatWhole(player[this.layer].gen[6]);if(player[this.layer].buyables[11].gte(60))return "七级突变进度：" + format(player[this.layer].progress[6]) + "%";}],
		["display-text",function(){if(player[this.layer].buyables[11].gte(100))return "九级突变基因：" + formatWhole(player[this.layer].gen[7]);if(player[this.layer].buyables[11].gte(70))return "八级突变进度：" + format(player[this.layer].progress[7]) + "%";}],
		["display-text",function(){if(player[this.layer].buyables[11].gte(120))return "十级突变基因：" + formatWhole(player[this.layer].gen[8]);}],
		["display-text",function(){if(player[this.layer].buyables[11].gte(350))return "十一级突变基因：" + formatWhole(player[this.layer].gen[9]);}],
		["display-text",function(){if(player[this.layer].buyables[11].gte(555))return "十二级突变基因：" + formatWhole(player[this.layer].gen[10]);}],
		"buyables",
		"milestones",
	],
	milestones: [
		{
			requirementDescription: "基因突变10级",
            done() {return player[this.layer].buyables[11].gte(10)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "解锁二级突变基因。";
			},
        },
		{
			requirementDescription: "基因突变13级",
            done() {return player[this.layer].buyables[11].gte(13)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "突变基因效果更好。";
			},
        },
		{
			requirementDescription: "基因突变15级",
            done() {return player[this.layer].buyables[11].gte(15)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "解锁三级突变基因。";
			},
        },
		{
			requirementDescription: "基因突变18级",
            done() {return player[this.layer].buyables[11].gte(18)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "突变基因获取更好。";
			},
        },
		{
			requirementDescription: "基因突变20级",
            done() {return player[this.layer].buyables[11].gte(20)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "解锁四级突变基因。";
			},
        },
		{
			requirementDescription: "基因突变36级",
            done() {return player[this.layer].buyables[11].gte(36)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "二级、三级突变基因获取更好。";
			},
        },
		{
			requirementDescription: "基因突变40级",
            done() {return player[this.layer].buyables[11].gte(40)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "解锁五级突变基因。";
			},
        },
		{
			requirementDescription: "基因突变42级",
            done() {return player[this.layer].buyables[11].gte(42)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "基因突变购买项效果更好。";
			},
        },
		{
			requirementDescription: "基因突变45级",
            done() {return player[this.layer].buyables[11].gte(45)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "解锁六级突变基因。";
			},
        },
		{
			requirementDescription: "基因突变60级",
            done() {return player[this.layer].buyables[11].gte(60)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "解锁七级突变基因。";
			},
        },
		{
			requirementDescription: "基因突变64级",
            done() {return player[this.layer].buyables[11].gte(64)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "四级、五级突变基因获取更好。";
			},
        },
		{
			requirementDescription: "基因突变70级",
            done() {return player[this.layer].buyables[11].gte(70)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "解锁八级突变基因，并且二级、三级突变基因获取更好。";
			},
        },
		{
			requirementDescription: "基因突变72级",
            done() {return player[this.layer].buyables[11].gte(72)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "四级、五级突变基因获取更好。";
			},
        },
		{
			requirementDescription: "基因突变75级",
            done() {return player[this.layer].buyables[11].gte(75)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "六级、七级突变基因获取更好。";
			},
        },
		{
			requirementDescription: "基因突变90级",
            done() {return player[this.layer].buyables[11].gte(90)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "八级突变基因获取更好。";
			},
        },
		{
			requirementDescription: "基因突变100级",
            done() {return player[this.layer].buyables[11].gte(100)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "解锁九级突变基因。";
			},
        },
		{
			requirementDescription: "基因突变110级",
            done() {return player[this.layer].buyables[11].gte(110)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "基因突变购买项效果更好。";
			},
        },
		{
			requirementDescription: "基因突变115级",
            done() {return player[this.layer].buyables[11].gte(115)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "基因突变购买项效果更好。";
			},
        },
		{
			requirementDescription: "基因突变120级",
            done() {return player[this.layer].buyables[11].gte(120)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "解锁十级突变基因。";
			},
        },
		{
			requirementDescription: "基因突变175级",
            done() {return player[this.layer].buyables[11].gte(175)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "总计数米的数量进一步增加突变基因获取。";
			},
        },
		{
			requirementDescription: "基因突变200级",
            done() {return player[this.layer].buyables[11].gte(200)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "总计数米的数量进一步增加突变基因获取。";
			},
        },
		{
			requirementDescription: "基因突变256级",
            done() {return player[this.layer].buyables[11].gte(256)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "基因突变更便宜。";
			},
        },
		{
			requirementDescription: "基因突变350级",
            done() {return player[this.layer].buyables[11].gte(350)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "解锁十一级突变基因。";
			},
        },
		{
			requirementDescription: "基因突变555级",
            done() {return player[this.layer].buyables[11].gte(555)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "解锁十二级突变基因。";
			},
        },
		{
			requirementDescription: "基因突变777级",
            done() {return player[this.layer].buyables[11].gte(777)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "总计数米的数量进一步增加突变基因获取。";
			},
        },
		{
			requirementDescription: "基因突变800级",
            done() {return player[this.layer].buyables[11].gte(800)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "总计数米的数量进一步增加突变基因获取。";
			},
        },
		{
			requirementDescription: "基因突变888级",
            done() {return player[this.layer].buyables[11].gte(888)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "总计数米的数量进一步增加突变基因获取。";
			},
        },
		{
			requirementDescription: "基因突变1200级",
            done() {return player[this.layer].buyables[11].gte(1200)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "总计数米的数量进一步增加突变基因获取。";
			},
        },
		{
			requirementDescription: "基因突变1366级",
            done() {return player[this.layer].buyables[11].gte(1366)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "总计数米的数量进一步增加突变基因获取。";
			},
        },
		{
			requirementDescription: "基因突变1420级",
            done() {return player[this.layer].buyables[11].gte(1420)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "总计数米的数量进一步增加突变基因获取。";
			},
        },
	],
    layerShown(){return getRank().gte(200)},
	resetsNothing: true,
})


addLayer("i", {
    name: "I", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "无限", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#FFFFFF",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "无限点数", // Name of prestige currency
    baseResource: "金币", // Name of resource prestige is based on
    baseAmount() {return player.p.points}, // Get the current amount of baseResource
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1.5, // Prestige currency exponent
	base: 2,
    gainMult(a) { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(0)
		if(player.points.gte(Number.MAX_VALUE)){
			if(player.points.add(2).log2().sqrt().gte(600)){
				mult = Decimal.pow(2,player.points.add(2).log2().div(36).pow(0.25).mul(56.8).max(0)).sub(1);
			}else{
				mult = Decimal.pow(2,player.points.add(2).log2().sqrt().sub(32).max(0)).sub(1);
			}
		}
		if(player.p.best.gte(Number.MAX_VALUE)){
			mult = mult.mul(Decimal.pow(2,player.p.best.add(2).log2().sqrt().sub(32).max(0)));
		}
		if(getTier().gte(22)){
			if(player.n.points.add(2).log2().sqrt().gte(600)){
				mult = mult.mul(Decimal.pow(2,player.n.points.add(2).log2().div(36).pow(0.25).mul(56.8).max(0)));
			}else{
				mult = mult.mul(Decimal.pow(2,player.n.points.add(2).log2().sqrt().sub(32).max(0)));
			}
		}
		mult = mult.mul(layers.s.effect8());
		mult = mult.mul(layers.i.buyables[41].effect());
		mult = mult.mul(layers.et.buyables[12].effect());
		if(player.o.points.gte(10))mult = mult.mul(player.a.points.add(1));
		if(hasUpgrade("y",11))mult = mult.mul(100);
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 3, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
    ],
	branches: [],
	update(diff){
		player.i.points=player.i.points.add(layers.i.gainMult().mul(diff));
		if(getRank().gte(340)){
			player.i.buyables[11]=player.i.buyables[11].add(player.i.points.mul(diff));
			player.i.buyables[13]=player.i.buyables[13].add(player.i.points.mul(diff));
		}
		if(getRank().gte(350)){
			player.i.buyables[21]=player.i.buyables[21].add(player.i.points.mul(diff));
			player.i.buyables[23]=player.i.buyables[23].add(player.i.points.mul(diff));
		}
		if(getRank().gte(550)){
			player.i.buyables[12]=player.i.buyables[12].add(layers.i.BuyableGain2().mul(diff));
			player.i.buyables[22]=player.i.buyables[22].add(layers.i.BuyableGain2().mul(diff));
		}else if(getRank().gte(500)){
			let target=player.i.points.add(1).log(1.1).max(0).ceil();
			if(player.i.buyables[12].lte(target))player.i.buyables[12]=target;
			if(player.i.buyables[22].lte(target))player.i.buyables[22]=target;
		}
		if(player.x.points.gte(1048576)){
			let target=player.i.points.add(1).log(1.5).max(0).ceil();
			if(player.i.buyables[31].lte(target))player.i.buyables[31]=target;
			if(player.i.buyables[32].lte(target))player.i.buyables[32]=target;
			if(player.i.buyables[33].lte(target))player.i.buyables[33]=target;
		}
		if(player.x.points.gte(262144)){
			player.i.buyables[41]=player.i.buyables[41].add(layers.i.BuyableGain3().mul(diff));
		}
		if(player.x.points.gte(16777216)){
			player.i.buyables[33]=player.i.buyables[33].add(layers.i.BuyableGain4().mul(diff));
		}
		if(getRank().gte(60000)){
			player.i.buyables[32]=player.i.buyables[32].add(layers.i.BuyableGain6().mul(diff));
		}
		if(getRank().gte(200000)){
			player.i.buyables[31]=player.i.buyables[31].add(layers.i.BuyableGain6().mul(diff));
		}
	},
	buyables:{
		11: {
			title: "数米能力等级", // Optional, displayed at the top in a larger font
			cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
				let cost = new Decimal(1)
				return cost
			},
			effect(x=player[this.layer].buyables[this.id]) { // Effects of owning x of the items, x is a decimal
				let eff = Decimal.add(1, x)
				return eff;
			},
			display() { // Everything else displayed in the buyable button after the title
				let data = tmp[this.layer].buyables[this.id]
				return "等级："+formatWhole(player[this.layer].buyables[this.id])+"\n\
				数米能力等级变为原来的" + formatWhole(data.effect) + "倍\n" +
				((getRank().gte(340))?("+"+formatWhole(player.i.points)+"/s"):("花费：" + formatWhole(data.cost) + " 无限点数"));
			},
			unlocked() { return getRank().gte(301)}, 
			canAfford() {
				return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost) && getRank().lt(340)},
			buy() { 
				cost = tmp[this.layer].buyables[this.id].cost
				player[this.layer].points = player[this.layer].points.sub(cost)
				player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
				player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.add(cost) // This is a built-in system that you can use for respeccing but it only works with a single Decimal value
			},
                purchaseLimit: 9e15,
			style: {'height':'222px'},
		},
		12: {
			title: "自动数米等级", // Optional, displayed at the top in a larger font
			cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
				let cost = Decimal.pow(2, x)
				if(getRank().gte(420))cost = cost.min(Decimal.pow(1.35, x).mul(x.add(1)));
				if(getRank().gte(500))cost = Decimal.pow(1.1, x);
				return cost
			},
			effect(x=player[this.layer].buyables[this.id]) { // Effects of owning x of the items, x is a decimal
				let eff = Decimal.add(1, x)
				return eff;
			},
			display() { // Everything else displayed in the buyable button after the title
				let data = tmp[this.layer].buyables[this.id]
				return "等级："+formatWhole(player[this.layer].buyables[this.id])+"\n\
				自动数米等级变为原来的" + formatWhole(data.effect) + "倍\n" +
				((getRank().gte(550))?("+"+formatWhole(layers.i.BuyableGain2())+"/s"):("花费：" + formatWhole(data.cost) + " 无限点数"));
			},
			unlocked() { return getRank().gte(308)}, 
			canAfford() {
				return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost) && getRank().lt(550)},
			buy() { 
				cost = tmp[this.layer].buyables[this.id].cost
				if(getRank().lt(500))player[this.layer].points = player[this.layer].points.sub(cost)
				player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
				player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.add(cost) // This is a built-in system that you can use for respeccing but it only works with a single Decimal value
			},
                purchaseLimit: 9e15,
			style: {'height':'222px'},
		},
		13: {
			title: "数米加成等级", // Optional, displayed at the top in a larger font
			cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
				let cost = new Decimal(1)
				return cost
			},
			effect(x=player[this.layer].buyables[this.id]) { // Effects of owning x of the items, x is a decimal
				let eff = Decimal.add(1, x)
				return eff;
			},
			display() { // Everything else displayed in the buyable button after the title
				let data = tmp[this.layer].buyables[this.id]
				return "等级："+formatWhole(player[this.layer].buyables[this.id])+"\n\
				数米加成等级变为原来的" + formatWhole(data.effect) + "倍\n" +
				((getRank().gte(340))?("+"+formatWhole(player.i.points)+"/s"):("花费：" + formatWhole(data.cost) + " 无限点数"));
			},
			unlocked() { return getRank().gte(315)}, 
			canAfford() {
				return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost) && getRank().lt(340)},
			buy() { 
				cost = tmp[this.layer].buyables[this.id].cost
				player[this.layer].points = player[this.layer].points.sub(cost)
				player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
				player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.add(cost) // This is a built-in system that you can use for respeccing but it only works with a single Decimal value
			},
                purchaseLimit: 9e15,
			style: {'height':'222px'},
		},
		21: {
			title: "米袋升级等级", // Optional, displayed at the top in a larger font
			cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
				let cost = new Decimal(1)
				return cost
			},
			effect(x=player[this.layer].buyables[this.id]) { // Effects of owning x of the items, x is a decimal
				let eff = Decimal.add(1, x)
				return eff;
			},
			display() { // Everything else displayed in the buyable button after the title
				let data = tmp[this.layer].buyables[this.id]
				return "等级："+formatWhole(player[this.layer].buyables[this.id])+"\n\
				米袋升级等级变为原来的" + formatWhole(data.effect) + "倍\n" +
				((getRank().gte(350))?("+"+formatWhole(player.i.points)+"/s"):("花费：" + formatWhole(data.cost) + " 无限点数"));
			},
			unlocked() { return getRank().gte(321)}, 
			canAfford() {
				return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost) && getRank().lt(350)},
			buy() { 
				cost = tmp[this.layer].buyables[this.id].cost
				player[this.layer].points = player[this.layer].points.sub(cost)
				player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
				player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.add(cost) // This is a built-in system that you can use for respeccing but it only works with a single Decimal value
			},
                purchaseLimit: 9e15,
			style: {'height':'222px'},
		},
		22: {
			title: "自动数米加成等级", // Optional, displayed at the top in a larger font
			cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
				let cost = Decimal.pow(2, x)
				if(getRank().gte(420))cost = cost.min(Decimal.pow(1.35, x).mul(x.add(1)));
				if(getRank().gte(500))cost = Decimal.pow(1.1, x);
				return cost
			},
			effect(x=player[this.layer].buyables[this.id]) { // Effects of owning x of the items, x is a decimal
				let eff = Decimal.add(1, x)
				return eff;
			},
			display() { // Everything else displayed in the buyable button after the title
				let data = tmp[this.layer].buyables[this.id]
				return "等级："+formatWhole(player[this.layer].buyables[this.id])+"\n\
				自动数米加成等级变为原来的" + formatWhole(data.effect) + "倍\n" +
				((getRank().gte(550))?("+"+formatWhole(layers.i.BuyableGain2())+"/s"):("花费：" + formatWhole(data.cost) + " 无限点数"));
			},
			unlocked() { return getRank().gte(327)}, 
			canAfford() {
				return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost) && getRank().lt(550)},
			buy() { 
				cost = tmp[this.layer].buyables[this.id].cost
				if(getRank().lt(500))player[this.layer].points = player[this.layer].points.sub(cost)
				player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
				player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.add(cost) // This is a built-in system that you can use for respeccing but it only works with a single Decimal value
			},
                purchaseLimit: 9e15,
			style: {'height':'222px'},
		},
		23: {
			title: "米袋加成等级", // Optional, displayed at the top in a larger font
			cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
				let cost = new Decimal(1)
				return cost
			},
			effect(x=player[this.layer].buyables[this.id]) { // Effects of owning x of the items, x is a decimal
				let eff = Decimal.add(1, x)
				return eff;
			},
			display() { // Everything else displayed in the buyable button after the title
				let data = tmp[this.layer].buyables[this.id]
				return "等级："+formatWhole(player[this.layer].buyables[this.id])+"\n\
				米袋加成等级变为原来的" + formatWhole(data.effect) + "倍\n" +
				((getRank().gte(350))?("+"+formatWhole(player.i.points)+"/s"):("花费：" + formatWhole(data.cost) + " 无限点数"));
			},
			unlocked() { return getRank().gte(333)}, 
			canAfford() {
				return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost) && getRank().lt(350)},
			buy() { 
				cost = tmp[this.layer].buyables[this.id].cost
				player[this.layer].points = player[this.layer].points.sub(cost)
				player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
				player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.add(cost) // This is a built-in system that you can use for respeccing but it only works with a single Decimal value
			},
                purchaseLimit: 9e15,
			style: {'height':'222px'},
		},
		31: {
			title: "钻石获取", // Optional, displayed at the top in a larger font
			cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
				if(player.x.points.gte(1048576))return Decimal.pow(1.5,x)
				let cost = Decimal.pow(2, x).mul(10000)
				return cost
			},
			effect(x=player[this.layer].buyables[this.id]) { // Effects of owning x of the items, x is a decimal
				let eff = Decimal.add(1, x)
				return eff;
			},
			display() { // Everything else displayed in the buyable button after the title
				let data = tmp[this.layer].buyables[this.id]
				return "等级："+formatWhole(player[this.layer].buyables[this.id])+"\n\
				钻石获取变为原来的" + formatWhole(data.effect) + "倍\n" +
				((getRank().gte(200000))?("+"+formatWhole(layers.i.BuyableGain6())+"/s"):("花费：" + formatWhole(data.cost) + " 无限点数"));
			},
			unlocked() { return getRank().gte(375)}, 
			canAfford() {
				return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)},
			buy() { 
				cost = tmp[this.layer].buyables[this.id].cost
				player[this.layer].points = player[this.layer].points.sub(cost)
				player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
				player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.add(cost) // This is a built-in system that you can use for respeccing but it only works with a single Decimal value
			},
                purchaseLimit: 9e15,
			style: {'height':'222px'},
		},
		32: {
			title: "工作速度等级", // Optional, displayed at the top in a larger font
			cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
				if(player.x.points.gte(1048576))return Decimal.pow(1.5,x)
				let cost = Decimal.pow(2, x).mul(10000)
				return cost
			},
			effect(x=player[this.layer].buyables[this.id]) { // Effects of owning x of the items, x is a decimal
				let eff = Decimal.add(1, x)
				return eff;
			},
			display() { // Everything else displayed in the buyable button after the title
				let data = tmp[this.layer].buyables[this.id]
				return "等级："+formatWhole(player[this.layer].buyables[this.id])+"\n\
				工人工作速度等级变为原来的" + formatWhole(data.effect) + "倍\n" +
				((getRank().gte(60000))?("+"+formatWhole(layers.i.BuyableGain6())+"/s"):("花费：" + formatWhole(data.cost) + " 无限点数"));
			},
			unlocked() { return getRank().gte(385)}, 
			canAfford() {
				return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost) && getRank().lt(60000)},
			buy() { 
				cost = tmp[this.layer].buyables[this.id].cost
				player[this.layer].points = player[this.layer].points.sub(cost)
				player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
				player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.add(cost) // This is a built-in system that you can use for respeccing but it only works with a single Decimal value
			},
                purchaseLimit: 9e15,
			style: {'height':'222px'},
		},
		33: {
			title: "基因加成", // Optional, displayed at the top in a larger font
			cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
				if(player.x.points.gte(1048576))return Decimal.pow(1.5,x)
				let cost = Decimal.pow(2, x).mul(10000)
				return cost
			},
			effect(x=player[this.layer].buyables[this.id]) { // Effects of owning x of the items, x is a decimal
				let eff = Decimal.add(1, x)
				return eff;
			},
			display() { // Everything else displayed in the buyable button after the title
				let data = tmp[this.layer].buyables[this.id]
				return "等级："+formatWhole(player[this.layer].buyables[this.id])+"\n\
				基因突变速度变为原来的" + formatWhole(data.effect) + "倍\n" +
				((player.x.points.gte(16777216))?("+"+formatWhole(layers.i.BuyableGain4())+"/s"):("花费：" + formatWhole(data.cost) + " 无限点数"));
			},
			unlocked() { return getRank().gte(390)}, 
			canAfford() {
				return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost) && player.x.points.lt(16777216)},
			buy() { 
				cost = tmp[this.layer].buyables[this.id].cost
				player[this.layer].points = player[this.layer].points.sub(cost)
				player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
				player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.add(cost) // This is a built-in system that you can use for respeccing but it only works with a single Decimal value
			},
                purchaseLimit: 9e15,
			style: {'height':'222px'},
		},
		41: {
			title: "无限点数获取", // Optional, displayed at the top in a larger font
			cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
				if(x.gte(10000))x=x.pow(2).div(10000)
				if(x.gte(100))x=x.pow(2).div(100)
				let cost = Decimal.pow(x.add(1), 2).mul(1e40)
				return cost
			},
			effect(x=player[this.layer].buyables[this.id]) { // Effects of owning x of the items, x is a decimal
				let eff = Decimal.add(1, x)
				return eff;
			},
			display() { // Everything else displayed in the buyable button after the title
				let data = tmp[this.layer].buyables[this.id]
				return "等级："+formatWhole(player[this.layer].buyables[this.id])+"\n\
				无限点数获取变为原来的" + formatWhole(data.effect) + "倍\n" +
				((player.x.points.gte(262144))?("+"+formatWhole(layers.i.BuyableGain3())+"/s"):("花费：" + formatWhole(data.cost) + " 无限点数"));
			},
			unlocked() { return player.x.points.gte(65536)}, 
			canAfford() {
				return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost) && player.x.points.lt(262144)},
			buy() { 
				cost = tmp[this.layer].buyables[this.id].cost
				player[this.layer].points = player[this.layer].points.sub(cost)
				player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
				player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.add(cost) // This is a built-in system that you can use for respeccing but it only works with a single Decimal value
			},
                purchaseLimit: 9e15,
			style: {'height':'222px'},
		},
	},
	BuyableGain2(){
		if(getRank().gte(720))return player.i.points.add(10).log10().pow(player.i.points.add(10).log10().div(5).min(10));
		return player.i.points.add(10).log10().div(3).pow(2);
	},
	BuyableGain3(){
		if(player.i.points.gte("1e360"))return player.i.points.root(3);
		return player.i.points.div(1e40).root(2.5).min(1e120);
	},
	BuyableGain4(){
		if(getRank().gte(51000))return Decimal.pow(10,player.i.points.add(10).log10().sqrt());
		if(getRank().gte(40000))return Decimal.pow(2,player.i.points.add(2).log2().sqrt());
		return player.i.points.add(10).log10().div(100).pow(5);
	},
	BuyableGain6(){
		if(getRank().gte(1000000))return player.i.points.add(10).log10().div(200).pow(10);
		return player.i.points.add(10).log10().div(400).pow(10);
	},milestones: [
		{
			requirementDescription: "完成308个目标",
            done() {return getRank().gte(308)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "解锁第二个无限可购买项。";
			},
        },
		{
			requirementDescription: "完成315个目标",
            done() {return getRank().gte(315)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "解锁第三个无限可购买项。";
			},
        },
		{
			requirementDescription: "完成321个目标",
            done() {return getRank().gte(321)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "解锁第四个无限可购买项。";
			},
        },
		{
			requirementDescription: "完成327个目标",
            done() {return getRank().gte(327)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "解锁第五个无限可购买项。";
			},
        },
		{
			requirementDescription: "完成333个目标",
            done() {return getRank().gte(333)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "解锁第六个无限可购买项。";
			},
        },
		{
			requirementDescription: "完成340个目标",
            done() {return getRank().gte(340)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "每秒增加第1,3个无限可购买项的等级，增加的数值等同于无限点数，且不消耗无限点数。";
			},
        },
		{
			requirementDescription: "完成350个目标",
            done() {return getRank().gte(350)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "每秒增加第4,6个无限可购买项的等级，增加的数值等同于无限点数，且不消耗无限点数。";
			},
        },
		{
			requirementDescription: "完成365个目标",
            done() {return getRank().gte(365)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "游戏时间增加数米能力。";
			},
        },
		{
			requirementDescription: "完成375个目标",
            done() {return getRank().gte(375)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "解锁第七个无限可购买项。";
			},
        },
		{
			requirementDescription: "完成380个目标",
            done() {return getRank().gte(380)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "增加数米能力价格（钻石升级）的等级上限。";
			},
        },
		{
			requirementDescription: "完成385个目标",
            done() {return getRank().gte(385)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "解锁第八个无限可购买项。";
			},
        },
		{
			requirementDescription: "完成390个目标",
            done() {return getRank().gte(390)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "解锁第九个无限可购买项。";
			},
        },
		{
			requirementDescription: "完成395个目标",
            done() {return getRank().gte(395)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "米神提供更多加成。";
			},
        },
		{
			requirementDescription: "完成400个目标",
            done() {return getRank().gte(400)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "？？？";
			},
        },
		{
			requirementDescription: "完成420个目标",
            done() {return getRank().gte(420)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "第二个无限可购买项和第五个无限可购买项更便宜。";
			},
        },
		{
			requirementDescription: "完成440个目标",
            done() {return getRank().gte(440)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "增加金币返还（钻石升级）的等级上限。米袋加成更便宜。";
			},
        },
		{
			requirementDescription: "完成460个目标",
            done() {return getRank().gte(460)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "解锁阶层。";
			},
        },
		{
			requirementDescription: "完成500个目标",
            done() {return getRank().gte(500)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "第二个无限可购买项和第五个无限可购买项更便宜。<br>自动购买第二个无限可购买项和第五个无限可购买项，无需消耗无限点数。";
			},
        },
		{
			requirementDescription: "完成550个目标",
            done() {return getRank().gte(550)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "每秒增加第2,5个无限可购买项的等级，增加的数值基于无限点数，且不消耗无限点数。";
			},
        },
		{
			requirementDescription: "完成720个目标",
            done() {return getRank().gte(720)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "完成550个目标的里程碑效果更好。";
			},
        },
		{
			requirementDescription: "完成740个目标",
            done() {return getRank().gte(740)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "米神提供更多加成。";
			},
        },
		{
			requirementDescription: "完成800个目标",
            done() {return getRank().gte(800)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "米神提供更多加成。";
			},
        },
		{
			requirementDescription: "完成850个目标",
            done() {return getRank().gte(850)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "米神提供更多加成。";
			},
        },
	],
	effect(){
	},
	tabFormat: [
		"main-display",
		["display-text",function(){if(player[this.layer].points.lte(1000))return "确切来说，你有" + format(player[this.layer].points) + "无限点数";}],
		["display-text",function(){return "每秒获得" + format(tmp[this.layer].gainMult) + "无限点数";}],
		["display-text","前2行可购买项将会倍增金币可购买项的等级。"],
		"buyables",
		"milestones",
	],
    layerShown(){return getRank().gte(301)},
	resetsNothing: true,
})


addLayer("x", {
    name: "X", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "修仙", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 2, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#FFFFFF",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "修为", // Name of prestige currency
    baseResource: "金币", // Name of resource prestige is based on
    baseAmount() {return player.p.points}, // Get the current amount of baseResource
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1.5, // Prestige currency exponent
	base: 2,
    gainMult(a) { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(layers.i.gainMult()).mul(getRank().sub(399).max(0).sqrt().min(100)).add(100).log10().pow(2).div(4);
		if(mult.gte(64)){
			if(getTier().gte(19))mult = mult.mul(4).pow(1.5412735777995837194943431409894).add(mult.mul(300));
			else mult = mult.sub(64).mul(4).pow(1.5412735777995837194943431409894).add(mult);
		}
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 3, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
    ],
	branches: [],
	update(diff){
		if(getRank().lt(400))player.x.points=new Decimal(1);
		else player.x.points=layers.x.gainMult();
		if(player.x.points.gte(67108864)){
			let target=player.p.points.add(1).log10().max(0).ceil();
			if(player.g.buyables[11].lte(target))player.g.buyables[11]=target;
			target=player.p.points.add(1).log10().div(3).max(0).ceil();
			if(player.g.buyables[12].lte(target))player.g.buyables[12]=target;
			target=player.p.points.add(1).log10().div(5).max(0).ceil();
			if(player.g.buyables[13].lte(target))player.g.buyables[13]=target;
			target=player.p.points.add(1).log10().div(hasUpgrade("y",24)?1:2).max(0).ceil();
			if(player.n.buyables[11].lte(target))player.n.buyables[11]=target;
		}
		if(player.x.points.gte(268435456)){
			target=player.p.points.add(1).log10().div(10).sub(hasUpgrade("y",21)?0:getTier().gte(90)?150:160).max(0).ceil();
			if(player.n.buyables[12].lte(target))player.n.buyables[12]=target;
		}
	},
	effect(){
		return player.x.points;
	},
	effectDescription(){
		let data=tmp[this.layer];
		return "金币获取变为原来的"+format(data.effect)+"倍";
	},
	tabFormat: [
		"main-display",
		["display-text",function(){
			let p=player.x.points.log2().div(2).toNumber();
			let q=["凝气"];
			let r=["·起·","·承·","·转·","·合·"];
			let s=["一阶","二阶","三阶","四阶","五阶","六阶","七阶","八阶","九阶","十阶","十一阶","十二阶","十三阶","十四阶","十五阶","最终阶"];
			let str="，当前进度："+format((p%1)*100)+"%";
			p=Math.floor(p);
			str=s[p%16]+str;
			p=Math.floor(p/16);
			str=r[p%4]+str;
			p=Math.floor(p/4);
			str=q[p]+str;
			return "当前境界："+str;
		}],
		"milestones",
	],
	milestones: [
		{
			requirementDescription: "达到凝气·起·二阶",
            done() {return player.x.points.gte(4)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "修仙加成影响自动数米速度。";
			},
        },
		{
			requirementDescription: "达到凝气·起·三阶",
            done() {return player.x.points.gte(16)}, // Used to determine when to give the milestone
            effectDescription: function(){
				if(player.x.points.gte(1024))return "修仙加成影响吃米能力。";
				return "修仙加成影响数米能力和吃米能力。";
			},
        },
		{
			requirementDescription: "达到凝气·起·四阶",
            done() {return player.x.points.gte(64)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "修为获取更好。";
			},
        },
		{
			requirementDescription: "达到凝气·起·五阶",
            done() {return player.x.points.gte(256)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "修仙加成影响一级突变基因获取。";
			},
        },
		{
			requirementDescription: "达到凝气·起·六阶",
            done() {return player.x.points.gte(1024)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "修仙加成影响数米能力等级，但是禁用里程碑2的第1个效果。";
			},
        },
		{
			requirementDescription: "达到凝气·起·八阶",
            done() {return player.x.points.gte(16384)}, // Used to determine when to give the milestone
            effectDescription: function(){
				if(player.x.points.gte(4194304))return "修仙加成影响所有突变基因获取。";
				return "修仙加成影响三级突变基因获取。";
			},
        },
		{
			requirementDescription: "达到凝气·起·九阶",
            done() {return player.x.points.gte(65536)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "解锁第10个无限可购买项。";
			},
        },
		{
			requirementDescription: "达到凝气·起·十阶",
            done() {return player.x.points.gte(262144)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "每秒增加第10个无限可购买项的等级，增加的数值基于无限点数，且不消耗无限点数。";
			},
        },
		{
			requirementDescription: "达到凝气·起·十一阶",
            done() {return player.x.points.gte(1048576)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "第7-9个无限可购买项更便宜。<br>自动购买第7-9个无限可购买项，无需消耗无限点数。";
			},
        },
		{
			requirementDescription: "达到凝气·起·十二阶",
            done() {return player.x.points.gte(4194304)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "修仙里程碑6更好。";
			},
        },
		{
			requirementDescription: "达到凝气·起·十三阶",
            done() {return player.x.points.gte(16777216)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "每秒增加第9个无限可购买项的等级，增加的数值基于无限点数，且不消耗无限点数。";
			},
        },
		{
			requirementDescription: "达到凝气·起·十四阶",
            done() {return player.x.points.gte(67108864)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "自动购买工人升级和第1个基因可购买项，且不消耗金币。";
			},
        },
		{
			requirementDescription: "达到凝气·起·十五阶",
            done() {return player.x.points.gte(268435456)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "自动购买第2个基因可购买项，且不消耗金币。";
			},
        },
		{
			requirementDescription: "达到凝气·承·一阶",
            done() {return player.x.points.gte(Decimal.pow(4,16))}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "获得4倍永恒点数。";
			},
        },
	],
    layerShown(){return getRank().gte(400)},
	resetsNothing: true,
})


addLayer("r", {
    name: "R", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "阶层", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#FFFFFF",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "阶层", // Name of prestige currency
    baseResource: "金币", // Name of resource prestige is based on
    baseAmount() {return player.p.points}, // Get the current amount of baseResource
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1.5, // Prestige currency exponent
	base: 2,
    gainMult(a) { // Calculate the multiplier for main currency from bonuses
        return new Decimal(1)
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 3, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
    ],
	branches: [],
	update(diff){
		player.r.points=getTier();
	},
	tabFormat: [
		"main-display",
		["display-text",function(){if(player.r.points.gte(90))return "当前三重阶层："+formatWhole(getTier().div(10).sqrt().floor());}],
		["display-text",function(){return "下个阶层需要完成"+formatWhole(getTierRequirement(getTier().add(1)))+"个目标";}],
		"milestones",
	],
	milestones: [
		{
			requirementDescription: "阶层1",
            done() {return getTier().gte(1)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "自动购买钻石升级，钻石升级更便宜。";
			},
        },
		{
			requirementDescription: "阶层2",
            done() {return getTier().gte(2)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "阶层增加钻石获取。";
			},
        },
		{
			requirementDescription: "阶层3",
            done() {return getTier().gte(3)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "基因加成增加吃米能力。";
			},
        },
		{
			requirementDescription: "阶层4",
            done() {return getTier().gte(4)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "阶层增加数米能力。";
			},
        },
		{
			requirementDescription: "阶层5",
            done() {return getTier().gte(5)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "修改数米加成的效果。";
			},
        },
		{
			requirementDescription: "阶层6",
            done() {return getTier().gte(6)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "阶层增加自动数米速度。";
			},
        },
		{
			requirementDescription: "阶层7",
            done() {return getTier().gte(7)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "阶层增加金币获取。";
			},
        },
		{
			requirementDescription: "阶层8",
            done() {return getTier().gte(8)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "米神提供更多加成。";
			},
        },
		{
			requirementDescription: "阶层9",
            done() {return getTier().gte(9)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "米神提供更多加成。";
			},
        },
		{
			requirementDescription: "阶层10",
            done() {return getTier().gte(10)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "米神提供更多加成。";
			},
        },
		{
			requirementDescription: "阶层11",
            done() {return getTier().gte(11)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "增加完成目标获得的钻石数量。";
			},
        },
		{
			requirementDescription: "阶层14",
            done() {return getTier().gte(14)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "米神提供更多加成。";
			},
        },
		{
			requirementDescription: "阶层15",
            done() {return getTier().gte(15)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "米神提供更多加成。";
			},
        },
		{
			requirementDescription: "阶层16",
            done() {return getTier().gte(16)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "米神的帮助数米指数将会更高。";
			},
        },
		{
			requirementDescription: "阶层17",
            done() {return getTier().gte(17)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "解锁一个新的工人购买项。";
			},
        },
		{
			requirementDescription: "阶层18",
            done() {return getTier().gte(18)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "根据完成的米桶数增加数米能力等级，但是禁用完成4个目标里程碑的第二个效果。";
			},
        },
		{
			requirementDescription: "阶层19",
            done() {return getTier().gte(19)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "修为的获取更好。";
			},
        },
		{
			requirementDescription: "阶层20",
            done() {return getTier().gte(20)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "钻石升级更便宜。";
			},
        },
		{
			requirementDescription: "阶层21",
            done() {return getTier().gte(21)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "钻石升级更便宜，并且完成的米桶数和目标数对金币的加成更好。";
			},
        },
		{
			requirementDescription: "阶层22",
            done() {return getTier().gte(22)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "超过无限的一级突变基因加成无限点数。";
			},
        },
		{
			requirementDescription: "阶层23",
            done() {return getTier().gte(23)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "工作速度和工作质量更便宜。工作质量效果更好。";
			},
        },
		{
			requirementDescription: "阶层24",
            done() {return getTier().gte(24)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "工作协同更便宜。工作质量效果更好。";
			},
        },
		{
			requirementDescription: "阶层29",
            done() {return getTier().gte(29)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "工人更便宜。工作质量效果基于阶层更好。";
			},
        },
		{
			requirementDescription: "阶层30",
            done() {return getTier().gte(30)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "钻石升级根据阶层（至多60）更便宜。";
			},
        },
		{
			requirementDescription: "阶层40",
            done() {return getTier().gte(40)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "米神的帮助数米指数将会更高。";
			},
        },
		{
			requirementDescription: "阶层45",
            done() {return getTier().gte(45)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "米神的帮助数米指数将会更高。";
			},
        },
		{
			requirementDescription: "阶层50",
            done() {return getTier().gte(50)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "米神的帮助数米指数将会更高。";
			},
        },
		{
			requirementDescription: "阶层55",
            done() {return getTier().gte(55)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "米神的帮助数米指数将会更高。";
			},
        },
		{
			requirementDescription: "阶层57",
            done() {return getTier().gte(57)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "米神提供更多加成。";
			},
        },
		{
			requirementDescription: "阶层58",
            done() {return getTier().gte(58)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "米神提供更多加成。";
			},
        },
		{
			requirementDescription: "阶层60",
            done() {return getTier().gte(60)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "米神的帮助数米指数将会根据阶层更高。";
			},
        },
		{
			requirementDescription: "阶层64",
            done() {return getTier().gte(64)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "数米工人根据阶层（最多142）更便宜。";
			},
        },
		{
			requirementDescription: "阶层70",
            done() {return getTier().gte(70)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "数米工人的工作速度也会增加数米能力等级。";
			},
        },
		{
			requirementDescription: "阶层80",
            done() {return getTier().gte(80)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "解锁基因重组。";
			},
        },
		{
			requirementDescription: "阶层90",
            done() {return getTier().gte(90)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "基因重组更便宜。";
			},
        },
		{
			requirementDescription: "阶层100",
            done() {return getTier().gte(100)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "解锁土地。";
			},
        },
		{
			requirementDescription: "阶层144",
            done() {return getTier().gte(144)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "米神的第1个加成改为增加数米能力等级。";
			},
        },
		{
			requirementDescription: "阶层183",
            done() {return getTier().gte(183)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "米神提供更多加成。";
			},
        },
		{
			requirementDescription: "阶层250",
            done() {return getTier().gte(250)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "米神提供更多加成。";
			},
        },
		{
			requirementDescription: "阶层500",
            done() {return getTier().gte(500)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "根据阶层，第一行钻石升级和钻石升级“自动数米”更好。";
			},
        },
	],
    layerShown(){return getRank().gte(460)},
	resetsNothing: true,
})


addLayer("et", {
    name: "ET", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "永恒", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#FF66FF",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "永恒点数", // Name of prestige currency
    baseResource: "无限点数", // Name of resource prestige is based on
    baseAmount() {return player.i.points}, // Get the current amount of baseResource
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1.5, // Prestige currency exponent
	base: 2,
    gainMult(a) { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(0)
		if(player.i.points.gte(Number.MAX_VALUE)){
			mult = player.i.points.add(2).log2().div(1024).pow(2).sub(1);
		}
		mult = mult.mul(layers.et.buyables[13].effect());
		if(hasUpgrade("y",13))mult = mult.mul(5);
		if(hasUpgrade("y",35))mult = mult.mul(5);
		if(player.x.points.gte(Decimal.pow(4,16)))mult=mult.mul(4);
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 4, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
    ],
	branches: [],
	update(diff){
		player.et.points=player.et.points.add(layers.et.gainMult().mul(diff));
		player.et.buyables[11]=player.et.buyables[11].add(player.et.points.mul(diff));
		player.et.buyables[12]=player.et.buyables[12].add(player.et.points.mul(diff));
		if(getRank().gte(555555))player.et.buyables[21]=player.et.buyables[21].add(player.et.points.mul(diff));
	},
	buyables:{
		11: {
			title: "所有金币升级等级", // Optional, displayed at the top in a larger font
			cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
				let cost = new Decimal(1)
				return cost
			},
			effect(x=player[this.layer].buyables[this.id]) { // Effects of owning x of the items, x is a decimal
				let eff = Decimal.add(1, x)
				return eff;
			},
			display() { // Everything else displayed in the buyable button after the title
				let data = tmp[this.layer].buyables[this.id]
				return "等级："+formatWhole(player[this.layer].buyables[this.id])+"\n\
				所有金币升级等级变为原来的" + formatWhole(data.effect) + "倍\n" +
				("+"+format(player.et.points)+"/s");
			},
			unlocked() { return true;}, 
			canAfford() { return false;},
                purchaseLimit: 0,
			style: {'height':'222px'},
		},
		12: {
			title: "无限点数获取", // Optional, displayed at the top in a larger font
			cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
				let cost = new Decimal(1)
				return cost
			},
			effect(x=player[this.layer].buyables[this.id]) { // Effects of owning x of the items, x is a decimal
				let eff = Decimal.add(1, x)
				return eff;
			},
			display() { // Everything else displayed in the buyable button after the title
				let data = tmp[this.layer].buyables[this.id]
				return "等级："+formatWhole(player[this.layer].buyables[this.id])+"\n\
				无限点数获取变为原来的" + formatWhole(data.effect) + "倍\n" +
				("+"+format(player.et.points)+"/s");
			},
			unlocked() { return true;}, 
			canAfford() { return false;},
                purchaseLimit: 0,
			style: {'height':'222px'},
		},
		13: {
			title: "永恒点数获取", // Optional, displayed at the top in a larger font
			cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
				let cost = x.add(1).pow(3);
				return cost
			},
			effect(x=player[this.layer].buyables[this.id]) { // Effects of owning x of the items, x is a decimal
				let eff = Decimal.add(1, x)
				return eff;
			},
			display() { // Everything else displayed in the buyable button after the title
				let data = tmp[this.layer].buyables[this.id]
				return "等级："+formatWhole(player[this.layer].buyables[this.id])+"\n\
				永恒点数获取变为原来的" + formatWhole(data.effect) + "倍\n" +
				"花费：" + formatWhole(data.cost) + " 永恒点数";
			},
			unlocked() { return true;}, 
			canAfford() {
				return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)},
			buy() { 
				cost = tmp[this.layer].buyables[this.id].cost
				player[this.layer].points = player[this.layer].points.sub(cost)
				player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
				player[this.layer].spentOnBuyables = player[this.layer].spentOnBuyables.add(cost) // This is a built-in system that you can use for respeccing but it only works with a single Decimal value
			},
                purchaseLimit: 9e15,
			style: {'height':'222px'},
		},
		21: {
			title: "钻石加成", // Optional, displayed at the top in a larger font
			cost(x=player[this.layer].buyables[this.id]) { // cost for buying xth buyable, can be an object if there are multiple currencies
				let cost = new Decimal(1)
				return cost
			},
			effect(x=player[this.layer].buyables[this.id]) { // Effects of owning x of the items, x is a decimal
				let eff = Decimal.add(1, x)
				return eff;
			},
			display() { // Everything else displayed in the buyable button after the title
				let data = tmp[this.layer].buyables[this.id]
				return "等级："+formatWhole(player[this.layer].buyables[this.id])+"\n\
				钻石获取变为原来的" + formatWhole(data.effect) + "倍\n" +
				("+"+format(player.et.points)+"/s");
			},
			unlocked() { return getRank().gte(555555);}, 
			canAfford() { return false;},
                purchaseLimit: 0,
			style: {'height':'222px'},
		},
	},milestones: [
		{
			requirementDescription: "完成30000个目标",
            done() {return getRank().gte(30000)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "永恒点数增加所有突变基因获取。";
			},
        },
		{
			requirementDescription: "完成40000个目标",
            done() {return getRank().gte(40000)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "每秒增加第9个无限可购买项的等级，增加的数值基于无限点数，且不消耗无限点数。";
			},
        },
		{
			requirementDescription: "完成51000个目标",
            done() {return getRank().gte(51000)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "每秒增加第9个无限可购买项的等级，增加的数值基于无限点数，且不消耗无限点数。";
			},
        },
		{
			requirementDescription: "完成60000个目标",
            done() {return getRank().gte(60000)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "每秒增加第8个无限可购买项的等级，增加的数值基于无限点数，且不消耗无限点数。";
			},
        },
		{
			requirementDescription: "完成70000个目标",
            done() {return getRank().gte(70000)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "每秒增加所有金币升级的等级，增加的数值基于金币，且不消耗金币。";
			},
        },
		{
			requirementDescription: "完成200000个目标",
            done() {return getRank().gte(200000)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "每秒增加第7个无限可购买项的等级，增加的数值基于无限点数，且不消耗无限点数。";
			},
        },
		{
			requirementDescription: "完成555555个目标",
            done() {return getRank().gte(555555)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "解锁新的永恒可购买项。";
			},
        },
		{
			requirementDescription: "完成1000000个目标",
            done() {return getRank().gte(1000000)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "每秒增加第7-8个无限可购买项的等级，增加的数值基于无限点数，且不消耗无限点数。";
			},
        },
	],
	effect(){
	},
	tabFormat: [
		"main-display",
		["display-text",function(){if(player[this.layer].points.lte(1000))return "确切来说，你有" + format(player[this.layer].points) + "永恒点数";}],
		["display-text",function(){return "每秒获得" + format(tmp[this.layer].gainMult) + "永恒点数";}],
		"buyables",
		"milestones",
	],
    layerShown(){return player.i.points.gte(Number.MAX_VALUE)},
	resetsNothing: true,
})


addLayer("o", {
    name: "O", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "工厂", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 2, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#cccccc",
    requires(){
		if(hasUpgrade("y",32))return new Decimal(200);
		return new Decimal(300);
	}, // Can be a function that takes requirement increases into account
    resource: "数米工厂", // Name of prestige currency
    baseResource: "数米工人", // Name of resource prestige is based on
    baseAmount() {return player.g.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent(){
		return new Decimal(1.5);
	},  // Prestige currency exponent
	base: 1.01,
    gainMult(a) { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
    ],
	branches: ['p'],
	update(diff){
		if(player[this.layer].points.gte(4))player.g.buyables[11]=player.g.buyables[11].add(player.p.points.log10().pow(hasUpgrade("y",25)?3:2).div(hasUpgrade("y",22)?1:10000).mul(diff));
	},
	effect1(){
		return Decimal.pow(2,player.o.points);
	},
	effect2(){
		
	},
	effectDescription(){
		let data=tmp[this.layer];
		return "工作速度等级变为原来的"+format(data.effect1)+"倍";
	},
	tabFormat: [
		"main-display",
		"prestige-button",
		"resource-display",
		["display-text","本层级不会重置任何东西。"],"buyables",
		"milestones",
	],
    layerShown(){return player.g.points.gte(300)},
	
	resetsNothing: true,
	roundUpCost: true,milestones: [
		{
			requirementDescription: "拥有4个工厂",
            done() {return player[this.layer].points.gte(4)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "每秒增加工作速度的等级，增加的数值基于金币，且不消耗金币。";
			},
        },
		{
			requirementDescription: "拥有6个工厂",
            done() {return player[this.layer].points.gte(6)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "让其中一个工厂转而生产米袋，使米袋倍数乘以工厂的数量。";
			},
        },
		{
			requirementDescription: "拥有7个工厂",
            done() {return player[this.layer].points.gte(7)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "让其中一个工厂转而生产钻石，使钻石乘以工厂的数量。";
			},
        },
		{
			requirementDescription: "拥有30个工厂",
            done() {return player[this.layer].points.gte(30)}, // Used to determine when to give the milestone
            effectDescription: function(){
				return "工作速度的加成基于工人更好。";
			},
        },
	],
})


addLayer("u", {
    name: "U", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "土地", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#996633",
    requires(){
		if(hasUpgrade("y",31))return new Decimal("1e1400");
		return new Decimal("1e1920");
	}, // Can be a function that takes requirement increases into account
    resource: "块土地", // Name of prestige currency
    baseResource: "金币", // Name of resource prestige is based on
    baseAmount() {return player.p.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent(){
		return new Decimal(1.5);
	},  // Prestige currency exponent
	base: 1e10,
    gainMult(a) { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
    ],
	branches: ['p'],
	update(diff){
		
	},
	effect1(){
		return Decimal.pow(10,player.u.points);
	},
	effect2(){
		return player.u.points.mul(0.001).add(0.01);
	},
	effectDescription(){
		let data=tmp[this.layer];
		return "基因突变速度变为原来的"+format(data.effect1)+"倍，基因重组的效果变为每级+"+format(data.effect2);
	},
	tabFormat: [
		"main-display",
		"prestige-button",
		"resource-display",
		["display-text","本层级不会重置任何东西。"],"buyables",
		"milestones",
	],
    layerShown(){return getTier().gte(100)},
	
	resetsNothing: true,
	milestones: [
	],
})


addLayer("y", {
    name: "Y", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "科技", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#FFFF00",
    requires(){
		return new Decimal("1e2000");
	}, // Can be a function that takes requirement increases into account
    resource: "科技点", // Name of prestige currency
    baseResource: "金币", // Name of resource prestige is based on
    baseAmount() {return player.p.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent(){
		return new Decimal(1.25);
	},  // Prestige currency exponent
	base: 1e50,
    gainMult(a) { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
    ],
	branches: ['p'],
	update(diff){
		
	},
	effect1(){
		//return Decimal.pow(10,player.u.points);
	},
	effect2(){
		//return player.u.points.mul(0.001).add(0.01);
	},
	effectDescription(){
		//let data=tmp[this.layer];
		//return "基因突变速度变为原来的"+format(data.effect1)+"倍，基因重组的效果变为每级+"+format(data.effect2);
	},
	tabFormat: [
		"main-display",
		"prestige-button",
		"resource-display",
		["display-text","本层级不会重置任何东西。购买升级后该升级所在行的其他升级价格提升。"],"upgrades",
		"milestones",
	],
    layerShown(){return player.u.points.gte(1)},
	resetsNothing: true,
	upgrades:{
		11:{
			title: "无限加成 I",
			description(){
				return "获得100倍无限点数。"
			},
			cost(){
				if(hasUpgrade("y",14)&&hasUpgrade("y",15))return new Decimal(5);
				if(hasUpgrade("y",14)||hasUpgrade("y",15))return new Decimal(4);
				if(hasUpgrade("y",13))return new Decimal(3);
				if(hasUpgrade("y",12))return new Decimal(2);
				return new Decimal(1);
			},
			unlocked() { return true; }, // The upgrade is only visible when this is true
		},
		12:{
			title: "自动化 I",
			description(){
				return "自动获得工人。"
			},
			cost(){
				if(hasUpgrade("y",14)&&hasUpgrade("y",15))return new Decimal(7);
				if(hasUpgrade("y",14)||hasUpgrade("y",15))return new Decimal(6);
				if(hasUpgrade("y",13))return new Decimal(5);
				return new Decimal(4);
			},
			unlocked() { return hasUpgrade("y",11); }, // The upgrade is only visible when this is true
		},
		13:{
			title: "永恒加成 I",
			description(){
				return "获得5倍永恒点数。"
			},
			cost(){
				if(hasUpgrade("y",14)&&hasUpgrade("y",15))return new Decimal(9);
				if(hasUpgrade("y",14)||hasUpgrade("y",15))return new Decimal(8);
				return new Decimal(7);
			},
			unlocked() { return hasUpgrade("y",12); }, // The upgrade is only visible when this is true
		},
		14:{
			title: "钻石加成 I",
			description(){
				return "钻石升级“数米能力”的效果改为增加数米能力等级。"
			},
			cost(){
				if(hasUpgrade("y",15))return new Decimal(12);
				return new Decimal(11);
			},
			unlocked() { return hasUpgrade("y",13); }, // The upgrade is only visible when this is true
		},
		15:{
			title: "米神加成 I",
			description(){
				return "米神提供更多加成。"
			},
			cost(){
				if(hasUpgrade("y",14))return new Decimal(12);
				return new Decimal(11);
			},
			unlocked() { return hasUpgrade("y",13); }, // The upgrade is only visible when this is true
		},
		21:{
			title: "基因加成 I",
			description(){
				return "基因重组更便宜。"
			},
			cost(){
				if(hasUpgrade("y",24)&&hasUpgrade("y",25))return new Decimal(6);
				if(hasUpgrade("y",24)||hasUpgrade("y",25))return new Decimal(5);
				if(hasUpgrade("y",23))return new Decimal(4);
				if(hasUpgrade("y",22))return new Decimal(3);
				return new Decimal(2);
			},
			unlocked() { return true; }, // The upgrade is only visible when this is true
		},
		22:{
			title: "工人加成 I",
			description(){
				return "工作速度等级增长速度更快。"
			},
			cost(){
				if(hasUpgrade("y",24)&&hasUpgrade("y",25))return new Decimal(6);
				if(hasUpgrade("y",24)||hasUpgrade("y",25))return new Decimal(5);
				if(hasUpgrade("y",23))return new Decimal(4);
				if(hasUpgrade("y",21))return new Decimal(3);
				return new Decimal(2);
			},
			unlocked() { return true; }, // The upgrade is only visible when this is true
		},
		23:{
			title: "米袋超加成 I",
			description(){
				return "米袋加成更好。"
			},
			cost(){
				if(hasUpgrade("y",24)&&hasUpgrade("y",25))return new Decimal(11);
				if(hasUpgrade("y",24)||hasUpgrade("y",25))return new Decimal(10);
				return new Decimal(9);
			},
			unlocked() { return hasUpgrade("y",21)&&hasUpgrade("y",22); }, // The upgrade is only visible when this is true
		},
		24:{
			title: "基因加成 II",
			description(){
				return "基因突变更便宜。"
			},
			cost(){
				if(hasUpgrade("y",25))return new Decimal(14);
				return new Decimal(13);
			},
			unlocked() { return hasUpgrade("y",23); }, // The upgrade is only visible when this is true
		},
		25:{
			title: "工人加成 II",
			description(){
				return "工作速度等级增长速度更快。"
			},
			cost(){
				if(hasUpgrade("y",24))return new Decimal(14);
				return new Decimal(13);
			},
			unlocked() { return hasUpgrade("y",23); }, // The upgrade is only visible when this is true
		},
		31:{
			title: "土地加成 I",
			description(){
				return "土地更便宜。"
			},
			cost(){
				if(hasUpgrade("y",35))return new Decimal(9);
				if(hasUpgrade("y",34))return new Decimal(8);
				if(hasUpgrade("y",33))return new Decimal(7);
				if(hasUpgrade("y",32))return new Decimal(6);
				return new Decimal(5);
			},
			unlocked() { return true; }, // The upgrade is only visible when this is true
		},
		32:{
			title: "工厂加成 I",
			description(){
				return "工厂更便宜。"
			},
			cost(){
				if(hasUpgrade("y",35))return new Decimal(9);
				if(hasUpgrade("y",34))return new Decimal(8);
				if(hasUpgrade("y",33))return new Decimal(7);
				if(hasUpgrade("y",31))return new Decimal(6);
				return new Decimal(5);
			},
			unlocked() { return true; }, // The upgrade is only visible when this is true
		},
		33:{
			title: "吃米加成 I",
			description(){
				return "所有吃米购买项的等级每秒增加金币的数量。"
			},
			cost(){
				if(hasUpgrade("y",35))return new Decimal(12);
				if(hasUpgrade("y",34))return new Decimal(11);
				return new Decimal(10);
			},
			unlocked() { return hasUpgrade("y",31)&&hasUpgrade("y",32); }, // The upgrade is only visible when this is true
		},
		34:{
			title: "目标加成 I",
			description(){
				return "完成10个目标的里程碑效果更好。"
			},
			cost(){
				if(hasUpgrade("y",35))return new Decimal(16);
				return new Decimal(15);
			},
			unlocked() { return hasUpgrade("y",33); }, // The upgrade is only visible when this is true
		},
		35:{
			title: "永恒加成 II",
			description(){
				return "获得5倍永恒点数。"
			},
			cost(){
				return new Decimal(16);
			},
			unlocked() { return hasUpgrade("y",34); }, // The upgrade is only visible when this is true
		},
	},
	milestones: [
	],
})

